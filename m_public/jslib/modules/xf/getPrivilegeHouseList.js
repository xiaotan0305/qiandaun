/**
 * Created by zdl on 2015/8/25.
 */
define('modules/xf/getPrivilegeHouseList',
    ['jquery', 'util/util', 'slideFilterBox/1.0.0/slideFilterBox', 'hslider/1.0.0/hslider'],
    function (require) {
        'use strict';
        var $ = require('jquery');
        var cookiefile = require('util/util');
        var vars = seajs.data.vars;
        require.async('//clickm.fang.com/click/new/clickm.js', function () {
            Clickstat.eventAdd(window, 'load', function () {
                Clickstat.batchEvent('waptehui_', '');
            });
        });
        var doc = $(document);
        var siftID = $('#sift');
        var floatClass = $('.float');
        var districtsChioceID = $('#districtChioce');
        var subwayChioceID = $('#subwayChioce');
        var xqfChioceID = $('#xqfChioce');
        var btnBackClass = $('.btnBack');
        var allInClass = $('.allIn');
        var stationsClass = $('.stations');
        var districtsClass = $('.districts');
        var allOutID = $('#allOut');
        var scrollerlicurID = $('#scroller li.cur');
        var plhlistID = $('#plhlist');
        var dragID = $('#drag');
        var searchNoClass = $('.searchNo');
        var scrollerliID = $('#scroller li');
        var hslider = require('hslider/1.0.0/hslider');
        $('input[name = "tongjihidden"]').each(function () {
            var showurl = $(this).val();
            var getWirelessCode = $(this).attr('data-name');
            var image = new Image();
            image.src = '//client.3g.fang.com/http/sfservice.jsp?' + showurl + '&wirelesscode=' + getWirelessCode + '&imei='
                + cookiefile.getCookie('global_cookie');
            image.display = 'none';
        });
        var showflag = '1';
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
        $('.mapbtn').hide();
        require.async('slideFilterBox/1.0.0/slideFilterBox', function (IScroll) {
            var schoolcpnum = 1;
            $('#moreschool').click(function () {
                var data = $(this).attr('data-value').split(';');
                var city = data[0], district = data[1], seitem = data[2];
                var strSort = '';
                var strRoundStation = '';
                var purposeArea = '';
                var room = '';
                var price = '';
                $.post('/xf.d?m=schoollist&type=fy&city=' + city + '&district=' + district + '&p=' + schoolcpnum
                + '&seitem=' + seitem + '&strSort=' + vars.strSortTemp + '&strRoundStation='
                + vars.strRoundStationTemp + '&purposeArea=' + vars.purposeAreaTemp + '&room=' + room + '&price=' + price,
                    function (data) {
                        $('#xqfitem').append(data);
                        schoolcpnum += 1;
                        IScroll.refresh('#xqfChioce', 'stand');
                        var $number = $('#xqfitem dd');
                        if (($number.length - 1) % 20 !== 0) {
                            $('#moreschool').hide();
                        }
                    });
            });
            // 点击筛选的四大类标签
            $('[name*=ide]').on('click', function (e) {
                e.preventDefault();
                var a = $(this).attr('class') ? $(this).attr('class') : '';
                var b = $(this).attr('name').split(' ')[0];
                // 未点击过
                if (a.indexOf('active') < 0) {
                    hideActive();
                    $(this).attr('class', 'active');
                    hideChioce();
                    $('.' + b).show();
                    if (b === 'allChioce') {
                        hideAllOut();
                        allInClass.show();
                    }
                    siftID.attr('class', 'tabSX');
                    floatClass.show();
                    IScroll.refresh('#' + b);
                    if (showflag === '1' && $(this).index() == 0) {
                        if (vars.paramdistrict) {
                            districtsChioceID.show();
                            IScroll.refresh('#districtChioce');
                        }
                        if (vars.paramrailway) {
                            districtSubway('#subwayChioce', vars.paramrailway_station);
                        }
                        // 针对区域进行筛选
                        if (vars.paramdistrict) {
                            districtSubway('#districtChioce', vars.paramcomarea);
                        }
                        if (vars.paramxq) {
                            districtSubway('#xqfChioce', vars.ubxq);
                        }
                        if (vars.paramxq === 'true') {
                            xqfChioceID.show();
                            IScroll.refresh('#xqfChioce');
                        }
                        if (!vars.paramdistrict && !vars.paramrailway && !vars.paramxq) {
                            $('dd[name*=districtChioce]').addClass('active');
                            districtsChioceID.show();
                        }
                        showflag = '0';
                    }
                    unable();
                    IScroll.refresh('#districtChioce');
                    IScroll.refresh('#characterChioce');
                } else {
                    $(this).attr('class', '');
                    hideAllOut();
                    hideChioce();
                    floatClass.hide();
                    quanbuchongzhi();
                }
                if ($(this).attr('name').indexOf('characterChioce') != -1) {
                    priceChioceFunZj();
                }
            });
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
            // 点击位置下第一级（区域 地铁 学校）
            $('[name*=neIde]').on('click', function (e) {
                e.preventDefault();
                stationsClass.hide();
                districtsClass.hide();
                xqfChioceID.hide();
                var $this = $(this);
                var a = $this.attr('name').split(' ')[0];
                $this   .siblings().removeClass('active');
                $this.addClass('active');
                $('#' + a).show();
                if (a === 'districtChioce') {
                    subwayChioceID.hide();
                    xqfChioceID.hide();
                }
                if (a === 'subwayChioce') {
                    districtsChioceID.hide();
                    xqfChioceID.hide();
                }
                if (a === 'xqfChioce') {
                    districtsChioceID.hide();
                    subwayChioceID.hide();
                }
                IScroll.refresh('#' + a);
            });

            $('[name*=twIde]').on('click', function (e) {
                e.preventDefault();
                var a = $(this).attr('name').split(' ')[0];
                allInClass.hide();
                hideAllOut();
                $('#' + a).show().prev().show();
                btnBackClass.show();
                IScroll.refresh('#' + a);
            });
            // 新增地铁站点
            $('[name*="stations"]').on('click', function (e) {
                e.preventDefault();
                var a = $(this).attr('str');
                $('[name*="stations"]').attr('class', '');
                $(this).attr('class', 'active');
                stationsClass.hide();
                $('#' + a).show();
                IScroll.refresh('#' + a);
                $('.whereChioce .resetBtn').click();
            });

            //  新增商圈
            $('[name*="districts"]').on('click', function (e) {
                e.preventDefault();
                var a = $(this).attr('str');
                $('[name*="districts"]').attr('class', '');
                $(this).attr('class', 'active');
                districtsClass.hide();
                $('#' + a).show();
                IScroll.refresh('#' + a);
                $('.whereChioce .resetBtn').click();
            });
        });
        
        /*商圈、地铁支持多选*/
        var $districtsHref = $('.districts').find('dd');
        var $stationsHref = $('.stations').find('dd');
        // 区域的跳转
        $districtsHref.on('click', function () {
            //$districtsHref.removeClass();
            //$(this).addClass('active');
        	var $this = $(this);
        	var cid = $('#districtChioce').find('dd.active[name*=districts]').attr('str');
        	var cookieComarea = cookiefile.getCookie('fyComareaOrder')||cid+'|';
        	var cookieDistrictId = '';
        	if(cookieComarea){
        		cookieDistrictId = cookieComarea.split('|')[0];
        	}
        	if(cookieDistrictId&&cid!==cookieDistrictId){
        		cookiefile.setCookie('fyComareaOrder',cid+'|',365);
        		cookieComarea = cid+'|';
        	}
    		if ($this.hasClass('active')) {
    			$this.removeClass('active');
    			//hxOrder = hxOrder.replace($this.attr('value') + '.', '');
    			cookiefile.setCookie('fyComareaOrder', cookieComarea.replace($this.attr('value')+',',''), 365);
    		} else {
    			if (!$this.attr('value')) {
    				$this.parent().find('.active').removeClass('active');
    				cookiefile.setCookie('fyComareaOrder', cid+'|', 365);
    				//hxOrder = '';
    			}
    			$this.addClass('active');
    			if ($this.attr('value')) {
    		
    				cookiefile.setCookie('fyComareaOrder', cookieComarea+($this.attr('value')+','), 365);
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
    		var cookieComarea = cookiefile.getCookie('fyComareaOrder');
    		if(cookieComarea){
    			comareas = cookieComarea.split('|')[1].substring(0,cookieComarea.split('|')[1].length-1);
    		}
    		if (comareas) {
    			comareas = 'co' + comareas;
    		}
    		var selectedDis = $('#districtChioce').find('dd.active[name*=districts]').attr('str');
    		if(comareaTemp === ''){
    			cookiefile.setCookie('fyComareaOrder',selectedDis+'|',365);
    		}
    		 var href = $('.whereChioce section[id="'+selectedDis+'"]').find('dd[value="'+comareaTemp+'"] a').attr('datahref');
    			$(this).attr('href', href+'&comarea='+comareas);
    		window.location = $(this).attr('href');
    		}else if($('#subwayChioce').is(':visible')){
    			$('.whereChioce .stations .active').each(function () {
    				var $this = $(this);
    			 	if (!stations) {
    			 		stationTemp = $this.attr('value');	 
    			 		railwayTemp = $this.attr('rid');
    			 	} 
    			});
    			var cookieStation = cookiefile.getCookie('fyStationOrder');
    			if(cookieStation){
    				stations = cookieStation.split('|')[1].substring(0,cookieStation.split('|')[1].length-1);
    			}
    			if (stations) {
    				var reg = new RegExp("st","g");
    				stations = 'st' + stations.replace(reg,'');
    			}
    			var selectedRail = $('#subwayChioce').find('dd.active[name*=stations]').attr('str');
    			if(stationTemp === ''){
    				cookiefile.setCookie('fyStationOrder',railwayTemp+'|',365);
    			}
    			 var href = $('.whereChioce section[id="'+selectedRail+'"]').find('dd[value="'+stationTemp+'"] a').attr('datahref');
    				$(this).attr('href',href+'&railway_station='+stations );
    			window.location = $(this).attr('href');
    		}
    	});
    	$('.whereChioce .resetBtn').on('click', function () {
    		//setHxOrder();
    		if($('#districtChioce').is(':visible')){
    		var selectedDis = $('#districtChioce').find('dd.active[name*=districts]').attr('str');
    		cookiefile.setCookie('fyComareaOrder',selectedDis+'|',365);
    		$('.whereChioce .districts .active').each(function () {
    			var $this = $(this);
    		 	$this.removeClass('active');
    		});
    		}else if($('#subwayChioce').is(':visible')){
    			var selectedRail = $('#subwayChioce').find('dd.active[name*=stations]').attr('rid');
    			cookiefile.setCookie('fyStationOrder',selectedRail+'|',365);
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
        	var cookieStation = cookiefile.getCookie('fyStationOrder')||rid+'|';
        	var cookieRailwayId = '';
        	if(cookieStation){
        		cookieRailwayId = cookieStation.split('|')[0];
        	}
        	if(cookieRailwayId&&rid!==cookieRailwayId){
        		cookiefile.setCookie('fyStationOrder',rid+'|',365);
        		cookieStation = rid+'|';
        	}
        	
    		if ($this.hasClass('active')) {
    			$this.removeClass('active');
    			//hxOrder = hxOrder.replace($this.attr('value') + '.', '');
    			cookiefile.setCookie('fyStationOrder', cookieStation.replace($this.attr('value')+',',''), 365);
    		} else {
    			if (!$this.attr('value')) {
    				$this.parent().find('.active').removeClass('active');
    				cookiefile.setCookie('fyStationOrder', rid+'|', 365);
    				//hxOrder = '';
    			}
    			$this.addClass('active');
    			if ($this.attr('value')) {
    		
    				cookiefile.setCookie('fyStationOrder', cookieStation+($this.attr('value')+','), 365);
    			}
    			
    		}
    		
    	//	$("section[id^='stations_']").not('#'+rid).find('.active').removeClass('active');
    		if ($this.attr('value') && $this.parent().find('.active').length !== 1 /*&& $('#characterChioce .active').length !== $('#characterChioce dd').length*/) {
    			$this.parent().find('dd').eq(0).removeClass('active');
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
        
        floatClass.click(function (e) {
            if(($('#districtChioce').is(':visible') && $('#districtChioce').find('dd.active[name*=districts]').attr('str'))
            	    ||($('#subwayChioce').is(':visible')&& $('#subwayChioce').find('dd.active[name*=stations]').attr('str')) ){
            	    		 $('.confirmBtn').click();
            	    	 }
            	    	 else{
            	    		 e.preventDefault();
            	             $('[name*="ide"]').attr('class', '');
            	             hideAllOut();
            	             hideChioce();
            	             floatClass.hide();
            	             quanbuchongzhi(); 
            	    	 }
        });
        btnBackClass.click(function () {
            hideAllOut();
            allInClass.show();
        });

        allOutID.find('dd').each(function () {
            var a = $(this).parent().parent().attr('id');
            var b = $(this).attr('class') ? $(this).attr('class') : '';
            if (b.indexOf('active') !== -1) {
                $('[name*="' + a + '"]').attr('value', $(this).attr('value'));
            }
            $(this).click(function () {
                $('[name*="' + a + '"]').attr('value', $(this).attr('value')).find('span').text($(this).text());
                $(this).parent().find('dd.active').attr('class', '');
                $(this).attr('class', 'active');
                hideAllOut();
                $('.allIn').show();
            });
        });
        $('[name*="thIde"]').on('click', function () {
            var a = $(this).attr('name').split(' ')[0];
            allInClass.hide();
            hideAllOut();
            $('#ccRes').show();
            $('#' + a).show();
        });
        function hideChioce() {
            siftID.attr('class', '');
            var a = $('.lbTab').children();
            for (var i = 1; i < a.size(); i += 1) {
                a.eq(i).hide();
            }
            enable();
        }
        function hideActive() {
            var a = $('ul.flexbox').children();
            for (var i = 0; i < a.size(); i += 1) {
                a.eq(i).attr('class', '');
            }
        }
        function hideAllOut() {
            var a = allOutID.children();
            for (var i = 0; i < a.size(); i += 1) {
                a.eq(i).hide();
            }
        }
        var districtTemp = $('#districtChange').val(),
            priceTemp = $('#priceChange').val(),
            railwayTemp = $('#railwayChange').val(),
            roomTemp = $('#roomChange').val(),
            comarea = $('#comareaChange').val(),
            station = $('#stationChange').val(),
            xqTemp = $('#xqChange').val() == '' ? '' : 'xq' + $('#xqChange').val(),
            changeFlag = 0;
        if(!comarea){
        	clearCookie('comareaOrder');
        }
        if(!station){
        	clearCookie('stationOrder');
        }
        // 计算更多的数目
        var $allChioce = $('li[name *= "allChioce"]').find('span');
        var gengduoNum = function () {
            var num = $('.moreChoo .active').length;
            if (num) {
                $allChioce.html('更多(' + num + ')');
            } else {
                $allChioce.html('更多');
            }
        };

        //更多初始化(标红)
        var paixu = vars.strSortTemp || '',
            huanxian = vars.strRoundStationTemp || '',
            mianji = vars.purposeAreaTemp.substring(1, vars.purposeAreaTemp.length) || '';
        if (paixu) $('#paixu a[value*=' + paixu + ']').addClass('active');
        if (huanxian) $('#huanxian a[value*=' + huanxian + ']').addClass('active');
        if (mianji) $('#mianji a[value*="' + mianji + '"]').addClass('active');
        gengduoNum();

        // 筛选更多
        $('#paixu a, #huanxian a, #mianji a').on('click', function () {
            var $this = $(this);
            if ($this.hasClass('active')) {
                $this.removeClass('active');
            } else {
                $this.parents('.chose-item').find('a').removeClass('active');
                $this.addClass('active');
            }
            gengduoNum();
        });
        // 点击全部重置按钮
        $('.chongzhi').on('click', function () {
            quanbuchongzhi();
        });
        // 全部重置的方法
        var quanbuchongzhi = function () {
            $('.moreChoo a').removeClass('active');
            gengduoNum();
        };

        // 对更多条件的选择结果执行筛选
        $('#moreChooseBtn').click(function () {
            if (changeFlag !== 0) {
                districtTemp = '';
                priceTemp = '';
                railwayTemp = '';
                roomTemp = '';
                station = '';
                comarea = '';
                xqTemp = '';
            }
            var brand = scrollerlicurID.attr('value');
            // 排序 环线 面积
            var strSortTemp = $('#paixu .active').attr('value'),
                strRoundStationTemp = $('#huanxian .active').attr('value'),
                purposeAreaTemp = 'a' + $('#mianji .active').attr('value');
            if (typeof(strRoundStationTemp) == 'undefined') strRoundStationTemp = '';
            if (typeof(strSortTemp) == 'undefined') strSortTemp = 'o0';
            if (!$('#mianji .active').length) purposeAreaTemp = '';
            var f = (railwayTemp == '' ? 0 : 1) + (strSortTemp == '' ? 0 : 1) + (strRoundStationTemp == '' ? 0 : 1) + (purposeAreaTemp == '' ? 0 : 1)
                + (roomTemp == '' ? 0 : 1) + (priceTemp == '' ? 0 : 1) + (xqTemp == '' ? 0 : 1);
            var flag = '';
            if (f !== 0) {
                flag = '/';
            }
            var station = vars.station || '',
                paramcomarea = vars.comarea || '';
            var b = '/xf_tehui/' + vars.paramcity + districtTemp + '/' + railwayTemp + strSortTemp + strRoundStationTemp + purposeAreaTemp + roomTemp
                + priceTemp + station + paramcomarea + xqTemp + flag;
            window.location.href = b;
        });
        //  清除前面的条件选择
        $('#cz').click(function () {
            $('#wapxfsy_D02_01').find('span').html('位置');
            $('#wapxfsy_D02_02').find('span').html('户型');
            $('#wapxfsy_D02_03').find('span').html('价格');
            changeFlag = 1;
            var a = $('span.rt');
            for (var i = 0; i < a.size(); i += 1) {
                a.eq(i).text('不限');
            }
            var b = $('dl.all').children();
            for (var j = 0; j < b.size(); j += 1) {
                b.eq(j).attr('value', '');
            }
        });
        //  给页面上的每条内容绑定click事件进行新房统计
        plhlistID.on('click', 'li', function () {
            var data = $(this).children('a').attr('data');
            var arr = data.split(',');
            var housefrom = arr[0] === '1' ? 'ad' : '';
            var city = arr[1];
            var newcode = arr[2];
            $.ajax({
                url: '/data.d?m=houseinfotj&type=click&houseid=&housefrom=' + housefrom + '&city=' + city + '&housetype=xf&newcode='
                + newcode + '&channel=wapfangyuanlist', async: false
            });
        });
        var total = $('#totalpage').html();
        var k = true;
        var w = $(window);
        var curp = 2;
        $('body').scrollTop(1);
        if (total <= 1) {
            dragID.hide();
            k = false;
        }
        if ($('#plhlist>li').length === 0) {
            searchNoClass.show();
        } else {
            searchNoClass.hide();
        }
        // 滑动到页面底部时自动加载数据
        var scrollFlag = false;
        w.on('scroll', function scrollHandler() {
            var scrollh = doc.height();
            var bua = navigator.userAgent.toLowerCase();
            if (scrollFlag) {
                if (bua.indexOf('iphone') !== -1 || bua.indexOf('ios') !== -1) {
                    scrollh -= 140;
                } else {
                    scrollh -= 80;
                }
            }
            if (k !== false && doc.scrollTop() + w.height() >= scrollh) {
                load();
            }
        });
        // 点击加载更多时加载数据
        function dragclick() {
            dragID.one('click', function () {
                load();
            });
        }
        dragclick();
        function load() {
			var total = total;
			k = false;
			// 显示加载中
			$('.morehouse').hide();
			$('.loading').show();
			var city = vars.paramcity;
			var district = encodeURIComponent(vars.paramdistrict);
			var railway = encodeURIComponent(vars.paramrailway);
			var room = vars.paramroom;
			var strSort = vars.paramstrSort;
			var price = vars.paramprice;
			var strRoundStation = vars.paramstrRoundStation;
			var purposeArea = vars.parampurposeArea;
			var keyword = vars.paramkeyword;
			var xq = vars.paramxq;
			var comarea = encodeURIComponent(vars.paramcomarea);
			var railway_station = encodeURIComponent(vars.paramrailway_station);
			$.post('/xf.d?m=getPrivilegeHouseList&city=' + city + '&district=' + district + '&railway=' + railway + '&price=' + price + '&room='
				+ room + '&strSort=' + strSort + '&strRoundStation=' + strRoundStation + '&purposeArea=' + purposeArea + '&p='
				+ curp + '&keyword=' + keyword + '&xq=' + xq + '&comarea=' + comarea + '&railway_station=' + railway_station,
				function (data) {
					$('#plhlist').append(data);
					// 显示加载更多按钮
					$('.loading').hide();
					$('.morehouse').show();
					curp += 1;
					k = true;
					var $number = $('#plhlist li');
					if ($number.length === total) {
						dragID.hide();
						k = false;
					} else {
						dragID.show();
						k = true;
					}
					dragclick();
				}
			);
        }
		$('.morehouse').on('click', function () {
			load();
		});
        // 导航栏ajax动态加载数据模块
        var a = true;
        $('#scroller a').on('click', function () {
            if (a) {
                a = false;
                $('.searchNo').hide();
                var that1 = $(this);
                var brand = that1.attr('type');
                var total = parseInt(that1.children('span').text());
                if (total <= 10) {
                    $('.morehouse').hide();
                } else {
                    $('.morehouse').show();
                }
                curp = 2;
                var city = vars.paramcity;
                var district = vars.paramdistrict;
                var railway = vars.paramrailway;
                var room = vars.paramroom;
                var strSort = vars.paramstrSort;
                var price = vars.paramprice;
                var strRoundStation = vars.paramstrRoundStation;
                var purposeArea = vars.parampurposeArea;
                var keyword = vars.paramkeyword;
                var comarea = vars.paramcomarea;
                scrollerliID.each(function () {
                    if ($(this).attr('value') === brand) {
                        $(this).attr('class', 'cur');
                        $(this).css({background: '#df3031'});
                    } else {
                        $(this).attr('class', '');
                        $(this).css({background: ''});
                    }
                });
                $('.houseList ul').hide();
                $('.list-loading').show();
                dragID.hide();
                $.post('/xf.d?m=getPrivilegeHouseList&city=' + city + '&district=' + district + '&railway=' + railway + '&price='
                    + price + '&room=' + room + '&strSort=' + strSort + '&strRoundStation=' + strRoundStation + '&purposeArea='
                    + purposeArea + '&keyword=' + keyword + '&flag=new&comarea=' + comarea, function (data) {
                    plhlistID.html(data);
                    if (!data.trim()) {
                        dragID.hide();
                        searchNoClass.show();
                        k = false;
                        $('.list-loading, .morehouse').hide();
                    } else {
                        dragID.show();
                        searchNoClass.hide();
                        k = true;
                        $('.list-loading').hide();
                        $('.houseList ul').show();
                    }
                    a = true;
                });
            }
        });
        //  筛选结束执行跳转
        function tiaozhuan(district, railway, orderby, round, area, room, price, station, comarea, school) {
            var brand = scrollerlicurID.attr('value');
            window.location.href = '/xf.d?m=getPrivilegeHouseList&city=' + vars.paramcity + '&district=' + district + '&railway='
                + railway + '&strSort=' + orderby + '&strRoundStation=' + round + '&purposeArea=' + area + '&room=' + room + '&price='
                + price + '&railway_station=' + station + '&comarea=' + comarea + '&xq=' + school;
        }
        $('dl').on('click', 'a[data-name="tiaozhuan"]', function () {
            tiaozhuan.apply(this, $(this).attr('data-value').split(';'));
        });

        var l = 0;
        var leng = 0;
        scrollerliID.each(function (index) {
            leng += $(this).outerWidth() + 6;
            if ($(this).hasClass('cur')) {
                l = index;
            }
        });
        if (leng < 320) {
            leng = 320;
        }
        var nowL = 0;
        for (var i = 0; i < l; i += 1) {
            nowL += scrollerliID.eq(i).outerWidth() + 6;
        }
        if (nowL > leng - w.width()) {
            nowL = leng - w.width();
        }
        $('#scroller').width(leng);
        require.async('jsub/_vb.js?c=mnhsalelist');
        require.async('jsub/_ubm.js?_2017102307fdsfsdfdsd', function () {
            yhxw();
        });
        function yhxw() {
            _ub.city = vars.ubcity;
            // 业务---WAP端
            _ub.biz = 'n';
            // 方位（南北方) ，北方为0，南方为1
            _ub.location = vars.ublocation;
            // 用户动作（浏览0、搜索1、打电话31、即时通讯24、预约25）
            var b = 1;
            var schoolDistrict = encodeURIComponent(vars.ubxq);
            var huxing = {
                1: '一居' ,
                2: '二居',
                3: '三居',
                4: '四居' ,
                5: '五居',
                '5,': '五居以上'
            };
            var areaPram = {
                '0,50': encodeURIComponent('50平以下'),
                '50,70': encodeURIComponent('50-70平'),
                '70,90': encodeURIComponent('70-90平'),
                '90,110': encodeURIComponent('90-110平'),
                '110,130': encodeURIComponent('110-130平'),
                '130,150': encodeURIComponent('130-150平'),
                '150,200': encodeURIComponent('150-200平'),
                '200,300': encodeURIComponent('200-300平'),
                '300,': encodeURIComponent('300平以上')
            };
            // 解决选择更多中的规则后价格值就会加[]的问题
            var testNum = /^\[(\d+,\d*)\]/;
            var $paramprice = (vars.paramprice.indexOf('[') > -1) ? vars.paramprice.match(testNum)[1] : vars.paramprice;
            var priceKey = $paramprice ? $paramprice.split(',') : '';
            var price = '';
            if (priceKey) {
                priceKey[1] = priceKey[1] ? priceKey[1] : '99999';
                price = encodeURIComponent(priceKey.join('-'));
            }
            var houseType = encodeURIComponent(huxing[vars.paramroom] ? huxing[vars.paramroom] : '');
            var area = vars.parampurposeArea ? encodeURIComponent(vars.parampurposeArea.replace(',','-')) + '^' + encodeURIComponent('平方米') : '';
            var pTemp = {
                // 搜索关键词
                'vmn.key': encodeURIComponent(vars.paramkeyword),
                'vmg.page': 'mnhsalelist',
                // 区域
                'vmn.position': vars.paramdistrict ? encodeURIComponent(vars.paramdistrict) + '^' + encodeURIComponent(vars.paramcomarea) : '',
                // 地铁
                'vmn.subway': vars.paramrailway ? encodeURIComponent(vars.paramrailway) + '^' + encodeURIComponent(vars.paramrailway_station) : '',
                // 学区
                'vmn.belongschool': schoolDistrict,
                // 价格(总价)
                'vmn.totalprice': price,
                // 户型处理
                'vmn.housetype': houseType,
                // 环线
                'vmn.loopline': encodeURIComponent(vars.paramstrRoundStation),
                // 面积
                'vmn.area': areaPram[vars.parampurposeArea] || '',
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
            _ub.collect(b, p);
        }

        // 价格滑动插件 time:2015.10.26 ------------------------------------------start
        // 总价插件
        var priceHsliderZj;
        var priceFirstflagZj = true;
        function priceChioceFunZj() {
            var $priceHslider = $('#priceHsliderzj'),
                $pricemin = $('#priceminzj'),
                $pricemax = $('#pricemaxzj');
            // 获取最大值和最小值一定要在插件的创建对象之前去获取，因为插件初始化时会把值设为不限
            var min = $pricemin.find('i').html() == '0'? '不限' : $pricemin.find('i').html();
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
        }

        // 点击确定
        $('#characterChioce .chooseBtn').on('click', function () {
            if ($(this).hasClass('dj')) {
                goPrice('dj');
            } else {
                goPrice('zj');
            }
        });

        // 点击价格滑动条确定后执行的方法
        function goPrice(type) {
            var tags = $('#inputtags').val();
            var query = $('#inputquery').val();
            var price = '';
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
            if (pricemin === '不限' && pricemax === '不限') {
                price = '';
            } else {
                pricemin = pricemin === '不限' ? 0 : pricemin;
                pricemax = pricemax === '不限' ? '' : pricemax;
                price = pricemin + ',' + pricemax
            }
            // 单价 跳转到本页
            if (type == 'dj') {

            } else {
                // 总价 跳转到户型页
                var $this = $('.characterChioce a').eq(0);
                var tiaozhuanArray = $this.attr('data-value').split(';');
                tiaozhuanArray.splice(6, 1, price);
                tiaozhuan.apply($this[0], tiaozhuanArray);
            }
        }
    });
