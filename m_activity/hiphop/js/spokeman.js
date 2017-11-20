$(function () {
	var openType = $('#openType').val() || 'isWap';

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
	$('.showImg').on('click', function () {
		var $this = $(this);
		$('.backMain').attr('src', $this.attr('src'));
		$('.backMain').show();
		$('.spoke').hide();
	});
	$('.play-icon').on('click', function () {
		var $this = $(this);
		$('.header').show();
		$('.spoke').hide();
		$('body').append('<video preload="auto" data-setup="{"controls": true, "autoplay": true, "preload": "auto" }" class="video-js" autoplay="" src="' + $this.attr('video-url') + '" controls=""></video>');
	});
	$('.backMain,.vBackMain').on('click', function () {
		$('.spoke').show();
		$('.backMain').hide();
		$('.header').hide();
		$('.video-js').remove();
	});

	function setCookie(name, value) {
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
		document.cookie = name + '=' + encodeURIComponent(value) + '; path=/; expires=' + leftTime.toGMTString();
	}

	function getCookie(name) {
		var arr, reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
		if (arr = document.cookie.match(reg)) {
			var str;
			try {
				str = decodeURIComponent(arr[2]);
			} catch (e) {
				str = unescape(arr[2]);
			}
			return str;
		}
		return '';
	}

	// 页面投票初始化
	function checkActive() {
		var gencookie = getCookie('spokevote'),
			gencookieArr = gencookie.split(',');
		for (key in gencookieArr) {
			if (gencookieArr[key]) {
				$("[data-id='" + gencookieArr[key] + "']").addClass('active');
			}
		}
	}

	checkActive();

	//普通点赞次数
	var flag = true;
	$('.dyren').on('click', '.toudyr_btn', function () {
		var $this = $(this),
			id = $this.attr('data-id'),
			gencookie = getCookie('spokevote') || '',
			loupanid = $('#loupanid').val(),
			totalCount = parseInt($('#totalCount').text());

		if (flag) {
			flag = false;
			var genurl = location.protocol + '//' + location.host + '/hiphop.hd?m=spokemancount&id=' + id
				+ '&loupanid=' + loupanid + '&totalCount=' + totalCount;
			$.post(genurl, function (data) {
				var isSuc = data.isSuc,
					isOff = data.isOff;
				if (isOff == 'off') {
					$('.zuopenbox p').html('投票已结束');
					$('.zuopenbox').show();
					$('.opencon1').show();
				} else {
					//可以点赞
					if (gencookie.indexOf(id) == -1) {
						if (isSuc == 'no') {
							//点过了
							$('.zuopenbox').show();
							$('.opencon1').show();
						} else {
							//点赞成功，投票加1动画
							var text_box = $('.' + id).siblings('.add-num');
							text_box.show().html('<em class="add-animation">+1</em>');
							$('.add-animation').addClass('hover');
							var count = parseInt($('#' + id).text());
							$('#' + id).html(count + 1);
							$('#totalCount').html(totalCount + 1);
							$("[data-id='" + id + "']").addClass('active');
							setCookie('spokevote', getCookie('spokevote') + ',' + id);
						}
					} else {
						//不可以点赞
						$('.zuopenbox').show();
						$('.opencon1').show();
					}
				}
				flag = true;
			});
		}

	});

	// 获取参数的方法
	function GetQueryString(name) {
		var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)'),
			r = window.location.search.substr(1).match(reg);
		if (r != null)return unescape(r[2]);
		return null;
	}

	//列表切换
	$('.openDyrFrm').on('click', function () {
		if ($('#joinopen').val() == 'off') {
			$('.opencon1 p').html('代言人招募已结束');
			$('.opencon1').show();
		} else {
			$('#inputFrm').show();
		}
		$('.zuopenbox').show();
	});

	// 关闭提示
	$('.close').on('click', function () {
		$('.zuopenbox, .opencon1, .opencon, #msgTip').hide();
		$('#spkname, #spkphone').val('');
		$('.opencon1 p').html('今天你已经投过票啦~<br>&ensp;明天再来吧！');
	});

	// 点击提交按钮
	var joinid = '';
	$('.btn-tj').on('click', function () {
		var name = encodeURIComponent(encodeURIComponent($('#spkname').val()));
		var phone = $('#spkphone').val();
		var phoneFlag = checkPhone(phone);
		var loupanid = $('#loupanid').val();
		var city = $('#city').val();
		var loupan = encodeURIComponent(encodeURIComponent($('#loupan').val()));
		if (phoneFlag) {
			var genurl = location.protocol + '//' + location.host + '/hiphop.hd?m=addSpoke&name=' + name + '&phone='
				+ phone + '&loupanid=' + loupanid + '&loupan=' + loupan + '&city=' + city;
			$.get(genurl, function (data) {
				var isSuc = data.isSuc;
				if (isSuc == 'yes') {
					$('.spoke').hide();
					$('.join').show();
					$('body').css('background', '#1d1d1d');
					joinid = data.joinid;
				}
			});
		}
	});

	// 手机号限制输入11位
	$('#spkphone').on('input', function () {
		var $this = $(this);
		$this.val($this.val().substr(0, 11));
	});

	// 检测手机号是否正确
	function checkPhone(phone) {
		phone = phone || '';
		var phoneReg = /^(13[0-9]|14[0-9]|15[0-9]|18[0-9]|17[0-9])\d{8}$/i;
		if (!phone) {
			$('.error').html('手机号不能为空');
			$('#spkphone').val('');
			return false;
		} else if (!phoneReg.test(phone)) {
			$('.error').html('请输入正确的手机号');
			$('#spkphone').val('');
			return false;
		} else {
			return true;
		}
	}

	// 每10秒刷新投票数据
	function updateTotalCount() {
		var loupanid = $('#loupanid').val();
		var genurl = location.protocol + '//' + location.host + '/hiphop.hd?m=getSpokeCount&loupanid=' + loupanid;
		$.get(genurl, function (data) {
			var count = data.count;
			if (count) {
				$('#totalCount').html(count);
			}
		});
	}

	setInterval(updateTotalCount, 1000 * 10);

	function imgChange(e) {
		var reader = new FileReader();
		reader.onload = (function (file) {
			return function () {
				//将图片路径存入src中，显示出图片
				$('.peopic').attr('src', this.result);
				$('.sc_tu').css('border-radius', '0');
				$('.sc_cz_wrap').hide();
				$('.tu_xian').show();
				file['data'] = this.result; //这个就是base64的数据了

				function oncemore () {
					if ($('.peopic')[0].naturalWidth > 0) {
						funUploadFile(file, file['data']);
						return;
					} else {
						setTimeout(function () {
							oncemore ()
						}, 500)
					}
				}
				oncemore();

				// 改变下方按钮
				$('.tiao_guo .jump').hide();
				$('.tiao_guo').addClass('confirm');
			};
		})(e.target.files[0]);
		reader.readAsDataURL(e.target.files[0]);
	}

	var defaultHtml = $('.zixian').html();
	// 点击加号
	var file;
	$('.shangchuan').on('change', function (e) {
		file = this.files[0];
		//file['index'] = 0;
		imgChange(e);
	});

	// 编辑代言
	$('.bjdy').on('click', function () {
		var $this = $(this);
		if ($this.html() == '编辑代言') {
			$('.zixian, .que_ren').hide();
			$('.shuru_yu').show();
			$(this).text('确认编辑');
		} else {
			$('.shuru_yu').hide();
			$('.zixian').html($('.shuru_yu').val() || $('.zixian').html()).show();
			$(this).text('编辑代言');
			if (!$('.huan_tu').is(':hidden')) {
				$('.que_ren').show();
			}
		}
	});

	// 换图
	$('.tiao_guo .huan_tu').on('click', function () {
		$('.peopic').attr('src', '');
		$('.shangchuan').click();
	});

	// 确认
	$('.tiao_guo .que_ren').on('click', function () {
		if (imgUrl) {
			$.post('/hiphop.hd?m=addJoin&img=' + imgUrl + '&joinid=' + joinid + '&joinword='
				+ encodeURIComponent(encodeURIComponent($('.zixian').html().trim().replace(/\<br\>|\n/g, ''))), function (data) {
				//if (data.isSuc == 'yes') {
				$('.spoke, #msgTip').show();
				$('.join, #inputFrm').hide();
				$('body').css('background', '');

				$('.peopic').attr('src', '');
				$('.sc_tu').css({
					'border-top-left-radius': '30px',
					'border-top-right-radius': '30px'
				});
				$('.sc_cz_wrap').show();
				$('.tu_xian').hide();
				$('.tiao_guo .jump').show();
				$('.huan_tu, .que_ren').hide();
				$('.zixian').html(defaultHtml);
				//}
			})
		} else {
			alert('请上传图片')
		}
	});

	// 跳过
	$('.tiao_guo .jump').on('click', function () {
		$('.spoke, #msgTip').show();
		$('.join, #inputFrm').hide();
		$('body').css('background', '');
	});

	// 上传图片
	var imgUrl = '';
	function funUploadFile(file, uploadBase64) {
		$('.que_ren, .huan_tu').hide();
		$('.loading').show();
		imgUrl = '';
		var xhr = new XMLHttpRequest();
		if (xhr.upload) {
			xhr.onreadystatechange = function (e) {
				if (xhr.readyState == 4) {
					if (xhr.status == 200) {
						if (xhr.responseText) {
							imgUrl = $.parseJSON(xhr.responseText).result.url;
							$('.que_ren, .huan_tu').show();
							$('.loading').hide();
							//console.log(imgUrl);
						} else {
							uploadFail();
						}
					} else {
						uploadFail();
					}
				}
			};
			// 开始上传
			xhr.open('POST', '/upload.d?m=uploadNewOne' + "&fileName=" + file.name + "&type=" + file.type + '&width=' + $('.peopic')[0].naturalWidth + '&height=' + $('.peopic')[0].naturalHeight    /*, async, default to true */);
			var formData = new FormData();
			formData.append('pic', uploadBase64);
			xhr.send(formData);
		}
	}

	// 上传失败
	function uploadFail() {
		$('.que_ren, .huan_tu').show();
		$('.loading').hide();

		$('.peopic').attr('src', '');
		$('.sc_tu').css({
			'border-top-left-radius': '30px',
			'border-top-right-radius': '30px'
		});
		$('.sc_cz_wrap').show();
		$('.tu_xian').hide();
	}
});