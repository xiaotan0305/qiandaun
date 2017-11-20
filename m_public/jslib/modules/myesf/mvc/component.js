/**
 * Created by lina on 2017/3/15.
 * 我的二手房发布页组件
 */
define('modules/myesf/mvc/component', ['jquery', 'imageUpload/1.0.0/imageUpload_myzf'], function (require, exports, module) {
    'use strict';
    var vars = seajs.data.vars;
    var $ = require('jquery');
    // 列表组件
    Vue.component('liList', {
        replace: true,
        template: '<ul>'
        + '<li v-for="todo in todos" dis-id= {{todo.id}} data-val={{todo.val}}  v-on:click ="fill($index)">{{todo.text}}</li>'
        + '</ul>',
        props: ['todos', 'fill']
    });
    // input是可点击的组件
    Vue.component('dlInput', {
        replace: true,
        props: ['dtText', 'placeholder', 'value'],
        template: '<dl><dt>{{{dtText}}}</dt>'
        + '<dd class="font01 referprice arr-rt"><input id="room" type="text" class="ipt-text referprice" disabled value="{{value}}" placeholder="{{placeholder}}"></dd></dl>'
    });
    // 区域选择组件
    Vue.component('dlDd', {
        replace: true,
        props: ['dtText', 'selected'],
        template: '<dl><dt>{{{dtText}}}</dt>'
        + '<dd class="arr-rt font01">'
        + '<select size="1" class="getCom" id="selList" v-model="selected" v-on:change="reserve" style="width:100%;height:31px;-webkit-appearance:none;color:#999;font:inherit;">'
        + '<option v-for="todo in todos"  dis_id="{{todo.disid}}" value="{{todo.val}}">{{todo.val}}</option>'
        + '</select>'
        + '</dd></dl>',
        data:function(){
            var len = this.$parent.districtInfoName.length;
            var todos = [];
            for (var i = 0; i < len; i++) {
                todos.push({
                    disid: this.$parent.districtInfoId[i],
                    val: this.$parent.districtInfoName[i]
                });
            }
            return {
                todos: todos
            };
        },
        methods: {
            reserve: function () {
                var that = this;
                that.$parent.district = that.selected;
                vars.vue.$emit('callMethod', 'setHis', 'district', that.selected);
                var disId = $('#selList').find('option:selected').attr('dis_id');
                $.ajax({
                    url: vars.mySite + '?c=myzf&a=ajaxGetComarea&city='+ vars.city +'&dis_id=' + disId,
                    success:function(data){
                       if(data.length){
                           that.$parent.ajaxcomareData = [];
                           for (var i = 0; i < data.length; i++) {
                               that.$parent.ajaxcomareData.push(data[i].name);

                           }
                           that.$parent.comarea = that.$parent.ajaxcomareData[0];
                       }
                    }
                });
            }
        }

    });
    // 商圈选择组件
    Vue.component('dlDdc', {
        replace: true,
        props: ['dtText', 'selected','ajaxcomareData'],
        template: '<dl><dt>{{{dtText}}}</dt>'
        + '<dd class="arr-rt font01">'
        + '<select size="1" class="getCom" id="selList" v-model="selected" v-on:change="reserve" style="width:100%;height:31px;-webkit-appearance:none;color:#999;font:inherit;">'
        + '<option v-for="todo in ajaxcomareData"  value="{{todo}}">{{todo}}</option>'
        + '</select>'
        + '</dd></dl>',
        data:function(){
            var that = this;
            var disId = that.$parent.districtInfoId[0];
            $.ajax({
                url: vars.mySite + '?c=myzf&a=ajaxGetComarea&city='+ vars.city +'&dis_id=' + disId,
                async:false,
                success:function(data){
                    if(data.length){
                        that.$parent.districtInfoId = [];
                        console.log(data);
                        for (var i = 0; i < data.length; i++) {
                            that.$parent.ajaxcomareData.push(data[i].name);
                        }
                        that.$parent.comarea = that.$parent.ajaxcomareData[0];

                    }
                }
            });
            var todos = [];
            var len = that.$parent.ajaxcomareData.length;
            for (var i = 0; i < len; i++) {
                todos.push({
                    val: that.$parent.ajaxcomareData[i]
                });
            }
            return {
                todos: todos
            };

        },
        methods: {
            reserve: function () {
                var that = this;
                that.$parent.comarea = that.selected;
                vars.vue.$emit('callMethod', 'setHis', 'comarea', that.selected);
            }
        }

    });

    // 户型室选择组件
    Vue.component('drapList1', {
        replace: true,
        props: ['huxing'],
        template: '<div id="huxingShiDrap" class="sf-maskFixed">'
        + '<div class="sf-bdmenu"><div class="tt"> <div class="cancel" v-on:click="cancle">取消</div>'
        + '<div id="huxingShiText" class="info">{{huxing}}</div></div>'
        + '<div id="huxingShiDrapCon" class="con show" >'
        + '<li-list :todos="todos" v-bind:fill="fill"></li-list>'
        + '</div></div></div>',
        data: function () {
            var todos = [];
            for (var i = 1; i <= 7; i++) {
                todos.push({
                    text: i + '室',
                    val: i
                });
            }
            return {
                todos: todos,
                fill: function (index) {
                    this.$dispatch('modify-vals', this.todos[index]);
                }
            };
        },
        methods: {
            cancle: function () {
                this.$parent.canclick = true;
                this.$parent.hxsShow = false;
                this.$parent.enable();
            }
        }
    });
    // 户型厅选择组件
    Vue.component('drapList2', {
        replace: true,
        props: ['huxing'],
        template: '<div id="huxingTingDrap" class="sf-maskFixed">'
        + '<div class="sf-bdmenu"><div class="tt"> <div class="cancel" v-on:click="cancle">取消</div>'
        + '<div class="info">{{huxing}}</div></div>'
        + '<div id="huxingTingDrapCon" class="con show">'
        + '<li-list :todos="todos" v-bind:fill="fill"></li-list>'
        + '</div></div></div>',
        data: function () {
            var todos = [];
            for (var i = 0; i <= 5; i++) {
                todos.push({
                    text: i + '厅',
                    val: i
                });
            }
            return {
                todos: todos,
                fill: function (index) {
                    this.$dispatch('modify-valt', this.todos[index]);
                }
            };
        },
        methods: {
            cancle: function () {
                this.$parent.canclick = true;
                this.$parent.hxtShow = false;
                this.$parent.enable();
            }
        }
    });
    // 户型卫选择组件
    Vue.component('drapList3', {
        replace: true,
        props: ['huxing'],
        template: '<div id="huxingWeiDrap" class="sf-maskFixed">'
        + '<div class="sf-bdmenu"><div class="tt"> <div class="cancel" v-on:click="cancle">取消</div>'
        + '<div class="info">{{huxing}}</div></div>'
        + '<div id="huxingWeiDrapCon" class="con show">'
        + '<li-list :todos="todos" v-bind:fill="fill"></li-list>'
        + '</div></div></div>',
        data: function () {
            var todos = [];
            for (var i = 0; i <= 5; i++) {
                todos.push({
                    text: i + '卫',
                    val: i
                });
            }
            return {
                todos: todos,
                fill: function (index) {
                    this.$dispatch('modify-valw', this.todos[index]);
                }
            };
        },
        methods: {
            cancle: function () {
                this.$parent.canclick = true;
                this.$parent.hxwShow = false;
                this.$parent.enable();
            }
        }
    });
    // 选择楼层
    Vue.component('selLou', {
        replace: true,
        template: '<dl>'
        + '<dt>楼<em></em>层</dt>'
        + '<dd class="font01">'
        + '<div class="flexbox marR8">'
        + '<i class="ml4">第</i><input name="floorManual" v-model="floorVal" type="number" class="ipt-text bb noinput" v-on:input="floorIpt" maxlength="3"><i>层</i>'
        + '</div>'
        + '<dd class="font01">'
        + '<div class="flexbox marL8">'
        + '<i>共</i><input name="totlefloorManual" v-model="totalVal" type="number" class="ipt-text bb noinput" v-on:input="totalIpt"  maxlength="3"><i>层</i>'
        + '</div></dd></dl>',
        props: ['floorVal', 'totalVal'],
        methods: {
            limit: function (e) {
                var value = e.target.value;
                if (value.length > 3) {
                    e.target.value = value.slice(0, 3);
                }
            },
            floorIpt: function (e) {
                var ev = e;
                this.limit(ev);
                this.$parent.floor = ev.target.value;
                if(vars.action === 'delegateAndResale'){
                    this.$parent.setHis('floor', this.$parent.floor);
                }
            },
            totalIpt: function (e) {
                var that = this;
                var ev = e;
                that.limit(ev);
                that.$parent.totalFloor = e.target.value;
                if(vars.action === 'delegateAndResale'){
                    this.$parent.setHis('totalFloor', this.$parent.totalFloor);
                }
            }
        }
    });
    // 选择朝向
    Vue.component('forwardList', {
        replace: true,
        props: ['selected', 'color'],
        template: '<dl>'
        + '<dt>朝<em></em>向</dt>'
        + '<dd class="arr-rt">'
        + '<select name="forward" id="forward" class="referprice noinput" v-model="selected"  v-on:change="reserve"  style="{{color}}">'
        + '<option v-for="todo in todos" style="color:#565c67" value="{{todo.text}}">{{todo.text}}</option>'
        + '</select></dd></dl>',
        data: function () {
            var todos = [
                {text: '请选择朝向'},
                {text: '南北'},
                {text: '南'},
                {text: '东南'},
                {text: '西南'},
                {text: '北'},
                {text: '西'},
                {text: '东西'},
                {text: '西北'},
                {text: '东北'}
            ];
            return {
                selected: '',
                color: '',
                todos: todos
            };
        },
        methods: {
            cancle: function () {
                this.$parent.showForward = false;
            },
            reserve: function () {
                this.$parent.forward = this.selected;
                console.log(this.selected);
                if (this.$parent.forward === '请选择朝向') {
                    this.$parent.color = 'color:#b3b6be';
                    if(vars.action === 'delegateAndResale'){
                        this.$parent.removeHis('forward', this.$parent.forward);
                    }
                } else {
                    this.$parent.color = 'color: rgb(86, 92, 103);';
                    if(vars.action === 'delegateAndResale'){
                        this.$parent.setHis('forward', this.$parent.forward);
                    }
                }
            }
        }
    });
    // 手动输入组件
    Vue.component('tabSx', {
        template: '<div class="float"><section class="tabSX" style="height:300px">'
        + '<div class="lbTab">'
        + '<header class="header">'
        + '<div class="left"><a href="#" class="back" v-on:click="cancel"><i></i></a></div>'
        + '<div class="cent">手动输入</div>'
        + '<div class="show_redrict head-icon">'
        + '<a  id="complete" href="javascript:void(0);" v-on:click="complate">完成</a>'
        + '</div>'
        + '<div class="clear"></div>'
        + '</header>'
        + '<div class="cont" id="selectList" style="display:block;">'
        + '<section>'
        + '<dl>'
        + '<dd><input name="" type="text" class="ipt-text"  v-model="louVal" v-on:input="iptLou" placeholder="请输入楼栋号" ></dd>'
        + '<dd><input name="" type="text" class="ipt-text" v-model="dyVal" v-on:input="iptDy" placeholder="请输入单元号" ></dd>'
        + '<dd><input name="" type="text" class="ipt-text"  v-model="mpVal" v-on:input="iptMp" placeholder="请输入门牌号" ></dd>'
        + '</dl></section></div></div></section></div>',
        props: ['louVal', 'dyVal', 'mpVal'],
        data: function () {
            return {
                louVal: '',
                dyVal: '',
                mpVal: ''
            }
        },
        methods: {
            cancel: function () {
                var that = this;
                that.$parent.iptLouShow = false;
                that.$parent.enable();
            },
            complate: function () {
                var that = this;
                if (that.louVal === '') {
                    alert('楼栋号不能为空');
                    return false;
                } else if (that.dyVal === '') {
                    alert('单元号不能为空');
                    return false;
                } else if (that.mpVal === '') {
                    alert('门牌号不能为空');
                    return false;
                } else {
                    that.$parent.iptLou = that.louVal + '-' + that.dyVal + '-' + that.mpVal;
                    that.$parent.setHis('iptLou', that.$parent.iptLou);
                    that.$parent.iptLouShow = false;
                    that.$parent.enable();
                }
            },
            iptLou: function (e) {
                var that = this;
                that.$parent.dongInfo1 = e.target.value;
                that.$parent.setHis('dongInfo1', that.$parent.dongInfo1);
            },
            iptDy: function (e) {
                var that = this;
                that.$parent.dongInfo2 = e.target.value;
                that.$parent.setHis('dongInfo2', that.$parent.dongInfo2);
            },
            iptMp: function (e) {
                var that = this;
                that.$parent.dongInfo3 = e.target.value;
                that.$parent.setHis('dongInfo3', that.$parent.dongInfo3);
            },

        }
    });
    // 恢复历史信息弹窗
    Vue.component('reHis', {
        template: '<div class="floatAlert" id="float1" style="display:none;">'
        + '<div class="alert">'
        + '<div class="cont">'
        + '<p class="center pdY10 gray-0">您有未填写完成的房源</p></div>'
        + '<div class="btns flexbox"><a href="javascript:void (0)" v-on:click="retoSet"><span class="f15">重新填写</span></a>'
        + '<a href="javascript:void (0)"  v-on:click="retoHis"><span class="f15">恢复填写</span></a></div></div> </div>',
        methods: {
            retoHis: function () {
                var userId = vars.userid;
                if (userId) {
                    for (var key in this.$parent) {
                        if (vars.localStorage.getItem(userId + key + vars.city)) {
                            this.$parent[key] = vars.localStorage.getItem(userId + key + vars.city);
                        }
                    }
                } else {
                    for (var key in this.$parent) {
                        if (vars.localStorage.getItem('myesfHis' + key + vars.city)) {
                            this.$parent[key] = vars.localStorage.getItem('myesfHis' + key + vars.city);
                        }

                    }
                }
                this.$parent.hisShow = false;
                this.$nextTick(function () {
                    if (this.$parent.forward === '请选择朝向') {
                        this.$parent.color = 'color:#b3b6be';
                    } else {
                        this.$parent.color = 'color: rgb(86, 92, 103);';
                    }
                    if (this.$parent.projcode) {
                        this.$parent.ajaxPg();
                    }
                });
            },
            retoSet: function () {
                var userId = vars.userid;
                if (userId) {
                    for (var key in this.$parent) {
                        if (vars.localStorage.getItem(userId + key + vars.city)) {
                            vars.localStorage.removeItem(userId + key + vars.city);
                        }
                    }
                } else {
                    for (var key in this.$parent) {
                        if (vars.localStorage.getItem('myesfHis' + key + vars.city)) {
                            vars.localStorage.removeItem('myesfHis' + key + vars.city);
                        }
                    }
                }
                this.$parent.hisShow = false;
            }

        }
    });
    // 重复房源组件-重复房源提醒
    Vue.component('repHouse',{
        template: '<div class="floatAlert" id="isrepeat">'
        + '<div class="alert">'
        + '<a href="javascript:void(0)" @click="cancel" class="a-close"></a><div class="wtcont">'
        + '<p class="f16 gray-0 mt10">业主您好，您的房源已在房天下发布，点击“<b>去管理</b>”可直接修改价格完善信息，无须重复发布。</p>'
        + '</div>'
        + '<div class="btns flexbox">'
        + '<a href="javascript:void(0);" @click="cancel"><span class="f15">取消发布</span></a>'
        + '<a href="javascript:void(0);" @click="toMange"><span class="f15">{{manerMsg}}</span></a>'
        + '</div></div></div>',
        props:['manerMsg'],
        methods: {
            cancel: function () {
                this.$parent.repShow = false;
                this.$parent.enable();
            },
            toMange: function () {
                var that = this;
                that.$parent.repShow = false;
                // 等于1为已经删除
                if(that.$parent.ownerDelect === '1') {
                    that.$parent.recoveryHouse(that.$parent.houseid);
                }
                if(that.$parent.houseStatus === '2') {
                    that.$parent.pauseSaleDS(that.$parent.houseid,1);
                }
                var jumpUrl = vars.mySite + '?c=myesf&a=houseDetail&city=' + vars.city + '&rawID='  + '&indexId=' + that.$parent.indexId  + '&houseid=' + that.$parent.houseid;
                // 跳转到房源管理页面
                that.$parent.jumpAjax(that.$parent.indexId,that.$parent.houseid,jumpUrl);
            }


        }
    });
    // 疑似重复房源
    Vue.component('ysrepHouse',{
        template: '<div class="floatAlert"  style="display: none">'
        + '<div class="alert"><a href="javascript:void(0)" @click="close" class="a-close"></a><div class="wtcont">'
        + '<p v-if="dataLen" class="f14 gray-0 mt10">业主您好，您在该小区有多套房源出售，从下列房源中选择您要出售的房源点击“<b>'
        + '去管理</b>”可直接修改价格完善信息。如果您要发布新房源，请点击“<b>继续发布</b>”。</p>'
        + '<p v-else class="f14 gray-0 mt10">业主您好，您在该小区有重复房源出售，点击“<b>'
        + '去管理</b>”可直接管理该房源。如果您要发布新房源，请点击“<b>继续发布</b>”。</p>'
        + '<p class="f14 gray-8 mt10">疑似房源：</p>'
        + '<div class="ysfy" id="ysfy"><div style="padding-bottom:20px">'
        + '<div class="mt14 f15 gray-3 ysObj" v-for="data in datas" >'
        + '<input v-if="dataLen" style="z-index:9999" type="radio" value="{{data.HouseID}}-{{data.HouseStatus}}-{{data.OwnerIsDelete}}-{{data.ID}}" v-model="reshouse" class="ipt-rd yeBtn" >'
        + '<input v-else style="display: none" type="radio" value="{{data.HouseID}}-{{data.HouseStatus}}-{{data.OwnerIsDelete}}-{{data.ID}}" v-model="reshouse" class="ipt-rd" >'
        + '{{data.ProjName}}<em></em>{{data.BuildingNumber}}-{{data.UnitNumber}}-{{data.HouseNumber}}</div>'
        + '</div></div>'
        + '</div>'
        + '<div class="btns flexbox">'
        + '<a href="javascript:void(0);" @click="cancel"><span class="f15">继续发布</span></a>'
        + '<a href="javascript:void(0);" @click="toManer"><span class="f15">去管理</span></a>'
        + '</div></div></div>',
        props:['datas','dataLen'],
        methods:{
            // 点击继续发布
            cancel:function(){
                var that = this;
                that.$parent.ysShow = false;
                that.$parent.submit();
            },
            close:function(){
                var that = this;
                that.$parent.ysShow = false;
                that.$parent.enable();
            },
            // 点击房源管理
            toManer:function(){
                var that = this;
                if(that.$parent.ysLen){
                    var selHouseId = $('.ysfy').find('input:checked').val();
                }else{
                    var selHouseId = $('.ysfy').find('input').val();
                }
                if (selHouseId || !that.dataLen) {
                    var selHoeseVal = selHouseId.split('-');
                    var houseId = selHoeseVal[0];
                    var url = vars.mySite + '?c=myesf&a=houseDetail&city=' + vars.city + '&rawID=' + '&indexId=' + selHoeseVal[3] + '&houseid=' + houseId;
                    // 是否已删除该房源
                    if (selHoeseVal[2] === '1') {
                        // 恢复该房源
                        that.$parent.recoveryHouse(houseId,url);
                    }
                    if(!that.$parent.refFlag){
                        setTimeout(function(){
                            // 是否在售
                            if (selHoeseVal[1] === '2') {
                                // 将房源状态改为在售(1表示在售状态)
                                that.$parent.pauseSaleDS(houseId, 1);
                            }
                        },2000);
                    }else{
                        if (selHoeseVal[1] === '2') {
                            // 将房源状态改为在售(1表示在售状态)
                            that.$parent.pauseSaleDS(houseId, 1);
                        }
                    }
                    // 跳转到该房源管理页面
                    this.$nextTick(function(){
                        // 恢复成功或者是没有恢复都跳
                        if(that.$parent.refFlag){
                            if(that.$parent.delFlag){
                                that.$parent.jumpAjax(selHoeseVal[3],houseId,url);
                                return false;
                            }else{
                                setTimeout(function(){
                                    that.$parent.jumpAjax(selHoeseVal[3],houseId,url);
                                },2000);
                            }
                        }
                    });


                } else {
                    that.$parent.displayLose('请选出一条相同房源并进行管理',1);
                }
            }
        }



    });
    // 编辑未保存组件
    Vue.component('noSave',{
        template:'<div class="floatAlert" style="height:100%">'
        + '<div class="alert">'
        + '<div class="cont">'
        + '<p class="center pdY10 f16">编辑未保存，确定放弃保存？</p></div>'
        + '<div class="btns flexbox">'
        + '<a href="javascript:void(0);" @click = "sure">确定</a>'
        + '<a href="javascript:void(0);" @click="cancel">取消</a></div></div></div>',
        methods:{
            cancel: function () {
                var that = this;
                that.$parent.nosaveShow = false;
                that.$parent.enable();
                that.edtiFlag = false;
                that.imgFlag = false;
            },
            sure:function(){
                var that = this;
                var houseId = vars.houseId;
                var indexId = vars.indexId;
                that.$parent.videoPhoto = vars.VideoCoverPhoto;
                that.$parent.videoUrl = vars.HouseVideoUrl;
                that.$parent.desCon = vars.description;
                if(that.$parent.editFlag){
                    window.location.href = vars.editUrl;
                }else if(that.$parent.imgFlag){
                    window.location.href = vars.mySite + '?c=myesf&a=editImg&city=' + vars.city + '&houseid='+ houseId + '&indexId=' + indexId;
                }else{
                    window.history.back(-1);
                }
            }
        }
    });
    // 上传图片组件
    Vue.component('uploadImg', {
        template: '<div id="myesfAddPic"></div>',
        ready: function () {
            var $addpic = $('#myesfAddPic');
            var that = this;
            var hasPic = vars.localStorage.getItem('myesfUpload' + vars.indexId + vars.houseId);
            if (hasPic) {
                var images = hasPic;
                if (vars.action === 'publishAppend') {
                    that.$parent.editShow = true;
                    vars.localStorage.removeItem('myesfUpload' + vars.indexId + vars.houseId);
                }
            } else if (vars.passPhoto) {
                var images = vars.passPhoto;
            }
            var ImageUpload = require('imageUpload/1.0.0/imageUpload_myzf');
            new ImageUpload({
                container: '#myesfAddPic',
                maxLength: 10,
                fatherTemp: '<dl class="mt14"><div class="explain" style="position:absolute;left:30%">上传2张照片以上，得200积分</div></dl>',
                sonTemp: '<dd ></dd>',
                // 添加图片按钮模版
                inputTemp: '<input type="file" name="pic0" id="pic0" accept="image/*" class="upload-input" multiple>',
                // input的容器样式
                inputClass: 'add',
                // 删除图片按钮模版
                delBtnTemp: '<a class="close"></a>',
                loadingGif: vars.public + 'images/loading.gif',
                url: '?c=myesf&a=ajaxUploadImg&city=' + vars.city,
                imgsUrl: images,
                numChangeCallback: function () {
                    var len = $addpic.find('img').length;
                    if (!len) {
                        if (vars.action === 'publishAppend') {
                            that.$parent.editShow = false;
                        }
                    } else {
                        if (vars.action === 'publishAppend') {
                            that.$parent.editShow = true;
                        }
                    }
                }
            });
            var $explain = $addpic.find('.explain');
            if($addpic.find('img').length){
                $explain.hide();
            }else{
                $explain.show();
            }
        }
    });
});
