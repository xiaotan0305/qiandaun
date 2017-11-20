$(function () {
	var openType = $('#openType').val();
	//分享
	$('.share_icon').on('click', function () {
		if (openType === 'isWap') {
			$('#shareTwo').show();
		} else if (openType === 'isApp') {
			$('#shareOne').show();
		}
	});
	$('.share-s2').on('click', function () {
		$('.share-s2').hide();
	});

	// 设置cookied
	function setCookie(cname, cvalue) {
		var curDate = new Date();
		//当前时间戳
		var curTamp = curDate.getTime();
		//当日凌晨的时间戳,减去一毫秒是为了防止后续得到的时间不会达到00:00:00的状态
		var curWeeHours = new Date(curDate.toLocaleDateString()).getTime() - 1000;
		//当日已经过去的时间（毫秒）
		var passedTamp = curTamp - curWeeHours;
		//当日剩余时间
		var leftTamp = 24 * 60 * 60 * 1000 - passedTamp;
		var leftTime = new Date();
		leftTime.setTime(leftTamp + curTamp);
		//创建cookie
		document.cookie = cname + "=" + cvalue + ";expires=" + (leftTime.toGMTString());
	}

	//获取cookie
	function getCookie(cname) {
		var name = cname + '=',
			ca = document.cookie.split(';');
		for (var i = 0; i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) == ' ') c = c.substring(1);
			if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
		}
		return '';
	}

	// 页面投票初始化
	function checkActive() {
		var gencookie = getCookie('genvoteNew'),
			gencookieArr = gencookie.split('|');
		for (key in gencookieArr) {
			if (gencookieArr[key]) {
				$('.' + gencookieArr[key]).addClass('active');
			}
		}
	}

	checkActive();

	// 延迟跳转方法
	function setTimeoutUrl(url, time) {
		setTimeout(function() {
			location.href = url;
		}, time || 0)
	}

	//普通点赞次数，大的点赞次数
	var flag = true;
	$('.bang_tab_con').on('click', '.js_genvote, .qh_con .rel', function () {
		var $this = ($(this)[0].className == 'rel') ? $(this).find('.tou') : $(this),
			url = $this.attr('data-uri') || '',
			loupanid = $this.attr('data-id'),
			gencookie = getCookie('genvoteNew') || '';

		if (flag) {
			flag = false;
			var genurl = location.protocol + '//' + location.host + '/hiphop.hd?m=gencount&loupanid=' + loupanid;
			$.post(genurl, function (data) {
				var isSuc = data.isSuc,
					isOff = data.isOff;
				if (isOff == 'off') {
					if ($this[0].className.indexOf('tou') > -1) {
						setTimeoutUrl(url);
						return;
					} else {
						$('.zuopenbox p').html('投票已结束');
						$('.zuopenbox').show();
					}
				} else {
					//可以点赞
					if ((gencookie.indexOf(loupanid) == -1) || gencookie == '') {
						setCookie('genvoteNew', getCookie('genvoteNew') + loupanid + '|');

						if (isSuc == 'no') {
							//点过了
							if ($this[0].className.indexOf('tou') > -1) {

							}
							$('.zuopenbox').show();
						} else {
							//点赞成功，投票加1动画
							var text_box = $('.' + loupanid).siblings('.add-num');
							text_box.show().html('<em class="add-animation">+1</em>');
							$('.add-animation').addClass('hover');
							var count = parseInt($('#' + loupanid).text());
							$('#' + loupanid).html(count + 1);
							$('.' + loupanid).addClass('active');

							if ($this[0].className.indexOf('tou') > -1) {
								setTimeoutUrl(url, 1000);
							}
						}


					} else {
						//点过了，不可以点赞
						if ($this[0].className.indexOf('tou') > -1) {
							setTimeoutUrl(url);
							return;
						}
						$('.zuopenbox').show();
					}
				}
				flag = true;
			});
		}
	});

	// 关闭提示
	$('.close').on('click', function () {
		$('.zuopenbox').hide();
		$('.zuopenbox p').html('今天你已经为楼盘投<br>过票啦~明天再来吧！')
	});

	// 获取参数的方法
	function GetQueryString(name) {
		var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)'),
			r = window.location.search.substr(1).match(reg);
		if (r != null)return unescape(r[2]);
		return null;
	}

	//列表切换
	$('#navTab').on('click', 'a', function () {
		var $this = $(this);
		if (!$this.hasClass('active')) {
			$('.top_a a').removeClass('active');
			$this.addClass('active');
			var pd = '',
				typename = $(this).text(),
				url = location.protocol + '//' + location.host + '/hiphop.hd?m=hiptype&city=' + GetQueryString('city') + '&type=' + encodeURIComponent(encodeURIComponent(typename));
			$.get(url, function (data) {
				if (data == '' || data == null) {
					//不做处理
				} else {
					var gen = data.genlist,
						gold = data.goldlist;
					if (gold.length > 0) {
						pd += '<div class="qh_con" >' +
							'<ul>';
						gold.forEach(function (item) {
							pd += '<li class="rel">' +
								'<img src="' + item.img + '" alt="">' +
								'<div class="vote_shu">' +
								'<a data-uri="//' + location.host + '/hiphop.hd?m=goldcount&loupanid=' + item.id + '&city=' + GetQueryString('city') + '&channel=newhouse" href="javascript:void(0);" class="tou ' + item.id + '" data-id="' + item.id + '"></a>' +
								'<span class="number_vote"><i></i><b id="' + item.id + '">' + item.count + '</b><u>票</u></span>' +
								'</div>' +
								'</li>'
						});
						pd += '</ul>' +
							'</div>'
					}
					if (gen.length > 0) {
						pd += '<ol class="lp_bang" >';
						gen.forEach(function (item) {
							pd += '<li class="clearfix">' +
								'<div class="fl">' +
								'<span class="lp_bangtitle">' + item.loupan + '</span>' +
								'<span class="number_vote"><i></i><b id="' + item.id + '">' + item.count + '</b>票</span>' +
								'</div>' +
								'<div class="fr"><span  class="add-num"><em>+1</em></span><a class="js_genvote ' + item.id + '" data-id="' + item.id + '"></a></div>' +
								'</li>'
						});
						pd += '</ol>';
					}
					$('.bang_tab_con').empty().append(pd);
					checkActive();
				}
			});
		}
	});
});
