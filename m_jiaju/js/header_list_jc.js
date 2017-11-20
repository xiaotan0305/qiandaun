!function (win, lib) {
    "use strict";
    var $ = win.$, config = lib.channelsConfig, channelIndex = 0, cIndex = 0, channels = config.channels || ["xf", "esf", "zf", "jiaju", "pinggu", "news", "bbs", "ask"], channel = config.currentChannel || "",
        active = !1, i = 0, len = channels.length;
    0 <= $.inArray(channel, ["kanfangtuan", "tuangou"]) && (channel = "xf");
    for (; i < len; i++) {
        if (channels[i] == channel) {
            cIndex = channelIndex = i, active = !0;
            break;
        }
    }
    lib.mainSite = "/", lib.askSite = "/ask/", lib.bbsSite = "/bbs/", lib.newsSite = "/news/", lib.pingguSite = "/fangjia/", lib.zfSite = "/zf/", lib.esfSite = "/esf/", lib.jiajuSite = "/jiaju/";
    /**
     * active==!1时，说明当前频道不在channels之中，
     * 这时下面的搜索框要显示下拉，显示搜索频道。
     * */
    !active && 0 <= $.inArray("pinggu", channels) && (cIndex = channelIndex = 4);
    if (channelIndex > 4) {//调整为正确顺序
        channels.splice(channelIndex, 1), channels.splice(4, 0, channel);
        cIndex = 4;
    }
    lib.smartbanner = {channel: channel, cIndex: cIndex, channelIndex: channelIndex, channels: channels, active: active, cityNS: {}};
}(window, window.lib || (window.lib = {})), function (win, lib) {
    "use strict";
    var $ = win.$, ba = lib.smartbanner, channel = ba.channel, cIndex = ba.cIndex, channelIndex = ba.channelIndex, channels = ba.channels,
        nav = $("div.tabNav"), navChild = nav.children("div"), nav1 = navChild.eq(0), nav2 = navChild.eq(1),
        navList1 = nav1.children("a"), navList2 = nav2.find("a"), mapBtn,
        bar = $("div.search0620"),
        q = bar.find("input#S_searchtext"),
        channelList = {"xf": ["新房", '楼盘名/地名/开发商'], "esf": ["二手房", '楼盘名/地段名'], "zf": ["租房", '楼盘名/地段名'], "jiaju": ["家居", '楼盘/功能间/居室/风格'], "pinggu": ["查房价", '请输入小区名称'], "news": ["资讯", '请输入关键字'], "bbs": ["论坛", '楼盘名/小区名/论坛名'], "ask": ["问答", '请输入您的问题']},
        channelName = [],
        channelUrl = [],
        channelNote = [];
    $.each(channels, function (index, element) {
        channelName.push(channelList[element][0]);
        channelNote.push(channelList[element][1]);
    });
    function setLink() {
        var obj = {}, a = [];
        navList1.add(navList2).each(function (index, element) {
            var ele = $(element), key = ele.text().replace(/(^\s+)|(\s+$)/g, "");
            key && (obj[key] = ele.attr("href"));
        })
        $.each(channelName, function (index, element) {
            a.push(obj[element]);
        })
        return a;
    }

    if (channelIndex > 4 || channels.length < 8) {
        channelUrl = setLink();
        navList1.eq(4).attr("href", channelUrl[4]).text(channelName[4]);
        channels.length < 8 && (nav2.find("li").eq(2).remove(), navList2 = nav2.find("a"));
        navList2.each(function (index, element) {
            var ele = $(element), idx = index + 5;
            ele.attr("href", channelUrl[idx]).text(channelName[idx]);
        });
    }
    channel == "jiaju" && ((lib.action == "buildList" || lib.action == "jjList") ? (channelName[cIndex] = "建材", channelNote[cIndex] = "请输入建材品牌") : (channelName[cIndex] = "装修"));
    ba.active && navList1.eq(cIndex).removeClass();
    q.attr("placeholder", channelNote[cIndex]);
    if (0 <= $.inArray(channel, ["xf", "esf"])) {
        mapBtn = $('<a  id="wap' + channel + 'sy_D01_07" href="' + lib.mainSite + 'map/?city=' + lib.city + '&a=' + channel + 'Map" class="mapbtn">地图</a>').appendTo(bar);
    }
    !ba.active && channelIndex === 0 && !lib.searchTipUrl && (lib.searchTipUrl = "/xf.d?m=getMapByKeyWordNew&qubie=新房");
    $.each({nav: nav, bar: bar, q: q, channelName: channelName, channelNote: channelNote, moreBtn: navList1.eq(5), nav1: nav1, nav2: nav2, mapBtn: mapBtn}, function (key, value) {
        lib.smartbanner[key] = value;
    });
}(window, window.lib || (window.lib = {}));
!function (win, lib) {
    var c = win.localStorage;
    try {
        c && c.setItem("testPrivateModel", !1)
    } catch (d) {
        c = null
    }
    lib.localStorage = c;
}(window, window.lib || (window.lib = {})), function (win, lib) {
    "use strict";
    var $ = win.$, ba = lib.smartbanner, nav = ba.nav, bar = ba.bar, q = ba.q, channel = ba.channel, cIndex = ba.cIndex, channels = ba.channels, channelName = ba.channelName, channelNote = ba.channelNote,
        channelType, body, t, text = channelName[cIndex], ajaxReq,
        offBtn = bar.find("a.off"), submitBtn = bar.find("a.btn"), sPop = !1, specialLimit = ["xf", "esf", "zf"];
    q.val() != "" && offBtn.show();
    //弹出搜索浮层处理
    var searchEl = $('<form class="search0620 flexbox" action="" onsubmit="return false;" method="get" autocomplete="off">' +
        '<div class="searbox">' +
        '<div class="ipt" style="overflow:inherit;"><input id="S_searchtext" type="search" name="q" value="" placeholder="楼盘名/地名/开发商等" autocomplete="off">' +
        '<a href="javascript:;" class="off" style="display: none;"></a></div><a href="javascript:;" class="btn" rel="nofollow"><i></i></a></form>');
    //热词列表容器
    var hotCon = $('<div class="searLast"><h3>最近热搜</h3><div class="cont clearfix" id="hotList"></div></div>');
    //热词列表
    var hotList = hotCon.find("#hotList");
    //弹出搜索浮层处理
    var sel = $('<div class="sel"><span></span></div>'), clearHisText = "清除历史记录", ssText = "搜索", closeText = "关闭",
        snav_template = '<header><div class="left"><a href="javascript:;" class="back" id="wap' + channel + 'sy_D01_08"><i></i></a></div>'
            + '<div class="cent"><span>' + text + ssText + '</span></div>'
            + '<div class="head-icon"></div><div class="clear"></div></header>',
        snav = $(snav_template),
        searList = $('<div id="wap' + channel + 'sy_D01_10"><ul class="autoDrop bge4"></ul></div>'), searListUl = searList.find("ul"),
        clearBtn = $('<div style="padding-bottom:10px;" class="clearBtn"><a href="javascript:;">' + clearHisText + '</a></div>'),
        header = $("header#newheader"), showItem = sel.find("span").attr("id", "showSelection"),
        selection_template = '<ul class="drop"></ul>',
        selection, selectItem, isFirst = !0, hisList, hisLocalStorage = lib.city + channel + "hisLocal", history = !0, mainBody, sectionBody;
    ba.header = header;
    if ($.inArray(channel, specialLimit) != -1) {
        submitBtn = searchEl.find("a.btn");
        q = searchEl.find("#S_searchtext");
        q.attr("autocomplete", "off").on("input", initInput);
        q.on("blur", function () {
            setTimeout(createHotSearch, 200);
        });
        q.on("focus", createHistory);
        $("#new_searchtext").on("click", function (e) {
            if ($(this).html() != "楼盘名/地名/开发商等") {
                q.html($(this).html());
            }
            $(this).hide();
            hideBody();
            nav.hide(), ba.active && (showItem.text(text)), header.hide().after(snav), sPop = !sPop;
            body.children().eq(0).before(snav).before(searchEl);
            var b = $(this).val() || "";
            if ("" != b)b = b.replace(/(^\s+)|(\s+$)/g, "");
            ;
            createHotSearch();
        });
    } else {
        var itemHtml = createTypeDnHtml()
        if (!ba.active && lib.action != "buildList" && lib.action != "jjList") {
            showItem.text(text);
            bar.find("div.ipt").before(sel);
        }
        q.attr("autocomplete", "off").on("input", initInput).on("focus", function () {
            /* if(sPop == !1){
             hideBody();
             if(ba.active&&lib.action != "buildList"){
             showItem.text(text);
             bar.find("div.ipt").before(sel);
             }
             nav.hide(),header.hide().after(snav),sPop = !sPop;
             var b = $(this).val()||"";
             if(""!=b)b = b.replace(/(^\s+)|(\s+$)/g, "");
             (0 == b.length)?getHistory():getList(b);
             //如果是bbs需要获取南北方
             channel == "bbs" && undefined === ba.cityNS[lib.city] && getNS();
             }*/
            if (ba.active && lib.action != "buildList" && lib.action != "jjList") {
                showItem.text(text);
                bar.find("div.ipt").before(sel);
            }
            searListUl.empty();
            if (isFirst) {
                addListener(), isFirst = !isFirst;
            }
            var b = $(this).val() || "";
            if ("" != b)b = b.replace(/(^\s+)|(\s+$)/g, "");
            (0 == b.length) ? getHistory() : getList(b);
            channel == "bbs" && undefined === ba.cityNS[lib.city] && getNS();
        });
    }
    function hideBody() {
        if (!mainBody) {
            body = $(document.body), mainBody = body.children("div").filter(function (index) {
                return t = $(this), t.is(":visible") && (!(t.hasClass("tabNav") || t.hasClass("search0620")));
            }), channel == "tools" && (mainBody = mainBody.add(body.children("article")));
        }
        if (!sectionBody) {
            sectionBody = body.children("section");
        }
        searListUl.empty();
        if (isFirst) {
            addListener(), isFirst = !isFirst;
        }
        ba.mapBtn && ba.mapBtn.hide();
        mainBody && mainBody.hide();
        sectionBody && sectionBody.hide();
        $("footer").hide();
    }

    q.on("keyup", function (e) {
        if (e.keyCode == 13) {
            search();
        }
    });
    offBtn.on("click", function () {
        q.val(""), offBtn.hide();
        sPop == !0 && getHistory();
    });
    submitBtn.on("click", function () {
        search();
    });
    function getHotVarsType(cn) {
        switch (cn) {
            case "zf":
                return 1;
            case "esf":
                return 2;
            case "xf":
                return 3;
        }
        return 1;
    }

    //创建最近热搜
    function createHotSearch() {
        if ($.trim(q.val()) != "") return;
        //调取后台
        if ($(hotList).children().length > 0) {
            searchEl.after(hotCon);
            closeList();
            return;
        }
        if (ajaxReq)ajaxReq.abort();
        ajaxReq = $.get(lib.esfSite + '?c=esf&a=ajaxGetHotWords', {city: lib.city, type: getHotVarsType(channel)}, function (data) {
            var arr = eval("(" + data + ")");
            var b = [];
            for (var i = 0; i < arr.length; i++) {
                b.push('<a href="javascript:;"><span id="searchListName" data-ywtype="' + arr[i]["Keyword"] + ',' + getHotType(arr[i]["Type"]) + ',' + arr[i]["Purpose"] + '">' + arr[i]["Keyword"] + '</span></a>');
            }
            var el = b.join("");
            hotList.html(el);
            searchEl.after(hotCon);
            closeList();
        })
    }

    //创建历史搜索
    function createHistory() {
        if ($.trim($(this).val()) != "") return;
        hotCon.detach();
        getHistory();
    }

    function getNS() {
        $.get(lib.bbsSite + "/?c=bbs&a=ajaxGetCityNSByName&r=" + Math.random(), function (o) {
            ba.cityNS[lib.city] = o;
            ba.changeNS == !0 && q.val().length > 0 && getList(q.val());
        });
        return !0;
    }

    function initInput(a) {
        var b, a = a || window.event;
        if (b = $(this).val().replace(/(^\s+)|(\s+$)/g, ""), !b.length)
            return getHistory(), offBtn.is(":visible") && offBtn.hide(), void 0;
        if (13 != a.keyCode && 32 != a.keyCode) {
            !offBtn.is(":visible") && offBtn.show();
            if ($.inArray(channel, specialLimit) != -1) {
                return getNewList(b), void 0;
            }
            return getList(b), void 0;
        }
    }

    function getNewList(a) {
        if (ajaxReq)ajaxReq.abort();
        ajaxReq = $.get(lib.esfSite + "?c=esf&a=ajaxGetSearchTip&orderby=esfcount", {city: lib.city, q: a, type: getHotVarsType(channel)}, function (data) {
            if (!data)data = "[]";
            var l = eval("(" + data + ")"), s;
            searListUl.empty();
            if ($.isArray(l) && l.length > 0 && (s = packNew(l)).length > 1) {
                searListUl.append(s), history = !1, clearBtn.find("a").html(closeText), searchEl.after(searList), $(searList).after(clearBtn);
            } else {
                closeList();
            }
        })
    }

    function getHotType(type) {
        switch (type) {
            case "1":
                return "出租";
            case "2":
                return "出售";
            case "3":
                return "新房";
        }
        return "";
    }

    function getType(w, y) {
        if (w == "新房" || w == "二手房" || w == "租房") {
            return w;
        } else {
            if (y == "新房") {
                return "新房";
            }
        }
        return w + y;
    }

    function getPropertyType(y, p) {
        if (p == "住宅" || p == "" || y == "新房") {
            return getAreaType(y);
        }
        return p + y;
    }

    function getAreaType(str) {
        if (str == "出租") {
            str = "租房";
        } else if (str == "出售") {
            str = "二手房";
        }
        return str;
    }

    //新的拼音匹配机制显示类别列表函数
    function packNew(a) {
        var len = a.length, b = [], _t = '<li><a href="javascript:;"><span class="flor f999">约num条</span><span id="searchListName" data-ywtype="zz">xx</span></a></li>', t = '<li><a href="javascript:;"><span class="searchListName" data-ywtype="zz">xx</span><span class="f999">-yy</span></a></li>';
        for (var i = 0; i < len; i++) {
            var str = "";
            var word = "";
            var key = "";
            var purpose = "";
            if (a[i]["wordtype"] == "类型") {
                key = q.val();
                purpose = a[i]["word"];
                word = getType(a[i]["word"], a[i]["ywtype"]);
                str = _t.replace("num", a[i]["count"]);
            } else if (a[i]["wordtype"] == "楼盘") {
                word = key = a[i]["word"];
                purpose = a[i]["purpose"];
                str = t.replace("yy", getPropertyType(a[i]["ywtype"], a[i]["purpose"]));
            } else {
                word = key = a[i]["word"];
                purpose = a[i]["purpose"];
                var comarea = !a[i]["district"] || a[i]["district"] == undefined ? "" : a[i]["district"];
                str = t.replace("yy", comarea + getAreaType(a[i]["ywtype"]));
            }
            str = str.replace("xx", word);
            str = str.replace("zz", key + "," + a[i]["ywtype"] + "," + purpose);
            b.push(str);
        }
        return b.join("");
    }

    function getList(a) {
        var type = channelType != undefined ? channelType : cIndex, site = channels[type];
        undefined === ba.keyWordTipUrls && (ba.keyWordTipUrls = {});
        if (undefined === ba.keyWordTipUrls[type]) {
            if (0 <= $.inArray(site, ["zf"]))  site = "esf";
            else if (site == "news")  return;
            if (site == "bbs") {
                ba.keyWordTipUrls[type] = lib[site + "Site"] + "?c=" + site + "&a=ajaxGetKeySearch&ns=" + ba.cityNS[lib.city];
            }
            else if (site == "xf") {
                ba.keyWordTipUrls[type] = lib["mainSite"] + "xf.d?m=getMapByKeyWordNew";
            }
            else {
                ba.keyWordTipUrls[type] = lib[site + "Site"] + "?c=" + site + "&a=ajaxGetSearchTip";
                if (lib.action == "buildList" || lib.action == "jjList") {
                    ba.keyWordTipUrls[type] = lib[site + "Site"] + "?c=" + site + "&a=ajaxGetJcSearchTip";
                }
                if (site == "esf") {
                    ba.keyWordTipUrls[type] = lib[site + "Site"] + "?c=" + site + "&a=ajaxGetSearchTipOld&orderby=esfcount";
                }
            }
        }
        //新房，二手房，须二次 encodeURIComponent 编码
        (site == "xf") && (a = encodeURIComponent(a));
        $.get(ba.keyWordTipUrls[type], {city: lib.city, q: a}, function (data) {
            if (!data)data = "[]"
            var l = eval("(" + data + ")"), s;
            searListUl.empty();
            if ($.isArray(l) && l.length > 0 && (s = pack(l)).length > 1) {
                //searListUl.append(s),history = !1,clearBtn.find("a").html(closeText),bar.after(clearBtn),bar.after(searList);
                searListUl.append(s), history = !1, clearBtn.find("a").html(closeText), searListUl.append(clearBtn), bar.find("div.ipt").append(searList);
            } else {
                closeList();
            }
        })
    }

    function getHistory() {
        hisList = eval(null != lib.localStorage && win.localStorage.getItem(hisLocalStorage) || []);
        searListUl.empty();
        var s;
        // hisList = ["国美第一城","我爱我家"]
        if ($.isArray(hisList) && hisList.length > 0 && (s = packHistory(hisList)).length > 1) {
            searListUl.append(s), history = !0, clearBtn.find("a").html(clearHisText), searListUl.append(clearBtn), bar.find("div.ipt").append(searList);
        } else {
            closeList();
        }
    }

    function clearHistory() {
        null != lib.localStorage && win.localStorage.removeItem(hisLocalStorage);
        hisList = [], closeList();
    }

    function closeList() {
        searListUl.empty(), searList.add(clearBtn).detach();
    }

    function packHistory(a) {
        var i = 0, j = 0, len = a.length, b = [], _t = '<li><a style="display:block;" href="javascript:;"><span data-ywtype="zz" class="name">xx</span></a></li>';
        for (; i < len; i++) {
            if (String(a[i]).length > 0) {
                j++;
                var str = _t.replace("xx", a[i]);
                b.push(str);
            }
            if (j > 9)break;
        }
        return b.join("");
    }

    function pack(a) {
        /*var i=0, j=0,len= a.length,b=[],_t="";
         if($.inArray(channel,specialLimit)!=-1){
         _t='<li><a href="javascript:;"><span id="searchListName" data-ywtype="zz">xx</span><span class="f999">-yy</span></a></li>';
         for(;i< len;i++){
         if(String(a[i]).length>0){
         var arr=a[i];
         var str=_t.replace("xx",arr[0]);
         str=str.replace("yy",arr[1]);
         str=str.replace("zz",arr[0]+","+arr[1]);
         b.push(str);
         j++;
         }
         if(j>9)break;
         }
         return b.join("");
         }*/
        var i = 0, j = 0, len = a.length, b = [], _t = '<li><a style="display:block;" href="javascript:;"><span data-ywtype="zz" class="name">xx</span></a></li>';
        for (; i < len; i++) {
            if (String(a[i]).length > 0) {
                j++;
                var str = _t.replace("xx", a[i]["name"]);
                b.push(str);
            }
            if (j > 9)break;
        }
        return b.join("");
    }

    function createTypeDnHtml() {
        var i, len, b = [], _t = '<li><input id="{id}" name="channelType" class="se" type="radio" value="{index}">{text}</li>',
            idP = new RegExp("{id}", "g"), indexP = new RegExp("{index}", "g"), textP = new RegExp("{text}", "g");
        if ((len = channels.length) > 0) {
            for (i = 0; i < len; i++) {
                b.push(_t.replace(idP, channels[i]).replace(indexP, i).replace(textP, channelName[i]));
            }
        }
        return b.join("");
    }

    //绑定事件
    snav.find("a.back").on("click", function () {
        if (sPop == !0) {
            nav.show(), snav.detach(), ba.active && (sel.detach()), header.show(), sPop = !sPop;
            searList.detach(), clearBtn.detach();
            ba.mapBtn && ba.mapBtn.show();
            mainBody && mainBody.show();
            sectionBody && sectionBody.show();
            $("footer").show();
            if ($.inArray(channel, specialLimit) != -1) {
                searchEl.detach(), hotCon.detach();
                $("#new_searchtext").show();
            }
        }
    });
    showItem.on("click", function () {
        if (!selection) {
            selection = $(selection_template), selectItem = $(itemHtml).prependTo(selection), selectItem.find("input").eq(channelType != undefined ? channelType : cIndex).prop("checked", true);
            sel.append(selection), ba.selection = selection;
            selectItem.on("click", function () {
                var self = $(this).children("input");
                if (self.val() != channelType) {
                    selectItem.find("input").prop("checked", false),
                        channelType = self.prop("checked", true).val(), q.attr("placeholder", channelNote[channelType]);
                    showItem.text(channelName[channelType]), snav.find("div.cent>span").text(channelName[channelType] + ssText), selection.hide();
                    ba.changeNS = !1;
                    channelName[channelType] == "bbs" && undefined === ba.cityNS[lib.city] && (ba.changeNS = !0, getNS());
                    ba.changeNS != !0 && q.val().length > 0 && getList(q.val());
                }
            })
        }
        selection.show();
    });
    function addListener() {
        searListUl.add(hotCon).on("click", "a", function () {
            var th = $(this);
            if (th.parent().hasClass("clearBtn")) {
                history ? clearHistory() : closeList();
                return;
            }
            var el = th.find(".name");
            q.val(el.html());
            search();
            /*if(el.length>0){
             setTimeout(function(){searchNew(el.data("ywtype"));},500);
             }else{
             if(th.attr("id")&&th.attr("id")=="correctionBeforeWord"){
             th.parent().remove();
             correctionBefore(th.html());
             }else{
             q.val($(this).text());
             setTimeout(function(){search ();},500);
             }
             }*/
        });
    }

    function search() {
        var type = channelType != undefined ? channelType : cIndex;
        var keyword = q.val();
        var b = keyword.replace(/(^\s+)|(\s+$)/g, "");
        if (b.length > 0 && null != lib.localStorage) {
            hisList = eval(win.localStorage.getItem(hisLocalStorage) || []);
            var sIndex = $.inArray(keyword, hisList);
            if (sIndex >= 0) {
                hisList.splice(sIndex, 1);
            }
            hisList.unshift(keyword), hisList.length > 10 && hisList.splice(10, 1), win.localStorage.setItem(hisLocalStorage, "['" + hisList.join("','") + "']");
        }
        var url = "", typeIndex = channels[type];
        switch (typeIndex) {
            case "xf":
                url = lib.mainSite + "search.d?m=search&type=0&keyword=";
                break;
            case "esf":
                url = lib.esfSite + "?c=esf&a=index&keyword=";
                break;
            case "zf":
                url = lib.zfSite + "?c=zf&a=index&keyword=";
                break;
            case "jiaju":
                url = lib.jiajuSite + "?c=jiaju&a=" + (channel == "jiaju" && (lib.action == "buildList" || lib.action == "jjList") ? lib.action : "zxbj") + "&q=";
                break;
            case "news":
                url = lib.newsSite + "?c=news&a=search&q=";
                break;
            case "bbs":
                url = lib.bbsSite + "?c=bbs&a=search&q=";
                break;
            case "ask":
                url = lib.askSite + "?c=ask&a=search&keyword=";
                break;
            case "pinggu":
                url = lib.pingguSite + "?c=pinggu&a=list&keyword=";
                break;
            default :
                break;
        }
        window.location = url + (type == 0 ? keyword : encodeURIComponent(keyword)) + "&city=" + lib.city + "&r=" + Math.random();
    }

    function searchNew(y) {
        if (!y)return;
        var data = y.split(",");
        var ywtype = data[1];
        var purpose = data[2] ? data[2] : "住宅";
        var comarea = !data[3] || data[3] == undefined ? "" : data[3];
        var correction = data[4];
        q.val(data[0]);
        var keyword = data[0];
        var b = keyword.replace(/(^\s+)|(\s+$)/g, "");
        if (b.length > 0 && null != lib.localStorage) {
            hisList = eval(win.localStorage.getItem(hisLocalStorage) || []);
            var s = keyword + ":" + ywtype + ":" + purpose + ":" + comarea;
            var sIndex = $.inArray(s, hisList);
            if (sIndex >= 0) {
                hisList.splice(sIndex, 1);
            }
            hisList.unshift(s), hisList.length > 10 && hisList.splice(10, 1), win.localStorage.setItem(hisLocalStorage, "['" + hisList.join("','") + "']");
        }
        var url = "";
        switch (ywtype) {
            case "新房":
                var type = 0;
                url = lib.mainSite + "search.d?m=search&type=0&keyword=";
                break;
            case "出售":
                url = lib.esfSite + "?c=esf&a=index&keyword=";
                break;
            case "出租":
                url = lib.zfSite + "?c=zf&a=index&keyword=";
                break;
            default :
                break;
        }
        if (type != 0) {
            keyword = encodeURIComponent(keyword);
            purpose = encodeURIComponent(purpose);
        }
        url += keyword + "&city=" + lib.city + "&purpose=" + purpose;
        if (correction) {
            if (type != 0) {
                correction = encodeURIComponent(correction);
            }
            url += "&correction=" + correction;
        }
        if (comarea) {
            if (type != 0) {
                comarea = encodeURIComponent(comarea);
            }
            url += "&comarea=" + comarea;
        }
        window.location = url + "&r=" + Math.random();
    }
}(window, window.lib || (window.lib = {})), function (win, lib) {
    "use strict";
    var $ = win.$, ba = lib.smartbanner, bar = ba.bar, moreBtn = ba.moreBtn,
        header = ba.header, nav1 = ba.nav1, nav2 = ba.nav2;
    //显示/隐藏nav2
    moreBtn.on("click", function () {
        nav2.toggle();
    });
    function hnav2(e) {
        var target = $(e.target);
        nav2.is(":visible") && (!(nav1.find(target).length > 0 || nav2.find(target).length > 0)) && nav2.hide();
    }

    function hideSelection(e) {
        ba.selection && ba.selection.is(":visible") && e.target.id != "showSelection" && ba.selection.hide();
    }

    $(document).on({"click touchmove touchend": hnav2}).on("click", hideSelection);
    //end 显示/隐藏nav2

    var navFlayer, navFlayer1, navFlayer2, smsNum, userName, iconavBtn;
    !lib.navflayer && (iconavBtn = header.find("a.ico-nav").on("click", function () {
        navFlayer || (navFlayer = $("div#navShadow,div#nav"), navFlayer1 = navFlayer.eq(0).on("click", function () {
            navFlayer.hide(), iconavBtn.append(smsNum)
        }), navFlayer2 = navFlayer.eq(1), smsNum = $(this).children(".sms-num"));
        navFlayer2.is(":visible") ? (navFlayer.hide(), iconavBtn.append(smsNum)) : (navFlayer.show(), undefined === userName && $.get(lib.mainSite + "public/?c=public&a=ajaxUserInfo", function (o) {
            userName = "", o != !1 && undefined != o.username && $("div#nav div.mt10 div.nav-tit a").text(userName = o.username)
        }), smsNum.detach());
    }));
    header.find("a.icon-fb").on("click", function () {
        window.location = "/fabuType.jsp?city=" + lib.city + "&type=" + ba.channel;
    });
}(window, window.lib || (window.lib = {}))