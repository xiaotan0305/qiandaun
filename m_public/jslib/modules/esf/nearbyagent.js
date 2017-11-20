define('modules/esf/nearbyagent',['jquery'],function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        $('input[type=hidden]').each(function (index, element) {
            vars[$(this).attr('data-id')] = element.value;
        });
        vars.curp = 2;
        vars.total = $('#totalpage').html();
        vars.k = true;
        if (vars.total <= 1) {
            $('#drag').hide();
            vars.k = false;
        }
        // 滚动到页面底部时，自动加载更多经纪人
        $(window).on('scroll', function () {
            var scrollh = $(document).height();
            var bua = navigator.userAgent.toLowerCase();
            if (bua.indexOf('iphone') !== -1 || bua.indexOf('ios') !== -1) {
                scrollh -= 60;
            }
            if (vars.k !== false && $(document).scrollTop() + $(window).height() >= scrollh) {
                load();
            }
        });
        function load() {
            var draginner = $('.draginner')[0];
            var total = $('#totalpage').html();
            vars.k = false;
            $('.draginner').css('padding-left', '10px');
            draginner.style.background = 'url(//img2.soufun.com/wap/touch/img/load.gif) 0 50% no-repeat';
            draginner.innerHTML = '正在加载请稍候';
            var city = vars.city;
            var keyword = vars.keyword;
            var district = vars.district;
            var comarea = vars.comarea;
            var src = vars.src;
            $.get(vars.esfSite + '?c=esf&a=ajaxGetNearbyAgent&city=' + city + '&district=' + district + '&comarea=' + comarea + '&keyword='
                + keyword + '&src=' + src + '&page=' + vars.curp,
                    function (data) {
                        $('.content').append(data);
                        $('.draginner').css('padding-left', '0px');
                        draginner.style.background = '';
                        draginner.innerHTML = '上拉自动加载更多';
                        vars.curp = parseInt(vars.curp) + 1;
                        vars.k = true;
                        if (vars.curp > parseInt(total)) {
                            $('#drag').hide();
                            vars.k = false;
                        }
                    });
        }

        $('#drag').click(function () {
            load();
        });
        function chat(uname, img, aname, projname, zhcity, city, housetype, houseid, newcode, type, phone, channel, agentid) {
            localStorage.setItem('' + uname + '', encodeURIComponent(aname) + ';' + img + ';' + encodeURIComponent(projname + '的'));
            $.ajax({url: '/data.d?m=houseinfotj&city=' + city + '&housetype=' + housetype + '&houseid=' + houseid + '&newcode=' + newcode
            + '&type=' + type + '&phone=' + phone + '&channel=' + channel + '&agentid=' + agentid, async: false});
            setTimeout(function () {
                window.location = '/chat.d?m=chat&username=' + uname + '&city=' + city;
            }, 500);
        }
        function teltj(city, housetype, houseid, newcode, type, phone, channel, agentid) {
            $.ajax({url: '/data.d?m=houseinfotj&city=' + city + '&housetype=' + housetype + '&houseid=' + houseid + '&newcode=' + newcode
            + '&type=' + type + '&phone=' + phone + '&channel=' + channel + '&agentid=' + agentid, async: true});
        }

        $('.telbtn').on('click', function () {
            var data = $(this).attr('data-teltj');
            var dataArr = data.split(',');
            teltj(dataArr[0], dataArr[1], dataArr[2], dataArr[3], dataArr[4], dataArr[5], dataArr[6], dataArr[7], dataArr[8]);
        });

        $('.chatbtn').on('click', function () {
            var data = $(this).attr('data-chat');
            var dataArr = data.split(',');
            chat(dataArr[0], dataArr[1], dataArr[2], dataArr[3], dataArr[4], dataArr[5], dataArr[6], dataArr[7], dataArr[8], dataArr[9], dataArr[10], dataArr[11], dataArr[12]);
        });
    };
});


