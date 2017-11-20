define('modules/mycenter/fukuanToAPP', ['jquery'], function (require) {
    'use strict';
    var $ = require('jquery');
    // 菜单点击
    var myMore = $('.my-more');
    $('.head-icon').on('click', function (event) {
        // 取消事件冒泡
        event.stopPropagation();
        // 按钮的toggle, 如果div是可见的, 点击按钮切换为隐藏的;如果是隐藏的, 切换为可见的。
        myMore.toggle();
    });
    // 点击空白处隐藏弹出层，下面为滑动消失效果和淡出消失效果。
    $(document.body).on('touchend click', function (event) {
        var targetEle = event.target.parentElement,
            targetClass = '',
            targetId = event.target.id;
        if (targetEle) {
            targetClass = targetEle.parentElement ? targetEle.parentElement.className : targetEle.className;
        }
        if (targetClass !== 'icon-opt' && targetClass !== 'head-icon' && targetId !== 'cjwt') {
            myMore.hide();
        }
    });

    $('#cjwt').on('click', function () {
        $(this).addClass('on');
    });
    var $down = $('#down');
    require.async(['app/1.0.0/appdownload'], function () {
        $down.openApp();
    });
});