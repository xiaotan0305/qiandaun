define('modules/schoolhouse/new_schoolhouse_index', ['jquery', 'slideFilterBox/1.0.0/slideFilterBox', 'modules/esf/yhxw'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var iscrollCtrl = require('slideFilterBox/1.0.0/slideFilterBox');
        var yhxw = require('modules/esf/yhxw');
        // 添加行为统计
        yhxw({type: 1, pageId: 'mesflistschool', curChannel: 'schoolhouse'});
        function preventDefault(e) {
            e.preventDefault();
        }

        // 引入搜索schoolSearch.js
        require.async('search/esf/schoolSearch', function (schoolSearch) {
            var SchoolSearch = new schoolSearch();
            SchoolSearch.init();
        });
        // end
        function unable() {
            document.addEventListener('touchmove', preventDefault);
        }

        function enable() {
            document.removeEventListener('touchmove', preventDefault);
        }

        // 点击学区
        $('#schoolarea').click(function () {
            var $schoolareaDiv = $('#schoolarea_div');
            window.scrollTo(0, 100);
            if ($schoolareaDiv.css('display') === 'none') {
                $(this).addClass('active');
                $('#district_div').show();
                $schoolareaDiv.show();
                // iscrollCtrl.refresh('#schoolarea_div');
            } else {
                $(this).removeClass('active');
                $schoolareaDiv.hide();
                $('#district_div').hide();
            }
            $('#searchDistrict').hide().removeClass('active');
            $('#searchComarea').hide().removeClass('active');
            $('#railway_section').hide().removeClass('active');
            $('#station_section').hide().removeClass('active');
            $('#railway').removeClass();
            $('#type_div').hide();
            $('#type').removeClass('active');
            $('#feature_div').hide();
            $('#feature').removeClass('active');
            $('#district').removeClass();
            if ($(this).hasClass('active')) {
                $('.float').show();
                $('#tabSX').addClass('tabSX');
                $('.float').css('height', $(window).height() + 50 + 'px');
                $('#tabSX').addClass('tabSX');
                unable();
            } else {
                $('.float').hide();
                $('#tabSX').removeClass('tabSX');
                enable();
            }
        });
        // 点击类别
        $('#type').click(function () {
            window.scrollTo(0, 100);
            if ($('#type_div').css('display') === 'none') {
                $(this).addClass('active');
                $('#type_div').show();
                iscrollCtrl.refresh('#type_div');
            } else {
                $(this).removeClass('active');
                $('#type_div').hide();
            }
            $('#schoolarea_div').hide();
            $('#schoolarea').removeClass('active');
            $('#district_div').hide();
            $('#district').removeClass('active');
            $('#feature_div').hide();
            $('#feature').removeClass('active');
            if ($(this).hasClass('active')) {
                $('.float').show();
                $('#tabSX').addClass('tabSX');
                $('.float').css('height', $(window).height() + 50 + 'px');
                $('#tabSX').addClass('tabSX');
                unable();
            } else {
                $('.float').hide();
                $('#tabSX').removeClass('tabSX');
                enable();
            }
        });

        // 点击区域
        $('#district').click(function () {
            window.scrollTo(0, 100);
            $('#searchDistrict dd')
            if ($('#district_div').css('display') === 'none' || ($('#district_div').css('display') === 'block'
                && $('#schoolarea_div').css('display') === 'block')) {
                $(this).addClass('active');
                $('#district_div').show();
                $('#searchDistrict').show();
            } else {
                $(this).removeClass('active');
                $('#district_div').hide();
            }
            if (vars.districtid.length > 0) {
                $('#searchDistrict dd').removeClass('active');
                $('#district_dd_' + vars.districtid).addClass('active');
            }
            // 展示三级列表
            if ($('#searchDistrict').find('dd.active').length === 1) {
                var position = $('#searchDistrict').find('dd.active').find('a').data('id');
                $('#searchComarea').show();
                $('.comarea_dl').hide();
                if (vars.districtid) {
                    $('#comarea_dl_' + vars.districtid).show();
                } else {
                    $('#comarea_dl_' + position).show();
                }
                $('#comarea_dd' + vars.comareaid).addClass('active');
            }

            $('#schoolarea_div').hide();
            $('#schoolarea').removeClass('active');
            $('#railway_section').hide().removeClass('active');
            $('#station_section').hide().removeClass('active');
            $('#railway').removeClass('active');
            $('#type_div').hide();
            $('#type').removeClass('active');
            $('#feature_div').hide();
            $('#feature').removeClass('active');
            if ($(this).hasClass('active')) {
                $('.float').show();
                $('#tabSX').addClass('tabSX');
                iscrollCtrl.refresh('#searchDistrict');
                iscrollCtrl.refresh('#searchComarea');
                $('.float').css('height', $(window).height() + 50 + 'px');
                $('#tabSX').addClass('tabSX');
                unable();
            } else {
                $('.float').hide();
                $('#tabSX').removeClass('tabSX');
                enable();
            }
        });

        // 地铁
        $('#railway').click(function () {
            $('#district_div').show();
            $('#railway_section').show();
            iscrollCtrl.refresh('#railway_section');
            $('#searchDistrict').hide();
            $('#searchComarea').hide();
            $('#district_dd').removeClass('active');
            $(this).addClass('active');
        });

        // 点击具体的某个地铁站
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

        // 点击特色
        $('#feature').click(function () {
            window.scrollTo(0, 100);
            if ($('#feature_div').css('display') === 'none') {
                $(this).addClass('active');
                $('#feature_div').show();
            } else {
                $(this).removeClass('active');
                $('#feature_div').hide();
            }
            $('#schoolarea_div').hide();
            $('#schoolarea').removeClass('active');
            $('#type_div').hide();
            $('#type').removeClass('active');
            $('#railway_section').hide().removeClass('active');
            $('#railway').removeClass('active');
            $('#station_section').hide().removeClass('active');
            $('#district_div').hide();
            $('#district').removeClass('active');
            if ($(this).hasClass('active')) {
                $('.float').show();
                $('#tabSX').addClass('tabSX');
                iscrollCtrl.refresh('#feature_div');
                $('.float').css('height', $(window).height() + 50 + 'px');
                $('#tabSX').addClass('tabSX');
                unable();
            } else {
                $('.float').hide();
                $('#tabSX').removeClass('tabSX');
                enable();
            }
        });
        // 点击具体的某个区域
        $('#searchDistrict').on('click', 'a', function () {
            $(this).parent().addClass('active').siblings().removeClass('active');
            var districtId = $(this).attr('data-id');
            $('#searchComarea').show();
            $('.comarea_dl').hide();
            $('#comarea_dl_' + districtId).show();
            iscrollCtrl.refresh('#searchComarea');
        });
        require.async('lazyload/1.9.1/lazyload', function () {
            $('img[data-original]').lazyload();
        });
        require.async('modules/schoolhouse/loadnewmore', function (run) {
            run({
                a: 'esf',
                url: vars.schoolhouseSite + '?c=schoolhouse&a=ajaxGetInfo&city=' + vars.city + '&' + vars.ajaxSearch
            });
        });
        // 阴影浮层
        $('.float').on('click', function () {
            if ($('.float').css('display') !== 'none') {
                $('.float').hide();
                $('.cont').hide();
                $('#schoolarea,#type,#district,#feature').removeClass('active');
                $('#tabSX').removeClass('tabSX');
                enable();
            }
        });
    };
});