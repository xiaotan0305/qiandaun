/**
 * @file js合并，ESLint
 * @author fcwang(wangfengchao@soufun.com)
 */
define('modules/pinggu/worldFangjia', ['jquery', 'modules/world/yhxw', 'iscroll/1.0.0/iscroll', 'iscroll/2.0.0/iscroll-lite', 'chart/line/2.0.0/line'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        // 引入用户行为分析对象-埋码
        var yhxw = require('modules/world/yhxw');
        var pageId = 'mwcheckprices';
        var maimaParams = {
            'vmg.page': 'mwcheckprices'
        };
        // 添加用户行为分析
        yhxw({
            type: 1,
            pageId: pageId,
            params: maimaParams
        });
        var $ = require('jquery');
        var IScroll = require('iscroll/1.0.0/iscroll');
        var Line = require('chart/line/2.0.0/line');
        var vars = seajs.data.vars;
        var $country = $('#fcountry');
        var $city = $('#fcity');
        var $float = $('.float');
        var $filterBox = $('#filterBox');

        var toggleTouchmove = (function () {
            var preventDefault = function (e) {
                e.preventDefault();
            };
            var isShowBak = 0;
            return function (isShow) {
                if (isShowBak !== isShow) {
                    $(window)[isShow ? 'on' : 'off']('touchmove', preventDefault);
                    isShowBak = isShow;
                }
            };
        })();
        var floatToggle = function (isShow) {
            $float[isShow ? 'show' : 'hide']();
            toggleTouchmove(isShow);
        };
        // 记录筛选项高度和单屏筛选框个数
        var refreshPosLog = (function () {
            // 只执行一次
            var isFirst = 1;
            var posLog = {};
            return function (filterMenu) {
                if (filterMenu && isFirst) {
                    var $filterMenu = $(filterMenu);
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
        // 显示城市筛选框
        var showCity = (function () {
            // 使包裹层id唯一
            var sequence = 0;
            var showid = null;
            var posLog = null;
            var $showcity = null;
            return function (id) {
                if (id) {
                    showid = id;
                    $showcity = $(showid);
                    $showcity.show().siblings().hide().find('dd').removeClass('active');
                    $showcity.find('.active').length || $showcity.children().eq(0).addClass('active');
                } else if (showid) {
                    // 如果当前dl不是父元素的第一个子元素，外层包裹一层使其成为父元素的第一个子元素，用于添加滚动
                    if ($showcity.index()) {
                        $showcity.wrap('<div id="scroll-wrap' + sequence + '"></div>').parent().css({
                            overflow: 'hidden',
                            height: '100%'
                        });
                        sequence++;
                    }
                    // 添加滚动条的父元素id
                    var scrollId = $showcity.parent()[0].id;
                    posLog = posLog || refreshPosLog('#' + scrollId);
                    IScroll.refresh('#' + scrollId);
                    // 当前筛选菜单下的筛选项
                    var $dd = $showcity.find('dd');
                    // 筛选项总数
                    var length = $dd.length;
                    // 当前选中筛选项的序数
                    var index = $dd.filter('.active').index();
                    // 大于一屏
                    if (index > posLog.length - 1) {
                        IScroll.to('#' + scrollId, 0, -index * posLog.height);
                        // 最后一屏
                        if (length - index < posLog.length) {
                            IScroll.to('#' + scrollId, 0, -(length - posLog.length) * posLog.height);
                        }
                    }
                }
            };
        })();
        var showSection = function (ele) {
            var id = ele.id;
            var $section = $('#s_' + id);
            $section.show().siblings().hide();
            id === 'fcity' && showCity();
        };

        var refreshFilter = (function () {
            var eleNow = null;
            return function (ele) {
                eleNow = eleNow !== ele ? ele : null;
                if (eleNow) {
                    $filterBox.addClass('tabSX');
                    showSection(eleNow);
                } else {
                    $filterBox.removeClass('tabSX');
                }
                floatToggle(eleNow);
            };
        })();
        var wrapper = null;
        var curveW = $(window).width();
        var line = $('#line');
        var iscrollLite = require('iscroll/2.0.0/iscroll-lite');
        $('#wrapper').width(curveW);
        line.width(curveW * 2);
        var refreshChart = (function () {
            var citybak = null;
            var $caption = $('.hist-mark');
            var captionArr = [];
            var $ttls = $caption.children();
            for (var i = 0, len = $ttls.length; i < len; i++) {
                captionArr.push($ttls.eq(i).text());
            }
            return function () {
                var country = $country.text();
                var city = $city.text();
                if (citybak !== city) {
                    citybak = city;
                    $.get(vars.pingguSite + '?c=pinggu&a=ajaxWorldFangjiaDraw&countryName=' + country + '&city=' + city, function (priceDataPara) {
                        var priceData = priceDataPara;
                        priceData = JSON.parse(priceData);
                        $('#danwei').html(priceData.Title);
                        var arr = [];
                        var index = null;
                        for (var j in priceData.Message) {
                            if ((index = $.inArray(j, captionArr)) !== -1) {
                                arr[index] = {};
                                arr[index].lineColor = index ? '#f90' : '#b5d27e';
                                arr[index].pointColor = index ? '#f90' : '#b5d27e';
                                arr[index].data = [];
                                for (var m in priceData.Message[j]) {
                                    if (priceData.Message[j].hasOwnProperty(m)) {
                                        arr[index].data.push({
                                            name: m.substring(2),
                                            value: priceData.Message[j][m]
                                        });
                                    }
                                }
                            }
                        }
                        $('#line').empty();
                        var l = new Line({
                            width: curveW * 2,
                            height: '175px',
                            w: curveW * 4,
                            h: 350,
                            lineArr: arr,
                            part: 12,
                            // 轨迹是否为曲线
                            isCurve: true
                        });
                        l.run(function (x) {
                            wrapper = new iscrollLite('.cfjChart', {
                                scrollX: true,
                                bindToWrapper: true,
                                eventPassthrough: true
                            });
                            wrapper.scrollTo(-x, 0, 1000);
                        });
                    });
                }
            };
        })();
        refreshChart();

        $filterBox.on('click', 'li', function () {
            var $this = $(this);
            $this.toggleClass('active').siblings().removeClass('active');
            refreshFilter(this);
        });
        $filterBox.on('click', 'dd', function () {
            var $this = $(this);
            $this.addClass('active').siblings().removeClass('active');
            var parentSection = $this.parents('section')[0];
            var isCountry = parentSection.id === 's_fcountry';
            var callback = null;
            if (isCountry) {
                $country.find('span').text($this.text());
                var id = $this.data('id');
                showCity('#fcountry_' + id);
                $city.find('span').text($('#s_fcity').find('.active').text());
            } else {
                $city.find('span').text($this.text());
                callback = function () {
                    refreshChart();
                };
            }
            setTimeout(function () {
                $city.trigger('click');
                callback && callback();
            }, 0);
        });
        $float.on('click', function () {
            $filterBox.find('li').removeClass('active');
            refreshFilter();
        });
        var $selec = $('.selec');
        var $maskFixed = $('.sf-maskFixed');
        var $info = $maskFixed.find('.info');
        var nowFilterid = null;
        var chaxunData = {};
        var $sendFloat = $('#sendFloat');
        var $sendText = $('#sendText');
        var stateid = null;
        var cfjFilter = function (id) {
            nowFilterid = id;
            var boxid = '#' + (id === 'city' ? id + '_' + stateid : id);
            var $box = $(boxid);
            $maskFixed.show();
            $info.text('请选择' + {
                countryName: '国家',
                city: '城市',
                date: '时间',
                housetype: '类型'
            }[id]);
            $box.show().siblings('.con').hide();
            IScroll.refresh(boxid);
            toggleTouchmove(1);
        };
        $selec.on('click', 'li', function (e) {
            e.preventDefault();
            var $this = $(this);
            var id = $this.data('id');
            if (!chaxunData.countryName && id !== 'countryName') {
                $sendText.text('请先选择国家');
                $sendFloat.show();
                setTimeout(function () {
                    $sendFloat.hide();
                }, 2000);
            } else {
                cfjFilter(id);
            }
        });
        var hidemaskFixed = function () {
            $maskFixed.hide();
            toggleTouchmove(0);
        };
        var refreshDateType = (function () {
            var countryName = null;
            return function (country, callback) {
                if (countryName !== country) {
                    countryName = country;
                    $.get(vars.pingguSite + '?c=pinggu&a=ajaxGetWorldFangjiaForCity&countryName=' + countryName, function (countryInfoPara) {
                        $('#citysel').html('请选择城市');
                        var countryInfo = JSON.parse(countryInfoPara);
                        var htmlDate = '<ul>';
                        var htmlHousetype = '<ul>';
                        var lenDate = countryInfo.Dates.length;
                        for (var i = 0; i < lenDate; i++) {
                            htmlDate += '<li>' + countryInfo.Dates[i] + '</li>';
                        }
                        htmlDate += '</ul>';
                        $('#date').html('');
                        $('#date').append(htmlDate);
                        if ($.inArray(chaxunData.date, countryInfo.Dates) === -1) {
                            $('#datesel').html('请选择时间');
                            chaxunData.date = null;
                        }

                        var lenType = countryInfo.HouseType.length;
                        for (var j = 0; j < lenType; j++) {
                            htmlHousetype += '<li>' + countryInfo.HouseType[j] + '</li>';
                        }
                        htmlHousetype += '</ul>';
                        $('#housetype').html('');
                        $('#housetype').append(htmlHousetype);
                        if ($.inArray(chaxunData.housetype, countryInfo.HouseType) === -1) {
                            $('#housetypesel').html('请选择类型');
                            chaxunData.housetype = null;
                        }
                        callback && callback();
                    });
                } else {
                    callback && setTimeout(callback, 350);
                }
            };
        })();
        $maskFixed.on('click', 'li', function () {
            var $this = $(this);
            $this.addClass('active');
            stateid = $this.attr('data-id') || stateid;
            var id = $this.parents('.con')[0].id.replace(/_\d+$/, '');
            var index = $.inArray(id, ['countryName', 'city', 'date', 'housetype']);
            var val = $this.index();
            var text = $this.text();
            chaxunData[id] = text;
            $selec.find('li').eq(index).data('val', val).find('a').text(text);
            var callback = function () {
                hidemaskFixed();
                $this.removeClass('active');
            };
            if (id === 'countryName') {
                refreshDateType(text, callback);
            } else {
                setTimeout(callback, 350);
            }
        });
        var $cancel = $('.cancel,.return');
        $maskFixed.on('click', function (e) {
            e.target === $maskFixed[0] && hidemaskFixed();
        });
        $cancel.on('click', function () {
            hidemaskFixed();
        });
        $('#chaxun').on('click', function () {
            var matcher = $selec.text().match(/(国家|城市|时间|类型)：请选择/);
            if (matcher) {
                $sendText.text('请选择' + matcher[1]);
                $sendFloat.show();
                setTimeout(function () {
                    $sendFloat.hide();
                }, 2000);
            } else {
                $.get(vars.pingguSite + '?c=pinggu&a=ajaxGetWorldFangjiaForPrice', {
                    countryName: encodeURIComponent(chaxunData.countryName),
                    city: encodeURIComponent(chaxunData.city),
                    date: chaxunData.date,
                    housetype: encodeURIComponent(chaxunData.housetype)
                }, function (priceDataPara) {
                    var priceData = JSON.parse(priceDataPara);
                    $('#jieguo').html('' + priceData.Message);
                    var pageId = 'mwcheckprices';
                    var priceArr = priceData.Message.split(' ');
                    var price = Number(priceArr[0]);
                    var priceUnit = priceArr[1];
                    if (priceData.Message.indexOf('万') > -1) {
                        price = Math.floor(price);
                        priceUnit = encodeURIComponent(priceUnit.replace('万', ''));
                    } else {
                        price = Math.floor(price / 10000);
                        priceUnit = encodeURIComponent(priceUnit);
                    }
                    if (price < 100) {
                        price = '0-100';
                    } else if (price > 3000) {
                        price = '3000-99999';
                    }
                    var maimaParams = {
                        'vmw.country': encodeURIComponent(chaxunData.countryName),
                        'vmw.city': encodeURIComponent(chaxunData.city),
                        'vmw.date': chaxunData.date,
                        'vmw.dwellingtype': encodeURIComponent(chaxunData.housetype),
                        'vmw.foreignprice': priceUnit + '^' + price
                    };
                    yhxw({
                        type: 54,
                        pageId: pageId,
                        params: maimaParams
                    });
                }, 'json');
            }
        });
    };
});