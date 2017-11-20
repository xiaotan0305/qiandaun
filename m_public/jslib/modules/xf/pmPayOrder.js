/**
 * 报名成功页
 */
define('modules/xf/pmPayOrder', ['jquery', 'util/util', 'swipe/3.10/swiper', 'iscroll/2.0.0/iscroll-lite'], function (require) {
	'use strict';
	var $ = require('jquery');
	var vars = seajs.data.vars;
	var Util = require('util/util');
	var sfut = Util.getCookie('sfut');

	$('input[type="button"]').on('click', function () {
		if (sfut) {
			$.getJSON('/xf.d?m=getFormInfo', {
				houseId: vars.houseid
			}, function (data) {
				// 恭喜您！报名成功 交纳保证金
				if (data.status == '100') {
					for (var key in data){
						$('input[name="' + key + '"]').val(data[key]);
					}
					$('#form').submit();
				} else {
					alert(data.msg);
				}
			})
		} else {
			window.location.href = 'https://m.fang.com/passport/login.aspx?burl=' + encodeURIComponent(location.href);
		}
	});

	// 判断微信登录后显示蒙层
	function isweixn () {
		var ua = navigator.userAgent.toLowerCase();
		if (ua.match(/MicroMessenger/i) == 'micromessenger') {
			return true;
		} else {
			return false;
		}
	}
	if (isweixn()) {
		$('.wxmp').show();
		unable();
	}

	// 阻止页面滑动
	function unable() {
		document.addEventListener('touchmove', preventDefault);
	}
	function preventDefault(event) {
		event.preventDefault();
	}
});
