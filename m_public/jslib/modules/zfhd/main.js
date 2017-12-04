/**
 * 优惠券入口主类
 * by loupeiye
 * 20151203 loupeiye
 */
define('modules/zfhd/main', [], function (require) {
    'use strict';
    // 页面传入的参数
    var vars = seajs.data.vars;
    $('input[type=hidden]').each(function (index, element) {
        vars[$(this).attr('data-id')] = element.value;
    });
    
    if (vars.action) {
        require.async(['modules/zfhd/' + vars.action], function (run) {
            run();
        });
    }
    // 引入统计js代码
    require.async('count/loadforwapandm.min.js');
    require.async('count/loadonlyga.min.js');
});