const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel) || []);
const $ = (sel, ctx) => $$(sel, ctx)[0];

//browser.storage.sync.get("refresh").then(res=>...

const refreshTime = 60000;
const pruneLocalStorageAfter = 1.5 * 24 * (60 * 60 * 1000); // prune every couple of days

let running = true;
let lastRefresh = Date.now();
let focusTimerId;

function letsDoThis() {
  const storedPosts = fetchFromLocalStorage();
  const posts = getAndParsePosts();
  if (!posts.length) return;

  // Update current page with any local storage info
  if (storedPosts.length) {
    posts.forEach(p => highlightUpdates(p, storedPosts));
  }

  // Add settings/info button
  const onLoading = () => button.textContent = ". . .";
  const button = addOnOffButton(posts[0].get("el"));

  // Poll for changes
  setInterval(() => {
    const dt = Date.now() - lastRefresh;
    const numStars = 6;
    const stars = Math.max(0, (numStars - (dt / refreshTime) * numStars) | 0);
    button.textContent = new Array(stars).fill(".").join("") + " ";
    if (running && dt > refreshTime) {
      update(posts, onLoading);
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

function update(currentPosts, onLoading) {
  onLoading(true);
  lastRefresh = Date.now();
  getPageDOM().then(getAndParsePosts).then(posts => {
    onLoading(false);
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

function saveToLocalStorage(posts) {
  const store = window.localStorage;
  if (!store) return;
  const kvPosts = posts.map(post => {
    return [
      ["fullname", post.get("fullname")],
      ["comments", post.get("comments")]
    ];
  });

  const diffs = JSON.parse(store.getItem("diffs"));
  diffs[window.location] = {
    posts: kvPosts,
    timestamp: Date.now()
  };
  store.setItem("diffs", JSON.stringify(diffs));
}

function fetchFromLocalStorage() {
  const store = window.localStorage;
  if (!store) return;
  if (!store.getItem("diffs")) {
    // Init if not set
    store.setItem("diffs", JSON.stringify({}));
  }
  const diffs = JSON.parse(store.getItem("diffs"));

  // Prune sites older than X
  let pruned = false;
  for (let key in diffs) {
    if (Date.now() - diffs[key].timestamp > pruneLocalStorageAfter) {
      delete diffs[key];
      pruned = true;
    }
  }
  if (pruned) {
    store.setItem("diffs", JSON.stringify(diffs));
  }

  // Return posts for current URL
  const saved = diffs[window.location];
  return saved ? (saved.posts || []).map(p => new Map(p)) : [];
}

function addOnOffButton(beforeEl) {
  const but = document.createElement("span");
  but.textContent = "@mrspeaker";
  but.style.cursor = "pointer";
  but.style.color = "#555";
  but.style.font = "7pt monospace";
  but.addEventListener("click", () => {
    lastRefresh = Date.now() - refreshTime;
  });
  beforeEl.parentNode.insertBefore(but, beforeEl);
  return but;
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
  saveToLocalStorage(posts);
  return posts;
}

function getPageDOM() {
  return fetch(window.location, {
    credentials: "same-origin"
  })
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
    el.style.borderLeft = "2px solid #FF6600";
    return;
  }

  if (post.get("comments") !== prev.get("comments")) {
    const diff = post.get("comments") - prev.get("comments");
    const commentEl = $(".comments", el);
    commentEl.textContent += ` (${Math.sign(diff) === 1 ? "+" : ""}${diff})`;
  }
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

letsDoThis();
