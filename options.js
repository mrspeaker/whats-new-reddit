/* global browser */
function saveOptions(e) {
  browser.storage.sync.set({
    refreshTime: parseInt(document.querySelector("#refresh").value, 10)
  });
  e.preventDefault();
}

function restoreOptions() {
  browser.storage.sync.get("refresh").then(res => {
    document.querySelector("#refresh").value = res.refreshTime || 60;
  });
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
