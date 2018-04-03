define('modules/xf/dongtaiList',['jquery','util/util','search/newHouse/newHouseSearch'], function (require) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;
    // 查看历史记录按钮   默认展示1条  第一次按展示5条   第二次按全部展示
    var $moredt = $('.moredt');
    // 默认标识
    var flag = 0;
    // 前5条数据
    var $fivedt = $('.dongtai:lt(5)');
    // 全部数据
    var $dongtaiList = $('.dongtai');
    
    var Search = require('search/newHouse/newHouseSearch');
	
	var search = new Search();
	search.init();

    $moredt.click(function () {
        if (flag === 0) {
            $('.dt-int2').show();
            $fivedt.show();
            flag = 1;
        }else if (flag === 1) {
            $dongtaiList.show();
            $moredt.hide();
        }
    });

    // 布码
    setTimeout(function () {
        $('#wapdsy_D05_04').attr('id', 'wapxfdt_B07_05');
    }, 1000);
    var yibuma = false;
    $(document).on('scroll', function () {
        if ($('#wapesfsy_D04_01').length && !yibuma) {
            $('#wapesfsy_D04_01').attr('id', 'wapxfdt_B06_01');
            yibuma = true;
        }
    });

    require.async('//clickm.fang.com/click/new/clickm.js', function () {
        Clickstat.eventAdd(window, 'load', function (e) {
            Clickstat.batchEvent('wapxfdt_','');
        })
    });

    // 点击图片变大
    var imgData = [],
        wid = 600,
        hei = 400;
    $('.clearfix img').each(function () {
        var $this = $(this);
        imgData.push(
            {
                src: $this.attr('src'),
                w: wid,
                h: hei
            }
        )
    });
    $('.clearfix img').on('click', function () {
        var index = $(this).parent().index();
        require.async(['photoswipe/4.0.8/photoswipe3.min', 'photoswipe/4.0.8/photoswipe-ui-default3.min'], function (PhotoSwipe, PhotoSwipeUI) {
            var pswpElement = document.querySelectorAll('.pswp')[0];
            var options = {
                history: false,
                focus: false,
                index: index,
                showAnimationDuration: 0,
                hideAnimationDuration: 0,
                fullscreenEl: !1,
                shareEl: !1,
                tapToClose: !0
            };
            var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI, imgData, options);
            gallery.init();
        });
    });
    
    
 // 统计行为 --------------start
	require.async('jsub/_vb.js?c=xf_lp^dtxq_wap');
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
			'vmg.page': 'xf_lp^dtxq_wap',
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
	
	var rule = search.getRules(vars.paramcity + 'newXfHistory');
	
	var ajaxData = $.extend({
		XQ: '',
        xfWY: '',
        xfScores: '',
        city: vars.paramcity,
        id: vars.paramid
	}, rule);

    $.post('/xf.d?m=xiHuanLouPanList&source=dthx&math=' + Math.random(), ajaxData, function (result) {
        if ($.trim(result)) {
            $('#ganxingqulp .favList').html(result);
            $('#ganxingqulp').show();
           
        }
    });
	
	
    
});