/**
 * @author zhangjinyu
 * @author lina
 * 20160815
 */
define('modules/juhe/detail', ['jquery', 'swipe/3.10/swiper'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        // jquery库
        var $ = require('jquery');
        // 页面传入的参数对象
        var vars = seajs.data.vars;
        var Swiper = require('swipe/3.10/swiper');
        // 图片惰性加载
        require.async('lazyload/1.9.1/lazyload', function (lazyload) {
            $('.lazyload').lazyload({
                threshold: 200,
                event: 'scroll click'
            });
        });
        // 词汇解释查看全部
        var moreBtn = $('.more_xq');
        if (moreBtn.length > 0) {
            moreBtn.on('click', function () {
                $(this).toggleClass('up').siblings('.jhCon').toggleClass('all');
            });
        }

        /**
         * 百科点击换一换
         */
        var baike1 = $('.baike1'),
            baike2 = $('.baike2'),
            baike3 = $('.baike3');

        $('.baikeChange').on('click', function () {

            if (baike1.is(':visible')) {
                baike2.show();
                $('.baike3,.baike1').hide();
            } else if (baike2.is(':visible')) {
                baike3.show();
                $('.baike2,.baike1').hide();
            } else {
                baike1.show();
                $('.baike2,.baike3').hide();
            }
        });

        /**
         * 房产头条轮播
         */
        if ($('#fcHead').length > 0) {
            Swiper('#fcHead', {
                // 切换速度
                speed: 500,
                // 自动切换间隔
                autoplay: 3000,
                // 循环
                loop: true,
                direction: 'vertical'
            });
        }


        /**
         * 图片惰性加载
         * @param swipe
         */
        function imgLoad(swipe) {
            $(swipe).find('.lazyload').each(function () {
                var $that = $(this);
                if ($that.attr('data-original') && $that.attr('src') !== $that.attr('data-original')) {
                    $that.attr('src', $that.attr('data-original'));
                }
            });
        }

        /**
         * 新房和二手房滑动函数
         * @param swiperEle
         * @constructor
         */
        function Swipe(swiperEle) {
            var Swiper3 = require('swipe/3.10/swiper');
            imgLoad(swiperEle);
            Swiper3(swiperEle, {
                freeMode: true,
            });
        }

        /**
         * 家居轮播函数
         * @constructor
         */
        function JjSwiper() {
            var swiperJj = require('swipe/3.10/swiper'),
            // 获取屏幕宽度，设为滑动的宽度，目的设置不同设备之间的自适应
                wW = $(document).width();
            swiperJj('.jj-fav', {
                // 设置自动播放
                autoplay: 3000,
                // 设置循环
                loop: true,
                width: wW,
                pagination: '.swipe-point',
                paginationElement: 'li'

            });
        }

        /**
         *猜你喜欢
         */
        var setCaiNiXiHuan = function () {
            var business = '';
            _ub.city = vars.zhcity;
            _ub.request('vmg.business,vme.projectid,vmh.style,vmh.roomtype,vmn.position,vmn.subway,vmn.unitprice,vmn.fixstatus,vmn.opentime,vmn.feature,vmn.housetype,vmn.floornum', function () {
                // 选取权重最大的值 _ub.load(2)是时间最近的值
                _ub.load(1);
                // 以下添加业务逻辑
                // console.log(_ub['vmg.business']);// 使用_ub['编号']的形式来获取，如： _ub['vmn.unitprice']
                business = _ub['vmg.business'];
                switch (business) {
                    case 'N':
                        business = 'xf';
                        break;
                    case 'E':
                        business = 'esf';
                        break;
                    case 'H':
                        business = 'jiaju';
                        break;
                    default:
                        business = 'xf';
                        break;
                }
                if (business === 'jiaju') {
                    // 风格vmh.style,居室housetype,功能间vmh.roomtype,价格 总价vmh.totalprice单位万元 ,预算：vmh.budget,面积vmh.area
                    // var houseType = _ub['vmh.housetype'];
                    // var totalPrice = _ub['vmh.totalprice'];
                    // var budget = _ub['vmh.budget'];
                    // var area = _ub['vmh.area'];
                    var style = _ub['vmh.style'] || '';
                    var roomType = _ub['vmh.roomtype'] || '';
                    $.get(vars.juheSite + '?c=juhe&a=ajaxCaiNiXiHuan&city=' + vars.city + '&type=' + business + '&style='
                        + style + '&roomType=' + roomType, function (data) {
                        if (data) {
                            $('.footer').before(data);
                            // 加载图片
                            imgLoad('#favList');
                            // 图片轮播
                            JjSwiper();
                        }
                    });
                } else if (business === 'esf') {
                    var projectid = _ub['vme.projectid'] || '';
                    $.get(vars.juheSite + '?c=juhe&a=ajaxCaiNiXiHuan&city=' + vars.city + '&type=' + business + '&projectid=' + projectid, function (data) {
                        if (data) {
                            $('.footer').before(data);
                            // 加载图片
                            imgLoad('#swiperEsf');
                            // 对图片进行滑动操作
                            Swipe('#swiperEsf');
                        }
                    });
                } else {
                    var position = _ub['vmn.position'] || '';
                    var subway = _ub['vmn.subway'] || '';
                    var unitprice = _ub['vmn.unitprice'] || '';
                    var fixstatus = _ub['vmn.fixstatus'] || '';
                    var opentime = _ub['vmn.opentime'] || '';
                    var feature = _ub['vmn.feature'] || '';
                    var housetype = _ub['vmn.housetype'] || '';
                    // var floornum = _ub['vmn.floornum'] || '';// + '&floornum=' + floornum
                    $.get(vars.juheSite + '?c=juhe&a=ajaxCaiNiXiHuan&city=' + vars.city + '&type=' + business + '&position='
                        + position + '&subway=' + subway + '&unitprice=' + unitprice + '&fixstatus=' + fixstatus + '&opentime='
                        + opentime + '&feature=' + feature + '&housetype=' + housetype, function (data) {
                        if (data) {
                            $('.footer').before(data);
                            // 加载图片
                            imgLoad('#swiperXF');
                            // 执行滑动
                            Swipe('#swiperXF');
                        }
                    });
                }
            });
        };

        // 判断是否加载了用户行为ubjs文件，执行猜你喜欢展示
        if ('undefined' !== typeof _ub) {
            setCaiNiXiHuan();
        } else {
            require.async('jsub/_ubm.js', function () {
                setCaiNiXiHuan();
            });
        }

        // 相关标签
        $.get(vars.juheSite + '?c=juhe&a=ajaxGetRelatedTags&city=' + vars.city + '&keyword=' + vars.keyword, function (data) {
            if (data) {
                $('#hisHotTags').before(data);
            }
        });
    };
});