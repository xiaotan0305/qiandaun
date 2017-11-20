/**
 * 房贷计算器埋码js
 * Created by lixiaoru@fang.com 2016-02-23
 */
define('modules/tools/maima', ['modules/mycenter/yhxw'], function (require) {
    'use strict';
    // 引入用户行为分析对象-埋码
    var yhxw = require('modules/mycenter/yhxw');
    return function (type) {
        var pageId = '';
        var maimaParams = {};
        switch (type) {
            case 1:
                pageId = 'muchomeloansyd';
                break;
            case 2:
                pageId = 'muchomeloangjjd';
                break;
            case 3:
                pageId = 'muchomeloanzhd';
                break;
            case 4:
                pageId = 'muchomeloansfxf';
                break;
            case 5:
                pageId = 'muchomeloansfesf';
                break;
            case 6:
                pageId = 'muchomeloansfd';
                break;
        }
        // 添加用户行为分析
        maimaParams['vmg.page'] = pageId;
        yhxw({type: 0, pageId: pageId, params: maimaParams});
    };
});