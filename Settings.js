/* global browser, chrome */
/*eslint no-unused-vars: 0*/
const Settings = {
  fetch() {
    return new Promise(res => {
      if (typeof browser !== "undefined") {
        browser.storage.sync.get(null).then(res);
      } else {
        chrome.storage.sync.get(null, res);
      }
    });
  },
  save(options) {
    const b = typeof browser === "undefined" ? chrome : browser;
    b.storage.sync.set(options);
  }
};
