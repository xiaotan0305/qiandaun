!function (win, lib) {
    "use strict";
    var $ = win.$, config = lib.channelsConfig, channelIndex = 0, cIndex = 0, channels = config.channels || ["xf", "esf", "zf", "jiaju", "pinggu", "news", "bbs", "ask"], channel = config.currentChannel || "",
        active = !1, i = 0, len = channels.length;
    for (; i < len; i++) {
        if (channels[i] == channel) {
            cIndex = channelIndex = i, active = !0;
            break;
        }
    }
    active == !1 && 0 <= $.inArray("pinggu", channels) && (cIndex = channelIndex = 4);
    if (channelIndex > 4) {
        channels.splice(channelIndex, 1), channels.splice(4, 0, channel);
        cIndex = 4;
    }
    lib.smartbanner = {
        channel: channel,
        cIndex: cIndex,
        channelIndex: channelIndex,
        channels: channels,
        active: active,
        cityNS: {}
    };
}(window, window.lib || (window.lib = {})), function (win, lib) {
    "use strict";
    var $ = win.$, ba = lib.smartbanner, channel = ba.channel, cIndex = ba.cIndex, channelIndex = ba.channelIndex, channels = ba.channels,
        nav = $("div.tabNav"), navChild = nav.children("div"), nav1 = navChild.eq(0), nav2 = navChild.eq(1),
        navList1 = nav1.children("a"), navList2 = nav2.find("a"),
        bar = $("div.homeSearch"),
        q = $("#new_searchtext"),
        channelList = {
            "xf": ["新房", '楼盘名/地名/开发商'],
            "esf": ["二手房", '楼盘名/地段名'],
            "zf": ["租房", '楼盘名/地段名'],
            "jiaju": ["家居", '搜索您小区的案例'],
            "pinggu": ["查房价", '请输入小区名称'],
            "news": ["资讯", '请输入关键字'],
            "bbs": ["论坛", '楼盘名/小区名/论坛名'],
            "ask": ["问答", '请输入您的问题']
        },
        channelName = [],
        channelUrl = [],
        channelNote = [];

    $.each(channels, function (index, element) {
        channelName.push(channelList[element][0]);
        channelNote.push(channelList[element][1]);
    })
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

    if (channels.length < 8) {
        channelUrl = setLink();
        navList1.eq(4).attr("href", channelUrl[4]).text(channelName[4]);
        channels.length < 8 && (nav2.find("li").eq(2).remove(), navList2 = nav2.find("a"));
        navList2.each(function (index, element) {
            var ele = $(element), idx = index + 5;
            ele.attr("href", channelUrl[idx]).text(channelName[idx]);
        });
    }
    nav2.children("ul").append('<li><a id="wapbbssy_C01_14" href="http://m.fangtx.com/">天下贷</a></li>');
    $.each({
        nav: nav,
        bar: bar,
        q: q,
        channelName: channelName,
        channelNote: channelNote,
        moreBtn: navList1.eq(5),
        nav1: nav1,
        nav2: nav2
    }, function (key, value) {
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
        channelType, t, text = channelName[cIndex], ajaxReq;
    /*弹出搜索浮层处理*/
    var searchEl = $('<form class="search0620_new flexbox" name="wapSearchForm" action="" onsubmit="return false;" method="get" autocomplete="off">' +
        '<div class="searbox_new">' +
        '<div class="ipt" id="wapdsy_D01_09"><input id="S_searchtext" type="search" name="q" value="" placeholder="楼盘名/地名/开发商等" autocomplete="off">' +
        '<a href="javascript:;" class="off" style="display: none;"></a></div><a href="javascript:;" id="wapdsy_D01_18" class="btn" rel="nofollow"><i></i></a></form>');
    //热词列表容器
    var hotCon = $('<div class="searLast" id="wapdsy_D01_19"><div class="cont clearfix" id="hotList"></div></div>');
    //热词列表
    var hotList = hotCon.find("#hotList");
    //关闭按钮及搜索按钮
    //添加小米黄页操作
    var miuid = win.navigator.userAgent;
    var offBtn = searchEl.find("a.off"), submitBtn = searchEl.find("a.btn"), sPop = !1;
    var clearHisText = "清除历史记录", ssText = "搜索", closeText = "关闭";
    var snav_template = '<header style="display:' + ((/MiuiYellowPage/i.test(miuid)) ? 'none' : 'block') + '"><div class="left" id="wapdsy_D01_08"><a href="javascript:;" class="back"><i></i></a></div>'
        + '<div class="cent"><span>房源搜索</span></div>'
        + '<div class="head-icon"></div></header>';
    var snav = $(snav_template);
    // searList = $('<div class="searList" id="wapdsy_D01_08"><ul></ul></div>')
    var searList = $('<div class="searHistory"><div style="margin-bottom: 50px;"><div class="searList" id="wapdsy_D01_08"><ul></ul></div></div></div>'),
        searListh3 = $('<h3><span class="s-icon-his"></span>搜索历史</h3>'),
        searListUl = searList.find("ul"),
        clearBtn = $('<div class="clearBtn2" id="wapdsy_D01_09"><a href="javascript:;">' + clearHisText + '</a></div>'),
        header = $("header#header"),
        selection_template = '<ul class="drop"></ul>',
//        itemHtml = createTypeDnHtml(),
        selection, selectItem, isFirst = !0, hisList, hisLocalStorage = lib.city + ba.channel + "hisLocal", history = !0, mainBody, firstClick = true;
    ba.header = header;
    function getStorage() {
        return eval(null != lib.localStorage && win.localStorage.getItem(hisLocalStorage) || []);
    }

    var searchInput = searchEl.find("#S_searchtext");
    searchInput.attr("autocomplete", "off").on("input", initInput);
    searchInput.on("focus", function () {
        //if (getStorage().length > 0) {
        //    searcListCon();
        //} else {
        setTimeout(createHotSearch, 200);
        //}
    }).on("blur", function () {
        setTimeout(createHotSearch, 200);
    });
    q.html("楼盘名/地名/开发商等");
    searchInput.on("keyup", function (e) {
        if (e.keyCode == 13) {
            searchErrorCorrection();
        }
    });
    q.on("click", function (e) {
        firstClick = true;
        if (sPop == !1) {
            nav.hide(), header.hide(), sPop = !sPop;
            $(document.body).children().eq(0).before(snav).before(searchEl);
            //$(document.body).append(snav).append(searchEl);
            searListUl.empty();
            if (isFirst) {
                addListener(), isFirst = !isFirst;
            }
            $(document.body).find("br").hide();
            $(document.body).find("h2").hide();
            $(".floatApp").hide();
            $("footer").hide();
            $(".main").children("div").hide();
            $(".main").children("section").hide();
            $("#header").hide();
            $("#footmark").hide();
            $(".homeSearch").hide();
            $(".bigNav").hide();
            $("#headerCon").show();
            createHotSearch();
            //searchInput.focus();
            /*if(getStorage().length>0){
             createHistory();
             } else {
             setTimeout(createHotSearch,200);
             }*/

//            mainBody&&mainBody.hide();
            //如果是bbs需要获取南北方
            //channel == "bbs" && undefined === ba.cityNS[lib.city] && getNS();
        }
    });
    //点击列表关闭按钮
    offBtn.on("click", function () {
        searchInput.val(""), offBtn.hide();
        createHotSearch();
        //sPop == !0 && getHistory();
    });
    //点击搜索按钮
    submitBtn.on("mousedown", function (e) {
        searchErrorCorrection();
        searchInput.off("blur");
    })
    //创建最近热搜
    function createHotSearch() {
        var type = getStorage().length > 0 ? 'sy' : "";
        //if ($.trim(searchInput.val())!="") return;//统计搜索uv注释掉 2015.4.3
        //调取后台
        ajaxReq = $.get(lib.esfSite + '?c=esf&a=ajaxGetHotWords', function () {
        });
        if ($(hotList).children().length > 0) {
            if (getStorage().length > 0) {
                var tempCon = hotList.find('a');
                hotList.empty().end();
                hotList.append("<div id='scroller'></div>")
                hotList.find("#scroller").append(tempCon);
                searchEl.after(hotCon);
                getHistory();
                onScrollAction();
            } else {
                var tempCon = hotList.find('a');
                hotList.empty().end();
                hotList.append(tempCon);
                searchEl.after(hotCon);
                closeList();
            }
            /*if (typeof type == 'undefined' && hotList.find("#scroller").length > 0) {
             var tempCon = hotList.find('a');
             hotList.empty().end();
             hotList.append(tempCon);
             } else if (type == 'sy' && hotList.find("#scroller").length == 0) {

             var tempCon = hotList.find('a');
             hotList.empty().end();
             hotList.append("<div id='scroller'></div>")
             hotList.find("#scroller").append(tempCon);
             onScrollAction();
             }
             searchEl.after(hotCon);
             if (getStorage().length > 0) {
             getHistory();
             }else{
             closeList();
             }*/
            return;
        }

        _ub.city = lib.zhcity;//如:北京，上海等中文。
        _ub.request("mp3", true); //参数固定，此方法获取各业务分值。
        _ub.onload = function () {  //request方法返回的结果
            //热搜词权重获取;
            var xfRate = _ub.values.mp3.N;//新房
            var esfRate = _ub.values.mp3.E;//二手房
            var zfRate = _ub.values.mp3.Z;//租房
            if (ajaxReq)ajaxReq.abort();
            ajaxReq = $.get(lib.esfSite + '?c=esf&a=ajaxGetHotWords', {
                city: lib.city,
                xfRate: xfRate,
                esfRate: esfRate,
                zfRate: zfRate
            }, function (data) {
                var arr = data;
                var b = [];
                if (type == 'sy') {
                    b.push('<div id="scroller">');
                }
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i] && arr[i]['ad']) {
                        b.push('<a href="javascript:;" id="wapxfsy_D01_32"><span class="searchListName" data-ywtype="' + arr[i]["Keyword"] + ',' + getHotType(arr[i]["Type"]) + ',' + arr[i]["Purpose"] + ',,,,,' + arr[i]['linkUrl'] + '">' + arr[i]["Keyword"] + '</span><i></i></a>');
                    } else {
                        b.push('<a href="javascript:;"><span class="searchListName" data-ywtype="' + arr[i]["Keyword"] + ',' + getHotType(arr[i]["Type"]) + ',' + arr[i]["Purpose"] + ',,,,">' + arr[i]["Keyword"] + '</span></a>');
                    }
                }
                if (type == 'sy') {
                    b.push("</div>");
                } else {
                    closeList();
                }
                var el = b.join("");
                hotList.html(el);
                searchEl.after(hotCon);
                if (type == 'sy') {
                    getHistory();
                    onScrollAction();
                } else {
                    closeList();
                }
            });
        }
    }

    /**
     * 首页搜索在有搜索历史时改变样式
     * @return {[type]} [description]
     */
    function searcListCon() {
        createHotSearch('sy');
        //getHistory();
        // onScrollAction();
    }

    function onScrollAction() {
        var l = 0, leng = 0, nowL = 0, paddingleft = 1;
        var aArr = $("#scroller a");
        var $window = $(window);
        aArr.each(function (index) {
            var $this = $(this);
            leng += $this.outerWidth(true);
        });
        leng += parseInt(aArr.length) * paddingleft;
        if (leng > $window.width()) {
            for (var i = 0; i < l; i++) {
                nowL += aArr.eq(i).width() + 26;
            }
            if (nowL > (leng - $(window).width())) {
                nowL = leng - $(window).width();
            }

            $("#scroller").width(leng);
            var myscroll = new iScroll("hotList", {hScroll: true, fixedScrollbar: true, hScrollbar: false});
            myscroll.scrollTo(-nowL, 0);
        }
    }

    //创建历史搜索
    function createHistory() {
        if ($.trim($(this).val()) != "") return;
        hotCon.detach();
        getHistory();
    }

    function initInput(a) {
        var b, a = a || window.event;
        if (b = $(this).val().replace(/(^\s+)|(\s+$)/g, ""), !b.length)
            return offBtn.is(":visible") && offBtn.hide(), void 0;
        if (13 != a.keyCode && 32 != a.keyCode) {
            !offBtn.is(":visible") && offBtn.show();
            return getList(b), hotCon.detach(), void 0;
        }
    }

    function getList(a) {
        if (ajaxReq)ajaxReq.abort();
        ajaxReq = $.get(lib.esfSite + "?c=esf&a=ajaxGetSearchTip&orderby=esfcount", {
            city: lib.city,
            q: a
        }, function (data) {
            if (!data)data = "[]";
            var l = eval("(" + data + ")"), s;
            searListUl.empty();
            if ($.isArray(l) && l.length > 0 && (s = packNew(l)).length > 1) {
                searList.find('h3').detach(), searListUl.append(s), history = !1;
                clearBtn.find("a").html(closeText), searchEl.after(searList), $(searList).find('.searList').after(clearBtn);
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
        }
//        else{
//            if(y=="新房"&&w=="新房"){
//                return "新房";
//            }
//        }
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
        var len = a.length, b = [], _t = '<li><a href="javascript:;"><span class="flor f999">约num条</span><span class="searchListName" data-ywtype="zz">xx</span></a></li>', t = '<li><a href="javascript:;"><span class="flor f999">约num条</span><span class="searchListName" data-ywtype="zz">xx</span><span class="f999">-yy</span></a></li>';
        for (var i = 0; i < len; i++) {
            //显示html，显示的前文本，关键字，类别,区域,商圈
            var str = "", showWord = "", key = "", purpose = "", district = "", comarea = "", tags = "", enterprise = "";
            if (a[i]["wordtype"] == "类型") {
                showWord = getType(a[i]["word"], a[i]["ywtype"]);
                key = a[i]["word"] != "ALL" ? a[i]["word"] : a[i]["ywtype"];
                purpose = a[i]["word"];
                str = _t;
            } else if (a[i]["wordtype"] == "楼盘") {
                showWord = key = a[i]["word"];
                purpose = a[i]["purpose"];
                str = t.replace("yy", getPropertyType(a[i]["ywtype"], a[i]["purpose"]));
            } else if (a[i]["wordtype"] == "商圈") {
                showWord = key = comarea = a[i]["word"];
                purpose = a[i]["purpose"];
                district = !a[i]["district"] || a[i]["district"] == undefined ? "" : a[i]["district"];
                str = t.replace("yy", comarea + getAreaType(a[i]["ywtype"]));
            } else if (a[i]["wordtype"] == "标签") {
                showWord = key = tags = a[i]["word"];
                purpose = a[i]["purpose"];
                str = t.replace("yy", getAreaType(a[i]["ywtype"]));
            } else if (a[i]["wordtype"] == "品牌") {
                showWord = key = enterprise = a[i]["word"];
                purpose = a[i]["purpose"];
                str = t.replace("yy", getAreaType(a[i]["ywtype"]));
            } else {
                showWord = key = a[i]["word"];
                purpose = a[i]["purpose"];
                district = a[i]["word"];
                str = t.replace("yy", getAreaType(a[i]["ywtype"]));
            }
            if (a[i]['count'] == 0 || a[i]['count'] == 'null') {
                str = str.replace("约num条", '');
            } else if (a[i]['count'] < 10) {
                str = str.replace("约num", a[i]["count"]);
            } else {
                str = str.replace("num", a[i]["count"]);
            }
            str = str.replace("xx", showWord);
            str = str.replace("zz", key + "," + a[i]["ywtype"] + "," + purpose + "," + comarea + "," + district + "," + tags + "," + enterprise);
            b.push(str);
        }
        return b.join("");
    }

    function stripscript(s) {
        return s.replace(/[\<\>\(\)\;\{\}\"\'\[\]\/\@\!\,]/g, '');
    }

    //纠错后显示类别列表函数
    function packNewErrorCorrection(c) {
        var correction = c["correction"];
        var arr = c["facets"]["category"];
        var len = arr.length;
        var b = [], _t = '<li><a href="javascript:;"><span class="flor f999">约num条</span><span class="searchListName" data-ywtype="zz">xx</span></a></li>';
        for (var i = 0; i < len; i++) {
            if (arr[i][2] <= 0) {
                continue;
            }
            var str = "";
            if (arr[i][0] == "ALL" || arr[i][0] == "住宅") {
                str = _t.replace("xx", getAreaType(arr[i][1]));
                str = str.replace("zz", (correction ? correction : searchInput.val()) + "," + arr[i][1] + ",住宅" + ",,,,");
            } else {
                str = _t.replace("xx", arr[i][0] + arr[i][1]);
                str = str.replace("zz", (correction ? correction : searchInput.val()) + "," + arr[i][1] + "," + arr[i][0] + ",,,,");
            }
            if (arr[i][2] == 0 || arr[i][2] == 'null') {
                str = str.replace("约num条", '');
            } else if (arr[i][2] < 10) {
                str = str.replace("约num", arr[i][2]);
            } else {
                str = str.replace("num", arr[i][2]);
            }

            b.push(str);
        }
        return b.join("");
    }

    //回复纠错前信息
    function correctionBefore(val) {
        var arr = searListUl.find("a");
        var l = arr.length;
        for (var i = 0; i < l; i++) {
            var el = $(arr[i]).find(".searchListName");
            if (el) {
                var ywData = el.data("ywtype");
                var a = ywData.split(",");
                a[0] = val;
                el.data("ywtype", a.join(","));
            }
        }
    }

    //旧版历史匹配函数
    function pack(a) {
        var i = 0, j = 0, len = a.length, b = [], _t = '<li><a href="javascript:;"><span class="searchListName" data-ywtype="zz">xx</span><span class="f999">-yy</span></a></li>';
        for (; i < len; i++) {
            if (String(a[i]).length > 0) {
                var arr = a[i].split(":");
                var str = _t.replace("xx", arr[0]);
                str = str.replace("yy", arr[3] + getPropertyType(arr[1], arr[2]));
                str = str.replace("zz", arr[0] + "," + arr[1] + "," + arr[2] + "," + (arr[3] || '') + "," + (arr[4] || '') + ',' + (arr[5] || '') + "," + (arr[6] || ''));
                b.push(str);
                j++;
            }
            if (j > 9)break;
        }
        return b.join("");
    }

    function getHistory() {
        hisList = eval(null != lib.localStorage && win.localStorage.getItem(hisLocalStorage) || []);
        searListUl.empty();
        var s;
        // hisList = ["国美第一城","我爱我家"]
        if ($.isArray(hisList) && hisList.length > 0 && (s = pack(hisList)).length > 1) {
            searListUl.append(s), history = !0,
                clearBtn.find("a").html(clearHisText);
            ($(searList).find('h3').length == 0 ) && searList.prepend(searListh3);
            $(searList).find('.searList').after(clearBtn);
            if ($(hotList).children().length > 0) {
                hotCon.after(searList);
            } else {
                searchEl.after(searList);
            }
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

    //绑定事件
    snav.find("a.back").on("click", function () {
        if (sPop == !0) {
            $(".floatApp").show();
            $("footer").show();
            $(".main").children("div").show();
            $(".main").children("section").show();
            $("#header").show();
            $("#footmark").show();
            $(".homeSearch").show();
            $(".bigNav").show();
            $(document.body).find("br").show();
            $(document.body).find("h2").show();
            //nav.show(),snav.detach(),header.show(),
            snav.detach(), sPop = !sPop;
            searList.detach(), clearBtn.detach(), searchEl.detach(), hotCon.detach();
        }
    });
    function addListener() {
        searListUl.add(hotCon).on("click", "a", function (e) {
            var tg = $(this);
            var el = tg.find(".searchListName");
            if (el.length > 0) {
                // setTimeout(function(){searchNew(el.data("ywtype"));},500);
                searchNew(el.data("ywtype"));
            } else {
                tg.parent().remove();
                correctionBefore(tg.html());
            }
        });
        clearBtn.on("click", "a", function () {
            history ? clearHistory() : closeList();
        });
    }

    function getOneData(l) {
        var arr = l["facets"]["category"];
        var len = arr.length;
        for (var i = 0; i < len; i++) {
            if (arr[i][2] != 0) {
                if (arr[i][0] = "ALL") {
                    arr[i][0] = "住宅";
                }
                return arr[i];
            }
        }
        return [];
    }

    function searchErrorCorrection() {
        if ($.trim(searchInput.val()) == "") {
            window.location = lib.mainSite + "xf/" + lib.city + ".html";
            return;
        }
        var searchInputWords = stripscript(searchInput.val());
        if (ajaxReq)ajaxReq.abort();
        ajaxReq = $.get(lib.esfSite + '?c=esf&a=ajaxGetSearchResult', {
            q: searchInputWords,
            city: lib.city
        }, function (data) {
            if (!data)data = "[]";
            var l = eval("(" + data + ")"), s;
            searListUl.empty();
            var count = l["itemcount"];
            var correction = l["correction"];
            if (count == 1) {
                var arr = getOneData(l);
                var str = searchInputWords + "," + arr[1] + "," + arr[0] + ",,,,";
                if (correction) {
                    str = correction + "," + arr[1] + "," + arr[0] + ",,,," + correction + "|" + arr[2] + "|" + searchInputWords;
                }
                searchNew(str);
                return;
            }
            var showTxt = "";
            if (count <= 0) {
                showTxt = '<div class="center pdY10"><p class="f999 f12">没有找到“' + searchInputWords + '”的相关房源，换个关键词试试吧</p></div>';
            } else {
                if (correction) {
                    showTxt = '<div class="searTips">您要找的是不是“' + correction + '”，共' + count + '个搜索结果，继续查找“<a href="javascript:;" id="correctionBeforeWord">' + searchInputWords + '</a>”</div>';
                } else {
                    showTxt = '<div class="searTips">共' + count + '个搜索结果，请选择类别查看</div>';
                }
            }
            snav.find(".left").html('<a id="wapesfsy_D01_01" class="logo" href="' + lib.mainSite + lib.city + '.html" title=""></a>');
            snav.find(".cent span").html('搜索结果');
            var s = packNewErrorCorrection(l);
            if (showTxt) {
                s = showTxt + s;
            }
            searListUl.append(s), history = !1, searchEl.after(searList);
            clearBtn.detach();
            if (count != "0") {
                clearBtn.find("a").html(closeText);
                $(searList).find('.searList').after(clearBtn);
            }
        })
    }

    /**
     * 记录用户离开搜索页面的时间
     * 离开动作包括，①直接点击搜索按钮到列表页，②点击历史记录到列表页，③点击自动
     * 提示到列表页，④点击最近热搜到列表页
     * @param string type 租房1 二手房2 新房3 大搜索4
     */
    function writeSearchLeaveTimeLog() {
        $.get(lib.esfSite + "?c=esf&a=ajaxWriteSearchLeaveTimeLog", {type: '4'}, function () {
        });
    }

    function searchNew(y) {
        if (!y)return;
        var data = y.split(",");
        var ywtype = data[1];
        var purpose = data[2] ? data[2] : "住宅";
        var comarea = !data[3] || data[3] == undefined ? "" : data[3];
        var district = !data[4] || data[4] == undefined ? "" : data[4];
        var tags = !data[5] || data[5] == undefined ? "" : data[5];
        var enterprise = !data[6] || data[6] == undefined ? "" : data[6];
        var correction = data[7] || '';
        searchInput.val(data[0]);
        var keyword = data[0];
        var b = keyword.replace(/(^\s+)|(\s+$)/g, "");
        if (b.length > 0 && null != lib.localStorage) {
            hisList = eval(win.localStorage.getItem(hisLocalStorage) || []);
            var s = keyword + ":" + ywtype + ":" + purpose + ":" + comarea + ":" + district + ":" + tags + ":" + enterprise + ":" + correction;
            var sIndex = $.inArray(s, hisList);
            if (sIndex >= 0) {
                hisList.splice(sIndex, 1);
            }
            hisList.unshift(s), hisList.length > 10 && hisList.splice(10, 1), win.localStorage.setItem(hisLocalStorage, "['" + hisList.join("','") + "']");
        }
        if (/^\/\/.*[htm|html]$/.test(correction)) {
            tongji(correction);
            return;
        }
        var url = "";
        var type = 1;
        switch (ywtype) {
            case "新房":
                type = 0;
                url = lib.mainSite + "search.d?m=search&keyword=";
                break;
            case "出售":
                url = lib.esfSite + "?keyword=";
                break;
            case "出租":
                url = lib.zfSite + "?keyword=";
                break;
            default :
                break;
        }
        if (type != 0) {
            keyword = encodeURIComponent(keyword);
            purpose = encodeURIComponent(purpose);
        }
        url += keyword + "&city=" + lib.city;
        if (type != 0) {
            url += "&purpose=" + purpose;
        }
        if (correction) {
            if (type != 0) {
                correction = encodeURIComponent(correction);
            }
            url += "&correction=" + correction;
        }
        if (tags) {
            if (type != 0) {
                tags = encodeURIComponent(tags);
            }
            url += "&tags=" + tags;
        }
        if (enterprise) {
            if (type != 0) {
                enterprise = encodeURIComponent(enterprise);
            }
            url += "&enterprise=" + enterprise;
        }
        if (comarea) {
            if (type != 0) {
                comarea = encodeURIComponent(comarea);
            }
            url += "&comarea=" + comarea;
        }
        if (district) {
            if (type != 0) {
                district = encodeURIComponent(district);
            }
            url += "&district=" + district;
        }
        window.location = url + "&refer=sy&r=" + Math.random();
        writeSearchLeaveTimeLog();
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
    var navFlayer, navFlayer1, navFlayer2, smsNum, userName, iconavBtn, ad, top;
    iconavBtn = header.find("a.ico-nav").on("click", function () {
        navFlayer || (navFlayer = $("div#navShadow,div#nav"), navFlayer1 = navFlayer.eq(0).on("click", function () {
            navFlayer.hide(), iconavBtn.get(0).appendChild(smsNum.get(0))
        }), navFlayer2 = navFlayer.eq(1), smsNum = $(this).children(".sms-num"), ad = $("#ad"), ad.length > 0 && (top = $(this).offset().top + 51, navFlayer.css("top", top + "px")));
        navFlayer2.is(":visible") ? (navFlayer.hide(), iconavBtn.get(0).appendChild(smsNum.get(0))) : (navFlayer.show(), undefined === userName && $.get(lib.mainSite + "public/?c=public&a=ajaxUserInfo", function (o) {
            userName = "", o != !1 && undefined != o.username && $("div#nav div.mt10 div.nav-tit a").text(userName = o.username)
        }), iconavBtn.get(0).removeChild(smsNum.get(0)));
    });
    header.find("a.ico-fb").on("click", function () {
        window.location = "/fabuType.jsp?city=" + lib.city + "&type=" + ba.channel;
    });
}(window, window.lib || (window.lib = {}));