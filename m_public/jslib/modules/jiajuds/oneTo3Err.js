/**
 * modified by 张达亮 on 15.9.23
 */
define('modules/jiajuds/oneTo3Err', ['jquery'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        $('input[type=hidden]').each(function (index, element) {
            vars[$(this).attr('data-id')] = element.value;
        });
        // 微信分享
        wx.config({
            // 必填，公众号的唯一标识
            appId: vars.appId,
            // 必填，生成签名的时间戳
            timestamp: vars.timestamp,
            // 必填，生成签名的随机串
            nonceStr: vars.nonceStr,
            // 必填，签名，见附录1
            signature: vars.signature,
            //  必填，需要使用的JS接口列表，所有JS接口列表见附录2
            jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage']
        });
        var shareurl = vars.jiajuSite + '?c=jiajuds&a=oneToThree&src=clientwx';
        wx.ready(function () {
            //  获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
            wx.onMenuShareTimeline({
                //  分享标题
                title: '3000元礼包大放送，房天下装修，只为您精致的家！',
                link: shareurl,
                // 分享图标
                imgUrl: vars.public + 'img/app_jiaju_logo.png'
            });
            // 获取“分享给朋友”按钮点击状态及自定义分享内容接口
            wx.onMenuShareAppMessage({
                //  分享标题
                title: '3000元礼包大放送，房天下装修，只为您精致的家！',
                //  分享描述
                desc: '我刚刚领取了3000元装修券，你也来试试吧！',
                link: shareurl,
                // 分享图标
                imgUrl: vars.public + 'img/app_jiaju_logo.png'
            });
        });
        // 重新支付
        $('#repay').on('click', function () {
            var ajaxUrl = vars.jiajuSite + '?c=jiajuds&a=ajaxCreateOrder2&city=' + vars.city + '&r=' + Math.random();
            var jsondata = {soufunid: vars.userid, realname: vars.realname, phone: vars.mobilephone};
            $.ajax({
                type: 'get',
                url: ajaxUrl,
                data: jsondata,
                success: function (obj) {
                    if (obj.issuccess === '1') {
                        $('#biz_id').val(obj.detail.biz_id);
                        $('#call_time').val(obj.detail.call_time);
                        $('#charset').val(obj.detail.charset);
                        $('#extra_param').val(obj.detail.extra_param);
                        $('#invoker').val(obj.detail.invoker);
                        $('#notify_url').val(obj.detail.notify_url);
                        $('#out_trade_no').val(obj.detail.out_trade_no);
                        $('#paid_amount').val(obj.detail.paid_amount);
                        $('#platform').val(obj.detail.platform);
                        $('#total').val(obj.detail.price);
                        $('#quantity').val(obj.detail.quantity);
                        $('#return_url').val(obj.detail.return_url);
                        $('#service').val(obj.detail.service);
                        $('#sign_type').val(obj.detail.sign_type);
                        $('#title').val(obj.detail.title);
                        $('#trade_amount').val(obj.detail.trade_amount);
                        $('#trade_type').val(obj.detail.trade_type);
                        $('#user_id').val(obj.detail.user_id);
                        $('#version').val(obj.detail.version);
                        $('#sign').val(obj.detail.sign);
                        $('#origin').val(obj.detail.origin);
                        $('#subject').val(obj.detail.subject);
                        $('#form').submit();
                    } else {
                        alert(obj.errormessage);
                        return false;
                    }
                }
            });
        });
    };
});