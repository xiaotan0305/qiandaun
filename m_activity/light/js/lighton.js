/**
 * @Author: chenshaoshan
 * @Date:   2016/01/20
 * @description: 点灯笼活动
 * @Last Modified by:   chenshaoshan
 * @Last Modified time:
 */
$(function () {
    'use strict';
    // 加载条
    var $loadLeft = $('.load_left_js');
    var $loadPros = $('.load_pros_js');
    var $loadNum = $('.load-num');
    var loadInt = 0;

//  是否登录字段  -1表示未登录
    var isLoginStr= $('.login_id_js').val();
//   记录闪动登录位标  和 是否为问题闪动
    var flashSign = 0;
    var flashvalstr = 0;
//   手机验证码倒计时
    var showTimeInt = 60;
//    登录验证码显示区
    var $showCode = $('.get_code_js');
//    黑色蒙层
    var $blackPanel = $('.floatAlert');

//    错误提示信息
    var $signTipPanel = $('.tip_sign_js');
//    错误提示信息2
    var $wrongTipPanel = $('.tip_wrong_js');

//    点亮登录obj 和位标
    var $lanternObj = null;
    var lanternIndex = null;
//    问题id 和问题数  问题数
    var questionId = 0;
    var lanCount = 0;
    var answeredNumstr = null;

    var hdftppathUrl = $('.output_fileurl_js').val();
    // 显示已获得积分数
    var $countJFShow = $('.count_jfshow_js');
    var countJFset = 0;
    // 音乐控件
    var lightMusicAudio = null;
    // 控制灯笼点击次数
    var islanControl = false;

    var sourceStr = $('.source_js').val();
// ------------function------------------------------------------------------------


    function loadMusic() {
        if ( $('.audio').length > 0 ) {
            var audio = document.querySelector('.audio');
            lightMusicAudio = audio.querySelector('#music_audio');
        }
    }
    // 进度条
    function loadProgress() {
        loadInt += parseInt(Math.random()*5+1, 10);
        if(loadInt > 100){
            loadInt =100;
        }
        $loadLeft.css('left', loadInt + '%');
        $loadPros.css('width', loadInt + '%');
        $loadNum.html(loadInt);
        if (loadInt < 100) {
            setTimeout(function () {
                loadProgress();
            }, 20);
        } else {
            $('.loading').hide();
            $('.wrap').show();
            loadMusic();
        }
    }
    // 记录显示用户积分
    function setShowcountjf(jifen) {
        var jftemp = parseInt(jifen);
        countJFset += jftemp;
        $countJFShow.html(countJFset);
    }
    // 活动初始话
    function initPros() {
        // 判断登录 isLoginStr
        isLoginStr = isLoginStr.trim();
        if (isLoginStr === '-1') {
            $('.jifen_panel_js').hide();
        }
        // 重置灯笼状态
        var stausArr = $.makeArray($('.statu_light_js'));
        var lightShow = $('.dengList li');
        for (var i = 0; i < 9; i++) {
            if (stausArr[i].value === '1') {
                lightShow.eq(i).addClass('on');
            } else if (stausArr[i].value === '2') {
                flashSign = i + 1;
                flashvalstr = 2;
                lightShow.eq(i).addClass('flash');
            }
        }
        var jstempstr = $countJFShow.html();
        countJFset = parseInt(jstempstr);
    }
    initPros();
//  手机验证码获取成功 记时
    function updateTimePhone() {
        showTimeInt--;
        if (showTimeInt < 0) {
            $showCode.val('重新获取');
            $showCode.attr('disabled',false);
            showTimeInt = 60;
        } else {
            setTimeout(function () {
                $showCode.val('重新获取(' + showTimeInt + ')');
                updateTimePhone();
            }, 1000);
        }
    }
//  错误提示信息
    function showWrongTip() {
        $wrongTipPanel.show();
        setTimeout(function () {
            $wrongTipPanel.hide();
        }, 2000);
    }
    //  单行提示信息
    function showSignTip(megstr) {
        $('.tip_sign_content_js').html(megstr);
        $signTipPanel.show();
        setTimeout(function () {
            $signTipPanel.hide();
        }, 2000);
    }
    // 点亮灯笼  确定灯笼状态  --关闭
    function sureStatu() {
        if (lanternIndex === flashSign) {
            flashSign = 0;
            $lanternObj.removeClass('flash');
        }
        $lanternObj.addClass('on');
    }
    // 积分展示卡 随机展示
    function showJFpanel(imgstr, imgsizestr){
        var panelran = parseInt(Math.random()*7+3, 10);
        var panelshowstr = '.res_panel_js' + panelran;
        var imgshowstr = '.res_img_js' + panelran;
        var jfshowimgstr = 'url(' + hdftppathUrl + imgstr + ') center center no-repeat';
        $(imgshowstr).css({'background':jfshowimgstr, 'background-size':imgsizestr});
        $(panelshowstr).show();
    }
    // 点亮灯笼 为 积分
    function lanJifen(jfval) {
        $blackPanel.show();
        if(lanCount === 0) {
            $('.res_panel_js1').show();
        } else if (lanCount === 2) {
            $('.res_panel_js2').show();
        } else {
            var jfimg = '5.png';
            var jfsizestr = '1.15rem auto';
            if (jfval === '5') {
            } else if (jfval === '10') {
                jfimg = '10.png';
                jfsizestr = '1.8rem auto';
            } else if (jfval === '20') {
                jfimg = '20.png';
                jfsizestr = '2.05rem auto';
            } else if (jfval === '50') {
                jfimg = '50.png';
                jfsizestr = '2rem auto';
            } else if (jfval === '100') {
                jfimg = '100.png';
                jfsizestr = '2.5rem auto';
            } else if (jfval === '200') {
                jfimg = '200.png';
                jfsizestr = '2.75rem auto';
            } else if (jfval === '500') {
                jfimg = '500.png';
                jfsizestr = '2.7rem auto';
            } else if (jfval === '1000') {
                jfimg = '1000.png';
                jfsizestr = '2.9rem auto';
            }
            showJFpanel(jfimg, jfsizestr);
        }
        setShowcountjf(jfval);
        sureStatu();
    }
    // 全部过关 所送积分卡展示
    function lastSumShow(jfval) {
        var sjfimg = '5.png';
        var sjfsizestr = '1.15rem auto';
        if (jfval === '5') {
        } else if (jfval === '10') {
            sjfimg = '10.png';
            sjfsizestr = '1.8rem auto';
        } else if (jfval === '20') {
            sjfimg = '20.png';
            sjfsizestr = '2.05rem auto';
        } else if (jfval === '50') {
            sjfimg = '50.png';
            sjfsizestr = '2rem auto';
        } else if (jfval === '100') {
            sjfimg = '100.png';
            sjfsizestr = '2.5rem auto';
        }
        var jfshowimgstr = 'url(' + hdftppathUrl + sjfimg + ') center center no-repeat';
        $('.res_sum_img_js').css({'background':jfshowimgstr, 'background-size':sjfsizestr});

        setShowcountjf(jfval);
        var allBoxPanel = $('.allBox');
        $blackPanel.show();
        allBoxPanel.show();
        setTimeout(function () {
            $blackPanel.hide();
            allBoxPanel.hide();
        }, 2000);
    }

    // 点亮灯笼
    function lightLantern() {

        var lightParm = {};
        lightParm.class = 'LightHc';
        lightParm.m = 'insertLotteryResult';
        lightParm.pos = lanternIndex;
        lightParm.flashVal = flashvalstr;
        lightParm.s = sourceStr;
        $.ajax({
            url:'/huodongAC.d',
            type:'POST',
            data:lightParm,
            dataType:'json',
            success:function (data){
                var lanType = data.root.lottery;
                var lanCountstr = data.root.count;
                var lanValue = data.root.valued;
                lanCount = parseInt(lanCountstr);

                // 1 获得积分的情况
                if (lanType === 'jifen') {
                    lanJifen(lanValue.trim());
                    flashvalstr = 0;
                //   问答问题
                } else if (lanType === 'dati') {
                    questionId = data.root.askId;
                    var quescontentstr = data.root.titled;
                    answeredNumstr = data.root.answeredNum;
                    flashvalstr = 2;
                    // 初始问题panel
                    $('.ques_content_js').html(quescontentstr);
                    $blackPanel.show();
                    $('.ques_panel_js').show();
                } else if (lanType === 'coupon') {
                    flashvalstr = 0;
                    $blackPanel.show();
                    $('.qBox').show();
                    sureStatu();
                } else if (lanType === 'mianfeiyanfang') {
                    flashvalstr = 0;
                    $blackPanel.show();
                    $('.res_panel_js11').show();
                    sureStatu();
                }
                setTimeout(function () {
                    islanControl = false;
                }, 1000);
            }
        });
    }
    function lightLanternTT(TT) {
        var lanValue = '200';
        lanCount = 8;
        // jifen
        if (TT === 1) {
            lanJifen(lanValue.trim());
        // dati
        } else if (TT === 2) {
            questionId = 2;
            var quescontentstr = '从报销比例看，拥有“公家人”身份的拉赛尔的父亲享受几乎全额的医疗费用赔付，哪怕是在私立医院就诊或住院，他也能享受到政府要求私立医院特别为低收入者预留的诊疗名额及床位';
            answeredNumstr = 2;
            // 初始问题panel
            $('.ques_content_js').html(quescontentstr);
            $blackPanel.show();
            $('.ques_panel_js').show();

        // coupon
        } else if (TT === 3) {
            $blackPanel.show();
            $('.qBox').show();
            sureStatu();
            // 特列 展示最后获赠积分卡
        } else if(TT === 4) {
            lastSumShow('5');
        }
    }
// ------------listen------------------------------------------------------------
    // 进度条
    $(window).load(function () {
        loadProgress();
    });

    $('.btn-dh').on('click', function () {
        window.location.href = 'http://m.store.fang.com/index.html';
    });
    // 问题反馈
    $('.link').on('click', function () {
        $blackPanel.show();
        $('.feedback_panel_js').show();
    });
    $('.feedback_back_js').on('click', function () {
        $blackPanel.hide();
        $('.feedback_panel_js').hide();
    });
    $('.feedback_submit_js').on('click', function () {
        var phoneReg = /^(13[0-9]|14[0-9]|15[0-9]|18[0-9]|17[0-9])\d{8}$/i;
        var contentstr = $('.feedback_content_js').val();
        var phonestr = $('.feedback_phone_js').val();
        if (contentstr.length < 1) {
            $signTipPanel.css('top','25rem');
            showSignTip('请输入反馈内容');
            return;
        }
        if (phonestr.length > 1 && !phoneReg.test(phonestr)) {
            $signTipPanel.css('top','25rem');
            showSignTip('请输入正确手机号');
        }
        var fbcontentstr = encodeURIComponent(encodeURIComponent(contentstr));
        var fbParm = {};
        fbParm.class = 'LightHc';
        fbParm.m = 'feedback';
        fbParm.phone = phonestr;
        fbParm.content = fbcontentstr;
        $.ajax({
            url:'/huodongAC.d',
            type:'POST',
            data:fbParm,
            dataType:'json',
            success:function () {
                $signTipPanel.css('top','25rem');
                showSignTip('感谢您的反馈');
            }
        });
        $blackPanel.hide();
        $('.feedback_panel_js').hide();
    });
    // 各个灯笼点击
    $('.dengList li').on('click', function () {
        if ($(this).hasClass('on') || islanControl) {
            return;
        }
        // 没有登录的
        if (isLoginStr === '-1') {
            $blackPanel.show();
            $('.login_panel_js').show();
            $blackPanel.on('click', function () {
                $blackPanel.hide();
                $('.login_panel_js').hide();
                $blackPanel.off('click');
            });
            return;
        }

        var litemp = parseInt($(this).attr('enname'));
        if (litemp === flashSign || flashSign === 0) {
            $lanternObj = $(this);
            lanternIndex = litemp;
            islanControl = true;
            // 更新灯笼状态
            if (flashSign === 0) {
                flashSign = litemp;
                $lanternObj.addClass('flash');
            }
            lightLantern();
            // lightLanternTT(4);
        } else {
            $signTipPanel.css('top','14rem');
            showSignTip('请您继续点亮之前的灯笼');
        }
    });
//    --------手机登录验证码
//   手机号验证码登录
    $showCode.on('click', function () {
        var phonestr = $('.login_phone_js').val();
        if (phonestr.length < 1) {
            $signTipPanel.css('top','14rem');
            showSignTip('请输入手机号');
            return;
        }
        var phoneReg = /^(13[0-9]|14[0-9]|15[0-9]|18[0-9]|17[0-9])\d{8}$/i;

        if (!phoneReg.test(phonestr)) {
            $signTipPanel.css('top','14rem');
            showSignTip('手机号错误,请重新输入');
            return;
        }
        $showCode.attr('disabled',true);
        getPhoneVerifyCode(phonestr.trim(),
            function () {
                updateTimePhone();
            }, function () {

            });
    });
//  验证验证码   --登录按钮
    $('.code_login_js').on('click', function () {
        var phoneReg = /^(13[0-9]|14[0-9]|15[0-9]|18[0-9]|17[0-9])\d{8}$/i;
        var codeReg = /^\d{6}$/;
        var phonestr = $('.login_phone_js').val();
        var codestr = $('.login_code_js').val();
        if (phonestr.length < 1) {
            $signTipPanel.css('top','9rem');
            showSignTip('请输入手机号');
            return;
        }
        if (!phoneReg.test(phonestr)) {
            alert('手机号错误,请确认手机号是否输入正确!');
            return;
        }
        if (!codeReg.test(codestr)) {
            alert('验证码错误,请确认验证码是否正确！');
            return;
        }
        sendVerifyCodeAnswer(phonestr.trim(), codestr.trim(),
            function () {
                var ranInt = Math.round(Math.random()*100);
                location.replace('http://' + window.location.host + '/huodongAC.d?class=LightHc&m=index&ran=' + ranInt + '&s=' + sourceStr);
            }, function () {
                alert('验证码错误,请确认验证码是否正确！');
            });
    });
    // 结果也点击继续答题
    $('.res_panel_js').on('click', function () {
        $blackPanel.hide();
        $('.imgBox').hide();
    });
// --------- 回答问题 panel
    // 更换问题
    $('.ques_change_js').on('click', function () {
        var changeParm = {};
        changeParm.class = 'LightHc';
        changeParm.m = 'changeQuestion';
        changeParm.askId = questionId;
        changeParm.answeredNum = answeredNumstr;
        changeParm.s = sourceStr;
        $.ajax({
            url:'/huodongAC.d',
            type:'POST',
            data:changeParm,
            dataType:'json',
            success:function (data) {
                questionId = data.root.askId;
                answeredNumstr = data.root.answeredNum;
                var quescontentstr = data.root.titled;
                $('.ques_content_js').html(quescontentstr);
            }
        });
    });
    // 取消
    $('.ques_back_js').on('click', function () {
        $blackPanel.hide();
        $('.ques_panel_js').hide();
    });
    // 提交
    $('.ques_submit_js').on('click', function () {
        var preanwerStr = $('.ques_answer_js').val();
        if (preanwerStr.length < 15) {
            $signTipPanel.css('top','14rem');
            showSignTip('回答不能少于15字哦~');
            return;
        }
        var anwerStr = encodeURIComponent(encodeURIComponent(preanwerStr));
        $('.ques_answer_js').val('');

        $('.ques_panel_js').hide();
        $blackPanel.hide();

        var answerParm = {};
        answerParm.class = 'LightHc';
        answerParm.m = 'totalAnswer';
        answerParm.askId = questionId;
        answerParm.content = anwerStr;
        answerParm.pos = lanternIndex;
        $.ajax({
            url:'/huodongAC.d',
            type:'POST',
            data:answerParm,
            dataType:'json',
            success:function (data) {
                var statucode = data.root.code;
                if (statucode === '100') {
                    flashvalstr = 0;
                    sureStatu();
                    $('.ques_panel_js').hide();
                    if (lanCount === 8) {
                        var lastPointstr = data.root.lastPoint;
                        lastSumShow(lastPointstr.trim());
                    }else {
                        $signTipPanel.css('top','14rem');
                        showSignTip('提交成功！');
                        $blackPanel.hide();
                    }
                } else {
                    var tipstr = data.root.message;
                    alert(tipstr);
                }
            },
            error : function () {
                $signTipPanel.css('top','14rem');
                showSignTip('问题回答有误！');
            }
        });
    });
// ------------优惠卷
    // 关闭优惠卷
    $('.qBox_close_js').on('click', function () {
        $blackPanel.hide();
        $('.qBox').hide();
    });
// ------------音乐
    // 点击音乐图标
    var isplayAudio = true;
    $('.muic_span span').on('click', function () {
        $(this).find('img').toggleClass('anmaine');
        if (isplayAudio) {
            lightMusicAudio.pause();
            isplayAudio = false;
        } else {
            lightMusicAudio.play();
            isplayAudio = true;
        }
    });

});
