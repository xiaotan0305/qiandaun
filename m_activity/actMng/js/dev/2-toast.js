/**
 * [showLoading 显示loading]
 * @param  {[type]} html      [html内容]
 * @param  {[type]} className [class容器]
 */
var showLoading = function (html, className) {

    var className = className || '';

    var tpl = '<div class="zui_toast ' + className + '">' + html + '</div>';
    var dialog = $(tpl).appendTo(document.body);

    dialog.show();
    dialog.addClass('zui_toast_visible');
    $('body').append('<div id="maskTransparent"></div>');
};

/**
 * [hideLoading 隐藏loading]
 * @param  {Function} callback [回调]
 */
var hideLoading = function (callback) {
    $('#maskTransparent').remove();
    $('.zui_toast_visible').removeClass('zui_toast_visible').transitionEnd(function () {
        var $this = $(this);
        $this.remove();
        callback && callback($this);
    });
};

/**
 * [showLoading 拓展给jQuery的显示loading]
 * @param  {[type]} text      [文本内容]
 * @param  {[type]} autoClose [自动关闭]
 * @param  {[type]} time      [显示时间]
 */
$.showLoading = function (text, autoClose, time) {
    var html = '';
    if (!text || text === '加载中') {
        html = '<div class="zui_loading"><div class="line-spin-fade-loader">';
        for (var i = 0; i < 8; i++) {
            html += '<div></div>';
        }
        html += '</div></div>';
    }
    html += '<p class="zui_toast_content">' + (text || '加载中') + '</p>';

    showLoading(html, 'zui_loading_toast');
    if (autoClose) {
        setTimeout(function () {
            $.hideLoading();
        },(time || 2000));
    }
};

/**
 * [hideLoading 拓展给jQuery的隐藏loading]
 * @return {[type]} [description]
 */
$.hideLoading = function () {
    hideLoading();
};

/**
 * [transitionEnd 监听动画结束]
 * @param  {Function} callback [回调函数]
 * @return {[obj]}            [返回调用对象]
 */
$.fn.transitionEnd = function (callback) {
    var events = ['webkitTransitionEnd', 'transitionend'],
        i, dom = this;

    function fireCallBack(e) {
        if (e.target !== this) return;
        callback.call(this, e);
        for (i = 0; i < events.length; i++) {
            dom.off(events[i], fireCallBack);
        }
    }
    if (callback) {
        for (i = 0; i < events.length; i++) {
            dom.on(events[i], fireCallBack);
        }
    }
    return this;
};