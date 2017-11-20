define('modules/xf/showBonus', ['jquery', 'util/util', 'yanzhengma/1.0.0/yanzhengma', 'iscroll/2.0.0/iscroll-lite'], function (require, exports, module) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;
    var Util = require('util/util');
    var sfut = Util.getCookie('sfut');
    var IScroll = require('iscroll/2.0.0/iscroll-lite');
    var loginphone = '';
    var isvalid = '';
    var holdTime = '';
    var openPageCount = '';
    var OpenCountEveryday = '';

    // 阻止页面滑动
    function unable() {
        document.addEventListener('touchmove', preventDefault);
    }

    function preventDefault(e) {
        e.preventDefault();
    }

    // 取消阻止页面滑动
    function enable() {
        document.removeEventListener('touchmove', preventDefault);
    }

    $.post('/xf.d?m=getRedBagStatus&city=' + vars.paramcity, function (data) {
        if (data.root.hbid) {
            holdTime = parseInt(data.root.holdtime);
            openPageCount = parseInt(data.root.openpagecount);
            OpenCountEveryday = parseInt(data.root.opencountperday);
        }

        if (holdTime && openPageCount && OpenCountEveryday) {
            var yanzhengma = function () {
                // 调用ajax获取登陆用户信息
                if (sfut && loginphone) {
                    isvalid = '1';
                }
                // 调用验证码模块
                var yanzhengma = require('yanzhengma/1.0.0/yanzhengma');
                new yanzhengma({
                    // 如果已登录且绑定手机号，值为'1'；否则值为空
                    isvalid: isvalid,
                    // 如果已登录且绑定手机号，值为手机号
                    loginInPhone: loginphone,
                    // 手机号输入框（切图type为num）
                    phoneInput: $('.PhoneNumber'),
                    // 验证码输入框（切图type为num）
                    codeInput: $('.xf-fd-out .VCode'),
                    // 发送验证码按钮
                    sendCodeBtn: $('.GetVCode'),
                    // 提交按钮
                    submitBtn: $('.fd-open'),
                    // 登录后修改手机号时需要显示或隐藏的元素(可多个)
                    showOrHide: $('.xf-fd-out .VCode, .GetVCode'),
                    // 发送验证码按钮变为可点状态的样式（需自定义，可设置css样式，也可addClass,也可不填）
                    sendCodeBtnActive: function () {
                        //$('#send').css({color: '#ff6666'});
                    },
                    // 发送验证码按钮变为不可点状态的样式（需自定义，可设置css样式，也可addClass，也可不填）
                    sendCodeBtnUnActive: function () {
                        //$('#send').css({color: '#565c67'});
                    },
                    // 其他自定义的检测项目(请自定义，如果没有，请return true;)
                    checkOthers: function () {
                        return true;
                    },
                    // 执行请求(请自定义)
                    postJsonData: function () {
                        $.get('/xf.d?m=receiveRedBag', {
                            title: encodeURIComponent(encodeURIComponent($('.xf-fd-out h1').html())),
                            detail: encodeURIComponent(encodeURIComponent($('.xf-fd-out .txt').html())),
                            imgUrl: $('.xf-fd-out .pic-box img').attr('src'),
                            HBId: $('.xf-fd-out .intro').attr('hbid'),
                            picUrl: $('.xf-fd-out .fd-open').attr('data-href')
                        }, function (data) {
                            if (data) {
                                $('.fudaibox').html(data);
                                $('.fd-form-q li').on('click', function () {
                                    location.href = location.protocol + '//' + location.host + '/my/?c=mycenter&a=index&city=' + vars.paramcity;
                                });
                                // 添加滑动
                                var ulHei = 7;
                                $('.fudaidiv li').each(function () {
                                    ulHei = ulHei + 47 + 6;
                                });
                                $('.fudaidiv ul').height(ulHei);
                                var fudaiulhei = window.innerHeight - 200 - 190;
                                if (window.innerHeight < 600) {
                                    if (fudaiulhei < 60) {
                                        $('.fudaidiv').height(60);
                                    } else {
                                        $('.fudaidiv').height(fudaiulhei);
                                    }
                                }
                                if (fudaiulhei > ulHei) {
                                    $('.fudaidiv').height(ulHei);
                                }

                                new IScroll('.fudaidiv', {scrollX: false, scrollY: true, bindToWrapper: true});
                            }
                        });
                    },
                    // 信息提示方法（可选，默认为alert 参数为提示内容）
                    showMessage: function (message) {
                        alert(message);
                    },

                    // 手机号为空时的提示（可选）
                    noPhoneTip: '手机号不能为空，请输入手机号',
                    // 手机号格式错误时的提示（可选）
                    wrongPhoneTip: '手机号格式不正确，请重新输入',
                    // 验证码为空时的提示（可选）
                    noCodeTip: '验证码不能为空，请输入验证码',
                    // 验证码格式错误时的提示（可选）
                    nonstandardCodeTip: '验证码格式不正确，请重新输入',
                    // 验证码与手机号不匹配时的提示（可选）
                    wrongCodeTip: '验证码错误，请重新输入。',
                    // 倒计时样式（可为空,唯一参数值为's'）
                    countdown: ''
                });
            };

            $.get('/xf.d?m=isRedBag', {
                city: vars.paramcity
            }, function (data) {
                if (data) {
                    $('.fudai').append(data);
                    loginphone = $('.PhoneNumber').val();
                    // 点击福袋入口
                    $('.xf-fd-icon').on('click', function () {
                        $('.xf-fd-icon').hide();
                        $('.xf-fd-out').show();
                        unable();
                    });
                    // 关闭福袋
                    $('.xf-fd-out .close').on('click', function () {
                        $('.xf-fd-out').hide();
                        enable();
                    });
                    // 调用验证码方法
                    yanzhengma();

                    // 每天重置日期
                    if (!localStorage.bonusDate || localStorage.bonusDate != new Date().getDate()) {
                        // 日期
                        localStorage.bonusDate = new Date().getDate();
                        // 今日已经浏览的页面个数
                        localStorage.openPageCount = 0;
                        // 今日已经浏览的页面的newcode
                        localStorage.bonusNewcode = '';
                        // 今日已经提示次数
                        localStorage.OpenCountToday = 0;
                    }

                    // 福袋浮标
                    var showfudai = function () {
                        if (localStorage.OpenCountToday < OpenCountEveryday) {
                            $('.xf-fd-icon').show();

                            localStorage.OpenCountToday = parseInt(localStorage.OpenCountToday) + 1;
                        }
                    };

                    // 计时
                    localStorage.setItem('holdTime' + vars.paramid, 0);
                    var timing = setInterval(function () {
                        if (parseInt(localStorage.getItem('holdTime' + vars.paramid)) >= holdTime) {
                            localStorage.setItem('holdTime' + vars.paramid, 0);
                            //　提示
                            showfudai();
                            // 停止计时
                            clearInterval(timing);
                        } else {
                            localStorage.setItem('holdTime' + vars.paramid, parseInt(localStorage.getItem('holdTime' + vars.paramid)) + 1);
                        }
                    }, 1000);

                    // 统计今日已经浏览的页面个数
                    var newcode = vars.houseid;
                    if (localStorage.bonusNewcode.indexOf(newcode) == -1) {
                        localStorage.bonusNewcode = localStorage.bonusNewcode + newcode + ',';
                        localStorage.openPageCount = parseInt(localStorage.openPageCount) + 1;
                    }

                    if (localStorage.openPageCount >= openPageCount) {
                        showfudai();
                    }
                }
            });
        }
    });
});
