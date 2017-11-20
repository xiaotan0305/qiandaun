(function(window, $) {

	/**
	 * [fCheck 验证控制调用示例]
	 * @type {Object}
	 */
	var fCheck = {

		/**
		 * [init 调用初始化接口]
		 * @param  {Object} options [selector, url, width, height, callback]
		 * @return {[type]}            [description]
		 */
		init: function(options) {
			var that = this;
			that.config = options;
			if (!that.target) {
				that.target = $(options.container);
			}
			that.reinit();
			that.loadFc();
			return this;
		},

		/**
		 * 获取初始化数据
		 * @return {undefined}     无返回值
		 */
		reinit: function() {
			var that = this;
			var style = '<style type="text/css">.cssload-container {position: relative;width: 100%;height: 34px;text-align: center;}.cssload-speeding-wheel {width: 34px;height: 34px;margin: 0 auto;border: 3px solid #999;border-radius: 50%;border-left-color: transparent;border-right-color: transparent;animation: cssload-spin 575ms infinite linear;-o-animation: cssload-spin 575ms infinite linear;-ms-animation: cssload-spin 575ms infinite linear;-webkit-animation: cssload-spin 575ms infinite linear;-moz-animation: cssload-spin 575ms infinite linear;}@keyframes cssload-spin {100%{ transform: rotate(360deg); transform: rotate(360deg);}}@-o-keyframes cssload-spin {100%{ -o-transform: rotate(360deg); transform: rotate(360deg); }}@-ms-keyframes cssload-spin {100%{ -ms-transform: rotate(360deg); transform: rotate(360deg); }}@-webkit-keyframes cssload-spin {100%{ -webkit-transform: rotate(360deg); transform: rotate(360deg); }}@-moz-keyframes cssload-spin {100%{ -moz-transform: rotate(360deg); transform: rotate(360deg); }}.cssload-text{position: absolute;top: 0;left: 0;z-index: 1;width: 100%;text-align: center;line-height:34px;}</style>';
			that.target.html(style + '<div><div class="cssload-container"><div class="cssload-speeding-wheel"></div><div class="cssload-text">加载中...</div></div></div>').css('height', '34px');

			that.data = null;
			that.retryTimes = 0;
			that.getData();
		},

		/**
		 * 通过调用初始化接口，获取配置数据
		 * @return {undefined}     无返回值
		 */
		getData: function() {
			var that = this;
			$.ajax(that.config.url, {
				type: "post",
				dataType: "json",
				timeout: 5e3,
				cache: false,
				success: function(data) {
					if ($.isPlainObject(data) && '100' === data.code) {
						that.data = data;
						that.build()
					} else {
						that.error();
					}
				},
				error: function() {
					that.error();
				}
			});
		},

		/**
		 * [build description]
		 * @param  {[type]} data [description]
		 * @return {[type]}      [description]
		 */
		build: function() {
			var that = this;
			that.config.result = null;
			// 调用防刷控件方法
			if (typeof window.initFangcheck === "function" && that.data) {
				var config = {
					gt: that.data.gt,
					challenge: that.data.challenge,
					imgWidth: that.config.width,
					imgHeight: that.config.height
				};
				window.initFangcheck(config, function(plugin) {
					//将验证控件添加到页面容器中。
					plugin.appendTo(that.target);
					plugin.onSuccess(function() {
							// 验证通过后自动将结果返回
							// 在表单提交时，需要将结果一并提交，用于后台验证。
							that.config.result = that.plugin.getValidate();
							that.config.callback && that.config.callback(that.config.result);
							//console.log(that.config.result);
						}),
						plugin.onError(function() {
							// 验证不通过，则将结果置为null
							that.config.result = null
						}),
						that.plugin = plugin;
				});
			}

		},

		/**
		 * [buildAsync 加载初始化方法]
		 * @param  {[type]} data [description]
		 * @return {[type]}      [description]
		 */
		loadFc: function() {
			var t = this,
				protocol = location.protocol;
			$.ajax({
				type: 'GET',
				url: (location.href.indexOf('.test.') !== -1 ? "http://static.test." : "https://static.") + "soufunimg.com/common_m/m_recaptcha/js/fc.js",
				dataType: 'script',
				ifModified: true,
				cache: true,
				async: true,
				success: function() {
					t.build()
				}
			});
		},

		/**
		 * [error 初始化接口调用失败处理]
		 * @return {[type]} [description]
		 */
		error: function() {
			var that = this;
			if (that.retryTimes++ < 5) {
				that.getData();
			} else {
				setTimeout(function(){
					that.getData();
				}, 5000)
			}
		}
	};

	window.fCheck = fCheck;
})(window, jQuery);