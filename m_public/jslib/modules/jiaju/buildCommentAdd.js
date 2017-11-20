/**
 * Created by LXM on 2015/9/15.
 */
define('modules/jiaju/buildCommentAdd', ['jquery'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        $('input[type=hidden]').each(function (index, element) {
            vars[$(this).attr('data-id')] = element.value;
        });
        var $content = $('#content');
        var $sendCom = $('#sendCom');

        // 获取输入的内容数量
        var changnum = function () {
            var textnum = $content.val().length;
            $('#p1').text(textnum);
            if (textnum) {
                $sendCom.addClass('active');
            } else {
                $sendCom.removeClass('active');
            }
        };
        $content.on('input change', function () {
            changnum();
        });
        function stopDefault(e) {
            // 阻止默认浏览器动作(W3C)
            if (e && e.preventDefault) {
                e.preventDefault();
            }// IE中阻止函数器默认动作的方式
            else {
                window.event.returnValue = false;
            }
            return false;
        }

        // 点击当前的笑脸 添加样式
        var stars = 5;
        $('.flexbox').on('click', 'li', function (e) {
            var $this = $(this);
            $this.siblings().find('a').removeClass('cur');
            $this.children('a').addClass('cur');
            stars = $this.children('a').attr('data-id');
            stopDefault(e);
        });
        function submit() {
            var data = {
                pid: vars.pid,
                did: vars.did,
                cid: vars.cid,
                stars: stars,
                content: encodeURIComponent($content.val())
            };
            var Url = vars.jiajuSite + '?c=jiaju&a=ajaxBuildCommentAdd&r=' + Math.random();
            $.ajax({
                url: Url,
                data: data,
                type: 'GET',
                async: false,
                success: function (q) {
                    if ($.trim(q) == 'OK') {
                        $('#eval').hide();
                        $('#suc').show();
                    } else {
                        alert('评论失败');
                        window.history.back(-1);
                    }
                }
            });
        }

        // 提交评论
        $sendCom.on('click', function () {
            // 判断按钮是灰色 则不可点击
            if ($('#sendCom').hasClass('active')) {
                submit();
            } else {
                return false;
            }
        });

    };
});
