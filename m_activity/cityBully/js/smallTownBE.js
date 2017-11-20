// data:2015/8/25
// developer:tan
// description:小城霸主 B字段 旧盘
$(function () {
    'use strict';

    /* 初始化start*/
    // 获取所有字段元素
    var param = {};
    $('input,textarea,i').each(function (index, ele) {
        if (ele.id) {
            param[ele.id] = $(ele);
        }
    });
    // 用户信息初始化
    var smallKing = $('#smallKing');
    if (parseInt(smallKing.html()) === -1) {
        smallKing.html('落选').attr('href', '').css({color: '#333333', 'text-decoration': 'none'});
    }
    // 获取所有input hidden 获取后台传过来的值
    var vars = {};
    $('input[type=hidden]').each(function (index, element) {
        vars[element.id] = element.value;
    });
    // 获取url地址栏传递的参数
    var urlArr = window.location.search.substring(1).split('&');
    var urlJson = {};
    var i;
    for (i = 0; i < urlArr.length; i++) {
        urlArr[i] = urlArr[i].split('=');
        urlJson[urlArr[i][0]] = urlArr[i][1];
    }
    // 建筑类别初始化
    var typeSelectV = param.buildType.html();
    if (typeSelectV) {
        $('#buildTypeList dd').each(function () {
            if (typeSelectV.indexOf($(this).text()) !== -1) {
                $(this).addClass('smal_true');
            }
        });
    }
    // 区县商圈初始化
    var initBuildType = vars.initBuildType;
    var initBuildTypeSure = vars.initBuildTypeSure;
    var districtBox = $('#districtBox');
    param.district.html(initBuildTypeSure);
    if (initBuildType) {
        var initType = initBuildType.split(',');
        var tmpString = '';
        for (i = 0; i < initType.length; i++) {
            tmpString += '<dd>' + initType[i] + '</dd>';
        }
        districtBox.append(tmpString);
        // 列表中初始化class样式
        $('#districtList dd').each(function () {
            if (initBuildTypeSure.indexOf($(this).text()) !== -1) {
                $(this).addClass('smal_true');
            }
        });
    }
    // 楼盘字数限制初始化
    var fontNumLimit100 = $('.fontNumLimit100');
    var fontNumLimit200 = $('.fontNumLimit200');
    var fontNumLimit500 = $('.fontNumLimit500');
    fontNumLimit100.find('b').html(100 - param.floorStatus.val().length);
    fontNumLimit200.find('b').html(200 - param.projectDesc.val().length);
    fontNumLimit500.find('b').html(500 - param.trafficCondition.val().length);

    /* 初始化end*/
    /* 字段填写start*/
    // 建筑类别
    // 建筑类别列表
    var buildTypeList = $('#buildTypeList');
    // 弹层
    var tanceng = $('#tanceng');
    // 确定按钮
    var bDetermine = $('#bDetermine');
    param.buildType.on('click', function () {
        tanceng.show();
        buildTypeList.show();
    });
    buildTypeList.on('click', 'dd', function () {
        $(this).toggleClass('smal_true');
    });
    // 存选择的住宅类型
    var tmpArr = [];
    bDetermine.on('click', function () {
        buildTypeList.hide();
        tanceng.hide();
        buildTypeList.find('.smal_true').each(function () {
            tmpArr.push($(this).text());
        });
        param.buildType.html(tmpArr.join(','));
        tmpArr = [];
    });
    // 区县/商圈
    var districtList = $('#districtList');
    var bDetermine2 = $('#bDetermine2');
    param.district.on('click', function () {
        tanceng.show();
        districtList.show();
    });
    districtList.on('click', 'dd', function () {
        $(this).addClass('smal_true').siblings().removeClass('smal_true');
    });
    bDetermine2.on('click', function () {
        districtList.hide();
        tanceng.hide();
        districtList.find('.smal_true').each(function () {
            tmpArr.push($(this).text());
        });
        param.district.html(tmpArr.join(','));
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

    // 楼层状况
    fontNumLimit100.on('input', function () {
        var oTextarea = $(this).find('textarea');
        var oStrong = $(this).find('strong');
        fontNumLimit(oTextarea, 100, 100, oStrong);
    });
    // 项目简介
    fontNumLimit200.on('input', function () {
        var oTextarea = $(this).find('textarea');
        var oStrong = $(this).find('strong');
        fontNumLimit(oTextarea, 200, 200, oStrong);
    });
    // 交通状况
    fontNumLimit500.on('input', function () {
        var oTextarea = $(this).find('textarea');
        var oStrong = $(this).find('strong');
        fontNumLimit(oTextarea, 500, 500, oStrong);
    });
    // 容积率、绿化率
    $('.numLimit').on('input', function () {
        var me = $(this);
        me.val(me.val().replace(/[^\d\.]/g, ''));
    });
    // 建筑年代
    // 按钮
    var openPan = $('#selectDate3');
    // 日期
    var openDate1 = param.buildYear;
    // 建筑年代用户输入限制
    openDate1.on('input', function () {
        $(this).val('');
        alert('请点击添加按钮选择输入~');
    });
    // 增加确认开关，防止未点确认情况下继续点增加按钮
    var showb3 = true;
    openPan.on('click', function () {
        if (showb3) {
            showb3 = false;
            var dtSelect;
            var options = {
                // 特殊类型，表示一些集团需要特殊的处理时间方式，jiaju是家具需求
                type: '',
                // 年份限制
                yearRange: '1980-2020',
                // 单个选项的css高度，用于后面的位置计算
                singleLiHeight: 34,
                // 默认显示的日期，！！！请传入时间戳
                defaultTime: new Date().getTime(),
                // 取消按钮事件处理
                dateCancelFunc: function () {
                    showb3 = true;
                    dtSelect.hide(dtSelect.setting.SELET_TYPE_DATE);
                },
                // 日期确定按钮事件处理
                dateConfirmFunc: function (date) {
                    showb3 = true;
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
    // 邮编
    param.zipCode.on('input', function () {
        var me = $(this), val = me.val(), len = val.length;
        if (!/^\d+$/.test(val) || len === 7) {
            me.val(val.substring(0, val.length - 1));
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
    var bSubmit = $('#bSubmitE');
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
                parmage.m = 'inputEB';
                parmage.city = decodeURI(urlJson.city);
                parmage.projectname = decodeURI(urlJson.projectname);
                // 建筑类别
                parmage.buildType = encodeURI(param.buildType.text().split(',').join('|'));
                // 区县
                parmage.district = encodeURI(param.district.text());
                // 楼层状况
                parmage.floorconditions = encodeURI(param.floorStatus.val());
                // 容积率
                parmage.plotratio = param.plotratio.val();
                // 绿化率
                parmage.greeningrate = param.greeningrate.val();
                // 建筑年代
                parmage.buildYear = encodeURI(param.buildYear.val().split(',').join('|'));
                // 项目简介
                parmage.projectDesc = encodeURI(param.projectDesc.val());
                // 交通情况
                parmage.trafficCondition = encodeURI(param.trafficCondition.val());
                // 幼儿园
                parmage.kindergarten = encodeURI(param.kindergarten.val());
                // 中小学
                parmage.primaryMiddleSchool = encodeURI(param.primaryMiddleSchool.val());
                // 大学
                parmage.university = encodeURI(param.university.val());
                // 综合商场
                parmage.market = encodeURI(param.market.val());
                // 医院
                parmage.hospital = encodeURI(param.hospital.val());
                // 邮局
                parmage.postOffice = encodeURI(param.postOffice.val());
                // 银行
                parmage.bank = encodeURI(param.bank.val());
                // 户型
                parmage.houseTypeDesc = encodeURI(param.houseTypeDesc.val());
                // 产权描述
                parmage.propertyRight = encodeURI(param.propertyRight.val());
                // 邮编
                parmage.zipCode = param.zipCode.val();
                $.ajax({
                    url: mainSite + '/huodongAC.d',
                    type: 'POST',
                    data: parmage,
                    success: function (data) {
                        allowSubmit = true;
                        data = JSON.parse(data);
                        if (data.root.Code === '100') {
                            window.location.href = window.location.origin + '/activityshow/cityBully/submitSuccess.jsp?money=' + moneyB.html() + '&nore=E&isAB=EB';
                        }else {
                            window.location.href = window.location.origin + '/activityshow/cityBully/submitFail.jsp?nore=E&isAB=B';
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