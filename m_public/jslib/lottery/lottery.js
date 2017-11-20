/** !
 * @Date: 2015-12-01
 * @file: 大转盘功能插件
 * @author 单量
 */
define('lottery/lottery', ['jquery'], function (require, exports, module) {
    'use strict';
    var $ = require('jquery');
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
    var isStop = false;
    // 判断是否中奖
    var isGetPrize = false;
    var isscroll = true;
    var mainData;
    lotteryData = function (config) {
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
                '-o-transform': 'rotate(' + total + 'deg)',
                '-moz-transform': 'rotate(' + total + 'deg)',
                transform: 'rotate(' + total + 'deg)'
            });
        },

        /**
         * 转动停止 减速并且停止到正确的位置
         * @author MyOwns
         */
        lotteryStop: function (times) {
            var that = this;

            // 通过计算加速度，然后做减速运动
            lotteryFin = setTimeout(function () {
                total += angles;
                angles -= 1 / finA;
                that.lotteryFun(total);
                if (times + 1 > finTime) {
                    if (isStop && isGetPrize) {
                        // 转动指针已经停止而且已获奖
                        that.config.prizeListOrPhoneUpdate();
                        that.config.lotteryStopSucc(mainData);
                        isGetPrize = false;
                    } else if (isStop && !isGetPrize) {
                        // 转动指针已经停止没有获奖
                        that.config.lotteryStopFail(mainData);
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
            this.lotteryStop(times);
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
            // var url = '/huodongAC.d?m=newWheelLuckDraw&class=NewWheelLotteryHc';
            var url = that.config.url;
            $.getJSON(url, {lotteryId: that.config.lotteryId}, function (data) {
                // 没登陆跳登陆
                if (data.result === 'noLog') {
                    window.location.href = data.url;
                    return;
                }
                mainData = data;
                var angle = that.config.angle;
                var prizeName = mainData.root.prizeName;
                isGetPrize = mainData.root.isGetPrize;
                if (!isGetPrize) {
                    angle = that.config.angle;
                } else {
                    angle = mainData.root.angle;
                }

                fintotal = (angle - 1) * 45 + 22;
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
                that.lotteryStop(0);
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
    return lotteryData;
});