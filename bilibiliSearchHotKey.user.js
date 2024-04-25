// ==UserScript==
// @name         bilibiliSearchHotKey
// @version      0.3
// @description  use '/' to focus on search bar, use arrow key to navigate search results, enter to open the selected video, esc to loose focus
// @author       Yifeeeeei
// @updateURL    https://yifeeeeei.github.io/Monkey/bilibiliSearchHotKey.user.js
// @downloadURL  https://yifeeeeei.github.io/Monkey/bilibiliSearchHotKey.user.js
// @grant        GM_addStyle
// @include      *bilibili.com*
// ==/UserScript==

(function () {
    var domain = window.location.href;
    var currentSelection = -1;
    var borderStyle =
        "\
    .video-list-item, .feed-card {\
        transition: border 0.5s;\
        transition: box-shadow 0.5s;\
        box-sizing: border-box;\
        border: 3px solid transparent;\
        border-radius: 8px;\
    }\
    .video-list-item.hot_key_selected, .feed-card.hot_key_selected {\
        border: 3px solid cornflowerblue;\
        box-shadow: 0 0 6px cornflowerblue;\
    }\
    ";
    var hintText = "  [/]";

    // ".bilibili-video-card .hot_key_selected {border-color: red;}";
    //  .bilibili-video-card {transition: border 0.5s; box-sizing: border-box; border: 2px solid transparent; border-radius: 5px;}
    GM_addStyle(borderStyle);

    // if domain is search.bilibili.com
    if (domain.indexOf("search.bilibili.com") != -1) {
        document.addEventListener("keydown", function (event) {
            var searchBar =
                document.getElementsByClassName("search-input-el")[0];
            if (event.key == "/") {
                searchBar.focus();
                event.preventDefault();
            }
            // when escape, loose focus
            if (event.key == "Escape") {
                searchBar.blur();
                var searchPannel =
                    document.getElementsByClassName("search-panel")[0];
                searchPannel.style = "display: none";
                event.preventDefault();
            }
            // if left or right arrow
            if (event.key == "Enter") {
                if (document.activeElement == searchBar) {
                    return;
                }
                var videoCardList =
                    document.getElementsByClassName("video-list-item");
                if (
                    videoCardList.length > 0 &&
                    currentSelection < videoCardList.length &&
                    currentSelection >= 0
                ) {
                    videoCardList[currentSelection]
                        .getElementsByClassName("bili-video-card__wrap")[0]
                        .getElementsByTagName("a")[0]
                        .click();
                }
            }
            if (event.key == "ArrowLeft" || event.key == "ArrowRight") {
                // if search bar is focused, do nothing
                if (document.activeElement == searchBar) {
                    return;
                }

                posMove = event.key == "ArrowLeft" ? -1 : 1;
                // remove "hot_key_selected" class from current selection
                var currentSelectionElement =
                    document.getElementsByClassName("hot_key_selected")[0];
                if (currentSelectionElement) {
                    currentSelectionElement.classList.remove(
                        "hot_key_selected"
                    );
                }
                // update current selection
                currentSelection = currentSelection + posMove;
                if (currentSelection < 0) {
                    currentSelection = 0;
                }
                var videoCardList =
                    document.getElementsByClassName("video-list-item");
                if (currentSelection >= videoCardList.length) {
                    currentSelection = videoCardList.length - 1;
                }
                // add "hot_key_selected" class to new selection
                videoCardList[currentSelection].classList.add(
                    "hot_key_selected"
                );
                // scorll to the selected element
                videoCardList[currentSelection].scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                    inline: "center",
                });

                event.preventDefault();
            }
        });

        // continously dected search bar, if search bar is not found, try again in 1s, after finding the search bar, add hint text
        var searchBar = null;
        var searchInterval = setInterval(function () {
            searchBar = document.getElementsByClassName("search-input-el")[0];
            if (searchBar) {
                originalPlaceholder = searchBar.getAttribute("placeholder");
                searchBar.setAttribute(
                    "placeholder",
                    originalPlaceholder + hintText
                );
                clearInterval(searchInterval);
            }
        }, 1000);
    } else {
        // all other pages
        // when '/' is pressed, focus on search bar
        document.addEventListener("keydown", function (event) {
            if (event.key == "/") {
                var searchBar =
                    document.getElementsByClassName("nav-search-input")[0];
                searchBar.focus();
                event.preventDefault();
            }
            // when escape, loose focus
            if (event.key == "Escape") {
                var searchBar =
                    document.getElementsByClassName("nav-search-input")[0];
                searchBar.blur();
                var searchPannel =
                    document.getElementsByClassName("search-panel")[0];
                var searchForm = document.getElementById("nav-searchform");
                setTimeout(function () {
                    searchForm.style.borderRadius = "8px";
                    searchPannel.style.display = "none";
                }, 100); // Delay of 100 milliseconds
                event.preventDefault();
            }
            // if key is R, click the free roll button
            if (event.key == "r") {
                // if search bar is focused, do nothing
                var searchBar =
                    document.getElementsByClassName("nav-search-input")[0];
                if (document.activeElement == searchBar) {
                    return;
                }
                // if domain not ends with bilibili.com, do nothing. This function only works on main page
                if (
                    domain.endsWith("bilibili.com") == false &&
                    domain.endsWith("bilibili.com/") == false
                ) {
                    return;
                }
                var freeRollButton = document
                    .getElementsByClassName("feed-roll-btn")[0]
                    .getElementsByTagName("button")[0];
                freeRollButton.click();
                currentSelection = -1;
                event.preventDefault();
            }

            if (event.key == "Enter") {
                var searchBar =
                    document.getElementsByClassName("nav-search-input")[0];
                if (document.activeElement == searchBar) {
                    return;
                }
                var videoCardList =
                    document.getElementsByClassName("feed-card");
                if (
                    videoCardList.length > 0 &&
                    currentSelection < videoCardList.length &&
                    currentSelection >= 0
                ) {
                    videoCardList[currentSelection]
                        .getElementsByClassName("bili-video-card")[0]
                        .getElementsByClassName("bili-video-card__wrap")[0]
                        .getElementsByTagName("a")[0]
                        .click();
                }
            }

            if (event.key == "ArrowLeft" || event.key == "ArrowRight") {
                // if search bar is focused, do nothing
                var searchBar =
                    document.getElementsByClassName("nav-search-input")[0];
                if (document.activeElement == searchBar) {
                    return;
                }
                // if domain not ends with bilibili.com, do nothing. This function only works on main page
                if (
                    domain.endsWith("bilibili.com") == false &&
                    domain.endsWith("bilibili.com/") == false
                ) {
                    return;
                }

                posMove = event.key == "ArrowLeft" ? -1 : 1;
                // remove "hot_key_selected" class from current selection
                var currentSelectionElement =
                    document.getElementsByClassName("hot_key_selected")[0];
                if (currentSelectionElement) {
                    currentSelectionElement.classList.remove(
                        "hot_key_selected"
                    );
                }
                // update current selection
                currentSelection = currentSelection + posMove;
                if (currentSelection < 0) {
                    currentSelection = 0;
                }
                var videoCardList =
                    document.getElementsByClassName("feed-card");
                if (currentSelection >= videoCardList.length) {
                    currentSelection = videoCardList.length - 1;
                }
                // add "hot_key_selected" class to new selection
                videoCardList[currentSelection].classList.add(
                    "hot_key_selected"
                );
                // scorll to the selected element
                videoCardList[currentSelection].scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                    inline: "nearest",
                });

                event.preventDefault();
            }
        });
        var tmpSearchBar = null;
        var searchInterval = setInterval(function () {
            tmpSearchBar =
                document.getElementsByClassName("nav-search-input")[0];
            if (tmpSearchBar) {
                originalPlaceholder = tmpSearchBar.getAttribute("placeholder");
                tmpSearchBar.setAttribute(
                    "placeholder",
                    originalPlaceholder + hintText
                );
                clearInterval(searchInterval);
            }
        }, 1000);

        if (
            domain.endsWith("bilibili.com") == true ||
            domain.endsWith("bilibili.com/") == true
        ) {
            var tmpRollButton = null;
            var rollInterval = setInterval(function () {
                tmpRollButton =
                    document.getElementsByClassName("feed-roll-btn")[0];
                if (tmpRollButton) {
                    var sp = tmpRollButton
                        .getElementsByTagName("button")[0]
                        .getElementsByTagName("span")[0];
                    sp.innerText = sp.innerText + "R";
                }
                if (tmpRollButton) {
                    clearInterval(rollInterval);
                }
            }, 1000);
        }
    }
})();
