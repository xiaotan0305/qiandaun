!function(a,n){a.fCheck.init({container:".drag-content",url:"/act/?c=recaptcha&a=index",callback:function(){console.log("\u9a8c\u8bc1\u6210\u529f")}}),n(".btn").on("click",function(){var a=n("input[name=username]");if(""===a.val())return alert("\u8bf7\u8f93\u5165\u7528\u6237\u540d"),!1;var e=n("input[name=password]");if(""===e.val())return alert("\u8bf7\u8f93\u5165\u5bc6\u7801"),!1;var r=n("input[name=password2]");if(""===r.val())return alert("\u8bf7\u8f93\u5165\u786e\u8ba4\u5bc6\u7801"),!1;if(e.val()!=r.val())return alert("\u4e24\u6b21\u8f93\u5165\u7684\u5bc6\u7801\u4e0d\u4e00\u81f4\uff0c\u8bf7\u91cd\u65b0\u8f93\u5165"),!1;if(null===fCheck.config.result)return alert("\u9a8c\u8bc1\u7801\u9519\u8bef"),!1;var t=n.extend({username:a.val(),password:e.val()},fCheck.config.result);n.post("/act/?c=recaptcha&a=login",t,function(a,n,e){"100"===a.code?alert("\u9a8c\u8bc1\u901a\u8fc7\uff0c\u4f60\u7684\u6ce8\u518c\u8d44\u6599\u5df2\u63d0\u4ea4\u6210\u529f\uff01"):alert("\u9a8c\u8bc1\u672a\u901a\u8fc7\uff0c\u4f60\u7684\u6ce8\u518c\u8d44\u6599\u63d0\u4ea4\u5931\u8d25\uff01")})})}(this,jQuery);