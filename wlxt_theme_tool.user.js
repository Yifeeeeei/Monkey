// ==UserScript==
// @name         wlxt_theme_tool
// @version      1.5
// @description  customize your wlxt
// @author       if
// @updateURL    https://yifeeeeei.github.io/Monkey/wlxt_theme_tool.user.js
// @downloadURL  https://yifeeeeei.github.io/Monkey/wlxt_theme_tool.user.js
// @include      https://learn.tsinghua.edu.cn/f/*
// @require      https://greasyfork.org/scripts/31940-waitforkeyelements/code/waitForKeyElements.js?version=209282
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-start
// ==/UserScript==

//update
//1.1 just organised the code
//1.2 the original-bloody-blind-to-death website will not flash by now... well sometime it still does, much not so often
//1.3 change name to "wlxt_theme_tool", allowing color customization
//1.4 login page debug & change_color_icon debug, new_email page debug. change_color_icon will now show properly,and,there wont be an extra 'setcolor' btn on that document thing...
//1.5 debug

(function () {
	"use strict";
	var body = document.getElementsByTagName("body")[0];

	var colorSet = GM_getValue("colorSet", [-1]);
	var basic_color;
	var side_color;
	var color3;
	var text_color1;
	var text_color2;
	if (colorSet[0] == -1) {
		basic_color = "black";
		side_color = "rgb(37,37,37)";
		color3 = "rgb(60,60,60)";
		text_color1 = "white";
		text_color2 = "rgb(186,186,186)";

		GM_setValue("colorSet", [
			"black",
			"rgb(37,37,37)",
			"rgb(60,60,60)",
			"white",
			"rgb(186,186,186)",
		]);
	} else {
		basic_color = colorSet[0];
		side_color = colorSet[1];
		color3 = colorSet[2];
		text_color1 = colorSet[3];
		text_color2 = colorSet[4];
	}
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
			body{background-color:${basic_color} !important;}
			.bground{background-color:${basic_color};}`;
		//top banner
		var top_banner =
			`#banner,#banner>*,#banner>*>*,#banner>*>*>*,#banner>*>*>*>*,#banner>*>*>*>*>*,#banner>*>*>*>*>*>*,#banner>*>*>*>*>*>*>*,#banner>*>*>*>*>*>*>*>*,#banner>*>*>*>*>*>*>*>*>*,#filtericon>div>div.logo-cot,#filtericon>div>div.logo-cot>div>div.up-img-info>p>*{background-color:${side_color};color:${text_color1};}` +
			`#mail,#stmail,#stmail > span{color:${text_color1} !important; background-color:${color3} !important;}` +
			`#main>*:hover,#mail:hover,#stmail:hover,#stmail>span:hover{background-color:${color3} !important;color:${text_color2} !important;}`;
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
		var btn = `.btn,.btn>*,.btn>*>*{background-color:${color3} !important;}`;
		//logout
		var logout = `body > div.zeromodal-container.alert{background-color:${basic_color};}`;
		style.innerHTML =
			style_innerHTML_ori +
			set_most_background +
			top_banner +
			course_name +
			left_side_index +
			upper_block +
			footer +
			searchpannel +
			btn +
			logout;
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
			`body>div.nav>div#myTabContent>div#course1>dl.boxdetail>div#suoxuecourse>dd.stu,body>div.nav>div#myTabContent>div#course2>dl.boxdetail>div#nextsuojiaocourse>dd.stu{border-style:solid;border-width :1px; border-color:${basic_color};}
            body>div.nav>div#myTabContent>div#course1>dl.boxdetail>div#suoxuecourse>dd.stu:hover,body>div.nav>div#myTabContent>div#course2>dl.boxdetail>div#nextsuojiaocourse>dd.stu:hover{border-style:solid;border-width :1px; border-color:${text_color2};}` + //hover
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
			`body>div.nav>div#myTabContent>div#course1>dl.boxdetail>div#suoxuecourse>* >div.fl>div.hdtitle>div.btngroup>p,#course1>dl>dt,body>div.nav>div#myTabContent>div#course2>dl.boxdetail>div#nextsuojiaocourse>* >div.fl>div.hdtitle>div.btngroup>p,#course2>dl>dt{color:${text_color1};}
	        body>div.nav>div#myTabContent>div#course1>dl.boxdetail>div#suoxuecourse>dd.stu>div.fl>div.stu>ul>*>a.uuuhhh>span.name,body>div.nav>div#myTabContent>div#course2>dl.boxdetail>div#nextsuojiaocourse>dd.stu>div.fl>div.stu>ul>*>a.uuuhhh>span.name,
			body>div.nav>div#myTabContent>div#course1>dl.boxdetail>div#suoxuecourse>dd.stu>div.fl>div.stu>ul>*>a.uuuhhh>span.stud>span.unsee,body>div.nav>div#myTabContent>div#course2>dl.boxdetail>div#nextsuojiaocourse>dd.stu>div.fl>div.stu>ul>*>a.uuuhhh>span.stud>span.unsee{color:${text_color1};}` + //text
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
	//5 Overview && some other
	else if (
		domain.indexOf(
			"https://learn.tsinghua.edu.cn/f/wlxt/kc/v_kcxx_jskcxx/student/beforeXskcxx"
		) != -1 ||
		domain.indexOf(
			"https://learn.tsinghua.edu.cn/f/wlxt/kc/v_kcxx_jskcxx/student/gkBeforeKcxx"
		) != -1
	) {
		otheR = `#content>div.course-w>div.detail>div.content-cell>div.stu_book>div.right>div{color:${text_color1} !important;}
		    #content>div.course-w>div.detail>div>div.stu_book>div.right>table>tbody>*,#content>div.course-w>div.detail>div>div.stu_book>div.right>table>tbody>*>*{color:${text_color1};}
			#content>div.course-w>div.detail>div>div>div>p,#content>div.course-w>div.detail>div>div>p,#content>div.course-w>div.detail>div>div>div>p,#content>div.course-w>div.detail>div>div>div>div>p{color:${text_color1} !important;}
			body > div.header > div,body > div.header > div>*,body > div.header > div>*>*,body > div.header > div>*>*>*>*,body > div.header > div>*>*>*,body > div.header > div > div.left > a > img,body > div.header{background-color:${color3} !important;}`;
	}
	//6 Documents
	else if (
		domain.indexOf(
			"https://learn.tsinghua.edu.cn/f/wlxt/kj/wlkc_kjxxb/student/beforePageList"
		) != -1
	) {
		otheR = `#tabbox,#tabbox>ul>li{background-color:${basic_color};}
		    #content>div.course-w>div.detail>form>div.cont>div.navli>div{background-color:${basic_color};}
			.navli .playli ul.selected li{background-color:${basic_color};}
			body > div.header > div,body > div.header > div>*,body > div.header > div>*>*,body > div.header > div>*>*>*>*,body > div.header > div>*>*>*,body > div.header > div > div.left > a > img,body > div.header{background-color:${color3} !important;}`;
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
		) != -1 ||
		domain.indexOf(
			"https://learn.tsinghua.edu.cn/f/wlxt/kczy/zy/student/viewZy"
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
			.tabbox .mytabs li >p,table.dataTable thead th, table.dataTable>tbody>tr>td>*,table.dataTable>tbody>tr>td,#content > div.fl.course-w > div.detail > div.list.lists.clearfix.louzhuu > div.right > p{color:${text_color1} !important;}
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
			.detail .lists .right > p{color:${text_color1} !important};
            #addBtn,#addBtn>*{background-color:${color3};}`;
	}
	//11 Q&A
	else if (
		domain.indexOf(
			"https://learn.tsinghua.edu.cn/f/wlxt/bbs/bbs_kcdy/student/beforePageDyList"
		) != -1
	) {
		otheR = `#tabbox,.tabbox .mytabs li.active {background-color:${basic_color};}
		    .tabbox .mytabs li,.tabbox .mytabs li >p,table.dataTable thead th, table.dataTable>tbody>tr>td>*,table.dataTable>tbody>tr>td{color:${text_color1} !important;}
		    #wtj>tbody>tr>td>a.btn,.webicon-edit:before{background-color:${color3};}
		    a.btn,i.webicon-increse{background-color:${color3} !important;}`;
	}
	//12 Email
	else if (
		domain.indexOf(
			"https://learn.tsinghua.edu.cn/f/wlxt/mail/yj_yjxxb/student/beforePageList"
		) != -1
	) {
		otheR = `#tabbox,.tabbox .mytabs li.active,.zeromodal-container  {background-color:${basic_color} !important;}
		    .tabbox .mytabs li,.tabbox .mytabs li >p,table.dataTable thead th, table.dataTable>tbody>tr>td>*,table.dataTable>tbody>tr>td{color:${text_color1} !important;}
		    #wtj>tbody>tr>td>a.btn,.webicon-send:before{background-color:${color3};}
		    a.btn,i.webicon-increse{background-color:${color3} !important;}
		    .detail .tipbox,#content>div.course-w>div.detail>div.tipbox>span{background-color:${side_color};}`;
	}
	//13 inner-Email
	else if (
		domain.indexOf(
			"https://learn.tsinghua.edu.cn/f/wlxt/mail/yj_yjxxb/student/beforeAdd"
		) != -1
	) {
		otheR =
			`.left{color:${text_color2} !important;}
			#cke_1_top,#cke_1_bottom,.cke_wysiwyg_frame, .cke_wysiwyg_div{color:${text_color2};background-color:${color3} !important;}
			#addForm > div.list.target > div.right.clearfix > div > label {color:${text_color2};}` +
			`#myTags > li > input,#bt{color:${text_color1};}`;

		setTimeout(function () {
			var frame_style = document
				.getElementById("cke_1_contents")
				.getElementsByTagName("iframe")[0]
				.contentWindow.document.getElementsByTagName("style")[0];
			var frame_style_add = `*{background-color : ${basic_color} !important; color:${text_color1} !important;}`;
			frame_style.innerHTML = frame_style.innerHTML + frame_style_add;
		}, 1000);
	}
	//14  Groups
	else if (
		domain.indexOf(
			"https://learn.tsinghua.edu.cn/f/wlxt/qz/v_wlkc_qzcyb/student/beforePageWdfzList"
		) != -1
	) {
		otheR = `#tabbox,.tabbox .mytabs li.active {background-color:${basic_color};}
		    .tabbox .mytabs li >p,table.dataTable thead th, table.dataTable>tbody>tr>td>*,table.dataTable>tbody>tr>td{color:${text_color1} !important;}
		    #wtj>tbody>tr>td>a.btn,.webicon-edit:before{background-color:${color3};}
		    a.btn,i.webicon-increse{background-color:${color3} !important;}`;
	}
	//15 Online Coures
	else if (
		domain.indexOf(
			"https://learn.tsinghua.edu.cn/f/wlxt/zxkt/wlkc_zxktb/student/beforePageList"
		) != -1
	) {
		otheR = `#tabbox,.tabbox .mytabs li {color:${text_color1};background-color:${basic_color};}
		    .tabbox .mytabs li.active{background-color:${basic_color};}
		    .tabbox .mytabs li >p,table.dataTable thead th, table.dataTable>tbody>tr>td>*,table.dataTable>tbody>tr>td{color:${text_color1} !important;}
		    .smbox,.headsm,.headsm>i {color:${text_color1} ;background-color:${color3};z-index:1}
		    .headsm{color:${text_color1} !important;z-index:10;}`;
	}
	//16 login
	else if (
		domain.indexOf("https://learn.tsinghua.edu.cn/f/login") != -1 ||
		domain.indexOf(
			"https://learn.tsinghua.edu.cn/f/wlxt/index/course/student/index"
		) != -1
	) {
		otheR =
			`.bgcolor{background-color:${basic_color};}` +
			`#loginDivId>div>div>span,#loginForm,#loginDivId{background-color:rgba(0,0,0,0.0);}` +
			`div.title,body > div.banner > div > div > div > div > span.teacher > span{color:${text_color1} !important;}` +
			`div.right>*>*>*>*,div.right>*>*>*,body > div.header > div,body > div.header > div > div.right > div > a,.header,body > div.header > div > div.right > div,body > div.header > div > div.right > div > a > span,body > div.header > div > div.left > a > img,body > div.header > div,body > div.header > div > div.left > a,body > div.header > div > div.right > div > a > span,body > div.header > div > div.right{background-color:${color3} !important;}`;
	}

	//sum up
	style.innerHTML = style.innerHTML + otheR;

	//set color
	var htmL = document.getElementsByTagName("html")[0];
	if (htmL.getAttribute("dir") != "ltr") {
		var changeColor = document.createElement("img");
		changeColor.id = "changeColor";
		changeColor.src =
			"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAJyUlEQVRoge1aW2wcVxn+/jOzu7Nz1rc4N+OkcZ04TdM09zRUJbSpmkIVpaLQIlEEQgiJFyQQlRBvXMQLD1TQZ0CCB3igApUioG0EtIU2CW1Cc5GdpEmaNI4Tx3fPzO7szpyDzjlr791eO7eX/LITz+y5fN9/PzOLu3JXbo1Q+apSyhvaJAgCLqXsA7AJwA4AawB0FT8eAnARwPsAThLRWdd1/RvZj6gE/4aJ+L6fBvAZAN8FsGeB098G8CKA1zjn2YXufVOI+L7fRkTfllL+aKEAGoD6gZTyF5zzyQXMKf1d/kGzRHzf/xKA3y0IafPyPOf8982MXjSRXC7nCCFelVI+cYtIGFBEBxljBxzHyc0zrvR3+QdzEfF9f2UxYG+ndHHOrzZDhDUDKgiCe+8ACSVDxb3nlXktksvllsVxPHybgNcVy7KWO45zvfqzpi0yNDRkA7hDJCRADGBMaXi4iKWhzEmkra3tlTiObwvsWiFINw0wG7EQGsvco8uk3LWy2ewuKeWRRVd7ZXZmmf+LmpVqO/UjBFDIAzKuhmBESohMBomT7wD5HKKte8FyWeVKD6XT6f+WtpjHtSYmJiiO48MLAq4IMwsyzSE5h0y55p4CnPWAyVGw8atgo0MgbwIy5UDyjCEyqyypfxQJa/gynJ9/A+RPAMwAVpgUtnrb1/W7dDr9VKFQoKasocYkU5DJBKgQg10fBI0OgU2OAGEAigpArH5jQMRmvGVBZjoQr90C0d0DyuaAONKkRIbDunoR6Z88C2SnEfduK26jsZDCBuCv1TDqupbnedNElGmaQJAFGzwDNngeNDEMCrPGrSwbUgWrci3tYjQ7l5SVpES0/XHEfVtA2QDScWCdO470S98EPu6H+NQXEHznVyApgHw4g9HLZDItqHKtGosEQdDDGMs0tIY02URmOCjMwxo4CutiP2hyxCjCTkBm2gyROSwqW5do/7eP/gNwWxCv6tX3ndd+CVw9Bzguogf3QtoM5GVnVa6wKYyu635Uvl5NjERR9LU5rZBIQnIXbPACEm++DPvYP7V2dUzwNtCSlZCFgnEVquvOpbWSjgn+y2eNx6nbXb3AtVHEuw8g//jzoEJUkw/qYaxxLd/3pwC01N/YuJJ98jCsU+8a1+GtJqBtG4mH94M6liH+qB/R0X+BHLfkRio+dDLIzNQGTZSmxxB198F+ZD9yYR6nD72F9d4lpPZ9BYVEAuRNm/GVMs05b22YtXzf76xLQqUS2zYkjr0N64O3IN2MISElZC4AdXZpEkqsnvsNCRUrhRCiey3ijZ+E6F6nr2etpRJAFIOtXg8B4PiRwxAdXXD2fx2R3ZCEkpYi1lmpjpGeerMgyQTiwDHY/Ycg2jq1NWZigFTKvT4IMXwZrHMl4vMnTcolhnjTI4j7Hpxdyjp7Atapd8y8yVGI+3bCvqcP/SeOIwh8PLp7N2QYKv9pRKIc62gjIuvq8kinwcZGYQ8cgXDbKkigGODKvaJ3/wYoS3mToKSjU6/sWK7sCZJaH/oaQoD8SYjezQh37gWdfg9rfvZVdP/wFSCZRMHzKjJSA1lXPDbXEiGi5XWzlcXALvUbLbcvKxFU4aQ2VMDS3BD0pzQJXclFDPv9g6C1myEz7bq4WR8eB4UB4s17kH/gIbBChMRPv4zk3i8i19OHUBb9vRhDjURhLf+o2iLJWhK2qRMjV4CZaq32yXqwejeBdfVABtOIB94zhU+RmAGSSgM5X2c22EkgykMmHJ1uVeplgYf0r7+vtZ99+Dng5CFYnd0Qy1ZpsvNIBdYKIvWsIRNJsLGrusrKRMrcC6bBVq6BvWNvaWAiiejw6yCeKGlS9VSJlF7DEHNMM6j+HR9B+rc/hnXkLyh87nuwLpwEjQzq+lHY8wzE0i5dJBtJNdaKaCKifM081eeEOUC1GjPBlw/BVqyuHLbiHp3Z6hfBYuM401elXFA+gHX8DcS7n4FY2WustWSFsdSV87P9VSOpxlpBRAhxrWaeyosqmC1VqYWBleYQFweK/ZGR+OwH5nruTGNix8nAPvxHiKWrEW3ZB5oaMVbUiSOpySDGnDFSjbU62M/W6DKOTBFTbqX6HdV6OBxiagyFN/8E9oleSG8C8cdnQGqcJmPVByEFZOtyWP3/1p1w+NS3gNCv7ALmTVb1sVYQYYxdEEJUzlAmb23XaZNdHIBMpjQgSrdAqDowPAioCmwnIfMhSPVaWc9ksYp+S7kU19q3Bv6Dwq6nddAba5RZUe2vkoRlpjQShbUCe/lFOp2eADBerUWlJdG93oAqttuaTCoNau0AKWtZFhK7n0Tisc/D3vQwpKrqslwppPsx+/hBiO4NED1bQVOjlSSMqiFbOkrk68t4EWt9IjCHl5cqixHp9Buv7kV8305zzlAnu7IxMjsN6/5dYN1rQa1LYG3YAat7nakzMKlY8nZYF47qFK3jwhutdD/1d5iFdFtM+s3XP2IrbApj9f0aIrZt/6Zmtmr48gXEW/YgWr8dNDVmAnI2zUpTBMtFpdwZN7WTuhiyoXOINn7a3FNZsExZuqjqg9RmyJZWs34DqYexhojruipOvCo1gPLmFBftegLx1kd1ElC9knY1twXRqUMQY9f0tbh0GvGl0yDVVCqDJB2wSycgVvRCLlkFyk6VBTcBUQg2fg3x2q2IN+wA5ULT09QRhU1hrLFU+cVMkQmCYJ+U8vWaZWYOTk4KbOw62If/Axu6oE+Eqh1R2UydSeTUGCiZNKk04YDGLuugFvduMx3xjO8XQlAwrYtgvG4b4o279ToU5hqmXiJ60nXdN9DsI1Pf99WOVf5S6oGkzkoAG7kGduUcaOQKaHxYu4dO1cq1VO+lgI1ehuxcBWklTeuhkoCqJ5kOHQ9izQaIpStBYQEo5GoTQElynPN0Gan5iXiet42IjjZacfbIq84dqmzkcqCJEZ2JyBs3mo5jfXDSFuDt2g56fKYdsmUJRGeXiQeVGLP+vI2ilHJ7JpM5tiAiMC72ZynlgYYrl4s6Laoaw4oPCdURNcobcOpXuZ7uu1KAbbalfGQOWk0IEb3quu7T5SObJuJ5nkVEERYjs09Pik9Q9AMrUXoktECRUtqZTKYiJy/otYLv+0sB1DxAvs2yjHM+Ur3lgl4rFBfovYMkeuuRqJaFvOhZdgeezC/nnDf0hgW/6IGxzHXLslTqO3gTAM4nB9Vec5GolsW+DH0WwB9uEYnnOOcvNzNwURYpF7URY4wT0QuLmd8A1AtqzWZJ1Mwvv1jMu5CJiQknlUp9VgixqC8MMMZeDMPw7+3t7XO+wa0nN/WbD+Xi+z4HsB7AA/N8heMUgDOc85v2FY67clduhQD4P3ZTfktmvDqeAAAAAElFTkSuQmCC";
		changeColor.onclick = function () {
			colorSet[0] = prompt(
				"set main color ( rgb(x,x,x) or name )",
				colorSet[0]
			);
			colorSet[1] = prompt(
				"set side color 1 ( rgb(x,x,x) or name )",
				colorSet[1]
			);
			colorSet[2] = prompt(
				"set side color 2 ( rgb(x,x,x) or name )",
				colorSet[2]
			);
			colorSet[3] = prompt(
				"set main text color ( rgb(x,x,x) or name )",
				colorSet[3]
			);
			colorSet[4] = prompt(
				"set side text color ( rgb(x,x,x) or name )",
				colorSet[4]
			);

			GM_setValue("colorSet", colorSet);
		};
		
		var changeColor_css = `#changeColor{width:50px;height:50px;position:fixed;bottom:0px;left:0px;z-index:10;background-color:rgba(0,0,0,0.0);}`;
		var ad = false;

		function wait_till_body() {
			var bo = document.getElementsByTagName("body");

			if (bo.length == 0) {
				setTimeout(function () {
					bo[0].appendChild(changeColor);
				}, 1000);
			} else {
				if (!ad) {
					bo[0].appendChild(changeColor);
					ad = true;
				}
			}
		}
		wait_till_body();

		style.innerHTML = style.innerHTML + changeColor_css;
	}
})();
