/**
 * Created by user on 2016/9/6.
 */
// var $ = window.jQuery;
function Main() {
    'use strict';
    this.$floatAlert = $('.floatAlert');
    this.login = $('.loginID').val();
    this.$cakeStatus = $('.cakeStatus');
    this.$dengList = $('.dengList');
    this.$issueBox = $('#issueBox');
    this.$feedback = $('#feedback');
    this.$loading = $('#loading');
    this.$source = $('.source_js').val();
    this.$codeInput = $('.flexbox input');
    this.$btnGetcode = this.$codeInput.eq(1);
    this.$btnAgaincode = this.$codeInput.eq(2);
    this.intervalObj = null;
    this.curTime = 60;
    // 解析：标记是否有点击过月饼，闪烁月饼索引值+1，月饼提交原因标记,点击的月饼索引值+1，点击的月饼对象，提交次数，积分数
    this.moonFlag = false;
    this.flashValue = 0;
    this.flashReason = 0;
    this.moonValue = 0;
    this.$moonObj = '';
    this.clickCount = 0;
    this.countscore = 0;
    this.varscroll = '';
    // 解析：当前回答的问题的id,已经回答的问题数目，更换问题控制标记位
    this.questionID = null;
    this.answerdNum = null;
    this.changeIssueFlag = true;
}
Main.prototype = {
    constructor: Main,

    /**
     * 页面初始化方法
     */
    init: function () {
        'use strict';
        // 更新变量 ，更新个人积分和兑换按钮的显示，更新个人月饼盒的状态，绑定点击事件，loading页面动画
        var loginShow = $('#loginShow');
        this.countscore = parseInt(loginShow.find('span').text(),10);
        if (this.login !== '-1') {
            loginShow.show();
        }
        this.updateStatus();
        this.bindEvent();
        setTimeout(function () {
            $('.loading').hide();
            $('.wrap').show();
        },2500);
    },

    /**
     *进入页面更新用户月饼盒信息状态
     */
    updateStatus: function () {
        'use strict';
        // 月饼盒默认值为0，打开为1，闪烁为2
        var that = this,counter = 0;
        var LI = that.$dengList.find('li');
        var i,il = that.$cakeStatus.length;
        // 更新月饼盒状态（打开还是闪烁），如果全部打开则为ul 添加 class='on'
        for (i = 0;i < il;i++) {
            var value = that.$cakeStatus.eq(i).val();
            if (value === '1') {
                LI.eq(i).addClass('on');
                counter ++;
            }
            if (value === '2') {
                LI.eq(i).addClass('flash');
                that.flashValue = i + 1;
                that.flashReason = 2;
            }
        }
        if (counter === 9) {
            that.$dengList.addClass('on');
        }
    },

    /**
     * 页面绑定事件方法
     */
    bindEvent: function () {
        'use strict';
        var that = this;
        // 点击月饼盒模块，点击月饼盒，继续选月饼按钮
        that.$dengList.on('touchstart','li',function () {
            var ele = $(this);
            if (that.login === '-1') {
                that.$floatAlert.show();
                that.$loading.show();
                that.$floatAlert.on('touchstart',function () {
                    that.$loading.hide();
                    that.$floatAlert.hide();
                    that.$floatAlert.off('touchstart');
                });
            } else if (that.$dengList.hasClass('on')) {
                that.showTip('今天的月饼盒已全部打开','欢迎明天再来',true);
            } else {
                that.clickMoon(ele);
            }
        });
        var $imageBox = $('.imgBox');
        $imageBox.find('a').on('touchstart',function () {
            that.$floatAlert.hide();
            $imageBox.hide();
        });
        // 回答框绑定事件模块,返回按钮，提交按钮，更换问题，回答区获得和失去焦点
        $('#answerBack').on('touchstart',function () {
            that.$floatAlert.hide();
            that.$issueBox.hide();
            that.$issueBox.find('textarea').val('回答完此问题才能继续选择月饼哦~');
        });
        $('#answerSubmit').on('touchstart',function () {
            that.issueSubmit();
        });
        that.$issueBox.find('.h-box a').on('touchstart',function () {
            that.changeIssue();
        });
        that.$issueBox.find('textarea').on('focus',function () {
            var content = $(this).val();
            if (content.trim() === '回答完此问题才能继续选择月饼哦~') {
                $(this).val('');
            }
        });
        that.$issueBox.find('textarea').on('blur',function () {
            var content = $(this).val();
            if (content.trim() === '') {
                $(this).val('回答完此问题才能继续选择月饼哦~');
            }
        }).on('touchmove',function (evt) {
            evt.stopPropagation();
        });
        // 问题反馈模块绑定事件模块，打开浮层，返回按钮，提交按钮，反馈区域，手机号获得和失去焦点
        $('.link').on('touchstart',function () {
            that.$feedback.find('textarea').val('请输入您的反馈(必填)~');
            that.$feedback.css('top','20rem');
            that.$floatAlert.show();
            that.$feedback.show();
        });
        that.$feedback.find('a').eq(0).on('touchstart',function () {
            that.$floatAlert.hide();
            that.$feedback.hide();
            that.$feedback.find('textarea').val('请输入您的反馈(必填)~');
            that.$feedback.find('input').val('').attr('placeholder','请输入手机号(选填)');

        });
        that.$feedback.find('a').eq(1).on('touchstart',function () {
            that.feedbackSubmit();
        });
        that.$feedback.find('textarea').on('focus',function () {
            var content = $(this).val();
            if (content.trim() === '请输入您的反馈(必填)~') {
                $(this).val('');
            }
        });
        that.$feedback.find('textarea').on('blur',function () {
            var content = $(this).val();
            if (content.trim() === '') {
                $(this).val('请输入您的反馈(必填)~');
            }
        });
        that.$feedback.find('input').on('focus',function () {
            $(this).attr('placeholder','');
        });
        that.$feedback.find('input').on('blur',function () {
            $(this).attr('placeholder','请输入手机号(选填)');
        });
        // **********************************登录模块事件模块
        $('.phonebox input').on('focus',function () {
            $(this).attr('placeholder','');
        }).on('blur',function () {
            $(this).attr('placeholder','手机号');
        });
        $('.flexbox input[type="number"]').on('focus',function () {
            $(this).attr('placeholder','');
        }).on('blur',function () {
            $(this).attr('placeholder','验证码');
        });
        that.$btnGetcode.on('touchstart',function () {
            that.getCode();
        });
        $('#denglu').find('a').on('touchstart',function () {
            that.identifyCode();
        });
        // 播放音乐模块
        var $ring = $('.ring'),$off = $('.off');
        var MusicAudio = $('#music_audio')[0];
        $ring.on('touchstart', function () {
            $(this).hide();
            $off.show();
            MusicAudio.pause();
        });
        $off.on('touchstart',function () {
            $(this).hide();
            $ring.show();
            MusicAudio.play();
        });
    },

    /**
     * 点击月饼盒,判断是否向后台请求数据
     * @param ele 当前点击的li标签元素
     */
    clickMoon: function (ele) {
        'use strict';
        var that = this;
        var target = ele;
        var temp = target.attr('data-ename');
        // 在没有class=on的情况下，判断条件是 存在闪烁月饼并且点击的也是闪烁月饼
        if (target.hasClass('on') || that.moonFlag) {
            return;
        }
        if (that.flashValue === 0 || that.flashValue === parseInt(temp)) {
            that.$moonObj = target;
            that.moonValue = parseInt(temp);
            that.moonFlag = true;
            // 更新灯笼状态
            if (that.flashValue === 0) {
                that.flashValue = parseInt(temp);
                that.$moonObj.addClass('flash');
            }
            that.requestScoreOrIssue();
        } else {
            that.showTip('请您继续打开之前的月饼盒');
        }
    },

    /**
     * 点击月饼盒，获取后台数据，积分或者答题
     */
    requestScoreOrIssue: function () {
        'use strict';
        var that = this;
        var lightParm = {};
        lightParm.class = 'LightHc';
        lightParm.m = 'insertLotteryResult';
        lightParm.pos = that.moonValue;
        lightParm.flashVal = that.flashReason;
        lightParm.act = $('.act_type').val();
        // 这个值没有所以目前传递一个空的字符串
        lightParm.s = that.$source;
        $.ajax({
            url: '/huodongAC.d',
            type: 'POST',
            data: lightParm,
            dataType: 'json',
            success: function (data) {
                var Type = data.root.lottery;
                var clickCount = data.root.count;
                var returnJF = data.root.valued;
                that.clickCount = parseInt(clickCount);
                // 1 获得积分的情况
                if (Type === 'jifen') {
                    that.getScore(returnJF.trim());
                    that.flashReason = 0;
                    //   问答问题
                } else if (Type === 'dati') {
                    that.questionID = data.root.askId;
                    var quescontentstr = data.root.titled;
                    that.answeredNum = data.root.answeredNum;
                    that.flashReason = 2;
                    // 问题初始化，弹出蒙层，弹出问题弹窗
                    that.$issueBox.find('.q-box').html(quescontentstr);
                    that.$floatAlert.show();
                    that.$issueBox.show();
                }
                setTimeout(function () {
                    that.moonFlag = false;
                }, 1000);
            }
        });
    },

    /**
     * 当用户获取的是积分的情况下，随机选定标语
     * @param jfval 后台获取积分
     */
    getScore: function (jfval) {
        'use strict';
        var that = this;
        that.$floatAlert.show();
        if (that.clickCount === 0) {
            $('#scoreBox5s').show();
        } else if (that.clickCount === 2) {
            $('#scoreBox10s').show();
        } else {
            var num = Math.round(2 + Math.random() * 9);
            var selector = '#scoreBox' + jfval;
            var imgurl = $('.url').val();
            var path = imgurl + 'pic-shi' + num + '.png';
            $(selector).find('.wz').attr('src',path);
            $(selector).show();
        }
        that.setShowcountjf(jfval);
        that.sureStatu();
    },

    /**
     * 点击月饼盒回答问题，更换问题方法
     */
    changeIssue: function () {
        'use strict';
        var that = this;
        if (that.changeIssueFlag) {
            that.changeIssueFlag = false;
            var changeParm = {};
            changeParm.class = 'LightHc';
            changeParm.m = 'changeQuestion';
            changeParm.askId = that.questionID;
            changeParm.answeredNum = that.answeredNum;
            changeParm.s = that.$source;
            $.ajax({
                url: '/huodongAC.d',
                type: 'POST',
                data: changeParm,
                dataType: 'json',
                success: function (data) {
                    that.questionID = data.root.askId;
                    that.answeredNum = data.root.answeredNum;
                    var quescontentstr = data.root.titled;
                    that.$issueBox.find('.q-box').html(quescontentstr);
                    that.changeIssueFlag = true;
                }
            });
        }
    },

    /**
     * 点击月饼盒回答问题的问题提交方法
     */
    issueSubmit: function () {
        'use strict';
        var that = this;
        var preanwerStr = that.$issueBox.find('.ts').val();
        if (preanwerStr === '回答完此问题才能继续选择月饼哦~') {
            that.showTip('请先回答此问题哦~');
            return;
        }
        if (preanwerStr.length < 15) {
            // $signTipPanel.css('top','14rem');
            that.showTip('回答不能少于15字哦~');
            return ;
        }
        var anwerStr = encodeURIComponent(encodeURIComponent(preanwerStr));
        that.$issueBox.find('.ts').val('');
        that.$issueBox.hide();
        that.$floatAlert.hide();
        var answerParm = {};
        answerParm.class = 'LightHc';
        answerParm.m = 'totalAnswer';
        answerParm.askId = that.questionID;
        answerParm.content = anwerStr;
        answerParm.pos = that.moonValue;
        $.ajax({
            url: '/huodongAC.d',
            type: 'POST',
            data: answerParm,
            dataType: 'json',
            success: function (data) {
                var statucode = data.root.code;
                if (statucode === '100') {
                    that.flashReason = 0;
                    that.sureStatu();
                    if (that.clickCount === 8) {
                        // var lastPointstr = data.root.lastPoint;固定50积分所以这个用不到了
                        that.lastSumShow();
                        that.$dengList.addClass('on');
                    }else {
                        // $signTipPanel.css('top','14rem');
                        that.showTip('提交成功！');
                        that.$floatAlert.hide();
                    }
                } else {
                    var arr = [];
                    var tipstr = data.root.message;
                    if (tipstr.length > 13) {
                        arr[0] = tipstr.substr(0,13);
                        arr[1] = tipstr.substring(14);
                        that.showTip(arr[0],arr[1],true);
                    } else {
                        that.showTip(tipstr);
                    }
                }
            },
            error: function () {
                // $signTipPanel.css('top','14rem');
                that.showTip('问题回答有误！');
            }
        });
    },

    /**
     * 9个月饼盒全部打开后，显示50积分方法
     */
    lastSumShow: function () {
        'use strict';
        var that = this;
        that.setShowcountjf(50);
        var allBoxPanel = $('.allBox');
        that.$floatAlert.show();
        allBoxPanel.show();
        setTimeout(function () {
            that.$floatAlert.hide();
            allBoxPanel.hide();
        }, 2000);
    },

    /**
     * 问题反馈提交方法
     */
    feedbackSubmit: function () {
        'use strict';
        var that = this;
        var phoneReg = /^(13[0-9]|14[0-9]|15[0-9]|18[0-9]|17[0-9])\d{8}$/i;
        var contentstr = that.$feedback.find('textarea').val();
        var phonestr = that.$feedback.find('input').val();
        var fbcontentstr = encodeURIComponent(encodeURIComponent(contentstr));
        var fbParm = {};
        fbParm.class = 'LightHc';
        fbParm.m = 'feedback';
        fbParm.phone = phonestr;
        fbParm.content = fbcontentstr;
        fbParm.act = $('.act_type').val();
        if (contentstr.trim().length > 0 && contentstr !== '请输入您的反馈(必填)~') {
            if (phonestr.length === 0 || phoneReg.test(phonestr)) {
                $.ajax({
                    url: '/huodongAC.d',
                    type: 'POST',
                    data: fbParm,
                    dataType: 'json',
                    success: function () {
                        that.$floatAlert.hide();
                        that.$feedback.hide();
                        $('#tips').css('top','25rem');
                        that.showTip('感谢您的反馈');
                    }
                });
            } else {
                $('.msg').css('top','12rem');
                that.showTip('请输入正确手机号',true);
            }
        } else {
            $('.msg').css('top','12rem');
            that.showTip('请输入反馈内容',true);
        }
    },

    /**
     * 点击获取验证码方法
     */
    getCode: function () {
        'use strict';
        var that = this;
        var phone = $('.phonebox input').val();
        var pattern = /^(13[0-9]|14[0-9]|15[0-9]|18[0-9]|17[0-9])\d{8}$/i;
        var bool = pattern.test(phone);
        if (phone) {
            if (bool) {
                window.smsLogin.send(phone, function () {
                    that.showTip('发送验证码成功！');
                    that.$btnGetcode.hide();
                    that.$btnAgaincode.show();
                    that.intervalObj = setInterval(function () {
                        that.setRemaintime();
                    },1000);
                }, function (json) {
                    that.showTip(json,true);
                });
            } else {
                that.showTip('手机号格式错误',true);
            }
        } else {
            that.showTip('请输入手机号',true);
        }
    },

    /**
     * 设置验证码获取时间的倒计时方法
     */
    setRemaintime: function () {
        'use strict';
        var that = this;
        if (!that.curTime) {
            clearInterval(that.intervalObj);
            that.curTime = 60;
            that.$btnAgaincode.val('重新发送(' + that.curTime + 'S)');
            that.$btnAgaincode.hide();
            that.$btnGetcode.show();
        } else {
            that.curTime--;
            that.$btnAgaincode.val('重新发送(' + that.curTime + 'S)');
        }
    },

    /**
     * 验证码确认登录方法
     */
    identifyCode: function () {
        'use strict';
        var that = this;
        var phoneNumber = $('.phonebox input').val();
        var ideCode = $('.flexbox input[type="number"]').val();
        var pattern = /^(13[0-9]|14[0-9]|15[0-9]|18[0-9]|17[0-9])\d{8}$/i;
        var bool = pattern.test(phoneNumber);
        if (phoneNumber) {
            if (bool) {
                if (ideCode) {
                    window.smsLogin.check(phoneNumber, ideCode,
                        function () {
                            that.showTip('登录成功');
                            that.$loading.hide();
                            that.$floatAlert.hide();
                            window.location.reload();
                        },
                        function (data) {
                            that.showTip(data,true);
                        });
                } else {
                    that.showTip('请输入验证码',true);
                }
            } else {
                that.showTip('手机号格式错误',true);
            }
        } else {
            that.showTip('请输入手机号',true);
        }
    },

    /**
     * 月饼点击完后更改状态包括闪烁的月饼盒位置，当前月饼更改class
     *
     */
    sureStatu: function () {
        'use strict';
        var that = this;
        if (that.moonValue === that.flashValue) {
            that.flashValue = 0;
            that.$moonObj.removeClass('flash');
        }
        that.$moonObj.addClass('on');
    },

    /**
     * 前端控制更改积分方法
     * @param jifen 积分数
     */
    setShowcountjf: function (jifen) {
        'use strict';
        var that = this;
        that.countscore += parseInt(jifen);
        $('#loginShow').find('span').text(that.countscore);
    },

    /**
     * 页面提示信息方法
     * @param megstr 提示的内容
     */
    showTip: function (megstr) {
        'use strict';
        var tips;
        var content = megstr;
        var len = arguments.length;
        if (len === 3) {
            tips = $('#allshow');
            content = '<p>' + arguments[0] + '</p><p>' + arguments[1] + '</p>';
        }
        if (len === 2) {
            tips = $('.msg');
        } else {
            tips = $('#tips');
        }
        tips.find('p').html(content);
        tips.show();
        setTimeout(function () {
            tips.hide();
        }, 2000);
    }
};
$(function () {
    'use strict';
    var main = new Main();
    main.init();
});


   