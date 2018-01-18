define('modules/xf/DongtaiList1',['jquery','util/util','loadMore/1.0.1/loadMore'], function (require) {
    'use strict';
    var $ = require('jquery');
	var vars = seajs.data.vars;

	$('.cent-nav li').on('click', function () {
		var $this = $(this);
		if (!$this.hasClass('active')) {
			$('.cent-nav li').removeClass('active');
			$this.addClass('active');
			$('.main section').hide();
			if($this.html() == '<a>楼盘导购</a>'){
				$('.PWlist2').show();
			}else if ($this.html() == '<a>楼盘动态</a>') {
				$('.dt-n-tab,.dtbk').show();
			}
		}
	});

	var $loading = $('.moreList');
	// 总条数
	var totalnum = parseInt(vars.total) || 0;
	// 总页数
	var totalPage = Math.ceil(totalnum/20);
	// 当前页码
	var nowPage = 2;
	var isSuc = true;
	// 加载更多方法
	var loadmore = function () {
		if (isSuc && nowPage <= totalPage) {
			isSuc = false;
			$loading.show();
			$.post('/xf.d?m=getDglistAjax&city=' + vars.city + '&newcode=' + vars.newcode + '&p=' + nowPage, function (data) {
				isSuc = true;
				if (data) {
					$('.PWlist2 ul').append(data);
					nowPage++;
					$loading.hide();
				}
			});
		}
	};

	// 下拉加载更多
	$(document).on('touchmove', function () {
		var srollPos = $(document).scrollTop();
		if (srollPos >= $(document).height() - $(window).height() && srollPos != 0) {
			if ($('.cent-nav li').eq(1).hasClass('active')) {
				loadmore();
			} else if ($('.cent-nav li').eq(0).hasClass('active')) {
				loadmoredt();
			}

		}
	});
	
	//顶部菜单点击事件
	$('.dbdh a').each(function(){
		$(this).click(function(){
			nowPagedt = 2;
			var acont = $(this).html();
			$('.dbdh a').removeAttr('class');
			$(this).attr('class','cur');
			$(".dtbk").hide();
			$(".dt_newList").empty();
			$('.default-content p').html('加载中...');
			$('.default-content').show();
			
			$.post('/xf.d?m=getDongTaiStoryByDH&city=' + vars.city + '&newcode=' + vars.newcode + '&type=' +$(this).attr('name'),function(data){
				if(data){
					$('.default-content').hide();
					$(".dt_newList").append(data);
					$(".dtbk").show();
				}else{
					$('.default-content p').html('暂无' + acont + '信息');
				}
			});
		});
	});
	
	
	// 总条数
	var totaldt = parseInt(vars.dtTotal) || 0;
	// 总页数
	var totalPageDt = Math.ceil(totaldt/10);
	// 当前页码
	var nowPagedt = 2;
	var isSucdt = true;
	// 加载更多方法
	var loadmoredt = function () {
		var dqType = $('.dbdh .cur').attr('name');
		if (isSucdt && nowPagedt <= totalPageDt) {
			isSucdt = false;
			$loading.show();
			$.post('/xf.d?m=getDongTaiStoryByDH&city=' + vars.city + '&newcode=' + vars.newcode + '&type=' + dqType + '&page=' + nowPagedt, function (data) {
				if (data) {
					$('.dt_newList').append(data);
					nowPagedt++;
					$loading.hide();
				}else{
					$loading.html('<span><i></i>暂无更多</span>');
					setTimeout(function(){
						$loading.hide();
						$loading.html('<span><i></i>努力加载中...</span>');
					},1000);
					
				}
				isSucdt = true;
			});
		}
	};

	/*// 下拉加载更多
	$(document).on('touchend', function () {
		var srollPos = $(document).scrollTop();
		if (srollPos >= $(document).height() - $(window).height() && $('.cent-nav li').eq(0).hasClass('active')) {
			loadmoredt();
		}
	});*/

	$(document).scroll(function () {
		if ($(document).scrollTop() >= 44) {
			$('.dbdh').parent().addClass('fixed');
		} else {
			$('.dbdh').parent().removeClass('fixed');
		}
	})
	
	// 统计行为 --------------end
    require.async('//clickm.fang.com/click/new/clickm.js', function () {
        Clickstat.eventAdd(window, 'load', function () {
            Clickstat.batchEvent('wapxfdt_', '');
        });
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
	
	
});