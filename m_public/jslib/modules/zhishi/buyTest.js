/**
 * create by zhangjinyu
 * 20160509
 */
define('modules/zhishi/buyTest', ['jquery'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        // 解决页面脚靠上问题
        var oBox = document.querySelector('.testBox');
        var bHeight = document.body.offsetHeight - 132;
        oBox.style.minHeight = bHeight + 'px';
        // 输入城市的文本框
        var testCity = $('#testCity');
        // 确认按钮
        var confirmCity = $('#confirmCity');
        // 错误浮层
        var tsBox = $('.ts-box');
        // 城市范围数组
        var cityNames = vars.onlyCitys;

        // 显示错误浮层
        var showErr = function (msg) {
            tsBox.html(msg);
            tsBox.show();
            setTimeout(function () {
                tsBox.hide();
            }, 2000);
        };
        // 点击确定按钮跳转
        confirmCity.on('click', function () {
            var testCityVal = testCity.val();
            if (testCityVal === '') {
                showErr('请输入您查询的城市名称~');
            } else if (cityNames.indexOf(testCityVal) === -1) {
                showErr('您输入的城市不在测试范围内！！！');
            } else {
                window.location.href = vars.zhishiSite + '?c=zhishi&a=ajaxBuyTest&cityname=' + testCityVal;
            }
        });
        // 获取所有的城市JSON字符串
        var str = vars.allCitys;
        // 将JSON城市字符串转化为JSON对象
        var arrayCity = JSON.parse(str);
        var arrayCityLen = arrayCity.length;
        // 联想出来的城市容器  联想出来的城市列表
        var searcyList = $('.searcyList');
        // 联想查询出来的城市
        var arrayCitySelect = [];

        // 根据输入的首字母联想查询city
        function selectCity(cityname) {
            arrayCitySelect = [];
            // 遍历城市JSON对象
            for (var i = 0; i < arrayCityLen; i++) {
                // 判断输入的城市字符串不为空 并且该字符串存在于该城市JSON对象中
                if (cityname !== '' && (arrayCity[i].cityEn.indexOf(cityname.toLowerCase()) === 0 || arrayCity[i].cityZh.indexOf(cityname) === 0)) {
                    // 把满足条件的城市全部放入arryCitySelect数组中
                    arrayCitySelect.push(arrayCity[i]);
                }
            }
            return arrayCitySelect;
        }

        // 可能要填的城市列表
        function liSelectCity() {
            // 初始化工作
            if (tsBox.is(':visible')) {
                tsBox.hide();
            }
            searcyList.empty();
            // 输入的city值
            var cityValue = testCity.val();
            var arrcity = selectCity(cityValue);
            var licity = '';
            // 如果输入的城市字符串有匹配的结果
            if (arrcity.length > 0) {
                for (var i = 0; i < arrcity.length; i++) {
                    licity = licity + '<li enname=' + i + ' data-enCity=' + arrcity[i].cityEn + '>' + arrcity[i].cityZh + '</li>';
                }
                // 将匹配的城市列表插入到联想城市列表容器中
                searcyList.append(licity).show();
                // 如果联想返回的结果为一条并且输入的是中文城市
                if (arrcity.length === 1 && cityValue === arrcity[0].cityZh) {
                    // 隐藏联想城市容器
                    searcyList.hide();
                    testCity.val(arrcity[0].cityZh);
                    testCity.data('enCity', arrcity[0].cityEn);
                }
            } else {
                // 没有联想出城市数据 隐藏联想城市容器
                searcyList.hide();
            }
        }
        // 点击浮层某个选项，填充到文本框
        searcyList.on('click', 'li', function () {
            var citySelect = $(this);
            testCity.val(citySelect.html());
            testCity.data('enCity', citySelect.data('enCity'));
            citySelect.addClass('cur');
            searcyList.hide();
        });
        // 城市输入框添加input监听事件
        testCity.on('input', liSelectCity);
        // 微信分享
        var summary = '10月1日起，北京、武汉上调首付比例，天津、郑州、成都、无锡、济南重启限购，想知道你能买房吗？首付是多少吗？';
        var title = '测购房资格';
        var imgUrl = 'http:' + vars.public + '201511/images/zsBuyTest.jpg';
        var shareUrl = location.href.split('#')[0];
        // 获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
        var wxurl = vars.imgUrl.replace('zhishi', 'jiaju') + 'other_js/jweixin-1.0.0.js';
        (function () {
            require.async(wxurl, function (wx) {
                wx.config({
                    debug: false,
                    // 必填，公众号的唯一标识
                    appId: vars.appId,
                    // 必填，生成签名的时间戳
                    timestamp: vars.timestamp,
                    // 必填，生成签名的随机串
                    nonceStr: vars.nonceStr,
                    // 必填，签名，见附录1
                    signature: vars.signature,
                    // 必填，需要使用的JS接口列表，所有JS接口列表见附录2*/
                    jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage']
                });

                wx.ready(function () {
                    wx.onMenuShareTimeline({
                        // 分享标题
                        title: title,
                        // 分享链接
                        link: shareUrl,
                        imgUrl: imgUrl
                    });
                    wx.onMenuShareAppMessage({
                        title: title,
                        desc: summary,
                        link: shareUrl,
                        imgUrl: imgUrl
                    });
                });
            });
        })();
    };
});
