define('modules/zf/longTailSum',['jquery'], function(require,exports,module){
    'use strict';
    module.exports = function(){
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var $msgObj = $('#sendFloat');
        var $msg = $('#sendText');
        function show(keywords){
            $msg.text(keywords);
            $msgObj.fadeIn();
            $msgObj.fadeOut(2000);
        }
        $('.word a').on('click',function(){
            var that = $(this);
            var param = {
                initial: that.html()
            };
            $.ajax({
                url: vars.zfSite + '?a=ajaxLongTailSum&city=' + vars.city,
                data: param,
                success:function(data){
                    var htmlCont = '';
                    if (data.errcode == '100') {
                        var i = 0;
                        for (i = 0; i < data.result.length; i++) {
                            htmlCont += '<li><a href="http:' + vars.mainSite  + 'houses/zf_' + data.result[i].id  + '_' + vars.city + '/">' + data.result[i].longtail + '</a></li>';
                        }
                    }
                    $('.lp-hz-list').html('').html(htmlCont);
                },
            });
            //加载选中样式,同级别的兄弟节点去除cur样式
            that.addClass('cur').siblings().removeClass('cur');
        })
    }
});
