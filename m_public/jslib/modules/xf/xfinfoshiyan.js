define('modules/xf/xfinfoshiyan', ['jquery', 'util/util','iscroll/2.0.0/iscroll-lite', 'slideFilterBox/1.0.0/slideFilterBox', 'hslider/1.0.0/hslider','superShare/1.0.1/superShare','weixin/2.0.0/weixinshare'],
    function (require) {
        'use strict';
        var $ = require('jquery');
        var cookiefile = require('util/util');
        var vars = seajs.data.vars;
		var IScrolllist = require('iscroll/2.0.0/iscroll-lite');
		
		
		// 分享功能(新)
		var SuperShare = require('superShare/1.0.1/superShare');
		var config = {
			// 分享内容的title
			title: '[新盘]' + $('#title').html() + '，' + vars.ubdistrict + '，' + $('.price').text().trim() + '-房天下',
			// 分享时的图标
			image: window.location.protocol + $('#storageimg').html().trim(),
			// 分享内容的详细描述
			desc: '均价：' + $('.price').text().trim() + '\n' + '地址：' + vars.xfinfoaddress ,
			// 分享的链接地址
			url: location.href,
			// 分享的内容来源
			from: 'xf'
		};
		var superShare = new SuperShare(config);

		// 微信分享功能
		var wx = require('weixin/2.0.0/weixinshare');
		var reg = /搜房网/g;
		var weixin = new wx({
			//debug: true,
			shareTitle: '[新盘]' + $('#title').html() + '，' + vars.ubdistrict + '，' + $('.price').text().trim() + '-房天下',
			descContent: '均价：' + $('.price').text().trim() + '\n' + '地址：' + vars.xfinfoaddress ,
			imgUrl: 'https:'+$('#storageimg').html().trim(),
			lineLink: location.href,
		});



		// 销售信息
		if($('.xsxx .table-item').outerHeight(true) > $('.xsxx .table-item').outerHeight(true)) {
			$('.xsxx .more_xq').show();
		}
		$('.xsxx .more_xq').on('click', function () {
			var $this = $(this);
			if ($this.hasClass('up')) {
				$this.removeClass('up');
				$('.xsxx .tab-box').css('max-height', '180px');
			} else {
				$this.addClass('up');
				$('.xsxx .tab-box').css('max-height', 'inherit');
			}
		});

		// 交通配套
		if($('.jtpt .xqIntro').outerHeight(true) > $('.jtpt .xqIntroBox').height()) {
			$('.jtpt .more_xq').show();
		}
		$('.jtpt .more_xq').on('click', function () {
			var $this = $(this);
			if ($this.hasClass('up')) {
				$this.removeClass('up');
				$('.jtpt .xqIntroBox').css('max-height', '146px');
			} else {
				$this.addClass('up');
				$('.jtpt .xqIntroBox').css('max-height', 'inherit');
			}
		});

		// 价格信息
		if($('.jgxx .table-item').outerHeight(true) > $('.jgxx .table-s').height()) {
			$('.jgxx .more_xq').show();
		}
		$('.jgxx .more_xq').on('click', function () {
			var $this = $(this);
			if ($this.hasClass('up')) {
				$this.removeClass('up');
				$('.jgxx .table-s').css('max-height', '180px');
			} else {
				$this.addClass('up');
				$('.jgxx .table-s').css('max-height', 'inherit');
			}
		});

		// 项目简介
		$('.xmjj .xqIntroBox').css({
			'max-height': 'none',
			'display': 'block'
		});
		if($('.xmjj .xqIntro').outerHeight(true) > 340) {
			$('.xmjj .more_xq').show();;
		}
		$('.xmjj .xqIntroBox').css({
			'max-height': '340px',
			'display': '-webkit-box'
		});

		$('.xmjj .more_xq').on('click', function () {
			var $this = $(this);
			if ($this.hasClass('up')) {
				$this.removeClass('up');
				$('.xmjj .xqIntroBox').css({
					'max-height': '340px',
					'display': '-webkit-box'
				});
			} else {
				$this.addClass('up');
				$('.xmjj .xqIntroBox').css({
					'max-height': 'none',
					'display': 'block'
				});
			}
		});
		
		//价格说明
		$('.icon-intro').on('click', function(){
			$('.jgsm').show();
		});
		
		//价格说明关闭
		$('#wzdl').on('click', function(){
			$('.jgsm').hide();
		});


		// 设置可滑动
		$('.jgxxslider').width($('.jgxxslider').width() - 20);
		new IScrolllist('.jgxxslider', {scrollX: true, bindToWrapper: true, eventPassthrough: true});
		
		
		// 统计行为 --------------start
        require.async('jsub/_vb.js?c=xf_lp^xq_wap');
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
                'vmg.page': 'xf_lp^xq_wap',
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


    });
