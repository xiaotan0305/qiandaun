/**
 * Created by LXM on 2015/9/15.
 */
define('modules/jiaju/buildCommentList', ['jquery', 'loadMore/1.0.0/loadMore', 'lazyload/1.9.1/lazyload'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        $('input[type=hidden]').each(function (index, element) {
            vars[$(this).attr('data-id')] = element.value;
        });
        // 惰性加载
        require('lazyload/1.9.1/lazyload');
        $('.lazyload').lazyload();
        // 加载更多
        var loadMore = require('loadMore/1.0.0/loadMore');
        loadMore({
            // 接口地址
            url: vars.jiajuSite + '?c=jiaju&a=ajaxGetBuildCommentList&pid=' + vars.pid + '&did=' + vars.did
            + '&cid=' + vars.cid + '&city=' + vars.city + '&type=' + vars.type + '&r=' + Math.random(),
            // 数据总条数
            total: vars.count,
            // 首屏显示数据条数
            pagesize: 20,
            // 单页加载条数，可不设置
            pageNumber: 20,
            // 加载更多按钮id
            moreBtnID: '#clickmore',
            // 加载数据过程显示提示id
            loadPromptID: '#moreContent',
            // 数据加载过来的html字符串容器
            contentID: '#productlist',
            loadAgoTxt: '上拉加载更多',
            loadingTxt: '加载中...',
            loadedTxt: '上拉加载更多',
            no_lazyload: 1,
            callback: function () {
                if ($('#productlist>section').length >= this.total) {
                    $('#bottBox').show();
                }
            }
        });
        // type:1差评；3中评；5好评
        if (vars.type === '5' && vars.hao === '0') {
            $('#productlist').hide();
            $('#zeroshow').show();
        }
        if (vars.type === '3' && vars.zhong === '0') {
            $('#productlist').hide();
            $('#zeroshow').show();
        }
        if (vars.type === '1' && vars.cha === '0') {
            $('#productlist').hide();
            $('#zeroshow').show();
        }
    };
});
