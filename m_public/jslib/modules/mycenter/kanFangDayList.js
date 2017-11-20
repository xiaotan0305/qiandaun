/**
 * Created by lmy on 2016/11/8.
 * 邮箱 limengyang.bj@fang.com
 */
define('modules/mycenter/kanFangDayList', ['jquery', 'lazyload/1.9.1/lazyload', 'modules/mycenter/yhxw'], function (require) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;
    // 引入用户行为分析对象-埋码
    var yhxw = require('modules/mycenter/yhxw');
    // 判断详情页种类，传入用户行为统计对象
    var pageId = 'mucvisitlist';
    var maimai = '';
    $('.listShow').each(function () {
        var datamaima = $(this).attr('data-maima') || '';
        maimai += encodeURIComponent(datamaima) + ',';
    });
    // 埋码变量数组
    var maiMaParams = {
        'vmg.page': pageId,
        'vmg.visitinfo': maimai.replace(/%5E/g, '^')
    };
    yhxw({type: 0, pageId: pageId, params: maiMaParams});

    require('lazyload/1.9.1/lazyload');
    // 图片惰性加载
    $('.lazyload').lazyload();
    // 二手房-取消预约
    $('.esfCancel').on('click', function () {
        var $that = $(this);
        var orderid = $that.attr('data-orderid');
        // 订单城市简拼
        var orderCity = $that.attr('data-ordercity');
        if (window.confirm('是否取消看房 ?')) {
            var params = {
                a: 'yyCancleOrder',
                city: orderCity,
                orderID: orderid,
                r: Math.random()
            };
            var ajaxUrl = 'index.php?c=myesf',
                onComplete = function (data) {
                    if (data === '1') {
                        $that.parents('.listShow').remove();
                        maiMaParams['vmg.agentid'] = $that.attr('data-agentid');
                        maiMaParams['vmg.visitinfo'] = encodeURIComponent($that.parents('.listShow').attr('data-maima')).replace(/%5E/g, '^');
                        yhxw({type: 59, pageId: pageId, params: maiMaParams});
                        // 只有一条预约，取消后刷新页面
                        if (!$('.listShow').length) {
                            window.location.reload();
                        }
                    } else {
                        // 失败
                        alert('取消预约失败，请稍后再试');
                    }
                };
            vars.ajax(ajaxUrl, 'get', params, onComplete);
        }
    });
    // 新房取消预约
    $('.editXfYy').on('click', function () {
        var $that = $(this);
        var kfId = $that.attr('data-kfId');
        if (window.confirm('是否取消看房 ?')) {
            var params = {
                a: 'ajaxEditXfKfDay',
                city: vars.city,
                kfId: kfId,
                r: Math.random()
            };
            var ajaxUrl = 'index.php?c=mycenter',
                onComplete = function (data) {
                    if (data) {
                        $that.parents('.listShow').remove();
                        maiMaParams['vmg.agentid'] = $that.attr('data-agentid');
                        maiMaParams['vmg.visitinfo'] = encodeURIComponent($that.parents('.listShow').attr('data-maima')).replace(/%5E/g, '^');
                        yhxw({type: 59, pageId: pageId, params: maiMaParams});
                        // 只有一条预约，取消后刷新页面
                        if (!$('.listShow').length) {
                            window.location.reload();
                        }
                    } else {
                        // 失败
                        alert('取消预约失败，请稍后再试');
                    }
                };
            vars.ajax(ajaxUrl, 'get', params, onComplete);
        }
    });
    // 打电话
    $('.telphone').on('click', function () {
        var $that = $(this);
        maiMaParams['vmg.agentid'] = $that.attr('data-agentid');
        maiMaParams['vmg.visitinfo'] = encodeURIComponent($that.parents('.listShow').attr('data-maima')).replace(/%5E/g, '^');
        yhxw({type: 31, pageId: pageId, params: maiMaParams});
    });
});
