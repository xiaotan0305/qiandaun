/**
 * 定位js
 * by blue
 * 20151123 blue 整理代码，删除冗长代码，增加注释，修改Util的getCookie方法返回为null时的判断改为判断为空
 * 20160530 tankunpeng 增加切换城市提示弹窗功能
 */
define('modules/index/locate', ['jquery', 'util'], function (require) {
    'use strict';
    // jquery库
    var $ = require('jquery');
    // 工具集
    var Util = require('util');
    // !!!用处不明
    var addr = Util.getCookie('addr');
    // 获取城市拼音缩写
    var curcity = $('#curcity').html();
    // 获取城市中文cookie
    var zhcityCookie = Util.getCookie('zhcity');
    // 获取城市cookie
    var encityCookie = Util.getCookie('encity');
    // 获取取消显示定位弹层信息
    var cancellocation = Util.getCookie('cancellocation');
    // 维度
    var latitudeH = Util.getCookie('geolocation_x');
    // 经度
    var longitudeH = Util.getCookie('geolocation_y');
    // 定位提示浮层 当访问城市名与实际定位名不符时弹出
    var citySwitch = $('#citySwitch'),
        csCurrentCity = $('#csCurrentCity'),
        csCancel = $('#csCancel'),
        csConfirm = $('#csConfirm');
    var errtype = 0,
        // 获取显示当前位置容器
        $locabox = $('.locabox'),
        // 获取显示当前城市的内容
        $addr = $locabox.find('#addr'),
        // 获取重新获取当前位置按钮
        $loading = $('#loading'),
        // 定位api索引
        navGeo = navigator.geolocation;
    var vars = seajs.data.vars;

    // 如果有定位信息,执行回调
    if (latitudeH && longitudeH && encityCookie === curcity) {
        vars.getPosSuc && vars.getPosSuc({
            x: longitudeH,
            y: latitudeH
        });
    }
    // 获取定位数据类
    var Locate = {

        /**
         * 是否获取位置成功标识
         */
        ispos: null,

        /**
         * 获取定位
         */
        get_location: function () {
            var that = this;
            if (navGeo) {
                // 如果能够是用定位api时，获取当前位置
                navGeo.getCurrentPosition(function (position) {
                    that.geo_success(position);
                }, function (error) {
                    that.geo_error(error);
                }, {
                    timeout: 10000,
                    maximumAge: 60000,
                    enableHighAccuracy: false
                });
            } else {
                alert('您的浏览器不支持GPS定位服务！');
            }
        },
        show_map1: function (position) {
            var that = this;
            that.ispos = 1;
            // 维度
            var latitude = position.coords.latitude;
            // 经度
            var longitude = position.coords.longitude;
            // 比较获取的经纬度与之前的经纬度对比，没有变化则提示
            if (latitude === latitudeH && longitude === longitudeH) {
                // alert('您的位置没有变化，请稍候再试！');
                return;
            }

            /**
             * 调用接口传入经纬度获取当前位置
             */
            $.ajax({
                url: '/local.d?m=locationbd&geox=' + latitude + '&geoy=' + longitude,
                success: function (data) {
                    var city = data.root.city;
                    var encity = data.root.encity;
                    var addr1 = data.root.addr;
                    if (addr1) {
                        // 如果当前定位城市不等
                        if (curcity !== encity) {
                            $addr.html(addr1);
                        } else if (addr1 === addr) {
                            // alert('您的位置没有变化，请稍候再试！');
                        }
                        Util.setCookie('zhcity', city, 30);
                        Util.setCookie('encity', encity, 30);
                        Util.setCookie('addr', addr1, 30);
                        Util.setCookie('geolocation_x', latitude, 30);
                        Util.setCookie('geolocation_y', longitude, 30);
                    } else {
                        errtype = 1;
                        that.getCityByIp();
                    }
                }
            });
        },

        /**
         * 获取定位成功
         * @param position 获取到的定位信息
         */
        geo_success: function (position) {
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
                url: '/local.d?m=locationbd&geox=' + latitude + '&geoy=' + longitude,
                async: true,
                success: function (data) {
                    // 当前城市中文
                    var encity = data.root.encity;
                    // 当前城市缩写
                    var city = data.root.city;
                    // 当前显示的城市名，这里和城市中文的区别是显示为‘北京市’
                    var addr = data.root.addr;
                    if (addr) {
                        // 如果当前定位城市不等
                        if (curcity !== encity && !cancellocation) {
                            that.showPostionFloat(city, encity);
                        }
                        // 如果当前定位城市等
                        if (curcity === encity) {
                            vars.getPosSuc && vars.getPosSuc({
                                x: longitude,
                                y: latitude
                            });
                        }
                        $addr.html(addr);
                        $loading.hide();
                        Util.setCookie('zhcity', city, 30);
                        Util.setCookie('encity', encity, 30);
                        Util.setCookie('addr', addr, 30);
                        // 维度
                        Util.setCookie('geolocation_x', latitude, 30);
                        // 经度
                        Util.setCookie('geolocation_y', longitude, 30);
                    } else {
                        that.getCityByIp();
                    }
                }
            });
        },

        /**
         * 获取定位失败
         */
        geo_error1: function () {
            var that = this;
            errtype = 1;
            that.getCityByIp();
        },

        /**
         * 请求
         * @param paras
         * @returns {*}
         */
        request: function (paras) {
            var url = location.href;
            var findPos = url.indexOf('#');
            if (findPos > 0) {
                url = url.substring(0, findPos);
            }
            var paraString = url.substring(url.indexOf('?') + 1, url.length).split('&');
            var paraObj = {};
            var i = 0, j = 0;
            for (; j = paraString[i]; i++) {
                paraObj[j.substring(0, j.indexOf('=')).toLowerCase()] = j.substring(j.indexOf('=') + 1, j.length);
            }
            var returnValue = paraObj[paras.toLowerCase()] || '';
            return returnValue;
        },

        /**
         * 定位失败操作
         * @param error
         */
        geo_error: function (error) {
            var that = this;
            // 如果不是拒绝共享位置则通过ip获取位置
            that.getCityByIp();
        },

        /**
         * 根据ip获取城市
         */
        getCityByIp: function () {
            var that = this;
            // 获取位置成功
            that.ispos = 1;

            /**
             * 异步调用接口通过ip获取当前位置数据
             */
            $.ajax({
                url: '/local.d?m=getcitybyip&r=' + Math.random(),
                success: function (data) {
                    var encity = data.root.encity;
                    var city = data.root.city;
                    var addr = data.root.addr;
                    if (addr) {
                        // 如果当前定位城市不等
                        if (curcity !== encity && !cancellocation) {
                            that.showPostionFloat(city, encity);
                        }
                        // 设置显示城市
                        $addr.html(addr);
                        $loading.hide();
                        Util.setCookie('zhcity', city, 30);
                        Util.setCookie('encity', encity, 30);
                        Util.setCookie('addr', addr, 30);
                    } else {
                        // 使用定位api也失败了则显示定位失败
                        if (errtype === 1) {
                            alert('定位失败！');
                            errtype = 0;
                            return;
                        }
                        // 设置用户提示是否手动选择城市
                        var conf = confirm('定位失败,您可以手动选择城市!');
                        if (conf) {
                            window.location = '/ipWelcome/index.jsp';
                        }
                    }
                }
            });
        },

        /**
         * 显示定位弹层
         * @param name 显示的定位中文信息
         * @param encity 城市英文缩写
         */
        showPostionFloat: function (name, encity) {
            csCurrentCity.html(name).attr('data-encity', encity);
            citySwitch.show();
        }
    };
    // alert(encityCookie + ':::' + curcity);
    // 可以使用cookie并且没有第一次定位或者第一次定位失败
    if (addr) {
        $locabox.show();
        $addr.html(addr);
        $loading.hide();
        // 显示定位信息弹层
        if (encityCookie !== curcity && !cancellocation) {
            Locate.showPostionFloat(zhcityCookie, encityCookie);
        }
    } else if (navigator.cookieEnabled) {
        // 判断是否为客户端打开，如果不是则获取定位
        if (Locate.request('src') !== 'client' && Util.getCookie('from') !== 'client') {
            Locate.get_location();
        } else {
            // 是客户端，设置cookie为clinet，并且为session性质
            Util.setCookie('from', 'client', 0);
            $locabox.hide();
        }
    }

    // 设置cookie存入当前城市缩写
    Util.setCookie('mencity', curcity, 30);

    /**
     * 点击重新获取当前位置按钮操作
     */
    $loading.on('click', function () {
        navGeo.getCurrentPosition(function (position) {
            Locate.show_map1(position);
        }, function (error) {
            Locate.geo_error1(error);
        }, {
            timeout: 10000,
            maximumAge: 60000,
            enableHighAccuracy: false
        });
    });

    /**
     * 点击定位提示弹窗 确定或者取消按钮
     */
    csConfirm.on('click', function () {
        var targetCity = csCurrentCity.attr('data-encity');
        citySwitch.hide();
        if (targetCity) {
            location.replace(location.href.replace(curcity, targetCity));
        }
    });
    csCancel.on('click', function () {
        citySwitch.hide();
        Util.setCookie('cancellocation', '1', 30);
    });
    return Locate;
});