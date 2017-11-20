var opts = require('./default.js').opts;
var tool = require('./util/tool.js');
var imgUtil = require('./imgAction.js');
// var request = require('./request.js');
var encryptor = require('./encryptors.js');
module.exports = {

    // 点击信息
    clickInfo: [],
    dragInfo: [],
    // 点击图标
    clickIcon: '<div class="verifyicon verifyicon-click click-icon center-icon"></div>',

    // 背景，文字，滑块，图片验证码
    tpl: '<div class="slide-verify">'
            + '<div class="drag-bg"></div>'
            + '<div class="drag-text">拖动滑块验证</div>'
            + '<div class="loading"><div></div><div></div></div>'
            + '<div class="drag-handler verifyicon verifyicon-arrow center-icon"></div>'
        + '</div>',
    startX: 0,
    btnTarget: '',
    maxWidth: 0,


    init: function () {
        // 是否在拖拽
        // 点击次数统计
        opts.clickCount = 0;
        // 拖拽信息
        this.dragInfo = [];
        // 点击信息
        this.clickInfo = [];
        // 插入模板
        this.appendDOM();
        // 绑定页面事件
        this.bindPageEvent();
        // 绑定滑块事件
        this.bindSlideEvent(window.$that);
    },

    /**
     * [bindPageEvent 给页面绑定监控事件]
     */
    bindPageEvent: function () {
        var that = this;
        $(document).on('touchmove', function (ev) {
            that.markDrag({
                x: tool.getClientX(ev),
                y: tool.getClientY(ev),
                t: tool.now(),
                e: 'touchmove'
            });
        }).on('touchstart', function (ev) {
            that.markDrag({
                x: tool.getClientX(ev),
                y: tool.getClientY(ev),
                t: tool.now(),
                e: 'touchstart'
            });
        }).on('touchend', function (ev) {
            that.markDrag({
                x: tool.getClientX(ev),
                y: tool.getClientY(ev),
                t: tool.now(),
                e: 'touchend'
            });
        });
        $(window).on('scroll', function () {
            var offset = 'pageXOffset' in window,
                compat = 'CSS1Compat' === (document.compatMode || '');
            that.markDrag({
                x: tool.getScrollLeft(offset, compat),
                y: tool.getScrollTop(offset, compat),
                t: tool.now(),
                e: 'scroll'
            });
        }).on('focus', function () {
            that.markDrag({
                t: tool.now(),
                e: 'focus'
            });
        }).on('blur', function () {
            that.markDrag({
                t: tool.now(),
                e: 'blur'
            });
        }).on('unload', function () {
            that.markDrag({
                t: tool.now(),
                e: 'unload'
            });
        });
    },

    /**
     * [bindSlideEvent 绑定事件]
     */
    bindSlideEvent: function ($that) {
        var that = this;
        $that.handler = $that.find('.drag-handler');
        $that.dragBg = $that.find('.drag-bg');
        $that.text = $that.find('.drag-text');
        $that.loading = $that.find('.loading');

        // 能滑动的最大间距
        this.maxWidth = $that.width() - $that.handler.width();

        // touchstart时候的x轴的位置
        // touchmove时，移动距离大于0小于最大间距，滑块x轴位置等于移动距离
        $that.handler.on('touchstart', function (ev) {
            that.handerStart(ev, $that);
        }).on('touchmove', function (ev) {
            that.handerMove(ev, $that);
        }).on('touchend', function (ev) {
            that.handerEnd(ev, $that);
        });
    },

    /**
     * [handerStart 拖拽开始]
     * @param  {[type]} ev   [事件]
     * @param  {[type]} type [类型]
     */
    handerStart: function (ev, $that) {
        var touchEv = ev.originalEvent.changedTouches[0];
        this.startX = touchEv.clientX - parseInt($that.handler.css('left'), 10);
        this.btnTarget = ev.target.tagName;
    },

    /**
     * [handerMove 拖拽时]
     * @param  {[type]} ev   [事件]
     * @param  {[type]} type [类型]
     */
    handerMove: function (ev, $that) {
        var touchEv = ev.originalEvent.changedTouches[0];

        var currentX = touchEv.clientX - this.startX;

        // 如果没有移到终点
        if (currentX > 0 && currentX <= this.maxWidth) {
            $that.handler.css({
                left: currentX
            });
            $that.dragBg.css({
                width: currentX
            });
        } else if (currentX > this.maxWidth) {
            this.markDrag({
                x: touchEv.clientX,
                y: touchEv.clientY,
                t: tool.now(),
                e: 'touchend'
            });
            // 移动到终点
            this.dragDone($that);
        }
    },

    /**
     * [handerEnd 拖拽结束]
     * @param  {[type]} ev   [事件]
     * @param  {[type]} type [类型]
     */
    handerEnd: function (ev, $that) {
        var touchEv = ev.originalEvent.changedTouches[0];
        var currentX = touchEv.clientX - this.startX;
        if (currentX < this.maxWidth) {
            // 鼠标松开时，如果没有达到最大距离位置，滑块就返回初始位置
            $that.handler.animate({ left: 0 }, 300);
            $that.dragBg.animate({ width: 0 }, 300);
        }
    },

    /**
     * [markDrag 记录拖拽信息]
     * @param  {[type]} info [拖拽信息]
     */
    markDrag: function (info) {
        this.dragInfo.push(info);
    },
    /**
     * [dragDone 拖拽完成]
     */
    dragDone: function ($that) {
        $that.handler.css({
            left: 'auto',
            right: 0
        });
        $that.text.text('');
        $that.loading.show();
        $that.dragBg.css('width', $that.width() - $that.handler.width());
        this.removeEvents($that);

        console.log('dragInfo', this.dragInfo);

        this.verifyDrag(this.dragInfo);
    },
    /**
     * [removeEvents 移除事件]
     */
    removeEvents: function ($that) {
        return $that.handler.off('touchstart touchmove touchend mousedown mousemove mouseup');
    },
    /**
     * [dragOk 验证通过]
     */
    dragOk: function () {
        window.$that.dragBg.removeClass('fail');
        window.$that.handler.removeClass('verifyicon-fail').addClass('verifyicon-ok');
        window.$that.loading.css('display', 'none');
        window.$that.text.text('验证通过').css('color', '#fff');
        this.hideImgVerify && this.hideImgVerify();
        opts.succFn && opts.succFn(opts);
    },

    /**
     * [dragFail 移动到终点]
     */
    dragFail: function () {
        window.$that.dragBg.addClass('fail');
        window.$that.handler.addClass('verifyicon-fail');
        window.$that.loading.css('display', 'none');
        window.$that.text.text('验证失败').css('color', '#fff');
        this.showImgVerify();
    },


    /**
     * [appendDOM 插入模板]
     */
    appendDOM: function () {
        window.$that.html(this.tpl);
    },

    /**
     * [hideImgVerify 隐藏图片验证容器]
     */
    hideImgVerify: function () {
        window.$that.find('.img-verify').css('display', 'none');
    },

    /**
     * [this.showImgVerify 显示验证图片]
     */
    showImgVerify: function () {
        var that = this;
        // window.$that;
        window.$that.imgVerify = window.$that.find('.slide-verify').append(imgUtil.getImgTpl(opts)).find('.img-verify');
        window.$that.text.text('验证失败，请点击图片中的「' + opts.randomTxt + '」');
        var img = window.$that.imgVerify.find('img');

        window.$that.imgVerify.show();
        img.attr('src', img.data('url')).on('click', function (ev) {
            that.appendIcon(ev);
            that.markClick({
                t: tool.now(),
                x: ev.offsetX,
                y: ev.offsetY,
                e: 'click'
            });
            opts.clickCount++;
            that.checkClickLimit();
        });
    },


    /**
     * [appendIcon 插入点击icon]
     */
    appendIcon: function (ev) {
        return $(this.clickIcon).css({
            left: ev.offsetX - 10,
            top: ev.offsetY - 10
        }).appendTo(window.$that.imgVerify);
    },

    /**
     * [markClick 记录拖拽信息]
     * @param  {[type]} info [拖拽信息]
     */
    markClick: function (info) {
        this.clickInfo.push(info);
        console.log('clickInfo', this.clickInfo);
    },

    /**
     * [checkClickLimit 判断点击次数]
     * @return {[type]} [description]
     */
    checkClickLimit: function () {
        if (opts.clickCount === opts.clickLimit) {
            window.$that.imgVerify.find('.v-mask').show().find('.loading').show();
            this.verifyClick();
        }
    },

    /**
     * [clickFail 点击验证失败]
     */
    clickFail: function () {
        var that = this;
        window.$that.imgVerify.find('.loading').hide();
        window.$that.imgVerify.find('.mask-tip').show();
        setTimeout(function () {
            that.init();
        }, 2000);
    },

    /**
     * [verifyDrag 移除事件]
     */
    verifyDrag: function (dragInfo) {
        var that = this;
        tool.ajax({
            url: opts.url.dragCheck,
            dataType: 'jsonp',
            jsonp: 'callback',
            data: {
                stratdrag_time: dragInfo[0].t,
                finishdrag_time: dragInfo[dragInfo.length - 1].t,
                i: encryptor.LZString.compress(encryptor.encryptedPageInfo()),
                t: encryptor.encryptTouch(encryptor.parseTouch(dragInfo)),
                gt: opts.gt,
                challenge: opts.challenge
            }
        }).done(function (data) {
            if (data.message === 'successed' && data.validate) {
                opts.validate = data.validate;
                that.dragOk();
            }else {
                that.dragFail();
            }
        });
    },

    /**
     * [verifyClick 验证点击]
     */
    verifyClick: function () {
        var that = this;
        tool.ajax({
            url: opts.url.clickCheck,
            dataType: 'jsonp',
            jsonp: 'callback',
            data: {
                x: this.clickInfo[0].x,
                y: this.clickInfo[0].y,
                challenge: opts.challenge,
                gt: opts.gt
            }
        }).done(function (data) {
            if (data.message === 'successed' && data.validate) {
                opts.validate = data.validate;
                that.dragOk();
            }else {
                that.clickFail();
            }
        });
    }
};