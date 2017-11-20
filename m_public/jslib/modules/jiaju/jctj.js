/**
 * Created by  on 15-04-09.
 * Modified by LXM on 15.9.22
 */
define('modules/jiaju/jctj',['jquery'],function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;

        $('input[type=hidden]').each(function (index, element) {
            vars[$(this).attr('data-id')] = element.value;
        });

        $(document).ready(function () {
            if (window.location.search.indexOf('?') !== -1) {
                if (window.location.search.indexOf('src=client') !== -1) {
                    $('header').css('display', 'none');
                    $('#foot').css('display', 'none');
                }
            }
        });
        var pagesize = 10;
        var totalpage = Math.ceil(vars.total / pagesize);
        var curp = 2;
        var k = true;
        var w = $(window);
        
        $('.hLeft a').attr('href', vars.jiajuurl);
        var clickmore = $('#clickmore');
        if (totalpage <= 1) {
            clickmore.hide();
            k = false;
        }

        function load() {
            var a = clickmore[0];
            k = false;
            a.style.background = 'url(//img2.soufun.com/wap/touch/img/load.gif) 0 50% no-repeat';
            a.innerHTML = '正在加载请稍候';
            $.get(vars.jiajuSite + '?c=jiaju&a=ajaxjctjList&r=' + Math.random(), {
                dealerid: vars.dealerid,
                type: vars.type,
                city: vars.city,
                page: curp
            }, function (b) {
                $('#productlist').append(b);
                clickmore.css('padding-left', '0px');
                a.style.background = '';
                a.innerHTML = '上拉自动加载更多';
                curp = parseInt(curp) + 1;
                k = true;
                if (curp > parseInt(totalpage) || curp > 9) {
                    clickmore.hide();
                    k = false;
                }
            });
        }

        clickmore.click(function () {
            load();
        });
        var bua = navigator.userAgent.toLowerCase();
        $(function () {
            $(window).bind('scroll', function () {
                var b = $(document).height();
                if (bua.indexOf('iphone') !== -1 || bua.indexOf('ios') !== -1) {
                    b -= 140;
                } else {
                    b -= 80;
                }
                if (k !== false && $(document).scrollTop() + w.height() >= b) {
                    load();
                }
            });
        });
    };
});