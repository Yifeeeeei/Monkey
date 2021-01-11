// ==UserScript==
// @name         网络学堂深色配色
// @version      1.2
// @description  方便夜间内卷
// @author       if
// @updateURL    https://yifeeeeei.github.io/Monkey/wlxt_dark_theme.user.js
// @downloadURL  https://yifeeeeei.github.io/Monkey/wlxt_dark_theme.user.js
// @include      https://learn.tsinghua.edu.cn/f/*
// @run-at       document-start
// ==/UserScript==


//update
//1.1 just organised the code
//1.2 the original-bloody-blind-to-death website will not flash by now... well sometime it still does, much not so often

(function () {
	"use strict";
	var body = document.getElementsByTagName("body")[0];

	var basic_color = "black";
	var side_color = "rgb(37,37,37)";
	var color3 = "rgb(60,60,60)";
	var text_color1 = "white";
	var text_color2 = "rgb(186,186,186)";
	var domain = window.location.href;

	var head, style;
	var style_innerHTML_ori;
	head = document.getElementsByTagName("head")[0];

	var styles = head.getElementsByTagName("style");
	if (styles.length == 0) {
		style_innerHTML_ori = "";
		style = document.createElement("style");
		head.appendChild(style);
	} else {
		style = styles[0];
		style_innerHTML_ori = style.innerHTML;
	}
	function changeBackground() {
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
		//footer
		var footer = `#banner_footer,#emailHref,#banner_footer>div,#banner_footer>div>div{background-color:${side_color};}`;
		//searchpannel
		var searchpannel = `#searchpanel{background-color :${basic_color};} tbody,tbody>*,tbody>*>*,tbody>*>*>*,tbody>*>*>*>*,thread,thread>*,th,thread>*>*,thread>*>*>*{color:${text_color1} !important;}`;
		//btn
		var btn = `.btn,.btn>*,.btn>*>*{background-color:${color3} !important;}`
		style.innerHTML =
			style_innerHTML_ori +
			set_most_background +
			top_banner +
			course_name +
			left_side_index +
			upper_block +
			footer +
			searchpannel +
			btn;
	}

	changeBackground();

	var otheR = ``;

	//1 MainPage
	if (
		domain == "https://learn.tsinghua.edu.cn/f/wlxt/index/course/student/"
	) {
		otheR =
			`.boxdetail dd.stu{border-color: ${basic_color};}` +
			`.clearfix.stu {background-color:${basic_color};}` +
			`div.calendar{background-color:${color3};}
            h3.clearfix,div.center,h3 a,h3 span{background-color:${side_color};}` +
			`div.calendar.top{background-color: ${color3};}` +
			`div#calendar,div#calendar div.tr_5 tbody tr td a{color:white;background-color:${color3}}` +
			`div#calendar table tbody tr th{background-color:${color3};color:${text_color1};}` +
			`div#calendar div.tr_5,div#calendar div.tr_5 table,div#calendar div.tr_5 table tbody tr,div#calendar div.tr_5 table tbody tr th,div#calendar div.tr_5 table tbody tr td {background-color:${color3};}` +
			`ul#myTabs.nav.nav-tabs.clearfix {background-color:${basic_color};}` +
			`div.remind{background-color:${basic_color};}` +
			`body>div.nav>div#myTabContent>div#course1>dl.boxdetail>div#suoxuecourse>dd.stu{border-style:solid;border-width :1px; border-color:${basic_color};}
            body>div.nav>div#myTabContent>div#course1>dl.boxdetail>div#suoxuecourse>dd.stu:hover{border-style:solid;border-width :1px; border-color:${text_color2};}` + //hover
			`body>div.nav>div#myTabContent>div#over>div.open{background-color:${basic_color};}
	        body>div.nav>div#myTabContent>div#over>div.open>div.search>form>a,body>div.nav>div#myTabContent>div#over>div.open>div.search>form>a>i{background-color:${color3};}
	        table.dataTable thead th, table.dataTable{color:${text_color1} !important;}
	        table.dataTable tbody th, table.dataTable tbody td{color:${text_color2} !important;}
	        .select2-container .select2-selection--single{background-color:${basic_color};border-style:solid;border-width:2px;border-color:${text_color1};}
	        #select2-xqxqselect-container,#select2-jslxselect-container{line-height:26px !important;}
            #kcmid{color:${text_color1}!important;background-color:${basic_color};border-style:none none solid none;border-width:2px;border-color:${text_color1};}` + //past
			`#open>div{background-color:${basic_color};}
	        #tabbox{background-color:${basic_color} !important;}
	        #tabbox>ul>li{background-color:${side_color};}
	        #kcm{background-color:${side_color}; color:${text_color1} !important;}
	        #select2-kcflmselect-container,#select2-dwmcselect-container{line-height:26px !important}
	        .con .item-global{height:210px;}
	        .pagewraper .select2-container--default .select2-selection--single .select2-selection__rendered{line-height:20px!important;}
	        .select2-container .select2-selection--single{height:30px !important;}
	        #pagefooter>a{color:${text_color2} !important;}
            #getAllNetCourse>a>i,#getAllNetCourse>a{background-color:${color3};}` + //open;
			`body>div.nav>div#myTabContent>div#course1>dl.boxdetail>div#suoxuecourse>* >div.fl>div.hdtitle>div.btngroup>p,#course1>dl>dt{color:${text_color1};}
	        body>div.nav>div#myTabContent>div#course1>dl.boxdetail>div#suoxuecourse>dd.stu>div.fl>div.stu>ul>*>a.uuuhhh>span.name,
			body>div.nav>div#myTabContent>div#course1>dl.boxdetail>div#suoxuecourse>dd.stu>div.fl>div.stu>ul>*>a.uuuhhh>span.stud>span.unsee{color:${text_color1};}` +//text
			`html>body>div.bground{background-color:${basic_color};}` + //登录页面
			`.chongxin{background-color:${color3};}`;
	}
	//2 HomePage
	else if (
		domain.indexOf(
			"https://learn.tsinghua.edu.cn/f/wlxt/index/course/student/course"
		) != -1
	) {
		otheR = `#tabbox{background-color:${basic_color} !important;padding-bottom:2px !important;}
		    #discuss>dd>ul>li>div>div>span>a>div>p,#tabbox>ul>li{height:30px !important;color:${text_color2}}
		    #tabbox>ul>li.active{background-color:${color3} !important;}`;
	}
	//3 Notices
	else if (
		domain.indexOf(
			"https://learn.tsinghua.edu.cn/f/wlxt/kcgg/wlkc_ggb/student/beforePageListXs"
		) != -1
	) {
		otheR = `#table>thead>tr>th.sorting{color:${text_color1} !important;}
		    #table>tbody>tr>td,#table>tbody>tr>td>a{color:${text_color1};}`;
	}
	//4 inner-Notice
	else if (
		domain.indexOf(
			"https://learn.tsinghua.edu.cn/f/wlxt/kcgg/wlkc_ggb/student/beforeViewXs"
		) != -1
	) {
		otheR = `#ggnr>p>span>span,#ggnr>p>span{background-color:${color3} !important; }
		    .content .head .time span:nth-child(2n+1){color:${text_color2} !important;}
		    a{color:${text_color2} !important;}`;
	}
	//5 Overview
	else if (
		domain.indexOf(
			"https://learn.tsinghua.edu.cn/f/wlxt/kc/v_kcxx_jskcxx/student/beforeXskcxx"
		) != -1
	) {
		otheR = `#content>div.course-w>div.detail>div.content-cell>div.stu_book>div.right>div{color:${text_color1} !important;}
		    #content>div.course-w>div.detail>div>div.stu_book>div.right>table>tbody>*,#content>div.course-w>div.detail>div>div.stu_book>div.right>table>tbody>*>*{color:${text_color1};}
		    #content>div.course-w>div.detail>div>div>div>p,#content>div.course-w>div.detail>div>div>p,#content>div.course-w>div.detail>div>div>div>p,#content>div.course-w>div.detail>div>div>div>div>p{color:${text_color1} !important;}`;
	}
	//6 Documents
	else if (
		domain.indexOf(
			"https://learn.tsinghua.edu.cn/f/wlxt/kj/wlkc_kjxxb/student/beforePageList"
		) != -1
	) {
		otheR = `#tabbox,#tabbox>ul>li{background-color:${basic_color};}
		    #content>div.course-w>div.detail>form>div.cont>div.navli>div{background-color:${basic_color};}
		    .navli .playli ul.selected li{background-color:${basic_color};}`;
	}
	//7 Works
	else if (
		domain.indexOf(
			"https://learn.tsinghua.edu.cn/f/wlxt/kczy/zy/student/beforePageList"
		) != -1
	) {
		otheR = `#tabbox,.tabbox .mytabs li.active {background-color:${basic_color};}
		    .tabbox .mytabs li,#wtj>*>*>*,#wtj>*>*>*>a{color:${text_color1};}
		    #wtj>tbody>tr>td>a.btn,.webicon-edit:before{background-color:${color3};}`;
	}
	//8 inner-Works
	else if (
		domain.indexOf(
			"https://learn.tsinghua.edu.cn/f/wlxt/kczy/zy/student/viewCj"
		) != -1
	) {
		otheR = `.detail .list .left{color:${text_color2};}
            a{color:${text_color2} !important;}`;
	}
	//9 Discussions
	else if (
		domain.indexOf(
			"https://learn.tsinghua.edu.cn/f/wlxt/bbs/bbs_tltb/student/beforePageTlList"
		) != -1
	) {
		otheR = `#tabbox,.tabbox .mytabs li.active {background-color:${basic_color};}
		    .tabbox .mytabs li >p,table.dataTable thead th, table.dataTable>tbody>tr>td>*,table.dataTable>tbody>tr>td{color:${text_color1} !important;}
		    #wtj>tbody>tr>td>a.btn,.webicon-edit:before{background-color:${color3};}
		    a.btn,i.webicon-increse{background-color:${color3} !important;}`;
	}
	//10 inner-Discussion
	else if (
		domain.indexOf(
			"https://learn.tsinghua.edu.cn/f/wlxt/bbs/bbs_tltb/student/viewTlById"
		) != -1
	) {
		otheR = `.detail .tipbox,.detail .tipbox>span,input,textarea{background-color:${color3} !important;}
            .fenye,#tlbt,.detail >form {background-color:${basic_color} !important;}
            #answer_first{color:${text_color1};}
            #addBtn,#addBtn>*{background-color:${color3};}`;
    }
    //11 Q&A
    else if(domain.indexOf("https://learn.tsinghua.edu.cn/f/wlxt/bbs/bbs_kcdy/student/beforePageDyList") != -1)
    {
        otheR = `#tabbox,.tabbox .mytabs li.active {background-color:${basic_color};}
		    .tabbox .mytabs li,.tabbox .mytabs li >p,table.dataTable thead th, table.dataTable>tbody>tr>td>*,table.dataTable>tbody>tr>td{color:${text_color1} !important;}
		    #wtj>tbody>tr>td>a.btn,.webicon-edit:before{background-color:${color3};}
		    a.btn,i.webicon-increse{background-color:${color3} !important;}`;
    }
    //12 Email
    else if(domain.indexOf("https://learn.tsinghua.edu.cn/f/wlxt/mail/yj_yjxxb/student/beforePageList") != -1)
    {
        otheR = `#tabbox,.tabbox .mytabs li.active,.zeromodal-container  {background-color:${basic_color} !important;}
		    .tabbox .mytabs li,.tabbox .mytabs li >p,table.dataTable thead th, table.dataTable>tbody>tr>td>*,table.dataTable>tbody>tr>td{color:${text_color1} !important;}
		    #wtj>tbody>tr>td>a.btn,.webicon-send:before{background-color:${color3};}
		    a.btn,i.webicon-increse{background-color:${color3} !important;}
		    .detail .tipbox,#content>div.course-w>div.detail>div.tipbox>span{background-color:${side_color};}`;
    }
    //13 inner-Email
    else if(domain.indexOf("https://learn.tsinghua.edu.cn/f/wlxt/mail/yj_yjxxb/student/beforeAdd") != -1)
    {
        otheR = `.left{color:${text_color2} !important;}
		    #cke_1_top,#cke_1_bottom,.cke_wysiwyg_frame, .cke_wysiwyg_div{color:${text_color2};background-color:${color3} !important;}
            iframe>html>body>p{color:${text_color1} !important;}`;
    }
    //14  Groups
    else if(domain.indexOf("https://learn.tsinghua.edu.cn/f/wlxt/qz/v_wlkc_qzcyb/student/beforePageWdfzList") != -1)
    {
        otheR = `#tabbox,.tabbox .mytabs li.active {background-color:${basic_color};}
		    .tabbox .mytabs li >p,table.dataTable thead th, table.dataTable>tbody>tr>td>*,table.dataTable>tbody>tr>td{color:${text_color1} !important;}
		    #wtj>tbody>tr>td>a.btn,.webicon-edit:before{background-color:${color3};}
		    a.btn,i.webicon-increse{background-color:${color3} !important;}`;
    }
    //15 Online Coures
    else if(domain.indexOf("https://learn.tsinghua.edu.cn/f/wlxt/zxkt/wlkc_zxktb/student/beforePageList") != -1)
    {
        otheR = `#tabbox,.tabbox .mytabs li {color:${text_color1};background-color:${basic_color};}
		    .tabbox .mytabs li.active{background-color:${basic_color};}
		    .tabbox .mytabs li >p,table.dataTable thead th, table.dataTable>tbody>tr>td>*,table.dataTable>tbody>tr>td{color:${text_color1} !important;}
		    .smbox,.headsm,.headsm>i {color:${text_color1} ;background-color:${color3};z-index:1}
		    .headsm{color:${text_color1} !important;z-index:10;}`;
	}
	//16 login
	else if(domain.indexOf("https://learn.tsinghua.edu.cn/f/login") != -1)
	{
		//去掉header
		var header = document.getElementsByClassName("header")[0];
		header.parentElement.removeChild(header);
		otheR = `.bgcolor{background-color:${basic_color};}`+
			`#loginDivId>div>div>span,#loginForm,#loginDivId{background-color:rgba(0,0,0,0.0);}`;
	}

    //sum up
	style.innerHTML = style.innerHTML + otheR;
})();
