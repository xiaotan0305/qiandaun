/**
 * 详情页页头搜索功能公共js
 * by blue
 */
(function(w,f){
    if(typeof define === "function"){
        define("headersearch/1.0.0/headersearch",[],function(){
            return f(w);
        })
    }else if(typeof exports === "object"){
        module.exports==f(w);
    }else{
        window.HeaderSearch=f(w);
    }
})(window,function(w){
    function HeaderSearch(lib){
        if(!lib)return;
        var c = w.localStorage;
        try {
            c && c.setItem("testPrivateModel", !1)
        } catch (d) {
            c = null
        }
        lib.localStorage = c;
        var $ = w.jQuery;
        //处理获取当前栏目
        var channel=getChannel(lib.entrance);
        var text=getNowChannel(channel);
        var specialLimit =["xf","esf","zf"];//新加
        //知识无搜索结果提示
        var emptyTip = $("<div class='center pdY10'><p class='f999 f12'>暂时没有相关知识，换个关键词试试吧~</p></div>");
        //弹出搜索浮层处理
        var searchEl=$('<form class="search0620 flexbox" action="" onsubmit="return false;" method="get" autocomplete="off">' +
            '<div class="searbox">' +
            '<div class="ipt"><input id="S_searchtext" type="search" name="q" value="" placeholder="楼盘名/地名/开发商等" autocomplete="off">' +
            '<a href="javascript:;" class="off" style="display: none;"></a></div><a href="javascript:;" class="btn" rel="nofollow"><i></i></a></form>');
        //热词列表容器
        var hotCon=$('<div class="searLast"><h3>最近热搜</h3><div class="cont clearfix" id="hotList"></div></div>');
        //热词列表
        var hotList=hotCon.find("#hotList");
        //知识购房指南分类容器
        var purchaseTypeCon = $('<div class="hot-list"><div class="askTag"></div></div>');
        var purchaseTypeList=purchaseTypeCon.find(".askTag");
        //热门标签容器ask
        var hotFlagCon=$('<section class="hot-box"><div class="hot-title"><a href="javascript:void(0);" class="flor f14">换一批</a>最近热搜</div><div class="hot-list"><div class="askTag"></div></section>');
        var hotFlagList=hotFlagCon.find(".askTag");
        var channelType;
        //弹出搜索浮层处理
        var clearHisText = "清除历史记录",ssText = "搜索",closeText = "关闭",
            snav = $('<header><div class="left"><a href="javascript:;" class="back" id="wap'+channel+'sy_D01_08"><i></i></a></div>'
                +	'<div class="cent"><span>'+text+ssText+'</span></div>'
                +	'<div class="head-icon"></div><div class="clear"></div></header>'),
            searList = $('<div class="searList" id="wap'+channel+'sy_D01_10"><ul></ul></div>'),searListUl = searList.find("ul"),
            clearBtn = $('<div class="clearBtn"><a href="javascript:;">'+clearHisText+'</a></div>'),
            hisLocalStorage=lib.city+channel+"hisLocal",history=!0,
            offBtn=searchEl.find(".off"),
            submitBtn = searchEl.find(".btn"),ajaxReq,
            bar = $(".search0620"),
            hisList,isFirst=!0,hideBody;

        //对ask的样式头部进行重新定义
        if (channel == 'ask' || channel == "zhishi") {
            snav_template = '<header><div class="left" id="wap'+channel+'sy_D01_08"><a href="javascript:;" class="back" id="wap'+channel+'sy_D01_08"><i></i></a></div>'
            +'<div class="cent"><span>'+text+ssText+'</span></div>'
            +'<div class="head-icon"></div><div class="clear"></div></header>';
            var snav = $(snav_template);
            var searchEl = $('<form class="search0620 flexbox" action="" onsubmit="return false;" method="get" autocomplete="off">' +
        '<div class="searbox">' +
        '<div class="ipt" id="wap'+channel+'sy_D01_09"><input id="S_searchtext" type="search" name="q" value="" placeholder="'+((channel=="ask" || channel == "zhishi")?"请输入您的问题":"楼盘名/地名/开发商等")+'" autocomplete="off">' +
        '<a href="javascript:;" class="off" style="display: none;"></a></div><a href="javascript:;" id="wap'+channel+'sy_D01_18" class="btn" rel="nofollow"><i></i></a></form>');
            var submitBtn = searchEl.find(".btn");
        }
        q=searchEl.find("#S_searchtext");
        q.on("input", initInput);//这里对输入进行事件调用
        q.on("blur",function(){//失去焦点之后再次调用热点
            if(channel == 'ask'){
                setTimeout(createHotFlag,200);
            } else if ((channel == 'zhishi') && (lib.jtname == 'xf')){
                setTimeout(createPurchaseType,200);
            } else if (channel != 'zhishi'){
                setTimeout(createHotSearch,200);
            }
        });

        if(channel == 'ask' || channel == "zhishi"){
           q.on("focus",function(){
               if (channel == 'ask') {
                   hotFlagCon.detach();
               } else if (lib.jtname == 'xf'){
                   purchaseTypeCon.detach();
               }
               if (emptyTip) {
                   emptyTip.detach();
               }
               var b = $(this).val()||"";
               if(""!=b)b = b.replace(/(^\s+)|(\s+$)/g, "");
               if (channel == 'ask') {
                   (0 == b.length)?getHistory():getList_ask(b);
               } else {
                   (0 == b.length)?getHistory():getList_zhishi(b);
               }
            });
            q.on("keyup",function(e){
                if(e.keyCode==13){
                    search ();
                }
          });
        }else{
            q.on("focus",createHistory);//这里调取历史记录
        }
        hideBody=$(document.body).children().filter(function(idx,el){
            return $( this).css("display") != "none";
        })
        if(!$(".icon-sea"))return;
        $(".icon-sea").on("click",function(e){
            hideBody.hide();
            if (channel == 'ask' || channel == 'zhishi'){
                //ask特殊的样式
                /*20150327去掉浮层从右侧进来的效果 fadeInRight*/
                $(document.body).attr('class','main main-s');
            }
            $(document.body).children().eq(0).before(snav).before(searchEl);//这里实现对页面结构的绑定
            searListUl.empty();
            if(isFirst){
                addListener(),isFirst = !isFirst;
            }
            if (channel == 'ask') {
                hotFlagCon.css('display','block');
                createHotFlag();//这里调取ask
            } else if ((channel == 'zhishi') && (lib.jtname == 'xf')){
                purchaseTypeCon.detach();
                if (emptyTip)
                    emptyTip.detach();
                createPurchaseType();
            } else {
                if (channel != 'zhishi') {
                    createHotSearch();
                }
            }
        });
        //绑定事件
        snav.find(".back").on("click",function(){
            snav.detach(),searList.detach(),clearBtn.detach(),searchEl.detach(),hotCon.detach();
            if (channel == 'ask')
            {
                //需要隐藏热点
                $(document.body).attr('class','');
                hotFlagCon.css('display','none');
            } else if ((channel == 'zhishi') && (lib.jtname=='xf'))
            {
                //需要隐藏热点
                $(document.body).attr('class','');
                purchaseTypeCon.css('display','none');
            }
            hideBody.show();
        });
        submitBtn.on("click",function(){
            search ();
        });
        function getChannel(str){
            if(str.indexOf("xf")!=-1){
                return "xf";
            }else if(str.indexOf("esf")!=-1){
                return "esf";
            }else if(str.indexOf("ask")!=-1){
                return "ask";
            } else if (str.indexOf("zhishi")!=-1){
                return "zhishi";
            }
            return "zf";
        }
        //创建最近热搜
        function createHotSearch(){
           // if ($.trim(q.val())!="") return;
            ajaxReq=$.get(lib.esfSite +'?c=esf&a=ajaxGetHotWords',{city:lib.city,type:getHotVarsType(channel)},function(){});
            if($(hotList).children().length>0){
                searchEl.after(hotCon);
                closeList();
                return;
            }
            if(ajaxReq)ajaxReq.abort();
            ajaxReq=$.get(lib.esfSite +'?c=esf&a=ajaxGetHotWords',{city:lib.city,type:getHotVarsType(channel)},function(data){
                ajaxReq=null;
                var arr=data;
                var b=[];
                for(var i=0;i<arr.length;i++){
                    b.push('<a href="javascript:;"><span class="searchListName" data-ywtype="'+arr[i]["Keyword"]+','+arr[i]["Purpose"]+',,,,,">'+arr[i]["Keyword"]+'</span></a>');
                }
                var el= b.join("");
                hotList.html(el);
                searchEl.after(hotCon);
                closeList();
            })
        }
        //创建历史搜索
        function createHistory(){
            if ($.trim($(this).val())!="") return;
            hotCon.detach();
            getHistory();
        }
        function closeList() {
            searListUl.empty(),searList.add(clearBtn).detach();
        }
        function initInput(a) {
            var b, a = a || window.event;
            if (b = $(this).val().replace(/(^\s+)|(\s+$)/g, ""), !b.length)
                return getHistory(),offBtn.is(":visible") && offBtn.hide(), void 0;
            if (13 != a.keyCode && 32 != a.keyCode) {
                !offBtn.is(":visible") && offBtn.show();
                if(channel == 'ask'){
                    return getList_ask(b), void 0;
                }
                if (channel == 'zhishi'){
                    return getList_zhishi(b), void 0;
                }
                return getNewList(b), void 0;
            }
        }

        function getHistory() {
            hisList = eval(null!=lib.localStorage&&w.localStorage.getItem(hisLocalStorage) || []);
            searListUl.empty();
            if (emptyTip) {
                emptyTip.detach();
            }
            var s;
            // hisList = ["国美第一城","我爱我家"]
            if($.isArray(hisList) && hisList.length>0 && (s = pack(hisList)).length>1){
              if(channel=="ask"){
                  searListUl.removeClass();
                  searListUl.addClass("s-jl");
                }
                searListUl.append(s),history = !0,clearBtn.find("a").html(clearHisText),searchEl.after(clearBtn),searchEl.after(searList);
            }else{
                closeList();
            }
        }
        function clearHistory() {
            null!=lib.localStorage && w.localStorage.removeItem(hisLocalStorage);
            hisList = [],closeList();
        }
        function pack(a) {
            var i=0, j=0,len= a.length,b=[],_t="";
            if(channel == 'zhishi'){
                _t='<li><a href="javascript:;" data-url="yy">xx</a></li>';
                for(;i< len;i++){
                    var data=a[i].split("-");
                    var str=_t.replace("xx",data[0]);
                    str=str.replace("yy",data[1]);
                    b.push(str);
                    j++;
                    if(j>4){
                        break;
                    }
                }
                return b.join("");
            }
            if(channel =="ask"){
                _t='<li><a href="javascript:;" data-url="yy">xx</a></li>';
                for(;i< len;i++){
                    var data=a[i].split("-");
                    var str=_t.replace("xx",data[0]);
                    str=str.replace("yy",data[1]);
                    b.push(str);
                }
                return b.join("");
            }
            _t='<li><a href="javascript:;"><span class="searchListName" data-ywtype="zz">xx</span><span class="f999">yy</span></a></li>';
            for(;i< len;i++){
                if(String(a[i]).length>0){
                    var data=a[i].split(":");
                    var yySet="",
                        searchKey=data[0],
                        purpose=data[1],
                        district=data[2],
                        comerce=data[3],
                        room=data[4],
                        tags=data[5],
                        enterprise=data[6];
                    if(room){
                        yySet="-"+getRoom(room);
                    }
                    if(tags){
                        yySet="";
                    }
                    if(enterprise){
                        yySet="-房企";
                    }
                    var str=_t.replace("xx",searchKey);
                    str=str.replace("yy",yySet);
                    str=str.replace("zz",searchKey+","+purpose+","+district+","+comerce+","+room+","+tags+","+enterprise);
                    b.push(str);
                    j++;
                }
                if(j>9)break;
            }
            return b.join("");
        }
        function addListener(){
            searListUl.add(hotCon).on("click","a",function(){
                var th=$(this)
                var el=th.find(".searchListName");
                if(el.length>0 && channel !='zhishi'){
                    setTimeout(function(){searchNew(el.data("ywtype"));},500);
                }else{
                    q.val($(this).text());
                    if(th.attr("data-url")){
                        setTimeout(function(){search (th.attr("data-url"));},500);
                    } else {
                        setTimeout(function(){search ();},500);
                    }
                }
            })
            clearBtn.on("click","a",function(){
                history?clearHistory():closeList();
            });
        }
        //新的点击自动提示选项规则
        function searchNew(y){
            if(!y)return;
            var data= y.split(",");
            var searchKey=data[0],
                purpose=data[1],
                district=data[2],
                comerce=data[3],
                room=data[4],
                tags=data[5],
                enterprise=data[6];
            q.val(searchKey);
            var b = searchKey.replace(/(^\s+)|(\s+$)/g, "");
            if (b.length>0 && null!=lib.localStorage){
                hisList = eval(w.localStorage.getItem(hisLocalStorage) || []);
                var s=searchKey+":"+purpose+":"+district+":"+comerce+":"+room+":"+tags+":"+enterprise;
                var sIndex=$.inArray(s,hisList);
                if(sIndex>=0){
                    hisList.splice(sIndex,1);
                }
                hisList.unshift(s),hisList.length>10 && hisList.splice(10,1),w.localStorage.setItem(hisLocalStorage,"['"+hisList.join("','")+"']");
            }
            var url = "";
            var type = 1;
            switch (getHotType(getHotVarsType(channel)))
            {
                case "新房":
                    type = 0;
                    url = lib.mainSite+"search.d?m=search&type=0&keyword=";
                    break;
                case "出售":
                    url = lib.esfSite+"?c=esf&a=index&keyword=";
                    break;
                case "出租":
                    url = lib.zfSite+"?c=zf&a=index&keyword=";
                    break;
                case "问答":
                    url = lib.askSite+"?c=ask&a=tagAskList&tags=";
                    break;
                default :
                    break;
            }
            //兼容问答
            if (getHotType(getHotVarsType(channel)) == "问答")
            {
                 searchKey=encodeURIComponent(searchKey);
                 url +=searchKey;
            }else{           
            if(type!=0){
                searchKey=encodeURIComponent(searchKey);
            }
            url+=searchKey+"&city="+lib.city;
            if(type!=0){
                purpose=purpose?purpose:$("input[type=hidden]").eq(0).val();
                purpose=encodeURIComponent(purpose);
                url+="&purpose="+purpose;
            }
            if(district){
                if(type!=0){
                    district=encodeURIComponent(district);
                }
                url+="&district="+district;
            }
            if(comerce){
                if(type!=0){
                    comerce=encodeURIComponent(comerce);
                }
                url+="&comarea="+comerce;
            }
            if(room){
                if(type!=0){
                    room=encodeURIComponent(room);
                }
                url+="&room="+room;
            }
            if(tags){
                if(type!=0){
                    tags=encodeURIComponent(tags);
                }
                url+="&tags="+tags;
            }
            }
            //房企预留
//            if(enterprise){
//                if(type!=0){
//                    enterprise=encodeURIComponent(enterprise);
//                }
//                url+="&enterprise="+enterprise;
//            }
            window.location = url+"&r="+Math.random();
            writeSearchLeaveTimeLog();
        }

        /**
         * 记录用户离开搜索页面的时间
         * 离开动作包括，①直接点击搜索按钮到列表页，②点击历史记录到列表页，③点击自动
         * 提示到列表页，④点击最近热搜到列表页
         * @param string type 租房1 二手房2 新房3 大搜索4
         */
        function writeSearchLeaveTimeLog() {
            switch (channel) {
                case 'zf':
                    var logtype = '1';
                    break;
                case 'esf':
                    var logtype ='2';
                    break;
                case 'xf':
                    var logtype ='3';
                    break;

            }
            $.get(lib.esfSite+"?c=esf&a=ajaxWriteSearchLeaveTimeLog",{type:logtype},function(){ });
        }

        function getHotType(type){
            switch (parseInt(type)) {
                case 1:
                    return "出租";
                case 2:
                    return "出售";
                case 3:
                    return "新房";
                case 4:
                    return "问答";
            }
            return "";
        }
        function getNowChannel(cn){
            switch (cn){
                case "zf":
                    return "租房";
                case "esf":
                    return "二手房";
                case "xf":
                    return "新房";
                case "ask":
                    return "问答";
                case "zhishi":
                    return "知识";
            }
            return "栏目";
        }
        function getHotVarsType(cn){
            switch (cn){
                case "zf":
                    return 1;
                case "esf":
                    return 2;
                case "xf":
                    return 3;
                case "ask":
                    return 4;
            }
            return 1;
        }
        function stripscript(s) {
            return s.replace(/[\<\>\(\)\;\{\}\"\'\[\]\/\@\!\,]/g,'');
        }
        function search (url){
            var keyword = stripscript(q.val()), bar = $(".search0620");
            var b = keyword.replace(/(^\s+)|(\s+$)/g, "");
            if (b.length>0 && null!=lib.localStorage){
                if(channel == 'ask'){
                    b+="-"+(url==undefined?"":url);
                } else if(channel != 'zhishi'){
                    b+="::::::";
                }

                hisList = eval(w.localStorage.getItem(hisLocalStorage) || []);
                var sIndex=$.inArray(keyword,hisList);
                if(sIndex>=0){
                    hisList.splice(sIndex,1);
                }
                var tmpLength = channel == 'zhishi' ? 5 : 10;//知识频道保留五条记录其余10条
                hisList.unshift(b),hisList.length>tmpLength && hisList.splice(tmpLength,1),w.localStorage.setItem(hisLocalStorage,"['"+hisList.join("','")+"']");
            }
            var url = "",type=-1;
            switch (channel)
            {
                case "xf":
                    type=0;
                    url = lib.mainSite+"search.d?m=search&type=0&keyword=";
                    break;
                case "esf":
                    var purpose="";
                    if($("input[type=hidden]").length>0){
                        purpose="&purpose="+$("input[type=hidden]").eq(0).val();
                    }
                    url = lib.esfSite+'?c=esf&a=index'+purpose+'&keyword=';
                    break;
                case "zf":
                    var purpose="";
                    if($("input[type=hidden]").length>0){
                        purpose="&purpose="+$("input[type=hidden]").eq(0).val();
                    }
                    url = lib.zfSite+'?c=zf&a=index'+purpose+'&keyword=';
                    break;
                case "ask":
                    url = lib.askSite+'?c=ask&a=search&keyword=';
                    break;
                case "zhishi":
                    url = lib.zhishiSite+'?c=zhishi&a=search&q=';
                    break;
                default :
                    break;
            }
            if (channel == 'ask' && keyword == '')
            {
                window.location = lib.askSite;
            } else {
                window.location = url+(type==0?keyword:encodeURIComponent(keyword))+"&city="+lib.city+"&r="+Math.random();
            }
            writeSearchLeaveTimeLog();
        }
        function getNewList(a){
            var purpose="住宅";
            if(lib.hasOwnProperty("purpose")){
                purpose=lib.purpose;
            }else if($('input[data-id="purpose"]').length>0){
                purpose=$('input[data-id="purpose"]').val();
            }
            if(ajaxReq)ajaxReq.abort();
            ajaxReq=$.get(lib.esfSite+"?c=esf&a=ajaxGetAllSearchTip",{q:a,city:lib.city,type:getHotVarsType(channel),purpose:purpose},function(data) {
                if(!data)data = "[]";
                var l = eval("("+data+")"),s;
                searListUl.empty();
                if($.isArray(l) && l.length>0 && (s = packNew(l)).length>1){
                    searListUl.append(s),history = !1,clearBtn.find("a").html(closeText),searchEl.after(searList),$(searList).after(clearBtn);
                }else{
                    closeList();
                }
            })
        }
        //ajax获取ask搜索关键字列表
        function getList_ask(a){
            var ask_url = lib.askSite+"?c=ask&a=ajaxGetSearchTip";
            var bar = $(".search0620");
            searListUl.removeClass();
            searListUl.addClass("s-lx");
            if(ajaxReq)ajaxReq.abort();
            ajaxReq=$.get(ask_url,{q:a,city:lib.city,type:getHotVarsType(channel)},function(data) {
                if(!data)data = "[]";
                var l = eval("("+data+")"),s;
                searListUl.empty();
                if($.isArray(l) && l.length>0){
                    var xun_length = l.length;
                    if(xun_length > 10){
                        xun_length = 10;
                    }
                    var ali="";
                    for(var i=0;i < xun_length;i++){
                            //使用对象的数组遍历,如何使用each实现,写入localstroge来记录
                        ali += '<li><a href="javascript:void(0);" id="my_li_'+i+'" data_url= "'+l[i].url+'">'+l[i].name+'</a></li>';
                    }
                    searListUl.append(ali),history = !1,clearBtn.find("a").html(closeText);searchEl.after(searList),$(searList).after(clearBtn);
                    //需要什么格式写入localstorage
                }else{
                    closeList();
                }
            for(var i=0;i<10;i++){
            $('#my_li_'+i).on('click',function(){
                var hisList = eval(null!=lib.localStorage&&w.localStorage.getItem(hisLocalStorage) || []);
                var me = $(this);
                var char_text = me.text();
                char_text += '-'+me.attr('data_url')+',';
                char_text += hisList;
                null!=lib.localStorage&&w.localStorage.setItem(hisLocalStorage,"['"+char_text+"']");
                window.location.href = me.attr('data_url');
            });
            }
          });
        }
        //ajax获取知识搜索关键字列表
        function getList_zhishi(a){
            var bar = $(".search0620");
            var zhishi_url = lib.zhishiSite+"?c=zhishi&a=ajaxGetSearchTip";
            if(ajaxReq)ajaxReq.abort();
            ajaxReq=$.get(zhishi_url,{q:a,city:lib.city},function(data) {
                var l =data,s;
                searListUl.empty();
                s = packZhishi(l);
                if($.isArray(l) && l.length>0 && s.length>1){
                    if(typeof emptyTip !='undefined'){
                        emptyTip.detach();
                    };
                    searListUl.removeClass();
                    searListUl.addClass("s-lx");
                    searListUl.append(s),history = !1,clearBtn.find("a").html(closeText),bar.after(clearBtn),bar.after(searList);
                }else{
                    closeList();
                }
            });
        }
        //end
        //ask的调用热点标签的方法
        function packZhishi(a){
            var b=[],_t='<li><a href="javascript:;">xx</a></li>';
            for(var i in a){
                var str=_t.replace("xx",a[i].title);
                b.push(str);
            }
            return b.join("");
        }
        function createHotFlag(){
        if ($.trim(q.val())!="") return;
            //调取后台
            if($(hotFlagList).children().length>0){
                searchEl.after(hotFlagCon);
                closeList();
                return;
            }
            if(ajaxReq)ajaxReq.abort();
            ajaxReq=$.get(lib.askSite +'?c=ask&a=ajaxGetHotkeywordList',{city:lib.city},function(data){
                var arr=eval("("+data+")");
                var b=[];
                for(var i=0;i<arr.length;i++){
                    b.push('<a href="'+arr[i].url+'"><h2>'+arr[i].Keyword+'</h2></a>');
                }
                var el= b.join("");
                hotFlagList.html(el);
                searchEl.after(hotFlagCon);
                closeList();
            })
        }
        function createPurchaseType(){
            if ($.trim(q.val())!="") return;
            //调取后台
            if($(purchaseTypeList).children().length>0){
                searchEl.after(purchaseTypeCon);
                closeList();
                return;
            }
            if(ajaxReq)ajaxReq.abort();
            ajaxReq=$.get(lib.zhishiSite +'?c=zhishi&a=ajaxGetPurchaseType',function(data){
                if(!data) data = [];
                var b=[];
                for(var i=0;i<data.length;i++){
                    b.push('<a href="'+data[i].typeurl+'"><h2>'+data[i].typename+'</h2></a>');
                }
                var el= b.join("");
                purchaseTypeList.html(el);
                searchEl.after(purchaseTypeCon);
                closeList();
            })
        }
        $("body").delegate(".f14","click",function(){
            hotFlagList.html("");
            createHotFlag();
        });
        //调取end
        //新的拼音匹配机制显示类别列表函数
        function packNew(a){
            //_t='<li><a href="javascript:;"><span class="flor f999">约num条</span><span class="searchListName" data-ywtype="zz">xx</span></a></li>',约数备份
            var len= a.length,categoryId= 0,b=[],t='<li><a href="javascript:;"><span class="flor f999">约num条</span><span class="searchListName" data-ywtype="zz">xx</span><span class="f999">yy</span></a></li>';
            for(var i=0;i< len;i++){
                categoryId=getCategoryId(a[i]["category"]);
                var str= t,showWord="",yySet="",num="",searchKey="",purpose="",district="",comerce="",tags="",room ="",enterprise="";
                var num=a[i].hasOwnProperty("countinfo")?a[i]["countinfo"]:0;
                if(categoryId<3){
                    showWord=a[i]["projname"]/*+getHotType(getHotVarsType(channel))*/;
                    searchKey=a[i]["projname"];
                    str=str.replace("xx",showWord);
                    str=str.replace("num",num);
                    str=str.replace("yy",yySet);
                    str=str.replace("zz",searchKey+","+purpose+","+district+","+comerce+","+room+","+tags+","+enterprise);
                    b.push(str);
                    var countArr=getCount(a[i]);
                    for(var idx in countArr){
                        str= t,yySet="",num="",purpose="",district="",comerce="",tags="",room ="",enterprise="";
                        var ob=countArr[idx];
                        num=ob["num"];
                        yySet="-"+getRoom(ob["type"]);
                        room=ob["type"];
                        str=str.replace("xx",showWord);
                        str=str.replace("num",num);
                        str=str.replace("yy",yySet);
                        str=str.replace("zz",searchKey+","+purpose+","+district+","+comerce+","+room+","+tags+","+enterprise);
                        b.push(str);
                    }
                }else{
                    switch (categoryId){
                        case 3:
                            showWord=a[i]["projname"];
                            searchKey=enterprise=a[i]["projname"];
                            yySet="-房企";
                            break;
                        case 5:
                            showWord=a[i]["projname"];
                            searchKey=purpose=a[i]["projname"];
                            break;
                        case 6:
                            showWord=a[i]["projname"];
                            searchKey=district=a[i]["projname"];
                            break;
                        case 7:
                            showWord=a[i]["projname"];
                            searchKey=comerce=a[i]["projname"];
                            break;
                        case 8://标签
                            showWord=a[i]["projname"];
                            searchKey=tags=a[i]["projname"];
                            yySet="";
                            break;
                    }
                    str=str.replace("xx",showWord);
                    if(num==null||num==0){
                        str=str.replace("约num条","");
                    }else{
                        str=str.replace("num",num);
                    }
                    str=str.replace("yy",yySet);
                    str=str.replace("zz",searchKey+","+purpose+","+district+","+comerce+","+room+","+tags+","+enterprise);
                    b.push(str);
                }
            }
            return b.join("");
        }
        //获取居数信息
        function getCount(obj){
            var arr=[];
            var key="";
            if(obj.hasOwnProperty("esfcount1")){
                key="esfcount";
            }else if(obj.hasOwnProperty("rentcount1")){
                key="rentcount";
            }else{
                return arr;
            }
            for(var i=1;i<=4;i++){
                if(obj.hasOwnProperty(key+i)&&parseInt(obj[key+i])>0){
                    var o={};
                    o["type"]=i-1;
                    o["num"]=obj[key+i];
                    arr.push(o);
                }
            }
            return arr;
        }
        //获取楼盘标识并统一新房和租房、二手房的标识
        function getCategoryId(id){
            if(channel=="xf"){
                switch (parseInt(id)){
                    case 5:
                        return 7;
                    case 7:
                        return 8;

                }
            }
            return parseInt(id);
        }
        //获取居数的字典函数
        function getRoom(num){
            switch (parseInt(num)){
                case 0:
                    return "一居";
                case 1:
                    return "二居";
                case 2:
                    return "三居";
                case 3:
                    return "四居";
                case 4:
                    return "五居";
                default :
                    return "五居以上";
            }
            return "获取居数失败";
        }
    }
    return HeaderSearch;
});