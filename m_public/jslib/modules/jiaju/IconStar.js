define('modules/jiaju/IconStar', ['jquery'], function (require, exports, module) {
    'use strict';
    var $ = require('jquery');
    function IconStar(className, attrName, obj) {
        this.className = className || 'ico-star';
        this.atName = attrName || 'data-score';
        this.obj = obj || $('body');
        this.init();
    }
    IconStar.prototype = {
        init: function () {
            var thisAt = this.atName;
            this.obj.find('.' + this.className).each(function () {
                var $that = $(this), score = $that.attr(thisAt), cur, half, i;
                if (score % 1 === 0) {
                    cur = score - 1;
                    for (i = 0;i <= cur; i++) {
                        $that.find('i').eq(i).addClass('active');
                    }
                } else {
                    cur = Number(score) - 0.4;
                    half = cur % 1;
                    for (i = 0;i <= cur; i++) {
                        $that.find('i').eq(i).addClass('active');
                    }
                    if (half < 0.4) {
                        $that.find('i').eq(i - 1).addClass('half');
                    }
                }
            });
        }
    };
    module.exports = IconStar;
});