﻿define('modules/xf/xftjflist', [
    'jquery',
    'util/util',
    'hslider/1.0.0/hslider',
    'lazyload/1.9.1/lazyload',
    'swipe/3.10/swiper',
    'iscroll/2.0.0/iscroll-lite',
    'slideFilterBox/1.0.0/slideFilterBox',
    'modules/xf/loadMore1',
    'modules/xf/IcoStar',
    'modules/xf/ZhiYeGuWen',
    'modules/xf/XfTongJi',
    'yanzhengma/1.0.0/yanzhengma'
], function (require) {
    'use strict';
    var $ = require('jquery');
    var cookiefile = require('util/util');
    var vars = seajs.data.vars;
    var sfut = cookiefile.getCookie('sfut');
    var Swiper = require('swipe/3.10/swiper');
    require('iscroll/2.0.0/iscroll-lite');
    var IScroll = require('slideFilterBox/1.0.0/slideFilterBox');
    var lazy = require('lazyload/1.9.1/lazyload');
    var hslider = require('hslider/1.0.0/hslider');
    var loadMore = require('modules/xf/loadMore1');
    var IcoStar = require('modules/xf/IcoStar');
    var ZhiYeGuWen = require('modules/xf/ZhiYeGuWen');
    var XfTongJi = require('modules/xf/XfTongJi');

    // 控制星星亮
    var icoStarObj = new IcoStar('.ico-star');
    // 置业顾问
    var zhiYeGuWenObj = new ZhiYeGuWen('.online');
    // 新房统计
    var xfTongJiObj = new XfTongJi('[name*="xfTongji"]');
    // 懒加载
    lazy('img[data-original]').lazyload();

    // 滚动广告------------------------------------------start
    var $adimg = $('.adimg');
    var swiperOptions = {
        startSlide: 0,
        speed: 500,
        autoplay: 3000,
        resistanceRatio: 0,
        loop: true,
        pagination: '.swiper-pagination'
    };
    // 如果只有一个广告的时候，分页器不显示且不能滑动
    if ($adimg.length === 1) {
        $('.swiper-pagination').hide();
        swiperOptions.loop = false;
    }
    $adimg.each(function () {
        var $ele = $(this);
        $ele.attr('src', $ele.attr('data-url'));
    });
    // yangfan add 20160512 修改广告右下角圆圈第一次进入页面不滚动 bug
    new Swiper('#swiper-container', swiperOptions);
    // 滚动图片点击跳转
    $('div[data-name = "xfslider"]').on('click', 'a', function () {
        tongji($(this).attr('data-url'));
    });
    // 广告点击统计加跳转链接
    function tongji(u) {
        var pageUrl = document.URL;
        var city = $('#zhcity').html();
        var url = '/data.d?m=adtj&city=' + encodeURIComponent(encodeURIComponent(city)) + '&url=' + pageUrl;
        $.get(url, function () {
            window.location = u;
        });
    }
    // 滚动广告--------------------------------------end

	// 点击价格滑动条确定后执行的方法
    function goPrice(type) {
        var tags = $('#inputtags').val();
        var query = $('#inputquery').val();
		var $priceminI, $pricemaxI;
		// 单价
		if (type == 'dj') {
			$priceminI = $('#pricemindj i');
			$pricemaxI = $('#pricemaxdj i');
		} else {
			// 总价
			$priceminI = $('#priceminzj i');
			$pricemaxI = $('#pricemaxzj i');
		}
        var pricemin = $priceminI.html().trim(),
            pricemax = $pricemaxI.html().trim();
        pricemin = pricemin === '不限' ? 0 : pricemin;
        pricemax = pricemax === '不限' ? '' : pricemax;
		// 单价 跳转到本页
		if (type == 'dj') {
			if (Number(pricemin) == 0 && !pricemax) {
				var hrefload = '/xf/' + vars.paramcity + vars.district + '/' + xt + xq + vars.character + vars.purposexf + vars.saleDate + vars.orderby + vars.round + vars.fitment + vars.railway + vars.comarea + vars.station +  comarea  + vars.bedrooms + vars.purposeArea + '/' + tags + query;
			} else {
				var hrefload = '/xf/' + vars.paramcity + vars.district + '/pr' + pricemin + ',' + pricemax + xt + xq + vars.character + vars.purposexf + vars.saleDate + vars.orderby + vars.round + vars.fitment + vars.railway + vars.comarea + vars.station + comarea + vars.bedrooms + vars.purposeArea + '/' + tags + query;
			}
			if (hrefload.indexOf('//') > -1) {
				hrefload = hrefload.replace('//', '/');
			}
			window.location.href = hrefload;
		} else {
			// 总价 跳转到户型页
			var href;
			if (!pricemin && !pricemax) {
				href = '/xf.d?m=searchHuXingList&city=' + vars.paramcity + '&district=&railway=&room=&strSort=&strRoundStation=&area=&keyword=&comarea=&railway_station='
			} else {
				href = '/xf.d?m=searchHuXingList&city=' + vars.paramcity + '&district=&railway=&room=&price=[' + pricemin + ',' + pricemax + ']套价&strSort=&strRoundStation=&area=&keyword=&comarea=&railway_station=';
			}
			window.location.href = href;
		}
    }
    var district = $('#districtChange').val(),
        price = $('#priceChange').val(),
        railway = $('#railwayChange').val(),
        character = $('#characterChange').val(),
        comarea = $('#comareaChange').val(),
        station = $('#stationChange').val(),
        // 页面初始化时已选学区的值
        xt = $('#xt').val(),
        xq = $('#xqChange').val(),
        tags = vars.paramtags,
        changeFlag = 0;

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
    // 最下面的导航-------------------------------------------------satrt
    var $bottonDiv = $('#bottonDiv');
    var $typeList = $('.typeListB');
    $bottonDiv.on('click', 'a', function () {
        var $this = $(this);
        $bottonDiv.find('a').removeClass('active');
        $this.addClass('active');
        $typeList.hide();
        $('.' + $this.attr('id')).show();
        if (!$this.attr('canSwiper')) {
            $this.attr('canSwiper', true);
            addSwiper($this);
        }
    });
    //　列表页底部滑动
    var setTab = function (obj, index) {
        var $span = $(obj).find('.pointBox span');
        $span.removeClass('cur').eq(index).addClass('cur');
    };
    var windoWidth = $(window).width();
    $('.typeListB').each(function () {
        var $this = $(this);
        $this.find('.swiper-wrapper').width(windoWidth * $this.find('.swiper-slide').length);
        $this.find('.swiper-slide').width(windoWidth).height($('.gfzn .swiper-wrapper').height());
    });
    var addSwiper = function (a) {
        new Swiper('.' + a.attr('id'), {
            speed: 500,
            loop: false,
            onSlideChangeStart: function (swiper) {
                setTab('.' + a.attr('id'), swiper.activeIndex);
            }
        });
    };
    addSwiper($('#gfzn'));
    // 最下面的导航-------------------------------------------------end
    // 快筛学区里的更多--------------------------------------------start
    var schoolcpnum = 2;
    $('#moreschool').on('click', function () {
        xqajax(false);
    });

    function xqajax(flag) {
        var querystrBefore = '/xf/' + vars.paramcity + '/' + vars.district + vars.price + vars.character + vars.purposexf + vars.saleDate + vars.orderby + vars.round;
        var querystrAfter = vars.fitment + vars.comarea + '/';
        $.post('/xf.d?m=schoollist&type=lp&city=' + vars.paramcity + '&district=' + vars.paramdistrict + '&p=' + schoolcpnum + '&seitem=' + vars.paramxq + '&querystr_before=' + querystrBefore + '&querystr_after=' + querystrAfter,
            function (data) {
                $('#xqfitem').append(data);
                schoolcpnum += 1;
                IScroll.refresh('#xqfChioce', 'stand');
                if (flag) {
                    callView(true);
                }
            });
    }

    // 价格点击效果
    var $priceChioceClick = $('#priceChioce').find('dd');
    $priceChioceClick.on('click', 'a', function () {
        $priceChioceClick.removeClass('active');
        $(this).parent().addClass('active');
    });
    var showFirst = true;
    var $tabSX = $('#sift');
    var $lbTab = $('.lbTab');
    // 快筛点击按钮---------------------------------------------------------------------------start
    var $ide = $('[name*="ide"]');
    var $sift = $('#sift');
    $ide.on('click', function () {
        // 加Class使其全部显示
        $lbTab.children('div').show();
        $tabSX.addClass('tabSX');
        var a = $(this).attr('class') || '';
        var b = $(this).attr('name').split(' ')[0];
        if (a.indexOf('active') < 0) {
            $ide.removeClass();
            $(this).addClass('active');
            $sift.removeClass();
            $lbTab.children().hide();
            $('.' + b).show();
            $sift.addClass('tabSX');
            $('.float').show();
            // 处理更多
            b = b === 'allChioce' ? 'moreChoo' : b;
            // 如果是位置，第一列不需要刷新
            if ($(this).attr('name').indexOf('whereChioce') === -1) {
                IScroll.refresh('#' + b);
            }
            // 如果点击的是位置按钮
            if ($(this).attr('name').indexOf('whereChioce') > -1) {
                // 第一次点击该按钮
                if (showFirst) {
                    // 针对学区快筛
                    if (vars.paramxq) {
                        // 三层学区
                        districtSubway('#xqfChioce', vars.ubxq);
                    }
                    // 针对地铁快筛
                    if (vars.paramrailway) {
                        districtSubway('#subwayChioce', vars.paramrailwaystation);
                    }
                    // 针对区域进行筛选
                    if (vars.paramdistrict) {
                        districtSubway('#districtChioce', vars.paramcomarea);
                    }
                    // 新加的需求，在没有别的条件时，点位置时默认选中区域 -->不限
                    if (!$('.column2').is(':visible')) {
                        var $districtChioce = $('#districtChioce');
                        var $districtChioceDd = $districtChioce.find('dd');
                        $('#whereChioce').find('dd[name*=districtChioce]').addClass('active');
                        $districtChioce.show();
                        IScroll.refresh('#districtChioce');
                    }

                    // 2016.4.27 yangfan add 二级菜单有选中的情况，三级菜单也要展示
                    var column2Visible = $('.column2:visible');
                    var column2Select = column2Visible.find('dd.active');
                    var column3Show = $('#' + column2Select.attr('str'));
                    if (column2Select.length) {
                        updateColumn3ddFirstText(column2Select, column3Show);
                        $('.column3').hide();
                        column3Show.show();
                        if (!column3Show.find('.active').length) {
                            column3Show.find('dd:first').addClass('active');
                        }
                    }
                    showFirst = false;
                }
                callView(true);
            }
            // 点击价格所执行的函数
            if ($(this).attr('name').indexOf('priceChioce') > -1) {
				if ($('.price-list .active').html() == '单价') {
					IScroll.refresh('#priceChioceDj');
				} else {
					IScroll.refresh('#priceChioceZj');
				}
				// 调用价格滑动插件（单价）
				priceChioceFunDj();
            }
            // 点击更多所执行的函数
            if ($(this).attr('name').indexOf('allChioce') > -1) {
                allChioceFun();
            }
            unable();
        } else {
            KShide();
        }
    });

	$('#priceChioceDj').show();
	$('#priceChioceZj').hide();

	// 价格二级点击事件（选择单价总价）
	$('.price-list dd').on('click', function() {
		var $this = $(this);
		$this.siblings().removeClass('active');
		$this.addClass('active');
		if ($this.html() == '单价') {
			$('#priceChioceZj').hide();
			$('#priceChioceDj').show();
			IScroll.refresh('#priceChioceDj');
		} else {
			$('#priceChioceDj').hide();
			$('#priceChioceZj').show();
			IScroll.refresh('#priceChioceZj');
			// 调用价格滑动插件（总价）
			priceChioceFunZj();
		}
	});

    // 点击黑框隐藏
    // 2016.4.26 yangfan add 位置菜单选中，点击蒙层，自动跳转。产品需求 暂时只做武汉、南京的默认跳转
    // 2016.5.3 yangfan remove 产品要求去掉武汉、南京限制，需要上线全国城市
    $('.float').on('click', function () {
        redirect();
        KShide();
		chongzhi()
    });

    /**
     * 2016.4.26 yangfan add 二级菜单选中后，三级菜单没有选中项，默认跳转页面
     */
    function redirect() {
        var col3Vis = $('.column3:visible');
        var col3Act = col3Vis.find('.active');

        if (col3Vis.length && !col3Act.length) {
            var a = col3Vis.find('a:first')[0];
            window.location.href = a.href;
        }
    }

    /*
     *调用显示区的快筛
     */
    function callView(flag) {
        var $column2Visible = $('.column2:visible');
        var $column3Visible = $('.column3:visible');
        var viewHeight = $('.whereChioce ').height();
        if (flag && $column2Visible.length > 0) {
            viewArea(viewHeight, $column2Visible.find('dd.active').index(), $column2Visible.find('dd').length, $column2Visible.attr('id'));
        }
        if ($column3Visible.length > 0) {
            viewArea(viewHeight, $column3Visible.find('dd.active').index(), $column3Visible.find('dd').length, $column3Visible.attr('id'));
        }
    }

    /*
     *将选中快筛标签显示到显示区
     */
    function viewArea(containerHeight, index, length, element) {
        // 每一个元素dd的高度为44
        var ddHeight = 44;
        var bottomHeight = (length - index) * ddHeight;
        var height = -ddHeight * index;
        if (bottomHeight < containerHeight) {
            height = containerHeight - length * ddHeight;
        }
        if (height < 0) {
            IScroll.to('#' + element, height);
        }
    }

    /*
     *隐藏快筛
     */
    function KShide() {
        $ide.removeClass();
        $lbTab.children('div').hide();
        $('#sift').removeClass('tabSX');
        $('.float').hide();
        enable();
    }

    function districtSubway(str, param3) {
        var $distinctSubwayChioce = $(str);
        // 显示并刷新第二层
        $distinctSubwayChioce.show();
        IScroll.refresh(str);
        // 如果有第三层，则显示并刷新第三层
        if (param3) {
            var stationSubway3Id = $distinctSubwayChioce.find('dd.active').attr('str');
            $('#' + stationSubway3Id).show();
            IScroll.refresh('#' + stationSubway3Id);
        }
    }
    // 快筛点击按钮---------------------------------------------------------------------------end
    // 快筛位置第一层点击---------------------------------------------------start
    $('[name*="neIde"]').on('click', function () {
        // 2016.4.27 yangfan add 点击快筛第一级按钮时，进行样式重置。不重置会出现样式不统一问题，层级重复出现问题。
        $('.column3:visible').hide().find('dd.active').removeClass('active');
        $('.column2:visible').find('dd.active').removeClass('active');

        // 区域下隐藏
        $('.stations').hide();
        // 地铁下隐藏
        $('.districts').hide();
        // 学区下隐藏
        //$('#xqfChioce').hide();
        $('.xt').hide();
        var $subwayChioce = $('#subwayChioce');
        var $xqfChioce = $('#xqfChioce');
        var $districtChioce = $('#districtChioce');
        var $districtChioceIde = $('[name="districtChioce neIde"]');
        var $subwayChioceIde = $('[name="subwayChioce neIde"]');
        var $xqfChioceIde = $('[name="xqfChioce neIde"]');
        var a = $(this).attr('name').split(' ')[0];
        if (a === 'districtChioce') {
            showLevelTwo($subwayChioce, $xqfChioce, $districtChioceIde, $subwayChioceIde, $xqfChioceIde);
        } else if (a === 'subwayChioce') {
            showLevelTwo($xqfChioce, $districtChioce, $subwayChioceIde, $districtChioceIde, $xqfChioceIde);
        } else if (a === 'xqfChioce') {
            showLevelTwo($districtChioce, $subwayChioce, $xqfChioceIde, $districtChioceIde, $subwayChioceIde);
        }
        var $choose = $('#' + a);
        $choose.show();
        // 刷新div，为的是能够用Scroll滑动
        IScroll.refresh('#' + a);
        // 选中标签显示在可视区域内
        callView(true);
        unable();
    });

    function showLevelTwo($hideOne, $hideTwo, $active, $removeOne, $removeTwo) {
        $hideOne.hide();
        $hideTwo.hide();
        $active.addClass('active');
        $removeOne.removeClass();
        $removeTwo.removeClass();
    }
    // 快筛位置第一层点击---------------------------------------------------end
    // 快筛位置第二层点击-------------------------------------------------start
    // 新增地铁站点
    var $stations = $('[name*="stations"]');
    $stations.on('click', function () {
        var that = this;
        stationDistinctThree(that, $stations, '.stations');
        // 选中标签显示在可视区域内
        callView(false);
    });
    // 新增商圈
    var $districts = $('[name*="districts"]');
    $districts.on('click', function () {
        var that = this;
        stationDistinctThree(that, $districts, '.districts');
    });
    // 新增学校
    var $xt = $('[name*="xt"]');
    $xt.on('click', function () {
        var that = this;
        stationDistinctThree(that, $xt, '.xt');
    });

    /**
     * 重写：展示三级菜单
     * 添加功能：点击二级菜单非"不限"选项，更改三级菜单"全部"文字为，选项文字+"全部"，比如："朝阳全部"
     * @param  {dom} that   二级菜单被点击的选择项 dom
     * @param  {$} 二级菜单所有选择项 $stations,$districts,$xt
     * @param  {string} 三级菜单 class 选择器
     */
    function stationDistinctThree(pThat, $stationDistrictName, stationDistrictClass) {
        var $that = $(pThat),
            $stationDistrict = $(stationDistrictClass);
        var thatAttrStr = $that.attr('str');
        var $choose = $('#' + thatAttrStr);

        // 二级菜单添加选中样式
        $stationDistrictName.removeClass();
        $that.addClass('active');

        // 显示对应的三级菜单
        $stationDistrict.hide();
        updateColumn3ddFirstText($that, $choose);
        $choose.show();
        IScroll.refresh('#' + thatAttrStr);
        unable();
    }

    /**
     * 2016.4.27 yangfan add 更新三级菜单第一选项"全部"，例如："朝阳"+"全部"
     */
    function updateColumn3ddFirstText($column2Select, $column3Show) {
        var column2Select = $column2Select.find('a').text(),
            column3Show = $column3Show.find('a:first');
        var chooseText = column3Show.text().substr(-2);
        column3Show.text(column2Select + chooseText);
    }

    // 快筛位置第二层点击---------------------------------------------------end
    // 新房统计
    var imei = cookiefile.getCookie('global_cookie');
    $('input[name="tongjihidden"]').each(function () {
        var showurl = $(this).val();
        var getWirelessCode = $(this).attr('data-name');
        var image = new Image();
        image.src = location.protocol + '//client.3g.fang.com/http/sfservice.jsp?' + showurl + '&wirelesscode=' + getWirelessCode + '&imei=' + imei;
        image.display = 'none';
    });

    // 下拉加载更多--------------------------------------------------start
    var totalInfo = Number($('#totalpage').html());
    var oneInfo = 40;
    var dataConfig = {
        m: 'xflist',
        city: vars.loadcity,
        district: vars.loaddistrict,
        price: vars.loadprice,
        comarea: vars.loadcomarea,
        purpose: vars.loadpurpose,
        orderby: vars.loadorderby,
        railway: vars.loadrailway,
        character: vars.loadcharacter,
        xq: vars.loadxq,
        fitment: vars.loadfitment,
        round: vars.loadround,
        keyword: vars.loadkeyword,
        saleDate: vars.loadsaleDate,
        yhtype: vars.loadyhtype,
        datatype: 'json',
        p: 2,
        tags: vars.loadtags
    };
    var dataConfigEndPage = {
        m: 'xflist',
        city: vars.loadcity,
        district: vars.loaddistrict,
        price: '[9999999999,9999999999]单价',
        comarea: vars.loadcomarea,
        purpose: vars.loadpurpose,
        orderby: vars.loadorderby,
        railway: vars.loadrailway,
        character: vars.loadcharacter,
        xq: vars.loadxq,
        fitment: vars.loadfitment,
        round: vars.loadround,
        keyword: vars.loadkeyword,
        saleDate: vars.loadsaleDate,
        yhtype: vars.loadyhtype,
        datatype: 'json',
        p: 0,
        pn: 20,
        tags: vars.loadtags
    };
    var options = {
        moreBtnID: '#drag',
        loadPromptID: '#loading',
        contentID: '#xfContentList',
        ajaxUrl: '/xf.d',
        ajaxData: dataConfig,
        ajaxDataEndPage: dataConfigEndPage,
        pageNumber: 10,
        pagesize: oneInfo,
        total: totalInfo,
        ajaxFn: {
            icoStar: icoStarObj,
            zhiYeGuWen: zhiYeGuWenObj,
            xfTongJi: xfTongJiObj
        },
        tjftype: 'xf'
    };
    // 调用加载更多模块实现加载更多
    loadMore(options);
    if (vars.esfshowflag !== 0 && vars.esfcount > 0 && !vars.paramkeyword) {
        $('.houseList').hide();
    }
    // 更多下的样式更改   time:2015.10.26 -------------------------------------------start
    var $moreClass = $('.moreChoo');
    var $moreChild = $moreClass.children().eq(0).children();
    // 前五个是修改样式，第六个是重置，第七个是确认
    var changeNum = 5;
    for (var i = 0; i < changeNum; i++) {
        (function () {
            var $choseItem = $moreChild.eq(i).find('.chose-item');
            var $clickBtn = $choseItem.find('a');
            var $closeDiv = $choseItem.find('div[name=flexbox]');
            var $moretitle = $moreChild.eq(i).find('.moretitle a');
            var $changeSpan = $moretitle.find('span');
            $clickBtn.on('click', function () {
                $clickBtn.removeClass('active');
                $(this).addClass('active');
                $changeSpan.html($(this).html());
                $moretitle.attr('value', $(this).attr('value'));
            });
            $moretitle.on('click', function () {
                if ($closeDiv.length > 0) {
                    if ($(this).attr('class').trim() === 'arr-up') {
                        $closeDiv.hide();
                        $moretitle.removeClass().addClass('arr-down');
                    } else {
                        $closeDiv.show();
                        $moretitle.removeClass().addClass('arr-up');
                        // 解决当滑动区域太小时刷新不了的问题
                        IScroll.refresh('#moreChoo');
                    }
                }
            });
        })(i);
    }
    // 重置------------
    var $resetA = $('.moretitle').find('a');
    var $choseItemAll = $('.chose-item');
    // 2016.4.27 yangfan remove 点击重置按钮，'不限'删除，默认选中删除
    $moreClass.find('.btnIn').on('click', function () {
		chongzhi();
    });
	// 重置方法
	var chongzhi = function () {
		$resetA.attr('value', '');
		$choseItemAll.find('a').removeClass('active');
		moreChioceNum();
	};

    // 点击更多的时候会初始化更多里的小页面
    function allChioceFun() {
        for (var i = 0; i < changeNum; i++) {
            (function () {
                var $choseItem = $moreChild.eq(i).find('.chose-item');
                // 选中的字段
                var $active = $choseItem.find('.active');
                var $closeDiv = $choseItem.find('div[name=flexbox]');
                var $moretitle = $moreChild.eq(i).find('.moretitle a');
                var $changeSpan = $moretitle.find('span');
                // 显示所选的字
                $changeSpan.html($active.html());
                // 设置其value,为点击确定时所选的值
                $moretitle.attr('value', $active.attr('value'));
                if ($active.parent().attr('name') === 'flexbox') {
                    $closeDiv.show();
                    $moretitle.removeClass().addClass('arr-up');
                }
            })(i);
        }
    }
    // 更多下的样式更改   time:2015.10.26 -------------------------------------------end

    // 价格滑动插件 time:2015.10.26 ------------------------------------------start
	// 单价插件
    var priceHsliderDj;
    var priceFirstflagDj = true;
    function priceChioceFunDj() {
        var $priceHslider = $('#priceHsliderdj'),
            $pricemin = $('#pricemindj'),
            $pricemax = $('#pricemaxdj');
        // 获取最大值和最小值一定要在插件的创建对象之前去获取，因为插件初始化时会把值设为不限
        var min = $pricemin.find('i').html();
        var max = $pricemax.find('i').html();
        priceHsliderDj = priceHsliderDj || new hslider({
            max: $priceHslider.attr('max'),
            min: $priceHslider.attr('min'),
            step: 100,
            oParent: $priceHslider,
            leftSign: $pricemin,
            rightSign: $pricemax,
            range: $('#priceRangedj'),
            danwei: '万元'
        });
        // 初始化传递最小值和最大值
        priceHsliderDj._initPos(min, max);
        // 总价左边滚动条
        if (priceFirstflagDj) {
            $pricemin.on('touchstart', function () {
                $pricemin.addClass('hover');
                $pricemax.removeClass('hover');
            }).on('touchend', function () {
                $pricemin.removeClass('hover');
                $('#pricemindj i').html($('#pricemindj i').html() == 0 ? '不限': $('#pricemindj i').html());
            });
            // 总价右边滚动条
            $pricemax.on('touchstart', function () {
                $pricemin.removeClass('hover');
                $pricemax.addClass('hover');
				$('#pricemaxdj i').html($('#pricemaxdj i').html() == 0 ? 100 : $('#pricemaxdj i').html());
            }).on('touchend', function () {
                $pricemax.removeClass('hover');
				$('#pricemaxdj i').html($('#pricemaxdj i').html() == 0 ? 100 : $('#pricemaxdj i').html());
            });
            priceFirstflagDj = false;
        }
        if (min == '0') {
            $('#pricemindj i').html('不限');
        }
    }
	// 总价插件
	var priceHsliderZj;
	var priceFirstflagZj = true;
	function priceChioceFunZj() {
		var $priceHslider = $('#priceHsliderzj'),
			$pricemin = $('#priceminzj'),
			$pricemax = $('#pricemaxzj');
		// 获取最大值和最小值一定要在插件的创建对象之前去获取，因为插件初始化时会把值设为不限
		var min = $pricemin.find('i').html();
		var max = $pricemax.find('i').html();
		priceHsliderZj = priceHsliderZj || new hslider({
				max: $priceHslider.attr('max'),
				min: $priceHslider.attr('min'),
				step: 10,
				oParent: $priceHslider,
				leftSign: $pricemin,
				rightSign: $pricemax,
				range: $('#priceRangezj'),
				danwei: '万元'
			});
		// 初始化传递最小值和最大值
        priceHsliderZj._initPos('', '');
		// 总价左边滚动条
		if (priceFirstflagZj) {
			$pricemin.on('touchstart', function () {
				$pricemin.addClass('hover');
				$pricemax.removeClass('hover');
			}).on('touchend', function () {
				$pricemin.removeClass('hover');
			});
			// 总价右边滚动条
			$pricemax.on('touchstart', function () {
				$pricemin.removeClass('hover');
				$pricemax.addClass('hover');
				$('#pricemaxzj i').html($('#pricemaxzj i').html() == 0 ? 100 : $('#pricemaxzj i').html());
			}).on('touchend', function () {
				$pricemax.removeClass('hover');
				$('#pricemaxzj i').html($('#pricemaxzj i').html() == 0 ? 100 : $('#pricemaxzj i').html());
			});
			priceFirstflagZj = false;
		}
        if (min == '0') {
            $('#priceminzj i').html('不限');
        }
	}
    // 价格插件点击确定
    $('.priceChioce .chooseBtn').on('click', function () {
		if ($(this).hasClass('dj')) {
			goPrice('dj');
		} else {
			goPrice('zj');
		}
    });
    // 价格滑动插件 time:2015.10.26 ------------------------------------------end

    // 快筛随滚动事件实现 time:2015.10.30 ------------------------------------start
    var $kuaishai = $('ul.flexbox');
    // 判断要浮起来的临界点
    var criticalTop = $kuaishai.offset().top;
    var startScrollTop;
    // 判断是点击滚动还是自己滚动
    var flag = false;
    // 创建填充白板
    var boardDiv = $('<div id="board"></div>');
    boardDiv.height($kuaishai.height());
    $(document).on('touchstart', function () {
        startScrollTop = $(document).scrollTop();
    });
    $(document).on('scroll', function () {
        if (flag) {
            var scrollScrollTop = $(document).scrollTop();
            if (scrollScrollTop < startScrollTop && scrollScrollTop > criticalTop) {
                $kuaishai.css({ position: 'fixed', top: 0, width: '100%', 'background-color': '#FFFFFF', 'z-index': 10 });
                // 将白板填入DOM中
                $lbTab.prepend(boardDiv);
            } else {
                boardDiv.remove();
                $kuaishai.attr('style', '');
            }
        }
        flag = true;
    });
    $kuaishai.on('click', 'li', function () {
        flag = false;
        boardDiv.remove();
        $kuaishai.attr('style', '');
    });
    // 快筛随滚动事件实现 time:2015.10.30 --------------------------------------end
    // 位置下面跳转前显示active  time:2015.11.03 -----------------------------start
    var $districtsHref = $('.districts').find('dd');
    var $stationsHref = $('.stations').find('dd');
    var $xqfitemHref = $('.xt').find('dd');
    // 区域的跳转
    $districtsHref.on('click', function () {
        $districtsHref.removeClass();
        $(this).addClass('active');
    });
    // 地铁的跳转
    $stationsHref.on('click', function () {
        $stationsHref.removeClass();
        $(this).addClass('active');
    });
    // 学区的跳转
    $xqfitemHref.on('click', function () {
        $xqfitemHref.removeClass();
        $(this).addClass('active');
    });
    // 位置下面跳转前显示active  time:2015.11.03 ------------------------------end

    // 统计行为 --------------start
    require.async('jsub/_vb.js?c=mnhlist');
    require.async('jsub/_ubm.js?_2017102307fdsfsdfdsd', function () {
        yhxw();
    });
    Date.prototype.format = function (fmt) {
        var o = {
            // 月份
            'M+': this.getMonth() >= 9 ? this.getMonth() + 1 : '0' + (this.getMonth() + 1),
            // 日
            'd+': this.getDate() >= 10 ? this.getDate() : '0' + this.getDate(),
            // 小时
            'h+': this.getHours() >= 10 ? this.getHours() : '0' + this.getHours(),
            // 分
            'm+': this.getMinutes() >= 10 ? this.getMinutes() : '0' + this.getMinutes(),
            // 秒
            's+': this.getSeconds() >= 10 ? this.getSeconds() : '0' + this.getSeconds(),
            // 季度
            'q+': Math.floor((this.getMonth() + 3) / 3),
            // 毫秒
            S: this.getMilliseconds()
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp('(' + k + ')').test(fmt)) {
                fmt = fmt.replace(RegExp.$1, o[k]);
            }
        }
        return fmt;
    };

    function yhxw() {
        _ub.city = vars.ubcity;
        // 业务---WAP端
        _ub.biz = 'n';
        // 方位（南北方) ，北方为0，南方为1
        _ub.location = vars.ublocation;
        // 用户动作（浏览0、搜索1、打电话31、即时通讯24、预约25）
        var b = 1;
        // 开盘时间段
        var saleDatenew = {
            0: function (myDate) {
                myDate.setDate(1);
                var cMonth = myDate.getMonth();
                var nMonth = ++cMonth;
                var nMonthDayOne = new Date(myDate.getFullYear(), nMonth, 1);
                var OTime = 1000 * 60 * 60 * 24;
                var saleDate = myDate.format('yyyyMMdd') + '-' + new Date(nMonthDayOne.getTime() - OTime).format('yyyyMMdd');
                return saleDate;
            },
            1: function (myDate) {
                var cMonth = myDate.getMonth();
                var nMonthDayOne = new Date(myDate.getFullYear(), cMonth + 1, 1);
                var OTime = 1000 * 60 * 60 * 24;
                var saleDate = nMonthDayOne.format('yyyyMMdd') + '-' + new Date(new Date(myDate.getFullYear(), cMonth + 2, 1).getTime() - OTime).format('yyyyMMdd');
                return saleDate;
            },
            2: function (myDate) {
                myDate.setDate(1);
                var cMonth = myDate.getMonth();
                var nMonthDayOne = new Date(myDate.getFullYear(), cMonth + 3, 1);
                var OTime = 1000 * 60 * 60 * 24;
                var saleDate = myDate.format('yyyyMMdd') + '-' + new Date(nMonthDayOne.getTime() - OTime).format('yyyyMMdd');
                return saleDate;
            },
            3: function (myDate) {
                myDate.setDate(1);
                var cMonth = myDate.getMonth();
                var nMonthDayOne = new Date(myDate.getFullYear(), cMonth + 6, 1);
                var OTime = 1000 * 60 * 60 * 24;
                var saleDate = myDate.format('yyyyMMdd') + '-' + new Date(nMonthDayOne.getTime() - OTime).format('yyyyMMdd');
                return saleDate;
            },
            4: function (myDate) {
                var cMonth = myDate.getMonth();
                var nMonthDayOne = new Date(myDate.getFullYear(), cMonth - 3, 1);
                var OTime = 1000 * 60 * 60 * 24;
                var saleDate = nMonthDayOne.format('yyyyMMdd') + '-' + new Date(new Date(myDate.getFullYear(), cMonth, 1).getTime() - OTime).format('yyyyMMdd');
                return saleDate;
            },
            5: function (myDate) {
                var cMonth = myDate.getMonth();
                var nMonthDayOne = new Date(myDate.getFullYear(), cMonth - 6, 1);
                var OTime = 1000 * 60 * 60 * 24;
                var saleDate = nMonthDayOne.format('yyyyMMdd') + '-' + new Date(new Date(myDate.getFullYear(), cMonth, 1).getTime() - OTime).format('yyyyMMdd');
                return saleDate;
            }
        };
        var open = {
            s0: '本月开盘',
            s1: '下月开盘',
            s2: '三月内开盘',
            s3: '六月内开盘',
            s4: '前三月已开',
            s5: '前六月已开'
        };
        var myDate = new Date();
        var saleDate1 = vars.ubsaleDate ? saleDatenew[vars.ubsaleDate.toString()](myDate) : '';
        // 价格（单价）
        var danjia = vars.ubpricesplitesize === 'true' ? vars.ubprice0 : vars.ubprice;

        var schoolDistrict = encodeURIComponent(vars.ubxq);
        var pTemp = {
            // 关键字
            'vmn.key': encodeURIComponent(vars.paramkeyword),
            // 所属页面
            'vmg.page': 'mnhlist',
            // 类型
            'vmn.genre': encodeURIComponent(vars.parampurpose),
            // 热门
            'vmn.feature': encodeURIComponent(vars.paramcharacter),
            // 环线
            'vmn.loopline': encodeURIComponent(vars.paramround),
            // 开盘时间段
            'vmn.opentime': saleDate1 ? encodeURIComponent(open[vars.saleDate]) + ',' + saleDate1 : '',
            // 装修程度
            'vmn.fixstatus': encodeURIComponent(vars.paramfitment),
            // 区域
            'vmn.position': vars.paramdistrict ? encodeURIComponent(vars.paramdistrict) + '^' + encodeURIComponent(vars.paramcomarea) : '',
            // 地铁
            'vmn.subway': vars.paramrailway ? encodeURIComponent(vars.paramrailway) + '^' + encodeURIComponent(vars.paramrailwaystation) : '',
            // 单价
            'vmn.unitprice': danjia,
            // 学区所属学校
            'vmn.belongschool': schoolDistrict,
            //排序
            'vmn.order': encodeURIComponent(vars.order),
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
    }
    // 统计行为 --------------end
    require.async('//clickm.fang.com/click/new/clickm.js', function () {
        Clickstat.eventAdd(window, 'load', function () {
            if (vars.paramcity == 'sh') {
                Clickstat.batchEvent('wapxfsy_', 'sha');
            } else {
                Clickstat.batchEvent('wapxfsy_', vars.paramcity);
            }
        });
    });

    /*
     *新房列表页判断标签
     */
    $('.stag span').each(function () {
        var $this = $(this);
        // 如果标签的右边框在li中显示不全，就隐藏（$this有padding和border共8，li有margin右侧为8）
        if ($this.position().left + $this.width() + 8 > document.body.clientWidth - 8) {
            $this.hide();
        }
    });


    /**
     * wap端 新房搜索页 ctm参数规则：ctm=a.b.c.d.e
     *  a：wap端为2；
     *  b：城市缩写；
     *  c：页面简称，由需求方指定 xf_search 新房搜索页简称；
     *  d：模块简称，由需求方指定 excel 中规定简称；
     *  e：模块内链接按顺序自动获取，1,2,3,… ----对应order
     */
    var ctmWebNo = '2',
        ctmPageShortName = 'xf_search';

    /**
     * 为 url 添加 ctm 参数并进行跳转
     * @param  {string} url        即将跳转的目标页面，通常是 href 属性值
     * @param  {string} no         ctm 参数中的 wap 端标识，固定为 2
     * @param  {string} city       ctm 参数中的城市缩写，通常是 vars.paramcity
     * @param  {string} pageName   ctm 参数中的页面简称，固定为 xf_search
     * @param  {string} moduleName ctm 参数中的模块简称
     * @param  {int} index      ctm 参数中的链接顺序
     */
    function ctmRedirect(url, no, city, pageName, moduleName, index) {
        var ctm = 'ctm=' + no + '.' + city + '.' + pageName + '.' + moduleName + '.' + index;
        return url + (/&|\?/.test(url) ? '&' : '?') + 'tjftype=xf&' + ctm;
    }

    /**
     * "城市切换"，为跳转目标添加 ctm 参数
     */
    $('.header > .cent').on('click', 'a[href]', function () {
        var url = ctmRedirect(this.href, ctmWebNo, vars.paramcity, ctmPageShortName, 'city', 1);
        window.location = url;
        return false;
    });

    /**
     * "导航-频道"，为跳转目标添加 ctm 参数
     */
    $('.nav-icons').on('click', 'a[href]', function () {
        var url = ctmRedirect(this.href, ctmWebNo, vars.paramcity, ctmPageShortName, 'dh_channel', $(this).index() + 1);
        window.location = url;
        return false;
    });

    /**
     * "导航-应用"，为跳转目标添加 ctm 参数
     */
    $('.app-icons').on('click', 'a[href]', function () {
        var url = ctmRedirect(this.href, ctmWebNo, vars.paramcity, ctmPageShortName, 'dh_app', $(this).index() + 1);
        window.location = url;
        return false;
    });

    /**
     * "面包屑"，为跳转目标添加 ctm 参数
     */
    $('.crumbs').on('click', 'a[href]', function () {
        var url = ctmRedirect(this.href, ctmWebNo, vars.paramcity, ctmPageShortName, 'crumbs', $(this).index() + 1);
        window.location = url;
        return false;
    });

    /**
     * "地图"，为跳转目标添加 ctm 参数
     */
    $('.mapbtn').on('click', function () {
        var url = ctmRedirect(this.href, ctmWebNo, vars.paramcity, ctmPageShortName, 'map', 1);
        window.location = url;
        return false;
    });

    /**
     * "条件_位置"，为跳转目标添加 ctm 参数
     */
    $('.whereChioce > .column2, .whereChioce > .column3').on('click', 'a[href]', function () {
        var url = ctmRedirect(this.href, ctmWebNo, vars.paramcity, ctmPageShortName, 'area', 1);
        window.location = url;
        return false;
    });

    /**
     * "条件_价格_单价"，为跳转目标添加 ctm 参数
     */
    $('#priceChioceDj dd').on('click', 'a[href]', function () {
        var url = ctmRedirect(this.href, ctmWebNo, vars.paramcity, ctmPageShortName, 'price', 1);
        window.location = url;
        return false;
    });

    /**
     * "条件_热门"，为跳转目标添加 ctm 参数
     */
    $('.characterChioce').on('click', 'a[href]', function () {
        var url = ctmRedirect(this.href, ctmWebNo, vars.paramcity, ctmPageShortName, 'hot', 1);
        window.location = url;
        return false;
    });

    /**
     * "条件_更多"，为跳转目标添加 ctm 参数
     */
    $('.moreChooseBtn').on('click', function () {
        checkLocation();
        return false;
    });

    /**
     * "楼盘列表"，为跳转目标添加 ctm 参数
     */
    $('.houseList').on('click', 'a[name="xfTongji"]', function () {
        var aTag = $('.houseList a[name="xfTongji"]');
        var index = aTag.index($(this)) + 1;
        var url = ctmRedirect(this.href, ctmWebNo, vars.paramcity, ctmPageShortName, 'lplist', index);
        // 20160909新需求，跳转增添参数
        if (vars.abTest) {
            url = url + '&' + vars.abTest;
        }
        if (vars.newkeywordad && aTag.find('span.newkeywordad').length) {
            url = url + '&' + vars.newkeywordad;
        }
        window.location = url;
        return false;
    });

    /**
     * "标签" - 楼盘列表中的标签，为跳转目标添加 ctm 参数
     */
    $('.house-Tag').on('click', 'a[href]', function () {
        var index = $(this).index() + 1,
            dataName = $(this).attr('data-name');
        if (this.id === 'wapxfsy_D01_36') {
            buyhouse(index);
        } else if (this.id === 'wapxfsy_D01_35' || this.name === 'wapxfsyname') {
            tiaozhuan(dataName, index);
        } else {
            var url = ctmRedirect(this.href, ctmWebNo, vars.paramcity, ctmPageShortName, 'tag', 1);
            window.location = url;
        }
        return false;
    });

    /**
     * "快速入口" - 尾部标签，为跳转目标添加 ctm 参数
     */
    $('.typeList').on('click', 'a[href]', function () {
        var index = $('.typeList a[href]').index($(this)) + 1;
        var url = ctmRedirect(this.href, ctmWebNo, vars.paramcity, ctmPageShortName, 'rukou', index + 1);
        window.location = url;
        return false;
    });

    /**
     * "尾部"，为跳转目标添加 ctm 参数
     */
    $('.footer > div:visible').on('click', 'a[href]', function () {
        if ($(this).hasClass('appDown')) {
            return true;
        }
        var url = ctmRedirect(this.href, ctmWebNo, vars.paramcity, ctmPageShortName, 'tail', $(this).index() + 1);
        window.location = url;
        return false;
    });

    /**
     * yangfan rewrite 20160508 "帮你买房" 标签点击, 登录或不登录跳转方式不同
     * 为跳转目标添加 ctm 参数
     */
    function buyhouse(index) {
        var url;
        if (sfut) {
            $.get('/user.d?m=getUserinfoBySfut', function (data) {
                if (data) {
                    var dataRoot = data.root;
                    if (dataRoot.return_result === '100') {
                        url = 'http://m.fang.com/house/ec/buyhouse/index?city=' + vars.getcityname + '&phone=' + dataRoot.mobilephone + '&name=' + encodeURIComponent(dataRoot.username) + '&from=http://m.fang.com/xf/' + vars.paramcity + '/';
                        url = ctmRedirect(url, ctmWebNo, vars.paramcity, ctmPageShortName, 'tag', index);
                        window.location = url;
                    }
                }
            });
        } else {
            url = 'http://m.fang.com/house/ec/buyhouse/index?city=' + vars.getcityname + '&phone=&name=&from=http://m.fang.com/xf/' + vars.paramcity + '/';
            url = ctmRedirect(url, ctmWebNo, vars.paramcity, ctmPageShortName, 'tag', index);
            window.location = url;
        }
    }

    /**
     * yangfan rewrite 20160508 为跳转目标添加 ctm 参数
     * @param  {string} tags 目标页面 tags 参数，为标签 data-name 属性值
     * @param  {int} index ctm 参数链接顺序
     */
    function tiaozhuan(tags, index) {
        var url = '/xf/' + vars.paramcity + vars.district + '/' + vars.price + vars.character + vars.purposexf + vars.saleDate + vars.orderby + vars.round + vars.fitment + vars.railway + vars.comarea + vars.station;
        if (tags) {
            url = url + '?tags=' + tags;
        }
        url = ctmRedirect(url, ctmWebNo, vars.paramcity, ctmPageShortName, 'tag', index);
        window.location = url;
    }

    /**
     * '条件-更多'确定按钮事件
     * @param  {int} index ctm 参数链接顺序
     */
    function checkLocation() {
        if (changeFlag !== 0) {
            district = '';
            price = '';
            railway = '';
            character = '';
            xt = '';
            xq = '';
            station = '';
            comarea = '';
            tags = '';
        }
        // 搜索
        var keyword = vars.keyword || '';
		// 户型
		var room = $('#characterChioce .active').attr('value') || '';
		// 类型
        var a = $('.shaixuanleixing .active').attr('value') || '';
		// 开盘时间
        var saleDate = $('.shaixuankaipan .active').attr('value') || '';
		// 排序
        var orderby = $('.shaixuanpaixu .active').attr('value') || '';
		// 环线
        var round = $('.shaixuanhuanxian .active').attr('value') || '';
		// 装修
        var fitment = $('.shaixuanzhuangxiu .active').attr('value') || '';
		// 热门
		var remen = $('.saixuanremen .active').attr('value') || '';
		// 面积
		var mianji = $('.shaixuanmianji .active').attr('value') || '';
		if (mianji) {
			mianji = 'sq' + mianji;
		}

        var f = (price ? 1 : 0) + (railway ? 1 : 0) + (character ? 1 : 0) + (xt ? 1 : 0) + (xq ? 1 : 0) + (station ? 1 : 0) + (comarea ? 1 : 0) + (a ? 1 : 0) + (orderby ? 1 : 0) + (saleDate ? 1 : 0) + (round ? 1 : 0) + (fitment ? 1 : 0);
        var flag = '';
        if (f !== 0) {
            flag = '/';
        }
        var b = '';
        if (tags || keyword) {
            b = '/xf/' + vars.paramcity + district + '/' + price + remen + a + saleDate + orderby + round + xt + xq + fitment + railway + station + room + comarea + mianji + flag + '?' + (tags? 'tags':'') + tags + keyword;
        } else {
            b = '/xf/' + vars.paramcity + district + '/' + price + remen + a + saleDate + orderby + round + xt + xq + fitment + railway + station + room + comarea + mianji + flag;
        }
		// 价格  热门  类别  开盘  排序  环线  学校类型 学区  装修 地铁 地铁站 商圈 户型 面积

        var url = ctmRedirect(b, ctmWebNo, vars.paramcity, ctmPageShortName, 'more', 1);
        window.location = url;
    }

    // 登录后获取用户名，手机号和用户ID
    var userphone;
    function getInfo(data) {
        userphone = data.mobilephone || '';
    }
    // 调用ajax获取登陆用户信息
    if (sfut) {
        vars.getSfutInfo(getInfo);
    }

    /* 预约看房（2016年6月1日）*/
    $('.yykf').on('click', function () {
        var locationHref = window.location.href;
        // 如果登陆了
        if (sfut) {
            // 如果绑定手机号了
            if (userphone) {
                window.location.href = $(this).attr('data-href');
            } else {
                window.location.href = 'https://m.fang.com/passport/resetmobilephone.aspx?burl=' + encodeURIComponent(locationHref);
            }
        } else {
            window.location.href = 'https://m.fang.com/passport/login.aspx?burl=' + encodeURIComponent(locationHref);
        }
    });

	var moreFunc = function (a) {
		$(a).on('click', function () {
			var $this = $(this);
			if ($this.hasClass('hb')) {
				return;
			} else if ($this.hasClass('active')) {
				$this.removeClass('active');
			} else {
				$(a).removeClass('active');
				$this.addClass('active');
			}
			moreChioceNum();
		})
	};
	// 热门 类型 面积 开盘时间 排序 装修 环线
	var i, moreArr = new Array('.saixuanremen a', '.shaixuanleixing a', '.shaixuanmianji a', '.shaixuankaipan a', '.shaixuanpaixu a', '.shaixuanzhuangxiu a', '.shaixuanhuanxian a');
	for (i in moreArr) {
		moreFunc(moreArr[i]);
	}

	var $morechioce = $('#moreChioce span');
	var moreChioceNum = function () {
		var length = $('#moreChoo .active').length;
		if (length) {
			$morechioce.html('更多(' + $('#moreChoo .active').length + ')');
		} else {
			$morechioce.html('更多');
		}
	};
	moreChioceNum();

    if ($('.closebtn').length) {
        $('.center').hide();
    }
    // 品牌入口相关
    $('.closebtn').css('z-index', '5').on('click', function () {
        $('.tui').hide();
        $('.center').show();
    });

    $('.quantui').on('click', function (e) {
        if (e.toElement.className == 'closebtn') {
            return;
        }
        window.open($(this).attr('data-href'));
    });

    var text = $('.quantui .text .f15').html();
    function func (str) {
        var output = [];
        for(var i = 0, iLen = str.length; i < iLen; i++){
            if(str[i].match(/\d/)){
                output.push('<span style="color: red;">' + str[i] + '</span>');
            }else{
                output.push(str[i]);
            }
        }
        $('.quantui .text .f15').html(output);
    }
    if (text) {
        func (text);
    }

    $('.quantui .btn').on('click', function () {
        window.open($('.quantui').attr('data-href'));
    });

    $('.zhutuileft').on('click', function (e) {
        var hrefload;
        if (e.clientX < $('.zhutui').width() - 80) {
            hrefload = $('.zhutuileft').attr('data-href');
        } else {
            hrefload = $('.zhutuiright').attr('data-href');
        }
        window.open(hrefload);
    });
    $('.zhutuiright, .content h3, .content .biaoyu').on('click', function () {
        window.open($('.zhutuiright').attr('data-href'));
    });

    // 当前条件下，有新楼盘通知我
    function showMessage(msg) {
        // 65为favorite里设置了margin-left: -65px;
        var width = ($(window).width() - $('#favorite_msg').width()) / 2 + 65;
        $('#favorite_msg').html(msg).css({left: width + 'px'}).show();
        setTimeout(removeDiv, 1500);
    }
    function removeDiv() {
        $('#favorite_msg').hide(500);
    }
    $('#xfContentList').on('click', function (e) {
        var targetClass = e.target.className;
        if (targetClass == 'xzlpBtn') {
            xinloupantongzhi();
            $('#hideNotice').one('click', function () {
                $("#xzlpOpen").hide();
                enable();
            });
        }
    });
    $('.xzlpBtn').on('click', function () {
        xinloupantongzhi();
    });
    $('#hideNotice').on('click', function () {
        $("#xzlpOpen").hide();
        enable();
    });
    var bukedian = false;
    var isfirst = true;
    var xinloupantongzhi = function () {
        if (bukedian) {
            return;
        }
        unable();
        var isvalid = sfut ? '1' : '';
        // 调用验证码模块========================start
        var yanzhengma = require('yanzhengma/1.0.0/yanzhengma');
        if(vars.userphone){
          $('.yzm').hide();
            $('.phone').val(vars.userphone);
        }
        if (isfirst) {
            new yanzhengma({
                // 如果已登录且绑定手机号，值为'1'；否则值为空
                isvalid: isvalid,
                // 如果已登录且绑定手机号，值为手机号
                loginInPhone: $('.phone').val(),
                // 手机号输入框（切图type为num）
                phoneInput: $('.phone'),
                // 验证码输入框（切图type为num）
                codeInput: $('.vcode'),
                // 发送验证码按钮
                sendCodeBtn: $('.getPhoneVcode'),
                // 提交按钮
                submitBtn: $('.xlpQd'),
                // 登录后修改手机号时需要显示或隐藏的元素(可多个)
                showOrHide: $('.yzm'),
                // 发送验证码按钮变为可点状态的样式（需自定义，可设置css样式，也可addClass,也可不填）
                sendCodeBtnActive: function () {
                    $('.getPhoneVcode').css({
                        color: '#ff6666',
                        border: '1px solid #ff6666'
                    });
                },
                // 发送验证码按钮变为不可点状态的样式（需自定义，可设置css样式，也可addClass，也可不填）
                sendCodeBtnUnActive: function () {
                    $('.getPhoneVcode').css({
                        color: '#565c67',
                        border: '1px solid #565c67'
                    });
                },
                // 其他自定义的检测项目(请自定义，如果没有，请return true;)
                checkOthers: function () {
                    return true;
                },

                // 执行请求(请自定义)
                postJsonData: function () {
                    $.getJSON('/xf.d?m=dingyueXzlp', {
                        phone: $('.phone').val(),
                        vcode: $('.vcode').val(),
                        district: vars.paramdistrict,
                        comarea: vars.paramcomarea,
                        subwayline: vars.paramrailway,
                        subwaystation: vars.paramrailwaystation,
                        city: vars.paramcity,
                        schoolname: vars.ubxq,
                        purpose: vars.parampurpose,
                        priceInterval: vars.price,
                        houseType: vars.bedrooms
                    }, function (data) {
                        // 100:报名成功; '-8'：您已报名过该线路; '-10':您已报名过同一时间的其他线路啦
                        if (parseInt(data.root.code) === 100) {
                            showMessage(data.root.message);
                            // 置灰
                            $('.xzlpBtn').html('<i style="color:#e3e7ed">当前条件下，有新楼盘通知我</i>');
                            // 按钮设置为不可点
                            bukedian = true;
                        } else {
                            showMessage(data.root.message);
                        }
                        $("#xzlpOpen").hide();
                        $('.vcode').val('');
                        enable();
                    });
                },

                // 信息提示方法（可选，默认为alert 参数为提示内容）
                showMessage: function (message) {
                    showMessage(message);
                },

                // 手机号为空时的提示（可选）
                noPhoneTip: '请输入正确的手机号码',
                // 手机号格式错误时的提示（可选）
                wrongPhoneTip: '请输入正确的手机号码',
                // 验证码为空时的提示（可选）
                noCodeTip: '验证码格式不正确',
                // 验证码格式错误时的提示（可选）
                nonstandardCodeTip: '验证码格式不正确',
                // 验证码与手机号不匹配时的提示（可选）
                wrongCodeTip: '手机验证码错误',
                // 倒计时样式（可为空,唯一参数值为's'）
                countdown: ''
            });
            isfirst = false;
        }
        // 调用验证码模块========================end
        $("#xzlpOpen").show();
    };
});
