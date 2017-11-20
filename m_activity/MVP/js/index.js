/**
 * @Author: 坤鹏
 * @Date:   2015/9/28
 * @Description: 四季度管理扩大会议电子签到
 * @Last Modified by:   坤鹏
 * @Last Modified time: 2015/9/28
 */
$(function () {
    'use strict';
    // 加载动画
    function loading() {
        if (document.readyState === 'complete') {
            $('#loading').hide();
            $('#content').show();
        }
    }

    document.onreadystatechange = loading;
    //设置高度
    $('#content').css('height',$(window).height());
    // 提示窗弹层函数
    var messageFloor = $('#tcwar');
    var messageContent = $('#messageContent');
    function showMessage(content,time,fn) {
        time = time || 1500;
        messageFloor.show();
        messageContent.text(content);
        setTimeout(function () {
            messageFloor.hide();
            fn && fn();
        },time);
    }
    // 提交
    var oSubmit = $('#baoming');
    var email = $('#email');
    // var emailEnd = $('#emailEnd').val();
    var emailVal = '';
    var parm = {};
    var reg = $('.reg');
    oSubmit.on('click', function () {
        emailVal = email.val();
        if (!emailVal) {
            showMessage('邮箱地址不能为空~',2000);
        } else if (emailVal.indexOf('@') !== -1) {
            showMessage('请不要输入邮箱后缀~',2000);
        } else {
            // http://m.test.fang.com/public/?c=public&a=ajaxMVPQd&email=chengli&qd_type=201605
            parm.c = 'public';
            parm.a = 'ajaxMVPQd';
            parm.email = emailVal;
            parm.qd_type = '201605';
            $.ajax({
                url: location.origin + '/public/',
                type: 'GET',
                data: parm,
                success: function (data) {
                    var regH = reg.height();
                    switch (parseInt(data)) {
                        case -1:
                            showMessage('请您填写完整信息~',2000);
                            break;
                        case 0:
                            showMessage('签到失败~',2000);
                            break;
                        case 1:
                            //showMessage('您已签到成功，感谢您的支持~',1500,function () {
                            reg.css({
                                color: '#000',
                                'text-indent': '2rem',
                                'text-align': 'left',
                                'letter-spacing': '.1rem',
                                'line-height': '1.5rem'
                            }).html('您已经签到成功啦!  欢迎参加房天下MVP俱乐部聚会活动！');
                            //});
                            break;
                        case 2:
                            //showMessage('您已经签过到啦，感谢您的支持~',1500,function () {
                                reg.css({
                                    color: '#000',
                                    'text-indent': '2rem',
                                    'text-align': 'left',
                                    'letter-spacing': '.1rem',
                                    'line-height': '1.5rem'
                                }).html('您已经签过到啦!  欢迎参加房天下MVP俱乐部聚会活动！');
                            //});
                            break;
                        case 3:
                            showMessage('不在名单里，感谢您的支持~',2000);
                            break;
                    }
                }
            });
        }
    });
});