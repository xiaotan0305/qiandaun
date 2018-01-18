define('modules/xiaoqu/historyRecord',['jquery'],function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;

        var preload = [];
        preload.push('lazyload/1.9.1/lazyload');
        require.async(preload);
        // 用户行为布码
        function buMa() {
            // 所在城市（中文）
            _ub.city = vars.cityname;
            // 新房的页面值为 'n'、二手房为 'e'、租房为 'z'、注意房贷计算器页此处值为g
            // 新房“n”，二手房e，租房n，查房价v,家居h，资讯i,知识k
            _ub.biz = 'V';
            // 方位 ，网通为0，电信为1，如果无法获取方位，记录0
            var ns = vars.ns === 'n' ? 0 : 1;
            _ub.location = ns;
            // b值 0：浏览
            var b = 0;
            _ub.collect(b, {'vmg.page': 'esf_xq^cj_wap'});
        }
        require.async('jsub/_vb.js?c=esf_xq^cj_wap');
        require.async('jsub/_ubm.js?v=201407181100', function () {
            buMa();
        });
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