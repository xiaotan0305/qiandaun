/**
 * bbs帖子详情页
 * @Last Modified by:   Marte
 * @Last Modified time: 2016/1/21
 */
define('modules/bbs/postinfo', ['jquery', 'photoswipe/4.0.7/photoswipe', 'photoswipe/4.0.7/photoswipe-ui-default.min',
        'loadMore/1.0.0/loadMore', 'lazyload/1.9.1/lazyload', 'modules/bbs/bbsbuma', 'iscroll/2.0.0/iscroll-lite',
        'verifycode/1.0.0/verifycode', 'superShare/1.0.1/superShare', 'weixin/2.0.0/weixinshare'],
    function (require, exports, module) {
        'use strict';
        module.exports = function () {
            var $ = require('jquery');
            var vars = seajs.data.vars, win = window;
            var sign = vars.sign,
                masterId = vars.masterId,
                order = vars.order,
            // 回帖总条数
                rowsCount = vars.rowsCount;
            var conImg = $('.main'),
                oMore = $('.option-more'),
                oCont = $('.option-cont'),
                bbsBody = $('body');
            // 用户行为对象
            var bbsbuma = require('modules/bbs/bbsbuma');
            // 发送验证码插件
            var verifycode = require('verifycode/1.0.0/verifycode');
            // 帖子详情页浏览动作布码
            bbsbuma({type: 0, pageId: 'lt_lt^tzxq_wap', posttitle: vars.postTitle, postid: masterId, forumid: vars.sign});
            // 惰性加载
            require('lazyload/1.9.1/lazyload');
            $('.lazyload').lazyload();

            // 滑动筛选框插件++++++++++++++++++++
            var IScroll = require('iscroll/2.0.0/iscroll-lite');

            var patterncode = /^\d{4}$/;
            var mobile = /^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$/i;

            /**
             * 为了方便解绑事件，声明一个阻止页面默认事件的函数
             * @param e
             */
            var $doc = $(document);

            // 处理底部浮层跳到弹出框位置
            var u = navigator.userAgent;
            $('.main').on('focus', 'input[type=text],input[type=number]', function () {
                if (!/(iPhone|iPad|iPod|iOS)/i.test(u)) {
                    $('html,body').animate({scrollTop: $(this).offset().top}, 200);
                } else if (/UCBrowser/i.test(u)) {
                    var imgSrc = vars.public + 'img/sf-72.png';
                    var downPop = $('img[src="' + imgSrc + '"]').parent().parent();
                    downPop.length && downPop.hide();
                }
            }).on('blur', 'input[type=text],input[type=number]', function () {
                if (/(iPhone|iPad|iPod|iOS)/i.test(u) && /UCBrowser/i.test(u)) {
                    var imgSrc = vars.public + 'img/sf-72.png';
                    var downPop = $('img[src="' + imgSrc + '"]').parent().parent();
                    downPop.length && downPop.show();
                }
            });

            function pdEvent(e) {
                e.preventDefault();
            }

            /**
             * 禁止页面滑动
             */
            function unable() {
                $doc.on('touchmove', pdEvent);
            }

            /**
             * 允许页面滑动
             */
            function enable() {
                $doc.off('touchmove', pdEvent);
            }

            // 浮层提示控制
            var $sendFloat = $('#sendFloat');

            function displayLose(time, keywords, url) {
                $('#sendText').text(keywords);
                $sendFloat.show();
                setTimeout(function () {
                    $sendFloat.hide();
                    if (url) {
                        window.location.href = url;
                    }
                }, time);
            }

            // 预约成功后的弹层
            var $yuYueFloat = $('#yuYueFloat');
            // 控制验证码发送成功后要60秒后才可以从新发送
            // 倒计时秒数
            var timeCount = 60;
            // 发送验证码按钮
            var $sendCode = $('#sendCode');
            var timer1;
            var sendVerifyCodeFlag = false;
            // 点击发送验证码成功时的回调函数
            function countDown() {
                sendVerifyCodeFlag = true;
                // 发送验证码按钮置为灰色
                $sendCode.removeClass('active');
                // 60s倒计时
                timer1 = setInterval(function () {
                    timeCount--;
                    $sendCode.text('重新发送(' + timeCount + ')');
                    if (timeCount === -1) {
                        sendVerifyCodeFlag = false;
                        // 清除定时器
                        clearInterval(timer1);
                        // 倒计时结束的时候把发送验证码的文本修改为重新获取
                        $sendCode.text('重新获取');
                        // 将发送验证码按钮设置为红色可点击状态
                        $sendCode.addClass('active');
                        timeCount = 60;
                    }
                }, 1000);
            }

            // 发送验证码
            // 验证码格式验证
            $sendCode.on('click', function () {
                var phone = $('#mobilecodeManual').val();
                // 如果发送验证码按钮为灰色倒计时状态 则不再请求发送验证码
                if (!$(this).hasClass('active')) {
                    return false;
                }
                if (!mobile.test(phone)) {
                    displayLose(2000, '请输正确格式的手机号');
                    return false;
                }
                if (sendVerifyCodeFlag) {
                    return false;
                }
                // 调用发送验证码接口getPhoneVerifyCode  param 手机号吗 发送成功的回掉函数 发送失败的回掉函数
                // verifycode.sendVerifyCodeAnswer 验证码验证接口
                verifycode.getPhoneVerifyCode(phone, countDown, function () {
                    // 获取验证码失败 回掉此函 把获取验证码按钮置为可用
                    // displayLose(2000,'验证码发送失败！');
                    return false;
                });
            });

            // 初始化时间容器的分 秒
            var hourStr = '';
            var minuteStr = '';
            // 时间日期选择
            var $date = $('#date');
            var $hour = $('#hour');
            var $minute = $('#minute');
            // 小时容器字符串
            for (var j = 0; j <= 23; j++) {
                if (j < 10) {
                    hourStr += '<li data-num="' + j + '">0' + j + '</li>';
                } else {
                    hourStr += '<li data-num="' + j + '">' + j + '</li>';
                }
            }
            // 分钟容器字符串
            for (var i = 0; i <= 59; i++) {
                if (i === 0) {
                    minuteStr += '<li data-num="' + i + '"class="cur">0' + i + '</li>';
                } else if (i > 0 && i < 10) {
                    minuteStr += '<li data-num="' + i + '">0' + i + '</li>';
                } else {
                    minuteStr += '<li data-num="' + i + '" >' + i + '</li>';
                }
            }
            hourStr = '<li></li><li></li>' + hourStr + '<li></li><li></li>';
            minuteStr = '<li></li><li></li>' + minuteStr + '<li></li><li></li>';
            // 插入到小时容器
            $hour.find('ul').append(hourStr);
            $minute.find('ul').append(minuteStr);

            /**
             * 根据用户当时点击时间 将时间戳转化为指定的格式
             */
            function getDays() {
                var now = new Date();
                var day = now.getDay();
                var week = '7123456';
                var weekDay = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

                var days = [];
                for (var i = 0; i < 8; i++) {
                    var f = new Date();
                    f.setDate(f.getDate() + i);
                    var year = f.getFullYear();
                    var month = parseInt(f.getMonth()) + 1;
                    month = month < 10 ? '0' + month : month;
                    var date = f.getDate();
                    date = date < 10 ? '0' + date : date;
                    var myDate = new Date(Date.parse(year + '/' + month + '/' + date));
                    days.push({
                        // 带间隔符号日期
                        fullDate: '' + year + '-' + month + '-' + date,
                        // 简写
                        jxDate: '' + year + month + date,
                        // 多少号
                        date: date,
                        // 月/日
                        yt: month + '月/' + date + '日',
                        // 月/日
                        yt2: year + '年' + month + '月' + date + '日',
                        week: weekDay[myDate.getDay()]
                    });
                }
                return days;
            }

            // 保存日期滚动实列对象
            var iscrollDate;
            // 保存小时滚动实列对象
            var iscrollHour;
            // 保存分钟滚动实列对象
            var iscrollMinute;
            // 看房时间点击事件
            $('#kfDate').on('click', function () {
                var riqi;
                var week;
                if ($(this).text() !== '请选择看房时间') {
                    riqi = $(this).text().split(' ')[0];
                    week = $(this).text().split(' ')[1];
                }
                var data = getDays();
                var length = data.length;
                // 用于存放插入到时间选择下拉列表中的字符串
                var contents = '';
                for (var i = 0; i < length; i++) {
                    // 将格式化后的时间拼接成时间选择下拉列表中的数据
                    if (riqi === data[i].yt && week === data[i].week) {
                        contents += '<li class="cur" data-num="' + i + '">' + data[i].yt + ' ' + data[i].week + '</li>';
                    } else {
                        contents += '<li data-num="' + i + '">' + data[i].yt + ' ' + data[i].week + '</li>';
                    }
                }
                contents = '<li></li><li></li>' + contents + '<li></li><li></li>';
                $date.find('ul').empty();
                $date.find('ul').append(contents);
                $('#kfDateCon').show();
                unable();
                iscrollDate = new IScroll('#date');
                iscrollHour = new IScroll('#hour');
                iscrollMinute = new IScroll('#minute');
                var riqiCurNum = parseInt($date.find('li.cur').attr('data-num'));
                var hourCurNum = parseInt($hour.find('li.cur').attr('data-num'));
                var minuteCurNum = parseInt($minute.find('li.cur').attr('data-num'));
                // 默认要求日期显示当前日期的第三天

                if ($('#kfDate').text() === '请选择看房时间') {
                    iscrollDate.scrollTo(0, -2 * 45, 1);
                    // 默认要求小时显示12点
                    iscrollHour.scrollTo(0, -12 * 45, 1);
                } else {
                    iscrollDate.scrollTo(0, -riqiCurNum * 45, 1);
                    iscrollHour.scrollTo(0, -hourCurNum * 45, 1);
                    // 默认要求小时显示12点
                    iscrollMinute.scrollTo(0, -minuteCurNum * 45, 1);
                }

                // 监听日期滚动实列对象滚动结束时的操作
                iscrollDate.on('scrollEnd', function () {
                    // 当前滚动实列对象
                    var $is = $date;
                    // 对滚动的距离做四舍五入运算 用于保证滚动每次滚动的距离都是显示一格区的整数倍
                    var st = Math.round(this.y / 45);
                    // 微调滚动条
                    this.scrollTo(0, st * 45, 200);
                    $is.find('li').removeClass();
                    // Math.abs(st) + 2 加2是因为浮沉上部默认有两个空的li标签
                    var $nowLi = $is.find('li').eq(Math.abs(st) + 2);
                    $nowLi.addClass('cur');
                });

                iscrollHour.on('scrollEnd', function () {
                    var $is = $hour;
                    var st = Math.round(this.y / 45);
                    this.scrollTo(0, st * 45, 200);
                    $is.find('li').removeClass();
                    var $nowLi = $is.find('li').eq(Math.abs(st) + 2);
                    $nowLi.addClass('cur');
                });

                iscrollMinute.on('scrollEnd', function () {
                    var $is = $minute;
                    var st = Math.round(this.y / 45);
                    this.scrollTo(0, st * 45, 200);
                    $is.find('li').removeClass();
                    var $nowLi = $is.find('li').eq(Math.abs(st) + 2);
                    $nowLi.addClass('cur');
                });
            });

            // 点击时间选择器的取消按钮
            $('.return').on('click', function () {
                $('.sf-maskFixed').hide();
                enable();
            });
            // 点击时间选择器的确定按钮
            var date;
            $('#dateSubmit').on('click', function () {
                var time = '';
                // 选择的日期值
                var dataVal = $date.find('li.cur').text();
                // 选择的小时值
                var hourVal = $hour.find('li.cur').text();
                // 选择的分钟值
                var minuteVal = $minute.find('li.cur').text();
                time = dataVal + ' ' + hourVal + ':' + minuteVal;
                // 获取当前的年份用于拼接选择的正确格式的日期
                var year = new Date().getFullYear();
                // 格式化当前选择的时间 格式化后的格式为2014-07-10 10:21 用来转化为时间戳
                date = year + '-' + dataVal.split(' ')[0].split('/')[0].replace('月', '') + '-' + dataVal.split(' ')[0].split('/')[1].replace('日', '')
                + ' ' + hourVal + ':' + minuteVal;
                // var selected = Date.parse(new Date(date));
                var selected = new Date(Date.parse(date.replace(/-/g, '/')));
                // 点击确定时的当前时间
                var nowTime = Date.parse(new Date());
                // 选择的时间小于当前时间 弹出提示信息
                if (selected < nowTime) {
                    displayLose(2000, '请选择正确的时间');
                }
                $('#kfDate').text(time).addClass('xuan_jg');
                $('.sf-maskFixed').hide();
                enable();
            });


            // 手机号、验证码输入
            var $mobilecodeManualId = $('#mobilecodeManual');
            var oldPhone = $mobilecodeManualId.val();
            // 预约按钮颜色控制 只有手机号码和验证码都填写的情况在才为可点击
            $('#mobilecodeManual,#codeVal').on('input', function () {
                var me = $(this), messageCodeDl = $('#sendCode'), sendVerifyCode = $('#codeLi');
                me.val(me.val().substring(0, 11).replace(/[\D]/g, ''));
                if (oldPhone !== me.val()) {
                    vars.authenticated = 0;
                    messageCodeDl.show();
                    sendVerifyCode.show();
                } else if (oldPhone !== '' && oldPhone === me.val()) {
                    vars.authenticated = 1;
                    messageCodeDl.hide();
                    sendVerifyCode.hide();
                }
            });

            // 点击户型按钮
            $('#huxing').on('click', function () {
                $('#huxingDrap').show();
                unable();
                var iscrollHx = new IScroll('#huxingCon');
                // 如果没有选择过看房时间
                var curNum = parseInt($('#huxingCon').find('li.cur').attr('data-num')) - 1;
                iscrollHx.scrollTo(0, -curNum * 45, 1);
                iscrollHx.on('scrollEnd', function () {
                    var $is = $('#huxingCon');
                    var st = Math.round(this.y / 45);
                    this.scrollTo(0, st * 45, 200);
                    $is.find('li').removeClass();
                    var $nowLi = $is.find('li').eq(Math.abs(st) + 2);
                    $nowLi.addClass('cur');
                });
            });
            // 点击户型选择的确定按钮
            $('#huxingSubmit').on('click', function () {
                // 选择的户型值
                var selectedHx = $('#huxingCon').find('li.cur').text();
                $('#huxing').text(selectedHx).addClass('xuan_jg');
                $('#huxingDrap').hide();
                enable();
            });

            // 协议勾选
            $('.ipt-rd').on('click', function () {
                var $that = $(this);
                if ($that.attr('checked') === 'checked') {
                    // 如果是选中的再次点击取消选中
                    $that.attr('checked', false);
                    $that.val('0');
                } else {
                    $that.attr('checked', true);
                    $that.val('1');
                }
            });


            var $bmSubmit = $('#bmSubmit');
            var flag = true;
            $bmSubmit.on('click', function () {
                // 点击确定时的当前时间
                var subNowTime = Date.parse(new Date());
                // 报名数据提交
                // 验证码
                var messagecodeManual = $('#codeVal').val().trim();
                // 电话号码
                var telNumber = $('#mobilecodeManual').val().trim();
                // 户型的选择
                var huXing = $('#huxing').text();
                // 用户名
                var yuyuename = $('#name').val().trim();
                if (!flag) {
                    return;
                }
                // 验证报名选项应该填写的数据
                if (!$bmSubmit.hasClass('active')) {
                    return false;
                }
                // 判断姓名输入框是否填写
                if (yuyuename === '') {
                    displayLose(2000, '请输入姓名！');
                    return false;
                } else if (yuyuename.length > 8) {
                    displayLose(2000, '姓名最多输入8个字符');
                    return false;
                }
                // 判断手机号是否填写
                if (!mobile.test(telNumber)) {
                    displayLose(2000, '请输入正确格式的手机号码！');
                    return false;
                }
                // 判断验证码
                if (!$('#codeLi').is(':hidden') && !patterncode.test(messagecodeManual)) {
                    displayLose(2000, '请输入正确格式的验证码！');
                    return false;
                }
                // 判断看房时间
                if ($('#kfDate').text() === '请选择看房时间') {
                    displayLose(2000, '请选择看房时间！');
                    return false;
                } else if (new Date(Date.parse(date.replace(/-/g, "/"))) < subNowTime) {
                    displayLose(2000, '请选择正确的看房时间！');
                    return false;
                }

                // 是否勾选了协议
                if ($('.ipt-rd').val() !== '1') {
                    displayLose(2000, '请勾选《房天下新房委托服务协议》！');
                    return false;
                }

                var verifySuccess = function () {
                    // 定义一个参数对象 用来存娶提交给后台的数据
                    var param = {
                        phone: telNumber,
                        newcode: vars.newcode,
                        yuyueHuXing: huXing,
                        yuyuetime: date,
                        username: yuyuename,
                        yuyueurl: window.location.href,
                    };
                    var sucurl = vars.bbsSite + '?c=bbs&a=ajaxIsCanYuyue';
                    $.ajax({
                        url: sucurl,
                        data: param,
                        dataType: 'json',
                        type: 'post',
                        async: false,
                        success: function (data) {
                            if (data) {
                                // 如果数据提交成功
                                if (data.resultCode === '100') {
                                    flag = false;
                                    $yuYueFloat.show();
                                    unable();
                                    $('#yuyueSubmit').click(function () {
                                        $yuYueFloat.hide();
                                        enable();
                                        window.location.reload();
                                    });
                                } else {
                                    displayLose(2000, data.resultMsg);
                                }
                            } else {
                                displayLose(2000, '网络错误,请稍候再试');
                            }
                        }
                    });
                };
                var verifyError = function () {
                    displayLose(2000, '短信验证码验证失败,请尝试重新发送');
                };

                if (parseInt(vars.authenticated)) {
                    // 已经登录了,不用再验证验证码
                    verifySuccess();
                } else {
                    verifycode.sendVerifyCodeAnswer(telNumber, messagecodeManual, verifySuccess
                        , verifyError);
                }
            });


            /**
             * 滑动到某位置
             * @param pos 距离顶部高度
             */
            function animateTo(pos) {
                bbsBody.animate({scrollTop: pos}, 200);
            }

            // 点击帖子内容图片，图片放大功能
            conImg.on('click', '.img-box img', function () {
                var url = $(this).attr('original');
                var slides = [];
                var index = 0;
                var allImg = conImg.find('.img-box img');
                // 点击缩放大图浏览
                if (allImg.length > 0) {
                    var pswpElement = $('.pswp')[0];
                    for (var i = 0, len = allImg.length; i < len; i++) {
                        var ele = allImg[i],
                            src = $(ele).attr('original');
                        if (src === url) {
                            index = i;
                        }
                        slides.push({src: src, w: ele.naturalWidth, h: ele.naturalHeight});
                    }
                    var options = {
                        history: false,
                        focus: false,
                        index: index,
                        escKey: true
                    };
                    var gallery = new win.PhotoSwipe(pswpElement, win.PhotoSwipeUI_Default, slides, options);
                    gallery.init();
                }
            });

            // 点击左下角浮动加号
            oCont.on('click', function () {
                oCont.toggleClass('option-plus-active');
                oMore.toggleClass('option-panel-active');
            });

            // 点击更多里的顶部按钮事件
            oMore.find('a').eq(2).on('click', function () {
                animateTo(0);
            });

            // 点击回复评论
            $('#list').on('click', '.reply2', function () {
                var replyid = $(this).attr('post-id');
                bbsbuma({type: 18, pageId: 'mbbspostpage', replyid: replyid, postid: masterId, forumid: vars.sign});
                win.location.href = $(this).attr('data-url');
            });

            // 回复提交后置底
            // 测试过了返回的vars.bottomFlag是“1”
            if (vars.bottomFlag === '1') {
                animateTo(document.body.scrollHeight);
            }

            // 回帖后滑动到对应的帖子上
            if (vars.postId !== '') {
                var postDiv = $('#post_' + vars.postId);
                if (postDiv.length > 0) {
                    anixmateTo(postDiv.offset().top);
                }
            }
            var loadMore = require('loadMore/1.0.0/loadMore');
            // 显示更多帖子回复
            if (rowsCount > 20) {
                loadMore({
                    url: vars.bbsSite + '?c=bbs&a=getMorePostDetail' + '&city=' + vars.city + '&sign=' + sign + '&masterId=' + masterId + '&order=' + order,
                    total: rowsCount,
                    pagesize: 20,
                    pageNumber: 10,
                    moreBtnID: '.bt',
                    loadPromptID: '.bt',
                    isScroll: false,
                    contentID: '#list',
                    loadAgoTxt: '点击加载更多',
                    loadingTxt: '加载中...',
                    loadedTxt: '点击加载更多'
                });
            }

            // 显示每条回复中的更多评论
            // 每页显示条数
            var pageNum = 0;
            $('.repL').each(function () {
                var ele = $(this),
                    moreBtn = ele.find('.loadm a'),
                    recount = moreBtn.data('recount');
                if (recount > 3) {
                    var postId = moreBtn.data('post'),
                        cUserId = moreBtn.data('cuserid');
                    if (recount <= 10) {
                        pageNum = recount - 1;
                    } else {
                        pageNum = 10;
                    }
                    loadMore({
                        url: vars.bbsSite + '?c=bbs&a=moreCommentList&city=' + vars.city + '&pageSize=10'
                        + '&sign=' + sign + '&masterId=' + masterId + '&postId=' + postId + '&cUserId=' + cUserId,
                        total: recount,
                        pagesize: pageNum,
                        pageNumber: pageNum,
                        moreBtnID: moreBtn,
                        loadPromptID: moreBtn,
                        isScroll: false,
                        contentID: ele.find('dl'),
                        loadAgoTxt: '还有' + (recount - 3) + '条评论...',
                        loadingTxt: '加载中...',
                        callback: function () {
                            moreBtn.html('还有' + (recount - ele.find('dd').length) + '条评论...');
                        }
                    });
                    if (recount < 10) {
                        moreBtn.show();
                    }
                }
            });

            var video = $('#myVideo');
            // 如果帖子中存在视频
            if (video.length > 0) {
                var videoTime = $('.video_time'),
                    videoPlayIcon = $('.video_play_icon');
                // 点击播放视频
                videoPlayIcon.on('click', function () {
                    videoPlayIcon.hide();
                    videoTime.hide();
                    video.attr('controls', true);
                    video[0].play();
                });
            }
            // 活动结果
            var cpResultbox = $('.cpResultbox');
            var prizeResult = $('#prizeResult');
            var queding = $('.queding');

            /**
             * 浮层弹出信息
             * @param mess 显示信息
             */
            var floatshow = function (mess) {
                prizeResult.html(mess);
                cpResultbox.show();
                unable();
            };
            // 点击弹层的X或者确定按钮，关闭弹层
            queding.on('click', function () {
                cpResultbox.hide();
                enable();
            });
            // 如果帖子中存在大转盘
            if (vars.luckId) {

                var timeout = $('#timeout');
                var startClick = false;
                // 点击抽奖按钮开始抽奖
                $('.start').on('click', function () {
                    // 设定当前时间
                    var timeStart = new Date().getTime();
                    // 设定目标时间
                    var timeEnd = parseInt(vars.endtime);
                    // 计算时间差
                    var timeDistance = timeEnd - timeStart;
                    // 如果没登录，跳到登录页
                    if (vars.loginUrl) {
                        win.location = vars.loginUrl;
                        return;
                    }
                    if (timeDistance < 0) {
                        floatshow('活动已结束');
                    } else if (vars.userStatus === '0') {
                        floatshow('您必须报名后才能抽奖');
                    } else {
                        // 防止连点
                        if (startClick) {
                            return;
                        }
                        startClick = true;
                        require.async('lottery/lottery', function (lotteryData) {
                            lotteryData({
                                // lotteryId 为奖品ID
                                lotteryId: vars.lotteryId,
                                // lotteryArray 为指针dom
                                lotteryArray: $('#lotteryBtn'),
                                // url 为抽奖地址
                                url: vars.bbsSite + '?c=bbs&a=ajaxLuckDraw&luckId=' + vars.luckId + '&sign='
                                + vars.sign + '&activeId=' + vars.activeId + '&masterId=' + vars.masterId,
                                // 抽奖失败需要的pos
                                angle: vars.prizePos,

                                /**
                                 * 是否中奖且是否停止转动
                                 * @author MyOwns
                                 */
                                prizeListOrPhoneUpdate: function () {
                                    vars.prizeListOrPhoneUpdate = false;
                                },

                                /**
                                 * 转动指针停止并已经获奖
                                 * @author MyOwns
                                 */
                                lotteryStopSucc: function (data) {
                                    startClick = false;
                                    floatshow(data.root.mess);
                                },

                                /**
                                 * 转动指针停止并没有获奖
                                 * @author MyOwns
                                 */
                                lotteryStopFail: function (data) {
                                    startClick = false;
                                    floatshow(data.root.mess);
                                }
                            });
                        });
                    }
                });
                // 距离活动结束时间
                var showTime = function () {
                    var timeStart = new Date().getTime();
                    // 设定当前时间
                    var timeEnd = parseInt(vars.endtime);
                    // 设定目标时间
                    // 计算时间差
                    var timeDistance = timeEnd - timeStart;
                    if (timeDistance > 0) {
                        // 天
                        var intDay = Math.floor(timeDistance / 86400000);
                        timeDistance -= intDay * 86400000;
                        // 时
                        var intHour = Math.floor(timeDistance / 3600000);
                        timeDistance -= intHour * 3600000;
                        // 分
                        var intMinute = Math.floor(timeDistance / 60000);
                        // 时分秒为单数时、前面加零
                        if (intDay < 10) {
                            intDay = '0' + intDay;
                        }
                        if (intHour < 10) {
                            intHour = '0' + intHour;
                        }
                        if (intMinute < 10) {
                            intMinute = '0' + intMinute;
                        }
                        // 显示时间
                        timeout.html(intDay + '天' + intHour + '时' + intMinute + '分');
                    }
                };

                // 如果活动没结束
                if (timeout.length > 0) {
                    // 显示倒计时
                    showTime();
                }
                // 获奖名单手机屏幕自适应 及滚动
                var scrollingBox;
                var reachedBottom = false;
                var bottom;

                /**
                 * 抽奖滚动名单
                 */
                var initScrolling = function () {
                    scrollingBox = $('#xst')[0];
                    // 如果获奖人数多于两个
                    if ($('.w25').length > 2) {
                        setInterval(function () {
                            var origin = scrollingBox.scrollTop++;
                            // 滚动到底，再滚动值不变
                            if (origin === scrollingBox.scrollTop) {
                                if (!reachedBottom) {
                                    scrollingBox.innerHTML += scrollingBox.innerHTML;
                                    reachedBottom = true;
                                    bottom = origin;
                                } else {
                                    scrollingBox.scrollTop = bottom;
                                }
                            }
                        }, 50);
                    }
                };
                initScrolling();
            }

            var clickFlag = false;
            // 报名框
            var tzBox = $('#spikeFloat'),//秒杀报名弹层
                yzmSta = $('.yzm-sta');

            /**
             * 显示浮层
             * @param msg 浮层信息
             */
            var showFloat = function (msg) {
                tzBox.show();
                yzmSta.html(msg).show();
                setTimeout(function () {
                    tzBox.hide();
                    yzmSta.hide();
                }, 1500);
            };
            // 秒杀活动
            var spikeSection = $('#spikeSection');
            if (spikeSection.length > 0) {
                vars.begin = parseInt(vars.begin + '000');
                vars.end = parseInt(vars.end + '000');
                // 参与按钮
                var joinIn = $('#wapbbsxq_B05_01'),
                // 秒杀按钮
                    spike = $('#wapbbsxq_B05_02'),
                    tzCon = $('.tz-con'),
                    cancel = $('#cancel'),
                    qd = $('#qd'),
                    realName = $('.phone'),
                    phone = $('.vcode'),
                    priceBox = $('#priceBox'),
                    redDf = $('.red-df');
                var thisTime = new Date().getTime();
                var signUpFlag = false, judgeTime;

                /**
                 * 点击秒杀
                 */
                var spikeUp = function () {
                    spike.removeClass('disable').off('click').on('click', function () {
                        // 防止连点
                        if (clickFlag) {
                            return;
                        }
                        clickFlag = true;
                        $.ajax({
                            url: vars.bbsSite + '?c=bbs&a=ajaxBbsSpike',
                            data: {
                                city: vars.city,
                                sign: vars.sign,
                                masterId: vars.masterId,
                                spikeId: vars.spikeId
                            },
                            type: 'get',
                            success: function (data) {
                                // 没登陆跳登陆
                                if (data.result === 'noLog') {
                                    win.location = data.url;
                                    return;
                                }
                                clickFlag = false;
                                showFloat(data.mess);
                                // 秒杀结束
                                if (data.result === '007') {
                                    judgeTime && clearInterval(judgeTime);
                                    spike.html('秒杀已结束').addClass('disable').off('click');
                                }
                            },
                            error: function () {
                                clickFlag = false;
                                showFloat('网络异常，稍后再试');
                            }
                        });
                    });
                };

                /**
                 * 报名
                 * @param sign
                 */
                var signUpAjax = function (sign) {
                    // 防止连点
                    if (clickFlag) {
                        return;
                    }
                    clickFlag = true;
                    var data = {
                        city: vars.city,
                        sign: vars.sign,
                        masterId: vars.masterId,
                        spikeId: vars.spikeId
                    };
                    if (sign) {
                        data.mobile = phone.val();
                        data.realName = realName.val();
                    }
                    $.ajax({
                        url: vars.bbsSite + '?c=bbs&a=ajaxSecondKillSignUp',
                        data: data,
                        type: 'get',
                        success: function (data) {
                            // 没登陆跳登陆
                            if (data.result === 'noLog') {
                                win.location = data.url;
                                return;
                            }
                            if (sign) {
                                tzBox.hide();
                                tzCon.hide();
                                if (data.result === '009') {
                                    data.mess = '您没有报名权限';
                                } else if (data.result === '100') {
                                    // 您已报名
                                    joinIn.addClass('visit').html('\u60a8\u5df2\u62a5\u540d').off('click');
                                    // 报完名人数加一
                                    redDf.html(parseInt(redDf.html()) + 1);
                                } else if (data.result === '008') {
                                    // 我要参与不可点，变成报名已结束
                                    joinIn.html('报名已结束').addClass('disable').off('click');
                                    signUpFlag = true;
                                    // 绑定秒杀事件
                                    spikeUp();
                                }
                                showFloat(data.mess);
                            } else {
                                tzBox.show();
                                tzCon.show();
                            }
                            clickFlag = false;
                        },
                        error: function () {
                            tzBox.hide();
                            tzCon.hide();
                            clickFlag = false;
                            showFloat('网络异常，稍后再试');
                        }
                    });
                };

                /**
                 * 点击报名
                 */
                var signUp = function () {
                    joinIn.on('click', function () {
                        signUpAjax();
                    });
                };

                // 中奖结果
                var pricesResult = {}, firstAjax = false, priceAjaxResult;


                /**
                 * 查看中奖结果
                 */
                var showPricesRolling = function () {
                    var priceBoxDom = priceBox[0];
                    var firstReachedBottom = false, bottom, originHtml, count;
                    setInterval(function () {
                        var origin = priceBoxDom.scrollTop++;
                        // 滚动到底，再滚动值不变
                        if (origin === priceBoxDom.scrollTop) {
                            // 第一次滚到底部
                            if (!firstReachedBottom) {
                                firstReachedBottom = true;
                                originHtml = pricesResult.data || priceBoxDom.innerHTML;
                                count = pricesResult.total || priceBox.find('li').length;
                                priceBoxDom.innerHTML += originHtml;
                                bottom = origin;
                            } else {
                                // 如果有新的数据
                                if (pricesResult.data) {
                                    priceBoxDom.innerHTML = originHtml + pricesResult.data;
                                    bottom = count * 20 - 64;
                                    originHtml = pricesResult.data;
                                    count = pricesResult.total;
                                    pricesResult = {};
                                }
                                priceBoxDom.scrollTop = bottom;
                            }
                        }
                    }, 50);
                };

                /**
                 * 中奖结果刷新
                 */
                var pricesFresh = function () {
                    $.ajax({
                        url: vars.bbsSite + '?c=bbs&a=ajaxGetSpikeList',
                        data: {
                            city: vars.city,
                            sign: vars.sign,
                            spikeId: vars.spikeId
                        },
                        success: function (result) {
                            if (result) {
                                // 如果请求数据有变化
                                if (priceAjaxResult !== result.data) {
                                    pricesResult = result;
                                    priceAjaxResult = result.data;
                                } else {
                                    pricesResult = {};
                                }
                                // 大于3条开启滚动
                                if (result.total > 3 && !firstAjax) {
                                    // 如果之前没有获奖名单
                                    if (priceBox.find('li').length === 0) {
                                        // 先加上
                                        priceBox.html(pricesResult.data);
                                    }
                                    firstAjax = true;
                                    // 开始滚动
                                    showPricesRolling();
                                } else if (result.data !== priceAjaxResult) {
                                    // 数据有变化才重新替换
                                    priceBox.html(pricesResult.data);
                                }
                            } else {
                                pricesResult = {};
                            }
                        },
                        error: function () {
                            pricesResult = {};
                        }
                    });
                };

                // 秒杀是红色就能点
                if (!spike.hasClass('disable')) {
                    spikeUp();
                }

                // 如果现在时间小于秒杀开始时间，处于报名期间
                if (thisTime < vars.begin) {
                    // 如果没报名（按钮显示不是您已报名），我要参与按钮可点击
                    if (joinIn.html() !== '\u60a8\u5df2\u62a5\u540d') {
                        signUp();
                    }
                    judgeTime = setInterval(function () {
                        // 大于秒杀开始时间，处于秒杀期间
                        if (!signUpFlag && new Date().getTime() > vars.begin) {
                            // 我要参与不可点，变成报名已结束
                            joinIn.html('报名已结束').addClass('disable').off('click');
                            signUpFlag = true;
                            // 绑定秒杀事件
                            spikeUp();
                        }
                        if (signUpFlag) {
                            // 刷新中奖结果
                            pricesFresh();
                        }
                        // 大于结束时间，秒杀结束
                        if (signUpFlag && new Date().getTime() > vars.end) {
                            clearInterval(judgeTime);
                            // 秒杀不可点
                            spike.html('秒杀已结束').addClass('disable').off('click');
                        }
                    }, 30000);
                } else if (thisTime < vars.end) {
                    joinIn.html('报名已结束').addClass('disable').off('click');
                    spikeUp();
                    // 秒杀期间
                    judgeTime = setInterval(function () {
                        // 大于结束时间，秒杀不可点
                        if (new Date().getTime() > vars.end) {
                            clearInterval(judgeTime);
                            spike.html('秒杀已结束').addClass('disable').off('click');
                        }
                        // 刷新中奖结果
                        pricesFresh();
                        // 发送请求来请求获奖结果
                    }, 30000);
                }
                if (priceBox.find('li').length > 0) {
                    // 秒杀结束滚动显示获奖结果
                    showPricesRolling();
                }

                // 取消按钮
                cancel.on('click', function () {
                    tzBox.hide();
                });
                // 确定按钮
                qd.on('click', function () {
                    if (!/^1[34578][0-9]{9}$/.test(phone.val())) {
                        alert('请输入正确的手机号');
                    } else {
                        signUpAjax(true);
                    }
                });
            }

            // 投票提交按钮
            var submit = $('#sub_vote');
            // 有投票活动
            if (submit.length > 0) {
                var bbsVote = $('.bbs-vote');
                submit.on('click', function () {
                    var vote = $('#vote');
                    var isVote = false;
                    var optionsId = [];
                    // 判断是否投票
                    vote.find('input').each(function () {
                        var ele = $(this);
                        if (ele.prop('checked')) {
                            isVote = true;
                            optionsId.push(ele.closest('li').attr('data-optionid'));
                        }
                    });
                    if (!isVote) {
                        // 亲~~，没有选择投票选项！
                        showFloat('\u4eb2\u007e\u007e\uff0c\u6ca1\u6709\u9009\u62e9\u6295\u7968\u9009\u9879\uff01');
                        return;
                    }
                    if (clickFlag) {
                        return;
                    }
                    clickFlag = true;
                    $.ajax({
                        url: vars.bbsSite + '?c=bbs&a=ajaxBbsVote&city=' + vars.city,
                        data: {
                            optionIds: optionsId.join(','),
                            voteId: vote.attr('data-voteid'),
                            masterId: vars.masterId,
                            sign: vars.sign
                        },
                        type: 'get',
                        success: function (data) {
                            // 没登陆，去登陆
                            if (data.result === 'noLog') {
                                win.location = data.url;
                                return;
                            }
                            if (data.result === '100') {
                                bbsVote.html(data.data);
                            } else if (data.result === '001' || data.result === '002' || data.result === '007') {
                                // 很抱歉，投票失败！
                                showFloat('\u5f88\u62b1\u6b49\uff0c\u6295\u7968\u5931\u8d25\uff01');
                            } else {
                                showFloat(data.mess);
                            }
                            clickFlag = false;
                        },
                        error: function () {
                            clickFlag = false;
                            // 网络异常，稍后再试
                            showFloat('\u7f51\u7edc\u5f02\u5e38\uff0c\u7a0d\u540e\u518d\u8bd5');
                        }
                    });
                });
            }

            // 活动贴
            if (vars.activeId > 0) {
                // 我要报名按钮
                var baoMing = $('#baoMing');
                // 报名的信息浮层
                var activeFloat = $('#activeFloat');
                // 报名的信息浮层关闭按钮
                var activeClose = $('#activeClose');
                // 提交按钮
                var activeSubmit = $('#activeSubmit');
                // 姓名
                var aName = $('#aName');
                // 电话
                var aPhone = $('#aPhone');
                // 参加人数
                var aPersonNum = $('#aPersonNum');
                // 留言
                var aMessage = $('#aMessage');
                // 要跳转回的地址
                var aUrl = vars.bbsSite + vars.city + '/' + vars.sign + '/' + vars.postId + '.htm';
                // 点击报名按钮
                baoMing.on('click', function () {
                    if (vars.loginUrl) {
                        window.location.href = vars.loginUrl;
                        return;
                    } else if (vars.ismobilevalid !== '1') {
                        window.location.href = vars.resetUrl + '?burl=' + encodeURIComponent(aUrl);
                        return;
                    }
                    var $that = $(this);
                    var errMsg = $that.attr('data-msg').trim();
                    if (errMsg) {
                        floatshow(errMsg);
                        return;
                    }
                    activeFloat.show();
                    //unable();

                });
                // 点击关闭按钮关闭浮层
                activeClose.on('click', function () {
                    activeFloat.hide();
                    //enable();
                });
                // 点击留言按钮，点击后光标在文字后方闪烁，默认文字不消失
                aMessage.on('input', function () {
                    var aMsg = aMessage.val();
                    if (aMsg === '我要报名参加~') {
                        aMessage.html('').focus().val('我要报名参加~');
                    }
                });
                // 点击参加人数
                aPersonNum.on('input', function () {
                    var aPerReg = /^[1-9][0-9]*$/;
                    if (!aPerReg.test(aPersonNum.val())) {
                        aPersonNum.val('');
                    }
                });

                // 防止两次点击
                var aFlag = false;
                // 点击提交按钮
                activeSubmit.on('click', function () {
                    if (aFlag) {
                        return;
                    }
                    aFlag = true;
                    var params = {};
                    if (aName.length > 0) {
                        var aNameVal = aName.val().trim();
                        if (aNameVal === '' || aNameVal === '请输入你的姓名') {
                            aFlag = false;
                            alert('\u8bf7\u8f93\u5165\u771f\u5b9e\u59d3\u540d');
                            return;
                        }
                        params.aName = encodeURIComponent(aNameVal);
                    }
                    if (aPhone.length > 0) {
                        var rexp = /^1[3,4,5,6,7,8]{1}[0-9]{9}$/;
                        var aPhoneVal = parseInt(aPhone.val());
                        if (!rexp.test(aPhoneVal)) {
                            aFlag = false;
                            alert('\u624b\u673a\u53f7\u683c\u5f0f\u4e0d\u6b63\u786e');
                            return;
                        }
                        params.aPhone = aPhoneVal;
                    }
                    if (aPersonNum.length > 0) {
                        var aPersonNumVal = $('#aPersonNum').val();
                        if (aPersonNumVal === '') {
                            aFlag = false;
                            alert('\u53c2\u52a0\u4eba\u6570\u4e0d\u80fd\u4e3a\u7a7a');
                            return;
                        } else if (parseInt(aPersonNumVal) <= 0) {
                            aFlag = false;
                            alert('\u53c2\u52a0\u4eba\u6570\u5fc5\u987b\u8f93\u5165\u5927\u4e8e\u96f6\u7684\u6570\u5b57');
                            return;
                        } else if (parseInt(vars.signlimit) !== 0 && parseInt(aPersonNumVal) > parseInt(vars.signlimit)) {
                            aFlag = false;
                            alert('\u5df2\u8d85\u8fc7\u9650\u5236\u4eba\u6570');
                            return;
                        }
                        params.aPersonNum = parseInt(aPersonNumVal);
                    }
                    if (aMessage.length > 0) {
                        var aMessageVal = aMessage.val().trim();
                        if (aMessageVal === '') {
                            aFlag = false;
                            alert('\u7559\u8a00\u4e0d\u80fd\u4e3a\u7a7a');
                            return;
                        }
                        aMessage.val(aMessageVal);
                        params.aMessage = encodeURIComponent(aMessageVal);
                    }
                    // 论坛id
                    params.forumid = vars.forumId;
                    // 帖子id
                    params.postid = vars.postId;
                    // 报名回帖标题
                    params.title = encodeURIComponent(vars.activeName);

                    $.post(vars.bbsSite + '?c=bbs&a=joinActivePost', params, function (data) {
                        aFlag = false;
                        if (data && data.errorType === '100') {
                            activeFloat.hide();
                            // enable();
                            window.location.href = aUrl;
                        } else if (data && data.errorType) {
                            // enable();
                            alert(data.errorInfo);
                        }
                    });
                });
            }
            // 以下js仅针对看房团报名 begin
            if (vars.KFTflag === 'true') {
                // 验证码容器Li
                var $codeLi = $('#codeLi');
                // 报名按钮
                var $KFTbm = $('.KFTbm');
                // 验证是否是数字
                var $numPattern = /^\d*$/;
                // 自动填写用户手机号
                if (vars.phone !== '') {
                    $mobilecodeManualId.val(vars.phone);
                }
                // 若当前时间大于看房团时间，禁止所有输入框编辑
                if (vars.KFTtime === 'error') {
                    // 报名按钮变灰
                    $('#KFTbmdiv').removeClass('active');
                    $KFTbm.text('报名已截止');
                    // 禁止输入姓名
                    $('#KFTname').attr('disabled', true);
                    $('#KFTname').css('background-color', '#fff');
                    // 禁止输入人数
                    $('#KFTnum').attr('disabled', true);
                    $('#KFTnum').css('background-color', '#fff');
                    // 禁止输入电话号
                    $('#mobilecodeManual').attr('disabled', true);
                    $('#mobilecodeManual').css('background-color', '#fff');
                    // 禁止发送验证码
                    $('#sendCode').off('click');
                    // 禁止输入验证码
                    $('#codeVal').attr('disabled', true);
                    $('#codeVal').css('background-color', '#fff');
                    // 禁止点击协议
                    $('#xyradio').attr('disabled', true);
                    return false;
                }
                // 手机号若发生改变,显示验证码发送按钮及验证码填写处
                $mobilecodeManualId.on('change', function () {
                    $codeLi.show();
                    $sendCode.show();
                });
                // 查找看房团路线li个数,设置对应div,ul高度，为了滚动
                var liNum = $('#KFTrouteCon').find('li').length - 3;
                $('#KFTrouteCon').height(liNum * 45 + 'px');
                $('#KFTrouteCon').find('ul').height(liNum * 45 * 2 + 'px');
                // 选择看房团路线-弹出浮层及滚动
                var $KFTcon = $('#KFTrouteCon')
                $('#KFTroute').on('click', function () {
                    if (vars.KFTroad === 'false') {
                        displayLose(2000, '线路获取失败，请刷新后重试');
                        return false;
                    }
                    // 显示浮层
                    $('#KFTrouteBox').show();
                    unable();
                    var iscrollRt = new IScroll('#KFTrouteCon');
                    iscrollRt.scrollTo(0, 0, 1);
                    iscrollRt.on('scrollEnd', function () {
                        var st = Math.round(this.y / 45);
                        this.scrollTo(0, st * 45, 200);
                        $KFTcon.find('li').removeClass();
                        var $nowLi = $KFTcon.find('li').eq(Math.abs(st) + 2);
                        $nowLi.addClass('cur');
                    });
                });
                // 点击路线选择的确定按钮
                $('#KFTrouteSubmit').on('click', function () {
                    // 选择的路线值
                    var selectedRt = $KFTcon.find('li.cur').text();
                    $('#KFTroute').text(selectedRt).addClass('xuan_jg');
                    $('#KFTrouteBox').hide();
                    enable();
                });
                // 报名按钮
                $KFTbm.on('click', function () {
                    // 姓名
                    var $KFTname = $('#KFTname').val().trim();
                    // 人数
                    var $KFTnum = $('#KFTnum').val().trim();
                    // 验证码值
                    var $codeVal = $('#codeVal').val().trim();
                    // 看房团路线
                    var $KFTroute = $('#KFTroute').text();
                    // 电话号码
                    var $KFTphone = $mobilecodeManualId.val().trim();
                    // 验证姓名
                    if ($KFTname === '') {
                        displayLose(2000, '请输入真实姓名');
                        return false;
                    } else if ($KFTname.length > 8) {
                        displayLose(2000, '姓名最多输入8个字');
                        return false;
                    }
                    // 验证报名人数
                    if ($KFTnum === '') {
                        displayLose(2000, '请输入大于0的人数');
                        return false;
                    } else if (!$numPattern.test($KFTnum)) {
                        displayLose(2000, '请输入格式正确的人数');
                        return false;
                    } else if ($KFTnum > 20) {
                        displayLose(2000, '报名人数最多20人');
                        return false;
                    }
                    // 验证手机号码
                    if ($KFTphone === '') {
                        displayLose(2000, '请输入手机号');
                        return false;
                    } else if (!mobile.test($KFTphone)) {
                        displayLose(2000, '请输正确格式的手机号');
                        return false;
                    }
                    // 验证验证码-如果有填写
                    // 判断验证码
                    if (!$codeLi.is(':hidden') && !patterncode.test($codeVal)) {
                        displayLose(2000, '请填写验证码');
                        return false;
                    }
                    // 验证看房团路线
                    if ($KFTroute === '请选择看房路线') {
                        displayLose(2000, '请选择看房团路线');
                        return false;
                    }
                    // 是否勾选了协议
                    if ($('.ipt-rd').val() !== '1') {
                        displayLose(2000, '请阅读《看房团活动声明》');
                        return false;
                    }
                    var verifySuccess = function () {
                        // 定义一个参数对象 用来存娶提交给后台的数据
                        var param = {
                            phone: $KFTphone,
                            lineid: $('#KFTrouteCon').find('li.cur').attr('id'),
                            username: $KFTname,
                            usercount: $KFTnum,
                            ourl: window.location.href
                        };
                        var sucurl = vars.bbsSite + '?c=bbs&a=ajaxKFTSignUp';
                        $.ajax({
                            url: sucurl,
                            data: param,
                            dataType: 'json',
                            type: 'post',
                            async: false,
                            success: function (data) {
                                if (data) {
                                    // 如果数据提交成功
                                    if (data.Result === '1') {
                                        displayLose(2000, '恭喜您看房团报名成功');
                                    } else if (data.Result === '0') {
                                        displayLose(2000, '报名失败，请重新提交');
                                    } else {
                                        displayLose(2000, data.Message);
                                    }
                                } else {
                                    displayLose(2000, '报名失败，请重新提交');
                                }
                            }
                        });
                    };
                    var verifyError = function () {
                        displayLose(2000, '短信验证码验证失败,请尝试重新发送');
                    };

                    if (parseInt(vars.authenticated)) {
                        // 已经登录了,不用再验证验证码
                        verifySuccess();
                    } else {
                        verifycode.sendVerifyCodeAnswer($KFTphone, $codeVal, verifySuccess, verifyError);
                    }
                });
            }// 看房团js:END
            // 分享
            // 微信分享
            var summary = vars.pageDes;
            var title = vars.pageTitle;
            var imgUrl = location.protocol + $('.wxImg').attr('src');
            var shareUrl = location.href;
            var Weixin = require('weixin/2.0.0/weixinshare');
            var wx = new Weixin({
                debug: false,
                shareTitle: title,
                // 副标题
                descContent: summary,
                lineLink: shareUrl,
                imgUrl: imgUrl,
                swapTitle: false
            });
            if ($('.share').length) {
                var SuperShare = require('superShare/1.0.1/superShare');
                var config = {
                    // 分享的内容title
                    title: title,
                    // 分享时的图标
                    image: imgUrl,
                    // 分享内容的详细描述
                    desc: summary,
                    // 分享的链接地址
                    url: shareUrl,
                    // 分享的内容来源
                    from: ' 房天下' + vars.cityname + '论坛'
                };
                new SuperShare(config);
            }
        };
    });