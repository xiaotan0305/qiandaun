define('modules/xf/searchHuXingList',['jquery','util/util','iscroll/2.0.0/iscroll-lite','slideFilterBox/1.0.0/slideFilterBox','modules/xf/loadMore'],
    function (require) {
        'use strict';
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var loadMore = require('modules/xf/loadMore');
        require('iscroll/2.0.0/iscroll-lite');
        var Util = require('util/util');
        var IScroll = require('slideFilterBox/1.0.0/slideFilterBox');
        var showflag = '1';
        $('.mapbtn').hide();

        function hideChioce() {
            $('#sift').attr('class', '');
            var a = $('.lbTab').children();
            for (var i = 1; i < a.size(); i += 1) {
                a.eq(i).hide();
            }
        }
        function hideActive() {
            var a = $('ul.flexbox').children();
            for (var i = 0; i < a.size(); i += 1) {
                a.eq(i).attr('class', '');
            }
        }
        function hideAllOut() {
            var a = $('#allOut').children();
            for (var i = 0; i < a.size(); i += 1) {
                a.eq(i).hide();
            }
        }
        function unable() {
            document.addEventListener('touchmove',preventDefault);
        }
        function preventDefault(e) {
            e.preventDefault();
        }
        function enable() {
            document.removeEventListener('touchmove',preventDefault);
        }
        var $ide = $('[name*="ide"]');
        $ide.click(function () {
            var a = $(this).attr('class') ? $(this).attr('class') : '';
            var b = $(this).attr('name').split(' ')[0];
            if (a.indexOf('active') < 0) {
                hideActive();
                $(this).attr('class', 'active');
                hideChioce();
                $('.' + b).show();
                if (b === 'allChioce') {
                    hideAllOut();
                    $('.allIn').show();
                }
                $('#sift').attr('class', 'tabSX');
                $('.float').show();
				unable();
                IScroll.refresh('#' + b);
                if (showflag === '1') {
                	  if (vars.paramrailway) {
                          districtSubway('#subwayChioce', vars.paramrailwaystation);
                      }
                      // 针对区域进行筛选
                      if (vars.paramdistrict) {
                          districtSubway('#districtChioce', vars.paramcomarea);
                      }
                  
                    showflag = '0';
                }
            } else {
                $(this).attr('class', '');
                hideAllOut();
                hideChioce();
                window.location.href = '#sift';
                $('.float').hide();
                enable();
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
        $('.float').click(function () {
            if(($('#districtChioce').is(':visible') && $('#districtChioce').find('dd.active[name*=districts]').attr('str'))
            	    ||($('#subwayChioce').is(':visible')&& $('#subwayChioce').find('dd.active[name*=stations]').attr('str')) ){
            	    		 $('.confirmBtn').click();
            	    	 }
            	    	 else{
            	    		 $ide.attr('class', '');
            	             hideAllOut();
            	             hideChioce();
            	             $('.float').hide();
            	             enable();
            	    	 }
        });
        $('.btnBack').click(function () {
            hideAllOut();
            $('.allIn').show();
        });
        
        var $neide = $('[name*="neIde"]');
        $neide.click(function () {
            $('.stations').hide();
            $('.districts').hide();
            var a = $(this).attr('name').split(' ')[0];
            $('#' + a).show();
            a === 'districtChioce' ? $('#subwayChioce').hide() : $('#districtChioce').hide();
			unable();
            IScroll.refresh('#' + a);
            $('#whereChioce .active').removeClass('active');
            $(this).parent().addClass('active');
        });
       
        var $twIde = $('[name*="twIde"]');
        $twIde.click(function () {
            var a = $(this).attr('name').split(' ')[0];
            $('.allIn').hide();
            hideAllOut();
            $('#' + a).show().prev().show();
            $('.btnBack').show();
			unable();
			$('#' + a).height($('.allChioce').height() - 72);
            IScroll.refresh('#' + a);
        });
    
        /* 新增地铁站点 */
        var $stations = $('[name*="stations"]');
        $stations.click(function () {
            var a = $(this).attr('str');
            $stations.attr('class','');
            $(this).attr('class','active');
            $('.stations').hide();
            $('#' + a).show();
			unable();
            IScroll.refresh('#' + a);
            $('.whereChioce .resetBtn').click();
        });
        
        /* 新增商圈*/
        var $districts = $('[name*="districts"]');
        $districts.click(function () {
            var a = $(this).attr('str');
            $districts.attr('class','');
            $(this).attr('class','active');
            $('.districts').hide();
            $('#' + a).show();
			unable();
            IScroll.refresh('#' + a);
            $('.whereChioce .resetBtn').click();
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
        	var cookieComarea = Util.getCookie('hxComareaOrder')||cid+'|';
        	var cookieDistrictId = '';
        	if(cookieComarea){
        		cookieDistrictId = cookieComarea.split('|')[0];
        	}
        	if(cookieDistrictId&&cid!==cookieDistrictId){
        		Util.setCookie('hxComareaOrder',cid+'|',365);
        		cookieComarea = cid+'|';
        	}
    		if ($this.hasClass('active')) {
    			$this.removeClass('active');
    			//hxOrder = hxOrder.replace($this.attr('value') + '.', '');
    			Util.setCookie('hxComareaOrder', cookieComarea.replace($this.attr('value')+',',''), 365);
    		} else {
    			if (!$this.attr('value')) {
    				$this.parent().find('.active').removeClass('active');
    				Util.setCookie('hxComareaOrder', cid+'|', 365);
    				//hxOrder = '';
    			}
    			$this.addClass('active');
    			if ($this.attr('value')) {
    		
    				Util.setCookie('hxComareaOrder', cookieComarea+($this.attr('value')+','), 365);
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
    		var cookieComarea = Util.getCookie('hxComareaOrder');
    		if(cookieComarea){
    			comareas = cookieComarea.split('|')[1].substring(0,cookieComarea.split('|')[1].length-1);
    		}
    		if (comareas) {
    			comareas = 'co' + comareas;
    		}
    		var selectedDis = $('#districtChioce').find('dd.active[name*=districts]').attr('str');
    		if(comareaTemp === ''){
    			Util.setCookie('hxComareaOrder',selectedDis+'|',365);
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
    			var cookieStation = Util.getCookie('hxStationOrder');
    			if(cookieStation){
    				stations = cookieStation.split('|')[1].substring(0,cookieStation.split('|')[1].length-1);
    			}
    			if (stations) {
    				var reg = new RegExp("st","g");
    				stations = 'st' + stations.replace(reg,'');
    			}
    			var selectedRail = $('#subwayChioce').find('dd.active[name*=stations]').attr('str');
    			if(stationTemp === ''){
    				Util.setCookie('hxStationOrder',railwayTemp+'|',365);
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
    		Util.setCookie('hxComareaOrder',selectedDis+'|',365);
    		$('.whereChioce .districts .active').each(function () {
    			var $this = $(this);
    		 	$this.removeClass('active');
    		});
    		}else if($('#subwayChioce').is(':visible')){
    			var selectedRail = $('#subwayChioce').find('dd.active[name*=stations]').attr('rid');
    			Util.setCookie('hxStationOrder',selectedRail+'|',365);
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
        	var cookieStation = Util.getCookie('hxStationOrder')||rid+'|';
        	var cookieRailwayId = '';
        	if(cookieStation){
        		cookieRailwayId = cookieStation.split('|')[0];
        	}
        	if(cookieRailwayId&&rid!==cookieRailwayId){
        		Util.setCookie('hxStationOrder',rid+'|',365);
        		cookieStation = rid+'|';
        	}
        	
    		if ($this.hasClass('active')) {
    			$this.removeClass('active');
    			//hxOrder = hxOrder.replace($this.attr('value') + '.', '');
    			Util.setCookie('hxStationOrder', cookieStation.replace($this.attr('value')+',',''), 365);
    		} else {
    			if (!$this.attr('value')) {
    				$this.parent().find('.active').removeClass('active');
    				Util.setCookie('hxStationOrder', rid+'|', 365);
    				//hxOrder = '';
    			}
    			$this.addClass('active');
    			if ($this.attr('value')) {
    		
    				Util.setCookie('hxStationOrder', cookieStation+($this.attr('value')+','), 365);
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
        var $allOutdd = $('#allOut').find('dd');
        $allOutdd.each(function () {
            var a = $(this).parent().parent().attr('id');
            var b = $(this).attr('class') === null ? '' : $(this).attr('class');
            if (b.indexOf('active') !== -1) {
                $('[name*="' + a + '"]').attr('value', $(this).attr('value'));
            }
            $(this).on('click',function () {
                $('[name*="' + a + '"]').attr('value', $(this).attr('value')).find('span').text($(this).text());
                $(this).parent().find('dd.active').attr('class', '');
                $(this).attr('class', 'active');
                hideAllOut();
                $('.allIn').show();
            });
        });
        
        var $thIde = $('[name*="thIde"]');
        $thIde.click(function () {
            var a = $(this).attr('name').split(' ')[0];
            $('.allIn').hide();
            hideAllOut();
            $('#ccRes').show();
            $('#' + a).show();
        });
        var districtTemp = $('#districtChange').val(),
            priceTemp = $('#priceChange').val(),
            railwayTemp = $('#railwayChange').val(),
            roomTemp = $('#roomChange').val(),
            keyword = vars.paramkeyword,
            comarea = $('#comareaChange').val(),
            station = $('#stationChange').val(),
            changeFlag = 0;
        if(!comarea){
        	clearCookie('comareaOrder');
        }
        if(!station){
        	clearCookie('stationOrder');
        }
        function checkLocation() {
            if (changeFlag !== 0) {
                districtTemp = '';
                priceTemp = '';
                railwayTemp = '';
                roomTemp = '';
                keyword = '';
                station = '';
                comarea = '';
            }
            var strSortTemp = $('[name*="sortTw"]').attr('value'),
                strRoundStationTemp = $('[name*="roundTw"]').attr('value'),purposeAreaTemp = $('[name*="areaTw"]').attr('value');
            if (typeof(strRoundStationTemp) == 'undefined') strRoundStationTemp = '';
            if (typeof(strSortTemp) == 'undefined') strSortTemp = 'wapsort';
            tiaozhuan(districtTemp,railwayTemp,roomTemp,priceTemp,strSortTemp,strRoundStationTemp,purposeAreaTemp,keyword,comarea,station);
        }
        function cleanAllChioce() {
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
        }
    
        $('#plhlist').on('click','li',function () {
            var data = $(this).children('a').attr('data');
            var arr = data.split(',');
            var housefrom = arr[0] === '1' ? 'ad' : '';
            var city = arr[1];
            var newcode = arr[2];
            var hxid = arr[3];
            $.ajax({url: '/data.d?m=houseinfotj&type=click&housefrom=' + housefrom + '&city=' + city
            + '&housetype=xf&newcode=' + newcode + '&channel=waphuxinglist&hxid=' + hxid,async: false});
        });

        function tiaozhuan(district,railway,room,price,order,round,area,keyword,comarea,station) {
            window.location.href = '/xf.d?m=searchHuXingList&city=' + vars.paramcity + '&district=' + district + '&railway=' + railway + '&room=' + room
                + '&price=' + price + '&strSort=' + order + '&strRoundStation=' + round + '&area=' + area + '&keyword=' + keyword
                + '&comarea=' + comarea + '&railway_station=' + station;
        }
        $('#shaixuan').click(function () {
            checkLocation();
        });
        $('#chongzhi').click(function () {
            cleanAllChioce();
        });

        // 显示下拉的总屏数
        var totalInfo = Number($('#totalpage').html());
        // ajax参数配置
        var dataConfig = {
            m: 'searchHuXingList',
            city: vars.paramcity,
            district: vars.paramdistrict,
            comarea: vars.paramcomarea,
            railway: vars.paramrailway,
            railway_station: vars.paramrailwaystation,
            room: vars.paramroom,
            price: vars.paramprice,
            strSort: vars.paramstrSort,
            strRoundStation: vars.paramstrRoundStation,
            area: vars.paramarea,
            keyword: vars.paramkeyword,
            p: 2
        };
        // loadMore参数配置
        var options = {
            moreBtnID: '#drag',
            loadPromptID: '#loading',
            contentID: '#plhlist',
            ajaxUrl: '/xf.d',
            ajaxData: dataConfig,
            total: totalInfo,
            ajaxFn: {}
        };
        // 调用加载更多模块实现加载更多
        loadMore(options);
    
        // 统计行为 ------------------------------------------------------start
        require.async('jsub/_vb.js?c=mnhlisttype');
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

            var sortKey = {
                totalprice: '总价由高到低',
                totalpriceasc: '总价由低到高',
                buildarea: '面积由大到小',
                buildareaasc: '面积由小到大',
                wapsort: ''
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
            var sort = encodeURIComponent(vars.paramstrSort ? sortKey[vars.paramstrSort] : '');
            sort = (sort == 'undefined') ? '': sort;
            var testNum = /^\[(\d+),(\d*)\]/;
            var priceKey = '';
            var price = '';
            if (vars.paramprice) {
                priceKey = vars.paramprice.match(testNum);
                priceKey[2] = priceKey[2] ? priceKey[2] : '99999';
                price = encodeURIComponent(priceKey[1] + '-' + priceKey[2]);
            }
            var huxing = encodeURIComponent(vars.paramroom || '');
            var pTemp = {
                // 关注的业务
                'vmg.page': 'mnhlisttype',
                // 关键字
                'vmn.key': encodeURIComponent(vars.paramkeyword),
                // 区域
                'vmn.position': vars.paramdistrict ? encodeURIComponent(vars.paramdistrict) + '^' + encodeURIComponent(vars.paramcomarea) : '' ,
                // 地铁
                'vmn.subway': vars.paramrailway ? encodeURIComponent(vars.paramrailway) + '^' + encodeURIComponent(vars.paramrailwaystation) : '',
                // 户型
                'vmn.housetype': huxing,
                // 价格(总价)
                'vmn.totalprice': price,
                // 排序
                mnz: sort,
                // 环线
                'vmn.loopline': encodeURIComponent(vars.paramstrRoundStation),
                // 面积
                'vmn.area': areaPram[vars.paramarea] || '',
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
    });