/**
 * 滑动筛选框类
 * by blue
 */
(function (w, f) {
    'use strict';
    if (typeof define === 'function') {
        // AMD
        define('slideFilterBox/1.0.0/slideFilterBox', ['iscroll/2.0.0/iscroll-lite'], function (require) {
            var IScroll = require('iscroll/2.0.0/iscroll-lite');
            return f(window, IScroll);
        });
    } else if (typeof exports === 'object') {
        // CommonJS
        module.exports = f(window, window.IScroll || window.IScrollLite);
    } else {
        // browser global
        window.SlideFilterBox = f(window, window.IScroll || window.IScrollLite);
    }
})(window, function (w, IScroll) {
    'use strict';

    /**
     * 滑动筛选主类
     * @constructor
     */
    function SlideFilterBox() {
        this.scrollObj = {};
    }

    SlideFilterBox.prototype = {

        /**
         * 初始化滑动选择器
         * @param str 传入的滑动选择器容器的id或者class，形如#id或者.class
         */
        init: function (str) {
            // 获取当前dom
            var o = document.querySelector(str);
            if (!o) return;
            var displayIdx = 0;
            var childArr = o.children;
            var childArrL = childArr.length;
            if (childArrL > 1) {
                // 循环遍历容器中display不是none的子节点，找到这个显示的子节点的索引
                for (var i = 0; i < childArrL; i++) {
                    if (childArr[i].style.display !== 'none') {
                        displayIdx = i;
                        break;
                    }
                }
            }

            /**
             * 将索引值储存到scrollObj对象中
             * 并且声明滑动类创建该索引子节点的滑动选择器，之后储存在scrollObj对象中
             * @type {{idx: number, scrollCls: (*|IScroll)}}
             */
            this.scrollObj[str] = {
                idx: displayIdx,
                scrollCls: new IScroll(str, {click: true, bindToWrapper: true,preventDefault:false}, displayIdx)
            };
        },

        /**
         * 设置筛选框滑动到的位置
         * @param str 滑动名称
         * @param y y轴的移动距离
         * @param time 移动的缓动时间
         */
        to: function (str, y, time) {
            // 如果没有传荣time参数，则默认不缓动，time设置为0
            if (!time) {
                time = 0;
            }
            this.scrollObj[str].scrollCls.scrollTo(0, y, time);
        },

        /**
         * 创建或者刷新滑动选择器
         * @param str 传入指定的dom id或者class类
         */
        refresh: function (str) {
            var that = this;
            if (that.scrollObj.hasOwnProperty(str)) {
                var displayIdx = 0;
                var o = document.querySelector(str);
                var childArr = o.children;
                var childArrL = childArr.length;
                if (childArrL > 1) {
                    // 循环遍历容器中display不是none的子节点，找到这个显示的子节点的索引
                    for (var i = 0; i < childArrL; i++) {
                        if (childArr[i].style.display !== 'none') {
                            displayIdx = i;
                            break;
                        }
                    }
                }
                // 如果索引相同，那么刷新，如果不同则清除上一个滑动控制器，重新创建
                if (displayIdx === that.scrollObj[str].idx) {
                    this.scrollObj[str].scrollCls.refresh();
                } else {
                    that.scrollObj[str].scrollCls.destroy();
                    delete that.scrollObj[str];
                    this.init(str);
                }
            } else {
                // 在scrollObj对象中不存在该str属性则初始化一个滑动选择器
                this.init(str);
            }
        }
    };
    return new SlideFilterBox();
});