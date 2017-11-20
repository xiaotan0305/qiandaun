/**
 * Created by lina on 2017/7/19.
 * 组合贷，公积金贷，税费视图
 */
define('modules/tools/mvc/sfView/view', ['modules/tools/mvc/sfView/component',
    'modules/tools/mvc/model/Calculate', 'slideFilterBox/1.0.0/slideFilterBox'], function (require, exports, module) {
    'use strict';
    var component = require('modules/tools/mvc/sfView/component');
    var scrollCtrl = require('iscroll/2.0.0/iscroll-lite');
    var Calculate = require('modules/tools/mvc/model/Calculate');
    var calculate = new Calculate();
    var vars = seajs.data.vars;
    var ophouse = parseFloat(vars.ophouse);
    var originalMoney = Math.floor(Number(vars.totalLoans));
    // 税费视图
    Vue.component('taxView', {
        template: '<section class="seBox mBox">'
        + '<ul class="jsq-form"><li><div>参考计税价<i @click="showFloat" class="que-icon"></i></div><div><div class="flexbox">'
        + '<p><input type="number" class="ipt-text width90" v-model="taxFee" ></p><span>万</span></div></div></li>'
        + '<li><div>距上次交易</div><div class="arr-rt-n" @click="clickTime">{{timeCon}}</div></li>'
        + '<li><div>是否唯一</div><div class="arr-rt-n" @click="isOnlyClick">{{onlyCon}}</div></li>'
        + '</ul><div class="jsq-f-btn"><input type="button" @click="calculate" value="开始计算"></div>'
        + '<mg-housing2 v-show="showHousing2" v-on:housing2-msg="housing2Msg"></mg-housing2>'
        + '<mg-housing3 v-show="showHousing3" v-on:housing3-msg="housing3Msg"></mg-housing3>'
        + '</section>',
        props: ['taxFee'],
        data: function () {
            var timeCon;
            if(vars.houseYear == 1){
                timeCon = '不满两年'
            }else if(vars.houseYear == 2){
                timeCon = '满两年'
            }else if(vars.houseYear == 3){
                timeCon = '满5年'
            }
            return {
                showHousing2: false,
                showHousing3: false,
                timeCon: timeCon,
                time: vars.houseYear,
                onlyCon: '唯一',
                only: 1,
                isFirst: 1
            }
        },
        methods: {
            showFloat: function () {
                var that = this;
                that.$parent.floatTit = '参考计税价说明';
                that.$parent.floatCon = '参考计税价为系统估算的价格，此价格将影响贷款总额及税费，请以实际计税价为准！您也可在此处修改，系统将重新为您计算税费及购房预算';
                that.$parent.floatShow = true;
            },
            clickTime: function () {
                this.showHousing2 = true;
            },
            housing2Msg: function (obj) {
                var that = this;
                that.timeCon = obj.text;
                that.time = obj.val;
                that.showHousing2 = false;
                that.calculate();
            },
            isOnlyClick: function () {
                this.showHousing3 = true;
            },
            housing3Msg: function (obj) {
                var that = this;
                that.onlyCon = obj.text;
                that.only = obj.val;
                that.showHousing3 = false;
                that.calculate();
            },
            calculate: function () {
                var that = this;
                var ajaxData = {
                    area: vars.area,
                    price: that.taxFee,
                    houseYear: that.time,
                    firsthouseIf: that.isFirst,
                    onlyhouseIf: that.only,
                    housenature: vars.housenature,
                    countway: 1
                };
                that.$dispatch('calculate-msg', ajaxData);
            }

        },
        events: {
            taxMsg: function (data) {
                var that = this;
                if(data){
                    that.isFirst = data;
                }
                that.calculate();
            }
        }
    });
    var iptParam = {};
    // 公积金贷款视图
    Vue.component('gjjView', {
        template: '<section class="seBox mBox">'
        + '<div v-show="showCon"><ul class="jsq-form">'
        + '<li><div>贷款类型</div><div class="arr-rt-n" @click="clickType">公积金贷款</div>'
        + '</li>'
        + '<li><div>贷款总额<i @click="showFloat" class="que-icon"></i></div>'
        + '<div>'
        + '<div class="flexbox"><p><input type="number" v-on:input="totalInput"  class="ipt-text width90" v-model="totalMoney">'
        + '</p><span>万</span>'
        + '</div></div></li>'
        + '<li><div>贷款年限</div><div class="arr-rt-n" @click="selectYear">{{dkYear}}</div></li>'
        + '<li><div>贷款利率</div><div class="arr-rt-n" @click="selectRate">{{rateCon}}</div></li>'
        + '</ul>'
        + '<div class="jsq-f-btn"><input type="button" @click="calculate" value="开始计算"></div></div>'
        + '<mg-year year-id="gjjYear" v-show="yearShow" v-on:year-msg="yearMsg"></mg-year>'
        + '<mg-rate v-show="rateShow" v-on:rate-msg="rateMsg"></mg-rate>'
        + '</section>',
        data: function () {
            return {
                showCon: true,
                yearShow: false,
                dkYear: vars.maxyear + '年',
                year: parseInt(vars.maxyear),
                totalMoney: parseInt(parseFloat(vars.price) * parseFloat(vars.accumulation) / 100),
                rateShow: false,
                jzRate: 3.25,
                rate: 3.25,
                rateCon: '最新基准利率（' + 3.25 + '%）',
                discount: 1,
                Data: {
                    type: 1,
                    totalMoney: 900000,
                    rate: 4.9,
                    month: 300
                },
                scrollObj:''
            }
        },
        events: {
            select2: function () {
                if(this.$parent.secondCla){
                    this.totalMoney = parseInt(this.$parent.gjjPoint * parseFloat(vars.price) / 100);
                }else{
                    this.totalMoney = parseInt(parseFloat(vars.price) * parseFloat(vars.accumulation) / 100)
                }
                if(this.totalMoney > this.$parent.gjjMax){
                    this.totalMoney = this.$parent.gjjMax;
                }
                this.$parent.totalIpt(this.totalMoney);
                this.calculate();
            },
            changeTab2: function (data) {
                var that = this;
                if(data > that.$parent.gjjMax){
                    that.totalMoney = that.$parent.gjjMax;
                }else{
                    that.totalMoney = data;
                }
                that.calculate();
            }
        },
        methods: {
            showFloat: function () {
                var that = this;
                that.$parent.floatTit = '贷款总额说明';
                that.$parent.floatCon = '贷款总额为系统评估的该房源最高可贷款金额，您也可在此处修改贷款金额，系统将根据重新计算首付及购房预算。';
                that.$parent.floatShow = true;
            },
            selectYear: function () {
                var that = this;
                if (!that.$parent.clickFlag) {
                    return false;
                }
                that.yearShow = true;
                that.$nextTick(function(){
                    that.$parent.unable();
                    that.scrollObj.refresh();
                })
            },
            yearMsg: function (obj) {
                var that = this;
                that.$parent.unableClick();
                that.year = obj.val;
                that.dkYear = obj.val + '年';
                if (that.year <= 5) {
                    that.jzRate = that.$parent.gjjBase1;

                } else if (that.year > 5) {
                    that.jzRate = that.$parent.gjjBase2;
                }
                that.rate = (that.jzRate * that.discount).toFixed(2);
                if (that.discount === 1) {
                    that.rateCon = '最新基准利率（' + that.rate + '%）';
                } else {
                    that.rateCon = that.rate + '%';
                }
                that.rateCon = that.rate + '%';
                that.yearShow = false;
                that.$parent.enable();
                that.$parent.enableClick();
            },
            clickType: function () {
                var that = this;
                if (!that.$parent.clickFlag) {
                    return false;
                }
                that.$parent.typeShow = true;
                that.$parent.resultShow = false;
            },
            selectRate: function () {
                var that = this;
                if (!that.$parent.clickFlag) {
                    return false;
                }
                that.rateShow = true;
                that.showCon = false;
                that.$parent.show = false;
            },
            totalInput: function (ev) {
                var that = this;
                var value = ev.target.value;
                value = value.match(/\d{0,10}(\d)?/g);
                ev.target.value = value[0];
                that.totalMoney = ev.target.value;
                if (that.totalMoney > that.$parent.gjjMax) {
                    alert('公积金最高贷款额度为' + that.$parent.gjjMax + '万');
                    that.totalMoney = '';
                    return false;
                }
                if (that.totalMoney > ophouse) {
                    alert('最高贷款额度不能超过房款总价!');
                    that.totalMoney = '';
                    return false;

                }
                if(!that.totalMoney){
                    iptParam.totalMoney = 0;
                }else{
                    iptParam.totalMoney = that.totalMoney;
                }
                iptParam.type = 'gjj';
                that.$dispatch('total-ipt', iptParam);
            },
            rateMsg: function (obj) {
                var that = this;
                that.$parent.unableClick();
                that.discount = parseFloat(obj.val);
                that.rate = (that.discount * that.jzRate).toFixed(2);
                if (that.discount === 1) {
                    that.rateCon = '最新基准利率（' + that.jzRate + '%）';
                } else {
                    that.rateCon = that.rate + '%';
                }
                that.rateShow = false;
                that.showCon = true;
                that.$parent.show = true;
                that.$parent.showCon = true;
                that.$parent.enableClick();
            },
            calculate: function () {
                var that = this;
                if (!that.$parent.clickFlag) {
                    return false;
                }
                that.Data.totalMoney = that.totalMoney * 10000;
                that.Data.month = that.year * 12;
                that.Data.rate = that.rate / 100;
                var returnData = calculate.calculate(that.Data);
                returnData.Data = that.Data;
                that.$dispatch('calcu-msg', returnData);
            }
        },
        ready: function () {
            var that = this;
            $(document).on('click', '.back', function () {
                if (that.rateShow) {
                    that.$parent.show = true;
                    that.rateShow = false;
                    that.showCon = true;
                }
            });
            that.scrollObj = new scrollCtrl('#gjjYear',{
                scrollY:true,
                preventDefault:false
            });
            that.gjjBaseRate = that.$parent.gjjBase2;
            if(that.totalMoney > that.$parent.gjjMax){
                that.totalMoney = that.$parent.gjjMax;
            }
        }
    });
    // 商业贷款视图
    Vue.component('dkView', {
        template: '<section class="seBox mBox">'
        + '<div v-show="showCon"><ul class="jsq-form">'
        + '<li><div>贷款类型</div><div class="arr-rt-n" v-on:click="clickType">商业贷款</div>'
        + '</li>'
        + '<li><div>贷款总额<i @click="showFloat" class="que-icon"></i></div>'
        + '<div>'
        + '<div class="flexbox"><p><input type="number"  v-on:input="totalInput" class="ipt-text width90" v-model="totalMoney">'
        + '</p><span>万</span>'
        + '</div></div></li>'
        + '<li><div>贷款年限</div><div class="arr-rt-n" @click="selectYear">{{dkYear}}</div></li>'
        + '<li><div>商贷利率</div><div class="arr-rt-n" @click="selectRate">{{rateCon}}</div></li>'
        + '</ul>'
        + '<div class="jsq-f-btn"><input type="button" @click="calculate" value="开始计算"></div></div>'
        + '<mg-year year-id="sdYear" v-show="yearShow" v-on:year-msg="yearMsg"></mg-year>'
        + '<mg-rate v-show="rateShow" v-on:rate-msg="rateMsg" v-on:rate-msg2="rateMsg2"></mg-rate>'
        + '</section>',
        data: function () {
            return {
                yearShow: false,
                dkYear: vars.maxyear + '年',
                year: parseInt(vars.maxyear),
                totalMoney: originalMoney,
                rateShow: false,
                jzRate: 4.9,
                rate: 4.9,
                discount: 1,
                rateCon: '最新基准利率（' + 4.9 + '%）',
                showCon: true,
                Data: {
                    type: 1,
                    totalMoney: 900000,
                    rate: 4.9,
                    month: 240
                },
                scrollObj:''
            }
        },
        events: {
            select1: function () {
                if(this.$parent.secondCla){
                    this.totalMoney = parseInt(this.$parent.secondPoint * vars.price / 100);
                }else{
                    this.totalMoney = originalMoney;
                }
                this.$parent.totalIpt(this.totalMoney);
                this.calculate();

            },
            changeTab1: function (data) {
                var that = this;
                that.totalMoney = data;
                that.calculate();
            },
            changeTotal:function(data){
                this.totalMoney = data;
            }
        },
        methods: {
            showFloat: function () {
                var that = this;
                that.$parent.floatTit = '贷款总额说明';
                that.$parent.floatCon = '贷款总额为系统评估的该房源最高可贷款金额，您也可在此处修改贷款金额，系统将根据重新计算首付及购房预算。';
                that.$parent.floatShow = true;
            },
            selectYear: function () {
                var that = this;
                if (!that.$parent.clickFlag) {
                    return false;
                }
                that.yearShow = true;
                that.$nextTick(function(){
                    that.$parent.unable();
                    that.scrollObj.refresh();
                });

            },
            totalInput: function (ev) {
                var that = this;
                var value = ev.target.value;
                value = value.match(/\d{0,10}(\d)?/g);
                ev.target.value = value[0];
                that.totalMoney = ev.target.value;
                if (that.totalMoney > ophouse) {
                    alert('最高贷款额度不能超过房款总价!');
                    that.totalMoney = '';
                    return false;

                }
                if(!that.totalMoney){
                    iptParam.totalMoney = 0;
                }else{
                    iptParam.totalMoney = that.totalMoney;
                }
                iptParam.type = 'sd';
                that.$dispatch('total-ipt', iptParam);

            },
            yearMsg: function (obj) {
                var that = this;
                that.$parent.unableClick();
                that.year = obj.val;
                that.dkYear = obj.val + '年';
                if (that.year === 1) {
                    that.jzRate = that.$parent.sdBase1;
                } else if (that.year > 1 && that.year <= 5) {
                    that.jzRate = that.$parent.sdBase2;
                } else {
                    that.jzRate = that.$parent.sdBase3;
                }
                that.rate = (that.jzRate * that.discount).toFixed(2);
                if (that.discount === 1) {
                    that.rateCon = '最新基准利率（' + that.rate + '%）';
                } else {
                    that.rateCon = that.rate + '%';
                }
                that.yearShow = false;
                that.$parent.enable();
                that.$parent.enableClick();
            },
            clickType: function () {
                var that = this;
                if (!that.$parent.clickFlag) {
                    return false;
                }
                if(vars.accumulation === '禁贷'){
                    alert('该房源暂不支持公积金贷款');
                    return false;
                }else if(that.$parent.secondCla  && that.$parent.sForbidden === '禁贷'){
                    alert('该房源二套公积金禁贷');
                    return false;
                }
                that.$parent.typeShow = true;
                that.$parent.resultShow = false;
            },
            selectRate: function () {
                var that = this;
                if (!that.$parent.clickFlag) {
                    return false;
                }
                that.rateShow = true;
                that.showCon = false;
                that.$parent.show = false;
            },
            rateMsg: function (obj) {
                var that = this;
                that.$parent.unableClick();
                that.discount = parseFloat(obj.val);
                that.rate = (that.discount * that.jzRate).toFixed(2);
                if (that.discount === 1) {
                    that.rateCon = '最新基准利率（' + that.jzRate + '%）';
                } else {
                    that.rateCon = that.rate + '%';
                }
                that.rateShow = false;
                that.showCon = true;
                that.$parent.show = true;
                that.$parent.showCon = true;
                that.$parent.enableClick();
            },
            rateMsg2: function (data) {
                var that = this;
                that.rate = data;
                that.rateCon = that.rate + '%';
                that.rateShow = false;
                that.showCon = true;
                that.$parent.show = true;
                that.$parent.showCon = true;
            },
            calculate: function () {
                var that = this;
                if (!that.$parent.clickFlag) {
                    return false;
                }
                that.Data.rate = parseFloat(that.rate) / 100;
                that.Data.month = parseFloat(that.dkYear) * 12;
                that.Data.totalMoney = that.totalMoney * 10000;
                var returnData = calculate.calculate(that.Data);
                returnData.Data = that.Data;
                that.$dispatch('calcu-msg', returnData);
            }
        },
        ready: function () {
            var that = this;
            that.calculate();
            $(document).on('click', '.back', function () {
                if (that.rateShow) {
                    that.$parent.show = true;
                    that.rateShow = false;
                    that.showCon = true;
                }
            });
            that.scrollObj = new scrollCtrl('#sdYear',{
                scrollY: true,preventDefault:false
            });
            that.sdBaseRate = that.$parent.sdBase3;
        }
    });
    // 组合贷款视图
    Vue.component('combinationView', {
        template: '<section class="seBox mBox">'
        + '<div v-show="showCon"><ul class="jsq-form"><li><div>贷款类型</div><div class="arr-rt-n" @click="clickType">组合贷款</div></li>'
        + '<li><div>贷款总额<i @click="showFloat" class="que-icon"></i></div><div><div class="flexbox">'
        + '<p><input type="number" v-on:input="totalIpt" class="ipt-text width90" v-model="totalMoney"></p><span>万</span></div></div></li>'
        + '<li><div>贷款年限</div><div class="arr-rt-n" @click="selectYear">{{year}}年</div></li>'
        + '<li><div>公积金贷款金额</div><div><div class="flexbox"><p><input v-on:input="gjjIpt"  type="number" class="ipt-text width90" v-model="gjjMoney"></p>'
        + '<span>万</span></div></div></li>'
        + '<li><div>商业贷款金额</div><div><div class="flexbox"><p><input type="number" v-on:input="sdIpt" class="ipt-text width90" v-model="sdMoney">'
        + '</p><span>万</span></div></div></li>'
        + '<li><div>公积金利率</div><div @click="selRate1" class="arr-rt-n">{{gjjRate}}%</div></li>'
        + '<li><div>商贷利率</div><div @click="selRate2" class="arr-rt-n">{{sdRate}}%</div></li>'
        + '</ul><div class="jsq-f-btn"><input type="button" @click="calculate" value="开始计算"></div></div>'
        + '<mg-year year-id="comYear" v-show="yearShow" v-on:year-msg="yearMsg"></mg-year>'
        + '<mg-rate v-show="gjjShow" v-on:rate-msg="rateMsg"></mg-rate>'
        + '<mg-rate v-show="sdShow" v-on:rate-msg="rateMsg"></mg-rate>'
        + '</section>',
        data: function () {
            return {
                totalMoney: originalMoney,
                gjjMoney: 0,
                sdMoney: originalMoney,
                gjjShow: false,
                sdShow: false,
                gjjBaseRate: 3.25,
                sdBaseRate: 4.9,
                rateType: '',
                showCon: true,
                gjjRate: 3.25,
                sdRate: 4.9,
                yearShow: false,
                year: parseInt(vars.maxyear),
                gjjDis: 1,
                sdDis: 1,
                calculateType: 1,
                scrollObj:''

            }
        },
        events: {
            select3: function () {
                if(this.$parent.secondCla){
                    this.totalMoney = parseInt(this.$parent.secondPoint * parseFloat(vars.price) / 100);
                }else{
                    this.totalMoney = originalMoney;
                }
                this.sdMoney = this.totalMoney;
                this.gjjMoney = 0;
                this.$parent.totalIpt(this.totalMoney);
                this.calculate();
            },
            changeTab3: function (data) {
                var that = this;
                that.totalMoney = data;
                that.calculate();
            },
            changeTotal:function(data){
                this.totalMoney = data;
                this.sdMoney = data;
                this.gjjMoney = 0;
            }
        },
        methods: {
            showFloat: function () {
                var that = this;
                that.$parent.floatTit = '贷款总额说明';
                that.$parent.floatCon = '贷款总额为系统评估的该房源最高可贷款金额，您也可在此处修改贷款金额，系统将根据重新计算首付及购房预算。';
                that.$parent.floatShow = true;
            },
            clickType: function () {
                var that = this;
                that.$parent.typeShow = true;
                that.$parent.resultShow = false;
            },
            selRate1: function () {
                var that = this;
                if (!that.$parent.clickFlag) {
                    return false;
                }
                that.gjjShow = true;
                that.rateType = 'gjj';
                that.showCon = false;
                that.$parent.show = false;

            },
            totalIpt:function(ev){
                var that = this;
                var value = ev.target.value;
                value = value.match(/\d{0,10}(\d)?/g);
                ev.target.value = value[0];
                that.totalMoney = ev.target.value;
                if(Number(that.gjjMoney) === 0){
                    that.sdMoney = that.totalMoney;
                }else if(Number(that.gjjMoney) > 0){
                    that.sdMoney = Number(that.totalMoney) - Number(that.gjjMoney);
                }
                if(parseFloat(that.totalMoney) > parseFloat(vars.ophouse)){
                    alert('贷款总额不能超过房屋价格');
                    that.totalMoney = originalMoney;
                    that.sdMoney = originalMoney;
                    that.gjjMoney = 0;
                }
                if(!that.totalMoney){
                    iptParam.totalMoney = 0;
                }else{
                    iptParam.totalMoney = that.totalMoney;
                }
                iptParam.type = 'com';
                that.$dispatch('total-ipt', iptParam);
            },
            selRate2: function () {
                var that = this;
                if (!that.$parent.clickFlag) {
                    return false;
                }
                that.sdShow = true;
                that.rateType = 'sd';
                that.showCon = false;
                that.$parent.show = false;
            },
            rateMsg: function (obj) {
                var that = this;
                that.$parent.unableClick();
                var discount = parseFloat(obj.val);
                if (that.rateType === 'gjj') {
                    that.gjjShow = false;
                    that.gjjDis = discount;
                    that.rate = (discount * that.gjjBaseRate).toFixed(2);
                    that.gjjRate = that.rate;
                } else if (that.rateType === 'sd') {
                    that.sdShow = false;
                    that.sdDis = discount;
                    that.rate = (discount * that.sdBaseRate).toFixed(2);
                    that.sdRate = that.rate;
                }
                that.showCon = true;
                that.$parent.show = true;
                that.$parent.enableClick();
            },

            selectYear: function () {
                var that = this;
                if (!that.$parent.clickFlag) {
                    return false;
                }
                that.yearShow = true;
                that.$nextTick(function () {
                    that.$parent.unable();
                    that.scrollObj.refresh();
                })

            },
            // 选择贷款年限
            yearMsg: function (obj) {
                var that = this;
                that.$parent.unableClick();
                that.year = obj.val;
                if (that.year === 1) {
                    that.sdBaseRate = that.$parent.sdBase1;
                    that.gjjBaseRate = that.$parent.gjjBase1;
                } else if (that.year <= 5) {
                    that.sdBaseRate = that.$parent.sdBase2;
                    that.gjjBaseRate = that.$parent.gjjBase1;
                } else if (that.year > 5) {
                    that.sdBaseRate = that.$parent.sdBase3;
                    that.gjjBaseRate = that.$parent.gjjBase2;
                }
                that.gjjRate = Number((that.gjjBaseRate * that.gjjDis).toFixed(2));
                that.sdRate = Number((that.sdBaseRate * that.sdDis).toFixed(2));
                that.yearShow = false;
                that.$parent.enable();
                that.$parent.enableClick();
            },
            gjjIpt: function (ev) {
                var that = this;
                var value = ev.target.value;
                value = value.match(/\d{0,10}(\d)?/g);
                ev.target.value = value[0];
                that.gjjMoney = ev.target.value;
                if(parseInt(that.gjjMoney) > parseInt(that.$parent.gjjMax)){
                    that.gjjMoney = '';
                    that.sdMoney = that.totalMoney;
                    alert('公积金贷款额度最高为' + that.$parent.gjjMax + '万');
                    return false;
                }
                if (parseInt(that.gjjMoney) <= parseInt(that.totalMoney)) {
                    that.sdMoney = that.totalMoney - that.gjjMoney;
                }else if(parseInt(that.gjjMoney) > parseInt(that.totalMoney)){
                    alert('公积金贷款额度不能超过总额度');
                    that.gjjMoney = '';
                    that.sdMoney = that.totalMoney;
                }
            },
            sdIpt: function (ev) {
                var that = this;
                var value = ev.target.value;
                value = value.match(/\d{0,10}(\d)?/g);
                ev.target.value = value[0];
                that.sdMoney = ev.target.value;
                if (parseInt(that.sdMoney) <= parseInt(that.totalMoney)) {
                    that.gjjMoney = that.totalMoney - that.sdMoney;
                } else if(parseInt(that.sdMoney) > parseInt(that.totalMoney)){
                    alert('商业贷款额度不能超过总额度');
                    that.sdMoney = '';
                    if(that.totalMoney < that.$parent.gjjMax){
                        that.gjjMoney = that.totalMoney
                    }else{
                        that.gjjMoney = that.$parent.gjjMax
                    }
                }
            },
            calculate: function () {
                var that = this;
                if (!that.$parent.clickFlag) {
                    return false;
                }
                if(parseInt(that.sdMoney) + parseInt(that.gjjMoney) > that.totalMoney){
                    alert('贷款钱数不能大于贷款总额');
                    return false;
                }
                if (that.gjjMoney === '') {
                    alert('请输入公积金贷款金额');
                    return false;
                } else if (that.sdMoney === '') {
                    alert('请输入商业贷款金额');
                    return false;
                } else if (that.gjjMoney > that.$parent.gjjMax) {
                    alert(vars.cityname + '首套贷款公积金最高贷款'+ that.$parent.gjjMax +'万');
                    return false;
                }
                var gjjData = {
                    type: that.calculateType,
                    rate: that.gjjRate / 100,
                    totalMoney: parseFloat(that.gjjMoney) * 10000,
                    month: that.year * 12
                };
                var gjjReTurn = calculate.calculate(gjjData);
                var sdData = {
                    type: that.calculateType,
                    rate:that.sdRate / 100,
                    totalMoney: parseFloat(that.sdMoney) * 10000,
                    month: that.year * 12
                };
                var sdReturn = calculate.calculate(sdData);
                var comData = {};
                comData.gjjData = gjjData;
                comData.sdData = sdData;
                comData.totalMoney = parseInt(gjjReTurn.totalMoney + sdReturn.totalMoney);
                comData.toatlInterest = parseInt(gjjReTurn.toatlInterest + sdReturn.toatlInterest);
                comData.monYg = parseInt(Number(gjjReTurn.monYg) + Number(sdReturn.monYg));

                var i = 0;
                comData.interest = [];
                comData.leftMoney = [];
                comData.moMoney = [];
                comData.Type = 'com';
                comData.firstMonYg = parseInt(Number(gjjReTurn.firstMonYg) + Number(sdReturn.firstMonYg));
                for (; i < gjjReTurn.interest.length; i++) {
                    comData.interest.push(parseInt(Number(gjjReTurn.interest[i]) + Number(sdReturn.interest[i])));
                    comData.leftMoney.push(parseInt(Number(gjjReTurn.leftMoney[i]) + Number(sdReturn.leftMoney[i])));
                    comData.moMoney.push(parseInt(Number(gjjReTurn.moMoney[i]) + Number(sdReturn.moMoney[i])));
                }
                that.$dispatch('calcu-msg', comData);
            }
        },
        ready: function () {
            var that = this;
            $(document).on('click', '.back', function () {
                if (that.rateShow) {
                    that.$parent.show = true;
                    that.rateShow = false;
                    that.showCon = true;
                }
            });
            that.scrollObj = new scrollCtrl('#comYear',{
                scrollY:true,
                preventDefault:false
            });
            that.gjjBaseRate = that.$parent.gjjBase2;
            that.sdBaseRate = that.$parent.sdBase3;
        }
    })
});

