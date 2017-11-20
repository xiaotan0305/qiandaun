/**
 * Created by Young on 2016-7-28.
 */
define('modules/jiaju/showActivity', ['jquery', 'lazyload/1.9.1/lazyload', 'verifycode/1.0.0/verifycode'],
    function (require, exports, module) {
        'use strict';
        module.exports = function () {
            var $ = require('jquery');
            var vars = seajs.data.vars;
            var verifycode = require('verifycode/1.0.0/verifycode');
            //惰性加载
            require('lazyload/1.9.1/lazyload');
            $('.lazyload').lazyload();

            var patternTel = /^1[3,4,5,7,8]\d{9}$/;
            var patternCode = /^\d{4}$/;
            var patternAddr = /([^\x00-\xff]|[A-Za-z0-9_])+/;
            var tnow = 60;
            var buy=$("#buy"),changeNum=$("#changeNum"),yan=$("#yan"),phone=$("#phone"),vcode=$("#vcode")
            ,sendcode=$("#sendcode"),address=$('#address'),k=true;
            // 浮层点击
            var guide =  $('#guideFloat');
            $('#guideFloat').on('click', function () {
                guide.hide();
            });
            //点击购买
            buy.on('click',function(){
                //判断是微信打开 就显示浮层将用户引导出去
                //获取判断用的对象
                var ua = navigator.userAgent;
                //在微信中打开
                if (/MicroMessenger/ig.test(ua)){
                    guide.show();
                    // 有浮层时不允许滑动
                    $(document).on('touchmove', function (e) {
                        if (guide.is(':visible')) {
                            e.preventDefault();
                        }
                    });
                } else {
                    if (vars.leftNum == 0 ) {
                        alert("该商品缺货，暂时无法购买！");
                        return false;
                    }else{
                        $("#showorno").show();
                    }
                }
            });
            //点击更换手机
            changeNum.on('click',function() {
                yan.show();
                phone.val("").attr('disabled',false);
            });
            //点击验证码输入框
            vcode.focus(function() {
                $("#codetext").removeClass("tips fc00").text("");
                $(this).attr("style", " ")
            }).blur(function() {
                if (patternCode.test(vcode.val()) === false && vcode.val() != '') {
                    $("#codetext").addClass("tips fc00").text("验证码输入错误，请重新输入");
                    $(this).attr("style", " ");
                }
            });
            //点击手机号输入框
            phone.focus(function() {
                $("#phonetext").removeClass("tips fc00").text("");
                $(this).attr("style", " ");
                changeNum.css("visibility", "visible")
            }).blur(function() {
                if (patternTel.test(phone.val()) === false && phone.val() != '') {
                    $("#phonetext").addClass("tips fc00").text("您输入的手机号码不正确");
                    $(this).attr("style", " ")
                } else {
                    if (phone.val() == vars.phone) {
                        yan.hide();
                    }
                }
            }).change(function() {
                $("#yan").show()
            });
            //点击收货地址
            address.focus(function() {
                $("#addresstext").removeClass("tips fc00").text("");
                $(this).attr("style", " ")
            }).blur(function() {
                if (patternAddr.test(address.val()) === false && address.val() != '') {
                    $("#addresstext").addClass("tips fc00").text("收货地址输入错误，请重新输入");
                    $(this).attr("style", " ");
                }
            });
            //发送验证
            sendcode.on('click',function(){
                if(k==true && $(this).val() == '获取验证码' || $(this).val() == '重新发送'){
                    k=false;
                    var mobilephone = $("#phone").val().trim();
                    if (mobilephone == "") {
                        alert("请输入手机号码！");
                        k=true;
                        return false;
                    }
                    if (patternTel.test(mobilephone)) {
                        verifycode.getPhoneVerifyCode(mobilephone,
                                function () {
                                    setnum();
                                    k=true;
                                },function(){
                                    k=true;
                                });
                    } else {
                        alert("手机号码输入不正确！");
                        k=true;
                        return false;
                    }
                }else{
                    return false;
                }
                
            });
            //验证码倒计时
            function setnum() {
                if (tnow > 0) {
                    sendcode.val("发送中(" + tnow + ")");
                    tnow--;
                    setTimeout(setnum, 1000);
                } else {
                    sendcode.val("重新发送");
                    tnow = 60;
                }
            }
                       //点击购买
            $('#buybutton').on('click',function(){
                var $this=$(this);
                if($this.hasClass('formbtn02')){
                    $this.removeClass('formbtn02').addClass('formbtn03');
                            var phone = $("#phone").val().trim() || "";
                            var code = $("#vcode").val().trim() || "";
                            var num = parseInt($("#select1  option:selected").val());
                            var addr;
                            if (vars.type == '0'){
                                addr = $('#address').val().trim();
                            }
                            if(phone == ""){
                                alert("请输入手机号");
                                $this.removeClass('formbtn03').addClass('formbtn02');
                                return false;
                            }
                            if (!patternTel.test(phone)) {
                                alert("请输入正确的手机号");
                                $this.removeClass('formbtn03').addClass('formbtn02');
                                return false;
                            }
                            if (yan.css("display") != "none" && code == "") {
                                alert("请填写验证码");
                                $this.removeClass('formbtn03').addClass('formbtn02');
                                return false;
                            }
                            if (vars.type == 0){
                                if (!patternAddr.test(addr) || addr.length > 60) {
                                    if(addr.length > 60){
                                        alert("请输入正确的收货地址,最多60个字");
                                    }else{
                                        alert("请输入正确的收货地址");
                                    } 
                                    $this.removeClass('formbtn03').addClass('formbtn02');
                                    return false;
                                }
                            }
                            var order_param = {
                                phone: phone,
                                code: code,
                                type: vars.type,
                                id: vars.productid,
                            };
                            var tmp = function () {
                                var order_url = vars.jiajuSite + "?c=jiaju&a=hdcheckCode&r=" + Math.random();
                                $.get(order_url, order_param, function(j) {
                                    var limit = parseInt(j);
                                   // var l = j.userlogin.username;
                                    //var k = j.userlogin.return_result;
                                    if (num <= limit) {
                                        /* 成功，提交订单信息*/
                                        var ajaxUrl = vars.jiajuSite + '?c=jiaju&a=makeOrder&r=' + Math.random();
                                        var jsondata = {
                                            
                                            city: vars.city,
                                            type: vars.type,
                                            productid:vars.productid,
                                            num:num,
                                            totalnum:vars.totalnum,
                                            addr:encodeURIComponent(addr),

                                        };
                                        $.ajax({
                                            type: 'get',
                                            url: ajaxUrl,
                                            data: jsondata,
                                            success: function (obj) {
                                                if (obj.issuccess === '1') {
                                                    $('#biz_id').val(obj.detail.biz_id);
                                                    $('#call_time').val(obj.detail.call_time);
                                                    $('#charset').val(obj.detail.charset);
                                                    $('#extra_param').val(obj.detail.extra_param);
                                                    $('#invoker').val(obj.detail.invoker);
                                                    $('#notify_url').val(obj.detail.notify_url);
                                                    $('#out_trade_no').val(obj.detail.out_trade_no);
                                                    $('#paid_amount').val(obj.detail.paid_amount);
                                                    $('#platform').val(obj.detail.platform);
                                                    $('#total').val(obj.detail.price);
                                                    $('#quantity').val(obj.detail.quantity);
                                                    $('#return_url').val(obj.detail.return_url);
                                                    $('#service').val(obj.detail.service);
                                                    $('#sign_type').val(obj.detail.sign_type);
                                                    $('#title').val(obj.detail.title);
                                                    $('#trade_amount').val(obj.detail.trade_amount);
                                                    $('#trade_type').val(obj.detail.trade_type);
                                                    $('#user_id').val(obj.detail.user_id);
                                                    $('#version').val(obj.detail.version);
                                                    $('#sign').val(obj.detail.sign);
                                                    $('#origin').val(obj.detail.origin);
                                                    $('#subject').val(obj.detail.subject);
                                                    $('#vcode').val('');
                                                    $('#form').submit();
                                                } else {
                                                    alert(obj.errormessage);
                                                    $('#submit').attr('src', '{/literal}{$sysConfig.imgUrl.jiaju}{literal}other_images/btn1.png');
                                                    $this.removeClass('formbtn03').addClass('formbtn02');
                                                    return false;
                                                }
                                            }
                                        });
                                        /*window.location.href = Url + "?c=jiaju&a=makeOrder&productid=" + productid + "&mobile=" + a + "&num=" + $("#select1  option:selected").val() + "&totalnum=" + totalnum + "&soufunid=" + h + "&r=" + Math.random() + "&city=" + city + "&username=" + l + "&realname=" + i*/
                                    } else {
                                        if (num > limit) {
                                            if (limit != 0) {
                                                alert("您最多可以购买" + limit + "个")
                                            } else {
                                                alert("该手机号购买数量已达上限！")
                                            }
                                            $this.removeClass('formbtn03').addClass('formbtn02');
                                            return false;
                                        }
                                    }
                                })
                            };
                            if (code != "" && yan.css("display") != "none") {
                                verifycode.sendVerifyCodeAnswer(phone, code, tmp
                                        , function () {
                                            alert("验证码错误！");
                                            $this.removeClass('formbtn03').addClass('formbtn02');
                                            return false;
                                        });
                            } else {
                                tmp();
                            }
                }else{
                    return false;
                }             
            });
          
           
        };
    });