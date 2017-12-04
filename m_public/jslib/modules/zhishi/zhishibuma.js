/**
 * 专题列表页
 * @author fcwang(wangfengchao@fang.com) 20151226
 */
define('modules/zhishi/zhishibuma', function (require, exports, module) {
    'use strict';
    var vars = seajs.data.vars;
    var ubList = [];
    var ubCollect;
    module.exports = function (options) {
        if (ubCollect) {
            ubCollect(options);
        } else {
            ubList.push(options);
        }
    };
    require.async(['jsub/_ubm.js?v=201407181100'], function () {
        ubCollect = function (options) {
            _ub.city = vars.cityname;
            // 新房“n”，二手房‘e’，租房‘z’，家居‘h’，知识‘k’，资讯‘i’，小区网‘x’；查房价‘v’;海外网‘w’；个人中心‘g’；论坛‘b’；问答‘a’
            _ub.biz = 'k';
            // 方位 ，网通为0，电信为1，如果无法获取方位，记录0
            _ub.location = vars.cityns === 'n' ? 0 : 1;
            // 用户动作（浏览0、搜索1、打电话31、即时通讯24、预约25,在线咨询24、分享22、收藏21）
            var b = options.b || 1;
            // 页面标志默认为知识首页
            var pageType = options.pageType || 'mzshomepage';
            // 页面种类
            var zscategory = options.zscategory || '';
            // 搜索关键词
            var key = options.key || '';
            // 赞踩id
            var zsid = options.zsid || '';

            var pTemp;
            require.async('jsub/_vb.js?c=' + options.pageType);

            if (vars.action === 'getClassList') {
                pTemp = {
                    'vmg.page': pageType,
                    'vmk.zscategory': zscategory
                };
            } else if (vars.action === 'search') {
                pTemp = {
                    'vmg.page': pageType,
                    'vmk.key': key
                };
            } else if (vars.action === 'detail') {
                pTemp = {
                    'vmg.page': pageType,
                    'vmk.zsid': zsid
                };
            } else if (vars.action === 'index') {
                pTemp = {
                    // 所属页面
                    'vmg.page': pageType,
                    // 汉字
                    'vmk.zscategory': zscategory
                };
            } else if (vars.action === 'commonList') {
                pTemp = {
                    'vmg.page': pageType,
                    'vmh.key': key
                };
            } else if (vars.action === 'hotTopic') {
                pTemp = {
                    'vmg.page': pageType,
                    'vmh.key': key
                };
            }
            var p = {};
            // 若pTemp中属性为空或者无效，则不传入p中
            for (var temp in pTemp) {
                if (pTemp.hasOwnProperty(temp)) {
                    if (pTemp[temp] !== null && '' !== pTemp[temp] && undefined !== pTemp[temp] && 'undefined' !== pTemp[temp]) {
                        p[temp] = pTemp[temp];
                    }
                }
            }
            // 示例 _ub.collect(1,{'vmn.projectid':'1105210251'});
            _ub.collect(b, p);
        };
        while (ubList.length) {
            ubCollect(ubList.shift());
        }
    });
});
