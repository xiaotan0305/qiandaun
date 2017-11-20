/**
 * Created by lina on 2017/7/19.
 * 首付贷
 */
define('modules/tools/mvc/sfView/getEsfSfTools', ['modules/tools/mvc/sfView/view',
        'modules/tools/mvc/sfView/component', 'modules/tools/mvc/sfView/result','modules/tools/mvc/sfView/calDetailView',
    'modules/tools/mvc/model/Calculate','iscroll/2.0.0/iscroll-lite'],
    function (require, exports, module) {
        'use strict';
        module.exports = function () {
            var component = require('modules/tools/mvc/sfView/component');
            var view = require('modules/tools/mvc/sfView/view');
            var resultView = require('modules/tools/mvc/sfView/result');
            var detailView = require('modules/tools/mvc/sfView/calDetailView');
            var Calculate = require('modules/tools/mvc/model/Calculate');
            var calculate = new Calculate();
            var width = $(document).width() * 0.3;
            var setting = require('model/setting');
            var returnData = '';
            var vars = seajs.data.vars;
            var docHeight = $(document).height();
            var dkTotal = parseFloat(vars.totalLoans);
            var ajaxData = {};
            Vue.component('content', {
                template: '<div v-show="show">'
                + '<section class="TAB-b">'
                + '<div class="flexbox">'
                + '<a href="javascript:void(0);" v-bind:class="{ active: firstCla }" @click="firstClick"><span>首套</span></a>'
                + '<a href="javascript:void(0);" v-bind:class="{ active: secondCla }" @click="secondClick"><span>二套</span></a>'
                + '</div></section>'
                + '<section class="ys-list fixed" id="ysList"  style="z-index:1000">'
                + '<div>'
                + '<dl class="flexbox">'
                + '<dt><h3>首付预算</h3><div><span>{{planMoney}}</span>万</div></dt>'
                + '<dd><ul><li><div><h3>净首付<i @click="floatShow1"></i></h3><span>{{clearMoney}}万</span></div></li>'
                + '<li><div><h3>税费</h3><span>{{taxPay}}万</span></div></li>'
                + '<li v-if="otherTop"><div><h3>其他<i @click="floatShow2"></i></h3><span>{{otherPay}}万</span></div></li></ul></dd></dl>'
                + '</div>'
                + '</section>'
                + '</div>'
                + ''
                + '<section class="form-Tab" v-show="show">'
                + '<ul class="flexbox">'
                + '<li v-bind:class="{ cur: activeFd }" @click="showFd">房贷计算</li>'
                + '<li v-bind:class="{ cur: activeTax }" @click="showTax">税费计算</li>'
                + '</ul>'
                + '</section>'
                + '<gjj-view  v-show="gjjShow" v-on:total-ipt="totalIpt"  v-on:calcu-msg="calcuMsg"></gjj-view>'
                + '<dk-view v-show="dkShow" v-on:total-ipt="totalIpt"  v-on:calcu-msg="calcuMsg"></dk-view>'
                + '<combination-view  v-show="comShow" v-on:total-ipt="totalIpt" v-on:calcu-msg="calcuMsg"></combination-view>'
                + '<tax-view v-show="taxShow" :tax-fee="totalMoney" v-on:calculate-msg="calculateMsg"></tax-view>'
                + '<div v-show="show">'
                + '<result-view v-show="resultShow" :gjj-rate="gjjRate" :sd-rate="sdRate" :is-com="showCom" v-on:show-detail="showDetail"  :rate="rate" :total-money="resultMoney" :total-interest="totalInterest" :mon-yg="monYg"></result-view>'
                + '<tax-result v-show="taxResultShow"></tax-result>'
                + '</div>'
                + '<dk-type v-show="typeShow" v-on:dk-type="selectType"></dk-type>'
                + '<float-alert v-show="floatShow" :float-tit="floatTit" :float-con="floatCon"></float-alert>'
                + '<detail-view v-on:tab-click="tabClick" v-show="detailShow"></detail-view>',
                data: function () {
                    return {
                        show: true,
                        // 首套样式
                        firstCla:true,
                        // 二套样式
                        secondCla:false,
                        // 提示标题
                        floatTit: '',
                        // 提示内容
                        floatCon: '',
                        // 提示框显示
                        floatShow: false,
                        // 商业贷显示
                        dkShow: true,
                        // 公积金贷显示
                        gjjShow: false,
                        // 组合贷显示
                        comShow: false,
                        // 显示税费框
                        taxShow: false,
                        activeFd: true,
                        activeTax: false,
                        // 贷款结果页显示
                        resultShow: false,
                        // 税费结果页显示
                        taxResultShow: false,
                        // 类型选择弹框显示
                        typeShow: false,
                        // 利率
                        rate: '',
                        // 总价
                        totalMoney: parseFloat(vars.price) || '',
                        // 总利息
                        totalInterest: '',
                        // 月供
                        monYg: '',
                        // 税费
                        taxPay: '',
                        // 其他
                        otherPay: Number(vars.otherFee),
                        // 净首付
                        clearMoney: Number(vars.netShoufu) || '',
                        // 首付预算
                        planMoney: '',
                        // 穿透点击
                        clickFlag: true,
                        // 显示其他选项
                        otherTop: Number(vars.otherFee) > 0 ,
                        ajaxFlag: true,
                        detailShow:false,
                        type:'sd',
                        detailFlag:false,
                        Data:{},
                        gjjRate:'',
                        sdRate:'',
                        showCom:false,
                        gjjData:{},
                        sdData:{},
                        resultMoney:'',
                        sdBase1: 4.34,
                        sdBase2: 4.75,
                        sdBase3: 4.90,
                        gjjBase1: 2.75,
                        gjjBase2: 3.25,
                        firstPoint: Number(vars.loanRatio),
                        secondPoint:'',
                        gjjMax:parseFloat(vars.maxline),
                        secondGjjMax:'',
                        sForbidden:'',
                        gjjPoint:''

                    }
                },
                methods: {
                    preventDef:function(e){
                        e.preventDefault();
                    },
                    unable:function(){
                        var that = this;
                        document.addEventListener('touchmove',that.preventDef)
                    },
                    enable:function(){
                        var that = this;
                        document.removeEventListener('touchmove',that.preventDef)
                    },
                    unableClick: function () {
                        this.clickFlag = false;
                    },
                    enableClick: function () {
                        var that = this;
                        setTimeout(function () {
                            that.clickFlag = true;
                        }, 300);
                    },
                    floatShow1: function () {
                        var that = this;
                        that.floatTit = '净首付';
                        that.floatCon = '房屋成交价格减去银行贷款金额，默认按照最多可贷款金额计算。';
                        that.floatShow = true;
                    },
                    floatShow2: function () {
                        var that = this;
                        that.floatTit = '其他';
                        that.floatCon = '居间服务费，具体数额可咨询房屋经纪人。';
                        that.floatShow = true;
                    },
                    calTop:function(data,change){
                        var that = this;
                        if(String(data).length > 6){
                            dkTotal = Math.round(Number(vars.price) * data / 100);
                        }else{
                            dkTotal = parseInt(Number(vars.price) * data / 100);
                        }
                        if(that.type === 'gjj' && dkTotal >= that.gjjMax){
                            that.clearMoney = parseFloat(Number((Number(vars.ophouse) - parseFloat(that.gjjMax)).toFixed(1)));
                        }else{
                            that.clearMoney = parseFloat(Number((Number(vars.ophouse) - dkTotal).toFixed(1)));
                        }
                        that.planMoney = parseFloat((Number(that.clearMoney) + Number(that.taxPay) + Number(that.otherPay)).toFixed(1));
                        if(change){
                            that.$broadcast('changeTotal',dkTotal);
                            that.autoCalculate('changeTab',dkTotal);
                        }
                    },
                    firstClick:function(){
                        var that = this;
                        that.firstCla = true;
                        that.secondCla = false;
                        that.gjjMax = parseFloat(vars.maxline);
                        if(that.type === 'gjj'){
                            that.calTop(parseFloat(vars.accumulation),true);
                        }else{
                            that.calTop(that.firstPoint,true);
                        }
                        that.$nextTick(function(){
                            that.$broadcast('taxMsg','1');
                        });

                    },
                    secondClick:function(){
                        var that = this;
                        that.firstCla = false;
                        that.secondCla = true;
                        that.gjjMax = that.secondGjjMax;
                        if(that.sForbidden === '禁贷' && (that.type === 'gjj' || that.type === 'both')){
                            alert('该城市二套房购房不支持公积金贷款');
                            $('#selectType').find('li').eq(0).addClass('activeS').siblings().removeClass('activeS');
                            that.selectType({text:'商业贷款'})
                        }
                        if(that.type === 'gjj' && that.sForbidden !== '禁贷'){
                            that.calTop(that.gjjPoint,true);
                        }else{
                            that.calTop(that.secondPoint,true);
                        }
                        that.$nextTick(function(){
                            that.$broadcast('taxMsg','2');
                        });
                    },
                    totalIpt:function(data){
                        var that = this;
                        var dkPoint;
                        if(data.totalMoney || !isNaN(data)){
                            dkPoint = (data.totalMoney || data) / parseFloat(vars.price) * 100;
                        }else if(data.totalMoney === 0){
                            dkPoint = 0;
                        }
                        dkTotal = data.totalMoney || 0;
                        that.calTop(dkPoint);
                    },
                    autoCalculate:function(name,data){
                        var that = this;
                        if(that.type === 'sd'){
                            var sendMsg = name + '1';
                        }else if(that.type === 'gjj'){
                            var sendMsg = name + '2';
                        }else if(that.type === 'both'){
                            var sendMsg = name + '3';
                        }
                        that.$broadcast(sendMsg,data);
                    },
                    fdShow:function(state){
                        var that = this;
                        if(that.type === 'sd'){
                            that.dkShow = state;
                        }else if(that.type === 'gjj'){
                            that.gjjShow = state;
                        }else if(that.type === 'both'){
                            that.comShow = state;
                        }
                    },
                    showFd: function () {
                        var that = this;
                        that.fdShow(true);
                        that.taxShow = false;
                        that.activeFd = true;
                        that.activeTax = false;
                        that.taxResultShow = false;
                        that.$nextTick(function(){
                            that.autoCalculate('select');
                        });
                    },
                    showTax: function () {
                        var that = this;
                        that.fdShow(false);
                        that.taxShow = true;
                        that.activeTax = true;
                        that.activeFd = false;
                        that.resultShow = false;
                        that.$broadcast('taxMsg');

                    },
                    selectType: function (obj) {
                        var that = this;
                        that.$nextTick(function () {
                            if (obj.text === '商业贷款') {
                                that.dkShow = true;
                                that.comShow = false;
                                that.gjjShow = false;
                                that.type = 'sd';
                                that.$broadcast('select1');
                            } else if (obj.text === '公积金贷款') {
                                that.dkShow = false;
                                that.comShow = false;
                                that.gjjShow = true;
                                that.type = 'gjj';
                                that.$broadcast('select2');
                            } else if (obj.text === '组合贷款') {
                                that.comShow = true;
                                that.dkShow = false;
                                that.gjjShow = false;
                                that.type = 'both';
                                that.$broadcast('select3');
                            }
                        });

                        that.typeShow = false;
                    },
                    calculateMsg: function (data) {
                        // 记录本vue that
                        var that = this;
                        // 计算数据
                        data.pageType = 5;
                        var resultData = {};
                        if (that.ajaxFlag) {
                            that.ajaxFlag = false;
                            var ajaxData = {
                                area: data.area,
                                price: data.price,
                                houseYear: data.houseYear,
                                firsthouseIf: data.firsthouseIf,
                                onlyhouseIf: data.onlyhouseIf,
                                housenature: data.housenature,
                                countway: data.countway,
                                type:'esf'
                            };
                            // 增加计算方式和原价
                            if (vars.ophouse) {
                                ajaxData.ophouse = vars.ophouse;
                            }
                            $.getJSON(vars.mainSite + "tools/?a=ajaxesfTaxs&city=" + vars.city, ajaxData, function (data) {
                                if (data) {
                                    that.ajaxFlag = true;
                                    that.taxPay = parseFloat((data.total / 10000).toFixed(1));
                                    that.planMoney = parseFloat((Number(that.clearMoney) + Number(that.taxPay) + Number(that.otherPay)).toFixed(1));
                                    resultData.housePrice = data.house_total;
                                    // 契税
                                    resultData.qTax = parseInt(data.deed);
                                    // 增值税
                                    resultData.yhTax = parseInt(data.saletax);
                                    resultData.individualTax = parseInt(data.individualIncometax);
                                    // 个税
                                    resultData.stamptax = parseInt(data.stamptax);
                                    resultData.costtax = parseInt(data.costtax);
                                    resultData.Syntheticaltax = parseInt(data.Syntheticaltax);
                                    resultData.total = parseInt(data.total);
                                    resultData.pageType = data.pageType;
                                    resultData.autoPieParams = [
                                        {value: parseInt(data.deed), color: '#ffae71'},
                                        {value: Number(data.saletax), color: '#ff7070'},
                                        {value: parseInt(data.stamptax), color: '#68c9bf'},
                                        {value: parseInt(data.individualIncometax), color: '#d17ee3'},
                                        {value: parseInt(data.costtax), color:'#54acde'}
                                    ];
                                    that.$broadcast('getTax', resultData);
                                }
                            }).fail(function () {
                                alert('请检查网络');
                                return;
                            });
                        }

                    },
                    calcuMsg: function (data) {
                        var that = this;
                        var totalMoney = parseFloat(data.totalMoney);
                        var totalInterest = parseFloat(data.toatlInterest);
                        that.Data = data.Data;
                        if(data.Type === 'com'){
                            that.sdData = data.sdData;
                            that.gjjData = data.gjjData;
                            that.gjjRate = (data.gjjData.rate * 100).toFixed(2) + '%';
                            that.sdRate = (data.sdData.rate  * 100).toFixed(2) + '%';
                            that.showCom = true;
                        }else{
                            that.showCom = false;
                        }
                        returnData = data;
                        returnData.dkTotalMoney = data.totalMoney + data.toatlInterest;
                        that.resultMoney = totalMoney / 10000 + '万';
                        that.totalInterest = (totalInterest / 10000).toFixed(2) + '万';
                        that.rate = (data.rate * 100).toFixed(2) + '%';
                        that.monYg = data.firstMonYg;
                        var dataArr = [
                            {color: '#ff7070', value: totalMoney},
                            {color: '#ffae71', value: totalInterest}
                        ];
                        var height = docHeight * 0.54;
                        that.autoPie(dataArr,'#pieCon');
                        if(!that.taxShow){
                            that.resultShow = true;
                            that.showFoot(height);
                        }
                    },
                    showFoot:function(height){
                        setTimeout(function(){
                            $(document).scrollTop(height);
                        },100);
                    },
                    calcuCom:function(type){
                        var that = this;
                        that.sdData.type = type;
                        that.gjjData.type = type;
                        var gjjReTurn = calculate.calculate(that.gjjData);
                        var sdReturn = calculate.calculate(that.sdData);
                        var comData = {};
                        comData.totalMoney = parseInt(gjjReTurn.totalMoney + sdReturn.totalMoney);
                        comData.toatlInterest = parseInt(gjjReTurn.toatlInterest + sdReturn.toatlInterest);
                        var isString = typeof gjjReTurn.monYg === 'number';
                        if(isString){
                            comData.monYg = parseInt(Number(gjjReTurn.monYg) + Number(sdReturn.monYg));
                            comData.moMoney = [];
                        }else{
                            comData.moMoney = parseInt(Number(gjjReTurn.moMoney) + Number(sdReturn.moMoney));
                            comData.monYg = [];
                        }

                        var i = 0;
                        comData.interest = [];
                        comData.leftMoney = [];
                        comData.Type = 'com';
                        comData.firstMonYg = parseInt(Number(gjjReTurn.firstMonYg) + Number(sdReturn.firstMonYg));
                        for(; i < gjjReTurn.interest.length;i++){
                            comData.interest.push(parseInt(Number(gjjReTurn.interest[i]) + Number(sdReturn.interest[i])));
                            comData.leftMoney.push(parseInt(Number(gjjReTurn.leftMoney[i]) + Number(sdReturn.leftMoney[i])));
                            if(isString){
                                comData.moMoney.push(parseInt(Number(gjjReTurn.moMoney[i]) + Number(sdReturn.moMoney[i])));
                            }else{
                                comData.monYg.push(parseInt(Number(gjjReTurn.monYg[i]) + Number(sdReturn.monYg[i])));
                            }

                        }
                        return comData;
                    },
                    autoPie: function (arr, id) {
                        var id = id || '#pieCon';
                        $(id).find('canvas').remove();
                        require.async('chart/pie/1.0.0/pie', function (pie) {
                            var p = new pie({
                                // 容器id
                                id: id || '#pieCon',
                                // 效果类型，暂时只有这一种需要其他类型再扩展
                                animateType: 'increaseTogether',
                                // canvas的高
                                height: width,
                                // canvas的宽
                                width: width,
                                // 半径
                                radius: width,
                                // 分割份数，即增量的速度
                                part: 50,
                                // 空白间隔的大小
                                space: 1,
                                // 是否挖空，如果为0则不挖空，否则为挖空的半径
                                hollowedRadius: width * 0.5,
                                dataArr: (function (arr) {
                                    var isAllZero = 0;
                                    for (var i = 0, len = arr.length; i < len; i++) {
                                        isAllZero += arr[i].value;
                                    }
                                    if (isAllZero == 0) {
                                        for (var i = 0, len = arr.length; i < len; i++) {
                                            if (arr[i].value == 0) {
                                                arr[i].value = 10;
                                            }
                                        }
                                    }
                                    return arr;
                                })(arr, id)
                            });
                            p.run();
                        });
                    },
                    showDetail:function(){
                        var that = this;
                        that.$broadcast('detail',returnData);
                    },
                    tabClick:function(data){
                        var that = this;
                        if(data.type === 'com'){
                            var returnData = that.calcuCom(data.data);
                            returnData.type = data.data;
                        }else{
                            that.Data.type = data.data;
                            var returnData = calculate.calculate(that.Data);
                        }
                        returnData.type = data;
                        that.$broadcast('detail',returnData);

                    }
                },
                ready: function () {
                    var that = this;

                    $('a').on('click', function () {
                        if (!that.clickFlag) {
                            return false;
                        }
                    });
                    var taxlist = JSON.parse(vars.tax);
                    that.taxPay = parseFloat((Number(taxlist.total) / 10000).toFixed(1));
                    that.calTop(that.firstPoint);
                    var $ysList = $('#ysList');
                    $(window).on('touchmove',function(){
                        var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
                        $('.main').css('top','0px');
                        if (scrollTop > 88) {
                            if(!$ysList.hasClass('fixed')){
                                $ysList.addClass('fixed');
                            }
                        } else if(scrollTop <= 88){
                            if($ysList.hasClass('fixed')){
                                $ysList.removeClass('fixed');
                            }

                        }
                    });
                    var that = this;
                    var headHtml = $('.left').html();
                    $('#newheader').on('click','.back',function(){
                        that.detailShow = false;
                        that.show = true;
                        if(that.type === 'sd'){
                            that.dkShow = true;
                        }else if(that.type === 'gjj'){
                            that.gjjShow = true;
                        }else if(that.type === 'both'){
                            that.comShow = true;
                        }
                        $('.cent').text('参考首付明细');
                        $('.left').html(headHtml);
                    });
                    var winHeight = $(window).height() - 110;
                    var focusFlag = true;
                    $(window).on('resize',function(){
                        if(focusFlag){
                            var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
                            if(scrollTop > 80){
                                if($(window).height() < winHeight){
                                    focusFlag = false;
                                    $('.main').css('top','100px');
                                }else{
                                    $('.main').css('top','0px');
                                }
                            }
                        }

                    });

                    $('input').on('blur',function(){
                        focusFlag = true;
                    })
                },
                created:function(){
                    var that = this;
                    $.ajax({
                        url:vars.mainSite +"tools/?c=tools&a=ajaxGetLv",
                        success:function(data){
                            if(data){
                                var rateArr = data.split('|');
                                if(rateArr){
                                    if(rateArr[0]){
                                        var sdArr = rateArr[0].split(',');
                                        that.sdBase1 = Number(sdArr[0]);
                                        that.sdBase2 = Number(sdArr[1]);
                                        that.sdBase3 = Number(sdArr[3]);
                                    }
                                   if(rateArr[1]){
                                       var gjjArr = rateArr[1].split(',');
                                       that.gjjBase1 = Number(gjjArr[0]);
                                       that.gjjBase2 = Number(gjjArr[1]);
                                   }
                                }

                            }
                        }
                    });
                    // 获取二套贷款比例
                    $.ajax({
                        url: vars.mainSite + '/tools/?c=tools&a=ajaxGetHouseLoanInfo&floorYear='+ vars.floorYear +'&isFirstHouse=2&city=' + vars.city,
                        success:function(data){
                            if(data && data.result && data.result === '100'){
                                that.secondPoint = Number(data.commerce);
                                that.secondGjjMax = parseFloat(data.maxline);
                                that.gjjPoint = parseFloat(data.accumulation);
                                if(data.accumulation){
                                    that.sForbidden = data.accumulation;
                                }
                            }
                        }
                    })
                }
            });
            new Vue({
                el: 'body'
            });
            setTimeout(function(){
                if(vars.accumulation === '禁贷'){
                    alert('该房源暂不支持公积金贷款');
                }
            },0);

        }
    });
