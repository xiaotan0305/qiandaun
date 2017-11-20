/**
 * seajs/2.3.0/config.js
 * seajs相关配置。
 * @author yueyanlei
 */
;(function (win) {
    'use strict';
    var vars = win._vars || (win._vars = {});
    // 设置seajs根目录地址
    vars.base = vars.public + 'jslib/';
    // 设置当前协议
    vars.protocol = win.location.protocol;
    // 域名匹配
    var pattern = /\/\/([^.]+)\.([^.]+\.)*soufunimg\.com/;
    var match = pattern.exec(vars.public);
    // 设置seajs配置对象
    var config = {
        base: vars.base,
        // 别名，利于较长的模块名的简化
        alias: {
            jquery: 'jquery/2.1.4/jquery',
            util: 'util/util'
        },
        // 映射关系，作用为将获取的js文件增加版本号，下面的正则作用为不对jquery.js做版本号处理，！一般情况下库都是稳定的
        // uri.substr(uri.lastIndexOf('/') + 1) === 'jquery.js' ? uri :
        // loadonlyga.min.js loadforwapandm.min.js
        map: [function (uri) {
            if (uri.indexOf('?') === -1) {
                uri += '?_' + vars.img_ver;
			}
            return uri;
        }],
        // 与别名类似，就是给地址中的js换一个别名，利于之后的模块引用
        paths: {
            count: '//' + (match ? match[1] : 'js') + '.soufunimg.com/count',
            jsub: '//' + (vars.protocol === 'http:' ? 'js.ub' : 'jsub') + '.fang.com'
        },
        // 合并后缀
        comboSuffix: '?_' + vars.img_ver,
        vars: vars
    };
    // 只有测试站或正式站, 才进行合并加载，否则不合并。
    if (!match) {
        config.comboExcludes = function () {
            return true;
        };
    }

    var seajs = win.seajs;
    seajs.config(config);
    // js错误信息捕捉
    /*win.onerror = function () {
        if (arguments[0] === 'Script error.')return;
        // 将所有的错误数据用|分割为一个字符串
        var err = Array.prototype.join.call(arguments, '|');
        var $ = win.jQuery;
        var get = $ && $.get;
        // 传入后台
        get && get('/xf.d?m=collectjserrordata', {errordata: err});
    };*/
})(window);
