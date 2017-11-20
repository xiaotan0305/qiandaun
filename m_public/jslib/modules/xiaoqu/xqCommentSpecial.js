/**
 * Created by lina on 2017/4/19.
 * 小区点评专题入口
 */
define('modules/xiaoqu/xqCommentSpecial',function(require,exports,module){
    module.exports = function(){
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var url = vars.xiaoquSite + '?a=ajaxCheckComment';
        var $msgObj = $('#sendFloat');
        var $msg = $('#sendText');
        function show(keywords){
            $msg.text(keywords);
            $msgObj.fadeIn();
            setTimeout(function(){
                $msgObj.fadeOut();
            },2000)
        }

        var param = {
            newcode: vars.newcode,
            city: vars.city
        };
        if(window.location.href.indexOf('issearch') > -1){
            param.issearch = 1;
        }
        $('.xqdpBtn').on('click',function(){
            $.ajax({
                url:url,
                data:param,
                success:function(data){
                    if(data){
                        if(data.code === '5'){
                            window.location.href = vars.xiaoquSite + '?a=xqSearchSpecial&city='+ vars.city;
                            return false;
                        }
                        if(data.url){
                            window.location.href = data.url;
                            return false;
                        }
                        if(data.code === '100'){
                            window.location.href = vars.xiaoquSite + '?a=xqWriteComment'+'&city='+ vars.city + '&newcode=' + vars.newcode;
                        }else{
                            show(data.message);
                        }
                    }
                }
            })
        })
    }
});