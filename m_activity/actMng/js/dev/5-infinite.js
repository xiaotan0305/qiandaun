/**
 * [Infinite 下拉滚动加载]
 * @param {[type]} el       [元素]
 * @param {[type]} distance [距离底部多少距离触发]
 */
var Infinite = function (el, distance) {
    // 要滚动加载的部分，一般给body
    this.container = $(el);
    // 在容器的data-infinite属性保存是这个infinite方法，用于销毁时调用方法
    this.container.data('infinite', this);
    // 距离页面底部多少距离时触发加载
    this.distance = distance || 50;
    // 监听事件
    this.attachEvents();
};

// 滚动符合条件时，触发infinite事件
Infinite.prototype.scroll = function () {
    var container = this.container;
    var offset = container.scrollHeight() - ($(window).height() + container.scrollTop());
    if (offset <= this.distance) {
        container.trigger('infinite');
    }
};

// 给容器添加滚动监听
Infinite.prototype.attachEvents = function (off) {
    var el = this.container;
    var scrollContainer = (el[0].tagName.toUpperCase() === 'BODY' ? $(document) : el);
    scrollContainer[off ? 'off' : 'on']('scroll', $.proxy(this.scroll, this));
};

// 销毁滚动监听
Infinite.prototype.detachEvents = function () {
    this.attachEvents(true);
};

// 拓展给jQuery
$.fn.infinite = function (distance) {
    return this.each(function () {
        new Infinite(this, distance);
    });
};

$.fn.destroyInfinite = function () {
    return this.each(function () {
        var infinite = $(this).data('infinite');
        if (infinite && infinite.detachEvents) infinite.detachEvents();
    });
};

// 拓展给jQuery的获取滚动高度的方法
$.fn.scrollHeight = function () {
    return this[0].scrollHeight;
};

// 调用
// $('body').infinite(100).on('infinite', function () {
//     $('body').append('<h1>a</h2>');
// });
