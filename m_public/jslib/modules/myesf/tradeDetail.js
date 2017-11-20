/**
 * modified by zdl on 2016/4/6.
 * 邮箱地址(zhangdaliang@fang.com)
 */
define('modules/myesf/tradeDetail', ['jquery'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        // 状态数组用来存放交易订单所有步骤的状态
        var status = [];
        var floatAlert = $('.floatAlert');
        var vars = seajs.data.vars;
        // 初始化状态数组
        $('li').each(function () {
            status[$(this).attr('id')] = $(this).attr('data-status');
        });
        for (var index in status) {
            if (status.hasOwnProperty(index)) {
                // 流程对应的步骤li标签的id
                var tmpindex = '#' + index;
                // 如果该步骤的状态为1 表示已经完成
                if (status[index] === '1') {
                    // 已完成的步奏   1已完成 2 正在进行 0未完成
                    // 如果该步骤处于已完成状态给给把li标签下的评价按钮之外的按钮置为灰色
                    $(tmpindex).find('p a').not('.pingjia').addClass('btn-tja');
                    // 如果该步骤处于已完成状态给改li标签添加hbj样式(即右侧的红色进度条)
                    $(tmpindex).addClass('hbj').find('label').removeClass('be7');
                } else if (status[index] === '2') {
                    // 正在进行的步奏
                    // 如果该步骤处于正在进行成状态给给把li标签下的评价按钮之外的按钮置为灰色
                    $(tmpindex).find('p a').not('.pingjia').addClass('btn-tja');
                    //  如果该步骤处于正在进行成状态给改li标签添加hbja样式(即右侧的灰色进度条)
                    $(tmpindex).addClass('hbja').find('label').removeClass('be7');
                }
            }
        }
        var firstflag, secondflag, thirdflag, fourflag, fiveflag, sixflag;
        // 对相应步骤在执行点击操作的时候 执行导航栏和对应的内容的显示和隐藏 step表示的是点击的是第几个步骤
        // stepflag表示的该步骤所处显示隐藏的状态 即导航栏和对应的内容是显示的还是隐藏的
        function stepclick(step, stepflag) {
            // stepflag为1 表示该步骤的导航栏是显示的 内容是隐藏的
            if (stepflag !== '2') {
                $('.hide' + step).hide();
                $('.show' + step).show();
                // 执行上面的两部操作之后需要改变该步骤所处显示隐藏的状态
                stepflag = '2';
            } else {
                // 如果stepflag等于2表示该步骤的导航栏是隐藏的 内容是显示的
                $('.hide' + step).show();
                $('.show' + step).hide();
                stepflag = '1';
            }
            // 返回执行完点击操作之后该步骤所处的显示隐藏的状态
            return stepflag;
        }

        // 步骤一的li标签添加点击事件
        $('#first').on('click', function () {
            // 第一步骤的导航栏和内容的显示隐藏状态 第一次点击时取出该步骤的状态信息 如果状态信息为2表示该步骤处于展开状态
            firstflag = firstflag || status.first;
            // 点击之后实现隐藏显示切换 并保存状态信息 2表示展开 1表示收起
            firstflag = stepclick('first', firstflag);
        });

        $('#second').on('click', function () {
            // 第二步骤的导航栏和内容的显示隐藏状态
            secondflag = secondflag || status.second;
            secondflag = stepclick('second', secondflag);
        });
        $('#third').on('click', function () {
            thirdflag = thirdflag || status.third;
            thirdflag = stepclick('third', thirdflag);
        });
        $('#fourth').on('click', function () {
            fourflag = fourflag || status.fourth;
            fourflag = stepclick('fourth', fourflag);
        });
        $('#fifth').on('click', function () {
            fiveflag = fiveflag || status.fifth;
            fiveflag = stepclick('fifth', fiveflag);
        });
        $('#sixth').on('click', function () {
            sixflag = sixflag || status.sixth;
            sixflag = stepclick('sixth', sixflag);
        });

        // 弹出下载浮层
        $('.btn-tj').on('click', function (e) {
            if ($(this).text() === '提交资料') {
                floatAlert.show();
                $('.cancel').on('click', function (e) {
                    floatAlert.hide();
                    e.stopPropagation();
                });
                floatAlert.on('click', function () {
                    floatAlert.hide();
                });
                e.stopPropagation();
            }
        });

        // 点击提交资料 就会下载app
        require.async('app/1.0.0/appdownload', function ($) {
            $('.downapp').openApp('');
        });

        // +++++++++++++++++++评价按钮是新添加的  点击评价按钮时阻止块折叠
        $('.tel,.zx, .zxa,.pingjia').on('click', function (e) {
            // 点击电话按钮时阻止块折叠
            e.stopPropagation();
        });

        // 在线咨询函数
        function chatWeituo(zhcity, city, housetype, houseid, newcode, type, phone, channel, uname, aname, agentid, order, photourl, housefrom) {
            if (vars.localStorage) {
                window.localStorage.setItem(String(uname), encodeURIComponent(aname) + ';'
                    + photourl + ';' + encodeURIComponent(vars.district + '的'));
            }
            $.ajax({
                url: '/data.d?m=houseinfotj&zhcity=' + zhcity  +  '&city=' + city + '&housetype=' + housetype + '&houseid=' + houseid
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
    };
});
