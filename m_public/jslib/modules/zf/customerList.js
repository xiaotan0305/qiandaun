define('modules/zf/customerList', ['jquery'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        require.async('iscroll/1.0.0/iscroll');
        $('input[type=hidden]').each(function (index, element) {
            vars[$(this).attr('data-id')] = element.value;
        });

        var pagesize = vars.pagesize;
        var totalpage = Math.ceil(vars.total_count / pagesize), w = $(window), bua = navigator.userAgent.toLowerCase();
        var curp = 2;
        var k = true;
        $('#drag').click(function () {
            load();
        });
        $(window).bind('scroll', function () {
            var scrollh = $(document).height();
            if (bua.indexOf('iphone') !== -1 || bua.indexOf('ios') !== -1) {
                scrollh -= 140;
            } else {
                scrollh -= 80;
            }
            var c = document.documentElement.clientHeight || document.body.clientHeight, t = $(document).scrollTop();
            if (k !== false && $(document).scrollTop() + w.height() >= scrollh) {
                load();
            }
        });
        function load() {
            var draginner = $('.draginner')[0];
            k = false;
            $('.draginner').css('padding-left', '10px');
            if (vars.total_count > pagesize) {
                draginner.style.background = 'url(//img2.soufun.com/wap/touch/img/load.gif) 0 50% no-repeat';
                draginner.innerHTML = '正在加载请稍候';
            }
            $.get(vars.zfSite + '?c=zf&a=customerResourcesAjaxList&r=' + Math.random(), {
                city: vars.city,
                page: curp,
                pagesize: pagesize,
                agentid: vars.agentid,
                CustomerStatus: vars.CustomerStatus,
                SearchPurposeType: vars.SearchPurposeType
            }, function (data) {
                $(data).appendTo('.sfbCM');
                $('.draginner').css('padding-left', '0px');
                draginner.style.background = '';
                draginner.innerHTML = '查看更多房源';
                curp = parseInt(curp) + 1;
                k = true;
                if (curp > parseInt(totalpage)) {
                    $('#drag').hide();
                    k = false;
                }
            });
        }
    };
});