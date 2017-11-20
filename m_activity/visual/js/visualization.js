/**
 * @file visualizaton 数据可视化
 * @author tankunpeng(tankunpeng@fang.com)
 * @update tankunpeng 2016/12/13
 * @update fenglinzeng 2017/03/02 (暂时移除「房价环比-新房」，添加三端占比)
 */
$(function () {
    'use strict';

    // debug模式
    var ajaxdebug = /(\?|&)ajaxdebug/.test(location.href.toLowerCase());
    var debug = /(\?|&)debug/.test(location.href.toLowerCase());

    /**
     * 屏幕自适应
     */
    $(window).on('resize', function () {
        var w = $(window).width();
        var x = w / 1920;
        $('body').css({
            transformOrigin: '0 0',
            WebkitTransformOrigin: '0 0',
            WebkitTransform: 'scale(' + x + ')',
            MozTransform: 'scale(' + x + ')',
            MsTransform: 'scale(' + x + ')',
            transform: 'scale(' + x + ')'
        });
    });

    /**
     * 判断浏览器类型，非chorme浏览器提示
     */
    var mess = $('#mess'),
        hint = $('#hint');
    navigator.userAgent.toLowerCase().indexOf('msie') !== -1 && mess.show();
    hint.on('click', function () {
        mess.hide();
    });

    /**
     * 获取隐藏域数据
     */
    var vars = {};
    $('input[type=hidden]').each(function (index, element) {
        vars[$(this).attr('id')] = element.value;
    });

    // 热门城市轮询列表(包含访客页面和预约页面)
    var hotCityList = ['北京', '上海', '广州', '深圳', '天津', '重庆', '成都', '武汉', '苏州', '杭州', '南京'];
    var hotcityListLen = hotCityList.length;
    // 城市轮询下标初始化
    var hotcityIndex1 = -1;
    var hotcityIndex2 = -1;
    var hotNum = 0;
    var provinceList = ['北京', '上海', '湖北', '广东', '四川', '天津', '江苏', '重庆',
        '浙江', '陕西', '河南', '湖南', '山东', '河北', '江西', '辽宁', '海南', '福建', '安徽', '广西', '云南',
        '吉林', '山西', '黑龙江', '贵州', '甘肃', '内蒙古', '新疆', '宁夏', '青海', '澳门', '西藏', '香港', '台湾'];
    // var geoCoordMap = window.geoCoordMap;
    var echarts = window.echarts;
    var Swiper = window.Swiper;
    var bisitorsMapChart;
    var bisitorsPCmobileChart;
    var conventionMapChart;

    // 标志城市轮询是否处于等待恢复自动轮询状态
    var replying = false;
    // 标识页码开关
    var pageSwitch = 0;

    // 访客用户点击存储
    var page1CurrentCity = '';
    // 预约用户点击城市纯纯
    var page2CurrentCity = '';

    // 新老访客dom 数据
    var pieInfo = $('.pieInfo'),
        infoNum = pieInfo.find('.infoNum'),
        pieMark = $('.pieMark');

    // 地图相关配置
    var mapOps = {
        // 地图轮询个数
        cityNum: 11,
        topPrintSize: [28, 26, 24, 22, 20, 18],
        bili: [0.001, 0.002, 0.001, 0.001, 0.025, 0.02, 0.025, 0.925],
        biliTotal: [0.001, 0.003, 0.004, 0.005, 0.03, 0.05, 0.075, 1],
        size: [25, 23, 20, 18, 16, 13, 6, 6],
        num: [],
        baseN: 0
    };

    /**
     * ajaxdebug 调试函数
     */
    function ajaxTrace() {
        if (ajaxdebug) {
            console.log([].join.call(arguments, ', '));
        }
    }

    /**
     * debug 调试函数
     */
    function timerTrace() {
        if (debug) {
            var argsArray = Array.prototype.slice.call(arguments);
            var len = argsArray.length;
            var arr = [];
            if (typeof argsArray[len - 1] === 'function') {
                arr = argsArray.slice(0, len - 1);
                console.log([].join.call(arr, ', '));
                argsArray[len - 1]();
            } else {
                console.log([].join.call(argsArray, ', '));
            }
        }
    }

    // 定时器对象
    var timer = {
        // 切屏定时器
        page: null,
        // 第一屏城市切换
        page1map: null,
        page1city: null,
        // 第一屏总数
        page1Num: null,
        // 平台占比
        pcMobile: null,
        // 第二屏城市切换
        page2map: null,
        page2city: null,
        // 第二屏总数
        page2Num: null,
        // 新老访客
        newOld: null,
        // 房价涨幅
        price: null,
        // 标签云数据
        tags: null,
        // 标签云动画
        aniName: 0,
        // 定时刷新
        reload: null,
        // 轮询标识
        relaying: null
    };

    // 切换时间
    var switchTimer = {
        // 切屏
        page: 30000,
        // 今日访客数
        access: 1000,
        // 今日预约数
        conv: 1000,
        // 地图访问间隔
        map1: 60000,
        map2: 60000,
        // 城市切换
        city1: 15000,
        city2: 15000,
        // 小区楼盘切换
        floor: 5000,
        // 平台占比
        pcmobile: 300000,
        // 新老访客
        newOld: 60000,
        // 房价涨幅
        price: 5000,
        // 鼠标恢复时间
        reply: 30000,
        // 标签云
        tags: 600000,
        // 房价涨幅榜
        bar: 5000,
        // 定时刷新页面
        reload: 10800000
    };

    // 管理所有swiper
    var swipers = {
        // 第一屏热门小区
        bisitorsCommunity: null,
        // 第一屏热门楼盘
        bisitorsBuilding: null,
        // 第二屏热门小区
        conventionCommunity: null,
        // 第二屏热门楼盘
        conventionBuilding: null,
        // 第二屏房价涨幅榜
        conventionBar: null,
        conventionBarTitle: null
    };

    // 方法控制器
    var funController = {
        // 首屏地图
        map1Fn: null,
        map1CityFn: null,
        // 第二屏地图
        map2Fn: null,
        map2CityFn: null,
        // 平台占比
        pcMibleFn: null,
        // 首屏展示总数
        page1NumFn: null,
        // 第二屏展示总数
        page2NumFn: null,
        showNewOldFn: null,
        // 热搜词
        showTagFn: null
    };

    // 方法参数控制器
    var opController = {
        map1Num: 0,
        map2Num: 0,
        pcMibleOps: {
            pc: [],
            mobile: []
        },
        showTag: null
    };

    // 翻转效果配置
    var flipOption = {
        effect: 'flip',
        autoplay: switchTimer.floor,
        observer: true,
        observeParents: true,
        speed: 800,
        grabCursor: true,
        autoplayDisableOnInteraction: false
    };

    /**
     * 清除第一屏计时器
     */
    function stopPage1Timer() {
        clearTimeout(timer.page1Num);
        clearTimeout(timer.page1city);
        clearTimeout(timer.pcMobile);
        swipers.bisitorsCommunity && swipers.bisitorsCommunity.stopAutoplay();
        swipers.bisitorsBuilding && swipers.bisitorsBuilding.stopAutoplay();
        cancelAnimationFrame(timer.aniName);
    }

    /**
     * 开启第一屏计时器
     */
    function startPage1Timer() {
        funController.page1NumFn();
        startPage1CityReply();
        funController.pcMibleFn && funController.pcMibleFn(opController.pcMibleOps);
        if (swipers.bisitorsCommunity && swipers.bisitorsCommunity.sildeLen > 5) {
            swipers.bisitorsCommunity.startAutoplay();
        }
        if (swipers.bisitorsBuilding && swipers.bisitorsBuilding.sildeLen > 5) {
            swipers.bisitorsBuilding.startAutoplay();
        }
        funController.showTagFn && funController.showTagFn.update();
    }

    /**
     * 清除第二屏计时器
     */
    function stopPage2Timer() {
        clearTimeout(timer.page2Num);
        clearTimeout(timer.page2city);
        clearTimeout(timer.newOld);
        swipers.conventionCommunity && swipers.conventionCommunity.stopAutoplay();
        swipers.conventionBuilding && swipers.conventionBuilding.stopAutoplay();
        swipers.conventionBar && swipers.conventionBar.stopAutoplay();
    }

    /**
     * 开启第二屏计时器
     */
    function startPage2Timer() {
        funController.page2NumFn && funController.page2NumFn();
        startPage2CityReply();
        funController.showNewOldFn && funController.showNewOldFn();
        if (swipers.conventionCommunity && swipers.conventionCommunity.sildeLen > 5) {
            swipers.conventionCommunity.startAutoplay();
        }
        if (swipers.conventionBuilding && swipers.conventionBuilding.sildeLen > 5) {
            swipers.conventionBuilding.startAutoplay();
        }
        swipers.conventionBar && swipers.conventionBar.startAutoplay();
    }


    /**
     * 两屏切换
     * */
    var pageSwiper = new Swiper('#pageBox', {
        swipeHandler: '.swipe-handler',
        speed: 1000,
        keyboardControl: true,
        autoplay: switchTimer.page,
        autoplayDisableOnInteraction: false,
        onSlideChangeStart: function (swiper) {
            if (swiper.activeIndex === 1) {
                timerTrace('开始切换至第二屏..');
            } else {
                timerTrace('开始切换至第一屏..');
            }
        },
        onSlideChangeEnd: function (swiper) {
            if (swiper.activeIndex === 1) {
                // 切换到第二屏 关闭第一屏动画
                pageSwitch = 1;
                startPage2Timer();
                stopPage1Timer();
            } else {
                // 切换到第一屏 关闭第二屏动画
                pageSwitch = 0;
                startPage1Timer();
                stopPage2Timer();
            }
        }
    });


    var pageBox = $('#pageBox');
    var x0 = 0,
        y0 = 0;

    // 调试使用变量
    var testn = 0,
        testtimer = null;
    pageBox.on('mouseover', function (ev) {
        x0 = ev.clientX;
        y0 = ev.clientY;
    }).on('mousemove click', function (ev) {
        var x1 = ev.clientX,
            y1 = ev.clientY;
        var s = Math.sqrt(Math.abs(x1 * x1 - x0 * x0) + Math.abs(y1 * y1 - y0 * y0));
        if (s > 300 || ev.type === 'click') {
            // 标志正在等待恢复自动轮询
            replying = true;
            // 调试代码
            timerTrace('进入等待..', function () {
                clearInterval(testtimer);
                testn = 0;
                testtimer = setInterval(function () {
                    testn++;
                    console.log(testn);
                }, 1000);
            });

            clearTimeout(timer.relaying);
            timer.relaying = setTimeout(function () {
                replying = false;
            }, switchTimer.reply);
            pageSwiper && pageSwiper.stopAutoplay();
            startPage1CityReply();

            startPage2CityReply();
            clearTimeout(timer.page);
            timer.page = setTimeout(function () {
                timerTrace('页面开启自动切换..');
                pageSwiper && pageSwiper.startAutoplay();
            }, switchTimer.reply);
        }
    });

    /**
     * 开始第一屏的城市轮循
     *
     * */

    var testmovetimer1 = null;

    function startPage1CityReply() {
        clearTimeout(timer.page1city);
        if (pageSwitch === 0) {
            // 调试代码
            clearTimeout(testmovetimer1);
            testmovetimer1 = setTimeout(function () {
                timerTrace('第一屏 ' + replying ? switchTimer.reply / 1000 : switchTimer.city2 / 1000 + 's后开始城市轮询..  轮询城市-' + hotCityList[opController.map1Num]);
            }, 300);
            timer.page1city = setTimeout(function () {
                timerTrace('第一屏 开始轮询..', function () {
                    clearInterval(testtimer);
                });
                funController.map1CityFn && funController.map1CityFn(opController.map1Num);
            }, replying ? switchTimer.reply : switchTimer.city1);
        }
    }

    /**
     * 开始第二屏的城市轮循
     *
     * */
    var testmovetimer2 = null;

    function startPage2CityReply() {
        clearTimeout(timer.page2city);
        if (pageSwitch === 1) {
            // 调试代码
            clearTimeout(testmovetimer2);
            testmovetimer2 = setTimeout(function () {
                timerTrace('第二屏 ' + replying ? switchTimer.reply / 1000 : switchTimer.city2 / 1000 + 's后开始城市轮询..  轮询城市-' + hotCityList[opController.map2Num]);
            }, 300);
            timer.page2city = setTimeout(function () {
                timerTrace('第二屏 开始城市轮询..', function () {
                    clearInterval(testtimer);
                });
                funController.map2CityFn && funController.map2CityFn(opController.map2Num);
            }, replying ? switchTimer.reply : switchTimer.city2);
        }
    }

    /**
     * 今日访客
     *
     * */


    /**
     * 获取地图配置
     * @param ops max 最大值 min 最小值 cityData 城市数据 type 地图类型map1 首屏地图 map2 第二屏地图
     * @returns
     */
    function getmapOption(ops) {
        ops = ops || {};
        if (ops.max > 100000) {
            ops.max = 100000;
        }
        // 取出top10
        // var topArr = ops.city.slice(0, mapOps.cityNum);
        mapOps.baseN = 0;
        mapOps.num = [];
        // 删除top10
        // ops.city.splice(0, mapOps.cityNum);

        var len = ops.city.length;
        for (var j = 0, l = mapOps.biliTotal.length; j < l; j++) {
            var n = ~~(mapOps.biliTotal[j] * len);
            mapOps.num.push(n);
        }
        var mapOption = {
            tooltip: {
                showContent: true,
                trigger: 'item',
                alwaysShowContent: false,
                confine: true,
                position: function (point, params, dom, rect) {
                    var hotIndex = hotCityList.indexOf(params.name);
                    if (hotIndex > -1) {
                        if (pageSwitch === 0) {
                            hotcityIndex1 = ++hotIndex;
                        } else {
                            hotcityIndex2 = ++hotIndex;
                        }
                    }
                    var x = rect.x;
                    var y = rect.y;
                    if (y > 600) {
                        y -= 90;
                    } else {
                        y += 36;
                    }
                    if (x > 700) {
                        x -= 50;
                    }
                    return [x, y];
                },
                triggerOn: 'click',
                borderColor: '#41c9df',
                borderWidth: 2,
                formatter: function (params) {
                    var seriesType = params.seriesType,
                        name = params.name,
                        arr = params.value;
                    var str = '';
                    var label = '';
                    if (ops.type === 'map1') {
                        label = '访客数';
                    } else {
                        label = '预约数';
                    }
                    if (seriesType === 'scatter' || seriesType === 'effectScatter') {
                        str = '所属地：' + name + '<br />' + label + ': ' + arr[2] + '<br />经度：'
                            + parseFloat(arr[0]).toFixed(1) + '" 纬度：' + parseFloat(arr[1]).toFixed(1) + '"'
                        // + '<br /><a style="color:#fff;" href="http://brofen.cn/">查看详情</a>';
                    }
                    return str;
                }
            },
            visualMap: [
                {
                    type: 'continuous',
                    show: false,
                    min: ops.min || 0,
                    max: ops.max || 10000,
                    left: 'left',
                    top: 'bottom',
                    text: ['高', '低'],
                    color: ['#adbdff', '#293d8b'],
                    seriesIndex: 0,
                    calculable: true
                }
            ],
            geo: {
                map: 'china',
                zoom: 1.2,
                label: {
                    normal: {
                        show: false
                    },
                    emphasis: {
                        show: false
                    }
                },
                roam: false,
                itemStyle: {
                    normal: {
                        areaColor: '#2a8bcf',
                        borderColor: '#111'
                    },
                    emphasis: {
                        areaColor: '#2a8bcf'
                    }
                }
            },
            series: [
                {
                    name: '地图',
                    type: 'map',
                    mapType: 'china',
                    roam: false,
                    zoom: 1.2,
                    label: {
                        normal: {
                            show: false
                        },
                        emphasis: {
                            show: false
                        }
                    },
                    itemStyle: {
                        normal: {
                            areaColor: '#2a8bcf',
                            borderColor: '#111'
                        },
                        emphasis: {
                            areaColor: '#2a8bcf'
                        }
                    },
                    data: ops.province || [],
                    // 关掉鼠标响应事件
                    silent: true,
                    zlevel: 0
                },
                {
                    name: 'citys',
                    type: 'scatter',
                    coordinateSystem: 'geo',
                    data: ops.city || [],
                    symbolSize: function () {
                        var size = 0;
                        for (var i = mapOps.num.length - 1; i > -1; i--) {
                            if (mapOps.baseN >= mapOps.num[i]) {
                                size = mapOps.size[i];
                                break;
                            } else {
                                size = mapOps.size[0];
                            }
                        }
                        mapOps.baseN++;
                        return size;
                    },
                    label: {
                        normal: {
                            formatter: '{b}',
                            position: 'right',
                            show: false,
                            textStyle: {
                                color: '#fff',
                                fontWeight: 'bold',
                                fontSize: 14
                            }
                        },
                        emphasis: {
                            show: true
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#ddb926'
                        }
                    },
                    zlevel: 1
                },
                {
                    name: 'hotcity',
                    type: 'effectScatter',
                    coordinateSystem: 'geo',
                    data: ops.hotcity || [],
                    // symbolSize: mapOps.topPrintSize,
                    symbolSize: function () {
                        if (hotNum >= hotCityList.length) {
                            hotNum = 0;
                        }
                        var arr = mapOps.topPrintSize,
                            len = arr.length;
                        var size = arr[len - 1];
                        if (hotNum < len) {
                            size = arr[hotNum];
                        }
                        hotNum++;
                        return size;
                    },
                    showEffectOn: 'render',
                    rippleEffect: {
                        brushType: 'stroke'
                    },
                    hoverAnimation: true,
                    label: {
                        normal: {
                            formatter: '{b}',
                            position: 'right',
                            show: true,
                            textStyle: {
                                color: '#fff',
                                fontWeight: 'bold',
                                fontSize: 14
                            }
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#f4e925',
                            shadowBlur: 10,
                            shadowColor: '#333'
                        }
                    },
                    zlevel: 2
                }
            ]
        };
        return mapOption;
    }

    /**
     * 获取最大值和最小值
     * @param jsonArr 数组
     * @returns {{}}
     */
    function getMaxMin(jsonArr) {
        var arr = [], json = {};
        if (!jsonArr.length) {
            json = {
                max: 0,
                min: 0
            };
        }
        if (typeof jsonArr[0] === 'object') {
            for (var i = 0, len = jsonArr.length; i < len; i++) {
                arr.push(parseFloat(jsonArr[i].value));
            }
            json = {
                max: Math.max.apply(null, arr),
                min: Math.min.apply(null, arr)
            };
        } else {
            json = {
                max: Math.max.apply(null, jsonArr),
                min: Math.min.apply(null, jsonArr)
            };
        }
        return json;
    }


    bisitorsMapChart = echarts.init(document.getElementById('bisitorsMap'));

    // 点击更新热门小区和热门楼盘
    bisitorsMapChart.on('click', function (ev) {
        if (ev.seriesName === 'citys' || ev.seriesName === 'hotcity') {
            // 更新当前城市
            page1CurrentCity = ev.name;
            // 更新小区
            showCommunity1(ev.name);
            // 更新楼盘
            showBuilding1(ev.name);
        }
    });

    /**
     * 访客城市轮询
     * @param num
     */
    function hotCityPolling1() {
        if (replying)return;
        if (hotcityIndex1 < 0) {
            hotcityIndex1 = 0;
        }
        hotcityIndex1 %= hotcityListLen;
        // 更新当前城市
        page1CurrentCity = hotCityList[hotcityIndex1];
        timerTrace('第一屏 当前轮询城市-' + page1CurrentCity + ' 下个城市-' + hotCityList[(hotcityIndex1 + 1) % hotcityListLen]);
        // 更新小区
        showCommunity1(hotCityList[hotcityIndex1]);
        // 更新楼盘
        showBuilding1(hotCityList[hotcityIndex1]);
        // 更新地图点
        bisitorsMapChart.dispatchAction({
            type: 'showTip',
            seriesIndex: 2,
            name: hotCityList[hotcityIndex1]
        });
        clearTimeout(timer.page1city);
        if (pageSwitch === 0) {
            timer.page1city = setTimeout(function () {
                hotCityPolling1(++hotcityIndex1);
                // 存轮询index 方便再次开启
                opController.map1Num = hotcityIndex1 % hotcityListLen;
            }, switchTimer.city1);
        }
    }

    /**
     * 显示地图
     */
    function showMap1() {
        // 获取今日访客地图数据
        $.ajax({
            url: '?c=api&a=getOneHourMapByV',
            type: 'GET',
            cache: false,
            dataType: 'json',
            success: function (data) {

                ajaxTrace('访客地图:', data.message);

                var message = data.message;
                var province, city, hotcity, max, min, option;
                if (message === 'Success') {
                    province = data.content.province;
                    // 校验省份
                    var provinceArr = [];
                    for (var i = 0, len = provinceList.length; i < len; i++) {
                        var json = {},
                            name = provinceList[i];
                        json.name = name;
                        for (var j = 0, pLen = province.length; j < pLen; j++) {
                            if (province[j].name === name) {
                                json.value = province[j].value;
                                break;
                            } else {
                                json.value = 0;
                            }
                        }
                        provinceArr.push(json);
                    }
                    city = data.content.city;
                    hotcity = data.content.hotcity;

                    max = getMaxMin(provinceArr).max;
                    min = getMaxMin(provinceArr).min;
                    // 今日访客地图配置项
                    option = getmapOption({
                        type: 'map1',
                        max: max,
                        min: min,
                        province: provinceArr,
                        city: city,
                        hotcity: hotcity
                    });
                    // 设置地图数据
                    setTimeout(function () {
                        bisitorsMapChart.setOption(option);
                    }, 0);

                    // 默认进页面显示全国 延时5s 开始城市轮询
                    if (hotcityIndex1 < 0) {
                        clearTimeout(timer.page1city);
                        timerTrace('第一屏 ' + switchTimer.city2 / 1000 + 's后开始城市轮询..  轮询城市-' + hotCityList[0]);
                        timer.page1city = setTimeout(function () {
                            timerTrace('第一屏 开始城市轮询..');
                            hotCityPolling1(hotcityIndex1);
                        }, switchTimer.city1);
                    }
                    funController.map1CityFn = funController.map1CityFn || hotCityPolling1;
                    if (pageSwitch === 0) {
                        showMap1Next();
                    }
                } else {
                    // 立即执行
                    showMap1Next(true);
                }
            },
            error: function (err) {
                ajaxTrace('访客地图:', err);
                showMap1Next(true);
            }
        });
    }

    /**
     * 下次请求地图数据
     */
    function showMap1Next(bol) {
        clearTimeout(timer.page1map);
        timer.page1map = setTimeout(showMap1, bol ? 1000 : switchTimer.map1);
    }

    showMap1();
    funController.map1Fn = showMap1;

    // 点击访问量 重置地图数据
    $('#bisitorsNumBox').on('click', function () {
        bisitorsMapChart.dispatchAction({
            type: 'hideTip'
        });
        // 更新当前城市
        page1CurrentCity = '';

        // 更新小区
        showCommunity1('');
        // 更新楼盘
        showBuilding1('');
    });


    /**
     * 今日访客(预约) 热门小区 热门楼盘 效果
     */


    /**
     * 更新热门小区dom数据
     * @param arr
     * @param ele
     * @param cityname
     */
    function updateCommunity(arr, ele, cityname) {
        var $ele = $(ele),
            $li = $ele.find('ul li');

        // 处理数组空数据问题
        for (var i = arr.length - 1; i >= 0; i--) {
            var data = arr[i];
            if (!data.city || !data.loupanname || !data.value) {
                arr.splice(i, 1);
            }
        }

        // 判断当前城市和用户城市是否一致

        if (ele === '#bisitorsCommunity' && cityname !== page1CurrentCity || ele === '#conventionCommunity' && cityname !== page2CurrentCity) {
            return;
        }
        // 小于5条 关闭切换动画
        if (ele === '#bisitorsCommunity' && swipers.bisitorsCommunity) {
            swipers.bisitorsCommunity.sildeLen = arr.length;
            swipers.bisitorsCommunity.allowMove = false;
            swipers.bisitorsCommunity.stopAutoplay();
            swipers.bisitorsCommunity.slideTo(0);
        } else if (ele === '#conventionCommunity' && swipers.conventionCommunity) {
            swipers.conventionCommunity.sildeLen = arr.length;
            swipers.conventionCommunity.allowMove = false;
            swipers.conventionCommunity.stopAutoplay();
            swipers.conventionCommunity.slideTo(0);
        }

        if (arr.length > 5) {
            if (ele === '#bisitorsCommunity' && swipers.bisitorsCommunity) {
                swipers.bisitorsCommunity.slideTo(0);
                swipers.bisitorsCommunity.allowMove = true;
                swipers.bisitorsCommunity.startAutoplay();
            } else if (ele === '#conventionCommunity' && swipers.conventionCommunity) {
                swipers.conventionCommunity.slideTo(0);
                swipers.conventionCommunity.allowMove = true;
                swipers.conventionCommunity.startAutoplay();
            }
        }
        $li.each(function (index, el) {
            var me = $(el),
                // num = me.find('.num').text(),
                city = me.find('.city'),
                name = me.find('.name'),
                em = me.find('.hot em');
            var data = arr[index];
            if (data) {
                city.html(data.city);
                name.html(data.loupanname.replace(/\(.*\)|\（.*\）/, ''));
                em.css('width', data.per);
                me.show();
            } else {
                me.hide();
            }
        });
        $ele.find('.swiper-wrapper').show();
        if (!swipers.bisitorsCommunity && ele === '#bisitorsCommunity' && arr.length > 5) {
            swipers.bisitorsCommunity = new Swiper('#bisitorsCommunity', flipOption);
            swipers.bisitorsCommunity.allowMove = true;
        }
        if (!swipers.conventionCommunity && ele === '#conventionCommunity' && arr.length > 5) {
            swipers.conventionCommunity = new Swiper('#conventionCommunity', flipOption);
            swipers.conventionCommunity.allowMove = true;
        }
    }

    /**
     * 更新热门楼盘dom数据
     * @param arr
     * @param ele
     * @param cityname
     */
    function updateBuilding(arr, ele, cityname) {
        var $ele = $(ele),
            $li = $ele.find('ul li');
        // 处理数组空数据问题
        for (var i = arr.length - 1; i >= 0; i--) {
            var data = arr[i];
            if (!data.city || !data.loupanname || !data.value) {
                arr.splice(i, 1);
            }
        }


        if (ele === '#bisitorsBuilding' && cityname !== page1CurrentCity
            || ele === '#conventionBuilding' && cityname !== page2CurrentCity) {
            return;
        }

        if (ele === '#bisitorsBuilding' && swipers.bisitorsBuilding) {
            swipers.bisitorsBuilding.sildeLen = arr.length;
            swipers.bisitorsBuilding.allowMove = false;
            swipers.bisitorsBuilding.stopAutoplay();
            swipers.bisitorsBuilding.slideTo(0);
        } else if (ele === '#conventionBuilding' && swipers.conventionBuilding) {
            swipers.conventionBuilding.sildeLen = arr.length;
            swipers.conventionBuilding.allowMove = false;
            swipers.conventionBuilding.stopAutoplay();
            swipers.conventionBuilding.slideTo(0);
        }
        // 小于5条 关闭切换动画
        if (arr.length > 5) {
            if (ele === '#bisitorsBuilding' && swipers.bisitorsBuilding) {
                swipers.bisitorsBuilding.slideTo(0);
                swipers.bisitorsBuilding.allowMove = true;
                swipers.bisitorsBuilding.startAutoplay();
            } else if (ele === '#conventionBuilding' && swipers.conventionBuilding) {
                swipers.conventionBuilding.slideTo(0);
                swipers.conventionBuilding.allowMove = true;
                swipers.conventionBuilding.startAutoplay();
            }
        }
        $li.each(function (index, el) {
            var me = $(el),
                // num = me.find('.num').text(),
                city = me.find('.city'),
                name = me.find('.name'),
                hotNum = me.find('.hotNum'),
                iEle = me.find('.hotbt i');
            var data = arr[index];
            if (data) {
                city.html(data.city);
                name.html(data.loupanname.replace(/\(.*\)|\（.*\）/, ''));
                hotNum.html(data.value);
                iEle.removeClass('up').removeClass('dn');
                if (data.order === 1) {
                    iEle.addClass('up');
                } else if (data.order === -1) {
                    iEle.addClass('dn');
                }
                me.show();
            } else {
                me.hide();
            }
        });
        $ele.find('.swiper-wrapper').show();
        if (!swipers.bisitorsBuilding && ele === '#bisitorsBuilding') {
            swipers.bisitorsBuilding = new Swiper('#bisitorsBuilding', flipOption);
            swipers.bisitorsBuilding.allowMove = true;
        }
        if (!swipers.conventionBuilding && ele === '#conventionBuilding') {
            swipers.conventionBuilding = new Swiper('#conventionBuilding', flipOption);
            swipers.conventionBuilding.allowMove = true;
        }
    }

    /**
     * 初始化热门小区
     * @param cityname
     */
    function showCommunity1(cityname) {
        $.ajax({
            url: '?c=api&a=getOneHourHotXiaoQuByV',
            type: 'GET',
            cache: false,
            data: {
                cityname: cityname || ''
            },
            dataType: 'json',
            success: function (data) {
                ajaxTrace('访客小区:', data.message);
                var message = data.message;
                if (message === 'Success') {
                    updateCommunity(data.content, '#bisitorsCommunity', cityname);
                } else {
                    updateCommunity([], '#bisitorsCommunity', cityname);
                    if (cityname === '') {
                        showCommunity1(cityname);
                    }
                }
            },
            error: function (err) {
                ajaxTrace('访客小区:', err);
                updateCommunity([], '#bisitorsCommunity', cityname);
                if (cityname === '') {
                    showCommunity1(cityname);
                }
            }
        });
    }

    showCommunity1('');

    /**
     * 初始化热门楼盘
     * @param cityname
     */
    function showBuilding1(cityname) {
        $.ajax({
            url: '?c=api&a=getOneHourHotLouPanByV',
            type: 'GET',
            cache: false,
            data: {
                cityname: cityname || ''
            },
            dataType: 'json',
            success: function (data) {
                ajaxTrace('访客楼盘:', data.message);
                var message = data.message;
                if (message === 'Success') {
                    updateBuilding(data.content, '#bisitorsBuilding', cityname);
                } else {
                    updateBuilding([], '#bisitorsBuilding', cityname);
                    if (cityname === '') {
                        showBuilding1(cityname);
                    }
                }
            },
            error: function (err) {
                ajaxTrace('访客楼盘:', err);
                updateBuilding([], '#bisitorsBuilding', cityname);
                if (cityname === '') {
                    showBuilding1(cityname);
                }
            }
        });
    }

    showBuilding1('');


    /**
     *  平台占比
     */


    /**
     * 平台占比配置项
     * @param ops pc占比数据
     * @returns {} 配置对象
     */
    function getPcmobileOption(ops) {
        ops = ops || {};
        var PCmobileOption = {
            tooltip: {
                trigger: 'axis',
                showContent: true,
                alwaysShowContent: false,
                formatter: function (params) {
                    var s1 = params[0],
                        s2 = params[1],
                        s3 = params[2];
                    var str = '';
                    if (s1.value && s2.value && s3.value) {
                        str = 'PC：' + s3.value + '%<br />APP: ' + s2.value + '%<br />WAP: ' + s1.value + '%';
                    }
                    return str;
                },
                axisPointer: {
                    type: 'line',
                    lineStyle: {
                        color: '#ddd',
                        width: 1,
                        shadowColor: 'rgba(255, 255, 255, 0.5)',
                        shadowBlur: 50
                    }
                }
            },
            grid: {
                bottom: 20,
                top: 10,
                left: 28,
                right: 10
            },
            graphic: {
                elements: [
                    {
                        type: 'image',
                        id: 'img',
                        bottom: 20,
                        top: 10,
                        left: 28,
                        right: 10,
                        zlevel: 1,
                        opacity: 1,
                        style: {
                            image: vars.imgSite ? vars.imgSite + 'images/bg.png' : 'images/bg.png',
                            width: 419,
                            height: 226,
                            opacity: 1
                        }
                    }
                ]
            },
            xAxis: [
                {
                    type: 'category',
                    axisLabel: {
                        show: true,
                        interval: 1,
                        textStyle: {
                            color: '#fff'
                        }
                    },
                    boundaryGap: false,
                    data: [, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    axisLabel: {
                        show: true,
                        textStyle: {
                            color: '#fff'
                        }
                    },
                    max: 100,
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#1b2027',
                            opacity: 0.6
                        }
                    }
                }
            ],
            series: [
                {
                    name: 'wap',
                    type: 'line',
                    stack: '总量',
                    smooth: true,
                    showSymbol: false,
                    symbol: 'none',
                    areaStyle: {
                        normal: {
                            color: '#db961f',
                            opacity: 1
                        }
                    },
                    lineStyle: {
                        normal: {
                            color: '#db961f',
                            opacity: 0
                        }
                    },
                    data: ops.wap || []
                },
                {
                    name: 'APP',
                    type: 'line',
                    stack: '总量',
                    smooth: true,
                    showSymbol: false,
                    symbol: 'none',
                    areaStyle: {
                        normal: {
                            color: '#ae2545',
                            opacity: 1
                        }
                    },
                    lineStyle: {
                        normal: {
                            color: '#ae2545',
                            opacity: 0
                        }
                    },
                    data: ops.mobile || []
                },
                {
                    name: 'PC',
                    type: 'line',
                    stack: '总量',
                    smooth: true,
                    // symbol: 'image://images/ico1.png',
                    showSymbol: false,
                    areaStyle: {
                        normal: {
                            color: '#34b0c7',
                            opacity: 1
                        }
                    },
                    lineStyle: {
                        normal: {
                            color: '#469ab3',
                            opacity: 1
                        }
                    },
                    data: ops.pc || []
                }
            ]
        };
        return PCmobileOption;
    }

    /**
     * 获取标准格式数组
     * @param arr
     * @returns {Array}
     */
    function getformatArr(arr) {
        var tmpArr = new Array(25);
        if (arr && Object.prototype.toString.call(arr) === '[object Array]') {
            arr.forEach(function (item, inx) {
                tmpArr[inx] = item.toString();
            });
        }
        return tmpArr;
    }

    // 平台占比初始化
    bisitorsPCmobileChart = echarts.init(document.getElementById('bisitorsPCmobile'));
    var showPCmobile = function () {
        $.ajax({
            url: '?c=api&a=getPlatformRateByV',
            type: 'GET',
            cache: false,
            dataType: 'json',
            success: function (data) {
                ajaxTrace('平台占比:', data.message);
                var message = data.message;
                var option, pcArr, mobileArr, wapArr, len;
                if (message === 'Success') {
                    len = data.content.pc ? data.content.pc.length : 0;
                    pcArr = getformatArr(data.content.pc);
                    mobileArr = getformatArr(data.content.mb);
                    wapArr = getformatArr(data.content.wap);
                    option = getPcmobileOption({
                        pc: pcArr,
                        mobile: mobileArr,
                        wap: wapArr
                    });
                    bisitorsPCmobileChart.setOption(option);
                    // 平台占比显示 tooltip
                    bisitorsPCmobileChart.dispatchAction({
                        type: 'showTip',
                        seriesIndex: 0,
                        dataIndex: len > 0 ? len - 1 : 0
                    });
                    clearTimeout(timer.pcMobile);
                    if (pageSwitch === 0) {
                        showPCmobileNext(pcArr, mobileArr);
                    }
                } else {
                    showPCmobileNext();
                }
            },
            error: function (err) {
                ajaxTrace('平台占比:', err);
                showPCmobileNext();
            }
        });
    };

    /**
     * 下次请求平台占比数据
     * @param pcArr
     * @param mobileArr
     */
    function showPCmobileNext(pcArr, mobileArr) {
        clearTimeout(timer.pcMobile);
        timer.pcMobile = setTimeout(function () {
            showPCmobile();
            if (pcArr && mobileArr) {
                opController.pcMibleOps.pc = pcArr;
                opController.pcMibleOps.mobile = mobileArr;
            }
        }, switchTimer.pcmobile);
    }

    showPCmobile();
    funController.pcMibleFn = showPCmobile;


    /**
     * 热搜词
     */

        // 调用js
    var tagcloud = window.tagcloud;
    var hotsearch = $('.hotsearch');

    /**
     * 显示热搜词
     */
    function showTag() {
        $.ajax({
            url: '?c=api&a=getHotSearch',
            type: 'GET',
            cache: false,
            dataType: 'json',
            success: function (data) {
                ajaxTrace('热搜词:', data.message);
                var message = data.message;
                var content = data.content;
                if (message === 'Success') {
                    if (funController.showTagFn) {
                        hotsearch.find('a').each(function (inx, ele) {
                            if (content[inx]) {
                                ele.innerHTML = content[inx].name;
                            }
                        });
                    } else {
                        funController.showTagFn = tagcloud({
                            // 参数名: 默认值
                            // 元素选择器
                            selector: '.hotsearch',
                            // 基本字体大小, 单位px
                            fontsize: 18,
                            // 滚动半径, 单位px
                            radius: 120,
                            // 滚动最大速度, 取值: slow, normal(默认), fast
                            mspeed: 'normal',
                            // 滚动初速度, 取值: slow, normal(默认), fast
                            ispeed: 'normal',
                            // 初始滚动方向, 取值角度(顺时针360): 0对应top, 90对应left, 135对应right-bottom(默认)..
                            direction: 135,
                            // 鼠标移出组件后是否继续随鼠标滚动, 取值: false, true(默认) 对应 减速至初速度滚动, 随鼠标滚动
                            keep: false,
                            tags: data.content,
                            aniName: timer
                        });
                    }
                    if (pageSwitch === 0) {
                        showTagNext();
                    }
                } else {
                    showTagNext();
                }
            },
            error: function (err) {
                ajaxTrace('热搜词:', err);
                showTagNext();
            }
        });
    }

    /**
     * 下一次请求热词数据
     */
    function showTagNext() {
        clearTimeout(timer.tags);
        if (pageSwitch === 0) {
            timer.tags = setTimeout(showTag, switchTimer.tags);
        }
    }

    showTag();

    /**
     * 平台访客数 切换效果
     */
    var bisitorsNumBox = $('#bisitorsNumBox'),
        page1Spans = bisitorsNumBox.find('.box');
    var page1Inner = function () {
        $.ajax({
            url: '?c=api&a=getJinRiLeiJiFangKe',
            type: 'GET',
            cache: false,
            dataType: 'json',
            success: function (data) {
                ajaxTrace('今日访客:', data.message);
                var message = data.message;
                var nowNum = '0', len;
                if (message === 'Success') {
                    nowNum = data.content.toString();
                    infoNum.html(nowNum);
                    len = nowNum.length;
                    if (len <= page1Spans.length) {
                        page1Spans.each(function (index, ele) {
                            var $ele = $(ele),
                                str = nowNum.charAt(index);
                            if (str) {
                                $ele.find('.last').html(str);
                                $ele.show();
                            } else {
                                $ele.hide();
                            }
                        });
                    } else {
                        console.log('需要增加dom结构了.');
                    }
                    if (pageSwitch === 0) {
                        page1InnerNext();
                    }
                } else {
                    page1InnerNext();
                }
            },
            error: function (err) {
                ajaxTrace('今日访客:', err);
                page1InnerNext();
            }
        });
    };

    /**
     * 下次请求地图数据
     */
    function page1InnerNext() {
        clearTimeout(timer.page1Num);
        timer.page1Num = setTimeout(function () {
            page1Inner();
        }, switchTimer.access);
    }

    page1Inner();
    funController.page1NumFn = page1Inner;


    /**
     * 今日预约
     * */


    /**
     * 新老访客
     */
    var conventionNewOldChart = echarts.init(document.getElementById('conventionNewOld'));
    conventionNewOldChart.title = '嵌套环形图';


    /**
     * 获取新老访问量配置
     * @param newData 新客户
     * @param oldData 旧客户
     * @returns {{}}
     */
    function getNewOldOption(ops) {
        var newOldOption = {
            legend: {
                show: false,
                orient: 'horizontal',
                x: 'right',
                y: 'bottom',
                data: ['31.5%', '78.5%'],
                textStyle: {
                    color: '#fff'
                }
            },
            series: [{
                name: '新老访客',
                type: 'pie',
                selectedMode: 'single',
                radius: ['60%', '75%'],

                label: {
                    normal: {
                        show: true,
                        position: 'outside',
                        textStyle: {
                            fontSize: '16'
                        }
                    }
                },
                labelLine: {
                    normal: {
                        show: true
                    }
                },
                data: [{
                    value: ops.newvalue,
                    name: Math.round(ops.newvalue / ops.newOldData * 100) + '%',
                    itemStyle: {
                        normal: {
                            color: '#D5435F'
                        }
                    }
                }, {
                    value: ops.oldvalue,
                    name: Math.round(ops.oldvalue / ops.newOldData * 100) + '%',
                    itemStyle: {
                        normal: {
                            color: '#16E6FC'
                        }
                    }
                }]
            }, {
                name: '访客数',
                type: 'pie',
                radius: ['90%', '91.5%'],

                label: {
                    normal: {
                        show: false,
                        position: 'center',
                        textStyle: {
                            fontSize: '20',
                            color: '#fff'
                        }
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data: [{
                    value: 100,
                    name: '外层圈圈',
                    itemStyle: {
                        normal: {
                            color: '#333'
                        }
                    }
                }]
            }
            ]
        };
        return newOldOption;
    }

    /**
     * 显示新老访客
     */
    function showNewOld() {
        $.ajax({
            url: '?c=api&a=getOneHourNewVisitorRateByYuYue',
            type: 'GET',
            cache: false,
            dataType: 'json',
            success: function (data) {
                ajaxTrace('新老访客:', data.message);
                var message = data.message;
                if (message === 'Success') {
                    var content = data.content;
                    content.newOldData = ~~content.newvalue + ~~content.oldvalue;
                    var newOldOption = getNewOldOption(content);
                    conventionNewOldChart.setOption(newOldOption);
                    // infoNum.html(content.newOldData);
                    pieInfo.fadeIn(1000);
                    pieMark.fadeIn(1000);
                    if (pageSwitch === 1) {
                        showNewOldNext();
                    }
                } else {
                    showNewOldNext();
                }
            },
            error: function (err) {
                ajaxTrace('新老访客:', err);
                showNewOldNext();
            }
        });
    }

    /**
     * 下一次请求新老访客数据
     */
    function showNewOldNext() {
        clearTimeout(timer.newOld);
        timer.newOld = setTimeout(showNewOld, switchTimer.newOld);
    }

    showNewOld();
    funController.showNewOldFn = showNewOldNext;

    // 第二屏地图初始化
    conventionMapChart = echarts.init(document.getElementById('conventionMap'));

    // 点击更新热门小区和热门楼盘
    conventionMapChart.on('click', function (ev) {

        if (ev.seriesName === 'citys' || ev.seriesName === 'hotcity') {
            // 更新当前城市
            page2CurrentCity = ev.name;
            // 更新小区
            showCommunity2(ev.name);
            // 更新楼盘
            showBuilding2(ev.name);
        }
    });

    /**
     * 预约城市轮询
     */
    function hotCityPolling2() {
        if (replying)return;
        if (hotcityIndex2 < 0) {
            hotcityIndex2 = 0;
        }
        hotcityIndex2 %= hotcityListLen;
        // 更新当前城市
        page2CurrentCity = hotCityList[hotcityIndex2];
        timerTrace('第二屏 当前轮询城市-' + page2CurrentCity + '  下个城市-' + hotCityList[(hotcityIndex2 + 1) % hotcityListLen]);
        // 更新小区
        showCommunity2(hotCityList[hotcityIndex2]);
        // 更新楼盘
        showBuilding2(hotCityList[hotcityIndex2]);
        // 更新地图点
        conventionMapChart.dispatchAction({
            type: 'showTip',
            seriesIndex: 2,
            name: hotCityList[hotcityIndex2]
        });
        clearTimeout(timer.page2city);
        if (pageSwitch === 1) {
            timer.page2city = setTimeout(function () {
                hotCityPolling2(++hotcityIndex2);
                // 存轮询index 方便再次开启
                opController.map2Num = hotcityIndex2 % hotcityListLen;
            }, switchTimer.city2);
        }
    }

    /**
     * 预约地图
     */
    function showMap2() {
        // 获取今日预约地图数据
        $.ajax({
            url: '?c=api&a=getOneHourMapByYuYue',
            type: 'GET',
            cache: false,
            dataType: 'json',
            success: function (data) {
                ajaxTrace('预约地图:', data.message);
                var message = data.message;
                var province, city, hotcity, max, min, option;
                if (message === 'Success') {
                    province = data.content.province;
                    city = data.content.city;
                    hotcity = data.content.hotcity;
                    // 省份校验
                    var provinceArr = [];
                    for (var i = 0, len = provinceList.length; i < len; i++) {
                        var json = {},
                            name = provinceList[i];
                        json.name = name;
                        for (var j = 0, pLen = province.length; j < pLen; j++) {
                            if (province[j].name === name) {
                                json.value = province[j].value;
                                break;
                            } else {
                                json.value = 0;
                            }
                        }
                        provinceArr.push(json);
                    }

                    max = getMaxMin(provinceArr).max;
                    min = getMaxMin(provinceArr).min;
                    // 今日预约地图配置项
                    option = getmapOption({
                        type: 'map2',
                        max: max,
                        min: min,
                        province: provinceArr,
                        city: city,
                        hotcity: hotcity
                    });
                    // 设置地图数据
                    setTimeout(function () {
                        conventionMapChart.setOption(option);
                    }, 0);
                    // 默认进页面显示全国 延时5s 开始城市轮询
                    if (hotcityIndex2 < 0) {
                        clearTimeout(timer.page2city);
                        if (pageSwitch === 1) {
                            timerTrace('第二屏 ' + switchTimer.city2 / 1000 + 's后开始城市轮询..  轮询城市-' + hotCityList[0]);
                            timer.page2city = setTimeout(function () {
                                timerTrace('第二屏 开始城市轮询..');
                                hotCityPolling2(hotcityIndex2);
                            }, switchTimer.city2);
                        }
                    }
                    funController.map2CityFn = funController.map2CityFn || hotCityPolling2;
                    if (pageSwitch === 1) {
                        showMap2Next();
                    }
                } else {
                    // 立即执行
                    showMap2Next(true);
                }
            },
            error: function (err) {
                ajaxTrace('预约地图:', err);
                showMap2Next(true);
            }
        });
    }

    /**
     * 下次请求地图数据
     */
    function showMap2Next(bol) {
        clearTimeout(timer.page2map);
        timer.page2map = setTimeout(showMap2, bol ? 1000 : switchTimer.map2);
    }

    showMap2();
    funController.map2Fn = showMap2;

    // 点击访问量 重置地图数据
    $('#conventionNumBox').on('click', function () {
        conventionMapChart.dispatchAction({
            type: 'hideTip'
        });
        // 更新当前城市
        page2CurrentCity = '';
        // 更新小区
        showCommunity2('');
        // 更新楼盘
        showBuilding2('');
    });

    /**
     * 初始化预约热门小区
     * @param cityname
     */
    function showCommunity2(cityname) {
        $.ajax({
            url: '?c=api&a=getOneHourHotXiaoQuByYuYue',
            type: 'GET',
            cache: false,
            data: {
                cityname: cityname || ''
            },
            dataType: 'json',
            success: function (data) {
                ajaxTrace('预约小区:', data.message);
                var message = data.message;
                if (message === 'Success') {
                    updateCommunity(data.content, '#conventionCommunity', cityname);
                } else {
                    updateCommunity([], '#conventionCommunity', cityname);
                    if (cityname === '') {
                        showCommunity2(cityname);
                    }
                }
            },
            error: function (err) {
                ajaxTrace('预约小区:', err);
                updateCommunity([], '#conventionCommunity', cityname);
                if (cityname === '') {
                    showCommunity2(cityname);
                }
            }
        });
    }

    showCommunity2('');

    /**
     * 初始化预约热门楼盘
     * @param cityname
     */
    function showBuilding2(cityname) {
        $.ajax({
            url: '?c=api&a=getOneHourHotLouPanByYuYue',
            type: 'GET',
            cache: false,
            data: {
                cityname: cityname || ''
            },
            dataType: 'json',
            success: function (data) {
                ajaxTrace('访客楼盘:', data.message);
                var message = data.message;
                if (message === 'Success') {
                    updateBuilding(data.content, '#conventionBuilding', cityname);
                } else {
                    updateBuilding([], '#conventionBuilding', cityname);
                    if (cityname === '') {
                        showBuilding2(cityname);
                    }
                }
            },
            error: function (err) {
                ajaxTrace('访客楼盘:', err);
                updateBuilding([], '#conventionBuilding', cityname);
                if (cityname === '') {
                    showBuilding2(cityname);
                }
            }
        });
    }

    showBuilding2('');


    /**
     * 平台预约数
     */

    var conventionNumBox = $('#conventionNumBox'),
        page2Spans = conventionNumBox.find('.box');
    var jiekouArr = ['xf', 'card', 'esf', 'sfbphone', 'esfphone'];
    var jiekouNum = 0;
    var page2Inner = function (num) {
        var n = num % 5;
        $.ajax({
            url: '?c=api&a=getJinRiLeiJiYuYue',
            type: 'GET',
            cache: false,
            data: {
                type: jiekouArr[n] || 'xf'
            },
            dataType: 'json',
            success: function (data) {
                ajaxTrace('今日预约:', data.message);
                var message = data.message;
                var nowNum = '0', len;
                if (message === 'Success') {
                    nowNum = data.content.toString();
                    len = nowNum.length;
                    if (len <= page2Spans.length) {
                        page2Spans.each(function (index, ele) {
                            var $ele = $(ele),
                                str = nowNum.charAt(index);
                            if (str) {
                                $ele.find('.last').html(str);
                                $ele.show();
                            } else {
                                $ele.hide();
                            }
                        });
                    } else {
                        console.log('需要增加dom结构了.');
                    }
                    if (pageSwitch === 1) {
                        page2InnerNext(++jiekouNum);
                    }
                } else {
                    page2InnerNext(jiekouNum);
                }
            },
            error: function (err) {
                ajaxTrace('今日预约:', err);
                page2InnerNext(jiekouNum);
            }
        });
    };

    /**
     * 下次请求预约总数
     * @param num
     */
    function page2InnerNext(num) {
        clearTimeout(timer.page2Num);
        timer.page2Num = setTimeout(function () {
            page2Inner(num);
        }, switchTimer.conv);
    }

    page2Inner(0);
    funController.page2NumFn = page2InnerNext;

    /**
     * 房价涨幅榜
     */
        // 关闭新房数据显示
        // var barChartXf = $('.barChartXf'),
        //     xfBar = barChartXf.find('.bar');
    var barChartEsf = $('.barChartEsf'),
        esfBar = barChartEsf.find('.bar');
    var barLen = esfBar.length;


    /**
     * 更新房价涨幅榜数据
     * @param data
     * @param type
     */
    function updatePriceDom(data, type) {
        var barE = null;
        var dataNums = [], max, scale;
        if (type === 'esf') {
            barE = esfBar;
        } else {
            // barE = xfBar;
        }
        // 算出最大值
        for (var i = 0; i < barLen; i++) {
            if (data[i]) {
                dataNums.push(Math.abs(+data[i].value));
            }
        }
        max = Math.max.apply(null, dataNums);
        scale = 120 / max;

        // 更新dom数据
        barE.each(function (index, ele) {
            var me = $(ele),
                label = me.find('.label'),
                title = me.find('.title'),
                cityValue = me.find('.cityValue');
            var item = data[index];
            if (item) {
                var val = ~~(item.value * scale);
                if (item.value >= 0) {
                    label.css('height', val).removeClass('reverse');
                    title.html(item.city);
                    cityValue.html((item.value).toFixed(2) + '%').css('top', -(val + 25));
                } else {
                    label.css('height', -val).addClass('reverse');
                    title.html(item.city);
                    cityValue.html((item.value).toFixed(2) + '%').css('top', 35 - val);
                }
            }
        });
    }

    /**
     * 房价涨幅榜
     * @param groupName
     */
    function price(groupName) {
        // 关闭新房数据显示
        if (groupName === 'xf' || !groupName) {
            return;
        }
        $.ajax({
            url: '?c=api&a=getFangJiaZhangFu',
            type: 'GET',
            cache: false,
            data: {
                groupName: groupName || 'xf'
            },
            dataType: 'json',
            success: function (data) {
                ajaxTrace('房价涨幅:', data.message);
                var message = data.message;
                if (message === 'Success') {
                    updatePriceDom(data.content, groupName);
                } else {
                    price(groupName);
                }
            },
            error: function (err) {
                ajaxTrace('房价涨幅:', err);
                price(groupName);
            }
        });
    }

    // 关闭新房数据显示
    // swipers.conventionBarTitle = new Swiper('#rTitle', {
    //     spaceBetween: 10,
    //     direction: 'vertical'
    // });

    swipers.conventionBar = new Swiper('#barChart', {
        autoplay: switchTimer.bar,
        autoplayDisableOnInteraction: false,
        effect: 'coverflow',
        speed: 1000,
        slidesPerView: 1,
        modifier: 10,
        onInit: function (swiper) {
            price('xf');
            price('esf');
            swiper.stopAutoplay();
        },
        // 关闭新房数据显示
        // onSlideChangeStart: function (swiper) {
        //     if (swiper.activeIndex > 1 && pageSwitch === 1) {
        //         // 切换到esf
        //         swipers.conventionBarTitle.slideTo(1);
        //         price('esf');
        //     } else if (pageSwitch === 1) {
        //         // 切换到xf
        //         swipers.conventionBarTitle.slideTo(0);
        //         price('xf');
        //     }
        // },
        // onTouchEnd: function (swiper) {
        //     if (swiper.activeIndex > 1) {
        //         swipers.conventionBarTitle.slideTo(1);
        //     } else {
        //         swipers.conventionBarTitle.slideTo(0);
        //     }
        // }
    });

    /**
     * 定时刷新页面
     */
    clearTimeout(timer.reload);
    timer.reload = setTimeout(function () {
        location.reload();
    }, switchTimer.reload);
});
