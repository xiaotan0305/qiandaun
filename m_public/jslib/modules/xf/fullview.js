define('modules/xf/fullview', ['jquery', 'weixin/2.0.0/weixinshare'], function (require) {
    'use strict';
    var $ = require('jquery');
    $('#newheader, .nav-top-box').hide();
    var vars = seajs.data.vars;
    var Weixin = require('weixin/2.0.0/weixinshare');
    // @update tankunpeng 增加微信分享
    new Weixin({
        debug: false,
        shareTitle: vars.shareTitle,
        descContent: vars.descContent,
        lineLink: vars.lineLink,
        imgUrl: vars.imgUrl,
        swapTitle: false
    });
    
    // 统计行为 --------------start
	require.async('jsub/_vb.js?c=xf_lp^qjkf_wap');
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
			'vmg.page': 'xf_lp^qjkf_wap',
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