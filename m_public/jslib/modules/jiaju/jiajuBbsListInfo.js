/**
 * Created by Young on 15-3-12.
 * 单量更改于2015-9-9
 * modify by young 2016-3-24
 */
define('modules/jiaju/jiajuBbsListInfo', ['jquery', 'loadMore/1.0.0/loadMore','lazyload/1.9.1/lazyload'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;

        // 惰性加载
        require('lazyload/1.9.1/lazyload');
        $('.lazyload').lazyload();

        // click流量统计
        require.async(location.protocol + '//clickm.fang.com/click/new/clickm.js', function () {
            window.Clickstat.eventAdd(window, 'load', function () {
                window.Clickstat.batchEvent('wapjiajubbs_', '');
            });
        });

        // 获取消息
        var message = $('.icon-my');
        message.on('click',function(){
            $.get(vars.publicSite+'?c=public&a=ajaxUserInfo',function(info){
                if(!info.userid){
                    var url = location.protocol + '//m.fang.com/passport/login.aspx?burl='+encodeURIComponent(window.location.href);
                }else{
                    var url =vars.bbsSite+'?c=bbs&a=getPersonnelLetter&username='+info.username+'&city='+vars.city;
                }
                window.location=url;
                return;
            })
        });

        // 页面访问失败，点击重新加载
        $('#reload').on('click', function () {
            window.location = window.location.href;
        });

        // 发帖
        $('.quik-reply').on('click', function () {
            var postUrl = vars.jiajuSite + '?c=jiaju&a=post&city=' + vars.city;
            window.location = postUrl;
        });

        // 加载更多
        var loadMore = require('loadMore/1.0.0/loadMore');
        loadMore({
            // 接口地址
            url: vars.jiajuSite + '?c=jiaju&a=ajaxGetZxrt&city=' + vars.city,
            // 数据总条数
            total: vars.total,
            // 首屏显示数据条数
            pagesize: 20,
            // 单页加载条数，可不设置
            pageNumber: vars.pagesize,
            // 加载更多按钮id
            moreBtnID: '#clickmore',
            // 加载数据过程显示提示id
            loadPromptID: '#moreContent',
            // 数据加载过来的html字符串容器
            contentID: '#productlist',
            loadAgoTxt: '上拉加载更多',
            loadingTxt: '加载中...',
            loadedTxt: '上拉加载更多',
            no_lazyload: 1
        });
        $('#adclose').click(function () {
            $('#ad').hide();
        });
        function yhxw(type) {
            _ub.city = vars.cityname;
            // 业务---h代表家居
            _ub.biz = 'h';
            // 家居不分南北方，都传0
            _ub.location = 0;
            // type用户动作（浏览0、打电话31、在线咨询24、分享22、收藏21）
            // 用户行为(格式：'字段编号':'值')
            // 收集方法
            _ub.collect(type, {mp3: 'h'});
        }

        // 用户行为统计
        require.async('jsub/_ubm.js?v=201407181100', function () {
            yhxw(1);
        });
    };
});