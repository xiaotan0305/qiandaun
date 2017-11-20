define('modules/jiaju/sjsinfoloadmore', ['jquery','lazyload/1.9.1/lazyload','photoswipe/4.0.7/photoswipe', 'photoswipe/4.0.7/photoswipe-ui-default.min'], function (require, exports, module) {
    'use strict';
    var $ = require('jquery');
    function sjsinfoloadmore(options) {
        var that = this;
        var vars = seajs.data.vars;
        var evalTotalpage = Math.ceil(Number(vars.evaltotal) / 10);
        var evalCurp = 2;
        var evalK = true;
        var $window = $(window);
        var $document = $(document);
        var bua = navigator.userAgent.toLowerCase();
        var isApple = bua.indexOf('iphone') !== -1 || bua.indexOf('ios') !== -1;
        var caseTotalpage = Math.ceil(Number(vars.casetotal) / 10);
        var caseCurp = 2;
        var caseK = true;
        var evalDrag = $('#eval_clickmore');
        var caseDrag = $('#case_clickmore');
        if (evalTotalpage <= 1) {
            evalDrag.hide();
            evalK = false;
        }
        if (caseTotalpage <= 1) {
            caseDrag.hide();
            caseK = false;
        }
        evalDrag.add(caseDrag).click(function () {
            that.load();
        });
        this.evalObject = {
            drag: evalDrag,
            k: evalK,
            curp: evalCurp,
            content: $('#eval_content'),
            total: evalTotalpage,
            url: options.url.replace('*', 'ajaxGetSjsEval')
        };
        this.caseObject = {
            drag: caseDrag,
            k: caseK,
            curp: caseCurp,
            content: $('#case_content'),
            total: caseTotalpage,
            url: options.url.replace('*', 'ajaxGetSjsCase')
        };
        $window.bind('scroll', function () {
            var scrollh = $document.height();
            if (isApple) {
                scrollh -= 140;
            } else {
                scrollh -= 80;
            }
            if ($document.scrollTop() + $window.height() >= scrollh) {
                that.load();
            }
        });
    }
    var caseNav = $('#case');
    sjsinfoloadmore.prototype = {
        load: function () {
            var obj;

            if (caseNav.hasClass('active')) {
                obj = this.caseObject;
                if (!obj.k)return;
            } else {
                obj = this.evalObject;
                if (!obj.k)return;
            }
            obj.k = false;
            obj.drag.html('<a href="javascrip:void(0)" class="loading">正在加载请稍后</a>').find('a').css({
                'padding-left': '0px',
                background: ''
            });
            $.get(obj.url + '&r=' + Math.random(), {page: obj.curp}, function (data) {
                obj.content.append(data);
                obj.content.find('img').lazyload();
                obj.drag.html('<a href="javascript:tvoid(0)" >上拉自动加载更多</a>').find('a').css({
                    'padding-left': '0px',
                    background: ''
                });

                //看大图开始
                var ratioX = document.documentElement.clientWidth;

                function opImgWH(w, h) {
                    var ratio = 1;
                    if (w <= ratioX) {
                        ratio = ratioX / w;
                    } else {
                        ratio = w / ratioX;
                    }
                    return {w: ratioX, h: ratio * h};
                }

                $('.my').find('img').on('click', function () {
                    var obj = $(this).closest('.pic').find('img');
                    var pswpElement = document.querySelectorAll('.pswp')[0];
                    var itemArr = [];
                    var slides = [];
                    var index = 0;
                    var w = 0, h = 0;
                    var resultWH = null;
                    for (var i = 0, len = obj.length; i < len; i++) {
                        itemArr = [];
                        w = $(obj[i]).width();
                        h = $(obj[i]).height();
                        resultWH = opImgWH(w, h);
                        itemArr = {src: $(obj[i]).attr('data-ori'), w: resultWH.w, h: resultWH.h};
                        if ($(obj[i]).attr('data-ori') === $(this).attr('data-ori')) {
                            index = i;
                        }
                        slides.push(itemArr);
                    }

                    var options = {
                        //  history & focus options are disabled on CodePen
                        history: false,
                        focus: false,
                        index: index,
                        escKey: true
                    };
                    var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, slides, options);
                    gallery.init();
                });

                //看大图结束
                obj.curp = parseInt(obj.curp) + 1;
                obj.k = true;
                if (obj.curp > parseInt(obj.total)) {
                    obj.drag.hide();
                    obj.k = false;
                }
            });
        },
        refresh: function () {
            var obj;
            if (caseNav.hasClass('active')) {
                obj = this.caseObject;
                if (!obj.k)return;
            } else {
                obj = this.evalObject;
                if (!obj.k)return;
            }
            obj.k = false;
            obj.curp = 1;
            $.get(obj.url + '&r=' + Math.random(), {page: obj.curp}, function (data) {
                obj.content.empty().append(data);
                obj.curp = parseInt(obj.curp) + 1;
                obj.k = true;
                if (obj.curp > parseInt(obj.total)) {
                    obj.drag.hide();
                    obj.k = false;
                }
                var xiala = $('#xiala');
                if (xiala.length > 0) {
                    xiala.hide();
                }
            });
        }
    };
    module.exports = sjsinfoloadmore;
});

