/**
 * @author lipengkun@fang.com  APP小区点评抽奖活动相关功能
 */
define('modules/esfhd/xqdpentrance', ['swipe/3.10/swiper'],  function (require,exports,module) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;
    var Swiper = require('swipe/3.10/swiper');

    //****按钮跳转****
    $('#jumpdp').click(function(){
        var jump = $('#jumpdp').attr('data-href');
        window.location.href = jump;
    });

    //****滚动条****
    var mySwiper = new Swiper('#scrollobj', {
        autoplay: 2000,//可选选项，自动滑动
        loop:true,
        autoplayDisableOnInteraction : false,
        observer:true,
        observeParents:true,
    });
    //mySwiper.update();
});