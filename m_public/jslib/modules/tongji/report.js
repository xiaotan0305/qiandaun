/**
 * wap统计日报页面
 * by sunwenxiu 2016/10/12
 */

define('modules/tongji/report', ['jquery', 'fixedTblHdrLftCol/fixedTblHdrLftCol', 'dateAndTimeSelect/1.1.0/dateAndTimeSelect'], function(require, exports, module) {
    'use strict';
    require('fixedTblHdrLftCol/fixedTblHdrLftCol');
    module.exports = function() {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        $('input[type=hidden]').each(function(index, element) {
            vars[$(this).attr('data-id')] = element.value;
        });
        // 权限
        var $leftSpan = $('.left span');

        /**
         * 初始化
         */
        var dateAndTimeSelect;
        var tabBtn = $('#tabBtn');
        var tablescroll = $('#tablescroll');
        var scrolled = false;
        var chooseDateArea = $('.chooseDateArea');
        var $selectBtn = $('#selectBtn'),
            // 城市列表
            $selectListB = $('.selectListB');
        var notodayData = $('#notodayData');


        // 加载日期插件
        if (vars.bigAreaName === '全国级' || vars.bigAreaName === '城市级') {
            dateAndTimeSelect = require('dateAndTimeSelect/1.1.0/dateAndTimeSelect');
        }
        // 全国级城市跳转页面无数据情况初始化
        if (vars.bigAreaName === '全国级' && vars.companyid && !vars.dailyDetail) {
            notodayData.show();
        }

        // 离开弹窗
        var layerbg = $('.layerbg'),
            layerstyle = $('.layerstyle'),
            layerBtn = $('.layer-btn'),
            layerSpans = layerBtn.find('span'),
            layerSure = layerSpans.eq(0),
            layerCance = layerSpans.eq(1);
        // 提交日报按钮
        var dataSub = $('#dataSub');
        var chooseDate = $('#chooseDate'),
            aSpan = chooseDate.find('span'),
            dateEle = aSpan.eq(1),
            dateTime = 0;
        // 允许提交
        var allow = false;
        // 全国级别
        if (vars.bigAreaName === '全国级' && vars.companyid) {
            allow = true;
        }
        // 城市级别
        dateTime = str2Time(dateEle.text()).getTime();
        var currentTime = new Date().setHours(0, 0, 0, 0);
        if (vars.bigAreaName === '城市级' && dateTime === currentTime) {
            allow = true;
        }
        // 提交值变化
        var changeValue = false;
        var sureClick = false;

        /**
         * 弹层选择提示
         * @param okfn 确定回调
         * @param cancelfn 取消回调
         */
        function confrim(okfn, cancelfn) {
            if (allow && changeValue && !sureClick) {
                layerbg.show();
                layerstyle.show();
                layerSure.off('click').on('click', function() {
                    okfn && okfn(true);
                    layerbg.hide();
                    layerstyle.hide();
                    sureClick = true;
                    dataSub.addClass('btn-off');
                });
                layerCance.off('click').on('click', function() {
                    cancelfn && cancelfn();
                    layerbg.hide();
                    layerstyle.hide();
                });
            } else {
                okfn && okfn();
            }
        }

        /**
         * 信息弹层
         * @param text 文本内容
         * @param time 显示时间
         * @param callback 回调函数
         */
        var msg = $('#msg'),
            msgP = msg.find('p'),
            timer = null;

        function showMsg(text, time, callback) {
            text = text || '信息有误！';
            time = time || 1500;
            msgP.html(text);
            msg.fadeIn().css({
                position: 'absolute',
                top: $(document).scrollTop() + $(window).height() / 2
            });
            clearTimeout(timer);
            timer = setTimeout(function() {
                msg.fadeOut();
                callback && callback();
            }, time);
        }

        /**
         * @date 2015-10-27
         * 全国权限时，城市列表的相关操作
         */

        // 权限标签 只有全国权限时有下拉城市列表
        var cityBox = $('#cityBox'),
            dailyCity = $('#dailyCity');
        if (vars.bigAreaName === '全国级') {
            /* 显示与隐藏城市列表 */
            $selectBtn.click(function() {
                var $this = $(this),
                    text = $this.text().trim();
                dailyCity.find('li:contains(' + text + ')').map(function() {
                    if ($(this).text().trim() === text) {
                        $(this).addClass('on').siblings().removeClass('on');
                        return;
                    }
                });
                dailyCity.show();
                cityBox.hide();
                $selectListB.toggle();
                $selectBtn.toggleClass('selectBtnUp');
            });


            /* 选取某一城市，改变当前selectBtn容器中的值 */
            $selectListB.on('click', 'li', function() {
                var $this = $(this);
                $('.selectListB li').removeClass('on');
                $selectBtn.toggleClass('selectBtnUp');
                $selectListB.hide();
                /* 选中城市后，执行ajax */
                $this.addClass('on');
                var selectedCity = $this.html();
                vars.activeCityName = selectedCity;
                $selectBtn.text(selectedCity);
                var cityLi = dailyCity.find('li:contains("' + selectedCity + '")');
                if (cityLi.length > 0 && cityLi.text() === selectedCity) {
                    location.href = cityLi.attr('data-href');
                }
            });

            /**
             * 绑定鼠标按下事件，用来监听所有弹出层点击其他位置后隐藏的操作
             */
            $(document).on('touchstart mousedown', function(e) {
                var target = $(e.target);
                var parent = target.closest('ul');
                if (parent.length <= 0 && !target.hasClass('selectBtn') || parent.length > 0 && parent.attr('id') === 'tabBtn') {
                    if ($selectBtn.hasClass('selectBtnUp')) {
                        $selectBtn.removeClass('selectBtnUp');
                    }
                    $selectListB.hide();
                }
            });
        }

        /**
         * 日期类型切换 日报 今日 昨日 本周 本月
         */
        // 日报
        var tabConToday = $('#tabConToday');

        // 全国城市容器
        var cityBoxSpan = $('.left span'),
            // 全国城市切换按钮
            selectBtn = $('.selectBtn');
        initReport();

        function initReport() {
            dtSelect && dtSelect.hide(dtSelect.setting.SELET_TYPE_DATE);
            selectBtn.text(vars.companyname ? vars.companyname : '全国');
            if (vars.bigAreaName === '城市级') {
                // CompanyName 日报显示分公司名称
                cityBoxSpan.text(vars.CompanyName);
            }
            tabConToday.show();
            if (!scrolled) {
                fixedtable(tablescroll);
                scrolled = true;
            }
            if (allow && changeValue) {
                dataSub.removeClass('btn-off');
            }
        }
        /**
         * 获取日报数据
         */
        // 城市级日报
        var todayCity = $('#todayCity');
        // 全国级日报
        var todayQg = $('#todayQg');

        function getDailyData(callback) {
            var url;
            if (vars.bigAreaName === '全国级' && !vars.companyname) {
                url = vars.tongjiSite + '?c=tongji&a=ajaxGetDayReportList';
                url += '&CompanyID=' + vars.CompanyID;
            } else {
                url = vars.tongjiSite + '?c=tongji&a=ajaxFetchDayReport';
                url += '&CompanyID=' + vars.companyid;
            }
            // 日期处理
            url += '&date=' + chooseDateArea.text().replace(/年|月/g, '-').replace('日', '');
            // 城市
            url += '&City=' + vars.City;
            url += '&verifyCode=' + vars.verifyCode;
            url += '&agentid=' + vars.agentId;
            url += '&version=' + vars.version;
            $.get(url, function(data) {
                if (data) {
                    if (vars.bigAreaName === '全国级' && !vars.companyname) {
                        $('.tableScroll').html(data);
                        todayQg.show();
                        todayCity.hide();
                        fixedtable($('#tablescroll'));
                        callback && callback();
                    } else {
                        todayCity.find('dl').remove();
                        todayCity.prepend(data).show();
                        todayQg.hide();
                        callback && callback();
                    }
                    changeValue = false;
                    notodayData.hide();
                    var dateTime = str2Time(dateEle.text()).getTime();
                    var nowTime = new Date().setHours(0, 0, 0, 0);
                    if (vars.bigAreaName !== '全国级' && dateTime < nowTime) {
                        dataSub.hide();
                    } else {
                        dataSub.show().addClass('btn-off');
                    }

                    if (vars.bigAreaName === '城市级' && dateTime === currentTime) {
                        allow = true;
                    }
                } else {
                    notodayData.show();
                    todayCity.hide();
                    todayQg.hide();
                }

            });
        }

        var $moveUrl = vars.tongjiSite + '?c=tongji&a=appStatisticschart&city=' +
            vars.city + '&verifyCode=' + vars.verifyCode + '&agentid=' +
            vars.agentId + '&SearchCity=' + $leftSpan.html() + '&chartType=histogram&src=client';
        $('.datalist').on('click', '.num', function() {
            var $this = $(this);
            if ($this.data('type')) {
                window.location.href = $moveUrl + '&flag=' + $this.data('type');
            }
        });

        /**
         * 日报部分
         */

        var ONE_DATE_TIME = 24 * 60 * 60 * 1000,
            TODAY_TIME = new Date().setHours(0, 0, 0, 0),
            oDate = new Date();
        var dtSelect;
        chooseDate.on('click', 'span', function() {
            var $this = $(this),
                index = $this.index(),
                str = '';
            var dateStr = dateEle.text();
            var dateObj = str2Time(dateStr);
            dateTime = dateObj.getTime();
            switch (index) {
                case 0:
                    confrim(function() {
                        dateTime -= ONE_DATE_TIME;
                        str = time2Str(dateTime);
                        dateEle.text(str);
                        todayCity.hide();
                        todayQg.hide();
                        getDailyData();
                    });
                    break;
                case 1:
                    // 调用时间插件
                    confrim(function() {
                        var options = {
                            type: 'date',
                            yearRange: '2014-' + oDate.getFullYear(),
                            singleLiHeight: 34,
                            defaultTime: oDate.getTime(),
                            maxLimit: true,
                            // 日期确定按钮事件
                            dateConfirmFunc: function(str) {
                                str = str.replace('-', '/');
                                if (new Date(str).getTime() > TODAY_TIME) {
                                    // dtSelect.hide(dtSelect.setting.SELET_TYPE_DATE);
                                    alert('请选择合理的日期');
                                    return;
                                }
                                var arr = str.match(/\d+/g);
                                if (arr.length) {
                                    str = arr[0] + '年' + arr[1] + '月' + arr[2] + '日';
                                }
                                dateTime = new Date(arr[0], arr[1] - 1, arr[2]).getTime();
                                dateEle.text(str);
                                dtSelect.hide(dtSelect.setting.SELET_TYPE_DATE);
                                getDailyData();
                            }
                        };
                        if (!dtSelect) {
                            dtSelect = new dateAndTimeSelect(options);
                        }
                        dtSelect.show(dtSelect.setting.SELET_TYPE_DATE);
                    });
                    break;
                case 2:
                    confrim(function() {
                        if (TODAY_TIME > dateTime) {
                            dateTime += ONE_DATE_TIME;
                            str = time2Str(dateTime);
                            dateEle.text(str);
                            todayCity.hide();
                            todayQg.hide();
                            getDailyData();
                        }
                    });
                    break;
            }
        });

        /**
         * 日期字符串转化成时间对象
         * @param str 日期字符串
         * @returns {Date} 日期对象
         */
        function str2Time(str) {
            return new Date(str.replace(/日| /, '').replace(/年|月|-/g, '/'));
        }

        /**
         * 时间对象转化成日期字符串
         * @param {Date} 日期对象
         * @returns str 日期字符串
         */
        function time2Str(obj) {
            var date = new Date(obj);
            return date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日';
        }

        /**
         * 数据编辑
         */
        var itemList = $('#itemList');
        todayCity.on('click', function(ev) {
            var $ele = $(ev.target),
                id = ev.target.id,
                hasBlue = $ele.hasClass('blue'),
                nodeName = ev.target.nodeName,
                unit = $ele.siblings('.unit'),
                input = $ele.siblings('input');
            if (nodeName === 'SPAN' && hasBlue) {
                var currentTime = new Date().setHours(0, 0, 0, 0);
                dateTime = str2Time(dateEle.text()).getTime();
                if (vars.bigAreaName === '城市级' && dateTime !== currentTime) {
                    return;
                }
                $ele.hide();
                input.show().trigger('focus');
                if (/万元/.test(unit.text())) {
                    $ele[0].initUnit = '万元';
                }
            } else if (vars.bigAreaName === '全国级' && id === 'MonthTaskNum') {
                $ele.hide();
                input.show().trigger('focus');
            }
            // 单位变换
            if (unit.length && /元/.test(unit.text())) {
                unit.text('元');
            }
        }).on('blur', '#itemList input', function(ev) {
            var $this = $(this),
                span = $this.siblings('.num'),
                unit = $this.siblings('.unit'),
                textVal = $this.val(),
                val = +textVal;
            if (val > 10000) {
                span.text(val);
                if (unit.length && /元/.test(unit.text())) {
                    span.text((val / 10000).toFixed(2));
                    unit.text('万元');
                    span[0].unit = '万元';
                }
            } else {
                var text;
                if (!val && textVal === '') {
                    text = span.text();
                    //unit.text('万元');
                } else {
                    text = $this.val();
                }
                span.text(text);
            }
            $this.hide();
            span.show();
        }).on('input', '#itemList input', function() {
            var $this = $(this),
                txt = $this.val().trim(),
                len = txt.length;
            var reg = /^\d{1,9}(\.\d{0,2})?$|^\d{1,10}(\.\d{0,1})?$|^\d{1,12}$/g;
            if (len) {
                // 限制输入位数
                if (!reg.test(txt)) {
                    $this.val(+txt.substring(0, txt.length - 1));
                }

                // 允许提交开关
                changeValue = true;
                sureClick = false;
                dataSub.removeClass('btn-off').text('提交日报');
            }
        });

        /**
         * 数据提交按钮点击
         */
        dataSub.on('click', function() {
            var $this = $(this);
            if (allow && ($this.hasClass('btn-off') || !changeValue)) {
                showMsg('请编辑后再提交');
                return;
            }
            addDayReport();
        });


        /**
         * 数字格式处理
         * @param $obj jquery对象
         * @returns {number} 返回处理后数字
         */
        function formatNum($obj) {
            var obj = $obj[0];
            var string = $obj.text();
            string = string.replace(/,/g, '');
            var num = +string;
            // 提交处理单位
            if (obj.unit && obj.unit === '万元') {
                num *= 10000;
            }
            return num;
        }

        /**
         * 提交数据
         */
        function addDayReport() {
            $.ajax({
                url: vars.tongjiSite + '?c=tongji&a=ajaxAddDayReport',
                type: 'GET',
                data: {
                    City: vars.City,
                    CompanyID: vars.companyid ? vars.companyid : vars.CompanyID,
                    MonthTaskNum: formatNum($('#MonthTaskNum')),
                    TeamNum: formatNum($('#TeamNum')),
                    NetSaleNum: formatNum($('#NetSaleNum')),
                    DayTradeNum: formatNum($('#DayTradeNum')),
                    MonthSumTradeNum: formatNum($('#MonthSumTradeNum')),
                    MonthPerformance: formatNum($('#MonthPerformance')),
                    DayDelegatedHouse: formatNum($('#DayDelegatedHouse')),
                    MonthDelegatedHouse: formatNum($('#MonthDelegatedHouse')),
                    SaleDelegatedHouse: formatNum($('#SaleDelegatedHouse')),
                    MonthMortgageMoney: formatNum($('#MonthMortgageMoney')),
                    MonthShouldRecive: formatNum($('#MonthShouldRecive')),
                    MonthSureRecive: formatNum($('#MonthSureRecive')),
                    MonthSureReciveNew: formatNum($('#MonthSureReciveNew')),
                    MonthSureReciveRent: formatNum($('#MonthSureReciveRent')),
                    verifyCode: vars.verifyCode,
                    agentid: vars.agentId,
                    version: vars.version,
                    DayReprotID: $('#itemList').attr('data-dayreprotid')
                },
                success: function(data) {
                    if (data && data.result === '1') {
                        changeValue = false;
                        dataSub.addClass('btn-off').text('今日已提交');
                        showMsg('<span style="font-size: 16px;">提交成功!</span><br><span style="font-size: 8px;margin-top: 1rem;">提示:日报重新编辑后请再次提交</span>');
                    }
                },
                error: function(err) {}
            });
        }

        /**
         * 全国级日报 滚动设置
         * @param obj 滚动对象
         */
        function fixedtable(obj) {
            obj.fixedTblHdrLftCol({
                scroll: {
                    height: obj.height() > $(window).height() - obj.offset().top - 50 ? $(window).height() - obj.offset().top - 50 : 'auto',
                    width: $(window).width() - 90
                }
            });
        }
    };
});
