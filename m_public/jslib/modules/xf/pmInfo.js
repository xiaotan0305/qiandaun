/**
 * 拍卖信息页
 */
define('modules/xf/pmInfo', ['jquery', 'util/util', 'swipe/3.10/swiper', 'iscroll/2.0.0/iscroll-lite', 'superShare/1.0.1/superShare', 'weixin/2.0.0/weixinshare'], function (require) {
	'use strict';
	var $ = require('jquery');
	var vars = seajs.data.vars;
	var Util = require('util/util');
	var sfut = Util.getCookie('sfut');

	// 登录后获取用户名，手机号和用户ID
	var userphone, isvalid;

	function getInfo(data) {
		userphone = data.mobilephone || '';
	}

	// 调用ajax获取登陆用户信息
	if (sfut) {
		vars.getSfutInfo(getInfo);
	}

	// 点击我要报名
	var woyaobaoming = function ($this) {
		if (!$this.hasClass('dis')) {
			// 判断是否登录
			if (!sfut) {
				window.location.href = 'https://m.fang.com/passport/login.aspx?burl=' + encodeURIComponent(location.href);
			} else if ($this.html() == '我要报名') {
				window.location.href = '/xf.d?m=pmRegister&houseid=' + vars.houseid + '&city=' + vars.city;
			} else if ($this.html() == '交纳保证金') {
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
						window.location.reload();
					}
				})
			}
		}
	};

	// 判断微信登录后显示蒙层
	function isweixn () {
		var ua = navigator.userAgent.toLowerCase();
		if (ua.match(/MicroMessenger/i) == 'micromessenger') {
			return true;
		} else {
			return false;
		}
	}

	// 按钮为我要报名和交纳保证金时，点击按钮出现蒙屏
	var panduanmengceng = function () {
		if (isweixn() && ($('.button').html().indexOf('我要报名') > -1 || $('.button').html().indexOf('交纳保证金') > -1)) {
			woyaobaoming = function () {
				$('.wxmp').show();
				unable();
			};
			$('.button').attr('href', 'javascript:void(0);');
		}
	};
	panduanmengceng();

	$('.button').on('click', function () {
		var $this = $(this);
		woyaobaoming($this);
	});

	// 头部图片横图拉伸到边缘
	var xqfocusWid = $('.xqfocus').width();
	setTimeout(function () {
		$('.xqfocus img').each(function () {
			var $this = $(this);
			// 如果这张图是横图
			if ($this.width() > $this.height()) {
				$this.width(xqfocusWid);
			}
		});
	}, 500);

	// 头部图片滑动
	var Swiper = require('swipe/3.10/swiper');
	var imageNum = $('.xqfocus img').length;

	new Swiper('.swiper-container-horizontal', {
		speed: 500,
		loop: false,
		onSlideChangeStart: function (swiper) {
			setTab(swiper.activeIndex);
		}
	});

	function setTab(t) {
		// 显示第几张图片
		$('.xqfocus .num').html(t + 1 + '/' + imageNum);
	}

	setTab(0);

	// 拍卖流程可滑动
	var IScrolllist = require('iscroll/2.0.0/iscroll-lite');
	new IScrolllist('.pm-lc-pic', {scrollX: true, scrollY: false});

	// 判断是否超过10行
	if ($('.house-md li').height() > 260) {
		$('.house-md>div').css('max-height', '260px');
		$('.house-md>a').show();
	}
	// 点击下拉按钮
	$('.house-md>a').on('click', function () {
		var $this = $(this);
		if ($this.hasClass('up')) {
			// 收起来
			$('.house-md>div').css('max-height', '260px');
			$this.removeClass('up');
		} else {
			// 展开来
			$('.house-md>div').css('max-height', 'none');
			$this.addClass('up');
		}
	});

	// 判断是否超过5行
	if ($('.pm-gz p').height() > 110) {
		$('.pm-gz>div').css('max-height', '110px');
		$('.hdgz').show();
	}

	// 活动规则下拉按钮
	$('.hdgz').on('click', function () {
		var $this = $(this);
		if ($this.hasClass('up')) {
			// 收起来
			$('.pm-gz>div').css('max-height', '110px');
			$this.removeClass('up');
		} else {
			// 展开来
			$('.pm-gz>div').css('max-height', 'none');
			$this.addClass('up');
		}
	});

	for (var i = 0; i < 5; i++) {
		$('.pm-cj-table li').eq(i).addClass('default');
	}
	var showNum = 5;
	// 点击出价记录下拉按钮
	$('.morePrice').on('click', function () {
		var $this = $(this);
		if ($this.hasClass('up')) {
			// 收起来
			$('.pm-cj-table li:not(".default")').hide();
			$this.removeClass('up');
			showNum = 5;
		} else {
			// 展开来
			$('.pm-cj-table li').show();
			$this.addClass('up');
			showNum = $('.pm-cj-table li').length;
		}
	});

	// 每秒刷新一次列表页
	var freshChujialist = function () {
		$.getJSON('/xf.d?m=getPaiInfo', {
			houseId: vars.houseid
		}, function (data) {
			if (data) {
				// 201：我要报名；
				// 202：交纳保证金；
				// 203：报名成功；
				// 200：我要出价；
				if (data.paiCode == '200') {
					$('.button').removeClass('time');
					$('.button').html('我要出价');
					$('.button').attr('href', '/xf.d?m=rangeList&houseId=' + vars.houseid + '&city=' + vars.city);
					// 205：活动已结束；
				} else if (data.paiCode == '205' || data.paiCode == '') {
					// 已结束
					$('.button').html('活动已结束');
					// 按钮不可点，置灰
					$('.button').addClass('dis');
					$('.button').attr('href', 'javascript:void(0)');
				}

				// 当前参与人数
				var pCount = parseInt(data.pCount);
				// 判断参与人数是数字
				var checkRate = function () {
					// 判断正整数
					var re = /^[1-9]+[0-9]*]*$/;
					if (!re.test(pCount)) {
						pCount = 0;
					}
				};
				checkRate();
				$('.pCount').html(pCount + '人');

				var rangeList = data.rangeList || '';
				var length = rangeList.length;
				if (length > 0) {
					$('.pm-cj-table p').hide();
					$('.pm-cj-table div').show();
				}
				if (length > 5) {
					$('.morePrice').show();
				}
				var html = '';
				for (var i = 0; i < length; i++) {
					var list = rangeList[i];
					var userName = list.userName.substring(0, 1);
					var userTel = '（**' + list.userTel.substring(list.userTel.length - 4) + '）';
					var bidPrice = list.bidPrice;
					var bidTime = list.bidTime;
					var bidState = list.bidState;
					if (i == 0) {
						html = html + '<li> ' +
							'<span>' + userName + userTel + '</span>' +
							'<span>' + bidPrice + '</span>' +
							'<span>' + bidTime + '</span>' +
							'<span> <i class="red-pm">' + bidState + '</i> </span>' +
							'</li>'
					} else if (i < showNum) {
						html = html + '<li> ' +
							'<span>' + userName + userTel + '</span>' +
							'<span>' + bidPrice + '</span>' +
							'<span>' + bidTime + '</span>' +
							'<span> <i class="blue-pm">' + bidState + '</i> </span>' +
							'</li>'
					} else {
						html = html + '<li style="display:none;"> ' +
							'<span>' + userName + userTel + '</span>' +
							'<span>' + bidPrice + '</span>' +
							'<span>' + bidTime + '</span>' +
							'<span> <i class="blue-pm">' + bidState + '</i> </span>' +
							'</li>'
					}
				}
				$('.pm-cj-table ul').html(html);
				for (var i = 0; i < 5; i++) {
					$('.pm-cj-table li').eq(i).addClass('default');
				}
				if (data.paiCode != '205' && data.paiCode != '') {
					setTimeout(function () {
						freshChujialist();
					}, 1000);
				}
			}
		});
		panduanmengceng();
	};
	freshChujialist();

	// 分享新功能
	// 图片：取拍卖后台“效果图”
	// 标题：特价房拍卖+项目名称
	var SuperShare = require('superShare/1.0.1/superShare');
	var config = {
		// 分享内容的title
		title: $('.house-xq-t h1').html().replace(/&nbsp;/ig, '') + '，' + $('.flextable .red-pm').html() + '起拍',
		// 分享时的图标
		image: $('.swiper-wrapper img').eq(1).attr('src'),
		// 分享内容的详细描述
		desc: '房天下特价房拍卖！' + $('.pm-xc').html(),
		// 分享的链接地址
		url: location.href,
		// 分享的内容来源
		from: '房天下'
	};
	var superShare = new SuperShare(config);

	// 微信分享功能
	var wx = require('weixin/2.0.0/weixinshare');
	var weixin = new wx({
		shareTitle: $('.house-xq-t h1').html().replace(/&nbsp;/ig, '') + '，' + $('.flextable .red-pm').html() + '起拍',
		descContent: '房天下特价房拍卖！' + $('.pm-xc').html(),
		imgUrl: 'https:' + $('.swiper-wrapper img').eq(1).attr('src'),
		lineLink: location.href
	});

	$('.wxmp .share-btn').on('click', function () {
		$('.wxmp').hide();
		enable();
	});

	// 阻止页面滑动
	function unable() {
		document.addEventListener('touchmove', preventDefault);
	}
	// 取消阻止页面滑动
	function enable() {
		document.removeEventListener('touchmove', preventDefault);
	}
	function preventDefault(event) {
		event.preventDefault();
	}

	$('.swiper-wrapper a').each(function () {
		var $this = $(this);
		if (!$this.attr('href')) {
			$this.attr('href', 'javascript:void(0);');
		}
	})
});
