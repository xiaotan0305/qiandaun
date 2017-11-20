define('main',['jquery'],function (require, exports, module){
	var $ = require('jquery');
    require.async(['commonFunction'],function(commonFunction){
        commonFunction.init();// 初始化页面效果
    });
    require.async('zfMap',function(zfMap){
        zfMap.init();// 初始化地图
    });
});