/**
 * @Author: chenshaoshan
 * @Date:   2016/01/13
 * @description: 年终富豪榜查房价活动
 * @Last Modified by:   chenshaoshan
 * @Last Modified time:
 */
$(function () {
    'use strict';
    // 小区输入框
    var $areaInput = $('.area_input_js');
    // 小区id号
    var $areaIdInput = $('.area_id_js');
    // 小区下拉框
    var $areaSelectUl = $('.area_select_js');
    var $priceAlert = $('.page2_alert');
    // 小区类型  常用
    var purposestr = encodeURIComponent('住宅');
    // 朝向
    var $directSelectUl = $('#directselect');
    // 城市简称
    var jcCity = $('.city_js').val();
    // -------------------------------------------------------------------------
    $areaInput.on('input', function () {
        $areaIdInput.val('');
        $directSelectUl.hide();
        setTimeout(function () {
            getLoupanByWorld();
        }, 2);
    });

    $('.area_select_js').on('click', '.area_select_js li', function () {
        $areaSelectUl.hide();
        $areaInput.val($(this).html());
        $areaIdInput.val($(this).attr('enname'));
    });

    $(window).on('touchstart', function (event) {
        var targetidstr = $(event.target.className).selector;
        setTimeout(function () {
            if (targetidstr.indexOf('touch_hide_js') < 0 ) {
                $directSelectUl.hide();
                $areaSelectUl.hide();
            }
        }, 3);
    });
    $('#direct').on('click', function () {
        $directSelectUl.show();
        $areaSelectUl.hide();
        /* setTimeout(function () {
            $directSelectUl.show();
        },3);*/
    });

    $('#directselect li').on('click', function () {
        $('.direct').val($(this).html());
        $('#direct').css('color', '#333');
        $directSelectUl.hide();
    });

    $('.submitBut').on('click', function () {
        revealPrice();
    });

// -------------------------------------------------------------------------
    // 根据输入字符获取对应小去列表
    function getLoupanByWorld() {
        var keyword = $areaInput.val().trim();
        // 未输入任何
        if (!keyword) {
            return;
        }
        var areaparm = {};
        areaparm.m = 'getLoupan';
        areaparm.from = '1';
        areaparm.city = jcCity;
        areaparm.purpose = purposestr;
        areaparm.keyword = encodeURIComponent(keyword);
        $.ajax({
            url: '/shopinfo.d?',
            type: 'post',
            data: areaparm,
            dataType: 'json',
            success: function (data) {
                if (!(data && data.root && data.root.items)) {
                    return;
                }
                var items = data.root.items;
                var resLiStr = '';
                var arealen = items.length;
                for (var i = 0; i < arealen; i++) {
                    resLiStr += ('<li class=\'touch_hide_js\' enname=\'' + items[i].projcode + '\'>' + items[i].projname + '</li>');
                }
                // 当确定小区唯一时 直接确定小区  防止手动输入
                $areaSelectUl.html(resLiStr);
                if (arealen === 1) {
                    $areaIdInput.val(items[0]['projcode']);
                    $areaSelectUl.hide();
                } else {
                    $areaSelectUl.show();
                }
            }
        });
    }
    // 检查查房价字段并提交表单
    function revealPrice() {
        // 小区id
        var areaInputstr = $areaInput.val();
        if (!areaInputstr) {
            $priceAlert.html('请选择小区');
            $priceAlert.show();
            return;
        }
        var areaIdstr = $areaIdInput.val();
        if (!areaIdstr) {
            $priceAlert.html('抱歉，该小区评估价不存在');
            $priceAlert.show();
            return;
        }

        // 面积
        var areaValstr = Number($('.area_val_js').val());
        if (!areaValstr) {
            $priceAlert.html('请输入建筑面积');
            $priceAlert.show();
            return;
        }
        // 建筑面积范围1至2000平米
        if (areaValstr < 1 || areaValstr > 2000) {
            $priceAlert.html('建筑面积范围1至2000平米');
            $priceAlert.show();
            return;
        }
        // 楼层
        var floorValstr = Number($('.floor_val_js').val());
        if (!floorValstr) {
            $priceAlert.html('请输入楼层');
            $priceAlert.show();
            return;
        }
        // 总楼层
        var sumFloorValstr = Number($('.sum_floor_val_js').val());
        if (!sumFloorValstr) {
            $priceAlert.html('请输入总楼层');
            $priceAlert.show();
            return;
        }
        // 总楼层必须大于楼层，请重新输入
        if (floorValstr > sumFloorValstr) {
            $priceAlert.html('总楼层必须大于楼层，请重新输入');
            $priceAlert.show();
            return;
        }
        // 当前楼层不能超过99层
        if (floorValstr > 99) {
            $priceAlert.html('当前楼层不能超过99层,请重新输入');
            $priceAlert.show();
            return;
        }
        // 当前楼层不能超过99层
        if (floorValstr < 1) {
            $priceAlert.html('楼层应在1~99之间，请重新输入');
            $priceAlert.show();
            return;
        }

        $('.page2_form').submit();
    }

});

