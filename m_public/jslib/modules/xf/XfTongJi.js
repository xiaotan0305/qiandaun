/**
 * Created by WeiRF on 2015/11/4.
 */
define('modules/xf/XfTongJi', ['jquery'],
    function (require, exports, module) {
        'use strict';
        var $ = require('jquery');
        var vars = seajs.data.vars;
        function XfTongJi(domId) {
            this.documentId = domId;
            this.init();
        }
        XfTongJi.prototype = {
            init: function () {
                var that = this;
                $(that.documentId).on('click',function () {
                    var judge = $(this).attr('data-judge');
                    var list = $(this).attr('data-list');
                    if (judge === '1') {
                        that.tongji('ad', vars.paramcity, list);
                    } else {
                        that.tongji('', vars.paramcity, list);
                    }
                });
                // 点击时背景样式
                $(that.documentId).bind('touchstart', function () {
                    var $this = $(this);
                    $this.css('background', '#f4f4f4');
                    setTimeout(function () {
                        $this.css('background', '#ffffff');
                    }, 100);
                });
                // 如果只显示online按钮，则将其位置放置左边3px处
                $(that.documentId + ' .img').each(function () {
                    if ($(this).children('span').length === 1 && $(this).children('span').hasClass('online')) {
                        $(this).children('span').css('left', '3px');
                    }
                });
            },
            tongji: function (housefrom, city, newcode) {
                $.ajax({
                    url: '/data.d?m=houseinfotj&type=click&housefrom=' + housefrom + '&city=' + city + '&housetype=xf&newcode='
                    + newcode + '&channel=waphouselist',
                    async: false
                });
            }
        };
        module.exports = XfTongJi;
    });
