/**
 * wap/1214二手房经纪人店铺 内部经纪人的更多房源列表页面
 * create by zdl 2015-12-16
 * 邮箱地址（zhangdaliang@fang.com）
 */
define('modules/agent/innerListForShop', ['jquery'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var vars = seajs.data.vars;
        var $ = require('jquery');
        var $dragId = $('#drag');
        // 内部经纪人推荐的更多房源列表
        var kBool = true;
        var totalNum = vars.count;
        if (totalNum <= 10) {
            $dragId.hide();
            kBool = false;
        }
	//modified by bjwanghongwei@fang.com 
	//2016 1220
	//修改加载更多，调用插件
        if (kBool && $dragId && $dragId.length > 0) {
            require.async('loadMore/1.0.0/loadMore', function (loadMore) {
                loadMore({
                    url: vars.agentSite  + '?c=agent&a=ajaxGetAgentHouseList&agentid=' + vars.agentid
                    + '&city=' + vars.city + '&type=' + vars.src + '&agenttype=' + vars.agenttype,
                    total:totalNum,
                    pagesize:10,
                    pageNumber:vars.stepByNum,
                    contentID:'#content',
                    moreBtnID : '#drag',
                    loadPromptID : '#loading',
                    firstDragFlag:false
                });
            });
        }
        // 图片延迟加载
        require.async('lazyload/1.9.1/lazyload', function () {
            $('img[data-original]').lazyload();
        });

        function chatWeituo(zhcity, city, housetype, houseid, newcode, type, phone, channel, uname, aname, agentid, order, photourl, housefrom) {
            if (vars.localStorage) {
                window.localStorage.setItem(String(uname), encodeURIComponent(aname) + ';' + photourl + ';' + encodeURIComponent(vars.district + '的'));
            }
            $.ajax({
                url: '/data.d?m=houseinfotj&city=' + city + '&housetype=' + housetype + '&houseid=' + houseid
                + '&newcode=' + newcode + '&type=' + type + '&phone=' + phone + '&channel=' + channel + '&agentid='
                + agentid + '&order=' + order + '&housefrom=' + housefrom,
                async: false
            });
            setTimeout(function () {
                window.location = '/chat.d?m=chat&username=' + uname + '&city=' + city;
            }, 500);
        }

        function teltj(city, channel, housetype, houseid, type, phone, housefrom, agentid) {
            $.ajax({
                url: vars.mainSite + 'data.d?m=houseinfotj&city=' + city + '&housetype=' + housetype + '&houseid='
                + houseid + '&type=' + type + '&phone=' + phone + '&channel=' + channel + '&agentid=' + agentid + '&housefrom=' + housefrom,
                async: true
            });
        }

        $('.tj-chat').on('click', function () {
            var data = $(this).attr('data-chat');
            var dataArr = data.split(',');
            chatWeituo.apply(this,dataArr);
        });


        $('.tj-tel').on('click', function () {
            var data = $(this).attr('data-teltj');
            var dataArr = data.split(',');
            teltj.apply(this,dataArr);
        });
    };
});
