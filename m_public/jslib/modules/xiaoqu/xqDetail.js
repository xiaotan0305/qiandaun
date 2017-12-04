/**
 * @file 查房价小区改版
 * @author yk and zcf(zhangcongfeng@soufun.com)
 */
define('modules/xiaoqu/xqDetail', ['jquery', 'swipe/3.10/swiper', 'floatAlert/1.0.0/floatAlert', 'chart/line/1.0.2/line', 'highcharts/5.0.12/highcharts', 'iscroll/2.0.0/iscroll-lite'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var Swiper = require('swipe/3.10/swiper');
        var Line = require('chart/line/1.0.2/line');
        var iscrollNew = require('iscroll/2.0.0/iscroll-lite');
        //isbd代表哥伦布百度搜索定制页面
        var detailFun = {
            // 存储走势图的数据,避免多个ajax请求
            dataArr: {},
            // 是否已经收藏过该小区
            getAddFavState: function () {
                var url = vars.mySite + '?c=mycenter&a=isAlreadySelect&city=' + vars.city + '&projcode=' + vars.newcode
                    + '&purpose=' + vars.purpose + '&channel=esf';
                if (vars.isbd === 'isbd') {
                    var oFavIcon = $('.attention');
                } else {
                    var oFavIcon = $('.icon-fav');
                }
                // 收藏icon
                $.get(url, function (data) {
                    if (data.result_code === '100') {
                        if (vars.isbd === 'isbd') {
                            oFavIcon.html('<i></i>已关注');
                            oFavIcon.addClass('on');
                        } else {
                            oFavIcon.addClass('cur');
                        }
                    }
                });
            },
            // 添加收藏功能
            addFav: function () {
                if (vars.isbd === 'isbd') {
                    var oFavIconOnImg = $('.attention');
                } else {
                    var focus = $('.xqfocus');
                    var header = $('.header .head-icon ');
                    var oFavIconOnImg = focus.find('.icon-fav');
                    // 图片上边的 收藏icon
                    var oFavIconOnHeader = header.find('.icon-fav');
                    oFavIconOnHeader.on('click', addFavFun);
                }
                // 收藏弹框实例
                var scSuc = $('#scSuc');
                // header上的收藏icon
                oFavIconOnImg.on('click', addFavFun);
                if (vars.isbd === 'isbd') {
                    var oFavIcon = $('.attention');
                }
                function addFavFun() {
                    if (!vars.isbd) {
                        var that = this;
                    }
                    var url = vars.mySite + '?c=mycenter&a=ajaxMySelect&city=' + vars.city + '&xqid=' + vars.newcode;
                    $.get(url, function (data) {
                        if (!vars.isbd) {
                            $(that).append('');
                        }
                        if (data.userid) {
                            if (data.myselectid) {
                                scSuc.show();
                                if (vars.isbd === 'isbd') {
                                    oFavIcon.html('<i></i>已关注');
                                    oFavIcon.addClass('on');
                                } else {
                                    $(that).addClass('cur');
                                    oFavIconOnHeader.addClass('cur');
                                    oFavIconOnImg.addClass('cur');
                                }
                                _ub.collect(21, {'vmv.projectid': vars.newcode, 'vmg.page': 'mcfjpage'});
                            } else {
                                if (vars.isbd === 'isbd') {
                                    showMsg('已取消关注');
                                    oFavIcon.html('<i></i>关注小区');
                                    oFavIcon.removeClass('on');
                                } else {
                                    showMsg('已取消收藏');
                                    oFavIconOnHeader.removeClass('cur');
                                    oFavIconOnImg.removeClass('cur');
                                }
                            }
                        } else {
                            window.location.href = 'https://m.fang.com/passport/login.aspx?burl=' + window.location.href;
                        }
                    });
                }

                // 点击继续看房
                $('#xuanfang_suc1').click(function () {
                    scSuc.hide();
                });

                // 添加收藏与取消收藏 提示消息封装
                function showMsg(str) {
                    var width = document.body.offsetWidth / 2 - 50;
                    var favMsg = $('#favorite_msg');
                    favMsg.show().css({top: '250px', left: width + 'px'}).html(str);
                    var timer = setTimeout(function () {
                        favMsg.hide();
                        clearTimeout(timer);
                    }, 2000);
                }
            },
            // 滚动隐藏头部
            hideNavWhenScroll: function () {
                var navImgObjs = $('.xqfocus a:lt(3)');
                var navHeadObjs = $('.header');
                var scrollH = 0;
                // navHeadObjs.hide();
                navImgObjs.show();
                $(window).on('scroll', scrollFn);
                function scrollFn() {
                    if ($('.newNav').is(':hidden')) {
                        scrollH = $(this).scrollTop();
                        navHeadObjs.addClass('xiaoqu-style').css('position', 'fixed').show();

                        if (scrollH <= 200) {
                            navHeadObjs.css('opacity', scrollH / 200);
                            if (scrollH === 0) {
                                navHeadObjs.hide();
                            }
                            // 向下移动屏幕
                            if (scrollH <= 150) {
                                navImgObjs.css('opacity', 1 - scrollH / 150);
                            } else {
                                navHeadObjs.children().filter('.left,.head-icon').css('opacity', scrollH / 50);
                            }
                            // 向上移动屏幕
                        } else {
                            navHeadObjs.css('opacity', 1);
                        }
                    } else {
                        navImgObjs.show();
                        navHeadObjs.show().addClass('xiaoqu-style').css({position: 'relative', opacity: '1'});
                    }
                }
            },
        };

        var showAgent = $('.tj-mes');
        if (showAgent.length) {
            // 咨询经纪人弹窗
            showAgent.on('click', function () {
                // ajax判断经纪人是否在线
                $.ajax({
                    url: '/xiaoqu/?c=xiaoqu&a=ajaxGetOnline&managename=' + vars.managername,
                    dataType: 'json',
                    type: 'GET',
                    success: function (data) {
                        if (data) {
                            for (var name in data) {
                                if (data.hasOwnProperty(name)) {
                                    var val = data[name];
                                    var el = $(document.getElementById(name));
                                    if (val !== '1') {
                                        el.removeClass('mes').addClass('mesa');
                                    } else {
                                        el.removeClass('mesa').addClass('mes');
                                    }
                                }
                            }
                        }
                    }
                });
                $('.jjropen').show();
            });
        }
        $('.conbox').on('click', function (e) {
            e.stopPropagation();
        });
        //点击空白区域弹窗消失
        $('.jjropen').on('click', function (e) {
            $(this).hide();
        });
        // 在线咨询函数
        function chatWeituo(zhcity, city, housetype, houseid, newcode, type, phone, channel, uname, aname, agentid, order, photourl, housefrom) {
            if (vars.localStorage) {
                window.localStorage.setItem(String(uname), encodeURIComponent(aname) + ';'
                    + photourl + ';' + encodeURIComponent(vars.district + '的'));
            }
            $.ajax({
                url: '/data.d?m=houseinfotj&zhcity=' + zhcity + '&city=' + city + '&housetype=' + housetype + '&houseid=' + houseid
                + '&newcode=' + newcode + '&type=' + type + '&phone=' + phone + '&channel=' + channel + '&agentid='
                + agentid + '&order=' + order + '&housefrom=' + housefrom,
                async: false
            });
            setTimeout(function () {
                window.location = '/chat.d?m=chat&username=' + uname + '&city=' + city;
            }, 500);
        }

        // 点击在线咨询跳转到咨询界面
        $('.mes').on('click', function () {
            var data = $(this).attr('data-chat');
            var dataArr = data.split(',');
            chatWeituo.apply('this', dataArr);
        });


        $(function () {
            detailFun.getAddFavState();
            detailFun.hideNavWhenScroll();
        });
        //不是活动定制页面时直接加载小区价格参考js,如果是活动页面,则要点击展开之后再进行加载
        if (!vars.isbd) {
            Zs();
        }
        var $moreXq = $('.more_xq');
        // 小区详情的显示隐藏切换
        $moreXq.not('#nearSchool').on('click', function () {
            $(this).toggleClass('up');
            $('#box5').toggle();
            $('.moreBaseInfo').toggle();
            if (vars.isbd) {
                Zs();
            }
        });

        /**
         * 锚点定位函数
         * @param ancherId 锚点名称
         * @param contId 锚点对应的页面内容id
         */

        function ancherLocation(ancherId, contId) {
            if (window.location.href.indexOf(ancherId) !== -1) {
                $('html, body').animate({
                    scrollTop: $(contId).offset().top - $('.header').height()
                }, 1);
                // 锚点为小区详情锚点时 展看详情介绍
                if (ancherId === '#xqdetail') {
                    $('#box5').show();
                    $moreXq.addClass('up');
                }
            }
        }

        function Zs() {
            // +++++++添加房价走势图 modified by zdl
            // 获取数据并绘制走势图
            // 如果进入小区的页面带有苗点 则滚动到走势图的位置
            $('#chartCon').empty();
            // 判断走势图数据如果为空说明没有获取过数据，则执行初始化，否则以存储过的数据画图
            $.ajax({
                url: vars.pingguSite + '?c=pinggu&a=ajaxGetDetailDraw&city=' + vars.city
                + '&topnum=' + 12
                + '&newcode=' + vars.newcode
                + '&district=' + vars.district,
                success: function (data) {
                    // 房价走势图锚点定位
                    ancherLocation('#xqdeal', '#xqdeal');
                    // 房源描述锚点定位
                    ancherLocation('#xqdetail', '#box4');
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
                        var l = new Line({
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


        var focus = $('.xqfocus'),
            oFavIconOnNav = focus.find('.icon-nav');
        // 图片上边的 导航icon
        $('.header').css({position: 'relative', opacity: '1', display: 'none'});
        oFavIconOnNav.on('click', function () {
            $('.header').show().css({
                position: 'relative',
                top: 0,
                left: 0,
                'z-index': '999',
                width: '100%',
                opacity: '1'
            });
        });
        $(".bannerImg").on('touchmove', function () {
            window.location = $(this).attr("href");
        });

        // 添加底部内链导航
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

        // 初始化导航信息
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
        // 百度定制活动
        if (vars.isbd === 'isbd') {
            var imgW = parseInt($(document).width());
            var imgH = imgW * 0.75;
            $('.xqswiper-slide').find('img').css({width: imgW + 'px', height: imgH + 'px'});

            //附近小区图片轮播,swiper.js
            new Swiper('#xqSwiper', {
                speed: 500,
                loop: true,
                wrapperClass: 'xqwrapper',
                bulletClass: 'my-bullet',
                slideClass: 'xqswiper-slide',
                pagination: '.b-list',
                bulletActiveClass: 'spcss'

            });
            // 插入搜索js
            require.async('search/cfj/cfjSearch', function (cfjSearch) {
                var esfSearch = new cfjSearch();
                // 设置搜索按钮
                esfSearch.setShowPopBtn('.input');
                esfSearch.init();
            });
            // 小区房源中租房二手房切换
            var $esfSource = $('.esfSource');
            var $zfSource = $('#zfSource');
            var $zfSourceCla = $('.zfSource');
            $esfSource.on('click', function () {
                // 显示二手房房源
                $('#esfSource').show();
                // 隐藏租房房源
                $zfSource.hide();
                // 给二手房标签添加样式
                $(this).addClass('cur');
                // 移除租房标签添加样式
                $zfSourceCla.removeClass('cur');
            });
            // 小区房源中租房二手房切换
            $zfSourceCla.on('click', function () {
                // 隐藏二手房房源
                $('#esfSource').hide();
                // 显示租房房源
                $zfSource.show();
                // 给租房标签添加样式
                $(this).addClass('cur');
                // 移除二手房标签添加样式
                $esfSource.removeClass('cur');
            });
            // 小区房源中租房二手房切换，当只有租房时
            if (vars.haveZf && vars.haveZf === 'haveZf' && !vars.haveesf) {
                // 显示租房房源
                $zfSource.show();
                $zfSourceCla.addClass('cur');
            }
        }

        // 周边学校
        var $nearSchool = $('#nearSchool');
        $nearSchool.on('click', function () {
            if ($nearSchool.hasClass('up')) {
                $('.cfj-answer').css('max-height', '135px');
                $nearSchool.removeClass('up');
            } else {
                $('.cfj-answer').css('max-height', '');
                $nearSchool.addClass('up');
            }
        });

        // 布码
        // var avePrice = vars.avePrice + '^' + encodeURI('元/平方米');
        require.async('jsub/_vb.js?c=mcfjpage');
        require.async('jsub/_ubm.js?v=201407181100', function () {
            // 所在城市（中文）
            _ub.city = vars.cityname;
            // 新房的页面值为 'n'、二手房为 'e'、租房为 'z'、注意房贷计算器页此处值为g
            // 新房“n”，二手房e，租房n，查房价v,家居h，资讯i,知识k
            _ub.biz = 'v';
            // 方位 ，网通为0，电信为1，如果无法获取方位，记录0
            _ub.location = vars.cityns === 'n' ? 0 : 1;
            // b值 0：浏览
            var b = 0;
            var pTemp = {
                'vmv.projectid': vars.newcode,
                // 楼盘id
                'vmg.page': 'mcfjpage'
                // 所属页面
            };
            var p = {};
            // 若pTemp中属性为空或者无效则不传入
            for (var temp in pTemp) {
                if (pTemp[temp] && pTemp[temp] !== 'undefined') {
                    p[temp] = pTemp[temp];
                }
            }
            _ub.collect(b, p);
            detailFun.addFav();
        });
        // 小区点击二手房房源详情uv转化
        $('a.uuid').on('click', function () {
            var data_href = $(this).attr('href');
            var sep = data_href.indexOf('?') === -1 ? '?' : '&';
            window.location = data_href + sep + 'xiaoqu_uuid=wap.' + vars.city + '.' + vars.newcode;
            return false;
        });
        // 小区点评测uv转化
        $('#wapxqxqy_D15_03 a').on('click', function () {
            var data_href = $(this).attr('href');
            if (data_href.indexOf('13202_') > -1) {
                window.location = data_href + '?tongji=xqcpwap';
                return false;
            }
            return true;
        });
        // 小区点评模块动态加载
        $.ajax({
            url: vars.xiaoquSite + '?c=xiaoqu&a=ajaxGetXqComment',
            data: {city: vars.city, xqid: vars.newcode, projname: vars.projname, showHdEntrance: vars.showHdEntrance},
            success: function (data) {
                if (data) {
                    $('.xqComment').after(data);

                    // 百度特殊锚点定位功能
                    var xqdp = $('.xqdp');
                    if (xqdp.length > 0 && (window.location.href.indexOf('p=comment') > -1) && (window.location.href.indexOf('sf_source=bdjzs_esf') > -1)) {
                        var mTop = xqdp.offset().top;
                        setTimeout(function () {
                            window.scrollTo(0, mTop);
                        }, 100);
                    }

                    getComment();
                }
            }
        });

        // 提示信息
        function show(keywords) {
            var $msgObj = $('#sendFloat');
            var $msg = $('#sendText');
            $msg.text(keywords);
            $msgObj.fadeIn();
            setTimeout(function () {
                $msgObj.fadeOut();
            }, 2000);
        }

        //点评操作
        function getComment() {
            // 点击更多的箭头
            var $moreBtn = $('.more_dp');
            $moreBtn.each(function () {
                var $this = $(this);
                var $comment = $this.prev().find('p');
                var $height = parseInt($this.prev().css('max-height'));
                if ($comment.height() > $height) {
                    $this.css('display', 'block')
                }
            });
            $moreBtn.on('click', function () {
                var $ele = $(this);
                var $comment = $ele.prev();
                if ($comment.css('max-height') === '100px') {
                    $comment.css('max-height', '100%');
                    $ele.addClass('up');
                } else {
                    $comment.css('max-height', '100px');
                    $ele.removeClass('up');
                }
            });
            // 点赞地址
            var url = vars.xiaoquSite + '?c=xiaoqu&a=ajaxXqAgree';
            var param = {};
            // 点赞
            $('.dpinfodz').on('click', function () {
                var $ele = $(this);
                if ($ele.find('i').hasClass('cur')) {
                    show('您已经点过赞了');
                    return false;
                }
                param.tid = $ele.attr('data-tid');
                param.newcode = vars.newcode;
                $.ajax({
                    url: url,
                    data: param,
                    success: function (data) {
                        if (data) {
                            if (data.url) {
                                window.location.href = data.url;
                                return false;
                            }
                            // 100的时候表示成功
                            if (data.rescode && data.rescode === '100') {
                                var dzCount = Number($ele.text()) + 1;
                                $ele.html('<i class="cur"></i>' + dzCount);
                            } else {
                                show(data.resmsg);
                            }
                        }
                    }
                });
            });
            // 点击我要点评
            $('.dpbtn02').on('click', function () {
                var param = {
                    newcode: vars.newcode,
                    city: vars.city
                };
                $.ajax({
                    url: vars.xiaoquSite + '?c=xiaoqu&a=ajaxCheckComment',
                    data: param,
                    success: function (data) {
                        if (data) {
                            if (data.url) {
                                window.location.href = data.url;
                                return false;
                            }
                            if (data.code === '100') {
                                window.location.href = vars.xiaoquSite + '?a=xqWriteComment&projname=' + vars.projname + '&city=' + vars.city + '&newcode=' + vars.newcode;
                            } else {
                                show(data.message);
                            }
                        }
                    },
                    error: function (errmsg) {
                        show(errmsg);
                    }
                });
            });
        }

        // ajax加载家居需求
        if ($('#zxexample').length) {
            $.ajax({
                url: vars.esfSite + '?c=esf&a=ajaxIncJiajuModule&city=' + vars.city + '&plotid=' + vars.newcode + '&channel=xiaoqu',
                success: function (data) {
                    if (data) {
                        $('#zxexample').append(data);
                    }
                }
            });
        }
        if(vars.xqPropertyInfo) {
            var pjData = vars.xqPropertyInfo.split(',');
            var i = 0;
            for (; i < pjData.length; i++) {
                pjData[i] = Number(pjData[i]);
            }
            $('#container').css('width', '60%');
            $('.xqgrade').find('.s1').css('padding-top', 0);
            var imgWidth = $(document).width() * 0.6;
            var wyPj = '物业<br>评级';
            var bkPj = '板块<br>评级';
            // 添加小区评级蜘蛛图
            require.async('highcharts/5.0.12/highcharts-more', function (highcharts) {
                $('#container').highcharts({
                    chart: {
                        polar: true,
                        type: 'area',
                        height: 200,
                        width: imgWidth,
                        top: 20
                    },
                    plotOptions: {
                        area: {
                            marker: {
                                fillColor: '#d7494a',
                                enabled: true,
                                symbol: 'circle',
                                radius: 2,
                                states: {
                                    hover: {
                                        enabled: true
                                    }
                                }
                            }
                        }
                    },
                    // 版权
                    credits: {
                        enabled: false
                    },
                    title: {
                        text: null
                    },
                    pane: {
                        size: '47%'
                    },
                    xAxis: {
                        gridLineWidth: 0,
                        categories: ['活跃度评级', wyPj, '教育评级', bkPj],
                        tickmarkPlacement: 'on',
                        lineWidth: 0,
                        labels: {
                            style: {
                                color: '#aaa'
                            }
                        }

                    },
                    yAxis: {
                        allowDecimals: true,
                        labels: {
                            enabled: false
                        },
                        gridLineInterpolation: 'polygon',
                        gridLineColor: '#fcc',
                        lineColor: '#fcc',
                        min: 0,
                        max: 5,
                        tickAmount: 6
                    },
                    tooltip: {
                        enabled: false,
                        shared: true,
                        pointFormat: '<span style="color:{series.color}"><b>{point.y}</b><br/>'
                    },
                    legend: {
                        enabled: false
                    },
                    series: [{
                        data: pjData,
                        color: '#fcc',
                        lineWidth: 0,
                        fillOpacity: 0.5,
                        pointPlacement: 'on'
                    }]
                });
            });
            var floatAlert = require('floatAlert/1.0.0/floatAlert');
            var option = {
                type: '2'
            };
            var floatObj = new floatAlert(option);
            $('#xqpjBtn').on('click', function () {
                floatObj.showMsg('小区评级主要通过四个方面的维度综合评估，包括小区活跃度、小区物业、小区所在板块、小区的教育资源。根据这四个维度能够比较全面的认识该小区的软硬件信息，为购房者提供相对全面合理的购房参考。');
                return false;
            });
        }
        // 还看过哪些小区横切样式和滑动
        var lookedXQUl = $('#lookedXQ');
        if (lookedXQUl.length) {
            var $lookedLis = lookedXQUl.find('li'),
                lookedXQLiLen = $lookedLis.length;
            lookedXQUl.find('ul').width($lookedLis.eq(0).width() * lookedXQLiLen + lookedXQLiLen * 15 + 15);
            new iscrollNew('#lookedXQ', {scrollX: true});
        }

        // 附近小区横切样式和滑动
        var nearXQUl = $('#nearXQ');
        if (nearXQUl.length) {
            var $nearLis = nearXQUl.find('li'),
                nearXQLiLen = $nearLis.length;
            nearXQUl.find('ul').width($nearLis.eq(0).width() * nearXQLiLen + nearXQLiLen * 15 + 15);
            new iscrollNew('#nearXQ', {scrollX: true});
        }
    };
});