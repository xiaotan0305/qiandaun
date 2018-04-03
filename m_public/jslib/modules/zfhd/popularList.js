define('modules/zfhd/popularList', ['jquery', 'lazyload/1.9.1/lazyload', 'modules/zfhd/exts/jquery.selector-px.js', 'weixin/2.0.0/weixinshare', 'superShare/2.0.0/superShare'], function (require, exports, module) {
        'use strict';
        module.exports = function () {
            var $ = require('jquery');
            var vars = seajs.data.vars;
            function preventDefault(e) {
                e.preventDefault();
            }

            //微信分享，调用微信分享的插件
            var Weixin = require('weixin/2.0.0/weixinshare');
            var wx = new Weixin({
                debug: false,
                shareTitle: vars.title,
                // 副标题
                descContent: vars.description,
                lineLink: vars.jumpath,
                imgUrl: vars.imgpath,
                swapTitle: true
            });

            /**
             * 手指滑动时阻止浏览器默认事件(阻止页面滚动）
             */
            function unable() {
                $("html").css("overflow","hidden");
                $("body").css("overflow","hidden");
            }

            /**
             * 手指滑动恢复浏览器默认事件（恢复滚动
             */
            function enable() {
                $("html").css("overflow","");
                $("body").css("overflow","");
            }

            //选择城市
            $.scrEvent({
                data: JSON.parse(vars.hdcitylist),  //数据
                evEle: '.qu-year',            //选择器
                title: '切换城市',            // 标题
                defValue: vars.cityname,     // 默认值
                afterAction: function (data) {   //  点击确定按钮后,执行的动作
                    var citylistRv = JSON.parse(vars.citylistRv);
                    var citysld = citylistRv[data];
                    window.location.href = vars.zfSite + citysld + '/?c=zfhd&a=popularList';
                }
            });


            // 图片延迟加载
            require.async('lazyload/1.9.1/lazyload', function () {
                $('img[data-original]').lazyload();
            });
            //加载更多功能
            var dragBox = $('#drag');
            if (dragBox.length > 0) {
                require.async('loadMore/1.0.0/loadMore', function (loadMore) {
                    loadMore({
                        url: vars.zfSite + '?c=zfhd&a=ajaxGetPopularList&city=' + vars.city,
                        total: vars.total,
                        pagesize: 10,
                        pageNumber: 5,
                        contentID: '#content',
                        moreBtnID: '#drag',
                        loadPromptID: '#loading',
                        firstDragFlag: false,
                        callback: function () {
                            if ($('.zflist li').length > 0) {
                                $('.butie').show();
                            } else {
                                $('.butie').hide();
                            }
                        }
                    });
                });
            }
            //点击回到顶部
            $('.goTop').on('click', function () {
                $("html,body").animate({scrollTop:0}, 100);
            });

            //点击弹窗
            $('#rule').on('click', function () {
                $(".zuopenbox").show();
                $(".opencon").show();
                unable();
            });

            if ($('.zflist li').length > 0) {
                $('.butie').show();
            } else {
                $('.butie').hide();
            }
            //点击隐藏
            $('.close').on('click', function () {
                $(".zuopenbox").hide();
                $(".opencon").hide();
                enable();
            });

        };
    });