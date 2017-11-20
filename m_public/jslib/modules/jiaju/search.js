/**
 * Created by LXM on 15-3-11.
 */
define('modules/jiaju/search',['jquery'],function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        $('input[type=hidden]').each(function (index, element) {
            vars[$(this).attr('data-id')] = element.value;
        });

        $.get(vars.jiajuSite + '?c=jiaju&a=ajaxUserInfo', {
            city: vars.city
        }, function (a) {
            $('#userinfo').html(a);
        });
        var i = 1;
        $('#moreLoad').click(function () {
            var c = parseInt(i) + 1;
            var b = $('#asktitle').val();
            var a = '?c=jiaju&a=ajaxGetSearch&p=' + c + '&r=' + Math.random();
            if (b !== '') {
                a += '&asktitle=' + encodeURIComponent(b);
            }
            if (vars.cid !== '') {
                a += '&cid=' + vars.cid;
            }
            jQuery.ajax({
                url: a,
                success: function (d) {
                    if (d.indexOf('请求超时') > 0 || d.indexOf('获取搜索问题出错') > 0) {
                        alert('加载更多失败,请重试！');
                        return false;
                    }
                    var searchres = $('#searchres');
                    var f = searchres.html();
                    var e = f + d;
                    searchres.html(e);
                }
            });
            i++;
            return false;
        });
    };
});