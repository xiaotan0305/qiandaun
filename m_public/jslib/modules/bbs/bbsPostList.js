/**
 * bbs列表页
 * @Last Modified by:   liyingying
 * @Last Modified time: 2016/1/13
 */
define('modules/bbs/bbsPostList', ['jquery', 'loadMore/1.0.0/loadMore', 'lazyload/1.9.1/lazyload', 'modules/bbs/bbsbuma', 'superShare/1.0.1/superShare'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var win = window;
        var actionName = vars.actionName;
        if (actionName === 'postlist') {
            var pageId = 'mbbspostlist';
        } else if (actionName === 'postlistgood') {
            var pageId = 'mbbsessencepostlist';
        }
        // 用户行为对象
        var bbsbuma = require('modules/bbs/bbsbuma');
        //搜索布码
        bbsbuma({type: 1, pageId: pageId, forumid: vars.sign, forumname: vars.signName});
        /* 图片惰性加载*/
        require('lazyload/1.9.1/lazyload');
        $('.img').lazyload();

        // 浮层
        var floatAlert = $('.floatAlert'),
        // 浮层中提示信息
            toastMsg = $('#toastMsg'),
        // 关注帖子人数
            gzNum = $('#gzNum');
        var loadMore = require('loadMore/1.0.0/loadMore');
        var ajaxUrl = '';
        if (vars.type) {
            ajaxUrl = vars.bbsSite + '?c=bbs&a=ajaxGetPostList' + '&city=' + vars.city + '&sign=' + vars.sign + '&type=' + vars.type;
        } else {
            ajaxUrl = vars.bbsSite + '?c=bbs&a=ajaxGetPostListGood' + '&city=' + vars.city + '&sign=' + vars.sign + '&bid=&announceId=';
        }
        loadMore({
            url: ajaxUrl,
            total: vars.totalCount,
            pagesize: 20,
            pageNumber: 20,
            moreBtnID: '.more_text',
            loadPromptID: '.more_text',
            isScroll: false,
            contentID: '#bbsList',
            loadAgoTxt: '点击加载更多',
            loadingTxt: '努力加载中...',
            lazyCon: '.img[data-original]',
            firstDragFlag: false
        });

        require.async('modules/bbs/lacc', function (run) {
            run();
        });

        /**
         * 显示浮层
         * @param msg 提示信息
         */
        function showLayer(msg) {
            toastMsg.text(msg);
            floatAlert.show();
            setTimeout(function () {
                floatAlert.hide();
            }, 2000);
        }

        var clickFlag = false;
        // 关注或者取消关注
        $('.guanzhu').on('click', function () {
            //关注布码
            bbsbuma({type: 21, pageId: pageId, forumid: vars.sign});
            if (clickFlag) {
                return;
            }
            clickFlag = true;
            var gzCount = parseInt(gzNum.text());
            var ele = $(this);
            $.ajax({
                url: vars.bbsSite + '?c=bbs&a=focusBbs&city=' + vars.city,
                data: {
                    sign: vars.sign,
                    signName: vars.signName,
                    action: ele.text() === '已关注' ? 'cancel' : 'add'
                },
                type: 'get',
                success: function (data) {
                    // 未登陆，跳登陆
                    if (data.result === 'noLog') {
                        win.location = data.url;
                        return;
                    }
                    if (data.errcode !== '0') {
                        showLayer(data.errmsg);
                    } else if (ele.text() === '已关注') {
                        ele.removeClass('un').html('<i>+</i>关注');
                        gzNum.text(gzCount - 1);
                    } else {
                        ele.addClass('un').text('已关注');
                        gzNum.text(gzCount + 1);
                    }
                    clickFlag = false;
                },
                error: function () {
                    clickFlag = false;
                }
            });
        });

        // 分享
        if ($('.share').length) {
            var SuperShare = require('superShare/1.0.1/superShare');
            var shareA = $('.share');
            var config = {
                // 分享的内容title
                title: vars.pageTitle,
                // 分享时的图标
                image: location.protocol + vars.pageImg,
                // 分享内容的详细描述
                desc: vars.pageDes,
                // 分享的链接地址
                url: location.href,
                // 分享的内容来源
                from: ' 房天下' + vars.cityname + '论坛'
            };
            new SuperShare(config);
        }
    };
});