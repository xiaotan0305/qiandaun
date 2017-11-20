/**
 * wap/1214二手房经纪人店铺 历史带看量
 * create by zdl 2015-12-16
 * 邮箱地址（zhangdaliang@fang.com）
 */
define('modules/agent/historyRecord', ['jquery','lazyload/1.9.1/lazyload'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var vars = seajs.data.vars;
        var $ = require('jquery');
        var lazyload = require('lazyload/1.9.1/lazyload');
        lazyload('img[data-original]').lazyload();
        var $dragId = $('#drag');
        // 只有当频道为二手房时才会分屏加载历史带看量数据 否者一次全部加载
        if (vars.channel === 'esf') {
            // 获取历史成交量的总条数
            var kBool = true;
            var historyNum = vars.count;
            if (historyNum <= 10 || historyNum === undefined) {
                $dragId.hide();
                kBool = false;
            }
            if (kBool) {
                require.async('modules/agent/loadnewmore', function (run) {
                    run({
                        url: vars.agentSite  + '?c=agent&a=ajaxGetHistoryList&agentid=' + vars.agentid + '&city=' + vars.city
                    });
                });
            }
        } else {
            $dragId.hide();
        }
    };
});
