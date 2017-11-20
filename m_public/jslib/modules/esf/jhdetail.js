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
                    }
                });
            }
        }
        // 用户行为对象
        var yhxw = require('modules/esf/yhxw');
        //进页面判断用户行为来源。其他的用户行为运营在考虑，暂时用之前的不变
        var pageId = 'mesfpage';
        if (vars.housetype === 'JHAGT') {
            pageId = pageId + '^jhagt';
        } else if (vars.housetype === 'JHWAGT') {
            pageId = pageId + '^jhwagt';
        } else if (vars.housetype === 'JHJP') {
            pageId = pageId + '^jhjp';
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
            // 页面展示更多效果
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
            document.addEventListener('touchmove', preventDefault);
        }

        /**
         * 手指滑动恢复浏览器默认事件（恢复滚动
         */
        function enable() {
            document.removeEventListener('touchmove', preventDefault);
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
        //经纪人按钮点击
        $(".jjrclick").not('.noclick').click(function(){
            $('.Chjjropen').show();
            scrollObj.refresh();
            unable();
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
        $telBtn.on('click', function () {
            var data = $(this).attr('data-teltj');
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
        });
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
        } else if (vars.housetype == 'JHATG' || vars.housetype == 'JHWAGT') {
            ajaxurl = vars.esfSite + '?c=esf&a=ajaxGetMoreAgentList&city=' + vars.city + '&groupid=' + vars.groupid + '&newcode=' + vars.newcode + '&houseid=' + vars.houseid + '&agentid=' + vars.agentid;
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
                    callback:function(){
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
    };
});