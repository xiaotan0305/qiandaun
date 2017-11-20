//  data:2015/8/25
//  developer:tan
//  description:小城霸主 B字段 新盘
$(function () {
    'use strict';
    
    /* 初始化start*/
    // 获取所有input hidden 获取后台传过来的值
    var vars = {};
    $('input[type=hidden]').each(function (index, element) {
        vars[element.id] = element.value;
    });
    // 获取url地址栏传递的参数
    var urlArr = window.location.search.substring(1).split('&');
    var urlJson = {};
    for (var i = 0; i < urlArr.length; i++) {
        urlArr[i] = urlArr[i].split('=');
        urlJson[urlArr[i][0]] = urlArr[i][1];
    }
    //  装修状况初始化
    // 装修状况选择
    var bDecorationSelect = $('#bDecorationSelect');
    var typeSelectV = bDecorationSelect.html();
    if (typeSelectV) {
        $('#decorationList dd').each(function () {
            if (typeSelectV.indexOf($(this).text()) !== -1) {
                $(this).addClass('smal_true');
            }
        });
    }
    // 用户信息初始化
    var smallKing = $('#smallKing');
    if (parseInt(smallKing.html()) === -1) {
        smallKing.html('落选').attr('href', '').css({color: '#333333', 'text-decoration': 'none'});
    }
    //  楼盘字数限制初始化
    var fontNumLimit200 = $('.fontNumLimit200');
    var fontNumLimit500 = $('.fontNumLimit500');
    fontNumLimit200.find('b').eq(0).html(200 - $('#projectInformation').val().length);
    fontNumLimit200.find('b').eq(1).html(200 - $('#parkingdesc').val().length);
    fontNumLimit200.find('b').eq(2).html(200 - $('#internalMatching').val().length);
    fontNumLimit500.find('b').eq(0).html(500 - $('#traffic').val().length);
    fontNumLimit500.find('b').eq(1).html(500 - $('#supporting').val().length);
    
    /* 初始化end*/
    /* 字段填写start*/
    // 装修状况
    var bDecoration = $('#bDecoration');
    // 装修列表
    var decorationList = $('#decorationList');
    // 弹层
    var btanceng = $('#btanceng');
    // 确定按钮
    var bDetermine = $('#bDetermine');
    bDecoration.on('click', function () {
        btanceng.show();
        decorationList.show();
    });
    decorationList.on('click', 'dd', function () {
        $(this).toggleClass('smal_true');
    });
    // 存选择的住宅类型
    var tmpArr = [];
    bDetermine.on('click', function () {
        decorationList.hide();
        btanceng.hide();
        decorationList.find('.smal_true').each(function () {
            tmpArr.push($(this).text());
        });
        bDecorationSelect.html(tmpArr.join(','));
        tmpArr = [];
    });
    // 字数限制函数封装
    function fontNumLimit(obj, totleNum, tmpNum, objMessage) {
        tmpNum = totleNum - obj.val().length;
        if (tmpNum <= 0) {
            tmpNum = 0;
            obj.val(obj.val().substring(0, totleNum));
        }
        objMessage.html(totleNum + '字限制,您还可以输入<b>' + tmpNum + '</b>字');
    }

    // 项目简介、停车位描述、小区内部配套
    fontNumLimit200.on('input', function () {
        var oTextarea = $(this).find('textarea');
        var oStrong = $(this).find('strong');
        fontNumLimit(oTextarea, 200, 200, oStrong);
    });
    // 建筑面积、容积率、绿化率、物业管理费
    $('.numLimit').on('input', function () {
        var me = $(this);
        me.val(me.val().replace(/[^\d\.]/g, ''));
    });
    // 交通状况、周边配套
    fontNumLimit500.on('input', function () {
        var oTextarea = $(this).find('textarea');
        var oStrong = $(this).find('strong');
        fontNumLimit(oTextarea, 500, 500, oStrong);
    });
    // 开盘时间
    // 按钮
    var openPan = $('#selectDate1');
    // 日期
    var openDate1 = $('#openDate1');
    // 开盘时间用户输入限制
    openDate1.on('input', function () {
        $(this).val('');
        alert('请点击添加按钮选择输入~');
    });
    // 增加确认开关，防止未点确认情况下继续点增加按钮
    var showb1 = true;
    openPan.on('click', function () {
        if (showb1) {
            showb1 = false;
            var dtSelect;
            var options = {
                // 特殊类型，表示一些集团需要特殊的处理时间方式，jiaju是家具需求
                type: '',
                // 年份限制
                yearRange: '2005-2020',
                // 单个选项的css高度，用于后面的位置计算
                singleLiHeight: 34,
                // 默认显示的日期，！！！请传入时间戳
                defaultTime: new Date().getTime(),
                // 取消按钮事件处理
                dateCancelFunc: function () {
                    showb1 = true;
                    dtSelect.hide(dtSelect.setting.SELET_TYPE_DATE);
                },
                // 日期确定按钮事件处理
                dateConfirmFunc: function (date) {
                    showb1 = true;
                    if (openDate1.val()) {
                        openDate1.val(openDate1.val() + ',' + date);
                    } else {
                        openDate1.val(date);
                    }
                    dtSelect.hide(dtSelect.setting.SELET_TYPE_DATE);
                }
            };
            dtSelect = new DateAndTimeSelect(options);
            dtSelect.show(dtSelect.setting.SELET_TYPE_DATE);
        } else {
            return false;
        }
    });
    // 入住时间
    // 按钮
    var openPan2 = $('#selectDate2');
    // 日期
    var openDate2 = $('#openDate2');
    // 入住时间用户输入限制
    openDate2.on('input', function () {
        $(this).val('');
        alert('请点击添加按钮选择输入~');
    });
    // 增加确认开关，防止未点确认情况下继续点增加按钮
    var showb2 = true;
    openPan2.on('click', function () {
        if (showb2) {
            showb2 = false;
            var dtSelect;
            var options = {
                // 特殊类型，表示一些集团需要特殊的处理时间方式，jiaju是家具需求
                type: '',
                // 年份限制
                yearRange: '2005-2020',
                // 单个选项的css高度，用于后面的位置计算
                singleLiHeight: 34,
                // 默认显示的日期，！！！请传入时间戳
                defaultTime: new Date().getTime(),
                // 取消按钮事件处理
                dateCancelFunc: function () {
                    showb2 = true;
                    dtSelect.hide(dtSelect.setting.SELET_TYPE_DATE);
                },
                // 日期确定按钮事件处理
                dateConfirmFunc: function (date) {
                    showb2 = true;
                    if (openDate2.val()) {
                        openDate2.val(openDate2.val() + ',' + date);
                    } else {
                        openDate2.val(date);
                    }
                    dtSelect.hide(dtSelect.setting.SELET_TYPE_DATE);
                }
            };
            dtSelect = new DateAndTimeSelect(options);
            dtSelect.show(dtSelect.setting.SELET_TYPE_DATE);
        } else {
            return false;
        }
    });

    /* 字段填写end*/
    /* 点击分享start*/
    // 分享
    var $shareline = $('.shareline');
    var $mengceng = $('.mengceng');
    $('#shareIndex').on('click', function () {
        $mengceng.removeClass('hide').click(function () {
            $mengceng.addClass('hide');
            $shareline.addClass('hide');
        });
        $shareline.removeClass('hide');
    });

    /* 点击分享end*/
    /* 提交start*/
    var bSubmit = $('#bSubmitN');
    var mainSite = window.location.origin;
    var moneyB = $('#moneyB');
    // 提交开关
    var allowSubmit = true;
    bSubmit.on('click', function () {
        if (allowSubmit) {
            allowSubmit = false;
            //  暂停活动时使用
            // alert('本期活动已结束，请及时关注最新动态~');
            // return false;
            if (vars.Status.toLowerCase() === 'all') {
                alert('该楼盘已经通过审核，请提交其他楼盘吧~');
                return false;
            } else if (vars.Status.toLowerCase() === 'a') {
                var parmage = {};
                parmage.class = 'CityBullyHc';
                parmage.m = 'inputNB';
                parmage.city = decodeURI(urlJson.city);
                parmage.projectname = decodeURI(urlJson.projectname);
                // 装修状况
                parmage.decoration = encodeURI(bDecorationSelect.text().split(',').join('|'));
                // 项目介绍
                parmage.projectdesc = encodeURI($('#projectInformation').val());
                // 建筑面积
                parmage.builtuparea = $('#architecture').val();
                // 交通状况
                parmage.trafficcondition = encodeURI($('#traffic').val());
                // 周边配套
                parmage.peripheralmatching = encodeURI($('#supporting').val());
                // 开发商
                parmage.developers = encodeURI($('#developers').val());
                // 容积率
                parmage.plotratio = $('#volume').val();
                // 绿化率
                parmage.greeningrate = $('#green').val();
                // 停车位描述
                parmage.parkingdesc = encodeURI($('#parkingdesc').val());
                // 物业管理费
                parmage.propertymanagefee = $('#propertymanagefee').val();
                // 小区内部配套
                parmage.internalMatching = encodeURI($('#internalMatching').val());
                // 开盘时间
                parmage.opentime = openDate1.val().split(',').join('|');
                // 入住时间
                parmage.checkintime = openDate2.val().split(',').join('|');
                // 价格
                parmage.averageprice = $('#averageprice').val();
                // 物业管理公司
                parmage.propertyManagementCompany = encodeURI($('#propertyManagementCompany').val());
                // 户型情况
                parmage.housetypedesc = encodeURI($('#housetypedesc').val());
                $.ajax({
                    url: mainSite + '/huodongAC.d',
                    type: 'POST',
                    data: parmage,
                    success: function (data) {
                        allowSubmit = false;
                        data = JSON.parse(data);
                        if (data.root.Code === '100') {
                            window.location.href = window.location.origin + '/activityshow/cityBully/submitSuccess.jsp?money=' + moneyB.html() + '&nore=N&isAB=NB';
                        }else {
                            window.location.href = window.location.origin + '/activityshow/cityBully/submitFail.jsp?nore=N&isAB=B';
                        }
                    }
                });
            } else {
                alert('返回楼盘审核状态信息错误:Status');
                return false;
            }
        }
    });

    /* 提交end*/
    // 所有input、textarea获取焦点时改变下划线颜色
    $('input[type=text],textarea').on('focus', function () {
        $(this).parent().next().css('border-color', '#ff6600');
    }).on('blur', function () {
        $(this).parent().next().css('border-color', '#dbdbdb');
    });
});