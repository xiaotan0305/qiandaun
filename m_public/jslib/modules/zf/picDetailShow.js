/**
 * Created by sf on 14-10-16.
 */
define('modules/zf/picDetailShow', ['jquery'], function (require, exports, module) {
    'use strict';
    module.exports = function (options) {
        var $ = require('jquery');
        require.async('lazyload/1.9.1/lazyload', function () {
            $('.itemPic img').lazyload();
        });
    };
});