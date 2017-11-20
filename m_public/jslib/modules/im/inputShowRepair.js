/**
 * 修复某些手机浏览器input聚焦后页面不上滑的操作
 * 除了ios和QQ浏览器之外都不上滑
 * 因为在安卓手机上键盘弹起会触发resize事件，介于此来实现效果
 * by blue
 * 20160125 by WeiRF 根据blue之前所写整理成模块化，并添加iPhone5C的判断
 */

define('modules/im/inputShowRepair', ['jquery'],
    function (require) {
        'use strict';
        var $ = require('jquery');
        var focusFlag;
        var $chat = $('input[data-id="chat"]');
        // 取消获取焦点
        document.onclick = function (e) {
            if (e.target.getAttribute('id') !== 'wapchat_B01_08') {
                $chat.blur();
            }
        };
        $('.IM-bottom').on('click','input', function () {
            var target = this;
            // 使用定时器是为了让输入框上滑时更加自然
            setTimeout(function () {
                target.scrollIntoView(false);
            }, 400);
        });
        var UA = window.navigator.userAgent.toLowerCase();
        if ((UA.indexOf('iphone') !== -1 || UA.indexOf('ios') !== -1) && !/uc|qq/.test(UA)) {
            window.onresize = function () {
                window.scrollTo(0, 1);
            };
            $chat.blur(function () {
                window.scrollTo(0, 1);
            });
        } else if ((UA.indexOf('iphone') !== -1 || UA.indexOf('ios') !== -1) && /uc|qq/.test(UA)) {
            $chat.on('focus', function () {
                setTimeout(function () {
                    var height = $(document).scrollTop() + 44;
                    $(document).scrollTop(height);
                }, 200);
            });
            $chat.on('blur', function () {
                window.scrollTo(0, 1);
            });
        } else {
            var $w = $(window),
                $main = $('.main'),
                winH = $w.height();
            focusFlag = false;
            if (/mx/g.test(UA)) {
                winH += 45;
            }
            $chat.on('focus', function () {
                focusFlag = true;
            });
            $chat.on('blur', function () {
                focusFlag = false;
            });
            window.onresize = function () {
                if (focusFlag) {
                    $main.css('top', ($w.height() - winH).toString() + 'px');
                } else {
                    $main.css('top', '0px');
                }
            };
        }
    });