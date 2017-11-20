$(document).ready(function(){
    document.domain = 'fang.com';
    if ($('#pageTime').val()) {
        var holdTime = parseInt($('#pageTime').val());
        var openPageCount = parseInt($('#pageCount').val());
        var OpenCountEveryday = parseInt($('#openCount').val());

        //设置cookie
        function setCookie(cname, cvalue, exdays) {
            var d = new Date();
            d.setTime(d.getTime() + (exdays*24*60*60*1000));
            var expires = "expires="+d.toUTCString();
            document.cookie = cname + "=" + cvalue + "; " + expires + ' ;domain = .fang.com';
        }
        //获取cookie
        function getCookie(cname) {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for(var i=0; i<ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0)==' ') c = c.substring(1);
                if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
            }
            return "";
        }
        //清除cookie
        function clearCookie(name) {
            setCookie(name, "", -1);
        }


        // 关闭领取福袋提示条
        $('#close_fu').on('click', function () {
            $('#bottom_fu').hide();
        });

        // 点击领取福袋提示条，显示中间弹出框
        $('#bottom_fu .moving_fu').on('click', function () {
            $('#bottom_fu').hide();
            $('.pop_wrapper').show();
            $.get('/house/ajaxrequest/getFudaiUrl.php?fudai', function (data) {
                if (data) {
                    $('.pop_iframe').attr('src', data.url);
                } else {
                    //console.log('领取失败');
                }
            })
        });
        // 点击中间弹出框关闭按钮
        $('#fd_close').on('click', function () {
            $('.pop_wrapper').hide();
        });


        // 每天重置日期
        if (!getCookie('bonusDate') || getCookie('bonusDate') != new Date().getDate()) {
            // 日期
            setCookie('bonusDate', new Date().getDate(), 365);
            // 今日已经浏览的页面个数
            setCookie('openPageCount', 0, 365);
            // 今日已经浏览的页面的newcode
            setCookie('bonusNewcode', '', 365);
            // 今日已经提示次数
            setCookie('OpenCountToday', 0, 365);
        }

        // 福袋浮标
        var showfudai = function () {

            if (getCookie('OpenCountToday') < OpenCountEveryday) {
                $('#bottom_fu').show();
                setCookie('OpenCountToday', parseInt(getCookie('OpenCountToday')) + 1, 365);
            }
        };

        // 计时
        setCookie('holdTime' + newcode, 0, 365);
        var timing = setInterval(function () {
            if (parseInt(getCookie('holdTime' + newcode)) >= holdTime) {
                setCookie('holdTime' + newcode, 0, 365);
                //　提示
                showfudai();
                // 停止计时
                clearInterval(timing);
            } else {
                setCookie('holdTime' + newcode, parseInt(getCookie('holdTime' + newcode)) + 1, 365);
            }
        }, 1000);

        // 统计今日已经浏览的页面个数
        if (getCookie('bonusNewcode').indexOf(newcode) == -1) {
            setCookie('bonusNewcode', getCookie('bonusNewcode') + newcode + ',');
            setCookie('openPageCount', parseInt(getCookie('openPageCount')) + 1, 365);
        }

        if (getCookie('openPageCount') >= openPageCount) {
            showfudai();
        }
    }
});
