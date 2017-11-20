/*
 * @file 家居导航js
 * @author  icy
 */
define('modules/jiaju/jiajuNavflayer', ['jquery'], function (require) {
    'use strict';
    var $ = require('jquery');
    var $iconNav = $('.icon-nav');
    var newNavFlag = false;
    var vars = seajs.data.vars;
    if ($iconNav.is(':visible')) {
        var $jjNav = $('#jjNav');
        var mainDiv = $('.main');
        var newNavDiv = $('.newNav');
        var isShow = false;
        $iconNav.on('click', function (e) {
            e.stopPropagation();
            vars.action === 'zxgRecommendCompany' && $jjNav.css('position','fixed');
            vars.action === 'zxCompanyDetail' && $jjNav.css('position','fixed');
            $jjNav.toggle();
            if (newNavFlag) {
                newNavDiv.hide();
                mainDiv.show();
            }
            isShow = !isShow;
        });
        $('.head2').length && $jjNav.css({
            position: 'fixed'
        });

        $('body').on('click', function (e) {
            var $target = $(e.target);
            if (isShow && ($target.attr('id') !== 'jjNav' && !$target.parents('#jjNav').length) && !$target.hasClass('header') && !$target.parents('.header').length) {
                $jjNav.hide();
                isShow = !isShow;
            }
        });
        var $downloadPage = $('#downloadPage');
        var isHidden;
        $('#channelNav').on('click', function () {
            newNavFlag = true;
            mainDiv.hide();
            newNavDiv.show();
            $jjNav.hide();
            isHidden = $downloadPage.is(':hidden');
            $downloadPage.hide();
        });
        newNavDiv.on('click', '.close', function (event) {
            event.stopPropagation();
            newNavFlag = false;
            $jjNav.show();
            mainDiv.show();
            newNavDiv.hide();
            isHidden || $downloadPage.show();
        });
    }
});
