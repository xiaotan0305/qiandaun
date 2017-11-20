/**
 *  ui改版 lina 20161221
 */
define('modules/myzf/changeAgentPage', ['jquery'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        // 隐藏域中的数据
        var vars = seajs.data.vars;
        var app_url = vars.isapp ? '&src=' + vars.src + '&Mobile=' + vars.Mobile + '&UserID=' + vars.UserID : '';
        var $agentPhone = $('#agentPhone');
        var $design = $('#design');
        var $automatic = $('#automatic');
        // 选择类型
        $('#selectType').find('a').on('click', function () {
            var $ele = $(this);
            $ele.addClass('active');
            $ele.parents('dl').siblings().find('a').removeClass('active');
            // 选择系统自动选择，手机号禁止输入
            if ($ele.parents('dl').index() === 1) {
                $agentPhone.attr('disabled', true);
            } else {
                $agentPhone.attr('disabled', false);
            }
        });
        // 点击提交
        var url;
        $('#submit').on('click', function () {
            var agentMobile = $agentPhone.val();
            if ($design.hasClass('active') && agentMobile === '') {
                alert('请输入指定看房顾问的手机号码');
                return;
            } else if ($design.hasClass('active') && agentMobile === vars.Telephone) {
                alert('手机号码与当前看房顾问相同，请核实后再填');
                return;
            } else if ($design.hasClass('active') && agentMobile !== '') {
                if (!/^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$/i.test(agentMobile)) {
                    alert('请输入正确格式的手机号码！');
                    $agentPhone.val('');
                    return false;
                }
                 url = '?c=myzf&a=changeAgent&city=' + vars.city + '&agentMobile=' + agentMobile + app_url;
            } else if ($automatic.hasClass('active')) {
                $agentPhone.val('');
                 url = '?c=myzf&a=changeAgent&city=' + vars.city + app_url;
            }
            $.ajax({
                url: url,
                success: function (moredata) {
                    if (moredata !== '' && moredata !== 0) {
                        if (moredata.IsSuccess === 1) {
                            window.location.href = '?c=myzf&a=changeAgentSuc&city=' + vars.city + '&Name=' + moredata.Name + '&Telephone=' + moredata.Telephone + '&TotalCheckTimes=' + moredata.TotalCheckTimes + '&AgentAvatar=' + moredata.AgentAvatar + app_url;
                        } else {
                            alert(moredata.message);
                        }
                    } else {
                        alert('数据请求失败请重新提交');
                    }
                }
            });
        });
    };
});