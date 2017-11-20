define('modules/tongji/distribute', ['chart/pie/2.0.0/pie', 'datePicker/1.0.1/datePicker'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        $('input[type=hidden]').each(function (index, element) {
            vars[$(this).attr('data-id')] = element.value;
        });
        // 引入requestanimationframe兼容性js
        require.async(vars.public + 'js/requestanimationframe.js');

        // 拓展Date方法
        Date.prototype.Format = function (fmt) {
            var o = {
                'M+': this.getMonth() + 1, // 月份
                'd+': this.getDate() // 日
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
            return fmt;
        };
        var Pie = require('chart/pie/2.0.0/pie');
        var $pieCon = $('#pieCon');
        var w = $pieCon.width();
        var url = vars.tongjiSite + '?c=tongji&a=ajaxDistribute&city=' + vars.city + '&verifyCode='
            + vars.verifyCode + '&agentid=' + vars.agentId + '&version=' + vars.version;
        var $selectList = $('.selectList');
        var $fytype = $('#fytype');
        var pie, $pieIntro = $('.pieIntro');
        // 没有数据显示节点
        var $noDataShow = $('#noDataShow');
        // 正在加载数据的提示
        var $loading = $('#loading');
        // 点击刷新
        var $refreshing = $('#refreshing');
        // 本周本月本年的选择按钮
        var $selectBtn = $('.type');
        // 城市列表
        var $cityBox = $('#cityList');
        // 城市名称
        var $city = $('#city');
        // 房源参数弹层
        var $hidfy = $('#hidfy');
        // 房源类型参数
        var $fy = $('#fy');
        var $dateSpan = $('.dateTxt span');
        var $hgNum = $('.hgNum');
        var DatePicker = require('datePicker/1.0.1/datePicker');
        var datePicker = new DatePicker();
        var $dateTxt = $('.dateTxt');

        /**
         * 设置日期选择器点击确认按钮后的函数操作
         */
        datePicker.setConfirmFun(function () {
            getDataAndDraw();
        });

        /**
         * 绑定点击事件
         */
        $dateTxt.on('click', function () {
            datePicker.show();
        });

        // 初始化
        getDataAndDraw();

        /**
         * 获取数据并画出分布图
         */
        function getDataAndDraw() {
            $noDataShow.hide();
            $loading.show();
            url += '&SearchCity=' + encodeURIComponent($city.html()) + '&type=' + $fy.attr('data-type')
                + '&begintime=2015-' + $dateSpan.eq(0).attr('data-date') + '&endtime=2015-' + $dateSpan.eq(1).attr('data-date');
            $.get(url, function (data) {
                if (data.msg === '1') {
                    $('#msg').html('');
                    var dataArr = [];
                    var liStr = '';
                    data.result.forEach(function (e) {
                        dataArr.push({value: e['Count'], color: e['color']});
                        liStr += '<li><span style="background:' + e['color'] + ';"></span>' + e['Name'] + ':' + e['Count'] + '%</li>';
                    });
                    if (!pie) {
                        $loading.hide();
                        pie = new Pie({width: w, height: w, radius: w, hollowedRadius: w * 4 / 5, dataArr: dataArr});
                    } else {
                        $loading.hide();
                        pie.fillData(dataArr);
                    }
                    pie.run();
                    $hgNum.text(data.total);
                    $pieIntro.html(liStr);
                } else if (data.msg === '2') {
                    $('#msg').html('');
                    dataArr = [];
                    liStr = '';
                    data.result.forEach(function (e) {
                        dataArr.push({value: e['Count'], color: e['color']});
                        liStr += '<li><span style="background:' + e['color'] + ';"></span>' + e['Name'] + ':' + e['Count'] + '%</li>';
                    });
                    if (!pie) {
                        $loading.hide();
                        pie = new Pie({width: w, height: w, radius: w, hollowedRadius: w * 4 / 5, dataArr: dataArr});
                    } else {
                        $loading.hide();
                        pie.fillData(dataArr);
                    }
                    pie.run();
                    $hgNum.text(data.total);
                    $('#nodata').remove();
                    $pieCon.prepend('<div id="nodata" style="text-align:center;">暂无数据</div>');
                    $pieIntro.html(liStr);
                } else {
                    $('#nodata').remove();
                    pie = undefined;
                    $pieCon.find('canvas').remove();
                    $pieIntro.html('');
                    $loading.hide();
                    $noDataShow.show();
                }
            });
            url = vars.tongjiSite + '?c=tongji&a=ajaxDistribute&city=' + vars.city + '&verifyCode='
                + vars.verifyCode + '&agentid=' + vars.agentId + '&version=' + vars.vs;
        }

        // 拓展Date方法
        Date.prototype.Format = function (fmt) {
            var o = {
                // 月份
                'M+': this.getMonth() + 1,
                // 日
                'd+': this.getDate()
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
            return fmt;
        };

        /**
         * ！！！！！特殊处理浮层点击其他位置让浮层消失!!!!!
         */
        $(document).on('touchstart', function (e) {
            var $target = $(e.target);
            var $parent = $target.closest('ul');
            if ($target.attr('id') !== 'fy' && $parent.length <= 0 && !$target.hasClass('type') && $target.attr('id') !== 'city') {
                closeAllPop();
            }
        });

        /**
         * 关闭所有浮层
         */
        function closeAllPop() {
            if ($hidfy.is(':visible')) {
                if ($fy.hasClass('selectBtnUp')) {
                    $fy.removeClass('selectBtnUp');
                }
                $hidfy.hide();
            }
            if ($selectList.is(':visible')) {
                if ($selectBtn.hasClass('selectBtnUp')) {
                    $selectBtn.removeClass('selectBtnUp');
                }
                $selectList.hide();
            }
            if ($cityBox.is(':visible')) {
                if ($city.hasClass('selectBtnUp')) {
                    $city.removeClass('selectBtnUp');
                }
                $cityBox.hide();
            }
        }

        /**
         * 根据年月获取该年该月的总天数
         * @param y 年份
         * @param m 月份
         * @returns {number} 该年该月的总天数
         */
        function getDate(y, m) {
            return new Date(y, m.toString(), 0).getDate();
        }

        /**
         * 根据本周本月按钮切换选项设置时间段
         * @param type 切换的类型,yesterday为昨天,today为今天,week为本周，month为本月
         */
        function setTime(type) {
            if (type === 'year') {
                var start = new Date(now.getFullYear(), 0, 1).Format('MM-dd');
                var end = new Date(now.getFullYear(), 11, 31).Format('MM-dd');
                $dateSpan.eq(0).attr('data-date', start);
                $dateSpan.eq(1).attr('data-date', end);
                $dateSpan.eq(0).html(start.replace('-', '月') + '日');
                $dateSpan.eq(1).html(end.replace('-', '月') + '日');
                return;
            }
            var now = new Date();
            var startJudge, endJudge;
            switch (type) {
                case 'yesterday':
                    startJudge = endJudge = now.getDate() - 1;
                    break;
                case 'today':
                    startJudge = endJudge = now.getDate();
                    break;
                case 'week':
                    var today = now.getDay() - 1;
                    if (today < 0) {//判断周末时置为6，则周一到周日依次减去0-6，算出当天所在本周的星期一时间
                        today = 6;
                    }
                    startJudge = now.getDate() - today;
                    endJudge = startJudge + 6;
                    break;
                case 'month':
                    startJudge = 1;
                    endJudge = getDate(now.getFullYear(), now.getMonth() + 1);

            }
            //计算开始时间和结束时间
            var start = new Date(now.getFullYear(), now.getMonth(), startJudge).Format('MM-dd');
            console.log(start);
            var end = new Date(now.getFullYear(), now.getMonth(), endJudge).Format('MM-dd');
            $dateSpan.eq(0).attr('data-date', start);
            $dateSpan.eq(1).attr('data-date', end);
            console.log(start);
            $dateSpan.eq(0).html(start.replace('-', '月') + '日');
            console.log(start);
            $dateSpan.eq(1).html(end.replace('-', '月') + '日');
        }

        /**
         * 点击本周本月本年弹层选项后操作
         */
        $selectList.on('click', 'li', function () {
            var $that = $(this);
            if ($that.hasClass('on')) {
                if ($selectBtn.hasClass('selectBtnUp')) {
                    $selectBtn.removeClass('selectBtnUp');
                }
                $selectList.hide();
                return;
            }
            $that.addClass('on').siblings().removeClass('on');
            $selectBtn.text($that.html());
            if ($that.html() == '本周') {
                setTime('week');
            } else if ($that.html() == '本月') {
                setTime('month');
            } else if ($that.html() == '今年') {
                $dateSpan.eq(0).attr('data-date', '01-01');
                $dateSpan.eq(1).attr('data-date', '12-31');
                $dateSpan.eq(0).html('01月01日');
                $dateSpan.eq(1).html('12月31日');
            }
            if ($selectBtn.hasClass('selectBtnUp')) {
                $selectBtn.removeClass('selectBtnUp');
            }
            getDataAndDraw();
            $selectList.hide();
        });

        /**
         * 点击本周本月本年显示节点操作
         */
        $selectBtn.click(function () {
            var $this = $(this);
            if ($this.hasClass('selectBtnUp')) {
                $this.removeClass('selectBtnUp');
                $selectList.hide();
            } else {
                closeAllPop();
                $this.addClass('selectBtnUp');
                $selectList.show();
            }
        });

        //总额
        var $total = vars.totalStr.split('|');

        $fy.click(function () {
            if ($fy.hasClass('selectBtnUp')) {
                $fy.removeClass('selectBtnUp');
                $hidfy.hide();
            } else {
                closeAllPop();
                $fy.addClass('selectBtnUp');
                $hidfy.show();
            }
        });

        //房源or客源参数切换事件
        $fytype.on('click', 'li', function () {
            var $that = $(this);
            $fy.text($that.html());
            $fy.attr('data-type', $that.attr('data-type'));
            $that.addClass('on').siblings().removeClass('on');
            //显示总额
            if ($that.attr('data-type') == 'xzfy') {
                $hgNum.text($total[7]);
            } else if ($that.attr('data-type') == 'xzky') {
                $hgNum.text($total[8]);
            }
            if ($fy.hasClass('selectBtnUp')) {
                $fy.removeClass('selectBtnUp');
            }
            $hidfy.hide();
            getDataAndDraw();
        });
        // 城市列表的点击事件
        if (vars.searchCity === '全国') {
            $city.click(function () {
                if ($city.hasClass('selectBtnUp')) {
                    $city.removeClass('selectBtnUp');
                    $cityBox.hide();
                } else {
                    closeAllPop();
                    $city.addClass('selectBtnUp');
                    $cityBox.show();
                }
            });
            $cityBox.on('click', 'li', function () {
                var $that = $(this);
                $that.addClass('on').siblings().removeClass('on');
                $city.text($that.html());
                if ($city.hasClass('selectBtnUp')) {
                    $city.removeClass('selectBtnUp');
                }
                $cityBox.hide();
                getDataAndDraw();
            });
        }

        /**
         * 点击刷新，重新加载数据绘制分布图
         */
        $refreshing.on('click', function () {
            $noDataShow.hide();
            getDataAndDraw();
        });
    };
});