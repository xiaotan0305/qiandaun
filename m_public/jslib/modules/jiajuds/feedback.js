/**
 * Created by xuying20151110
 */
define('modules/jiajuds/feedback', ['jquery'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        // 问题
        var newQuestionDes = $('#newQuestionDes');
        var submitQuestion = $('#submitQuestion');
        var submitUrl = vars.jiajuSite + '?c=jiajuds&a=ajaxAddNewQuestion';
        var userContects = $('#userContects');
        var lock = false;

        // 添加提交问题成功后地址
	
        $('.btn3').attr('href', vars.sucUrl);

        // 反馈类型
        var FeedbackType;
        $('#select').find('li').on('click', function () {
            $('#select').find('li').children().attr('class', 'nosel');
            $(this).find('span').attr('class', 'sel');
            FeedbackType = $(this).attr('data-value');
            console.log(FeedbackType);
        });

        submitQuestion.on('click', function () {
            if (newQuestionDes.val()) {
                if (lock) {
                    return;
                }
                lock = true;

                $.ajax({
                    type: 'POST',
                    url: submitUrl,
                    data: {
                        nettype: vars.nettype,
                        mobiletype: vars.mobiletype,
                        sysType: vars.sysType,
                        imei: vars.imei,
                        appVersion: vars.appVersion,
                        city: vars.city,
                        // 问题类型
                        FeedbackType: FeedbackType,
                        link: $('#userContects').val(),
                        question: newQuestionDes.val()
                    },
                    success: function (data) {
                        lock = false;
                        if (data.IsSuccess) {
                            $('#sucTip').show();
                        } else {
                            alert(data.ErrorMsg);
                        }
                    }
                });
            } else {
                alert('请输入您的问题！');
            }
        });
    };
});
