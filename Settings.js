/* global browser, chrome */
/* eslint no-unused-vars: 0 */
const Settings = {
  fetch() {
    return new Promise(res => {
      if (typeof browser !== "undefined") {
        browser.storage.local.get(null).then(res);
      } else {
        chrome.storage.local.get(null, res);
      }
    });
  },
  save(options) {
    const b = typeof browser === "undefined" ? chrome : browser;
    b.storage.local.set(options);
  }
};
