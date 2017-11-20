/*
 *PC大首页弹幕实现
 * zhangcongfeng
 * 兼容ie8,9
 * */
(function (w, f) {
    'use strict';
    if (typeof define === 'function') {
        define('barrage/1.0.0/barrage', ['jquery'], function () {
            // amd
            var $ = require('jquery');
            return f($);
        });
    } else if (typeof exports === 'object') {
        // cmd
        var $ = require('jquery');
        module.exports = f($);
    } else {
        // var Barrage = null;
        window.Barrage = f(jQuery);
    }
})(window, function factory($) {
    'use strict';
    var timeArr = [];
    var timeout = [];
    var ieFlag = !1;
    var browserName = navigator.userAgent;
    if (browserName.indexOf('MSIE 9.0') > 0 || browserName.indexOf('MSIE 8.0') > 0) {
        ieFlag = !0;
    }
    function BarrageAtom(obj) {
        var that = this;
        that.prevTop = 0;
        for (var k in obj) {
            if (obj.hasOwnProperty(k)) {
                that[k] = obj[k];
            }
        }
        that.init();
    }
    BarrageAtom.prototype.init = function () {
        var that = this;
        var atom = $('<div><a><i></i>' + that.text + '</a></div>');
        atom.find('a').attr('href',that.url);
        // IE8.0和IE9.0
        // jQuery animate
        var moveStr = 'move ' + that.duration + 's ' + that.delay + 's ' + 'linear 1';
        atom.css({
            top: that.top,
            overflow: 'hidden',
            animation: moveStr,
            '-webkit-animation': moveStr,
            display: 'none'
        }).addClass(that.className);
        that.atom = atom;
        // 其他浏览器
        // css animation
        var danmu = $('#danmu');
        var closeBtn = $('#closeBtn');
        // 当前banner
        var current = $('#banner_ctr').find('span[class="current"]');
        !ieFlag && danmu.append(that.atom);
        // data-class是close标识用户关闭弹幕的banner
        if (current.attr('data-class') === 'close') {
            // 下次轮播到此banner时不显示弹幕,弹幕开关文本为'开启弹幕'
            closeBtn.html('\u5f00\u542f\u5f39\u5e55');
        }else {
            // 否则正常展示弹幕
            ieFlag && danmu.append(that.atom.show());
            that.atom.show();
            closeBtn.html('\u5173\u95ed\u5f39\u5e55');
        }
        var startTime = new Date().getTime();
        timeArr.push(startTime);
        // console.log(timeArr);
        if (ieFlag) {
            // ie低版本浏览器
            var delay = that.delay * 1000;
            timeout.push(setTimeout(function () {
                that.animateJQ();
            }, delay));
        } else {
            // 鼠标悬停,暂停动画
            danmu.on('mouseover','div',function () {
                var $that = $(this);
                $that.css('z-index','101');
                $that.css('animation-play-state','paused');
                $that.css('-webkit-animation-play-state','paused');
            });
            // 鼠标移开,开始动画
            danmu.on('mouseout','div',function () {
                var $that = $(this);
                $that.css('z-index','99');
                $that.css('animation-play-state','running');
                $that.css('-webkit-animation-play-state','running');
            });
        }
    };
    // jQuery方法展示弹幕
    BarrageAtom.prototype.animateJQ = function () {
        var that = this;
        var atom = that.atom;
        // 字号大小14px
        var width = that.text.length * 14 + atom.width();
        // animate
        var duration = that.duration * 1000;
        atom.animate({left: -width}, duration, 'linear', function () {
            atom.hide();
        });
        // 弹幕鼠标悬停事件
        atom.hover(function () {
            $(this).css('z-index','101');
            atom.stop();
        }, function () {
            $(this).css('z-index','99');
            var endTime = new Date().getTime();
            var remainingTime = that.duration * 1000 - (endTime - timeArr[atom.index()]);
            atom.animate({left: -width}, remainingTime, 'linear', function () {
                atom.hide();
            });
        });
    };

    // 整体弹幕
    function Barrage(obj) {
        // 传参obj{textArr:,flagArr:,host:,}
        // textArr弹幕文本;flagArr:弹幕标志(1:主持人,0:普通留言);host:主持人信息
        this.textArr = obj.text;
        this.flagArr = obj.type;
        this.host = obj.host;
        this.url = obj.url;
        // this.openFlag = obj.openFlag;
        this.config = [];
        this.arr = [];
        this.init();
    }
    Barrage.prototype.init = function () {
        // 显示关闭弹幕按钮
        var barClose = $('.barclose');
        if (barClose.css('display') === 'none') {
            barClose.show();
        }
        // 删除danmu下的div
        var danmuDiv = $('#danmu').find('div');
        danmuDiv.length > 0 && danmuDiv.remove();
        var that = this;
        // 切换弹幕时删除前一弹幕遗留定时器 begin(ie8,9)
        that.clearOut();
        // end
        // 清除事件数组(ie8,9)
        timeArr = [];
        var textArr = that.textArr;
        var flagArr = that.flagArr;
        var len = textArr.length;
        // 生成每个弹幕
        for (var i = 0; i < len; i++) {
            var obj = {};
            // 追加不同的class区分主持人留言还是普通留言
            obj.className = flagArr[i] === 1 ? 'barragetd' : 'barragetda';
            // 弹幕内容
            obj.text = textArr[i];
            // 开启弹幕的标志位
            // obj.openFlag = that.openFlag;
            // 弹幕地址
            obj.url = that.url;
            // top值数组
            var topArr = [0,20,40,55];
            // 动画时长数组
            var durationArr = [15,14,17,17];
            // 延迟时间数组
            var delayArr = [0,4,5.5,1.5];
            // top
            obj.top = topArr[i % 4];
            // 延迟时间
            obj.delay = delayArr[i % 4] + Math.floor(i / 4) * 7.5;
            // 动画时长
            obj.duration = durationArr[i % 4];
            // 记录弹幕数据的数组
            that.arr.push(obj);
            that.config.push(new BarrageAtom(obj));
        }
        // 主持人
        if (that.host) {
            $('#host').html('').append(that.host).show();
        }
    };
    Barrage.prototype.clearOut = function () {
        var timeLen = timeout.length;
        if (timeLen > 0) {
            for (var j = 0;j < timeLen;j++) {
                clearTimeout(timeout[j]);
            }
            timeout = [];
        }
    };
    // 弹幕开关函数
    Barrage.prototype.close = function () {
        // 弹幕开关
        var closeBtn = $('#closeBtn');
        // 弹幕
        var divArr = $('#danmu').find('div');
        var btnStr = '';
        var current = $('#banner_ctr').find('span[class="current"]');
        if (ieFlag) {
            // ie8,9
            if ($('#danmu').find('div').length <= 0) {
                // 重新生成弹幕
                var that = this;
                var arr = that.arr;

                var len = arr.length;
                for (var i = 0;i < len;i++) {
                    new BarrageAtom(arr[i]);
                }
                btnStr = '\u5173\u95ed\u5f39\u5e55';
                current.attr('data-class','');
            }else {
                divArr.hide().remove();
                this.clearOut();
                btnStr = '\u5f00\u542f\u5f39\u5e55';
                current.attr('data-class','close');
            }
        }else {
            // 其他浏览器
            divArr.toggle();
            // 弹幕开关提示文本
            if (divArr.css('display') === 'none') {
                btnStr = '\u5f00\u542f\u5f39\u5e55';
                current.attr('data-class','close');
            }else {
                btnStr = '\u5173\u95ed\u5f39\u5e55';
                current.attr('data-class','');
            }
        }
        // 弹幕开关文字提示
        closeBtn.html(btnStr);
    };
    // 循环播放函数
    Barrage.prototype.loop = function () {
        var that = this;
        var arr = that.arr;
        var len = arr.length;
        var index = len % 4;
        var maxDelay;
        switch(index) {
            case 0:
                maxDelay = arr[len - 2].delay;
                break;
            case 1:
                maxDelay = arr[len - 3].delay;
                break;
            case 2:
            case 3:
                maxDelay = arr[len - 1].delay;
                break;
        }
        var time = (maxDelay + 2.5) * 1000;
        return setInterval(function () {
            for (var i = 0;i < len;i++) {
                new BarrageAtom(arr[i]);
            }
        },time);
    };
    return Barrage;
});
