define('modules/xf/mfbdList', ['jquery', 'lazyload/1.9.1/lazyload', 'loadMore/1.0.0/loadMore', 'modules/xf/head'],
    function (require) {
        'use strict';
        var $ = require('jquery');

        var vars = seajs.data.vars;
        require('modules/xf/head');
        require('modules/xf/feet');
        require.async('lazyload/1.9.1/lazyload', function ($) {
            $('#content').find('.img img').lazyload();
        });
        vars.total = parseInt($('#totalpage').html());
        vars.pagesize = 10;

        var loadmore = require('loadMore/1.0.0/loadMore');
        loadmore({
            total: vars.total,
            pagesize: vars.pagesize,
            moreBtnID: '#drag',
            loadPromptID: '.draginner',
            contentID: '#content',
            loadAgoTxt: '查看更多',
            loadingTxt: '正在加载请稍后',
            loadedTxt: '查看更多',
            url: '/xf.d?m=mfbdList&city=' + vars.curcity + '&loupanId=' + vars.requestScopeLoupanId
        });

        // 头部
        var activeObj = $('#scrollerTop a.active');
        var left = activeObj.offset().left + activeObj.outerWidth() + 14;
        var winW = $(window).width();
        if (left > winW) {
            $('#wrapperTop').scrollLeft(left-winW);
        }
    });