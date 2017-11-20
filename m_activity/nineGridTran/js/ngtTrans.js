/**
 * Created by css on 2016/2/23.
 */

$(window).load(function () {
    'use strict';
    // ------点击开始动画
    var CW = $('#canvas_js').width();
    var CH = $('#canvas_js').height();

    // 是否在计时器内
    var isCountTimeIn = true;
    // 倒计时   多出重赋值啦
    var countTimeInt = 60;
    var $countTimePanel = $('.count_time_js');
    var isCountTimeRun = true;

    var transImgUrl = $('.trans_img_js').val();
    var transImgNum = $('.trans_imgnum_js').val();

    // 换一换按钮
    var $changeButton = $('.change_img_js');
    // canvas
    var canvasObj = document.getElementById('canvas_js');
    var CGD = canvasObj.getContext('2d');
    canvasObj.width = CW;
    canvasObj.height = CH;
    // 边距值
    var canvasOffsetLeft = $('#canvas_js').offset().left;
    var canvasOffsetTop = $('#canvas_js').offset().top;

    // 离屏canvas  绘画宫格线
    var offCanvas = document.createElement('canvas');
    offCanvas.width = canvasObj.width;
    offCanvas.height = canvasObj.height;
    var offContext = offCanvas.getContext('2d');

    // 绘画宫格线 -- 离屏
    function drawOffCanvas(offcanvasW, offcanvasH) {
        var signW = offcanvasW / 3;
        var signH = offcanvasH / 3;
        offContext.strokeRect(0, 0, signW, signH);
        offContext.strokeRect(signW, 0, signW, signH);
        offContext.strokeRect(2 * signW, 0, signW, signH);

        offContext.strokeRect(0, signH, signW, signH);
        offContext.strokeRect(signW, signH, signW, signH);
        offContext.strokeRect(2 * signW, signH, signW, signH);

        offContext.strokeRect(0, 2 * signH, signW, signH);
        offContext.strokeRect(signW, 2 * signH, signW, signH);
        offContext.strokeRect(2 * signW, 2 * signH, signW, signH);
    }

    // 开始触屏的位置
    var startTouchX = 0;
    var startTouchY = 0;
    // 移动和结束位置
    var endTouchX = 0;
    var endTouchY = 0;

    // 开始触摸模块下标
    var startMoIndex = 0;


    // 结束触摸式的移动方向 上1下2左3右4   不移动表示为0
    var endMoRiretion = 0;
    // 存储模块状态   moStatuArr[0]存储空白处的序号 值为0表示空白
    // var moStatuArr = new Array(0,1,2,3,4,5,6,7,8,9);
    var moStatuArr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    // 平行左右移动 1上 2下 3左 4右
    // 开始触摸模块标
    var storeMoHXtemp = 0;
    var storeMoVYtemp = 0;

    // 移动距离保存值
    var distanceOWH = 0;
    var distanceOWHScale = 0;

    // modelMoveDraw 中记录数据
    var storeClearX = 0;
    var storeClearY = 0;
    var storeClearW = 0;
    var storeClearH = 0;

    var storeDrawX = 0;
    var storeDrawY = 0;
    var storeDrawW = 0;
    var storeDrawH = 0;
    // 下一个model中记录数据
    var nextDrawX = 0;
    var nextDrawY = 0;
    var nextDrawW = 0;
    var nextDrawH = 0;
    var absAlpha = 0;

    var BI = null;
    // --------------------------
    // 遮蔽层
    var $shadePanel = $('.shade');

    // 小模块移动
    function modelMoveDraw() {
        BI.clearDraw(CGD, storeClearX, storeClearY, storeClearW, storeClearH);
        absAlpha = Math.abs(1 - 2 * distanceOWH / distanceOWHScale);
        if (endMoRiretion === 1) {
            BI.nudgeDraw(CGD, nextDrawX, nextDrawY + distanceOWH, nextDrawW, nextDrawH, absAlpha);
            BI.nudgeDraw(CGD, storeDrawX, storeDrawY - distanceOWH, storeDrawW, storeDrawH, absAlpha);
        } else if (endMoRiretion === 2) {
            BI.nudgeDraw(CGD, nextDrawX, nextDrawY - distanceOWH, nextDrawW, nextDrawH, absAlpha);
            BI.nudgeDraw(CGD, storeDrawX, storeDrawY + distanceOWH, storeDrawW, storeDrawH, absAlpha);
        } else if (endMoRiretion === 3) {
            BI.nudgeDraw(CGD, nextDrawX + distanceOWH, nextDrawY, nextDrawW, nextDrawH, absAlpha);
            BI.nudgeDraw(CGD, storeDrawX - distanceOWH, storeDrawY, storeDrawW, storeDrawH, absAlpha);
        } else if (endMoRiretion === 4) {
            BI.nudgeDraw(CGD, nextDrawX - distanceOWH, nextDrawY, nextDrawW, nextDrawH, absAlpha);
            BI.nudgeDraw(CGD, storeDrawX + distanceOWH, storeDrawY, storeDrawW, storeDrawH, absAlpha);
        }

        if (distanceOWH === distanceOWHScale) {
            distanceOWH = 0;
            CGD.drawImage(offCanvas,0,0);
            if (moStatuArr[0] === 0 && isCountTimeIn) {
                isCountTimeIn = false;
                setTimeout(function () {
                    $shadePanel.show();
                    $('.snow_panel_js').show();
                }, 1000);
            } else {
                addEventListererFun();
            }
        } else {
            if (distanceOWH < distanceOWHScale) {
                // 控制模块移动速度
                distanceOWH += 8;
            } else if (distanceOWH > distanceOWHScale) {
                distanceOWH = distanceOWHScale;
                CGD.drawImage(offCanvas,0,0);
            }
            requestAnimationFrame(function () {
                modelMoveDraw();
            });
        }
    }

    // 根据模块下标 确定模块offset  storeMoHXtemp  storeMoVYtemp
    function sureMoWHbyIndex(moindex) {
        if (moindex === 1) {
            storeMoHXtemp = 0;
            storeMoVYtemp = 0;
        } else if (moindex === 2) {
            storeMoHXtemp = 1;
            storeMoVYtemp = 0;
        } else if (moindex === 3) {
            storeMoHXtemp = 2;
            storeMoVYtemp = 0;
        } else if (moindex === 4) {
            storeMoHXtemp = 0;
            storeMoVYtemp = 1;
        } else if (moindex === 5) {
            storeMoHXtemp = 1;
            storeMoVYtemp = 1;
        } else if (moindex === 6) {
            storeMoHXtemp = 2;
            storeMoVYtemp = 1;
        } else if (moindex === 7) {
            storeMoHXtemp = 0;
            storeMoVYtemp = 2;
        } else if (moindex === 8) {
            storeMoHXtemp = 1;
            storeMoVYtemp = 2;
        } else if (moindex === 9) {
            storeMoHXtemp = 2;
            storeMoVYtemp = 2;
        }
    }
    // 触摸结束确定模块移动方向  endMoRiretion
    function calcModelDirection() {
        var hx = 1;
        var vy = 1;

        if (endTouchX !== startTouchX) {
            hx = (endTouchX - startTouchX) / CW;
        }
        if (endTouchY !== startTouchY) {
            vy = (endTouchY - startTouchY) / CH;
        }
        var abshx = Math.abs(hx);
        var absvy = Math.abs(vy);
        if (abshx > absvy) {
            // 控制灵敏度  5
            if (Math.abs(endTouchX - startTouchX) < 5) {
                endMoRiretion = 0;
                return;
            }
            // 执行横向操作
            if (hx > 0) {
                // 右滑
                if (startMoIndex === 3 || startMoIndex === 6 || startMoIndex === 9) {
                    endMoRiretion = 0;
                } else {
                    // 移动  +1
                    endMoRiretion = 4;
                }
            } else {
                // 左滑
                if (startMoIndex === 1 || startMoIndex === 4 || startMoIndex === 7) {
                    endMoRiretion = 0;
                } else {
                    // 移动  -1
                    endMoRiretion = 3;
                }
            }
        } else if (abshx < absvy) {
            // 控制灵敏度  5
            if (Math.abs(endTouchY - startTouchY) < 5) {
                endMoRiretion = 0;
                return;
            }
            // 执行竖向操作
            if (vy > 0) {
                // 下滑
                if (startMoIndex === 7 || startMoIndex === 8 || startMoIndex === 9) {
                    endMoRiretion = 0;
                } else {
                    // 移动  +3
                    endMoRiretion = 2;
                }
            } else {
                // 上滑
                if (startMoIndex === 1 || startMoIndex === 2 || startMoIndex === 3) {
                    endMoRiretion = 0;
                } else {
                    // 移动  -3
                    endMoRiretion = 1;
                }
            }
        } else {
            endMoRiretion = 0;
        }
    }
    // 开始触屏函数 startMoIndex
    function touchStartFn(event) {
        event.preventDefault();
        var ev = event;
        if (event.touches !== undefined) {
            ev = event.touches[0];
        }
        startTouchX = ev.pageX - canvasOffsetLeft;
        startTouchY = ev.pageY - canvasOffsetTop;

        endTouchX = ev.pageX - canvasOffsetLeft;
        endTouchY = ev.pageY - canvasOffsetTop;

        startMoIndex = Math.ceil(3 * startTouchX / CW) + 3 * Math.floor(3 * startTouchY / CH);
    }
    // 触屏移动函数
    function touchMoveFn(event) {
        event.preventDefault();
        var ev = event;
        if (event.touches !== undefined) {
            ev = event.touches[0];
        }
        endTouchX = ev.pageX - canvasOffsetLeft;
        endTouchY = ev.pageY - canvasOffsetTop;
    }
    // 离开屏幕函数 确定是否执行移动并开启
    function touchEndFn() {
        // 确定移动方位
        calcModelDirection();
        // 根据移动方位移动
        if (endMoRiretion !== 0) {
            removeEventListererFun();
            var noteTemp;
            var nextMoIndex = 0;
            sureMoWHbyIndex(startMoIndex);
            storeDrawX = BI.singleW * storeMoHXtemp;
            storeDrawY = BI.singleH * storeMoVYtemp;

            storeClearX = BI.singleW * storeMoHXtemp;
            storeClearY = BI.singleH * storeMoVYtemp;
            storeClearW = BI.singleW;
            storeClearH = BI.singleH;

            // ---------------------------------
            if (endMoRiretion === 1) {
                distanceOWHScale = BI.singleH;
                nextMoIndex = startMoIndex - 3;
                // 上  -3
                storeClearY = BI.singleH * (storeMoVYtemp - 1);
                storeClearH = BI.singleH * 2;
            } else if (endMoRiretion === 2) {
                distanceOWHScale = BI.singleH;
                nextMoIndex = startMoIndex + 3;
                // 下  +3
                storeClearH = BI.singleH * 2;
            } else if (endMoRiretion === 3) {
                distanceOWHScale = BI.singleW;
                nextMoIndex = startMoIndex - 1;
                // 左  -1
                storeClearX = BI.singleW * (storeMoHXtemp - 1);
                storeClearW = BI.singleW * 2;
            } else if (endMoRiretion === 4) {
                distanceOWHScale = BI.singleW;
                nextMoIndex = startMoIndex + 1;
                // 右  +1
                storeClearW = BI.singleW * 2;
            }
            // ---------------------------------
            // 计算原图使用部分
            sureMoWHbyIndex(moStatuArr[startMoIndex]);
            storeDrawW = BI.singleW * storeMoHXtemp;
            storeDrawH = BI.singleH * storeMoVYtemp;

            // next model
            sureMoWHbyIndex(nextMoIndex);
            nextDrawX = BI.singleW * storeMoHXtemp;
            nextDrawY = BI.singleH * storeMoVYtemp;
            sureMoWHbyIndex(moStatuArr[nextMoIndex]);
            nextDrawW = BI.singleW * storeMoHXtemp;
            nextDrawH = BI.singleH * storeMoVYtemp;

            modelMoveDraw();
            // 更新权重值
            calcArrSingWeight(startMoIndex, nextMoIndex);

            // 图片模块状态记录修改
            noteTemp = moStatuArr[startMoIndex];
            moStatuArr[startMoIndex] = moStatuArr[nextMoIndex];
            moStatuArr[nextMoIndex] = noteTemp;
        }
    }

    // ----------重置canva------------------------------------------------------------
    // 随机打乱moStatuArr
    function randomArr(temp) {
        var valstore = 0;
        var ranTempone = 0;
        var ranTemptwo = 0;
        for (var i = 0;i < temp; i++) {
            ranTempone = Math.ceil(Math.random() * 9);
            ranTemptwo = Math.ceil(Math.random() * 9);

            valstore = moStatuArr[ranTempone];
            moStatuArr[ranTempone] = moStatuArr[ranTemptwo];
            moStatuArr[ranTemptwo] = valstore;
        }
    }
    // 整理计算moStatuArr 权重值
    function calcArrWeight() {
        for (var i = 1;i < 10; i++) {
            if (moStatuArr[i] !== i) {
                moStatuArr[0]++;
            }
        }
    }
    // 计算moStatuArr 权重值 两个模块交换
    function calcArrSingWeight(indexOne, indexTwo) {
        // 交换前两模块的权重
        storeMoHXtemp = indexOne === moStatuArr[indexOne] ? 0 : 1;
        storeMoHXtemp += indexTwo === moStatuArr[indexTwo] ? 0 : 1;
        // 交换后两模块的权重
        storeMoVYtemp = indexOne === moStatuArr[indexTwo] ? 0 : 1;
        storeMoVYtemp += indexTwo === moStatuArr[indexOne] ? 0 : 1;
        moStatuArr[0] = moStatuArr[0] + storeMoVYtemp - storeMoHXtemp;
    }

    // 重绘canvas
    function reDrawWithArr() {
        var moPlaceX = 0;
        var moPlaceY = 0;
        var moPlaceW = 0;
        var moPlaceH = 0;
        for (var i = 1;i < 10; i++) {
            sureMoWHbyIndex(i);
            moPlaceX = BI.singleW * storeMoHXtemp;
            moPlaceY = BI.singleH * storeMoVYtemp;
            sureMoWHbyIndex(moStatuArr[i]);
            moPlaceW = BI.singleW * storeMoHXtemp;
            moPlaceH = BI.singleH * storeMoVYtemp;
            BI.nudgeDraw(CGD, moPlaceX, moPlaceY, moPlaceW, moPlaceH, 1);
        }
        CGD.drawImage(offCanvas,0,0);
    }
    // 重置 moStatuArr  -- main
    function resetArr() {
        moStatuArr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        // 控制难度用 打乱arr次数  每次两位交换
        var ranTemp = 3;
        do {
            ranTemp++;
            randomArr(ranTemp);
            calcArrWeight();
        } while (moStatuArr[0] < 4);
        countTimeInt = 60;
        isCountTimeIn = true;
        reDrawWithArr();
    }

    // ----end------重置canva------------------------------------------------------------
    function addEventListererFun() {
        canvasObj.addEventListener('touchstart', touchStartFn, false);
        canvasObj.addEventListener('touchmove', touchMoveFn, false);
        canvasObj.addEventListener('touchend', touchEndFn, false);
        $changeButton.on('click', function () {
            resetArr();
        });
    }
    function removeEventListererFun() {
        canvasObj.removeEventListener('touchstart', touchStartFn, false);
        canvasObj.removeEventListener('touchmove', touchMoveFn, false);
        canvasObj.removeEventListener('touchend', touchEndFn, false);

        $changeButton.off('click');
    }
    //
    function startGame() {
        // 绘制离屏
        drawOffCanvas(CW, CH);
        loadImages(function (imgsign) {
            BI = new NgtImg(imgsign, 470, 470, CW, CH);
            resetArr();
            addEventListererFun();
        });
        countTimefn();
    }

    // 倒计时开始游戏
    var startTimeOut = 4;
    var $timeOutShow = $('.time_out_js');
    function goPlayGame() {
        startTimeOut--;
        $timeOutShow.html(startTimeOut);
        if (startTimeOut === 0) {
            $('.yuanBg').hide();
            $shadePanel.hide();
            $('.tkBox').show();
            $('.tkBottom').show();
            $('.conBg').show();
            startGame();
        } else {
            setTimeout(function () {
                goPlayGame();
            }, 1000);
        }
    }
    goPlayGame();
    // ---------------------------------------------------
    // 启动倒计时  只能启动一次
    function countTimefn() {
        if(isCountTimeRun) {
            countTimeInt--;
        }
        $countTimePanel.html(countTimeInt + 'S');
        if (countTimeInt === 0) {
            if (isCountTimeIn) {
                isCountTimeIn = false;
                $shadePanel.show();
                $('.replay_panel_js').show();
            }
        } else if (isCountTimeIn) {
            setTimeout(function () {
                countTimefn();
            }, 1000);
        }
    }
    // 展示活动规则
    $('.rule').on('click', function () {
        isCountTimeRun = false;
        $shadePanel.show();
        $('.rule_panel_js').show();
    });
    // 关闭活动规则
    $('.btn-pin').on('click', function () {
        isCountTimeRun = true;
        $shadePanel.hide();
        $('.rule_panel_js').hide();
    });
    // 关闭活动规则
    $('.btn-close').on('click', function () {
        isCountTimeRun = true;
        $shadePanel.hide();
        $('.rule_panel_js').hide();
    });
    // 点击领奖
    $('.draw').on('click', function () {
        console.log('go get prize!');
        window.location.href = 'huodongAC.d?m=newWheelLottery&class=NewWheelLotteryHc&lotteryId=100462&city=bj&channel=others';
        
 });
    // 再玩一次
    $('.again_but_js').on('click', function () {
        window.location.href = '/huodongAC.d?class=NineGridTranHc&m=goNgtGame&pageNum=' + transImgNum;
/*        resetArr();
        setTimeout(function () {
            countTimefn();
        }, 1000);
        $shadePanel.hide();
        $('.replay_panel_js').hide();*/
    });
    // 领取鼓励
    $('.get_but_js').on('click', function () {
        window.location.href = 'http://m.fang.com/activityshow/crossYear/getCou.jsp';
    });

    // ===================================================================================================================
    // var imgSrcStr="http://js.test.soufunimg.com/common_m/m_activity/yiZhanDaoDi/images/";//图片路径
    function loadImages(fn, fnError) {
        var oImg = new Image();
        oImg.onload = function () {
            fn(this);
        };
        oImg.onerror = function () {
            fnError && fnError();
        };
        oImg.src = transImgUrl;
    }
});