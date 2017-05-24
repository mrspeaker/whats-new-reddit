/* global Settings */

function saveOptions(e) {
  e.preventDefault();
  Settings.save({
    refreshTime: parseInt(document.querySelector("#refresh").value, 10)
  });
}

function restoreOptions() {
  Settings.fetch().then(res => {
    document.querySelector("#refresh").value = res.refreshTime || 60;
  });
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
