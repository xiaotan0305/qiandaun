/**
 * requestAnimationFrame属性兼容性写法
 * by blue
 */
(function (w, f) {
    'use strict';
    if (typeof define === 'function') {
        define('chart/raf/1.0.0/raf', [], function () {
            return f(w);
        });
    } else if (typeof exports === 'object') {
        module.exports = f(w);
    } else {
        w.Raf = f(w);
    }
})(window, function factory(w) {
    'use strict';
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    // 根据前缀判断是否存在requestAnimationFrame方法
    for (var x = 0; x < vendors.length && !w.requestAnimationFrame; ++x) {
        w.requestAnimationFrame = w[vendors[x] + 'RequestAnimationFrame'];
        // Webkit中此取消方法的名字变了
        w.cancelAnimationFrame = w[vendors[x] + 'CancelAnimationFrame']
            || w[vendors[x] + 'CancelRequestAnimationFrame'];
    }
    // 如果没有requestAnimationFrame方法设置setTimeout方法代替
    if (!w.requestAnimationFrame) {
        w.requestAnimationFrame = function (callback) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
            var id = w.setTimeout(function () {
                callback(currTime + timeToCall);
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }
    // 如果没有取消requestAnimationFrame方法设置clearTimeout方法代替
    if (!w.cancelAnimationFrame) {
        w.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
    }
});