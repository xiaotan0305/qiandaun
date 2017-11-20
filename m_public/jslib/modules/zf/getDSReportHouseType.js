/**
 * Created by user on 2016/3/15.
 */
define('modules/zf/getDSReportHouseType', ['jquery'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        // ajax请求成功加锁 防止重复提交数据
        var ajaxFlag = true;
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var $reportReason = $('#reportReason');
        // 举报详细说明输入字数提示
        $reportReason.on('input', function () {
            var length = $(this).val().length;
            $('#numberOfWords').text(length);
        });

        // 点击立即举报执行的操作
        $('.btn-tj').on('click', function () {
            // 获取选中的虚假举报项
            var reportVal = $('input[name="radio"]:checked').parent().text();
            // 举报详细说明
            var reportReason = $reportReason.val();
            // 用户输入内容如果包含<script></script>标签 过滤文本域中的数据
            reportReason = reportReason.replace(/[\<\>\(\)\;\{\}\"\'\[\]\/\@\!\,]/g, '');
            // 传递给后台的数据
            var information = {
                reportVal: reportVal,
                reportReason: reportReason,
                userid: vars.userid,
                username: vars.username,
                mobilephone: vars.mobilephone
            };
            if (ajaxFlag) {
                $.ajax({
                    url: '/zf/?c=zf&a=ajaxDSReportHouse&houseid=' + vars.houseid + '&roomid=' + vars.roomid,
                    async: false,
                    data: information,
                    dataType: 'json',
                    type: 'GET',
                    success: function (data) {
                        if (data.result === '1' && data.IsReported !== '1') {
                            if (vars.housetype === 'DS') {
                                window.location = vars.zfSite + '?c=zf&a=successDSReportHouse&houseid=' + vars.houseid + '&housetype=' + vars.housetype;
                            } else {
                                window.location = vars.zfSite + '?c=zf&a=successDSReportHouse&roomid=' + vars.roomid + '&housetype=' + vars.housetype;
                            }
                            return false;
                        }
                        if (data === '请求超时') {
                            $('#sendText').text('网络不给力，请重试。');
                        } else {
                            ajaxFlag = false;
                            $('#sendText').text(data.message);
                        }
                        // 显示浮层提示
                        $('#sendFloat, #sendText').show();
                        // 隐藏提示浮层
                        setTimeout(function () {
                            $('#sendFloat').hide();
                            if (data.result === '1' && data.IsReported === '1') {
                                window.location = vars.zfSite + vars.city + '/' + vars.housetype + '_' + (vars.housetype === 'DS' ? vars.houseid : vars.roomid) + '.html';
                            }
                        }, 3000);
                    }
                });
            }
        });
    };
});
