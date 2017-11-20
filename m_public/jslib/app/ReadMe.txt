app.js Release 说明文档

1.功能

    1.0.0/appdownload.js： 下载App

    1.0.0/appopen.js： 打开App

2.用法

    1.0.0/appdownload.js：

    require.async('app/1.0.0/appdownload', function ($) {
        $('.btn').openApp('');
    });



版本说明

v 1.0.3

通行证登录用，自动打开app
只负责打开app, 条件判断在通行证登录页面。