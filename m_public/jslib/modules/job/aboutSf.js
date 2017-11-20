define('modules/job/aboutSf',['jquery'],function (require, exports, module) {
    'use strict';
    module.exports  = function(){
        var $ = require("jquery");
        var vars = seajs.data.vars;
        $("input[type=hidden]").each(function(index,element){
            vars[$(this).attr('data-id')] = element.value;
        });
        

    };
    
});