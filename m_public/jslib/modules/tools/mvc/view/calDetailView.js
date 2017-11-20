define('view/calDetailView', ['jquery', 'model/setting'], function (require, exports, module) {
    'use strict';
    Vue.component('detailView',{
        template: '<section class="repay" id="detailPage">'
        + '<div class="repay-t" id="listInfo">'
        + '<div class="repay-tab" id="payMethodType">'
        + '<ul><li id="pay0" class="{{class0}}" v-on:click="payment">等额本息</li>'
        + '<li id="pay1" class="{{class1}}" v-on:click="basis">等额本金</li></ul>' + '</div>'
        + '<ul id="monthPay"><li>月均还款(元)：<span class="f16">{{monthAvgPay}}</span></li></ul>' + '<ul id="detailUl">'
        + '<li>还款总额(万): <span>{{hkmoney}}</span></li>'
        + '<li>贷款总额(万): <span>{{dkmoney}}</span></li>'
        + '<li>支付利息(万): <span>{{payLx}}</span></li>'
        + '<li v-show="showSy">贷款月数(月): <span>{{dkmonth}}</span></li>'
        + '<li v-show="showZh">商业贷款月数(月): <span>{{dkmonth}}</span></li>'
        + '<li v-show="showZh">公积金贷款月数(月): <span>{{gjjmonth}}</span></li>'
        + '<li v-show="showOth">月均利息(万): <span>99.60</span></li>' + '</ul>' + '</div>'
        + '<div class="dataList">'
        + '<table cellpadding="0" cellspacing="0" class="dataTable">'
        + '<tr><th width="13%">月份</th><th width="18%">月供</th><th width="20%">月供本金</th><th width="20%">月供利息</th><th width="29%">剩余贷款</th></tr>'
        + '</table><div class="year-box" id="yearChange"><span>第1年</span></div>' + '</div>' + '<div class="data-box">'
        + '<div class="dataList" id="listHtml">' + '</div>' + '</div>' + '</section>',
        props: ['handleTab'],
        data: function () {
            return {
                class0: '',
                class1: '',
                showSy: false,
                showZh: false,
                monthAvgPay: '',
                hkmoney: '',
                dkmoney: '',
                payLx: '',
                dkmonth: '',
                gjjmonth: '',
                showOth: false

            };
        },
        events: {
            detail: function (data) {
                $('.cent').text('月均还款');
                this.class0 = '';
                this.class1 = '';
                this['class' + data.payMethodType] = 'cur';
                var len = data.length;
                var tableHtml = '';
                var item = '';
                var payInfo = data.payInfo;
                for (var i = 0; i < len; i++) {
                    // TODO:传的数据格式有问题
                    item = data[i];
                    if (i % 12 == 0) {
                        if (i == 0) {
                            tableHtml += '<table cellpadding="0" cellspacing="0" class="dataTable">'
                                + '<tr><td width="13%">' + item[0] + '</td><td width="18%">' + item[1] + '</td><td width="20%">'
                                + item[2] + '</td><td width="20%">' + item[3] + '</td><td width="29%">' + item[4] + '</td></tr>';
                        } else {
                            tableHtml += '</table>' + '<div class="year-box"><span>第' + parseInt(i / 12 + 1) + '年</span></div>'
                                + '<table cellpadding="0" cellspacing="0" class="dataTable">'
                                + '<tr><td>' + item[0] + '</td><td>' + item[1] + '</td><td>'
                                + item[2] + '</td><td>' + item[3] + '</td><td>' + item[4] + '</td></tr>';
                        }
                    } else {
                        tableHtml += '<tr><td>' + item[0] + '</td><td>' + item[1] + '</td><td>' + item[2] + '</td><td>' + item[3]
                            + '</td><td>' + item[4] + '</td></tr>';
                    }
                }
                // console.log(that.valueShow);
                if (data.pageType == '3') {
                    // 组合贷
                    this.showSy = false;
                    this.showZh = true;
                }else {
                    this.showZh = false;
                    this.showSy = true;
                }
                this.hkmoney = payInfo.hkmoney;
                this.dkmoney = payInfo.dkmoney;
                this.payLx = payInfo.payLx;
                this.dkmonth = payInfo.dkmonth;
                this.monthAvgPay = payInfo.monthAvgPay;
                this.gjjmonth = payInfo.gjjmonth;

                $('#listHtml').html('').append(tableHtml);
            }
        },
        methods: {
            payment: function () {
                this.class1 = '';
                this.class0 = 'cur';
                this.$dispatch('tab-click','0');
            },
            basis: function () {
                this.class0 = '';
                this.class1 = 'cur';
                this.$dispatch('tab-click','1');
            }
        }
    });
});