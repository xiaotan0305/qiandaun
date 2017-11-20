define('modules/my/cjwt', ['jquery'], function (require, exports, module) {
    'use strict';
    var $ = require('jquery');
    module.exports = function () {
        $('#pwdset').on('click', function(){
            $('#pwdset').addClass('on');
        });
        // 根据参数名获得该参数  pname等于想要的参数名
        function getParam(pname) {
            var params = location.search.substr(1);
            // 获取参数 平且去掉？
            var ArrParam = params.split('&');
            if (ArrParam.length === 1) {
                // 只有一个参数的情况
                return params.split('=')[1];
            }
            // 多个参数参数的情况
            for (var i = 0; i < ArrParam.length; i++) {
                if (ArrParam[i].split('=')[0] === pname) {
                    return ArrParam[i].split('=')[1];
                }
            }
        }
        
        var mao = $('#' + getParam('m'));
        // 获得锚点
        if (mao.length > 0) {
            // 判断对象是否存在
            var pos = mao.offset().top;
            var poshigh = mao.height();
            $('html,body').animate({
                scrollTop: pos - poshigh - 30
            }, 300);
        }


        // 菜单点击
        var myMore = $('.my-more');
        $('.head-icon').on('click',function (event) {  
             //取消事件冒泡  
             event.stopPropagation();  
             //按钮的toggle,如果div是可见的,点击按钮切换为隐藏的;如果是隐藏的,切换为可见的。  
             myMore.toggle();  
        });  
         //点击空白处隐藏弹出层
         $(document.body).on('touchend click',function(event){
            var targetEle = event.target.parentElement,
                targetClass = '',
                targetId = event.target.id;
            if (targetEle) {
                targetClass = targetEle.parentElement ? targetEle.parentElement.className : targetEle.className;
            }
            if (targetClass !== 'icon-opt' && targetClass !== 'head-icon' && targetId !== 'pwdset') {
                myMore.hide();
            }
        });
    };
});