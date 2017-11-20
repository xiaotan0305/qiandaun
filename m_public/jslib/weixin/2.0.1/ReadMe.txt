weixin Release 说明文档
@update 增加对搜房app的支持

1.功能

    微信/qq/qq空间分享功能组件
    更新:
        1.同时支持微信\qq\qq空间分享自定义 加了判断 不会浪费js加载
        2.调用方法比1.0.1更精简
        3.不再需要调用 微信/qq/qq空间的依赖sdk,插件自主调用

2.用法
    a. 支持cmd amd 引用
        //分享功能
        var Weixin = require('weixin/2.0.0/weixinshare');
        new Weixin({
            // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            debug: false,
            shareTitle: '搜房网活动~',
            descContent: '搜房网活动,邀您一起来玩啊~',
            lineLink: location.protocol + '//m.fang.com/',
            imgUrl: location.protocol + '//js.soufunimg.com/common_m/m_public/201511/images/logo.png',
            // 对调标题 和 描述(微信下分享到朋友圈默认只显示标题,有时需要显示描述则开启此开关,默认关闭)
            swapTitle: false
        }[,function (res) {
            // 分享成功回调
        },function (res) {
            // 分享失败回调
        }]);
    b.非模块化调用
        // 引入插件
        <script src="//static.soufunimg.com/common_m/m_public/jslib/weixin/2.0.0/weixinshare.js" charset="utf-8"></script>
        var weixin = new Weixin({
            // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            debug: false,
            shareTitle: '搜房网活动~',
            descContent: '搜房网活动,邀您一起来玩啊~',
            lineLink: location.protocol + '//m.fang.com/',
            imgUrl: location.protocol + '//js.soufunimg.com/common_m/m_public/201511/images/logo.png',
            // 对调标题 和 描述(微信下分享到朋友圈默认只显示标题,有时需要显示描述则开启此开关,默认关闭)
            swapTitle: false
        }[,function (res) {
            // 分享成功回调
        },function (res) {
            // 分享失败回调
        }]);
    c. 改变微信分享内容如标题 图片 描述等
       // 有些活动 赶进入页面 需要有一个静态分享内容,等游戏或活动结束后 需要把游戏结果分享出去需要改变分享内容
       weixin.updateOps({
                shareTitle: '搜房网活动~',
                descContent: '搜房网活动,邀您一起来玩啊~',
                lineLink: location.protocol + '//m.fang.com/',
                imgUrl: location.protocol + '//js.soufunimg.com/common_m/m_public/201511/images/logo.png'
            });
        });


