define('modules/xf/getWeddingRoomList',['jquery', 'superShare/1.0.1/superShare','weixin/2.0.0/weixinshare'], function (require) {
    'use strict';
    var $ = require('jquery');

	var title = '每个女孩儿都有一个这样的梦';
	var imgUrl = 'http://static.soufunimg.com/common_m/m_public/201511/images/weixinDream_100x100.jpg';
	var desc = '今年的情人节是一个“狂奔在路上”的情人节，最好的礼物莫过于一套婚房，送给心爱的她,让爱不再漂泊。';
	
	// 分享功能(新)
	var SuperShare = require('superShare/1.0.1/superShare');
	var config = {
		// 分享内容的title
		title: title,
		// 分享时的图标
		image: imgUrl,
		// 分享内容的详细描述
		desc: desc,
		// 分享的链接地址
		url: location.href,
		// 分享的内容来源
		from: 'xf'
	};
	var superShare = new SuperShare(config);

	// 微信分享功能
	var wx = require('weixin/2.0.0/weixinshare');
	var weixin = new wx({
		// 分享内容的title
		shareTitle: title,
		// 分享内容的详细描述
		descContent: desc,
		// 分享时的图标
		imgUrl: imgUrl,
		// 分享的链接地址
		lineLink: location.href
	});
});