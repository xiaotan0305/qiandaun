define('modules/mycenter/common', ['jquery'], function (require) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;
    return {
        getMessage: function () {
            var newMsgNum = 0;
            var storage = vars.localStorage;
            // 获得并显示未读消息数
            if (storage) {
                for (var i = 0, len = storage.length; i < len; i++) {
                    var key = storage.key(i);
                    var hisMessage = storage.getItem(key);
                    if (key.indexOf('_message') > 0 && key !== 'chat_messageid') {
                        var historyList = hisMessage.split(';');
                        var listSize = historyList.length;
                        for (var m = 0; m < listSize; m++) {
                            var messageCont = historyList[m].split(',');
                            if (messageCont[0] === 'r' && messageCont[1] === '0') {
                                newMsgNum++;
                            }
                        }
                    }
                    if (newMsgNum !== 0) {
                        if (newMsgNum > 99) {
                            newMsgNum = 99;
                        }
                        $('#chatallnum1').html(newMsgNum).show();
                    }
                }
            }
        },
        getparam: function (str, name) {
            var paraString = str.split(';');
            var paraObj = {};
            for (var i = 0, j; j = paraString[i]; i++) {
                paraObj[j.substring(0, j.indexOf('~')).toLowerCase()] = j.substring(j.indexOf('~') + 1, j.length);
            }
            return paraObj[name];
        },
        teltj: function (city, housetype, houseid, newcode, type, phone, channel, agentid, order, housefrom) {
            var params = {
                city: city,
                housetype: housetype,
                houseid: houseid,
                newcode: newcode,
                type: type,
                channel: channel,
                agentid: agentid,
                order: order,
                housefrom: housefrom
            };
            if (vars.hasOwnProperty('from') && vars.from.length > 0) {
                params.housefrom = vars.from;
                params.product = 'soufun';
            }
            vars.ajax(vars.mainSite + 'data.d?m=houseinfotj', 'get', params);
        },
        call: function (housetype) {
            this.teltj.apply(this, $(this).attr('data-teltj').split(','));
            var size = 50, phone = $('#phone').text(), from = $('#from').html();
            if (!from)from = '';
            var isShopPhone = '', houseid = vars.houseid, storage = vars.localStorage;
            if (storage) {
                var callHis = storage.getItem('call_his');
                callHis = callHis ? '' : callHis;
                var item = [];
                item.push('title~' + $('#title').html(), 'phone~' + phone.replace('转', ','), 'time~' + new Date().getTime());
                if (callHis !== '') {
                    storage.setItem('call_his', item);
                } else {
                    var callHisList = callHis.split('|'), callHistory = '';
                    for (var i = 0, l = callHisList.length >= size ? size : callHisList.length; i < l; i++) {
                        var phoneHis = this.getparam(callHisList[i], 'phone');
                        if (phoneHis !== phone.replace('转', ',')) {
                            callHistory += callHisList[i] + '|';
                        }
                    }
                    storage.setItem('call_his',
                        item.join(';') + (!callHistory ? '' : '|') + (!callHistory ? '' : callHistory.substring(0, callHistory.length - 1)));
                }
            }
            var params = {
                city: vars.city,
                housetype: housetype,
                id: houseid,
                phone: phone,
                isShopPhone: isShopPhone
            };
            vars.ajax(vars.mainSite + 'data.d?m=tel', 'get', params);
        },

        /**
         * 留言
         * @param zhcity
         * @param city
         * @param housetype
         * @param houseid
         * @param newcode
         * @param type
         * @param phone
         * @param channel
         * @param uname
         * @param aname
         * @param agentid
         * @param zhname
         * @param agent_img
         * @param username
         * @param zygwLink
         */
        chat: function (zhcity, city, housetype, houseid, newcode, type, phone, channel, uname, aname, agentid, zhname, agent_img, username, zygwLink) {
            var storage = vars.localStorage;
            if (storage) {
                storage.foobar = 'foobar';
                var projname = $('#projname').val();
                var com = '';
                com = '[' + '燕郊' + ']';

                storage.setItem(uname + '_allInfo', encodeURIComponent(projname) + ';' + encodeURIComponent($('#price').text().trim()) + ';'
                    + encodeURIComponent('新盘首开小户型') + ';' + '//img.soufun.com/viewimage/house/2014_06/23/bj/1403512459788_000/120x120.jpg'
                    + ';' + encodeURIComponent($('#district').html()) + ';' + encodeURIComponent(com + '燕灵路西侧，化大路北侧')
                    + ';' + '/xf/' + city + '/' + newcode + '.htm');
                storage.setItem('fromflag', 'xfinfo');
                storage.setItem('x:' + uname + '', encodeURIComponent(aname) + ';' + agent_img + ';' + encodeURIComponent(projname + '的') + ';' + zygwLink);
                $.ajax({
                    url: '/data.d?m=houseinfotj&city=' + city + '&housetype=' + housetype + '&houseid=' + houseid + '&newcode='
                    + newcode + '&type=' + type + '&phone=' + phone + '&channel=' + channel + '&agentid=' + agentid,
                    async: false
                });
                setTimeout(function () {
                    window.location = '/chat.d?m=chat&username=x:' + uname + '&city=' + city + '&type=wapxf';
                }, 500);
            } else {
                alert('若为safari浏览器,请关闭无痕模式浏览。');
            }
        }
    };
});