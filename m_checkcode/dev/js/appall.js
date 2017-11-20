(function(window, $) {

	/**
	 * [fCheck 验证控制调用示例]
	 * @type {Object}
	 */
	var fCheck = {

		/**
		 * [init 调用初始化接口]
		 * @param  {Function} callback [description]
		 * @return {[type]}            [description]
		 */
		init: function(selector, url) {
			var that = this;
			that.config = {url:url};
			if (!that.target) {
				that.target = $(selector);
			}
			that.getData();
			return this;
		},

		/**
		 * 获取初始化数据
		 * @return {undefined}     无返回值
		 */
		getData: function() {
			var that = this;
			that.target.off('click');
			var success = function(data) {
				$.isPlainObject(data) && '100' === data.code ? this.buildAsync(data) : that.error();
			};
			var fail = function() {
				that.error();
			};
			$.ajax(that.config.url, {
				type: "post",
				dataType: "json",
				timeout: 5e3,
				success: $.proxy(success, that),
				error: $.proxy(fail, that)
			})
		},

		/**
		 * [build description]
		 * @param  {[type]} data [description]
		 * @return {[type]}      [description]
		 */
		build: function(data) {
			var that = this;
			that.config.result = null;
			var config = {
				gt: data.gt,
				challenge: data.challenge,
			};

			// 调用防刷控件方法
			window.initFangcheck(config, function(plugin) {
				//将验证控件添加到页面容器中。
				plugin.appendTo(that.target);
				plugin.onSuccess(function() {
					// 验证通过后自动将结果返回
					// 在表单提交时，需要将结果一并提交，用于后台验证。
					that.config.result = that.plugin.getValidate();
					//console.log(that.config.result);
				}),
				plugin.onError(function() {
					// 验证不通过，则将结果置为null
					that.config.result = null
				}),
				that.plugin = plugin;
			})
		},

		/**
		 * [buildAsync 加载初始化方法]
		 * @param  {[type]} data [description]
		 * @return {[type]}      [description]
		 */
		buildAsync: function(data) {
			var t = this,
				protocol = location.protocol;
			$.ajax({type: 'GET', url: "//static.test.soufunimg.com/common_m/m_checkcode/dev/js/fc.js", dataType: 'script', ifModified: true, cache: true, success: function() {
				t.build(data)
			}});
		},

		/**
		 * [error 初始化接口调用失败处理]
		 * @return {[type]} [description]
		 */
		error: function() {
			var that = this;
			that.target.html('获取验证失败，点击重新获取');
			that.target.on('click', function() {
				that.getData();
			});
		}
	};
	
	window.fCheck = fCheck;
})(this, jQuery);

(function(window, $) {

	// 调用验证控件，
	window.fCheck.init('.drag-content',"/act/?c=checkcode&a=index");

	/**
	 * 表单提交
	 */
	$('.btn').on('click', function() {
		var username = $('input[name=username]');
		if (username.val() === ''){
			alert('请输入用户名');
			return false;
		}
		var password = $('input[name=password]');
		if (password.val() === ''){
			alert('请输入密码');
			return false;
		}
		// 判断是否操作了验证组件。
		if (fCheck.config.result === null){
			alert('验证码错误');
			return false;
		}
		var data = $.extend({username: username.val(), password: password.val()}, fCheck.config.result);
		$.post('/act/?c=checkcode&a=login', data, function(data, textStatus, xhr) {
			if (data.code === '100') {
				alert('验证通过，提交成功！')
			}
		});
	});

})(this, jQuery);