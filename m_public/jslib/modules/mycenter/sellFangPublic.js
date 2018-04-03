define('modules/mycenter/sellFangPublic', ['jquery', 'iscroll/2.0.0/iscroll-lite'], function (require) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;
    // 获取滑动插件类
    var IScrollLite = require('iscroll/2.0.0/iscroll-lite');
    // 获取房源详情的地址
    var wtDetailUrl = vars.mySite + '?c=mycenter&a=getWTDetailByID&city=';
    //管理房源详情页地址
    var glwtDetailUrl = vars.mySite + '?c=myesf&a=houseDetail&city=';
    // 链接跳转
    $('div[name=uploadDiv]').on('click', function () {
        if ($(this).attr('data-href') !== '') {
            window.location.href = $(this).attr('data-href');
        }
    });

    // ajax调出housetype
    $('.helpseller[data-hid]').each(function () {
        var $that = $(this);
        var hid = $that.attr('data-hid');
        var iid = $that.attr('data-iid');
        var projcode = $that.attr('data-pid');
        var encity = $that.attr('data-city');
        var fUrl = '';
        var dUrl = '';
        $.get(wtDetailUrl + encity + '&indexId=' + iid + '&houseid=' + hid + '&isJson=1&isdel=1', function (data) {
            if (data && data.ReviewStatus === '1' && data.HouseStatus === '1' && (data.HouseType === '1' || data.HouseType === 'A' || data.HouseType === '4' || data.HouseType === 'D') && data.ReviewStatus === '1') {
                if (data.HouseType === 'A' || data.HouseType === '1') {
                    var url = vars.mySite + '?c=myesf&a=myDaiKanRecord&city=' + encity + '&projcode=' + projcode + '&houseid=' + hid;
                    $('#hid_' + hid).attr('href', url).show();
                }
                $that.find('.s1').addClass('hsbg').html('在售');
                $that.find('.s2').show();
                if (data.HouseType === 'A' || data.HouseType === '1') {
                    dUrl = vars.esfSite + encity + '/DS_' + hid + '.html';
                } else if (data.HouseType === 'D' || data.HouseType === '4') {
                    dUrl = vars.esfSite + encity + '/YDS_' + hid + '.html';
                }
                $that.find('.sellingKan').attr('href', dUrl);
                $that.find('.sellingKan').show();
                $that.find('.stopsell').show();
                $that.find('.h5share').show();

            } else if (data && data.ReviewStatus === '1' && (data.HouseStatus === '4' || data.HouseStatus === '3')) {
                $that.find('.s1').addClass('hsbga').html('已售');
            } else if (data && data.ReviewStatus === '1' && data.HouseStatus === '2') {
                $that.find('.s1').addClass('hsbga').html('暂停出售');
            } else if (data && (data.DispatchServiceStatus && data.DispatchServiceStatus !== '' && data.DispatchServiceStatus !== '0') || (data.ReviewStatus === '1' && data.HouseStatus === '1' && !data.HouseType && (data.DispatchServiceStatus === '0' || data.DispatchServiceStatus === ''))) {
                $that.find('.s1').addClass('hsbg').html('派单中');
                fUrl = glwtDetailUrl + encity;
                if (iid !== '' && iid !== '0') {
                    fUrl = fUrl + '&indexId=' + iid;
                }
                if (hid !== '' && hid !== '0') {
                    fUrl = fUrl + '&houseid=' + hid;
                }  
                $that.find('.txt').attr('data-href', fUrl);
                // 是否显示委托按钮
                // if (data.IsUnDelegateSaleHouse === '1') {
                //     $that.find('.delegate').show();
                // }
                $that.find('.stopsell').show();
            } else if (data && (data.ReviewStatus !== '1' || (data.ReviewStatus === '1' && data.HouseStatus !== '2' && data.HouseStatus !== '4' && data.HouseStatus !== '3'))) {
                $that.find('.s1').addClass('hsbg').html('未展示');
                fUrl = glwtDetailUrl + encity;
                if (iid !== '' && iid !== '0') {
                    fUrl = fUrl + '&indexId=' + iid;
                }
                if (hid !== '' && hid !== '0') {
                    fUrl = fUrl + '&houseid=' + hid;
                }
                $that.find('.txt').attr('data-href', fUrl);
                $that.find('.delegate').show();
            }
        });
    });
    // 点击分享按钮
    var tzBox = $('.tz-box');
    var btn1 = $('#btn1');
    var btn2 = $('#btn2');
    $('.h5share').on('click', function () {
        var el = $(this);
        var isHasImg = el.parent('.hsother').siblings('.arr-r').find('img');
        if (isHasImg.attr('data-original')) {
            window.location.href = el.attr('h5url');
        } else {
            tzBox.show();
            btn1.attr('url', el.attr('h5url'));
            btn2.attr('url', el.attr('editurl'));
        }
    });
    $('#btn1,#btn2').on('click', function () {
        tzBox.hide();
        window.location.href = $(this).attr('url');
    });
    // 委托变为在售
    $('.reDelegate').on('click', function () {
        var $that = $(this);
        var hid = $that.parents('.helpseller').attr('data-hid');
        var encity = $that.parents('.helpseller').attr('data-city');
        var url = vars.mySite + '?c=myesf&a=cancleOrResaleDS&city=' + encity + '&houseid=' + hid
            + '&targetStatus=1' + '&r=' + Math.random();
        $.get(url, function (data) {
            if (data && data.result === '1') {
                window.location.reload();
            } else {
                alert('更改状态失败，请稍后再试');
            }
        });
    });

    // 禁用屏幕滑动
    var allowMove = true;
    $(window).on('touchmove mousemove',function (ev) {
        if (!allowMove) {
            ev.preventDefault();
        }
    });
});
