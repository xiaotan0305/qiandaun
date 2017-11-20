/**
 * Created by lina on 2017/7/13.
 * 首付月供计算公用插件
 */
(function (w, f) {
    'use strict';
    if (typeof define === 'function') {
        define('modules/tools/mvc/model/Calculate', ['jquery'], function (require) {
            // jquery库
            var $ = require('jquery');
            return f($);
        });
    } else if (typeof exports === 'object') {
        var $ = require('jquery');
        module.exports = f($);
    } else {
        // 非模块化加载
        w.Calculate = f(w.jQuery);
    }
})(window, function () {
    'use strict';
    // type为计算类型 1：等额本息 2:等额本金
    // 计算月供
    function Calculate(){

    }
    Calculate.prototype.calculate = function(data){
        var returnData = {
            // 每月利息
            interest: '',
            toatlInterest: '',
            rate:data.rate
        };
        var that = this;
        that.data = data;
        // 等额本息计算月供
        var monRate = this.data.rate / 12;
        // 等额本息：每月应还利息 = 贷款本金×月利率×〔(1+月利率)^还款月数-(1+月利率)^(还款月序号-1)〕÷〔(1+月利率)^还款月数-1〕
        // 等额本金：每月应还利息= 剩余本金×月利率+(贷款本金-已归本金累计额)×月利率
        var monLx = [];
        // 等额本息： 每月应还本金 = 贷款本金×月利率×(1+月利率)^(还款月序号-1)÷〔((1+月利率)^还款月数)-1〕
        // 等额本金：每月应还本金=贷款本金÷还款月数
        var monMoney = [];
        var totalMon = parseInt(that.data.month);
        var totalMoney = parseFloat(that.data.totalMoney);
        var i = 0;
        var reMoney = 0;
        var totalLx = 0;
        var leftMoney = [];
        if(that.data.type == 1){
            // 等额本息： 总利息= 还款月数×每月月供额-贷款本金
            // 等额本息： 每月月供 = 〔贷款本金×月利率×(1＋月利率)＾还款月数〕÷〔((1＋月利率)＾还款月数)-1〕
            var monYg = Math.round(totalMoney * monRate * (Math.pow((1 + monRate), totalMon)) / (Math.pow((1 + monRate), totalMon) - 1));
            for(;i < that.data.month; i++) {
                // 每月利息 = 贷款本金×月利率×〔(1+月利率)^还款月数-(1+月利率)^(还款月序号-1)〕÷〔(1+月利率)^还款月数-1〕
                monLx.push(parseInt(totalMoney * monRate * (Math.pow((1 + monRate), totalMon) - Math.pow((1 + monRate), i)) / (Math.pow((1 + monRate), totalMon) - 1)));
                // 每月应还本金
                monMoney.push(parseInt(totalMoney * monRate * Math.pow((1 + monRate), i) / (Math.pow((1 + monRate), totalMon) - 1)));
                reMoney += monMoney[i];
            }
            totalLx = monYg * that.data.month;
            for(var n = 1; n <= that.data.month; n++){
                // 每月剩余贷款
                leftMoney.push(parseInt(totalLx - parseFloat(monYg) * n));
            }
            totalLx -= totalMoney;
        }else if(that.data.type == 2){
            // 每月应还本金
            var monMoney = parseInt(totalMoney / totalMon);
            // 等额本金： 每月月供 = (贷款本金÷还款月数)+(贷款本金-已归还本金累计额)×月利率
            var monYg = [];
            // 每月月供递减额 = 每月应还本金×月利率
            var djMoney = monMoney * monRate;
            // 等额本金：总利息=〔(总贷款额÷还款月数+总贷款额×月利率)+总贷款额÷还款月数×(1+月利率)〕÷2×款月数-总贷款额
            totalLx = parseInt((((totalMoney / totalMon + totalMoney * monRate) + totalMoney / totalMon * (1 + monRate)) / 2 * totalMon - totalMoney));
            var sumMoney = 0;
            for(;i < that.data.month; i++) {
                // 每月利息
                monLx.push(parseInt((totalMoney - reMoney) * monRate));
                // 每月月供
                monYg.push(Math.round(monMoney + (totalMoney - reMoney) * monRate));
                // 已还本金
                reMoney = monMoney * (i + 1) ;
                // 已还钱数
                sumMoney += parseFloat(monYg[i]);
                leftMoney.push(parseInt(totalMoney + totalLx - sumMoney));
            }
            // 每月递减额
            returnData.djMoney = parseInt(djMoney);
        }
        // 每月利息
        returnData.interest = monLx;
        // 总利息
        returnData.toatlInterest = totalLx;
        // 每月月供
        returnData.monYg = monYg;
        // 每月应还本金
        returnData.moMoney = monMoney;
        // 剩余贷款
        returnData.leftMoney = leftMoney;
        // 还款总额
        returnData.totalMoney = totalMoney;
        // 首月月供
        returnData.firstMonYg = typeof monYg == 'number' ?  monYg : monYg[0];
        return returnData;
    };
    return Calculate
});

