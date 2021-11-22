/* eslint-disable import/no-unused-modules */

import browser from "webextension-polyfill";

const pageScriptTag = document.createElement("script");

pageScriptTag.src = browser.runtime.getURL("pageContentScript.bundle.js");
document.body.append(pageScriptTag);
