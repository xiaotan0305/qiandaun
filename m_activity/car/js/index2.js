/**
 * @Author: 坤鹏
 * @Date: 2015/11/27 9:52
 * @description: **index
 * @Last Modified by:   **
 * @Last Modified time:
 */
window.onload = function () {
    'use strict';
    function Crazy() {
        /*        this.bggif = document.querySelector('.bggif');
         this.height = this.bggif.offsetHeight / 2;
         // 背景高度
         this.y = -50;
         // 背景运动速度
         this.speed = 0.5;*/
        // 屏幕高度
        this.winH = document.body.clientHeight;
        // 汽车盒子
        this.carBox = document.getElementById('carBox');
        // 汽车赛道
        this.sd = parseInt(this.carBox.getAttribute('data-sd'));
        // 汽车
        this.car = document.getElementById('car');
        // 屏元素
        this.ping = document.getElementById('ping');
        this.ping.h = this.ping.offsetHeight;
        this.ping.y = 0;
        this.ping.s = 0.25;
        // 计时器初始值
        this.sec = 0;
        // 数组用于存创建元素的各个属性
        this.arr = [];
        // 判断碰撞死亡
        this.life = true;
        // 礼包数
        this.lb = document.getElementById('lbNum').children[0];
        this.lbNum = 0;
        // 里程数
        this.len = document.getElementById('lenNum').children[0];
        this.lenNum = 0;
        // 汽车碰撞+1
        this.crash = this.car.children[0];
        // 爆炸效果
        this.bz = document.getElementById('bz');

        // 左按钮
        this.leftBtn = document.getElementById('leftBtn');
        this.leftTimer = null;
        // 右按钮
        this.rightBtn = document.getElementById('rightBtn');
        this.rightTimer = null;
        // 登录信息
        this.userId = 0;
        this.init();
    }

    Crazy.prototype = {
        constructor: Crazy,
        init: function () {
            var that = this;


            // 预加载
            that.preloading();
            // 开始按钮 倒计时
            var countDown = document.getElementById('countDown'),
                playBtn = document.getElementById('playBtn'),
                beginPlay = document.getElementById('beginPlay'),
                centTimer = null,
                cent = document.getElementById('cent'),
                centNum = 3;
            $(playBtn).on('click', function () {
                beginPlay.style.display = 'none';
                countDown.style.display = 'block';
                clearInterval(centTimer);
                centTimer = setInterval(function () {
                    centNum--;
                    cent.innerHTML = centNum;
                    if (centNum === 0) {
                        clearInterval(centTimer);
                        countDown.style.display = 'none';
                        // 元素开始运动
                        requestAnimationFrame(function () {
                            // 背景运动
                            //that.bgRunYS();
                            // 元素屏运动
                            that.pingRun(that.ping, that.arr);
                        });
                        // 开启计时器
                        clearInterval(that.timer);
                        that.timer = setInterval(function () {
                            that.sec++;
                            // 设置速度(暂时为空)
                        }, 1000);
                    }
                }, 1000);
            });
            // gameover 再来一次
            var playAgain = document.getElementById('playAgain');
            $(playAgain).on('click',function () {
                location.reload();
            });
            // 领取成功
            var getSuccess = document.getElementById('getSuccess'),
                gameResult = document.getElementById('gameResult'),
                playEnd = document.getElementById('playEnd');
            // 登录
            var signOn = document.getElementById('signOn'),
                getCode = document.getElementById('getCode'),
                submit = document.getElementById('submit');

            $(playEnd).on('click',function () {
                if (that.userId) {
                    gameResult.style.display = 'none';
                    getSuccess.style.display = 'block';
                }else {
                    gameResult.style.display = 'none';
                    signOn.style.display = 'block';
                }
            });

            // 打乱位置并记录
            that.getInitArr(function () {
                that.setElePos(function () {
                    that.saveElePos();
                });
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
            // 汽车变道控制
            that.leftBtn.addEventListener('touchend', function () {
                if (that.life) {
                    that.sd--;
                    if (that.sd <= 1) {
                        that.sd = 1;
                    }
                    var classList = that.carBox.classList,
                        len = classList.length;
                    for (var i = len; i > -1; i--) {
                        classList.remove(classList[i]);
                    }
                    classList.add('carBox');
                    classList.add('sd' + that.sd);
                    this.classList.add('lActive');
                    clearTimeout(that.leftTimer);
                    that.leftTimer = setTimeout(function () {
                        that.leftBtn.classList.remove('lActive');
                    }, 300);
                }
            }, false);
            // 向右
            that.rightBtn.addEventListener('touchend', function () {
                if (that.life) {
                    that.sd++;
                    if (that.sd >= 3) {
                        that.sd = 3;
                    }
                    var classList = that.carBox.classList,
                        len = classList.length;
                    for (var i = len; i > -1; i--) {
                        classList.remove(classList[i]);
                    }
                    classList.add('carBox');
                    classList.add('sd' + that.sd);
                    this.classList.add('rActive');
                    clearTimeout(that.rightTimer);
                    that.rightTimer = setTimeout(function () {
                        that.rightBtn.classList.remove('rActive');
                    }, 300);
                }
            }, false);
        },
        // 预加载
        preloading: function () {
            var aImage = document.querySelectorAll('img'),
                loadedNum = document.getElementById('loadedNum'),
                loading = document.getElementById('loading'),
                beginPlay = document.getElementById('beginPlay');
            var count = 0,
                len = aImage.length;
            for (var i = 0; i < aImage.length; i++) {
                var oImg = new Image();
                oImg.src = aImage[i].src;
                oImg.onload = function () {
                    count++;
                    loadedNum.innerHTML = parseInt(count / len * 100);
                    if (count === len) {
                        setTimeout(function () {
                            loading.style.display = 'none';
                            beginPlay.style.display = 'block';
                        }, 1000);
                    }
                };
            }
        },
        // 获取元素位置信息 (二维数组)
        getInitArr: function (fn) {
            var eleArr = this.ping.children,
                len = eleArr.length;
            this.initArr = [];
            for (var i = 0; i < len; i++) {
                var tmpArr = [];
                for (var j = 0; j < len; j++) {
                    if (getComputedStyle(eleArr[j], false).bottom === getComputedStyle(eleArr[i], false).bottom) {
                        var json = {};
                        json.ele = eleArr[j];
                        json.type = eleArr[j].getAttribute('data-type');
                        json.sd = eleArr[j].getAttribute('data-sd');
                        tmpArr.push(json);
                    }
                }
                this.initArr.push(tmpArr);
                i += tmpArr.length - 1;
            }
            fn && fn();
        },
        // 设置元素位置信息(二维数组)
        setElePos: function (fn) {
            var len = this.initArr.length,
                that = this;
            for (var i = 0; i < len; i++) {
                var arr = that.initArr[i];
                if (arr.length === 1) {
                    var num = that.randomNum(1, 4);
                    arr[0].ele.setAttribute('data-sd', num);
                    var classType = arr[0].ele.getAttribute('data-type');
                    var classList = arr[0].ele.classList,
                        classLen = classList.length;
                    for (var j = classLen; j > -1; j--) {
                        classList.remove(classList[j]);
                    }
                    classList.add('unit');
                    classList.add(classType);
                    classList.add('sd' + num);
                } else {
                    var tmpClassArr = [];
                    // 存 赛道信息
                    for (var x = 0; x < arr.length; x++) {
                        var xNum = 4 - parseInt(arr[x].sd);
                        tmpClassArr.push(xNum);
                    }
                    // 打乱赛道信息
                    tmpClassArr.sort(function () {
                        return 0.5 - Math.random();
                    });
                    // 设置打乱之后赛道
                    for (var k = 0; k < arr.length; k++) {
                        arr[k].ele.setAttribute('data-sd', tmpClassArr[k]);
                        var tmpclassType = arr[k].ele.getAttribute('data-type');
                        var tmpclassList = arr[k].ele.classList,
                            tmpclassLen = tmpclassList.length;
                        for (var g = tmpclassLen; g > -1; g--) {
                            tmpclassList.remove(tmpclassList[g]);
                        }
                        tmpclassList.add('unit');
                        tmpclassList.add(tmpclassType);
                        tmpclassList.add('sd' + tmpClassArr[k]);
                    }
                }
            }
            fn && fn();
        },
        saveElePos: function () {
            var that = this;
            var eleArr = that.ping.children,
                len = eleArr.length;
            // 存元素位置信息
            for (var i = 0; i < len; i++) {
                var json = {};
                json.ele = eleArr[i];
                json.type = eleArr[i].getAttribute('data-type');
                json.sd = eleArr[i].getAttribute('data-sd');
                that.arr.push(json);
            }
        },
        bgRunYS: function () {
            var that = this;
            that.y += this.speed;
            if (that.y >= 0) {
                that.y = -50;
            }
            that.bggif.style.webkitTransform = 'translateZ(0) translateY(' + that.y + '%)';
            requestAnimationFrame(function () {
                // 背景运动
                that.bgRunYS();
            });
        },
        // 屏幕运动
        pingRun: function (ele, arr) {
            var that = this;
            ele.y += ele.s;
            ele.style.height = ele.y + '%';
            var carT = that.getTop(that.car),
                carH = parseInt(that.car.offsetHeight);

            var gameOver = document.getElementById('gameOver');
            // 结果页
            var gameResult = document.getElementById('gameResult');
            // 里程数
            var lenResult = document.getElementById('lenResult');
            // 优惠劵
            var privilege = document.getElementById('privilege');
            // 积分
            var score = document.getElementById('score');
            // 元素判断
            for (var i = arr.length - 1; i > -1; i--) {
                var obj = arr[i].ele;
                var unitT = obj.getBoundingClientRect().top,
                    unitH = parseInt(obj.offsetHeight);
                if (unitT + unitH > carT) {
                    var sign = false;
                    // 超过屏幕的元素删除
                    if (unitT > that.screenY) {
                        that.arr.splice(i, 1);
                        sign = true;
                    }
                    if (!sign) {
                        if (parseInt(arr[i].sd) === that.sd && unitT + unitH < carT + carH && that.life) {
                            // 判断碰撞类型
                            switch (arr[i].type) {
                                case 'fd':
                                    that.lbNum++;
                                    that.lb.innerHTML = that.lbNum;
                                    that.crash.innerHTML = '+1';
                                    that.crash.style.display = 'block';
                                    clearTimeout(that.timer1);
                                    that.timer1 = setTimeout(function () {
                                        that.crash.style.display = 'none';
                                    }, 800);
                                    break;
                                case 'lz':
                                    that.lbNum--;
                                    that.lb.innerHTML = that.lbNum;
                                    if (that.lbNum < 0) {
                                        that.life = false;
                                    }
                                    that.crash.innerHTML = '-1';
                                    that.crash.style.display = 'block';
                                    clearTimeout(that.timer2);
                                    that.timer2 = setTimeout(function () {
                                        that.crash.style.display = 'none';
                                    }, 800);
                                    break;
                                case 'lei':
                                    that.life = false;
                                    that.car.style.display = 'none';
                                    that.bz.style.display = 'block';
                                    break;
                            }
                            that.ping.removeChild(obj);
                            that.arr.splice(i, 1);
                        }
                    }
                }
            }
            // 里程数
            that.lenRun();
            // 元素遍历完成调用运动循环
            if (ele.y < 1000 && that.life) {
                requestAnimationFrame(function () {
                    // 元素运动
                    that.pingRun(ele, arr);
                });
            }else {
                if (that.life) {
                    lenResult.innerHTML = that.lenNum;
                    privilege.innerHTML = parseInt(that.lbNum * 0.5);
                    score.innerHTML = that.lbNum - parseInt(that.lbNum * 0.5);
                    gameResult.style.display = 'block';
                }else {
                    gameOver.style.display = 'block';
                }
            }
        },
        // 运行里程数
        lenRun: function () {
            if (this.life) {
                this.lenNum = this.lenNum + 1;
                this.len.innerHTML = this.lenNum + 'm';
            }
        },
        // 获取绝对纵坐标
        getTop: function (obj) {
            var offset = obj.offsetTop;
            if (obj.offsetParent !== null) {
                offset += this.getTop(obj.offsetParent);
            }
            return parseInt(offset);
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
};