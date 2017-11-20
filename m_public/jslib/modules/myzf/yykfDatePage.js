/**
 * 我的租房整租合租类
 * modified zdl 20160128 ui改版
 */
define('modules/myzf/yykfDatePage', ['jquery', 'slideFilterBox/1.0.0/slideFilterBox'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var $doc = $(document);
        // 滑动筛选框插件++++++++++++++++++++
        var slideFilterBox = require('slideFilterBox/1.0.0/slideFilterBox');
        // +++++++++++++++++++

        /**
         * 为了方便解绑事件，声明一个阻止页面默认事件的函数
         * @param e
         */
        function pdEvent(e) {
            e.preventDefault();
        }

        /**
         * 禁止页面滑动
         */
        function unable() {
            $doc.on('touchmove', pdEvent);
        }

        /**
         * 允许页面滑动
         */
        function enable() {
            $doc.off('touchmove', pdEvent);
        }

        /**
         * 根据用户当时点击时间 将时间戳转化为指定的格式
         */
        function getDays() {
            var now = new Date();
            var day = now.getDay();
            var week = '7123456';
            var weekDay = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

            var days = [];
            for (var i = 0; i < 14; i++) {
                var f = new Date();
                f.setDate(f.getDate() + i);
                var year = f.getFullYear();
                var month = parseInt(f.getMonth()) + 1;
                month = month < 10 ? '0' + month : month;
                var date = f.getDate();
                date = date < 10 ? '0' + date : date;
                var myDate = new Date(Date.parse(year + '/' + month + '/' + date));
                days.push({
                    // 带间隔符号日期
                    fullDate: '' + year + '-' + month + '-' + date,
                    // 简写
                    jxDate: '' + year + month + date,
                    // 多少号
                    date: date,
                    // 月/日
                    yt: month + '/' + date,
                    // 月/日
                    yt2: year + '年' + month + '月' + date + '日',
                    week: weekDay[myDate.getDay()]
                });
            }
            return days;
        }

        // 选择联系人性别
        $('.radioBox').on('click', 'a', function () {
            $('.radioBox').find('a').removeClass('active');
            $(this).addClass('active');
        });

        var $measureTime = $('#measureTime');
        // 给预约看房时间span标签添加点击事件
        $measureTime.on('click', function () {
            // 获取格式化后的时间数组
            var data = getDays();
            var length = data.length;
            // 用于存放插入到时间选择下拉列表中的字符串
            var contents = '';
            for (var i = 0; i < length; i++) {
                // 将格式化后的时间拼接成时间选择下拉列表中的数据
                contents += '<li>' + data[i].yt2 + '  ' + data[i].week + '</li>';
            }
            // 将拼接好的时间选择列表字符串插入的时间选择容器
            $('#timeDateDrapCon').find('ul').html(contents);
            // 显示预约时间选择容器
            $('#timeDateDrap').show();
            // 给预约时间选择列表添加滑动筛选功能
            slideFilterBox.refresh('#timeDateDrapCon');
            // 更新滑动筛选容器  让列表滚动到容器顶部
            slideFilterBox.to('#timeDateDrapCon', 0);
            unable();
        });
        // 给预约时间下拉列表添加点击事件
        $('#timeDateDrapCon').on('click', 'li', function () {
            var $that = $(this);
            // 获取选中的预约时间
            var timeDateVal = $that.text();
            // 将选择的预约时间显示对应的span标签中
            $measureTime.text(timeDateVal);
            // 隐藏日期 星期选择列表
            $('#timeDateDrap').hide();
            // 显示时间段选择列表
            $('#timeDrap').show();
            // 给时间段选择容器添加滑动筛选功能
            slideFilterBox.refresh('#timeDrapCon');
            slideFilterBox.to('#timeDrapCon', 0);
            // 时间段选择容器显示因此禁止页面滑动
            unable();
        });
        // 给时间段选择列表添加点击事件
        $('#timeDrapCon').on('click', 'li', function () {
            var $that = $(this);
            // 将日期 星期 时间段拼接为预约时间 中间都是用那个空格隔开
            var timeVal = $measureTime.text() + '  ' + $that.text();
            // 更新显示预约时间的span标签值
            $measureTime.text(timeVal);
            // 隐藏时间段选择容器
            $('#timeDrap').hide();
            // 页面中已经不存在任何选择下拉列表容器 允许页面滑动
            enable();
        });

        // 点击预约时间取消按钮
        $('.cancel').on('click', function () {
            $('#timeDateDrap').hide();
            $('#timeDrap').hide();
        });

        var submitFlag = true;
        // 提交预约
        $('#goYY').on('click', function () {
            if (submitFlag) {
                submitFlag = false;
                // 获取houseid值 需要传递给后台
                var houseID = vars.HouseID;
                // 获取roomids 需要传递给后台
                var roomids = vars.roomids;
                // 获取预约看房联系人姓名
                var userName = $('#username').val().trim();
                // 如果预约看房联系人姓名为空
                if (userName === '') {
                    alert('联系人信息不能为空');
                    return false;
                }
                // 获取选择的性别
                var selectedSex = $('.radioBox').find('a.active').text();
                // 获取预约看房的时间
                var time = $measureTime.text();
                if (time === '' || time === '请选择看房时段') {
                    alert('预约看房时间不能为空');
                    return false;
                }
                // 请求的url地址
                var Url = vars.mySite + '?c=myzf&a=addYyMessage';
                // 发送ajax 请求
                $.ajax({
                    url: Url,
                    data: {
                        // 房屋id
                        houseID: houseID,
                        // 房间id
                        roomids: roomids,
                        // 预约联系人
                        userName: userName,
                        // 联系人性别
                        sex: selectedSex,
                        // 看房时间
                        time: time
                    },
                    dataType: 'json',
                    type: 'GET',
                    async: true,
                    success: function (data) {
                        submitFlag = true;
                        var e = data, t = e.result, r = e.message, l = e.AgentPhoto, s = e.AgentName, n = e.AgentMobile, i = e.AgentID;
                        if (t === '1' && i !== '0') {
                            // 返回结果标志位为1-成功返回，AgentID不为0-此次预约成功
                            alert('预约成功');
                            window.location.href = '?c=myzf&a=yykfSuc&city=' + vars.city + '&AgentPhoto=' + l + '&AgentName=' + s
                                + '&AgentMobile=' + n + '&HouseID=' + vars.HouseID + '&roomids=' + vars.roomids;
                        } else if (t === '1' && i === '0') {
                            // 返回结果标志位为1-成功返回，AgentID为0-此房源之前预约过
                            alert('此房源已经预约过');
                            window.location.href = '?c=myzf&a=kanFangList&city=' + vars.city;
                        } else {
                            // 返回结果标志位为0-接口超时
                            alert(r);
                            window.location.reload();
                        }
                    }
                });
            }
        });
    };
});