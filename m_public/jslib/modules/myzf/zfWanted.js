define('modules/myzf/zfWanted', ['jquery','verifycode/1.0.0/verifycode'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery'), vars = seajs.data.vars;
        $('input[type=hidden]').each(function (index, element) {
            vars[$(this).attr('id')] = element.value;
        });
        var verifycode = require('verifycode/1.0.0/verifycode');

        /* 编辑时初始化状态*/
        $(function () {
            if (vars.houseid != '') {
                $('#districtManual').val(vars.district);
                $('#comareaManual').val(vars.comarea);
            }
        });
        var mobileTag = $('#mobileManual');
        var messagecodeTag = $('#messagecodeManual');

        /* 根据区县获取商圈*/
        $('#districtManual').on('change', function () {
            var area = $('#comareaManual');
            area.html('<option value="">\u5546\u5708</option>');
            var dis_id = $('#districtManual option:selected').attr('dis_id');
            if (dis_id != "") {
                var param = {c: 'myzf', a: 'ajaxGetComarea', dis_id: dis_id};
                $.get(vars.mySite, param, function (data) {
                    if (data) {
                        var str = '';
                        for (var i = 0; i < data.length; i++) {
                            str += "<option value='" + data[i].name + "'>" + data[i].name + "</option>";
                        }
                        area.append(str);
                    }
                }, 'json');
            }
        });

        // 取消非数字的输入
        $('#priceManual,#mobileManual,#messagecodeManual').on('input', function () {
            var me = $(this);
            me.val(me.val().replace(/[\D]/g, ''));
        });
        $("i[name='renttypeRadio']").on('click', function () {
            var me = $(this);
            me.siblings('i').removeClass('select');
            me.addClass('select');
        });
        $("i[name='genderRadio']").on('click', function () {
            var me = $(this);
            me.siblings('i').removeClass('select');
            me.addClass('select');
        });
        // 面积选择
        $('#buildingareaManual').on('input', function () {
            var me = $(this), val = me.val();
            if (!/^\d+\.?\d?$/.test(val)) {
                me.val(val.substring(0, val.length - 1));
            }
        });

        // 验证手机号输入
        var oldPhone = mobileTag.val();
        mobileTag.on('input', function () {
            var me = $(this), ver_code = $('#ver_code');
            me.val(me.val().substring(0, 11).replace(/[\D]/g, ''));
            if (oldPhone != me.val()) {
                ver_code.show();
            } else if (oldPhone != '' & oldPhone == me.val()) {
                ver_code.hide();
            }
        });

        /* 获取验证码按钮点击后显示倒计时*/
        // countdownFlag标志位盘判断待计时器结束才能再次请求接口
        var countdownFlag = true;
        function updateTime() {
            countdownFlag = false;
            var timeCount = 60;
            var huoqu = $('#huoqu');
            huoqu.text('重新发送(' + timeCount + ')');
            var timer = setInterval(function () {
                timeCount--;
                huoqu.text('重新发送(' + timeCount + ')');
                if (timeCount === -1) {
                    countdownFlag = true;
                    clearInterval(timer);
                    huoqu.text('\u83b7\u53d6\u9a8c\u8bc1\u7801');
                    timeCount = 60;
                }
            }, 1000);
        }
        
        /* 获取验证码*/
        $('#huoqu').on('click', function () {
            if ($(this).text() === '\u83b7\u53d6\u9a8c\u8bc1\u7801') {
                var mobilecode = mobileTag.val();
                if (mobilecode === '' || (!/^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$/i.test(mobilecode))) {
                    alert('请输入正确格式的手机号');
                    return false;
                }
                countdownFlag && verifycode.getPhoneVerifyCode(mobilecode, updateTime,function () {
                    // console.log('发送失败');
                });
            }
        });

        /* 信息弹窗*/
        var toolTip = $('#tooltip'), toolTipSpan = $('#tooltip span');

        function toolTipAlert(time, text, href) {
            toolTip.fadeIn('fast');
            toolTipSpan.text(text);
            setTimeout(function () {
                toolTip.fadeOut('fast');
                if (href != '')
                    window.location.href = href;
            }, time)
        }

        /* 发布提交*/
        $('#fabu').on('click', function () {
            var verifySuccess = function () {
                var param = {c: 'myzf', a: 'ajaxPostWanted', 'city': vars.city};
                param['district'] = $('#districtManual').val();
                // 区域
                if ((param['district'] == '') || (param['district'] == '\u533a\u57df')) {
                    alert('请选择区域');
                    return false;
                }
                param['comarea'] = $('#comareaManual').val();
                // 商圈
                if ((param['comarea'] == '') || (param['comarea'] == '\u5546\u5708')) {
                    alert('请选择商圈');
                    return false;
                }
                param['price'] = $('#priceManual').val();
                // 租金
                if ((param['price'] == '') || (param['price'] == '0')) {
                    alert('价格不能为空或0');
                    return false;
                }
                param['renttype'] = $("i[name='renttypeRadio'].select").next("input[name='renttypeManual']").val();// 出租类型
                param['newroom'] = $('#newroomManual').val();
                // 户型
                param['buildingarea'] = $('#buildingareaManual').val();
                // 面积
                if ((param['buildingarea'] == '') || (param['buildingarea'] == '0')) {
                    alert('面积不能为空或0');
                    return false;
                }
                param['title'] = $('#titleManual').val();
                // 标题
                if (param['title'] == '') {
                    alert('请输入标题');
                    return false;
                } else if (param['title'].length < 8 || param['title'].length > 20) {
                    alert('请输入8-20字以内的标题');
                    return false;
                }
                param['description'] = $('#descriptionManual').val();
                // 描述
                if (param['description'] == '') {
                    alert('请输入房源描述');
                    return false;
                } else if (param['title'].length > 500) {
                    alert('请输入500字以内的描述');
                    return false;
                }
                param['contactperson'] = $('#contactpersonManual').val();
                // 联系人
                param['gender'] = $("i[name='genderRadio'].select").next("input[name='genderManual']").val();
                // 性别
                param['mobilecode'] = mobileTag.val();
                // 手机号
                if (param['mobilecode'] == '' || (!/^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$/i.test(param['mobilecode']))) {
                    alert('请输入正确格式的手机号');
                    return false;
                }
                param['messagecode'] = messagecodeTag.val();
                // 验证码
                param['houseid'] = vars.houseid;
                // 房子id
                $.post(vars.mySite, param, function (data) {
                    if (typeof data.result != 'undefined' && data.result == '100') {
                        var href = vars.mySite + '?c=mycenter&a=getFindFangList&city=' + vars.city;
                        toolTipAlert(5000, '发布求租成功', href);
                        // 应该跳转到帮你找房页面
                    } else if (typeof data.message != 'undefined') {
                        toolTipAlert(5000, data.message, '');
                    } else {
                        toolTipAlert(5000, '网络不好哦，请再发布一次', '');
                    }
                }, 'json');
            };
            var verifyError = function () {
                alert('短信验证码验证失败,请尝试重新发送');
            };
            verifycode.sendVerifyCodeAnswer(mobileTag.val(), messagecodeTag.val(), verifySuccess
                , verifyError);
        });
    };
});