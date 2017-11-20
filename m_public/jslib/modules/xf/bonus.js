$(document).ready(function(){
    document.domain = 'fang.com';
    if ($('#pageTime').val()) {
        var holdTime = parseInt($('#pageTime').val());
        var openPageCount = parseInt($('#pageCount').val());
        var OpenCountEveryday = parseInt($('#openCount').val());

        //����cookie
        function setCookie(cname, cvalue, exdays) {
            var d = new Date();
            d.setTime(d.getTime() + (exdays*24*60*60*1000));
            var expires = "expires="+d.toUTCString();
            document.cookie = cname + "=" + cvalue + "; " + expires + ' ;domain = .fang.com';
        }
        //��ȡcookie
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
        //���cookie
        function clearCookie(name) {
            setCookie(name, "", -1);
        }


        // �ر���ȡ������ʾ��
        $('#close_fu').on('click', function () {
            $('#bottom_fu').hide();
        });

        // �����ȡ������ʾ������ʾ�м䵯����
        $('#bottom_fu .moving_fu').on('click', function () {
            $('#bottom_fu').hide();
            $('.pop_wrapper').show();
            $.get('/house/ajaxrequest/getFudaiUrl.php?fudai', function (data) {
                if (data) {
                    $('.pop_iframe').attr('src', data.url);
                } else {
                    //console.log('��ȡʧ��');
                }
            })
        });
        // ����м䵯����رհ�ť
        $('#fd_close').on('click', function () {
            $('.pop_wrapper').hide();
        });


        // ÿ����������
        if (!getCookie('bonusDate') || getCookie('bonusDate') != new Date().getDate()) {
            // ����
            setCookie('bonusDate', new Date().getDate(), 365);
            // �����Ѿ������ҳ�����
            setCookie('openPageCount', 0, 365);
            // �����Ѿ������ҳ���newcode
            setCookie('bonusNewcode', '', 365);
            // �����Ѿ���ʾ����
            setCookie('OpenCountToday', 0, 365);
        }

        // ��������
        var showfudai = function () {

            if (getCookie('OpenCountToday') < OpenCountEveryday) {
                $('#bottom_fu').show();
                setCookie('OpenCountToday', parseInt(getCookie('OpenCountToday')) + 1, 365);
            }
        };

        // ��ʱ
        setCookie('holdTime' + newcode, 0, 365);
        var timing = setInterval(function () {
            if (parseInt(getCookie('holdTime' + newcode)) >= holdTime) {
                setCookie('holdTime' + newcode, 0, 365);
                //����ʾ
                showfudai();
                // ֹͣ��ʱ
                clearInterval(timing);
            } else {
                setCookie('holdTime' + newcode, parseInt(getCookie('holdTime' + newcode)) + 1, 365);
            }
        }, 1000);

        // ͳ�ƽ����Ѿ������ҳ�����
        if (getCookie('bonusNewcode').indexOf(newcode) == -1) {
            setCookie('bonusNewcode', getCookie('bonusNewcode') + newcode + ',');
            setCookie('openPageCount', parseInt(getCookie('openPageCount')) + 1, 365);
        }

        if (getCookie('openPageCount') >= openPageCount) {
            showfudai();
        }
    }
});
