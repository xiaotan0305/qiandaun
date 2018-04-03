/**
 * Created by user on 2016/7/15.
 * 计算结果
 */
define('view/calView',['view/resultCom','util/common'], function (require) {
    'use strict';
    require('view/resultCom');
    var common = require('util/common');
    // 商业贷和公积金贷结果页
    Vue.component('reBusiness',{
        template: '<section class="jsresults resultBox mt8" style="display: block;"><div id="resultWraper">'
        + '<result-tab :show-intro0="showIntro0" :show-intro1="showIntro1" v-on:tab-click="handleTab" v-ref:result-tab></result-tab >'
        + '<mg-pie :month-pay="monthPay" v-on:click="detail"></mg-pie>'
        + '<div class="jsresults02 resultList">'
        + '<dl><dt><span>房款总价：</span></dt><dd><span>{{totalMoney}}</span>万元</dd></dl>'
        + '<dl><dt class="blue-i"><span>首付金额：</span></dt><dd><span>{{sfMoney}}</span>万元</dd></dl>'
        + '<dl><dt class="yellow-i"><span>贷款总额：</span></dt><dd><span>{{dkMoney}}</span>万元</dd></dl>'
        + '<dl><dt class="pink-i"><span>支付利息：</span></dt><dd><span>{{payLx}}</span>元</dd></dl>'
        + '<dl><dt><span>利<i></i>率：</span></dt><dd><span>{{rate}}</span>%</dd></dl>'
        + '<dl><dt><span>首月月供：</span></dt><dd><span>{{payMonth}}</span>元/月</dd></dl>'
        + '<dl v-show="showDiffer"><dt><span>每月递减：</span></dt><dd><span>{{different}}</span>元/月</dd></dl>'
        + '</div>'
        + '<p class="gray-b f12 center mt20" id="cankao">以上结果仅供参考</p></div></section>',
        props: ['handleTab','detail'],
        data: function () {
            return {
                showDiffer: false,
                totalMoney: '',
                sfMoney: '',
                dkMoney: '',
                payLx: '',
                rate: '',
                payMonth: '',
                different: '',
                showIntro0: false,
                showIntro1: false,
                monthPay: ''
            };
        },
        events: {
            showResult: function (data) {
                // 生成饼图
                common.autoPie(data.autoPieParams, '#pieCon1');
                this.monthPay = data.payMonthShow;
                // 填充数据
                this.totalMoney = data.totalMoney;
                this.sfMoney = data.sfMoney;
                this.dkMoney = data.dkMoney;
                this.payLx = data.payLx;
                this.rate = data.rate;
                this.payMonth = data.payMonth;
                // 每月递减(等额本息才有)
                this.different = data.payInfo.different;

                // this.showResult = true;
                // 页面滚动
                // $(document).scrollTop(320);
            },
            // 点击头部切换tab时初始化结果页面,默认等额本息方式计算
            payMethod: function () {
                this.$refs.resultTab.class0 = 'active';
                this.$refs.resultTab.class1 = '';
                this.showDiffer = false;
            }
        }
    });
    // 组合贷结果页
    Vue.component('reCombination',{
        replace: true,
        props: ['handleTab','detail'],
        template: '<section class="jsresults resultBox mt8" style="display: block;"><div id="resultWraper">'
        + '<result-tab :show-intro0="showIntro0" :show-intro1="showIntro1" v-on:tab-click="handleTab" v-ref:result-tab></result-tab >'
        + '<mg-pie :month-pay="monthPay" v-on:click="detail"></mg-pie>'
        + '<div class="jsresults02 resultList">'
        + '<dl><dt><span>还款总价：</span></dt><dd><span>{{hkTotalMoney}}</span>元</dd></dl>'
        + '<dl><dt class="blue-i"><span>贷款总价：</span></dt><dd><span>{{dkMoney}}</span>元</dd></dl>'
        + '<dl><dt class="yellow-i"><span>支付利息：</span></dt><dd><span>{{payLx}}</span>元</dd></dl>'
        + '<dl><dt><span>首月月供：</span></dt><dd><span>{{monthAvgPay}}</span>元/月</dd></dl>'
        + '<dl v-show="showDiffer"><dt><span>每月递减：</span></dt><dd><span>{{different}}</span>元/月</dd></dl>'
        + '<dl v-show="show1"><dt><span>{{monthStart}}</span></dt><dd><span>{{payMonth1}}</span>元/月</dd></dl>'
        + '<dl v-show="show1"><dt><span>每月递减：</span></dt><dd><span>{{differentAfter}}</span>元/月</dd></dl>'
        + '<dl v-show="show0"><dt><span>{{showBefore}}</span></dt><dd><span>{{monthAvgPay}}</span>元/月</dd></dl>'
        + '<dl v-show="show0"><dt><span>{{showAfter}}</span></dt><dd><span>{{payMonth}}</span>元/月</dd></dl>'
        + '</div>' + '<p class="gray-b f12 center mt20" id="cankao">以上结果仅供参考</p></div></section>',
        data: function () {
            return {
                showDiffer: false,
                hkTotalMoney: '',
                dkMoney: '',
                payLx: '',
                rate: '',
                payMonth: '',
                payMonth1: '',
                different: '',
                differentAfter: '',
                monthStart: '',
                showBefore: '',
                showAfter: '',
                showIntro0: false,
                showIntro1: false,
                monthAvgPay: '',
                show0: false,
                show1: false,
                yearFlag: false,
                monthPay: '',
                payMethodType: '0'
            };
        },
        events: {
            showResult: function (data) {
                this.yearFlag = data.yearFlag;
                this.payMethodType = data.payMethodType;
                // 贷款年数不同时 显示相关项
                if (!data.yearFlag) {
                    if (this.payMethodType === '0') {
                        // 等额本金
                        this.show0 = true;
                        this.show1 = false;
                    } else {
                        // 等额本息
                        this.show1 = true;
                        this.show0 = false;
                    }
                }else {
                    this.show0 = false;
                    this.show1 = false;
                }
                // 生成饼图
                common.autoPie(data.autoPieParams, '#pieCon1');
                this.monthPay = data.payMonthShow;
                // 填充数据
                this.hkTotalMoney = data.hkTotalMoney;
                this.dkMoney = data.dkMoney;
                this.payLx = data.payLx;
                this.monthAvgPay = data.payInfo.monthAvgPay;
                // 每月递减
                this.different = (Number(data.payInfo.dk.different) + Number(data.payInfo.gjj.different)).toFixed(2);
                // 年数不同,等额本息
                // 相差年数
                var year = Number(data.payInfo[data.longTimeDai].year) - Number(data.payInfo[data.shortTimeDai].year);
                this.showBefore = '前' + data.payInfo[data.shortTimeDai].year + '年月供: ';
                this.showAfter = '后' + year + '年月供: ';
                // data.payInfo.monthAvgPay;
                this.payMonth = Math.ceil(data.payInfo[data.longTimeDai].payMonth);
                // 年数不同, 等额本金
                var monthStart = Number(data.payInfo[data.shortTimeDai][data.shortTimeDai + 'Month']) + 1;
                this.monthStart = '第' + monthStart + '月月供';
                this.payMonth1 = Math.ceil(data.payInfo[data.longTimeDai].payMonth);
                this.differentAfter = data.payInfo[data.longTimeDai].different;

                // 页面滚动
                // $(document).scrollTop(320);
            },
            // 点击头部切换tab时初始化结果页面,默认等额本息方式计算
            payMethod: function () {
                this.$refs.resultTab.class0 = 'active';
                this.$refs.resultTab.class1 = '';
                this.showDiffer = false;
                if (!this.yearFlag) {
                    this.show0 = true;
                    this.show1 = false;
                }
            }
        }
    });
    // 税费结果页
    Vue.component('reTax',{
        replace: true,
        props: ['handleTab'],
        template: '<section class="jsresults resultBox mt8" style="display: block;"><div id="resultWraper">'
        + '<div class="jsresults10"><div class="result-t"><h2>税金明细</h2></div>'
        + '<div class="cirqueBox"><div class="cirque"><div class="" id="pieCon2"></div><div class="intro"><p>参考税金</P></div></div></div></div>'
        + '<div class="jsresults03 resultList">'
        + '<dl v-show="showXf"><dt><span>房款总价：</span></dt><dd><span>{{totalPrice}}</span>万元</dd></dl>'
        + '<dl v-show="showEsf"><dt><span>房款总价：</span></dt><dd><span>{{housePrice}}</span>万元</dd></dl>'
        //+ '<dl v-show="showXf"><dt class="blue-i" ><span>公证费：</span></dt><dd id="gzf"><span>{{gzMoney}}</span>元</dd></dl>'
       // + '<dl v-show="showXf"><dt class="yellow-i" ><span>委托办理产权费：</span></dt><dd id="wt_sxf"><span>{{gzMoney}}</span>元</dd></dl>'
        // + '<dl v-show="showXf"><dt class="org-i" ><span>房屋买卖手续费：</span></dt><dd id="house_sxf"><span>{{sxMoney}}</span>元</dd></dl>'
        + '<dl v-show="showXf"><dt class="green-i"><span>契税：</span></dt><dd><span>{{qTaxs}}</span>元</dd></dl>'
        + '<dl v-show="showEsf"><dt class="green-i"><span>契税：</span></dt><dd><span>{{qTax}}</span>元</dd></dl>'
        + '<dl v-show="showEsf"><dt class="blue-i" ><span>增值税：</span></dt><dd><span>{{yhTax}}</span>元</dd></dl>'
        + '<dl v-show="showYh"><dt class="pink-i"><span>印花税：</span></dt><dd><span>{{individualTax}}</span>元</dd></dl>'
        + '<dl v-show="showXf"><dt class="org-i"><span>合同工本费：</span></dt><dd><span>{{htgbTax}}</span>元</dd></dl>'
        + '<dl v-show="showEsf"><dt class="yellow-i" ><span>个人所得税：</span></dt><dd><span>{{stamptax}}</span>元</dd></dl>'
        + '<dl v-show="showEsf"><dt class="org-i" ><span>工本印花税：</span></dt><dd><span>{{costtax}}</span>元</dd></dl>'
        + '<dl v-show="showEsf"><dt class="pink-r-i" ><span>综合地价款：</span></dt><dd><span>{{Syntheticaltax}}</span>元</dd></dl>'
        + '<dl v-show="showXf"><dt class="blue-i" ><span>维修基金：</span></dt><dd><span>{{wxjjTax}}</span>元</dd></dl>'
        + '<dl v-show="showTdcrj"><dt class="red-i"><span>土地出让金：</span></dt><dd><span>{{tdcrjTax}}</span>元</dd></dl>'
        + '<dl v-show="showXf"><dt class="yellow-i" ><span>权属登记费：</span></dt><dd><span>{{qsdjTax}}</span>元</dd></dl>'
        + '<dl v-show="showXf"><dt><span>税金总额：</span></dt><dd><span>{{taxTotal}}</span>元</dd></dl>'
        + '<dl v-show="showEsf"><dt><span>税金总额：</span></dt><dd><span>{{total}}</span>元</dd></dl></div>'
        + '<p class="gray-b f12 center mt20" id="cankao">以上结果仅供参考</p></div></section>',
        data: function () {
            return {
                showEsf: false,
                showXf: true,
                housePrice: '',
                qTax: '',
                costtax: '',
                individualTax: '',
                stamptax: '',
                Syntheticaltax: '',
                total: '',
                showYh:true,
                showTdcrj:true,
                totalPrice: '',
                gzMoney: '',
                sxMoney: '',
                taxTotal: '',
                qTaxs: '',
                yhTax: '',
                htgbTax:'',
                wxjjTax:'',
                qsdjTax:'',
                tdcrjTax:''
            };
        },
        events: {
            showResult: function (data) {
                // 计算的数据填入结果页面
                // 生成饼图
                common.autoPie(data.autoPieParams, '#pieCon2');
                if (this.$parent.view === 'esf') {
                    this.showXf = false;
                    this.showEsf = true;
                    this.housePrice = data.housePrice;
                    this.qTax = data.qTax;
                    this.showYh = true;
                    this.yhTax = data.yhTax;
                    this.individualTax = data.individualTax;
                    this.stamptax = data.stamptax;
                    this.costtax = data.costtax;
                    this.Syntheticaltax = data.Syntheticaltax;
                    this.total = data.total;
                    this.tdcrjTax = data.tudichurangjin;
                    this.showTdcrj = data.tudichurangjin !== undefined;
                }else {
                    this.showXf = true;
                    this.showEsf = false;
                    this.totalPrice = data.totalPrice;
                    this.showTdcrj = false;
                    //this.gzMoney = data.gzMoney;
                    //this.sxMoney = data.sxMoney;this.taxTotal = data.taxTotal;
                    this.qTaxs = data.qTaxs;
                    //this.yhTax = data.yhTax;
                    this.htgbTax = data.htgbTax;
                    this.wxjjTax = data.wxjjTax;
                    this.qsdjTax = data.qsdjTax;
                    this.taxTotal = data.taxTotal;
                    this.showYh = data.yinhuashui !== undefined;
                    this.individualTax = data.yinhuashui;
                }
                // 页面滚动
                // $(document).scrollTop(320);
            }
        }
    });
});

