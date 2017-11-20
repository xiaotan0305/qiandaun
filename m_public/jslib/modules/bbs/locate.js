/**
 * 定位js
 * by blue
 * 20151123 blue 整理代码，删除冗长代码，增加注释，修改Util的getCookie方法返回为null时的判断改为判断为空
 * 20160530 tankunpeng 增加切换城市提示弹窗功能
 */
define('modules/bbs/locate', ['jquery'], function (require) {
    'use strict';
    // jquery库
    var $ = require('jquery');

    var navGeo = navigator.geolocation;
    var vars = seajs.data.vars;


    // 获取定位数据类
    var Locate = {
        /**
         * 获取定位
         */
        get_location: function (callback) {
            var that = this;
            if (navGeo) {
                // 如果能够是用定位api时，获取当前位置
                navGeo.getCurrentPosition(function (position) {
                    that.geo_success(position,callback);
                }, function (error) {
                    that.geo_error(error,callback);
                }, {
                    timeout: 5000,
                    maximumAge: 60000,
                    enableHighAccuracy: false
                });
            } else {
                alert('您的浏览器不支持GPS定位服务！');
            }
        },

        /**
         * 获取定位成功
         * @param position 获取到的定位信息
         */
        geo_success: function (position,callback) {
            var that = this;
            // 设置获取位置成功标识
            that.ispos = 1;
            // 分别获取经纬度
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;

            // 异步调用传入当前定位的经纬度，根据接口地址获取当前城市定位
            // !!!这里要注意是接口的键值有问题，x变成了纬度，y变成了经度，在页面中通用的时候方式是x为经度，y为纬度
            $.ajax({
                type: 'get',
                url: vars.bbsSite + '?c=bbs&a=positionChange&lat=' + latitude + '&lng=' + longitude,
                async: true,
                success: function (data) {
                    callback && callback(data);
                }
            });
        },


        /**
         * 定位失败操作
         * @param error
         */
        geo_error: function (error,callback) {
            callback && callback(error);
        }

    };
    return Locate;
});