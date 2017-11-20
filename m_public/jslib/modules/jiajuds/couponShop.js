/**
 * @file 优惠券店铺列表页
 * created by muzhaoyang 2017 - 04 - 18
 */
define('modules/jiajuds/couponShop', ['jquery', 'loadMore/1.0.0/loadMore', 'lazyload/1.9.1/lazyload', 'util/util'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var loadMore = require('loadMore/1.0.0/loadMore');
        // 惰性加载
        require('lazyload/1.9.1/lazyload');
        $('.lazyload').lazyload();
        //  基础工具类，用于cookie
        var Utils = require('util/util');
        var $main = $('.main');
        var $window = $(window);
        var $moreBtn = $('#clickmore');
        var $content = $('#content');
        var $loadingWrap = $('#loadingWrap');
        var $weixinTip = $('#wxTip')
        var lat = Utils.getCookie('lat-g');
        var lng = Utils.getCookie('lng-g');
        var canAjax = true;
        //google定位
        var navGeo = navigator.geolocation;
        pageInit();

        /**
         * [pageInit description] 页面初始化
         * @return {[type]} [description]
         */
        function pageInit () {
            // 获取城市定位，然后获取第一页数据
            if (lat && lng) {
                loadMoreFn();
            } else {
                reLocation();
            }
            if($weixinTip.is(':visible')) {
                vars.jiajuUtils.toggleTouchmove(true);
            }
            $main.on('click', '#datatimeout', function () {
                window.location.reload();
            });
            $weixinTip.find('img').eq(1).on('click',function () {
                $weixinTip.hide();
                vars.jiajuUtils.toggleTouchmove(false);
            });
            setTimeout(function () {
                $('#alpha').hide();
            },400);
        }

        /**
         * [refreshPage description] 首次进入后，获取第一个数据并替换模板数据
         * @return {[type]} [description]
         */
        function refreshPage() {
            if (canAjax) {
                canAjax = false;
                $.ajax({
                    url: location.protocol + vars.ajaxUrl + '&page=1',
                    success: function (data) {
                        if(!data) {
                            window.location.reload();
                        } else {
                            $window.off('scroll');
                            $moreBtn.off('click');
                            $content.html('').prepend(data).find('.lazyload').lazyload();
                            $main.show();
                            $loadingWrap.hide();
                            loadMoreFn();
                        }
                    },
                    complete: function () {
                        canAjax = true;
                    }
                });
            }
        }

        /**
         * [reLocation description] 没有经纬度的时候，进行定位函数
         * @return {[type]} [description]
         */
        function reLocation() {
            lat = lng = '';
            if (navGeo) {
                // 如果能够是用定位api时，获取当前位置
                navGeo.getCurrentPosition(function (position) {
                    var latitude = position.coords.latitude;
                    var longitude = position.coords.longitude;
                    Utils.setCookie('lat-g', latitude, 7);
                    Utils.setCookie('lng-g', longitude, 7);
                    if (+vars.timeout === 1){
                        window.location.reload();
                    } else if(+vars.total === 0) {
                        $loadingWrap.hide();
                    } else {
                        refreshPage();
                    }
                }, function () {
                    if (+vars.timeout === 1){
                        window.location.reload();
                    } else if(+vars.total === 0) {
                        $loadingWrap.hide();
                    } else {
                        refreshPage();
                    }
                }, {
                    enableHighAccuracy: true
                });
            } else {
                refreshPage();
            }
        }

        // 加载更多
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
                loadAgoTxt: '点击加载更多...'
            });
        }
    };
});