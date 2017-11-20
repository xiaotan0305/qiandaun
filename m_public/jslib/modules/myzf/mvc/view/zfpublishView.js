/**
 * 租房发布页vue改版
 * create by zdl
 * 20161109
 */
define('view/zfpublishView', ['jquery', 'view/component', 'slideFilterBox/1.0.0/slideFilterBox', 'modules/zf/yhxw', 'verifycode/1.0.0/verifycode',
        'dateAndTimeSelect/1.1.0/dateAndTimeSelect'],
    function (require, exports, module) {
        'use strict';
        module.exports = function () {
            var $ = require('jquery');
            var yhxw = require('modules/zf/yhxw');
            require('view/component');
            // 发送验证码插件
            var verifycode = require('verifycode/1.0.0/verifycode');
            var slideFilterBox = require('slideFilterBox/1.0.0/slideFilterBox');
            var vars = seajs.data.vars;
            var ajaxFlag = 0;
            var $doc = $(document);
            var telExp = /^1[34578]{1}[0-9]{9}$/;
            var badTelExp = /^17[01]{1}[0-9]{8}$/;
            var timeCount = 60;
            var timeCountV = 60;
            var sendFlag = true;
            var submitFlag = true;
            var login = parseInt(vars.authenticated);
            var mysfut;
            var zfhc;
            // 增加日期选择功能，lina 20161109
            var DateAndTimeSelect = require('dateAndTimeSelect/1.1.0/dateAndTimeSelect');
            var year = new Date().getFullYear();
            var lastYear = year + 5;
            var options = {
                // 特殊类型
                type: 'jiaju',
                // 年份限制
                yearRange: year + '-' + lastYear,
                // 单个选项的css高度，用于后面的位置计算
                singleLiHeight: 34,
                // 默认显示的日期
                defaultTime: new Date().getTime()
            };
            var dtSelect = new DateAndTimeSelect(options);

            /**
             * 为了方便解绑事件，声明一个阻止页面默认事件的函数
             * @param e
             */
            function pdEvent(e) {
                e.preventDefault();
            }

            /**
             * 禁止页面滑动
             */
            function unable() {
                $doc.on('touchmove', pdEvent);
            }

            /**
             * 允许页面滑动
             */
            function enable() {
                $doc.off('touchmove', pdEvent);
            }

            // 上传图片处理 start
            var $showpicId = $('#show_pic');
            // 图片上传
            var imgupload;
            require.async(['imageUpload/1.0.0/imageUpload_oldzf'], function (ImageUpload) {
                imgupload = new ImageUpload({
                    richInputBtn: '',
                    container: '#show_pic',
                    maxLength: 6,
                    url: '?c=myesf&a=ajaxUploadImg&city=' + vars.city,
                    imgCountId: '',
                    imgsUrl: vars.shineiimg,
                    numChangeCallback: function (count) {
                        if (count === 0) {
                            $showpicId.css('display', 'block').find('dl').addClass('wi80');
                        }
                    }
                });
                if ($showpicId.find('dd').length < 2) {
                    $showpicId.css('display', 'block').find('dl').addClass('wi80');
                }
                $showpicId.on('change', function () {
                    if ($showpicId.find('dd').length < 1) {
                        $showpicId.find('dl').addClass('wi80');
                    } else {
                        $showpicId.find('dl').removeClass('wi80');
                    }
                });
            });

            /**
             * 获取上传图片路径
             * @returns 返回一长度为2的数组 元素一为标题图片的地址
             * 元素二为所有图片的地址
             */
            function getImgUrlFileName() {
                var imgsArray = imgupload.imgsArray;
                var arr = [], arr2 = [], titleImg;
                if (imgsArray) {
                    for (var i = 0; i < imgsArray.length; i++) {
                        arr.push(imgsArray[i].imgurl + ',' + imgsArray[i].fileName);
                        imgsArray[i].generTime = imgsArray[i].generTime.replace(/(\d{4}):(\d\d):(\d\d)/g, "$1-$2-$3");
                        if (imgsArray[i].generTime || (imgsArray[i].gpsX && imgsArray[i].gpsY)) {
                            arr2.push(imgsArray[i].imgurl + '|' + imgsArray[i].generTime + '|' + imgsArray[i].gpsX + '|' + imgsArray[i].gpsY);
                        }
                    }
                    if (imgsArray[0]) {
                        titleImg = imgsArray[0].imgurl;
                    } else {
                        titleImg = '';
                    }
                }
                return [titleImg, arr.join(';'), arr2.join(';')];
            }


            //滑动验证码处理 start
            //引用验证码
            require.async('https://static.soufunimg.com/common_m/m_recaptcha/js/app.js', function(){
                /*验证码初始化*/
                (function(window, $) {
                    // 调用验证控件
                    window.fCheck.init({
                        container: '.slideverify',
                        url: vars.askSite + '?c=public&a=ajaxCodeInit&mode=1',
                        callback: function() {
                            // 验证成功后的回调
                        }
                    });
                })(this, jQuery);
            });


            // 发布的租房类型  分为整租合租
            // 当前页面标识(用户用户行为统计)
            var pageId;
            var rentType = vars.renttype;
            if (vars.edit === '1') {
                pageId = 'muchelprentrevise';
            } else {
                pageId = rentType === '整租' ? 'mzfreleasezz' : 'mzfreleasehz';
            }
            // 统计用户浏览动作
            yhxw({type: 0, pageId: pageId, curChannel: 'myzf'});

            Vue.component('content', {
                replace: true,
                template: '<section class="ddList mt8">'
                + '<dl class="not"><dt>小区名称</dt><dd class="font01">'
                + '<input v-model="varsProjname" v-on:input = "inputLimit" id="projnameManual" maxlength="25" type="text" class="ipt-text"  disabled  placeholder="请选择下拉提示">'
                + '<div v-show="liangxiangList" id="search_completev1"><ul>'
                + '<li class="pad10" v-on:click ="setVal($index)" v-for="todo in ajaxData" data_fun={{todo.newcode}}!!{{todo.projname}}!!{{todo.address}}!!{{todo.purpose}}!!{{todo.district}}!!{{todo.comarea}}>{{todo.projname}}</li>'
                + '</ul></div></dd></dl>'
                + '<div v-show="showLopPan">'
                + '<dl><dt>区<em></em>域</dt><dd class="arr-rt font01">'
                + '<span v-if="districtInfoLen || varsEdit" id="districtManual" class="xuan2" v-on:click="districtSelect">{{varsDistrict}}</span>'
                + '<input v-else type="text" class="ipt-text noinput" v-model="varsDistrict" maxlength="10" placeholder="请输入区域名称" ></dd></dl>'
                + '<dl-Dd dt-Text="商<em></em>圈" :span-Text="varsComare" v-on:click="comareaSelect"></dl-Dd>'
                + '<dl><dt>地<em></em>址</dt> <dd class="font01">'
                + '<input v-model="varsAddress" maxlength="50" type="text" class="ipt-text noinput" placeholder="请输入地址" id="addressManual" disabled>'
                + '</dd></dl>'
                + '</div>'
                + '<dl-Dd dt-Text="户<em></em>型" :span-Text="varsHuxing" v-on:click="huXinSelect"></dl-Dd>'
                + '<dl><dt>楼<em></em>层</dt><dd class="font01">'
                + '<div class="flexbox pdL4">'
                + '第<input name="floorManual" v-on:keyup="filterInput" v-model="varFloor" type="tel" maxlength="3" class="ipt-texta referprice" placeholder="" style="width:40px">层'
                + '<em></em>'
                + '共<input name="totlefloorManual" v-on:keyup="filterInput" v-model="vartotalFloor" type="tel" maxlength="3" class="ipt-texta referprice noinput" style="width:40px">层'
                + '</div></dd></dl>'
                + '<dl><dt>建筑面积</dt><dd class="font01"> <div class="flexbox">'
                + '<input type="tel" class="ipt-text noinput" v-on:keyup="jianzhuM2" v-model="Varsbuildingarea" maxlength="7" placeholder="请输入建筑面积" ><i>平米</i>'
                + '</div></dd></dl>'
                + '<dl v-if="varRenttype"><dt>合租类型</dt> <dd class="arr-rt font01"><span class="xuan2" v-on:click="renttypeSelect">{{varsRentway}}</span></dd></dl>'
                + '<dl><dt>租<em></em>金</dt>'
                + '<dd class="font01"><div class="flexbox"><input v-model="varsPrice" v-on:keyup="filterInput" type="tel" class="ipt-text noinput" maxlength="6" placeholder="请输入租金" ><i>元/月</i></div></dd></dl>'
                + '<equitment-List :value="varsEquitment" v-on:update-Eqval="updateEqval"></equitment-List>'
                + '<dl><dt>标<em></em>题</dt><dd class="font01"><div class="flexbox">'
                + '<input v-model="varsTitle" maxlength="30" type="text" class="ipt-text noinput" placeholder="请输入标题" >'
                + '</div></dd></dl>'
                + '<dl><dt>描<em></em>述</dt>'
                + '<textarea v-model="VarsDescription" v-on:input="limitKeywords" cols="" rows="" class="ipt-text textarea nobd noinput" placeholder="详细的房源介绍，500个字以内" maxlength="500" style="height:80px; width:100%; box-sizing:border-box;">'
                + '</textarea><div class="delBox">'
                + '<a class="del" style="display: none;" v-on:click="delDescription"><i>清空全部</i></a>'
                + '<span class="textRight" style="text-align: right;">{{varsDescriptionLength}}/500</span>'
                + '</div><a v-on:click="generateDescription" v-bind:class="isGenerate ? \'btn-dt\' :\'btn-dt dis\'">生成描述</a></dl>'
                + '<dl><dt>房屋详情</dt><dd class="arr-rt font01"><span class="xuan" v-on:click="toggle">选填</span></dd></dl>'
                + '<div v-show="Optional">'
                + '<dl-Dd dt-Text="朝<em></em>向" :span-Text="varsForward" v-on:click="forwardSelect"></dl-Dd>'
                + '<dl-Dd dt-Text="支付方式" :span-Text="varsPayinfo" v-on:click="payinfoSelect"></dl-Dd>'
                + '<dl-Dd dt-Text="装<em></em>修" :span-Text="varsDecoration" v-on:click="decorationSelect"></dl-Dd>'
                + '<dl-Dd dt-Text="入住时间" :span-Text="varsBegintime" id="begintime" v-on:click="timeSelect"></dl-Dd>'
                + '<dl><dt>楼<i></i>栋<i></i>号</dt><dd class="font01"><div class="flexbox">'
                + '<input v-model="varsUnitblock" type="text" maxlength="5" class="ipt-text noinput" placeholder="请输入楼栋">'
                + '<i>栋</i></div></dd></dl>'
                + '<dl><dt>房<em></em>号</dt><dd class="font01"><div class="flexbox">'
                + '<input v-model="varsNewhall" type="text" maxlength="5" class="ipt-text noinput" placeholder="请输入房号">'
                + '<i>号</i></div></dd></dl>'
                + '</div>'
                + '<dl><dt>姓<em></em>名</dt><dd><div class="flexbox">'
                + '<input v-model="varsContactperson" type="text" class="ipt-text noinput" maxlength="10" placeholder="请输入姓名" >'
                + '<sex-select></sex-select>'
                + '</div></dd></dl>'
                + '<dl><dt>手<i></i>机<i></i>号</dt><dd><div class="flexbox">'
                + '<input v-model="varsMobile" v-on:input="mobileInput" type="tel" id="mobile" class="ipt-text noinput" maxlength="11" placeholder="请输入手机号码">'
                + '<a href="javascript:void(0);" class="btn-tel" v-show="varAuthenticated" v-on:click="sendCode" v-bind:class="{noClick: isnoClick}">{{sendcodeText}}</a>'
                + '</div></dd></dl>'
                + '<dl v-show="varAuthenticated"><dt>验<i></i>证<i></i>码</dt><dd>'
                + '<input v-model="verifyCode" type="tel" class="ipt-text noinput"  value="" maxlength="4" placeholder="请输入验证码" /></dd></dl>'
                + '<dl><div class="slideverify"></div></dl>'
                + '</section>'
                //+ '<div class="mt20 f13 gray-8 pdX10" v-show="showVoiceDiv">收不到验证码？试试<a v-bind:class=redgrayObj v-on:click="sendVoiceCode"> {{voiceCodeText}} </a>吧</div>'
                + '<div class="submitbox pdX14">'
                + '<ul v-show="varIsuse400tel"><li class="f13 gray-8"><input type="radio" id="isuse400tel" class="ipt-rd" @click="selectTel" value={{varsIsuse400}}>推荐！</li>'
                + '<li class="f10 font01">开启免费400电话转机，保护您的手机号码不被公开！</li>'
                + '</ul><a href="javascript:void(0)" class="btn-pay" v-on:click="submit">{{btnText}}</a></div>'
                + '<div v-if="!varsEdit" v-show="comareShow" id="areaDrap" class="sf-maskFixed">'
                + '<div class="sf-bdmenu"><div class="tt"><div class="cancel" v-on:click="cancleComare">取消</div><div class="info">选择商圈</div></div>'
                + '<div id="comareDrapCon" class="con"><ul>'
                + '<li v-for="todo in ajaxcomareData" v-on:click ="comeraSetval($index)">{{todo.name}}</li>'
                + '</ul></div></div></div>'
                + '<districtdrap-List v-if="!varsEdit" v-show="districtShow"  v-on:modify-districtval = "modifydistrictvalVal"></districtdrap-List>'
                + '<drap-List v-show="huxingStep1" huxing="选择户型" v-on:modify-val1 = "modifyVal1"></drap-List>'
                + '<drap-List2 v-show="huxingStep2" :huxing="varsHuxing" v-on:modify-val2 = "modifyVal2"></drap-List2>'
                + '<drap-List3 v-show="huxingStep3" :huxing="varsHuxing" v-on:modify-val3 = "modifyVal3"></drap-List3>'
                + '<rentwaydrap-List v-if="varRenttype" v-show="rentwayShow"  v-on:modify-rentwayval = "modifyrentwayVal"></rentwaydrap-List>'
                + '<forwarddrap-List v-show="showForward"  v-on:modify-forwardval = "modifyforwardVal"></forwarddrap-List>'
                + '<payinfodrap-List v-show="showPayinfo"  v-on:modify-payinfoval = "modifypayinfoVal"></payinfodrap-List>'
                + '<decorationdrap-List v-show="showDecoration"  v-on:modify-decorationval = "modifydecorationVal"></decorationdrap-List>'
                + '<div style="position:fixed;width:100%;height:100%;left:0;top:0;background:rgba(0,0,0,.6);z-index:1000;"v-show="floatPrompt"><div class="yzm-sta">{{promptText}}</div></div>',
                data: function () {
                    return {
                        value: '',
                        // 小区名称联想数据
                        ajaxData: '',
                        // 户型sapn标签默认值
                        huxingVal: '请选择',
                        // 是否显示楼盘列表 编辑页默认显示 发布页默认不显示
                        showLopPan: vars.edit === '1',
                        // 是否是编辑页   用于模板里面的逻辑控制  编辑页和发布页显示的内容略有区别
                        varsEdit: vars.edit === '1',
                        // 是否存在区域信息
                        districtInfoLen: parseInt(vars.districtInfoLen),
                        // 区域span标签的值
                        varsDistrict: vars.district || '请选择区域',
                        // 商圈span标签中的值
                        varsComare: vars.comarea || '请选择商圈',
                        // 地址inpur框中的值
                        varsAddress: vars.address || '',
                        // 小区名称input框中的值 主要是编辑页和发布页的区别
                        varsProjname: vars.projname || '',
                        // 楼层inpur框中的初始值
                        varFloor: vars.floor || '',
                        // 总楼层输入框中的初始值
                        vartotalFloor: vars.totalfloor || '',
                        // 户型sapn标签中的初始值
                        varsHuxing: '',
                        // 户型选择室 下拉列表默认隐藏
                        huxingStep1: false,
                        // 户型选择厅 下拉列表默认隐藏
                        huxingStep2: false,
                        // 户型选择卫 下拉列表默认隐藏
                        huxingStep3: false,
                        // 小区名称联想下拉列表  默认显示
                        liangxiangList: true,
                        // 区域浮层列表 默认隐藏
                        districtShow: false,
                        // 区域名称
                        districtInfoName: vars.districtInfoName.split(',') || '',
                        // 区域id
                        districtInfoId: vars.districtInfoId.split(','),
                        // 商圈初始数据
                        ajaxcomareData: '',
                        // 商圈下拉列表浮层
                        comareShow: false,
                        // 建筑面积input输入框初始值
                        Varsbuildingarea: vars.buildingarea,
                        // 发布整租还是合租出租方式
                        varRenttype: vars.renttype === '合租',
                        // 出租方式默认值
                        varsRentway: vars.rentway || '请选择',
                        // 出租方式浮层列表 默认隐藏
                        rentwayShow: false,
                        // 租金inut输入框默认值
                        varsPrice: vars.price,
                        // 设备列表默认选中值
                        varsEquitment: vars.equitment || '',
                        // 标题input框默认值
                        varsTitle: vars.title,
                        // 描述文本域默认值
                        VarsDescription: vars.description,
                        // 朝向span标签默认值
                        varsForward: vars.forward || '请选择',
                        // 支付方式默认值
                        varsPayinfo: vars.payinfo || '请选择',
                        // 装修默认值
                        varsDecoration: vars.fitment || '请选择',
                        // 选填模块默认隐藏
                        Optional: false,
                        // 朝向下拉浮层默认隐藏
                        showForward: false,
                        // 支付方式下拉浮层默认隐藏
                        showPayinfo: false,
                        // 装修程度下拉浮层默认隐藏
                        showDecoration: false,
                        // 楼栋号input默认值
                        varsUnitblock: vars.unitblock,
                        // 房号inpur框默认值
                        varsNewhall: vars.newhall,
                        // 联系人姓名input框默认值
                        varsContactperson: vars.contactperson,
                        // 默认的性别选择
                        gender: '男',
                        // 手机号input框默认值
                        varsMobile: vars.mobile,
                        // 是否显示发送验证码按钮
                        varAuthenticated: !parseInt(vars.authenticated) || ( vars.authenticated && vars.houseCount === '0'),
                        // 是否显示400电话
                        varIsuse400tel: !badTelExp.test(vars.mobile) && vars.city27 === '1',
                        // 发送验证码按钮button默认文本
                        sendcodeText: '发送验证码',
                        // 错误提示浮层默认隐藏
                        floatPrompt: false,
                        // 提示浮层默认文本
                        promptText: '',
                        // 发送验证码按钮是否可点击样式控制 默认可以点击  不添加noClick样式
                        isnoClick: false,
                        // 发送语音验证码div 默认隐藏
                        //showVoiceDiv: false,
                        // 发送语音验证码按钮是否是否可点击的样式控制 默认可以点击
                        redgrayObj: {'red-f6': true, 'gray-b': false},
                        // 400电话是否选中的初始值
                        varsIsuse400: badTelExp.test(vars.mobile) ? 0 : vars.Isuse400,
                        // 底部发布按钮的文本显示信息
                        btnText: parseInt(vars.edit) ? '确认修改' : '立即发布',
                        // 语音验证码按钮的默认文本
                        voiceCodeText: ' 语音验证码 ',
                        // 验证码input输入框的默认值
                        verifyCode: '',
                        // 物业类型
                        purposeManual: vars.purposeManual,
                        // 小区id
                        projcode: vars.projcode,
                        // 入住时间
                        varsBegintime: vars.begintime,
                        // 防止穿透点击
                        canClick: true,
                        // 小区配套
                        varsXQPeiTao: '',
                        // 小区交通
                        varsXQTraffic: '',
                        // 描述已填写的字数
                        varsDescriptionLength: 0,
                        // 生成描述按钮是否可用
                        isGenerate : false
                    };
                },
                watch: {
                    huxingStep1: 'watchVal',
                    huxingStep2: 'watchVal',
                    huxingStep3: 'watchVal',
                    districtShow: 'watchVal',
                    comareShow: 'watchVal',
                    rentwayShow: 'watchVal',
                    showForward: 'watchVal',
                    showPayinfo: 'watchVal',
                    showDecoration: 'watchVal'
                },
                methods: {
                    /**
                     * 解决穿透点击
                     */
                    enClick: function () {
                        var that = this;
                        setTimeout(function () {
                            that.canClick = true;
                            $('.noinput').attr('disabled',false);
                        },300);
                    },

                    /**
                     * 处理非零数字的输入
                     * @param ev event对象
                     */

                    filterInput: function (ev) {
                        var value = ev.target.value;
                        if (value.indexOf(0) === 0) {
                            ev.target.value = '';
                        }
                        ev.target.value = ev.target.value.replace(/[\D]/g, '');
                    },
                    
                    /**
                     * 处理建筑面积的输入
                     * @param ev event对象
                     */

                    jianzhuM2: function (ev) {
                        var value = ev.target.value;
                        value = value.match(/\d{0,4}(\.\d{0,2})?/g);
                        ev.target.value = value[0];
                        // 防止输入不符合正则的数字时，多出最后一位
                        this.Varsbuildingarea = value[0];
                        // 生成标题(规则：区县+商圈+楼盘名称+面积+厅室 同时存在且为标准楼盘时才生成)
                        this.generateTitle();
                    },

                    /**
                     * 公用的错误信息提示函数
                     * @param text 提示的文本信息
                     * @param time 提示浮层显示的时间
                     * @param url 跳转的链接地址
                     */

                    displayLose: function (text, time, url) {
                        var that = this;
                        that.promptText = text;
                        that.floatPrompt = true;
                        setTimeout(function () {
                            that.floatPrompt = false;
                            if (url) {
                                window.location.href = url;
                            }
                        }, time);
                    },

                    /**
                     * 公用的必填字段验证函数
                     * @returns {boolean} 返回true表示验证通过  返回false表示验证失败
                     */

                    verify: function () {
                        // 首先验证这前要求的必填项是否都填写
                        if (this.varsProjname === '') {
                            this.displayLose('请输入小区名称', 2000);
                            return false;
                        } else if (this.varsDistrict === '请选择区域') {
                            // 验证区域sapn标签的值
                            this.displayLose('请选择区域', 2000);
                            return false;
                        } else if (this.varsComare === '请选择商圈') {
                            // 验证商圈
                            this.displayLose('请选择商圈', 2000);
                            return false;
                        } else if (this.varsAddress === '') {
                            // 验证地址输入框的值
                            this.displayLose('地址不能为空', 2000);
                            return false;
                        } else if (this.varsHuxing === '请选择') {
                            // 验证户型是否选择
                            this.displayLose('请选择户型', 2000);
                            return false;
                        } else if (this.varFloor === '' || this.vartotalFloor === '') {
                            // 判断楼层
                            this.displayLose('楼层不能为空', 2000);
                            return false;
                        } else if (parseInt(this.varFloor) > parseInt(this.vartotalFloor)) {
                            // 判断楼层不能大于总楼层
                            this.displayLose('楼层不能大于总楼层', 2000);
                            return false;
                        } else if (this.Varsbuildingarea === '') {
                            // 判断建筑面积
                            this.displayLose('建筑面积不能为空', 2000);
                            return false;
                        } else if (vars.renttype === '合租' && this.varsRentway === '请选择') {
                            // 判断合租类型 合租页面才需要判断
                            this.displayLose('请选择合租类型', 2000);
                            return false;
                        } else if (this.varsPrice === '') {
                            // 判断租金
                            this.displayLose('租金不能为空', 2000);
                            return false;
                        } else if (this.varsTitle === '') {
                            // 验证标题
                            this.displayLose('标题不能为空', 2000);
                            return false;
                        } else if (this.VarsDescription === '') {
                            // 验证描述
                            this.displayLose('描述不能为空', 2000);
                            return false;
                        } else if (this.varsContactperson === '') {
                            // 验证联系人
                            this.displayLose('联系人不能为空', 2000);
                            return false;
                        } else if (!telExp.test(this.varsMobile)) {
                            // 验证手机号
                            this.displayLose('请输入正确格式的手机号', 2000);
                            return false;
                        } else {
                            return true;
                        }
                    },

                    /**
                     * 观察下拉浮层的显示隐藏状态
                     * @param val 要监控的数据
                     */

                    watchVal: function (val) {
                        // 下拉浮层为显示 禁止页面滑动
                        if (val) {
                            unable();
                        } else {
                            enable();
                        }
                    },

                    /**
                     * 点击小区名称联想列表回掉函数
                     * @param index 点击的是第几个
                     */

                    setVal: function (index) {
                        // 隐藏小区联想下拉浮层
                        this.liangxiangList = false;
                        // 隐藏楼盘对应的div
                        this.showLopPan = false;
                        // 更新小区名称输入框的值
                        this.varsProjname = this.ajaxData[index].projname;
                        // 更新区域名称span标签对应的值
                        this.varsDistrict = this.ajaxData[index].district;
                        // 更新商圈span标签对应的值
                        this.varsComare = this.ajaxData[index].comarea;
                        // 更新地址输入框对应的值
                        this.varsAddress = this.ajaxData[index].address;
                        // 更新物业类型
                        this.purposeManual = this.ajaxData[index].purpose;
                        // 更新小区id
                        this.projcode = this.ajaxData[index].newcode;
                        // 小区交通和配套取小区接口（ajax为异步，所以不能放到一键生成按钮中调用）
                        this.ajaxGetXQInfo();
                        // 生成标题(规则：区县+商圈+楼盘名称+面积+厅室 同时存在且为标准楼盘时才生成)
                        this.generateTitle();
                        if (this.projcode) {
                            this.isGenerate = true;
                        } else {
                            this.isGenerate = false;
                        }
                    },

                    /**
                     * 小区名称input框的的input事件的回掉函数
                     */

                    inputLimit: function () {
                        // me用来缓存当前组件对象
                        var me = this;
                        // 如果再次调用时前一个ajax在执行，终止此次ajax的执行
                        if (ajaxFlag) {
                            ajaxFlag.abort();
                            ajaxFlag = 0;
                        }
                        var value = $('#projnameManual').val();
                        this.varsProjname = value;
                        // ajax相关参数
                        var param = {c: 'myzf', a: 'ajaxGetProjList', q: this.varsProjname, oldPublish: true};
                        ajaxFlag = $.ajax({
                            url: vars.mySite,
                            data: param,
                            datatype: 'json',
                            type: 'GET',
                            success: function (data) {
                                // 更新小气名称联想数据
                                me.ajaxData = data;
                                // 如果联想接口返回了数据
                                me.liangxiangList = data.length;
                                // 显示楼盘div
                                me.showLopPan = true;
                                // 更新区域span标签中的数据
                                me.varsDistrict = '请选择区域';
                                // 更新商圈spn标签中的数据
                                me.varsComare = '请选择商圈';
                                // 更新地址输入框中的数据
                                me.varsAddress = '';
                            }
                        });
                        // 如果手动改了名称，则将生成描述功能置灰
                        me.projcode = '';
                        this.isGenerate = false;
                    },

                    /**
                     * 选择区域下拉列表后的回掉函数
                     * @param index 点击的是下拉列表中的第几个li
                     */

                    modifydistrictvalVal: function (index) {
                        var param = {c: 'myzf', a: 'ajaxGetComarea', dis_id: index.id};
                        // 更新商圈span标签中的数据
                        this.varsComare = '请选择商圈';
                        // 隐藏区域下拉浮层列表
                        this.districtShow = false;
                        // 更新区域span标签中的值
                        this.varsDistrict = index.text;
                        // 联想出商圈数据
                        var me = this;
                        $.get(vars.mySite, param, function (data) {
                            me.ajaxcomareData = data;
                        });
                    },

                    /**
                     * 点击区域span标签的回掉函数
                     */

                    districtSelect: function () {
                        // 显示区域下拉浮层列表
                        this.districtShow = true;
                        if (!this.varsEdit) {
                            this.$nextTick(function () {
                                // 如果不是编辑页 只有发布页才有区域下拉浮层
                                slideFilterBox.refresh('#areaDrapCon');
                                slideFilterBox.to('#areaDrapCon', 0);
                            });
                        }
                    },

                    /**
                     * 点击商圈span标签的回掉函数
                     */

                    comareaSelect: function () {
                        // 选择了区域商圈下拉浮沉才有数据
                        if (this.varsDistrict !== '请选择区域') {
                            this.comareShow = true;
                        } else {
                            this.displayLose('请选择区域', 2000);
                        }
                        if (!this.varsEdit) {
                            this.$nextTick(function () {
                                // 如果不是编辑页 只有发布页才有商圈下拉浮层
                                slideFilterBox.refresh('#comareDrapCon');
                                slideFilterBox.to('#comareDrapCon', 0);
                            });
                        }
                    },

                    /**
                     * 点击取消商圈选择按钮的回掉函数
                     */

                    cancleComare: function () {
                        this.comareShow = false;
                    },

                    /**
                     * 点击商圈下拉列表li的回掉函数
                     * @param index 点击的是第几个li
                     */

                    comeraSetval: function (index) {
                        this.varsComare = this.ajaxcomareData[index].name;
                        this.comareShow = false;
                    },

                    /**
                     * 点击户型span标签的回掉函数
                     */

                    huXinSelect: function () {
                        // 显示选择室数户型浮层
                        this.huxingStep1 = true;
                        // dom执行完更新后
                        this.$nextTick(function () {
                            // 给选择户型室数浮层添加滚动
                            slideFilterBox.refresh('#huxingShiDrapCon');
                            slideFilterBox.to('#huxingShiDrapCon', 0);
                        });
                    },

                    /**
                     * 点击户型下拉列表室数选择浮沉li后执行的回掉函数
                     * @param obj 点击的那个元素带回来的数据
                     */
                    modifyVal1: function (obj) {
                        $('.noinput').attr('disabled',true);
                        this.canClick = false;
                        // 更新户型span标签对应的数据
                        this.varsHuxing = obj.text;
                        // 隐藏户型选择室数下拉浮层
                        this.huxingStep1 = false;
                        // 显示户型选择浮层厅
                        this.huxingStep2 = true;
                        this.$nextTick(function () {
                            slideFilterBox.refresh('#huxingTingDrapCon');
                            slideFilterBox.to('#huxingTingDrapCon', 0);
                        });
                        // 生成标题(规则：区县+商圈+楼盘名称+面积+厅室 同时存在且为标准楼盘时才生成)
                        this.generateTitle();
                        // 解决穿透事件
                        this.enClick();
                    },

                    /**
                     * 点击户型下拉浮层厅数li标签后执行de回掉函数
                     * @param obj 点击的那个元素返回的数据
                     */

                    modifyVal2: function (obj) {
                        $('.noinput').attr('disabled',true);
                        this.canClick = false;
                        this.huxingStep2 = false;
                        this.varsHuxing = this.varsHuxing + obj.text;
                        this.huxingStep3 = true;
                        this.$nextTick(function () {
                            slideFilterBox.refresh('#huxingWeiDrapCon');
                            slideFilterBox.to('#huxingWeiDrapCon', 0);
                        });
                        // 生成标题(规则：区县+商圈+楼盘名称+面积+厅室 同时存在且为标准楼盘时才生成)
                        this.generateTitle();
                        // 解决穿透事件
                        this.enClick();
                    },

                    /**
                     * 点击户型下拉浮层卫数li标签后执行de回掉函数
                     * @param obj 点击的那个元素返回的数据
                     */

                    modifyVal3: function (obj) {
                        $('.noinput').attr('disabled',true);
                        this.canClick = false;
                        this.huxingStep3 = false;
                        this.varsHuxing = this.varsHuxing + obj.text;
                        // 生成标题(规则：区县+商圈+楼盘名称+面积+厅室 同时存在且为标准楼盘时才生成)
                        this.generateTitle();
                        // 解决穿透事件
                        this.enClick();
                    },

                    /**
                     * 点击合租类型span标签执行的回掉函数
                     */

                    renttypeSelect: function () {
                        $('.noinput').attr('disabled',true);
                        this.canClick = false;
                        // 显示合租类型下拉浮层列表
                        this.rentwayShow = true;
                        // 合租类型下拉列表添加滑动效果 只有合租才存在改浮层
                        if (this.varRenttype) {
                            this.$nextTick(function () {
                                slideFilterBox.refresh('#shareTypeDrapCon');
                                slideFilterBox.to('#shareTypeDrapCon', 0);
                            });
                        }
                        this.enClick();
                    },

                    /**
                     * 点击合租类型浮沉列表li执行的回掉函数 用于更新合租类型span的数据
                     * @param obj 点击的那个元素返回的数据
                     */

                    modifyrentwayVal: function (obj) {
                        $('.noinput').attr('disabled',true);
                        this.canClick = false;
                        // 更新合租类型span对应的数据
                        this.varsRentway = obj.text;
                        // 隐藏合租类型下拉浮层列表
                        this.rentwayShow = false;
                        this.enClick();
                    },

                    /**
                     * 点击选填按钮时执行的回掉函数
                     * 实现选填div的显示隐藏切换
                     */

                    toggle: function () {
                        this.Optional = !this.Optional;
                    },

                    /**
                     * 点击朝向span标签的回调函数
                     */

                    forwardSelect: function () {
                        // 显示朝向对应的下拉浮层
                        this.showForward = true;
                        this.$nextTick(function () {
                            slideFilterBox.refresh('#directionDrapCon');
                            slideFilterBox.to('#directionDrapCon', 0);
                        });
                    },

                    /**
                     * 点击房屋朝向浮沉下拉列表时执行的回掉函数
                     * @param text
                     */

                    modifyforwardVal: function (text) {
                        $('.noinput').attr('disabled',true);
                        this.canClick = false;
                        // 更新朝向span标签中的数据
                        this.varsForward = text;
                        this.showForward = false;
                        this.enClick();
                    },

                    /**
                     * 点击支付方式span标签的回调函数
                     */

                    payinfoSelect: function () {
                        if(!this.canClick) {
                            return false;
                        }
                        this.showPayinfo = true;
                        this.$nextTick(function () {
                            slideFilterBox.refresh('#payWayDrapCon');
                            slideFilterBox.to('#payWayDrapCon', 0);
                        });
                    },

                    /**
                     * 点击支付方式下拉列表执行de回掉函数
                     * @param text
                     */

                    modifypayinfoVal: function (text) {
                        $('.noinput').attr('disabled',true);
                        this.canClick = false;
                        this.varsPayinfo = text;
                        this.showPayinfo = false;
                        this.enClick();
                    },

                    /**
                     * 点击装修程度span标签的回调函数
                     */

                    decorationSelect: function () {
                        if(!this.canClick) {
                            return false;
                        }
                        this.showDecoration = true;
                        this.$nextTick(function () {
                            slideFilterBox.refresh('#decorationDrapCon');
                            slideFilterBox.to('#decorationDrapCon', 0);
                        });
                    },

                    /**
                     * 点击入住时间span的回掉函数
                     */
                    timeSelect: function () {
                        if(!this.canClick){
                            return false;
                        }
                        this.$nextTick(function () {
                            dtSelect.show('dtSelect.setting.SELET_TYPE_DATE');
                        });
                    },

                    /**
                     * 点击支付方式下拉列表执行的回掉函数
                     * @param text 点击的li标签对应的文本信息
                     */

                    modifydecorationVal: function (text) {
                        $('.noinput').attr('disabled',true);
                        this.canClick = false;
                        this.varsDecoration = text;
                        this.showDecoration = false;
                        this.enClick();
                    },

                    /**
                     * 电话号码input框输入数据时执行的回调函数
                     */

                    mobileInput: function () {
                        if(!this.canClick){
                            return false;
                        }
                        // 如果电话号码input输入框中输入的值和后台传入的登录电话号码相同
                        this.varAuthenticated = !(this.varsMobile === vars.mobile) || vars.houseCount === '0';
                        this.varIsuse400tel = !badTelExp.test(this.varsMobile);
                    },

                    /**
                     * 点击勾选400电话的回掉函数
                     */
                    selectTel: function () {
                        if (this.varsIsuse400 === '1') {
                            this.varsIsuse400 = '0';
                            $('#isuse400tel').attr('checked', false);
                        } else {
                            this.varsIsuse400 = '1';
                            $('#isuse400tel').attr('checked', true);
                        }
                    },

                    /**
                     * 点击发送验证码按钮时执行的回调函数
                     */
                    sendCode: function () {
                        var that = this;

                        /**
                         * 验证码发送成功的回调函数
                         */

                        function countDown() {
                            // 手机input框设置为不可输入
                            $('#mobile').attr('disabled', true);
                            // 发送验证码按钮添加noClick样式
                            that.isnoClick = true;
                            // 显示发送语音验证码
                            // 通行证原因暂时去掉语音验证码 lina 20170104
                            // that.showVoiceDiv = true;
                            // 发送语音验证码按钮置为灰色
                            that.redgrayObj['gray-b'] = true;
                            that.redgrayObj['red-f6'] = false;

                            var timer1 = setInterval(function () {
                                timeCount--;
                                that.sendcodeText = timeCount + 's';
                                if (timeCount === -1) {
                                    // 清除定时器
                                    clearInterval(timer1);
                                    // 将手机输入框设置可编辑
                                    $('#mobile').attr('disabled', false);
                                    // 倒计时结束的时候把发送验证码的文本修改为重新获取
                                    that.sendcodeText = '重新获取';
                                    // 将发送语音验证码按钮设置为红色可点击状态
                                    that.redgrayObj['gray-b'] = false;
                                    that.redgrayObj['red-f6'] = true;
                                    // 将发送验证码按钮设置为红色可点击状态
                                    that.isnoClick = false;
                                    timeCount = 60;
                                }
                            }, 1000);
                        }

                        if (that.verify()) {
                            // verifycode.sendVerifyCodeAnswer 验证码验证接口
                            verifycode.getPhoneVerifyCode(that.varsMobile, countDown, function () {
                                // 获取验证码失败 回掉此函 把获取验证码按钮置为可用
                            });
                        }
                    },

                    /**
                     * 点击发送语音验证码按钮执行de回掉
                     * @returns {boolean}
                     */

                    sendVoiceCode: function () {
                        var that = this;

                        /**
                         * 语音验证码发送成功的回调函数
                         */
                        function countDownVoice() {
                            // 设置电话输入框倒计时内不可编辑
                            $('#mobile').attr('disabled', true);
                            // 发送验证码按钮置为灰色
                            that.isnoClick = true;
                            // 语音验证码按钮置为灰
                            that.redgrayObj['gray-b'] = true;
                            that.redgrayObj['red-f6'] = false;
                            // 语音验证码计时开始
                            var timer2 = setInterval(function () {
                                timeCountV--;
                                that.voiceCodeText = '语音验证码(' + timeCountV + 's)';
                                if (timeCountV === -1) {
                                    // 清除计时器
                                    clearInterval(timer2);
                                    $('#mobile').attr('disabled', false);
                                    // 设置电话输入框倒计时内可编辑
                                    // $mobilecodeManualId.attr('disabled', false);
                                    // 设置计时结束后文字
                                    that.voiceCodeText = '语音验证码';
                                    // 设置计时结束后语音验证码按钮置为红
                                    that.redgrayObj['gray-b'] = false;
                                    that.redgrayObj['red-f6'] = true;
                                    // 发送验证码按钮置为红色
                                    that.isnoClick = false;
                                    timeCountV = 60;
                                }
                            }, 1000);
                        }

                        // 如果验证通过
                        if (that.verify()) {
                            // 如果发送语音验证码按钮为灰色
                            if (that.redgrayObj['gray-b']) {
                                return false;
                            }
                            if (!sendFlag) {
                                return false;
                            }
                            if (telExp.test(that.varsMobile)) {
                                // 防止连续点击
                                sendFlag = false;
                                $.ajax({
                                    url: 'https://passport.fang.com/passport/Mloginsendmsm.api',
                                    type: 'Post',
                                    dataType: 'json',
                                    async: true,
                                    xhrFields: {
                                        withCredentials: true
                                    },
                                    crossDomain: true,
                                    data: {
                                        MobilePhone: that.varsMobile,
                                        Operatetype: '0',
                                        Service: 'soufun-wap-wap',
                                        Sendvoice: '1'
                                    },
                                    error: function () {
                                        that.displayLose('服务器开小差了，请重试！', 2000);
                                        // 语音验证码按钮限制重置
                                        // sendFlag = true;
                                    },
                                    success: function (data) {
                                        if (data.Message === 'Success') {
                                            countDownVoice();
                                        } else if (data.IsSent) {
                                            that.displayLose(data.Tip, 2000);
                                        }
                                        // 语音验证码按钮限制重置
                                        // sendFlag = true;
                                    }
                                }).always(function () {
                                    sendFlag = true;
                                });
                            } else {
                                that.displayLose('请输入正确格式的手机号码！', 2000);
                            }
                        }
                    },

                    /**
                     * 点击确定按钮提交数据
                     * @returns {boolean}
                     */

                    submit: function () {
                        var that = this;
                        if(!that.canClick){
                            return false;
                        }
                        var verifyError = function () {
                            that.displayLose('短信验证码验证失败,请尝试重新发送', 2000);
                        };
                        if (window.fCheck.config.result === null){
                            this.displayLose('您尚未完成滚动条验证', 2000);
                            return false;
                        }
                        var verifySuccess = function () {
                            var param = {c: 'myzf', a: 'postRentInfo', city: vars.city};
                            var beginTime = $('#begintime');
                            var roomIn = '';
                            if (beginTime.html() !== '随时入住') {
                                roomIn = beginTime.html();
                            }
                            // 获取入住时间
                            param.begintime = roomIn;
                            // 获取房子id 编辑页进入才有
                            param.houseid = vars.houseid;
                            //  获取input框中的手机号
                            param.mobilecode = that.varsMobile;
                            // 获取小区名称input框的值
                            param.projname = that.varsProjname;
                            // 合租方式!!!!!!!!!!!!!!合租中才有主卧,次卧之类
                            param.rentway = that.varsRentway;
                            // 获取区域选择的数据
                            param.district = that.varsDistrict;
                            // 获取商圈选择的数据 该数据在大城市中有  小城市中没有
                            param.comarea = that.varsComare;
                            // 获取地址input框中的数据
                            param.address = that.varsAddress;
                            // 租房类型(span)合租或者整租
                            param.renttype = vars.renttype;
                            // 获取建筑面积input框中的数据
                            param.buildingarea = that.Varsbuildingarea;
                            // 获取租金
                            param.price = that.varsPrice;
                            // 获取用户选中的配套设施
                            param.equitment = that.varsEquitment;
                            // 物业类型,后台向前台传的
                            param.purpose = that.purposeManual;
                            // 标题图片++++++++++
                            param.titleimage = getImgUrlFileName()[0];
                            // 上传图片路径++++++++++++++
                            param.shineiimg = getImgUrlFileName()[1];
                            // 上传图片详细信息
                            param.imgPosList = getImgUrlFileName()[2];
                            // 编辑页面(input)
                            param.edit = vars.edit;
                            // 标题
                            param.title = that.varsTitle;
                            // 描述
                            param.description = that.VarsDescription;
                            // 楼层-第X层
                            param.floor = that.varFloor;
                            // 楼层-共X层
                            param.totlefloor = that.vartotalFloor;

                            // +++++选填信息
                            // 户型-室-厅-卫
                            var huxing = that.varsHuxing;
                            param.room = huxing.substr(0, 1);
                            param.hall = huxing.substr(2, 1);
                            param.toilet = huxing.substr(4, 1);
                            // 朝向
                            param.forward = that.varsForward;
                            // 支付方式,月付等等
                            param.payinfo = that.varsPayinfo;
                            // 装修
                            param.fitment = that.varsDecoration;
                            // 小区id
                            param.projcode = that.projcode;
                            // 绑定400电话
                            param.isuse400tel = that.varsIsuse400;
                            // 楼栋号
                            param.unitblock = that.varsUnitblock;
                            // 房号
                            param.UnitHall = that.varsNewhall;
                            // 联系人
                            param.contactperson = that.varsContactperson;
                            // 性别
                            param.gender = that.gender;
                            // sfut
                            param.telSfut = mysfut;
                            param.hcVer = zfhc;
                            param.verRes = vars.verRes;
                            var currentUrl = window.location.href;
                            var refUrl = document.referrer;
                            var sucurl = vars.mySite + '?c=myzf&a=publishSuccess' + '&city=' + vars.city  + '&edit=' + vars.edit;
                            if (currentUrl.lastIndexOf('baidu-waptc') !== -1 || refUrl.lastIndexOf('baidu-waptc') !== -1) {
                                param['baidu-waptc'] = '';
                                sucurl += '&baidu-waptc';
                            }
                            // 红包活动20170115
                            if (vars.channelurl === '&channel=rentcenter' && vars.edit === '0') {
                                param['SourceDes'] = 'rentcenterwapliuyi';
                            }
                            // 滑动验证码
                            param.challenge = window.fCheck.config.result.fc_challenge;
                            param.validate= window.fCheck.config.result.fc_validate;
                            // 统计合租整租
                            // 47表示发布合租行为 32表示发布整租行为
                            var yhxwType = vars.renttype === '整租' ? 32 : 47;
                            // vars.edit === '1'表示从个人中心的编辑进入修改
                            if (vars.edit === '1') {
                                yhxwType = 111;
                            }
                            // type 用户动作，pageId当前页面标识，curChannel 当前平道，params,当前参数数组
                            yhxw({type: yhxwType, pageId: pageId, curChannel: 'myzf', params: param});
                            if (!submitFlag) {
                                return false;
                            }
                            submitFlag = false;
                            $.post(vars.mySite, param, function (data) {
                                if (data.result === '100') {
                                    if (vars.edit === '1' && data.houseStatus === '4')  {
                                        var managerUrl = vars.mySite + '?c=myzf&city=' + vars.city;
                                        that.displayLose('修改失败', 2000, managerUrl);
                                    } else if (vars.edit === '0' && data.ckData === '0') {
                                        window.location.href = vars.mySite + '?c=myzf&a=houseIdentify&type=auth&city=' + vars.city + '&houseid=' + data.houseid;
                                    } else {
                                        sucurl += '&houseid=' + data.houseid  + '&chongfu=' + data.chongFuHouse + vars.channelurl + vars.h5hdurl;
                                        //返回红包获得状况
                                        sucurl +=  data.message == 'SendBonusSuc' ? '&SendBonus=yes' : '&SendBonus=ishave';
                                        // 储存一个值，给发布成功页面判断是来自发布页还是浏览器刷新
                                        if (data.message == 'SendBonusSuc') {
                                            vars.localStorage.setItem('hongbaoPub', true);
                                        }
                                        if (vars.edit === '1') {
                                            that.displayLose(data.isOpen ? '为保证展示效果，稍后可能有工作人员与您电话核实房源信息' : '修改成功', 2000, sucurl);
                                        } else {
                                            that.displayLose(data.isOpen ? '为保证展示效果，稍后可能有工作人员与您电话核实房源信息' : '发布成功', 2000, sucurl);
                                        }
                                    }
                                } else if (data.message) {
                                    that.displayLose(data.message, 2000);
                                    window.fCheck.reinit();
                                } else if (data === '') {
                                    that.displayLose('网络错误,请稍候再试', 2000);
                                    window.fCheck.reinit();
                                }
                            }, 'json').always(function () {
                                submitFlag = true;
                            });
                        };
                        // 如果验证没有通过 直接退出提交函数
                        if (!that.verify()) {
                            return false;
                        }
                        var getzfHc = function () {
                            var hcParam = {c: 'myzf', a: 'ajaxGethcVer', city: vars.city};
                            $.get(vars.mySite, hcParam, function(data){
                                if (data.errcode === '100') {
                                    zfhc = data.hcVer;
                                    verifySuccess();
                                } else {
                                    that.displayLose('网络超时', 2000);
                                }
                            });
                        }
                        // 如果用户登录了并且输入手机号为登录的手机号码
                        if (parseInt(vars.authenticated) && this.varsMobile === vars.mobile && vars.houseCount > 0) {
                            // 已经登录了,不用再验证验证码
                            getzfHc();
                        } else {
                            if (this.verifyCode === '') {
                                that.displayLose('请输入正确的短信验证码', 2000);
                                return false;
                            }
                            verifycode.sendVerifyCodeAnswer(this.varsMobile, this.verifyCode, function (sfut) {
                                mysfut = sfut;
                                getzfHc();
                            }, verifyError);
                        }
                    },

                    /**
                     * 符合条件时，自动生成标题
                     */
                    generateTitle: function () {
                        // 生成标题(规则：区县+商圈+楼盘名称+面积+厅室 同时存在且为标准楼盘时才生成)
                        if (this.projcode + this.varsProjname && this.varsDistrict && this.varsComare && this.Varsbuildingarea && this.varsHuxing && this.varsHuxing !== '请选择') {
                            this.varsTitle = this.varsDistrict + this.varsComare + this.varsProjname + ' ' + this.Varsbuildingarea + '平米' + this.varsHuxing;
                        } else {
                            this.varsTitle = '';
                        }
                    },

                    /**
                     * 符合条件时，一键生成描述
                     */
                    generateDescription: function () {
                        // 标准小区才有一键生成描述功能，生成描述可点击时才触发事件
                        if (this.projcode && this.isGenerate === true) {
                            this.VarsDescription = '房子在' + this.varsProjname + '小区，环境优美，绿化充足，';
                            if (this.varsAddress) {
                                this.VarsDescription += '位于' + this.varsAddress + '，入住即与精英为邻;';
                            }
                            if (this.varsHuxing && this.varsHuxing !== '请选择') {
                                this.VarsDescription += '该房' + this.varsHuxing + '，';
                            }
                            if (this.varsEquitment) {
                                this.VarsDescription += '房间配套有' + this.varsEquitment + '，';
                            }
                            if (this.varsXQTraffic) {
                                this.VarsDescription += '交通便利,附近的' + this.varsXQTraffic + '，';
                            }
                            if (this.varsXQPeiTao) {
                                this.VarsDescription += '小区周边配套设施齐全,' + this.varsXQPeiTao + ';';
                            }
                            $('.textRight').css('text-align', 'left');
                            $('.del').css('display', 'block');
                            this.varsDescriptionLength = this.VarsDescription.length;
                            if (this.varsDescriptionLength) {
                                this.isGenerate = false;
                            }
                        }
                    },

                    /**
                     * 清空描述内容
                     */
                    delDescription: function () {
                        this.VarsDescription = '';
                        $('.textRight').css('text-align', 'right');
                        $('.del').css('display', 'none');
                        this.varsDescriptionLength = 0;
                        if (this.projcode && !this.varsDescriptionLength) {
                            this.isGenerate = true;
                        }
                    },

                    /**
                     * 限制描述输入的字数
                     */
                    limitKeywords: function () {
                        this.varsDescriptionLength = this.VarsDescription.length;
                        if (this.varsDescriptionLength) {
                            this.isGenerate = false;
                            $('.textRight').css('text-align', 'left');
                            $('.del').css('display', 'block');
                        } else if (!this.varsDescriptionLength && this.projcode) {
                            this.isGenerate = true;
                            $('.textRight').css('text-align', 'right');
                            $('.del').css('display', 'none');
                        }
                    },

                    /**
                     * ajax获取小区内容，用于拼接描述
                     */
                    ajaxGetXQInfo: function () {
                        var that = this;
                        $.get(vars.mySite + '?c=myzf&a=ajaxGetXQInfo&projCode=' + this.projcode + '&city=' + vars.city, function (data) {
                            // 小区交通
                            if (data.traffic_other) {
                                that.varsXQTraffic = data.traffic_other;
                            }
                            // 小区周边配套
                            if (data.peitao) {
                                that.varsXQPeiTao = data.peitao;
                            }
                        });
                    }
                },

                ready: function () {
                    if (vars.edit !== '1') {
                        $('#projnameManual,#addressManual').attr('disabled', false);
                    }
                    if (vars.Isuse400 === '1') {
                        $('#isuse400tel').attr('checked', true);
                    }
                    if (vars.room && vars.hall && vars.toilet) {
                        this.varsHuxing = vars.room + '室' + vars.hall + '厅' + vars.toilet + '卫';
                    } else {
                        this.varsHuxing = '请选择';
                    }
                    // 如果来自编辑页，下面需要同时初始化
                    if (vars.edit === '1') {
                        if (this.VarsDescription.length) {
                            this.varsDescriptionLength = this.VarsDescription.length;
                            this.isGenerate = false;
                            $('.textRight').css('text-align', 'left');
                            $('.del').css('display', 'block');
                        }
                        if (this.projcode) {
                            // 小区交通和配套取小区接口（ajax为异步，所以不能放到一键生成按钮中调用）
                            this.ajaxGetXQInfo();
                        }
                    }
                }
            });

            new Vue({
                el: 'body'
            });
        };
    });