pie.js Release 说明文档

1.功能

    (1).看房团信息填写
    (2).获取验证码信息

2.用法
   (1).看房团信息填写
   var kftOptions = {
                               // 姓名
                               kftname: $('#kftname'),
                               // 报名人数
                               kftnum: $('#kftnum'),
                               // 输入手机号
                               kftphone: $('#kftphone'),
                               // 获取验证码
                               kftcode: $('#kftcode'),
                               // 填写验证码
                               kftcodewrite: $('#kftcodewrite'),
                               // 取消
                               kftcancel: $('#kftcancel'),
                               // 提交
                               kftsubmit: $('#kftsubmit')
                         };
            kftHouseGroup = new houseGroup(kftOptions,showfn);

            其中：取消按钮根据实际情况传即可
            showfn为回调函数，点击提交后要执行的函数
            回调参数：ajaxOptions = {
            kftphone，
            kftcodewrite，
            kftname，
            kftnum
            以及提交按钮上的data-XXX
            }
    (2).获取验证码信息
     var options = {
                               // 输入手机号
                               phone: $('#phone'),
                               // 获取验证码
                               code: $('#code'),
                               // 填写验证码
                               codewrite: $('#codewrite'),
                               // 提交
                               submit: $('#submit')
                         };
            var houseGroup = new houseGroup(options,showfn);