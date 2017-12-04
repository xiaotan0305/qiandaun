/**
 * 新房房源拍卖页
 */
define('modules/xf/getAuctionHouse', ['jquery', 'util/util', 'slideFilterBox/1.0.0/slideFilterBox', 'iscroll/2.0.0/iscroll-lite', 'lazyload/1.9.1/lazyload'], function (require, exports, module) {
    'use strict';
    var $ = require('jquery');
	var vars = seajs.data.vars;
    var Util = require('util/util');
    var sfut = Util.getCookie('sfut');
	var IScroll = require('slideFilterBox/1.0.0/slideFilterBox');
	var IScrolllist = require('iscroll/2.0.0/iscroll-lite');
	var newcode = $('.pm-list-first .img').attr('data-first');
	var lazy = require('lazyload/1.9.1/lazyload');
	// 懒加载
	lazy('img[data-original]').lazyload();

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

	// 剩余时间计算
	function showTime(date) {
		// 开始时间
		var nowDate = new Date();
		// 结束时间
		var closeDate = new Date(date);
		// 时间差的毫秒数
		var timestamp = closeDate.getTime() - nowDate.getTime();
		// 计算出相差天数
		var days = Math.floor(timestamp / (24 * 3600 * 1000));
		// 计算天数后剩余的毫秒数
		var dayLeave = timestamp % (24 * 3600 * 1000);
		// 计算出小时数
		var hours = Math.floor(dayLeave / (3600 * 1000));
		// 计算小时数后剩余的毫秒数
		var houseLeave = dayLeave % (3600 * 1000);
		// 计算相差分钟数
		var minutes = Math.floor(houseLeave / (60 * 1000));
		// 计算分钟数后剩余的毫秒数
		var minutesLeave = houseLeave % (60 * 1000);
		// 计算相差秒数
		var seconds = Math.round(minutesLeave / 1000);
		return {
			timestamp: timestamp,
			days: days < 10 ? '0' + days : days,
			hours: hours < 10 ? '0' + hours : hours,
			minutes: minutes < 10 ? '0' + minutes : minutes,
			seconds: seconds < 10 ? '0' + seconds : seconds
		};
	}

	// 倒计时方法
	function daojishi () {
			var $this = $('.djs');
			if (!$this.attr('yidaoshi')) {
				var daojishiTxt = '',
					showDom = '',
					startTime = showTime($this.attr('starttime-data')),
					time,
					$button = $this.siblings('a');
				// 未开始
				time = startTime;
				if($this.attr('type') == 'end'){
					daojishiTxt = '<em>距结束：</em>';
				}else{
					daojishiTxt = '<em>距开始：</em>';
				}
				$button.html('我要报名');
				if (time) {
					if (time.timestamp > 0) {
						showDom = daojishiTxt + '<em>' + time.days + '</em><i>天</i><em>' + time.hours + '</em><i>时</i><em>' + time.minutes + '</em><i>分</i><em>' + time.seconds + '</em><i>秒</i>';
					} else {
						//showDom = '<em>已结束</em>';
						showDom = '';
						$button.html('已结束').attr('href', 'javascript:void(0);').addClass('gray');
						$this.attr('yidaoshi', true);
					}
					$this.html(showDom);
				}
			}
	}
	// 每秒循环一次
	var sjbInterval = setInterval(function () {
		daojishi();
	}, 1000);

	// 筛选城市
	$('.city-c').on('click', function () {
		$('.cityList').show();
		unable();
		new IScrolllist('.cityList .con', {scrollX: false, scrollY: true});
	});

	// 取消筛选城市
	$('.cancel').on('click', function () {
		$('.cityList').hide();
		enable()
	});

	// 点击筛选城市
	var getAuctionHouse = true;
	$('.sf-bdmenu li').on('click', function (e) {
		var $this = $(this);
		var pramacity = $this.attr('data-city') || '',
			cityName = $this.html();
		if (getAuctionHouse) {
			getAuctionHouse = false;
			$.post('/xf.d?m=getAuctionHouse&city=' + pramacity + '&type=ajax&newcode=' + newcode, function (data) {
				getAuctionHouse = true;
				if (data) {
					$('.initList').html('<ul>' + data + '</ul>');
					$('.city-c').html(cityName);
					$('.cityList').hide();
					enable()
				}
			})
		}
	});



	var $loading = $('.moreList').eq(0);
	var $loadmore = $('.moreList').eq(1);
	// 总条数
	var totalnum = parseInt($('#totalnum').val());
	// 总页数
	var totalPage = Math.ceil(totalnum/10);
	// 当前页码
	var nowPage = 1;
	var isSuc = true;
	// 加载更多方法
	var loadmore = function () {
		if (isSuc && nowPage < totalPage) {
			isSuc = false;
			$loadmore.hide();
			$loading.show();
			$.post('/xf.d?m=getAuctionHouse&city=' + vars.city + '&type=ajax&pageindex=' + (nowPage + 1) + '&pagesize=' + 10, function (data) {
				isSuc = true;
				if (data) {
					$('.initListUl').append(data);
					lazy('img[data-original]').lazyload();
					nowPage++;
					$loading.hide();
					if (nowPage < totalPage) {
						$loadmore.show();
					}
				}
			});
		}
	};

	// 判断是否显示加载更多按钮
	if (totalnum > 10) {
		$loadmore.show();
		// 下拉加载更多
		$(document).on('touchmove', function () {
			var srollPos = $(document).scrollTop();
			if (srollPos >= $(document).height() - $(window).height()) {
				loadmore();
			}
		});
		// 点击加载更多
		$loadmore.on('click', function () {
			loadmore();
		})
	}

	// 点击拍卖规则
	$('.more-gz').on('click', function () {
		$('.rule').show();
		unable();
		// 拍卖规则滑动
		IScroll.refresh('.overCont');
	});

	// 关闭拍卖规则
	$('.rule .close, .rule .btns').on('click', function () {
		$('.rule').hide();
		enable()
	});

	

	// 其他特价房滑动
	if ($('.tjf-list-other').length) {
		$('.tjf-list-other ul').width($('.tjf-list-other li').length * 127 + 16);
		new IScrolllist('.tjf-list-other', {scrollX: true, scrollY: false});
	}

	require.async('//clickm.fang.com/click/new/clickm.js', function () {
		Clickstat.eventAdd(window, 'load', function (e) {
			Clickstat.batchEvent('wapxfpai_','');
		})
	});
});
