/**
 * 获取楼盘列表页
 */
define('modules/xf/getLpList', ['jquery'],
	function (require) {
		'use strict';
		var $ = require('jquery');
		var vars = seajs.data.vars;
		 
		$('.word a').each(function () {
			$(this).click(function () {
				window.location = '/xf/' + vars.city + '/' + $(this).html() + '.htm';
			});
		});
	}
);