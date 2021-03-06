﻿/**
 * wap开盘预告页
 */
define('modules/xf/citykpList', ['jquery', 'loadMore/1.0.1/loadMore', 'superShare/1.0.1/superShare', 'weixin/2.0.0/weixinshare'], function (require) {
	'use strict';
	var $ = require('jquery');
	var vars = seajs.data.vars;
	 // 加载更多
    var loadMore = require('loadMore/1.0.1/loadMore');
	// 分享功能(新)
	var SuperShare = require('superShare/1.0.1/superShare');
	var config = {
		// 分享内容的title
		title: vars.zhcity + '开盘预告：' + vars.count + '个楼盘即将入市',
		// 分享时的图标
		image: 'https:' + $('.cityys-list img:first').attr('src') || '',
		// 分享内容的详细描述
		desc: $('.zhaiyao').html(),
		// 分享的链接地址
		url: location.href,
		// 分享的内容来源
		from: 'xf'
	};
	var superShare = new SuperShare(config);

	// 微信分享功能
	var wx = require('weixin/2.0.0/weixinshare');
	var weixin = new wx({
		shareTitle: vars.zhcity + '开盘预告：' + vars.count + '个楼盘即将入市',
		descContent: $('.zhaiyao').html(),
		imgUrl: 'https:' + $('.cityys-list img:first').attr('src') || '',
		lineLink: location.href
	});
    // 总数
    var kpTotal = vars.count > 0 ? vars.count : 1;
	 loadMore.add({
         // 加载更多接口地址  tag是用来区分用户是否设置过标签,没有设置过要调用不同的接口
         url: '/xf.d?m=citykpList&city='+vars.city+'&type='+vars.type+'&lpdaterange=' + vars.lpdaterange+'&res=json',
         // 每页加载数据条数
         perPageNum: 20,
         // 总数据条数
         total: kpTotal,
         // 当前页加载数据条数
         pagesize: 20,
         // 当前加载更多执行所需的元素实例
         activeEl: '.kplblist',
         // 根据当前加载更多所需元素实例是否存在该类名决定是否启动加载更多操作
         active: 'active',
         // 加载更多容器的类名或者id或者jquery对象
         content: '.kpList',
         // 加载更多按钮的类名或者id或者jquery对象
         moreBtn: '#drag',
         // 提示文案类名或id或者jquery对象
         loadPrompt: '#loading',
  // 加载中显示文案,'正在加载请稍后'为默认
         loadingTxt: '<span><i></i>努力加载中...</span>',
 // 加载完成后显示内容,'加载更多'为默认
         loadedTxt: '<a href="javascript:void(0);" class="bt">查看更多</a>',
         firstDragFlag: false
     });
     loadMore.init();
     

    // 全国楼盘推app下载
	require.async('app/1.0.0/appdownload', function($) {
		$('#topDownload').openApp();
	});
	
	// 统计行为 --------------start
	require.async('jsub/_vb.js?c=xf_lp^kplb_wap');
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
			'vmg.page': 'xf_lp^kplb_wap',
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
