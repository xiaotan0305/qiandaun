define('modules/xf/newPrivilege', ['jquery', 'util/util', 'app/1.0.0/appdownload', 'superShare/1.0.1/superShare', 'weixin/2.0.0/weixinshare',
		'chart/pie/1.0.0/pie', 'swipe/3.10/swiper', 'iscroll/2.0.0/iscroll-lite'],
    function (require) {
        'use strict';
        var $ = require('jquery');
        var vars = seajs.data.vars;
		var Util = require('util/util');
		var sfut = Util.getCookie('sfut');

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

		$('.xqfocus').height('300px');
		$('.xqfocus img').each(function () {
			var $this = $(this);
			if ($this.height() >= $this.width()) {
				$this.width($this.width() * 300 / $this.height());
			}
			$this.height('300px');
		});

		// 头部图片滑动
		var Swiper = require('swipe/3.10/swiper');
		var allimage = $('#slider img');

		var imgTotal = $('.num').html().split('/')[1] || 0;
		function setTab(t) {
			var img = $(allimage[t + 1]);
			var originalUrl = img.attr('data-original');
			if (originalUrl) {
				img.attr('src', originalUrl).attr('data-original', '');
			}
			// 显示第几张图片
			$('.num').html(t + 1 + '/' + imgTotal);
		}

		new Swiper('.xqfocus', {
			speed: 500,
			loop: false,
			onSlideChangeStart: function (swiper) {
				setTab(swiper.activeIndex);
			}
		});

		// 点击收藏按钮
		$('.icon-fav ').click(function () {
			checkHousingCollection();
		});

		// 收藏
		var myselectId = vars.myselectId;
		var $favoriteMsgId = $('#favorite_msg');

		/*
		 *显示收藏或取消收藏的信息
		 */
		function showMsg(msg) {
			$favoriteMsgId.html(msg).show();
			setTimeout(hideMessage, 1500);
		}

		/*
		 *显示信息
		 */
		function hideMessage() {
			$('#favorite_msg').hide(500);
		}

		// 收藏和取消收藏的ajax请求所公共的参数
		var collectData = {
			userphone: userphone,
			username: username,
			houseId: vars.paramid,
			name: vars.projname,
			address: vars.address,
			city: vars.paramcity,
			fangyuanId: vars.paramhouseId
		};

		/*
		 *点击收藏按钮所执行的方法
		 */
		function checkHousingCollection() {
			if (sfut) {
				collectData.userphone = userphone;
				collectData.username = username;
				if (!myselectId || myselectId < 1) {
					HousingCollection();
				} else {
					delHousingCollection();
				}
			} else {
				// 去登陆
				window.location.href = 'https://m.fang.com/passport/login.aspx?burl=' + encodeURIComponent(location.href);
			}
		}

		/*
		 *收藏方法
		 */
		function HousingCollection() {
			var houseData = {
				face: $('.xqfocus img')[0].src,
				price: vars.xfinfoprice,
				userId: userid || ''
			};
			var data = $.extend(collectData, houseData);
			var url = '/xf.d?m=housingCollection';
			$.ajax({
				type: 'post',
				url: url,
				data: data,
				dataType: 'json',
				async: false,
				success: function (result) {
					if (result.root.result === '100') {
						$('#wapfyxq_B05_02').attr('class', 'icon2 on');
						myselectId = result.root.myselectId;
						showMsg('收藏成功，可在我的新房-收藏查看');
					}
				}
			});
		}

		/*
		 *取消收藏方法
		 */
		function delHousingCollection() {
			var delHouseData = {
				myselectId: myselectId,
				cityName: vars.utf8city,
				userId: userId || ''
			};
			var data = $.extend(collectData, delHouseData);
			var url = '/xf.d?m=delHousingCollection';
			$.ajax({
				type: 'post',
				url: url,
				data: data,
				dataType: 'json',
				async: false,
				success: function (result) {
					if (result.root.result === '100') {
						$('#wapfyxq_B05_02').attr('class', 'icon2');
						myselectId = '';
						showMsg('取消收藏');
					}
				}
			});
		}

		// 加载装修案例
		function loadCaseInfo(e, t) {
			$.get('/xf.d?m=getCaseInfos&newcode=' + e +  '&city=' + t,
				function (e) {
					$('.zxal').html(e).show();
				});
		}
		loadCaseInfo(vars.paramid, vars.paramcity);

		// 楼盘价格走势图效果(北京除外)
		if (vars.paramcity != 'bj') {
			var $zstName = $('.zstName').find('span');
			var newCode = vars.paramid;
			var district = vars.paramdistrict;
			var city = vars.paramcity;
			$.get('/xf.d?m=getLouPanZouShiData&city=' + city + '&newCode=' + newCode + '&district=' + district,
				function (data) {
					if (data.root && data.root.month && data.root.newCodePrice && data.root.districtPrice && data.root.cityPrice) {
						var month = data.root.month.split(',');
						var trendDatas = [],
							getDatas = [];
						// newCodePrice  districtPrice  cityPrice
						// 楼盘数据小于12时
						var loupanArray = data.root.newCodePrice.split(',');
						var tmparr = loupanArray.reverse();
						var newarr = new Array(12);
						for (var i = 0; i < 12; i++) {
							newarr[i] = tmparr[i] || '';
						}
						newarr = newarr.reverse();
						getDatas.push(newarr);
						getDatas.push(data.root.districtPrice.split(',').splice(0, 12));
						getDatas.push(data.root.cityPrice.split(',').splice(0, 12));
						var color = ['#ff6666', '#ff9900', '#a6b5ee'];
						for (var i = 0; i < getDatas.length; i++) {
							var getData = {};
							// 不为空数组
							if (getDatas[i].length > 1) {
								getData.yAxis = getDatas[i];
								getData.color = color[i];
								trendDatas.push(getData);
							} else {
								// 如果没有数据，则把走势图的名称隐藏掉
								$zstName.eq(i).hide();
							}
						}
						// 显示走势的DIV
						$('#lpzs').show();
						// 显示房价入口
						$('.lp-icons').show();
						var $span = $('#wapxfxqy_C16_12').siblings('span').eq(0);
						var $fangjia = $('#wapxfxqy_C16_12');
						$span.hide();
						$fangjia.show();

						var LineChart = require('chart/line/1.0.2/line');
						// 画走势图
						var l = new LineChart({
							id: '#chartCon',
							height: 200,
							width: $(window).width(),
							xAxis: month,
							data: trendDatas
						});
						// 使走势图滚动到最后一个月位置
						l.run();

						// 为房价走势图添加房价入口
						$('#lpzs .mTitle, #lpzs canvas').on('click', function () {
							window.location.href = '/xf/' + vars.paramcity + '/' + vars.paramid + '/fangjia.htm';
						});
					}
				}
			);
		}

		// 向下滑动时相关效果,页面滑动未超过200px时，页面向上滑动元导航慢慢消失，新导航逐渐显示，页面向下滑动，原导航逐渐显示，新导航消失。滑动页面滚动超过200px时新导航固定顶部。
		var headerNav = $('.header');
		function panduannav () {
			if ($('.newNav').is(':hidden')) {
				headerNav.css({
					'position': 'fixed',
					'width': '100%',
					'z-index': '6',
					'opacity': 0,
					'top': 0,
					'padding': 0
				}).show();
				var scrollH = $(window).scrollTop();
				var maxLen = 200;
				// 导航切换效果
				if (scrollH <= 200) {
					headerNav.css('opacity', scrollH / maxLen);
					if (scrollH === 0) {
						headerNav.hide();
					}
					// 向上移动屏幕
				} else {
					headerNav.show();
					headerNav.css('opacity', 1);
				}
			}
		}
		panduannav();
		$(window).on('scroll', function () {
			panduannav();
		});

		$('.icon-nav').on('click', function () {
			if ($('.newNav').is(':hidden')) {
				panduannav();
			} else {
				headerNav.removeClass('fixed').css({
					'position': 'relative',
					'top': 0,
					'opacity': '1'
				});
			}
		});

		// app下载
		require.async('app/1.0.0/appdownload', function ($) {
			$('.ljxz').openApp({
				position: 'xfDetailMid'
			});
		});

		// 分享功能
		var SuperShare = require('superShare/1.0.1/superShare');
		var config = {
			// 分享内容的title
			title: '我发现了一个不错的房源' + $('.share').siblings('h1').html() + ': ',
			// 分享时的图标
			image: window.location.protocol,
			// 分享内容的详细描述
			desc: $('#title').html() + '位于' + vars.xfinfoaddress + ',' + vars.xfinfoprice + ',' + vars.xfinfophone + ',更多详情请点击',
			// 分享的链接地址
			url: location.href + ((location.href.indexOf('?') > -1) ? '&' : '?') + 'userid=' + (userid? userid : ''),
			// 分享的内容来源
			from: 'xf'
		};
		var superShare = new SuperShare(config);

		// 微信分享功能
		var wx = require('weixin/2.0.0/weixinshare');
		var reg = /搜房网/g;
		var weixin = new wx({
			shareTitle: $('title').html().replace(reg, '房天下'),
			descContent: '',
			imgUrl: '',
			lineLink: location.href + ((location.href.indexOf('?') > -1) ? '&' : '?') + 'userid=' + (userid? userid : '')
		});

		// 画饼状图
		if($('.cirque').length){
			var pieColor = ['#ff7070', '#ffae71', '#68c9bf', '#d17ee3'];
			var pieJson = [];
			var counter = 0;
			$('.zxdk-table td[percent]').each(function() {
				var $this =  $(this);
				pieJson.push({
					color: pieColor[counter],
					value: $this.attr('percent')
				});
				counter++;
			});
			require.async('chart/pie/1.0.0/pie',function(pie){
				var dataList = pieJson;
				var arr = [];
				for(var key in dataList){
					arr.push(dataList[key]);
				}
				var p = new pie({
					//容器id
					id: '.cirque',
					//效果类型，暂时只有这一种需要其他类型再扩展
					animateType:'increaseTogether',
					// canvas的高
					height:100,
					// canvas的宽
					width:100,
					//半径
					radius:100,
					//分割份数，即增量的速度
					part:50,
					//空白间隔的大小
					space:2,
					//是否挖空，如果为0则不挖空，否则为挖空的半径
					hollowedRadius:50,
					dataArr: arr
				});
				p.run();
			});
		}

		// 下拉展开收起
		$('.more_xq').each(function () {
			var $this = $(this);
			if ($this.siblings('.xqIntroBox').children().children().height() > 100) {
				$this.show();
			}
		})
		$('.more_xq').on('click', function () {
			var $this = $(this);
			if ($this.hasClass('up')) {
				$this.removeClass('up');
				$this.siblings().css('max-height', '100px');
			} else {
				$this.addClass('up');
				$this.siblings().css('max-height', 'inherit');
			}
		});

		// 最下面的导航-------------satrt
		$('.overboxIn>div').width($('.overboxIn a').length * 64 + 10);
		var IScrolllist = require('iscroll/2.0.0/iscroll-lite');
		new IScrolllist('.overboxIn', {scrollX: true, scrollY: false, bindToWrapper: true, eventPassthrough: true});
		$('.typeListB .swiper-slide, .typeListB .swiper-wrapper').height('inherit');

		var $bottonDiv = $('.overboxIn');
		var $typeList = $('.typeListB');
		$bottonDiv.on('click', 'a', function () {
			var $this = $(this);
			$bottonDiv.find('a').removeClass('active');
			$this.addClass('active');
			$typeList.hide();
			$('.' + $this.attr('id')).show();
			if (!$this.attr('canSwiper')) {
				$this.attr('canSwiper', true);
				addSwiper($this);
			}
		});
		// 列表页底部滑动
		var setpage = function (obj, index) {
			var $span = $(obj).find('.pointBox span');
			$span.removeClass('cur').eq(index).addClass('cur');
		};
		var windoWidth = $(window).width();
		$('.typeListB').each(function () {
			var $this = $(this);
			$this.find('.swiper-wrapper').width(windoWidth * $this.find('.swiper-slide').length);
			$this.find('.swiper-slide').width(windoWidth).height($('.gfzn .swiper-wrapper').height());

		});
		var addSwiper = function (a) {
			new Swiper('.' + a.attr('id'), {
				speed: 500,
				loop: false,
				onSlideChangeStart: function (swiper) {
					setpage('.' + a.attr('id'), swiper.activeIndex);
				}
			});
		};
		addSwiper($('.overboxIn a').eq(0));
		// 最下面的导航-------------------------------------------------end
	}
);