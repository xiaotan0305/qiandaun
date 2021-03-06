﻿/**
 * wap动态页
 */
define('modules/xf/citydtList', ['jquery', 'loadMore/1.0.1/loadMore', 'superShare/1.0.1/superShare', 'weixin/2.0.0/weixinshare', 'slideFilterBox/1.0.0/slideFilterBox'], function (require) {
	'use strict';
	var $ = require('jquery');
	var vars = seajs.data.vars;
	 // 加载更多
    var loadMore = require('loadMore/1.0.1/loadMore');
	// 分享功能(新)
	var SuperShare = require('superShare/1.0.1/superShare');
	var config = {
		// 分享内容的title
		title: vars.sharetitle,
		// 分享时的图标
		image: 'https:' + vars.img || '',
		// 分享内容的详细描述
		desc: vars.sharesummary,
		// 分享的链接地址
		url: location.href,
		// 分享的内容来源
		from: 'xf'
	};
	var superShare = new SuperShare(config);

	// 微信分享功能
	var wx = require('weixin/2.0.0/weixinshare');
	var weixin = new wx({
		shareTitle: vars.sharetitle,
		descContent: vars.sharesummary,
		imgUrl: 'https:' + vars.img || '',
		lineLink: location.href
	});
    // 总数
    var kpTotal = vars.count > 0 ? vars.count : 1;
	 loadMore.add({
         // 加载更多接口地址  tag是用来区分用户是否设置过标签,没有设置过要调用不同的接口
         url: '/xf.d?m=citydtList&city='+vars.city+'&res=json&district=' + vars.district + '&purpose=' + vars.purpose,
         // 每页加载数据条数
         perPageNum: 10,
         // 总数据条数
         total: kpTotal,
         // 当前页加载数据条数
         pagesize: 10,
         // 当前加载更多执行所需的元素实例
         activeEl: '.dtlist',
         // 根据当前加载更多所需元素实例是否存在该类名决定是否启动加载更多操作
         active: 'active',
         // 加载更多容器的类名或者id或者jquery对象
         content: '.dq-flist',
         // 加载更多按钮的类名或者id或者jquery对象
         moreBtn: '#drag',
         // 提示文案类名或id或者jquery对象
         loadPrompt: '#loading',
  // 加载中显示文案,'正在加载请稍后'为默认
         loadingTxt: '<span><i></i>努力加载中...</span>',
 // 加载完成后显示内容,'加载更多'为默认
         loadedTxt: '<a href="javascript:void(0);" class="bt">查看更多</a>',
         firstDragFlag: true
     });
     loadMore.init();
     
  // 全国楼盘推app下载
 	require.async('app/1.0.0/appdownload', function ($) {
 		$('#topDownload').openApp();
 	});
 	
 	// 统计行为 --------------start
	require.async('jsub/_vb.js?c=xf_lp^dtlb_wap');
	require.async('jsub/_ubm.js?_2017102307fdsfsdfdsd', function () {
		_ub.city = vars.ubcity;
		// 业务---WAP端
		_ub.biz = 'n';
		// 方位（南北方) ，北方为0，南方为1
		_ub.location = vars.ublocation;
		// 用户动作（浏览0、搜索1、打电话31、即时通讯24、预约25）
		var b = 0;
		var pTemp = {
			// 所属页面
			'vmg.page': 'xf_lp^dtlb_wap',
			'vmg.sourceapp':vars.is_sfApp_visit + '^xf'

		};
		// 用户行为(格式：'字段编号':'值')
		var p = {};
		// 若pTemp中属性为空或者无效，则不传入p中
		for (var temp in pTemp) {
			if (pTemp[temp] && pTemp[temp].length > 0) {
				p[temp] = pTemp[temp];
			}
		}
		// 收集方法
		_ub.collect(b, p);
	});
	// 统计行为 --------------end
	
	
    var IScroll = require('slideFilterBox/1.0.0/slideFilterBox');
    // 阻止页面滑动
    function unable() {
        document.addEventListener('touchmove', preventDefault);
    }
    function preventDefault(e) {
        e.preventDefault();
    }
    // 取消阻止页面滑动
    function enable() {
        document.removeEventListener('touchmove', preventDefault);
    }

    $('.cont').css('height', '550%');
    $('.cont section').eq(0).addClass('quyusection');
    $('.cont section').eq(1).addClass('leixingsection');
    var $contquyu = $('.cont').eq(0);
    var $contleixing = $('.cont').eq(1);

    $('.lbTab li').on('click', function () {
        $('.float').show();
        $('.float .flexbox>.active').removeClass('active');
        var $this = $(this);
        if ($this.index() == 0) {
            // 区域
            if ($contquyu.is(':hidden') == false) {
                $('.cont').hide();
                $('.float').hide();
                enable();
            } else {
                $('.cont').hide();
                $('.cont').eq(0).show();
                unable();
                IScroll.refresh('.quyusection', 'stand');
                $('.float .flexbox li').eq(0).addClass('active');

                // 滑动到当前所选
                var position = $('.quyusection .active').position().top;
                if (position + $('.quyusection .active').height() > $('.quyusection').height()) {
                    var translateY = position + $('.quyusection .active').height() - $('.quyusection').height();
                    IScroll.to('.quyusection', translateY * -1);
                }
            }
        } else {
            // 类型
            if ($contleixing.is(':hidden') == false) {
                $('.cont').hide();
                $('.float').hide();
                enable();
            } else {
                $('.cont').hide();
                $('.cont').eq(1).show();
                unable();
                IScroll.refresh('.leixingsection', 'stand');
                $('.float .flexbox li').eq(1).addClass('active');

                // 滑动到当前所选
                var position = $('.leixingsection .active').position().top;
                if (position + $('.leixingsection .active').height() > $('.leixingsection').height()) {
                    var translateY = position + $('.leixingsection .active').height() - $('.leixingsection').height();
                    IScroll.to('.leixingsection', translateY * -1);
                }
            }
        }
    })

    $('.float').on('click', function (e) {
        if (e.target.className.indexOf('float') > -1) {
            $('.cont').hide();
            $('.float').hide();
            enable();
        }
    })
	
	
     
});
