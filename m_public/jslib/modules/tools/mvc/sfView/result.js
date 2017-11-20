/**
 * Created by lina on 2017/7/19.
 * 结果页
 */
define('modules/tools/mvc/sfView/result', function (require, exports, module) {
    'use strict';
   // 贷款结果
    var height = $(document).height();
    Vue.component('resultView', {
        template: '<section class="mxBox mBox">'
        + '<dl><dt><div class="cirque" id="pieCon"></div></dt>'
        + '<dd><h3><a href="javascript:void(0);" class="bj-link blue-arr-rt3" @click="showDetail">详情</a>贷款明细</h3>'
        + '<ul><li class="s1"><span>贷款总额：</span><p><strong class="f15">{{totalMoney}}</strong></p></li>'
        + '<li class="s2"><span>支付利息：</span><p>{{totalInterest}}</p></li>'
        + '<li v-show="!isCom"><span>利<i style="margin:0 1em;"></i>率：</span><p>{{rate}}</p></li>'
        + '<div v-show="isCom">'
        + '<li><span>公积金利率：</span><p>{{gjjRate}}</p></li>'
        + '<li><span>商贷利率：</span><p>{{sdRate}}</p></li>'
        + '</div>'
        + '<li><span>参考月供：</span><p>{{monYg}}元/月</p></li>'
        + '</ul></dd></dl><p>计算结果仅供参考，不能作为最终购房依据。</p></section>',
        props:['totalMoney','totalInterest','rate','monYg','isCom','gjjRate','sdRate'],
        methods:{
            showDetail:function(){
                var that = this;
                var type = that.$parent.type;
                that.$parent.detailShow = true;
                that.$parent.show = false;
                if(type === 'sd'){
                    that.$parent.dkShow = false;
                }else if(type === 'gjj'){
                    that.$parent.gjjShow = false;
                }else if(type === 'both'){
                    that.$parent.comShow = false;
                }

                $('.left').html('').html('<a id="wapxfsy_D01_01" class="back" href="javascript:void(0)"><i></i></a>');
                that.$dispatch('show-detail');
            }
        }
    });
    // 税费结果
    Vue.component('taxResult',{
        template: '<section class="mxBox mBox">'
        + '<dl><dt><div class="cirque" id="autoPie"></div></dt>'
        + '<dd><h3>税金明细</h3><ul><li><span>税<i style="margin-right:3em;"></i>费：</span><p>'
        + '<strong class="f15">{{taxPay}}元</strong></p></li>'
        + '<li class="s1"><span>增<i style="margin-right:1em;"></i>值<i style="margin-right:1em;"></i>税：</span><p>{{zzPay}}元</p></li>'
        + '<li class="s2"><span>契<i style="margin-right:3em;"></i>税：</span><p>{{qs}}元</p></li>'
        + '<li class="s3"><span>个人所得税：</span><p>{{personPay}}元</p></li>'
        + '<li class="s4"><span>印<i style="margin-right:1em;"></i>花<i style="margin-right:1em;"></i>税：</span><p>{{yhPay}}元</p></li>'
        + '<li class="s5"><span>工本印花税：</span><p>{{gbPay}}元</p></li>'
        + '</ul></dd></dl><p>计算结果仅供参考，不能作为最终购房依据。</p></section>',
        data:function(){
            return {
                // 税费
                taxPay: '',
                // 增值税
                zzPay: '',
                // 契税
                qs: '',
                // 个人所得税
                personPay: '',
                // 印花税
                yhPay: '',
                // 工本税
                gbPay: ''

            }
        },
        methods:{

        },
        events:{
            getTax:function(data){
                var that = this;
                if(that.$parent.taxShow){
                    // 工本费
                    that.gbPay = data.costtax;
                    // 增值税
                    that.zzPay = data.yhTax;
                    // 印花税
                    that.yhPay = data.individualTax;
                    // 税金总额
                    that.taxPay = data.total;
                    // 个人所得税
                    that.personPay = data.stamptax;
                    // 契税
                    that.qs = data.qTax;
                    that.$parent.autoPie(data.autoPieParams,'#autoPie');
                    that.$parent.taxResultShow = true;
                    that.$parent.showFoot(height * 0.54);
                }
            }
        }
    })

});
