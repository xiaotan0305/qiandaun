/**
 * 家居多级筛选
 * @author icy(taoxudong@fang.com)
 */
define('modules/jiaju/filters', ['jquery', 'slideFilterBox/1.0.0/slideFilterBox'], function (require, exports, module) {
    'use strict';
    var $ = require('jquery');
    var IScroll = require('slideFilterBox/1.0.0/slideFilterBox');
    var jiajuUtils = seajs.data.vars.jiajuUtils;

    function FilterBox() {}
    FilterBox.prototype.toggleTouchmove = function () {
        var that = this;
        jiajuUtils.toggleTouchmove(that.isMenuShow);
    };
    // 记录筛选项高度和单屏筛选框个数
    FilterBox.prototype.refreshPosLog = function () {
        var that = this;
        if (!that.posLog) {
            var $filterMenu = that.$filterMenu;
            var posLog = {};
            if ($filterMenu.length) {
                var boxHeight = parseInt($filterMenu.css('height'), 10);
                var ddHeight = parseInt($filterMenu.find('dd').css('height'), 10);
                // 筛选项高度
                posLog.height = ddHeight;
                // 单屏筛选项个数
                posLog.length = boxHeight / ddHeight;
                that.posLog = posLog;
            }
        }
        return that.posLog;
    };
    // 滚动条定位
    FilterBox.prototype.refreshScroll = function ($list) {
        var that = this;
        // 如果当前dl不是父元素的第一个子元素，外层包裹一层使其成为父元素的第一个子元素，用于添加滚动
        if ($list.index()) {
            $list.wrap('<div id="scroll-wrap' + that.sequence + '"></div>').parent().css({
                overflow: 'hidden',
                height: '100%'
            });
            that.sequence++;
        }
        // 添加滚动条的父元素id
        var scrollId = $list.parent()[0] ? $list.parent()[0].id : '';
        if (scrollId) {
            IScroll.refresh('#' + scrollId);
        }
        //只有快筛进行定位
        if (!that.noFastFilter) {
            // 当前筛选菜单下的筛选项
            var $dd = $list.find('dd');
            // 筛选项总数
            var length = $dd.length;
            var posLog = that.refreshPosLog();
            // 当前选中筛选项的序数
            var index = $dd.filter('.active').index();
            // 横向筛选中实际的posLog.length 要少一个
            // 大于一屏
            if (index > (that.isRowType ? (posLog.length - 1) : posLog.length) - 1) {
                IScroll.to('#' + scrollId, -index * posLog.height, 0);
                // 最后一屏
                if (length - index < (that.isRowType ? (posLog.length - 1) : posLog.length)) {
                    IScroll.to('#' + scrollId, -1 * (length - posLog.length + 1) * posLog.height, 0);
                }
            }
        }
    };
    // 切换菜单
    FilterBox.prototype.toggleFilter = function (element) {
        var that = this;
        // 当前点击节点(element值重置activeMenu)
        var ele = that.activeMenu = element || that.activeMenu;
        var $ele = $(ele);
        // 筛选菜单id
        var filterId = ele.id;
        // 弹出菜单
        var $filterMenu = that.$filterBox.find('#' + filterId + 'box');
        that.$filterMenu = $filterMenu;
        // 当前菜单项切换active，其他菜单项取消active
        $ele.toggleClass('active').siblings('li').removeClass('active');
        // 当前菜单对应的弹出菜单切换显示其他弹出菜单隐藏
        $filterMenu.toggle().siblings('div').hide();
        // 当前是否显示
        var isShowNow = $ele.hasClass('active');
        // 如果当前和缓存状态不同，进行包裹和遮罩的切换，并更新缓存
        if (isShowNow !== that.$filterBox.hasClass('tabSX')) {
            that.$float.toggle();
            that.$filterBox.toggleClass('tabSX');
            that.isMenuShow = isShowNow;
        }
        // 切换touchmove
        that.toggleTouchmove();
        var $filterList = $('#s_' + filterId);

        // 增加筛选和只能排序的滑动调用 tankunpeng@20170721
        var $filterMenuSections = $filterMenu.find('section');
        if ($filterMenuSections.length === 1) {
            var dlBox = $filterMenuSections.find('dl');
            var dlId = dlBox.attr('id');
            if (/\w+scroll/.test(dlId)) {
                dlBox.css({
                    height: '100%',
                    overflow: 'hidden'
                })
                IScroll.refresh('#' + dlId);
            }else {
                IScroll.refresh('#' + $filterMenuSections.attr('id'));
            }

        }
        /*刷新纵向滚动
         (纵向筛选改为横向筛选不执行)
         */
        that.isMenuShow && !$filterList.find('dd').hasClass('otherType') && that.refreshScroll($filterList.find('dl'));
        // 初始化active，使带有active的筛选菜单显示
        !that.noFastFilter && that.isMenuShow && that.showActiveMenu(filterId);
    };
    // 选中筛选项，如果存在子筛选菜单，递归展示子筛选菜单的选中情况
    FilterBox.prototype.activeFilter = function (element, e) {
        var that = this;
        // 当前点击节点
        var ele = element;
        var $ele = $(ele);
        var href = $ele.find('a').attr('href');
        if (!href || href === '#' || /^javascript/i.test(href)) {
            // 当前点击节点选中，其兄弟节点不选中
            $ele.addClass('active').siblings().removeClass('active');
            // 当前结点所在的筛选菜单
            // 判断筛选菜单是div还是section
            var $section;
            if ($ele.hasClass('otherType')) {
                $section = $ele.parents('div').eq(0);
            } else {
                $section = $ele.parents('section').eq(0);
            }
            var $nextsection, $targetFilter, eleId, idKey, nextId, targetId;
            // 筛选菜单id
            do {
                // 下一级筛选菜单
                $nextsection = $section.next();
                // 如果存在下一级筛选菜单
                if ($nextsection.length) {
                    // 当前节点id
                    eleId = ele.id;
                    // 当前节点id的关键值
                    idKey = eleId.match(/_[a-z0-9]+$/i)[0];
                    // 下一级筛选菜单section的id
                    nextId = $nextsection[0].id;
                    // 关联的下一级菜单dl的id
                    targetId = nextId + idKey;
                    // 当前点击项关联的下一级菜单dl
                    $targetFilter = $nextsection.find('#' + targetId);
                    // 如果存在关联的下一级菜单
                    if ($targetFilter.length) {
                        // 下一级菜单显示，当前操作菜单切换为下一级操作菜单
                        $section = $nextsection.show();
                        if ($targetFilter.parent('div').length) {
                            // 如果当前dl存在div其有scroll-wrap包裹，则显示scroll-wrap，并隐藏scroll-wrap的兄弟
                            $targetFilter.parent().show().siblings().hide();
                        } else {
                            // 如果当前dl不存在div其有scroll-wrap包裹，则显示当前节点，并隐藏当前节点的兄弟
                            $targetFilter.show().siblings().hide();
                        }
                        // $ele.siblings().removeClass('active');
                        // 下一级菜单是否有选中节点
                        ele = $targetFilter.find('.active')[0];
                        $ele = $(ele);
                        // 如果没有选中节点，默认选中第一个
                        ele || $targetFilter.find('dd').eq(0).addClass('active');
                        // 添加scroll
                        that.refreshScroll($targetFilter);
                        // 如果没有选中节点，循环结束
                        if (!ele) {
                            break;
                        }
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
    FilterBox.prototype.showActiveMenu = function (filterId) {
        var that = this;
        var activeList = that.getChoiceMenus()[filterId];
        activeList.$menu.find('.active').removeClass('active');
        activeList.$choiceLists.addClass('active');
        that.activeFilter(activeList.$choiceLists[0]);
    };
    FilterBox.prototype.getChoiceMenus = function () {
        var that = this;
        if (!that.choiceMenus) {
            var $filterBox = that.$filterBox;
            var choiceMenus = {};
            $.each($filterBox.find('li'), function (index, li) {
                var id = li.id;
                var $menu = $('#' + id + 'box');
                choiceMenus[id] = {
                    $menu: $menu,
                    $choiceLists: $menu.find('.active')
                };
            });
            that.choiceMenus = choiceMenus;
        }
        return that.choiceMenus;
    };
    FilterBox.prototype.bindEvent = function () {
        var that = this;
        // 筛选菜单点击事件
        that.$filterBox.find('li').on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            if ($(this).hasClass('rowType')) {
                that.isRowType = true;
            }else {
                that.isRowType = false;
            }
            if ($(this).hasClass('noFastFilter')) {
                that.noFastFilter = true;
            }else {
                that.noFastFilter = false;
            }
            that.toggleFilter(this);
        });
        // 浮层点击事件
        that.$float.on('click', function (e) {
            var $li = that.$filterBox.find('li.active');
            if ($li.length !== 0) {
                e.preventDefault();
                that.toggleFilter();
            }
        });
        var jumpUrl = '';
        var touchFlag = false;
        var time1,time2;
        that.$filterBox.find('a').on('touchstart',function(e){
            time1 = e.timeStamp;
        });
        that.$filterBox.find('a').on('touchmove',function(e){
           touchFlag = true;
        });
        // 筛选列表中筛选项的点击事件
        that.$filterBox.find('a').on('touchend',function(e){
            time2 = e.timeStamp;
            jumpUrl = $(this).attr('href');
            that.clickFlag = false;
            if(jumpUrl.match('fang') && ((time2 - time1) < 150) && !touchFlag){
                $(this).attr('href','');
                e.stopPropagation();
                e.preventDefault();
                window.location.href = jumpUrl;
                return false;
            }else{
                setTimeout(function(){
                    that.clickFlag = true;
                },500);
                touchFlag = false;
            }
        });
        // 由click改为touchend 解决ios上房天下APP click事件点透的问题 tankunpeng
        that.$filterBox.on('touchend dbclick','dd',function (e) {
            that.activeFilter(this, e);
        });
        $('.sf-jj-llist').find('a').on('click',function(e){
            e.preventDefault();
            e.stopPropagation();
            var thisHref = $(this).attr('href');
            if(!that.clickFlag){
                $(this).attr('href','');
               window.location.href = jumpUrl;
               return false;
            }else{
                window.location.href = thisHref;
            }
        })
    };
    FilterBox.prototype.init = function (options) {
        this.options = {
            filterBox: '#filterBox',
            float: '.float'
        };
        $.extend(this.options, options);
        // 筛选盒子
        this.$filterBox = $(this.options.filterBox);
        // 遮罩
        this.$float = $(this.options.float);
        // 包裹id序号
        this.sequence = 0;
        // 当前菜单是否是显示
        this.isMenuShow = 0;
        // 当前活动菜单
        this.activeMenu = null;
        // 是否是快筛中的横向类型
        this.isRowType = false;
        // 非快筛
        this.noFastFilter = false;
        this.clickFlag = true;
        this.bindEvent();
    };
    module.exports = function () {
        var filterBox = new FilterBox();
        filterBox.init();
    };
});