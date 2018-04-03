define('modules/xf/getwapztInfo',['jquery','util/util', 'superShare/1.0.1/superShare', 'weixin/2.0.0/weixinshare','app/1.0.0/appdownload', 'iscroll/2.0.0/iscroll-lite'], function (require) {
    'use strict';
    var $ = require('jquery');
	var vars = seajs.data.vars;
	
	// 获取滑动插件类
	var IScrollLite = require('iscroll/2.0.0/iscroll-lite');

	// 分享功能(新)
	var SuperShare = require('superShare/1.0.1/superShare');
	var config = {
		// 分享内容的title
		title: vars.sharetitle,
		// 分享时的图标
		image: vars.shareimg || '',
		// 分享内容的详细描述
		desc: vars.sharecontent,
		// 分享的链接地址
		url: location.href,
		// 分享的内容来源
		from: 'xf'
	};
	var superShare = new SuperShare(config);

	// 微信分享功能
	var wx = require('weixin/2.0.0/weixinshare');
	var weixin = new wx({
		shareTitle: vars.sharetitle,
		descContent: vars.sharecontent,
		imgUrl: vars.shareimg || '',
		lineLink: location.href
	});
	
	// 横切滑动
	var $lixf = $('.hengqie');
	if ($lixf.length) {
		var dlwidth = 0;
		$lixf.find('dd').each(function () {
			var $this = $(this);
			dlwidth += ($this.width() + 20);
		});
		$lixf.find('dl').width(dlwidth);
		var tjfScroll = new IScrollLite('.hengqie', {
			// 开启横向滑动
			scrollX: true,
			// 禁止纵向滑动
			scrollY: false,
			// 滑动为其本身，这里的作用是防止禁用掉整个文档流的默认事件导致的bug
			bindToWrapper: true,
			// 可以纵向滑动，默认能够穿过
			eventPassthrough: true
		});
		tjfScroll.refresh();
	}
	
	$('.morelplist').click(function(){
		window.location.href = $(this).attr('data-href');
	});
	
	
	// 下拉加载更多
	$(document).on('touchmove', function () {
		var srollPos = $(document).scrollTop();
		if (srollPos >= $(document).height() - $(window).height() && srollPos != 0) {
			loadmore();
		}
	});
	
	
	// 总条数
	var totalnum = parseInt(vars.count) || 0;
	// 总页数
	var totalPage = Math.ceil(totalnum/20);
	// 当前页码
	var nowPage = 2;
	var isSuc = true;
	// 加载更多方法
	
	
	function loadmore () {
		if (isSuc && nowPage <= totalPage) {
			isSuc = false;
			$.post('/xf.d?m=getwapztInfo&city=' + vars.city + '&page=' + nowPage + '&id=' + vars.id, function (data) {
				if (data) {
					var $ul = $('.dq-flist');
					$ul.append(data);
					nowPage++;
					isSuc = true;
				}
			});
		}
	}
	
	// app下载
	require.async('app/1.0.0/appdownload', function ($) {
		$('.btn-down').openApp({
			position: 'xfinfoAI'
		});
	});

	

});