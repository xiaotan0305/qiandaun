/**
 * by bjwanghongwei@fang.com
 * 经纪人快筛加搜索功能  20161121
 */
define('modules/agent/searchAgent', ['modules/esf/yhxw'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        // jquery索引
        var $ = require('jquery');
        // 页面传入的参数
        var vars = seajs.data.vars;
        // 快筛栏
        var filterBox = $('#filterBox');
        // 添加用户行为对象
        var yhxw = require('modules/esf/yhxw');
        // 用户行为统计
        yhxw({type: 0, pageId: 'esf_jjr^lb_wap', curChannel: 'agent'});
        //快筛插件
        require.async(['modules/jiaju/filters'], function (filter) {
            filter();
        });
        // 通用方法,引入快筛插件用到
        vars.jiajuUtils = {
            // 禁用/启用touchmove
            toggleTouchmove: (function () {
                function preventDefault(e) {
                    e.preventDefault();
                }

                return function (unable) {
                    document[unable ? 'addEventListener' : 'removeEventListener']('touchmove', preventDefault);
                };
            })()
        };

        // 推荐经纪人拨打电话或在线聊天
        function chat(zhcity, city, housetype, houseid, newcode, type, phone, channel, uname, aname, agentid, photourl) {
            if (vars.localStorage) {
                window.localStorage.setItem(String(uname), encodeURIComponent(aname) + ';'
                    + photourl + ';' + encodeURIComponent(vars.district + '的'));
            }
            $.ajax({
                url: vars.mainSite + 'data.d?m=houseinfotj&city=' + city + '&housetype=' + housetype + '&houseid=' + houseid + '&newcode='
                + newcode + '&type=' + type + '&phone=' + phone + '&channel=' + channel + '&agentid=' + agentid,
                async: false
            });
            setTimeout(function () {
                var chatUrl = vars.mainSite + 'chat.d?m=chat&username=' + uname + '&city=' + city;
                window.location = chatUrl;
            }, 500);
        }

        function teltj(city, housetype, houseid, newcode, type, phone, channel, agentid) {
            $.ajax({
                url: vars.mainSite + 'data.d?m=houseinfotj&city=' + city + '&housetype=' + housetype + '&houseid=' + houseid
                + '&newcode=' + newcode + '&type=' + type + '&phone=' + phone + '&channel=' + channel + '&agentid=' + agentid,
                async: true
            });
            $.ajax({
                url: vars.mainSite + 'data.d?m=tel&city=' + city + '&housetype=' + housetype + '&id=' + houseid + '&phone='
                + phone, async: true
            });
        }

        $('.call').on('click', function () {
            var data = $(this).attr('data-teltj');
            var dataArr = data.split(',');
            teltj(dataArr[0], dataArr[1], dataArr[2], dataArr[3], dataArr[4], dataArr[5], dataArr[6], dataArr[7]);
        });
        $('.mes').on('click', function () {
            var data = $(this).attr('data-chat');
            var dataArr = data.split(',');
            chat(dataArr[0], dataArr[1], dataArr[2], dataArr[3], dataArr[4], dataArr[5], dataArr[6], dataArr[7], dataArr[8], dataArr[9], dataArr[10], dataArr[12]);
        });

        // 房源顾问曝光量统计
        if (vars.agentListPos) {
            $.ajax({
                type: 'post',
                url: window.location.protocol + '//esfbg.3g.fang.com/fygwlist.htm',
                data: vars.agentListPos
            });
        }

        //加载更多
        var dragBox = $('#drag');
        if (dragBox.length > 0) {
            if (vars.jhAgent) {
                if (vars.type === 'zf') {
                    var ajaxUrl = vars.agentSite + '/?c=agent&a=getzfAgentList&city=' + vars.city + '&newcode=' + vars.newcode + '&groupid=' + vars.groupid + '&houseid=' + vars.houseid + '&agentid=' + vars.agentid;
                } else if (vars.housetype == 'JHDS') {
                    var ajaxUrl = vars.agentSite + '/?c=agent&a=ajaxGetDsJjr&city=' + vars.city + '&houseid=' + vars.houseid + '&housetype=' + vars.housetype;
                } else {
                    var ajaxUrl = vars.agentSite + '/?c=agent&a=getMoreAgentList&city=' + vars.city + '&newcode=' + vars.newcode + '&groupid=' + vars.groupid + '&houseid=' + vars.houseid + '&agentid=' + vars.agentid;
                }
            } else {
                var ajaxUrl = vars.agentSite + vars.city + '/?c=agent&a=ajaxLoadmoreAgent&rank=' + vars.orderby + '&district=' + vars.district + '&comarea=' + vars.comarea + '&keyword=' + vars.keyword;
            }
            require.async('loadMore/1.0.0/loadMore', function (loadMore) {
                loadMore({
                    url: ajaxUrl,
                    total: vars.total,
                    pagesize: vars.pagesize,
                    pageNumber: vars.stepByNum,
                    contentID: '#content',
                    moreBtnID: '#drag',
                    loadPromptID: '#loading',
                    callback: function(data) {
                        // 每页房源顾问曝光率统计
                        console.log(data.pageMarloadFlag);
                        if ($('.agentListPos' + data.pageMarloadFlag).val()) {
                            $.ajax({
                                type: 'post',
                                url: window.location.protocol + '//esfbg.3g.fang.com/fygwlist.htm',
                                data: $('.agentListPos' + data.pageMarloadFlag).val(),
                            });
                        }
                    }
                });
            });
        }
        // 页面向上滚动筛选栏固顶向下滚动加筛选栏隐藏
        var initTop = 114;
        $(window).on('scroll', function () {
            if ($('#nav').css('display') === 'none' && filterBox.hasClass('tabSx') === false) {
                var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
                if (scrollTop > initTop || scrollTop < 114) {
                    filterBox.removeClass('tabFixed');
                } else {
                    filterBox.addClass('tabFixed');
                }
                initTop = scrollTop;
            }
        });
        //searchagent方法点击经济人认证图标，提醒
        $('#content').on('click', '.toast', function () {
            //点击同时只能存在一个，以最新点击为主
            $('.toast').children("span").text('');
            $('.toast').children("span").removeClass('ts');
            //展示最新惦记
            var $that = $(this);
            var toastid = $that.attr('id');
            $that.children("span").addClass('ts');
            switch(toastid){
                case "sfrz":$that.children("span").text('身份认证');break;
                case "mprz":$that.children("span").text('名片认证');break;
                case "zyzgrz":$that.children("span").text('执业资格认证');break;
                case "xyrz":$that.children("span").text('信用认证');break;
                case "gjrz":$that.children("span").text('高级认证');break;
                case "jcrz":$that.children("span").text('基础认证');break;
            }
            setTimeout(function () {
                $that.children("span").text('');
                $that.children("span").removeClass('ts');
            }, 3000);
        });
    };
});