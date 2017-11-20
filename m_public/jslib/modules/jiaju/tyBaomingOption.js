/**
 * @file 统一报名完善页
 * @author bjzhangxiaowei@fang.com
 */
define('modules/jiaju/tyBaomingOption', ['jquery', 'iscroll/1.0.0/iscroll'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var IScroll = require('iscroll/1.0.0/iscroll');
        var vars = seajs.data.vars;

        var sendFloatId = $('#sendFloat');
        var sendTextId = $('#sendText');
        var zxArea = $('#zxArea');
        var zxDate = $('#zxDate');
        var zxHouseType = $('#zxHouseType');
        var zxType = $('#zxType');
        var zxHuxing = $('#zxHuxing');
        var zxBudget = $('#zxBudget');
        var zxBudgetType = $('#zxBudgetType');
        var success = $('#success');
        var cancel = $('#cancel');
        var optionInfo = $('#optionInfo');
        var zxDateCon = $('#zxDateCon');
        var zxHouseTypeCon = $('#zxHouseTypeCon');
        var zxTypeCon = $('#zxTypeCon');
        var zxHuxingCon = $('#zxHuxingCon');
        var zxBudgetCon = $('#zxBudgetCon');
        var zxBudgetTypeCon = $('#zxBudgetTypeCon');
        var option = $('#option');
        var submit = $('.submit');
        var areaAboutFlag = true;
        var buttonFlag = false;
        var submitFlag = true;

        // click流量统计
        require.async(location.protocol + '//clickm.fang.com/click/new/clickm.js', function () {
            window.Clickstat.eventAdd(window, 'load', function () {
                window.Clickstat.batchEvent('wapjiajubmzl_', '');
            });
        });

        // toast提示
        function toastAlert(toastText) {
            sendFloatId.show();
            sendTextId.text(toastText);
            setTimeout(function () {
                sendFloatId.hide();
            }, 2000);
        }

        // 输入框选择弹出
        $('.mgX14').eq(0).on('click', 'div', function (e) {
            var id = e.target.id;
            switch (id) {
                case 'zxDate':
                    optionCom(zxDateCon, zxDate, '请选择您预计装修时间(必填)', '#zxDateCon');
                    break;
                case 'zxHouseType':
                    optionCom(zxHouseTypeCon, zxHouseType, '请选择房屋类型', '#zxHouseTypeCon');
                    break;
                case 'zxType':
                    optionCom(zxTypeCon, zxType, '请选择您装修类型', '#zxTypeCon');
                    break;
                case 'zxHuxing':
                    optionCom(zxHuxingCon, zxHuxing, '请选择您的户型', '#zxHuxingCon');
                    break;
                case 'zxBudget':
                    optionCom(zxBudgetCon, zxBudget, '请选择装修预算', '#zxBudgetCon');
                    break;
                case 'zxBudgetType':
                    optionCom(zxBudgetTypeCon, zxBudgetType, '请选择预算类型', '#zxBudgetTypeCon');
                    break;
                default:
                    break;
            }
        });


        // 装修面积
        zxArea.on('blur', function () {
            zxAreaCom();
            submitState();
        });
        // 提交按钮
        submit.on('click', function () {
            if (submitFlag) {
                submitButton();
            }
        });

        var areaFlag = false;
        // 装修面积输入框验证
        function zxAreaCom() {
            if (zxArea.val() < 1 || zxArea.val() > 999.99) {
                toastAlert('请输入房屋面积 (1 - 999) ㎡');
                areaFlag = false;
                areaAboutFlag = false;
            } else if (zxArea.val().indexOf('.') !== -1 && zxArea.val().split('.')[1].length > 2) {
                // 只能输入两位小数，如果超过两位给予提示
                toastAlert('最多输入小数点后两位');
                areaFlag = false;
                areaAboutFlag = false;
            } else if (zxArea.val() !== '') {
                areaFlag = true;
                areaAboutFlag = true;
            }
        }

        // 记录筛选项高度和单屏筛选框个数
        var refreshPosLog = (function () {
            // 只执行一次
            var isFirst = 1;
            var posLog = {};
            return function ($filterMenu) {
                if ($filterMenu && isFirst) {
                    var boxHeight = parseInt($filterMenu.css('height'), 10);
                    var ddHeight = parseInt($filterMenu.find('li').eq(0).css('height'), 10);
                    // 筛选项高度
                    posLog.height = ddHeight;
                    // 单屏筛选项个数
                    posLog.length = boxHeight / ddHeight;
                    isFirst = 0;
                }
                return posLog;
            };
        })();

        // 滚动
        function IScrollEvent(name) {
            var posLog = refreshPosLog($(name));
            // 滚动条位置
            IScroll.refresh(name);
            // 当前筛选菜单下的筛选项
            var $li = $(name).find('li');
            // 筛选项总数
            var length = $li.length;
            // 当前选中筛选项的序数
            var index = $li.filter('.activeS').index();
            // 大于一屏
            if (index > posLog.length - 1) {
                IScroll.to(name, 0, -index * posLog.height);
                // 最后一屏
                if (length - index < posLog.length) {
                    IScroll.to(name, 0, -(length - posLog.length) * posLog.height);
                }
            }
        }


        // 选择器
        function optionCom(optionCon, divText, defaultText, conName) {
            optionInfo.text(defaultText);
            option.show();
            optionCon.show();
            IScrollEvent(conName);
            optionCon.find('li').removeClass('active');
            optionCon.off('click').on('click', 'li', function () {
                divText.addClass('xuan_jg');
                if (zxArea.val() !== '' && !areaFlag) {
                    areaAboutFlag = false;
                } else {
                    areaAboutFlag = true;
                }
                $(this).addClass('active');
                optionCon.find('li').removeClass('activeS');
                $(this).addClass('activeS');
                divText.text($(this).text());
                divText.attr('value', $(this).val());
                setTimeout(function () {
                    optionCon.hide();
                    option.hide();
                    submitState();
                }, 350);
            });
            cancel.off('click').on('click', function () {
                cancleOption(optionCon);
            });
        }

        // 选择器的取消按钮
        function cancleOption(optionCon) {
            optionCon.hide();
            option.hide();
        }

        // 设置提交按钮状态，选择其中一项提交按钮就置红
        function submitState() {
            if ((areaFlag || zxDate.text !== '请选择您预计装修时间(必填)' || zxHouseType.text() !== '请选择房屋类型'
                || zxType.text() !== '请选择您装修类型' || zxHuxing.text() !== '请选择您的户型' || zxBudget.text() !== '请选择装修预算'
                || zxBudgetType.text() !== '请选择预算类型') && areaAboutFlag === true) {
                // submit.attr('id','wapjiajubmzl_B01_11').parent().addClass('active');
                // 单独为submit设置样式，直接跳过按钮保持不变
              	submit.css('cssText','background-color:#df3031;color:#fff !important');
                buttonFlag = true;
            } else {
                // submit.attr('id','wapjiajubmzl_B01_10').parent().removeClass('active');
                submit.css('cssText','background-color:#e3e7ed;color:#cccfd8 !important');
                buttonFlag = false;
            }
        }

        // 提交
        function submitButton() {
            // 装修时间必填，如果没有选择装修时间不许提交，提交按钮置灰
            if (!buttonFlag) {
                if (!areaFlag && zxArea.val()) {
                    zxAreaCom();
                } else {
                    toastAlert('至少填写一项内容');
                }
            } else if (zxDate.text() === '请选择您预计装修时间(必填)') {
                toastAlert('请选择装修时间');
                submit.parent().removeClass('active');
            } else {
                // 上锁
                submitFlag = false;
                var data, url;
                var zxDateText = zxDate.text() === '请选择您预计装修时间(必填)' ? '' : zxDate.attr('value');
                var zxHouseTypeText = zxHouseType.text() === '请选择房屋类型' ? '' : zxHouseType.attr('value');
                var zxTypeText = zxType.text() === '请选择您装修类型' ? '' : zxType.attr('value');
                var zxHuxingText = zxHuxing.text() === '请选择您的户型' ? '' : zxHuxing.attr('value');
                var zxBudgetText = zxBudget.text() === '请选择装修预算' ? '' : zxBudget.attr('value');
                var zxBudgetTypeText = zxBudgetType.text() === '请选择预算类型' ? '' : zxBudgetType.attr('value');
                data = {
                    applyUserID: vars.applyUserID,
                    zxDate: zxDateText,
                    houseType: zxHouseTypeText,
                    zxType: zxTypeText,
                    roomtype: zxHuxingText,
                    zxArea: zxArea.val(),
                    zxBudget: zxBudgetText,
                    zxBudgetType: zxBudgetTypeText
                };
                url = vars.jiajuSite + '?c=jiaju&a=ajaxTyBaomingOption&r=' + Math.random();

                $.get(url, data, function (q) {
                    if (q === '接口超时') {
                        toastAlert(q);
                    } else if (q.IsSuccess === '1') {
                        success.show();
                        $('.main').hide();
                    } else if (q.ErrorMsg === '已经添加信息') {
                        toastAlert('您的信息已经提交过了，请耐心等候。');
                    } else {
                        toastAlert(q.ErrorMsg);
                    }
                    submitFlag = true;
                }).complete(function () {
                    submitFlag = true;
                });
            }
        }
    };
});
