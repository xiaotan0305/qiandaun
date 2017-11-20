/**
 * wap/1214二手房经纪人店铺 历史成交页面
 * create by zdl 2015-12-16
 * 邮箱地址（zhangdaliang@fang.com）
 */
define('modules/agent/dealRecord', ['jquery','lazyload/1.9.1/lazyload'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var vars = seajs.data.vars;
        var $ = require('jquery');
        var lazyload = require('lazyload/1.9.1/lazyload');
        lazyload('img[data-original]').lazyload();
        var $dragId = $('#drag');
        // 只有当频道为二手房经纪人类型为内部经纪人时才会分屏加载历史成交量数据 否者一次全部加载
        if (vars.channel === 'esf' && vars.agenttype === '1') {
            // 获取历史成交量的总条数
            var kBool = true;
            var historyNum = vars.count;
            if (historyNum <= 10 || historyNum === undefined) {
                $dragId.hide();
                kBool = false;
            }
            // 如果第一次加载进来获取结果页数小于1 可以不加载加载更多
            if (kBool) {
                require.async('modules/agent/loadnewmore', function (run) {
                    run({
                        url: vars.agentSite  + '?c=agent&a=ajaxGetDealList&agentid=' + vars.agentid + '&city=' + vars.city  + '&agenttype=' + vars.agenttype
                    });
                });
            }
        } else {
            $dragId.hide();
        }
    };
});
