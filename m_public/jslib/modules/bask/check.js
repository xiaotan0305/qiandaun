/**
 * 审核页主类
 * by
 * 2016830
 */
define('modules/bask/check', ['jquery', 'iscroll/2.0.0/iscroll-lite'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        // jquery库
        var $ = require('jquery');
        // 获取页面数据
        var vars = seajs.data.vars;
        // 滑动插件
        var IScroll = require('iscroll/2.0.0/iscroll-lite');
        // 绑定事件对象
        // 真实姓名按钮
        var realName = $('#realName'),
        // 公司按钮
            company = $('#company'),
        // 头衔职位按钮
            position = $('#position'),
        // 手机按钮
            iphone = $('#iphone'),
        // 工作年限按钮
            worklonger = $('#worklonger'),
        // 个人简介按钮
            answertext = $('.answertext'),
        // 提交按钮
            submit = $('#submit'),
        // 浮层按钮
            float = $('.floatip'),
        // 浮层展示内容按钮
            floatCont = $('.ts-cont');
        // 非数字正则
        var noNumPattern = /[^\d]+/g;
        // 手机号正则
        var phonePattern = /^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$/i;

        // 操作专家类型下面的滑动选择项
        // 滑动选项总容器节点
        var $expertcheckTag = $('#expertcheck');
        // 滑动选项中的所有选项节点数组
        var $expertcheckTagArr = $expertcheckTag.find('li');
        // 所有选项节点个数
        var $expertcheckTagArrL = $expertcheckTagArr.length;
        // 选项卡总宽度索引
        var totalW = 0;

        // 专家类型下滑动选项卡初始化
        for (var i = 0; i < $expertcheckTagArrL; i++) {
            var el = $expertcheckTagArr.eq(i);
            // 这里的10是外边距
            totalW += Math.round(el.outerWidth()) + 10;
        }
        // 设置滑动块宽度
        if ($expertcheckTag.length > 0) {
            $expertcheckTag.width(totalW);
            // 初始化滑动控制插件
            new IScroll('.expertcheck', {
                scrollX: true,
                scrollY: false,
                bindToWrapper: true
            });
        }


        // 验证手机号数字输入的有效性
        iphone.on('input', function () {
            iphone.val(iphone.val().replace(noNumPattern, ''));
        });

        // 提示浮层
        var toastMsg = function (msg) {
            float.show();
            floatCont.html(msg);
            setTimeout(function () {
                float.hide();
            }, 1000);
        };

        /**
         * 绑定点击事件，工作年限的选择
         */
        worklonger.on('click', 'li', function () {
            var $that = $(this);
            $that.siblings('li').removeClass('on');
            $that.toggleClass('on');
        });

        $expertcheckTag.find('li').on('click', function () {
            var $that = $(this);
            if ($expertcheckTag.find('li.on').length < 2 || $that.hasClass('on')) {
                $that.toggleClass('on');
            }
        });

        // 获取配套设施
        function getValue(arr) {
            var arr1 = [];
            var arrStr;
            for (var i = 0; i < arr.length; i++) {
                arr1.push(arr[i].innerHTML + ',');
            }
            arrStr = arr1.join('');
            return arrStr.substring(0, arrStr.length - 1);
        }

        function getValue1(arr) {
            var arr1 = [];
            var arrStr;
            for (var i = 0; i < arr.length; i++) {
                arr1.push($(arr[i]).attr('expertid') + ',');
            }
            arrStr = arr1.join('');
            return arrStr.substring(0, arrStr.length - 1);
        }

        /**
         * 绑定点击事件，提交审核功能
         */
        // 防止重复点击
        var canClick = !0;
        // 点击确认发放按钮
        submit.on('click', function () {
            var realNameValue = realName.val();
            var companyValue = company.val();
            var positionValue = position.val();
            var iphoneValue = iphone.val();
            var contentValue = answertext.val();
            var worklongerValue = worklonger.find('li.on').find('a').attr('worklonger');
            var $expertcheckOn = $('#expertcheck .on');
            var experttypenamesValue = getValue($expertcheckOn.find('a'));
            var experttypeidsValue = getValue1($expertcheckOn.find('a'));
            // 验证输入姓名
            if (realNameValue === '') {
                toastMsg('请输入真实姓名');
                return;
            } else if (realNameValue.length > 10) {
                toastMsg('输入姓名必须在10字以内');
                return;
            } else if (companyValue === '') {
                toastMsg('请输入公司名称');
                return;
            } else if (companyValue.length > 10) {
                toastMsg('公司名称必须在10字以内');
                return;
            } else if (positionValue === '') {
                toastMsg('请输入头衔/职位');
                return;
            } else if (positionValue.length > 20) {
                toastMsg('头衔/职位必须在20字以内');
                return;
            } else if (iphoneValue === '') {
                toastMsg('请输入手机号');
                return;
            } else if (!phonePattern.test(iphoneValue)) {
                toastMsg('不是正确的手机号');
                return;
            } else if (worklongerValue === undefined) {
                toastMsg('请选择工作年限');
                return;
            } else if (experttypenamesValue === '' || experttypeidsValue === '') {
                toastMsg('请选择专家类型');
                return;
            } else if (contentValue === '') {
                toastMsg('请输入个人简介');
                return;
            } else if (contentValue.length > 100) {
                toastMsg('输入个人简介必须在100字以内');
                return;
            }
            if (canClick) {
                canClick = !1;
                var url = vars.askSite + '?c=bask&a=ajaxGoCheck';
                var data = {
                    realname: realNameValue,
                    company: companyValue,
                    worklonger: worklongerValue,
                    position: positionValue,
                    iphone: iphoneValue,
                    experttypeids: experttypeidsValue,
                    experttypenames: experttypenamesValue,
                    content: encodeURIComponent(contentValue),
                    grouptype: vars.grouptype
                };
                $.ajax({
                    type: 'post',
                    url: url,
                    data: data,
                    dataType: 'json',
                    success: function (data) {
                        canClick = !0;
                        if (data.code === '100') {
                            window.location = vars.askSite + '?c=bask&a=checkSucess&src=client&grouptype=' + vars.grouptype + '&zhcity=' + vars.zhcity;
                        } else {
                            toastMsg(data.message);
                        }
                    },
                    error: function () {
                        canClick = !0;
                        toastMsg('提交失败');
                    }
                });
            }
        });
    };
});