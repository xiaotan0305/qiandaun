/**
 * @file 帮你找房列表页
 * @author fcwang(wangfengchao@soufun.com)
 */
define('modules/mycenter/myBuyList', ['jquery', 'modules/mycenter/yhxw'], function (require) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;

    // 引入用户行为分析对象-埋码
    var yhxw = require('modules/mycenter/yhxw');
    // 判断详情页种类，传入用户行为统计对象
    var pageId = 'muchelpbuy';
    // 埋码变量数组
    var maiMaParams = {
        // 页面标识
        'vmg.page': pageId,
        // 我的找房信息
        'vmg.findfanginfo': ''
    };

    //埋码-我的找房信息，遍历li标签的data属性
    $('li[data-type]').each(function (index, element) {
        //第一个循环不加逗号
        if (index === 0) {
            maiMaParams['vmg.findfanginfo'] = encodeURIComponent($(this).attr('data-type')) + '^' + encodeURIComponent($(this).attr('data-district')) + '^' + encodeURIComponent($(this).attr('data-comarea')) + '^' + encodeURIComponent($(this).attr('data-price')) + '^' + encodeURIComponent($(this).attr('data-room'));
        } else {
            maiMaParams['vmg.findfanginfo'] += ',' + encodeURIComponent($(this).attr('data-type')) + '^' + encodeURIComponent($(this).attr('data-district')) + '^' + encodeURIComponent($(this).attr('data-comarea')) + '^' + encodeURIComponent($(this).attr('data-price')) + '^' + encodeURIComponent($(this).attr('data-room'));
        }
    });
    // 添加用户行为分析
    yhxw({type: 0, pageId: pageId, params: maiMaParams});

    $(function () {
        // 点击小尖
        $('.main').on('click', '.arrow', function () {
            var myLi = $(this).parent().parent().parent();
            if (myLi.hasClass('open')) {
                myLi.removeClass('open');
            } else {
                myLi.addClass('open');
            }
        });

        // 删除功能
        var me;
        var type;
        var id;
        $('.main').on('click', '.del', function () {
            me = $(this);
            type = me.attr('data_type');
            id = me.attr('data_id');
            $('.floatAlert').show();
            //删除-埋码
            var liInfo = $(this).parents('li[data-type]').eq(0);
            maiMaParams['vmg.findfanginfo'] = encodeURIComponent(liInfo.attr('data-type')) + '^' + encodeURIComponent(liInfo.attr('data-district')) + '^' + encodeURIComponent(liInfo.attr('data-comarea')) + '^' + encodeURIComponent(liInfo.attr('data-price')) + '^' + encodeURIComponent(liInfo.attr('data-room'));
        });
        // 删除确认弹框 确定
        $('#ensure').on('click', function () {
            $.get(vars.mySite + '?c=mycenter&a=wantedDel&type=' + type + '&id=' + id, function (data) {
                // 成功
                if (data.result == 1) {
                    me.parent().parent().remove();
                    alert('删除成功！');
                    // 删除的埋码-添加用户行为分析
                    yhxw({type: 79, pageId: pageId, params: maiMaParams});
                    // 未登录
                } else if (data.result == 2) {
                    window.location.href = 'https://m.fang.com/passport/login.aspx?burl=';
                    // 失败
                } else {
                    alert('删除失败！');
                }
                if (!$('.my-blist ul').html()) {
                    $('#nodata').show();
                    $('body').addClass('my-ajust');
                }
            });
            $('.floatAlert').hide();
        });
        // 删除确认弹框 取消
        $('#cancel').on('click', function () {
            $('.floatAlert').hide();
        });
    });
});
