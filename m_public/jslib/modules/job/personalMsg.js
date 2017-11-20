/**
 * Created by hanxiao on 2017/08/02.
 */
define('modules/job/personalMsg', ['jquery', 'verification/1.0.0/verification', 'dateAndTimeSelect/1.1.0/dateAndTimeSelect_job','imageUpload/1.0.0/imageUpload_job'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        // 文档jquery对象索引
        var $doc = $(document);
        // 页面传入的数据
        var vars = seajs.data.vars;
        // 日期选择功能
        var DateAndTimeSelect = require('dateAndTimeSelect/1.1.0/dateAndTimeSelect_job');
        // 校验信息
        var verification = require('verification/1.0.0/verification');
        // 证件类型选择按钮
        var $cardBtn = $('#cardBtn');
        // 证件类型容器
        var $cardBox = $('#cardBox');
        // 选中选项添加选中样式
        function liAddActive(tmp){
            $(tmp).addClass('activeS').siblings().removeClass('activeS');
        }
        // 显示证件类型选择弹层
        $cardBtn.on('click', function(){
            $('#selCard').show();
        });
        // 证件类型选中事件
        $cardBox.find('li').on('click', function(){
            var that = this;
            liAddActive(that);
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
            var that = this;
            liAddActive(that);
        });
        // 工作年限选择按钮
        var $wlBtn = $('#worklifeBtn');
        // 工作年限容器
        var $wlBox = $('#wroklifeBox');
        // 显示工作年限容器
        $wlBtn.on('click', function(){
            $('#selwroklife').show();
        });
        // 工作年限选中事件
        $wlBox.find('li').on('click', function(){
            var that = this;
            liAddActive(that);
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
            if (that.hasClass('card')) {
                $cardBtn.text(tmpValue);
            } else if (that.hasClass('xl')) {
                $xlBtn.text(tmpValue);
            } else {
                $wlBtn.text(tmpValue);
            }
            that.parent().parent().parent().hide();
        });
        // 出生日期选择事件
        var year = new Date().getFullYear();//当前年
        var beginYear = year - 60;
        var endYear = year - 17;
        var options = {
            // 年份限制
            yearRange: beginYear + '-' + endYear,
            // 单个选项的css高度，用于后面的位置计算
            singleLiHeight: 34,
            // 默认显示的日期
            defaultTime: new Date().getTime()
        };
        var dtSelect = new DateAndTimeSelect(options);
        // 显示选择日期的弹层
        $('#begintime').on('click', function(){
            dtSelect.show('dtSelect.setting.SELET_TYPE_DATE');
        });

        // 校验表单信息
        // 姓名
        var name = $('#name');
        // 性别
        var sex = $('#sex');
        // 手机号
        var phone = $('#phone');
        // 邮箱
        var email = $('#email');
        // 证件号码
        var cardNum = $('#cardNum');
        // 联系地址
        var linkAddr = $('#linkAddr');
        // 婚姻状况
        var marry = $('#marry');
        // 下一步按钮成功后跳转到教育经历页面
        $('#nextBtn').on('click', function(){
            if (checkData()) {
                // 信息校验成功提交数据
                // 收集表单信息
                var formData = colletcAllMsg();
                // 提交信息到后台
                $.ajax({
                    url: '?c=job&a=ajaxCreatePersonalMsg',
                    data: formData,
                    type: 'POST',
                    success: function (data) {
                        if (data.errCode === '0') {
                            window.location = vars.jobSite + '?c=job&a=educateExp';
                        } else {
                            showMsg(data.Msg);
                        }
                    }
                });
            }
            return false;
        });
        // 保存按钮成功后提示保存成功
        $('#saveData').on('click', function(){
            if (checkData()) {
                // 信息校验成功提交数据
                // 收集表单信息
                var formData = colletcAllMsg();
                // 提交信息到后台
                $.ajax({
                    url: '?c=job&a=ajaxCreatePersonalMsg',
                    data: formData,
                    type: 'POST',
                    success: function (data) {
                        if (data.errCode === '0') {
                            showMsg('保存信息成功');
                        } else {
                            showMsg(data.Msg);
                        }
                    }
                });
            }
            return false;
        });
        function checkData(){
            if (!getCharLength(name.val(), 2, 20)) {
                showMsg('请输入正确的姓名');
                return false;
            }
            var sexVal = sex.find("input:radio:checked").val().trim();
            if (sexVal !== '男' && sexVal !== '女') {
                showMsg('请选择正确的性别');
                return false;
            }
            if (!verification.isMobilePhoneNumber(phone.val())) {
                showMsg('请输入正确的手机号码');
                return false;
            }
            if (!verification.isEmail(email.val())) {
                showMsg('请输入正确的邮箱');
                return false;
            }
            if ($cardBtn.text().trim() === '请选择' || $cardBtn.text().trim() === '') {
                showMsg('请选择正确的证件类型');
                return false;
            }
            if ($cardBtn.text().trim() === '身份证') {
                var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
                if(reg.test(cardNum.val()) === false) {
                    showMsg('请输入正确的身份证号');
                    return false;
                }
            } else if ($cardBtn.text().trim() === '军官证') {
                if (cardNum.val().trim() === '' || cardNum.val().trim() === '请输入证件号码' || !getCharLength(cardNum.val(), 3, 20)) {
                    showMsg('请输入正确的军官证号');
                    return false;
                }
            }
            var birthDate = $('#begintime').text().trim();
            if (birthDate === '' || birthDate === '请选择出生年月日') {
                showMsg('请选择正确的出生年月日');
                return false;
            }
            if ($xlBtn.text().trim() === '请选择' || $xlBtn.text().trim() === '') {
                showMsg('请选择正确的学历');
                return false;
            }
            if ($wlBtn.text().trim() === '请选择' || $wlBtn.text().trim() === '') {
                showMsg('请选择正确的工作年限');
                return false;
            }
            if (linkAddr.val().trim() === '' || linkAddr.val().trim() === '请输入目前所在居住地') {
                showMsg('请输入正确的居住地址');
                return false;
            }
            var marryVal = marry.find("input:radio:checked").val();
            if (marryVal !== '1' && marryVal !== '0') {
                showMsg('请选择正确的婚姻状况');
                return false;
            }
            return true;
        }
        // 收集所有表单信息
        function colletcAllMsg() {
            var formData = {};
            formData.name = name.val();
            if (sex.find("input:radio:checked").val() === '男') {
                formData.sex = 1;
            } else {
                formData.sex = 0;
            }
            formData.phone = phone.val();
            formData.email = email.val();
            if ($cardBtn.text().trim() === '身份证') {
                formData.cardType = 'idcard';
            } else {
                formData.cardType = 'officercard';
            }
            formData.cardNum = cardNum.val();
            formData.birthDate = $('#begintime').text().trim();
            formData.xl = $xlBtn.text().trim();
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
            switch ($wlBtn.text().trim()) {
                case '一年以下' :
                    formData.wl = 0 ;
                    break;
                case '一年以上' :
                    formData.wl = 1 ;
                    break;
                case '两年以上' :
                    formData.wl = 2 ;
                    break;
                case '三年以上' :
                    formData.wl = 3 ;
                    break;
                case '四年以上' :
                    formData.wl = 4 ;
                    break;
                case '五年以上' :
                    formData.wl = 5 ;
                    break;
                default :
                    formData.wl = 6 ;
            }
            formData.linkAddr = linkAddr.val().trim();
            formData.marryMsg = marry.find("input:radio:checked").val();
            if (imgUrl !== '') {
                formData.imgUrl = imgUrl;
            }
            return formData;
        }
        // 填写完证件号，如果是身份证自动填写出生日期
        var $bir;
        cardNum.on('blur', function() {
            if ($cardBtn.text().trim() === '身份证' && cardNum.val().trim() !== '' && cardNum.val().trim() !== '请输入证件号码') {
                var $year = cardNum.val().trim().substr(6, 4);
                var $month = cardNum.val().trim().substr(10, 2);
                var $day = cardNum.val().trim().substr(12, 2);
                var $bir = $year + '-' + $month + '-' + $day;
                $('#begintime').text($bir);
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
        var ImageUpload = require('imageUpload/1.0.0/imageUpload_job');
        // 上传图片处理 start
        var imgupload;
        var imgUrl = vars.photo;
        imgupload = new ImageUpload({
            uploadBtn : '#uploadPic',
            url : vars.jobSite + '?c=job&a=ajaxUploadImg',
            onSuccess : function(file, data){
                data = JSON.parse(data);
                if (data.errCode === '0') {
                    $('#hideSpan').hide();
                    $('#showImg').show();
                    $('#showPic').attr('src', data.url);
                    imgUrl = data.url;
                } else {
                    showMsg('上传失败请重新上传');
                }
            }
        });
    }
});