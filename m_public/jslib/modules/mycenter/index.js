define('modules/mycenter/index', ['jquery', 'modules/mycenter/yhxw', 'modules/mycenter/common', 'modules/mycenter/user', 'lazyload/1.9.1/lazyload', 'superShare/2.0.0/superShare', 'weixin/2.0.0/weixinshare', 'iscroll/2.0.0/iscroll-lite'], function (require) {
    'use strict';
    var $ = require('jquery');
    var common = require('modules/mycenter/common');
    var user = require('modules/mycenter/user');
    var vars = seajs.data.vars, url = vars.mySite + '?c=mycenter',
        $order = $('#order');
    var IScroll = require('iscroll/2.0.0/iscroll-lite');
    // 工具栏按钮自适应
    var pageWidth = $('.main').width(),
        margin = 30,
        count = 4,
        toolButton = $('.my-menu2 li');
    // 页面能完整显示的个数
    count = Math.floor(pageWidth / toolButton.eq(0).outerWidth(true));
    // 调整右边距 多显示半个（让用户知道可以滑动）
    margin = (pageWidth - 16 - toolButton.eq(0).width() * (count + 0.5)) / count + 'px';
    toolButton.css('margin-right', margin);
    // 自适应宽度
    $('.my-menu2 ul').css('width', toolButton.eq(0).outerWidth(true) * toolButton.length + 17);

    new IScroll('.iscroller', {
        scrollX: true,
        scrollY: false,
        bindToWrapper: true,
        eventPassthrough: true
    });
    // 引入用户行为分析对象-埋码
    var yhxw = require('modules/mycenter/yhxw');
    // 判断详情页种类，传入用户行为统计对象
    var pageId = 'muchomepage';
    // 埋码变量数组
    var maiMaParams = {
        'vmg.page': pageId,
        'vmg.username': encodeURIComponent(vars.username),
        'vmg.phone': vars.phone
    };
    yhxw({type: 0, pageId: pageId, params: maiMaParams});

    require('lazyload/1.9.1/lazyload');
    // 图片惰性加载
    $('.lazyload').lazyload();
    var executiveIndexJs = function () {
        // 获取未读消息
        common.getMessage();
        // 获取我的订单
        var params = {
                a: 'ajaxGetDingDan',
                yewutype: vars.ordertype,
                city: vars.city
            },
            onComplete = null;
        switch (vars.ordertype) {
            case '101':
            case '103':
            case '109':
            case '111':
            case '117':
            case '113':
            case '102':
            case '110':
            case '104':
            case '105':
            case '106':
            case '107':
            case '108':
            case '118':
            case '123':
                // 102=新房媒体，110=新房媒体(新增110订单类型)，104=二手房交易,105=租房付房租,106=租房付佣金,107=家居-电商，108=家居-合作联盟，118=家居建材点评券
                onComplete = function (data) {
                    $order.after(data);
                    // 图片惰性加载
                    $('.lazyload').lazyload();
                    //  获取新房电商101,103,109,111房源房号信息
                    var fangHao = $('#fanghao');
                    if (fangHao.length > 0) {
                        var xfDsParams = {
                            a: 'ajaxGetFangInfoByFangID',
                            newcode: fangHao.attr('data-newcode'),
                            fangid: fangHao.attr('data-fangid'),
                            cityname: fangHao.attr('data-cityname')
                        };
                        vars.ajax('?c=mycenter', 'get', xfDsParams, function (data) {
                            if (data) {
                                fangHao.html(data);
                            }
                        });
                    }
                    //104 二手房订单
                    // 操作提示框
                    var tsBox = $('.ts-box');
                    function showTsBox(msg) {
                        tsBox.html(msg).show();
                        setTimeout(function () {
                            tsBox.hide();
                        }, 2000);
                    }
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
                    // 二手房订单解约提示
                    $('.IsContractChangeBtn').on('click', function () {
                        var status = $(this).attr('data-status');
                        if (status === '1') {
                            showTsBox('该订单目前正在解约进行中，无法进行该操作。');
                        } else if (status === '2') {
                            showTsBox('该订单目前正在公正结单及自行过户进行中，无法进行该操作。');
                        }
                    });
                    // 金额格式转换
                    $('[name=converse]').each(function () {
                        var $ele = $(this);
                        var $eleHtml = $ele.html();
                        var $eleMoney = $eleHtml.match(/[\d]+\.[\d]+/);
                        $ele.html($eleHtml.replace($eleMoney, parseFloat($eleMoney)));
                    });
                    // 调整订单名称宽度
                    var nameAndState = $('.nameAndState');
                    var name = nameAndState.find('em');
                    var state = nameAndState.find('span');
                    if (nameAndState.length && (name.width() + state.width() > nameAndState.width())) {
                        name.css({ 'display': 'block', 'width': nameAndState.width() - state.width(), 'text-overflow': 'ellipsis', 'overflow': 'hidden' });
                    }
                };
                break;
            case '201':
            case '202':
            case '203':
            case '204':
            case '206':
                // 201=新房看房团，202=二手房看房清单，203=租房看房清单，204=装修预约工地，206=新房看房清单
                // 重新定义ajax调用方法,看房清单
                params.a = 'ajaxKfdListInfo';
                onComplete = function (data) {
                    // 模板页添加
                    $order.after(data);
                    // 图片惰性加载
                    $('.lazyload').lazyload();
                    // 二手房-取消预约
                    $('.esfCancel').on('click', function () {
                        var $that = $(this);
                        var orderid = $that.attr('data-orderid');
                        // 订单城市简拼
                        var orderCity = $that.attr('data-ordercity');
                        if (window.confirm('是否取消看房 ?')) {
                            var params = {
                                a: 'yyCancleOrder',
                                city: orderCity,
                                orderID: orderid,
                                r: Math.random()
                            };
                            var ajaxUrl = 'index.php?c=myesf',
                                onCompleteEsf = function (data) {
                                    if (data === '1') {
                                        window.location.reload();
                                    } else {
                                        // 失败
                                        alert('取消预约失败，请稍后再试');
                                    }
                                };
                            vars.ajax(ajaxUrl, 'get', params, onCompleteEsf);
                        }
                    });
                    // 新房取消预约
                    $('.editXfYy').on('click', function () {
                        var $that = $(this);
                        var kfId = $that.attr('data-kfId');
                        if (window.confirm('是否取消看房 ?')) {
                            var params = {
                                a: 'ajaxEditXfKfDay',
                                city: vars.city,
                                kfId: kfId,
                                r: Math.random()
                            };
                            var ajaxUrl = 'index.php?c=mycenter',
                                onCompleteXf = function (data) {
                                    if (data) {
                                        window.location.reload();
                                    } else {
                                        // 失败
                                        alert('取消预约失败，请稍后再试');
                                    }
                                };
                            vars.ajax(ajaxUrl, 'get', params, onCompleteXf);
                        }
                    });
                };
                break;
            case '401':
            // 我要卖房
                onComplete = function (data) {
                    $order.after(data);
                    // 图片惰性加载
                    $('.lazyload').lazyload();
                    require.async('modules/mycenter/sellFangPublic');
                };
                break;
            case '402':
            case '404':
                // 402=住宅我要出租，404=写字楼我要出租
                onComplete = function (data) {
                    // 模板页添加
                    $order.after(data);
                    // 图片惰性加载
                    $('.lazyload').lazyload();
                    // 引用我要出租公共js
                    require.async('modules/myzf/zfListPublic');
                };
                break;
        }
        if (onComplete !== null) {
            vars.ajax(url, 'get', params, onComplete);
        }
        // 打电话,2017-1-4绑定位置修改到body上
        $('.bg-f0').on('click', '.tel', function () {
            common.teltj.apply(this, $(this).attr('data-teltj').split(','));
            user.yhxw(31);
        });
        // 留言
        $order.on('click', '.mes', function () {
            common.chat.apply(this, $(this).attr('data-chat').split(','));
            user.yhxw(24);
        });
    };
    // 每日推荐
    user.cainixihuan();
    // 加入房拍圈的跳转地址
    var fpqJoinUrl = location.protocol + vars.mainSite + 'fangpaiquan/register.html?burl=' + location.href;
    // 我的房拍圈
    $('.fangpai').on('click', function () {
        if (vars.userid === '') {
            // 没登录跳登录页面
            location.href = location.protocol + '//m.fang.com/passport/login.aspx?burl=' + location.href;
        } else {
            // 有用户id已登录
            $.ajax({
                url: location.protocol + vars.mySite + '?c=mycenter&a=ajaxGetFpqUserStatus',
                success: function (data) {
                    // 0：待审核 1：审核通过 2：拒绝通过
                    if (data.status === '1') {
                        // 我的房拍圈列表页
                        location.href = location.protocol + vars.mySite + '?c=mycenter&a=roomBeatCircle&city=' + vars.city;
                    } else if (data.status === '0' || data.status === '2') {
                        // 申请加入页面
                        location.href = fpqJoinUrl;
                    } else {
                        $('.fpqJoinBox').show();
                    }
                }
            });
        }
    });
    // 关闭加入我的房拍圈弹框
    $('.closeFpqBoxBtn').on('click', function () {
        $('.fpqJoinBox').hide();
    });
    // 我的房拍圈加入确定
    $('.fpqOkBtn').on('click', function () {
        // 申请加入页面
        location.href = fpqJoinUrl;
    });

    // 我的贷款/我要贷款
    $('.loan').on('click', 'a', function () {
        var $loanUrl;
        var $that = $(this);
        if ($that.find('h4').html() === '我要贷款') {
            // 我要贷款地址
            $loanUrl = location.protocol + '//mjrpt.fang.com/daihou/Finace_Wap/FangM_Loan/M_Loan?city=' + vars.utf8zhcity;
        } else {
            // 我的贷款地址
            $loanUrl = location.protocol + '//mjrpt.fang.com/daihou/Finace_Wap/FangM_Loan/M_Loanlook';
        }
        if (vars.userid === '') {
            // 没登录跳登录页面
            location.href = location.protocol + '//m.fang.com/passport/login.aspx?burl=' + $loanUrl;
        } else {
            location.href= $loanUrl;
        }
    });
    // 判断是否登录
    if ($('.login').length > 0) {
        return;
    }

    executiveIndexJs();
});
