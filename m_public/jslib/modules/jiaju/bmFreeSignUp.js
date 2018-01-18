/**
 * Created on 2017/8/25.
 */
define('modules/jiaju/bmFreeSignUp', [
    'jquery',
    'verifycode/1.0.0/verifycode',
    'slideFilterBox/1.0.0/slideFilterBox',
    'modules/jiaju/yhxw'
], function (require, exports, module) {
    'use strict';
    var vars = seajs.data.vars;
    var $ = require('jquery');
    var verifycode = require('verifycode/1.0.0/verifycode');
    var slideFilterBox = require('slideFilterBox/1.0.0/slideFilterBox');
    var $document = $(document);
    var $window = $(window);
    var clickFlag = true;
    // 用户行为
    var yhxw = require('modules/jiaju/yhxw');
    var pageId, typeId;
    switch (vars.template) {
        case 'bmFreeDecorate':
            pageId = 'mjjzzsbaoming';
            typeId = 20;
            break;
        case 'bmFreeCheck':
            pageId = 'mjjyanfangbaoming';
            typeId = 20;
            break;
        case 'bmFreeMeasure':
            pageId = 'mjjfreesurvey';
            typeId = 67;
            break;
        default:
            pageId = 'mjjsignup';
            typeId = 67;
            break;
    }
    yhxw({
        page: pageId
    });

    function OrderFn() { }
    OrderFn.prototype = {
        init: function (isEmbed) {
            var that = this;
            // isEmbed=true嵌入页
            that.isEmbed = isEmbed;

            /* 房屋面积*/
            that.houseArea = $('#houseArea');
            // 验证面积正则
            that.areaPattern = /^\d{1,3}(?:\.\d{1,2})?$/;

            /* 小区或者楼盘名字*/
            that.projName = $('#projName');
            // 小区弹层
            that.projNameFloat = $('#projNameFloat');
            // 小区弹层上的搜索提示列表
            that.projNameFloatList = $('#projNameFloatList');
            // 小区弹层上的确定按钮
            that.projNameConfirm = $('#projNameConfirm');

            /* 手机号*/
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
            that.submitFlag = true;

            /* 返回按钮*/
            that.backBtn = $('.back');
            that.ldOutBox = $('.ld-outBox');
            that.backLeave = $('#backLeave');
            that.backLook = $('#backLook');

            /* 页面底部的浮层*/
            that.ldUpBoxH = $('.ld-upBoxH');

            /* 页面头部剩余报名数目*/
            that.numBtn = $('.num');
            that.num1 = $('.num1');
            that.num2 = $('.num2');
            that.num3 = $('.num3');

            /* 最新十条报名的box*/
            that.ldMessage = $('.ld-message');

            /* 4个六边形的特效*/
            that.ppInfo = $('#ppInfo');

            /* 三角形特效*/
            that.ldplan = $('.ldplan');

            /* 各个字段通过标识*/
            that.houseAreaFlag = false;
            that.phoneCodeFlag = false;
            that.projNameFlag = false;
            that.phoneFlag = false;
            if (that.cancel.text() !== '' && that.areaOption.text() !== '请选择您的地区') {
                that.cityFlag = true;
            } else {
                that.cityFlag = false;
            }

            /* toast错误提示*/
            that.sendFloat = $('#sendFloat');
            that.sendText = $('#sendText');

            /* 登录后不用输入验证码，手机号码只读*/
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
            // 解决ios输入法遮挡toast的问题
            var UA = window.navigator.userAgent;
            if (/iPhone|iPod|iPad/i.test(UA)) {
                that.sendFloat.find('div').css({
                    top: '30%'
                });
            }
            // 监控页面的滚动，如果报名框滚过了，就让底部浮层出现
            that.showUpBoxFn();
            // 报名名额数
            that.getBMNum();
            // 最新报名十条
            that.getNewestBMInfo();
            // 六边形从四个方向飞入
            that.scrollHexagonFade();
            // 三角形特效
            if (that.ldplan.length) {
                that.initResize();
                that.scrollShowTriangle();
            }
        },
        bindEvent: function () {
            var that = this;

            /* 房屋面积*/
            that.houseArea.on('blur input', function () {
                that.houseAreaValidFn();
            });

            /* 小区或者楼盘*/

            that.projName.on('input focus', function () {
                that.projNameInputTip();
            });

            // 点击确定按钮
            that.projNameConfirm.on('click', function () {
                that.confirmProjname();
            });

            /* 选择搜索提示的楼盘，放入小区提示浮层上的输入框*/
            that.projNameFloat.on('click', '.projSearchItem', function () {
                var $that = $(this);
                that.projName.val($.trim($that.text()));
                that.projName.attr('data-hid', $that.attr('data-hid'));
                that.projNameFloatList.html('');
                that.projNameFloat.hide();
                that.projNameConfirm.hide();
            });

            /* 手机号*/
            that.tel.on('input', $.proxy(that.telInputFn, that)).on('blur', function () {
                that.telBlurFn();
            });

            /* 显示城市控件，点击黑色区域时候，达到和取消按钮一样的效果*/
            that.area.on('click', function (e) {
                if (e.target.id === 'area') {
                    that.cancelFn();
                }
            });

            /* 如果登录状态，changeTel文本显示更换手机号；未登录状态显示获取验证码*/
            that.changeTel.off('click').on('click', function () {
                var flag = true;
                if (flag) {
                    flag = false;
                    // 更换手机号
                    if (that.changeTel.text() === '更换手机号') {
                        that.changeTelFn();
                        that.changeTel.text('获取验证码');
                        flag = true;
                    } else if (!that.changeTel.hasClass('noClick') && that.changeTel.text() !== '更换手机号') {
                        that.unable();
                        // 获取验证码
                        var phonestr = that.tel.val().trim();
                        if (phonestr) {
                            verifycode.getPhoneVerifyCode(phonestr, function () {
                                that.changeTel.addClass('noClick');
                                that.timeRecorder(60);
                                flag = true;
                                that.enable();
                            }, function () {
                                that.enable();
                                flag = true;
                            });
                        }
                    } else {
                        that.enable();
                        flag = true;
                    }
                }
            });

            /* 验证码*/
            that.vcode.on('blur', function () {
                that.validateVCode(false);
            }).on('input', $.proxy(that.vcodeBlurFn, that));

            /* 验证码浮层出现的时候，页面不能滚动，点击其他地方让验证码消失*/
            $document.on('click', '#phoneDivImgVerify1', function () {
                that.enable();
                $(this).hide();
            });
            $document.on('click', '#phoneDivImgVerify2', function (e) {
                e.stopPropagation();
            });
            $document.on('click', '#phoneImgVerifyCodeSubmit', function () {
                that.enable();
            });

            /* 免费申请*/
            that.freeApply.on('click', function () {
                // 先验证面积，是为了解决部分浏览器返回之后仍然有面积，但是并未触发面积验证函数
                that.houseAreaValidFn();
                if (that.submitFlag && that.freeApplyEnable() && clickFlag) {
                    that.freeApplyClickFn();
                }
            });

            /* 城市区域的相关操作*/
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

            /* 点击返回按钮进行挽留*/
            that.backBtn.on('click', function () {
                that.ldOutBox.show();
                that.unable();
            });
            // 返回上一页面
            that.backLeave.on('click', function () {
                that.ldOutBox.hide();
                that.enable();
                window.location = vars.bmUrls.getUrl(1);
                return;
            });
            // 留在当前页面再看看,滑动到报名框
            that.backLook.on('click', function () {
                that.ldOutBox.hide();
                that.enable();
                $window.scrollTop(that.numBtn.offset().top);
            });

            /* 点击页面底部的浮层，页面滚动到报名框*/
            that.ldUpBoxH.on('click', function () {
                $window.scrollTop(that.numBtn.offset().top);
            });

            /* 选择区域之后改变文字颜色*/
            that.areaOption.bind('DOMNodeInserted', function (e) {
                var $that = $(this);
                if ($.trim($that.text()) === '请选择您的地区') {
                    $that.parent().css('color', '#3c3f46');
                } else {
                    $that.parent().css('color', 'black');
                }
            });
        },
        // 城市控件返回按钮
        areaBackFn: function (conName) {
            var that = this;
            var proID = that.areaOption.attr('data-proID');
            var cityID = that.areaOption.attr('data-cityID');
            that.unable();
            if (conName === 'city') {
                // 当前选择器是城市
                that.areaBack.hide();
                that.proCon.show();
                that.proCon.children().children().removeClass('active').attr('style', 'opacity:1');
                $('#cityCon_' + proID).hide();
                that.optionInfo.text('请选择您的地区');
                that.areaOption.text('请选择您的地区');
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
            if (text && text !== '请选择您的地区') {
                // 清空所有已选定的状态
                that.area.find('li').removeClass('activeS');
                // 已选择省份和城市的id
                var dataPro = that.areaOption.attr('data-proID'),
                    dataCityId = that.areaOption.attr('data-cityID'),
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
            that.unable();
        },

        // 点击城市控件中li所触发的事件
        arealiClickFn: function ($this) {
            var that = this;
            if (!clickFlag) {
                return false;
            }
            clickFlag = false;
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
                that.unable();
                that.areaOption.attr('data-proID', $this.val());
                that.areaOption.attr('data-proName', $this.text());
                // 为动画预留350ms
                setTimeout(function () {
                    $this.css('opacity', '0');
                    divDom.hide();
                    $('#cityCon_' + thisVal).show();
                    that.IScrollEvent('#cityCon_' + thisVal);
                    that.areaBack.attr('conName', 'city');
                    clickFlag = true;
                }, 400);
            } else if (divDom.attr('conName') === 'city') {
                // 城市选择器
                that.areaOption.attr('data-cityID', $this.val());
                that.areaOption.attr('data-cityName', $this.text());
                setTimeout(function () {
                    var count = $('#distCon_' + thisVal).length;
                    if (count > 0) {
                        // 判断是否有区域存在
                        $('#distCon_' + thisVal).show();
                        that.unable();
                        divDom.hide();
                        that.IScrollEvent('#distCon_' + thisVal);
                        that.areaBack.attr('conName', 'dist');
                    } else {
                        // 重置返回为隐藏
                        that.enable();
                        that.areaOption.attr('data-distID', '');
                        that.areaOption.attr('data-distName', '');
                        that.areaBack.hide();
                        that.area.hide();
                        that.cityFlag = true;
                        if ($this.val() != that.areaInfoBak.dataCityId) {
                            that.projName.val('');
                            that.projNameFlag = false;
                            that.confirmProjname();
                        }
                        $('#cityCon_' + that.areaOption.attr('data-proID')).hide();
                        that.areali.removeClass('active').css('opacity', '1');
                    }
                    clickFlag = true;
                }, 400);
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
                    if ($this.val() != that.areaInfoBak.dataDistId) {
                        that.projName.val('');
                        that.projNameFlag = false;
                        that.confirmProjname();
                    }
                    that.areali.removeClass('active').css('opacity', '1');
                    that.areaBack.attr('conName', 'city');
                    clickFlag = true;
                }, 400);
                that.enable();
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
                that.optionInfo.text('请选择您的地区');
                that.areaOption.text('请选择您的地区');
            }
            that.enable();
            that.areali.removeClass('active').css('opacity', '1');
        },

        // 添加滚动
        IScrollEvent: function (name) {
            // 滑动
            var that = this;
            that.posLog = that.refreshPosLog($(name));
            slideFilterBox.refresh(name);
            // 当前筛选菜单下的筛选项
            var $li = $(name).find('li');
            // 筛选项总数
            var length = $li.length;
            // 当前选中筛选项的序数
            var index = $li.filter('.activeS').index();
            // 大于一屏
            if (index > that.posLog.length - 1) {
                slideFilterBox.to(name, -index * that.posLog.height, 2);
                // 最后一屏
                if (length - index < that.posLog.length) {
                    slideFilterBox.to(name, -(length - that.posLog.length) * that.posLog.heigh, 2);
                }
            }
        },
        // 记录筛选框高度和单屏筛选框个数
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
        // 面积【输入时】或者【失去焦点】时候是否符合要求
        houseAreaValidFn: function () {
            var that = this;
            var result = this.validateHouseArea();
            switch (result) {
                case 'tooMuch':
                case 'tooLittle':
                case 'ilegal':
                    that.toast('请填写真实房屋面积');
                    that.houseAreaFlag = false;
                    break;
                case 'legal':
                    that.houseAreaFlag = true;
                    break;
                default:
                    break;
            }
        },
        // 验证房屋面积的正确性
        validateHouseArea: function () {
            var that = this;
            var areaVal = that.houseArea.val();
            // 如果有非法字符过滤掉
            if (!that.areaPattern.test(areaVal)) {
                that.houseArea.val(that.houseArea.val().replace(that.areaPattern, ''));
                areaVal = that.houseArea.val();
            }
            if (parseFloat(areaVal) > 999.99) {
                return 'tooMuch';
            } else if (parseFloat(areaVal) < 1) {
                return 'tooLittle';
            } else if (areaVal.indexOf('.') !== -1 && areaVal.split('.')[1].length > 2) {
                return 'ilegal';
            } else {
                return 'legal';
            }
        },

        // 点击提交按钮提示错误(如果房屋面积、手机号、验证码、城市区域、楼盘名称)
        freeApplyEnable: function () {
            var that = this;
            if (that.houseArea.val() === '') {
                that.toast('请输入您的房屋面积');
            } else if (!that.cityFlag) {
                that.toast('请选择您的地区');
            } else if (!that.projNameFlag) {
                that.toast('请输入您的小区/楼盘');
            } else if (!that.phoneFlag) {
                that.toast('请输入您的手机号');
            } else if (!that.phoneCodeFlag) {
                that.toast('请输入验证码');
            }
            return that.houseAreaFlag && that.cityFlag && that.projNameFlag && that.phoneFlag && that.phoneCodeFlag;
        },

        // 手机号按钮
        telInputFn: function () {
            var that = this;
            // 禁止输入其他
            that.tel.val(that.tel.val().replace(that.noTelPattern, ''));
            if (that.validateTel() === 'legal') {
                if (!/[0-9]{1,2}/.test(that.changeTel.text())) {
                    that.changeTel.removeClass('noClick');
                }
                that.phoneFlag = true;
            } else {
                that.changeTel.addClass('noClick');
                that.phoneFlag = false;
            }
            // 键盘删除手机号后，验证码调出，如果手机号和之前输入的一样，收回验证码
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
                    that.changeTel.removeClass('noClick');
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

        // 更换手机号
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
                    that.changeTel.removeClass('noClick');
                    that.tel.trigger('input');
                }
                time--;
            }, 1000);
        },

        // 验证码格式校验
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
        },

        // 为了方便绑定事件，声明一个阻止页面默认事件的函数
        pdEvent: function (e) {
            e.preventDefault();
        },
        // 禁止页面滑动
        unable: function () {
            var that = this;
            document.addEventListener('touchmove', that.pdEvent);
            // $('.main').css('position', 'fixed');
        },

        // 允许页面滚动
        enable: function () {
            var that = this;
            document.removeEventListener('touchmove', that.pdEvent);
            $('.main').css('position', 'static');
        },

        // 页面滑动看不到报名框则出现浮层
        showUpBoxFn: function () {
            var that = this;
            var applyHeight = parseInt(that.freeApply.offset().top);
            $document.on('scroll', function () {
                if ($document.scrollTop() >= applyHeight) {
                    that.ldUpBoxH.show();
                }
            }).on('scroll.back', function () {
                if ($document.scrollTop() < applyHeight) {
                    that.ldUpBoxH.hide();
                }
            });
        },

        // 免费申请
        freeApplyClickFn: function () {
            var that = this;
            var DH = function () {
                var data;
                var url;
                // 接口所需参数
                data = {
                    RealName: encodeURIComponent(that.houseArea.val().trim()),
                    CityName: encodeURIComponent(that.areaOption.attr('data-cityName')),
                    CityID: that.areaOption.attr('data-cityID'),
                    DistrictName: encodeURIComponent(that.areaOption.attr('data-distName')),
                    DistrictID: that.areaOption.attr('data-distID'),
                    SourcePageID: vars.SourcePageID,
                    SourceObjID: vars.SourceObjID,
                    SubSourceObjID: vars.SubSourceObjID,
                    IsPay: vars.IsPay,
                    Is4s: vars.Is4s,
                    PlatformType: vars.PlatformType,
                    formid: vars.formid,
                    utmSource: vars.remark,
                    zxArea: that.houseArea.val().trim(),
                    estateID: that.projName.attr('data-hid'),
                    estateName: encodeURIComponent(that.inputFormat(that.projName.val()))
                };
                that.submitFlag = false;
                // 用户行为
                yhxw({
                    page: pageId,
                    type: typeId,
                    refpage: document.referrer,
                    area: that.houseArea.val().trim(),
                    projectname: that.inputFormat(that.projName.val()),
                    district: that.areaOption.attr('data-distName'),
                    phone: that.tel.val()
                });
                url = vars.jiajuSite + '?c=jiaju&a=ajaxfreeSignup&r=' + Math.random();
                $.get(url, data, function (q) {
                    that.submitFlag = true;
                    if (q.IsSuccess === '1') {
                        var locationUrl = vars.jiajuSite + '?c=jiaju&a=tyBaomingOption&apply=' + q.UserID + '&city=' + vars.city + '&isKT=' + q.IsCityKT + '&template=' + vars.template;
                        window.location = vars.is_sfapp === '1' ? locationUrl + '&src=client' : locationUrl;
                    } else if (q.ErrorMsg) {
                        that.toast(q.ErrorMsg);
                    } else {
                        that.toast('网络不给力，请刷新重试');
                    }
                }).complete(function () {
                    that.submitFlag = true;
                });
            };
            if (that.vcode.val() !== '') {
                verifycode.sendVerifyCodeAnswer(that.tel.val(), that.vcode.val(),
                    DH,
                    function () {
                        that.toast('验证码错误,请重新登录');
                        that.submitFlag = true;
                    });
            } else {
                DH();
            }
        },

        // 获取剩余可以报名数
        getBMNum: function () {
            var that = this;

            function countDown(from, to) {
                function jj() {
                    if (from >= to) {
                        render(from -= 14);
                        if (from <= to) {
                            render(to);
                        }
                        setTimeout(jj, 20);
                    }
                }

                function render(num) {
                    that.num1.html(Math.floor(num / 100));
                    that.num2.html(Math.floor(num / 10 % 10));
                    that.num3.html(Math.floor(num % 10));
                }
                jj();
            }
            countDown(999, vars.bmCount);
        },

        // 最新的报名的十条
        getNewestBMInfo: function () {
            var that = this;
            $.ajax({
                url: vars.jiajuSite + '?c=jiaju&a=ajaxGetNewApplyUser&city=' + vars.city,
                type: 'get',
                cache: true,
                success: function (data) {
                    if (data) {
                        var i = 0,
                            str = '';
                        for (i = 0; i < 10; i++) {
                            str += '<div class="msg msg' + (i + 1) + '"  style="display: none;">' + '<div class="img"><img src="' + data.ApplyUserList[i].UserLogo + '"/></div>来自' + data.ApplyUserList[i].CityName + '尾号为' + data.ApplyUserList[i].MobileTailNum + '的用户发起了申请<span>' + data.ApplyUserList[i].Time + '</span>' + '</div>';
                        }
                        that.ldMessage.html(str);
                        if (str) {
                            // 随机产生一个1-10随机数
                            // var rand = Math.floor(Math.random() * 10) + 1;
                            for (i = 0; i < 10; i++) {
                                (function (x) {
                                    setTimeout(function () {
                                        // 在随机数基础上顺序循环展示数据
                                        // that.showNewestBMInfo((rand + x) % 10 + 1);
                                        that.showNewestBMInfo(x % 10 + 1);
                                    }, 9000 * x);
                                })(i);
                            }
                        }
                    }
                }
            });
        },

        // 最新报名十条随机展示
        showNewestBMInfo: function (id) {
            var $msg = $('.msg' + id);
            $msg.show().addClass('fadeInUp').siblings().hide();
        },

        // 当页面滚动到某个位置，4个六边形的动态飞入
        scrollHexagonFade: function () {
            var that = this;
            var thisTop;
            var docHeight = $document.height();
            var winHeight = $window.height();
            var scrollHeight = docHeight - winHeight - 100;
            $document.on('scroll', function () {
                thisTop = $document.scrollTop();
                if (thisTop > scrollHeight) {
                    that.hexagonFade('addClass');
                } else if (thisTop < (scrollHeight - 200)) {
                    that.hexagonFade('removeClass');
                }
            });
        },
        hexagonFade: function (vv) {
            var that = this;
            that.ppInfo.find('li').each(function (index) {
                var $that = $(this),
                    fadeFn;
                switch (index) {
                    case 0:
                    case 3:
                        fadeFn = 'fadeInLeft';
                        break;
                    case 1:
                    case 4:
                        fadeFn = 'fadeInRight';
                        break;
                }
                $that[vv](fadeFn);
            });
        },

        /* 当页面滚动到这个位置，三个角从三角形中心飞出*/
        scrollShowTriangle: function () {
            var that = this,
                thisTop,
                scrollHeight = parseInt($('#ldplanImg').offset().top);
            $document.on('scroll', function () {
                thisTop = $document.scrollTop();
                if (thisTop > (scrollHeight - 200)) {
                    that.showTriangle('addClass');
                } else if (thisTop < scrollHeight + 250) {
                    that.showTriangle('removeClass');
                }
            });
        },
        showTriangle: function (vv) {
            var that = this;
            that.ldplan.find('.circle').each(function (index) {
                var $that = $(this);
                var fadeFn;
                switch (index) {
                    case 0:
                        fadeFn = 'bounceInLeft2';
                        break;
                    case 1:
                        fadeFn = 'bounceInLeft';
                        break;
                    case 2:
                        fadeFn = 'bounceInLeft1';
                        break;
                }
                $that[vv](fadeFn);
            });
        },

        // 三角形特效需要跳转字体
        initResize: function () {
            var docEl = $('html'),
                resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
                recalc = function () {
                    var clientWidth = docEl.width();
                    if (!clientWidth) return;
                    if (clientWidth >= 750) {
                        docEl.css('fontSize', '100px');
                    } else {
                        docEl.css('fontSize', 100 * (clientWidth / 750) + 'px');
                    }
                };

            if (!document.addEventListener) return;
            window.addEventListener(resizeEvt, recalc, false);
            recalc();
        },
        // 格式化用户输入
        inputFormat: function (str) {
            var word = str.replace(/[\<\>\(\)\;\{\}\"\'\[\]\/\@\!\,]/g, '');
            return word.replace(/(^\s+)|(\s+$)/g, '');
        },
        // 楼盘输入搜索提示
        projNameInputTip: function () {
            var that = this;
            var keyword = that.inputFormat(that.projName.val());
            that.projNameFloatList.html('');
            that.projNameFlag = false;
            if (keyword.length) {
                that.projNameFlag = true;
                $.get(vars.jiajuSite + '?c=jiaju&a=ajaxGetBJHouseSearchTip&city=' + vars.city + '&keyword=' + keyword + '&cityname=' + that.areaOption.attr('data-cityname') + '&ns=' + that.getNSbyProvinceId(that.areaOption.attr('data-proid')), function (data) {
                    if (data && parseInt(data.allResultNum)) {
                        var num = data.allResultNum > 3 ? 3 : data.allResultNum;
                        var tipStr = '<ul>';
                        for (var i = 0; i < num; i++) {
                            tipStr += '<li><a class="projSearchItem" href="javascript:void(0);" data-hid="' + data.hit[i].newCode + '">' + data.hit[i].title + '</a></li>';
                        }
                        tipStr += '</ul>';
                        that.projNameFloatList.html(tipStr);
                        that.projNameFloat.show();
                        // 显示确定按钮
                        that.projNameConfirm.show();
                    } else {
                        // 显示确定按钮
                        that.projNameConfirm.hide();
                    }
                });
            } else {
                that.projNameConfirm.hide();
            }
        },
        // 确认楼盘名称
        confirmProjname: function () {
            var that = this;
            that.projNameConfirm.hide();
            that.projNameFloatList.html('');
            that.projNameFloat.hide();
        },
        // 根据省份id获取南北方
        getNSbyProvinceId: function (proid) {
            if (parseInt(proid) <= 0 || !proid) {
                return '';
            }
            // 北方省份id列表
            var nPro = [19, 16, 6, 3, 28, 21, 1, 27, 20, 13];
            // var sPro = [12, 33, 30, 24, 25, 29, 4, 9, 5, 15, 11, 17, 7, 26, 31,10, 18, 14, 34, 32, 22, 8, 2, 23];
            if ($.inArray(parseInt(proid), nPro) === -1) {
                return 's';
            } else {
                return 'n';
            }
        }
    };
    module.exports = function bmFreeSignUp() {
        var registerObj = new OrderFn();
        var isEmbed = vars.is_sfapp === '1' ? true : false;
        registerObj.init(isEmbed);
    };
});