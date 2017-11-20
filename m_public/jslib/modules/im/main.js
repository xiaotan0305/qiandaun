/**
 * Created by WeiRF on 2016/1/15.
 * IM聊天的入口模块
 */
define('modules/im/main', [], function (require) {
    'use strict';
    var vars = seajs.data.vars;
    var c = window.localStorage;
    // 处理localStorage，防止在隐私模式下出错
    try {
        c && c.setItem('testPrivateModel', !1);
    } catch (d) {
        c = null;
    }
    vars.localStorage = c;
    // 各个主页面的主js入口
    if (vars.action) {
        var action = 'modules/im/' +  vars.action;
        require.async(action);
    }
});