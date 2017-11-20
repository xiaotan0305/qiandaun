/**
 * Created by hanxiao on 2017/8/8.
 */
define('modules/job/projectExp', ['jquery', 'dateAndTimeSelect/1.1.0/dateAndTimeSelect_job'], function (require, exports, module) {
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
            if (!flag) {
                if (checkData()) {
                    var formdata = collectMsg();
                    // 提交信息到后台
                    $.ajax({
                        url: '?c=job&a=ajaxCreateProjectExpMsg',
                        data: formdata,
                        type: 'POST',
                        success: function (data) {
                            //0-信息保存成功  2-未添加任何信息
                            if (data.errCode === '0' || data.errCode === '2') {
                                window.location = vars.jobSite + '?c=job&a=uploadLocalResume';
                            } else {
                                showMsg(data.Msg);
                            }
                        }
                    });
                }
            } else {
                window.location = vars.jobSite + '?c=job&a=uploadLocalResume';
            }
            //window.location = vars.jobSite + '?c=job&a=practicalExp';
        });
        // 保存按钮成功后提示保存成功
        var flag = false;
        var beforeData;
        $('#saveData').on('click', function(){
            if (checkData()) {
                // 信息校验成功提交数据
                // 收集表单信息
                var formData = collectMsg();
                // 与上次添加的信息进行比较相同则不保存
                if (beforeData) {
                    var sameFlag = 0;
                    $.each(formData, function(n ,value){
                        if (beforeData[n] !== value) {
                            sameFlag = 1;
                        }
                    });
                    if (sameFlag === 0) {
                        showMsg('未做任何修改无需保存');
                        return false;
                    }
                }
                beforeData = formData;
                // 提交信息到后台
                $.ajax({
                    url: '?c=job&a=ajaxCreateProjectExpMsg',
                    data: formData,
                    type: 'POST',
                    success: function (data) {
                        if (data.errCode === '0') {
                            flag = true;
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
        function setFlag(){
            flag = true;
        }
        // 添加更多项目经历
        $('#addMore').on('click', function(){
            if (flag) {
                window.location = vars.jobSite + '?c=job&a=projectExp&type=addMore';
            } else {
                showMsg('请先填写并保存此次项目经验');
            }
        });
        var $projName = $('#projName');
        var $projExplain = $('#projExplain');
        // 校验信息
        function checkData() {
            var checkFlag = false;
            if ($projName.val().trim() !== '请输入项目名称' && $projName.val().trim() !== '') {
                checkFlag = true;
            }
            if ($beginTime.text().trim() !== '请输入开始时间' || $endTime.text().trim() !== '请输入结束时间') {
                checkFlag = true;
            }
            if ($projExplain.val().trim() !== '') {
                checkFlag = true;
            }
            if (checkFlag) {
                if (!getCharLength($projName.val().trim(), 2, 40)) {
                    showMsg('请填写正确的项目名称');
                    return false;
                }
                if ($beginTime.text().trim() === '请输入开始时间' || $endTime.text().trim() === '请输入结束时间') {
                    showMsg('请填写正确的开始结束时间');
                    return false;
                }
                var reg = /\d+/g;
                if (parseInt($beginTime.text().trim().match(reg).join('')) >= parseInt($endTime.text().trim().match(reg).join(''))) {
                    showMsg('结束时间需要大于开始时间');
                    return false;
                }
                if ($projExplain.val().trim() === '') {
                    showMsg('请填写项目描述');
                    return false;
                }
            }
            return true;
        }
        // 收集信息
        function collectMsg() {
            var formData = {};
            formData.projName = $projName.val().trim();
            formData.begintime = $beginTime.text().trim() === '请输入开始时间' ? '' : $beginTime.text().trim();
            formData.endtime = $endTime.text().trim() === '请输入结束时间' ? '' : $endTime.text().trim();
            formData.projExplain = $projExplain.val().trim();
            formData.id = vars.id;
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
            var reg = /^\S+$/;
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
        // 删除按钮点击显示删除确认弹层
        $('#delExp').on('click', function(){
            $('.floatAlert').show();
        });
        // 确定删除按钮
        $('#delSure').on('click', function(){
            $.ajax({
                url: '?c=job&a=ajaxDelExp&type=proj&id=' + vars.expid,
                type: 'GET',
                success: function (data) {
                    if (data === 'true') {
                        showMsg('删除成功');
                        window.location = vars.jobSite + '?c=job&a=editResume';
                    } else {
                        showMsg('删除失败请重试');
                    }
                }
            });
        });
        // 取消删除按钮
        $('#delCancel').on('click', function(){
            $('.floatAlert').hide();
        });
    }
});