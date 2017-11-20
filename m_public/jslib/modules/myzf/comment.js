/**
 * Created by zdl on 2016/3/15.
 */
define('modules/myzf/comment', ['jquery', 'lazyload/1.9.1/lazyload'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        require('lazyload/1.9.1/lazyload');
        // 标签没有选取时的加锁
        var flag = true;
        // ajax 请求成功后的加锁
        var ajaxFlag = true;
        $('.lazyload').lazyload();
        // 获取配套设施
        function getEquitement(arr) {
            var arr1 = [];
            for (var i = 0; i < arr.length; i++) {
                arr1.push(arr[i].innerHTML + ',');
            }
            var arrStr = arr1.join('');
            return arrStr.substr(0,arrStr.length - 1);
        }

        // 给页面中的所有星星添加点击事件
        $('.ico-star2').on('touchstart', 'i', function () {
            var $that = $(this);
            var parent = $that.parent();
            var idx = $that.index() + 1;
            parent.find('i').removeClass('active');
            parent.find('i:lt(' + idx + ')').attr('class', 'active');
        });
        // 给页面中所有的设备点评标签添加点击事件
        $('.dp-tag').on('touchstart', 'a', function () {
            var $that = $(this);
            if ($that.hasClass('active')) {
                $that.removeClass('active');
            } else {
                $that.addClass('active');
            }
        });
        // 提交评价操作
        $('.btn-tj').on('click', function () {
            flag = true;
            // 获取经纪人星级评分
            var $dpzygw = $('.dp-zygw');
            var agentscore = $dpzygw.find('i.active').length;
            // 将点评页的每条房源对应的房源id、用户对该房源的星级点评和配套动态点评数据存入valStr中
            var valStr = '';
            $('section[data-id]').each(function () {
                var $that = $(this);
                var dataArray = $that.attr('data-id').split(',');
                // 获取点评房源对应的房源id
                var houseid = dataArray[0];
                var roomid = dataArray[1];
                // 获取对应房源id的星级评分
                var score = $that.find('i.active').length;
                // 配套设施标签选择
                var equitements = getEquitement($that.find('a.active'));
                var equitementsLen = $that.find('a.active').length;
                // 如果存在某套房源的配套设施标签没有选中 弹出提示 把提交的ajax标志置为false即不让用户提交评价
                if (!equitementsLen) {
                    flag = false;
                    $('#sendText').text('请至少选择一个房源标签!');
                    $('#sendFloat').show();
                    setTimeout(function () {
                        $('#sendFloat').hide();
                    },3000);
                }
                valStr += houseid + ',' + roomid + ',' + score + ';' + equitements + '||';
            });
            var formatValStr = valStr.substr(0,valStr.length - 2);
            var url = vars.mySite + '?c=myzf&a=submitComment';
            var information = {
                orderid: vars.orderID,
                commentID: vars.commentID,
                agentscore: agentscore,
                mobile: vars.mobile,
                userID: vars.userID,
                nickName: vars.nickName,
                jsondata: formatValStr
            };
            // 如果已经提交过或者用户存某套房源设备没有点评则不发送ajax请求
            if (flag && ajaxFlag) {
                $.ajax({
                    url: url,
                    async: false,
                    data: information,
                    type: 'POST',
                    success: function (data) {
                        $('#sendText').text(data.errmsg);
                        $('#sendFloat').show();
                        if (data.errcode === '1') {
                            ajaxFlag = false;
                            setTimeout(function () {
                                $('#sendFloat').hide();
                                window.location.href = vars.mySite + '?c=mycenter&a=kanFangDayList&city=' + vars.city;
                            },3000);
                        } else {
                            setTimeout(function () {
                                $('#sendFloat').hide();
                            },3000);
                        }
                    }
                });
            }
        });
    };
});
