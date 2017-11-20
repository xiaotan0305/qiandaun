define('modules/jinrong/houseapply', ['jquery'],function (require,exports,module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var part1 = $('div[data-index=1]'),
            part2 = $('div[data-index=2]'),
            part3 = $('div[data-index=3]'),
            salary = $('input[name=salary]'),
            remark = $('textarea[name=remark]'),
            leaveWords = $('span.leaveWords');
        part2.hide();
        part3.hide();
        remark.bind('keyup input',function () {
            var max = 140;
            var length = remark.val().length;
            if (length <= max) {
                leaveWords.text(max - length);
            }
        });
        salary.focus(function () {
            salary.attr('placeholder','');
        });

        $('#showNext').click(function () {
            if (salary.val() === '' || $('input[name=rIsNewHouse]').filter(':checked').val() === undefined
                || $('input[name=rIsFirst]').filter(':checked').val() === undefined) {
                // 判断是否存在:checked元素，不存在val()函数返回undefined
                alert('请回答问题');
            }else {
                part1.hide();
                part2.show();
                part3.hide();
            }
        });
        $('#goback').click(function () {
            part2.hide();
            part3.hide();
            part1.show();
        });
        part2.find('table').on('focus','[placeholder]',function () {
            $(this).attr('placeholder','');
        });

        // 获取短信验证码
        var pattern = /^1[3587]{1}[\d]{9}$/,
            timeCount = 28,
            updateTimer = 0,
            codeButton = $('#codebutton'),
            updateTime = function () {
                codeButton.text(timeCount + '秒后再次获取');
                timeCount--;
                if (timeCount < 0) {
                    clearInterval(updateTimer);
                    codeButton.on('click',checkCode);
                    codeButton.on().text('获取验证码').css('background','#52B21D');
                    timeCount = 28;
                }
            },
            checkCode = function () {
                var phone = $('input[name=userPhone]').val();
                var code = $('input[name=code]').val();
                if (phone !== '' && pattern.test(phone)) {
                    codeButton.css('background','#999999');
                    codeButton.off('click');
                    updateTime();
                    updateTimer = setInterval(function () {
                        updateTime();
                    },1000);
                    $.post(vars.jinrongSite + '?c=jinrong&a=checkCode',{phone: phone,code: code},function () {
                    });
                }else {
                    alert('请正确填写手机号');
                    return false;
                }
            };
        codeButton.on('click',checkCode);


        $('#loanButton').click(function () {
            var code = $('input[name=code]').val();
            var phone = $('input[name=userPhone]').val();
            if ($('input[name=userName]').val() === '') {
                alert('请填写您的称呼');
                $('input[name=userName]').focus();
                return false;
            }
            if (phone === '') {
                alert('请输入您的手机号码');
                $('input[name=userPhone]').focus();
                return false;
            }
            if (code === '') {
                alert('短信验证码不匹配');
                $('input[name=code]').focus();
                return false;
            }
            $.post(vars.jinrongSite + '?c=jinrong&a=checkCode',{phone: phone,code: code},function (data) {
                var dataHandle = $.parseJSON(data);
                if (dataHandle.error === '100') {
                    var userName = $('input[name=userName]').val();
                    var salary = $('input[name=salary]').val();
                    var optVal = $('select[name=optVal]').val();
                    var rIsFirst = $('input[name=rIsFirst]').filter(':checked').val();
                    var rIsNewHouse = $('input[name=rIsNewHouse]').filter(':checked').val();
                    var remark = $('#remarkButton').val();
                    var jsondata = {
                        userName: encodeURIComponent(userName),
                        userPhone: phone,
                        code: code,
                        salary: salary,
                        rIsFirst: rIsFirst,
                        rIsNewHouse: rIsNewHouse,
                        remark: encodeURIComponent(remark),
                        loanMoney: $('input[name=loanMoney]').val(),
                        loanMonth: $('input[name=loanMonth]').val(),
                        cityEName: $('input[name=cityEName]').val(),
                        pId: $('input[name=pId]').val(),
                        pType: $('input[name=pType]').val(),
                        lType: $('input[name=lType]').val(),
                        proName: encodeURIComponent($('input[name=proName]').val()),
                        instName: encodeURIComponent($('input[name=instName]').val()),
                        optVal: optVal,
                        email: encodeURIComponent($('input[name=email]').val())
                    };

                    $.get(vars.jinrongSite + '?c=jinrong&a=ajaxGethouseapply',jsondata,function (data) {
                        var dataHandle = $.parseJSON(data);
                        if (dataHandle.success === '1') {
                            part1.hide();
                            part2.hide();
                            part3.show();
                            $('#codeResult').html(dataHandle.bianhao);
                        }
                    });
                }else {
                    alert('短信验证码不匹配');
                    return false;
                }
            });
        });
    };
});