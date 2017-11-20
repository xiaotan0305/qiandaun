/**
 * 小区详情页插入地图
 * 赵天亮
 * 20170207
 */
define('modules/map/loudongMap', ['jquery','mapAPI/1.0.1/mapAPI'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        // jquery库
        var $ = require('jquery');
        // 地图插件
        var mapAPI = require('mapAPI/1.0.1/mapAPI');
        // 页面传入参数
        var vars = seajs.data.vars;
        // localStorage
        var localS = localStorage.getItem('visitedPoint' + mapinfo.ProjInfo.newcode);
        // 将localS转化成数组
        var localSArr = [];
        // 本页面小区newcode参数
        var newcode = mapinfo.ProjInfo.newcode;
        // 详细信息框
        var alertDiv = $('.xqldopen');
        // 自定义描点函数
        var buildMarkerDomFunc = function (info) {
            // 按是否点击过来添加类名
            var cls = '';
            if (localS) {
                // 将localS转化成数组
                localSArr = localS.split(';');
                for (var i = 0,len = localSArr.length; i < len; i++) {
                    if (info.dongid === localSArr[i]) {
                        cls = 'visited';
                    }
                }
            }
            var dealNum = info.dealNum? info.dealNum: '';
            // 自定义覆盖物
            var html = '<div class="m-bd ' + cls+ '" data-floor="' + info.floor + '" data-buildage="' + info.buildage + '" data-dealNum="' + dealNum + '" data-BuildCategory="' + info.BuildCategory + '" data-loudongId="' + info.dongid + '" data-x="' + info.baidu_coord_x + '" data-y=" ' + info.baidu_coord_y + ' "><p>' + info.dongname + '</p></div>';
            return html;
        };
        var close = $('.close');
        close.on('click', function () {
            alertDiv.hide();
            $('.m-bd').removeClass('active');
        });
        $('.main').css({'min-height': 0});
        // 描点事件
        var markerFunc = function (map) {
            var markers = map.getOverlays();
            map.addEventListener('click', function () {
                for (var i = 0; i < markers.length; i++){
                    $(markers[i]._container).find('.active').removeClass('active');
                }
                alertDiv.hide();
            });
            map.addEventListener('tilesloaded', function () {
                $('html,body').animate({scrollTop:0});
            });
            for (var i = 0; i < markers.length; i++) {
                markers[i].addEventListener('touchend', function () {
                    var that = this;
                    var $that = $(this);
                    // 点击的描点移动到中心
                    var point = new BMap.Point($(that._container).find('.m-bd').attr('data-x'), $(that._container).find('.m-bd').attr('data-y'));
                    map.centerAndZoom(point, map.getZoom());
                    // 点击的点移动到上方
                    $(that._container).css({zIndex: Math.abs($(that._container).css('zIndex'))}).siblings().css({zIndex: -Math.abs($(that._container).css('zIndex'))});
                    // 可能改变  要重新获取
                    localS = localStorage.getItem('visitedPoint' + mapinfo.ProjInfo.newcode);
                    $that.addClass('active');
                    // 样式操作
                    if (!$(that._container).siblings('').find('.active').hasClass('visited')) {
                        $(that._container).siblings('').find('.active').addClass('visited');
                    }
                    $(that._container).find('.m-bd').addClass('visited active').end().siblings('').find('.m-bd').removeClass('active');

                    // 信息框操作
                    alertDiv.find('.bb').text($($that[0]._content).text());
                    var buildStyle = '';
                    if ($($that[0]._content).attr('data-BuildCategory')) {
                        buildStyle = $($that[0]._content).attr('data-BuildCategory');
                    }else if (mapinfo.ProjInfo.projtype) {
                        buildStyle = mapinfo.ProjInfo.projtype;
                    }else {
                        buildStyle = '暂无';
                    }
                    alertDiv.find('.style').text(buildStyle);
                    alertDiv.find('.age').text($($that[0]._content).attr('data-buildage'));
                    alertDiv.find('.floor').text($($that[0]._content).attr('data-floor'));
                    var dealHtml = $($that[0]._content).attr('data-dealNum')? '<span>成交：</span><p class="deal">' + $($that[0]._content).attr('data-dealNum') + '</p>': '';
                    alertDiv.find('li').eq(3).html(dealHtml);
                    alertDiv.show();

                    // 楼栋id
                    var dongid = $($that[0]._content).attr('data-loudongId');
                    // 添加localstorage  当没有localstorage时  直接添加
                    if (!localS) {
                        localStorage.setItem('visitedPoint' + newcode, dongid + ';');
                    // 有localstorage时 判断是否点过  如果没点过再添加
                    }else {
                        localSArr = localS.split(';');
                        var len = localSArr.length - 1;
                        // 是否已经点击过
                        var visitedFlag = true;
                        for (var i = 0; i < len; i++) {
                            if (dongid === localSArr[i]) {
                                visitedFlag = false;
                            }
                        }
                        if (visitedFlag) {
                            localStorage.setItem('visitedPoint' + newcode, localS + dongid + ';');
                        }
                    }
                    
                });
            }
        };
        // ajax地址
        var mainSite = vars.protocol + vars.mapSite + '?';
        // 初始化地图配置
        var options = {
            // 地图容器id
            container: 'allmap',
            // 设置地图类型
            mapType: !1,
            // 是否需要设置地图大小, 默认不设置
            isSetSize: !0,
            // 地图中心点纬度  默认天安门纬度
            lat: mapinfo.ProjInfo.coord_y,
            // 地图中心点经度  默认天安门经度
            lng: mapinfo.ProjInfo.coord_x,
            // 初始化时地图的缩放等级  默认12  范围3-19
            zoom: 17,
            // 是否绑定拖拽和缩放事件
            isBindEvent: !1,
            // 最大最小级别
            minZoom: 15,
            maxZoom: 17,
            // 对描点和地图的操作  默认为null
            markerFunc: markerFunc,
            // 描点是不是自适应显示在可视区内 默认为true
            autoSize: !1,
            markerData: {
                // 地址
                url: mainSite,
                // 传输类型, 默认'GET'
                type: 'GET',
                dataType: 'json',
                // 参数, 默认为空{}
                data: {
                    c: vars.currentChannel,
                    a: 'ajaxLouDong',
                    city: vars.city,
                    newcode: mapinfo.ProjInfo.newcode
                }
            },
            prop: {
                // 数据中存放经度的变量名  默认Lng
                lngProp: 'baidu_coord_x',
                // 数据中存放纬度的变量名  默认Lat
                latProp: 'baidu_coord_y',
                // 数据中存放纬度的变量名, 不传代表直接返回描点数组
                ajaxDataArrayProp: '',
                // 数据中存放dom格式的变量名默认cusDom, 也可以传函数
                cusDom: buildMarkerDomFunc
            }
        };
        var map = new mapAPI(options);
    };
    
    
});