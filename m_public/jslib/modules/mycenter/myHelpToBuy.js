define('modules/mycenter/myHelpToBuy', ['jquery'], function (require) {
    'use strict';
    var $ = require('jquery');
    // var vars = seajs.data.vars;
    // 列表显示隐藏点击
    $('#addition').on('click', function () {
        $('#usrMenu').toggleClass('none');
    });
    $('#usrMenu').on('click', 'li', function () {
        window.location.href = $('#usrList li a').eq($(this).index()).attr('href');
    });
});