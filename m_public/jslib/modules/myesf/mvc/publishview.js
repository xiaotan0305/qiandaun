/**
 * Created by lina on 2017/3/15.
 * 我的二手房发布页
 */
define('modules/myesf/mvc/publishview', ['modules/myesf/mvc/component','modules/esf/yhxw',
        'slideFilterBox/1.0.0/slideFilterBox','iscroll/2.0.0/iscroll-lite', 'smsLogin/smsLogin'],
    function (require, exports, module) {
        'use strict';
        module.exports = function () {
            var $ = require('jquery');
            var component = require('modules/myesf/mvc/component');
            var scrollCtrl = require('slideFilterBox/1.0.0/slideFilterBox');
            var verifycode = require('smsLogin/smsLogin');
            var iscrollNew = require('iscroll/2.0.0/iscroll-lite');
            var xywt = new iscrollNew('#wtxy',{scrollY: true});
            // 引入用户行为对象
            var yhxw = require('modules/esf/yhxw');
            var vars = seajs.data.vars;
            var userId = vars.userid;
            var newcountEsffabu = 0;
            var $wt = $('#weituoInfo');
            //全部变量，判断是经纪人是不能提交
            var jjrflag = false;
            // 记录用户浏览动作
            yhxw({type: 0, pageId: 'esf_fy^fb_wap', curChannel: 'myesf'});
            // 选择小区search
            require.async('search/myesf/xqSearch', function (xqSearch) {
                var xqSearch = new xqSearch();
                xqSearch.init();
            });
            Vue.component('content', {
                template: '<section class="ddList">'
                + '<dl class="not" >'
                + '<dt>小区名称</dt>'
                + '<dd class="font01 ">'
                + '<div class="dropbox">'
                + '<div class="arr-rt">'
                + '<input readonly="readonly" type="text" id="projnameIpt" v-model="projname" v-on:input="ajaxXq" name="projname" class="ipt-text " placeholder="请输入小区名">'
                + '</div>'
                + '<div class="dropcont" v-show="lianxianglist" id="js_sea">'
                + '<ul id="search_completev1" style="overflow:hidden;">'
                + '<li class="pad10" v-on:click ="setVal($index)" v-for="todo in ajaxData" data_fun={{todo.newcode}}!!{{todo.projname}}!!{{todo.address}}!!{{todo.purpose}}!!{{todo.district}}!!{{todo.comarea}}>{{todo.projname}}</li>'
                + '</ul>'
                + '<p class="red-f0 f12" v-show="selLou">请选择下拉框中的小区</p>'
                + '</div>'
                + '</div>'
                + '<p class="red-f0 f12" v-show="nodata">没有找到对应住宅小区</p>'
                + '</dd>'
                + '</dl>'
                + '<dl v-if="iptLouBtn">'
                + '<dt>楼<i></i>栋<i></i>号</dt><dd v-on:click="iptlou" class="arr-rt font01"><input disabled type="text" class="ipt-text" id="fyPosition" v-model="iptLou" placeholder="请输入楼栋位置" ></dd>'
                + '</dl>'
                + '<div v-show="noloupan" id="noloupan">'
                + '<dl-dd dt-Text="区<em></em>域" :selected="district"></dl-dd>'
                + '<dl-ddc dt-Text="商<em></em>圈" :ajaxcomare-data="ajaxcomareData" :selected="comarea"></dl-ddc>'
                + '</div>'
                + '<dl-input dt-text="户型"  :value="varsHuxing" v-on:click="clickHx" placeholder="请选择户型"></dl-input>'
                + '<dl><dt>建筑面积</dt>'
                + '<dd class="font01">'
                + '<div class="flexbox "><input name="" type="number" v-model="buildArea" class="ipt-text referprice" v-on:input="limitArea" placeholder="请填写建筑面积"><i>平米</i>'
                + '</div></dd></dl>'
                + '<sel-lou :floor-val="floor" :total-val="totalFloor"></sel-lou>'
                + '<forward-list :selected="forward" :color="color" v-model="color"></forward-list>'
                + '<dl><dt>售<em></em>价</dt>'
                + '<dd class="font01">'
                + '<div class="flexbox"><input name="price" type="number" class="ipt-text noinput" v-on:input="iptPrice" v-on:blur="blurPrice" v-model="price"  placeholder="请填写售价">万</div>'
                + '<div class="myprompt" v-show="tipShow">'
                + '<div class="tr01"></div>'
                + '<div class="tr02">您的售价与评估价相差很大，建议修改！</div>'
                + '</div>'
                + '<div class="myprompt" v-show="tjfShow">'
                + '<div class="tr01"></div>'
                + '</div>'
                + '<label id="refPrice" v-if="refprice">{{{refPriceWord}}}</label>'
                + '</dd></dl>'
                + '<dl><dt>姓<em></em>名</dt>'
                + '<dd><input  type="text" class="ipt-text noinput" v-model="name" v-on:input="iptName"  placeholder="请输入姓名"></dd>'
                + '</dl>'
                + '<dl>'
                + '<dt>手<i></i>机<i></i>号</dt>'
                + '<dd>'
                + '<div class="flexbox">'
                + '<input v-if="isUser" name="phone" type="text" class="ipt-text" disabled placeholder="{{userphone}}" />'
                + '<input v-else name="phone" type="tel" class="ipt-text noinput" v-on:input="iptPhone" maxlength="11" v-model="userphone" placeholder="请输入手机号" />'
                + '<a v-if="!codeShow" href="javascript:void(0)" :class="redgrayObj" @click="getCode" class="btn-okN">{{verifyCodeMsg}}</a></div>'
                + '</dd></dl>'
                + '<dl class="nota">'
                + '<span class="mt10" v-show="agentTip"><em class="red-f0 f14">您好，检测到您的账号为经纪人账号，不能在房天下发布个人房源，如有问题请致电</em></span>'
                + '</dl>'
                + '<div v-if="!codeShow" id="ver_code">'
                + '<dl>'
                + '<dt>验<i></i>证<i></i>码：'
                + '</dt>'
                + '<dd>'
                + '<div class="flexbox">'
                + '<input type="number" name="valicode" v-model="checkCode"  placeholder="请输入手机短信验证码" class="ipt-text noinput">'
                + '</div></dd></dl></div></section>'
                + '<div class="submitbox pdX14">'
                + '<P class="wtxytr"><input type="radio" @click="agreed" :checked="isCheck" class="ipt-rd" name="同意" >我已阅读并同意<a href="javascript:void(0)" @click="watchWt">《房屋委托出售协议》</a></P>'
                + '<a href="javascript:void(0)" @click="judgeRep" class="btn-pay">确认发布</a>'
                + '</div>'
                + '<tab-sx :lou-val="dongInfo1" :dy-val="dongInfo2" :mp-val="dongInfo3" v-show="iptLouShow"></tab-sx>'
                + '<drap-list1 v-show="hxsShow" huxing="选择户型" v-on:modify-vals="modifyVals"></drap-list1>'
                + '<drap-list2 v-show="hxtShow" :huxing="varsHuxing" v-on:modify-valt="modifyValt"></drap-list2>'
                + '<drap-list3 v-show="hxwShow" :huxing="varsHuxing" v-on:modify-valw="modifyValw"></drap-list3>'
                + '<float-comlaint v-show="comlaitShow"></float-comlaint>'
                + '<comlaint-suc v-show="comlaitSuc"></comlaint-suc>'
                + '<re-his v-show="hisShow"></re-his>'
                + '<districtdrap-list  v-on:modify-districtval = "modifydistrictvalVal"></districtdrap-list>'
                + '<div id="sendFloat" v-show="msgShow" class="tz-box2"><div id="sendText" class="yzm-sta">{{sendText}}</div></div>'
                + '<rep-house v-show="repShow" :maner-msg="manerMsg"></rep-house>'
                + '<ysrep-house v-show="ysShow" :datas="ysList" :data-len="ysLen"></ysrep-house>',
                data: function () {
                    var districtInfoName = vars.districtInfoName.split(',') || '';
                    var districtInfoId = vars.districtInfoId.split(',') || '';
                    return {
                        // 小区联想列表
                        ajaxData: '',
                        // 小区名字
                        projname: '',
                        // 联想列表
                        lianxianglist: false,
                        // 小区联想提示
                        selLou: false,
                        // 没有联想小区的提示
                        nodata: false,
                        // 区域选择弹框
                        varsDistrict: '请选择区域',
                        districtInfoName: districtInfoName,
                        districtInfoId: districtInfoId,
                        // 商圈选择弹框
                        varsComare: '请选择商圈',
                        // 区域商圈显示
                        noloupan: false,
                        // 区域
                        district: districtInfoName[0] || '',
                        // 商圈
                        comarea: districtInfoName[0] || '',
                        // 商圈数据
                        ajaxcomareData: [],
                        // 手动输入弹窗
                        iptLouShow: false,
                        // 户型室选择弹框
                        hxsShow: false,
                        // 户型卫选择弹框
                        hxwShow: false,
                        // 户型厅选择弹框
                        hxtShow: false,
                        // 提示弹框
                        msgShow: false,
                        // 提示信息
                        sendText: '',
                        // 楼栋位置
                        iptLou: '',
                        // 户型标题
                        varsHuxing: '',
                        // 楼层
                        floor: '',
                        // 总楼层
                        totalFloor: '',
                        // 房天下评估价
                        ajaxprice: '',
                        // 业主姓名
                        name: '',
                        // 业主手机号
                        phone: vars.phone || '',
                        checkCode: '',
                        // 历史记录弹框
                        hisShow: false,
                        // 小区id
                        projcode: '',
                        // 参考价
                        refprice: '',
                        // 建筑面积,默认为1
                        buildArea: '',
                        // 朝向
                        forward: '请选择朝向',
                        // 朝向颜色
                        color: 'color:#b3b6be',
                        // 联系人手机号
                        userphone: vars.userphone,
                        // 发布房源数量
                        codeShow: vars.userphone,
                        // 验证码发送按钮
                        verifyCodeMsg: '发送验证码',
                        // 是否可点击样式
                        redgrayObj: {'btn-oka': false},
                        // 楼栋号
                        dongInfo1: '',
                        // 门牌号
                        dongInfo2: '',
                        // 室号
                        dongInfo3: '',
                        // 楼栋号点击按钮
                        iptLouBtn: vars.buildNum === '1',
                        // 售价
                        price: '',
                        // 户型室
                        room: '',
                        // 户型卫
                        hall: '',
                        // 户型厅
                        toilet: '',
                        isCheck: false,
                        agentTip: false,
                        // 申诉弹框
                        comlaitShow: false,
                        // 申诉成功弹窗
                        comlaitSuc: false,
                        // 评估价差距大提示
                        tipShow: false,
                        // 重复房源弹窗
                        repShow: false,
                        // 疑似重复房源弹窗
                        ysShow: false,
                        // 管理按钮信息
                        manerMsg: '去管理',
                        // 房源id
                        houseid: '',
                        // 是否删除房源记录
                        ownerDelect: '',
                        // 房源状态
                        houseStatus: '',
                        // 疑似房源信息
                        ysList : '',
                        // 疑似房源条数
                        ysLen:true,
                        // 是否登录
                        isUser: vars.userphone,
                        // 是否恢复成功标志
                        refFlag: true,
                        // 修改房源状态标志
                        delFlag: true,
                        // 重复房源indexId
                        indexId: '',
                        // 防止穿透点击
                        canclick: true,
                        // ajax请求标志
                        ajaxFlag: true,
                        // 小区均价
                        danjia: '',
                        // 能否发布小区
                        isXqfb:true,
                        // 能否输入限制
                        iptFlag:true,
                        // 房天下评估价提示文案
                        refPriceWord: ''
                    };
                },
                methods: {
                
                    preventDef: function (e) {
                        e.preventDefault();
                    },
                    // 阻止页面滚动
                    unable: function () {
                        var that = this;
                        document.addEventListener('touchmove', that.preventDef);
                    },
                    // 允许页面滚动
                    enable: function () {
                        var that = this;
                        document.removeEventListener('touchmove', that.preventDef);
                    },
                    enClick: function () {
                        var that = this;
                        setTimeout(function () {
                            that.canclick = true;
                            $('.noinput').attr('disabled',false);
                        },300);
                    },
                    // 提示信息函数
                    displayLose: function (msg,unable) {
                        var that = this;
                        var $msg = $('.tz-box2');
                        $msg.fadeIn();
                        that.sendText = msg;
                        that.unable();
                        setTimeout(function () {
                            $msg.fadeOut();
                            if(!unable){
                                that.enable();
                            }
                        }, 2000);
                    },
                    // 存储历史记录信息
                    setHis: function (name, info) {
                        if (userId) {
                            vars.localStorage.setItem(userId + name + vars.city, info);
                        } else {
                            vars.localStorage.setItem('myesfHis' + name + vars.city, info);
                        }

                    },
                    // 移除历史记录
                    removeHis: function (name, info) {
                        if (userId) {
                            vars.localStorage.removeItem(userId + name + vars.city, info);
                        } else {
                            vars.localStorage.removeItem('myesfHis' + name + vars.city, info);
                        }
                    },

                    // 评估小区价格
                    ajaxPg: function () {
                        var param = {};
                        var that = this;
                        param.bulidArea = 1;
                        param.newcode = that.projcode;
                        $.ajax({
                            url: vars.mySite + '?c=myesf&a=ajaxgetplpgInfo&city=' + vars.city,
                            data: param,
                            success: function (data) {
                                that.lianxianglist = false;
                                // 参考价
                                if (data && data.HouseInfo && data.HouseInfo[0] && data.HouseInfo[0].AvagePrice) {
                                    that.danjia = parseFloat(data.HouseInfo[0].AvagePrice / 10000).toFixed(2);
                                    // 只有当单价和面积同时存在时，才展示评估价
                                    if(that.buildArea){
                                        that.refprice = parseFloat((that.danjia * that.buildArea).toFixed(2));
                                        that.refPriceWord = '房天下评估价：<em>' + that.refprice + '</em> 万/套，仅供参考';
                                    }else{
                                        that.refprice = 0;
                                    }
                                }
                                if (that.refprice === 0) {
                                    that.refprice = '暂无';
                                    that.refPriceWord = '房天下评估价：暂无';
                                }
                                if (that.price && that.refprice && that.refprice !== '暂无' && (that.price >= that.refprice * 1.3 || that.price <= that.refprice * 0.7)) {
                                    that.tipShow = true;
                                } else {
                                    that.tipShow = false;
                                }
                            },
                            // 失败后重新发送请求
                            error: function () {
                                that.ajaxPg();
                            }

                        });
                    },

                    // 点击楼栋位置
                    iptlou: function () {
                        var that = this;
                        if (!that.projname) {
                            that.displayLose('请重新选择小区');
                            return false;
                        } else if (that.projname && that.lianxianglist) {
                            that.displayLose('请选择下拉框中的小区');
                            return false;
                        } else if (that.projname && that.nodata) {
                            that.displayLose('请输入小区名称');
                            return false;
                        }
                        that.unable();
                        that.iptLouShow = true;
                        if(that.iptLou){
                            if(that.iptLou.split('-')[0]){
                                that.dongInfo1 = that.iptLou.split('-')[0];
                            }
                            if(that.iptLou.split('-')[1]){
                                that.dongInfo2 = that.iptLou.split('-')[1];
                            }
                            if(that.iptLou.split('-')[2]){
                                that.dongInfo3 = that.iptLou.split('-')[2];
                            }
                        }
                    },
                    // 点击户型
                    clickHx: function () {
                        var that = this;
                        that.hxsShow = true;
                        that.unable();
                        this.$nextTick(function () {
                            scrollCtrl.refresh('#huxingShiDrapCon');
                        });
                    },
                    // 选择户型室
                    modifyVals: function (obj) {
                        var that = this;
                        that.canclick = false;
                        that.hxsShow = false;
                        that.varsHuxing = obj.text;
                        that.room = obj.text;
                        that.hall = '';
                        that.toilet = '';
                        that.hxtShow = true;
                        that.$nextTick(function () {
                            scrollCtrl.refresh('#huxingTingDrapCon');
                        });
                        that.setHis('varsHuxing', that.varsHuxing);
                        that.setHis('room', that.room);
                        that.removeHis('hall',that.hall);
                        that.removeHis('toilet',that.toilet);
                        that.enClick();
                    },
                    // 选择户型厅
                    modifyValt: function (obj) {
                        var that = this;
                        that.canclick = false;
                        that.hxtShow = false;
                        that.varsHuxing += obj.text;
                        that.hall = obj.text;
                        that.hxwShow = true;
                        that.$nextTick(function () {
                            scrollCtrl.refresh('#huxingWeiDrapCon');
                        });
                        that.setHis('varsHuxing', that.varsHuxing);
                        that.setHis('hall', that.hall);
                        that.enClick();
                    },
                    // 选择户型卫
                    modifyValw: function (obj) {
                        var that = this;
                        $('.noinput').attr('disabled',true);
                        that.canclick = false;
                        that.hxwShow = false;
                        that.toilet = obj.text;
                        that.varsHuxing += obj.text;
                        that.setHis('varsHuxing', that.varsHuxing);
                        that.setHis('toilet', that.toilet);
                        that.enClick();
                        that.enable();
                    },
                    // 面积，价格输入限制函数
                    limit: function (reg1,reg2,msg,e) {
                        var that = this;
                        var value = e.target.value;
                        if(value === '') {
                            return false;
                        }
                        if (value.indexOf('.') === -1) {
                            if (!reg1.test(value)) {
                                e.target.value = value.substring(0, value.length - 1);
                                that.buildArea = e.target.value;
                                that.displayLose(msg);
                            }
                        } else if (!reg2.test(value)) {
                            e.target.value = value.substring(0, value.length - 1);
                            that.buildArea = e.target.value;
                        }
                    },
                    // 建筑面积输入限制
                    limitArea: function (ev) {
                        var that = this;
                        var reg1 = /^[1-9]\d{0,3}$/;
                        var reg2 = /^[1-9]\d{0,3}\.\d{0,2}$/;
                        var e = ev;
                        that.limit(reg1,reg2,'建筑面积要大于2平方米小于10000平方米',e);
                        // 参考价评估
                        if(!that.buildArea){
                            // 有小区名称时，才显示房天下评估价
                            if (that.projname) {
                                that.refprice = '暂无';
                                that.refPriceWord = '房天下评估价：暂无';
                            }
                            that.removeHis('buildArea');
                            return false;
                        }
                        if(that.danjia && that.buildArea){
                            that.refprice = parseFloat(that.danjia * that.buildArea).toFixed(2);
                            if (that.refprice === 0) {
                                that.refprice = '暂无';
                                that.refPriceWord = '房天下评估价：暂无';
                            } else {
                                that.refPriceWord = '房天下评估价：<em>' + that.refprice + '</em> 万/套，仅供参考';
                            }
                            if (that.price && that.refprice && that.refprice !== '暂无' && (that.price >= that.refprice * 1.3 || that.price <= that.refprice * 0.7)) {
                                that.tipShow = true;
                            } else {
                                that.tipShow = false;
                            }
                        }else{
                            that.ajaxPg();
                        }
                        that.setHis('buildArea',that.buildArea);
                    },
                    // 售价输入
                    iptPrice: function (ev) {
                        var that = this;
                        if (that.price && that.refprice && that.refprice !== '暂无' && (that.price >= that.refprice * 1.3 || that.price <= that.refprice * 0.7)) {
                            that.tipShow = true;
                        } else {
                            that.tipShow = false;
                        }
                        // 输入限制与提示
                        var reg1,reg2,msg;
                        var e = ev;
                        if(vars.city === 'bj'){
                            reg1 = /^[1-9]\d{0,3}$/;
                            reg2 = /^[1-9]\d{0,3}\.\d{0,2}$/;
                            msg = '售价要大于两万元小于1亿元';
                        }else{
                            reg1 = /^[1-9]\d{0,4}$/;
                            reg2 = /^[1-9]\d{0,4}\.\d{0,2}$/;
                            msg = '售价要大于两万元小于10亿元';
                        }
                        that.limit(reg1,reg2,msg,e);
                        that.setHis('price', that.price);
                    },
                    blurPrice: function (ev) {
                        var that = this;
                        var reg1,reg2,msg;
                        var e = ev;
                        if(vars.city === 'bj') {
                            reg1 = /^[1-9]\d{0,4}$/;
                            reg2 = /^[1-9]\d{0,4}\.\d{0,2}$/;
                            msg = '售价要大于两万元小于1亿元';
                        }else{
                            reg1 = /^[1-9]\d{0,5}$/;
                            reg2 = /^[1-9]\d{0,5}\.\d{0,2}$/;
                            msg = '售价要大于两万元小于10亿元';
                        }
                        that.limit(reg1,reg2,msg,e);
                    },
                    // 姓名输入
                    iptName: function () {
                        var that = this;
                        // 姓名为空时，不存储localstorage
                        if (that.name !== '') {
                            that.setHis('name', that.name);
                        } else {
                            that.removeHis('name');
                        }
                    },
                    // 手机号输入
                    iptPhone: function () {
                        var that = this;
                        that.setHis('userphone', that.userphone);
                    },
                    // 验证码倒计时函数
                    countDown: function () {
                        var that = this;
                        var timeCount = 60;
                        // 发送验证码按钮置为灰色
                        that.redgrayObj['btn-oka'] = true;
                        that.isDisabled = true;
                        // 60s倒计时
                        var timer1 = setInterval(function () {
                            timeCount--;
                            that.verifyCodeMsg = timeCount + ' s';
                            if (timeCount === -1) {
                                // 清除定时器
                                clearInterval(timer1);
                                // 倒计时结束的时候把发送验证码的文本修改为重新获取
                                that.verifyCodeMsg = '重新获取';
                                // 将发送验证码按钮设置为红色可点击状态
                                that.redgrayObj['btn-oka'] = false;
                                that.isDisabled = false;
                                timeCount = 60;
                            }
                        }, 1000);
                    },
                    // 点击发送验证码
                    getCode: function () {
                        var that = this;
                        // 正在发送验证码
                        if(that.redgrayObj['btn-oka']){
                            return false;
                        }
                        if (that.userphone === '') {
                            that.displayLose('请输入手机号');
                            return false;
                        }
                        if (that.userphone !== vars.userphone) {
                            verifycode.send(that.userphone, function () {
                                that.countDown();
                            }, function (err) {
                                that.displayLose(err);
                            });
                        }
                    },
                    // 验证码验证失败的函数
                    VerifyError: function () {
                        this.displayLose('短信验证码验证失败,请尝试重新发送！');
                    },
                    // 点击协议按钮
                    agreed: function () {
                        var that = this;
                        if(that.isCheck) {
                            that.isCheck = '';
                        }else{
                            that.isCheck = 'check';
                        }
                        that.setHis('isCheck',that.isCheck);
                    },
                    // 点击房屋委托出售协议
                    watchWt: function () {
                        if(!this.canclick) {
                            return false;
                        }
                        $wt.show();
                        this.unable();
                        this.$nextTick(function () {
                            xywt.refresh();
                        });
                    },
                    // 验证函数
                    check: function () {
                        var that = this;

                        if (that.projname === '' || that.projname && that.nodata) {
                            that.displayLose('请输入小区名称');
                            return false;
                        } else if (that.projname && that.lianxianglist) {
                            that.displayLose('请选择下拉框中的小区');
                            return false;
                        } else if(!that.isXqfb){
                            that.displayLose('该楼盘不符合房产市场交易流程，暂无法发布房源');
                            return false;
                        } else if (that.iptLouBtn && that.iptLou.split('-')[0] === '') {
                            that.displayLose('楼栋号不能为空');
                            return false;
                        } else if (that.iptLouBtn && that.iptLou.split('-')[1] === '') {
                            that.displayLose('单元号不能为空');
                            return false;
                        } else if (that.iptLouBtn && that.iptLou.split('-')[2] === '') {
                            that.displayLose('门牌号不能为空');
                            return false;
                        } else if (that.room === '') {
                            that.displayLose('户型室不能为空');
                            return false;
                        } else if (that.hall === '') {
                            that.displayLose('户型厅不能为空');
                            return false;
                        } else if (that.toilet === '') {
                            that.displayLose('户型卫不能为空');
                            return false;
                        } else if (that.buildArea === '') {
                            that.displayLose('请输入面积');
                            return false;
                        } else if (that.floor === '') {
                            that.displayLose('层数不能为空');
                            return false;
                        } else if (that.totalFloor === '') {
                            that.displayLose('总层数不能为空');
                            return false;
                        } else if (parseInt(that.floor) > parseInt(that.totalFloor)) {
                            that.displayLose('楼层不能大于总楼层');
                            return false;
                        } else if (that.price === '') {
                            that.displayLose('请输入价格');
                            return false;
                        } else if (!/^\d{0,8}\.{0,1}(\d{1,2})?$/i.test(that.price)) {
                            that.displayLose('请输入正确的价格');
                            return false;
                        } else if (parseInt(that.buildArea) > 10000 || parseInt(that.buildArea) < 2) {
                            that.displayLose('面积要大于2平方米小于10000平方米');
                            return false;
                        } else if (vars.city !== 'bj' && parseInt(that.price) > 100000 || parseInt(that.price) < 2) {
                            that.displayLose('售价要大于2万元小于10亿元');
                            return false;
                        } else if (vars.city === 'bj' && parseInt(that.price) > 10000 || parseInt(that.price) < 2) {
                            that.displayLose('售价要大于2万元小于1亿元');
                            return false;
                        } else if (parseFloat(that.price) / parseFloat(that.buildArea) > 15 && vars.city === 'bj') {
                            that.displayLose('单价要小于15万元/平米');
                            return false;
                        } else if (that.userphone === '') {
                            that.displayLose('请输入手机号');
                            return false;
                        } else if (!/^(1)\d{10}$/i.test(that.userphone)) {
                            that.displayLose('请输入正确格式的手机号');
                            return false;
                        } else if (that.checkCode === '' && !vars.userphone) {
                            that.displayLose('请输入验证码');
                            return false;
                        } else if (that.name === '') {
                            that.displayLose('姓名不能为空');
                            return false;
                        }else if(!that.isCheck){
                            that.displayLose('请同意房屋委托出售协议');
                            return false;
                        }else{
                            return true;
                        }
                    },
                    // 点击我要申诉
                    askSs: function () {
                        this.comlaitShow = true;
                    },
                    // 调取恢复接口函数
                    recoveryHouse: function (houseID) {
                        var that = this;
                        $.ajax({
                            url: vars.mySite + '?c=myesf&a=ajaxRestoreHouse&houseID=' + houseID,
                            method: 'GET',
                            async:false,
                            success : function (data) {
                                if (data.result !== '1') {
                                    that.displayLose(data.message);
                                    that.refFlag = false;
                                }
                            }
                        });
                    },
                    // 更改房源状态
                    pauseSaleDS: function (houseid, targetStatus) {
                        var that = this;
                        // targetStatus表示房源状态：在售1 停售2
                        var url = vars.mySite + 'index.php?c=myesf&a=cancleOrResaleDS&city=' + vars.city + '&houseid=' + houseid + '&targetStatus='
                            + targetStatus;
                        $.ajax({
                            url: url,
                            type: 'GET',
                            async: false,
                            success: function (data) {
                                if (data) {
                                    if (data.result !== '1') {
                                        that.displayLose(data.message);
                                        that.delFlag = false;
                                    }
                                } else {
                                    that.displayLose('更改状态失败，请稍后再试');
                                    that.delFlag = false;
                                }
                            }
                        });
                    },
                    // 验证房源是不是在展示状态
                    jumpAjax: function (indexID,houseID,jumpUrl) {
                        var that = this;
                        var url = vars.mySite + '?c=mycenter&a=getWTDetailByID&city=' + vars.city + '&indexId=' + indexID + '&houseid=' + houseID + '&isJson=1&isdel=1';
                        $.ajax({
                            url: url,
                            type: 'GET',
                            success: function (data) {
                                if(data && data.result && data.result === '1') {
                                    // 等于1表示没有展示，跳
                                    if(data.IsUnDelegateSaleHouse === '1') {
                                        window.location.href = vars.mySite + '?c=mycenter&a=getWTDetailByID&city=bj&indexId' + indexID + '&houseid=' + houseID;
                                    }else if(data.IsUnDelegateSaleHouse === '0') {
                                        window.location.href = jumpUrl;
                                    }
                                }else{
                                    that.displayLose('接口超时，请重试');
                                }
                            },
                            error: function () {
                                that.jumpAjax(indexID,houseID);
                            }
                        });
                    },

                    /**
                     * 发布提交函数
                     * @param param 要提交的数据
                     */
                    subFun: function (param) {
                        var that = this;
                        $.ajax({
                            url: vars.mySite + '?c=myesf&a=addDelegateAndResale',
                            type: 'POST',
                            data: param,
                            success: function (data) {
                                // 如果验证为经纪人
                                if (data.checkAgent) {
                                    if (data.checkAgent === '1') {
                                        that.agentTip = true;
                                        $('.btn-pay').addClass('noClick');
                                        return false;
                                    } else {
                                        that.agentTip = false;
                                        return false;
                                    }
                                }
                                if (data.userlogin) {
                                    if (data.fabuInfo.result === '1') {
                                        that.displayLose('发布成功！');
                                        var userId = vars.userid;
                                        if (userId) {
                                            for (var key in that) {
                                                if (vars.localStorage.getItem(userId + key + vars.city)) {
                                                    vars.localStorage.removeItem(userId + key + vars.city);
                                                }
                                            }
                                        } else {
                                            for (var key in that) {
                                                if (vars.localStorage.getItem('myesfHis' + key + vars.city)) {
                                                    vars.localStorage.removeItem('myesfHis' + key + vars.city);
                                                }
                                            }
                                        }
                                        // 保存新发布状态信息到本地
                                        vars.localStorage.setItem('newcountEsffabu', newcountEsffabu + 1);
                                        var href = '/my/?c=myesf&a=successfabu&city=' + vars.city;
                                        if (data.fabuInfo.indexId) {
                                            href += '&indexId=' + data.fabuInfo.indexId;
                                        }
                                        window.location = href;
                                    } else {
                                        if(data.fabuInfo.message) {
                                            that.displayLose(data.fabuInfo.message);
                                        } else {
                                            that.displayLose(data.fabuInfo);
                                        }
                                    }
                                } else {
                                    that.displayLose('请输入正确的验证码');
                                }
                            }
                        });
                    },
                    // 判定是否是重复房源
                    judgeRep: function () {
                        var param = {};
                        var that = this;
                        if(!that.canclick) {
                            return false;
                        }
                        that.check();
                        // 验证不成功或者是经纪人账号，禁止提交
                        if(!that.check() || $('.btn-pay').hasClass('noClick')) {
                            return false;
                        }
                        // 手机号
                        param.telephone = that.userphone;
                        // 小区名字
                        param.projName = that.projname;
                        if(that.iptLouBtn){
                            // 楼栋号
                            param.buildingNumber = that.iptLou.split('-')[0];
                            // 单元号
                            param.unitNumber = that.iptLou.split('-')[1];
                            // 门牌号
                            param.houseNumber = that.iptLou.split('-')[2];
                        }
                        // 室
                        param.room = parseInt(that.room);
                        // 厅
                        param.hall = parseInt(that.hall);
                        $.ajax({
                            url: vars.mySite + '?c=myesf&a=ajaxIsRepeat',
                            data: param,
                            type: 'GET',
                            success: function  (data) {
                                // 获取成功
                                if(data.result === '1') {
                                    // 如果为重复房源
                                    if (data.HouseRepeatType === '1') {
                                        that.repShow = true;
                                        that.unable();
                                        // 判断房源是否在售
                                        // 暂不出售
                                        if (data.RepeatHouseInfo[0].HouseStatus === '2') {
                                            // 修改管理房源字段
                                            // 是否删除房源记录
                                        }
                                        that.ownerDelect = data.RepeatHouseInfo[0].OwnerIsDelete;
                                        that.houseid = data.RepeatHouseInfo[0].HouseID;
                                        that.indexId = data.RepeatHouseInfo[0].ID;
                                        that.houseStatus = data.RepeatHouseInfo[0].HouseStatus;
                                    }else if(data.HouseRepeatType === '2') {
                                        that.ysList = data.RepeatHouseInfo;
                                        if(that.ysList.length === 1){
                                            that.ysLen = false;
                                        }else{
                                            that.ysLen = true;
                                        }
                                        that.ysShow = true;
                                        that.$nextTick(function () {
                                            new iscrollNew('#ysfy', {
                                                scrollY: true,
                                                preventDefault: false,
                                                click:true,
                                                preventDefaultException: { tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|A)$/ }
                                            });
                                        });
                                        that.unable();
                                    }else{
                                        that.submit();
                                    }
                                }else if(data && data.message) {
                                    that.displayLose(data.message);
                                }
                            }
                        });
                    },
                    // 提交函数
                    submit: function () {
                        var that = this;
                        var param = {};
                        // 城市
                        param.city = vars.city;
                        // 楼层
                        param.floor = that.floor;
                        // 总楼层
                        param.totalfloor = that.totalFloor;
                        // 户型
                        param.room = parseInt(that.room);
                        // 厅
                        param.hall = parseInt(that.hall);
                        // 卫
                        param.toilet = parseInt(that.toilet);
                        // 朝向
                        param.forward = that.forward;
                        // 联系人
                        param.linkman = that.name;
                        // 北京有楼栋位置
                        if (that.iptLouBtn) {
                            param.block = that.dongInfo1;
                            param.UnitNumber = that.dongInfo2;
                            param.RoomNumber = that.dongInfo3;
                        }
                        param.delegateId = vars.delegateId;
                        param.source = vars.source;
                        param.IsLoan = 0;
                        // 售价
                        param.price = that.price;
                        // 建筑面积
                        param.area = that.buildArea;
                        // 区域
                        param.district = that.district;
                        // 商圈
                        param.comarea = that.comarea;
                        // 小区名字
                        param.projName = that.projname;
                        // 小区id
                        param.newcode = that.projcode;
                        // 联系电话
                        param.telephone = that.userphone;
                        // 统计提交动作
                        yhxw({type: 46, pageId: 'mesfrelease', curChannel: 'myesf', params: param});
                        if (that.userphone !== vars.userphone || !vars.userphone) {
                            if (!that.checkCode) {
                                that.displayLose('请输入正确的短信验证码');
                                return false;
                            }
                            verifycode.check(that.userphone, that.checkCode, function () {
                                //检验是否经纪人账号，需要申诉
                                $.ajax({
                                    url: vars.mySite + '?c=mycenter&a=checkJjr&source=ajax',
                                    async: false,
                                    success: function (data) {
                                        if (data === '2') {
                                            $('#zizhuShensu').show();
                                            that.unable();
                                            jjrflag = true;
                                        } else if (data === '3') {
                                            $('#jjrzh').show();
                                            that.unable();
                                            jjrflag = true;
                                        }
                                    }
                                });
                                if (!jjrflag) {
                                    that.subFun(param);
                                }
                            }, that.VerifyError, vars.userphone);
                        } else {
                            // 提交
                            that.subFun(param);
                        }
                    }

                },
                ready: function () {
                    var that = this;
                    // vue外部js给内部属性赋值
                    setTimeout(function () {
                        vars.vue.$on('setVueValue', function (obj) {
                            for (var key in obj) {
                                that[key] = obj[key];
                            }
                        }.bind(this));
                    },500);

                    // vue外部js调用内部方法
                    setTimeout(function () {
                        vars.vue.$on('callMethod', function (act, par1, par2, par3, par4) {
                            //that.setHis('projcode', that.projcode);
                            that[act](par1, par2, par3, par4);
                        }.bind(this));
                    },500);
                    // 恢复历史记录
                    var docH = parseInt($('body').height()) * 1.2;
                    $('.tz-box2').height(docH + 'px');
                    $('.yzm-sta').css('top',parseInt(docH) * 0.35 + 'px');
                    // 没登录和登录的时候取不同的历史信息
                    if (userId) {
                        for (var key in that) {
                            if (vars.localStorage.getItem(userId + key + vars.city)) {
                                that.hisShow = true;
                            }
                        }
                    } else {
                        for (var key in that) {
                            if (vars.localStorage.getItem('myesfHis' + key + vars.city)) {
                                that.hisShow = true;
                            }
                        }
                    }
                    // 点击我已阅读
                    $('.btn01').on('click',function () {
                        $wt.hide();
                        that.enable();
                    });
                    $(document).on('click','.yeBtn',function () {
                        var $ele = $(this);
                        if($ele.attr('checked')){
                            $ele.attr('checked',false);
                        }else{
                            $ele.attr('checked',true);
                        }
                        $ele.parents('.ysObj').siblings().find('input').attr('checked',false);

                    });
                    //检验是否经纪人账号，需要申诉
                    if (vars.userid && vars.userphone) {
                        var url = vars.mySite + '?c=mycenter&a=checkJjr&source=ajax';
                        $.ajax({
                            url: url,
                            success: function (data) {
                                if (data === '2') {
                                    $('#zizhuShensu').show();
                                    that.unable();
                                } else if (data === '3') {
                                    $('#jjrzh').show();
                                    that.unable();
                                }
                            }
                        });
                    }
                }
            });
            vars.vue = new Vue({
                el: 'body'
            });
        };
    });