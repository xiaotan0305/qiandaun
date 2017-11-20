define('modules/xiaoqu/historyRecord',['jquery'],function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;

        var preload = [];
        preload.push('lazyload/1.9.1/lazyload');
        require.async(preload);

        $('input[type=hidden]').each(function (index, element) {
            vars[$(this).attr('data-id')] = element.value;
        });
        //图片惰性加载
        require.async('lazyload/1.9.1/lazyload', function () {
            $('.lazyload').lazyload();
        });
        //列表加载更多 
        if(vars.action ==='historyRecord' && $("#drag") && $('#drag').length > 0) {
            require.async('loadMore/1.0.0/loadMore',function(loadMore){
                loadMore({
                    url:vars.xiaoquSite+ '?c=xiaoqu&a=ajaxGetTradeRecord'
                    +'&projcode='+vars.projcode +'&source=' + vars.source,
                    total:vars.allcount,
                    pagesize:vars.pagesize,
                    pageNumber:vars.stepByNum,
                    contentID:'#content',
                    moreBtnID : '#drag',
                    loadPromptID : '#loading',
                    firstDragFlag:false
                });
            });
        }
    };
});