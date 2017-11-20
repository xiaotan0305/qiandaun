/**
 * Created by lixiaoru@fang.com 2016-02-23
 */
define('modules/mycenter/maima', ['jquery', 'modules/mycenter/yhxw'], function (require, exports, module) {
    'use strict';
    var vars = seajs.data.vars;
    // 引入用户行为分析对象-埋码
    var yhxw = require('modules/mycenter/yhxw');
    // 判断详情页种类，传入用户行为统计对象
    var pageId = '';
    var maimaParams = {};
    switch (vars.action) {
        // 合同列表页
        case 'contractList':
            pageId = 'mucmycontract';
            maimaParams['vmg.page'] = pageId;
            //埋码-我的合同信息
            $('ul[data-type]').each(function (index, element) {
                //第一个循环不加逗号
                if (index === 0) {
                    maimaParams['vmg.contractinfo'] = encodeURIComponent($(this).attr('data-type')) + '^' + encodeURIComponent($(this).attr('data-no')) + '^' + encodeURIComponent($(this).attr('data-addr')) + '^' + encodeURIComponent($(this).attr('data-time'));
                } else {
                    maimaParams['vmg.contractinfo'] += ',' + encodeURIComponent($(this).attr('data-type')) + '^' + encodeURIComponent($(this).attr('data-no')) + '^' + encodeURIComponent($(this).attr('data-addr')) + '^' + encodeURIComponent($(this).attr('data-time'));
                }
            });
            break;
        case 'myFavList':
            pageId = 'mucmycollect';
            maimaParams['vmg.page'] = pageId;
            maimaParams['vmg.showlocation'] = encodeURIComponent('收藏');
            break;
        default:
            break;
    }
    // 添加用户行为分析
    if (pageId !== '') {
        yhxw({type: 0, pageId: pageId, params: maimaParams});
    }
});