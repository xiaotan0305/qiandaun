/**
 * @file WAP装修16期-统一报名
 * @author 袁辉辉(yuanhuihui@soufun.com)
 */
define('modules/jiaju/freeSignup', ['jquery', 'verifycode/1.0.0/verifycode', 'iscroll/1.0.0/iscroll'], function (require, exports, module) {
    'use strict';
    var vars = seajs.data.vars;
    var $ = require('jquery');
    var verifycode = require('verifycode/1.0.0/verifycode');
    var IScroll = require('iscroll/1.0.0/iscroll');

    function OrderFn() {}

    OrderFn.prototype = {
        init: function (isEmbed) {
            var that = this;
            // isEmbed =true 嵌入页
            that.isEmbed = !!isEmbed;

            /* 用户名称*/
            that.uname = $('#uname');
            // IOS中文输入法带有空格:空格放行
            that.unamePattern = /^([a-zA-Z\u4e00-\u9fa5]+[\s]?)+$/;
            that.clearInput = $('.off');

            /* 手机*/
            that.tel = $('#phone');
            that.noTelPattern = /[^\d]+/g;
            that.changeTel = $('.changeTel');


            /* 手机验证码*/
            that.vcode = $('#vcode');
            that.vcodeLi = $('#vcodeLi');

            /* 城市*/
            that.areaOption = $('#areaOption');
            that.cancel = $('#cancel');
            that.areaBack = $('#areaBack');
            that.optionInfo = $('#optionInfo');
            that.proCon = $('#proCon');
            that.cityCon = $('#cityCon');
            that.area = $('#area');
            that.areali = $('#area li');
            // 城市数据备份
            that.areaInfoBak = {};

            /* 提交按钮*/
            that.freeApply = $('#freeApply');
            that.notCity = $('#notCity');
            that.submitFlag = true;

            /* 各个字段通标识*/
            that.unameFlag = false;
            that.phoneCodeFlag = false;
            that.phoneFlag = false;
            if (that.cancel.text() !== '' && that.areaOption.text() !== '请选择您所在的区域') {
                that.cityFlag = true;
            } else {
                that.cityFlag = false;
            }

            /* toast*/
            that.sendFloat = $('#sendFloat');
            that.sendText = $('#sendText');

            /* 登录后不用输入验证码,手机只读。*/
            if (vars.phone) {
                that.vcodeLi.hide();
                that.phoneCodeFlag = true;
                that.tel.val(vars.phone);
                that.tel.prop({
                    readonly: true
                });
                that.phoneFlag = true;
            }

            that.bindEvent();
            // 解决ios 输入法遮挡toast的问题
            var UA = window.navigator.userAgent;
            if (/iPhone|iPod|iPad/i.test(UA)) {
                that.sendFloat.find('div').css({
                    top: '30%'
                });
            }


            // 嵌入页暂时不需要用户行为统计
            if (!that.isEmbed) {
                // click流量统计

                require.async(location.protocol + '//clickm.fang.com/click/new/clickm.js', function () {
                    window.Clickstat.eventAdd(window, 'load', function () {
                        window.Clickstat.batchEvent('wapjiajubm_', '');
                    });
                });
                // 搜索用户行为收集20160114
                var page = 'mjjsignup';
                require.async('jsub/_vb.js?c=' + page);
                require.async('jsub/_ubm.js', function () {
                    _ub.city = vars.cityname;
                    _ub.biz = 'h';
                    _ub.location = 0;
                    var b = 0;
                    var p = {
                        'vmg.page': page
                    };
                    _ub.collect(b, p);
                });
            }
        },

        bindEvent: function () {
            var that = this;

            /* 用户名*/
            that.uname.on('blur', function () {
                that.unameBlurFn();
            }).on('input', function (e) {
                that.unameInputFn(e);
            });
            that.clearInput.on('click', function () {
                that.uname.val('');
                that.clearInput.hide();
                that.unameFlag = false;
                that.freeApplyEnable();
            });

            /* 手机号*/
            that.tel.on('input', $.proxy(that.telInputFn, that)).on('blur', function () {
                that.telBlurFn();
            });
            // 显示城市控件，点击黑色区域时，达到和取消按钮一样的效果
            that.area.on('click', function (e) {
                if (e.target.id === 'area') {
                    that.cancelFn();
                }
            });

            // 如果登陆状态，changeTel文本显示更换手机号。未登录状态显示获取验证码
            that.changeTel.on('click', (function () {
                var flag = true;
                return function () {
                    if (flag) {
                        flag = false;
                        // 更换手机号
                        if (that.changeTel.text() === '更换手机号') {
                            that.changeTelFn();
                            that.changeTel.text('获取验证码').attr('id', 'wapjiajusy_D22_03');
                            flag = true;
                        } else if (!that.changeTel.hasClass('wait') && that.changeTel.hasClass('active') && that.changeTel.text() !== '更换手机号') {
                            // 获取验证码
                            var phonestr = that.tel.val().trim();
                            if (phonestr) {
                                verifycode.getPhoneVerifyCode(phonestr, function () {
                                    that.changeTel.addClass('wait');
                                    that.timeRecorder(60);
                                    flag = true;
                                }, function () {
                                    flag = true;
                                });
                            }
                        } else {
                            flag = true;
                        }
                    }
                };
            })());
            // 验证码
            that.vcode.on('blur', function () {
                that.validateVCode(false);
            }).on('input', $.proxy(that.vcodeBlurFn, that));

            // 免费申请
            that.freeApply.on('click', function () {
                if (that.submitFlag) {
                    that.freeApplyClickFn();
                }
            });

            // 城市区域的相关操作
            that.areaOption.on('click', function () {
                that.areaOptionFn();
            });
            that.areali.on('click', function () {
                that.arealiClickFn($(this));
            });
            that.cancel.on('click', function () {
                that.cancelFn();
            });
            that.areaBack.on('click', function () {
                var conName = that.areaBack.attr('conName');
                that.areaBackFn(conName);
            });
        },
        // 城市控件返回按钮
        areaBackFn: function (conName) {
            var that = this;
            var proID = that.areaOption.attr('data-proID');
            var cityID = that.areaOption.attr('data-cityID');
            if (conName === 'city') {
                // 当前选择器是城市
                that.areaBack.hide();
                that.proCon.show();
                that.proCon.children().children().removeClass('active').attr('style', 'opacity:1');
                $('#cityCon_' + proID).hide();
                that.optionInfo.text('请选择您所在的区域');
                that.areaOption.text('请选择您所在的区域');
                that.proCon.find('li').removeClass('activeS');
                that.proCon.find('li[value=\'' + that.areaOption.attr('data-proID') + '\']').addClass('activeS');
            } else {
                // 当前选择器是区域
                var cityConProID = $('#cityCon_' + proID);
                cityConProID.show();
                cityConProID.children().children().removeClass('active').attr('style', 'opacity:1');
                $('#distCon_' + cityID).hide();
                that.areaBack.attr('conName', 'city');
                that.optionInfo.text(that.areaOption.attr('data-proName'));
                that.areaOption.text(that.areaOption.attr('data-proName'));
                var cityConId = $('#cityCon_' + that.areaOption.attr('data-proID'));
                cityConId.find('li').removeClass('activeS');
                cityConId.find('li[value=\'' + that.areaOption.attr('data-cityID') + '\']').addClass('activeS');
            }
        },
        // 点击选择城市所触发的时间
        areaOptionFn: function () {
            var that = this;
            var text = that.areaOption.text();
            if (text && text !== '请选择您所在的区域') {
                // 清空所有已选定状态
                that.area.find('li').removeClass('activeS');
                // 已选择省份和城市的id
                var dataPro = that.areaOption.attr('data-proID'),
                    dataCityId = that.areaOption.attr('data-cityid'),
                    dataDistId = that.areaOption.attr('data-distID');
                // 备份已选项
                that.areaInfoBak.text = text;
                that.areaInfoBak.dataPro = dataPro;
                that.areaInfoBak.dataCityId = dataCityId;
                that.areaInfoBak.dataDistId = dataDistId;
                // 所选省份添加已选状态
                that.proCon.find('li[value=\'' + dataPro + '\']').addClass('activeS');
                // 所选城市添加已选状态
                $('#cityCon_' + dataPro).find('li[value=\'' + dataCityId + '\']').addClass('activeS');
                $('#distCon_' + dataCityId).find('li[value=\'' + dataDistId + '\']').addClass('activeS');
            }
            that.area.show();
            that.proCon.show();
            // 定位
            that.IScrollEvent('#proCon');
        },
        // 点击城市控件中li所触发的事件
        arealiClickFn: function ($this) {
            var that = this;
            $this.addClass('active');
            var divDom = $this.parent().parent();
            // 如果当前点击的选择器是省份，则
            if (divDom.attr('id') === 'proCon') {
                that.optionInfo.text('');
                that.areaOption.text('');
            }
            var thisVal = $this.val();
            var protext = that.areaOption.text() + ' ' + $this.text();
            that.optionInfo.text(protext);
            that.areaOption.text(protext);
            if (divDom.attr('id') === 'proCon') {
                // 省份选择器
                that.areaBack.show();
                that.areaOption.attr('data-proID', $this.val());
                that.areaOption.attr('data-proName', $this.text());
                // 为动画预留350ms
                setTimeout(function () {
                    $this.css('opacity', '0');
                    divDom.hide();
                    $('#cityCon_' + thisVal).show();
                    that.IScrollEvent('#cityCon_' + thisVal);
                    that.areaBack.attr('conName', 'city');
                }, 350);
            } else if (divDom.attr('conName') === 'city') {
                // 城市选择器
                that.areaOption.attr('data-cityID', $this.val());
                that.areaOption.attr('data-cityName', $this.text());
                setTimeout(function () {
                    var count = $('#distCon_' + thisVal).length;
                    if (count > 0) {
                        // 判断是否有区域存在
                        $('#distCon_' + thisVal).show();
                        divDom.hide();
                        that.IScrollEvent('#distCon_' + thisVal);
                        that.areaBack.attr('conName', 'dist');
                    } else {
                        // 重置返回为隐藏
                        that.areaOption.attr('data-distID', '');
                        that.areaOption.attr('data-distName', '');
                        that.areaBack.hide();
                        that.area.hide();
                        that.cityFlag = true;
                        $('#cityCon_' + that.areaOption.attr('data-proID')).hide();
                        that.areali.removeClass('active').css('opacity', '1');
                        that.freeApplyEnable();
                    }
                }, 350);
            } else {
                // 区域选择器
                that.areaOption.attr('data-distID', $this.val());
                that.areaOption.attr('data-distName', $this.text());
                setTimeout(function () {
                    // 重置返回为隐藏
                    that.areaBack.hide();
                    that.area.hide();
                    divDom.hide();
                    that.cityFlag = true;
                    that.areali.removeClass('active').css('opacity', '1');
                    that.freeApplyEnable();
                    that.areaBack.attr('conName', 'city');
                }, 350);
            }
        },
        // 城市控件取消功能
        cancelFn: function () {
            var that = this;
            var cityDiv = that.areaOption.attr('data-proID');
            var distDiv = that.areaOption.attr('data-cityID');
            that.area.find('li').removeClass('activeS');
            that.area.hide();
            that.proCon.show();
            that.areaBack.hide();
            $('#cityCon_' + cityDiv).hide();
            $('#distCon_' + distDiv).hide();
            if (that.areaInfoBak.dataPro) {
                that.cityFlag = true;
                that.areaOption.text(that.areaInfoBak.text);
                that.optionInfo.text(that.areaInfoBak.text);
                that.areaOption.attr({
                    'data-proID': that.areaInfoBak.dataPro,
                    'data-cityID': that.areaInfoBak.dataCityId,
                    'data-distID': that.areaInfoBak.dataDistId
                });
            } else {
                that.cityFlag = false;
                that.optionInfo.text('请选择您所在的区域');
                that.areaOption.text('请选择您所在的区域');
            }
            that.areali.removeClass('active').css('opacity', '1');
            that.freeApplyEnable();
        },

        // 添加滚动
        IScrollEvent: function (name) {
            // 滑动
            var that = this;
            that.posLog = that.refreshPosLog($(name));
            IScroll.refresh(name);
            // 当前筛选菜单下的筛选项
            var $li = $(name).find('li');
            // 筛选项总数
            var length = $li.length;
            // 当前选中筛选项的序数
            var index = $li.filter('.activeS').index();
            // 大于一屏
            if (index > that.posLog.length - 1) {
                IScroll.to(name, 0, -index * that.posLog.height);
                // 最后一屏
                if (length - index < that.posLog.length) {
                    IScroll.to(name, 0, -(length - that.posLog.length) * that.posLog.height);
                }
            }
        },
        // 记录筛选项高度和单屏筛选框个数
        refreshPosLog: (function () {
            // 只执行一次
            var isFirst = 1;
            var posLog = {};
            return function ($filterMenu) {
                if ($filterMenu && isFirst) {
                    var boxHeight = parseInt($filterMenu.css('height'), 10);
                    var ddHeight = parseInt($filterMenu.find('li').eq(0).css('height'), 10);
                    // 筛选项高度
                    posLog.height = ddHeight;
                    // 单屏筛选项个数
                    posLog.length = boxHeight / ddHeight;
                    isFirst = 0;
                }
                return posLog;
            };
        })(),
        // 用户名失去焦点时是否符合要求
        unameBlurFn: function () {
            var that = this;
            var result = that.validateUName();
            switch (result) {
                case 'illegal':
                    that.toast('只能输入中文或者英文字母');
                    that.unameFlag = false;
                    break;
                case 'tooMuch':
                    break;
                case 'tooLittle':
                    that.toast('请至少输入2个字');
                    that.unameFlag = false;
                    break;
                case 'legal':
                    that.unameFlag = true;
                    break;
                default:
                    break;
            }
        },
        // 用户名输入时是否符合要求
        unameInputFn: function () {
            var that = this;
            var result = this.validateUName();
            switch (result) {
                case 'illegal':
                    that.toast('只能输入中文或者英文字母');
                    that.unameFlag = false;
                    break;
                case 'tooMuch':
                    break;
                case 'tooLittle':
                    that.unameFlag = false;
                    break;
                case 'legal':
                    that.unameFlag = true;
                    break;
                default:
                    break;
            }
            that.freeApplyEnable();
            if (that.uname.val()) {
                that.clearInput.show();
            } else {
                that.clearInput.hide();
            }
        },
        // 验证用户名的正确性
        validateUName: function () {
            var that = this;
            var content = that.uname.val(),
                l = content.length;
            if (l > 0 && !that.unamePattern.test(content)) {
                return 'illegal';
            }
            if (l < 2) {
                return 'tooLittle';
            } else if (l > 8) {
                return 'tooMuch';
            }
            return 'legal';
        },
        // 提交按钮是否可点（如果用户名，手机号，验证码和城市区域都符合要求按钮置红，有一项不符合置灰）
        freeApplyEnable: function () {
            var that = this,
                flag = that.unameFlag && that.phoneFlag && that.cityFlag && that.phoneCodeFlag;
            if (flag) {
                that.freeApply.parent().addClass('active').attr('id', 'wapjiajubm_B01_12');
            } else {
                that.freeApply.parent().removeClass('active').attr('id', 'wapjiajubm_B01_11');
            }
        },
        // 手机号按钮
        telInputFn: function () {
            var that = this;
            // 禁止输入其他
            that.tel.val(that.tel.val().replace(that.noTelPattern, ''));
            if (that.validateTel() === 'legal') {
                if (!/[0-9]{1,2}/.test(that.changeTel.text())) {
                    that.changeTel.addClass('active');
                }
                that.phoneFlag = true;
            } else {
                that.changeTel.removeClass('active');
                that.phoneFlag = false;
            }

            /* 键盘删除手机号后，验证码调出,如果手机号和之前输入的一样，收回验证码*/
            if (vars.phone === that.tel.val() && vars.phone) {
                that.vcodeLi.hide();
                that.vcode.val('');
                that.phoneCodeFlag = true;
                that.tel.prop({
                    readonly: true
                });
                that.tel.blur();
                that.changeTel.text('更换手机号');
            } else {
                that.vcodeLi.show();
                that.phoneCodeFlag = /^[0-9]{4}$/.test(that.vcode.val());
                that.tel.removeAttr('readonly');
            }
            that.freeApplyEnable();
        },
        // 校正手机号
        telBlurFn: function () {
            var that = this;
            var result = that.validateTel();
            switch (result) {
                case 'tooLittle':
                    that.toast('请输入11位手机号');
                    break;
                case 'illegal':
                    that.toast('输入手机号错误');
                    break;
                case 'legal':
                    that.changeTel.addClass('active');
                    break;
                default:
                    break;
            }
        },
        // 验证手机号
        validateTel: function () {
            var that = this,
                tel = that.tel.val().trim();
            if (tel.length < 11) {
                return 'tooLittle';
            }
            return /^1[34578][0-9]{9}$/.test(tel) ? 'legal' : 'illegal';
        },
        // toast提示
        toast: function (content) {
            var that = this;
            that.sendFloat.show();
            that.sendText.html(content);
            setTimeout(function () {
                that.sendText.html('');
                that.sendFloat.hide();
            }, 2000);
        },
        // 验证码校正
        vcodeBlurFn: function () {
            var that = this;
            // 禁止输入其他
            that.vcode.val(that.vcode.val().replace(that.noTelPattern, ''));
            that.validateVCode();
        },

        changeTelFn: function (noClear) {
            var that = this;
            if (!noClear) {
                that.tel.val('');
            }
            that.tel.trigger('input');
            that.vcode.trigger('input');
        },
        // 验证码倒计时
        timeRecorder: function (timePara) {
            var that = this;
            var time = timePara;
            var handle = setInterval(function () {
                that.changeTel.text('重新发送(' + time + ')');
                if (Number(time) === 0) {
                    clearInterval(handle);
                    that.changeTel.text('重新发送');
                    that.changeTel.removeClass('wait');
                    that.tel.trigger('input');
                }
                time--;
            }, 1000);
        },

        validateVCode: function (showMsg) {
            var that = this;
            var phoneCode = that.vcode.val();
            that.vcode.val(phoneCode);

            var reg = /^[0-9]{4}$/;
            if (!reg.test(phoneCode)) {
                if (showMsg) {
                    that.toast('输入手机号错误');
                }
                that.phoneCodeFlag = false;
            } else {
                that.phoneCodeFlag = true;
            }
            that.freeApplyEnable();
        },

        /* 免费申请*/
        freeApplyClickFn: function () {
            var that = this;
            var DH = function () {
                var data;
                var url;
                // 接口所需参数
                data = {
                    RealName: encodeURIComponent(that.uname.val().trim()),
                    Mobile: that.tel.val().trim(),
                    CityName: encodeURIComponent(that.areaOption.attr('data-cityName')),
                    CityID: that.areaOption.attr('data-cityID'),
                    DistrictName: encodeURIComponent(that.areaOption.attr('data-distName')),
                    DistrictID: that.areaOption.attr('data-distID'),
                    SourcePageID: vars.SourcePageID,
                    SourceObjID: vars.SourceObjID,
                    SubSourceObjID: vars.SubSourceObjID,
                    IsPay: vars.IsPay,
                    Is4s: vars.Is4s,
                    SourcePageUrl: vars.SourcePageUrl,
                    vcode: that.vcode.val(),
                    PlatformType: vars.PlatformType,
                    formid: vars.formid,
                    utmSource: vars.remark
                };
                that.submitFlag = false;
                url = vars.jiajuSite + '?c=jiaju&a=ajaxfreeSignup&r=' + Math.random();
                // 嵌入页暂时不需要用户行为统计
                if (!that.isEmbed) {
                    // 搜索用户行为收集20160114
                    var page = 'mjjsignup';
                    require.async(['jsub/_vb.js?c=' + page, 'jsub/_ubm.js?v=201407181100'], function () {
                        _ub.city = vars.cityname;
                        _ub.biz = 'h';
                        _ub.location = 0;
                        var b = 62;
                        var pTemp = {
                            'vmg.page': page,
                            'vmh.name': encodeURIComponent(that.uname.val().trim()),
                            'vmh.phone': that.tel.val().trim(),
                            'vmh.city': encodeURIComponent(that.areaOption.attr('data-cityName')),
                        };
                        switch (vars.SourcePageID) {
                            case '1':
                                b = 67;
                                pTemp['vmg.refpage'] = 'mjjhomepage';
                                break;
                            case '2':
                                b = 62;
                                pTemp['vmg.refpage'] = 'mjjdesignerpage';
                                pTemp['vmh.designerid'] = vars.SourceObjID;
                                break;
                            case '3':
                                b = 65;
                                pTemp['vmg.refpage'] = 'mjjforemanpage';
                                pTemp['vmh.designerid'] = vars.SourceObjID;
                                break;
                            case '4':
                                b = 66;
                                pTemp['vmg.refpage'] = 'mjjsitepage';
                                pTemp['vmh.siteid'] = vars.SubSourceObjID;
                                break;
                            case '5':
                                b = 67;
                                pTemp['vmg.refpage'] = 'mjjpicturelist';
                                pTemp['vmh.siteid'] = vars.SubSourceObjID;
                                break;
                            case '6':
                                b = 67;
                                pTemp['vmg.refpage'] = 'mjjvolumelist';
                                pTemp['vmh.siteid'] = vars.SubSourceObjID;
                                break;
                            case '7':
                                b = 62;
                                pTemp['vmg.refpage'] = 'mjjpicturepage';
                                pTemp['vmh.designerid'] = vars.SourceObjID;
                                break;
                            case '8':
                                b = 62;
                                pTemp['vmg.refpage'] = 'mjjvolumepage';
                                pTemp['vmh.designerid'] = vars.SourceObjID;
                                break;
                            case '9':
                                b = 67;
                                pTemp['vmg.refpage'] = 'mjjatlaspage';
                                break;
                            case '10':
                                b = 67;
                                pTemp['vmg.refpage'] = 'mjjmaterialpage';
                                break;
                            default:
                                break;
                        }
                        var p = {};
                        // 若pTemp中属性为空或者无效，则不传入p中
                        for (var temp in pTemp) {
                            if (pTemp[temp]) {
                                p[temp] = pTemp[temp];
                            }
                        }
                        _ub.collect(b, p);
                    });
                }

                $.get(url, data, function (q) {
                    // 判断是否是开通城市
                    if (q.IsCityKT === '1') {
                        // 判断是否报名成功，如果成功跳转报名页选填页，失败提示错误信息
                        if (q.IsSuccess === '1') {
                            var locationUrl;
                           if (vars.is_sfapp === '1') {
                                locationUrl = vars.jiajuSite + '?c=jiaju&a=tyBaomingOption&apply=' + q.UserID + '&SourcePageUrl=' + encodeURIComponent(vars.SourcePageUrl) + '&city=' + vars.city +'&selectcityId=' + data.CityID+ '&RealName='+data.RealName+'&src=client';
                            } else {
                                locationUrl = vars.jiajuSite + '?c=jiaju&a=tyBaomingOption&apply=' + q.UserID + '&SourcePageUrl=' + encodeURIComponent(vars.SourcePageUrl) + '&city=' + vars.city +'&selectcityId=' + data.CityID+ '&RealName='+data.RealName;
                            }
                            window.location.href = locationUrl;
                        } else if (q.ErrorMsg) {
                            that.toast(q.ErrorMsg);
                        }
                    } else if (that.isEmbed) {
                        // 嵌入页报名成功
                        that.toast('我们已经加快城市的速度，请耐心等候');
                    } else {
                        // 原生页报名成功
                        that.notCity.show();
                        $('.main').hide();
                    }
                    that.submitFlag = true;
                }).complete(function () {
                    that.submitFlag = true;
                });
            };
            if (that.freeApply.parent().hasClass('active')) {
                if (that.vcode.val() !== '') {
                    verifycode.sendVerifyCodeAnswer(that.tel.val(), that.vcode.val(),
                        DH,
                        function () {
                            alert('验证码错误,请重新登录');
                            that.submitFlag = true;
                        });
                } else {
                    DH();
                }
            }
        }
    };


    module.exports = function freeSignup(isEmbed) {
        var registerObj = new OrderFn();
        registerObj.init(isEmbed);
    };
});