define('modules/xf/xfinfojmb', [
    'jquery',
    'util/util',
    'iscroll/2.0.0/iscroll',
    'superShare/1.0.1/superShare',
    'chart/line/1.0.7/line',
    'modules/xf/shadowCall',
    'swipe/3.10/swiper',
    'app/1.0.0/appdownload',
    'verifycode/1.0.0/verifycode',
    'lazyload/1.9.1/lazyload',
    'modules/xf/workbench',
    'modules/xf/xfactivity',
	'search/newHouse/newHouseSearch',
    'weixin/2.0.0/weixinshare',
    'modules/xf/showBonus'
], function (require, exports, module) {
    'use strict';
    
    var vars = seajs.data.vars;
	
	var IScrolllist = require('iscroll/2.0.0/iscroll');

	//横幅图片滑动
	$('.x-pic-list ul').width(18 + 12 + $('.x-pic-list').find('li').length * (132 + 10) + 12 + 18);
	if($('.x-pic-list').length > 0){
		var maxX = $('.x-pic-list ul').width() - $('.x-pic-list').width();
		var picIscroll = new IScrolllist('.x-pic-list', {
			scrollX: true,
			scrollY: false,
			checkDOMChanges:true,
			bindToWrapper: true,
			eventPassthrough: true
		});
		picIscroll.on('scrollEnd', function () {
			var x = $('.x-pic-list ul').css('transform').replace(/[^0-9\-,]/g,'').split(',')[4] * -1;
			if(x <= 0){
				$('.x-pic-list .pre').addClass('dis');
			} else if (x >= maxX) {
				$('.x-pic-list .next').addClass('dis');
			}
		});
		picIscroll.on('scrollStart', function () {
			$('.x-pic-list>a').removeClass('dis');
		})
	}
	
	//导航打开
	$('.icon-nav').click(function(){
		$('.x-outBg').show();
		$('.x-out-nav').show();
	});
	
	//导航关闭
	$('.x-outBg , .closedh').click(function(){
		$('.x-out-nav').hide();
		$('.x-outBg').hide();
	});
	
	//置业顾问打开
	$('.icon-share').click(function(){
		$('.x-zygw-out').show();
	});
	
	//置业顾问关闭
	$('.close').click(function(){
		$('.x-zygw-out').hide();
	});
	
	//跳转到置业顾问
	function chatxf(zhcity, city, housetype, houseid, newcode, type, phone, channel, uname, aname, agentid, zhname, agentImg, username, zygwLink) {
		try {
			window.localStorage.foobar = 'foobar';
			var projname = vars.projname;
			var com = '';
			if (vars.xfinfocomarea) {
				com = '[' + vars.xfinfocomarea + ']';
			}
			localStorage.setItem(username + '_allInfo',encodeURIComponent(projname) + ';' + encodeURIComponent(vars.xfinfoprice) + ';' + encodeURIComponent(vars.splitehousefeature) + ';' + vars.xfinfooutdoorpic + ';' + encodeURIComponent(vars.district) + ';' + encodeURIComponent(com + vars.xfinfoaddress) + ';' + 'https://m.fang.com/xf/' + city + '/' + houseid + '.htm');
			localStorage.setItem('fromflag', 'xfinfo');
			
			localStorage.setItem('x:' + username + '',encodeURIComponent(zhname) + ';' + agentImg + ';' + encodeURIComponent(projname + '的') + ';' + zygwLink);
			
			$.ajax({
				url: '/data.d?m=houseinfotj&city=' + city + '&housetype=' + housetype + '&houseid=' + houseid + '&newcode=' + newcode + '&type=' + type + '&phone=' + phone + '&channel=' + channel + '&agentid=' + agentid,
				async: false
			});
			setTimeout(function () {
				
				window.location = '/chat.d?m=chat&username=x:' + uname + '&city=' + city + '&type=wapxf&houseid=' + newcode;
				
			}, 500);
		} catch (_) {
			alert('若为safari浏览器,请关闭无痕模式浏览。');
		}
	}
	
	// 点击置业顾问在线咨询
	$('a[data-name=zygwchatxf]').click(function () {
		zhiyeguwenobj = $(this);
		zhiyeguwenzxzx(zhiyeguwenobj);
	});
	
	// 置业顾问在线咨询方法
	var zhiyeguwenzxzx = function (obj) {
		var yhxw = obj.attr('data-yhxw');
		var charts = obj.attr('data-chatxf').split(';');
		chatxf(charts[0], charts[1], charts[2], charts[3], charts[4], charts[5], charts[6], charts[7],
			charts[8], charts[9], charts[10], charts[11], charts[12], charts[13], charts[14]);
	},
	zhiyeguwenobj;
	
	//杭州头图跳转
	if(vars.city == 'hz'){
		$('.hzimg').click(function(){
			window.location.href = $('#wapjmfxqy_A02_02').attr('href');
		});
	}
	
	//click统计
	 require.async('//clickm.fang.com/click/new/clickm.js', function () {
        Clickstat.eventAdd(window, 'load', function () {
            Clickstat.batchEvent('wapjmfxqy_', vars.city);
        });
    });
		
	
});
