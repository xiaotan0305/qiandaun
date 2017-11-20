define('modules/my/payIndex', ['jquery', 'modules/mycenter/yhxw', 'swipe/3.10/swiper'], function (require, exports, module) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;
    module.exports = function () {
        // 引入用户行为分析对象-埋码
        var yhxw = require('modules/mycenter/yhxw');
        // 引入swiper插件
        var Swiper1 = require('swipe/3.10/swiper');
        // 判断详情页种类，传入用户行为统计对象
        var pageId = 'mucmymoney';
        // 埋码变量数组
        var maiMaParams = {
            'vmg.page': pageId,
            'vmg.myprice': $('#total').val(),
            'vmg.usableprice': $('#usable').val(),
            'vmg.freezeprice': $('#freeze').val()
        };
        yhxw({
            type: 0,
            pageId: pageId,
            params: maiMaParams
        });

        $('#rightMenu').find('li').on('click', 'a', function () {
            var $that = $(this);
            $that.siblings('a').removeClass('on');
            $(this).addClass('on');
        });

        var myMore = $('.my-more');
        $('.flor').on('click', function (event) {
            // 取消事件冒泡
            event.stopPropagation();
            // 按钮的toggle,如果div是可见的,点击按钮切换为隐藏的;如果是隐藏的,切换为可见的。
            myMore.toggle();
        });
        // 点击空白处隐藏弹出层， 下面为滑动消失效果和淡出消失效果。
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
            if (targetClass !== 'icon-opt' && targetClass !== 'flor' && targetId !== 'rightMenu') {
                myMore.hide();
            }
        });
        // 信息不完整不可以点击
        $('.check').on('click', function(e) {
            e.preventDefault();
            $('.tz-box').show();
        });
        // 隐藏提示弹框
        $('.closeBox').on('click', function() {
            $('.tz-box').hide();
        });
        // 二手房工作台APP方法
        var nativeApp = {
            call: function (methodName) {
                if (window.nativeApp) {
                    window.nativeApp.HtmlcallJava(methodName);
                } else if (window.HtmlcallJava) {
                    window.HtmlcallJava(methodName);
                }
            }
        };

        // 返回按钮跳回APP
        $('.goBack').on('click', function () {
            if (vars.isapp === 'xfgztandroid') {
                window.appsignature.showBack();
            } else if (vars.isapp === 'xfgztios') {
                document.location = '/javascript_showBack';
            } else if (vars.isapp === 'esfgzt') {
                nativeApp.call('finish');
            } else {
                document.location = location.protocol + $(this).attr('data-href');
            }
        });
        $('.a-ltc').on('click', function(event) {
            event.preventDefault();
            $('.purseroll').show();
            Swiper1(".swiper-container", {
                direction: 'vertical',
            });
        });
        $('.iknow').on('click', function(event) {
            event.preventDefault();
            $('.purseroll').hide();
        });

    };
});