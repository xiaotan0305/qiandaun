/*
* @Author: zhaotianliang@fang.com
* @Date:   2016-12-15
* @Last Modified time: 2016-12-21
*/

$(document).ready(function () {
    'use strict';
    // 获取每一页
    var page1 = $('.page1'),
        page2 = $('.page2'),
        page3 = $('.page3'),
        page4 = $('.page4'),
        page5 = $('.page5'),
        page6 = $('.page6'),
        page7 = $('.page7'),
        page8 = $('.page8'),
        // 点击许可证  值为false时可点击
        bReady = false;
    // 获取二页三页的文字
    var zzt2 = $('.page2').find('p').find('img,span'),
        zzt3 = $('.page3').find('p').find('img,span');
    // 第4页canvas数据
    var data4 = [
        {
            value: 48.5,
            color:'#ee5841'
        },
        {
            value : 1 ,
            color : '#41bedc'
        },
        {
            value : 4 ,
            color : '#bb73e4'
        },
        {
            value : 6.5,
            color : '#7381e4'
        },
        {
            value : 17,
            color : '#edd535'
        },
        {
            value : 23,
            color : '#0ed687'
        }

    ];
    // 第五页canvas数据
    var data5 = [
        {
            value: 40,
            color:'#ee5840'
        },
        {
            value : 11.3 ,
            color : '#0cd587'
        },
        {
            value : 26.2,
            color : '#edd533'
        },
        {
            value : 22.5,
            color : '#41bedc'
        }

    ];
    // 第7页上部分canvas数据
    var data71 = [
        {
            value: 47,
            color: '#ec5942'
        },
        {
            value : 2,
            color : '#43beda'
        },
        {
            value : 7,
            color : '#7381e4'
        },
        {
            value : 10,
            color : '#fde11d'
        },
        {
            value : 34,
            color : '#10d587'
        }
    ];
    // 第7页下部分canvas数据
    var data72 = [
        {
            value: 31,
            color: '#ec5942'
        },
        {
            value : 4,
            color : '#43beda'
        },
        {
            value : 13,
            color : '#7381e4'
        },
        {
            value : 28,
            color : '#fde11d'
        },
        {
            value : 23,
            color : '#10d587'
        }

    ];

    // 第六页随机显示
    function autoShow(id) {
        setTimeout(function () {
            $('#' + id).css({display: 'block'});
        },(Math.random()*1500+600));
    }

    // 自动设置方块的高度
    function autoHeight(id,maxHeight,delayTime){
        setTimeout(function () {
            var num=0;
            var timer1 = setInterval(fn,20);
            function fn() {
                num +=0.1;
                $('#' + id).css({height: num+'rem'});
                if(num> maxHeight) {
                    clearInterval(timer1);
                }
            }
        },delayTime);
    }

    // 翻页
    function rotateY(obj) {
        if(bReady)return;
        bReady = true;
        obj.css({
            WebkitTransition: '1s all ease',
            transition:'1s all ease',
            WebkitTransform: 'perspective(800px) rotateY(-180deg)',
            transform: 'perspective(20rem) rotateY(-180deg)'
        });
    }

    // 回翻
    function rotateYBack(obj) {
        if(bReady)return;
        bReady = true;
        obj.css({
            WebkitTransition: '1s all ease',
            transition:'1s all ease',
            WebkitTransform: 'perspective(800px) rotateY(0deg)',
            Transform: 'perspective(800px) rotateY(0deg)'
        });
    }

    // 滑动第一页时
    page1.on('touchstart', function (event) {
        if(bReady)return;
        event.preventDefault();
        var startX1 = event.originalEvent.targetTouches[0].pageX;
        page1.on('touchend', function (event) {
            if(bReady)return;
            var endX1 = event.originalEvent.changedTouches[0].pageX;
            var disX1 = endX1 - startX1;
            if (disX1 >= -80) {
                return;
            }else if (disX1 < -80) {
                bReady = true;
                // 封面图片停止晃动并放大
                page1.find('img').css({
                    animation: 'stop 1s 1',
                    WebkitAnimation: 'stop 1s 1',
                    transition: '1s all ease',
                    WebkitTransition: '1s all ease',
                    transform: 'scale(1.3)',
                    WebkitTransform: 'scale(1.3)'
                });
                // 放大结束后翻页
                page1.find('img').off('animationend webkitAnimationEnd').on('animationend webkitAnimationEnd', function () {
                    page1.css({
                        transition: '1s all ease',
                        WebkitTransition: '1s all ease',
                        transform: 'perspective(800px) rotateY(-180deg)',
                        WebkitTransform: 'perspective(800px) rotateY(-180deg)'
                    });
                    autoHeight('z1',7.4,400);
                    autoHeight('z2',6.15,800);
                    autoHeight('z3',5.8,1200);
                    autoHeight('z4',4.35,1600);
                    autoHeight('z5',3.575,2000);
                    autoHeight('z6',2.5,2400);
                    zzt2.css({
                        WebkitAnimation: 'fadeIn linear 3s alternate',
                        animation: 'fadeIn linear 3s alternate',
                        display: 'block'
                    });
                    var timera;
                    clearTimeout(timera);
                    timera = setTimeout(function () {
                        bReady = false;
                    },3000);

                });
            }
        });
    });

    // 滑动第二页时
    page2.on('touchstart', function (event) {
        if(bReady)return;
        event.preventDefault();
        var startX2 = event.originalEvent.targetTouches[0].pageX;
        function endPage2(event) {
            var endX2 = event.originalEvent.changedTouches[0].pageX;
            var disX2 = endX2 - startX2;
            if (disX2 < -80) {
                if (status && false) {
                    rotateY($(this));
                }else {
                    rotateY($(this));
                    page2.off('webkitTransitionEnd transitionEnd').on('webkitTransitionEnd transitionEnd', function () {
                        autoHeight('z7', 7.4, 0);
                        autoHeight('z8', 1.65, 400);
                        autoHeight('z9', 1.175, 800);
                        autoHeight('z10', 0.425, 1200);
                        autoHeight('z11', 0.225, 1500);
                        zzt3.css({
                            WebkitAnimation: 'fadeIn linear 2s alternate',
                            animation: 'fadeIn linear 2s alternate',
                            display: 'block'
                        });
                        var timerb;
                        clearTimeout(timerb);
                        timerb = setTimeout(function () {
                            bReady = false;
                            page2.find('p').css({height: '0rem'});
                            page2.find('p').children().css({display: 'none'});
                        }, 2000);
                    });
                }
            }else {
                return;
            }
            page2.off('touchend', endPage2);
        }
        page2.on('touchend', endPage2);
    });

    // 滑动第三页时
    page3.on('touchstart', function (event) {
        if(bReady)return;
        event.preventDefault();
        var startX3 = event.originalEvent.targetTouches[0].pageX;
        function endPage3(event) {
            var endX3 = event.originalEvent.changedTouches[0].pageX;
            var disX3 = endX3 - startX3;
            if (disX3 < -80) {
                rotateY($(this));
                page3.off('webkitTransitionEnd transitionend').on('webkitTransitionEnd transitionend', function () {
                    page4.find('canvas').css({display: 'block'});
                    var p4 = $('#p4')[0].getContext('2d');
                    window.myDoughnut3 = new Chart(p4).Pie(data4, {segmentStrokeWidth : 0});
                    page4.find('.p4_num').css({
                        WebkitAnimation: 'fadeIn linear 2s alternate',
                        animation: 'fadeIn linear 2s alternate',
                        display:'block'
                    });
                    var timerc;
                    clearTimeout(timerc);
                    timerc = setTimeout(function () {
                        bReady = false;
                        page3.find('p').css({height: '0rem'});
                        page3.find('p').children().css({display: 'none'});
                    },2000);
                });
            }else if (disX3 > 80) {
                rotateYBack(page2);
                page2.off('webkitTransitionEnd transitionend').on('webkitTransitionEnd transitionend', function () {
                    autoHeight('z1',7.4,400);
                    autoHeight('z2',6.15,800);
                    autoHeight('z3',5.8,1200);
                    autoHeight('z4',4.35,1600);
                    autoHeight('z5',3.575,2000);
                    autoHeight('z6',2.5,2400);
                    zzt2.css({
                        WebkitAnimation: 'fadeIn linear 3s alternate',
                        animation: 'fadeIn linear 3s alternate',
                        display: 'block'
                    });
                    var timera;
                    clearTimeout(timera);
                    timera = setTimeout(function () {
                        bReady = false;
                        page3.find('p').css({height: '0rem'});
                        page3.find('p').children().css({display: 'none'});
                    },2500);
                });
            }else {
                return;
            }
            page3.off('touchend', endPage3);
        }
        page3.on('touchend', endPage3);
    });
    // 滑动第四页时
    page4.on('touchstart', function (event) {
        if(bReady)return;
        event.preventDefault();
        var startX4 = event.originalEvent.targetTouches[0].pageX;
        page4.on('touchend', function (event) {
            var endX4 = event.originalEvent.changedTouches[0].pageX;
            var disX4 = endX4 - startX4;
            if (disX4 < -80) {
                rotateY($(this));
                page4.off('webkitTransitionEnd transitionend').on('webkitTransitionEnd transitionend', function () {
                    page5.find('canvas').css({display: 'block'});
                    var p5 = $('#p5')[0].getContext('2d');
                    window.myDoughnut3 = new Chart(p5).Doughnut(data5, {segmentStrokeWidth : 0});
                    page5.find('.p4_num').css({
                        WebkitAnimation: 'fadeIn linear 2s alternate',
                        animation: 'fadeIn linear 2s alternate',
                        display:'block'
                    });
                    var timer4n;
                    clearTimeout(timer4n);
                    timer4n = setTimeout(function () {
                        page4.find('canvas').css({display: 'none'});
                        page4.find('.p4_num').css({display: 'none'});
                        bReady = false;
                    },2300);
                });
            }else if (disX4 > 80) {
                rotateYBack(page3);
                page3.off('webkitTransitionEnd transitionend').on('webkitTransitionEnd transitionend', function () {
                    autoHeight('z7', 7.4, 0);
                    autoHeight('z8', 1.65, 400);
                    autoHeight('z9', 1.175, 800);
                    autoHeight('z10', 0.425, 1200);
                    autoHeight('z11', 0.225, 1500);
                    zzt3.css({
                        WebkitAnimation: 'fadeIn linear 2s alternate',
                        animation: 'fadeIn linear 2s alternate',
                        display: 'block'
                    });
                    var timer4p;
                    clearTimeout(timer4p);
                    timer4p = setTimeout(function () {
                        bReady = false;
                        page4.find('canvas').css({display: 'none'});
                        page4.find('.p4_num').css({display: 'none'});
                    },2500);
                });
            }else {
                return;
            }

        });
    });

    // 滑动第5页时
    page5.on('touchstart', function (event) {
        if(bReady)return;
        event.preventDefault();
        var startX5 = event.originalEvent.targetTouches[0].pageX;
        page5.on('touchend', function (event) {
            var endX5 = event.originalEvent.changedTouches[0].pageX;
            var disX5 = endX5 - startX5;
            if (disX5 < -80) {
                rotateY($(this));
                $(this).off('webkitTransitionEnd transitionend').on('webkitTransitionEnd transitionend', function () {
                    autoShow('p6_n1');
                    autoShow('p6_n2');
                    autoShow('p6_n3');
                    autoShow('p6_n4');
                    autoShow('p6_n5');
                    autoShow('p6_n6');
                    autoShow('p6_n7');
                    autoShow('p6_n8');
                    var timere;
                    clearTimeout(timere);
                    timere = setTimeout(function () {
                        bReady = false;
                        page5.find('canvas').css({display: 'none'});
                        page5.find('.p4_num').css({display: 'none'});
                    },2000);
                });
            }else if (disX5 > 80) {
                rotateYBack(page4);
                page4.off('webkitTransitionEnd transitionend').on('webkitTransitionEnd transitionend', function () {
                    page4.find('canvas').css({display: 'block'});
                    var p4 = $('#p4')[0].getContext('2d');
                    window.myDoughnut3 = new Chart(p4).Pie(data4, {segmentStrokeWidth : 0});
                    page4.find('.p4_num').css({
                        WebkitAnimation: 'fadeIn linear 2s alternate',
                        animation: 'fadeIn linear 2s alternate',
                        display:'block'
                    });
                    var timerc;
                    clearTimeout(timerc);
                    timerc = setTimeout(function () {
                        bReady = false;
                        page5.find('canvas').css({display: 'none'});
                        page5.find('.p4_num').css({display: 'none'});
                    },2000);
                });
            }
        });
    });

    // 滑动第6页时
    page6.on('touchstart', function (event) {
        if(bReady)return;
        event.preventDefault();
        var startX6 = event.originalEvent.targetTouches[0].pageX;
        page6.on('touchend', function (event) {
            var endX6 = event.originalEvent.changedTouches[0].pageX;
            var disX6 = endX6 - startX6;
            if (disX6 < -80) {
                rotateY($(this));
                $(this).off('webkitTransitionEnd transitionend').on('webkitTransitionEnd transitionend', function () {
                    page7.find('canvas').css({display: 'block'});
                    page7.find('.p7_bp').css({display: 'block'});
                    var p71 = $('#p71')[0].getContext('2d');
                    var p72 = $('#p72')[0].getContext('2d');
                    window.myDoughnut3 = new Chart(p71).Doughnut(data71, {segmentStrokeWidth : 0});
                    window.myDoughnut3 = new Chart(p72).Doughnut(data72, {segmentStrokeWidth : 0});
                    page7.find('.p7_img4,.p7_img5').css({
                        WebkitAnimation: 'fadeIn linear 2s alternate',
                        animation: 'fadeIn linear 2s alternate',
                        display:'block'
                    });
                    var timerf;
                    clearTimeout(timerf);
                    timerf = setTimeout(function () {
                        bReady = false;
                        page6.find('.p6n').css({display: 'none'});
                    },2500);
                });
            }else if (disX6 > 80) {
                rotateYBack(page5);
                page5.off('webkitTransitionEnd transitionend').on('webkitTransitionEnd transitionend', function () {
                    page5.find('canvas').css({display: 'block'});
                    var p5 = $('#p5')[0].getContext('2d');
                    window.myDoughnut3 = new Chart(p5).Doughnut(data5, {segmentStrokeWidth : 0});
                    page5.find('.p4_num').css({
                        WebkitAnimation: 'fadeIn linear 2s alternate',
                        animation: 'fadeIn linear 2s alternate',
                        display:'block'
                    });
                    var timer4n;
                    clearTimeout(timer4n);
                    timer4n = setTimeout(function () {
                        page6.find('.p6n').css({display: 'none'});
                        bReady = false;
                    },2300);
                });
            }

        });
    });

    // 滑动第7页时
    page7.on('touchstart', function (event) {
        if(bReady)return;
        event.preventDefault();
        var startX7 = event.originalEvent.targetTouches[0].pageX;
        page7.on('touchend', function (event) {
            var endX7 = event.originalEvent.changedTouches[0].pageX;
            var disX7 = endX7 - startX7;
            if (disX7 < -80) {
                rotateY($(this));
                $(this).off('webkitTransitionEnd transitionend').on('webkitTransitionEnd transitionend', function () {
                    $('.p8_p1').css({
                        WebkitAnimation: 'fadeIn linear  alternate',
                        animation: 'fadeIn linear  alternate',
                        display: 'block'
                    });
                    $('.p8_p2').css({
                        WebkitAnimation: 'fadeIn linear 1s alternate',
                        animation: 'fadeIn linear 1s alternate',
                        display: 'block'
                    });
                    $('.p8_p3').css({
                        WebkitAnimation: 'fadeIn linear 2s alternate',
                        animation: 'fadeIn linear 2s alternate',
                        display: 'block'
                    });
                    $('.p8_p4').css({
                        WebkitAnimation: 'fadeIn linear 3s alternate',
                        animation: 'fadeIn linear 3s alternate',
                        display: 'block'
                    });
                    $('.p8_p4').off('animationend webkitAnimationEnd').on('animationend webkitAnimationEnd', function () {
                        bReady = false;
                        page7.find('canvas').css({display: 'none'});
                        page7.find('.p7_bp').css({display: 'none'});
                    });
                });
            }else if (disX7 > 80) {
                rotateYBack(page6);
                page6.off('webkitTransitionEnd transitionend').on('webkitTransitionEnd transitionend', function () {
                    autoShow('p6_n1');
                    autoShow('p6_n2');
                    autoShow('p6_n3');
                    autoShow('p6_n4');
                    autoShow('p6_n5');
                    autoShow('p6_n6');
                    autoShow('p6_n7');
                    autoShow('p6_n8');
                    var timere;
                    clearTimeout(timere);
                    timere = setTimeout(function () {
                        bReady = false;
                        page7.find('canvas').css({display: 'none'});
                        page7.find('.p7_bp').css({display: 'none'});
                    },2000);
                });
            }

        });
    });
    page8.on('touchstart', function (event) {
        if(bReady)return;
        var startX8 = event.originalEvent.targetTouches[0].pageX;
        page8.on('touchend', function (event) {
            var endX8 = event.originalEvent.changedTouches[0].pageX;
            var disX8 = endX8 - startX8;
            if (disX8 > 80) {
                rotateYBack(page7);
                page7.off('webkitTransitionEnd transitionend').on('webkitTransitionEnd transitionend', function () {
                    page7.find('canvas').css({display: 'block'});
                    page7.find('.p7_bp').css({display: 'block'});
                    var p71 = $('#p71')[0].getContext('2d');
                    var p72 = $('#p72')[0].getContext('2d');
                    window.myDoughnut3 = new Chart(p71).Doughnut(data71, {segmentStrokeWidth : 0});
                    window.myDoughnut3 = new Chart(p72).Doughnut(data72, {segmentStrokeWidth : 0});
                    page7.find('.p7_img4,.p7_img5').css({
                        WebkitAnimation: 'fadeIn linear 2s alternate',
                        animation: 'fadeIn linear 2s alternate',
                        display:'block'
                    });
                    var timerf;
                    clearTimeout(timerf);
                    timerf = setTimeout(function () {
                        bReady = false;
                        page8.find('.p8_pz').css({display: 'none'});
                    },2500);
                });
            }
        });
    });
    var weixin = new Weixin({
        shareTitle: '一本神秘小黄书',
        descContent: '一些你不知道的神秘数据',
        lineLink: location.href,
        imgUrl: location.protocol + '//static.test.soufunimg.com/common_m/m_activity/yellowBook/images/share.jpg',
        swapTitle: true
    });
});