define('modules/xf/hotActivityList', [
    'jquery',
    'util/util',
    'superShare/1.0.1/superShare',
    'modules/xf/shadowCall',
    'modules/xf/workbench',
    'modules/xf/xfactivity',
	'search/newHouse/newHouseSearch',
    'weixin/2.0.0/weixinshare',
    'modules/xf/showBonus'
], function (require, exports, module) {
    'use strict';
	
	$('.v').each(function(){
		$(this).on('click',function(){
			window.location.href = $(this).attr('data-href');
		});
	});
	
		
	
});
