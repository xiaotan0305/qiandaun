/**
 *�ʴ�b�� 404ҳ��
 * modified by goyinxu 2016-08-26
 * �����ַ��gaoyinxu@fang.com��
 */
define('modules/bask/jump', ['jquery'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var numDom, num, intervalTimer;
        numDom = $('#nofound');
        num = parseInt(numDom.text());
        setInterval(function () {
            num--;
            numDom.text(num);
            if (num <= 0) {
                num = 1;
                window.location = vars.askSite + '?c=bask&a=index&zhcity=' + vars.city + '&grouptype=' + vars.grouptype + '&src=client';
            }
        }, 1000);
    };
});