/**
 * @file js合并，ESLint
 * @author fcwang(wangfengchao@soufun.com)
 */
define('modules/tudi/tudiList', ['jquery', 'slideFilterBox/1.0.0/slideFilterBox', 'loadMore/1.0.0/loadMore'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var IScroll = require('slideFilterBox/1.0.0/slideFilterBox');
        var vars = seajs.data.vars;
        var loadMore = require('loadMore/1.0.0/loadMore');

        // 禁用/启用touchmove
        var toggleTouchmove = (function () {
            var preventDefault = function (e) {
                e.preventDefault();
            };
            return function (unable) {
                document[unable ? 'addEventListener' : 'removeEventListener']('touchmove', preventDefault);
            };
        })();
        // 记录筛选项高度和单屏筛选框个数
        var refreshPosLog = (function () {
            // 只执行一次
            var isFirst = 1;
            var posLog = {};
            return function ($filterMenu) {
                if ($filterMenu && isFirst) {
                    var boxHeight = parseInt($filterMenu.css('height'), 10);
                    var ddHeight = parseInt($filterMenu.find('dd').css('height'), 10);
                    // 筛选项高度
                    posLog.height = ddHeight;
                    // 单屏筛选项个数
                    posLog.length = boxHeight / ddHeight;
                    isFirst = 0;
                }
                return posLog;
            };
        })();
        // 滚动条定位
        var refreshScroll = (function () {
            // 使包裹层id唯一
            var sequence = 0;
            return function ($dlEle, posLog) {
                // 如果当前dl不是父元素的第一个子元素，外层包裹一层使其成为父元素的第一个子元素，用于添加滚动
                if ($dlEle.index()) {
                    $dlEle.wrap('<div id="scroll-wrap' + sequence + '"></div>').parent().css({
                        overflow: 'hidden',
                        height: '100%'
                    });
                    sequence++;
                }
                // 添加滚动条的父元素id
                var scrollId = $dlEle.parent()[0].id;
                IScroll.refresh('#' + scrollId);
                // 当前筛选菜单下的筛选项
                var $dd = $dlEle.find('dd');
                // 筛选项总数
                var length = $dd.length;
                // 当前选中筛选项的序数
                var index = $dd.filter('.active,.activeL').index();
                // 大于一屏
                if (index > posLog.length - 1) {
                    IScroll.to('#' + scrollId, 0, -index * posLog.height);
                    // 最后一屏
                    if (length - index < posLog.length) {
                        IScroll.to('#' + scrollId, 0, -(length - posLog.length) * posLog.height);
                    }
                }
            };
        })();
        // 筛选盒子
        var $filterBox = $('#filterBox');
        $filterBox.find('.active').addClass('activeL');
        // 遮罩
        var $float = $('.float');
        var districtInfo = {
            quyu: {
                url: vars.tudiSite + '?c=tudi&a=ajaxGetArea&type=' + vars.objtype + '&quyuid='
            },
            province: {
                url: vars.tudiSite + '?c=tudi&a=ajaxGetArea&type=' + vars.objtype + '&provinceid='
            },
            city: {
                url: vars.tudiSite + '?c=tudi&a=ajaxGetArea&type=' + vars.objtype + '&city_id='
            }
        };
        var provCodeMap = {
            province_110000: ['city_110100', 'district_search'],
            province_120000: ['city_120100', 'district_search'],
            province_310000: ['city_310100', 'district_search'],
            province_500000: ['city_500100', 'district_search']
        };
        var cityCodeArr = ['110100', '120100', '310100', '500100'];
        var provIdArr = ['province_110000', 'province_120000', 'province_310000', 'province_500000'];

        function getDistrictContent(id, $nextsection) {
            var idArr = id.split('_');
            var type = idArr[0];
            var code = idArr[1];
            var tag = false;
            // 非直辖市不需要区县，不限不用查询
            if ($.inArray(id, provIdArr) !== -1 || !districtInfo[type] || type === 'city' && $.inArray(code, cityCodeArr) === -1) {
                return false;
            }
            var $ele = $('<dl id="' + $nextsection[0].id + '_' + code + '"></dl>');
            $.ajax({
                url: districtInfo[type].url + code,
                async: false,
                success: function (data) {
                    if (data) {
                        $ele.append(data).appendTo($nextsection);
                        tag = true;
                    }
                }
            });
            $ele = tag && $ele;
            return $ele;
        }
        // 初始化，选中已选择筛选项
        var activeLocation = (function ($nowsection) {
            var location = [];
            if (vars.region) {
                var $nextsection = $nowsection.next();
                var $targetFilter = null;
                location.push('quyu_' + vars.region.replace(/_[a-z]{2}/i, ''));
                vars.province && location.push('province_' + vars.province.replace(/_[a-z]{2}/i, ''));
                vars.city && location.push('city_' + vars.city.replace(/_[a-z]{2}/i, ''));
                vars.area && location.push('district_' + vars.area.replace(/_[a-z]{2}/i, ''));
                for (var i = 0, len = location.length; i < len; i++) {
                    var id = location[i];
                    var $target = $('#' + id);
                    $target.length && $target.addClass('activeL').siblings('dd').removeClass('activeL active');
                    $targetFilter = $nextsection.length ? getDistrictContent(id, $nextsection) : null;
                    if ($targetFilter) {
                        $targetFilter.children().eq(0).addClass('activeL');
                        $nextsection = $nextsection.next();
                    }
                }
            }
            return location;
        })($('#quyu_search'));

        // 选中筛选项，如果存在子筛选菜单，递归展示子筛选菜单的选中情况
        var activeFilter = (function () {
            // 用于区别是否是区域，区域需要进行ajax请求生成筛选列
            var isDistrict = false;
            return function (element, e) {
                // 当前点击节点
                var ele = element;
                var $ele = $(ele);
                var href = $ele.find('a').attr('href');
                isDistrict = $ele.parents('.cont')[0].id === 'select_quyu';
                if (!href || href === '#' || /^javascript/i.test(href)) {
                    e && e.preventDefault();
                    // 当前点击节点选中，其兄弟节点不选中
                    $ele.addClass('active').siblings().removeClass('active');
                    // 当前结点所在的筛选菜单
                    var $section = $ele.parents('section').eq(0);
                    var $nextsection, $targetFilter, eleId, idKey, nextId, targetId;
                    // scroll定位的参数，包裹单个筛选项的高度和单屏显示的筛选项个数
                    var posLog = refreshPosLog();
                    // 筛选菜单id
                    do {
                        // 下一级筛选菜单
                        $nextsection = $section.next();
                        // 如果存在下一级筛选菜单
                        if ($nextsection.length) {
                            // 当前节点id,如果是直辖市，跳过第三级
                            eleId = ele.id;
                            eleId = provCodeMap[eleId] && provCodeMap[eleId][0] || eleId;
                            // 下一级筛选菜单section的id
                            nextId = provCodeMap[eleId] && provCodeMap[eleId][1] || $nextsection[0].id;
                            // 当前节点id的关键值
                            idKey = eleId.match(/_[a-z0-9]+$/i);
                            idKey = idKey && idKey[0];

                            // 关联的下一级菜单dl的id
                            targetId = nextId + idKey;
                            // 当前点击项关联的下一级菜单dl
                            $targetFilter = $nextsection.find('#' + targetId);
                            // 如果存在关联的下一级菜单
                            if (idKey && ($targetFilter.length || isDistrict)) {
                                // ajax刷新节点
                                $targetFilter.length || ($targetFilter = getDistrictContent(eleId, $nextsection));

                                // 下一级菜单显示，当前操作菜单切换为下一级操作菜单
                                if (!$targetFilter.length) {
                                    break;
                                }
                                $section = $nextsection.show();
                                if ($targetFilter.parent('div').length) {
                                    // 如果当前dl存在div其有scroll-wrap包裹，则显示scroll-wrap，并隐藏scroll-wrap的兄弟
                                    $targetFilter.parent().show().siblings().hide();
                                } else {
                                    // 如果当前dl不存在div其有scroll-wrap包裹，则显示当前节点，并隐藏当前节点的兄弟
                                    $targetFilter.show().siblings().hide();
                                }

                                // 下一级菜单是否有选中节点
                                $ele = $targetFilter.find('.activeL');
                                ele = $ele[0];
                                // 如果没有选中节点，循环结束
                                if (!ele) {
                                    $targetFilter.find('.active').removeClass('active');
                                    break;
                                } else {
                                    $ele.addClass('active').siblings().removeClass('active');
                                }
                                // 添加scroll
                                refreshScroll($targetFilter, posLog);
                            } else {
                                break;
                            }
                        } else {
                            break;
                        }
                    } while (ele);
                    // 如果有之后层级，隐藏之后层级的筛选项
                    var $nextAll = $section.nextAll();
                    $nextAll.length && $nextAll.hide();
                }
            };
        })();

        // 切换筛选菜单
        var toggleFilter = (function () {
            // 缓存当前是否是显示
            var isShow = 0;
            // 是否第一次执行
            // var firstFlterObj = {};
            // 缓存当前点击节点,用于float点击时作为默认节点
            var eleOld;
            return function (element) {
                // 当前点击节点
                var ele = eleOld = element || eleOld;
                var $ele = $(ele);
                // 筛选菜单id
                var filterId = ele.id;
                // 弹出菜单
                var $filterMenu = $filterBox.find('#select_' + filterId);
                // 当前菜单项切换active，其他菜单项取消active
                $ele.toggleClass('active').siblings('li').removeClass('active');
                // 当前菜单对应的弹出菜单切换显示其他弹出菜单隐藏
                $filterMenu.toggle().siblings('div').hide();
                // 当前是否显示
                var isShowNow = $ele.hasClass('active');
                // 如果当前和缓存状态不同，进行包裹和遮罩的切换，并更新缓存
                if (isShowNow !== isShow) {
                    $float.toggle();
                    $filterBox.toggleClass('tabSX');
                    isShow = isShowNow;
                }
                var posLog = refreshPosLog($filterMenu);
                // 刷新纵向滚动
                isShow && refreshScroll($('#' + filterId + '_search').find('dl'), posLog);
                // 切换touchmove
                toggleTouchmove(isShow);
                filterId === 'quyu' && $ele.hasClass('active') && activeLocation.length && activeFilter(document.getElementById(activeLocation[0]));
            };
        })();
        // 筛选菜单点击事件
        $filterBox.find('li').on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            toggleFilter(this);
        });
        // 浮层点击事件
        $float.on('click', function (e) {
            e.preventDefault();
            toggleFilter();
        });
        // 筛选项上的点击事件
        $filterBox.on('click', 'dd', function (e) {
            return activeFilter(this, e);
        });
        loadMore({
            // 接口地址
            url: vars.tudiSite + '?c=tudi&a=ajaxGetTudi&type=' + vars.objtype + '&region=' + vars.region + '&province=' + vars.province + '&city=' + vars.city + '&area=' + vars.area + '&itemtypelanduse=' + vars.itemtypelanduse + '&minarea=' + vars.minarea + '&maxarea=' + vars.maxarea + '&form=' + vars.form + '&minamount=' + vars.minamount + '&maxamount=' + vars.maxamount + '&order=' + vars.order + '&desc=' + vars.desc,
            // 数据总条数
            total: vars.total,
            // 首屏显示数据条数
            pagesize: vars.pagesize,
            // 单页加载条数
            pageNumber: vars.pagesize,
            // 加载更多按钮id
            moreBtnID: '#drag',
            // 加载数据过程显示提示id
            loadPromptID: '#moreContent',
            // 数据加载过来的html字符串容器
            contentID: '#content',
            // 加载前显示内容
            loadAgoTxt: '查看更多',
            // 加载中显示内容
            loadingTxt: '<i></i>努力加载中...',
            // 加载完成后显示内容
            loadedTxt: '查看更多'
        });

        // 点击城市
        $filterBox.on('click', '.search_city', locationFunc('_ci', 1));
        // 点击区县
        $filterBox.on('click', '.search_district', locationFunc('_re'));
        // 点击省不限
        $filterBox.on('click', '.display_province', locationFunc('_re'));
        // 点击城市不限
        $filterBox.on('click', '.display_city', locationFunc('_sp'));
        // 点击区县不限
        $filterBox.on('click', '.display_district', locationFunc('_ci'));
        // 跳转

        function locationFunc(unit, tag) {
            return function () {
                var scity = '';
                var name;
                var idArr = [];
                if ($(this).attr('id')) {
                    idArr = $(this).attr('id').split('_');
                    scity = unit + idArr[1];
                }
                if (vars.objtype === '2') {
                    name = 'tdzrlist/';
                } else {
                    name = 'xmzrlist/';
                }
                if (!tag || unit !== '_ci' || $.inArray(idArr[1], cityCodeArr) === -1) {
                    window.location = vars.tudiSite + name + scity + '_it' + vars.itemtypelanduse + '_area' + vars.minarea + '-' + vars.maxarea + '_itf' + vars.form + '_amt' + vars.minamount + '-' + vars.maxamount + '_on' + vars.order + '_ot' + vars.desc;
                }
            };
        }
    };
});