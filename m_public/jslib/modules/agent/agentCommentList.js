define('modules/agent/agentCommentList', ['jquery'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var preload = [];
        require.async(preload);
        $('input[type=hidden]').each(function (index, element) {
            vars[$(this).attr('data-id')] = element.value;
        });

        var contentID = '.comlist',
            allpage = vars.allpage,
            textpage = vars.textpage,
            myallpage = 2,
            mytextpage = 2,
            url = vars.agentSite + '?a=ajaxGetCommentList&c=agent&agentid=' + vars.agentid + '&hasCommentContent=';

        // 全部加载更多是否显示
        if (myallpage <= allpage) {
            $('#loading').hide();
            $('.moreList').eq(0).show();
        } else {
            $('.moreList').eq(0).hide();
            $('#loading').hide();
        }
        // 有文字初始化
        $.ajax({
            url: url + 'true',
            success: function (data) {
                if (data != '') {
                    //$(".comlist").append(data);
                    $('.comment-list').append('<ul class="comlist2" style="display: none;">' + data + '</ul>');
                }
            }
        });

        // 点击 全部 有文字按钮
        $('.comment-tab a').on('click', function () {
            $('.comment-tab a').removeClass('active');
            $(this).addClass('active');
            // 全部
            if ($(this).attr('id') == 'showall') {
                $('.comlist').show();
                $('.comlist2').hide();
                contentID = '.comlist';
                if (myallpage <= allpage) {
                    $('#loading').hide();
                    $('.moreList').eq(0).show();
                } else {
                    $('.moreList').eq(0).hide();
                    $('#loading').hide();
                }
            } else { // 有文字
                $('.comlist2').show();
                $('.comlist').hide();
                contentID = '.comlist2';
                if (mytextpage <= textpage) {
                    $('#loading').hide();
                    $('.moreList').eq(0).show();
                } else {
                    $('.moreList').eq(0).hide();
                    $('#loading').hide();
                }
            }
        });

        // 下拉加载更多
        var isSuc = true;
        $(document).on('touchmove', function () {
            var srollPos = $(document).scrollTop();
            if (srollPos >= $(document).height() - $(window).height()) {
                if (isSuc) {
                    isSuc = false;
                    loadMore();
                }
            }
        });
        $('#drag').on('click', function () {
            loadMore();
        });
        var loadMore = function () {
            // 全部评价
            if ($('.comment-tab .active').attr('id') == 'showall') {
                if (myallpage <= allpage) {
                    $('.moreList').eq(0).hide();
                    $('#loading').show();
                    $.get(url + 'false&page=' + myallpage, function (data) {
                        addContent(data);
                        myallpage++;
                        if (myallpage > allpage) {
                            $('.moreList').eq(0).hide();
                            $('#loading').hide();
                        }
                    });
                }
            } else { // 有文字评价
                if (mytextpage <= textpage) {
                    $('.moreList').eq(0).hide();
                    $('#loading').show();
                    $.get(url + 'true&page=' + mytextpage, function (data) {
                        addContent(data);
                        mytextpage++;
                        if (mytextpage > textpage) {
                            $('.moreList').eq(0).hide();
                            $('#loading').hide();
                        }
                    });
                }
            }
        };
        var addContent = function (data) {
            $('#loading').hide();
            $('.moreList').eq(0).show();
            $(contentID).append(data);
        };
        $(document).on('touchend', function () {
            isSuc = true;
        })
    }
});
