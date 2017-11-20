/**
 * 看房团首页
 * @author icy(taoxudong@fang.com) 20151216
 */
define('modules/kanfangtuan/index', ['jquery', 'modules/kanfangtuan/yhxw', 'loadMore/1.0.0/loadMore', 'swipe/3.10/swiper.js',
    'iscroll/2.0.0/iscroll-lite'
], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var iscrollLite = require('iscroll/2.0.0/iscroll-lite');
        var Swiper = require('swipe/3.10/swiper.js');
        // 轮播
        var swiper;
        // 轮播图
        var $swipeCont = $('.swiper-container');
        // 轮播图遮罩
        var $swipeWrap = $swipeCont.find('.swiper-wrapper');
        // 轮播图图片
        var img = $swipeCont.find('img');
        // 已经加载完成图片数量
        var loadImgNumber = 0;
        // 轮播图总数
        var imgLen = img.length;
        // 设置轮播图样式
        $swipeWrap.css({
            overflow: 'hidden',
            position: 'relative'
        }).find('.swiper-slide').css({
            float: 'left',
            width: '100%',
            position: 'relative'
        });

        // 引入用户行为分析对象-埋码
        var yhxw = require('modules/kanfangtuan/yhxw');
        // 判断详情页种类，传入用户行为统计对象
        var pageId = 'mnhkftlist';
        // 埋码变量数组
        var maiMaParams = {
            // 页面标识
            'vmg.page': pageId,
            // 看房团路线名称
            'vmn.seehouseline': '',
            // 楼盘id
            'vmn.projectid': '',
            // 置业顾问id
            'vmn.consultantid': ''
        };
        // 添加用户行为分析
        yhxw({type: 0, pageId: pageId, params: maiMaParams});

        /**
         * 重置广告轮播宽度
         */
        function imgResize() {
            if (swiper) {
                $swipeWrap.width($swipeCont.width() * swiper.slides.length);
            }
        }

        /**
         * 广告图片加载完毕判断函数
         */
        function imgLoaded() {
            // 如果图片全部加载完毕显示轮播图
            if (++loadImgNumber === imgLen) {
                // 显示轮播图
                $swipeCont.show();
                // 初始化轮播显示广告功能
                swiper = Swiper('.swiper-container', {
                    // 切换速度
                    speed: 500,
                    // 自动切换间隔
                    autoplay: 5000,
                    // 在交互时保持自动切换
                    autoplayDisableOnInteraction: false,
                    // 循环
                    loop: true
                });
            }
            imgResize();
        }

        function imgLoadOrResize() {
            // 只有一张图片直接显示图片
            if (imgLen === 1) {
                var singleImg = img.eq(0);
                singleImg.on('load', function () {
                    $swipeCont.show();
                });
                singleImg.attr('src', singleImg.attr('data-src'));
                return;
            }
            // 循环遍历所有广告中的img标签，将其中的data-src赋值给src，加载图片，并且设置图片的宽高
            for (var i = 0; i < imgLen; i++) {
                var $this = img.eq(i);
                if (!$this.attr('src')) {
                    $this.on('load', imgLoaded);
                    $this.attr('src', $this.attr('data-src'));
                }
            }
        }

        // 页面尺寸改变时，更新广告图片的大小,之所以这样做，是因为插件能够自动更新自己的宽度大小却无法实现里面的图片的大小
        window.onresize = imgResize();
        // 执行广告图片的加载
        imgLoadOrResize();

        function preventDefault(e) {
            e.preventDefault();
        }

        // 禁用/启用touchmove
        function toggleTouchmove(unable) {
            document[unable ? 'addEventListener' : 'removeEventListener']('touchmove', preventDefault);
        }

        // 加载更多功能
        var loadMore = require('loadMore/1.0.0/loadMore');
        // 存在往期回顾
        var haveReview = '';
        if ($('.kft-hg').length > 0) {
            haveReview = '1';
        }
        var pageUrl = vars.kanfangtuanSite + '?c=kanfangtuan&a=ajaxGetList&city=' + vars.city + '&haveReview=' + haveReview;
        loadMore({
            total: vars.total_count,
            pagesize: vars.pagesize,
            firstDragFlag: false,
            pageNumber: vars.pagesize,
            moreBtnID: '.moreList',
            loadPromptID: '.moreList',
            contentID: '.kftList',
            loadAgoTxt: '<a class="bt">滑动加载更多</a>',
            loadingTxt: '<span><i></i>努力加载中...</span>',
            loadedTxt: '<a class="bt">滑动加载更多</a>',
            url: pageUrl
        });
        $('#wapkanfangtuansy_D01_04').on('click', function () {
            if ($('.main').css('display') === 'block') {
                $('.main').hide();
            } else {
                $('.main').show();
            }
        });
        // 点击聊天种localstorage
        $('.main').on('click', '.mes', function () {
            // 看房团路线
            maiMaParams['vmn.seehouseline'] = encodeURIComponent($(this).parents('.cont').eq(0).attr('data-seeHouseLine'));
            // 楼盘id
            maiMaParams['vmn.projectid'] = $(this).parents('.user-box').eq(0).attr('data-projectId');
            // 置业顾问id
            maiMaParams['vmn.consultantid'] = $(this).parents('.user-box').eq(0).attr('data-consultantId');
            // 添加用户行为分析-埋码
            yhxw({type: 24, pageId: pageId, params: maiMaParams});
            var dataKey = $(this).attr('data-key');
            var dataValue = $(this).attr('data-value');
            localStorage.setItem(dataKey, dataValue);
        });
        // 置业顾问打电话埋码
        $('.main').on('click', '.call', function () {
            // 看房团路线
            maiMaParams['vmn.seehouseline'] = encodeURIComponent($(this).parents('.cont').eq(0).attr('data-seeHouseLine'));
            // 楼盘id
            maiMaParams['vmn.projectid'] = $(this).parents('.user-box').eq(0).attr('data-projectId');
            // 置业顾问id
            maiMaParams['vmn.consultantid'] = $(this).parents('.user-box').eq(0).attr('data-consultantId');
            // 添加用户行为分析-埋码
            yhxw({type: 31, pageId: pageId, params: maiMaParams});
        });
    };
});