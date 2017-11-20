define('modules/vip/main', ['jquery','loadMore/1.0.0/loadMore','search/search'], function (require) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;
	var totalCount = vars.newsTotal;
	var loadMore = require('loadMore/1.0.0/loadMore');
	loadMore({
		url: vars.vipSite + '?c=vip&a=ajaxGetInfo' + '&city=' + vars.city,
		total: totalCount,
		pagesize: 20,
		pageNumber: 20,
		moreBtnID: '#loadMore',
		loadPromptID: '#loadMore',
		contentID: '.tg-list',
		loadAgoTxt: '<span><i></i>努力加载中...</span>',
		loadingTxt: '<span><i></i>努力加载中...</span>',
		loadedTxt: '<span><i></i>努力加载中...</span>',
		lazyCon: '.img[data-original]',
		firstDragFlag: false
	});
	require.async('navflayer/navflayer_new2');
    // 统计功能
    require.async('count/loadforwapandm.min.js');
    require.async('count/loadonlyga.min.js');
});