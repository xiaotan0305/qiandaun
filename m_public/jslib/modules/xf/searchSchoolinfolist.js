/**
 * Created by WeiRF on 2015/11/5.
 */
define('modules/xf/searchSchoolinfolist',
    ['jquery','util/util','iscroll/2.0.0/iscroll-lite','lazyload/1.9.1/lazyload','slideFilterBox/1.0.0/slideFilterBox','modules/xf/loadMore'],
    function (require) {
        'use strict';
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var IScroll = require('slideFilterBox/1.0.0/slideFilterBox');
        var lazy = require('lazyload/1.9.1/lazyload');
        var loadMore = require('modules/xf/loadMore');
        // 懒加载
        lazy('img[data-original]').lazyload();

        // 快筛---------------------------------------------------start
        var $siftUl = $('#sift ul li');
        var $schooltypeChioce = $('.schooltypeChioce');
        var $whereChioce = $('.whereChioce');
        var $float = $('.float');
        var $sift = $('#sift');
        $siftUl.on('click',function () {
            if (!$(this).attr('class')) {
                if ($(this).attr('name').indexOf('whereChioce') > -1) {
                    $siftUl.removeClass();
                    $(this).addClass('active');
                    // 类别隐藏，区域显示
                    $schooltypeChioce.hide();
                    $whereChioce.show();
                    // 刷新显示
                    IScroll.refresh('#whereChioce');
                } else {
                    $siftUl.removeClass();
                    $(this).addClass('active');
                    // 区域隐藏，类别显示
                    $whereChioce.hide();
                    $schooltypeChioce .show();
                    // 刷新显示
                    IScroll.refresh('#schooltypeChioce');
                }
                $sift.addClass('tabSX');
                // 显示浮层
                $float.show();
                // 阻止页面Scroll事件
                unable();
            } else {
                $(this).removeClass();
                $float.hide();
                $whereChioce.hide();
                $schooltypeChioce .hide();
                $sift.attr('class', '');
                enable();
            }
        });
        $float.on('click',function () {
            $siftUl.removeClass();
            $float.hide();
            $whereChioce.hide();
            $schooltypeChioce .hide();
            $sift.attr('class', '');
            enable();
        });
        function unable() {
            document.addEventListener('touchmove',preventDefault);
        }
        function preventDefault(e) {
            e.preventDefault();
        }
        function enable() {
            document.removeEventListener('touchmove',preventDefault);
        }
        // 下拉加载更多
        var totalInfo = Number($('#totalpage').html());
        var oneInfo = 40;
        var dataConfig = {
            m: 'searchSchoolinfolist',
            datatype: 'json',
            city: vars.paramcity,
            district: encodeURIComponent(encodeURIComponent(vars.paramdistrict)),
            schooltype: vars.paramschooltype,
            p: 2
        };
        $('.moreList').eq(0).addClass('loading');
        var options = {
            moreBtnID: '#drag',
            loadPromptID: '.loading',
            contentID: '#slist',
            ajaxUrl: '/xf.d',
            ajaxData: dataConfig,
            pageNumber: 10,
            pagesize: oneInfo,
            total: totalInfo,
            ajaxFn: {}
        };
        // 调用加载更多模块实现加载更多
        loadMore(options);
        // 如果没有列表，则显示未找到标签
        if ($('#slist li').length === 0) {
            $('.searchNo').show();
        } else {
            $('.searchNo').hide();
        }
        function tiaozhuan(district,schooltype) {
            window.location.href = '/xf.d?m=searchSchoolinfolist&city=' + vars.paramcity
                + '&district=' + encodeURIComponent(encodeURIComponent(district)) + '&schooltype=' + schooltype;
        }
        $('a[data-name="tiaozhuan"]').on('click',function () {
            var value = $(this).attr('data-value').split(';');
            tiaozhuan(value[0],value[1]);
        });
       // 最下面导航
        var $navBottom = $('.overboxIn a');
        var $seoUl = $('.self');
        $navBottom.on('click',function () {
            $navBottom.removeClass();
            $(this).addClass('active');
            $seoUl.hide();
            $seoUl.eq($(this).index()).show();
        });
        // 引入统计代码
        require.async('jsub/_vb.js?c=xf_lp^xxlb_wap');
        require.async('jsub/_ubm.js?_2017102307fdsfsdfdsd', function () {
            _ub.city = vars.ubcity;
            // 业务---WAP端
            _ub.biz = 'n';
            // 方位（南北方) ，北方为0，南方为1
            _ub.location = vars.ublocation;
            // 用户动作（浏览0、搜索1、打电话31、即时通讯24、预约25）
            var b = 1;
            var schooolKey = {
                L: '小学',
                KG: '幼儿园',
                JH: '初中',
                SH: '高中',
                M: '中学(完中)',
                NYS: '九年一贯制学校'
            };
            var schoolType = vars.paramschooltype ? encodeURIComponent(schooolKey[vars.paramschooltype]) : '';
            var pTemp = {
                // 区域
                'vmn.position': encodeURIComponent(vars.paramdistrict),
                // 类别
                'vmn.schooltype': schoolType,
                // 所属页面
                'vmg.page': 'xf_lp^xxlb_wap',
                'vmg.sourceapp':vars.is_sfApp_visit + '^xf'

            };
            // 用户行为(格式：'字段编号':'值')
            var p = {};
            // 若pTemp中属性为空或者无效，则不传入p中
            for (var temp in pTemp) {
                if (pTemp[temp] && pTemp[temp].length > 0) {
                    p[temp] = pTemp[temp];
                }
            }
            // 收集方法
            _ub.collect(b, p);
        });
    });