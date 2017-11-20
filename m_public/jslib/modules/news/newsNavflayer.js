/*
 * @file 资讯导航js
 * @author  icy
 */
define('modules/news/newsNavflayer', ['jquery'], function (require) {
    'use strict';
    var $ = require('jquery');
    var $iconNav = $('.icon-nav');
    var newNavFlag = false;
    var userName = '';
    if ($iconNav.is(':visible')) {
        var headDrop = $('.head-drop');
        var mainDiv = $('.main');
        var newNavDiv = $('.newNav');
        var isShow = false;
        $iconNav.on('click', function (e) {
            if (mainDiv.is(':visible')) {
                $.get('/public/?c=public&a=ajaxUserInfo', function (o) {
                    if (o.nickname) {
                        userName = o.nickname;
                    } else if (o.username) {
                        userName = o.username;
                    } else {
                        userName = '我的房天下';
                    }
                    $('#navflayerinfo a').text(userName);
                });
            }
            e.stopPropagation();
            headDrop.toggle();
            if (newNavFlag) {
                newNavDiv.hide();
                mainDiv.show();
            }
            isShow = !isShow;
        });
        $('.head2').length && headDrop.css({
            position: 'fixed'
        });

        $('body').on('click', function (e) {
            var $target = $(e.target);
            if (isShow && ($target.attr('id') !== 'jjNav' && !$target.parents('#jjNav').length) && !$target.hasClass('header') && !$target.parents('.header').length) {
                headDrop.hide();
                isShow = !isShow;
            }
        });
        var $downloadPage = $('#downloadPage');
        var isHidden;
        $('#channelNav').on('click', function () {
            newNavFlag = true;
            mainDiv.hide();
            newNavDiv.show();
            headDrop.hide();
            isHidden = $downloadPage.is(':hidden');
            $downloadPage.hide();
        });
        newNavDiv.on('click', '.close', function (event) {
            event.stopPropagation();
            newNavFlag = false;
            headDrop.show();
            mainDiv.show();
            newNavDiv.hide();
            isHidden || $downloadPage.show();
        });
    }
});
