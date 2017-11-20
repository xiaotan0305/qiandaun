define('modules/my/getIncomeList', ['jquery', 'modules/my/yhxw', 'loadMore/1.0.0/loadMore'], function (require, exports, module) {
    'use strict';
    var $ = require('jquery');
    module.exports = function () {
        var vars = seajs.data.vars;
        var ajaxUrl,uriComponent;
        if (vars.action === 'getIncomeList'){
            $('#income').addClass('active');
            uriComponent = '收入';
            ajaxUrl = location.protocol + vars.mySite + '?c=my&a=ajaxgetIncomeList' + '&city=' + vars.city;
        } else {
            $('#outcome').addClass('active');
            uriComponent = '支出';
            ajaxUrl = location.protocol + vars.mySite + '?c=my&a=ajaxgetOutcomeList' + '&city=' + vars.city;
        }
        // 引入用户行为分析对象-埋码
        var yhxw = require('modules/my/yhxw');
        // 判断详情页种类，传入用户行为统计对象
        var pageId = 'mucmymoneyszmx';
        // 埋码变量数组
        var maiMaParams = {
            'vmg.page': pageId,
            'vmg.detailtype': encodeURIComponent(uriComponent)
        };
        yhxw({type: 0, pageId: pageId, params: maiMaParams});
        
        var loadMore = require('loadMore/1.0.0/loadMore');
        loadMore({
            // 接口地址
            url: ajaxUrl,
            // 数据总条数
            total: vars.listCount,
            // 首屏显示数据条数
            pagesize: 10,
            // 单页加载条数
            pageNumber: 10,
            // 加载更多按钮id
            moreBtnID: '#drag',
            // 加载数据过程显示提示id
            loadPromptID: '#moreContent',
            // 数据加载过来的html字符串容器
            contentID: '#content',
            // 加载前显示内容
            loadAgoTxt: '查看更多',
            // 加载中显示内容
            loadingTxt: '<i></i>努力加载中...',
            // 加载完成后显示内容
            loadedTxt: '查看更多'
        });
    };
});