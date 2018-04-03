define('modules/xf/getMarryList',['jquery', 'superShare/1.0.1/superShare','weixin/2.0.0/weixinshare'], function (require) {
    'use strict';
    var $ = require('jquery');

	var title = '2018，我们要结婚啦！';
	var imgUrl = 'http://static.soufunimg.com/common_m/m_public/201511/images/weixinMarry_100x100.jpg';
	var desc = '买套新房好结婚！什么？还没有对象？那也买一套吧，好找对象。';
	
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