/**
 * @file 迁移答题页答案格式验证及提交
 * @author 赵天亮(zhaotianliang@fang.com)
 *         李建林(lijianlin@fang.com)
 */
define('modules/survey/question', ['jquery', 'iscroll/2.0.0/iscroll-lite', 'weixin/2.0.0/weixinshare'], function (require) {
    'use strict';
    var $ = require('jquery');
    var iscroll = require('iscroll/2.0.0/iscroll-lite');
    var vars = seajs.data.vars;
    var wx = require('weixin/2.0.0/weixinshare');

    function Survey() {
        var that = this;
        // 禁止滑动
        that.nopan = false;
        // 防止重复点击
        that.isSub = false;
        // 电话正则
        that.phoneReg = /^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$/i;
        // 邮箱正则
        that.emailReg = /^[_a-zA-Z\d\-\.]+@[_a-zA-Z\d\-]+(\.[_a-zA-Z\d\-]+)+$/;
        // 身份证正则
        that.IDCardReg = /^[1-9]\d{16}[x\d]$|^[1-9]\d{14}$/;
        that.init(true);
    }

    Survey.prototype = {
        constructor: Survey,
        /**
         * 初始化操作
         * @param k Boolean true: 首次进入页面  false: 非首次进入页面
         */
        init: function (k) {
            var that = this;
            // 微信分享配置
            var strTitle = '——房天下调查',
                title = $('.main h2').html(),
                strDescription = '参与房天下调查 选择你心中的最佳答案！',
                description = $('meta[name="description"]').length ? $('meta[name="description"]')[0].content : '',
                imgurl = location.protocol + vars.public + '201511/images/default-question.jpg',
                finalDesc = description ? description : strDescription;
            new wx({
                debug: false,
                shareTitle: title + strTitle,
                descContent: finalDesc,
                lineLink: location.href,
                imgUrl: imgurl
            });

            // 题信息
            that.selectString = '';
            that.selectall = false;
            // 个人信息
            that.userinfostring = '';
            that.userinfoall = false;
            that.select = {};
            // 最终提交字符串
            that.endString = '';
            if (k) {
                that.userinfo = {};
                that.initEvent();
            }
        },

        /**
         * 首次进入页面初始化事件
         */
        initEvent: function () {
            var that = this;
            var userinfoList = $('.xx-list');
            that.userinfoId = userinfoList.attr('data-id');
            // 信息弹层
            that.msg = $('#msg');
            that.msgP = that.msg.find('div');
            that.timer = null;

            /**
             * 过期提醒
             */
            if (vars.delayFlag === 'false') {
                that.showMsg('投票已过期!', 3000);
            }

            /**
             * 弹出层操作时阻止默认滚动时间
             */
            document.addEventListener('touchmove', function (e) {
                if (that.nopan) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            }, false);

            /**
             * 文字较多时 点击取消隐藏
             */
            // 显示更多字
            var more = $('#more'),
                less = $('#less'),
                oP = $('.dc-int p');
            // 设置最高为110px;
            if (oP.height() >= 111) {
                more.show();
            }
            more.on('click', function () {
                var oP = $(this).prev();
                oP.css('max-height', 'none');
                more.hide();
                less.show();
            });
            // 收起
            less.on('click', function () {
                var oP = $(this).prev().prev();
                oP.css('max-height', '111px');
                more.show();
                less.hide();
            });

            // 字数限制
            function txtLimit(txt, text) {
                txt.hasfocus || txt.focus();
                var range, node;
                if (window.getSelection && window.getSelection().getRangeAt) {
                    txt.text('');
                    range = window.getSelection().getRangeAt(0);
                    range.collapse(false);
                    node = range.createContextualFragment(text);
                    var lc = node.lastChild;
                    range.insertNode(node);
                    if (lc) {
                        range.setEndAfter(lc);
                        range.setStartAfter(lc);
                    }
                    var selection = window.getSelection();
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
                else {
                    txt.text(text);
                }
            }

            // 字数显示
            // 简答题
            $('.min150').on('input', function () {
                checkLength($(this),150);
            });
            // 选择题
            $('.minH80').on('input', function () {
                checkLength($(this),30);
            });
            function checkLength(obj,fontnum) {
                var reminder = obj.siblings('.txtnum');
                var txt = obj;
                var textInput = txt.text().trim();
                var textLength = textInput.length;
                if (textLength === 0) {
                    reminder.html('0/' + fontnum);
                } else if (textLength >= 1 && textLength <= fontnum) {
                    reminder.html(textLength + '/' + fontnum);
                } else if (textLength > fontnum) {
                    txtLimit(txt, textInput.substr(0, fontnum));
                    reminder.html(fontnum + '/' + fontnum);
                }
            }

            // 单选多选其它选项事件
            var others = $('.other');
            others.on('change',function () {
                var me = $(this);
                if (me[0].type === 'checkbox') {
                    if (me.is(':checked')) {
                        me.parent().siblings('div').show().find('.textarea')[0].focus();
                    }else {
                        me.parent().siblings('div').hide();
                    }
                }else if (me[0].type === 'radio') {
                    if (me.is(':checked')) {
                        me.parent().siblings('div').show().find('.textarea')[0].focus();
                    }
                    me.parent().siblings('p').children('input').on('change',function () {
                        me.parent().siblings('div').hide();
                    });
                }
            });
            /**
             * 地区选择
             */
            // 地区
            var city = $('#city'),
                provinceTc = $('#tc_province'),
                provinceCan = $('#provinceCan'),
                provinceUl = $('#provinceUl'),
                cityTc = $('#tc_city'),
                cityCan = $('#cityCan'),
                cityUl = $('#cityUl'),
                noCity = ['tw', 'xg', 'am'];
            // 省份
            if (provinceUl.length) {
                var iscrollSheng = new iscroll(provinceUl.parent()[0], {
                    // 禁止横向滑动
                    scrollX: false,
                    // 开启纵向滑动
                    scrollY: true,
                    // 滑动为其本身，这里的作用是防止禁用掉整个文档流的默认事件导致的bug
                    bindToWrapper: true,
                    // 可以纵向滑动，默认能够穿过
                    eventPassthrough: false
                });
                // 城市
                var iscrollCity = new iscroll(cityUl.parent()[0], {
                    // 禁止横向滑动
                    scrollX: false,
                    // 开启纵向滑动
                    scrollY: true,
                    // 滑动为其本身，这里的作用是防止禁用掉整个文档流的默认事件导致的bug
                    bindToWrapper: true,
                    // 可以纵向滑动，默认能够穿过
                    eventPassthrough: false
                });
                city.on('click', function () {
                    // 省份
                    $.ajax({
                        url: vars.surveySite + '?c=survey&a=ajaxGetCity',
                        type: 'GET',
                        success: function (data) {
                            if (data) {
                                provinceUl.html('').append(data);
                                provinceTc.show();
                                iscrollSheng.refresh();
                                that.nopan = true;
                            } else {
                                that.nopan = false;
                            }
                        },
                        error: function () {
                            that.showMsg('网络错误');
                        }
                    });
                });
                provinceCan.on('click', function () {
                    // 取消禁止
                    that.nopan = false;
                    provinceTc.hide();
                });
                provinceUl.on('click', 'li', function () {
                    var $this = $(this);
                    provinceTc.hide();
                    city.text($this.text());
                    if ($.inArray($this.attr('id'), noCity) === -1) {
                        $.ajax({
                            url: vars.surveySite + '?c=survey&a=ajaxGetCity&province=' + $this.attr('id'),
                            type: 'GET',
                            success: function (data) {
                                if (data) {
                                    cityUl.html('').append(data);
                                    cityTc.show();
                                    iscrollCity.refresh();
                                    that.nopan = true;
                                    that.province = $this.text();
                                } else {
                                    city.text($this.text());
                                    that.nopan = false;
                                }
                            },
                            error: function () {
                                that.showMsg('网络错误');
                            }
                        });
                    } else {
                        cityTc.hide();
                    }
                });
                cityCan.on('click', function () {
                    cityTc.hide();
                    that.nopan = false;
                });
                cityUl.on('click', 'li', function () {
                    var $this = $(this);
                    cityTc.hide();
                    that.nopan = false;
                    that.city = $this.text();
                    var citystring = that.province + ' ' + that.city;
                    city.text(citystring);
                });
            }
            /**
             * 弹框单选
             */
            var selectArr = ['sex', 'age', 'marriage', 'education', 'profession', 'income'];
            for (var i = 0, len = selectArr.length; i < len; i++) {
                (function (ite) {
                    var index = selectArr[ite];
                    that[index] = $('#' + index);
                    if (that[index].length) {
                        that[index + 'Tc'] = $('#tc_' + index);
                        that[index + 'Can'] = $('#' + index + 'Can');
                        that[index + 'Ul'] = $('#' + index + 'Ul');
                        that[index + 'iscroll'] = new iscroll(that[index + 'Ul'].parent()[0], {
                            // 禁止横向滑动
                            scrollX: false,
                            // 开启纵向滑动
                            scrollY: true,
                            // 滑动为其本身，这里的作用是防止禁用掉整个文档流的默认事件导致的bug
                            bindToWrapper: true,
                            // 可以纵向滑动，默认能够穿过7
                            eventPassthrough: false
                        });
                        that[index].on('click', function () {
                            // 禁止滑动
                            that.nopan = true;
                            that[index + 'Tc'].show();
                            that[index + 'iscroll'].refresh();
                            // 项目id
                            that[index + 'id'] = $(this).closest('li').attr('data-id');
                        });
                        that[index + 'Can'].on('click', function () {
                            // 取消禁止
                            that.nopan = false;
                            that[index + 'Tc'].hide();
                        });
                        that[index + 'Ul'].on('click', 'li', function () {
                            var $this = $(this);
                            that[index + 'Tc'].hide();
                            that.nopan = false;
                            that[index + 'Text'] = $this.text();
                            that[index].text(that[index + 'Text']);
                            that[index].val(that[index + 'Text']);
                        });
                    }
                })(i);
            }


            /**
             * 初始化验证码
             */
            var codeRefresh = $('#codeBox a'),
                codeImg = $('#codeImg'),
                imgCode = $('#imgCode');
            codeImg.attr('src', vars.surveySite + '?c=survey&a=authCode&random=' + Math.random());
            codeRefresh.on('click', function () {
                codeImg.attr('src', vars.surveySite + '?c=survey&a=authCode&random=' + Math.random());
            });

            /**
             * 输入框输入
             */
            var content = $('.textarea');
            content.length && content.each(function (t, e) {
                e.initText = $(e).text().trim();
            });
            content.on('click', function () {
                $(this).focus();
            });
            // 获取焦点时判断是否输入过内容
            content.on('focus', function () {
                var me = $(this);
                var text = me.text().trim();
                text === this.initText && me.html('');


                // 改变字体颜色
                if (me.hasClass('ts')) {
                    me.removeClass('ts');
                }
            });

            // 失去焦点时，设置cookie记录内容
            content.on('blur', function () {
                var me = $(this);
                var contentTxt = me.text().trim();

                // 改变字体颜色

                contentTxt || me.hasClass('ts') || me.addClass('ts').html(this.initText);

            });

            /**
             * 感谢答题
             */
            var floatA = $('#floatA'),
                floatClose = $('#floatClose'),
                floatSure = $('#floatSure'),
                floatSore = $('#floatSore');
            floatClose.on('click', function () {
                floatA.hide();
                that.nopan = false;
            });
            floatSure.on('click', function () {
                location.href = 'https://m.fang.com/passport/login.aspx?burl=' + encodeURIComponent(location.href + '&r=' + Date.now());
            });

            /**
             * 提交操作
             */
            // 提交按钮
            var submit = $('#submit');
            // 所有题
            var quelist = $('.que-list').find('li'),
                quelen = quelist.length;
            // 所有表单
            var infoList = userinfoList.find('li'),
                infoLen = infoList.length;
            submit.on('click', function () {
                if (!that.isSub) {
                    // 初始化
                    that.init();
                    quelist.each(function (index, ele) {
                        var $ele = $(ele);
                        var selectedId = '';
                        var type = '';
                        var inputEle = $ele.find('input').length ? $ele.find('input') : $ele.find('.textarea');
                        var askId = $ele.attr('data-id');
                        var typeSel = inputEle.first() ? inputEle.first().get(0).nodeName : '';
                        var cboxCount = 0;
                        switch (typeSel) {
                            case 'INPUT':
                                type = inputEle.first() ? inputEle.first().attr('type') : '';
                                break;
                            case 'DIV':
                                type = 'div';
                                break;
                            default :
                                type = inputEle.first() ? inputEle.first().attr('type') : '';
                                break;
                        }
                        if (type === 'radio') {
                            selectedId = $ele.find('input:checked').attr('data-id');
                            var txtarea = $ele.find('input:checked').parent().siblings('div').children('div').eq(0);
                            that.select['q_' + askId + '[]'] = selectedId;
                            if ($ele.find('input:checked').hasClass('other') && txtarea.html()) {
                                that.select['ot_' + askId + '_' + selectedId] = txtarea.html();
                            }
                        } else if (type === 'checkbox') {
                            inputEle.each(function (i, ipt) {
                                var $ipt = $(ipt);
                                var txtareabox = $ipt.parent().siblings('div').children('div').eq(0);
                                if ($ipt.is(':checked')) {
                                    selectedId = $ipt.attr('data-id');
                                    that.select['q_' + askId + '[' + selectedId + ']'] = selectedId;
                                    cboxCount += 1;
                                    if ($ipt.hasClass('other') && txtareabox.html()) {
                                        that.select['ot_' + askId + '_' + selectedId ] = txtareabox.html();
                                    }
                                }
                            });
                        } else if (type === 'div') {
                            selectedId = inputEle.attr('data-id');
                            var eleval = inputEle.text().trim();
                            if (eleval && eleval !== inputEle[0].initText) {
                                if (eleval.length > 150) {
                                    that.showMsg('第' + (index + 1) + '题答案超出字数限制，请规范格式');
                                    return false;
                                }
                                that.select['qt_' + askId + '_' + selectedId] = eleval;
                            } else {
                                that.showMsg('请填写第' + (index + 1) + '题!');
                                return false;
                            }
                        }
                        // 有未答得题
                        if (!selectedId && $ele.attr('data-must') === 'y') {
                            that.showMsg('请选择第' + (index + 1) + '题!');
                            return false;
                        }
                        // 判断多选框选中数量
                        if ($ele.attr('data-max') || $ele.attr('data-min')) {
                            if (cboxCount && (cboxCount > $ele.attr('data-max') || cboxCount < $ele.attr('data-min'))) {
                                that.showMsg('第' + (index + 1) + '题至少选择' + $ele.attr('data-min') + '项，至多选择' + $ele.attr('data-max') + '项');
                                return false;
                            }
                        }

                        // 判断选择题有没有验证完
                        if (quelen > 0 && index === quelen - 1) {
                            that.selectall = true;
                        }
                    });
                    // 题目为空的时候
                    if (!quelen) {
                        that.selectall = true;
                    }
                    // 已选择所有题目
                    if (that.selectall) {
                        infoList.each(function (j, inp) {
                            var $inp = $(inp),
                                infoId = $inp.attr('data-id'),
                                inputEle = $inp.find('input,.info-div'),
                                type = inputEle.attr('data-must'),
                                inputName = inputEle.attr('data-name'),
                                inputv = inputEle.val() || inputEle.text(),
                                inputval = inputv.trim(),
                                truelen = j,
                                infoLen = infoList.length;
                            if (infoId === 'checkcode') {
                                infoLen -= 1;
                                if (infoLen > 0 && truelen === infoLen) {
                                    that.userinfoall = true;
                                }
                                return true;
                            }
                            if (type === 'must' && (!inputval || /请选择|请输入|请填写/.test(inputval))) {
                                that.showMsg(inputName + '不能为空!');
                                return false;
                            } else if (inputName.indexOf('手机号码') !== -1 && !that.phoneReg.test(inputval) && inputval) {
                                that.showMsg(inputName + '格式不正确!');
                                return false;
                            } else if (inputName.indexOf('邮箱') !== -1 && !that.emailReg.test(inputval) && inputval) {
                                that.showMsg(inputName + '格式不正确!');
                                return false;
                            } else if (inputName.indexOf('身份证号') !== -1 && !that.IDCardReg.test(inputval) && inputval) {
                                that.showMsg(inputName + '格式不正确!');
                                return false;
                            }
                            that.userinfo['ut_' + that.userinfoId + '_' + infoId] = inputval;
                            // 判断用户信息有没有验证完
                            if (infoLen > 0 && truelen === infoLen - 1) {
                                that.userinfoall = true;
                            }
                        });
                        // 判断 全部为非必须项时候 允许提交
                        if (!infoList.find('input[data-must=must],.info-div[data-must=must]').length || !infoLen) {
                            that.userinfoall = true;
                        }
                    }
                    // 验证验证码
                    if (that.selectall && that.userinfoall) {
                        var imgCodeVal = imgCode.val() ? imgCode.val().trim() : imgCode.val();
                        // 拼接答题字符串
                        for (var sel in that.select) {
                            if (that.select.hasOwnProperty(sel)) {
                                if (/请选择|请输入|请填写/.test(that.select[sel])) {
                                    that.selectString += (sel + '-' + ' ,');
                                } else {
                                    that.selectString += (sel + '-' + that.select[sel] + ',');
                                }
                            }
                        }
                        if (that.selectString.charAt(that.selectString.length - 1) === ',') {
                            that.selectString = that.selectString.substring(0, that.selectString.length - 1);
                        }
                        // 拼接用户信息字符串
                        for (var info in that.userinfo) {
                            if (that.userinfo.hasOwnProperty(info)) {
                                if (/请选择|请输入|请填写/.test(that.userinfo[info])) {
                                    that.userinfostring += (info + '-' + ' ,');
                                } else {
                                    that.userinfostring += (info + '-' + that.userinfo[info] + ',');
                                }

                            }
                        }
                        if (that.userinfostring.charAt(that.userinfostring.length - 1) === ',') {
                            that.userinfostring = that.userinfostring.substring(0, that.userinfostring.length - 1);
                        }
                        // 拼接最终字符串
                        that.endString = that.selectString + (that.userinfostring ? ',' + that.userinfostring : '');
                        if (imgCode.length && !imgCodeVal) {
                            that.showMsg('验证码不能为空!');
                        } else if (imgCode.length && imgCodeVal.length < 4) {
                            that.showMsg('请填入正确的验证码');
                        } else if (vars.usePreventCode == 'y') {
                            $.get(vars.surveySite + '?c=survey&a=checkCode&imgcode=' + imgCodeVal, function (status) {
                                if (status == 'true' || status == true) {
                                    that.submitAjax(floatSore, floatA);
                                } else {
                                    that.showMsg('验证码不正确');
                                    codeImg.attr('src', '?c=survey&a=authCode&random=' + Math.random());
                                    return false;
                                }
                            });
                        } else {
                            that.submitAjax(floatSore, floatA);
                        }
                    }

                }
            });

        },

        /**
         * 提交调查结果
         * @param floatSore 积分数
         * @param floatA 弹窗ele
         */
        submitAjax: function (floatSore, floatA) {
            var that = this;
            that.isSub = true;
            $.post('?c=survey&a=submit', {
                id: vars.surveyId,
                param: encodeURIComponent(that.endString)
            }, function (data) {
                that.isSub = false;
                var result = data.result;
                var msg = data.msg;
                var promptstring = vars.promptstring || '提交成功!';
                if (result == '100') {
                    that.showMsg(promptstring, 1500, function () {
                        that.init();
                        if (vars.logined) {
                            if (msg.match(/\d+|积分/g)) {
                                location.href = vars.surveySite + '?c=survey&a=integrateResult&id=' + vars.surveyId + '&point=' + vars.point;
                            } else {
                                location.href = vars.surveySite + '?c=survey&a=integrateResult&id=' + vars.surveyId;
                            }

                        } else if (vars.point) {
                            floatSore.html(vars.point);
                            floatA.show();
                            that.nopan = true;
                        }
                    });
                } else {
                    that.showMsg(msg);
                }
            });
        },
        /**
         * 信息弹层
         * @param text 文本内容
         * @param time 显示时间
         * @param callback 回调函数
         */
        showMsg: function (text, time, callback) {
            var that = this;
            text = text || '信息有误！';
            time = time || 1500;
            that.msgP.html(text);
            that.msg.show();
            clearTimeout(that.timer);
            that.timer = setTimeout(function () {
                that.msg.fadeOut();
                callback && callback();
            }, time);
        }
    };
    return new Survey();
});