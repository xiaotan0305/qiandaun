define('modules/myesf/pageOfOwnerComment', ['jquery'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        $('input[type=hidden]').each(function (index, element) {
            vars[$(this).attr('data-id')] = element.value;
        });
        // 点击星星完成对应的满意度评分
        $('.ico-star').on('click', 'i', function () {
            var $this = $(this);
            var parent = $this.parent();
            var idx = $this.index() + 1;
            parent.find('i').removeClass('active');
            parent.find('i:lt(' + idx + ')').attr('class', 'active');
        });
        // 用户输入字数检测
        var $tsC = $('.ts');
        $('#comment').on('input', function () {
            var $this = $(this);
            var contentLen = $this.val().length;
            $tsC.text(contentLen + '/200');
        });

        $('#submit').on('click', function () {
            var score = $('.ico-star').find('i[class*="active"]').length;
            if (!(score > 0)) {
                alert('忘记打分啦！');
                return;
            }
            var comment = $('#comment').val();
            if (comment.length > 200) {
                alert('请输入少于200的字数');
                return;
            }
            $.ajax({
                url: '/my/?c=myesf&a=ajaxSubmitOwnerComment',
                data: {appearance: score, content: comment, houseId: vars.houseId, agentid: vars.agentId},
                dataType: 'json',
                type: 'GET',
                success: function (data) {
                    if (data && data.result === '1') {
                        alert('您的评价已成功！');	
                        window.location = '/my/?c=myesf&a=weituoAgentListDS&city=' + vars.city + '&houseid=' + vars.houseId 
						+ '&indexid=' + vars.indexId + '&ProjCode=' + vars.ProjCode + '&oldId=' + vars.oldId + '&type=1';
                    } else if (data.message) {
						alert(data.message);
					} else {
                        alert('对不起，请稍候重试');
                    }
                },
                error: function () {
                    alert('请求出错，请稍候重试');
                }
            });
        });
    };
});