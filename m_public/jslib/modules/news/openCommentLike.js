/**
 * 房产圈（开放平台）文章详情页图片轮播回复评论
 * Created by fenglinzeng on 17-03-23.
 */
define('modules/news/openCommentLike', ['jquery', 'lazyload/1.9.1/lazyload'], function (require, exports, module) {
    'use strict';
    // 引入jQuery
    var $ = require('jquery');
    var inAjax = false;
    // 图片惰性加载调用
    var lazyload = require('lazyload/1.9.1/lazyload');

    var commList, commCount;

    // 进入页面后加载第一屏评论并插入
    $.ajax({
        url: _vars.newsSite,
        type: 'get',
        data: {
            c: 'news',
            a: 'ajaxGetOpenFirstComment',
            id: _vars.newsid,
            city: _vars.city,
            page: 1,
            firstLoad: 1,
            pageSize: 10
        }
    }).done(function (data) {
            $('.loadComments').prepend(data);
            lazyload('img[data-original]').lazyload();
            setTimeout(function () {
                commList = $('.commList');
                commCount = commList.attr('data-commentcount');
                like();
                showMore();
                loadSec();
                loadMore();
            }, 0);
        });

    function like() {
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
    }

    function showMore() {
        // 如果评论大于三行，只显示三行并显示展开按钮
        $('.loadComm.k-comment-text').each(function (index, ele) {
            var $ele = $(ele);
            var lineHeight = $ele.css('lineHeight').replace('px', '') * 1;
            if ($ele.height() > lineHeight * 3) {
                $ele.height(lineHeight * 3 + 'px')
                    .siblings('.k-comment-date')
                    .find('.time')
                    .after('<a href="javascript:void(0);" class="txt-more">展开</a>')
                // .addClass('up')
                // .on('click', function () {
                //     if ($ele.hasClass('.close')) {
                //         $ele.height('auto');
                //     }else {
                //         $ele.height(lineHeight * 3 + 'px');
                //     }
                // });
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
    }

    function loadSec() {
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
                        lazyload('img[data-original]').lazyload();
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
    }

    // 加载更多评论
    var page = 3;

    function loadMore() {
        var loadMoreComm = $('.loadMoreComm');
        loadMoreComm.on('click', function () {
            if ((page - 1) * 5 + 10 >= commCount) {
                return;
            }
            if (inAjax) {
                return;
            }
            inAjax = true;
            loadMoreComm.html('努力加载中。。。');
            // http://mm.test.fang.com/news/index.php?c=news&a=ajaxGetOpenFirstComment&id={新闻id}&page={页码}
            $.ajax({
                url: _vars.newsSite,
                type: 'get',
                data: {
                    c: 'news',
                    a: 'ajaxGetOpenFirstComment',
                    id: _vars.newsid,
                    city: _vars.city,
                    page: page
                }
            })
                .done(function (data) {
                    commList.append(data);
                    lazyload('img[data-original]').lazyload();
                    inAjax = false;
                    if (page * 5 + 10 >= commCount) {
                        loadMoreComm.html('已显示全部评论');
                    } else {
                        loadMoreComm.html('点击加载更多评论')
                    }
                    page++;
                })
                .fail(function () {
                    inAjax = false;
                    loadMoreComm.html('加载超时，请稍后重试');
                });
        });
    }
});
