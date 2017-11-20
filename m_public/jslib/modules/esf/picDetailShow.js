/**
 * @file jsºÏ²¢£¬ESLint
 * @author lina(lina.bj@soufun.com)
 */
define('modules/esf/picDetailShow',['jquery','lazyload/1.9.1/lazyload'],function (require,exports,module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var lazyload = require('lazyload/1.9.1/lazyload');
        $(document).ready(function () {
            $('.itemPic').find('img').css({'width':'75px','height':'55px'}).lazyload();
        });
        window.scrollTo(0, 1);

    };
});
