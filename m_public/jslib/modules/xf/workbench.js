/**
 * C端账户工作台服务中心
 * 2016年5月6日
 */
define('modules/xf/workbench', ['jquery', 'hammer/2.0.4/hammer'], function (require) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;
    var Util = require('util/util');
    var sfut = Util.getCookie('sfut');

    $('.workbench-icon').css('z-index', '2000');
    var aDiv = $('.workbench div');
    var deg = 360 / aDiv.length;
    var correction = deg / 2;
    for (var i = 0; i < aDiv.length; i++) {
        if ($(aDiv[i]).children('a').length) {
            aDiv[i].style.cssText = '-webkit-transform:rotate(' + (-i * deg - correction) + 'deg);transform: rotate(' + (-i * deg - correction) + 'deg)';
            $(aDiv[i]).children('a')[0].style.cssText = '-webkit-transform:rotate(' + (i * deg + correction) + 'deg);transform: rotate(' + (i * deg + correction) + 'deg)';
        } else {
            aDiv[i].style.cssText = '-webkit-transform:rotate(' + (-i * deg - correction) + 'deg);transform: rotate(' + (-i * deg - correction) + 'deg)';
        }
    }

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

    // 默认为第一次点击
    var firstClick = true;
    // 此时旋转过得角度
    var nowRotate = 0;
    // 声明两个点的对象
    var startPoint = new Object();
    var nextPoint = new Object();
    // 转盘中心相对于屏幕位置
    var centerPoint = new Object();
    // 转盘容器左上角相对于屏幕位置
    var workbenchBoxPosition = new Object();

    // 登录后获取用户头像地址
    var photourl = '//static.soufunimg.com/common_m/m_public/201511/images/user_1.jpg';
    var userphone;
    // 用户头像
    $('.workbench-user img').attr('src', photourl);
    function getInfo(data) {
        userphone = data.mobilephone || '';
        photourl = data.photourl;
        if (photourl.indexOf('img/xf/head.gif') != -1) {
            photourl = '//static.soufunimg.com/common_m/m_my/images/sf-uc-userHDefault.png';
        }
        // 用户头像
        $('.workbench-user img').attr('src', photourl);
    }

    // 调用ajax获取登陆用户信息
    if (sfut) {
        vars.getSfutInfo(getInfo);
    }

    // 工作台按钮点击事件
    $('.workbench-icon').on('click', function () {
        // 阻止页面滑动
        unable();
        // 隐藏入口按钮
        $('.workbench-icon').hide();
        // 显示转盘
        $('.workbenchBox').show();
        // 自动转一下
        /*setTimeout(function () {
         inertiaRotate(-30);
         }, 10);*/
        // 第一次点击时初始化
        if (firstClick) {
            // 存储转盘中每个内容初始时角度的数组
            getStartRotate();
            // 转盘中心相对于屏幕位置赋值
            centerPoint.x = $('.workbench-box').position().left + 130;
            centerPoint.y = $('.workbench-box').position().top + 130;
            // 转盘容器左上角相对于屏幕位置赋值
            workbenchBoxPosition.x = $('.workbench-box').position().left;
            workbenchBoxPosition.y = $('.workbench-box').position().top;
            // 变为非第一次
            firstClick = false;
        }
    });

    // 点击工作台蒙层事件
    $('.workbenchBox').on('click', function (e) {
        if (e.target.className == 'work-float') {
            // 恢复阻止页面滑动
            enable();
            // 隐藏转盘
            $('.workbenchBox').hide();
            // 显示入口按钮
            $('.workbench-icon').show();
        }
    });

    // 点击工作台头像
    $('.workbench-user').on('click', function () {
        // 没登录跳转到登录页面
        if (!sfut) {
            var thisPage = window.location.href;
            // 跳转到登录页面
            window.location.href = location.protocol + '//m.fang.com/passport/login.aspx?burl=' + encodeURIComponent(thisPage);
        }
    });

    // 存储转盘中每个内容初始时角度的数组
    var aStartRotate = new Array();
    var $workbenchA = $('.workbench a');
    // 存储转盘中每个a标签初始时的角度存入数组
    var getStartRotate = function () {
        for (var i = 0; i < $workbenchA.length; i++) {
            var transform = $workbenchA.eq(i).css('transform').split(',');
            // matrix矩阵的前四个值放入数组中
            var matrix = new Array();
            for (var j = 0; j < 4; j++) {
                if (j == 0) {
                    matrix[j] = transform[j].split('(')[1];
                } else {
                    matrix[j] = transform[j];
                }
            }
            // 当期a标签的rotate放入数组
            aStartRotate[i] = getmatrix(matrix[0], matrix[1], matrix[2], matrix[3]);
        }
    };

    // 返回rotate度数的方法
    function getmatrix(a, b, c, d) {
        var aa = Math.round(180 * Math.asin(a) / Math.PI);
        var bb = Math.round(180 * Math.acos(b) / Math.PI);
        var cc = Math.round(180 * Math.asin(c) / Math.PI);
        var dd = Math.round(180 * Math.acos(d) / Math.PI);
        var deg = 0;
        if (aa == bb || -aa == bb) {
            deg = dd;
        } else if (-aa + bb == 180) {
            deg = 180 + cc;
        } else if (aa + bb == 180) {
            deg = 360 - cc || 360 - dd;
        }
        return deg >= 360 ? 0 : deg;
    }

    // 大转盘惯性旋转的方法
    var intervalRotate;

    function inertiaRotate(v) {
        // 清理
        clearInterval(intervalRotate);
        // 重新开始
        intervalRotate = setInterval(function () {
            rotate(nowRotate + v);
            // 减速
            v = 0.8 * v;
            nowRotate = nowRotate + v;
            // 清理
            if (Math.abs(v) < 0.01) {
                clearInterval(intervalRotate);
            }
        }, 10);
    }

    // 自动旋转
    function autoRotate(v) {
        setInterval(function () {
            rotate(nowRotate + v);
            nowRotate = nowRotate + v;
        }, 10);
    }

    // autoRotate(1);

    // 大盘旋转的方法
    function rotate(deg) {
        // 大转盘旋转
        $('.workbench').css('transform', 'rotate(' + deg + 'deg)');
        // $('.workbench')[0].style.transform = 'rotate(' + deg + 'deg)';
        // 大转盘内容反方向转
        for (var i = 0; i < $workbenchA.length; i++) {
            $workbenchA.eq(i).css('transform', 'rotate(' + (aStartRotate[i] - deg) + 'deg)');
        }
        // $('.workbench-int').html($('.workbench').css('transform'));
    }

    // 初始化hammer
    var hammer = new Hammer($('.workbench')[0]);
    // 允许识别垂直pan和swipe事件
    hammer.get('pan').set({direction: Hammer.DIRECTION_ALL});
    // 声明两点和center的斜率
    var startDelta, nextDelta;
    // 声明本次转动的方向
    var isClockwise = 1;
    var firstPan = true;

    // 滑动开始
    hammer.on('panstart', function (e) {
        // 第一个点赋值
        startPoint.x = e.center.x;
        startPoint.y = e.center.y;
    });

    // 滑动过程中
    hammer.on('pan', function (e) {
        // 第一个点斜率计算
        startDelta = (startPoint.y - centerPoint.y) / (startPoint.x - centerPoint.x);
        // 第二个点赋值
        nextPoint.x = e.center.x;
        nextPoint.y = e.center.y;
        // 第二个点斜率计算
        nextDelta = (nextPoint.y - centerPoint.y) / (nextPoint.x - centerPoint.x);
        // 加载后第一次不执行操作
        if (firstPan) {
            firstPan = false;
            return;
        }

        // 判断当前旋转方向
        if (nextDelta - startDelta < 0) {
            // 逆时针
            isClockwise = -1;
        } else if (nextDelta - startDelta > 0) {
            // 顺时针
            isClockwise = 1;
        }

        // 同步该方向旋转值
        nowRotate += Math.abs(e.velocity) * 15 * isClockwise % 360;

        // 同步该方向旋转
        rotate(nowRotate);
        // 第二个点变成第一个点
        startPoint = nextPoint;
        if (startPoint.x < workbenchBoxPosition.x || startPoint.y < workbenchBoxPosition.y || startPoint.y > workbenchBoxPosition.y + 260) {
            // 判断旋转方向，调用惯性旋转方法
            // inertiaRotate(Math.abs(e.velocity) * 10 * isClockwise);
        }
    });

    // 滑动结束
    hammer.on('panend', function (e) {
        // 判断旋转方向，调用惯性旋转方法
        // inertiaRotate(Math.abs(e.velocity) * 10 * isClockwise);
    });

    // 允许按钮自由拖动的方法
    var dragIcon = function () {
        var nowRight = parseInt($('.workbench-icon').css('right'));
        var nowBottom = parseInt($('.workbench-icon').css('bottom'));
        var deltaX, deltaY;
        // hammerIcon
        var hammerIcon = new Hammer($('.workbench-icon')[0]);
        // 允许识别垂直pan和swipe事件
        hammerIcon.get('pan').set({direction: Hammer.DIRECTION_ALL});
        hammerIcon.on('panstart', function (e) {
            unable();
        });
        hammerIcon.on('pan', function (e) {
            unable();
            deltaX = e.deltaX;
            deltaY = e.deltaY;
            $('.workbench-icon').css({right: nowRight - deltaX, bottom: nowBottom - deltaY});
        });
        hammerIcon.on('panend', function (e) {
            enable();
            nowRight -= deltaX;
            nowBottom -= deltaY;
            endPosition(nowRight, nowBottom);
        });

        var windowWid = $(window).width();
        var windowHei = $(window).height();
        var endPosition = function (x, y) {
            if (x < 0) {
                nowRight = 0;
            } else if (x > windowWid - 34) {
                nowRight = windowWid - 34;
            }
            if (y < 0) {
                nowBottom = 0;
            } else if (y > windowHei - 34 - 100) {
                nowBottom = windowHei - 34 - 100;
            }
            $('.workbench-icon').css({right: nowRight, bottom: nowBottom});
            enable();
        };

        $('.workbench-icon').on('touchstart', function () {
            unable();
        });
        $('.workbench-icon').on('touchend', function () {
            enable();
        });
    };
    // dragIcon();

    // 实时询价
    $('.ssxj').on('click', function () {
        var locationHref = window.location.href;
        // 如果登陆了
        if (sfut) {
            // 如果绑定手机号了
            if (userphone) {
                window.location.href = $(this).attr('data-href');
            } else {
                window.location.href = 'https://m.fang.com/passport/resetmobilephone.aspx?burl=' + encodeURIComponent(locationHref);
            }
        } else {
            window.location.href = 'https://m.fang.com/passport/login.aspx?burl=' + encodeURIComponent(locationHref);
        }
    });

    // im
    $('.chatxfnew').on('click', function () {
		// 恢复阻止页面滑动
		enable();
        // 隐藏转盘
        $('.workbenchBox').hide();
        // 显示入口按钮
        $('.workbench-icon').show();
    })
});
