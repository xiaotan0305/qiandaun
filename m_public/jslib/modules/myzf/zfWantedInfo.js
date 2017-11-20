define('modules/myzf/zfWantedInfo', ['jquery'],function(require,exports,module){
    "use strict";
    module.exports = function() {
        var $ = require("jquery"),vars = seajs.data.vars, h_vars=[];
        $("input[type=hidden]").each(function(index,element){
            h_vars[$(this).attr('id')] = element.value;
        });

        //修改
        $('#change_btn').on('click',function(){
            var url=vars.mySite+"?c=myzf&city="+vars.city+"&a=releaseWanted";
            for(var key in h_vars){
                url +="&"+key+"="+encodeURIComponent(h_vars[key]);
            }
            window.location.href=url;
        });
    };

});