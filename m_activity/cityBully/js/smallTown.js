//  data:2015/8/24
//  developer:tan
//  description:小城霸主 A字段 新旧盘
$(function () {
    'use strict';

    /* 页面初始化start*/
    // 活动城市列表
    // var cityStr = '江都,天水,新民,章丘,崇州,新安,兴化,榆林,巩义,金堂,康平,石狮,南平,文安,荥阳,中卫,济阳,桐庐,湘西,雅安,胶南,吴忠,宜良,肇东,酒泉,依兰,中牟,邹城,高碑店,临沧,龙口,天门,浏阳,普兰店,顺德,余姚,丰县,蓬莱,无极,武威,昌乐,抚顺,富阳,平阴,邛崃,绥化,永登,肇州,登封,醴陵,南安,昭通,东台,恩平,陇南,庐江,海门,彭州,七台河,新沂,鄂尔多斯,白山,宜阳,宣城,铜川,长葛,高邮,伊川,汉中,佳木斯,宁海,庄河,宾阳,那曲,朔州,长乐,巴彦,溧阳,象山,邹平,宝应,福清,宁乡,仪征,海东,呼伦贝尔,临朐,青龙,东方,贺州,温岭,玉环,崇左,龙门,台山,铜仁,松原,桐乡,吐鲁番,攸县,法库,吕梁,平潭,如东,海西,沛县,永春,赵县,周至,平凉,玉田,肥城,乐亭,临清,睢宁,当阳,怒江,榆树,张掖,和田,滦县,启东,安达,淳安,普洱,上虞,鸡西,进贤,靖江,滦南,大兴安岭,固原,孟津,新郑,昌都,固镇,克孜勒苏,五常,定州,莱阳,辛集,鄢陵,定西,三明,尚志,偃师,博尔塔拉,河池,辽阳,桐城,德宏,迪庆,广饶,鹤岗,昌邑,德惠,嵩县,元氏,黑河,莱芜,临安,肥东,清徐,如皋,泰兴,新建,伊春,安宁,白银,大邑,巢湖,新密,安丘,建德,迁西,即墨,开平,湘乡,临夏,沭阳,潜江,五河,农安,诸暨,肇源,开阳,枝江,白城,蓝田,金坛,瓦房店,通化,锡林郭勒盟,榆中,晋州,莱西,莱州,霍邱,肥西,汝阳,遵化,宾县,兴安盟,怀远,德清,禹州,哈密,商河,平度,洛宁,新乐,凤城'
    // 获取所有input hidden 获取后台传过来的值
    var vars = {};
    $('input[type=hidden]').each(function (index, element) {
        vars[element.id] = element.value;
    });
    // 登录提交初始化(index,rule,sfbz,xcbz共4个页面)
    // 提交
    var submit = $('.submit');
    // 登录
    var sign = $('.sign');
    // 用户登录链接初始化(index,rule,sfbz,xcbz共4个页面)
    sign.attr('href', 'https://m.fang.com/passport/login.aspx?burl=' + encodeURIComponent(window.location.href));
    // 封装图标变灰函数
    function isDisable(obj) {
        obj.css({
            'background-color': '#fff',
            color: '#b2aeae',
            'border-color': '#b2aeae',
            disabled: 'disabled'
        }).attr('href', '');
    }

    // 判断用户登录和黑名单状态，设置相应的按钮为不可用
    if (parseInt(vars.loginOn)) {
        isDisable(submit);
    } else if (!parseInt(vars.loginOn) && parseInt(vars.blackStatus)) {
        isDisable(submit);
        isDisable(sign);
    } else {
        isDisable(sign);
        //  暂停活动时使用
        /* submit.attr('href','').on('click',function () {
         alert('本期活动已结束，请及时关注最新动态~');
         return false;
         });*/
    }
    // 用户信息初始化(a类字段提交页)
    var smallKing = $('#smallKing');
    if (smallKing.html() < 0) {
        smallKing.html('落选').attr('href', '').css({color: '#333333', 'text-decoration': 'none'});
    }
    // A字段 新盘和旧盘初始化
    // 新盘
    var selling = $('#selling');
    // 旧盘
    var selled = $('#selled');
    // 总户数
    var households = $('#households');
    // 销售热线
    var hotTel = $('#hotTel');
    // 区县
    var aDistrict = $('#aDistrict');
    var aTitle = $('#aTitle');
    var address = $('#address');
    var addressMessage = $('#addressMessage');

    // url地址参数获取函数
    var urlArr = window.location.search.substring(1).split('&');
    var urlJson = {};
    var i;
    for (i = 0; i < urlArr.length; i++) {
        urlArr[i] = urlArr[i].split('=');
        urlJson[urlArr[i][0]] = urlArr[i][1];
    }
    // 从列表页跳转页面过来是 获取nore参数判断是否该进入新盘还是旧盘选项卡页面
    if (urlJson.nore && urlJson.nore.toLowerCase() === 'e') {
        vars.sellState = 'E';
        selledClick();
    } else {
        // 默认进入新房
        vars.sellState = 'N';
        sellingClick();
    }
    // 提报B字段(链接和显示状态)是否可以点击初始化
    // 跳转B字段按钮
    var aTargetB = $('#aTargetB');
    // 城市名
    var aCity = $('#aCity');
    // 楼盘名
    var aProject = $('#aProject');
    // 楼盘提示信息
    var projectMessage = $('#projectMessage');
    // A类字段钱数
    var moneyA = $('#moneyA');
    // B类字段钱数
    var moneyB = $('#moneyB');
    // 后面新盘和旧盘切换时要用到，所以封装函数避免代码重复
    function limtBStatus() {
        // 三种状态 a：A类字段已通过审核 all：A、B均通过审核 none：A、B均未通过审核
        if (vars.Status && vars.Status.toLowerCase() === 'a') {
            // 跳转至B字段链接限制
            aTargetB.attr('href', '/huodongAC.d?m=getBind' + vars.sellState.toUpperCase() + 'B&class=CityBullyHc&city=' + encodeURI(encodeURI(aCity.val())) + '&projectname=' + encodeURI(encodeURI(aProject.val())) + '&nore=' + vars.sellState);
        } else {
            isDisable(aTargetB);
            // 楼盘提示框初始化
            if (urlJson.projectname) {
                switch (urlJson.Status) {
                    case 'a':
                        projectMessage.html('楼盘A类所有字段的' + moneyA.html() + '元已被领取,想赚' + moneyB.html() + '元,您可以<a href="/huodongAC.d?m=getBind' + vars.sellState.toUpperCase() + 'B&class=CityBullyHc&city=' + encodeURI(encodeURI(aCity.val())) + '&projectname=' + encodeURI(encodeURI(aProject.val())) + '&nore=' + vars.sellState + '"><i>填写B类字段</i></a>>>').show();
                        break;
                    case 'none':
                        projectMessage.html('需填写全部A类字段并审核通过后,才能领取' + moneyA.html() + '元,请尽快提交信息').show();
                        break;
                    case 'all':
                        projectMessage.html('此楼盘奖金已发,不能提交,请提交其他楼盘').show();
                        break;
                }
            } else {
                projectMessage.hide().find('a').attr('href', '');
            }
        }
    }

    limtBStatus();
    // 区县初始化
    // 弹窗列表div
    var aDistrictList = $('#aDistrictList');
    // 页面区县i
    var districtSelect = $('#districtSelect');
    // 后台传过来的区县列表
    var initProjectList = vars.initProjectList;
    var initProjectSure = districtSelect.text();
    if (initProjectList) {
        var initList = initProjectList.split(',');
        var tmpString = '';
        for (i = 0; i < initList.length; i++) {
            tmpString += '<dd>' + initList[i] + '</dd>';
        }
        aDistrictList.html(tmpString);
        // 列表中初始化class样式
        $('#aDistrictList dd').each(function () {
            if (initProjectSure.indexOf($(this).text()) !== -1) {
                $(this).addClass('smal_true');
            }
        });
    }
    //  住宅类别初始化
    // 页面住宅类型i
    var typeSelect = $('#typeSelect');
    var typeSelectV = typeSelect.html();
    if (typeSelectV) {
        //  var initType=typeSelectV.split(',');
        $('#typeTC dd').each(function () {
            var me = $(this);
            if (typeSelectV.indexOf(me.text()) !== -1) {
                me.addClass('smal_true');
            }
        });
    }
    //  楼盘字数限制初始化
    if (address.val()) {
        addressMessage.find('b').html(30 - address.val().length);
    }

    /* 页面初始化end*/

    /* 首页start*/
    // 分享(index,aSubmit共用)
    var shareline = $('.shareline');
    var mengceng = $('.mengceng');
    $('#shareIndex').on('click', function () {
        mengceng.removeClass('hide').click(function () {
            mengceng.addClass('hide');
            shareline.addClass('hide');
        });
        shareline.removeClass('hide');
    });

    /* 首页end*/

    /* A类字段start*/
    // A字段新盘旧盘切换
    function sellingClick() {
        selling.addClass('b_check_add').siblings().removeClass('b_check_add');
        households.hide();
        hotTel.show();
        aDistrict.show();
        aTitle.html('A类字段(6)');
        addressMessage.show();
        vars.sellState = 'N';
    }

    function selledClick() {
        selled.addClass('b_check_add').siblings().removeClass('b_check_add');
        households.show();
        hotTel.hide();
        aDistrict.hide();
        aTitle.html('A类字段(5)');
        addressMessage.hide();
        vars.sellState = 'E';
    }

    // 发送ajax切换提示信息栏金额
    // 获取主域名
    var mainSite = window.location.origin;

    function getMoneyM(noreS) {
        $.ajax({
            url: mainSite + '/huodongAC.d',
            type: 'GET',
            data: {
                class: 'CityBullyHc',
                m: 'getMoney',
                nore: noreS
            },
            success: function (data) {
                data = JSON.parse(data);
                moneyA.html(data.root.moneyA);
                moneyB.html(data.root.moneyB);
            }
        });
    }

    selling.on('click', function () {
        //  urlJson.projectname为判断是否为新进入的，新进入时url地址没有楼盘名
        if (!urlJson.Status || urlJson.Status.toLowerCase() === 'none' || vars.Status.toLowerCase() === 'none') {
            if (confirm('确认要切换新旧盘,点击确认将清空已输入的字段')) {
                $('#main input').val('');
                sellingClick();
                isDisable(aTargetB);
                projectMessage.hide().find('a').attr('href', '');
                getMoneyM('N');
            } else {
                return false;
            }
        }
    });
    selled.on('click', function () {
        //  urlJson.projectname为判断是否为新进入的，新进入时url地址没有楼盘名
        if (!urlJson.Status || urlJson.Status.toLowerCase() === 'none' || vars.Status.toLowerCase() === 'none') {
            if (confirm('确认要切换新旧盘,点击确认将清空已输入的字段')) {
                $('#main input').val('');
                selledClick();
                isDisable(aTargetB);
                projectMessage.hide().find('a').attr('href', '');
                getMoneyM('E');
            }
        } else {
            return false;
        }
    });

    // 所在城市输入
    // 城市列表
    var cityList = $('#cityList');
    var isExist = true;
    // 限制只能输入中文函数封装
    /* 	function zhInput(obj){
     obj.val(obj.val().replace(ZhReg,''));
     }*/
    // 获取区县列表
    function getDistractList() {
        $.ajax({
            url: mainSite + '/huodongAC.d',
            type: 'GET',
            data: {
                class: 'CityBullyHc',
                m: 'getDistricts',
                city: encodeURIComponent(aCity.val())
            },
            success: function (data) {
                //  <dd>丰台区</dd>
                data = JSON.parse(data);
                var data2 = data.root.distlist.replace(/\[|\]/g, '').split(',');
                var tmpString = '';
                for (var i = 0; i < data2.length; i++) {
                    tmpString += '<dd>' + data2[i] + '</dd>';
                }
                aDistrictList.html(tmpString);
            }
        });
    }

    var isCityClick = false;
    aCity.on('input', function () {
        // zhInput($(this));   // 限制只能输入中文
        setTimeout(function () {
            var meVal = aCity.val().trim();
            if (meVal) {
                $.ajax({
                    url: mainSite + '/huodongAC.d',
                    type: 'GET',
                    data: {
                        class: 'CityBullyHc',
                        m: 'getCity',
                        city: encodeURIComponent(meVal)
                    },
                    success: function (data) {
                        data = JSON.parse(data);
                        var data2 = data.root.citylist.replace(/\[|\]/g, '');
                        var data3 = data2.split(',');
                        if (data2.length === 0) {
                            isExist = false;
                        } else {
                            for (var j = 0; j < data3.length; j++) {
                                if (meVal === data3[j]) {
                                    isExist = true;
                                    break;
                                } else {
                                    isExist = false;
                                }
                            }
                        }
                        var tmpString = '';
                        for (var i = 0; i < data3.length; i++) {
                            tmpString += '<li>' + data3[i] + '</li>';
                        }
                        if (data3[0] !== '') {
                            cityList.html(tmpString).show();
                        }
                    }
                });
            } else {
                cityList.hide();
            }
        }, 300);
    });
    cityList.on('click', 'li', function () {
        isCityClick = true;
        isExist = true;
        aCity.val($(this).html().trim());
        cityList.hide();
        getDistractList();
    });
    // 判断城市是否在198活动城市范围内？
    aCity.on('blur', function () {
        setTimeout(function () {
            if (!isCityClick) {
                if (aCity.val().trim()) {
                    if (!isExist) {
                        alert('您所添加的城市不在活动城市范围内~');
                    } else {
                        getDistractList();
                    }
                }
            } else {
                isCityClick = false;
            }
        }, 100);
    });
    // 楼盘名称
    var projectList = $('#projectList');
    var oStatus = $('#Status');
    var isExistPoject = true;

    // 确认楼盘提报详细信息
    function getProjectM() {
        $.ajax({
            url: mainSite + '/huodongAC.d',
            type: 'GET',
            data: {
                class: 'CityBullyHc',
                m: 'getProjectsStatus',
                city: encodeURIComponent(aCity.val().trim()),
                nore: vars.sellState,
                projectname: encodeURIComponent(aProject.val())
            },
            success: function (data) {
                // A：A字段通过 All:A B字段都通过 None:都没通过
                data = JSON.parse(data);
                var data2 = data.root.Status;
                data2 = data2.toLowerCase();
                switch (data2) {
                    case 'a':
                        vars.Status = 'a';
                        oStatus.val('a');
                        projectMessage.html('楼盘A类所有字段的' + data.root.moneyA + '元已被领取,想赚' + data.root.moneyB + '元,您可以<a href="/huodongAC.d?m=getBind' + vars.sellState.toUpperCase() + 'B&class=CityBullyHc&city=' + encodeURI(encodeURI(aCity.val())) + '&projectname=' + encodeURI(encodeURI(aProject.val())) + '&nore=' + vars.sellState + '"><i>填写B类字段</i></a>>>').show();
                        aTargetB.css({
                            backgroundColor: '',
                            color: '',
                            disabled: ''
                        }).attr('href', '/huodongAC.d?m=getBind' + vars.sellState.toUpperCase() + 'B&class=CityBullyHc&city=' + encodeURI(encodeURI(aCity.val())) + '&projectname=' + encodeURI(encodeURI(aProject.val())) + '&nore=' + vars.sellState);
                        break;
                    case 'all':
                        vars.Status = 'all';
                        oStatus.val('all');
                        projectMessage.html('此楼盘奖金已发,不能提交,请提交其他楼盘').show();
                        break;
                    case 'none':
                        vars.Status = 'none';
                        oStatus.val('none');
                        projectMessage.html('需填写全部A类字段并审核通过后,才能领取' + data.root.moneyA + '元,请尽快提交信息').show();
                        break;
                }
            }
        });
    }

    aProject.on('input', function () {
        // zhInput($(this));   // 限制只能输入中文
        setTimeout(function () {
            var meVal = aProject.val().trim();
            vars.Status = 'none';
            if (meVal) {
                // 获取楼盘列表
                $.ajax({
                    url: mainSite + '/huodongAC.d',
                    type: 'GET',
                    data: {
                        class: 'CityBullyHc',
                        m: 'getProjects',
                        city: encodeURIComponent(aCity.val().trim()),
                        nore: vars.sellState,
                        projectname: encodeURIComponent(meVal)
                    },
                    success: function (data) {
                        //  <li>康桥原溪里</li>
                        data = JSON.parse(data);
                        var data2 = data.root.projectname.replace(/\[|\]/g, '');
                        var data3 = data2.split(',');
                        if (data2.length === 0) {
                            isExistPoject = false;
                        } else {
                            for (var j = 0; j < data3.length; j++) {
                                if (meVal === data3[j]) {
                                    isExistPoject = true;
                                    break;
                                } else {
                                    isExistPoject = false;
                                }
                            }
                        }
                        var tmpString = '';
                        for (var i = 0; i < data3.length; i++) {
                            tmpString += '<li>' + data3[i] + '</li>';
                        }
                        if (data3[0] !== '') {
                            projectList.html(tmpString).show();
                        }
                    }
                });
            } else {
                projectList.hide();
            }
        }, 300);
    });
    projectList.on('click', 'li', function () {
        aProject.val($(this).html().trim());
        projectList.hide();
        getProjectM();
    });
    // 判断楼盘是否在列表内？
    aProject.on('blur', function () {
        if (!isExistPoject) {
            vars.Status = 'none';
            projectMessage.html('需填写全部A类字段并审核通过后,才能领取奖金,请尽快提交信息').show();
        } else {
            getProjectM();
        }
    });
    // 列表出现后用户点击其他区域，列表消失
    $(document.body).on('click', function () {
        cityList.hide();
        projectList.hide();
    });
    // 楼盘地址
    var addressNum = 30;
    var addressSurplusNum = 30;
    address.on('input', function () {
        addressSurplusNum = addressNum - $(this).val().length;
        if (addressSurplusNum <= 0) {
            addressSurplusNum = 0;
            $(this).val($(this).val().substring(0, 30));
        }
        addressMessage.html('请勿填写区县名,您还可以输入<b>' + addressSurplusNum + '</b>字');
    });

    // 区县
    // 区县列表
    var aDistrictTC = $('#aDistrictTC');
    // 弹层
    var smallContTanceng = $('#small_cont_tanceng');
    // 确定按钮
    var determine = $('#determine');
    aDistrict.on('click', function () {
        smallContTanceng.show();
        aDistrictTC.show().on('click', 'dd', function () {
            $(this).addClass('smal_true').siblings().removeClass('smal_true');
        });
    });
    determine.on('click', function () {
        aDistrictTC.hide();
        smallContTanceng.hide();
        districtSelect.html(aDistrictList.find('.smal_true').html());
    });
    // 销售热线
    var telphone = $('#telphone');
    var telReg = /^(0[1-9]\d{1,2}-)?[1-9]\d{6,7}$/;
    var mobileReg = /^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$/;
    telphone.on('input', function () {
        var me = $(this);
        me.val(me.val().replace(/[^-\d]/g, ''));
    });

    // 住宅类别
    var aType = $('#aType');
    // 确定按钮
    var typeSure = $('#typeSure');
    // 住宅类型列表
    var typeTC = $('#typeTC');
    aType.on('click', function () {
        smallContTanceng.show();
        typeTC.show();
    });
    typeTC.on('click', 'dd', function () {
        $(this).toggleClass('smal_true');
    });
    // 存选择的住宅类型
    var tmpArr = [];
    typeSure.on('click', function () {
        typeTC.hide();
        smallContTanceng.hide();
        typeTC.find('.smal_true').each(function () {
            tmpArr.push($(this).text());
        });
        typeSelect.html(tmpArr.join(','));
        tmpArr = [];
    });
    // 总户数
    $('#totalnumber').on('input', function () {
        var me = $(this), val = me.val();
        if (!/^\d+$/.test(val)) {
            me.val(val.substring(0, val.length - 1));
        }
    });
    // 提交
    var aSubmit = $('#aSubmit');
    var ZhReg = /[\u4e00-\u9fa5]/i;
    // 提交开关
    var allowSubmit = true;
    aSubmit.on('click', function () {
        // if (cityStr.indexOf(aCity.val()) === -1) {
        // 	alert('您所添加的城市不在活动城市范围内~');
        // 	return;
        // }
        //  暂停活动时使用
        // alert('本期活动已结束，请及时关注最新动态~');
        // return false;

        if (allowSubmit) {
            // 防止连续点击
            allowSubmit = false;
            if (vars.Status.toLowerCase() === 'a') {
                if (confirm('A字段已经通过审核，现在去提交B字段吗?')) {
                    window.location.href = '/huodongAC.d?m=getBind' + vars.sellState.toUpperCase() + 'B&class=CityBullyHc&city=' + encodeURI(encodeURI(aCity.val())) + '&projectname=' + encodeURI(encodeURI(aProject.val())) + '&nore=' + vars.sellState;
                }
            } else if (vars.Status.toLowerCase() === 'all') {
                alert('所有字段都已经通过审核，不能再提交~');
                return false;
            } else if (vars.Status.toLowerCase() === 'none') {
                var parmage = {};
                if (!ZhReg.test(aCity.val().trim())) {
                    alert('请输入中文城市名且不能为空哦~');
                    return false;
                }
                parmage.city = encodeURIComponent(aCity.val().trim());
                if (!ZhReg.test(aProject.val())) {
                    alert('请输入中文楼盘名且不能为空哦~');
                    return false;
                }
                parmage.projectname = encodeURIComponent(aProject.val());
                parmage.class = 'CityBullyHc';
                parmage.m = 'inputNewA';
                parmage.nore = vars.sellState;
                parmage.address = encodeURIComponent(address.val());
                // 判断用户输入是手机号还是座机
                var telphoneV = telphone.val();
                if (telReg.test(telphoneV)) {
                    parmage.tel = telphoneV;
                    parmage.mobile = '';
                } else if (mobileReg.test(telphoneV)) {
                    parmage.tel = '';
                    parmage.mobile = telphoneV;
                } else {
                    parmage.tel = '';
                    parmage.mobile = '';
                }
                parmage.buildtype = encodeURIComponent(typeSelect.text().split(',').join('|'));
                parmage.district = encodeURIComponent(districtSelect.text());
                if (vars.sellState === 'E') {
                    parmage.totalnumber = $('#totalnumber').val();
                }
                $.ajax({
                    url: mainSite + '/huodongAC.d',
                    type: 'GET',
                    data: parmage,
                    success: function (data) {
                        allowSubmit = true;
                        data = JSON.parse(data);
                        if (data.root.Code === '100') {
                            window.location.href = window.location.origin + '/activityshow/cityBully/submitSuccess.jsp?money=' + moneyA.html() + '&nore=' + vars.sellState + '&isAB=A';
                        } else if (data.root.Code === '-2') {
                            alert('此城市已爆满，请移驾~');
                        } else if (data.root.Code === '-3') {
                            alert('A字段提报已结束，请去完善B字段~');
                        } else {
                            window.location.href = window.location.origin + '/activityshow/cityBully/submitFail.jsp?nore=' + vars.sellState + '&isAB=A&Status=' + vars.Status;
                        }
                    }
                });
            } else {
                return false;
            }
        }
    });
    // 所有input获取焦点时改变下划线颜色
    $('input[type=text]').on('focus', function () {
        $(this).parent().next().css('border-color', '#ff6600');
    }).on('blur', function () {
        $(this).parent().next().css('border-color', '#dbdbdb');
    });

    /* A类字段start*/
    /* 规则页start*/
    var ruleSelect = $('.con-btn').children();
    if (parseInt(vars.loginOn)) {
        ruleSelect.eq(0).attr('href', '').on('click', function () {
            alert('请先登录,才能进入哦~');
        });
    }

    /* 规则页end*/
});
