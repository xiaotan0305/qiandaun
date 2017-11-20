/**
 * 验证对象类
 * 返回的是一个对象可以直接使用，而无需new初始化
 * by blue
 */
(function (f) {
    'use strict';
    // 用于amd、cmd和普通方式调用js判断
    if (typeof define === 'function') {
        define('verification/1.0.0/verification', [], function () {
            return f();
        });
    } else if (typeof exports === 'object') {
        module.exports = f();
    } else {
        window.Verification = f();
    }
})(function () {
    'use strict';
    return {

        /**
         * 匹配邮箱
         * @param str
         * @returns {boolean}
         */
        isEmail: function (str) {
            return /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(str);
        },

        /**
         * 匹配地址
         * @param str
         * @returns {boolean}
         */
        isUrl: function (str) {
            return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(str);
        },

        /**
         * 匹配ip地址
         * @param str
         * @returns {boolean}
         */
        isIp: function (str) {
            return /^((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})$/i.test(str);
        },

        /**
         * 匹配手机号码
         * @param str
         * @returns {boolean}
         */
        isMobilePhoneNumber: function (str) {
            return /^1[34578][0-9]{9}$/.test(str);
        },

        /**
         * 匹配汉字
         * @returns {boolean}
         */
        isChineseChar: function (str) {
            return /^[\u4E00-\u9FA3]+$/.test(str);
        }
    };
});