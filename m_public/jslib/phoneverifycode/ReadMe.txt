phoneverifycode Release 说明文档

1.功能

    发送手机验证码、验证手机发送的验证码，以实现用户注册或登录  给其他部门用的

2.用法

    a.非模块化调用
        // 请求获取验证码
        verifycode.getPhoneVerifyCode(phonestr,service,
            function () {
                // 获取验证码失败 回掉此函数/自己的
                getcallbackSucess('get code right!');
                }, function () {
                // 获取验证码失败 回掉此函数/自己的
                getcallbackFail('get code fail!');
            });

//-------验证验证码同上--只是函数名和参数有变--如下-----------------------------
        verifycode.sendVerifyCodeAnswer(phonestr, codestr,service,
            function () {
                // 获取验证码失败 回掉此函数/自己的
                sendcallbackSucess('send code right!');
                }, function () {
                // 获取验证码失败 回掉此函数/自己的
                sendcallbackFail('send code fail!');
            });

3.注意事项
    a.内部接口调用是写死的，并且只支持m.test.fang.com和m.fang.com域名下调用，否者接口会返回错误；
    b.该插件依赖jquery;
    c.此插件的自行传入各自所用service
    d.验证验证码就已经实现啦登录，且在cookie中已存入sfut用户信息
