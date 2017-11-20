/**
 * 拍卖注册页
 */
define('modules/xf/pmRegister', ['jquery', 'util/util', 'yanzhengma/1.0.0/yanzhengma'], function (require) {
	'use strict';
	var $ = require('jquery');
	var vars = seajs.data.vars;
	var Util = require('util/util');
	var sfut = Util.getCookie('sfut');

	var requireYzm = function () {
		// 调用验证码模块
		var yanzhengma = require('yanzhengma/1.0.0/yanzhengma');
		new yanzhengma({
			// 如果已登录且绑定手机号，值为'1'；否则值为空
			isvalid: isvalid,
			// 如果已登录且绑定手机号，值为手机号
			loginInPhone: userphone,
			// 手机号输入框（切图type为num）
			phoneInput: $('.userphone'),
			// 验证码输入框（切图type为num）
			codeInput: $('.passcode'),
			// 发送验证码按钮
			sendCodeBtn: $('.getcode'),
			// 提交按钮
			submitBtn: $('.subbtn'),
			// 登录后修改手机号时需要显示或隐藏的元素(可多个)
			showOrHide: $('.getcode, .statecode'),
			// 发送验证码按钮变为可点状态的样式（需自定义，可设置css样式，也可addClass,也可不填）
			sendCodeBtnActive: function () {
				$('.getcode').css({
					color: '#ff5350'
				});
			},
			// 发送验证码按钮变为不可点状态的样式（需自定义，可设置css样式，也可addClass，也可不填）
			sendCodeBtnUnActive: function () {
				$('.getcode').css({
					color: '#565c67'
				});
			},
			// 其他自定义的检测项目(请自定义，如果没有，请return true;)
			checkOthers: function () {
				return(checkName() && chackIdNo());
			},
			// 自定义的勾选检测
		    checkRule: function () {
				return checkCheckbox();
			},
			// 执行请求(请自定义)
			postJsonData: function () {
				$.getJSON('/xf.d?m=pmSignOn', {
					houseid: vars.houseid,
					username: encodeURIComponent(encodeURIComponent($('.username').val())),
					userpid: $('.userinid').val(),
					userphone: $('.userphone').val(),
					city: vars.city
				}, function (data) {
					var code =  data.regCode;
					// 100:报名成功；
					// 101：已报名；
					// 102：报名失败；
					// 103：已缴纳保证金

					// 有订单但没有支付
					if (code == '100') {
						location.href = '/xf.d?m=pmPayOrder' + '&houseid=' + vars.houseid + '&city=' + vars.city;
					} else if (code == '101'){
						location.href = '/xf.d?m=pmPayOrder' + '&houseid=' + vars.houseid + '&city=' + vars.city + '&type=registered';
					} else if (code == '103') {
						alert('你已报名支付成功');
						// 已经有订单并且并且支付，跳拍卖详情
						location.href = '/xf/paimai/' + vars.city + '/' + vars.houseid + '.htm';
					} else {
						alert('报名失败')
					}
				});
			},
			// 信息提示方法（可选，默认为alert 参数为提示内容）
			showMessage: '',
			// 手机号为空时的提示（可选）
			noPhoneTip: '手机号不能为空，请输入手机号',
			// 手机号格式错误时的提示（可选）
			wrongPhoneTip: '手机号格式不正确，请重新输入',
			// 验证码为空时的提示（可选）
			noCodeTip: '验证码不能为空，请输入验证码',
			// 验证码格式错误时的提示（可选）
				nonstandardCodeTip: '验证码格式不正确，请重新输入',
			// 验证码与手机号不匹配时的提示（可选）
			wrongCodeTip: '验证失败，请稍后再试',
			// 倒计时样式（可为空,唯一参数值为's'）
			countdown: 's'
		});
	};

	// 登录后获取用户名，手机号和用户ID
	var userphone, name, isvalid, IdNo;
	function getInfo(data) {
		userphone = data.mobilephone || '';
		isvalid = userphone ? 1 : '';
		requireYzm();
	}
	// 调用ajax获取登陆用户信息
	if (sfut) {
		vars.getSfutInfo(getInfo);
	} else {
		requireYzm();
	}

	// 检测姓名：必填项
	var checkName = function () {
		name = $('.username').val();
		if (name) {
			return true;
		} else {
			alert('请输入姓名');
			return false;
		}
	};
	// 限制姓名最多输入20位
	$('.username').on('input change', function () {
		if ($(this).val().length > 20) {
			$(this).val($(this).val().substr(0, 20));
		}
	});

	// 检测身份证号：必填项，只限填18位数字或字母
	var chackIdNo = function () {
		IdNo = $('.userinid').val();
		var reg = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
		if (IdNo.length == 0) {
			alert('请输入身份证号');
			return false;
		} else if (!reg.test(IdNo)) {
			alert('请输入正确的身份证号');
			return false;
		} else {
			return true;
		}
	};
	// 限制身份证号只能输入18位数字或字母
	$('.userinid').on('input change', function () {
		// 去除非数字
		$(this).val($(this).val().replace(/[^a-zA-Z0-9]/g, ''));
		if ($(this).val().length > 18) {
			// 取前18位
			$(this).val($(this).val().substr(0, 18));
		}
	});

	var checkPhone = function (phone) {
		if (/^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/.test(phone)) {
			return true;
		} else {
			return false;
		}
	};

	// 手机号输入是判断发送验证码按钮状态
	$('.userphone').on('input change', function () {
		if (checkPhone($('.userphone').val().substr(0, 11))) {
			$('.getcode').removeClass('disabled');
		} else {
			$('.getcode').addClass('disabled');
		}
	});

	// 点击勾选同意协议
	var checkCheckbox = function () {
		if ($('.agreebtn').hasClass('on')) {
			return true;
		} else {
			alert('请阅读并同意此协议');
			return false;
		}
	};
	$('.form-xy').on('click', function () {
		var $this = $('.agreebtn');
		if ($this.hasClass('on')) {
			$this.removeClass('on');
		} else {
			$this.addClass('on');
		}
	});

	// 判断是否超过5行
	if ($('.form-gz p').height() > 120) {
		$('.form-gz div').css('max-height', '120px');
		$('.more-word').show();
	}

	// 点击活动规则下拉按钮
	$('.more-word').on('click', function() {
		var $this = $(this);
		if ($this.hasClass('up')) {
			$this.removeClass('up');
			$('.form-gz div').css('max-height', '120px');
		} else {
			$this.addClass('up');
			$('.form-gz div').css('max-height', 'none');
		}
	} );
});