!function(win, lib) {
    "use strict";
    var $ = win.$,channel = $("input#controlName").val(),channelIndex,cIndex,channels = ["xf","esf","zf","jiaju","news","bbs","ask","pinggu"],
        i,len = channels.length,flag = !1;
    for(i=0;i<len;i++){
        if(channels[i] == channel){
            cIndex = channelIndex = i;
            flag = !0;break;
        }
    }
    if(flag == !1){
        cIndex = channelIndex = 0;
        channel = channels[channelIndex];
    }
    lib.smartbanner = {channel:channel,cIndex:cIndex,channelIndex:channelIndex,channels:channels};
}(window, window.lib || (window.lib = {})),function(win, lib) {
    "use strict";
    var $ = win.$,ba = lib.smartbanner,channel=ba.channel,cIndex=ba.cIndex,channelIndex=ba.channelIndex,channels=ba.channels,
        nav = $("div.tabNav"),navChild = nav.children("div"),nav1 = navChild.eq(0),nav2 = navChild.eq(1),
        navList1 = nav1.children("a"),navList2 = nav2.find("a"),
        bar = $("div.search0620"),
        q = bar.find("input#S_searchtext"),
        channelName = ["新房","二手房","租房","家居","资讯","论坛","问答","评估"],
        channelUrl=[],
        channelNote = [ '楼盘名/地名/开发商', '楼盘名/地段名','楼盘名/地段名','楼盘名/风格/户型','请输入关键字','楼盘名/小区名/论坛名','请输入您的问题','请输入您要评估的房源所在小区'];

    function setLink(){
        var obj={},a=[];
        navList1.add(navList2).each(function(index,element){
            var ele = $(element);
            obj[ele.text()] = ele.attr("href");
        })
        $.each(channelName,function(index,element){
            a.push(obj[element]);
        })
        return a;
    }
    function in_array(search,array){
        for(var i in array){
            if(array[i]==search){
                return true;
            }
        }
        return false;
    }
    if(channelIndex>4){
        cIndex = 4;
        channelUrl =setLink();
        navList1.eq(cIndex).attr("href", channelUrl[channelIndex]).text(channelName[channelIndex]);
        nav2.find("li").eq(channelIndex-cIndex-1).remove();
        nav2.children("ul").prepend('<li><a href="'+channelUrl[cIndex]+'">'+channelName[cIndex]+'</a></li>');
    }
    navList1.eq(cIndex).removeClass().addClass("active"+(in_array(channel,["xf","esf","zf"])?"f":""));
    q.attr("placeholder",channelNote[channelIndex]);
    if(channel== "xf" || channel== "esf"){
        $('<a  id="wap'+channel+'sy_C01_15" href="'+lib.mainSite+'map/?city=cd&a='+channel+'Map" class="mapbtn">地图</a>').appendTo(bar);
    }
    $.each({nav:nav,bar:bar,q:q,channelName:channelName,channelUrl:channelUrl,channelNote:channelNote,in_array:in_array,moreBtn:navList1.eq(5),nav1:nav1,nav2:nav2},function(key,value){
        lib.smartbanner[key] = value;
    });
}(window, window.lib || (window.lib = {})),function(win, lib) {
    "use strict";
    var $ = win.$,ba = lib.smartbanner,nav=ba.nav,bar=ba.bar,q=ba.q,channel=ba.channel,channelIndex=ba.channelIndex,channels=ba.channels,channelName=ba.channelName,channelUrl=ba.channelUrl,channelNote=ba.channelNote,in_array=ba.in_array,
        channelType,
        offBtn = bar.find("a.off"),submitBtn = bar.find("a.btn"),sPop = !1;
    q.val()=="" && offBtn.hide();
    //弹出搜索浮层处理
    var sel = $('<div class="sel"><span></span></div>'),clearHisText = "清除历史记录",ssText = "搜索",closeText = "关闭",
        snav_template = '<header><div class="hLeft"><a href="javascript:;" class="back"></a></div>'
            +	'<div class="hCenter"><a href="javascript:;"><span>'+ssText+'</span></a></div>'
            +	'<div class="hIcon"></div></header>',
        snav = $(snav_template),
        searList = $('<div class="searList"><ul></ul></div>'),searListUl = searList.find("ul"),
        clearBtn = $('<div class="clearBtn"><a href="#">'+clearHisText+'</a></div>'),
        header = $("header#cdheader"),showItem = sel.find("span").prop("id","showSelection"),
        selection_template = '<ul class="drop"></ul>',
        itemHtml = createTypeDnHtml(),
        selection,selectItem,isFirst=!0,hisList,hisLocalStorage="hisLocal",history=!0,mainBody ;
    ba.header = header;
    q.attr("autocomplete", "off").on("input", initInput).on("click",function(){
        if(sPop == !1){
            if(!mainBody){
                mainBody = $(document.body).children("div").filter(function(index){return index>1 && $(this).is(":visible"); });
            }
            var text = channelName[channelIndex],flag=!1;
            nav.hide(),showItem.text(text),snav.find("div.hCenter>a>span").text(text+ssText),bar.find("div.ipt").before(sel),header.hide().after(snav),sPop = !sPop;
            searListUl.empty();
            var b = $(this).val()||"";
            if(""!=b)b = b.replace(/(^\s+)|(\s+$)/g, "");
            (0 == b.length)?getHistory():getList(b);
            if(isFirst){
                addListener(),isFirst = !isFirst;
            }
            mainBody&&mainBody.hide();
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
    function initInput(a) {
        var b, a = a || window.event;
        if (b = $(this).val().replace(/(^\s+)|(\s+$)/g, ""), !b.length)
            return getHistory(),offBtn.is(":visible") && offBtn.hide(), void 0;
        if (13 != a.keyCode && 32 != a.keyCode) {
            offBtn.is(":hidden") && offBtn.show();
            return getList(b), void 0;
        }
    }
    function getList(a) {
        if(!lib.searchTipUrl){
            var type = channelIndex, site = channels[type];//channelType!=undefined?channelType:channelIndex
            if(in_array(site,["zf","esf"]))  site = "pinggu";
            else if(site == "news")  return;
            if(site == "bbs"){
                lib.searchTipUrl = lib[site+"Site"]+"?c="+site+"&a=ajaxGetKeySearch&ns=n";
            }
            else lib.searchTipUrl = lib[site+"Site"]+"?c="+site+"&a=ajaxGetSearchTip";
        }
        //新房，二手房，须二次 encodeURIComponent 编码
        (channel == "xf" ||channel == "esf") && (a = encodeURIComponent(a));
        $.get(lib.searchTipUrl,{city:lib.city,q:a},function(data) {
            if(!data)data = "[]"
            var l = eval("("+data+")"),s;
            searListUl.empty();
            if(is_array(l) && l.length>0 && (s = pack(l)).length>1){
                searListUl.append(s),history = !1,clearBtn.find("a").html(closeText),searList.add(clearBtn).insertAfter(bar);
            }else{
                closeList();
            }
        })
    }
    function getHistory() {
        hisList = eval(win.localStorage&&win.localStorage.getItem(hisLocalStorage) || []);
        searListUl.empty();
        var s;
       // hisList = ["国美第一城","我爱我家"]
        if(is_array(hisList) && hisList.length>0 && (s = pack(hisList)).length>1){
            searListUl.append(s),history = !0,clearBtn.find("a").html(clearHisText),searList.add(clearBtn).insertAfter(bar);
        }else{
            closeList();
        }
    }
    function clearHistory() {
        win.localStorage && win.localStorage.removeItem(hisLocalStorage);
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
            nav.show(),sel.add(snav).detach(),header.show(),sPop = !sPop;
            searList.detach(),clearBtn.detach();
            mainBody&&mainBody.show();
        }
    });
    showItem.on("click",function(){
        if(!selection){
            selection = $(selection_template),selectItem = $(itemHtml).prependTo(selection),selectItem.find("input").eq(channelType!=undefined?channelType:channelIndex).prop("checked",true);
            sel.append(selection),ba.selection = selection;
            selectItem.on("click",function(){
                selectItem.find("input").prop("checked",false),
                channelType = $(this).children("input").prop("checked",true).val(),q.attr("placeholder",channelNote[channelType]);
                showItem.text(channelName[channelType]),snav.find("div.hCenter>a>span").text(channelName[channelType]+ssText),selection.hide();
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
        var type = channelType!=undefined?channelType:channelIndex;
        var keyword = q.val();
        var b = keyword.replace(/(^\s+)|(\s+$)/g, "");
        if (b.length>0 && win.localStorage){
            hisList = eval(win.localStorage.getItem(hisLocalStorage) || []);
            in_array(keyword,hisList) || hisList.unshift(keyword),hisList.length>10 && hisList.splice(10,1),win.localStorage.setItem(hisLocalStorage,"['"+hisList.join("','")+"']");
        }
        var r = Math.random();
        var url = "";
        switch (type)
        {
            case 1:
                url = lib.esfSite+"?c=esf&a=index&keyword=";
                break;
            case 2:
                url = lib.zfSite+"?c=zf&a=index&keyword=";
                break;
            case 3:
                url = lib.jiajuSite+"?c=jiaju&a=index&q=";
                break;
            case 4:
                url = lib.newsSite+"?c=news&a=search&q=";
                break;
            case 5:
                url = lib.bbsSite+"?c=bbs&a=search&q=";
                break;
            case 6:
                url = lib.askSite+"?c=ask&a=search&keyword=";
                break;
            case 7:
                url = lib.pingguSite+"?c=pinggu&a=list&keyword=";
                break;
            default :
                keyword = encodeURIComponent(keyword);//新房，二手房，须二次 encodeURIComponent 编码
                url = lib.mainSite+"search.d?m=searchNew&type="+type+"&keyword=";
                break;
        }
        window.location = url+encodeURIComponent(keyword)+"&city="+lib.city+"&r="+r;
    }
    function is_array(a){
        return toString.apply(a) === "[object Array]";
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
    var navFlayer,navFlayer1,navFlayer2;
    header.find("a.ico-nav").on("click",function(){
        navFlayer || (navFlayer = $("div#navShadow,div#nav")),navFlayer1= navFlayer.eq(0),navFlayer2= navFlayer.eq(1);
        navFlayer2.is(":hidden")?navFlayer.show():navFlayer.hide();
    });
    header.find("a.ico-fb").on("click",function(){
        window.location = "/fabuType.jsp?city=cd&type="+ba.channel;
    });
}(window, window.lib || (window.lib = {}))