/**
 * @file js合并，ESLint
 * @author fcwang(wangfengchao@soufun.com)
 * * @file 查房价二期
 * @author zcf(zhangcongfeng@fang.com)
 */
define('modules/pinggu/accurate', ['modules/world/yhxw', 'jquery','iscroll/2.0.0/iscroll-lite'], function (require, exports, module) {
    'use strict';
    module.exports = function () {

        var $ = require('jquery');
        var vars = seajs.data.vars;
        var IScroll = require('iscroll/2.0.0/iscroll-lite');
        var evaluate = $('#evaluate');
        // 包裹层id
        var orientation = $('#orientation');
        // 选择朝向id
        var cell = $('#cell');
        // 选择单元id
        var selectDiv = $('#selectDiv');
        // 朝向弹框
        var louceng = $('#louceng');
        // 楼层数
        var zonglouceng = $('#zonglouceng');
        // 总楼层数
        var fTimeId = $('#fTime');
        // 装修完成时间id
        var louDong = $('#louhao');
        // 选择楼栋id
        var facilitiesId = $('#facilities');
        // 厌恶设施id
        var moreText = $('.more_text');
        //flagchose解决选择浮层下也会被点击的bug
        var flagchose = true;
        // 加载更多选项id
        var obj = {};
        var poper = $('.sf-bdmenu .con section');
        // 显示 弹出div
        var selectDivUl = selectDiv.find('ul');
        //main
        var main = $('.main');
        // 选择小区search
        require.async('search/cfj/xiaoquSearch', function (xiaoquSearch) {
            var XiaoquSearch = new xiaoquSearch();
            XiaoquSearch.init();
        });
        // 引入用户行为分析对象-埋码
        var yhxw = require('modules/world/yhxw');
        var maimaParams = {
            'vmg.page': 'cfj_cfj^jjpg_wap'
        };
        yhxw({
            pageId: 'cfj_cfj^jjpg_wap',
            params: maimaParams
        });
        // 禁止事件默认行为
        function preventDefault(e) {
            // @20151229 blue 删除多余代码
            e.preventDefault();
        }

        /**
         * 阻止页面滑动
         */
        function showDiv() {
            document.addEventListener('touchmove', preventDefault);
        }

        /**
         * 恢复页面滑动
         */
        function closeDiv() {
            document.removeEventListener('touchmove', preventDefault);
        }

        /*提示弹框*
        * modified by bjwanghongwei@fang.com
        * 20161226
        * 取消alert弹窗，（app会出现BUG）
         */
        var msg = $('#sendFloat'),
            msgP = $('#sendText'),
            timer = null;

        function showMsg(text, callback) {
            text = text || '信息有误！';
            msgP.html(text);
            msg.fadeIn();
            clearTimeout(timer);
            timer = setTimeout(function () {
                msg.fadeOut();
                callback && callback();
            }, 2000);
        }
        // 记录点击id
        var type = '';
        var i = 0;

        /**
         * 初始化弹框内容
         */
        function initBox() {
            selectDivUl.html('');
            var liStr = '';
            switch (type) {
                case 'cell':
                    for (i = 1; i <= 50; i++) {
                        liStr += '<li>' + i + '单元</li>';
                    }
                    break;
                case 'orientation':
                    liStr += '<li>东</li><li>南</li><li>西</li><li>北</li><li>东南</li><li>西南</li><li>东北</li><li>西北</li><li>南北</li><li>东西</li>';
                    break;
                case 'fTime':
                    liStr += '<li id="wappinggusy_D03_07">一年以内</li><li id="wappinggusy_D03_07">二年以内</li><li id="wappinggusy_D03_07">三～五年</li><li id="wappinggusy_D03_07">五～十年</li><li id="wappinggusy_D03_07">十年以上</li>';
                    break;
                case 'fitment':
                    liStr += '<li id="wappinggusy_D03_08">毛坯</li><li id="wappinggusy_D03_08">普装</li><li id="wappinggusy_D03_08">中装</li><li id="wappinggusy_D03_08">精装</li><li id="wappinggusy_D03_08">豪装</li>';
                    break;
                case 'duty':
                    liStr += '<li>唯一满五</li><li>唯一不满五</li>';
                    break;
                case 'buildingstruct':
                    liStr += '<li>砖混（混合）</li><li>钢混</li>';
                    break;
                case 'buildingstyle':
                    liStr += '<li>塔楼</li><li>板塔结合</li><li>板楼</li>';
                    break;
                case 'landscape':
                    liStr += '<li>临小区绿地</li><li>临小区主景观</li><li>有建筑物遮挡</li><li>临马路</li><li>垃圾站</li>';
                    break;
                case 'daylighting':
                    liStr += '<li>空气流通好，光线充足无暗角</li><li>空气流通一般，光线充足</li><li>局部有暗光</li><li>空气流通差，有暗室</li>';
                    break;
                case 'zyyx':
                    liStr += '<li>无噪音</li><li>噪音较小</li><li>噪音较大</li>';
                    break;
                case 'facilities':
                    liStr += '<li>较近</li><li>较远</li>';
                    break;
                case 'louhao':
                    if (vars.xqLoudong && vars.xqLoudong.indexOf(',') === -1) {
                        liStr += '<li>' + vars.xqLoudong + '</li>';
                    } else if (vars.xqLoudong && vars.xqLoudong.indexOf(',') !== -1) {
                        var xqloudong = new Array();
                        xqloudong = vars.xqLoudong.split(",");
                        for (i = 0; i < xqloudong.length; i++)
                        {
                            if (xqloudong[i] !== null && xqloudong[i].length > 0) {
                                liStr += '<li>' + xqloudong[i] + '</li>';
                            }
                        }
                    }
                    break;
            }
            selectDivUl.append(liStr);
            selectDiv.show();
        }

        // 点击标签弹出选择框事件
        var scroll;
        main.on('click', '.select', function () {
            if (flagchose === false) {
                return false;
            }
            var id = $(this).attr('id');
            var num;
            if (id) {
                type = id;
                if (obj[type] && type !== 'louhao') {
                    selectDivUl.html(obj[type]);
                    selectDiv.show();
                    num = selectDiv.find('li.activeS').index();
                } else {
                    initBox();
                }
                showDiv();
                if (!scroll) {
                    scroll = new IScroll(poper[0], {
                        bindToWrapper: true, scrollY: true, scrollX: false, preventDefault: false
                    });
                }
                scroll.refresh();
                if (num) {
                    // 45:每个li的高度,202:选择框的高度
                    var total = poper.find('ul li').length;
                    var tail = total * 45 - 202;
                    // 所有选项的总高度超过可视高度时滚动
                    if (tail > 0) {
                        // 滚动到底部后不可再向上滚动
                        if ((total - num) * 45 > 202) {
                            scroll.scrollTo(0, -(num - 1) * 45);
                        } else {
                            scroll.scrollTo(0, -tail);
                        }
                    }
                } else {
                    scroll.scrollTo(0, 0);
                }
            }
        });
        // 厌恶因素根据厌恶设施选项show或hide
        $('.cfj-ipt-cb').on('click', function () {
            var ywssarr = [];
            $('input[name="ywss"]:checked').each(function () {
                ywssarr.push($(this).val());
            });
            if (ywssarr.length) {
                $('.facilities').show();
            } else {
                $('.facilities').hide();
            }
        });
        // 点击弹框选项事件,选择内容填充到对应的标签
        selectDivUl.on('click', 'li', function () {
            flagchose = false;
            $('.noinput').attr('disabled', true);
            var $that = $(this);
            $('#' + type).html($that.text() + (type === 'louceng' ? '层' : ''));
            evaluate.find('.' + type).addClass('sele');
            $that.addClass('activeS').siblings().removeClass('activeS');
            obj[type] = selectDivUl.html();
            selectDiv.hide();
            closeDiv();
            setTimeout(function () {
                flagchose = true;
                $('.noinput').attr('disabled', false);
            }, 100);
        });
        // 点击弹框取消事件
        selectDiv.find('.cancel').on('click', function () {
            flagchose = false;
            $('.noinput').attr('disabled', true);
            selectDiv.hide();
            closeDiv();
            setTimeout("", 100);
            flagchose = true;
            $('.noinput').attr('disabled', false);
        });

        // 输入项的字符和位数限制
        evaluate.on('input blur', 'input', function () {
            var $that = $(this);
            var val = $that.val();
            var id = $that.attr('id');
            var reg, flag;
            if (id) {
                switch (id) {
                    case 'zonglouceng':
                    case 'louceng':
                        reg = /\D/g;
                        $that.val(val.replace(reg, ''));
                        break;
                    case 'area':
                        reg = /^[1-9]\d{0,3}(\.\d{0,2})?$/;
                        if (!reg.test(val)) {
                            if (val.indexOf('.') === -1) {
                                showMsg('建筑面积范围10-9999平米');
                                $that.val(val.substring(0, val.length - 1));
                            } else {
                                $that.val(val.substring(0, val.length - 1));
                            }
                        }
                        break;
                    case 'gardenarea':
                    case 'lvtaiarea':
                    case 'basementarea':
                        reg = /^[1-9]\d{0,3}(\.\d{0,2})?$/;
                        if (!reg.test(val)) {
                            if (val.indexOf('.') === -1) {
                                showMsg('赠送面积范围1-9999平米');
                                $that.val(val.substring(0, val.length - 1));
                            } else {
                                $that.val(val.substring(0, val.length - 1));
                            }
                        }
                        break;
                    case 'room':
                    case 'hall':
                        reg = /\D/g;
                        $that.val(val.replace(reg, ''));
                        if (!val) {
                            id === 'room' ? $that.val(2) : $that.val(1);
                        }
                        break;
                    case 'louhao':
                        reg = /[^\w\u4e00-\u9fa5\-]/g;
                        $that.val(val.replace(reg, ''));
                        break;
                    case 'createtime':
                        reg = /[^\d\.]/g;
                        var myDate = new Date();
                        $that.val(val.replace(reg, ''));
                        if (val && (val > myDate.getFullYear() || val <= 0)) {
                            showMsg('不可超过当前年份');
                        }
                        flag = val.indexOf('.') === -1 ? val.match(/\d{0,4}/) : val.match(/\d{0,4}\.\d{0,2}/);
                        if (flag) {
                            $that.val(flag);
                        }
                        break;
                }
                evaluate.find('.' + id).addClass('sele');
            }
        }).on('focus', '#room,#hall', function () {
            $(this).val('');
        });
        // 点击展开更多填写项
        var moreInfo = $('#moreinfo');
        moreText.on('click', function () {
            if (flagchose === false) {
                return false;
            }
            var $that = $(this);
            if (moreInfo.css('display') === 'none') {
                moreInfo.show();
                $that.addClass('up').find('span').text('收起');
            } else {
                moreInfo.hide();
                $that.removeClass('up').find('span').text('继续填写,评估更准确');
            }
        });
        var assessId = $('.cfjBtn03');


        // 布码
        require.async('jsub/_vb.js?c=mcfjeval');
        require.async('jsub/_ubm.js?v=201407181100', function () {
            // 所在城市（中文）
            _ub.city = vars.cityname;
            // 新房“n”，二手房e，租房n，查房价v,家居h，资讯i,知识k
            _ub.biz = 'v';
            // 方位 ，网通为0，电信为1，如果无法获取方位，记录0
            _ub.location = vars.ns === 'n' ? 0 : 1;
            // 所属页面
            // 开始评估
            // 记录当前时间

            var starTime = [];
            assessId.on('click', function assess() {
                if (flagchose === false) {
                    return false;
                }
                var date = new Date();
                starTime.push(date.getTime());
                var projname = vars.projname ? vars.projname : $('#CFJ_searchtext').text();
                if (vars.xqLoudong) {
                    var louhao = $('.main').find('#louhao').text();
                } else {
                    var louhao = $('.main').find('#louhao').val();
                }
                var danyuan1 = cell.text();
                var zfloor = zonglouceng.val();
                var floor = louceng.val();
                var forward = orientation.text();
                var area = $('#area').val();
                var ywss = '';
                var array = [];
                var room, hall, fTime, fitment, duty, createtime, buildingstyle, buildingstruct, landscape, daylighting, zyyx, gardenarea, lvtaiarea, basementarea, facilities;
                if (moreInfo.css('display') !== 'none') {
                    room = $('#room').val();
                    hall = $('#hall').val();
                    fTime = fTimeId.text();
                    fitment = $('#fitment').text();
                    duty = $('#duty').text();
                    createtime = $('#createtime').val();
                    buildingstyle = $('#buildingstyle').text();
                    buildingstruct = $('#buildingstruct').text();
                    landscape = $('#landscape').text();
                    daylighting = $('#daylighting').text();
                    zyyx = $('#zyyx').text();
                    gardenarea = $('#gardenarea').val();
                    lvtaiarea = $('#lvtaiarea').val();
                    basementarea = $('#basementarea').val();
                    facilities = facilitiesId.text();
                    $('input[name="ywss"]:checked').each(function () {
                        array.push($(this).val());
                    });
                    ywss = array.join(',');
                }
                if (!projname || projname === '请选择小区') {
                    showMsg('请选择小区');
                    return;
                }
                if (!louhao) {
                    showMsg('请输入楼栋');
                    return;
                }
                if (!zfloor) {
                    showMsg('请输入总楼层');
                    return;
                }
                if (!floor) {
                    showMsg('请输入楼层');
                    return;
                }
                if (zfloor-floor < 0) {
                    showMsg('楼层不得大于总楼层');
                    return;
                }
                if (!area || area > 9999 || area < 10) {
                    showMsg('建筑面积范围10-9999平米');
                    return;
                }
                var myDate = new Date();
                if (createtime && (createtime > myDate.getFullYear() || createtime <= 0)) {
                    showMsg('不可超过当前年份');
                }
                // 收集评估埋码数据
                var data = {
                    newcode: vars.newcode,
                    buildingarea: area,
                    forward: forward,
                    zfloor: zfloor,
                    floor: floor,
                    buildingnumber: louhao,
                    danyuan: danyuan1
                };
                if (moreInfo.css('display') !== 'none') {
                    data.moreFlag = 1;
                    data.room = room;
                    data.hall = hall;
                    data.fittime = fTime;
                    data.fitment = fitment;
                    data.duty = duty;
                    data.createtime = createtime;
                    data.buildingstyle = buildingstyle;
                    data.buildingstruct = buildingstruct;
                    data.jgys = landscape;
                    data.cgtf = daylighting;
                    data.zyyx = zyyx;
                    data.gardenarea = gardenarea;
                    data.lvtaiarea = lvtaiarea;
                    data.basementarea = basementarea;
                    data.ywsstype = facilities;
                    data.ywss = ywss;
                }
                var url = vars.pingguSite + '?c=pinggu&a=saveAccurateForm';
                var pTemp = {
                    'vmv.projectid': vars.newcode,
                    // 楼盘id
                    'vmv.bulidingnum': encodeURIComponent(projname),
                    // 楼栋
                    'vmv.unit': encodeURIComponent(danyuan1),
                    // 单元
                    'vmv.direction': encodeURIComponent(forward),
                    // 朝向
                    'vmv.area': area,
                    // 面积
                    'vmv.zfloornum': zfloor,
                    // 总楼层
                    'vmv.floornum': floor,
                    // 楼层
                    'vmv.housetype': room,
                    // 户型(室)
                    'vmv.halltype': hall,
                    // 厅
                    'vmv.decorationcost': '',
                    // 装修金额
                    'vmv.decorationage': encodeURIComponent(fTime),
                    // 装修年限
                    'vmv.scenery': encodeURIComponent(landscape),
                    // 景观情况
                    'vmv.gardenarea': gardenarea,
                    // 花园面积
                    'vmv.basementarea': basementarea
                    // 地下室面积
                };
                var p = {};
                // 若pTemp中属性为空或者无效，则不传入p中
                for (var temp in pTemp) {
                    if (pTemp.hasOwnProperty(temp)) {
                        if (pTemp[temp] && pTemp[temp] !== 'undefined') {
                            p[temp] = pTemp[temp];
                        }
                    }
                }
                var now = new Date();
                var time = now.getTime();
                var len = starTime.length;
                // 两次点击间隔时间小于4000ms不能点击
                if (len >= 2 && time - starTime[len - 2] <= 4000) {
                    showMsg('请不要频繁评估');
                    return;
                }
                // 收集方法
                _ub.collect(54, p);
                $.ajax({
                    type: 'POST',
                    url: url,
                    data: data,
                    success: function (data) {
                        if (data !== 'error') {
                            if (data.errcode === '100') {
                                if (data.LogId) {
                                    window.location = vars.pingguSite + '?c=pinggu&a=result&pgLogId=' + data.LogId + '&city=' + vars.city;
                                }
                            } else {
                                showMsg(data.errmsg);
                            }
                        } else {
                            showMsg('抱歉，获取评估结果失败。');
                        }
                    }
                });
            });
        });
        if (vars.localStorage) {
            //精准评估上一页面带来信息
            var jzpgInfo = vars.localStorage.getItem('jzpgInfo');
            if (jzpgInfo) {
                var jzpgInfoData = JSON.parse(jzpgInfo);
                if (jzpgInfoData.Forward && jzpgInfoData.Forward !== '南') {
                    orientation.text(jzpgInfoData.Forward);
                }
                if (jzpgInfoData.Area) {
                    $('#area').val(jzpgInfoData.Area);
                }
                if (jzpgInfoData.Floor) {
                    louceng.val(jzpgInfoData.Floor);
                }
                if (jzpgInfoData.zfloor) {
                    zonglouceng.val(jzpgInfoData.zfloor);
                }
                if (jzpgInfoData.FTime) {
                    fTimeId.text(jzpgInfoData.FTime);
                }
                if (jzpgInfoData.Fitment) {
                    $('#fitment').text(jzpgInfoData.Fitment);
                }
                if (jzpgInfoData.Danyuan) {
                    $('#cell').text(jzpgInfoData.Danyuan);
                }
                if (jzpgInfoData.Room && jzpgInfoData.Room !== '0') {
                    $('#room').val(jzpgInfoData.Room);
                }
                if (jzpgInfoData.Hall && jzpgInfoData.Hall !== '0') {
                    $('#hall').val(jzpgInfoData.Hall);
                }
                if (jzpgInfoData.Louhao) {
                    if ($('.main').find('#louhao').hasClass('select')) {
                        $('.main').find('#louhao').text(jzpgInfoData.Louhao);
                    } else {
                        $('.main').find('#louhao').val(jzpgInfoData.Louhao);
                    }
                }
                vars.localStorage.removeItem('jzpgInfo');
            }
        }
    };
});