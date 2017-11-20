define('modules/jiaju/companyRecommended', ['jquery', 'modules/jiaju/openapp'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var $timeout = $('#timeout');
        if ($timeout.length) {
            // 数据请求失败时, 点击刷新
            $timeout.on('click', function () {
                window.location.reload();
            });
        } else {
            // 页面加载成功
            // 1. 取消服务功能
            var canAjax = true;
            var companyid, pcid, companyname, soufunname, imurl;
            var $sendFloat = $('#sendFloat');
            var $sendText = $('#sendText');
            var toastMsg = function (Msg) {
                $sendText.text(Msg);
                $sendFloat.show();
                setTimeout(function () {
                    $sendFloat.hide();
                }, 2000);
            };
            $('.cancelService').on('click', function () {
                companyid = $(this).attr('data-cid');
                pcid = $(this).attr('data-uid');
                $('#cancelConfirm').show();
            });
            $('#yes').on('click', function () {
                if (canAjax) {
                    canAjax = false;
                    $.ajax({
                        data: {
                            companyid: companyid,
                            pcid: pcid,
                            id: vars.id
                        },
                        url: vars.jiajuSite + '?c=jiaju&a=ajaxCancelCompanyService&r=' + Math.random(),
                        success: function (data) {
                            if (data && data.issuccess === '1') {
                                $('#' + companyid).html(vars.cancelInfo);
                                $('#cancelConfirm').hide();
                            } else {
                                $('#cancelConfirm').hide();
                                toastMsg(data.errormessage || '网络超时, 请点击重试');
                            }
                        },
                        complete: function () {
                            canAjax = true;
                        }
                    });
                }
            });
            $('#no').on('click', function () {
                $('#cancelConfirm').hide();
            });
            // 2.打开app功能
            var openapp = require('modules/jiaju/openapp');
            openapp.init({
                openQueue: ['zxapp', 'fapp', 'url']
            });
            // 3. 跳转IM功能
            $('.jumpIM').on('click', function () {
                soufunname = $(this).attr('data-soufunname');
                companyname = $(this).attr('data-companyname');
                imurl = $(this).attr('data-imurl');
                localStorage.setItem(String('h:' + soufunname), encodeURIComponent(companyname) + ';;');
                location.href = imurl;
            });
        }
    };
});