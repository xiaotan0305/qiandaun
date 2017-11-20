/**
 * 公共设置
 * by blue
 **/
define("model/setting",[], function (require, exports, module) {
    "use strict";
   var vars=seajs.data.vars;
    module.exports={
        /**
         * 各标签切换状态名称公共设置
         * @type {string}
         */
        BUSINESS_LOANS:1,//商业贷
        FUND_LOANS:2,//公积金贷
        COMBINATION_LOANS:3,//组合贷
        NEWHOUSE_TAX_CALCULATION:4,//新房税费计算
        ESF_TAX_CALCULATION:5,//二手房税费结算
        DOWN_PAYMENT_LOANS:6,//首付贷
        POP_SET:7,// POPVIEW弹出利率设置页面
        RATE_AJAX_URL:vars.siteUrl+"tools/?c=tools&a=ajaxGetLv",//获取利率的接口url
        ESF_TAXS_RESULT_URL: vars.siteUrl+"tools/?a=ajaxesfTaxs&city=bj",//二手房税费计算接口url XFsfdxy 0
        DOWN_PAYMENT_LOANS_INIT_URL:vars.siteUrl+"tools/?c=tools&a=ajaxshoufu&ProCode={ProCode}&DiyaTime={DiyaTime}",
        DOWN_PAYMENT_LOANS_CAL_URL:vars.siteUrl+"tools/?c=tools&a=ajaxshoufuJisuan&ProCode={ProCode}&DiyaTime={DiyaTime}&QiXian={QiXian}&LoanMoney={LoanMoney}&RepayType={RepayType}",
        DOWN_PAYMENT_LOANS_GETDATA_URL:vars.siteUrl+"tools/?c=tools&a=shoufuDetail&ProCode={ProCode}&DiyaTime={DiyaTime}&QiXian={QiXian}&LoanMoney={LoanMoney}&RepayType={RepayType}",//首付贷接口url获取期限,还款方式,月利率
        POPRATE:8,// 除首付贷的页面弹出利率设置的窗口
        POPSFRATE:9// 首付贷的页面弹出利率设置的窗口
        //TODO：其他常量，如地址等等在这里声明
    };
});
