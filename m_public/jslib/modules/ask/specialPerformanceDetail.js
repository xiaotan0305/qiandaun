/**
 *  限时免费专场详情
 * by hxxiao 20160828
 */
define('modules/ask/specialPerformanceDetail', ['jquery', 'app/1.0.0/appdownload', 'lazyload/1.9.1/lazyload', 'weixin/2.0.1/weixinshare'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        // 从页面获取的参数
        var vars = seajs.data.vars;
        // 导航栏目容器
        var $headDrop = $('.head-drop');
        // 频道导航的容器
        var $navBox = $('.newNav');
        // 带有标题的新头部
        var $newHeader = $('#newheader');
        // 右上角导航按钮-展示导航菜单
        $('.icon-nav').off('click').on('click', function(){
            $('.main').show();
            if ($headDrop.is(":hidden")) {
                $headDrop.show();
                $headDrop.css({"position":"fixed", "top":"45px"});
                $navBox.hide();
            } else {
                $headDrop.hide();
            }
        });
        // 导航栏目中的频道导航按钮
        $('.navli').off('click').on('click', function(){
            $headDrop.hide();
            $('.main').hide();
            $newHeader.show().css({"opacity":1});
            $navBox.css({"position":"absolute", "top":"35px"});
            $navBox.show();
        });
        // 向下滚动展示新的头
        $(window).scroll(function(){
            if ($(window).scrollTop() > 50) {
                $('.focus-opt').hide();
                $newHeader.css({"opacity":1});
                $newHeader.show();
            } else if ($navBox.is(":hidden")) {
                $('.focus-opt').show();
                $newHeader.hide();
            };
        });
        var attenBtn = $('.atten');
        // 关注
        attenBtn.on('click', function(){
            if (vars.userid != '') {
                $.ajax({
                    type: "get",
                    async: false,
                    url: "https://mp.fang.com/opencmsJsonp/updateGzCnt.do?userById="+vars.expertId+"&passporNo="+vars.userid+"&optType=2&formatType=json&fromType=ask&callbackparam=jsonpCallback",//数据接收后台
                    dataType: "jsonp",
                    jsonpCallback:"jsonpCallback",//自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
                    success: function(json){
                        if (json == '关注成功') {
                            showMsg('关注成功');
                            attenBtn.addClass('cancel');
                            attenBtn.html('<i></i>取消关注');
                        } else if (json == '取消关注成功') {
                            showMsg('取消关注成功');
                            attenBtn.removeClass('cancel');
                            attenBtn.html('<i></i>关注');
                        } else {
                            showMsg('请稍后再试');
                        }
                    },
                    error: function(){
                        showMsg('请稍后再试');
                    }
                });
            } else {
                //如果没有登录，跳转到登录页面
                window.location = vars.loginUrl + "?burl=" + encodeURIComponent(location.href);
            }
        });
        var attenBox = $('.attenBox');
        function showMsg($msg) {
            var str = '<i class="bounceIn"></i>' + $msg;
            attenBox.html(str);
            attenBox.show();
            setTimeout(function(){
                attenBox.hide();
            }, 2000);
        };
        // 下载弹层
        require.async('app/1.0.0/appdownload', function () {
            // 顶部弹层
            $('#down-btn-c').openApp('');
        });
        /* 图片惰性加载*/
        require('lazyload/1.9.1/lazyload');
        var swipLazy = $('.lazyload'), delay = 0;
        if (swipLazy) {
            swipLazy.lazyload();
            swipLazy.each(function (index, ele) {
                setTimeout(function () {
                    var thisEle = $(ele);
                    if (thisEle.attr('src') !== thisEle.attr('data-original')) {
                        thisEle.attr('src', thisEle.attr('data-original'));
                    }
                }, delay + 10);
            });
        }
        //增加微信分享
        var Weixin = require('weixin/2.0.1/weixinshare');
        var $shareTitle = vars.expertName + '在线免费解答购房相关问题，快来提问吧！';
        new Weixin({
            // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            debug: false,
            shareTitle: $shareTitle,
            descContent: vars.activityTheme,
            lineLink: location.href,
            imgUrl: vars.photoUrl,
            // 对调标题 和 描述(微信下分享到朋友圈默认只显示标题,有时需要显示描述则开启此开关,默认关闭)
            swapTitle: true
        });
    };
});