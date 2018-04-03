/**
 * wap开盘预告页
 */
define('modules/xf/getwapztList', ['jquery', 'loadMore/1.0.1/loadMore', 'superShare/1.0.1/superShare', 'weixin/2.0.0/weixinshare'], function (require) {
	'use strict';
	var $ = require('jquery');
	var vars = seajs.data.vars;
	 // 加载更多
    var loadMore = require('loadMore/1.0.1/loadMore');
	// 分享功能(新)
	var SuperShare = require('superShare/1.0.1/superShare');
	var $liList = $('.dq-flist3 li');
	var src = '';
	if($liList.length){
		src = $liList.eq(0).find('img').attr('src');
	}
	var config = {
		// 分享内容的title
		title: vars.encity + '新房楼盘推荐，'+vars.encity+'新房排行榜',
		// 分享时的图标
		image:src,
		// 分享内容的详细描述
		desc: '我们为您准备了各个类型的新房楼盘列表，满足各类买房需求，帮您迅速找到想要的新房。',
		// 分享的链接地址
		url: location.href,
		// 分享的内容来源
		from: 'xf'
	};
	var superShare = new SuperShare(config);

	// 微信分享功能
	var wx = require('weixin/2.0.0/weixinshare');
	var weixin = new wx({
		shareTitle: vars.encity + '新房楼盘推荐，'+vars.encity+'新房排行榜',
		descContent: '我们为您准备了各个类型的新房楼盘列表，满足各类买房需求，帮您迅速找到想要的新房。',
		imgUrl: src,
		lineLink: location.href
	});
	
    // 总数
    var kpTotal = vars.count > 0 ? vars.count : 1;
	 loadMore.add({
         // 加载更多接口地址  tag是用来区分用户是否设置过标签,没有设置过要调用不同的接口
         url: '/xf.d?m=getwapztList&city='+vars.city+'&res=json',
         // 每页加载数据条数
         perPageNum: 10,
         // 总数据条数
         total: kpTotal,
         // 当前页加载数据条数
         pagesize: 10,
         // 当前加载更多执行所需的元素实例section
         activeEl: '.ztlist',
         // 根据当前加载更多所需元素实例是否存在该类名决定是否启动加载更多操作
         active: 'active',
         // 加载更多容器的类名或者id或者jquery对象
         content: '.zhuantilb',
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
	 
	 
	
	
	
	 
});
