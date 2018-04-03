/**
 * 租房个人发布管理页
 */
define('modules/myzf/rentDetail', ['jquery'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var selfUrl = window.location.href;
        //****弹出3秒浮层****
        var $sendFloatId = $('.sendFloat'), $sendTextId = $('.sendText');
        function displayLose(num, keywords, url) {
            var errorTimer = setInterval(function () {
                num -= 1;
                $sendFloatId.show();
                $sendTextId.show().html(keywords);
                if (num <= 0) {
                    clearInterval(errorTimer);
                    $sendFloatId.hide();
                    $sendTextId.html('');
                    if (url) {
                        window.location.href = url;
                    }
                }
            }, 1000);
        }

        //****在线房源上传图片****
        var $inputFile = $('input[type=file]');
        $inputFile.on('change', function () {
            $sendFloatId.show();
            $sendTextId.show().html('上传中....');
        });
        //**点击图片上传**
        $inputFile.on('click', function () {

            var houseid = vars.houseid;
            console.log(houseid);
            var encity = vars.city;
            // 房源编辑图片地址
            var Url = '?c=myzf&a=ajaxEditHouseImg&city=' + encity;
            if ($inputFile.length > 0) {
                require.async('modules/myzf/upload', function (upload) {
                    upload.init({
                        // 图片服务器地址
                        url: '?c=myesf&a=ajaxUploadImg&city=' + encity,
                        // 只能上传1张
                        maxlength: 1,
                        // 回调函数
                        callBack: function (file, data) {
                            data = eval('(' + data + ')');
                            var imgurl = data.result.url;
                            var information = { imgurl: imgurl, houseid: houseid };
                            $.ajax({
                                url: Url,
                                data: information,
                                dataType: 'json',
                                type: 'GET',
                                success: function (data) {
                                    if (parseInt(data.errCode)) {
                                        $('input[type=file]').replaceWith('<img class="mfupload" src=' + imgurl + '/>');
                                        displayLose(2, '上传成功', selfUrl);
                                    } else {
                                        displayLose(2, '图片上传失败,请稍候再试');
                                    }
                                }
                            });
                        }
                    });
                });
            }
        });

        //点击删除
        var param;
        $('.del').on('click', function () {
            $('#offFloat').show();
        });
        //**点击下架弹框的取消**
        $('#cancelOff').on('click', function () {
            $('#offFloat').hide();
        });


        //**点击下架弹框的确认**
        $('#cancelOn').on('click', function () {
            param = { c: 'myzf', a: 'ajaxChangeRentStatus', city: vars.city, houseid: vars.houseid, status: 'down' };
            $('#offFloat').hide();
            param.status = 'down';
            $.get(vars.mySite, param, function (data) {
                if (data.result === '100') {
                    if (vars.istop === '1') {
                        param.a = 'ajaxCancelSetTop';
                        $.get(vars.mySite, param);
                    }
                    displayLose(3, decodeURI(data.message), vars.returnUrl);
                } else {
                    displayLose(3, decodeURI(data.message), vars.returnUrl);
                }
            });
        });

        //****房源刷新****
        function refresh(houseid, encity) {
            var param = { c: 'myzf', a: 'ajaxRefreshRent', city: encity, houseid: houseid };
            $.get(vars.mySite, param, function (data) {
                var result = data.state;
                if (result === '1' || result === '100') {
                    displayLose(2, '刷新成功', selfUrl);
                } else {
                    displayLose(2, '刷新失败', selfUrl);
                }
            });
        }
        //**点击刷新按钮**
        $('.refresh').on('click', function () {
            refresh(vars.houseid, vars.city);
        });

        // 点击我要提升
        $('.promote').on('click', function(){
            $('.promoteAlert').show();
        });
        $('.closePromote').on('click', function(){
            $('.promoteAlert').hide();
        });
        $('.closePromote').on('click', function(){
            $('.promoteAlert').hide();
        });

        //仪表盘

        var dashboardup = '';

        function dashboardfun(total) {
            $('.rotateOut').css({
                '-webkit-transform': 'rotate(' + total + 'deg)',
                '-o-transform': 'rotate(' + total + 'deg)',
                '-moz-transform': 'rotate(' + total + 'deg)',
                transform: 'rotate(' + total + 'deg)'
            });
        }

        function dashboardStart(start, angles) {
            dashboardup = setInterval(function () {
                start++;
                if (start > angles) {
                    clearInterval(dashboardup);
                    return false;
                }
                dashboardfun(start);
            }, 10);
        }
        var angles = Math.round((116*2/100) * vars.source) - 116;
        dashboardStart('-116', angles);
        
        
    };
});
