
define('modules/jiaju/articleList',[
    'jquery',
    'loadMore/1.0.0/loadMore',
    'lazyload/1.9.1/lazyload',
    'modules/jiaju/yhxw'
],function (require,exports,module) {
    'use strict';
    module.exports = function () {
        var vars = seajs.data.vars;
        var $ = require('jquery');
        require('lazyload/1.9.1/lazyload');
        $('.lazyload').lazyload();
        var loadMore = require('loadMore/1.0.0/loadMore');
        $('#datatimeout').on('click', function () {
            window.location.reload();
        });
        // 用户行为
        var yhxw = require('modules/jiaju/yhxw');
        var page = vars.type === '2' ? 'jj_jjq^remenlb_wap' : 'jj_jjq^zuixinlb_wap';
        yhxw({
            page: page
        });
    
        loadMoreFn();
        function loadMoreFn() {
            loadMore({
                // 接口地址
                url: location.protocol + vars.jiajuSite + '?c=jiaju&a=ajaxGetArticleList&city=' + vars.city + '&type=' + vars.type,
                // 数据总条数
                total: vars.total,
                // 首屏显示数据条数
                pagesize: 20,
                // 单页加载条数，可不设置
                pageNumber: 20,
                // 加载更多按钮id
                moreBtnID: '#clickmore',
                // 加载数据过程显示提示id
                loadPromptID: '#prompt',
                // 数据加载过来的html字符串容器
                contentID: '#content',
                loadingTxt: '努力加载中...',
                loadAgoTxt: '点击加载更多...'
            });
        }
    };
});

