define('modules/tools/mvc/sfView/calDetailView', ['modules/tools/mvc/model/setting'], function (require, exports, module) {
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
                showOth: false,
                type:''

            };
        },
        events: {
            detail: function (data) {
                var that = this;
                $('.cent').text('月均还款');
                if(data.type && data.type.data === 2){
                    that.class1 = 'cur';
                    that.class0 = '';
                }else{
                    that.class0 = 'cur';
                    that.class1 = '';
                }
                var len = data.interest.length;
                var tableHtml = '';
                var isString = typeof  data.monYg === 'number';
                // 月供
                var ygObj = data.monYg;
                // 本金
                var monMoney = data.moMoney;
                // 月供利息
                var monLx = data.interest;
                // 剩余贷款
                var leftMoney = data.leftMoney;
                var i = 0;
                var thisMon;
                var monYg,monmoney;
                for (; i < len; i++) {
                    thisMon = (i + 1) % 12 + '月';
                    if(thisMon === '0月'){
                        thisMon = '12月'
                    }
                    if(isString){
                        monYg = ygObj;
                        monmoney = monMoney[i];
                    }else{
                        monYg = ygObj[i];
                        monmoney = Number(monMoney);
                    }
                   // 月供
                    if (i % 12 == 0) {
                        if (i == 0) {
                            tableHtml += '<table cellpadding="0" cellspacing="0" class="dataTable">'
                                + '<tr><td width="13%">' + thisMon + '</td><td width="18%">￥' + monYg + '</td><td width="20%">￥'
                                + monmoney + '</td><td width="20%">￥' + monLx[i] + '</td><td width="29%">￥' + leftMoney[i] + '</td></tr>';
                        } else {
                            tableHtml += '</table>' + '<div class="year-box"><span>第' + parseInt(i / 12 + 1) + '年</span></div>'
                                + '<table cellpadding="0" cellspacing="0" class="dataTable">'
                                + '<tr><td>' + thisMon + '</td><td>￥' + monYg + '</td><td>￥'
                                + monmoney + '</td><td>￥' + monLx[i] + '</td><td>￥' + leftMoney[i] + '</td></tr>';
                        }
                    } else {
                        tableHtml += '<tr><td>' + thisMon + '</td><td>￥' + monYg + '</td><td>￥' + monmoney + '</td><td>￥' + monLx[i]
                            + '</td><td>￥' + leftMoney[i] + '</td></tr>';
                    }
                }
                if (data.pageType == '3') {
                    // 组合贷
                    that.showSy = false;
                    that.showZh = true;
                }else {
                    that.showZh = false;
                    that.showSy = true;
                }
                that.hkmoney = ((Number(data.totalMoney) + Number(data.toatlInterest))/10000).toFixed(2);
                that.dkmoney = data.totalMoney/10000;
                that.payLx = (data.toatlInterest / 10000).toFixed(2);
                that.dkmonth = len;
                that.monthAvgPay = data.firstMonYg;
                that.type = data.Type;
                $('#listHtml').html('').append(tableHtml);
                that.scrollEvent();
            }
        },
        methods: {
            payment: function () {
                var that = this;
                var param = {};
                param.data = 1;
                param.type = that.type;
                that.class1 = '';
                that.class0 = 'cur';
                $('.data-box').scrollTop(0);
                that.$dispatch('tab-click',param);
            },
            basis: function () {
                var that = this;
                var param = {};
                param.data = 2;
                param.type = that.type;
                that.class0 = '';
                that.class1 = 'cur';
                $('.data-box').scrollTop(0);
                that.$dispatch('tab-click',param);

            },
            scrollEvent:function(){
                // 页面滚动效果
                // 页面加载完之后设置贷款详细表的高度
                // 44px 头部的高度 80px脚的高度 浮层的高度44px
                var dataBox = $('.data-box');
                var dHeight = document.body.offsetHeight - dataBox[0].offsetTop - 44;
                dataBox.css({height: dHeight + 'px',overflow: 'auto'});
                // 滚动页面至最顶端
                $(document.body).scrollTop(0);

                // 滚动时年数提示
                var yearChange = $('#yearChange');
                dataBox.scroll(function () {
                    var scrollTop = dataBox.scrollTop();
                    if (scrollTop >= 505) {
                        yearChange.html('<span>第' + Math.ceil(scrollTop / 505) + '年</span>');
                    } else {
                        yearChange.html('<span>第1年</span>');
                    }
                });
            }
        }
    });
});