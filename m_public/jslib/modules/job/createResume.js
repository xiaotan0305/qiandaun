/**
 * 校招
 * by yk
 * 20151004
 **/
define('modules/job/createResume', ['jquery', 'verification/1.0.0/verification', 'dateAndTimeSelect/1.0.0/dateAndTimeSelect'], function (require, exports, module) {
    'use strict';
    var $ = require('jquery');
    var verification = require('verification/1.0.0/verification');
    var DateAndTimeSelect = require('dateAndTimeSelect/1.0.0/dateAndTimeSelect');
    // 验证填写招聘简历
    function InputVerify() {
        var oFormCon = $('.Recon');
        // 用户名
        var userName = oFormCon.find('input[name=userName]');
        // 性别
        var selSex = oFormCon.find('select[name=selSex]');
        // 选择出生日期
        var selBirdthday = oFormCon.find('a[name=selBirdthday]');

        var city = oFormCon.find('input[name=city]');
        var selWorkType = oFormCon.find('select[name=selWorkType]');
        var school = oFormCon.find('input[name=school]');
        var profession = oFormCon.find('input[name=profession]');
        var selEducation = oFormCon.find('select[name=selEducation]');
        var enterTime = oFormCon.find('a[name=enterTime]');
        var graduateTime = oFormCon.find('a[name=graduateTime]');
        var tel = oFormCon.find('input[name=tel]');
        var email = oFormCon.find('input[name=email]');
        var inputs = oFormCon.find('input');
        var aLists = oFormCon.find('a');
        var selects = oFormCon.find('select');
        var sbumitBtn = oFormCon.find('a[name=sbumitBtn]');

        userName.on('blur', function () {
            return onlyInputChinese.call(userName, userName.val(), 2, 5, '请输入正确的姓名');

        });

        city.on('blur', function () {
        	if (city.val()==='') {
        		onlyInputChinese.call(city, city.val(), 2, 7, '请输入招聘城市');
        	} else {
        		onlyInputChinese.call(city, city.val(), 2, 7, '您所输入的城市不参与此次校招');
        	}
            
        });

        school.on('blur', function () {
            return getCharLength.call(school, school.val(), 2, 30, '请输入正确格式的学校名称');
        });

        profession.on('blur', function () {
            return getCharLength.call(profession, profession.val(), 2, 40, '请输入正确格式的专业名称');
        });
        email.on('blur', function () {
            if (verification.isEmail(email.val())) {
                email.closest('dd').find('i').hide();
            } else {
                email.closest('dd').find('i').show().text('请输入正确格式的邮箱');
            }
        });
        tel.on('blur', function () {
            if (verification.isMobilePhoneNumber(tel.val())) {
                tel.closest('dd').find('i').hide();
            } else {
                tel.closest('dd').find('i').show().text('请输入正确格式的手机号');
            }
        });

        selBirdthday.on('click', function () {
            return showSelDateFn(this, '1970', '1999', new Date(1991, 0, 1).getTime());
        });

        enterTime.on('click', function () {
            return showSelDateFn(this, '1970', '2015', new Date(2012, 8, 1).getTime());
        });

        graduateTime.on('click', function () {
            return showSelDateFn(this, '2016', '2020', new Date(2016, 6, 1).getTime());
        });

        inputs.on('click', pushInputHeightFn);

        inputs.on('blur', function () {
            var $this = $(this);
            if ($this.val() === '') {
                $this.closest('dd').find('i').show();
            }
        });

        function pushInputHeightFn() {
            var that = this;
            setTimeout(function () {
                $(document.body).scrollTop($(that).offset().top);
            }, 200);
        }

        // 删除页面所有select标签中option为空白的option 默认option
        selects.one('touchstart', delSelFn);
        function delSelFn() {
            var $this = $(this);
            $this.find("option:selected").remove();
        }

        // 验证是否选择 如果空就提示 否则不提示
        selects.on('touchstart', function () {
            var $this = $(this);
            if ($this.val() === '-1') {
                $this.closest('dd').find('i').show();
            } else {
                $this.closest('dd').find('i').hide();
            }
        });


        sbumitBtn.on('click', function () {
            // 验证空
            // 提交ajax代码
            var isPassAll = false;
            var postParams = {};
            // 所有input框的空验证
            inputs.each(function (index, elem) {
                var $elem = $(elem);
                if (!$elem.val()) {
                    $elem.closest('dd').find('i').show();
                    isPassAll = true;
                }
            });
            aLists.each(function (index, elem) {
                var $elem = $(elem);
                if (!$elem.html()) {
                    $elem.closest('dd').find('i').show();
                    isPassAll = true;
                }
            });
            // 所有select框的空验证
            selects.each(function (i, ele) {
                var $elem = $(ele);
                if ($elem.val() === '-1') {
                    $elem.closest('dd').find('i').show();
                    isPassAll = true;
                }
            });
            var formCollection = getFormCollection(oFormCon);
            // console.log(formCollection);
            if (!isPassAll) {
                // 执行ajax后台提交代码
                $.ajax({
                    url: '?c=job&a=ajaxCreateResume',
                    data: {
                        RealName: formCollection.RealName,
                        Sex: formCollection.Sex,
                        Birthday: formCollection.Birthday,
                        TargetCityName: formCollection.TargetCityName,
                        Positions: formCollection.Positions,
                        school: formCollection.school,
                        profession: formCollection.profession,
                        certificate: formCollection.certificate,
                        enterTime: formCollection.enterTime,
                        graduateTime: formCollection.graduateTime,
                        Mobile: formCollection.Mobile,
                        Email: formCollection.Email,
                        TargetCityID: formCollection.TargetCityID,
                    },
                    type: 'POST',
                    cache: false,
                    success: function (data) {
                        if (data.Content === 'success') {
                            window.location.href = '/job/?c=job&a=myResume';
                        } else {
                            $('.promptbox').show();
                            $('#resubmit').click(function () {
                                $('.promptbox').hide();
                            });
                        }
                    }
                });
            } else {
                return false;
            }

        });

        // 时间选择插件的加载及默认参数和当前对象传参
        function showSelDateFn(obj, beginDate, endDate, defaultDate) {
            var $this = $(obj);
            var myDate = new Date();
            var year = myDate.getFullYear();
            var oFloat = $('#floatMask');
            var currentDate = $this.html();
            if (currentDate !== '') {
                defaultDate = new Date(currentDate.replace(/-/g, "/")).getTime();
            }
            var dtSelect = new DateAndTimeSelect({
                dateConfirmFunc: showDate,
                dateCancelFunc: floatHide,
                type: 'job',
                yearRange: beginDate + '-' + endDate,
                defaultTime: defaultDate
            });
            oFloat.show();
            dtSelect.show(dtSelect.setting.SELET_TYPE_DATE);
            // 点击确定时日期选择器调用的函数
            function showDate(date) {
                oFloat.hide();
                $this.html(date);
                dtSelect.hide(dtSelect.setting.SELET_TYPE_DATE);
                $this.closest('dd').find('i').hide();
            }

            // 点击时间选择器的取消按钮时调用的函数
            function floatHide() {
                dtSelect.hide(dtSelect.setting.SELET_TYPE_DATE);
                oFloat.hide();
                if ($this.html() === '') {
                    $this.closest('dd').find('i').show();
                }
            }
        }

        // 获取表单所有的值
        function getFormCollection() {
            var formCollection = {};
            // RealName Sex Birthday IDCardNumber TargetCityName Positions school profession certificate enterTime graduateTime Mobile Email
            formCollection.RealName = userName.val();
            formCollection.Sex = selSex.val();
            formCollection.Birthday = selBirdthday.html();
            formCollection.TargetCityName = city.val();
            formCollection.TargetCityID = city.attr('data-cityid');
            formCollection.Positions = selWorkType.val();
            formCollection.school = school.val();
            formCollection.profession = profession.val();
            formCollection.certificate = selEducation.val();
            formCollection.enterTime = enterTime.html();
            formCollection.graduateTime = graduateTime.html();
            formCollection.Mobile = tel.val();
            formCollection.Email = email.val();
            return formCollection;
        }
    };


    // 仅仅输入汉字 字符数 [min-max]

    function onlyInputChinese(str, min, max, tip) {
        str = $.trim(str);
        var $this = $(this);
        var len = str.length;
        var tipStr = tip || '请输入' + min + '-' + max + '个汉字';
        var inputName = $this.attr('name');
        var chineseCharCount = 0;
        if (len > 0) {
            for (var i = 0; i < len; i++) {
                if (verification.isChineseChar(str[i])) {
                    chineseCharCount += 1;
                } else {
                    $this.closest('dd').find('i').show().text(tipStr);
                    return;
                }
            }
            if (chineseCharCount < min || chineseCharCount > max) {
                $this.closest('dd').find('i').show().text(tipStr);
                return;
            } else {
                $this.closest('dd').find('i').hide();
            }
        } else {
            $this.closest('dd').find('i').show().text(tip);
            return;
        }
        if (inputName === 'city') {
            $.ajax({
                url: '?c=job&a=ajaxGetCityById',
                data: {cityname: str},
                type: 'GET',
                cache: false,
                success: function (data) {
                    if (data.Content === 'error') {
                        // 没有该城市
                        $this.closest('dd').find('i').show().text(tip);
                    } else {
                        // data.Content===''
                        if (data.Item && data.Item.length > 0) {
                            $this.attr('data-cityid', data.Item[0].ID);
                            $this.closest('dd').find('i').hide();
                        } else {
                            $this.closest('dd').find('i').show().text(tip);
                        }
                    }
                }
            });
        }
    }

    // 字符判断 中英文 数字都行
    function getCharLength(str, min, max, tip) {
        str = $.trim(str);
        var len = str.length;
        var $this = $(this);
        var charCount = 0;
        var reg = /^[a-zA-Z0-9\u4e00-\u9fa5]+$/;
        var strTip = tip || '请输入' + min + '-' + max + '个汉字';
        if (len > 0) {
            if (reg.test(str)) {
                for (var i = 0; i < len; i++) {
                    if (reg.test(str[i])) {
                        charCount += 1;
                    }
                }
            }
            if (charCount > max || charCount < min) {
                $this.closest('dd').find('i').show().text(strTip);
            } else {
                $this.closest('dd').find('i').hide();
            }
            return charCount;
        }
    }

    module.exports = InputVerify;
});