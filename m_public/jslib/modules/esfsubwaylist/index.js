define('modules/esfsubwaylist/index', ['jquery','iscroll/1.0.0/iscroll'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var iscrollCtrl = require('iscroll/1.0.0/iscroll');
        var vars = seajs.data.vars;
        $('input[type=hidden]').each(function (index, element) {
            vars[$(this).attr('data-id')] = element.value;
        });
        var $showMoreHint = $('#showMoreHint'),
            $showSortHint = $('#showSortHint'),
            $showMore = $('#showMore');
        $showMoreHint.click(function () {
            $showMoreHint.hide();
            $showMore.show();
            $showSortHint.show();
        });
        $showSortHint.click(function () {
            $showMore.hide();
            $showSortHint.hide();
            $showMoreHint.show();
        });
        // var oSort = document.getElementById('sort');
        var aBtn = document.getElementsByTagName('i');
        var tempFunc = function (index) {
            aBtn[index].onclick = function () {
                var oDD = this.parentNode;
                var oDL = oDD.parentNode;

                if (oDD.tagName !== 'DD' && oDL.tagName !== 'DL') {
                    return false;
                }
                if (oDD.offsetHeight < oDD.scrollHeight) {
                    oDL.className = 'active';
                    this.className = 'up';
                } else {
                    oDL.className = '';
                    this.className = 'dn';
                }
            };
        };
        for (var i = 0; i < aBtn.length; i++) {
            tempFunc(i);
        }
        require.async('lazyload/1.9.1/lazyload', function () {
            $('img[data-original]').lazyload();
        });
        require.async('modules/esfsubwaylist/loadmore', function (run) {
            run({
                a: 'esfsubwaylist',
                url: vars.esfsubwaylistSite + '?c=esfsubwaylist&a=ajaxGetInfo&city=' + vars.city + '&linename='
                + vars.linename + '&station=' + vars.station + '&distance=' + vars.distance + '&purpose='
                + vars.purpose + '&area=' + vars.area + '&price=' + vars.priceget + '&room=' + vars.room
                + '&orderby=' + vars.orderby + '&propertysubtype=' + vars.propertysubtype
            });
        });
        iscrollCtrl.init(['#price_div', '#area_div', '#railway_section', '#station_section', '#all_section']);

        function preventDefault(e) {
            e.preventDefault();
        }

        function unable() {
            document.addEventListener('touchmove', preventDefault);
        }

        function enable() {
            document.removeEventListener('touchmove', preventDefault);
        }
        // 刚进到页面时，显示地铁线路
        window.onload = function () {
            window.scrollTo(0, 100);
            if ($('#position_div').css('display') === 'none' && vars.esfflag !== 'no') {
                $('#position_div').show();
                $('#position').addClass('active');
                $('#railway_section').show();
                iscrollCtrl.refresh('#railway_section');
                $('.float').show();
                $('.float').css('height', $(window).height() + 100 + 'px');
            } else {
                $('#position_div').hide();
                $(this).removeClass('active');
            }
        };
        // 阴影浮层
        $('.float').click(function () {
            if ($('.float').css('display') !== 'none') {
                $('.float').hide();
                $('#position_div').hide();
                $('#position').removeClass('active');
                $('#price_div').hide();
                $('#price').removeClass('active');
                $('#area_div').hide();
                $('#area').removeClass('active');
                $('#room_div').hide();
                $('#room').removeClass('active');
                $('#propertysubtype_div').hide();
                $('#propertysubtype').removeClass('active');
                $('#all_div').hide();
                $('#all').removeClass('active');
                $('#tabSX').removeClass('tabSX');
                enable();
            }
        });
        // 筛选条件
        $('#position').click(function () {
            window.scrollTo(0, 100);
            if ($('#position_div').css('display') === 'none') {
                $('#position_div').show();
                $(this).addClass('active');
                $('#price_div').hide();
                $('#price').removeClass('active');
                $('#area_div').hide();
                $('#area').removeClass('active');
                $('#room_div').hide();
                $('#room').removeClass('active');
                $('#all_div').hide();
                $('#all').removeClass('active');
                $('#propertysubtype_div').hide();
                $('#propertysubtype').removeClass('active');
                $('.float').show().css('height', $(window).height() + 100 + 'px');
                $('#tabSX').addClass('tabSX');
                unable();
            } else {
                $('#position_div').hide();
                $(this).removeClass('active');
                $('.float').hide();
                $('#tabSX').removeClass('tabSX');
                enable();
            }
            if (vars.lineid !== '') {
                $('#railway_section').show();
                iscrollCtrl.refresh('#railway_section');
            }
            if (vars.station !== '') {
                $('#station_section').show();
                $('.station_dl').hide();
                $('#station_dl_' + vars.lineid).show();
                iscrollCtrl.refresh('#station_section');
            }
        });
        $('#railway').click(function () {
            $('#railway_section').show();
            iscrollCtrl.refresh('#railway_section');
        });

        // 站点
        $('#railway_section').on('click', 'a', function (e) {
            var aEl = e.target;
            var dataId = $(aEl).attr('data');
            $('#railway_section dd').removeClass('active');
            $('#railway_param_' + dataId).addClass('active');
            $('#station_section').show();
            $('.station_dl').hide();
            $('#station_dl_' + dataId).show();
            iscrollCtrl.refresh('#station_section');
        });

        // 总价
        $('#price').click(function () {
            window.scrollTo(0, 100);
            if ($('#price_div').css('display') === 'none') {
                $('#position_div').hide();
                $('#position').removeClass('active');
                $('#price_div').show();
                iscrollCtrl.refresh('#price_div');
                $(this).addClass('active');
                $('#area_div').hide();
                $('#area').removeClass('active');
                $('#room_div').hide();
                $('#room').removeClass('active');
                $('#all_div').hide();
                $('#all').removeClass('active');
                $('#propertysubtype_div').hide();
                $('#propertysubtype').removeClass('active');
                $('.float').show();
                $('.float').css('height', $(window).height() + 100 + 'px');
                $('#tabSX').addClass('tabSX');
                unable();
            } else {
                $('#price_div').hide();
                $(this).removeClass('active');
                $('.float').hide();
                $('#tabSX').removeClass('tabSX');
                enable();
            }
        });
        // 自定义价格，面积
        function customPrice(aId, unit, nolocation) {
            var minName = aId + 'min';
            var maxName = aId + 'max';
            var minData = $('#' + minName).val() === '' ? '0' : $('#' + minName).val();
            var maxData = $('#' + maxName).val() === '' ? '0' : $('#' + maxName).val();
            var pattern = /^\d+$/;
            if (pattern.test(minData) === false || pattern.test(maxData) === false || maxData === '0') {
                alert('请填写有效的整数！');
                return false;
            }
            if (maxData !== '0') {
                if (Number(minData) > Number(maxData)) {
                    alert('请填写有效的搜索范围!');
                    return false;
                }
            }
            var urlvalue = $('.' + aId + 'Url').attr('href');
            var price0 = $('.' + aId + 'Url').attr('data');
            var area0 = $('.' + aId + 'Url').attr('data');

            if (aId === 'price' && nolocation === 'needlocation') {
                urlvalue = urlvalue.replace('p' + price0, 'p' + minData + ',' + maxData);
            } else if (aId === 'area' && nolocation === 'needlocation') {
                urlvalue = urlvalue.replace('a' + area0, 'a' + minData + ',' + maxData);
            }
            if (nolocation === 'nolocation' && (aId === 'price' || aId === 'allprice')) {
                // 全部时自定义价格
                $('#param_price').text(minData + '-' + maxData + '万元');
                vars.price = minData + ',' + maxData;
                // 修改参数price的值
                $('#price_section').hide();
                $('#all_section').show();
                $('#choosereset').show();
                $('#chooseback').hide();
                $('#nowCont').hide();
            } else if (nolocation === 'nolocation' && (aId === 'area' || aId === 'allarea')) {
                // 全部时自定义价格
                $('#param_area').text(minData + '-' + maxData + '平');
                vars.area = minData + ',' + maxData;
                // 修改参数area的值
                $('#area_section').hide();
                $('#all_section').show();
                $('#choosereset').show();
                $('#chooseback').hide();
                $('#nowCont').hide();
            } else if (nolocation === 'needlocation') {
                window.location = urlvalue;
            }
        }
        $('.define input[type=button]').on('click', function () {
            var arr = $(this).data('price').split(',');
            customPrice(arr[0], arr[1], arr[2]);
        });
        $('.define input[type=button]').on('click', function () {
            var arr = $(this).data('area').split(',');
            customPrice(arr[0], arr[1], arr[2]);
        });


        // 面积
        $('#area').click(function () {
            window.scrollTo(0, 100);
            if ($('#area_div').css('display') === 'none') {
                $('#position_div').hide();
                $('#position').removeClass('active');
                $('#price_div').hide();
                $('#price').removeClass('active');
                $('#room_div').hide();
                $('#room').removeClass('active');
                $('#propertysubtype_div').hide();
                $('#propertysubtype').removeClass('active');
                $('#area_div').show();
                iscrollCtrl.refresh('#area_div');
                $(this).addClass('active');
                $('.float').show().css('height', $(window).height() + 100 + 'px');
                $('#tabSX').addClass('tabSX');
                unable();
            } else {
                $('#area_div').hide();
                $(this).removeClass('active');
                $('.float').hide();
                $('#tabSX').removeClass('tabSX');
                enable();
            }
        });

        // 类型
        $('#propertysubtype').click(function () {
            window.scrollTo(0, 100);
            if ($('#propertysubtype_div').css('display') === 'none') {
                $('#position_div').hide();
                $('#position').removeClass('active');
                $('#price_div').hide();
                $('#price').removeClass('active');
                $('#area_div').hide();
                $('#area').removeClass('active');
                $('#room_div').hide();
                $('#room').removeClass('active');
                $('#propertysubtype_div').show();
                iscrollCtrl.refresh('#propertysubtype_div');
                $(this).addClass('active');
                $('.float').show().css('height', $(window).height() + 100 + 'px');
                $('#tabSX').addClass('tabSX');
                unable();
            } else {
                $('#propertysubtype_div').hide();
                $(this).removeClass('active');
                $('.float').hide();
                $('#tabSX').removeClass('tabSX');
                enable();
            }
        });

        // 户型
        $('#room').click(function () {
            window.scrollTo(0, 100);
            if ($('#room_div').css('display') === 'none') {
                $('#position_div').hide();
                $('#position').removeClass('active');
                $('#price_div').hide();
                $('#price').removeClass('active');
                $('#area_div').hide();
                $('#area').removeClass('active');
                $('#room_div').show();
                iscrollCtrl.refresh('#room_div');
                $(this).addClass('active');
                $('#all_div').hide();
                $('#all').removeClass('active');
                $('.float').show().css('height', $(window).height() + 100 + 'px');
                $('#tabSX').addClass('tabSX');
                unable();
            } else {
                $('#room_div').hide();
                $(this).removeClass('active');
                $('.float').hide();
                $('#tabSX').removeClass('tabSX');
                enable();
            }
        });
        // 全部
        $('#all').click(function () {
            window.scrollTo(0, 100);
            if ($('#all_div').css('display') === 'none') {
                $('#position_div').hide();
                $('#position').removeClass('active');
                $('#price_div').hide();
                $('#price').removeClass('active');
                $('#room_div').hide();
                $('#room').removeClass('active');
                $('#all_div').show();
                iscrollCtrl.refresh('#all_div');
                $(this).addClass('active');
                $('.float').show();
                $('.float').css('height', $(window).height() + 100 + 'px');
                $('#tabSX').addClass('tabSX');
                unable();
            } else {
                $('#all_div').hide();
                $(this).removeClass('active');
                $('.float').hide();
                $('#tabSX').removeClass('tabSX');
                enable();
            }
        });

        function showSection(id) {
            // var sectionid = id + '_section';
            $('#all_section').hide();
            $('#choosereset').hide();
            $('#chooseback').show();
            $('#nowCont').show();
            $('.one_section').hide();
            if (id === 'area') {
                $('#nowCont').text('面积');
            } else if (id === 'orderby') {
                $('#nowCont').text('排序');
            } else if (id === 'htype') {
                $('#nowCont').text('类型');
            }
            $('#' + id + '_section').show();
            iscrollCtrl.refresh('#' + id + '_section');
            if (id === 'chooseback') {
                $('#all_section').show();
                $('#choosereset').show();
                $('#chooseback').hide();
                $('#nowCont').hide();
            }
        }
        // 全部时的筛选条件
        function chooseParam(str) {
            var data = str.split('_');
            var k = data[0],
                // param = data[1],
                val = data[2],
                name = data[3];
            // var str = param + val;
            $('#param_' + k).text(name);
            $('#choosereset').show();
            $('#chooseback').hide();
            $('#nowCont').hide();
            $('.one_section').hide();
            $('#' + k + '_section dd').removeClass('active');
            $('#' + k + '_' + val).addClass('active');
            $('#' + k + '_section').hide();
            $('#all_section').show();
            $('#choosereset').show();
            if (val !== 'all' && k !== 'htype') {
                vars[k] = val;
            } else if (k === 'htype') {
                vars.htype = val;
            } else {
                vars[k] = '';
            }
            if (vars.purpose === '住宅' && val === 'zz') {
                $('#zztype').addClass('active');
                $('#xzltype').removeClass('active');
                $('#sptype').removeClass('active');
            } else if (vars.purpose === '住宅' && val === 'xzl') {
                $('#zztype').removeClass('active');
                $('#xzltype').addClass('active');
                $('#sptype').removeClass('active');
            } else if (vars.purpose === '住宅' && val === 'sp') {
                $('#zztype').removeClass('active');
                $('#xzltype').removeClass('active');
                $('#sptype').addClass('active');
            }
        }
        $('#all_div').on('click', 'a', function (e) {
            var aEl = e.target;
            var data = $(aEl).data('id');
            if (data) {
                showSection(data);
            } else {
                data = $(aEl).data('param');
                if (data) {
                    chooseParam(data);
                }
            }
        });
        // 重置
        $('#resetParam').on('click', function () {
            $('input[type=hidden]').each(function () {
                vars[$(this).attr('data-id')] = '';
                $('#param_' + $(this).attr('data-id')).text('不限');
            });
            $('#position span').text('地铁');
            $('#price span').text('总价');
            $('#area span').text('面积');
            $('#room span').text('户型');
            $('#propertysubtype span').text('类型');
            $('dd').addClass('active');
        });
        // 完成筛选
        $('#completeChoose').on('click', function () {
            var completeUrl;
            if (vars.htype === '' || vars.htype === 'zz') {
                var purpose = vars.purpose.trim();
                if (purpose === '写字楼') {
                    completeUrl = vars.esfsubwaylistSite + vars.city + '_office';
                } else if (purpose === '商铺') {
                    completeUrl = vars.esfsubwaylistSite + vars.city + '_shop';
                } else {
                    completeUrl = vars.esfsubwaylistSite + vars.city;
                }

                if (vars.lineid !== '') {
                    completeUrl += '_j' + vars.lineid;
                }
                if (vars.station !== '') {
                    completeUrl += '_k' + vars.station;
                }

                if (vars.priceget !== '') {
                    completeUrl += '_p' + vars.priceget;
                    // 价格
                }

                if (vars.purpose === '住宅' && vars.room !== '') {
                    completeUrl += '_h' + vars.room;
                    // 户型
                }

                if (vars.area !== '') {
                    completeUrl += '_a' + vars.area;
                    // 面积
                }

                if (vars.purpose === '住宅' && vars.orderby !== '') {
                    completeUrl += '_x' + vars.orderby;
                    // 排序
                }

                if ((vars.purpose === '写字楼' || vars.purpose === '商铺') && vars.propertysubtype !== '') {
                    completeUrl += '_i' + vars.propertysubtype;
                    // 类型
                }

                // if (vars.lineid !== '' || vars.station !=='' || vars.priceget !=='' || vars.room !=='' || vars.area !=='' || vars.orderby !=='' || vars.propertysubtype !=='') {
                completeUrl += '/';
                // }
            } else if (vars.htype === 'xzl') {
                completeUrl = vars.esfsubwaylistSite + vars.city + '_office';
                if (vars.lineid !== '') {
                    completeUrl += '_j' + vars.lineid;
                }
                if (vars.station !== '') {
                    completeUrl += '_k' + vars.station;
                }
                completeUrl += '/';
            } else if (vars.htype === 'sp') {
                completeUrl = vars.esfsubwaylistSite + vars.city + '_shop';
                if (vars.lineid !== '') {
                    completeUrl += '_j' + vars.lineid;
                }
                if (vars.station !== '') {
                    completeUrl += '_k' + vars.station;
                }
                completeUrl += '/';
            }
            window.location = completeUrl;
        });
        $('#esfposition').click(function () {
            var startesfUrl;
            if (vars.purpose === '住宅') {
                startesfUrl = vars.esfSite + vars.city + '/';
            } else if (vars.purpose === '写字楼') {
                startesfUrl = vars.mainSite + 'esf_xzl/' + vars.city + '/';
            } else if (vars.purpose === '商铺') {
                startesfUrl = vars.mainSite + 'esf_sp/' + vars.city + '/';
            }
            window.location = startesfUrl;
        });
    };
});