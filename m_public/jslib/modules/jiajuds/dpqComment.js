/**
 * @file 优惠券订单评价
 * created by muzhaoyang 2017 - 04 - 20
 */
define('modules/jiajuds/dpqComment', ['jquery','iscroll/2.0.0/iscroll-lite'], function(require, exports, module) {
    'use strict';
    module.exports = function() {
        var $ = require('jquery');
        var IScroll = require('iscroll/2.0.0/iscroll-lite');
        var vars = seajs.data.vars;
        var jiajuUtils = vars.jiajuUtils;
        var commentItem = $('.comment-item');
        var starsOther = $('#star-other');
        var sendFloat = $('#sendFloat');
        var sendText = $('#sendText');
        var lengthLimit = 160;
        var commentArray = [];
        var commentNameArray = [];
        var commentWord = '';
        var plFlag = true;
        pageInit();

        /**
         * [pageInit description] 初始化 commentNameArray和commentArray，并绑定页面事件
         * @return {[type]} [description]
         */
        function pageInit() {
            commentItem.find('dt').each(function (index,dom) {
                var text = $(dom).text();
                commentNameArray.push(text.substr(0,text.length - 1));
                commentArray.push(0);
            });
            eventInit();
        }

        /**
         * [eventInit description] 页面元素事件绑定
         * @return {[type]} [description]
         */
        function eventInit() {
            // 评星事件
            commentItem.on('click','i',function() {
                var self = $(this);
                var parent = self.parents('dl').eq(0);
                self.addClass('active').prevAll().addClass('active');
                self.nextAll().removeClass('active');
                commentArray[parent.index()] = self.index() + 1;
            });
            // div 模拟textarea中input事件，替换空格，控制光标位置
            // 用foucs和blur模拟placeholder
            $('.commentword').on('input',function () {
                var self = $(this);
                var content = self.text();
                commentWord = content;
                $('.wordnumber').html('<span>' + content.length + '</span>' +  '/160');
                if(content.length > lengthLimit) {
                    $('.wordnumber').find('span').css('color','red');
                }
            }); 
            $('.commentword').on('focus',function () {
                var self = $(this);
                var content = self.text();
                if(content === '评论字数限定8-160字') {
                    self.text('');
                    self.focus();
                }
            }).on('blur',function () {
                var self = $(this);
                var content = self.text();
                if(content === '') {
                    $(this).text('评论字数限定8-160字');
                }
            });
            // 提交评论
            $('.fbpl').on('click',function () {
                var commentFlag = true;
                commentArray.forEach(function (item,index) {
                    if(!item) {
                        commentFlag = false;
                        return;
                    }
                });
                if(commentFlag && commentWord) {
                    if(commentWord.length < 8 || commentWord.length > 160) {
                        toastFn('评论字数限定8-160字');
                    } else {
                        plFlag && plAjaxFn();
                    }
                } else {
                    toastFn('请填写评论并评星');
                }
            });
        }

        /**
         * [plAjaxFn description] 评论执行函数
         * @return {[type]} [description]
         */
        function plAjaxFn() {
            plFlag = false;
            var temp = ''; 
            commentNameArray.forEach(function (item,index) {
                temp += item + ':' + commentArray[index] + '^';
            });
            var startypes = temp.substr(0,temp.length - 1);
            // console.log(temp);
            // console.log(startypes);
            var content = commentWord;
            var url = location.protocol + vars.jiajuSite + '?c=jiajuds&a=ajaxDpqSubmit';
            var jsondata = {'proid':vars.proid, 'couponid':vars.couponid, 'proname':encodeURIComponent(vars.name), 'orderid':vars.orderid, 'startypes':encodeURIComponent(startypes), 'content':encodeURIComponent(content)};
            $.ajax({
                url:url,
                type: 'post',
                data: jsondata,
                async: true,
                success: function (data) {
                    if(data.issuccess) {
                        toastFn('评价成功');
                        if (!vars.isapp) {
                            setTimeout(function () {
                                location.href = vars.url;
                            },2000);
                        }
                    } else {
                        toastFn(data.message);
                    }
                },
                complete: function () {
                    plFlag = true;
                }
            });
        }

        /**
         * [toastFn description] 页面信息提示
         * @param  {[type]} msg [description]
         * @return {[type]}     [description]
         */
        function toastFn(msg) {
            sendText.text(msg);
            sendFloat.show();
            jiajuUtils.toggleTouchmove(true);
            setTimeout(function () {
                sendFloat.hide();
                jiajuUtils.toggleTouchmove(false);
            },2000);
        }
    };
});