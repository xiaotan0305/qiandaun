/*
 * @File: huXingInfo
 * @Author: yangfan
 * @Create Time: 2016-04-01 09:50:08 优化弹出通知对话框代码,添加注释
 * @Last modified by:   user
 * @Last Modified Time: 2016-04-21 14:44:38
 */
define('modules/xf/huXingInfo', [
    'jquery',
    'util/util',
    'swipe/3.10/swiper',
    'modules/xf/shadowCall',
    'verifycode/1.0.0/verifycode',
    'modules/xf/workbench',
    'modules/xf/xfactivity',
    'app/1.0.0/appdownload'
], function (require, exports, module) {
    'use strict';
    // jquery库
    var $ = require('jquery');
    // swiper库，进行图片滑动
    var Swiper = require('swipe/3.10/swiper');
    // util 工具模块，getCookie 用户登录信息
    var cookiefile = require('util/util');
    // 影子号码，？不明白引入目的
    var shadowCall = require('modules/xf/shadowCall');
    // 获取 _vars 全局变量等
    var vars = seajs.data.vars;
    // 获取 本地存储
    var localStorage = vars.localStorage;
    // 获取 用户信息
    var sfut = cookiefile.getCookie('sfut');
    // 获取手机验证码
    var verifycode = require('verifycode/1.0.0/verifycode');
    // 登录后获取用户名，手机号和用户ID
    var username, userid, userphone;

    /**
     * 回调获取用户信息
     * @param  {Object} data 用户信息对象
     */
    function getInfo(data) {
        username = data.username || '';
        userphone = data.mobilephone || '';
        userid = data.userid || '';
    }

    // 调用ajax获取登陆用户信息
    if (sfut) {
        vars.getSfutInfo(getInfo);
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

    // 电话号码替换
    shadowCall();

    // 横版图片宽度设置为屏幕宽度
    var windowWid = $(window).width() ;
    var imgHei = windowWid / 3 * 2;
    $('.swiper-wrapper img').each(function () {
        var $this = $(this);
        if ($this.height() < $this.width()) {
            $this.width(windowWid);
            $this.height(imgHei);
        } else if ($this.height() >= $this.width()) {
            $this.height(imgHei);
        }
    });
    $('.xqfocus').css('visibility', 'visible');

    // 实现多张图片的滑动查看效果
    var img = $('.xqfocus img');
    var picLength = img.length;
    if ($('.num').length) {
        $('.num').html(img.eq(0).attr('alt').replace(/[^\u4e00-\u9fa5]/gi, '') + 1 + '/' + picLength);
    }
    function imgHd() {
        new Swiper('.swiper-container', {
            // 可选选项，自动滑动
            // autoplay: 2000,
            speed: 500,
            parallax: true,
            pagination: '.swiper-pagination',
            onSlideChangeStart: function (swiper) {
                $('.num').html(img.eq(swiper.activeIndex).attr('alt').replace(/[^\u4e00-\u9fa5]/gi, '') + (swiper.activeIndex + 1) + '/' + picLength);
            },
            onSlideChangeEnd: function (swiper) {
                $('.num').html(img.eq(swiper.activeIndex).attr('alt').replace(/[^\u4e00-\u9fa5]/gi, '') + (swiper.activeIndex + 1) + '/' + picLength);
            }
        });
    }
    imgHd();

    // 在线沟通-------start
    var chatxf = function (zhcity, city, housetype, houseid, newcode, type, phone, channel, uname, aname, agentid, zhname, agentimg, username) {
        if (localStorage) {
            localStorage.setItem(String('x:' + username), encodeURIComponent(zhname) + ';' + agentimg + ';' + encodeURIComponent(vars.projname + '的'));
        }
        $.ajax({
            url: '/data.d?m=houseinfotj' + '&city=' + city + '&housetype=' + housetype + '&houseid=' + houseid + '&newcode=' + newcode + '&type=' + type
            + '&phone=' + phone + '&channel=' + channel + '&agentid=' + agentid,
            async: false
        });
        setTimeout(function () {
            window.location = '/chat.d?m=chat&username=x:' + uname + '&city=' + city + '&type=wapxf';
        }, 500);
    };
    // 在线沟通-------end

    // 点评户型---start
    $('.ico-star').each(function () {
        var curStars = $(this).attr('star');
        for (var i = 0; i < curStars; i += 1) {
            $(this).find('i').eq(i).attr('class', 'active');
            if (curStars.indexOf('.5') !== -1) {
                $(this).find('i').eq(curStars - 0.5).attr('class', 'active half');
            }
        }
    });
    $('#clearfixid dd:last').append('<span>共' + vars.length + '张</span>');

    var dpcheckLogin = function () {
        if (sfut) {
            // window.location.href = '/xf.d?m=huxingcomment&city=' + vars.city + '&id=' + vars.newcode + '&hxid=' + vars.hxid;
            window.location.href = '/xf/' + vars.city + '/huXingComment/' + vars.newcode + '_' + vars.hxid + '.html';
        } else {
            alert('请登录后操作!');
            // var locationHref = '/xf.d?m=huxingcomment&city=' + vars.city + '&id=' + vars.newcode + '&hxid=' + vars.hxid;
            var locationHref = vars.mainSite + 'xf/' + vars.city + '/huXingComment/' + vars.newcode + '_' + vars.hxid + '.html';
            window.location.href = ' https://m.fang.com/passport/login.aspx?burl=' + encodeURIComponent(locationHref);
            return null;
        }
        return false;
    };
    // 点评户型---start
    // click-------start
    var click = function () {
        $('a[data-name="zxcommunication"]').each(function () {
            var data = $(this).attr('data-value').split(',');
            $(this).click(function () {
                chatxf(vars.getcityname, vars.city, 'xf', vars.newcode, '', 'chat', data[0], 'waphouseinfo',
                    data[1], data[2], data[3], data[4], data[5], data[6]);
            });
        });
        $('a[data-name="zxcommunicationafter"]').each(function () {
            var afterdata = $(this).attr('data-value').split(',');
            $(this).click(function () {
                chatxf(vars.getcityname, vars.city, 'xf', vars.newcode, '', 'chat', afterdata[0], 'waphouseinfo',
                    afterdata[1], afterdata[2], afterdata[3], afterdata[4], afterdata[5], afterdata[6]);
            });
        });
        $('#dpcheckLogin').click(function () {
            dpcheckLogin();
        });
        // 跳转点评列表页
        $('.dianping').click(function () {
            window.location.href = '/xf/' + vars.city + '/' + vars.newcode + '_' + vars.hxid + '/dianping.htm';
        });
    };
    module.exports = {
        init: function () {
            click();
        }
    };

    /**
     * 点击降价通知按钮，调用 showNotice 方法，显示通知对话框
     * @event #priceNotice#click
     */
    $('#priceNotice').click(function () {
        var data = $(this).attr('data-name').split(',');
        showNotice(data[0], data[1]);
    });

    /**
     * 点击通知对话框中的取消按钮，调用 hideNotice 方法，隐藏通知对话框
     * @event #priceNotice#click
     */
    $('#hideNotice').click(function () {
        hideNotice();
    });

    /**
     * 隐藏通知对话框
     */
    var tzBox = $('.tz-box');

    function hideNotice() {
        tzBox.hide();
    }

    /**
     * 显示通知对话框
     * @param {string} info 通知对话框的标题信息
     * @param {string} type 通知对话框的类型
     */
    function showNotice(info, type) {
        // type传入全局变量
        vars.xfType = type;
        // 成功获取用户登录信息并且用户有手机信息
        if (sfut && userphone) {
            // 验证码隐藏，填入用户手机号
            $('.yzm').hide();
            $('.phone').val(userphone);
        } else {
            // 置空手机号和验证码输入框
            $('#phonenumber').val('');
            $('#verificationcode').val('');
        }
        // 显示通知对话框
        $('.tz-tit span').text(info + '通知');
        $('.tz-word').text(info + '消息会通过手机短信通知您');
        tzBox.show();
    }

    /**
     * 对话框确定按钮点击，判断用户是否登录
     * @event
     */
    $('.tz-btn').on('click', '#qd', function () {
        // 验证电话输入
        var phone = $('.phone').val();
        var phoneFlag = checkPhone(phone);
        if (!phoneFlag) {
            return false;
        }

        // 判断用户是否登录，获取请求参数
        var isLogin = true,
            params;
        if (sfut && userphone) {
            params = {
                mobile: phone,
                city: vars.city,
                newCode: vars.newcode,
                xfType: vars.xfType,
                userName: username,
                userID: userid
            };
        } else {
            // 验证码验证
            var vCode = $('.vcode').val();
            var vcodeFlag = checkVcode(vCode);
            if (!vcodeFlag) {
                return false;
            }
            isLogin = false;
            params = {
                mobile: phone,
                city: vars.paramcity,
                newCode: vars.paramid,
                xfType: vars.xfType,
                vCode: vCode
            };
        }
        getDingYue(isLogin, params);
        // 开盘通知统计
        yhxw(77);
        return false;
    });

    /**
     * 获得订阅结果
     * @param  {string} mobile   手机号
     * @param  {string} city     城市名
     * @param  {string} newCode
     * @param  {string} xfType   类型
     * @param  {string} userName 用户名
     * @param  {string} userID   用户ID
     */
    function getDingYue(isLogin, params) {
        var url;
        if (isLogin) {
            url = [
                '/xf.d?m=dingyue',
                '&mobile=' + params.mobile,
                '&city=' + params.city,
                '&newcode=' + params.newCode,
                '&xftype=' + params.xfType,
                '&username=' + params.userName,
                '&userid=' + params.userID,
                '&status=login'
            ].join('');
        } else {
            url = [
                '/xf.d?m=dingyue',
                '&mobile=' + params.mobile,
                '&city=' + params.city,
                '&newcode=' + params.newCode,
                '&xftype=' + params.xfType,
                '&vcode=' + params.vCode
            ].join('');
        }

        $.get(url, function (data) {
            if (data.root.code === '100') {
                showMsg('订阅成功');
                tzBox.hide();
            } else {
                showMsg(data.root.message);
            }
        });
    }

    /**
     * 判断手机验证码是否合法
     * @param {string} e 用户输入验证码值
     */
    function checkVcode(e) {
        var parttenCheckcode = /^\d{4}$/;
        if (e === '' || e === null) {
            showMsg('验证码不能为空');
            return false;
        } else if (!parttenCheckcode.test(e)) {
            showMsg('验证码格式不正确');
            return false;
        }
        return true;
    }

    // 更多信息扩展
    var $ftable = $('.flextable'),
        $btnDown = $('#waphuxinxq_B02_04'),
        $btnUp = $('#waphuxinxq_B02_07');
    $btnDown.click(function () {
        getMore();
    });
    $btnUp.click(function () {
        hideMore();
    });

    function getMore() {
        $ftable.show();
        $('#waphuxinxq_B02_04').hide();
        $('#waphuxinxq_B02_07').show();
    }

    function hideMore() {
        $ftable.hide();
        $btnUp.hide();
        $btnDown.show();
    }

    // test-e
    function checkPhone(e) {
        var phone = e;
        var phoneReg = /^(13[0-9]|14[0-9]|15[0-9]|18[0-9]|17[0-9])\d{8}$/i;
        if (!phone) {
            showMsg('手机号不能为空');
            getPhoneVcodeclick();
            return false;
        } else if (!phoneReg.test(phone)) {
            showMsg('请输入正确的手机号');
            getPhoneVcodeclick();
            return false;
        }
        return true;
    }

    function getPhoneVcode() {
        var phone = $('.phone').val();
        var phoneFlag = checkPhone(phone);
        if (phoneFlag) {
            verifycode.getPhoneVerifyCode(phone,
                function () {
                    updateTime();
                },
                function () {
                    // 验证码错误
                    showMsg(' 验证码错误！');
                });
        }
    }

    function getPhoneVcodeclick() {
        $('#getPhoneVcode').one('click', function () {
            getPhoneVcode();
        });
    }

    getPhoneVcodeclick();

    var timeCount = 60;

    function updateTime() {
        $('.ipt-btn1').attr('class', 'ipt-btn1 disabled').attr('onclick', '').val('重新发送(' + timeCount + ')');
        timeCount--;
        if (timeCount >= -1) {
            setTimeout(updateTime, 1000);
        } else {
            $('.ipt-btn1').attr('class', 'ipt-btn1').val('获取验证码');
            getPhoneVcodeclick();
            timeCount = 60;
        }
    }

    // 在线咨询------------start
    $('#waphuxinxq_B05_01, .chatxfnew').click(function () {
        var charts = $(this).attr('data-chatxf').split(';');
        chatxf(charts[0], charts[1], charts[2], charts[3], charts[4], charts[5], charts[6], charts[7],
            charts[8], charts[9], charts[10], charts[11], charts[12], charts[13], charts[14]);
        yhxw(24);
    });
    // 打电话
    $('#waphuxinxq_B05_03').on('click', function () {
        yhxw(31);
    });
    // 收藏------------start
    $('a[name=collection]').on('click', function () {
        checkHousingCollection();
        yhxw(21);
    });
    var myselectid = Number(vars.myselectid);
    var $favoriteMsgId = $('#favorite_msg');

    function showMsg(msg) {
        $favoriteMsgId.html(msg).show().css({
            top: '250px'
        });
        setTimeout('$("#favorite_msg").hide(500);', 1500);
    }

    function checkHousingCollection() {
        if (sfut) {
            if (!myselectid) {
                HousingCollection();
            } else {
                delHousingCollection();
            }
        } else {
            // 去登陆
            alert('请登录后再进行收藏操作！');
            window.location.href = ' https://m.fang.com/passport/login.aspx?burl=' + encodeURIComponent(window.location.href);
        }
    }

    var keshoucang = true;
    function HousingCollection() {
        if (keshoucang) {
            keshoucang = false;
            var projname = vars.allprojname,
                address = vars.address,
                newcode = vars.newcode,
                city = vars.city,
                room = vars.room,
                hxid = vars.hxid;
            var url = '/xf.d?m=huXingAddMySelect';
            $.ajax({
                type: 'post',
                url: url,
                dataType: 'json',
                data: {
                    userid: userid,
                    projname: projname,
                    address: address,
                    city: city,
                    newcode: newcode,
                    room: room,
                    hxid: hxid
                },
                async: false,
                success: function (result) {
                    if (result.root.code === '100') {
                        $('#waphuxinxq_B05_02').attr('class', 'icon2 on');
                        myselectid = result.root.myselectid;
                        showMsg('收藏成功');
                    } else {
                        showMsg('收藏失败');
                    }
                    keshoucang = true;
                }
            });
        }
    }

    function delHousingCollection() {
        if (!userid) {
            userid = '';
        }
        var url = '/xf.d?m=huXingDelMySelect';
        $.ajax({
            type: 'post',
            url: url,
            data: {
                userid: userid,
                myselectid: myselectid,
                city: vars.city
            },
            dataType: 'json',
            async: false,
            success: function (result) {
                if (result.root.result === '100') {
                    $('#waphuxinxq_B05_02').attr('class', 'icon2');
                    myselectid = 0;
                    showMsg('取消收藏');
                }
            }
        });
    }

    // 近似户型点击跳转事件
    $('#hxsaucelist').on('click', 'li', function () {
        var href = $(this).attr('data-href');
        window.location.href = href;
    });
    // 预约看房，优惠，团购,修改跳转链接  time: 2015.11.2--------------start
    // 在页面上三选一显示
    $('#Appointment').on('click', function () {
        var locationHref = window.location.href;
        // 如果登陆了
        if (sfut) {
            // 如果绑定手机号了
            if (userphone) {
                window.location.href = 'http://m.fang.com/house/ec/Enrollment/index?newcode=' + vars.newcode + '&HuXingId=' + vars.picid + '&EB_BehaviorID=YYKF0002';
            } else {
                window.location.href = 'https://m.fang.com/passport/resetmobilephone.aspx?burl=' + encodeURIComponent(locationHref);
            }
        } else {
            window.location.href = 'https://m.fang.com/passport/login.aspx?burl=' + encodeURIComponent(locationHref);
        }
    });
    $('#Discount').on('click', function () {
        window.location.href = vars.gwapUrl;
    });
    $('#Group').on('click', function () {
        window.location.href = '//m.fang.com/house/ec/TuanGouSignUp/Index?newcode=' + vars.newcode + '&city=' + vars.city;
    });
    // 预约看房，优惠，团购修改跳转链接  time: 2015.11.2--------------end
    // 学区跳转 time:2015.11.2-------------start
    $('#schoolDistrict').on('click', function () {
        window.location.href = '//m.fang.com/schoolhouse/' + vars.city + '/' + vars.schoolcode + '.html';
    });
    // 统计行为 ------------------------------------------------------start
    require.async('jsub/_vb.js?c=mnhpagetypepage');
    require.async('jsub/_ubm.js?_2017102307fdsfsdfdsd', function () {
        _ub.city = vars.ubcity;
        // 业务---WAP端
        _ub.biz = 'n';
        // 方位（南北方) ，北方为0，南方为1
        _ub.location = vars.ublocation;
        // 用户动作（浏览0、搜索1、打电话31、即时通讯24、预约25）
        var b = 0;
        var huxing = '';
        if (vars.room.indexOf('室') >= 0) {
            huxing = encodeURIComponent(vars.room.substring(0, vars.room.indexOf('室')) + '室');
        }
        if (vars.room.indexOf('居') >= 0) {
            huxing = encodeURIComponent(vars.room.substring(0, vars.room.indexOf('居')) + '居');
        }
        var pTemp = {
            // 关注的业务
            'vmg.page': 'mnhpagetypepage',
            // 所属页面
            'vmn.projectid': vars.newcode,
            // 户型
            'vmn.housetype': huxing,
            'vmg.sourceapp':vars.is_sfApp_visit + '^xf'
        };
        // 用户行为(格式：'字段编号':'值')
        var p = {};
        // 若pTemp中属性为空或者无效，则不传入p中
        for (var temp in pTemp) {
            if (pTemp[temp] && pTemp[temp].length > 0) {
                p[temp] = pTemp[temp];
            }
        }
        _ub.collect(b, p);
    });

    function yhxw(type) {
        var options = {
            'vmn.projectid': vars.newcode,
            'vmg.page': 'mnhpagetypepage'
        };
        if (vars.userid) {
            options['vmn.consultantid'] = vars.userid;
        }
        if (type == 77) {
            options['vmn.phone'] = $('#phonenumber').val();
        }
        _ub.collect(type, options);
    }

    // 学区 time:2015.11.2----------------end

    require.async('//click.fang.com/stats/click2011.js', function () {
        Clickstat.eventAdd(window, 'load', function () {
            // 普通详情页
            if (vars.wtInfoList == '[]') {
                Clickstat.batchEvent('waphuxinxq_', '');
            } else {
                // 电商详情页
                Clickstat.batchEvent('wapdshuxinxq_', '');
            }
        });
    });

    // -----------20160321
    /**
     @event 点击 #show_search 固定 .header 头部 bar
     */
    $('#show_search').on('click', function () {
        $('.header').css({
            position: 'relative',
            opacity: '1',
            top: 0,
            left: 0,
            'z-index': 999,
            width: '100%'
        }).show();
    });

    // C端账户工作台服务中心(2016年5月10日)
    if ($('.workbench-icon').length) {
        require('modules/xf/workbench');
    }

    /* 预约看房（2016年5月26日）*/
    $('.yykf').on('click', function () {
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

    // 商贷参考 饼图
    var red = parseInt($('.red-icon').attr('data'));
    var orange = parseInt($('.orange-icon').attr('data'));
    var green = parseInt($('.green-icon').attr('data'));
    var amount = red + orange + green;
    var redPre = red / amount * 100;
    var orangePre = orange / amount * 100;
    var greenPre = green / amount * 100;
    var data = [redPre, orangePre, greenPre];
    var color = ['#ff7070', '#ffae71', '#68c9bf'];
    var canvas = $('#pieCanvas').get(0);
    $('#pieCanvas').attr({width: '500', height: '500'});
    if (canvas) {
        var ctx = canvas.getContext('2d');
        var startPoint = 0;
        for (var i = 0; i < data.length; i++) {
            ctx.fillStyle = color[i];
            ctx.beginPath();
            ctx.moveTo(250, 250);
            ctx.arc(250, 250, 250, startPoint, startPoint + Math.PI * 2 * (data[i] / 100), false);
            ctx.fill();
            startPoint += Math.PI * 2 * (data[i] / 100);
        }
    }
    $('#pieCanvas').css({width: '100px', height: '100px'});

    // 户型分布小箭头
    if ($('.hx-fb p').length > 0) {
        var hxfbOffsetWidth = $('.hx-fb p')[0].offsetWidth;
        var hxfbScrollWidth = $('.hx-fb p')[0].scrollWidth;
        if (hxfbOffsetWidth < hxfbScrollWidth) {
            $('.hxfenbuMore').show().on('click', function () {
                $('.hx-fb').css('max-height', 'none');
                $('.hxfenbuMore').hide();
                $('.hx-fb p').css({'white-space': 'normal', 'word-break': 'break-all'});
            });
        }
    }

    // 房天下优惠=====================================start
    var un = '';
    var phone = '';
    var $redBagReward = '';
    // 页面红包设置参数
    var $rbid = '';
    // 弹窗遮罩层
    var $zhedang = '';
    // 查看更多红包按钮实例
    var $showhongbao = '';
    // 隐藏更多红包按钮实例
    var $hidehongbao = '';
    // 隐藏的红包li节点最小索引
    var MIN_INDEX = '';
    var hideRedBag = '';
    // 红包规则按钮
    var $redBagButton = '';
    var $morehuodong = '',
        $gd = '',
        $shq = '';

    // 房天下优惠下拉小箭头
    $('.hd-other').on('click', function () {
        if($('#aa').is(':hidden')) {
            $('.hd-other .oc-more').css('transform', 'rotate(-90deg)');
            $('#aa').show();
            // 不是电商楼盘
            if (vars.wtInfoList == '[]') {
                $('.hd-other a').attr('id', 'waphuxinxq_B06_02');
            } else {
                // 是电商楼盘
                $('.hd-other a').attr('id', 'wapdshuxinxq_B06_02');
            }
        } else {
            $('.hd-other .oc-more').css('transform', 'rotate(90deg)');
            $('#aa').hide();
            // 不是电商楼盘
            if (vars.wtInfoList == '[]') {
                $('.hd-other a').attr('id', 'waphuxinxq_B06_01');
            } else {
                // 是电商楼盘
                $('.hd-other a').attr('id', 'wapdshuxinxq_B06_01');
            }
        }
        // $('.hd-other .oc-more').hide();
    });

    // 限时杀价活动比较特殊。必须得放到外面
    var sjb = $('#sjb');
    var countDown = false;

    // 处理活动倒计时
    var sjbInterval = '';
    if (sjb && sjb.length) {
        sjbInterval = setInterval(function () {
            showActivity(sjb);
            countDown = true;
        }, 1000);
    }

    /*
     *房抢购活动
     */
    function showActivity($DivDom) {
        $DivDom.each(function (index, ele) {
            var $ele = $(ele);
            var time = showTime($ele.attr('data'));
            if (time) {
                var showDom;
                if (time.timestamp) {
                    showDom = '<b>' + $ele.attr('data-value') + '</b><em>' + time.days + '</em><b>天</b><em>' + time.hours
                        + '</em><b>时</b><em>' + time.minutes + '</em><b>分</b><em>' + time.seconds + '</em><b>秒</b>';
                } else {
                    showDom = '<b>' + $ele.attr('data-value') + '</b>';
                }
                $ele.html(showDom);
            }
        });
    }

    // 置红并绑定click事件
    function bindClickRedbag() {
        $('#getredbag').css({background: '#df3031'}).bind('click', function () {
            applyRB();
        });
    }

    // 置灰并解绑click事件
    function unbindClickRedbag() {
        $('#getredbag').css({background: '#b3b6be'}).unbind('click');
    }

    function preventDefault(e) {
        e.preventDefault();
    }

    function showOverflow() {
        document.addEventListener('touchmove', preventDefault);
    }

    function hideOverflow() {
        document.removeEventListener('touchmove', preventDefault);
    }

    /**
     * 显示弹窗
     */
    function showPop(popStr) {
        $(popStr).show();
        showOverflow();
    }

    /**
     * 隐藏弹窗
     */
    function hidePop(popStr) {
        $(popStr).hide();
        hideOverflow();
    }

    var favoritemsg = $('#favorite_msg');
    function showMessage(msg) {
        // 65为favorite里设置了margin-left: -65px;
        var width = ($(window).width() - favoritemsg.width()) / 2 + 65;
        favoritemsg.html(msg).css({left: width + 'px'}).show();
        setTimeout(removeDiv, 1500);
    }

    function removeDiv() {
        favoritemsg.hide(500);
    }

    /**
     * 领取红包
     */
    var city = vars.paramcity;
    var newcode = vars.paramid;
    function applyRedBag() {
        username = username ? username : un;
        userphone = userphone ? userphone : phone;
        $.get('/xf.d?m=getRedBag&mobile=' + userphone + '&city=' + vars.paramcity + '&vcode=' + '&newcode=' + $redBagReward.attr('aid')
            + '&rbid=' + $rbid.val() + '&username=' + username + '&type=huXingInfo',
            function (data) {
                if (data) {
                    if (data.root.code === '100') {
                        showPop('#applyok');
                        $redBagReward.find('li').eq($rbid.attr('index')).attr('class', 'used');
                        $redBagReward.find('li').eq($rbid.attr('index')).children('a').attr('href', '//m.fang.com/house/ec/RedBagDetail/Index?redBagId='
                            + $rbid.val() + '&phone=' + userphone).unbind('click') + '&EB_BehaviorID=SFHB0003';
                        getPartActive(city, newcode);
                    } else if (data.root.code === '010') {
                        showMessage('亲已经领取过该红包啦~');
                        hidePop('#applyhb');
                        $redBagReward.find('li').eq($rbid.attr('index')).attr('class', 'used');
                        $redBagReward.find('li').eq($rbid.attr('index')).children('a').attr('href', '//m.fang.com/house/ec/RedBagDetail/Index?redBagId='
                            + $rbid.val() + '&phone=' + userphone).unbind('click') + '&EB_BehaviorID=SFHB0003';
                        getPartActive(city, newcode);
                    } else {
                        showMessage(data.root.message);
                    }
                }
            });
    }

    /**
     * 异步加载登录后需要显示红包是否领取
     */
    function getPartActive(city, id) {
        $.get('/xf.d?m=partActive&id=' + id + '&city=' + city, function (data) {
            if (data) {
                var message = data.root.message;
                var messarr = message.split(',');
                for (var i = 0; i < messarr.length; i++) {
                    var m = messarr[i];
                    var $lia = '';
                    if (m && m !== '0') {
                        $redBagReward.find('li').eq(i).attr('class', 'used');
                        $lia = $redBagReward.find('li').eq(i).find('a');
                        $lia.attr('href', '//m.fang.com/house/ec/RedBagDetail/Index?redBagId=' + $lia.attr('rbid') + '&phone=' + data.root.code
                            + '&EB_BehaviorID=SFHB0003').unbind('click');
                    } else {
                        $lia = $redBagReward.find('li').eq(i).find('a');
                        $lia.unbind('click');
                        $lia.on('click', function () {
                            $rbid.val($(this).attr('rbid')).attr('money', $(this).attr('money')).attr('index', $(this).attr('index'));
                            applyRedBag();
                        });
                    }
                }
            }
        });
    }

    function clearInput() {
        $('#phoneNum').val('');
        $('#codeText').val('');
    }

    function updateTime1() {
        $('#getPhoneVcode1').unbind('touchend').val('重新发送(' + timeCount + ')').css({
            'background-color': '#b3b6be',
            color: '#ffffff',
            border: '1px solid #b3b6be'
        });
        timeCount--;
        if (timeCount >= -1) {
            setTimeout(updateTime1, 1000);
        } else {
            $('#getPhoneVcode1').val('发送验证码').css({
                'background-color': '#ffffff',
                color: '#ff6666',
                border: '1px solid #ff6666'
            });
            $('#getPhoneVcode1').unbind('touchend').click(function () {
                var phone = $('#phoneNum').val();
                var phoneFlag = checkPhone(phone);
                if (phoneFlag) {
                    updateTime1();
                    verifycode.getPhoneVerifyCode(phone);
                }
            });
            timeCount = 60;
        }
    }

    function applyRB() {
        var city = vars.paramcity;
        var newcode = vars.paramid;
        phone = $('#phoneNum').val();
        var phoneFlag = checkPhone(phone);
        var vCode = $('#codeText').val();
        var vcodeFlag = checkVcode(vCode);
        if (phoneFlag && vcodeFlag) {
            unbindClickRedbag();
            verifycode.sendVerifyCodeAnswer(phone, vCode,
                function () {
                    $.get('/xf.d?m=getRedBag&mobile=' + phone + '&city=' + vars.paramcity + '&newcode=' + $redBagReward.attr('aid') + '&rbid=' + $rbid.val(),
                        function (data) {
                            if (data) {
                                un = data.root.result;
                                if (data.root.code === '100') {
                                    $('#applyok').show();
                                    $('#applyhb').hide();
                                    $redBagReward.find('li').eq($rbid.attr('index')).attr('class', 'used');
                                    $redBagReward.find('li').eq($rbid.attr('index')).find('a').attr('href', '//m.fang.com/house/ec/RedBagDetail/Index?redBagId='
                                        + $rbid.val() + '&phone=' + phone + '&EB_BehaviorID=SFHB0003').unbind('click');
                                    getPartActive(city, newcode);
                                } else if (data.root.code === '010') {
                                    showMessage('亲已经领取过该红包啦~');
                                    hidePop('#applyhb');
                                    $redBagReward.find('li').eq($rbid.attr('index')).attr('class', 'used');
                                    $redBagReward.find('li').eq($rbid.attr('index')).children('a').attr('href', '//m.fang.com/house/ec/RedBagDetail/Index?redBagId='
                                        + $rbid.val() + '&phone=' + phone + '&EB_BehaviorID=SFHB0003').unbind('click');
                                    getPartActive(city, newcode);
                                } else {
                                    bindClickRedbag();
                                    showMessage(data.root.message);
                                }
                            }
                        });
                },
                function () {
                    // 验证码错误
                    showMessage(' 验证码错误！');
                    bindClickRedbag();
                });
        }
    }

    /*
     * 时间计算
     */
    function showTime(date) {
        // 开始时间
        var nowDate = new Date();
        // 结束时间
        var closeDate = new Date(date);
        // 时间差的毫秒数
        var timestamp = Math.max(closeDate.getTime() - nowDate.getTime(), 0);
        // 计算出相差天数
        var days = Math.floor(timestamp / (24 * 3600 * 1000));
        // 计算天数后剩余的毫秒数
        var dayLeave = timestamp % (24 * 3600 * 1000);
        // 计算出小时数
        var hours = Math.floor(dayLeave / (3600 * 1000));
        // 计算小时数后剩余的毫秒数
        var houseLeave = dayLeave % (3600 * 1000);
        // 计算相差分钟数
        var minutes = Math.floor(houseLeave / (60 * 1000));
        // 计算分钟数后剩余的毫秒数
        var minutesLeave = houseLeave % (60 * 1000);
        // 计算相差秒数
        var seconds = Math.round(minutesLeave / 1000);
        return {
            days: days < 10 ? '0' + days : days,
            hours: hours < 10 ? '0' + hours : hours,
            minutes: minutes < 10 ? '0' + minutes : minutes,
            seconds: seconds < 10 ? '0' + seconds : seconds,
            timestamp: timestamp
        };
    }

    // 所有活动和红包异步加载（仅限北京）
    function getAllActive(city, id) {
        $.get('/xf.d?m=allActive&id=' + id + '&city=' + city + '&type=huXingInfo', function (data) {
            if (data.trim()) {
                $('.hx-hd').show();
                $('#aa').append(data);
                // 活动
                require('modules/xf/xfactivity');
                // 活动
                var hdOptions = {
                    fqg: $('#fqg'),
                    yy: $('#yy'),
                    sfk: $('#sfk'),
                    zhc: $('#zhc'),
                    jp: $('#jp'),
                    sjb: $('#sjb'),
                    ms: $('.mstime'),
                    lucky: $('#lucky')
                };

                if (hdOptions.sjb && hdOptions.sjb.length) {
                    clearInterval(sjbInterval);
                }
                countDown = false;
                // 处理活动倒计时
                var hdsetInterval = setInterval(function () {
                    for (var option in hdOptions) {
                        if (hdOptions[option] && hdOptions[option].length) {
                            showActivity(hdOptions[option]);
                            countDown = true;
                        }
                    }
                    if (!countDown) {
                        clearInterval(hdsetInterval);
                    }
                }, 1000);

                // 红包容器实例
                $redBagReward = $('.qdRB');
                // 页面红包设置参数
                $rbid = $('#rbid');
                // 弹窗遮罩层
                $zhedang = $('#zhedang');
                // 查看更多红包按钮实例
                $showhongbao = $('#showhongbao');
                // 隐藏更多红包按钮实例
                $hidehongbao = $('#hidehongbao');
                // 隐藏的红包li节点最小索引
                MIN_INDEX = 1;
                hideRedBag = $redBagReward.find('li:gt(' + MIN_INDEX + ')');
                $('#gftg').hide();
                // 勾选规则按钮
                $redBagButton = $('input[type="checkbox"]');
                // 默认选中
                $redBagButton.attr('checked', true);
                // 绑定确定按钮
                bindClickRedbag();

                if (!userphone) {
                    // 未登录情况 全部可以领取
                    $redBagReward.find('li').each(function () {
                        var $this = $(this);
                        $this.removeAttr('class').find('a').click(function () {
                            var $th = $(this);
                            $rbid.val($th.attr('rbid')).attr('money', $th.attr('money')).attr('index', $th.attr('index'));
                            showPop('#applyhb');
                        });
                    });
                } else {
                    // 已登录状态
                    $redBagReward.find('li').each(function () {
                        var $this = $(this);
                        if ($this.attr('class') !== 'used') {
                            $this.find('a').click(function () {
                                var $th = $(this);
                                $rbid.val($th.attr('rbid')).attr('money', $th.attr('money')).attr('index', $th.attr('index'));
                                applyRedBag();
                            });
                        } else {
                            $this.find('a').attr('href', '//m.fang.com/house/ec/RedBagDetail/Index?redBagId=' + $this.find('a').attr('rbid') + '&phone='
                                + userphone + '&EB_BehaviorID=SFHB0003');
                        }
                    });
                }

                $morehuodong = $('.more-huodong');
                $gd = $('.gd');
                $shq = $('.shq');
                $('#wapxfxqy_C03_11').click(function () {
                    showActive();
                });
                $('#hideActive').click(function () {
                    hideActive();
                });
                $showhongbao.click(function () {
                    showHongBao();
                });
                $hidehongbao.click(function () {
                    hideHongBao();
                });
                $redBagButton.on('click', function () {
                    if ($redBagButton.is(':checked')) {
                        bindClickRedbag();
                    } else {
                        unbindClickRedbag();
                    }
                });

                $('#cancleredbag').click(function () {
                    hidePop('#applyhb');
                    clearInput();
                });
                // 获取验证码
                $('#getPhoneVcode1').bind('touchend', function () {
                    var phone = $('#phoneNum').val();
                    var phoneFlag = checkPhone(phone);
                    if (phoneFlag) {
                        updateTime1();
                        // 给手机发送验证码
                        verifycode.getPhoneVerifyCode(phone);
                    }
                });

                $('.closeBtn').click(function () {
                    hidePop('#applyok');
                });

                $('#wapShare').bind('click', function () {
                    // 引入APP下载和打开
                    var appdown = require('app/1.0.0/appdownload');
                    appdown('#wapShare').openApp('/clientindex.jsp?city=' + vars.city + '&flag=download&f=1256');
                });
                $('#rebbaginfo').click(function () {
                    userphone = userphone || phone;
                    window.location.href = '//m.fang.com/house/ec/RedBagDetail/Index?redBagId=' + $rbid.val() + '&phone='
                        + userphone + '&EB_BehaviorID=SFHB0003';
                });
            } else {
                // 如果没有红包活动，则显示购房团购
                $('#gftg').show();
            }
        });
    }
    getAllActive(vars.paramcity, vars.paramid);

    function showActive() {
        $morehuodong.show();
        $gd.hide();
        $('.yh-kft').hide();
        $shq.show();
        $('.sfhbhide').show();
    }

    function hideActive() {
        $morehuodong.hide();
        $shq.hide();
        $('.yh-kft').show();
        $gd.show();
        $('.sfhbhide').hide();
    }

    function showHongBao() {
        hideRedBag.show();
        $showhongbao.hide();
        $hidehongbao.show();
    }

    function hideHongBao() {
        hideRedBag.hide();
        $hidehongbao.hide();
        $showhongbao.show();
    }

    // 点击领取 直销 红包
    $('.main').on('click', '.yh-content a', function () {
        var $this = $(this);
        var url = vars.mainSite;
        var id, aid, rbid, flag;
        // 如果登录了
        if (sfut) {
            // 如果绑定手机号了
            if (userphone) {
                if ($this.html() == '获取优惠') {
                    id = $this.parent('div').attr('data-id');
                    aid = $this.parent('div').attr('data-aid');
                    $.get('/xf.d?m=getConditionsMoney&mobile=' + userphone + '&city=' + vars.paramcity
                        + '&vcode=' + '&aid=' + aid + '&newcode=' + vars.newcode + '&cmid=' + id + '&username=' + username + '&maction=' + vars.maction,
                        function (data) {
                            if (data) {
                                if (data.root.code === '100') {
                                    //showMessage('报名成功');
                                    //$('#huodonghongbao, #huodongyouhui').addClass('none');
                                    //$('body').css('overflow', 'auto');
                                    enable();
                                    window.location = url + 'house/ec/BuyYouHui/PayConfirm?orderNo=' + data.root.result + '&EB_BehaviorID=GMYH0005';

                                } else {
                                    showMessage(data.root.message);
                                }
                            }
                        });
                } else if ($this.html() == '领取红包') {
                    aid = $this.parent('li').attr('data-aid');
                    rbid = $this.parent('li').attr('data-rbid');
                    $.get('/xf.d?m=getRedBag&mobile=' + userphone + '&city=' + vars.paramcity
                        + '&vcode=' + '&newcode=' + aid + '&rbid=' + rbid + '&username=' + username,
                        function (data) {
                            if (data) {
                                if (data.root.code === '100') {
                                    showMessage(data.root.message);
                                    $('#huodonghongbao, #huodongyouhui').addClass('none');
                                    //$('body').css('overflow', 'auto');
                                    enable();
                                } else {
                                    showMessage('报名失败');
                                }
                            }
                        });
                }
            } else {
                if ($this.html() == '领取红包') {
                    flag = 'hb';
                } else if ($this.html() == '获取优惠') {
                    flag = 'zx';
                }
                window.location.href = 'https://m.fang.com/passport/resetmobilephone.aspx?burl=' + encodeURIComponent(url + 'xf/' + vars.paramcity + '/' + vars.paramid + '.htm?oFlag=' + flag);
            }
        } else {
            if ($this.html() == '领取红包') {
                flag = 'hb';
            } else if ($this.html() == '获取优惠') {
                flag = 'zx';
            }
            //window.location.href = 'https://m.fang.com/passport/login.aspx?burl=' + encodeURIComponent(url + 'xf/' + vars.paramcity + '/' + vars.paramid + '.htm?oFlag=' + flag);
            window.location.href = 'https://m.fang.com/passport/login.aspx?burl=' + encodeURIComponent(url + 'xf/' + vars.paramcity + '/' + vars.paramid + '.htm');
        }
    });
    // 房天下优惠=====================================end

    // 近似户型加载更多功能
    var $moreList = $('#waphuxinxq_B08_02');
    var sameHxNum = parseInt($moreList.attr('data-num'));
    if (sameHxNum > 3) {
        $moreList.show().on('click', function () {
            $.get(vars.mainSite + 'xf.d?m=huXingInfo_ajax&city=' + vars.city + '&newcode=' + vars.newcode  + '&hxid=' + vars.hxid + '&room=' + vars.room.split('室')[0], function (data) {
                $moreList.hide();
                $moreList.parent().parent().find('ul').hide();
                $moreList.parent().parent().append(data);
            });
        });
    }

    // 判断户型点评下拉小箭头是否显示
    if ($('.xqIntro p').height() <= $('.xqIntro').height()) {
        // 不显示
        $('.more_xq').hide();
    }

    // 户型点评下拉小箭头显示更多
    $('.more_xq').on('click', function () {
        var $this = $(this);
        $this.hide();
        $this.siblings('.xqIntro').css('max-height', 'none');
    })
	
	// 加载装修案例-----------------------------------start
	var $room=8;
	if(vars.room != null && vars.room != '' && vars.room != '开间' && vars.room.indexOf('室') > -1 ){
		$room = vars.room.substring(0,vars.room.indexOf('室'));
		if($room == '5'){
			$room=9;
		}else if($room > '5'){
			$room=10;
		}
	}
	
	
    loadCaseInfo(vars.paramid, vars.paramcity, $room);

    function loadCaseInfo(e, t , u) {
        $.get('/xf.d?m=getCaseInfos&newcode=' + e +  '&city=' + t + '&roomId=' +u,
            function (e) {
                $('.zxal').html(e).show();
            });
    }
    // 加载装修案例-----------------------------------end
});
