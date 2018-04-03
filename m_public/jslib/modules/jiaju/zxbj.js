/**
 * Created by LXM on 15-3-16.
 * 单量更改于2015-9-9
 */
define('modules/jiaju/zxbj', ['jquery', 'loadMore/1.0.0/loadMore', 'lazyload/1.9.1/lazyload', 'modules/jiaju/yhxw'], function (require, exports, module) {
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
            url: vars.jiajuSite + '?c=jiaju&a=ajaxGetCaseList&CaseStyle=' + vars.CaseStyle + '&CaseRoom=' + vars.CaseRoom + '&Area=' + vars.Area + '&Price=' + vars.Price + '&cityID=' + vars.cityID + '&q=' + vars.q,
            // 数据总条数
            total: vars.total,
            // 首屏显示数据条数
            pagesize: vars.pagesize,
            // 单页加载条数，可不设置
            pageNumber: vars.pagesize,
            // 加载更多按钮id
            moreBtnID: '#loadMore',
            // 加载数据过程显示提示id
            loadPromptID: '#moreContent',
            // 数据加载过来的html字符串容器
            contentID: '#loadstart'
        });
                               

        // 数据请求失败时, 点击刷新
        $('#notfound').on('click', function () {
            window.location.reload();
        });
        // click流量统计
        require.async(location.protocol + '//clickm.fang.com/click/new/clickm.js', function () {
            window.Clickstat.eventAdd(window, 'load', function () {
                window.Clickstat.batchEvent('wapzxbj_', '');
            });
        });

        // 用户行为
        var yhxw = require('modules/jiaju/yhxw');
        var casePrice = vars.m_4.replace(/\^0?/, function (result) {
            if (result === '^') {
                return '-';
            }
            return '-99999';
        });
        yhxw({
            page: 'mjjvolumelist',
            type: 1,
            key: vars.q,
            style: $.trim($('#style span').text()),
            housetype: $.trim($('#room span').text()),
            area: $.trim($('#area span').text()),
            totalprice: casePrice
        });
    };
});