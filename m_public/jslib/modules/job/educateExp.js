/**
 * Created by hanxiao on 2017/8/2.
 */
define('modules/job/educateExp', ['jquery', 'dateAndTimeSelect/1.1.0/dateAndTimeSelect_job', 'imageUpload/1.0.0/imageUpload_job'], function (require, exports, module) {
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
        // 显示选择日期的弹层
        $('#beginTime').on('click', function(){
            dtSelect.show('dtSelect.setting.SELET_TYPE_DATE');
        });
        $('#endTime').on('click', function(){
            dtSelect1.show('dtSelect1.setting.SELET_TYPE_DATE');
        });
        // 学历类型选择按钮
        var $xlBtn = $('#xlBtn');
        // 学历类型容器
        var $xlBox = $('#xlBox');
        // 显示学历类型容器
        $xlBtn.on('click', function(){
            $('#selXl').show();
        });
        // 学历类型选中事件
        $xlBox.find('li').on('click', function(){
            $(this).addClass('activeS').siblings().removeClass('activeS');
        });
        // 选择框确定按钮
        var $submitOk = $('.submitOk');
        // 选择框取消按钮
        var $submitReturn = $('.return');
        // 选择框取消事件
        $submitReturn.on('click', function(){
            $(this).parent().parent().parent().hide();
        });
        // 选择框确定事件
        $submitOk.on('click', function(){
            var that = $(this);
            var tmpValue = that.parent().next().find('.activeS').text();
            $xlBtn.text(tmpValue);
            that.parent().parent().parent().hide();
        });
        // 点击下一步校验信息
        var schoolName = $('#schoolName');
        var professionName = $('#professionName');
        var beginTime = $('#beginTime');
        var endTime = $('#endTime');
        $('#nextBtn').on('click', function() {
            if (!flag) {
                if (checkData()) {
                    // 校验成功
                    var fromdata = collectMsg();
                    // 提交信息到后台
                    $.ajax({
                        url: '?c=job&a=ajaxCreateEducateMsg',
                        data: fromdata,
                        type: 'POST',
                        success: function (data) {
                            if (data.errCode === '0') {
                                window.location = vars.jobSite + '?c=job&a=jobExp';
                            } else {
                                showMsg(data.Msg);
                            }
                        }
                    });
                }
            } else {
                window.location = vars.jobSite + '?c=job&a=jobExp';
            }
            return false;
        });
        // 此标志为增加更多提供
        var flag = false;
        var beforeData;
        $('#saveData').on('click', function() {
            if (checkData()) {
                // 校验成功
                var fromdata = collectMsg();
                // 与上次添加的信息进行比较相同则不保存
                if (beforeData) {
                    var sameFlag = 0;
                    $.each(fromdata, function(n ,value){
                        if (beforeData[n] !== value) {
                            sameFlag = 1;
                        }
                    });
                    if (sameFlag === 0) {
                        showMsg('未做任何修改无需保存');
                        return false;
                    }
                }
                beforeData = fromdata;
                // 提交信息到后台
                $.ajax({
                    url: '?c=job&a=ajaxCreateEducateMsg',
                    data: fromdata,
                    type: 'POST',
                    success: function (data) {
                        if (data.errCode === '0') {
                            setFlag();
                            showMsg('保存信息成功');
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
        function checkData(){
            if (!getCharLength(schoolName.val().trim(), 2, 20) || schoolName.val().trim() === '请输入学校名称') {
                showMsg('请填写正确的学校名称');
                return false;
            }
            if (!getCharLength(professionName.val().trim(), 2, 20) || professionName.val() === '请输入专业名称') {
                showMsg('请填写正确的专业名称');
                return false;
            }
            if ($xlBtn.text().trim() === '' || $xlBtn.text().trim() === '请选择') {
                showMsg('请选择学历');
                return false;
            }
            if (beginTime.text().trim() === '' || beginTime.text().trim() === '请输入开始时间') {
                showMsg('请输入开始时间');
                return false;
            }
            if (endTime.text().trim() === '' || endTime.text().trim() === '请输入结束时间') {
                showMsg('请输入结束时间');
                return false;
            }
            var reg = /\d+/g;
            if (parseInt(beginTime.text().trim().match(reg).join('')) >= parseInt(endTime.text().trim().match(reg).join(''))) {
                showMsg('结束时间需要大于开始时间');
                return false;
            }
            return true;
        }
        // 收集表单数据
        function collectMsg() {
            var formData = {};
            formData.school = schoolName.val().trim();
            formData.profession = professionName.val().trim();
            switch ($xlBtn.text().trim()) {
                case '本科' :
                    formData.xl = 2 ;
                    break;
                case '研究生以上' :
                    formData.xl = 0 ;
                    break;
                case '研究生' :
                    formData.xl = 1 ;
                    break;
                case '专科' :
                    formData.xl = 3 ;
                    break;
                default :
                    formData.xl = 4 ;
            }
            formData.begintime = beginTime.text().trim();
            formData.endtime = endTime.text().trim();
            if (xwzImgUrl !== '') {
                formData.xwzUrl = xwzImgUrl;
            } else if (vars.xwzUrl) {
                formData.xwzUrl = vars.xwzUrl;
            }
            if (byzImgUrl !== '') {
                formData.byzUrl = byzImgUrl;
            }else if (vars.byzUrl) {
                formData.byzUrl = vars.byzUrl;
            }
            formData.id=vars.id;
            return formData;
        }
        // 上传学位证
        var ImageUploadxwz = require('imageUpload/1.0.0/imageUpload_job');
        // 上传图片处理 start
        var imguploadxwz;
        var xwzImgUrl = '', byzImgUrl = '';
        imguploadxwz = new ImageUploadxwz({
            uploadBtn : '#uploadXwz',
            url : vars.jobSite + '?c=job&a=ajaxUploadImgZip',
            onSuccess : function(file, data){
                data = JSON.parse(data);
                if (data.errCode === '0') {
                    showMsg('上传学位证成功');
                    $('#xwzSpan').text('学位证.jpg');
                    xwzImgUrl = data.url;
                } else {
                    showMsg('上传学位证失败请重新上传');
                }
            }
        });
        // 上传毕业证
        var ImageUploadbyz = require('imageUpload/1.0.0/imageUpload_job');
        // 上传图片处理 start
        var imguploadbyz;
        imguploadbyz = new ImageUploadbyz({
            uploadBtn : '#uploadByz',
            url : vars.jobSite + '?c=job&a=ajaxUploadImgZip',
            onSuccess : function(file, data){
                data = JSON.parse(data);
                if (data.errCode === '0') {
                    showMsg('上传毕业证成功');
                    $('#byzSpan').text('毕业证.jpg');
                    byzImgUrl = data.url;
                } else {
                    showMsg('上传毕业证失败请重新上传');
                }
            }
        });
        // 添加更多教育经历
        $('#addMore').on('click', function(){
            if (flag) {
                window.location = vars.jobSite + '?c=job&a=educateExp&type=addMore';
            } else {
                showMsg('请先填写并保存此次教育经历');
            }
        });
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
        // 删除按钮点击显示删除确认弹层
        $('#delExp').on('click', function(){
            $('.floatAlert').show();
        });
        // 确定删除按钮
        $('#delSure').on('click', function(){
            $.ajax({
                url: '?c=job&a=ajaxDelExp&type=edu&id=' + vars.expid,
                type: 'GET',
                success: function (data) {
                    if (data === 'true') {
                        showMsg('删除成功');
                        window.location = vars.jobSite + '?c=job&a=editResume';
                    } else if (data === 'justOneEdu') {
                        showMsg('至少需保留一个教育经历');
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
