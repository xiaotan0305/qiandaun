/**
 * 开放平台我的页面
 * Created by limengyang.bj@fang.com 2017-9-10
 */
define('modules/news/myFcqIndex', ['jquery', 'lazyload/1.9.1/lazyload', 'loadMore/1.0.2/loadMore'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var vars = seajs.data.vars;
        var $ = require('jquery');
        // ajax标识
        var inAjax = false;
        // 遮罩
        var $float = $('.float');
        // 弹框
        var $floatAlert = $('.floatAlert');
        // 图片惰性加载
        var lazyLoad = require('lazyload/1.9.1/lazyload');
        lazyLoad('img[data-original]').lazyload();
        var pageType = vars.pageType;
        // 个人介绍展开
        var $userIntro = $('.userIntro');
        var $desp = $userIntro.find('p');
        $userIntro.on('click', function () {
            // 展开
            if ($desp.hasClass('before')) {
                $desp.removeClass('before').addClass('after');
                // 只有一行隐藏箭头
                if ($desp.height() <= 20) {
                    $userIntro.find('.more').remove();
                }
            } else {
                $desp.removeClass('after').addClass('before');
            }
        });

        var $tiShiBox = $('.tiShiBox');
        var $delArticle = $('.delArticle');

        // 显示提示信息
        var showPrompt = function (msg) {
            $tiShiBox.html(msg).show();
            // 延时隐藏
            setTimeout(function () {
                $tiShiBox.hide();
            }, 1000);
        };

        // 点击遮罩
        $float.on('click', function () {
            // 遮罩隐藏
            $float.hide();
            // 弹框隐藏
            $floatAlert.hide();
        });
        // 取消按钮
        $floatAlert.on('click', '.floatOffBtn', function () {
            $float.hide();
            $floatAlert.hide();
        });

        // 我的文章
        if (pageType === 'article') {
            var $wList = $('.k-wList');
            // 删除文章id
            var delNewsId;
            // 直播id
            var delZhiBoId;
            // 删除li标签
            var $delLi;

            //点击删除按钮
            $wList.on('click', '.del', function () {
                var $that = $(this);
                delNewsId = $that.attr('data-newsid');
                delZhiBoId = $that.attr('data-zhiboid');
                $delLi = $that.parent();
                $delArticle.show();
                $float.show();
            });

            // 删除文章确认
            $('.delArticleOk').on('click', function () {
                if (!inAjax && (delNewsId || delZhiBoId)) {
                    inAjax = true;
                    // 遮罩和弹框隐藏
                    $float.trigger('click');
                    $.ajax({
                        url: vars.newsSite + '?c=news&a=ajaxDelMyFcqArticle&city=' + vars.city,
                        data: {
                            newsid: delNewsId,
                            zhiboId: delZhiBoId,
                            uid: vars.uid
                        },
                        success: function (data) {
                            // 有返回值
                            if (data) {
                                showPrompt('删除成功');
                                $delLi.html('');
                            } else {
                                showPrompt('删除失败');
                            }
                        },
                        error: function () {
                            showPrompt('删除失败');
                        },
                        complete: function () {
                            inAjax = false;
                        }
                    });
                }
            });
        } else if (pageType === 'fans') {
            // 粉丝关注
            // 关注的用户id
            var gzUserId;
            // 关注按钮标签
            var $clickGzBtn;
            var $fsList = $('.k-fsList');
            var gzUpdate = function () {
                inAjax = true;
                $.ajax({
                    url: 'https://mp.fang.com/opencmsJsonp/updateGzCnt.do?optType=2',
                    data: {
                        userById: gzUserId,
                        passporName: vars.fcqPassportName
                    },
                    type: 'get',
                    async: false,
                    dataType: 'jsonp',
                    // 服务端用于接收callback调用的function名的参数
                    jsonp: 'callbackparam',
                    success: function (json) {
                        // optType=1时候，返回已关注，未关注两个值,optType=2时候，返回成功，失败两个值
                        if (json === '关注成功') {
                            showPrompt('您已关注成功');
                            $clickGzBtn.removeClass('gz').html('<span class="hg">已互关</span>');
                        } else if (json === '取消关注成功') {
                            showPrompt('成功取消关注');
                            $clickGzBtn.addClass('gz').html(' + 关注 ');
                        } else if (json === '失败') {
                            showPrompt('取消关注失败');
                        } else {
                            showPrompt('抱歉关注失败');
                        }
                    },
                    error: function () {
                        showPrompt('抱歉关注失败');
                    },
                    complete: function () {
                        inAjax = false;
                    }
                });
            };

            // 关注
            $fsList.on('click', '.gzBtn', function () {
                var $that = $(this);
                gzUserId = $that.attr('data-id');
                if (!inAjax && gzUserId) {
                    $clickGzBtn = $that;
                    gzUpdate();
                }
            });
        } else if (pageType === 'comment') {
            var $glList = $('.k-glList');
            var moreTextDeal = function () {
                // 评论箭头
                $('.loadComm').each(function (index, ele) {
                    var $ele = $(ele);
                    if ($ele.height() > 22) {
                        $ele.parent().next().show();
                    }
                });
            };
            moreTextDeal();

            // 点击评论
            $glList.on('click', '.commDiv', function () {
                var $this = $(this);
                // 一级评论li标签
                var commentLi = $this.parents('.commentLi');
                // 一级评论展开按钮
                var $moreBox = $this.find('.moreBox');
                // 一级评论内容txt
                var $commText = $this.find('.commText');
                // 二级评论框
                var $glCon = commentLi.find('.glCon');
                if ($glCon.is(':hidden')) {
                    // 有一级评论箭头，评论展开
                    if ($moreBox.length > 0 && !$moreBox.is(':hidden')) {
                        $commText.css('max-height', '500px');
                        $moreBox.find('a').addClass('up');
                    }
                    if ($glCon.find('.flexbox').length === 0) {
                        // 二级评论列表
                        var commentID = commentLi.data('commentid');
                        var quoteText = commentLi.data('quotetext');
                        var commentCount = commentLi.data('secondCommentCount');

                        var newsID = commentLi.data('newsid');
                        /*commentID = 161;
                         commentCount = 18;
                         quoteText = '特别长特别长特别长特别长特别长特别长特别长特别长特别长特别长特别长特';
                         newsID = 24573495;*/
                        // http://mm.test.fang.com/news/index.php?c=news&a=ajaxGetSecondCommentList&id={新闻id}&commentId={父级评论id}&quoteText={引用文字}&commentCount={次级评论条数}
                        $.ajax({
                            url: vars.newsSite,
                            type: 'get',
                            data: {
                                c: 'news',
                                a: 'ajaxGetSecondCommentList',
                                id: newsID,
                                commentId: commentID,
                                quoteText: quoteText,
                                commentCount: commentCount
                            }
                        }).done(function (data) {
                            $glCon.show().html(data);
                        }).fail(function () {
                            showPrompt('加载失败，请重试。');
                        });
                    } else {
                        $glCon.show();
                    }

                } else {
                    $glCon.hide();
                    // 有一级评论箭头，评论收起
                    if ($moreBox.length > 0 && !$moreBox.is(':hidden')) {
                        $commText.css('max-height', '22px');
                        $moreBox.find('a').removeClass('up');
                    }
                }
            });

            var pushBtnText;
            var commId;
            var $pushBtnA;
            var $commDelLi;
            var commModifyStu = function (stu) {
                inAjax = true;
                // 遮罩和弹框隐藏
                $float.trigger('click');
                $.ajax({
                    url: vars.newsSite + '?c=news&a=ajaxModifyCommStatus&city=' + vars.city,
                    data: {
                        uid: vars.uid,
                        id: commId,
                        status: stu
                    },
                    success: function (data) {
                        // 有返回值
                        if (data) {
                            if (stu === 0) {
                                showPrompt('已撤回');
                                $pushBtnA.html('审核发表');
                            } else if (stu === 1) {
                                showPrompt('审核成功');
                                $pushBtnA.html('撤回发表');
                            } else {
                                showPrompt('删除成功');
                                $commDelLi.remove();
                            }
                        } else {
                            if (stu === 0) {
                                showPrompt('撤回失败');
                            } else if (stu === 1) {
                                showPrompt('审核失败');
                            } else {
                                showPrompt('删除失败');
                            }
                        }
                    },
                    error: function () {
                        if (stu === 0) {
                            showPrompt('撤回失败');
                        } else if (stu === 1) {
                            showPrompt('审核失败');
                        } else {
                            showPrompt('删除失败');
                        }
                    },
                    complete: function () {
                        inAjax = false;
                    }
                });
            };
            $glList.on('click', '.pushBtn', function () {
                var $that = $(this);
                commId = $that.attr('data-id');
                if (!inAjax && commId) {
                    pushBtnText = $that.text().trim();
                    $pushBtnA = $that;
                    var status;
                    if (pushBtnText === '审核发表') {
                        status = 1;
                    } else {
                        status = 0;
                    }
                    commModifyStu(status);
                }
            });
            // 评论删除按钮
            $glList.on('click', '.del', function () {
                var $that = $(this);
                $float.show();
                $('.delComm').show();
                commId = $that.attr('data-id');
                $commDelLi = $that.parent();
            });
            // 评论删除确认
            $('.delCommOk').on('click', function () {
                if (!inAjax && commId) {
                    commModifyStu(2);
                }
            });
        }
        // ajax加载更多
        if (vars.totalCount > 20) {
            var loadMore = require('loadMore/1.0.2/loadMore');
            // ajax方法名称
            var actName;
            // ul容器
            var $contentID;
            var ajaxFun;
            // 我的文章，我的粉丝，我的评论
            if (pageType === 'article') {
                $contentID = $('.k-wList ul');
            } else if (pageType === 'fans') {
                $contentID = $('.k-fsList ul');
            } else if (pageType === 'comment') {
                $contentID = $('.k-glList ul');
                ajaxFun = moreTextDeal;
            }
            loadMore({
                url: vars.newsSite + '?c=news&a=ajaxMyFcqInfo&city=' + vars.city + '&uid=' + vars.uid + '&pageType=' + pageType,
                // 数据总条数
                total: vars.totalCount,
                // 首屏显示数据条数
                pagesize: 20,
                // 单页加载条数
                pageNumber: 10,
                // 加载更多按钮id
                moreBtnID: '#drag',
                // 是否需要第一次上拉到底后不加载更多，第二次后才加载更多，可为空，默认为true
                firstDragFlag: false,
                // 加载数据过程显示提示id
                loadPromptID: '#draginner',
                // 数据加载过来的html字符串容器
                contentID: $contentID,
                // 加载前显示内容
                loadAgoTxt: '<div class="moreList"><a class="bt">查看更多</a></div>',
                // 加载中显示内容
                loadingTxt: '<div class="moreList graybg"><span><i></i>努力加载中...</span></div>',
                // 加载完成后显示内容
                loadedTxt: '<div class="moreList"><a class="bt">查看更多</a></div>',
                callback: ajaxFun
            });
        }
    };
});