/**
 * Created with webstorm.
 * User: tkp19
 * Date: 2016/2/23 0023
 * Time: 11:13
 */
define('modules/xf/shopinfoComplaints', ['jquery', 'housegroup/housegroup', 'util/util'],
    function (require) {
        'use strict';
        var $ = require('jquery'),
            houseGroup = require('housegroup/housegroup'),
            util = require('util/util');
        var vars = seajs.data.vars;

        var content = $('#content'),
            initText = '';

        var txtnum = $('#txtnum');
        var codewrite = $('#codewrite');
        var title = $('#title');
        // 获取页面字数限制
        vars.limitNum = txtnum.html().split('/')[1] | 0;
        // 输入内容
        var text = decodeURIComponent(util.getCookie('content_text')).replace('<br>', '');
        if (text) {
            if (content.hasClass('ts')) {
                content.removeClass('ts');
            }
            // 字数
            txtnum.html(content.text().length + '/' + vars.limitNum);
            initText = '请详细描述置业顾问对您服务不好的地方，我们会及时解决。';
        } else {
            initText = content.text();
        }
        content.on('click', function () {
            $(this).focus();
        });
        // 获取焦点时判断是否输入过内容
        content.on('focus', function () {
            var me = $(this);
            var text = decodeURIComponent(util.getCookie('content_text')).replace('<br>', '');
            if (!text) {
                me.html('');
            }

            // 改变字体颜色
            if (me.hasClass('ts')) {
                me.removeClass('ts');
            }
        });

        // 失去焦点时，设置cookie记录内容
        content.on('blur', function () {
            var me = $(this);
            var contentTxt = me.html().replace('<br>', '').replace(/<div>/g, '<br>').replace(/<\/div>/g, '');
            if (!me.text()) {
                me.html(initText).addClass('ts');
                util.setCookie('content_text', '', -1);
            } else {
                util.setCookie('content_text', encodeURIComponent(contentTxt), 1);
            }

            // 改变字体颜色
            if (!contentTxt && !me.hasClass('ts')) {
                me.addClass('ts');
            }
        });


        /**
         * 光标移到最后函数
         * @param obj 编辑框原生对象
         */
        function moveEnd(obj) {
            obj.focus();
            var sel = null,
                len = obj.innerText.length;
            if (document.createRange) {
                // 高级浏览器
                sel = window.getSelection();
                var range = document.createRange();
                range.selectNodeContents(obj);
                range.collapse(false);
                sel.removeAllRanges();
                sel.addRange(range);
            } else {
                // IE低版本
                sel = document.selection.createRange();
                sel.moveStart('character', len);
                sel.collapse();
                sel.select();
            }
        }

        // 输入字数统计
        content.on('input', function () {
            var me = $(this),
                text = me.html().replace('<br>', '').replace(/<div>/g, '<br>').replace(/<\/div>/g, ''),
                len = me.text().length;

            var brLen = text.match(/<br>/g) ? text.match(/<br>/g).length : 0;
            if (len > vars.limitNum) {
                // 4:一个<br>标签的字符个数
                me.html(text.substring(0, vars.limitNum + 4 * brLen));
                moveEnd(this);
            } else if (me.text()) {
                util.setCookie('content_text', encodeURIComponent(text), 1);
            }
            // 三元表达式的目的：解决手机中文输入法一次性输入过多导致超出字数限制的情况出现字数不变的情况发生
            txtnum.html((len > vars.limitNum ? vars.limitNum : len) + '/' + vars.limitNum);
            if (!text) {
                initText = '请详细描述置业顾问对您服务不好的地方，我们会及时解决。';
            }
        });

        // 清空手机号
        var clear = $('#clear');
        var phone = $('#phone');
        clear.on('click', function () {
            phone.val('');
            $(this).addClass('none');
        });

        // 清空验证码
        codewrite.on('focus', function () {
            var me = $(this),
                val = me.val();
            if (val && val.length === 6) {
                me.val('');
            }
        });

        // 手机号清空按钮控制
        phone.on('input focus blur', function () {
            var val = $(this).val(),
                hasNone = clear.hasClass('none');
            if (val && parseInt(val) > 0 && hasNone) {
                clear.removeClass('none');
            } else if (!val && !hasNone) {
                clear.addClass('none');
            }
        });

        // 调用发送验证码、提交插件
        var options = {
            // 输入手机号
            phone: $('#phone'),
            // 获取验证码
            code: $('#code'),
            // 填写验证码
            codewrite: $('#codewrite'),
            // 提交
            submit: $('#submit')
        };
        var house = new houseGroup(options, function (data) {
            $.ajax({
                url: '/xf.d?m=zygwComplaints',
                type: 'POST',
                data: {
                    userid: vars.userid,
                    contents: encodeURIComponent(content.text()),
                    title: encodeURIComponent(title.val()),
                    mobile: data.phone,
                    zygwid: vars.zygwid
                },
                dataType: 'json',
                success: function (data) {
                    var root = data.root,
                        result = root.result,
                        message = root.message;
                    if (result === '21300') {
                        house.showMessage('我们已收到您的投诉，将尽快解决处理');
                        // 清空所有东西
                        content.html(initText).addClass('ts');
                        phone.val('');
                        codewrite.val('');
                        txtnum.html('0/' + vars.limitNum);
                        util.delCookie('content_text');
                        location.href = 'zygwshopinfo/' + vars.city + '_' + vars.zygwid + '_' + vars.newcode + '/';
                    } else if (message) {
                        house.showMessage(message);
                    } else {
                        house.showMessage('提交失败');
                    }
                },
                fail: function () {
                    house.showMessage('网络请求失败');
                }
            });
        });
    });