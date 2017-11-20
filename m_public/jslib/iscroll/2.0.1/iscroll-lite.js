/* ! iScroll v5.1.2 ~ (c) 2008-2014 Matteo Spinelli ~ http://cubiq.org/license */
/**
 * iscroll插件详解
 * by blue
 * 20151110 blue 增加全部注释，并符合规范要求，删除无用代码，替换原生代码为jquery形式
 */
(function (w, f) {
    'use strict';
    if (typeof define === 'function') {
        // AMD
        define('iscroll/2.0.0/iscroll-lite', ['jquery', 'chart/raf/1.0.0/raf'], function (require) {
            // 载入requestAnimationFrame兼容性写法
            require('chart/raf/1.0.0/raf');
            var $ = require('jquery');
            return f(w, $);
        });
    } else if (typeof exports === 'object') {
        // CommonJS
        module.exports = f(w, w.jQuery);
    } else {
        // browser global
        w.IScrollLite2 = f(w, w.jQuery);
    }
})(window, function (w, $) {
    'use strict';
    // 声明requestAnimationFrame兼容性写法
    var rAF = w.requestAnimationFrame;
    // 工具集
    var utils = (function () {
        // 工具集对象
        var me = {};
        // 创建一个空节点，获取样式属性对象
        var elementStyle = $('<div></div>')[0].style;
        // 根据transform样式获取支持的浏览器前缀，不支持则返回false
        var vendor = (function () {
            var vendors = ['t', 'webkitT', 'MozT', 'msT', 'OT'],
                transform,
                i = 0,
                l = vendors.length;
            for (; i < l; i++) {
                transform = vendors[i] + 'ransform';
                if (transform in elementStyle) return vendors[i].substr(0, vendors[i].length - 1);
            }
            return false;
        })();

        /**
         * 增加前缀函数，给所有存在兼容性的属性增加前缀
         * @param style 需要添加前缀的样式名
         * @returns {*}
         * @private
         */
        function prefixStyle(style) {
            if (vendor === false) return false;
            if (vendor === '') return style;
            return vendor + style.charAt(0).toUpperCase() + style.substr(1);
        }

        /**
         * 判断是否支持Date.now直接获取当前时间戳，否者执行通用时间戳获取当前时间戳
         * @type {*|Function}
         */
        me.getTime = Date.now || function getTime() {
                return new Date().getTime();
            };

        /**
         * 绑定事件
         * @param el
         * @param type
         * @param fn
         */
        me.addEvent = function (el, type, fn) {
            $(el).on(type, fn);
        };

        /**
         * 解绑事件
         * @param el
         * @param type
         * @param fn
         */
        me.removeEvent = function (el, type, fn) {
            $(el).off(type, fn);
        };

        /**
         * MSPointerEvent 指针事件是一些事件和相关接口，用于处理来自鼠标、手写笔或触摸屏等设备的硬件不可知的指针输入
         * ，IE10引入，IE11去掉前缀，其他浏览器都不支持指针事件。
         * @param pointerEvent
         * @returns {*}
         */
        me.prefixPointerEvent = function (pointerEvent) {
            return w.MSPointerEvent ? 'MSPointer'
            + pointerEvent.charAt(9).toUpperCase() + pointerEvent.substr(10) : pointerEvent;
        };

        /**
         * 根据我们的拖动返回运动的长度与耗时，用于惯性拖动判断
         * @param current 当前鼠标位置
         * @param start touchStart时候记录的Y（可能是X）的开始位置，但是在touchmove时候可能被重写
         * @param time touchstart到手指离开时候经历的时间，同样可能被touchmove重写
         * @param lowerMargin y可移动的最大距离，这个一般为计算得出 this.wrapperHeight - this.scrollerHeight
         * @param wrapperSize 如果有边界距离的话就是可拖动，不然碰到0的时候便停止
         * @param deceleration 减速系数（加速度）
         * @returns {{destination: number, duration: number}}
         */
        me.momentum = function (current, start, time, lowerMargin, wrapperSize, deceleration) {
            // 移动的距离
            var distance = current - start,
            // 多快的速度(以匀减速为例，这里算出来的就是初始速度)
                speed = Math.abs(distance) / time,
                destination,
                duration;
            // 减速系数（以匀减速为例，这里算出来的就是加速度）
            deceleration = deceleration === undefined ? 0.0006 : deceleration;
            // 根据速度公式算出终点位移(以匀减速为例,v^2=2as算出位移间隔，之后根据初位移算出之后停在哪里)
            destination = current + ( speed * speed ) / ( 2 * deceleration ) * ( distance < 0 ? -1 : 1 );
            // 算出到达终点位置需要的时间，根据公式v=at
            duration = speed / deceleration;
            // 判断两个极端，如果滑出了最大位置
            if (destination < lowerMargin) {
                // 重新赋值终点位置，！！！这里没有看懂
                destination = wrapperSize ? lowerMargin - ( wrapperSize / 2.5 * ( speed / 8 ) ) : lowerMargin;
                distance = Math.abs(destination - current);
                duration = distance / speed;
                // 滑出了最小位置
            } else if (destination > 0) {
                // 最终距离已经超出了边界位置
                destination = wrapperSize ? wrapperSize / 2.5 * ( speed / 8 ) : 0;
                distance = Math.abs(current) + destination;
                duration = distance / speed;
            }
            // 返回终点位置以及经过时间
            return {
                destination: Math.round(destination),
                duration: duration
            };
        };
        // 获取transform属性
        var transform = prefixStyle('transform');

        $.extend(me, {
            // 支持transform属性
            hasTransform: transform !== false,
            // 支持3d视距属性
            hasPerspective: prefixStyle('perspective') in elementStyle,
            // 支持touch事件
            hasTouch: 'ontouchstart' in w,
            // 支持指针事件，IE10是MSPointerEvent，之后统一改成了PointerEvent
            hasPointer: w.PointerEvent || w.MSPointerEvent,
            // 是否支持css3缓动属性
            hasTransition: prefixStyle('transition') in elementStyle
        });
        // 给me的style赋值属性
        $.extend(me.style = {}, {
            // 带有前缀的transform属性
            transform: transform,
            // 带有前缀的transformAPI，包括end事件等等
            transitionTimingFunction: prefixStyle('transitionTimingFunction'),
            // 包括前缀的缓动持续时间样式
            transitionDuration: prefixStyle('transitionDuration'),
            // 包括前缀的缓动延迟时间样式
            transitionDelay: prefixStyle('transitionDelay'),
            // 包括前缀的设置变形原点的样式
            transformOrigin: prefixStyle('transformOrigin')
        });

        /**
         * 获取元素的偏移量
         * @param el
         * @returns {{left: number, top: number}}
         */
        me.offset = function (el) {
            var $el = $(el);
            var left = $el.offset().left,
                top = $el.offset().top;
            return {
                left: left,
                top: top
            };
        };

        /**
         * 用来比较是否在某些类型的节点上使用preventDefault
         * @param el
         * @param exceptions
         * @returns {boolean}
         */
        me.preventDefaultException = function (el, exceptions) {
            for (var i in exceptions) {
                if (exceptions.hasOwnProperty(i) && exceptions[i].test(el[i])) {
                    return true;
                }
            }
            return false;
        };

        // 拓展me对象的eventType属性，声明所有事件名称
        $.extend(me.eventType = {}, {
            // 触摸事件名
            touchstart: 1,
            touchmove: 1,
            touchend: 1,
            // 鼠标事件名
            mousedown: 2,
            mousemove: 2,
            mouseup: 2,
            // 指针事件名
            pointerdown: 3,
            pointermove: 3,
            pointerup: 3,
            // ie10指针事件名
            MSPointerDown: 3,
            MSPointerMove: 3,
            MSPointerUp: 3
        });
        // 拓展me对象的ease属性，将所有的css3样式缓动和函数缓动公式写入
        // 这部分可以自行查询使用缓动公式后的缓动样式,推荐个网站http://easings.net/zh-cn
        $.extend(me.ease = {}, {
            quadratic: {
                style: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                fn: function (k) {
                    return k * ( 2 - k );
                }
            },
            circular: {
                // Not properly "circular" but this looks better, it should be (0.075, 0.82, 0.165, 1)
                style: 'cubic-bezier(0.1, 0.57, 0.1, 1)',
                fn: function (k) {
                    return Math.sqrt(1 - (--k * k));
                }
            }
        });

        /**
         * click事件声明
         * @param {{view}}e
         */
        me.click = function (e) {
            var target = $(e.target);
            // 当不是select、input、textarea这三种节点时触发
            if (!(/(SELECT|INPUT|TEXTAREA)/i).test(target[0].tagName)) {
                target.constructed = true;
                target.trigger('click');
            }
        };
        return me;
    })();

    /**
     * iscroll插件主类
     * @param el 需要设置滑动的实例，可以是id也可以是原生方法获取的节点对象，这里要注意，由于使用的是querySelector方法，所有类名要加点，id要加井号
     * @param options 配置属性
     * @param idx 我添加的一个参数，用来当一个父类中含有多个子节点可以滑动时，指定特定的一个子节点滑动
     * @constructor
     */
    function IScroll(el, options, idx) {
        // 获取滑动父类实例
        this.wrapper = typeof el === 'string' ? document.querySelector(el) : el;
        // 没有指定那个子节点滑动时，默认为第一个孩子节点
        var childrenIdx = idx ? idx : 0;
        // 获取滑动块节点
        this.scroller = this.wrapper.children[childrenIdx];
        // cache style for better performance
        // 缓存滑动块样式
        this.scrollerStyle = this.scroller.style;
        // 默认配置
        this.options = {
            // 我添加的一个属性，用来指定停止时触发事件
            specialEnd: false,
            // 滑动块开始的x轴位置
            startX: 0,
            // 滑动块开始的y轴位置
            startY: 0,
            // 默认纵向滑动
            scrollY: true,
            // 方向锁定阈值，有这个值在时，只要拖拽超过5像素则使浏览器默认行为失效
            directionLockThreshold: 5,
            // 允许点击
            click: true,
            // 是否启用动能公式
            momentum: true,
            // 边界缓动
            bounce: true,
            // 缓动时间
            bounceTime: 600,
            // 缓动公式
            bounceEasing: '',
            // 禁止默认行为的正则,input一般情况向会用到所以去了
            preventDefaultException: {tagName: /^(TEXTAREA|BUTTON|SELECT)$/},
            // 启动硬件加速
            HWCompositing: true,
            // 移动端设置滚动为本身能防止在首页面加载时直接滑动页面a标签会触发点击的bug
            bindToWrapper: utils.hasTouch
        };

        /**
         * 循环所有传入配置覆盖默认配置
         */
        for (var i in options) {
            if (options.hasOwnProperty(i)) {
                this.options[i] = options[i];
            }
        }
        // 设置z轴，用来启动硬件加速
        this.translateZ = this.options.HWCompositing && utils.hasPerspective ? ' translateZ(0)' : '';
        // 使用css缓动
        this.options.useTransition = utils.hasTransition;
        // 使用transform样式
        this.options.useTransform = utils.hasTransform;
        // 是否允许横向滑动时纵向遵从浏览器页面滚动
        this.options.eventPassthrough = this.options.eventPassthrough === true ? 'vertical' : this.options.eventPassthrough;
        // 当不遵从浏览器滚动时，禁止默认浏览器事件
        this.options.preventDefault = !this.options.eventPassthrough && this.options.preventDefault;
        // If you want eventPassthrough I have to lock one of the axes
        // 使用遵循页面滚动，那么要固定一个轴，也就是说，只允许纵轴滑动或者横轴滑动中的一个
        this.options.scrollY = this.options.eventPassthrough === 'vertical' ? false : this.options.scrollY;
        this.options.scrollX = this.options.eventPassthrough === 'horizontal' ? false : this.options.scrollX;
        // With eventPassthrough we also need lockDirection mechanism
        // 如果没有设置自由滑动，并且不遵循页面滚动时，才能够自由滑动
        this.options.freeScroll = this.options.freeScroll && !this.options.eventPassthrough;
        // 方向锁定阈值
        this.options.directionLockThreshold = this.options.eventPassthrough ? 0 : this.options.directionLockThreshold;
        // 设置缓动函数
        this.options.bounceEasing = typeof this.options.bounceEasing === 'string' ? utils.ease[this.options.bounceEasing]
        || utils.ease.circular : this.options.bounceEasing;
        // 重设轮训时间，默认60
        this.options.resizePolling = this.options.resizePolling === undefined ? 60 : this.options.resizePolling;
        // 默认位置
        this.x = 0;
        this.y = 0;
        // 默认方向
        this.directionX = 0;
        this.directionY = 0;
        // 事件对象
        this.events = {};
        // 执行初始化函数
        this.init();
        // 执行刷新
        this.refresh();
        // 设置初始化位置
        this.scrollTo(this.options.startX, this.options.startY);
        // 设置可以操作
        this.enable();
    }

    /**
     * 原形链
     * @type {{version: string, init: Function, destroy: Function, transitionEnd: Function, start: Function, move: Function, end: Function, resize: Function, resetPosition: Function, disable: Function, enable: Function, refresh: Function, on: Function, off: Function, execEvent: Function, scrollBy: Function, scrollTo: Function, scrollToElement: Function, transitionTime: Function, transitionTimingFunction: Function, translate: Function, initEvents: Function, getComputedPosition: Function, animate: Function, handleEvent: Function}}
     */
    IScroll.prototype = {
        // 版本
        version: '5.1.2',

        /**
         * 初始化函数
         * @private
         */
        init: function () {
            // 初始化事件监听
            this.initEvents();
        },

        /**
         * 销毁函数
         */
        destroy: function () {
            // 传入true后解绑所有事件
            this.initEvents(true);
            // 执行destroy绑定方法
            this.execEvent('destroy');
        },

        /**
         * 触边动效结束执行
         * @param e
         * @private
         */
        transitionEnd: function (e) {
            var that = this;
            // 缓动没结束或者不是该滑动块时返回
            if (e.target !== that.scroller || !that.isInTransition) {
                return;
            }
            // 设置缓动时间
            that.transitionTime();
            // 如果是最终位置，则设置停止
            if (!that.resetPosition(that.options.bounceTime)) {
                that.isInTransition = false;
                that.execEvent('scrollEnd');
            }
        },

        /**
         * 开始触发函数，相当于鼠标按下，触摸开始操作
         * @param e
         * @private
         */
        start: function (e) {
            // React to left mouse button only
            var that = this;
            // 只对鼠标左键反应
            if (utils.eventType[e.type] !== 1) {
                // button返回是那个鼠标键触发，0左键1中键2右键
                if (e.button !== 0) {
                    return;
                }
            }
            // 如果当前不能操作或者已经点击过并且事件名不等则返回，这里作用是防止move中触发了start
            if (!that.enabled || (that.initiated && utils.eventType[e.type] !== that.initiated)) {
                return;
            }
            // 不是低版本安卓并且设置了禁止浏览器默认并且不是正则中匹配的节点时，禁止默认浏览器事件
            if (that.options.preventDefault  && !utils.preventDefaultException(e.target, that.options.preventDefaultException)) {
                e.preventDefault();
            }
            // 获取按下的点
            var point = e.touches ? e.touches[0] : e,
                pos;
            // 设置有事件触发执行
            this.initiated = utils.eventType[e.type];
            // 初始化用户操作所需值
            this.moved = false;
            this.distX = 0;
            this.distY = 0;
            this.directionX = 0;
            this.directionY = 0;
            this.directionLocked = 0;
            // 初始化缓动时间
            this.transitionTime();
            // 获取开始时间
            this.startTime = utils.getTime();
            // 可以使用css3缓动样式并且正在缓动过程中时
            if (this.options.useTransition && this.isInTransition) {
                // 缓动过程设置为结束
                this.isInTransition = false;
                pos = this.getComputedPosition();
                // 移动到该位置
                this.translate(Math.round(pos.x), Math.round(pos.y));
                // 如果是特殊滑动时，不触发scrollEnd事件
                this.options.specialEnd || this.execEvent('scrollEnd');
            } else if (!this.options.useTransition && this.isAnimating) {
                // 没有使用css缓动样式，使用js缓动公式计算的滑动时
                // 当在缓动中
                // 设置不再缓动
                this.isAnimating = false;
                // 如果是特殊滑动时，不触发scrollEnd事件
                this.options.specialEnd || this.execEvent('scrollEnd');
            }
            // 设置开始的xy坐标
            this.startX = this.x;
            this.startY = this.y;
            // 设置正式的页面位置
            this.pointX = point.pageX;
            this.pointY = point.pageY;
            // 触发beforeScrollStart事件
            this.execEvent('beforeScrollStart');
        },

        /**
         * 鼠标滑动或者触摸滑动操作
         * @param e
         * @private
         */
        move: function (e) {
            var that = this;
            // 当不可操作或者事件不等时
            if (!that.enabled || utils.eventType[e.type] !== that.initiated) {
                return;
            }
            // increases performance on Android? TODO: check!
            // 这里作者不确定能够在安卓上提高性能，但是由于事件的bug有些机种会出现只触发一次的bug以及可能的浏览器手势影响，这里是必要的
            if (that.options.preventDefault) {
                e.preventDefault();
            }
            // 获取当前点
            var point = e.touches ? e.touches[0] : e,
            // 计算偏移量
                deltaX = point.pageX - this.pointX,
                deltaY = point.pageY - this.pointY,
            // 获取当前事件戳
                timestamp = utils.getTime(),
            // 计算使用的变量声明
                newX, newY,
                absDistX, absDistY;
            // 当前页面真实点位置
            this.pointX = point.pageX;
            this.pointY = point.pageY;
            // 积累的x和y位移
            this.distX += deltaX;
            this.distY += deltaY;
            // 取正后的位移
            absDistX = Math.abs(this.distX);
            absDistY = Math.abs(this.distY);
            // We need to move at least 10 pixels for the scrolling to initiate
            // 这里的意思是滑动到开始时间大于300并且位移大于10像素时才触发滑动
            if (timestamp - this.endTime > 300 && (absDistX < 10 && absDistY < 10)) {
                return;
            }
            // If you are scrolling in one direction lock the other
            // 当没有方向锁定并且没有设置自由滑动时，对方向加锁
            if (!this.directionLocked && !this.options.freeScroll) {
                if (absDistX > absDistY + this.options.directionLockThreshold) {
                    this.directionLocked = 'h';
                } else if (absDistY >= absDistX + this.options.directionLockThreshold) {
                    this.directionLocked = 'v';
                } else {
                    this.directionLocked = 'n';
                }
            }

            if (this.directionLocked === 'h') {
                if (this.options.eventPassthrough === 'vertical') {
                    e.preventDefault();
                } else if (this.options.eventPassthrough === 'horizontal') {
                    this.initiated = false;
                    return;
                }
                deltaY = 0;
            } else if (this.directionLocked === 'v') {
                if (this.options.eventPassthrough === 'horizontal') {
                    e.preventDefault();
                } else if (this.options.eventPassthrough === 'vertical') {
                    this.initiated = false;
                    return;
                }
                deltaX = 0;
            }

            deltaX = this.hasHorizontalScroll ? deltaX : 0;
            deltaY = this.hasVerticalScroll ? deltaY : 0;

            newX = this.x + deltaX;
            newY = this.y + deltaY;

            // Slow down if outside of the boundaries
            if (newX > 0 || newX < this.maxScrollX) {
                newX = this.options.bounce ? this.x + deltaX / 3 : newX > 0 ? 0 : this.maxScrollX;
            }
            if (newY > 0 || newY < this.maxScrollY) {
                newY = this.options.bounce ? this.y + deltaY / 3 : newY > 0 ? 0 : this.maxScrollY;
            }

            this.directionX = deltaX > 0 ? -1 : deltaX < 0 ? 1 : 0;
            this.directionY = deltaY > 0 ? -1 : deltaY < 0 ? 1 : 0;

            if (!this.moved) {
                this.execEvent('scrollStart');
            }

            this.moved = true;

            this.translate(newX, newY);

            /* REPLACE START: _move */

            if (timestamp - this.startTime > 300) {
                this.startTime = timestamp;
                this.startX = this.x;
                this.startY = this.y;
            }

            /* REPLACE END: _move */

        },

        end: function (e) {
            // 判断是否要结束
            if (!this.enabled || utils.eventType[e.type] !== this.initiated) {
                return;
            }
            // 设置取消浏览器默认事件
            if (this.options.preventDefault && !utils.preventDefaultException(e.target, this.options.preventDefaultException)) {
                e.preventDefault();
            }
            // 缓动x坐标
            var momentumX,
            // 缓动y坐标
                momentumY,
            // 当前时间到开始滑动经过的时间间隔
                duration = utils.getTime() - this.startTime,
            // 当前的x坐标位置
                newX = Math.round(this.x),
            // 当前y坐标位置
                newY = Math.round(this.y),
            // 从开始滑动到结束的x距离间隔
                distanceX = Math.abs(newX - this.startX),
            //  从开始滑动到结束的y距离间隔
                distanceY = Math.abs(newY - this.startY),
            // 事件索引
                time = 0,
            // 缓动函数
                easing = '';
            // 设置css样式缓动结束标识
            this.isInTransition = 0;
            // 重置起始事件标识
            this.initiated = 0;
            // 设置结束时间
            this.endTime = utils.getTime();
            // reset if we are outside of the boundaries
            // 如果缓动到了外面则结束重置
            if (this.resetPosition(this.options.bounceTime)) {
                return;
            }
            // ensures that the last position is rounded
            // 设置到当前位置
            this.scrollTo(newX, newY);
            // we scrolled less than 10 pixels
            // 如果移动了至少10像素点
            if (!this.moved) {
                // 设置了点击则触发click事件
                if (this.options.click) {
                    utils.click(e);
                }
                // 触发scrollCancel事件
                this.execEvent('scrollCancel');
                return;
            }
            // !!!作用不明
            if (this.events.flick && duration < 200 && distanceX < 100 && distanceY < 100) {
                this.execEvent('flick');
                return;
            }
            // start momentum animation if needed
            // 如果需要缓动公式缓动的话
            if (this.options.momentum && duration < 300) {
                momentumX = this.hasHorizontalScroll ? utils.momentum(this.x, this.startX, duration, this.maxScrollX, this.options.bounce ? this.wrapperWidth : 0, this.options.deceleration) : {
                    destination: newX,
                    duration: 0
                };
                momentumY = this.hasVerticalScroll ? utils.momentum(this.y, this.startY, duration, this.maxScrollY, this.options.bounce ? this.wrapperHeight : 0, this.options.deceleration) : {
                    destination: newY,
                    duration: 0
                };
                newX = momentumX.destination;
                newY = momentumY.destination;
                time = Math.max(momentumX.duration, momentumY.duration);
                this.isInTransition = 1;
            }
            // 当当前位置与滑动的位置不等时，设置缓动
            if (newX !== this.x || newY !== this.y) {
                // change easing function when scroller goes out of the boundaries
                if (newX > 0 || newX < this.maxScrollX || newY > 0 || newY < this.maxScrollY) {
                    easing = utils.ease.quadratic;
                }

                this.scrollTo(newX, newY, time, easing);
                return;
            }
            this.execEvent('scrollEnd');
        },

        /**
         * 重置
         */
        resize: function () {
            var that = this;
            clearTimeout(that.resizeTimeout);
            that.resizeTimeout = 0;
            that.resizeTimeout = setTimeout(function () {
                that.refresh();
            }, that.options.resizePolling);
        },

        /**
         * 重置位置
         * @param time
         * @returns {boolean}
         */
        resetPosition: function (time) {
            // 获取当前滑动块的坐标
            var that = this,
                x = that.x,
                y = that.y;
            // 设置缓动时间，没有则为0
            time = time || 0;
            // 不能水平滑动并且x的值大于零设置为0
            if (!that.hasHorizontalScroll || that.x > 0) {
                x = 0;
            } else if (this.x < this.maxScrollX) {
                // 水平滑动x的值最大位置
                x = this.maxScrollX;
            }
            // 不能垂直滑动并且y的值大于零设置为0
            if (!this.hasVerticalScroll || this.y > 0) {
                y = 0;
            } else if (this.y < this.maxScrollY) {
                // 垂直滑动y的值最大位置
                y = this.maxScrollY;
            }
            // 如果误操作在滑块没有位置变化的情况下直接跳出
            if (x === that.x && y === that.y) {
                return false;
            }
            // 设置当前位置
            this.scrollTo(x, y, time, this.options.bounceEasing);
            return true;
        },

        /**
         * 不允许操作
         */
        disable: function () {
            this.enabled = false;
        },

        /**
         * 允许操作
         */
        enable: function () {
            this.enabled = true;
        },

        /**
         * 刷新方法
         */
        refresh: function () {
            // Force reflow
            // 作者想强制操作，但是该变量没有使用
            // var rf = this.wrapper.offsetHeight;
            // 获取滑动块宽高
            this.wrapperWidth = this.wrapper.clientWidth;
            this.wrapperHeight = this.wrapper.clientHeight;
            // 获取容器宽高
            this.scrollerWidth = this.scroller.offsetWidth;
            this.scrollerHeight = this.scroller.offsetHeight;
            // 计算出能够滑动的x轴和y轴距离
            this.maxScrollX = this.wrapperWidth - this.scrollerWidth;
            this.maxScrollY = this.wrapperHeight - this.scrollerHeight;
            // 根据距离判断是否能够水平滑动，或者垂直滑动
            this.hasHorizontalScroll = this.options.scrollX && this.maxScrollX < 0;
            this.hasVerticalScroll = this.options.scrollY && this.maxScrollY < 0;
            // 如果不能水平滑动，则设置最大x轴滑动距离为0，并且使滑动块宽度等于总宽度
            if (!this.hasHorizontalScroll) {
                this.maxScrollX = 0;
                this.scrollerWidth = this.wrapperWidth;
            }
            // 如果不能垂直滑动，则设置最大y轴滑动距离为0，并且使滑动块高度等于总高度
            if (!this.hasVerticalScroll) {
                this.maxScrollY = 0;
                this.scrollerHeight = this.wrapperHeight;
            }
            // 初始化滑动时使用的变量
            this.endTime = 0;
            this.directionX = 0;
            this.directionY = 0;
            // 获取父类文档流偏移量
            this.wrapperOffset = utils.offset(this.wrapper);
            // 执行刷新事件方法
            this.execEvent('refresh');
            this.resetPosition();
        },

        /**
         * 绑定事件，这个一般只用于scrollend事件
         * @param type
         * @param fn
         */
        on: function (type, fn) {
            if (!this.events[type]) {
                this.events[type] = [];
            }

            this.events[type].push(fn);
        },

        /**
         * 解绑事件
         * @param type
         * @param fn
         */
        off: function (type, fn) {
            if (!this.events[type]) {
                return;
            }
            var index = this.events[type].indexOf(fn);
            if (index > -1) {
                this.events[type].splice(index, 1);
            }
        },

        /**
         * 执行事件
         * @param type 事件名称
         * @private
         */
        execEvent: function (type) {
            // 判断你是否含有该自定义事件数组
            if (!this.events[type]) {
                return;
            }
            var i = 0,
                l = this.events[type].length;
            if (!l) {
                return;
            }

            /**
             * 循环遍历该事件名称的监听函数数组,分别执行
             */
            for (; i < l; i++) {
                this.events[type][i].apply(this, [].slice.call(arguments, 1));
            }
        },

        /**
         * 设置滑动位置接口
         * @param x x位置
         * @param y y位置
         * @param time 缓动时间
         */
        scrollTo: function (x, y, time) {
            var that = this;
            var easing = utils.ease.circular;
            that.isInTransition = that.options.useTransition && time > 0;
            if (!time || (that.options.useTransition && easing.style)) {
                that.transitionTimingFunction(easing.style);
                that.transitionTime(time);
                that.translate(x, y);
            } else {
                that.animate(x, y, time, easing.fn);
            }
        },

        /**
         * 设置缓动时间
         * @param time 需要缓动的时间
         * @private
         */
        transitionTime: function (time) {
            time = time || 0;
            this.scrollerStyle[utils.style.transitionDuration] = time + 'ms';
        },

        /**
         * 通过样式设置缓动函数
         * @param easing
         */
        transitionTimingFunction: function (easing) {
            this.scrollerStyle[utils.style.transitionTimingFunction] = easing;
        },

        /**
         * 设置滑动快位置
         * @param x
         * @param y
         * @private
         */
        translate: function (x, y) {
            var that = this;
            // 使用transform时设置css样式
            if (this.options.useTransform) {
                this.scrollerStyle[utils.style.transform] = 'translate(' + x + 'px,' + y + 'px)' + this.translateZ;
            } else {
                // 否则使用left和top移动位置
                x = Math.round(x);
                y = Math.round(y);
                that.scrollerStyle.left = x + 'px';
                that.scrollerStyle.top = y + 'px';
            }
            // 设置当前位置
            that.x = x;
            that.y = y;
        },

        /**
         * 初始化事件监听
         * @param remove 是否移除事件监听
         * @private
         */
        initEvents: function (remove) {
            var that = this;
            // 判断是添加事件还是移除事件
            var eventType = remove ? utils.removeEvent : utils.addEvent,
            // 如果设置了bindToWrapper则把事件绑定到当前的父节点中，否则绑定全局window
            // !!!在手机中这里有bug，没有特殊情况建议设置bindToWrapper为true在手机端
                target = that.options.bindToWrapper ? that.wrapper : w;
            // 绑定屏幕翻转窗口重置事件
            eventType(w, 'orientationchange resize', that.resize);
            // 如果设置了click为true，则绑定click事件
            // 这里由于设置了捕获状态，所以在点击最外层父节点时触发click事件
            // 这里有bug，在某些浏览器中会出现问题，穿透点击
            if (that.options.click) {
                eventType(that.wrapper, 'click', false);
            }
            // 绑定鼠标事件
            if (!this.options.disableMouse) {
                eventType(that.wrapper, 'mousedown', that.start);
                eventType(target, 'mousemove', that.move);
                eventType(target, 'mousecancel mouseup', that.end);
            }
            // 绑定指针事件
            if (utils.hasPointer && !that.options.disablePointer) {
                eventType(that.wrapper, utils.prefixPointerEvent('pointerdown'), that.start);
                eventType(target, utils.prefixPointerEvent('pointermove'), that.move);
                eventType(target, utils.prefixPointerEvent('pointercancel'), that.end);
                eventType(target, utils.prefixPointerEvent('pointerup'), that.end);
            }
            // 触摸事件
            if (utils.hasTouch && !that.options.disableTouch) {
                eventType(that.wrapper, 'touchstart', that.start);
                eventType(target, 'touchmove', that.move);
                eventType(target, 'touchcancel touchend', that.end);
            }
            // 绑定所有缓动结束事件,各种兼容性
            eventType(that.scroller, 'transitionend', that.transitionEnd);
            eventType(that.scroller, 'webkitTransitionEnd', that.transitionEnd);
            eventType(that.scroller, 'oTransitionEnd', that.transitionEnd);
            eventType(that.scroller, 'MSTransitionEnd', that.transitionEnd);
        },

        /**
         * 获取变化后的位置
         * @returns {{x: *, y: *}}
         */
        getComputedPosition: function () {
            var scroller = $(this.scroller),
                x, y;
            // 使用transform移动时
            if (this.options.useTransform) {
                // 这里通过css的transform获取到的是变形矩阵，在没有z轴影响的情况下第4和第5个分别表示横轴偏移量和纵轴偏移量
                // 当z轴不为0时，第12和第13个值分别便是横轴偏移量和纵轴偏移量
                var matrix = scroller.css(utils.style.transform).split(',');
                x = +(matrix[12] || matrix[4]);
                y = +(matrix[13] || matrix[5]);
            } else {
                x = +scroller.offset().left;
                y = +scroller.offset().top;
            }
            return {x: x, y: y};
        },

        /**
         * 不支持css3transform动画样式时的兼容性处理方法,触边缓动，用动能定理来算
         * @param destX
         * @param destY
         * @param duration
         * @param easingFn
         * @private
         */
        animate: function (destX, destY, duration, easingFn) {
            var that = this,
            // 起始点x值
                startX = that.x,
            // 其实点y值
                startY = that.y,
            // 开始时间
                startTime = utils.getTime(),
            // 缓动结束时间
                destTime = startTime + duration;

            /**
             * 执行滑动函数
             */
            function step() {
                // 获取当前时间
                var now = utils.getTime(),
                // 计算使用
                    newX,
                    newY,
                    easing;
                // 判断当前时间是否大于或者等于结束时间，终止缓动
                if (now >= destTime) {
                    // 设置缓动结束
                    that.isAnimating = false;
                    // 设置缓动到结束位置
                    that.translate(destX, destY);
                    // 如果重置位置判断与开始位置不同
                    if (!that.resetPosition(that.options.bounceTime) && that.options.specialEnd) {
                        that.execEvent('scrollEnd');
                    }
                    return;
                }
                // 计算当前时间与中缓动时间的间隔
                now = (now - startTime) / duration;
                // 算出当前间隔缓动函数计算出的变化量
                easing = easingFn(now);
                // 计算当前位置坐标
                newX = (destX - startX) * easing + startX;
                newY = (destY - startY) * easing + startY;
                // 设置位置
                that.translate(newX, newY);
                // 如果没有到达终点继续执行
                if (that.isAnimating) {
                    rAF(step);
                }
            }

            // 设置缓动开始标识
            that.isAnimating = true;
            // 执行缓动
            step();
        }
    };
    IScroll.utils = utils;
    return IScroll;
});