define('modules/xf/getfzxzbItems',['jquery','util/util','superShare/1.0.1/superShare','weixin/2.0.0/weixinshare'], function (require) {
    'use strict';
    var $ = require('jquery');
	var vars = seajs.data.vars;
	
	// 分享功能(新)
	var SuperShare = require('superShare/1.0.1/superShare');
	var config = {
		// 分享内容的title
		title: '副中心搬迁倒计时！盘点副中心周边楼盘',
		// 分享时的图标
		image: 'http://static.soufunimg.com/common_m/m_public/201511/images/750x300_dq.png',
		// 分享内容的详细描述
		desc: '12月20日，北京城市副中心行政办公区即将迎来首批政府机关入驻，通州正式进入副中心时代。',
		// 分享的链接地址
		url: location.href,
		// 分享的内容来源
		from: 'xf'
	};
	var superShare = new SuperShare(config);

	// 微信分享功能
	var wx = require('weixin/2.0.0/weixinshare');
	var weixin = new wx({
		shareTitle: '副中心搬迁倒计时！盘点副中心周边楼盘',
		descContent: '12月20日，北京城市副中心行政办公区即将迎来首批政府机关入驻，通州正式进入副中心时代。',
		imgUrl: 'http://static.soufunimg.com/common_m/m_public/201511/images/750x300_dq.png',
		lineLink: location.href
	});
	
	
});