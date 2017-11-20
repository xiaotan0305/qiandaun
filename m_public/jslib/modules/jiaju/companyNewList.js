/**
 * @file 装修公司列表页
 * @author zhangxiaowei
 */
define('modules/jiaju/companyNewList', ['jquery', 'loadMore/1.0.0/loadMore', 'lazyload/1.9.1/lazyload', 'modules/map/API/BMap', 'util/util'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var loadMore = require('loadMore/1.0.0/loadMore');
        // 惰性加载
        require('lazyload/1.9.1/lazyload');
        $('.lazyload').lazyload();
        require('modules/map/API/BMap');
        var BMap = window.BMap;
        //  基础工具类，用于cookie
        var Utils = require('util/util');
        var $main = $('.main');
        var $loadingWrap = $('#loadingWrap');
        var $window = $(window);
        var $moreBtn = $('#clickmore');
        var isSfapp = vars.isSfapp === '1' ? '&src=client' : '';
        var notCity = $('#notCity');
        var content = $('#content');
        var ajaxnotfound = $('.ajaxnotfound');
        var contentBox = $('#contentBox');
        var clickmore = $('#clickmore');
        var lately = $('#lately');
        var $body = $('body');
        // cookie定位信息
        var lat = Utils.getCookie('lat');
        var lng = Utils.getCookie('lng');
        // 数据请求失败时, 点击刷新
        ajaxnotfound.on('click', function () {
            window.location.reload();
        });
        // 更新页面
        var refreshPage = (function () {
            var canAjax = true;
            return function () {
                if (canAjax) {
                    canAjax = false;
                    $.ajax({
                        url: vars.jiajuSite + '?c=jiaju&a=ajaxCompanyNewList&page=1&city=' + vars.city + '&q=' + vars.q + '&sort=' + vars.sort + '&regionname=' + vars.regionname + '&lng=' + lng + '&lat=' + lat + isSfapp,
                        success: function (data) {
                            if (data === '') {
                                contentBox.hide();
                                clickmore.hide();
                                notCity.hide();
                                ajaxnotfound.show();
                            } else if (data === 'nodata') {
                                contentBox.hide();
                                clickmore.hide();
                                notCity.show();
                                ajaxnotfound.hide();
                            } else {
                                $window.off('scroll');
                                $moreBtn.off('click');
                                $main.find('#content>li').remove();
                                $main.show();
                                content.prepend(data.html).find('.lazyload').lazyload();
                                vars.total = data.total || 0;
                                loadMoreFn();
                                $loadingWrap.hide();
                                $body.css('background','');
                            }
                        },
                        complete: function () {
                            canAjax = true;
                        }
                    });
                }
            };
        })();
        // 重新定位
        function reLocation() {
            lat = lng = '';
            var geolocation = new BMap.Geolocation();
            geolocation.getCurrentPosition(function (r) {
                if (this.getStatus() === window.BMAP_STATUS_SUCCESS) {
                    lat = r.point.lat;
                    lng = r.point.lng;
                    Utils.setCookie('lat', lat, 7);
                    Utils.setCookie('lng', lng, 7);
                    refreshPage();
                } else {
                    refreshPage();
                    lately.hide();
                }
            }, function () {
                refreshPage();
                lately.hide();
            }, {
                enableHighAccuracy: true
            });
        }
        // 加载更多
        function loadMoreFn() {
            loadMore({
                // 接口地址
                // 需要传入经纬度以及定位城市中文
                url: vars.jiajuSite + '?c=jiaju&a=ajaxCompanyNewList&city=' + vars.city + '&q=' + vars.q + '&sort=' + vars.sort + '&regionname=' + vars.regionname + '&lng=' + lng + '&lat=' + lat + isSfapp,
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
        if (lat && lng) {
            loadMoreFn();
        } else {
            reLocation();
        }
        $main.on('click', '.relocation', function () {
            reLocation();
        });
    };
});