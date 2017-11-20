/*
 * @Author: tankunpeng
 * @Date:   2015/8/31
 * @description: 拆红包 首页
 * @Last Modified by:   tankunpeng
 * @Last Modified time: 2015-09-09
 */
$(function () {
    'use strict';

    /* 页面初始化start*/
    // 获取所有input hidden 获取后台传过来的值
    var vars = {};
    $('input[type = hidden]').each(function (index, element) {
        vars[element.id] = element.value;
    });
    // url地址参数获取函数
    var urlArr = window.location.search.substring(1).split('&');
    var urlJson = {};
    for (var i = 0; i < urlArr.length; i++) {
        urlArr[i] = urlArr[i].split('=');
        urlJson[urlArr[i][0]] = urlArr[i][1];
    }
    // 弹出层操作时阻止默认滚动时间
    var jinzhi = 1;
    document.addEventListener('touchmove', function (e) {
        if (jinzhi === 0) {
            e.preventDefault();
            e.stopPropagation();
        }
    }, false);
    // 页面刷新进入时默认锚点
    var oldScrollTop = oldScrollTop || 'main';

    /* 页面初始化end*/
    //  动态调整页面字体大小start
    var docEl = $('html'),
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';

    function recalc() {
        var clientWidth = docEl.width();
        if (!clientWidth) {
            return false;
        }
        docEl.css('fontSize', 20 * (clientWidth / 320) + 'px');
        if (clientWidth >= 640) {
            docEl.css('fontSize', '40px');
        }
    }

    if (!document.addEventListener) {
        return;
    }
    window.addEventListener(resizeEvt, recalc, false);
    recalc();
    //  end
    // 加载缓冲动画
    var loaderBox = $('.loaderBox');
    var rankBtn = $('#rank');
    rankBtn.on('click', function () {
        loaderBox.show();
        setTimeout(function () {
            loaderBox.hide();
        }, 2000);
    });
    loaderBox.on('click', function () {
        loaderBox.hide();
    });
    var floatAlert = $('.floatAlert');

    // 增加时间控制
    var activityEnd = new Date();
    activityEnd.setFullYear(2015, 11, 2);
    activityEnd.setHours(0, 0, 0, 0);
    var timeEnd = activityEnd.getTime();
    var activetyNow = new Date();
    var timeNow = activetyNow.getTime();
    var tancheng = $('#tancheng');
    if (timeNow >= timeEnd) {
        floatAlert.show();
        tancheng.show().css('position', 'fixed');
        jinzhi = 0;
    }
    setTimeout(function () {
        floatAlert.css({
            position: 'absolute',
            height: $(document).height()
        });
    }, 1000);
    // 增加无返回问题列表情况处理
    var initFirstP = $('#firstP');
    var askLen = initFirstP.children().length;
    if (askLen === 1) {
        initFirstP.html('活动仅面向置业顾问,请使用认证后的手机号登录').css({
            'font-size': '.5rem',
            'text-align': 'center',
            height: '1.2rem',
            'line-height': '.5rem'
        }).addClass('flash');
    }
    var oTs = $('#ts');
    // 登录
    var login = $('#login');
    // 立即回答
    var que = $('#que');
    // 加载显示动画函数
    var isIOS9 = window.navigator.userAgent.toLowerCase().replace(/ /g, '').indexOf('iphoneos9');

    function showStyle(obj, tmpTop, top) {
        // 禁止触摸滚动
        // jinzhi = 0;
        obj.show().css('top', $(document).scrollTop());
        setTimeout(function () {
            obj.css({
                transition: '.5s all ease',
                transform: 'translateY(' + tmpTop + ')',
                '-webkit-transform': 'translateY(' + tmpTop + ')',
                '-moz-transform': 'translateY(' + tmpTop + ')',
                '-ms-transform': 'translateY(' + tmpTop + ')',
                top: top
            });
        }, 50);
    }

    //  活动规则start
    var rule = $('.link');
    // 点击关闭(包括关闭按钮和浮层)
    var oClose = $('.closeAll');
    // 提交框-内容
    var askContent = $('#askContent');
    rule.on('click', function () {
        jinzhi = 0;
        floatAlert.show();
        oTs.css('top', $(document).scrollTop());
        showStyle(oTs, '20px', $(document).scrollTop());
    });
    var transInit = {transition: '', transform: '', '-webkit-transform': '', '-moz-transform': '', '-ms-transform': ''};
    oClose.on('click', function () {
        floatAlert.hide();
        // 隐藏规则
        oTs.hide().css(transInit);
        // 隐藏登录框
        login.hide().css(transInit);
        // 隐藏提交框
        que.hide().css(transInit);
        // 清空问答框文本
        askContent.val('');
        // 隐藏活动结束消息
        tancheng.hide();
        // 解除触摸禁止
        jinzhi = 1;
    });
    //  end

    // 判断用户是否登录,未登录的话弹出登录框start
    // 今日回答
    var todayAsk = $('#todayAsk');
    // var todayAskNum = parseInt(todayAsk.text().match(/\d+/g)[0]);
    var timer = null;

    function showLogin() {
        jinzhi = 0;
        floatAlert.show();
        showStyle(login, '100px', $(document).scrollTop());
    }

    // 获取验证码
    var getCode = $('#getCode');
    // 设置获取验证码开关
    var allowGet = true;
    var timeCount = 60;

    function toDou(num) {
        return num < 10 ? '0' + num : num;
    }

    function updateTime() {
        allowGet = false;
        getCode.val('重新发送(' + toDou(timeCount) + ')').addClass('getingCode');
        clearInterval(timer);
        timer = setInterval(function () {
            timeCount--;
            getCode.val('重新发送(' + toDou(timeCount) + ')');
            if (timeCount < 0) {
                clearInterval(timer);
                getCode.val('获取验证码').removeClass('getingCode');
                timeCount = 60;
                allowGet = true;
            }
        }, 1000);
    }

    // 获取手机验证码
    var phone = $('#phone');
    var mobileReg = /^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$/;
    getCode.on('click', function () {
        if (allowGet) {
            if (!mobileReg.test(phone.val())) {
                alert('请输入正确格式的手机号~');
                return;
            }
            updateTime();
            $.getJSON('/user.d?m=regetvcode_lottery&phone=' + phone.val() + '&times=first', function (data) {
                var status = data.root.status;
                var message = data.root.message;
                alert(message);
                if (status !== '100') {
                    clearInterval(timer);
                    getCode.val('获取验证码').removeClass('getingCode');
                    timeCount = 60;
                    allowGet = true;
                }
            });
        }
    });
    // 提交验证码
    var loginBtn = $('#loginBtn');
    var inputCode = $('#inputCode');
    loginBtn.on('click', function () {
        if (!phone.val().trim()) {
            alert('手机号不能为空~');
            return;
        }
        if (!inputCode.val().trim()) {
            alert('验证码不能为空~');
            return;
        }
        login.hide().css(transInit);
        floatAlert.fadeOut(300);
        $.getJSON('/activity.d?m=checkVCode', {checkCode: inputCode.val(), phone: phone.val()}, function (data) {
            var checkStatus = data.root.status;
            if (checkStatus === '100') {
                alert('登录成功~');
                window.location.href = '/huodongAC.d?class=ChaiHongBaoHc&m=index&city='+ vars.city + '&page=' + (page-1);
            } else {
                alert('验证码错误，请重新输入~');
                showLogin();
            }
        });
    });
    // 今日问答
    /*todayAsk.on('click', function () {
        //检测活动是否已经结束
        if (timeNow >= timeEnd) {
            return false;
        }

        if (!vars.userId) {
            showLogin();
        } else {
            todayAsk.attr('href', 'http://m.fang.com/ask/?c=ask&a=myAsk');
        }
    });*/
    //  轮播滚动获奖消息start(一期需求，二期暂时砍掉)
    /*var demo = $('#demo1');
     var demoLi = demo.find('li');
     var demoLiH = demoLi.outerHeight();
     if (demoLi.length && demoLi.length > 1) {
     setInterval(function () {
     demo.css({
     transition: '1s all ease',
     transform: 'translateY(-' + demoLiH + 'px)',
     '-webkit-transform': 'translateY(-' + demoLiH + 'px)'
     });
     setTimeout(function () {
     demo.css({
     transition: '',
     transform: '',
     '-webkit-transform': ''
     }).find('li:first').appendTo(demo);
     }, 2000);
     }, 3000);
     }*/
    //  end

    //  点击'去答题'实现锚点平滑滚动start(一期需求，二期暂时砍掉)
    /*var root = $('html,body');
     var oQdt = $('.qdt');
     $('.goAsk').on('click', function () {
     root.animate({
     scrollTop: $(oQdt.attr('href')).offset().top
     }, 500);
     return false;
     });*/
    //  end

    // 立即回答
    var mainCentent = $('#mainCentent');
    var askTitle = $('#askTitle');
    mainCentent.on('click', '.nowAsk', function () {
        // 检测活动是否已经结束
        if (timeNow >= timeEnd) {
            return false;
        }
        var me = $(this);
        oldScrollTop = me.attr('data-askId');
        if (!vars.userId) {
            showLogin();
        } else {
            floatAlert.show();
            askContent.val('');
            showStyle(que, '70px', $(document).scrollTop());
            askTitle.attr('data-askId', me.attr('data-askId')).html($('#' + me.attr('data-askId')).find('h2').html());
        }
    });
    // end

    // 问答提交
    var hbClose = $('#hbClose');
    var hbAnimate = $('#hbAnimate');
    var oImg = hbAnimate.find('img');
    // 图片随机版本号
    var randomV = new Date().getTime();
    // 红包
    var hbOpen = $('#hbOpen');
    // 剩余红包个数
    var hbmsg = hbOpen.find('p');
    // 奖金
    var money = $('#money');
    // 继续答题
    var goOn = $('#goOn');
    // 初始化页数
    var page = urlJson.page ? urlJson.page : 1;
    //  提交成功页面跳转
    function pageJump() {
        if (urlJson.page) {
            urlJson.page = page - 1;
            urlJson.rand = randomV;
            var tmpArr = [];
            for (var name in urlJson) {
                if (urlJson.hasOwnProperty(name)) {
                    tmpArr.push(name + '=' + urlJson[name]);
                }
            }

            window.location.href = location.origin + location.pathname + '?' + tmpArr.join('&') + '#' + oldScrollTop;
        } else {
            urlJson.rand = randomV;
            window.location.href = location.href.replace('#main', '') + '&page=' + (page - 1) + '#' + oldScrollTop;
        }
    }

    // 问答提交
    var submit = $('#submit');
    // 获取主域名
    var mainSite = window.location.origin;
    var redPackage = $('#redPackage');
    // 发光背景
    var hbBoxBg = $('#hbBoxBg');
    // 奖金
    var prize = 0;
    // 剩余红包数
    var leftPrizeNumber = 0;
    submit.on('click', function () {
        var parmage = {};
        var askVal = askContent.val();
        if (!askVal || askVal.trim().length < 15) {
            alert('回答内容不能为空或小于15个字~');
            return;
        }
        parmage.class = 'ChaiHongBaoHc';
        parmage.m = 'totalAnswer';
        parmage.content = encodeURIComponent(askContent.val());
        parmage.askid = askTitle.attr('data-askId');
        parmage.title = encodeURIComponent(askTitle.html().substring(3));
        parmage.page = urlJson.page;
        // 隐藏提交框
        que.hide().css(transInit);
        floatAlert.hide();
        $.ajax({
            url: mainSite + '/huodongAC.d',
            type: 'POST',
            data: parmage,
            dataType: 'json',
            success: function (data) {
                var code = data.root.code;
                var message = data.root.message ? data.root.message : '提交失败！';
                prize = data.root.prize;
                leftPrizeNumber = data.root.leftPrizeNumber;
                if (code === '100') {
                    floatAlert.show();
                    // 清空框内文本
                    askContent.val('');
                    // 判断回答数是否小于等于10(奖金数大于0则为前10个)
                    if (prize > 0 && leftPrizeNumber >= 0) {
                        redPackage.show();
                        setTimeout(function () {
                            hbBoxBg.show();
                        }, 50);
                    } else {
                        alert('提交成功~');
                        floatAlert.fadeOut('500', function () {
                            pageJump();
                        });
                    }
                } else {
                    alert(message);
                    jinzhi = 1;
                    if (parseInt(code) !== 110) {
                        // 显示浮层
                        floatAlert.fadeIn(300);
                        // 显示提交框
                        que.fadeIn(300);
                    }
                }
            }
        });
    });
    // 开启红包动画
    hbClose.on('click', function () {
        hbAnimate.show();
        oImg.attr('src', oImg.attr('data-src') + '?v=' + randomV);
        setTimeout(function () {
            hbClose.hide();
        }, 500);
        setTimeout(function () {
            money.html(prize + '元');
            if (leftPrizeNumber <= 0) {
                hbmsg.html('今天的机会已经用完了，<br>记得明天再来哦~');
            } else {
                hbmsg.html('<b>还有' + leftPrizeNumber + '个红包在等着您哦~</b>');
            }

            hbOpen.show();
            hbAnimate.hide();
        }, 850);
    });
    // 继续答题
    goOn.on('click', function () {
        floatAlert.fadeOut('500');
        redPackage.fadeOut('500', function () {
            pageJump();
        });
    });
    // end
    // 换一换
    var change = mainCentent.find('.change');
    // 每页题数
    var top = '10';
    var tmpString = '';
    // 获取列表函数请求函数封装
    function getPageData(callback) {
        var parmage = {};
        parmage.class = 'ChaiHongBaoHc';
        parmage.m = 'change';
        page++;
        if (page > 10) {
            page = 1;
        }
        parmage.page = page;
        parmage.city = vars.city;
        parmage.top = top;
        $.ajax({
            url: mainSite + '/huodongAC.d',
            type: 'GET',
            data: parmage,
            dataType: 'json',
            success: function (data) {
                tmpString = '';
                var tmpArr = data.root.questionList;
                page = data.root.page;
                for (var i = 0; i < tmpArr.length; i++) {
                    tmpString += '<div id="' + tmpArr[i].askId + '" class="box">\
                                        <h2>' + (i + 1) + '. ' + tmpArr[i].askTitle + '</h2>\
                                        <div class="btn-box">\
                                            <a href="javascript:;" class="nowAsk" data-askid="' + tmpArr[i].askId + '">立即回答</a>\
                                        </div>\
                                    </div>';
                }
                callback(tmpString);
            }
        });
    }

    // 首次进入页面执行一次
    var firstChange = mainCentent.children().eq(1).find('.change');
    // 判断数据是否加载OK
    var loadedDate = false;
    getPageData(function (data) {
        if (data) {
            loadedDate = true;
        }
        firstChange.siblings().remove();
        firstChange.before(data);
    });
    // 换一换切换样式
    var changeAnimate = {
        transition: '1s all ease-out',
        transform: 'translateX(-100%)',
        '-webkit-transform': 'translateX(-100%)',
        '-moz-transform': 'translateX(-100%)',
        '-ms-transform': 'translateX(-100%)'
    };
    change.on('click', function () {
        var mainCententDiv = mainCentent.children();
        var firstP = mainCententDiv.eq(0);
        var secondP = mainCententDiv.eq(1);
        if (loadedDate) {
            firstP.css(changeAnimate);
            secondP.show();
            setTimeout(function () {
                secondP.css(changeAnimate);
            }, 0);
            setTimeout(function () {
                firstP.css('display', 'none').appendTo(mainCentent).css(transInit).find('.change').siblings().remove();
                loadedDate = false;
                secondP.css(transInit);
                getPageData(function (data) {
                    if (data) {
                        loadedDate = true;
                    }
                    firstP.prepend(data);
                });
            }, 1100);
        } else {
            alert('您点的也太快了吧，数据未加载完呢~');
        }
    });
    // end
});
