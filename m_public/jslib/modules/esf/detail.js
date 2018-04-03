/**
 * 二手房详情页主类
 * by blue
 * 20150929 blue 代码重构，优化效率，删除没用的代码，将点击搜索按钮功能修改为重构后的搜索
 * 201501219 刘新路 ui改版
 */
define('modules/esf/detail', ['jquery', 'chart/line/1.0.2/line', 'modules/esf/yhxw', 'lazyload/1.9.1/lazyload',
    'superShare/1.0.1/superShare', 'weixin/2.0.0/weixinshare','chart/pie/1.0.0/pie', 'modules/tools/mvc/model/Calculate',
    'iscroll/2.0.0/iscroll-lite', 'util/util', 'bgtj/bgtj'],
    function (require, exports, module) {
    'use strict';
    module.exports = function () {
        // jquery库
        var $ = require('jquery');
        var cookiefile = require('util/util');
        // 修改租房详情页点击导航栏按钮后导航栏的头部显示不出来 原因是样式中opacity设置为0
        $('#newheader').css('opacity', 1);
        // 页面传入的参数
        var vars = seajs.data.vars,
        // 用于热combo的数组
            preLoad = [],
        // 电话联系及打电话按钮实例
            $telBtn = $('.tj-tel'),
        // 给我留言按钮实例
            $leaveMsgBtn = $('.tj-chat, .tj-mes'),
        // 收藏按钮实例
            $collectBtn = $('.btn-fav, .icon2'),
        // 预约看房弹窗
            $scSuc = $('#scSuc'),
        // 直约业主按钮实例
        // $zyyz = $('.zyyz, .zybtn'),
            $zyyz = $('.zyyz'),
        // 倒计时秒数
            timeCount = 60,
        // 未登录弹出框
            $loginBox = $('#loginBox'),
        // 获取验证码按钮
            $codeBtn = $('#getCode'),
        // 验证码内容
            $codeCon = $('.vcode'),
        // 电话号码
            $telNo = $('.phone'),
        // 错误提示框
            $msgBox = $('#MsgBox'),
        // 登陆框标题
            $boxTit = $('#boxTit'),
        // 虚假举报按钮
            $report = $('#report'),
        // 验证手机号码
            patternTel = /^1[34578]\d{9}$/,
        // 验证验证码
            patternCode = /^\d{4}$/,
        // 收藏提示实例
            $collectMsg,
        // 自动拨打标识
            autoCall,
        // 轮播js
            Swiper = require('swipe/3.10/swiper');
        // 插入分享js,动轮播插件,插入走势图1.0.2插件,插入app下载浮层js
        preLoad.push('app/1.0.0/appdownload');
        // 如果可以使用localStorage，则插入查看历史和收藏功能js
        var iscrollNew = require('iscroll/2.0.0/iscroll-lite');
        var UA = navigator.userAgent.toLowerCase();
        if (vars.localStorage) {
            preLoad.push('modules/esf/viewhistory', 'fav/1.0.0/fav');
        }
        // 非佣金0.5%的页面引入,房源评价弹窗
        if (vars.housetype === 'WAGT' || vars.housetype === 'AGT') {
            preLoad.push('modules/esf/report');
        }
        // 加载所需的js
        require.async(preLoad);

        

        // 二手房详情页图片增加惰性加载功能 modified by zdl
        require('lazyload/1.9.1/lazyload');
        $('.lazyload').lazyload();
        // 详情页轮播的图片加载之前显示loader的图片 lina 20170122
        var $imgs = $('.swiper-wrapper').find('.lazyload');
        if ($imgs.length) {
            imgWidth = $(document).width();
            imgWidth = imgWidth > 640 ? 640 : imgWidth;
            $imgs.css('height', imgWidth * 0.75);
            $('#loading').hide();
            $('.xqfocus').find('ul').show();
        }
        // 画饼状图 lina
        if($('#pieCon').length){
            require.async('chart/pie/1.0.0/pie',function(pie){
               var dataList = JSON.parse(vars.jiajuJson);
                var arr = [];
                for(var key in dataList){
                    arr.push(dataList[key]);
                }
                var p = new pie({
                    //容器id
                    id: '#pieCon',
                    animateType:'increaseTogether',//效果类型，暂时只有这一种需要其他类型再扩展
                    // canvas的高
                    height:100,
                    // canvas的宽
                    width:100,
                    //半径
                    radius:100,
                    //分割份数，即增量的速度
                    part:50,
                    //空白间隔的大小
                    space:2,
                    //是否挖空，如果为0则不挖空，否则为挖空的半径
                    hollowedRadius:50,
                    dataArr: arr
                });
                p.run();
            });
        }

        /**
         * 点击头部导航按钮 by lina 20160914
         */
        $('.icon-nav').on('click', function () {
            $('#newheader').css('opacity', 1);
            var scrollTop = $(window).scrollTop();
            var opa = parseInt(1 - scrollTop / 150);
            $('.focus-opt').find('a').css('opacity', opa);
        });
        function preventDefault(e) {
            e.preventDefault();
        }

        /**
         * 手指滑动时阻止浏览器默认事件(阻止页面滚动）
         */
        function unable() {
            window.addEventListener('touchmove', preventDefault, { passive: false });
        }

        /**
         * 手指滑动恢复浏览器默认事件（恢复滚动
         */
        function enable() {
            window.removeEventListener('touchmove', preventDefault, { passive: false });
        }

        // 点击全景看房图标进入全景看房
        $('.play360').on('click', function () {
            window.location = vars.panoramic;
        });
        // ++++++++++++根据地图图片的实际宽高比例设置显示比例 modified by zdl
        // 用于存放地图原始尺寸的高宽比例
        var ratio = 130 / 300;
        // 获取xqMapdiv的宽度
        var $xqMapClass = $('.xqMap');
        var imgWidth = $xqMapClass.width();
        // 根据比例设置图片的高度
        $xqMapClass.find('img').height(parseInt(imgWidth * ratio));

        /**
         * 点击页面中的更多标签相关展示效果
         */
        // 附近信息更多按钮实例
        var $moreBtn = $('.more_xq'),
        // 房源详情等含有更多按钮内容展示的第一条div
            $moreXq = $('.xqIntro');

        function clickMoreBtn() {
            // 是否显示展开按钮
            $moreXq.each(function () {
                var el = $(this);
                var moreBtn = el.siblings('.more_xq');
                var pHeight = parseInt(el.children('div').height());
                var maxHeight = parseInt(el.css('max-height'));
                if (pHeight > maxHeight) {
                    moreBtn.show();
                }
            });
            // 页面展示更多效果（AGT和WAGT走下面的功能）
            $moreBtn.not('.classification').on('click', function () {
                var el = $(this);
                el.toggleClass('up');
                var xqIntro = el.siblings('.xqIntro');
                if (el.hasClass('up')) {
                    xqIntro.addClass('all');
                } else {
                    xqIntro.removeClass('all');
                }
            });
        }

        if ($moreBtn.length && $moreXq.length) {
            clickMoreBtn();
        }
        /**
         *  电商房源详情页，如果cookie中带有sf_source字段，则获取400电话，写入页面并传给vars数组
         *  (因为zf列表页和详情页的php页面都有缓存,所以需要使用js去动态获取400电话)
         */
        // 不再对D类房源判断sf_source 娄沛业20160513修改
        if ('A' === vars.housetype) {
            require.async('util/util', function (util) {
                var sfSource = util.getCookie('sf_source') || util.getCookie('s');
                var agentId;
                if (sfSource) {
                    $.ajax({
                        url: vars.esfSite + '?c=esf&a=ajaxGet400Number',
                        data: {
                            houseid: vars.houseid,
                            sfSource: sfSource
                        },
                        success: function (data) {
                            if (data) {
                                // 将所有电话号码数组传入vars以备使用
                                vars.sfAgent = data;
                                // 更换用户评论列表中所有的400电话
                                $('.user-list,.info').each(function () {
                                    var el = $(this);
                                    agentId = $(this).attr('agentid');
                                    el.find('p:last').text('电话：' + data[agentId]);
                                });
                            }
                        }
                    });
                }
            });
        }

        /**
         * 在字符串中截取需要的属性数据
         * @param str 字符串数据
         * @param name 需要获取的属性
         * @returns {*}
         */
        function getParam(str, name) {
            var paraString = str.split(';'),
                paraStringL = paraString.length,
                paraObj = {},
                i = 0,
                j = '';
            for (; i < paraStringL; i++) {
                j = paraString[i];
                paraObj[j.substring(0, j.indexOf('~')).toLowerCase()] = j.substring(j.indexOf('~') + 1, j.length);
            }
            return paraObj[name];
        }
        // 用户行为对象
        var yhxw = require('modules/esf/yhxw');
        //进页面判断用户行为来源。其他的用户行为运营在考虑，暂时用之前的不变
        var pageId = 'mesfpage';
        if (vars.housetype === 'AGT' || vars.housetype === 'WAGT') {
            if (vars.purpose === '住宅') {
                pageId = 'esf_fy^xq_wap';
            } else if (vars.purpose === '别墅') {
                pageId = 'esf_fy^bsxq_wap';
            } else if (vars.purpose === '商铺') {
                pageId = 'esf_fy^spxq_wap';
            } else if (vars.purpose === '写字楼') {
                pageId = 'esf_fy^xzlxq_wap';
            }
        } else if (vars.housetype === 'A') {
            if (vars.purpose === '住宅') {
                pageId = 'esf_fy^dsxq_wap';
            } else if (vars.purpose === '别墅') {
                pageId = 'esf_fy^dsbsxq_wap';
            } else if (vars.purpose === '商铺') {
                pageId = 'esf_fy^dsspxq_wap';
            } else if (vars.purpose === '写字楼') {
                pageId = 'esf_fy^dsxzlxq_wap';
            }
        } else if (vars.housetype === 'D') {
            if (vars.purpose === '住宅') {
                pageId = 'esf_fy^wtxq_wap';
            } else if (vars.purpose === '别墅') {
                pageId = 'esf_fy^wtbsxq_wap';
            }
        } else if (vars.housetype === 'JX') {
            if (vars.purpose === '商铺') {
                pageId = 'esf_fy^grspxq_wap';
            } else if (vars.purpose === '写字楼') {
                pageId = 'esf_fy^grxzlxq_wap';
            }
        }
        
        // 用户行为收集(浏览)
        if (!vars.guessFavorite) {
            yhxw({pageId: pageId});
        } else {
            require.async(['jsub/_ubm.js'], function () {
                _ub.request('vme.district，vme.comarea,vme.totalprice,vme.housetype', function () {
                    var datas = {
                        district: _ub['vme.district'],
                        comarea: _ub['vme.comarea'],
                        totalprice: _ub['vme.totalprice'],
                        housetype: _ub['vme.housetype']
                    };
                    $.ajax({
                        url: vars.esfSite + '?c=esf&a=ajaxGetTuiJianList',
                        data: datas,
                        success: function (data) {
                            if (data) {
                                var $guess = $('.xqMain');
                                $guess.append(data);
                            }
                        }
                    });
                });
            });
        }

        // 判断用户是否对该房源进行了收藏，相应修改收藏样式
        require.async('util/util',function(util) {
               if (!(vars.isshare === 'share' && (vars.housetype === 'AGT' || vars.housetype === 'WAGT')) && util.getCookie('sfut')) {
                       $.ajax({
                           url: vars.mySite + '?c=mycenter&a=isAlreadySelect',
                           data:{
                               city:vars.city,
                               houseid: vars.houseid,
                               projcode: vars.plotid,
                               purpose: vars.purpose,
                               channel: 'esf',
                               url:document.location.href
                           },
                           success: function(data) {
                               if (data.result_code === '100' || data.resultcode === '100') {
                                   if (vars.houseSource === 'DS' && vars.housetype === 'A' && !vars.isshare) {
                                       $collectBtn.addClass('on');
                                   } else {
                                       $collectBtn.addClass('btn-faved cur');
                                   }
                               }
                       }
                   });
               }
            });

        if (vars.localStorage) {
            // 浏览历史功能初始化
            require.async('modules/esf/viewhistory', function (a) {
                a.record(vars.houseid);
            });
        }

        if (vars.fromsource === 'jjfdetail') {
            if (vars.jsJjfDatacount && vars.jsJjfDatacount == 1) {
                var jsJjfDatacount = 1;
                var showrun = 1; //用来标记非1的时候不画图
            } else if (vars.jsJjfDatacount && vars.jsJjfDatacount < 6) {
                var jsJjfDatacount = vars.jsJjfDatacount -1;
                var showrun = 2;
            } else {
                var jsJjfDatacount = 5;
                var showrun = 2;
            }
            //折线图
            require.async('chart/line/1.0.8/line', function () {
                var Line = require('chart/line/1.0.8/line');
                var options = {};
                if (vars.jsJjfData) {
                    var jsJjfData = $.parseJSON(vars.jsJjfData);
                    options = {
                        type: 'line',
                        from: 'jjfdetail',
                        lineStyle: 'solid',
                        // 走势图容器id
                        id: '#line',
                        // 能够滑动的最小数据量
                        scrollNumber: jsJjfDatacount,
                        // 走势图左右区域的间隔
                        border: 80,
                        startIndex: 12,
                        step: true, //梯形图
                        runTime: 1000,
                        width: $(window).width() - 20,
                        xAxis: jsJjfData['xAxis'],
                        series: [{
                            color: 'rgb(248,157,5)',
                            yAxis: jsJjfData['yAxis']
                        }],
                        pointRadis: 6,
                        xBg: true,
                        yBg: false,
                    };
                }
                var line = new Line(options);
                if (showrun && showrun !== 1) {
                    line.run();
                } else {
                    line.run(0);
                }
            });
            //走势图点击收起展开
            $('#zoushitu').on('click', function () {
                var that = $(this);
                if (that.hasClass('arr-up')) {
                    that.removeClass('arr-up').addClass('arr-down');
                    $('.jjfydj').hide();
                    $('.line').hide();
                } else {
                    that.removeClass('arr-down').addClass('arr-up');
                    $('.jjfydj').show();
                    $('.line').show();
                }
            });
            //头图横切
            var jjfUl = $('.jjfy-list');
            if (jjfUl.length) {
                var $lis = jjfUl.find('li'),
                    jjfLiLen = $lis.length;
                // css li margin值为15px
                jjfUl.find('ul').width($lis.eq(0).width() * jjfLiLen + jjfLiLen * 11);
                new iscrollNew('.jjfy-list', {scrollX: true});
            }

        }

        /* 分享代码*/
        var shareA = $('.share');
        if (shareA.length) {
            // 分享操作用户行为统计
            shareA.click(function () {
                yhxw({type: 22, pageId: 'mesfpage'});
            });
            var SuperShare = require('superShare/1.0.1/superShare');
            var Stitle,
                Sdesc,
                Simg;
            if (vars.fromsource === 'jjfdetail') {
                Stitle = vars.jjfShareTitle;
                Sdesc = vars.jjfShareDescription;
                Simg = vars.jjfShareImages;
            } else if (vars.isshare === 'share') {
                Stitle = shareA.attr('newsline');
                Sdesc = '我在房天下上看到一套不错的二手房';
                Simg = shareA.attr('imgpath');
            } else {
                Stitle = '【我在房天下上看到一套不错的二手房】 ' + (shareA.attr('newsline') || '') + '【大家快来帮我参考一下吧！】';
                Sdesc = shareA.attr('newssummary').substring(0, 64) + '...';
                Simg = shareA.attr('imgpath');
            }
            var config = {
                // 分享内容的title
                title: Stitle,
                // 分享时的图标
                image: window.location.protocol + Simg,
                // 分享内容的详细描述
                desc: Sdesc,
                // 分享的链接地址
                url: location.href,
                // 分享的内容来源
                from: ' 房天下' + vars.cityname + '二手房'
            };
            new SuperShare(config);

            // 微信分享
            var Weixin = require('weixin/2.0.0/weixinshare');
            if (vars.fromsource === 'jjfdetail') {
                var wx = new Weixin({
                    debug: false,
                    shareTitle: Stitle,
                    // 副标题
                    descContent: Sdesc,
                    lineLink: location.href,
                    imgUrl: window.location.protocol + Simg,
                    swapTitle: false
                });
            } else {
                var wx = new Weixin({
                    debug: false,
                    shareTitle: shareA.attr('newsline'),
                    // 副标题
                    descContent: '我在房天下上看到一套不错的二手房',
                    lineLink: location.href,
                    imgUrl: window.location.protocol + Simg,
                    swapTitle: false
                });
            }
        }
        // 当页面从sfapp中打开时，设置foot底部增加50外边距，该id在public/inc.footer.html中找到
        $('#foot').css('margin-bottom', '50px');
        // 控制图片的宽高比
        // 顶部图片滑动效果
        if ($imgs.length) {
            // 顶部图片滑动效果
            var totalSlider = vars.sum;
            if (totalSlider > 1) {
                Swiper('#slider', {
                    loop: true,
                    onSlideChangeStart: function (swiper) {
                        var activeIndex = swiper.activeIndex;
                        // 右滑
                        if (activeIndex === 0) {
                            activeIndex = totalSlider;
                            // 左滑
                        } else if (activeIndex > totalSlider) {
                            activeIndex = 1;
                        }
                        $('#pageIndex').text(activeIndex);
                    }
                });
            }
        }

        /**
         * 委托房源点击咨询
         * @param zhcity
         * @param city
         * @param housetype
         * @param houseid
         * @param newcode
         * @param type
         * @param phone
         * @param channel
         * @param uname
         * @param aname
         * @param agentid
         * @param order
         * @param photourl
         * @param housefrom
         */
        function chatWeituo(zhcity, city, housetype, houseid, newcode, type, phone, channel, uname, aname, agentid, order, photourl, housefrom) {
            var xiaoqu = vars.xiaoqu || '';
            var room = vars.room || '';
            var price = vars.price || '';
            var url = '/data.d?m=houseinfotj&city=' + city + '&housetype='
                + housetype + '&houseid=' + $.trim(houseid) + '&newcode=' + $.trim(newcode)
                + '&type=' + type + '&phone=' + $.trim(phone) + '&channel=' + $.trim(channel) + '&agentid='
                + $.trim(agentid) + '&order=' + order + '&housefrom=';
            if ('A' === vars.housetype || 'D' === vars.housetype) {
                if (vars.localStorage) {
                    vars.localStorage.setItem(uname, encodeURIComponent(aname) + ';' + photourl
                        + ';' + encodeURIComponent(xiaoqu + '的' + room + '价格为' + price + '的电商'));
                }
            } else if (vars.localStorage) {
                vars.localStorage.setItem(uname, encodeURIComponent(aname) + ';' + photourl
                    + ';' + encodeURIComponent(xiaoqu + '的' + room + '价格为' + price + '的委托')
                    + ';' + vars.mainSite + 'agent/' + vars.city + '/' + vars.agentid + '.html');
            }

            if (vars.localStorage) {
                vars.localStorage.setItem(uname + '_allInfo', encodeURIComponent(vars.title) + ';'
                    + encodeURIComponent(vars.price + '万元') + ';' + encodeURIComponent(vars.tags.replace(/(\s*$)/g, ''))
                    + ';' + vars.titleimg + ';' + encodeURIComponent(vars.room_hall_area) + ';'
                    + encodeURIComponent(vars.district_name + '-' + vars.projname) + ';https:' + vars.esfSite + vars.city + '/'
                    + housefrom + '_' + vars.houseid + '.html');
            }
            if (vars.hasOwnProperty('from') && vars.from.length > 0) {
                url += vars.from + '&product=soufun';
            } else {
                url += housefrom;
            }
            $.ajax(url);
            var paramPurpose = '';
            if ($.trim(vars.purpose) === '写字楼') {
                paramPurpose = 'xzl';
            } else if ($.trim(vars.purpose) === '商铺') {
                paramPurpose = 'sp';
            }
            setTimeout(function () {
                var imHref = '/chat.d?m=chat&username=' + uname + '&city=' + city
                    + '&type=wapesf&houseid=' + houseid + '&purpose=' + paramPurpose + '&housetype='
                    + vars.housetype;
                // 无线2.0增加agentid参数
                if (agentid) {
                    imHref += '&agentid=' + agentid;
                }
                if (vars.listtype === '1') {
                    imHref += '&ShopType=wxsfb2.0';
                }
                window.location = imHref;
            }, 500);
            yhxw({type: 24, pageId: 'mesfpage'});
        }

        /**
         * 打电话功能
         * @param city
         * @param housetype
         * @param houseid
         * @param newcode
         * @param type
         * @param phone
         * @param channel
         * @param agentid
         * @param order
         * @param housefrom
         */
        function teltj(city, housetype, houseid, newcode, type, phone, channel, agentid, order, housefrom) {
            if (channel.indexOf('转') > -1) {
                channel = channel.replace('转', ',');
            }
            var url = vars.mainSite + 'data.d?m=houseinfotj&city=' + city + '&housetype=' + housetype
                + '&houseid=' + $.trim(houseid) + '&newcode=' + $.trim(newcode) + '&type=' + type
                + '&phone=' + $.trim(phone) + '&channel=' + $.trim(channel) + '&agentid=' + $.trim(agentid) + '&order=' + order + '&housefrom=';
            if (vars.hasOwnProperty('from') && vars.from.length > 0) {
                url += vars.from + '&product=soufun';
            } else {
                url += housefrom;
            }
            $.get(url);
            yhxw({type: 31, pageId: pageId, agentid: agentid});
        }

        /**
         * 点击经纪人电话操作
         */
        $telBtn.on('click', callPhone);

        // 匹配地址中自动拨打的参数值
        if (window.location.href.indexOf('autoCall=') > -1) {
            autoCall = window.location.href.match(/autoCall=([0-9,]+)/)[1];
            console.log(autoCall);
        }

        // 威海，用户登录返回后，自动调起打电话功能
        if (vars.city == 'weihai' && cookiefile.getCookie('sfut') && autoCall) {
            window.location.href = 'tel:' + autoCall;
            //callPhone();
        }

        // 记录打电话功能
        function callPhone(e) {

            // 没有点击事件的话，则通过匹配a标签href属性值获取data-teltj属性值
            if (vars.city == 'weihai' && !$(this).attr('data-teltj')) {
                var data = $("a[href$='" + autoCall + "']").attr('data-teltj');
            } else {// 否则直接获取当前点击标签的属性值
                var data = $(this).attr('data-teltj');
            }
            var dataArr = data.split(',');
            // 如果vars.sfAgent数组存在则需要替换电话400电话号码
            if (vars.sfAgent) {
                dataArr[5] = vars.sfAgent[$.trim(dataArr[7])].replace('转', '-');
            }
            teltj(dataArr[0], dataArr[1], dataArr[2], dataArr[3], dataArr[4], dataArr[5], dataArr[6], dataArr[7], dataArr[8], dataArr[9]);
            var housetype = 'esf';
            var size = 50;
            // 经纪人电话已经全部改为400电话
            // var phone = $('#agentPhone').text();
            var isShopPhone = '';
            var houseid = vars.houseid;
            var callHis = '';
            if (vars.localStorage) {
                callHis = vars.localStorage.getItem('callHis');
            }
            var item = 'title~' + $('#title').html() + ';' + 'phone~' + dataArr[5].replace('转', ',')
                + ';' + 'time~' + new Date().getTime();
            if (!callHis && vars.localStorage) {
                vars.localStorage.setItem('callHis', item);
            } else {
                var callHisList = callHis.split('|');
                var callHistory = '';
                for (var i = 0; i < (callHisList.length >= size ? size : callHisList.length); i++) {
                    var phoneHis = getParam(callHisList[i], 'phone');
                    if (phoneHis !== dataArr[5].replace('转', ',')) {
                        callHistory += callHisList[i] + '|';
                    }
                }
                if (vars.localStorage) {
                    vars.localStorage.setItem('callHis', item + (callHistory === '' ? '' : '|')
                        + (callHistory === '' ? '' : callHistory.substring(0, callHistory.length - 1)));
                }
            }
            $.ajax(vars.mainSite + 'data.d?m=tel&city=' + vars.city + '&housetype='
                + housetype + '&id=' + houseid + '&phone=' + dataArr[5] + '&isShopPhone=' + isShopPhone);
            //威海打电话强制登录
            if (vars.city == 'weihai' && !cookiefile.getCookie('sfut')) {
                e.preventDefault();
                // 如果有点击事件，则用标签属性中的值将自动拨打的手机号替换
                if ($(this).attr('data-teltj')) {
                    autoCall = $.trim($(this).attr('href').replace('tel:', ''));
                }
                console.log(autoCall);
                // 当前页面地址处理，将地址中含有的autoCall参数去掉
                var backUrl = window.location.href.replace(/&?autoCall=[0-9,]+&?/g, '');
                // 将需要拼接的autoCall参数加入url中
                backUrl += backUrl.indexOf('?') > -1 ? '&autoCall=' + autoCall : '?autoCall=' + autoCall;
                // 跳转登录
                window.location.href = location.protocol + '//m.fang.com/passport/login.aspx?burl='
                    + encodeURIComponent(backUrl) + '&r=' + Math.random();
                return false;
            }
        }

        // 判断在线咨询是否在线
        // if (!vars.zxzxIsOL || vars.zxzxIsOL === '0') {
        // $('.tj-mes').css('background-color', '#808080');
        // }
        // 判断在线咨询是否在线
        // if (parseInt(vars.online) !== 1) {
        // $('.tj-mes').css('background-color', '#808080');
        // }


        // +++++++++++++++电商详情页底部预约改版 modified by zdl
        // 经纪人列表浮层
        var $jjropen = $('.jjropen');
        // 点击在线咨询按钮
        $('#newConsulting').on('click', function () {
            // 显示经纪人列表浮层
            $jjropen.show();
        });

        // 点击经纪人浮沉内容时不执行点击浮层的操作
        $('.conbox').on('click', function (e) {
            e.stopPropagation();
        });

        // 点击经纪人浮层阴影时隐藏该浮层
        $jjropen.on('click', function () {
            $jjropen.hide();
        });

        /**
         * 点击给我留言按钮操作
         */
        $leaveMsgBtn.on('click', function () {
            var data = $(this).attr('data-chat');
            var dataArr = data.split(',');
            if (vars.sfAgent) {
                dataArr[6] = vars.sfAgent[$.trim(dataArr[10])].replace('转', '-');
            }
            chatWeituo(dataArr[0], dataArr[1], dataArr[2], dataArr[3], dataArr[4], dataArr[5]
                , dataArr[6], dataArr[7], dataArr[8], dataArr[9], dataArr[10], dataArr[11], dataArr[12], dataArr[13]);
        });

        // 预约看房功能
        // 预约看房条件
        if (vars.housetype === 'A' || vars.islookhouse === '1' || vars.yytype === '1') {
            // 20160802 电商发布到搜房帮房源增加预约看房
            // 拼接预约看房跳转地址
            var yykfUrl = vars.esfSite + 'index.php?c=esf&a=yykf&houseid=' + vars.houseid + '&housetype=' + vars.housetype + '&city=' + vars.city,
                yyUrl = '',
            // 预约看房按钮
                $reserveBtn = $('.btn_yykf'),
                $yykfBtottom = $('.btn_yykfBottom'),
                $newOrder = $('.newOrder'),
            // 预约成功弹窗实例
                $successPop = $('#yydSuc'),
                $continueSelectBtn = $('#xuanfang_suc'),
            // 预约失败弹窗实例
                $failPop = $('#yydFail');

            // 分享传值
            var isshare = '';
            var shareAgentId = '';
            if (vars.isshare === 'share' || vars.isshare === 'agent') {
                yykfUrl += '&isshare=' + vars.isshare + '&shareAgentId=' + vars.shareAgentId;
                isshare = vars.isshare;
                shareAgentId = vars.shareAgentId;
            }
            // 拼接验证预约看房接口地址
            if (vars.hasOwnProperty('utm_term') && vars.utm_term.length > 0) {
                yyUrl += '&utm_term=' + encodeURIComponent(vars.utm_term);
            }
            if (vars.hasOwnProperty('utm_source') && vars.utm_source.length > 0) {
                yyUrl += '&utm_source=' + encodeURIComponent(vars.utm_source);
            }
            var jsondata;
            // 电商发布在搜房帮上的房源添加参数
            if (vars.yytype === '1') {
                jsondata = {
                    houseid: vars.innerid,
                    city: vars.city,
                    r: Math.random(),
                    isshare: isshare,
                    ShareAgentID: shareAgentId,
                    SFBagentId: vars.agentid,
                    SFBhouseid: vars.houseid,
                    yytype: vars.yytype
                };
            } else {
                jsondata = {
                    houseid: vars.houseid,
                    city: vars.city,
                    r: Math.random(),
                    isshare: isshare,
                    ShareAgentID: shareAgentId
                };
            }

            /**
             * 弹出预约成功弹出框
             */
            var sucsfunction = function () {
                $successPop.show();
                unable();
            };

            /*
             *已预约后预约成功按钮以及底部浮框中预约按钮样式
             */
            var hasReserv = function () {
                $reserveBtn.addClass('disabled').text('已预约');
                $yykfBtottom.text('已预约').css('line-height', '4');
                $newOrder.html('<i class="tj-yy"></i>已预约');
            };
            var canYY = true;
            var yykf = function () {
                if ($.trim($reserveBtn.text()) === '已预约' || $.trim($newOrder.text()) === '已预约') {
                    return false;
                }
                yhxw({type: 8, pageId: 'mesfpage'});
                if (canYY) {
                    canYY = false;
                    $.ajax({
                        beforeSend: function () {
                            $reserveBtn.text('请稍后');
                        },
                        url: vars.esfSite + 'index.php?c=esf&a=yyAddOrder' + yyUrl,
                        data: jsondata,
                        success: function (data) {
                            if (data === '1') {
                                sucsfunction();
                                hasReserv();
                            } else {
                                $failPop.show();
                                setTimeout(function () {
                                    window.location.href = yykfUrl + yyUrl;
                                }, 1000);
                            }
                            canYY = true;
                        }
                    });
                }

            };
            // 判断房源是否已经预约
            $.get(vars.esfSite + 'index.php?c=esf&a=getOrderStatus', jsondata, function (data) {
                if (data === '0') {
                    // 没有预约过设置预约跳转地址
                    $reserveBtn.attr('href', yykfUrl + yyUrl);
                    $yykfBtottom.attr('href', yykfUrl + yyUrl);
                    $newOrder.attr('href', yykfUrl + yyUrl);
                } else if (data === '1') {
                    // 已经预约,设置按钮为灰色
                    hasReserv();
                } else {
                    $reserveBtn.on('click', yykf);
                    $yykfBtottom.on('click', yykf);
                    $newOrder.on('click', yykf);
                }

            });

            // 成功预约弹窗中的继续选房操作
            $continueSelectBtn.click(function () {
                $successPop.hide();
                enable();
            });
        }
        // wap端点对点打开app
        require.async('app/1.0.0/appdownload', function ($) {
            $('.xq-app-d, .icon-down').openApp('//download.3g.fang.com/soufun_android_31167.apk');
        });
        // 判断是否为客户端打开，加载自动打开app操作js
        if (vars.hasOwnProperty('waptoapp') && vars.waptoapp === 'client') {
            require.async(vars.public + 'js/autoopenapp.js');
        }
        // 委托详情页加载提示下载APP
        if ('WT' === vars.housetype) {
            require.async(vars.public + 'js/20141106.js');
        }
        // 如果是经纪人房源出售，记录行为，并记录日志
        var clickPayDataCollect = function (type) {
            require.async(location.protocol + '//static.soufunimg.com/esf/esf/online/secondhouse/old/secondhouse/image/esfnew/'
                + 'scripts/ClickPayCount/ClickPayDataCollect.js', function () {
                var sPage = 1;
                // 判断南北方
                vars.ns = vars.ns === 'n' ? 'Y' : 'N';
                vars.imei = vars.imei || '';
                var channel = vars.isshare === 'share' ? 1 : 0;
                if (vars.listtype !== undefined && vars.listsub !== undefined) {
                    var cpdc = new ClickPayDataCollect(encodeURIComponent(vars.cityname), vars.ns, type, vars.agentid
                        , vars.houseid, encodeURIComponent(document.referrer), 2, sPage, vars.imei, '', channel, vars.listtype, vars.listsub);
                } else {
                    var cpdc = new ClickPayDataCollect(encodeURIComponent(vars.cityname), vars.ns, type, vars.agentid
                        , vars.houseid, encodeURIComponent(document.referrer), 2, sPage, vars.imei, '', channel);
                }
                setTimeout(cpdc.writeLog(), 1000);
            });
        };
        if (vars['housetype'].indexOf('AGT') > -1) {
            // 判断 jsub的js是否已加载,如果已加载,直接调用,如果未加载, 等加载后调用.
            if (typeof window._ub !== 'undefined') {
                clickPayDataCollect('cs');
            } else {
                seajs.on('jsub', function () {
                    clickPayDataCollect('cs');
                });
            }
        }
        var l;

        function zoushi() {
            // 画走势图
            // 如果为小城市,不需要画走势图
            if (vars.isPinggu && parseInt(vars.isPinggu) > 0) {
                var Line = require('chart/line/1.0.2/line');
                // 获取数据并绘制走势图

                $('#chartCon').empty();
                // 判断走势图数据如果为空说明没有获取过数据，则执行初始化，否则以存储过的数据画图
                $.ajax({
                    url: vars.pingguSite + '?c=pinggu&a=ajaxGetDetailDraw&city=' + vars.city
                    + '&topnum=' + 12
                    + '&newcode=' + vars.plotid
                    + '&district=' + vars.district_name,
                    success: function (data) {
                        if (data !== 'error' && data.xqcode.price && data.xqcode.price.hasOwnProperty('0')) {
                            var xqcodeChart, disChart, cityChart, cdataArr = [];
                            // 针对某些城市数据不全的情况做兼容如果某类数据不存在，则不显示
                            if (data.xqcode && data.xqcode.price) {
                                xqcodeChart = {
                                    yAxis: data.xqcode.price,
                                    forecast: true
                                    // 是否显示预测，不传是false
                                };
                                cdataArr.push(xqcodeChart);
                            }
                            if (data.disdata && data.disdata.price) {
                                disChart = {
                                    yAxis: data.disdata.price,
                                    forecast: false
                                };
                                cdataArr.push(disChart);
                            }
                            if (data.city && data.city.price) {
                                cityChart = {
                                    yAxis: data.city.price,
                                    forecast: false
                                };
                                cdataArr.push(cityChart);
                            }
                            // 画走势图
                            l = new Line({
                                id: '#chartCon',
                                height: 200,
                                width: $(window).width(),
                                xAxis: data.monthnum,
                                data: cdataArr
                            });
                            l.run();
                            // 使走势图滚动到最后一个月位置
                        } else {
                            // 没有数据则隐藏房价走势板块
                            $('#loupanTrend').hide();
                        }
                    }
                });
            }
        }

        if (!vars.isBdclo) {
            zoushi();
        } else {
            // 点击按钮，展开走势图
            var zs = $('#loupanTrend');
            $('.more_text').on('click', function () {
                var ele = $(this);
                if (zs.is(':hidden')) {
                    zs.show();
                    if (!l) {
                        zoushi();
                    }
                    ele.html('收起');
                } else {
                    zs.hide();
                    ele.html('展开查看房价走势');
                }
            });
        }

        /**
         * 显示收藏提示
         * @param str
         */
        // 将弹框放入main中，避免父元素透明度变化影响子元素 lina 20161121
        function showCollectTips(str) {
            if (!$collectMsg) {
                $collectMsg = $('<div class="favorite" style="display: none;opacity:1;position:fixed">收藏成功</div>');
                $('.main').append($collectMsg);
            }
            $collectMsg.show().css({left: $(window).width() / 2 + 'px', top: $(window).height() / 2 + 'px'}).html(str);
            setTimeout(function () {
                $collectMsg.hide(500);
            }, 3000);
        }

        /*
         *显示新版弹窗提示
         *
         */
        function showNewCollectTips() {
            $('#scSuc').show();
        }

        /**
         * 点击收藏
         */
        var canSave = true;
        $collectBtn.on('click', function () {
            // 收集用户行为
            yhxw({type: 21, pageId: 'mesfpage'});
            // 调用收藏接口
            if (canSave) {
                canSave = false;
                $.ajax({
                    timeout: 3000,
                    url: vars.mySite + '?c=mycenter&a=ajaxAddMySelectOfFangYuan&city=' + vars.city
                    + '&houseid=' + vars.houseid + '&housetype=' + vars.housetype + '&channel=esf',
                    success: function (data) {
                        if (data.userid) {
                            if (data.myselectid) {
                                // 显示收藏提示
                                showNewCollectTips();
                                if (vars.houseSource === 'DS' && vars.housetype === 'A' && !vars.isshare) {
                                    $collectBtn.addClass('on');
                                } else {
                                    $collectBtn.addClass('btn-faved cur');
                                }
                            } else {
                                showCollectTips('已取消收藏');
                                if (vars.houseSource === 'DS' && vars.housetype === 'A' && !vars.isshare) {
                                    $collectBtn.removeClass('on');
                                } else {
                                    $collectBtn.removeClass('btn-faved cur');
                                }
                            }
                        } else {
                            // 未登录要求先登录 ,跳转地址修改lina 20100905
                            window.location.href = location.protocol + '//m.fang.com/passport/login.aspx?burl='
                                + encodeURIComponent(window.location.href) + '&r=' + Math.random();
                        }
                        canSave = true;
                    },
                    error: function () {
                        showCollectTips('出错了');
                        canSave = true;
                    }
                });
            }

        });

        // 点击继续看房
        $('#xuanfang_suc1').click(function () {
            $scSuc.hide();
            // 手指滑动，恢复浏览器默认事件
            enable();
        });

        /**
         * 向下滑动时相关效果
         * 页面滑动未超过200px时，页面向上滑动元导航慢慢消失，新导航逐渐显示，页面向下滑动，原导航逐渐显示，新导航消失。滑动页面滚动超过200px时新导航固定顶部。
         *
         */
        var $focusopt = $('.focus-opt');
        if($focusopt.length && $('.topDownload').length){
            $focusopt.find('a').css('top','10px');
        }
        function scrollFun() {
            // 打电话浮层
            this.floatTel = $('.floatTel');
            // 屏幕高度
            this.wh = $(window).height();
            // 尾部标签
            this.footer = $('.footer');
            // 详情页初始导航
            this.detailNav = $('#slider').find('a.back,a.icon-fav,a.icon-nav');
            // 月面滑动显示导航
            this.headerNav = $('.header');
            // 初始导航与页面滚动时显示导航切换的滚动总距离
            this.maxLen = 200;
            // 导航开始切换距离
            this.cLen = 150;

            // 电商类型数组
            var dsType = ['A', 'D'];
            this.init = function () {
                // 如果为搜房帮二期分享页面时取消头部滑动
                if (!(vars.isshare === 'share' && (vars.housetype === 'WAGT' || vars.housetype === 'AGT'))) {
                    var that = this;
                    $(window).on('scroll', function () {
                        if ($('.newNav').is(':hidden')) {
                            var scrollH = $(this).scrollTop();
                            that.headerNav.addClass('esf-style').css('position', 'fixed').show();
                            // 电商房源中的经纪人下浮层显示功能
                            if (dsType.indexOf(vars.housetype) > -1 && that.footer && that.floatTel) {
                                // 这里比较有意思，当滑动下来在一屏减去450的位置，显示浮层，这个450是怎么确定的不清楚
                                if (scrollH + 450 <= that.wh) {
                                    // 产品要求必须固定底部电环浮层div modified by zdl
                                    // that.floatTel.hide();
                                    that.footer.css('padding-bottom', '0px');
                                } else {
                                    // that.floatTel.show();
                                    that.footer.css('padding-bottom', '50px');
                                }
                            }
                            // 导航切换效果
                            if (scrollH <= that.maxLen) {
                                that.headerNav.css('opacity', scrollH / that.maxLen);
                                if (scrollH === 0) {
                                    that.headerNav.hide();
                                }
                                // 向下移动屏幕
                                if (scrollH <= that.cLen) {
                                    that.detailNav.css('opacity', 1 - scrollH / that.cLen);
                                } else {
                                    that.headerNav.children().filter('.left,.head-icon').css('opacity', scrollH / (that.maxLen - that.cLen));
                                }
                                // 向上移动屏幕
                            } else {
                                that.headerNav.css('opacity', 1);
                            }
                        } else {
                            that.detailNav.show();
                            that.headerNav.show().addClass('esf-style').css({position: 'relative', opacity: '1'});
                        }
                    });
                }
            };
            return this.init();
        }
        if($(window).scrollTop() === 0 && $('#newheader').is(':visible') && !vars.havePic){
            $('#newheader').css('position','relative');
        }

        // 评论列表和搜房app，今日头条app以及过期房源中不加载导航相关效果
        if (!vars.issfapp && vars.havePic && parseInt(vars.havePic) !== 0 && !vars.jrttApp && !vars.validHouseStatus && !vars.isBdclo) {
            new scrollFun();
        }
        // 哥伦布房源滑动时头部搜索框固定
        // 过期房源页，滑动改变头部的position
        var $xqfocus = $('.xqfocus');
        if (vars.isBdclo && !$xqfocus.length) {
            $('.headerC').css({position: 'fixed', zIndex: '1000', width: '100%'});
        }
        $(window).on('scroll', function () {
            if ($('.main').is(':hidden') && vars.validHouseStatus === '') {
                $('.header').css('position', 'relative');
            }
            // 哥伦布房源滑动改变搜索框的position
            if (vars.isBdclo) {
                if ($(document).scrollTop() !== 0) {
                    $('.headerC').css({position: 'fixed', 'z-index': '1000', width: '100%', top: '0'});
                } else if ($xqfocus.length) {
                    $('.headerC').css({position: 'relative', 'z-index': '1000'});
                } else {
                    $('.headerC').css({position: 'fixed', 'z-index': '1000', top: '0'});
                }
            }
            var $header = $('#newheader');
            if($header.is(':visible') && vars.havePic === '0'){
                if($(window).scrollTop() === 0){
                    $header.css('position','relative');
                }else{
                    $header.css('position','fixed');
                }
            }

        });

        // 过期 下架房源 头部导航
        if (vars.validHouseStatus) {
            var maxLen = 200;
            // var cLen = 150;
            var headerNav = $('.header');
            $(window).on('scroll', function () {
                var scrollH = $(this).scrollTop();
                if (scrollH <= maxLen) {
                    if (!headerNav.is(':hidden')) {
                        headerNav.css('opacity', scrollH / maxLen);
                        if (scrollH === 0) {
                            headerNav.hide();
                        }
                    }
                } else {
                    headerNav.css('opacity', 1);
                    headerNav.addClass('esf-style').css('position', 'fixed').show();
                }
            });
        }

        /**
         * 倒计时函数
         */
        // 价格倒计时标志位 countdownFlag为false时点击按钮不发送ajax请求验证码,等待倒计时结束
        var countdownFlag = true;

        function countDown() {
            countdownFlag = false;
            var timer = setInterval(function () {
                timeCount--;
                $codeBtn.val('重新发送(' + timeCount + ')');
                if (timeCount === -1) {
                    countdownFlag = true;
                    clearInterval(timer);
                    $codeBtn.addClass('disabled').val('重新获取');
                    timeCount = 60;
                }
            }, 1000);
        }

        // 点击直约业主按钮或或者代办过户按钮
        $zyyz.on('click', function () {
            var el = $(this);
            // 如果用户已经登录则点击打电话 改变登陆弹框的相关数据
            if (el.attr('class').indexOf('zyyz') > -1) {
                $boxTit.removeClass('sqdb-tt').text('直约业主');
            } else {
                $boxTit.addClass('sqdb-tt').text('');
            }
            if (vars.userid || vars.loginStatus) {
                submit(vars.userid);
            } else {
                var url = vars.esfSite + '?c=esf&a=checkLoginMode&r=' + Math.random();
                $.get(url, '', function (q) {
                    if (q === '1') {
                        submit(vars.userid);
                    } else {
                        $loginBox.show();
                    }
                });
            }
        });

        /**
         *
         * @param userid 用户登陆id
         */
        var $showZyyzMax = $('#showZyyzMax');
        var sub = true;

        function submit(userid) {
            // 表示提交类型 1为直约业主，2为代办过户
            var type = 1;
            if ($boxTit.hasClass('sqdb-tt')) {
                type = 2;
            }
            // 提交url
            var linkUrl = vars.esfSite + '?c=esf&a=ajaxGetZYYZ&city=' + vars.city + '&houseid=' + vars.houseid + '&phoneNum=' + vars.phoneNum + '&type=' + type;
            if (!userid) {
                linkUrl += '&phone=' + $.trim($telNo.val());
            }
            if (type === 1) {
                yhxw({type: 128, pageId: 'mesfpage'});
            } else if (type === 2) {
                yhxw({type: 60, pageId: 'mesfpage'});
            }
            if (sub) {
                sub = false;
                $.ajax({
                    url: linkUrl,
                    data: jsondata,
                    success: function (data) {
                        if (data.login && parseInt(data.login) === 1 && !vars.loginStatus) {
                            vars.loginStatus = 1;
                        }
                        $loginBox.hide();
                        // 判断是否是中介0表示不是中介
                        if (data.checkAgent.result === '0') {
                            // type为1表示点击了直约业主操作
                            if (type === 1) {
                                // 判断直约业主接口是否超时 -2表示超时
                                if (data.visitOwner.timeout === '-2') {
                                    $showZyyzMax.find('p').text(data.visitOwner.message);
                                    $showZyyzMax.show();
                                } else if (data.visitOwner.isSuccess === '1' && parseInt(data.visitOwner.count) === 10) {
                                    // 直约业主次数预约次数达到一天的上限10次时的操作
                                    $showZyyzMax.find('p').text('您今天直约业主已达10次，请明天再预约！');
                                    $showZyyzMax.show();
                                } else if (data.visitOwner.isSuccess === '0' && parseInt(data.visitOwner.count) <= 10) {
                                    // 直约业主成功并且次数预约次数小于一天的上限10次时的操作
                                    $('#remainCount').text(data.visitOwner.remainCount);
                                    $('#showZyyz').show();
                                } else {
                                    // 直约业主失败data.visitOwner为空时
                                    $showZyyzMax.find('p').text('直约业主失败！');
                                    $showZyyzMax.show();
                                }
                            } else if (type === 2) {
                                // 申请代办过户请求接口失败时
                                if (data.transferOwnership.timeout === '-2') {
                                    $showZyyzMax.find('p').text(data.transferOwnership.message);
                                    $showZyyzMax.show();
                                } else if (data.transferOwnership.result === '1') {
                                    // 申请代办过户请求成功时
                                    $('#successDb').show();
                                } else {
                                    // 申请代办过户失败data.transferOwnership为空（不知道为什么会有这个情况）
                                    $showZyyzMax.find('p').text('代办过户失败!');
                                    $showZyyzMax.show();
                                }
                            }
                        } else if (data.checkAgent.timeout === '-2') {
                            // 判断是否是中介时接口超时
                            $showZyyzMax.find('p').text(data.checkAgent.message);
                            $showZyyzMax.show();
                        } else if (data.checkAgent.result === '1') {
                            // 是中介时执行的操作
                            $showZyyzMax.find('p').text('经纪人无法联系业主!');
                            $showZyyzMax.show();
                        } else {
                            $showZyyzMax.find('p').text('请求失败！');
                            $showZyyzMax.show();
                        }
                        sub = true;
                    }
                });
            }
        }

        $showZyyzMax.find('span').on('click', function () {
            $showZyyzMax.hide();
        });

        $('.phone,#getCode').focus(function () {
            $msgBox.text('');
        });
        // 获取并验证验证码

        $codeBtn.click(function () {
            var phone = $.trim($telNo.val());
            // 如果电话号码不符合要求，则提示电话号码错误
            if (patternTel.test(phone) === false) {
                $msgBox.text('请输入正确的电话号码');
                return false;
            }
            $codeBtn.removeClass('disabled');
            // 使用公用验证码对象发送验证码
            if (countdownFlag) {
                require.async('verifycode/1.0.0/verifycode', function (codeVerifyObj) {
                    codeVerifyObj.getPhoneVerifyCode(phone, countDown, function () {
                        return false;
                    });
                });
            }
        });
        $('#tjBtn').click(function () {
            if (patternTel.test($telNo.val()) === false) {
                $msgBox.text('请输入正确的电话号码');
                return false;
            }
            // 验证码不符合规则则提示验证码错误信息
            if (patternCode.test($codeCon.val()) === false) {
                $msgBox.text('验证码输入错误');
                return false;
            }
            // 校验输入的验证码是否正确
            require.async('verifycode/1.0.0/verifycode', function (codeVerifyObj) {
                codeVerifyObj.sendVerifyCodeAnswer($telNo.val(), $codeCon.val(), submit, function () {
                    $msgBox.text('验证码输入错误');
                    return false;
                });
            });
        });
        $('#qxBtn, .closeBtn, #xuanfang_suc, .qrBtn').click(function () {
            $('.tz-box').hide();
        });
        // 底部内链导航
        function addSwInfo(id) {
            var points = $('.' + id).find('.pointBox').find('span');
            Swiper('.' + id, {
                // 切换速度
                speed: 500,
                // 循环
                loop: false,
                onSlideChangeStart: function (swiper) {
                    points.eq(swiper.activeIndex).addClass('cur').siblings().removeClass('cur');
                }
            });
        }

        // 初始化导航信息(按钮以及模块内容)
        var navi = $('.typeListB'),
            seoTab = $('.tabNav');
        if (navi.length && seoTab.length) {
            var firstB = $('.overboxIn').find('a').eq(0),
                firId = firstB.attr('id');
            firstB.addClass('active');
            $('.' + firId).show();
            addSwInfo(firId);
            // 切换导航部分模块
            seoTab.find('.overboxIn').on('click', 'a', function () {
                var el = $(this),
                    thisId = el.attr('id');
                el.addClass('active').siblings().removeClass('active');
                seoTab.nextAll().hide();
                $('.' + thisId).show();
                // 底部导航切换
                addSwInfo(thisId);
            });
        }
        // 南昌增加房屋核验二维码展示
        var qr = $('.xq-code'); // 二维码点击按钮
        if (qr.length) {
            var floatAlert = $('.qrshow'),
                Sclose = $('.close');
            qr.on('click', 'a', function () {
                floatAlert.show();
                unable();
            });
            // 点击二维码浮层内容时不执行点击浮层的操作
            $('.conner').on('click', function (e) {
                e.stopPropagation();
            });
            // 点击二维码浮层阴影时隐藏该浮层
            floatAlert.on('click', function () {
                floatAlert.hide();
                enable();
            });
        }

        //ajax加载家居需求
        if($('#zxexample').length){
            $.ajax({
                url:vars.esfSite + '?c=esf&a=ajaxIncJiajuModule&city=' + vars.city + '&plotid=' + vars.plotid + '&housetype=' + vars.housetype,
                data:{'houseid': vars.houseid},
                success: function(data){
                    if (data) {
                        $('#zxexample').append(data);
                        if ($('#zxexample').find('.jiajuExposure').val()) {
                            require.async('bgtj/bgtj', function(bgTj){
                                bgTj({
                                    url:window.location.protocol + '//esfbg.3g.fang.com/homebg.html',
                                    sendData:$('#zxexample').find('.jiajuExposure').val(),
                                    isScroll: iscrollNew,
                                    contentId: 'zxexample'
                                });
                            });
                        }
                    }
                }
            })
        }
        //ajax更新发布时间刷新时间
        if($('#refreshtime').text()){
            $.ajax({
                url:vars.esfSite + '?c=esf&a=ajaxGetRefreshTime&city=' + vars.enzhcity + '&houseid=' + vars.houseid + '&housetype=' + vars.housetype,
                success: function(data){
                    if (data.code === '100') {
                        $('#refreshtime').text('(' + data.info + ')');
                    }
                }
            })
        }

        // 首付预算月供
        var maskLayer = $('.esf-out-bg'), downPayment = $('#downPayment'), loanTotalPrice = vars.loanTotalPrice,
            downPaymentMonth = vars.downPaymentMonth, rate = vars.rate;
        if (loanTotalPrice && rate && downPaymentMonth) {
            // 用户首次进入页面，显示蒙层
            if (!vars.localStorage.getItem(vars.loginUserName + 'shoufu')) {
                maskLayer.show();
                unable();
            }
            if (vars.localStorage) {
                vars.localStorage.setItem(vars.loginUserName  + 'shoufu', '1');
            }
            // 浮层关闭
            maskLayer.find('a').on('click', function(){
                maskLayer.hide();
                enable();
            });

            if (loanTotalPrice !== '-1') {
                // 计算月供
                var Calculate = require('modules/tools/mvc/model/Calculate');
                var data = {
                    type:1,
                    totalMoney:loanTotalPrice * 10000,
                    rate:rate,
                    month:downPaymentMonth * 12,
                };
                var CalculateObj = new Calculate();
                var dataArr = CalculateObj.calculate(data);

                //月供和首付都存在时，显示该模块
                if (dataArr.monYg) {
                    downPayment.find('a span:not(#downPay),a p').text('约' + vars.downPaymentPrice + '万，月供' + dataArr.monYg + '元');
                    downPayment.show();
                }
            } else {
                downPayment.find('a span:not(#downPay),a p').text('该房源暂不支持贷款');
                downPayment.show();
            }
        }

        // 虚假举报身份认证判断
        $report.on('click', function() {
            require.async('util/util',function(util) {
                if (util.getCookie('sfut')) {
                    $.ajax({
                        url: vars.esfSite + '?c=esf&a=ajaxJudgeUserIdentity&city=' + vars.city,
                        success: function (data) {
                            if (data) {
                                alert(data);
                            } else {
                                if (vars.houseSource === 'DS' && vars.housetype === 'A') {
                                    window.location.href = vars.esfSite + '?c=esf&a=report&houseid=' + vars.houseid + '&type=DS&city=' + vars.city;
                                } else {
                                    window.location.href = vars.esfSite + '?c=esf&a=report&houseid=' + vars.houseid + '&type=' + vars.housetype +
                                        '&city=' + vars.city + '&purpose=' + vars.purpose + '&housetype=' + vars.cstype + '&agentid=' + vars.agentid;
                                }
                            }
                        }
                    });
                } else {
                    if (vars.houseSource === 'DS' && vars.housetype === 'A') {
                        window.location.href = vars.esfSite + '?c=esf&a=report&houseid=' + vars.houseid + '&type=DS&city=' + vars.city;
                    } else {
                        window.location.href = vars.esfSite + '?c=esf&a=report&houseid=' + vars.houseid + '&type=' + vars.housetype +
                            '&city=' + vars.city + '&purpose=' + vars.purpose + '&housetype=' + vars.cstype + '&agentid=' + vars.agentid;
                    }
                }
            });
        });
        //优选详情记cookie，如果最后进的是优选详情下次进入直接进优选列表,否则普通列表
        cookiefile.setCookie('listAllToJh', '0', 365);
        //经纪人分享活动（20171107-20171117）
        if ((vars.housetype == 'AGT' || vars.housetype == 'WAGT') && vars.isshare === 'share') {
            //new iscrollNew('.sharewarp', {scrollY: true});
            $('#sharehd').on('click', function () {
                $('.x-share-bg').show();
                $('.x-share-out').show();
            });
            $('.x-share-close').on('click', function () {
                $('.x-share-bg').hide();
                $('.x-share-out').hide();
            });


            if (UA.indexOf('iphone') > -1 || UA.indexOf('ios') > -1) {
                $('.btn-lq').css('display', 'block');
                $('.erweima').css('display', 'none');
                $('#contentshow').text('');
            } else {
                $('.btn-lq').css('display', 'none');
                $('.erweima').css('display', 'block');
                $('#contentshow').text('扫描二维码下载房APP参与');
            }

            var shareSwiper = new Swiper('#sharehdswp', {
                autoplay: 2000,//可选选项，自动滑动
                loop: true,
                direction: 'vertical',
                autoplayDisableOnInteraction: false,
                observer: true,
                observeParents: true,
            });
        }

        // 房源描述修改（WAGT和AGT用新样式）
        if ($moreBtn.hasClass('classification')) {
            // 房源描述模块的唯一标识
            var fymsList = $('.fymsList'),
            // 房源描述中每个小标题中段落之和
                sumfyms = 0,
            // 默认展示的最大行数之和的总高度
                defaultULHeight = parseInt(fymsList.find('p').css('line-height')) * 10,
            // 默认需要展示的小标题的个数
                linum = 0,
            // h3小标题的高度
                h3Height = parseInt(fymsList.find('h3').css('height')) + parseInt(fymsList.find('h3').css('margin-bottom')),
            // li的padding高度
                LiPaddingTop = parseInt(fymsList.find('li').css('padding-bottom'));

            // 获取每个p的实际高度
            fymsList.find('li').each(function () {
                var that = $(this);
                // 看看最多展示几个
                if (sumfyms < defaultULHeight) {
                    linum += 1;
                }
                // 所有p的高度之和
                sumfyms += parseInt(that.css('height'));
            });

            // 所有p之和与默认高度对比，如果大于，则要先合上
            if (sumfyms > defaultULHeight) {
                fymsList.find('a').css('display', 'block');
                fymsList.find('ul').css({'max-height': (h3Height + LiPaddingTop) * linum + defaultULHeight, 'overflow': 'hidden'});
            }

            // 如果有展开合上的按钮，则要实现展开合上的功能
            fymsList.children('a').on('click', function () {
                var that = $(this);
                if (that.hasClass('up')) {
                    that.removeClass('up');
                    fymsList.find('ul').css({'max-height': (h3Height + LiPaddingTop) * linum + defaultULHeight, 'overflow': 'hidden'});
                } else {
                    that.addClass('up');
                    fymsList.find('ul').css({'max-height': '', 'overflow': ''});
                }
            });
            //下载弹框
            if (vars.appdownload) {
                if (vars.downLimit && !cookiefile.getCookie('onedayClose') && !cookiefile.getCookie('foreverClose')) {
                    $('.downloadAPP-lp').show();
                } else if (!cookiefile.getCookie('onedayClose') && !cookiefile.getCookie('foreverClose')) {
                    var timespace = 1;
                    var timeset = setInterval(function() {
                        timespace = 1 + timespace;
                        if (timespace > 350) {
                             $('.downloadAPP-lp').show();
                             clearTimeout(timeset);
                        }
                    }, 1000);
                }
                $('.onedayClose').click(function() {
                    $('.downloadAPP-lp').hide();
                    var date = new Date();
                    var curTime = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
                    var tomorrow = Date.parse(new Date(curTime)) + (1000*60*60*24);
                    var curTemp = Date.parse(new Date());
                    var cookieTiem = (tomorrow - curTemp)/(24*60*60*1000);
                    cookieTiem = cookieTiem.toFixed(3);
                    if ($('.foreverClose').hasClass('on')) {
                        cookiefile.setCookie('foreverClose', 1, 365);
                    } else {
                        cookiefile.setCookie('onedayClose', 1, cookieTiem);
                    }
                });
                $('.foreverClose').on('click', function() {
                    var el = $(this);
                    if (el.hasClass('on')) {
                        el.removeClass('on');
                    } else {
                        el.addClass('on');
                    }
                });
            }
        }
    };
});