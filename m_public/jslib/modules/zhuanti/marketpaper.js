define('modules/zhuanti/marketpaper', ['jquery'],
    function (require, exports, module) {

        module.exports = function () {
            var $ = require('jquery');
            var vars = seajs.data.vars;

            //上下滑动翻页
            var startY;
            $(".page").on("touchstart", function(e) {
                touchStart(e, $(this).attr('id'));
            });
            $(".page").on("touchend", function(e) {
                touchEnd(e, $(this));
            });
            function touchStart(e, id) {
                // 判断默认行为是否可以被禁用
                if (e.cancelable) {
                    // 判断默认行为是否已经被禁用
                    if (!e.defaultPrevented && id != 'page10') {
                        e.preventDefault();
                    }
                }
                startY = e.originalEvent.changedTouches[0].pageY;
            }
            function touchEnd(e, that) {
                var moveEndY = e.originalEvent.changedTouches[0].pageY,
                    Y = moveEndY - startY;
                if ( Y > 0) {
                    if (that.attr('id') !== 'page1') {
                        that.hide();
                        that.prev().show();
                    }
                } else if ( Y < 0) {
                    if (that.attr('id') !== 'page10') {
                        that.hide();
                        that.next().show();
                    }
                }
            }
        };
    });