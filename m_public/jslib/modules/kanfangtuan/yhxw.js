/**
 * Created by limengyang.bj@fang.com 2016-02-18
 */
define('modules/kanfangtuan/yhxw', [], function (require, exports, module) {
    'use strict';
    var ubList = [];
    var ubCollect;
    var vars = seajs.data.vars;
    module.exports = function (options) {
        if (ubCollect) {
            ubCollect(options);
        } else {
            ubList.push(options);
        }
    };
    require.async(['jsub/_ubm.js'], function () {
        ubCollect = function (options) {
            // 页面标志默认为看房团列表页
            var pageId = options.pageId || 'mnhkftlist';
            // 用户动作类型默认为浏览
            var type = options.type || 0;
            // 如果vars中不存在所需要的参数值则接收需要得参数数组
            var pTemp = options.params || [];
            // 引入另一个js文件
            require.async('jsub/_vb.js?c=' + pageId);
            // 城市名称（中文)
            _ub.city = vars.cityname;
            // 看房团属于新房是n
            _ub.biz = 'n';
            var ns = vars.ns === 'n' ? 0 : 1;
            // 方位（南北方) ，北方为0，南方为1
            _ub.location = ns;
            // 用户动作（浏览0、搜索1、报名看房团33、在线咨询24、打电话31）
            var b = type;
            var p = {};
            // 若pTemp中属性为空或者无效，则不传入p中
            for (var temp in pTemp) {
                if (pTemp.hasOwnProperty(temp)) {
                    if (pTemp[temp] !== null && '' !== pTemp[temp] && undefined !== pTemp[temp] && 'undefined' !== pTemp[temp]) {
                        p[temp] = pTemp[temp];
                    }
                }
            }
            // 收集方法
            _ub.collect(b, p);
        };
        while (ubList.length) {
            ubCollect(ubList.shift());
        }
    });
});