lazyload Release 说明文档

1.功能

    上拉加载更多插件

2.用法
异步
require.async('loadMore/1.0.1/loadMore', function (loadMore) {
    loadMore.add({
        url: vars.zfSite + vars.nowUrl + 'c=zf&a=' + ajaxActionName + '&city=' + vars.city,
        total: vars.total,
        pagesize: 32,
        pageNumber: 20,
        content: '#content',
        moreBtn: '#drag',
        loadPrompt: '#loading'
    });
    loadMore.init();
});
同步
var loadMore=require('loadMore/1.0.1/loadMore');
loadMore.add({
   url: vars.zfSite + vars.nowUrl + 'c=zf&a=' + ajaxActionName + '&city=' + vars.city,
   total: vars.total,
   pagesize: 32,
   pageNumber: 20,
   content: '#content',
   moreBtn: '#drag',
   loadPrompt: '#loading'
});
loadMore.init();
