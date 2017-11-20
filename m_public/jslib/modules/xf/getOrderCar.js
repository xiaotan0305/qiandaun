/**
 * 专车看房注册页面
 */
define('modules/xf/getOrderCar', ['jquery', 'util/util', 'yanzhengma/1.0.0/yanzhengma'], function (require, exports, module) {
    'use strict';
    var $ = require('jquery');
	var vars = seajs.data.vars;
    var Util = require('util/util');
    var sfut = Util.getCookie('sfut');
	var name;

	// 检测姓名：必填项
	var checkName = function () {
		name = $('.wname').val();

		var reguname = /^[\u4E00-\u9FA5A-Za-z0-9]+$/;
		if (!name) {
			alert('请输入姓名');
			return false;
		}else if (!reguname.test(name)){
			alert('用户名只能输入汉字、字母、数字');
			return false;
		} else {
			return true;
		}
	};

	var checkPhone = function (phone) {
		if (/^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/.test(phone)) {
			return true;
		} else {
			return false;
		}
	};
	// 手机号输入是判断发送验证码按钮状态
	$('.wtel').on('input change', function () {
		if (checkPhone($('.wtel').val().substr(0, 11))) {
			$('.wgetcode').removeClass('disabled');
		} else {
			$('.wgetcode').addClass('disabled');
		}
	});

	$('.form-list li').eq(2).addClass('codeli');
	var requireYzm = function () {
		// 调用验证码模块
		var yanzhengma = require('yanzhengma/1.0.0/yanzhengma');
		new yanzhengma({
			// 如果已登录且绑定手机号，值为'1'；否则值为空
			isvalid: isvalid,
			// 如果已登录且绑定手机号，值为手机号
			loginInPhone: userphone,
			// 手机号输入框（切图type为num）
			phoneInput: $('.wtel'),
			// 验证码输入框（切图type为num）
			codeInput: $('.wcode'),
			// 发送验证码按钮
			sendCodeBtn: $('.wgetcode'),
			// 提交按钮
			submitBtn: $('.wbuton'),
			// 登录后修改手机号时需要显示或隐藏的元素(可多个)
			showOrHide: $('.codeli'),
			// 发送验证码按钮变为可点状态的样式（需自定义，可设置css样式，也可addClass,也可不填）
			sendCodeBtnActive: function () {
				$('.wgetcode').removeClass('disabled');
			},
			// 发送验证码按钮变为不可点状态的样式（需自定义，可设置css样式，也可addClass，也可不填）
			sendCodeBtnUnActive: function () {
				$('.wgetcode').addClass('disabled');
			},
			// 其他自定义的检测项目(请自定义，如果没有，请return true;)
			checkOthers: function () {
				if (checkName()) {
					return true;
				} else {
					return false;
				}
			},
			// 自定义的勾选检测
			checkRule: function () {
				return true;
			},
			// 执行请求(请自定义)
			postJsonData: function () {
				$.get('/xf.d?m=getCarStatus', {
					cheid: vars.paramid,
					userName: encodeURIComponent(encodeURIComponent(name)),
					tel: $('.wtel').val()
				}, function (data) {
					var status = data.root.status;
					if (status == '100') {
						location.href = '/xf.d?m=confirmOrderCar&cheid=' +  vars.paramid + '&orderid=' + data.root.orderid + '&newcode=' + vars.paramnewcode + '&city=' + vars.paramcity
						+ '&userName=' + name + '&tel=' + $('.wtel').val();
					} else if (status == '101') {
						$('.zckf_tc_p span').html(data.root.contactTel);
						$('.lmted, .mask_50').show();
					} else {
						alert('登录超时，请重新填写');
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
			wrongCodeTip: '验证码错误，请重新输入',
			// 倒计时样式（可为空,唯一参数值为's'）
			countdown: 's'
		});
	};
	$('.lmted input').on('click', function () {
		$('.lmted, .mask_50').hide();
		location.href = '/xf/' + vars.paramcity + '/' + vars.paramnewcode + '.htm';
	});

	// 登录后获取用户名，手机号和用户ID
	var userphone, isvalid;
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
});
