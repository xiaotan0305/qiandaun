/**
 * @file merge js files,ESLint
 * @author zcf(zhangcongfeng@fang.com)
 */
define('modules/tuangou/loadmore', ['jquery'], function (require, exports, module) {
    'use strict';
    module.exports = function (options) {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var totalpage = Math.ceil(vars.total / vars.pagesize), curp = 1, k = true, bua = navigator.userAgent.toLowerCase(),
            isApple = bua.indexOf('iphone') !== -1 || bua.indexOf('ios') !== -1;
        var $window = $(window),$document = $(document),showorno,content,drag = $('#drag'),draginner,isAgentNoShow = !1;
        if (totalpage <= 1) {
            drag.hide();
            k = false;
        }

        function loadmore() {
            if (draginner === undefined)draginner = $('.draginner');
            k = false;
            draginner.css({'padding-left': '10px',background: 'url(//img2.soufun.com/wap/touch/img/load.gif) 0 50% no-repeat'}).html('<a href="" >正在加载请稍后</a>');
            $.get(options.url + '&r=' + Math.random(), {page: curp}, function (data) {
                if (data.indexOf('请求超时') > 0 || data.indexOf('获取列表出错') > 0) {
                    alert('加载更多失败,请重试！');
                    return false;
                }
                var ajaxList = $('#ajaxList');
                var str = ajaxList.html();
                var content = str + data;
                require.async('lazyload/1.9.1/lazyload', function () {
                    ajaxList.html(content).find('img[data-original]').lazyload();
                });
                draginner.css({'padding-left': '0px',background: ''}).html('');
                curp = parseInt(curp) + 1;
                k = true;
                if (curp > parseInt(totalpage)) {
                    drag.hide();
                    k = false;
                }
            });
        }
        drag.click(function () {
            loadmore();
        });
        $window.bind('scroll', function () {
            var scrollh = $document.height();
            if (isApple) {
                scrollh -= 140;
            } else {
                scrollh -= 80;
            }
            if (content === undefined)content = $('#content');
            if (showorno === undefined)showorno = $('#showorno');
            if (k !== false && $document.scrollTop() + $window.height() >= scrollh) {
                loadmore();
            }
            if (showorno.length > 0) {
                if ($window.scrollTop() > content.offset().top) {
                    if (isAgentNoShow === !1) {
                        isAgentNoShow = !0;
                        showorno.show();
                    }
                }else if (isAgentNoShow === !0) {
                    isAgentNoShow = !1;
                    showorno.hide();
                }
            }
        });
    };
});