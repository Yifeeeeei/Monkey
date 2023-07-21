// ==UserScript==
// @name         csdn_free_copy
// @version      0.2
// @description  copy code block from csdn without login
// @author       Yifeeeeei
// @updateURL    https://yifeeeeei.github.io/Monkey/csdn_free_copy.user.js
// @downloadURL  https://yifeeeeei.github.io/Monkey/csdn_free_copy.user.js
// @include      *csdn.net*
// ==/UserScript==

(function () {
    window.oncontextmenu = document.oncontextmenu = document.oncopy = null;
    [...document.querySelectorAll("body")].forEach(
        (dom) => (dom.outerHTML = dom.outerHTML)
    );
    [...document.querySelectorAll("body, body *")].forEach((dom) => {
        [
            "onselect",
            "onselectstart",
            "onselectend",
            "ondragstart",
            "ondragend",
            "oncontextmenu",
            "oncopy",
        ].forEach((ev) => dom.removeAttribute(ev));
        dom.style["user-select"] = "auto";
    });
})();
