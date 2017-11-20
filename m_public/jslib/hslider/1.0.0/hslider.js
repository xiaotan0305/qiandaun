/**
 * 横向滑动条插件slider
 * by liyy
 * @param
 */
(function (factory) {
    'use strict';
    if (typeof define === 'function') {
        define('hslider/1.0.0/hslider', ['jquery'], function (require) {
            var $ = require('jquery');
            return factory($);
        });
    } else {
        window.HSlider = factory(jQuery);
    }
})(function ($) {
    'use strict';
    function hslider(opt) {
        this.version = '1.0.0';
        this.options = {
            // 最大值
            max: 10000,
            // 最小值
            min: 500,
            // 最小移动范围
            step: 100,
            // 容器
            oParent: $('#hslider'),
            // 左边滑轮
            leftSign: $('#hleft'),
            // 右边滑轮
            rightSign: $('#hright'),
            // 范围区间
            range: $('#range'),
            danwei: ''
        };
        $.extend(true, this.options, opt);
        this.options.min = parseFloat(this.options.min);
        this.options.max = parseFloat(this.options.max);
        this.options.step = parseFloat(this.options.step);
        this.leftVal = '\u4e0d\u9650';
        this.rightVal = '\u4e0d\u9650';
        this.trueLeft = this.options.oParent.offset().left;
        this.eleW = parseFloat(this.options.rightSign.css('width'));
        this.oW = this.options.oParent.width();
        this.border = parseFloat(this.options.rightSign.css('border-left-width'));
        //  每一步是多少像素点
        this.per = (this.oW - 2 * this.eleW ) * this.options.step / (this.options.max - this.options.min + 2 * this.options.step);
        this._init();
    }

    hslider.prototype = {
        _initPos: function (min, max) {
            if (!min || min && min < this.options.min) {
                min = '\u4e0d\u9650';
            }
            if (!max || max && max > this.options.max) {
                max = '\u4e0d\u9650';
            }
            var lpos, rpos, leftPos, rightPos, rangeLeft, rangeRight;
            if (min === '\u4e0d\u9650') {
                lpos = 0;
                rangeLeft = Math.round(0.5 * this.eleW * 100 / this.oW) + '%';
            } else {
                if (min > this.options.max) {
                    min = this.options.max;
                }
                lpos = ((min - this.options.min) / this.options.step + 1) * this.per;
                rangeLeft = Math.round(lpos + 0.5 * this.eleW) * 100 / this.oW + '%';
            }
            if (max === '\u4e0d\u9650') {
                rpos = this.oW - this.eleW + this.border;
                rangeRight = Math.round(0.5 * this.eleW * 100 / this.oW) + '%';
            } else {
                if (max < this.options.min) {
                    max = this.options.min;
                }
                rpos = ((max - this.options.min) / this.options.step + 1) * this.per + this.eleW;
                rangeRight = Math.round((this.oW - rpos - 0.5 * this.eleW) * 100 / this.oW) + '%';
            }
            // 如果重叠
            if (rpos - lpos < this.eleW) {
                if (lpos < this.oW - this.eleW) {
                    rpos = lpos + this.eleW;
                } else {
                    lpos = rpos - this.eleW;
                }
            }
            leftPos = lpos * 100 / this.oW + '%';
            rightPos = rpos * 100 / this.oW + '%';
            this.options.range.css({
                left: rangeLeft,
                right: rangeRight
            });
            this.options.leftSign.css('left', leftPos).children().html(min);
            this.options.rightSign.css('left', rightPos).children().html(max);
            this.leftVal = min==='\u4e0d\u9650'?'\u4e0d\u9650':parseFloat(min);
            this.rightVal = max==='\u4e0d\u9650'?'\u4e0d\u9650':parseFloat(max);
        },
        _init: function () {
            var that = this;
            // 初始化位置和值
            that._initPos();
            // 绑定事件
            that.options.leftSign.on('touchmove', function (e) {
                that._Haddle(e);
            });
            that.options.rightSign.on('touchmove', function (e) {
                that._Haddle(e);
            });
        },
        _Haddle: function (e) {
            e.preventDefault();
            var ev = e.originalEvent.changedTouches[0];
            var pageX = ev.pageX, ele = e.target, pos, percent = '', max, hit, val;
            // 左边滑轮
            if (ele == this.options.leftSign[0]) {
                if(this.rightVal === this.options.min){
                    return;
                }
                pos = pageX - this.trueLeft;
                max = this.oW - 2 * this.eleW;
                hit = parseFloat(this.options.rightSign.position().left) - this.eleW;
                if (pos < 0) {
                    pos = 0;
                } else if (pos > hit) {
                    pos = hit;
                } else if (pos > max) {
                    pos = max;
                }
                percent = pos * 100 / this.oW + '%';
                this.options.leftSign.css('left', percent);
                this.options.range.css('left', Math.round((pos + 0.5 * this.eleW) * 100 / this.oW) + '%');
                val = this.options.min + (Math.round(pos / this.per) - 1) * this.options.step;
                if (val > this.rightVal - this.options.step) {
                    val = this.rightVal - this.options.step;
                }
                if (val < this.options.min) {
                    val = '\u4e0d\u9650';
                } else if (val > this.options.max) {
                    val = this.options.max;
                }
                this.leftVal = val;
                this.options.leftSign.children().html(val);
            } else {
                if(this.leftVal === this.options.max){
                    return;
                }
                // 右边滑轮
                pos = pageX - this.trueLeft;
                max = this.oW - this.eleW + this.border;
                hit = parseFloat(this.options.leftSign.position().left) + this.eleW;
                if (pos < hit) {
                    pos = hit;
                } else if (pos < 0) {
                    pos = 0;
                } else if (pos > max) {
                    pos = max;
                }
                percent = pos * 100 / this.oW + '%';
                this.options.rightSign.css('left', percent);
                this.options.range.css('right', Math.round((this.oW - pos - 0.5 * this.eleW) * 100 / this.oW) + '%');
                val = this.options.min + (Math.round((pos - this.eleW) / this.per) - 1) * this.options.step;
                if (val < this.leftVal + this.options.step) {
                    val = this.leftVal + this.options.step;
                }
                if (val > this.options.max) {
                    val = '\u4e0d\u9650';
                    if (pos < max) {
                        val = this.options.max;
                    }
                } else if (val < this.options.min) {
                    val = this.options.min;
                }
                this.rightVal = val;
                this.options.rightSign.children().html(val);
            }
        }
    };
    return hslider;
});