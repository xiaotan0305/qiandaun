/**
 * Created by LXM on 14-12-9.
 */
define('modules/world/newsDetail', ['jquery', 'modules/world/yhxw'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        // 底给予8个外边距
        $('.footer').addClass('mt8');
        // 图片惰性加载
        require.async('lazyload/1.9.1/lazyload', function () {
            $('img[data-original]').lazyload();
        });
        // 引入用户行为分析对象-埋码
        var yhxw = require('modules/world/yhxw');
        // 判断详情页种类，传入用户行为统计对象
        var pageId = 'mwnewspage';
        // 埋码变量数组
        var maiMaParams = {
            // 页面标识
            'vmg.page': pageId,
            // 国家名称
            'vmw.country': encodeURIComponent(vars.zhCountry),
            // 资讯id
            'vmw.newsid': encodeURIComponent(vars.newsId)
        };
        // 添加用户行为分析
        yhxw({
            type: 0,
            pageId: pageId,
            params: maiMaParams
        });

        // 打电话埋码
        $('.floatBtns').on('click', '#call', function () {
            // 国家不传，设为空
            maiMaParams['vmw.country'] = '';
            // 添加用户行为分析-埋码
            yhxw({
                type: 31,
                pageId: pageId,
                params: maiMaParams
            });
        });

        // 若有余下全文会导致lazyload不准确
        function ensureImg(attrProp) {
            var imgs = $('img[data-' + attrProp + ']');
            imgs.each(function () {
                var $this = $(this);
                $this.is(':visible') && $this.attr('src', $this.data(attrProp));
            });
        }

        // 海外房产圈查看更多
        if (vars.channelid && vars.channelid === '03') {
            var $conWord = $('.conWord');
            var $moreLoad = $('#moreLoad');
            var height = parseInt($(window).height(), 10) * 2;
            if ($conWord.height() > height) {
                ensureImg('original');
                // 高度限制
                $conWord.css({
                    'max-height': height,
                    overflow: 'hidden'
                });
                $moreLoad.show();
            }
            // 余下全文
            $moreLoad.on('click', function () {
                $conWord.css('max-height', '');
                $moreLoad.hide();
            });
        } else {
            // 其他资讯余下全文
            $('#moreLoad').click(function () {
                $('#moreLoad').hide();
                $('#conWordMore').show();
                return false;
            });
        }

        // 新加对精彩推荐的隐藏和显示
        $('#show_jingcai').on('click', function () {
            $('#jingcai').css('display', 'block');
            $(this).css('display', 'none');
        });
    };
});