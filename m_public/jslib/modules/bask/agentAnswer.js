/**
 * Created by hanxiao on 2017/12/6.
 */
define('modules/bask/agentAnswer', ['jquery', 'loadMore/1.0.2/loadMore', 'lazyload/1.9.1/lazyload'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        require('lazyload/1.9.1/lazyload');
        $('.lazyload').lazyload();
        // 上拉加载更多
        var url = vars.askSite + '?c=bask&a=ajaxGetMoreAgentAnswer';
         var loadMore = require('loadMore/1.0.2/loadMore');
         loadMore({
         url: url,
         total: vars.totalCount,
         pagesize: 10,
         pageNumber: 10,
         moreBtnID: '#loadDiv',
         loadPromptID: '#loadA',
         contentID: '#answerlist',
         loadAgoTxt: '加载更多',
         loadingTxt: '加载中',
         loadedTxt: '没有更多了',
         firstDragFlag: false
         });
        $('#tip').on('click', function(){
            $('.floatip').show();
        });

        $('#close').on('click', function(){
            $('.floatip').hide();
        });
    };
});