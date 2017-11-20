/**
 * Created by WeiRF on 2016/1/18.
 * IM聊天的user界面
 */
define('modules/im/user',
    ['jquery', 'util/util', 'iscroll/2.0.0/iscroll-lite', 'modules/im/userHTML'],
    function (require) {
        'use strict';
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var customername = vars.customername;
        var sfut = vars.sfut;
        var localStorage = vars.localStorage;
        var html = require('modules/im/userHTML');
        var brokerNum = 0;

        // 显示条数
        var showNum = 7;
        // 获取置业顾问总和，以便调用ajax获取置业顾问是否在线
        var agentNames = '';
        var initSrc = '//static.soufunimg.com/common_m/m_public/201511/images/msgnop.jpg';
        // 列表
        var listHtml = '';
        var $padbox = $('#padbox');
        // 更多按钮
        var $drag = $('#drag');
        // 编辑完成按钮
        var $headEdit = $('a[data-id="head-edit"]');
        var editFlag = true;
        var $oImListDl = $('.IM-list dl');
        var $ImList = $('.IM-list');
        Date.prototype.Format = function (fmt) {
            var o = {
                'M+': this.getMonth() + 1,
                'd+': this.getDate(),
                'h+': this.getHours(),
                'm+': this.getMinutes(),
                's+': this.getSeconds(),
                'q+': Math.floor((this.getMonth() + 3) / 3),
                'S': this.getMilliseconds()
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
            for (var k in o) {
                if (new RegExp('(' + k + ')').test(fmt)) {
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
                }
            }
            return fmt;
        }
        // 获取置业顾问信息
        sortMap(localStorage, function (sortedResult) {
            // 聊过天的经纪人数目（初始化）
            brokerNum = sortedResult.length;
            var city = vars.city || '';
            var type = vars.type || '';
            var houseid = vars.houseid || '';
            var purpose = vars.purpose || '';
            var housetype = vars.housetype || '';
            for (var i = 0, len = sortedResult.length; i < len; i++) {
                var key = sortedResult[i][0];
                var username = key.replace('_message', '');
                var hisMessage = localStorage.getItem(key) || '';
                if (!hisMessage) {
                    (function (arg, index) {
                        $.ajax({
                            type: 'GET',
                            url: '/chat.d?m=getChatRecord&username=' + 'ml:' + encodeURIComponent(encodeURIComponent(customername)) + '&sendto=' + encodeURIComponent(encodeURIComponent(arg)) + '&sfut=' + encodeURIComponent(encodeURIComponent(sfut)),
                            dataType: 'json',
                            success: function (data) {
                                var cr = data.root.cr;
                                hisMessage = '';
                                for (var i = 0; i < cr.length; i++) {
                                    var obj = cr[i];
                                    if (obj['sendto'] === arg) {
                                        hisMessage += 's,1,';
                                    } else {
                                        hisMessage += 'r,1,';
                                    }
                                    var sendtime = new Date(obj['sendtime'].replace(/-/g, '/')).Format('MM-dd hh:mm') || '';
                                    var messageContent = encodeURIComponent(obj['message']) || '';
                                    hisMessage += sendtime + ',' + messageContent + ',' + city + ',' + type
                                        + ',' + houseid + ',' + purpose + ',' + housetype + ';';
                                }
                                username = sortedResult[index][1];
                                localStorage.setItem('' + arg + '_message', hisMessage);
                                localStorage.setItem('' + arg + '_showName', username);
                                renderPage(hisMessage, username, arg, index);
                            },
                            error: function () {
                                hisMessage = '';
                                username = sortedResult[index][1];
                                console.log('error ' + username);
                                localStorage.setItem('' + arg + '_message', hisMessage);
                                localStorage.setItem('' + arg + '_showName', username);
                                renderPage(hisMessage, username, arg, index);
                            }
                        });
                    })(key, i);
                } else {
                    var showName = getagentinfo(username, 'name');
                    //if (!showName) {
                    //    showName = username.substring(username.lastIndexOf(':') + 1);
                    //}
                    renderPage(hisMessage, showName, username);
                }
            }
            if (sortedResult.length > showNum) {
                $drag.show();
            }
        });
        function renderPage(hisMessage, username, linkName, index) {
            console.log('render ' + index + ':' + username);
            // 未读聊天条数
            var newMsgNum = 0;
            // 第一条聊天记录
            var firstInfo = '';
            // 第一条聊天时间
            var firstTime = '';
            // 第一条聊天内容
            var firstMsg = '';
            // 所在的城市
            var city = '';
            if (hisMessage) {
                // 聊天历史
                var historyList = hisMessage.split(';');
                // 聊天历史大小
                var listSize = historyList.length;
                firstInfo = historyList[0].split(',');
                firstTime = firstInfo[2];
                var command = firstInfo[8];
                var purpose = firstInfo[7];
                firstMsg = decodeURIComponent(firstInfo[3]);
                if(command === 'img') {
                    firstMsg = '[图片]';
                }
                if(command === 'location') {
                    firstMsg = '[位置]';
                }
                if (command === 'red_packets_cash' || command === 'red_packets_cash_ret') {
                    firstMsg = '[现金红包]';
                }
                if (command === 'newhouses') {
                    if (purpose === 'xfb_soufun_redbag') {
                        firstMsg = '[房天下红包]';
                    } else if(purpose === 'xfb_house') {
                        firstMsg = '[楼盘]';
                    } else if (purpose === 'xfb_huxing') {
                        firstMsg = '[户型]';
                    } else {
                        firstMsg = '[楼盘]';
                    }
                }
                if (command === 'card' || command === 'namecard') {
                    firstMsg = '[名片]';
                }
                if (command === 'house') {
                    firstMsg = '[房源]';
                }
                if (command === 'voice') {
                    firstMsg = '[语音]';
                }
                if (command === 'video') {
                    firstMsg = '[视频]';
                }
                if (command === 'voice') {
                    firstMsg = '[语音]';
                }
                if (command === 'chat' && purpose === 'anli') {
                    firstMsg = '[案例]';
                }
                if (firstMsg.indexOf('</a>') > 0) {
                    firstMsg = firstMsg.match(/"(.*)"/)[1];
                }
                city = firstInfo[4];
                // 未读消息数
                for (var m = 0; m < listSize; m++) {
                    var messageCont = historyList[m].split(',');
                    if (messageCont[0] === 'r' && messageCont[1] === '0') {
                        newMsgNum++;
                    }
                }
            }
            newMsgNum = newMsgNum === 0 ? '' : newMsgNum;
            var flag = index >= showNum;
            // flag,username,city,type,src,newNum,time,zygwName,message
            listHtml = html.broker(flag, index + 1, username, city, firstInfo[5], firstInfo[6], firstInfo[7], firstInfo[8], getagentinfo(username, 'img'),
                newMsgNum, firstTime, getagentinfo(username, 'name'), firstMsg);
            var href = $($(listHtml).find('a')[1]).attr('href');
            var updateHref = href.replace(username, linkName);
            listHtml = listHtml.replace(href, updateHref);
            agentNames += username + ',';
            // 写入页面
            $padbox.append(listHtml);
            // 如果没有置业顾问则显示没有联系状态
            if (!agentNames) {
                $padbox.addClass('noCon');
                $ImList.append(html.noRecord);
            }
        }

        // 判断置业顾问是否在线
        $.getJSON('/chat.d?m=chatuser&uname=' + encodeURIComponent(encodeURIComponent(agentNames)), function (data) {
            var onlineNames = data.root.username;
            $('dd').each(function () {
                var agentName = $(this).attr('id');
                if (agentName && onlineNames.indexOf(agentName) >= 0) {
                    //$(this).find('h3').append('(在线)');
                } else {
                    //$(this).find('h3').append('(离线)');
                }
            });
        });
        // 绑定编辑按钮事件
        $headEdit.on('click', function () {
            if (!$headEdit.hasClass('noCon')) {
                if (editFlag) {
                    $oImListDl.addClass('edit');
                    $headEdit.html('完成');
                    $headEdit.attr('id', 'wapchatlist_B01_03');
                } else {
                    $oImListDl.removeClass('edit');
                    $headEdit.html('编辑');
                    $headEdit.attr('id', 'wapchatlist_B01_02');
                }
                editFlag = !editFlag;
            }
        });
        // 删除经纪人
        $('dd').on('click', 'a[data-name="delete"]', function () {
            var id = $(this).parents('dd').attr('id');
            localStorage.removeItem('' + id + '_message');
            $(this).parents('dd').remove();
            brokerNum--;
            if (brokerNum <= 0) {
                $ImList.append(html.noRecord);
                $padbox.addClass('noCon');
            }
        });
        // 查看更多按钮
        $drag.on('click', function () {
            $padbox.find('dd').show();
            $drag.hide();
        });

        /*
         *获取置业顾问信息
         */
        function sortMap(localStorage, callback) {
            var hasMessage = false;
            var arraySorteds = [];
            if (localStorage) {
                for (var i = 0, len = localStorage.length; i < len; i++) {
                    var key = localStorage.key(i);
                    if (key.indexOf('_message') >= 0 && key !== 'chat_messageid') {
                        var hisMessage = localStorage.getItem(key);
                        if (hisMessage) {
                            hasMessage = true;
                        }
                        var arraySorted = [];
                        arraySorted.push(key);
                        arraySorted.push(hisMessage);
                        arraySorteds.push(arraySorted);
                    }
                }
                if (hisMessage) {
                    callback && callback(arraySorteds);
                }
            }
            if (!hasMessage) {
                $.getJSON('/chat.d?m=getRecentContact&username=' + 'ml:' + encodeURIComponent(encodeURIComponent(customername))
                    + '&sfut=' + encodeURIComponent(encodeURIComponent(sfut)), function (response) {
                    var data = response.root.rc;
                    for (var i = 0, len = data.length; i < len; i++) {
                        var arraySorted = [];
                        arraySorted.push(data[i]['imusername']);
                        arraySorted.push(data[i]['nickname']);
                        arraySorteds.push(arraySorted);
                    }
                    callback && callback(arraySorteds);
                });
            }
        }

        /*
         *获取置业顾问的信息，如href,头像等
         */
        function getagentinfo(user, type) {
            var options = {
                name: user,
                img: initSrc
            };
            var info = localStorage.getItem(user);
            if (info && info !== ';;;') {
                var infoList = info.split(';');
                options.name = decodeURIComponent(infoList[0]) || user;
                options.img = infoList[1].trim() || initSrc;
            }
            return options[type];
        }

        // click统计
        require.async('//clickm.fang.com/click/new/clickm.js', function () {
            Clickstat.eventAdd(window, 'load', function () {
                Clickstat.batchEvent('wapchatlist_', '');
            });
        });
    });