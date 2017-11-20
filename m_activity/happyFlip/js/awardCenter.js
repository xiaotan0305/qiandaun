/*
 * @file: awardCenter
 * @author: yangfan
 * @Create Time: 2016-05-30 15:08:47
 */
$(function () {
    'use strict';

    /**
        phoneRegEx �绰��������,
        allowGet �������������֤���ʶ,
        smsLogin ������֤�� js ����,
        smsTimer ���� timer ,
        smsDelay ������,
        smsPhone �绰��������� jq ����,
        smsBtn ������֤�� jq ����,
        smsPhoneValue �绰����ֵ,
        smsCode ��֤������� jq ����,
        smsCodeValue ��֤��ֵ,
        loginBtn ��¼��ť jq ����;
     */
    var phoneRegEx = /^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$/i,
        allowGet = true,
        smsLogin = window.smsLogin,
        smsTimer = null,
        smsDelay = 60,
        smsPhone = $('.js_sms_phone'),
        smsBtn = $('.btn-ok'),
        smsPhoneValue = '',
        smsCode = $('.js_sms_code'),
        smsCodeValue = '',
        loginBtn = $('.btn-pay');

    var formData = {};

    var realPhone = smsPhone.val();
    smsPhone.val(realPhone.substr(0, 3) + '****' + realPhone.substr(7));

    function formCheck() {
        var username = $('input[name="username"]').val();
        if (!username) {
            showMsg('�������콱��������');
            return false;
        }

        var handphone = $('input[name="handphone"]').val();
        if (!phoneRegEx.test(handphone)) {
            showMsg('��������ȷ���콱���ֻ��ţ�');
            return false;
        }

        var address = $('textarea[name="address"]').val();
        if (!address) {
            showMsg('�������콱����ϸ��ַ��');
            return false;
        }
        formData = {
            username: encodeURIComponent(encodeURIComponent(username)),
            handphone: handphone,
            address: encodeURIComponent(encodeURIComponent(address))
        };
        return true;
    }

    // ��ȡurl�еĲ���
    function getUrlParam(name) {
        // ����һ������Ŀ�������������ʽ����
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
        // ƥ��Ŀ�����
        var r = window.location.search.substr(1).match(reg);
        // ���ز���ֵ
        if (r !== null) {
            return unescape(r[2]);
        }
        return null;
    }

    function requestAjax() {
        var url = 'http://' + window.location.hostname + '/huodongAC.d?class=FanfanleHc&m=updateWinPhone&lotteryId=' + getUrlParam('lotteryId') + '&winId=' + getUrlParam('winId');
        formData.phone = $('input[name="phone"]').val();
        formData.checkcode = $('input[name="checkcode"]').val();
        $.get(url, formData, function (data) {
            var dataRoot = JSON.parse(data).root;
            if (dataRoot.status === 'fail') {
                showMsg(dataRoot.message);
            } else if (dataRoot.status === 'success') {
                showMsg(dataRoot.message);
                urlReload('http://' + window.location.hostname + '/huodongAC.d?class=FanfanleHc&m=getWinList&lotteryId=' + getUrlParam('lotteryId'));
            } else {
                showMsg(dataRoot.message);
            }
        });
    }

    /**
     * ������ת�������ȡ���档
     */
    function urlReload(url) {
        window.location.href = url || window.location.href + '&r=' + Math.random();
    }

    /**
     * ������֤�뵹��ʱʱ��
     * 1�������Ƿ����������֤���ʶ
     * 2�����ĵ���ʱʱ��
     * 3������ʱ�䡢״̬��
     */
    function updateSmsDelay() {
        allowGet = false;
        smsBtn.html(getDelayText(smsDelay));
        clearInterval(smsTimer);
        smsTimer = setInterval(function () {
            smsDelay--;
            smsBtn.html(getDelayText(smsDelay));
            if (smsDelay < 0) {
                clearInterval(smsTimer);
                smsBtn.html('������֤��');
                smsDelay = 60;
                allowGet = true;
            }
        }, 1000);

        function getDelayText(second) {
            return '���·���(' + (100 + second + '').substr(1) + ')';
        }
    }

    /**
     * ���������֤�밴ť������״̬������Ӧ��ʾ
     * �������֤�룬�ɹ�����ֹ���������ӳ�һ���ӵ���ʱ��ʧ�ܣ���ʾ��
     */
    smsBtn.on('click', function () {
        if (!allowGet) {
            showMsg('��һ�����Ժ�����');
            return false;
        }
        smsPhoneValue = realPhone.trim();

        if (!smsPhoneValue) {
            showMsg('�ֻ��Ų���Ϊ��');
            return false;
        }

        if (!phoneRegEx.test(smsPhoneValue)) {
            showMsg('�ֻ��Ÿ�ʽ����ȷ');
            return false;
        }

        smsLogin.send(smsPhoneValue, function () {
            showMsg('��֤���ѷ���,��ע�����');
            updateSmsDelay();
        }, function (err) {
            showMsg(err);
        });
        return false;
    });

    /**
     * �����¼��ť������״̬������ʾ
     * �������֤�룬��¼�ɹ�����ת������ʾ������Ϣ��
     */
    loginBtn.on('click', function () {
        if (!formCheck()) {
            return false;
        }

        smsPhoneValue = realPhone.trim();
        if (!smsPhoneValue || !phoneRegEx.test(smsPhoneValue)) {
            showMsg('�ֻ���Ϊ�ջ��ʽ����ȷ');
            return false;
        }
        smsCodeValue = smsCode.val().trim();
        if (!smsCodeValue || smsCodeValue.length < 4) {
            showMsg('��֤��Ϊ�ջ��ʽ����ȷ');
            return false;
        }

        smsLogin.check(smsPhoneValue, smsCodeValue, function () {
            requestAjax();
        }, function (err) {
            showMsg(err);
        });
        return false;
    });

    /**
     * ��Ϣ����
     * @param text �ı�����
     * @param time ��ʾʱ��
     * @param callback �ص�����
     */
    var msgBox = $('.msg'),
        msgBoxTimer = null;

    function showMsg(pText, pTime, callback) {
        var text = pText || '��Ϣ����',
            time = pTime || 1500;
        msgBox.show().css({
            position: 'absolute',
            top: $(document).scrollTop() + $(document).height() / 4
        }).find('p').html(text);
        clearTimeout(msgBoxTimer);
        msgBoxTimer = setTimeout(function () {
            msgBox.hide();
            callback && callback();
        }, time);
    }
});
