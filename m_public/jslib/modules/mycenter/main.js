define('modules/mycenter/main', ['jquery'], function (require) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;
    var preload = [];
    preload.push('modules/mycenter/maima');

    $('input[type=hidden]').each(function (index, element) {
        vars[$(this).attr('data-id')] = element.value;
    });
    // 插入导航操作js
    preload.push('navflayer/navflayer_new2');
    // 下载App
    require.async('app/1.0.0/appdownload', function ($) {
        $('#down-btn-c').openApp('');
        $('.topMyCenterBtn').openApp({appUrl: 'waptoapp/{"destination":"mysoufun"}'});
    });

    (function (win, vars) {
        var c = win.localStorage;
        try {
            c && c.setItem('testPrivateModel', !1);
        } catch (d) {
            c = null;
        }
        vars.localStorage = c;
        vars.ajax = function (url, method, params, onComplete, onFailure) {
            var onCompleteProxy = function (xhr) {
                onComplete(xhr);
            };
            if (!params.a) {
                var filename = url.split('/').pop();
                params.a = filename.split('.')[0];
            }
            var options = {
                url: url,
                type: method,
                dataType: 'json',
                data: params,
                success: onCompleteProxy,
                error: onFailure
            };
            return $.ajax(options);
        };
    })(window, vars);
    // 判断是否加载提示下载APP
    function getCookie(name) {
        var arr, reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
        arr = document.cookie.match(reg);
        if (arr) {
            return arr[2];
        }
        return null;
    }

    if (vars.action !== '' && vars.action !== 'contractList') {
        preload.push('modules/mycenter/' + vars.action);
        if (!getCookie(vars.cd_ver)) {
            // 不加载提示下载APP
            var noAppArr = ['findFangRelease', 'findFangDetail', 'problemDetail', 'kanFangDayList', 'kanFangHisList', 'kanFangFailList'];
            if ($.inArray(vars.action, noAppArr) === -1) {
                preload.push(vars.public + 'js/20141106.js');
            }
            /*else if (vars.action !== 'sellFangList' && vars.action !== 'getWTDetailByID') {
             $('body').append('<div class="remove_bottom" style="padding-bottom:36px;">&nbsp;</div>');
             }*/
        }
    }

    if (window.location.href.indexOf('from=sms')>-1){
        preload.push(vars.public + 'js/autoopenapp_sfut.js');
    }
    require.async(preload);
    require.async('count/loadforwapandm.min.js');
    require.async('count/loadonlyga.min.js');

    // 新房帮你找房增加楼盘意向
    if (vars.action === 'findFangRelease' && vars.hidType === 'xf') {
        require.async('search/mycenter/findFangSearch', function (Search) {
            var findFangSearch = new Search();
            findFangSearch.init();
        });
    }

    //加载统计功能代码(短信通知委托业主详情页面统计用)
    if (vars.action === 'getWTDetailByID') {
        require.async(location.protocol + '//clickm.fang.com/click/new/clickm.js', function () {
            Clickstat.eventAdd(window, 'load', function () {
                Clickstat.batchEvent('wapmyesf_', '');
            });
        });
    }
});