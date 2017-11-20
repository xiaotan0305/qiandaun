define('modules/mycenter/sellFangPublic', ['jquery', 'iscroll/2.0.0/iscroll-lite'], function (require) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;
    // 获取滑动插件类
    var IScrollLite = require('iscroll/2.0.0/iscroll-lite');
    // 获取房源详情的地址
    var wtDetailUrl = vars.mySite + '?c=mycenter&a=getWTDetailByID&city=';

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
            if (data && (data.HouseStatus === '2' || data.HouseStatus === '4' || data.HouseStatus === '1') && data.HouseType && data.ReviewStatus === '1') {
                if (data.HouseType === 'A') {
                    var url = vars.mySite + '?c=myesf&a=myDaiKanRecord&city=' + encity + '&projcode=' + projcode + '&houseid=' + hid;
                    $('#hid_' + hid).attr('href', url).show();
                }
                if ($that.find('.hstit').hasClass('selling')) {
                    $that.find('.s1').addClass('hsbg').html('在售');
                    $that.find('.s2').show();
                    if (data.HouseType === 'A') {
                        dUrl = vars.esfSite + encity + '/DS_' + hid + '.html';
                    } else if (data.HouseType === 'D') {
                        dUrl = vars.esfSite + encity + '/YDS_' + hid + '.html';
                    }
                    $that.find('.sellingKan').attr('href', dUrl);
                    $that.find('.sellingKan').show();
                    $that.find('.stopsell').show();
                    if ($that.attr('data-ift') === '0') {
                        fUrl = wtDetailUrl + encity + '&indexId=' + iid
                            + '&houseid=' + hid + '&isFirst=1';
                        $that.find('.txt').attr('data-href', fUrl);
                    }
                }
            } else if (data && data.ReviewStatus === '1' && data.HouseStatus === '1' && !data.HouseType) {
                $that.find('.s1').addClass('hsbg').html('审核通过，等待展示');
                fUrl = wtDetailUrl + encity + '&indexId=' + iid
                    + '&houseid=' + hid;
                $that.find('.txt').attr('data-href', fUrl);
                // 是否显示委托按钮
                if (data.IsUnDelegateSaleHouse === '1') {
                    $that.find('.delegate').show();
                }
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
    // 封装委托协议弹窗滑动效果
    var weituoIScroll = null;
    function weituoIScrollInit() {
        allowMove = false;
        if (weituoIScroll) {
            weituoIScroll.refresh();
        } else {
            // 初始化滑动插件
            weituoIScroll = new IScrollLite('.nrbox', {
                // 禁止横向滑动
                scrollX: false,
                // 开启纵向滑动
                scrollY: true,
                // 滑动为其本身，这里的作用是防止禁用掉整个文档流的默认事件导致的bug
                bindToWrapper: true,
                // 可以纵向滑动，默认能够穿过
                eventPassthrough: false
            });
        }
    }

    // 委托协议弹窗
    var weituoInfo = $('#weituoInfo');
    // 显示 上架审核通过待展示房源提示框
    $('.delegate').on('click', function () {
        weituoInfo.show();
        weituoIScrollInit();
        $(this).addClass('weituo');
    });
    // 隐藏 上架审核通过待展示房源提示框
    $('.closeDelegate').on('click', function () {
        weituoInfo.hide();
        allowMove = true;
        $('.weituo').removeClass('weituo');
    });
    // 上架审核通过待展示房源
    $('.agreeDelegate').on('click', function () {
        var weituoBtn = $('.weituo');
        var weituoBtnPare = weituoBtn.parents('.helpseller');
        var hid = weituoBtnPare.attr('data-hid');
        var iid = weituoBtnPare.attr('data-iid');
        var encity = weituoBtnPare.attr('data-city');
        var url = vars.mySite + '?c=myesf&a=ajaxUpdateEHouseToDelegate&city=' + encity + '&houseid=' + hid + '&r=' + Math.random();
        $.get(url, function (data) {
            if (data) {
                weituoInfo.hide();
                allowMove = true;
                weituoBtn.hide().removeClass('weituo');
                alert('您的房源将尽快在房天下展示。');
                // 获取上架后的房源状态，如已更新，房源状态显示在售
                $.get(wtDetailUrl + encity + '&indexId=' + iid + '&houseid=' + hid + '&isJson=1&isdel=1', function (data) {
                    if (data && data.HouseType) {
                        var fUrl = '';
                        var dUrl = '';
                        weituoBtnPare.find('.s1').html('在售');
                        weituoBtnPare.find('.s2').show();
                        if (data.HouseType === 'A') {
                            dUrl = vars.esfSite + encity + '/DS_' + hid + '.html';
                        } else if (data.HouseType === 'D') {
                            dUrl = vars.esfSite + encity + '/YDS_' + hid + '.html';
                        }
                        weituoBtnPare.find('.sellingKan').attr('href', dUrl);
                        weituoBtnPare.find('.sellingKan').show();
                        if (weituoBtnPare.attr('data-ift') === '0') {
                            fUrl = wtDetailUrl + encity + '&indexId=' + iid + '&houseid=' + hid + '&isFirst=1';
                            weituoBtnPare.find('.txt').attr('data-href', fUrl);
                        }
                    }
                });
            } else {
                alert('很抱歉，房源委托失败，请重试。');
                weituoInfo.show();
                weituoIScrollInit();
            }
        });
    });
});
