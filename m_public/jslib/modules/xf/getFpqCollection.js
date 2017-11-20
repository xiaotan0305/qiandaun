/**
 * 房拍圈作品集锦列表页
 */
define('modules/xf/getFpqCollection', ['jquery', 'iscroll/2.0.0/iscroll-lite', 'util/util', 'swipe/3.10/swiper', 'lazyload/1.9.1/lazyload'],
    function (require) {
        'use strict';
        var $ = require('jquery');
        var vars = seajs.data.vars;
		var IScrolllist = require('iscroll/2.0.0/iscroll-lite');
		var lazy = require('lazyload/1.9.1/lazyload');
		// 懒加载
		lazy('img[data-original]').lazyload();
		var city = vars.paramcity;

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

		$('.con li').on('click', function () {
			var $this = $(this);
			location.href = $this.attr('data-href');
		});

		// 筛选
		$('.arr-jump').on('click', function () {
			$('.cityList').show();
			unable();
			new IScrolllist('.con', {scrollY: true});
		});

		// 取消
		$('.cancel').on('click', function () {
			$('.cityList').hide();
			enable();
		});

		// 下拉加载详情页
		$(document).on('touchmove', function () {
			var srollPos = $(document).scrollTop();
			if (srollPos >= $(document).height() - $(window).height()) {
				loadmore();
			}
		});

		var totalPage = Math.ceil($('input[allresultnumh]').attr('allresultnumh')/10);
		var nowPage = 2;
		var $loading = $('.moreList').eq(0);
		var $loadmore = $('.moreList').eq(1);

		if(totalPage <= 1) {
			$loadmore.hide();
		}
		// 加载更多的方法
		var isSuc = true;
		var loadmore = function () {
			if (isSuc && nowPage <= totalPage) {
				isSuc = false;
				$loadmore.hide();
				$loading.show();
				$.post('/xf.d?m=getFpqCollection', {
					city: city,
					page: nowPage,
					pagesize: 10,
					ajax: 'ajax'
				}, function (data) {
					isSuc = true;
					if (data) {
						$('.zpjj ul').append(data);
						nowPage++;
						$loading.hide();
						if (nowPage <= totalPage) {
							$loadmore.show();
						}
						// 懒加载
						lazy('img[data-original]').lazyload();
					}
				});
			}
		};

		$loadmore.on('click', function () {
			loadmore();
		})
    }
);