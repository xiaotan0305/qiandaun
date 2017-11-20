/**
 * modify lina 2016-0929
 * 添加根据小区位置获取楼栋位置
 */
define('modules/myesf/common', ['jquery', 'modules/myesf/myutil', 'modules/index/locate', 'util'], function (require, exports, module) {
    'use strict';
    var $ = require('jquery'),
    // ajax 请求插件
        MyUtil = require('modules/myesf/myutil'),
    // 工具函数
        Util = require('util'),
    // seajs数据
        vars = seajs.data.vars,
    // 户型选择室
        huXingShi = '',
    // 户型选择厅
        huXingTing = '',
    // 户型选择卫
        huXingWei = '',
    // 户型
        $room = $('#room'),
    // 电话
        $phone = $('#phone'),
    // 验证码
        verCode = $('#ver_code'),
    // 隐藏域中的厅
        $hall = $('#hall'),
    // 隐藏域中的卫
        $toilet = $('#toilet'),
    // 小区名称输入框
        $projname = $('#projname'),
        url = '/my/?c=myesf',
        $time = $('#time'),
    // 小区搜索联想列表
        searchCompletev1 = $('#search_completev1'),
        $noLouPan = $('#noLouPan'),
        $addressv1 = $('#addressv1'),
        $district = $('#district'),
        $comarea = $('#comarea'),
    // 用户信息
        userinfo = vars.userinfo,
        mobileNum = '',
        verifyNum = '',
        keyword = '',
        $jsSea = $('#js_sea'),
        $comlaint = $('a.red-f0'),
        $comlaintOL = $('#comlaintOL'),
        $isAgentPhone = $('#isAgentPhone'),
    // 用户的手机号
        userphone = vars.userphone,
    // 倒计时的时间
        timeCount = 60,
    // 获取验证码按钮
        $getCheckCode = $('#getCheckCode'),
    // 记录历史信息
        loacalStorage = vars.localStorage || null,
    // 历史信息的localStorage名称,分城市
        HistoryName = 'delegateAndResaleH_' + vars.city,
    // 全局变量Phnoe
        Phone;
    var clickFlag = true;
    function enClick(){
        setTimeout(function(){
            clickFlag = true;
        },200);
    }
    // 添加房源位置历史信息
    if(vars.action === 'editDelegate') {
        var unitNumber,roomNumber;
        // 房源位置输入框
        var fyPosition = $('#fyPosition');
        // 如果有楼栋位置
        var block = (vars.block && vars.block.length) ? vars.block : '';
        // 如果有单元信息
        if (vars.unitNumber && vars.unitNumber.length && block.length){
            unitNumber = '-'+ vars.unitNumber;
        } else {
            unitNumber = vars.unitNumber || '' ;
        }
        // 如果有门牌号
        if(vars.roomNumber && vars.roomNumber.length && unitNumber.length) {
            roomNumber = '-'+ vars.roomNumber || '';
        } else {
            roomNumber = vars.roomNumber || '';
        }
        // 如果楼栋位置，单元号，门牌号都不存在
        if(!vars.block && !vars.unitNumber && !vars.roomNumber){
            $('#positionSel').hide();
        } else {
            fyPosition.val(block + unitNumber + roomNumber);
        }
    }

    function getCom() {
        var param = {};
        param.a = 'districtAndComarea';
        param.city = vars.city;
        param.coma = $('#districtManual').val();
        var onComplete = function (data) {
            var comArr = [];
            for (var i = 0, l = data.length; i < l; i++) {
                comArr.push('<option value="' + data[i].id + '">' + data[i].name + '</option>');
            }
            $('#comareaManual').html(comArr.join(''));
        };
        MyUtil.ajax(url, 'get', param, onComplete);
    }
    // '楼盘名称'小区提示功能ajax success方法 包括无输入获取焦点和输入内容时的提示
    function nearXQAjax(data) {
        if (data && data.hit && data.hit[0]) {
            $('.font01').find('p').hide();
            $noLouPan.hide();
            var l,resHtml = [],arr = [];
            if(data.hit.length) {
                arr = data.hit;
            }else{
                arr = transform(data.hit);
            }
            l = arr.length;
            for (var i = 0; i < l; i++) {
                var hitObj = arr[i];
                resHtml.push('<li class="li-loudong" data-donginfo="' + hitObj.newcode + ','
                    + hitObj.projname + ',' + hitObj.address + ',' + hitObj.purpose + ','
                    + hitObj.district + ',' + hitObj.comarea + '">' + hitObj.projname + '</li>');
            }
            var h;
            // 如果是电商28城市 联想列表末尾才追加下面的提示
            if (vars.firstlistds) {
                resHtml.push('<li class="red-f0 f12"' + '>' + '请选择下拉框中的楼盘' + '</li>');
                h = 32 * (l + 1);
            } else {
                h = 32 * l;
            }
            if (h > 327) {
                h = 327;
            }
            searchCompletev1.height(h).html(resHtml.join(''));
            if (searchCompletev1.html() !== '') {
                searchCompletev1.show();
                $jsSea.show();
            }
        } else {
            if (vars.firstlistds) {
                $('.font01').find('p').show();
            }
            searchCompletev1.hide();
            $jsSea.hide();
            $noLouPan.show();
            if (vars.action === 'delegateAndResale') {
                $addressv1.val('');
                $district.val('');
                $comarea.val('');
            } else {
                $district.find('option').eq(0).attr('selected', true);
            }
            getCom();
        }
    }
    // 没有输入时，获取周围的10个小区
    function nearXiaoQu() {
        var param = {};
        param.a = 'ajaxGetNearXiaoQu';
        var onComplete = function (data) {
            nearXQAjax(data);
        };
        MyUtil.ajax(url, 'get', param, onComplete);
    }
    // 获取焦点，没有输入时
    $projname.on('focus', function () {
        if (Util.getCookie('geolocation_x') && Util.getCookie('geolocation_y')) {
            nearXiaoQu();
        }
    });
    var later;
    $projname.on('input', querykey);
    $('.getCom').on('change', function () {
        getCom();
    });
   // 小区联想对象转化为数组
    function transform(obj){
        var arr = [];
        for(var item in obj){
            arr.push(obj[item]);
        }
        return arr;
    }
    function querykey() {
        if (later)clearTimeout(later);
        later = setTimeout(function () {
            keyword = $projname.val();
            if (keyword === '') {
                // 如果是二十八电商城市 联想下拉没有数据时才显示改提示
                if (vars.firstlistds) {
                    $('.font01').find('p').show();
                }
                searchCompletev1.html('').hide();
                if (vars.action === 'delegateAndResale') {
                    $addressv1.val('');
                    $district.val('');
                    $comarea.val('');
                } else {
                    $district.find('option').eq(0).attr('selected', true);
                }
                $jsSea.hide();
            } else {
                // +++++++++++++
                $('.font01').find('p').hide();
                var param = {};
                param.a = 'ajaxGetHousingResources';
                param.city = vars.city;
                param.q = keyword;
                var onComplete = function (data) {
                    nearXQAjax(data);
                };
                MyUtil.ajax(url, 'get', param, onComplete);
            }
        }, 100);
    }
    var myPrice = $('#price');
    var area = $('#area');

    /**
     * 均价不能多于15万
     */
    function  checkJJ() {
        if(parseFloat(myPrice.val()) / parseFloat(area.val()) > 15 && vars.city === 'bj'){
            displayLose('单价要小于15万元/平米', 2000);
            myPrice.focus().val('');
        }
    }
    // 委托发布页和编辑为委托页输入项限制zhangcongfeng@fang.com
    if (vars.action === 'delegateAndResale' || vars.action === 'editDelegate') {
        // 建筑面积,楼层和期望价格输入限制
        var limit = function ($that, val, reg1, reg2, message) {
            if (val.indexOf('.') === -1) {
                if (!reg1.test(val)) {
                    $that.val(val.substring(0, val.length - 1));
                    displayLose(message);
                }
            } else if (!reg2.test(val)) {
                $that.val(val.substring(0, val.length - 1));
            }
        };
        $('.ddList').on('input', '#area,#floor,#totalfloor,#price', function () {
            var $that = $(this);
            var val = $that.val();
            var id = $that.attr('id');
            if (val !== '') {
                switch (id) {
                    case 'area':
                        limit($that, val, /^[1-9]\d{0,3}$/, /^[1-9]\d{0,3}\.\d{0,2}$/, '建筑面积要大于2平方米小于10000平方米');
                        if(vars.city === 'bj'){
                            checkJJ();
                        }
                        break;
                    case 'floor':
                    case 'totalfloor':
                        var reg = /^[1-9]\d?$/g;
                        if (!reg.test(val)) {
                            $that.val(val.substring(0, val.length - 1));
                            alert('楼层应在1~99之间且不能为0');
                        }
                        break;
                    case 'price':
                        if (vars.city === 'bj') {
                            limit($that, val, /^[1-9]\d{0,3}$/, /^[1-9]\d{0,3}\.\d{0,2}$/, '售价要大于2万元小于1亿元');
                        } else {
                            limit($that, val, /^[1-9]\d{0,4}$/, /^[1-9]\d{0,4}\.\d{0,2}$/, '售价要大于2万元小于10亿元');
                        }
                        if(vars.city === 'bj'){
                            checkJJ();
                        }
                        break;
                }
            }
        }).on('blur', '#area,#floor,#totalfloor,#price,#description,#linkman,#phone,#projname', function () {
            // 记录历史信息,面积,楼层,总楼层,价格,描述,姓名和电话
            var obj = JSON.parse(loacalStorage.getItem(HistoryName)) || {};
            if (vars.action === 'delegateAndResale') {
                var $that = $(this);
                var id = $that.attr('id');
                obj[id] = $that.val();
                if (id === 'projname' && vars.firstlistds) {
                    obj[id] = '';
                    $('#search_completev1').on('click', 'li', function () {
                        if(clickFlag === true){
                            clickFlag = false;
                            obj.id = $(this).text().trim;
                            enClick();
                        }

                    });
                }
                if(id === 'area'){
                    checkJJ();
                }else if(id === 'price'){
                    var $that = $(this);
                    var val = $that.val();
                    if (val !== '') {
                        if (val.indexOf('.') === -1) {
                            if (vars.city === 'bj' && (parseInt(val) < 2 || parseInt(val) >= 10000)) {
                                $that.val(val.substring(0,val.length - 1));
                                displayLose('售价要大于2万元小于1亿元', 2000);
                                myPrice.focus();
                            } else if (parseInt(val) < 2 || parseInt(val) >= 100000) {
                                $that.val(val.substring(0,val.length - 1));
                                displayLose('售价要大于2万元小于10亿元', 2000);
                                myPrice.focus();
                            }
                        }else{
                            if(parseInt(val) < 2){
                                if (vars.city === 'bj') {
                                    displayLose('售价要大于2万元小于1亿元', 2000);
                                } else {
                                    displayLose('售价要大于2万元小于10亿元', 2000);
                                }

                                $that.val('');
                                $that.focus();
                            }
                        }
                        checkJJ();
                    }
                }
                loacalStorage && loacalStorage.setItem(HistoryName, JSON.stringify(obj));
            }
        });
    }
    /**
     *阻止浏览器默认事件
     * @param e 浏览器默认事件
     */
    function preventDefault(e) {
        e.preventDefault();
    }
    /**
     * 手指滑动时阻止浏览器默认事件(阻止页面滚动）
     */
    function unable() {
        document.addEventListener('touchmove', preventDefault);
    }

    /**
     * 手指滑动恢复浏览器默认事件（恢复滚动
     */
    function enable() {
        document.removeEventListener('touchmove', preventDefault);
    }
    // 手动输入楼栋信息功能
    // 存放结果数组
    var results = [],
    // 房源位置输入框
        fyPosition = $('#fyPosition'),
    // 楼栋位置的容器
        positionSel = $('#positionSel'),
    // 存储页面信息
        localStorage = window.localStorage;
    $projname.on('input',function() {
        if(!($projname.val().length)) {
            $('.font01 ').find('p').html('');
        }else {
            $('.font01 ').find('p').html('没有找到对应住宅楼盘');
        }
    });
    // 非28电商可以不用选择联想词
    $projname.on('blur', function () {
        if(!vars.firstlistds){
            localStorage.xqName = $projname.val();
            localStorage.newCode = '';
        }
    });

    fyPosition.prop('disabled', true);
    $room.prop('disabled',true);
    // 点击楼栋位置
    positionSel.on('click', function () {
        if(clickFlag){
            clickFlag = false;
            // 如果是发布页
            if (vars.action === 'delegateAndResale') {
                var proJameVal = $projname.val();
                var louListLen = searchCompletev1.find('.li-loudong').length;
                // 非28电商
                if(!proJameVal.length && !vars.firstlistds){
                    alert('请输入小区名称');
                    enClick();
                    return false;
                }
                // 28电商
                if(vars.firstlistds && (!proJameVal.length || $('.font01 ').find('p').is(':visible') || louListLen >= 1)){
                    alert('请输入小区名称');
                    enClick();
                    return false;
                }
                $('#js_sea').hide();
                $('.float').show();
                unable();
                enClick();
            }
        }

    });
    function blurs(aaa){
        iptLou.blur();
        iptDanYuan.blur();
        iptDoor.blur();
        setTimeout(function () {
            alert(aaa);
        },0);
    }
    // 手动输入框的弹框
    var float = $('.float'),
    // 输入楼栋号
        iptLou = $('#iptLou'),
    // 输入单元号
        iptDanYuan = $('#iptDanYuan'),
    // 输入门牌号
        iptDoor = $('#iptDoor');
    // 点击手动输入楼栋号里的完成
    $('#complete').on('click', function () {
        if(clickFlag){
            clickFlag = false;
            // 手动输入楼栋号，单元号，门牌号
            var iptLouVal = $('#iptLou').val().trim(),
                iptDanYuanVal = $('#iptDanYuan').val().trim(),
                iptDoorVal = $('#iptDoor').val().trim();
            if (iptLouVal.length && iptDanYuanVal.length && iptDoorVal.length ) {
                fyPosition.val(iptLouVal + '-' + iptDanYuanVal + '-' + iptDoorVal);
                results = [];
                results.push(iptLouVal);
                results.push(iptDanYuanVal);
                results.push(iptDoorVal);
                float.hide();
                enable();
            } else if (!iptLouVal.length ) {
                blurs('楼栋号不能为空');
            } else if (!iptDanYuanVal ) {
                blurs('单元号不能为空');
            } else if (!iptDoorVal) {
                blurs('门牌号不能为空');
            }
            if (localStorage) {
                localStorage.loupanSelect = results;
            }
            enClick();
            return false;
        }

    });
    // 点击返回按钮
    var back = $('#manualheader').find('.back');
    back.on('click', function () {
        if(clickFlag){
            clickFlag = false;
            float.hide();
            enable();
            iptLou.val('');
            iptDanYuan.val('');
            iptDoor.val('');
            enClick();
        }

    });
    // 选择户型类别的功能
    require.async(['iscroll/2.0.0/iscroll-lite'], function (IScroll) {
        // 同时为多个section模块添加滚动效果
        function selectcontroller2(sElArr) {
            this.selectArr = [];
            var l = sElArr.length;
            for (var i = 0; i < l; i++) {
                if (typeof sElArr[i] === 'string') {
                    this.selectArr.push(new IScroll(sElArr[i],{scrollY: true,click:true,preventDefault:false}));
                }
            }
        }
        selectcontroller2.prototype = {
            refresh: function () {
                var l = this.selectArr.length;
                for (var i = 0; i < l; i++) {
                    var ss = this.selectArr[i];
                    ss.refresh();
                }
            }
        };
        var sCtrl;
        var leftSelect = $('#leftSelect');
        var rightSelect = $('#rightSelect');
        if (leftSelect.length > 0 && rightSelect.length > 0) {
            sCtrl = new selectcontroller2(['#leftSelect', '#rightSelect']);
        }
        // 户型下的下拉菜单设置滑动效果
        if ($('#selectScroll1').length > 0 && $('#selectScroll2').length > 0 && $('#selectScroll3').length > 0) {
            var selectCtrl = new selectcontroller2(['#selectScroll1', '#selectScroll2', '#selectScroll3']);
        }
        var $floatSel = $('#floatType'), $floatDate = $('#floatDate');
        $('.wapForm input,.wapForm select').focus(function () {
            var $this = $(this), $id = $this.attr('id');
            if ($id !== 'room' && $id !== 'hall' && $id !== 'toilet') {
                $floatSel.hide();
            }
        });
        // 20160113 zcf 修改ios8不完全支持input readonly的bug
        $('#room,#hall,#toilet').on('mousedown', function (ev) {
            ev.preventDefault();
            return false;
        });
        // 点击出现户型或时间选框
        var dateinfo = $floatDate.find('.info'),
            // 户型室的容器
            $huXingShi = $('.huXingShi li').parents('section'),
            // 户型厅的容器
            $huXingTing = $('.huXingTing li').parents('section'),
            // 户型卫的容器
            $huXingWei = $('.huXingWei li').parents('section'),
            // 选择户型室框
            $topTit1 = $floatSel.find('#topTit1'),
            // 选择户型厅框
            $topTit2 = $floatSel.find('#topTit2'),
            // 选择户型卫框
            $topTit3 = $floatSel.find('#topTit3');
        // 时间或者户型选取
        var objTime = {};
        $('.ShowOrHidden').on('click', function () {
            if(clickFlag){
                clickFlag = false;
                if ($(this).data('id') === 0) {
                    huXingWei = '';
                    $huXingShi.show().addClass('show');
                    $huXingTing.hide().removeClass('show');
                    $huXingWei.hide().removeClass('show');
                    $topTit1.text('');
                    $topTit2.text('');
                    $topTit3.text('');
                    $floatSel.toggle();
                    selectCtrl.refresh();
                } else {
                    $floatDate.toggle();
                    dateinfo.html('开始时间');
                    leftSelect.show().addClass('show');
                    sCtrl.refresh();
                }
                enClick();
            }

        });
        leftSelect.on('click', 'ul li', function () {
            if(clickFlag){
                clickFlag = false;
                objTime.start = $(this).index();
                leftSelect.hide().removeClass('show');
                rightSelect.show().addClass('show');
                dateinfo.html('结束时间');
                sCtrl.refresh();
                enClick();
            }

        });
        rightSelect.on('click', 'ul li', function () {
            if(clickFlag){
                clickFlag = false;
                objTime.end = $(this).index();
                if (objTime.end <= objTime.start) {
                    alert('开始时间请小于截止时间');
                } else {
                    $time.val(objTime.start + ':00' + '-' + objTime.end + ':00');
                    // 记录历史信息 接电时间
                    var obj = JSON.parse(loacalStorage.getItem(HistoryName)) || {};
                    obj.time = objTime.start + ':00' + '-' + objTime.end + ':00';
                    loacalStorage && loacalStorage.setItem(HistoryName, JSON.stringify(obj));
                }
                rightSelect.hide().removeClass('show');
                $floatDate.hide();
                sCtrl.refresh();
                enClick();
            }

        });
        // 户型选取
        var roomval = '';
        var $roomnum = $('#roomnum');
        // 点击获取户型室
        $('#selectScroll1').on('click', 'li',function () {
            if(clickFlag){
                clickFlag = false;
                $huXingShi.hide();
                $huXingShi.next('section').show().addClass('show');
                selectCtrl.refresh();
                huXingShi = $(this).data('id');
                roomval = huXingShi + '室';
                $room.val(vars.action === 'delegateAndResale' || vars.action === 'editDelegate' ? roomval : huXingShi);
                $roomnum.val(huXingShi);
                $topTit1.html(huXingShi + '室');
                enClick();
            }

        });
        // 点击获取户型厅
        $('#selectScroll2').on('click', 'li', function () {
            if(clickFlag){
                clickFlag = false;
                $huXingTing.next('section').show();
                selectCtrl.refresh();
                huXingTing = $(this).data('id');
                roomval += huXingTing + '厅';
                (vars.action === 'delegateAndResale' || vars.action === 'editDelegate') && $room.val(roomval);
                $hall.val(huXingTing);
                $topTit2.html(huXingTing + '厅');
                enClick();
            }

        });
        // 点击获取户型卫
        $('#selectScroll3').on('click', 'li', function () {
            if(clickFlag){
                clickFlag = false;
                $huXingTing.hide().removeClass('show');
                huXingWei = $(this).data('id');
                roomval += huXingWei + '卫';
                (vars.action === 'delegateAndResale' || vars.action === 'editDelegate') && $room.val(roomval);
                $toilet.val(huXingWei);
                // 存储户型信息
                if (vars.action === 'delegateAndResale' && loacalStorage) {
                    var obj = JSON.parse(loacalStorage.getItem(HistoryName)) || {};
                    obj.room = roomval;
                    loacalStorage.setItem(HistoryName, JSON.stringify(obj));
                }
                $topTit3.html(huXingWei + '卫');
                if (vars.action === 'delegateResale') {
                    setTitle();
                }
                $floatDate.hide();
                huXingWei = '';
                $huXingShi.addClass('show');
                $huXingTing.removeClass('show');
                $huXingWei.hide().removeClass('show');
                $topTit1.text('');
                $topTit2.text('');
                $topTit3.text('');
                $floatSel.toggle();
                selectCtrl.refresh();
                enClick();
            }

        });
        // 关联设置标
        function setTitle() {
            var projname = $projname.val();
            if (projname) {
                var price = '', room = '', hall = '', toilet = '', $price = $('#price');
                if ($price.val()) {
                    price = $price.val() + '万/套';
                }
                if ($room.val()) {
                    room = $room.val() + '室';
                }
                if ($hall.val()) {
                    hall = $hall.val() + '厅';
                }
                if ($toilet.val()) {
                    toilet = $toilet.val() + '卫';
                }
                $('#title').val(projname + room + hall + toilet + price);
            }
        }
    });
    // 朝向提示修改颜色 lina 20170208
    var $forward = $('#forward');
    $forward.on('change',function () {
        var selText = $forward.find('option:selected').attr('value');
        if(selText === '') {
            $forward.css('color','#b3b6be');
        }else{
            $forward.css('color','#565c67');
        }
    });
    // checkCodeWidth用来控制手机号码那一行是否显示发送验证码按钮时候的phone的input的长短
    // 下面这个变量因为没有使用到，为了满足ECLint规范所以注释掉的，如果有人又用到了再把注释去掉
    // var checkCodeWidth = $getCheckCode.outerWidth() + 5;
    // 验证码功能
    if (userinfo) {
        // modyfied by bjwanghongwei@fang.com
        // 20161229 手机号不让改动
        $phone.val(userphone).attr('disabled', 'disabled');
        $phone.css('color', '#b3b6be');
        verCode.hide();
        $getCheckCode.hide();
        // 登录时隐藏验证码
    }
    // 小区详情点击我要卖房带入小区名字
    if (vars.projname) {
        $projname.val(vars.projname);
        // 记录历史信息 楼盘
        var obj = JSON.parse(loacalStorage.getItem(HistoryName)) || {};
        obj.projname = vars.projname;
        loacalStorage && loacalStorage.setItem(HistoryName, JSON.stringify(obj));
    }
    // 点击电话号码，显示验证码框
    $phone.keyup(function () {
        // 修改电话号码，显示验证码
        verCode.show();
        $getCheckCode.show();
        if ($phone.val() === userphone && userphone !== '') {
            verCode.hide();
            // 电话号码与登录电话相同时，不需输入验证码
            $getCheckCode.hide();
        }
    });
    // 增加标志位,倒计时结束才会发送第二次ajax
    var countdownFlag = true;
   // 更新时间
    function updateTime() {
        countdownFlag = false;
        $getCheckCode.html(timeCount + '秒');
        timeCount--;
        if (timeCount > -1) {
            setTimeout(updateTime, 1000);
        } else {
            countdownFlag = true;
            $getCheckCode.html('重新发送').removeAttr('disabled');
            timeCount = 60;
        }
    }
    // 弹出3秒浮层
    function displayLose( keywords) {
        var sendText = $('#sendText'),
            sendFloat = $('#sendFloat');
        sendFloat.show();
        sendText.html(keywords);
        setTimeout(function () {
            $('#verifyCode').val('');
            sendFloat.hide();
            sendText.html('');
            $('#sure').css('background', '#999');
            verifyNum = '';
        }, 2000);
    }
    // 发送验证码
    function ajaxVerifyTips() {
        if (countdownFlag) {
            require.async('verifycode/1.0.0/verifycode', function (verifycode) {
                verifycode.getPhoneVerifyCode($('#phone').val(), updateTime(), function () {
                    return false;
                });
            });
        }
    }
    // 判断手机号是否为经纪人手机号
    function ajaxCheckAgent() {
        var url = '/my/?c=myesf';
        var param = {};
        param.a = 'ajaxGetCheckAgent';
        param.telephone = Phone;
        var onComplete = function (data) {
            if (data.result === '1') {
                $isAgentPhone.show();
            } else if (data.result === '0') {
                $isAgentPhone.hide();
                ajaxVerifyTips();
            } else {
                $isAgentPhone.hide();
            }
        };
        MyUtil.ajax(url, 'post', param, onComplete);
    }

    // 发送验证码
    $getCheckCode.on('click', function () {
        if(clickFlag){
            clickFlag = false;
            Phone = $phone.val();
            if (!Phone) {
                displayLose('请输入手机号');
                mobileNum = '';
            } else if (!/^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$/i.test(Phone)) {
                displayLose('请输入正确格式的手机号');
                mobileNum = '';
            } else {
                ajaxCheckAgent();
            }
            enClick();
        }

    });
    // 协议相关功能
    // 协议按钮
    var protocol = $('#protocol'),
    // 委托内容容器
        weituoInfo = $('#weituoInfo'),
    // 我已阅读按钮
        btn01 = $('.btn01'),
    // 查看委托协议按钮
        iptRed = $('.ipt-rd');
    // 点击是否同意按钮
    iptRed.on('click', function () {

            var ele = $(this);
            var thisCheck = ele.attr('checked');
            console.log(thisCheck)
            if (thisCheck == 'checked') {
                ele.attr('checked', false);
            } else {
                ele.attr('checked', true);
            }

    });
    /**
     *阻止浏览器默认事件
     * @param e 浏览器默认事件
     */

    // 点击房屋委托出售协议
    var thisTop,$body = $('body');
    protocol.on('click', function () {
        if(clickFlag){
            clickFlag = false;
            thisTop = $body.scrollTop();
            weituoInfo.show();
            //$body.css('position','fixed');
            enClick();
        }

    });
    // 点击我已阅读
    btn01.on('click', function () {
        if(clickFlag){
            clickFlag = false;
            weituoInfo.hide();
            //$body.css('position','relative');
            $body.scrollTop(thisTop);
            enClick();
        }

    });
    // 申诉相关功能
    // 申诉弹框
    var $floatComlaint = $('#floatComlaint'), $floatComSuc = $('#floatComSuc');
    $comlaint.on('click', function () {
        if(clickFlag){
            clickFlag = false;
            $floatComlaint.show();
            enClick();
        }

    });

    // 关闭申诉成功浮层
    $floatComSuc.find('a').on('click', function () {
        if(clickFlag){
            clickFlag = false;
            $floatComSuc.hide();
        }

    });
});