/**
 * @file 建材代金券列表页
 * @author zhangxiaowei
 */
define('modules/jiaju/cashCouponList', ['jquery', 'loadMore/1.0.0/loadMore', 'lazyload/1.9.1/lazyload', 'modules/map/API/BMap', 'util/util'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var loadMore = require('loadMore/1.0.0/loadMore');
        // 惰性加载
        require('lazyload/1.9.1/lazyload');
        $('.lazyload').lazyload();
        // 数据请求失败时, 点击刷新
        $('#notfound').on('click', function () {
            window.location.reload();
        });
        require('modules/map/API/BMap');
        var BMap = window.BMap;
        //  基础工具类，用于cookie
        var Utils = require('util/util');
        var $main = $('.main');
        var $content = $('#content');
        var $loadingWrap = $('#loadingWrap');
        var $window = $(window);
        var $moreBtn = $('#clickmore');
        var isSfapp = vars.isSfapp === '1' ? '&src=client' : '&src=ss';
        var notCity = $('#notCity');
        // cookie定位信息
        var address = Utils.getCookie('address');
        var lat = Utils.getCookie('lat');
        var lng = Utils.getCookie('lng');
        var locationCity = Utils.getCookie('locationCity');

        // 更新页面
        var refreshPage = (function () {
            var canAjax = true;
            return function () {
                if (canAjax) {
                    canAjax = false;
                    $.ajax({
                        url: vars.jiajuSite + '?c=jiaju&a=ajaxCashCouponList&page=1&city=' + vars.city + '&lng=' + lng + '&lat=' + lat + '&locationCity=' + encodeURIComponent(locationCity) + '&address=' + encodeURIComponent(address) + isSfapp + '&platformid=' + vars.platformid + '&sourceid=' + vars.sourceid + '&positionid=' + vars.positionid + '&activityid=' + vars.activityid + '&activitydes=' + vars.activitydes + '&districtid=' + vars.districtid + '&areaid=' + vars.areaid + '&categoryid=' + vars.categoryid + '&type=' + vars.type,
                        success: function (data) {
                            if (+data.total > 0) {
                                $window.off('scroll');
                                $moreBtn.off('click');
                                $main.show();
                                $content.html(data.html).find('.lazyload').lazyload();
                                vars.total = data.total || 0;
                                loadMoreFn();
                                $loadingWrap.hide();
                            } else {
                                $main.hide();
                                $loadingWrap.hide();
                                notCity.show();
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
            var geolocation = new BMap.Geolocation();
            geolocation.getCurrentPosition(function (r) {
                if (this.getStatus() === window.BMAP_STATUS_SUCCESS) {
                    var gc = new BMap.Geocoder();
                    gc.getLocation(r.point, function (rs) {
                        lat = r.point.lat || '';
                        lng = r.point.lng || '';
                        address = rs.address || '';
                        locationCity = rs.addressComponents.city || '';
                        Utils.setCookie('lat', lat, 7);
                        Utils.setCookie('lng', lng, 7);
                        Utils.setCookie('address', address, 7);
                        Utils.setCookie('locationCity', locationCity, 7);
                        refreshPage();
                    });
                } else {
                    refreshPage();
                }
            }, function () {
                refreshPage();
            }, {
                enableHighAccuracy: true
            });
        }
        // 加载更多
        function loadMoreFn() {
            loadMore({
                // 接口地址
                // 需要传入经纬度以及定位城市中文
                url: vars.jiajuSite + '?c=jiaju&a=ajaxCashCouponList&city=' + vars.city + '&lng=' + lng + '&lat=' + lat + '&locationCity=' + encodeURIComponent(locationCity) + '&address=' + encodeURIComponent(address) + isSfapp + '&platformid=' + vars.platformid + '&sourceid=' + vars.sourceid + '&positionid=' + vars.positionid + '&activityid=' + vars.activityid + '&activitydes=' + vars.activitydes + '&districtid=' + vars.districtid + '&areaid=' + vars.areaid + '&categoryid=' + vars.categoryid + '&type=' + vars.type,
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
        if (address && lat && lng && locationCity) {
            loadMoreFn();
        } else {
            reLocation();
        }
    };
});
