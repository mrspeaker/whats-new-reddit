/* global Settings */
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel) || []);
const $ = (sel, ctx) => $$(sel, ctx)[0];
let timerId;

function showMsg(msg) {
  clearTimeout(timerId);
  $("#msg").textContent = msg;
  timerId = setTimeout(() => {
    $("#msg").textContent = "";
  }, 1000);
}

function saveOptions(e) {
  e.preventDefault();

  const colours = Object.keys(Settings.defaults.colours)
    .map(id => ([id, $(`#${id}`).value]))
    .reduce((o, [key, val]) => {
      o[key] = val;
      return o;
    }, {});

  Settings.save({
    refreshTime: Math.max(3, parseInt($("#refresh").value, 10)),
    colours
  });

  showMsg("Saved.");
}

function restoreOptions() {
  Object.entries(Settings.defaults.colours)
    .forEach(([key, val]) => $(`#${key}`).value = val);
  Settings.fetch().then(res => {
    $("#refresh").value = res.refreshTime || 60;
    if (res.colours) {
      Object.entries(res.colours)
        .forEach(([key, val]) => $(`#${key}`).value = val);
    }
  });
}

function resetOptions(e) {
  e.preventDefault();
  Settings.save(Settings.defaults);
  restoreOptions();
  showMsg("Restored.");
}

document.addEventListener("DOMContentLoaded", restoreOptions);
$("form").addEventListener("submit", saveOptions);
$("#btnReset").addEventListener("click", resetOptions);
