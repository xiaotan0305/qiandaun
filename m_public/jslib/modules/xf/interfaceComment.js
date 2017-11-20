define('modules/xf/interfaceComment',['jquery','util/util','jwingupload/1.0.6/jwingupload', 'modules/index/locate'],
	function (require,exports,module) {
		'use strict';
		var $ = require('jquery');
		var cookiefile = require('util/util');
		var vars = seajs.data.vars;
		var sfut = cookiefile.getCookie('sfut');
		var jwupload = null;
		var paramcity = cookiefile.getCookie('encity') || vars.paramcity;
		var paramId = vars.paramId;

		// 去除底部标签
		$('footer').css('display','none');

		// 实现定位用的js实例，！！！这个js现在返回的是一个对象，也就是说Locate是一个对象而不是一个类
		require('modules/index/locate');

		// 获取点评楼盘的id
		$('#search_completev1').on('click', function (e) {
			paramId = $(e.target).parents('li').attr('data-projcode') || '';
		});

		// 初始化时的句子（亲，这个楼盘怎么样？快来说两句！）
		var $miaoshu = $('#miaoshu');
		var con = $miaoshu.text();
		var scotf = false;
		var comtf = false;
		// 搜索
		var checkHouse = {
			newcode: '',
			house: ''
		};

		// 点击事件----------------start
		function click() {
			$('#miaoshu').click(function () {
				$('body').animate({scrollTop: 242});
				var connow = $(this).text();
				if (connow === con) {
					$(this).empty();
				}
			});
		}

		// 字数统计
		function debounce(func, wait, immediate) {
			var timeout;
			return function () {
				var that = this, args = arguments;
				var later = function () {
					timeout = null;
					if (!immediate) {
						func.apply(that, args);
					}
				};
				var callNow = immediate && !timeout;
				clearTimeout(timeout);
				timeout = setTimeout(later, wait);
				if (callNow) {
					func.apply(that, args);
				}
			};
		}
		var $reminder = $('#reminder');
		var myEfficientFn = debounce(function () {
			// 所有繁重的操作
			var textLength = $miaoshu.text().trim().length;
			if (textLength < 1) {
				$reminder.html('0字');
			}else if (textLength >= 1 && textLength < 10) {
				$reminder.html('还差' + (10 - textLength) + '字');
			} else {
				$reminder.html(textLength + '字');
			}
			if (textLength > 0) {
				$miaoshu.css('color','black');
			} else {
				$miaoshu.css('color','gray');
			}
		}, 500);
		var element = document.getElementById('miaoshu');
		element.addEventListener('input',myEfficientFn);
		// 评分处理
		$('dl').each(function () {
			$(this).find('i').each(function (index) {
				$(this).on('mouseover', function () {
					fnPoint(this,index + 1);
					smile(this,index + 1);
				});
			});
		});
		function fnPoint(_this,iArg) {
			// 分数赋值
			var iScore = iArg;
			var id = $(_this).parents('dl').attr('id');
			var oStar = $('#' + id);
			var aLi = oStar[0].getElementsByTagName('i');
			var oSpan = oStar[0].getElementsByTagName('span')[0];
			for (var i = 0; i < aLi.length; i++) {
				aLi[i].className = i < iScore ? 'active' : '';
			}
			oSpan.innerHTML = iScore + ' 分';
			zonghe();
		}
		function smile(_this,iArg) {
			var id = $(_this).parents('dl').attr('id');
			var oStar = $('#' + id);
			var oSpan = oStar[0].getElementsByTagName('span')[0];
			oSpan.className = 'fen num face' + iArg;
		}
		function zonghe() {
			var zongshu = 0;
			var $zonghe = $('.fen');
			for (var i = 0; i < $zonghe.length; i++) {
				var fen = $zonghe.eq(i).text().split('分')[0];
				zongshu = Number(zongshu) + fen * 1;
				$('#zongshu').html((zongshu / 5).toFixed(1) + '分');
			}
		}

		// 上传图片
		// 防止重复提交出错
		var submitClick = true;
		require.async(['jwingupload/1.0.6/jwingupload'],function (jWingUpload) {
			jwupload = jWingUpload({
				preview: document.getElementById('xfAddpic'),
				maxLength: 6,
				imgPath: vars.public,
				url: '/upload.d?m=uploadNew'
			});
		});

		var checkSubmit = true;
		$('#submit').click(function () {
			var score = getscore();
			if (score.indexOf(',,') === -1 && score.indexOf(',') !== 0) {
				scotf = true;
			} else {
				alert('亲请给每项都打个分~');
			}
			var contenta = getCon();
			if (contenta.length > 10 && contenta.length < 2000 && contenta !== '亲，这个楼盘怎么样？快来说两句！') {
				comtf = true;
			}

			// 检查是否登陆
			var Login = checkLogin();
			if (Login && sfut && scotf && comtf) {
				if (submitClick && checkSubmit) {
					submitClick = false;
					checkSubmit = false;
					submit();
					setTimeout(function () {
						checkSubmit = true;
					},5000);
				} else if (!checkSubmit) {
					alert('提交过于频繁，请5秒后提交');
				}
			}
		});

		// 提交
		function submit() {
			require.async('jsub/_ubm.js?');
			var userid = '';
			var username = '';
			var check = $('input[type="checkbox"]').is(':checked');
			var ischecked = '';
			if (check) {
				ischecked = '1';
			}
			var score = getscore();
			if (score.indexOf(',,') === -1 && score.indexOf(',') !== 0) {
				scotf = true;
			} else {
				alert('亲请给每项都打个分~');
			}
			var contenta = getCon();
			if (contenta.length > 10 && contenta.length < 2000 && contenta !== '亲，这个楼盘怎么样？快来说两句！') {
				comtf = true;
			}
			var picUrl = '';
			if (jwupload) {
				$.each(jwupload.imgsArray,function (index,element) {
					if (element.imgurl) {
						picUrl += element.imgurl + ',';
					}
				});
			}
			if (!checkHouse.newcode || checkHouse.house !== $('#projname').val()) {
				alert('请输入正确的楼盘');
				submitClick = true;
			}else {
				if (sfut && scotf && comtf) {
					$.get('/user.d?m=getUserinfoBySfut',function (data) {
						if (data) {
							var returnResult = data.root.return_result;
							if (returnResult === '100') {
								username = data.root.username;
								userid = data.root.userid;
								paramcity = cookiefile.getCookie('encity') || vars.paramcity;
								$.get('/xf.d?m=giveComment',{
									score: score.substring(0,score.length - 1),
									content: encodeURIComponent(encodeURIComponent(contenta)),
									type: 'wap',
									userid: userid,
									username: encodeURIComponent(encodeURIComponent(username)),
									pic_url: picUrl.substring(0,picUrl.length - 1),
									city: vars.paramcity,
									id: checkHouse.newcode,
									anonymous: ischecked
								}, function (data) {
									if (data) {
										var message = data.root.status;
										alert(message.split(',')[1]);
										if (message.split(',')[0] === '100') {
											window.location.href = '/xf.d?m=dianpingSuc&city=' + paramcity + '&newcode=' + paramId;
										}
									}
								});
							}
							submitClick = true;
						}
					});
				}
			}
		}

		// 提交检查
		function getscore() {
			var score = '';
			$('.fen').each(function () {
				if ($(this).text().replace('分','').trim() !== '0') {
					score = score + $(this).text().replace('分','').trim() + ',';
				} else {
					if (scotf) {
						alert('请给每项都打个分');
					}
					scotf = false;
					return false;
				}
			});
			return score;
		}
		function getCon() {
			var content = $('.textarea').text().trim();
			if (content.length < 10) {
				$('.floatMsg').html('<p style="white-space:nowrap;font-size:10px;">最少要10个字哦，再说两句吧</p>').show();
				setTimeout(function () {
					$('.floatMsg').hide();
				}, 1200);
				comtf = false;
			}
			if (content.length > 2000) {
				$('.floatMsg').html('<p style="white-space:nowrap;font-size:10px;">文字数量超出限制</p>').show();
				setTimeout(function () {
					$('.floatMsg').hide();
				},1200);
				comtf = false;
				alert('最多只能说2000个字哦亲');
			}
			if (content === '亲，这个楼盘怎么样？快来说两句！') {
				alert('亲说两句吧~');
				comtf = false;
			}
			return content;
		}

		// 检查登陆
		var userid = '';
		function checkLogin() {
			if (sfut) {
				$.get('/user.d?m=getUserinfoBySfut',function (data) {
					if (data) {
						var returnResult = data.root.return_result;
						if (returnResult === '100') {
							var ismobilevalid = data.root.ismobilevalid;
							userid = data.root.userid;
							if (!userid) {
								scotf = false;
								comtf = false;
								alert('请登录后操作！');
								window.location.href = 'https://m.fang.com/passport/login.aspx?burl=' + location.href;
								return false;
							} else {
								if (ismobilevalid !== '1') {
									window.location.href = '//m.fang.com/my/?c=mycenter&a=index&city=' + vars.paramcity + '&burl='  + location.href;
									return false;
								}
							}
						}
					}
				});
				return true;
			} else {
				window.location.href = 'https://m.fang.com/passport/login.aspx?burl=' + location.href;
				return false;
			}
		}
		var $search = $('#search_completev1');
		var $content = $('#content');
		var $searHistory = $('.searHistory');
		function querykey() {
			var keyword = $('#projname').val().trim();
			if (!keyword) {
				show();
			} else {
				var url = '/shopinfo.d?m=getLoupan&city=' + paramcity
					+ '&purpose=' + '<%=URLEncoder.encode(URLEncoder.encode("住宅", "utf-8"),"utf-8")%>'
					+ '&keyword=' + encodeURIComponent(encodeURIComponent(keyword));
				$.post(url,function (data) {
					var items = data.root.items;
					var resHtml = [];
					resHtml.push('<ul>');
					for (var i = 0; i < items.length; i++) {
						resHtml.push('<li data-projcode='+ items[i].projcode
							+ ' ><a href="javascript:void(0);"><span class="searchListName">' + items[i].projname + '</span></a></li>');
					}
					resHtml.push('</ul><div class="clearBtn2 lh45 center bd-b-f4 mgX10" id="closeBtn"><a class="" href="javascript:void(0);">关闭</a></div>');
					$content.hide();
					$search.html(resHtml.join(''));
					$searHistory.show();
					getProjname();
				});
			}
		}
		function show() {
			$search.html('');
			$searHistory.hide();
			$content.show();
		}
		function getProjname() {
			var $searchli = $('#search_completev1 li');
			if ($searchli.length <= 0) {
				show();
			}
			$searchli.on('click',function () {
				$('#projname').val($(this).find('span').html());
				checkHouse.house = $(this).find('span').html();
				checkHouse.newcode = $(this).attr('data-projcode');
				show();
			});
			$('#closeBtn').on('click',function () {
				show();
			});
		}
		$('#projname').bind('input propertychange', function () {
			querykey();
		});
		module.exports = {
			init: function () {
				click();
			}
		};
	});