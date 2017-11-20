/**
 * 家居论坛帖子详情页
 * @Last Modified by:   young
 * @Last Modified time: 2016/1/21
 */
define('modules/jiaju/bbsPostInfo', ['jquery', 'photoswipe/4.0.7/photoswipe', 'photoswipe/4.0.7/photoswipe-ui-default.min',
        'loadMore/1.0.0/loadMore', 'lazyload/1.9.1/lazyload', 'modules/jiaju/freeSignup','weixin/2.0.1/weixinshare'
    ],
    function (require, exports, module) {
        'use strict';
        module.exports = function () {
            var $ = require('jquery');
            var vars = seajs.data.vars,
                win = window;
            var conImg = $('.main'),
                oMore = $('.option-more'),
                oCont = $('.option-cont'),
                bbsBody = $('body'),
                toTop = $('.toTop'),
                imgStrs = conImg.find('.img-box img'),
                zcPop = $('.zc-pop'),
                float = $('.float'),
                moreRelate = $('#moreRelate');
            var freeSignup = require('modules/jiaju/freeSignup');
            var Weixin = require('weixin/2.0.1/weixinshare');
            freeSignup(true);
            // 获取消息
            var message = $('.icon-my');
            message.on('click', function () {
                $.get(vars.publicSite + '?c=public&a=ajaxUserInfo', function (info) {
                    var url;
                    if (!info.userid) {
                        url = location.protocol + '//m.fang.com/passport/login.aspx?burl=' + encodeURIComponent(window.location.href);
                    } else {
                        url = vars.bbsSite + '?c=bbs&a=getPersonnelLetter&username=' + info.username + '&city=' + vars.city;
                    }
                    window.location = url;
                    return;
                });
            });

            // 惰性加载
            require('lazyload/1.9.1/lazyload');
            $('.lazyload').lazyload({
                threshold: 100
            });

            // click流量统计
            require.async(location.protocol + '//clickm.fang.com/click/new/clickm.js', function () {
                window.Clickstat.eventAdd(window, 'load', function () {
                    window.Clickstat.batchEvent('wapjiajubbsxq_', '');
                });
            });
            // 用户行为统计
            require.async('jsub/_ubm.js?v=201407181100', function () {
                yhxw();
            });

            function yhxw() {
                _ub.city = vars.cityname;
                // 业务---B代表论坛
                _ub.biz = 'B';
                // 家居不分南北方，都传0
                _ub.location = 0;
                // 收集方法
                _ub.collect(0, {
                    'vmg.page': 'mbbsjjpostpage',
                    'vmb.posttitle': encodeURIComponent(vars.title),
                    'vmb.postid': vars.masterId + '^' + vars.forumId + '^' + encodeURIComponent(vars.fcity)
                });
            }

            /**
             * 滑动到某位置
             * @param pos 距离顶部高度
             */
            function animateTo(pos) {
                bbsBody.animate({
                    scrollTop: pos
                }, 200);
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
                        slides.push({
                            src: src,
                            w: ele.naturalWidth,
                            h: ele.naturalHeight
                        });
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
            oCont.on('click', function (e) {
                e.stopPropagation();
                oCont.toggleClass('option-plus-active');
                oMore.toggleClass('option-panel-active');
            });

            // 点击更多里的顶部按钮事件
            toTop.on('click', function () {
                animateTo(0);
            });

            // 回复提交后置底
            if (vars.bottomFlag === '1') {
                animateTo(document.body.scrollHeight);
            }

            // 回帖后滑动到对应的帖子上
            if (vars.postId !== '') {
                var postDiv = $('#post_' + vars.postId);
                if (postDiv.length > 0) {
                    animateTo(postDiv.offset().top);
                }
            }

            var loadMore = require('loadMore/1.0.0/loadMore');
            // 显示更多帖子回复
            if (vars.total >= 20) {
                loadMore({
                    url: vars.jiajuSite + '?c=jiaju&a=ajaxGetbbsInfo' + '&city=' + vars.city +
                        '&sign=' + vars.sign + '&masterId=' + vars.masterId + '&order=' + vars.order,
                    total: vars.total,
                    pagesize: 20,
                    pageNumber: 20,
                    moreBtnID: '.more',
                    loadPromptID: '.more',
                    isScroll: false,
                    contentID: '#list',
                    loadAgoTxt: '点击加载更多',
                    loadingTxt: '加载中...',
                    loadedTxt: '点击加载更多',
                    callback: function ($data) {
                        replyLoadFn($data.find('.repL'));
                    }
                });
            }

            // 显示每条回复中的更多评论
            function replyLoadFn($data) {
                $data.each(function () {
                    var ele = $(this),
                        moreBtn = ele.find('.loadm a'),
                        recount = moreBtn.data('recount');
                    if (recount > 3) {
                        var postId = moreBtn.data('post'),
                            cUserId = moreBtn.data('cuserid');
                        loadMore({
                            url: vars.jiajuSite + '?c=jiaju&a=ajaxGetbbsCom&city=' + vars.city + '&pageSize=10' +
                                '&sign=' + vars.sign + '&masterId=' + vars.masterId + '&postId=' + postId + '&cUserId=' + cUserId,
                            total: recount,
                            pagesize: 0,
                            pageNumber: 10,
                            moreBtnID: moreBtn,
                            loadPromptID: moreBtn,
                            isScroll: false,
                            contentID: ele.find('dl'),
                            loadAgoTxt: '还有' + (recount - 3) + '条评论...',
                            loadingTxt: '加载中...',
                            callback: function () {
                                var unloadCount = recount - ele.find('dd').length;
                                if (unloadCount) {
                                    moreBtn.html('还有' + unloadCount + '条评论...');
                                } else {
                                    var collapse = $('<a class="up">收起</a>');
                                    collapse.on('click', function () {
                                        moreBtn.show();
                                        collapse.hide();
                                        ele.find('dd[data-ajax]').hide();
                                    });
                                    moreBtn.html('还有' + (recount - 3) + '条评论...').after(collapse).off('click').on('click', function () {
                                        moreBtn.hide();
                                        collapse.show();
                                        ele.find('dd[data-ajax]').show();
                                    });
                                }
                            }
                        });
                        if (recount < 10) {
                            moreBtn.show();
                        }
                    }
                });
            }

            replyLoadFn($('.repL'));


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
            };
            // 点击弹层的X或者确定按钮，关闭弹层
            queding.on('click', function () {
                cpResultbox.hide();
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
                    if (timeDistance < 0) {
                        floatshow('活动已结束');
                    } else if (vars.userStatus === '0') {
                        floatshow('您必须报名后才能抽奖');
                    } else {
                        // 如果没登录，跳到登录页
                        $.get(vars.publicSite + '?c=public&a=ajaxUserInfo', function (info) {
                            if (!info.userid) {
                                window.location = location.protocol + '//m.fang.com/passport/login.aspx?burl=' +
                                    encodeURIComponent(window.location.href) + '&r=' + Math.random();
                                return;
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
                                        url: vars.bbsSite + '?c=jiaju&a=ajaxLuckDraw&luckId=' + vars.luckId +
                                            '&sign=' + vars.sign + '&activeId=' + vars.activeId + '&masterId=' + vars.masterId,
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
            var tzBox = $('.tz-box'),
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
                var joinIn = $('#joinIn'),
                    // 秒杀按钮
                    spike = $('#spike'),
                    tzCon = $('.tz-con'),
                    cancel = $('#qx'),
                    qd = $('#qd'),
                    realName = $('.phone'),
                    phone = $('.vcode'),
                    priceBox = $('#priceBox'),
                    redDf = $('.red-df');
                var thisTime = new Date().getTime();
                var signUpFlag = false,
                    judgeTime;

                /**
                 * 点击秒杀
                 */
                var spikeUp = function () {
                    spike.removeClass('disable').off('click').on('click', function () {
                        $.get(vars.publicSite + '?c=public&a=ajaxUserInfo', function (info) {
                            if (!info.userid) {
                                window.location = location.protocol + '//m.fang.com/passport/login.aspx?burl=' +
                                    encodeURIComponent(window.location.href) + '&r=' + Math.random();
                                clickFlag = false;
                                return;
                            } else {
                                // 防止连点
                                if (clickFlag) {
                                    return;
                                }
                                clickFlag = true;
                                $.ajax({
                                    url: vars.jiajuSite + '?c=jiaju&a=ajaxBbsSpike',
                                    data: {
                                        city: vars.city,
                                        sign: vars.sign,
                                        spikeId: vars.spikeId,
                                        pinpai: vars.pinpai
                                    },
                                    type: 'get',
                                    success: function (data) {
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
                        spikeid: vars.spikeId,
                        pinpai: vars.pinpai
                    };
                    if (sign) {
                        data.mobile = phone.val();
                        data.realName = realName.val();
                    }
                    $.get(vars.publicSite + '?c=public&a=ajaxUserInfo', function (info) {
                        if (!info.userid) {
                            window.location = location.protocol + '//m.fang.com/passport/login.aspx?burl=' +
                                encodeURIComponent(window.location.href) + '&r=' + Math.random();
                            return;
                        }
                        $.ajax({
                            url: vars.jiajuSite + '?c=jiaju&a=ajaxJoinSpike',
                            data: data,
                            type: 'get',
                            success: function (data) {
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
                var pricesResult = {},
                    firstAjax = false,
                    priceAjaxResult;


                /**
                 * 查看中奖结果
                 */
                var showPricesRolling = function () {
                    var priceBoxDom = priceBox[0];
                    var firstReachedBottom = false,
                        bottom, originHtml, count;
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
                        url: vars.jiajuSite + '?c=jiaju&a=ajaxGetSpikeList',
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
                if (priceBox.find('li').length > 3) {
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
                    $.get(vars.publicSite + '?c=public&a=ajaxUserInfo', function (info) {
                        if (!info.userid) {
                            window.location = location.protocol + '//m.fang.com/passport/login.aspx?burl=' +
                                encodeURIComponent(window.location.href) + '&r=' + Math.random();
                            clickFlag = false;
                            return;
                        } else {
                            $.ajax({
                                url: vars.jiajuSite + '?c=jiaju&a=ajaxBbsVote&city=' + vars.city,
                                data: {
                                    optionIds: optionsId.join(','),
                                    voteId: vote.attr('data-voteid'),
                                    masterId: vars.masterId,
                                    sign: vars.sign
                                },
                                type: 'get',
                                success: function (data) {
                                    if (data.result === '100') {
                                        showFloat(data.mess);
                                        bbsVote.html(data.code);
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
                        }
                    });
                });
            }

            // 微信分享
            var imgUrl = location.protocol + vars.public + '201511/images/app_fang.png';
            var wxImgFlag = true;
            var wxShare = function (src) {
                var pp = '/bbs_';
                if (vars.pinpai) {
                    pp = '/ppbbs_';
                }
                var shareurl = vars.jiajuSite + vars.city + pp + vars.sign + '_' + vars.masterId + '.html?src=client';
                if (wxImgFlag) {
                    new Weixin({
                        // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        debug: false,
                        shareTitle: vars.title,
                        descContent: vars.title,
                        lineLink: shareurl,
                        imgUrl: src || imgUrl,
                        // 对调标题 和 描述(微信下分享到朋友圈默认只显示标题,有时需要显示描述则开启此开关,默认关闭)
                        swapTitle: false
                    });
                }
            };

            if (imgStrs.length > 0) {
                imgStrs.each(function (index,ele) {
                    var $this = $(ele),
                        src = $this.attr('data-original');
                    if (src && wxImgFlag) {
                        var img = new Image();
                        img.src = $this.attr('data-original');
                        img.onload = function () {
                            if (wxImgFlag && this.width >= 200 && this.height >= 200) {
                                wxShare(img.src);
                                wxImgFlag = false;
                            }
                        };
                    }
                });
            } else {
                wxShare();
            }

            // 品牌论坛以及客户端打开列表变成分享
            $('#share').on('click', function () {
                zcPop.show();
                float.show();
            });
            float.on('click', function () {
                $(this).hide();
                zcPop.hide();
            });

            // 处理图片太宽
            window.onload = function () {
                $('img').each(function (index, element) {
                    var width = $(element).width();
                    if (width > $(window).width()) {
                        $(element).css('width', '100%');
                    }
                });
            };

            // 活动报名帖子添加用户信息
            $('input[name="realname"]').val(vars.realname).css('line-height', '22px');
            $('input[name="mobile"]').val(vars.mobile);

            // 相关热帖
            moreRelate.on('click', function () {
                $('#relateUl').removeClass('hid10');
                $(this).hide();
            });
            // 添加相关热帖，相关效果图，最新帖子，热门推荐四个Tab切换
            var tabSwitch = $('.Tabswitch');
            var currentTab = $('#ul_xgrt');
            var currentTitle = $('#tab_xgrt');
            var loadMoreBtn = $('.mt-1');
            var ajaxUrl = {
                xgrt: vars.jiajuSite + '?c=jiaju&a=ajaxGetRelatedHotList&city=' + vars.city +
                    '&sign=' + vars.sign + '&masterId=' + vars.masterId + '&pinpai=' + vars.pinpai,
                xgxgt: vars.jiajuSite + '?c=jiaju&a=ajaxGetRelevantPic&title=' + encodeURIComponent(vars.title),
                zxtz: vars.jiajuSite + '?c=jiaju&a=ajaxGetLatestPosts',
                rmtj: vars.jiajuSite + '?c=jiaju&a=ajaxGetHotTuiJian',
            };
            var ajaxFlag = true;
            tabSwitch.on('click', 'span', function () {
                var $parSpan = $(this).parent();
                var aId = $parSpan.attr('id');
                currentTitle = $parSpan;
                currentTab = $('#ul_' + aId.split('_')[1]);
                // 一个li请求后台借口
                var $li = currentTab.find('li');
                if ($li.length === 0 || ($li.length === 1 && ($li.hasClass('nopic') || $li.hasClass('loadfail')))) {
                    var deferred = tabAjaxFn(ajaxUrl[getTabKey()]);
                    deferred && deferred.done(function (str) {
                        var liNum = str.split('</li>');
                        var boolLi = liNum.length;
                        var boolFail = str.indexOf('class="loadfail"');
                        var obj = {
                            boolLi: boolLi,
                            boolFail: boolFail,
                            data: str
                        };
                        showDataFn(obj);
                    });
                } else {
                    showDataFn({
                        boolLi: currentTab.find('li').length
                    });
                }
            });
            // 加载更多
            loadMoreBtn.on('click', function () {
                var self = $(this);
                var $li = currentTab.find('li');
                if ($li.length === 0 || ($li.length === 1 && ($li.hasClass('nopic') || $li.hasClass('loadfail')))) {
                    var deferred = tabAjaxFn(ajaxUrl[getTabKey()]);
                    deferred && deferred.done(function (str) {
                        var liNum = str.split('</li>');
                        var boolLi = liNum.length;
                        var boolFail = str.indexOf('class="loadfail"');
                        var obj = {
                            boolLi: boolLi,
                            boolFail: boolFail,
                            data: str
                        };
                        showDataFn(obj);
                    });
                } else {
                    currentTab.removeClass('hid10');
                    self.hide();
                }
            });
            /**
             *  请求接口数据
             * @param url 请求地址
             */
            function tabAjaxFn(url) {
                if (ajaxFlag) {
                    ajaxFlag = false;
                    return $.get(url, function () {
                        ajaxFlag = true;
                    });
                }
            }

            function showDataFn(obj) {
                var btn = loadMoreBtn.find('a');
                // 处理当前的tab
                obj.data && currentTab.html(obj.data);
                if (currentTab.find('li').length >= 5 && currentTab.hasClass('hid10')) {
                    btn.text('加载更多');
                    loadMoreBtn.show();
                } else {
                    currentTab.removeClass('hid10');
                    loadMoreBtn.hide();
                    if (obj.boolLi < 2 && obj.boolFail > -1) {
                        btn.text('重新加载');
                        loadMoreBtn.show();
                    }
                }
                currentTab.siblings('ul').hide();
                currentTitle.addClass('active').siblings().removeClass('active');
                currentTab.show();
            }

            function getTabKey() {
                var id = currentTab.attr('id'),
                    ids = id.split('_');
                return (ids.length > 1 ? ids[1] : '');
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
                var aUrl = vars.jiajuSite + vars.city + '/bbs_' + vars.sign + '_' + vars.masterId + '.html';
                // 点击报名按钮
                baoMing.on('click', function () {
                    //需要先登录
                    $.get(vars.publicSite + '?c=public&a=ajaxUserInfo', function (info) {
                        if (!info.userid) {
                            window.location.href = location.protocol + '//m.fang.com/passport/login.aspx?burl=' + encodeURIComponent(aUrl);
                            return;
                        } else if (vars.ismobilevalid !== '1') {
                            window.location.href = vars.resetUrl + '?burl=' + encodeURIComponent(aUrl);
                            return;
                        }
                    });
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
                    params.postid = vars.masterId;
                    // 报名回帖标题
                    params.title = encodeURIComponent(vars.activeName);

                    $.post(vars.jiajuSite + '?c=jiaju&a=ajaxJoinActive', params, function (data) {
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
        };
    });