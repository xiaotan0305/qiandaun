define('entry/login', [
    'modules/toast'
], function (require) {

    const vars = window.vars;
    const loginDomain = vars.loginDomain;

    require('modules/toast');

    console.log('hello login~');

    let $pwd = $('#pwd');
    $pwd.on('keydown keyup', function (ev) {
        if (ev.keyCode === 13) {
            ev.preventDefault();
            return $('#login').trigger('click');
        }
    });

    $('#login').on('click', function () {
        let pwd = $pwd.val();
        if (!pwd) {
            $.Toast('错误', '请输入密码', 'error');
            return false;
        }
        $.ajax({
            url: vars.domainLogin,
            type: 'post',
            data: {pwd: pwd}
        })
        .done(function (res) {
            if (res.code === '100') {
                $.Toast('提示', res.msg, 'success',function () {
                    location.href = decodeURIComponent(res.burl);
                });
            }else {
                $.Toast('错误', res.msg, 'error');
            }
        });
    });

});
