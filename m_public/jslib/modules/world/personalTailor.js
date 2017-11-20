/*
 * @file 海外私人订制页
 * @author icy(taoxudong@fang.com)
 */
define('modules/world/personalTailor', ['jquery', 'iscroll/2.0.0/iscroll-lite', 'util/util'], function (require, exports, module) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;
    var IScroll = require('iscroll/2.0.0/iscroll-lite');
    var util = require('util/util');
    var personalTailor = {
        init: function () {
            var that = this;
            that.$selec = $('.selec');
            that.$selectOption = $('.selectOption');
            that.$submitBtn = $('.submitBtn');
            that.data = {};
            that.bindEvent();
            that.initSelect();
        },
        bindEvent: function () {
            var that = this;
            that.$selec.on('click', 'a', function () {
                that.$activeSelect = $(this);
                that.activeType = that.$activeSelect.data('type');
                that.selectClickFn();
            });
            that.$selectOption.on('click', function (e) {
                var $target = $(e.target);
                if ($target.hasClass('sf-maskFixed') || $target.hasClass('cancel')) {
                    that.selectCloseFn();
                } else if ($target.hasClass('return')) {
                    that.selectReturnFn();
                } else if (e.target.tagName === 'LI') {
                    if (!that.disabled) {
                        that.disabled = true;
                        that.activeItem = e.target;
                        that.itemPickFn();
                    }
                }
            });
            that.$submitBtn.on('click', $.proxy(that.submitFn, that));
        },
        initSelect: function () {
            var that = this;
            $.each(that.$selec.find('a'), function (index, ele) {
                var type = $(ele).data('type');
                var $option = that.$selectOption.find('.' + type);
                var $items = $option.find('.activeS');
                var data = {
                    pickItemArr: [],
                    alertMsgArr: []
                };
                $.each($items, function (index, item) {
                    var $item = $(item);
                    data.pickItemArr.push($item);
                    data.alertMsgArr.push($item.text());
                });
                that.data[type] = data;
            });
        },
        selectClickFn: function () {
            var that = this;
            var $activeOption = that.$activeOption = that.$selectOption.find('.' + that.activeType);
            var $activeList = $activeOption.find('.con').eq(0);
            $activeList.show().nextAll().hide();
            $activeOption.find('.return').hide();
            $activeOption.show();
            that.activeScroll = that.activeList = $activeList[0];
            that.IScrollEvent();
            that.pickItemArr = [];
            that.alertMsgArr = [];
            that.toggleTouchmove(1);
        },
        selectCloseFn: function () {
            var that = this;
            that.$activeOption.hide();
            that.toggleTouchmove(0);
            var bakInfo = that.data[that.activeType];
            that.alertMsgArr = bakInfo.alertMsgArr;
            that.refreshAlertMsg();
            that.$activeOption.find('.activeS').removeClass('activeS');
            $.each(bakInfo.pickItemArr, function (index, ele) {
                $(ele).addClass('activeS');
            });
        },
        selectReturnFn: function () {
            var that = this;
            var $item = that.pickItemArr.pop();
            that.alertMsgArr.pop();
            $item.removeClass('activeS');
            that.refreshAlertMsg();
            $(that.activeList).hide();
            if (that.pickItemArr.length) {
                that.activeList = $item.parents('.con')[0];
            } else {
                that.activeList = that.$activeOption.find('.con')[0];
                that.$activeOption.find('.return').hide();
            }
            $(that.activeList).show();
        },
        // 底部筛选框 完成
        selectCompleteFn: function () {
            var that = this;
            that.$activeOption.hide();
            that.toggleTouchmove(0);
            that.data[that.activeType] = {
                pickItemArr: that.pickItemArr,
                alertMsgArr: that.alertMsgArr
            };
        },
        itemPickFn: function () {
            var that = this;
            var $activeList = $(that.activeList);
            var $item = $(that.activeItem);
            var value = $item.data('id');
            that.pickItemArr.push($item);
            that.alertMsgArr.push($item.text());
            var $nextList, $nextScroll;
            $nextList = $activeList.next('.con');
            $item.addClass('active activeS').siblings().removeClass('activeS');
            that.activeList = $nextList[0];
            setTimeout(function () {
                $activeList.hide();
                that.refreshAlertMsg();
                if ($nextList.length) {
                    that.$activeOption.find('.return').show();
                    $nextList.show();
                    if ($nextList.children('div').length) {
                        $nextScroll = $nextList.find('.' + value);
                        if ($nextScroll.length) {
                            $nextScroll.show().siblings().hide();
                            that.activeScroll = $nextScroll[0];
                        } else {
                            $activeList.nextAll('.con').find('.activeS').removeClass('activeS');
                            that.selectCompleteFn();
                            return;
                        }
                    } else {
                        that.activeScroll = that.activeList;
                    }
                    that.IScrollEvent();
                } else {
                    that.selectCompleteFn();
                }
            }, 200);
            setTimeout(function () {
                $item.removeClass('active');
                that.disabled = false;
            }, 600);
        },
        refreshAlertMsg: function () {
            var that = this;
            var $info = that.$activeOption.find('.info');
            var length = that.alertMsgArr.length;
            $info.text(length ? that.alertMsgArr.join(' ') : $info.data('ph'));
            that.$activeSelect.text(length ? that.alertMsgArr.join(' ') : that.$activeSelect.data('ph'));
            that.$activeSelect[length ? 'addClass' : 'removeClass']('cur');
        },
        submitFn: function () {
            var that = this;
            that.storeData();
        },
        storeData: function () {
            var that = this;
            var price = ($(that.data.hprice.pickItemArr[0]).data('id') || '-').split('-');
            var cookie = {
                neworesf: $(that.data.htype.pickItemArr[0]).data('id'),
                purpose: $(that.data.ptype.pickItemArr[0]).data('id'),
                purposekey: $(that.data.ptype.pickItemArr[0]).data('purposekey'),
                pricemin: price[0],
                pricemax: price[1]
            };
            var area = that.data.area.pickItemArr;
            if (area.length) {
                var $first = $(area[0]);
                var $last = $(area[area.length - 1]);
                cookie.country = $first.data('id');
                cookie.path = $last.data('path');
                cookie.key = $last.data('key');
            }
            util.setCookie('ptdata', JSON.stringify(cookie), 30);
            util.setCookie('ptkey', '1', 1);
            location.href = vars.worldSite;
        },

        // iscroll滚动
        // 添加滚动
        IScrollEvent: (function () {
            var eleList = [];
            var isList = [];
            return function () {
                // 滑动
                var that = this;
                that.posLog = that.refreshPosLog();
                var is;
                var ele = that.activeScroll;
                var index = $.inArray(ele, eleList);
                if (index === -1) {
                    is = new IScroll(ele);
                    eleList.push(ele);
                    isList.push(is);
                } else {
                    is = isList[index];
                    is.refresh();
                }
                // 当前筛选菜单下的筛选项
                var $li = $(ele).find('li');
                // 筛选项总数
                var length = $li.length;
                // 当前选中筛选项的序数
                var itemIndex = $li.filter('.activeS').index();
                // 大于一屏
                if (itemIndex > that.posLog.length - 1) {
                    is.scrollTo(0, -itemIndex * that.posLog.height);
                    // 最后一屏
                    if (length - itemIndex < that.posLog.length) {
                        is.scrollTo(0, -(length - that.posLog.length) * that.posLog.height);
                    }
                }
            };
        })(),
        // 记录筛选项高度和单屏筛选框个数
        refreshPosLog: (function () {
            // 只执行一次
            var isFirst = 1;
            var posLog = {};
            return function () {
                if (isFirst) {
                    var that = this;
                    var $filterMenu = $(that.activeScroll);
                    var boxHeight = parseInt($filterMenu.css('height'), 10);
                    var ddHeight = parseInt($filterMenu.find('li').eq(0).css('height'), 10);
                    // 筛选项高度
                    posLog.height = ddHeight;
                    // 单屏筛选项个数
                    posLog.length = boxHeight / ddHeight;
                    isFirst = 0;
                }
                return posLog;
            };
        })(),
        toggleTouchmove: vars.worldUtils.toggleTouchmove
    };
    module.exports = personalTailor;
});