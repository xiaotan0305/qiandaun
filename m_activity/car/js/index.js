/**
 * @Author: 坤鹏
 * @Date: 2015/11/27 9:52
 * @description: **index
 * @Last Modified by:   **
 * @Last Modified time:
 */
$(function () {
    'use strict';
    function Crazy() {
        this.bggif = $('.bggif');
        this.height = this.bggif.height() / 2;
        // 背景高度
        this.y = -this.bggif.height() / 2;
        // 元素运动速度
        this.speed = 1;
        // 障碍物
        this.lz = $('.lz');
        // 汽车盒子
        this.carBox = $('#carBox');
        // 汽车
        this.car = $('#car');
        // 汽车碰撞+1
        this.crash = this.car.find('i');
        // 爆炸效果
        this.bz = $('#bz');
        // 汽车赛道
        this.sd = parseInt(this.carBox.attr('class').match(/\d/)[0]);
        // 数组用于存创建元素的各个属性
        this.arr = [];
        // 屏幕高度
        this.screenY = $(window).height();
        // 左按钮
        this.leftBtn = $('#leftBtn');
        // 右按钮
        this.rightBtn = $('#rightBtn');
        // 计时器初始值
        this.sec = 0;
        // 1:没有礼包,2:只有礼包,3:只有礼包和路障,4:会出现礼包，路障，炸弹,5:礼包出现频率减少，路障和炸弹增多,6:关闭定时器 game over
        this.tap = 1;
        // 创建元素盒子
        this.doc = $(document.body);
        // 判断碰撞死亡
        this.life = true;
        // 礼包数
        this.lb = $('#lbNum').find('b');
        this.lbNum = 0;
        // 里程数
        this.len = $('#lenNum').find('b');
        this.lenNum = 0;
        this.init();
    }

    Crazy.prototype = {
        constructor: Crazy,
        init: function () {
            var that = this;
            // 循环获取每个元素
            $('.unit').each(function (index, ele) {
                var me = $(ele);
                that.pushArr(me);
            });
            // requestAnimationFrame做兼容
            (function () {
                var lastTime = 0;
                var vendors = ['webkit', 'moz'];
                for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
                    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
                    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
                }
                if (!window.requestAnimationFrame) {
                    window.requestAnimationFrame = function (callback) {
                        var currTime = new Date().getTime();
                        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                        var id = window.setTimeout(function () {
                            callback(currTime + timeToCall);
                        }, timeToCall);
                        lastTime = currTime + timeToCall;
                        return id;
                    };
                }
                if (!window.cancelAnimationFrame) {
                    window.cancelAnimationFrame = function (id) {
                        clearTimeout(id);
                    };
                }
            })();
            // 元素开始运动
            requestAnimationFrame(function () {
                // 背景运动
                that.bgRunYS();
                // 元素运动
                that.unitsRun(that.arr);
            });
            // 开启计时器
            clearInterval(that.timer);
            that.timer = setInterval(function () {
                that.sec++;
                that.timeControl();
            }, 1000);
            // 汽车变道控制
            that.leftBtn.on('click', function () {
                if (that.life) {
                    that.sd--;
                    if (that.sd <= 1) {
                        that.sd = 1;
                    }
                    that.carBox.removeClass().addClass('carBox sd' + that.sd);
                }
            });
            // 向右
            that.rightBtn.on('click', function () {
                if (that.life) {
                    that.sd++;
                    if (that.sd >= 3) {
                        that.sd = 3;
                    }
                    that.carBox.removeClass().addClass('carBox sd' + that.sd);
                }
            });
        },
        bgRunYS: function () {
            var that = this;
            that.y += 1;
            if (that.y >= 0) {
                that.y = -that.height;
            }
            that.bggif.css({
                transform: 'translateZ(0) translateY(' + that.y + 'px)',
                '-webket-transform': 'translateZ(0) translateY(' + that.y + 'px)'
            });
            requestAnimationFrame(function () {
                // 背景运动
                that.bgRunYS();
            });
        },
        // 元素运动
        unitsRun: function (arr) {
            var that = this;
            if (arr.length || that.sec <= 60) {
                for (var i = arr.length - 1; i > -1; i--) {
                    var obj = $(arr[i].ele);
                    arr[i].y += that.speed;
                    obj.css({
                        transform: 'translateZ(0) translateY(' + arr[i].y + 'px)',
                        '-webket-transform': 'translateZ(0) translateY(' + arr[i].y + 'px)'
                    });

                    var unitT = obj.offset().top,
                        unitH = parseInt(obj.height()),
                        carT = that.car.offset().top,
                        carH = parseInt(that.car.height());

                    if (unitT + unitH > carT) {
                        var sign = false;
                        // 超过屏幕的元素删除
                        if (obj.offset().top > that.screenY) {
                            obj.remove();
                            that.arr.splice(i, 1);
                            sign = true;
                        }
                        if (!sign) {
                            // 碰撞检测
                            if (parseInt(arr[i].sd) === that.sd && unitT + unitH < carT + carH && that.life) {
                                // 判断碰撞类型
                                switch (arr[i].type) {
                                    case 'fd':
                                        that.lbNum++;
                                        that.lb.html(that.lbNum);
                                        that.crash.html('+1').css('display', 'block');
                                        clearTimeout(that.timer1);
                                        that.timer1 = setTimeout(function () {
                                            that.crash.css('display', 'none');
                                        }, 800);
                                        break;
                                    case 'lz':
                                        that.lbNum--;
                                        that.lb.html(that.lbNum);
                                        if (that.lbNum < 0) {
                                            that.life = false;
                                        }
                                        that.crash.html('-1').css('display', 'block');
                                        clearTimeout(that.timer2);
                                        that.timer2 = setTimeout(function () {
                                            that.crash.css('display', 'none');
                                        }, 800);
                                        break;
                                    case 'lei':
                                        that.life = false;
                                        that.car.hide();
                                        that.bz.show();
                                        break;
                                }
                                obj.remove();
                                that.arr.splice(i, 1);
                            }
                        }
                    }
                }
                // 元素遍历完成调用运动循环
                requestAnimationFrame(function () {
                    // 元素运动
                    that.unitsRun(that.arr);
                });
            }
        },
        // 时间控制
        timeControl: function () {
            var that = this;
            // 1:没有礼包,2:只有礼包,3:只有礼包和路障,4:会出现礼包，路障，炸弹,5:礼包出现频率减少，路障和炸弹增多,6:关闭定时器 game over
            if (that.sec <= 3) {
                // 没有礼包
            } else if (that.sec > 3 && that.sec <= 10) {
                // 只有礼包
                that.tap = 2;
                if (that.life) {
                    that.createUnit(that.tap);
                } else {
                    clearInterval(that.timer);
                }
            } else if (that.sec > 10 && that.sec <= 20) {
                // 只有礼包和路障
                that.tap = 3;
                if (that.life) {
                    that.createUnit(that.tap);
                } else {
                    clearInterval(that.timer);
                }
            } else if (that.sec > 20 && that.sec <= 30) {
                // 会出现礼包，路障，炸弹
                that.tap = 4;
                if (that.life) {
                    that.createUnit(that.tap);
                } else {
                    clearInterval(that.timer);
                }
            } else if (that.sec > 30 && that.sec <= 60) {
                // 礼包出现频率减少，路障和炸弹增多
                that.tap = 5;
                if (that.life) {
                    that.createUnit(that.tap);
                } else {
                    clearInterval(that.timer);
                }
            } else {
                // 关闭定时器
                clearInterval(that.timer);
            }
        },
        // 创建礼包
        createUnit: function (num) {
            var that = this;
            // 1:没有礼包,2:只有礼包,3:只有礼包和路障,4:会出现礼包，路障，炸弹,5:礼包出现频率减少，路障和炸弹增多,6:关闭定时器 game over
            var len = that.arr.length;
            var sdNum = that.randomSD();
            // 概率控制
            var probability;
            // 排除两个连续在一个赛道的情况
            if (len > 0 && that.arr[len - 1].sd === sdNum) {
                return;
            }
            switch (num) {
                case 2:
                    that.createFd(sdNum);
                    break;
                case 3:
                    probability = Math.random() - 0.5;
                    if (probability > 0) {
                        that.createFd(sdNum);
                    } else {
                        that.createLz(sdNum);
                    }
                    break;
                case 4:
                    probability = Math.random() * 100;
                    if (probability > 66) {
                        that.createFd(sdNum);
                    } else if (probability > 33) {
                        that.createLz(sdNum);
                    } else {
                        that.createLei(sdNum);
                    }
                    break;
                case 5:
                    probability = Math.random() * 100;
                    if (probability > 90) {
                        that.createFd(sdNum);
                    } else if (probability > 45) {
                        that.createLz(sdNum);
                    } else {
                        that.createLei(sdNum);
                    }
                    break;
            }
        },
        // 创建福袋
        createFd: function (sdNum) {
            var that = this;
            var fd = $('<div class="fd unit" data-type="fd" data-sd="' + sdNum + '"><i class="donghua">+1</i></div>');
            fd.addClass('sd' + sdNum);
            that.doc.append(fd);
            that.pushArr(fd);
        },
        // 创建路障
        createLz: function (sdNum) {
            var that = this;
            var lz = $('<div class="lz unit" data-type="lz" data-sd="' + sdNum + '"></div>');
            lz.addClass('sd' + sdNum);
            that.doc.append(lz);
            that.pushArr(lz);
        },
        // 创建雷
        createLei: function (sdNum) {
            var that = this;
            var lei = $('<div class="lei unit" data-type="lei" data-sd="' + sdNum + '"></div>');
            lei.addClass('sd' + sdNum);
            that.doc.append(lei);
            that.pushArr(lei);
        },
        // 向数组里面扔数据
        pushArr: function (obj) {
            var json = {};
            json.ele = obj;
            json.type = obj.attr('data-type');
            json.sd = obj.attr('data-sd');
            json.y = 0;
            this.arr.push(json);
        },
        // 选择随机赛道
        randomSD: function () {
            return this.randomNum(1, 4);
        },
        // 生成随机数
        randomNum: function (n, m) {
            return parseInt(n + Math.random() * (m - n));
        }
    };
    return new Crazy();
});