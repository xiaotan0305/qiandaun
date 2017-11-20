/**
 * @file Housing information
 * @author 单量
 * @version 20160303
 */
define('', ['jquery'], function (require) {
    'use strict';
    var $ = require('jquery');
    // 提示框浮层
    var alertboxBg = $('.alertbox_bg');
    // 解决输入键盘遮盖问题
    function oGetHeight() {
        var winHeight = $(window).height();
        $('.wrap').css({height: winHeight, position: 'static'});
        $('.tc-bg').css('height', winHeight);
    }
    oGetHeight();
    $(window).resize(function () {
        oGetHeight();
    });
    // 有浮层时，屏蔽被遮盖的页面的滑动
    var canmove = true;
    //$('body').on('touchstart', function () {
    //    if (!canmove) {
    //        $('.mpt').on('touchmove', function (e) {
    //            e.preventDefault();
    //        });
    //    } else {
    //        $('.mpt').off('touchmove');
    //    }
    //});

    /**
     * 切换小区页面
     */
    // 初始化数据
    var geox = 0;
    var geoy = 0;
    var thisCity = '';
    // 没信号的标示
    var errorSign = $('.error-no-sign');
    // 不存在房源的标示
    var errorExist = $('.error-no-exist');

    function doAJax() {
        $('#count').html('3公里内共0个小区');
        errorSign.hide();
        errorExist.hide();
        $('#listinfo').html('').hide();
        // 判断是否定位成功
        if (geox && geoy) {
            $.ajax({
                url: '/huodongAC.d?m=getLoction&class=EntryhouseHc&geox=' + geox + '&geoy=' + geoy + '&user=' + user,
                success: function (data) {
                    var jsonData = $.parseJSON(data);
                    var detailData = $.parseJSON(decodeURIComponent(jsonData.root.fangInfo));
                    thisCity = encodeURIComponent(encodeURIComponent(jsonData.root.city));
                    $('#count').html('3公里内共' + jsonData.root.count + '个小区');
                    // 没数据则显示没房源
                    if (detailData === '') {
                        errorExist.show();
                        return false;
                    }
                    // 生成下方内容
                    var html = '';
                    for (var i = 0; i < detailData.length; i++) {
                        html += '<li class="clearfix">';
                        html += '<em class="' + detailData[i].status + '"></em>';
                        // 根据返回的信息判断具体内容
                        if (detailData[i].status !== 'normal') {
                            html += '<a href="/huodongAC.d?m=getDongInfo&class=EntryhouseHc&newcode=' + detailData[i].newcode
                                + '&city=' + thisCity + '" class="btn-gray fr" data-newCode="' + detailData[i].newcode + '">查看</a>';
                        } else {
                            html += '<a href="/huodongAC.d?m=getDongInfo&class=EntryhouseHc&newcode=' + detailData[i].newcode
                                + '&city=' + thisCity + '" class="btn-red fr" data-newCode="' + detailData[i].newcode + '">';
                            html += '认领楼栋';
                            html += '</a>';
                        }
                        html += '<span class="No-meter fr mr05 gray9">' + detailData[i].distance + 'm</span>';
                        // 根据返回的信息判断具体样式
                        if (detailData[i].status === 'icon_other_done' || detailData[i].status === 'icon_key_gray') {
                            html += '<span class="fl gray9 fgw02">' + detailData[i].projName;
                            if (detailData[i].nickname !== '') {
                                html += '(<font class="gray9">' + detailData[i].nickname + '</font>)';
                            }
                            html += '</span>';
                        } else {
                            html += '<span class="fl gray3 fgw02">' + detailData[i].projName;
                            if (detailData[i].nickname !== '') {
                                html += '(<font class="gray9">' + detailData[i].nickname + '</font>)';
                            }
                            html += '</span>';
                        }
                        html += '</li>';
                    }
                    $('#listinfo').html(html).show();
                }
            });
        } else {
            errorSign.show();
        }
    }
    // 获取坐标的方法
    if (window.BMap) {
        var geolocation = new BMap.Geolocation();
        geolocation.getCurrentPosition(function (position) {
            geox = position.latitude;
            geoy = position.longitude;
            // 重新定位
            var refreshDom = $('.btn_refresh');
            if (refreshDom.length > 0) {
                doAJax();
                refreshDom.on('click', function () {
                    doAJax();
                });
            }
        }, function (error) {
            console.log(error);
        }, {
            timeout: 10000,
            maximumAge: 60000,
            enableHighAccuracy: true
        });
    }
    // 开始录入按钮事件
    $('.click_input').on('click', function () {
        var newcode = $(this).attr('data-newcode');
        thisCity = encodeURIComponent(encodeURIComponent($(this).attr('data-city')));
        location.href = '/huodongAC.d?m=inputMes&class=EntryhouseHc&newcode=' + newcode + '&city=' + thisCity;
    });

    /**
     * 认领楼栋页面
     */
    // 从这个页面开始的大多数newcode都是这样获取的，user,city也是
    var claimNewcode = $('#total_newcode').val();
    var user = $('#total_user').val();
    thisCity = $('#total_city').val();
    // 点击时上锁，ajax处理完解锁
    var isLock = false;
    // 认领等按钮的事件绑定
    $('#claim_list').on('click', 'a', function () {
        if (isLock) {
            return false;
        }
        isLock = true;
        var $this = $(this);
        var dongNum = 0;
        // 由于对父dom操作频繁所以提出
        var thisFather = $this.parent();
        var claimStatus = thisFather.find('em').attr('class');
        var dongid = $this.attr('data-dongid');
        // 如果是灰色的字样，则弹出提示，2S后自动消失
        if (claimStatus === 'icon_key_gray' || claimStatus === 'icon_other_done' || claimStatus === 'icon_other_renling' || claimStatus === 'icon_mwait') {
            $this.parent().find('.alert-infor-text').show();
            var alertHide = setTimeout(function () {
                $this.parent().find('.alert-infor-text').hide();
                clearTimeout(alertHide);
            }, 2000);
            isLock = false;
            return false;
        }
        if (claimStatus === 'icon_key_red') {
            // 如果是红色字样，且是可认领
            $.ajax({
                url: '/huodongAC.d?m=cancelStatues&class=EntryhouseHc&city=' + encodeURIComponent(encodeURIComponent(thisCity))
                + '&newcode=' + claimNewcode + '&dongid=' + dongid + '&user=' + user,
                success: function (data) {
                    var jsonData = $.parseJSON(data);
                    if (jsonData.root.result === '0') {
                        alertboxBg.show().find('.alertcnt').html(jsonData.root.message);
                    } else {
                        dongNum = parseInt($('.preDongNum').html());
                        $('.preDongNum').html(dongNum - 1);
                        thisFather.find('em').attr('class', 'normal');
                        thisFather.find('.lasttime').remove();
                        thisFather.find('.btn-red').html('认领');
                    }
                    isLock = false;
                }
            });
        } else if (claimStatus === 'normal') {
            // 如果是红色字样，且是认领
            $.ajax({
                url: '/huodongAC.d?m=confirmStatues&class=EntryhouseHc&city=' + encodeURIComponent(encodeURIComponent(thisCity))
                + '&newcode=' + claimNewcode + '&dongid=' + dongid + '&user=' + user,
                success: function (data) {
                    var jsonData = $.parseJSON(data);
                    if (jsonData.root.result === '0') {
                        alertboxBg.show().find('.alertcnt').html(jsonData.root.message);
                    } else {
                        dongNum = parseInt($('.preDongNum').html());
                        $('.preDongNum').html(dongNum + 1);
                        thisFather.find('em').attr('class', 'icon_key_red');
                        thisFather.append('<div class="fr lasttime mr05">剩余48小时</div>');
                        thisFather.find('.btn-red').html('已认领');
                    }
                    isLock = false;
                }
            });
        }
    });

    // 显示全部楼栋还是可录入楼栋的筛选
    $('#claim_select').on('change', function () {
        var select = 0;
        if ($(this).find('option:selected').attr('select') === 'all') {
            select = 0;
        } else {
            select = 1;
        }
        $('.seltxt').html($(this).find('option:selected').html());
        $.ajax({
            url: '/huodongAC.d?m=checkDongInfo&class=EntryhouseHc&city=' + encodeURIComponent(encodeURIComponent(thisCity))
            + '&newcode=' + claimNewcode + '&select=' + select + '&user=' + user,
            success: function (data) {
                var html = '';
                var jsonData = $.parseJSON(data);
                // 如果没有数据，则进行以下操作
                if (decodeURIComponent(jsonData.root.dong) === ']') {
                    $('#claim_list').find('ul').html(html);
                    return false;
                }
                // 有数据的dom插入
                var dongData = $.parseJSON(decodeURIComponent(jsonData.root.dong));
                for (var i = 0; i < dongData.length; i++) {
                    html += '<li class="clearfix">';
                    html += '<em class="' + dongData[i].claimstatus + '"></em>';
                    if (dongData[i].claimstatus === 'icon_key_gray') {
                        html += '<a href="javascript:;" class="btn-gray fr" data-dongid="' + dongData[i].id + '">已认领</a>';
                    } else if (dongData[i].claimstatus === 'icon_other_done') {
                        html += '<a href="javascript:;" class="btn-gray fr" data-dongid="' + dongData[i].id + '">已完成</a>';
                    } else if (dongData[i].claimstatus === 'icon_key_red') {
                        html += '<a href="javascript:;" class="btn-red fr" data-dongid="' + dongData[i].id + '">已认领</a>';
                    } else if (dongData[i].claimstatus === 'icon_other_renling') {
                        html += '<a href="javascript:;" class="btn-red fr" data-dongid="' + dongData[i].id + '">已完成</a>';
                    } else {
                        html += '<a href="javascript:;" class="btn-red fr" data-dongid="' + dongData[i].id + '">认领</a>';
                    }
                    if (dongData[i].claimstatus === 'normal') {
                        html += '<span class="fl gray3 fgw01">' + dongData[i].dongname + '&nbsp;</span>';
                        html += '<span class="fl gray3">' + dongData[i].unitcount + '个单元</span>';
                    } else {
                        html += '<span class="fl gray9 fgw01">' + dongData[i].dongname + '&nbsp;</span>';
                        html += '<span class="fl gray9">' + dongData[i].unitcount + '个单元</span>';
                    }
                    if (dongData[i].claimstatus === 'icon_key_gray') {
                        html += '<div class="alert-infor-text" style="display: none;">他人已认领</div>';
                    } else if (dongData[i].surplustime !== '0') {
                        html += '<div class="fr lasttime mr05">' + dongData[i].surplustime + '</div>';
                    }
                    html += '</li>';
                }
                $('#claim_list').find('ul').html(html);
            }
        });
    });
    // 点击开始录入的跳转
    $('.input_start').on('click', function () {
        // 通过获取弹出框dom，来确定是哪个页面,alertboxBg只有认领楼栋页面存在
        if (!alertboxBg) {
            claimNewcode = $(this).attr('data-newcode');
            thisCity = $(this).attr('data-city');
        }
        if (!$('#claim_list').find('em').hasClass('icon_key_red') || !$('#claim_list').find('li').length) {
            alertboxBg.find('.alertcnt').html('请认领该小区下的楼栋');
            alertboxBg.show();
            return false;
        }
        location.href = '/huodongAC.d?m=inputMes&class=EntryhouseHc&newcode=' + claimNewcode + '&city=' + encodeURIComponent(encodeURIComponent(thisCity));
    });
    // 点击查看的跳转
    $('.input_watch').on('click', function () {
        var claimNewcode = $(this).attr('data-newcode');
        var thisCity = $(this).attr('data-city');
        location.href = '/huodongAC.d?m=getDongInfo&class=EntryhouseHc&newcode=' + claimNewcode + '&city=' + encodeURIComponent(encodeURIComponent(thisCity));
    });

    /**
     * 楼栋列表
     */
   // 楼栋列表的浮层点击显示二级浮层
    $('#basicList').on('click', 'li', function () {
        canmove = false;
        var thisDom = $(this).attr('class');
        if (thisDom === 'basicProperty') {
            $('.propertyList').show();
        } else if (thisDom === 'basicBtype') {
            $('.bTypeList').show();
        } else if (thisDom === 'basicBtime') {
            $('.bTimeList').show();
            // 自动滑动到1995，原本是1960年，所以是li的高度乘以35/(ㄒoㄒ)/~~
            $('.optionbox').eq(3).scrollTop($('.optionbox').eq(3).find('li').outerHeight(true) * 35);
        } else if (thisDom === 'basicRights') {
            $('.rightsList').show();
        } else if (thisDom === 'basicSpecial') {
            $('.specialList').show();
        } else if (thisDom === 'basicTowards') {
            $('.towardList').show();
        }
    });
    $('.bulid-location').on('click', 'a', function () {
        location.href = '/huodongAC.d?m=getUserInfo&class=EntryhouseHc';
    });
    // 存储楼栋基础信息
    var status = '';
    $('.propertyList').on('click', 'li', function () {
        var basicTypeTxt = $('.basicBtype').find('.chtxt').html();
        if ($(this).find('a').hasClass('bieshu')) {
            if (basicTypeTxt === '板楼' || basicTypeTxt === '塔楼' || basicTypeTxt === '砖楼' || basicTypeTxt === '板塔结合') {
                $('.basicBtype').find('.chtxt').html('请选择');
            }
            $('.bTypeList').find('.optionlist01').hide();
            $('.bTypeList').find('.optionlist02').show();
        } else {
            if (basicTypeTxt === '独栋' || basicTypeTxt === '联排' || basicTypeTxt === '双拼' || basicTypeTxt === '叠拼') {
                $('.basicBtype').find('.chtxt').html('请选择');
            }
            $('.bTypeList').find('.optionlist01').show();
            $('.bTypeList').find('.optionlist02').hide();
        }
        status = $(this).find('a').html();
        $('.basicProperty').find('.chtxt').html(status);
        $('.second-bg').hide();
        canmove = true;
    });
    $('.bTypeList').on('click', 'li', function () {
        status = $(this).find('a').html();
        $('.basicBtype').find('.chtxt').html(status);
        $('.second-bg').hide();
        canmove = true;
    });
    $('.bTimeList').on('click', 'li', function () {
        status = $(this).find('a').html();
        $('.basicBtime').find('.chtxt').html(status);
        $('.second-bg').hide();
        canmove = true;
    });
    $('.rightsList').on('click', 'li', function () {
        status = $(this).find('a').html();
        $('.basicRights').find('.chtxt').html(status);
        $('.second-bg').hide();
        canmove = true;
    });
    $('.specialList').on('click', 'li', function () {
        status = $(this).find('a').html();
        $('.basicSpecial').find('.chtxt').html(status);
        $('.second-bg').hide();
        canmove = true;
    });
    $('.towardList').on('click', 'li', function () {
        status = $(this).find('a').html();
        $('.basicTowards').find('.chtxt').html(status);
        $('.second-bg').hide();
        canmove = true;
    });
    // 确定按钮绑定事件
    $('.btn-sure').on('click', function () {
        var bPropertyVal = $('.basicProperty').find('.chtxt').html();
        var bTypeVal = $('.basicBtype').find('.chtxt').html();
        var bTimeVal = $('.basicBtime').find('.chtxt').html();
        var bRightsVal = $('.basicRights').find('.chtxt').html();
        var bSpecialVal = $('.basicSpecial').find('.chtxt').html();
        var bTowardVal = $('.basicTowards').find('.chtxt').html();
        var dongid = $('.banpage').find('.tabnav-left').find('.current').attr('data-dongid');
        var $this = $(this);
        // 如果没把数据填完全，则弹出信息
        if (bPropertyVal === '请选择' || bRightsVal === '请选择' || bSpecialVal === '请选择' || bTowardVal === '请选择' || bTimeVal === '请选择') {
            alert('所有指标均需要填写！');
            return false;
        }
        $.ajax({
            type: 'POST',
            url: '/huodongAC.d?m=getBaseInfo&class=EntryhouseHc' + '&user=' + user,
            data: {
                city: encodeURIComponent(thisCity),
                newcode: claimNewcode,
                dongid: dongid,
                operastion: encodeURIComponent(bPropertyVal),
                buildcategory: encodeURIComponent(bTypeVal),
                buildage: encodeURIComponent(bTimeVal),
                property: encodeURIComponent(bRightsVal),
                sight: encodeURIComponent(bSpecialVal),
                towardstreet: encodeURIComponent(bTowardVal)
            },
            dataType: 'json',
            success: function () {
                $('.chooseOrSave').find('.chtxt').html('已保存');
                $this.parents().find('.tc-bg').hide();
                canmove = true;
            }
        });
    });
    var leftTab = $('.banpage').find('.tabnav-left');
    // 请选择的详情列表弹出，如果楼层已完成或者审核中，则无法点击
    $('.chooseOrSave').on('click', '.chtxt', function () {
        if (leftTab.find('.current').hasClass('finished') || leftTab.find('.current').hasClass('wait')
            || leftTab.find('.current').find('em').hasClass('icon_check')) {
            alert('楼栋信息已完成或审核中，不可查看！');
        } else {
            canmove = false;
            $('.basic').show();
        }
    });
    var dongid = '';
    // 左侧切楼栋时的页面生成
    leftTab.on('click', 'li', function () {
        dongid = $(this).attr('data-dongid');
        var $this = $(this);
        $.ajax({
            url: '/huodongAC.d?m=getUnit&class=EntryhouseHc&city=' + encodeURIComponent(encodeURIComponent(thisCity))
            + '&newcode=' + claimNewcode + '&dongid=' + dongid + '&user=' + user,
            success: function (data) {
                leftTab.find('li').removeClass('current');
                $this.addClass('current');
                var jsonData = $.parseJSON(data);
                var unitsData = $.parseJSON(decodeURIComponent(jsonData.root.units));
                var infoData = $.parseJSON(decodeURIComponent(jsonData.root.claimDong));
                var html = '';
                // 循环数据
                for (var i = 0; i < unitsData.length; i++) {
                    html += '<li class="clearfix ' + unitsData[i].status + '">';
                    html += '<span class="fr iconbox" data-unitid="' + unitsData[i].id + '"></span>';
                    html += '<span class="fl index-txt">' + unitsData[i].unitname + '&nbsp;' + unitsData[i].room_count + '户/标准层</span>';
                    html += '</li>';
                }
                // 详情页的内容
                if (infoData[0].status !== '未填写') {
                    $('.basicProperty').find('.chtxt').html(infoData.operastion);
                    $('.basicBtype').find('.chtxt').html(infoData.buildcategory);
                    $('.basicBtime').find('.chtxt').html(infoData.buildage);
                    $('.basicRights').find('.chtxt').html(infoData.property);
                    $('.basicSpecial').find('.chtxt').html(infoData.sight);
                    $('.basicTowards').find('.chtxt').html(infoData.towardStreet);
                    $('.chooseOrSave').find('.chtxt').html('已保存');
                } else {
                    $('.basicProperty').find('.chtxt').html('请选择');
                    $('.basicBtype').find('.chtxt').html('请选择');
                    $('.basicBtime').find('.chtxt').html('请选择');
                    $('.basicRights').find('.chtxt').html('请选择');
                    $('.basicSpecial').find('.chtxt').html('请选择');
                    $('.basicTowards').find('.chtxt').html('请选择');
                    $('.chooseOrSave').find('.chtxt').html('请选择');
                }
                // 按钮的不同内容
                if (jsonData.root.checkStuts === 'done') {
                    $('.check_audit').html('<em class="icon_done"></em>已完成');
                } else if (jsonData.root.checkStuts === 'doing') {
                    $('.check_audit').html('<em class="icon_check"></em>审核中');
                } else if (jsonData.root.checkStuts === 'do') {
                    $('.check_audit').html('<em class="icon_reserve"></em>提交');
                }
                $('.banpage').find('.infor-part').find('ul').html(html);
            }
        });
    });
    // 跳转到输入页面
    $('.banpage').on('click', '.iconbox', function () {
        // 如果前边有锁，那么对号可以点击。其他任何时候，可输入的都可点击
        if ($(this).parent().hasClass('cndt02') || $(this).parent().hasClass('cndt03') && $(this).parents().find('.current').hasClass('claim')) {
            dongid = leftTab.find('.current').attr('data-dongid');
            var unitid = $(this).attr('data-unitid');
            location.href = '/huodongAC.d?m=getFloorInfo&class=EntryhouseHc&city=' + encodeURIComponent(encodeURIComponent(thisCity))
                + '&newcode=' + claimNewcode + '&dongid=' + dongid + '&unitid=' + unitid;
        } else {
            alert('楼栋信息已完成或审核中，不可查看！');
        }
    });
    // 审核按钮绑定事件
    $('.check_audit').on('click', function () {
        if ($('.icon_reserve').length < 1) {
            return false;
        }
        var $this = $(this);
        dongid = leftTab.find('.current').attr('data-dongid');
        $.ajax({
            url: '/huodongAC.d?m=submitDong&class=EntryhouseHc&city=' + encodeURIComponent(encodeURIComponent(thisCity))
            + '&newcode=' + claimNewcode + '&dongid=' + dongid + '&user=' + user,
            success: function (data) {
                var jsonData = $.parseJSON(data);
                if (jsonData.root.result === '1') {
                    $this.parents().find('.current').attr('class', 'current wait');
                    $('.check_audit').html('<em class="icon_check"></em>审核中');
                } else {
                    alert(jsonData.root.message);
                }
            }
        });
    });

    /**
     * 录入单元户信息
     */
    // 存储当前点击的是哪一个楼栋
    var listId = '';
    var specialDom = $('.special');
    // 录入信息的每条信息详情浮层显示
    specialDom.on('click', '.housetype', function () {
        if ($('.current').attr('isFinished') === 'true') {
            return false;
        }
        listId = $(this).parent().attr('data-id');
        canmove = false;
        $('.typelist').show();
    });
    specialDom.on('click', '.towardstype', function () {
        if ($('.current').attr('isFinished') === 'true') {
            return false;
        }
        listId = $(this).parent().attr('data-id');
        canmove = false;
        $('.towardslist').show();
    });
    specialDom.on('click', '.bTypetype', function () {
        if ($('.current').attr('isFinished') === 'true') {
            return false;
        }
        listId = $(this).parent().attr('data-id');
        canmove = false;
        $('.bTypelist').show();
    });
    specialDom.on('click', '.lift', function () {
        if ($('.current').attr('isFinished') === 'true') {
            return false;
        }
        canmove = false;
        $('.liftlist').show();
    });
    // input限制数字切小数点后两位
    var regG = /^\d+(\.\d{0,2})?$/;
    var reg = /\d+(\.\d{0,2})?/g;
    specialDom.on('input', '.areatype input', function () {
        // $(this).val(parseFloat($(this).val().replace(/\.|\D/gi,"")).toFixed(2));
        var me = $(this),
            text = me.val(),
            num = parseFloat(text);
        if (!regG.test(text)) {
            num = text.match(reg) ? parseFloat(text.match(reg)[0]) : '';
            me.val(num);
        }
        me.parent().find('span').html(num);
    });
    // 卧室信息
    var roomNum = $('.room_num');
    var roomNumList = roomNum.find('.Numlist');
    var roomVal = roomNum.find('.num-txt').html();
    roomNumList.on('click', 'a', function () {
        roomNumList.find('a').removeClass('on');
        $(this).addClass('on');
        roomVal = $(this).html();
        roomNum.find('.num-txt').html(roomVal);
    });
    // 客厅信息
    var saloonNum = $('.saloon_num');
    var saloonNumList = saloonNum.find('.Numlist');
    var saloonVal = saloonNum.find('.num-txt').html();
    saloonNumList.on('click', 'a', function () {
        saloonNumList.find('a').removeClass('on');
        $(this).addClass('on');
        saloonVal = $(this).html();
        saloonNum.find('.num-txt').html(saloonVal);
    });
    // 厨房信息
    var kitchenNum = $('.kitchen_num');
    var kitchenNumList = kitchenNum.find('.Numlist');
    var kitchenVal = kitchenNum.find('.num-txt').html();
    kitchenNumList.on('click', 'a', function () {
        kitchenNumList.find('a').removeClass('on');
        $(this).addClass('on');
        kitchenVal = $(this).html();
        kitchenNum.find('.num-txt').html(kitchenVal);
    });
    // 卫生间信息
    var toiletNum = $('.toilet_num');
    var toiletNumList = toiletNum.find('.Numlist');
    var toiletVal = toiletNum.find('.num-txt').html();
    toiletNumList.on('click', 'a', function () {
        toiletNumList.find('a').removeClass('on');
        $(this).addClass('on');
        toiletVal = $(this).html();
        toiletNum.find('.num-txt').html(toiletVal);
    });
    // 总计信息
    var totalVal = '';
    $('.choosebox').find('.btsure').on('click', function () {
        totalVal = roomVal + saloonVal + kitchenVal + toiletVal;
        // 不为空时再进行替换
        if (totalVal !== '') {
            $('[data-id="' + listId + '"]').find('.housetype').find('.fr').attr('class', 'fr index-infor').html(totalVal);
        }
    });
    // 朝向信息
    var towerdsVal = '';
    $('.towardsInput').on('click', 'li', function () {
        towerdsVal = $(this).html();
        $('[data-id="' + listId + '"]').find('.towardstype').find('.fr').attr('class', 'fr index-infor').html(towerdsVal);
        $('.towardslist').hide();
        canmove = true;
    });
    // 建筑形式信息
    var bTypelistVal = '';
    $('.bTypeInput').on('click', 'li', function () {
        bTypelistVal = $(this).html();
        $('[data-id="' + listId + '"]').find('.bTypetype').find('.fr').attr('class', 'fr index-infor').html(bTypelistVal);
        $('.bTypelist').hide();
        canmove = true;
    });
    // 电梯信息
    var liftlistVal = $('.lift').find('.index-infor').html();
    $('.elevatorInput').on('click', 'li', function () {
        liftlistVal = $(this).html();
        $('.lift').find('.fr').attr('class', 'fr index-infor').html(liftlistVal);
        $('.liftlist').hide();
        canmove = true;
    });
    // 保存按钮的绑定事件
    $('.inputPage').on('click', '.inputsave', function () {
        var i;
        // 是否全部填写完全,只弹出一次
        var isOver = true;
        if ($('.lift').find('.index-infor').html() === undefined) {
            alert('请输入电梯信息');
            return false;
        }
        for (i = 0; i < $('.housetype').length; i++) {
            if ($($('.housetype')[i]).find('.index-infor').html() === undefined || $($('.towardstype')[i]).find('.index-infor').html() === undefined
                || $($('.fg_input')[i]).val() === '' || $($('.bTypetype')[i]).find('.index-infor').html() === undefined) {
                if (isOver) {
                    isOver = false;
                    alert('已保存，请继续填写！');
                }
            }
        }
        if (parseInt(specialDom.find('.inputDownNum').find('option:selected').attr('data-index')) < parseInt(specialDom.find('.inputTopNum').find('option:selected').attr('data-index'))) {
            alert('截止楼层需≥起始楼层！');
            return false;
        }
        var postFor = '';
        var postData = {};
        var postIndex = '';
        $('.loading_dom').show();
        // 如果是新建标准层，走另外一个ajax请求
        if ($('#isNewInfo').val()) {
            var dongid = $('#to_dongid').val();
            var unitid = $('#to_unitid').val();
            postFor = specialDom.find('.inputTopNum').find('.seltxt').html() + '-' + specialDom.find('.inputDownNum').find('.seltxt').html();
            // 电梯参数
            postData = {
                1: {
                    elevator_number: liftlistVal.replace(/[^0-9]/ig, ''),
                    for: postFor
                }
            };
            // 所有的参数
            for (i = 0; i < $('.housetype').length; i++) {
                postIndex = $($('.housetype')[i]).parent().parent().parent().find('.num_floor').html().replace(/房号<br>/, "");
                postData['1'][postIndex] = {
                    stcw: $($('.housetype')[i]).find('.index-infor').html(),
                    towards: $(specialDom.find('.towardstype')[i]).find('.index-infor').html(),
                    buildarea: $($('.areatype')[i]).find('.fg_input').val(),
                    buildStyle: $(specialDom.find('.bTypetype')[i]).find('.index-infor').html()
                };
            }
            $.ajax({
                type: 'POST',
                url: '/huodongAC.d?m=inputNewMsg&class=EntryhouseHc&city=' + encodeURIComponent(encodeURIComponent(thisCity))
                + '&dongid=' + dongid + '&unitid=' + unitid + '&newcode=' + claimNewcode + '&user=' + user,
                data: {dataDetail: JSON.stringify(postData)},
                dataType: 'json',
                success: function (data) {
                    if (data.root.result === '0') {
                        $('.loading_dom').hide();
                        alert(data.root.message);
                        return false;
                    }
                    if (isOver) {
                        $('.infor_forlift').find('li').hide();
                        $('.infor_forlift').find('.index-infor').html(postFor + '层');
                        $('.infor_forlift').find('.index-infor').parent().show();
                        $('.inputsave').html('<em class="icon_modify"></em>修改').removeClass('inputsave').addClass('inputedit');
                        $('.current').addClass('finished').attr('isFinished', 'true');
                        $('.areatype').find('.area_span').show();
                        $('.areatype').find('input').hide();
                    }
                    location.reload();
                }
            });
        } else {
            var id = $('.inputPage').find('.tabnav-left').find('.current').attr('data-id');
            postFor = specialDom.find('.inputTopNum').find('.seltxt').html() + '-' + specialDom.find('.inputDownNum').find('.seltxt').html();
            // 电梯参数
            postData = {
                1: {
                    elevator_number: liftlistVal.replace(/[^0-9]/ig, ''),
                    for: postFor
                }
            };
            // 所有参数
            for (i = 0; i < $('.housetype').length; i++) {
                postIndex = $($('.housetype')[i]).parent().parent().parent().find('.num_floor').html().replace(/房号<br>/, "");
                postData['1'][postIndex] = {
                    stcw: $($('.housetype')[i]).find('.index-infor').html(),
                    towards: $(specialDom.find('.towardstype')[i]).find('.index-infor').html(),
                    buildarea: $($('.areatype')[i]).find('.fg_input').val(),
                    buildStyle: $(specialDom.find('.bTypetype')[i]).find('.index-infor').html()
                };
            }
            $.ajax({
                type: 'POST',
                url: '/huodongAC.d?m=inputMsg&class=EntryhouseHc&city=' + encodeURIComponent(encodeURIComponent(thisCity)) + '&id=' + id + '&user=' + user,
                data: {dataDetail: JSON.stringify(postData)},
                dataType: 'json',
                success: function (data) {
                    if (data.root.result === '0') {
                        $('.loading_dom').hide();
                        alert(data.root.message);
                        return false;
                    }
                    if (isOver) {
                        $('.infor_forlift').find('li').hide();
                        $('.infor_forlift').find('.index-infor').html(postFor + '层');
                        $('.infor_forlift').find('.index-infor').parent().show();
                        $('.inputsave').html('<em class="icon_modify"></em>修改').removeClass('inputsave').addClass('inputedit');
                        $('.current').addClass('finished').attr('isFinished', 'true');
                        $('.areatype').find('.area_span').show();
                        $('.areatype').find('input').hide();
                    }
                    $('.loading_dom').hide();
                    if ($('.inputDownNum').find('.seltxt').html() === $('#total_foralltop').val()
                        && $('.inputTopNum').find('.seltxt').html() === $('#total_foralldown').val()) {
                        if (confirm($('#total_foralldown').val() + '-' + $('#total_foralltop').val() + '层保存成功！')) {
                            location.reload();
                        } else {
                            location.reload();
                        }
                    }
                }
            });
        }
    });
    // 编辑按钮的绑定事件，需要做的操作
    $('.inputPage').on('click', '.inputedit', function () {
        specialDom.find('.infor_forlift').find('li').hide();
        specialDom.find('.inputDownNum').parent().show();
        $('.icon_fkinfor').parent().show();
        $('.inputedit').html('<em class="icon_reserve"></em>保存').removeClass('inputedit').addClass('inputsave');
        $('.current').attr('isFinished', 'false');
        $('.areatype').find('.area_span').hide();
        $('.areatype').find('input').show();
    });
    // 复制层信息
    var fromUnitid = $('.from_unitid');
    // 选择要复制到的层和单元信息时进行的操作
    $('.from_dongid').on('change', 'select', function () {
        var optionVal = $(this).find('option:selected').html();
        $(this).parent().find('.seltxt').html(optionVal);
        fromUnitid.find('.seltxt').html('单元');
        if (optionVal === '楼栋') {
            var html = '';
            html += '<option>单元</option>';
            fromUnitid.find('select').html(html);
            return false;
        }
        var dongid = $(this).find('option:selected').attr('data-id');
        $.ajax({
            url: '/huodongAC.d?m=getUnitNum&class=EntryhouseHc&city=' + encodeURIComponent(encodeURIComponent(thisCity))
            + '&newcode=' + claimNewcode + '&dongid=' + dongid + '&user=' + user,
            success: function (data) {
                var jsonData = $.parseJSON(data);
                var dongData = $.parseJSON(decodeURIComponent(jsonData.root.dong));
                var html = '';
                html += '<option>单元</option>';
                for (var i = 0; i < dongData.length; i++) {
                    html += '<option data-id="' + dongData[i].unitid + '">' + dongData[i].unitname + '</option>';
                }
                fromUnitid.find('select').html(html);
            }
        });
    });
    fromUnitid.on('change', 'select', function () {
        var optionVal = $(this).find('option:selected').html();
        $(this).parent().find('.seltxt').html(optionVal);
    });
    // 复制功能
    $('.copyBtn').on('click', function () {
        var fromdongid = $('.from_dongid').find('option:selected').attr('data-id');
        var fromunitid = fromUnitid.find('option:selected').attr('data-id');
        var todongid = $('#to_dongid').val();
        var tounitid = $('#to_unitid').val();
        if (fromdongid === 'undefined' || fromunitid === 'undefined') {
            alert('请选择具体单元');
            return false;
        }
        $.ajax({
            url: '/huodongAC.d?m=copyUnit&class=EntryhouseHc&city=' + encodeURIComponent(encodeURIComponent(thisCity)) + '&newcode=' + claimNewcode
            + '&fromdongid=' + fromdongid + '&fromunitid=' + fromunitid + '&todongid=' + todongid + '&tounitid=' + tounitid + '&user=' + user,
            success: function (data) {
                var jsonData = $.parseJSON(data);
                alert(jsonData.root.message);
                if (jsonData.root.result !== '0') {
                    location.reload();
                }
            }
        });
    });
    // 切换不同单元时要进行的操作
    $('.inputPage').find('.tabnav-left').on('click', 'li', function () {
        var dongid = $('#to_dongid').val();
        var unitid = $('#to_unitid').val();
        var $this = $(this);
        var fid = $(this).attr('data-id');
        var i;
        $('.loading_dom').show();
        $.ajax({
            url: '/huodongAC.d?m=getMsgInfo&class=EntryhouseHc&city=' + encodeURIComponent(encodeURIComponent(thisCity))
            + '&newcode=' + claimNewcode + '&dongid=' + dongid + '&unitid=' + unitid + '&fid=' + fid + '&user=' + user,
            success: function (data) {
                var top = $('#total_foralltop').val();
                var down = $('#total_foralldown').val();
                var jsonData = $.parseJSON(data);
                if (jsonData.root.id === '') {
                    alert('网络不稳定，请刷新页面！');
                    $('.loading_dom').show();
                    return false;
                }
                var tailsData = $.parseJSON(decodeURIComponent(jsonData.root.tails));
                $('.inputPage').find('li').removeClass('current');
                $this.addClass('current');
                // 电梯组成拼写
                var html = '';
                html += '<div class="infor-part clearfix">';
                html += '<div class="num_floor fl">&nbsp;</div>';
                html += '<div class="infor-listbox">';
                html += '<ul class="infor-list">';
                html += '<li class="clearfix lift">';
                html += '<a class="clearfix" href="javascript:;">';
                html += '<span class="index-txt fl">电梯数量</span>';
                if (jsonData.root.elevatornumber === '') {
                    html += '<span class="fr btn-more"></span>';
                } else {
                    html += '<span class="fr index-infor">' + jsonData.root.elevatornumber + '部</span>';
                }
                html += '</a>';
                html += '</li>';
                html += '</ul>';
                html += '</div>';
                html += '</div>';
                // 主体拼写
                for (i = 0; i < tailsData.length; i++) {
                    html += '<div class="infor-part clearfix">';
                    html += '<div class="num_floor fl">房号<br/>' + tailsData[i].tailname + '</div>';
                    html += '<div class="infor-listbox">';
                    html += '<ul class="infor-list" data-id="floorlist' + tailsData[i].tailname + '">';
                    html += '<li class="clearfix housetype">';
                    html += '<span class="index-txt fl">户型</span>';
                    if (!tailsData[i].stcw) {
                        html += '<span class="fr btn-more"></span>';
                    } else {
                        html += '<span class="fr index-infor">' + tailsData[i].stcw + '</span>';
                    }
                    html += '</li>';
                    html += '<li class="clearfix towardstype">';
                    html += '<span class="index-txt fl">朝向</span>';
                    if (!tailsData[i].towards) {
                        html += '<span class="fr btn-more"></span>';
                    } else {
                        html += '<span class="fr index-infor">' + tailsData[i].towards + '</span>';
                    }
                    html += '</li>';
                    html += '<li class="clearfix areatype">';
                    html += '<span class="index-txt fl">建面</span>';
                    html += '<span class="index-infor fr">';
                    if (tailsData[i].buildarea) {
                        html += '<span class="area_span">' + tailsData[i].buildarea + '</span>';
                        html += '<input class="fg_input iptbg"  style="display: none;" placeholder="请填写" value="'
                            + tailsData[i].buildarea + '"  />&nbsp;㎡</span>';
                    } else {
                        html += '<span class="area_span"  style="display: none;" >' + tailsData[i].buildarea + '</span>';
                        html += '<input class="fg_input iptbg" placeholder="请填写" value="'
                            + tailsData[i].buildarea + '"  />&nbsp;㎡</span>';
                    }


                    html += '</li>';
                    html += '<li class="clearfix bTypetype">';
                    html += '<span class="index-txt fl">建筑形式</span>';
                    if (!tailsData[i].buildStyle) {
                        html += '<span class="fr btn-more"></span>';
                    } else {
                        html += '<span class="fr index-infor">' + tailsData[i].buildStyle + '</span>';
                    }
                    html += '</li></ul></div></div>';
                }
                // 当前楼层不为最上层或最底层时，显示适用于n-m层
                if (!(jsonData.root.forinfo.split('-')[1] === jsonData.root.forinfo.split('-')[0] && jsonData.root.forinfo.split('-')[0] === top
                    || jsonData.root.forinfo.split('-')[1] === jsonData.root.forinfo.split('-')[0] && jsonData.root.forinfo.split('-')[0] === down)) {
                    if (jsonData.root.status === 'save') {
                        html += '<div class="infor-part clearfix infor_forlift">';
                        html += '<div class="num_floor fl">适用于</div>';
                        html += '<div class="infor-listbox">';
                        html += '<ul class="infor-list">';
                        html += '<li class="clearfix">';
                        html += '<span class="fr">&nbsp;层</span>';
                        html += '<div class="fr ui-selectbox sel-wh02 inputDownNum">';
                        html += '<div class="sel-txt-inner">';
                        html += '<span class="seltxt">' + jsonData.root.forinfo.split('-')[1] + '</span>';
                        html += '<span class="ui-arrow-d"></span>';
                        html += '</div>';
                        html += '<select>';
                        for (i = 1; i < parseInt(top); i++) {
                            html += '<option data-index="' + (i - 1) + '">' + $('#total_floorNo').val().split(',')[i - 1] + '</option>';
                        }
                        html += '</select>';
                        html += '</div>';
                        html += '<span class="fr">-</span>';
                        html += '<div class="fr ui-selectbox sel-wh02 inputTopNum">';
                        html += '<div class="sel-txt-inner">';
                        html += '<span class="seltxt">' + jsonData.root.forinfo.split('-')[0] + '</span>';
                        html += '<span class="ui-arrow-d"></span>';
                        html += '</div>';
                        html += '<select>';
                        for (i = 1; i < parseInt(top); i++) {
                            html += '<option data-index="' + (i - 1) + '">' + $('#total_floorNo').val().split(',')[i - 1] + '</option>';
                        }
                        html += '</select>';
                        html += '</div>';
                        html += '</li>';
                        html += '<li class="clearfix" style="display: none;">';
                        html += '<span class="index-infor fr">' + jsonData.root.forinfo.split('-')[0] + '-' + jsonData.root.forinfo.split('-')[1] + '层</span>';
                        html += '</li>';
                        html += '</ul></div></div>';
                        $('.icon_fkinfor').parent().show();
                        $('.inputedit').html('<em class="icon_reserve"></em>保存').removeClass('inputedit').addClass('inputsave');
                        $('.current').attr('isFinished', 'false');
                        $('.areatype').find('.area_span').hide();
                        $('.areatype').find('input').show();
                    } else {
                        html += '<div class="infor-part clearfix infor_forlift">';
                        html += '<div class="num_floor fl">适用于</div>';
                        html += '<div class="infor-listbox">';
                        html += '<ul class="infor-list">';
                        html += '<li class="clearfix" style="display: none;">';
                        html += '<span class="fr">&nbsp;层</span>';
                        html += '<div class="fr ui-selectbox sel-wh02 inputDownNum">';
                        html += '<div class="sel-txt-inner">';
                        html += '<span class="seltxt">' + jsonData.root.forinfo.split('-')[1] + '</span>';
                        html += '<span class="ui-arrow-d"></span>';
                        html += '</div>';
                        html += '<select>';
                        for (i = 1; i < parseInt(top); i++) {
                            html += '<option data-index="' + (i - 1) + '">' + $('#total_floorNo').val().split(',')[i - 1] + '</option>';
                        }
                        html += '</select>';
                        html += '</div>';
                        html += '<span class="fr">-</span>';
                        html += '<div class="fr ui-selectbox sel-wh02 inputTopNum">';
                        html += '<div class="sel-txt-inner">';
                        html += '<span class="seltxt">' + jsonData.root.forinfo.split('-')[0] + '</span>';
                        html += '<span class="ui-arrow-d"></span>';
                        html += '</div>';
                        html += '<select>';
                        for (i = 1; i < parseInt(top); i++) {
                            html += '<option data-index="' + (i - 1) + '">' + $('#total_floorNo').val().split(',')[i - 1] + '</option>';
                        }
                        html += '</select>';
                        html += '</div>';
                        html += '</li>';
                        html += '<li class="clearfix">';
                        html += '<span class="index-infor fr">' + jsonData.root.forinfo.split('-')[0] + '-' + jsonData.root.forinfo.split('-')[1] + '层</span>';
                        html += '</li></ul></div></div>';
                        $('.icon_fkinfor').parent().hide();
                        $('.inputsave').html('<em class="icon_modify"></em>修改').removeClass('inputsave').addClass('inputedit');
                        $('.current').addClass('finished').attr('isFinished', 'true');
                        $('.areatype').find('.area_span').show();
                        $('.areatype').find('input').hide();
                    }
                } else {
                    if (jsonData.root.status === 'save') {
                        html += '<div class="infor-part clearfix infor_forlift" style="display: none">';
                        html += '<div class="num_floor fl">适用于</div>';
                        html += '<div class="infor-listbox">';
                        html += '<ul class="infor-list">';
                        html += '<li class="clearfix">';
                        html += '<span class="fr">&nbsp;层</span>';
                        html += '<div class="fr ui-selectbox sel-wh02 inputDownNum">';
                        html += '<div class="sel-txt-inner">';
                        html += '<span class="seltxt">' + jsonData.root.forinfo.split('-')[1] + '</span>';
                        html += '<span class="ui-arrow-d"></span>';
                        html += '</div>';
                        html += '<select>';
                        for (i = 1; i < parseInt(top); i++) {
                            html += '<option data-index="' + (i - 1) + '">' + $('#total_floorNo').val().split(',')[i - 1] + '</option>';
                        }
                        html += '</select>';
                        html += '</div>';
                        html += '<span class="fr">-</span>';
                        html += '<div class="fr ui-selectbox sel-wh02 inputTopNum">';
                        html += '<div class="sel-txt-inner">';
                        html += '<span class="seltxt">' + jsonData.root.forinfo.split('-')[0] + '</span>';
                        html += '<span class="ui-arrow-d"></span>';
                        html += '</div>';
                        html += '<select>';
                        for (i = 1; i < parseInt(top); i++) {
                            html += '<option data-index="' + (i - 1) + '">' + $('#total_floorNo').val().split(',')[i - 1] + '</option>';
                        }
                        html += '</select>';
                        html += '</div>';
                        html += '</li>';
                        html += '<li class="clearfix" style="display: none;">';
                        html += '<span class="index-infor fr">' + jsonData.root.forinfo.split('-')[0] + '-' + jsonData.root.forinfo.split('-')[1] + '层</span>';
                        html += '</li>';
                        html += '</ul></div></div>';
                        $('.icon_fkinfor').parent().show();
                        $('.inputedit').html('<em class="icon_reserve"></em>保存').removeClass('inputedit').addClass('inputsave');
                        $('.current').attr('isFinished', 'false');
                        $('.areatype').find('.area_span').hide();
                        $('.areatype').find('input').show();
                    } else {
                        html += '<div class="infor-part clearfix infor_forlift" style="display: none">';
                        html += '<div class="num_floor fl">适用于</div>';
                        html += '<div class="infor-listbox">';
                        html += '<ul class="infor-list">';
                        html += '<li class="clearfix" style="display: none;">';
                        html += '<span class="fr">&nbsp;层</span>';
                        html += '<div class="fr ui-selectbox sel-wh02 inputDownNum">';
                        html += '<div class="sel-txt-inner">';
                        html += '<span class="seltxt">' + jsonData.root.forinfo.split('-')[1] + '</span>';
                        html += '<span class="ui-arrow-d"></span>';
                        html += '</div>';
                        html += '<select>';
                        for (i = 1; i < parseInt(top); i++) {
                            html += '<option data-index="' + (i - 1) + '">' + $('#total_floorNo').val().split(',')[i - 1] + '</option>';
                        }
                        html += '</select>';
                        html += '</div>';
                        html += '<span class="fr">-</span>';
                        html += '<div class="fr ui-selectbox sel-wh02 inputTopNum">';
                        html += '<div class="sel-txt-inner">';
                        html += '<span class="seltxt">' + jsonData.root.forinfo.split('-')[0] + '</span>';
                        html += '<span class="ui-arrow-d"></span>';
                        html += '</div>';
                        html += '<select>';
                        for (i = 1; i < parseInt(top); i++) {
                            html += '<option data-index="' + (i - 1) + '">' + $('#total_floorNo').val().split(',')[i - 1] + '</option>';
                        }
                        html += '</select>';
                        html += '</div>';
                        html += '</li>';
                        html += '<li class="clearfix" style="display:none;">';
                        html += '<span class="index-infor fr">' + jsonData.root.forinfo.split('-')[0] + '-' + jsonData.root.forinfo.split('-')[1] + '层</span>';
                        html += '</li>';
                        html += '</ul></div></div>';
                        $('.icon_fkinfor').parent().hide();
                        $('.inputsave').html('<em class="icon_modify"></em>修改').removeClass('inputsave').addClass('inputedit');
                        $('.current').addClass('finished').attr('isFinished', 'true');
                        $('.areatype').find('.area_span').show();
                        $('.areatype').find('input').hide();
                    }
                }
                $('.inputPage').find('.special').html(html);
                $('.loading_dom').hide();
            }
        });
    });
    specialDom.on('change', 'select', function () {
        var optionVal = $(this).find('option:selected').html();
        $(this).parent().find('.seltxt').html(optionVal);
    });
    var addStan = $('.add_stan');
    // 新建标准层
    $('.btn_addbox').on('click', function () {
        if ($('.finished').length !== addStan.find('li').length) {
            alert('请先录入现有层信息！');
            return false;
        }
        var i;
        $('.inputPage').find('li').removeClass('current');
        addStan.append('<ul><li class="current btn_stantard"><em></em>标准层</li></ul>');
        var num = $('#total_tailNum').val();
        var top = $('#total_foralltop').val();
        var html = '';
        html += '<div class="infor-part clearfix">';
        html += '<div class="num_floor fl">&nbsp;</div>';
        html += '<div class="infor-listbox">';
        html += '<ul class="infor-list">';
        html += '<li class="clearfix lift">';
        html += '<a class="clearfix" href="javascript:;">';
        html += '<span class="index-txt fl">电梯数量</span>';
        html += '<span class="fr btn-more"></span>';
        html += '</a>';
        html += '</li>';
        html += '</ul>';
        html += '</div>';
        html += '</div>';
        // 主体拼写
        for (i = 0; i < num; i++) {
            html += '<div class="infor-part clearfix">';
            html += '<div class="num_floor fl">房号<br/>' + (i + 1) + '</div>';
            html += '<div class="infor-listbox">';
            html += '<ul class="infor-list" data-id="floorlist' + (i + 1) + '">';
            html += '<li class="clearfix housetype">';
            html += '<span class="index-txt fl">户型</span>';
            html += '<span class="fr btn-more"></span>';
            html += '</li>';
            html += '<li class="clearfix towardstype">';
            html += '<span class="index-txt fl">朝向</span>';
            html += '<span class="fr btn-more"></span>';
            html += '</li>';
            html += '<li class="clearfix areatype">';
            html += '<span class="index-txt fl">建面</span>';
            html += '<span class="index-infor fr">';
            html += '<span class="area_span" style="display: none;"></span>';
            html += '<input class="fg_input iptbg" placeholder="请填写" />&nbsp;㎡</span>';
            html += '</li>';
            html += '<li class="clearfix bTypetype">';
            html += '<span class="index-txt fl">建筑形式</span>';
            html += '<span class="fr btn-more"></span>';
            html += '</li></ul></div></div>';
        }
        //
        html += '<div class="infor-part clearfix infor_forlift">';
        html += '<div class="num_floor fl">适用于</div>';
        html += '<div class="infor-listbox">';
        html += '<ul class="infor-list">';
        html += '<li class="clearfix">';
        html += '<span class="fr">&nbsp;层</span>';
        html += '<div class="fr ui-selectbox sel-wh02 inputDownNum">';
        html += '<div class="sel-txt-inner">';
        html += '<span class="seltxt">' + $('#total_floorNo').val().split(',')[0] + '</span>';
        html += '<span class="ui-arrow-d"></span>';
        html += '</div>';
        html += '<select>';
        for (i = 1; i < parseInt(top); i++) {
            html += '<option data-index="' + (i - 1) + '">' + $('#total_floorNo').val().split(',')[i - 1] + '</option>';
        }
        html += '</select>';
        html += '</div>';
        html += '<span class="fr">-</span>';
        html += '<div class="fr ui-selectbox sel-wh02 inputTopNum">';
        html += '<div class="sel-txt-inner">';
        html += '<span class="seltxt">' + $('#total_floorNo').val().split(',')[0] + '</span>';
        html += '<span class="ui-arrow-d"></span>';
        html += '</div>';
        html += '<select>';
        for (i = 1; i < parseInt(top); i++) {
            html += '<option data-index="' + (i - 1) + '">' + $('#total_floorNo').val().split(',')[i - 1] + '</option>';
        }
        html += '</select>';
        html += '</div>';
        html += '</li>';
        html += '</ul></div></div>';
        html += '<input type="hidden" value="1" id="isNewInfo" />';
        $('.icon_fkinfor').parent().show();
        $('.inputedit').html('<em class="icon_reserve"></em>保存').removeClass('inputedit').addClass('inputsave');
        $('.current').attr('isFinished', 'false');
        $('.areatype').find('.area_span').hide();
        $('.areatype').find('input').show();
        $('.inputPage').find('.special').html(html);
    });
    // 选择户型时的收起按钮
    $('.typelist').find('.mark').on('click', function () {
        if ($(this).hasClass('shouqi')) {
            $(this).removeClass('shouqi');
            $(this).parent().parent().find('.Numlist').find('span').hide();
        } else {
            $(this).addClass('shouqi');
            $(this).parent().parent().find('.Numlist').find('span').show();
        }
    });
    $('.icon_fanhui').on('click', function () {
        location.href = '/huodongAC.d?m=inputMes&class=EntryhouseHc&newcode=' + claimNewcode + '&city=' + encodeURIComponent(encodeURIComponent(thisCity));
    });

    /**
     * 纠错反馈
     */
    $('.radiobox').on('click', function () {
        $('.radiobox').removeClass('chooseon');
        $(this).addClass('chooseon');
    });
    // 发送按钮绑定事件
    $('.btn-send').on('click', function () {
        var $this = $(this);
        var msg = $('.iptbox').find('input').val();
        var type = $('.chooseon').attr('data-type');
        var d = new Date();
        var vYear = d.getFullYear();
        var vMon = d.getMonth() + 1;
        var vDay = d.getDate();
        var h = d.getHours();
        var m = d.getMinutes();
        var se = d.getSeconds();
        var time = vYear + '-' + (vMon < 10 ? '0' + vMon : vMon) + '-' + (vDay < 10 ? '0' + vDay : vDay) + ' '
            + (h < 10 ? '0' + h : h) + ':' + (m < 10 ? '0' + m : m) + ':' + (se < 10 ? '0' + se : se);
        $.ajax({
            url: '/huodongAC.d?m=insertMessage&class=EntryhouseHc&type=' + type + '&message=' + encodeURIComponent(encodeURIComponent(msg)) + '&user=' + user,
            success: function () {
                var html = '';
                html += '<div class="dialog_fother clearfix">';
                html += '<p class="time-send gray9">' + time + '</p>';
                html += '<div class="dialogcnt fr">';
                html += '<div class="arrow"></div>';
                html += msg + '【' + $('.chooseon').find('span').html() + '】';
                html += '</div>';
                html += '</div>';
                $('.dialog-box').append(html);
                $('.iptbox').find('input').val('');
                $this.removeClass('pre');
            }
        });
    });
    $('.dialog-input-box').find('input').on('input', function () {
        if ($(this).val() !== '') {
            $('.btn-send').addClass('pre');
        } else {
            $('.btn-send').removeClass('pre');
        }
    });
    var page = 2;
    $('.dialog-box').on('scroll', function () {
        var $this = $(this);
        if ($this.scrollTop() === 0) {
            $this.addClass('refreshStart');
            $.ajax({
                url: '/huodongAC.d?m=getMessageLast&class=EntryhouseHc&city=' + encodeURIComponent(encodeURIComponent(thisCity)) + '&page=' + page + '&user=' + user,
                success: function (data) {
                    var jsonData = $.parseJSON(data);
                    if (jsonData.root.msg === '%5D') {
                        $this.removeClass('refreshStart');
                        return false;
                    }
                    var tailsData = $.parseJSON(decodeURIComponent(jsonData.root.msg));
                    var type = '';
                    var html = '';
                    for (var i = 0; i < tailsData.length; i++) {
                        if (tailsData[i].type === '1') {
                            type = '【少楼栋】';
                        } else if (tailsData[i].type === '2') {
                            type = '【少单元】';
                        } else if (tailsData[i].type === '3') {
                            type = '【少楼层】';
                        } else if (tailsData[i].type === '4') {
                            type = '【其他】';
                        } else if (tailsData[i].type === '5') {
                            type = '【系统消息】';
                        }
                        if (tailsData[i].to_user !== 'system') {
                            html += '<div class="dialog_fsel clearfix">';
                            html += '<p class="time-send gray9">' + tailsData[i].addtime.replace(/\+/, '&nbsp;') + '</p>';
                            html += '<div class="dialogcnt fl">';
                            html += '<div class="arrow"></div>';
                            html += tailsData[i].content + ' ' + type;
                            html += '</div></div>';
                        } else {
                            html += '<div class="dialog_fother clearfix">';
                            html += '<p class="time-send gray9">' + tailsData[i].addtime.replace(/\+/, '&nbsp;') + '</p>';
                            html += '<div class="dialogcnt fr">';
                            html += '<div class="arrow"></div>';
                            html += tailsData[i].content + ' ' + type;
                            html += '</div></div>';
                        }
                    }
                    $('.check_err').prepend(html);
                    $this.removeClass('refreshStart');
                    page++;
                }
            });
        }
    });

    /**
     * 各页面的绑定事件
     */
    $('.banTag').on('click', function () {
        $('.wrap').attr('class', 'wrap ban');
    });
    $('.floorTag').on('click', function () {
        $('.wrap').attr('class', 'wrap floor');
    });
    $('.btn_back').on('click', function () {
        canmove = true;
        // 第二层浮层，点击后浮层不隐藏
        if ($(this).parent().parent().hasClass('second')) {
            $('.second-bg').hide();
            return false;
        }
        $(this).parents().find('.tc-bg').hide();
    });
    $('.btsure').on('click', function () {
        canmove = true;
        $(this).parents().find('.tc-bg').hide();
    });
    alertboxBg.find('.btn-close').on('click', function () {
        alertboxBg.hide();
    });
    $('.albtnbox').on('click', function () {
        alertboxBg.hide();
    });
});

