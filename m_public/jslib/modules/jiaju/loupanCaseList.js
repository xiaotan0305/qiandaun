/**
 * Created by young on 2017-6-19.
 */
define('modules/jiaju/loupanCaseList', [
    'jquery',
    'loadMore/1.0.0/loadMore',
    'lazyload/1.9.1/lazyload',
    'modules/jiaju/yhxw'
], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var contFlexbox = $('#contFlexbox');
        var contDisplay = contFlexbox.css('display');
        var loadMore = require('loadMore/1.0.0/loadMore');
        var lazy = require('lazyload/1.9.1/lazyload');
        lazy('.lazyload').lazyload();

        loadMore({
            // 接口地址
            url: vars.jiajuSite + '?c=jiaju&a=ajaxLoupanCaseList&CaseStyle=' + vars.CaseStyle + '&CaseRoom=' + vars.CaseRoom + '&Area=' + vars.Area + '&Price=' + vars.Price + '&cityID=' + vars.cityID + '&RealEstateID=' + vars.RealEstateID + '&count=' + vars.count,
            // 数据总条数
            total: vars.total,
            // 首屏显示数据条数
            pagesize: vars.pagesize,
            // 单页加载条数，可不设置
            pageNumber: vars.pagesize,
            // 加载更多按钮id
            moreBtnID: '#clickmore',
            // 加载数据过程显示提示id
            loadPromptID: '#prompt',
            // 数据加载过来的html字符串容器
            contentID: '#content'
        });


        // 数据请求失败时, 点击刷新
        $('#notfound').on('click', function () {
            window.location.reload();
        });

        // 用户行为
        var yhxw = require('modules/jiaju/yhxw');
        yhxw({
            page: 'mjjprojcaselist',
            type: 1,
            style: $('#style').text().trim(),
            housetype: $('#room').text().trim(),
            area: $('#area').text().trim(),
            totalprice: $('#price').text().trim()
        });
    };
});