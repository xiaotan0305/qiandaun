define('modules/xf/middlePage',['jquery','util/util','app/1.0.0/appdownload'], function (require) {
    'use strict';
    var $ = require('jquery');
	var vars = seajs.data.vars;

	var ua = navigator.userAgent; 
	
	// app下载
	require.async('app/1.0.0/appdownload', function ($) {
		$('.shoucang').openApp({
			position: 'pcXfinfoSC',
			appUrl: vars.appurl,
			universalappurl:vars.universalappurl
		});
		
		$('.dingyue').openApp({
			position: 'pcXfinfoJK',
			appUrl: vars.appurl,
			universalappurl:vars.universalappurl
		});
		
		$('.tel').openApp({
			position: 'pcXfinfoTel',
			appUrl: vars.appurl,
			universalappurl:vars.universalappurl
		});
	});
	
	var url = '';
	var company = '';
	var wxUrl = '';
	if(vars.type == 'shoucang'){
		url = '//download.3g.fang.com/fang_android_31336.apk';
		company = '1336';
		wxUrl = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.soufun.app&ckey=CK1387219945441';
	}else if (vars.type == 'dingyue'){
		url = '//download.3g.fang.com/fang_android_31338.apk';
		company = '1338';
		wxUrl = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.soufun.app&ckey=CK1387219907126';
	}else if (vars.type == 'tel'){
		url = '//download.3g.fang.com/fang_android_31337.apk';
		company = '1337';
		wxUrl = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.soufun.app&ckey=CK1387219907125';
	}
	
	
	//打开页面立即跳转app
	if(ua.match(/Android/i) != null){
		require.async(['app/1.0.6/pctoapp'], function (pctoapp) {
			var config = {
				url : url,
				company : company,
				wxUrl : wxUrl,
				appUrl: vars.appurl,
				universalappurl: vars.universalappurl
			}; 
			pctoapp(config).openApp(); 
		});
	}

	

});