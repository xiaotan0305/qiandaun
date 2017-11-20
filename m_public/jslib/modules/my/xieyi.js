define('modules/my/xieyi', ['jquery'], function (require, exports, module) {
    'use strict';
    var $ = require('jquery');
    module.exports = function () {
        $('#rightMenu').find('li').on('click', 'a', function () {
            var $that = $(this);
            $that.siblings('a').removeClass('on');
            $(this).addClass('on');
        });

        // 菜单点击
        var myMore = $('.my-more');
        $('.head-icon').on('click', function (event) {
            // 取消事件冒泡
            event.stopPropagation();
            // 按钮的toggle,如果div是可见的,点击按钮切换为隐藏的;如果是隐藏的,切换为可见的。
            myMore.toggle();
        });
        // 点击空白处隐藏弹出层，下面为滑动消失效果和淡出消失效果。
        $(document.body).on('touchend click', function (event) {
            var targetEle = event.target.parentElement,
                targetClass = '',
                targetId = '';
            if (targetEle) {
                if (targetEle.parentElement) {
                    targetId = targetEle.parentElement.id;
                    targetClass = targetEle.parentElement.className;
                } else {
                    targetClass = targetEle.className;
                }
            }
            if (targetClass !== 'icon-opt' && targetClass !== 'head-icon' && targetId !== 'rightMenu') {
                myMore.hide();
            }
        });
    };
});