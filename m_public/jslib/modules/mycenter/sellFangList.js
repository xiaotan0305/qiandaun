define('modules/mycenter/sellFangList', ['jquery', 'modules/mycenter/yhxw', 'lazyload/1.9.1/lazyload', 'modules/mycenter/sellFangPublic'], function (require) {
    'use strict';
    var $ = require('jquery');
    $ = require('lazyload/1.9.1/lazyload');
    // 图片懒加载
    $('img[data-original]').lazyload();
    // 引入个人中心和列表页公共js
    require('modules/mycenter/sellFangPublic');
    var vars = seajs.data.vars;
    // 获取埋码数据
    var maimai = '';
    $('.helpseller[data-hid]').each(function () {
        var $that = $(this);
        maimai += $that.attr('data-maima') + ',' || '';
    });
    // 引入用户行为分析对象-埋码
    var yhxw = require('modules/mycenter/yhxw');
    // 判断详情页种类，传入用户行为统计对象
    var pageId = 'esf_fy^fblb_wap';
    // 埋码变量数组
    var maiMaParams = {
        'vmg.page': pageId,
        'vmg.orderinfo': maimai.replace(/%5E/g,'^')
    };
    yhxw({type: 0, pageId: pageId, params: maiMaParams});
    
    // 打电话
    $('.hsother').on('click', 'a[data-teltj]', function () {
        var teldata = $(this).attr('data-teltj').split(',');
        $.ajax({
            url: '/data.d?m=houseinfotj&city=' + teldata[0] + '&housetype=' + teldata[1] + '&houseid=' + teldata[2] + '&newcode='
            + teldata[3] + '&type=' + teldata[4] + '&phone=' + teldata[5] + '&channel=' + teldata[6] + '&agentid=' + teldata[7],
            async: true
        });
        if (typeof yhxw !== 'undefined' && yhxw && typeof _ub !== 'undefined' && _ub && typeof _ub.collect !== 'undefined'
            && _ub.collect) {
            yhxw(31);
        }
    });
    //短信弹窗关闭
    $('.egis-close').on('click', function () {
        $('#floatAlert').hide();
    });
    //短信弹框点击空白区域弹窗消失
    $('#floatAlert:not(".f-egis")').on('click',function () {
        $(this).hide();
    });
    //经纪人弹框点击
    $('#qx').on('click', function(){
        $('#ssfloat').hide();
    });
    //点击停售按钮
    $('.stopsell').on('click', function(){
        var $that = $(this);
        var hid = $that.parents('.helpseller').attr('data-hid');
        var encity = $that.parents('.helpseller').attr('data-city');
        var url = vars.mySite + 'index.php?c=myesf&a=cancleOrResaleDS&city=' + encity + '&houseid=' + hid + '&targetStatus=' + 2 + '&r=' + Math.random();
        $.get(url, function (data) {
            if (data && data.result === '1') {
                window.location.reload();
            } else {
                alert('更改状态失败，请稍后再试');
            }
        });
    });

    $('.icon-mymf').on('click', function(){
        //点击发布判断用户身份
        $.ajax({
            url: vars.mySite + '?c=mycenter&a=checkJjr&source=ajax',
            success: function(data) {
                if (data === '2') {
                    $('#ssfloat').show();
                } else if (data === '3') {
                    $('.onlyFlayer').show();
                    setTimeout(function () {
                        $('.onlyFlayer').hide();
                    }, 3000);
                } else {
                    window.location = vars.mySite + '?c=myesf&a=delegateAndResale&city=' + vars.city;
                }
            }
        });
    });
});