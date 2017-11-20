define('modules/xf/redbag',['jquery','iscroll/2.0.0/iscroll-lite'],
    function (require) {
        'use strict';
        var $ = require('jquery');
        var IScrolllist = require('iscroll/2.0.0/iscroll-lite');
        // 兼容点评页和论坛列表页
        var $wrapper1 = $('#wrapper1');
        var length = $wrapper1.length;
        var $wrapper = length > 0 ? $wrapper1 : $('#wrapper');
        var wrappertext = length > 0 ? '#wrapper1' : '#wrapper';
        function hbscroll() {
            var wrapperLength = $wrapper.find('li').length;
            if (wrapperLength === 1) {
                $wrapper.css('text-align', 'center');
                $wrapper.find('ul').css('display', 'inline-block');
            } else if ($wrapper.length !== 0) {
                $wrapper.find('ul').eq(0).width(wrapperLength * 237);
                IScrolllist(wrappertext,
                    {scrollX: true, bindToWrapper: true, eventPassthrough: true});
            }
        }
        var judgehb = true;
        $('#hbup').on('click',function () {
            $('.sf-hongbao').show();
            if (judgehb) {
                hbscroll();
                judgehb = false;
            }
            $('.msTip1').hide();
            $('.msTip2').show();
        });
        $('#hbdown').on('click',function () {
            $('.sf-hongbao').hide();
            $('.msTip1').show();
            $('.msTip2').hide();
        });
    });