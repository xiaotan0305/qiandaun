/**
 *问答UI改版 我的问答页
 * modified by zdl 2016-1-11
 * 邮箱地址（zhangdaliang@fang.com）
 */
define('modules/ask/myAsk', ['jquery', 'loadMore/1.0.0/loadMore', 'modules/ask/yhxw'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        // 用户id
        var userid = vars.userid;
        // 问答类型 用于点击加载更多时判断请求对应类型的数据
        var askType = vars.ask_type;
        // var page = 1;
        // 对滚动时的调取
        var fnav = $('#my-nav2');
        $(window).on('scroll',function () {
            if (document.body.scrollTop > 224 || document.documentElement.scrollTop > 224) {
                fnav.show();
            } else {
                fnav.hide();
            }
        });
        // 点击该页面的头像时 跳转
        $('#head_url').on('click', function () {
            window.location.href = vars.askSite + '?c=ask&a=userRichExp&userid=' + userid;
        });
        // end

        $(function () {
            $('.floatApp').hide();
            $('footer').hide();
        });

        /**
         * 判断是否为专家
         */
        $.ajax({
            type: 'get',
            url: vars.askSite + '?c=ask&a=ajaxGetExpert',
            data: {
                userid: userid
            },
            success: function (result) {
                if (result) {
                    var $result = $(result);
                    $('.my-name').after($result);
                }
            }
        });
        // 上拉加载更多
        var url = '';
        if (vars.accept === '1' || vars.accept === '2') {
            url = vars.askSite + '?c=ask&a=ajaxMyAsk&city=' + vars.city + '&type=' + askType + '&accept=' + vars.accept + '&userid=' + userid;
        } else {
            url = vars.askSite + '?c=ask&a=ajaxMyAsk&city=' +  vars.city  + '&type=' + askType + '&userid=' + userid;
        }
        var loadMore = require('loadMore/1.0.0/loadMore');
        loadMore({
            url: url,
            total: vars.totalCount,
            pagesize: 5,
            pageNumber: 5,
            moreBtnID: '#display_more',
            loadPromptID: '#display_more',
            contentID: '#ajax',
            loadAgoTxt: '<a href="javascript:void(0);">上拉加载更多</a>',
            loadingTxt: '<a href="javascript:void(0);">加载中...</a>',
            firstDragFlag: false
        });

        // 用户行为对象
        var yhxw = require('modules/ask/yhxw');
        yhxw({type: 0, pageId: 'maucmyself'});
    };
});