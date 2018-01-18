/**
 *问答UI改版
 * modified by zdl 2016-1-11
 * 邮箱地址（zhangdaliang@fang.com）
 */
define('modules/ask/askDailyDetail', ['jquery','lazyload/1.9.1/lazyload', 'modules/ask/yhxw'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        /* 惰性加载*/
        var lazyLoad = require('lazyload/1.9.1/lazyload');
        $('.lazyload').lazyload();
        
        var storage = vars.localStorage;
        var $mainClass = $('.main');

        // 用户行为对象
        var yhxw = require('modules/ask/yhxw');
        yhxw({type: 1, pageId: 'wd_wd^ztxq_wap'});

        $mainClass.on('click','a',function () {
            var me = $(this);
            var dataId = me.data('id');
            if (dataId) {
                var answerId = dataId;
                var answerUserId = me.attr('answer_user_id');
                var askId = me.attr('ask_id');
                // 不登陆,通过localstorage判断是否已经踩赞
                if (storage.ask_zan_history && storage.ask_zan_history.indexOf(answerId) !== -1) {
                    me.find('span').html('已赞');
                    me.attr('class','cb-d-icon active');
                    return false;
                }
                $.get(vars.askSite + '?c=ask&a=ajaxZan&answerid=' + answerId + '&answer_user_id='
                    + answerUserId + '&askid=' + askId,function (returnData) {
                    var data = returnData;
                    if (data.Code === '100') {
                        // data.Ding
                        var strDing = data.Ding;
                        me.find('span').html(strDing);
                        me.attr('class','cb-d-icon active');
                        me.off('click');
                        // me.prev().off('click');
                        // 当localstorage为空时第一次存，
                        if (!storage.ask_zan_history) {
                            storage.setItem('ask_zan_history',answerId + ',');
                        }else {
                            var history = storage.getItem('ask_zan_history') + answerId + ',';
                            storage.setItem('ask_zan_history',history);
                        }
                    }else if (data.Code === '106' || data.Code === '107') {
                        me.find('span').html('已赞');
                        me.attr('class','cb-d-icon active');
                    }
                });
            }
        });
    };
});
