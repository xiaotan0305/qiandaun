/**
 * Created by zdl on 2016/8/25.
 * 邮箱 zhangdaliang@fang.com
 */
define('modules/top/xfXtDetail', ['jquery', 'lazyload/1.9.1/lazyload'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        require('lazyload/1.9.1/lazyload');
        // 图片惰性加载
        $('.lazyload').lazyload();
        // 评论是否需要显示箭头
        function showMore($container) {
            var $texts = $container.find('.zjfx');
            for (var i = 0, len = $texts.length; i < len; i++) {
                var $text = $texts.eq(i);
                var $p = $text.find('.all');
                // 评论高度大于34有展开
                if (34 < $p.height()) {
                    $p.removeClass('all');
                    $text.find('.more-btn').show();
                }
                $p.show();
            }
        }
        var $textList = $('.top-list1');
        showMore($textList);
        // 更多信息显示隐藏切换
        $('.more-btn').on('click', function () {
            var $that = $(this);
            $that.toggleClass('up');
            // 要展示的内容div
            var brotherDiv = $that.siblings('div');
            // 内容处于收起状态时展开内容
            if (brotherDiv.css('max-height') === '34px') {
                brotherDiv.css('max-height', '100000px');
            } else {
                // 内容处于展开状态时收起内容
                brotherDiv.css('max-height', '34px');
            }
        });
        // 对页面进行了操作时隐藏更新时间div
        $(document).on('touchstart', function () {
            $('.updata-time').hide();
        });
    };
});