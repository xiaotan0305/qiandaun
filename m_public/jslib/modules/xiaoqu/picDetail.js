/**
 * @author lina 20161031 小区图片详情页UI改版
 */
define('modules/xiaoqu/picDetail', ['jquery','klass/1.0/klass', 'photoswipe/photoswipe-3.0.5n', 'iscroll/2.0.0/iscroll-lite'],
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
            // 底部导航的父元素
            var scrollEle = $('#scroller');
            // 用户行为布码
            function buMa() {
                // 所在城市（中文）
                _ub.city = vars.cityname;
                // 新房的页面值为 'n'、二手房为 'e'、租房为 'z'、注意房贷计算器页此处值为g
                // 新房“n”，二手房e，租房n，查房价v,家居h，资讯i,知识k
                _ub.biz = 'V';
                // 方位 ，网通为0，电信为1，如果无法获取方位，记录0
                var ns = vars.ns === 'n' ? 0 : 1;
                _ub.location = ns;
                // b值 0：浏览
                var b = 0;
                _ub.collect(b, {'vmg.page': 'esf_xq^xc_wap'});
            }
            require.async('jsub/_vb.js?c=esf_xq^xc_wap');
            require.async('jsub/_ubm.js?v=201407181100', function () {
                buMa();
            });
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
            // 解决苹果设备上双击出现白框 lina 20161102
            $('.pic-int').on('touchend',function(){
                return false;
            });
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
                    scrollY: false,
                    bindToWrapper: true,
                    eventPassthrough: false
                });
            }
            // swiper 应用
            var curnumber = vars.curnumber;
            var myPhotoSwipe = window.Code.PhotoSwipe.attach(window.document.querySelectorAll('#Gallery a'), {
                allowUserZoom: false,
                preventHide: true,
                captionAndToolbarHide: true,
                loop: false
            }, false);
            //var htmlBody = $('body');
            // 兼容苹果设备的头部
            // function load1() {
            //     var bua = navigator.userAgent.toLowerCase();
            //     if (bua.indexOf('iphone') >= 0 || bua.indexOf('ipod') >= 0) {
            //         htmlBody.height(window.innerHeight + 51);
            //         window.scrollTo(0, 1);
            //         htmlBody.height(window.innerHeight);
            //     }
            // }
            //load1();
            // 页面初始化 底部导航上侧左边栏里的内容
            var flol = scrollEle.find('a:eq(0)');
            // 如果导航栏底部第一个有图片
            if (flol.attr('num')) {
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
            scrollEle.on('touchend click', 'a', function () {
                // 当前点击下该类型图片的总张数
                var ingNum = $(this).attr('num').split('_');
                // 该类型下的第一张图
                var shownum = parseInt(ingNum[0]);
                // 改变图片
                myPhotoSwipe.slideCarousel(shownum);
            })
        };
    });