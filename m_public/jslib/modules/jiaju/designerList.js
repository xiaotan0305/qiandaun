/**
 * Created by Young on 2015-11-2.
 */
define('modules/jiaju/designerList', ['jquery', 'lazyload/1.9.1/lazyload', 'modules/jiaju/loadnewmore', 'iscroll/1.0.0/iscroll', 'footprint/1.0.0/footprint'],
    function (require, exports, module) {
        'use strict';
        module.exports = function () {
            var $ = require('jquery');
            var vars = seajs.data.vars;

            // 加载更多
            var $searchtext = $('#searchtext');
            var $notfound = $('.notfound');
            var $sContent = $('#s_content');
            var style = $('#style');
            var loadnewmore = require('modules/jiaju/loadnewmore');
            var is_sfapp=vars.is_sfapp?'&src=client':'';
            loadnewmore({
                a: 'jiaju',
                url: vars.jiajuSite + '?c=jiaju&a=ajaxGetMoreDesign&sortResult=' + vars.sortResult +
                '&DesignPrice=' + vars.DesignPrice + '&DesignStyle=' + vars.DesignStyle + '&cityid=' +
                vars.Designcity + '&all=' + vars.all + '&q=' + encodeURIComponent(vars.q) + is_sfapp
            });
            require('lazyload/1.9.1/lazyload');
            $('.lazyload').lazyload();

            // 数据请求失败
            $notfound.on('click', function () {
                window.location.reload();
            });


            // 部分地区数据统计
            var url = location.protocol + '//clickm.fang.com/click/new/clickm.js';
            require.async(url, function () {
                Clickstat.eventAdd(window, 'load', function () {
                    Clickstat.batchEvent('wapdesignerlist_', '');
                });
            });
            // 搜索用户行为收集20160114
            var page = 'mjjlistdesigner';
            require.async('jsub/_vb.js?c=' + page);
            require.async('jsub/_ubm.js', function () {
                yhxw(1);
            });

            function yhxw(type) {
                _ub.city = vars.cityname;
                // 业务---h代表家居
                _ub.biz = 'h';
                // 家居不分南北方，都传0
                _ub.location = 0;
                // 用户动作（浏览0、打电话31、在线咨询24、分享22、收藏21）
                var b = type;
                var price = ['', '0—50元/平米', '51—100元/平米', '101—200元/平米', '201—300元/平米', '300元/平米以上'];
                var pTemp = {
                    'vmh.key': encodeURIComponent(vars.q),
                    'vmg.page': page,
                    'vmh.city': encodeURIComponent(vars.cityname),
                    'vmh.charge': encodeURIComponent(price[vars.DesignPrice]),
                    'vmh.style': style.text() === '风格' ? '' : encodeURIComponent(style.text()),
                    'vmh.order': encodeURIComponent($('#orderby').text())
                };
                var p = {};
                // 若pTemp中属性为空或者无效，则不传入p中
                for (var temp in pTemp) {
                    if (pTemp[temp]) {
                        p[temp] = pTemp[temp];
                    }
                }
                // 用户行为(格式：'字段编号':'值')
                // 收集方法
                _ub.collect(b, p);
            }
        };
    });