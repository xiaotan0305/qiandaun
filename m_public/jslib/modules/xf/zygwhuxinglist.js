/**
 * 热销户型
 * 20160224  by WeiRF
 */
define('modules/xf/zygwhuxinglist', ['jquery'], function (require) {
    'use strict';
    var $ = require('jquery');
    var $overboxIn = $('.overboxIn');
    var $zygwHotlist = $('#zygwHotlist');
    $overboxIn.on('click','a',function () {
        $overboxIn.find('a').removeClass('active');
        $(this).addClass('active');
        var name = $(this).attr('data-name');
        if (name && name !== 'all') {
            $zygwHotlist.find('li').hide();
            $zygwHotlist.find('li[data-name=' + name + ']').show();
        } else {
            $zygwHotlist.find('li').show();
        }
    });
});