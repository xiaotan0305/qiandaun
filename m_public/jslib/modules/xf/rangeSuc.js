/**
 * 出价成功页
 */
define('modules/xf/rangeSuc', ['jquery', 'util/util', 'swipe/3.10/swiper', 'iscroll/2.0.0/iscroll-lite'], function (require) {
	'use strict';
	var $ = require('jquery');
	var vars = seajs.data.vars;
	var Util = require('util/util');
	var sfut = Util.getCookie('sfut');

	$('input[value="继续出价"]').on('click', function () {
		location.href = '/xf.d?m=rangeList&houseId=' + vars.houseid + '&city=' + vars.city;
	});
	$('input[value="返回拍卖详情页"]').on('click', function () {
		location.href = '/xf/paimai/' + vars.city + '/' + vars.houseid + '.htm';
	});
});
