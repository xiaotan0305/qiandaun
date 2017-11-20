/**
 * Created by zhangjinyu on 2017/8/29.
 */
define('modules/jiaju/bmOption', ['jquery', 'dateAndTimeSelect/1.1.0/dateAndTimeSelect'], function (require, exports, module) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;
    var jiajuUtils = vars.jiajuUtils;
    var dateAndTimeSelect = require('dateAndTimeSelect/1.1.0/dateAndTimeSelect');

    function GetBMOption() {}
    GetBMOption.prototype = {
        init: function () {
            var that = this;
            // 提交锁的标识
            that.submitFlag = true;
            // 提交按钮的标识
            that.buttonFlag = false;
            // 提示浮层按钮
            that.sendFloat = $('#sendFloat');
            that.sendText = $('#sendText');
            // 提交按钮
            that.bmOptionSub = $('#bmOptionSub');
            // 提交成功浮层
            that.floatAlert = $('.floatAlert');
            // 提交成功浮层的白色框
            that.floatAlertBox = $('.fangse');
            // 提交成功浮层上的【好的】
            that.successOK = $('#successOK');
            // 量房时间按钮
            that.calenderBtn = $('#calenderBtn');
            // 备注
            that.remarkContent = $('#remarkContent');
            // 日期插件配置及初始化
            that.dateSelectOptions = {
                type: 'jiaju',
                yearRange: new Date().getFullYear() + '-' + (new Date().getFullYear() + 5),
                defaultTime: new Date().getTime(),
                dateConfirmFunc: function () {
                    jiajuUtils.toggleTouchmove(false);
                    var blueDateBox = $('.blue_dateBox');
                    var floatSelect = $('#floatSelect');
                    if (blueDateBox.length) {
                        var selectYear = blueDateBox.eq(0).attr('data-val');
                        var selectMonth = blueDateBox.eq(1).attr('data-val');
                        var selectDay = blueDateBox.eq(2).attr('data-val');
                        var weekStr = that.dateToWeekFn(selectYear + '/' + selectMonth + '/' + selectDay);
                        that.calenderBtn.val(selectYear + '年' + selectMonth + '月' + selectDay + '日' + ' ' + weekStr);
                        floatSelect.hide();
                        that.submitBtnStatus();
                    }
                },
                dateCancelFunc: function () {
                    jiajuUtils.toggleTouchmove(false);
                    $('#floatSelect').hide();
                }
            };
            that.dtSelect = new dateAndTimeSelect(that.dateSelectOptions);

            /* 提交按钮初始化*/
            that.submitBtnStatus();

            /* 事件初始化*/
            that.bindEvent();
        },
        bindEvent: function () {
            var that = this;

            /* 任意的点选按钮点击都要修改按钮的状态*/
            $(':radio').on('click', function () {
                that.submitBtnStatus();
            });

            /* 点击提交按钮*/
            that.bmOptionSub.on('click', function () {
                if (that.submitFlag) {
                    that.submitOptions();
                }
            });

            /* 点击成功浮层*/
            that.successOK.on('click', function () {
                that.floatAlert.hide();
                jiajuUtils.toggleTouchmove(false);
                // 返回进入报名的入口页面
                window.location = vars.bmUrls.getUrl(2);
            });

            /* 点击成功浮层之外的部分消失*/
            that.floatAlert.on('click', function () {
                jiajuUtils.toggleTouchmove(false);
                $(this).hide();
            });
            that.floatAlertBox.on('click', function (e) {
                e.stopPropagation();
            });

            /* 打开时间插件*/
            that.calenderBtn.on('click', function () {
                jiajuUtils.toggleTouchmove(true);
                that.dtSelect.show('date');
            });
        },


        /* 提交按钮状态*/
        submitBtnStatus: function () {
            var that = this;
            if ($(':radio:checked').length || that.calenderBtn.val().trim()) {
                that.buttonFlag = true;
                that.bmOptionSub.removeClass('noClick');
            } else {
                that.buttonFlag = false;
                that.bmOptionSub.addClass('noClick');
            }
        },

        /* 获取参数*/
        getParams: function () {
            var that = this;
            var params = {};
            params.ApplyUserID = vars.applyUserID;
            if ($(':radio[name=houseCategory]:checked').length) {
                params.housecategory = parseInt($(':radio[name=houseCategory]:checked').val());
            }
            // 暂不装修为0，所以不可以用parseInt
            if ($(':radio[name=zxDate]:checked').length) {
                params.zxDate = $.trim($(':radio[name=zxDate]:checked').val());
            }
            if ($(':radio[name=zxStatus]:checked').length) {
                params.housingZxStatus = parseInt($(':radio[name=zxStatus]:checked').val());
            }
            params.liangfangDate = that.calenderBtn.val().trim().replace(/(\d{4}).(\d{1,2}).(\d{1,2}).+/mg, '$1-$2-$3');
            params.takeMsg = encodeURIComponent(that.inputFormat(that.remarkContent.val()));

            return params;
        },

        /* 提交*/
        submitOptions: function () {
            var that = this;
            var content = that.inputFormat(that.remarkContent.val());
            if (content.length > 500) {
                that.toastMsg('备注、说明最多输入500个字哦');
            } else if (!that.buttonFlag) {
                that.toastMsg('前四项内容必须填写哦');
            } else {
                that.submitFlag = false;
                var url = vars.jiajuSite + '?c=jiaju&a=ajaxTyBaomingOption&r=' + Math.random();
                var param = that.getParams();
                $.get(url, param, function (data) {
                    that.submitFlag = true;
                    if (data) {
                        if (data.IsSuccess === '1') {
                            if (vars.isKT === '0') {
                                // 未开通城市进入未开通页面,不用提示弹窗
                                var rUrl = vars.jiajuSite + '?c=jiaju&a=bmNotCity&city=' + vars.city;
                                window.location = vars.is_sfapp === '1' ? rUrl + '&src=client' : rUrl;
                            } else {
                                jiajuUtils.toggleTouchmove(true);
                                that.floatAlert.show();
                            }
                        } else {
                            that.toastMsg(data.ErrorMsg);
                        }
                    } else {
                        that.toastMsg('网络不给力，请重试');
                    }
                });
            }
        },

        /* 错误提示方法*/
        toastMsg: function (msg) {
            var that = this;
            that.sendFloat.show();
            that.sendText.html(msg);
            setTimeout(function () {
                that.sendText.html('');
                that.sendFloat.hide();
            }, 2000);
        },

        /* 格式化用户输入*/
        inputFormat: function (str) {
            var word = str.replace(/[\<\>\(\)\;\{\}\"\'\[\]\/\@\!\,]/g, '');
            return word.replace(/(^\s+)|(\s+$)/g, '');
        },

        /* 算出选中的日期是周几*/
        dateToWeekFn: function (selectedDate) {
            var weekList = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
            var week = new Date(selectedDate).getDay();
            return weekList[week];
        }
    };
    module.exports = function () {
        var bmOp = new GetBMOption();
        bmOp.init();
    };
});