define('modules/ask/seoIndex', ['jquery', 'modules/ask/yhxw'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        // �û���Ϊ����
        var yhxw = require('modules/ask/yhxw');
        yhxw({type: 1, pageId: 'malisthotword'});
    };
});