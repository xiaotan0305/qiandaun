define('modules/city/locate', ['jquery', 'util/util', 'swipe/swipe', 'iscroll/2.0.0/iscroll-lite'],
    function (require) {
        'use strict';
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var cityBurl = vars.cityBurl;
        var zfSf = vars.zfSf;
        var preload = [];
        // 新消息节点实例
        var newMsgDom = $('.sms-num');
        preload.push('navflayer/navflayer_new2');
        preload.push('miuiyp/miuiyp');
        preload.push('modules/city/gears_init');
        preload.push('modules/city/geo');
        var Util = require('util/util');
        var ispos = null;
        var bua = navigator.userAgent.toLowerCase();
        var burl = document.URL;
        var addr = Util.getCookie('addr');
        var firstlocation = Util.getCookie('firstlocation');
        var curcity = $('#curcity').html();
        var errtype = 0;
        var tail = '.html';
        var $addr = $('#addr');
        var dingweiCity = $('#dingweiCity');
        var loading = $('#loading');
        if (burl.indexOf('esf_') > -1
            || burl.indexOf('schoolhouse') > -1
            || burl.indexOf('/xf') > -1
            || burl.indexOf('/zf') > -1
            || burl.indexOf('/esf') > -1
            || burl.indexOf('/chengjiao') > -1) {
            tail = '/';
        }

        if (cityBurl.indexOf('/jiaju/company') > -1 || cityBurl.indexOf('c=mycenter') > -1 || cityBurl.indexOf('payAskExtra') > -1) {
            burl = cityBurl;
            tail = vars.tail;
        }
        if (cityBurl === '/my' || cityBurl === '/fangjia' || cityBurl.indexOf('companyNewList') > -1 || cityBurl.indexOf('/vip') > -1) {
            tail = vars.tail;
        }
        if (newMsgDom.length > 0) {
            // 判断是否有新消息，如果有插入新消息处理js
            preload.push('newmsgnum/1.0.0/newmsgnum');
        }
        require.async(preload);

        // 定位失败
        function showErr() {
            dingweiCity.attr('class', 'err').html('定位失败');
            loading.attr('class', '');
        }

        // 定位成功
        function showSuccess() {
            dingweiCity.attr('class', 'cityName');
            loading.attr('class', '');
        }


        // 滑动插件
        var IScrollLite = require('iscroll/2.0.0/iscroll-lite');

        var defalutData = [
            ['北京', 'bj'], ['上海', 'sh'], ['广州', 'gz'],
            ['深圳', 'sz'], ['武汉', 'wuhan'], ['重庆', 'cq'],
            ['成都', 'cd'], ['长沙', 'cs'], ['南京', 'nanjing']
        ];
        var searchInput = $('.searbox input');
        var list = $('.searcyList');
        var btn = $('.btn');
        // 纵向滑动插件示例
        var iscroll,
            // 自动提示防止网络问题导致的列表错乱，设置ajax索引
            ajax,
            jumpOk = '',jumpOkcn = '';

        /**
         * 设置城市列表
         * @param arr 城市数据
         */
        function setList(arr) {
            // 清空列表内容
            list.empty();
            if (iscroll) {
                iscroll.destroy();
                iscroll = null;
            }
            // 获取数据长度
            var l = arr.length,
                // 循环索引
                i = 0,
                // 需要插入到城市列表中的html拼接后的字符串
                html = '<div><ul>';
            // 循环遍历所有城市数据，拼接为li节点以供用户点击选择城市使用
            for (; i < l; i++) {
                var data = arr[i];
                // en为城市缩写
                html += '<li data-en=\'' + data[1] + '\' data-cn=\'' + data[0] + '\'>' + data[0] + '</li>';
            }
            // 闭合节点
            html += '</ul></div>';
            // 将字符串html插入到城市列表中
            list.html(html);
            // 初始化滑动插件
            iscroll = new IScrollLite(list.find('div')[0], {
                scrollX: false,
                scrollY: true,
                bindToWrapper: true
            });
        }

        /**
         * 格式化用户输入内容并返回格式化后字符串
         * @param str 用户的输入内容
         * @returns {XML|string|void}
         */
        function inputFormat(str) {
            return str.replace(/[~!@#$%^&*()-+_=:]/g, '');
        }

        // 设置置顶浏览器
        $(window).scrollTop(1);
        // 绑定input事件，执行自动提示操作
        searchInput.on('input focus', function () {
            // 获取格式化后的用户输入
            var inputValue = inputFormat(searchInput.val());
            // 存在用户输入时调用ajax获取城市列表
            if (inputValue) {
                // 当前一个ajax存在时中断
                ajax && ajax.abort();
                // 获取最新启动的ajax
                ajax = $.ajax({
                    url: '/local.d?m=getCityPinyinName&cityName=' + inputValue,
                    dataType: 'json',
                    success: function (data) {
                        jumpOk = '';
                        if (data.length > 0) {
                            if (data.length === 1) {
                                jumpOk = data[0][1];
                                jumpOkcn = data[0][0];
                            }
                            setList(data);
                        } else {
                            list.empty();
                            if (iscroll) {
                                iscroll.destroy();
                                iscroll = null;
                            }
                        }
                    }
                });
            } else {
                // 用户输入为空时传入默认的城市数据
                setList(defalutData);
            }
        });
        // 点击其他位置隐藏选择框操作
        $(window).on('touchstart', function (e) {
            var $target = $(e.target);
            var parent = $target.closest('.searbox');
            if (parent.length < 1) {
                jumpOk = '';
                jumpOkcn = '';
                list.empty();
                if (iscroll) {
                    iscroll.destroy();
                    iscroll = null;
                    searchInput.blur();
                }
            }
        });
        // 事件委托点击城市列表中的li跳转到指定的城市大首页
        list.on('click', 'li', function () {
            var $this = $(this);
            var en = $this.attr('data-en');
            var cn = $this.attr('data-cn');
            if (en) {
                searchInput.val($this.html());
                list.empty();
                if (iscroll) {
                    iscroll.destroy();
                    iscroll = null;
                }
                if (cityBurl.indexOf('zhishi') > -1) {
                    Util.setCookie('mencity', en, 30);
                    window.location.href = cityBurl;
                } else if (cityBurl.indexOf('companyNewList') > -1 || cityBurl.indexOf('/vip') > -1 || cityBurl.indexOf('c=mycenter') > -1) {
                    window.location.href = cityBurl + tail + en;
                } else if(cityBurl.indexOf('payAskExtra') > -1){
                    window.location.href = cityBurl + '&paeCity='+encodeURI(cn);
                }else {
                    window.location.href = cityBurl + '/' + en + tail + zfSf;
                }
            }
        });
        // 绑定keyup事件，执行当手机端点击了键盘上的搜索按钮时操作
        searchInput.on('keyup', function (e) {
            // 判断为手机端点击搜索按钮
            if (e.keyCode === 13 && jumpOk) {
                list.empty();
                if (iscroll) {
                    iscroll.destroy();
                    iscroll = null;
                }
                if (cityBurl.indexOf('zhishi') > -1) {
                    Util.setCookie('mencity', jumpOk, 30);
                    window.location.href = cityBurl;
                } else if (cityBurl.indexOf('companyNewList') > -1 || cityBurl.indexOf('/vip') > -1 || cityBurl.indexOf('c=mycenter') > -1) {
                    window.location.href = cityBurl + tail + jumpOk;
                } else if(cityBurl.indexOf('payAskExtra') > -1){
                    window.location.href = cityBurl + '&paeCity='+encodeURI(jumpOkcn);
                }else {
                    window.location.href = cityBurl + '/' + jumpOk + tail + zfSf;
                }
            }
        });
        btn.on('click', function () {
            jumpOk = jumpOk || curcity || 'bj';
            if (cityBurl.indexOf('zhishi') > -1) {
                Util.setCookie('mencity', jumpOk, 30);
                window.location.href = cityBurl;
            } else if (cityBurl.indexOf('companyNewList') > -1 || cityBurl.indexOf('/vip') > -1 || cityBurl.indexOf('c=mycenter') > -1) {
                window.location.href = cityBurl + tail + jumpOk;
            }else if(cityBurl.indexOf('payAskExtra') > -1){
                window.location.href = cityBurl + '&paeCity='+encodeURI(jumpOkcn);
            } else {
                window.location.href = cityBurl + '/' + jumpOk + tail + zfSf;
            }


        });


        function getCityByIp() {
            ispos = 1;
            var url = '/local.d?m=getcitybyip&rndom=' + Math.random();
            $.ajax({
                type: 'get',
                url: url,
                async: true,
                success: function (data) {
                    var encity = data.root.encity;
                    var city = data.root.city;
                    var addr = data.root.addr;
                    if (addr) {
                        $addr.html(addr);
                        if (curcity !== encity && Util.getCookie('encity') !== encity) {
                            Util.setCookie('zhcity', city, 30);
                            Util.setCookie('encity', encity, 30);
                            Util.setCookie('addr', addr, 30);
                        }
                        showSuccess();
                        if (cityBurl.indexOf('companyNewList') > -1 || cityBurl.indexOf('/vip') > -1 || cityBurl.indexOf('c=mycenter') > -1) {
                            dingweiCity.html('<a href="' + cityBurl + tail + encity + zfSf + '">' + city + '</a>');
                        } else {
                            dingweiCity.html('<a href="' + cityBurl + '/' + encity + tail + zfSf + '">' + city + '</a>');
                        }
                        dingweiCity.attr('class', 'cityName');
                        loading.attr('class', '');
                        Util.setCookie('zhcity', city, 30);
                        Util.setCookie('encity', encity, 30);
                        Util.setCookie('addr', addr, 30);
                    } else {
                        if (errtype === 1) {
                            alert('定位失败！');
                            showErr();
                            errtype = 0;
                            return;
                        }
                        showErr();
                        if (confirm('定位失败,您可以手动选择城市!')) {
                            if (tail === '/accurate.html') {
                                window.location = '/city/hotcity.jsp?city=' + curcity + '&burl=' + cityBurl + '/' + curcity + tail;
                            } else if (burl !== '/jiaju/company' && burl.indexOf('/my/?c=mycenter') < -1) {
                                window.location = '/city/hotcity.jsp?city=' + curcity + '&burl=' + cityBurl;
                            }
                        }
                    }
                }
            });
        }

        function showMap1(position) {
            ispos = 1;
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;
            var latitudeH = Util.getCookie('geolocation_y');
            var longitudeH = Util.getCookie('geolocation_x');
            if (latitude === latitudeH && longitude === longitudeH) {
                alert('您的位置没有变化，请稍候再试！');
                dingweiCity.attr('class', 'cityName');
                loading.attr('class', '');
                return;
            }
            var url = '/local.d?m=locationbd&geox=' + latitude + '&geoy=' + longitude;
            $.ajax({
                type: 'get',
                url: url,
                async: true,
                success: function (data) {
                    loading.attr('class', '');
                    var city = data.root.city;
                    var encity = data.root.encity;
                    var addr1 = data.root.addr;
                    if (addr1) {
                        if (curcity !== encity) {
                            if (cityBurl.indexOf('companyNewList') > -1 || cityBurl.indexOf('/vip') > -1 || cityBurl.indexOf('c=mycenter') > -1) {
                                dingweiCity.html('<a href="' + cityBurl + tail + encity + zfSf + '">' + city + '</a>');
                            } else {
                                dingweiCity.html('<a href="' + cityBurl + '/' + encity + tail + zfSf + '">' + city + '</a>');
                            }
                            $addr.html(addr1);
                            alert('您的位置没有变化，请稍候再试！');
                            dingweiCity.attr('class', 'cityName');
                            loading.attr('class', '');
                        } else if (addr1 === addr) {
                            alert('您的位置没有变化，请稍候再试！');
                            dingweiCity.attr('class', 'cityName');
                            loading.attr('class', '');
                        }
                        if(cityBurl.indexOf('payAskExtra') < 0){    
                        Util.setCookie('zhcity', city, 30);
                        Util.setCookie('encity', encity, 30);
                        Util.setCookie('addr', addr1, 30);
                        Util.setCookie('geolocation_x', longitude, 30);
                        Util.setCookie('geolocation_y', latitude, 30);
                        }
                    } else {
                        errtype = 1;
                        getCityByIp();
                        loading.attr('class', '');
                    }
                }
            });
        }
        if(cityBurl.indexOf('payAskExtra') < 0){
        Util.setCookie('mencity', curcity, 30);
        Util.setCookie('firstlocation', '0', 0);
        }
        function geoSuccess(position) {
            ispos = 1;
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;
            var url = '/local.d?m=locationbd&geox=' + latitude + '&geoy=' + longitude;
            $.ajax({
                type: 'get',
                url: url,
                async: true,
                success: function (data) {
                    var encity = data.root.encity;
                    var city = data.root.city;
                    var addr = data.root.addr;
                    if (addr) {
                        $addr.html(addr);
                        if(cityBurl.indexOf('payAskExtra') < 0){
                        Util.setCookie('zhcity', city, 30);
                        Util.setCookie('encity', encity, 30);
                        Util.setCookie('addr', addr, 30);
                        Util.setCookie('geolocation_x', longitude, 30);
                        Util.setCookie('geolocation_y', latitude, 30);
                        }
                        if (cityBurl.indexOf('companyNewList') > -1 || cityBurl.indexOf('/vip') > -1 || cityBurl.indexOf('c=mycenter') > -1) {
                            dingweiCity.html('<a href="' + cityBurl + tail + encity + zfSf + '">' + city + '</a>');
                        } else {
                            dingweiCity.html('<a href="' + cityBurl + '/' + encity + tail + zfSf + '">' + city + '</a>');
                        }
                        dingweiCity.attr('class', 'cityName');
                        loading.attr('class', '');
                    } else {
                        getCityByIp();
                    }
                }
            });
        }

        function geoError(error) {
            var choicedcity = localStorage.getItem('choicedcity');
            if (!choicedcity) {
                var conf = 0;
                if (error.code === '1') {
                    conf = confirm('您拒绝了共享位置,可手动选择城市!');
                    showErr();
                } else if (error.code === '2') {
                    getCityByIp();
                } else if (error.code === '3') {
                    getCityByIp();
                } else if (conf !== '0') {
                    if (tail === '/accurate.html') {
                        window.location = '/city/hotcity.jsp?city=' + curcity + '&burl=' + cityBurl + '/' + curcity + tail;
                    } else if (burl !== '/jiaju/company' && burl.indexOf('/my/?c=mycenter') < -1) {
                        window.location = '/city/hotcity.jsp?city=' + curcity + '&burl=' + cityBurl;
                    }

                } else {
                    getCityByIp();
                }
            }
            loading.attr('class', '');
        }

        function getLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    geoSuccess(position);
                }, function (error) {
                    geoError(error);
                }, {
                    timeout: 10000,
                    maximumAge: 60000,
                    enableHighAccuracy: false
                });
            } else {
                showErr();
                alert('您的浏览器不支持GPS定位服务！');
            }
        }

        function request(paras) {
            var url = location.href;
            if (url.indexOf('#') > 0) {
                url = url.substring(0, url.indexOf('#'));
            }
            var paraString = url.substring(url.indexOf('?') + 1, url.length).split('&');
            var paraObj = {};
            var i, j;
            for (i = 0; j = paraString[i]; i++) {
                paraObj[j.substring(0, j.indexOf('=')).toLowerCase()] = j.substring(j.indexOf('=') + 1, j.length);
            }
            var returnValue = paraObj[paras.toLowerCase()];
            if (typeof returnValue === 'undefined') {
                return '';
            }
            return returnValue;
        }

        if (navigator.cookieEnabled && !firstlocation && cityBurl.indexOf('payAskExtra') < 0) {
            if (request('src') !== 'client' && Util.getCookie('from') !== 'client') {
                loading.attr('class', 'loading-city');
                dingweiCity.attr('class', 'on');
                dingweiCity.html('定位中');
                getLocation();
            } else {
                Util.setCookie('from', 'client', 0);
            }
        } else if (addr) {
            $addr.html(addr);
        }
        // 定位中
        function showLoading() {
            dingweiCity.attr('class', 'on');
            //	dingweiCity.html('定位中');
            loading.attr('class', 'loading-city');
        }

        function geoError1() {
            errtype = 1;
            getCityByIp();
        }

        loading.on('click', function () {
            showLoading();
            navigator.geolocation.getCurrentPosition(function (position) {
                showMap1(position);
            }, function (error) {
                geoError1(error);
            }, {
                timeout: 10000,
                maximumAge: 60000,
                enableHighAccuracy: false
            });
        });
        // 判断如果有新消息的话，执行新消息操作
        if (newMsgDom.length > 0) {
            require.async(['newmsgnum/1.0.0/newmsgnum'], function (NewMsgNum) {
                new NewMsgNum(vars.mainSite, vars.city).getMsg(newMsgDom);
            });
        }

        /* ****************************************************************** JSP *******************************************************************/
        $('.cityMain').on('click', '.cityclickdom', function () {
            var cityName = $(this).attr('cncity');
            var cityHistory = Util.getCookie('cityHistory');
            var ssarr = [];
            if (!cityHistory) {
                cityHistory = cityName;
            } else {
                ssarr = cityHistory.split(';');
                var i;
                for (i = 0; i < ssarr.length; i++) {
                    if (ssarr[i].indexOf(cityName) >= 0) {
                        ssarr.splice(i, 1);
                    }
                }
                if (ssarr.length > 2) {
                    ssarr.pop();
                }
                ssarr.unshift(cityName);
                var ss = '';
                for (i = 0; i < ssarr.length; i++) {
                    ss += ssarr[i] + ';';
                }
                cityHistory = ss.substring(0, ss.length - 1);
            }
            if(cityBurl.indexOf('payAskExtra') < 0){
            Util.setCookie('cityHistory', cityHistory, 30);
            }
            if (burl.indexOf('zhishi') > -1)
                Util.setCookie('mencity', cityName.split(',')[1], 30);
        });

        var cityHistory = Util.getCookie('cityHistory');
        if (cityHistory && cityBurl.indexOf('payAskExtra') < 0) {
            var cityArr = cityHistory.split(';');
            if (cityArr.length > 0) {
                for (var i = 0; i < cityArr.length; i++) {
                    if (cityArr[i]) {
                        var cityss = cityArr[i].split(','), address;
                        if (cityBurl.indexOf('zhishi') > -1) {
                            address = '<a href="' + cityBurl + '" cncity="' + cityss[0] + ',' + cityss[1] + '" class="cityclickdom">' + cityss[0] + '</a>';
                        } else if (cityBurl.indexOf('companyNewList') > -1 || cityBurl.indexOf('/vip') > -1 || cityBurl.indexOf('c=mycenter') > -1) {
                            address = '<a href="' + cityBurl + tail + cityss[1] + '" cncity="' + cityss[0] + ',' + cityss[1] + '" class="cityclickdom">' + cityss[0] + '</a>';
                        } else {
                            address = '<a href="' + cityBurl + '/'
                                + cityss[1] + tail + zfSf + '" cncity="' + cityss[0] + ',' + cityss[1] + '" class="cityclickdom">' + cityss[0] + '</a>';
                        }
                        $('#zuijin').append(address);
                    }
                }
            }
        } else {
            $('#historyCity').hide();
        }
        
        var zhcity = Util.getCookie('zhcity');
        var encity = Util.getCookie('encity');
        if (zhcity && encity && cityBurl.indexOf('payAskExtra') < 0) {
            if (cityBurl.indexOf('zhishi') > -1) {
                dingweiCity.attr('class', 'cityName').html('<a href="' + cityBurl + '" cncity="' + zhcity + ',' + encity + '" class="cityclickdom">' + zhcity + '</a>');
            } else if (cityBurl.indexOf('companyNewList') > -1 || cityBurl.indexOf('/vip') > -1 || cityBurl.indexOf('c=mycenter') > -1) {
                dingweiCity.attr('class', 'cityName').html('<a href="' + cityBurl + tail + encity + '" cncity="' + zhcity + ',' + encity + '" class="cityclickdom">' + zhcity + '</a>');
            } else {
                dingweiCity.attr('class', 'cityName').html('<a href="' + cityBurl + '/' + encity + tail + zfSf + '" cncity="' + zhcity + ',' + encity + '" class="cityclickdom">' + zhcity + '</a>');
            }
            loading.attr('class', '');
        }
    });