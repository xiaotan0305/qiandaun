!function(t,i){var n={init:function(t){var n=this;return n.config=t,n.target||(n.target=i(t.container),n.target.css("height","34px").html("\u6b63\u5728\u52a0\u8f7d\u9a8c\u8bc1\u7801...")),n.reinit(),this},reinit:function(){var t=this;t.target.off("click");i.ajax(t.config.url,{type:"post",dataType:"json",timeout:5e3,cache:!1,success:i.proxy(function(n){i.isPlainObject(n)&&"100"===n.code?this.buildAsync(n):t.error()},t),error:i.proxy(function(){t.error()},t)})},build:function(i){var n=this;n.config.result=null;var c={gt:i.gt,challenge:i.challenge,imgWidth:n.config.width,imgHeight:n.config.height};t.initFangcheck(c,function(t){t.appendTo(n.target),t.onSuccess(function(){n.config.result=n.plugin.getValidate(),n.config.callback&&n.config.callback(n.config.result)}),t.onError(function(){n.config.result=null}),n.plugin=t})},buildAsync:function(t){var n=this;location.protocol;i.ajax({type:"GET",url:"//static."+(-1!==location.href.indexOf(".test.")?"test.":"")+"soufunimg.com/common_m/m_recaptcha/js/fc.js",dataType:"script",ifModified:!0,cache:!0,success:function(){n.build(t)}})},error:function(){var t=this;t.target.html("\u52aa\u529b\u52a0\u8f7d\u4e2d..."),t.reinit()}};t.fCheck=n}(this,jQuery);