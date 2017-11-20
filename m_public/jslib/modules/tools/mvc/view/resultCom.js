/**
 * Created by zhangcongfeng@fang.com on 2016/7/15.
 */
define('view/resultCom', [], function () {
    'use strict';
    // 点击切换
    Vue.component('resultTab',{
        template: '<section>'
        + '<div class="result-t methodboxa">'
        + '<div class="mTab">'
        + '<div class="flexbox" id="payMethod">'
        + '<a class="{{class0}}" id="fixedPayment" v-on:click="payment">等额本息</a>'
        + '<a class="{{class1}}" id="fixedBasis" v-on:click="basis">等额本金</a>'
        + '</div>' + '</div>'
        + '<p class="f14" v-show="showIntro0">每月还款额固定，所还总利息较多，适合收入稳定者。</p>'
        + '<p class="f14" v-show="showIntro1">每月还款额递减，所还总利息较低，前期还款额较大。</p>' + '</div>'
        + '</section>',
        data: function () {
            return {
                class0: 'active',
                class1: '',
                showIntro0: true,
                showIntro1: false
            };
        },
        methods: {
            payment: function () {
                this.class1 = '';
                this.class0 = 'active';
                this.showIntro0 = true;
                this.showIntro1 = false;
                this.$parent.showDiffer = false;
                this.$dispatch('tab-click','0');
            },
            basis: function () {
                this.class0 = '';
                this.class1 = 'active';
                this.showIntro0 = false;
                this.showIntro1 = true;
                this.$parent.showDiffer = true;
                this.$dispatch('tab-click','1');
            }
        }
    });
    // 饼图
    Vue.component('mgPie',{
        template: '<div class="jsresults01 cirqueBox">'
        + '<a id="detailLink" class="arr-rt">'
        + '<div class="cirque">'
        + '<div id="pieCon1"></div>'
        + '<div class="intro">'
        + '<span class="info">月供</span>' + ' <span id="monthPay">{{monthPay}}</span>' + '</div>' + '</div>' + '</a>' + '</div>',
        props: ['monthPay']
    });
});

