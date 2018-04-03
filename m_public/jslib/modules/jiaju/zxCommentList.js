define('modules/jiaju/zxCommentList', [
    'jquery',
    'lazyload/1.9.1/lazyload',
    'loadMore/1.0.1/loadMore',
    'modules/jiaju/IconStar',
    'photoswipe/4.0.7/photoswipe',
    'photoswipe/4.0.7/photoswipe-ui-default.min',
    'modules/jiaju/yhxw'
], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        // 图片惰性加载
        var lazyload = require('lazyload/1.9.1/lazyload');
        $('.lazyload').lazyload();
        // 评分星星
        var IconStar = require('modules/jiaju/IconStar');
        new IconStar();
        // 用户行为
        var yhxw = require('modules/jiaju/yhxw');
        var pageId = 'jj_gs^pllb_wap';
        yhxw({
            page: pageId,
            companyid: vars.companyid
        });
        // 默认的正在加载
        var loadingFloat = $('#default_loading');
        // 默认的加载失败
        var timeOutFloat = $('#default_timeout');
        // 下标
        var pos = 0;

        var companyid = vars.companyid;
        var filterType = $('.filterType');
        var body = $('body');
        // 上拉加载更多
        var loadMore = require('loadMore/1.0.1/loadMore');
        function loadMoreData() {
            var totalCount = parseInt(vars.count);
            for (var i = 0; i < 3; i++) {
                var hasimage = filterType.eq(i).attr('data-hasimage') === '1' ? filterType.eq(i).attr('data-hasimage') : '';
                var issign = filterType.eq(i).attr('data-issign') === '1' ? filterType.eq(i).attr('data-issign') : '';
                totalCount > 20 && loadMore.add({
                    url: location.protocol + vars.jiajuSite + '?c=jiaju&a=ajaxZXCommentList&city=' + vars.city
                        + '&companyid=' + companyid + '&hasimage=' + hasimage + '&issign=' + issign,
                    // 数据总条数
                    total: totalCount,
                    // 首屏显示数据条数
                    pagesize: 20,
                    // 单页加载条数，可不设置
                    perPageNum: 20,
                    // 当前加载更多执行所需的元素实例
                    activeEl: '.filterType:eq(' + i + ')',
                    // 根据当前加载更多所需元素实例是否存在该类名决定是否启动加载更多操作
                    active: 'active',
                    // 加载更多按钮id
                    moreBtn: '#moreList_' + i,
                    // 加载数据过程显示提示id
                    loadPrompt: '#loadPrompt_' + i,
                    // 数据加载过来的html字符串容器
                    content: '#commentList_' + i,
                    loadingTxt: '<i></i>努力加载中...',
                    loadAgoTxt: '<i></i>点击加载更多...',
                    firstDragFlag: false,
                    callback: function (data) {
                        // 超过总页数隐藏加载更多按钮
                        if (parseInt(data.pageMarloadFlag) >= parseInt(data.totalPage)) {
                            $('#moreList_' + i).hide();
                        }
                        new IconStar('ico-star', 'data-score', $(data));
                        lookMoreContent($(data));
                    }
                });
            }
            loadMore.init();
        }
        loadMoreData();

        // 筛选
        filterType.on('click', function () {
            var $that = $(this), params = {};
            params.companyid = companyid;
            params.hasimage = $that.attr('data-hasimage') === '1' ? $that.attr('data-hasimage') : '';
            params.issign = $that.attr('data-issign') === '1' ? $that.attr('data-issign') : '';
            loadingFloat.show();
            loadDataByChoose(params.hasimage, params.issign, $that);
        });
        function loadDataByChoose(hasimage, issign, obj) {
            // 给切换加上class
            obj.addClass('active').siblings().removeClass('active');
            // 得到下标
            getLoadMorePos(hasimage, issign);
            var params = {hasimage: hasimage, issign: issign, companyid: companyid};
            $.get(location.protocol + vars.jiajuSite + '?c=jiaju&a=ajaxZXCommentList&city=' + vars.city, params, function (data) {
                if (data && $.trim(data)) {
                    var contentObj = $('#commentList_' + pos), count = parseInt(obj.attr('data-count'));
                    contentObj.html(data).show().siblings().hide();
                    loadMore.config[pos].totalPage = Math.ceil(count / 20);
                    $('.lazyload').lazyload();
                    count > 20 ? $('#moreList_' + pos).show().siblings('.moreList').hide() : $('.moreList').hide();
                    loadingFloat.hide();
                    timeOutFloat.hide();
                    new IconStar('ico-star', 'data-score', contentObj);
                    lookMoreContent(contentObj);
                    // 查看大图
                    seeBigImgFn(pos);
                } else {
                    $('#commentList_' + pos).hide().siblings().hide();
                    $('#moreList_' + pos).hide().siblings('.moreList').hide();
                    loadingFloat.hide();
                    timeOutFloat.show();
                }
            });
        }
        function getLoadMorePos(hasimage, issign) {
            if (hasimage === '' && issign === '') {
                pos = 0;
            } else if (hasimage === '' && issign === '1') {
                pos = 1;
            } else if (hasimage === '1' && issign === '') {
                pos = 2;
            } else {
                return;
            }
        }

        // 评论内容查看更多
        lookMoreContent($('#commentList_0'));
        function lookMoreContent($obj) {
            var intro = $obj.find('.comment-cons');
            $obj.find('.comment-cons').each(function (index) {
                var moreHeight = intro.eq(index).find('p').height();
                var moreBtn = intro.eq(index).siblings('.comment-more');
                if (moreHeight <= 78) {
                    moreBtn.hide();
                    intro.eq(index).css('overflow', 'visible');
                    intro.eq(index).css('max-height', 'none');
                }
            });
            $obj.find('.comment-more').on('click', function () {
                var $that = $(this);
                var intro = $that.siblings('.comment-cons');
                if (intro.css('overflow') === 'hidden') {
                    intro.css('max-height', 'none');
                    intro.css('overflow', 'visible');
                    $that.addClass('u');
                } else {
                    intro.css('max-height', '78px');
                    intro.css('overflow', 'hidden');
                    $that.removeClass('u');
                }
            });
        }


        // 提示弹层
        var sendText = $('#sendText');
        var sendFloat = $('#sendFloat');
        function toastFn(msg) {
            sendText.text(msg);
            sendFloat.show();
            setTimeout(function () {
                sendFloat.hide();
            }, 2000);
        }
        // 是否登录
        function checkLogin(msg) {
            var res = true;
            if (!vars.login_visit_mode) {
                res = false;
                msg && toastFn(msg);
                window.location.href = vars.loginUrl;
            }
            return res;
        }
        // 对点评点赞
        body.on('click', '.shc', function () {
            var $that = $(this);
            // 点赞用户行为
            yhxw({
                page: pageId,
                type: 55,
                companyid: vars.companyid,
                commentid: $that.attr('data-id').trim()
            });
            if (checkLogin('请登录操作')) {
                $.get(vars.jiajuSite + '?c=jiaju&a=ajaxZXCommentZan&city=' + vars.city + '&commentid=' + $that.attr('data-id'), function (data) {
                    if (data && data.result === '1') {
                        toastFn('您已点赞成功');
                        $that.html('<i>+1</i>' + parseInt(parseInt($that.text()) + 1));
                        $that.addClass('cur');
                    } else if (data && data.result === '0') {
                        toastFn('您已点赞了哦');
                    }
                });
            }
        });

        // 点击超时重新加载
        timeOutFloat.on('click', function () {
            var filterObj = $('.filterType.active');
            loadDataByChoose(filterObj.attr('data-hasimage'), filterObj.attr('data-issign'), filterObj);
        });


        // 点击图片，图片放大功能
        var ratioX = document.documentElement.clientWidth;
        function opImgWH(w, h) {
            var ratio = 1;
            var w2 = w;
            var h2 = h;
            if (w2 <= ratioX) {
                ratio = ratioX / w2;
                w2 = ratioX;
                h2 *= ratio;
            } else {
                w2 = ratioX;
                ratio = w2 / ratioX;
                h2 *= ratio;
            }
            return {w: w2, h: h2};
        }
        var main = $('.main');
        seeBigImgFn(0);
        function seeBigImgFn(pos) {
            main.find('#commentList_' + pos).on('click', '.imgbox', function () {
                var url = $(this).attr('original');
                var slides = [];
                var index = 0;
                // 获取当前容器内图片数量
                var allImg = $('#commentList_' + pos).find('.imgbox');
                var w = 0, h = 0;
                var resultWH = null;
                // 点击缩放大图浏览
                if (allImg.length > 0) {
                    var pswpElement = $('.pswp')[0];
                    for (var i = 0, len = allImg.length; i < len; i++) {
                        var ele = allImg[i],
                            src = $(ele).attr('original');
                        if (src === url) {
                            index = i;
                        }
                        w = jQuery(allImg[i]).width();
                        h = jQuery(allImg[i]).height();
                        resultWH = opImgWH(w, h);
                        slides.push({src: src, w: resultWH.w, h: resultWH.h});
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
        }
    };
});