/**
 * Created by Young on 15-10-26.
 * Modify by young on 16-4-19
 */
define('modules/jiaju/designerInfo', ['jquery', 'lazyload/1.9.1/lazyload', 'photoswipe/4.0.7/photoswipe', 'photoswipe/4.0.7/photoswipe-ui-default.min','loadMore/1.0.1/loadMore'],
    function (require, exports, module) {
        'use strict';
        module.exports = function () {
            var $ = require('jquery');
            var vars = seajs.data.vars;
            //图片lazyload
            require('lazyload/1.9.1/lazyload');
            $('.lazyload').lazyload();

            //处理底部
            $('footer').css('padding-bottom', '120px');
            //导航固定
            if (vars.soufunid) {
                var desnavTop = $('#desnav').offset().top;
            }
            $(window).on('scroll', function () {
                var $this = $(this);
                if ($this.scrollTop() > desnavTop) {
                    $('#desnav').css({
                        position: 'fixed',
                        left: 0,
                        top: 0,
                        width: '100%',
                        'margin': 0,
                        'z-index': 1000
                    });
                } else {
                    $('#desnav').attr('style', '');
                }
            });
            var caseReload=$('#case_reload'),reload=$('#reload'),evalReload=$('#eval_reload');
            //设计作品数据加载失败刷新操作
            caseReload.on('click', function () {
                location.reload();
            });
            //整个页面数据加载失败刷新操作
            reload.on('click', function () {
                location.reload();
            });

            //评论数据加载失败刷新操作
            evalReload.on('click', function () {
                location.reload();
            });

            //评论数据加载失败刷新操作
            evalReload.on('click', function () {
                location.reload();
            });

            var loadMore=require('loadMore/1.0.1/loadMore');
            loadMore.add({
                url: vars.jiajuSite + '?c=jiaju&a=ajaxGetSjsCase&city=' + vars.city+ '&soufunid=' + vars.soufunid,
                total: vars.casetotal,
                activeEl:'#case',
                active:'active',
                pagesize: 10,
                pageNumber: 10,
                content: $('#case_content'),
                moreBtn: $('#case_clickmore')
                //loadPrompt: $('#case_content')
            });

            loadMore.add({
                url: vars.jiajuSite + '?c=jiaju&a=ajaxGetSjsEval&city=' + vars.city+ '&soufunid=' + vars.soufunid,
                total: vars.evaltotal,
                activeEl:'#eval',
                active:'active',
                pagesize: 10,
                pageNumber: 10,
                content: $('#eval_content'),
                moreBtn: $('#eval_clickmore')
                //loadPrompt: $('#case_content')
            });
            loadMore.init();

            //导航切换
            $('.secTab').find('a').on('click', function () {
                if (!$(this).hasClass('active')) {
                    navChange($(this).attr('id'));
                }
            });

            function navChange(a) {
                $('.secTab').find('a').removeClass('active');
                $('#' + a).addClass('active');
                $('#intro_con').hide();
                $('#case_con').hide();
                eval_con.hide();
                $('#' + a + '_con').show();
                //处理简介
                if (a == 'intro') {
                    if (moreContent.height() > 46) {
                        moreContent.css('max-height', '3.3em');
                        $('#divmore').show();
                        $('#expmore').removeClass('more-unfold');
                    }
                }
                //处理评论底部
                if (a == 'eval') {
                    $('.lazyload').lazyload();
                    if (vars.evaltotal == 1) {
                        eval_con.css('padding-bottom', '117px');
                    }
                }
                //处理导航
                if ($(document).scrollTop() > desnavTop) {
                    $('html,body').animate({
                        scrollTop: desnavTop
                    }, 10);
                }

            }
            var eval_con = $('#eval_con');

            var conImg=$('.conImg');
            // 点击评论图片，图片放大功能
            conImg.on('click', 'img', function () {
                var url = $(this).attr('data-original');
                var slides = [];
                var index = 0;
                var allImg = $(this).closest('.conImg').find('img') ;
                // 点击缩放大图浏览
                if (allImg.length > 0) {
                    var pswpElement = $('.pswp')[0];
                    for (var i = 0, len = allImg.length; i < len; i++) {
                        var ele = allImg[i],
                            src = $(ele).attr('data-original');
                        if (src === url) {
                            index = i;
                        }
                        slides.push({src: src, w: ele.naturalWidth, h: ele.naturalHeight});
                    }
                    var options = {
                        history: false,
                        focus: false,
                        index: index,
                        escKey: true
                    };
                    var gallery = new window.PhotoSwipe(pswpElement, window.PhotoSwipeUI_Default, slides, options);
                    gallery.init();
                }
            });


            // 点赞功能
            $('#eval_content').on('click', 'span.right', function () {
                var $this=$(this);
                // 如果没登录，跳到登录页
                $.get(vars.publicSite + '?c=public&a=ajaxUserInfo', function (info) {
                    if (!info.userid) {
                        var burl = window.location.href.split('?');
                        var fburl = burl[0] + '?sign=eval';
                        window.location = location.protocol + '//m.fang.com/passport/login.aspx?burl=' + encodeURIComponent(fburl) + '&r=' + Math.random();
                        return;
                    } else {
                        var objid = $this.closest('li').attr('id');
                        var praiseObj = $this.closest('li');
                        var isPraise = $this.closest('li').attr('data-praise');
                        // 获取为点过的值
                        var praiseNum;
                        if (isPraise === '0') {
                            praiseNum = parseInt($this.closest('li').attr('data-num'));
                        } else {
                            praiseNum = parseInt($this.closest('li').attr('data-num')) - 1;
                        }
                        var ajaxUrl = vars.jiajuSite + '?c=jiaju&a=addPrise&type=4&r=' + Math.random();
                        $.get(ajaxUrl, {
                                objid: objid,
                                isPraise: praiseObj.attr('data-status')
                            },
                            function (data) {
                                if (data === '0') {
                                    praiseObj.attr('data-status', '1');
                                    praiseObj.find("div.right2").html('<span class="right support play"><i>+1</i>'+(praiseNum + 1)+'</span>');
                                } else {
                                    praiseObj.attr('data-status', '0');
                                    praiseObj.find("div.right2").html('<span class="right support"><i></i>'+praiseNum+'</span>');
                                }
                            });
                    }
                });
            });



            var moreContent = $('#moreContent');
            //更多简介
            $('.more_xq').on('click', function () {
                var $this = $(this);
                if ($this.css('-webkit-transform') == 'none') {
                    //moreContent.css('max-height', '3.3em');
                    //$(this).removeClass('more-unfold');
                    moreContent.css('max-height', 'none');
                    $(this).css('-webkit-transform','rotateX(180deg)');
                } else {
                    moreContent.css('max-height', '3em');
                    $(this).css('-webkit-transform','none');
                }

            });

            //设计师评论数
            $('#descomm').on('click', function () {
                navChange('eval');
            });

            // 搜索用户行为收集20160114
            var page = 'mjjdesignerpage';
            require.async('jsub/_vb.js?c=' + page);
            require.async('jsub/_ubm.js', function () {
                _ub.city = vars.cityname;
                _ub.biz = 'h';
                _ub.location = 0;
                var showlocation = $('.secTab').find('.active').text().replace(/^(评价).*$/, '$1');
                var b = 1;
                var p = {
                    'vmh.showlocation': encodeURIComponent(showlocation),
                    'vmg.page': page
                };
                _ub.collect(b, p);
            });
            $('.jj-coneDe').click(function () {
                var b = 31;
                var p = {
                    'vmg.page': page,
                    'vmh.designerid': vars.soufunid
                };
                _ub.collect(b, p);
            });

        };
    });