/**
 * Created by zdl on 2016/8/29.
 * ���� zhangdaliang@fang.com
 */
define('modules/top/esfLoupanSearch',['jquery','lazyload/1.9.1/lazyload'],function (require,exports,module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        // ͼƬ���Լ���
        require('lazyload/1.9.1/lazyload');
        $('.lazyload').lazyload();
        // ��ҳ������˲���ʱ���ظ���ʱ��div
        $(document).on('touchstart',function () {
            $('.updata-time').hide();
        });
    };
});