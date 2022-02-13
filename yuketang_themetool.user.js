// ==UserScript==
// @name         雨课堂配色脚本
// @version      1.1.5
// @description  手动设置雨课堂配色+每日问候
// @author       if
// namespace     yekutang.if
// @updateURL    https://yifeeeeei.github.io/Monkey/yuketang_themetool.user.js
// @downloadURL  https://yifeeeeei.github.io/Monkey/yuketang_themetool.user.js
// @include      https://www.yuketang.cn/v2/web/*
// @include      https://pro.yuketang.cn/*
// @include      https://changjiang.yuketang.cn/*
// @include      https://huanghe.yuketang.cn/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @connect      chp.shadiao.app
// @connect      v1.hitokoto.cn
// @connect      api.btstu.cn
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// ==/UserScript==

// before release: TEST THE WARNINGS!!!

// updates
// v0.1: basic functions
// v1.0.0: well, basic css style, rainbowfart, birthday surprise, that would work.
// v1.1.0: new feature : the rainbowfart section is now greeting section, with four options provided: zhuangbi, rainbowfart, chickensoup and none.
//         modify      : added run-at document-start to settle the 'blink of white' issue. However, this caused the css stucture to change, so i added a lot more '!important'. This might have created much more potential bugs for the future.
// v1.1.1: modify      : removed run-at document-start attribute, just to much to change
// v1.1.2: modify      : enable huanghe yuketang
// v1.1.3: modify      : the cardS problem
// v1.1.4: modify      : test auto upgrade, added try catch block
// v1.1.5: modify      : cloud repo page
/*
notes: if some other guy wants to modify this script, this may help with your reading
1. You know what they say about '!important', never use them in your plug-ins. Well, consider this a very BAD example.
2. I tried to add more comments to this script, but the structure of the page is just to complicated to describe. So, my suggestion is, just comment the codes you want to look into, then find out what it does.
3. Tamper Monkey cannot detect the domain change here, this is a feature I so far haven't seen on any other websites. So I can't just if url1, else if url2. That's why I inject the css sheet needed for all pages once and for all. Well, but I left comments that shows which chunk of codes is made for which page.
4. Cards on that index page have class name 'el-cards', but cards on that specific course page have the same class name. Might cause some trouble.
5. All color are in a format of #XXX or #XXXXXX, well, mostly in #XXXXXX.
6. DO NOT TOUCH THE WAITFORKEYELEMENTS FUNCTION!
*/

(function() {
    ('use strict');
    ('global variables');
    // user_settings 用来存储一些除颜色外的设置，如功能开关
    var default_user_settings = {
        enable_left_menu: true,
        enable_index_page: true,
        enable_card_style: true,
        enable_greeting: 1,
        enable_developing_features: true,
    };
    // color set用来存储颜色配置
    var default_color_set = {
        background_color_main: '#F8C3CD', // 退红   TAIKOH
        background_color_secondary: '#FEDFE1', // 桜     SAKURA
        background_color_subordinate: '#D7C4BB', // 灰桜   HAIZAKURA
        text_color_main: '#734338', // 海老茶 EBICHA
        text_color_secondary: '#E83015', // 猩猩绯 SYOJYOHI
        text_color_subordinate: '#9E7A7A', // 梅鼠   UMENEZUMI
        card_color_list: [
            [
                '#00AA90', // 水浅葱 MIZUASAGI
                '#7B90D2', // 红碧   BENIMIDORI
                '#00896C', // 青竹   AOTAKE
                '#3A8FB7', // 千草   CHIGUSA
            ],
        ],
    };
    var user_settings;
    var color_set;
    var card_mark_list = [
        'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjQzMzQyOTE4NDkyIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjQ0NjYiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNMjgyLjMgMTg2LjFjLTEuOCAwLTMuNyAwLjItNS42IDAuNS0xNy40IDMuMS0yOSAxOS43LTI2IDM3LjFsOTYuOCA1NDkuMWMyLjcgMTUuNSAxNi4yIDI2LjUgMzEuNSAyNi41IDEuOCAwIDMuNy0wLjIgNS42LTAuNSAxNy40LTMuMSAyOS0xOS43IDI2LTM3LjFsLTk2LjgtNTQ5LjFjLTIuOC0xNS42LTE2LjMtMjYuNS0zMS41LTI2LjV6IiBmaWxsPSIjZGJkYmRiIiBwLWlkPSI0NDY3Ij48L3BhdGg+PHBhdGggZD0iTTczNS42IDE3MC42bC0xNSA5Ny4xYy0zLjIgMjAuOCAwLjUgNDIuNSAxMC42IDYxLjFsNDguOCA5MC4xLTQxNi45IDczLjVMMzE5LjMgMjQ0bDQxNi4zLTczLjRtMzcuMi03MWMtMS45IDAtMy45IDAuMi01LjkgMC41bC00ODkuMSA4Ni4yYy0xOCAzLjItMzAuMSAyMC40LTI2LjkgMzguNGw1NC41IDMwOS4xYzIuOCAxNi4xIDE2LjggMjcuNCAzMi42IDI3LjQgMS45IDAgMy45LTAuMiA1LjgtMC41bDQ4OS40LTg2LjNjMjIuMy0zLjkgMzQuMi0yOC41IDIzLjQtNDguNWwtNjkuMS0xMjcuN2MtMy40LTYuNC00LjctMTMuNy0zLjYtMjAuOWwyMS42LTEzOS43YzMuMS0yMC4yLTEyLjktMzgtMzIuNy0zOHpNOTEwLjcgODUwLjNMODc1LjEgNjkwYy02LjUtMjkuMy0zMi41LTUwLjEtNjIuNS01MC4xSDUxMi4zdjY0aDMwMC40bDM1LjYgMTYwLjNIMTc3LjhMMjEzLjQgNzA0SDI1NnYtNjRoLTQyLjdjLTMwIDAtNTYgMjAuOC02Mi41IDUwLjFsLTM1LjYgMTYwLjNjLTguOSA0MCAyMS41IDc3LjkgNjIuNSA3Ny45aDY3MC41YzQxLTAuMSA3MS40LTM4IDYyLjUtNzh6IiBmaWxsPSIjZGJkYmRiIiBwLWlkPSI0NDY4Ij48L3BhdGg+PHBhdGggZD0iTTI1Ni4xIDcwMy45aC0zMnYtNjRoMzJjMTcuNyAwIDMyIDE0LjMgMzIgMzJzLTE0LjQgMzItMzIgMzJ6TTQ4MC4xIDcwMy45aDMydi02NGgtMzJjLTE3LjcgMC0zMiAxNC4zLTMyIDMyczE0LjMgMzIgMzIgMzJ6IiBmaWxsPSIjZGJkYmRiIiBwLWlkPSI0NDY5Ij48L3BhdGg+PC9zdmc+',
        'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjQzMzQyOTE0NTI1IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjQyNTQiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNNTEyIDEyOC4yYzQ5LjkgMCA5OC41IDkuNSAxNDQuNCAyOC4xIDQ3LjYgMTkuMyA5MC4zIDQ3LjcgMTI2LjkgODQuMyAzNi43IDM2LjcgNjUgNzkuNCA4NC4zIDEyNi45IDE4LjYgNDYgMjguMSA5NC42IDI4LjEgMTQ0LjRzLTkuNSA5OC41LTI4LjEgMTQ0LjRjLTE5LjMgNDcuNi00Ny43IDkwLjMtODQuMyAxMjYuOS0zNi43IDM2LjctNzkuNCA2NS0xMjYuOSA4NC4zLTQ2IDE4LjYtOTQuNiAyOC4xLTE0NC40IDI4LjFzLTk4LjUtOS41LTE0NC40LTI4LjFjLTQ3LjYtMTkuMy05MC4zLTQ3LjctMTI2LjktODQuMy0zNi43LTM2LjctNjUtNzkuNC04NC4zLTEyNi45LTE4LjYtNDYtMjguMS05NC42LTI4LjEtMTQ0LjRzOS41LTk4LjUgMjguMS0xNDQuNGMxOS4zLTQ3LjYgNDcuNy05MC4zIDg0LjMtMTI2LjkgMzYuNy0zNi43IDc5LjQtNjUgMTI2LjktODQuMyA0NS45LTE4LjYgOTQuNS0yOC4xIDE0NC40LTI4LjFtMC02NGMtMTE0LjYgMC0yMjkuMiA0My43LTMxNi42IDEzMS4yLTE3NC45IDE3NC45LTE3NC45IDQ1OC40IDAgNjMzLjMgODcuNCA4Ny40IDIwMiAxMzEuMiAzMTYuNiAxMzEuMnMyMjkuMi00My43IDMxNi42LTEzMS4yYzE3NC45LTE3NC45IDE3NC45LTQ1OC40IDAtNjMzLjMtODcuNC04Ny41LTIwMi0xMzEuMi0zMTYuNi0xMzEuMnoiIGZpbGw9IiNkYmRiZGIiIHAtaWQ9IjQyNTUiPjwvcGF0aD48cGF0aCBkPSJNOTUzLjYgNTgwLjJjLTEzMi40LTguNS0yNTctNjUtMzUwLjktMTU4LjktNDcuNC00Ny40LTg1LjEtMTAyLjEtMTEyLjMtMTYyLjctMjYuMi01OC41LTQxLjgtMTIwLjgtNDYuMy0xODUuMWw2My44LTQuNUM1MTYgMTg0LjggNTY1LjggMjkzLjggNjQ4IDM3NmM4Mi45IDgyLjkgMTkyLjkgMTMyLjcgMzA5LjggMTQwLjNsLTQuMiA2My45ek01MTYuNiA5NTcuNWMtNy41LTExNi45LTU3LjQtMjI2LjktMTQwLjMtMzA5LjgtODIuMi04Mi4yLTE5MS4yLTEzMS45LTMwNy0xNDAuMWw0LjUtNjMuOGM2NC4zIDQuNSAxMjYuNSAyMC4xIDE4NS4xIDQ2LjMgNjAuNiAyNy4yIDExNS4zIDY0LjkgMTYyLjcgMTEyLjMgOTMuOSA5My45IDE1MC4zIDIxOC41IDE1OC45IDM1MC45bC02My45IDQuMnpNMjYxLjQgMjE2LjFsLTQ1LjMgNDUuMyA1NDYuNSA1NDYuNSA0NS4zLTQ1LjMtNTQ2LjUtNTQ2LjV6IiBmaWxsPSIjZGJkYmRiIiBwLWlkPSI0MjU2Ij48L3BhdGg+PHBhdGggZD0iTTc2Mi42IDIxNi4xTDIxNi4xIDc2Mi42bDQ1LjMgNDUuMyA1NDYuNS01NDYuNS00NS4zLTQ1LjN6IiBmaWxsPSIjZGJkYmRiIiBwLWlkPSI0MjU3Ij48L3BhdGg+PC9zdmc+',
        'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjQzMzQyOTA0Nzg2IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjM4MzEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNNTEyIDE2MGM0Ny41IDAgOTMuNiA5LjMgMTM3IDI3LjYgNDEuOSAxNy43IDc5LjYgNDMuMSAxMTEuOSA3NS41IDMyLjMgMzIuMyA1Ny43IDcwIDc1LjUgMTExLjkgMTguMyA0My40IDI3LjYgODkuNCAyNy42IDEzNyAwIDgwLjYtMTYuOSAxNDUuMy00Ni40IDE3Ny44LTIuMiAxLjYtOS40IDUuNi0yMi4yIDkuMi0xMy40IDMuOC0yOC4yIDYtNDEuNiA2LTguNiAwLTE2LjYtMC45LTIyLjMtMi42LTE4LjItNS4zLTM2LjYtMTYuNS01NC4zLTI3LjQtMjUuMS0xNS40LTUxLjEtMzEuMy04Mi0zMS40LTE5LjcgMC0zOC4xIDYuNS01My4yIDE4LjgtOS4xIDcuNC0zNy40IDM1LjMtMjIuMyA4NC43IDMuOCAxMi4zIDkuNSAyNC4yIDE1LjYgMzYuNyA0LjkgMTAuMSAxMCAyMC41IDEzLjUgMzAuMiAzLjUgOS45IDMuOCAxNC42IDMuOCAxNi4yLTAuMyAxMS4yLTYuOCAxOS0xMC42IDIyLjYtNy44IDcuMi0xOC40IDExLjItMzAgMTEuMi00Ny41IDAtOTMuNi05LjMtMTM3LTI3LjYtNDEuOS0xNy43LTc5LjYtNDMuMS0xMTEuOS03NS41LTMyLjMtMzIuMy01Ny43LTcwLTc1LjUtMTExLjktMTguMy00My40LTI3LjYtODkuNC0yNy42LTEzN3M5LjMtOTMuNiAyNy42LTEzN2MxNy43LTQxLjkgNDMuMS03OS42IDc1LjUtMTExLjlzNzAtNTcuNyAxMTEuOS03NS41YzQzLjQtMTguMyA4OS41LTI3LjYgMTM3LTI3LjZtMC02NEMyODIuMiA5NiA5NiAyODIuMiA5NiA1MTJzMTg2LjIgNDE2IDQxNiA0MTZjNTcuOSAwIDEwMy4zLTQzLjUgMTA0LjUtOTYuMyAxLjEtNTAuMy01MC4zLTEwNi41LTM0LjEtMTE5LjcgMy44LTMuMSA4LTQuNCAxMi43LTQuNCAyNiAwIDY2LjIgNDEgMTE4LjUgNTYuMiAxMi4yIDMuNSAyNiA1LjEgNDAuMiA1LjEgNDMuOSAwIDkxLjctMTUuMiAxMTAtMzQuOCA0OC4zLTUyIDY0LjItMTQwLjUgNjQuMi0yMjIuMkM5MjggMjgyLjIgNzQxLjggOTYgNTEyIDk2eiIgZmlsbD0iI2RiZGJkYiIgcC1pZD0iMzgzMiI+PC9wYXRoPjxwYXRoIGQ9Ik0yODUuNiA0NDguMmMtMzUuMyAwLTY0IDI4LjctNjQgNjRzMjguNyA2NCA2NCA2NCA2NC0yOC43IDY0LTY0LTI4LjYtNjQtNjQtNjR6TTM2NS44IDI3Mi40Yy0zNS4zIDAtNjQgMjguNy02NCA2NHMyOC43IDY0IDY0IDY0IDY0LTI4LjcgNjQtNjQtMjguNy02NC02NC02NHpNNTk2IDI3Mi40Yy0zNS4zIDAtNjQgMjguNy02NCA2NHMyOC43IDY0IDY0IDY0IDY0LTI4LjcgNjQtNjQtMjguNy02NC02NC02NHpNNzM0LjggNDQ4LjJjLTM1LjMgMC02NCAyOC43LTY0IDY0czI4LjcgNjQgNjQgNjQgNjQtMjguNyA2NC02NC0yOC42LTY0LTY0LTY0eiIgZmlsbD0iI2RiZGJkYiIgcC1pZD0iMzgzMyI+PC9wYXRoPjwvc3ZnPg==',
        'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjQzMzQyOTAwMDA5IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjM2MjQiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNMjA4LjIgNzA0YzQ0LjIgMCA4MC4xIDM1LjkgODAuMSA4MC4xcy0zNS45IDgwLjEtODAuMSA4MC4xLTgwLjItMzUuOS04MC4yLTgwLjEgMzYtODAuMSA4MC4yLTgwLjFtMC02NEMxMjguNiA2NDAgNjQgNzA0LjUgNjQgNzg0LjFzNjQuNSAxNDQuMSAxNDQuMSAxNDQuMSAxNDQuMS02NC41IDE0NC4xLTE0NC4xUzI4Ny44IDY0MCAyMDguMiA2NDB6TTgwMC40IDcwNGMzNS4yIDAgNjMuOCAyOC42IDYzLjggNjMuOHMtMjguNiA2My44LTYzLjggNjMuOC02My44LTI4LjYtNjMuOC02My44IDI4LjYtNjMuOCA2My44LTYzLjhtMC02NGMtNzAuNiAwLTEyNy44IDU3LjItMTI3LjggMTI3LjhzNTcuMiAxMjcuOCAxMjcuOCAxMjcuOCAxMjcuOC01Ny4yIDEyNy44LTEyNy44Uzg3MSA2NDAgODAwLjQgNjQwek04NjMuOCAxOTguN3YxMjcuOGwtNTEyLjYgNTFWMjQ5LjdsNTEyLjYtNTFtMjQuMS02Ni41Yy0xLjMgMC0yLjcgMC4xLTQgMC4ybC01NjAuNiA1NS44Yy0yMC41IDItMzYgMTkuMi0zNiAzOS44djE3NmMwIDIyLjMgMTguMSA0MCAzOS45IDQwIDEuMyAwIDIuNy0wLjEgNC0wLjJMODkxLjggMzg4YzIwLjUtMiAzNi0xOS4yIDM2LTM5Ljh2LTE3NmMwLTIyLjMtMTguMS00MC0zOS45LTQweiIgZmlsbD0iI2RiZGJkYiIgcC1pZD0iMzYyNSI+PC9wYXRoPjxwYXRoIGQ9Ik05MjYuOCAyNjUuM2gtNjQuMnY1MDIuNWg2NC4yVjI2NS4zek0zNTEuNSAyNjUuM2gtNjQuM3Y1MDIuNWg2NC4zVjI2NS4zeiIgZmlsbD0iI2RiZGJkYiIgcC1pZD0iMzYyNiI+PC9wYXRoPjwvc3ZnPg==',
        'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjQzMzQyODk1MzUwIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjM0MTIiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNNTEyIDE2MGM0Ny41IDAgOTMuNiA5LjMgMTM3IDI3LjYgNDEuOSAxNy43IDc5LjYgNDMuMSAxMTEuOSA3NS41IDMyLjMgMzIuMyA1Ny43IDcwIDc1LjUgMTExLjkgMTguMyA0My40IDI3LjYgODkuNCAyNy42IDEzN3MtOS4zIDkzLjYtMjcuNiAxMzdjLTE3LjcgNDEuOS00My4xIDc5LjYtNzUuNSAxMTEuOS0zMi4zIDMyLjMtNzAgNTcuNy0xMTEuOSA3NS41LTQzLjQgMTguMy04OS40IDI3LjYtMTM3IDI3LjZzLTkzLjYtOS4zLTEzNy0yNy42Yy00MS45LTE3LjctNzkuNi00My4xLTExMS45LTc1LjUtMzIuMy0zMi4zLTU3LjctNzAtNzUuNS0xMTEuOS0xOC4zLTQzLjQtMjcuNi04OS40LTI3LjYtMTM3czkuMy05My42IDI3LjYtMTM3YzE3LjctNDEuOSA0My4xLTc5LjYgNzUuNS0xMTEuOXM3MC01Ny43IDExMS45LTc1LjVjNDMuNC0xOC4zIDg5LjUtMjcuNiAxMzctMjcuNm0wLTY0QzI4Mi4yIDk2IDk2IDI4Mi4yIDk2IDUxMnMxODYuMiA0MTYgNDE2IDQxNiA0MTYtMTg2LjIgNDE2LTQxNlM3NDEuOCA5NiA1MTIgOTZ6IiBmaWxsPSIjZGJkYmRiIiBwLWlkPSIzNDEzIj48L3BhdGg+PHBhdGggZD0iTTM4Ni45IDM4N2wxODcuOCA2Mi41IDYyLjUgMTg3LjgtMTg3LjgtNjIuNUwzODYuOSAzODdtLTc5LjMtOTMuMWMtOSAwLTE2LjIgOS0xMy4xIDE4LjNsMTAyLjEgMzA2LjZjMS40IDQuMiA0LjYgNy40IDguOCA4LjhMNzEyIDcyOS43YzEuNSAwLjUgMyAwLjcgNC41IDAuNyA5IDAgMTYuMi05IDEzLjEtMTguM0w2MjcuNCA0MDUuNWMtMS40LTQuMi00LjYtNy40LTguOC04LjhMMzEyLjEgMjk0LjZjLTEuNS0wLjUtMy0wLjctNC41LTAuN3oiIGZpbGw9IiNkYmRiZGIiIHAtaWQ9IjM0MTQiPjwvcGF0aD48cGF0aCBkPSJNNTU2LjIgNDI4LjdjLTMuNiAwLTcuMSAxLjQtOS44IDQuMUw0MzIuNiA1NDYuNWMtNS40IDUuNC01LjQgMTQuMiAwIDE5LjZsMjUuMiAyNS4yYzIuNyAyLjcgNi4zIDQuMSA5LjggNC4xczcuMS0xLjQgOS44LTQuMWwxMTMuNy0xMTMuN2M1LjQtNS40IDUuNC0xNC4yIDAtMTkuNkw1NjYgNDMyLjhjLTIuNy0yLjctNi4zLTQuMS05LjgtNC4xeiIgZmlsbD0iI2RiZGJkYiIgcC1pZD0iMzQxNSI+PC9wYXRoPjwvc3ZnPg==',
        'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjQzMzQyODg4MjEzIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjMyMDMiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNOTI3LjIgMTkxLjhIOTYuOWMtMTcuNyAwLTMyLjEgMTQuNC0zMi4xIDMyLjFTNzkuMiAyNTYgOTYuOSAyNTZoODMwLjNjMTcuNyAwIDMyLjEtMTQuNCAzMi4xLTMyLjFzLTE0LjMtMzIuMS0zMi4xLTMyLjF6IiBmaWxsPSIjZGJkYmRiIiBwLWlkPSIzMjA0Ij48L3BhdGg+PHBhdGggZD0iTTgzMi4yIDI1NS44djMyMC4xYzAgMzUuMy0yOC43IDY0LTY0IDY0SDI1NS44Yy0zNS4zIDAtNjQtMjguNy02NC02NFYyNTUuOGg2NDAuNG02NC02NEgxMjcuOHYzODQuMWMwIDcwLjcgNTcuMyAxMjggMTI4IDEyOGg1MTIuM2M3MC43IDAgMTI4LTU3LjMgMTI4LTEyOFYxOTEuOGgwLjF6IiBmaWxsPSIjZGJkYmRiIiBwLWlkPSIzMjA1Ij48L3BhdGg+PHBhdGggZD0iTTE5MiA5NmMtMTcuNyAwLTMyLjEgMTQuNC0zMi4xIDMyLjFWMjU2aDY0LjJWMTI4LjFjMC0xNy43LTE0LjMtMzIuMS0zMi4xLTMyLjF6TTU0NC4xIDY0MC4xaC02NC4ydjI1NS44YzAgMTcuNyAxNC40IDMyLjEgMzIuMSAzMi4xIDE3LjcgMCAzMi4xLTE0LjQgMzIuMS0zMi4xVjY0MC4xek00NDcuOSAxOTEuOGgtNjQuMnYyODcuN2MwIDE3LjcgMTQuNCAzMi4xIDMyLjEgMzIuMSAxNy43IDAgMzIuMS0xNC40IDMyLjEtMzIuMVYxOTEuOHpNMjg4LjEgMzgzLjhjLTE3LjcgMC0zMi4xIDE0LjQtMzIuMSAzMi4xdjYzLjZjMCAxNy43IDE0LjQgMzIuMSAzMi4xIDMyLjFzMzIuMS0xNC40IDMyLjEtMzIuMXYtNjMuNmMwLTE3LjctMTQuMy0zMi4xLTMyLjEtMzIuMXpNNzM2LjIgMzgzLjhjLTE3LjcgMC0zMi4xIDE0LjQtMzIuMSAzMi4xdjYzLjZjMCAxNy43IDE0LjQgMzIuMSAzMi4xIDMyLjEgMTcuNyAwIDMyLjEtMTQuNCAzMi4xLTMyLjF2LTYzLjZjMC0xNy43LTE0LjQtMzIuMS0zMi4xLTMyLjF6TTY0MC40IDE5MS44aC02NC4ydjI4Ny43YzAgMTcuNyAxNC40IDMyLjEgMzIuMSAzMi4xIDE3LjcgMCAzMi4xLTE0LjQgMzIuMS0zMi4xVjE5MS44eiIgZmlsbD0iI2RiZGJkYiIgcC1pZD0iMzIwNiI+PC9wYXRoPjxwYXRoIGQ9Ik00MTUuOCA0NDcuOEgyODguMWMtMTcuNyAwLTMyLjEgMTQuNC0zMi4xIDMyLjFzMTQuNCAzMi4xIDMyLjEgMzIuMWgxMjcuN2MxNy43IDAgMzIuMS0xNC40IDMyLjEtMzIuMXMtMTQuNC0zMi4xLTMyLjEtMzIuMXpNNzM1LjkgNDQ3LjhINjA4LjJjLTE3LjcgMC0zMi4xIDE0LjQtMzIuMSAzMi4xczE0LjQgMzIuMSAzMi4xIDMyLjFoMTI3LjdjMTcuNyAwIDMyLjEtMTQuNCAzMi4xLTMyLjFzLTE0LjQtMzIuMS0zMi4xLTMyLjF6TTMyMC4xIDY0MGgtNjR2MTkxLjdjMCAxNy43LTE0LjMgMzItMzIgMzJoLTAuMWMtMTcuNyAwLTMyIDE0LjMtMzIgMzJzMTQuMyAzMiAzMiAzMmgzMnYwLjRjMzUuNCAwIDY0LTI4LjcgNjQtNjRWNjQwaDAuMXpNNzY4LjEgNjQwaC02NHYyMjRjMCAzNS40IDI4LjcgNjQgNjQgNjR2LTAuNGgzMi4xYzE3LjcgMCAzMi0xNC4zIDMyLTMycy0xNC4zLTMyLTMyLTMyaC0wLjFjLTE3LjcgMC0zMi0xNC4zLTMyLTMyVjY0MHpNODMyLjIgOTZjLTE3LjcgMC0zMi4xIDE0LjQtMzIuMSAzMi4xVjI1Nmg2NC4yVjEyOC4xYzAtMTcuNy0xNC40LTMyLjEtMzIuMS0zMi4xeiIgZmlsbD0iI2RiZGJkYiIgcC1pZD0iMzIwNyI+PC9wYXRoPjwvc3ZnPg==',
        'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjQzMzQyODg0MDQ1IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjI5OTEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNNzA1LjIgMjA1LjZjLTguMiAwLTE2LjQgMy4xLTIyLjYgOS40LTEyLjUgMTIuNS0xMi41IDMyLjggMCA0NS4zTDgzNS4yIDQxM2M2LjIgNi4yIDE0LjQgOS40IDIyLjYgOS40IDguMiAwIDE2LjQtMy4xIDIyLjYtOS40IDEyLjUtMTIuNSAxMi41LTMyLjggMC00NS4zTDcyNy44IDIxNWMtNi4yLTYuMi0xNC40LTkuNC0yMi42LTkuNHpNNjE4LjQgMzExYy04LjIgMC0xNi40IDMuMS0yMi42IDkuNC0xMi41IDEyLjUtMTIuNSAzMi44IDAgNDUuM2wxMjMuOCAxMjMuOGM2LjIgNi4yIDE0LjQgOS40IDIyLjYgOS40czE2LjQtMy4xIDIyLjYtOS40YzEyLjUtMTIuNSAxMi41LTMyLjggMC00NS4zTDY0MSAzMjAuNGMtNi4zLTYuMy0xNC41LTkuNC0yMi42LTkuNHpNMTcyLjYgNjA3Yy04LjIgMC0xNi40IDMuMS0yMi42IDkuNC0xMi41IDEyLjUtMTIuNSAzMi44IDAgNDUuM2wxNTIuNyAxNTIuN2M2LjIgNi4yIDE0LjQgOS40IDIyLjYgOS40IDguMiAwIDE2LjQtMy4xIDIyLjYtOS40IDEyLjUtMTIuNSAxMi41LTMyLjggMC00NS4zTDE5NS4zIDYxNi40Yy02LjMtNi4zLTE0LjUtOS40LTIyLjctOS40ek0yNzggNTIwLjJjLTguMiAwLTE2LjQgMy4xLTIyLjYgOS40LTEyLjUgMTIuNS0xMi41IDMyLjggMCA0NS4zbDEyMy44IDEyMy44YzYuMiA2LjIgMTQuNCA5LjQgMjIuNiA5LjQgOC4yIDAgMTYuNC0zLjEgMjIuNi05LjQgMTIuNS0xMi41IDEyLjUtMzIuOCAwLTQ1LjNMMzAwLjYgNTI5LjVjLTYuMi02LjItMTQuNC05LjMtMjIuNi05LjN6IiBmaWxsPSIjZGJkYmRiIiBwLWlkPSIyOTkyIj48L3BhdGg+PHBhdGggZD0iTTMyMCA5NjBjLTExLjcgMC0yMy02LjQtMjguNi0xNy42LTgtMTUuOC0xLjYtMzUgMTQuMS00M2wwLjctMC40YzY1LTMyLjggMTczLjctODcuNyAxNzMuNy0yNTkuMlYzODRjMC05MC45IDI3LTE2Ni44IDgwLjEtMjI1LjMgNDMuOS00OC40IDk1LjItNzQuMSAxMjkuMi05MS4xbDAuNC0wLjJjMTUuOC03LjkgMzUtMS41IDQyLjkgMTQuM3MxLjUgMzUtMTQuMyA0Mi45bC0wLjQgMC4yYy02MC44IDMwLjQtMTc0IDg3LjEtMTc0IDI1OS4ydjI1NS45YzAgOTAuNy0yNi45IDE2Ni4zLTc5LjggMjI0LjktNDMuOCA0OC40LTk1LjEgNzQuMy0xMjkuMSA5MS41bC0wLjcgMC4zYy00LjQgMi4zLTkuMyAzLjQtMTQuMiAzLjR6IiBmaWxsPSIjZGJkYmRiIiBwLWlkPSIyOTkzIj48L3BhdGg+PHBhdGggZD0iTTk2IDczNmMtNC44IDAtOS43LTEuMS0xNC4zLTMuNC0xNS44LTcuOS0yMi4yLTI3LjEtMTQuMy00Mi45bDAuMi0wLjRjMTctMzMuOSA0Mi43LTg1LjMgOTEuMS0xMjkuMkMyMTcuMiA1MDcgMjkzLjEgNDgwIDM4NCA0ODBoMjU1LjljMTcxLjUgMCAyMjYuNC0xMDguOCAyNTkuMi0xNzMuN2wwLjQtMC43YzgtMTUuOCAyNy4yLTIyLjEgNDMtMTQuMSAxNS44IDggMjIuMSAyNy4yIDE0LjEgNDNsLTAuMyAwLjdjLTE3LjIgMzQtNDMuMSA4NS4zLTkxLjUgMTI5LjEtNTguNSA1My0xMzQuMiA3OS44LTIyNC45IDc5LjhIMzg0Yy0xNzIuMSAwLTIyOC43IDExMy4yLTI1OS4yIDE3NGwtMC4yIDAuNEMxMTkgNzI5LjUgMTA3LjcgNzM2IDk2IDczNnoiIGZpbGw9IiNkYmRiZGIiIHAtaWQ9IjI5OTQiPjwvcGF0aD48L3N2Zz4=',
        'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjQzMzQyODc5NTM3IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjI3ODIiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNNTEyIDUxMm0tNjQgMGE2NCA2NCAwIDEgMCAxMjggMCA2NCA2NCAwIDEgMC0xMjggMFoiIGZpbGw9IiNkYmRiZGIiIHAtaWQ9IjI3ODMiPjwvcGF0aD48cGF0aCBkPSJNNTEyIDE2MGMxNS43IDAgMzEuOCA2LjQgNDggMTkuMSAxOS41IDE1LjMgMzguNCAzOS4yIDU0LjUgNjkuMiAxNy45IDMzLjEgMzIgNzIuMiA0Mi4xIDExNi4xIDEwLjYgNDYuNiAxNiA5Ni4zIDE2IDE0Ny43cy01LjQgMTAxLjEtMTYgMTQ3LjdjLTEwIDQzLjktMjQuMiA4My00Mi4xIDExNi4xLTE2LjIgMzAtMzUuMSA1My45LTU0LjUgNjkuMi0xNi4yIDEyLjctMzIuMyAxOS4xLTQ4IDE5LjEtMTUuNyAwLTMxLjgtNi40LTQ4LTE5LjEtMTkuNS0xNS4zLTM4LjQtMzkuMi01NC41LTY5LjItMTcuOS0zMy4xLTMyLTcyLjItNDIuMS0xMTYuMS0xMC42LTQ2LjYtMTYtOTYuMy0xNi0xNDcuN3M1LjQtMTAxLjEgMTYtMTQ3LjdjMTAtNDMuOSAyNC4yLTgzIDQyLjEtMTE2LjEgMTYuMi0zMCAzNS4xLTUzLjkgNTQuNS02OS4yIDE2LjItMTIuNyAzMi4zLTE5LjEgNDgtMTkuMW0wLTY0Yy0xMjQuMSAwLTIyNC42IDE4Ni4yLTIyNC42IDQxNlMzODcuOSA5MjggNTEyIDkyOHMyMjQuNi0xODYuMiAyMjQuNi00MTZTNjM2LjEgOTYgNTEyIDk2eiIgZmlsbD0iI2RiZGJkYiIgcC1pZD0iMjc4NCI+PC9wYXRoPjxwYXRoIGQ9Ik0zMjUuNSAyOTEuMmM3OS42IDAgMTc2LjkgMjkuOCAyNjYuOCA4MS43IDQ0LjUgMjUuNyA4NC44IDU1LjIgMTE5LjkgODcuNyAzMyAzMC42IDU5LjggNjIuNCA3OS41IDk0LjUgMTcuOSAyOSAyOS4yIDU3LjMgMzIuNiA4MS44IDIuOSAyMC4zIDAuNCAzNy41LTcuNSA1MS4xLTcuNCAxMi45LTIwLjIgMjMuMy0zNy44IDMwLjktMjEuMiA5LjEtNDkgMTMuOS04MC42IDEzLjktNzkuNiAwLTE3Ni45LTI5LjgtMjY2LjgtODEuNy00NC41LTI1LjctODQuOC01NS4yLTExOS45LTg3LjctMzMtMzAuNi01OS44LTYyLjQtNzkuNS05NC41LTE3LjktMjktMjkuMi01Ny4zLTMyLjYtODEuOC0yLjktMjAuMy0wLjQtMzcuNSA3LjUtNTEuMSA3LjQtMTIuOSAyMC4yLTIzLjMgMzcuOC0zMC45IDIxLjItOS4xIDQ5LjEtMTMuOSA4MC42LTEzLjltMC02NGMtODAuMyAwLTE0NC4xIDI1LjQtMTczLjggNzYuOC02MiAxMDcuNCA0OSAyODcuNiAyNDggNDAyLjUgMTAzLjkgNjAgMjExLjEgOTAuMyAyOTguOCA5MC4zIDgwLjMgMCAxNDQuMS0yNS40IDE3My44LTc2LjggNjItMTA3LjQtNDktMjg3LjYtMjQ4LTQwMi41LTEwMy44LTYwLTIxMS4xLTkwLjMtMjk4LjgtOTAuM3oiIGZpbGw9IiNkYmRiZGIiIHAtaWQ9IjI3ODUiPjwvcGF0aD48cGF0aCBkPSJNNjk4LjUgMjkxLjJjMzEuNSAwIDU5LjQgNC44IDgwLjYgMTMuOSAxNy42IDcuNiAzMC4zIDE4IDM3LjggMzAuOSA3LjggMTMuNiAxMC4zIDMwLjggNy41IDUxLjEtMy41IDI0LjUtMTQuOCA1Mi44LTMyLjYgODEuOC0xOS43IDMyLTQ2LjUgNjMuOC03OS41IDk0LjUtMzUgMzIuNS03NS40IDYyLTExOS45IDg3LjctODkuOSA1MS45LTE4Ny4yIDgxLjctMjY2LjggODEuNy0zMS41IDAtNTkuNC00LjgtODAuNi0xMy45LTE3LjYtNy42LTMwLjMtMTgtMzcuOC0zMC45LTcuOC0xMy42LTEwLjMtMzAuOC03LjUtNTEuMSAzLjUtMjQuNSAxNC44LTUyLjggMzIuNi04MS44IDE5LjctMzIgNDYuNS02My44IDc5LjUtOTQuNSAzNS0zMi41IDc1LjQtNjIgMTE5LjktODcuNyA4OS45LTUxLjkgMTg3LjItODEuNyAyNjYuOC04MS43bTAtNjRjLTg3LjcgMC0xOTQuOSAzMC4zLTI5OC44IDkwLjMtMTk5IDExNC45LTMxMCAyOTUuMS0yNDggNDAyLjUgMjkuNyA1MS40IDkzLjUgNzYuOCAxNzMuOCA3Ni44IDg3LjcgMCAxOTQuOS0zMC4zIDI5OC44LTkwLjMgMTk5LTExNC45IDMxMC0yOTUuMSAyNDgtNDAyLjUtMjkuNy01MS40LTkzLjUtNzYuOC0xNzMuOC03Ni44eiIgZmlsbD0iI2RiZGJkYiIgcC1pZD0iMjc4NiI+PC9wYXRoPjwvc3ZnPg==',
        'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjQzMzQyODY5NjI0IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjI1NzQiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNNzM1LjcgNjMuOUgyODguMmMtMTcuNyAwLTMyLjEgMTQuNC0zMi4xIDMyLjFzMTQuNCAzMi4xIDMyLjEgMzIuMWg0NDcuNWMxNy43IDAgMzIuMS0xNC40IDMyLjEtMzIuMXMtMTQuNC0zMi4xLTMyLjEtMzIuMXoiIGZpbGw9IiNkYmRiZGIiIHAtaWQ9IjI1NzUiPjwvcGF0aD48cGF0aCBkPSJNNjA4IDEyNy43djE2OWMwIDI0IDEzLjQgNDYgMzQuOCA1Ni45IDQ2LjMgMjMuOCA4NS4zIDU5LjcgMTEyLjkgMTAzLjlDNzg0IDUwMyA3OTkgNTU1LjQgNzk5IDYwOS4yYzAgMzguOC03LjYgNzYuNC0yMi41IDExMS43LTE0LjUgMzQuMi0zNS4yIDY0LjktNjEuNSA5MS4yLTI2LjQgMjYuNC01Ny4xIDQ3LjEtOTEuMiA2MS41LTM1LjMgMTQuOS03Mi45IDIyLjUtMTExLjcgMjIuNXMtNzYuNC03LjYtMTExLjctMjIuNWMtMzQuMi0xNC41LTY0LjktMzUuMi05MS4yLTYxLjUtMjYuNC0yNi40LTQ3LjEtNTcuMS02MS41LTkxLjJDMjMyLjYgNjg1LjYgMjI1IDY0OCAyMjUgNjA5LjJjMC01My44IDE1LTEwNi4yIDQzLjMtMTUxLjYgMjcuNi00NC4yIDY2LjYtODAuMiAxMTIuOS0xMDMuOSAyMS40LTExIDM0LjgtMzIuOSAzNC44LTU2Ljl2LTE2OWgxOTJtNjQtNjQuMUgzNTJ2MjMzQzIzOC42IDM1NC45IDE2MSA0NzMgMTYxIDYwOS4yYzAgMTkzLjkgMTU3LjEgMzUxIDM1MSAzNTFzMzUxLTE1Ny4xIDM1MS0zNTFjMC0xMzYuMi03Ny42LTI1NC4zLTE5MS0zMTIuNXYtMjMzeiIgZmlsbD0iI2RiZGJkYiIgcC1pZD0iMjU3NiI+PC9wYXRoPjxwYXRoIGQ9Ik03MDMuMiA1NzcuOGMtMTI3LjMgMC0yNTUuMiA2My42LTM4My4zIDYzLjYtNzQuOCAwLTEyNy44LTIxLjgtMTU4LjktMzkuOS0wLjEgMi42LTAuMSA1LjItMC4xIDcuOCAwIDE5My45IDE1Ny4xIDM1MSAzNTEgMzUxIDE5MSAwIDM0Ni40LTE1Mi42IDM1MC45LTM0Mi41LTMxLjEtMTguMi04NC4yLTQwLTE1OS42LTQweiIgZmlsbD0iI2RiZGJkYiIgcC1pZD0iMjU3NyI+PC9wYXRoPjwvc3ZnPg==',
        'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjQzMzQyODUwMzc0IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjE3NzAiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNNDE2LjEgMzE5LjhIMjg4Yy0xNy43IDAtMzIgMTQuMy0zMiAzMnMxNC4zIDMyIDMyIDMyaDEyOGMxNy43IDAgMzItMTQuMyAzMi0zMnMtMTQuMi0zMi0zMS45LTMyeiIgZmlsbD0iI2RiZGJkYiIgcC1pZD0iMTc3MSI+PC9wYXRoPjxwYXRoIGQ9Ik0zNTIuMSAyNTUuOGMtMTcuNyAwLTMyIDE0LjMtMzIgMzJ2MTI4YzAgMTcuNyAxNC4zIDMyIDMyIDMyczMyLTE0LjMgMzItMzJ2LTEyOGMwLTE3LjctMTQuNC0zMi0zMi0zMnpNMjg3LjcgNTc1LjVjLTguMiAwLTE2LjQgMy4xLTIyLjYgOS40LTEyLjUgMTIuNS0xMi41IDMyLjggMCA0NS4zTDM5My45IDc1OWM2LjIgNi4yIDE0LjQgOS40IDIyLjYgOS40IDguMiAwIDE2LjQtMy4xIDIyLjYtOS40IDEyLjUtMTIuNSAxMi41LTMyLjggMC00NS4zTDMxMC4zIDU4NC45Yy02LjItNi4zLTE0LjQtOS40LTIyLjYtOS40eiIgZmlsbD0iI2RiZGJkYiIgcC1pZD0iMTc3MiI+PC9wYXRoPjxwYXRoIGQ9Ik00MTYuNSA1NzUuNWMtOC4yIDAtMTYuNCAzLjEtMjIuNiA5LjRMMjY1IDcxMy43Yy0xMi41IDEyLjUtMTIuNSAzMi44IDAgNDUuMyA2LjIgNi4yIDE0LjQgOS40IDIyLjYgOS40IDguMiAwIDE2LjQtMy4xIDIyLjYtOS40TDQzOSA2MzAuMmMxMi41LTEyLjUgMTIuNS0zMi44IDAtNDUuMy02LjItNi4zLTE0LjQtOS40LTIyLjUtOS40ek03MzYuMSAzMjAuMWgtMTI4Yy0xNy43IDAtMzIgMTQuMy0zMiAzMnMxNC4zIDMyIDMyIDMyaDEyOGMxNy43IDAgMzItMTQuMyAzMi0zMnMtMTQuMy0zMi0zMi0zMnpNNzM2LjEgNjg5LjZoLTEyOGMtMTcuNyAwLTMyIDE0LjMtMzIgMzJzMTQuMyAzMiAzMiAzMmgxMjhjMTcuNyAwIDMyLTE0LjMgMzItMzJzLTE0LjMtMzItMzItMzJ6TTczNi4xIDU5My43aC0xMjhjLTE3LjcgMC0zMiAxNC4zLTMyIDMyczE0LjMgMzIgMzIgMzJoMTI4YzE3LjcgMCAzMi0xNC4zIDMyLTMycy0xNC4zLTMyLTMyLTMyeiIgZmlsbD0iI2RiZGJkYiIgcC1pZD0iMTc3MyI+PC9wYXRoPjxwYXRoIGQ9Ik04MzIgMTYwYzExLjQgMCAxOSA1LjkgMjIuNSA5LjUgMy41IDMuNSA5LjUgMTEuMiA5LjUgMjIuNXY2NDBjMCAxMS40LTUuOSAxOS05LjUgMjIuNS0zLjUgMy41LTExLjIgOS41LTIyLjUgOS41SDE5MmMtMTEuNCAwLTE5LTUuOS0yMi41LTkuNS0zLjUtMy41LTkuNS0xMS4yLTkuNS0yMi41VjE5MmMwLTExLjQgNS45LTE5IDkuNS0yMi41czExLjItOS41IDIyLjUtOS41aDY0MG0wLTY0SDE5MmMtNTIuOCAwLTk2IDQzLjItOTYgOTZ2NjQwYzAgNTIuOCA0My4yIDk2IDk2IDk2aDY0MGM1Mi44IDAgOTYtNDMuMiA5Ni05NlYxOTJjMC01Mi44LTQzLjItOTYtOTYtOTZ6IiBmaWxsPSIjZGJkYmRiIiBwLWlkPSIxNzc0Ij48L3BhdGg+PC9zdmc+',
    ];

    ('below is a function I copied from github, takes too long to load, just leave it here and try not to touch it.');
    /*--- waitForKeyElements():  A utility function, for Greasemonkey scripts,
    that detects and handles AJAXed content.

    Usage example:

        waitForKeyElements (
            "div.comments"
            , commentCallbackFunction
        );

        //--- Page-specific function to do what we want when the node is found.
        function commentCallbackFunction (jNode) {
            jNode.text ("This comment changed by waitForKeyElements().");
        }

    IMPORTANT: This function requires your script to have loaded jQuery.
*/
    function waitForKeyElements(
        selectorTxt,
        /* Required: The jQuery selector string that
                                       specifies the desired element(s).
                                   */
        actionFunction,
        /* Required: The code to run when elements are
                                       found. It is passed a jNode to the matched
                                       element.
                                   */
        bWaitOnce,
        /* Optional: If false, will continue to scan for
                                       new elements even after the first match is
                                       found.
                                   */
        iframeSelector
        /* Optional: If set, identifies the iframe to
                                       search.
                                   */
    ) {
        var targetNodes, btargetsFound;

        if (typeof iframeSelector == 'undefined')
            targetNodes = $(selectorTxt);
        else
            targetNodes = $(iframeSelector)
            .contents()
            .find(selectorTxt);

        if (targetNodes && targetNodes.length > 0) {
            btargetsFound = true;
            /*--- Found target node(s).  Go through each and act if they
            are new.
        */
            targetNodes.each(function() {
                var jThis = $(this);
                var alreadyFound =
                    jThis.data('alreadyFound') || false;

                if (!alreadyFound) {
                    //--- Call the payload function.
                    var cancelFound = actionFunction(jThis);
                    if (cancelFound) btargetsFound = false;
                    else jThis.data('alreadyFound', true);
                }
            });
        } else {
            btargetsFound = false;
        }

        //--- Get the timer-control variable for this selector.
        var controlObj =
            waitForKeyElements.controlObj || {};
        var controlKey = selectorTxt.replace(/[^\w]/g, '_');
        var timeControl = controlObj[controlKey];

        //--- Now set or clear the timer as appropriate.
        if (btargetsFound && bWaitOnce && timeControl) {
            //--- The only condition where we need to clear the timer.
            clearInterval(timeControl);
            delete controlObj[controlKey];
        } else {
            //--- Set a timer, if needed.
            if (!timeControl) {
                timeControl = setInterval(function() {
                    waitForKeyElements(
                        selectorTxt,
                        actionFunction,
                        bWaitOnce,
                        iframeSelector
                    );
                }, 300);
                controlObj[controlKey] = timeControl;
            }
        }
        waitForKeyElements.controlObj = controlObj;
    }
    ('OK, you can start touching things now, good luck with that.');

    console.log('running');
    console.log(window.location.href);

    ('functions');
    var domain = window.location.href;
    var server_code = 1; // 0 荷塘雨课堂，1 雨课堂， 2 长江雨课堂， 3 黄河雨课堂
    if (domain.indexOf('pro') != -1) {
        server_code = 0;
    } else if (domain.indexOf('changjiang') != -1) {
        server_code = 2;
    } else if (domain.indexOf('huanghe') != -1) {
        server_code = 3;
    }

    function randInt(low, top) {
        'return a random int [low, top)';
        return (
            Math.floor(Math.random() * (top - low)) + low
        );
    }

    function changeWaterMark_code0(jNode) {
        var marks = document.querySelectorAll(
            '#pane-student > div > div > div > div > div.mark>img'
        );
        for (var i = 0; i < marks.length; i++) {
            if (!marks[i].hasAttribute('set')) {
                marks[i].setAttribute(
                    'src',
                    card_mark_list[
                        randInt(0, card_mark_list.length)
                    ]
                );
                marks[i].setAttribute('set', 1);
            }
        }
    }

    function changeWaterMark_code1(jNode) {
        var card_list =
            document.querySelectorAll('.lesson-cardT');
        for (var i = 0; i < card_list.length; i++) {
            if (card_list[i].hasAttribute('set')) {
                continue;
            }
            var div = document.createElement('div');
            div.setAttribute('class', 'mark');
            card_list[i].appendChild(div);
            var img = document.createElement('img');
            img.setAttribute(
                'src',
                card_mark_list[
                    randInt(0, card_mark_list.length)
                ]
            );
            img.setAttribute('alt', 'mark');
            div.appendChild(img);
            card_list[i].setAttribute('set', 1);
        }
    }

    function colorGradient(original_color, ratio) {
        if (ratio == 0 || ratio > 1 || ratio < -1) {
            return original_color;
        }
        hex_color = 0;
        max_hex_color = 0;
        var r = 0;
        var g = 0;
        var b = 0;
        if (original_color.length == 4) {
            // #XXX
            hex_color = parseInt(
                original_color.slice(1),
                16
            );
            r = parseInt(original_color.slice(1, 2), 16);
            g = parseInt(original_color.slice(2, 3), 16);
            b = parseInt(original_color.slice(3, 4), 16);
            max_hex_color = parseInt('F', 16);

            if (ratio > 0) {
                r =
                    r +
                    parseInt(ratio * (max_hex_color - r));
                g =
                    g +
                    parseInt(ratio * (max_hex_color - g));
                b =
                    b +
                    parseInt(ratio * (max_hex_color - b));
            } else if (ratio < 0) {
                r = hex_color + parseInt(ratio * r);
                g = hex_color + parseInt(ratio * g);
                b = hex_color + parseInt(ratio * b);
            }
        } else if ((original_color.length = 7)) {
            // #XXXXXX
            hex_color = parseInt(
                original_color.slice(1),
                16
            );
            r = parseInt(original_color.slice(1, 3), 16);
            g = parseInt(original_color.slice(3, 5), 16);
            b = parseInt(original_color.slice(5, 7), 16);
            max_hex_color = parseInt('FF', 16);
            if (ratio > 0) {
                r =
                    r +
                    parseInt(ratio * (max_hex_color - r));
                g =
                    g +
                    parseInt(ratio * (max_hex_color - g));
                b =
                    b +
                    parseInt(ratio * (max_hex_color - b));
            } else if (ratio < 0) {
                r = r + parseInt(ratio * r);
                g = g + parseInt(ratio * g);
                b = b + parseInt(ratio * b);
            }
        }

        return (
            '#' +
            r.toString(16) +
            g.toString(16) +
            b.toString(16)
        );
    }

    ('load user settings');

    // i think this function is the worst function I have ever written
    function loadUserSettings() {
        var tmp_user_settings_dic = GM_getValue(
            'yuketang_user_settings',
            null
        );
        // user_settings_dic = tmp_user_settings_dic;
        if (tmp_user_settings_dic) {
            user_settings = tmp_user_settings_dic;
        } else {
            console.log('failed to get user settings');
            user_settings = default_user_settings;
        }
        var tmp_color_dic = GM_getValue(
            'yuketang_color_set',
            null
        );
        if (tmp_color_dic) {
            color_set = tmp_color_dic;
        } else {
            color_set = default_color_set;
        }
    }
    loadUserSettings();

    //happy birthday
    function isBirthday() {
        var date = new Date();
        var birthday = {
            month: 2,
            day: 15,
        };
        if (
            date.getMonth() + 1 == birthday.month &&
            date.getDate() == birthday.day
        ) {
            return true;
        }
        return false;
    }
    var trigger_birthday = false;
    if (isBirthday()) {
        card_mark_list = [
            'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjQzNzEzNjQ5NzcxIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjMyNzUiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNODUzLjI0NzAzNyA3NzIuOTE4OTA5YTguOTk0OTIgOC45OTQ5MiAwIDAgMC02Ljc2NzI2My0zLjA1ODUxNGgtNDkuNjcwNzQzVjQxMS42NzcxNGMwLTMzLjIxMDE2LTI3LjAyMDg4NC02MC4yMzEwNDQtNjAuMjMxMDQ0LTYwLjIzMTA0NGgtODUuMjcxMTJWMjU5LjQ3OTk2MmMyMC41OTY4MDItMjAuMDQ4OTE4IDI5LjIwNjM5Ny00MC4zMjA2MDIgMjUuMzExMDA3LTYwLjI5NzI3Mi03LjcwMDQ3LTM5LjY1MjMwNS02Mi4yNjYwNC02MC45ODM2MzEtNjQuNTkwMDI4LTYxLjg3NDY5NGE5LjAzNzA2NSA5LjAzNzA2NSAwIDAgMC0xMi4wODk1NTggMTAuMTg3MDE4YzAuMDQ4MTY2IDAuMjQwODI4IDQuNjQxOTU3IDI0LjI4MTQ2OC0wLjA5MDMxMSA1OS4yNDk2NzEtNC4xNDgyNiAzMC42OTk1MyAxNy4wNTA2MTEgNDcuNzU2MTYyIDMzLjM5MDc4MSA1NC41NzE1OXY5MC4xMjM4SDUzNC45MDg3NDlWMjU5LjQ3OTk2MmMyMC42MDI4MjItMjAuMDQ4OTE4IDI5LjIwMDM3Ni00MC4zMjA2MDIgMjUuMzExMDA2LTYwLjI5NzI3Mi03LjcwNjQ5MS0zOS42NTIzMDUtNjIuMjcyMDYtNjAuOTgzNjMxLTY0LjU5MDAyOC02MS44NzQ2OTRhOS4wMzcwNjUgOS4wMzcwNjUgMCAwIDAtMTIuMDg5NTU4IDEwLjE4NzAxOGMwLjA0ODE2NiAwLjI0MDgyOCA0LjYzNTkzNiAyNC4yODE0NjgtMC4wOTYzMzEgNTkuMjQ5NjcxLTQuMTQ4MjYgMzAuNjk5NTMgMTcuMDUwNjExIDQ3Ljc1NjE2MiAzMy4zOTY4MDIgNTQuNTcxNTl2OTAuMTIzOEg0MjEuNTE0OTU4VjI1OS40Nzk5NjJjMjAuNjAyODIyLTIwLjA0ODkxOCAyOS4yMDAzNzYtNDAuMzIwNjAyIDI1LjMxNzAyNy02MC4yOTcyNzItNy43MTI1MTItMzkuNjUyMzA1LTYyLjI3ODA4MS02MC45ODM2MzEtNjQuNTk2MDQ5LTYxLjg3NDY5NGE5LjA0MzA4NiA5LjA0MzA4NiAwIDAgMC0xMi4wODk1NTggMTAuMTg3MDE4YzAuMDQ4MTY2IDAuMjQwODI4IDQuNjM1OTM2IDI0LjI4MTQ2OC0wLjA5NjMzMSA1OS4yNDk2NzEtNC4xNDgyNiAzMC42OTk1MyAxNy4wNjI2NTMgNDcuNzU2MTYyIDMzLjM5NjgwMiA1NC41NzE1OXY5MC4xMjM4SDI5OC42MjA1MDhjLTMzLjIxNjE4MSAwLTYwLjIzMTA0NCAyNy4wMjA4ODQtNjAuMjMxMDQ0IDYwLjIzMTA0NFY3NjkuODU0Mzc0aC00OS42NzA3NDNjLTIuNTk0OTIgMC01LjA1NzM4NSAxLjEwNzgwOC02Ljc3MzI4NCAzLjA1ODUxNGE4Ljk3Njg1OCA4Ljk3Njg1OCAwIDAgMC0yLjE4NTUxMiA3LjA5MjM4YzIuOTM4MSAyMy41NjUwMDUgMjAuODczNzU0IDY4LjE0MjIzOSA2Ny42NjA1ODMgNjguMTQyMjM5aDU5LjQ1NDM3NHYzMC4xMDM0ODFhOS4wMzEwNDQgOS4wMzEwNDQgMCAwIDAgOS4wMzEwNDUgOS4wMzEwNDRoNDAzLjM4NjY0MWE5LjAzMTA0NCA5LjAzMTA0NCAwIDAgMCA5LjAzMTA0NC05LjAzMTA0NHYtMzAuMTAzNDgxaDU5LjQ1NDM3NWM0Ni43ODY4MyAwIDY0LjcxNjQ2My00NC41NzcyMzQgNjcuNjYwNTgzLTY4LjE0MjIzOWE5LjA0MzA4NiA5LjA0MzA4NiAwIDAgMC0yLjE5MTUzMy03LjA4NjM1OXoiIHAtaWQ9IjMyNzYiPjwvcGF0aD48cGF0aCBkPSJNNjE3Ljc0NzUwNyAyMDkuMTY1MDA1YzIuNzE1MzM0LTIwLjEzMzIwOCAyLjYwNjk2MS0zNi44NTg3MDIgMS44NjAzOTUtNDguMzI4MTI4IDE1LjYxNzY4NiA4LjU5MTUzMyAzNS43MjY4MTEgMjMuNDg2NzM2IDM5LjI3OTAyMiA0MS43ODk2NTIgMi41NDY3NTQgMTMuMTEzMDc2LTMuNjEyNDE4IDI3LjI4NTc5NS0xOC4zMDg5MzcgNDIuMTc0OTc2LTguNTczNDcxLTMuNDc5OTYyLTI1Ljg0MDgyOC0xMy4zNDc4ODMtMjIuODMwNDgtMzUuNjM2NXpNNTAxLjM0OTM4OSAyMDkuMTY1MDA1YzIuNzIxMzU1LTIwLjEzMzIwOCAyLjYxMjk4Mi0zNi44NTg3MDIgMS44NjAzOTUtNDguMzI4MTI4IDE1LjYxNzY4NiA4LjU5MTUzMyAzNS43MjY4MTEgMjMuNDg2NzM2IDM5LjI4NTA0MiA0MS43ODk2NTIgMi41NDY3NTQgMTMuMTEzMDc2LTMuNjEyNDE4IDI3LjI4NTc5NS0xOC4zMDg5MzcgNDIuMTc0OTc2LTguNTg1NTEzLTMuNDc5OTYyLTI1Ljg0Njg0OS0xMy4zNDc4ODMtMjIuODM2NS0zNS42MzY1ek0zODcuOTU1NTk3IDIwOS4xNjUwMDVjMi43MjczNzUtMjAuMTMzMjA4IDIuNjEyOTgyLTM2Ljg1ODcwMiAxLjg2NjQxNi00OC4zMjgxMjggMTUuNjExNjY1IDguNTkxNTMzIDM1LjcyNjgxMSAyMy40ODY3MzYgMzkuMjc5MDIyIDQxLjc4OTY1MiAyLjU1Mjc3NSAxMy4xMTMwNzYtMy42MTI0MTggMjcuMjg1Nzk1LTE4LjMwODkzNyA0Mi4xNzQ5NzYtOC41ODU1MTMtMy40Nzk5NjItMjUuODQ2ODQ5LTEzLjM0Nzg4My0yMi44MzY1MDEtMzUuNjM2NXoiIGZpbGw9IiNGRkNDNjYiIHAtaWQ9IjMyNzciPjwvcGF0aD48cGF0aCBkPSJNNzc4Ljc0Njk0MyA2MDQuMzE1MzM0aC01MjIuMjk1MzkxVjQ4MS45NTA3MDZjNC42MDU4MzMgMy4yMzMxMTQgOC40NzExMTkgOS4wNDkxMDYgMTMuMzI5ODIxIDE2Ljc4NTcgNy44NzUwNzEgMTIuNTI5MDY5IDE3LjY2NDcyMiAyOC4xMjI2NzIgMzcuNjU5NDU1IDI4LjEyMjY3MiAyMC4wMDA3NTMgMCAyOS43OTY0MjUtMTUuNTkzNjAzIDM3LjY2NTQ3NS0yOC4xMjI2NzIgNy42NTgzMjUtMTIuMTkxOTEgMTIuODQyMTQ1LTE5LjY2OTYxNCAyMi4zNzI5MDctMTkuNjY5NjE0czE0LjcwMjU0IDcuNDcxNjg0IDIyLjM2MDg2NSAxOS42Njk2MTRjNy44NjkwNSAxMi41MjkwNjkgMTcuNjU4NzAyIDI4LjEyMjY3MiAzNy42NTM0MzQgMjguMTIyNjcyczI5Ljc4NDM4NC0xNS41OTM2MDMgMzcuNjU5NDU0LTI4LjEyMjY3MmM3LjY1MjMwNS0xMi4xOTE5MSAxMi44MzYxMjQtMTkuNjY5NjE0IDIyLjM2MDg2Ni0xOS42Njk2MTQgOS41MzA3NjIgMCAxNC43MDg1NjEgNy40NzE2ODQgMjIuMzY2ODg2IDE5LjY2OTYxNCA3Ljg2OTA1IDEyLjUyOTA2OSAxNy42NjQ3MjIgMjguMTIyNjcyIDM3LjY2NTQ3NSAyOC4xMjI2NzJzMjkuNzk2NDI1LTE1LjU5MzYwMyAzNy42Nzc1MTYtMjguMTIyNjcyYzcuNjUyMzA1LTEyLjE5MTkxIDEyLjg0MjE0NS0xOS42Njk2MTQgMjIuMzc4OTI4LTE5LjY2OTYxNHMxNC43MDg1NjEgNy40NzE2ODQgMjIuMzcyOTA3IDE5LjY2OTYxNGM3Ljg3NTA3MSAxMi41MjkwNjkgMTcuNjY0NzIyIDI4LjEyMjY3MiAzNy42NTk0NTQgMjguMTIyNjcyIDIwLjAxMjc5NCAwIDI5LjgwODQ2Ny0xNS41OTM2MDMgMzcuNjg5NTU4LTI4LjEyMjY3MiA3LjY2NDM0Ni0xMi4xOTE5MSAxMi44NDgxNjYtMTkuNjY5NjE0IDIyLjM5MDk2OS0xOS42Njk2MTRzMTQuNzIwNjAyIDcuNDcxNjg0IDIyLjM5MDk2OSAxOS42Njk2MTRjNi41ODY2NDIgMTAuNDY5OTkxIDE0LjUzMzk2IDIzLjA1MzI0NiAyOC42NTg1MTQgMjYuOTEyNTEydjc4LjY2NjQxNnoiIGZpbGw9IiNFRjYzNTQiIHAtaWQ9IjMyNzgiPjwvcGF0aD48cGF0aCBkPSJNMjk4LjYyMDUwOCAzNjkuNTA4MTg0aDQzNy45NTc0NzljMjMuMjQ1OTA4IDAgNDIuMTY4OTU2IDE4LjkxNzAyNyA0Mi4xNjg5NTYgNDIuMTY4OTU2VjUwNS45MTkwOTdjLTQuNjIzODk1LTMuMjI3MDkzLTguNDk1MjAyLTkuMDQ5MTA2LTEzLjM2NTk0Ni0xNi43OTc3NDItNy44NzUwNzEtMTIuNTI5MDY5LTE3LjY3Njc2NC0yOC4xMTY2NTEtMzcuNjgzNTM3LTI4LjExNjY1MXMtMjkuODA4NDY3IDE1LjU4NzU4Mi0zNy42ODM1MzcgMjguMTE2NjUxYy03LjY1ODMyNSAxMi4xOTE5MS0xMi44NDgxNjYgMTkuNjc1NjM1LTIyLjM5Njk5IDE5LjY3NTYzNS05LjUyNDc0MSAwLTE0LjcwMjU0LTcuNDcxNjg0LTIyLjM2Njg4Ni0xOS42Njk2MTUtNy44NjkwNS0xMi41MjkwNjktMTcuNjY0NzIyLTI4LjEyMjY3Mi0zNy42NjU0NzUtMjguMTIyNjcxcy0yOS43OTY0MjUgMTUuNTkzNjAzLTM3LjY3NzUxNiAyOC4xMjI2NzFjLTcuNjUyMzA1IDEyLjE5MTkxLTEyLjg0MjE0NSAxOS42Njk2MTQtMjIuMzc4OTI4IDE5LjY2OTYxNS05LjUzMDc2MiAwLTE0LjcwODU2MS03LjQ3MTY4NC0yMi4zNjY4ODYtMTkuNjY5NjE1LTcuODY5MDUtMTIuNTI5MDY5LTE3LjY2NDcyMi0yOC4xMjI2NzItMzcuNjY1NDc1LTI4LjEyMjY3MS0xOS45OTQ3MzIgMC0yOS43ODQzODQgMTUuNTkzNjAzLTM3LjY1OTQ1NSAyOC4xMjI2NzEtNy42NTIzMDUgMTIuMTkxOTEtMTIuODM2MTI0IDE5LjY2OTYxNC0yMi4zNjA4NjUgMTkuNjY5NjE1cy0xNC42OTY1MTktNy40NzE2ODQtMjIuMzU0ODQ1LTE5LjY2OTYxNWMtNy44NjkwNS0xMi41MjkwNjktMTcuNjY0NzIyLTI4LjEyMjY3Mi0zNy42NTk0NTQtMjguMTIyNjcxLTIwLjAwMDc1MyAwLTI5Ljc5MDQwNSAxNS41OTM2MDMtMzcuNjY1NDc1IDI4LjEyMjY3MS03LjY1ODMyNSAxMi4xOTE5MS0xMi44MzYxMjQgMTkuNjY5NjE0LTIyLjM3MjkwNyAxOS42Njk2MTUtOS41MjQ3NDEgMC0xNC43MDI1NC03LjQ3MTY4NC0yMi4zNjA4NjYtMTkuNjY5NjE1LTYuNTgwNjIxLTEwLjQ3NjAxMS0xNC41Mjc5NC0yMy4wNTMyNDYtMjguNjI4NDEtMjYuOTEyNTExdi01MC41NDM3NDVjMC4wMTgwNjItMjMuMjQ1OTA4IDE4LjkyOTA2OS00Mi4xNjI5MzUgNDIuMTg3MDE4LTQyLjE2MjkzNXoiIGZpbGw9IiNGRkZGRkYiIHAtaWQ9IjMyNzkiPjwvcGF0aD48cGF0aCBkPSJNMjU2LjQ1MTU1MiA2MjIuMzc3NDIyaDUyMi4yOTUzOTF2MTQ3LjQ4Mjk3M2gtNTIyLjI5NTM5MXoiIGZpbGw9IiNGRkNDNjYiIHAtaWQ9IjMyODAiPjwvcGF0aD48cGF0aCBkPSJNMzI0LjkzNjk3MSA4NDguMTUzNTI4aDM4NS4zMjQ1NTN2MjEuMDcyNDM2aC0zODUuMzI0NTUzek03ODcuNzc3OTg3IDc4Ny45MjI0ODRIMTk5Ljg4NzExMmM0LjM1Mjk2MyAxNS4yMzgzODIgMTYuNDMwNDggNDIuMTY4OTU2IDQ3LjUzMzM5NiA0Mi4xNjg5NTVoNTQwLjM1NzQ3OWMzMS4wOTY4OTYgMCA0My4xNzQ0MTItMjYuOTE4NTMyIDQ3LjUyMTM1NC00Mi4xNjg5NTVoLTQ3LjUyMTM1NHoiIGZpbGw9IiM3QkRERkYiIHAtaWQ9IjMyODEiPjwvcGF0aD48cGF0aCBkPSJNMzUxLjAxODYyNyA2OTYuMTMwOTVtLTIyLjA3MTg3MyAwYTIyLjA3MTg3MiAyMi4wNzE4NzIgMCAxIDAgNDQuMTQzNzQ1IDAgMjIuMDcxODcyIDIyLjA3MTg3MiAwIDEgMC00NC4xNDM3NDUgMFoiIHAtaWQ9IjMyODIiPjwvcGF0aD48cGF0aCBkPSJNNDYyLjA3MDM2NyA2OTYuMTMwOTVtLTIyLjA3MTg3MiAwYTIyLjA3MTg3MiAyMi4wNzE4NzIgMCAxIDAgNDQuMTQzNzQ0IDAgMjIuMDcxODcyIDIyLjA3MTg3MiAwIDEgMC00NC4xNDM3NDQgMFoiIHAtaWQ9IjMyODMiPjwvcGF0aD48cGF0aCBkPSJNNTczLjExMDA2NiA2OTYuMTMwOTVtLTIyLjA3MTg3MiAwYTIyLjA3MTg3MiAyMi4wNzE4NzIgMCAxIDAgNDQuMTQzNzQ0IDAgMjIuMDcxODcyIDIyLjA3MTg3MiAwIDEgMC00NC4xNDM3NDQgMFoiIHAtaWQ9IjMyODQiPjwvcGF0aD48cGF0aCBkPSJNNjg0LjE2NzgyNyA2OTYuMTMwOTVtLTIyLjA3MTg3MiAwYTIyLjA3MTg3MiAyMi4wNzE4NzIgMCAxIDAgNDQuMTQzNzQ0IDAgMjIuMDcxODcyIDIyLjA3MTg3MiAwIDEgMC00NC4xNDM3NDQgMFoiIHAtaWQ9IjMyODUiPjwvcGF0aD48L3N2Zz4=',
            'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjQzNzEzNjQ0ODY5IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjMwOTgiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNMTY4LjQ0OCA0MzQuNjg4djM0MC45OTJDMTY4LjQ0OCA4NTMuNTA0IDMyMi41NiA5MTYuNDggNTEyIDkxNi40OGMxODkuOTUyIDAgMzQzLjU1Mi02Mi45NzYgMzQzLjU1Mi0xNDAuOFY0MzQuNjg4SDE2OC40NDh6IiBmaWxsPSIjRkZFN0I4IiBwLWlkPSIzMDk5Ij48L3BhdGg+PHBhdGggZD0iTTE3OS43MTIgNzI3LjU1MnM4MC4zODQtNzQuNzUyIDE0MC4yODggMCAxMDMuOTM2IDc3LjgyNCAxNzIuNTQ0IDQ4LjY0YzY4LjA5Ni0yOS4xODQgMTAzLjkzNi04My45NjggMTY5LjQ3Mi0zNS44NCA3Mi43MDQgNTMuMjQ4IDExMC4wOCA2MC45MjggMTcyLjU0NC05LjIxNnYtNDguNjRsLTgyLjQzMiAzMi43NjgtMTEwLjU5Mi0zMi43NjgtMTEwLjU5MiAxNi44OTYtOTguMzA0IDQyLjQ5Ni0xNTcuNjk2LTkyLjY3Mi0xMDAuODY0IDMzLjI4IDUuNjMyIDQ1LjA1NnoiIGZpbGw9IiNGOUNDOTEiIHAtaWQ9IjMxMDAiPjwvcGF0aD48cGF0aCBkPSJNNTEyIDk0Mi4wOGMtMTc5LjIgMC0zNjkuNjY0LTU3Ljg1Ni0zNjkuNjY0LTE2My44NFY0NDMuMzkyYzAtMTQuMzM2IDExLjI2NC0yNi4xMTIgMjYuMTEyLTI2LjExMmg2ODcuNjE2YzE0LjMzNiAwIDI2LjExMiAxMS4yNjQgMjYuMTEyIDI2LjExMnYzMzQuMzM2Qzg4MS42NjQgODg0LjIyNCA2OTEuMiA5NDIuMDggNTEyIDk0Mi4wOHpNMTk0LjA0OCA0NjkuNTA0Vjc3OC4yNGMwIDUyLjczNiAxMzYuMTkyIDExMi4xMjggMzE3Ljk1MiAxMTIuMTI4czMxNy45NTItNTkuMzkyIDMxNy45NTItMTEyLjEyOFY0NjkuNTA0SDE5NC4wNDh6IiBmaWxsPSIjMjYyNjI2IiBwLWlkPSIzMTAxIj48L3BhdGg+PHBhdGggZD0iTTE2OC40NDggNjg2LjU5MnM4Ni4wMTYtNzIuMTkyIDE0OC40OC0yNS4wODggNzIuNzA0IDEwMy40MjQgMTQ3Ljk2OCA3Ny4zMTIgMTI0LjQxNi0xMTguNzg0IDI1My40NC0yMi41MjhjNjYuNTYgNDkuNjY0IDEzNy4yMTYtNzQuMjQgMTM3LjIxNi0xMTQuMTc2di0xNDMuMzZIMTY4LjQ0OHYyMjcuODR6IiBmaWxsPSIjRkY2NDY0IiBwLWlkPSIzMTAyIj48L3BhdGg+PHBhdGggZD0iTTE3NC4wOCA1ODguOGExOS40NTYgMTUuODcyIDkwIDEgMCAzMS43NDQgMCAxOS40NTYgMTUuODcyIDkwIDEgMC0zMS43NDQgMFoiIGZpbGw9IiNGRkRFQzciIHAtaWQ9IjMxMDMiPjwvcGF0aD48cGF0aCBkPSJNNDMwLjA4IDc3MS41ODRjLTQwLjQ0OCAwLTY0LTI1LjA4OC04Ny4wNC00OS42NjQtMTIuMjg4LTEzLjMxMi0yNS4wODgtMjYuNjI0LTQxLjk4NC0zOS40MjQtNDQuNTQ0LTMzLjc5Mi0xMTUuNzEyIDIzLjU1Mi0xMTYuNzM2IDI0LjA2NC03LjY4IDYuNjU2LTE4LjQzMiA3LjY4LTI3LjY0OCAzLjU4NC05LjIxNi00LjYwOC0xNC44NDgtMTMuODI0LTE0Ljg0OC0yMy41NTJWNDU4Ljc1MmMwLTE0LjMzNiAxMS4yNjQtMjYuMTEyIDI2LjExMi0yNi4xMTJoNjg3LjYxNmMxNC4zMzYgMCAyNi4xMTIgMTEuMjY0IDI2LjExMiAyNi4xMTJ2MTQzLjM2YzAgMzcuMzc2LTM5LjkzNiAxMTUuNzEyLTkyLjY3MiAxNDIuODQ4LTI5LjE4NCAxNC44NDgtNTkuOTA0IDExLjc3Ni04Ni4wMTYtNy4xNjgtODEuNDA4LTYwLjkyOC0xMjAuODMyLTM2LjM1Mi0xNjkuOTg0LTUuNjMyLTE4LjQzMiAxMS43NzYtMzcuMzc2IDI0LjA2NC01OS45MDQgMzEuNzQ0LTE1Ljg3MiA1LjEyLTMwLjIwOCA3LjY4LTQzLjAwOCA3LjY4eiBtLTE2MS4yOC0xNTEuNTUyYzIwLjk5MiAwIDQzLjUyIDYuMTQ0IDY0IDIwLjk5MiAyMC40OCAxNS4zNiAzNS4zMjggMzEuMjMyIDQ4LjY0IDQ1LjA1NiAyOC4xNiAyOS42OTYgMzguNCA0MC45NiA3NS43NzYgMjguMTYgMTYuMzg0LTYuMTQ0IDMyLjc2OC0xNS44NzIgNDkuMTUyLTI2LjExMiA1Mi43MzYtMzMuMjggMTE4LjI3Mi03NC43NTIgMjI4Ljg2NCA3LjY4IDEwLjI0IDcuNjggMTkuNDU2IDguMTkyIDMxLjc0NCAyLjA0OCAzNC44MTYtMTcuNDA4IDY0LTc4LjMzNiA2NC05Ni4yNTZWNDg0Ljg2NEgxOTQuMDQ4VjY0MGMyMC40OC0xMC43NTIgNDYuNTkyLTE5Ljk2OCA3NC43NTItMTkuOTY4eiIgZmlsbD0iIzI2MjYyNiIgcC1pZD0iMzEwNCI+PC9wYXRoPjxwYXRoIGQ9Ik0xNjguNDQ4IDQ1My4xMmEzNDMuNTUyIDExNS43MTIgMCAxIDAgNjg3LjEwNCAwIDM0My41NTIgMTE1LjcxMiAwIDEgMC02ODcuMTA0IDBaIiBmaWxsPSIjRkY3MTcxIiBwLWlkPSIzMTA1Ij48L3BhdGg+PHBhdGggZD0iTTUxMiA1OTQuOTQ0Yy0xODMuMjk2IDAtMzY5LjY2NC00OC42NC0zNjkuNjY0LTE0MS4zMTJTMzI4LjcwNCAzMTEuODA4IDUxMiAzMTEuODA4czM2OS42NjQgNDguNjQgMzY5LjY2NCAxNDEuMzEyLTE4Ni4zNjggMTQxLjgyNC0zNjkuNjY0IDE0MS44MjR6IG0wLTIzMS45MzZjLTE5NC4wNDggMC0zMTcuOTUyIDUzLjI0OC0zMTcuOTUyIDg5LjZTMzE3LjQ0IDU0Mi43MiA1MTIgNTQyLjcyYzE5NC4wNDggMCAzMTcuOTUyLTUzLjI0OCAzMTcuOTUyLTg5LjYgMC0zNi44NjQtMTI0LjQxNi05MC4xMTItMzE3Ljk1Mi05MC4xMTJ6IiBmaWxsPSIjMjYyNjI2IiBwLWlkPSIzMTA2Ij48L3BhdGg+PHBhdGggZD0iTTQzMy4xNTIgNjQwbS0xOS40NTYgMGExOS40NTYgMTkuNDU2IDAgMSAwIDM4LjkxMiAwIDE5LjQ1NiAxOS40NTYgMCAxIDAtMzguOTEyIDBaIiBmaWxsPSIjRkZERUM3IiBwLWlkPSIzMTA3Ij48L3BhdGg+PHBhdGggZD0iTTc2My45MDQgNjE0LjRtLTE5LjQ1NiAwYTE5LjQ1NiAxOS40NTYgMCAxIDAgMzguOTEyIDAgMTkuNDU2IDE5LjQ1NiAwIDEgMC0zOC45MTIgMFoiIGZpbGw9IiNGRkRFQzciIHAtaWQ9IjMxMDgiPjwvcGF0aD48cGF0aCBkPSJNNzEwLjE0NCAxMTAuMDhMNTYzLjIgNDE1Ljc0NGw1OS4zOTIgMy4wNzIgMTM3LjcyOC0yODQuMTZjNi4xNDQtMTEuNzc2LTAuNTEyLTI3LjEzNi0xNC44NDgtMzMuNzkyLTEzLjMxMi03LjE2OC0yOS4xODQtMi41Ni0zNS4zMjggOS4yMTZ6IiBmaWxsPSIjN0E0ODI2IiBwLWlkPSIzMTA5Ij48L3BhdGg+PHBhdGggZD0iTTYyMi41OTIgNDM0LjE3NmgtMS4wMjRsLTU5LjM5Mi0zLjA3MmMtNS42MzItMC41MTItOS43MjgtMy4wNzItMTIuMjg4LTcuNjhzLTIuNTYtOS43MjgtMC41MTItMTQuODQ4TDY5Ni4zMiAxMDIuOTEyYzQuNjA4LTguNzA0IDExLjc3Ni0xNS44NzIgMjIuMDE2LTE4Ljk0NCAxMC43NTItMy41ODQgMjMuNTUyLTIuNTYgMzQuMzA0IDIuMDQ4IDIwLjk5MiAxMC4yNCAzMS4yMzIgMzQuODE2IDIyLjAxNiA1NC4yNzJMNjM1LjkwNCA0MjQuOTZjLTIuMDQ4IDYuMTQ0LTcuMTY4IDkuMjE2LTEzLjMxMiA5LjIxNnogbS0zNS4zMjgtMzMuMjhsMjUuNiAxLjUzNiAxMzMuNjMyLTI3NC45NDRjMS41MzYtMy41ODQtMC41MTItOS43MjgtNy4xNjgtMTMuMzEyLTMuNTg0LTEuNTM2LTcuNjgtMi4wNDgtMTAuNzUyLTEuMDI0LTEuMDI0IDAuNTEyLTMuMDcyIDEuNTM2LTMuNTg0IDMuMDcybC0xMzcuNzI4IDI4NC42NzJ6IiBmaWxsPSIjMjYyNjI2IiBwLWlkPSIzMTEwIj48L3BhdGg+PHBhdGggZD0iTTUzOS42NDggMTY3LjkzNmw3LjE2OCAyNzYuNDggNTEuMi0yMC40OC02LjE0NC0yNTguMDQ4YzAtMTAuNzUyLTcuNjgtMjguNjcyLTI2LjYyNC0yNi42MjQtMTguOTQ0IDIuMDQ4LTI2LjExMiAxNy40MDgtMjUuNiAyOC42NzJ6IiBmaWxsPSIjN0E0ODI2IiBwLWlkPSIzMTExIj48L3BhdGg+PHBhdGggZD0iTTU0Ni44MTYgNDU5Ljc3NmMtMi41NiAwLTYuMTQ0LTEuMDI0LTguNzA0LTIuNTYtNC42MDgtMi41Ni03LjE2OC03LjY4LTcuMTY4LTEyLjI4OGwtNy4xNjgtMjc2LjQ4Yy0wLjUxMi0xOS40NTYgMTIuMjg4LTQxLjQ3MiAzOS40MjQtNDQuMDMyIDEwLjc1Mi0xLjAyNCAyMC45OTIgMS41MzYgMjguNjcyIDguNzA0IDEwLjI0IDkuMjE2IDE0Ljg0OCAyMy41NTIgMTQuODQ4IDMzLjI4bDYuMTQ0IDI1OC4wNDhjMCA2LjY1Ni0zLjU4NCAxMi4yODgtOS43MjggMTQuODQ4bC01MS4yIDIwLjQ4Yy0xLjUzNi0wLjUxMi0zLjU4NCAwLTUuMTIgMHogbTguMTkyLTI5Mi4zNTJsNi42NTYgMjU0LjQ2NCAxOS45NjgtOC4xOTItNS42MzItMjQ3LjI5NmMwLTMuMDcyLTEuNTM2LTguMTkyLTQuNjA4LTEwLjI0LTEuMDI0LTAuNTEyLTIuMDQ4LTEuNTM2LTUuMTItMS4wMjQtMTAuMjQgMS4wMjQtMTEuMjY0IDkuNzI4LTExLjI2NCAxMi4yODh6IiBmaWxsPSIjMjYyNjI2IiBwLWlkPSIzMTEyIj48L3BhdGg+PHBhdGggZD0iTTI1Mi45MjggMjM3LjA1NmwxMjUuNDQgMjIwLjY3Mmg5OC4zMDRMNTQyLjcyIDM5NC43NTIgNDE1Ljc0NCAxOTQuNTZ6IiBmaWxsPSIjNkQ1MDMwIiBwLWlkPSIzMTEzIj48L3BhdGg+PHBhdGggZD0iTTQ3Ni42NzIgNDcyLjU3NkgzNzguMzY4Yy01LjYzMiAwLTEwLjc1Mi0yLjU2LTEzLjgyNC03LjY4bC0xMjUuOTUyLTIyMC4xNmMtMi4wNDgtNC42MDgtMi41Ni05LjIxNi0xLjAyNC0xMy44MjRzNS42MzItNy42OCAxMC4yNC05LjIxNkw0MTEuMTM2IDE3OS4yYzYuNjU2LTEuNTM2IDEzLjgyNCAxLjAyNCAxNi44OTYgNi42NTZsMTI3LjQ4OCAyMDAuMTkyYzMuNTg0IDYuMTQ0IDIuNTYgMTQuODQ4LTIuMDQ4IDE5LjQ1Nkw0ODcuNDI0IDQ2OC40OGMtMi41NiAyLjU2LTYuNjU2IDQuMDk2LTEwLjc1MiA0LjA5NnogbS04OC41NzYtMzAuNzJINDcxLjA0bDUxLjcxMi00OS42NjQtMTE0LjE3Ni0xNzkuNzEyTDI3Ni40OCAyNDcuMjk2bDExMS42MTYgMTk0LjU2eiIgZmlsbD0iIzI2MjYyNiIgcC1pZD0iMzExNCI+PC9wYXRoPjxwYXRoIGQ9Ik0zMDQuMTI4IDI1OS41ODRsMjEuNTA0IDM5LjQyNCA5OC4zMDQtMjYuNjI0LTI0LjA2NC0zOC40eiIgZmlsbD0iIzU2MkQyMCIgcC1pZD0iMzExNSI+PC9wYXRoPjxwYXRoIGQ9Ik0zMjUuNjMyIDMwOS4yNDhjLTMuNTg0IDAtNy4xNjgtMi4wNDgtOS4yMTYtNS42MzJsLTIyLjAxNi0zOS45MzZjLTEuNTM2LTIuNTYtMS41MzYtNi4xNDQtMC41MTItOS4yMTYgMS4wMjQtMi41NiAzLjU4NC01LjEyIDcuMTY4LTYuMTQ0bDk1Ljc0NC0yNS42YzQuNjA4LTEuMDI0IDkuMjE2IDAuNTEyIDExLjI2NCA0LjYwOGwyNC4wNjQgMzguNGMxLjUzNiAyLjU2IDIuMDQ4IDYuMTQ0IDEuMDI0IDkuMjE2LTEuMDI0IDMuMDcyLTMuNTg0IDUuNjMyLTcuMTY4IDYuMTQ0bC05Ny4yOCAyNi42MjRjLTAuNTEyIDEuNTM2LTIuMDQ4IDEuNTM2LTMuMDcyIDEuNTM2eiBtLTYuMTQ0LTQzLjUybDExLjI2NCAyMC45OTIgNzYuMjg4LTIwLjk5MkwzOTQuMjQgMjQ1Ljc2bC03NC43NTIgMTkuOTY4eiIgZmlsbD0iIzI2MjYyNiIgcC1pZD0iMzExNiI+PC9wYXRoPjxwYXRoIGQ9Ik0zNDguMTYgMzMwLjI0bDIyLjUyOCAzOS40MjQgOTcuMjgtMjYuNjI0LTI0LjA2NC0zOC40eiIgZmlsbD0iIzU2MkQyMCIgcC1pZD0iMzExNyI+PC9wYXRoPjxwYXRoIGQ9Ik0zNzAuNjg4IDM4MC40MTZjLTMuNTg0IDAtNy4xNjgtMi4wNDgtOS4yMTYtNS42MzJsLTIyLjAxNi0zOS45MzZjLTEuNTM2LTIuNTYtMS41MzYtNi42NTYtMC41MTItOS4yMTYgMS4wMjQtMi41NiAzLjU4NC01LjEyIDcuMTY4LTYuMTQ0bDk1LjIzMi0yNS42YzQuNjA4LTEuMDI0IDkuMjE2IDAuNTEyIDExLjI2NCA0LjYwOGwyNC4wNjQgMzguNGMxLjUzNiAyLjU2IDIuMDQ4IDYuMTQ0IDEuMDI0IDkuMjE2LTEuMDI0IDMuMDcyLTMuNTg0IDUuNjMyLTcuMTY4IDYuMTQ0bC05Ny4yOCAyNi42MjRjLTEuMDI0IDEuNTM2LTIuMDQ4IDEuNTM2LTIuNTYgMS41MzZ6IG0tNi42NTYtNDMuNTJsMTEuMjY0IDIwLjk5MiA3Ni4yODgtMjAuOTkyLTEyLjI4OC0xOS45NjgtNzUuMjY0IDE5Ljk2OHoiIGZpbGw9IiMyNjI2MjYiIHAtaWQ9IjMxMTgiPjwvcGF0aD48cGF0aCBkPSJNMzg1LjAyNCAzOTguMzM2bDIyLjUyOCAzOS45MzYgOTcuMjgtMjcuMTM2LTI0LjA2NC0zNy44ODh6IiBmaWxsPSIjNTYyRDIwIiBwLWlkPSIzMTE5Ij48L3BhdGg+PHBhdGggZD0iTTQwNy41NTIgNDQ5LjAyNGMtMy41ODQgMC03LjE2OC0yLjA0OC05LjIxNi01LjYzMmwtMjIuMDE2LTM5LjkzNmMtMS41MzYtMi41Ni0xLjUzNi02LjE0NC0wLjUxMi05LjIxNiAxLjAyNC0yLjU2IDMuNTg0LTUuMTIgNy4xNjgtNi4xNDRsOTUuNzQ0LTI1LjZjNC42MDgtMS4wMjQgOS4yMTYgMC41MTIgMTEuMjY0IDQuNjA4bDI0LjA2NCAzOC40YzEuNTM2IDIuNTYgMi4wNDggNi4xNDQgMS4wMjQgOS4yMTYtMS4wMjQgMy4wNzItMy41ODQgNS42MzItNy4xNjggNi4xNDRsLTk3LjI4IDI2LjYyNGMtMS41MzYgMS41MzYtMi41NiAxLjUzNi0zLjA3MiAxLjUzNnogbS02LjY1Ni00My41MmwxMS4yNjQgMjAuOTkyIDc2LjI4OC0yMC45OTItMTIuMjg4LTIwLjQ4LTc1LjI2NCAyMC40OHoiIGZpbGw9IiMyNjI2MjYiIHAtaWQ9IjMxMjAiPjwvcGF0aD48cGF0aCBkPSJNNzA3LjA3MiA0MzEuNjE2YzAgNTguMzY4LTQ3LjYxNiA1My43Ni0xMDUuNDcyIDUzLjc2LTU4LjM2OCAwLTEwNS40NzIgNC42MDgtMTA1LjQ3Mi01My43NnM0Ny42MTYtMTA1LjQ3MiAxMDUuNDcyLTEwNS40NzJjNTcuODU2LTAuNTEyIDEwNS40NzIgNDcuMTA0IDEwNS40NzIgMTA1LjQ3MnoiIGZpbGw9IiNGQkZGQTYiIHAtaWQ9IjMxMjEiPjwvcGF0aD48cGF0aCBkPSJNNTc5LjU4NCA1MDEuMjQ4Yy0zNC4zMDQgMC02Mi45NzYtMS41MzYtODIuNDMyLTE5Ljk2OC0xMS4yNjQtMTEuMjY0LTE3LjQwOC0yNy42NDgtMTcuNDA4LTQ5LjY2NCAwLTY3LjA3MiA1NC4yNzItMTIwLjgzMiAxMjAuODMyLTEyMC44MzIgNjcuMDcyIDAgMTIwLjgzMiA1NC4yNzIgMTIwLjgzMiAxMjAuODMyIDAgMjIuMDE2LTUuNjMyIDM3LjM3Ni0xNy40MDggNDkuNjY0LTIwLjQ4IDIwLjQ4LTUzLjc2IDIwLjQ4LTkyLjY3MiAxOS45NjhoLTMxLjc0NHogbTIxLjUwNC0zMS4yMzJoMTEuMjY0YzMxLjc0NCAwIDU5LjM5MiAwLjUxMiA3MC42NTYtMTEuMjY0IDUuNjMyLTUuNjMyIDguMTkyLTE0LjMzNiA4LjE5Mi0yNy4xMzYgMC00OS42NjQtNDAuNDQ4LTg5LjYtODkuNi04OS42UzUxMiAzODEuOTUyIDUxMiA0MzEuNjE2YzAgMTMuMzEyIDIuNTYgMjIuMDE2IDguMTkyIDI3LjEzNiAxMS4yNjQgMTEuMjY0IDM5LjQyNCAxMS4yNjQgNzAuNjU2IDExLjI2NGgxMC4yNHoiIGZpbGw9IiMyNjI2MjYiIHAtaWQ9IjMxMjIiPjwvcGF0aD48cGF0aCBkPSJNNTk1LjQ1NiA0NjUuOTJjMCA1MC4xNzYtNDAuNDQ4IDQ2LjA4LTkwLjYyNCA0Ni4wOHMtOTAuMTEyIDMuNTg0LTkwLjExMi00Ni4wOCA0MC40NDgtOTAuNjI0IDkwLjYyNC05MC42MjQgOTAuMTEyIDQwLjQ0OCA5MC4xMTIgOTAuNjI0eiIgZmlsbD0iI0ZGNjRBMyIgcC1pZD0iMzEyMyI+PC9wYXRoPjxwYXRoIGQ9Ik01MjMuMjY0IDUyNy4zNmgtMjcuNjQ4Yy0zMy43OTIgMC02Mi40NjQgMC41MTItODAuODk2LTE3LjkyLTEwLjI0LTEwLjI0LTE1LjM2LTI0LjU3Ni0xNS4zNi00My41MiAwLTU4Ljg4IDQ3LjYxNi0xMDUuOTg0IDEwNS40NzItMTA1Ljk4NHMxMDUuOTg0IDQ3LjYxNiAxMDUuOTg0IDEwNS45ODRjMCAxOC45NDQtNS4xMiAzMy4yOC0xNS4zNiA0My41Mi0xNi4zODQgMTYuODk2LTQxLjk4NCAxNy45Mi03Mi4xOTIgMTcuOTJ6IG0tMTguNDMyLTMxLjIzMmg5LjcyOGMyNS42IDAgNDkuNjY0IDAgNTguODgtOS4yMTYgNC42MDgtNC42MDggNi42NTYtMTEuMjY0IDYuNjU2LTIyLjAxNiAwLTQxLjQ3Mi0zMy43OTItNzQuNzUyLTc0Ljc1Mi03NC43NTItNDEuNDcyIDAtNzQuNzUyIDMzLjc5Mi03NC43NTIgNzQuNzUyIDAgMTAuMjQgMi4wNDggMTcuNDA4IDYuNjU2IDIyLjAxNiA5LjIxNiA5LjIxNiAzMy4yOCA5LjIxNiA1OC44OCA5LjIxNmg4LjcwNHoiIGZpbGw9IiMyNjI2MjYiIHAtaWQ9IjMxMjQiPjwvcGF0aD48cGF0aCBkPSJNNjUzLjgyNCA0MDYuMDE2bS0yMC45OTIgMGEyMC45OTIgMjAuOTkyIDAgMSAwIDQxLjk4NCAwIDIwLjk5MiAyMC45OTIgMCAxIDAtNDEuOTg0IDBaIiBmaWxsPSIjRkZGRkZGIiBwLWlkPSIzMTI1Ij48L3BhdGg+PHBhdGggZD0iTTUzMS45NjggNDM4LjI3Mm0tMTkuOTY4IDBhMTkuOTY4IDE5Ljk2OCAwIDEgMCAzOS45MzYgMCAxOS45NjggMTkuOTY4IDAgMSAwLTM5LjkzNiAwWiIgZmlsbD0iI0ZGRkZGRiIgcC1pZD0iMzEyNiI+PC9wYXRoPjwvc3ZnPg==',
            'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjQzNzEzNjM3NTYxIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjI5MzgiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNODAxLjY4NiA3OTkuNjU0SDIwNC44MzJjNzkuNDQxIDUzLjU0OCAxOTEuMjEzIDg2Ljg5MSAzMTUuMDM4IDg2Ljg5MSAxMjMuNzI5IDAgMjM1LjQyMi0zMy4yOTIgMzE0Ljg1MS04Ni43NjdoLTMwLjU4M2MtMC44MjggMC0xLjYzNS0wLjA4MS0yLjQ1Mi0wLjEyNHpNNzU3LjY4OCA3NTMuMzI5YzAtMTIuODggNS4yMjItMjQuNDkyIDEzLjU5LTMyLjkxIDguNDE3LTguMzY3IDIwLjAzLTEzLjU5IDMyLjg1OS0xMy41OWg2MC40ODRjLTAuOTI2LTAuMDczLTEuODU0LTAuMTQyLTIuNzk5LTAuMTQyaC04Ni44NTdjLTAuODY2IDAuMDQxLTEuNzE1IDAuMTQxLTIuNTkyIDAuMTQxaC00OTBjLTAuODc3IDAtMS43MjYtMC4xMDEtMi41OTItMC4xNDFIMTIzLjE3Yy0zLjI1OSAwLTYuNDAxIDAuNDc4LTkuNDAxIDEuMzA0IDE1LjQxNyAyNS4yMjggMzYuMzA0IDQ4LjY3IDYxLjcwMSA2OS43MjdoNTg5LjE4OGMtNC4zOTItNy4wOTQtNi45Ny0xNS40My02Ljk3LTI0LjM4OXpNODE2LjI4OCA2ODQuNzUxaDQ1LjUzNGMxOC44NjggMCAzNS41ODkgOS4xODUgNDYuMDY5IDIzLjI3NGE0Ni4xNiA0Ni4xNiAwIDAgMSAxNC4zMDggNS45M2MyMS45OTItMzMuNyAzNC4xNTQtNzAuNzM5IDM0LjE1NC0xMDkuNjE0IDAtODguMjM4LTYyLjY1MS0xNjcuMDA1LTE2MC43NDUtMjE4Ljc1NGwzMS4xODcgMjU5Ljg5NWMxLjc1OCAxNC42MzEtMi40MjggMjguNDQ4LTEwLjUwNyAzOS4yNjl6TTE5Ni4wMjIgNjg0Ljc1MWMtMC4wNTQtMC4wNi0wLjExMy0wLjExNy0wLjE2Ny0wLjE3Ny0xMS43NzYtMTMuMjc1LTE3LjA3My0zMC40ODktMTQuOTE2LTQ4LjQ3NCAwLjAxMS0wLjA5MyAwLjA0Ny0wLjE3NiAwLjA2LTAuMjY4IDAuMDEzLTAuMDg5IDAuMDAzLTAuMTc1IDAuMDE4LTAuMjY0bDE4LjM3LTEwNy45ODNhMTkuMDY5IDE5LjA2OSAwIDAgMS0yLjY2NC0zLjQ0NCAxMC44ODQgMTAuODg0IDAgMCAxLTIuNjQzLTguMDk2IDE4LjYyOCAxOC42MjggMCAwIDEgMC4wNTktMy44MzFsMTIuNTI0LTEwNC4zOTdjLTc2LjI5IDUwLjgxMy0xMjMuMjggMTIwLjExNy0xMjMuMjggMTk2LjUyNiAwIDI5LjI5IDYuOTA1IDU3LjUzNyAxOS43MTUgODQuMSA2LjI1OS0yLjM0NiAxMy4wMDQtMy42OSAyMC4wNzItMy42OWg3Mi44NTJ6TTIzNy44MDggNjgzLjkyOGMtNy42Ny0xMC42OTItMTEuNTY5LTI0LjE5NS05Ljg1OS0zOC40NDVsMTMuODI3LTExNS4yMjdjLTcuMDM5IDIuMTItMTQuMTc2IDMuMjU2LTIxLjE2NyAzLjM3NWwtMTcuODk4IDEwNS4yMDhjLTEuMzYxIDExLjYyMyAyLjAyNSAyMi42OTIgOS41NTMgMzEuMTc4IDYuNDYgNy4yOCAxNS40ODcgMTIuMTA2IDI1LjU0NCAxMy45MTF6TTIzMS44NDMgMzkyLjMybC0xNS4xMzggMTE5LjMzMmM4LjQ4MSAwLjUxNSAxNy41MjQtMS4zMDcgMjYuMjE3LTUuMTExbDE1LjM3Mi0xMjguMTNhNDU1LjA1NyA0NTUuMDU3IDAgMCAwLTI2LjQ1MSAxMy45MDl6IiBmaWxsPSIjRTlDQUZGIiBwLWlkPSIyOTM5Ij48L3BhdGg+PHBhdGggZD0iTTc4Ny41NTggMzMyLjU4M2wxMS40MyA5NS40YzAuNTM5IDQuNDk2LTIuODg5IDguMTM2LTcuMzgzIDguNjkzbC0wLjA5MSAwLjAxMmMtNS4zOTkgMC43NzgtOS4wMTYgNS43NTMtMTEuODU0IDEwLjQ5OWwzLjQ1NyAyOC44MTEgMTUuMjQzIDEyNy4wMzYgMy42MDUgMzAuMDMzYTY1LjgxOSA2NS44MTkgMCAwIDEtMTYuMTA2IDUxLjQ5NGMtMC4wNTggMC4wNjUtMC4xMiAwLjEyNS0wLjE3OCAwLjE5aDMwLjYwN2M4LjA3OS0xMC44MjEgMTIuMjY1LTI0LjYzOSAxMC41MDktMzkuMjY5TDc5NS42MSAzODUuNTg4bC02LjM2NS01My4wNDZjLTIuNjc5LTIyLjMyNC0xOC41MzYtNDAuMTY2LTM5LjIxOC00Ni4xMzQgMC4yMjEgMC4yNyAwLjQ2NyAwLjUxOCAwLjY4NCAwLjc5MiAxOS41MDUgNi42MTMgMzQuMjc5IDIzLjg5NSAzNi44NDcgNDUuMzgzek0zNjQuNjQ5IDQyNi45NTJjLTAuOTEzIDAuMTk0LTEuNzU4IDAuNTA4LTIuNTg1IDAuODU0IDAuMzk3IDAuODM1IDAuNzk0IDEuNjcyIDEuMTYxIDIuNTQ2IDAuNjY5IDEuNTYxIDEuMzQgMy4yMjkgMi4wMTggNC45MDYgMy4wMDIgNy40NDkgNS44MzcgMTQuNDgxIDEwLjU4NSAxNi45NTQgNC4wNDIgMi4wODIgOS41NDUgMC40MzkgMTQuNDc3LTIuOTQxYTE5NC40MyAxOTQuNDMgMCAwIDAtMS40NjktMy41NTZjLTQuMzA4LTEwLjI0NS0xMy4zMzUtMjEuMDQ1LTI0LjE4Ny0xOC43NjN6TTY4Mi4wMzQgNDAzLjYyNmMtNC45NjUtNy42MTYtMTQuNTEtMTMuMTk5LTIzLjA2NC0xMC42ODQgMi44NzEgNi4zNDggNC40MTIgMTIuOTMzIDUuODExIDE4LjkyNiAwLjM4OSAxLjY3NCAwLjc3NyAzLjM0NSAxLjE5NyA1YTEzOC4zNSAxMzguMzUgMCAwIDAgMTUuODQzIDM4LjIzNWM2LjM0NyAxMC41MjQgMTYuNzEyIDE5LjY3NCAyNC4yMzEgMTYuODE2YTkuMzY5IDkuMzY5IDAgMCAwIDEuNjQxLTAuODMgMTQ5Ljg3OCAxNDkuODc4IDAgMCAxLTE2LjYzMi00MC40MzVjLTIuMzM0LTkuMjgtMy44NTUtMTkuMDE2LTkuMDI3LTI3LjAyOHpNNTA4LjQ1OSA0NDAuNzQ0Yy0wLjY1OS02Ljk0Ni0xLjU3Mi0xNC40MDEtNi4wODUtMTkuNjc1LTUuMTEyLTUuOTY5LTEzLjA4OC03LjIwOC0yMC44MTktNS4zNjcgMS4zMDUgNC43MDQgMS43NTggOS4yNzggMi4xMDEgMTIuODk1IDEuMTQgMTEuNjYzIDIuMjk3IDIzLjM1NiAzLjQ1MyAzNS4wNDkgMS4xNTEgMTEuNjM1IDIuMzAxIDIzLjI2NyAzLjQ0IDM0Ljg5OSAyLjc2IDI3LjY3NCA5Ljk0OSA0Mi43NTEgMjEuOTc0IDQ2LjA3MiAzLjQ1OSAwLjk2NyA2Ljk5OCAwLjc5OSAxMC40NzgtMC4xMDMtNC40NjYtMTAuMzI0LTYuNTM2LTIyLjY1OS03LjY0Ny0zMy43OTItMi4yODEtMjMuMzI2LTQuNjE0LTQ2LjY1MS02Ljg5NS02OS45Nzh6TTc3Mi4zNzMgNzA2LjgyOGMwLjg3NyAwIDEuNzI2LTAuMTAxIDIuNTkyLTAuMTQxSDI3OS43OGMwLjg2NiAwLjA0MSAxLjcxNSAwLjE0MSAyLjU5MiAwLjE0MWg0OTAuMDAxeiIgZmlsbD0iI0ZBREU0QiIgcC1pZD0iMjk0MCI+PC9wYXRoPjxwYXRoIGQ9Ik0yMzcuODA4IDY4My45MjhjMi44NzggMC41MTcgNS44MjkgMC44MjQgOC44NDMgMC44MjRoNDkwLjAwM2MxMi41MjkgMCAyNC40ODItNS4zNzQgMzIuNzk3LTE0Ljc0N3MxMi4yMjktMjEuODg0IDEwLjczOC0zNC4zMjRsLTMuNjA1LTMwLjAzMy0xNS4yNDQtMTI3LjAzNy0wLjA5Mi0wLjc2NmMtMy45ODQgNi40NC04LjU5NCAxMi43OTMtMTUuNTc1IDE1LjQzNC04LjI4NiAzLjE1My0xNi42MDEgMC4xOTItMjMuNzMyLTUuNDAyLTIuMzg0IDEuODItNS4wNTQgMy4zOTctOC4xMDQgNC41NTItMjEuMDc5IDguMDEyLTQwLjUzOS04Ljk5MS01MC43OTctMjUuOTkxYTE2MC4zMzMgMTYwLjMzMyAwIDAgMS0xOC4zNDYtNDQuMjUxYy0wLjE0My0wLjU2OS0wLjI3Ny0xLjE2Mi0wLjQxNi0xLjc0LTAuMTQ4IDEuNjA0LTAuMjY4IDMuMTktMC4zNzYgNC43MzEtMy4xNDQgNDQuNDItMjEuNzU0IDg3LjYyNC01MS45MjUgMTIwLjM4MS0xMi4xNyAxMy4xODQtMjkuMzYgMjUuNTU2LTQ2LjY1MSAyMC43NC0zLjAzMS0wLjgzOC01LjcyOC0yLjEyOS04LjE4Mi0zLjcyOC02LjY5OCAzLjA1My0xMy4zNzMgNC42MjgtMTkuODczIDQuNjI4LTMuNTk5IDAtNy4xNDQtMC40NzctMTAuNjEtMS40NDEtMzIuMzQyLTguOTM5LTM2LjU1Ni01MS4xNzYtMzcuOTQxLTY1LjA1NC0xLjEzOC0xMS42NDctMi4yODktMjMuMjctMy40MzgtMzQuODk2YTMyMDU4Ljc2NSAzMjA1OC43NjUgMCAwIDEtMy40Ni0zNS4xMDRjLTAuMDUtMC41MjktMC4xMDQtMS4wNTEtMC4xNTgtMS41NzItNy4zNzEgOS4zNzEtMTEuOTI5IDIwLjkxNC0xOS4xNzcgMzAuNDc2LTguMzY3IDExLjE1Ni0yMy41NzkgMTkuODI4LTM2LjAwMyAxMy40MzktMi4yMjEtMS4xNTYtNC4wNzktMi43MDEtNS43MzMtNC40Ni0xMC42NyA2LjU4My0yMy40OCA5LjAzNC0zNS4wMDUgMy4xMDYtMTAuMTM0LTUuMjc2LTE1LjE5Ny0xNC44MDktMTguOTEzLTIzLjU1Ni0xMC4wMzMgMjIuODU1LTIxLjEwMiA0NS44NTEtMzkuMTI5IDYzLjA0Mi0xNi4wMzUgMTUuMzUyLTM4Ljk4NSAyNS4yMTktNjAuNTQzIDIyLjA2OC0yLjEwMi0wLjMwNy0zLjg1Mi0xLjQ4OS01LjAwMy0zLjExNi0wLjEyOCAwLjAzOS0wLjI1NCAwLjA4Ny0wLjM4MiAwLjEyNWwtMTMuODI3IDExNS4yMjdjLTEuNzExIDE0LjI1IDIuMTg5IDI3Ljc1MyA5Ljg1OSAzOC40NDV6IiBmaWxsPSIjRkFERTRCIiBwLWlkPSIyOTQxIj48L3BhdGg+PHBhdGggZD0iTTMxOC4yNTEgMjg0LjI1OGMtMjcuNzg4IDAtNTEuMTE0IDIwLjczOS01NC40NjEgNDguMzI1bC01LjQ5OCA0NS44MjctMTUuMzcyIDEyOC4xM2M3LjY0MS0zLjM0MyAxNS4wMTEtOC4yMDQgMjEuNDc1LTE0LjM5NCAxNi45MjUtMTYuMTM3IDI3LjQ2NC0zOC40MDYgMzcuNjQ1LTYxLjcyNSAzLjE3NS03LjIxMyA5Ljc1NC0yMi4xNTkgMjQuNjEyLTI1LjMwOCAxMy43OTEtMi45MTIgMjcuNDU4IDUuOTY2IDM1LjQxIDIyLjY5MiAwLjgyNy0wLjM0NiAxLjY3My0wLjY2MSAyLjU4NS0wLjg1NCAxMC44NTItMi4yODEgMTkuODc5IDguNTE5IDI0LjE4OCAxOC43NjIgMC40OTggMS4xNjQgMC45ODMgMi4zNTcgMS40NjkgMy41NTZhMzMuNDMgMzMuNDMgMCAwIDAgNy42ODctNy4zNTFjMy4xMDMtNC4wOTUgNS43MjMtOC43NDMgOC40OTUtMTMuNjY0IDQuMjg0LTcuNjAyIDguNzE2LTE1LjQ2MyAxNS40MzMtMjIuMjg4IDcuOTQzLTguMTQ2IDE5LjQ5Mi0xMy4xMjggMzAuMzU3LTEzLjEyOCAwLjM3NiAwIDAuNzUzIDAuMDA2IDEuMTI5IDAuMDE4IDguNjQ1IDAuMjc4IDE2LjMwOCAzLjgxOSAyMS41NzUgOS45NyAzLjM4NiAzLjk1OCA1LjM1MiA4LjQ3NCA2LjU3MyAxMi44NzUgNy43MzEtMS44NCAxNS43MDctMC42MDIgMjAuODE5IDUuMzY3IDQuNTEzIDUuMjc0IDUuNDI2IDEyLjcyOCA2LjA4NSAxOS42NzUgMi4yODIgMjMuMzI2IDQuNjE0IDQ2LjY1MiA2Ljg5NiA2OS45NzggMS4xMTEgMTEuMTMyIDMuMTggMjMuNDY4IDcuNjQ3IDMzLjc5MiAxMC4wNDQtMi42MDQgMTkuNTg0LTExLjQyNSAyNS4xOTMtMTcuNTAyIDI4LjYzNS0zMS4wODkgNDYuMDUzLTcxLjQ3OCA0OS4wNDMtMTEzLjcxOCAwLjgzOS0xMS44NzEgMi4zOTktMzMuOTY1IDIwLjYzNS00MS4yMTIgMTQuNjY1LTUuODY2IDMwLjA0NSAyLjgxOCAzNy42MjYgMTQuNDQ0YTQ5LjA0MSA0OS4wNDEgMCAwIDEgMy40NyA2LjQxNmM4LjU1NC0yLjUxNSAxOC4wOTkgMy4wNjkgMjMuMDY0IDEwLjY4NCA1LjE3MiA4LjAxMiA2LjY5NCAxNy43NDggOS4wMjYgMjcuMDI4YTE0OS44NzggMTQ5Ljg3OCAwIDAgMCAxNi42MzIgNDAuNDM1YzMuNTY4LTIuMjI4IDYuNjY3LTcuMDMyIDEwLTEyLjU3MSAyLjcwNS00LjUzNSA1LjQ0MS05LjA4OSA4LjE3Ny0xMy42MzkgMi43NjYtNC42IDUuNTMtOS4xOTkgOC4yODEtMTMuODExIDIuMzg3LTQuMDY0IDcuODQtMTMuMzQ2IDE3Ljg2My0xNS45MDFsLTExLjA2Ni05Mi4zODhjLTIuNTE1LTIxLjAzNy0xOS42ODUtMzcuMDk4LTQwLjUyNC0zOC41MkgzMTguMjUxeiBtMTk0LjAwNyAxMy44NzNjMTAuMDA4IDAgMTguMTIxIDguMTEzIDE4LjEyMSAxOC4xMjFzLTguMTEzIDE4LjEyMi0xOC4xMjEgMTguMTIyLTE4LjEyMi04LjExMy0xOC4xMjItMTguMTIyYzAuMDAxLTEwLjAwNyA4LjExNC0xOC4xMjEgMTguMTIyLTE4LjEyMXogbS00Ni44MDYgNy4xNTVjNi4wNTggMCAxMC45NjggNC45MTIgMTAuOTY4IDEwLjk2OHMtNC45MSAxMC45NjgtMTAuOTY4IDEwLjk2OEgzMDMuMTg1Yy02LjA1OCAwLTEwLjk2OC00LjkxMi0xMC45NjgtMTAuOTY4czQuOTEtMTAuOTY4IDEwLjk2OC0xMC45NjhoMTYyLjI2N3oiIGZpbGw9IiM3MTJDMDYiIHAtaWQ9IjI5NDIiPjwvcGF0aD48cGF0aCBkPSJNNDQyLjQ4NyA0NTkuNjA4YzcuMjQ4LTkuNTYyIDExLjgwNi0yMS4xMDUgMTkuMTc3LTMwLjQ3Ni0wLjUyMS01LjA0My0xLjI2My05LjYwNS0zLjM0Ni0xMi4wNDMtMC40NjEtMC41MzYtMS44NzMtMi4xODUtNS42MTctMi4zMDQtNC45NS0wLjIxNC0xMS4yIDIuNTI4LTE1LjExIDYuNTM3LTQuNzEgNC43ODMtOC4yNDcgMTEuMDYtMTEuOTkzIDE3LjcwNy0zLjAxIDUuMzQtNi4xMjIgMTAuODY0LTEwLjA5MSAxNi4wOTctMy45NDUgNS4yNTktOS4wNDkgOS45NDEtMTQuNzU2IDEzLjQ2MiAxLjY1MyAxLjc1OSAzLjUxMiAzLjMwNCA1LjczMyA0LjQ2IDEyLjQyNCA2LjM4NyAyNy42MzYtMi4yODQgMzYuMDAzLTEzLjQ0ek03OTEuNTEzIDQzNi42ODhsMC4wOTEtMC4wMTJjNC40OTQtMC41NTggNy45MjItNC4xOTcgNy4zODMtOC42OTNsLTExLjQzLTk1LjRjLTIuNTY4LTIxLjQ4OC0xNy4zNDItMzguNzctMzYuODQ4LTQ1LjM4M2E2NS41MTcgNjUuNTE3IDAgMCAxIDEzLjcwMiAzMi45MjhsMTUuMjQ3IDEyNy4wNThjMi44MzktNC43NDUgNi40NTYtOS43MiAxMS44NTUtMTAuNDk4ek03NDUuNjczIDQ5My4yNzljNi45ODEtMi42NDEgMTEuNTkxLTguOTk0IDE1LjU3NS0xNS40MzRsLTQuODYxLTQwLjUwOGMtMC43MDMgMC43OS0xLjc4OSAyLjIyOS0zLjM2MiA0LjkwNi0yLjggNC42OTQtNS41NzkgOS4zMTUtOC4zNTQgMTMuOTM2LTIuNzI0IDQuNTMyLTUuNDUgOS4wNjQtOC4xNjIgMTMuNjA5LTMuNDI3IDUuNjk4LTcuNzkxIDEyLjkxNS0xNC41NjkgMTguMDg4IDcuMTMxIDUuNTk1IDE1LjQ0NyA4LjU1NiAyMy43MzMgNS40MDN6TTU5MS45NzUgNTQ1LjU1OWMzMC4xNzEtMzIuNzU4IDQ4Ljc4MS03NS45NjEgNTEuOTI1LTEyMC4zODEgMC4xMDktMS41NDEgMC4yMjgtMy4xMjcgMC4zNzYtNC43MzEtMC4yODgtMS4xOTUtMC41NzgtMi4zODYtMC44Ni0zLjU5Ny0xLjYxNi02LjkxOS0zLjE0LTEzLjQ1Ni02LjMxOS0xOC4zODMtMi44MTUtNC4zMTgtOC4xMDMtNy4yMTktMTEuMTAyLTYuMDA3LTUuNDQ3IDIuMTY0LTYuMzc4IDE1LjMxNi02Ljg3NiAyMi4zNzktMy4zMzkgNDcuMTgzLTIyLjc5OSA5Mi4zLTU0Ljc5NyAxMjcuMDQyLTguODQ2IDkuNTgzLTE4LjAzNSAxNi41MjEtMjcuMTggMjAuNjg5IDIuNDUzIDEuNTk5IDUuMTUgMi44OSA4LjE4MiAzLjcyOCAxNy4yOTEgNC44MTcgMzQuNDgyLTcuNTU1IDQ2LjY1MS0yMC43Mzl6TTI0Ny4xNjEgNTMzLjI0NmMyMS41NTggMy4xNTIgNDQuNTA4LTYuNzE2IDYwLjU0My0yMi4wNjggMTguMDI2LTE3LjE5MSAyOS4wOTYtNDAuMTg3IDM5LjEyOS02My4wNDJhMjc0LjAxNSAyNzQuMDE1IDAgMCAxLTEuOTMzLTQuNjc1Yy0wLjYyLTEuNTM2LTEuMjMzLTMuMDYtMS44NjctNC41NDEtMy4xMjEtNy40MTUtOC41MzMtMTIuOTYzLTExLjg0OS0xMi4zNDUtMy44MzkgMC44MTQtNy40OTEgOS4xMS05LjA1MiAxMi42NTQtMTEuMDk5IDI1LjQyNC0yMi43MTkgNDkuODM5LTQyLjU4IDY4Ljc3OS0xMC44ODggMTAuNDI1LTIzLjk0NSAxOC4wMDYtMzcuMzkzIDIyLjEyMiAxLjE0OSAxLjYyNyAyLjkgMi44MDkgNS4wMDIgMy4xMTZ6IiBmaWxsPSIjNzEyQzA2IiBwLWlkPSIyOTQzIj48L3BhdGg+PHBhdGggZD0iTTkyMi4yIDcxMy45NTZhNDYuMTcgNDYuMTcgMCAwIDAtMTQuMzA4LTUuOTNjNy4xMTUgOS41NjUgMTEuMzggMjEuMzY4IDExLjM4IDM0LjE3OSAwIDMxLjY3Ni0yNS43NzMgNTcuNDUtNTcuNDUgNTcuNDVoLTYwLjEzNmMwLjgxNyAwLjA0MyAxLjYyMyAwLjEyNCAyLjQ1MSAwLjEyNGg5My40MDRjMTIuODI5IDAgMjQuNDQyLTUuMTczIDMyLjg1OS0xMy41OSA4LjQxOC04LjQxOCAxMy42NDEtMjAuMDMgMTMuNjQxLTMyLjg1OSAwLTE2LjYyNy04Ljc0My0zMS4xNTUtMjEuODQxLTM5LjM3NHoiIGZpbGw9IiNCQ0VBRkIiIHAtaWQ9IjI5NDQiPjwvcGF0aD48cGF0aCBkPSJNNzcxLjI3OCA3MjAuNDE5Yy04LjM2OCA4LjQxOC0xMy41OSAyMC4wMy0xMy41OSAzMi45MSAwIDguOTU5IDIuNTc4IDE3LjI5NSA2Ljk3IDI0LjM4OWg5Ny4xNjVjMTkuNTgyIDAgMzUuNTE0LTE1LjkzMiAzNS41MTQtMzUuNTE0IDAtMTguNjQxLTE0LjQ0LTMzLjkzOS0zMi43MTUtMzUuMzc1aC02MC40ODRjLTEyLjgzIDAtMjQuNDQzIDUuMjIzLTMyLjg2IDEzLjU5eiIgZmlsbD0iI0JDRUFGQiIgcC1pZD0iMjk0NSI+PC9wYXRoPjxwYXRoIGQ9Ik00NTIuMTU1IDIwNS4xNTl2NDAuMTIyaDI5LjM3NHYtNTMuOTg4aC0xNS41MDhjLTcuNjU4IDAtMTMuODY2IDYuMjA4LTEzLjg2NiAxMy44NjZ6TTUwMS42OTkgMjYyLjE4M2gyMy4zNzRjMS45MzYtMi4zODQgMy4xNDQtNS4zODMgMy4xNDQtOC42OTN2LTE5LjY0MmwtMjMuODU1LTI0LjczOGMtMC4zNDQtMC4zNTctMC42MTItMC43NTQtMC44OTgtMS4xNDF2NDguMjgxYTEwLjg4NSAxMC44ODUgMCAwIDEtMS43NjUgNS45MzN6TTUwNC42NDUgMTkzLjZsMi4zOTMtMi4zMDdoLTMuNTcydjMuNjk5YzAuMzU3LTAuNDg0IDAuNzMxLTAuOTYxIDEuMTc5LTEuMzkyek02MjcuNDI0IDIxMS4zNDZsLTQxLjc5NCA0MC4zMDEgNS41MjIgNS43MjdjNS4zMTYgNS41MTIgMTQuMDk0IDUuNjcyIDE5LjYwNiAwLjM1N2wzNC43OS0zMy41NDhjNS41MTMtNS4zMTYgNS42NzItMTQuMDk0IDAuMzU3LTE5LjYwN2wtMzMuNTQ4LTM0Ljc5Yy0zLjU4Mi0zLjcxNS04LjcyNS00LjkzOC0xMy4zOTMtMy43NTNsMjguNzQgMjkuODA0YzQuMjA2IDQuMzYxIDQuMDgxIDExLjMwNC0wLjI4IDE1LjUwOXoiIGZpbGw9IiNGQURFNEIiIHAtaWQ9IjI5NDYiPjwvcGF0aD48cGF0aCBkPSJNNTU3LjYwNSAyMjIuNTg0bDEyLjc5OCAxMy4yNzIgMzMuODk4LTMyLjY4Ny0yMi40MjMtMjMuMjU0LTIzLjkxNyAyMy4wNjJjLTUuNTEyIDUuMzE2LTUuNjcyIDE0LjA5NC0wLjM1NiAxOS42MDd6IiBmaWxsPSIjRkFERTRCIiBwLWlkPSIyOTQ3Ij48L3BhdGg+PHBhdGggZD0iTTg2MS44MjMgNzk5LjY1NGMzMS42NzYgMCA1Ny40NS0yNS43NzMgNTcuNDUtNTcuNDUgMC0xMi44MS00LjI2Ni0yNC42MTMtMTEuMzgtMzQuMTc5LTEwLjQ4LTE0LjA5LTI3LjIwMi0yMy4yNzQtNDYuMDY5LTIzLjI3NEg3ODUuNjgzYzAuMDU4LTAuMDY1IDAuMTItMC4xMjUgMC4xNzgtMC4xOWE2NS44MiA2NS44MiAwIDAgMCAxNi4xMDYtNTEuNDk0bC0zLjYwNS0zMC4wMzMtMTUuMjQzLTEyNy4wMzYtMy40NTctMjguODExLTE1LjI0Ny0xMjcuMDU4YTY1LjUyNiA2NS41MjYgMCAwIDAtMTMuNzAyLTMyLjkyOGMtMC4yMTctMC4yNzQtMC40NjMtMC41MjItMC42ODQtMC43OTItMTIuMTM0LTE0Ljg0NS0zMC41NDEtMjQuMjI2LTUwLjkyOS0yNC4yMjZINTc0LjcwNWwxMC45MjYtMTAuNTM2IDQxLjc5NC00MC4zMDFjNC4zNjEtNC4yMDUgNC40ODYtMTEuMTQ4IDAuMjgyLTE1LjUwOWwtMjguNzQtMjkuODA0LTI0LjA1OC0yNC45NDljLTQuMjAzLTQuMzU4LTExLjE0Ny00LjQ4My0xNS41MDktMC4yODJsLTUyLjM2MSA1MC40OTEtMi4zOTMgMi4zMDdjLTAuNDQ4IDAuNDMxLTAuODIxIDAuOTA4LTEuMTggMS4zOTJ2LTE0LjgwOGMwLTYuMDU2LTQuOTEtMTAuOTY4LTEwLjk2OC0xMC45NjhoLTc2LjA2NGMtNi4wNTggMC0xMC45NjggNC45MTItMTAuOTY4IDEwLjk2OHY3Ni4wNjVjMCAyLjE5IDAuNjU5IDQuMjIxIDEuNzY2IDUuOTM0SDI4Mi41M2MtMzMuMjQ2IDAtNjEuMzQxIDI0LjkyMy02NS4zNTEgNTcuOTg1bC0xMC41MTUgODcuNjQ4LTEyLjUyNCAxMDQuMzk3YTE4LjY5OSAxOC42OTkgMCAwIDAtMC4wNTkgMy44MzEgMTAuODg2IDEwLjg4NiAwIDAgMCAyLjY0MyA4LjA5NiAxOC45NzkgMTguOTc5IDAgMCAwIDIuNjY0IDMuNDQ0bC0xOC4zNyAxMDcuOTgzYy0wLjAxNSAwLjA4OS0wLjAwNSAwLjE3NS0wLjAxOCAwLjI2NC0wLjAxMyAwLjA5Mi0wLjA0OSAwLjE3Ni0wLjA2IDAuMjY4LTIuMTU3IDE3Ljk4NSAzLjE0IDM1LjE5OSAxNC45MTYgNDguNDc0IDAuMDU0IDAuMDYxIDAuMTEyIDAuMTE3IDAuMTY3IDAuMTc3SDEyMy4xN2MtNy4wNjggMC0xMy44MTIgMS4zNDQtMjAuMDcyIDMuNjktMjEuNzk0IDguMTY3LTM3LjM3OCAyOS4xNTItMzcuMzc4IDUzLjc2MyAwIDMxLjY3NiAyNS43NzIgNTcuNDUgNTcuNDUgNTcuNDVIODYxLjgyM3pNMjAyLjcxMSA2MzguODM4bDE3Ljg5OC0xMDUuMjA4YzYuOTkxLTAuMTE5IDE0LjEyOC0xLjI1NSAyMS4xNjctMy4zNzUgMC4xMjgtMC4wMzggMC4yNTQtMC4wODYgMC4zODItMC4xMjUgMTMuNDQ4LTQuMTE3IDI2LjUwNS0xMS42OTggMzcuMzkzLTIyLjEyMiAxOS44NjEtMTguOTQgMzEuNDgxLTQzLjM1NCA0Mi41OC02OC43NzkgMS41NjEtMy41NDQgNS4yMTMtMTEuODQgOS4wNTItMTIuNjU0IDMuMzE2LTAuNjE4IDguNzI4IDQuOTMgMTEuODQ5IDEyLjM0NSAwLjYzMyAxLjQ4MSAxLjI0NyAzLjAwNSAxLjg2NyA0LjU0MWEyNzQuMDE1IDI3NC4wMTUgMCAwIDAgMS45MzMgNC42NzVjMy43MTYgOC43NDcgOC43NzkgMTguMjggMTguOTEzIDIzLjU1NiAxMS41MjUgNS45MjggMjQuMzM1IDMuNDc3IDM1LjAwNS0zLjEwNiA1LjcwNi0zLjUyMSAxMC44MTEtOC4yMDMgMTQuNzU2LTEzLjQ2MiAzLjk2OS01LjIzMyA3LjA4MS0xMC43NTcgMTAuMDkxLTE2LjA5NyAzLjc0Ni02LjY0NyA3LjI4My0xMi45MjMgMTEuOTkzLTE3LjcwNyAzLjkwOS00LjAwOSAxMC4xNi02Ljc1MSAxNS4xMS02LjUzNyAzLjc0NCAwLjExOSA1LjE1NiAxLjc2OSA1LjYxNyAyLjMwNCAyLjA4MyAyLjQzOCAyLjgyNSA3IDMuMzQ2IDEyLjA0MyAwLjA1NCAwLjUyMSAwLjEwOCAxLjA0MyAwLjE1OCAxLjU3MiAxLjE0NSAxMS43MDIgMi4zMDEgMjMuNDAyIDMuNDYgMzUuMTA0IDEuMTQ5IDExLjYyNiAyLjMgMjMuMjQ5IDMuNDM4IDM0Ljg5NiAxLjM4NSAxMy44NzggNS41OTkgNTYuMTE1IDM3Ljk0MSA2NS4wNTRhMzkuNDU0IDM5LjQ1NCAwIDAgMCAxMC42MSAxLjQ0MWM2LjUgMCAxMy4xNzUtMS41NzUgMTkuODczLTQuNjI4IDkuMTQ1LTQuMTY4IDE4LjMzMy0xMS4xMDYgMjcuMTgtMjAuNjg5IDMxLjk5OC0zNC43NDMgNTEuNDU4LTc5Ljg2IDU0Ljc5Ny0xMjcuMDQyIDAuNDk5LTcuMDYzIDEuNDI5LTIwLjIxNiA2Ljg3Ni0yMi4zNzkgMi45OTktMS4yMTIgOC4yODcgMS42ODkgMTEuMTAyIDYuMDA3IDMuMTggNC45MjcgNC43MDQgMTEuNDY0IDYuMzE5IDE4LjM4MyAwLjI4MiAxLjIxMSAwLjU3MiAyLjQwMiAwLjg2IDMuNTk3IDAuMTM5IDAuNTc4IDAuMjczIDEuMTcxIDAuNDE2IDEuNzRhMTYwLjMzMyAxNjAuMzMzIDAgMCAwIDE4LjM0NiA0NC4yNTFjMTAuMjU4IDE3IDI5LjcxOCAzNC4wMDIgNTAuNzk3IDI1Ljk5MSAzLjA1MS0xLjE1NCA1LjcyLTIuNzMyIDguMTA0LTQuNTUyIDYuNzc4LTUuMTczIDExLjE0MS0xMi4zOSAxNC41NjktMTguMDg4IDIuNzExLTQuNTQ0IDUuNDM4LTkuMDc3IDguMTYyLTEzLjYwOSAyLjc3Ni00LjYyMSA1LjU1NC05LjI0MiA4LjM1NC0xMy45MzYgMS41NzMtMi42NzcgMi42NTgtNC4xMTYgMy4zNjItNC45MDZsNC44NjEgNDAuNTA4IDAuMDkyIDAuNzY2IDE1LjI0MyAxMjcuMDM2IDMuNjA1IDMwLjAzM2MxLjQ5IDEyLjQ0LTIuNDI0IDI0Ljk1LTEwLjczOCAzNC4zMjRzLTIwLjI2OCAxNC43NDctMzIuNzk3IDE0Ljc0N0gyNDYuNjVjLTMuMDE0IDAtNS45NjQtMC4zMDctOC44NDMtMC44MjQtMTAuMDU3LTEuODA1LTE5LjA4NC02LjYzMS0yNS41NDQtMTMuOTExLTcuNTI3LTguNDg2LTEwLjkxMy0xOS41NTUtOS41NTItMzEuMTc4eiBtMzY0LjAyLTQ3NC42MzJsMTUuMTQ3IDE1LjcwOSAyMi40MjMgMjMuMjU0LTMzLjg5OCAzMi42ODctNS4wNjUgNC44ODQtMzcuNTcyLTM4Ljk2MyAzOC45NjUtMzcuNTcxeiBtLTYyLjM2OCA0NC45MDNsMjMuODU1IDI0LjczOCAyNy4zMjMgMjguMzM1SDUwMS43YTEwLjg5MyAxMC44OTMgMCAwIDAgMS43NjYtNS45MzR2LTQ4LjI4MWMwLjI4NSAwLjM4OCAwLjU1MyAwLjc4NiAwLjg5NyAxLjE0MnogbS03Ni45NjItMTcuOTU3aDU0LjEyOHY1NC4xMjloLTU0LjEyOHYtNTQuMTI5eiBtMjcwLjAyNiA5Mi45NjZjMS4wMDkgMCAyLjAwMiAwLjA3MiAyLjk5NSAwLjE0IDIwLjg0IDEuNDIxIDM4LjAwOSAxNy40ODMgNDAuNTI0IDM4LjUybDExLjA2NiA5Mi4zODhjLTEwLjAyMiAyLjU1NS0xNS40NzYgMTEuODM3LTE3Ljg2MyAxNS45MDFhNDU0MC45NTIgNDU0MC45NTIgMCAwIDEtOC4yODEgMTMuODExIDQ1OTEuMDkgNDU5MS4wOSAwIDAgMC04LjE3NyAxMy42MzljLTMuMzM0IDUuNTM5LTYuNDMyIDEwLjM0My0xMCAxMi41NzFhOS4zNjkgOS4zNjkgMCAwIDEtMS42NDEgMC44M2MtNy41MTkgMi44NTgtMTcuODg0LTYuMjkyLTI0LjIzMS0xNi44MTZhMTM4LjM1IDEzOC4zNSAwIDAgMS0xNS44NDMtMzguMjM1IDI2NC4wNzIgMjY0LjA3MiAwIDAgMS0xLjE5Ny01Yy0xLjM5OS01Ljk5My0yLjk0LTEyLjU3OC01LjgxMS0xOC45MjZhNDkuMjI1IDQ5LjIyNSAwIDAgMC0zLjQ3LTYuNDE2Yy03LjU4LTExLjYyNi0yMi45NjEtMjAuMzExLTM3LjYyNi0xNC40NDQtMTguMjM2IDcuMjQ3LTE5Ljc5NyAyOS4zNDEtMjAuNjM1IDQxLjIxMi0yLjk5IDQyLjI0LTIwLjQwOSA4Mi42MjktNDkuMDQzIDExMy43MTgtNS42MDkgNi4wNzgtMTUuMTQ5IDE0Ljg5OC0yNS4xOTMgMTcuNTAyLTMuNDggMC45MDMtNy4wMTkgMS4wNy0xMC40NzggMC4xMDMtMTIuMDI1LTMuMzItMTkuMjE0LTE4LjM5OC0yMS45NzQtNDYuMDcyLTEuMTM4LTExLjYzMi0yLjI4OS0yMy4yNjQtMy40NC0zNC44OTktMS4xNTctMTEuNjkzLTIuMzE0LTIzLjM4Ni0zLjQ1My0zNS4wNDktMC4zNDMtMy42MTctMC43OTYtOC4xOTEtMi4xMDEtMTIuODk1LTEuMjIxLTQuNDAxLTMuMTg3LTguOTE2LTYuNTczLTEyLjg3NS01LjI2Ny02LjE1MS0xMi45MjktOS42OTItMjEuNTc1LTkuOTdhMzUuNDIyIDM1LjQyMiAwIDAgMC0xLjEyOS0wLjAxOGMtMTAuODY1IDAtMjIuNDE1IDQuOTgyLTMwLjM1NyAxMy4xMjgtNi43MTcgNi44MjQtMTEuMTQ4IDE0LjY4Ni0xNS40MzMgMjIuMjg4LTIuNzczIDQuOTIxLTUuMzkyIDkuNTY5LTguNDk1IDEzLjY2NGEzMy40MyAzMy40MyAwIDAgMS03LjY4NyA3LjM1MWMtNC45MzIgMy4zOC0xMC40MzUgNS4wMjMtMTQuNDc3IDIuOTQxLTQuNzQ4LTIuNDczLTcuNTgzLTkuNTA1LTEwLjU4NS0xNi45NTQtMC42NzgtMS42NzctMS4zNS0zLjM0NS0yLjAxOC00LjkwNmE2MS4zMiA2MS4zMiAwIDAgMC0xLjE2MS0yLjU0NmMtNy45NTItMTYuNzI2LTIxLjYxOS0yNS42MDQtMzUuNDEtMjIuNjkyLTE0Ljg1NyAzLjE0OS0yMS40MzcgMTguMDk1LTI0LjYxMiAyNS4zMDgtMTAuMTgxIDIzLjMxOS0yMC43MjEgNDUuNTg4LTM3LjY0NSA2MS43MjUtNi40NjUgNi4xOS0xMy44MzQgMTEuMDUtMjEuNDc1IDE0LjM5NC04LjY5MyAzLjgwNC0xNy43MzYgNS42MjYtMjYuMjE3IDUuMTExbDE1LjEzOC0xMTkuMzMyIDguODI3LTY5LjU3OGMyLjY0My0yMi4wMTggMjEuMzU5LTM4LjYyMyA0My41MzUtMzguNjIzaDQxMy4yMjF6IG0tNTc0LjI1NyA0OTMuNmMtMTkuNTgyIDAtMzUuNTE0LTE1LjkzMi0zNS41MTQtMzUuNTE0IDAtMTYuMzI2IDExLjA4NS0zMC4wNzcgMjYuMTEzLTM0LjIxMyAzLTAuODI2IDYuMTQzLTEuMzA0IDkuNDAxLTEuMzA0aDczOC42NTFjMC45NDUgMCAxLjg3MiAwLjA2OSAyLjc5OSAwLjE0MiAxOC4yNzUgMS40MzYgMzIuNzE1IDE2LjczNSAzMi43MTUgMzUuMzc1IDAgMTkuNTgyLTE1LjkzMiAzNS41MTQtMzUuNTE0IDM1LjUxNEgxMjMuMTd6IiBmaWxsPSIjMjMxODE1IiBwLWlkPSIyOTQ4Ij48L3BhdGg+PHBhdGggZD0iTTI5Mi4yMTcgMzE2LjI1NGMwIDYuMDU2IDQuOTEgMTAuOTY4IDEwLjk2OCAxMC45NjhoMTYyLjI2N2M2LjA1OCAwIDEwLjk2OC00LjkxMiAxMC45NjgtMTAuOTY4cy00LjkxLTEwLjk2OC0xMC45NjgtMTAuOTY4SDMwMy4xODVjLTYuMDU4IDAtMTAuOTY4IDQuOTEyLTEwLjk2OCAxMC45Njh6TTUxMi4yNTggMzM0LjM3NGMxMC4wMDggMCAxOC4xMjEtOC4xMTMgMTguMTIxLTE4LjEyMiAwLTEwLjAwOC04LjExMy0xOC4xMjEtMTguMTIxLTE4LjEyMXMtMTguMTIyIDguMTEzLTE4LjEyMiAxOC4xMjFjMC4wMDEgMTAuMDA5IDguMTE0IDE4LjEyMiAxOC4xMjIgMTguMTIyeiIgZmlsbD0iI0ZGRkZGRiIgcC1pZD0iMjk0OSI+PC9wYXRoPjwvc3ZnPg==',
            'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjQzNzEzNjI4ODA3IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjI3NzQiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNNS4wNzkwNCA2NDQuMjE4ODhhNTA2LjkyMDk2IDIxMS44NjU2IDAgMSAwIDEwMTMuODQxOTIgMCA1MDYuOTIwOTYgMjExLjg2NTYgMCAxIDAtMTAxMy44NDE5MiAwWiIgZmlsbD0iI0VFRUVFRSIgcC1pZD0iMjc3NSI+PC9wYXRoPjxwYXRoIGQ9Ik05MjMuNTg2NTYgNjQ0LjIxODg4YzAgOTEuNjg4OTYtMTg0LjIzODA4IDE2NS45Njk5Mi00MTEuNTY2MDggMTY1Ljk2OTkyLTIyNy4zNjg5NiAwLTQxMS42ODg5Ni03NC4zMDE0NC00MTEuNjg4OTYtMTY1Ljk2OTkyIDAtOTEuNjY4NDggMTg0LjMyLTE2NS45Njk5MiA0MTEuNjg4OTYtMTY1Ljk2OTkyIDIyNy4zMjggMC4wMjA0OCA0MTEuNTY2MDggNzQuMzAxNDQgNDExLjU2NjA4IDE2NS45Njk5MnoiIGZpbGw9IiNCRUJFQkUiIG9wYWNpdHk9Ii41IiBwLWlkPSIyNzc2Ij48L3BhdGg+PHBhdGggZD0iTTE4OS4xOTQyNCA0NTYuODQ3MzZoNjQ1LjU5MTA0djI5Mi45NjY0SDE4OS4xOTQyNHoiIGZpbGw9IiNGRUI5MDYiIHAtaWQ9IjI3NzciPjwvcGF0aD48cGF0aCBkPSJNMTg5LjE5NDI0IDQ1Ni44NDczNmg2NDUuNTkxMDR2MjkyLjk2NjRIMTg5LjE5NDI0eiIgZmlsbD0iI0ZDRDM0NSIgcC1pZD0iMjc3OCI+PC9wYXRoPjxwYXRoIGQ9Ik0xODkuMTk0MjQgNTc0LjU2NjRoNjQ1LjU5MTA0djExMy43NDU5MkgxODkuMTk0MjR6IiBmaWxsPSIjQzE3NzUwIiBwLWlkPSIyNzc5Ij48L3BhdGg+PHBhdGggZD0iTTE4OS4xOTQyNCA0NTYuODQ3MzZoNjQ1LjU5MTA0djM5Ljk5NzQ0SDE4OS4xOTQyNHoiIGZpbGw9IiM4MjI5MTciIHAtaWQ9IjI3ODAiPjwvcGF0aD48cGF0aCBkPSJNMTg5LjE5NDI0IDQ1Ni44NDczNmg2NDUuNTkxMDR2MzkuOTk3NDRIMTg5LjE5NDI0ek0xODkuMTk0MjQgNjAzLjM0MDhoNjQ1LjU5MTA0djU2LjE1NjE2SDE4OS4xOTQyNHoiIGZpbGw9IiNCMzVGM0EiIHAtaWQ9IjI3ODEiPjwvcGF0aD48cGF0aCBkPSJNNjE0LjYyNTI4IDIyNS41NjY3MkwxODkuMTk0MjQgNDU2Ljg0NzM2aDc1LjY1MzEyYzE5Ljk4ODQ4IDAgMTQuOTcwODggOS4yMzY0OCAxMC42OTA1NiAyNS43MDI0LTQuMjgwMzIgMTYuNDQ1NDQtOS45NzM3NiAzNy4xNzEyIDEyLjE4NTYgMzYuNDU0NCAyMi4xNzk4NC0wLjY5NjMyIDQuOTk3MTItNjIuMTU2OCAxNi40NDU0NC02Mi4xNTY4aDgyLjk2NDQ4YzMxLjQ3Nzc2IDAgMTUuMDExODQgNzUuNzM1MDQgNDIuMjI5NzYgNzIuOTA4OCAyNy4xNTY0OC0yLjg4NzY4IDIwLjAyOTQ0LTcyLjkwODggMzMuNjA3NjgtNzIuOTA4OGg1NC4zNzQ0YzE1Ljc0OTEyIDAgMTQuOTkxMzYgMzcuMTMwMjQgMzAuNzQwNDggNTMuNTc1NjhzNDMuNjIyNCA1LjAxNzYgNzAuNzk5MzYtMjUuNzYzODRjNi4xNjQ0OC02Ljk2MzIgMjUuMDY3NTItMjcuODExODQgNTAuNzkwNC0yNy44MTE4NGgxNjUuMTA5NzZsLTIyMC4xNi0yMzEuMjgwNjR6IiBmaWxsPSIjRkZERTVEIiBwLWlkPSIyNzgyIj48L3BhdGg+PHBhdGggZD0iTTU0NC42MjQ2NCAzOTcuNzgzMDRjMCAxMy4yOTE1Mi0xNy45ODE0NCAyNC4xMDQ5Ni00MC4xODE3NiAyNC4xMDQ5Ni0yMi4xNzk4NCAwLTQwLjIyMjcyLTEwLjc5Mjk2LTQwLjIyMjcyLTI0LjEwNDk2IDAtMTMuMzczNDQgMTguMDQyODgtMjQuMTg2ODggNDAuMjIyNzItMjQuMTg2ODggMjIuMjAwMzIgMCA0MC4xODE3NiAxMC44MTM0NCA0MC4xODE3NiAyNC4xODY4OHoiIGZpbGw9IiNGQ0QzNDUiIHAtaWQ9IjI3ODMiPjwvcGF0aD48cGF0aCBkPSJNMzU1LjEwMjcyIDM4OS43MTM5MmEyNS4yNTE4NCAxNS4xMzQ3MiAwIDEgMCA1MC41MDM2OCAwIDI1LjI1MTg0IDE1LjEzNDcyIDAgMSAwLTUwLjUwMzY4IDBaIiBmaWxsPSIjRkNEMzQ1IiBwLWlkPSIyNzg0Ij48L3BhdGg+PHBhdGggZD0iTTU0My41MTg3MiAzMzAuMTc4NTZhMzYuNzYxNiAyMi4wNzc0NCAwIDEgMCA3My41MjMyIDAgMzYuNzYxNiAyMi4wNzc0NCAwIDEgMC03My41MjMyIDBaIiBmaWxsPSIjRkNEMzQ1IiBwLWlkPSIyNzg1Ij48L3BhdGg+PHBhdGggZD0iTTY1OC4zOTEwNCA0MDUuMjM3NzZhNDEuNTUzOTIgMjQuOTI0MTYgMCAxIDAgODMuMTA3ODQgMCA0MS41NTM5MiAyNC45MjQxNiAwIDEgMC04My4xMDc4NCAwWiIgZmlsbD0iI0ZDRDM0NSIgcC1pZD0iMjc4NiI+PC9wYXRoPjxwYXRoIGQ9Ik03MjEuNTkyMzIgMjM4LjMwNTI4cy0yLjUzOTUyLTMzLjY4OTYgMzAuNzItNzAuMzg5NzZsMjguNTkwMDggMTUuNzkwMDhzLTQzLjA4OTkyIDE1Ljc5MDA4LTQ5LjY2NCA1Ny41ODk3NmwtOS42NDYwOC0yLjk5MDA4eiIgZmlsbD0iIzlGRTI4MyIgcC1pZD0iMjc4NyI+PC9wYXRoPjxwYXRoIGQ9Ik03MDAuNDU2OTYgMzA5LjM1MDRtLTc2LjM2OTkyIDBhNzYuMzY5OTIgNzYuMzY5OTIgMCAxIDAgMTUyLjczOTg0IDAgNzYuMzY5OTIgNzYuMzY5OTIgMCAxIDAtMTUyLjczOTg0IDBaIiBmaWxsPSIjRkY2RjU2IiBwLWlkPSIyNzg4Ij48L3BhdGg+PHBhdGggZD0iTTY4Ny41MzQwOCAyNzguNjA5OTJtLTMwLjc4MTQ0IDBhMzAuNzgxNDQgMzAuNzgxNDQgMCAxIDAgNjEuNTYyODggMCAzMC43ODE0NCAzMC43ODE0NCAwIDEgMC02MS41NjI4OCAwWiIgZmlsbD0iI0ZGRkZGRiIgcC1pZD0iMjc4OSI+PC9wYXRoPjwvc3ZnPg==',
        ];
        var year = GM_getValue(
            'yeketang_birthday_year',
            null
        );
        var date = new Date();
        if (year == null || year != date.getFullYear()) {
            // 没有祝贺过，祝贺
            trigger_birthday = true; // 彩虹屁变成生日快乐
            GM_setValue(
                'yeketang_birthday_year',
                date.getFullYear()
            );
            // 放烟花
            waitForKeyElements('#app', setFirework);
        }
    }

    function setFirework(jNode) {
        var app = document.querySelector('#app');
        var new_node = document.createElement('div');
        new_node.innerHTML = getFireworkHTML();
        GM_addStyle(getFireworkCss());
        app.appendChild(new_node);
    }

    function getFireworkCss() {
        return `
        #firework-container {
            position: absolute;
            top: 50%;
            left: 50%;
            -webkit-transform: translate(-50%, -50%);
            transform: translate(-50%, -50%);
            width: 100%;
            height: 100%;
        }
        
        .firework-grp {
            display: block;
            width: 100%;
            height: 100%;
            position: absolute;
        }
        
        .firework {
            font-size: 10px;
            display: block;
            width: 8.5em;
            height: 8.5em;
            position: absolute;
        }
        /*位置，颜色，大小都可调*/
        
        .pos1 {
            left: 10%;
            top: 5%;
            color: #F44336;
            -webkit-transform: scale(0.5);
            transform: scale(0.5);
        }
        
        .pos2 {
            left: 65%;
            top: 10%;
            color: #FFC107;
            -webkit-transform: scale(0.6);
            transform: scale(0.6);
        }
        
        .pos3 {
            left: 60%;
            top: 35%;
            color: #F44336;
            -webkit-transform: scale(0.8);
            transform: scale(0.8);
        }
        
        .pos4 {
            left: 15%;
            top: 30%;
            color: #FFC107;
            -webkit-transform: scale(1);
            transform: scale(1);
        }
        /*烟花*/
        
        .drops-grp {
            display: block;
            width: 8.5em;
            height: 8.5em;
            position: absolute;
        }
        
        .drops-grp2 {
            display: block;
            width: 8.5em;
            height: 8.5em;
            position: absolute;
            -webkit-transform: rotate(45deg);
            transform: rotate(45deg);
        }
        
        .drop {
            display: block;
            width: 1em;
            height: 2em;
            overflow: hidden;
            position: absolute;
            opacity: 0;
        }
        
        .drop:before {
            content: "";
            display: block;
            width: 1em;
            height: 1em;
            background: currentColor;
            border-radius: 50%;
        }
        
        .drop:after {
            content: "";
            display: block;
            position: relative;
            top: -0.4em;
            width: 0;
            height: 0;
            border-top: 1.4em solid currentColor;
            border-left: 0.5em solid transparent;
            border-right: 0.5em solid transparent;
        }
        /*烟花绽放的速度，次数，方式也可以调节*/
        
        .drop-1 {
            left: 3.75em;
            top: 0;
            -webkit-animation: drop1anim 1.5s ease-in-out infinite;
            animation: drop1anim 1.5s ease-in-out infinite;
        }
        
        .drop-2 {
            top: 3.25em;
            right: 0;
            -webkit-animation: drop2anim 1.5s ease-in-out infinite;
            animation: drop2anim 1.5s ease-in-out infinite;
        }
        
        .drop-3 {
            left: 3.75em;
            bottom: 0;
            -webkit-animation: drop3anim 1.5s ease-in-out infinite;
            animation: drop3anim 1.5s ease-in-out infinite;
        }
        
        .drop-4 {
            top: 3.25em;
            left: 0;
            -webkit-animation: drop4anim 1.5s ease-in-out infinite;
            animation: drop4anim 1.5s ease-in-out infinite;
        }
        /*延迟时间*/
        
        .delay1 .drop {
            -webkit-animation-delay: 0.5s;
            animation-delay: 0.5s
        }
        
        .delay2 .drop {
            -webkit-animation-delay: 1s;
            animation-delay: 1s
        }
        /*动画*/
        
        @-webkit-keyframes drop1anim {
            0% {
                top: 3.25em;
                opacity: 0;
                -webkit-transform: scale(0.3);
                transform: scale(0.3);
            }
            25% {
                opacity: 0;
            }
            50% {
                opacity: 1;
                -webkit-transform: scale(1);
                transform: scale(1);
            }
            100% {
                top: -0.75em;
                opacity: 0;
                -webkit-transform: scale(0.3);
                transform: scale(0.3);
            }
        }
        
        @keyframes drop1anim {
            0% {
                top: 3.25em;
                opacity: 0;
                -webkit-transform: scale(0.3);
                transform: scale(0.3);
            }
            25% {
                opacity: 0;
            }
            50% {
                opacity: 1;
                -webkit-transform: scale(1);
                transform: scale(1);
            }
            100% {
                top: -0.75em;
                opacity: 0;
                -webkit-transform: scale(0.3);
                transform: scale(0.3);
            }
        }
        
        @-webkit-keyframes drop2anim {
            0% {
                right: 3.75em;
                opacity: 0;
                -webkit-transform: scale(0.3) rotate(90deg);
                transform: scale(0.3) rotate(90deg);
            }
            25% {
                opacity: 0;
            }
            50% {
                opacity: 1;
                -webkit-transform: scale(1) rotate(90deg);
                transform: scale(1) rotate(90deg);
            }
            100% {
                right: -0.25em;
                opacity: 0;
                -webkit-transform: scale(0.3) rotate(90deg);
                transform: scale(0.3) rotate(90deg);
            }
        }
        
        @keyframes drop2anim {
            0% {
                right: 3.75em;
                opacity: 0;
                -webkit-transform: scale(0.3) rotate(90deg);
                transform: scale(0.3) rotate(90deg);
            }
            25% {
                opacity: 0;
            }
            50% {
                opacity: 1;
                -webkit-transform: scale(1) rotate(90deg);
                transform: scale(1) rotate(90deg);
            }
            100% {
                right: -0.25em;
                opacity: 0;
                -webkit-transform: scale(0.3) rotate(90deg);
                transform: scale(0.3) rotate(90deg);
            }
        }
        
        @-webkit-keyframes drop3anim {
            0% {
                bottom: 3.25em;
                opacity: 0;
                -webkit-transform: scale(0.3) rotate(180deg);
                transform: scale(0.3) rotate(180deg);
            }
            25% {
                opacity: 0;
            }
            50% {
                opacity: 1;
                -webkit-transform: scale(1) rotate(180deg);
                transform: scale(1) rotate(180deg);
            }
            100% {
                bottom: -0.75em;
                opacity: 0;
                -webkit-transform: scale(0.3) rotate(180deg);
                transform: scale(0.3) rotate(180deg);
            }
        }
        
        @keyframes drop3anim {
            0% {
                bottom: 3.25em;
                opacity: 0;
                -webkit-transform: scale(0.3) rotate(180deg);
                transform: scale(0.3) rotate(180deg);
            }
            25% {
                opacity: 0;
            }
            50% {
                opacity: 1;
                -webkit-transform: scale(1) rotate(180deg);
                transform: scale(1) rotate(180deg);
            }
            100% {
                bottom: -0.75em;
                opacity: 0;
                -webkit-transform: scale(0.3) rotate(180deg);
                transform: scale(0.3) rotate(180deg);
            }
        }
        
        @-webkit-keyframes drop4anim {
            0% {
                left: 3.75em;
                opacity: 0;
                -webkit-transform: scale(0.3) rotate(-90deg);
                transform: scale(0.3) rotate(-90deg);
            }
            25% {
                opacity: 0;
            }
            50% {
                opacity: 1;
                -webkit-transform: scale(1) rotate(-90deg);
                transform: scale(1) rotate(-90deg);
            }
            100% {
                left: -0.25em;
                opacity: 0;
                -webkit-transform: scale(0.3) rotate(-90deg);
                transform: scale(0.3) rotate(-90deg);
            }
        }
        
        @keyframes drop4anim {
            0% {
                left: 3.75em;
                opacity: 0;
                -webkit-transform: scale(0.3) rotate(-90deg);
                transform: scale(0.3) rotate(-90deg);
            }
            25% {
                opacity: 0;
            }
            50% {
                opacity: 1;
                -webkit-transform: scale(1) rotate(-90deg);
                transform: scale(1) rotate(-90deg);
            }
            100% {
                left: -0.25em;
                opacity: 0;
                -webkit-transform: scale(0.3) rotate(-90deg);
                transform: scale(0.3) rotate(-90deg);
            }
        }
        `;
    }

    function getFireworkHTML() {
        return `
        <div id="firework-container">
        <div class="firework-grp">
            <div class="firework pos1 ">
                <div class="drops-grp">
                    <span class="drop drop-1"></span>
                    <span class="drop drop-2"></span>
                    <span class="drop drop-3"></span>
                    <span class="drop drop-4"></span>
                </div>
                <div class="drops-grp drops-grp2">
                    <span class="drop drop-1"></span>
                    <span class="drop drop-2"></span>
                    <span class="drop drop-3"></span>
                    <span class="drop drop-4"></span>
                </div>
            </div>
            <div class="firework pos2 delay1">
                <div class="drops-grp">
                    <span class="drop drop-1"></span>
                    <span class="drop drop-2"></span>
                    <span class="drop drop-3"></span>
                    <span class="drop drop-4"></span>
                </div>
                <div class="drops-grp drops-grp2">
                    <span class="drop drop-1"></span>
                    <span class="drop drop-2"></span>
                    <span class="drop drop-3"></span>
                    <span class="drop drop-4"></span>
                </div>
            </div>
            <div class="firework pos3 delay2">
                <div class="drops-grp">
                    <span class="drop drop-1"></span>
                    <span class="drop drop-2"></span>
                    <span class="drop drop-3"></span>
                    <span class="drop drop-4"></span>
                </div>
                <div class="drops-grp drops-grp2">
                    <span class="drop drop-1"></span>
                    <span class="drop drop-2"></span>
                    <span class="drop drop-3"></span>
                    <span class="drop drop-4"></span>
                </div>
            </div>
            <div class="firework pos4 ">
                <div class="drops-grp">
                    <span class="drop drop-1"></span>
                    <span class="drop drop-2"></span>
                    <span class="drop drop-3"></span>
                    <span class="drop drop-4"></span>
                </div>
                <div class="drops-grp drops-grp2">
                    <span class="drop drop-1"></span>
                    <span class="drop drop-2"></span>
                    <span class="drop drop-3"></span>
                    <span class="drop drop-4"></span>
                </div>
            </div>
        </div>
    </div>
        `;
    }

    if (user_settings.enable_left_menu) {
        ('left menu');
        // the menu on the left
        var index_left_menu_style = `.left__menu  {background-color:${color_set.background_color_subordinate} !important; color :${color_set.text_color_secondary} !important;}`;
        GM_addStyle(index_left_menu_style);
        // set menu corresponding to text color
        var index_left_menu_button_style = `.left__menu  .top ul ,.bottom .downloadbtn ,#app > div.left__menu > div.bottom > a{color:${color_set.text_color_secondary} !important};`;
        GM_addStyle(index_left_menu_button_style);
        //set its style when clicked on
        // ps: originally, the button change it's color, now , it creates a new border.
        var index_left_menu_isactive_style = `.left__menu .top ul li.active{background-color:${color_set.background_color_subordinate} !important; color:${color_set.text_color_main}!important;border:3px solid ${color_set.text_color_main}; border-radius:8px;}`;
        GM_addStyle(index_left_menu_isactive_style);
        ('left menu');
        // the menu on the left
        var repo_paper_left_menu_style = `.left__menu  {background-color:${color_set.background_color_subordinate} !important; color :${color_set.text_color_secondary} !important;}`;
        GM_addStyle(repo_paper_left_menu_style);
        // set menu corresponding to text color
        var repo_paper_left_menu_button_style = `.left__menu  .top ul ,.bottom .downloadbtn ,#app > div.left__menu > div.bottom > a{color:${color_set.text_color_secondary} !important};`;
        GM_addStyle(repo_paper_left_menu_button_style);
        //set its style when clicked on
        // ps: originally, the button change it's color, now , it creates a new border.
        var repo_paper_left_menu_isactive_style = `.left__menu .top ul li.active{background-color:${color_set.background_color_subordinate} !important; color:${color_set.text_color_main}!important;border:3px solid ${color_set.text_color_main}; border-radius:8px;}`;
        GM_addStyle(repo_paper_left_menu_isactive_style);
    }

    ('index page');
    if (user_settings.enable_card_style) {
        ('card');

        // card color
        for (
            var i = 0; i < color_set.card_color_list[0].length; i++
        ) {
            var index_card_style = `.lesson-cardS .box-card.style${i} {background-image: linear-gradient(to bottom right, ${
                color_set.card_color_list[0][i]
            }, ${colorGradient(
                color_set.card_color_list[0][i],
                0.3
            )});}`;
            // if (server_code == 1) {
            //     index_card_style = `.lesson-cardT .box-card.style${i},.lesson-cardS .box-card.style${i} {background-image: linear-gradient(to bottom right, ${
            //         color_set.card_color_list[0][i]
            //     }, ${colorGradient(
            //         color_set.card_color_list[0][i],
            //         0.3
            //     )});}`;

            GM_addStyle(index_card_style);
        }

        // card watermark
        GM_addStyle(
            '.mark > img {opacity:0.5; transform:scale(0.5);}'
        );

        // if (server_code == 1) {
        //     GM_addStyle(`.lesson-cardT .mark,.lesson-cardS .mark {
        //         position: absolute;
        //         top: 0;
        //         right: 0;
        //         height: 100%;
        //         z-index: 5;
        //     }
        //     .lesson-cardT .mark img,.lesson-cardS .mark {
        //         display: block;
        //         height: 100%;
        //     }`);
        //     waitForKeyElements(
        //         '.lesson-cardT',
        //         changeWaterMark_code1
        //     );
        //     waitForKeyElements(
        //         '.lesson-cardS',
        //         changeWaterMark_code1
        //     );
        // } else {
        waitForKeyElements(
            '#pane-student > div > div > div > div > div.mark > img',
            changeWaterMark_code0
        );
        // }
    }
    if (user_settings.enable_index_page) {
        // that |协同| tag
        var index_xietong_icon_style = `.layoutHeader .synergy {color: ${color_set.text_color_secondary}; border-color:${color_set.text_color_secondary}}`;
        GM_addStyle(index_xietong_icon_style);
        // h3: name of the courses you taught
        var index_h3_style = `.layoutHeader h3{background-color: ${color_set.background_color_main}; color: ${color_set.text_color_main} !important;};`;
        GM_addStyle(index_h3_style);
        ('background');
        // main background, the one carries the cards
        var index_background_style = `.index__view{background-color: ${color_set.background_color_main} !important; color: ${color_set.text_color_main} !important;};`;
        GM_addStyle(index_background_style);

        ('top tab');
        // that tab above the cards, contains some buttons
        var index_top_tab_style = `.el-tabs__nav-scroll ,.index__view .headerButtonGroup span.beforeBorder .link,.index__view .headerButtonGroup span.beforeBorder .header-line-button{background-color: ${color_set.background_color_secondary} ! important;`;
        GM_addStyle(index_top_tab_style);
        // set top tab' text style
        var index_top_tab_text_style = `.index__view .el-tabs .el-tabs__header .el-tabs__nav .el-tabs__item,.index__view .headerButtonGroup span.beforeBorder .link,.index__view .headerButtonGroup span.beforeBorder .header-line-button{color :${color_set.text_color_main}};`;
        GM_addStyle(index_top_tab_text_style);
        // top tab's hover style
        var index_top_text_hover_style = `.tabs__container .tab__item:hover, .tabs__container .tab__item.active,{color :${color_set.text_color_secondary} !important;border-bottom:4px solid ${color_set.text_color_secondary} !important;} .index__view .headerButtonGroup span:hover{color:${color_set.text_color_secondary} !important;}`;
        GM_addStyle(index_top_text_hover_style);
        // set top tab's buttons' styles
        var index_header_button_group_style = `.index__view .headerButtonGroup {color:${color_set.text_color_main}}`;
        GM_addStyle(index_header_button_group_style);
        // buttons' styles when clicked on
        var index_header_button_group_isactive_style = `.index__view .el-tabs .el-tabs__header .el-tabs__nav .el-tabs__item.is-active {color:${color_set.text_color_secondary}}`;
        GM_addStyle(
            index_header_button_group_isactive_style
        );
        // the bar under an active button
        var index_active_bar_style = `.el-tabs__active-bar {color:${color_set.text_color_secondary} !important; background-color:${color_set.text_color_secondary} !important;}`;
        GM_addStyle(index_active_bar_style);
    }
    if (user_settings.enable_developing_features) {
        ('/repository/paperlib');
        ('top tab');

        // that tab above the cards, contains some buttons
        var repo_paper_top_tab_style = `.tabs__container,.repository__tabs, .tab__item{background-color: ${color_set.background_color_secondary} ! important;`;
        GM_addStyle(repo_paper_top_tab_style);
        // set top tab' text style
        var repo_paper_top_tab_text_style = `.tabs__container,.repository__tabs, .tab__item{color :${color_set.text_color_main}};`;
        GM_addStyle(repo_paper_top_tab_text_style);
        // set top tab's buttons' styles
        var repo_paper_header_button_group_style = `.tabs__container,.repository__tabs, .tab__item {color:${color_set.text_color_main}}`;
        GM_addStyle(repo_paper_header_button_group_style);
        // the bar under an active button
        var repo_paper_active_bar_style = `.tab__item.active {color:${color_set.text_color_secondary} !important;border-bottom: 4px solid ${color_set.text_color_secondary} !important;}`;
        GM_addStyle(repo_paper_active_bar_style);
        var repo_paper_background_style = `#app > div.viewContainer > section > section.repository__container > section > section{background:${color_set.background_color_main};}`;
        GM_addStyle(repo_paper_background_style);
        // 新建试卷，新建文件夹按钮
        var repo_paper_new_button_style = `.action__btn,.cards__empty .add__btn {background:${color_set.background_color_main} !important;color: ${color_set.text_color_secondary} !important;border: 1px solid ${color_set.text_color_secondary} !important;}`;
        GM_addStyle(repo_paper_new_button_style);
        // 两个按钮的悬浮样式
        var repo_paper_new_button_hover_style = `.page__toolbar .action__btn:hover,.cards__empty .add__btn:hover{color: ${color_set.background_color_main} !important; background:${color_set.text_color_secondary} !important;`;
        GM_addStyle(repo_paper_new_button_hover_style);
        var repo_paper_c333_c666_style = `.c333 {color: ${color_set.text_color_main} !important;} .c666{color: ${color_set.text_color_subordinate} !important;}`;
        GM_addStyle(repo_paper_c333_c666_style);
        // 上端栏悬浮样式
        var repo_upper_bar_hover_style = `
        .tabs__container .tab__item:hover{color:${color_set.text_color_subordinate} !important;border-bottom: 4px solid ${color_set.text_color_subordinate} !important;}
        `;
        GM_addStyle(repo_upper_bar_hover_style);

        ('/repository/collections');
        var repo_collections_layout_style = `.collections__layout {background: ${color_set.background_color_main} !important;}
        #app > div.viewContainer > section > section.repository__container > section{background-color:${color_set.background_color_main};}`;
        GM_addStyle(repo_collections_layout_style);
        ('that blue word');
        var repo_collections_blue_style = `.blue{color: ${color_set.text_color_secondary};}`;
        GM_addStyle(repo_collections_blue_style);

        ('/repository/cloud');
        var repo_cloud_style = `.cloud-wrapper,.cloud-wrapper>*,.cloud-wrapper>*>*,.cloud-wrapper>*>*>*,el-table__header-wrapper>*>*>*,thread.has-gutter {background-color: ${color_set.background_color_main} !important ; color:${color_set.text_color_main}}`;
        GM_addStyle(repo_cloud_style);
        // 文件名称那一栏
        var repo_cloud_filenamebar_style = `.el-table th, .el-table tr {background-color: ${color_set.background_color_main} !important ; color:${color_set.text_color_main}}`;
        GM_addStyle(repo_cloud_filenamebar_style);
        // 上传和新文件夹两个按钮
        var repo_cloud_upload_and_newfile_button_style = `#app > div.viewContainer > section > section.repository__container > div > div.cloud-right-wrapper > div.button-wrapper.font14 > div.text-left.upload-handle-wrapper > button,.file-upload-button-wrapper .yupan-upload-button,.cloud-wrapper .cloud-right-wrapper .button-wrapper .upload-handle-wrapper .button-default-border{background-color:${color_set.background_color_main} !important;border: 1px solid ${color_set.text_color_secondary} !important;color: ${color_set.text_color_secondary} !important;background-color:${color_set.background_color_main};}`;
        GM_addStyle(
            repo_cloud_upload_and_newfile_button_style
        );
        var repo_cloud_upload_and_newfile_button_hover_style = `#app > div.viewContainer > section > section.repository__container > div > div.cloud-right-wrapper > div.button-wrapper.font14 > div.text-left.upload-handle-wrapper > button:hover,.cloud-wrapper .cloud-right-wrapper .button-wrapper .upload-handle-wrapper .button-default-border:hover,.cloud-wrapper .cloud-right-wrapper .button-wrapper .upload-handle-wrapper .button-default-border[data-v-16086f14]:hover,.file-upload-button-wrapper .yupan-upload-button[data-v-410e509b]:hover ,.cloud-wrapper .cloud-right-wrapper .button-wrapper .upload-handle-wrapper .button-default-border[data-v-16086f14]:hover{border: 1px solid ${color_set.text_color_secondary} !important;color: ${color_set.background_color_main} !important;background-color: ${color_set.text_color_secondary} !important;}`;
        GM_addStyle(
            repo_cloud_upload_and_newfile_button_hover_style
        );
        // that little arrow
        var repo_cloud_arrow_style = `.file-upload-button-wrapper .yupan-upload-button[data-v-410e509b] {border-bottom-color: ${color_set.text_color_secondary};}`;
        GM_addStyle(repo_cloud_arrow_style);
        // container background
        var repo_cloud_background_style = `#app > div.viewContainer > section > section.repository__container{background-color:${color_set.background_color_main};}`;
        GM_addStyle(repo_cloud_background_style);
        // search bar
        var repo_cloud_search_bar_style = `#app > div.viewContainer > section > section.repository__container > div > div.cloud-right-wrapper > div.button-wrapper.font14 > div.text-left.search-wrapper{background-color:${color_set.background_color_main}; border:1px solid ${color_set.text_color_main};}}
        #app > div.viewContainer > section > section.repository__container > div > div.cloud-right-wrapper > div.button-wrapper.font14 > div.text-left.search-wrapper > input{color:${color_set.text_color_main};background-color:${color_set.background_color_main} !important;}
        #app > div.viewContainer > section > section.repository__container > div > div.cloud-right-wrapper > div.button-wrapper.font14 > div.text-left.search-wrapper > div {background-color:${color_set.background_color_main}; color:${color_set.text_color_secondary};}
        #app > div.viewContainer > section > section.repository__container > div > div.cloud-right-wrapper > div.button-wrapper.font14 > div.text-left.search-wrapper > div > span{background-color:${color_set.text_color_main};}
        #app > div.viewContainer > section > section.repository__container > div > div.cloud-right-wrapper > div.button-wrapper.font14 > div.text-left.search-wrapper > div > i{color:${color_set.text_color_secondary};}
        `
        GM_addStyle(repo_cloud_search_bar_style);

        ('specific course');
        // student log
        // ('header card');
        var log_header_card_style = `.studentLog__view,.studentLog__view .headerCard,.studentLog__view .headerCard .userInfo>span,.studentLog__view .headerCard h1  {background-color:${color_set.background_color_main} !important ; color : ${color_set.text_color_main} !important;}`;
        GM_addStyle(log_header_card_style);
        ('scroll bar');
        // var log_scroll_card_style = `.studentLog__view .el-tabs.mainTab .el-tabs__header .el-tabs__nav .el-tabs__item,.el-tabs__nav-scroll, .index__view .headerButtonGroup span.beforeBorder .link, .index__view .headerButtonGroup span.beforeBorder .header-line-button {background-color:${color_set.background_color_secondary} !important; color:${color_set.text_color_main} !important;}`;
        // GM_addStyle(log_scroll_card_style);
        // var log_scroll_active_style = `.studentLog__view .el-tabs.mainTab .el-tabs__header .el-tabs__nav .el-tabs__item.is-active {color:${color_set.text_color_secondary} !important;}`;
        // GM_addStyle(log_scroll_active_style);
        // ('lower part');
        // var log_lower_part_style = `.studentLog__view .radioTab ,.el-tabs__content {background-color:${color_set.background_color_main} !important; color :${color_set.text_color_main} !important;}`;
        // GM_addStyle(log_lower_part_style);
        var log_radiotab_style = `div.studentLog__view .radioTab ,.studentLog__view .el-tabs.mainTab .el-tabs__content {background-color:${color_set.background_color_main};}`;
        GM_addStyle(log_radiotab_style);
        // active button
        var log_active_button_style = `.studentLog__view .log .el-radio-group .el-radio-button.is-active span {color:${color_set.text_color_secondary} !important; border-color:${color_set.text_color_secondary} !important;background-color:${color_set.background_color_main} !important;}`;
        GM_addStyle(log_active_button_style);
        var log_upper_banner_active_style = `.studentLog__view .el-tabs.mainTab .el-tabs__header .el-tabs__nav .el-tabs__item.is-active{color:${color_set.text_color_secondary}!important}`;
        GM_addStyle(log_upper_banner_active_style);
        // inactive buttons
        var log_inactive_button_style = `.studentLog__view .log .el-radio-group .el-radio-button span {color:${color_set.text_color_main} !important;  border-color:${color_set.text_color_main} !important;background-color:${color_set.background_color_main} !important;}`;
        GM_addStyle(log_inactive_button_style);
        var log_a_little_shadow_style = `.el-radio-button__orig-radio:checked+.el-radio-button__inner {box-shadow: -1px 0 0 0 ${color_set.text_color_secondary}  !important;}`;
        GM_addStyle(log_a_little_shadow_style);
        var log_upper_banner_inactive_style = `.studentLog__view .el-tabs.mainTab .el-tabs__header .el-tabs__nav .el-tabs__item{color:${color_set.text_color_main} !important}`;
        GM_addStyle(log_upper_banner_inactive_style);
        var log_upper_banner_btns_patch_style = `.studentLog__view .el-tabs.mainTab .el-tabs__header .el-tabs__nav .el-tabs__item{color:${color_set.text_color_subordinate} !important}`;
        GM_addStyle(log_upper_banner_btns_patch_style);
        // content
        var log_content_style = `.studentCard .end ,.studentCard .date-box,.studentLog__view .log .el-tabs .el-tabs__content>div,.studentLog__view .log .el-tabs .el-tabs__content>div>div {background-color: ${color_set.background_color_main} !important; color: ${color_set.text_color_main} !important;}`;
        GM_addStyle(log_content_style);
        ('cards');
        // side color cards
        var log_content_side_color_cards_style = `.studentCard .activity-box .time,.studentCard .content-box,.activity__wrap .activity-info h2 {background-color:${color_set.background_color_secondary} !important; color:${color_set.text_color_main} !important;border: 1px solid ${color_set.background_color_secondary} !important; border-radius: 4px}`;
        GM_addStyle(log_content_side_color_cards_style);
        var log_signed_up_logo_style = `.cc8{color :${color_set.text_color_secondary};} .red{color:${color_set.text_color_subordinate};}  .activity__wrap .statistics-box .aside span {color:${color_set.text_color_main} !important;}`;
        GM_addStyle(log_signed_up_logo_style);

        ('/\\d/\\d/\\d');
        ('specific class'); //点进去，查看一个课堂的内容
        // top banner
        var sc_top_banner_style = `.normalText{color:${color_set.text_color_subordinate} !important;}
        .student_learn_header{background:${color_set.background_color_main} !important;}
        .common_header .return svg, .common_header .return .returnText {color: ${color_set.text_color_secondary}  !important}`;
        GM_addStyle(sc_top_banner_style);
        // content of a class: left, in the middle
        var sc_left_middle_style = `.el-card{background-color:${color_set.background_color_main};}
        .module_ppt .ppt .el-card__body .ppt_info,.module_ppt .ppt .el-card__body .ppt_actions  {color:${color_set.text_color_main};}
        .module_ppt .ppt .el-card__header .playback{color:${color_set.text_color_secondary};}
        .module_ppt .ppt .el-card__body .swiper_box .swiper-container .swiper-pagination-bullets .swiper-pagination-bullet-active{background:${color_set.text_color_secondary};}
        .module_ppt .ppt .el-card__body .swiper_box .swiper-slide.swiper-slide-active img { border: 2px solid ${color_set.text_color_secondary};}`;
        GM_addStyle(sc_left_middle_style);
        // brief: right, in the middle
        var sc_right_middle_style = `.lesson_info .statistics_classify .statistics_item span, .lesson_info .noLessonInfo p,.lesson_info .statistics_classify .statistics_item p, .lesson_info .lesson_main .lesson_main_left .exercises_box p{color:${color_set.text_color_main} !important;}`;
        GM_addStyle(sc_right_middle_style);
        // note: lower
        var sc_lower_style = `.module_studyNotes .studyNotes textarea{background-color:${color_set.background_color_main}; color: ${color_set.text_color_main}; border: 1px solid ${color_set.background_color_secondary};}`;
        GM_addStyle(sc_lower_style);
        // specific page background
        var sc_background_style = `.student_learn_main {background-color:${color_set.background_color_secondary} !important;}`;
        GM_addStyle(sc_background_style);

        ('discussion section');
        var sc_discussion_section_style = `
        .new-discussion-warp .top_search, .el-input__inner{background-color:${color_set.background_color_secondary} !important;border:2px !important; color:${color_set.text_color_subordinate};};
        .new-discussion-warp .top_search .search-btn::after{background-color:${color_set.background_color_main};}
        .new-discussion-warp .top_search .search-btn .icon {color:${color_set.text_color_secondary} !important;}
        div.new-discussion-warp .container{background-color:${color_set.background_color_secondary} !important;}
        .new-discussion-warp .container-top .container-top-box .el-radio-group .el-radio-button.is-active span  {color:${color_set.text_color_secondary} !important; border-color:${color_set.text_color_secondary} !important;background-color:${color_set.background_color_main} !important;}
        .new-discussion-warp .container-top .container-top-box .el-radio-group .el-radio-button .el-radio-button__inner {color:${color_set.text_color_main} !important;  border-color:${color_set.text_color_main} !important;background-color:${color_set.background_color_main} !important;}
        .new-discussion-warp .top_discuss {background-color:${color_set.text_color_secondary} !important; color:${color_set.background_color_main} !important;}
        `;
        GM_addStyle(sc_discussion_section_style);
        ('announcements');
        var sc_announcements_section_style = `
        .announcement-wrap .section{background-color:${color_set.background_color_secondary} !important;color:${color_set.text_color_main} !important;}
        .announcement-wrap .announcement-left .list-wrap .announcement-item .item-title h4 ,.announcement-wrap .announcement-left .list-wrap .announcement-item .item-info{color:${color_set.text_color_main} !important;}
        .announcement-wrap .announcement-left .list-wrap .announcement-item .item-status{color:${color_set.text_color_subordinate} !important;}
        .announcement-wrap .announcement-left .search-wrap .search-input {background-color:${color_set.background_color_secondary} !important; border:2px solid ${color_set.text_color_main} !important;}
        .announcement-wrap .announcement-left .search-wrap .search-input .search-btn .icon {color:${color_set.text_color_main} !important;}
        `;
        GM_addStyle(sc_announcements_section_style);
        ('group');
        var sc_group_section_style = `
        .webview__page .page__nav div {color:${color_set.text_color_main} !important; border-color:${color_set.text_color_main} !important;};
        `;
        GM_addStyle(sc_group_section_style);
        ('score sheet');
        var sc_score_sheet_style = `
        .studentmark-wrapper .personal-mark .scheme, .studentmark-wrapper .personal-mark .introduce,.studentmark-wrapper .list-box {background-color:${
            color_set.background_color_secondary
        } !important;}
        .studentmark-wrapper .personal-mark .scheme .title,
        .studentmark-wrapper .personal-mark .introduce .title,.studentmark-wrapper .list-box .title,
        .studentmark-wrapper .list-box .list-detail .left-study-unit .unit-title .text,
        .studentmark-wrapper .list-box .list-detail .left-study-unit .tip,
        .studentmark-wrapper .list-box .list-detail .right-content .study-unit .unit-name-td,
        .studentmark-wrapper .list-box .list-detail .right-content .blank-info,
        .studentmark-wrapper .personal-mark .scheme .scheme-list .item .common,
        .studentmark-wrapper .personal-mark .scheme .scheme-list .item .num
        {color:${color_set.text_color_main} !important;}
        .studentmark-wrapper .list-box .list-detail .left-study-unit .unit-title .dot,.studentmark-wrapper .list-box .list-detail .left-study-unit .unit-title .dot
        {
            background-color:${
                color_set.text_color_secondary
            } !important;
        }
        .studentmark-wrapper .personal-mark .scheme .scheme-list .item{
            background-color:${colorGradient(
                color_set.background_color_secondary,
                0.5
            )} !important;
        }
        .studentmark-wrapper .personal-mark .scheme .info {
            color:${
                color_set.text_color_subordinate
            } !important;
        }
        circle
        {
            stroke:${color_set.text_color_secondary};
            color:${color_set.text_color_main};
        }
        `;
        GM_addStyle(sc_score_sheet_style);
    }

    // 小清新：https://v1.hitokoto.cn/
    // 彩虹屁：https://chp.shadiao.app/api.php
    // 毒鸡汤：https://api.btstu.cn/yan/api.php
    function insertZhuangBiStr(
        eltab_whole,
        reference_node
    ) {
        console.log('zhuangbi');
        try {
            GM_xmlhttpRequest({
                method: 'get',
                url: 'https://v1.hitokoto.cn/',
                headers: {
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36',
                },
                onload: function(res) {
                    if (res.status == 200) {
                        json_dic = JSON.parse(
                            res.responseText
                        );
                        var new_node =
                            document.createElement('div');
                        new_node.setAttribute(
                            'id',
                            'us_greeting'
                        );
                        new_node.innerHTML =
                            json_dic.hitokoto +
                            '    ' +
                            '——' +
                            json_dic.from;
                        eltab_whole.insertBefore(
                            new_node,
                            reference_node
                        );
                        GM_addStyle(
                            'div#us_greeting{font-size:2em; margin-top:1em;margin-left:1em; margin-right:1em;}'
                        );
                    } else {
                        console.log('error');
                    }
                },
            });
        } catch (err) {}
    }

    function insertRainbowFartStr(
        eltab_whole,
        reference_node
    ) {
        try {
            GM_xmlhttpRequest({
                method: 'get',
                url: 'https://chp.shadiao.app/api.php',
                headers: {
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36',
                },
                onload: function(res) {
                    if (res.status == 200) {
                        console.log('rainbowfart');
                        var new_node =
                            document.createElement('div');
                        new_node.setAttribute(
                            'id',
                            'rainbow_fart'
                        );
                        new_node.innerHTML =
                            res.responseText;
                        eltab_whole.insertBefore(
                            new_node,
                            reference_node
                        );
                        GM_addStyle(
                            'div#rainbow_fart{font-size:2em; margin-top:1em;margin-left:1em; margin-right:1em;}'
                        );
                    } else {
                        console.log('error');
                    }
                },
            });
        } catch (err) {}
    }

    function insertChickenSoupStr(
        eltab_whole,
        reference_node
    ) {
        try {
            GM_xmlhttpRequest({
                method: 'get',
                url: 'https://api.btstu.cn/yan/api.php',
                headers: {
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36',
                },
                onload: function(res) {
                    if (res.status == 200) {
                        console.log('chicksoup');
                        var new_node =
                            document.createElement('div');
                        new_node.setAttribute(
                            'id',
                            'us_greeting'
                        );
                        new_node.innerHTML =
                            res.responseText;
                        eltab_whole.insertBefore(
                            new_node,
                            reference_node
                        );
                        GM_addStyle(
                            'div#us_greeting{font-size:2em; margin-top:1em;margin-left:1em; margin-right:1em;}'
                        );
                    } else {
                        console.log('error');
                    }
                },
            });
        } catch (err) {}
    }

    function addGreeting(jNode) {
        var eltab_whole = document.querySelector(
            '#app > div.viewContainer > div > div.el-tabs.el-tabs--top'
        );
        var reference_node = document.querySelector(
            '#app > div.viewContainer > div > div.el-tabs.el-tabs--top > div.el-tabs__content'
        );

        if (trigger_birthday) {
            var new_node = document.createElement('div');
            new_node.setAttribute('id', 'us_greeting');
            var tmp_date = new Date();
            var age =
                parseInt(tmp_date.getFullYear()) - 2001;
            new_node.innerHTML = `${age}岁的fyp生日快乐🎂`;
            eltab_whole.insertBefore(
                new_node,
                reference_node
            );
            GM_addStyle(
                'div#us_greeting{font-size:2em; margin-top:1em;margin-left:1em; margin-right:1em;}'
            );
            return;
        }
        switch (user_settings.enable_greeting) {
            case 1:
                insertZhuangBiStr(
                    eltab_whole,
                    reference_node
                );
                break;
            case 2:
                insertRainbowFartStr(
                    eltab_whole,
                    reference_node
                );
                break;
            case 3:
                insertChickenSoupStr(
                    eltab_whole,
                    reference_node
                );
                break;
            default:
                break;
        }
    }
    // Greeting
    waitForKeyElements(
        '#app > div.viewContainer > div > div.el-tabs.el-tabs--top',
        addGreeting
    );

    /*
        !----------------------------------------------!    
        !     WARNING: really nasty part below!        !
        !----------------------------------------------!
        */

    ('set color button');
    var htmL = document.getElementsByTagName('html')[0];
    var changeColor = document.createElement('img');
    changeColor.id = 'changeColor';
    changeColor.src =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAJyUlEQVRoge1aW2wcVxn+/jOzu7Nz1rc4N+OkcZ04TdM09zRUJbSpmkIVpaLQIlEEQgiJFyQQlRBvXMQLD1TQZ0CCB3igApUioG0EtIU2CW1Cc5GdpEmaNI4Tx3fPzO7szpyDzjlr791eO7eX/LITz+y5fN9/PzOLu3JXbo1Q+apSyhvaJAgCLqXsA7AJwA4AawB0FT8eAnARwPsAThLRWdd1/RvZj6gE/4aJ+L6fBvAZAN8FsGeB098G8CKA1zjn2YXufVOI+L7fRkTfllL+aKEAGoD6gZTyF5zzyQXMKf1d/kGzRHzf/xKA3y0IafPyPOf8982MXjSRXC7nCCFelVI+cYtIGFBEBxljBxzHyc0zrvR3+QdzEfF9f2UxYG+ndHHOrzZDhDUDKgiCe+8ACSVDxb3nlXktksvllsVxPHybgNcVy7KWO45zvfqzpi0yNDRkA7hDJCRADGBMaXi4iKWhzEmkra3tlTiObwvsWiFINw0wG7EQGsvco8uk3LWy2ewuKeWRRVd7ZXZmmf+LmpVqO/UjBFDIAzKuhmBESohMBomT7wD5HKKte8FyWeVKD6XT6f+WtpjHtSYmJiiO48MLAq4IMwsyzSE5h0y55p4CnPWAyVGw8atgo0MgbwIy5UDyjCEyqyypfxQJa/gynJ9/A+RPAMwAVpgUtnrb1/W7dDr9VKFQoKasocYkU5DJBKgQg10fBI0OgU2OAGEAigpArH5jQMRmvGVBZjoQr90C0d0DyuaAONKkRIbDunoR6Z88C2SnEfduK26jsZDCBuCv1TDqupbnedNElGmaQJAFGzwDNngeNDEMCrPGrSwbUgWrci3tYjQ7l5SVpES0/XHEfVtA2QDScWCdO470S98EPu6H+NQXEHznVyApgHw4g9HLZDItqHKtGosEQdDDGMs0tIY02URmOCjMwxo4CutiP2hyxCjCTkBm2gyROSwqW5do/7eP/gNwWxCv6tX3ndd+CVw9Bzguogf3QtoM5GVnVa6wKYyu635Uvl5NjERR9LU5rZBIQnIXbPACEm++DPvYP7V2dUzwNtCSlZCFgnEVquvOpbWSjgn+y2eNx6nbXb3AtVHEuw8g//jzoEJUkw/qYaxxLd/3pwC01N/YuJJ98jCsU+8a1+GtJqBtG4mH94M6liH+qB/R0X+BHLfkRio+dDLIzNQGTZSmxxB198F+ZD9yYR6nD72F9d4lpPZ9BYVEAuRNm/GVMs05b22YtXzf76xLQqUS2zYkjr0N64O3IN2MISElZC4AdXZpEkqsnvsNCRUrhRCiey3ijZ+E6F6nr2etpRJAFIOtXg8B4PiRwxAdXXD2fx2R3ZCEkpYi1lmpjpGeerMgyQTiwDHY/Ycg2jq1NWZigFTKvT4IMXwZrHMl4vMnTcolhnjTI4j7Hpxdyjp7Atapd8y8yVGI+3bCvqcP/SeOIwh8PLp7N2QYKv9pRKIc62gjIuvq8kinwcZGYQ8cgXDbKkigGODKvaJ3/wYoS3mToKSjU6/sWK7sCZJaH/oaQoD8SYjezQh37gWdfg9rfvZVdP/wFSCZRMHzKjJSA1lXPDbXEiGi5XWzlcXALvUbLbcvKxFU4aQ2VMDS3BD0pzQJXclFDPv9g6C1myEz7bq4WR8eB4UB4s17kH/gIbBChMRPv4zk3i8i19OHUBb9vRhDjURhLf+o2iLJWhK2qRMjV4CZaq32yXqwejeBdfVABtOIB94zhU+RmAGSSgM5X2c22EkgykMmHJ1uVeplgYf0r7+vtZ99+Dng5CFYnd0Qy1ZpsvNIBdYKIvWsIRNJsLGrusrKRMrcC6bBVq6BvWNvaWAiiejw6yCeKGlS9VSJlF7DEHNMM6j+HR9B+rc/hnXkLyh87nuwLpwEjQzq+lHY8wzE0i5dJBtJNdaKaCKifM081eeEOUC1GjPBlw/BVqyuHLbiHp3Z6hfBYuM401elXFA+gHX8DcS7n4FY2WustWSFsdSV87P9VSOpxlpBRAhxrWaeyosqmC1VqYWBleYQFweK/ZGR+OwH5nruTGNix8nAPvxHiKWrEW3ZB5oaMVbUiSOpySDGnDFSjbU62M/W6DKOTBFTbqX6HdV6OBxiagyFN/8E9oleSG8C8cdnQGqcJmPVByEFZOtyWP3/1p1w+NS3gNCv7ALmTVb1sVYQYYxdEEJUzlAmb23XaZNdHIBMpjQgSrdAqDowPAioCmwnIfMhSPVaWc9ksYp+S7kU19q3Bv6Dwq6nddAba5RZUe2vkoRlpjQShbUCe/lFOp2eADBerUWlJdG93oAqttuaTCoNau0AKWtZFhK7n0Tisc/D3vQwpKrqslwppPsx+/hBiO4NED1bQVOjlSSMqiFbOkrk68t4EWt9IjCHl5cqixHp9Buv7kV8305zzlAnu7IxMjsN6/5dYN1rQa1LYG3YAat7nakzMKlY8nZYF47qFK3jwhutdD/1d5iFdFtM+s3XP2IrbApj9f0aIrZt/6Zmtmr48gXEW/YgWr8dNDVmAnI2zUpTBMtFpdwZN7WTuhiyoXOINn7a3FNZsExZuqjqg9RmyJZWs34DqYexhojruipOvCo1gPLmFBftegLx1kd1ElC9knY1twXRqUMQY9f0tbh0GvGl0yDVVCqDJB2wSycgVvRCLlkFyk6VBTcBUQg2fg3x2q2IN+wA5ULT09QRhU1hrLFU+cVMkQmCYJ+U8vWaZWYOTk4KbOw62If/Axu6oE+Eqh1R2UydSeTUGCiZNKk04YDGLuugFvduMx3xjO8XQlAwrYtgvG4b4o279ToU5hqmXiJ60nXdN9DsI1Pf99WOVf5S6oGkzkoAG7kGduUcaOQKaHxYu4dO1cq1VO+lgI1ehuxcBWklTeuhkoCqJ5kOHQ9izQaIpStBYQEo5GoTQElynPN0Gan5iXiet42IjjZacfbIq84dqmzkcqCJEZ2JyBs3mo5jfXDSFuDt2g56fKYdsmUJRGeXiQeVGLP+vI2ilHJ7JpM5tiAiMC72ZynlgYYrl4s6Laoaw4oPCdURNcobcOpXuZ7uu1KAbbalfGQOWk0IEb3quu7T5SObJuJ5nkVEERYjs09Pik9Q9AMrUXoktECRUtqZTKYiJy/otYLv+0sB1DxAvs2yjHM+Ur3lgl4rFBfovYMkeuuRqJaFvOhZdgeezC/nnDf0hgW/6IGxzHXLslTqO3gTAM4nB9Vec5GolsW+DH0WwB9uEYnnOOcvNzNwURYpF7URY4wT0QuLmd8A1AtqzWZJ1Mwvv1jMu5CJiQknlUp9VgixqC8MMMZeDMPw7+3t7XO+wa0nN/WbD+Xi+z4HsB7AA/N8heMUgDOc85v2FY67clduhQD4P3ZTfktmvDqeAAAAAElFTkSuQmCC';
    var changeColor_style = `#changeColor{width:50px;height:50px;position:fixed;bottom:0px;left:70px;z-index:10;background-color:rgba(0,0,0,0.0);}`;
    var ADDED = false;
    GM_addStyle(changeColor_style);
    changeColor.onclick = showUserSettings;

    function addChangeColorButton(jNode) {
        if (ADDED) return;
        var body = document.getElementsByTagName('body')[0];
        body.appendChild(changeColor);
        ADDED = true;
        // addUserSettingBlockToBody();
    }

    function showUserSettings() {
        setUpUserSettings();
        document
            .getElementById(
                'user_script_user_settings_whole'
            )
            .removeAttribute('hidden');
    }

    waitForKeyElements('body', addChangeColorButton);

    ('the following part is written for preference settings');
    ('css style sheet');

    function getUserSettingsCss() {
        return `.color_pick {
            float: left;
        }
        
        #color_pick_whole {
            background-color: white;
            font-size: 1em;
            font-family: 'Courier New', Courier, monospace;
            border: 3px solid black;
            border-radius: 6px;
            width: 40vw;
            position: absolute;
            margin: auto;
            left: 250px;
            right: 250px;
        }
        
        #color_pick_left {
            margin-right: 40px;
        }
        
        #color_pick_right {
            width: 90px;
            padding-right: 0px;
            margin: 20px;
            height: 90px;
            border-radius: 4px;
        }
        
        #redpicker,
        #greenpicker,
        #bluepicker {
            width: 20px;
        }
        
        #color_pick_confirm {
            margin: 1em;
        }
        
        #color_pick_cancel {
            margin: 1em;
        }
        
        .one_selection>span {
            display: inline-block;
            width: 300px;
            text-align: center;
        }
        
        div.one_selection {
            width: 700px;
            padding: 0px;
            margin: 10px;
        }
        
        span.user_script_user_settings_change_color:hover,
        .user_script_user_settings_change_color>*:hover {
            border: 2px solid rgb(172, 172, 172) !important;
            color: gray !important;
        }
        
        #user_script_user_settings_whole {
            position: absolute;
            margin: auto;
            left: 0px;
            right: 0px;
        }
        
        #usus_apply,
        #usus_back {
            font-size: 1.5em;
            text-align: center;
            display: inline-block;
            width: 300px;
            /* height: 150%; */
            border-radius: 4px;
        }
        
        #usus_apply {
            border: 3px solid red;
        }
        
        #usus_back {
            border: 3px solid black;
        }
        
        #usus_apply:hover,
        #usus_back:hover {
            border: 3px solid gray;
        }
        #usus_apply:hover,
        #usus_back:hover {
            border: 3px solid gray;
        }
        
        #usus_reset {
            position: absolute;
            border: 3px solid gray;
            font-size: 0.7em;
            text-align: center;
            display: inline-block;
            width: 50px;
            margin-right: 10px;
            right: 0px;
            border-radius: 4px;
        }
        
        #usus_reset:hover {
            background-color: red;
            color: white;
        }
        `;
    }
    var user_settings_css_style_sheet =
        getUserSettingsCss();
    GM_addStyle(user_settings_css_style_sheet);
    ('html sheet');

    function getColorAccordingToBackgroundColor(
        background
    ) {
        var bg_color = background;
        var r = parseInt(bg_color.slice(1, 3), 16);
        var g = parseInt(bg_color.slice(3, 5), 16);
        var b = parseInt(bg_color.slice(5, 7), 16);
        var color = 'white';
        if (r + g + b >= (255 * 3) / 2) {
            color = 'black';
        }
        // jNode.setAttribute(
        //     'style',
        //     'background-color:' +
        //     bg_color +
        //     ';color:' +
        //     color +
        //     ';'
        // );
        return color;
    }

    function getUserSettinsHTML() {
        return `<div id="color_pick_whole" class="color_pick" hidden style="z-index: 9999; background-color: white">
        <div id="color_pick_left" class="color_pick">
            <p>
                <input type="range" id="redrange" min="0" max="255" step="1" value="0" onchange="onPickerValueChange()" style="appearance:button;" />
                <span style="color: red; width: 8em">
                        R
                    </span>
                <output id="redpicker" for="redrange">
                        0
                    </output>
            </p>
            <p>
                <input type="range" id="greenrange" min="0" max="255" step="1" value="0" onchange="onPickerValueChange()" style="appearance:button;" />
                <span style="color: green; width: 8em">
                        G
                    </span>
                <output id="greenpicker" for="greenrange">
                        0
                    </output>
            </p>
            <p>
                <input type="range" id="bluerange" min="0" max="255" step="1" value="0" onchange="onPickerValueChange()" style="appearance:button;" />
                <span style="color: blue; width: 8em">
                        B
                    </span>
                <output id="bluepicker" for="bluerange">
                        0
                    </output>
            </p>
        </div>
        <div id="color_pick_right" class="color_pick" style="background-color:black;"></div>
        <button id="color_pick_confirm">应用</button>
        <button id="color_pick_cancel">取消</button>
    </div>

    <div id="user_script_user_settings_whole" class="user_script_user_settings" style="
                position: absolute;
                width: 750px;
                border: 5px solid black;
                border-radius: 10px;
                padding: 10px;
                z-index: 1000;
                background-color: white;
            ">
        <div style="font-size: 3em">设置</div>

        <div id="background_color_main" class="user_script_user_settings one_selection">
            <span>背景主色</span>
            <span id="ususcc_bg_main" class="user_script_user_settings_change_color" onclick="setColorValueOf(this)" style="
                        border: 2px solid black;
                        border-radius: 4px;
                        background-color:${
                            color_set.background_color_main
                        };
                        color:${getColorAccordingToBackgroundColor(
                            color_set.background_color_main
                        )};
                    ">
                    ${color_set.background_color_main}
                </span>
        </div>

        <div id="background_color_secondary" class="user_script_user_settings one_selection">
            <span>背景次主色</span>
            <span id="ususcc_bg_sc" class="user_script_user_settings_change_color" onclick="setColorValueOf(this)" style="
                        border: 2px solid black;
                        border-radius: 4px;
                        background-color:${
                            color_set.background_color_secondary
                        };
                        color:${getColorAccordingToBackgroundColor(
                            color_set.background_color_secondary
                        )};
                    ">
                    ${color_set.background_color_secondary}
                </span>
        </div>

        <div id="background_color_subordinate" class="user_script_user_settings one_selection">
            <span>背景副色</span>
            <span id="ususcc_bg_sb" class="user_script_user_settings_change_color" onclick="setColorValueOf(this)" style="
                        border: 2px solid black;
                        border-radius: 4px;
                        background-color:${
                            color_set.background_color_subordinate
                        };
                        color:${getColorAccordingToBackgroundColor(
                            color_set.background_color_subordinate
                        )};
                    ">
                    ${
                        color_set.background_color_subordinate
                    }
                </span>
        </div>
        <div id="text_color_main" class="user_script_user_settings one_selection">
            <span>文字主色</span>
            <span id="ususcc_text_main" class="user_script_user_settings_change_color" onclick="setColorValueOf(this)" style="
                        border: 2px solid black;
                        border-radius: 4px;
                        background-color:${
                            color_set.text_color_main
                        };
                        color:${getColorAccordingToBackgroundColor(
                            color_set.text_color_main
                        )};
                    ">
                    ${color_set.text_color_main}
                </span>
        </div>
        <div id="text_color_secondary" class="user_script_user_settings one_selection">
            <span>文字次主色</span>
            <span id="ususcc_text_sc" class="user_script_user_settings_change_color" onclick="setColorValueOf(this)" style="
                        border: 2px solid black;
                        border-radius: 4px;
                        background-color:${
                            color_set.text_color_secondary
                        };
                        color:${getColorAccordingToBackgroundColor(
                            color_set.text_color_secondary
                        )};
                    ">
                    ${color_set.text_color_secondary}
                </span>
        </div>
        <div id="text_color_subordinate" class="user_script_user_settings one_selection">
            <span>文字副色</span>
            <span id="ususcc_text_sb" class="user_script_user_settings_change_color" onclick="setColorValueOf(this)" style="
                        border: 2px solid black;
                        border-radius: 4px;
                        background-color:${
                            color_set.text_color_subordinate
                        };
                        color:${getColorAccordingToBackgroundColor(
                            color_set.text_color_subordinate
                        )};
                    ">
                    ${color_set.text_color_subordinate}
                </span>
        </div>
        <div id="card_style_colors" class="user_script_user_settings one_selection">
            <span>卡片颜色 1</span>
            <span id="ususcc_card_color_0" class="user_script_user_settings_change_color" onclick="setColorValueOf(this)" style="
                        border: 2px solid black;
                        border-radius: 4px;
                        background-color:${
                            color_set.card_color_list[0][0]
                        };
                        color:${getColorAccordingToBackgroundColor(
                            color_set.card_color_list[0][0]
                        )};
                    ">
                    ${color_set.card_color_list[0][0]}
                </span>
        </div>
        <div id="card_style_colors" class="user_script_user_settings one_selection">
            <span>卡片颜色 2</span>
            <span id="ususcc_card_color_1" class="user_script_user_settings_change_color" onclick="setColorValueOf(this)" style="
                        border: 2px solid black;
                        border-radius: 4px;
                        background-color:${
                            color_set.card_color_list[0][1]
                        };
                        color:${getColorAccordingToBackgroundColor(
                            color_set.card_color_list[0][1]
                        )};
                    ">
                    ${color_set.card_color_list[0][1]}
                </span>
        </div>
        <div id="card_style_colors" class="user_script_user_settings one_selection">
            <span>卡片颜色 3</span>
            <span id="ususcc_card_color_2" class="user_script_user_settings_change_color" onclick="setColorValueOf(this)" style="
                        border: 2px solid black;
                        border-radius: 4px;
                        background-color:${
                            color_set.card_color_list[0][2]
                        };
                        color:${getColorAccordingToBackgroundColor(
                            color_set.card_color_list[0][2]
                        )};
                    ">
                    ${color_set.card_color_list[0][2]}
                </span>
        </div>
        <div id="card_style_colors" class="user_script_user_settings one_selection">
            <span>卡片颜色 4</span>
            <span id="ususcc_card_color_3" class="user_script_user_settings_change_color" onclick="setColorValueOf(this)" style="
                        border: 2px solid black;
                        border-radius: 4px;
                        background-color:${
                            color_set.card_color_list[0][3]
                        };
                        color:${getColorAccordingToBackgroundColor(
                            color_set.card_color_list[0][3]
                        )};
                    ">
                    ${color_set.card_color_list[0][3]}
                </span>
        </div>
       
        <div style="margin-left: 10px;margin-right: 10px;">
            左菜单<input type="checkbox" ${
                user_settings.enable_left_menu
                    ? 'checked'
                    : ''
            } id="us_left_menu_checkbox" style="width:20px;height:20px;appearance:button;">
        </div>
        <div style=margin-left: 10px;margin-right: 10px;">
            卡片样式<input type="checkbox"${
                user_settings.enable_card_style
                    ? 'checked'
                    : ''
            } id="us_card_style_checkbox" style="width:20px;height:20px;appearance:button;">
        </div>
        <div style="margin-left: 10px;margin-right: 10px;">
            目录页<input type="checkbox" ${
                user_settings.enable_index_page
                    ? 'checked'
                    : ''
            } id="us_index_page_checkbox" style="width:20px;height:20px;appearance:button;">
        </div>
        <div style="margin-left: 10px;margin-right: 10px;">
            其余页面<input type="checkbox" ${
                user_settings.enable_developing_features
                    ? 'checked'
                    : ''
            } id="us_developing_features_checkbox" style="width:20px;height:20px;appearance:button;">
        </div>
        <div>
            <span style="color:#91B493">小</span>
            <span style="color:#7BA23F">清</span>
            <span style="color:#24936E">新</span>
            <input type="radio" name="us_enable_greeting" ${
                user_settings.enable_greeting == 1
                    ? 'checked'
                    : ''
            } id="us_zhuang_bi_radio" style="width:20px;height:20px;appearance:button;" />&nbsp; &nbsp; 
            <span style="color:red">彩</span>
            <span style="color:orange">虹</span>
            <span style="color:blue">屁</span>
            <input type="radio" name="us_enable_greeting" ${
                user_settings.enable_greeting == 2
                    ? 'checked'
                    : ''
            } id="us_rainbow_fart_radio" style="width:20px;height:20px;appearance:button;" />&nbsp; &nbsp; 
            <span style="color:#0089A7">毒</span>
            <span style="color:#3A8FB7">鸡</span>
            <span style="color:#2B5F75">汤</span>
            <input type="radio" name="us_enable_greeting" ${
                user_settings.enable_greeting == 3
                    ? 'checked'
                    : ''
            } id="us_chicken_soup_radio" style="width:20px;height:20px;appearance:button;" />&nbsp; &nbsp; 
            关闭问好
            <input type="radio" name="us_enable_greeting" ${
                user_settings.enable_greeting == 0
                    ? 'checked'
                    : ''
            } id="us_no_greeting_radio" style="width:20px;height:20px;appearance:button;" />&nbsp; &nbsp; 
        </div>
        
        <div></div>

        <div id="usus_btn_set" class="user_script_user_settings">
            <span id="usus_apply">应用</span>
            <span id="usus_back">返回</span>
            <span id="usus_reset">恢复初始设置</span>
        </div>
    </div>`;
    }
    var USER_SETTINGS_ADDED = false;

    function setUpUserSettings() {
        if (USER_SETTINGS_ADDED) return;
        var body = document.getElementById('app');
        var contain_div = document.createElement('div');
        contain_div.innerHTML = getUserSettinsHTML();
        body.appendChild(contain_div);
        addFunctions();

        USER_SETTINGS_ADDED = true;
        //bind keys
        var apply_btn =
            document.getElementById('usus_apply');
        var back_btn = document.getElementById('usus_back');
        back_btn.onclick = hideUserSettings;
        apply_btn.onclick = function() {
            recordUserSettings(user_settings, color_set);
        };
        var reset_btn =
            document.getElementById('usus_reset');
        reset_btn.onclick = function() {
            GM_deleteValue('yuketang_color_set');
            GM_deleteValue('yuketang_user_settings');
            GM_deleteValue('yeketang_birthday_year');
            hideUserSettings();
        };
    }

    ('some functions in the script tag, works for user settings');

    function addFunctions() {
        var new_script_block =
            document.createElement('script');
        new_script_block.type = 'text/javascript';
        new_script_block.innerHTML = `function onPickerValueChange() {
            var r = document.getElementById('redrange');
            var g =
                document.getElementById('greenrange');
            var b =
                document.getElementById('bluerange');
            var output_r =
                document.getElementById('redpicker');
            var output_g =
                document.getElementById('greenpicker');
            var output_b =
                document.getElementById('bluepicker');
            output_r.value = '\t' + r.value;
            output_g.value = '\t' + g.value;
            output_b.value = '\t' + b.value;
            var r_str = parseInt(r.value).toString(16);
            var g_str = parseInt(g.value).toString(16);
            var b_str = parseInt(b.value).toString(16);
            if (r_str.length == 1) {
                r_str = '0' + r_str;
            }
            if (g_str.length == 1) {
                g_str = '0' + g_str;
            }
            if (b_str.length == 1) {
                b_str = '0' + b_str;
            }
            console.log(r_str, g_str, b_str);
            result = document.getElementById(
                'color_pick_right'
            );
            result.setAttribute(
                'style',
                'background-color:' +
                '#' +
                r_str +
                g_str +
                b_str +
                '; color:white'
            );
        }

        function colorPickConfirm(jNode) {
            var r = document.getElementById('redrange');
            var g =
                document.getElementById('greenrange');
            var b =
                document.getElementById('bluerange');
            var r_str = parseInt(r.value).toString(16);
            var g_str = parseInt(g.value).toString(16);
            var b_str = parseInt(b.value).toString(16);
            if (r_str.length == 1) {
                r_str = '0' + r_str;
            }
            if (g_str.length == 1) {
                g_str = '0' + g_str;
            }
            if (b_str.length == 1) {
                b_str = '0' + b_str;
            }
            jNode.innerHTML =
                '#' + r_str + g_str + b_str;
            var color = 'white';
            if (
                parseInt(r.value) +
                parseInt(g.value) +
                parseInt(b.value) >=
                (255 * 3) / 2
            ) {
                color = 'black';
            }
            jNode.setAttribute(
                'style',
                'background-color:' +
                jNode.innerHTML +
                '; color:' +
                color +
                ';border:1px solid black; border-radius:4px;'
            );
            var color_picker = document.getElementById(
                'color_pick_whole'
            );
            color_picker.setAttribute('hidden', true);
            var user_script_user_settings =
                document.getElementById(
                    'user_script_user_settings_whole'
                );
            user_script_user_settings.removeAttribute(
                'hidden'
            );
        }

        function colorPickCancel() {
            var color_picker = document.getElementById(
                'color_pick_whole'
            );
            color_picker.setAttribute('hidden', true);
            var user_script_user_settings =
                document.getElementById(
                    'user_script_user_settings_whole'
                );
            user_script_user_settings.removeAttribute(
                'hidden'
            );
        }

        function setColorValueOf(jNode) {
            var user_script_user_settings =
                document.getElementById(
                    'user_script_user_settings_whole'
                );
            user_script_user_settings.setAttribute(
                'hidden',
                true
            );
            var color_picker = document.getElementById(
                'color_pick_whole'
            );
            color_picker.removeAttribute('hidden');
            var confirm_btn = document.getElementById(
                'color_pick_confirm'
            );
            // console.log(confirm_btn.innerHTML);
            confirm_btn.onclick = function() {
                colorPickConfirm(jNode);
            };
            var cancel_btn = document.getElementById(
                'color_pick_cancel'
            );
            cancel_btn.onclick = function() {
                colorPickCancel();
            };
        }`;
        document
            .getElementsByTagName('body')[0]
            .appendChild(new_script_block);
    }

    ('set up user settings');

    function recordUserSettings(
        user_settings_dic,
        color_set_dic
    ) {
        color_set_dic.background_color_main = document
            .getElementById('ususcc_bg_main')
            .innerHTML.trim();
        color_set_dic.background_color_secondary = document
            .getElementById('ususcc_bg_sc')
            .innerHTML.trim();
        color_set_dic.background_color_subordinate =
            document
            .getElementById('ususcc_bg_sb')
            .innerHTML.trim();
        color_set_dic.text_color_main = document
            .getElementById('ususcc_text_main')
            .innerHTML.trim();
        color_set_dic.text_color_secondary = document
            .getElementById('ususcc_text_sc')
            .innerHTML.trim();
        color_set_dic.text_color_subordinate = document
            .getElementById('ususcc_text_sb')
            .innerHTML.trim();

        color_set_dic.card_color_list[0][0] = document
            .getElementById('ususcc_card_color_0')
            .innerHTML.trim();
        color_set_dic.card_color_list[0][1] = document
            .getElementById('ususcc_card_color_1')
            .innerHTML.trim();
        color_set_dic.card_color_list[0][2] = document
            .getElementById('ususcc_card_color_2')
            .innerHTML.trim();
        color_set_dic.card_color_list[0][3] = document
            .getElementById('ususcc_card_color_3')
            .innerHTML.trim();

        user_settings_dic.enable_left_menu =
            document.getElementById(
                'us_left_menu_checkbox'
            ).checked;
        user_settings_dic.enable_card_style =
            document.getElementById(
                'us_card_style_checkbox'
            ).checked;
        user_settings_dic.enable_index_page =
            document.getElementById(
                'us_index_page_checkbox'
            ).checked;
        if (
            document.getElementById('us_zhuang_bi_radio')
            .checked
        ) {
            user_settings_dic.enable_greeting = 1;
        } else if (
            document.getElementById('us_rainbow_fart_radio')
            .checked
        ) {
            user_settings_dic.enable_greeting = 2;
        } else if (
            document.getElementById('us_chicken_soup_radio')
            .checked
        ) {
            user_settings_dic.enable_greeting = 3;
        } else if (
            document.getElementById('us_no_greeting_radio')
            .checked
        ) {
            user_settings_dic.enable_greeting = 0;
        }
        user_settings_dic.enable_developing_features =
            document.getElementById(
                'us_developing_features_checkbox'
            ).checked;
        GM_setValue('yuketang_color_set', color_set_dic);
        GM_setValue(
            'yuketang_user_settings',
            user_settings_dic
        );
        hideUserSettings();
    }

    function hideUserSettings() {
        document
            .getElementById(
                'user_script_user_settings_whole'
            )
            .setAttribute('hidden', true);
    }
})();