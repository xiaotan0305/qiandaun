define('modules/kanfangtuan/baomingNew', ['jquery', 'housegroup/housegroup', 'modules/kanfangtuan/yhxw'], function (require, exports, module) {
    'use strict';
    module.exports = function init() {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var startint = vars.startint;
        var loginphone = $('#phone').val();
        var isvalid = vars.ismvalid;
        var lookhouseID = $('.ljbaoming').attr('lookHouseID');
        var lineID = $('.ljbaoming').attr('LineID');
        var kftUrl = vars.kanfangtuanSite;
        var city = vars.city;
        var myBaomingA;

        // 引入用户行为分析对象-埋码
        var yhxw = require('modules/kanfangtuan/yhxw');
        // 判断详情页种类，传入用户行为统计对象
        var pageId;
        if (vars.action === 'index') {
            // 看房团列表页
            pageId = 'mnhkftlist';
        } else if (vars.action === 'kanDetail') {
            // 看房团详情页
            pageId = 'mnhkftpage';
        } else if (vars.action === 'map') {
            // 看房团地图页
            pageId = 'mnhkftmap';
        }
        // 埋码变量数组
        var maiMaParams = {
            // 页面标识
            'vmg.page': pageId,
            // 看房团路线名称
            'vmn.seehouseline': '',
            // 报名人姓名
            'vmn.name': '',
            // 报名人数
            'vmn.number': '',
            // 报名人手机
            'vmn.phone': ''
        };

        // 阻止页面滑动
        function unable() {
            document.addEventListener('touchmove', preventDefault);
        }

        function preventDefault(e) {
            e.preventDefault();
        }

        // 取消阻止页面滑动
        function enable() {
            document.removeEventListener('touchmove', preventDefault);
        }

        // 立即报名按钮
        $('.main').on('click', '.ljbaoming', function () {
            hideSendCode();
            unable();
            $('#username, #peoplecount, #code').val('');
            $('.tz-box').show();
            myBaomingA = $(this);
            if (isvalid === '1') {
                $('#phone').val(loginphone);
                $('#sendcode').hide();
                $('#codeLi').hide();
            }
            // 看房团列表页取线路id和楼盘id
            if (vars.action === 'index') {
                lineID = $(this).attr('data-lineID');
                lookhouseID = $(this).attr('data-lookHouseID');
            }
            // 埋码变量-线路名称
            maiMaParams['vmn.seehouseline'] = encodeURIComponent($(this).attr('data-seeHouseLine'));
        });

        // 看房团
        var houseGroup = require('housegroup/housegroup');
        var options = {
            // 姓名
            kftname: $('#username'),
            // 报名人数
            kftnum: $('#peoplecount'),
            // 输入手机号
            kftphone: $('#phone'),
            // 获取验证码
            kftcode: $('#sendcode'),
            // 填写验证码
            kftcodewrite: $('#code'),
            // 取消
            kftcancel: $('#qx'),
            // 提交
            kftsubmit: $('#signup'),
            // 显示框信息
            favoritemsg: $('#favoritemsg')
        };
        var houseGroupObj = new houseGroup(options, codefn, showfn);

        // isvalid === '1' 当前账号已绑定手机
        // isvalid === '' 未登录
        // 其余情况是当用户已经登录并且没有绑定手机号时发送绑定手机号的验证码,现在注册都是用手机号
        if (isvalid === '1') {
            $('#phone').val(loginphone);
            $('#sendcode').hide();
            $('#codeLi').hide();
        }
        function hideSendCode() {
            if (loginphone !== '' && $('#phone').val() == loginphone) {
                $('#sendcode').hide();
                $('#codeLi').hide();
            } else {
                $('#sendcode').show();
                $('#codeLi').show();
            }
        }

        // 修改手机号
        $('#phone').on('input', hideSendCode);
        // 验证码发送
        function codefn(phone) {
            $.post(codeUrl,
                {
                    phone: phone,
                    start: startint
                },
                function (data) {
                    var json = $.parseJSON(data);
                    var message = decodeURIComponent(json.error_reason);
                    if (json.return_result !== '100') {
                        alert(message);
                    }
                }
            );
        }

        // 报名提交
        function showfn() {
            var username = $('#username').val();
            var peoplecount = $('#peoplecount').val();
            var phone = $('#phone').val();
            var code = $('#code').val();
            var jsondata = {
                username: encodeURIComponent(username),
                peoplecount: peoplecount,
                phone: phone,
                code: code,
                LookHouseID: lookhouseID,
                LineID: lineID,
                city: city,
                action: vars.action,
                PageURL: encodeURIComponent(window.location.href)
            };
            var ajaxUrl = kftUrl + '?c=kanfangtuan&a=getKanInfo&r=' + Math.random();

            $.get(ajaxUrl, jsondata,
                function (data) {
                    var result = data.baomingMsg.Result;
                    var message = decodeURIComponent(data.baomingMsg.Message);
                    var loginres = data.userlogin;
                    if (loginres) {
                        loginphone = $('#phone').val();
                    }
                    // 报名成功 已报过该看房团
                    if (loginres && (result === '1' || result === '-8')) {
                        $('#favoritemsg').text(message).css('display', 'block');
                        setTimeout(function () {
                            $('#favoritemsg').css('display', 'none');
                            $('.tz-box').css('display', 'none');
                            enable();
                            myBaomingA.text('已报名').unbind('click').removeClass('ljbaoming');
                        }, 1500);
                        // 列表页，详情页,地图页报名有埋码
                        if (result === '1' && pageId) {
                            // 埋码变量
                            maiMaParams['vmn.name'] = encodeURIComponent(username);
                            maiMaParams['vmn.number'] = peoplecount;
                            maiMaParams['vmn.phone'] = phone;
                            // 看房团报名埋码
                            yhxw({type: 33, pageId: pageId, params: maiMaParams});
                        }
                    } else {
                        $('#favoritemsg').text(message).css('display', 'block');
                        setTimeout(function () {
                            $('#favoritemsg').css('display', 'none');
                            $('.tz-box').css('display', 'none');
                            enable();
                        }, 1500);
                    }
                }
            );
        }

        // 取消按钮
        $('#qx').on('click', function () {
            $('.tz-box').hide();
            enable();
        });
    };
});
