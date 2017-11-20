define('modules/esf/shoplist',['jquery'],function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        $('input[type=hidden]').each(function (index, element) {
            vars[$(this).attr('data-id')] = element.value;
        });
        $(document).ready(function () {
            var city = vars.city;
            var key = '';
            var newcode = vars.id;
            var shoptel = $('#shoptel').html();
            var isShopPhone = 1;
            var from = ($('#from').html() === 'undefined' || $('#from').html() === null) ? '' : $('#from').html();
            if (from === 'baidu') {
                isShopPhone = 13;
            }
            if (shoptel !== null && key !== null || shoptel !== null && newcode !== null) {
                $.ajax({url: '/data.d?m=showtimes&city=' + city + '&key=' + key + '&newcode=' + newcode, async: true});
            }
            $('#shopcall').click(function () {
                $.ajax({url: '/data.d?m=tel&city=' + city + '&housetype=esf&id=' + newcode + '&phone=' + shoptel + '&isShopPhone=' + isShopPhone, async: true});
            });

            var url = location.href;
            if (url.indexOf('src=client') > 0) {
                var pageUrl = document.URL;
                $.ajax({url: '/data.d?m=tuisong&url=' + pageUrl, async: true});
            }
        });
        var userAgentUa = navigator.userAgent.toLowerCase();
        window.addEventListener('scroll', function () {
            var seeHeight = document.documentElement.clientHeight;
            // 可见高度
            var allHeight = document.documentElement.scrollTop === 0 ? document.body.scrollHeight : document.documentElement.scrollHeight;
            // 整体高度
            var offsetTopHeight = document.documentElement.scrollTop === 0 ? document.body.scrollTop : document.documentElement.scrollTop;
            // 偏移高度

            if (userAgentUa.indexOf('iphone') !== -1 || userAgentUa.indexOf('ios') !== -1) {
                allHeight -= 98;
            } else {
                allHeight -= 97;
            }
            if (seeHeight + offsetTopHeight >= allHeight) {
                vars.pindex = parseInt(vars.pindex) + 1 + '';
                var url = vars.ajaxurl + '&pindex=' + vars.pindex;
                var el = document.getElementById('loadMoreDivEl');
                el.innerHTML = '正在加载请等待';
                el.style.background = 'url(//img2.soufun.com/wap/touch/img/load.gif) 0 50% no-repeat';
                el.style.paddingLeft = '10px';

                $.post(url, {}, function (results) {
                    var el = document.getElementById('loadMoreDivEl');
                    $('#content').append(results);
                    el.innerHTML = '上拉自动加载更多';
                    el.style.background = 'none';
                    el.style.paddingLeft = '0px';
                });
            }
        });
    };
});


