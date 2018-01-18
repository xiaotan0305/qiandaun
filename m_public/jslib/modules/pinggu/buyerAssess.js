/**
 * Created by zcf on 2016/1/19.
 * @file 查房价购房能力评估
 * @author zcf(zhangcongfeng@fang.com)
 */
define('modules/pinggu/buyerAssess', ['modules/world/yhxw', 'jquery'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        // 页面包裹层
        var wrapper = $('#wrapper');
        // 评估按钮
        var assess = $('#assess');
        var funding = $('#funding');
        var monthIncome = $('#monthIncome');
        // 'hn'(海南)不支持新房评估
        var noxfCity = 'hn';
        var obj = noxfCity.indexOf(vars.city) !== -1 ? {houseType: 'esf'} : {houseType: 'xf'};
        var intentionZone = $('#intentionZone');
        // 意向区域可能没有
        var required = intentionZone.length > 0 ? 6 : 5;
        // 引入用户行为分析对象-埋码
        var yhxw = require('modules/world/yhxw');
        var maimaParams = {
            'vmg.page': 'cfj_cfj^gfnlpg_wap'
        };
        yhxw({
            pageId: 'cfj_cfj^gfnlpg_wap',
            params: maimaParams
        });
        // 所有项不为空,评估按钮可点击
        function checkObj(obj) {
            obj.funding = funding.val();
            obj.monthIncome = monthIncome.val();
            var flag = true;
            var len = Object.keys(obj).length;
            // 共6项,都必填
            if (len >= required) {
                for (var t in obj) {
                    if (obj.hasOwnProperty(t)) {
                        if (obj[t] === '') {
                            flag = false;
                        }
                    }
                }
                flag ? assess.removeClass('disable') : assess.addClass('disable');
            }
        }
        // 当前li添加选择样式,金额输入项只能输入数字限制
        wrapper.on('click', 'ul li', function () {
            var $that = $(this);
            var id = $that.parent().attr('id');
            if (id) {
                if (id === 'houseType' &&　noxfCity.indexOf(vars.city) !== -1) {
                    alert('亲~' + vars.cityname + '暂不支持新房评估');
                }else {
                    $that.addClass('active').siblings('li').removeClass('active');
                }
                if (id === 'houseType' || id === 'intentionZone') {
                    obj[id] = $that.children().data('id');
                }else {
                    obj[id] = $that.children().html();
                }
                checkObj(obj);
            }
        }).on('keyup blur', 'input', function () {
            var $that = $(this);
            var val = $that.val();
            var id = $that.attr('id');
            if (id) {
                var reg = /\D/g;
                $that.val(val.replace(reg, ''));
                obj[id] = val;
                checkObj(obj);
            }
        });
        // 点击评估
        // 隐藏表单的id
        var resultSub = $('#resultSub');
        var timeout;
        assess.on('click',function () {
            if (timeout) {
                clearTimeout(timeout);
            }
            if (!assess.hasClass('disable')) {
                assess.addClass('hover');
                resultSub.find('input[name=city]').val(vars.city);
                resultSub.find('input[name=houseType]').val(obj.houseType);
                resultSub.find('input[name=funding]').val(obj.funding);
                resultSub.find('input[name=monthIncome]').val(obj.monthIncome);
                resultSub.find('input[name=loanTime]').val(obj.loanTime);
                resultSub.find('input[name=intentionArea]').val(obj.intentionArea);
                resultSub.find('input[name=intentionZone]').val(obj.intentionZone);
                resultSub.submit();
                timeout = setTimeout(function () {
                    assess.removeClass('hover');
                },500);
            }
        });
    };
});
