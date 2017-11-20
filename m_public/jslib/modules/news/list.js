/**
 * Created by LXM on 14-12-9.
 */
define("modules/news/list",["jquery"],function (require, exports, module) {
    "use strict";
    module.exports = function (options) {
        var $ = require("jquery"),preload=[];
        var vars = seajs.data.vars;
        $("input[type=hidden]").each(function (index, element) {
            vars[$(this).attr('data-id')] = element.value;
        });
        preload.push("touchslide/1.0/touchslide","modules/news/slideBox.js","swipe/2.0/swipe","modules/news/ad.js");
        require.async(preload);
        var j= 1;
        $('#moreLoad').click(function(){
            var p = j+1;
            var channelid = $('#channelid').val();
            var city = $('#city').val();
            var url = "?c=news&a=ajaxGetList&channelid="+channelid+"&city="+city+"&p="+p+"&r="+Math.random();
            jQuery.ajax({url:url,success:function(moredata)
            {
                if(moredata.indexOf('请求超时') > 0 || moredata.indexOf('获取列表出错') > 0){
                    alert('加载更多失败,请重试！');
                    return false;
                }
                var str = $("#newsList").html();
                var content = str + moredata;
                $("#newsList").html(content);
            }});
            j++;
            return false;
        });

    }
});