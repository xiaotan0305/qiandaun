;
(function(window, $) {

	/**
	 * [tool description]
	 * @type {Object}
	 */
	var tool = {
		/**
		 * [getTime 获取当前时间戳]
		 */
		now: function() {
			return new Date().getTime();
		},
		/**
		 * [getUA 获取userAgent]
		 */
		getUA: function() {
			return window.navigator.userAgent;
		},
		/**
		 * [getSize 获取盒子宽高]
		 */
		getSize: function($that) {
			return {
				width: $that.width(),
				height: $that.height()
			};
		},
		/**
		 * [getTags 加载CSS文件]
		 */
		getTags: function() {
			var tags = document.getElementsByTagName('*');
			var tagsArr = [];
			for (var i = 0, len = tags.length; i < len; i++) {
				tagsArr.push(tags[i].tagName.toLowerCase());
			}
			return tagsArr;
		},
		isNum: function(param) {
			return typeof param === 'number';
		},
		/**
		 * [getClientX 获取X坐标]
		 * @param  {[type]} ev [事件]
		 * @return {[type]}    [坐标]
		 */
		getClientX: function(ev) {
			if (tool.isNum(ev.clientX)) {
				return ev.clientX;
			}
			return (ev.originalEvent.changedTouches && ev.originalEvent.changedTouches[0]).clientX;
		},
		/**
		 * [getClientY 获取Y坐标]
		 * @param  {[type]} ev [事件]
		 * @return {[type]}    [坐标]
		 */
		getClientY: function(ev) {
			if (tool.isNum(ev.clientY)) {
				return ev.clientY;
			}
			return (ev.originalEvent.changedTouches && ev.originalEvent.changedTouches[0]).clientY;
		},
		/**
		 * [getScrollLeft 获取scrollLeft]
		 * @param  {[type]} offset [pageXOffset]
		 * @param  {[type]} compat [CSS1Compat]
		 * @return {[type]}        [scrollLeft]
		 */
		getScrollLeft: function(offset, compat) {
			if (offset) {
				return window.pageXOffset;
			} else if (compat) {
				return document.documentElement.scrollLeft;
			}
			return document.body.scrollLeft;
		},
		/**
		 * [getScrollTop 获取scrollTop]
		 * @param  {[type]} offset [pageXOffset]
		 * @param  {[type]} compat [CSS1Compat]
		 * @return {[type]}        [scrollTop]
		 */
		getScrollTop: function(offset, compat) {
			if (offset) {
				return window.pageXOffset;
			} else if (compat) {
				return document.documentElement.scrollTop;
			}
			return document.body.scrollTop;
		},
		/**
		 * [loadStyleFile 加载CSS文件]
		 * @param  {[type]} url  [css路径]
		 * @param  {[type]} succ [成功回调]
		 * @param  {[type]} fail [失败回调]
		 */
		loadStyleFile: function(url, succ, fail) {
			var cssObj = document.createElement('link');
			cssObj.type = 'text/css';
			cssObj.rel = 'stylesheet';
			cssObj.href = url;
			cssObj.onload = function() {
				succ && succ();
			};
			cssObj.onerror = function() {
				fail && fail();
			};
			document.getElementsByTagName('head')[0].appendChild(cssObj);
		},

		/**
		 * [jsonp description]
		 * @param  {[type]}   options  [description]
		 * @param  {[type]}   domains  [description]
		 * @param  {[type]}   path     [description]
		 * @param  {[type]}   config   [description]
		 * @param  {Function} callback [description]
		 * @return {[type]}            [description]
		 */
		jsonp: function(options, domains, path, config, callback) {
			var cb = "fangcheck_" + (parseInt(Math.random() * 10000) + (new Date()).valueOf());
			window[cb] = function(data) {
				callback(data);
				window[cb] = undefined;
				try {
					delete window[cb];
				} catch (e) {}
			};
			config.callback = cb;
			options.load(options.protocol, domains, path, config, function(err) {
				if (err) {
					console.log(err);
				}
			});
		},

		/**
		 * [throttle 函数节流]
		 * @param  {Function} fn      [要执行的函数]
		 * @param  {[type]}   delay   [延迟多久执行]
		 * @param  {[type]}   atleast [至少多久执行一次]
		 */
		throttle: function(fn, delay, atleast) {
			var timer = null;
			var previous = null;
			return function(param) {
				var now = +new Date();
				if (!previous) previous = now;
				if (atleast && now - previous > atleast) {
					fn(param);
					// 重置上一次开始时间为本次结束时间
					previous = now;
					clearTimeout(timer);
				} else {
					clearTimeout(timer);
					timer = setTimeout(function() {
						fn(param);
						previous = null;
					}, delay);
				}
			};
		}
	};

	/**
	 * [imgUtil description]
	 * @type {Object}
	 */
	var imgUtil = {
		/**
		 * [getRandomTxt 获取随机字符]
		 * @return {[type]} [随机字符]
		 */
		getIndex: function() {
			result.num = Math.floor(Math.random() * opts.text.length);
			result.text = opts.text.substring(result.num, result.num + 1);
			return result.num;
		},
		/**
		 * [getClickBg 获取验证用的图片]
		 * @return {[type]} [图片url]
		 */
		getClickBg: function() {
			return opts.protocol + opts.apiserver + '/?c=checkcode&a=createImg&index=' + imgUtil.getIndex() + '&width=' + opts.imgWidth + '&height=' + opts.imgHeight + '&challenge=' + opts.challenge + '&_=' + tool.now();
		},
		getImgTpl: function() {
			return '<div class="img-verify">' + '<div class="v-mask">' + '<span class="mask-tip"><i class="verifyicon verifyicon-fail"></i><b>验证失败</b></span>' + '<div class="loading"><div></div><div></div></div>' + '</div>' + '<img class="click-bg" src="' + imgUtil.getClickBg() + '">' + '</div>';
		}
	};

	// 默认配置项
	var defaults = {
		delay: 100,
		atleast: 100,
		clickLimit: 1,
		url: {
			clickBg: '',
			css: '/common_m/m_checkcode/dev/css/fc.min.css'
		},
		path: {
			codeDrag: '/?c=checkcode&a=codeDrag',
			codeImgVerfied: '/?c=checkcode&a=codeImgVerfied',
			reset: '/?c=checkcode&a=reset'
		},
		text: '房天下网站',
		imgWidth: 300,
		imgHeight: 200
	};
	var opts;
	var result = {};
	/**
	 * [fangcheck description]
	 * @param  {[type]} config [description]
	 * @return {[type]}        [description]
	 */
	function fangcheck(config) {
		this.target = initFangcheck(config);
	}
	fangcheck.prototype = {
		appendTo: function(container) {
			this.target.appendTo(container.html(''));
		},
		onSuccess: function(cb) {
			result.onSuccess = cb;
		},
		onError: function(cb) {
			result.onError = cb;
		},
		getValidate: function() {
			return {
				fc_gt: opts.gt,
				fc_challenge: opts.challenge,
				fc_validate: result.validate
			}
		}
	};
	/**
	 * [initFangcheck description]
	 * @param  {[type]} config [description]
	 * @return {[type]}        [description]
	 */
	function initFangcheck(config) {
		opts = config._extend(defaults);
		console.log(opts);
		// 起始的横向坐标
		var startX,
			// 盒子DOM
			$that = $('<div></div>'),
			// 是否在拖拽
			isMove = false,
			// 点击次数统计
			clickCount = 0,
			// 页面信息
			pageInfo = {},
			// 拖拽信息
			dragInfo = [],
			// 点击信息
			clickInfo = [],
			// 节流函数
			throttleCallback,
			// 能滑动的最大间距
			maxWidth,
			// 背景，文字，滑块，图片验证码
			tpl = '<div class="slide-verify">' + '<div class="drag-bg"></div>' + '<div class="drag-text">拖动滑块验证</div>' + '<div class="loading"><div></div><div></div></div>' + '<div class="drag-handler verifyicon verifyicon-arrow center-icon"></div>' + '</div>',
			// 点击图标
			clickIcon = '<div class="verifyicon verifyicon-click click-icon center-icon"></div>',
			btnTarget = '';

		tool.loadStyleFile(opts.protocol+opts.static_servers+opts.url.css, function() {
			init();
		}, function() {
			console.error('slideVerify - CSS文件加载失败');
		});

		function init() {
			// 是否在拖拽
			isMove = false;
			// 点击次数统计
			clickCount = 0;
			// 页面信息
			pageInfo = {};
			// 拖拽信息
			dragInfo = [];
			// 点击信息
			clickInfo = [];
			// 插入模板
			appendDOM();
			// 绑定页面事件
			bindPageEvent();
			// 绑定滑块事件
			bindSlideEvent();
			// 获取页面信息
			getPageInfo();
			// 定时获取拖拽信息
			throttleCallback = tool.throttle(markDrag, opts.delay, opts.atleast);
			// 能滑动的最大间距
			maxWidth = $that.width() - $that.handler.width();
		}

		/**
		 * [getPageInfo 获取页面信息]
		 */
		function getPageInfo() {
			pageInfo.initTime = tool.now();
			pageInfo.ua = tool.getUA();
			pageInfo.tags = tool.getTags();
			pageInfo.offsetTop = $that.offset().top;
			pageInfo.size = tool.getSize($that);
		}

		/**
		 * [appendDOM 插入模板]
		 */
		function appendDOM() {
			$that.html(tpl);
		}


		/**
		 * [bindPageEvent 给页面绑定监控事件]
		 */
		function bindPageEvent() {
			$(document).on('touchmove', function(ev) {
				markDrag({
					x: tool.getClientX(ev),
					y: tool.getClientY(ev),
					t: tool.now(),
					e: 'touchmove'
				});
			}).on('touchstart', function(ev) {
				markDrag({
					x: tool.getClientX(ev),
					y: tool.getClientY(ev),
					t: tool.now(),
					e: 'touchstart'
				});
			}).on('touchend', function(ev) {
				markDrag({
					x: tool.getClientX(ev),
					y: tool.getClientY(ev),
					t: tool.now(),
					e: 'touchend'
				});
			});
			$(window).on('scroll', function(ev) {
				var offset = 'pageXOffset' in window,
					compat = 'CSS1Compat' === (document.compatMode || '');
				markDrag({
					x: tool.getScrollLeft(offset, compat),
					y: tool.getScrollTop(offset, compat),
					t: tool.now(),
					e: 'scroll'
				});
			}).on('focus', function(ev) {
				markDrag({
					t: tool.now(),
					e: 'focus'
				});
			}).on('blur', function(ev) {
				markDrag({
					t: tool.now(),
					e: 'blur'
				});
			}).on('unload', function(ev) {
				markDrag({
					t: tool.now(),
					e: 'unload'
				});
			});
		}

		/**
		 * [bindSlideEvent 绑定事件]
		 */
		function bindSlideEvent() {
			$that.handler = $that.find('.drag-handler');
			$that.dragBg = $that.find('.drag-bg');
			$that.text = $that.find('.drag-text');
			$that.loading = $that.find('.loading');

			// touchstart时候的x轴的位置
			// touchmove时，移动距离大于0小于最大间距，滑块x轴位置等于移动距离
			$that.handler.on('touchstart', function(ev) {
				ev.originalEvent.preventDefault();
				handerStart(ev);
			}).on('touchmove', function(ev) {
				ev.originalEvent.preventDefault();
				handerMove(ev);
			}).on('touchend', function(ev) {
				ev.originalEvent.preventDefault();
				handerEnd(ev);
			});
		}

		/**
		 * [handerStart 拖拽开始]
		 * @param  {[type]} ev   [事件]
		 * @param  {[type]} type [类型]
		 */
		function handerStart(ev) {
			isMove = true;
			var touchEv = ev.originalEvent.changedTouches[0];
			startX = touchEv.clientX - parseInt($that.handler.css('left'), 10);
			btnTarget = ev.target.tagName;
			// markDrag({
			//     x: touchEv.clientX,
			//     y: touchEv.clientY,
			//     t: tool.now(),
			//     e: 'touchstart'
			// });
		}

		/**
		 * [handerMove 拖拽时]
		 * @param  {[type]} ev   [事件]
		 * @param  {[type]} type [类型]
		 */
		function handerMove(ev) {
			if (isMove) {
				var touchEv = ev.originalEvent.changedTouches[0];

				var currentX = touchEv.clientX - startX;
				// throttleCallback({
				//     x: touchEv.clientX,
				//     y: touchEv.clientY,
				//     t: tool.now(),
				//     e: 'touchmove'
				// });
				// 如果没有移到终点
				if (currentX > 0 && currentX <= maxWidth) {
					$that.handler.css({
						left: currentX
					});
					$that.dragBg.css({
						width: currentX
					});
				} else if (currentX > maxWidth) {
					markDrag({
						x: touchEv.clientX,
						y: touchEv.clientY,
						t: tool.now(),
						e: 'touchend'
					});
					// 移动到终点
					dragDone();
					isMove = false;
				}
			}
		}

		/**
		 * [handerEnd 拖拽结束]
		 * @param  {[type]} ev   [事件]
		 * @param  {[type]} type [类型]
		 */
		function handerEnd(ev) {
			isMove = false;
			var touchEv = ev.originalEvent.changedTouches[0];
			var currentX = touchEv.clientX - startX;
			if (currentX < maxWidth) {
				dragInfo = [];
				// 鼠标松开时，如果没有达到最大距离位置，滑块就返回初始位置
				$that.handler.animate({
					left: 0
				}, 300);
				$that.dragBg.animate({
					width: 0
				}, 300);
			}
		}

		/**
		 * [markDrag 记录拖拽信息]
		 * @param  {[type]} info [拖拽信息]
		 */
		function markDrag(info) {
			if (isMove) {
				dragInfo.push(info);
			}
		}

		/**
		 * [dragOk 验证通过]
		 */
		function dragOk() {
			$that.dragBg.removeClass('fail');
			$that.handler.removeClass('verifyicon-fail').addClass('verifyicon-ok');
			$that.loading.css('display', 'none');
			$that.text.text('验证通过').css('color', '#fff');
			hideImgVerify();

			result.onSuccess();
		}

		/**
		 * [dragFail 移动到终点]
		 */
		function dragFail() {
			$that.dragBg.addClass('fail');
			$that.handler.addClass('verifyicon-fail');
			$that.loading.css('display', 'none');
			$that.text.text('验证失败').css('color', '#fff');
			showImgVerify();
			result.onError();
		}

		/**
		 * [dragDone 拖拽完成]
		 */
		function dragDone() {
			$that.handler.css({
				left: 'auto',
				right: 0
			});
			$that.text.text('');
			$that.loading.show();
			$that.dragBg.css('width', $that.width() - $that.handler.width());
			removeEvents();

			console.log('dragInfo', dragInfo);
			console.log('pageInfo', pageInfo);

			verifyDrag();
		}

		/**
		 * [verifyDrag 移除事件]
		 */
		function verifyDrag() {
			var dragInfoArr = parseTouch(dragInfo);
			// var encryDrag = encryptTouch(dragInfoArr);
			// var s = V(doubleEncrypt('M(*((1((M(('));
			// var s = V(doubleEncrypt(encryptTouch([])));
			// var g = Od();
			// var h = V(doubleEncrypt(g));
			// var hh = V(g);
			// var f = encryptedPageInfo();
			// var i = doubleEncrypt(f);
			// var hi = V(f);
			// var passtime = tool.now() - initTime;
			// var info = {
			//     type: "fullpage",
			//     gt: opts.gt,
			//     challenge: opts.challenge,
			//     t: encryDrag,
			//     light: doubleEncrypt(btnTarget),
			//     s: s,
			//     h: h,
			//     hh: hh,
			//     i: i,
			//     hi: hi,
			//     passtime: passtime
			// };
			// console.log(LZString.compress(encryptedPageInfo()));

			// Od().split('magic data').join()

			//var randomNum = Math.random();

			tool.jsonp(opts, [config.apiserver], opts.path.codeDrag, {
				start: dragInfo[0].t,
				end: dragInfo[dragInfo.length - 1].t,
				i: LZString.compress(encryptedPageInfo()),
				t: encryptTouch(dragInfoArr),
				gt: opts.gt,
				challenge: opts.challenge
			}, function(data) {
				if (data.code === '100') {
					result.validate = data.validate;
					dragOk();
				} else {
					dragFail();
				}
			});
		}

		/**
		 * [markClick 记录拖拽信息]
		 * @param  {[type]} info [拖拽信息]
		 */
		function markClick(info) {
			clickInfo.push(info);
			console.log('clickInfo', clickInfo);
		}

		/**
		 * [clickFail 点击验证失败]
		 */
		function clickFail() {
			$that.imgVerify.find('.loading').hide();
			$that.imgVerify.find('.mask-tip').show();
			setTimeout(function() {
				init();
			}, 2000);
			result.onError();
		}

		/**
		 * [appendIcon 插入点击icon]
		 */
		function appendIcon(ev) {
			return $(clickIcon).css({
				left: ev.offsetX - 10,
				top: ev.offsetY - 10
			}).appendTo($that.imgVerify);
		}

		/**
		 * [hideImgVerify 隐藏图片验证容器]
		 */
		function hideImgVerify() {
			$that.find('.img-verify').css('display', 'none');
		}

		/**
		 * [showImgVerify 显示验证图片]
		 */
		function showImgVerify() {
			// $that;
			$that.imgVerify = $that.find('.slide-verify').append(imgUtil.getImgTpl()).find('.img-verify');
			$that.text.text('验证失败，请点击图片中的「' + result.text + '」');
			var img = $that.imgVerify.find('img');

			$that.imgVerify.show();
			img.attr('src', img.data('url')).on('click', function(ev) {
				appendIcon(ev);
				markClick({
					t: tool.now(),
					x: ev.offsetX,
					y: ev.offsetY,
					e: 'click'
				});
				clickCount++;
				checkClickLimit();
			});
		}

		/**
		 * [checkClickLimit 判断点击次数]
		 * @return {[type]} [description]
		 */
		function checkClickLimit() {
			if (clickCount === opts.clickLimit) {
				$that.imgVerify.find('.v-mask').show().find('.loading').show();
				verifyClick();
			}
		}

		/**
		 * [removeEvents 移除事件]
		 */
		function removeEvents() {
			$that.handler.off('touchstart touchmove touchend mousedown mousemove mouseup');
		}

		/**
		 * [verifyClick 验证点击]
		 */
		function verifyClick() {
			tool.jsonp(opts, [config.apiserver], opts.path.codeImgVerfied, {
				x: clickInfo[0].x,
				y: clickInfo[0].y,
				challenge: opts.challenge,
				gt: opts.gt
			}, function(data) {
				if (data.code === '100') {
					result.validate = data.validate;
					dragOk();
				} else {
					clickFail();
				}
			});
		}

		return $that;
	}

	window.Fangcheck = fangcheck;


	var fromCharCode = String.fromCharCode;
	var LZString = {
		compress: function(uncompressed) {
			return LZString.baseCompress(uncompressed, 16, function(a) {
				return LZString.toChart16(fromCharCode(a));
			});
		},
		baseCompress: function(uncompressed, bitsPerChar, getCharFromInt) {
			if (uncompressed === null) return '';
			var i, value,
				contextDictionary = {},
				contextDictionaryToCreate = {},
				contextC = '',
				contextWc = '',
				contextW = '',
				// Compensate for the first entry which should not count
				contextEnlargeIn = 2,
				contextDictSize = 3,
				contextNumBits = 2,
				contextData = [],
				contextDataVal = 0,
				contextDataPosition = 0,
				ii;

			for (ii = 0; ii < uncompressed.length; ii += 1) {
				contextC = uncompressed.charAt(ii);
				if (!Object.prototype.hasOwnProperty.call(contextDictionary, contextC)) {
					contextDictionary[contextC] = contextDictSize++;
					contextDictionaryToCreate[contextC] = true;
				}

				contextWc = contextW + contextC;
				if (Object.prototype.hasOwnProperty.call(contextDictionary, contextWc)) {
					contextW = contextWc;
				} else {
					if (Object.prototype.hasOwnProperty.call(contextDictionaryToCreate, contextW)) {
						if (contextW.charCodeAt(0) < 256) {
							for (i = 0; i < contextNumBits; i++) {
								contextDataVal = (contextDataVal << 1);
								if (contextDataPosition == bitsPerChar - 1) {
									contextDataPosition = 0;
									contextData.push(getCharFromInt(contextDataVal));
									contextDataVal = 0;
								} else {
									contextDataPosition++;
								}
							}
							value = contextW.charCodeAt(0);
							for (i = 0; i < 8; i++) {
								contextDataVal = (contextDataVal << 1) | (value & 1);
								if (contextDataPosition == bitsPerChar - 1) {
									contextDataPosition = 0;
									contextData.push(getCharFromInt(contextDataVal));
									contextDataVal = 0;
								} else {
									contextDataPosition++;
								}
								value = value >> 1;
							}
						} else {
							value = 1;
							for (i = 0; i < contextNumBits; i++) {
								contextDataVal = (contextDataVal << 1) | value;
								if (contextDataPosition == bitsPerChar - 1) {
									contextDataPosition = 0;
									contextData.push(getCharFromInt(contextDataVal));
									contextDataVal = 0;
								} else {
									contextDataPosition++;
								}
								value = 0;
							}
							value = contextW.charCodeAt(0);
							for (i = 0; i < 16; i++) {
								contextDataVal = (contextDataVal << 1) | (value & 1);
								if (contextDataPosition == bitsPerChar - 1) {
									contextDataPosition = 0;
									contextData.push(getCharFromInt(contextDataVal));
									contextDataVal = 0;
								} else {
									contextDataPosition++;
								}
								value = value >> 1;
							}
						}
						contextEnlargeIn--;
						if (contextEnlargeIn == 0) {
							contextEnlargeIn = Math.pow(2, contextNumBits);
							contextNumBits++;
						}
						delete contextDictionaryToCreate[contextW];
					} else {
						value = contextDictionary[contextW];
						for (i = 0; i < contextNumBits; i++) {
							contextDataVal = (contextDataVal << 1) | (value & 1);
							if (contextDataPosition == bitsPerChar - 1) {
								contextDataPosition = 0;
								contextData.push(getCharFromInt(contextDataVal));
								contextDataVal = 0;
							} else {
								contextDataPosition++;
							}
							value = value >> 1;
						}


					}
					contextEnlargeIn--;
					if (contextEnlargeIn == 0) {
						contextEnlargeIn = Math.pow(2, contextNumBits);
						contextNumBits++;
					}
					// Add wc to the dictionary.
					contextDictionary[contextWc] = contextDictSize++;
					contextW = String(contextC);
				}
			}

			// Output the code for w.
			if (contextW !== '') {
				if (Object.prototype.hasOwnProperty.call(contextDictionaryToCreate, contextW)) {
					if (contextW.charCodeAt(0) < 256) {
						for (i = 0; i < contextNumBits; i++) {
							contextDataVal = (contextDataVal << 1);
							if (contextDataPosition == bitsPerChar - 1) {
								contextDataPosition = 0;
								contextData.push(getCharFromInt(contextDataVal));
								contextDataVal = 0;
							} else {
								contextDataPosition++;
							}
						}
						value = contextW.charCodeAt(0);
						for (i = 0; i < 8; i++) {
							contextDataVal = (contextDataVal << 1) | (value & 1);
							if (contextDataPosition == bitsPerChar - 1) {
								contextDataPosition = 0;
								contextData.push(getCharFromInt(contextDataVal));
								contextDataVal = 0;
							} else {
								contextDataPosition++;
							}
							value = value >> 1;
						}
					} else {
						value = 1;
						for (i = 0; i < contextNumBits; i++) {
							contextDataVal = (contextDataVal << 1) | value;
							if (contextDataPosition == bitsPerChar - 1) {
								contextDataPosition = 0;
								contextData.push(getCharFromInt(contextDataVal));
								contextDataVal = 0;
							} else {
								contextDataPosition++;
							}
							value = 0;
						}
						value = contextW.charCodeAt(0);
						for (i = 0; i < 16; i++) {
							contextDataVal = (contextDataVal << 1) | (value & 1);
							if (contextDataPosition == bitsPerChar - 1) {
								contextDataPosition = 0;
								contextData.push(getCharFromInt(contextDataVal));
								contextDataVal = 0;
							} else {
								contextDataPosition++;
							}
							value = value >> 1;
						}
					}
					contextEnlargeIn--;
					if (contextEnlargeIn == 0) {
						contextEnlargeIn = Math.pow(2, contextNumBits);
						contextNumBits++;
					}
					delete contextDictionaryToCreate[contextW];
				} else {
					value = contextDictionary[contextW];
					for (i = 0; i < contextNumBits; i++) {
						contextDataVal = (contextDataVal << 1) | (value & 1);
						if (contextDataPosition == bitsPerChar - 1) {
							contextDataPosition = 0;
							contextData.push(getCharFromInt(contextDataVal));
							contextDataVal = 0;
						} else {
							contextDataPosition++;
						}
						value = value >> 1;
					}


				}
				contextEnlargeIn--;
				if (contextEnlargeIn == 0) {
					contextEnlargeIn = Math.pow(2, contextNumBits);
					contextNumBits++;
				}
			}

			// Mark the end of the stream
			value = 2;
			for (i = 0; i < contextNumBits; i++) {
				contextDataVal = (contextDataVal << 1) | (value & 1);
				if (contextDataPosition == bitsPerChar - 1) {
					contextDataPosition = 0;
					contextData.push(getCharFromInt(contextDataVal));
					contextDataVal = 0;
				} else {
					contextDataPosition++;
				}
				value = value >> 1;
			}
			// Flush the last char
			while (true) {
				contextDataVal = (contextDataVal << 1);
				if (contextDataPosition == bitsPerChar - 1) {
					contextData.push(getCharFromInt(contextDataVal));
					break;
				} else contextDataPosition++;
			}
			return contextData.join('');
		},
		toChart16: function(str) {
			var string = '',
				strLen = str.length;
			for (var i = 0; i < strLen; i++) {
				var item = str.charCodeAt(i).toString(16),
					len = item.length;
				if (len < 4) {
					var n = 4 - len;
					var itemS = '';
					for (var j = 0; j < n; j++) {
						itemS += '0';
					}
					item = itemS + item;
				} else if (len > 4) {
					console.log('More than four', item);
				}
				string += item;
			}
			return string;
		}
	};

	var limit = 300;

	function parseTouch(route) {
		var clickX = 0,
			clickY = 0,
			d = 0,
			e = 0,
			eventTime = 0,
			arr = [],
			i = this;
		if (route.length <= 0)
			return [];
		for (var routeLen = route.length, index = routeLen < limit ? 0 : routeLen - limit; index < routeLen; index += 1) {
			var routeItem = route[index],
				eventType = routeItem.e;
			if ("scroll" === eventType) {
				arr.push(
					[eventType, [routeItem.x - d, routeItem.y - e],
						roundNum(eventTime ? routeItem.t - eventTime : 0)
					],
					d = routeItem.x,
					e = routeItem.y,
					eventTime = routeItem.t
				)
			} else {
				if (["touchstart", "touchmove", "touchend"].indexOf(eventType) > -1) {
					(arr.push([eventType, [routeItem.x - clickX, routeItem.y - clickY], roundNum(eventTime ? routeItem.t - eventTime : 0)]),
						clickX = routeItem.x,
						clickY = routeItem.y,
						eventTime = routeItem.t)
				} else {
					if (["blur", "focus", "unload"].indexOf(eventType) > -1) {
						(arr.push([eventType, roundNum(eventTime ? routeItem.x - eventTime : 0)]),
							eventTime = routeItem.x)
					}
				}

			}
		}
		return arr
	}

	function roundNum(a) {
		if ("number" != typeof a) {
			return a
		} else {
			if (a > 32767) {
				return a = 32767
			} else {
				if (a < -32767) {
					return a = -32767
				} else {
					return Math.round(a)
				}
			}
		}
	}


	function encryptTouch(dragInfoArr) {
		function c(b) {
			for (var c = "", d = b.length / 6, e = 0; e < d; e += 1)
				c += j.charAt(window.parseInt(b.slice(6 * e, 6 * (e + 1)), 2));
			return c
		}

		function d(a, b) {
			for (var c = a.toString(2), d = c.length, e = "", f = d + 1; f <= b; f += 1)
				e += "0";
			return c = e + c
		}

		function e(a, b) {
			for (var c = [], d = 0, e = a.length; d < e; d += 1)
				c.push(b(a[d]));
			return c
		}

		function f(arr, b) {
			var c = [];
			return e(arr, function(a) {
					b(a) && c.push(a)
				}),
				c
		}

		function g(a) {
			a = e(a, function(a) {
				return a > 32767 ? 32767 : a < -32767 ? -32767 : a
			});
			for (var b = a.length, c = 0, d = []; c < b;) {
				for (var f = 1, g = a[c], h = Math.abs(g);;) {
					if (c + f >= b)
						break;
					if (a[c + f] !== g)
						break;
					if (h >= 127 || f >= 127)
						break;
					f += 1
				}
				f > 1 ? d.push((g < 0 ? 49152 : 32768) | f << 7 | h) : d.push(g),
					c += f
			}
			return d
		}

		function h(a, b) {
			return 0 === a ? 0 : Math.log(a) / Math.log(b)
		}

		function i(a, b) {
			var arr = g(a);
			var c, i = [],
				j = [];
			e(arr, function(a) {
				var b = Math.ceil(h(Math.abs(a) + 1, 16));
				0 === b && (b = 1),
					i.push(d(b - 1, 2)),
					j.push(d(Math.abs(a), 4 * b))
			});
			var k = i.join(""),
				l = j.join("");
			return c = b ? e(f(arr, function(a) {
					return 0 != a && a >> 15 != 1
				}), function(a) {
					return a < 0 ? "1" : "0"
				}).join("") : "",
				d(32768 | arr.length, 16) + k + l + c
		}
		var j = "()*,-./0123456789:?@ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz~",
			k = {
				touchmove: 0,
				touchstart: 1,
				touchend: 2,
				scroll: 3,
				focus: 4,
				blur: 5,
				unload: 6,
				unknown: 7
			},
			l = function(a) {
				for (var b = [], c = a.length, e = 0; e < c;) {
					for (var f = a[e], g = 0;;) {
						if (g >= 16)
							break;
						var h = e + g + 1;
						if (h >= c)
							break;
						if (a[h] !== f)
							break;
						g += 1
					}
					e = e + 1 + g;
					var i = k[f];
					// 
					0 != g ? (b.push(8 | i),
						b.push(g - 1)) : b.push(i)
				}
				// d函数作用补全位数 
				for (var j = d(32768 | c, 16), l = "", m = 0, n = b.length; m < n; m += 1)
					l += d(b[m], 4);
				return j + l
			};
		return function(dragInfoArr) {
			for (var touchType = [], touchTime = [], touchPointX = [], touchPointY = [], h = 0, j = dragInfoArr.length; h < j; h += 1) {
				var k = dragInfoArr[h],
					m = k.length;
				touchType.push(k[0]),
					touchTime.push(2 === m ? k[1] : k[2]),
					3 === m && (touchPointX.push(k[1][0]),
						touchPointY.push(k[1][1]))
			}
			var n = l(touchType),
				o = i(touchTime, !1),
				p = i(touchPointX, !0),
				q = i(touchPointY, !0),
				r = n + o + p + q,
				s = r.length;
			return s % 6 != 0 && (r += d(0, 6 - s % 6)),
				c(r)
		}(dragInfoArr)
	}

	function doubleEncrypt(a) {
		var c = bbe(bYd(a));
		return c.res + c.end
	}

	function bYd(a) {
		for (var b = [], c = 0, d = a.length; c < d; c += 1)
			b.push(a.charCodeAt(c));
		return b
	}

	function bbe(a, b) {
		var c = this;
		b || (b = c);
		var b = {
			Sd: ".",
			Td: 7274496,
			Ud: 9483264,
			Vd: 19220,
			Wd: 235,
			Xd: 24
		}
		for (var d = function(a, d) {
				for (var e = 0, f = b.Xd - 1; f >= 0; f -= 1)
					1 === cae(d, f) && (e = (e << 1) + cae(a, f));
				return e
			}, e = "", f = "", g = a.length, h = 0; h < g; h += 3) {
			var i;
			if (h + 2 < g)
				i = (a[h] << 16) + (a[h + 1] << 8) + a[h + 2],
				e += $d(d(i, b.Td)) + $d(d(i, b.Ud)) + $d(d(i, b.Vd)) + $d(d(i, b.Wd));
			else {
				var j = g % 3;
				2 === j ? (i = (a[h] << 16) + (a[h + 1] << 8),
					e += $d(d(i, b.Td)) + $d(d(i, b.Ud)) + $d(d(i, b.Vd)),
					f = b.Sd) : 1 === j && (i = a[h] << 16,
					e += $d(d(i, b.Td)) + $d(d(i, b.Ud)),
					f = b.Sd + b.Sd)
			}
		}
		return {
			res: e,
			end: f
		}
	}

	function cae(a, b) {
		return a >> b & 1
	}

	function $d(a) {
		var b = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789()";
		return a < 0 || a >= b.length ? "." : b.charAt(a)
	}

	function V(a) {
		function b(a, b) {
			return a << b | a >>> 32 - b
		}

		function c(a, b) {
			var c, d, e, f, g;
			return e = 2147483648 & a,
				f = 2147483648 & b,
				c = 1073741824 & a,
				d = 1073741824 & b,
				g = (1073741823 & a) + (1073741823 & b),
				c & d ? 2147483648 ^ g ^ e ^ f : c | d ? 1073741824 & g ? 3221225472 ^ g ^ e ^ f : 1073741824 ^ g ^ e ^ f : g ^ e ^ f
		}

		function d(a, b, c) {
			return a & b | ~a & c
		}

		function e(a, b, c) {
			return a & c | b & ~c
		}

		function f(a, b, c) {
			return a ^ b ^ c
		}

		function g(a, b, c) {
			return b ^ (a | ~c)
		}

		function h(a, e, f, g, h, i, j) {
			return a = c(a, c(c(d(e, f, g), h), j)),
				c(b(a, i), e)
		}

		function i(a, d, f, g, h, i, j) {
			return a = c(a, c(c(e(d, f, g), h), j)),
				c(b(a, i), d)
		}

		function j(a, d, e, g, h, i, j) {
			return a = c(a, c(c(f(d, e, g), h), j)),
				c(b(a, i), d)
		}

		function k(a, d, e, f, h, i, j) {
			return a = c(a, c(c(g(d, e, f), h), j)),
				c(b(a, i), d)
		}

		function l(a) {
			var b, c, d = "",
				e = "";
			for (c = 0; c <= 3; c++)
				b = a >>> 8 * c & 255,
				e = "0" + b.toString(16),
				d += e.substr(e.length - 2, 2);
			return d
		}
		var m, n, o, p, q, r, s, t, u, v = [];
		for (a = function(a) {
				a = a.replace(/\r\n/g, "\n");
				for (var b = "", c = 0; c < a.length; c++) {
					var d = a.charCodeAt(c);
					d < 128 ? b += String.fromCharCode(d) : d > 127 && d < 2048 ? (b += String.fromCharCode(d >> 6 | 192),
						b += String.fromCharCode(63 & d | 128)) : (b += String.fromCharCode(d >> 12 | 224),
						b += String.fromCharCode(d >> 6 & 63 | 128),
						b += String.fromCharCode(63 & d | 128))
				}
				return b
			}(a),
			v = function(a) {
				for (var b, c = a.length, d = c + 8, e = (d - d % 64) / 64, f = 16 * (e + 1), g = Array(f - 1), h = 0, i = 0; i < c;)
					b = (i - i % 4) / 4,
					h = i % 4 * 8,
					g[b] = g[b] | a.charCodeAt(i) << h,
					i++;
				return b = (i - i % 4) / 4,
					h = i % 4 * 8,
					g[b] = g[b] | 128 << h,
					g[f - 2] = c << 3,
					g[f - 1] = c >>> 29,
					g
			}(a),
			r = 1732584193,
			s = 4023233417,
			t = 2562383102,
			u = 271733878,
			m = 0; m < v.length; m += 16)
			n = r,
			o = s,
			p = t,
			q = u,
			r = h(r, s, t, u, v[m + 0], 7, 3614090360),
			u = h(u, r, s, t, v[m + 1], 12, 3905402710),
			t = h(t, u, r, s, v[m + 2], 17, 606105819),
			s = h(s, t, u, r, v[m + 3], 22, 3250441966),
			r = h(r, s, t, u, v[m + 4], 7, 4118548399),
			u = h(u, r, s, t, v[m + 5], 12, 1200080426),
			t = h(t, u, r, s, v[m + 6], 17, 2821735955),
			s = h(s, t, u, r, v[m + 7], 22, 4249261313),
			r = h(r, s, t, u, v[m + 8], 7, 1770035416),
			u = h(u, r, s, t, v[m + 9], 12, 2336552879),
			t = h(t, u, r, s, v[m + 10], 17, 4294925233),
			s = h(s, t, u, r, v[m + 11], 22, 2304563134),
			r = h(r, s, t, u, v[m + 12], 7, 1804603682),
			u = h(u, r, s, t, v[m + 13], 12, 4254626195),
			t = h(t, u, r, s, v[m + 14], 17, 2792965006),
			s = h(s, t, u, r, v[m + 15], 22, 1236535329),
			r = i(r, s, t, u, v[m + 1], 5, 4129170786),
			u = i(u, r, s, t, v[m + 6], 9, 3225465664),
			t = i(t, u, r, s, v[m + 11], 14, 643717713),
			s = i(s, t, u, r, v[m + 0], 20, 3921069994),
			r = i(r, s, t, u, v[m + 5], 5, 3593408605),
			u = i(u, r, s, t, v[m + 10], 9, 38016083),
			t = i(t, u, r, s, v[m + 15], 14, 3634488961),
			s = i(s, t, u, r, v[m + 4], 20, 3889429448),
			r = i(r, s, t, u, v[m + 9], 5, 568446438),
			u = i(u, r, s, t, v[m + 14], 9, 3275163606),
			t = i(t, u, r, s, v[m + 3], 14, 4107603335),
			s = i(s, t, u, r, v[m + 8], 20, 1163531501),
			r = i(r, s, t, u, v[m + 13], 5, 2850285829),
			u = i(u, r, s, t, v[m + 2], 9, 4243563512),
			t = i(t, u, r, s, v[m + 7], 14, 1735328473),
			s = i(s, t, u, r, v[m + 12], 20, 2368359562),
			r = j(r, s, t, u, v[m + 5], 4, 4294588738),
			u = j(u, r, s, t, v[m + 8], 11, 2272392833),
			t = j(t, u, r, s, v[m + 11], 16, 1839030562),
			s = j(s, t, u, r, v[m + 14], 23, 4259657740),
			r = j(r, s, t, u, v[m + 1], 4, 2763975236),
			u = j(u, r, s, t, v[m + 4], 11, 1272893353),
			t = j(t, u, r, s, v[m + 7], 16, 4139469664),
			s = j(s, t, u, r, v[m + 10], 23, 3200236656),
			r = j(r, s, t, u, v[m + 13], 4, 681279174),
			u = j(u, r, s, t, v[m + 0], 11, 3936430074),
			t = j(t, u, r, s, v[m + 3], 16, 3572445317),
			s = j(s, t, u, r, v[m + 6], 23, 76029189),
			r = j(r, s, t, u, v[m + 9], 4, 3654602809),
			u = j(u, r, s, t, v[m + 12], 11, 3873151461),
			t = j(t, u, r, s, v[m + 15], 16, 530742520),
			s = j(s, t, u, r, v[m + 2], 23, 3299628645),
			r = k(r, s, t, u, v[m + 0], 6, 4096336452),
			u = k(u, r, s, t, v[m + 7], 10, 1126891415),
			t = k(t, u, r, s, v[m + 14], 15, 2878612391),
			s = k(s, t, u, r, v[m + 5], 21, 4237533241),
			r = k(r, s, t, u, v[m + 12], 6, 1700485571),
			u = k(u, r, s, t, v[m + 3], 10, 2399980690),
			t = k(t, u, r, s, v[m + 10], 15, 4293915773),
			s = k(s, t, u, r, v[m + 1], 21, 2240044497),
			r = k(r, s, t, u, v[m + 8], 6, 1873313359),
			u = k(u, r, s, t, v[m + 15], 10, 4264355552),
			t = k(t, u, r, s, v[m + 6], 15, 2734768916),
			s = k(s, t, u, r, v[m + 13], 21, 1309151649),
			r = k(r, s, t, u, v[m + 4], 6, 4149444226),
			u = k(u, r, s, t, v[m + 11], 10, 3174756917),
			t = k(t, u, r, s, v[m + 2], 15, 718787259),
			s = k(s, t, u, r, v[m + 9], 21, 3951481745),
			r = c(r, n),
			s = c(s, o),
			t = c(t, p),
			u = c(u, q);
		return (l(r) + l(s) + l(t) + l(u)).toLowerCase()
	}

	var Bd = ["A", "ARTICLE", "ASIDE", "AUDIO", "BASE", "BUTTON", "CANVAS", "CODE", "IFRAME", "IMG", "INPUT", "LABEL", "LINK", "NAV", "OBJECT", "OL", "PICTURE", "PRE", "SECTION", "SELECT", "SOURCE", "SPAN", "STYLE", "TABLE", "TEXTAREA", "VIDEO"];

	function Cd() {
		return ["textLength", "HTMLLength", "documentMode"].concat(this.Bd).concat(["screenLeft", "screenTop", "screenAvailLeft", "screenAvailTop", "innerWidth", "innerHeight", "outerWidth", "outerHeight", "browserLanguage", "browserLanguages", "systemLanguage", "devicePixelRatio", "colorDepth", "userAgent", "cookieEnabled", "netEnabled", "screenWidth", "screenHeight", "screenAvailWidth", "screenAvailHeight", "localStorageEnabled", "sessionStorageEnabled", "indexedDBEnabled", "CPUClass", "platform", "doNotTrack", "timezone", "canvas2DFP", "canvas3DFP", "plugins", "maxTouchPoints", "flashEnabled", "javaEnabled", "hardwareConcurrency", "jsFonts", "timestamp", "performanceTiming"])
	};


	function Od(a, b) {
		var c = this,
			d = vd(),
			e = [];
		Cd().map(function(a) {
			var b = d[a];
			e.push(b == undefined ? -1 : b)
		});
		return e.join("magic data")
	}

	function vd() {
		var b = window,
			c = b.screen,
			d = b.document,
			e = b.navigator,
			g = d.documentElement,
			h = d.body,
			i = h.nodeType,
			j = this,
			k = {};
		var tagList = ["A", "ARTICLE", "ASIDE", "AUDIO", "BASE", "BUTTON", "CANVAS", "CODE", "IFRAME", "IMG", "INPUT", "LABEL", "LINK", "NAV", "OBJECT", "OL", "PICTURE", "PRE", "SECTION", "SELECT", "SOURCE", "SPAN", "STYLE", "TABLE", "TEXTAREA", "VIDEO"];
		var bodyNodeType = document.body.nodeType;
		var l = function(doc) {
			if (doc) {
				var nodeType = doc.nodeType,
					tagName = doc.nodeName.toUpperCase();
				if (nodeType === bodyNodeType) {
					if (tagList.indexOf(tagName) > -1) {
						if (k[tagName]) {
							k[tagName] += 1;
						} else {
							k[tagName] = 1;
						}
					}
				}
				for (var nodes = doc.childNodes, e = 0, nodeLen = nodes.length; e < nodeLen; e++) {
					l(nodes[e])
				}
			}
		};
		l(d);
		var m = g.textContent || g.innerText;
		k.textLength = m.length;
		var n = g.innerHTML;
		return k.HTMLLength = n.length,
			k.documentMode = d.documentMode || d.compatMode,
			k.browserLanguage = e.language || e.userLanguage,
			k.browserLanguages = e.languages && e.languages.join(","),
			k.systemLanguage = b.systemLanguage,
			k.devicePixelRatio = b.devicePixelRatio,
			k.colorDepth = c.colorDepth,
			k.userAgent = e.userAgent,
			k.cookieEnabled = (e.cookieEnabled) ? 1 : 0,
			k.netEnabled = (e.onLine) ? 1 : 0,
			k.innerWidth = b.innerWidth,
			k.innerHeight = b.innerHeight,
			k.outerWidth = b.outerWidth,
			k.outerHeight = b.outerHeight,
			k.screenWidth = c.width,
			k.screenHeight = c.height,
			k.screenAvailWidth = c.availWidth,
			k.screenAvailHeight = c.availHeight,
			k.screenLeft = c.left || b.screenLeft,
			k.screenTop = c.top || b.screenTop,
			k.screenAvailLeft = c.availLeft,
			k.screenAvailTop = c.availTop,
			k.localStorageEnabled = (b.localStorage) ? 1 : 0,
			k.sessionStorageEnabled = (b.sessionStorage) ? 1 : 0,
			k.indexedDBEnabled = (b.indexedDB) ? 1 : 0,
			k.CPUClass = e.cpuClass,
			k.platform = e.platform,
			k.doNotTrack = (e.doNotTrack) ? 1 : 0,
			k.timezone = (new Date).getTimezoneOffset() / 60,
			k.plugins = function() {
				if (!e.plugins)
					return jwd;
				for (var a = [], b = 0, c = e.plugins.length; b < c; b += 1) {
					var d = e.plugins[b];
					a.push(d.name.replace(/\s/g, "")),
						a.push(d.filename.replace(/\s/g, ""))
				}
				return a.join(",")
			}(),
			k.maxTouchPoints = function() {
				return jAd(e.maxTouchPoints) ? jAd(e.msMaxTouchPoints) ? 0 : e.msMaxTouchPoints : e.maxTouchPoints
			}(),
			k.flashEnabled = function() {
				return jAd(b.swfobject) ? jwd : jzd(b.swfobject.hasFlashPlayerVersion("9.0.0"))
			}(),
			k.javaEnabled = function() {
				try {
					return jAd(e.javaEnabled) ? jwd : jzd(e.javaEnabled())
				} catch (a) {
					return jwd
				}
			}(),
			k.hardwareConcurrency = e.hardwareConcurrency,
			k
	}

	function jAd(a) {
		return void 0 === a
	}

	var jwd = -1,
		jxd = 1,
		jyd = 0;

	function encryptedPageInfo() {
		var b = window,
			c = this,
			d = vd();
		d.performanceTiming = function() {
				if (jAd(b.performance))
					return c.wd;
				var a, d, e = b.performance.timing,
					f = ["navigationStart", "redirectStart", "redirectEnd", "fetchStart", "domainLookupStart", "domainLookupEnd", "connectStart", "connectEnd", "requestStart", "responseStart"],
					g = ["responseEnd", "unloadEventStart", "unloadEventEnd", "domLoading", "domInteractive", "domContentLoadedEventStart", "domContentLoadedEventEnd", "domComplete", "loadEventStart", "loadEventEnd", "msFirstPaint"],
					h = [];
				for (a = 1,
					d = f.length; a < d; a += 1) {
					var i = e[f[a]];
					if (0 === i)
						h.push(c.wd);
					else
						for (var j = a - 1; j >= 0; j -= 1) {
							var k = e[f[j]];
							if (0 !== k) {
								h.push(i - k);
								break
							}
						}
				}
				var l = e[f[f.length - 1]];
				for (a = 0,
					d = g.length; a < d; a += 1) {
					var m = e[g[a]];
					0 === m || jAd(m) ? h.push(c.wd) : h.push(m - l)
				}
				return h.join(",")
			}(),
			d.timestamp = (new Date).getTime();
		var e = [];
		Cd().map(function(a) {
			var b = d[a];
			e.push(b == undefined ? -1 : b)
		});
		return encodeURIComponent(e.join("!!"))
	}
})(this, jQuery)