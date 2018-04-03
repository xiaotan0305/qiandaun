/**
 * 个人中心我要出租公用js
 * limengyang.bj@fang.com 2017-1-16从zfList.js提出来
 */
define('modules/myzf/zfListPublic', ['jquery', 'superShare/2.0.0/superShare', 'weixin/2.0.0/weixinshare', 'jwingupload/1.0.6/jwingupload.source'], function (require) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;
    var selfUrl = window.location.href;

    //********房源分享插件********
    var shareA = $('.share');
    //****微信分享，调用微信分享的插件****
    var Weixin = require('weixin/2.0.0/weixinshare');
    var wx = new Weixin({
        debug: false,
        shareTitle: shareA.attr('h5newsline'),
        // 副标题
        descContent: shareA.attr('description'),
        lineLink: shareA.attr('jumph5path'),
        imgUrl: shareA.attr('imgurl'),
        swapTitle: false
    });
    //****普通分享****
    var SuperShare = require('superShare/2.0.0/superShare');
    var config = {
        // 分享的内容title
        title: shareA.attr('h5newsline'),
        // 副标题
        desc: shareA.attr('description'),
        // 分享时的图标
        image: shareA.attr('imgurl'),
        // 分享的链接地址
        url: shareA.attr('jumph5path'),
        // 分享的内容来源
        from: ' —房天下',
    };
    var superShare = new SuperShare(config);
    //****更新配置函数****
    $(document).on('click', '.share', function () {
        var title = $(this).attr('newsline');
        var h5title = $(this).attr('h5newsline');
        var jumpurl = $(this).attr('jumpath');
        var jumph5url = $(this).attr('jumph5path');
        var imgUrl = $(this).attr('imgurl');
        var desc = $(this).attr('description');
        config = {
            // 分享的内容title
            title: h5title,
            // 副标题
            desc: desc,
            // 分享时的图标
            image: imgUrl,
            // 分享的链接地址
            url: jumph5url,
            // 分享的内容来源
            from: ' —房天下',
        };
        superShare.updateConfig(config);
        superShare.share();
        var wxupconfig = {
            debug: false,
            shareTitle: h5title,
            // 副标题
            descContent: desc,
            lineLink: jumph5url,
            imgUrl: imgUrl,
            swapTitle: false
        }
        wx.updateOps(wxupconfig);
    });



    //********房源基本操作********
    //****弹出3秒浮层****
    var $sendFloatId = $('.sendFloat'), $sendTextId = $('.sendText');
    function displayLose(num, keywords, url) {
        var errorTimer = setInterval(function () {
            num -= 1;
            $sendFloatId.show();
            $sendTextId.show().html(keywords);
            if (num <= 0) {
                clearInterval(errorTimer);
                $sendFloatId.hide();
                $sendTextId.html('');
                if (url) {
                    window.location.href = url;
                }
            }
        }, 1000);
    }


    //****点击省略号****
    var editFloat = $('#editFloat');
    $('.btn-ellipsis').on('click', function () {
        editFloat.show();
        // 房源id
        var houseId = $(this).parent().attr('houseid');
        var encity = $(this).parent().attr('data-city');
        // 编辑房源的跳转地址
        var editpath = $(this).parent().attr('editpath');
        $('.edit').attr('href', editpath);
        // 获取父级的属性值
        $('.status').parent().attr('houseid', houseId);
        $('.status').parent().attr('data-city', encity);
        // 成交按钮
        if ($(this).parent().attr('dealpath')) {
            $('.deal').show();
            $('.deal').attr('href', $(this).parent().attr('dealpath'));
        } else {
            $('.deal').hide();
            $('.deal').attr('href', 'javascript:void(0);');
        }
    });
    //**点击取消或者下架，收起弹框**
    $('#cancel,.status').on('click', function () {
        editFloat.hide();
    });


    //****在线房源上传图片****
    var $inputFile = $('input[type=file]');
    $inputFile.on('change', function () {
        $sendFloatId.show();
        $sendTextId.show().html('上传中....');
    });
    //**点击图片上传**
    $inputFile.on('click', function () {
        var houseid = $(this).attr('houseid');
        var encity = $(this).attr('data-city');
        // 房源编辑图片地址
        var Url = '?c=myzf&a=ajaxEditHouseImg&city=' + encity;
        if ($inputFile.length > 0) {
            require.async('modules/myzf/upload', function (upload) {
                upload.init({
                    // 图片服务器地址
                    url: '?c=myesf&a=ajaxUploadImg&city=' + encity,
                    // 只能上传1张
                    maxlength: 1,
                    // 回调函数
                    callBack: function (file, data) {
                        data = eval('(' + data + ')');
                        var imgurl = data.result.url;
                        var information = { imgurl: imgurl, houseid: houseid };
                        $.ajax({
                            url: Url,
                            data: information,
                            dataType: 'json',
                            type: 'GET',
                            success: function (data) {
                                if (parseInt(data.errCode)) {
                                    $('input[houseid=' + houseid + ']').replaceWith('<img class="mfupload" src=' + imgurl + '/>');
                                    displayLose(2, '上传成功', selfUrl);
                                } else {
                                    displayLose(2, '图片上传失败,请稍候再试');
                                }
                            }
                        });
                    }
                });
            });
        }
    });


    //****房源刷新****
    function refresh(houseid, encity) {
        var param = { c: 'myzf', a: 'ajaxRefreshRent', city: encity, houseid: houseid };
        $.get(vars.mySite, param, function (data) {
            var result = data.state;
            if (result === '1' || result === '100') {
                displayLose(2, '刷新成功', selfUrl);
            } else {
                displayLose(2, '刷新失败', selfUrl);
            }
        });
    }
    //**点击刷新按钮**
    $('.refresh').on('click', function () {
        var houseid = $(this).parent().attr('houseid');
        var encity = $(this).parent().attr('data-city');
        refresh(houseid, encity);
    });


    //****房源（删除）上下架****
    var status, houseid, encity, isProm, param;
    $('.status').on('click', function () {
        houseid = $(this).parent().attr('houseid');
        encity = $(this).parent().attr('data-city');
        isProm = $(this).attr('isProm');
        status = $(this).attr('status') === 'offShelves' ? 'down' : 'up';
        param = { c: 'myzf', a: 'ajaxChangeRentStatus', city: encity, houseid: houseid, status: status };
        if (status === 'up') {
            $.get(vars.mySite, param, function (data) {
                if (data.result === '100') {
                    displayLose(3, decodeURI(data.message), selfUrl);
                } else if (data.result === '106') {
                    window.location.href = vars.mySite + '?c=myzf&a=houseIdentify&type=up&city=' + encity + '&houseid=' + houseid;
                } else {
                    displayLose(3, decodeURI(data.message));
                }
            });
        } else {
            $('#offFloat').show();
        }
    });
    //**点击下架弹框的取消**
    $('#cancelOff').on('click', function () {
        $('#offFloat').hide();
    });
    //**点击下架弹框的确认**
    $('#cancelOn').on('click', function () {
        $('#offFloat').hide();
        param.status = 'down';
        $.get(vars.mySite, param, function (data) {
            if (data.result === '100') {
                if (isProm === '该房源已置顶') {
                    param.a = 'ajaxCancelSetTop';
                    $.get(vars.mySite, param);
                }
                displayLose(3, decodeURI(data.message), selfUrl);
            } else {
                displayLose(3, decodeURI(data.message), selfUrl);
            }
        });
    });


    //****房源取消置顶****
    var $cancelSetTop = $('.cancelSetTop'), $cancelFloat = $('#cancelFloat'), $unableFloat =$('#unableFloat'),
        // 取消置顶房源的id   取消置顶房源的城市
        cancelHouseid,  cancelCity;
    $cancelSetTop.on('click', function () {
        var settopbtime = $(this).parent().attr('btime');
        var settopdays = $(this).parent().attr('settopdays');
        var timestamp = Date.parse(new Date());
        cancelHouseid = $(this).parent().attr('houseid');
        cancelCity = $(this).parent().attr('data-city');
        if (settopdays === '1.5') {
            $(this).addClass('unablecancel');
            $unableFloat.show();
        } else {
            $cancelFloat.show();
        }
    });
    //**点击置顶弹框的取消**
    $('#cancelXq').on('click', function () {
        $cancelFloat.hide();
    });
    //**点击置顶弹框的确认**
    $('#sure').on('click', function () {
        $cancelFloat.hide();
        $.ajax({
            url: vars.mySite + '?c=myzf&a=ajaxCancelSetTop&houseid=' + cancelHouseid + '&city=' + cancelCity,
            type: 'GET',
            success: function (data) {
                displayLose(2, decodeURI(data.message), selfUrl);
            }
        });
    });
    //**点击36小时置顶弹框取消**
    $('#cancelunable').on('click', function () {
        $unableFloat.hide();
    });
    //**点击36小时置顶确定**
    $('#sureunable').on('click', function () {
        $unableFloat.hide();
        $.ajax({
            url: vars.mySite + '?c=myzf&a=ajaxCancelSetTop&houseid=' + cancelHouseid + '&city=' + cancelCity,
            type: 'GET',
            success: function (data) {
                displayLose(2, decodeURI(data.message), selfUrl);
            }
        });
    });
});
