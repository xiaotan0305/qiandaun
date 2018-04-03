/**
 * @file wap商家列表页
 * @author muzhaoyang 2017-05-02
 */
define('modules/jiaju/shopList', [
    'jquery',
    'loadMore/1.0.0/loadMore',
    'lazyload/1.9.1/lazyload',
    'util/util',
    'slideFilterBox/1.0.0/slideFilterBox',
    'modules/map/API/BMap',
    'modules/jiaju/yhxw',
    'weixin/2.0.2/weixinshare',
    'superShare/2.0.1/superShare'
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
        require.async(['modules/jiaju/ad']);
        // 用户行为
        var yhxw = require('modules/jiaju/yhxw');
        pageInit();

        /**
         * [pageInit description] 页面初始化
         * @return {[type]} [description]
         */
        function pageInit() {
            // 图片懒加载
            $('.lazyload').lazyload();
            //如果没有定位信息，需要定位计算距离
            if (!vars.userXy) {
                getDistance();
            }
            loadMoreFn();
            // 用户行为
            yhxw({
                page: 'jj_jc^dplb_wap',
                type: 1,
                companyservice: $('#type').text(),
                key: $('#searchtext').text(),
                order: $('#sort').text(),
                material: vars.categoryid
            });
            // 绑定页面dom元素事件
            eventInit();
            // 公司置顶
            $.get(vars.jiajuSite + '?c=jiaju&a=ajaxGetShopListStick&city=' + vars.city + '&categoryid=' + vars.categoryid + '&rnd=' + Math.random(), function (data) {
                if (data && data.length && typeof data[0] === 'object') {
                    var $that, zhidingLen = data.length, ids = [], hotlistLen, couponlistLen, couponlistClass;
                    $content.find('li').each (function () {
                        $that = $(this);
                        ids.push($that.attr('data-id'));
                    });
                    
                    for (var j = 0;j < zhidingLen;j++) {
                        var str = '', pos;
                        pos= $.inArray(data[j].companyid, ids);
                        // 此处是过滤和列表第一页相同的数据
                        if (pos === -1) {
                            str += '<li><a href="' + vars.jiajuSite + '?c=jiaju&a=jcCompanyDetail&city=' + vars.city + '&companyid=' + data[j].companyid + '">';
                            str += '<div class="jj-img"><div><img class="lazyload" data-original="' + data[j].companylogo + '"></div></div>';
                            str += '<div class="txt">';
                            str += '<h3>' + data[j].companyname + '</h3>';
                            str += '<p>';
                            if (parseInt(data[j].distance) > 0) {
                                str += '<span class="flor">' + data[j].location + '</span>';
                            }
                            str += '<span class="f12 max_wid">' + data[j].companyaddress + '</span>';
                            str += '</p>';
                            str += '<p class="b-stage">';
                            hotlistLen = data[j].hotlist.length;
                            for (var i = 0;i < hotlistLen;i++) {
                                str += '<i class="i2">' + data[j].hotlist[i].name + '</i>';
                            }
                            str += '</p>';
                            couponlistLen = data[j].couponlist.length;
                            for (var k = 0;k < couponlistLen; k++) {
                                couponlistClass = data[j].couponlist[i].coupontypename === '券' ? 'activity' : 'activity cu';
                                str += '<div class="' + couponlistClass + '">' + data[j].couponlist[i].coupontypename + '</div>';
                            }
                            str += '</div>';
                            str += '</a></li>';
                            // 先插入元素，再更新数组
                            $(str).insertBefore($content.find('li:eq(' + j + ')'));
                            ids.splice(j, 0, data[j].companyid);
                        } else{
                            // 如果是和列表第一页相同的数据，则优先插入到列表最前面
                            $content.find('li').eq(pos).insertBefore($content.find('li:eq(' + j + ')'));
                            // 先删除原来的重复元素，再更新数组
                            ids.splice(pos, 1);
                            ids.splice(j, 0, data[j].companyid);
                        }
                        
                    }
                    
                    $('.lazyload').lazyload();
                }
                // 曝光量统计
                vars.bgtj && $.post(location.protocol + '//esfbg.3g.fang.com/homebg.html', vars.bgtj);
            });
        }

        var EARTH_RADIUS = 6378137.0; //单位M  
        var PI = Math.PI;

        function getRad(d) {
            return d * PI / 180.0;
        }

        /** 
         * caculate the great circle distance 
         * @param {Object} lat1 
         * @param {Object} lng1 
         * @param {Object} lat2 
         * @param {Object} lng2 
         */
        function getGreatCircleDistance(lat1, lng1, lat2, lng2) {
            var radLat1 = getRad(lat1);
            var radLat2 = getRad(lat2);

            var a = radLat1 - radLat2;
            var b = getRad(lng1) - getRad(lng2);

            var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
            s = s * EARTH_RADIUS;
            s = Math.round(s * 10000) / 10000000;

            return s.toFixed(1);
        }

        /** 
         * 异步加载距离字段
         */
        function getDistance() {
            //定位
            var geolocation = new BMap.Geolocation();
            geolocation.getCurrentPosition(function (r) {
                if (this.getStatus() === 0) {
                    //定位成功
                    Utils.setCookie('lat', r.point.lat, 7);
                    Utils.setCookie('lng', r.point.lng, 7);
                    var locations = vars.locations.split(':');
                    $('li .flor').each(function (i) {
                        var distance = getGreatCircleDistance(r.point.lat, r.point.lng, locations[i].split(',')[0], locations[i].split(',')[1]);
                        if (distance <= 50) {
                            $(this).html(distance + 'km');
                        }
                    });
                } else {
                    //定位失败
                    $('#s_sort dd')[1].hide();
                }
            }, {
                    enableHighAccuracy: true
                })
        }

        /**
         * [eventInit description] 事件初始化
         * @return {[type]} [description]
         */
        function eventInit() {
            //没有请求到数据，点击重新加载
            datatimeout.on('click', function () {
                window.location.reload();
            });
            $('.jj-fixedBtn').on('click', function () {
                var suffix = vars.is_sfapp === '1' ? '&src=client' : '';
                window.location = vars.jiajuSite + '?c=jiaju&a=jcBaoMing&city=' + vars.city + '&SourcePageID=55&refer=' + encodeURIComponent(location.href) + suffix;
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
                url: vars.jiajuSite + '?c=jiaju&a=ajaxGetShopList&city=' + vars.city + '&categoryid=' + vars.categoryid + '&typeid=' + vars.typeid + '&sortid=' + vars.sortid + '&q=' + encodeURIComponent(vars.q),
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
                    // 曝光量统计
                    var bgtjMore = $('#bgtj_' + data.pageMarloadFlag).val();
                    bgtjMore && $.post(location.protocol + '//esfbg.3g.fang.com/homebg.html', bgtjMore);
                }
            });
        }

        /* 分享*/
        var detailOptions = {
            // 分享给朋友
            onMenuShareAppMessage: {
                shareTitle: '家具建材店铺大全',
                descContent: '一大波好店来袭，赶快去看看！'
            },
            // 分享到朋友圈
            onMenuShareTimeline: {
                shareTitle: '家具建材店铺大全',
                descContent: ''
            }
        };
        var Weixin = require('weixin/2.0.2/weixinshare');
        new Weixin({
            debug: false,
            detailOptions: detailOptions,
            lineLink: location.href,
            imgUrl: 'https://static.soufunimg.com/common_m/m_public/201511/images/fang.png',
            // 对调标题 和 描述(微信下分享到朋友圈默认只显示标题,有时需要显示描述则开启此开关,默认关闭)
            swapTitle: false
        });
        var SuperShare = require('superShare/2.0.1/superShare');
        var superShare = new SuperShare({
            image: 'https://static.soufunimg.com/common_m/m_public/201511/images/fang.png',
            url: location.href,
            from: '房天下家居'
        }, detailOptions);
        $('.icon-share').on('click', function () {
            superShare.share();
        });
    };
});