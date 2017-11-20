/**
 * Created by LXM on 15-3-16.
 * Modified by zdl
 * Modified by icy(taoxudong@fang.com) on 15-12-23
 */
define('modules/jiaju/buildList', ['jquery', 'lazyload/1.9.1/lazyload', 'loadMore/1.0.0/loadMore'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var loadMore = require('loadMore/1.0.0/loadMore');
        require('lazyload/1.9.1/lazyload');
        $('.lazyload').lazyload();

        // 搜索标签点击跳转
        var keys = [];
        var locationHref = window.location.href;
        // 数据请求失败时, 点击刷新
        $('#notfound').on('click', function () {
            window.location.reload();
        });
        // 搜索跳转地址
        function jumpByq(q) {
            var keywords = q || '';
            if (/[&?]q=/i.test(locationHref)) {
                window.location = locationHref.replace(/([&?]q=)([^&]*)(&|$)/i, '$1' + encodeURIComponent(keywords) + '$3');
            } else {
                var hasQ = /[?]/i.test(locationHref);
                window.location = locationHref + (hasQ ? '&q=' : '?q=') + encodeURIComponent(keywords);
            }
        }
        $('.tagList').find('span').each(function () {
            var $this = $(this);
            $this.data('q') && keys.push($this.data('q'));
        }).click(function () {
            var $this = $(this);
            if ($this.data('q')) {
                var index = $this.index();
                keys.splice(index, 1);
                var q = keys.join(' ');
                jumpByq(q);
            } else {
                jumpByq();
            }
        });
        var orderby = $('#orderby');
        var notfound = $('#notfound');
        notfound.on('click', function () {
            window.location.reload();
        });

        loadMore({
            // 接口地址
            url: vars.jiajuSite + '?c=jiaju&a=ajaxGetBuildList&q=' + vars.q + '&cid=' + vars.cid + '&bid=' +
            vars.bid + '&scid=' + vars.scid + '&orderby=' + vars.orderby + '&city=' + vars.city + '&type=1',
            // 数据总条数
            total: vars.total,
            // 首屏显示数据条数
            pagesize: 15,
            // 单页加载条数，可不设置
            pageNumber: 15,
            // 加载更多按钮id
            moreBtnID: '#clickmore',
            // 加载数据过程显示提示id
            loadPromptID: '#moreContent',
            // 数据加载过来的html字符串容器
            contentID: '#productlist'
            });

        // 关于筛选项的,选定项置底色
        $(function () {
            var cidNUM = $('#s_type').find('.active a').data('id');
            var scidOb;
            var scidObNum;
            if (cidNUM && parseInt(vars.scid)) {
                scidOb = $('#xifen_' + cidNUM).find('dd#ddxifen_' + vars.scid);
                scidOb.addClass('active');
                scidObNum = scidOb.find('a').data('id');
                if (parseInt(vars.bid) && scidObNum) {
                    $('#searchBrand_' + scidObNum).find('dd#ddBrand_' + vars.bid).addClass('active');
                } else {
                    $('#searchBrand_' + scidObNum).find('dd').first().addClass('active');
                }
            } else {
                $('#xifen_' + cidNUM).find('#xifen_limit_' + cidNUM).addClass('active');
            }
        });

        // 搜索用户行为收集20160114
        var page = 'mjjmateriallist';
        require.async('jsub/_vb.js?c=' + page);
        require.async('jsub/_ubm.js', function () {
            _ub.city = vars.cityname;
            _ub.biz = 'h';
            _ub.location = 0;
            var b = 1;
            var genre = +vars.cid ? [vars.cid, +vars.scid || 0, vars.bid || 0] : [];
            var order = orderby.text().trim() === '排序' ? '' : orderby.text().trim();
            var pTemp = {
                'vmg.page': page,
                'vmh.key': encodeURIComponent(vars.q),
                'vmh.materialtype': genre.join('^'),
                'vmh.order': encodeURIComponent(order)
            };
            var p = {};
            // 若pTemp中属性为空或者无效，则不传入p中
            for (var temp in pTemp) {
                if (pTemp[temp]) {
                    p[temp] = pTemp[temp];
                }
            }
            // 例如_ub.collect(0,{'mhi':' 123456','mh4':'2^4','mh2':'现代简约'})
            _ub.collect(b, p);
        });


        // 流量统计部署click20151111
        require.async(location.protocol + '//clickm.fang.com/click/new/clickm.js', function () {
            window.Clickstat.eventAdd(window, 'load', function () {
                window.Clickstat.batchEvent('wapjclist_', '');
            });
        });
    };
});