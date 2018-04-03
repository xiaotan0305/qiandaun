/*
 * @Author: tankunpeng@fang.com
 * @Date: 2018-04-03 09:59:05
 * @Last Modified by: tankunpeng@fang.com
 * @Last Modified time: 2018-04-03 11:39:58
 * @Description: 懒加载插件
 */
(function(w, f) {
    if (typeof define === 'function') {
        define('//js.mm.test.fang.com/pc_public/fangLazyLoader/fangLazyLoader.js', ['jquery'], function(require) {
            var $ = require('jquery');
            return f($, require);
        });
    } else if (window.module && typeof module.exports === 'object') {
        module.exports = f(w);
    } else {
        if (!w.jQuery) {
            console.error('jQuery undefined');
            return;
        }
        w.fangLazyLoader = f(w.jQuery);
    }
})(window, function($) {
    let fang = window.fang;
    // jquery库
    $ = $ || window.jQuery;

    if (!fang) {
        fang = (src, callback) => {
            let script = document.createElement('script');
            script.charset = 'utf-8';
            script.src = src[0];
            let head = document.head || document.getElementsByTagName('head')[0] || document.documentElement;
            head.appendChild(script);
            callback && callback(script);
        };
    }

    let jqDoc = $(document),
        jqWin = $(window);

    class FangLazyLoader {
        constructor(options) {
            let settings = {
                selector: '.fang-lazy',
                // 阈值
                threshold: 0,
                // 找到 failure_limit 个不在可见区域的图片是才停止搜索
                failure_limit: 0,
                // 事件名
                event: 'scroll',
                // 默认绑定 evnet 的对象容器
                container: window,
                // 获取 src 的 data 属性，默认 data-attrbute
                data_attribute: 'fangJS',
                // 赋值失败时候 备用src
                data_attribute2: 'src2',
                // 是否跳过不可见元素
                skip_invisible: false,
                // 回调事件，元素出现在视口中
                appear: null,
                // 触发 load 事件时执行的回调
                load: null,
                // 设置懒加载类型 默认为img  选项: 图片:img 入口文件:js iframe:iframe ajax: 发送ajax请求
                loadtype: 'img',
                // ajax_* 只有loadtype=== 'ajax' 时才生效
                ajax_data: {},
                ajax_data_type: 'string',
                ajax_type: 'GET',
                ajax_succes: null,
                ajax_fail: null,
                // 延时发送请求配置
                ajax_timeout: 1000,
                placeholder: '//static.test.soufunimg.com/common_m/pc_public/images/fang_placeholder.jpg',
                loading: '//static.test.soufunimg.com/common_m/pc_public/images/fang_loading.gif'
            };

            if (typeof options === 'string') {
                settings.selector = options;
            } else {
                if (options.failurelimit) {
                    options.failure_limit = options.failurelimit;
                    delete options.failurelimit;
                }

                $.extend(settings, options);
            }

            this.container = settings.container === window ? jqWin : $(settings.container);
            this.elements = $(settings.selector);
            this.settings = settings;
            // ajax数据容器
            if (settings.loadtype === 'ajax') {
                this.ajaxArr = [];
            }
            this.init();
        }

        /**
         * 初始化操作
         */
        init() {
            let that = this,
                settings = this.settings,
                container = this.container,
                elements = this.elements;
            // 如果事件名为 scroll 事件，为 container 绑定 scroll 事件
            if (0 === settings.event.indexOf('scroll')) {
                container.on(settings.event + '.fangLazyLoad', () => {
                    that.update();
                });
            }

            elements.each(function() {
                let that = this;
                let jqSelf = $(that);

                that.loaded = false;

                let fangsrc = jqSelf.attr('data-' + settings.data_attribute);
                let fangsrc2 = jqSelf.attr('data-' + settings.data_attribute2);

                /* Remove image from array so it is not looped next time. */
                let grepElements = (elements) => {
                    return $.grep(elements, (element) => {
                        return !element.loaded;
                    });
                };

                let loadSrc;
                if (/iframe|img/.test(settings.loadtype)) {
                    if (!jqSelf.attr('src')) {
                        // img类型预加载为默认图片
                        if (jqSelf.is('img')) {
                            jqSelf.attr('src', settings.placeholder);
                        } else if (jqSelf.is('iframe')) {
                            that.loadingEle = $('<div class="iframeloading"></div>');
                            that.loadingImg = $('<img class="iframeloadingimg">');
                            that.loadingEle.append(that.loadingImg);
                            let width = jqSelf.width(),
                                height = jqSelf.height();
                            jqSelf.parent().css('position', 'relative');
                            that.loadingEle.css({
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                width: width,
                                height: height
                            });
                            that.loadingImg.attr('src', settings.loading).css({
                                position: 'absolute',
                                left: parseInt(width / 2) - 92,
                                top: parseInt(height / 2) - 44,
                                width: 184,
                                height: 87
                            });
                            jqSelf.after(that.loadingEle);
                        }
                    }

                    loadSrc = () => {
                        jqSelf.attr('src', fangsrc);
                        jqSelf.on('load', function() {
                            that.loaded = true;
                            elements = $(grepElements(elements));
                            if (that.loadingEle) {
                                that.loadingEle.remove();
                            }
                            if (settings.load) {
                                let elements_left = elements.length;
                                settings.load.call(that, elements_left, settings);
                            }
                        });
                        jqSelf.on('error', function() {
                            if (that.loadSecond) return;
                            if (fangsrc2) {
                                jqSelf.attr('src', fangsrc2);
                                that.loadSecond = true;
                            }
                        });
                    };
                } else if (/js/.test(settings.loadtype)) {
                    loadSrc = () => {
                        fang([fangsrc], (m) => {
                            m && m.init && m.init();
                            that.loaded = true;
                            elements = $(grepElements(elements));
                            if (settings.load) {
                                let elements_left = elements.length;
                                settings.load.call(that, elements_left, settings);
                            }
                        });
                    };
                } else {
                    loadSrc = () => {
                    };
                }

                jqSelf.one('appear.fangLazyLoad', () => {
                    if (!that.loaded) {
                        if (settings.appear) {
                            let elements_left = elements.length;
                            settings.appear.call(that, elements_left, settings);
                        }
                        loadSrc();
                    }
                });

                // 如果不是默认的 scroll 事件时, 为每个元素绑定事件
                if (0 !== settings.event.indexOf('scroll')) {
                    jqSelf.on(settings.event + '.fangLazyLoad', () => {
                        if (!that.loaded) {
                            jqSelf.trigger('appear.fangLazyLoad');
                        }
                    });
                }
            });

            jqWin.on('resize.fangLazyLoad', function() {
                that.update();
            });

            jqDoc.ready(function() {
                that.update();
            });
        }

        update() {
            let counter = 0,
                settings = this.settings;

            this.elements.each(function() {
                let jqThis = $(this);
                // 如果隐藏，且忽略隐藏，则中断循环
                if (settings.skip_invisible && !jqThis.is(':visible')) {
                    return;
                }
                // 不满足在上方，左方；也不满足在下方，右方； 则触发 appear 事件
                if ($.abovethetop(this, settings) || $.leftofbegin(this, settings)) {
                    // console.log('Nothing');
                } else if (!$.belowthefold(this, settings) && !$.rightoffold(this, settings)) {
                    jqThis.trigger('appear');
                    counter = 0;
                } else {
                    // 如果找到的是第（failure_limit + 1）个元素，且不在container视口上方，左方及视口内（可以允许在视口下方，右方），则中断循环
                    counter++;
                    if (counter > settings.failure_limit) {
                        return false;
                    }
                }
            });
        }
    }

    /* Convenience methods in jQuery namespace.           */
    /* Use as  $.belowthefold(element, {threshold : 100, container : window}) */
    // 在视口下方
    $.belowthefold = function(element, settings) {
        let fold;

        if (settings.container === undefined || settings.container === window) {
            fold = (window.innerHeight ? window.innerHeight : jqWin.height()) + jqWin.scrollTop();
        } else {
            fold = $(settings.container).offset().top + $(settings.container).height();
        }

        return fold <= $(element).offset().top - settings.threshold;
    };
    // 在视口右方
    $.rightoffold = function(element, settings) {
        let fold;

        if (settings.container === undefined || settings.container === window) {
            fold = jqWin.width() + jqWin.scrollLeft();
        } else {
            fold = $(settings.container).offset().left + $(settings.container).width();
        }

        return fold <= $(element).offset().left - settings.threshold;
    };
    // 在视口上方
    $.abovethetop = function(element, settings) {
        let fold;

        if (settings.container === undefined || settings.container === window) {
            fold = jqWin.scrollTop();
        } else {
            fold = $(settings.container).offset().top;
        }

        return fold >= $(element).offset().top + settings.threshold + $(element).height();
    };
    // 在视口左方
    $.leftofbegin = function(element, settings) {
        let fold;

        if (settings.container === undefined || settings.container === window) {
            fold = jqWin.scrollLeft();
        } else {
            fold = $(settings.container).offset().left;
        }

        return fold >= $(element).offset().left + settings.threshold + $(element).width();
    };

    $.inviewport = function(element, settings) {
        return !$.rightoffold(element, settings)
            && !$.leftofbegin(element, settings)
            && !$.belowthefold(element, settings)
            && !$.abovethetop(element, settings);
    };

    /* Custom selectors for your convenience.   */
    /* Use as $('img:below-the-fold').something() or */
    /* $('img').filter(':below-the-fold').something() which is faster */
    $.extend($.expr[':'], {
        'below-the-fold': function(el) {
            return $.belowthefold(el, {
                threshold: 0
            });
        },
        'above-the-top': function(el) {
            return !$.belowthefold(el, {
                threshold: 0
            });
        },
        'right-of-screen': function(el) {
            return $.rightoffold(el, {
                threshold: 0
            });
        },
        'left-of-screen': function(el) {
            return !$.rightoffold(el, {
                threshold: 0
            });
        },
        'in-viewport': function(el) {
            return $.inviewport(el, {
                threshold: 0
            });
        },
        /* Maintain BC for couple of versions. */
        'above-the-fold': function(el) {
            return !$.belowthefold(el, {
                threshold: 0
            });
        },
        'right-of-fold': function(el) {
            return $.rightoffold(el, {
                threshold: 0
            });
        },
        'left-of-fold': function(el) {
            return !$.rightoffold(el, {
                threshold: 0
            });
        }
    });

    return FangLazyLoader;
});

