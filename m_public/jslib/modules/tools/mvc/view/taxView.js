/**
 * 新房税费视图
 * by zhangcongfeng@fang.com
 */
define('view/taxView', ['view/components', 'view/calView', 'util/common'], function (require) {
    'use strict';
    require('view/components');
    require('view/calView');
    var common = require('util/common');
    var modelParse = require('model/modelParse');
    var setting = require('model/setting');
    // 新房
    Vue.component('xf', {
        template: '<div class="jsqBox">'
        + '<ul class="jsq-list">'
        + '<li><div>建筑面积：</div>'
        + '<div><div class="flexbox">'
        + '<input type="number" class="ipt-text"  pattern="[0-9]*" v-model="area" v-on:input="inputLimit">'
        + '<span>㎡</span></div></div></li>'
        + '<li><div>面积单价：</div>'
        + '<div><div class="flexbox">'
        + '<input type="number" class="ipt-text"  pattern="[0-9]*" v-model="unitPrice" v-on:input="inputLimit2">'
        + '<span>元</span></div></div></li>'
        + '<select-li label="房屋性质：" :data-value="housing" :msg="housingMsg" v-on:click="housingClick"></select-li>'
        + '<li><v-radio v-ref:radio label="是否唯一："  name="unique"></v-radio></li></ul>'
        + '<v-button v-on:click="calculate"></v-button></div>',
        props: [],
        data: function () {
            return {
                showDai: true,
                area: '100',
                unitPrice: '10000',
                housing: '0',
                housingMsg: '普通住宅'
            };
        },
        methods: {
            inputLimit: function (ev) {
                var value = ev.target.value;
                value = value.match(/\d{0,4}(\.\d{0,2})?/g);
                ev.target.value = value[0];
                // this[ev.target.id] = value[0];
            },
            inputLimit2: function (ev) {
                var value = ev.target.value;
                value = value.match(/\d{0,7}(\.\d{0,2})?/g);
                ev.target.value = value[0];
                // this[ev.target.id] = value[0];
            },
            housingClick: function () {
                this.$parent.showHousing = true;
                // common.showDiv();
            },
            calculate: function () {
                // (1)验证
                if (this.area === '') {
                    alert('\u8bf7\u586b\u5199\u623f\u5c4b\u9762\u79ef');
                    return;
                }
                if (this.unitPrice === '') {
                    alert('\u8bf7\u586b\u5199\u9762\u79ef\u5355\u4ef7');
                    return;
                }
                this.area = common.formatNum(this.area);
                this.unitPrice = common.formatNum(this.unitPrice);
                if (this.area === 0) {
                    alert('\u8bf7\u8f93\u5165\u6b63\u786e\u7684\u623f\u5c4b\u9762\u79ef');
                    return;
                }
                if (this.unitPrice === 0) {
                    alert('\u8bf7\u8f93\u5165\u6b63\u786e\u7684\u9762\u79ef\u5355\u4ef7');
                    return;
                }
                // console.log(this.$refs.radio.picked);
                // 收集数据
                var businessRate = '';
                var fundRate = '';
                var isUniqueVal, noUniqueVal;
                if (this.$refs.radio.picked === '1') {
                    isUniqueVal = true;
                    noUniqueVal = false;
                } else {
                    isUniqueVal = false;
                    noUniqueVal = true;
                }
                var data = {
                    houseArea: this.area,
                    housePrice: this.unitPrice,
                    houseProp: this.housing,
                    noUnique: noUniqueVal,
                    isUnique: isUniqueVal,
                    businessRate: businessRate,
                    fundRate: fundRate,
                    type: 'xf'
                };
                // 传到父组件
                this.$dispatch('begin-count', data);
            }
        }
    });
    // 二手房
    Vue.component('esf', {
        template: '<div class="jsqBox">'
        + '<ul class="jsq-list ll">'


        + '<select-li label="物业类型：" :data-value="housing3" :msg="housing3Msg" :id="esfHouseProp" v-on:click="housing3Click"></select-li>'

        + '<select-li label="计算方式：" :data-value="housing4" :msg="housing4Msg" :id="countwayProp" v-on:click="housing4Click"></select-li>'

        + '<select-li label="房产购置年限：" :data-value="housing2" :msg="housing2Msg" :id="houseYear" v-on:click="housing2Click"></select-li>'

        + '<li><v-radio v-ref:radio1 label="是否首次购房：" name="first"></v-radio></li>'

        + '<li><v-radio v-ref:radio2 label="是否唯一住房：" name="unique"></v-radio></li>'

        + '<li><div>建筑面积：</div>'
        + '<div><div class="flexbox">'
        + '<input type="number" class="ipt-text"  pattern="[0-9]*" v-model="area" v-on:input="inputLimit">'
        + '<span>㎡</span></div></div></li>'

        + '<li><div>总价：</div>'
        + '<div><div class="flexbox">'
        + '<input type="number" class="ipt-text"  pattern="[0-9]*" v-model="totalPrice" v-on:input="inputLimit">'
        + '<span>万元</span></div></div></li>'

        + '<li v-show="showYuanjia"><div>原价：</div>'
        + '<div><div class="flexbox">'
        + '<input type="number" class="ipt-text" id="yuanJia" pattern="[0-9]*" v-model="ophouse" v-on:input="inputLimit">'
        + '<span>万元</span></div></div></li>'

        + '</ul>'
        + '<v-button v-on:click="calculate"></v-button></div>',
        props: [],
        data: function () {
            return {
                showDai: true,
                showYuanjia: false,
                area: '100',
                totalPrice: '100',
                ophouse: '100',
                housing2: '1',
                housing3: '1',
                housing4: '1',
                housing2Msg: '不满两年',
                housing3Msg: '普通住宅',
                housing4Msg: '按总价计算',
                houseYear: 'houseYear',
                esfHouseProp: 'esfHouseProp',
                countwayProp: 'countwayProp'
            };
        },
        methods: {
            checkChange: function () {
                this.$parent.ajaxFlag = true;
            },
            inputLimit: function (ev) {
                var value = ev.target.value;
                if (ev.target.id === 'yuanJia' && Number(this.ophouse) > Number(this.totalPrice)) {
                    // 输入原价时候保持不能大于总价
                    alert('\u539f\u4ef7\u4e0d\u5e94\u8be5\u6bd4\u603b\u4ef7\u9ad8\uff0c\u8bf7\u91cd\u65b0\u8f93\u5165\uff01');
                    ev.target.value = '';
                    ev.target.focus();
                    return;
                }
                value = value.match(/\d{0,4}(\.\d{0,2})?/g);
                ev.target.value = value[0];
                // this[ev.target.id] = value[0];
                this.$parent.ajaxFlag = true;
            },
            housing2Click: function () {
                this.$parent.showHousing2 = true;
                // common.showDiv();
            },
            housing3Click: function () {
                this.$parent.showHousing3 = true;
                // common.showDiv();
            },
            housing4Click: function () {
                this.$parent.showHousing4 = true;
            },
            calculate: function () {
                if (this.area === '') {
                    alert('\u8bf7\u8f93\u5165\u9762\u79ef');
                    return;
                }
                if (this.totalPrice === '') {
                    alert('\u8bf7\u8f93\u5165\u603b\u4ef7');
                    return;
                }
                this.area = common.formatNum(this.area);
                this.totalPrice = common.formatNum(this.totalPrice);
                if (this.showYuanjia === true) {
                    if (this.ophouse === '') {
                        alert('\u8bf7\u8f93\u5165\u539f\u4ef7\uff01');
                        return;
                    }
                    this.ophouse = common.formatNum(this.ophouse);
                    // 原价大于总价
                    if (this.ophouse > this.totalPrice) {
                        alert('\u539f\u4ef7\u4e0d\u5e94\u8be5\u6bd4\u603b\u4ef7\u9ad8\uff0c\u8bf7\u91cd\u65b0\u8f93\u5165\uff01');
                        return;
                    }
                }
                if (this.area === 0) {
                    alert('\u8bf7\u8f93\u5165\u6b63\u786e\u7684\u9762\u79ef');
                    return;
                }
                if (this.totalPrice === 0) {
                    alert('\u8bf7\u8f93\u5165\u6b63\u786e\u7684\u603b\u4ef7');
                    return;
                }
                // 收集数据
                var data = {
                    housenature: this.housing3,// 物业类型
                    countway: this.housing4,// 计算方式
                    houseYear: this.housing2,// 房产购置年限
                    firsthouseIf: this.$refs.radio1.picked === '1' ? 1 : 2,// 是否是首次购房
                    onlyhouseIf: this.$refs.radio2.picked === '1' ? 1 : 2,// 是否唯一住房
                    houseArea: this.area,// 建筑面积
                    housePrice:  this.totalPrice,// 总价
                    type: 'esf'
                };
                // 录入原价
                if (this.showYuanjia === true) {
                    data.ophouse = this.ophouse;
                }
                this.$dispatch('begin-count', data);
            }
        }
    });
    // 税费主视图
    // 点击发送ajax标志位

    Vue.component('tax', {
        template: '<section>'
        + '<div class="sjq-t bb"><div class="mTab"><div class="flexbox">'
        + '<a class="{{xfActive}}" v-on:click="xfChange">新房</a><a class="{{esfActive}}" v-on:click="esfChange">二手房</a>'
        + '</div></div></div>'
        + '<component :is="view" v-on:begin-count="calculate" v-ref:child></component>'
        + '</section>'
        + '<re-tax :handle-tab="handleTab" v-show="showResult" v-ref:result></re-tax>'
        + '<mg-housing v-show="showHousing" v-on:housing-msg="handleHousing"></mg-housing>'
        + '<mg-housing2 v-show="showHousing2" v-on:housing2-msg="handleHousing2"></mg-housing2>'
        + '<mg-housing3 v-show="showHousing3" v-on:housing3-msg="handleHousing3"></mg-housing3>'
        + '<mg-housing4 v-show="showHousing4" v-on:housing4-msg="handleHousing4"></mg-housing4>',
        props: ['rate', 'rateMsg'],
        data: function () {
            return {
                view: 'xf',
                xfActive: 'active',
                esfActive: '',
                showHousing: false,
                showHousing2: false,
                showHousing3: false,
                showHousing4: false,
                showResult: false,
                data: {},
                ajaxFlag: true
            };
        },
        methods: {
            xfChange: function () {
                if (this.view !== 'xf') {
                    this.xfActive = 'active';
                    this.esfActive = '';
                    this.view = 'xf';
                    // 隐藏结果页
                    $('.jsresults').hide();
                    this.showResult = false;
                    this.ajaxFlag = true;
                }
            },
            esfChange: function () {
                if (this.view !== 'esf') {
                    this.esfActive = 'active';
                    this.xfActive = '';
                    this.view = 'esf';
                    // 隐藏结果页
                    $('.jsresults').hide();
                    this.showResult = false;
                    this.ajaxFlag = true;
                }
            },
            handleHousing: function (obj) {
                this.$refs.child.housingMsg = obj.text;
                this.$refs.child.housing = obj.val;
                this.showHousing = false;
                common.hideDiv();
            },
            handleHousing2: function (obj) {
                this.$refs.child.housing2Msg = obj.text;
                this.$refs.child.housing2 = obj.val;
                this.showHousing2 = false;
                this.ajaxFlag = true;
                common.hideDiv();
            },
            handleHousing3: function (obj) {
                this.$refs.child.housing3Msg = obj.text;
                this.$refs.child.housing3 = obj.val;
                this.showHousing3 = false;
                this.ajaxFlag = true;
                common.hideDiv();
            },
            handleHousing4: function (obj) {
                this.$refs.child.housing4Msg = obj.text;
                this.$refs.child.housing4 = obj.val;
                this.showHousing4 = false;
                if (obj.val === '2') {
                    this.$refs.child.showYuanjia = true;
                } else {
                    this.$refs.child.showYuanjia = false;
                }
                this.ajaxFlag = true;
                common.hideDiv();
            },
            calculate: function (data) {
                // 记录本vue that
                var that = this;

                if (that.view === 'esf') {
                    // 计算数据
                    data.pageType = 5;
                    var resultData = {};
                    if (that.ajaxFlag) {
                        var ajaxData = {
                            area: data.houseArea,
                            price: data.housePrice,
                            houseYear: data.houseYear,
                            firsthouseIf: data.firsthouseIf,
                            onlyhouseIf: data.onlyhouseIf,
                            housenature: data.housenature,
                            countway: data.countway
                        };
                        // 增加计算方式和原价
                        if (data.ophouse) {
                            ajaxData.ophouse = data.ophouse;
                        }
                        $.getJSON(setting.ESF_TAXS_RESULT_URL, ajaxData, function (data) {
                            if (data) {
                                that.ajaxFlag = false;
                                resultData.housePrice = common.formatNum(data.house_total);
                                resultData.qTax = parseInt(data.deed);
                                resultData.yhTax = parseInt(data.saletax);
                                resultData.individualTax = parseInt(data.individualIncometax);
                                resultData.stamptax = parseInt(data.stamptax);
                                resultData.costtax = parseInt(data.costtax);
                                resultData.Syntheticaltax = parseInt(data.Syntheticaltax);
                                resultData.total = parseInt(data.total);
                                resultData.pageType = data.pageType;
                                resultData.autoPieParams = [
                                    {value: parseInt(data.deed), color: '#baea96'},
                                    {value: data.saletax, color: '#6dbffe'},
                                    {value: parseInt(data.stamptax), color: '#fffa59'},
                                    {value: parseInt(data.individualIncometax), color: '#fd6e9e'},
                                    {value: parseInt(data.costtax), color: '#fda585'},
                                    {value: parseInt(data.Syntheticaltax), color: '#ff7c7d'}
                                ];
                                // ajax数据成功之后显示结果
                                that.$broadcast('showResult', resultData);
                                // that.showResult = true;
                                var resultD = $('.jsresults');
                                resultD.show();
                                $(document).scrollTop(resultD.offset().top);
                            }
                        }).fail(function () {
                            alert('请检查网络');
                            return;
                        });
                    }
                } else {
                    data.pageType = 4;
                    var vars = seajs.data.vars;
                    var param = {
                        city: vars.city,
                        area: data.houseArea,
                        price: data.housePrice
                    };
                    param.isFirstHouse = $('.ipt-rd:checked').val();
                    if(param.isFirstHouse === '0'){
                        param.isFirstHouse = 2;
                    }
                    var resultData2 = {};
                    $.ajax({
                        url: vars.siteUrl + 'tools/?a=ajaxXfTaxes',
                        data:param,
                        success:function(data){
                            resultData2.totalPrice = parseInt(data.zongjia) / 10000;
                            resultData2.qTaxs = data.qishui;
                            resultData2.htgbTax = data.gongbenfei;
                            resultData2.taxTotal = data.shuifeizongjia;
                            resultData2.wxjjTax = data.weixiujijin;
                            resultData2.qsdjTax = data.quanshudengjifei;
                            resultData2.pageType = 4;
                            resultData2.autoPieParams = [
                                {value: data.qishui, color: '#bae796'},
                                {value: data.gongbenfei, color: '#ff6ca0'},
                                {value: data.weixiujijin, color: '#00b6f1'},
                                {value: data.quanshudengjifei, color: '#ffd974'}
                            ];
                            //var resultData2 = modelParse.calResult(data);
                            that.$broadcast('showResult', resultData2);
                            // that.showResult = true;
                            var resultD = $('.jsresults');
                            resultD.show();
                            $(document).scrollTop(resultD.offset().top);
                        }
                    });

                }
            }
        },
        events: {
            changeTab: function (data) {
                if (data != this.type) {
                    this.showResult = false;
                    this.type = data;
                }
            }
        },
        ready: function () {
            if (location.href.indexOf('esftaxs') > -1) {
                this.esfActive = 'active';
                this.xfActive = '';
                this.view = 'esf';
            }
        }
    });
});