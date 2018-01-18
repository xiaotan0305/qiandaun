superShare.js Release 说明文档
by tankunpeng

1.功能
微信好友朋友圈QQ好友分享
使用方法范例
2.用法
    a. 支持cmd amd 引用
        var SuperShare = require('superShare/2.0.0/superShare');
        var config = {
             // 分享的内容title
             title: '分享测试',
             // 分享时的图标
             image: 'http://js.soufunimg.com/common_m/m_index/img/soufun.png',
             // 分享内容的详细描述
             desc: '分享测试的详细描述',
             // 分享的链接地址
             url: 'http://m.test.fang.com/news/?c=bbs&a=wx',
             // 分享的内容来源
             form: '房天下',
             // 详细设置
             wechattimeline: {
                title: '分享测试',
                image: 'http://js.soufunimg.com/common_m/m_index/img/soufun.png',
                desc: '分享测试的详细描述',
                url: 'http://m.test.fang.com/news/?c=bbs&a=wx',
                form: '房天下'
             },
             wechatfriends:{},
             qq:{},
             qzone:{},
             sinaweibo:{}
         };
        var superShare = new SuperShare(config);
        // 2.0版本不再在插件中绑定.share类了，需要外部自行调用
        // 2.0版本只提供share方法，供外部调用
        $(document).on('click','.share',function () {
            // 如果有需要可以更新配置文件
            // 适用于一个页面多个分享的情况
            if ([判断单独分享条件]) {
                var config = {
                     // 分享的内容title
                     title: '分享测试',
                     // 分享时的图标
                     image: 'http://js.soufunimg.com/common_m/m_index/img/soufun.png',
                     // 分享内容的详细描述
                     desc: '分享测试的详细描述',
                     // 分享的链接地址
                     url: 'http://m.test.fang.com/news/?c=bbs&a=wx',
                     // 分享的内容来源
                     form: '房天下',
                     // 详细设置
                    wechattimeline: {},
                    wechatfriends:{},
                    qq:{},
                    qzone:{},
                    sinaweibo:{}
                 };
                 superShare.updateConfig(config);
            }
            superShare.share();
        });



 b.非模块化调用
        // 引入插件
        <script src="//static.soufunimg.com/common_m/m_public/jslib/jquery/2.1.4/jquery.js" charset="utf-8"></script>
        <script src="//static.soufunimg.com/common_m/m_public/jslib/UA/1.0.0/UA.js" charset="utf-8"></script>
        <script src="//static.soufunimg.com/common_m/m_public/jslib/superShare/2.0.0/superShare.js" charset="utf-8"></script>
API;
            var config = {
                         // 分享的内容title
                         title: '分享测试',
                         // 分享时的图标
                         image: 'http://js.soufunimg.com/common_m/m_index/img/soufun.png',
                         // 分享内容的详细描述
                         desc: '分享测试的详细描述',
                         // 分享的链接地址
                         url: 'http://m.test.fang.com/news/?c=bbs&a=wx',
                         // 分享的内容来源
                         form: '房天下',
                        // 详细设置
                         wechattimeline: {},
                         wechatfriends:{},
                         qq:{},
                         qzone:{},
                         sinaweibo:{}
                     };
            var superShare = new SuperShare(config);
            // 2.0版本不再在插件中绑定.share类了，需要外部自行调用
            // 2.0版本只提供share方法，供外部调用
            $(document).on('click','.share',function () {
                // 如果有需要可以更新配置文件
                // 适用于一个页面多个分享的情况
                if ([判断单独分享条件]) {
                    var config = {
                         // 分享的内容title
                         title: '分享测试',
                         // 分享时的图标
                         image: 'http://js.soufunimg.com/common_m/m_index/img/soufun.png',
                         // 分享内容的详细描述
                         desc: '分享测试的详细描述',
                         // 分享的链接地址
                         url: 'http://m.test.fang.com/news/?c=bbs&a=wx',
                         // 分享的内容来源
                         form: '房天下',
                        // 详细设置
                        wechattimeline: {},
                        wechatfriends:{},
                        qq:{},
                        qzone:{},
                        sinaweibo:{}
                     };
                     superShare.updateConfig(config);
                }
                superShare.share();
            });



