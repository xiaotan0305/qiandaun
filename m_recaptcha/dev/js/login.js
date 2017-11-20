(function(window, $) {

    // 调用验证控件，
    window.fCheck.init({
        container: '.drag-content',
        url: "/act/?c=recaptcha&a=index",
        // width:200,
        // height:150,
        callback: function() {
            // 验证成功后的回调
            console.log('验证成功');
        }
    });

    /**
     * 表单提交
     */
    $('.btn').on('click', function() {
        var username = $('input[name=username]');
        if (username.val() === '') {
            alert('请输入用户名');
            return false;
        }
        var password = $('input[name=password]');
        if (password.val() === '') {
            alert('请输入密码');
            return false;
        }
        var password2 = $('input[name=password2]');
        if (password2.val() === '') {
            alert('请输入确认密码');
            return false;
        }
        if (password.val() != password2.val()) {
            alert('两次输入的密码不一致，请重新输入');
            return false;
        }
        // 判断是否操作了验证组件。
        if (fCheck.config.result === null) {
            alert('验证码错误');
            return false;
        }
        var data = $.extend({
            username: username.val(),
            password: password.val()
        }, fCheck.config.result);
        $.post('/act/?c=recaptcha&a=login', data, function(data, textStatus, xhr) {
            if (data.code === '100') {
                alert('验证通过，你的注册资料已提交成功！')
            } else {
                alert('验证未通过，你的注册资料提交失败！')
            }
        });
    });

})(this, jQuery);