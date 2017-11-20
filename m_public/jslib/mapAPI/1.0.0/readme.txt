mapAPI说明文档

1功能

	基础地图操作及描点操作  可自定义描点样式  

2.用法及参数说明
	模块化使用
	var mapAPI = require('mapAPI/1.0.0/mapAPI');
	// 初始化地图配置
    var options = {
        // 地图容器id, 默认allmap
        container: 'allmap',
        // 是否需要设置地图大小, 默认不设置
        isSetSize: !1,
        // 地图中心点纬度  默认天安门纬度
        lat: vars.lat,
        // 地图中心点经度  默认天安门经度
        lng: vars.lng,
        // 缩放级别最小值  默认3
         minoom: 3,
        // 缩放级别最小大值  默认19
         maxZoom: 19,
        // 初始化时地图的缩放等级  默认12  范围3-19
        zoom: 12,
        // 是否绑定拖拽和缩放事件, 默认不绑定
        isBindEvent: !1,
        // 对描点和地图的操作 ,此函数参数为BMap实例,可在回调中使用BMap的相关函数, 默认为null
        markerFunc: markerFunc,
        // 拖拽地图后的操作, 此函数参数为mapApi实例,可在回调中使用相关函数,  默认为null;
        dragFunc: dragFunc,
        // 缩放地图后的操作, 此函数参数为mapApi实例,可在回调中使用相关函数,  默认为null;
        zoomFunc: zoomFunc,
        // 描点是不是自适应显示在可视区内 默认为true
        autoSize: !0,
        // markerData可以传入描点数组. 最常见业务是传入ajax地址及参数.
        markerData: {
            // 地址
            url: url,
            // 传输类型, 默认'GET'
            type: 'GET',
            // 参数, 默认为空{}
            data: {}
        },
        prop: {
            // 数据中存放经度的变量名  默认Lng
            lngProp: 'Lng',
            // 数据中存放纬度的变量名  默认Lat
            latProp: 'Lat',
            // 数据中存放纬度的变量名, 不传代表直接返回描点数组
            ajaxDataArrayProp: 'List',
            // 数据中存放dom格式的变量名默认cusDom, 也可以传函数
            cusDom: buildMarkerDomFunc
        }
    };
	var map = new mapAPI(options);
