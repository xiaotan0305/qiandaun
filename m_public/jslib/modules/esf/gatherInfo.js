/**
 * Created by bjwanghongwei@fang.com on 2017/5/15.
 * 二手房/小区汇总
 */
define('modules/esf/gatherInfo',function(require,exports,module){
    module.exports = function(){
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var url = vars.esfSite + '?a=ajaxXqOrEsfGather';
        var $msgObj = $('#sendFloat');
        var $msg = $('#sendText');
        function show(keywords){
            $msg.text(keywords);
            $msgObj.fadeIn();
            $msgObj.fadeOut(2000);
        }

        var param = {
            city: vars.city
        };

        $('.word a').on('click',function(){
            var pinyin = $(this).html();
            var that = $(this);
            param.pinyin = pinyin;
            $.ajax({
                url:url,
                data:param,
                success:function(data){
                    var htmlCont = '';
                    if(data){
                        if(data.code !== '100'){
                            show(data.info);
                        } else {
                            //循环到模板
                            var i=0;
                            for (i=0; i < data.info.length; i++) {
                                //来自二手房
                                if (vars.fromesf === '1') {
                                    htmlCont += '<li><a href="'+vars.esfSite+vars.city+'_xm'+data.info[i].Newcode+'/">'+data.info[i].ProjName+'</a></li>';
                                } else if (vars.fromxq === '1') {//来自小区
                                    htmlCont += '<li><a href="'+vars.xiaoquSite+vars.city+'/'+data.info[i].Newcode+'.html">'+data.info[i].ProjName+'</a></li>';
                                }
                            }
                            $('.lp-hz-list').html('').html(htmlCont);
                            //加载选中样式,同级别的兄弟节点去除cur样式
                            that.addClass('cur').siblings().removeClass('cur');
                        }
                    }
                },
                error:function(err){
                    alert(err)
                }
            })
        })
    }
});
