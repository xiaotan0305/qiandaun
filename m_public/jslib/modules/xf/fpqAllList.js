/**
 * 房拍圈列表页
 */
define('modules/xf/fpqAllList', ['jquery', 'iscroll/2.0.0/iscroll-lite', 'util/util', 'swipe/3.10/swiper'],
    function (require) {
        'use strict';
        var $ = require('jquery');
        var vars = seajs.data.vars;
		var IScrolllist = require('iscroll/2.0.0/iscroll-lite');
		var Util = require('util/util');
		var sfut = Util.getCookie('sfut');

		var city = vars.paramcity;
		var userstatus = vars.userstatus;
		// 登录后获取用户名，手机号和用户ID
		var username, userphone, userid;

		function getInfo(data) {
			username = data.username || '';
			userphone = data.mobilephone || '';
			userid = data.userid || '';
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

		$('.Ptabnav>div>a').on('click', function () {
			$('.Ptabnav>div>a').removeClass('active');
			$(this).addClass('active');
		});

		// 设置可滑动
		if ($('.userscroller').length) {
			$('.user').width($('.userscroller li').length * 135);
			new IScrolllist('.userscroller', {scrollX: true, bindToWrapper: true, eventPassthrough: true});
		}
		if ($('.rulescroller').length) {
			$('.taskFlow').width($('.taskFlow li').length * 82);
			new IScrolllist('.rulescroller', {scrollX: true, bindToWrapper: true, eventPassthrough: true});
		}

		// 点击详细规则
		$('.Ptitle .f13').on('click', function () {
			unable();
			$('.tpgz').show();
			new IScrolllist('.tz1', {scrollX: false, scrollY: true});
		});
		// 点击我知道了
		$('.ok').on('click', function () {
			$('.tz-box').hide();
			enable();
		});

		var totalPageA = Math.ceil($('input[allresultnuma]').attr('allresultnuma')/8);
		var totalPageH = Math.ceil($('input[allresultnumh]').attr('allresultnumh')/8);
		var type = vars.type;
		var totalPage;
		if (type == 'aerial') {
			totalPage = totalPageA;
		} else {
			totalPage = totalPageH;
		}

		var nowPage = 2;
		var $loading = $('.moreList').eq(0);
		var $loadmore = $('.moreList').eq(1);

		if(totalPage <= 1) {
			$loadmore.hide();
		}

		// 加载更多的方法
		var isSuc = true;
		var loadmore = function (type, page) {
			if (isSuc && nowPage <= totalPage) {
				isSuc = false;
				$loadmore.hide();
				$loading.show();
				$.get('/xf.d?m=fpqAllList', {
					type: type,
					city: city,
					page: page,
					pagesize: 8,
					ajax: 'ajax'
				}, function (data) {
					isSuc = true;
					if (data) {
						$('.initList').append(data);
						nowPage++;
						$loading.hide();
						if (nowPage <= totalPage) {
							$loadmore.show();
						}
					}
				});
			}
		};

		// 下拉加载详情页
		$(document).on('touchmove', function () {
			var srollPos = $(document).scrollTop();
			if (srollPos >= $(document).height() - $(window).height()) {
				loadmore(type, nowPage);
			}
		});

		// 点击查看更多
		$('.bt').on('click', function () {
			loadmore(type, nowPage);
		});

		var showMessage = function (message) {
			$('.cflq p').html(message);
			$('.cflq').show();
		};
		// 领取任务的方法
		var canGet = true;
		var getTask = function (city, TaskId, newcode, ProjnName, Type) {
			if (canGet) {
				canGet = false;
				$.get('/xf.d?m=getFpqTask', {
					city: city,
					TaskId: TaskId,
					newcode: newcode,
					ProjnName: ProjnName,
					Type: Type
				}, function (data) {
					canGet = true;
					if (data) {
						var code = data.root.code;
						if (code == '100') {
							// 成功
							$('.lqcg').show();
						}else if (code == '104') {
							showMessage('有效任务不能超过5个，请完成任务后再来！')
						} else if (code == '105') {
							showMessage('您已领取该任务，不能重复领取')
						} else if (code == '111') {
							showMessage('fb用户不能领取任务！');
						} else {
							showMessage('领取失败')
						}
						unable();
					}
				})
			}
		};

		$('.main').on('click', '.gettask', function () {
			// 没登录跳转到登录
			if (sfut) {
				if (userphone) {
					var $this = $(this).parents('.Pbox');
					var city = encodeURIComponent($this.attr('city-data'));
					var TaskId = $this.attr('taskid-data');
					var newcode = $this.attr('newcode-data');
					var ProjnName = encodeURIComponent($this.find('.title').text().trim());
					var Type = $this.attr('type-data');

					// '': 未申请
					// 0：待审核
					// 1：审核通过
					// 2：拒绝通过

					//①如用户是已审核通过状态，点击“领取任务”按钮，弹出领取成功提示，点击“查看我的任务”进入“我的房拍圈”页面
					if (userstatus == '1') {
						if ($(this).hasClass('a-get')) {
							showMessage('该任务已过期或已被领完，您不可以领取！');
						} else {
							getTask(city, TaskId, newcode, ProjnName, Type);
						}
					} else if (userstatus == '') {
						// ②如用户未申请审核即从未申请过入驻，点击“领取任务”按钮弹出加入我们的弹框
						$('.joinUs').show();
					} else if (userstatus == '0' || userstatus == '2') {
						// ③如用户已申请入驻但尚未审核即为待审核状态，点击“领取任务”按钮直接跳转至用户申请页
						window.location.href = location.origin + '/fangpaiquan/register.html?burl=' + encodeURIComponent(location.href);
					}
				} else {
					window.location.href = 'https://m.fang.com/passport/resetmobilephone.aspx?burl=' + encodeURIComponent(location.href);
				}

			} else {
				window.location.href = 'https://m.fang.com/passport/login.aspx?burl=' + location.href;
			}
		});

		// 点击取消
		$('.cancel').on('click', function () {
			$('.tz-box, .cityListA, .cityListH').hide();
			enable();
		});

		// 加入我们（顶部）
		$('.top-join a').on('click', function () {
			if (sfut) {
				// '': 未申请
				// 0：待审核
				// 1：审核通过
				// 2：拒绝通过
				if (userstatus == '') {
					window.location.href = location.origin + '/fangpaiquan/register.html?burl=' + encodeURIComponent(location.href);
				}
			} else {
				window.location.href = 'https://m.fang.com/passport/login.aspx?burl=' + location.href;
			}
		});

		// 加入我们
		$('.jrwm').on('click', function () {
			// 判断是否登录
			if (sfut) {
				// 判断是否绑定手机号
				if (userphone) {
					window.location.href = location.origin + '/fangpaiquan/register.html?burl=' + encodeURIComponent(location.href);
				} else {
					window.location.href = 'https://m.fang.com/passport/resetmobilephone.aspx?burl=' + encodeURIComponent(location.href);
				}
			} else {
				window.location.href = 'https://m.fang.com/passport/login.aspx?burl=' + location.href;
			}
		});

		// 头部图片滑动
		//$('.banner').css({overflow: 'hidden'});
		var Swiper = require('swipe/3.10/swiper');
		var allimage = $('.banner img');
		var imgHei = $('.banner').height();
		allimage.each(function () {
			var $this = $(this);
			$this.height(imgHei);
		});
		new Swiper('.banner', {
			speed: 500,
			loop: false,
			onSlideChangeStart: function (swiper) {
				//setTab(swiper.activeIndex);
			}
		});

		// 点击全国
		$('.cityListA .con').addClass('shaixuanA');
		$('.cityListH .con').addClass('shaixuanH');
		$('.arr-jump').on('click', function () {
			unable();
			if (type == 'aerial') {
				$('.cityListA').show();
				new IScrolllist('.shaixuanA', {scrollX: false, scrollY: true});
			} else {
				$('.cityListH').show();
				new IScrolllist('.shaixuanH', {scrollX: false, scrollY: true});
			}
		});

		// 点击加入我们
		$('.register').on('click', function () {
			window.location.href = location.origin + '/fangpaiquan/register.html?burl=' + encodeURIComponent(location.href);
		})
    }
);