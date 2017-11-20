/**
 * 海外页面无js默认的埋码js
 * Created by limengyang.bj@fang.com 2016-02-19
 */
define('modules/world/maiMa', ['jquery', 'modules/world/yhxw'], function (require) {
    'use strict';
    var vars = seajs.data.vars;
    var $ = require('jquery');
    // 引入用户行为分析对象-埋码
    var yhxw = require('modules/world/yhxw');
    // 判断详情页种类，传入用户行为统计对象
    var pageId;
    var askId;
    switch (vars.action) {
        // 海外服务页
        case 'service':
            pageId = 'mwservice';
            break;
        // 海外售后服务页
        case 'aftermarketService':
            pageId = 'mwaftermarketservice';
            break;
        // 海外问答详情页
        case 'askDetail':
            pageId = 'mwaskpage';
            askId = vars.askId;
            break;
        default:
            break;
    }
    // 埋码变量数组
    var maiMaParams = {
        // 页面标识
        'vmg.page': pageId,
        // 问答id
        'vmw.askid': askId
    };
    if (pageId) {
        // 海外服务页，海外售后服务页，海外问答详情页打电话埋码
        // 打电话埋码，模板页都用class="maiMaCall"
        $('.maiMaCall').on('click', function () {
            // 添加用户行为分析-埋码
            yhxw({type: 31, pageId: pageId, params: maiMaParams});
        });

        // 添加浏览用户行为分析
        yhxw({type: 0, pageId: pageId, params: maiMaParams});
    }
});