/**
 * wap/1214二手房经纪人店铺 经纪人店铺首页
 * create by zdl 2015-12-16
 * 邮箱地址（zhangdaliang@fang.com）
 */
define('modules/agent/agentShop', ['jquery', 'iscroll/2.0.0/iscroll-lite', 'lazyload/1.9.1/lazyload', 'modules/esf/yhxw'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var IScrolllist = require('iscroll/2.0.0/iscroll-lite');
        var lazyLoad = require('lazyload/1.9.1/lazyload');
        var vars = seajs.data.vars;
        // 添加用户行为对象
        var yhxw = require('modules/esf/yhxw');

        // 用户行为统计
        yhxw({type: 0, pageId: 'esf_jjr^xq_wap', curChannel: 'agent'});
        lazyLoad('img[data-original]').lazyload();
        // 调整图片的尺寸
        var $image = $('img[name="resize"]');
        $image.each(function (index) {
            var w = $image.eq(index).parent().width();
            // 1.333为从服务器请求的图片的宽高比例4/3
            var h = w / 1.333;
            $image.eq(index).parent().css({width: w, height: h});
            $image.eq(index).css({width: w, height: h});
        });
        // 解决lazyload加载问题
        var $lazyLoadImg = $('img[data-original]');
        $lazyLoadImg.each(function (index) {
            var imageIndex = $lazyLoadImg.eq(index);
            if (imageIndex.attr('data-original') !== '' && imageIndex.attr('src') !== imageIndex.attr('data-original')) {
                imageIndex.attr('src', imageIndex.attr('data-original'));
            }
        });
        // 精选房源div添加滑动效果start
        var $iscrollJXId = $('#iscrollJX');
        var leng = 0;
        // 判断该页面是否存在推荐的精选房源
        if ($iscrollJXId.length) {
            // 获取精选房源下的li的个数
            var $scrollerLi = $iscrollJXId.find('li');
            // 获取滑动ul的总长度
            $scrollerLi.each(function () {
                leng += $(this).width() + 10;
            });
            // 动态设置滑动div ul的宽度
            $iscrollJXId.width(leng);
            // 精选房源添加滑动效果
            new IScrolllist('#scrollerJX', {scrollX: true, bindToWrapper: true, eventPassthrough: true});
            // 精选房源div添加滑动效果end
        }


        // 急售房源div添加滑动效果start
        var $iscrollJSId = $('#iscrollJS');
        // 判断该页面是否存在推荐的急售房源
        if ($iscrollJSId.length) {
            leng = 0;
            // 获取急售房源下的li的个数
            var $scrollerLiJS = $iscrollJSId.find('li');
            // 获取滑动ul的总长度
            $scrollerLiJS.each(function () {
                leng += $(this).width() + 10;
            });
            // 动态设置滑动div ul的宽度
            $iscrollJSId.width(leng);
            // 急售房源添加滑动效果
            new IScrolllist('#scrollerJS', {scrollX: true, bindToWrapper: true, eventPassthrough: true});
            // 急售房源div添加滑动效果end
        }
        // 获取该页面从那个页面进入
        var enterPage = vars.channel_url;
        // 查看更多房源按钮
        var $alllpC = $('.alllp.agentHouseInfo');

        // 从什么页面进入则展示该类型模块
        var type = $('#' + enterPage + 'fy'),
            cnum = parseInt(type.attr('data-value'));
        if (type.length) {
            if (cnum <= 6) {
                $alllpC.hide();
            }
            $alllpC.find('a').attr('href', type.attr('url'));
            $alllpC.find('span').text('查看更多房源' + cnum + '套');
            type.attr('class', 's2').siblings().attr('class', 's1'); 
            $('#' + enterPage + 'fyContents').show().siblings().not('.esforzu').hide();
        }

        // 二手房源与急售房源的相互切换显示
        $('.esforzu').find('div').on('click', function(){
            var bn = $(this),
                bid = bn.attr('id'),
                channel = bid.replace('fy', ''),
                thisNum = parseInt(bn.attr('data-value'));
                bn.attr('class', 's2').siblings().attr('class', 's1');
                if (thisNum <= 6) {
                    $alllpC.hide();
                } else {
                    $alllpC.show();
                }
                $alllpC.find('span').text('查看更多房源' + thisNum + '套');
                $alllpC.find('a').attr('href', bn.attr('url'));
                $('#'+channel+'fyContents').show().siblings().not('.esforzu').hide();
        });

        // 电话统计函数
        function teltj(city, channel, housetype, houseid, type, phone, housefrom, agentid) {
            $.ajax({
                url: vars.mainSite + 'data.d?m=houseinfotj&city=' + city + '&housetype=' + housetype + '&houseid='
                + houseid + '&type=' + type + '&phone=' + phone + '&channel=' + channel + '&agentid=' + agentid + '&housefrom=' + housefrom,
                async: true
            });
        }

        // 在线咨询函数
        function chatWeituo(zhcity, city, housetype, houseid, newcode, type, phone, channel, uname, aname, agentid, order, photourl, housefrom) {
            if (vars.localStorage) {
                window.localStorage.setItem(String(uname), encodeURIComponent(aname) + ';'
                    + photourl + ';' + encodeURIComponent(vars.district + '的'));
            }
            $.ajax({
                url: '/data.d?m=houseinfotj&zhcity=' + zhcity + '&city=' + city + '&housetype=' + housetype + '&houseid=' + houseid
                + '&newcode=' + newcode + '&type=' + type + '&phone=' + phone + '&channel=' + channel + '&agentid='
                + agentid + '&order=' + order + '&housefrom=' + housefrom,
                async: false
            });
            setTimeout(function () {
                window.location = '/chat.d?m=chat&username=' + uname + '&city=' + city;
            }, 500);
        }

        // 点击在线咨询跳转到咨询界面
        $('.tj-chat').on('click', function () {
            var data = $(this).attr('data-chat');
            var dataArr = data.split(',');
            chatWeituo.apply('this', dataArr);
        });
        // 点击打电话完成电话统计
        $('.tj-tel').on('click', function () {
            var data = $(this).attr('data-teltj');
            var dataArr = data.split(',');
            teltj.apply('this', dataArr);
        });
        // 点击‘Ta的房源’、‘Ta的回答’
        var jjrtabNav = $('.jjrtabNav');
        if (jjrtabNav.length) {
            jjrtabNav.find('a').on('click', function(){
                var el = $(this),
                    idVal = el.attr('id');
                el.attr('class', 'active');
                el.siblings().removeClass('active');
                if (idVal === 'answer') {
                    $('.agentHouseInfo').hide();
                    $('.agentAskInfo').show();                                        
                } else if (idVal === 'house') {
                    $('.agentHouseInfo').show();
                    $('.agentAskInfo').hide();
                }
            });
        }
    };
});
