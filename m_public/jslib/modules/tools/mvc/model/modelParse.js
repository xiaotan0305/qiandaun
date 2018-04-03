/**
 * 数据模型
 * by blue
 */
define('model/modelParse', ['jquery', 'model/setting', 'util/common', 'modules/mycenter/yhxw'], function (require, exports, module) {
    'use strict';
    var preLoad = ['model/setting', 'util/common'];
    require.async(preLoad);
    var yhxw = require('modules/mycenter/yhxw');
    var $ = require('jquery'),
        setting = require('model/setting'),
        common = require('util/common');

    function modelParse() {
        // 各计算器的公共数据声明
        this.totalData = {
            totalMoney: undefined,
            dkTotalMoney: undefined,
            sfRate: undefined,
            sfRateHtml: undefined,
            sfMoney: undefined,
            businessRate: undefined,
            fundRate: undefined
        };
        //  所有利率数据
        this.rateArr = {
            businessRateArr: undefined,
            fundRateArr: undefined,
            businessRateArr10: undefined,
            fundRateArr10: undefined,
            businessRateArr7: undefined,
            fundRateArr7: undefined,
            businessRateArr85: undefined,
            fundRateArr85: undefined,
            businessRateArr88: undefined,
            fundRateArr88: undefined,
            businessRateArr90: undefined,
            fundRateArr90: undefined,
            businessRateArr95: undefined,
            fundRateArr95: undefined,
            businessRateArr11: undefined,
            fundRateArr11: undefined
        };
        // 栏目状态声明，根据此值判断当前为哪一个栏目
        this.pageType;

        // 当前还款方式 0:等额本息 1:等额本金
        this.payMethodType = 0;

        // 为详情页计算存储的数据变量
        this.payInfo;

        // 当前的网络状态
        this.network = true;
    }
    modelParse.prototype = {
        /* 获取url 主要是通过type值获取url以及title值 目的是动态修改url*/
        getUrlByPageType: function (type) {
            var obj;
            switch (type) {
                case setting.BUSINESS_LOANS:
                    obj = {url: 'daikuan', title: '【房贷计算器|房贷计算器最新2016】- 搜房网'};
                    break;
                case setting.FUND_LOANS:
                    obj = {url: 'gjj', title: '【公积金贷款计算器|住房公积金贷款计算器2016】- 搜房网'};
                    break;
                case setting.COMBINATION_LOANS:
                    obj = {url: 'zhdai', title: '【组合贷款计算器|组合贷款计算器最新2016】- 搜房网'};
                    break;
                case setting.NEWHOUSE_TAX_CALCULATION:
                    obj = {url: 'taxs', title: '【税费计算器|购房税费计算器2016】- 搜房网'};
                    break;
                case setting.ESF_TAX_CALCULATION:
                    obj = {url: 'esftaxs', title: '【二手房税费计算器|二手房交易税费计算器2016】- 搜房网'};
                    break;
                case setting.DOWN_PAYMENT_LOANS:
                    obj = {url: 'sfdai', title: '【首付贷款计算器|新房/二手房首付贷款计算器】- 搜房网'};
                    break;
                case setting.POP_SET:
                    obj = {url: '', title: '设置页面'};
                    break;
            }
            return obj;
        },

        /*
         *往history塞url
         * @param isReplace该值是确定push还是replace
         */
        pushStateFn: function (isPush,pageType) {
            var that = this;
            // 协议和主机
            var currentUrl = location.protocol + '//' + location.host;
            var obj = that.getUrlByPageType(pageType);
            var url = currentUrl + '/tools/' + obj.url + '.html';
            document.title = obj.title;
            if (isPush) {
                // 向 history 添加当前页面的记录
                window.history.pushState({title: obj.title}, obj.title, url);
            } else {
                // 向 history 修改当前页面的记录
                window.history.replaceState({title: obj.title}, obj.title, url);
            }
        },

        /*
         * 比较数据 与公共数据进行比较和之前存储的数据进行比较
         * */
        compareData: function (data) {
            var that = this;
            if (data) {
                for (var op in that.totalData) {
                    if (data[op]) {
                        that.totalData[op] = data[op];
                    }
                }
            }
            // 该处 是从获取到的数据与首次加载时获取的数据进行比较 ??
            if (!data.businessRate && that.totalData.common.businessRate) {
                data.businessRate = that.totalData.common.businessRate;
            }
            if (!data.funRate && that.totalData.common.fundRate) {
                data.funRate = that.totalData.common.funRate;
            }
        },

        /**
         * 商业贷款/公积金贷款/组合贷计算
         * @param data 需要的数据
         */
        calResult: function (data) {
            var that = this;
            if (data.type !== undefined) {
                // 等额本息 等额本金
                that.payMethodType = data.type;
            }
            // 用户行为分析
            var pageId = '',
                b = '',
                maimaParams = {};

            var resultData = {};
            that.pageType = data.pageType;
            switch (data.pageType) {
                // 商业贷款
                case setting.BUSINESS_LOANS:
                // 公积金贷款
                case setting.FUND_LOANS:
                    resultData = common.calMethod(data, that.payMethodType);
                    that.payInfo = {
                        // 支付详情页存储的变量
                        // 还款总额
                        hkmoney: common.formatNum(data.dkMoney + resultData.payLx),
                        // 贷款总额
                        dkmoney: common.formatNum(data.dkMoney),
                        // 总利息
                        payLx: resultData.payLx,
                        // 贷款月数
                        dkMonth: data.ajYear * 12,
                        // 月供
                        monthAvgPay: resultData.payMonth,
                        monthPayOrigin: resultData.payMonth,
                        // 月利率(没用到)
                        monthRate: data.initrateVal * 0.01 / 12,
                        // 每月递减
                        different: resultData.payDifferent,
                        // 还款方式
                        payMethodType: that.payMethodType
                    };
                    resultData.pageType = data.pageType;
                    resultData.totalMoney = common.formatNum(data.totalMoney);
                    resultData.sfMoney = common.formatNum(data.sfMoney);
                    resultData.dkMoney = common.formatNum(data.dkMoney / 10000);
                    // resultData.payLx += 'detailCalResult';
                    resultData.rate = parseFloat(Number(data.initrateVal).toFixed(3));
                    resultData.payMonthShow = '￥' + Math.ceil(resultData.payMonth);
                    resultData.payMonth = parseInt(resultData.payMonth);
                    resultData.autoPieParams = [{value: parseInt(data.sfMoney), color: '#6ebfff'},
                        {value: parseInt(parseInt(data.dkMoney) / 10000), color: '#ffda7c'},
                        {value: parseInt(parseInt(resultData.payLx) / 10000), color: '#ff70a0'}];
                    resultData.payInfo = that.payInfo;
                    // event.trigger('calView:model:show', resultData);

                    // 用户统计参数
                    pageId = that.pageType === 1 ? 'mjrloancalsyd' : 'mjrloancalgjjd';
                    b = that.pageType === 1 ? 146 : 147;
                    maimaParams = {
                        'vmg.page': pageId,
                        'vmj.totalprice': resultData.totalMoney,
                        'vmj.downpayment': resultData.sfMoney + encodeURIComponent('万元'),
                        'vmj.loanamount': resultData.dkMoney + encodeURIComponent('万元'),
                        'vmj.loantime': that.payInfo.dkMonth + encodeURIComponent('期'),
                        'vmj.annualinterestrate': resultData.rate + encodeURIComponent('%'),
                        'vmj.paymentinterest': resultData.payLx + encodeURIComponent('元'),
                        'vmj.monthlyrepayment': resultData.payMonth + encodeURIComponent('元/月')
                    };
                    return resultData;
                    break;
                // 组合贷款
                case setting.COMBINATION_LOANS:
                    var resultData1 = common.calMethod(data.dk, that.payMethodType);
                    var resultData2 = common.calMethod(data.gjj, that.payMethodType);
                    resultData1.hkTotalMoney = resultData1.payLx + data.dk.dkMoney;
                    resultData2.hkTotalMoney = resultData2.payLx + data.gjj.dkMoney;
                    resultData.pageType = that.pageType;
                    resultData.hkTotalMoney = Math.ceil(resultData1.hkTotalMoney + resultData2.hkTotalMoney);
                    resultData.dkMoney = Math.ceil((data.dk.dkMoney + data.gjj.dkMoney));
                    resultData.payLx = Math.ceil(resultData1.payLx) + Math.ceil(resultData2.payLx);
                    resultData.payMonth = Math.ceil(resultData1.payMonth) + Math.ceil(resultData2.payMonth);
                    resultData.autoPieParams = [{value: parseInt(resultData.dkMoney / 10000), color: '#6ebfff'},
                        {value: parseInt(resultData.payLx / 10000), color: '#feda7f'}];
                    that.payInfo = {
                        // 支付详情页存储的变量;
                        // (2016-04-21,zhangcongfeng@fang.com)增加different:每月递减值;year贷款年数;payMethodType:还款方式;payMonth:月供(在组合贷页面有区分)
                        dk: {
                            dkMoney: common.formatNum(data.dk.dkMoney),
                            dkMonth: data.dk.monthNum, monthPayOrigin: resultData1.payMonth,
                            monthRate: data.dk.monthRate,
                            hkmoney: resultData1.hkTotalMoney,
                            different: resultData1.payDifferent,
                            year: data.dk.monthNum / 12,
                            payMonth: resultData1.payMonth
                        },
                        gjj: {
                            gjjMoney: common.formatNum(data.gjj.dkMoney),
                            gjjMonth: data.gjj.monthNum, monthPayOrigin: resultData2.payMonth,
                            monthRate: data.gjj.monthRate,
                            hkmoney: resultData2.hkTotalMoney,
                            different: resultData2.payDifferent,
                            year: data.gjj.monthNum / 12,
                            payMonth: resultData2.payMonth
                        },
                        type: that.pageType,
                        hkmoney: common.formatNum(resultData1.hkTotalMoney + resultData2.hkTotalMoney),
                        payLx: resultData.payLx,
                        monthAvgPay: Math.ceil(resultData.payMonth),
                        payMethodType: that.payMethodType
                    };
                    // resultData.payLx = resultData.payLx + "\u5143";
                    // resultData.dkMoney = resultData.dkMoney + "\u5143";
                    resultData.hkTotalMoney = common.formatNum(resultData1.hkTotalMoney + resultData2.hkTotalMoney);
                    resultData.payMonthShow = '￥' + Math.ceil(resultData.payMonth);
                    // todo:
                    // resultData.payMonth = resultData.payMonth + "\u6708";
                    resultData.payInfo = that.payInfo;
                    // 组合贷页面增加判断参数yearFlag:贷款年限是否相同
                    resultData.yearFlag = data.gjj.monthNum === data.dk.monthNum;
                    // 组合贷页面longTimeDai时间较长的贷款shortTimeDai事件较短的贷款
                    resultData.longTimeDai = data.gjj.monthNum > data.dk.monthNum ? 'gjj' : 'dk';
                    resultData.shortTimeDai = data.gjj.monthNum > data.dk.monthNum ? 'dk' : 'gjj';
                    // event.trigger('calView:model:show', resultData);
                    // 用户统计参数
                    pageId = 'muchomeloanzhd';
                    b = 148;
                    var sydEncode = encodeURIComponent('商业贷');
                    var gjjEncode = encodeURIComponent('公积金贷');
                    maimaParams = {
                        'vmg.page': pageId,
                        'vmj.annualinterestrate': data.dk.initrateVal + encodeURIComponent('%') + '^' + sydEncode
                        + ',' + data.gjj.initrateVal + encodeURIComponent('%') + '^' + gjjEncode,
                        'vmj.loanamount': common.formatNum(data.dk.dkMoney) / 10000 + encodeURIComponent('万元') + '^' + sydEncode
                        + ',' + common.formatNum(data.gjj.dkMoney) / 10000 + encodeURIComponent('万元') + '^' + gjjEncode,
                        'vmj.loantime': data.dk.monthNum + encodeURIComponent('期') + '^' + sydEncode
                        + ',' + data.gjj.monthNum + encodeURIComponent('期') + '^' + gjjEncode,
                        'vmj.repaymentamount': resultData.hkTotalMoney + encodeURIComponent('元'),
                        'vmj.paymentinterest': resultData.payLx + encodeURIComponent('元'),
                        'vmj.totalprice': Math.floor(Number(resultData.dkMoney) / 10000),
                        'vmj.monthlyrepayment': resultData.payMonth + encodeURIComponent('元/月')
                    };
                    return resultData;
                    break;
                // 税费计算-新房
                case setting.NEWHOUSE_TAX_CALCULATION:
                    var qTaxs = 1;
                    var sxMoney = 0;
                    var gzMoney = 0;
                    var yhTax = 0;
                    var qTax = 0;
                    var area = data.houseArea;
                    var totalPrice = common.formatNum(area) * common.formatNum(data.housePrice);
                    gzMoney = parseInt(totalPrice * 0.003);
                    yhTax = parseInt(totalPrice * 0.0005);
                    resultData.totalPrice = parseInt(totalPrice / 10000);
                    resultData.yhTax = parseInt(yhTax);
                    resultData.gzMoney = parseInt(gzMoney);

                    /*  1. 当用户选择普通住宅且唯一，需要判断房屋面积，面积在90平米（含90平米）以下的，契税税率为 1%；
                     2. 面积在90平米至144平米(含144平米)区间的，契税税率为1.5%;
                     3. 面积大于144平米的，契税税率为3%
                     1. 只要选择非普通住房或非唯一住房，，均按照3%的契税税率。*/
                    if (data.houseProp == 1 && data.isUnique) {
                        if (area <= 90) {
                            qTaxs = 0.01;
                        } else if (area < 145 && area > 90) {
                            qTaxs = 0.015;
                        } else {
                            qTaxs = 0.03;
                        }
                    } else if (data.houseProp == 0 || data.noUnique) {
                        qTaxs = 0.03;
                    }
                    qTax = totalPrice * qTaxs;
                    resultData.qTaxs = parseInt(qTax);
                    resultData.housePay = resultData.gzMoney;
                    if (area <= 120) {
                        sxMoney = 500;
                    } else if (area > 120 && area < 5000) {
                        sxMoney = 1500;
                    } else {
                        sxMoney = 5000;
                    }
                    resultData.sxMoney = parseInt(sxMoney);
                    resultData.taxTotal = (parseInt(yhTax + gzMoney + qTax + gzMoney + sxMoney));
                    resultData.pageType = that.pageType;
                    resultData.autoPieParams = [
                        {value: yhTax, color: '#ff70a0'},
                        {value: gzMoney, color: '#6ec0ff'},
                        {value: qTax, color: '#b8e993'},
                        {value: gzMoney, color: '#feda7f'},
                        {value: sxMoney, color: '#fea484'}
                    ];
                    // event.trigger('calView:model:show', resultData);
                    // 用户统计参数
                    pageId = 'muchomeloansfxf';
                    b = 149;
                    var genre = data.houseProp == 1 ? '普通住宅' : '非普通住宅',
                        isonly = data.isUnique ? '是' : '否';
                    maimaParams = {
                        'vmg.page': 'muchomeloansfxf',
                        'vmj.area': area + encodeURIComponent('㎡'),
                        'vmj.unitprice': data.housePrice + encodeURIComponent('元'),
                        'vmj.dwellingtype': encodeURIComponent(genre),
                        'vmj.isonly': encodeURIComponent(isonly),
                        'vmj.notarialfees': gzMoney + encodeURIComponent('元'),
                        'vmj.propertyfees': gzMoney + encodeURIComponent('元'),
                        'vmj.commissionfees': sxMoney + encodeURIComponent('元'),
                        'vmj.contracttax': qTax + encodeURIComponent('元'),
                        'vmj.stamptax': yhTax + encodeURIComponent('元'),
                        'vmj.tax': resultData.taxTotal + encodeURIComponent('元')
                    };
                    return resultData;
                    break;
                // 税费计算-二手房
                case setting.ESF_TAX_CALCULATION:
                    var url = common.templateFn(setting.ESF_TAXS_RESULT_URL, {
                        area: data.houseArea,
                        price: data.housePrice,
                        forfiveyearsIf: data.forfiveyearsIf,
                        firsthouseIf: data.firsthouseIf,
                        onlyhouseIf: data.onlyhouseIf,
                        housenature: data.housenature
                    });
                    $.getJSON(url, null, function (data) {
                        if (data) {
                            resultData.housePrice = common.formatNum(data.house_total);
                            resultData.qTax = parseInt(data.deed);
                            resultData.yhTax = parseInt(data.saletax);
                            resultData.individualTax = parseInt(data.individualIncometax);
                            resultData.stamptax = parseInt(data.stamptax);
                            resultData.costtax = parseInt(data.costtax);
                            resultData.Syntheticaltax = parseInt(data.Syntheticaltax);
                            resultData.total = parseInt(data.total);
                            resultData.pageType = that.pageType;
                            resultData.autoPieParams = [
                                {value: parseInt(data.deed), color: '#baea96'},
                                {value: data.saletax, color: '#6dbffe'},
                                {value: parseInt(data.stamptax), color: '#fffa59'},
                                {value: parseInt(data.individualIncometax), color: '#fd6e9e'},
                                {value: parseInt(data.costtax), color: '#fda585'},
                                {value: parseInt(data.Syntheticaltax), color: '#ff7c7d'}
                            ];
                            // event.trigger('calView:model:show', resultData);
                            // 用户统计参数
                            var features = '';
                            $('#houseFeature li input[type=checkbox]').each(function () {
                                if ($(this).attr('checked')) {
                                    features += ',' + encodeURIComponent($(this).parent().text());
                                }
                            });
                            pageId = 'muchomeloansfesf';
                            b = 149;
                            maimaParams = {
                                'vmg.page': 'muchomeloansfesf',
                                'vmj.area': data.house_area + encodeURIComponent('㎡'),
                                'vmj.totalprice': data.house_total,
                                'vmj.propertycardyear': encodeURIComponent($('#houseYear').html().trim()),
                                'vmj.dwellingtype': encodeURIComponent($('#esfHouseProp').html().trim()),
                                'vmj.feature': features.substring(1),
                                'vmj.contracttax': data.deed + encodeURIComponent('元'),
                                'vmj.salestax': data.saletax + encodeURIComponent('元'),
                                'vmj.stamptax': data.stamptax + encodeURIComponent('元'),
                                'vmj.incometax': data.individualIncometax + encodeURIComponent('元'),
                                'vmj.coststamptax': data.costtax + encodeURIComponent('元'),
                                'vmj.integratedcost': data.Syntheticaltax + encodeURIComponent('元'),
                                'vmj.tax': resultData.total + encodeURIComponent('元')
                            };
                            // yhxw({type: b, pageId: pageId, params: maimaParams});
                        }
                    }).fail(function () {
                        $('#cankao').hide();
                        alert('请检查网络');
                        return;
                    });
                    return resultData;
                    break;
                // 首付贷页面(已删除)
                case setting.DOWN_PAYMENT_LOANS:
                    data.loanMoney = common.formatNum(data.loanMoney * 10000);
                    var url = common.templateFn(setting.DOWN_PAYMENT_LOANS_CAL_URL, {
                        ProCode: data.procode, DiyaTime: data.diYaTime,
                        QiXian: data.selQxVal, LoanMoney: data.loanMoney, RepayType: data.RepayType
                    });
                    var resultData = {};
                    resultData.pageType = that.pageType;
                    that.payInfo = resultData.payInfo = {
                        ProCode: data.procode, DiyaTime: data.diYaTime,
                        QiXian: data.selQxVal, LoanMoney: data.loanMoney, RepayType: data.RepayType
                    };
                    $.getJSON(url, function (json) {
                        if (json.result == '100') {
                            var lx = common.formatNumStr(json.lx / 10000, 3);
                            var loanMoney = common.formatNum(data.loanMoney / 10000);
                            resultData.autoPieParams = [{value: lx, color: '#ff70a0'}, {
                                value: loanMoney,
                                color: '#ffda7c'
                            }];
                            resultData.lx = lx;
                            resultData.loanMoney = loanMoney;
                            // event.trigger('calView:model:show', resultData);
                        } else {
                            alert('获取支付利息出错');
                            return;
                        }
                        // 用户统计参数
                        pageId = 'muchomeloansfd';
                        b = 29;
                        maimaParams = {
                            'vmg.page': 'muchomeloansfd',
                            'vmg.loanapplication': data.procode,
                            'vmg.ismortgage': data.noDyVal,
                            'vmg.totalprice': data.totalMoney,
                            'vmg.downpayment': data.sfRate,
                            'vmg.loanamount': data.loanMoney,
                            'vmg.loantime': $('#selQx').val(),
                            'vmg.repaymentway': $('#payWay').val(),
                            'vmg.annualinterestrate': $('#monthRate').val(),
                            'vmg.paymentinterest': lx
                        };
                    }).fail(function () {
                        alert('请检查网络');
                        return;
                    });
                    return resultData;
                    break;
            }
            if (that.pageType != 5) {
                // 不是二手房税费计算的话统一走这个，二手房是异步的需要单独调用
                // yhxw({type: b, pageId: pageId, params: maimaParams});
            }
        },

        /*
         详情计算
         * */
        detailCalResult: function (type) {
            var that = this;
            var resultData;
            if (that.payInfo) {
                resultData = that.payInfo;
            } else {
                return;
            }
            if (!type) {
                resultData.type = that.payMethodType;
            } else {
                resultData.type = type;
            }
            resultData.pageType = that.pageType;
            switch (that.pageType) {
                case setting.BUSINESS_LOANS:
                case setting.FUND_LOANS:
                    resultData = that.detailCal(resultData);
                    break;
                case setting.COMBINATION_LOANS:
                    resultData = that.detailCal(resultData);
                    break;
                case setting.DOWN_PAYMENT_LOANS:
                    resultData = that.sfDetailCal(resultData);
                    break;

            }
            return resultData;
            // event.trigger('calDetailView:model:show', resultData);
        },

        /*
         * 首付贷页面的详情计算*/
        sfDetailCal: function (data) {
            var url = common.templateFn(setting.DOWN_PAYMENT_LOANS_GETDATA_URL, {
                ProCode: data.ProCode, DiyaTime: data.DiyaTime,
                QiXian: data.QiXian, LoanMoney: data.LoanMoney, RepayType: data.RepayType
            });
            return {url: url, pageType: this.pageType};
        },

        /**
         * 计算详情函数
         **/
        detailCal: function (data) {
            var month = 0;
            var year = 0;
            var itemArr = new Array();
            var cal = {};
            var calZh1 = {};
            var calZh2 = {};
            var showValueObj = {};
            var calMoney = '';
            var syTotal = 0;
            if (data.pageType == setting.BUSINESS_LOANS || data.pageType == setting.FUND_LOANS) {
                month = data.dkMonth;
                syTotal = data.hkmoney;
                year = month / 12;
                for (var i = 1; i <= year; i++) {
                    for (var j = 1; j <= 12; j++) {
                        data.i = j + (i - 1) * 12;
                        cal = common.everyMonthPay(data);
                        cal.sy = Number(cal.sy);
                        cal.bj = Number(cal.bj);
                        cal.bx = Number(cal.bx);
                        if (data.type == 0) {
                            if (cal.sy < 0) {
                                cal.sy = 0;
                            }
                            calMoney = cal.bj + cal.bx;
                            itemArr.push([j + '月', '￥' + Math.floor(calMoney), '￥' + Math.floor(cal.bj), '￥' + Math.floor(cal.bx), '￥' + Math.floor(cal.sy)]);
                        } else if (data.type == 1) {
                            syTotal = syTotal - cal.bj - cal.bx;
                            calMoney = Math.floor(cal.bj) + Math.floor(cal.bx);
                            if (syTotal < 0) {
                                syTotal = 0;
                            }
                            itemArr.push([j + '月', '￥' + Math.floor(calMoney), '￥' + Math.floor(cal.bj), '￥' + Math.floor(cal.bx), '￥' + Math.floor(syTotal)]);
                        }
                    }
                }
                showValueObj = {
                    hkmoney: common.formatNum(data.hkmoney / 10000),
                    dkmoney: common.formatNum(data.dkmoney / 10000),
                    payLx: common.formatNum(data.payLx / 10000),
                    dkmonth: data.dkMonth + '(' + data.dkMonth / 12 + '年)',
                    monthAvgPay: data.monthAvgPay
                };
                itemArr.payInfo = showValueObj;
            } else if (data.pageType == setting.COMBINATION_LOANS) {
                if (data.dk.dkMoney == 0 && data.gjj.gjjMoney != 0) {
                    year = data.gjj.gjjMonth / 12;
                } else if (data.gjj.gjjMoney == 0 && data.dk.dkMoney != 0) {
                    year = data.dk.dkMonth / 12;
                } else if (data.dk.dkMoney != 0 && data.gjj.gjjMoney != 0) {
                    if (data.dk.dkMonth >= data.gjj.gjjMonth) {
                        year = data.dk.dkMonth / 12;
                    } else {
                        year = data.gjj.gjjMonth / 12;
                    }
                }
                syTotal = data.hkmoney;
                for (var i = 1; i <= year; i++) {
                    for (var j = 1; j <= 12; j++) {
                        if (data.dk.dkMonth >= j + (i - 1) * 12) {
                            data.monthRate = data.dk.monthRate;
                            data.monthPayOrigin = data.dk.monthPayOrigin;
                            data.dkMonth = data.dk.dkMonth;
                            data.dkmoney = data.dk.dkMoney;
                            data.hkmoney = data.dk.hkmoney;
                            data.i = j + (i - 1) * 12;
                            calZh1 = common.everyMonthPay(data);
                        } else {
                            calZh1.bj = 0;
                            calZh1.bx = 0;
                            calZh1.sy = 0;
                        }
                        if (data.gjj.gjjMonth >= j + (i - 1) * 12) {
                            data.dkmoney = data.gjj.gjjMoney;
                            data.monthRate = data.gjj.monthRate;
                            data.monthPayOrigin = data.gjj.monthPayOrigin;
                            data.dkMonth = data.gjj.gjjMonth;
                            data.hkmoney = data.gjj.hkmoney;
                            data.i = j + (i - 1) * 12;
                            calZh2 = common.everyMonthPay(data);
                        } else {
                            calZh2.bj = 0;
                            calZh2.bx = 0;
                            calZh2.sy = 0;
                        }
                        if (data.type == 0) {
                            var tempSy = calZh1.sy + calZh2.sy;
                            if (tempSy < 0) {
                                tempSy = 0;
                            }
                            var calMonth = Math.floor(calZh1.bj + calZh2.bj) + Math.floor(calZh1.bx + calZh2.bx);
                            itemArr.push([j + '月', '￥' + calMonth, '￥' + Math.floor(calZh1.bj + calZh2.bj), '￥' + Math.floor(calZh1.bx + calZh2.bx), '￥' + Math.floor(tempSy)]);
                        } else if (data.type == 1) {
                            syTotal = syTotal - (calZh1.bj + calZh1.bx + calZh2.bj + calZh2.bx);
                            if (syTotal < 0) {
                                syTotal = 0;
                            }
                            var calMonth = Math.floor(calZh1.bx + calZh2.bx) + Math.floor(calZh1.bj + calZh2.bj);
                            itemArr.push([j + '月', '￥' + calMonth, '￥' + Math.floor(calZh1.bj + calZh2.bj), '￥' + Math.floor(calZh1.bx + calZh2.bx), '￥' + Math.floor(syTotal)]);
                        }
                    }
                }
                showValueObj = {
                    hkmoney: common.formatNum((data.dk.hkmoney + data.gjj.hkmoney) / 10000),
                    dkmoney: common.formatNum(data.dk.dkMoney / 10000 + data.gjj.gjjMoney / 10000),
                    gjjmoney: common.formatNum(data.gjj.gjjMoney / 10000),
                    payLx: common.formatNum(data.payLx / 10000),
                    dkmonth: data.dk.dkMonth + '(' + parseInt(data.dk.dkMonth / 12) + '年)',
                    gjjmonth: data.gjj.gjjMonth + '(' + parseInt(data.gjj.gjjMonth / 12) + '年)',
                    monthAvgPay: data.monthAvgPay
                };
                itemArr.payInfo = showValueObj;
            }
            itemArr.pageType = data.pageType;
            itemArr.payMethodType = data.type;
            return itemArr;
        },
        //  根据利率的折扣
        getLvByAjYear: function (pageType, year, rateType, discount) {
            var that = this;
            year = parseInt(year);
            var rateParams = '';
            switch (discount) {
                case '1':
                    rateParams = getRateParams(pageType, year, rateType, that.rateArr.businessRateArr10, that.rateArr.fundRateArr10);
                    break;
                case '0.7':
                    rateParams = getRateParams(pageType, year, rateType, that.rateArr.businessRateArr7, that.rateArr.fundRateArr7);
                    break;
                case '0.85':
                    rateParams = getRateParams(pageType, year, rateType, that.rateArr.businessRateArr85, that.rateArr.fundRateArr85);
                    break;
                case '0.88':
                    rateParams = getRateParams(pageType, year, rateType, that.rateArr.businessRateArr88, that.rateArr.fundRateArr88);
                    break;
                case '0.9':
                    rateParams = getRateParams(pageType, year, rateType, that.rateArr.businessRateArr90, that.rateArr.fundRateArr90);
                    break;
                case '0.95':
                    rateParams = getRateParams(pageType, year, rateType, that.rateArr.businessRateArr95, that.rateArr.fundRateArr95);
                    break;
                case '1.1':
                    rateParams = getRateParams(pageType, year, rateType, that.rateArr.businessRateArr11, that.rateArr.fundRateArr11);
                    break;
            }
            return rateParams;
            //  根据按揭年数 获取相应的利率
            function getRateParams(pageType, year, rateType, rateArr1, rateArr2) {
                var result = '';
                if (pageType == setting.BUSINESS_LOANS || rateType == 1) {
                    if (year <= 1) {
                        result = rateArr1[0];
                    } else if (year > 1 && year <= 3) {
                        result = rateArr1[1];
                    } else if (year > 3 && year <= 5) {
                        result = rateArr1[2];
                    } else if (year > 5 && year <= 30) {
                        result = rateArr1[3];
                    }
                } else if (pageType == setting.FUND_LOANS || rateType == 2) {
                    if (year >= 1 && year <= 5) {
                        result = rateArr2[0];
                    } else if (year > 5 && year <= 30) {
                        result = rateArr2[1];
                    }
                }
                result = {rate: result, discount: discount, rateType: rateType};
                return result;
            }
        }
    };
    module.exports = new modelParse();
});
