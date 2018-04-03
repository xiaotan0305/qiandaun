/**
 * 商业贷款视图
 * by zhangcongfeng@fang.com
 */
define('view/businessLoansView', ['view/components', 'view/calView', 'util/common', 'model/modelParse', 'view/calDetailView', 'iscroll/2.0.0/iscroll-lite'],
    function (require) {
        'use strict';
        require('view/components');
        require('view/calView');
        require('view/calDetailView');
        require('view/resultCom');
        var common = require('util/common');
        var modelParse = require('model/modelParse');
        var IScroll = require('iscroll/2.0.0/iscroll-lite');
        var scroll = null;

        Vue.component('daikuan', {
            template: '<section v-show="showDai"><div class="jsqBox"><ul class="jsq-list">'
            + '<li><div>房款总价：</div>'
            + '<div><div class="flexbox">'
            + '<input type="number" class="ipt-text"  pattern="[0-9]*" v-model="totalMoney" v-on:input="inputLimit1">'
            + '<span>万元</span></div></div></li>'
            + '<select-li label="首付比例：" :data-value="propotion" :msg="propotionMsg" v-on:click="payClick"></select-li>'
            + '<li><div>贷款总额：</div>'
            + '<div><div class="flexbox">'
            + '<input type="number" class="ipt-text"  pattern="[0-9]*" v-model="dkTotalMoney" v-on:input="inputLimit">'
            + '<span>万元</span></div></div></li>'
            + '<select-li label="按揭年数：" :data-value="year" :msg="yearMsg" v-on:click="yearClick"></select-li>'
            + '<select-li label="利&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;率：" :data-value="rate" :msg="rateMsg" v-on:click="rateClick"></select-li>'
            + '</ul><v-button v-on:click="calculate"></v-button></div>'
            + '<re-business :detail="detail" :handle-tab="handleTab" v-show="showResult" v-ref:result></re-business>'
            + '</section>'
            + '<new-house v-show="showList"></new-house>'
            + '<detail-view v-show="showDetail" v-on:tab-click="detailTab"></detail-view>'
            + '<down-payment v-show="showPro" v-on:child-msg="handlePay" v-on:child-msg2="handlePay" v-ref:payment></down-payment>'
            + '<mg-year v-show="showYear" v-on:year-msg="handleYear" v-on:year-msg2="handleYear" v-ref:year></mg-year>'
            + '<mg-rate v-show="showRate" v-on:rate-msg="handleRate" v-on:rate-msg2="handleRate" v-ref:rate></mg-rate>',
            props: ['rate', 'rateMsg'],
            data: function () {
                return {
                    showDai: true,
                    showResult: false,
                    showDetail: false,
                    totalMoney: '100',
                    dkTotalMoney: '70',
                    showPro: false,
                    showYear: false,
                    showRate: false,
                    // 比例值
                    propotionNum: 3,
                    // 首付比例的类型
                    proType: '0',
                    // 成数
                    propotionText: '三成',
                    // 首付
                    proMoney: 30,
                    year: '20',
                    yearMsg: '20年（240期）',
                    discount: '1',
                    type: '1',
                    payMethodType: '0',
                    yearFlag:true,
                    showList:false
                };
            },
            computed: {
                // 首付比例文本信息
                propotionMsg: function () {
                    // 房屋总价输入影响 首付比例
                    var message = '';
                    if (this.proType === '0') {
                        this.proMoney = parseFloat((this.totalMoney * this.propotionNum * 0.1).toFixed(2));
                        message = this.propotionText + '（' + this.proMoney + '万）';
                    } else {
                        // 自定义首付
                        message = this.proMoney + '万';
                    }
                    this.dkTotalMoney = (this.totalMoney - this.proMoney).toFixed(2) + '';
                    return message;
                },
                // 首付比例data-value
                propotion: function () {
                    return this.proType + '_' + this.propotionNum;
                }
            },
            methods: {
                // 点击首付比例
                payClick: function () {
                    this.$parent.showNav = false;
                    this.showDai = false;
                    this.showPro = true;
                    modelParse.pushStateFn(true, this.$parent.pageType);
                },
                // 首付比例处理函数
                handlePay: function (obj) {
                    if (typeof obj === 'string') {
                        this.proMoney = obj;
                        this.proType = '1';
                    } else {
                        this.$refs.payment.userVal = '';
                        this.propotionNum = obj.val;
                        this.propotionText = obj.text;
                        this.proType = '0';
                    }
                    this.showPro = false;
                    this.$parent.showNav = true;
                    this.showDai = true;
                },
                // 点击按揭年数
                yearClick: function () {
                    $('#floatDiv').show();
                    document.ontouchmove = function () {
                        return false;
                    };
                    // 加滚动插件
                    var section = $('#floatDiv').find('section').get(0);
                    if (!scroll) {
                        scroll = new IScroll(section, {
                            bindToWrapper: true, scrollY: true, scrollX: false,preventDefault:false
                        });
                    }
                    scroll.refresh();
                    // 定位
                    var num = Number(this.year);
                    if (1 < num && num <= 27) {
                        scroll.scrollTo(0, -(num - 2) * 45);
                    } else if (num === 1) {
                        scroll.scrollTo(0, 0);
                    } else {
                        scroll.scrollTo(0, -1148);
                    }
                },
                // 利率点击
                rateClick: function () {
                    this.$parent.showNav = false;
                    this.showDai = false;
                    this.showRate = true;
                },
                // 按揭年数处理函数
                handleYear: function (obj) {
                    this.year = obj.val;
                    this.yearMsg = obj.text;
                    this.yearFlag = false;
                    var discount = parseFloat($('#ratePage').find('.on').attr('data-val')) || 1;
                    var index = $('#navMenu').find('a.active').index();
                    this.$parent.rate = parseFloat(this.$parent.rate);
                    if(this.$parent.rate){
                        if (index === 0) {
                            // 商业贷款
                            if (obj.val === 1) {
                                this.$parent.baseRate = this.$parent.businessRateArr10[0];
                                this.$parent.rate = parseFloat((this.$parent.baseRate * discount).toFixed(3));
                                this.$parent.rateMsg = this.$parent.rate + '%';
                            } else if (obj.val === 2 || obj.val === 3 || obj.val === 4 || obj.val === 5) {
                                this.$parent.baseRate = this.$parent.businessRateArr10[1];
                                this.$parent.rate = parseFloat((this.$parent.baseRate * discount).toFixed(3));
                                this.$parent.rateMsg = this.$parent.rate + '%';
                            } else {
                                this.$parent.baseRate = this.$parent.businessRate;
                                this.$parent.rate = parseFloat((this.$parent.baseRate * discount).toFixed(3));
                                if (discount === 1) {
                                    this.$parent.rateMsg = '基准利率（' + this.$parent.rate + '%）';
                                } else {
                                    this.$parent.rateMsg = this.$parent.rate + '%';
                                }
                            }
                        } else {
                            // 公积金贷款
                            if (obj.val === 1 || obj.val === 2 || obj.val === 3 || obj.val === 4 || obj.val === 5) {
                                this.$parent.baseRate = this.$parent.fundRateArr10[0];
                                this.$parent.rate = parseFloat((this.$parent.baseRate * discount).toFixed(3));
                                this.$parent.rateMsg = this.$parent.rate + '%';
                            } else {
                                this.$parent.baseRate = this.$parent.fundRateArr10[1];
                                this.$parent.rate = parseFloat((this.$parent.baseRate * discount).toFixed(3));
                                if (discount === 1) {
                                    this.$parent.rateMsg = '基准利率（' + this.$parent.rate + '%）';
                                } else {
                                    this.$parent.rateMsg = this.$parent.rate + '%';
                                }
                            }
                        }
                    }

                    common.hideDiv();
                    $('#floatDiv').hide();
                    // 解决穿透点击问题
                    var that = this;
                    setTimeout(function(){
                        that.yearFlag = true;
                    },300)
                },
                // 利率处理函数
                handleRate: function (obj) {
                    if (typeof obj === 'string') {
                        // 自定义
                        this.discount = '0';
                        this.$parent.rate = obj;
                        this.$parent.rateMsg = this.$parent.rate + '％';
                    } else {
                        // 选择利率
                        this.$refs.rate.userRate = '';
                        this.discount = obj.val;
                        var year = $('#floatDiv').find('.activeS').attr('data-val');
                        var index = $('#navMenu').find('a.active').index();
                        if (index === 0) {
                            if (year === '1') {
                                this.$parent.baseRate = this.$parent.businessRateArr10[0];
                                this.$parent.rate = parseFloat((this.$parent.baseRate * obj.val).toFixed(3));
                                this.$parent.rateMsg = this.$parent.rate + '%';
                            } else if (year === '2' || year === '3' || year === '4' || year === '5') {
                                this.$parent.baseRate = this.$parent.businessRateArr10[1];
                                this.$parent.rate = parseFloat((this.$parent.baseRate * obj.val).toFixed(3));
                                this.$parent.rateMsg = this.$parent.rate + '%';
                            } else if (obj.val === '1') {
                                this.$parent.baseRate = this.$parent.businessRate;
                                this.$parent.rate = parseFloat((this.$parent.baseRate * obj.val).toFixed(3));
                                this.$parent.rateMsg = '基准利率（' + this.$parent.rate + '%）';
                            } else {
                                this.$parent.baseRate = this.$parent.businessRate;
                                this.$parent.rate = parseFloat((this.$parent.baseRate * obj.val).toFixed(3));
                                this.$parent.rateMsg = this.$parent.rate + '%';
                            }
                        } else {
                            // 公积金贷款
                            if (year === '1' || year === '2' || year === '3' || year === '4' || year === '5') {
                                this.$parent.baseRate = this.$parent.fundRateArr10[0];
                                this.$parent.rate = parseFloat((this.$parent.baseRate * obj.val).toFixed(3));
                                this.$parent.rateMsg = this.$parent.rate + '%';
                            } else if (obj.val === '1') {
                                this.$parent.baseRate = this.$parent.fundRateArr10[1];
                                this.$parent.rate = parseFloat((this.$parent.baseRate * obj.val).toFixed(3));
                                this.$parent.rateMsg = '基准利率（' + this.$parent.rate + '%）';
                            } else {
                                this.$parent.baseRate = this.$parent.fundRateArr10[1];
                                this.$parent.rate = parseFloat((this.$parent.baseRate * obj.val).toFixed(3));
                                this.$parent.rateMsg = this.$parent.rate + '%';
                            }
                        }
                    }
                    this.showRate = false;
                    this.$parent.showNav = true;
                    this.showDai = true;
                },
                // 输入框限制(小数点前四位内,后两位以内)
                inputLimit: function (ev) {
                    var value = ev.target.value;
                    value = value.match(/\d{0,4}(\.\d{0,2})?/g);
                    // this.totalMoney = value[0];
                    ev.target.value = value[0];
                },
                // 房屋总价输入
                inputLimit1: function (ev) {
                    var value = ev.target.value;
                    value = value.match(/\d{0,4}(\.\d{0,2})?/g);
                    ev.target.value = value[0];
                    this.totalMoney = value[0];
                    this.dkTotalMoney = (this.totalMoney - this.proMoney).toFixed(2) + '';
                },
                // 计算结果
                calculate: function () {
                    // console.log('22');
                    // (1)验证
                    // 请输入房款总额,请输入贷款总额
                    this.totalMoney = common.formatNum(this.totalMoney);
                    this.dkTotalMoney = common.formatNum(this.dkTotalMoney);
                    if (this.totalMoney === 0) {
                        alert('\u8bf7\u8f93\u5165\u623f\u4ef7\u603b\u989d');
                        return;
                    }
                    if (this.dkTotalMoney === 0) {
                        alert('\u8bf7\u8f93\u5165\u8d37\u6b3e\u603b\u989d');
                        return;
                    }
                    if (this.dkTotalMoney > this.totalMoney) {
                        alert('\u8d85\u51fa\u8d37\u6b3e\u603b\u989d');
                        return;
                    }
                    this.pageType = this.$parent.pageType;
                    // 初始化计算方式
                    this.payMethodType = '0';
                    // (2)收集数据
                    var data = {
                        // 计算方式(默认是0)
                        type: 0,
                        // 页面类型
                        pageType: this.$parent.pageType,
                        // 房款总价
                        totalMoney: this.totalMoney,
                        // 贷款金额
                        dkTotalMoney: this.dkTotalMoney,
                        dkMoney: this.dkTotalMoney * 10000,
                        // 首付金额
                        sfMoney: this.proMoney,
                        // 按揭年数
                        ajYear: this.year,
                        // 按揭月数
                        monthNum: this.year * 12,
                        // 利率折扣
                        rateDiscount: this.discount,
                        // 月利率
                        monthRate: this.$parent.rate * 0.01 / 12,
                        // 利率
                        initrateVal: this.$parent.rate
                    };
                    // (3)计算结果
                    var resultData = modelParse.calResult(data);
                    // (4)展示结果
                    this.$broadcast('showResult', resultData);
                    this.$broadcast('payMethod');
                    this.$broadcast('getData',this.totalMoney);
                    // this.showResult = true;不能及时show(),不能滚动
                    // $append
                    var resultD = $('.resultBox');
                    resultD.show();
                    $(document).scrollTop(resultD.offset().top);
                },
                // 等额本息和等额本金切换tab
                handleTab: function (str) {
                    // 还款方式 '0'等额本息 '1'等额本金
                    this.payMethodType = str;
                    var data = {
                        type: str,
                        pageType: this.$parent.pageType,
                        totalMoney: this.totalMoney,
                        dkTotalMoney: this.dkTotalMoney,
                        dkMoney: this.dkTotalMoney * 10000,
                        sfMoney: this.proMoney,
                        ajYear: this.year,
                        monthNum: this.year * 12,
                        rateDiscount: this.discount,
                        monthRate: this.$parent.rate * 0.01 / 12,
                        initrateVal: this.$parent.rate
                    };
                    // (3)计算结果
                    var resultData = modelParse.calResult(data);
                    // (4)展示结果
                    this.$broadcast('showResult', resultData);
                },
                // 点击进入结果详情页
                detail: function () {
                    this.showList = false;
                    // 隐藏当前页
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
                        type: str,
                        pageType: this.$parent.pageType,
                        totalMoney: this.totalMoney,
                        dkTotalMoney: this.dkTotalMoney,
                        dkMoney: this.dkTotalMoney * 10000,
                        sfMoney: this.proMoney,
                        ajYear: this.year,
                        monthNum: this.year * 12,
                        rateDiscount: this.discount,
                        monthRate: this.$parent.rate * 0.01 / 12,
                        initrateVal: this.$parent.rate
                    };
                    // (3)计算结果
                    modelParse.calResult(data);
                    var resultData = modelParse.detailCalResult(str);
                    resultData.payMethodType = str;
                    resultData.pageType = this.$parent.pageType;
                    this.$broadcast('detail', resultData);
                }
            },
            ready:function () {
                var that = this;
                $('a').on('click',function(){
                    if(!that.yearFlag){
                        return false;
                    }
                });
                $('.left').on('click',function(){
                    that.showList = true;
                })
            },
            events: {
                changeTab: function (data) {
                    if (data !== this.$parent.pageType) {
                        this.showResult = false;
                        this.showList = false;
                        this.type = data;
                    }
                    // 切换公积金和商业贷款初始化 页面
                    if (data === 1 || data === 2) {
                        this.$refs.rate.userRate = '';
                        this.$refs.rate.todos.forEach(function (value, inx, array) {
                            array[inx].cla = '';
                        });
                        this.$refs.rate.todos[0].cla = 'on';
                        this.$refs.year.todos.forEach(function (value, inx, array) {
                            array[inx].cla = '';
                        });
                        this.$refs.year.todos[19].cla = 'activeS';
                        this.year = this.$refs.year.todos[19].val;
                        this.yearMsg = this.year + '年（240期）';
                    }
                }
            }
        });
    });