/**
 * @file wap商家列表页
 * @author muzhaoyang 2017-05-02
 */
define('modules/jiaju/productList', [
    'jquery',
    'loadMore/1.0.0/loadMore',
    'lazyload/1.9.1/lazyload',
    'util/util',
    'modules/map/API/BMap',
    'modules/jiaju/yhxw'
], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var Utils = require('util/util');
        var loadMore = require('loadMore/1.0.0/loadMore');
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
            // 获取城市定位，然后获取第一页数据
            if (!vars.userXy) {
                getDistance();
            }
            loadMoreFn();
            var f = $('#s_type dd').hasClass('active') ? $('#s_type dd.active').text() : '';
            var f2 = $('#xifen dd').hasClass('active') && $('#xifen dd.active').text().replace(/全部/g, '') ? '^' + $('#xifen dd.active').text().replace(/全部/g, '') : '';
            var f3 = $('#searchBrand dd').hasClass('active') && $('#searchBrand dd.active').text().replace(/全部/g, '') ? '^' + $('#searchBrand dd.active').text().replace(/全部/g, '') : '';
            // 用户行为
            yhxw({
                page: 'mjjmaterial_list',
                type: 1,
                material: $('#type').text() === '所有品类' ? '所有品类' : f + f2 + f3,
                key: $('#searchtext').text(),
                order: $('#orderby').text()
            });
            // 绑定页面dom元素事件
            eventInit();
        }
        /*
         *计算两点距离，并动态插入到页面中
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
                        var distance = getGreatCircleDistance(r.point.lat, r.point.lng, Number(locations[i].split(',')[0]), Number(locations[i].split(',')[1]));
                        if (distance > 0 && distance < 1000) {
                            $(this).html(Math.floor(distance) + 'm');
                        } else if (distance < 50000) {
                            $(this).html((distance / 1000).toFixed(1) + 'km');
                        }
                    });
                } else {
                    //定位失败
                    $('#s_orderby dd')[5].hide();
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
            datatimeout.on('click', function () {
                window.location.reload();
            });
            $('.jj-fixedBtn').on('click', function () {
                var suffix = vars.is_sfapp === '1' ? '&src=client' : '';
                window.location = vars.jiajuSite + '?c=jiaju&a=jcBaoMing&city=' + vars.city + '&SourcePageID=54&refer=' + encodeURIComponent(location.href) + suffix;
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
                url: vars.jiajuSite + '?c=jiaju&a=ajaxGetProductList&city=' + vars.city + '&sortid=' + vars.sortid + '&level=' + vars.level + '&cid=' + vars.cid + '&scid=' + vars.scid + '&bid=' + vars.bid + '&q=' + encodeURIComponent(vars.q),
                // 数据总条数
                total: vars.total,
                // 首屏显示数据条数
                pagesize: 20,
                // 单页加载条数，可不设置
                pageNumber: 20,
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