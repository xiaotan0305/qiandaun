define('modules/myzf/kanFangList', ['jquery'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var appSrc_str = '';
        if (vars.issfapp) {
            appSrc_str = '&Mobile=' + vars.Mobile + '&src=' + vars.src + '&UserID=' + vars.UserID;
        }

        // 复选框元素
        var $inputid = $('input[name=id]');
        // 预约按钮
        var $appointment = $('#appointment');
        // 全选按钮
        var $selectall = $('#selectall');
        // 可预约标签
        var $invalideType = $('#invalidetype');
        // 已过期标签
        var $orderType = $('#ordertype');
        // 判断按钮是否可点，值为false不可点
        var submitFlag = false;

        // 复选框一个没有选中时预约钮显灰,按钮不可点
        if (!$inputid.is(':checked')) {
            $appointment.css('background-color', '#cccfd8');
            submitFlag = false;
        } else {
            submitFlag = true;
        }

        // 标签切换
        // 点击可预约标签
        $invalideType.on('click', function () {
            $orderType.removeClass('active');
            $(this).addClass('active');
            $('#ValidHousesList').hide();
            $('#InvalidHousesList').show();
        });
        // 点击过期标签
        $orderType.on('click', function () {
            $invalideType.removeClass('active');
            $(this).addClass('active');
            $('#ValidHousesList').show();
            $('#InvalidHousesList').hide();
        });

        // 全选单选状态切换
        // 点击全选按钮
        $selectall.click(function () {
            $inputid.prop('checked', $selectall.prop('checked'));
        });
        $inputid.click(function () {
            $selectall.prop('checked', $('input[name=id]:checked').length == $inputid.length);
        });

        // 全部复选框的选中状态发生变化时改变预约时间的颜色状态及是否可点击
        $('input[type="checkbox"]').on('change', function () {
            var checkedLen = $('input[type="checkbox"]:checked').length;
            if (!checkedLen) {
                submitFlag = false;
                $appointment.css('background-color', '#cccfd8');
            } else {
                submitFlag = true;
                $appointment.css('background-color', '#df3031');
            }
        });

        // 删除预约单中选定的房源
        $('#removelist').on('click', function () {
            var ob = $('.houselistbox'),
                houseids = '',
                roomids = '',
                selectedflag = false;
            for (var k = 0; k < ob.length; k++) {
                if (ob[k].checked) {
                    selectedflag = true;
                }
            }
            if (!selectedflag) {
                alert('请选择您要删除的看房单');
                return;
            }
            if (confirm('确认删除所选看房单吗？')) {
                for (var i = 0; i < ob.length; i++) {
                    if (ob[i].checked) {
                        if (/,/.test(ob[i].id)) {
                            roomids += ob[i].id + '|';
                        } else {
                            houseids += ob[i].id + ',';
                        }
                    }
                }
                houseids = houseids.replace(/,$/, '');
                roomids = roomids.replace(/\|$/, '');

                $.ajax({
                    type: 'get',
                    url: vars.mySite + '?c=myzf&a=ajaxRemoveKanFangList',
                    data: 'houseids=' + houseids + '&roomids=' + roomids + '&city=' + vars.city + '&r=' + Math.random() + appSrc_str,
                    dataType: 'json',
                    success: function (obj) {
                        if (obj.result !== '1') {
                            alert(obj.message);
                            return;
                        }
                        window.location.reload();
                    },
                    error: function () {
                        window.location.reload();
                    }
                });
            }
        });
        // 清除失效房源
        $('#clear').on('click', function () {
            var inval = $('.relative'),
                roomids = '',
                houseids = '';
            for (var i = 0; i < inval.length; i++) {
                if (/,/.test(inval[i].id)) {
                    roomids += inval[i].id + '|';
                } else {
                    houseids += inval[i].id + ',';
                }
            }
            houseids = houseids.replace(/,$/, '');
            roomids = roomids.replace(/\|$/, '');

            $.ajax({
                type: 'get',
                url: '/my/?c=myzf&a=ajaxRemoveKanFangList',
                data: 'houseids=' + houseids + '&roomids=' + roomids + '&city=' + vars.city + '&r=' + Math.random() + appSrc_str,
                dataType: 'json',
                success: function (obj) {
                    if (obj.result !== '1') {
                        alert(obj.message);
                        return;
                    }
                    $('.relative').remove();
                }
            });
        });
        // 预约时间按钮
        var current_url = window.location.href;
        var ref_url = document.referrer;
        var ob = $('.houselistbox'),
            roomids = '',
            houseids = '';
        $appointment.on('click', function () {
            if (!submitFlag){
                return false;
            }
            var ob = $('.houselistbox'),
                roomids = '',
                houseids = '';
            for (var i = 0; i < ob.length; i++) {
                if (ob[i].checked) {
                    if (/,/.test(ob[i].id)) {
                        roomids += ob[i].id + '|';
                    } else {
                        houseids += ob[i].id + ',';
                    }
                }
            }
            houseids = houseids.replace(/,$/, '');
            roomids = roomids.replace(/\|$/, '');

            if (houseids !== '' || roomids !== '') {
                if (current_url.lastIndexOf('baidu-waptc') !== -1 || ref_url.lastIndexOf('baidu-waptc') !== -1) {
                    window.location.href = '/my/?c=myzf&a=yykfDatePage&city=' + vars.city + '&HouseID=' + houseids
                        + '&roomids=' + roomids + appSrc_str + '&baidu-waptc';
                } else {
                    window.location.href = '/my/?c=myzf&a=yykfDatePage&city=' + vars.city + '&HouseID=' + houseids
                        + '&roomids=' + roomids + appSrc_str;
                }
            } else {
                alert('请先选好您要预约的房源');
            }
        });

        function teltj(city, housetype, houseid, newcode, type, phone, channel, agentid) {
            $.ajax({
                url: vars.mainSite + 'data.d?m=houseinfotj&city=' + city + '&housetype=' + housetype + '&houseid=' + houseid
                + '&newcode=' + newcode + '&type=' + type + '&phone=' + phone + '&channel=' + channel + '&agentid=' + agentid,
                async: true
            });
        }
        function maima(type) {
            _ub.city = vars.cityname;
            _ub.biz = 'z';
            var ns = vars.cityns === 'n' ? 0 : 1;
            _ub.location = ns;
            var b = type;
            if (type === 31) {
                var p_temp = {
                    mz18: vars.houseidlist
                };
            }

            var p = {};
            for (var temp in p_temp) {
                if (p_temp[temp] != null && '' != p_temp[temp] && undefined != p_temp[temp] && 'undefined' != p_temp[temp]) {
                    p[temp] = p_temp[temp];
                }
            }
            _ub.collect(b, p);
        }

        // 兼容ajax加载的点击无反应
        $('.zfds').on('click', '.btn-call', function () {
            maima(31);
            var data = $(this).attr('data-teltj');
            var dataArr = data.split(',');
            teltj(dataArr[0], dataArr[1], dataArr[2], dataArr[3], dataArr[4], dataArr[5], dataArr[6], dataArr[7]);
        });


        // 加载更多,‘看房记录’页面用
        if ($.inArray(vars.type_src, ['2', '3', '4']) !== -1) {
            vars.total = parseInt($('.flexbox .active').text().match(/(\d+)/)[0]);
            var totalpage = Math.ceil(vars.total / vars.pagesize);
            if (totalpage <= 1) {
                $('#drag').hide();
            } else {
                var actions = ['0', '1', 'ajaxGetAppointingOrderList', 'ajaxGetLookedList', 'ajaxGetCommentedList'];
                require.async('modules/myzf/loadnewmore', function (run) {
                    run({url: vars.mySite + '?c=myzf&a=' + actions[vars.type_src] + '&city=' + vars.city + '&pagesize=' + vars.pagesize + appSrc_str});
                });
                require.async('lazyload/1.9.1/lazyload', function () {
                    $('img[data-original]').lazyload();
                });
            }
        }
    };
});
