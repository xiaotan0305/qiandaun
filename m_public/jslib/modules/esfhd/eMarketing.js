/**
 * Created by zhuqinglin on 2017/4/26.
 *判断用户登录跳转链接
 */
define('modules/esfhd/eMarketing', function(require,exports,module){
    'use strict';
    module.exports = function () {
        // jquery对象
        var $ = require('jquery');
        // seajs 数据对象
        var vars = seajs.data.vars;
        //参加按钮
        var join = $('.join');
        var url = vars.esfSite + '?c=esfhd&a=ajaxCheckJjr&city=' + vars.city;
        //ajax标志
        var ajaxFlag = 0;
        //点击事件
        join.click(function(){
            if (vars.login) {
                // 如果再次调用时前一个ajax在执行，终止此次ajax的执行
                if (ajaxFlag) {
                    ajaxFlag.abort();
                }
                ajaxFlag = $.ajax({
                    url: url,
                    success: function (data) {
                        if (data.result === '1') {
                            var joinUrl = vars.esfSite + '?c=esfhd&a=xqPicPerfectAD&city=' + vars.city + '&agentid=' + data.login.agentid + '&agentType=DS';
                            window.location.href = joinUrl;
                        } else if (data.result === '-99') {
                            alert(data.message);
                        } else if (data === 'notlogin') {
                             window.location.href = vars.furl;
                        }
                    }
                });

            } else {
                window.location.href = vars.furl;
            }
        });
        
    };
});