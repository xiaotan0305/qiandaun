module.exports = {
    /**
     * [getTime 获取当前时间戳]
     */
    now: function () {
        return new Date().getTime();
    },
    /**
     * [getUA 获取userAgent]
     */
    getUA: function () {
        return window.navigator.userAgent;
    },
    /**
     * [getSize 获取盒子宽高]
     */
    getSize: function () {
        return {
            width: $that.width(),
            height: $that.height()
        };
    },
    /**
     * [getTags 加载CSS文件]
     */
    getTags: function () {
        var tags = document.getElementsByTagName('*');
        var tagsArr = [];
        for (var i = 0, len = tags.length; i < len; i++) {
            tagsArr.push(tags[i].tagName.toLowerCase());
        }
        return tagsArr;
    },
    isNum: function (param) {
        return typeof param === 'number';
    },
    /**
     * [getClientX 获取X坐标]
     * @param  {[type]} ev [事件]
     * @return {[type]}    [坐标]
     */
    getClientX: function (ev) {
        if (this.isNum(ev.clientX)) {
            return ev.clientX;
        }
        return (ev.originalEvent.changedTouches && ev.originalEvent.changedTouches[0]).clientX;
    },
    /**
     * [getClientY 获取Y坐标]
     * @param  {[type]} ev [事件]
     * @return {[type]}    [坐标]
     */
    getClientY: function (ev) {
        if (this.isNum(ev.clientY)) {
            return ev.clientY;
        }
        return (ev.originalEvent.changedTouches && ev.originalEvent.changedTouches[0]).clientY;
    },
    /**
     * [getScrollLeft 获取scrollLeft]
     * @param  {[type]} offset [pageXOffset]
     * @param  {[type]} compat [CSS1Compat]
     * @return {[type]}        [scrollLeft]
     */
    getScrollLeft: function (offset, compat) {
        if (offset) {
            return window.pageXOffset;
        } else if (compat) {
            return document.documentElement.scrollLeft;
        }
        return document.body.scrollLeft;
    },
    /**
     * [getScrollTop 获取scrollTop]
     * @param  {[type]} offset [pageXOffset]
     * @param  {[type]} compat [CSS1Compat]
     * @return {[type]}        [scrollTop]
     */
    getScrollTop: function (offset, compat) {
        if (offset) {
            return window.pageXOffset;
        } else if (compat) {
            return document.documentElement.scrollTop;
        }
        return document.body.scrollTop;
    },
    /**
     * [loadStyleFile 加载CSS文件]
     * @param  {[type]} url  [css路径]
     * @param  {[type]} succ [成功回调]
     * @param  {[type]} fail [失败回调]
     */
    loadStyleFile: function (url, succ, fail) {
        var cssObj = document.createElement('link');
        cssObj.type = 'text/css';
        cssObj.rel = 'stylesheet';
        cssObj.href = url;
        cssObj.onload = function () {
            succ && succ();
        };
        cssObj.onerror = function () {
            fail && fail();
        };
        document.getElementsByTagName('head')[0].appendChild(cssObj);
    },
    /**
     * [ajax ajax发送]
     * @param  {[type]} opts [配置项]
     * @return {[type]}      [类promise对象]
     */
    ajax: function (opts) {
        if (!opts.url) {
            return console.error('缺少url');
        }
        return $.ajax({
            url: opts.url,
            type: opts.type || 'get',
            async: opts.async || true,
            cache: opts.cache || false,
            dataType: opts.dataType || 'json',
            jsonp: opts.jsonp || '',
            data: opts.data || {}
        });
    }
};
