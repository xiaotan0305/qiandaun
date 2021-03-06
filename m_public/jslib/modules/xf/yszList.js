define('modules/xf/yszList',['jquery','util/util', 'superShare/1.0.1/superShare', 'weixin/2.0.0/weixinshare'], function (require) {
    'use strict';
    var $ = require('jquery');
	var vars = seajs.data.vars;

	// 分享功能(新)
	var SuperShare = require('superShare/1.0.1/superShare');
	var config = {
		// 分享内容的title
		title: vars.sharetitle,
		// 分享时的图标
		image: 'https:' + vars.shareimg || '',
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
		imgUrl: 'https:' + vars.shareimg || '',
		lineLink: location.href
	});

	var $loading = $('.moreList');
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
			$loading.show();
			var type = vars.type || '';
			$.post('/xf.d?m=yszList&city=' + vars.city + '&page=' + nowPage + '&type=' + type, function (data) {
				isSuc = true;
				if (data) {
					if (type == 'houseview') {
						var $ul = $('.cityys-list ul');
					} else {
						var $ul = $('.city-z-list ul');
					}
					$ul.append(data);
					nowPage++;
					$loading.hide();
				}
			});
		}
	}

	// 下拉加载更多
	$(document).on('touchmove', function () {
		var srollPos = $(document).scrollTop();
		if (srollPos >= $(document).height() - $(window).height() && srollPos != 0) {
			loadmore();
		}
	});
	
	
	// 统计行为 --------------end
    require.async('//clickm.fang.com/click/new/clickm.js', function () {
        Clickstat.eventAdd(window, 'load', function () {
            if (vars.type == 'houseview') {
                Clickstat.batchEvent('wapxfcityaplist', '');
            } else {
                Clickstat.batchEvent('wapxfcityyslist', '');
            }
        });
    });
    
    // 全国楼盘推app下载
	require.async('app/1.0.0/appdownload', function ($) {
		$('#topDownload').openApp();
	});
	
	var type = vars.type == 'houseview' ? 'xf_lp^hplb_wap' : 'xf_lp^yszlb_wap';
	// 统计行为 --------------start
	require.async('jsub/_vb.js?c='+type);
	require.async('jsub/_ubm.js?_2017102307fdsfsdfdsd', function () {
		_ub.city = vars.ubcity;
		// 业务---WAP端
		_ub.biz = 'n';
		// 方位（南北方) ，北方为0，南方为1
		_ub.location = vars.ublocation;
		// 用户动作（浏览0、搜索1、打电话31、即时通讯24、预约25）
		var b = 0;
		var pTemp = {
			// 所属页面
			'vmg.page': type,
			'vmg.sourceapp':vars.is_sfApp_visit + '^xf'

		};
		// 用户行为(格式：'字段编号':'值')
		var p = {};
		// 若pTemp中属性为空或者无效，则不传入p中
		for (var temp in pTemp) {
			if (pTemp[temp] && pTemp[temp].length > 0) {
				p[temp] = pTemp[temp];
			}
		}
		// 收集方法
		_ub.collect(b, p);
	});
	// 统计行为 --------------end

});