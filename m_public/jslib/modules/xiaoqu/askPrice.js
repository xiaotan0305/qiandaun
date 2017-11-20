/**
 * Created by lina on 2017/6/26.
 */
define('modules/xiaoqu/askPrice', ['modules/myesf/mvc/component', 'floatAlert/1.0.0/floatAlert',
    'slideFilterBox/1.0.0/slideFilterBox'], function (require, exports, module) {
        'use strict';
        module.exports = function () {
            var $ = require('jquery');
            var component = require('modules/myesf/mvc/component');
            var scrollCtrl = require('slideFilterBox/1.0.0/slideFilterBox');
            var floatAlert = require('floatAlert/1.0.0/floatAlert');
            var option = {
                type: '1'
            };
            var floatObj = new floatAlert(option);
            var vars = seajs.data.vars;
            var $selHx = $('#selHx');
            var room,
                hall,
                toilet,
                varsHuxing,
                area;
            $('#xjsmInfo').css({
                height: '350px',
                overflow: 'hidden'
            });
            Vue.component('content', {
                template: '<drap-list1 v-show="hxsShow" v-on:modify-vals="modifyVals"></drap-list1>'
                + '<drap-list2 v-show="hxtShow" v-on:modify-valt="modifyValt"></drap-list2>'
                + '<drap-list3 v-show="hxwShow" v-on:modify-valw="modifyValw"></drap-list3>',
                data: function () {
                    return {
                        hxsShow: false,
                        hxtShow: false,
                        hxwShow: false,
                        canclick: true
                    };
                },
                methods: {
                    preventDef: function (e) {
                        e.preventDefault();
                    },
                    // 阻止页面滚动
                    unable: function () {
                        var that = this;
                        document.addEventListener('touchmove', that.preventDef);
                    },
                    // 允许页面滚动
                    enable: function () {
                        var that = this;
                        document.removeEventListener('touchmove', that.preventDef);
                    },
                    enClick: function () {
                        var that = this;
                        setTimeout(function () {
                            that.canclick = true;
                            $('.noinput').attr('disabled', false);
                        }, 300);
                    },
                    // 选择户型室
                    modifyVals: function (obj) {
                        var that = this;
                        that.canclick = false;
                        that.hxsShow = false;
                        varsHuxing = obj.text;
                        $selHx.text(varsHuxing);
                        room = obj.text;
                        hall = '';
                        toilet = '';
                        that.hxtShow = true;
                        that.$nextTick(function () {
                            scrollCtrl.refresh('#huxingTingDrapCon');
                        });
                        that.enClick();
                    },
                    // 选择户型厅
                    modifyValt: function (obj) {
                        var that = this;
                        that.canclick = false;
                        that.hxtShow = false;
                        varsHuxing += obj.text;
                        $selHx.text(varsHuxing);
                        hall = obj.text;
                        toilet = '';
                        that.hxwShow = true;
                        that.$nextTick(function () {
                            scrollCtrl.refresh('#huxingWeiDrapCon');
                        });
                        that.enClick();
                    },
                    // 选择户型卫
                    modifyValw: function (obj) {
                        var that = this;
                        $('.noinput').attr('disabled', true);
                        that.canclick = false;
                        that.hxwShow = false;
                        toilet = obj.text;
                        varsHuxing += obj.text;
                        $selHx.text(varsHuxing);
                        that.enClick();
                        that.enable();
                    }
                },
                ready: function () {
                    var that = this;
                    $selHx.on('click', function () {
                        that.hxsShow = true;
                        that.$nextTick(function () {
                            scrollCtrl.refresh('#huxingShiDrapCon');
                        });
                    });
                    $(document).on('click', 'a', function () {
                        if (!that.canclick) {
                            return false;
                        }
                    });
                    // 点击信息声明
                    var $xjsmCon = $('.floatAlert');
                    $('.xjAgrent').find('a').on('click', function () {
                        $xjsmCon.show();
                        that.$nextTick(function () {
                            scrollCtrl.refresh('#xjsmInfo');
                            that.unable();
                        });
                    });
                    $('.conta').find('h2').find('a').on('click', function () {
                        $xjsmCon.hide();
                        that.enable();
                    });
                }
            });
            new Vue({
                el: '#hxSel'
            });
            // 选择面积按钮
            var $areaBtn = $('#area');
            // 面积选择弹框
            var $areaCon = $('#areaCon');
            var $tabSX = $('.tabSX');
            var $float = $('.floatsd');
            $areaBtn.on('click', function () {
                $areaCon.show();
                $float.show();
            });
            var $areaIpt = $('#areaInput');
            // 手动输入点击完成
            $('.finish').on('click', function () {
                var areaVal = $areaIpt.val();
                area = areaVal;
                if (!areaVal) {
                    floatObj.showMsg('请输入面积', 2000);
                } else {
                    $areaBtn.text(areaVal + '㎡');
                    $tabSX.hide();
                    $float.hide();
                }
            });
            $('.back').on('click', function () {
                $tabSX.hide();
                $float.hide();
            });
            function check() {
                if (!room) {
                    floatObj.showMsg('请选择户型室', 2000);
                    return false;
                } else if (!hall) {
                    floatObj.showMsg('请选择户型厅', 2000);
                    return false;
                } else if (!toilet) {
                    floatObj.showMsg('请选择户型卫', 2000);
                    return false;
                } else if (!area) {
                    floatObj.showMsg('请输入面积', 2000);
                    return false;
                } else if (!$('.hasCheck').length && !vars.nojjr) {
                    floatObj.showMsg('请选择经纪人', 2000);
                    return false;
                } else if ($('.hasCheck').length && $('.hasCheck').length > 3) {
                    floatObj.showMsg('最多选择三个经纪人', 2000);
                    return false;
                }
                return true;
            }

            // 选择经纪人
            $('#content').on('click', '.ipt-rd', function () {
                var $ele = $(this);
                var $hasCheck = $('.hasCheck');
                if($hasCheck.length === 1 && $ele.hasClass('hasCheck')){
                    floatObj.showMsg('至少咨询一个经纪人哦', 2000);
                    return false;
                }
                if ($ele.hasClass('ipt-sel')) {
                    $ele.removeClass('ipt-sel');
                    $ele.removeClass('hasCheck');
                } else {
                    $ele.addClass('hasCheck');
                    $ele.addClass('ipt-sel');
                }
                if ($('.hasCheck').length > 3) {
                    floatObj.showMsg('最多选择三个经纪人', 2000);
                    $ele.removeClass('ipt-sel');
                    $ele.removeClass('hasCheck');
                }
            });
            // 点击发送按钮
            $('.btn-cj').click(function () {
                if (!check()) {
                    return false;
                }
                var arr = [];
                $('.hasCheck').each(function () {
                    var $ele = $(this);
                    arr.push($ele.attr('data-id'));
                    var data = $(this).attr('data-chat');
                    var dataArr = data.split(',');
                    chatMore(dataArr[0], dataArr[1], dataArr[2], dataArr[3], dataArr[4], dataArr[5],
                        dataArr[6], dataArr[7], dataArr[8], dataArr[9], dataArr[10], dataArr[12]);
                });
                var params = {
                    city: vars.city,
                    newcode: vars.newcode,
                    mobilephone: vars.mobilephone,
                    userid: vars.userid,
                    username: vars.username,
                    projname: $('#xqSearch').text(),
                    area: $('#area').text(),
                    room: $('#selHx').text(),
                    agentids: arr.join(',')

                };
                $.ajax({
                    url: vars.xiaoquSite + '?c=xiaoqu&a=ajaxAskHousePrice',
                    data: params,
                    success: function (data) {
                        if (data === 'nologin') {
                            window.location.href = location.protocol + '//m.fang.com/passport/login.aspx?burl='
                                + encodeURIComponent(window.location.href) + '&r=' + Math.random();
                        } else if (data.flag) {
                            var jumpUrl = vars.xiaoquSite + '?c=xiaoqu&a=askSuccess&city=' + vars.city + '&xqid=' + vars.newcode;
                            if (vars.nojjr) {
                                jumpUrl += '&flag=1';
                            }
                            window.location.href = jumpUrl;
                        } else {
                            floatObj.showMsg('请重新提交', 2000);
                        }
                    }
                });
            });

            // 推荐经纪人拨打电话或在线聊天
            function chat(zhcity, city, housetype, houseid, newcode, type, phone, channel, uname, aname, agentid, photourl) {
                var xiaoqu = vars.xiaoqu || '';
                var room = vars.room || '';
                var price = vars.price || '';
                var url = '/data.d?m=houseinfotj&city=' + city + '&housetype='
                    + housetype + '&houseid=' + $.trim(houseid) + '&newcode=' + $.trim(newcode)
                    + '&type=' + type + '&phone=' + $.trim(phone) + '&channel=' + $.trim(channel) + '&agentid='
                    + $.trim(agentid) + '&order=&housefrom=';
                if ('A' === vars.housetype || 'D' === vars.housetype) {
                    if (vars.localStorage) {
                        vars.localStorage.setItem(uname, encodeURIComponent(aname) + ';' + photourl
                            + ';' + encodeURIComponent(xiaoqu + '的' + room + '价格为' + price + '的电商'));
                    }
                } else if (vars.localStorage) {
                    vars.localStorage.setItem(uname, encodeURIComponent(aname) + ';' + photourl
                        + ';' + encodeURIComponent(xiaoqu + '的' + room + '价格为' + price + '的委托')
                        + ';' + vars.mainSite + 'agent/' + vars.city + '/' + vars.agentid + '.html');
                }

                if (vars.localStorage) {
                    vars.localStorage.setItem(uname + '_allInfo', encodeURIComponent(vars.title) + ';'
                        + encodeURIComponent(vars.price + '万元') + ';;' + vars.titleimg + ';' + encodeURIComponent(vars.room_hall_area) + ';'
                        + encodeURIComponent(vars.district_name + '-' + vars.projname) + ';https:' + vars.esfSite + vars.city + '');
                }
                if (vars.hasOwnProperty('from') && vars.from.length > 0) {
                    url += vars.from + '&product=soufun';
                } else {
                    url += '';
                }
                $.ajax(url);
                setTimeout(function () {
                    window.location = '/chat.d?m=chat&username=' + uname + '&city=' + vars.city
                        + '&type=wapesf&houseid=&purpose=&housetype=';
                }, 500);
            }

            function teltj(city, housetype, houseid, newcode, type, phone, channel, agentid) {
                $.ajax({
                    url: vars.mainSite + 'data.d?m=houseinfotj&city=' + city + '&housetype=' + housetype + '&houseid=' + houseid
                    + '&newcode=' + newcode + '&type=' + type + '&phone=' + phone + '&channel=' + channel + '&agentid=' + agentid,
                    async: true
                });
                $.ajax({
                    url: vars.mainSite + 'data.d?m=tel&city=' + city + '&housetype=' + housetype + '&id=' + houseid + '&phone='
                    + phone, async: true
                });
            }

            $('.call').on('click', function () {
                var data = $(this).attr('data-teltj');
                var dataArr = data.split(',');
                teltj(dataArr[0], dataArr[1], dataArr[2], dataArr[3], dataArr[4], dataArr[5], dataArr[6], dataArr[7]);
            });
            $('.mes').on('click', function () {
                var data = $(this).attr('data-chat');
                var dataArr = data.split(',');
                chat(dataArr[0], dataArr[1], dataArr[2], dataArr[3], dataArr[4], dataArr[5],
                    dataArr[6], dataArr[7], dataArr[8], dataArr[9], dataArr[10], dataArr[12]);
            });
            // 同时发送多个经纪人
            function chatMore(zhcity, city, housetype, houseid, newcode, type, phone, channel, uname,
                              aname, agentid, photourl) {
                $.post('/chat.d?m=sendmessage', {
                    houseid: '',
                    customerid: vars.username,
                    agentname: encodeURIComponent(aname),
                    username: encodeURIComponent(uname),
                    content: encodeURIComponent('您好！我想了解' + vars.projname + '-' + $('#selHx').text() + '-' + $('#area').text() + '房源的最新售价情况'),
                    city: vars.city,
                    type: 'wapesf',
                    msgContent: '',
                    command: '',
                    housetype: ''
                }, function (data) {
                    // data = JSON.parse(data);
                    var status = data.root.status;
                    if (Number(status) === 1) {
                        var newTime = curtime();
                        //  获取置业顾问的时间
                        var zygwTime = localStorage ? localStorage.getItem(uname + '_time') : '';
                        if (!zygwTime) {
                            var nowTime = curtime();
                            if (localStorage) {
                                localStorage.setItem(uname + '_time', nowTime);
                            }
                            zygwTime = nowTime;
                        }


                        var oldTime = zygwTime;
                        var timeFlag = comptime(oldTime, newTime);
                        // 保存聊天信息
                        // var sendMessage = 's,1,' + newTime + ',' + encodeURIComponent(message) + ',' + vars.city + ',' + vars.id;
                        var sendMessage = 's,1,' + newTime + ',' + encodeURIComponent('您好！我想了解' + vars.projname + '-'
                                + $('#selHx').text() + '-' + $('#area').text() + '房源的最新售价情况')
                            + ',' + vars.city + ',wapesf,,,';
                        var oldSendMessage = localStorage.getItem('' + uname + '_message');
                        if (oldSendMessage) {
                            localStorage.setItem('' + uname + '_message', sendMessage + ';' + oldSendMessage);
                        } else {
                            localStorage.setItem('' + uname + '_message', sendMessage);
                        }
                    } else {
                        alert('消息"' + message + '"发送失败！请重新发送。');
                    }
                });
            }

            /*
             *获取当前时间
             */
            function curtime() {
                var dateObj = new Date();
                var month = dateObj.getMonth() < 9 ? '0' + (dateObj.getMonth() + 1) : dateObj.getMonth() + 1;
                var date = dateObj.getDate() < 10 ? '0' + dateObj.getDate() : dateObj.getDate();
                var hour = dateObj.getHours() < 10 ? '0' + dateObj.getHours() : dateObj.getHours();
                var minute = dateObj.getMinutes() < 10 ? '0' + dateObj.getMinutes() : dateObj.getMinutes();
                var curtime = month + '-' + date + ' ' + hour + ':' + minute;
                return curtime;
            }

            /*
             *时间比较函数，以此来判断时间是否要显示
             */
            function comptime(beginTime, endTime) {
                // 时间差
                var timeDiff = 5 * 60 * 1000;
                var dateObj = new Date();
                var year = dateObj.getFullYear();
                var begin = new Date(year + '/' + beginTime.replace(/-/g, '/')).getTime();
                var end = endTime ? new Date(year + '/' + endTime.replace(/-/g, '/')).getTime() : begin;
                return end - begin > timeDiff;
            }

            // 加载更多
            var dragBox = $('#drag');
            if (dragBox.length > 0) {
                setTimeout(function () {
                    require.async('loadMore/1.0.0/loadMore', function (loadMore) {
                        loadMore({
                            url: vars.xiaoquSite + '?c=xiaoqu&a=ajaxGetJjrList&city=' + vars.city + '&newcode=' + vars.newcode,
                            total: parseInt(vars.total),
                            pagesize: parseInt(vars.pagesize),
                            pageNumber: parseInt(vars.stepByNum),
                            contentID: '#content',
                            moreBtnID: '#drag',
                            loadPromptID: '#loading',
                            isScroll: true,
                            firstDragFlag: false
                        });
                    });
                }, 200);
            }
        };
    });
