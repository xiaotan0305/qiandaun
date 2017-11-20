/**
 * 房产圈（开放平台）文章详情页图片轮播回复评论
 * Created by fenglinzeng on 17-03-23.
 */
define('modules/news/replyOpenComment', ['jquery'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        // 引入jQuery
        var $ = require('jquery');
        var textNum = $('#txtnum');
        var commInput = $('#commInput');
        var inputMin = 2;
        var inputMax = 100;

        var float = $('.float');
        var tishiBox = $('.tiShiBox');

        function tipBox(txt) {
            float.show();
            tishiBox.show().text(txt);
            setTimeout(function () {
                float.hide();
                tishiBox.hide().text();
            }, 2000);
        }

        // 输入字数实时显示
        // 和输入字数限制
        commInput.on('input', function () {
            var inputText = $(this).val();
            var inputLen = inputText.length;
            textNum.text(inputLen + '/' + inputMax);
            if (inputLen > inputMax) {
                commInput.val(inputText.substr(0, inputMax));
                textNum.text(inputMax + '/' + inputMax);
                return tipBox('回复内容不得多于' + inputMax + '个字。');
            }
        });

        // 点击提交按钮
        var postComment = $('.postComment');
        postComment.on('click', function () {
            var newsId = _vars.newsId || '';
            var parentId = _vars.parentId || '';
            var quotePassPortId = _vars.quotePassPortId || '';
            var commentContent = commInput.val().trim();

            if (newsId === '') {
                return tipBox('异常：没有newsid');
            }
            if (commentContent === '') {
                return tipBox('评论内容不能为空');
            }
            if (commentContent.length < inputMin) {
                commInput.focus();
                return tipBox('回复内容不得少于' + inputMin + '个字。');
            }
            $.ajax({
                url: _vars.newsSite + '?c=news&a=ajaxPostOpenArticleComment',
                type: 'post',
                dataType: 'json',
                data: {
                    newsId: newsId,
                    commentContent: commentContent,
                    parentId: parentId,
                    quotePassPortId: quotePassPortId,
                    city: _vars.city
                }
            })
                .done(function (data) {
                    if (data === '1') {
                        if (parentId !== '') {
                            tipBox('回复成功！');
                        } else {
                            tipBox('回复成功，请等待审核通过。');
                        }
                        setTimeout(function () {
                            if (!parentId) {
                                location.href = _vars.newsSite + _vars.city + '/03_' + newsId + '.html';
                            } else {
                                location.href = _vars.newsSite + '?c=news&a=getOpenCommentDetail&id=' + newsId + '&parentId=' + parentId;
                            }
                        }, 2000);
                    } else if (data !== '') {
                        tipBox(data);
                    } else {
                        tipBox('接口超时，请稍后再试！');
                    }
                });
        });
    };
});