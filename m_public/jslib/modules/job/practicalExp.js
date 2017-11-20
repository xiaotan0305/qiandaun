/**
 * Created by hanxiao on 2017/8/2.
 */
define('modules/job/practicalExp', ['jquery', 'dateAndTimeSelect/1.1.0/dateAndTimeSelect_job'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        // 文档jquery对象索引
        var $doc = $(document);
        // 页面传入的数据
        var vars = seajs.data.vars;
        // 日期选择功能
        var DateAndTimeSelect = require('dateAndTimeSelect/1.1.0/dateAndTimeSelect_job');
        var DateAndTimeSelect1 = require('dateAndTimeSelect/1.1.0/dateAndTimeSelect_job');
        // 出生日期选择事件
        var year = new Date().getFullYear();//当前年
        var beginYear = year - 60;
        var options = {
            // 年份限制
            yearRange: beginYear + '-' + year,
            // 单个选项的css高度，用于后面的位置计算
            singleLiHeight: 34,
            // 默认显示的日期
            defaultTime: new Date().getTime(),
            // 显示日期的容器
            timeBox : '#beginTime'
        };
        var options1 = {
            // 年份限制
            yearRange: beginYear + '-' + year,
            // 单个选项的css高度，用于后面的位置计算
            singleLiHeight: 34,
            // 默认显示的日期
            defaultTime: new Date().getTime(),
            // 显示日期的容器
            timeBox : '#endTime'
        };
        var dtSelect = new DateAndTimeSelect(options);
        var dtSelect1 = new DateAndTimeSelect1(options1);
        var $beginTime = $('#beginTime');
        var $endTime = $('#endTime');
        // 显示选择日期的弹层
        $beginTime.on('click', function(){
            dtSelect.show('dtSelect.setting.SELET_TYPE_DATE');
        });
        $endTime.on('click', function(){
            dtSelect1.show('dtSelect1.setting.SELET_TYPE_DATE');
        });
        $('#nextBtn').on('click', function() {
            if (checkData()) {
                var formdata = collectMsg();
                // 提交信息到后台
                $.ajax({
                    url: '?c=job&a=ajaxCreatePracticalExpMsg',
                    data: formdata,
                    type: 'POST',
                    success: function (data) {
                        //0-信息保存成功  2-未添加任何信息
                        if (data.errCode === '0' || data.errCode === '2') {
                            window.location = vars.jobSite + '?c=job&a=projectExp';
                        } else {
                            showMsg(data.Msg);
                        }
                    }
                });
            }
            //window.location = vars.jobSite + '?c=job&a=practicalExp';
        });
        // 保存按钮成功后提示保存成功
        $('#saveData').on('click', function(){
            if (checkData()) {
                // 信息校验成功提交数据
                // 收集表单信息
                var formData = collectMsg();
                // 提交信息到后台
                $.ajax({
                    url: '?c=job&a=ajaxCreatePracticalExpMsg',
                    data: formData,
                    type: 'POST',
                    success: function (data) {
                        if (data.errCode === '0') {
                            showMsg('保存信息成功');
                        } else if (data.errCode === '2') {
                            showMsg('您未填写任何信息，无需保存');
                        } else {
                            showMsg(data.Msg);
                        }
                    }
                });
            }
            return false;
        });
        var $company = $('#company');
        var $position = $('#position');
        var $practicalExplain = $('#practicalExplain');
        // 校验信息
        function checkData() {
            if ($company.val().trim() !== '请输入企业名称' && $company.val().trim() !== '') {
                if (!getCharLength($company.val().trim(), 2, 20)) {
                    showMsg('请填写正确的企业名称');
                    return false;
                }
            }
            if ($position.val().trim() !== '请输入职位名称' && $position.val().trim() !== '') {
                if (!getCharLength($position.val().trim(), 2, 20)) {
                    showMsg('请填写正确的职位名称');
                    return false;
                }
            }
            if ($beginTime.text().trim() !== '请输入开始时间' && $endTime.text().trim() !== '请输入结束时间') {
                var reg = /\d+/g;
                if (parseInt($beginTime.text().trim().match(reg).join('')) >= parseInt($endTime.text().trim().match(reg).join(''))) {
                    showMsg('结束时间需要大于开始时间');
                    return false;
                }
            }
            return true;
        }
        // 收集信息
        function collectMsg() {
            var formData = {};
            formData.company = $company.val().trim();
            formData.position = $position.val().trim();
            formData.begintime = $beginTime.text().trim() === '请输入开始时间' ? '' : $beginTime.text().trim();
            formData.endtime = $endTime.text().trim() === '请输入结束时间' ? '' : $endTime.text().trim();
            formData.practicalExplain = $practicalExplain.val().trim();
            return formData;
        }
        // 字符判断 中英文 数字都行
        function getCharLength(str, min, max) {
            if (!str) {
                return false;
            }
            str = $.trim(str);
            var len = str.length;
            var $this = $(this);
            var charCount = 0;
            var reg = /^[a-zA-Z0-9\u4e00-\u9fa5]+$/;
            if (len > 0) {
                if (reg.test(str)) {
                    for (var i = 0; i < len; i++) {
                        if (reg.test(str[i])) {
                            charCount += 1;
                        }
                    }
                }
                if (charCount > max || charCount < min) {
                    return false;
                }
                return true;
            } else {
                return false;
            }
        }
        // 信息提示弹层
        var floatAlert = $('#floatAlert');
        function showMsg(str, time) {
            time = time || 2000;
            floatAlert.show();
            floatAlert.text(str);
            setTimeout(function(){
                floatAlert.hide();
            }, time);
            return false;
        }
        floatAlert.on('click', function() {
            $(this).hide();
        });
    }
});
