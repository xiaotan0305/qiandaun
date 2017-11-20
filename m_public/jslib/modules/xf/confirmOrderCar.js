/**
 * 专车看房信息填写页面
 */
define('modules/xf/confirmOrderCar', ['jquery', 'util/util', 'iscroll/2.0.0/iscroll-lite',
	'iosSelect/1.0.0/iosSelect'], function (require) {
    'use strict';
    var $ = require('jquery');
	var vars = seajs.data.vars;
	var IScrolllist = require('iscroll/2.0.0/iscroll-lite');
	var IosSelect = require('iosSelect/1.0.0/iosSelect');
    var Util = require('util/util');
    var sfut = Util.getCookie('sfut');
	var name;

	$('.kftime, .kfcount, .kfcity, .scdd').val('');

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

	// 登录后获取用户名，手机号和用户ID
	var userphone;

	function getInfo(data) {
		userphone = data.mobilephone || '';
		if (userphone != vars.paramtel) {
			location.href = '/xf.d?m=getOrderCar&city=' + vars.paramcity + '&newcode=' + vars.paramnewcode + '&cheid=' + vars.paramcheid;
		}
	}

	// 调用ajax获取登陆用户信息
	if (sfut) {
		vars.getSfutInfo(getInfo);
	} else {
		location.href = '/xf.d?m=getOrderCar&city=' + vars.paramcity + '&newcode=' + vars.paramnewcode + '&cheid=' + vars.paramcheid;
	}


	// 检测姓名：必填项
	var checkName = function () {
		name = $('.wname').val();
		if (name) {
			return true;
		} else {
			alert('请输入姓名');
			return false;
		}
	};
	// 限制姓名最多输入20位
	$('.wname').on('input change', function () {
		var $this = $(this);
		name = $this.val().replace(' ', '');
		if (name.length > 20) {
			// 取前20位
			name = name.substr(0, 20)
		}
		$this.val(name);
	});

	var checkPhone = function (phone) {
		if (/^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/.test(phone)) {
			return true;
		} else {
			return false;
		}
	};
	// 手机号输入是判断发送验证码按钮状态
	$('.wtel').on('input change', function () {
		if (checkPhone($('.wtel').val().substr(0, 11))) {
			$('.wgetcode').removeClass('disabled');
		} else {
			$('.wgetcode').addClass('disabled');
		}
	});

	// 勾选
	$('.yd').on('click', function () {
		var $this = $(this);
		if ($this.hasClass('on')) {
			$this.removeClass('on');
			$('.form-xy span').html('您未勾选同意');
		} else {
			$this.addClass('on');
			$('.form-xy span').html('已阅读并同意');
		}
	});

	// 规则
	$('.gz').on('click', function () {
		unable();
		$('.kanfangxuzhi, .mask_50').show();
		new IScrolllist('.ti_30', {scrollX: false, scrollY: true});
	});

	// 关闭规则，成功提示
	$('.close_btn, .form-btn').on('click', function () {
		$('.kanfangxuzhi, .baomingchenggong, .mask_50').hide();
		enable();
	});

	/*
	看房时间数据 start
	*/

	//计算天数差的函数，通用
	function  DateDiff(sDate1,  sDate2){    //sDate1和sDate2是2006-12-18格式
		var  aDate,  oDate1,  oDate2,  iDays;
		aDate  =  sDate1.split("-");
		oDate1  =  new  Date(aDate[1]  +  '-'  +  aDate[2]  +  '-'  +  aDate[0]);    //转换为12-18-2006格式
		aDate  =  sDate2.split("-");
		oDate2  =  new  Date(aDate[1]  +  '-'  +  aDate[2]  +  '-'  +  aDate[0]);
		iDays  =  parseInt(Math.abs(oDate1  -  oDate2)  /  1000  /  60  /  60  /24);   //把相差的毫秒数转换为天数
		return  iDays
	}

	// 看房日期
	var kfdatedata = [];
	var kfdatedataFun = function () {
		kfdatedata = [];
		$('input[datatype="date"]').each(function (index) {
			var $this = $(this);
			var datavalue = $this.attr('datavalue');
			var date = new Date;

			var d1 = datavalue.replace(/-/g, '/');
			var month = date.getMonth() + 1;
			var d2 = date.getFullYear() + '/' + month + '/' + date.getDate();
			var value = datavalue;
			// 如返回3个日期，显示为：今天、明天、日期（后天的日期）；如返回2个日期，则根据当天日期判断显示，如：今天、日期（后天的日期）；
			if (DateDiff(d1, d2) == 0) {
				value = '今天';
			} else if (DateDiff(d1, d2) == 1) {
				if ($('input[datatype="date"]').length > 2) {
					value = '明天';
				}
			}
			var obj = {
				id: 'date' + index,
				value: value,
				parentId: datavalue
			};
			kfdatedata.push(obj);
		});
		return kfdatedata;
	};

	// 看房小时
	var starthour = parseInt($('input[datatype="hour"]').attr('starthour'));
	var endhour = parseInt($('input[datatype="hour"]').attr('endhour'));
	var kfhourdata = [];
	var kfhourdataFun = function (todayStartHour, todayStartMin) {
		kfhourdata = [];
		// 如果第一天是今天
		if (kfdatedata[0]['value'] == '今天') {
			// 如果没有超过最晚时间
			if (todayStartHour < endhour || (todayStartHour == endhour && todayStartMin <= 0)) {
				// 从当前小时开始循环
				for (var i = todayStartHour; i <= endhour; i++) {
					var obj = {
						id: 'date0hour' + i,
						value: (i.toString().length == 1 ? '0' + i : i) + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:',
						parentId: 'date0'
					};
					kfhourdata.push(obj);
				}
				// 超过了最晚时间
			} else {
				// 小时变成预约结束
				var obj = {
					id: 'date0hour0',
					value: '预约结束',
					parentId: 'date0'
				};
				kfhourdata.push(obj);
			}
			// 如果第一天不是今天
		} else {
			for (var i = starthour; i <= endhour; i++) {
				var obj = {
					id: 'date0hour' + i,
					value: (i.toString().length == 1 ? '0' + i : i) + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:',
					parentId: 'date0'
				};
				kfhourdata.push(obj);
			}
		}
		// 第二天
		for (var i = starthour; i <= endhour; i++) {
			var obj = {
				id: 'date1hour' + i,
				value: (i.toString().length == 1 ? '0' + i : i) + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:',
				parentId: 'date1'
			};
			kfhourdata.push(obj);
		}
		// 第三天
		for (var i = starthour; i <= endhour; i++) {
			var obj = {
				id: 'date2hour' + i,
				value: (i.toString().length == 1 ? '0' + i : i) + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:',
				parentId: 'date2'
			};
			kfhourdata.push(obj);
		}
		return kfhourdata;
	};

	// 看房分钟
	var kfmindata = [];
	var kfmindataFun = function (todayStartHour, todayStartMin) {
		kfmindata = [];
		// 如果第一天是今天
		if (kfdatedata[0]['value'] == '今天') {
			for (var i = 0; i < 1; i++) {
				// 如果没有超过最晚时间
				if (todayStartHour < endhour || (todayStartHour == endhour && todayStartMin <= 0)) {
					for (var j = todayStartHour; j <= endhour; j++) {
						// 非最后一个小时
						if (j < endhour) {
							// 第一个小时
							if (j == todayStartHour) {
								for (var a = todayStartMin / 10; a <= 5; a++) {
									var obj = {
										id: 'date' + i + 'hour' + todayStartHour + 'min' + a,
										value: ((a * 10).toString().length == 1 ? '0' + a : a * 10),
										parentId: 'date' + i + 'hour' + todayStartHour
									};
									kfmindata.push(obj);
								}
								// 非第一，非最后一个小时
							} else {
								for (var a = 0 / 10; a <= 5; a++) {
									var obj = {
										id: 'date' + i + 'hour' + j + 'min' + a,
										value: ((a * 10).toString().length == 1 ? '0' + a : a * 10),
										parentId: 'date' + i + 'hour' + j
									};
									kfmindata.push(obj);
								}
							}
							// 最后一个小时
						} else {
							var obj = {
								id: 'date' + i + 'hour' + j + 'min' + a,
								value: '00',
								parentId: 'date' + i + 'hour' + j
							};
							kfmindata.push(obj);
						}
					}
					// 超过了最晚时间
				} else {
					// 分钟变成空
					var obj = {
						id: 'date' + i + 'hour0min0',
						value: ' ',
						parentId: 'date' + i + 'hour0'
					};
					kfmindata.push(obj);
				}
			}
		}
		// 第二天第三天
		for (var i = 1; i < 3; i++) {
			for (var j = starthour; j <= endhour; j++) {
				// 非最后一个小时
				if (j < endhour) {
					for (var a = 0 / 10; a <= 5; a++) {
						var obj = {
							id: 'date' + i + 'hour' + j + 'min' + a,
							value: ((a * 10).toString().length == 1 ? '0' + a : a * 10),
							parentId: 'date' + i + 'hour' + j
						};
						kfmindata.push(obj);
					}
					// 最后一个小时
				} else {
					var obj = {
						id: 'date' + i + 'hour' + j + 'min' + a,
						value: '00',
						parentId: 'date' + i + 'hour' + j
					};
					kfmindata.push(obj);
				}
			}
		}
		return kfmindata;
	};
	/*
	看房时间数据 end
	*/

	// 看房时间
	var kfdate = '',
		kfhour = '',
		kfmin = '';
	$('.kftime').on('click', function () {
		var now = new Date();
		$.post('/xf.d?m=getTime', {
			}, function (data) {
			if (data) {
				now = new Date(data.root.now);
			}
			var nowMinutes = now.getMinutes();
			var addMinutes = Math.ceil((nowMinutes + 30) / 10) * 10 - nowMinutes;
			var time = now.getTime() + 1000 * 60 * addMinutes;
			var newtime = new Date(time);

			new IosSelect(3, [kfdatedataFun(), kfhourdataFun(newtime.getHours(), newtime.getMinutes()), kfmindataFun(newtime.getHours(), newtime.getMinutes())], {
				title: '选择看房时间',
				itemHeight: 45,
				itemShowCount: 5,
				oneLevelId: $('.kftime').attr('dateid'),
				twoLevelId: $('.kftime').attr('hourid'),
				threeLevelId: $('.kftime').attr('minid'),
				relation: [1, 1],
				callback: function (selectOneObj, selectTwoObj, selectThreeObj) {
					kfdate = selectOneObj.parentid;
					kfhour = selectTwoObj.value.replace(/\s+/g, '');
					kfmin = selectThreeObj.value;
					$('.kftime').val(selectOneObj.value + ' ' + kfhour + kfmin);
					$('.kftime').attr({
						data: selectOneObj.parentid + ' ' + kfhour + kfmin,
						dateid: selectOneObj.id,
						hourid: selectTwoObj.id,
						minid: selectThreeObj.id
					})
				}
			});
			$('.one-level-contain').css('width', '60%');
			$('.two-level-contain').css('width', '20%');
			$('.three-level-contain').css('width', '20%');
		});
	});

	// 看房人数
	var kfcountdata = [
		{id: 'count01', value: '1人'},
		{id: 'count02', value: '2人'},
		{id: 'count03', value: '3人'},
		{id: 'count04', value: '4人'}
	];

	// 看房人数
	$('.kfcount').on('click', function () {
		new IosSelect(1, [kfcountdata], {
			title: '乘车人数',
			itemHeight: 45,
			itemShowCount: 5,
			oneLevelId: $('.kfcount').attr('dataid'),
			callback: function (selectOneObj) {
				$('.kfcount').val(selectOneObj.value).attr('dataid', selectOneObj.id);
			}
		});
	});

	// 看房城市
	var kfcitydata = [];
	$('input[datatype="city"]').each(function () {
		var $this = $(this);
		var obj = {
			id: 'city' + $this.index(),
			value: $this.attr('datavalue')
		};
		kfcitydata.push(obj);
	});

	// 选择城市
	$('.kfcity').on('click', function () {
		new IosSelect(1, [kfcitydata], {
			title: '选择城市',
			itemHeight: 45,
			itemShowCount: 5,
			oneLevelId: $('.kfcity').attr('dataid'),
			callback: function (selectOneObj) {
				$('.kfcity').val(selectOneObj.value).attr('dataid', selectOneObj.id);
			}
		});
	});

	// 检查看房时间
	var checkKfsj = function () {
		if ($('.kftime').val()) {
			return true;
		} else {
			showMessage('请补全信息 信息完整更容易通过哟');
			return false;
		}
	};

	// 检查看房人数
	var checkKfrs = function () {
		if ($('.kfcount').val()) {
			return true;
		} else {
			showMessage('请补全信息 信息完整更容易通过哟');
			return false;
		}
	};

	// 检查上测地点城市
	var checkScdd = function () {
		if ($('.kfcity').val()) {
			return true;
		} else {
			showMessage('请补全信息 信息完整更容易通过哟');
			return false;
		}
	};

	// 检查具体地址
	var checkJtdz = function () {
		if ($('.scdd').val()) {
			return true;
		} else {
			showMessage('请补全信息 信息完整更容易通过哟');
			return false;
		}
	};

	// 检查规则勾选
	var checkGz = function () {
		if ($('.yd').hasClass('on')) {
			return true;
		} else {
			showMessage('请阅读并同意专车看房须知');
			return false;
		}
	};

	function showMessage(msg) {
		$('.yzm-sta').html(msg);
		$('.wbqxx').show();
		setTimeout(function () {
			$('.wbqxx').hide();
		}, 1500);
	}

	// 点击确定
	var flag = true;
	$('.qdbtn').on('click', function () {
		if (checkKfsj() && checkKfrs() && checkScdd() && checkJtdz() && checkGz()) {
			if (flag) {
				flag = false;
				$.get('/xf.d?m=getStatusCode', {
					orderId: vars.orderid,
					userCount: $('.kfcount').val().replace('人', '') ,
					ridingCity: encodeURIComponent(encodeURIComponent($('.kfcity').val())),
					ridingAdress: encodeURIComponent(encodeURIComponent($('.scdd').val())),
					ridingTime: $('.kftime').attr('data'),
				}, function (data) {
					flag = true;
					// 报名成功
					if (data.root.status == '100') {
						$('.baomingchenggong .wtime').html('用车时间：' + kfdate + '  ' + kfhour.replace(':', '') + '点' + kfmin + '分');
						$('.baomingchenggong .waddress').html('上车地点：' + $('.scdd').val());
						unable();
						$('.baomingchenggong, .mask_50').show();
						$('.wbm>div').height($('.wbm>div').height() + 20);
						new IScrolllist('.wbm', {
							scrollX: false,
							scrollY: true,
							//scrollbars: true,
							scrollbars: 'custom'
						});
					} else if(data.root.status == '200') {
						showMessage('约车信息已提交，请勿重复提交约车信息。');
					} else {
						showMessage('接口获取信息失败，请重新提交！');
					}

				})
			}
		}
	});

	// 点击确定回到楼盘详情页
	$('.baomingchenggong .close_btn, .baomingchenggong .form-btn').on('click', function () {
		location.href = '/xf/' + vars.paramcity + '/' + vars.paramnewcode + '.htm';
	})
});
