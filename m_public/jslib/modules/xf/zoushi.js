/**
 * 房价走势页面
 * 2016/04/13 by wangfengchao@fang.com
 */
define('modules/xf/zoushi', ['jquery', 'chart/line/1.0.7/line', 'modules/xf/shadowCall', 'swipe/3.10/swiper'],
    function (require) {
        'use strict';
        var $ = require('jquery');
        var vars = seajs.data.vars;
		var Swiper = require('swipe/3.10/swiper');
        var i;

        var $zstName = $('.zstName').find('span');
        var $lineS = $('#lineS');
        var $trendOut = $('.trend-out') ;
        var $tHouseList = $('.t-house-list') ;

        /**
         * @description 楼盘价格走势图效果
         */
        var newCode = vars.houseid;
        var district = vars.districtMatch;
        var city = vars.cityMatch;
        // 获取房价数据
        $.get('/xf.d?m=getLouPanZouShiData&city=' + city + '&newCode=' + newCode + '&district=' + district,
            function (data) {
			if (data.root && data.root.month && data.root.newCodePrice && data.root.districtPrice && data.root.cityPrice) {
                    var month = data.root.month.split(',');
                    var trendDatas = [], getDatas = [];
                    // newCodePrice  districtPrice  cityPrice
                    // 楼盘数据小于12时
                    var loupanArray = data.root.newCodePrice.split(',');
                    var tmparr = loupanArray.reverse();
                    var newarr = new Array(month.length);
                    for (i = 0; i < month.length; i++) {
                        newarr[i] = tmparr[i] || '';
                    }
                    newarr = newarr.reverse();
                    getDatas.push(newarr);
                    getDatas.push(data.root.districtPrice.split(',').splice(0, month.length));
                    getDatas.push(data.root.cityPrice.split(',').splice(0, month.length));
                    var color = ['#ff6666', '#ff9900', '#a6b5ee'];
                    for (i = 0; i < getDatas.length; i++) {
                        var getData = {};
                        // 不为空数组
                        if (getDatas[i].length > 1) {
                            getData.yAxis = getDatas[i];
                            getData.color = color[i];
                            trendDatas.push(getData);
                        } else {
                            // 如果没有数据，则把走势图的名称隐藏掉
                            $zstName.eq(i).hide();
                        }
                    }
                    // 显示走势的DIV
                    $lineS.show();
                    var LineChart = require('chart/line/1.0.7/line');
                    // 画走势图
                    var l = new LineChart({
                        id: '#chartCon',
                        height: 200,
                        width: $(window).width(),
                        xAxis: month,
                        data: trendDatas,
                        alertDom: $trendOut
                    });
                    // 使走势图滚动到最后一个月位置
                    l.run();
                    // 走势图小弹框定位
                    $('.main').on('touchend', '#chartCon', function (e) {
                        var x = e.originalEvent.changedTouches[0].clientX;
                        // 小弹框宽度为130
                        if (x < document.body.clientWidth - 130) {
                            // 小弹框偏移量8
                            $trendOut.css('left', x + 8 + 'px');
                        } else {
                            $trendOut.css('left', x - 130 - 8 + 'px');
                        }
                    });
                }
            }
        );

        // 遍历周边楼盘价格放入数组中
        var zhoubianPrice = new Array();
        var a = 0;
        $('.t-house-list i').each(function () {
            var $this = $(this);
            $this.parents('ul')[0].index = a;
            a++;
            zhoubianPrice.push(parseInt($this.html()));
        });

        // 寻找价格最高的楼盘
        var max = Math.max.apply(this,zhoubianPrice);
        var min = Math.min.apply(this,zhoubianPrice);

        // 绘制柱形图
        var minToMax = max - min;
        $tHouseList.each(function () {
            var $this = $(this);
            var percent = ((zhoubianPrice[$this[0].index] - min) / minToMax * 0.5 + 0.5) * 100 + '%';
            $this.find('span').eq(0).css('width', percent);
        });

		// 打电话替换
		var shadowCall = require('modules/xf/shadowCall');
		shadowCall();

		// 在线咨询
		$('.zxzx, .gwly').on('click', function () {
			var yhxw = $(this).attr('data-yhxw');
			var charts = $(this).attr('data-chatxf').split(';');
			chatxf(charts[0], charts[1], charts[2], charts[3], charts[4], charts[5], charts[6], charts[7],
				charts[8], charts[9], charts[10], charts[11], charts[12], charts[13], charts[14]);
		});

		function chatxf(zhcity, city, housetype, houseid, newcode, type, phone, channel, uname, aname, agentid, zhname, agentImg, username, zygwLink) {
			try {
				window.localStorage.foobar = 'foobar';
				var projname = $('#projname').html();
				var com = '';
				if (vars.xfinfocomarea) {
					com = '[' + vars.xfinfocomarea + ']';
				}
				localStorage.setItem(username + '_allInfo',
					encodeURIComponent(projname) + ';' + encodeURIComponent($('#price').text().trim()) + ';' + encodeURIComponent(vars.splitehousefeature) + ';' + vars.xfinfooutdoorpic + ';' + encodeURIComponent($('#district').html()) + ';' + encodeURIComponent(com + vars.xfinfoaddress) + ';' + '/xf/' + city + '/' + houseid + '.htm');
				localStorage.setItem('fromflag', 'xfinfo');
				localStorage.setItem('x:' + username + '',
					encodeURIComponent(zhname) + ';' + agentImg + ';' + encodeURIComponent(projname + '的') + ';' + zygwLink);
				$.ajax({
					url: '/data.d?m=houseinfotj&city=' + city + '&housetype=' + housetype + '&houseid=' + houseid + '&newcode=' + newcode + '&type=' + type + '&phone=' + phone + '&channel=' + channel + '&agentid=' + agentid,
					async: false
				});
				setTimeout(function () {
					window.location = '/chat.d?m=chat&username=x:' + uname + '&city=' + city + '&type=wapxf&houseid=' + newcode;
				}, 500);
			} catch (_) {
				alert('若为safari浏览器,请关闭无痕模式浏览。');
			}
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
		addSwiper($('#zxlp'));
		// 最下面的导航-------------------------------------------------end
		
		
		// 统计行为 --------------start
        require.async('jsub/_vb.js?c=xf_lp^jgzs_wap');
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
                'vmg.page': 'xf_lp^jgzs_wap',
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
		
		
    }
);