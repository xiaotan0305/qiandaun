/*
 *房下媛活动
 * zhangcongfeng@fang.com
 */
window.onload = function () {
    var pageBtn1 = document.getElementById('nextpage1');
    pageBtn1.addEventListener('click', function () {
        document.getElementById('secondpage').style.display = 'block';
        document.getElementById('firstpage').style.display = 'none';
    });
    var pageBtn2 = document.getElementById('nextpage2');
    pageBtn2.addEventListener('click', function () {
        document.getElementById('thirdpage').style.display = 'block';
    });
    var pageBtn3 = document.getElementById('nextpage3');
    pageBtn3.addEventListener('click', function () {
        document.getElementById('fourpage').style.display = 'block';
    });
    var pageBtn4 = document.getElementById('nextpage4');
    pageBtn4.addEventListener('click', function () {
        document.getElementById('fivpage').style.display = 'block';
    });
    var pageBtn5 = document.getElementById('nextpage5');
    pageBtn5.addEventListener('click', function () {
        document.getElementById('sixpage').style.display = 'block';
    });
    // 设置微信分享的内容
    var hidevar = document.getElementsByTagName('input');
    var l = hidevar.length;
    var obj = {};
    for (var i = 0; i < l; i++) {
        var key = hidevar[i].getAttribute('data-id');
        obj[key] = hidevar[i].value;
    }
    wx.config({
        // 必填，公众号的唯一标识
        appId: obj.appId,
        // 必填，生成签名的时间戳
        timestamp: obj.timestamp,
        // 必填，生成签名的随机串
        nonceStr: obj.nonceStr,
        // 必填，签名
        signature: obj.signature,
        // 必填，需要使用的JS接口列表，所有JS接口列表见附录2*/
        jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage']
    });
    wx.ready(function () {
        // 获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
        wx.onMenuShareTimeline({
            title: '\u623f\u5c0f\u5a9b\u76f8\u4eb2\u8bb0',
            // 分享标题
            link: obj.linkUrl,
            // 分享链接
            imgUrl: obj.imgUrl
            // 分享图标
        });
        // 获取“分享给朋友”按钮点击状态及自定义分享内容接口
        wx.onMenuShareAppMessage({
            title: '\u623f\u5c0f\u5a9b\u76f8\u4eb2\u8bb0',
            link: obj.linkUrl,
            imgUrl: obj.imgUrl
        });
    });
};
 