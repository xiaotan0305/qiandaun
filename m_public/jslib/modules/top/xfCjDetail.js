/**
 * Created by zdl on 2016/8/25.
 * 邮箱 zhangdaliang@fang.com
 */
define('modules/top/xfCjDetail', ['modules/world/yhxw', 'jquery', 'lazyload/1.9.1/lazyload'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        // 引入用户行为分析对象-埋码
        var yhxw = require('modules/world/yhxw');
        var maimaParams = {
            'vmg.page': 'cj_xf^lb_wap'
        };
        yhxw({
            pageId: 'cj_xf^lb_wap',
            params: maimaParams
        });
        require('lazyload/1.9.1/lazyload');
        // 图片惰性加载
        $('.lazyload').lazyload();
        // 对页面进行了操作时隐藏更新时间div
        $(document).on('touchstart', function () {
            $('.updata-time').hide();
        });
    };
});
