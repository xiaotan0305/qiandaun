define('modules/zhishi/flowChart', ['jquery', 'loadMore/1.0.0/loadMore'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var lcBox,bHeight;
        if (!vars.secondclassType) {
            //定流程页高度,手册页1
            lcBox = $('.jplc');
            bHeight = document.body.offsetHeight;
            lcBox.css('height', bHeight);
        } else {
            //手册页2
            lcBox = $('.mBox');
            bHeight = document.body.offsetHeight;
            lcBox.css('minHeight',bHeight);
        }
            // 加载更多
        var currentTotal = $('.know-list2');
        var loadMore = require('loadMore/1.0.0/loadMore');
        var zSMore = $('#zs-more');
        loadMore({
            url: vars.zhishiSite + '?c=zhishi&a=ajaxGetProsList&classType=' + vars.classType + '&secondclassType=' + vars.secondclassType,
            total: vars.total,
            pagesize: 10,
            pageNumber: 10,
            moreBtnID: '#more-list',
            loadPromptID: '#more-list',
            contentID: '.know-list2',
            loadAgoTxt: '查看更多',
            loadingTxt: '正在加载...',
            loadedTxt: '点击加载更多',
            firstDragFlag: false,
            // 是否需要上拉加载更多功能即是否需要scroll事件监听，可为空，默认为true
            isScroll: false,
            callback: function () {
                if (vars.total == currentTotal.find('li').length) {//当最后一页加载完毕后显示
                    zSMore.show();
                }
            }
        });
    };
});
