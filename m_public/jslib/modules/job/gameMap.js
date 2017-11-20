/**
 * Created by hanxiao on 2017/10/12.
 */
define('modules/job/gameMap', ['jquery'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        // 页面传入的数据
        var vars = seajs.data.vars;
        // 产生一个随机数组 1-10,为了随机从10道题选五个填充后面的五个房子
        var arr=[];
        for(var i=1;i<11;i++){
            arr[i]=i;
        }
        arr.sort(function(){
            return 0.5 - Math.random();
        });
        // 点房子出问题
        $('.fang').on('click', function(){
            var that = $(this);
            if (that.hasClass('no1')) {
                $('#problemNo1').show();
            } else if (that.hasClass('no2')) {
                $('#problemNo2').show();
            } else if (that.hasClass('no3')) {
                $('#problemNo3').show();
            } else if (that.hasClass('no4')) {
                $('#problemNo4').show();
            } else if (that.hasClass('no5')) {
                $('#problemNo5').show();
            } else if (that.hasClass('no6')) {
                $('#problemNo6').show();
            } else if (that.hasClass('no7')) {
                $('#problemNo7').show();
            } else if (that.hasClass('no8')) {
                $('#problemNo8').show();
            } else if (that.hasClass('no9')) {
                $('#problemNo9').show();
            } else if (that.hasClass('no10')) {
                $('#problemNo10').show();
            } else if (that.hasClass('no11')) {
                $('#problemNo' + arr[0]).show();
            } else if (that.hasClass('no12')) {
                $('#problemNo' + arr[1]).show();
            } else if (that.hasClass('no13')) {
                $('#problemNo' + arr[2]).show();
            } else if (that.hasClass('no14')) {
                $('#problemNo' + arr[3]).show();
            } else if (that.hasClass('no15')) {
                $('#problemNo' + arr[4]).show();
            }
            that.hide();
        });
        // 回答总数
        var total = 0;
        // 回答正确次数
        var rightTotal = 0;
        // 设置正确答案数组
        var rightAnswer = new Array();
        rightAnswer[0] = '超牛的一家互联网公司';
        rightAnswer[1] = '1999年';
        rightAnswer[2] = '纽交所';
        rightAnswer[3] = '2010年';
        rightAnswer[4] = '红色';
        rightAnswer[5] = '9号线郭公庄站';
        rightAnswer[6] = '8个';
        rightAnswer[7] = '清华大学';
        rightAnswer[8] = '复旦大学';
        rightAnswer[9] = '四川大学';
        // 防止在弹层消失过程中重复点击
        var clickFlag = 0;
        $('.ask').on('click', function(){
            if (clickFlag === 0) {
                var flag = false;
                var that1 = $(this);
                var words = that1.text();
                that1.prev().removeClass('ra1');
                that1.prev().addClass('ra2');
                // 判断所选答案在不在正确答案数组中
                for (var j = 0; j < 10; j++) {
                    if (rightAnswer[j] === words) {
                        flag = true;
                        break;
                    }
                }
                // 回答正确/回答错误加上标志
                if (flag) {
                    that1.after('<b class="v"></b>');
                    // 答对次数+1
                    rightTotal++;
                } else {
                    that1.after('<b class="x"></b>');
                }
                //答题总数+1
                total++;
                // 点击标志1-此时点击失效
                clickFlag = 1;
                setTimeout(function(){
                    that1.parent().parent().parent().hide();
                    that1.next().remove();
                    that1.prev().removeClass('ra2');
                    that1.prev().addClass('ra1');
                    // 点击标志0，此时点击事件生效
                    clickFlag = 0;
                    if (total === 15 && rightTotal < 5) {
                        $('#fallDiv').show();
                    }
                    if (rightTotal >= 5) {
                        $('#sucDiv').show();
                        setTimeout(function(){
                            window.location.href = vars.jobSite + '?c=job&a=successChallenage';
                        }, 2000);
                    }
                }, 1000);
            }
        });
        $('.close').on('click', function(){
            $(this).parent().parent().hide();
        });
        // 音乐按钮
        var mflag = true;
        var audio = $('#J_BgAudio')[0];
        $('.music').on('click',function(){
            if (mflag) {
                $(this).removeClass('rotate');
                audio.pause();
                mflag = false;
            } else {
                $(this).addClass('rotate');
                audio.play();
                mflag = true;
            }
        })

    }
});