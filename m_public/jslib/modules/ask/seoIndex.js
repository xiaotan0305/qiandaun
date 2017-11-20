define('modules/ask/seoIndex', ['jquery', 'modules/ask/yhxw'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        // 用户行为对象
        var yhxw = require('modules/ask/yhxw');
        yhxw({type: 1, pageId: 'malisthotword'});
    };
});