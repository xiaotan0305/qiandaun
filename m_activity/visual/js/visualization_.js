/**
 * @file visualizaton 数据可视化
 * @author tankunpeng(tankunpeng@fang.com)
 * @update tankunpeng 2016/12/13
 */
$(function () {
    'use strict';

    // debug模式
    var debug = /debug/.test(location.href.toLowerCase())

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
     * 获取隐藏域数据
     */
    var vars = {};
    $('input[type=hidden]').each(function (index, element) {
        vars[$(this).attr('id')] = element.value;
    });

    // 热门城市轮询列表(包含访客页面和预约页面)
    var hotCityList = [];
    var provinceList = ['北京', '上海', '湖北', '广东', '四川', '天津', '江苏', '重庆',
        '浙江', '陕西', '河南', '湖南', '山东', '河北', '江西', '辽宁', '海南', '福建', '安徽', '广西', '云南',
        '吉林', '山西', '黑龙江', '贵州', '甘肃', '内蒙古', '新疆', '宁夏', '青海', '澳门', '西藏', '香港', '台湾'];
    // var geoCoordMap = window.geoCoordMap;
    var echarts = window.echarts;
    var Swiper = window.Swiper;
    var bisitorsMapChart;
    var bisitorsPCmobileChart;
    var conventionMapChart;

    // 地图相关配置
    var mapOps = {
        // 地图轮询个数
        cityNum: 10,
        topPrintSize: 25,
        bili: [0.01, 0.02, 0.01, 0.01, 0.25, 0.2, 0.25, 0.25],
        biliTotal: [0.01, 0.03, 0.04, 0.05, 0.3, 0.4, 0.5, 1],
        size: [23, 20, 18, 16, 13, 10, 8, 5],
        num: [],
        baseN: 0
    };


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
        aniName: 0
    };

    // 切换时间
    var switchTimer = {
        // 切屏
        page: 5000,
        // 今日访客数
        access: 2000,
        // 今日预约数
        conv: 5000,
        // 地图访问间隔
        map1: 360000000,
        map2: 360000000,
        // 城市切换
        city1: 5000,
        city2: 5000,
        // 小区楼盘切换
        floor: 5000,
        // 平台占比
        pcmobile: 18000000,
        // 新老访客
        newOld: 5000,
        // 房价涨幅
        price: 5000,
        // 鼠标恢复时间
        reply: 30000,
        // 标签云
        tags: 360000000,
        // 房价涨幅榜
        bar: 5000
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
        grabCursor: true
    };

    /**
     * 清除第一屏计时器
     */
    function stopPage1Timer() {
        clearTimeout(timer.page1Num);
        // clearTimeout(timer.page1map);
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
        funController.map1CityFn && funController.map1CityFn(opController.map1Num);
        funController.pcMibleFn && funController.pcMibleFn(opController.pcMibleOps);
        swipers.bisitorsCommunity && swipers.bisitorsCommunity.startAutoplay();
        swipers.bisitorsBuilding && swipers.bisitorsBuilding.startAutoplay();
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
        funController.map2CityFn && funController.map2CityFn(opController.map2Num);
        funController.showNewOldFn && funController.showNewOldFn();
        swipers.conventionCommunity && swipers.conventionCommunity.startAutoplay();
        swipers.conventionBuilding && swipers.conventionBuilding.startAutoplay();
        swipers.conventionBar && swipers.conventionBar.startAutoplay();
    }


    /**
     * 两屏切换
     * */
    var pageSwiper = new Swiper('#pageBox', {
        swipeHandler: '.swipe-handler',
        speed: 1000,
        keyboardControl: true,
        // autoplay: switchTimer.page,
        autoplayDisableOnInteraction: false,
        onSlideChangeEnd: function (swiper) {
            if (swiper.activeIndex === 1) {
                // 切换到第二屏 关闭第一屏动画
                startPage2Timer();
                stopPage1Timer();
            } else {
                // 切换到第一屏 关闭第二屏动画
                startPage1Timer();
                stopPage2Timer();
            }
        }
    });
    $('#pageBox').on('mousemove', function () {
        clearTimeout(timer.page);
        pageSwiper.stopAutoplay();
        clearTimeout(timer.page1city);
        clearTimeout(timer.page2city);

        timer.page1city = setTimeout(function () {
            funController.map1CityFn(opController.map1Num);
        }, switchTimer.reply);

        timer.page2city = setTimeout(function () {
            funController.map2CityFn(opController.map2Num);
        }, switchTimer.reply);

        timer.page = setTimeout(function () {
            pageSwiper.startAutoplay();
        }, switchTimer.reply);
    });


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
        var topArr = ops.city.slice(0, mapOps.cityNum);
        // 初始化更新 轮询数组
        hotCityList = [];
        mapOps.baseN = 0;
        mapOps.num = [];
        for (var i = 0; i < mapOps.cityNum; i++) {
            hotCityList.push(topArr[i].name);
        }
        // console.log(topArr);
        // 删除top10
        ops.city.splice(0, mapOps.cityNum);

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
                            + parseFloat(arr[0]).toFixed(1) + '" 纬度：' + parseFloat(arr[1]).toFixed(1) + '"';
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
                    data: topArr,
                    symbolSize: mapOps.topPrintSize,
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
            // 更新小区
            showCommunity1(ev.name);
            // 更新楼盘
            showBuilding1(ev.name);
            clearTimeout(timer.page1city);
            timer.page1city = setTimeout(function () {
                funController.map1CityFn(opController.map1Num);
            }, switchTimer.reply);
        }
    });

    /**
     * 显示地图
     */
    var showMap1 = function () {
        // 获取今日访客地图数据
        $.ajax({
            url: '?c=api&a=getOneHourMapByV',
            type: 'GET',
            cache: false,
            dataType: 'json',
            success: function (data) {
                if (debug) {
                    console.log('访客地图:', data.message);
                }
                var message = data.message;
                var province, city, max, min, option;
                if (message === 'Success') {
                    province = data.content.province;
                    // console.log(province);
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


                    max = getMaxMin(provinceArr).max;
                    min = getMaxMin(provinceArr).min;
                    // 今日访客地图配置项
                    option = getmapOption({
                        type: 'map1',
                        max: max,
                        min: min,
                        province: provinceArr,
                        city: city
                    });
                    // 设置地图数据
                    setTimeout(function () {
                        bisitorsMapChart.setOption(option);
                    }, 0);

                    // 城市轮询
                    var hotcityListLen = hotCityList.length;
                    var hotCityPolling = function (num) {
                        var n = num % hotcityListLen;
                        // 更新小区
                        showCommunity1(hotCityList[n]);
                        // 更新楼盘
                        showBuilding1(hotCityList[n]);
                        // 更新地图点
                        bisitorsMapChart.dispatchAction({
                            type: 'showTip',
                            seriesIndex: 2,
                            name: hotCityList[n]
                        });
                        clearTimeout(timer.page1city);
                        timer.page1city = setTimeout(function () {
                            hotCityPolling(++n);
                            // 存轮询index 方便再次开启
                            opController.map1Num = n;
                        }, switchTimer.city1);
                    };
                    // 默认进页面显示全国 延时5s 开始城市轮询
                    clearTimeout(timer.page1city);
                    timer.page1city = setTimeout(function () {
                        hotCityPolling(0);
                    }, switchTimer.city1);
                    funController.map1CityFn = funController.map1CityFn || hotCityPolling;
                    showMap1Next();
                }
            },
            error: function (err) {
                if (debug) {
                    console.log('访客地图:', err);
                }
                showMap1Next();
            }
        });
    };

    /**
     * 下次请求地图数据
     */
    function showMap1Next() {
        clearTimeout(timer.page1map);
        timer.page1map = setTimeout(showMap1, switchTimer.map1);
    }

    showMap1();
    funController.map1Fn = showMap1;

    // 点击访问量 重置地图数据
    $('#bisitorsNumBox').on('click', function () {
        bisitorsMapChart.dispatchAction({
            type: 'hideTip'
        });
        // 更新小区
        showCommunity1();
        // 更新楼盘
        showBuilding1();
        // 取消显示城市信息弹层
        clearTimeout(timer.page1city);
        timer.page1city = setTimeout(function () {
            funController.map1CityFn(opController.map1Num);
        }, switchTimer.reply);
    });


    /**
     * 今日访客(预约) 热门小区 热门楼盘 效果
     */


    /**
     * 更新热门小区dom数据
     * @param arr
     * @param ele
     */
    function updateCommunity(arr, ele) {
        var $ele = $(ele),
            $li = $ele.find('ul li');
        // 小于5条 关闭切换动画
        if (arr.length <= 5) {
            if (ele === '#bisitorsCommunity' && swipers.bisitorsCommunity) {
                swipers.bisitorsCommunity.slideTo(0);
                swipers.bisitorsCommunity.stopAutoplay();
            } else if (ele === '#conventionCommunity' && swipers.conventionCommunity) {
                swipers.conventionCommunity.slideTo(0);
                swipers.conventionCommunity.stopAutoplay();
            }
        } else if (ele === '#bisitorsCommunity' && swipers.bisitorsCommunity) {
            swipers.bisitorsCommunity.slideTo(0);
            swipers.bisitorsCommunity.startAutoplay();
        } else if (ele === '#conventionCommunity' && swipers.conventionCommunity) {
            swipers.conventionCommunity.slideTo(0);
            swipers.conventionCommunity.startAutoplay();
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
                name.html(data.loupanname);
                em.css('width', data.per);
                me.show();
            } else {
                me.hide();
            }
        });
        $ele.find('.swiper-wrapper').show();
        if (!swipers.bisitorsCommunity && ele === '#bisitorsCommunity' && arr.length > 5) {
            swipers.bisitorsCommunity = new Swiper('#bisitorsCommunity', flipOption);
        }
        if (!swipers.conventionCommunity && ele === '#conventionCommunity' && arr.length > 5) {
            swipers.conventionCommunity = new Swiper('#conventionCommunity', flipOption);
        }
    }

    /**
     * 更新热门楼盘dom数据
     * @param arr
     * @param ele
     */
    function updateBuilding(arr, ele) {
        var $ele = $(ele),
            $li = $ele.find('ul li');
        // 小于5条 关闭切换动画
        if (arr.length <= 5) {
            if (ele === '#bisitorsBuilding' && swipers.bisitorsBuilding) {
                swipers.bisitorsBuilding.slideTo(0);
                swipers.bisitorsBuilding.stopAutoplay();
            } else if (ele === '#conventionBuilding' && swipers.conventionBuilding) {
                swipers.conventionBuilding.slideTo(0);
                swipers.conventionBuilding.stopAutoplay();
            }
        } else if (ele === '#bisitorsBuilding' && swipers.bisitorsBuilding) {
            swipers.bisitorsBuilding.slideTo(0);
            swipers.bisitorsBuilding.startAutoplay();
        } else if (ele === '#conventionBuilding' && swipers.conventionBuilding) {
            swipers.conventionBuilding.slideTo(0);
            swipers.conventionBuilding.startAutoplay();
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
                name.html(data.loupanname);
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
        }
        if (!swipers.conventionBuilding && ele === '#conventionBuilding') {
            swipers.conventionBuilding = new Swiper('#conventionBuilding', flipOption);
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
                if (debug) {
                    console.log('访客小区:', data.message);
                }
                var message = data.message;
                if (message === 'Success') {
                    updateCommunity(data.content, '#bisitorsCommunity');
                } else {
                    updateCommunity([], '#bisitorsCommunity');
                }
            },
            error: function (err) {
                if (debug) {
                    console.log('访客小区:', err);
                }
            }
        });
    }

    showCommunity1();

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
                if (debug) {
                    console.log('访客楼盘:', data.message);
                }

                var message = data.message;
                if (message === 'Success') {
                    updateBuilding(data.content, '#bisitorsBuilding');
                } else {
                    updateBuilding([], '#bisitorsBuilding');
                }
            },
            error: function (err) {
                if (debug) {
                    console.log('访客楼盘:', err);
                }
            }
        });
    }

    showBuilding1();


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
                        s2 = params[1];
                    var str = '';
                    if (s1.value && s2.value) {
                        str = 'pc：' + s1.value + '%<br />mobile: ' + s2.value + '%';
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
                },
                {
                    name: 'mobile',
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
                if (debug) {
                    console.log('平台占比:', data.message);
                }
                var message = data.message;
                var option, pcArr, mobileArr, len;
                if (message === 'Success') {
                    len = data.content.pc ? data.content.pc.length : 0;
                    pcArr = getformatArr(data.content.pc);
                    mobileArr = getformatArr(data.content.mb);
                    option = getPcmobileOption({
                        pc: pcArr,
                        mobile: mobileArr
                    });
                    bisitorsPCmobileChart.setOption(option);
                    // 平台占比显示 tooltip
                    bisitorsPCmobileChart.dispatchAction({
                        type: 'showTip',
                        seriesIndex: 0,
                        dataIndex: len > 0 ? len - 1 : 0
                    });
                    clearTimeout(timer.pcMobile);
                    showPCmobileNext(pcArr, mobileArr);
                }
            },
            error: function (err) {
                if (debug) {
                    console.log('平台占比:', err);
                }

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

    /**
     * 显示热搜词
     */
    var showTag = function () {
        $.ajax({
            url: '?c=api&a=getHotSearch',
            type: 'GET',
            cache: false,
            dataType: 'json',
            success: function (data) {
                if (debug) {
                    console.log('热搜词:', data.message);
                }

                var message = data.message;
                if (message === 'Success') {
                    funController.showTagFn = funController.showTagFn
                        || tagcloud({
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
                            // 初始滚动方向, 取值角度(顺时针360): 0对应top, 90对应left, 135对应right-bottom(默认)...
                            direction: 135,
                            // 鼠标移出组件后是否继续随鼠标滚动, 取值: false, true(默认) 对应 减速至初速度滚动, 随鼠标滚动
                            keep: false,
                            tags: data.content,
                            aniName: timer
                        });
                    // funController.showTagFn = funController.showTagFn || showTag;
                    showTagNext();
                }
            },
            error: function (err) {
                if (debug) {
                    console.log('热搜词:', err);
                }
                showTagNext();
            }
        });
    };

    /**
     * 下一次请求热词数据
     */
    function showTagNext() {
        clearTimeout(timer.tags);
        timer.tags = setTimeout(showTag, switchTimer.tags);
    }

    showTag();

    /**
     * 平台访客数 切换效果
     */
    var bisitorsNumBox = $('#bisitorsNumBox'),
        page1Spans = bisitorsNumBox.find('.box');
    var bisitorsNumlast = '0000000';
    var page1Inner = function () {
        $.ajax({
            url: '?c=api&a=getJinRiLeiJiFangKe',
            type: 'GET',
            cache: false,
            dataType: 'json',
            success: function (data) {
                if (debug) {
                    console.log('今日访客:', data.message);
                }

                var message = data.message;
                var bisitorsNowNum = '0000000';
                if (message === 'Success') {
                    bisitorsNowNum = data.content.toString();
                    page1Spans.each(function (index, ele) {
                        var $ele = $(ele),
                            lastNum = bisitorsNumlast.charAt(index),
                            nowNum = bisitorsNowNum.charAt(index);
                        ele.num = 0;
                        if (lastNum !== nowNum) {
                            // $ele.removeClass('active');
                            var lastSpan = $ele.find('.last');
                            // var nowSpan = $ele.find('.now');
                            lastSpan.html(lastNum);
                            // nowSpan.html(nowNum);
                            // setTimeout(function () {
                            //     $ele.addClass('active');
                            // }, 30);
                        }
                    });
                    bisitorsNumlast = bisitorsNowNum;
                    page1InnerNext();
                }
            },
            error: function (err) {
                if (debug) {
                    console.log('今日访客:', err);
                }
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

    var pieInfo = $('.pieInfo'),
        infoNum = pieInfo.find('.infoNum'),
        pieMark = $('.pieMark');

    /**
     * 获取新老访问量配置
     * @param newData 新客户
     * @param oldData 旧客户
     * @returns {{}}
     */
    function getNewOldOption(ops) {
        var newOldOption = {
            backgroundColor: '#000814',
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

    var showNewOld = function () {
        $.ajax({
            url: '?c=api&a=getOneHourNewVisitorRateByYuYue',
            type: 'GET',
            cache: false,
            dataType: 'json',
            success: function (data) {
                if (debug) {
                    console.log('新老访客:', data.message);
                }

                var message = data.message;
                if (message === 'Success') {
                    var content = data.content;
                    content.newOldData = ~~content.newvalue + ~~content.oldvalue;
                    var newOldOption = getNewOldOption(content);
                    conventionNewOldChart.setOption(newOldOption);
                    infoNum.html(content.newOldData);
                    pieInfo.fadeIn(1000);
                    pieMark.fadeIn(1000);
                    showNewOldNext();
                }
            },
            error: function (err) {
                if (debug) {
                    console.log('新老访客:', err);
                }
                showNewOldNext();
            }
        });
    };

    /**
     * 下一次请求新老访客数据
     */
    function showNewOldNext() {
        clearTimeout(timer.newOld);
        timer.newOld = setTimeout(showNewOld, switchTimer.newOld);
    }

    showNewOld();
    funController.showNewOldFn = showNewOld;

    // 第二屏地图初始化
    conventionMapChart = echarts.init(document.getElementById('conventionMap'));

    // 点击更新热门小区和热门楼盘
    conventionMapChart.on('click', function (ev) {
        if (ev.seriesName === 'citys' || ev.seriesName === 'hotcity') {
            // 更新小区
            showCommunity2(ev.name);
            // 更新楼盘
            showBuilding2(ev.name);
            clearTimeout(timer.page2city);
            timer.page2city = setTimeout(function () {
                funController.map2CityFn(opController.map2Num);
            }, switchTimer.reply);
        }
    });

    var showMap2 = function () {
        // 获取今日预约地图数据
        $.ajax({
            url: '?c=api&a=getOneHourMapByYuYue',
            type: 'GET',
            cache: false,
            dataType: 'json',
            success: function (data) {
                if (debug) {
                    console.log('预约地图:', data.message);
                }
                var message = data.message;
                var province, city, max, min, option;
                if (message === 'Success') {
                    province = data.content.province;
                    city = data.content.city;
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
                    // 今日访客地图配置项
                    option = getmapOption({
                        type: 'map2',
                        max: max,
                        min: min,
                        province: provinceArr,
                        city: city
                    });
                    // 设置地图数据
                    setTimeout(function () {
                        conventionMapChart.setOption(option);
                    }, 30);

                    // 城市轮询
                    var hotcityListLen = hotCityList.length;
                    var hotCityPolling = function (num) {
                        var n = num % hotcityListLen;
                        // 更新小区
                        showCommunity2(hotCityList[n]);
                        // 更新楼盘
                        showBuilding2(hotCityList[n]);
                        // 更新地图点
                        conventionMapChart.dispatchAction({
                            type: 'showTip',
                            seriesIndex: 2,
                            name: hotCityList[n]
                        });
                        clearTimeout(timer.page2city);
                        timer.page2city = setTimeout(function () {
                            hotCityPolling(++n);
                            // 存轮询index 方便再次开启
                            opController.map2Num = n;
                        }, switchTimer.city2);
                    };
                    // 默认进页面显示全国 延时5s 开始城市轮询
                    clearTimeout(timer.page2city);
                    timer.page2city = setTimeout(function () {
                        hotCityPolling(0);
                    }, switchTimer.city2);
                    funController.map2CityFn = funController.map2CityFn || hotCityPolling;
                    showMap2Next();
                }
            },
            error: function (err) {
                if (debug) {
                    console.log('预约地图:', err);
                }
                showMap2Next();
            }
        });
    };

    /**
     * 下次请求地图数据
     */
    function showMap2Next() {
        clearTimeout(timer.page1map);
        timer.page2map = setTimeout(showMap2, switchTimer.map2);
    }

    showMap2();
    funController.map2Fn = showMap2;

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
                if (debug) {
                    console.log('预约小区:', data.message);
                }

                var message = data.message;
                if (message === 'Success') {
                    updateCommunity(data.content, '#conventionCommunity');
                } else {
                    updateCommunity([], '#conventionCommunity');
                }
            },
            error: function (err) {
                if (debug) {
                    console.log('预约小区:', err);
                }
            }
        });
    }

    showCommunity2();

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
                if (debug) {
                    console.log('访客楼盘:', data.message);
                }
                var message = data.message;
                if (message === 'Success') {
                    updateBuilding(data.content, '#conventionBuilding');
                } else {
                    updateBuilding([], '#conventionBuilding');
                }
            },
            error: function (err) {
                if (debug) {
                    console.log('访客楼盘:', err);
                }
            }
        });
    }

    showBuilding2();


    /**
     * 平台预约数
     */

    var conventionNumBox = $('#conventionNumBox'),
        page2Spans = conventionNumBox.find('.box');
    var conventionNumlast = '0000000';
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
                if (debug) {
                    console.log('今日预约:', data.message);
                }
                var message = data.message;
                var conventionNowNum = '0000000';
                if (message === 'Success') {
                    conventionNowNum = data.content.toString();
                    page2Spans.each(function (index, ele) {
                        var $ele = $(ele),
                            lastNum = conventionNumlast.charAt(index),
                            nowNum = conventionNowNum.charAt(index);
                        ele.num = 0;
                        if (lastNum !== nowNum) {
                            // $ele.removeClass('active');
                            var lastSpan = $ele.find('.last');
                            // var nowSpan = $ele.find('.now');
                            lastSpan.html(lastNum);
                            // nowSpan.html(nowNum);
                            // setTimeout(function () {
                            //     $ele.addClass('active');
                            // }, 30);
                        }
                    });
                    conventionNumlast = conventionNowNum;
                    page2InnerNext(++jiekouNum);
                }
            },
            error: function (err) {
                if (debug) {
                    console.log('今日预约:', err);
                }
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
    funController.page2NumFn = page2Inner;

    /**
     * 房价涨幅榜
     */
    var barChartXf = $('.barChartXf'),
        xfBar = barChartXf.find('.bar');
    var barChartEsf = $('.barChartEsf'),
        esfBar = barChartEsf.find('.bar');
    var barLen = xfBar.length;


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
            barE = xfBar;
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
                    cityValue.html(item.value.toFixed(2) + '%').css('top', -(val + 25));
                } else {
                    label.css('height', -val).addClass('reverse');
                    title.html(item.city);
                    cityValue.html(item.value.toFixed(2) + '%').css('top', 35 - val);
                }
            }
        });
    }

    /**
     * 房价涨幅榜
     * @param groupName
     */
    function price(groupName) {
        $.ajax({
            url: '?c=api&a=getFangJiaZhangFu',
            type: 'GET',
            cache: false,
            data: {
                groupName: groupName || 'xf'
            },
            dataType: 'json',
            success: function (data) {
                if (debug) {
                    console.log('房价涨幅:', data.message);
                }

                var message = data.message;
                if (message === 'Success') {
                    updatePriceDom(data.content, groupName);
                }
            },
            error: function (err) {
                if (debug) {
                    console.log('房价涨幅:', err);
                }
                price(groupName);
            }
        });
    }

    swipers.conventionBarTitle = new Swiper('#rTitle', {
        spaceBetween: 10,
        direction: 'vertical'
    });

    swipers.conventionBar = new Swiper('#barChart', {
        autoplay: switchTimer.bar,
        autoplayDisableOnInteraction: false,
        effect: 'coverflow',
        speed: 1000,
        slidesPerView: 1,
        modifier: 10,
        onInit: function () {
            price('xf');
            price('esf');
        },
        onSlideChangeStart: function (swiper) {
            if (swiper.activeIndex >= 2) {
                // 切换到esf
                price('esf');
            } else {
                // 切换到xf
                price('xf');
            }

            if (swiper.activeIndex === 2) {
                swipers.conventionBarTitle.slideTo(1);
            }
            if (swiper.activeIndex === 0) {
                swipers.conventionBarTitle.slideTo(0);
            }
        }
    });
});
