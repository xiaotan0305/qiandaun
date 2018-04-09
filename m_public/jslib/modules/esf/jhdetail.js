/** 聚合房源
 * @author lina
 */
define('modules/esf/jhdetail', ['jquery', 'highcharts/5.0.6/highcharts', 'modules/esf/yhxw', 'chart/line/1.0.6/line', 'weixin/2.0.0/weixinshare',
    'superShare/1.0.1/superShare','iscroll/2.0.0/iscroll-lite', 'modules/tools/mvc/model/Calculate', 'util/util'],
    function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var cookiefile = require('util/util');
        var vars = seajs.data.vars;
        // 轮播js
        var Swiper = require('swipe/3.10/swiper');
        var iscrollNew = require('iscroll/2.0.0/iscroll-lite');
        var Line = require('chart/line/1.0.6/line');
        // 收藏按钮实例
        var $collectBtn = $('.btn-fav, .icon2'),
            //收藏提示
            $collectMsg,
            //继续看房
            $continueSelectBtn = $('#xuanfang_suc'),
            // 预约看房弹窗
            $scSuc = $('#scSuc');

        require('lazyload/1.9.1/lazyload');
       $('.lazyload').lazyload();
        // 详情页轮播的图片加载之前显示loader的图片 lina 20170122
        var $imgs = $('.swiper-wrapper').find('.swiper-lazy');
        if ($imgs.length) {
            imgWidth = $(document).width();
            imgWidth = imgWidth > 640 ? 640 : imgWidth;
            $imgs.css('height', imgWidth * 0.75);
            // $('#loading').hide();
            // $('.xqfocus').find('ul').show();
        }
        if($(window).scrollTop() === 0 && $('#newheader').is(':visible') && vars.havePic === '0'){
            $('#newheader').css('position','relative');
        }
        $('#showprice').on('click', function(){
            $('#companypri').find('li').show();
            $('#showprice').hide();
        });
        $('#hideprice').on('click', function(){
            $('#companypri').find('.notfirst').hide();
            $('#showprice').show();
        });

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
                    },
                    lazyLoading:true,
                    autoHeight:true
                });
            }
        }
        // 用户行为对象
        var yhxw = require('modules/esf/yhxw');
        //进页面判断用户行为来源。其他的用户行为运营在考虑，暂时用之前的不变
        var pageId = 'mesfpage';
        if (vars.housetype === 'JHAGT' || vars.housetype === 'JHWAGT') {
            if (vars.purpose === '住宅') {
                pageId = 'esf_fy^yxxq_wap';
            } else if (vars.purpose === '别墅') {
                pageId = 'esf_fy^yxbsxq_wap';
            }
        } else if (vars.housetype === 'JHJP') {
            pageId = 'esf_fy^wbyxxq_wap';
        } else if (vars.housetype == 'JHDS') {
            pageId = 'esf_fy^dsyxxq_wap';
        }
        yhxw({pageId: pageId});
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
            // 页面展示更多效果（JHAGT和JHWAGT走下面的功能）
            if (vars.housetype !== 'JHWAGT' && vars.housetype !== 'JHAGT') {
                $moreBtn.on('click', function () {
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
        }

        if ($moreBtn.length && $moreXq.length) {
            clickMoreBtn();
        }

        $('#clickMe').on('click', function () {
            $('#compareM').show();
        });
        $('#gotIt').on('click', function () {
            $('#compareM').hide();
        });

        // 用于存放地图原始尺寸的高宽比例
        var ratio = 130 / 300;
        // 获取xqMapdiv的宽度
        var $xqMapClass = $('.xqMap');
        var imgWidth = $xqMapClass.width();
        // 根据比例设置图片的高度
        $xqMapClass.find('img').height(parseInt(imgWidth * ratio));

        // 修改租房详情页点击导航栏按钮后导航栏的头部显示不出来 原因是样式中opacity设置为0
        $('#newheader').css('opacity', 1);

        // 点击头部导航按钮
        $('.icon-nav').on('click', function () {
            $('#newheader').css({'opacity': 1, 'position': 'relative'});
            var scrollTop = $(window).scrollTop();
            var opa = parseInt(1 - scrollTop / 150);
            $('.focus-opt').find('a').css('opacity', opa);
            if($("#newheader").is(":hidden")){
                $(".floatTel-xf").show(); // 如果元素为隐藏,底板按钮则将它显现
                $(".floatTel").show();
            } else {
                $(".floatTel-xf").hide(); // 如果元素为显现,则将其隐藏
                $(".floatTel").hide();
            }
        });
        var $focusopt = $('.focus-opt');
        if($focusopt.length && $('.topDownload').length){
            $focusopt.find('a').css('top','10px');
        }
        /**
         * 向下滑动时相关效果
         * 页面滑动未超过200px时，页面向上滑动元导航慢慢消失，新导航逐渐显示，页面向下滑动，原导航逐渐显示，新导航消失。滑动页面滚动超过200px时新导航固定顶部。
         *
         */
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

            };
            return this.init();
        }

        // 评论列表和搜房app，今日头条app以及过期房源中不加载导航相关效果
        if (!vars.issfapp && vars.havePic && parseInt(vars.havePic) !== 0) {
            new scrollFun();
        }

        // 成交走势
        var $hisline = $('#hisLine');

        function addToArr(arr, type) {
            var newArr = [];
            for (var i = 0; i < arr.length; i++) {
                if (type === 'name') {
                    var arrVal = arr[i].name;
                } else {
                    if (typeof arr[i].value === 'string') {
                        var arrVal = parseInt(arr[i].value);
                    } else {
                        var arrVal = arr[i].value;
                    }
                }
                newArr.push(arrVal);
            }
            ;
            return newArr;
        }
        var newHisData = [];
        // 搜索热度图
        function histoGram(valname, id, title, number, showtitle) {
            $(id).empty();
            if ($(id).is(':hidden')) {
                $(id).show();
            }
            var histodata = JSON.parse(valname).histogramdata;
            var histoData = addToArr(histodata, 'value');
            // 将搜索热度的数据赋给新的数组，并且进行排序，主要是给纵轴设置最大最小值用 lina 20170209
            for (var i = 0; i < histoData.length; i++) {
                newHisData.push(histoData[i]);
            }
            newHisData.sort(function (a, b) {
                return a - b;
            });
            if(number === 1){
                // 纵轴的最小值
                var minNum = newHisData[0] - 5;
                if(minNum <= 0){
                    minNum = 0;
                }
                // 数据的长度
                var arrLength = newHisData.length;
                // 纵轴的最大值
                var maxNum = newHisData[arrLength - 1];
            }
            if (histoData) {
                require.async('highcharts/5.0.6/highcharts', function (highcharts) {
                    $(id).highcharts({
                        chart: {
                            zoomType: 'xy',
                            height: 240
                        },
                        title: {
                            text: null
                        },
                        subtitle: {
                            text: null
                        },
                        xAxis: [{
                            categories: addToArr(histodata, 'name'),
                            labels: {
                                rotation: 0,
                                color: '#ccc'

                            },
                            crosshair: true
                        }],
                        yAxis: [{ // Primary yAxis
                            allowDecimals: false,
                            labels: {
                                format: '{value}套',
                                style: {
                                    color: Highcharts.getOptions().colors[1]
                                }
                            },
                            title: {
                                text: null,
                                style: {
                                    color: Highcharts.getOptions().colors[1]
                                }
                            }
                        }, {
                        // Secondary yAxis
                            min: minNum,
                            max: maxNum,
                            title: {
                                text: null,
                                style: {
                                    color: Highcharts.getOptions().colors[0]
                                }
                            },
                            labels: {
                                format: '{value}',
                                style: {
                                    color: Highcharts.getOptions().colors[0]
                                }
                            },
                            opposite: true
                        }],
                        tooltip: {
                            shared: true,
                        },
                        legend: {
                            enabled: false,
                            layout: 'vertical',
                            align: 'left',
                            x: 120,
                            verticalAlign: 'top',
                            y: 100,
                            floating: true,
                            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
                        },
                        credits: {
                            enabled: false // 禁用版权信息
                        },
                        series: [{
                            name: title,
                            type: 'column',
                            yAxis: number,
                            color: '#69C9BE',
                            data: histoData,
                            tooltip: {
                                valueSuffix: showtitle
                            }
                        }]
                    });
                });
            }
        }

        // 成交走势图
        function drawHisline(valname) {
            $('#hisLine').empty();
            var hisdata = JSON.parse(valname).histogramdata;
            var linedata = JSON.parse(valname).linedata;
            var lineData = addToArr(linedata, 'value');
            var hisData = addToArr(hisdata, 'value');
            if (hisdata) {
                require.async('highcharts/5.0.6/highcharts', function (highcharts) {
                    $('#hisLine').highcharts({
                        chart: {
                            zoomType: 'xy',
                            height: 240,
                            marginTop: 30,
                            marginLeft:40,
                            marginRight:40

                        },
                        title: {
                            text: null
                        },
                        subtitle: {
                            text: null
                        },
                        xAxis: [{
                            type: 'datetime',
                            dateTimeLabelFormats: {
                                day: '%m-%d'
                            },
                            tickPixelInterval: 150 ,
                            categories: addToArr(hisdata, 'name'),
                            labels: {
                                rotation: 0,
                                color: '#ccc',
                                tickWidth: 2,
                                font: '10px'
                            },
                            crosshair: true
                        }],
                        yAxis: [{ // Primary yAxis
                            allowDecimals: false,
                            labels: {
                                format: '{value}',
                                style: {
                                    color: Highcharts.getOptions().colors[1]
                                }
                            },
                            title: {
                                align: 'high',
                                offset: 0,
                                text: '成交量(套)',
                                rotation: 0,
                                x:12,
                                y: -20,
                                style: {
                                    color: '#999',
                                    fontSize: 11,
                                    fontFamily: '微软雅黑'
                                }
                            }
                        }, {
                        // Secondary yAxis
                            title: {
                                align: 'high',
                                offset: 0,
                                text: '换手率(%)',
                                rotation: 0,
                                y: -20,
                                x:-10,
                                style: {
                                    color: '#999',
                                    fontSize: 11,
                                    fontFamily: '微软雅黑'

                                }
                            },
                            labels: {
                                format: '{value}',
                                style: {
                                    color: Highcharts.getOptions().colors[0]
                                }
                            },
                            opposite: true
                        }],
                        tooltip: {
                            shared: true,
                        },
                        legend: {
                            enabled: false,
                            layout: 'vertical',
                            align: 'left',
                            x: 120,
                            verticalAlign: 'center',
                            y: 50,
                            floating: true,
                            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
                        },
                        credits: {
                            // 禁用版权信息
                            enabled: false
                        },
                        series: [{
                            name: '成交套数',
                            type: 'column',
                            yAxis: 0,
                            color: '#69C9BE',
                            data: hisData,
                            tooltip: {
                                valueSuffix: '套'
                            }
                        }, {
                            name: '换手率',
                            type: 'spline',
                            yAxis: 1,
                            color: '#ff6666',
                            data: lineData,
                            tooltip: {
                                valueSuffix: '%'
                            }
                        }]
                    });
                });
            }
        }

        window.onload = function () {
            if (vars.searchHistogram) {
                histoGram(vars.searchHistogram, '#histogram', '搜索热度', 1, '分');
            }
            if (vars.volumeMixture0) {
                drawHisline(vars.volumeMixture0);
            } else {
                $hisline.hide();
            }
        };
        // 点击居室切换，重新绘制成交走势图
        // 换手率及其说明按钮的位置
        var changeRateBtn = $('.ybzstName.mt14').children().not(':first');
        $('.jsTab').find('a').on('click', function () {
            var $ele = $(this);
            var thisIndex = $ele.index();
            $ele.addClass('cur').siblings().removeClass('cur');
            if (vars['volumeMixture' + thisIndex]) {
                if (thisIndex === 0) {
                    changeRateBtn.css('display', 'inline-block');
                    if (vars.volumeMixture0) {
                        drawHisline(vars.volumeMixture0);
                    }
                } else {
                    changeRateBtn.css('display', 'none');
                    if (vars['volumeMixture' + thisIndex]) {
                        histoGram(vars['volumeMixture' + thisIndex], '#hisLine', '套数', 0, '套');
                    }
                }
            } else {
                $hisline.hide();
            }
        });
        // 户型统计成交房源数据,饼状图
        var dataPie = JSON.parse(vars.volumePie);
        if (dataPie) {
            require.async('highcharts/5.0.6/highcharts', function (highcharts) {
                $('#pie').highcharts({
                    chart: {
                        // 饼状图
                        type: 'pie',
                        // 饼状图高
                        height: 280
                    },
                    title: {
                        text: null
                    },
                    tooltip: {
                        enabled: false
                    },
                    plotOptions: {
                        pie: {
                            innerSize: 90,
                            depth: 50
                        }
                    },
                    credits: {
                        enabled: false // 禁用版权信息
                    },
                    series: [{
                        data: dataPie
                    }]
                });
            });
        } else {
            $('#pie').hide();
        }
        // 点击浮层
        $('.jjropen').on('click', function (e) {
            $(this).hide();
        });
        var $conBox = $('.conbox');
        // 阻止默认事件
        $conBox.on('click', function (e) {
            e.stopPropagation();
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

        $('#jjrList').find('ul').css({'height':'100%','z-index':'9999','overflow':'auto'});
        var winHeight = $(window).height() * 0.668;
        var $content = $('#content');
        var liHeight = 76;
        var liLen = $content.find('li').length;
        var ulHeight = liHeight * liLen;
        if(ulHeight < winHeight){
            winHeight = ulHeight + 20;
            if(liLen === 1){
                $conBox.css('top','30%');
            }else if(liLen === 2 || liLen === 3){
                $conBox.css('top','25%');
            }


        }

        $('#jjrList').css({
            'height': winHeight + 'px',
            'width':'100%',
            'position':'relative',
            'overflow':'hidden'
        });
        var scrollObj = new iscrollNew('#jjrList',{
            scrollY: true,
            preventDefault: false,
            click:true,
            preventDefaultException: { tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|A)$/ },
            taps:true
        });
        // 房源顾问曝光量统计
        if (vars.recommendPos) {
            $.ajax({
                type: 'post',
                url: window.location.protocol + '//esfbg.3g.fang.com/fygwlist.htm',
                data: vars.recommendPos
            });
        }
        // 经纪人按钮点击
        $(".jjrclick").not('.noclick').find('.Nmes').click(function(){
            $('.Chjjropen').show();
            scrollObj.refresh();
            unable();
            // 房源顾问曝光量统计
            if (vars.agentListPos) {
                $.ajax({
                    type: 'post',
                    url: window.location.protocol + '//esfbg.3g.fang.com/fygwlist.htm',
                    data: vars.agentListPos
                });
            }
        });
        //经纪人弹框关闭按钮
        var $jjrclose = $('.jjrclose');
        $jjrclose.css({width:'50px',height:'24px',backgroundPosition:'right'});
        $jjrclose.eq(0).on('click',function(){
            $('.Chjjropen').hide();
            enable();
        });


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
         * @param groupid 聚合房源组id
         */
        function chatWeituo(zhcity, city, housetype, houseid, newcode, type, phone, channel, uname, aname, agentid, order, photourl, housefrom, groupid) {
            var xiaoqu = vars.xiaoqu || '';
            var room = vars.room || '';
            var price = vars.price || '';
            var url = '/data.d?m=houseinfotj&city=' + city + '&housetype='
                + housetype + '&newcode=' + $.trim(newcode)
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
                if (vars.housetype == 'JHDS') {
                    vars.localStorage.setItem(uname + '_allInfo', encodeURIComponent(vars.title) + ';'
                    + encodeURIComponent(vars.price + '万元') + ';' + encodeURIComponent(vars.tags.replace(/(\s*$)/g, ''))
                    + ';' + vars.titleimg + ';' + encodeURIComponent(vars.room_hall_area) + ';'
                    + encodeURIComponent(vars.district_name + '-' + vars.projname) + ';' + 'https:' + vars.esfSite + vars.city + '/'
                    + housefrom + '_' + vars.houseid + '.html');
                } else {
                    vars.localStorage.setItem(uname + '_allInfo', encodeURIComponent(vars.title) + ';'
                    + encodeURIComponent(vars.price + '万元') + ';' + encodeURIComponent(vars.tags.replace(/(\s*$)/g, ''))
                    + ';' + vars.titleimg + ';' + encodeURIComponent(vars.room_hall_area) + ';'
                    + encodeURIComponent(vars.district_name + '-' + vars.projname) + ';' + 'https:' + vars.esfSite + vars.city + '/'
                    + housefrom + '_' + vars.houseid + '_' + vars.groupid + '_' + vars.agentid + '.html');
                }

            }
            if (vars.hasOwnProperty('from') && vars.from.length > 0) {
                url += vars.from + '&product=soufun';
            } else {
                url += housefrom;
            }
            //区分聚合房源与普通房源
            if (groupid) {
                url += '&houseid=' + $.trim(groupid);
            } else {
                url += '&houseid=' + $.trim(houseid);
            }
            $.ajax(url);
            var paramPurpose = '';
            setTimeout(function () {
                window.location = '/chat.d?m=chat&username=' + uname + '&city=' + city
                    + '&type=wapesf&houseid=' + houseid + '&purpose=' + paramPurpose + '&housetype='
                    + vars.housetype + '&groupId=' + groupid;
            }, 500);
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
         // 电话联系及打电话按钮实例
        var $telBtn = $('.call');
        $telBtn.on('click', callPhone);

        // 自动拨打标识
        var autoCall;
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
        // 点击在线咨询跳转到咨询界面
        $('.mes,.mesa').on('touchstart', function () {
            var data = $(this).attr('data-chat');
            var dataArr = data.split(',');
            chatWeituo.apply(this, dataArr);
        });
        $content.on('touchstart','.mes',function () {
            var data = $(this).attr('data-chat');
            var dataArr = data.split(',');
            chatWeituo.apply(this, dataArr);
        });

        // 分页样式
        var dragBox = $('#drag');
        var ajaxurl = '';
        if (vars.housetype == 'JHDS') {
            ajaxurl =  vars.esfSite + '?c=esf&a=ajaxGetJhDsJjr&city=' + vars.city  + '&houseid=' + vars.houseid;
        } else if (vars.housetype == 'JHAGT' || vars.housetype == 'JHWAGT') {
            ajaxurl = vars.esfSite + '?c=esf&a=ajaxGetMoreAgentList&city=' + vars.city + '&groupid=' + vars.groupid + '&newcode=' + vars.newcode + '&houseid=' + vars.houseid + '&agentid=' + vars.agentid + '&housetype=' + vars.housetype;
        }
        if (dragBox.length > 0) {
            require.async('loadMore/1.0.0/loadMore', function (loadMore) {
                loadMore({
                    url: ajaxurl,
                    total: parseInt(vars.total),
                    pagesize: parseInt(vars.pagesize),
                    pageNumber: 10,
                    contentID: '#content',
                    moreBtnID: '#drag',
                    loadPromptID: '#loading',
                    isScroll:true,
                    callback:function(data){
                        // 每页房源顾问曝光率统计
                        if ($('.agentListPos' + data.pageMarloadFlag).val()) {
                            $.ajax({
                                type: 'post',
                                url: window.location.protocol + '//esfbg.3g.fang.com/fygwlist.htm',
                                data: $('.agentListPos' + data.pageMarloadFlag).val(),
                            });
                        }
                        scrollObj.refresh();
                    }
                });
            });
        }

        // 首付预算月供
        var  maskLayer = $('.esf-out-bg'), downPayment = $('#downPayment'), loanTotalPrice = vars.loanTotalPrice,
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
                    type: 1,
                    totalMoney: loanTotalPrice * 10000,
                    rate: rate,
                    month: downPaymentMonth * 12,
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

        var dataStory = vars.housestory ? JSON.parse(vars.housestory) : '';
        if (dataStory) {
            var xAxis = dataStory.date;
            var series = [];
            for (var key in dataStory) {
                if (dataStory.hasOwnProperty(key) && key !== 'date') {
                    var obj = {
                        key: key,
                        color: dataStory[key].color,
                        yAxis: []
                    };
                    for (var i = 0; i < xAxis.length; i++) {
                        obj.yAxis.push({
                            unShelve: dataStory[key].state[i] === '' ? '-' : dataStory[key].state[i] === 'off',
                            value: Number(dataStory[key].price[i]) ? dataStory[key].price[i] : '-'
                        });
                    }
                    series.push(obj);
                }
            }

            $('.fygspic').css({
                'user-select': 'none'
            }).empty();

            var l = new Line({
                id: '.fygspic',
                height: 200,
                width: $(window).width() - 20,
                xAxis: xAxis,
                series: series
            });
            l.run();

            $('.fygspic').find('.chart_tip').css({
                color: '#fff',
                'font-size': '12px',
                'line-height': '2',
                'background-color': 'rgba(0,0,0,0.8)',
                width: '170px',
                'min-width': '170px',
                'max-height': '160px',
                'border-radius': '5px',
                'z-index': '1000',
                padding: '21px 30px 23px 30px'
            });
        }
        //优选详情记cookie，如果最后进的是优选详情下次进入直接进优选列表
        cookiefile.setCookie('listAllToJh', '1', 365);
	
	// 房源描述修改（JHWAGT和JHAGT用新样式）
        if (vars.housetype === 'JHWAGT' || vars.housetype === 'JHAGT') {
            // 房源描述模块的唯一标识
            var fymsList = $('.fymsList'),
                // 房源描述中每个小标题中段落之和
                sumfyms = 0,
                // 默认展示的最大行数之和的总高度
                defaultULHeight = parseInt(fymsList.find('p').css('line-height')) * 10,
                // 默认需要展示的小标题的个数
                pnum = 0,
                // h3小标题的高度
                h3Height = parseInt(fymsList.find('h3').css('height')) + parseInt(fymsList.find('h3').css('margin-bottom')),
                // li的padding高度
                LiPaddingTop = parseInt(fymsList.find('li').css('padding-bottom'));

            // 获取每个p的实际高度
            fymsList.find('p').each(function () {
                var that = $(this);
                // 看看最多展示几个
                if (sumfyms < defaultULHeight) {
                    pnum += 1;
                }
                // 所有p的高度之和
                sumfyms += parseInt(that.css('height'));
            });

            // 所有p之和与默认高度对比，如果大于，则要先合上
            if (sumfyms > defaultULHeight) {
                fymsList.find('a').css('display', 'block');
                fymsList.find('ul').css({'max-height': (h3Height + LiPaddingTop) * pnum + defaultULHeight, 'overflow': 'hidden'});
            }

            // 如果有展开合上的按钮，则要实现展开合上的功能
            fymsList.children('a').on('click', function () {
                var that = $(this);
                if (that.hasClass('up')) {
                    that.removeClass('up');
                    fymsList.find('ul').css({'max-height': (h3Height + LiPaddingTop) * pnum + defaultULHeight, 'overflow': 'hidden'});
                } else {
                    that.addClass('up');
                    fymsList.find('ul').css({'max-height': '', 'overflow': ''});
                }
            });
        }

        // 判断用户是否对该房源进行了收藏，相应修改收藏样式
        require.async('util/util',function(util) {
            if (util.getCookie('sfut')) {
                $.ajax({
                    url: vars.mySite + '?c=mycenter&a=isAlreadySelect',
                    data:{
                        city:vars.city,
                        houseid: vars.houseid,
                        groupid: vars.groupid,
                        esfsubtype: vars.housetype.indexOf('JH') > -1 ? 'yx' : '',
                        projcode: vars.plotid,
                        purpose: vars.purpose,
                        channel: 'esf',
                        url:document.location.href
                    },
                    success: function(data) {
                        if (data.result_code === '100' || data.resultcode === '100') {
                            $collectBtn.addClass('btn-faved cur');
                        }
                    }
                });
            }
        });

        /**
         * 点击收藏
         */
        var canSave = true;
        $collectBtn.on('click', function () {
            // 调用收藏接口
            if (canSave) {
                canSave = false;
                $.ajax({
                    timeout: 3000,
                    url: vars.mySite + '?c=mycenter&a=ajaxAddMySelectOfFangYuan&city=' + vars.city
                    + '&houseid=' + vars.houseid + '&housetype=' + vars.housetype + '&channel=esf&groupid='
                    + vars.groupid + '&agentid=' + vars.agentid,
                    success: function (data) {
                        if (data.userid) {
                            if (data.myselectid) {
                                // 显示收藏提示
                                showNewCollectTips();
                                $collectBtn.addClass('btn-faved cur');
                            } else {
                                showCollectTips('已取消收藏');
                                $collectBtn.removeClass('btn-faved cur');
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

        // 点击继续看房
        $('#xuanfang_suc1').click(function () {
            $scSuc.hide();
            // 手指滑动，恢复浏览器默认事件
            enable();
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
                                    url:'http://esfbg.3g.fang.com/homebg.html',
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
    };
});