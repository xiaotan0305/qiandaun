define('modules/myesf/successfabu', ['jquery'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var flag = false;
        //选择全委托
        $('#qdChoce1').on('click', function () {
            if (flag) {
                return false;
            }
            flag = true;
            var data = {
                indexId : vars.indexId,
                serverType : 1,
            };
            $.ajax({
                url: vars.mySite + '?c=myesf&a=ajaxApplyDelegateServiceType',
                type: 'POST',
                data: data,
                success: function (data) {
                    if (data && data.code === '100') {
                        var url = vars.mySite + '?c=myesf&a=houseDetail&city=' + vars.city  + '&indexId=' + vars.indexId;
                        window.location = url;
                    } else if (data && data.message) {
                        alert(data.message);
                    } else {
                        alert('请重新选择');
                    }
                    flag = false;
                }
            });
        });
        //选择派单
        $('#qdChoce2').on('click', function () {
            if (flag) {
                return false;
            }
            flag = true;
            var data = {
                indexId : vars.indexId,
                serverType : 2,
            };
            data.limitAgentCount = $('.active').text();
            if ($('.active').length > 0) {
                $.ajax({
                    url: vars.mySite + '?c=myesf&a=ajaxApplyDelegateServiceType',
                    type: 'POST',
                    data: data,
                    success: function (data) {
                        if (data && data.code === '100') {
                            var url = vars.mySite + '?c=myesf&a=houseDetail&city=' + vars.city  + '&indexId=' + vars.indexId;
                            window.location = url;
                        } else if (data && data.message) {
                            alert(data.message);
                        } else {
                            alert('请重新选择');
                        }
                        flag = false;
                    }
                });
            } else {
                return false;
            }
            flag = false;
        });
        //选择自助服务
        $('#qdChoce3').on('click', function () {
            if (flag) {
                return false;
            }
            flag = true;
            var data = {
                indexId : vars.indexId,
                serverType : 3,
            };
            $.ajax({
                url: vars.mySite + '?c=myesf&a=ajaxApplyDelegateServiceType',
                type: 'POST',
                data: data,
                success: function (data) {
                    if (data && data.code === '100') {
                        var url = vars.mySite + '?c=myesf&a=houseDetail&city=' + vars.city  + '&indexId=' + vars.indexId;
                        window.location = url;
                    } else if (data && data.message) {
                        alert(data.message);
                    } else {
                        alert('请重新选择');
                    }
                    flag = false;
                }
            });
        });
        //点击选择人数
        $('.chooseCount').on('click', function () {
            var that = $(this);
            that.children().addClass('active');
            that.siblings().children().removeClass('active');
        });
        //点击出现弹层
        $('#wttype1').on('click', function () {
            $('.float1').show();
        });
        $('#wttype2').on('click', function () {
            $('.float2').show();
        });
        $('#wttype3').on('click', function () {
            $('.float3').show();
        });
        //取消按钮
        $('.qxChoce').on('click', function () {
            $('.floatAlert').hide();
        });
    };
});