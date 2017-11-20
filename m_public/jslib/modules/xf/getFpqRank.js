/**
 * 房拍圈房拍达人
 */
define('modules/xf/getFpqRank', ['jquery', 'swipe/3.10/swiper'],
    function (require) {
        'use strict';
        var $ = require('jquery');
		var Swiper1 = require('swipe/3.10/swiper');

		var setTab = function (obj, index) {
			obj.find('.add').html(index);
		};

		$('.swiper-container-horizontal').each(function () {
			var $this = $(this);
			var id = $this.attr('id');
			new Swiper1('#' + id, {
				speed: 500,
				loop: false,
				onSlideChangeStart: function (swiper) {
					setTab($this, swiper.activeIndex + 1);
				}
			});
		})
    }
);