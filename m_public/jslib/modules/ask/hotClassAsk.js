/**
 * Created by chenhongyan on 17/8/10.
 */
 define('modules/ask/hotClassAsk', ['jquery', 'lazyload/1.9.1/lazyload', 'loadMore/1.0.2/loadMore'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        // jquery库
        var $ = require('jquery');
        // 文档jquery对象索引
        var $doc = $(document);
        // 从页面获取的参数
        var vars = seajs.data.vars;
        var loadMore = require('loadMore/1.0.2/loadMore');

        /*已解决问题列表中的免费问题加载更多*/
        var url = vars.askSite + "?c=ask&a=ajaxHotClassAsk&classname="+vars.classname+'&type=freeSolved';
        loadMore({
            url: url,
            total:parseInt($("#freeSolved_more").attr('data-total')),
            pagesize: 10,
            pageNumber: 10,
            moreBtnID: '#freeSolved_more',
            loadPromptID: '#freeSolved_more',
            contentID: '#freeSolved',
            loadAgoTxt: '<a href="javascript:void(0);">查看更多回答</a>',
            loadingTxt: '<a href="javascript:void(0);">加载中...</a>',
            loadedTxt: '',
            firstDragFlag: false,
        });

        /*最新提问列表的分页效果实现*/
        if (vars.type == 'newAsk') {
            var url = vars.askSite + "?c=ask&a=ajaxHotClassAsk&classname="+vars.classname+'&type=newAsk';
            loadMore({
                url: url,
                total:parseInt($("#display_more").attr('data-total')),
                pagesize: 10,
                pageNumber: 10,
                moreBtnID: '#display_more',
                loadPromptID: '#display_more',
                contentID: '#content',
                loadAgoTxt: '<a href="javascript:void(0);">查看更多问题</a>',
                loadingTxt: '<a href="javascript:void(0);">加载中...</a>',
                loadedTxt: '',
                firstDragFlag: false,
            });
        }
        
    };
});
