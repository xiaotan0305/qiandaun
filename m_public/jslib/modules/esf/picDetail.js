/**
 * @author lina 二手房图片详情页UI改版
 */
define('modules/esf/picDetail', ['jquery','klass/1.0/klass', 'photoswipe/photoswipe-3.0.5n', 'iscroll/2.0.0/iscroll-lite'],
    function (require, exports, module) {
        module.exports = function () {
            // 严格模式开发
            'use strict';
            // 调用jquery
            var $ = require('jquery');
            // seajs中的可调用的数据
            var vars = seajs.data.vars;
            // 调用滑动插件，底部滑动用
            var IScrolllist = require('iscroll/2.0.0/iscroll-lite');
            // 阻止浏览器默认事件
            function preventDefault(e) {
                e.preventDefault();
            }

            // 滑动时阻止浏览器默认事件
            function unable() {
                document.addEventListener('touchmove', preventDefault);
            }
            // 解决苹果设备上双击出现白框 lina 20161102
            $('.pic-int').on('touchend',function(){
                return false;
            })
            // 阻止页面上滑
            unable();
            // 底部导航滑动
            if ($('#album_foot').length) {
                var scrollerWidth = 14;
                // 为滚动区添加id，设置底部导航长度
                var scroller = $('#scroller');
                scroller.find('a').each(function () {
                    $(this).attr('id', 'item_' + $(this).index());
                    scrollerWidth += $(this).width() + 30 + 4;
                });
                scroller.css('width', scrollerWidth);
                new IScrolllist('#album_foot', {
                    scrollX: true,
                    bindToWrapper: true,
                    eventPassthrough: false
                });
            }
            // swiper 应用
            var curnumber = vars.number;
            var myPhotoSwipe = window.Code.PhotoSwipe.attach(window.document.querySelectorAll('#Gallery a'), {
                allowUserZoom: false,
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
            if (flol.length) {
                // 底部导航栏里第一个导航的所有的数字
                var ingNum = flol.attr('num').split('_');
                // 存在图片
                if (ingNum) {
                    myPhotoSwipe.show(parseInt(curnumber));
                }
            } else {
                myPhotoSwipe.show(parseInt(curnumber));
            }
            // 点击底部菜单
            var scroller = $('#scroller');
            scroller.on('touchend click', 'a', function () {
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
        }
    });