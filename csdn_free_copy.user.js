// ==UserScript==
// @name         csdn_free_copy
// @version      0.1
// @description  copy code block from csdn without login
// @author       Yifeeeeei
// @updateURL    https://yifeeeeei.github.io/Monkey/csdn_free_copy.user.js
// @downloadURL  https://yifeeeeei.github.io/Monkey/csdn_free_copy.user.js
// @grant        GM_addStyle
// @include      *csdn.net*
// ==/UserScript==

(function () {
    const style_free_copy =
        "#content_views pre code{-webkit-user-select: text !important; user-select: text !important;}  #content_views pre{-webkit-user-select: text !important; user-select: text !important;}";
    GM_addStyle(style_free_copy);
})();
