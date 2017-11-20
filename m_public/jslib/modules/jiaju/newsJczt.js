/**
 * Created by zhangxiaowei on 15-9-10.
 * 装修资讯-精彩专题
 * Modified by LXM on 15-9-18.
 */
define('modules/jiaju/newsJczt', ['jquery', 'loadMore/1.0.0/loadMore','lazyload/1.9.1/lazyload'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var loadMore = require('loadMore/1.0.0/loadMore');
        require('lazyload/1.9.1/lazyload');
        $('.lazyload').lazyload();

        loadMore({
            // 接口地址
            url: vars.jiajuSite + '?c=jiaju&a=ajaxNewsJczt&cid=201312008&num=20',
            // 数据总条数
            total: vars.total,
            // 首屏显示数据条数
            pagesize: 20,
            // 单页加载条数，可不设置
            pageNumber: 20,
            // 加载更多按钮id
            moreBtnID: '#clickmore',
            // 加载数据过程显示提示id
            loadPromptID: '#news',
            // 数据加载过来的html字符串容器
            contentID: '#content'
        });

        if ($(document).height() <= $(window).height()) {
            // 没数据
            var section = $('#section');
            if (Number(vars.total) > 0) {
                section.css({'margin-bottom': ($(window).height() - section.offset().top - section.height() - 127).toString() + 'px'});
            }
        }
        // 搜索用户行为收集20170302
        var page = 'mzxjjdailyzt';
        require.async('jsub/_vb.js?c=' + page);
        require.async('jsub/_ubm.js', function () {
            // 所在城市（中文）
            _ub.city = vars.cityname;
            // 固定值，家居
            _ub.biz = 'i';
            // 方位 ，网通为0，电信为1，如果无法获取方位，记录0
            _ub.location = 0;
            var b = 1;
            var p = {
                'vmg.page': page,
            };
            // 例如_ub.collect(0,{'mhi':' 123456','mh4':'2^4','mh2':'现代简约'})
            _ub.collect(b, p);
        });
    };
});