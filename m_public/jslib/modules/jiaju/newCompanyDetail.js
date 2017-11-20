/**
 * @file 品牌馆-新版装修公司详情页
 * @author 汤贺翔(tanghexiang@fang.com)
 *         陶旭东(taoxudong@fang.com)
 */
define('modules/jiaju/newCompanyDetail.js', ['jquery','iscroll/2.0.0/iscroll-lite','verifycode/1.0.0/verifycode'],
    function (require, exports, module) {
        'use strict';
        module.exports = function () {
            var $ = require('jquery');
            var iscroll = require('iscroll/2.0.0/iscroll-lite');
            var verifycode = require('verifycode/1.0.0/verifycode');
            var vars = seajs.data.vars;
            var jiajuUtils = vars.jiajuUtils;
            var $datatimeout = $('#datatimeout');
            var $yyFloat = $('.tz-box').eq(1);
            var $telePhone = $yyFloat.find('li').eq(1).find('a');
            var $roomType = $yyFloat.find('li').eq(4).find('input');
            var $lpName = $yyFloat.find('li').eq(3).find('input');
            var $area = $yyFloat.find('li').eq(5).find('input');
            var $submit = $('.bigBtn');
            var $show = $('.show');
            var $maskFixed = $('.sf-maskFixed');
            var $info = $('.info');
            var $telNum = $('.telNum');
            var $mobile = $('.mobile');
            var $getVCode,statusObject,stateObj,canAjax = true;
            var hasCode = vars.mobile ? false : true;
            var $changeMobile = $getVCode = $('.changeMobile,.getVCode');
            var $vCode = $('.vCode');
            var $vCodeNum = $('.vCodeNum');
            var $yyForm = $('.float-form');
            var toastMessage = {
                mobileEmpty: '请输入手机号',
                mobile: '您输入的手机号不正确',
                vCodeEmpty: '请输入验证码',
                vCode: '您输入的验证码不正确'
            };
            if ($datatimeout.length) {
                // 数据请求失败时, 点击刷新
                $datatimeout.on('click', function () {
                    window.location.reload();
                });
            } else {
                // 页面加载成功
                // 案例, 日记, 评论模块Ajax加载 : 加载完成后(隐藏加载中动画, 添加Ajax数据), 接口超时重新加载(删除错误提示, 显示加载中动画)
                var ajaxAddContent = function ($ele) {
                    var url = $ele.data('url');
                    var canAjax = true;
                    return function () {
                        if (canAjax) {
                            canAjax = false;
                            $.get(url + '&r=' + Math.random(), function (data) {
                                if (data) {
                                    var $data = $(data);
                                    $ele.after($data) && $ele.hide();
                                    if ($data.hasClass('contTimeout')) {
                                        $data.on('click', function () {
                                            $data.remove();
                                            $ele.show().trigger('contentLoad');
                                        });
                                    } else {
                                        $data.find('.jiajujump').on('click', function () {
                                            location.href = $(this).data('url');
                                        });
                                    }
                                }
                            }).complete(function () {
                                canAjax = true;
                            });
                        }
                    };
                };
                $('.contentloading').each(function (index, ele) {
                    var $ele = $(ele);
                    $ele.on('contentLoad', ajaxAddContent($ele));
                }).trigger('contentLoad');

                // 提示错误信息
                var toastMsg = function (Msg,flag) {
                    var $send;
                    if(flag) {
                        $send = $('.jj-tsxx');
                        $send.text(toastMessage[Msg] || Msg);
                    } else {
                        $send = $('#sendFloat');
                        var $sendText = $('#sendText');
                        $sendText.text(toastMessage[Msg] || Msg);
                    }
                    $send.show();
                    jiajuUtils.toggleTouchmove(1);
                    setTimeout(function () {
                        $send.hide();
                        jiajuUtils.toggleTouchmove();
                        if(flag) {
                            $yyFloat.hide();
                            window.location.reload();
                        }
                    }, 3000);
                };

                /**
                 * 预约看店点击提交执行方法
                 */
                var submitFn = function () {
                    var data = {
                        companyid: encodeURIComponent(vars.companyid),
                        HouseType: encodeURIComponent($roomType.data('type') ? $roomType.data('type') : ''),
                        EstateName: encodeURIComponent($lpName.val() ? $lpName.val() : ''),
                        Area: encodeURIComponent($area.val() ? $area.val() : ''),
                        refentry: encodeURIComponent(vars.refentry)
                    };
                    var bookUrl = vars.jiajuSite + '?c=jiaju&a=ajaxCompanySignup';
                    $.ajax({
                        type: 'get',
                        url: bookUrl,
                        data: data,
                        complete: function (data) {
                            toastMsg(data && data.responseJSON && data.responseJSON.Message || '预约失败，请重新预约哟~',true);
                            canAjax = true;
                        }
                    });
                };

                /**
                 * 对class=required初始化
                 */
                var initStatus = function () {
                    var statusObj = {
                        allLen: 0,
                        activeLen: 0
                    };
                    $yyForm.find('.required').each(function () {
                        var $this = $(this);
                        var type = $this.data('type');
                        if(type && $this.val()) {
                            statusObj[type] = true;
                            statusObj.activeLen++;
                        }
                        if(!type && $this.text()) {
                            statusObj.activeLen++;
                        }
                        statusObj.allLen++;
                    });
                    statusObject = statusObj;
                    if (statusObj.activeLen === statusObj.allLen) {
                        $submit.removeClass('noClick');
                    } else {
                        $submit.addClass('noClick');
                    }
                };
                // initStatus();
                $submit.removeClass('noClick');

                /**
                 * 更新状态
                 * @param add 验证返回结果
                 * @param type 当前data-type的类型
                 */
                var refreshStatus = function (add, type) {
                    var activeType = type;
                    var statusObj = statusObject;
                    if (statusObj[activeType] ^ add) {
                        statusObj[activeType] = add;
                        statusObj.activeLen += add ? 1 : -1;
                        if (statusObj.activeLen === statusObj.allLen) {
                            $submit.removeClass('noClick');
                        } else {
                            $submit.addClass('noClick');
                        }
                    }
                };

                /**
                 * 手机号和验证码的验证
                 * @param val 号码
                 * @param type data-type类型
                 * @returns {{result: boolean 验证结果, errType: * 错误类型}}
                 */
                var checkInputFn = function (val, type) {
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
                };

                /**
                 * 点击更换手机号方法
                 */
                var changeMobileFn = function () {
                    var toggle = $changeMobile.hasClass('getVCode');
                    $telePhone.toggleClass('changeMobile getVCode disable').text(toggle ? '更换手机号' : '获取验证码');
                    // 更改电话号码的div
                    $telNum.toggle().toggleClass('required');
                    $mobile.toggle().toggleClass('required').val('');
                    $vCode.toggle();
                    $vCodeNum.toggleClass('required').val('');
                    // initStatus();
                    hasCode = !hasCode;
                };

                /**
                 * 手机号input获得焦点或者输入时方法
                 */
                var mobileInputFn = function () {
                    var value = $mobile.val();
                    if (vars.mobile && value === vars.mobile) {
                        changeMobileFn();
                    } else {
                        $changeMobile[stateObj.result ? 'removeClass' : 'addClass']('disable');
                    }
                };

                /**
                 * 手机号或者验证码获得焦点进行验证
                 * @param ele 输入的当前dom元素
                 */
                var inputInputFn = function (ele) {
                    var $ele = $(ele);
                    var value = $ele.val();
                    var type = $ele.data('type');
                    stateObj = checkInputFn(value, type);
                    // refreshStatus(stateObj.result, type);
                    type === 'mobile' && mobileInputFn();
                };

                /**
                 * 输入手机号或者验证码失去焦点方法
                 */
                var inputBlurFn = function () {
                    stateObj.result || toastMsg(stateObj.errType);
                };

                /**
                 * 获取验证码倒计时
                 * @param timePara 倒计时时间
                 */
                var timeRecorder = function (timePara) {
                    var time = timePara;
                    $mobile.prop('disabled', true);
                    $getVCode.addClass('disable');
                    $getVCode.text('发送中(' + time + ')');
                    var handle = setInterval(function () {
                        time--;
                        $getVCode.text('发送中(' + time + ')');
                        if (time === 0) {
                            clearInterval(handle);
                            $mobile.prop('disabled', false);
                            $getVCode.text('重新发送');
                            $getVCode.removeClass('disable');
                        }
                    }, 1000);
                };

                /**
                 * 获取验证码方法
                 */
                var getVerifyCode = function () {
                    if (canAjax && !$getVCode.hasClass('disable')) {
                        canAjax = false;
                        verifycode.getPhoneVerifyCode($mobile.val(), function () {
                            timeRecorder(60);
                            canAjax = true;
                        }, function () {
                            toastMsg('获取验证码失败');
                            canAjax = true;
                        });
                    }
                };
                var checkLogin = function () {
                    var res = true;
                    if (!vars.isLogin) {
                        res = false;
                        window.location.href = '//m.fang.com/passport/login.aspx?burl=' + encodeURIComponent(window.location.href);
                    }
                    return res;
                };


                // 更换手机号,和获取验证码
                $yyFloat.on('click','.changeMobile',function () {
                    changeMobileFn();
                }).on('click','.getVCode',function () {
                    getVerifyCode();
                });
                // 手机号和验证码的输入
                $yyForm.on('input focus','.required',function () {
                    inputInputFn(this);
                });
                //    .on('blur','.required',function () {
                //    inputBlurFn();
                // });
                // 提交
                $submit.on('click',function () {
                    var telNum = $telNum.text();
                    var mobileNum = $mobile.val();
                    var phoneNumber;
                    if($telNum.hasClass('required')) {
                        phoneNumber = telNum;
                    } else {
                        phoneNumber = mobileNum;
                    }
                    if (canAjax) {
                        canAjax = false;
                        if(phoneNumber) {
                            hasCode ? verifycode.sendVerifyCodeAnswer(phoneNumber, $vCodeNum.val(), function () {
                                vars.mobile = $mobile.val();
                                submitFn();
                            }, function () {
                                toastMsg('vCode');
                                canAjax = true;
                            }) : submitFn();
                        } else {
                            canAjax = true;
                            toastMsg('请输入手机号~');
                        }
                    }
                });
                // 预约看店弹出浮层
                $('#bookRoom').on('click', function () {
                    $yyFloat.css('z-index','999');
                    $yyFloat.show();
                });
                // 点击关闭预约看店的浮层
                $('.closeBtn').on('click',function () {
                    $(this).parent().parent().parent().hide();
                });
                // 户型点击事件
                $('.whatever').on('click',function () {
                    var $ele = $(this).find('input');
                    var data = $ele.data('type');
                    var text;
                    $show.children().children().removeClass('activeS');
                    if(data) {
                        text = $('.show').find('li[value =' + data + ']').addClass('activeS').text();
                    } else {
                        text = '选择房屋户型';
                    }
                    $info.html(text);
                    $maskFixed.show();
                    new iscroll('.show', {scrollY: true});
                });
                $show.on('click','li',function () {
                    var $ele = $(this);
                    var value = $ele.val();
                    var text = $ele.text();
                    $roomType.data('type',value).val(text);
                    $ele.addClass('activeS');
                    $maskFixed.hide();
                });
                $maskFixed.on('click',function () {
                    $(this).hide();
                });
                $('.sf-bdmenu').on('click',function (event) {
                    event.stopPropagation();
                    var $ele = $(event.target);
                    if ($ele.hasClass('cancel')) {
                        $(this).parent().hide();
                    }
                });



                // 收藏功能
                var $collect = $('#collect');
                $collect.on('click', (function () {
                    var canAjax = true;
                    return function () {
                        if (canAjax && checkLogin()) {
                            canAjax = false;
                            $.ajax({
                                url: vars.jiajuSite + '?c=jiaju&a=ajaxCompanyCollect&companyid=' + vars.companyid + '&r=' + Math.random(),
                                success: function (data) {
                                    if (!data) {
                                        var Msg = '收藏失败, 请刷新重试';
                                        if ($collect.hasClass('active')) {
                                            Msg = '取消' + Msg;
                                        }
                                        toastMsg(Msg);
                                    } else if (data.IsSuccess === '0') {
                                        toastMsg(data.Message);
                                    } else if (data.IsSuccess === '1') {
                                        $collect.toggleClass('active').html(data.CollectStatus === '1' ? '<i></i>已收藏' : '<i></i>收藏');
                                    }
                                },
                                complete: function () {
                                    canAjax = true;
                                }
                            });
                        }
                    };
                })());
                // im
                $('#jumpIM').on('click', function () {
                    localStorage.setItem(String('h:' + vars.soufunname), encodeURIComponent(vars.companyname) + ';;');
                    checkLogin() && (location.href = vars.imurl);
                });
            }
        };
    });