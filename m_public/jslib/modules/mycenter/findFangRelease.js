/**
 * @file 帮你找房发布页
 * @author fcwang(wangfengchao@soufun.com)
 */
define('modules/mycenter/findFangRelease', ['jquery', 'modules/mycenter/yhxw', 'iscroll/2.0.0/iscroll-lite', 'verification/1.0.0/verification', 'verifycode/1.0.0/verifycode'], function (require) {
    'use strict';
    var $ = require('jquery');
    var verifycode = require('verifycode/1.0.0/verifycode');
    var IScroll = require('iscroll/2.0.0/iscroll-lite');
    var vars = seajs.data.vars;
    var url = vars.mySite;
    var city = vars.city;
    var ismvalid = vars.ismvalid;
    var district;
    var comarea;
    var price;
    var room;
    // 新房意向楼盘名称和楼盘id
    var projName = '';
    var newcode = '';
    var style = '';
    var rentType;
    var phonestr;
    var codestr;
    var result;

    // 引入用户行为分析对象-埋码
    var yhxw = require('modules/mycenter/yhxw');
    // 判断详情页种类，传入用户行为统计对象
    var pageId;
    // 发布类型
    if (vars.hidType === 'xf') {
        pageId = 'muchelpbuyxf';
    } else if (vars.hidType === 'esf') {
        pageId = 'muchelpbuyesf';
    } else if (vars.hidType === 'zf') {
        pageId = 'muchelpbuyqz';
    } else if (vars.hidType === 'jiaju') {
        pageId = 'muchelpbuyzxzb';
    }
    // 埋码变量数组
    var maiMaParams = {
        // 页面标识
        'vmg.page': pageId,
        // 区域
        'vmg.position': '',
        // 总价
        'vmg.totalprice': '',
        // 户型
        'vmg.housetype': '',
        // 租金
        'vmg.rentprice': '',
        // 租赁方式
        'vmg.renttype': '',
        // 姓名
        'vmg.name': '',
        // 手机号
        'vmg.phone': '',
        // 城市
        'vmg.city': '',
        // 小区名
        'vmg.village': '',
        // 风格
        'vmg.style': '',
        // 面积
        'vmg.area': '',
        // 预算
        'vmg.budget': '',
        // 邮箱
        'vmg.mail': ''
    };
    // 添加用户行为分析-浏览
    if (pageId) {
        yhxw({type: 0, pageId: pageId, params: maiMaParams});
    }

    $(function () {
        // 阻止页面滑动
        function unable() {
            window.addEventListener('touchmove', preventDefault, { passive: false });
        }

        function preventDefault(e) {
            e.preventDefault();
        }

        // 取消阻止页面滑动
        function enable() {
            window.removeEventListener('touchmove', preventDefault, { passive: false });
        }

        // 底部滑动菜单的“取消”按钮
        $('.cancel').on('click', function () {
            $('.sf-maskFixed').hide();
            enable();
        });

        // 选择区域
        $('#choosedistrict').on('click', function () {
            unable();
            $('#district, #districtdiv').show();
            new IScroll('#districtdiv');
            $('#allcomarea').children('div').hide();
        });
        // 底部区域选择菜单 选择区县
        var myDistrict;
        $('#districtdiv').find('li').on('click', function () {
            // 区县不限
            if ($(this).attr('data-district') === 'all') {
                $('.sf-maskFixed').hide();
                $('#choosedistrict').html($(this).html()).parent().parent().addClass('sele');
                district = '';
                comarea = '';
                enable();
                // 显示商圈
            } else {
                $('#districtdiv').hide();
                var areaId = '#area' + $(this).attr('data-district');
                $(areaId).show();
                new IScroll(areaId);
                district = $(this).html();
            }
            myDistrict = $(this).html();
        });
        // 底部区域选择菜单 选择商圈
        $('#allcomarea').find('li').on('click', function () {
            if ($(this).html() === '不限') {
                comarea = '';
            } else {
                comarea = $(this).html();
            }
            $('.sf-maskFixed').hide();
            $('#choosedistrict').html(myDistrict + '-' + $(this).html()).parent().parent().addClass('sele');
            enable();
        });

        // 选择价格
        $('#chooseprice').on('click', function () {
            unable();
            $('#price').show();
            new IScroll('#scrollPrice');
        });
        // 底部菜单选择价格
        $('#price').find('li').on('click', function () {
            if ($(this).html() === '不限') {
                price = '';
            } else {
                price = $(this).attr('data-price');
            }
            $('.sf-maskFixed').hide();
            $('#chooseprice').html($(this).html()).parent().parent().addClass('sele');
            enable();
        });

        // 选择户型
        $('#chooseroom').on('click', function () {
            unable();
            $('#room').show();
            new IScroll('#scrollRoom');
        });
        // 底部菜单选择户型
        $('#room').find('li').on('click', function () {
            if ($(this).html() === '不限') {
                room = '';
            } else {
                room = $(this).attr('data-room');
            }
            $('.sf-maskFixed').hide();
            $('#chooseroom').html($(this).html()).parent().parent().addClass('sele');
            enable();
        });

        // 选择租赁方式
        $('#chooserenttype').on('click', function () {
            unable();
            $('#renttype').show();
            new IScroll('#renttype');
        });
        // 底部菜单选择租赁方式
        $('#renttype').find('li').on('click', function () {
            rentType = $(this).html();
            $('.sf-maskFixed').hide();
            $('#chooserenttype').html($(this).html()).parent().parent().addClass('sele');
            enable();
        });

        // 装修招标 所在城市
        $('#choosecity').on('click', function () {
            unable();
            $('#citylist').show();
            new IScroll('#scrollCity');
        });
        // 底部菜单选择所在城市
        $('#citylist').find('li').on('click', function () {
            $('.sf-maskFixed').hide();
            $('#choosecity').html($(this).html()).parent().parent().addClass('sele');
            enable();
        });

        // 装修招标 装修风格
        $('#choosestype').on('click', function () {
            unable();
            $('#caseStyle').show();
            new IScroll('#scrollStyle');
        });
        // 底部菜单选择装修风格
        $('#caseStyle').find('li').on('click', function () {
            style = $(this).attr('data-casestyle');
            $('.sf-maskFixed').hide();
            $('#choosestype').html($(this).html()).parent().parent().addClass('sele');
            enable();
        });

        // 装修招标 查看更多条件
        $('.more_text').on('click', function () {
            // 无恢复功能
            /*$(this).hide();
             $('#jiazaiMore').show();*/
            // 有恢复功能
            if ($('#jiazaiMore').css('display') === 'none') {
                $('#jiazaiMore').show();
                $('.more_text').find('span').html('收起更多条件');
            } else {
                $('#jiazaiMore').hide();
                $('.more_text').find('span').html('查看更多条件');
            }
        });

        // 装修已登录情况修改手机号
        var loginInPhone = vars.hidPhone;
        if (vars.ismvalid === '1') {
            $('#myphone').on('input', function () {
                if ($('#myphone').val() === loginInPhone) {
                    $('#getcode, #codeLi').hide();
                    ismvalid = '1';
                } else {
                    $('#getcode, #codeLi').show();
                    ismvalid = '';
                }
            });
        }

        // 检测区域
        var checkDistrict = function () {
            if ($('#choosedistrict').html() !== '请选择区域') {
                return true;
            } else {
                alert('请选择区域');
                return false;
            }
        };
        // 检测价格
        var checkPrice = function () {
            if ($('#chooseprice').html() !== '请选择价格') {
                return true;
            } else {
                alert('请选择价格');
                return false;
            }
        };
        // 检测户型
        var checkRoom = function () {
            if ($('#chooseroom').html() !== '请选择户型') {
                // 埋码-户型变量
                maiMaParams['vmg.housetype'] = encodeURIComponent($('#chooseroom').html());
                return true;
            } else {
                alert('请选择户型');
                return false;
            }
        };
        // 检测租赁方式
        var checkRentType = function () {
            if ($('#chooserenttype').html() !== '请选择租赁方式') {
                // 埋码-租赁方式变量
                maiMaParams['vmg.renttype'] = encodeURIComponent($('#chooserenttype').html());
                return true;
            } else {
                alert('请选择租赁方式');
                return false;
            }
        };
        // 检验姓名
        var checkMyName = function () {
            if ($('#myName').val()) {
                return true;
            } else {
                alert('请输入您的姓名');
                return false;
            }
        };
        // 检验城市
        var checkChooseCity = function () {
            if ($('#choosecity').html()) {
                return true;
            } else {
                alert('请输入所在城市');
                return false;
            }
        };
        // 检验小区名称
        var checkChooseXiaoqu = function () {
            if ($('#choosexiaoqu').val()) {
                return true;
            } else {
                alert('请输入所在小区名称');
                return false;
            }
        };
        // 检验装修风格（可选）
        var checkChooseStype = function () {
            if ($('#choosestype').html() !== '请选择风格') {
                return true;
            } else {
                alert('请选择风格');
                return false;
            }
        };
        // 检验装修面积（可选）
        var checkChooseArea = function () {
            if ($('#choosearea').val()) {
                if (/^\+?[1-9][0-9]*$/.test($('#choosearea').val())) {
                    return true;
                }
                alert('请输入正确的面积(建议1-2000平米)');
                return false;
            }
            return true;
        };
        // 检验装修预算（可选）
        var checkJiajuPrice = function () {
            if ($('#jiajuprice').val()) {
                if (/^\+?[1-9][0-9]*$/.test($('#jiajuprice').val())) {
                    return true;
                }
                alert('请输入正确的预算');
                return false;
            }
            return true;
        };
        // 检验邮箱
        var verification = require('verification/1.0.0/verification');
        var checkChooseMail = function () {
            if ($('#choosemail').val()) {
                if (verification.isEmail($('#choosemail').val())) {
                    return true;
                } else {
                    alert('请输入正确的邮箱地址');
                    return false;
                }
            }
            return true;
        };
        // 检验具体要求（可选）
        var checkChooseTextArea = function () {
            if ($('#choosetextarea').val()) {
                return true;
            } else {
                alert('请输入具体要求');
                return false;
            }
        };

        // 限制手机号只能输入11位
        $('#myphone').on('input', function () {
            if ($('#myphone').val().length > 11) {
                this.value = this.value.substr(0, 11);
            }
        });
        // 限制验证码只能输入4位
        $('#mycode').on('input', function () {
            if ($('#mycode').val().length > 4) {
                this.value = this.value.substr(0, 4);
            }
        });

        // 检测手机号格式
        var checkPhone = function () {
            if (!$('#myphone').val()) {
                alert('请输入手机号');
                return false;
            }
            // 手机号格式状态为正确
            else if (/^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/.test($('#myphone').val())) {
                return true;
                // 手机号格式状态为错误
            } else {
                alert('请输入正确的手机号');
                return false;
            }
        };
        // 检测验证码格式
        var checkCode = function () {
            if (!$('#mycode').val()) {
                alert('请输入验证码');
                return false;
            }
            // 验证码格式状态为正确
            else if (/^[0-9]{4}$/.test($('#mycode').val())) {
                // console.log('验证码格式对');
                return true;
                // 验证码格式状态为错误
            } else {
                alert('请输入四位验证码');
                return false;
            }
        };

        // 60秒倒计时
        var wait = 60;
        // 增加标志位,待计时器计时结束时才会发送下一次ajax(zhangcongfeng@fang.com)
        var countdownFlag = true;

        function time(o) {
            if (wait === 0) {
                countdownFlag = true;
                o.html('发送验证码').addClass('active');
                wait = 60;
            } else {
                countdownFlag = false;
                o.html('重新发送(' + wait + ')').removeClass('active');
                wait--;
                setTimeout(function () {
                    time(o);
                }, 1000);
            }
        }

        // 发送验证码按钮添加事件
        $('#getcode').on('click', function () {
            var that = $(this);
            // 如果手机号格式正确
            if (checkPhone() && wait === 60) {
                // 请求获取验证码
                phonestr = $('#myphone').val();
                countdownFlag && verifycode.getPhoneVerifyCode(phonestr, function () {
                    time(that);
                }, function () {
                    // console.log('发送失败');
                });
            }
        });

        // 登录情况下提交表单内容的方法
        var postInput = function () {
            // 新房
            if (vars.hidType === 'xf') {
                if (checkDistrict() && checkPrice() && checkRoom()) {
                    var $chooseloupan = $('#chooseloupan');
                    if ($chooseloupan.text() !== '非必选') {
                        projName = $chooseloupan.text();
                        newcode = $chooseloupan.attr('data-newcode');
                    }
                    var jsondata = {
                        district: district,
                        comarea: comarea,
                        price: price,
                        room: room,
                        projName: projName,
                        newcode: newcode,
                        PageURL: encodeURIComponent(window.location.href)
                    };
                    // 埋码-区域变量
                    if (jsondata.district) {
                        maiMaParams['vmg.position'] = encodeURIComponent(jsondata.district) + '^' + encodeURIComponent(jsondata.comarea);
                    }
                    // 埋码-总价变量
                    if (jsondata.price) {
                        //分割价格
                        var priceArr = jsondata.price.split(',');
                        //不是以上
                        if (priceArr[1]) {
                            maiMaParams['vmg.totalprice'] = priceArr[0] + '-' + priceArr[1];
                        } else {
                            maiMaParams['vmg.totalprice'] = priceArr[0] + '-99999';
                        }
                    }

                    $.post(url + '?c=mycenter&a=ajaxAddXfFindFang&city=' + city, jsondata, function (data) {
                        // 有返回值
                        if (data) {
                            // 发布成功
                            if (data.code === '100') {
                                // 添加用户行为分析-埋码
                                yhxw({type: 75, pageId: pageId, params: maiMaParams});
                                setTimeout(function () {
                                    window.location.href = url + '?c=mycenter&a=findFangDetail&type=xf&district=' + district + '&comarea=' + comarea + '&room=' + room + '&price=' + price + '&city=' + city + '&time=' + parseInt(new Date().getTime() / 1000);
                                }, 100);
                                // 一分钟之内重复提交
                            } else if (data.code === '007') {
                                alert(data.error);
                            }
                        } else {
                            alert('提交失败');
                        }
                    });
                }
                // 二手房
            } else if (vars.hidType === 'esf') {
                if (checkDistrict() && checkPrice() && checkRoom()) {
                    var jsondata = {
                        district: district,
                        comarea: comarea,
                        price: price,
                        room: room
                    };
                    // 埋码-区域变量
                    if (jsondata.district) {
                        maiMaParams['vmg.position'] = encodeURIComponent(jsondata.district) + '^' + encodeURIComponent(jsondata.comarea);
                    }
                    // 埋码-总价变量
                    if (jsondata.price) {
                        //分割价格
                        var priceArr = jsondata.price.split(',');
                        //不是以上
                        if (priceArr[1]) {
                            maiMaParams['vmg.totalprice'] = priceArr[0] + '-' + priceArr[1];
                        } else {
                            maiMaParams['vmg.totalprice'] = priceArr[0] + '-99999';
                        }
                    }
                    $.post(url + '?c=mycenter&a=ajaxAddEsfFindFang&city=' + city, jsondata, function (data) {
                        // 发布成功
                        if (data) {
                            // 添加用户行为分析-埋码
                            yhxw({type: 45, pageId: pageId, params: maiMaParams});
                            setTimeout(function () {
                                window.location.href = url + '?c=mycenter&a=findFangDetail&type=esf&district=' + district + '&comarea=' + comarea + '&room=' + room + '&price=' + price + '&city=' + city + '&time=' + parseInt(new Date().getTime() / 1000);
                            }, 100);
                            // 发布不成功
                        } else {
                            alert('提交失败');
                        }
                    });
                }
                // 租房
            } else if (vars.hidType === 'zf') {
                if (checkDistrict() && checkPrice() && checkRentType() && checkRoom()) {
                    var jsondata = {
                        district: district,
                        comarea: comarea,
                        price: price,
                        room: room,
                        renttype: rentType
                    };
                    // 埋码-区域变量
                    if (jsondata.district) {
                        maiMaParams['vmg.position'] = encodeURIComponent(jsondata.district) + '^' + encodeURIComponent(jsondata.comarea);
                    }
                    // 埋码-总价变量
                    if (jsondata.price) {
                        //分割价格
                        var priceArr = jsondata.price.split(',');
                        //不是以上
                        if (priceArr[1]) {
                            maiMaParams['vmg.totalprice'] = priceArr[0] + '-' + priceArr[1];
                        } else {
                            maiMaParams['vmg.totalprice'] = priceArr[0] + '-99999';
                        }
                    }
                    $.post(url + '?c=mycenter&a=ajaxAddZfFindFang&city=' + city, jsondata, function (data) {
                        if (data) {
                            // 发布成功
                            if (data.result === '100') {
                                // 添加用户行为分析-埋码
                                yhxw({type: 48, pageId: pageId, params: maiMaParams});
                                // 跳转到租房详情页
                                setTimeout(function () {
                                    window.location.href = url + '?c=mycenter&a=findFangDetail&city=' + city + '&district=' + district + '&comarea=' + comarea + '&price=' + price + '&room=' + room + '&renttype=' + rentType + '&type=zf' + '&time=' + parseInt(new Date().getTime() / 1000);
                                }, 100);
                                // 发布不成功，弹出message
                            } else {
                                alert(data.message);
                            }
                        } else {
                            alert('提交失败');
                        }
                    });
                }
                // 装修
            } else if (vars.hidType === 'jiaju') {
                if (checkMyName() && checkPhone() && checkChooseCity() && checkChooseXiaoqu() && checkRoom() && checkChooseArea() && checkJiajuPrice() && checkChooseMail()) {
                    var jsondata = {
                        uname: $('#myName').val(),
                        cityname: $('#choosecity').html(),
                        ename: $('#choosexiaoqu').val(),
                        rooms: room,
                        style: style,
                        area: $('#choosearea').val(),
                        price: $('#jiajuprice').val(),
                        email: $('#choosemail').val(),
                        Content: $('#choosetextarea').val()
                    };
                    // 埋码变量
                    // 埋码-姓名变量
                    maiMaParams['vmg.name'] = encodeURIComponent(jsondata.uname);
                    // 埋码-城市变量
                    maiMaParams['vmg.city'] = encodeURIComponent(jsondata.cityname);
                    // 埋码-小区名变量
                    maiMaParams['vmg.village'] = encodeURIComponent(jsondata.ename);
                    // 埋码-面积变量
                    maiMaParams['vmg.area'] = jsondata.area;
                    // 埋码-预算变量
                    maiMaParams['vmg.budget'] = (jsondata.price * 10000);
                    // 埋码-邮箱变量
                    maiMaParams['vmg.mail'] = jsondata.email;
                    // 埋码-手机号变量
                    maiMaParams['vmg.phone'] = $('#myphone').val();
                    // 埋码-装修风格变量
                    maiMaParams['vmg.style'] = encodeURIComponent(style);

                    $.post(url + '?c=mycenter&a=ajaxAddJiajuFindFang&city=' + city, jsondata, function (data) {
                        // 有返回值
                        if (data) {
                            result = data.Result;
                            if (result === '-1') {
                                alert('每个手机号每天只能发布一条装修信息！');
                            } else if (result === '-2') {
                                alert('登录验证失败！');
                            } else if (result === '-3') {
                                alert('验证码错误！');
                            } else {
                                // 添加用户行为分析-埋码
                                yhxw({type: 71, pageId: pageId, params: maiMaParams});
                                // 成功跳转
                                setTimeout(function () {
                                    window.location.href = vars.jiajuSite + '?c=jiaju&a=zxOver&uname=' + jsondata.uname + '&phone=' + $('#myphone').val() + '&cityname=' + jsondata.cityname + '&ename=' + jsondata.ename + '&r=' + Math.random();
                                },100);
                            }
                            // 无返回值
                        } else {
                            alert('提交失败');
                        }
                    }, 'json');
                }
            }
        };

        // 提交按钮条件事件
        var submit = function () {
            $('#submit').on('click', function () {
                // 如果未登录 或 没绑定手机号
                if (ismvalid !== '1') {
                    if (checkPhone() && checkCode()) {
                        phonestr = $('#myphone').val();
                        codestr = $('#mycode').val();
                        verifycode.sendVerifyCodeAnswer(phonestr, codestr,
                            function () {
                                //console.log('验证码正确');
                                postInput();
                            },
                            function () {
                                //console.log('验证码错误');
                                alert('验证码错误，请重新输入');
                            });
                    }
                    // 已登录并且绑定手机号的情况
                } else {
                    postInput();
                }
                $('#submit').off('click');
                setTimeout(function () {
                    submit();
                }, 1000);
            });
        };
        submit();


        var aArr = $('.overboxIn').find('a'), l = aArr.length, leng = 0;
        for (var i = 0; i < l; i++) {
            var el = aArr.eq(i);
            leng += el.outerWidth(true);
        }

        $('.overboxIn').width(leng + 1);
        // 顶部导航滑动
        new IScroll('.noscroll', {
            scrollX: true,
            scrollY: false
        });

        // 已发布列表功能
        // 显示查看详情和删除按钮
        $('.arrow').on('click', function () {
            var myLi = $(this).parent().parent().parent();
            if (myLi.hasClass('open')) {
                myLi.removeClass('open');
            } else {
                myLi.addClass('open');
            }
        });
        // 删除功能
        var checkedReleased;
        var checkedReleasedType;
        var checkedReleasedId;
        $('.del').on('click', function () {
            checkedReleased = $(this);
            checkedReleasedType = checkedReleased.attr('data_type');
            checkedReleasedId = checkedReleased.attr('data_id');
            $('.floatAlert').show();
            //删除-埋码
            var liInfo = $(this).parents('li[data-type]').eq(0);
            // 删除埋码
            maiMaParams['vmg.findfanginfo'] = encodeURIComponent(liInfo.attr('data-type')) + '^' + encodeURIComponent(liInfo.attr('data-district')) + '^' + encodeURIComponent(liInfo.attr('data-comarea')) + '^' + encodeURIComponent(liInfo.attr('data-price')) + '^' + encodeURIComponent(liInfo.attr('data-room'));
        });
        // 第一条已发布数据ul列表
        var releasedUl = $('.releasedList1');
        // 给第一条li加上firstLi
        releasedUl.find('li').addClass('firstLi');
        // 更多已发布数据ul列表
        var releasedUl2 = $('.releasedList2');
        // 删除确认弹框 确定
        $('#ensure').on('click', function () {
            $.get(vars.mySite + '?c=mycenter&a=wantedDel&type=' + checkedReleasedType + '&id=' + checkedReleasedId, function (data) {
                // 成功
                if (data.result === '1') {
                    var liCheckedReleased = checkedReleased.parent().parent();
                    liCheckedReleased.remove();
                    // 全部删除后隐藏我的发布列表
                    if (!releasedUl.html() && !releasedUl2.html()) {
                        $('.releasedList').remove();
                    } else if (liCheckedReleased.hasClass('firstLi')) {
                        var firstLiReleasedUl2 = releasedUl2.find('li')[0];
                        firstLiReleasedUl2.remove();
                        releasedUl.html(firstLiReleasedUl2).find('li').addClass('firstLi');
                    }
                    // 只剩一条时，隐藏展开收起按钮
                    if (!releasedUl2.find('li').length) {
                        $('.btnZkSq').hide();
                    }
                    // 删除埋码，走单独的pageId
                    yhxw({type: 79, pageId: 'muchelpbuy', params: maiMaParams});
                    alert('删除成功！');
                    // 未登录
                } else if (data.result === '2') {
                    window.location.href = 'https://m.fang.com/passport/login.aspx?burl=';
                    // 失败
                } else {
                    alert('删除失败！');
                }
            });
            $('.floatAlert').hide();
        });
        // 删除确认弹框 取消
        $('#cancel').on('click', function () {
            $('.floatAlert').hide();
        });
        // 展开收起功能
        $('.btnZkSq').on('click', 'a', function () {
            var $this = $(this);
            if ($this.hasClass('Zk')) {
                releasedUl2.show();
                $this.removeClass('Zk').addClass('Sq').html('<span>收起全部</span>');
            } else {
                releasedUl2.hide();
                $this.removeClass('Sq').addClass('Zk').html('<span>展开全部</span>');
            }
        });
    });
});
