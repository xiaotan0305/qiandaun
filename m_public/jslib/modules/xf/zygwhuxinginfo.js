define('modules/xf/zygwhuxinginfo', ['jquery', 'util/util'], function (require) {
    'use strict';
    var $ = require('jquery');

    var fromflag = 'zygwshop';

    $('.chatxf').on('click', function () {
        var $this = $(this);
        var city = $this.attr('city');
        var housetype = $this.attr('housetype');
        var houseid = $this.attr('houseid');
        var newcode = $this.attr('newcode');
        var type = $this.attr('type');
        var phone = $this.attr('phone');
        var channel = $this.attr('channel');
        var uname = $this.attr('uname');
        var agentid = $this.attr('agentid');
        var zhname = $this.attr('zhname');
        var agentImg = $this.attr('agentImg');
        var username = $this.attr('username');
        var zygwLink = $this.attr('zygwLink');
        try {
            window.localStorage.foobar = 'foobar';
            localStorage.setItem('fromflag', fromflag);
            localStorage.setItem('x:' + username, encodeURIComponent(zhname) + ';'
                + agentImg + ';' + encodeURIComponent('你店铺中的${requestScope.zygw.lhuxing[0].title } ') + ';' + zygwLink);
            $.ajax({
                url: '/data.d?m=houseinfotj&city=' + city + '&housetype=' + housetype + '&houseid='
                + houseid + '&newcode=' + newcode + '&type=' + type + '&phone=' + phone + '&channel=' + channel + '&agentid=' + agentid,
                async: false
            });
            setTimeout(function () {
                window.location = '/chat.d?m=chat&username=x:' + encodeURIComponent(uname) + '&city=' + city + '&type=wapxf';
            }, 500);
        } catch (_) {
            alert('若为safari浏览器,请关闭无痕模式浏览。');
        }
    });

    var telbua = navigator.userAgent.toLowerCase();
    var footTelTag = $('.foot-teltag');
    var zlsfoot = $('.zlsfoot');
    var zlsfooter = $('.zlsfooter');
    if (telbua.indexOf('android') !== -1 && (telbua.indexOf('zte') !== -1 || telbua.indexOf('samsung') !== -1
        || telbua.indexOf('lenovo') !== -1 || telbua.indexOf('sm-') !== -1 || telbua.indexOf('gt-') !== -1
        || telbua.indexOf('nexus') !== -1 || telbua.indexOf('sch-') !== -1)) {
        footTelTag.addClass('show400');
    }
    footTelTag.on('click', function () {
        if ($(this).hasClass('show400')) {
            $('#footer').hide();
            zlsfoot.text('接通后，需手动拨打分机号：' + zlsfoot.attr('name'));
            zlsfooter.attr('href', 'tel:' + zlsfooter.attr('name'));
            $('#zls400').show();
        }
    });
});