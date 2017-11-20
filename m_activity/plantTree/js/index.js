/**
 * Created with webstorm.
 * User: tkp19
 * Date: 2016/03/09
 * Time: 16:47
 */
$(function () {
    'use strict';

    /**
     * 获取隐藏域数据
     */
    var vars = {};
    $('input[type=hidden]').each(function (index, element) {
        vars[element.id] = element.value;
    });

    /**
     * 初始化数据
     */
    vars.askStatus = parseInt(vars.askStatus);
    var winH = $(window).height();

    /**
     * 弹出层操作时阻止默认滚动时间
     * @type {boolean} false 为不禁止
     */
    var noPan = false;
    document.addEventListener('touchmove', function (e) {
        if (noPan) {
            e.preventDefault();
            e.stopPropagation();
        }
    }, false);

    // 树\工具
    var tree = $('#tree'),
        trees = tree.children(),
        tool = $('#tool'),
        tools = tool.children(),
        cur = $('#cur');
    // 苹果、星星
    var appleBox = $('#appleBox'),
        starBox = $('#starBox'),
        stars = starBox.find('span');

    // 遮罩层
    var floatAlert = $('#floatAlert');

    // 登录检测
    var login = $('#login');

    // 方便答题成功后调用
    vars.askId = 0;
    vars.askLen = 100;

    /**
     * 更新小树状态
     * @param status 状态码
     * @param init  是否是初次进入页面初始化
     */
    function updateStatus(status, init) {
        status = status || 1;
        init = init || false;
        switch (status) {
            // 1:浇水不可点 2:浇水可以点击
            case 1:
            case 2:
                // 树的状态
                trees.eq(0).fadeIn(700).siblings().fadeOut(700);
                // 工具的状态
                if (status === 2) {
                    tools.eq(0).addClass('on');
                }
                tools.eq(0).addClass('bounceIn').fadeIn(700).siblings().fadeOut(700);
                vars.actionEle = tools.eq(0);
                break;
            // 3:施肥不可点 4:施肥可以点击
            case 3:
            case 4:
                // 树的状态
                trees.eq(1).fadeIn(700).siblings().fadeOut(700);
                // 工具的状态
                if (status === 4) {
                    tools.eq(1).addClass('on');
                }
                tools.eq(1).addClass('bounceIn').fadeIn(700).siblings().fadeOut(700);
                vars.actionEle = tools.eq(1);
                // 加积分
                if (!init && status === 3) {
                    cur.html('+5积分').addClass('cur');
                }
                break;
            // 5:修剪不可点 6:修剪可以点击
            case 5:
            case 6:
                // 树的状态
                trees.eq(2).fadeIn(700).siblings().fadeOut(700);
                // 工具的状态
                if (status === 6) {
                    tools.eq(2).addClass('on');
                }
                tools.eq(2).addClass('bounceIn').fadeIn(700).siblings().fadeOut(700);
                vars.actionEle = tools.eq(2);
                break;
            // 7:摘果不可点 8:摘果可以点击
            case 7:
            case 8:
                // 树的状态
                trees.eq(3).fadeIn(700).siblings().fadeOut(700);
                // 工具的状态
                if (status === 8) {
                    tools.eq(3).addClass('on');
                }
                tools.eq(3).addClass('bounceIn').fadeIn(700).siblings().fadeOut(700);
                vars.actionEle = tools.eq(3);
                // 加积分
                if (!init && vars.from && vars.from === 'konggu' && status === 7) {
                    cur.html('+10积分').addClass('cur');
                }else if (!init && vars.from && vars.from === 'jiaju' && status === 7) {
                    showMsg('恭喜您获得免费验房');
                }
                break;
            // 9:水果篮不可点 10:水果篮可以点击
            case 9:
            case 10:
                if (init) {
                    trees.eq(4).fadeIn(500).siblings().fadeOut(500);
                }else {
                    // 苹果的状态
                    appleBox.fadeOut(500,function () {
                        starBox.css('opacity','1').fadeIn(500);
                    });
                    stars.each(function (index, element) {
                        $(element).addClass('f-star' + (index + 1));
                    });
                }
                // 工具的状态
                if (status === 9) {
                    tools.eq(4).addClass('on');
                }
                setTimeout(function () {
                    tools.eq(4).addClass('bounceIn').fadeIn(700).siblings().fadeOut(700);
                },1000);
                vars.actionEle = tools.eq(4);
                break;

        }

        setTimeout(function () {
            tools.removeClass('bounceIn').removeClass('bounceIn2');
            if (vars.actionEle.hasClass('on') && vars.askStatus < 10) {
                vars.actionEle.addClass('bounceIn2');
            }
            cur.removeClass('cur');
        }, 700);
    }

    // 初始化
    updateStatus(vars.askStatus,true);

    /**
     * 浇水,施肥,裁剪,采摘苹果动作
     * @type {*|jQuery|HTMLElement}
     */

    var appScore = {
        box: $('#getSuccess'),
        score: $('#scoreSH')
    };
    // 单次点击开关
    vars.finished = true;
    tools.on('click', function () {
        var me = $(this),
            dis = me.hasClass('on');
        if (vars.finished && dis && vars.askStatus < 10) {
            vars.finished = false;
            if (!vars.logined) {
                floatAlert.show();
                login.show().css('top', $(document).scrollTop() + 50);
                return false;
            }
            // 更新状态码
            vars.askStatus++;
            getMony(function (status) {
                if (status && vars.askStatus === status) {
                    updateStatus(vars.askStatus);
                }else {
                    vars.askStatus--;
                }
                vars.finished = true;
            });
            // 目前设置死的 获取50积分
            if (me.index() === 4) {
                // 获得50积分,暂时定死
                floatAlert.show();
                appScore.score.html(50);
                appScore.box.show().css('top', $(document).scrollTop() + 50);
            }
        }else if (vars.askStatus >= 10) {
            showMsg('今天的任务完成了哦，明天再来吧！');
        }else if (vars.askStatus < 9 && vars.askStatus % 2 !== 0) {
            showMsg('请先回答问题~');
        }
    });

    /**
     * 信息弹层
     * @param text 文本内容
     * @param time 显示时间
     * @param callback 回调函数
     */
    var msg = $('#msg'),
        msgP = msg.find('p'),
        timer = null;

    function showMsg(text, time, callback) {
        text = text || '信息有误！';
        time = time || 1500;
        msgP.html(text);
        msg.fadeIn().css({
            position: 'absolute',
            top: $(document).scrollTop() + winH / 2
        });
        clearTimeout(timer);
        timer = setTimeout(function () {
            msg.fadeOut();
            callback && callback();
        }, time);
    }

    /**
     * 关闭弹出框(通用)
     * @type {*|jQuery|HTMLElement}
     */
    // 弹窗盒子
    var floatBox = $('#floatBox');
    var outBox = $('.outBox,.outBox2');
    floatBox.on('click', '.close', function () {
        floatAlert.hide();
        outBox.hide();
        // 取消禁止滑动
        noPan = false;
    });

    /**
     * 活动规则点击事件
     * @type {*|jQuery|HTMLElement}
     */
    var ruleBtn = $('#ruleBtn'),
        rule = $('#rule');
    ruleBtn.on('click', function () {
        // 禁止滑动
        noPan = true;
        floatAlert.show();
        rule.show().css('top', $(document).scrollTop() + 50);
    });

    /**
     * 我的奖品按钮点击事件
     * @type {*|jQuery|HTMLElement}
     */
    var prizeBtn = $('#prizeBtn'),
        prize = $('#prize'),
        prizeChild = prize.find('li'),
        prizeH = prize.height();
    prizeBtn.on('click', function () {
        if (!vars.logined) {
            floatAlert.show();
            login.show().css('top', $(document).scrollTop() + 50);
            return false;
        }
        // 禁止滑动
        noPan = true;
        $.ajax({
            url: vars.mainSite + '/huodongAC.d?class=PlantTreeHc&m=getMyPrize',
            type: 'GET',
            data: {},
            success: function (data) {
                var oterPrize = prizeChild.eq(1);
                prizeChild.eq(0).find('span').html(data.jifen);
                if (!data.lottery) {
                    oterPrize.hide();
                }else if (data.lottery === 'mianfeiyanfang') {
                    oterPrize.find('span').html('免费验房');
                }else {
                    oterPrize.find('span').html(data.lottery);
                }
                floatAlert.show();
                prize.show().css('top', $(document).scrollTop() + ((winH - prizeH) / 3 | 0));
            },
            error: function (data) {
                showMsg(data.message);
            }
        });
    });

    /**
     * 答题换一换
     * @type {*|jQuery|HTMLElement}
     */
    // 答题框盒子
    var askBox = $('#askBox');
    // 回答问题弹窗
    var issue = {
        issue: $('#issue'),
        title: $('#issueTitle'),
        text: $('#issueText'),
        close: $('#issueClose'),
        submit: $('#issueSubmit')
    };
    askBox.on('click', '.change', function () {
        var me = $(this),
            id = me.attr('data-id'),
            len = askBox.children().length;
        // 方便答题成功后调用
        vars.askId = parseInt(id) + 1;
        vars.askLen = len;
        $('#' + id).hide();
        $('#' + (parseInt(id) + 1) % len).show();
        issue.text.val('');
    });

    /**
     * 点击立即答题
     * @type {*|jQuery|HTMLElement}
     */
    askBox.on('click', '.submit', function () {
        var me = $(this);
        floatAlert.show();
        if (!vars.logined) {
            floatAlert.show();
            login.show().css('top', $(document).scrollTop() + 50);
            return false;
        }
        issue.title.html(me.prev().html());
        issue.submit.attr({
            'data-askId': me.attr('data-askId'),
            'data-id': me.attr('data-id')
        });
        // 方便答题成功后调用
        vars.askId = parseInt(me.attr('data-id'));
        vars.askLen = askBox.children().length;
        issue.issue.show().css('top', $(document).scrollTop() + 50);
    });
    // 关闭
    issue.close.on('click', function () {
        floatAlert.hide();
        issue.issue.hide();
        issue.text.val('');
    });
    // 提交
    issue.submit.on('click', function () {
        var text = issue.text.val().trim(),
            len = text.length,
            askid = $(this).attr('data-askid');
        if (!vars.logined) {
            floatAlert.show();
            login.show().css('top', $(document).scrollTop() + 50);
            return false;
        } else if (!text) {
            showMsg('提交内容不能为空');
            return false;
        } else if (len < 15) {
            showMsg('回答不能少于15字哦~');
            return false;
        }
        issue.issue.hide();
        floatAlert.hide();

        $.ajax({
            url: vars.mainSite + '/huodongAC.d',
            type: 'GET',
            data: {
                class: 'PlantTreeHc',
                m: 'totalAnswer',
                askid: askid,
                content: encodeURIComponent(text)
            },
            dataType: 'json',
            success: function (data) {
                var code = data.root.code,
                    msg = data.root.message;
                if (code === '100') {
                    if (!vars.actionEle.hasClass('on')) {
                        vars.actionEle.addClass('on');
                        vars.askStatus++;
                        updateStatus(vars.askStatus);
                    }
                    issue.text.val('');
                    showMsg('回答成功');
                    $('#' + vars.askId).hide();
                    $('#' + (parseInt(vars.askId) + 1) % vars.askLen).show();
                } else {
                    issue.issue.show().css('top', $(document).scrollTop() + 50);
                    floatAlert.show();
                    showMsg(msg);
                }
            },
            error: function () {
                // TODO 发送请求失败
            }

        });
    });

    /**
     * 数字补全
     * @param num 数字
     * @returns {string} 两位数字
     */
    function toDou(num) {
        return num < 10 ? '0' + num : num;
    }


    // 获取验证码
    var phoneReg = /^(13[0-9]|14[0-9]|15[0-9]|18[0-9]|17[0-9])\d{8}$/i,
        codeReg = /^\d{4}$/;
    var getPhoneVerifyCode = window.getPhoneVerifyCode;
    var getCode = $('#getCode'),
        phone = $('#phone'),
        codeTime = $('#codeTime'),
        againCode = $('#againCode');

    // 设置获取验证码开关
    var allowGet = true;
    var timeCount = 60;

    /**
     * 更新倒计时
     */
    var timer2 = null;

    function updateTime() {
        allowGet = false;
        codeTime.val('重新发送(' + toDou(timeCount) + ')').addClass('getingCode');
        clearInterval(timer2);
        timer2 = setInterval(function () {
            timeCount--;
            codeTime.val('重新发送(' + toDou(timeCount) + ')');
            if (timeCount < 0) {
                clearInterval(timer2);
                codeTime.hide();
                getCode.hide();
                againCode.show();
                timeCount = 60;
                allowGet = true;
            }
        }, 1000);
    }

    // 获取验证码事件
    $('#getCode,#againCode').on('click', function () {
        if (allowGet) {
            var phonestr = phone.val().trim();
            if (!phonestr) {
                showMsg('请输入手机号');
                return false;
            }
            if (!phoneReg.test(phonestr)) {
                showMsg('请输入正确的手机号');
                return false;
            }
            getCode.hide();
            againCode.hide();
            codeTime.val('60S后获取').show();
            // 调用获取验证码插件
            getPhoneVerifyCode(phonestr, function () {
                showMsg('验证码发送成功，请注意查收');
                updateTime();
            }, function (msg) {
                showMsg(msg);
                againCode.hide();
                codeTime.hide();
                getCode.show();
            });
        }
    });

    // 登录提交
    var sign = $('#qd'),
        code = $('#code');
    var sendVerifyCodeAnswer = window.sendVerifyCodeAnswer;
    // 验证码清空
    code.focus(function () {
        $(this).val('');
    });

    sign.on('click', function (ev) {
        ev.stopPropagation();
        var phonestr = phone.val().trim();
        var codestr = code.val().trim();
        if (!phonestr) {
            showMsg('请输入手机号');
            return;
        }
        if (!phoneReg.test(phonestr)) {
            showMsg('请输入正确的手机号');
            return;
        }
        if (!codestr) {
            showMsg('请输入验证码');
            return;
        }
        if (!codeReg.test(codestr)) {
            showMsg('验证码错误');
            return;
        }
        vars.logined = phonestr;
        $('#logined').val(phonestr);
        sendVerifyCodeAnswer(phonestr, codestr, function () {
            location.reload();
        }, function (msg) {
            showMsg(msg);
        });
    });

    /**
     * 获取积分
     * @param callback 回调函数fn
     */
    function getMony(callback) {
        $.ajax({
            url: vars.mainSite + '/huodongAC.d',
            type: 'GET',
            data: {
                class: 'PlantTreeHc',
                m: 'action',
                s: vars.from
            },
            dataType: 'json',
            success: function (data) {
                var state = data.root.state;
                // TODO 提交成功处理
                callback && callback(state);
            },
            error: function () {
                // TODO 发送请求失败
            }
        });
    }


    /**
     * 问题反馈
     */
    var link = $('#link'),
        feedback = {
            one: $('#feedback'),
            content: $('#feedbackContent'),
            phone: $('#feedbackPhone'),
            back: $('#feedbackBack'),
            submit: $('#feedbackSubmit')
        };
    link.on('click',function () {
        floatAlert.show();
        feedback.one.show().css('top', $(document).scrollTop() + 50);
    });
    // 默认字
    var initText = feedback.content.text();
    feedback.content.focus(function () {
        var me = $(this);
        if (me.val().trim() === initText) {
            me.val('');
            // 改变字体颜色
            if (me.hasClass('ts')) {
                me.removeClass('ts');
            }
        }
    }).blur(function () {
        var me = $(this);
        if (!me.val().trim()) {
            me.val(initText);
            // 改变字体颜色
            if (!me.hasClass('ts')) {
                me.addClass('ts');
            }
        }
    });
    // 返回按钮
    feedback.back.on('click',function () {
        floatAlert.hide();
        feedback.one.hide();
    });
    var iphoneReg = /^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$/;
    // 反馈提交
    feedback.submit.on('click',function () {
        var text = feedback.content.val().trim(),
            phone = feedback.phone.val().trim();
        if (!text || text === initText) {
            showMsg('请输入您的反馈内容');
            return false;
        }else if (phone && !iphoneReg.test(phone)) {
            showMsg('请输入正确的手机号');
            return false;
        }
        floatAlert.hide();
        feedback.one.hide();
        $.ajax({
            url: vars.mainSite + '/huodongAC.d',
            type: 'GET',
            data: {
                class: 'PlantTreeHc',
                m: 'feedback',
                content: encodeURIComponent(text),
                phone: feedback.phone.val().trim()
            },
            dataType: 'json',
            success: function () {
                showMsg('反馈成功,感谢您的支持');
            },
            error: function () {
                showMsg('当前网络状态糟糕,反馈失败');
                floatAlert.show();
                feedback.one.show().css('top', $(document).scrollTop() + 50);
            }
        });
    });
});