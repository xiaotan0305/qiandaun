/**
 * @file wap商家列表页
 * @author muzhaoyang 2017-05-02
 */
define('modules/jiaju/firmList', [
    'jquery',
    'loadMore/1.0.0/loadMore',
    'lazyload/1.9.1/lazyload',
    'util/util',
    'slideFilterBox/1.0.0/slideFilterBox',
    'modules/map/API/BMap',
    'superShare/2.0.0/superShare',
    'weixin/2.0.1/weixinshare',
    'modules/jiaju/yhxw',
    'modules/jiaju/IconStar'
], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var Utils = require('util/util');
        var loadMore = require('loadMore/1.0.0/loadMore');
        var IScroll = require('slideFilterBox/1.0.0/slideFilterBox');
        require('lazyload/1.9.1/lazyload');
        var vars = seajs.data.vars;
        var $window = $(window);
        var $main = $('.main');
        var $loadingWrap = $('#loadingWrap');
        var datatimeout = $('#datatimeout');
        var $moreBtn = $('#clickmore');
        var $content = $('#content');
        var $float = $('.float');
        // 筛选
        var choiceContainer = $('.moreChoo');
        var btnReset = $('.btnReset');
        var btnConfirm = $('.btnConfirm');
        var filterBox = $('#filterBox');
        var choiceObj = {};
        // 评分
        var IconStar = require('modules/jiaju/IconStar');
        require.async(['modules/jiaju/ad']);
        pageInit();

        /**
         * [pageInit description] 页面初始化
         * @return {[type]} [description]
         */
        function pageInit() {
            // 图片懒加载
            $('.lazyload').lazyload();
            // 获取城市定位，然后获取第一页数据
            if (!vars.userXy) {
                getDistance();
            }
            loadMoreFn();
            // 初始化当前筛选项
            choiceInitFn();
            // 绑定页面dom元素事件
            eventInit();
            // 评分星星
            new IconStar();
            // 曝光量统计
            vars.bgtj && $.post(location.protocol + '//esfbg.3g.fang.com/homebg.html', vars.bgtj);
        }

        /*
         *计算两点距离，并动态插入到页面中
         */
        function getDistance() {
            //定位
            var geolocation = new BMap.Geolocation();
            geolocation.getCurrentPosition(function(r) {
                if (this.getStatus() === 0) {
                    //定位成功
                    Utils.setCookie('lat', r.point.lat, 7);
                    Utils.setCookie('lng', r.point.lng, 7);
                    var locations = vars.locations.split(':');
                    $('li .flor').each(function(i) {
                        var distance = getGreatCircleDistance(r.point.lat, r.point.lng, Number(locations[i].split(',')[0]), Number(locations[i].split(',')[1]));
                        if (distance > 0 && distance < 1000) {
                            $(this).html(Math.floor(distance) + 'm');
                        } else if (distance < 50000) {
                            $(this).html((distance / 1000).toFixed(1) + 'km');
                        }
                    });
                } else {
                    //定位失败
                    $('#s_rank dd')[1].hide();
                }
            }, {
                enableHighAccuracy: true
            })
        }

        /*
         *计算两点距离，跟搜索组公式一致
         */
        function getGreatCircleDistance(x1, y1, x2, y2) {
            var radius = 6378137;
            var peri = 2 * Math.PI * 6378137
            var per_x = peri / 360;
            var per_y = peri / 360;

            var x = Math.abs(x2 - x1);
            var x = x * (per_x * Math.cos(((y1 + y2) / 2) / 180 * Math.PI));
            var y = Math.abs(y2 - y1);
            var y = y * per_y;
            if (x == 0) {
                return y;
            }
            if (y == 0) {
                return x;
            }
            return Math.sqrt(x * x + y * y);
        }

        /**
         * [eventInit description] 事件初始化
         * @return {[type]} [description]
         */
        function eventInit() {
            //没有请求到数据，点击重新加载
            datatimeout.on('click', function() {
                window.location.reload();
            });
            btnReset.on('click', choiceResetFn);
            btnConfirm.on('click', choiceConfirmFn);
            choiceContainer.on('click', 'a', function() {
                choiceFn.bind(this)();
            });
        }

        /**
         * [loadMoreFn description] loadmore插件，加载更多功能函数
         * @return {[type]} [description]
         */
        function loadMoreFn() {
            loadMore({
                // 接口地址
                // 需要传入经纬度以及定位城市中文
                url: location.protocol + vars.ajaxUrl,
                // 数据总条数
                total: vars.total,
                // 首屏显示数据条数
                pagesize: 10,
                // 单页加载条数，可不设置
                pageNumber: 10,
                // 加载更多按钮id
                moreBtnID: '#clickmore',
                // 加载数据过程显示提示id
                loadPromptID: '#prompt',
                // 数据加载过来的html字符串容器
                contentID: '#content',
                loadingTxt: '努力加载中...',
                loadAgoTxt: '点击加载更多...',
                callback: function (data) {
                    new IconStar('ico-star', 'data-score', $(data));
                    // 曝光量统计
                    var bgtjMore = $('#bgtj_' + data.pageMarloadFlag).val();
                    bgtjMore && $.post(location.protocol + '//esfbg.3g.fang.com/homebg.html', bgtjMore);
                }
            });
        }

        /**
         * [choiceInitFn description] 筛选选项的 choiceObj对象初始化
         * @return {[type]} [description]
         */
        function choiceInitFn() {
            var object;
            if (!vars.rewriteFlag) {
                object = {
                    discount: 'a',
                    type: 'b',
                    price: 'c',
                    mode: 'd'
                }
                for (var pro in object) {
                    var paramValue = getUrlParam(pro);
                    if (pro === 'discount') {
                        choiceObj[object[pro]] = !paramValue ? [] : paramValue.split('');
                    } else {
                        choiceObj[object[pro]] = paramValue === '0' ? '' : paramValue;
                    }

                }
            } else {
                object = {
                    d: 'a',
                    y: 'b',
                    p: 'c',
                    m: 'd'
                }
                for (var pro in object) {
                    var paramValue = getUrlParam(pro);
                    if (pro === 'd' && paramValue) {
                        choiceObj[object[pro]] = paramValue === '0' ? [] : paramValue.split('');
                    } else {
                        choiceObj[object[pro]] = paramValue === '0' ? '' : paramValue;
                    }

                }

            }
            // console.log(choiceObj);    
        }

        /**
         * [getUrlParam description] 获取url中参数值
         * @param  {[type]} name [description] 参数名称
         * @return {[type]}      [description] 参数值
         */
        function getUrlParam(name) {
            var reg, r;
            if (!vars.rewriteFlag) {
                reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
                var r = window.location.search.substr(1).match(reg); //匹配目标参数


            } else {
                reg = new RegExp("(^|_)" + name + "([^_]*)(_|$)");
                var rehrefArr = location.href.split('/');
                var rehref = rehrefArr[rehrefArr.length - 2];
                r = rehref.match(reg);
            }
            if (r) {
                return r[2];
            }
            return null; //返回参数值
        }

        /**
         * [choiceResetFn description] 筛选选项的 重置按钮
         * @return {[type]} [description]
         */
        function choiceResetFn() {
            choiceContainer.find('a').removeClass('active');
            choiceContainer.children().each(function(index, dom) {
                choiceObj[dom.className] = '';
                if (!index) {
                    choiceObj[dom.className] = [];
                }
            });
        }

        /**
         * [choiceConfirmFn description] 筛选选项的 确定按钮
         * @return {[type]} [description]
         */
        function choiceConfirmFn() {
            var data = '';
            var nowUrl = vars.nowUrl;
            if (vars.rewriteFlag) {
                //带_的静态地址
                for (var pro in choiceObj) {
                    switch (pro) {
                        case 'a':
                            nowUrl = nowUrl.replace(/_d\d+/, '_d' + (choiceObj[pro].length ? choiceObj[pro].join('') : 0));
                            break;
                        case 'b':
                            nowUrl = nowUrl.replace(/_y\d+/, '_y' + (choiceObj[pro].length ? choiceObj[pro] : 0));
                            break;
                        case 'c':
                            nowUrl = nowUrl.replace(/_p\d+/, '_p' + (choiceObj[pro].length ? choiceObj[pro] : 0));
                            break;
                        case 'd':
                            nowUrl = nowUrl.replace(/_m\d+/, '_m' + (choiceObj[pro].length ? choiceObj[pro] : 0));
                            break;
                        default:
                            break;
                    }
                }
            } else {
                //带=的动态地址
                for (var pro in choiceObj) {
                    switch (pro) {
                        case 'a':
                            nowUrl = nowUrl.replace(/discount=\d+/, 'discount=' + (choiceObj[pro].length ? choiceObj[pro].join('') : 0));
                            break;
                        case 'b':
                            nowUrl = nowUrl.replace(/type=\d+/, 'type=' + (choiceObj[pro].length ? choiceObj[pro] : 0));
                            break;
                        case 'c':
                            nowUrl = nowUrl.replace(/price=\d+/, 'price=' + (choiceObj[pro].length ? choiceObj[pro] : 0));
                            break;
                        case 'd':
                            nowUrl = nowUrl.replace(/mode=\d+/, 'mode=' + (choiceObj[pro].length ? choiceObj[pro] : 0));
                            break;
                        default:
                            break;
                    }
                }
            }
            location.href = nowUrl;
        }

        /**
         * [choiceFn description] 筛选选项的，选项选择a
         * @return {[type]} [description]
         */
        function choiceFn() {
            var index = $(this).index();
            var parent = $(this).parent().parent().parent();
            var parClassName = parent.attr('class');
            if (parClassName === 'a') {
                var arrIndex = $.inArray(index + 1 + '', choiceObj[parClassName]);
                if (arrIndex > -1) {
                    choiceObj[parClassName].splice(arrIndex, 1);
                    $(this).removeClass('active');
                } else {
                    choiceObj[parClassName].push(index + 1 + '');
                    $(this).addClass('active');
                }
            } else {
                $(this).toggleClass('active').siblings().removeClass('active');
                var siblings = $(this).parent().siblings();
                var hasClass = $(this).hasClass('active');
                if (hasClass) {
                    choiceObj[parClassName] = index + 1 + '';
                    if (siblings.length) {
                        siblings.find('a').removeClass('active');
                        if (!siblings.index()) {
                            choiceObj[parClassName] = index + siblings.children().length + 1 + '';
                        }
                    }
                } else {
                    choiceObj[parClassName] = '';
                }
            }
        }

        // 分享功能
        var shareTitle = vars.cityname + '优质装饰公司';
        var shareDesc = '在房天下这里有很多靠谱的装饰公司，免费提供装修报价，推荐给大家';
        var shareImg = location.protocol + $content.find('img').eq(0).attr('data-original');
        var shareLink;
        if (location.href.indexOf('?') === -1) {
            shareLink = location.href + '?source=fx_zsgs';
        } else {
            shareLink = location.href.indexOf('source=fx_zsgs') === -1 ? location.href + '&source=fx_zsgs' : location.href;
        }
        var Weixin = require('weixin/2.0.1/weixinshare');
        new Weixin({
            // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            debug: false,
            shareTitle: shareTitle,
            descContent: shareDesc,
            lineLink: shareLink,
            imgUrl: shareImg,
            // 对调标题 和 描述(微信下分享到朋友圈默认只显示标题,有时需要显示描述则开启此开关,默认关闭)
            swapTitle: false
        });
        var SuperShare = require('superShare/2.0.0/superShare');
        var config = {
            // 分享的内容title
            title: shareTitle,
            // 分享时的图标
            image: shareImg,
            // 分享内容的详细描述
            desc: shareDesc,
            // 分享的链接地址
            url: shareLink,
            // 分享的内容来源
            from: '房天下家居' + vars.imgUrl + 'images/app_jiaju_logo.png'
        };
        new SuperShare(config);

        // 用户行为统计
        var yhxw = require('modules/jiaju/yhxw');
        var position;
        // 商圈，附近，地铁
        if (vars.position){
            if($('#classone_sq dd.active').text().trim() === vars.position) {
                position = $('#classone_sq dd.active').text().trim() + '^不限';
            }else{
                position = $('#classone_sq dd.active').text().trim() + '^' + vars.position;
            }
        } else if(vars.nearby){
            position = vars.nearby;
        }
        yhxw({
            type: 1,
            page: 'jj_gs^lb_wap',
            key: $('#searchtext').text(),
            position: position,
            subway: vars.subway ? $('#classone_dt dd.active').text().trim() + '^' + vars.subway : '',
            preferentialservice: vars.yhfuwu,
            fixstatustype: $('.b a.active').length ? $('.b a.active').text().trim() : '',
            totalprice: $('.c a.active').length ? $('.c a.active').text().trim() : '',
            allandhalf: $('.d a.active').length ? $('.d a.active').text().trim() : '',
            order: $('#rank').text().trim()
        });
    };
});