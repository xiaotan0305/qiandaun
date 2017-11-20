define('modules/myesf/sellCommission', ['jquery'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var vars = seajs.data.vars;
        var $ = require('jquery');
        var $linkMe = $('.linkme');

        /**
         * 提交数据
         * @param type
         */
        function addFavFun(type) {
            var url = vars.mySite + '?c=myesf&a=ajaxsellCommissionSub&houseid=' + vars.houseid + '&OwnerAnswer=' + type + '&source=' + vars.source;
            $.get(url, function (data) {
                if (data.result === '1' && type === '2') {
                    $linkMe.find('.cont').html('<h2>提交成功！</h2>'
                        + '<p class="center f15 gray-0 pd20">房天下会尽快安排业务人员<br>上门协助您签署出售委任书 </p><div class="tz-btn flexbox">'
                        + '<input id="qd" type="button" value="确定" style="background:#df3031;"></div>');
                    $('.fangservicebtn').find('.btn_ewt').text('暂不卖房');
                    $linkMe.show();
                    // 点击“提交后的确定”
                    $('#qd').on('click', function () {
                        $linkMe.hide();
                        $('.btn_ewt').css('background-color', '#808080');
                    });
                } else if (data.result === '-99' || data.result === '-11' || data.result === '-12' || data.result === '-13' || data.result === '-14'
                    || data.result === '-15' || data.result === '-16') {
                    $linkMe.find('h2').html('<p class="center f15 gray-0 pd20">' + data.message + '</p>');
                    $linkMe.show();
                    // 点击“提交后的确定”
                    $('#qd').on('click', function () {
                        $('.linkme').hide();
                    });
                } else if (data.result === '1' && type === '1') {
                    $('.fangservicebtn').find('.btn_ewt').text('暂不卖房');
                    $('.btn_ewt').css('background-color', '#808080');
                } else {
                    $linkMe.find('h2').html('<p class="center f15 gray-0 pd20">提交失败请重新提交 </p>');
                    // 点击“提交后的确定”
                    $('#qd').on('click', function () {
                        $linkMe.hide();
                    });
                    $linkMe.show();
                }
            });
        }
        // 点击“我不卖了”触发弹框
        $('.btn_ewt').on('click', function () {
            if ($(this).text() === '暂不卖房') {
                return false;
            } else {
                $('.stopSell').show();
            }
        });
        // 点击委托书图标
        $('#weituo').find('a').on('click', function () {
            $('.weituoMessage').show();
        });
        // 点击委托书中的确定
        $('#ydqd').on('click', function () {
            $('.weituoMessage').hide();
        });
        // 点击“我不卖了中的确定”
        $('#noSaleqd').on('click', function () {
            addFavFun('1');
            $('.stopSell').hide();
        });
        // 点击“我不卖了中的取消”
        $('#lost').on('click', function () {
            $('.stopSell').hide();
        });
        // 点击“我知道了,快来联系我吧”
        $('.btn_ewta').on('click', function () {
            addFavFun('2');
        });
        // 关闭按钮
        $('.conta').find('a').on('click', function () {
            $('.weituoMessage').hide();
        });
        // 点击空白区域弹窗消失
        $('.weituoMessage').on('click', function (e) {
            var el = $(e.target);
            if (el.hasClass('weituoMessage')) {
                $(this).hide();
            }
        });
    };
});