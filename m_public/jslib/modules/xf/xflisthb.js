define('modules/xf/xflisthb',
    ['jquery', 'util/util','hslider/1.0.0/hslider', 'lazyload/1.9.1/lazyload', 'footprint/1.0.0/footprint',
        'iscroll/2.0.0/iscroll-lite', 'slideFilterBox/1.0.0/slideFilterBox','modules/xf/loadMore','modules/xf/IcoStar',
        'modules/xf/ZhiYeGuWen','modules/xf/XfTongJi', 'swipe/3.10/swiper'],
    function (require) {
        'use strict';
        var $ = require('jquery');
        var cookiefile = require('util/util');
        var sfut = cookiefile.getCookie('sfut');
        var vars = seajs.data.vars;
        var localStorage = vars.localStorage;
        var IScrolllist = require('iscroll/2.0.0/iscroll-lite');
        var IScroll = require('slideFilterBox/1.0.0/slideFilterBox');
        var hslider = require('hslider/1.0.0/hslider');
        var lazy = require('lazyload/1.9.1/lazyload');
        var loadMore = require('modules/xf/loadMore');
        var IcoStar = require('modules/xf/IcoStar');
        var ZhiYeGuWen = require('modules/xf/ZhiYeGuWen');
        var XfTongJi = require('modules/xf/XfTongJi');
        var Swiper = require('swipe/3.10/swiper');

        // 控制星星亮
        var icoStarObj = new IcoStar('.ico-star');
        // 置业顾问
        var zhiYeGuWenObj = new ZhiYeGuWen('.online');
        // 新房统计
        var xfTongJiObj = new XfTongJi('[name*="xfTongji"]');
        // 懒加载
        lazy('img[data-original]').lazyload();

        var Footprint = require('footprint/1.0.0/footprint');
        Footprint.push('新房楼盘', '//m.fang.com/xf/' + vars.paramcity + '/', vars.paramcity);
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
            var pricemin = $priceminI.html().trim();
            var pricemax = $pricemaxI.html().trim();
            pricemin = pricemin === '不限' ? 0 : pricemin;
            pricemax = pricemax === '不限' ? '' : pricemax;

			// 单价 跳转到本页
			if (type == 'dj') {
				if (Number(pricemin) === 0 && !pricemax) {
                    var url1 = vars.character
                        + vars.purposexf + vars.saleDate + vars.orderby + vars.round + vars.fitment
                        + vars.railway + vars.comarea + vars.station + vars.bedrooms + vars.purposeArea;
                    url1 = url1? url1 + '/' : url1;
					window.location.href = '/xf/' + vars.paramcity + vars.district + '/' + url1 + tags + '?red=hb' + query;
				} else {
					window.location.href = '/xf/' + vars.paramcity + vars.district + '/pr' + pricemin
						+ ',' + pricemax + vars.character + vars.purposexf + vars.saleDate + vars.orderby + vars.round
						+ vars.fitment + vars.railway + vars.comarea + vars.station + vars.bedrooms + vars.purposeArea + '/' + tags + '?red=hb' + query;
				}
			} else {
				if (Number(pricemin) === 0 && !pricemax) {
					var url1 = vars.character
						+ vars.purposexf + vars.saleDate + vars.orderby + vars.round + vars.fitment
						+ vars.railway + vars.comarea + vars.station + vars.bedrooms + vars.purposeArea;
					url1 = url1? url1 + '/' : url1;
					window.location.href = '/xf/' + vars.paramcity + vars.district + '/' + url1 + tags + '?red=hb' + query;
				} else {
					window.location.href = '/xf/' + vars.paramcity + vars.district + '/' + vars.character + vars.purposexf + vars.saleDate + vars.orderby + vars.round
						+ vars.fitment + vars.railway + vars.comarea + vars.station + vars.bedrooms + vars.purposeArea + 'hr' + pricemin
						+ ',' + pricemax + '/' + tags + '?red=hb' + query;
				}
			}
        }
        
        var district = $('#districtChange').val(),
            price = $('#priceChange').val(),
            railway = $('#railwayChange').val(),
            character = $('#characterChange').val(),
            comarea = $('#comareaChange').val(),
            station = $('#stationChange').val(),
            xq = $('#xqChange').val(),
            changeFlag = 0;
if(!comarea){
	clearCookie('comareaOrder');
}
if(!station){
	clearCookie('stationOrder');
}
        function checkLocation(sort) {
			localStorage.setItem('recordOrder', recordOrder);
			setKpdateOrder();
            if (changeFlag !== 0) {
                district = '';
                price = '';
                railway = '';
                character = '';
                xq = '';
                station = '';
                comarea = '';
            }
			// 类型
            var a = $('.shaixuanleixing .active').attr('value') || '',
				// 户型
				room = vars.bedrooms || '',
				// 开盘时间
                saleDate = $('.shaixuankaipan .active').attr('value') || '',
				// 排序
				orderby = sort == 'default' ? '' : (sort || $('.shaixuanpaixu .active').attr('value') || ''),
				// 环线
                round = $('.shaixuanhuanxian .active').attr('value') || '',
				// 装修
                fitment = $('.shaixuanzhuangxiu .active').attr('value') || '',
				// 热门
				remen = $('.saixuanremen .active').attr('value') || '',
				// 总价
				zongjia = vars.hxpricerange || '';

			// 面积
			var mianji = '';
			$('.shaixuanmianji .active').each(function () {
				var $this = $(this);
				if (!mianji) {
					mianji = mianji + '[' + $this.attr('value') + ']';
				} else {
					mianji = mianji + ',' + '[' + $this.attr('value') + ']';
				}
			});
			if (mianji) {
				mianji = 'sq' + mianji;
			}

			// 销售状况
			var sell = '';
			$('.shaixuanxiaoshou .active').each(function () {
				var $this = $(this);
				if (!sell) {
					sell += $this.attr('value');
				} else {
					sell = sell + ',' + $this.attr('value');
				}
			});
			if (sell) {
				sell = 'sell' + sell;
			}

            var f = (price ? 1 : 0) + (railway ? 1 : 0) + (character ? 1 : 0) + (xq ? 1 : 0) + (station ? 1 : 0) + (comarea ? 1 : 0)
                + (a ? 1 : 0) + (orderby ? 1 : 0) + (saleDate ? 1 : 0) + (round ? 1 : 0) + (fitment ? 1 : 0);
            var flag = '';
            if (f !== 0) {
                flag = '/';
            }
            if(comarea){
            	comarea = 'co' + comarea;
            }
            if(station){
            	station = 'st' + station;
            }
			//                                                    价格  热门     类别      开盘   排序    环线  学校类型 学区  装修  地铁       地铁站      商圈    户型   销售状况 面积   面积
            var b = '/xf/' + vars.paramcity + district + '/' + price + remen + a + saleDate + orderby + round + xq + fitment + railway + station + comarea + room + sell + zongjia + mianji + flag + '?red=hb';
            window.location.href = b;
        }
        // 阻止页面滑动
        function unable() {
            document.addEventListener('touchmove', preventDefault);
        }
        function preventDefault(e) {
            e.preventDefault();
        }
        // 取消租住页面滑动
        function enable() {
            document.removeEventListener('touchmove',preventDefault);
        }
        // 最下面的导航-------------satrt
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
        // 列表页底部滑动
        var setTab = function (obj, index) {
            var $span = $(obj).find('.pointBox span');
            $span.removeClass('cur').eq(index).addClass('cur');
        };
        var windoWidth = $(window).width();
        $('.typeListB').each(function () {
            var $this = $(this);
            //$this.find('.swiper-slide').width($this.width()).height($this.find('.swiper-wrapper').height());
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
			$(this).parent().hide();
            xqajax(false);
        });
        function xqajax(flag) {
            var querystrBefore = '/xf/' + vars.paramcity + '/' + vars.district + vars.price
                + vars.character + vars.purposexf + vars.saleDate + vars.orderby + vars.round + vars.bedrooms + vars.purposeArea;
            var querystrAfter = vars.fitment + vars.comarea + '/?red=hb';
            $.post('/xf.d?m=schoollist&type=lp&city=' + vars.paramcity + '&district=' + vars.paramdistrict
                + '&p=' + schoolcpnum + '&seitem=' + vars.paramxq + '&querystr_before=' + querystrBefore + '&querystr_after=' + querystrAfter,
                function (data) {
                    $('#xqfChioce dl').append(data);
                    schoolcpnum += 1;
                    IScroll.refresh('#xqfChioce', 'stand');
                    if (flag) {
                        callView(true);
                    }
                });
        }
        // 快筛学区里的更多----------------------------------------------end
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
            tags: vars.loadtags,
            red: 'hb',
			sell: vars.paramsell,
			hxpricerange: vars.newhxpricerange,
			bedrooms: vars.bedrooms
        };
        var options = {
            moreBtnID: '#drag',
            loadPromptID: '#loading',
            contentID: '#xfContentList',
            ajaxUrl: '/xf.d',
            ajaxData: dataConfig,
            pageNumber: 10,
            pagesize: oneInfo,
            total: totalInfo,
            ajaxFn: {
                icoStar: icoStarObj,
                zhiYeGuWen: zhiYeGuWenObj,
                xfTongJi: xfTongJiObj
            }
        };
        // 调用加载更多模块实现加载更多
        loadMore(options);
        if (vars.esfshowflag !== 0 && vars.esfcount > 0 && !vars.paramkeyword) {
            $('.houseList').hide();
        }
        var showFirst = true;

        var $lbTab = $('.lbTab');
        // 快筛点击按钮---------------------------------------------------------------------------start
        var $ide = $('[name*="ide"]');
        var $sift = $('#sift');
        $ide.on('click',function () {
            // 加Class使其全部显示
            $lbTab.children('div').show();
			$sift.addClass('tabSX');
            var a = $(this).attr('class') || '';
            var b = $(this).attr('name').split(' ')[0];
            if (a.indexOf('active') < 0) {
                $ide.removeClass();
                $(this).addClass('active');
                $sift.removeClass();
				$lbTab.children('div').hide();
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
                            $('dd[name*="xqfChioce"]').addClass('active');
                            if ($('#xqfitem').find('dd.active').length === 0) {
                                xqajax(true);
                            }
                            $('#xqfChioce').show();
                            IScroll.refresh('#xqfChioce');
                            callView(true);
                        }
                        // 针对地铁快筛
                        if (vars.paramrailway) {
                            districtSubway('#subwayChioce',vars.paramrailwaystation);
                        }
                        // 针对区域进行筛选
                        if (vars.paramdistrict) {
                            districtSubway('#districtChioce',vars.paramcomarea);
                        }
                        // 新加的需求，在没有别的条件时，点位置时默认选中区域 -->不限
                        if (!$('.column2').is(':visible')) {
                            var $districtChioce = $('#districtChioce');
                            var $districtChioceDd = $districtChioce.find('dd');
                            $('#whereChioce').find('dd[name*=districtChioce]').addClass('active');
                            $districtChioce.show();
                            $districtChioceDd.removeClass();
                            $districtChioceDd.eq(0).addClass('active');
                            IScroll.refresh('#districtChioce');
                        }
                        showFirst = false;
                    }
                    callView(true);
                }
                // 点击价格所执行的函数
                if ($(this).attr('name').indexOf('priceChioce') > -1) {
					unable();
					if ($('.price-list .active').html() == '单价') {
						IScroll.refresh('#priceChioceDj');
						// 调用价格滑动插件（单价）
						priceChioceFunDj();
					} else {
						IScroll.refresh('#priceChioceZj');
						// 调用价格滑动插件（总价）
						priceChioceFunZj();
					}
                }
                // 点击更多所执行的函数
                if ($(this).attr('name').indexOf('allChioce') > -1) {
                    allChioceFun();
                }
                $('ul.flexbox').show();
                unable();
            } else {
                KShide();
            }
        });
        // 点击黑框隐藏
        $('.float').on('click',function () {
        	 if(($('#districtChioce').is(':visible') && $('#districtChioce').find('dd.active[name*=districts]').attr('str'))
        			    ||($('#subwayChioce').is(':visible')&& $('#subwayChioce').find('dd.active[name*=stations]').attr('str')) ){
        			    		 $('.confirmBtn').click();
        			    	 }
        			    	 else{
        			        KShide();
        			    	 }
			//chongzhi();
        });

        /*
         *调用显示区的快筛
         */
        function callView(flag) {
            var $column2Visible = $('.column2:visible');
            var $column3Visible = $('.column3:visible');
            var viewHeight = $('.whereChioce ').height();
            if (flag && $column2Visible.length > 0) {
                viewArea(viewHeight,$column2Visible.find('dd.active').index(),$column2Visible.find('dd').length,$column2Visible.attr('id'));
            }
            if ($column3Visible.length > 0) {
                viewArea(viewHeight,$column3Visible.find('dd.active').index(),$column3Visible.find('dd').length,$column3Visible.attr('id'));
            }
        }

        /*
         *将选中快筛标签显示到显示区
         */
        function viewArea(containerHeight,index,length,element) {
            // 每一个元素dd的高度为44
            var ddHeight = 44;
            var bottomHeight = (length - index) * ddHeight;
            var height = - ddHeight * index;
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
        function districtSubway(str,param3) {
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
        $('[name*="neIde"]').on('click',function () {
            // 区域下隐藏
            $('.stations').hide();
            // 地铁下隐藏
            $('.districts').hide();
            // 学区下隐藏
            $('#xqfChioce').hide();
            var $subwayChioce = $('#subwayChioce'),
                $xqfChioce = $('#xqfChioce'),
                $districtChioce = $('#districtChioce'),
                $districtChioceIde = $('[name="districtChioce neIde"]'),
                $subwayChioceIde = $('[name="subwayChioce neIde"]'),
                $xqfChioceIde = $('[name="xqfChioce neIde"]');
            var a = $(this).attr('name').split(' ')[0];
            if (a === 'districtChioce') {
                showLevelTwo($subwayChioce,$xqfChioce,$districtChioceIde,$subwayChioceIde,$xqfChioceIde);
            }else if (a === 'subwayChioce') {
                showLevelTwo($xqfChioce,$districtChioce,$subwayChioceIde,$districtChioceIde,$xqfChioceIde);
            }else if (a === 'xqfChioce') {
                showLevelTwo($districtChioce,$subwayChioce,$xqfChioceIde,$districtChioceIde,$subwayChioceIde);
            }
            var $choose = $('#' + a);
            // 如果之前没有选择，则默认选择第一个
            if ($choose.find('dd.active').length === 0) {
                $choose.find('dd:first').addClass('active');
            }
            $choose.show();
            // 刷新div，为的是能够用Scroll滑动
            IScroll.refresh('#' + a);
            // 选中标签显示在可视区域内
            callView(true);
            unable();
        });
        function showLevelTwo($hideOne,$hideTwo,$active,$removeOne,$removeTwo) {
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
        $stations.on('click',function () {
            var that = this;
            stationDistinctThree(that,$stations,'.stations');
            $('.whereChioce .resetBtn').click();
            // 选中标签显示在可视区域内
            callView(false);
        });
        // 新增商圈
        var $districts = $('[name*="districts"]');
        $districts.on('click',function () {
            var that = this;
            stationDistinctThree(that,$districts,'.districts');
            $('.whereChioce .resetBtn').click();
        });
        // 新增学区
        var $xt =  $('[name*="xt"]');
        $xt.on('click', function () {
            var that = this;
            stationDistinctThree(that, $xt, '.xt');
        });

        function stationDistinctThree(that1,$stationDistrictName,stationDistrictClass) {
            var a = $(that1).attr('str');
            $stationDistrictName.removeClass();
            $(that1).addClass('active');
            $(stationDistrictClass).hide();
            $('#' + a).show().find('dd:first').addClass('active');
            IScroll.refresh('#' + a);
            unable();
        }
        // 快筛位置第二层点击---------------------------------------------------end
        // 新房统计
        $('input[name="tongjihidden"]').each(function () {
            var showurl = $(this).val();
            var getWirelessCode = $(this).attr('data-name');
            var image = new Image();
            image.src = '//client.3g.fang.com/http/sfservice.jsp?' + showurl + '&wirelesscode=' + getWirelessCode + '&imei=' + cookiefile.getCookie('global_cookie');
            image.display = 'none';
        });

        $('#hideHongBao').click(function () {
            $('.hb-out').hide();
        });
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
        var $choseItemAll = $('.chose-item');
        $moreClass.find('.btnIn').on('click', function () {
            chongzhi();
        });
		var chongzhi = function () {
			$choseItemAll.find('a').removeClass('active');
			moreChioceNum();
			$('.saixuan').html('');
			recordOrder = '';
			localStorage.setItem('recordOrder', recordOrder);
		};
        // 确定------------
        $('.moreChooseBtn').on('click', function () {
            checkLocation();
        });
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

		// 价格滑动插件  ------------------------------------------start
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
				});
				// 总价右边滚动条
				$pricemax.on('touchstart', function () {
					$pricemin.removeClass('hover');
					$pricemax.addClass('hover');
				}).on('touchend', function () {
					$pricemax.removeClass('hover');
				});
				priceFirstflagDj = false;
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
            priceHsliderZj._initPos(min, max);
            // 总价左边滚动条
			if (priceFirstflagZj) {
				$pricemin.on('touchstart', function () {
					$pricemin.addClass('hover');
					$pricemax.removeClass('hover');
				}).on('touchend', function () {
					$pricemin.removeClass('hover');
					$('#priceminzj i').html($('#priceminzj i').html() == 0 ? '不限': $('#priceminzj i').html());
				});
				// 总价右边滚动条
				$pricemax.on('touchstart', function () {
					$pricemin.removeClass('hover');
					$pricemax.addClass('hover');
				}).on('touchend', function () {
					$pricemax.removeClass('hover');
				});
				priceFirstflagZj = false;
			}
		}
		// 点击确定
		$('.priceChioce .chooseBtn').on('click', function () {
			if ($(this).hasClass('dj')) {
				goPrice('dj');
			} else {
				goPrice('zj');
			}
		});
		// 价格滑动插件 ------------------------------------------end

		// 统计行为 --------------start
        require.async('jsub/_vb.js?c=mnhdslist');
        require.async('jsub/_ubm.js?_2017102307fdsfsdfdsd', function () {
            yhxw();
        });
        require.async('//clickm.fang.com/click/new/clickm.js', function () {
            Clickstat.eventAdd(window, 'load', function () {
                if (vars.paramcity == 'sh') {
                    Clickstat.batchEvent('wapxfsy_', 'sha');
                } else {
                    Clickstat.batchEvent('wapxfsy_', vars.paramcity);
                }
            });
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
                    fmt = fmt.replace(RegExp.$1,o[k]);
                }
            }
            return fmt;
        };

		var housetype = '';
		$('#characterChioce .active').each(function () {
			var $this = $(this).find('a');
			var html = $this.html();
			if (html != '不限') {
				if (housetype) {
					housetype = housetype + ',' + encodeURIComponent(html);
				} else {
					housetype = housetype + encodeURIComponent(html);
				}
			}
		});

		var zongjiamaima = vars.hxpricerange || '';
		if (zongjiamaima) {
			zongjiamaima = zongjiamaima.replace('hr', '');
			var zongjiamaima1 = zongjiamaima.split(',')[0];
			var zongjiamaima2 = zongjiamaima.split(',')[1] || '99999';
			zongjiamaima = zongjiamaima1 + '-' + zongjiamaima2;
		}

		  var $districtsHref = $('.districts').find('dd');
		    var $stationsHref = $('.stations').find('dd');
		 // 区域的跳转
		    $districtsHref.on('click', function () {
		        //$districtsHref.removeClass();
		        //$(this).addClass('active');
		    	var $this = $(this);
		    	var cid = $('#districtChioce').find('dd.active[name*=districts]').attr('str');
		    	var cookieComarea = cookiefile.getCookie('comareaOrder')||cid+'|';
		    	var cookieDistrictId = '';
		    	if(cookieComarea){
		    		cookieDistrictId = cookieComarea.split('|')[0];
		    	}
		    	if(cookieDistrictId&&cid!==cookieDistrictId){
		    		cookiefile.setCookie('comareaOrder',cid+'|',365);
		    		cookieComarea = cid+'|';
		    	}
				if ($this.hasClass('active')) {
					$this.removeClass('active');
					//hxOrder = hxOrder.replace($this.attr('value') + '.', '');
					cookiefile.setCookie('comareaOrder', cookieComarea.replace($this.attr('value')+',',''), 365);
				} else {
					if (!$this.attr('value')) {
						$this.parent().find('.active').removeClass('active');
						cookiefile.setCookie('comareaOrder', cid+'|', 365);
						//hxOrder = '';
					}
					$this.addClass('active');
					if ($this.attr('value')) {
				
						cookiefile.setCookie('comareaOrder', cookieComarea+($this.attr('value')+','), 365);
					}
				}
				
				$("section[id^='districts_']").not('#'+cid).find('.active').removeClass('active');
				if ($this.attr('value') && $this.parent().find('.active').length !== 1 /*&& $('#characterChioce .active').length !== $('#characterChioce dd').length*/) {
					$this.parent().find('dd').eq(0).removeClass('active');
				}
		    });
			var comareas = '',comareaTemp = '',stations = '',stationTemp = '',railwayTemp = '';
			$('.whereChioce .confirmBtn').on('click', function () {
				if($('#districtChioce').is(':visible')){
				$('.whereChioce .districts .active').each(function () {
					var $this = $(this);
				 	if (!comareas) {
				 		comareaTemp = $this.attr('value');	 		
				 	} 
				});
				var cookieComarea = cookiefile.getCookie('comareaOrder');
				if(cookieComarea){
					comareas = cookieComarea.split('|')[1].substring(0,cookieComarea.split('|')[1].length-1);
				}
				if (comareas) {
					comareas = 'co' + comareas;
				}
				var selectedDis = $('#districtChioce').find('dd.active[name*=districts]').attr('str');
				if(comareaTemp === ''){
					cookiefile.setCookie('comareaOrder',selectedDis+'|',365);
				}
				 var href = $('.whereChioce section[id="'+selectedDis+'"]').find('dd[value="'+comareaTemp+'"] a').attr('datahref');
					$(this).attr('href', href.replace(/co(\d)+/,comareas));
				window.location = $(this).attr('href');
				}else if($('#subwayChioce').is(':visible')){
					$('.whereChioce .stations .active').each(function () {
						var $this = $(this);
					 	if (!stations) {
					 		stationTemp = $this.attr('value');	 
					 		railwayTemp = $this.attr('rid');
					 	} 
					});
					var cookieStation = cookiefile.getCookie('stationOrder');
					if(cookieStation){
						stations = cookieStation.split('|')[1].substring(0,cookieStation.split('|')[1].length-1);
					}
					if (stations) {
						var reg = new RegExp("st","g");
						stations = 'st' + stations.replace(reg,'');
					}
					var selectedRail = $('#subwayChioce').find('dd.active[name*=stations]').attr('str');
					if(stationTemp === ''){
						cookiefile.setCookie('stationOrder',railwayTemp+'|',365);
					}
					 var href = $('.whereChioce section[id="'+selectedRail+'"]').find('dd[value="'+stationTemp+'"] a').attr('datahref');
						$(this).attr('href', href.replace(/st(\d)+/,stations));
					window.location = $(this).attr('href');
				}
			});
			$('.whereChioce .resetBtn').on('click', function () {
				//setHxOrder();
				if($('#districtChioce').is(':visible')){
				var selectedDis = $('#districtChioce').find('dd.active[name*=districts]').attr('str');
				cookiefile.setCookie('comareaOrder',selectedDis+'|',365);
				$('.whereChioce .districts .active').each(function () {
					var $this = $(this);
				 	$this.removeClass('active');
				});
				}else if($('#subwayChioce').is(':visible')){
					var selectedRail = $('#subwayChioce').find('dd.active[name*=stations]').attr('rid');
					cookiefile.setCookie('stationOrder',selectedRail+'|',365);
					$('.whereChioce .stations .active').each(function () {
						var $this = $(this);
					 	$this.removeClass('active');
					});
				}
			});
		    // 地铁的跳转
		    $stationsHref.on('click', function () {
		        var $this = $(this);
		    	var rid = $this.attr('rid');
		    	var cookieStation = cookiefile.getCookie('stationOrder')||rid+'|';
		    	var cookieRailwayId = '';
		    	if(cookieStation){
		    		cookieRailwayId = cookieStation.split('|')[0];
		    	}
		    	if(cookieRailwayId&&rid!==cookieRailwayId){
		    		cookiefile.setCookie('stationOrder',rid+'|',365);
		    		cookieStation = rid+'|';
		    	}
		    	
				if ($this.hasClass('active')) {
					$this.removeClass('active');
					//hxOrder = hxOrder.replace($this.attr('value') + '.', '');
					cookiefile.setCookie('stationOrder', cookieStation.replace($this.attr('value')+',',''), 365);
				} else {
					if (!$this.attr('value')) {
						$this.parent().find('.active').removeClass('active');
						cookiefile.setCookie('stationOrder', rid+'|', 365);
						//hxOrder = '';
					}
					$this.addClass('active');
					if ($this.attr('value')) {
				
						cookiefile.setCookie('stationOrder', cookieStation+($this.attr('value')+','), 365);
					}
					
				}
				
			//	$("section[id^='stations_']").not('#'+rid).find('.active').removeClass('active');
				if ($this.attr('value') && $this.parent().find('.active').length !== 1 /*&& $('#characterChioce .active').length !== $('#characterChioce dd').length*/) {
					$this.parent().find('dd').eq(0).removeClass('active');
				}
		    
		    });
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
                    var saleDate = nMonthDayOne.format('yyyyMMdd') + '-'
                        + new Date(new Date(myDate.getFullYear(), cMonth + 2, 1).getTime() - OTime).format('yyyyMMdd');
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
                    var saleDate = nMonthDayOne.format('yyyyMMdd') + '-'
                        + new Date(new Date(myDate.getFullYear(), cMonth, 1).getTime() - OTime).format('yyyyMMdd');
                    return saleDate;
                },
                5: function (myDate) {
                    var cMonth = myDate.getMonth();
                    var nMonthDayOne = new Date(myDate.getFullYear(), cMonth - 6, 1);
                    var OTime = 1000 * 60 * 60 * 24;
                    var saleDate = nMonthDayOne.format('yyyyMMdd') + '-'
                        + new Date(new Date(myDate.getFullYear(), cMonth, 1).getTime() - OTime).format('yyyyMMdd');
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
            var danjia = vars.ubpricesplitesize === 'true' ? vars.ubprice0 : vars.ubprice;
            var schoolDistrict = encodeURIComponent(vars.ubxq);
            var pTemp = {
                // 所属页面
                'vmg.page': 'mnhdslist',
                // 类型
                'vmn.genre': encodeURIComponent(vars.parampurpose),
                // 热门
                'vmn.feature': encodeURIComponent(vars.paramcharacter),
                // 环线
                'vmn.loopline': encodeURIComponent(vars.paramround),
                // 开盘时间段
                'vmn.opentime':  saleDate1 ? encodeURIComponent(open[vars.saleDate]) + ',' + saleDate1 : '',
                // 装修程度间
                'vmn.fixstatus': encodeURIComponent(vars.paramfitment),
                // 区域
                'vmn.position': vars.paramdistrict ? encodeURIComponent(vars.paramdistrict) + '^' + encodeURIComponent(vars.paramcomarea) : '',
                // 地铁
                'vmn.subway': vars.paramrailway ? encodeURIComponent(vars.paramrailway) + '^' + encodeURIComponent(vars.paramrailwaystation) :'',
                // 单价
                'vmn.unitprice': danjia,
                // 学区所属学校
                'vmn.belongschool': schoolDistrict,
				// 户型
				'vmn.housetype': housetype,
				// 总价
				'vmn.totalprice': zongjiamaima,
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

        // 暂时注释
        /*var redbagIndex = localStorage.getItem('xfRedFlag') || '';
        if (!redbagIndex) {
            localStorage.setItem('xfRedFlag', 1);
            $('.hb-out').show();
        }
        $('#hideHongBao').on('click', function () {
            hideHongBao();
        });
        function hideHongBao() {
            $('.hb-out').hide();
        }*/

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

		//设置cookie
		function setCookie(cname, cvalue, exdays) {
			var d = new Date();
			d.setTime(d.getTime() + (exdays*24*60*60*1000));
			var expires = "expires="+d.toUTCString();
			document.cookie = cname + "=" + cvalue + "; " + expires + ' ;domain = .fang.com;path=/';
		}
		//获取cookie
		function getCookie(cname) {
			var name = cname + "=";
			var ca = document.cookie.split(';');
			for(var i=0; i<ca.length; i++) {
				var c = ca[i];
				while (c.charAt(0)==' ') c = c.substring(1);
				if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
			}
			return "";
		}
		//清除cookie
		function clearCookie(name) {
			setCookie(name, "", -1);
		}
		// 户型 开盘时间顺序
		var hxKpdate = getCookie('hxKpdate') || '';
		var hxOrder = hxKpdate.split('|')[0] || '';
		var kpdateOrder = hxKpdate.split('|')[1] || '';

		// 户型多选
		$('#characterChioce dd').on('click', function () {
			var $this = $(this);
			if ($this.hasClass('active')) {
				$this.removeClass('active');
				hxOrder = hxOrder.replace($this.attr('value') + '.', '');
			} else {
				if (!$this.attr('value')) {
					$('#characterChioce .active').removeClass('active');
					hxOrder = '';
				}
				$this.addClass('active');
				if ($this.attr('value')) {
					hxOrder = hxOrder + $this.attr('value') + '.';
				}
			}
			if ($this.attr('value') && $('#characterChioce .active').length !== 1 /*&& $('#characterChioce .active').length !== $('#characterChioce dd').length*/) {
				$('#characterChioce dd').eq(0).removeClass('active');
			}
		});
		// 开盘时间
		$('.shaixuanpaixu a[value="o2"], .shaixuanpaixu a[value="o3"]').on('click', function () {
			var $this = $(this);
			if (kpdateOrder.indexOf($this.attr('value')) != -1) {
				kpdateOrder = kpdateOrder.replace($this.attr('value') + '.', '')
			} else {
				kpdateOrder = $this.attr('value') + '.';
			}
		});
		var setHxOrder = function () {
			setCookie('hxKpdate', hxOrder + '|' + kpdateOrder + '|0', 365);
		};
		var setKpdateOrder =function () {
			setCookie('hxKpdate', hxOrder + '|' + kpdateOrder + '|1', 365);
		};

		var room = '';
		$('#characterChioce .chooseBtn').on('click', function () {
			setHxOrder();
			room = '';
			$('#characterChioce .active').each(function () {
				var $this = $(this);
				if (!room) {
					room += $this.attr('value');
				} else {
					room = room + ',' + $this.attr('value');
				}
			});
			if (room) {
				room = 'hx' + room;
			}
			var href = $('#characterChioce dd[value="1"] a').attr('datahref').split('hx1');
			var href1 = href[0];
			var href2 = href[1];
			$(this).attr('href', href1 + room + href2);
		});

		// 更多中的单选
		var moreFunc = function (a) {
			$(a).on('click', function () {
				var $this = $(this);
				if ($this.hasClass('hb')) {
					return;
				} else if ($this.hasClass('active')) {
					$this.removeClass('active');
					delateOrder($this.html());
				} else {
					delateOrder($(a + '.active').html());
					$(a).removeClass('active');
					$this.addClass('active');
					addOrder($this.html());
				}
				moreChioceNum();
			})
		};

		// 热门 类型 面积 开盘时间 排序 装修 环线
		var i, moreArr = new Array('.saixuanremen a', '.shaixuanleixing a', '.shaixuankaipan a', '.shaixuanpaixu a', '.shaixuanzhuangxiu a', '.shaixuanhuanxian a');
		for (i in moreArr) {
			moreFunc(moreArr[i]);
		}

		// 更多中的多选（销售状况）
		$('.shaixuanxiaoshou a, .shaixuanmianji a').on('click', function () {
			var $this = $(this);
			if ($this.hasClass('active')) {
				$this.removeClass('active');
				delateOrder($this.html());
			} else {
				$this.addClass('active');
				addOrder($this.html())
			}
			moreChioceNum();
		});

		// localstorage中取到的排序（字符串）
		var oldLimitOrder = localStorage.getItem('recordOrder') || '';
		var oldLimitOrderArr = oldLimitOrder.split(',');
		var newLimitOrder = '';

		$('#moreChoo .active').each(function () {
				var $this = $(this);
				newLimitOrder = newLimitOrder + $this.html() + ',';
			}
		);

		for (var i = 0; i < oldLimitOrderArr.length; i++) {
			// localstorage中有，此页面条件中没有，从localstorage中删掉
			if (oldLimitOrderArr[i] == '毛坯' && newLimitOrder) {
				if (newLimitOrder.indexOf(oldLimitOrderArr[i]) != -1 && newLimitOrder.indexOf('非毛坯') != -1) {
					oldLimitOrderArr.splice(i, 1);
					i -= 1;
				}
			} else if (newLimitOrder.indexOf(oldLimitOrderArr[i]) == -1) {
				oldLimitOrderArr.splice(i, 1);
				i -= 1;
			}
		}
		oldLimitOrder = oldLimitOrderArr.join(',');

		$('#moreChoo .active').each(function () {
				var $this = $(this);
				// localstorage中没有，此页面条件中有，加到localstorage后面
				if (oldLimitOrder.indexOf($this.html()) == -1) {
					oldLimitOrder = oldLimitOrder + $this.html() + ',';
				}
			}
		);
		localStorage.setItem('recordOrder', oldLimitOrder);
		oldLimitOrder = oldLimitOrder.split(',');

		// 更多的 筛选条件初始化
		for(var i = 0; i < oldLimitOrder.length; i++) {
			if (oldLimitOrder[i]) {
				$('.saixuan').append('<a>' + oldLimitOrder[i] + '<i></i></a>');
			}
		}

		// 设置宽度
		var height = 10;
		$('.saixuan a').each(function () {
			var $this = $(this);
			height = height + 28 + $this.width();
		});
		$('.saixuan').width(height);
		new IScrolllist('.select-area', {scrollX: true, scrollY: false, click: true});

		// 点击删除筛选条件
		$('.select-area i').on('click', function () {
			var $this = $(this);
			var html = $this.parent().html().split('<i></i>')[0];
			$('#moreChoo .active').each(function () {
				if ($(this).html() == html) {
					$(this).removeClass('active');
				}
			});
			checkLocation();
			$this.parent().remove();
		});

		var recordOrder = localStorage.getItem('recordOrder') || '';
		// 添加记录顺序的方法
		var addOrder = function (data) {
			recordOrder = recordOrder + data + ',';
		};
		// 删除记录顺序的方法
		var delateOrder = function (data) {
			recordOrder = recordOrder.replace(data + ',', '');
		};

		$('li[name*="allChioce"]').attr('id', 'moreChioce');
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
		// 为列表项添加ab测试参数
        $('#xfContentList').on('click', 'a[name*="xfTongji"]', function (e) {
            if (vars.abTest) {
                window.location.href = $(this).attr('href') + '?' +  vars.abTest;
            } else {
                window.location.href = $(this).attr('href');
            }
            //阻止链接跳转
            return false;
        });

		// 综合推荐中的北京楼盘随机跳转
		$('#lphz').on('click', function () {
			function getCharacter(){
				var character = String.fromCharCode(Math.floor( Math.random() * 26) + "A".charCodeAt(0));
				return character;
			}
			var randomCahracter = getCharacter();
			location.href = $(this).attr('data-href') + randomCahracter + '.htm';
		});

		/* 右下角筛选功能start*/
		// 筛选按钮的显示
		var $window = $(window),
			windowHeight = $window.height(),
			$sort = $('.sort');
		$window.on('resize', function () {
			windowHeight = $window.height();
		}).on('scroll', function () {
			if ($window.scrollTop() <= windowHeight * 2 - 60) {
				if (!$sort.is(':hidden')) {
					$sort.hide();
				}
			} else if ($sort.is(':hidden')) {
				$sort.show();
			}
		});

		// 显示底部筛选
		$sort.on('click', function () {
			unable();
			$('.sf-maskFixed').show();
			new IScrolllist('.sf-bdmenu', {scrollX: false, scrollY: true, click: true});
		});

		// 关闭底部筛选
		$('.sf-maskFixed').on('click', function (e) {
			if (e.target.className == 'sf-maskFixed') {
				$('.sf-maskFixed').hide();
				enable();
			}
		});

		// 跳转筛选方法
		$('.sf-maskFixed a').on('click', function () {
			var $this = $(this);
			if (!$this.parent().hasClass('on')) {
				var sort = $this.attr('value') || 'default';
				checkLocation(sort);
			}
		});
		/* 右下角筛选功能end*/
    });
