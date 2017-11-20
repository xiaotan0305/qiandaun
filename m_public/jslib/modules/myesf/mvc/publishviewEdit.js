/**
 * Created by lina on 2017/3/24.
 * 我的二手房编辑页
 */
define('modules/myesf/mvc/publishviewEdit', ['jquery', 'modules/myesf/mvc/component', 'modules/esf/yhxw', 'slideFilterBox/1.0.0/slideFilterBox', 'smsLogin/smsLogin'],
    function (require, exports, module) {
        'use strict';
        module.exports = function () {
            require('modules/myesf/mvc/component');
            var scrollCtrl = require('slideFilterBox/1.0.0/slideFilterBox');
            var vars = seajs.data.vars;
            var $ = require('jquery');
            var editDelegateCount = 0;
            var yhxw = require('modules/esf/yhxw');
            var pageId = 'muchelpsellrevise';
            // 统计用户浏览行为
            yhxw({type: 0, pageId: pageId, curChannel: 'myesf'});
            Vue.component('content', {
                template: '<section class="ddList mBox">'
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
                + '<div class="tr02">若售价低于评估价，即有机会成为特价房，获得更多展示机会，助您快速成交！</div>'
                + '</div>'
                + '<label id="refPrice" v-if="refprice">房天下评估价:<em id="priceUnit">{{refprice}}</em>万元</label>'
                + '</dd></dl>'
                + '<dl><dt>业主姓名</dt>'
                + '<dd><input  type="text" class="ipt-text noinput" v-model="name" v-on:input="iptName"  placeholder="请输入姓名"></dd>'
                + '</dl>'
                + '<dl>'
                + '<div class="pdX14 pdYb20">'
                + '<a href="javascript:void(0)" @click="submit" class="btn-pay" style="touch-action: none">确定</a>'
                + '</div>'
                + '</section>'
                + '<drap-list1 v-show="hxsShow" huxing="选择户型" v-on:modify-vals="modifyVals"></drap-list1>'
                + '<drap-list2 v-show="hxtShow" :huxing="varsHuxing" v-on:modify-valt="modifyValt"></drap-list2>'
                + '<drap-list3 v-show="hxwShow" :huxing="varsHuxing" v-on:modify-valw="modifyValw"></drap-list3>'
                + '<div id="sendFloat" v-show="msgShow" class="tz-box2" style="display:block;"><div id="sendText" class="yzm-sta">{{sendText}}</div></div>'
                + '<no-save v-show="nosaveShow"></no-save>',
                data: function () {
                    return {
                        // 户型
                        varsHuxing: vars.room + '室-' + vars.hall + '厅-' + vars.toilet + '卫' || '',
                        room: vars.room || '',
                        hall: vars.hall || '',
                        toilet: vars.toilet || '',
                        // 建筑面积
                        buildArea: vars.area || '',
                        // 楼层
                        floor: vars.floor || '',
                        // 总楼层
                        totalFloor: vars.totalFloor || '',
                        // 朝向
                        forward: vars.forward || '',
                        // 朝向颜色
                        color: vars.forward === '请选择朝向' ? 'color:#b3b6be' : 'color: rgb(86, 92, 103)',
                        // 售价
                        price: vars.price || '',
                        // 联系人
                        name: vars.name || '',
                        // 参考价
                        refprice: '',
                        hxsShow: false,
                        hxtShow: false,
                        hxwShow: false,
                        msgShow: false,
                        sendText: false,
                        tipShow: false,
                        tjfShow: false,
                        // 编辑未保存弹框
                        nosaveShow: false,
                        // 防止点击穿透
                        canclick: true
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
                    displayLose: function (msg) {
                        var that = this;
                        var $msg = $('.tz-box2');
                        $msg.fadeIn();
                        that.sendText = msg;
                        that.unable();
                        setTimeout(function () {
                            $msg.fadeOut();
                            that.enable();
                        }, 2000);
                    },
                    // 点击户型
                    clickHx: function () {
                        var that = this;
                        that.hxsShow = true;
                        that.unable();
                        that.$nextTick(function () {
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
                        that.enClick();
                    },
                    // 选择户型厅
                    modifyValt: function (obj) {
                        var that = this;
                        that.hxtShow = false;
                        that.canclick = false;
                        that.varsHuxing += obj.text;
                        that.hall = obj.text;
                        that.hxwShow = true;
                        that.$nextTick(function () {
                            scrollCtrl.refresh('#huxingWeiDrapCon');
                        });
                        that.enClick();
                    },
                    // 选择户型卫
                    modifyValw: function (obj) {
                        var that = this;
                        $('.noinput').attr('disabled',true);
                        that.canclick = false;
                        that.toilet = obj.text;
                        that.varsHuxing += obj.text;
                        that.enClick();
                        that.enable();
                        that.hxwShow = false;
                    },
                    // 评估小区价格
                    ajaxPg: function () {
                        var param = {};
                        var that = this;
                        param.newcode = vars.newcode;
                        if (that.buildArea) {
                            param.bulidArea = that.buildArea;
                        } else {
                            param.bulidArea = 1;
                        }
                        $.ajax({
                            url: vars.mySite + '?c=myesf&a=ajaxgetplpgInfo&city=' + vars.city,
                            data: param,
                            success: function (data) {
                                that.lianxianglist = false;
                                // 参考价
                                if (data && data.HouseInfo && data.HouseInfo[0] && data.HouseInfo[0].AvagePrice) {
                                    that.refprice = parseFloat(data.HouseInfo[0].AvagePrice);
                                    that.refprice = parseFloat((that.refprice / 10000 * param.bulidArea).toFixed(2));
                                }
                                if (that.refprice === 0) {
                                    that.refprice = '';
                                }
                                if (that.refprice === '') {
                                    return false;
                                }
                                if (that.price && (that.price >= that.refprice * 1.3 || that.price <= that.refprice * 0.7)) {
                                    if (vars.xytype === '1') {
                                        that.tjfShow = false;
                                    }
                                    that.tipShow = true;
                                } else {
                                    // 评估价不为0显示默认tips
                                    if (that.refprice > 0 && vars.xytype === '1') {
                                        // 展示特价房提示
                                        that.tjfShow = true;
                                    }
                                    that.tipShow = false;
                                }
                            }

                        });
                    },
                    // 面积，价格输入限制函数
                    limit: function (reg1, reg2, msg, e) {
                        var that = this;
                        var value = e.target.value;
                        if (value === '') {
                            return false;
                        }
                        if (value.indexOf('.') === -1) {
                            if (!reg1.test(value)) {
                                e.target.value = value.substring(0, value.length - 1);
                                that.displayLose(msg);
                            }
                        } else if (!reg2.test(value)) {
                            e.target.value = value.substring(0, value.length - 1);
                        }
                    },
                    // 建筑面积输入限制
                    limitArea: function (ev) {
                        var that = this;
                        var reg1 = /^[1-9]\d{0,3}$/;
                        var reg2 = /^[1-9]\d{0,3}\.\d{0,2}$/;
                        var e = ev;
                        that.limit(reg1, reg2, '建筑面积要大于2平方米小于10000平方米', e);
                        // 参考价评估
                        that.ajaxPg();
                    },
                    // 售价输入
                    iptPrice: function (ev) {
                        var that = this;
                        if (that.price && (that.price >= that.refprice * 1.3 || that.price <= that.refprice * 0.7)) {
                            if (vars.xytype === '1') {
                                that.tjfShow = false;
                            }
                            that.tipShow = true;
                        } else {
                            // 评估价不为0显示默认tips
                            if (that.refprice > 0 && vars.xytype === '1') {
                                // 展示特价房提示
                                that.tjfShow = true;
                            }
                            that.tipShow = false;
                        }
                        // 输入限制与提示
                        var reg1, reg2, msg;
                        var e = ev;
                        if (vars.city === 'bj') {
                            reg1 = /^[1-9]\d{0,3}$/;
                            reg2 = /^[1-9]\d{0,3}\.\d{0,2}$/;
                            msg = '售价要大于两万元小于1亿元';
                        } else {
                            reg1 = /^[1-9]\d{0,4}$/;
                            reg2 = /^[1-9]\d{0,4}\.\d{0,2}$/;
                            msg = '售价要大于两万元小于10亿元';
                        }
                        that.limit(reg1, reg2, msg, e);
                    },
                    blurPrice: function (ev) {
                        var that = this;
                        var reg1, reg2, msg;
                        var e = ev;
                        if (vars.city === 'bj') {
                            reg1 = /^[1-9]\d{0,4}$/;
                            reg2 = /^[1-9]\d{0,4}\.\d{0,2}$/;
                            msg = '售价要大于两万元小于1亿元';
                        } else {
                            reg1 = /^[1-9]\d{0,5}$/;
                            reg2 = /^[1-9]\d{0,5}\.\d{0,2}$/;
                            msg = '售价要大于两万元小于10亿元';
                        }
                        that.limit(reg1, reg2, msg, e);
                    },
                    check: function () {
                        var that = this;
                        if (that.room === '') {
                            that.displayLose('户型室不能为空');
                            return false;
                        } else if (that.hall === '') {
                            that.displayLose('户型厅不能为空');
                            return false;
                        } else if (that.toilet === '') {
                            that.displayLose('户型卫不能为空');
                            return false;
                        } else if (that.buildArea === '') {
                            that.displayLose('建筑面积不能为空');
                            return false;
                        } else if (that.floor === '') {
                            that.displayLose('楼层不能为空');
                            return false;
                        } else if (that.totalFloor === '') {
                            that.displayLose('总楼层不能为空');
                            return false;
                        } else if (parseInt(that.floor) > parseInt(that.totalFloor)) {
                            that.displayLose('楼层不能大于总楼层');
                            return false;
                        } else if (that.forward === '请选择朝向') {
                            that.displayLose('请选择朝向');
                            return false;
                        }else if (parseInt(that.buildArea) > 10000 || parseInt(that.buildArea) < 2) {
                            that.displayLose('面积要大于2平方米小于10000平方米');
                            return false;
                        }else if (that.price === '') {
                            that.displayLose('售价不能为空');
                            return false;
                        } else if (parseInt(that.price) > 100000 || parseInt(that.price) < 2 && vars.city !== 'bj') {
                            that.displayLose('售价要大于2万元小于10亿元');
                            return false;
                        } else if (parseInt(that.price) > 10000 || parseInt(that.price) < 2 && vars.city === 'bj') {
                            that.displayLose('售价要大于2万元小于1亿元');
                            return false;
                        } else if (parseFloat(that.price) / parseFloat(that.buildArea) > 15 && vars.city === 'bj') {
                            that.displayLose('单价要小于15万元/平米');
                            return false;
                        } else if (that.name === '') {
                            that.displayLose('联系人不能为空');
                            return false;
                        } else {
                            return true;
                        }
                    },
                    submit: function () {
                        var that = this;
                        if(!that.canclick){
                            return false;
                        }
                        that.check();
                        if (!that.check()) {
                            return false;
                        }
                        var param = {};
                        // 图片
                        param.imgs = vars.imgs;
                        // 房源描述
                        param.description = vars.description;
                        // 城市
                        param.city = vars.city;
                        // 楼栋号
                        param.UnitNumber = vars.unitNumber;
                        // 房源id
                        param.houseId = vars.houseId;
                        param.indexId = vars.indexId;
                        param.callTime = vars.callTime;
                        // 售价
                        param.price = that.price;
                        // 户型室
                        param.room = parseInt(that.room);
                        // 户型厅
                        param.hall = parseInt(that.hall);
                        // 户型卫
                        param.toilet = parseInt(that.toilet);
                        // 建筑面积
                        param.area = that.buildArea;
                        param.block = vars.block;
                        param.roomNumber = vars.roomNumber;
                        // 楼层
                        param.floor = that.floor;
                        // 总楼层
                        param.totalfloor = that.totalFloor;
                        // 朝向
                        param.forward = that.forward;
                        // 联系人
                        param.linkman = that.name;
                        param.rawid = vars.rawid;
                        param.delegateId = vars.delegateId;
                        if(vars.VideoCoverPhoto){
                            param.videoPhoto = vars.VideoCoverPhoto;
                            param.videoUrl = vars.HouseVideoUrl;
                        }
                        // 统计提交行为
                        yhxw({
                            type: 86,
                            pageId: pageId,
                            curChannel: 'myesf',
                            housetype: param.room + '室',
                            area: param.bulidArea,
                            floornum: param.floor,
                            totalprice: param.price,
                            direction: param.description,
                            name: param.linkman,
                            totalfloor: param.totalfloor
                        });
                        $.ajax({
                            url: vars.mySite + '?c=myesf&a=ajaxdelegateEdit',
                            type: 'post',
                            data: param,
                            success: function (data) {
                                if (data.result === '1') {
                                    that.displayLose(data.message);
                                    if (vars.localStorage) {
                                        vars.localStorage.setItem('editDelegateCount', editDelegateCount + 1);
                                        // 保存新发布状态信息到本地
                                    }
                                    setTimeout(function () {
                                        // 提交完后的跳转地址
                                        window.location.href = vars.mySite + '?c=myesf&a=publishAppend&city=' + vars.city + '&indexId=' + vars.indexId + '&houseid=' + vars.houseId;
                                    },2000);
                                }else if (data.message) {
                                    that.displayLose(data.message);
                                }else {
                                    that.displayLose(data);
                                }
                            }
                        });
                    }
                },
                ready: function () {
                    var that = this;
                    var docH = parseInt($('body').height()) * 1.2;
                    $('.tz-box2').height(docH + 'px');
                    $('.yzm-sta').css('top',parseInt(docH) * 0.35 + 'px');
                    that.ajaxPg();
                    var $back = $('.back');
                    // 解决底部链接穿透点击
                    $('.footer').find('a').on('click',function () {
                        if(!that.canclick) {
                            return false;
                        }
                    });
                    // 编辑未保存提示
                    $back.on('click', function () {
                        var isHxChange = that.varsHuxing !== vars.room + '室-' + vars.hall + '厅-' + vars.toilet + '卫';
                        var isAreaChange = that.buildArea !== vars.area;
                        var isFloorChange = that.floor !== vars.floor;
                        var isTotalChange = that.totalFloor !== vars.totalFloor;
                        var isForwChange = that.forward !== vars.forward;
                        var isPriceChange = that.price !== vars.price;
                        var isNameChange = that.name !== vars.name;
                        if (isHxChange || isAreaChange || isFloorChange || isTotalChange || isForwChange || isPriceChange || isNameChange) {
                            that.nosaveShow = true;
                            that.unable();
                        } else {
                            $(this).attr('href', 'javascript:history.back(-1)');
                        }
                    });
                }

            });
            new Vue({
                el: 'body'
            });
        };
    });