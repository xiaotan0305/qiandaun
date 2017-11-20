/**
 * 周边职业顾问列表页
 */
define('modules/xf/getZhouBianGWList', ['jquery', 'util/util'], function (require) {
	'use strict';
	var $ = require('jquery');
	var vars = seajs.data.vars;
	var Util = require('util/util');
	var sfut = Util.getCookie('sfut');

	// 登录后获取用户名，手机号和用户ID
	var userphone;

	function getInfo(data) {
		userphone = data.mobilephone || '';
	}

	// 调用ajax获取登陆用户信息
	if (sfut) {
		vars.getSfutInfo(getInfo);
	}

	// 下拉加载详情页
	$(document).on('touchmove', function () {
		var srollPos = $(document).scrollTop();
		if (srollPos >= $(document).height() - $(window).height()) {
			loadmore();
		}
	});

	var totalPage = Math.ceil($('input[allresultnum]').attr('allresultnum')/20);
	var nowPage = 2;
	var $loading = $('.moreList').eq(0);
	var $loadmore = $('.moreList').eq(1);

	if(totalPage <= 1) {
		$loadmore.hide();
	} else {
		$loadmore.show();
	}
	// 加载更多的方法
	var isSuc = true;
	var loadmore = function () {
		if (isSuc && nowPage <= totalPage) {
			isSuc = false;
			$loadmore.hide();
			$loading.show();
			$.post('/xf.d?m=getZhouBianGWList', {
				city: vars.paramcity,
				newcode: vars.paramnewcode,
				pageIndex: nowPage,
				pageSize : 20,
				ajax: 'ajax'
			}, function (data) {
				isSuc = true;
				if (data) {
					$('.zygw-list ul').append(data);
					nowPage++;
					$loading.hide();
					if (nowPage <= totalPage) {
						$loadmore.show();
					}
				}
			});
		}
	};

	$loadmore.on('click', function () {
		loadmore();
	});

	function chatxf(zhcity, city, housetype, houseid, newcode, type, phone, channel, uname, aname, agentid, zhname, agentImg, username, zygwLink) {
		try {
			window.localStorage.foobar = 'foobar';
			var projname = $('#projname').html();
			var com = '';
			if (vars.xfinfocomarea) {
				com = '[' + vars.xfinfocomarea + ']';
			}
			localStorage.setItem(username + '_allInfo',
				encodeURIComponent(projname) + ';' + encodeURIComponent($('#price').text().trim()) + ';' + encodeURIComponent(vars.splitehousefeature) + ';' + vars.xfinfooutdoorpic + ';' + encodeURIComponent($('#district').html()) + ';' + encodeURIComponent(com + vars.xfinfoaddress) + ';' + 'https://m.fang.com/xf/' + city + '/' + houseid + '.htm');
			localStorage.setItem('fromflag', 'xfinfo');
			if (vars.sfbzygwlength == '0') {
				localStorage.setItem('x:' + username + '',
					encodeURIComponent(zhname) + ';' + agentImg + ';' + encodeURIComponent(projname + '的') + ';' + zygwLink);
			} else {
				localStorage.setItem(username + '',
					encodeURIComponent(zhname) + ';' + agentImg + ';' + encodeURIComponent(projname + '的') + ';' + zygwLink);
			}
			$.ajax({
				url: '/data.d?m=houseinfotj&city=' + city + '&housetype=' + housetype + '&houseid=' + houseid + '&newcode=' + newcode + '&type=' + type + '&phone=' + phone + '&channel=' + channel + '&agentid=' + agentid,
				async: false
			});
			setTimeout(function () {
				if(vars.sfbzygwlength == '0') {
					window.location = '/chat.d?m=chat&username=x:' + uname + '&city=' + city + '&type=wapxf&houseid=' + newcode;
				} else {
					window.location = '/chat.d?m=chat&username=' + uname + '&city=' + city + '&type=wapxf&houseid=' + newcode;
				}
			}, 500);
		} catch (_) {
			alert('若为safari浏览器,请关闭无痕模式浏览。');
		}
	}

	var zhiyeguwenzxzx = function (obj) {
			var yhxw = obj.attr('data-yhxw');
			var charts = obj.attr('data-chatxf').split(';');
			chatxf(charts[0], charts[1], charts[2], charts[3], charts[4], charts[5], charts[6], charts[7],
				charts[8], charts[9], charts[10], charts[11], charts[12], charts[13], charts[14]);
		};

	// 在线咨询
	$('.main').on('click','.zbzygwzixun', function () {
		var $this = $(this);
		if (sfut) {
			zhiyeguwenzxzx($this);
		} else {
			window.location.href = 'https://m.fang.com/passport/login.aspx?burl=' + encodeURIComponent(location.href);
		}
	})
});
