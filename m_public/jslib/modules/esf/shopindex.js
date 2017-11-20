define('modules/esf/shopindex',['jquery'],function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        $('input[type=hidden]').each(function (index, element) {
            vars[$(this).attr('data-id')] = element.value;
        });
        var a = '1';
        $('#shouqi').on('click', function () {
            document.getElementById('more').style.display = 'none';
            a = '1';
        });
        $('#daohang').on('click', function () {
            if (a === '1') {
                document.getElementById('more').style.display = 'block';
                a = '2';
            } else if (a === '2') {
                document.getElementById('more').style.display = 'none';
                a = '1';
            }
        });
        if (document.getElementById('agentid')) {
            var uname = $('#agentid').html();
            $.getJSON('/chat.d?m=agent&uname=' + uname + '&city=' + vars.city, function (data) {
                var status = data.root.status;
                var aname = $('#enagentid').html();
                var agentImg = $('#agent_img').attr('src');
                var enagentName = $('#enagent_name').html();
                var xiaoqu = $('#xiaoqu').html() === null ? '' : $('#xiaoqu').html();
                var enzhcity = $('#enzhcity').html();
                if (status === 1) {
                    $('#chat').attr('href', 'javascript:chat(\'' + enzhcity + '\',\'' + vars.city + '\',\'esf\',\'\',\'' + vars.cimallInfoidty
                        + '\',\'chat\',\'' + vars.mobilecode + '\',\'wapshopinfo\',\'' + uname + '\',\'' + enagentName + '\',\'' + vars.agentcode
                        + '\')');
                    $('#chat').text('在线咨询');
                    $('#chat').addClass('icocha');
                } else {
                    $('#chat').attr('href', 'javascript:chat(\'' + enzhcity + '\',\'' + vars.city + '\',\'esf\',\'\',\'' + vars.cimallInfoidty
                        + '\',\'chat\',\'' + vars.mobilecode + '\',\'wapshopinfo\',\'' + uname + '\',\'' + enagentName + '\',\'' + vars.agentcode
                        + '\')');
                    $('#chat').addClass('icocha');
                    $('#chat').text('给我留言');
                    $('#chat').css('background-image', 'url(//img2.soufun.com/wap/touch/img/chatoffn.png)');
                }
                if (aname !== null && aname !== '') {
                    localStorage.setItem('' + uname + '', aname + ';' + agentImg + ';' + encodeURIComponent(xiaoqu + '的'));
                }
            });
        }

        /* 经纪人列表免费沟通*/
        function chat(uname, img, aname, projname, zhcity, city, housetype, houseid, newcode, type, phone, channel, agentid) {
            localStorage.setItem('' + uname + '', encodeURIComponent(aname) + ';' + img + ';' + encodeURIComponent(projname + '的'));
            $.ajax({url: '/data.d?m=houseinfotj&city=' + city + '&housetype=' + housetype + '&newcode=' + newcode + '&type=' + type + '&phone='
            + phone + '&channel=' + channel + '&agentid=' + agentid, async: false});
            setTimeout(function () {
                window.location = '/chat.d?m=chat&username=' + uname + '&city=' + city;
            }, 500);
        }
        function teltj(city, housetype, houseid, newcode, type, phone, channel, agentid) {
            $.ajax({url: '/data.d?m=houseinfotj&city=' + city + '&housetype=' + housetype + '&houseid=' + houseid + '&newcode=' + newcode
            + '&type=' + type + '&phone=' + phone + '&channel=' + channel + '&agentid=' + agentid, async: true});
        }
            
        $('.tj-tel').on('click', function () {
            var data = $(this).attr('data-teltj');
            var dataArr = data.split(',');
            teltj(dataArr[0], dataArr[1], dataArr[2], dataArr[3], dataArr[4], dataArr[5], dataArr[6], dataArr[7]);
        });
        $('#chat').on('click', function () {
            var data = $(this).attr('data-chat');
            var dataArr = data.split(',');
            chat(dataArr[0], dataArr[1], dataArr[2], dataArr[3], dataArr[4], dataArr[5], dataArr[6], dataArr[7], dataArr[8], dataArr[9], dataArr[10]);
        });
    };
});

