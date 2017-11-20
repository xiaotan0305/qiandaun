/*             */
//  中秋猜房价  //
// fenglinzeng //
//   2016.09   //
/*             */
$(document).ready(function () {
    'use strict';
    var domain = $('#murl').val();
    // 一共4个页面
    var wrap = $('.wrap');
    // 房屋信息
    var infoLi = $('.houseInfo').find('li');

    // 隐藏房屋信息
    var hideInfo = function () {
        infoLi.hide().removeClass('activeInfo');
    };

    // 显示房屋信息
    var showInfo = function (index) {
        if (index > $('.slidesjs-slide').length) {
            index = 1;
        }
        infoLi.eq(index - 1).addClass('activeInfo').fadeIn();
        var img = $('.slidesjs-slide').eq(index - 1).find('img');
        img.attr('src', img.attr('unload'));
    };

    // 回答正确
    var answerRight = function () {
        wrap.hide();
        $('.page2').fadeIn();
    };

    // 回答错误
    var answerWrong = function () {
        wrap.hide();
        $('.page4').fadeIn();
    };

    /**
     * [getData 拆url]
     * @param  {[string]} url [要拆的url]
     * @return {[obj]}     [obj.对象名]
     */
    function getData(url) {
        var result = {};
        var temp = url.split('?')[1].split('&');
        for (var i in temp) {
            var s = temp[i].split('=');
            result[s[0]] = s[1];
        }
        return result;
    }

    var answerBtn = $('.page1_circle');
    var houseID;

    // 猜3000以下
    $('#priceLow').on('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        var price = $('.activeInfo').find('.price').val();
        houseID = $('.activeInfo').find('.houseid').val();
        if (price < 3000) {
            answerRight();
        }else {
            answerWrong();
        }
    });

    // 猜3000-5000
    $('#priceMed').on('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        var price = $('.activeInfo').find('.price').val();
        houseID = $('.activeInfo').find('.houseid').val();
        if (price >= 3000 && price <= 5000) {
            answerRight();
        }else {
            answerWrong();
        }
    });

    // 猜5000以上
    $('#priceHi').on('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        var price = $('.activeInfo').find('.price').val();
        houseID = $('.activeInfo').find('.houseid').val();
        if (price > 5000) {
            answerRight();
        }else {
            answerWrong();
        }
    });

    // 提示按钮
    $('#priceTip').on('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        var link = $('.activeInfo').find('.link').val();
        location.href = link;
    });

    // 提示按钮
    $('#page4Btn2').on('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        var link = $('.activeInfo').find('.link').val();
        location.href = link;
    });


    // 性别选择
    var gender = $('.gender');
    gender.on('click', function (event) {
        event.stopPropagation();
        $(this).addClass('cur').siblings().removeClass('cur');
    });

    /**
     * [getCoupon 请求优惠券]
     * @param  {[type]} param [phoneStr,pickTime,username,gender]
     */
    var getCoupon = function (param) {
        var urlData = getData(location.href);
        var city = urlData.city || '未获取到';
        $.ajax({
            url: domain + '/huodongAC.d?m=charge',
            type: 'get',
            dataType: 'json',
            data: {
                class: 'OctoberRentloHc',
                phone: param.phoneStr,
                orderTime: param.pickTime,
                userName: param.userName,
                gender: param.gender,
                city: city,
                HouseIdList: houseID
            }
        }).done(function (data) {
            if (data.root.code == '0') {
                $('.wrap').hide();
                $('.page3').fadeIn();
            }else {
                showMsg(data.root.msg);
            }
        }).fail(function (data) {
            showMsg('发生错误：' + data, 1500, location.reload());
        });
    };

    /**
     * 登录
     */
    // 手机号和验证码的验证正则
    var phoneReg = /^(13[0-9]|14[0-9]|15[0-9]|18[0-9]|17[0-9])\d{8}$/i,
        codeReg = /^\d{4}$/;
    // 获取验证码
    var getPhoneVerifyCode = window.getPhoneVerifyCode;
    var getCode = $('#getCode'),
        phone = $('#phone');

    // 设置获取验证码开关
    var allowGet = true;
    var timeCount = 60;
    var loginTimer = null;

    /**
     * 数字补全
     * @param num 数字
     * @returns {string} 两位数字
     */
    function toDou(num) {
        return num < 10 ? '0' + num : num;
    }
    /**
     * 倒计时
     */
    function updateTime() {
        allowGet = false;
        getCode.html('重新发送(' + toDou(timeCount) + ')');
        clearInterval(loginTimer);
        loginTimer = setInterval(function () {
            timeCount--;
            getCode.html('重新发送(' + toDou(timeCount) + ')');
            if (timeCount < 0) {
                clearInterval(loginTimer);
                getCode.html('获取验证码').removeClass('gray_bg');
                timeCount = 60;
                allowGet = true;
            }
        }, 1000);
    }

    // 获取验证码
    getCode.on('touchstart', function () {
        if (allowGet) {
            var phoneStr = phone.val().trim();
            if (!phoneStr) {
                showMsg('请输入手机号');
            }else if (!phoneReg.test(phoneStr)) {
                showMsg('请输入正确的手机号');
            }else{
                getCode.html('60S后获取').addClass('gray_bg');
                // 调用获取验证码插件
                getPhoneVerifyCode(phoneStr, function () {
                    showMsg('验证码发送成功，请注意查收');
                    updateTime();
                }, function (msg) {
                    showMsg(msg);
                });
            }
        }
    });

    // 登录提交
    var sign = $('#page2Btn2'),
        code = $('#vCode');
    var sendVerifyCodeAnswer = window.sendVerifyCodeAnswer;

    // 验证码清空
    code.focus(function () {
        $(this).val('');
    });

    // 登录
    sign.on('click', function (ev) {
        code.blur();
        ev.stopPropagation();
        var pickTime = $('#picktime').val();
        var phoneStr = phone.val().trim();
        var codestr = code.val().trim();
        var userName = $('#userName').val().trim();
        var gender = $('.cur').attr('value');
        var getCouponParam = {
            phoneStr: phoneStr,
            pickTime: pickTime,
            userName: userName,
            gender: gender
        };
        if (!pickTime) {
            showMsg('请选择时间');
        }else if (!userName) {
            showMsg('请输入姓名');
        }else if (!phoneStr) {
            showMsg('请输入手机号');
        }else if (!phoneReg.test(phoneStr)) {
            showMsg('请输入正确的手机号');
        }else if (!codestr) {
            showMsg('请输入验证码');
        }else if (!codeReg.test(codestr)) {
            showMsg('验证码错误');
        }else {
            sendVerifyCodeAnswer(phoneStr, codestr, function () {
                showMsg('预约成功，正在获取优惠券',2500,getCoupon,getCouponParam);
            }, function (msg) {
                showMsg(msg);
            });
        }
    });

    /**
     * 信息弹层
     * @param text 文本内容
     * @param time 显示时间
     * @param callback 回调函数
     */
    var msg = $('#msg'),
        msgP = msg.find('p'),
        timer = null,
        winH = $(window).height();

    function showMsg(text, time, callback, callBackParam) {
        text = text || '信息有误！';
        time = time || 2500;
        msgP.html(text);
        msg.show().css({
            position: 'absolute',
            top: $(document).scrollTop() + winH / 2
        });
        clearTimeout(timer);
        timer = setTimeout(function () {
            msg.fadeOut();
            callback && callback(callBackParam);
        }, time);
    }

    // 点击重新猜测刷新页面
    $('#page4Btn1').on('click', function (event) {
        event.preventDefault();
        location.reload();
    });

    // 轮播，多个房源才调用，
    // 否则如果只有一个房源，就不调用轮播
    if ($('.page1_lb_list').length != 1) {
        $('.page1_lb_ul').slidesjs({
            // 禁用自带导航
            navigation: false,
            // 禁用小圆点
            pagination: false,
            // 用回调切换房屋提示信息
            callback: {
                loaded: function (number) {
                    showInfo(number);
                },
                start: function (number) {
                    hideInfo(number);
                    showInfo(number + 1);
                },
                complete: function (number) {
                }
            }
        });
        // 只有一个房源时，直接显示
        // 做了图片懒加载，所以需要修改图片url所处的属性
    }else {
        var img = $('.page1_lb_list').find('img');
        img.attr('src', img.attr('unload'));
        infoLi.addClass('activeInfo');
    }

    // 时间选择器
    $('#picktime').on('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
    }).date({
        // beginyear: new Date().getFullYear(),
        // curdate: true
    });

    $('.page2_img1').date();


});
