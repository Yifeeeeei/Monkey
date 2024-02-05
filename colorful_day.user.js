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
// @include      *e-hentai.org*
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
} else if (domain.indexOf("e-hentai.org") != -1) {
    const style =
        "#img{\
        position: fixed;\
        max-width: 95% !important;\
        max-height: 95% !important;\
        transform: translate(-50%, -50%);\
        top: 50%;\
        left: 50%;\
        z-index: 9999;\
        object-fit: contain !important;}";
    var img_ele = document.getElementById("img");

    GM_addStyle(style);
    if (img_ele) {
    } else {
        console.log("img not found");
    }
} else if (domain.indexOf("jd.com") != -1) {
    const baidu_body = document.getElementsByTagName("html")[0];
    var body_class = baidu_body.classList;
    body_class.remove("o2_gray");
    baidu_body.classList = body_class;
}
