define('modules/my/transfer', ['jquery', 'modules/mycenter/yhxw'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var vars = seajs.data.vars;
        // var encity = vars.city;
        var $ = require('jquery');

        // 引入用户行为分析对象-埋码
        var yhxw = require('modules/mycenter/yhxw');
        var pageId;
        // 判断详情页种类，传入用户行为统计对象
        if (vars.action === 'transfer') {
            pageId = 'mucmymoneyzzfk';
        } else {
            pageId = 'mucmymoneytx';
        }
        // 埋码变量数组
        var maiMaParams = {
            'vmg.page': pageId,
            'vmw.visitinfo': encodeURIComponent($('#maima').val())
        };
        yhxw({
            type: 0,
            pageId: pageId,
            params: maiMaParams
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
                targetId = event.target.id;
            if (targetEle) {
                targetClass = targetEle.parentElement ? targetEle.parentElement.className : targetEle.className;
            }
            if (targetClass !== 'icon-opt' && targetClass !== 'head-icon' && targetId !== 'cjwt') {
                myMore.hide();
            }
        });


        $('#cjwt').on('click', function () {
            $('#cjwt').addClass('on');
        });

        require.async('app/1.0.0/appdownload', function () {
            $('#down').openApp();
        });
    };
});