/**
 * 组合贷款视图
 * by zhangcongfeng@fang.com
 */
define('view/combinationLoansView', ['view/components', 'view/calView','view/calDetailView','util/common','model/modelParse','iscroll/2.0.0/iscroll-lite'], function (require) {
    'use strict';
    require('view/components');
    require('view/calView');
    require('view/calDetailView');
    var common = require('util/common');
    var modelParse = require('model/modelParse');
    var IScroll = require('iscroll/2.0.0/iscroll-lite');
    var scroll = null;

    Vue.component('zhdai', {
        template: '<section v-show="showDai"><div class="jsqBox"><ul class="jsq-list zhd">'
        + '<li><div>商业贷款：</div>'
        + '<div><div class="flexbox">'
        + '<input type="number" class="ipt-text"  pattern="[0-9]*" v-model="syMoney" placeholder="{{hint}}" v-on:input="inputLimit">'
        + '<span>万元</span></div></div></li>'
        + '<select-li label="商业贷款按揭年数：" :data-value="syYear" :msg="syMsg" v-on:click="syYearClick"></select-li>'
        + '<li><div>公积金贷款：</div>'
        + '<div><div class="flexbox">'
        + '<input type="number" class="ipt-text"  pattern="[0-9]*" v-model="gjjMoney" placeholder="{{hint}}" v-on:input="inputLimit">'
        + '<span>万元</span></div></div></li>'
        + '<select-li label="公积金贷款按揭年数：" :data-value="gjjYear" :msg="gjjMsg" v-on:click="gjjYearClick"></select-li>'
        + '<select-li label="商业利率：" :data-value="syRate" :msg="syRateMsg" v-on:click="syRateClick"></select-li>'
        + '<select-li label="公积金利率：" :data-value="gjjRate" :msg="gjjRateMsg" v-on:click="gjjRateClick"></select-li>'
        + '</ul><v-button v-on:click="calculate"></v-button></div>'
        + '<re-combination :detail="detail" :handle-tab="handleTab" v-show="showResult" v-ref:result></re-combination></section>'
        + '<detail-view v-show="showDetail" v-on:tab-click="detailTab"></detail-view>'
        + '<mg-rate v-show="showRate" v-on:rate-msg="handleRate" v-on:rate-msg2="handleRate" v-ref:rate></mg-rate>'
        + '<mg-year v-show="showYear" v-on:year-msg="handleYear" v-ref:yearSel></mg-year>',
        props: ['rate', 'rateMsg'],
        data: function () {
            return {
                showResult: false,
                showDai: true,
                showYear: false,
                showRate: false,
                showDetail: false,
                syMoney: '',
                gjjMoney: '',
                hint: '请输入贷款金额',
                syYear: '20',
                gjjYear: '20',
                syMsg: '20年（240期）',
                gjjMsg: '20年（240期）',
                syBase: this.$parent.businessRate,
                gjjBase: this.$parent.fundRate,
                syDiscount: '1',
                gjjDiscount: '1',
                syRate: this.$parent.businessRate,
                gjjRate: this.$parent.fundRate,
                syRateMsg: '基准利率（' + this.$parent.businessRate + '％）',
                gjjRateMsg: '基准利率（' + this.$parent.fundRate + '％）',
                yearType: '',
                rateType: '',
                payMethodType: '0',
                syIndex: 0,
                gjjIndex: 0,
                yearFlag:true
            };
        },
        methods: {
            inputLimit: function (ev) {
                var value = ev.target.value;
                value = value.match(/\d{0,4}(\.\d{0,2})?/g);
                ev.target.value = value[0];
                // this[ev.target.id] = value[0];
            },
            // 商业贷款按揭年数点击
            syYearClick: function () {
                // this.showYear = true;
                this.yearType = 'sy';
                var num = Number(this.syYear);
                this.$broadcast('yearSel', num);
                $('#floatDiv').show();
                // common.showDiv();
                document.ontouchmove = function () {
                    return false;
                };
                var section = $('#floatDiv').find('section').get(0);
                if (!scroll) {
                    scroll = new IScroll(section, {
                        bindToWrapper: true, scrollY: true, scrollX: false,preventDefault:false
                    });
                }
                scroll.refresh();
                // 定位

                if (1 < num && num <= 27) {
                    scroll.scrollTo(0, -(num - 2) * 45);
                }else if (num === 1) {
                    scroll.scrollTo(0, 0);
                }else {
                    scroll.scrollTo(0, -1148);
                }
            },
            // 公积金贷款按揭年数点击
            gjjYearClick: function () {
                this.yearType = 'gjj';
                var num = Number(this.gjjYear);
                this.$broadcast('yearSel', num);
                $('#floatDiv').show();
                var section = $('#floatDiv').find('section').get(0);
                if (!scroll) {
                    scroll = new IScroll(section, {
                        bindToWrapper: true, scrollY: true, scrollX: false,preventDefault:false
                    });
                }
                scroll.refresh();
                // 定位

                if (1 < num && num <= 27) {
                    scroll.scrollTo(0, -(num - 2) * 45);
                }else if (num === 1) {
                    scroll.scrollTo(0, 0);
                }else {
                    scroll.scrollTo(0, -1148);
                }
            },
            // 商业利率点击
            syRateClick: function () {
                this.$parent.showNav = false;
                this.showDai = false;
                this.showRate = true;
                // 初始化
                if (this.syDiscount === '0') {
                    this.$refs.rate.userRate = this.syRate;
                    this.$refs.rate.todos.forEach(function (value,inx,array) {
                        array[inx].cla = '';
                    });
                }else {
                    this.$refs.rate.userRate = '';
                    this.$refs.rate.todos.forEach(function (value,inx,array) {
                        array[inx].cla = '';
                    });
                    this.$refs.rate.todos[this.syIndex].cla = 'on';
                }
                this.rateType = 'sy';
            },
            // 公积金利率点击
            gjjRateClick: function () {
                this.$parent.showNav = false;
                this.showDai = false;
                this.showRate = true;
                if (this.gjjDiscount === '0') {
                    this.$refs.rate.userRate = this.gjjRate;
                    this.$refs.rate.todos.forEach(function (value,inx,array) {
                        array[inx].cla = '';
                    });
                }else {
                    this.$refs.rate.userRate = '';
                    this.$refs.rate.todos.forEach(function (value,inx,array) {
                        array[inx].cla = '';
                    });
                    this.$refs.rate.todos[this.gjjIndex].cla = 'on';
                }
                this.rateType = 'gjj';
            },
            // 利率处理函数
            handleRate: function (obj,index) {
                if (typeof obj === 'string') {
                    // 自定义的利率值
                    this[this.rateType + 'Discount'] = '0';
                    this[this.rateType + 'Index'] = '';
                    this[this.rateType + 'Rate'] = obj;
                    this[this.rateType + 'RateMsg'] = obj + '％';
                } else {
                    // 选择的利率值
                    this[this.rateType + 'Discount'] = obj.val;
                    this[this.rateType + 'Index'] = index;
                    var year = $('#floatDiv').find('.activeS').attr('data-val');
                    if(this.rateType === 'gjj'){
                        if (year === '1' || year === '2' || year === '3' || year === '4' || year === '5') {
                            this[this.rateType + 'Base'] = this.$parent.fundRateArr10[0];
                            this[this.rateType + 'Rate'] = parseFloat((this[this.rateType + 'Base'] * obj.val).toFixed(3));
                            this[this.rateType + 'RateMsg'] = this[this.rateType + 'Rate'] + '％';
                        } else if (obj.val === '1') {
                            this[this.rateType + 'Base'] = this.$parent.fundRateArr10[1];
                            this[this.rateType + 'Rate'] = parseFloat((this[this.rateType + 'Base'] * obj.val).toFixed(3));
                            this[this.rateType + 'RateMsg'] = '基准利率（' + this[this.rateType + 'Base'] + '％）';
                        } else {
                            this[this.rateType + 'Base'] = this.$parent.fundRateArr10[1];
                            this[this.rateType + 'Rate'] = parseFloat((this[this.rateType + 'Base'] * obj.val).toFixed(3));
                            this[this.rateType + 'RateMsg'] = this[this.rateType + 'Rate'] + '％';
                        }
                    }else{
                        if(year === '1'){
                            this[this.rateType + 'Base'] = this.$parent.businessRateArr10[0];
                            this[this.rateType + 'Rate'] = parseFloat((this[this.rateType + 'Base'] * obj.val).toFixed(3));
                            this[this.rateType + 'RateMsg'] = this[this.rateType + 'Rate'] + '％';
                        }else if (year === '2' || year === '3' || year === '4' || year === '5') {
                            this[this.rateType + 'Base'] = this.$parent.businessRateArr10[1];
                            this[this.rateType + 'Rate'] = parseFloat((this[this.rateType + 'Base'] * obj.val).toFixed(3));
                            this[this.rateType + 'RateMsg'] = this[this.rateType + 'Rate'] + '％';
                        } else if (obj.val === '1') {
                            this[this.rateType + 'Base'] = this.$parent.businessRate;
                            this[this.rateType + 'Rate'] = parseFloat((this[this.rateType + 'Base'] * obj.val).toFixed(3));
                            this[this.rateType + 'RateMsg'] = '基准利率（' + this[this.rateType + 'Base'] + '％）';
                        } else {
                            this[this.rateType + 'Base'] = this.$parent.businessRate;
                            this[this.rateType + 'Rate'] = parseFloat((this[this.rateType + 'Base'] * obj.val).toFixed(3));
                            this[this.rateType + 'RateMsg'] = this[this.rateType + 'Rate'] + '％';
                        }
                    }
                }
                this.showRate = false;
                this.$parent.showNav = true;
                this.showDai = true;
            },
            // 按揭年数处理函数
            handleYear: function (obj) {
                this.yearFlag = false;
                this[this.yearType + 'Year'] = obj.val;
                this[this.yearType + 'Msg'] = obj.text;
                this.$parent.rate = parseFloat(this.$parent.rate);
                if(this.$parent.rate){
                    if(this.yearType === 'gjj'){
                        var discount2 = parseFloat($('#ratePage').find('.on').attr('data-val')) || 1;
                        if (obj.val === 1 || obj.val === 2 || obj.val === 3 || obj.val === 4 || obj.val === 5) {
                            this[this.yearType + 'Base'] = this.$parent.fundRateArr10[0];
                            this[this.yearType + 'Rate'] = parseFloat((this[this.yearType + 'Base'] * discount2).toFixed(3));
                            this[this.yearType + 'RateMsg'] = this[this.yearType + 'Rate'] + '％';
                        } else if (discount2 === 1) {
                            this[this.yearType + 'Base'] = this.$parent.fundRateArr10[1];
                            this[this.yearType + 'Rate'] = parseFloat((this[this.yearType + 'Base'] * discount2).toFixed(3));
                            this[this.yearType + 'RateMsg'] = '基准利率（' + this[this.yearType + 'Base'] + '％）';
                        } else {
                            this[this.yearType + 'Base'] = this.$parent.fundRateArr10[1];
                            this[this.yearType + 'Rate'] = parseFloat((this[this.yearType + 'Base'] * discount2).toFixed(3));
                            this[this.yearType + 'RateMsg'] = this[this.yearType + 'Rate'] + '％';
                        }
                    }else{
                        var discount1 = parseFloat($('#ratePage').find('.on').attr('data-val')) || 1;
                        if(obj.val === 1){
                            this[this.yearType + 'Base'] = this.$parent.businessRateArr10[0];
                            this[this.yearType + 'Rate'] = parseFloat((this[this.yearType + 'Base'] * discount1).toFixed(3));
                            this[this.yearType + 'RateMsg'] = this[this.yearType + 'Rate'] + '％';
                        }else if (obj.val === 2 || obj.val === 3 || obj.val === 4 || obj.val === 5) {
                            this[this.yearType + 'Base'] = this.$parent.businessRateArr10[1];
                            this[this.yearType + 'Rate'] = parseFloat((this[this.yearType + 'Base'] * discount1).toFixed(3));
                            this[this.yearType + 'RateMsg'] = this[this.yearType + 'Rate'] + '％';
                        } else if (discount1 === 1) {
                            this[this.yearType + 'Base'] = this.$parent.businessRate;
                            this[this.yearType + 'Rate'] = parseFloat((this[this.yearType + 'Base'] * discount1).toFixed(3));
                            this[this.yearType + 'RateMsg'] = '基准利率（' + this[this.yearType + 'Base'] + '％）';
                        } else {
                            this[this.yearType + 'Base'] = this.$parent.businessRate;
                            this[this.yearType + 'Rate'] = parseFloat((this[this.yearType + 'Base'] * discount1).toFixed(3));
                            this[this.yearType + 'RateMsg'] = this[this.yearType + 'Rate'] + '％';
                        }
                    }
                }
                // this.showYear = false;
                $('#floatDiv').hide();
                var that = this;
                setTimeout(function(){
                    that.yearFlag = true
                },300)
            },
            calculate: function () {
                // (1)验证
                // 商业贷款和公积金贷款不全为空时另一个为0
                if (this.syMoney === '' && this.gjjMoney === '') {
                    alert('\u8bf7\u8f93\u5165\u8d37\u6b3e\u603b\u989d');
                    return;
                } else if (this.gjjMoney === '') {
                    this.gjjMoney = '0';
                } else if (this.syMoney === '') {
                    this.syMoney = '0';
                }
                this.syMoney = common.formatNum(this.syMoney);
                this.gjjMoney = common.formatNum(this.gjjMoney);
                // 商业贷款和公积金贷款不能全为0
                if (this.syMoney === 0 && this.gjjMoney === 0) {
                    alert('\u8bf7\u8f93\u5165\u8d37\u6b3e\u603b\u989d');
                    return;
                }
                // 页面类型
                this.pageType = this.$parent.pageType;
                // 初始化计算方式
                this.payMethodType = '0';
                // (2)收集数据
                var data = {
                    // 商业贷款相关
                    dk: {
                        dkMoney: this.syMoney * 10000,
                        monthNum: common.formatNum(this.syYear) * 12,
                        monthRate: common.formatNum(this.syRate) * 0.01 / 12,
                        initrateVal: this.syRate,
                        rateDiscount: this.syDiscount
                    },
                    // 公积金贷款相关
                    gjj: {
                        dkMoney: this.gjjMoney * 10000,
                        monthNum: common.formatNum(this.gjjYear) * 12,
                        monthRate: common.formatNum(this.gjjRate) * 0.01 / 12,
                        initrateVal: this.gjjRate,
                        rateDiscount: this.gjjDiscount
                    },
                    // 计算方式(默认是0)
                    type: '0',
                    // 页面类型
                    pageType: this.$parent.pageType
                };
                // (3)计算结果
                var resultData = modelParse.calResult(data);
                // (4)展示结果
                // 按揭年数是否一样
                // var showDiffer = (this.syYear === this.gjjYear);
                this.$broadcast('showResult', resultData);
                // 只有点击开始计算按钮时候才触发(初始化还款方式)
                this.$broadcast('payMethod');
                // this.showResult = true;
                var resultD = $('.jsresults');
                resultD.show();
                $(document).scrollTop(resultD.offset().top);
            },
            // 还款方式tab切换
            handleTab: function (str) {
                this.payMethodType = str;
                // 收集数据
                var data = {
                    // 商业贷款相关
                    dk: {
                        dkMoney: this.syMoney * 10000,
                        monthNum: common.formatNum(this.syYear) * 12,
                        monthRate: common.formatNum(this.syRate) * 0.01 / 12,
                        initrateVal: this.syRate,
                        rateDiscount: this.syDiscount
                    },
                    // 公积金贷款相关
                    gjj: {
                        dkMoney: this.gjjMoney * 10000,
                        monthNum: common.formatNum(this.gjjYear) * 12,
                        monthRate: common.formatNum(this.gjjRate) * 0.01 / 12,
                        initrateVal: this.gjjRate,
                        rateDiscount: this.gjjDiscount
                    },
                    // 计算方式(默认是0)
                    type: str,
                    // 页面类型
                    pageType: this.$parent.pageType
                };
                // (3)计算结果
                var resultData = modelParse.calResult(data);
                resultData.payMethodType = str;
                // (4)展示结果
                // 按揭年数是否一样
                // var showDiffer = (this.syYear === this.gjjYear);
                this.$broadcast('showResult', resultData);
                // this.showResult = true;
            },
            detail: function () {
                this.$parent.showNav = false;
                this.showDai = false;
                // 显示结果页
                $('.left').html('').html('<a id="wapxfsy_D01_01" class="back" href="javascript:history.back(-1)"><i></i></a>');
                // 传递数据到子组件
                var resultData = modelParse.detailCalResult(this.payMethodType);
                resultData.payMethodType = this.payMethodType;
                resultData.pageType = this.$parent.pageType;
                this.$broadcast('detail', resultData);
                this.showDetail = true;
                modelParse.pushStateFn(true, this.$parent.pageType);
                // 页面滚动效果
                common.scrollEvent();
            },
            detailTab: function (str) {
                var data = {
                    // 商业贷款相关
                    dk: {
                        dkMoney: this.syMoney * 10000,
                        monthNum: common.formatNum(this.syYear) * 12,
                        monthRate: common.formatNum(this.syRate) * 0.01 / 12,
                        initrateVal: this.syRate,
                        rateDiscount: this.syDiscount
                    },
                    // 公积金贷款相关
                    gjj: {
                        dkMoney: this.gjjMoney * 10000,
                        monthNum: common.formatNum(this.gjjYear) * 12,
                        monthRate: common.formatNum(this.gjjRate) * 0.01 / 12,
                        initrateVal: this.gjjRate,
                        rateDiscount: this.gjjDiscount
                    },
                    // 计算方式(默认是0)
                    type: str,
                    // 页面类型
                    pageType: this.$parent.pageType
                };
                // (3)计算结果
                modelParse.calResult(data);
                var resultData = modelParse.detailCalResult(str);
                resultData.payMethodType = str;
                resultData.pageType = this.$parent.pageType;
                this.$broadcast('detail', resultData);
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
        ready:function(){
            var that = this;
            $('a').on('click',function(){
                if(!that.yearFlag){
                    return false;
                }
            })
        }
    });
});