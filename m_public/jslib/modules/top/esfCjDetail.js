/**
 * Created by zdl on 2016/8/25.
 * 邮箱 zhangdaliang@fang.com
 */
define('modules/top/esfCjDetail', ['modules/world/yhxw', 'jquery', 'lazyload/1.9.1/lazyload'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        require('lazyload/1.9.1/lazyload');
        // 图片惰性加载
        $('.lazyload').lazyload();
        // 引入用户行为分析对象-埋码
        var yhxw = require('modules/world/yhxw');
        var maimaParams = {
            'vmg.page': 'cj_esf^lb_wap'
        };
        yhxw({
            pageId: 'cj_esf^lb_wap',
            params: maimaParams
        });
        // 对页面进行了操作时隐藏更新时间div
        $(document).on('touchstart', function () {
            $('.updata-time').hide();
        });
    };
});