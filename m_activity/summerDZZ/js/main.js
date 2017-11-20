/**
 * Created by user on 2016/8/2.
 */

$(function () {
    'use strict';
    var IScroll = window.IScrollLite2,
        iscroll = null;
    var slideFilterBox = window.Verification;
    var smsLogin = window.smsLogin;
    var intervalObj;
    var scrollingBox;
    var scrollingInterval;
    var reachedBottom = false;
    var bottom;
    var flag = true;
    var curTime = 60;
    var canScroll = false;
    var ruleBang = $('.dzz-guize');
    var dzzLogin = $('.dzz-login');
    var getCode = $('#getCode');
    var againCode = $('#againCode');
    var codeTime = $('#codeTime');
    var askTitle = $('.cont').find('h3');
    var askAlert = $('.dzz-ask');
    var bxBox1 = $('#dzz-box1');
    var bxBox5 = $('#dzz-box5');
    var btnClick = bxBox1.find('.dzz-btn');
    var getPrize;
    var pointOrShell = '';
    var submitIssueFlag = true;
    var startX,startY;
    init();
    /**
     * 数据初始化
     */
    function init() {
        // 页面滚动控制
        initScrolling();
        // 请求10条问题
        directlyRequest();
        // 更新积分
        updateFen();
        // 页面滚动事件绑定
        $(window).scroll(function () {
            $('.slide-up').hide();
        });
        // 开始答题绑定事件
        $('.a-dati').on('click', answerOffset);
        // 规则和排行榜事件
        ruleBang.find('.flor').on('click', function () {
            $('.dzz-guizetk').show();
            canScroll = true;
        });
        ruleBang.find('.flol').on('click', function () {
            window.location.href = '/huodongAC.d?m=rankingList&class=BeachBattleHc';
        });
        // 换一换按钮绑定事件
        $('.change').find('img').on('click', function (evt) {
            distingAnimate(evt);
        });
        // 立即答题绑定事件
        $('#issueZone').on('click', 'span', function () {
            answerIssue(this);
        });
        // 用户登录浮层事件绑定
        getCode.on('click', verifyCode);
        againCode.on('click', verifyCode);
        $('.dzz-onload').on('click', identifyCode);
        // 回答问题浮层事件绑定，返回，提交，继续答题
        $('.a-left').on('click', function () {
            askAlert.hide();
            canScroll = false;
        });
        $('.ask-tijiao').on('click', function () {
            if(submitIssueFlag) {
                submitIssueFlag = false;
                issueSubmit();
            }
        });
        $('.dzz-box:not(#dzz-box1,#dzz-box5)').find('.dzz-btn').on('click', function () {
            $('.dzz-box').hide();
            canScroll = false;
        });
        $('.cont .a-close').on('click', function () {
            // 活动规则弹窗
            $('.dzz-guizetk').hide();
            // 回答问题弹窗
            askAlert.hide();
            // 登录弹窗
            dzzLogin.hide();
            $('.dzz-box').hide();
            canScroll = false;
        });
        // 登录页面点击处本身位置外，隐藏
        dzzLogin.find('.cont').on('click', function (evt) {
            evt.stopPropagation();
        });
        dzzLogin.on('click', function () {
            // 登录弹窗
            dzzLogin.hide();
        });
        $('body').on('touchmove', function (evt) {
            if(canScroll) {
                evt.preventDefault();
            }
        });
        var maxScroll = 0,
            startY = 0;
        var txtform = $('.txtform');
        txtform.on('touchstart',function (ev) {
            var touch = ev.originalEvent.changedTouches[0];
            var y = Number(touch.pageY);
            // 记录触点初始位置
            startY = y;
        }).on('touchmove',function (ev) {
            console.log('滚动高度'+this.scrollHeight +'实际高度'+this.offsetHeight+'滚动top'+this.scrollTop);
            var touch = ev.originalEvent.changedTouches[0];
            var y = Number(touch.pageY);
            var ys = y-startY;
            var scrollTop = $(this).scrollTop();
            if (ys > 0) {
                if (scrollTop) {
                    ev.stopPropagation();
                }
            }else if (ys < 0) {
                if (scrollTop <= maxScroll - 2) {
                    ev.stopPropagation();
                }
            }
        }).on('input',function () {
            maxScroll = this.scrollHeight - this.offsetHeight;
        });
        btnClick.on('click', function () {
            bxBox1.hide();
            bxBox5.show();
            setTimeout(function () {
                bxBox5.hide();
                if(getPrize === true) {
                    if(pointOrShell === 'shel') {
                        $('#dzz-box3').show();
                    } else {
                        $('#dzz-box2').show();
                        var score = $('#myScore');
                        score.val(parseInt(score.val(),10) + parseInt(pointOrShell,10));
                        var jf = $('.dzz-my span');
                        jf.text(score.val());
                    }
                }else if(getPrize === false) {
                    $('#dzz-box4').show();
                }
            }, 1200);
        });
    }
    // 跳转到问题区域
    function answerOffset() {
        var offset = $('.dzz-kuang').offset();
        $('html,body').animate({
            scrollTop: offset.top
        }, 800);
    }
    // 点击获取验证码函数
    function verifyCode() {
        var phone = $('.phone').val();
        var bool = slideFilterBox.isMobilePhoneNumber(phone);
        if (phone) {
            if (bool) {
                smsLogin.send(phone, function () {
                    popup('发送验证码成功！');
                    getCode.hide();
                    againCode.hide();
                    codeTime.show();
                    intervalObj = setInterval(setRemaintime, 1000);
                }, function (json) {
                    popup(json);
                });
            } else {
                popup('手机号格式错误');
            }
        } else {
            popup('请输入手机号');
        }
    }

    // 验证码登录确认
    function identifyCode() {
        var phoneNumber = $('.phone').val();
        var ideCode = $('.re-code').val();
        var bool = slideFilterBox.isMobilePhoneNumber(phoneNumber);
        if (phoneNumber) {
            if (bool) {
                if (ideCode) {
                    smsLogin.check(phoneNumber, ideCode,
                        function () {
                            popup('登录成功');
                            dzzLogin.hide();
                            window.location.reload();
                            canScroll = false;
                            answerOffset();
                        },
                        function (data) {
                            popup(data);
                        });
                } else {
                    popup('请输入验证码');
                }
            } else {
                popup('手机号格式错误');
            }
        } else {
            popup('请输入手机号');
        }
    }

    // 设置倒计时时间
    function setRemaintime() {
        if (!curTime) {
            clearInterval(intervalObj);
            codeTime.hide();
            againCode.show();
            curTime = 60;
            codeTime.val('重新发送' + curTime + 'S');
        } else {
            curTime--;
            codeTime.val('重新发送' + curTime + 'S');
        }
    }

    // 页面滚动函数
    function scrolling() {
        // 滚动值++，当滚动到底部时候+1值不变。
        var origin = scrollingBox.scrollTop++;
        if (origin === scrollingBox.scrollTop) {
            // 第一次滚动到底部复制一个ul加入到滚动列表中
            if (!reachedBottom) {
                scrollingBox.innerHTML += scrollingBox.innerHTML;
                reachedBottom = true;
                bottom = origin;
                // 以后每次滚动到第二个ul底部时候，直接跳转到第二个顶部。
            } else {
                scrollingBox.scrollTop = bottom;
            }
        }
    }

    // 获奖信息滚动
    function initScrolling() {
        // 获取中奖的接口数据
        scrollingBox = document.getElementById('dzz-xinxi');
        var len = $(scrollingBox).find('li').length;
        clearInterval(scrollingInterval);
        if (len > 2) {
            scrollingInterval = setInterval(scrolling, 50);
        }
    }

    function directlyRequest() {
        var wrap = $('#wrap');
        var second = wrap.children().eq(1);
        var path = $('#path').val();
        var pageID = parseInt($('#pageID').val(), 10) + 1;
        var paras = '';
        if (pageID > 10) {
            pageID = 1;
        }
        $.ajax({
            type: 'get',
            url: '/huodongAC.d?m=changeQuestion&class=BeachBattleHc&page=' + pageID + '&pageSize=10',
            dataType: 'json',
            success: function (data) {
                var question = data.questionList;
                var l = question.length;
                $('#pageID').val(data.page);
                for (var i = 0; i < l; i++) {
                    paras += '<li id="' + question[i].askId + '"><p>' + question[i].askTitle
                        + '</p><span><img data-askid="' + question[i].askId + '" src="' + path
                        + 'm_activity/summerDZZ/images/pic-ljhd.png" width="100%"></span></li>';
                }
                second.empty().append(paras);
            },
            error: function (data) {
                popup(data.root.message);
            }
        });
    }

    // 换一换ajax请求
    function requestIssue(callback) {
        var para = '';
        var path = $('#path').val();
        var pageID = parseInt($('#pageID').val(), 10) + 1;
        if (pageID > 10) {
            pageID = 1;
        }
        $.ajax({
            type: 'get',
            url: '/huodongAC.d?m=changeQuestion&class=BeachBattleHc&page=' + pageID + '&pageSize=10',
            dataType: 'json',
            success: function (data) {
                var question = data.questionList;
                var l = question.length;
                $('#pageID').val(data.page);
                for (var i = 0; i < l; i++) {
                    para += '<li id="' + question[i].askId + '"><p>'
                        + question[i].askTitle + '</p><span><img data-askid="'
                        + question[i].askId + '" src="' + path + 'm_activity/summerDZZ/images/pic-ljhd.png" width="100%"></span></li>';
                }
                callback(para);
            },
            error: function (data) {
                popup(data.root.message);
            }
        });
    }

    function distingAnimate(evt) {
        var ct = {
            transition: '.8s all linear',
            transform: 'translateX(-100%)',
            '-webkit-transform': 'translateX(-100%)',
            '-moz-transform': 'translateX(-100%)',
            '-ms-transform': 'translateX(-100%)'
        };
        var j = {
            transition: '',
            transform: '',
            '-webkit-transform': '',
            '-moz-transform': '',
            '-ms-transform': ''
        };
        var event = evt ? evt : window.event;
        var eventID = $(event.target).parent().parent().attr('id');
        if (eventID === 'changeFirst') {
            if (flag) {
                changeIssue(ct, j);
            }
        } else if (eventID === 'changeSecond') {
            answerOffset();
            if (flag) {
                setTimeout(function () {
                    changeIssue(ct, j);
                }, 1000);
            }
        }
    }
    // 换一换执行动画
    function changeIssue(ct, j) {
        var wrap = $('#wrap');
        var first = wrap.children().eq(0);
        var second = wrap.children().eq(1);
        if (flag) {
            flag = false;
            first.css(ct);
            second.show();
            setTimeout(function () {
                second.css(ct);
            }, 0);
            setTimeout(function () {
                first.css('display','none').appendTo(wrap).css(j).find('li').remove();
                second.css(j);
                requestIssue(function (data) {
                    if (data) {
                        flag = true;
                    }
                    first.prepend(data);
                });
            }, 1200);
        }
    }
    function stopPropagation(e){
        e = e || window.event;
        e.stopPropagation && e.stopPropagation();
        e.cancelBubble = false;
    }
    // 点击立即回答问题
    function answerIssue(me) {
        var login = $('#logined');
        var txtform = $('.txtform');
        if (login.val()) {
            // 获取当前问题的text,并将内容赋值到弹窗进行显示
            var paraText = $(me).siblings().text();
            var htm = '<i></i>' + paraText + '<span>回答问题后才能获得宝箱哦</span>';
            var userid = $(me).children().attr('data-askid');
            askTitle.html(htm).attr('data-askid', userid);
            txtform.text('');
            askAlert.show();
            canScroll = true;
        } else {
            dzzLogin.show();
            canScroll = true;
        }
    }
    // 点击提交问题
    function issueSubmit() {
        var decodeLen = $('.txtform').text();
        var content = encodeURIComponent(decodeLen);
        var askID = askTitle.attr('data-askid');
        var len = askTitle.text().length - askTitle.find('span').text().length;
        var title = encodeURIComponent(askTitle.text().substr(0, len));
        if (decodeLen.length < 15) {
            submitIssueFlag = true;
            popup('回答内容不能少于15个字哦');
        }else if(decodeLen.length > 500) {
            submitIssueFlag = true;
            popup('回答内容不能大于500个字哦~');
        }else {
            $.ajax({
                type: 'post',
                url: '/huodongAC.d?m=answerQuestion&class=BeachBattleHc',
                data: {
                    content: content,
                    askId: askID,
                    title: title
                },
                dataType: 'json',
                success: function (data) {
                    getPrize = data.root.getPrize;
                    pointOrShell = data.root.pointOrShell;
                    var code = data.root.code;
                    if(code === '100') {
                        if (getPrize === true) {
                            askAlert.hide();
                            bxBox1.show();
                            submitIssueFlag = true;
                            if (data.root.pointOrShell !== 'shel') {
                                var box2 = $('#dzz-box2');
                                var point = data.root.pointOrShell;
                                var path = $('#path').val();
                                $('.box-wenzi').find('span').text(point);
                                var imgsrc;
                                if (point === '5') {
                                    imgsrc = path + 'm_activity/summerDZZ/images/pic-gold.png';
                                } else if (point === '10') {
                                    imgsrc = path + 'm_activity/summerDZZ/images/pic-gold10.png';
                                } else if (point === '20') {
                                    imgsrc = path + 'm_activity/summerDZZ/images/pic-gold20.png';
                                }
                                box2.find('.box2').find('img').attr('src', imgsrc);
                            }
                        }else if (getPrize === false) {
                            askAlert.hide();
                            bxBox1.show();
                            submitIssueFlag = true;
                            // 添加绑定请求事件，用来显示贝壳还是积分还是空宝箱
                        }
                    } else {
                        var message = data.root.message;
                        if(message === '' || message === 'null') {
                            message = '提交失败';
                        }
                        if(code === '101') {
                            message = '回答内容不能大于500个字哦~';
                        }
                        submitIssueFlag = true;
                        popup(message);
                    }
                },
                error: function () {
                    submitIssueFlag = true;
                    popup('提交失败');
                    askAlert.hide();
                    canScroll = false;
                    setTimeout(function () {
                        askAlert.show();
                        canScroll = true;
                    }, 1000);
                }
            });
        }
    }
    function updateFen() {
        var score = $('#myScore');
        var scoreVal = score.val();
        if(pointOrShell === '') {
            pointOrShell = '0';
        }
        var value = parseInt(scoreVal) + parseInt(pointOrShell,10) + '';
        score.val(value);
        var jf = $('.dzz-my span');
        jf.text(scoreVal);
    }
    // 信息提示弹层
    function popup(context) {
        var msg = $('#msg');
        msg.find('p').text(context);
        msg.show();
        setTimeout(function () {
            msg.hide();
        }, 1500);
    }
});

