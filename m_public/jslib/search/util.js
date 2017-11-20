/**
 * 搜索工具类
 * 为了后台数据的千奇百怪做出的必要方法处理
 * by blue
 */
define("search/util", [], function (require, exports, module) {
    //获取当前页面ua
    var UA = window.navigator.userAgent.toLowerCase();
    module.exports = {
        /**
         * 判断是否可以点击，兼容性判断iscroll插件a点击操作
         * @returns {boolean}
         */
        iScrollClick: function () {
            if (/iphone|ipad|ipod|macintosh/i.test(UA)) return true;
            if (/samsung/i.test(UA)) return true;
            if (/chrome/i.test(UA)) return /android/i.test(UA);
            if (/ucbrowser/i.test(UA)) {
                if (/cmcc/i.test(UA)) {
                    return true;
                }
                var sa = UA.substr(UA.indexOf('ucbrowser/') + 10, 4).split('.');
                return parseFloat(sa[0] + sa[1]) >= 98;
            }
            if (/silk/i.test(UA)) return false;
            if (/android/i.test(UA)) {
                var s = UA.substr(UA.indexOf('android') + 8, 3);
                if (parseFloat(s[0] + s[2]) >= 44 || /MQQBrowser/i.test(UA)) {
                    return true;
                } else if (parseFloat(s[0] + s[2]) === 41) {
                    return true;
                }
                return false;
            }
        },
        /**
         * 根据住宅用途获取关键字后缀
         * @param str
         * @returns {*}
         */
        getSuffix: function (str) {
            if (str === '出租') {
                str = '租房';
            } else if (str === '出售') {
                str = '二手房';
            }
            return str;
        },
        /**
         * 获取楼盘后缀
         * @param y
         * @param p
         * @returns {*}
         */
        getPropertySuffix: function (y, p) {
            if (p === '住宅' || p === '' || y === '新房') {
                return this.getSuffix(y);
            }
            return p + y;
        }
    }
});
