weixin Release 说明文档

1.功能

    微信分享功能组件

2.用法
    a. 支持cmd amd 引用
        //分享功能
        define('weixin/weixinshare', ['weixin/jweixin-1.0.0'], function () {
            var wx = require('weixin/jweixin-1.0.0');
            // 其中微信的四个必填参数 appId timestamp nonceStr signature 不能为空
            var weixin = new Weixin({
                // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                debug: false,
                // 必填，公众号的唯一标识
                appId: '',
                // 必填，生成签名的时间戳
                timestamp: '',
                // 必填，生成签名的随机串
                nonceStr: '',
                // 必填，签名，见附录1
                signature: '',
                shareTitle: '搜房网活动~',
                descContent: '搜房网活动,邀您一起来玩啊~',
                lineLink: location.protocol + '//m.fang.com/',
                imgUrl: location.protocol + '//js.soufunimg.com/common_m/m_public/201511/images/logo.png'
            });
        });
    b.非模块化调用
        // 引入微信sdk
        <script src="//js.test.soufunimg.com/common_m/m_activity/public/jslib/weixin/jweixin-1.0.0.js" charset="utf-8"></script>
        // 引入插件
        <script src="//js.test.soufunimg.com/common_m/m_activity/public/jslib/weixin/weixinshare.js" charset="utf-8"></script>
        其他同a
    c. 改变微信分享内容如标题 图片 描述等
       // 有些活动 赶进入页面 需要有一个静态分享内容,等游戏或活动结束后 需要把游戏结果分享出去需要改变分享内容
       weixin.updateOps({
                shareTitle: '搜房网活动~',
                descContent: '搜房网活动,邀您一起来玩啊~',
                lineLink: location.protocol + '//m.fang.com/',
                imgUrl: location.protocol + '//js.soufunimg.com/common_m/m_public/201511/images/logo.png'
            });
        });


