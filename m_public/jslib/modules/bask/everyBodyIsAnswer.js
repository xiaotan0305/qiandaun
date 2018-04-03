/**
 * Created by hanxiao on 2017/12/7.
 */
define('modules/bask/everyBodyIsAnswer', ['jquery', 'loadMore/1.0.2/loadMore', 'lazyload/1.9.1/lazyload'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        require('lazyload/1.9.1/lazyload');
        $('.lazyload').lazyload();
        // 上拉加载更多
        var url = vars.askSite + '?c=bask&a=ajaxGetMoreSFBangSYAsk&cityname=' + vars.cityname;
        var loadMore = require('loadMore/1.0.2/loadMore');
        loadMore({
            url: url,
            total: vars.totalCount,
            pagesize: 10,
            pageNumber: 10,
            moreBtnID: '.loadingask',
            loadPromptID: '.loadingask',
            contentID: '#proList',
            loadAgoTxt: '<i></i>加载中',
            loadingTxt: '<i></i>加载中',
            loadedTxt: '',
            firstDragFlag: false
        });

        $.ajax({
            type : 'GET',
            url: url,
            data : {
                page : 1
            },
            success : function (data) {
                $('#proList').append(data);
                $('.main').find('.lazyload').lazyload();
            }
        });
    };
});