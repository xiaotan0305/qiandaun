/**
 * Created by hanxiao on 2017/08/02.
 */
define('modules/job/editResume', ['jquery'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        // 文档jquery对象索引
        var $doc = $(document);
        // 页面传入的数据
        var vars = seajs.data.vars;
        /*var nameInput = $('#nameInput');
        $('.edit-icon').on('click', function() {
            nameInput.parent().show();
        });
        nameInput.on('blur', function() {
            $('#resumeName').text($(this).val());
            $(this).parent().hide();
        });*/
        $('#complete').on('click', function(){
            $.ajax({
                url: '?c=job&a=ajaxSubmitResume',
                data : {
                    haveResume : vars.haveResume,
                },
                type: 'POST',
                success: function (data) {
                    if (data.errCode === '0') {
                        showMsg('简历提交成功');
                        window.location = vars.jobSite + '?c=job&a=editResume';
                    } else {
                        showMsg(data.Msg);
                    }
                }
            });
        });
        // 信息提示弹层
        var floatAlert = $('#floatAlert');
        function showMsg(str, time) {
            time = time || 2000;
            floatAlert.show();
            floatAlert.text(str);
            setTimeout(function(){
                floatAlert.hide();
            }, time);
            return false;
        }
        floatAlert.on('click', function() {
            $(this).hide();
        });
    }
});