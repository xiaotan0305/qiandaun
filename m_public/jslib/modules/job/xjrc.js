define('modules/job/xjrc',['jquery'],function (require, exports, module) {
    'use strict';
    module.exports  = function(){
        var $ = require("jquery");
        var vars = seajs.data.vars;
        $("input[type=hidden]").each(function(index,element){
            vars[$(this).attr('data-id')] = element.value;
        });
        var cityxl = $('.cityxl');
        // show下拉框列表
        $('.btn-city').on('click',function(ev){
        	if (cityxl.css('display')==='none') {
        		cityxl.show();
        	} else {
        		cityxl.hide();
        	}
        	return false;
        })
        
        // 点击除下拉列表以外的 hide下拉列表
        $(document.body).on('click',function(ev){
        	var targetObj=$(ev.target);
        	if(!targetObj.hasClass('.cityxl')){
        		cityxl.hide();
        	}else{
        		cityxl.show();
        	}
        });
    };
});