/**
 * 新房活动
 * by fcWang (wangfengchao@fang.com)2016年6月16日
 */
define('modules/xf/xfactivity', ['jquery', 'util/util', 'iscroll/2.0.0/iscroll-lite', 'yanzhengma/1.0.0/yanzhengma'], function (require) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;
    var Util = require('util/util');
    var sfut = Util.getCookie('sfut');
    var IScrolllist = require('iscroll/2.0.0/iscroll-lite');
    // 登录后获取用户名，手机号和用户ID
    var userphone, name;

    function getInfo(data) {
        userphone = data.mobilephone || '';
    }

    // 调用ajax获取登陆用户信息
    if (sfut) {
        vars.getSfutInfo(getInfo);
    }

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

    // 关闭底部弹窗
    $('.lp-hd-out').on('click', function (e) {
        var className = e.target.className;
        if (className == 'lp-hd-out' || className == 'close-btn') {
            $('.lp-hd-out').hide();
        }
        enable();
    });
    var scroll = null;

    // 点击优惠券
    $('.huiyuan').on('click', function () {
        unable();
        // 如果只有一个
        if ($('#youhuitanchuang li').length == 1) {
            // 箭头向下
            $('#youhuitanchuang .arr-rt').addClass('down');
            // 展开
            $('#youhuitanchuang li div').show();
        } else {
            // 箭头向下
            $('#youhuitanchuang .arr-rt').removeClass('down');
            // 展开
            $('#youhuitanchuang .arr-rt').siblings().hide();
        }
        $('#youhuitanchuang').show();
        $('#youhuitanchuang .hd-content').attr('id', 'youhuitanchuangul');
        scroll && scroll.destroy();
        scroll = new IScrolllist('#youhuitanchuangul');
    });

    // 优惠券展开 收起
    $('#youhuitanchuang .arr-rt').on('click', function () {
        var $this = $(this);
        scroll && scroll.destroy();
        if ($this.hasClass('down')) {
            $this.removeClass('down').siblings().hide();
        } else if (!$this.hasClass('down')) {
            $this.addClass('down').siblings().show();
        }
        scroll = new IScrolllist('#youhuitanchuangul');
    });

    // 点击秒杀券
    $('.miaosha').on('click', function () {
        unable();
        $('#xianshitanchuang').show();
        $('#xianshitanchuang .hd-content').attr('id', 'xianshitanchuangul');
        new IScrolllist('#xianshitanchuangul');
    });

    //
    var firstClick = true;
    var kanfangtuan = function () {
        $('#kftcodewrite').parent().addClass('kftcodewrite');
        var isvalid = userphone ? 1 : '';
        if (isvalid == 1) {
            $('#kftphone').attr('value', userphone);
            $('#kftcode, .kftcodewrite').hide();
        }
        $('#kftframe').css({'z-index': '2001'}).show();
        // 判断是否Safari浏览器
        if (navigator.userAgent.indexOf('Safari') > -1) {
            $('#kftframe').css('position', 'absolute');
            $('#kftframe .tz-con').css('top', $(document).scrollTop() + 139 + 20 + 80 + 'px');
        }
        if (firstClick) {
            // 调用验证码模块
            var yanzhengma = require('yanzhengma/1.0.0/yanzhengma');
            new yanzhengma({
                // 如果已登录且绑定手机号，值为'1'；否则值为空
                isvalid: isvalid,
                // 如果已登录且绑定手机号，值为手机号
                loginInPhone: userphone,
                // 手机号输入框（切图type为num）
                phoneInput: $('#kftphone'),
                // 验证码输入框（切图type为num）
                codeInput: $('#kftcodewrite'),
                // 发送验证码按钮
                sendCodeBtn: $('#kftcode'),
                // 提交按钮
                submitBtn: $('.kftsubmit'),
                // 登录后修改手机号时需要显示或隐藏的元素(可多个)
                showOrHide: $('#kftcode, .kftcodewrite'),
                // 发送验证码按钮变为可点状态的样式（需自定义，可设置css样式，也可addClass,也可不填）
                sendCodeBtnActive: function () {
                    $('#kftcode').css({
                        color: '#ff6666',
                        border: '1px solid #ff6666'
                    });
                },
                // 发送验证码按钮变为不可点状态的样式（需自定义，可设置css样式，也可addClass，也可不填）
                sendCodeBtnUnActive: function () {
                    $('#kftcode').css({
                        color: '#565c67',
                        border: '1px solid #565c67'
                    });
                },
                // 其他自定义的检测项目(请自定义，如果没有，请return true;)
                checkOthers: function () {
                    if ($('#kftname').val().replace(/\s+/g, '')) {
                        name = encodeURIComponent(encodeURIComponent($('#kftname').val()));
                        var re = /^[1-9]+[0-9]*]*$/;
                        if (re.test($('#kftnum').val()) && $('#kftnum').val() < 100) {
                            return true;
                        } else {
                            showMessage('请输入正确的报名人数(1-99)');
                            return false;
                        }
                    } else {
                        showMessage('请填写姓名');
                        return false;
                    }
                },
                // 执行请求(请自定义)
                postJsonData: function () {
                    $.getJSON('/xf.d?m=kftSignUp', {
                        phone: $('#kftphone').val(),
                        vcode: '',
                        usercount: $('#kftnum').val(),
                        username: name,
                        city: vars.paramcity,
                        lineid: $('#lineid').val(),
                        lookhouseid: $('#lookhouseid').val(),
                        fromUrl: encodeURIComponent(encodeURIComponent(window.location.href)),
                        maction: vars.maction || ''
                    }, function (data) {
                        // 100:报名成功; '-8'：您已报名过该线路; '-10':您已报名过同一时间的其他线路啦
                        if (parseInt(data.root.code) === 100) {
                            showMessage(data.root.message);
                        } else {
                            showMessage(data.root.message);
                        }
                        $('#kftframe').hide();
                        $('#kftcodewrite').val('');
                        enable();
                    });
                },
                // 信息提示方法（可选，默认为alert 参数为提示内容）
                showMessage: function (message) {
                    showMessage(message);
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
                wrongCodeTip: '验证码错误，请重新输入',
                // 倒计时样式（可为空,唯一参数值为's'）
                countdown: ''
            });
            firstClick = false;
        }
    };

    // 关闭看房团
    $('#kftframe').on('click', function (e) {
        // $('#kftcancel').addClass('kftcancel');
        var className = e.target.className;
        if (className == 'kftcancel' || className == 'tz-box') {
            $('#kftframe').hide();
            $('#kftname, #kftnum, #kftphone, #kftcodewrite').val('');
            enable();
        }
    });

    // 信息提示方法
    var hideMessage;
    var showMessage = function (message) {
        $('#favorite_msg').html(message).removeClass('none');
        clearTimeout(hideMessage);
        hideMessage = setTimeout(function () {
            $('#favorite_msg').addClass('none');
        }, 1000);
    };

	$('.paimai').on('click', function () {
		unable();
		$('#xianshitanchuang').show();
		scroll = new IScrolllist('#xianshitanchuang .hd-content');
	});

	// 点击看房(或者专车看房)
	$('.kanfang').on('click', function () {
		unable();
		var kanfangnum = $('#goingtypes').attr('value');
		if (kanfangnum == 2) {
			$('.lp-hd-out').eq(0).show();
		} else {
			var $this = $(this);
			if ($this.hasClass('kanfangtuan')) {
				kanfangtuan();
			} else if ($this.hasClass('zhuanche')) {
				location.href = $this.attr('datahref');
			}
		}
	});

	$('.xxyh li').on('click', function () {
		var $this = $(this);
		if ($this.hasClass('kanfangtuan')) {
			$('.lp-hd-out').hide();
			kanfangtuan();
		} else if ($this.hasClass('zhuanche')) {
			location.href = $this.attr('datahref');
		}
	})
});
