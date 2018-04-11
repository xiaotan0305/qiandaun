/*
 * @Author: tankunpeng@fang.com
 * @Date: 2018-04-03 09:59:05
 * @Last Modified by: tankunpeng@fang.com
 * @Last Modified time: 2018-04-11 10:50:27
 * @Description: 懒加载插件
 */
(function(w, f) {
    if (typeof define === 'function') {
        define('//static.test.soufunimg.com/common_m/pc_public/fangLazyLoader/fangLazyLoader.js', ['jquery'], function(require) {
            var $ = require('jquery');
            if (!$) {
                return console.error('jQuery undefined');
            }
            return f($, require);
        });
    } else if (window.module && typeof module.exports === 'object') {
        module.exports = f(w);
    } else {
        if (!w.jQuery) {
            return console.error('jQuery undefined');
        }
        w.fangLazyLoader = f(w.jQuery);
    }
})(window, function($) {
    var fang = window.fang;
    // jquery库
    $ = $ || window.jQuery;

    if (!fang) {
        fang = function(src, callback) {
            var script = document.createElement('script');
            script.charset = 'utf-8';
            script.src = src[0];
            var head = document.head || document.getElementsByTagName('head')[0] || document.documentElement;
            head.appendChild(script);
            callback && callback(script);
        };
    }

    /**
     * ajax请求
     * @param {styring} data
     * @param {function} callback
     */
    var fangAjax = function(data, classObj) {
        var settings = classObj.settings;
        var json;
        try {
            if (/(\s\r\n)*{[\s\S]*}(\s\r\n)*/.test(data)) {
                json = JSON.parse(data);
            }else {
                json = data;
            }
        } catch (error) {
            return console.error('数据格式错误！', error);
        }
        classObj.ajaxArr.push(json);
        if (classObj.ajaxTimer) return;
        classObj.ajaxTimer = setTimeout(function() {
            var dataJson = {};
            dataJson[settings.ajax_data_arrkey] = classObj.ajaxArr;
            dataJson = $.extend({}, settings.ajax_data, dataJson);
            // 初始化数据容器与定时器
            classObj.ajaxTimer = null;
            classObj.ajaxArr = [];
            $.ajax({
                type: settings.ajax_type,
                url: settings.ajax_url,
                data: JSON.stringify(dataJson),
                dataType: 'json',
                success: function(result) {
                    if (settings.ajax_succes) {
                        settings.ajax_succes(result, dataJson);
                    }
                },
                error: function(err) {
                    if (settings.ajax_fail) {
                        settings.ajax_fail(err);
                    }
                }
            });
        }, settings.ajax_timeout);
    };

    var jqDoc = $(document),
        jqWin = $(window);

    function FangLazyLoader(options) {
        var settings = {
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
            // ajax动态数据数组key
            ajax_data_arrkey: 'list',
            ajax_type: 'POST',
            ajax_url: location.origin + location.pathname,
            ajax_succes: null,
            ajax_fail: null,
            // 延时发送请求配置
            ajax_timeout: 1000,
            placeholder: '//static.soufunimg.com/common_m/pc_public/images/fang_placeholder.jpg',
            loading: '//static.soufunimg.com/common_m/pc_public/images/fang_loading.gif'
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
        this.eventBind = typeof $.fn.on === 'function' ? 'on' : 'bind';
        this.elements = $(settings.selector);
        this.settings = settings;
        // ajax数据容器
        if (settings.loadtype === 'ajax') {
            this.ajaxArr = [];
            this.ajaxTimer = null;
        }
        this.init();
    }
    FangLazyLoader.prototype = {
        /**
         * 初始化操作
         */
        init: function() {
            var that = this,
                settings = this.settings,
                container = this.container,
                elements = this.elements;
            // 如果事件名为 scroll 事件，为 container 绑定 scroll 事件
            if (0 === settings.event.indexOf('scroll')) {
                container[that.eventBind](settings.event + '.fangLazyLoad', function() {
                    that.update();
                });
            }

            elements.each(function() {
                var jqSelf = $(this);

                this.loaded = false;

                var fangsrc = jqSelf.attr('data-' + settings.data_attribute);
                var fangsrc2 = jqSelf.attr('data-' + settings.data_attribute2);

                /* Remove image from array so it is not looped next time. */
                var grepElements = function(elements) {
                    return $.grep(elements, function(element) {
                        return !element.loaded;
                    });
                };

                var loadSrc;
                if (/iframe|img/.test(settings.loadtype)) {
                    if (!jqSelf.attr('src')) {
                        // img类型预加载为默认图片
                        if (jqSelf.is('img')) {
                            jqSelf.attr('src', settings.placeholder);
                        } else if (jqSelf.is('iframe')) {
                            this.loadingEle = $('<div class="iframeloading"></div>');
                            this.loadingImg = $('<img class="iframeloadingimg">');
                            this.loadingEle.append(this.loadingImg);
                            var width = jqSelf.width(),
                                height = jqSelf.height();
                            jqSelf.parent().css('position', 'relative');
                            this.loadingEle.css({
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                width: width,
                                height: height
                            });
                            this.loadingImg.attr('src', settings.loading).css({
                                position: 'absolute',
                                left: parseInt(width / 2) - 92,
                                top: parseInt(height / 2) - 44,
                                width: 184,
                                height: 87
                            });
                            jqSelf.after(this.loadingEle);
                        }
                    }

                    loadSrc = function() {
                        jqSelf.attr('src', fangsrc);
                        jqSelf[that.eventBind]('load', function() {
                            this.loaded = true;
                            elements = $(grepElements(elements));
                            if (this.loadingEle) {
                                this.loadingEle.remove();
                            }
                            if (settings.load) {
                                var elements_left = elements.length;
                                settings.load.call(this, elements_left, settings);
                            }
                        });
                        jqSelf[that.eventBind]('error', function() {
                            if (this.loadSecond) return;
                            if (fangsrc2) {
                                jqSelf.attr('src', fangsrc2);
                                this.loadSecond = true;
                            }
                        });
                    };
                } else if (/js/.test(settings.loadtype)) {
                    loadSrc = function() {
                        fang([fangsrc], function(m) {
                            m && m.init && m.init();
                            this.loaded = true;
                            elements = $(grepElements(elements));
                            if (settings.load) {
                                var elements_left = elements.length;
                                settings.load.call(this, elements_left, settings);
                            }
                        });
                    };
                } else if (/ajax/.test(settings.loadtype)) {
                    loadSrc = function() {
                        this.loaded = true;
                        fangAjax(fangsrc, that);
                    };
                }else {
                    loadSrc = function() {
                    };
                }

                jqSelf.one('appear.fangLazyLoad', function() {
                    if (!this.loaded) {
                        if (settings.appear) {
                            var elements_left = elements.length;
                            settings.appear.call(this, elements_left, settings);
                        }
                        loadSrc();
                    }
                });

                // 如果不是默认的 scroll 事件时, 为每个元素绑定事件
                if (0 !== settings.event.indexOf('scroll')) {
                    jqSelf[that.eventBind](settings.event + '.fangLazyLoad', function() {
                        if (!this.loaded) {
                            jqSelf.trigger('appear.fangLazyLoad');
                        }
                    });
                }
            });

            jqWin[that.eventBind]('resize.fangLazyLoad', function() {
                that.update();
            });

            jqDoc.ready(function() {
                that.update();
            });
        },
        update: function() {
            var counter = 0,
                settings = this.settings;

            this.elements.each(function() {
                var jqThis = $(this);
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
    };

    /* Convenience methods in jQuery namespace.           */
    /* Use as  $.belowthefold(element, {threshold : 100, container : window}) */
    // 在视口下方
    $.belowthefold = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = (window.innerHeight ? window.innerHeight : jqWin.height()) + jqWin.scrollTop();
        } else {
            fold = $(settings.container).offset().top + $(settings.container).height();
        }

        return fold <= $(element).offset().top - settings.threshold;
    };
    // 在视口右方
    $.rightoffold = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = jqWin.width() + jqWin.scrollLeft();
        } else {
            fold = $(settings.container).offset().left + $(settings.container).width();
        }

        return fold <= $(element).offset().left - settings.threshold;
    };
    // 在视口上方
    $.abovethetop = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = jqWin.scrollTop();
        } else {
            fold = $(settings.container).offset().top;
        }

        return fold >= $(element).offset().top + settings.threshold + $(element).height();
    };
    // 在视口左方
    $.leftofbegin = function(element, settings) {
        var fold;

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

