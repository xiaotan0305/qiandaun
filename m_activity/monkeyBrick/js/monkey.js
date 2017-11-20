/**
 * @Author: 坤鹏
 * @Date: 2016/01/18 9:00
 * @description: **index
 * @Last Modified by:   **
 * @Last Modified time:
 */
$(function () {
    'use strict';

    /* 页面数据初始化 */

    // 元素运动速度
    var eleSpeed = 4;
    // 元素创建时间间隔
    var eleTimeOut = eleSpeed * 200;
    // 生命值
    var life = true;
    // 控制元素开始时间基数，默认先给0，点击开始游戏后赋值为当时ms数
    var baseTime = 0;
    // 游戏时间即时时间差(游戏时间ms)
    var now = 0;
    // 开始游戏开关
    var playStart = false;
    // 对象池
    var arr = [];
    // 缓冲对象池
    var tmpArr = [];
    // 左右按钮点击
    var nowSd = 2,
        nextSd = 2;
    // 左右按钮点击效果控制
    var showchangge = false;

    // 控制元素碰撞效果
    var beginTime = 0;
    var beginShow = false;
    var isAddOne = true;
    // 检测开关
    var openCheck = true;
    // 记录开始跳跃x轴距离
    var beginX = 0;
    var beginY = 0;
    // 设置半径
    var r = 0;
    // 求x到圆心的距离
    var d = 0;
    // 接收类
    var DisplayObject = window.DisplayObject;
    var TextRect = window.TextRect;
    var Pic = window.Pic;
    var Ele = window.Ele;
    // 控制游戏结束音乐
    var gameoverMic = false;
    var gameover = false;
    // 域名获取
    var mainSite = $('#mainSite').val();
    var imgSite = $('#imgSite').val();
    // 资源列表
    var sourceJson = {
        img: [
            // 提示图
            'tishi.png',
            // 猴子
            'monkey.png',
            // 左边石墩子
            'moundLeft.png',
            // 中间石墩子
            'moundMiddle.png',
            // 右边石墩子
            'moundRight.png',
            // 背景图
            'peagTwo.jpg',
            // 金砖
            'yel.png',
            // 黑砖
            'black.png',
            // 发光金砖
            'yelLight.png'
        ],
        music: [
            // 黑砖
            // 'blackmic.mp3',
            // 金砖
            // 'goldmic.mp3',
            // 背景音乐
            // 'bgmic.mp3',
            // 游戏结束
            // 'overmic.wav'
        ]
    };
    // 音乐(背景音乐)
    var bgmic = document.getElementById('bgmic');
    bgmic.loop = true;

    /* // 音乐(金砖音乐)
    var goldmic = document.getElementById('goldmic');
    // 音乐(黑砖音乐)
    var blackmic = document.getElementById('blackmic');*/
    // 音乐(结束音乐)
    var overmic = document.getElementById('overmic');

    // 解决部分微信音频不能自动播放问题
    $(document).one('touchstart',function () {
        if (bgmic.paused) {
            bgmic.pause();
            bgmic.play();
        }
    });
    var baseUrl = imgSite + 'monkeyBrick/';
    // 图片信息
    var JSON = {};

    var oC = document.getElementById('myCanvas');
    oC.width = $(window).width();
    oC.height = $(window).height();
    var cWidth = oC.width;
    var cHeight = oC.height;
    var gd = oC.getContext('2d');
    $(window).on('resize',function () {
        oC.width = $(window).width();
        oC.height = $(window).height();
        cWidth = oC.width;
        cHeight = oC.height;
        initEleMsg();
        initELe();
    });

    /**
     * 设置相关物体信息
     */
    var sd,monkeyMess,goldBrickMess,gameTimeMess,eleMess,leftBtnMsg,middleBtnMsg,rightBtnMsg;
    function initEleMsg() {
        // 金砖跑道信息
        sd = {
            s1: 55 / 540 * cWidth | 0,
            s2: 210 / 540 * cWidth | 0,
            s3: 365 / 540 * cWidth | 0,
            width: 145 / 540 * cWidth | 0
        };
        // 猴子信息
        monkeyMess = {
            x: sd.s2,
            y: cHeight - 220 / 850 * cHeight | 0,
            w: 120 / 540 * cWidth | 0,
            h: 136 / 850 * cHeight | 0
        };
        // 金砖数文字
        goldBrickMess = {
            x: 20 / 540 * cWidth | 0,
            y: 250 / 850 * cHeight | 0,
            fontSize: 18 / 850 * cHeight | 0,
            color: '#fff600'
        };
        // 游戏时间文字
        gameTimeMess = {
            x: 492 / 540 * cWidth | 0,
            y: 250 / 850 * cHeight | 0,
            fontSize: 18 / 850 * cHeight | 0,
            color: '#fff600'
        };
        // 元素信息
        eleMess = {
            w: 30 / 540 * cWidth | 0,
            h: 58 / 850 * cHeight | 0,
            x: sd.s2,
            y: -58 / 850 * cHeight | 0
        };
        // 左站台信息
        leftBtnMsg = {
            x: 55 / 540 * cWidth | 0,
            y: 750 / 850 * cHeight | 0,
            w: 120 / 540 * cWidth | 0,
            h: 74 / 850 * cHeight | 0
        };
        // 中间站台信息
        middleBtnMsg = {
            x: 210 / 540 * cWidth | 0,
            y: 750 / 850 * cHeight | 0,
            w: 120 / 540 * cWidth | 0,
            h: 74 / 850 * cHeight | 0
        };
        // 右站台信息
        rightBtnMsg = {
            x: 365 / 540 * cWidth | 0,
            y: 750 / 850 * cHeight | 0,
            w: 120 / 540 * cWidth | 0,
            h: 74 / 850 * cHeight | 0
        };
    }
    initEleMsg();

    /**
     * 设置相关物体对象
     */

    var stage,bgCon,moundLeft,moundMiddle,moundRight,monkey,goldBrickText,gameTimeText,goldBrickLight;
    function initELe() {
        // 对象管理器
        stage = new DisplayObject();
        // 背景图片
        stage.removeChild(bgCon);
        bgCon = new Pic(JSON.peagTwo, 0, 0, cWidth, cHeight);
        stage.addChild(bgCon);
        // 左边石墩子
        stage.removeChild(moundLeft);
        moundLeft = new Pic(JSON.moundLeft, leftBtnMsg.x, leftBtnMsg.y, leftBtnMsg.w, leftBtnMsg.h);
        stage.addChild(moundLeft);
        // 中间石墩子
        stage.removeChild(moundMiddle);
        moundMiddle = new Pic(JSON.moundMiddle, middleBtnMsg.x, middleBtnMsg.y, middleBtnMsg.w, middleBtnMsg.h);
        stage.addChild(moundMiddle);
        // 右边石墩子
        stage.removeChild(moundRight);
        moundRight = new Pic(JSON.moundRight, rightBtnMsg.x, rightBtnMsg.y, rightBtnMsg.w, rightBtnMsg.h);
        stage.addChild(moundRight);
        // 猴子
        stage.removeChild(monkey);
        monkey = new Pic(JSON.monkey, monkeyMess.x, monkeyMess.y, monkeyMess.w, monkeyMess.h, true,cWidth,cHeight);
        stage.addChild(monkey);
        // 金砖数文字
        stage.removeChild(goldBrickText);
        goldBrickText = new TextRect('000', goldBrickMess.x, goldBrickMess.y, goldBrickMess.fontSize, goldBrickMess.color);
        stage.addChild(goldBrickText);
        // 游戏时间文字
        stage.removeChild(gameTimeText);
        gameTimeText = new TextRect('000', gameTimeMess.x, gameTimeMess.y, gameTimeMess.fontSize, gameTimeMess.color);
        stage.addChild(gameTimeText);
        // 发光金砖
        goldBrickLight = new Pic(JSON.yelLight, monkeyMess.x, monkeyMess.y - 50, eleMess.w * 3, eleMess.h * 2);
    }

    /**
     * 加载图片函数
     * @param json  图片资源对象
     * @param count  加载数
     * @param fnSucc
     * @param fnLoading
     */
    function loadImage(json, count, fnSucc, fnLoading) {
        var imgLen = json.img.length,
            musicLen = json.music.length,
            len = imgLen + musicLen;
        count = count || 0;
        if (len > 0) {
            if (count < imgLen) {
                // 加载图片
                var oImg = new Image();
                oImg.src = baseUrl + 'images/' + json.img[count];
                oImg.onload = function () {
                    var name = json.img[count].split('.')[0];
                    JSON[name] = this;
                    count++;
                    if (count === len) {
                        fnSucc && fnSucc();
                    } else {
                        loadImage(json, count, fnSucc, fnLoading);
                    }
                };
            } else {
                // 加载音频
                var oAudio = new Audio();
                oAudio.src = baseUrl + 'music/' + json.music[count - imgLen] + '?_' + Math.random();
                oAudio.addEventListener('loadedmetadata', function () {
                    var name = json.music[count - imgLen].split('.')[0];
                    JSON[name] = this;
                    count++;
                    if (count === len) {
                        fnSucc && fnSucc();
                    } else {
                        loadImage(json, count, fnSucc, fnLoading);
                    }
                });
            }
        }
        fnLoading && fnLoading(count, len);
    }

    /**
     * 补全三位数
     * @param num
     * @returns {string}
     */
    function toThree(num) {
        if (num < 10 && num >= 0) {
            return '00' + num;
        } else if (num < 100) {
            return '0' + num;
        }
        return '' + num;
    }

    /**
     * 生成随机数
     * @param n 最小值
     * @param m 最大值 (不含)
     * @returns {Number}
     */
    function rnd(n, m) {
        return parseInt(Math.random() * (m - n) + n);
    }

    /**
     * 元素初始化(位置、图片)
     * @param obj 元素信息
     */
    function initPos(obj) {
        var rndSd = 's' + rnd(1, 4);
        var name = setGl(now);
        obj.type = name;
        obj.img = JSON[name];
        obj.w = eleMess.w;
        obj.h = eleMess.h;
        obj.setMsg(sd[rndSd] + (leftBtnMsg.w - eleMess.w) / 2 | 0, -eleMess.h);
    }

    /**
     * 设置元素概率 返回tmpSD为图片元素的名称即JSON[tmpSD]
     * @param now 游戏时间
     * @returns {string}
     */
    function setGl(now) {
        // 设置概率
        var probability = Math.random() * 100 || 0;
        var tmpSD = '';
        if (now < 10000) {
            tmpSD = 'yel';
        } else if (now >= 10000 && now < 20000) {
            if (probability > 50) {
                tmpSD = 'yel';
            } else {
                tmpSD = 'black';
            }
        } else if (now >= 20000 && now < 30000) {
            if (probability > 60) {
                tmpSD = 'yel';
            } else {
                tmpSD = 'black';
            }
        } else if (now >= 30000 && now <= 60000) {
            if (probability > 70) {
                tmpSD = 'yel';
            } else {
                tmpSD = 'black';
            }
        } else if (now > 60000) {
            if (probability > 80) {
                tmpSD = 'yel';
            } else {
                tmpSD = 'black';
            }
        }
        return tmpSD;
    }

    /**
     * 创建元素
     * @param arr 对象池子
     * @param now  游戏时间
     */
    function createEle(arr, now) {
        var name = setGl(now);
        var rndSd = 's' + rnd(1, 4);
        var item = new Ele(JSON[name], sd[rndSd] + (leftBtnMsg.w - eleMess.w) / 2 | 0, eleMess.y, eleMess.w, eleMess.h, name);
        arr.push(item);
    }

    /**
     * 赛道切换
     * @param obj 切换赛道的元素
     */
    function changeSD(obj) {
        if (nowSd !== nextSd) {
            var nextSdName = 's' + nextSd;
            if (nextSd < nowSd) {
                if (obj.x > sd[nextSdName]) {
                    if (beginX - sd[nextSdName] > sd.width * 2) {
                        obj.x -= 30;
                    } else {
                        obj.x -= 20;
                    }
                    // 设置半径
                    r = (beginX - sd[nextSdName]) / 2;
                    // 求x到圆心的距离
                    d = r - (beginX - obj.x);
                    obj.y = beginY - Math.sqrt(r * r - d * d);
                } else {
                    if (obj.x > sd.s2 + sd.width / 2) {
                        obj.x = sd.s3;
                    } else if (obj.x > sd.s1 + sd.width / 2) {
                        obj.x = sd.s2;
                    } else {
                        obj.x = sd.s1;
                    }
                    obj.y = monkeyMess.y;
                    nowSd = nextSd;
                    showchangge = false;
                    openCheck = true;
                }
            } else if (nextSd > nowSd) {
                if (obj.x < sd[nextSdName]) {
                    if (sd[nextSdName] - beginX > sd.width * 2) {
                        obj.x += 30;
                    } else {
                        obj.x += 20;
                    }
                    // 设置半径
                    r = (sd[nextSdName] - beginX) / 2;
                    // 求x到圆心的距离
                    d = r - (obj.x - beginX);
                    obj.y = beginY - Math.sqrt(r * r - d * d);
                } else {
                    if (obj.x > sd.s2 + sd.width / 2) {
                        obj.x = sd.s3;
                    } else if (obj.x > sd.s1 + sd.width / 2) {
                        obj.x = sd.s2;
                    } else {
                        obj.x = sd.s1;
                    }
                    obj.y = monkeyMess.y;
                    nowSd = nextSd;
                    showchangge = false;
                    openCheck = true;
                }
            }
        }else {
            nowSd = nextSd;
            showchangge = false;
            openCheck = true;
        }
    }

    /**
     * 时间轴控制
     */
    function judgeTime() {
        if (tmpArr.length > 0) {
            // 对象池处理
            var item = tmpArr.pop();
            initPos(item);
            arr.push(item);
        } else {
            createEle(arr, now);
        }
    }


    // 缓动公式
    // t:timestamp，指缓动效果开始执行到当前帧开始执行时经过的时间段，单位ms
    // b:beginning position，起始位置
    // c:change，要移动的距离，就是终点位置减去起始位置。
    // d: duration ，缓和效果持续的时间。
    var linear = function (t, b, c, d) {
        return c * t / d + b;
    };

    /**
     * 元素碰撞效果
     * @param obj1 动画效果元素
     * @param obj2 猴子元素
     */
    function showEffect(obj1, obj2) {
        if (!beginTime) {
            beginTime = new Date().getTime();
        }
        var t = new Date().getTime() - beginTime;
        var b = obj1.y;
        var c = -10;
        var d = 200;
        if (linear(t, b, c, d) > b + c) {
            obj1.y -= 1;
        } else {
            beginTime = 0;
            beginShow = false;
            obj2.nowFrame = 0;
        }
    }

    // requestAnimationFrame做兼容
    (function (window) {
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
    })(window);

    // 屏蔽滑屏事件
    $(document).on('touchmove', function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
    });


    // 控制元素产生时间间隔
    var iNow = new Date().getTime(),
        cNow = 0;

    // 游戏开始
    $('#yindao').on('click', function () {
        $(this).hide();
        // 游戏开关
        playStart = true;
        // 设置基础时间初始化
        baseTime = new Date().getTime();
    });
    // 导入素材
    loadImage(
        sourceJson,
        0,
        function () {
            initELe();
            // 切换赛道事件
            $(oC).on('touchstart', function (ev) {
                ev.preventDefault();
                ev.stopPropagation();
                ev = ev.originalEvent.targetTouches[0];
                // 左边台子
                if (ev.pageX > leftBtnMsg.x
                    && ev.pageX < leftBtnMsg.x + leftBtnMsg.w
                    && ev.pageY > leftBtnMsg.y - ~~monkeyMess.h / 2
                    && ev.pageY < leftBtnMsg.y + leftBtnMsg.h) {
                    if (monkey.x === sd.s3) {
                        nowSd = 3;
                    } else if (monkey.x === sd.s2) {
                        nowSd = 2;
                    }else {
                        nowSd = 1;
                    }
                    nextSd = 1;
                    showchangge = true;
                    openCheck = false;
                    beginX = monkey.x;
                    beginY = monkey.y;
                    // 中间台子
                } else if (ev.pageX > middleBtnMsg.x
                    && ev.pageX < middleBtnMsg.x + middleBtnMsg.w
                    && ev.pageY > middleBtnMsg.y - ~~monkeyMess.h / 2
                    && ev.pageY < middleBtnMsg.y + middleBtnMsg.h) {
                    if (monkey.x === sd.s1) {
                        nowSd = 1;
                    } else if (monkey.x === sd.s3) {
                        nowSd = 3;
                    }else {
                        nowSd = 2;
                    }
                    nextSd = 2;
                    showchangge = true;
                    openCheck = false;
                    beginX = monkey.x;
                    beginY = monkey.y;
                    // 右边台子
                } else if (ev.pageX > rightBtnMsg.x
                    && ev.pageX < rightBtnMsg.x + rightBtnMsg.w
                    && ev.pageY > rightBtnMsg.y - ~~monkeyMess.h / 2
                    && ev.pageY < rightBtnMsg.y + rightBtnMsg.h) {
                    if (monkey.x === sd.s1) {
                        nowSd = 1;
                    } else if (monkey.x === sd.s2) {
                        nowSd = 2;
                    }else {
                        nowSd = 3;
                    }
                    nextSd = 3;
                    showchangge = true;
                    openCheck = false;
                    beginX = monkey.x;
                    beginY = monkey.y;
                }
            });
            // 开始运动---核心函数
            function openMove() {
                // 清空画布
                gd.clearRect(0, 0, cWidth, cHeight);

                // 渲染各个元素
                stage.draw(gd);
                if (playStart) {
                    // 控制元素速度
                    now = new Date().getTime() - baseTime;
                    if (now < 4000) {
                        eleSpeed = 6;
                        eleTimeOut = 5000 / eleSpeed | 0;
                    } else if (now >= 4000 && now < 20000) {
                        eleSpeed = 7;
                        eleTimeOut = 4800 / eleSpeed | 0;
                    } else if (now >= 20000 && now < 30000) {
                        eleSpeed = 8;
                        eleTimeOut = 4600 / eleSpeed | 0;
                    } else if (now >= 30000 && now <= 60000) {
                        eleSpeed = 9;
                        eleTimeOut = 4400 / eleSpeed | 0;
                    } else {
                        eleSpeed = 9;
                        eleTimeOut = 4200 / eleSpeed | 0;
                    }
                    // 调整创建元素间隔
                    cNow = new Date().getTime();
                    if (cNow - iNow > eleTimeOut && life) {
                        judgeTime();
                        iNow = cNow;
                    }
                    // 时间增加
                    if (arr.length && life) {
                        gameTimeText.text = toThree(now / 1000 | 0);
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
                        if (len > 0 && openCheck && life) {
                            // 碰撞检测
                            var l1 = monkey.x;
                            var t1 = monkey.y;
                            var r1 = l1 + monkey.w;
                            var b1 = t1 + monkey.h / 4;
                            var l2 = arr[i].x;
                            var t2 = arr[i].y;
                            var r2 = l2 + arr[i].w;
                            var b2 = t2 + arr[i].h;
                            if (r1 < l2 || b1 < t2 || l1 > r2 || t1 > b2) {
                                // 猴子区域以外不做处理
                            } else {
                                var arr3 = arr.splice(i, 1);
                                switch (arr3[0].type) {
                                    case 'yel':
                                        // 碰到金砖 增加效果 金砖数+1
                                        goldBrickText.text = toThree((goldBrickText.text | 0) + 1);
                                        var addoneX = monkey.x + 20 / 540 * cWidth | 0,
                                            addoneY = arr3[0].y | 0;
                                        // 效果
                                        goldBrickLight.setPOS(addoneX, addoneY);
                                        beginShow = true;
                                        isAddOne = true;

                                        // goldmic.currentTime = 0;
                                        // goldmic.play();
                                        break;
                                    case 'black':
                                        // 碰到黑砖 生命结束
                                        life = false;
                                        // blackmic.currentTime = 0;
                                        // blackmic.play();
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
                        changeSD(monkey);
                    }
                } else {
                    // 游戏结束
                    monkey.nowFrame = 2;
                    if (!gameoverMic) {
                        overmic.play();
                        gameoverMic = true;
                    }
                    $('#gameover').fadeIn(500);
                    // 跳转页面
                    if (!arr.length && !gameover) {
                        gameover = true;
                        window.location.href = mainSite + '/huodongAC.d?m=gameRes&class=MonkeyBrickHc&num=' + goldBrickText.text;
                    }
                }
                // beginShow 为true时显示碰撞效果
                if (beginShow) {
                    if (isAddOne) {
                        goldBrickLight.draw(gd);
                        monkey.nowFrame = 1;
                        showEffect(goldBrickLight, monkey);
                    }
                }
                requestAnimationFrame(function () {
                    openMove();
                });
            }

            openMove();
            // 去除loading动画
            setTimeout(function () {
                $('#loading').hide();
                //$('#tan').hide();
            }, 1000);
        }
    );
});