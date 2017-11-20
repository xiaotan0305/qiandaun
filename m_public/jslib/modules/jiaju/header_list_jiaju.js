!function(win, lib) {
    "use strict";
    var $ = win.$,config=lib.channelsConfig,channelIndex=0,cIndex=0,channels = config.channels||["mt","wd","sjs","gd"],channel = config.currentChannel||"",
        active=!1,i=0,len = channels.length;
    var specialChannel=channel;
    for(;i<len;i++){
        if(channels[i] == channel){
            cIndex = channelIndex = i,active=!0;
            break;
        }
    }
    lib.mainSite = "/",lib.askSite = "/ask/", lib.jiajuSite = "/jiaju/";
    lib.smartbanner = {channel:channel,cIndex:cIndex,specialChannel:specialChannel,channelIndex:channelIndex,channels:channels,active:active,cityNS:{}};
}(window, window.lib || (window.lib = {})),function(win, lib) {
    "use strict";
    var $ = win.$,ba = lib.smartbanner,channel=ba.channel,cIndex=ba.cIndex,channelIndex=ba.channelIndex,channels=ba.channels,
        nav = $("div.tabNav"),navChild = nav.children("div"),nav1 = navChild.eq(0),nav2 = navChild.eq(1),
        navList1 = nav1.children("a"),navList2 = nav2.find("a"),mapBtn,
        bar = $(".search0620"),
        q = bar.find("input#S_searchtext"),
        channelList = {"mt":["美图",'风格/户型/空间等'],"wd":["问答",'问题名称'],"sjs":["设计师",'设计师/公司/门店等'],"gd":["工地",'楼盘/居室等']},
        channelName = [],
        channelUrl=[],
        channelNote = [];
    $.each(channels,function(index,element){
        if(channelList.hasOwnProperty(element)){
            channelName.push(channelList[element][0]);
            channelNote.push(channelList[element][1]);
        }
    });
    function setLink(){
        var obj={},a=[];
        navList1.add(navList2).each(function(index,element){
            var ele = $(element),key = ele.text().replace(/(^\s+)|(\s+$)/g, "");
            key && (obj[key] = ele.attr("href"));
        });
        $.each(channelName,function(index,element){
            a.push(obj[element]);
        });
        return a;
    }
    ba.active && navList1.eq(cIndex).removeClass();
   // q.attr("placeholder",channelNote[cIndex]);

    $.each({nav:nav,bar:bar,q:q,channelName:channelName,channelNote:channelNote,moreBtn:navList1.eq(5),nav1:nav1,nav2:nav2,mapBtn:mapBtn},function(key,value){
        lib.smartbanner[key] = value;
    });
}(window, window.lib || (window.lib = {}));
!function(win, lib) {
    var c = win.localStorage;
    try {
        c && c.setItem("testPrivateModel", !1)
    } catch (d) {
        c = null
    }
    lib.localStorage = c;
}(window, window.lib || (window.lib = {})),function(win, lib) {
    "use strict";
    var $ = win.$,ba = lib.smartbanner,specialChannel=ba.specialChannel,nav=ba.nav,bar=ba.bar,q=ba.q,channel=ba.channel,cIndex=ba.cIndex,channels=ba.channels,channelName=ba.channelName,channelNote=ba.channelNote,
        channelType,body,t,text = channelName[cIndex],ajaxReq,
        offBtn = bar.find("a.off"),submitBtn = bar.find("a.btn"),sPop = !1;
    q.val()!="" && offBtn.show();
    var actionchannel ='';
	//刚初始化界面时候就将此处设置好
    var firstq = $('#input');
    firstq.text("");
    firstq.append("<i></i>请输入您感兴趣的内容");

    //弹出搜索浮层处理
    var searchEl=$('<form class="search0620 flexbox" action="" onsubmit="return false;" method="get" autocomplete="off">' +
        '<div class="searbox">' +
        '<div class="ipt" id="wapjiajusy_D01_15"><input id="S_searchtext" type="search" name="q" value="" placeholder="'+("请输入您感兴趣的内容")+'" autocomplete="off">' +
        '<a href="javascript:;" class="off" style="display: none;"></a></div><a href="javascript:;" id="wapjiajusy_D01_20" class="btn" rel="nofollow"><i></i></a></form>');

    //弹出搜索浮层处理
    var sel = $('<div class="sel" ><span></span></div>'),clearHisText = "清除历史记录",ssText = "搜索",closeText = "关闭";
    //添加小米黄页操作
    var miuid = win.navigator.userAgent;
    var snav_template = '<header class="header" style="display:'+((/MiuiYellowPage/i.test(miuid))?'none':'block')+'"><div class="left" ><a href="javascript:;" class="back" id="wapjiajusy_D01_16"><i></i></a></div>'
            +    '<div class="cent"><span>'+text+ssText+'</span></div>',
        snav = $(snav_template);
    var searList = $('<div class="searList" id="wapjiajusy_D01_13"><ul></ul></div>');
    var searListUl = searList.find("ul"),
        clearBtn = $('<div class="clearBtn" id="wapjiajusy_D01_14"><a href="javascript:;">'+clearHisText+'</a></div>'),
        header = ($("header#newheader").length>0)?$("header#newheader"):$("header#topshow"),showItem = sel.find("span").attr("id","showSelection"),
        selection_template = '<ul class="drop" id="wapjiajusy_D01_17"></ul>',
        selection,selectItem,isFirst=!0,hisList,hisLocalStorage=lib.city+specialChannel+"hisLocal",history=!0,mainBody,sectionBody ;
    ba.header = header;
    function getStorage() {
        return eval(null!=lib.localStorage&&win.localStorage.getItem(hisLocalStorage) || []);
    }

    var itemHtml = createTypeDnHtml();
    !ba.active && (showItem.text(text),bar.find("div.ipt").before(sel));
    firstq.on("click",function(){
        if(sPop == !1){
            hideBody();
            nav.hide();
            $('#firstSearch').hide();
            $('#secondSearch').show();
			//点击搜索框默认永远都是装修灵感
			if(selectItem){
                channelType = 0;
                selectItem.find("input").prop("checked",false);
                selectItem.find("input#mt").prop("checked",true);
                q.attr("placeholder",channelNote[0]);
                showItem.text(channelName[0]);
                snav.find("div.cent>span").text(channelName[0]+ssText);
                text = channelName[0];
            }
			
            ba.active && (showItem.text(text),bar.find("div.ipt").before(sel));
            if(specialChannel=="mt" && lib.action =="index"){
                $("div.ipt").css("overflow","hidden");
            }
            header.hide().after(snav),sPop = !sPop;
            var b = $(this).val()||"";
            if(""!=b)b = b.replace(/(^\s+)|(\s+$)/g, "");
            (0 == b.length)?getHistory():getList(b);
        }
    });
    //弹出css样式隐藏及修改显示
    function hideBody(){
        if(!mainBody){
            body = $(document.body);
            mainBody = body.children("div").filter(function(index){
                return t=$(this),t.is(":visible") && (!(t.hasClass("tabNav")||t.hasClass("search0620")));
            }),channel == "tools" && (mainBody = mainBody.add(body.children("article")));
        }
        if(!sectionBody){
            sectionBody= body.children("section");
        }
        searListUl.empty();
        if(isFirst){
            addListener(),isFirst = !isFirst;
        }
        q.attr("placeholder",channelNote[cIndex]);
        ba.mapBtn && ba.mapBtn.hide();
        mainBody&&mainBody.hide();
        sectionBody&&sectionBody.hide();
        $("footer").hide();
    }
    q.on("keyup",function(e){
        if(e.keyCode==13){
            search ();
        }
    });
    offBtn.on("click",function(){
        q.val(""),offBtn.hide();
        sPop == !0 && getHistory();
    });
    submitBtn.on("click",function(){
        search ();
    });

    //创建历史搜索
    function createHistory(){
        if ($.trim($(this).val())!="") return;
        getHistory();
    }

    function initInput(a) {
        var b, a = a || window.event;
        if (b = $(this).val().replace(/(^\s+)|(\s+$)/g, ""), !b.length) {
               return getHistory(),offBtn.is(":visible") && offBtn.hide(), void 0;
        }
        if (13 != a.keyCode && 32 != a.keyCode) {
            !offBtn.is(":visible") && offBtn.show();
            return (channel =='ask') && getList(b), void 0;
        }
    }

   function getList(a) {
        var type = channelType!=undefined?channelType:cIndex, site = channels[type];
        undefined === ba.keyWordTipUrls && (ba.keyWordTipUrls = {});
        if(undefined === ba.keyWordTipUrls[type]){
            ba.keyWordTipUrls[type] = lib[site+"Site"]+"?c="+site+"&a=ajaxGetSearchTip";
        }
        $.get(ba.keyWordTipUrls[type],{city:lib.city,q:a},function(data) {
            if(!data)data = "[]"
            var l = eval("("+data+")");
            var s;
            searListUl.empty();
            s = pack(l);
            if($.isArray(l) && l.length>0 && s.length>1){
                searListUl.append(s),history = !1,clearBtn.find("a").html(closeText),bar.after(clearBtn),bar.after(searList);
            }else{
                closeList();
            }
        })
    }

    function getHistory() {
        hisList = eval(null!=lib.localStorage&&win.localStorage.getItem(hisLocalStorage) || []);
        searListUl.empty();
        
        var s;
        // hisList = ["国美第一城","我爱我家"]
        if($.isArray(hisList) && hisList.length>0 && (s = pack(hisList)).length>1){
            searListUl.append(s),history = !0,clearBtn.find("a").html(clearHisText),$('#searchall').after(clearBtn),$('#searchall').after(searList);
        }else{
            closeList();
        }
    }
    function clearHistory() {
        null!=lib.localStorage && win.localStorage.removeItem(hisLocalStorage);
        hisList = [],closeList();
    }
    function closeList() {
        searListUl.empty(),searList.add(clearBtn).detach();
    }
    function pack(a) {
        var i=0, j=0,len= a.length,b=[],_t="";
        if(specialChannel =='mt' || specialChannel =='wd' || specialChannel =='sjs' || specialChannel =='gd'){
            _t='<li class="pdX5"><a  href="javascript:;"><span class="flor f999">yy</span>xx</a></li>';
            var arra=new Array();
            for(;i<len;i++){
                arra[i]=a[i].split(",");//arra=[array('问答测试','2'),array('问答测试','2')....]
                if(arra[i][0]!=""){
                    var str=_t.replace('xx',arra[i][0]);
                    var yy=channels[arra[i][1]];
                    var channelList = {"mt":["美图",'风格/户型/空间等'],"wd":["问答",'问题名称'],"sjs":["设计师",'设计师/公司/门店'],"gd":["工地",'楼盘/居室']};
                    str=str.replace('yy',channelList[yy][0]);
                    b.push(str);
                    j++;
                    if(j>9){
                        break;
                    }
                }
                
            }
            return b.join("");
        }
    }
    function createTypeDnHtml() {
        var idarr= new Array('19','18','11','12');
        var click="19";
        var i,len, b=[],_t='<li id="wapjiajusy_D01_'+click+'"><input id="{id}" name="channelType" class="se" type="radio" value="{index}">{text}</li>',
            idP = new RegExp("{id}","g"),indexP = new RegExp("{index}","g"),textP = new RegExp("{text}","g");
        if((len = channels.length)>0){
            for(i=0;i< len;i++){
                b.push(_t.replace(idP,channels[i]).replace(indexP,i).replace(textP,channelName[i]).replace(click,idarr[i]));
            }
        }
        return b.join("");
    }
    //绑定事件
    snav.find("a.back").on("click",function(){
        if(sPop == !0){
            nav.show(),snav.detach(),ba.active && (sel.detach()),header.show(),sPop = !sPop;
            searList.detach(),clearBtn.detach();
            firstq.text("");
            firstq.append("<i></i>请输入您感兴趣的内容");
            $('#firstSearch').show();
            $('#secondSearch').hide();
            channelType=0;
            ba.mapBtn && ba.mapBtn.show();
            mainBody && mainBody.show();
            sectionBody&&sectionBody.show();
            $("footer").show();
        }
    });
    showItem.on("click",function(){
        if(!selection){
            selection = $(selection_template),selectItem = $(itemHtml).prependTo(selection),selectItem.find("input").eq(channelType!=undefined?channelType:cIndex).prop("checked",true);
            sel.append(selection),ba.selection = selection;
            selectItem.on("click",function(){
                var self = $(this).children("input");
                if( self.val() != channelType){
                    selectItem.find("input").prop("checked",false),
                        channelType = self.prop("checked",true).val(),q.attr("placeholder",channelNote[channelType]);
                    showItem.text(channelName[channelType]),snav.find("div.cent>span").text(channelName[channelType]+ssText),selection.hide();
					//text = channelName[channelType];
                }
            })
        }
        selection.show();
    });
    function addListener(){
        searListUl.on("click","a",function(){
            var th=$(this)
            var el=th.find(".searchListName");
            var index = $(this).find('span').text();
            if(index == '美图'){
                channelType = 0;
            }else if (index='问答'){
                channelType = 1;
            }else if (index == '设计师') {
                channelType = 2;
            }else if (index == '工地') {
                channelType = 3;
            }

            if(!selection){
                selection = $(selection_template),selectItem = $(itemHtml).prependTo(selection),selectItem.find("input").eq(channelType!=undefined?channelType:cIndex).prop("checked",true);
                sel.append(selection),ba.selection = selection;
                var self = $(this).children("input");
                if( self.val() != channelType){
                    selectItem.find("input").prop("checked",false),
                        q.attr("placeholder",channelNote[channelType]);
                    showItem.text(channelName[channelType]),snav.find("div.cent>span").text(channelName[channelType]+ssText),selection.hide();
                }
            }
            q.val($(this).text().substring($(this).find('span').text().length));
            if(th.attr("data-url")){
                setTimeout(function(){search (th.attr("data-url"));},500);
            } else {
                setTimeout(function(){search ();},500);
            }
        });
        clearBtn.on("click","a",function(){
            history?clearHistory():closeList();
        });
    }
    function stripscript(s) {
        return s.replace(/[\<\>\(\)\;\{\}\"\'\[\]\/\@\!\,]/g,'');
    }
    function search (url) {
        var type = channelType != undefined ? channelType : cIndex;
        var keyword = stripscript(q.val());
        var keyword1 = stripscript(q.val()) + "," + type;
        var b = keyword1.replace(/(^\s+)|(\s+$)/g, "");
        // var b = keyword.replace(/(^\s+)|(\s+$)/g, "");
        b = b.replace(/([^,]*):([^,]*)$/g, '$1-$2');
        if (b.length > 0 && null != lib.localStorage) {
            hisList = eval(win.localStorage.getItem(hisLocalStorage) || []);
            var sIndex = $.inArray(b, hisList);
            if (sIndex >= 0) {
                hisList.splice(sIndex, 1);
            }
            var tmpLength = 10;
            hisList.unshift(b), hisList.length > tmpLength && hisList.splice(tmpLength, 1), win.localStorage.setItem(hisLocalStorage, "['" + hisList.join("','") + "']");
        }

        if (url) {
            window.location = url;
            return;
        }
        var url = "", typeIndex = channels[type];
        switch (typeIndex) {
            case "mt":
                url = lib.jiajuSite + "?c=jiaju&a=lglist&q=";
                break;
            case "wd":
                url = lib.askSite+"?c=ask&a=search&keyword=";
                break;
            case "sjs":
                url = lib.jiajuSite +lib.city+ "/des.html?q=";
                break;
            case "gd":
                url = lib.jiajuSite + lib.city+"/cggd.html?q=";
                break;
            default :
                break;
        }

        var str = window.location.href;
        if(typeIndex == "sjs"){
            window.location = url + (type == 0 ? keyword : encodeURIComponent(keyword)) + "&r=" + Math.random();
        }else if(typeIndex == "mt"){
            window.location = url + encodeURIComponent(stripscript($("#S_searchtext").val())) + "&city=" + lib.city + "&r=" + Math.random();
        }else{
            window.location = url + (type == 0 ? keyword : encodeURIComponent(keyword)) + "&city=" + lib.city + "&r=" + Math.random();
        
        }
    }

}(window, window.lib || (window.lib = {})),function(win, lib) {
    "use strict";
    var $ = win.$,ba = lib.smartbanner,bar=ba.bar,moreBtn=ba.moreBtn,
        header=ba.header,nav1=ba.nav1,nav2=ba.nav2;
    //显示/隐藏nav2
    moreBtn.on("click",function(){
        nav2.toggle();
    });
    function hnav2 (e){
        var target = $(e.target);
        nav2.is(":visible") && (!(nav1.find(target).length>0||nav2.find(target).length>0)) && nav2.hide();
    }
    function hideSelection(e){
        ba.selection && ba.selection.is(":visible") && e.target.id != "showSelection" && ba.selection.hide();
    }
    $(document).on({"click touchmove touchend":hnav2}).on("click",hideSelection);
    //end 显示/隐藏nav2

    var navFlayer,navFlayer1,navFlayer2,smsNum,userName,iconavBtn;
    !lib.navflayer && (iconavBtn = header.find("a.ico-nav").on("click",function(){
        navFlayer || (navFlayer = $("div#navShadow,div#nav"),navFlayer1= navFlayer.eq(0).on("click",function(){navFlayer.hide(),iconavBtn.append(smsNum)}),navFlayer2= navFlayer.eq(1),smsNum = $(this).children(".sms-num"));
        navFlayer2.is(":visible")?(navFlayer.hide(),iconavBtn.append(smsNum)):(navFlayer.show(),undefined===userName&&$.get(lib.mainSite+"public/?c=public&a=ajaxUserInfo",function(o){userName="",o!= !1 && undefined!=o.username && $("div#nav div.mt10 div.nav-tit a").text(userName=o.username)}),smsNum.detach());
    }));

}(window, window.lib || (window.lib = {}));