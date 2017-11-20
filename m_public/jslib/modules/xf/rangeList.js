/**
 * 拍卖出价页
 */
define('modules/xf/rangeList', ['jquery', 'util/util', 'swipe/3.10/swiper', 'iscroll/2.0.0/iscroll-lite'], function (require) {
	'use strict';
	var $ = require('jquery');
	var vars = seajs.data.vars;
	var Util = require('util/util');
	var sfut = Util.getCookie('sfut');

	// 选金额
	var jinE = '';
	$('.price-list a').on('click', function () {
		var $this = $(this);
		if ($this.hasClass('on')) {
			$this.removeClass('on');
		} else {
			$('.price-list a').removeClass('on');
			$this.addClass('on');
		}
	});

	// 勾选同意
	var check = false;
	$('.ipt-cb').on('click', function () {
		var $this = $(this);
		if ($this.hasClass('on')) {
			$this.removeClass('on');
			check = false;
		} else {
			$this.addClass('on');
			check = true;
		}
	});

	var flag = true;
	// 点击按钮
	$('input[type="button"]').on('click', function () {
		if (sfut) {
			jinE = ($('.price-list .on').html() || '').replace('元', '');
			if (jinE) {
				if (check) {
					if (flag) {
						flag = false;
						$.post('/xf.d?m=bid', {
							houseId: vars.houseid,
							addPrice: jinE
						}, function (data) {
							if (data.status == '100') {
								location.href = '/xf.d?m=rangeSuc&houseid=' + vars.houseid + '&price=' + jinE + '&city=' + vars.city + '&paiCount=' + data.paiCount;
							} else {
								alert(data.msg);
							}
							setTimeout(function () {
								flag = true;
							}, 1000)
						})
					}
				} else {
					alert('请勾选拍卖协议');
				}
			} else {
				alert('请选择加价金额');
			}
		} else {
			window.location.href = 'https://m.fang.com/passport/login.aspx?burl=' + encodeURIComponent(location.origin + '/xf/paimai/' + vars.city + '/' + vars.houseid + '.htm');
		}
	})
});
