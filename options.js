function saveOptions(e) {
  (window.browser || window.chrome).storage.sync.set({
    refreshTime: parseInt(document.querySelector("#refresh").value, 10)
  });
  e.preventDefault();
}

function restoreOptions() {
  const then = res => document.querySelector("#refresh").value = res.refreshTime || 60;
  if (window.browser) {
    window.browser.storage.sync.get("refreshTime").then(then);
  } else {
    window.chrome.storage.sync.get("refreshTime", then);
  }
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
