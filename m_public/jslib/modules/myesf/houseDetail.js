define('modules/myesf/houseDetail',
    ['lazyload/1.9.1/lazyload', 'chart/line/1.0.2/line', 'modules/mycenter/common', 'modules/esf/yhxw'],
    function (require, exports, module) {
        'use strict';
        module.exports = function () {
            var $ = require('jquery');
            var vars = seajs.data.vars;
            var common = require('modules/mycenter/common');
            var yhxw = require('modules/esf/yhxw');
            /* 图片惰性加载*/
            require.async('lazyload/1.9.1/lazyload', function () {
                $('img[data-original]').lazyload();
            });
            // 记录用户行为
            require.async('jsub/_ubm.js', function () {
                yhxw({type: 0, pageId: 'mesfreleaseresult', curChannel: 'myesf'});
            });

            /**
             * 信息提示框
             * @param text 显示提示框文字
             * @param time 提示框显示时间
             */
            function showMsg(text,time) {
                var msg = $('#sendFloat'),
                text = text || '信息有误！',
                time = time || 2000;
                $('#sendText').html(text);
                msg.show();
                setTimeout(function () {
                    msg.hide();
                }, time);
            }
            // 画走势图 如果为小城市,不需要画走势图
            if (vars.isPinggu && parseInt(vars.isPinggu) > 0) {
                var Line = require('chart/line/1.0.2/line');
                /**
                 * 获取数据并绘制走势图
                 * @param arr
                 * @param id
                 * @param topNum
                 */
                $('#chartCon').empty();
                // 判断走势图数据如果为空说明没有获取过数据，则执行初始化，否则以存储过的数据画图
                $.ajax({
                    url: vars.pingguSite + '?c=pinggu&a=ajaxGetDetailDraw',
                    data:{
                        city:vars.city,
                        topnum: 12,
                        newcode: vars.ProjCode,
                        district: vars.District
                    },
                    success: function (data) {
                        var xqPrice = data.xqcode ? data.xqcode.price : {};
                        if (xqPrice.hasOwnProperty('0')) {
                            var lineData =[];
			    lineData.push({
                                yAxis: xqPrice,
                                forecast: true
                                // 是否显示预测，不传是false
                            });
                            if (data.disdata.price) {
                                lineData.push({
                                    yAxis: data.disdata.price,
                                    forecast: false
                                });
                            }
			    if (data.city.price) {
                                lineData.push({
                                    yAxis: data.city.price,
                                    forecast: false
                                });
                            }
                            // 画走势图
                            var l = new Line({
                                id: '#chartCon',
                                height: 200,
                                width: $(window).width(),
                                xAxis: data.monthnum,
                                data:lineData
                            });
                            l.run();
                            // 使走势图滚动到最后一个月位置
                        } else {
                            // 没有数据则隐藏房价走势板块
                            $('#loupanTrend').hide();
                        }
                    }
                });
            }

            // 打电话
            $('a').on('click', '.serviceTel', function () {
                common.apply(this, $(this).attr('data-teltj').split(','));
            });
            // 暂停销售-更改房源状态-电商
            var targetStatus = vars.targetStatus || targetStatus;
            function pauseSaleDS() {
                var isSale = $('#issale');
                var changePrice = $('#changePrice');
                var pauseSaleDS = $('#pauseSaleDS');
                var sSpan = $('.hscon').find('.img > span');
                var dsCon,fStatus;

                if (!vars.issale) {
                    var msg = '';
                    if (targetStatus === '2') {
                        msg = '您确定要暂停销售该房源吗？';
                    } else if (targetStatus === '1') {
                        msg = '您确定要重新委托该房源吗？';
                    }
                }
                if (vars.issale || confirm(msg)) {
                    var url = vars.mySite + 'index.php?c=myesf&a=cancleOrResaleDS&city=' + vars.city + '&houseid=' + vars.houseid + '&targetStatus='
                        + targetStatus + '&r=' + Math.random();
                    $.get(url, function (data) {
                        if (data) {
                            if (data.result === '1') {
                                if (targetStatus === '2') {
                                    dsCon = '重新委托房源';
                                    targetStatus = '1';
                                    fStatus = '停售';
                                    changePrice.attr('data-hstatus', 2).addClass('notab');
                                    //短信通知委托业主是否停售房源
                                    if (vars.issale) {
                                        vars.issale = false;
                                        isSale.hide();
                                    }
                                } else if (targetStatus === '1') {
                                    dsCon = '暂停销售房源';
                                    targetStatus = '2';
                                    fStatus = '在售';
                                    changePrice.attr('data-hstatus', 1).removeClass('notab');
                                    //短信通知委托业主是否继续出售房源
                                    if (vars.issale) {
                                        vars.issale = false;
                                        isSale.hide();
                                        showMsg('提交成功', 2000);
                                    }
                                }
                                pauseSaleDS.find('.mr30').html(dsCon);
                                sSpan.removeClass('no2').html(fStatus);
                            }
                        } else {
                            showMsg('更改状态失败，请稍后再试', 2000);
                        }
                    });
                }
            }
            $('#pauseSaleDS,.stopseSaleDS').on('click', pauseSaleDS);
            //短信通知委托业主继续出售房源
            $('.keepsale').on('click',function () {
                if (targetStatus == '2') {//房源为在售时提示提交成功
                    showMsg('提交成功', 2000);
                } else {
                    //房源为停售时调出售接口
                    pauseSaleDS();
                }
            });
            /* 提示弹框*
             * modified by bjwanghongwei@fang.com
             * 20170213
             */

            // 修改接电时间
            var timeFloat = $('#timeFloat');
            var startTime = $('#startTime');
            $('#changeTime').on('click', function () {
                $('body').addClass('choose');
                timeFloat.show();
                startTime.show();
                startTime[0].scrollTop = 0;
                $('#endTime').hide();
            });
            var timeText = '';
            var start = '';
            var end = '';
			var timeLock = false;
            timeFloat.on('click', 'li', function () {
				if (timeLock) {
					return false;
				}
				timeLock = true;
                var $this = $(this);
                var theFloat = $this.html();
                // 结束时间
                var $endTime = $('#endTime');
                $this.addClass('active');
                if (!startTime.is(':hidden')) {
                    timeText += theFloat;
                    start = theFloat;
                    setTimeout(function () {
                        timeFloat.find('.info').html('结束时间');
                        $this.removeClass('active');
                        startTime.hide();
                        $endTime.show();
                        $endTime[0].scrollTop = 0;
						timeLock = false;
                    }, 350);
                } else {
                    timeText += '-' + theFloat;
                    end = theFloat;
                    timeText = '';
                    setTimeout(function () {
                        timeFloat.find('.info').html('开始时间');
                        $this.removeClass('active');
                        startTime.show();
                        $endTime.hide();
                        timeFloat.hide();
                        if (start && end) {
                            if (end <= start) {
                                showMsg('开始时间请小于截止时间', 2000);
                            } else {
                                var url = vars.mySite + '?c=myesf&a=changePhoneTime&city=' + vars.city + '&starttime=' + start + '&endtime='
                                    + end + '&rawID=' + vars.rawid + '&delegateid=' + vars.delegateid + '&r=' + Math.random();
                                $.get(url, function (data) {
                                    if (data && data.result === '1') {
                                        showMsg('恭喜您，修改接电时间成功！',2000);
                                        $('#newtime').html(data.newTime);
                                    } else {
                                        showMsg('更改接电时间失败，请稍后再试',2000);
                                    }
                                });
                            }
                        }
						timeLock = false;
                    }, 350);
                }
            });
            timeFloat.on('click', '.cancel', function () {
                timeFloat.find('.info').html('开始时间');
                timeText = '';
                timeFloat.hide();
            });

            // 输入价格的浮层
            var floatDiv = $('#tzsj');
            // 要调整的价格
            var myPrice = $('#myPrice');
            // 确定按钮
            var ok = $('#ok');
            var newPrice = $('.newPrice');
            // 调整售价
            $('#changePrice').on('click', function () {
                var $that = $(this);
                // 房源状态
                var dataStatus = $that.attr('data-hstatus');
                if (dataStatus === '2') {
                    showMsg('暂不出售状态下不能修改房源信息',2000);
                } else if (dataStatus === '4' || dataStatus === '3') {
                    showMsg('已售状态下不能修改房源信息',2000);
                } else {
                    floatDiv.show();
                    // 输入框输入限制修改zhangcongfeng@fang.com
                    myPrice.on('input',function () {
                        var $that = $(this);
                        var val = $that.val();
                        if (val !== '') {
                            if(vars.city === 'bj'){
                                if (val.indexOf('.') === -1) {
                                    if (parseInt(val) < 1 || parseInt(val) >= 10000) {
                                        $that.val(val.substring(0,val.length - 1));
                                        showMsg('售价要大于2万元小于1亿元', 2000);
                                        return false;
                                    }
                                }else if (!/^[1-9]\d{0,3}\.\d{0,2}$/.test(val)) {
                                    $that.val(val.substring(0,val.length - 1));
                                    return false;
                                }
                                if(parseFloat(val) /parseFloat(vars.area) > 15){
                                    showMsg('单价要小于15万元/平米');
                                }
                            }else{
                                if (val.indexOf('.') === -1) {
                                    if (parseInt(val) < 1 || parseInt(val) >= 100000) {
                                        $that.val(val.substring(0,val.length - 1));
                                        showMsg('售价要大于2万元小于10亿元', 2000);
                                    }
                                }else if (!/^[1-9]\d{0,3}\.\d{0,2}$/.test(val)) {
                                    $that.val(val.substring(0,val.length - 1) + float);
                                }
                            }
                        }
                    });
                    myPrice.on('blur',function () {
                        var $that = $(this);
                        var val = $that.val();
                        if(vars.city === 'bj'){
                            if (val !== '') {
                                if (val.indexOf('.') === -1) {
                                    if (parseInt(val) < 2 || parseInt(val) >= 10000) {
                                        $that.val(val.substring(0,val.length - 1));
                                        showMsg('售价要大于2万元小于1亿元');
                                        myPrice.focus();
                                        return false;
                                    }
                                }else{
                                    if(parseInt(val) < 2){
                                        showMsg('售价要大于2万元小于1亿元');
                                        $that.val('');
                                        $that.focus();
                                        return false;
                                    }
                                }
                            }
                            if(parseFloat(val) /parseFloat(vars.area) > 15){
                                showMsg('单价要小于15万元/平米');
                            }
                        }else{
                            if (val !== '') {
                                if (val.indexOf('.') === -1) {
                                    if (parseInt(val) < 2 || parseInt(val) >= 100000) {
                                        $that.val(val.substring(0,val.length - 1));
                                        showMsg('售价要大于2万元小于10亿元');
                                        myPrice.focus();
                                    }
                                }else{
                                    if(parseInt(val) < 2){
                                        showMsg('售价要大于2万元小于10亿元');
                                        $that.val('');
                                        $that.focus();
                                    }
                                }
                            }
                        }
                    });
                }
            });
            // 点击取消按钮或空白遮罩清空价格，隐藏调价弹框
            $('#qx,.mask').on('click', function () {
                myPrice.val(newPrice.html().replace('万元', ''));
                floatDiv.hide();
            });
            var qxLock = false;
            ok.on('click', function () {
                if(vars.city === 'bj' && myPrice.val() < 2 || myPrice.val() >= 10000){
                    showMsg('售价要大于2万元小于1亿元');
                    return false;
                }else if(myPrice.val() < 2 || myPrice.val() >= 100000){
                    showMsg('售价要大于2万元小于10亿元');
                    return false;
                }

                if(parseFloat(myPrice.val()) /parseFloat(vars.area) > 15){
                    showMsg('单价要小于15万元/平米');
                    return false;
                }
                floatDiv.hide();
                if (qxLock) {
                    return false;
                }
                qxLock = true;
                var params = {houseId: vars.houseid, indexId: vars.indexid, price: myPrice.val(), area: vars.area, room: vars.room, hall: vars.hall,
				toilet: vars.toilet, block: vars.block, roomNumber: vars.roomNumber, floor: vars.floor, totalfloor: vars.totalfloor, forward: vars.forward,
				rawid: vars.rawid, imgs: vars.imgs, photoUrl: vars.photoUrl, description: vars.description, linkman: vars.linkman};
                $.post(vars.mySite + '?c=myesf&a=ajaxdelegateEdit&city=' + vars.city, params, function (data) {
                    if (data.result === '1') {
                        showMsg('调整售价成功！',2000);
                        floatDiv.hide();
                        newPrice.html(myPrice.val() + '万元');
                        var newUnit = parseInt(myPrice.val() * 10000 / vars.area);
                        newPrice.siblings('.f12').html('（' + newUnit + '元/平米）');
                    } else {
                        showMsg('调整售价失败！',2000);
                        myPrice.focus();
                    }
                    qxLock = false;
                });
            });
            // 委托方式浮层
            var wtFsList = $('#jjrFloat');
            // 点击修改委托方式按钮，修改委托方式
            $('#modWT').on('click', function () {
                $('body').addClass('choose');
                wtFsList.show();
            });
            wtFsList.on('click', '.cancel', function () {
                wtFsList.hide();
            });
            wtFsList.find('li').on('click', function () {
                var $this = $(this);
                $this.addClass('active');
                setTimeout(function () {
                    $this.removeClass('active');
                    $('body').removeClass('choose');
                    wtFsList.hide();
                    var type = $this.index() === 0 ? '-1': '1';
                    var url = vars.mySite + '?c=myesf&a=delegateRange&houseid=' + vars.houseid + '&type=' + type;
                    $.get(url , function (data) {
                        if (data && data.result === '1') {
                            showMsg('修改委托方式成功！', 2000);
                            $('#wttype').html($this.html());
                        } else {
                            showMsg('修改委托方式失败！', 2000);
                        }
                    });
                }, 350);
            });

            var replacea = $('.replacea');
            // 更换专属
            if (replacea) {
                replacea.on('click', function () {
                    showMsg('您已经更换过一次专属经纪人了，不能再修改了！',3000);
                });
            }

            // 打电话
            function telCall(teldata) {
                $.ajax({
                    url: '/data.d?m=houseinfotj&city=' + teldata[0] + '&housetype=' + teldata[1] + '&houseid=' + teldata[2] + '&newcode='
                    + teldata[3] + '&type=' + teldata[4] + '&phone=' + teldata[5] + '&channel=' + teldata[6] + '&agentid=' + teldata[7],
                    async: true
                });
                if (typeof yhxw !== 'undefined' && yhxw && typeof _ub !== 'undefined' && _ub && typeof _ub.collect !== 'undefined'
                    && _ub.collect) {
                    yhxw({type: 31, pageId: 'mesfreleaseresult', curChannel: 'myesf'});
                }
            }
            $('.tel').on('click', function () {
                var teldata = $(this).find('a').attr('data-teltj').split(',');
                telCall(teldata);
            });
            $('.serviceTel').on('click', function () {
                var teldata = $(this).attr('data-teltj').split(',');
                telCall(teldata);
            });
            function chat(data) {
                var xiaoqu = $('#xiaoqu').html() || '';
                var room = $('#room').html() || '';
                var price = $('#price').html() || '';
                var url = '/data.d?m=houseinfotj&city=' + data[1] + '&housetype='
                    + data[2] + '&houseid=' + $.trim(data[3]) + '&newcode=' + $.trim(data[4])
                    + '&type=' + data[5] + '&phone=' + $.trim(data[6]) + '&channel=' + $.trim(data[7]) + '&agentid='
                    + $.trim(data[10]) + '&order=' + data[11] + '&housefrom=';
                if ('A' === vars.housetype || 'B' === vars.housetype || 'C' === vars.housetype || 'D' === vars.housetype) {
                    if (vars.localStorage) {
                        vars.localStorage.setItem(data[8], encodeURIComponent(data[9]) + ';' + data[11]
                            + ';' + encodeURIComponent(xiaoqu + '的' + room + '价格为' + price + '的电商'));
                    }
                } else if (vars.localStorage) {
                    vars.localStorage.setItem(data[8], encodeURIComponent(data[9]) + ';' + data[12]
                        + ';' + encodeURIComponent(xiaoqu + '的' + room + '价格为' + price + '的委托')
                        + ';' + vars.mainSite + 'agent/' + vars.city + '/' + vars.agentid + '.html');
                }
                if (vars.hasOwnProperty('from') && vars.from.length > 0) {
                    url += vars.from + '&product=soufun';
                } else {
                    url += data[13];
                }
                $.ajax(url);
                setTimeout(function () {
                    window.location = '/chat.d?m=chat&username=' + data[8] + '&city=' + data[1];
                }, 500);
                yhxw({type: 24, pageId: 'mesfreleaseresult', curChannel: 'myesf'});
            }
            // 留言
            $('.muser-list').find('.arr-rt').on('click', function () {
                var data = $('.giveme').attr('data-chat');
                var dataArr = data.split(',');
                chat(dataArr);
            });
            $('.giveme').on('click', function () {
                var data = $(this).attr('data-chat');
                var dataArr = data.split(',');
                chat(dataArr);
            });

            // 点击经纪人头像进入店铺页面
            $('#agentImg').on('click', function () {
                window.location.href = vars.mainSite + 'agent/' + vars.city + (vars.ebstatus? '/1_' :'/') + vars.agentid + '.html';
            });
            //短信弹窗关闭
            $('.egis-close').on('click', function () {
                $('.floatAlert').hide();
            });
            //点击空白区域弹窗消失
            $('.floatAlert:not(".f-egis")').on('click',function () {
                $(this).hide();
            })
        };
    });