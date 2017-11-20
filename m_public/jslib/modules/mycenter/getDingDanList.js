define('modules/mycenter/getDingDanList', ['jquery', 'modules/mycenter/yhxw', 'lazyload/1.9.1/lazyload'], function (require) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;
    $ = require('lazyload/1.9.1/lazyload');

    var maima = '';
    // 订单类型^订单号^下单时间^订单状态^楼盘ID或公司id
    $('li').each(function () {
        var orderType = $(this).find('.orderType ').html();
        var orderId = $(this).attr('data-orderid');
        var orderTime = $(this).find('.orderTime').html();
        orderTime = orderTime ? orderTime.substring(5) : '下单时间';
        var orderState = $(this).find('.orderState ').html() || '订单状态';
        var loupanId = $(this).attr('data-loupanid') || '楼盘ID或公司ID';
        maima += encodeURIComponent(orderType + '^' + orderId + '^' + orderTime + '^' + orderState + '^' + loupanId) + ',';
    });

    // 引入用户行为分析对象-埋码
    var yhxw = require('modules/mycenter/yhxw');
    // 判断详情页种类，传入用户行为统计对象
    var pageId = 'mucmyorder';
    // 埋码变量数组
    var maiMaParams = {
        'vmg.page': pageId,
        'vmg.orderinfo': maima.replace(/%5E/g, '^')
    };
    yhxw({type: 0, pageId: pageId, params: maiMaParams});

    $('img[data-original]').lazyload();
    // 获取新房电商房源房号信息
    var $xfds = $('.xfds');
    if ($xfds.length > 0) {
        $xfds.each(function () {
            var $ele = $(this),
                fangid = $ele.attr('data-TailId');
            var params = {
                a: 'ajaxGetFangInfoByFangID',
                newcode: $ele.attr('data-newcode'),
                fangid: fangid,
                cityname: $ele.attr('data-cityname')
            };
            vars.ajax('?c=mycenter', 'get', params, function (data) {
                if (data) {
                    $ele.html(data);
                }
            });
        });
    }
    // 金额格式转换
    $('[name=converse]').each(function () {
        var $ele = $(this);
        var $eleHtml = $ele.html();
        var $eleMoney = $eleHtml.match(/[\d]+\.[\d]+/);
        $ele.html($eleHtml.replace($eleMoney,parseFloat($eleMoney)));
    });
    // 格式化时间
    function formatTimeStr(t, type) {
        if (t > 9) {
            t = '' + t;
        } else {
            t = '0' + t;
        }
        if (type === 1) {
            return t;
        }
        return t;
    }

    // 倒计时
    $('.list-zta.dao').each(function () {
        var $this = $(this);
        var endDate = parseInt($this.attr('date_id'));
        var dateType = $this.attr('date_type');
        var countDown = window.setInterval(function () {
            var leftsecond = --endDate;
            if (leftsecond > 0) {
                var day = 0;
                if (dateType === '1') {
                    day = Math.floor(leftsecond / 3600 / 24);
                }
                var hour = Math.floor((leftsecond - day * 24 * 3600) / 3600);
                var minute = Math.floor((leftsecond - day * 24 * 3600 - hour * 3600) / 60);
                var second = Math.floor(leftsecond - day * 24 * 3600 - hour * 3600 - minute * 60);
                var str = '';
                if (day > 0) {
                    str += day + '天';
                }
                str += formatTimeStr(hour, dateType) + ' : ' + formatTimeStr(minute, 0) + ' : ' + formatTimeStr(second, 0);
                if (dateType === '1') {
                    $this.html('抢购倒计' + str);
                } else {
                    $this.html('房源保留' + str);
                }
            } else {
                window.clearInterval(countDown);
                var secBox = $this.parent().parent();
                if (dateType === '1') {
                    $this.removeClass('dao').addClass('qiang').html('正在抢购中');
                    secBox.find('.btn.gray').removeClass('gray').
                        attr('href', 'http://mai.fang.com/m/HouseDetial/index.html?activceid=' + $this.attr('data_activceid'));
                } else {
                    $this.hide().prev('.orderState').html('已下单').prev('.orderType').html('新房-报名记录');
                    secBox.find('.moneyToPay').html('会员服务费：' + '<em class="red-ed"><i class="f15">' + $this.attr('data_serviceMoney') + '</i>元</em>');
                    secBox.find('.txt').html('<h3>' + $this.attr('data_title') + '</h3><p class="orderTime">下单时间：' + $this.attr('data_time') + '</p>');
                    var html = '<a href="http:' + vars.mainSite + 'house/ec/RedBagDeduction/Index?orderno='
                        + $this.attr('data_orderNo') + '" class="btn">付款</a>';
                    html += '<span class="moneyToPay">会员服务费：<em class="red-ed"><i class="f15">' + $this.attr('data_serviceMoney') + '</i>元</em></span>';
                    secBox.find('.list-opt.js-box1').html(html);
                }
            }
        }, 1000);
    });

    // 家居118订单功能：退款及删除订单
    // 确认提示框
    var confirmAlert = $('.floatAlert');
    // 操作提示框
    var tsBox = $('.ts-box');
    var dingdanId = '';
    $('.deleteOrder').on('click', function () {
        dingdanId = $(this).parents('li').addClass('Delete118').attr('data-orderid');
        confirmAlert.show();
        $('#cancel').addClass('cancelDelete');
        $('#confirm').addClass('confirmDelete');
        alertOption('Delete');
    });

    $('.refundOrder').on('click', function () {
        dingdanId = $(this).parents('li').attr('data-orderid');
        confirmAlert.show().find('.alertContent').html('确定退款？该款项将原路退回至原支付方');
        $('#cancel').addClass('cancelRefund');
        $('#confirm').addClass('confirmRefund');
        alertOption('Refund');
    });
    function showTsBox(msg) {
        tsBox.html(msg).show();
        setTimeout(function () {
            tsBox.hide();
        }, 2000);
    }
    // 二手房交易订单功能
    // 加盟商订单
    $('.ChainCompanyBtn').on('click', function () {
        var $this = $(this);
        showTsBox($this.attr('data-errormsg'));
    });
    // 临时订单弹出提示
    $('.esfjiaoyi').on('click', function () {
        var $this = $(this);
        showTsBox($this.attr('data-errormsg'));
    });
    // 解约
    $('.IsContractChangeBtn').on('click', function () {
        var status = $(this).attr('data-status');
        if (status ===  '1') {
            showTsBox('该订单目前正在解约进行中，无法进行该操作。');
        } else if (status ===  '2') {
            showTsBox('该订单目前正在公正结单及自行过户进行中，无法进行该操作。');
        }
    });

    function alertOption(option) {
        $('.cancel' + option).on('click', function () {
            confirmAlert.hide();
        });
        $('.confirm' + option).on('click', function () {
            confirmAlert.hide();
            if (dingdanId !== '') {
                $.ajax({
                    url: vars.mySite,
                    type: 'get',
                    data: {
                        c: 'mycenter',
                        a: option === 'Delete' ? 'ajaxDeleteJiajuDianpingOrder' : 'ajaxRefundJiajuDianpingOrder',
                        orderid: dingdanId,
                        city: vars.city
                    }
                }).done(function (data) {
                    if (option === 'Delete') {
                        if (data === '1') {
                            showTsBox('删除成功');
                            $('.Delete118').remove();
                        } else {
                            showTsBox('删除失败');
                        }
                    } else if (option === 'Refund') {
                        switch (data) {
                            case '1':
                            case '2':
                                showTsBox('退款正在处理中');
                                window.location.reload();
                                break;
                            case '4':
                                showTsBox('退款成功，已原路退回至原支付方');
                                window.location.reload();
                                break;
                            case '0':
                            case '3':
                                showTsBox('退款失败，请稍后重试');
                                window.location.reload();
                                break;
                            default:
                                showTsBox('接口超时，请稍后重试');
                        }
                    }
                }).fail(function () {
                    showTsBox('接口超时，请稍后重试');
                });
            } else {
                showTsBox('未获取到订单id，请刷新重试');
            }
        });
    }
});