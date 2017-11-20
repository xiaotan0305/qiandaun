define('modules/mycenter/getWTDetailByID', ['jquery', 'modules/mycenter/common'], function (require) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;
    var common= require('modules/mycenter/common');

    //同意按钮
    var agree = $('.agree');
    //拒绝按钮
    var fail = $('.fail');
    //立即委托按钮
    var suc = $('.suc');
    //不同意提示
    var no_agree = $('.no_agree');

    // 打电话
    $('a').on('click', '.serviceTel_b, .serviceTel', function () {
        common.apply(this, $(this).attr('data-teltj').split(','));
    });

    //点击同意协议
    agree.click(function(){
    	if (agree.attr('checked')) {
    		agree.removeAttr('checked');
    	} else {
    		agree.attr('checked', true);
    		no_agree.hide();
    	}
    });
    var flag = false;
    //点击立即委托
    if (!flag) {
        suc.click(function(){
            if (!agree.attr('checked')) {
                no_agree.show();
            } else {
                $.ajax({
                    url: vars.mySite + '?c=myesf&a=ajaxUpdateEHouseToDelegate',
                    data: {houseid: vars.houseid},
                    success:function(data){
                        flag = true;
                        if (data) {
                            alert('您的房源将尽快在房天下展示。');
                            window.location = vars.mySite + '?c=mycenter&a=sellFangList&city=' + vars.city;
                        } else {
                            alert('很抱歉，房源委托失败，请重试。');
                        }
                    }
                })
            }
        });
    }

    //点击残忍拒绝
    fail.click(function(){
    	$('#content').hide();
    })

});