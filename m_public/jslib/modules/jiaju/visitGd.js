/**
 * Created by Young on 15-7-26.
 * Modified by zdl on 15-9-10.
 */
define('modules/jiaju/visitGd', ['jquery', 'lazyload/1.9.1/lazyload', 'modules/jiaju/loadnewmore', 'iscroll/1.0.0/iscroll', 'lazyload/1.9.1/lazyload'],
    function (require, exports, module) {
        'use strict';
        module.exports = function () {
            var $ = require('jquery');
            var vars = seajs.data.vars;
            //惰性加载
            require('lazyload/1.9.1/lazyload');
            $('.lazyload').lazyload();
            //加载更多
            var loadnewmore = require('modules/jiaju/loadnewmore');
            loadnewmore({
                a: 'jiaju',
                url: vars.jiajuSite + '?c=jiaju&a=ajaxGetVisitGdList&city=' + vars.city + '&order=' + vars.order + '&caseroomid=' + vars.caseroomid + '&pricetype=' + vars.pricetype + '&orderstage=' + vars.orderstage + '&x=' + vars.longitude + '&y=' + vars.latitude + '&distance=' + vars.distance + '&q=' + encodeURIComponent(vars.q)
            });
            // 获取经纬度并显示
            function showPosition(position) {
                // 获取当前时间
                var date = new Date();
                // 保存1天
                date.setTime(date.getTime() + 24 * 3600 * 1000);
                // 将x和y两个cookie设置为1天后过期
                document.cookie = 'geolocation_x=' + position.coords.longitude + '; ' + 'expires=' + date.toGMTString();
                document.cookie = 'geolocation_y=' + position.coords.latitude + '; ' + 'expires=' + date.toGMTString();
                // alert("经度："+position.coords.longitude+"纬度："+position.coords.latitude);
                window.location.reload();
            }

            function showError() {}
            // 定位
            function getLocation() {
                if (navigator.geolocation) {
                    // 判断是否支持地理定位
                    // 如果支持，则运行getCurrentPosition()方法。
                    navigator.geolocation.getCurrentPosition(showPosition, showError);
                } else {
                    // 如果不支持，则向用户显示一段消息
                    alert('Geolocation is not supported by this browser.');
                }
            }
            // 获取cookie字符串
            var strCookie = document.cookie;
            // 将多cookie切割为多个名/值对
            var arrCookie = strCookie.split('; ');
            var dwok;
            // 遍历cookie数组，处理每个cookie对
            for (var i = 0; i < arrCookie.length; i += 1) {
                var arr = arrCookie[i].split('=');
                // 找到名称为user的cookie，并返回它的值
                if ('geolocation_x' === arr[0]) {
                    dwok = arr[1];
                    break;
                }
            }
            if (!dwok) {
                getLocation();
            }
            // 数据请求失败
            $('#notfound').on('click', function () {
                window.location.reload();
            });
            // 搜索用户行为收集20160114
            var page = 'mjjsitelist';
            var room = $('#room');
            var stage = $('#stage');
            require.async('jsub/_vb.js?c=' + page);
            require.async('jsub/_ubm.js', function () {
                _ub.city = vars.cityname;
                // 业务---h代表家居
                _ub.biz = 'h';
                // 家居不分南北方，都传0
                _ub.location = 0;
                // 用户动作（浏览0、打电话31、在线咨询24、分享22、收藏21）
                var b = 1;
                var price = ['', '0-2', '2-4', '4-6', '6-10', '10-15', '15-20', '20-99999'];
                var pTemp = {
                    'vmg.page': page,
                    'vmh.order': encodeURIComponent($('#orderby').text()),
                    'vmh.housetype': room.text() === '户型' ? '' : encodeURIComponent(room.text()),
                    'vmh.totalprice': price[vars.pricetype],
                    'vmh.state': stage.text() === '状态' ? '' : encodeURIComponent(stage.text()),
                    'vmh.key': encodeURIComponent(vars.q)
                };
                var p = {};
                // 若pTemp中属性为空或者无效，则不传入p中
                for (var temp in pTemp) {
                    if (pTemp[temp]) {
                        p[temp] = pTemp[temp];
                    }
                }
                // 用户行为(格式：'字段编号':'值')
                // 收集方法
                _ub.collect(b, p);
            });
        };
    });