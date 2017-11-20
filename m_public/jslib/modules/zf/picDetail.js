define('modules/zf/picDetail', ['jquery','klass/1.0/klass', 'photoswipe/photoswipe-3.0.5n', 'iscroll/2.0.0/iscroll-lite'],
    function (require) {
        // 严格模式开发
        'use strict';
        // 调用jquery
        var $ = require('jquery');
        // seajs中的可调用的数据
        var vars = seajs.data.vars;
        // 调用滑动插件，底部滑动用
        var IScrolllist = require('iscroll/2.0.0/iscroll-lite');
        // 统计行为对象
        var yhxw = require('modules/zf/yhxw');
        // 阻止浏览器默认事件
        function preventDefault(e) {
            e.preventDefault();
        }
        // 滑动时阻止浏览器默认事件
        function unable() {
            document.addEventListener('touchmove', preventDefault);
        }
        // 阻止页面上滑
        unable();
        // 底部导航滑动
        if($('#album_foot').length){
            new IScrolllist('#album_foot', {
                scrollX: true,
                scrollY: false,
                bindToWrapper: true,
                eventPassthrough: true
            });
        }
        // swiper 应用
        var curnumber = vars.number;
        var myPhotoSwipe = window.Code.PhotoSwipe.attach(window.document.querySelectorAll('#Gallery a'), {
            allowUserZoom: true,
            preventHide: true,
            captionAndToolbarHide: true,
            loop: false
        }, false);
        var htmlBody = $('body');
        // 兼容苹果设备的头部
        function load1() {
            var bua = navigator.userAgent.toLowerCase();
            if (bua.indexOf('iphone') >= 0 || bua.indexOf('ipod') >= 0) {
                htmlBody.height(window.innerHeight + 51);
                window.scrollTo(0, 1);
                htmlBody.height(window.innerHeight);
            }
        };
        load1();
        // 页面初始化 底部导航上侧左边栏里的内容
        var flol = $('#scroller').find('a:eq(0)');
        // 底部导航栏里第一个导航的所有的数字
        var ingNum = flol.attr('num').split('_');
        // 如果导航栏底部第一个有图片
        if (flol.attr('num')) {
            ingNum = flol.attr('num').split('_');
        } else {
            myPhotoSwipe.show(parseInt(curnumber));
        }
        // 存在图片
        if (ingNum) {
            if (flol.html() !== '户型图') {
                // 如果是从全部图片页进来的，对图片的number不做处理，如果是从详情页进来的，图片的number减1
                if (!document.referrer.match('picDetailShow')) {
                    curnumber -= 1;
                }
            }
            myPhotoSwipe.show(parseInt(curnumber));
        }
        // 点击底部菜单
        $('#scroller').on('touchend', 'a', function () {
            // 当前点击下该类型图片的总张数
            var ingNum = $(this).attr('num').split('_');
            // 该类型下的第一张图
            var shownum = parseInt(ingNum[0]);
            // 改变图片
            myPhotoSwipe.slideCarousel(shownum);
        });
        //视频点击增加统计
        $('.vedio-icon').on('click', function () {
            if (vars.videoid) {
                $.ajax({
                    url: vars.esfSite + '?c=esf&a=ajaxPlayvideoUv&vid=' + vars.videoid,
                    async: false
                });
            } else if (vars.videomp4) {
                $.ajax({
                    url: vars.esfSite + '?c=esf&a=ajaxPlayvideoUv&inputstr=' + vars.videomp4,
                    async: false
                });
            }
        });
    });