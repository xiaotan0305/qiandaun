/**
 * 房产有舞 2017暨第18届业主大会
 */
define('modules/zhuanti/fangdance', ['jquery'], function(require, exports, module){
	'use strict';
	module.exports = function () {
        // jquery库
        var $ = require('jquery');
        // 页面传入的参数
        var vars = seajs.data.vars;

        /**
         * 提示弹窗
         * @param msg 要显示的文案
         */
        function showMsg(msg) {
            // 意见提交失败的样式,只有网络不好的时候会出现
            var message = $('.outW');
            message.html(msg);
            message.show();
            // 提示框在3秒后隐藏
            setInterval(function () {
                message.hide();
            }, 3000);
        }

        //Logo投票
        $('.votebtn').click(function(){
        	var that = $(this);
        	var id = that.attr('data-value');
        	var num = parseInt(that.prev().text()) + 1;
        	var voteText = num + '<i>+1</i>';
        	$.get(vars.zhuantiSite + '?c=zhuanti&a=logoVote&id=' + id, function (data) {
                if (data.code === '100') {
                	//投票成功
                	that.unbind("click").addClass('yt').text('已投');
                	that.prev().addClass('cur').html(voteText);
                }
        	})
        })

        //意见提交
        var viewBtn = $('#viewBtn');
        var logoView = $('#logoView');

        logoView.on('keyup paste', function () {
        	var strNum = logoView.val().length;
        	viewBtn.next().text(strNum + '/50');
        })
        viewBtn.click(function(){
        	var view = logoView.val();
        	$.get(vars.zhuantiSite + '?c=zhuanti&a=ajaxSubmitView',{'view': encodeURIComponent(view)}, function (data) {
                if (data.code === '100') {
                	//意见提交成功
                	showMsg('感谢您的宝贵意见！');
                	viewBtn.unbind("click");
                	viewBtn.addClass('dis');
                } else {
                	showMsg('意见提交失败，请重试！');
                }
        	})
        });

        //报名
        var signBtn = $('#signBtn');
        signBtn.click(function(){
        	var name = $('#name').val();
        	var mobile = $('#mobile').val();
        	var cityname = $('#cityname').val();
        	$.get(vars.zhuantiSite + '?c=zhuanti&a=ajaxSignUp',{'name': encodeURIComponent(name),'mobile':mobile,'cityname':encodeURIComponent(cityname)}, function (data) {
                if (data.code === '100') {
                	//意见提交成功
                	$('.outBox').show();
                	signBtn.unbind("click");
                	signBtn.addClass('dis');
                } else {
                	showMsg(data.msg);
                }
        	})
        });

        $('#okBtn').click(function(){
        	$('.outBox').hide();
        });

    };
})