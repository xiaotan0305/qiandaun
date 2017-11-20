define('modules/zhishi/fangJieShuo', ['jquery', 'loadMore/1.0.0/loadMore'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var vars = seajs.data.vars;
        require('lazyload/1.9.1/lazyload');
     // 图片惰性加载
        $('.main').find('img').lazyload({event: 'scroll click'});
        //加载更多
        var loadMore = require('loadMore/1.0.0/loadMore');
        loadMore({
            url: vars.zhishiSite + '?c=zhishi&a=ajaxFangJieShuo',
            total: vars.totalCount,
            pagesize: 10,
            pageNumber: 10,
            moreBtnID: '.load-more',
            loadPromptID: '.load-more',
            contentID: '#list_ul',
            loadAgoTxt: '<a class="more f14 gray-5" >上拉加载更多</a>',
            loadingTxt: '<a class="more f14 gray-5" >正在加载...</a>',
            loadedTxt: '<a class="more f14 gray-5" >没有更多了</a>',
            lazyCon: 'img[data-original]',
            firstDragFlag: true
        });
    };
});