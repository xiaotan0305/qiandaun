/**
 * 大首页入口类
 * by blue
 * 20150906 blue 整理整个js代码及增加注释、去除一些垃圾代码、优化多处冗长代码
 * 20150921 blue 首页推荐服务板块推广到11个电商城需求，即优惠专区的滑动显示功能推到11个电商城市，将查房价搜索替换为最新的模块化搜索功能
 * 20151027 blue 大首页UI改版，修改为1.0.1版本的走势图，并增加在走势图下面滑动查看房价走势的功能，删除查房价搜索
 * 20151116 blue 根据返回跳转的频道修改跳转到那个栏目地图
 * 20151123 blue 删除requestAnimationframe.js的引入
 * 20151201 blue 大首页需求，大城市房产知识、房产资讯、房产问答显示3条数据，小城市显示5条
 * 20160112 blue 大首页滑动楼盘操作增加滑动时再加载视窗中的图片功能，部分代码优化，对猜你喜欢、房产资讯等有换一换功能的列表实行惰性加载，并且在换一换后按需加载
 * 20160513 tkp 大数据改版 猜你喜欢\地图入口\导航知识图标入口 大数据分析 重新做了
 */
define('modules/index/maina', ['jquery', 'util/util', 'modules/index/locate', 'swipe/3.3.1/swiper',
                               'chart/raf/1.0.0/raf', 'chart/line/1.0.1/line', 'lazyload/1.9.1/lazyload', 
                               'iscroll/2.0.0/iscroll-lite', 'search/mainSearch', 'search/home/homeSearch',
                              ], function (require) {
    'use strict';
    // jquery库
    var $ = require('jquery');
    // 大首页搜索类
    var Search = require('search/home/homeSearch');
    // 通用工具集
    var Util = require('util/util');
    // 实现定位用的js实例，！！！这个js现在返回的是一个对象，也就是说Locate是一个对象而不是一个类
    var Locate = require('modules/index/locate');
    // swiper滚动插件类，！！！这里为实例，不需要new创建
    var Swiper = require('swipe/3.3.1/swiper');
    // 获取画走势图类
    var Line = require('chart/line/1.0.1/line');
    // 获取滑动插件类
    var IScrollLite = require('iscroll/2.0.0/iscroll-lite');
    // 获取当前地址
    var lh = location.href,
        lhl = lh.toLowerCase();
    // 配合m.soufun.com 下 统计无法中种一个cookie  global_cookie 导致大数据无法统计
    var globalCookie = Util.getCookie('global_cookie');
    if (!globalCookie) {
        Util.setCookie('global_cookie', '5335fa5a-1483524172797-0f981519', 365);
    }

    var $window = $(window);

    /**
     * a标签增加参数f=1 or f=2
     * @param {any} obj 父级
     */
    $(document.body).on('click', 'a', function (e) {
        e.preventDefault();
        var $this = $(this),
            href = $this.attr('href');
        if (href && !/javascript:/.test(href)) {
            if (/(\?|\&)u=/.test(href)) {
                if (/u=.+\?/.test(href)) {
                    location.href = href + '&f=1';
                }else {
                    location.href = href + '?f=1';
                }
            }else {
                location.href = href + (/&|\?/.test(href) ? '&' : '?') + 'f=1';
            }
        }
    });
    // 回到顶部
    // 判断是否加载显示回顶按钮
    $window.on('scroll.back', function () {
        var scrollTop = $window.scrollTop();
        if (scrollTop > $window.height() * 2 - 60) {
            require.async(['backtop/1.0.0/backtop'], function (backTop) {
                backTop();
                $('#wapesfsy_D04_01').attr('id', 'wapdsy_D13_01');
            });
            $window.off('scroll.back');
        }
    });
    // 页面顶部轮播广告容器的容器实例，用这个实例控制轮播是否显示
    //  ！！！感觉多余，但是由于固定的页面结构无法修改
    var $news = $('#news');
    // 获取黄金眼位置容器实例
    var homeBan = $('.homeBan');
    // 轮播区域容器
    var $tpSlider = $('#tpSlider');
    // 关闭广告按钮实例
    // ！！！这里我并没有在页面作用找到以closeAd为ID的节点
    var $closeAd = $('#closeAd');
    // 获取自定义列表容器实例
    var $customList = $('#customList');
    // 这里获取的实际上是猜你喜欢列表的换一换按钮及查看更多按钮容器示例，类名不存在任何意义
    var $homeOption = $('.homeOption');
    // 页面最下部分登录、注册按钮，在未登录才显示
    var $loginAndRegBtn = $('.sfutHref');
    // 猜你喜欢一页最大显示数量
    var CaiNiXiHuanMAXSHOWNUM = 5;
    // ！！！未知用途的一个空节点实例，注释掉了
    /* $tganchor = $('#tganchor'),*/
    // 获取页面传入参数
    var vars = seajs.data.vars;
    // 是否为小米黄页合作页面
    var isMiuiYP = false;
    // 是否为三星的泰泽系统
    var isTizen = false;
    // for循环索引使用
    var i = 0;
    // 一些没有模块化的js合并加载数组
    var preload = [];
    
    var caiNiXiHuanListDataConfig = {
    		 m: 'xiHuanLouPanList2',
             city: vars.city,
             datatype: 'json',
             p: 2,
    	};
    var loupanListDataConfig = {
   		 m: 'xiHuanLouPanList2',
            city: vars.city,
            datatype: 'json',
            p: 2,
            loupan: 'loupan',
   	};
    var zixunListDataConfig = {
      		 m: 'getZixunList',
               city: vars.city,
               datatype: 'json',
               p: 2,
      	};
    var wendaListDataConfig = {
     		 m: 'getWendaList',
              city: vars.city,
              datatype: 'json',
              p: 2,
     	};
    var meituListDataConfig = {
     		 m: 'getMeituList',
              city: vars.city,
              datatype: 'json',
              p: 2,
     	};
    // 下拉加载更多--------------------------------------------------start
  
    var oneInfo = 40;
    var options = {
            ajaxUrl: '/main.d',
            //ajaxData: dataConfig,
            moreBtnID:'#drag',
            loadPromptID: '#loading',
            pageNumber: 10,
            pagesize: oneInfo,
          
           
        };
    // 获取浏览器UA
    var UA = navigator.userAgent.toLowerCase();
    // 判断是否为iPhone系统
    var isApple = UA.indexOf('iphone') !== -1 || UA.indexOf('ios') !== -1;
    // ！！！浏览器高度兼容性处理
    var browserHeader = 0;
    if (isApple) {
        // 是iPhone的话浏览器多高出了68像素
        browserHeader = 68;
    } else if (/ucbrowser/i.test(UA)) {
        // 不是苹果手机并且是uc浏览器的话，浏览器多高出了50像素
        browserHeader = 50;
    }
    // 调用加载更多模块实现加载更多
    // 加载标识，用于限制ajax调用过程中不允许重复调用
    var loadFlag = true;
    // window实例
    var $window = $(window);
    // document实例
    var $document = $(document);
    
    var $moreBtn = $(options.moreBtnID);
    var $loadPrompt = '';
    var loadMoreFlag = false;
    var moreText = $moreBtn.find('a').html() || '';
    var channelTab = $('.favBox a');
    var indexTab = vars.localStorage.getItem('indexTab')||'caiNiXiHuanList';
    //判断是否为小米黄页
    if (UA.indexOf('miuiyellowpage') > -1) {
        isMiuiYP = true;
    }
    // 如果不是小米黄页
    if (!isMiuiYP) {
        // 获取页面底部的多个图表容器实例
        var appIconsArr = $('.btmIcons a'),
            appIconsArrL = appIconsArr.length,
            // ！！！猜测为和app有关操作的一个节点，但是当前页面中没有获取到
            $app = $('.app'),
            // 下载相关app统一的下载地址前缀
            comurl = '/client.jsp?city=' + vars.city + '&flag=download',
            urlArr = [
                // 搜房app下载地址
                '/clientindex.jsp?city=' + vars.city + '&flag=download&f=1114',
                // 租房app下载地址
                comurl + '&produce=soufunrent',
                // 装修app的下载地址
                comurl + '&produce=ftxzx',
                // 天下贷app的下载地址
                comurl + '&produce=txdai',
                // 游天下app的下载地址
                comurl + '&produce=youtx'
            ];
        // $app设置跳转下载地址
        $app.attr('href', '/clientindex.jsp?city=' + vars.city + '&flag=download&f=1113');
        // 循环遍历所有的页面底部app下载按钮，赋值跳转下载地址
        for (var j = 0; j < appIconsArrL; j++) {
            var btn = appIconsArr.eq(j),
                url = urlArr[j];
            // 当使用的为iphone并且不是搜房网app时增加地址后缀
            if (UA.indexOf('iphone') !== -1 && j !== 0) {
                url += '&f=1114';
            }
            btn.attr('href', url);
        }
        // 是小米黄页
    } else {
        var whref = window.location.href;
        // 判断当前页面地址不是动态地址时，跳转到小米黄页专有地址
        if (whref.indexOf('.html') > -1 && whref.indexOf('main.d?m=main') === -1) {
            window.location.href = vars.mainSite + 'main.d?m=main&city=' + vars.city + '&sf_source=bd_xiaomihy';
        }
    }
    // 是否为三星tizen系统，！！！暂时不上正式所以注释掉了
    if (UA.indexOf('tizen') > -1) {
        isTizen = true;
    }
    // 如果是三星泰泽系统，隐藏右上角app下载按钮
    if (isTizen) {
        $('.downloadAc').hide();
    }
    // 尝试判断是否为无痕模式，如果是无痕模式则放弃所有localstorage操作将vars.localStorage置于空
    if (!vars.localStorage) {
        vars.localStorage = window.localStorage;
        try {
            vars.localStorage.setItem('testPrivateModel', false);
        } catch (d) {
            vars.localStorage = null;
        }
    }
    // 获取页面后台传入的数据
    $('input[type=hidden]').each(function () {
        var $this = $(this);
        vars[$this.attr('data-id')] = $this.val();
    });
    // 大首页大搜索执行初始化
    var search = new Search();
    // 区分跳转链接
    search.pagetype = '1';
    search.init();
    // 执行一些不需要new声明的模块化js
    // 图片惰性加载jquery插件
    require('lazyload/1.9.1/lazyload');
    // 异步加载一些非模块化的js
    // miuiYellowPage实现小米黄页的特殊功能
    // 20141118.js下载浮层功能
    // topEffect.js实现定制导航功能
    // _ubm.js用户行为分析js
    preload.push('miuiYellowPage/miuiYellowPage');
    // 判断当不是凤凰合作页或者不是小米黄页时
    if (vars.sf_source !== 'ifeng_bd' || !isMiuiYP) {
        // 引入app下载功能js
        preload.push('app/1.0.0/appdownload', vars.public + 'js/20141106.js');
    }
    require.async(preload);
    // 判断用户是否登录，如果已经登录，隐藏登录和注册入口，否则展示
    if (Util.getCookie('sfut')) {
        $loginAndRegBtn.hide();
    }
    // 实现广告图片轮播效果
    // 声明广告轮播实例
    if ($tpSlider.length) {
        new Swiper($tpSlider, {
            speed: 500,
            autoplay: 3000,
            autoplayDisableOnInteraction: false,
            loop: true,
            pagination: '#position',
            paginationElement: 'li',
            bulletActiveClass: 'current'
        });
    }
    // 房产百科轮播
    var $bkScroller = $('#bkScroller');
    if ($bkScroller.length > 0) {
        // 获取轮播容器所有的li子节点
        var bkScrollerLiArr = $bkScroller.find('li');
        // 获取每个li子节点长度
        var width = 0;
        bkScrollerLiArr.each(function (index, ele) {
            // 由于获取的高度会四舍五入,所以每个li加0.5px容错,保证ul宽度够宽
            width += $(ele).outerWidth();
        });
        // 赋值给滑动容器宽度
        $bkScroller.width(width);
        // 初始化滑动插件
        var ss = new IScrollLite('#bkSlider', {
            // 开启横向滑动
            scrollX: true,
            // 禁止纵向滑动
            scrollY: false,
            // 滑动为其本身，这里的作用是防止禁用掉整个文档流的默认事件导致的bug
            bindToWrapper: true,
            // 可以纵向滑动，默认能够穿过
            eventPassthrough: true
        });
        ss.refresh();
    }
    // 执行首页频道图标分屏
    // 6 : 图标四屏为固定值,需要提前为父级设置宽度(新版swiper 不需要设置)

    var swiperIndex = null,
        topBox = $('#top'),
        swiperEnter = null;
    if (topBox.length) {
        swiperEnter = new Swiper('#top', {
            speed: 500,
            autoplayDisableOnInteraction: false,
            loop: false,
            pagination: '#pointBox',
            paginationElement: 'span',
            bulletActiveClass: 'cur',
            onTap: function (swiper) {
                Util.setCookie('swiperIndex', swiper.activeIndex, 0.02);
            }
        });

        // 初始化页面
        swiperIndex = Util.getCookie('swiperIndex');
        if (swiperIndex) {
            swiperEnter.slideTo(swiperIndex);
        }
    }

    var headerTop = $('#headerTop'),
        hym = $('#hym'),
        navTpLoad = $('#navTpLoad'),
        bigNav = $('#bigNav'),
        adH = 0;
    var headerTopH = headerTop.outerHeight();
    var topDownload = $('.tdl'),
        topDownH = topDownload.outerHeight();
    var flexbox = $('.flexbox');


    // 判断有没有大屏广告
    if (vars.bgAd) {
        adH = hym.outerHeight() + bigNav.outerHeight() - headerTopH;
    } else {
        adH = (hym.outerHeight() || navTpLoad.outerHeight()) - headerTopH;
    }

    // 判断是否未初始化页面
    if ($window.scrollTop() && topDownload.is(':hidden')) {
        headerTop.css('top', 0);
    }
    // 切换头部浮层样式
    var downTopTimer = null;
    $window.on('scroll touchmove', function (ev) {
        var winScrollTop = $window.scrollTop();
        var dH = winScrollTop >= adH;
        dH ? flexbox.removeClass('op_bg') : flexbox.addClass('op_bg');

        if (vars.topAdCity === 'true') {
            // 首页下载app弹层ui更改
            // 处理浮层显示位置
            if (winScrollTop <= 0 && topDownload.is(':hidden')) {
                ev.preventDefault();
                clearTimeout(downTopTimer);
                downTopTimer = setTimeout(function () {
                    if (vars.appFloatBox && vars.appFloatBox.smartDom) {
                        $(vars.appFloatBox.smartDom).hide();
                    }
                    topDownload.show();
                    headerTop.css('top', topDownH - winScrollTop);
                }, 100);
            } else if (winScrollTop > 0 && topDownload.is(':visible')) {
                if (vars.appFloatBox && vars.appFloatBox.smartDom) {
                    $(vars.appFloatBox.smartDom).show();
                }
                topDownload.hide();
                // 兼容电脑上滚轮滚动会回弹问题
                window.scroll(0, 1);
                headerTop.css('top', 0);
            }
        }
        /*
         * 绑定滚动事件，监听是否到达底部，执行加载更多操作
         */
       
            var scrollH = $document.height() - browserHeader;
            if (loadFlag && $window.scrollTop() + $window.height() >= scrollH) {
                loadMore();
            }
        
    });

    /**
     * 找小区入口
     * @type {any}
     */
    var xiaoquIco = $('.n17');
    vars.getPosSuc = function (json) {
        xiaoquIco.attr('href', vars.mainSite + 'fangjia/' + vars.city + '_list_pinggu/?x1=' + json.x + '&y1=' + json.y + '&distance=5&from=tjxq');
    };

    /**
     * 积分商城 https 容错
     */
    var store = $('.n19');
    if (location.protocol.indexOf('https') !== -1) {
        store.attr('href', '//mstore.fang.com/index.html');
    }

    // 这里判断是$news.length,！！！只能猜测为页面结构中news节点有可能是不存在的，以这种方式判断是否有广告，完全不知道干什么用的
    if ($news.length) {
        // 如果cookie中adIsShow为1，则删除adIsShow的cookie,！！！不理解的操作，猜测为当存在广告时，删除显示广告的cookie
        if (Util.getCookie('adIsShow') === '1') {
            Util.delCookie('adIsShow');
        }
        if (vars.localStorage && (vars.localStorage.getItem('deDate') || vars.localStorage.getItem('cityName'))) {
            // 如果可以用localStorage并且存在deDate或者cityName属性，这删除这两个的localStorage值
            vars.localStorage.removeItem('deDate');
            vars.localStorage.removeItem('cityName');
        } else {
            // 不存在localStorage的话，使用cookie删除这两个值
            Util.delCookie('deDate');
            Util.delCookie('cityName');
        }
    }
    // 广告位的点击统计代码
    $news.on('click', 'a', function () {
        var pageUrl = document.URL;
        var href = $(this).attr('name');
        // 拼接统计代码地址
        var url = '/data.d?m=adtj&city=' + encodeURIComponent(encodeURIComponent(vars.zhcity)) + '&url=' + pageUrl + '&f=1';
        $.get(url, function () {
            window.location = href;
        });
    });

    /**
     * 新房统计
     * ！！！这里的统计作用是监听点击猜你喜欢用的
     * @param id 楼盘id
     */
    function xfTongjiUserlike(id) {
        $.ajax({
            url: '/data.d?m=houseinfotj&type=click&housefrom=ad&city=bj&housetype=xf&newcode=' + id + '&channel=wapindex_userlike'
        });
    }

    /**
     * 首页统计代码
     * ！！！这里的统计是监听点击猜你喜欢和黄金眼的
     * @param urlOrOther
     * @param type
     * @param channel
     * @param order
     * @param housetype
     * @param url
     */
    function indexTongJi(urlOrOther, type, channel, order, housetype, url) {
        // ！！！猜测下面一大串都是统计里面必须传的参数，而且为空的时候必须穿null
        var version = null,
            connMode = null,
            company = null,
            imei = Util.getCookie('global_cookie'),
            posMode = null,
            os = null,
            product = 'wap',
            // phone = null,！！！根本没有用到，我注释了
            agentid = null,
            userinfo = Util.getCookie('passport'),
            userid = null;
        if (userinfo) {
            // 如果存在用户信息，此信息是通过获取cookie的passport值得到的
            // 进行URI解码
            userinfo = decodeURIComponent(userinfo);
            // 通过userinfo的第一个带&分割符的字符串的带=分割符的第二个字符串的值，赋值userid
            userid = userinfo.split('&')[0].split('=')[1];
        }
        if (housetype === '') {
            // 如果housetype为空字符要把它设置为null
            housetype = null;
        }
        // 将所有的参数拼接为一个以';;'为分割符的字符串,！！！这里我有一个疑问，为什么要把null传过去，而无法传空，或者说我直接传undefined不行吗？
        var param = UA + ';;' + urlOrOther + ';;' + type + ';;' + channel + ';;' +
            order + ';;' + housetype + ';;' + version + ';;' + posMode + ';;' + connMode +
            ';;' + company + ';;' + imei + ';;' + Locate.ispos + ';;' + os + ';;' + product + ';;' +
            agentid + ';;' + userid;
        // 调用统计接口，！！！这里要特别注意，mrCity不能被city代替，接口需要的城市中，石家庄city为shijiazhuang但是mrCity为sjz，东莞city为东莞但是mrCity为dg
        $.get('/main.d?m=indexTj', {
            param: param,
            city: vars.mrCity
        }, function () {
            if (housetype === 'zf' && isMiuiYP) {
                // 判断楼盘为租房并且是小米黄页时，url加上相关参数，！！！由于murl和vars.mainSite只差了一个/，完全可以由mainStie代替
                url = vars.mainSite + 'zf/' + vars.city + '/';
            }

            /**
             * 黄金眼增加流量统计(channel === index_activity)  参数规则：ctm=a.b.c.d.e
             *  a：wap端为2；
             *  b：城市缩写；
             *  c：页面简称，由需求方指定 dsy 大首页简称；
             *  d：模块简称，由需求方指定 hjy 黄金眼简称；
             *  e：模块内链接按顺序自动获取，1,2,3,…..； ----对应order
             */
            if (channel === 'index_activity') {
                window.location = url + (/&|\?/.test(url) ? '&' : '?') + 'ctm=2.' + vars.mrCity + '.dsy.hjy.' + order + '&f=1';
            } else {
                window.location = url + (/&|\?/.test(url) ? '&' : '?') + 'f=1';
            }
        });
    }

    // 如果有黄金眼
    if (homeBan.length) {
        //
        /**
         * 事件委托方式监听黄金眼点击操作
         */
        homeBan.on('click', 'a', function () {
            var $ele = $(this);
            var params = $ele.attr('data-params').split(';');
            // 执行统计代码
            indexTongJi.apply(this, params);
        });
    }
    // 通过用户行为分析获取，新房、二手房和租房的相关权证
    require.async('jsub/_vb.js?c=mhomepage');
    // 通过用户行为分析获取，新房、二手房和租房的相关权证
    require.async('jsub/_ubm.js', function () {
        _ub.city = vars.zhcity;
        _ub.request('vmg.business', true);
        // 用户分析函数

        /**
         * 大数据分析
         * 猜你喜欢
         * 导航-知识入口
         * 地图入口
         * vmn.position : 新房区域商圈
         * vmn.subway : 新房地铁
         * vmn.genre : 新房物业类型
         * vme.position: 二手房区域商圈
         * vme.subway: 二手房地铁
         * vme.housetype : 二手房户型
         * vmz.position : 租房区域商圈
         * vmz.subway: 租房地铁
         * vmz.housetype: 租房户型
         * vmg.business: 用户行为 返回值代表的业务线：
         返回值     业务线
         G     通用
         N     新房
         E     二手房
         Z     租房
         H     家居
         X     小区网
         V     评估网
         W     国际网
         F     产业网
         L     土地网
         B     论坛
         A     问答
         K     知识
         I     资讯
         0     OA
         */
        _ub.onload = function () {

            seajs.emit('cacheData');

            /**
             * 猜你喜欢
             */
            // 获取新房搜索历史记录中的第一条（关键字或者快筛词），返回带有关键字或者快筛词和快筛词以及两者的搜索时间戳
            var rule = search.getRules(vars.city + 'newXfHistory');
             var xfScores = _ub.values['vmg.business'].N,
             esfScores = _ub.values['vmg.business'].E,
             zfScores = _ub.values['vmg.business'].Z;
             caiNiXiHuanListDataConfig.xfScores = xfScores,
             caiNiXiHuanListDataConfig.esfScores = esfScores,
             caiNiXiHuanListDataConfig.zfScores = zfScores;
             loupanListDataConfig.xfScores = xfScores,
             loupanListDataConfig.esfScores = esfScores,
             loupanListDataConfig.zfScores = zfScores;
            /**
             * 首页猜你喜欢访问数据埋码
             */
            _ub.city = vars.zhcity;
            _ub.biz = 'g';
            _ub.location = vars.ublocation;
            _ub.collect(1, {
                'vmg.usertype': xfScores + '^' + esfScores + '^' + zfScores,
                'vmg.page': 'mhomepage',
                'vmg.sourceapp':vars.is_sfApp_visit + '^home'
            });


            _ub.request('vmg.business,vmn.position,vmn.genre,vme.position,vme.housetype,vmz.housetype,vmz.position', function () {
                _ub.load(1);
                var business = _ub['vmg.business'];
                var xfXQ = _ub['vmn.position'],
                xfWY = _ub['vmn.genre'],
                esfQYSQ = _ub['vme.position'],
                esfHX = _ub['vme.housetype'],
                zfHX = _ub['vmz.housetype'],
                zfQYSQ = _ub['vmz.position'];
                caiNiXiHuanListDataConfig.xfXQ = xfXQ,
                caiNiXiHuanListDataConfig.xfWY = xfWY,
                caiNiXiHuanListDataConfig.esfQYSQ = esfQYSQ,
                caiNiXiHuanListDataConfig.esfHX = esfHX,
                caiNiXiHuanListDataConfig.zfHX = zfHX,
                caiNiXiHuanListDataConfig.zfQYSQ = zfQYSQ;
                loupanListDataConfig.xfXQ = xfXQ,
                loupanListDataConfig.xfWY = xfWY,
                loupanListDataConfig.esfQYSQ = esfQYSQ,
                loupanListDataConfig.esfHX = esfHX,
                loupanListDataConfig.zfHX = zfHX,
                loupanListDataConfig.zfQYSQ = zfQYSQ;
              
                // 取猜你喜欢ajax数据,前端展示数据
                var ajaxData = $.extend({
                    xfXQ: xfXQ,
                    xfWY: xfWY,
                    esfQYSQ: esfQYSQ,
                    esfHX: esfHX,
                    zfHX: zfHX,
                    zfQYSQ: zfQYSQ,
                    xfScores: xfScores,
                    esfScores: esfScores,
                    zfScores: zfScores,
                    city: vars.mrCity
                }, rule);
                var ajaxData2 = $.extend({
                    xfXQ: xfXQ,
                    xfWY: xfWY,
                    esfQYSQ: esfQYSQ,
                    esfHX: esfHX,
                    zfHX: zfHX,
                    zfQYSQ: zfQYSQ,
                    xfScores: xfScores,
                    esfScores: esfScores,
                    zfScores: zfScores,
                    loupan: 'loupan',
                    city: vars.mrCity
                }, rule);
                // 设置默认自营跳转页面地址
                if (vars.ziying && vars.ziying !== '-1') {
                    var arr = [xfScores, esfScores, zfScores];
                    var index = arr.indexOf(Math.max.apply(Math, arr));
                    // 判断大数据返回有数据
                    if (xfScores || esfScores || zfScores) {
                        // 判断是不是xfScores
                        if (!index) {
                            $('#wapdsy_D02_01_05').attr('href', vars.mainSite + 'xf/' + vars.city + '/?type=xfzy&hf=tab');
                        }
                    }
                }

                $.get('/main.d?m=xiHuanLouPanList2', ajaxData, function (result) {
                	// 获取猜你喜欢列表容器实例
                    var $caiNiXiHuanList = $('#caiNiXiHuanList');
                    if (result) {
                        
                        // ！！！猜测为获取在房产资讯中的一条特殊的资讯，估计是广告位
                        var behaviorBtn = $('.likeMore');
                        // 将获取的html字符串赋值给猜你喜欢容器
                        $caiNiXiHuanList.html(result);
                        require.async('app/1.0.0/appdownload', function () {
                            // 猜你喜欢下载
                            $('#appDown').openApp({
                                position: 'indexCnxh'
                            });
                        });
                        // 当信息大于猜你喜欢的最大值时，把换一换按钮显示出来
                        if ($caiNiXiHuanList.find('li').length > CaiNiXiHuanMAXSHOWNUM) {
                            var $huanhuanBtn = $homeOption.find('.huanhuan');
                            $huanhuanBtn.attr('data-count', 1).show();
                            $caiNiXiHuanList.find('li:lt(' + CaiNiXiHuanMAXSHOWNUM + ')').show();
                        }
                        if (behaviorBtn.length) {
                            // ！！！猜测为设置广告位的跳转地址根据用户行为不同
                            var arr = [xfScores, esfScores, zfScores];
                            var index = arr.indexOf(Math.max.apply(Math, arr));
                            if (index == '2') {
                                behaviorBtn.attr('href', vars.mainSite + 'zf/' + vars.mrCity + '/?f=1');
                            }
                            if (index == '1') {
                                behaviorBtn.attr('href', vars.mainSite + 'esf/' + vars.mrCity + '/?jhtype=esf&f=1');
                            }
                            if (index == '0') {
                                behaviorBtn.attr('href', vars.mainSite + 'xf/' + vars.mrCity + '/?f=1');
                            }
                        }



                        // $caiNiXiHuanList.find('img[data-original]').lazyload();
                        // 由于猜你喜欢是异步过程，当没有猜你喜欢加载时会导致页面长度变化使lazyload判读出现问题，所以在数据传回后执行lazyload
                        $caiNiXiHuanList.find('img.likeLazyload').lazyload();
                        // $caiNiXiHuanList.find('img[data-original]').each(function (index, element) {
                        //    loadImg($(element), 'cainixihuan');
                        // });

                        // 事件委托方式监听点击猜你喜欢各单条数据时的操作
                        $caiNiXiHuanList.on('click', 'a', function () {
                            var dataParams = $(this).attr('data-params');
                            if (dataParams) {
                                var params = dataParams.split(';');
                                // 猜你喜欢点击统计
                                xfTongjiUserlike(params[0]);
                                // 首页点击统计
                                indexTongJi.apply(this, params);
                            }

                        });
                    } else {
                        $caiNiXiHuanList.html('');
                        // 不存在猜你喜欢时，隐藏管理首页中的猜你喜欢设置显隐按钮
                        $('#xiHuan').html('');
                    }
                });
                $.get('/main.d?m=xiHuanLouPanList2', ajaxData2, function (result) {
                    var $loupanList = $('#loupanList');
                    if (result) {
                        // 将获取的html字符串赋值给猜你喜欢容器
                    	$loupanList.html(result);
                        // $caiNiXiHuanList.find('img[data-original]').lazyload();
                        // 由于猜你喜欢是异步过程，当没有猜你喜欢加载时会导致页面长度变化使lazyload判读出现问题，所以在数据传回后执行lazyload
                        $loupanList.find('img.likeLazyload').lazyload();
                        // $caiNiXiHuanList.find('img[data-original]').each(function (index, element) {
                        //    loadImg($(element), 'cainixihuan');
                        // });

                        // 事件委托方式监听点击猜你喜欢各单条数据时的操作
                        $loupanList.on('click', 'a', function () {
                            var dataParams = $(this).attr('data-params');
                            if (dataParams) {
                                var params = dataParams.split(';');
                                // 猜你喜欢点击统计
                                xfTongjiUserlike(params[0]);
                                // 首页点击统计
                                indexTongJi.apply(this, params);
                            }

                        });
                    } else {
                    	$loupanList.html('');
                        // 不存在猜你喜欢时，隐藏管理首页中的猜你喜欢设置显隐按钮
                        $('#xiHuan').html('');
                    }
                });
       
                /**
                 * 导航-知识入口
                 */
                // 业务线映射关系
                var businessObj = {
                    N: 'xf',
                    E: 'esf',
                    Z: 'zf',
                    H: 'jiaju'
                };

                // 判断业务线中是否为新房\二手房\租房\家居中一个,否则默认为新房
                if (!/^(N|E|Z|H)$/.test(business.toUpperCase())) {
                    business = 'N';
                }
                var zhishiIco = $('.n29');
                zhishiIco.add($('.zhishimore')).attr('href', vars.mainSite + 'zhishi/' + businessObj[business] + '/');

                /**
                 * 地图入口
                 */

                // https://m.test.fang.com/map/?c=map&a=zfMap&city=bj

                // 判断业务线中是否为新房\二手房\租房\家居中一个,否则默认为新房
                if (!/^(N|E|Z)$/.test(business.toUpperCase())) {
                    business = 'N';
                }

                var mapBtn = $('.mapbtn');
                mapBtn = mapBtn.add('.n10');
                if (mapBtn.length > 0) {
                    var url = vars.mainSite + 'map/?c=map&a=' + businessObj[business] + 'Map&city=' + vars.city;
                    mapBtn.attr('href', url);
                }
            });
        };
    });

    // 多重判断，如果一条成立，则设置cookie值clientdownshow_index为1
    // 为三星泰泽系统
    // ！！！为vivo合作
    // 通过客户端跳转
    // 是UC浏览器
    // 是qq浏览器
    // ！！！是客户端首页
    // ！！！是fwc合作
    // 是tg合作
    // 是百度app打开
    // 客户端打开并且produce值为soufun
    if (isTizen || lhl.indexOf('sf_source=bd_vivo_mz') > -1 || lh.indexOf('src=client') > -1 || lhl.indexOf('ucbrowser') > -1 ||
        lhl.indexOf('qqbrowser') > -1 || lhl.indexOf('clientindex.jsp') > -1 || lhl.indexOf('sf_source=fwc') > -1 ||
        lhl.indexOf('sf_source=tg') > -1 || lhl.indexOf('client') > -1 && vars.produce === 'soufun') {
        Util.setCookie(vars.cd_ver, '1');
    }
    // 判断是否有关闭广告按钮
    if ($closeAd.length) {
        // 绑定点击事件，点击关闭按钮操作
        $closeAd.on('click', function () {
            // ！！！隐藏navTpLoad节点，功能未知
            $('#navTpLoad').hide();
        });
    }
    // 如果城市是成都或者天津统计
    // 如果城市是武汉或者天津统计
    if (vars.city === 'wuhan') {
        require.async('//clickm.fang.com/click/new/clickm.js', function () {
            Clickstat.eventAdd(window, 'load', function () {
                Clickstat.batchEvent('wapdsy_','wuhanb');
            });
        });
        // 当是北京的合作首页时统计
    } else if ( vars.city === 'tj') {
        require.async('//clickm.fang.com/click/new/clickm.js', function () {
            Clickstat.eventAdd(window, 'load', function () {
                Clickstat.batchEvent('wapdsy_','tjb');
            });
        });
        // 都不是则普通统计
    }
    // 设置首页走势图
    // 获取走势图canvas宽度，！！！最开始用的是获取window的宽度，这里就存在一个问题，
    //  如果以pc的方式打开页面的话会出现走势图显示不全的情况，这个我没法忍，所以改成了获取页面类名为main节点的宽度
    var mainBox = $('.main'),
        curveW = mainBox.width(),
        // 获取需要显示的走势图数据数组
        cityPriceAndMonth = vars.cityDatas.split(';'),
        // 获取查房价容器实例
        $cfjList = $('#cfjList');
    // 当存在走势图需要的数据时
    if (cityPriceAndMonth.length > 1) {
        // 显示查房价列表
        $cfjList.show();
        // 查房价走势图下面的热门商圈轮播
        var $pgScroller = $('#pgScroller');
        if ($pgScroller.length > 0) {
            // 获取轮播容器所有的li子节点
            var pgScrollerLiArr = $pgScroller.find('li');
            // 获取每个li子节点长度
            var width = 0;
            pgScrollerLiArr.each(function (index, ele) {
                // 由于获取的高度会四舍五入,所以每个li加0.5px容错,保证ul宽度够宽
                width += $(ele).outerWidth() + 0.5;
            });
            // 赋值给滑动容器宽度
            $pgScroller.width(width);
            // 初始化滑动插件
            var ss = new IScrollLite('#pgSlider', {
                // 开启横向滑动
                scrollX: true,
                // 禁止纵向滑动
                scrollY: false,
                // 滑动为其本身，这里的作用是防止禁用掉整个文档流的默认事件导致的bug
                bindToWrapper: true,
                // 可以纵向滑动，默认能够穿过
                eventPassthrough: true
            });
            ss.refresh();
        }
        // 获取月份数组
        var cityMonths = cityPriceAndMonth[0].split(',');
        // 获取房价数组
        var cityPrices = cityPriceAndMonth[1].split(',');
        // 储存走势图需要的数据的数组
        var priceData = [];
        // 数据个数
        var num = cityMonths.length;

        // 循环获取走势图需要的数据，拼接成能够被走势图插件识别的数据格式
        for (i = 0; i < num; i++) {
            priceData.push({
                name: cityMonths[i],
                value: cityPrices[i]
            });
        }
        // 初始化走势图插件
        new Line({
            width: curveW,
            height: 200,
            data: [priceData]
        });
        // 不存在走势图就隐藏查房价列表
    } else {
        $cfjList.hide();
    }
    // 获取localStorage中的home_private_custom数据，如果存在，则执行统计
    var commonStr = vars.localStorage && vars.localStorage.getItem(vars.city + 'home_private_custom');
    if (commonStr) {
        // 执行统计
        $.post('/tongji.d?m=indexTongji', {
            city: vars.city,
            str: commonStr
        });
    }

    // 房天下推荐
    var guide = $('#guide'),
        dataNum = guide.attr('data-num') | 0;
    if (dataNum > 1) {
        new Swiper('#guide', {
            speed: 800,
            autoplay: 3000,
            loop: true,
            direction: 'vertical'
        });
    }

    // 特价房
    var tjf = $('.home-tjf');
    if (tjf.length) {
        var tjfUl = tjf.find('ul'),
            tjfLi = tjf.find('li'),
            tjfLiLen = tjfLi.length,
            tjfLiWidth = (tjfLi.outerWidth() + parseInt(tjfLi.css('marginRight'))) * tjfLiLen + parseInt(tjfUl.css('paddingLeft'));
        tjfUl.css('width', tjfLiWidth);
        // 初始化滑动插件
        var tjfScroll = new IScrollLite('.home-tjf', {
            // 开启横向滑动
            scrollX: true,
            // 禁止纵向滑动
            scrollY: false,
            // 滑动为其本身，这里的作用是防止禁用掉整个文档流的默认事件导致的bug
            bindToWrapper: true,
            // 可以纵向滑动，默认能够穿过
            eventPassthrough: true
        });
        tjfScroll.refresh();
    }


    // 事件委托方式，点击换一换按钮操作
    $customList.on('click', '.huanhuan', function () {
        var $this = $(this),
            $parent = $this.closest('section'),
            $thisLi = $parent.children('ul').find('li'),
            liLength = $thisLi.length,
            count = 0;
        // 所有具有换一换功能的列表默认显示5条数据
        var flagNum = 5;
        // decorationList也就是装修美图显示六张图，房产知识、房产资讯、房产问答显示三条数据
        switch ($parent.attr('id')) {
            case 'decorationList':
                flagNum = 6;
                break;
            case 'zhishiList':
            case 'newsList':
            case 'askList':
                // @20151201 大首页需求，大城市房产知识、房产资讯、房产问答显示3条数据，小城市显示5条
                flagNum = vars.numFlag ? 3 : 5;
                break;
        }
        // 判断是否含有data-count，如果不存在则为第一次点击换一换，设置count为1
        if ($this.attr('data-count')) {
            count = parseInt($this.attr('data-count'));
        } else {
            count++;
            $this.attr('data-count', count);
        }

        /**
         * 循环遍历所有在当前列表内容中的li节点，判断要换的一组li并显示，隐藏其他li
         * by tankunpeng 2016/11/09 修改当前显示li的下一个隐藏li为for循环开始位置,解决最后一个换一换页面点击下滑问题
         */
        for (i = count * flagNum; i < liLength + count * flagNum; i++) {
            var $li = $thisLi.eq(i % liLength);
            // 当li的索引大于切换次数乘以一次显示的基数，并且小于下一次切换次数乘以显示基数时显示，否者隐藏
            if (i % liLength >= count * flagNum && i % liLength < (count + 1) * flagNum) {
                $li.show();
            } else {
                $li.hide();
            }
        }
        var img = $thisLi.find('img[data-original]:visible');
        img.lazyload();
        count++;
        // 如果总数量大于了最大的数据条数，则重置
        if (count * flagNum >= liLength) {
            count = 0;
        }
        $this.attr('data-count', count);
    });
    // 如果是凤凰合作首页，隐藏浮动下载app
    if (vars.sf_source === 'ifeng_bd') {
        $('.floatApp').hide();
    }

    // 下载弹层
    require.async('app/1.0.0/appdownload', function () {

        // 公共底部下载按钮
        $('.appDown').openApp();

        // 小城市顶部下载按钮
        $('#headerTop .icon-down').openApp({
            position: 'indexTopBtn'
        });

        // 无广告时banner图点击下载
        $('#navAcLoad').openApp();

        // 底部logo下载
        $('#appIcons .n1').openApp({
            position: 'indexBottomLogo'
        });

        // 顶部弹层
        $('#jdh').openApp({
            position: 'indexTopBtn'
        });
    });
    // 如果是合作页，并且带有bd标识，！！！猜测为百度合作
    if (vars.sf_source && vars.ifContains) {
        // 加载轻应用相关的js
        $('head').append('<script type="text/javascript" name="baidu-tc-cerfication"  data-appid="5282730" src="http://apps.bdimg.com/cloudaapi/lightapp.js"></script>');
    }
    //  ！！！这里开始是有监听scroll再加载图片的我觉得完全没有必要，直接加载图片就好了，因为换一换功能不会触发惰性加载所以图片应该尽量直接先加载
    $('img.lazyload').lazyload();
    // 禁用屏幕滑动
    var allowMove = true;
    $(window).on('touchmove', function (ev) {
        if (!allowMove) {
            ev.preventDefault();
        }
    });
    // 成交详情弹层
    var messageBtn = $('.messageBtn'),
        floatMessage = $('#floatMessage'),
        gotMessage = $('.gotMessage');
    messageBtn.on('click', function () {
        allowMove = false;
        floatMessage.show();
    });
    gotMessage.on('click', function () {
        allowMove = true;
        floatMessage.hide();
    });

    // 百度合作页面跳转到房价详情
    if (/s=bdfj/.test(lh)) {
        setTimeout(function () {
            $('html,body').animate({
                scrollTop: $('#fjxq').offset().top - headerTopH
            }, 800);
        }, 500);
    }
	 $('#bigNav,#zuji').on('click', 'a', function (e) {
				e.preventDefault();
            var navName = $(this).attr('fname');
			var navHref = $(this).attr('href');
            var navHistory = vars.localStorage.getItem('navHistory') || '';
            var ssarr = [];
            if (!navHistory&&navName!='直销') {
                navHistory = navName;
            } else if(navName!='直销'){
                ssarr = navHistory.split(';');
                var i;
                for (i = 0; i < ssarr.length; i++) {
                    if (ssarr[i].indexOf(navName) >= 0) {
                        ssarr.splice(i, 1);
                    }
                }
				var ssarrLen = vars.zhiXiaoCity === 'true'?'1':'2';
                if (ssarr.length > ssarrLen) {
                    ssarr.pop();
                }
                ssarr.unshift(navName);
                var ss = '';
                for (i = 0; i < ssarr.length; i++) {
                    ss += ssarr[i] + ';';
                }
                navHistory = ss.substring(0, ss.length - 1);
            }
           vars.localStorage.setItem('navHistory', navHistory);
		   location.href = navHref;
        });

		var navHistory = vars.localStorage.getItem('navHistory') || '';
		var zuijin = $('#zuijin');
        if (!navHistory) {
		var navItem = '直播';
        if(vars.topCity === 'true'){
			navItem += ';排行榜';
		}		
            vars.localStorage.setItem('navHistory', navItem);
            navHistory = vars.localStorage.getItem('navHistory') || '';  
	   }
		    var navArr = navHistory.split(';');
                if (navArr.length > 0) {
				var navArrLen = vars.zhiXiaoCity === 'true'?'2':'3';
                if (navArr.length > navArrLen) {
                    navArr.pop();
				}
				 var ss = '';
                for (i = 0; i < navArr.length; i++) {
					var zjHref = $("[fname='"+navArr[i]+"']").attr('href');
				if(zjHref){	
                    ss += navArr[i] + ';';
                }
				}
                navHistory = ss.substring(0, ss.length - 1);
				 vars.localStorage.setItem('navHistory', navHistory);
                
                for (var i = 0; i < navArr.length; i++) {
                    if (navArr[i]) {               
                       var zjHref = $("[fname='"+navArr[i]+"']").attr('href'),address;	
                         if(zjHref){					   
                            address = '<span><a href="' + zjHref + '" fname="'+navArr[i]+'" >'+navArr[i]+'</a></span>';   
                            zuijin.append(address);							
						 }							
                       
                    }
                }
				if(vars.zhiXiaoCity === 'true'){	
			zuijin.append('<span><a href="'+vars.mainSite+'esf/'+vars.city+'/?cstype=ds&type=esfzy&hf=tab" fname="直销" >直销</a></span>');
				}
				if($('#zuijin').find('span').length===0){
				zuijin.append('<span><a href="http://live.fang.com/liveshow/index/list/?city='+vars.city+'" fname="直播" >直播</a></span>');	
				}
			}
              
                // 列表切换
                channelTab.on('click', function () {
                    var $this = $(this);
                    if ($this.hasClass('cur')) {
        				$this.removeClass('cur');
        				vars.localStorage.setItem('indexTab','caiNiXiHuanList');
        				
        			} else {
        				channelTab.removeClass('cur');
        				$this.addClass('cur');	
        			vars.localStorage.setItem('indexTab',$this.attr('value'));
        			}
                    indexTab = vars.localStorage.getItem('indexTab')||'caiNiXiHuanList'; 
                    $('.homeList').find('ul').each(function () {
                        var $this = $(this);
                     if($this.attr('id')===indexTab){
                    	 $this.show(); 
                    	 options.contentID='#'+$this.attr('id');
                    	 switch($this.attr('id')){
                    	 case 'caiNiXiHuanList':
                    		 options.ajaxData= caiNiXiHuanListDataConfig;
                    		 options.total = Number($('#loupanTotalPage').html());
                    		 showMoreBtn();
                    		 break;
                    	 case 'loupanList':
                    		 options.ajaxData= loupanListDataConfig;
                    		 options.total = Number($('#loupanTotalPage').html());
                    		 showMoreBtn();
                    		 break;
                    	 case 'zixunList':
                    		 options.ajaxData= zixunListDataConfig;
                    		 options.total = Number($('#zixunTotalPage').html());
                    		 showMoreBtn();
                    		 break;
                    	 case 'wendaList':
                    		 options.ajaxData= wendaListDataConfig;
                    		 options.total = 50;
                    		 showMoreBtn();
                    		 break;
                    	 case 'zhishiList':
                    		 options.total = 1;
                    		 hideMoreBtn();
                    		 break;                    		 
                    	 case 'meituList':
                    		 options.ajaxData= meituListDataConfig;
                    		 options.total = Number($('#meituTotalPage').html());
                    		 showMoreBtn();
                    		 break;
                    	 }
                  
                    	 
         				 
                     }else{
                    	 $this.hide(); 
                     }
                    });
                   
                });
              
                $('a[value="'+indexTab+'"]').addClass('cur');
                $('.homeList').find('ul').each(function () {
                    var $this = $(this);
                 if($this.attr('id')===indexTab){
                	 $this.show(); 
                	 options.contentID='#'+$this.attr('id');
                	 switch($this.attr('id')){
                	 case 'caiNiXiHuanList':
                		 options.ajaxData= caiNiXiHuanListDataConfig;
                		 options.total = Number($('#loupanTotalPage').html());
                		 showMoreBtn();
                		 break;
                	 case 'loupanList':
                		 options.ajaxData= loupanListDataConfig;
                		 options.total = Number($('#loupanTotalPage').html());
                		 showMoreBtn();
                		 break;
                	 case 'zixunList':
                		 options.ajaxData= zixunListDataConfig;
                		 options.total = Number($('#zixunTotalPage').html());
                		 showMoreBtn();
                		 break;
                	 case 'wendaList':
                		 options.ajaxData= wendaListDataConfig;
                		 options.total = 50;
                		 showMoreBtn();
                		 break;
                	 case 'zhishiList':
                		 options.total = 1;
                		 break;
                	 case 'meituList':
                		 options.ajaxData= meituListDataConfig;
                		 options.total = Number($('#meituTotalPage').html());
                		 showMoreBtn();
                		 break;
                	 }
     				
     				 
                 }else{
                	 $this.hide(); 
                 }
                });
             
               
                // 加载更多和点击加载按钮是否为同一个
                if (options.loadPromptID === options.moreBtnID) {
                    $loadPrompt = $moreBtn;
                    loadMoreFlag = true;
                } else {
                    $loadPrompt = $(options.loadPromptID);
                }
                // 如果总信息数少于第一屏显示的最大数时，则隐藏查看更多楼盘按钮并且不进行ajax请求
                if (parseInt(options.total) < 2) {
                	hideMoreBtn();
                }
function hideMoreBtn(){
	 $moreBtn.hide();
     $loadPrompt.hide();
     loadFlag = false;
}
function showMoreBtn(){
	 $moreBtn.show();
    loadFlag = true;
}
               

                /**
                 * 绑定点击事件，点击加载更多按钮执行加载更多
                 */
                $moreBtn.on('click', function () {
                    if (loadFlag) {
                        loadMore();
                    }
                });

                /**
                 * 加载更多函数
                 */
                function loadMore() {
                    loadFlag = false;
                    if (loadMoreFlag) {
                        $moreBtn.find('a').css({background: 'url('+vars.public+'images/loader.gif) 20px 50% no-repeat'}).html('正在加载...');
                    }
                   
                    $moreBtn.hide();
                    $loadPrompt.show();
                    $.ajax({
                        type: 'POST',
                        url: options.ajaxUrl,
                        data: options.ajaxData ,
                        datatype: 'json',
                        success: function (data) {
                        	$(options.contentID).append(data);
                        	$(options.contentID).find('img[data-original]').lazyload();
                            if (loadMore) {
                                $moreBtn.find('a').css({background: ''}).html(moreText);
                            }
                            $loadPrompt.hide();
                            $moreBtn.show();
                            options.ajaxData.p++;
                            if (options.ajaxFn) {
                                for (var ajaxfn in options.ajaxFn) {
                                    options.ajaxFn[ajaxfn].init();
                                }
                            }
                            loadFlag = true;
                            if (options.ajaxData.p > parseInt(options.total) || options.ajaxData.p == 1) {
                                loadFlag = false;
                                $moreBtn.hide();
                                $loadPrompt.hide();
                            }
                        }
                    });
                }
                
});