define('modules/myesf/saleStaup', [], function (require, exports, module) {
    'use strict';
    // 获取隐藏域数据
    var vars = seajs.data.vars;
    // 引入用户行为统计
    if (vars.action !== 'delegateAndResale' && vars.action !== 'editDelegate' && vars.action !== 'myDaiKanRecord') {
        require.async('modules/esf/yhxw', function (yhxw) {
            yhxw({type: 0, pageId: 'mesfreleaseresult', curChannel: 'myesf'});
        })
    }
    (function (doc, win) {
        var docEl = doc.documentElement,
            resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
            recalc = function () {
                var clientWidth = docEl.clientWidth;
                if (!clientWidth) return;
                docEl.style.fontSize = 20 * (clientWidth / 320) + 'px';
                if (clientWidth >= 640) {
                    docEl.style.fontSize = 40 + 'px';
                }
            };

        if (!doc.addEventListener) return;
        recalc();
        win.addEventListener(resizeEvt, recalc, false);
        doc.addEventListener('DOMContentLoaded', recalc, false);
    })(document, window);
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        $('input[type=hidden]').each(function (index, element) {
            vars[$(this).attr('data-id')] = element.value;
        });
    };
});