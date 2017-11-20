/**
 * Created by WeiRF on 2015/11/4.
 */
define('modules/xf/IcoStar', ['jquery'],
    function (require, exports, module) {
        'use strict';
        var $ = require('jquery');
        function IcoStar(domId) {
            this.documentId = domId;
            this.init();
        }
        IcoStar.prototype = {
            init: function () {
                $(this.documentId).each(function () {
                    // 当star>=0.8时按一星算,当0.4<=star<=0.7时按半星算
                    // 减0.4的目的是curStars的整数部分为active,当小数部分<=0.3时为半星，即加half
                    var curStars = Number($(this).attr('star')) - 0.4;
                    // 取余数，若 < 0.4为半星
                    var harfStars = curStars % 1;
                    var $dom = $(this).find('i');
                    var i;
                    for (i = 0; i <= curStars; i++) {
                        $dom.eq(i).addClass('active');
                    }
                    if (harfStars < 0.4) {
                        $dom.eq(i - 1).addClass('half');
                    }
                });
            }
        };
        module.exports = IcoStar;
    });