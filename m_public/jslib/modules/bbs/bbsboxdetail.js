/**
 * bbs消息回复页
 * @Last Modified by:   liyingying
 * @Last Modified time: 2016/1/12
 */
define('modules/bbs/bbsboxdetail', ['jquery', 'modules/bbs/bbsbuma'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        // 用户行为对象
        var bbsbuma = require('modules/bbs/bbsbuma');
        var vars = seajs.data.vars;
        var win = window;
        //对话消息浏览布码
        bbsbuma({type: 0, pageId: 'mbbssendmessage', interestuserid: vars.toUser });
        // 发送按钮
        var send = $('.subm'),
            floatAlert = $('.floatAlert'),
            xiaoxi = $('#xiaoxi'),
            bigBox = $('.bigbox'),
            toastMsg = $('#toastMsg'),
        // 输入内容框
            msg = $('.inpt'),
            bbsDefault = $('.bbs-default');
        var mydate = new Date(),
            con,reSendObj,firstSend = false,clickFlag = false;

        // 如果无消息板块出现，表明是第一次发送消息
        if (bbsDefault.length > 0) {
            firstSend = true;
        }

        // 消息置顶
        function toTop() {
            win.scrollTo(0, 0);
        }

        // 点击发送
        send.on('click', function () {
            //对话消息浏览布码
            bbsbuma({type: 110, pageId: 'mbbssendmessage', interestuserid: vars.toUser });
            checkMsg();
        });

        msg.on('focus', function () {
            // 请输入发送内容
            if (msg.text() === '\u8bf7\u8f93\u5165\u53d1\u9001\u5185\u5bb9') {
                msg.text('');
            }
            // 点击输入框后消息置顶
            toTop();
        });

        /**
         * 发送消息
         * @param con 消息内容
         * @param time 消息时间
         */
        function sendMsg(con, time) {
            // 增加过滤
            con = con.replace(/<script.*?>.*?<\/script>/ig, '&nbsp;');
            if (clickFlag) {
                return;
            }
            clickFlag = true;
            var str;
            $.get(vars.bbsSite + '?c=bbs&a=ajaxSendMessage&username=' + vars.username + '&toUser=' + vars.toUser + '&content=' + con + '&city=' + vars.city,
                function (data) {
                    // 正常发送
                    if (time) {
                        str = '<li class="self"><div class="time">' + time + '</div><div class="mai">'
                            + '<a href="javascript:void(0);" class="head"><img src="' + vars.public + '201511/images/default-head.png"></a>'
                            + '<div class="con"><div><p>' + con + '</p>';
                        // 发送消息成功
                        if (data && data.Result && data.Result.return_result === '100') {
                            // 清空输入框
                            msg.text('');
                        } else {
                            // 添加感叹号
                            str += '<i class="ale">!</i>';
                        }
                        str += '</div></div></div></li>';
                        xiaoxi.prepend(str);
                        if (firstSend) {
                            bbsDefault.hide();
                            firstSend = false;
                        }
                        toTop();
                    }else if (reSendObj && reSendObj.length > 0) {
                        // 如果消息重新发送成功
                        if (data && data.Result && data.Result.return_result === '100') {
                            // 隐藏该条消息的感叹号
                            reSendObj.hide();
                        }
                        reSendObj = null;
                    }
                    clickFlag = false;
                });
        }

        /**
         * 检查消息内容
         */
        function checkMsg() {
            con = msg.text() === '\u8bf7\u8f93\u5165\u53d1\u9001\u5185\u5bb9' ? '' : msg.text();
            if (!$.trim(con)) {
                // 判断输入内容是否为空
                floatAlert.show();
                toastMsg.text('请输入内容');
                setTimeout(function () {
                    floatAlert.hide();
                }, 1000);
            } else {
                var time = mydate.getMinutes();
                sendMsg(con, '今天 ' + mydate.getHours() + ':' + (time < 10 ? '0' + time : time));
            }
        }
        // 取消重发
        $('#quxiao').on('click', function () {
            bigBox.hide();
        });
        // 重发消息
        $('#current').on('click', function () {
            bigBox.hide();
            sendMsg(con);
        });
        // 点击叹号重新发送
        xiaoxi.on('click', '.ale', function () {
            // 重发对象
            reSendObj = $(this);
            con = reSendObj.prev().text();
            bigBox.show();
        });
    };
});