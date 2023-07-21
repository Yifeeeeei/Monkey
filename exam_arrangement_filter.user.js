// ==UserScript==
// @name         exam_arrangement_filter
// @version      1.2
// @description  “今天才更深切地感到考试的无聊。一些放屁胡诌的讲义硬要我们记！”
// @author       Yifeeeeei
// @updateURL    https://yifeeeeei.github.io/Monkey/exam_arrangement_filter.user.js
// @downloadURL  https://yifeeeeei.github.io/Monkey/exam_arrangement_filter.user.js
// @include      *http://zhjw.cic.tsinghua.edu.cn/jxmh.do?m=bks_ksSearch*
// @include      *https://webvpn.tsinghua.edu.cn/*m=bks_ksSearch*
// ==/UserScript==

//1.1 现在通过web vpn登录的也可以用了
//1.2 现在不用刷新了，每次搜索实际上都是在总体中搜索的

var btn = document.createElement("button");
btn.innerHTML = "filter by course_name";

var textarea = document.createElement("textarea");
var td = document.querySelector("td");
document.getElementsByTagName("span")[0].appendChild(textarea);
document.getElementsByTagName("span")[0].appendChild(btn);

var allCourses = document.getElementsByClassName("biaodan_table");
var tbody = allCourses[0].getElementsByTagName("tbody");
var courses = tbody[0].getElementsByTagName("tr");

var ori_course_list = [];
for (var c = 1; c < courses.length; c = c + 1) {
    ori_course_list.push(courses[c].cloneNode(true));
}
btn.onclick = function () {
    // var keyword = textarea.value;
    // for(var i = 1; i < courses.length; i = i + 1)
    // {
    //     var name = courses[i].getElementsByTagName("td")[3].innerHTML;
    //     if(name.search(keyword) == -1)
    //     {
    //         console.log(i);
    //         tbody[0].removeChild(courses[i]);
    //         i = i - 1;
    //     }
    // }

    while (courses.length > 1) {
        tbody[0].removeChild(courses[1]);
    }
    for (var j = 0; j < ori_course_list.length; j = j + 1) {
        console.log(ori_course_list.length);
        if (
            ori_course_list[j]
                .getElementsByTagName("td")[3]
                .innerHTML.search(textarea.value) != -1
        ) {
            tbody[0].appendChild(ori_course_list[j].cloneNode(true));
        }
    }
};
