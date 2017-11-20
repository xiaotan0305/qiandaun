superShare.js Release 说明文档
by sunwenxiu

1.功能
微信好友朋友圈QQ好友分享
使用方法范例
2.用法
先引入superShare.css样式表
在页面写入分享的图标代码：
    <div class="body-text">
        <section class="article-wrapper">
            <div class="share-wrapper">
                <div class="share-wrapper-inner">
                    <em>分享到</em>
                    <span class="share-list">
                        <a href="javascript:;" class="sprite-icons-movement sns" data-app="wechattimeline"></a>
                        <a href="javascript:;" class="sprite-icons-wechat sns" data-app="wechatfriends"></a>
                        <a href="javascript:;" class="sprite-icons-sina sns" data-app="sinaweibo"></a>
                        <a href="javascript:;" class="sprite-icons-qzone sns" data-app="qzone"></a>
                        <a href="javascript:;" class="sprite-icons-qq sns" data-app="qq"></a>
                    </span>
                </div>
            </div>
        </section>
    </div>
 a. 支持cmd amd 引用
  define('superShare/1.0.0/superShare', function () {
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
                         form: '房天下'
                     };
             new SuperShare(config);
         });

 b.非模块化调用
        // 引入插件
        <script src="//js.test.soufunimg.com/common_m/m_activity/public/jslib/superShare/1.0.0/superShare.js" charset="utf-8"></script>
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
                         form: '房天下'
                     };
             new SuperShare(config);



