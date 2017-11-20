/**
 * Created by limengyang.bj@fang.com 2016-02-18
 * Edit by xiejingchao@fang.com 2016-05-11
 */
define('modules/news/yhxw', [], function (require, exports, module) {
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
            // 页面标志默认为搜索列表页
            var pageId = options.pageId || 'mzxsearch';
            // 用户动作类型默认为浏览
            var type = options.type || 0;
            // 如果vars中不存在所需要的参数值则接收需要得参数数组
            var pTemp = options.params || [];
            // 引入另一个js文件
            require.async('jsub/_vb.js?c=' + pageId);
            // 城市名称（中文)
            _ub.city = vars.cityname;
            // 资讯是i
            _ub.biz = 'i';//新房“n”，二手房e，租房n，查房价v,家居h，资讯i,知识k
            var ns = vars.ns === 'n' ? 0 : 1;
            // 方位（南北方) ，北方为0，南方为1
            _ub.location = ns;
            // 用户动作
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