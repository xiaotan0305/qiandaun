/*
 * @Author: chenshaoshan
 * @Date:   2015/11/27
 * @description: 一站问到地
 * @Last Modified by:   chenshaoshan
 * @Last Modified time: 2015/12/02
 */
//========================================================================================================================
$(function () {
    'use strict';
    // 第二页左边门
    var opLeftOpt = $('.opLeft');
    // 第二页右边门
    var opRightOpt = $('.opRight');
    // 答案 第一个
    var $allowOpt = $('.allow');
    // 一 答案内容 i
    var $allowPanel = $('.allow i');
    // 答案 第二个
    var $noAllowOpt = $('.noAllow');
    // 二 答案内容 i
    var $noallowPanel = $('.noAllow i');
    // 思考状态图 div
    var $thinkingImg = $('.thinking_js');
    // 答错状态图 div
    var $cryingImg = $('.crying_js');
    // 答错状态图 img 移动用
    var $cryingImgPanel = $('.crying');
    // 答对状态图 img
    var $greatImg = $('.great_js');
    // 题目
    var $questPanel = $('.quest p');
    // 第几道题目
    var $ttNumberPanel = $('.ttNumber');

    // 问题json
    var quseJson = null;
    // 问题索引
    var $quseTemp = 0;
    // 总计问题数目
    var $quseCount = 5;
    // 当前问题id
    var quseid = null;
   // uuid_store
    var uuidStore = null;
    // userid_store
    var useridStore = null;
    // 答对音乐控件
    var rightMusicAudio = null;
    // 答错音乐控件
    var wrongMusicAudio = null;

    // 图片地址
    var imgSrcStr = $('.imgSrcStr_store').val();
    // 活动id
    var lotteryidStore = $('.lotteryid_store').val();

    var imeival = $('.imei').val();

    var gImgs = [
        // 800*1010
        'yzcdd_door_bg.jpg',
        // 640*640  点点亮
        'yzcdd_door_ball.png',
        // 640*640    圆圈1
        'yzcdd_door_circle1.png',
        // 640*640    圆圈2
        'yzcdd_door_circle2.png',
        // 640*640    圆圈3
        'yzcdd_door_circle3.png',
        // 418*418  门
        'yzcdd_door.png'
    ];
    // ------------------------------------------------------------------
    // 答错执行效果
    function isWrongExce(temp) {
        opLeftOpt.css('-webkit-transform', 'translate(-' + temp + '%,0)');
        opLeftOpt.css('-moz-transform', 'translate(-' + temp + '%,0)');
        opLeftOpt.css('transform', 'translate(-' + temp + '%,0)');

        opRightOpt.css('-webkit-transformtransform', 'translate(' + temp + '%,0)');
        opRightOpt.css('-moz-transform', 'translate(' + temp + '%,0)');
        opRightOpt.css('transform', 'translate(' + temp + '%,0)');

        $cryingImgPanel.css('-webkit-transformtransform', 'translate(0,' + temp + '%)');
        $cryingImgPanel.css('-moz-transform', 'translate(0,' + temp + '%)');
        $cryingImgPanel.css('transform', 'translate(0,' + temp + '%)');

        if (temp > 95) {
            // $('.wrong_panel_js').show();  http://m.fang.com/ask/daily/专题ID.html
            var linkurlstr = 'http://' + window.location.host + '/ask/daily/' + quseid + '.html?src=client';
            window.location.href = linkurlstr;
        } else {
            requestAnimationFrame(function () {
                isWrongExce(temp + 2);
            });
        }
    }
    function loadMusic() {
        if ($('.audio').length > 0) {
            var audio = document.querySelector('.audio');
            rightMusicAudio = audio.querySelector('#right_music_audio');
            wrongMusicAudio = audio.querySelector('#wrong_music_audio');
        }
    }
    // 答错执行
    function answerWrongQ() {
        $cryingImg.show();
        $thinkingImg.hide();
        $greatImg.hide();
        isWrongExce(0);
        wrongMusicAudio.play();
    }
    // 回答正确走向
    function goTrueQues() {
        $quseTemp++;
        $thinkingImg.hide();
        $cryingImg.hide();
        rightMusicAudio.play();
        if ($quseTemp === $quseCount) {
            $greatImg.hide();
            $('.questTT').hide();
            $('.win_panel_js').show();
        } else {
            $greatImg.show();
            setTimeout(function () {
                initQues();
            }, 800);
        }
    }
// ------------------------------------------------------------------
    // 第一个答案click
    function allowClick() {
        $allowOpt.off('click',allowClick);
        $noAllowOpt.off('click',noallowClick);
        // 1是错
        if (quseJson[$quseTemp].firstResult === 1) {
            $allowOpt.addClass('false');
            setTimeout(function () {
                answerWrongQ();
            }, 800);
        } else {
            $allowOpt.addClass('true');
            goTrueQues();
        }
    }
    // 第二个答案click
    function noallowClick() {
        $allowOpt.off('click',allowClick);
        $noAllowOpt.off('click',noallowClick);
        // 1是错
        if (quseJson[$quseTemp].secondResult === 1) {
            $noAllowOpt.addClass('false');
            setTimeout(function () {
                answerWrongQ();
            }, 800);
        } else {
            $noAllowOpt.addClass('true');
            goTrueQues();
        }
    }
// ------------------------------------------------------------------
    // 根据$quseTemp  重置题目
    function initQues() {
        $allowOpt.removeClass('true').removeClass('false');
        $noAllowOpt.removeClass('true').removeClass('false');
        var qusetempindex = $quseTemp + 1;
        $ttNumberPanel.html('第' + qusetempindex + '题');
        $questPanel.html(quseJson[$quseTemp].timu);
        $allowPanel.html(quseJson[$quseTemp].first);
        $noallowPanel.html(quseJson[$quseTemp].second);
        quseid = quseJson[$quseTemp].timuId;

        $thinkingImg.show();
        $cryingImg.hide();
        $greatImg.hide();

        opLeftOpt.css('-webkit-transform', 'translate(0%,0)');
        opLeftOpt.css('-moz-transform', 'translate(0%,0)');
        opLeftOpt.css('transform', 'translate(0%,0)');

        opRightOpt.css('-webkit-transform', 'translate(0%,0)');
        opRightOpt.css('-moz-transform', 'translate(0%,0)');
        opRightOpt.css('transform', 'translate(0%,0)');

        $cryingImgPanel.css('-webkit-transform', 'translate(0,0');
        $cryingImgPanel.css('-moz-transform', 'translate(0,0');
        $cryingImgPanel.css('transform', 'translate(0,0');

        $allowOpt.on('click', allowClick);
        $noAllowOpt.on('click', noallowClick);
    }
    // 走后台获取题目
    function getQuest() {
        $('.questTT').show();
        var quesparam = {};
        quesparam.class = 'YiZhanDaoDiHc';
        quesparam.m = 'getTimu';
        quesparam.lotteryId = lotteryidStore;
        quesparam.imei = imeival;
        $.ajax({
            url: '/huodongAC.d',
            type: 'POST',
            data: quesparam,
            dataType: 'json',
            success: function (data) {
                quseJson = data.root.list;
                uuidStore = data.root.uuid;
                useridStore = data.root.userId;
                $quseTemp = 0;
                $quseCount = quseJson.length;
                initQues();
            }
        });
    }
// ------------------------------------------------------------------

//   回答正确后未登录
    // 立即抽奖
    $('.win_prize_js').on('click', function () {
        // 已登录
        if (!(useridStore === '-1')) {
            setTimeout(function () {
                var loginurlstr = 'http://' + window.location.host
                    + '/huodongAC.d?class=YiZhanDaoDiHc&m=insertAnswerRecord&uuid='
                    + uuidStore
                    + '&answerNumber='
                    + $quseTemp;
                window.location.href = loginurlstr;
            }, 500);
            // 未登录
        } else {
            $('.login_panel_js').show();
        }
    });
    // --获取验证码
    $('.getCheckNO').on('click', function () {
        var phoneReg = /^(13[0-9]|14[0-9]|15[0-9]|18[0-9]|17[0-9])\d{8}$/i;
        var phonenum = $('.phone_js').val();
        if (!phoneReg.test(phonenum)) {
            alert('手机号错误,请重新输入');
            return;
        } else {
            getPhoneVerifyCode(phonenum.trim(),
                function () {
                    alert('验证码已发出并于1分钟内发到，请确认手机短信！');
                }, function () {

                });
        }
    });

    // --登录抽奖
    $('.login_draw_js').on('click', function () {
        var phoneReg = /^(13[0-9]|14[0-9]|15[0-9]|18[0-9]|17[0-9])\d{8}$/i;
        var checkcodeReg = /^\d{6}$/;
        var phonenum = $('.phone_js').val();
        var checkcodenum = $('.checkcode_js').val();
        if (!phoneReg.test(phonenum)) {
            alert('手机号错误,请确认手机号是否输入正确!');
            return;
        }
        if (!checkcodeReg.test(checkcodenum)) {
            alert('验证码错误,请确认验证码是否正确！');
            return;
        }
        //  跳转至后台  param有手机号 phonenum和 验证码checkcodenum

        sendVerifyCodeAnswer(phonenum.trim(), checkcodenum.trim(),
            function () {
                var loginurlstr = 'http://' + window.location.host + '/huodongAC.d?class=YiZhanDaoDiHc&m=insertAnswerRecord&uuid=' + uuidStore + '&answerNumber=' + $quseTemp;
                window.location.href = loginurlstr;
            }, function () {
                alert('验证码错误，请确认验证码输入正确！');
            });

    });

//   ================================================================================================================
// ------点击开始动画
    var CW = document.documentElement.clientWidth;
    var CH = document.documentElement.clientHeight;
    // door 的宽高
    var DWH = CW*2/5;
    // 圈圆 的宽高
    var CPWH = CW*3/5;
    var HCW = CW/2;
    // 中心坐标为 （HCW,180）
    var VCH = CH/4;
    // 每次平移量   总共平移50次
    var Xtran = CW/25000;
    var XtranCount = 50;
    var XtranTemp = 50;

    // canvas
    var oC = document.getElementById('c');
    var CGD = oC.getContext('2d');
    oC.width = CW;
    oC.height = CH;

    function startGame() {
        // ------------------------------------------------------------------------
        loadImages(gImgs, function (imgs) {
            // ----------statement-----var---------------
            // 第一页背景
            var BI = new BackImg(imgs.yzcdd_door_bg, 800, 1010, CW, CH);
            // 第一页 门
            var door = new Door(imgs.yzcdd_door, 418, DWH, HCW, VCH);
            // 第一页 门外点点 不旋转 只移动
            var CP = new CirclePot(imgs.yzcdd_door_ball, 640, CPWH, HCW, VCH);
            // 第一页 门外1圈圈
            var C1 = new CirclePot(imgs.yzcdd_door_circle1, 640, CPWH, HCW, VCH);
            // 第一页 门外2圈圈
            var C2 = new CirclePot(imgs.yzcdd_door_circle2, 640, CPWH, HCW, VCH);
            // 第一页 门外3圈圈
            var C3 = new CirclePot(imgs.yzcdd_door_circle3, 640, CPWH, HCW, VCH);
            // ----------statement-----function---------------
            // 开门
            function openMove() {
                CGD.clearRect(0, 0, CW, CH);
                BI.horizonMove(CGD, HCW, XtranCount - XtranTemp, Xtran);
                door.horizonMove(CGD, HCW, XtranCount - XtranTemp, Xtran);
                CP.horizonMove(CGD, HCW, XtranCount - XtranTemp, Xtran);
                C1.horizonMove(CGD, HCW, XtranCount - XtranTemp, Xtran);
                C2.horizonMove(CGD, HCW, XtranCount - XtranTemp, Xtran);
                C3.horizonMove(CGD, HCW, XtranCount - XtranTemp, Xtran);
                XtranTemp--;
                if (XtranTemp >= 0) {
                    requestAnimationFrame(function () {
                        openMove();
                    });
                } else {
                    XtranTemp = XtranCount;
                    loadMusic();
                    $('.yzcdd_mask').hide();
                    // $('.yzcdd_index').removeClass('none').eq(0).css('display','none').eq(1).show();
                }
            }
            // 旋转
            function circleMove() {
                CGD.clearRect(0, 0, CW, CH);
                BI.draw(CGD);
                door.circleMove(CGD, HCW,VCH, XtranTemp);
                CP.draw(CGD,HCW,VCH);
                C1.circleMove(CGD, HCW,VCH, XtranCount - XtranTemp);
                C2.circleMove(CGD, HCW,VCH, XtranTemp);
                C3.circleMove(CGD, HCW,VCH, XtranCount - XtranTemp);
                XtranTemp = XtranTemp - 2;
                if (XtranTemp >= 0) {
                    requestAnimationFrame(function () {
                        circleMove();
                    });
                } else {
                    XtranTemp = XtranCount;
                    $('.question_game_panel').show();
                    $('.start_game_panel').hide();
                    setTimeout(function () {
                        openMove();
                    }, 600);
                }
            }
            // 关门
            function closeMove() {
                CGD.clearRect(0, 0, CW, CH);
                BI.horizonMove(CGD, HCW, XtranTemp, Xtran);
                door.horizonMove(CGD, HCW, XtranTemp, Xtran);
                CP.horizonMove(CGD, HCW, XtranTemp, Xtran);
                C1.horizonMove(CGD, HCW, XtranTemp, Xtran);
                C2.horizonMove(CGD, HCW, XtranTemp, Xtran);
                C3.horizonMove(CGD, HCW, XtranTemp, Xtran);
                XtranTemp--;
                if (XtranTemp >= 0) {
                    requestAnimationFrame(function () {
                        closeMove();
                    });
                } else {
                    XtranTemp = XtranCount;

                    getQuest();
                    setTimeout(function () {
                        circleMove();
                    }, 400);
                }
            }
            // ----------excute--------------------
            closeMove();
        });
    }

// --------------------------------------------------------------------------
    // 开始游戏
    $('.start_game_js').on('click', function () {
        $('.yzcdd_mask').show();
        $('.yzcdd_rule').hide();
        startGame();
    });
    // 活动规则
    $('.yzcdd_rule').on('click', function () {
        $('.yzcdd_mask3').show();
    });
    // 活动规则关闭
    $('.rule_close_js').on('click', function () {
        $('.yzcdd_mask3').hide();
    });
    // 登录关闭
    $('.login_close_js').on('click',function () {
        $('.yzcdd_mask2').hide();
    });


// ========================================================================================================================
// var imgSrcStr="http://js.test.soufunimg.com/common_m/m_activity/yiZhanDaoDi/images/";//图片路径

    function loadImages(arr, fn, fnError) {
        var count = 0;
        var json = {};

        for (var i = 0; i < arr.length; i++) {
            var oImg = new Image();

            (function (index) {
                oImg.onload = function () {
                    var name = arr[index].split('.')[0];
                    json[name] = this;
                    count++;
                    if (count === arr.length) {
                        fn(json);
                    }
                };
                oImg.onerror = function () {
                    fnError && fnError();
                };
            })(i);
            oImg.src = imgSrcStr + arr[i];
        }
    }


    function d2a(n) {
        return n * Math.PI / 180;
    }

// ---------------------------------------------------------------------------------------------------------------
    function BackImg(img, w, h, SW, SH) {
        this.img = img;

        this.w = w;
        this.h = h;

        this.wscale = SW / w;
        this.hscale = SH / h;
    }
// 绘
    BackImg.prototype.draw = function (gd) {
        gd.save();
        gd.scale(this.wscale, this.hscale);
        gd.drawImage(this.img, 0, 0, this.w, this.h, 0, 0, this.w, this.h);
        gd.restore();
    };

// 打开
    BackImg.prototype.horizonMove = function (gd, halfWidth, count, xtemp) {
        gd.save();
        gd.translate(-count*count*count*xtemp, 0);
        gd.scale(this.wscale, this.hscale);
        gd.drawImage(this.img, 0, 0, this.w/2, this.h, 0, 0, this.w/2, this.h);
        gd.restore();

        gd.save();
        gd.translate((count*count*count*xtemp + halfWidth), 0);
        gd.scale(this.wscale, this.hscale);
        gd.drawImage(this.img, this.w/2, 0, this.w/2, this.h, 0, 0, this.w/2, this.h);
        gd.restore();
    };
// ---------------------------------------------------------------------------------------------------------------
    function Door(img, wh, rwh, halfWidth, vch) {
        this.img = img;

        this.wh = wh;
        this.whscae = rwh/wh;

        this.lx = (halfWidth - (rwh/2))/this.whscae;
        this.y = (vch - rwh/2)/this.whscae;

        this.rotate = 90/50;
    }

// 打开
    Door.prototype.horizonMove = function (gd, halfWidth, count, xtemp) {
        gd.save();
        gd.translate(-count*count*count*xtemp, 0);
        gd.scale(this.whscae, this.whscae);
        gd.drawImage(this.img, 0, 0, this.wh/2, this.wh, this.lx, this.y, this.wh/2, this.wh);
        gd.restore();

        gd.save();
        gd.translate(count*count*count*xtemp + halfWidth, 0);
        gd.scale(this.whscae, this.whscae);
        gd.drawImage(this.img, this.wh/2, 0, this.wh/2, this.wh, 0, this.y, this.wh/2, this.wh);
        gd.restore();

    };

// 旋转
    Door.prototype.circleMove = function (gd, chw, cvh, count) {
        gd.save();
        gd.translate(chw, cvh);
        gd.rotate(d2a(this.rotate * count));
        gd.scale(this.whscae, this.whscae);
        gd.drawImage(this.img, 0, 0, this.wh, this.wh, -this.wh/2, -this.wh/2, this.wh, this.wh);
        gd.restore();
    };
// ---------------------------------------------------------------------------------------------------------------
    function CirclePot(img, wh, rwh, halfWidth, vch) {
        this.img = img;

        this.wh = wh;
        this.whscae = rwh/wh;

        this.lx = (halfWidth-(rwh/2))/this.whscae;
        this.y = (vch-rwh/2)/this.whscae;

        this.rotate = 240/50;

    }
// 打开
    CirclePot.prototype.horizonMove = function (gd, halfWidth, count, xtemp) {
        gd.save();
        gd.translate(-count*count*count*xtemp, 0);
        gd.scale(this.whscae, this.whscae);
        gd.drawImage(this.img, 0, 0, this.wh/2, this.wh, this.lx, this.y, this.wh/2, this.wh);
        gd.restore();

        gd.save();
        gd.translate(count*count*count*xtemp + halfWidth, 0);
        gd.scale(this.whscae, this.whscae);
        gd.drawImage(this.img, this.wh/2, 0, this.wh/2, this.wh, 0, this.y, this.wh/2, this.wh);
        gd.restore();

    };

// 旋转
    CirclePot.prototype.circleMove = function (gd, chw, cvh, count) {
        gd.save();
        gd.translate(chw, cvh);
        gd.rotate(d2a(this.rotate * count));
        gd.scale(this.whscae, this.whscae);
        gd.drawImage(this.img, 0, 0, this.wh, this.wh, -this.wh/2, -this.wh/2, this.wh, this.wh);
        gd.restore();
    };

// 绘
    CirclePot.prototype.draw = function (gd, chw, cvh) {
        gd.save();
        gd.translate(chw, cvh);
        gd.scale(this.whscae, this.whscae);
        gd.drawImage(this.img, 0, 0, this.wh, this.wh, -this.wh/2, -this.wh/2, this.wh, this.wh);
        gd.restore();
    };
// ---------------------------------------------------------------------------------------------------------------

})

