/**
 * Created by hanxiao on 2017/12/5.
 */
define('modules/bask/answerNow', ['jquery'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;

        var textarea = $('.inptext');
        var title = $('#title');
        var card = $('#cardflag');
        textarea.on('focus', function () {
            title.fadeOut(1000);
            $('.tarea').css('margin-top', '10px');
        });

        textarea.on('blur', function () {
            $('.tarea').css('margin-top', '0px');
            title.fadeIn(1000);
        });

        // 插入名片
        card.on('click', function(){
            if (textarea.val().trim().length < 100) {
                showMsg('回答字数超过100个字，才能插入名片哦~');
                return false;
            }
            if ($(this).hasClass('cur')) {
                $(this).removeClass('cur');
            } else {
                $(this).addClass('cur');
            }
        });

        var cardflag = 0;
        var flagBool = true;
        $('#submit').on('click', function(){
            // 如果已经提交过了当再次点击时直接退出 不再进行ajax请求
            if (!flagBool) {
                return false;
            }
            if (textarea.val() === '' || textarea.val() === '请输入您的回答') {
                showMsg('请输入您的回答');
                return false;
            }

            // 内容中不许包含手机号
            var myreg=/[1][2,3,4,5,7,8][0-9]{9}/g;
            if (textarea.val().match(myreg)) {
                showMsg('请不要在回答中留手机号哦~');
                return false;
            }

            if (textarea.val().trim().length > 500) {
                showMsg('最多输入500个字');
                return false;
            }

            cardflag = card.hasClass('cur') ? 1 : 0;
            // 将用户提问的相关数据提交到后台处理
            $.ajax({
                type : 'POST',
                url : vars.askSite + '?c=bask&a=ajaxAnswerNow',
                data : {
                    id : vars.id,
                    content : textarea.val(),
                    cardflag : cardflag
                },
                success : function(data) {
                    if (data.code === '100') {
                        // 提交成功加锁
                        flagBool = false;
                        showMsg('回答成功');
                        window.location.href = vars.askSite + '?c=bask&a=newdetail&id=' + vars.id + '&r=' + Math.random();
                    } else {
                        showMsg(data.message);
                    }
                },
                error : function(){
                    showMsg('回答失败请重试');
                }
            });
        });

        // 提示弹层
        function showMsg(msg){
            $('#floatTip').text(msg);
            $('#floatTip').show();
            setTimeout(function(){
                $('#floatTip').hide();
            }, 1500);
        }

        /**
         * 免费提问输入文本长度检验 6-150
         */
        var $this, thisLen;
        var $wordsTip = $('#wordsTip');
        textarea.on('input',function(){
            $this = $(this);
            thisLen = $this.val().trim().length;
            if (thisLen && thisLen <= 500) {
                $wordsTip.text(thisLen);
                $wordsTip.removeClass('err');
            } else {
                $wordsTip.text(thisLen);
                $wordsTip.addClass('err');
            }
        });
    };
});
