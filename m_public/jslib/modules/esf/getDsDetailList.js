/**
 * 二手房详情页主类
 * by liuxinlu
 * 20151215 liuxinlu@fang.com
 */
define('modules/esf/getDsDetailList', ['jquery','loadMore/1.0.0/loadMore','modules/esf/yhxw'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        // jquery库
        var $ = require('jquery'),
        // 用户行为统计对象
            yhxw = require('modules/esf/yhxw'),
        // 加载更多
            loadMore = require('loadMore/1.0.0/loadMore');
        // 页面传入的参数
        var vars = seajs.data.vars,
        // 点评列表加载更多
            dragBox = $('#drag'),
       // 点评列表
            dpList = $('.dpList'),
        // 房源详情等含有更多按钮内容展示的第一条div
            $moreXqBox = $('.moreXqBox');
        // 二手房详情页图片增加惰性加载功能
        require.async('lazyload/1.9.1/lazyload', function () {
            $('img[data-original]').lazyload();
        });

        /**
         * 打电话统计功能
         * @param city
         * @param housetype
         * @param houseid
         * @param newcode
         * @param type
         * @param phone
         * @param channel
         * @param agentid
         * @param order
         * @param housefrom
         */
        function teltj(city, housetype, houseid, newcode, type, phone, channel, agentid, order, housefrom) {
            if (channel.indexOf('转') > -1) {
                channel = channel.replace('转', ',');
            }
            var url = vars.mainSite + 'data.d?m=houseinfotj&city=' + city + '&housetype=' + housetype
                + '&houseid=' + $.trim(houseid) + '&newcode=' + $.trim(newcode) + '&type=' + type
                + '&phone=' + $.trim(phone) + '&channel=' + $.trim(channel) + '&agentid=' + $.trim(agentid)
                + '&order=' + order + '&housefrom=';

            if (vars.hasOwnProperty('from') && vars.from.length > 0) {
                url += vars.from + '&product=soufun';
            } else {
                url += housefrom;
            }
            $.ajax(url);
            yhxw(31);
        }

        /**
         * 点击电话按钮操作
         */
        dpList.on('click','a.tj-tel',function () {
            var dataArr = $(this).attr('data-teltj').split(',');
            teltj(dataArr[0], dataArr[1], dataArr[2], dataArr[3], dataArr[4], dataArr[5], dataArr[6], dataArr[7], dataArr[8], dataArr[9]);
        });

        /**
         * 点击给我留言按钮操作
         */
        dpList.on('click','a.tj-chat',function () {
            var data = $(this).attr('data-chat');
            var dataArr = data.split(',');
            chatWeituo(dataArr[1], dataArr[2], dataArr[3], dataArr[4], dataArr[5]
                , dataArr[6], dataArr[7], dataArr[8], dataArr[9], dataArr[10], dataArr[11], dataArr[12],dataArr[13]);
        });

        /**
         * 委托房源点击咨询
         * @param city 城市简拼
         * @param housetype  房子类型，一般传esf
         * @param houseid 房源id
         * @param newcode 小区id
         * @param type 类型(chat)
         * @param phone 400电话
         * @param channel 频道类型(waphouseinfo)
         * @param uname 用户名
         * @param aname 用户真实姓名
         * @param agentid 经纪人id
         * @param order 排序，这个参数一般为空
         * @param photourl 经纪人图像url地址，有时为空
         * @param housefrom 房源类型，一般传DS
         */

        function chatWeituo(city, housetype, houseid, newcode, type, phone, channel, uname, aname, agentid, order, photourl, housefrom) {
            var url = '/data.d?m=houseinfotj&city=' + city + '&housetype='
                + housetype + '&houseid=' + $.trim(houseid) + '&newcode=' + $.trim(newcode)
                + '&type=' + type + '&phone=' + $.trim(phone) + '&channel=' + $.trim(channel) + '&agentid='
                + $.trim(agentid) + '&order=' + order + '&housefrom=';
            var xiaoqu = vars.xiaoqu || '';
            var room = vars.room || '';
            var price = vars.price || '';
            if (vars.localStorage) {
                vars.localStorage.setItem(uname, encodeURIComponent(aname) + ';' + photourl
                    + ';' + encodeURIComponent(xiaoqu + '的' + room + '价格为' + price + '的电商'));

                vars.localStorage.setItem(uname + '_allInfo', encodeURIComponent(vars.title) + ';'
                    + encodeURIComponent(vars.price + '万元') + ';' + encodeURIComponent(vars.tags.replace(/(\s*$)/g, ''))
                    + ';' + vars.titleimg + ';' + encodeURIComponent(vars.room_hall_area) + ';'
                    + encodeURIComponent(vars.district_name + '-' + vars.projname) + ';' + vars.esfSite + vars.city + '/'
                    + housefrom + '_' + vars.houseid + '.html');
            }
            if (vars.hasOwnProperty('from') && vars.from.length > 0) {
                url += vars.from + '&product=soufun';
            } else {
                url += housefrom;
            }
            $.ajax(url);
            var paramPurpose = '';
            if ($.trim(vars.purpose) === '写字楼') {
                paramPurpose = 'xzl';
            } else if ($.trim(vars.purpose) === '商铺') {
                paramPurpose = 'sp';
            }
            setTimeout(function () {
                window.location = '/chat.d?m=chat&username=' + uname + '&city=' + city
                    + '&type=wapesf&houseid=' + houseid + '&purpose=' + paramPurpose + '&housetype='
                    + housetype;
            }, 500);
            yhxw(24);
        }

        // 加载更多功能
        if (dragBox.length > 0) {
            if (parseInt(vars.allCount) < parseInt(vars.firstGetNum)) {
                dragBox.hide();
                return;
            }
            loadMore({
                url: vars.esfSite + '?c=esf&a=ajaxGetMoreList' + '&city=' + vars.cityname + '&houseid=' + vars.houseid
                + '&serverType=' + vars.serverType + '&listSource=' + vars.listSource,
                total: vars.allCount,
                pagesize: vars.firstGetNum,
                pageNumber: vars.stepByNum,
                contentID: '.dpList',
                moreBtnID: '#drag',
                loadPromptID: '#loading',
                firstDragFlag: false
            });
        }


        // 是否显示展开按钮
        $moreXqBox.each(function () {
            var allHeight = 0;
            var cH = $(this).children('.xqIntro:eq(1)').height();
            allHeight += parseInt(cH);
            if (allHeight <= 92) {
                $(this).find('.more_xq').hide();
            }
        });

        // 点击页面中的更多标签相关展示效果
        $('.dpList').on('click', '.more_xq', function () {
            var el = $(this);
            el.toggleClass('up');
            el.siblings().toggle();
        });
    };
});