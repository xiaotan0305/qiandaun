/**
 * @file 楼栋核验WAP页工具
 * @author 袁辉辉(yuanhuihui@fang.com)
 */
define('../../m_activity/EntryhouseTwo/js/buildingTool', ['jquery', 'mapAPI/1.0.1/mapAPI', 'modules/map/API/1.0.1/BMap'], function (require, exports, module) {
    'use strict';
    var vars = seajs.data.vars;
    var $ = require('jquery');
    $('input[type=hidden]').each(function (index, element) {
        vars[$(this).attr('id')] = element.value;
    });
    var mapAPI = require('mapAPI/1.0.1/mapAPI');
    var SFMap = {
        mapId: 'allmap',
        // 初始化，在页面加载后根据列表或搜索页所传参数进行一次搜索，并且绑定地图事件
        init: function () {
            var that = this;
            var mainSite = vars.protocol + vars.mainSite + '/huodongAC.d?';
            // 添加 删除 移动地址头
            that.operationUrl = mainSite + 'm=saveMarkInfoAjax&class=EntryhouseHc';
            that.ajaxDataUrl = mainSite + 'm=postMarkInfoAjax&class=EntryhouseHc&user='
                + vars.total_user + '&newcode=' + vars.total_newcode + '&dongid=' + vars.markid;
            // 地图dom
            that.mapEl = $('#' + that.mapId);
            // 删除弹窗提示
            that.deletePointTip = $('#deletePointTip');
            // 请选择楼栋名称弹窗提示
            that.selectBuildingTip = $('#selectBuildingTip');
            // 头
            that.header = $('#header');
            // 新增的取消按钮
            that.addCancel = $('#addCancel');
            // 新增的确定按钮
            that.addOk = $('#addOk');
            // 删除的取消按钮
            that.deleteCancle = $('#deleteCancle');
            // 返回按钮
            that.back = $('#back');
            // 绑定新增 移动 删除标点的具体事件
            that.bindEvent();
            // 描点完毕后执行
            var markerFunc = function () {
                // 绑定描点点击事件:针对删除, 弹出提示,用户点击确定后进行删除
                var markers = that.map.markerManager.markers;
                for (var i = 0; i < markers.length; i++) {
                    markers[i].addEventListener('touchend', function (e) {
                        that.addAndDelterListener(e);
                    });
                    // 移动拖拽事件: 是否移动了不可编辑描点
                    markers[i].addEventListener('ondragging', function (e) {
                        that.addDraggingListener(e);
                    });
                }
                that.mapEl.find('.yellewlable').parent().css({zIndex: 8888});

                //  若没有楼栋设置小区为中心
                if (!that.map.markerManager.markers.length) {
                    that.map.ajaxData.length && that.map.setCenter(that.map.ajaxData[0]['xiaoquY'], that.map.ajaxData[0]['xiaoquX'], 19);
                }
            };
            // 自定义描点函数
            var buildMarkerDomFunc = function (info) {
                // 需要处理当前楼栋高亮信息
                var cls = 'redlable';
                // 若有此标识则说明需要高亮
                if (info.mark === '0') {
                    // 找到
                    cls = 'yellewlable';
                }
                // 自定义覆盖物
                var html = '<div style="margin-left: -15px;margin-top: -30px" class="' + cls
                    + '" data-dongid="' + info.dongid + '" data-lng="' + info.baiduCoordX + '" data-lat="' + info.baiduCoordY + '">'
                    + ' <div class="lablepoint">'
                    + ' <a class="point"></a>'
                    + ' <a style="display: none" class="dele_point"></a>'
                    + ' </div>'
                    + '<div class="lable_bg">'
                    + '<p><span class="npx">' + info.dongname + '</span></p>'
                    + '<div class="caret"></div>'
                    + '</div>'
                    + '</div>';
                return html;
            };

            // 初始化地图配置
            var options = {
                // 地图容器id
                container: vars.mapid,
                // 设置地图类型
                mapType: !0,
                // 是否需要设置地图大小, 默认不设置
                isSetSize: !0,
                // 地图中心点纬度  默认天安门纬度
                lat: vars.lat,
                // 地图中心点经度  默认天安门经度
                lng: vars.lng,
                // 初始化时地图的缩放等级  默认12  范围3-19
                zoom: 12,
                // 是否绑定拖拽和缩放事件
                isBindEvent: !1,
                // 对描点和地图的操作  默认为null
                markerFunc: markerFunc,
                // 描点是不是自适应显示在可视区内 默认为true
                autoSize: !0,
                markerData: {
                    // 地址
                    url: that.ajaxDataUrl,
                    // 传输类型, 默认'GET'
                    type: 'GET',
                    dataType: 'json',
                    // 参数, 默认为空{}
                    data: {}
                },
                prop: {
                    // 数据中存放经度的变量名  默认Lng
                    lngProp: 'baiduCoordX',
                    // 数据中存放纬度的变量名  默认Lat
                    latProp: 'baiduCoordY',
                    // 数据中存放纬度的变量名, 不传代表直接返回描点数组
                    ajaxDataArrayProp: '',
                    // 数据中存放dom格式的变量名默认cusDom, 也可以传函数
                    cusDom: buildMarkerDomFunc
                }
            };
            that.map = new mapAPI(options);
            // 隐藏三维
            that.map.map.addEventListener('tilesloaded', function () {
                that.mapEl.find('.BMap_noprint').children().eq(2).hide();
            });
        },
        btnShow: function () {
            $('.btn_bz').show();
        },
        // 弹窗提示
        msg: function (content, type, notSHowIcon) {
            var that = this;
            var firstLine = that.selectBuildingTip.find('.firstLine');
            // 文字
            var secondLine = that.selectBuildingTip.find('.secondLine');
            var result = that.selectBuildingTip.find('.operat_result');
            // 提示图标
            var iconTip = '';
            switch (type) {
                case 'addNoName':
                    iconTip = vars.failIcon;
                    secondLine.text(content.second).show();
                    result.show();
                    that.selectBuildingTip.show();
                    break;
                case 'success':
                    iconTip = vars.successIcon;
                    secondLine.hide();
                    result.hide();
                    that.selectBuildingTip.show(16).delay(1500).hide(16);
                    break;
                case 'fail':
                    iconTip = vars.failIcon;
                    secondLine.hide();
                    result.show();
                    that.selectBuildingTip.show();
                    break;
                default:
                    iconTip = '';
            }
            var img = firstLine.find('span').text(content.first).end().find('img').attr({src: iconTip});
            if (notSHowIcon) {
                img.hide();
            } else {
                img.show();
            }
        },
        // 绑定事件
        bindEvent: function () {
            var that = this;
            // 三个按钮和楼栋列表
            var addBtn = $('#add'), moveBtn = $('#move'), deleteBtn = $('#delete');
            // 楼栋列表
            that.loudongList = $('#loudongList');
            // 提示框确定按钮
            var result = that.selectBuildingTip.find('.operat_result');
            // 提示框确定事件
            result.on('click', function () {
                that.selectBuildingTip.hide();
            });
            //
            var canAdd = false;
            // 取消删除时
            that.deletePointTip.find('#cancelDelete').on('click', function (event) {
                event.preventDefault();
                $('.press_on').removeClass('press_on');
                that.deletePointTip.hide();
            });
            // 确定删除时
            $('#okDelete').on('click', function (event) {
                event.preventDefault();
                var grandPa = $('.press_on').parent().parent();
                var delDongId = grandPa.attr('data-dongid');
                var delData = {
                    newcode: vars.total_newcode,
                    user: vars.total_user,
                    data: [{dongid: delDongId, coord: '0'}]
                };
                $.ajax({
                    url: that.operationUrl,
                    type: 'POST',
                    dataType: 'json',
                    data: {postData: JSON.stringify(delData)}
                }).done(function (data) {
                    // data.result=1时成功  0时失败
                    if (data.result === '1') {
                        var dongid = $('.press_on').parent().parent().attr('data-dongid');
                        $('#loudongList').find('li[data-dongid = ' + dongid + ']').attr('class', '');
                        that.map.markerManager.markers.forEach(function (el) {
                            if ($(el._container).find('div[data-dongid=' + dongid + ']').length) {
                                that.map.removeOverlay(el);
                            }
                        });
                        $('.press_on').parent().parent().parent().hide();
                        that.deletePointTip.hide();
                        that.msg({first: '删除成功！', src: ''}, 'success');
                    } else {
                        that.deletePointTip.hide();
                        that.msg({first: '删除失败！', src: ''}, 'fail');
                        $('.press_on').removeClass('press_on');
                    }
                }).fail(function () {
                    that.deletePointTip.hide();
                    that.msg({first: '删除失败！', src: ''}, 'fail');
                    $('.press_on').removeClass('press_on');
                });
            });
            //  新增描点
            addBtn.on('click', function () {
                that.setHeadState(3);
                // 改变head显示状态, 计算新增标点的位置,需要在屏幕中下方,并将点描到地图,标点样式见下面注释
                var bs = that.map.map.getBounds();
                // 可视区域左下角
                var bssw = bs.getSouthWest();
                // 可视区域右上角
                var bsne = bs.getNorthEast();
                var newmarkerlng = (bssw.lng + bsne.lng) / 2;
                var newmarkerlat = (bsne.lat - bssw.lat) / 5 * 2 + bssw.lat;
                var lnglat = {baiduCoordX: newmarkerlng, baiduCoordY: newmarkerlat};
                var newmarker = '<div style="margin-left: -13px;margin-top: -31px;" class="bluelable" data-dongid=""'
                    + ' data-lng="' + newmarkerlng + '" data-lat="' + newmarkerlat + '">'
                    + '<div class="lablepoint">'
                    + '<a href="javascript:;" class="point"></a>'
                    + '<a style="display: none" class="dele_point"></a>'
                    + '</div>'
                    + '<div class="lable_bg">'
                    + '<p><span class="npx">请选择楼栋&nbsp;&gt;&gt;</span></p>'
                    + '<div class="caret"></div>'
                    + '</div>'
                    + '<div class="lable_alert">'
                    + '<p>请拖动到标记楼栋所在位置</p></div></div>';
                var marker = that.map.drawMarker(lnglat, newmarker);
                that.setCanMove(!0, !0);
                $('.bluelable').parent().css({zIndex: 9999});
                if (marker) {
                    that.addMarker = marker;
                    marker.addEventListener('touchend', function (e) {
                        that.addAndDelterListener(e, !0);
                    });

                    //  若当前楼栋没进行标点则默认显示
                    var currentMarker = that.mapEl.find('.yellewlable');
                    if (vars.markid && (!currentMarker.length || currentMarker.length && !currentMarker.is(':visible'))) {
                        that.loudongList.find('li[data-dongid=' + vars.markid + ']').trigger('click', ['codeTrigger']);
                    }
                }
            });

            // 绑定选择楼栋功能,注意用委托一次绑定
            // 绑定楼栋列表功能:选择之后设置当前正在新增的标点文本内容和样式
            that.loudongList.on('click', 'li', function (e, isCodeTrigger) {
                var $this = $(this), str = $this.text();
                if ($this.hasClass('forbid')) {
                    return false;
                } else if ($this.attr('data-status') === '0') {
                    that.loudongList.hide();
                    // 若状态为0,表示为不可编辑状态,若代码触发,则不给提示
                    if (!isCodeTrigger) {
                        that.msg({first: '请先保存"' + str + '"楼栋信息! '}, 'fail', !0);
                    }
                } else {
                    $this.addClass('choseon').siblings().removeClass('choseon');
                    that.loudongList.hide();
                    $('.bluelable .npx').text(str);
                    canAdd = true;
                    var dongid = $this.attr('data-dongid');
                    $('.bluelable').attr('data-dongid', dongid);
                }
            });

            // 设置点击左侧复测隐藏列表
            that.loudongList.on('click', function (e) {
                if (e.target.id === 'loudongList' || e.target.parentElement.id === 'louDongBack') {
                    $(this).hide();
                }
            });

            //  移动描点
            moveBtn.on('click', function () {
                // 改变head显示状态, 设置所有标点为可拖拽的
                that.setHeadState(2);
                that.setCanMove(!0);
            });

            //  删除描点
            deleteBtn.on('click', function () {
                // 改变head显示状态, 设置所有标点样式显示X号,
                that.setHeadState(1);
                $('.dele_point').show();
            });

            // 绑定头上的各个按钮事件
            that.header.on('click', 'a', function () {
                var $this = $(this), id = $this.attr('id');
                // 取消新增时
                if (id === 'addCancel') {
                    that.btnShow();
                    that.map.removeOverlay(that.addMarker);
                    $('.choseon').removeClass('choseon');
                    $this.hide().siblings('#back').show().siblings('#addok').hide();
                    // 取消删除时
                } else if (id === 'deleteCancle') {
                    that.btnShow();
                    $('.dele_point').removeClass('press_on').hide();
                    $this.hide().siblings('#back').show();
                    // 取消移动时
                } else if (id === 'moveCancel') {
                    that.btnShow();
                    $this.hide().siblings('#back').show().siblings('#moveok').hide();
                    that.setCanMove(!1);
                    $.ajax({
                        url: that.ajaxDataUrl,
                        type: 'GET',
                        dataType: 'json'
                    }).done(function (data) {
                        that.map.drawMarkers(data, !0);
                        that.canNotData = null;
                    });

                    // 确定添加时
                } else if (id === 'addok') {
                    that.setCanMove(!1);
                    // 确定按钮绑定事件: 批量保存已经发生改变的坐标,已经商讨好数据格式
                    if (!canAdd) {
                        that.msg({first: '标点失败！', second: '请填写"楼栋名称"'}, 'addNoName');
                        that.setCanMove(!1, true);
                        return false;
                    }
                    var newMarker = that.map.markerManager.markers[that.map.markerManager.markers.length - 1];
                    var addDongid = $('.bluelable').attr('data-dongid');
                    var addData = {
                        newcode: vars.total_newcode,
                        user: vars.total_user,
                        data: [{dongid: addDongid, x: newMarker.getPosition().lng, y: newMarker.getPosition().lat}]
                    };
                    $.ajax({
                        url: that.operationUrl,
                        type: 'POST',
                        data: {postData: JSON.stringify(addData)}
                    }).done(function (data) {
                        // data.result=1时成功  0时失败
                        if (data.result === '1') {
                            that.btnShow();
                            that.msg({first: '标点成功！'}, 'success');
                            // 当前楼栋高亮
                            var cls = data.data[0].dongid === vars.markid ? 'yellewlable' : 'redlable';
                            $('.bluelable').addClass(cls).removeClass('bluelable').children('.lable_alert').remove();
                            that.setCanMove(!1, false);
                            $this.hide().siblings('#back').show().siblings('#addCancel').hide();
                            $('.choseon').attr({class: 'forbid'});
                            // 保存后设置楼栋列表不能选择
                            var container = that.map.markerManager.markers[that.map.markerManager.markers.length - 1]._container;
                            $(container).find('.npx').attr('data-saved', 1);
                            canAdd = false;
                        } else {
                            that.msg({first: '标点失败！'}, 'fail');
                        }
                    }).fail(function () {
                        that.msg({first: '标点失败！'}, 'fail');
                    });
                    // 确定移动时
                } else if (id === 'moveok') {
                    // 若有非法移动数据则提示
                    if (that.canNotData) {
                        that.msg({first: '请先保存"' + that.canNotData + '"楼栋信息！'}, 'fail', !0);
                        return;
                    }
                    that.setCanMove(!1);
                    var moveData = that.getFinalData();
                    $.ajax({
                        url: that.operationUrl,
                        type: 'POST',
                        dataType: 'json',
                        data: {postData: JSON.stringify(moveData)}
                    }).done(function (data) {
                        // data.result=1时成功  0时失败
                        if (data.result === '1') {
                            that.btnShow();
                            that.msg({first: '移动成功！'}, 'success');
                            $this.hide().siblings('#back').show().siblings('#moveCancel').hide();
                        } else {
                            that.msg({first: '移动失败！'}, 'fail');
                        }
                    }).fail(function () {
                        that.msg({first: '移动失败！'}, 'fail');
                    });
                }
            });
        },

        // 标点添加移动时候的限制
        addDraggingListener: function (e) {
            var that = this;
            var $marker = e.target.provalue, status = $marker.status;
            if (status === '0') {
                that.canNotData = $marker.dongname;
            }
        },

        // 标点添加删除和选择楼栋事件
        addAndDelterListener: function (e, isAdd) {
            var that = this, $el = $(e.srcElement);
            if (isAdd && e.srcElement.className === 'npx' && !$el.attr('data-saved')) {
                that.loudongList.show();
            }
            if (e.srcElement.className === 'dele_point') {
                // 若状态为0,表示为不可编辑状态
                if (e.target.provalue.status === '0') {
                    that.msg({first: '请先保存"' + e.target.provalue.dongname + '"楼栋信息！'}, 'fail', !0);
                    return;
                }
                e.srcElement.className = 'dele_point press_on';
                var dongName = $(e.srcElement).parent().siblings('.lable_bg').find('.npx').text();
                that.deletePointTip.find('p').text('是否删除"' + dongName + '"的标点？');
                that.deletePointTip.show();
            }
        },
        // 改变head显示状态:三种状态 1 初始状态只有左侧返回 2 删除状态只有右侧取消按钮 3 新增状态 包含左侧取消按钮和右侧确定按钮
        setHeadState: function (type) {
            var that = this;
            $('.btn_bz').hide();
            switch (type) {
                case 1:
                    that.deleteCancle.show().siblings('a').hide();
                    break;
                case 2:
                    $('#header #moveok, #header #moveCancel').show().siblings('#back').hide();
                    break;
                case 3:
                    $('#header #addok, #header #addCancel').show().siblings('#back').hide();
                    break;
            }
        },

        // 获取移动后需要提交的数据
        getFinalData: function () {
            var that = this;
            var markers = that.map.markerManager.markers;
            var dongArr = [];
            for (var i = 0, l = markers.length; i < l; i++) {
                var dongJson = {
                    // 直接找content可能取不到
                    dongid: $(markers[i]._container).children().attr('data-dongid'),
                    x: markers[i].getPosition().lng,
                    y: markers[i].getPosition().lat
                };
                dongArr.push(dongJson);
            }
            var moveData = {newcode: vars.total_newcode, user: vars.total_user, data: dongArr};
            return moveData;
        },

        // 设置是否可以拖动
        setCanMove: function (canMove, isAdd) {
            var that = this, markers = that.map.markerManager.markers;
            var l = markers.length;
            if (canMove) {
                if (isAdd) {
                    markers[l - 1].enableDragging();
                } else {
                    markers.forEach(function (el) {
                        el.enableDragging();
                    });
                }
            } else {
                if (isAdd) {
                    markers[l - 1].disableDragging();
                } else {
                    markers.forEach(function (el) {
                        el.disableDragging();
                    });
                }
            }
        }
    };
    SFMap.init();
    module.exports = SFMap;
});