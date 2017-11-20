/**
 * Created by user on 2016/10/31.
 */
$(function ($) {
    var angles = 0;
    // 角度，慢慢增加的值，也就是加速度
    var total = 0;
    // 从转动开始一共转动的度数
    var lotterytran = '';
    // 转动匀速的一瞬间时的settimeout
    var lotteryspup = '';
    // 转动加速时的settimeout
    var lotteryFin = '';
    // 减速的settimeout
    var fintotal = 0;
    // 最后需要转动的角度是多少
    var finTime = 0;
    // 最后转动需要的时间
    var finA = 0;
    // 最后转动的加速度，也就是想要求的值
    var finrotatetotal = 0;
    // 最后转动的渐变值
    var timer = 0;
    // 计数器计算最后减速的时候循环的次数
    var lotteryData;
    var lotteryId = '1';
    var isStop = false;
    var isscroll = true;
    var lotterFlag = '';
    var lotteryId1 = $('#lotteryId1').val();
    var lotteryId2 = $('#lotteryId2').val();
    var site = $('#mainSite').val();
    // 提示信息弹框
    var popBox = $('.pop-box');
    // 第一个大转盘可以玩的次数
    var canPlayCount1 = +$('#canPlayCount1').val();
    // 第二个大转盘可以玩的次数
    var canPlayCount2 = +$('#canPlayCount2').val();
    // 第一个转盘是否分享
    var hasShare1 = $('#hasShare1').val();
    // 第二个转盘是否分享
    var hasShare2 = $('#hasShare2').val();
    var lotteryData = function (config) {
        config = config || {};
        // 合并默认配置
        config = $.extend(true, {}, config);
        return new lotteryData.fn.init(config);
    };
    lotteryData.fn = lotteryData.prototype = {
        constructor: lotteryData,
        prizeListOrPhoneUpdate: true,
        init: function (config) {
            if (fintotal !== 0) {
                angles = 0;
                total = 0;
                fintotal = 0;
                finTime = 0;
                finA = 0;
                finrotatetotal = 0;
                timer = 0;
            }
            this.lotteryArray = config.lotteryArray;
            this.config = config;
            this.lotteryStart(0);
        },

        /**
         * 转动的方式 每次转动多少度
         * @author MyOwns
         */
        lotteryFun: function (total) {
            var that = this;
            that.lotteryArray.css({
                '-webkit-transform': 'rotate(' + total + 'deg)',
                'transform-origin': '53% 58%',
                '-ms-transform-origin': '53% 58%',
                '-webkit-transform-origin': '53% 58%',
                '-o-transform': 'rotate(' + total + 'deg)',
                '-moz-transform': 'rotate(' + total + 'deg)',
                transform: 'rotate(' + total + 'deg)'
            });
        },

        /**
         * 转动停止 减速并且停止到正确的位置
         * @author MyOwns
         */
        lotteryStop: function (times, callback) {
            var that = this;

            // 通过计算加速度，然后做减速运动
            var lotteryFin = setTimeout(function () {
                total += angles;
                angles -= 1 / finA;
                that.lotteryFun(total);
                if (times + 1 > finTime) {
                    if (isStop) {
                        callback && callback();
                    }
                    isStop = false;
                    isscroll = true;
                    that.bodyscroll();
                }
            }, times * 50);
            times++;
            if (times > finTime) {
                clearTimeout(lotteryFin);
                return false;
            }
            this.lotteryStop(times, callback);
        },
        /** 匀速转动 需要获取最后的时候的位置 需要停止到的位置。进行运算
         * 运算方式是最后的位置的360度的情况。与需要停止到的位置作差。再加上最后的位置和最后三圈1080度。
         * 然后进行减速运动。运动到最后的位置为止。
         * @author MyOwns
         */
        lotteryGoon: function () {
            var that = this;
            clearTimeout(lotterytran);
            // 匀速转动，并没有转动角度的变化。
            var lotteryroll = setInterval(function () {
                // 匀速运动，没有任何加速
                total += 48;
                that.lotteryFun(total);
            }, 50);
            // 抽奖---------------------发送请求
            var url = site + '/huodongAC.d?m=newWheelLuckDraw&class=NewWheelLotteryHc&lotteryId=' + lotterFlag + '&id=' + lotteryId;
            $.getJSON(url, function (data) {
                var root = data['root'];
                var prizeName = root['prizeName'] || '谢谢参与';
                fintotal = root['anglefordoubleEE'];
                if (fintotal === '') {
                    if (lotteryId === '1') {
                        fintotal = 135;
                    } else if (lotteryId === '2') {
                        fintotal = 180;
                    }
                }
                clearInterval(lotteryroll);
                fintotal = (Math.floor(total / 360) + 3) * 360 + fintotal - total;
                finA = fintotal / finrotatetotal;
                timer = angles;
                for (; ; finTime++) {
                    timer -= 1 / finA;
                    if (timer < 0) {
                        finTime -= 1;
                        break;
                    }
                }
                isStop = true;
                that.lotteryStop(0, function () {
                    popBox.show();
                    $('#title').text('恭喜您获得');
                    $('#prize').text(prizeName);
                });
            });
        },
        /**
         * 相当于0.05秒转动一次，但是转动的幅度total变的越来越大
         * @author MyOwns
         */
        lotteryStart: function (times) {
            var that = this;
            isscroll = false;
            lotteryspup = setTimeout(function () {
                // 角度的逐渐增加
                angles++;
                total += angles;
                // 一共增加了多少的角度
                finrotatetotal = total;
                // 开始逐渐进行转动
                that.lotteryFun(total);
            }, times * 50);
            // 加速到一定的程度的时候，开始进入匀速转动的方法
            if (times === 49) {
                // 清空加速的settimeout
                if (lotteryspup !== '') {
                    clearTimeout(lotteryspup);
                }
                // 进入匀速转动~
                lotterytran = setTimeout(function () {
                    that.lotteryGoon();
                }, times * 50);
                return false;
            }
            times++;
            // 没有用到循环，原因是因为用的settimeout，导致出现判断语句中的条件几乎同时满足。出现转动方式不准确
            that.lotteryStart(times);
        },

        /**
         * 阻止滑动事件
         * @author MyOwns
         */
        bodyscroll: function () {
            if (!isscroll) {
                $('body').on('touchmove', function (e) {
                    e.preventDefault();
                });
            } else {
                $('body').off('touchmove');
            }
        }
    };
    lotteryData.fn.init.prototype = lotteryData.fn;
    $('.swiper-container').css('height', window.innerHeight + 'px');
    $('.swiper-wrapper').css('height', window.innerHeight + 'px');
    $('#pt2Box').css('height', window.innerHeight + 'px');
    var mySwiper = new Swiper('.swiper-container', {
        direction: 'vertical',
        onSlideChangeEnd: function (swiper) {
            var index = swiper.activeIndex + 1;
            var preIndex = swiper.previousIndex + 1;
            $('#pt' + preIndex + 'Box').hide();
            $('#pt' + index + 'Box').show();
        }
    });
    // 房东抽奖区
    $('.fdcj').on('click', function () {
        $('.swiper-container').hide();
        $('#p3').show();
        lotteryId = '1';
        setTimeout(function () {
            var bd = $('.hj-list ul');
            var height = $($('.hj-list ul')[0]).height();
            setInterval(function () {
                if (bd[0].offsetTop <= -height) {
                    bd[0].style.top = 0;
                }
                bd[0].style.top = bd[0].offsetTop - 1 + 'px';
            }, 50);
        }, 50);
    });
    // 所在城市
    var city = $('#encity').val();
    // 我要发房
    $('.wyff').on('click', function () {
        if (checkLogin()) {
            return;
        }
        location.href = site + '/my/?c=myzf&a=zfType&city=' + city;
    });
    // 使用优惠券
    $('.syyh').on('click', function () {
        location.href = site + '/zf/' + city + '/s1/';
    });
    // 租客抽奖区
    $('.zkcj').on('click', function () {
        $('.swiper-container').hide();
        $('#p4').show();
        lotteryId = '2';
        setTimeout(function () {
            var bd = $('.hj-list ul');
            var height = $($('.hj-list ul')[1]).height();
            setInterval(function () {
                if (bd[1].offsetTop <= -height) {
                    bd[1].style.top = 0;
                }
                bd[1].style.top = bd[1].offsetTop - 1 + 'px';
            }, 50);
        }, 50);
    });
    // 用户是否已经分享过
    var hasShare = $('#hasShare').val();
    // 登录链接
    var loginUrl = $('#loginUrl').val();
    // 是否绑定手机号
    var bingPhoneUrl = $('#bingPhoneUrl').val();
    // 是否登录
    var isLogin = $('#isLogin').val();
    var isBindPhone = $('#isBindPhone').val();
    var activityUrl = location.href.replace('#p3', '').replace('#p4', '');

    function checkLogin() {
        var flag = false;
        if (isLogin !== 'true') {
            flag = true;
            location.href = loginUrl + encodeURIComponent(activityUrl);
            return flag;
        }
        if (isBindPhone !== 'true') {
            flag = true;
            location.href = bingPhoneUrl + encodeURIComponent(activityUrl);
            return flag;
        }
    }

    var lottery = {};
    // 大转盘转动操作
    $('.zz').on('click', function () {
        if (checkLogin()) {
            return;
        }
        lotteryId = $(this).attr('aria-id');
        if (lotteryId === '1') {
            lotterFlag = lotteryId1;
            if(canPlayCount1 > 0) {
                canPlayCount1 --;
                lottery = new lotteryData();
            }
        } else if (lotteryId === '2') {
            lotterFlag = lotteryId2;
            if(canPlayCount2 > 0) {
                canPlayCount2 --;
                lottery = new lotteryData();
            }
        }
        lottery.lotteryArray = $('.zz');
    });
    $('.pop').click(function () {
        $(this).parent().hide();
    });

    var share = false;
    var imgSite = $('#imgSite').val();
    // 弹框获奖提示语
    var prize = $('#prize');
    // 点击再抽三次微信分享
    $('.zcsc').on('click', function () {
        if (checkLogin()) {
            return;
        }
        popBox.show();
        $('#title').text('');
        if(lotteryId === '1') {
            if(hasShare1 === 'true') {
                prize.text('只有首次分享可获得额外抽奖机会');
                return;
            } else if(hasShare1 === 'false') {
                prize.text('首次分享到朋友圈可获得三次抽奖机会');
            }
        } else if(lotteryId === '2') {
            if(hasShare2 === 'true') {
                prize.text('只有首次分享可获得额外抽奖机会');
                return;
            } else if(hasShare2 === 'false') {
                prize.text('首次分享到朋友圈可获得三次抽奖机会');
            }
        }
        // 微信分享
        var weixin = new Weixin({
            // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            debug: false,
            shareTitle: '11.11一个简单粗暴的活动',
            descContent: '今年11.11没新创意，简单粗暴抽大奖，最高免租三个月',
            lineLink: activityUrl,
            imgUrl: 'http:' + imgSite + '/doubleEE/images/share.png'
        }, function (res) {
            // 分享成功
            share = true;
            var url = site + '/huodongAC.d?m=updateUserInfo&class=ShoppingFestivalHc';
            $.get(url,{
                share: share,
                id: lotteryId,
                random: Math.random()*35
            }, function (data) {
                location.reload();
            });
        }, function (res) {
            // 分享失败回调
            alert('分享失败');
            share = false;
            var url = site + '/huodongAC.d?m=updateUserInfo&class=ShoppingFestivalHc';
            $.get(url,{
                share: share,
                id: lotteryId,
                random: Math.random()*35
            }, function (data) {
                console.log(data);
            });
        });
    });
});