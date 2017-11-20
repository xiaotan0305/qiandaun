!function(win, lib) {
    "use strict";
    var $ = win.$,config=lib.channelsConfig,channelIndex=0,cIndex=0,channels = config.channels||["xf","esf","zf","jiaju","pinggu","news","bbs","ask","agent"],channel = config.currentChannel||"",
        active=!1,i=0,len = channels.length;
    0<=$.inArray(channel,["kanfangtuan","tuangou"]) && (channel = "xf");
    for(;i<len;i++){
        if(channels[i] == channel){
            cIndex = channelIndex = i,active=!0;
            break;
        }
    }
    lib.mainSite = "/",lib.askSite = "/ask/",lib.bbsSite = "/bbs/",lib.newsSite = "/news/",lib.pingguSite = "/fangjia/",lib.zfSite = "/zf/",lib.esfSite = "/esf/",lib.jiajuSite = "/jiaju/",lib.jiajuSite = "/agent/";
    /**
     * active==!1时，说明当前频道不在channels之中，
     * 这时下面的搜索框要显示下拉，显示搜索频道。
     * */
    !active && 0<=$.inArray("pinggu",channels) && (cIndex = channelIndex = 4);
    if(channelIndex>4){//调整为正确顺序
        channels.splice(channelIndex,1),channels.splice(4,0,channel);
        cIndex = 4;
    }
    lib.smartbanner = {channel:channel,cIndex:cIndex,channelIndex:channelIndex,channels:channels,active:active,cityNS:{}};
}(window, window.lib || (window.lib = {})),function(win, lib) {
    "use strict";
    var $ = win.$,ba = lib.smartbanner,channel=ba.channel,cIndex=ba.cIndex,channelIndex=ba.channelIndex,channels=ba.channels,
        nav = $("div.tabNav"),navChild = nav.children("div"),nav1 = navChild.eq(0),nav2 = navChild.eq(1),
        navList1 = nav1.children("a"),navList2 = nav2.find("a"),mapBtn,
        bar = $("div.search0620"),
        q = bar.find("input#S_searchtext"),
        channelList = {"xf":["新房",'楼盘名/地名/开发商'],"esf":["二手房",'楼盘名/地段名'],"zf":["租房",'楼盘名/地段名'],"jiaju":["家居",'搜索您小区的案例'],"pinggu":["查房价",'请输入小区名称'],"news":["资讯",'请输入关键字'],"bbs":["论坛",'楼盘名/小区名/论坛名'],"ask":["问答",'请输入您的问题'],"agent":["经济人",'经济人评价']},
        channelName = [],
        channelUrl=[],
        channelNote = [];
    $.each(channels,function(index,element){
        channelName.push(channelList[element][0]);
        channelNote.push(channelList[element][1]);
    });
    function setLink(){
        var obj={},a=[];
        navList1.add(navList2).each(function(index,element){
            var ele = $(element),key = ele.text().replace(/(^\s+)|(\s+$)/g, "");
            key && (obj[key] = ele.attr("href"));
        })
        $.each(channelName,function(index,element){
            a.push(obj[element]);
        })
        return a;
    }
    if(channelIndex>4 ||channels.length<8){
        channelUrl =setLink();
        navList1.eq(4).attr("href", channelUrl[4]).text(channelName[4]);
        channels.length<8 && (nav2.find("li").eq(2).remove(),navList2 = nav2.find("a"));
        navList2.each(function(index,element){
            var ele = $(element),idx = index+5;
            ele.attr("href", channelUrl[idx]).text(channelName[idx]);
        });
    }
    channel == "jiaju" && (lib.action == "buildList" ? (channelName[cIndex] = "建材",channelNote[cIndex] = "品牌名/产品名"):(channelName[cIndex] = "装修"));
    ba.active && navList1.eq(cIndex).removeClass().addClass("active");
    q.attr("placeholder",channelNote[cIndex]);
    if(0<=$.inArray(channel,["xf","esf"])){
        mapBtn = $('<a  id="wap'+channel+'sy_C01_15" href="'+lib.mainSite+'map/?city='+lib.city+'&a='+channel+'Map" class="mapbtn">地图</a>').appendTo(bar);
    }
    !ba.active && channelIndex===0 && !lib.searchTipUrl && (lib.searchTipUrl ="/xf.d?m=getMapByKeyWordNew&qubie=新房");
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
    var $ = win.$,ba = lib.smartbanner,nav=ba.nav,bar=ba.bar,q=ba.q,channel=ba.channel,cIndex=ba.cIndex,channels=ba.channels,channelName=ba.channelName,channelNote=ba.channelNote,
        channelType,body,t,text = channelName[cIndex],
        offBtn = bar.find("a.off"),submitBtn = bar.find("a.btn"),sPop = !1;
    q.val()!="" && offBtn.show();
    //弹出搜索浮层处理
    var sel = $('<div class="sel"><span></span></div>'),clearHisText = "清除历史记录",ssText = "搜索",closeText = "关闭",
        snav_template = '<header><div class="hLeft"><a href="javascript:;" class="back"></a></div>'
            +	'<div class="hCenter"><a href="javascript:;"><span>'+text+ssText+'</span></a></div>'
            +	'<div class="hIcon"></div></header>',
        snav = $(snav_template),
        searList = $('<div class="searList"><ul></ul></div>'),searListUl = searList.find("ul"),
        clearBtn = $('<div class="clearBtn"><a href="#">'+clearHisText+'</a></div>'),
        header = $("header#cdheader"),showItem = sel.find("span").attr("id","showSelection"),
        selection_template = '<ul class="drop"></ul>',
        itemHtml = createTypeDnHtml(),
        selection,selectItem,isFirst=!0,hisList,hisLocalStorage="hisLocal",history=!0,mainBody ;
    ba.header = header;
    !ba.active && (showItem.text(text),bar.find("div.ipt").before(sel));
    q.attr("autocomplete", "off").on("input", initInput).on("focus",function(){
        if(sPop == !1){
            if(!mainBody){
                body = $(document.body),mainBody = body.children("div").filter(function(index){
                    return t=$(this),t.is(":visible") && (!(t.hasClass("tabNav")||t.hasClass("search0620")));
                }),channel == "tools" && (mainBody = mainBody.add(body.children("article")));
            }
            nav.hide(),ba.active && (showItem.text(text),bar.find("div.ipt").before(sel)),header.hide().after(snav),sPop = !sPop;
            searListUl.empty();
            var b = $(this).val()||"";
            if(""!=b)b = b.replace(/(^\s+)|(\s+$)/g, "");
            (0 == b.length)?getHistory():getList(b);
            if(isFirst){
                addListener(),isFirst = !isFirst;
            }
            ba.mapBtn && ba.mapBtn.hide();
            mainBody&&mainBody.hide();
            //如果是bbs需要获取南北方
            channel == "bbs" && undefined === ba.cityNS[lib.city] && getNS();
        }
    });
    offBtn.on("click",function(){
        q.val(""),offBtn.hide();
        sPop == !0 && getHistory();
    });
    submitBtn.on("click",function(){
        search ();
    })
    //
    function getNS() {
        $.get(lib.bbsSite+"/?c=bbs&a=ajaxGetCityNSByName&r="+Math.random(),function(o){ba.cityNS[lib.city]=o;ba.changeNS==!0 && q.val().length>0 && getList(q.val());});
        return !0;
    }
    function initInput(a) {
        var b, a = a || window.event;
        if (b = $(this).val().replace(/(^\s+)|(\s+$)/g, ""), !b.length)
            return getHistory(),offBtn.is(":visible") && offBtn.hide(), void 0;
        if (13 != a.keyCode && 32 != a.keyCode) {
            !offBtn.is(":visible") && offBtn.show();
            return getList(b), void 0;
        }
    }
    function getList(a) {
        var type = channelType!=undefined?channelType:cIndex, site = channels[type];
        undefined === ba.keyWordTipUrls && (ba.keyWordTipUrls = {});
        if(undefined === ba.keyWordTipUrls[type]){
            if(0<=$.inArray(site,["zf"]))  site = "esf";
            else if(site == "news")  return;
            if(site == "bbs"){
                ba.keyWordTipUrls[type] = lib[site+"Site"]+"?c="+site+"&a=ajaxGetKeySearch&ns="+ba.cityNS[lib.city];
            }
            else if(site == "xf"){
                ba.keyWordTipUrls[type] = lib["mainSite"]+"xf.d?m=getMapByKeyWordNew";
            }
            else
            {
                ba.keyWordTipUrls[type] = lib[site+"Site"]+"?c="+site+"&a=ajaxGetSearchTip";
                site == "esf" && (ba.keyWordTipUrls[type]+="&orderby=esfcount");
            }
        }
        //新房，二手房，须二次 encodeURIComponent 编码
        (site == "xf") && (a = encodeURIComponent(a));
        $.get(ba.keyWordTipUrls[type],{city:lib.city,q:a},function(data) {
            if(!data)data = "[]"
            var l = eval("("+data+")"),s;
            searListUl.empty();
            if($.isArray(l) && l.length>0 && (s = pack(l)).length>1){
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
            searListUl.append(s),history = !0,clearBtn.find("a").html(clearHisText),bar.after(clearBtn),bar.after(searList);
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
        var i=0, j=0,len= a.length,b=[],_t='<li><a href="javascript:;">xx</a></li>';
        for(;i< len;i++){
            String(a[i]).length>0 && (j++,b.push(_t.replace("xx",a[i])));
            if(j>9)break;
        }
        return b.join("");
    }
    function createTypeDnHtml() {
        var i,len, b=[],_t='<li><input id="{id}" name="channelType" class="se" type="radio" value="{index}">{text}</li>',
            idP = new RegExp("{id}","g"),indexP = new RegExp("{index}","g"),textP = new RegExp("{text}","g");
        if((len = channels.length)>0){
            for(i=0;i< len;i++){
                b.push(_t.replace(idP,channels[i]).replace(indexP,i).replace(textP,channelName[i]));
            }
        }
        return b.join("");
    }
    //绑定事件
    snav.find("a.back").on("click",function(){
        if(sPop == !0){
            nav.show(),snav.detach(),ba.active && (sel.detach()),header.show(),sPop = !sPop;
            searList.detach(),clearBtn.detach();
            ba.mapBtn && ba.mapBtn.show();
            mainBody && mainBody.show();
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
                    showItem.text(channelName[channelType]),snav.find("div.hCenter>a>span").text(channelName[channelType]+ssText),selection.hide();
                    ba.changeNS=!1;
                    channelName[channelType] == "bbs" && undefined === ba.cityNS[lib.city] && (ba.changeNS=!0,getNS());
                    ba.changeNS!=!0 && q.val().length>0 && getList(q.val());
                }
            })
        }
        selection.show();
    });


    function addListener(){
        searListUl.on("click","a",function(){
            q.val($(this).text());
            setTimeout(function(){search ();},500);
        });
        clearBtn.on("click","a",function(){
            history?clearHistory():closeList();
        });
    }
    function search (){
        var type = channelType!=undefined?channelType:cIndex;
        var keyword = q.val();
        var b = keyword.replace(/(^\s+)|(\s+$)/g, "");
        if (b.length>0 && null!=lib.localStorage){
            hisList = eval(win.localStorage.getItem(hisLocalStorage) || []);
            0<=$.inArray(keyword,hisList) || hisList.unshift(keyword),hisList.length>10 && hisList.splice(10,1),win.localStorage.setItem(hisLocalStorage,"['"+hisList.join("','")+"']");
        }
        var url = "",typeIndex = channels[type];
        switch (typeIndex)
        {
            case "xf":
                url = lib.mainSite+"search.d?m=search&type=0&keyword=";
                break;
            case "esf":
                url = lib.esfSite+"?c=esf&a=index&keyword=";
                break;
            case "zf":
                url = lib.zfSite+"?c=zf&a=index&keyword=";
                break;
            case "jiaju":
                url = lib.jiajuSite+"?c=jiaju&a="+(channel == "jiaju" && lib.action == "buildList"?lib.action:"zxbj")+"&q=";
                break;
            case "news":
                url = lib.newsSite+"?c=news&a=search&q=";
                break;
            case "bbs":
                url = lib.bbsSite+"?c=bbs&a=search&q=";
                break;
            case "ask":
                url = lib.askSite+"?c=ask&a=search&keyword=";
                break;
            case "pinggu":
                url = lib.pingguSite+"?c=pinggu&a=list&keyword=";
                break;
            default :
                break;
        }
        window.location = url+(type==0?keyword:encodeURIComponent(keyword))+"&city="+lib.city+"&r="+Math.random();
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
    header.find("a.ico-fb").on("click",function(){
        window.location = "/fabuType.jsp?city="+lib.city+"&type="+ba.channel;
    });
}(window, window.lib || (window.lib = {}));