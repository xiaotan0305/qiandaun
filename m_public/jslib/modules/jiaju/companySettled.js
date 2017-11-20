/**
 * @fileOverview [公司入驻页]
 * @author [icy<taoxudong@fang.com>]2016-9-12
 */
define('modules/jiaju/companySettled', ['jquery', 'verifycode/1.0.0/verifycode','iscroll/2.0.0/iscroll-lite'], function (require, exports, module) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;
    var jiajuUtils = vars.jiajuUtils;
    var verifycode = require('verifycode/1.0.0/verifycode');
    var iscroll = require('iscroll/2.0.0/iscroll-lite');
    var companySettled = {
        init: function () {
            var that = this;

            //用户信息section
            that.$userInfo = $('#userInfo');
            that.$mobile = that.$userInfo.find('.mobile');
            that.$vCode = that.$userInfo.find('.vCode');
            that.$vCodeNum = that.$userInfo.find('.vCodeNum');
            that.$changeMobile = that.$getVCode = $('.changeMobile,.getVCode');
            that.$company = that.$userInfo.find('.clearInp input');

            that.$decorationDiv = $('#case');
            that.$decoration = $('.state');
            that.$decorationInfo = that.$decoration.find('.info');
            that.$decorationType = that.$decoration.find('.show');

            that.$regionDiv = $('#region');
            that.$region = $('.area');
            that.$regionInfo = that.$region.find('.info');
            that.$regionCity = $('#cityCon');
            that.$regionDistrict = $('#districtCon');
            that.$regionBack = $('#areaBack');

            that.$maskFixed = $('.sf-maskFixed');
            that.$bdmenu = $('.sf-bdmenu');

            // off按钮
            that.$off = $('.off');
            // 确认提
            that.$submit = $('#submit');
            // toast提示
            that.$sendFloat = $('#sendFloat');
            that.$sendText = $('#sendText');
            that.$jjxx = $('.jj-tsxx');
            that.toastMsg = {
                companyEmpty: '请输入公司名称',
                mobileEmpty: '请输入手机号',
                mobile: '您输入的手机号不正确',
                vCodeEmpty: '请输入验证码',
                vCode: '您输入的验证码不正确',
                brandEmpty: '请输入品牌名称'
            };
            that.regionSelect = [];
            // 初始化状态
            that.canAjax = true;
            that.hasCode = vars.mobile ? false : true;
            that.mobile = vars.mobile ? vars.mobile : '';
            that.data = {};
            that.initStatus();
            that.bindEvent();
        },
        bindEvent: function () {
            var that = this;
            // 数据请求失败时, 点击刷新
            $('#timeout').on('click', function () {
                window.location.reload();
            });
            // ******************页面初始化
            that.$submit.addClass('active');

            // 用户信息sectionEvent
            // .changeMobile和getVCode都是动态绑定的
            // 修改手机号
            that.$userInfo.on('click', '.changeMobile', $.proxy(that.changeMobileFn, that));
            // 获取验证码
            that.$userInfo.on('click', '.getVCode', $.proxy(that.getVerifyCode, that));
            that.$userInfo.on('focus input', '.required', function () {
                that.inputInputFn(this);
            });
            // 提交订单
            that.$submit.find('a').on('click', $.proxy(that.submitClickFn, that));

            // off按钮事件
            that.$off.on('click', function () {
                that.offClickFn(this);
            });
            that.$off.next().on('input', that.offToggle);
            // 区域选择和装修类型选择点击浮层消失
            that.$maskFixed.on('click',function () {
                $(this).hide();
            });
            that.$bdmenu.on('click',function (event) {
                that.cancelClickFn(event);
            });
            // 弹出城市区域和装修选择浮层
            that.$decorationDiv.on('click',function () {
                that.infoShow(this,that.$decorationInfo);
            });
            that.$regionDiv.on('click',function () {
                that.infoShow(this,that.$regionInfo);
                that.activeScroll = that.$regionCity[0];
                that.IScrollEvent();
            });
            // 装修类型选择
            that.$decorationType.on('click','li',function () {
                that.dectypeClickFn(this);
            });
            // 城市区域选择城市选择
            that.$regionCity.on('click','li',function () {
                if(that.canAjax) {
                    that.canAjax = false;
                    this.addEventListener('webkitAnimationEnd',function () {
                        that.animationEnd(this);
                    });
                    that.cityClickFn(this);
                }
            });
            // 城市区域选择区域选择
            that.$regionDistrict.on('click','li',function () {
                if(that.canAjax) {
                    that.canAjax = false;
                    that.cityClickFn(this);
                }
            });
            // 返回按钮
            that.$regionBack.on('click', $.proxy(that.backClickFn,that));
        },

        /**
         * 初始化验证信息
         */
        initStatus: function () {
            var that = this;
            var $required = that.$userInfo.find('.required');
            $.each($required,function (index,dom) {
                var statusObj = {};
                var $dom = $(dom);
                var val = $dom.val();
                var type = $dom.data('type');
                statusObj.result = val ? true : false;
                statusObj.errType = val ? null : type + 'Empty';
                that.data[type] = statusObj;
            });
            // 验证码更改状态
            if(that.$vCode.is(':hidden')) {
                that.data['vCode'] = {
                    result: true,
                    errType: null
                };
            }
        },

        /**
         * 浮层点击取消
         * @param event
         */
        cancelClickFn: function (event) {
            var that = this;
            event.stopPropagation();
            var $ele = $(event.target);
            if ($ele.hasClass('cancel')) {
                that.$maskFixed.hide();
                that.areaOriginalFn(true);
            }
        },

        /**
         * 浮层点击返回
         */
        backClickFn: function () {
            var that = this;
            that.$regionDistrict.parent().hide();
            that.$regionBack.hide();
            that.$regionCity.parent().show();
            that.$regionInfo.text(that.regionSelect[0]);
            that.$regionDiv.text(that.regionSelect[0]);
            that.regionSelect.length = 0;
        },

        /**
         * 登录状态下点击更换手机号
         */
        changeMobileFn: function () {
            var that = this;
            var toggle = that.$changeMobile.hasClass('getVCode');
            // 按钮更换类名，文案，是否可以点击
            that.$changeMobile.toggleClass('changeMobile getVCode').text(toggle ? '更换手机号' : '获取验证码')[toggle ? 'addClass' : 'removeClass']('active');
            // 手机号input是否disable,是否存值
            that.$mobile.prop('disabled', toggle);
            toggle || that.$mobile.val('');
            // 验证码input是否可见，更换类名
            that.$vCode.toggle();
            that.$vCodeNum.toggleClass('required').val('');
            that.hasCode = !that.hasCode;
            that.data['mobile'].result = toggle ? true : false;
            that.data['mobile'].errType = toggle ? null : 'mobileEmpty';
            that.data['vCode'].result = toggle ? true : false;
            that.data['vCode'].errType = toggle ? null : 'vCodeEmpty';
        },
        mobileInputFn: function () {
            var that = this;
            var value = that.mobile;
            if (vars.mobile && value === vars.mobile) {
                that.changeMobileFn();
            } else {
                that.$changeMobile[that.data['mobile'].result ? 'addClass' : 'removeClass']('active');
            }
        },
        inputInputFn: function (ele) {
            var $ele = $(ele);
            var that = this;
            var value = $ele.val();
            var type = $ele.data('type');
            var state = that.checkInputFn(value, type);
            that[type] = value;
            that.data[type] = state;
            type === 'mobile' && that.mobileInputFn();
        },
        inputBlurFn: function () {
            var that = this;
            that.state.result || that.toast(that.state.errType);
        },
        // 获取验证码
        getVerifyCode: function () {
            var that = this;
            if (that.canAjax && that.$getVCode.hasClass('active')) {
                that.canAjax = false;
                verifycode.getPhoneVerifyCode(that.mobile, function () {
                    that.timeRecorder(60);
                    that.canAjax = true;
                }, function () {
                    that.toast('获取验证码失败');
                    that.canAjax = true;
                });
            }
        },
        // 倒计时
        timeRecorder: function (timePara) {
            var that = this;
            var time = timePara;
            that.$mobile.prop('disabled', true);
            that.$getVCode.removeClass('active');
            that.$getVCode.text('发送中(' + time + ')');
            var handle = setInterval(function () {
                time--;
                that.$getVCode.text('发送中(' + time + ')');
                if (time === 0) {
                    clearInterval(handle);
                    that.$mobile.prop('disabled', false);
                    that.$getVCode.text('重新发送');
                    that.$getVCode.addClass('active');
                }
            }, 1000);
        },

        // off
        offClickFn: function (ele) {
            $(ele).hide().next().val('');
        },
        offToggle: function () {
            var $this = $(this);
            $this.prev()[$this.val() ? 'show' : 'hide']();
        },

        /**
         * 确认提交
         */
        submitClickFn: function () {
            var that = this;
            if(that.canAjax) {
                that.canAjax = false;
                var companyname = that.$company.eq(0).val();
                var brandname = that.$company.eq(1).val();
                var cityname = that.$regionDiv.data('cityname');
                var ReginName = that.$regionDiv.data('districtname');
                var decorationtype = that.$decorationDiv.data('case');
                var submitData = {
                    companyname: encodeURIComponent(companyname),
                    brandname: encodeURIComponent(brandname),
                    cityname: encodeURIComponent(cityname),
                    RegionName: encodeURIComponent(ReginName),
                    DecorationTypeID: encodeURIComponent(decorationtype)
                };
                if(companyname) {
                    if(brandname) {
                        if(ReginName.trim()) {
                            if(that.data['mobile'].result) {
                                if(that.hasCode) {
                                    if(that.data['vCode'].result) {
                                        verifycode.sendVerifyCodeAnswer(that.mobile, that.vCode, function () {
                                            vars.mobile = that.mobile;
                                            that.changeMobileFn();
                                            that.submit(submitData);
                                        }, function () {
                                            that.toast('vCode');
                                            that.canAjax = true;
                                        });
                                    } else {
                                        that.toast(that.data['vCode'].errType);
                                        that.canAjax = true;
                                    }
                                } else {
                                    that.submit(submitData);
                                }
                            } else {
                                that.toast(that.data['mobile'].errType);
                                that.canAjax = true;
                            }
                        } else {
                            that.toast('请选择区域~');
                            that.canAjax = true;
                        }
                    } else {
                        that.toast('请输入品牌名称');
                        that.canAjax = true;
                    }
                } else {
                    that.toast('请输入公司名称');
                    that.canAjax = true;
                }
            }
        },
        // 收银台跳转
        submit: function (submitData) {
            var that = this;
            $.ajax({
                type: 'get',
                url: vars.jiajuSite + '?c=jiaju&a=ajaxCompanySettled',
                data: submitData,
                success: function (obj) {
                    if (+obj.IsSuccess === 1) {
                        that.toast('提交成功，随后小房将与您电话联系，请注意接听哦~',true);
                        window.location = vars.listUrl;
                    } else {
                        that.toast(obj.Message,true);
                    }
                },
                complete: function () {
                    that.canAjax = true;
                }
            });
        },

        // 输入内容校验
        checkInputFn: function (val, type) {
            var checks = {
                mobile: /^1[34578][0-9]{9}$/,
                vCode: /^\d{4}$/
            };
            var result = !!val.length;
            var errType = result ? null : type + 'Empty';
            if (checks[type] && result) {
                result = checks[type].test(val);
                errType = result ? errType : type;
            }
            return {
                result: result,
                errType: errType
            };
        },
        toast: function (msgType,flag,cb) {
            var that = this;
            var $send;
            if(flag) {
                that.$jjxx.text(that.toastMsg[msgType] || msgType);
                $send = that.$jjxx;
            } else {
                that.$sendText.text(that.toastMsg[msgType] || msgType);
                $send = that.$sendFloat;
            }
            $send.show();
            jiajuUtils.toggleTouchmove(1);
            that.toastTime && clearTimeout(that.toastTime);
            that.toastTime = setTimeout(function () {
                $send.hide();
                jiajuUtils.toggleTouchmove();
                cb && cb();
            }, 2000);
        },

        /**
         * 展示浮层
         * @param ele 当前点击的divdom元素
         * @param $info 要展示的浮层jquery元素
         */
        infoShow: function (ele,$info) {
            var $ele = $(ele);
            var data = $ele.data();
            var turnData;
            var caseArr = ['全部','整装','局部'];
            if(data && data.cityname) {
                turnData = data.cityname + ' ' + (data.districtname.trim() ? data.districtname : '全部');
            } else {
                turnData = caseArr[+data.case];
            }
            $info.text(turnData);
            $info.parent().parent().parent().show();
        },

        /**
         * 装修类型点击选择方法
         * @param ele 当前点击的装修类型，包括全部，整装，局部等
         */
        dectypeClickFn: function (ele) {
            var that = this;
            var $ele = $(ele);
            that.$decorationDiv.data('case',$ele.val()).text($ele.text());
            $ele.addClass('activeS').siblings().removeClass('activeS');
            that.$decoration.hide();
        },

        /**
         * 城市区域选择中选择城市和区域方法
         * @param ele 当前选中的城市dom
         */
        cityClickFn: function (ele) {
            var that = this;
            var $ele = $(ele);
            var text = $ele.text();
            var key = $ele.val();
            // 首先选择数据备份
            that.regionSelect.push(text);
            // 更新div和标题数据
            var nowData = that.regionSelect[0] + ' ' + (that.regionSelect[1] ? that.regionSelect[1] : '');
            that.$regionDiv.text(nowData);
            that.$regionInfo.html(nowData);
            if(that.regionSelect.length === 1) {
                // ajax请求城市对应的区域数据
                that.$regionCity.find('li').removeClass('activeS');
                $ele.addClass('active');
                that.ajaxDistrictFn(key);
            } else {
                that.$regionDistrict.children().children().removeClass('activeS');
                $ele.addClass('activeS');
                that.$regionDistrict.children().html();
                // 更新原始数据
                that.$regionDiv.data('cityname',that.regionSelect[0]).data('districtname',that.regionSelect[1]);
                // area浮层初始化数据
                that.areaOriginalFn();
            }
        },

        /**
         * 所选中的城市在animationEnd中的回调函数
         * @param ele 当前选中的城市dom
         */
        animationEnd: function (ele) {
            var that = this;
            $(ele).removeClass('active').addClass('activeS');
            that.$regionCity.parent().hide();
            that.$regionBack.show();
            that.$regionDistrict.parent().show();
            that.activeScroll = that.$regionDistrict[0];
            that.IScrollEvent();
            setTimeout(function () {
                that.canAjax = true;
            },300);
        },

        /**
         * 根据城市信息ajax请求区域信息数据
         * @param key 选择的城市id
         */
        ajaxDistrictFn: function (key) {
            var that = this;
            $.ajax({
                type: 'get',
                url: vars.jiajuSite + '?c=jiaju&a=ajaxGetDis&cityid=' + key,
                success: function (obj) {
                    if(obj) {
                        that.$regionDistrict.children().html(obj);
                    }
                }
            });
        },

        /**
         * 城市区域选择完毕或者点击取消后初始化浮层插件
         * @param flag 标记位，点击取消为true
         */
        areaOriginalFn: function (flag) {
            var that = this;
            if(flag) {
                // 获取原始数据
                var data = that.$regionDiv.data();
                var turnData = data.cityname + ' ' + (data.districtname.trim() ? data.districtname : '全部');
                that.$regionDiv.text(turnData);
            }
            that.$region.hide();
            that.$regionCity.parent().show();
            that.$regionDistrict.parent().hide();
            that.$regionBack.hide();
            that.regionSelect.length = 0;
            setTimeout(function () {
                that.canAjax = true;
            },300);
        },
        // iscroll滚动
        IScrollEvent: (function () {
            var eleList = [];
            var isList = [];
            return function () {
                // 滑动
                var that = this;
                that.posLog = that.refreshPosLog();
                var is;
                var ele = that.activeScroll;
                var index = $.inArray(ele, eleList);
                if (index === -1) {
                    is = new iscroll(ele);
                    eleList.push(ele);
                    isList.push(is);
                } else {
                    is = isList[index];
                    is.refresh();
                }
                //当前筛选菜单下的筛选项
                var $li = $(ele).find('li');
                // 筛选项总数
                var length = $li.length;
                // 当前选中筛选项的序数
                var itemIndex = $li.filter('.activeS').index();
                // 大于一屏
                if (itemIndex > that.posLog.length - 1) {
                    is.scrollTo(0, -itemIndex * that.posLog.height);
                    // 最后一屏
                    if (length - itemIndex < that.posLog.length) {
                        is.scrollTo(0, -(length - that.posLog.length) * that.posLog.height);
                    }
                }
            };
        })(),
        // 记录筛选项高度和单屏筛选框个数
        refreshPosLog: (function () {
            // 只执行一次
            var isFirst = 1;
            var posLog = {};
            return function () {
                if (isFirst) {
                    var that = this;
                    var $filterMenu = $(that.activeScroll);
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
        })()
    };
    module.exports = companySettled;
});