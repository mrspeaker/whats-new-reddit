/* global Settings */
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel) || []);
const $ = (sel, ctx) => $$(sel, ctx)[0];
let timerId;

function saveOptions(e) {
  e.preventDefault();
  Settings.save({
    refreshTime: Math.max(3, parseInt($("#refresh").value, 10))
  });
  clearTimeout(timerId);
  $("#msg").textContent = "saved.";
  timerId = setTimeout(() => {
    $("#msg").textContent = "";
  }, 1000);
}

function restoreOptions() {
  Settings.fetch().then(res => {
    $("#refresh").value = res.refreshTime || 60;
  });
}

document.addEventListener("DOMContentLoaded", restoreOptions);
$("form").addEventListener("submit", saveOptions);
