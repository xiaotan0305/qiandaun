/**
 * video详情页
 * by yangchuanlong
 * 20171025
 */
define('modules/video/detail', ['jquery', 'lazyload/1.9.1/lazyload', 'superShare/1.0.1/superShare'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        // 从页面获取的参数
        var vars = seajs.data.vars;
        // 图片惰性加载
        require('lazyload/1.9.1/lazyload');
        $('.lazyload').lazyload();
        //视频按钮
        var videobox = $('.videobox');
        //缩略图按钮
        var imageone = $('.imageone');
        //播放按钮图标
        var videocon = $('.vedio-icon');

        /*
        * 点赞
        */
        $(".ic-zan").on('click', function () {
            if (!get_cooike('zan')) {
                if (vars.channel == 'hd') {
                    var praise = parseInt($(this).text())+1;
                    $(this).html('<i></i>'+praise);
                    document.cookie="zan=zantrue";
                } else {
                    $(this).addClass('cur');
                    document.cookie="zan=zantrue";
                }
            }
        })

        function get_cooike(str) {
            var strCookie = document.cookie;
            //将多cookie切割为多个名/值对
            var arrCookie = strCookie.split("; ");
            var zan;
            //遍历cookie数组，处理每个cookie对
            for (var i = 0; i < arrCookie.length; i++) {
                var arr = arrCookie[i].split("=");
                //找到名称为userId的cookie，并返回它的值
                if (str == arr[0]) {
                    zan = arr[1];
                    return zan;
                    break;
                }
            }
        }

        //点击缩略图播放视频
        videocon.on('click', function () {
            imageone.hide();
            videocon.hide();
            videobox.show();
            videobox[0].play();
            $('.imagetwo').show();
            $.get(vars.videoSite+'?c=video&a=ajaxPlayvideoUv&vid='+vars.vid, function(data){

            })
        })

        // 点击分享关闭按钮
        $('.close').on('click', function () {
            $('.share-s3').hide();
            $('.icon-nav').css('pointer-events', '');
            enable();
        });


        $(function () {
            /* 分享代码*/
            var SuperShare = require('superShare/1.0.1/superShare');
            //分享按钮
            var config = {
                // 分享的内容title
                title: vars.shareTitle + '...',
                // 分享时的图标
                image: window.location.protocol + vars.shareImg,
                // 分享内容的详细描述
                desc: vars.shareSummary + '...',
                // 分享的链接地址
                url: location.href,
                // 分享的内容来源
                from: ' —房天下视频'
            };
            var superShare = new SuperShare(config);
        });

        /**
         * 微信分享成功的回调函数
         */
        function callback() {
            $('.share-s3').show();
            $('.icon-nav').css('pointer-events', 'none');
            unable();
        }

        // 微信分享
        var ua = navigator.userAgent.toLowerCase();
        var weixin;
        if (ua.indexOf('micromessenger') > -1) {
            require.async('weixin/2.0.0/weixinshare', function (Weixin) {
                weixin = new Weixin({
                    debug: false,
                    // 必填，公众号的唯一标识
                    appId: vars.appId,
                    // 必填，生成签名的时间戳
                    timestamp: vars.timestamp,
                    // 必填，生成签名的随机串
                    nonceStr: vars.nonceStr,
                    // 必填，签名，见附录1
                    signature: vars.signature,
                    shareTitle: vars.shareTitle,
                    descContent: vars.shareSummary,
                    lineLink: location.href,
                    imgUrl: window.location.protocol + vars.shareImg
                }, callback);
            });
        }

        // 下载弹层
        require.async('app/1.0.0/appdownload', function () {
            // 顶部弹层
            $('#indexDownload').openApp({
                position: 'videoDetail'
            });
        });
    };
});