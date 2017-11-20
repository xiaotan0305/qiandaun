(function(window, $) {

    // 调用验证控件，
    window.fCheck.init('.drag-content',"/act/?c=checkcode&a=index");

    /**
     * 表单提交
     */
    $('.btn').on('click', function() {
        var username = $('input[name=username]');
        if (username.val() === ''){
            alert('请输入用户名');
            return false;
        }
        var password = $('input[name=password]');
        if (password.val() === ''){
            alert('请输入密码');
            return false;
        }
        // 判断是否操作了验证组件。
        if (fCheck.config.result === null){
            alert('验证码错误');
            return false;
        }
        var data = $.extend({username: username.val(), password: password.val()}, fCheck.config.result);
        $.post('/act/?c=checkcode&a=login', data, function(data, textStatus, xhr) {
            if (data.code === '100') {
                alert('验证通过，提交成功！')
            }
        });
    });

})(this, jQuery);