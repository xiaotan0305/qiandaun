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
    'modules/jiaju/yhxw'
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
                page: 'mjjshoplist',
                type: 1,
                companyservice: $('#type').text(),
                key: $('#searchtext').text(),
                order: $('#sort').text(),
                material: $('#category').text()
            });
            // 绑定页面dom元素事件
            eventInit();
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
                loadAgoTxt: '点击加载更多...'
            });
        }
    };
});