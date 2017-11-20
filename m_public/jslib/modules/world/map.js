/**
 * @file merge js files,ESLint
 * @author zcf(zhangcongfeng@fang.com)
 */
define('modules/world/map',['jquery', 'modules/world/yhxw'], function (require,exports,module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var preload = [];
        preload.push('map/gmapapi');
        preload.push('http://maps.gstatic.cn/maps-api-v3/api/js/19/9/intl/zh_cn/main.js');
        require.async(preload);
        require.async('map/gmapapi',function (google) {
            require.async(['http://maps.gstatic.cn/maps-api-v3/api/js/19/9/intl/zh_cn/main.js'],function () {
                var point = new google.maps.LatLng(vars.mapx,vars.mapy);
                var mapOptions = {
                    center: point,
                    zoom: 15,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };
                var map = new google.maps.Map(document.getElementById('container'), mapOptions);
                // 创建地图实例
                var marker = new google.maps.Marker({
                    // 创建标注
                    position: point,
                    map: map
                });
            });
        });

        // 引入用户行为分析对象-埋码
        var yhxw = require('modules/world/yhxw');
        // 判断详情页种类，传入用户行为统计对象
        var pageId = 'mwhousemappage';
        // 埋码变量数组
        var maiMaParams = {
            // 页面标识
            'vmg.page': pageId
        };
        // 添加用户行为分析
        yhxw({type: 0, pageId: pageId, params: maiMaParams});

        var wrapper = $('.wrap');
        wrapper.css('height', window.innerHeight + 100);
        window.scrollTo(0, 1);
        wrapper.css('height', window.innerHeight);
        var boxheight = 50;
        if (document.getElementById('maphead')) {
            boxheight = 181;
        }
        $('#container').css('height', window.innerHeight - boxheight);
        document.addEventListener('touchmove', function (e) {
            e.preventDefault();
        });
        var bua = navigator.userAgent.toLowerCase();
        if (bua.indexOf('iphone') !== -1 || bua.indexOf('ios') !== -1) {
            // 判断系统类型，显示客户端下载图片
            $('#clientpic').attr('src', 'http://img2.soufun.com/wap/touch/img/ipd.png');
        }
    };
});