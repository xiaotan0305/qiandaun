/**
 * @file 装修馆地图页
 * @author 
 * 
 */
define('modules/jiaju/firmMap', ['jquery', 'mapAPI/1.0.0/mapAPI', 'modules/jiaju/yhxw'], function (require, exports, module) {
    'use strict';
    var vars = seajs.data.vars;
    var $ = require('jquery');
    var yhxw = require('modules/jiaju/yhxw');
    if (vars.CompanyID) {
        yhxw({
            page: 'mjjcompanymappage',
            companylat: vars.lat,
            companylng: vars.lng,
            companyid: vars.CompanyID
        });
    } else {
        yhxw({
            page: 'mjjcompanymaplist'
        });
    }
   
    var mapAPI = require('mapAPI/1.0.0/mapAPI');
    var SFMap = {
        api: {
            // 不移动地图时获取公司坐标ajax
            GET_COMPANYMAPLIST: 'ajaxFirmMapList',
            // 移动地图时的ajax
            GET_COMPANYMAPCHANGE: 'ajaxFirmMapMove'
        },

        // 初始化，在页面加载后根据列表或搜索页所传参数进行一次搜索，并且绑定地图事件
        init: function () {
            var that = this;
            // 百度定位类
            that.geolocation = new BMap.Geolocation();
            // 描点完毕后执行
            var markerFunc = function (map) {
                var allmap = $('#allmap');
                // 绑定描点点击事件
                allmap.off('touchend').on('touchend', '.m-zx', function (e, isCodeTrigger) {
                    e.preventDefault();
                    var $this = $(this);
                    if (!isCodeTrigger) {
                        // 设置居中
                        map.setCenter(new BMap.Point($this.data('y'), $this.data('x')));
                    }
                    // 恢复为非active样式
                    var oldActive = allmap.find('.m-zx.active');
                    // 设置单个tip显示  如果当前点击对象没有类名active时
                    if ($this.length && !$this.hasClass('active')) {
                        oldActive.removeClass('active').siblings().hide();
                        $this.addClass('active').siblings().show();
                        // 当前点击对象有类名active时
                    } else if ($this.length && $this.hasClass('active')) {
                        $this.removeClass('active').siblings().hide();
                    }
                });
                // 点击tips时跳转到该公司详细介绍页
                allmap.on('touchend', '.map-compName3', function (e) {
                    e.preventDefault();
                    var $this = $(this), detailUrl, src = vars.src ? '&src=' + vars.src : '';
                    // 点击不为去这里
                    if (e.target.id !== 'go') {
                        detailUrl = vars.protocol + vars.jiajuSite + '?c=jiaju&a=zxCompanyDetail&companyid=' + $this.data('compid')
                        + '&city=' + vars.city + src;
                        window.location.href = detailUrl;
                    } else {
                        var marker = $this.siblings('.m-zx');

                        // 优先使用列表页来的用户位置,否则自己定位
                        if (vars.userLat && vars.userLng) {
                            // 点击去这里
                            detailUrl = 'http://api.map.baidu.com/direction'
                                + '?origin=' + vars.userLat + ',' + vars.userLng
                                + '&destination=' + marker.data('x') + ',' + marker.data('y')
                                + '&mode=driving&region=' + vars.cityname + '&output=html&src=yourCompanyName';
                            window.location.href = detailUrl;
                        } else {
                            that.geolocation.getCurrentPosition(function (r) {
                                if (this.getStatus() === BMAP_STATUS_SUCCESS) {
                                    // 点击去这里
                                    detailUrl = 'http://api.map.baidu.com/direction'
                                        + '?origin=' + r.point.lat + ',' + r.point.lng
                                        + '&destination=' + marker.data('x') + ',' + marker.data('y')
                                        + '&mode=driving&region=' + vars.cityname + '&output=html&src=yourCompanyName';
                                    window.location.href = detailUrl;
                                }
                            }, {enableHighAccuracy: true});
                        }

                    }
                });
                // 如果是公司详情页则默认显示tips:传递参数表示代码触发,使描点不居中.
                if (vars.CompanyID) {
                    $('#allmap div .map-compName3[data-compid=' + vars.CompanyID + ']').siblings('.m-zx').trigger('touchend', !0);
                }
            };
            // url参数
            var url = vars.protocol + vars.jiajuSite,
                data = {
                    c: 'jiaju', city: vars.city, a: that.api.GET_COMPANYMAPLIST
                };
            // 判断vars中是否有CompanyID，如多有加载单条  没有加载多条
            vars.CompanyID && (data.CompanyID = vars.CompanyID);
            // 拖拽回调
            var dragFunc = function (api) {
                // data.a = that.api.GET_COMPANYMAPCHANGE;
                // $.extend(data, that.map.gethdBounds());
                // api.buildMarkers(data);
            };

            // 自定义描点函数
            var buildMarkerDomFunc = function (info) {

                // 自定义覆盖物
                var html = ''
                    + '<div class="m-zx" data-x="' + info.posy + '" data-y="' + info.posx + '"  style="left: -11px;top: -24px;"></div>'
                    + '<div class="map-compName3 none" style="left: -145px;bottom: 30px;" data-compid="' + (info.id || '') + '">'
                    + '<a href="javascript:void(0)">'
                    + '<div class="map-compTxt">'
                    + '<div class="wzxx">'
                    + '<h3 class="name"><span class="flor range">' + info.distance
                    + '</span>' + info.storename + '</h3>'
                    + '<p>' + info.address + '</p>'
                    + '</div>'
                    + '<div class="map-btn"><span id="go">去这里</span></div></div>'
                    + '</a>'
                    + '</div>';
                return html;
            };

            // 初始化地图配置
            var options = {
                // 地图容器id  默认allmap  ！！必填
                container: 'allmap',
                // 是否需要设置地图大小, 默认不设置
                isSetSize: !0,
                // 地图中心点纬度  默认天安门纬度
                lat: vars.lat,
                // 地图中心点经度  默认天安门经度
                lng: vars.lng,
                // 初始化时地图的缩放等级  默认12  范围3-19
                zoom: 12,
                // 是否绑定拖拽和缩放事件, 单条时绑定
                isBindEvent: vars.CompanyID,
                // 对描点和地图的操作  默认为null
                markerFunc: markerFunc,
                // 拖拽地图后的操作  默认为null;
                dragFunc: dragFunc,
                // 缩放地图后的操作  默认为null;
                zoomFunc: dragFunc,
                // 描点是不是自适应显示在可视区内 默认为true
                autoSize: !0,
                markerData: {
                    // 地址
                    url: url,
                    // 传输类型, 默认'GET'
                    type: 'GET',
                    // 参数, 默认为空{}
                    data: data
                },
                prop: {
                    // 数据中存放经度的变量名  默认Lng
                    lngProp: 'posx',
                    // 数据中存放纬度的变量名  默认Lat
                    latProp: 'posy',
                    // 数据中存放纬度的变量名, 不传代表直接返回描点数组
                    ajaxDataArrayProp: 'list',
                    // 数据中存放dom格式的变量名默认cusDom, 也可以传函数
                    cusDom: buildMarkerDomFunc
                }
            };
            that.map = new mapAPI(options);

        }
    };
    module.exports = SFMap;
});