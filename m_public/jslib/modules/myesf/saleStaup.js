define('modules/myesf/saleStaup', ['chart/line/1.0.4/line'], function (require, exports, module) {
    'use strict';
    // 获取隐藏域数据
    var vars = seajs.data.vars;
    var Line = require('chart/line/1.0.4/line');
    // 引入用户行为统计
    if (vars.action !== 'delegateAndResale' && vars.action !== 'editDelegate' && vars.action !== 'myDaiKanRecord') {
        require.async('modules/esf/yhxw', function (yhxw) {
            yhxw({type: 0, pageId: 'esf_fy^fbyd_wap', curChannel: 'myesf'});
        })
    }
    (function (doc, win) {
        var docEl = doc.documentElement,
            resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
            recalc = function () {
                var clientWidth = docEl.clientWidth;
                if (!clientWidth) return;
                docEl.style.fontSize = 20 * (clientWidth / 320) + 'px';
                if (clientWidth >= 640) {
                    docEl.style.fontSize = 40 + 'px';
                }
            };

        if (!doc.addEventListener) return;
        recalc();
        win.addEventListener(resizeEvt, recalc, false);
        doc.addEventListener('DOMContentLoaded', recalc, false);
    })(document, window);
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        $('input[type=hidden]').each(function (index, element) {
            vars[$(this).attr('data-id')] = element.value;
        });
    };

    // 页面向上滚动筛选栏固顶向下滚动加筛选栏隐藏
    $(window).on('scroll', function (e) {
        var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
        if (scrollTop > 125) {
            $('.floatBtnBox').css('position', 'fixed');
        } else {
            $('.floatBtnBox').css('position', 'static');
        }
        e.stopPropagation();
    });
    //未登录情况下，或者没有委托房源的情况下，画城市走势图
    if (vars.cityJsDealData) {
        require.async(['chart/line/1.0.4/line'], function (Line) {
            var dataZ = JSON.parse(vars.cityJsDealData);
            if (dataZ && dataZ.citydata) {
                var cityChart, cdataArr = [];
                if (dataZ.citydata && dataZ.citydata.price) {
                    cityChart = {
                        yAxis: dataZ.citydata.price,
                        forecast: false
                    };
                    cdataArr.push(cityChart);
                }
                // 画走势图
                var l = new Line({
                    id: '#chartCon',
                    height: 200,
                    border: 50,
                    alertDom: $('#trend'),
                    width: $(document).width() - 50,
                    lineColor: ['#ff7070', '#ffae71', '#68c9bf'],
                    xAxis: dataZ.monthnum,
                    data: cdataArr
                });
                l.run();
            }
        });
    }
    //登陆情况下画图1
    if (vars.referPrice1) {
        var dataZ1 = JSON.parse(vars.referPrice1);
        if (dataZ1) {
            require.async(['chart/line/1.0.4/line'], function (Line) {
                if (dataZ1 && dataZ1.projdata && dataZ1.disdata && dataZ1.citydata) {
                    var xqcodeChart, disChart, cityChart, cdataArr = [];
                    // 针对某些城市数据不全的情况做兼容如果某类数据不存在，则不显示
                    if (dataZ1.projdata && dataZ1.projdata.price) {
                        xqcodeChart = {
                            yAxis: dataZ1.projdata.price,
                            forecast: false
                        };
                        cdataArr.push(xqcodeChart);
                    }
                    if (dataZ1.disdata && dataZ1.disdata.price) {
                        disChart = {
                            yAxis: dataZ1.disdata.price,
                            forecast: false
                        };
                        cdataArr.push(disChart);
                    }
                    if (dataZ1.citydata && dataZ1.citydata.price) {
                        cityChart = {
                            yAxis: dataZ1.citydata.price,
                            forecast: false
                        };
                        cdataArr.push(cityChart);
                    }
                    // 画走势图
                    var l = new Line({
                        id: '#chartCon1',
                        height: 200,
                        border: 50,
                        alertDom: $('#trend1'),
                        width: $(document).width() - 50,
                        lineColor: ['#FF9B05', '#00AC63', '#B3B6BE'],
                        xAxis: dataZ1.monthnum,
                        data: cdataArr
                    });
                    l.run();
                }
            });
        } else {
            $('.qushi1').hide();
        }
    }

    // 画图2
    if (vars.referPrice2) {
        var dataZ2 = JSON.parse(vars.referPrice2);
        if (dataZ2) {
            require.async(['chart/line/1.0.4/line'], function (Line) {
                if (dataZ2 && dataZ2.projdata && dataZ2.disdata && dataZ2.citydata) {
                    var xqcodeChart, disChart, cityChart, cdataArr = [];
                    // 针对某些城市数据不全的情况做兼容如果某类数据不存在，则不显示
                    if (dataZ2.projdata && dataZ2.projdata.price) {
                        xqcodeChart = {
                            yAxis: dataZ2.projdata.price,
                            forecast: false
                        };
                        cdataArr.push(xqcodeChart);
                    }
                    if (dataZ2.disdata && dataZ2.disdata.price) {
                        disChart = {
                            yAxis: dataZ2.disdata.price,
                            forecast: false
                        };
                        cdataArr.push(disChart);
                    }
                    if (dataZ2.citydata && dataZ2.citydata.price) {
                        cityChart = {
                            yAxis: dataZ2.citydata.price,
                            forecast: false
                        };
                        cdataArr.push(cityChart);
                    }
                    // 画走势图
                    var l = new Line({
                        id: '#chartCon2',
                        height: 200,
                        border: 50,
                        alertDom: $('#trend2'),
                        width: $(document).width() - 50,
                        lineColor: ['#FF9B05', '#00AC63', '#B3B6BE'],
                        xAxis: dataZ2.monthnum,
                        data: cdataArr
                    });
                    l.run();
                }
            });
        } else {
            $('.qushi2').hide();
        }
    }
    if (vars.referPrice3) {
        //画图
        var dataZ3 = JSON.parse(vars.referPrice3);
        if (dataZ3) {
            require.async(['chart/line/1.0.4/line'], function (Line) {
                if (dataZ3 && dataZ3.projdata && dataZ3.disdata && dataZ3.citydata) {
                    var xqcodeChart, disChart, cityChart, cdataArr = [];
                    // 针对某些城市数据不全的情况做兼容如果某类数据不存在，则不显示
                    if (dataZ3.projdata && dataZ3.projdata.price) {
                        xqcodeChart = {
                            yAxis: dataZ3.projdata.price,
                            forecast: false
                        };
                        cdataArr.push(xqcodeChart);
                    }
                    if (dataZ3.disdata && dataZ3.disdata.price) {
                        disChart = {
                            yAxis: dataZ3.disdata.price,
                            forecast: false
                        };
                        cdataArr.push(disChart);
                    }
                    if (dataZ3.citydata && dataZ3.citydata.price) {
                        cityChart = {
                            yAxis: dataZ3.citydata.price,
                            forecast: false
                        };
                        cdataArr.push(cityChart);
                    }
                    // 画走势图
                    var l = new Line({
                        id: '#chartCon3',
                        height: 200,
                        border: 50,
                        alertDom: $('#trend3'),
                        width: $(document).width() - 50,
                        lineColor: ['#FF9B05', '#00AC63', '#B3B6BE'],
                        xAxis: dataZ3.monthnum,
                        data: cdataArr
                    });
                    l.run();
                }
            });
        } else {
            $('.qushi3').hide();
        }
    }

    //实现横切效果
    var startX;
    $(".page").on("touchstart", function(e) {
        touchStart(e);
    });
    $(".page").on("touchend", function(e) {
        var event = event || window.event;
        touchEnd(e, $(this));
    });
    function touchStart(e) {
        // 判断默认行为是否可以被禁用
        if (e.cancelable) {
            // 判断默认行为是否已经被禁用
            if (!e.defaultPrevented) {
                e.preventDefault();
            }
        }
        startX = e.originalEvent.changedTouches[0].pageX;
    }
    function touchEnd(e, that) {
        var moveEndX = e.originalEvent.changedTouches[0].pageX,
            X = moveEndX - startX,
            parentid = parseInt(that.parent().attr('id'));

        if ( X > 30) {
            if ($("#" + (parentid - 1)).length > 0) {
                that.parent().hide();
                that.parent().prev().show();
            }
        } else if ( X < -30) {
            if ($("#" + (parentid + 1)).length > 0) {
                that.parent().hide();
                that.parent().next().show();
            }
        //点击跳转
        } else if (X < 5 && X > -5) {
            var url = that.attr('href');
            if (url) {
                window.location = url;
                return false;
            }
        }
    }
});