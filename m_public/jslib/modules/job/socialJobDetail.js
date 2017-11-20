/**
 * Created by hanxiao on 2017/7/7.
 */
define('modules/job/socialJobDetail', ['jquery', 'superShare/1.0.1/superShare', 'util'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        // 文档jquery对象索引
        var $doc = $(document);
        // 页面传入的数据
        var vars = seajs.data.vars;
        // 公共工具类
        var util = require('util');
        var userid = vars.userid;
        var weixin;
        require.async('weixin/2.0.0/weixinshare', function (Weixin) {
            weixin = new Weixin({
                debug: false,
                shareTitle: '社会招聘-' + vars.positionName,
                descContent: vars.jobRequire,
                lineLink: location.href,
                swapTitle: false,
                imgUrl: location.protocol + vars.public + '201511/images/loadingpicF.png'
            });
        });
        $(function () {
            /* 分享代码*/
            var SuperShare = require('superShare/1.0.1/superShare');
            //分享按钮
            var config = {
                // 分享的内容title
                title: '社会招聘-' + vars.positionName,
                // 分享时的图标
                image: window.location.protocol + vars.public + '201511/images/loadingpicF.png',
                // 分享内容的详细描述
                desc: vars.jobRequire,
                // 分享的链接地址
                url: location.href,
                // 分享的内容来源
                from: ' —房天下招聘'
            };
            var superShare = new SuperShare(config);
        });
		
		//点击职位申请
		$('#posapply').off().on('click', function () {
            // 判断用户id是否为空，为空则跳转登陆页面
            if (!userid) {
                floatshow('请先登录再申请', 1);
                return;
            }
            $.get(vars.jobSite + '?c=job&a=ajaxGetResume', function (myresume) {
                if (myresume) {
                    $.get(vars.jobSite + '?c=job&a=ajaxAddPososition&PositionID='+ vars.positionid, function (data) {
                        if (data) {
                            floatshow(data.Message, 0);
                        } else {
                            floatshow('申请失败，请重试', 0);
                        }
                    });
                } else {
                    var hrefurl = vars.jobSite + '?c=job&a=editResume';
                    window.location = hrefurl;
                }
            });
		});
		//点击职位收藏
		$('#poscollect').off().on('click', function () {
            // 判断用户id是否为空，为空则跳转登陆页面
            if (!userid) {
                floatshow('请先登录再收藏', 1);
                return;
            }
			$.get(vars.jobSite + '?c=job&a=ajaxAddCollectPos&PositionID='+ vars.positionid, function (data) {
                if (data) {
                    floatshow(data.Message, 0);
                } else {
                    floatshow('收藏失败，请重试', 0);
                }
			});
		});
		
		/**
         * 显示浮层
         */
	    //弹层显示框
		var floatalert = $('#floatAlert');
        function floatshow(message, type) {
            floatalert.show();
			$('#floatCenter').html(message);
			$('#sure').click(function () {
				floatalert.hide();
                if (type == 1) {
                    util.login();
                }
			})
        }

    }
});