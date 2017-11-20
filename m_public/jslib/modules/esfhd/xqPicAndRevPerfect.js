/**
 * 经纪人上传图片和写评论首页
 * Created by lina on 2017/4/13.
 */
define('modules/esfhd/xqPicAndRevPerfect',['iscroll/2.0.0/iscroll-lite'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery'),
        // 图标
            $btn = $('.xq-btn'),
        // 弹层
            $float = $('.floatBox');
        var $box = $('.hdjs');
        var dHeight= $(document).height() - 100;
        var iscrollCtrl = require('iscroll/2.0.0/iscroll-lite');
        var scroll = new iscrollCtrl('#floatBox', {scrollY: true});
        var scrollDp = new iscrollCtrl('#floatBoxDp', {scrollY: true});
        function preventDefault(e){
            e.preventDefault();
        }
        function unable(){
            document.addEventListener('touchmove',preventDefault);
        }
        function enable(){
            document.removeEventListener('touchmove',preventDefault);
        }
        $box.height(dHeight + 'px');
        $('.wrap').css('padding-bottom','15px');
        var $close = $('.hd-close');
        // 点击图标，显示弹层
        $btn.on('click', function () {
            var $ele = $(this);
            if($ele.attr('id') === 'tpInfo'){
                $float.eq(0).show();
                $close.eq(0).show();
                scroll.refresh('#floatBox');
            }else{
                $float.eq(1).show();
                $close.eq(1).show();
                scrollDp.refresh('#floatBox1');
            }
            unable();
        });
        // 点击关闭按钮，关闭弹层
        $('.hd-close,.floatBox').on('click', function () {
            $float.hide();
            $close.hide();
            enable();
        });
        $float.find('.hdjs').on('click',function(){
            return false;
        });
    };
});
