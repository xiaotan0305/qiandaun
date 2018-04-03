/**
 * Created on 2017/8/2.
 */
define('modules/jiaju/jcBaoMing', ['jquery', 'verifycode/1.0.0/verifycode', 'slideFilterBox/1.0.0/slideFilterBox'], function (require, exports, module) {
    'use strict';
    var vars = seajs.data.vars;
    var $ = require('jquery');
    var verifycode = require('verifycode/1.0.0/verifycode');
    var slideFilterBox = require('slideFilterBox/1.0.0/slideFilterBox');
    var $window = $(window);
    var $document = $(document);

    function OrderFn() {}

    OrderFn.prototype = {
        init: function (isEmbed) {
            var that = this;
            // isEmbed =true 嵌入页
            that.isEmbed = !!isEmbed;
            //来源地址
            that.reffer = '';
            //如果是被iframe嵌套
            if (self != top) {
                that.reffer = top.location.href;
            } else {
                var burl = !vars.SourcePageUrl ? vars.jiajuSite + vars.city + '/jc/' : vars.SourcePageUrl;
                if (vars.is_sfapp === '1') {
                    burl = burl.indexOf('&src=client') === -1 ? burl + '&src=client' : burl;
                }
                that.reffer = burl;
            }

            /* 用户名称*/
            that.uname = $('#uname');
            // IOS中文输入法带有空格:空格放行
            that.unamePattern = /^([a-zA-Z\u4e00-\u9fa5]+[\s]?)+$/;
            //that.clearInput = $('.off');

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

            /* 所选品类*/
            that.jjNav = $('.jjNav');
            //所选择的品类ids
            that.ids = '';
            //所选择的品类names
            that.names = '';
            //如果没有选择品类，则弹出浮层
            that.selectCateFloat = $('#selectCateFloat');
            that.tzBox = $('.tz-box');
            that.tzCon = $('.tz-con');
            //如果没有选择品类，弹出浮层上的两个按钮
            that.directOrder = $('#directOrder');
            that.directOrderCancel = $('#directOrderCancel');

            /**
             * 成功的浮层
             */
            that.succFloat = $('#succFloat');
            that.succKnow = $('#succKnow');
            that.floatAlert = $('.floatAlert');
            that.alert = $('.alert');

            /**
             * 小手预约按钮
             */
            that.btnOrder = $('.btnOrder');
            /**
             * 选择分类
             */
            that.btnSubmit = $('.btnSubmit');
            //取消重选
            that.btnCancel = $('.btnCancel');


            /**
             * 点击返回按钮浮层
             */
            //返回按钮
            that.back = $('.back');
            //返回按钮点击出来的浮层,及两个按钮
            that.backFloat = $('#backFloat');
            that.backLeave = $('#backLeave');
            that.backLook = $('#backLook');

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
            // 初始化选择的分类
            that.initCates();
            // 解决ios 输入法遮挡toast的问题
            var UA = window.navigator.userAgent;
            if (/iPhone|iPod|iPad/i.test(UA)) {
                that.sendFloat.find('div').css({
                    top: '30%'
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
            // that.clearInput.on('click', function () {
            //     that.uname.val('');
            //     that.clearInput.hide();
            //     that.unameFlag = false;
            //     that.freeApplyEnable();
            // });

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
            // 验证码
            that.vcode.on('blur', function () {
                that.validateVCode(false);
            }).on('input', $.proxy(that.vcodeBlurFn, that));
            //提示浮层之外的灰色蒙层点击让提示框消失
            that.tzBox.on('click', function () {
                that.enable();
                $(this).hide();
            });
            that.tzCon.on('click',function(e){
                e.stopPropagation();
            });
            that.floatAlert.on('click', function () {
                that.enable();
                $(this).hide();
            });
            that.alert.on('click', function (e) {
                e.stopPropagation();
            });
            //验证码浮层
            $(document).on('click', '#phoneDivImgVerify1', function () {
                that.enable();
                $(this).hide();
            });
            $(document).on('click', '#phoneDivImgVerify2', function (e) {
                e.stopPropagation();
            });
            $(document).on('click', '#phoneImgVerifyCodeSubmit', function () {
                that.enable();
            });
            //如果所选品类为空，弹出浮层的两个按钮操作
            that.directOrder.on('click', function () {
                that.selectCateFloat.hide();
                that.enable();
                that.freeApplyClickFn();
            });
            that.directOrderCancel.on('click', function () {
                that.selectCateFloat.hide();
                that.submitFlag = true;
                that.enable();
            });

            //成功预约后，点我知道了
            that.succKnow.on('click', function () {
                that.enable();
                that.succFloat.hide();
                if (self != top) {
                    top.document.location.href = that.reffer;
                } else {
                    window.location = that.reffer;
                }
                return;
            });

            // 免费申请
            that.freeApply.on('click', function () {
                if (that.submitFlag) {
                    that.getCategorys();
                    if (!that.ids) {
                        that.unable();
                        that.selectCateFloat.show();
                        return;
                    }
                    that.freeApplyClickFn();
                }
            });
            //头部的返回按钮,弹出挽留浮层
            that.back.on('click', function () {
               that.backFloat.show();
               that.unable();
            });
            //狠心离开，跳转到上一个页面
            that.backLeave.on('click', function () {
                that.backFloat.hide();
                that.enable();
                if (self != top) {
                    top.document.location.href = that.reffer;
                } else {
                    window.location = that.reffer;
                }
                return;
            });
            that.backLook.on('click', function () {
                that.backFloat.hide();
                that.enable();
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

            // 选择分类操作
            that.btnSubmit.on('click', function () {
                that.jjNav.find('a').addClass('cur');
            });
            that.btnCancel.on('click', function () {
                that.jjNav.find('a').removeClass('cur');
            });
            that.jjNav.on('click', 'a', function () {
                var $that = $(this);
                $that.toggleClass('cur');
            });

            // 页面滚动过报名框，则出现小手
            $document.on('scroll', function () {
                if ($document.scrollTop() >= parseInt(that.freeApply.offset().top)) {
                    that.btnOrder.show();
                }
            }).on('scroll.back', function () {
                if ($document.scrollTop() < parseInt(that.freeApply.offset().top)) {
                    that.btnOrder.hide();
                }
            });
            //点击小手则滑动页面到选项卡的位置
            that.btnOrder.on('click', function () {
                $window.scrollTop(that.jjNav.offset().top);
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
            that.unable();
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
                that.optionInfo.text('请选择您所在的区域');
                that.areaOption.text('请选择您所在的区域');
            }
            that.enable();
            that.areali.removeClass('active').css('opacity', '1');
            that.freeApplyEnable();
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
            // if (that.uname.val()) {
            //     that.clearInput.show();
            // } else {
            //     that.clearInput.hide();
            // }
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
                that.freeApply.removeClass('noClick');
            } else {
                that.freeApply.addClass('noClick');
            }
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
        //获取所选中的品类id和name
        getCategorys: function () {
            var that = this;
            var ids = '', names = '';
            that.jjNav.find('a').each(function () {
                var $that = $(this);
                if ($that.hasClass('cur')) {
                    ids += ',' + $that.attr('data-cid');
                    names += ',' + $that.find('p').text();
                }
            });
            that.ids = ids ? ids.substr(1) : '';
            that.names = names ? names.substr(1) : '';
            if (!that.ids) {
                that.unable();
                that.selectCateFloat.show();
                return;
            }
        },
        //为了方便解绑事件，声明一个阻止页面默认事件的函数
        pdEvent: function (e) {
            e.preventDefault();
        },
        //禁止页面滑动
        unable: function () {
            var that = this;
            window.addEventListener('touchmove', that.pdEvent, {passive: false});
            $('.main').css('position','fixed');
        },
        //允许页面滑动
        enable: function () {
            var that = this;
            window.removeEventListener('touchmove', that.pdEvent, {passive: false});
            $('.main').css('position','static');
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
                    SourcePageUrl: encodeURIComponent(that.reffer),
                    vcode: that.vcode.val(),
                    PlatformType: vars.PlatformType,
                    formid: vars.formid,
                    utmSource: vars.remark
                };
                if (that.ids) {
                    data.categoryIds = that.ids;
                    data.categoryNames = encodeURIComponent(that.names);
                }

                that.submitFlag = false;
                url = vars.jiajuSite + '?c=jiaju&a=ajaxJCBaoMing&r=' + Math.random();
                $.get(url, data, function (q) {
                    that.submitFlag = true;
                    // 判断是否是开通城市
                    if (q.IsCityKT === '1') {
                        // 判断是否报名成功，如果成功跳转报名页选填页，失败提示错误信息
                        if (q.IsSuccess === '1') {
                            that.succFloat.show();
                            that.unable();
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
                }).complete(function () {
                    that.submitFlag = true;
                });
            };
            if (!that.freeApply.hasClass('noClick')) {
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
            }
        },
        // 进入页面默认选中的分类
        initCates: function () {
            var that = this;
            that.jjNav.find('a').each(function () {
                var $that = $(this);
                var cid = $that.attr('data-cid');
                var idArr = vars.ids.split(',');
                // var cidArr = cid.split(',');
                // var cidArrLen = cidArr.length;
                // for (var i=0;i<cidArrLen;i++) {
                //     if ($.inArray(cidArr[i], idArr) !== -1) {
                //         $that.addClass('cur');
                //         continue;
                //     }
                // }
                if ($.inArray(cid, idArr) !== -1) {
                    $that.addClass('cur');
                }
            });
        }
    };


    module.exports = function freeSignup(isEmbed) {
        var registerObj = new OrderFn();
        isEmbed = vars.is_sfapp === '1' ? true : false;
        registerObj.init(isEmbed);
    };
});