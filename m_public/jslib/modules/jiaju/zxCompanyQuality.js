/**
 * @file 品牌馆-新版商铺详情
 */
define('modules/jiaju/zxCompanyQuality', ['jquery', 'lazyload/1.9.1/lazyload', 'modules/jiaju/yhxw'],function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        require('lazyload/1.9.1/lazyload');
        $('.lazyload').lazyload();
        var companyProfile = $('#companyProfile');
        var moreProfile = $('#moreProfile');
        var $bigImg = $('.bigImg');
        // 用户行为统计
        var yhxw = require('modules/jiaju/yhxw');
        yhxw({
            page: 'mjjzxcompanyquality',
            companyid: vars.companyid
        });

        pageInit();
        function pageInit() {
            var profileHeight = companyProfile.find('p').height();
            if(profileHeight < 78) {
                companyProfile.removeClass('max-he');
                moreProfile.hide();
            }
            eventInit();
            $bigImg.find('img').css({
                '-webkit-filter': 'blur(3px)',
                'filter': 'blur(3px)'
            });
        }
        function eventInit() {
            moreProfile.on('click',function () {
                companyProfile.toggleClass('max-he');
                if(companyProfile.hasClass('max-he')) {
                    companyProfile.css('max-height','78px');
                } else {
                    companyProfile.css('max-height','none');
                }
                moreProfile.toggleClass('unfold');
            });
        }
    };
});