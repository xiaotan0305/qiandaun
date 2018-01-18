/**
 * @file js合并，ESLint
 * @author fcwang(wangfengchao@soufun.com)
 */
/**
 * @file chafangjia revision
 * @author zcf(zhangcongfeng@fang.com)
 * 附近小区定位,热门区县加载更多
 * 20151207 blue 修改swipe插件改为3.10版本，修改柱状图和走势图循环复制出来的节点初始化函数,删除无用的js
 */
define('modules/pinggu/xiaoquFj',
    ['modules/world/yhxw', 'jquery', 'footprint/1.0.0/footprint', 'swipe/3.10/swiper', 'lazyload/1.9.1/lazyload', 'iscroll/2.0.0/iscroll-lite', 'chart/line/1.0.4/line'],
    function (require, exports, module) {
        'use strict';
        module.exports = function () {
            var $ = require('jquery');
            var vars = seajs.data.vars;
            var IScroll = require('iscroll/2.0.0/iscroll-lite');
            // 包裹层id
            var evaluate = $('#evaluate');
            // 选择朝向id
            var orientation = $('#orientation');
            // 朝向弹框
            var selectDiv = $('#selectDiv');
            // 楼层数
            var louceng = $('#louceng');
            // 总楼层数
            var zonglouceng = $('#zonglouceng');
            //swipecha插件
            var Swiper = require('swipe/3.10/swiper');
            // 记录点击id
            var type = '';
            // 加载更多选项id
            var obj = {};
            var poper = $('.sf-bdmenu .con section');
            // 显示 弹出div
            var selectDivUl = selectDiv.find('ul');
            // 选择小区search
            require.async('search/cfj/xiaoquSearch', function (xiaoquSearch) {
                var XiaoquSearch = new xiaoquSearch();
                XiaoquSearch.init();
            });
            // 引入用户行为分析对象-埋码
            var yhxw = require('modules/world/yhxw');
            var maimaParams = {
                'vmg.page': 'cfj_cfj^xqfjxq_wap'
            };
            yhxw({
                pageId: 'cfj_cfj^xqfjxq_wap',
                params: maimaParams
            });
            // 禁止事件默认行为
            function preventDefault(e) {
                // @20151229 blue 删除多余代码
                e.preventDefault();
            }

            /**
             * 阻止页面滑动
             */
            function showDiv() {
                document.addEventListener('touchmove', preventDefault);
            }

            /**
             * 恢复页面滑动
             */
            function closeDiv() {
                document.removeEventListener('touchmove', preventDefault);
            }

            /**
             * 初始化弹框内容
             */
            function initBox() {
                selectDivUl.html('');
                var liStr = '';
                switch (type) {
                    case 'orientation':
                        liStr += '<li id="wappinggusy_D03_03">东</li><li id="wappinggusy_D03_03">南</li><li id="wappinggusy_D03_03">西</li><li id="wappinggusy_D03_03">北</li><li id="wappinggusy_D03_03">东南</li><li id="wappinggusy_D03_03">西南</li><li id="wappinggusy_D03_03">东北</li><li id="wappinggusy_D03_03">西北</li><li id="wappinggusy_D03_03">南北</li><li id="wappinggusy_D03_03">东西</li>';
                        break;
                    case 'fTime':
                        liStr += '<li id="wappinggusy_D03_07">一年以内</li><li id="wappinggusy_D03_07">二年以内</li><li id="wappinggusy_D03_07">三～五年</li><li id="wappinggusy_D03_07">五～十年</li><li id="wappinggusy_D03_07">十年以上</li>';
                        break;
                    case 'fitment':
                        liStr += '<li id="wappinggusy_D03_08">毛坯</li><li id="wappinggusy_D03_08">普装</li><li id="wappinggusy_D03_08">中装</li><li id="wappinggusy_D03_08">精装</li><li id="wappinggusy_D03_08">豪装</li>';
                        break;
                }
                selectDivUl.append(liStr);
                selectDiv.show();
            }

            // 点击标签弹出选择框事件
            var scroll;
            $('.select').on('click', function () {
                var id = $(this).attr('id');
                var num;
                if (id) {
                    type = id;
                    if (obj[type]) {
                        selectDivUl.html(obj[type]);
                        selectDiv.show();
                        num = selectDiv.find('li.activeS').index();
                    } else {
                        initBox();
                    }
                    showDiv();
                    if (!scroll) {
                        scroll = new IScroll(poper[0], {
                            bindToWrapper: true, scrollY: true, scrollX: false, preventDefault: false
                        });
                    }
                    scroll.refresh();
                    if (num) {
                        // 45:每个li的高度,202:选择框的高度
                        var total = poper.find('ul li').length;
                        var tail = total * 45 - 202;
                        // 所有选项的总高度超过可视高度时滚动
                        if (tail > 0) {
                            // 滚动到底部后不可再向上滚动
                            if ((total - num) * 45 > 202) {
                                scroll.scrollTo(0, -(num - 1) * 45);
                            } else {
                                scroll.scrollTo(0, -tail);
                            }
                        }
                    } else {
                        scroll.scrollTo(0, 0);
                    }
                }
            });
            // 点击弹框选项事件,选择内容填充到对应的标签
            selectDivUl.on('click', 'li', function () {
                var $that = $(this);
                $('#' + type).html($that.text() + (type === 'louceng' ? '层' : ''));
                evaluate.find('.' + type).addClass('sele');
                $that.addClass('activeS').siblings().removeClass('activeS');
                obj[type] = selectDivUl.html();
                selectDiv.hide();
                closeDiv();
            });
            // 点击弹框取消事件
            selectDiv.find('.cancel').on('click', function () {
                selectDiv.hide();
                closeDiv();
            });
            // 输入项的字符和位数限制
            evaluate.on('keyup blur', 'input', function () {
                var $that = $(this);
                var val = $that.val();
                var id = $that.attr('id');
                var reg, flag;
                if (id) {
                    switch (id) {
                        case 'zonglouceng':
                            reg = /\D/g;
                            $that.val(val.replace(reg, ''));
                            break;
                        case 'louceng':
                            reg = /\D/g;
                            $that.val(val.replace(reg, ''));
                            var ua = window.navigator.userAgent.toLowerCase();
                            if (ua.indexOf('android') > -1) {
                                if ($that.val().length === 2) {
                                    zonglouceng.focus();
                                }
                            }
                            break;
                        case 'area':
                            reg = /^[1-9]\d{0,3}(\.\d{0,2})?$/;
                            if (!reg.test(val)) {
                                if (val.indexOf('.') === -1) {
                                    showMsg('建筑面积范围10-9999平米');
                                    $that.val(val.substring(0, val.length - 1));
                                } else {
                                    $that.val(val.substring(0, val.length - 1));
                                }
                            }
                            break;
                    }
                    evaluate.find('.' + id).addClass('sele');
                }
            });
            var assessId = $('.cfjBtn03');

            // 记录当前时间

            var starTime = [];
            assessId.on('click', function assess() {
                var date = new Date();
                starTime.push(date.getTime());
                var projname = vars.projname ? vars.projname : $('#CFJ_searchtext').text();
                var zfloor = zonglouceng.val();
                var floor = louceng.val();
                var forward = orientation.text();
                var fTime = $('#fTime').text(); //完成时间
                var fitment = $('#fitment').text(); //装修档次
                var area = $('#area').val();
                if (!projname || projname === '请选择小区') {
                    alert('请选择小区');
                    return;
                }
                if (!area || area > 9999 || area < 10) {
                    alert('建筑面积范围10-9999平米');
                    return;
                }
                if (!floor) {
                    alert('请输入楼层');
                    return;
                }
                if (!zfloor) {
                    alert('请输入总楼层');
                    return;
                }
                if (zfloor - floor < 0) {
                    alert('楼层不得大于总楼层');
                    return;
                }
                // 评估数据
                var data = {
                    newcode: vars.newcode,
                    buildingarea: area,
                    forward: forward,
                    zfloor: zfloor,
                    floor: floor,
                    fittime: fTime,
                    fitment: fitment
                };
                if (fTime || fitment) {
                    data.fTime = fTime;
                    data.fitment = fitment;
                    data.moreFlag = 1;
                }
                var url = vars.pingguSite + '?c=pinggu&a=saveAccurateForm';
                var now = new Date();
                var time = now.getTime();
                var len = starTime.length;
                // 两次点击间隔时间小于4000ms不能点击
                if (len >= 2 && time - starTime[len - 2] <= 4000) {
                    alert('请不要频繁评估');
                    return;
                }
                $.ajax({
                    type: 'POST',
                    url: url,
                    data: data,
                    success: function (data) {
                        if (data !== 'error') {
                            if (data.errcode === '100') {
                                if (data.LogId) {
                                    window.location = vars.pingguSite + '?c=pinggu&a=result&pgLogId=' + data.LogId + '&city=' + vars.city;
                                }
                            } else {
                                alert(data.errmsg);
                            }
                        } else {
                            alert('抱歉，获取评估结果失败。');
                        }
                    }
                });
            });

            // 参考均价，走势图，3条，小区均价，商圈均价
            // 二手房详情页
            var dataZ = JSON.parse(vars.referPrice);
            if (dataZ) {
                require.async(['chart/line/1.0.4/line'], function (Line) {
                    if (dataZ && dataZ.projdata && dataZ.disdata && dataZ.citydata) {
                        var xqcodeChart, disChart, cityChart, cdataArr = [];
                        // 针对某些城市数据不全的情况做兼容如果某类数据不存在，则不显示
                        if (dataZ.projdata && dataZ.projdata.price) {
                            xqcodeChart = {
                                yAxis: dataZ.projdata.price,
                                forecast: false
                            };
                            cdataArr.push(xqcodeChart);
                        }
                        if (dataZ.disdata && dataZ.disdata.price) {
                            disChart = {
                                yAxis: dataZ.disdata.price,
                                forecast: false
                            };
                            cdataArr.push(disChart);
                        }
                        if (dataZ.citydata && dataZ.citydata.price) {
                            cityChart = {
                                yAxis: dataZ.citydata.price,
                                forecast: false
                            };
                            cdataArr.push(cityChart);
                        }
                        // 画走势图
                        var l = new Line({
                            id: '#chartCon',
                            height: 200,
                            border: 50,
                            alertDom: $('#trend'),
                            width: $(document).width() - 50,
                            lineColor: ['#ff7070', '#ffae71', '#68c9bf'],
                            xAxis: dataZ.monthnum,
                            data: cdataArr
                        });
                        l.run();
                    }
                });
            } else {
                $('.xq-fj-canvas').hide();
                $('.xq-fj-int').hide();
            }
            // 提示信息
            function show(keywords) {
                var $msg = $('#sendText');
                $msg.text(keywords);
                $msg.fadeIn();
                setTimeout(function () {
                    $msg.fadeOut();
                }, 2000);
            }
            // 是否已经收藏过该小区
            var url = vars.mySite + '?c=mycenter&a=isAlreadySelect&city=' + vars.city + '&projcode=' + vars.newcode
                + '&purpose=' + vars.purpose + '&channel=esf';
            var oFavIcon = $('#attention');
            // 收藏icon
            $.get(url, function (data) {
                if (data.result_code === '100') {
                    oFavIcon.removeClass('guanzhu_fj');
                    oFavIcon.addClass('yiguanzhu_fj');
                }
            });
            // 添加收藏功能
            oFavIcon.on('click', addFavFun);
            // 收藏弹框实例
            var scSuc = $('#scSuc');
            function addFavFun() {
                var that = this;
                var url = vars.mySite + '?c=mycenter&a=ajaxMySelect&city=' + vars.city + '&xqid=' + vars.newcode;
                $.get(url, function (data) {
                    if (data.userid) {
                        if (data.myselectid) {
                            scSuc.show();
                            oFavIcon.removeClass('guanzhu_fj');
                            oFavIcon.addClass('yiguanzhu_fj');
                        } else {
                            show('已取消关注');
                            oFavIcon.removeClass('yiguanzhu_fj');
                            oFavIcon.addClass('guanzhu_fj');
                        }
                    } else {
                        window.location.href = 'https://m.fang.com/passport/login.aspx?burl=' + encodeURIComponent(window.location.href);
                    }
                });
            }

            // 点击继续看房
            $('#xuanfang_suc1').click(function () {
                scSuc.hide();
            });
            /*提示弹框*
             * modified by bjwanghongwei@fang.com
             * 20161226
             * 取消alert弹窗，（app会出现BUG）
             */
            var msg = $('#sendFloat'),
                msgP = $('#sendhtml'),
                timer = null;

            function showMsg(text, callback) {
                text = text || '信息有误！';
                msgP.html(text);
                msg.fadeIn();
                clearTimeout(timer);
                timer = setTimeout(function () {
                    msg.fadeOut();
                    callback && callback();
                }, 2000);
            }
        };
    });