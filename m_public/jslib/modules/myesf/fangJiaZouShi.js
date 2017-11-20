define('modules/myesf/fangJiaZouShi', ['modules/myesf/myutil', 'iscroll/2.0.0/iscroll-lite', 'chart/line/2.0.0/line','jquery'],
    function (require, exports, module) {
        'use strict';
        module.exports = function () {
            var $ = require('jquery');
            var vars = seajs.data.vars;
            var MyUtil = require('modules/myesf/myutil');
            var url = '?c=myesf';
            var iscrollLite = require('iscroll/2.0.0/iscroll-lite.js');
            var Line = require('chart/line/2.0.0/line');
            var wrapper = null;
            var curveW = $(window).width();
            $('input[type=hidden]').each(function (index, element) {
                vars[$(this).attr('data-id')] = element.value;
            });
            var line = $('#line'), $chatnum = $('#chatnum'), $chatallnum1 = $('#chatallnum1');
            line.width(curveW * 2);
            var param = {};
            param.a = 'ajaxFangJiaZouShi';
            param.city = vars.city;
            param.newcode = vars.newcode;
            param.topnum = vars.topnum;
            var onComplete = function (priceData) {
                var line1 = [{lineColor: '#FF9900', pointColor: '#FF9900', data: priceData}];
                var l = new Line({width: curveW * 2, height: '150px', w: curveW * 4, h: 300, lineArr: line1});
                l.run(function (x) {
                    wrapper = new iscrollLite('.cfjChart', {scrollX: true});
                    wrapper.scrollTo(-x, 0, 1000);
                });
            };
            MyUtil.ajax(url, 'get', param, onComplete);
            var storage = vars.localStorage, chatallnum = 0, newMsgNum = 0;
            if (storage) {
                for (var i = 0, len = storage.length; i < len; i++) {
                    var key = storage.key(i), hisMessage = storage.getItem(key);
                    if (key.indexOf('_message') > -1 && key !== 'chat_messageid') {
                        var historyList = hisMessage.split(';');
                        var listSize = historyList.length;
                        for (var m = 0; m < listSize; m++) {
                            var messageCont = historyList[m].split(',');
                            if (messageCont[0] === 'r' && messageCont[1] === '0') {
                                newMsgNum++;
                            }
                            chatallnum++;
                        }
                    }
                }
            }
            if (newMsgNum !== 0) {
                if (newMsgNum > 99) {
                    newMsgNum = 99;
                }
                $chatnum.html(newMsgNum).show();
                $chatallnum1.html(newMsgNum).show();
            } else {
                // 无消息时，默认隐藏消息上标数量提示
                $chatallnum1.hide();
            }
            if (chatallnum !== 0) {
                $('#chatallnum2').html(chatallnum);
            }
        };
    });

