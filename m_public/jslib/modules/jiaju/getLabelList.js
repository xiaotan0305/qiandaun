/**
 * Created by liuying on 2016年3月18日.
 * modify by young 2016-3-24
 * 获取标签列表页
 */
define('modules/jiaju/getLabelList', ['jquery','lazyload/1.9.1/lazyload'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        //图片惰性加载
        require('lazyload/1.9.1/lazyload');
        $('.lazyload').lazyload();

        // 获取消息
        var message = $('.icon-my');
        message.on('click',function(){
            $.get(vars.publicSite+'?c=public&a=ajaxUserInfo',function(info){
                if(!info.userid){
                    var url = location.protocol + '//m.fang.com/passport/login.aspx?burl='+encodeURIComponent(window.location.href);
                }else{
                    var url =vars.bbsSite+'?c=bbs&a=getPersonnelLetter&username='+info.username+'&city='+vars.city;
                }
                window.location=url;
                return;
            })
        });

        // 页面访问失败，点击重新加载
        $('#reload').on('click', function () {
            window.location = window.location.href;
        });

        // 发帖
        $('.quik-reply').on('click', function () {
            var postUrl = vars.jiajuSite + '?c=jiaju&a=post&city=bj';
            window.location = postUrl;
        });

        //广告关闭按钮
        $('#adclose').click(function () {
            $('#ad').hide();
        });
    };
});