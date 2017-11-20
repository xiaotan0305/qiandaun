define('modules/myesf/myEsfFbqg', ['jquery'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        $('input[type=hidden]').each(function (index, element) {
            vars[$(this).attr('data-id')] = element.value;
        });
        // @我的二手房 发布求购 页面 js
        if (vars.districtInfo_json === '0') {
            alert('获取地区信息出错，请刷新重新加载');
            return;
        }
        var newcountEsffabu = 0;
        var mobilecodeObj = $('#mobilecode');
        var verCodeObj = $('#ver_code');
        var selectdistrictObj = $('#selectdistrict');
        var selectcomareaObj = $('#selectcomarea');
        var fabuObj = $('#fabu');
        var btnYzmObj = $('#btn_yzm');
        var timeCount = 59;

        if (!vars.userphone || vars.userphone !== mobilecodeObj.val()) {
            verCodeObj.show();
        }
        // 如果修改电话,显示 获取验证码，重新获取验证码
        mobilecodeObj.on('keyup', function () {
            verCodeObj.show();
            if (mobilecodeObj.val() === vars.userphone && vars.userphone !== '') {
                verCodeObj.hide();
                // 電話號與登錄電話相同時，不需輸入驗證碼
            }
        });

        // 选定“目标区域”后，ajax加载“商圈”信息
        function setComarea(index) {
            selectcomareaObj.html('<option value="">商圈</option>');
            if (typeof index === 'object') {
                index = $(this)[0].selectedIndex - 1;
            }
            if (index === '-1') {
                return '';
            }
            var obj = $.parseJSON(decodeURI(vars.districtInfo_json));
            if (obj.hasOwnProperty('0') && typeof obj[0].comareaInfo !== 'undefined') {
                for (var i = 0; i < obj[index].comareaInfo.length; i++) {
                    selectcomareaObj.append('<option value="' + obj[index].comareaInfo[i] + '">' + obj[index].comareaInfo[i] + '</option>');
                }
            }
        }


        function updateTime() {
            btnYzmObj.text('重新发送(' + timeCount + ')');
            timeCount--;
            if (timeCount >= -1) {
                setTimeout(function () {
                    updateTime();
                }, 1000);
            } else {
                btnYzmObj.text('重新获取').bind('click', huoyzm);
                timeCount = 59;
            }
        }

        function huoyzm() {
            var mobile = mobilecodeObj.val();
            var partten = /^(13|14|15|18|17)\d{9}$/;
            // 验证手机号码
            if (mobile !== 'undefined' && mobile !== '' && partten.test(mobile)) {
                var url = vars.mySite + 'index.php?c=myesf&a=ajaxFbqgYzm&mobile=' + mobile + '&city=' + vars.city + '&r=' + Math.random();
                $.getJSON(url, function (data) {
                    if (data.return_result !== '100') {
                        alert(data.error_reason);
                        return false;
                    }
                    btnYzmObj.text('重新发送(60)').unbind('click', huoyzm);
                    setTimeout(function () {
                        updateTime();
                    }, 1000);
                });
            } else {
                alert('手机号错误');
            }
        }

        function fabu() {
            var selectdistrict = encodeURIComponent(selectdistrictObj.val());
            var selectcomarea = encodeURIComponent(selectcomareaObj.val());
            var price = $('#price').val();
            // 输入时已经验证只能是数字
            var room = $('#room').val();
            // 输入时已经验证只能是数字
            var hall = $('#hall').val();
            // 输入时已经验证只能是数字
            var toilet = $('#toilet').val();
            // 输入时已经验证只能是数字
            var buildingarea = $('#buildingarea').val();
            var forward = encodeURIComponent($('#forward').val());
            var floortype = encodeURIComponent($('#floortype').val());
            var houseage = encodeURIComponent($('#houseage').val());
            var title = encodeURIComponent($.trim($('#title').val()));
            var contractperson = encodeURIComponent($.trim($('#contractperson').val()));
            // 联系人
            var gender = encodeURIComponent($('input[name="sir"]:checked').val());
            var mobilecode = mobilecodeObj.val();
            var messagecode = $('#messagecode').val();
            // 验证码
            var description = encodeURIComponent($.trim($('#description').val()));
            var houseid = vars.houseid;
            if (selectdistrict === '' || selectcomarea === '') {
                alert('请确定目标区域不为空');
                return;
            } else if (price === '') {
                alert('价格不能为空');
                return;
            } else if (room === '') {
                alert('室不能为空');
                return;
            } else if (hall === '') {
                alert('厅不能为空');
                return;
            } else if (toilet === '') {
                alert('卫不能为空');
                return;
            } else if (title === '') {
                alert('标题不能为空');
                return;
            } else if (contractperson === '') {
                alert('联系人不能为空');
                return;
            }
            // 是否需要验证验证码
            var isneedverify = '1';
            // $('#ver_code').is(':hidden')当获取验证码按钮是隐藏时其值为true
            if (!messagecode && verCodeObj.is(':hidden')) {
                isneedverify = '0';
            }

            // 短信认证码不能为空
            if (isneedverify === '1' && messagecode === '') {
                alert('短信认证码不能为空');
                return;
            }
            var url = vars.mySite + '?c=myesf&a=ajaxMyEsfFbqg&city=' + vars.city + '&r=' + Math.random();
            var jsondata = {
                contractperson: contractperson,
                mobilecode: mobilecode,
                messagecode: messagecode,
                title: title,
                price: price,
                room: room,
                hall: hall,
                toilet: toilet,
                forward: forward,
                floortype: floortype,
                buildingarea: buildingarea,
                houseage: houseage,
                description: description,
                gender: gender,
                comarea: selectcomarea,
                district: selectdistrict,
                isneedverify: isneedverify,
                houseid: houseid
            };
            fabuObj.unbind('click').removeClass('bg-blu').addClass('bg-gra2');
            $.post(url, jsondata, function (data) {
                if (data === 0 || typeof data !== 'object') {
                    alert('操作失败,请再次尝试');
                    fabuObj.bind('click', fabu).removeClass('bg-gra2').addClass('bg-blu');
                } else {
                    var result = data.houseinfo.result;
                    var message = data.houseinfo.message;
                    if (result === '100') {
                        // 如果发布成功，取得本地存储的手机号
                        var phoneNum = localStorage.getItem('localphone');
                        // 如果还没有进行过发布求购操作，本地手机号没有值，则写入
                        if (!phoneNum) {
                            localStorage.setItem('localphone', mobilecode);
                            // 如果不在，且有手机号，添加到原有手机号后面
                        } else if (messagecode !== '' || mobilecode !== 'undefined') {
                            localStorage.setItem('localphone', phoneNum + ',' + mobilecode);
                        }
                        if (!houseid) {
                            alert('求购发布成功');
                            localStorage.setItem('newcountEsffabu', newcountEsffabu + 1);
                            // 发布成功，跳转
                            window.location = vars.mainSite + 'user.d?m=myesfpage&city=' + vars.city + '&r=' + Math.random();
                        } else {
                            // 编辑成功
                            message = message || '编辑房源成功';
                            alert(message);
                            window.location = vars.mySite + 'index.php?c=myesf&a=myEsfFbgl&city=' + vars.city + '&r=' + Math.random();
                        }
                    } else {
                        // result=’000‘，失败
                        alert(message);
                        fabuObj.bind('click', fabu).removeClass('bg-gra2').addClass('bg-blu');
                    }
                }
            });
            // end of $.get ajax
        }
        //  end of function fabu
        if (vars.comarea !== '') {
            setComarea(selectdistrictObj.find('option:selected')[0].index - 1);
            selectcomareaObj.find('option[value="' + vars.comarea + '"]').attr('selected', true);
        }
        // 目标区域及商圈
        selectdistrictObj.on('change', setComarea);
        // 获得商圈数据

        // 点击 获得验证码 按钮
        btnYzmObj.on('click', huoyzm);

        // 点击 发布 按钮
        fabuObj.on('click', fabu);
    };
    // end of module.exports
});