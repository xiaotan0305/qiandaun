define('modules/zf/getReportHouseType', ['jquery'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars, preload = [];
        // 存放选择的举报项目的值
        var selectID;
        preload.push('modules/zf/yhxw');
        if ($('#scrollHead').length > 0) {
            preload.push('iscroll/2.0.0/iscroll-lite');
        }
        if (vars.localStorage) {
            preload.push('modules/zf/viewhistory', 'fav/1.0.0/fav');
        }
        preload.push('app/1.0.0/appdownload.js');
        require.async(preload);
        require.async('modules/zf/yhxw', function (yhxw) {
            yhxw(0);
            if (vars.localStorage) {
                // 浏览历史
                require.async('modules/zf/viewhistory', function (a) {
                    a.record(vars.houseid);
                });
                // 收藏
                require.async('fav/1.0.0/fav', function (a) {
                    a.fav(vars.houseid, 'zf_favorite');
                    $('.btn-fav').on('click', function () {
                        yhxw(21);
                        a.add_fav(vars.houseid, 'zf_favorite');
                    });
                });
            }

            // wap端点对点打开app
            require.async('app/1.0.0/appdownload.js', function ($) {
                $('.down-btn-c').openApp('');
            });

            // 弹出3秒浮层
            var $sendFloat = $('#sendFloat');
            var $sendText = $('#sendText');
            function displayLose(num, keywords, url) {
                var errorTimer = setInterval(function () {
                    num -= 1;
                    $sendFloat.show();
                    $sendText.html(keywords);
                    if (num <= 0) {
                        clearInterval(errorTimer);
                        $sendFloat.hide();
                        $sendText.html('');
                        if (url) {
                            window.location.href = url;
                        }
                    }
                }, 1000);
            }

            // 输入举报内容的时候对内容做字数判断
            var $content = $('#content');
            $content.on('keyup', function () {
                var input = $content.val();
                var curr;
                var maxChars = 100;
                var numberOfWords = $('#numberOfWords');
                if (input.length <= maxChars) {
                    input = input.substr(0, maxChars);
                    curr = input.length;
                    numberOfWords.html(curr.toString());
                } else {
                    numberOfWords.html(100);
                    displayLose(3, '无法输入更多~');
                    $content.val(input.substr(0, 100));
                }
            });


            var submitCallback = function (data) {
                var url;
                if (data.iszhongjie.result === '1') {
                    url = vars.zfSite + '?c=zf&a=successReportHouse&city=' + vars.city + '&houseid=' + vars.houseid
                        + '&housetype=' + vars.housetype + '&consequence=1';
                    displayLose(3, '成功', url);
                } else if (data.iszhongjie.result) {
                    url = vars.zfSite + '?c=zf&a=getReportHouseType&city=' + vars.city + '&houseid=' + vars.houseid
                        + '&housetype=' + vars.housetype;
                    displayLose(3, data.iszhongjie.message, url);
                } else {
                    url = window.location.href;
                    displayLose(3, data, url);
                }
            };

            // 提交
            $('#submit').click(function () {
                selectID = $('input:radio[name=radio]:checked').val();
                var Remark = $content.val();
                var url = '/zf/?c=zf&a=ajaxReportHouse';
                var data = {
                    city: vars.city,
                    Jbsj: vars.Jbsj,
                    houseid: vars.houseid,
                    keyList: selectID,
                    userPhone: vars.userphone,
                    purpose: encodeURIComponent(vars.purpose),
                    Remark: encodeURIComponent(Remark)
                };
                $.get(url, data, submitCallback);
            });
        });
    };
});
