/**
 * 房产圈（开放平台）组图评论列表页
 * Created by lijianlin on 17-04-17.
 */
define('modules/news/getOpenPicsCommentList', ['jquery', 'lazyload/1.9.1/lazyload'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        // 引入jQuery
        var $ = require('jquery');
        var inAjax = false;
        // 图片惰性加载调用
        var lazyload = require('lazyload/1.9.1/lazyload');

        var commList = $('.commList');
        // 顶级评论总数
        var commCount = commList.attr('data-commentcount');

        lazyload('img[data-original]').lazyload();

        // 点赞
        commList.on('click', '.likeComm', function () {
            var $this = $(this);
            var commentItem = $this.parents('.commentItem');
            var commentID = commentItem.data('commentid');

            var numCount = $this.find('span').text() * 1;
            if (!$this.hasClass('cur') && !inAjax) {
                inAjax = true;
                // http://mm.test.fang.com/news/?c=news&a=ajaxZanOpenArticleComment&id=27
                $.ajax({
                    url: _vars.newsSite,
                    type: 'get',
                    data: {
                        c: 'news',
                        a: 'ajaxZanOpenArticleComment',
                        id: commentID,
                        city: _vars.city
                    }
                })
                    .done(function (data) {
                        inAjax = false;
                        if (data === '1') {
                            var numCount = $this.find('span').text() * 1;
                            $this.addClass('cur').find('i').addClass('on').siblings('span').text(++numCount);
                        } else {
                            $('.tiShiBox').html('点赞失败，请重试。');
                            setTimeout(function () {
                                $('.tiShiBox').hide();
                            }, 1000);
                        }
                    })
                    .fail(function () {
                        inAjax = false;
                        $('.tiShiBox').html('网络错误，请重试。');
                        setTimeout(function () {
                            $('.tiShiBox').hide();
                        }, 1000);
                    });
            }
        });

        // 如果评论大于三行，只显示三行并显示展开按钮
        $('.loadComm.k-comment-text').each(function (index, ele) {
            var $ele = $(ele);
            var lineHeight = $ele.css('lineHeight').replace('px', '') * 1;
            if ($ele.height() > lineHeight * 3) {
                $ele.height(lineHeight * 3 + 'px')
                    .siblings('.k-comment-date')
                    .find('.time')
                    .after('<a href="javascript:void(0);" class="txt-more">展开</a>')
            }
        });
        $('.txt-more').on('click', function () {
            var $this = $(this);
            var commentItem = $this.parents('.commentItem');
            var commentContent = commentItem.find('.loadComm.k-comment-text');
            var commentLineHeight = commentContent.css('lineHeight').replace('px', '') * 1;
            if (!$this.hasClass('up')) {
                commentContent.height('auto');
                $this.addClass('up').text('收起');
            } else {
                $this.removeClass('up').text('展开');
                commentContent.height(commentLineHeight * 3 + 'px');
            }
        });

        // 加载次级评论
        commList.on('click', '.loadComm', function () {
            var $this = $(this);
            var commentItem = $this.parents('.commentItem');
            var commentID = commentItem.data('commentid');
            var quoteText = commentItem.data('quotetext');
            var commentCount = commentItem.data('commentcount');
            var newsID = _vars.newsid;
            // http://mm.test.fang.com/news/index.php?c=news&a=ajaxGetSecondCommentList&id={新闻id}&commentId={父级评论id}&quoteText={引用文字}&commentCount={次级评论条数}
            var moreCommWrap = commentItem.find('.moreCommWrap');
            if (!moreCommWrap.hasClass('open')) {
                $.ajax({
                    url: _vars.newsSite,
                    type: 'get',
                    data: {
                        c: 'news',
                        a: 'ajaxGetSecondCommentList',
                        id: newsID,
                        city: _vars.city,
                        commentId: commentID,
                        quoteText: quoteText,
                        commentCount: commentCount
                    }
                })
                    .done(function (data) {
                        moreCommWrap.show().addClass('open').html(data);
                    })
                    .fail(function () {
                        $('.tiShiBox').html('加载失败，请重试。');
                        setTimeout(function () {
                            $('.tiShiBox').hide();
                        }, 1000);
                    });
            } else {
                moreCommWrap.removeClass('open').hide().html('');
            }
        });

        // 加载更多顶级评论
        if (commCount > 10) {
            var pageUrl = _vars.newsSite + '?c=news&a=ajaxGetOpenFirstComment&id=' + _vars.newsid + '&city=' + _vars.city;
            require.async(['loadMore/1.0.0/loadMore'], function (loadMore) {
                loadMore({
                    // 数据总条数
                    total: commCount,
                    // 首屏显示数据条数
                    pagesize: 10,
                    // 单页加载条数
                    pageNumber: 5,
                    // 是否需要第一次上拉到底后不加载更多，第二次后才加载更多，可为空，默认为true
                    firstDragFlag: false,
                    // 加载更多按钮id
                    moreBtnID: '.loadMoreComm',
                    // 是否需要上拉加载更多功能即是否需要scroll事件监听，可为空，默认为true
                    isScroll: true,
                    // 加载数据过程显示提示id
                    loadPromptID: '.loadMoreComm',
                    // 数据加载过来的html字符串容器
                    contentID: '.commList',
                    // 加载前显示内容
                    loadAgoTxt: '上拉查看更多评论',
                    // 加载中显示内容
                    loadingTxt: '正在加载请稍候',
                    // 加载完成后显示内容
                    loadedTxt: '上拉查看更多评论',
                    // 接口地址
                    url: pageUrl
                });
            });
        }
    }
});
