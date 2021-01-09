// ==UserScript==
// @name         网络学堂深色
// @version      1.0
// @description  方便夜间内卷
// @author       if
// @include      https://learn.tsinghua.edu.cn/f/wlxt/*
// ==/UserScript==

(function () {
	"use strict";
	var basic_color = "black";
	var side_color = "rgb(37,37,37)";
	var color3 = "rgb(60,60,60)";
	var text_color1 = "white";
	var text_color2 = "rgb(186,186,186)";
	var domain = window.location.href;
	if (
		domain == "https://learn.tsinghua.edu.cn/f/wlxt/index/course/student/"
	) {
		var head, style;
		var style_innerHTML_ori;
		head = document.getElementsByTagName("head")[0];
		if (!head) {
			return;
		}
		style = head.getElementsByTagName("style")[0];
		if (!style) {
			style_innerHTML_ori = "";
		} else {
			style_innerHTML_ori = style.innerHTML;
		}

		// var basic_color = "rgb(8, 51, 45)";
		// var basic_color = "rgb(67, 52, 27)";
		// var side_color = "rgb(158,122,122)";
		// var color3 = "rgb(144,72,64)";

		//set basic color
		var set_most_background = `*{background-color :${basic_color};}`;

		var change_padding = `.boxdetail dd.stu{border-color: ${basic_color};}`;

		var clearfix_stu = `.clearfix.stu {background-color:${basic_color};}`;
		var set_div_w = `#banner .w{background-color:${basic_color};}`;
		var upper_tabs = `ul#myTabs.nav.nav-tabs.clearfix {background-color:
		${basic_color}
		;}`;

		// top banner
		var top_banner = `div#banner.header{background-color:${side_color};} 
	div#banner.header>*,div#banner.header>*>*,div#banner.header>*>*>*,div#banner.header>*>*>*>*,div#banner.header>*>*>*>*>*,div#banner.header>*>*>*>*>*>*,div#banner.header>*>*>*>*>*>*>*,div#banner.header>*>*>*>*>*>*>*>*,div#banner.header>*>*>*>*>*>*>*>*>*{background-color:${side_color};}
	div#banner.header>*>*>*>*>*>*>*>*>*{color:${text_color1}}`;
		//set text
		var set_all_color_white = `*{color:${text_color1};}`;

		var set_titile = `.titile.stu{color:${text_color2};} 
	body div.nav ul#myTabs>*>*>*{color:${text_color1};}`; ///got stn here

		var set_most_text = `body>div.nav>div#myTabContent>div#course1>dl.boxdetail>div#suoxuecourse>* >div.fl>div.hdtitle>div.btngroup>p{color:${text_color1};}
	body>div.nav>div#myTabContent>div#course1>dl.boxdetail>div#suoxuecourse>dd.stu>div.fl>div.stu>ul>*>a.uuuhhh>span.name,
	body>div.nav>div#myTabContent>div#course1>dl.boxdetail>div#suoxuecourse>dd.stu>div.fl>div.stu>ul>*>a.uuuhhh>span.stud>span.unsee{color:${text_color1};}`;

		//calendar
		var set_calender_head =
			`div.calendar{background-color:${color3};}
		h3.clearfix,div.center,h3 a,h3 span{background-color: 
		${side_color} 
        ;}` + `div.calendar.top{background-color: ${color3};}`;
		var set_date_color = `div#calendar,div#calendar div.tr_5 tbody tr td a{color:white;background-color:${color3}}`;
		var set_day_color = `div#calendar table tbody tr th{background-color:${color3};color:${text_color1};}`;
		var set_calendar_color = `div#calendar div.tr_5,div#calendar div.tr_5 table,div#calendar div.tr_5 table tbody tr,div#calendar div.tr_5 table tbody tr th,div#calendar div.tr_5 table tbody tr td {background-color:${color3};}`;

		//right side reminder
		var remind = `div.remind{background-color:${basic_color};}`;
		//hover style
		var hover = `body>div.nav>div#myTabContent>div#course1>dl.boxdetail>div#suoxuecourse>dd.stu{border-style:solid;border-width :1px; border-color:${basic_color};}
	body>div.nav>div#myTabContent>div#course1>dl.boxdetail>div#suoxuecourse>dd.stu:hover{border-style:solid;border-width :1px; border-color:${text_color2};}`;
		//tail
		var tail = `div#banner_footer>div.w>div.left,div#banner_footer>div.w>div.right{background-color:${color3};}
		
		div.banner_footer,.footer>div.w>div.left,.footer>div.w>div.right,.footer>div.w,#emailHref{background-color:${side_color};}`;

		//过去学期

		var past = `body>div.nav>div#myTabContent>div#over>div.open{background-color:${basic_color};}
	body>div.nav>div#myTabContent>div#over>div.open>div.search>form>a,body>div.nav>div#myTabContent>div#over>div.open>div.search>form>a>i{background-color:${color3};}
	table.dataTable thead th, table.dataTable{color:${text_color1} !important;}
	table.dataTable tbody th, table.dataTable tbody td{color:${text_color2} !important;}
	.select2-container .select2-selection--single{background-color:${basic_color};border-style:solid;border-width:2px;border-color:${text_color1};}
	#select2-xqxqselect-container,#select2-jslxselect-container{line-height:26px !important;}
	#kcmid{color:${text_color1}!important;background-color:${basic_color};border-style:none none solid none;border-width:2px;border-color:${text_color1};}`;

		//公开课
		var open = `#open>div{background-color:${basic_color};}
	#tabbox{background-color:${basic_color} !important;}
	#tabbox>ul>li{background-color:${side_color};}
	#kcm{background-color:${side_color}; color:${text_color1} !important;}
	#select2-kcflmselect-container,#select2-dwmcselect-container{line-height:26px !important}
	.con .item-global{height:210px;}
	.pagewraper .select2-container--default .select2-selection--single .select2-selection__rendered{line-height:20px!important;}
	.select2-container .select2-selection--single{height:30px !important;}
	#pagefooter>a{color:${text_color2} !important;}
	#getAllNetCourse>a>i,#getAllNetCourse>a{background-color:${color3};}`;

		style.innerHTML =
			style_innerHTML_ori +
			set_most_background +
			change_padding +
			clearfix_stu +
			set_div_w +
			upper_tabs +
			top_banner +
			set_all_color_white +
			set_titile +
			set_most_text +
			set_calender_head +
			set_date_color +
			set_day_color +
			set_calendar_color +
			remind +
			hover +
			tail +
			past +
			open;
	}
	//主页
	else if (
		domain.indexOf(
			"https://learn.tsinghua.edu.cn/f/wlxt/index/course/student/course"
		) != -1
	) {
		var head, style;
		var style_innerHTML_ori;
		head = document.getElementsByTagName("head")[0];
		if (!head) {
			return;
		}
		style = head.getElementsByTagName("style")[0];
		if (!style) {
			style_innerHTML_ori = "";
		} else {
			style_innerHTML_ori = style.innerHTML;
		}

		//set basic color
		var set_most_background = `*{background-color :${basic_color};color:${text_color1};}
		body{background-color:${basic_color} !important;}
		div.banner_footer,.footer>div.w>div.left,.footer>div.w>div.right,.footer>div.w,#emailHref{background-color:${side_color};}`;
		//top banner
		var top_banner = `#banner,#banner>*,#banner>*>*,#banner>*>*>*,#banner>*>*>*>*,#banner>*>*>*>*>*,#banner>*>*>*>*>*>*,#banner>*>*>*>*>*>*>*,#banner>*>*>*>*>*>*>*>*,#banner>*>*>*>*>*>*>*>*>*,#filtericon>div>div.logo-cot,#filtericon>div>div.logo-cot>div>div.up-img-info>p>*{background-color:${side_color};color:${text_color1};}`;
		//coursename
		var course_name = `.course >span.overflow {color:${text_color1};}`;
		//left side index
		var left_side_index = `.navlef .tit >a,.content .w{background-color:${basic_color} !important;}
		.tit >a {border-left:0px !important;line-height:42px;height:45px;}
		#mrhere>a>i>span{color:${text_color1} !important;}`;
		//upperblock
		var upper_block = `#content>li>div{background-color:${basic_color};}
		#searchtab>a,#searchtab>a>i{background-color:${color3};}
		#searchcourse{color:${text_color1};}
		#content>li>div>div{background-color:${basic_color};}`;
		//homework_block
		var homework_block = `#tabbox{background-color:${basic_color} !important;padding-bottom:2px !important;}
		#tabbox>ul>li{height:30px !important;color:${text_color2}}
		#tabbox>ul>li.active{background-color:${color3} !important;}`;
		style.innerHTML =
			style_innerHTML_ori +
			set_most_background +
			top_banner +
			course_name +
			left_side_index +
			upper_block +
			homework_block;
	}
	//课程公告
	else if (
		domain.indexOf(
			"https://learn.tsinghua.edu.cn/f/wlxt/kcgg/wlkc_ggb/student/beforePageListXs"
		) != -1
	) {
		var head, style;
		var style_innerHTML_ori;
		head = document.getElementsByTagName("head")[0];
		if (!head) {
			return;
		}
		style = document.createElement("style");

		head.appendChild(style);

		style_innerHTML_ori = "";

		//set basic color
		var set_most_background = `*{background-color :${basic_color};color:${text_color1};}
		body{background-color:${basic_color} !important;}
		div.banner_footer,.footer>div.w>div.left,.footer>div.w>div.right,.footer>div.w,#emailHref{background-color:${side_color};}`;
		//top banner
		var top_banner = `#banner,#banner>*,#banner>*>*,#banner>*>*>*,#banner>*>*>*>*,#banner>*>*>*>*>*,#banner>*>*>*>*>*>*,#banner>*>*>*>*>*>*>*,#banner>*>*>*>*>*>*>*>*,#banner>*>*>*>*>*>*>*>*>*,#filtericon>div>div.logo-cot,#filtericon>div>div.logo-cot>div>div.up-img-info>p>*{background-color:${side_color};color:${text_color1};}`;
		//coursename
		var course_name = `.course >span.overflow {color:${text_color1};}
		#content>div{background-color:${basic_color};}`;
		//left side index
		var left_side_index = `.navlef .tit >a,.content .w{background-color:${basic_color} !important;}
		.tit >a {border-left:0px !important;line-height:42px;height:45px;}
		#mrhere>a>i>span{color:${text_color1} !important;}`;
		//upperblock
		var upper_block = `#content>li>div{background-color:${basic_color};}
		#searchtab>a,#searchtab>a>i{background-color:${color3};}
		#searchcourse{color:${text_color1};}
		#content>li>div>div{background-color:${basic_color};}`;

		//table
		var tAble = `#table>thead>tr>th.sorting{color:${text_color1} !important;}
		#table>tbody>tr>td,#table>tbody>tr>td>a{color:${text_color1};}`;

		style.innerHTML =
			style_innerHTML_ori +
			set_most_background +
			top_banner +
			course_name +
			left_side_index +
			upper_block +
			tAble;
	}
	//课程公告-具体
	else if(domain.indexOf("https://learn.tsinghua.edu.cn/f/wlxt/kcgg/wlkc_ggb/student/beforeViewXs") != -1)
	{
		var head, style;
		var style_innerHTML_ori;
		head = document.getElementsByTagName("head")[0];
		if (!head) {
			return;
		}
		style = head.getElementsByTagName("style")[0];
		if (!style) {
			style_innerHTML_ori = "";
		} else {
			style_innerHTML_ori = style.innerHTML;
		}
		//set basic color
		var set_most_background = `*{background-color :${basic_color};color:${text_color1};}
		body{background-color:${basic_color} !important;}
		div.banner_footer,.footer>div.w>div.left,.footer>div.w>div.right,.footer>div.w,#emailHref{background-color:${side_color};}`;
		//top banner
		var top_banner = `#banner,#banner>*,#banner>*>*,#banner>*>*>*,#banner>*>*>*>*,#banner>*>*>*>*>*,#banner>*>*>*>*>*>*,#banner>*>*>*>*>*>*>*,#banner>*>*>*>*>*>*>*>*,#banner>*>*>*>*>*>*>*>*>*,#filtericon>div>div.logo-cot,#filtericon>div>div.logo-cot>div>div.up-img-info>p>*{background-color:${side_color};color:${text_color1};}`;
		//coursename
		var course_name = `.course >span.overflow {color:${text_color1};}
		#content>div{background-color:${basic_color};}`;
		//left side index
		var left_side_index = `.navlef .tit >a,.content .w{background-color:${basic_color} !important;}
		.tit >a {border-left:0px !important;line-height:42px;height:45px;}
		#mrhere>a>i>span{color:${text_color1} !important;}`;
		//upperblock
		var upper_block = `#content>li>div{background-color:${basic_color};}
		#searchtab>a,#searchtab>a>i{background-color:${color3};}
		#searchcourse{color:${text_color1};}
		#content>li>div>div{background-color:${basic_color};}`;
		var otheR = `#ggnr>p>span>span,#ggnr>p>span{background-color:${color3} !important; }
		.content .head .time span:nth-child(2n+1){color:${text_color2} !important;}
		a{color:${text_color2} !important;}`;
		style.innerHTML =
			style_innerHTML_ori +
			set_most_background +
			top_banner +
			course_name +
			left_side_index +
			upper_block +
			otheR;

	}

	//课程信息
	else if (
		domain.indexOf(
			"https://learn.tsinghua.edu.cn/f/wlxt/kc/v_kcxx_jskcxx/student/beforeXskcxx"
		) != -1
	) {
		var head, style;
		var style_innerHTML_ori;
		head = document.getElementsByTagName("head")[0];
		if (!head) {
			return;
		}
		style = head.getElementsByTagName("style")[0];
		if (!style) {
			style_innerHTML_ori = "";
		} else {
			style_innerHTML_ori = style.innerHTML;
		}

		//set basic color
		var set_most_background = `*{background-color :${basic_color};color:${text_color1};}
		body{background-color:${basic_color} !important;}
		div.banner_footer,.footer>div.w>div.left,.footer>div.w>div.right,.footer>div.w,#emailHref{background-color:${side_color};}`;
		//top banner
		var top_banner = `#banner,#banner>*,#banner>*>*,#banner>*>*>*,#banner>*>*>*>*,#banner>*>*>*>*>*,#banner>*>*>*>*>*>*,#banner>*>*>*>*>*>*>*,#banner>*>*>*>*>*>*>*>*,#banner>*>*>*>*>*>*>*>*>*,#filtericon>div>div.logo-cot,#filtericon>div>div.logo-cot>div>div.up-img-info>p>*{background-color:${side_color};color:${text_color1};}`;
		//coursename
		var course_name = `.course >span.overflow {color:${text_color1};}
		#content>div{background-color:${basic_color};}`;
		//left side index
		var left_side_index = `.navlef .tit >a,.content .w{background-color:${basic_color} !important;}
		.tit >a {border-left:0px !important;line-height:42px;height:45px;}
		#mrhere>a>i>span{color:${text_color1} !important;}`;
		//upperblock
		var upper_block = `#content>li>div{background-color:${basic_color};}
		#searchtab>a,#searchtab>a>i{background-color:${color3};}
		#searchcourse{color:${text_color1};}
		#content>li>div>div{background-color:${basic_color};}`;

		//other
		var otheR = `#content>div.course-w>div.detail>div.content-cell>div.stu_book>div.right>div{color:${text_color1} !important;}
		#content>div.course-w>div.detail>div>div.stu_book>div.right>table>tbody>*,#content>div.course-w>div.detail>div>div.stu_book>div.right>table>tbody>*>*{color:${text_color1};}
		#content>div.course-w>div.detail>div>div>div>p,#content>div.course-w>div.detail>div>div>p,#content>div.course-w>div.detail>div>div>div>p,#content>div.course-w>div.detail>div>div>div>div>p{color:${text_color1} !important;}`;

		style.innerHTML =
			style_innerHTML_ori +
			set_most_background +
			top_banner +
			course_name +
			left_side_index +
			upper_block +
			otheR;
	}
	//课程文件
	else if (
		domain.indexOf(
			"https://learn.tsinghua.edu.cn/f/wlxt/kj/wlkc_kjxxb/student/beforePageList"
		) != -1
	) {
		var head, style;
		var style_innerHTML_ori;
		head = document.getElementsByTagName("head")[0];
		if (!head) {
			return;
		}
		style = head.getElementsByTagName("style")[0];
		if (!style) {
			style_innerHTML_ori = "";
		} else {
			style_innerHTML_ori = style.innerHTML;
		}

		//set basic color
		var set_most_background = `*{background-color :${basic_color};color:${text_color1};}
		body{background-color:${basic_color} !important;}
		div.banner_footer,.footer>div.w>div.left,.footer>div.w>div.right,.footer>div.w,#emailHref{background-color:${side_color};}`;
		//top banner
		var top_banner = `#banner,#banner>*,#banner>*>*,#banner>*>*>*,#banner>*>*>*>*,#banner>*>*>*>*>*,#banner>*>*>*>*>*>*,#banner>*>*>*>*>*>*>*,#banner>*>*>*>*>*>*>*>*,#banner>*>*>*>*>*>*>*>*>*,#filtericon>div>div.logo-cot,#filtericon>div>div.logo-cot>div>div.up-img-info>p>*{background-color:${side_color};color:${text_color1};}`;
		//coursename
		var course_name = `.course >span.overflow {color:${text_color1};}
		#content>div{background-color:${basic_color};}`;
		//left side index
		var left_side_index = `.navlef .tit >a,.content .w{background-color:${basic_color} !important;}
		.tit >a {border-left:0px !important;line-height:42px;height:45px;}
		#mrhere>a>i>span{color:${text_color1} !important;}`;
		//upperblock
		var upper_block = `#content>li>div{background-color:${basic_color};}
		#searchtab>a,#searchtab>a>i{background-color:${color3};}
		#searchcourse{color:${text_color1};}
		#content>li>div>div{background-color:${basic_color};}`;

		//other
		var otheR = `#tabbox,#tabbox>ul>li{background-color:${basic_color};}
		#content>div.course-w>div.detail>form>div.cont>div.navli>div{background-color:${basic_color};}
		.navli .playli ul.selected li{background-color:${basic_color};}`;

		style.innerHTML =
			style_innerHTML_ori +
			set_most_background +
			top_banner +
			course_name +
			left_side_index +
			upper_block +
			otheR;
	}

	//课程作业
	else if (
		domain.indexOf(
			"https://learn.tsinghua.edu.cn/f/wlxt/kczy/zy/student/beforePageList"
		) != -1
	) {
		var head, style;
		var style_innerHTML_ori;
		head = document.getElementsByTagName("head")[0];
		if (!head) {
			return;
		}
		style = document.createElement("style");

		head.appendChild(style);

		style_innerHTML_ori = "";

		//set basic color
		var set_most_background = `*{background-color :${basic_color};color:${text_color1};}
		body{background-color:${basic_color} !important;}
		div.banner_footer,.footer>div.w>div.left,.footer>div.w>div.right,.footer>div.w,#emailHref{background-color:${side_color};}`;
		//top banner
		var top_banner = `#banner,#banner>*,#banner>*>*,#banner>*>*>*,#banner>*>*>*>*,#banner>*>*>*>*>*,#banner>*>*>*>*>*>*,#banner>*>*>*>*>*>*>*,#banner>*>*>*>*>*>*>*>*,#banner>*>*>*>*>*>*>*>*>*,#filtericon>div>div.logo-cot,#filtericon>div>div.logo-cot>div>div.up-img-info>p>*{background-color:${side_color};color:${text_color1};}`;
		//coursename
		var course_name = `.course >span.overflow {color:${text_color1};}
		#content>div{background-color:${basic_color};}`;
		//left side index
		var left_side_index = `.navlef .tit >a,.content .w{background-color:${basic_color} !important;}
		.tit >a {border-left:0px !important;line-height:42px;height:45px;}
		#mrhere>a>i>span{color:${text_color1} !important;}`;
		//upperblock
		var upper_block = `#content>li>div{background-color:${basic_color};}
		#searchtab>a,#searchtab>a>i{background-color:${color3};}
		#searchcourse{color:${text_color1};}
		#content>li>div>div{background-color:${basic_color};}`;

		var otheR = `#tabbox,.tabbox .mytabs li.active {background-color:${basic_color};}
		.tabbox .mytabs li,#wtj>*>*>*,#wtj>*>*>*>a{color:${text_color1};}
		#wtj>tbody>tr>td>a.btn,.webicon-edit:before{background-color:${color3};}
		`;

		style.innerHTML =
			style_innerHTML_ori +
			set_most_background +
			top_banner +
			course_name +
			left_side_index +
			upper_block +
			otheR;
	}
	//课程作业-具体
	else if(domain.indexOf("https://learn.tsinghua.edu.cn/f/wlxt/kczy/zy/student/viewCj") != -1)
	{
		var head, style;
		var style_innerHTML_ori;
		head = document.getElementsByTagName("head")[0];
		if (!head) {
			return;
		}
		style = head.getElementsByTagName("style")[0];
		if (!style) {
			style_innerHTML_ori = "";
		} else {
			style_innerHTML_ori = style.innerHTML;
		}
		//set basic color
		var set_most_background = `*{background-color :${basic_color};color:${text_color1};}
		body{background-color:${basic_color} !important;}`;
		//top banner
		var top_banner = `#banner,#banner>*,#banner>*>*,#banner>*>*>*,#banner>*>*>*>*,#banner>*>*>*>*>*,#banner>*>*>*>*>*>*,#banner>*>*>*>*>*>*>*,#banner>*>*>*>*>*>*>*>*,#banner>*>*>*>*>*>*>*>*>*,#filtericon>div>div.logo-cot,#filtericon>div>div.logo-cot>div>div.up-img-info>p>*{background-color:${side_color};color:${text_color1};}`;
		//coursename
		var course_name = `.course >span.overflow {color:${text_color1};}
		#content>div{background-color:${basic_color};}`;
		//left side index
		var left_side_index = `.navlef .tit >a,.content .w{background-color:${basic_color} !important;}
		.tit >a {border-left:0px !important;line-height:42px;height:45px;}
		#mrhere>a>i>span{color:${text_color1} !important;}`;
		//upperblock
		var upper_block = `#content>li>div{background-color:${basic_color};}
		#searchtab>a,#searchtab>a>i{background-color:${color3};}
		#searchcourse{color:${text_color1};}
		#content>li>div>div{background-color:${basic_color};}`;
		var otheR = `.detail .list .left{color:${text_color2};}
		a{color:${text_color2} !important;}`;
		style.innerHTML =
			style_innerHTML_ori +
			set_most_background +
			top_banner +
			course_name +
			left_side_index +
			upper_block +
			otheR;

	}
	//课程讨论
	else if (
		domain.indexOf(
			"https://learn.tsinghua.edu.cn/f/wlxt/bbs/bbs_tltb/student/beforePageTlList"
		) != -1
	) {
		var head, style;
		var style_innerHTML_ori;
		head = document.getElementsByTagName("head")[0];
		if (!head) {
			return;
		}
		style = head.getElementsByTagName("style")[0];
		if (!style) {
			style_innerHTML_ori = "";
		} else {
			style_innerHTML_ori = style.innerHTML;
		}

		//set basic color
		var set_most_background = `*{background-color :${basic_color};color:${text_color1};}
		body{background-color:${basic_color} !important;}`;
		//top banner
		var top_banner = `#banner,#banner>*,#banner>*>*,#banner>*>*>*,#banner>*>*>*>*,#banner>*>*>*>*>*,#banner>*>*>*>*>*>*,#banner>*>*>*>*>*>*>*,#banner>*>*>*>*>*>*>*>*,#banner>*>*>*>*>*>*>*>*>*,#filtericon>div>div.logo-cot,#filtericon>div>div.logo-cot>div>div.up-img-info>p>*{background-color:${side_color};color:${text_color1};}`;
		//coursename
		var course_name = `.course >span.overflow {color:${text_color1};}
		#content>div{background-color:${basic_color};}`;
		//left side index
		var left_side_index = `.navlef .tit >a,.content .w{background-color:${basic_color} !important;}
		.tit >a {border-left:0px !important;line-height:42px;height:45px;}
		#mrhere>a>i>span{color:${text_color1} !important;}`;
		//upperblock
		var upper_block = `#content>li>div{background-color:${basic_color};}
		#searchtab>a,#searchtab>a>i{background-color:${color3};}
		#searchcourse{color:${text_color1};}
		#content>li>div>div{background-color:${basic_color};}`;


		var otheR = `#tabbox,.tabbox .mytabs li.active {background-color:${basic_color};}
		.tabbox .mytabs li >p,table.dataTable thead th, table.dataTable>tbody>tr>td>*,table.dataTable>tbody>tr>td{color:${text_color1} !important;}
		#wtj>tbody>tr>td>a.btn,.webicon-edit:before{background-color:${color3};}
		a.btn,i.webicon-increse{background-color:${color3} !important;}`;
		style.innerHTML =
			style_innerHTML_ori +
			set_most_background +
			top_banner +
			course_name +
			left_side_index +
			upper_block +
			otheR;
	}
	//课程讨论-具体
	else if(domain.indexOf("https://learn.tsinghua.edu.cn/f/wlxt/bbs/bbs_tltb/student/viewTlById") != -1)
	{
		var head, style;
		var style_innerHTML_ori;
		head = document.getElementsByTagName("head")[0];
		if (!head) {
			return;
		}
		style = head.getElementsByTagName("style")[0];
		if (!style) {
			style_innerHTML_ori = "";
		} else {
			style_innerHTML_ori = style.innerHTML;
		}
		//set basic color
		var set_most_background = `*{background-color :${basic_color};color:${text_color1};}
		body{background-color:${basic_color} !important;}
		div.banner_footer,.footer>div.w>div.left,.footer>div.w>div.right,.footer>div.w,#emailHref{background-color:${side_color};}`;
		//top banner
		var top_banner = `#banner,#banner>*,#banner>*>*,#banner>*>*>*,#banner>*>*>*>*,#banner>*>*>*>*>*,#banner>*>*>*>*>*>*,#banner>*>*>*>*>*>*>*,#banner>*>*>*>*>*>*>*>*,#banner>*>*>*>*>*>*>*>*>*,#filtericon>div>div.logo-cot,#filtericon>div>div.logo-cot>div>div.up-img-info>p>*{background-color:${side_color};color:${text_color1};}`;
		//coursename
		var course_name = `.course >span.overflow {color:${text_color1};}
		#content>div{background-color:${basic_color};}`;
		//left side index
		var left_side_index = `.navlef .tit >a,.content .w{background-color:${basic_color} !important;}
		.tit >a {border-left:0px !important;line-height:42px;height:45px;}
		#mrhere>a>i>span{color:${text_color1} !important;}`;
		//upperblock
		var upper_block = `#content>li>div{background-color:${basic_color};}
		#searchtab>a,#searchtab>a>i{background-color:${color3};}
		#searchcourse{color:${text_color1};}
		#content>li>div>div{background-color:${basic_color};}`;
		var otheR = `.detail .tipbox,.detail .tipbox>span,input,textarea{background-color:${color3} !important;}
		.fenye,#tlbt,.detail >form {background-color:${basic_color} !important;}`;
		style.innerHTML =
			style_innerHTML_ori +
			set_most_background +
			top_banner +
			course_name +
			left_side_index +
			upper_block +
			otheR;

	}
	//课程答疑
	else if(domain.indexOf("https://learn.tsinghua.edu.cn/f/wlxt/bbs/bbs_kcdy/student/beforePageDyList") != -1)
	{
		var head, style;
		var style_innerHTML_ori;
		head = document.getElementsByTagName("head")[0];
		if (!head) {
			return;
		}
		style = document.createElement("style");

		head.appendChild(style);

		style_innerHTML_ori = "";

		//set basic color
		var set_most_background = `*{background-color :${basic_color};color:${text_color1};}
		body{background-color:${basic_color} !important;}
		div.banner_footer,.footer>div.w>div.left,.footer>div.w>div.right,.footer>div.w,#emailHref{background-color:${side_color};}`;
		//top banner
		var top_banner = `#banner,#banner>*,#banner>*>*,#banner>*>*>*,#banner>*>*>*>*,#banner>*>*>*>*>*,#banner>*>*>*>*>*>*,#banner>*>*>*>*>*>*>*,#banner>*>*>*>*>*>*>*>*,#banner>*>*>*>*>*>*>*>*>*,#filtericon>div>div.logo-cot,#filtericon>div>div.logo-cot>div>div.up-img-info>p>*{background-color:${side_color};color:${text_color1};}`;
		//coursename
		var course_name = `.course >span.overflow {color:${text_color1};}
		#content>div{background-color:${basic_color};}`;
		//left side index
		var left_side_index = `.navlef .tit >a,.content .w{background-color:${basic_color} !important;}
		.tit >a {border-left:0px !important;line-height:42px;height:45px;}
		#mrhere>a>i>span{color:${text_color1} !important;}`;
		//upperblock
		var upper_block = `#content>li>div{background-color:${basic_color};}
		#searchtab>a,#searchtab>a>i{background-color:${color3};}
		#searchcourse{color:${text_color1};}
		#content>li>div>div{background-color:${basic_color};}`;

		var otheR = `#tabbox,.tabbox .mytabs li.active {background-color:${basic_color};}
		.tabbox .mytabs li,.tabbox .mytabs li >p,table.dataTable thead th, table.dataTable>tbody>tr>td>*,table.dataTable>tbody>tr>td{color:${text_color1} !important;}
		#wtj>tbody>tr>td>a.btn,.webicon-edit:before{background-color:${color3};}
		a.btn,i.webicon-increse{background-color:${color3} !important;}`;
		style.innerHTML =
			style_innerHTML_ori +
			set_most_background +
			top_banner +
			course_name +
			left_side_index +
			upper_block +
			otheR;
	}
	//课程邮件
	else if(domain.indexOf("https://learn.tsinghua.edu.cn/f/wlxt/mail/yj_yjxxb/student/beforePageList") != -1)
	{
		var head, style;
		var style_innerHTML_ori;
		head = document.getElementsByTagName("head")[0];
		if (!head) {
			return;
		}
		style = document.createElement("style");

		head.appendChild(style);

		style_innerHTML_ori = "";

		//set basic color
		var set_most_background = `*{background-color :${basic_color};color:${text_color1};}
		body{background-color:${basic_color} !important;}
		div.banner_footer,.footer>div.w>div.left,.footer>div.w>div.right,.footer>div.w,#emailHref{background-color:${side_color};}`;
		//top banner
		var top_banner = `#banner,#banner>*,#banner>*>*,#banner>*>*>*,#banner>*>*>*>*,#banner>*>*>*>*>*,#banner>*>*>*>*>*>*,#banner>*>*>*>*>*>*>*,#banner>*>*>*>*>*>*>*>*,#banner>*>*>*>*>*>*>*>*>*,#filtericon>div>div.logo-cot,#filtericon>div>div.logo-cot>div>div.up-img-info>p>*{background-color:${side_color};color:${text_color1};}`;
		//coursename
		var course_name = `.course >span.overflow {color:${text_color1};}
		#content>div{background-color:${basic_color};}`;
		//left side index
		var left_side_index = `.navlef .tit >a,.content .w{background-color:${basic_color} !important;}
		.tit >a {border-left:0px !important;line-height:42px;height:45px;}
		#mrhere>a>i>span{color:${text_color1} !important;}`;
		//upperblock
		var upper_block = `#content>li>div{background-color:${basic_color};}
		#searchtab>a,#searchtab>a>i{background-color:${color3};}
		#searchcourse{color:${text_color1};}
		#content>li>div>div{background-color:${basic_color};}`;

		var otheR = `#tabbox,.tabbox .mytabs li.active,.zeromodal-container  {background-color:${basic_color} !important;}
		.tabbox .mytabs li,.tabbox .mytabs li >p,table.dataTable thead th, table.dataTable>tbody>tr>td>*,table.dataTable>tbody>tr>td{color:${text_color1} !important;}
		#wtj>tbody>tr>td>a.btn,.webicon-send:before{background-color:${color3};}
		a.btn,i.webicon-increse{background-color:${color3} !important;}
		.detail .tipbox,#content>div.course-w>div.detail>div.tipbox>span{background-color:${side_color};}
		`;
		style.innerHTML =
			style_innerHTML_ori +
			set_most_background +
			top_banner +
			course_name +
			left_side_index +
			upper_block +
			otheR;
	}
	//新邮件
	else if(domain.indexOf("https://learn.tsinghua.edu.cn/f/wlxt/mail/yj_yjxxb/student/beforeAdd") != -1)
	{
		var head, style;
		var style_innerHTML_ori;
		head = document.getElementsByTagName("head")[0];
		if (!head) {
			return;
		}
		style = head.getElementsByTagName("style")[0];
		if (!style) {
			style_innerHTML_ori = "";
		} else {
			style_innerHTML_ori = style.innerHTML;
		}
		//set basic color
		var set_most_background = `*{background-color :${basic_color};color:${text_color1};}
		body{background-color:${basic_color} !important;}
		div.banner_footer,.footer>div.w>div.left,.footer>div.w>div.right,.footer>div.w,#emailHref{background-color:${side_color};}`;
		//top banner
		var top_banner = `#banner,#banner>*,#banner>*>*,#banner>*>*>*,#banner>*>*>*>*,#banner>*>*>*>*>*,#banner>*>*>*>*>*>*,#banner>*>*>*>*>*>*>*,#banner>*>*>*>*>*>*>*>*,#banner>*>*>*>*>*>*>*>*>*,#filtericon>div>div.logo-cot,#filtericon>div>div.logo-cot>div>div.up-img-info>p>*{background-color:${side_color};color:${text_color1};}`;
		//coursename
		var course_name = `.course >span.overflow {color:${text_color1};}
		#content>div{background-color:${basic_color};}`;
		//left side index
		var left_side_index = `.navlef .tit >a,.content .w{background-color:${basic_color} !important;}
		.tit >a {border-left:0px !important;line-height:42px;height:45px;}
		#mrhere>a>i>span{color:${text_color1} !important;}`;
		//upperblock
		var upper_block = `#content>li>div{background-color:${basic_color};}
		#searchtab>a,#searchtab>a>i{background-color:${color3};}
		#searchcourse{color:${text_color1};}
		#content>li>div>div{background-color:${basic_color};}`;
		var otheR = `.left{color:${text_color2} !important;}
		#cke_1_top,#cke_1_bottom,.cke_wysiwyg_frame, .cke_wysiwyg_div{color:${text_color2};background-color:${color3} !important;}
		p{color:${text_color1} !important;}`;
		style.innerHTML =
			style_innerHTML_ori +
			set_most_background +
			top_banner +
			course_name +
			left_side_index +
			upper_block +
			otheR;
	}
	//我的分组
	else if(domain.indexOf("https://learn.tsinghua.edu.cn/f/wlxt/qz/v_wlkc_qzcyb/student/beforePageWdfzList") != -1)
	{
		var head, style;
		var style_innerHTML_ori;
		head = document.getElementsByTagName("head")[0];
		if (!head) {
			return;
		}
		style = head.getElementsByTagName("style")[0];
		if (!style) {
			style_innerHTML_ori = "";
		} else {
			style_innerHTML_ori = style.innerHTML;
		}

		//set basic color
		var set_most_background = `*{background-color :${basic_color};color:${text_color1};}
		body{background-color:${basic_color} !important;}
		div.banner_footer,.footer>div.w>div.left,.footer>div.w>div.right,.footer>div.w,#emailHref{background-color:${side_color};}`;
		//top banner
		var top_banner = `#banner,#banner>*,#banner>*>*,#banner>*>*>*,#banner>*>*>*>*,#banner>*>*>*>*>*,#banner>*>*>*>*>*>*,#banner>*>*>*>*>*>*>*,#banner>*>*>*>*>*>*>*>*,#banner>*>*>*>*>*>*>*>*>*,#filtericon>div>div.logo-cot,#filtericon>div>div.logo-cot>div>div.up-img-info>p>*{background-color:${side_color};color:${text_color1};}`;
		//coursename
		var course_name = `.course >span.overflow {color:${text_color1};}
		#content>div{background-color:${basic_color};}`;
		//left side index
		var left_side_index = `.navlef .tit >a,.content .w{background-color:${basic_color} !important;}
		.tit >a {border-left:0px !important;line-height:42px;height:45px;}
		#mrhere>a>i>span{color:${text_color1} !important;}`;
		//upperblock
		var upper_block = `#content>li>div{background-color:${basic_color};}
		#searchtab>a,#searchtab>a>i{background-color:${color3};}
		#searchcourse{color:${text_color1};}
		#content>li>div>div{background-color:${basic_color};}`;


		var otheR = `#tabbox,.tabbox .mytabs li.active {background-color:${basic_color};}
		.tabbox .mytabs li >p,table.dataTable thead th, table.dataTable>tbody>tr>td>*,table.dataTable>tbody>tr>td{color:${text_color1} !important;}
		#wtj>tbody>tr>td>a.btn,.webicon-edit:before{background-color:${color3};}
		a.btn,i.webicon-increse{background-color:${color3} !important;}`;
		style.innerHTML =
			style_innerHTML_ori +
			set_most_background +
			top_banner +
			course_name +
			left_side_index +
			upper_block +
			otheR;
	}
	//在线课表
	else if(domain.indexOf("https://learn.tsinghua.edu.cn/f/wlxt/zxkt/wlkc_zxktb/student/beforePageList") != -1)
	{
		var head, style;
		var style_innerHTML_ori;
		head = document.getElementsByTagName("head")[0];
		if (!head) {
			return;
		}
		style = head.getElementsByTagName("style")[0];
		if (!style) {
			style_innerHTML_ori = "";
		} else {
			style_innerHTML_ori = style.innerHTML;
		}

		//set basic color
		var set_most_background = `*{background-color :${basic_color};color:${text_color1};}
		body{background-color:${basic_color} !important;}
		div.banner_footer,.footer>div.w>div.left,.footer>div.w>div.right,.footer>div.w,#emailHref{background-color:${side_color};}`;
		//top banner
		var top_banner = `#banner,#banner>*,#banner>*>*,#banner>*>*>*,#banner>*>*>*>*,#banner>*>*>*>*>*,#banner>*>*>*>*>*>*,#banner>*>*>*>*>*>*>*,#banner>*>*>*>*>*>*>*>*,#banner>*>*>*>*>*>*>*>*>*,#filtericon>div>div.logo-cot,#filtericon>div>div.logo-cot>div>div.up-img-info>p>*{background-color:${side_color};color:${text_color1};}`;
		//coursename
		var course_name = `.course >span.overflow {color:${text_color1};}
		#content>div{background-color:${basic_color};}`;
		//left side index
		var left_side_index = `.navlef .tit >a,.content .w{background-color:${basic_color} !important;}
		.tit >a {border-left:0px !important;line-height:42px;height:45px;}
		#mrhere>a>i>span{color:${text_color1} !important;}`;
		//upperblock
		var upper_block = `#content>li>div{background-color:${basic_color};}
		#searchtab>a,#searchtab>a>i{background-color:${color3};}
		#searchcourse{color:${text_color1};}
		#content>li>div>div{background-color:${basic_color};}`;


		var otheR = `#tabbox,.tabbox .mytabs li {color:${text_color1};background-color:${basic_color};}
		.tabbox .mytabs li.active{background-color:${basic_color};}
		.tabbox .mytabs li >p,table.dataTable thead th, table.dataTable>tbody>tr>td>*,table.dataTable>tbody>tr>td{color:${text_color1} !important;}
		.smbox,.headsm,.headsm>i {color:${text_color1} ;background-color:${color3};z-index:1}
		.headsm{color:${text_color1} !important;z-index:10;}`;
		style.innerHTML =
			style_innerHTML_ori +
			set_most_background +
			top_banner +
			course_name +
			left_side_index +
			upper_block +
			otheR;
	}
})();
