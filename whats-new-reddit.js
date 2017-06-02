/* global Settings */
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel) || []);
const $ = (sel, ctx) => $$(sel, ctx)[0];
const pruneSubsAfter = 1.5 * 24 * 60 * 60 * 1000; // prune every couple of days
const prunePostsAfter = 60 * 60 * 1000; // buffer when posts drop-off/return

let knightrider = false;
let refreshTime = Settings.defaults.refreshTime * 1000;
let colours = Settings.defaults.colours;

let running = true;
let lastRefresh = Date.now();
let focusTimerId;

// Get things started
Settings.fetch()
  .then(applySettings)
  .then(letsDoThis);

function applySettings(res = {}) {
  if (res.refreshTime) {
    refreshTime = Math.max(3000, res.refreshTime * 1000);
  }
  if (res.colours) {
    Object.entries(res.colours).forEach(([key, val]) => (colours[key] = val));
  }
  if (!res.knightridered) {
    knightrider = true;
  }
}

function letsDoThis() {
  const storedPosts = fetchFromStorage();
  const posts = getAndParsePosts();
  if (!posts.length) return;

  // Initial "plugin is installed" effect
  if (knightrider) {
    doKnightRider(posts);
  }

  // Update current page with any local storage info
  if (storedPosts.length) {
    posts.forEach(p => highlightUpdates(p, storedPosts));
    pruneOldPostsFromStorage();
  }

  // Add progress bar graphic
  const ctx = addProgressBar(posts[0].get("el"));

  // Poll for changes
  setInterval(() => {
    const dt = Date.now() - lastRefresh;
    const perc = Math.max(0, Math.min(1, dt / refreshTime));
    updateProgressBar(ctx, perc);

    if (running && dt > refreshTime) {
      update(posts);
    }
  }, 1000);

  handleWindowFocus(hasFocus => {
    clearTimeout(focusTimerId);
    if (hasFocus) {
      // Wait a bit, in case you're just tabbing though...
      focusTimerId = setTimeout(() => (running = true), 1500);
    } else {
      running = false;
    }
  });
}

function updateProgressBar(ctx, perc) {
  const progress = 1 - perc;
  const { width, height } = ctx.canvas;
  ctx.clearRect(0, 0, width + 1, height + 1);
  ctx.fillRect(0, 0, (width * progress) | 0, height);
  ctx.strokeRect((width * progress) | 0, 0, 0, height);
}

function update(currentPosts) {
  lastRefresh = Date.now();
  getPageDOM().then(getAndParsePosts).then(posts => {
    const prev = [...currentPosts];
    posts.forEach((p, i) => {
      p.set("rank", i);
      const cur = currentPosts[i];
      const curEl = cur.get("el");
      const postEl = p.get("el");
      curEl.parentNode.replaceChild(postEl, curEl);
      currentPosts[i] = p;
      highlightUpdates(p, prev);
    });
  });
}

function deserialize() {
  return JSON.parse(window.localStorage.getItem("diffs"));
}

function serialize(obj) {
  window.localStorage.setItem("diffs", JSON.stringify(obj));
  return obj;
}

function saveToStorage(posts) {
  const now = Date.now();
  const newPosts = posts.map(post => {
    return [
      ["fullname", post.get("fullname")],
      ["comments", post.get("comments")],
      ["timestamp", now]
    ];
  });
  const getKey = ([fullname]) => fullname[1];
  const makeMapEntry = arr => (arr.length ? [getKey(arr), arr] : arr);

  const stored = deserialize();
  const subReddit = stored[window.location];
  const existingPosts = subReddit ? subReddit.posts : [];
  const merged = new Map([
    ...existingPosts.map(makeMapEntry),
    ...newPosts.map(makeMapEntry)
  ]);
  const flattened = [...merged].map(([, val]) => val);
  stored[window.location] = {
    posts: flattened,
    timestamp: now
  };
  serialize(stored);
}

function fetchFromStorage() {
  let diffs = deserialize();
  if (!diffs) {
    diffs = serialize({}); // init empty store
  }

  // Prune subreddits and comments older than X
  let pruned = false;
  for (let key in diffs) {
    const subReddit = diffs[key];
    if (Date.now() - subReddit.timestamp > pruneSubsAfter) {
      delete diffs[key];
      pruned = true;
    }
  }

  if (pruned) {
    serialize(diffs);
  }

  const saved = diffs[window.location];
  return saved ? saved.posts.map(p => new Map(p)) : [];
}

/*
  Because posts can frequently "drop-off" a page, and then return,
  we store all posts in localstorage. This would quickly add up to
  a lot of posts, so purge them after a while.
*/
function pruneOldPostsFromStorage() {
  let pruned = false;
  const diffs = deserialize();
  const saved = diffs[window.location];
  saved.posts = saved.posts.filter(([, , timestamp]) => {
    const age = Date.now() - parseInt(timestamp[1], 10);
    const isOld = age > prunePostsAfter;
    if (isOld) {
      pruned = true;
    }
    return !isOld;
  });
  if (pruned) {
    serialize(diffs);
  }
}

function getPostsDOM(el) {
  const table = $("#siteTable", el);
  return table ? $$(".link", table) : [];
}

function parsePostDOM(postDOM, i) {
  const data = new Map();
  for (let k in postDOM.dataset) {
    data.set(k, postDOM.dataset[k]);
  }
  data.set("el", postDOM);
  const commentsText = $(".comments", postDOM).textContent;
  const comments = parseInt(commentsText, 10) || 0;
  data.set("comments", comments);
  data.set("rank", i);
  return data;
}

function getAndParsePosts(el = document) {
  const posts = getPostsDOM(el).map(parsePostDOM);
  // If only 1, it's a comment page.
  if (posts.length <= 1) {
    return [];
  }
  saveToStorage(posts);
  return posts;
}

function getPageDOM() {
  return fetch(window.location, { credentials: "same-origin" })
    .then(r => r.text())
    .then(r => {
      const div = document.createElement("div");
      div.innerHTML = r;
      return div;
    });
}

function highlightUpdates(post, prevPosts) {
  const el = post.get("el");
  const prev = prevPosts.find(
    pp => pp.get("fullname") === post.get("fullname")
  );

  if (!prev) {
    // New post
    el.style.borderLeft = `2px solid ${colours.newPost}`;
    return;
  }

  if (post.get("comments") !== prev.get("comments")) {
    const diff = post.get("comments") - prev.get("comments");
    const commentEl = $(".comments", el);
    commentEl.textContent += ` (${Math.sign(diff) === 1 ? "+" : ""}${diff})`;
  }
}

function addProgressBar(beforeEl) {
  const can = document.createElement("canvas");
  can.width = 30;
  can.height = 8;
  can.addEventListener("click", () => {
    lastRefresh = Date.now() - refreshTime;
  });
  can.style.cursor = "pointer";

  const ctx = can.getContext("2d");
  ctx.fillStyle = colours.progress;
  ctx.strokeStyle = colours.progressEdge;
  updateProgressBar(ctx, -0.5); // hide the right line xD
  beforeEl.parentNode.insertBefore(can, beforeEl);
  return ctx;
}

function handleWindowFocus(onToggle) {
  // From MDN docs
  let hidden, visibilityChange;
  if (typeof document.hidden !== "undefined") {
    hidden = "hidden";
    visibilityChange = "visibilitychange";
  } else if (typeof document.msHidden !== "undefined") {
    hidden = "msHidden";
    visibilityChange = "msvisibilitychange";
  } else if (typeof document.webkitHidden !== "undefined") {
    hidden = "webkitHidden";
    visibilityChange = "webkitvisibilitychange";
  }
  if (typeof document[hidden] === "undefined") {
    return; // Things will update, even in background
  }

  document.addEventListener(visibilityChange, () =>
    onToggle(!document[hidden])
  );
}

function doKnightRider(posts) {
  Settings.save({
    knightridered: true
  });

  setTimeout(() => {
    posts.forEach((p, i) => {
      const el = p.get("el");
      const border = el.style.borderLeft;
      el.style.borderLeft = "2px solid transparent";
      setTimeout(() => {
        el.style.borderLeft = `2px solid ${colours.newPost}`;
        setTimeout(() => {
          el.style.borderLeft = border || "2px solid transparent";
        }, 1200);
      }, (i + 1) * 60);
    });
  }, 1500);
}
