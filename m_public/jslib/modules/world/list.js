define('modules/world/list', ['jquery', 'modules/world/yhxw', 'iscroll/1.0.0/iscroll', 'lazyload/1.9.1/lazyload', 'loadMore/1.0.0/loadMore'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        // 延迟加载图片
        require.async('lazyload/1.9.1/lazyload', function () {
            $('img[data-original]').lazyload();
        });
        // 加载更多功能
        require.async(['loadMore/1.0.0/loadMore'], function (loadMore) {
            var pageUrl = $('#pageUrl').data('pageurl'),
                totalcount = $('#totalcount').data('totalcount');
            loadMore({
                total: totalcount,
                pagesize: 10,
                firstDragFlag: false,
                moreBtnID: '#drag',
                loadPromptID: '#draginner',
                contentID: '#pageContent',
                loadAgoTxt: '<a>查看更多</a>',
                loadingTxt: '<span><i></i>努力加载中...</span>',
                loadedTxt: '<a>上拉自动加载更多</a>',
                url: pageUrl
            });
        });

        // 引入用户行为分析对象-埋码
        var yhxw = require('modules/world/yhxw');
        // 判断详情页种类，传入用户行为统计对象
        var pageId = 'mwhouselist';
        // 埋码变量数组
        var condition = $('#condition').val();
        var conditionArr = new Array();
        if (condition === '国家') {
            condition = '';
        }
        conditionArr = condition.split('-');
        //console.log(conditionArr);
        var totalprice = $('#totalprice').val() !== '价格' ? $('#totalprice').val().replace(/[^\d-]+/g, '') : '';
        if (totalprice === '100') {
            totalprice = '0-100';
        } else if (totalprice === '3000') {
            totalprice === '3000-99999';
        }
        var dwellingtype = $('#dwellingtype').val() !== '类型' ? $('#dwellingtype').val() : '';
        var maiMaParams = {
            'vmg.page': pageId,
            'vmw.country': encodeURIComponent(conditionArr[0]),
            'vmw.city': encodeURIComponent(conditionArr[1] || ''),
            'vmw.district': encodeURIComponent(conditionArr[2] || ''),
            'vmw.totalprice': totalprice,
            'vmw.dwellingtype': encodeURIComponent(dwellingtype)
        };
        yhxw({
            type: 1,
            pageId: pageId,
            params: maiMaParams
        });

        $(document).on('click', 'li[data-url]', function (e) {
            var et = e || event;
            var evObj = et.currentTarget;
            if (evObj.nodeName === 'LI') {
                window.location.href = $(evObj).data('url');
            }
        });
        var districtSection = $('#district_section');
        var classIsFloat = $('.float');
        var IdIsSec = $('#sec');
        var touchmoveToggle = (function () {
            var disableBak = 0;
            var preventDefault = function (e) {
                e.preventDefault();
            };
            return function (disable) {
                if (disableBak !== disable) {
                    $(window)[disable ? 'on' : 'off']('touchmove', preventDefault);
                    disableBak = disable;
                }
            };

        })();
        require.async('iscroll/1.0.0/iscroll', function (iscrollCtrl) {
            $('#position').on('click', function () {
                if ($('#position').hasClass('active')) {
                    IdIsSec.removeClass('tabSX');
                    $(this).removeClass('active');
                    $('#price').removeClass('active');
                    $('#hot').removeClass('active');
                    $('#all').removeClass('active');
                    $('#country').hide();
                    $('#cont_price').hide();
                    $('#cont_hot').hide();
                    $('#cont_all').hide();
                    classIsFloat.hide();
                    touchmoveToggle();
                } else {
                    IdIsSec.addClass('tabSX');
                    $(this).addClass('active');
                    $('#price').removeClass('active');
                    $('#hot').removeClass('active');
                    $('#all').removeClass('active');
                    $('#cont_price').hide();
                    $('#country').show();
                    if (vars.shai_con && vars.shai_city) {
                        if (districtSection.css('display') !== 'none') {
                            districtSection.hide();
                        }
                        $('#citys_section').show();
                        $('.citys_dl').hide();
                        $('#city_' + vars.shai_con).show();
                        iscrollCtrl.refresh('#citys_section');
                    }
                    if (vars.shai_city && vars.shai_city !== 'buxian' && vars.shai_dis) {
                        districtSection.show();
                        $('.district_dl').hide();
                        $('#district_' + vars.shai_city).show();
                        iscrollCtrl.refresh('#district_section');
                    }
                    $('#cont_hot').hide();
                    $('#cont_all').hide();
                    classIsFloat.show();
                    touchmoveToggle(1);
                    classIsFloat.css('height', $(window).height() + 100 + 'px');
                    iscrollCtrl.refresh('#country section');
                }
            });
            // 二级城市
            $('.country_dl').on('click', 'a', function (e) {
                var aEl = e.target;
                var dataId = $(aEl).data('country');
                $(this).parent().addClass('active');
                $(this).parent().siblings().removeClass('active');
                if (dataId) {
                    if (districtSection.css('display') !== 'none') {
                        districtSection.hide();
                    }
                    $('#citys_section').show();
                    $('.citys_dl').hide();
                    $('#city_' + dataId).show();
                    iscrollCtrl.refresh('#citys_section');
                }
            });
            // 三级区域
            $('.citys_dl').on('click', 'a', function (e) {
                var aEl = e.target;
                var dataId = $(aEl).data('city');
                $(this).parent().addClass('active');
                $(this).parent().siblings().removeClass('active');
                if (dataId && dataId !== 'buxian') {
                    districtSection.show();
                    $('.district_dl').hide();
                    $('#district_' + dataId).show();
                    iscrollCtrl.refresh('#district_section');
                }
            });
            // 类型
            $('#hot').on('click', function () {
                if ($('#hot').hasClass('active')) {
                    IdIsSec.removeClass('tabSX');
                    $(this).removeClass('active');
                    $('#position').removeClass('active');
                    $('#price').removeClass('active');
                    $('#all').removeClass('active');
                    $('#cont_price').hide();
                    $('#county').hide();
                    $('#cont_hot').hide();
                    $('#cont_all').hide();
                    classIsFloat.hide();
                    touchmoveToggle();
                } else {
                    IdIsSec.addClass('tabSX');
                    $(this).addClass('active');
                    $('#position').removeClass('active');
                    $('#price').removeClass('active');
                    $('#all').removeClass('active');
                    $('#cont_hot').show();
                    $('#county').hide();
                    $('#cont_price').hide();
                    $('#cont_all').hide();
                    classIsFloat.show();
                    touchmoveToggle(1);
                    classIsFloat.css('height', $(window).height() + 100 + 'px');
                }
                // 可以滑动
                iscrollCtrl.refresh('#cont_hot section');
            });
        });
        // 价格
        $('#price').on('click', function () {
            if ($('#price').hasClass('active')) {
                IdIsSec.removeClass('tabSX');
                $(this).removeClass('active');
                $('#position').removeClass('active');
                $('#hot').removeClass('active');
                $('#all').removeClass('active');
                $('#cont_price').hide();
                $('#county').hide();
                $('#cont_hot').hide();
                $('#cont_all').hide();
                classIsFloat.hide();
                touchmoveToggle();
            } else {
                IdIsSec.addClass('tabSX');
                $(this).addClass('active');
                $('#position').removeClass('active');
                $('#hot').removeClass('active');
                $('#all').removeClass('active');
                $('#cont_price').show();
                $('#county').hide();
                $('#cont_hot').hide();
                $('#cont_all').hide();
                classIsFloat.show();
                touchmoveToggle(1);
                classIsFloat.css('height', $(window).height() + 100 + 'px');
            }
        });

        // 全部
        $('#all').on('click', function () {
            IdIsSec.addClass('tabSX');
            if ($('#all').hasClass('active')) {
                IdIsSec.removeClass('tabSX');
                $(this).removeClass('active');
                $('#position').removeClass('active');
                $('#price').removeClass('active');
                $('#hot').removeClass('active');
                $('#cont_price').hide();
                $('#county').hide();
                $('#cont_hot').hide();
                $('#cont_all').hide();
                classIsFloat.hide();
                touchmoveToggle();
            } else {
                IdIsSec.addClass('tabSX');
                $(this).addClass('active');
                $('#position').removeClass('active');
                $('#price').removeClass('active');
                $('#hot').removeClass('active');
                $('#cont_all').show();
                $('#county').hide();
                $('#cont_hot').hide();
                $('#cont_price').hide();
                classIsFloat.show();
                touchmoveToggle(1);
                classIsFloat.css('height', $(window).height() + 100 + 'px');
            }
        });

        // 添加底部遮罩层
        classIsFloat.on('click', function () {
            if (classIsFloat.css('display') !== 'none') {
                classIsFloat.hide();
                touchmoveToggle();
                $('#county,#cont_price,#cont_hot,#cont_all').hide();
                $('.cont').hide();
                $('#position,#price,#hot,#all').removeClass('active');
                IdIsSec.removeClass('tabSX');
            }
        });
    };
});