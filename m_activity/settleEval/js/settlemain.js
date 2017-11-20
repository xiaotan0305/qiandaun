/**
 * @Author: chenshaoshan
 * @Date:   2015/12/29
 * @description: 积分落户评估活动
 * @Last Modified by:   chenshaoshan
 * @Last Modified time:
 */
$(function () {
    'use strict';
    var tempGrade = 0;

    var $quesShow1 = $('.ques1_show_js');
    var $quesUl1 = $('.ques1_ul_js');
    //  --------连续缴纳社保满---年------------
    var quesScore1 = 0;
    $quesShow1.on('click', function () {
        $quesUl1.show();
    });
    $quesUl1.find('li').on('click', function () {
        setTimeout(function () {
            $quesUl1.hide();
        },100);
        tempGrade = $(this).html();
        $quesShow1.html(tempGrade);
        quesScore1 = evalScoreSing(tempGrade, 3);
    });

//    ------------------------
    var $quesShow21 = $('.ques2_show1_js');
    var $quesUl21 = $('.ques2_ul1_js');
    var $quesShow22 = $('.ques2_show2_js');
    var $quesUl22 = $('.ques2_ul2_js');
    //  ---------自由产权房连续居住满---年-----------
    var quesScore21 = 0;
    $quesShow21.on('click', function () {
        $quesUl21.show();
    });
    $quesUl21.find('li').on('click', function () {
        setTimeout(function () {
            $quesUl21.hide();
        },100);
        tempGrade = $(this).html();
        $quesShow21.html(tempGrade);
        quesScore21 = evalScoreSing(tempGrade, 1);
    });

    //  ---------自由产权房连续居住满---年-----------
    var quesScore22 = 0;
    $quesShow22.on('click', function () {
        $quesUl22.show();
    });
    $quesUl22.find('li').on('click', function () {
        setTimeout(function () {
            $quesUl22.hide();
        },100);
        tempGrade = $(this).html();
        $quesShow22.html(tempGrade);
        quesScore22 = evalScoreSing(tempGrade, 0.5);

    });

//    ------------------------
    var $quesShow31 = $('.ques3_show1_js');
    var $quesUl31 = $('.ques3_ul1_js');
    var $quesShow32 = $('.ques3_show2_js');
    var $quesUl32 = $('.ques3_ul2_js');
    var $quesShow33 = $('.ques3_show3_js');
    var $quesUl33 = $('.ques3_ul3_js');
    //  --------最高学历------------
    var quesScore31 = 0;
    $quesShow31.on('click', function () {
        $quesUl31.show();
    });
    $quesUl31.find('li').on('click', function () {
        setTimeout(function () {
            $quesUl31.hide();
        },100);
        $quesShow31.html($(this).html());
        tempGrade = $(this).attr('enname');
        quesScore31 = evalScoreSing(tempGrade, 1);

    });

    //  --------其他硕士学位数------------
    var quesScore32 = 0;
    $quesShow32.on('click', function () {
        $quesUl32.show();
    });
    $quesUl32.find('li').on('click', function () {
        setTimeout(function () {
            $quesUl32.hide();
        },100);
        tempGrade = $(this).html();
        $quesShow32.html(tempGrade);
        quesScore32 = evalScoreSing(tempGrade, 3);

    });

    //  --------其他博士学位数------------
    var quesScore33 = 0;
    $quesShow33.on('click', function () {
        $quesUl33.show();
    });
    $quesUl33.find('li').on('click', function () {
        setTimeout(function () {
            $quesUl33.hide();
        },100);
        tempGrade = $(this).html();
        $quesShow33.html(tempGrade);
        quesScore33 = evalScoreSing(tempGrade, 6);

    });

//    ------------------------
    var $quesShow41 = $('.ques4_show1_js');
    var $quesUl41 = $('.ques4_ul1_js');
    var $quesShow42 = $('.ques4_show2_js');
    var $quesUl42 = $('.ques4_ul2_js');
    var $quesShow43 = $('.ques4_show3_js');
    var $quesUl43 = $('.ques4_ul3_js');
    var $quesShow44 = $('.ques4_show4_js');
    var $quesUl44 = $('.ques4_ul4_js');
    var $quesShow45 = $('.ques4_show5_js');
    var $quesUl45 = $('.ques4_ul5_js');
    //  --------经认定的创业企业工作满------------
    var quesScore41 = 0;
    $quesShow41.on('click', function () {
        $quesUl41.show();
    });
    $quesUl41.find('li').on('click', function () {
        setTimeout(function () {
            $quesUl41.hide();
        },100);
        tempGrade = $(this).html();
        $quesShow41.html(tempGrade);
        evalScore41(tempGrade);

    });
    function evalScore41(temp) {
        quesScore41 = 2 * temp;
        if (quesScore41 > 6) {
            quesScore41 = 6;
        }
    }
    //  --------经认定的服务机构工作满------------
    var quesScore42 = 0;
    $quesShow42.on('click', function () {
        $quesUl42.show();
    });
    $quesUl42.find('li').on('click', function () {
        setTimeout(function () {
            $quesUl42.hide();
        },100);
        tempGrade = $(this).html();
        $quesShow42.html(tempGrade);
        evalScore42(tempGrade);

    });
    function evalScore42(temp) {
        quesScore42 = 1 * temp;
        if (quesScore42 > 3) {
            quesScore42 = 3;
        }
    }
    //  --------高新技术企业工作满------------
    var quesScore43 = 0;
    $quesShow43.on('click', function () {
        $quesUl43.show();
    });
    $quesUl43.find('li').on('click', function () {
        setTimeout(function () {
            $quesUl43.hide();
        },100);
        tempGrade = $(this).html();
        $quesShow43.html(tempGrade);
        evalScore43(tempGrade);

    });
    function evalScore43(temp) {
        quesScore43 = 1 * temp;
        if (quesScore43 > 3) {
            quesScore43 = 3;
        }
    }
    //  --------创业大赛获国家奖项------------
    var quesScore44 = 0;
    $quesShow44.on('click', function () {
        $quesUl44.show();
    });
    $quesUl44.find('li').on('click', function () {
        setTimeout(function () {
            $quesUl44.hide();
        },100);
        $quesShow44.html($(this).html());
        tempGrade = $(this).attr('enname');
        quesScore44 = evalScoreSing(tempGrade, 1);

    });

    //  --------创业大赛获本市奖项------------
    var quesScore45 = 0;
    $quesShow45.on('click', function () {
        $quesUl45.show();
    });
    $quesUl45.find('li').on('click', function () {
        setTimeout(function () {
            $quesUl45.hide();
        },100);
        $quesShow45.html($(this).html());
        tempGrade = $(this).attr('enname');
        quesScore45 = evalScoreSing(tempGrade, 1);

    });

//    ------------------------
    var $quesShow5 = $('.ques5_show_js');
    var $quesUl5 = $('.ques5_ul_js');
    //  --------所获专业技术职务------------
    var quesScore5 = 0;
    $quesShow5.on('click', function () {
        $quesUl5.show();
    });
    $quesUl5.find('li').on('click', function () {
        setTimeout(function () {
            $quesUl5.hide();
        },100);
        $quesShow5.html($(this).html());
        tempGrade = $(this).attr('enname');
        quesScore5 = evalScoreSing(tempGrade, 1);
    });

//    ------------------------
    var $quesShow6 = $('.ques6_show_js');
    var $quesUl6 = $('.ques6_ul_js');
    //  --------所获专业技术职务------------
    var quesScore6 = 0;
    $quesShow6.on('click', function () {
        $quesUl6.show();
    });
    $quesUl6.find('li').on('click', function () {
        setTimeout(function () {
            $quesUl6.hide();
        },100);
        $quesShow6.html($(this).html());
        tempGrade = $(this).attr('enname');
        quesScore6 = evalScoreSing(tempGrade, 1);
    });

    function evalScoreSing(temp,count) {
        return count * temp;

    }
    function evalGrade() {
        if (quesScore31 <= 15) {
            quesScore33 = 0;
            quesScore32 = 0;
        } else if (quesScore31 === 27) {
            quesScore33 = 0;
        }
        if (quesScore44 > 0) {
            quesScore45 = 0;
        }
        var sumScore = quesScore1
            + quesScore21
            + quesScore22
            + quesScore31
            + quesScore32
            + quesScore33
            + quesScore41
            + quesScore42
            + quesScore43
            + quesScore44
            + quesScore45
            + quesScore5
            + quesScore6;
        return sumScore;
    }

    $('#page-6').on('touchend', function () {
        var sumScore = evalGrade();
        $('.score_show_js').html(sumScore);
        if( sumScore >= 90){
            // ${applicationScope.hdftppath}settleEval/images/jflh_07_text2a.png
            $('.text3').css('backgroundImage', 'url(http://js.soufunimg.com/common_m/m_activity/settleEval/images/jflh_07_text2a.png)');
        } else {
            $('.text3').css('backgroundImage', 'url(http://js.soufunimg.com/common_m/m_activity/settleEval/images/jflh_07_text2b.png)');
        }
    });
    $('.btn1').on('click', function () {
        window.location.href = 'http://m.fang.com/fangjia?from=jflh';
    });
    $('.btn2').on('click', function () {
        var ranInt = Math.round(Math.random()*100);
        location.replace('http://' + window.location.host + '/activityshow/settleEval/settleEval.jsp?ran=' + ranInt);
        // window.location.href = 'http://m.test.fang.com/activityshow/settleEval/settleEval.jsp?ran=' + ranInt;
    });
//    ------------------------
// -----------------------------------------------------
})