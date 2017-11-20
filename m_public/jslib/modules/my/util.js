define('modules/my/util', [], function (require, exports, module) {
    'use strict';
    module.exports = {
        // 数字输入code
        validateNum: function (codePara) {
            var code = Number(codePara);
            // 95-106:0-9 |47-58:0-9 |110|190:. 37:<- 39:-> 8:backspace
            if (code > 95 && code < 106 || code > 47 && code < 58 || code === 110 || code === 190 || code === 37 || code === 39 || code === 8) {
                return true;
            }
        },
        // 手机号码验证
        verifyTelphone: function (str) {
            return /^1[34578]{1}[0-9]{9}$/.test(str);
        },
        isNumber: function (str) {
            return isNaN(str);
        },
        // xss验证
        stripscript: function (s) {
            return s.replace(/[\<\>\(\)\;\{\}\'\'\[\]\/\!\,]/g, '');
        },
        validateXss: function (s) {
            return s.match(/[\<\>\(\)\;\{\}\'\'\[\]\/\!\,]/);
        },
        displayLoseFn: function (numPara, keywords, url, thisNode) {
            var num = numPara;
            var errorTimer = setInterval(function () {
                num--;
                thisNode.sendFloat.css('display', 'block');
                thisNode.sendText.html(keywords);
                if (num <= 0) {
                    clearInterval(errorTimer);
                    thisNode.sendFloat.css('display', 'none');
                    thisNode.sendText.html('');
                    thisNode.floatLayer.hide();
                    if (url) {
                        window.location.href = url;
                    }
                }
            }, 1000);
        }
    };
});