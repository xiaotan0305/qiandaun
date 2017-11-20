/**
 * @Author: 坤鹏
 * @Date: 2015/11/27 9:52
 * @description: **index
 * @Last Modified by:   **
 * @Last Modified time:
 */
$(function () {
    'use strict';
    var oC = document.getElementById('myCanvas');
    oC.width = document.body.clientWidth;
    oC.height = document.body.clientHeight;
    var cWidth = oC.width;
    var cHeight = oC.height;
    var gd = oC.getContext('2d');
    // 赛道信息
    var sd = {
        s1: parseInt(120 / 500 * cWidth),
        s2: parseInt(220 / 500 * cWidth),
        s3: parseInt(320 / 500 * cWidth),
        width: parseInt(100 / 500 * cWidth)
    };
    // 小汽车信息
    var carMess = {
        x: sd.s2,
        y: parseInt(cHeight - 180 / 900 * cHeight),
        w: parseInt(60 / 500 * cWidth),
        h: parseInt(110 / 900 * cHeight)
    };
    // 元素信息
    var eleMess = {
        // 福袋
        fdpic: {
            w: parseInt(45 / 500 * cWidth),
            h: parseInt(45 / 900 * cHeight),
            x: parseInt((cWidth - 45 / 500 * cWidth) / 2),
            y: -parseInt(carMess.h)
        },
        // 路障
        lzpic: {
            w: parseInt(60 / 500 * cWidth),
            h: parseInt(30 / 900 * cHeight),
            x: parseInt((cWidth - 60 / 500 * cWidth) / 2),
            y: -parseInt(carMess.h)
        },
        // 炸弹
        dlpic: {
            w: parseInt(50 / 500 * cWidth),
            h: parseInt(65 / 900 * cHeight),
            x: parseInt((cWidth - 50 / 500 * cWidth) / 2),
            y: -parseInt(carMess.h)
        },
        // 爆炸
        bzpic: {
            w: parseInt(90 / 500 * cWidth),
            h: parseInt(80 / 900 * cHeight),
            x: parseInt((cWidth - 90 / 500 * cWidth) / 2),
            y: -parseInt(carMess.h)
        }
    };
    // 左按钮信息
    var leftBtnMsg = {
        x: 0,
        y: parseInt(740 / 900 * cHeight),
        w: parseInt(130 / 500 * cWidth),
        h: parseInt(120 / 900 * cHeight)
    };
    // 右按钮信息
    var rightBtnMsg = {
        x: parseInt(370 / 500 * cWidth),
        y: parseInt(740 / 900 * cHeight),
        w: parseInt(130 / 500 * cWidth),
        h: parseInt(120 / 900 * cHeight)
    };
    // 礼包+1 -1 效果
    var addMinusMsg = {
        x: parseInt(carMess.x + (carMess.w - 20 / 500 * cWidth) / 2),
        y: parseInt(carMess.y - 10 / 500 * cWidth),
        w: parseInt(20 / 500 * clientWidthth),
        h: parseInt(20 / 500 * cWidth)
    };
    // 元素运动速度
    var eleSpeed = 4;
    // 元素创建时间间隔
    var eleTimeOut = eleSpeed * 200;
    // 生命值
    var life = true;
    // 元素(礼包、路障、炸弹) 控制元素开始创建时间，默认先给0，点击开始游戏后赋值
    var baseTime = 0;
    // 游戏时间即时时间差(游戏时间ms)
    var now = 0;
    // 开始游戏开关
    var playStart = false;
    // 音效
    var bgm = new Audio();
    // 路径
    var imgSite = $('#imgSite').val();
    bgm.src = imgSite + 'car/music/bg.mp3';
    if (typeof bgm.canPlayType !== 'function') {
        alert('您的浏览器不支持该游戏音频播放，请换个浏览器试试哦~');
    }
    var lbm = new Audio();
    lbm.src = imgSite + 'car/music/lb.mp3';
    var lzm = new Audio();
    lzm.src = imgSite + 'car/music/lz.mp3';
    var zdm = new Audio();
    zdm.src = imgSite + 'car/music/zd.mp3';

    /*var bgm = document.getElementById('bgMusic');
     var lbm = document.getElementById('lbMusic');
     var lzm = document.getElementById('lzMusic');
     var zdm = document.getElementById('zdMusic');*/
    /* 游戏开始前start*/
    // 预加载
    function preloading() {
        var baseUrl = imgSite + 'car/images/';
        var canvasImages = [
            baseUrl + 'bg.png',
            // 小汽车
            baseUrl + 'car.png',
            // 左按钮
            baseUrl + 'leftbtn.png',
            // 右按钮
            baseUrl + 'rightbtn.png',
            // 左按钮背景
            baseUrl + 'lbnum.png',
            // 福袋
            baseUrl + 'fdpic.png',
            // 路障
            baseUrl + 'lzpic.png',
            // 炸弹
            baseUrl + 'dlpic.png',
            // 爆炸
            baseUrl + 'bzpic.png'
        ];
        var aImage = $('img'),
            loadedNum = $('#loadedNum'),
            loading = $('#loading'),
            beginPlay = $('#beginPlay');
        var count = 0,
            len = aImage.length,
            tmpArr = [];
        for (var i = 0; i < len; i++) {
            tmpArr.push(aImage.eq(i).attr('src'));
        }
        var imgArr = tmpArr.concat(canvasImages);
        imgArr.splice(0,2);
        for (var j = 0; j < imgArr.length; j++) {
            if (!imgArr[j]) {
                count++;
            } else {
                var oImg = new Image();
                oImg.src = imgArr[j];
                oImg.onload = function () {
                    count++;
                    loadedNum.html(parseInt(count / imgArr.length * 100));
                    if (count === imgArr.length) {
                        setTimeout(function () {
                            loading.hide();
                            beginPlay.show();
                        }, 1000);
                    }
                };
            }
        }
    }

    preloading();

    // 屏蔽滑屏事件
    $(document).on('touchmove', function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
    });

    /* 游戏开始前end*/

    // 导入素材
    loadImage(
        sourceArr,
        function () {
            // 对象管理器
            var stage = new displayObject();

            // 背景图片运动
            var bgCon = new BgCon(JSON.bg, cWidth, cHeight, true);
            //stage.addCild(bgCon);

            // 礼包数矩形
            var lbNum = new roundRect(10 / 500 * cWidth, 10 / 900 * cHeight, 100 / 500 * cWidth, 50 / 900 * cHeight, 5 / 500 * cWidth, 0.8, true);
            stage.addCild(lbNum);
            // 礼包数图片
            var leftBg = new PicCon(JSON.lbnum, 15 / 500 * cWidth, 20 / 900 * cHeight, 50 / 500 * cWidth, 25 / 900 * cHeight, true);
            stage.addCild(leftBg);
            // 礼包数文字
            var lbText = new textRect('0', 70 / 500 * cWidth, 45 / 900 * cHeight, 25 / 500 * cWidth, '#fff600');
            stage.addCild(lbText);
            // 里程数矩形
            var lenNum = new roundRect(395 / 500 * cWidth, 10 / 900 * cHeight, 100 / 500 * cWidth, 50 / 900 * cHeight, 5 / 500 * cWidth, 0.8);
            stage.addCild(lenNum);
            // 里程数文字
            var lenText = new textRect('0m', 410 / 500 * cWidth, 45 / 900 * cHeight, 25 / 500 * cWidth, '#fff600');
            stage.addCild(lenText);

            // 左右按钮
            var leftBtn = new PicCon(JSON.leftbtn, leftBtnMsg.x, leftBtnMsg.y, leftBtnMsg.w, leftBtnMsg.h, true);
            stage.addCild(leftBtn);
            var rightBtn = new PicCon(JSON.rightbtn, rightBtnMsg.x, rightBtnMsg.y, rightBtnMsg.w, rightBtnMsg.h, true);
            stage.addCild(rightBtn);

            // 小汽车
            var car = new PicCon(JSON.car, carMess.x, carMess.y, carMess.w, carMess.h, true);
            //stage.addCild(car);
            // 碰撞炸弹效果
            var gameover = new PicCon(JSON.bzpic, eleMess.bzpic.x, eleMess.bzpic.y, eleMess.bzpic.w, eleMess.bzpic.h, true);
            // 碰撞礼包效果
            var addOne = new textRect('+1', addMinusMsg.x, addMinusMsg.y, 25, '#fc2e26');
            var minusOne = new textRect('-1', addMinusMsg.x, addMinusMsg.y, 25, '#fc2e26');
            // 对象池
            var arr = [];
            // 缓冲对象池
            var tmpArr = [];

            // 开始按钮 倒计时
            var countDown = document.getElementById('countDown'),
                playBtn = document.getElementById('playBtn'),
                beginPlay = document.getElementById('beginPlay'),
                centTimer = null,
                cent = document.getElementById('cent'),
                centNum = 3;
            var timerStart = null;
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
                        // 游戏开始
                        playStart = true;
                        bgm.loop = 'loop';
                        bgm.pause();
                        bgm.play();
                        // 元素(礼包、路障、炸弹) 时间初始化
                        baseTime = new Date().getTime();
                        // 开启计时器
                        now = 0;
                    }
                }, 1000);
            });
            // 游戏结束页
            var gameWin = $('#gameWin'),
                gameResult = $('#gameResult');
            $('#chaiBtn').on('click', function () {
                gameWin.hide();
                gameResult.show();
            });

            // 设置概率
            var probability = 0;
            var tmpSD = '';

            function setGl() {
                probability = Math.random() * 100;
                if (now < 10000) {
                    tmpSD = 'fdpic';
                } else if (now >= 10000 && now < 20000) {
                    if (probability > 70) {
                        tmpSD = 'fdpic';
                    } else {
                        tmpSD = 'lzpic';
                    }
                } else if (now >= 20000 && now < 30000) {
                    if (probability > 80) {
                        tmpSD = 'fdpic';
                    } else if (probability > 30) {
                        tmpSD = 'lzpic';
                    } else {
                        tmpSD = 'dlpic';
                    }
                } else if (now >= 30000 && now <= 60000) {
                    if (probability > 90) {
                        tmpSD = 'fdpic';
                    } else if (probability > 45) {
                        tmpSD = 'lzpic';
                    } else {
                        tmpSD = 'dlpic';
                    }
                } else {
                    tmpSD = 'over';
                }
                return tmpSD;
            }

            // 创建元素
            function createEle(name) {
                name = setGl();
                var rndSd = 's' + rnd(1, 4);
                if (name !== 'over') {
                    var item = new Element(JSON[name], sd[rndSd], eleMess[name].y, eleMess[name].w, eleMess[name].h, name);
                    arr.push(item);
                }
            }

            // 元素初始化(位置、图片)
            function initPos(obj) {
                var rndSd = 's' + rnd(1, 4);
                var name = setGl();
                obj.type = name;
                obj.img = JSON[name];
                obj.w = eleMess[name].w;
                obj.h = eleMess[name].h;
                obj.setMsg(sd[rndSd], -carMess.h);
            }

            //  发送游戏结果
            var lotteryId = $('#lotteryId').val();
            // 设置只能出现一次
            var isShow = false;

            function sendResult() {
                // 礼包数为0或者小于0不再弹出结果页，弹出再来一次页面
                if (lbText.text > 0) {
                    var url = '/huodongAC.d?class=CarHc&m=userGetJifenAndCoupon&count=' + lbText.text + '&wheelLotteryId=' + lotteryId;
                    $.get(url, function (data) {
                        var couponCount = data.root.couponCount;
                        var jifenCount = data.root.jifenCount;
                        $('#privilege').html(couponCount);
                        $('#score').html(jifenCount);
                        $('#lenResult').html(lenText.text);
                        if (now > 60000 && !arr.length && life) {
                            // 弹出游戏结束页
                            gameWin.show();
                        } else {
                            // 弹出结果页
                            $('#gameResult').show();
                        }
                    });
                } else {
                    // 弹出再来一次页
                    $('#gameOver').show();
                }
                isShow = true;
            }

            // 左右按钮点击
            var nowSd = 2,
                nextSd = 2;
            // 左右按钮点击效果控制
            var showchangge = false;
            // 控制赛道切换---缓动
            function changeSD() {
                if (nowSd !== nextSd) {
                    var nextSdName = 's' + nextSd;
                    if (nextSd < nowSd) {
                        if (car.x > sd[nextSdName]) {
                            car.x -= 6;
                        } else {
                            if (car.x > sd.s2 + sd.width / 2) {
                                car.x = sd.s3;
                            } else if (car.x > sd.s1 + sd.width / 2) {
                                car.x = sd.s2;
                            } else {
                                car.x = sd.s1;
                            }
                            nowSd = nextSd;
                            showchangge = false;
                        }
                    } else if (nextSd > nowSd) {
                        if (car.x < sd[nextSdName]) {
                            car.x += 6;
                        } else {
                            if (car.x > sd.s2 + sd.width / 2) {
                                car.x = sd.s3;
                            } else if (car.x > sd.s1 + sd.width / 2) {
                                car.x = sd.s2;
                            } else {
                                car.x = sd.s1;
                            }
                            nowSd = nextSd;
                            showchangge = false;
                        }
                    }
                }
            }

            // 切换赛道事件
            $(oC).on('touchstart', function (ev) {
                ev.preventDefault();
                ev.stopPropagation();
                ev = ev.originalEvent.targetTouches[0];
                if (ev.pageX > leftBtnMsg.x && ev.pageX < leftBtnMsg.x + leftBtnMsg.w && ev.pageY > leftBtnMsg.y && ev.pageY < leftBtnMsg.y + leftBtnMsg.h) {
                    if (car.x === sd.s3) {
                        showchangge = true;
                        nowSd = 3;
                        nextSd = 2;
                    } else if (car.x === sd.s2) {
                        showchangge = true;
                        nowSd = 2;
                        nextSd = 1;
                    }
                } else if (ev.pageX > rightBtnMsg.x && ev.pageX < rightBtnMsg.x + rightBtnMsg.w && ev.pageY > rightBtnMsg.y && ev.pageY < rightBtnMsg.y + rightBtnMsg.h) {
                    if (car.x === sd.s1) {
                        showchangge = true;
                        nowSd = 1;
                        nextSd = 2;
                    } else if (car.x === sd.s2) {
                        showchangge = true;
                        nowSd = 2;
                        nextSd = 3;
                    }
                }
            });

            // 时间轴控制
            function judgeTime() {
                if (tmpArr.length > 0 && now <= 60000) {
                    // 对象池处理
                    var item = tmpArr.pop();
                    initPos(item);
                    arr.push(item);
                } else {
                    createEle();
                }
            }

            // 控制元素产生时间间隔
            var iNow = new Date().getTime(),
                cNow = 0,
                n = 0;
            // 控制元素碰撞效果
            var beginTime = 0;
            var beginShow = false;
            var isAddOne = true;

            // 缓动公式
            // t:timestamp，指缓动效果开始执行到当前帧开始执行时经过的时间段，单位ms
            // b:beginning position，起始位置
            // c:change，要移动的距离，就是终点位置减去起始位置。
            // d: duration ，缓和效果持续的时间。
            var linear = function (t, b, c, d) {
                return c * t / d + b;
            };

            // 元素缓动公式
            function showEffect(obj) {
                if (!beginTime) {
                    beginTime = new Date().getTime();
                }
                var t = new Date().getTime() - beginTime;
                var b = car.y;
                var c = -10;
                var d = 200;
                if (linear(t, b, c, d) > b + c) {
                    obj.y -= 1;
                } else {
                    beginTime = 0;
                    beginShow = false;
                }
            }

            // 开始运动---核心函数
            function openMove() {
                // 清空画布
                gd.clearRect(0, 0, cWidth, cHeight);
                // 背景运动
                bgCon.y += 2;
                if (bgCon.y >= cHeight) {
                    bgCon.y = 0;
                }
                bgCon.draw(gd);

                // 渲染各个元素
                stage.draw(gd);
                if (playStart) {
                    // 控制元素速度
                    now = new Date().getTime() - baseTime;
                    if (now <= 3000) {
                        eleSpeed = 5;
                        eleTimeOut = eleSpeed * 100;
                    } else if (now >= 4000 && now < 20000) {
                        eleSpeed = 6;
                        eleTimeOut = eleSpeed * 80;
                    } else if (now >= 20000 && now < 30000) {
                        eleSpeed = 7;
                        eleTimeOut = eleSpeed * 60;
                    } else if (now >= 30000 && now <= 60000) {
                        eleSpeed = 8;
                        eleTimeOut = eleSpeed * 40;
                    } else {
                        //clearInterval(timerStart);
                        bgm.pause();
                    }

                    // 调整创建元素间隔
                    cNow = new Date().getTime();
                    if (cNow - iNow > eleTimeOut && life && now <= 60000) {
                        judgeTime();
                        iNow = cNow;
                    }
                    // 里程数增加
                    if (arr.length) {
                        if (life && now <= 60000) {
                            if (now < 30000) {
                                n++;
                            } else {
                                n += 2;
                            }
                        } else {
                            n++;
                        }
                        lenText.text = n + 'm';
                        //lenText.text = now;
                    }
                    // 所有元素运动
                    var len = arr.length;
                    for (var i = len - 1; i > -1; i--) {
                        arr[i].y += eleSpeed;
                        arr[i].draw(gd);
                        if (arr[i].y > cHeight) {
                            var arr2 = arr.splice(i, 1);
                            tmpArr.push(arr2[0]);
                        }
                        if (len > 1 && life) {
                            // 碰撞检测
                            var l1 = car.x;
                            var t1 = car.y;
                            var r1 = l1 + car.w;
                            var b1 = t1 + car.h;
                            var l2 = arr[i].x;
                            var t2 = arr[i].y;
                            var r2 = l2 + arr[i].w;
                            var b2 = t2 + arr[i].h;
                            if (r1 < l2 || b1 < t2 || l1 > r2 || t1 > b2) {
                            } else {
                                var arr3 = arr.splice(i, 1);
                                switch (arr3[0].type) {
                                    case 'fdpic':
                                        // 碰到福袋 增加效果 积分+1
                                        lbText.text = parseInt(lbText.text) + 1;
                                        lbm.pause();
                                        lbm.play();
                                        // 效果
                                        var addOneX = car.x + (car.w - 20 / 500 * cWidth) / 2,
                                            addOneY = car.y - 20;
                                        addOne.setPOS(addOneX, addOneY);
                                        beginShow = true;
                                        isAddOne = true;
                                        break;
                                    case 'lzpic':
                                        // 碰到路障 增加效果 积分+1 积分小于0 生命结束
                                        lbText.text = parseInt(lbText.text) - 1;
                                        lzm.pause();
                                        lzm.play();
                                        if (lbText.text < 0) {
                                            life = false;
                                            gameover.setMsg(car.x, car.y);
                                        }
                                        // 效果
                                        var minussX = car.x + (car.w - 20 / 500 * cWidth) / 2,
                                            minussY = car.y - 20;
                                        minusOne.setPOS(minussX, minussY);
                                        beginShow = true;
                                        isAddOne = false;
                                        break;
                                    case 'dlpic':
                                        zdm.pause();
                                        bgm.pause();
                                        zdm.play();
                                        // 碰到地雷 增加效果 积分+1 积分小于0 生命结束
                                        life = false;
                                        gameover.setMsg(car.x, car.y);
                                        break;
                                }
                                tmpArr.push(arr3[0]);
                            }
                        }
                    }
                }
                // 判断是否游戏结束
                if (life) {
                    // 赛道切换过渡动画
                    if (showchangge) {
                        changeSD();
                    }
                    car.draw(gd);
                    // 游戏通关
                    if (!arr.length && now >= 60000 && !isShow) {
                        sendResult();
                    }
                } else {
                    // 礼包数小于0
                    if (lbText.text > -1) {
                        gameover.draw(gd);
                    }
                    //now = 0;
                    // 游戏提前结束
                    if (!arr.length && !isShow) {
                        sendResult();
                    }
                }
                // beginShow 为true时显示碰撞效果
                if (beginShow) {
                    // 判断碰撞是否为礼包还是路障
                    if (isAddOne) {
                        addOne.draw(gd);
                        showEffect(addOne);
                    } else {
                        minusOne.draw(gd);
                        showEffect(minusOne);
                    }
                }
                requestAnimationFrame(function () {
                    openMove();
                });
            }

            openMove();
        }
    );
});