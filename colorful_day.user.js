// ==UserScript==
// @name         colorful_day
// @version      0.1
// @description  the way it is
// @author       Yifeeeeei
// @updateURL    https://yifeeeeei.github.io/Monkey/colorful_day.user.js
// @downloadURL  https://yifeeeeei.github.io/Monkey/colorful_day.user.js
// @grant        GM_addStyle
// @include      *bilibili.com*
// @include      *baidu.com*
// @include      *qq.com*
// @include      *jd.com*
// ==/UserScript==

var domain = window.location.href;

if (domain.indexOf("bilibili.com") != -1) {
    const style =
        ".gray{-webkit-filter: grayscale(.0) !important;    filter: grayscale(0%) !important;}";
    GM_addStyle(style);
} else if (domain.indexOf("baidu.com") != -1) {
    const baidu_body = document.getElementsByTagName("body")[0];
    var body_class = baidu_body.classList;
    body_class.remove("big-event-gray");
    baidu_body.classList = body_class;
} else if (domain.indexOf("qq.com") != -1) {
    const style =
        "html{-webkit-filter: grayscale(.0) !important;    filter: grayscale(0%) !important;}";
    GM_addStyle(style);
} else if (domain.indexOf("jd.com") != -1) {
    const baidu_body = document.getElementsByTagName("html")[0];
    var body_class = baidu_body.classList;
    body_class.remove("o2_gray");
    baidu_body.classList = body_class;
}
