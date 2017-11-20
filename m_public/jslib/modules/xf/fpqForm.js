/**
 * 房拍圈申请页
 */
define('modules/xf/fpqForm', ['jquery', 'util/util'],
    function (require) {
        'use strict';
        var $ = require('jquery');
        var vars = seajs.data.vars;
		var Util = require('util/util');
		var sfut = Util.getCookie('sfut');

		var href = vars.burl || (location.origin + '/fangpaiquan/alllist.html');

		// 登录后获取用户名，手机号和用户ID
		var username, userphone, userid;
		function getInfo(data) {
			username = data.username || '';
			userphone = data.mobilephone || '';
			userid = data.userid || '';
			if (!userphone) {
				window.location.href = 'https://m.fang.com/passport/resetmobilephone.aspx?burl=' + encodeURIComponent(location.href);
			} else {
				// 弹出重要通知
				$('.zytz').show();
				unable();
			}
		}

		// 调用ajax获取登陆用户信息
		if (sfut) {
			vars.getSfutInfo(getInfo);
		} else {
			window.location.href = 'https://m.fang.com/passport/login.aspx?burl=' + encodeURIComponent(location.href);
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

		var name = '',
			address = '',
			IdNo = '',
			tel = '',
			eMail = '',
			link = '';

		// 检测姓名：必填项
		var checkName = function () {
			name = $('.realname').val();
			if (name) {
				return true;
			} else {
				alert('请输入姓名');
				return false;
			}
		};
		// 限制姓名最多输入20位
		$('.realname').on('input change', function () {
			// 去除非数字
			if ($(this).val().length > 20) {
				// 取前11位
				$(this).val($(this).val().substr(0, 20));
			}
		});

		// 检测居住地/可拍摄城市：必填项
		var chackAddress = function () {
			address = $('.residence').val();
			if (address) {
				return true;
			} else {
				alert('请输入城市');
				return false;
			}
		};

		// 检测身份证号：必填项，只限填18位数字或字母
		var chackIdNo = function () {
			IdNo = $('.id_card').val();
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
		$('.id_card').on('input change', function () {
			// 去除非数字
			$(this).val($(this).val().replace(/[^a-zA-Z0-9]/g, ''));
			if ($(this).val().length > 18) {
				// 取前11位
				$(this).val($(this).val().substr(0, 18));
			}
		});

		// 团队/公司名称：非必填项

		// 检测手机号：必填项，只限填11位数字
		var chackTel = function () {
			tel = $('.telephone').val();
			var reg = /^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
			if (tel.length == 0) {
				alert('请输入手机号');
				return false;
			} else if (!reg.test(tel)) {
				alert('请输入正确的手机号');
				return false;
			} else {
				return true;
			}
		};
		// 限制手机号只能输入11位数字
		$('.telephone').on('input change', function () {
			// 去除非数字
			$(this).val($(this).val().replace(/[^\d]/g, ''));
			if ($(this).val().length > 11) {
				// 取前11位
				$(this).val($(this).val().substr(0, 11));
			}
		});

		// 检测电子邮箱：非必填项
		var chackEmail = function () {
			eMail = $('.mail').val();
			var reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
			if (reg.test(eMail) || eMail.length == 0) {
				return true;
			} else {
				alert('请输入正确的电子邮箱');
				return false;
			}
		};

		// 检测QQ号码：非必填项
		// 限制QQ最多20位数字
		$('.QQnum').on('input change', function () {
			// 去除非数字
			$(this).val($(this).val().replace(/[^\d]/g, ''));
			if ($(this).val().length > 20) {
				// 取前11位
				$(this).val($(this).val().substr(0, 20));
			}
		});
		// 检测个人微信号：非必填项
		// 检测飞行器型号：非必填项
		// 检测相机型号、镜头/云台型号：非必填项

		// 检测作品链接：必填项，只限填合法地址
		var checkLink = function () {
			link = $('.productlink').val();
			var reg = /.*[\u4e00-\u9fa5]+.*$/;
			if (link.length == 0) {
				alert('请输入已有的作品链接');
				return false;
			} else if (reg.test(link)) {
				alert('请输入正确的作品链接');
				return false;
			} else {
				return true;
			}
		};

		// 检测是否勾选
		var checkCheckbox = function () {
			if ($("input[type='checkbox']").is(':checked')) {
				return true;
			} else {
				alert('请同意免责声明');
				return false;
			}
		};

		// 点击勾选
		$('input[type=checkbox]').on('click', function () {
			if ($("input[type='checkbox']").is(':checked')) {
				$('.submit').removeClass('active');
			} else {
				$('.submit').addClass('active');
			}
		});

		// 点击免责声明
		$('.agree').on('click', function () {
			$('.mzsm').show();
		});

		// 点击提交按钮
		var cantijiao = true;
		$('.submit').on('click', function () {
			if (checkName() && chackAddress() && chackIdNo() && chackTel() && chackEmail() && checkLink() && checkCheckbox()) {
				cantijiao = false;
				$.get('/xf.d?m=uploadFpqForm', {
						realname: encodeURIComponent(name),
						id_card	: IdNo,
						telephone: tel,
						productlink	:encodeURIComponent(link),
						QQnum: $('.QQnum').val(),
						weixin: $('.weixin').val(),
						mail: encodeURIComponent($('.mail').val()),
						airStyle: encodeURIComponent($('.airStyle').val()),
						cameraStyle: encodeURIComponent($('.cameraStyle').val()),
						residence: encodeURIComponent(address),
						companyName: encodeURIComponent($('.companyName').val())
					}, function (data) {
						cantijiao = true;
						if (data) {
							// 注册成功
							if (data.root.code == '100') {
								$('.success').show();
							} else {
								// 103 该用户已注册成功，或正在等待审核
								alert(data.root.message);
							}
						} else {
							alert('提交失败，请稍后重试');
						}
					}
				)
			}
		});

		// 点击 我知道了 按钮
		$('.mzsm .ok').on('click', function () {
			$('.tz-box').hide();
			// 判断免责声明是否勾选
			if (!$("input[type='checkbox']").is(':checked')) {
				$('input[type=checkbox]').click();
			}
		});
		$('.success .ok').on('click', function () {
			location.href = href;
		});


		$('.zytz .ok').on('click', function () {
			$('.zytz').hide();
			enable();
		});

		$('.changeNum').on('click', function () {
			window.location.href = 'https://m.fang.com/passport/resetmobilephone.aspx?burl=' + encodeURIComponent(location.href);
		})
    }
);