define('modules/bbs/bbsboxlist', ['jquery', 'modules/bbs/bbsbuma'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var vars = seajs.data.vars;
        // var $ = require('jquery');
        // 用户行为对象
        var bbsbuma = require('modules/bbs/bbsbuma');
        //收件箱浏览布码
        bbsbuma({type: 0, pageId: 'mbbsinbox', userid: vars.username });
        if (vars.totalCount > 20) {
            // 加载更多
            require.async('loadMore/1.0.0/loadMore', function (loadMore) {
                loadMore({
                    url: vars.bbsSite + '?c=bbs&a=ajaxGetPersonnelLetter&city=' + vars.city + '&type=' + vars.type,
                    total: vars.totalCount,
                    pagesize: 20,
                    pageNumber: 20,
                    moreBtnID: '#loadMore',
                    loadPromptID: '#loadMore',
                    contentID: '#message',
                    loadAgoTxt: '<span>上拉加载更多</span>',
                    loadingTxt: '<span><i></i>努力加载中...</span>',
                    firstDragFlag: false
                });
            });
        }
        // $('#message').on('click', 'li', function () {
        //    var ele = $(this), toUser = ele.attr('data-name'),
        //        thisUrl = ele.attr('data-url'),
        //        url = vars.bbsSite + '?c=bbs&a=ajaxSetMessage&username=' + vars.username + '&toUser=' + toUser
        //            + '&city=' + vars.city;
        //    // 设置未读消息数
        //    $.get(url, function (data) {
        //        if (data === '100') {
        //            // 跳转到消息详情页
        //            window.location.href = thisUrl;
        //        } else {
        //            alert(data);
        //        }
        //    });
        // });
    };
});