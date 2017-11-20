/**
 * Created by LXM on 15-3-17.
 */
define('modules/jiaju/zxgj',['jquery'],function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        $('input[type=hidden]').each(function (index, element) {
            vars[$(this).attr('data-id')] = element.value;
        });

        // m站首页足迹
        require.async('footprint/1.0.0/footprint', function (run) {
            run.push('装修管家', vars.jiajuSite + vars.city + '/zxgj.html', vars.city);
        });
        var strurl = window.location.search;
        $(document).ready(function () {
            if (strurl.indexOf('?') !== -1) {
                if (strurl.indexOf('src=client') !== -1) {
                    $('header').css('display', 'none');
                }
            }
        });
        var btn = $('.btn');
        if (strurl.indexOf('?') !== -1) {
            if (strurl.indexOf('sem=1') !== -1) {
                $('#tel001').hide();
                $('#tel002').show();
            }
            var btnhref = btn.attr('href');
            strurl = strurl.replace('c=jiaju&a=zxgj', '');
            btnhref += '&' + strurl.substr(1);
            btn.attr('href', btnhref);
            console.log(btnhref);
        }
    };
});