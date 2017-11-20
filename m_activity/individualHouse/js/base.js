/**
 * @Author: fenglinzeng
 * @Date: 2016/07/28
 * @description: **Main JS of individualHouse**
 * @Last Modified by: **null**
 * @Last Modified time: **null**
 */

$(document).ready(function ($) {
    'use strict';

    // 顶部右上角的导航开关
    var rightIcon = $('.right_icon');
    var selectItems = $('.select_items');
    rightIcon.on('touchstart', function () {
        selectItems.toggle();
    });

    // 中部导航条的DOM和css值
    var midIn = $('.mid_in'),
        scrollUl = midIn.find('ul'),
        boxWidth = midIn.width();

    // 点击左右导航箭头时，左滑动或右滑动
    var leftArr = $('.left_arr');
    var rightArr = $('.right_arr');
    rightArr.on('click', function () {
        scrollUl.css({
            transform: 'translateX(' + -boxWidth + 'px)',
            transition: '0.5s'
        });
        $(this).addClass('right_arr2');
        leftArr.addClass('left_arr2');
    });

    leftArr.on('click', function () {
        scrollUl.css({
            transform: 'translateX(0px)',
            transition: '0.5s'
        });
        $(this).removeClass('left_arr2');
        rightArr.removeClass('right_arr2');
    });

    $.fn.pin = function (options) {
        var scrollY = 0,
            elements = [],
            disabled = false,
            $window = $(window);

        options = options || {};

        var recalculateLimits = function () {
            for (var i = 0, len = elements.length; i < len; i++) {
                var $this = elements[i];

                if (options.minWidth && $window.width() <= options.minWidth) {
                    if ($this.parent().is('.pin-wrapper')) { $this.unwrap(); }
                    $this.css({
                        width: '',
                        left: '',
                        top: '',
                        position: ''
                    });
                    if (options.activeClass) { $this.removeClass(options.activeClass); }
                    disabled = true;
                    continue;
                } else {
                    disabled = false;
                }

                var $container = options.containerSelector ? $this.closest(options.containerSelector) : $(document.body);
                var offset = $this.offset();
                var containerOffset = $container.offset();
                var parentOffset = $this.offsetParent().offset();

                if (!$this.parent().is('.pin-wrapper')) {
                    $this.wrap('<div class="pin-wrapper">');
                }

                var pad = $.extend({
                    top: 0,
                    bottom: 0
                }, options.padding || {});

                $this.data('pin', {
                    pad: pad,
                    from: (options.containerSelector ? containerOffset.top : offset.top) - pad.top,
                    to: containerOffset.top + $container.height() - $this.outerHeight() - pad.bottom,
                    end: containerOffset.top + $container.height(),
                    parentTop: parentOffset.top
                });

                $this.css('width', $this.outerWidth());
                $this.parent().css('height', $this.outerHeight());
            }
        };

        var onScroll = function () {
            if (disabled) {
                return;
            }

            scrollY = $window.scrollTop();

            var elmts = [];
            for (var i = 0, len = elements.length; i < len; i++) {
                var $this = $(elements[i]),
                    data = $this.data('pin');

                if (!data) {
                    // Removed element
                    continue;
                }

                elmts.push($this);

                var from = data.from - data.pad.bottom,
                    to = data.to - data.pad.top;

                if (from + $this.outerHeight() > data.end) {
                    $this.css('position', '');
                    continue;
                }

                if (from < scrollY && to > scrollY) {
                    !($this.css('position') == 'fixed') && $this.css({
                        left: $this.offset().left,
                        top: data.pad.top,
                        zIndex: 2
                    }).css('position', 'fixed');
                    if (options.activeClass) { $this.addClass(options.activeClass); }
                } else if (scrollY >= to) {
                    // $this.css({
                    //     left: '',
                    //     top: to - data.parentTop + data.pad.top
                    // }).css('position', 'absolute');
                    // if (options.activeClass) { $this.addClass(options.activeClass); }
                } else {
                    $this.css({
                        position: '',
                        top: '',
                        left: ''
                    });
                    if (options.activeClass) { $this.removeClass(options.activeClass); }
                }
            }
            elements = elmts;
        };

        var update = function () {
            recalculateLimits();
            onScroll();
        };

        this.each(function () {
            var $this = $(this),
                data = $(this).data('pin') || {};

            if (data && data.update) {
                return;
            }
            elements.push($this);
            $('img', this).one('load', recalculateLimits);
            data.update = update;
            $(this).data('pin', data);
        });

        $window.scroll(onScroll);
        $window.resize(function () { recalculateLimits(); });
        recalculateLimits();
        update();

        return this;
    };
    $('.mid_item').pin({padding: {top: 10}});
});
