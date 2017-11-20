/** 二手房特价房OpenHouse --一元看房活动，预约信息提交页面
 * Create by liuxinlu on 2017/04/24.
 * @file 提交房源和用户信息
 */
define('modules/esf/yyhdSubmitOrder', ['iscroll/2.0.0/iscroll-lite'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        // jquery对象
        var $ = require('jquery');
        var iscrollCtrl = require('iscroll/2.0.0/iscroll-lite');
        // 页面数据对象
        var vars = seajs.data.vars;
        // msgFloat 浮层提示框
        var msgFloat = $('#allfloat');

        // 提交信息按钮
        var subBtn = $('.tj-fixed');

        // 姓名输入框
        var nameInput = $('#realname');
        // 电话输入框
        var telInput = $('#phonenum');

        // 同意阅读规则按钮
        var rule = $('#rule');
        $('#yyCon>div').css('padding-bottom','20px');
        $(document).scrollTop(0);
        var box = document.querySelector('.raincont');
        var boxTop = box.offsetTop;
        var dHeight= document.body.offsetHeight - boxTop;
        box.style.height = dHeight - 120 + 'px';
        box.style.overflow = 'auto';
        new iscrollCtrl('#yyCon', {scrollY: true,scrollX: false,click:true,preventDefaultException: { tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/}});
        // 验证姓名和电话
        var verifyInfo = function() {

            if (nameInput.val() === '') {
                showFloat('姓名不能为空');
                return false;
            }

            var pattern = /^1[34578]\d{9}$/;
            var tel = telInput.val();
            if (tel === '') {
                showFloat('手机号码不能为空');
                return false;
            } else if (!pattern.test(tel)) {
                showFloat('手机号码格式不正确');
                return false;
            }
            if (!rule.prop('checked')) {
                showFloat("请勾选我已阅读并同意活动<br>规则");
                return false;
            }
            return true;
        };
        var $yyCon = $('#yyCon');
        $yyCon.css('overflow','hidden');
        $yyCon.find('div').eq(0).css('padding-bottom','5px');
        // 点击协议按钮
        $('.zsgz').on('touchstart',function(){
            var $ele = $(this).find('#rule');
            if (!$ele.prop('checked')) {
                $ele.prop('checked',true);
            } else {
                $ele.prop('checked',false);
            }
        });

        // 解决iscroll中光标移动问题
        $(document).on('touchmove',function(){
            $('input').blur();

        });
        // 解决键盘收起后页面底部多出灰色区域的问题
        $('input').on('blur',function(){
            $(document).scrollTop(0);
        });


        // 点击我知道了收起提示框
        msgFloat.find('span').on('click',function(){
            msgFloat.hide();
        });

        /**
         * 展示提示浮层
         * @param con 提示浮层显示提示语
         */

        var showFloat = function(con) {
            msgFloat.find('p').html(con).end().show();
        };
        var orderno;
        msgFloat.find('.flexbox').on('click',function(){
            if(msgFloat.find('p').html === '预约成功'){
                window.location.href = location.protocol + vars.esfSite + '?a=yyhdOrderInfo&orderno=' + orderno;
            }else{
                msgFloat.hide();
            }
        });
        subBtn.on('click',function(){
            var verify = verifyInfo();
            if (verify) {
                $.ajax({
                    url: vars.esfSite + '?a=ajaxAddYyhdOrder&city=' + vars.city,
                        method:'GET',
                        data:{
                            houseid: vars.HouseId,
		                    phone: telInput.val(),
		                    realname:nameInput.val()
                        },
                    success: function (data) {
                        if (data.errcode === '100') {
                            //showFloat(data.errmsg);
                            //orderno = data.orderno;
                            window.location.href = location.protocol + vars.esfSite + '?a=yyhdOrderInfo&orderno=' + data.orderno + '&city=' + vars.city;
                        }else if (data.errcode === '101') {
                            showFloat(data.errmsg);
                        } else {
                            showFloat('预约失败');
                        }

                    },
                    error: function () {
                        showFloat('提交失败');
                    }
                });
            }
        });
    };
});