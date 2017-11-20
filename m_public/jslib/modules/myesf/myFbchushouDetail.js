define('modules/myesf/myFbchushouDetail', ['jquery', 'iscroll/2.0.0/iscroll-lite'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var IScroll = require('iscroll/2.0.0/iscroll-lite');
        $('input[type=hidden]').each(function (index, element) {
            vars[$(this).attr('data-id')] = element.value;
        });
        // @我的二手房委托详情页面js
        var oAwhite = $('.awhite');
        var oPhoneTime = $('#phone_time');
        // 已有消息数量（不包括新消息）
        var storage = window.localStorage;
        var chatallnum = 0;
        for (var i = 0, len = storage.length; i < len; i++) {
            var key = storage.key(i);
            var hisMessage = storage.getItem(key);
            if (key.indexOf('_message') > 0 && key !== 'chat_messageid') {
                var historyList = hisMessage.split(';');
                var listSize = historyList.length;
                for (var m = 0; m < listSize; m++) {
                    // var message_cont = historyList[m].split(',');
                    chatallnum++;
                }
            }
        }
        // 无消息时，默认隐藏消息上标数量提示(新消息提示)
        if (chatallnum !== 0) {
            $('#chatallnum2').html(chatallnum);
        }
        if (vars.ReviewStatus === '0' || vars.ReviewStatus === '1' && vars.targetStatus === '2') {
            oAwhite.show();
        }

        // 更改房源状态-落地非电商
        function pauseSale() {
            var pause = $('#pauseSale').val();
            if (pause !== '4' && pause !== '0') {
                var url = vars.mySite + 'index.php?c=myesf&a=cancleOrResale&city=' + vars.city + '&delegateid=' + vars.delegateid
                    + '&pauseReason=' + pause + '&r=' + Math.random();
                $.get(url, function (data) {
                    if (data) {
                        alert(decodeURI(data.message));
                        window.location = vars.mySite + 'index.php?c=myesf&a=myEsfFbgl&city=' + vars.city;
                    } else {
                        alert('更改状态失败，请稍后再试');
                        $('#pauseSale').val('0');
                    }
                });
            }
        }
        $('#pauseSale').on('change', pauseSale);

        function selectcontroller(sElArr, scrollDis, Servo) {
            this.selectArr = [];
            this.scrollDis = scrollDis;
            var l = sElArr.length;
            var i;
            for (i = 0; i < l; i++) {
                if (typeof sElArr[i] === 'string') {
                    var ss = {};
                    ss.select = new IScroll(sElArr[i]);
                    ss.ok = true;
                    ss.num = 0;
                    this.selectArr.push(ss);
                }
            }
            function addListener(ss) {
                ss.select.on('scrollStart', function () {
                    ss.ok = false;
                });
                ss.select.on('scrollEnd', function () {
                    var st = Math.round(ss.select.y / scrollDis);
                    ss.select.scrollTo(0, st * scrollDis, 200);
                    ss.num = Math.abs(st);
                    ss.ok = true;
                });
            }
            if (Servo) {
                (function (arr, s, d) {
                    var sIc = arr[s.pid];
                    sIc.select.on('scrollStart', function () {
                        sIc.ok = false;
                    });
                    sIc.select.on('scrollEnd', function () {
                        var st = Math.round(sIc.select.y / d);
                        sIc.select.scrollTo(0, st * d, 200);
                        sIc.num = Math.abs(st);
                        sIc.ok = true;
                        var space = -(sIc.num + s.dis) * d;
                        if (space > 0) {
                            space = 0;
                        }
                        if (space < -s.linum * d) {
                            space = -s.linum * d;
                        }
                        arr[s.nid].select.scrollTo(s.nid, space, 200);
                    });
                })(this.selectArr, Servo, scrollDis);
                l = this.selectArr.length;
                for (i = 0; i < l; i++) {
                    if (i !== Servo.pid) {
                        addListener(this.selectArr[i]);
                    }
                }
            } else {
                l = this.selectArr.length;
                for (i = 0; i < l; i++) {
                    addListener(this.selectArr[i]);
                }
            }
        }

        selectcontroller.prototype = {
            getCanOk: function () {
                var l = this.selectArr.length;
                for (var i = 0; i < l; i++) {
                    var ss = this.selectArr[i];
                    if (!ss.ok) {
                        return false;
                    }
                }
                return true;
            },
            getValue: function () {
                var l = this.selectArr.length;
                var arr = [];
                for (var i = 0; i < l; i++) {
                    var ss = this.selectArr[i];
                    arr.push(ss.num);
                }
                return arr;
            },
            scrollTo: function (sIdx, idx, easeTime, easeFunc) {
                var ss = this.selectArr[sIdx];
                ss.num = idx;
                ss.select.scrollTo(0, -idx * this.scrollDis, easeTime, easeFunc);
            },
            refresh: function () {
                var l = this.selectArr.length;
                for (var i = 0; i < l; i++) {
                    var ss = this.selectArr[i];
                    ss.select.refresh();
                }
            }
        };
        var sCtrl = selectcontroller(['#leftSelect', '#rightSelect'], 30);
        function ShowOrHidden(evt) {
            if (evt.data === 1 || evt === 1) {
                $('.floatDate').toggle();
                sCtrl.refresh();
                sCtrl.scrollTo(0, 9);
                sCtrl.scrollTo(1, 22);
            }
        }

        function modifyTime() {
            if (sCtrl.getCanOk()) {
                var arrTime = sCtrl.getValue();
                if (arrTime[1] <= arrTime[0]) {
                    alert('开始时间请小于截止时间');
                    return;
                }
                var url = vars.mySite + 'index.php?c=myesf&a=changePhoneTime&city=' + vars.city + '&starttime=' + arrTime[0] + '&endtime='
                    + arrTime[1] + '&rawID=' + vars.rawid + '&delegateid=' + vars.delegateid + '&r=' + Math.random();
                $.get(url, function (data) {
                    if (data === '0' || !data.hasOwnProperty('newTime')) {
                        alert('更改接电时间失败，请稍后再试');
                    } else {
                        $('#jiedianTime').text(data.newTime);
                    }
                });
            }
            ShowOrHidden(1);
        }
        // 更改接电时间

        if (vars.ReviewStatus === '0' || vars.ReviewStatus === '1' && vars.targetStatus === '2') {
            oPhoneTime.on('click', 1, ShowOrHidden);
        }

        $('#cancle_time').on('click', 1, ShowOrHidden);
        $('#modify_time').on('click', modifyTime);
        // 更改房源状态-电商
        var targetStatus = vars.targetStatus;
        function pauseSaleDS() {
            var msg = '';
            if (targetStatus === '2')msg = '您确定要暂停销售该房源吗？';
            if (targetStatus === '1')msg = '您确定要重新委托该房源吗？';
            if (confirm(msg)) {
                var url = vars.mySite + 'index.php?c=myesf&a=cancleOrResaleDS&city=' + vars.city + '&houseid=' + vars.houseid + '&targetStatus='
                    + targetStatus + '&r=' + Math.random();
                $.get(url, function (data) {
                    if (data) {
                        alert(data.message);
                        if (data.result === 1) {
                            if (targetStatus === 2) {
                                $('#saleSta').html('&nbsp;重新委托');
                                $('.floatDate').hide();
                                oAwhite.hide();
                                targetStatus = 1;
                                oPhoneTime.off('click', ShowOrHidden);
                            } else if (targetStatus === '1') {
                                $('#saleSta').html('&nbsp;暂停销售');
                                oAwhite.show();
                                targetStatus = 2;
                                oPhoneTime.on('click', 1, ShowOrHidden);
                            }
                        }
                    } else {
                        alert('更改状态失败，请稍后再试');
                    }
                });
            }
        }
        $('#pauseSaleDS').on('click', pauseSaleDS);
        sCtrl.scrollTo(0, 9);
        sCtrl.scrollTo(1, 22);
    };
});