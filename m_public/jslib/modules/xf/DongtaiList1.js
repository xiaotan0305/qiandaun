define('modules/xf/DongtaiList1',['jquery','util/util'], function (require) {
    'use strict';
    var $ = require('jquery');
	var vars = seajs.data.vars;

	$('.cent-nav li').on('click', function () {
		var $this = $(this);
		if (!$this.hasClass('active')) {
			$('.cent-nav li').removeClass('active');
			$this.addClass('active');
			$('.main section').hide();
			$('.main section').eq($this.index()).show();
		}
	});

	var $loading = $('.moreList');
	// 总条数
	var totalnum = parseInt(vars.total) || 0;
	// 总页数
	var totalPage = Math.ceil(totalnum/10);
	// 当前页码
	var nowPage = 2;
	var isSuc = true;
	// 加载更多方法
	var loadmore = function () {
		if (isSuc && nowPage <= totalPage) {
			isSuc = false;
			$loading.show();
			$.post('/xf.d?m=getDglistAjax&city=' + vars.city + '&newcode=' + vars.newcode + '&p=' + nowPage, function (data) {
				isSuc = true;
				if (data) {
					$('.PWlist2 ul').append(data);
					nowPage++;
					$loading.hide();
				}
			});
		}
	};

	// 下拉加载更多
	$(document).on('touchmove', function () {
		var srollPos = $(document).scrollTop();
		if (srollPos >= $(document).height() - $(window).height() && $('.cent-nav li').eq(1).hasClass('active')) {
			loadmore();
		}
	});
});