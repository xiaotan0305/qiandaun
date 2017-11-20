/**
 * 房产圈（开放平台）评论详情页点赞
 * Created by fenglinzeng on 17-03-24.
 */
define('modules/news/getOpenCommentDetail', ['jquery'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        // 引入jQuery
        var $ = require('jquery');
        var inAjax = false;

        var likeComm = $('.likeComm');
        likeComm.on('click', function () {
            var $this = $(this);
            var commentID = $this.data('commentid');
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
                }).done(function (data) {
                        inAjax = false;
                        if (data === '1') {
                            if ($this.hasClass('parentLike')) {
                                $('.parentLike').each(function (index, el) {
                                    var $el = $(el);
                                    $el.addClass('cur').find('i').addClass('on');
                                    var span = $el.find('span');
                                    var numCount = $el.find('span').text() * 1 + 1;
                                    span.text() === '赞' ? span.text('赞') : span.text(numCount);
                                });
                            } else {
                                var numCount = $this.find('span').text() * 1 + 1;
                                $this.addClass('cur').find('i').addClass('on').siblings('span').text(numCount);
                            }
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

        // 图片惰性加载
        require.async('lazyload/1.9.1/lazyload', function () {
            $('img[data-original]').lazyload();
        });
    };
});