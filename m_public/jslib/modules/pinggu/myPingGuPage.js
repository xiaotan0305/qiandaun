/**
 * @file js合并，ESLint
 * @author fcwang(wangfengchao@soufun.com)
 */
define('modules/pinggu/myPingGuPage', ['jquery'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var $sfMask = $('#sf-mask'),
            $addMore = $('#add_more'),
            $floatMsg = $('.floatMsg'),
            $sum = $('#sum'),
            PglogId,
            timeCount;
        // 删除历史记录
        $addMore.on('click', '.del', function () {
            var $this = $(this);
            PglogId = $this.attr('id');
            $sfMask.find('span').eq(1).html(' ' + $this.next().find('h2').html() + ' ');
            $sfMask.show();
        });
        // 删除弹框确定按钮点击事件
        $sfMask.find('#ok').on('click', function () {
            $.ajax({
                type: 'get',
                url: vars.pingguSite + '?c=pinggu&a=ajaxDelMyPgLog&city=' + vars.city + '&PglogId=' + PglogId,
                success: function (data) {
                    var code = data.ErrorCode.Code === '100';
                    // 防止用户多次点击setTimeout被多次添加到进程中
                    if (timeCount) {
                        clearTimeout(timeCount);
                        timeCount = undefined;
                    }
                    $floatMsg.find('p').html(code ? '删除成功！' : '删除失败！');
                    $floatMsg.show();
                    timeCount = setTimeout(function () {
                        $floatMsg.hide();
                    }, 2000);
                    if (code) {
                        $sum.find('span').html(parseInt($sum.find('span').html()) - 1);
                        $('#' + PglogId).closest('li').remove();
                    }
                }
            });
            $sfMask.hide();
        });
        // 删除弹框取消按钮点击事件
        $sfMask.find('#cancel').on('click', function () {
            $sfMask.hide();
        });
        // 点击弹框或其他地方 弹框消失
        $sfMask.on('click', function () {
            $sfMask.hide();
        });
    };
});