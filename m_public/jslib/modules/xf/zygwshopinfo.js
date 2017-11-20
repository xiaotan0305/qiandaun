/**
 * Created by zdl on 2015/11/05.
 * 邮箱地址：zhangdaliang@soufun.com
 */
define('modules/xf/zygwshopinfo', ['jquery','util/util','modules/xf/IcoStar'], function (require) {
    'use strict';
    var $ = require('jquery');
    var util = require('util/util');
    var IcoStar = require('modules/xf/IcoStar');
    var vars = seajs.data.vars;
    var localStorage = vars.localStorage;
    var icoStarObj = new IcoStar('.ico-star');
    var $floatTz = $('#floatTz');
    var $close = $('#close');
    var $message = $('#message');
    var initMessage = '您需要与置业顾问互动4句后，<br>才可以评价哦~';
    // 登录的cooike
    var sfut = util.getCookie('sfut');
    // 登录后获取用户名，手机号和用户ID
    var userid,username,mobile;
    function getInfo(data) {
        userid = data.userid || '';
        username = data.username || '';
        mobile = data.mobilephone || '';
    }
    // 调用ajax获取登陆用户信息
    if (sfut) {
        vars.getSfutInfo(getInfo);
    }
    // 电话统计函数
    function teltj(city, housetype, houseid, newcode, type, phone, channel, agentid) {
        $.ajax({
            url: '/data.d?m=houseinfotj&city=' + city + '&housetype=' + housetype + '&houseid=' + houseid + '&newcode='
            + newcode + '&type=' + type + '&phone=' + phone + '&channel=' + channel + '&agentid=' + agentid,
            async: true
        });
        if (typeof yhxw !== 'undefined' && yhxw && typeof _ub !== 'undefined' && _ub && typeof _ub.collect !== 'undefined'
            && _ub.collect) {
            yhxw(31);
        }
    }

    $('a[data-name="teltj"]').on('click', function () {
        teltj.apply(this, $(this).attr('data-value').split(','));
    });

    function chatxf(city, housetype, houseid, newcode, type, phone, channel, uname,agentid, zhname, agentImg, username, zygwid) {
        localStorage.setItem('fromflag', 'zygwshop');
        localStorage.setItem('x:' + username + '', encodeURIComponent(zhname) + ';' + agentImg + ';' + encodeURIComponent('你店铺中的户型 ') + ';' + zygwid);
        $.ajax({
            url: '/data.d?m=houseinfotj&city=' + city + '&housetype=' + housetype + '&houseid=' + houseid + '&newcode=' + newcode + '&type=' + type
            + '&phone=' + phone + '&channel=' + channel + '&agentid=' + agentid,
            async: false
        });
        setTimeout(function () {
            window.location = '/chat.d?m=chat&username=x:' + uname + '&city=' + city + '&type=wapxf';
        }, 500);
    }

    // 点击在线咨询按钮发起咨询
    $('a[data-id="mes"]').on('click', function () {
        var shopinfo = '/zygwshopinfo/' + vars.city + '_' + vars.zygwid + '/';
        chatxf(vars.city, 'xf', vars.tel, '', 'chat', vars.tel, 'wapshop', decodeURIComponent(vars.username),
            vars.zygwid, vars.realname1, vars.imgPath, vars.username1, shopinfo);
        $floatTz.addClass('none');
    });

    function checkcomment(href) {
        window.location = href;
    }

    $('#checkcomment').on('click', function () {
        if (userid && username) {
            checkcomment($(this).attr('data-href'));
        } else {
            alert('请先登录后再点评');
            var href = encodeURIComponent(window.location.href);
            window.location.href = 'https://m.fang.com/passport/login.aspx?burl=' + href;
        }
    });

    var $zlsfooter = $('.zlsfooter');
    var $zlsfoot = $('.zlsfoot');

    function show400() {
        $('#footer').hide();
        $zlsfoot.text('接通后，需手动拨打分机号：' + $zlsfoot.attr('name'));
        $zlsfooter.attr('href', 'tel:' + $zlsfooter.attr('name'));
        $('#zls400').show();
    }
    var telbua = navigator.userAgent.toLowerCase();
    $('.foot-teltag').on('click', function () {
        if (telbua.indexOf('android') !== -1 && (telbua.indexOf('zte') !== -1 || telbua.indexOf('samsung') !== -1
            || telbua.indexOf('lenovo') !== -1 || telbua.indexOf('sm-') !== -1 || telbua.indexOf('gt-') !== -1
            || telbua.indexOf('nexus') !== -1 || telbua.indexOf('sch-') !== -1)) {
            show400();
        }
    });

    $close.on('click',function () {
        $floatTz.addClass('none');
    });

    function showMessage(message) {
        $message.html(message);
        $floatTz.removeClass('none');
    }
});