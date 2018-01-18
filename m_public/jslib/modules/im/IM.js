/**
 * Created by WeiRF on 2016/1/15.
 * IM聊天的主界面
 */
define('modules/im/IM', ['jquery', 'modules/im/HTML', 'iscroll/2.0.0/iscroll-lite', 'modules/xf/IcoStar', 'slideFilterBox/1.0.0/slideFilterBox'],
    function (require) {
        'use strict';
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var chatObj;
        var localStorage = vars.localStorage;
        if (!localStorage) {
            alert('请关闭浏览器的无痕浏览');
            return;
        }
        var html = require('modules/im/HTML');
        var IScroll = require('slideFilterBox/1.0.0/slideFilterBox');
        var IcoStar = require('modules/xf/IcoStar');
        // require.async('modules/im/inputShowRepair');

        var initSrc = '//static.soufunimg.com/common_m/m_public/201511/images/msgnop.jpg';
        // 用户头像url
        var $imgSrc = $('#imgsrc');
        // 聊天框按钮
        var $chat = $('input[data-id="chat"]');
        // 快捷语按钮
        var $msgquireBox = $('#msgquire-box');
        var $msgquire = $('a[data-id="msgquire"]');
        // 列表ID
        var $houseInfo = $('a[data-id="houseInfo"]');
        // 头部在线离线状态
        var $agent = $('#agent_zhname');
        // 聊天框ID
        var $chatBox = $('#chat_box');
        // 存储最近时间的ID
        var $lastTime = $('#last_time');
        // 快捷语ID
        var $msgDefault = $('#msg-default');
        // 发送按钮
        var $sendMessage = $('a[data-id="sendMessage"]');
        // 显示未读消息数
        var $allNewMsgNum = $('#all_new_msg_num_n');
        var $wrapper = $('#wrapper');
        var userSrc = vars.userPhotoUrl || initSrc;
        var imPrefix = vars.imPrefix;
        // 获取用户头像的src
        $imgSrc.val(userSrc);

        // 快捷语
        var shortcut = {
            xf: ['什么时候开盘啊？', '有优惠吗？', '有什么户型？'],
            house: ['你好，有工地可以参观吗？', '你好，可以帮我设计一下吗？', '可以出个设计图吗？'],
            other: ['这套房子在么？', '价格还有商量吗？', '到时候电话联系吧。']
        };
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
        // 用户名字
        var username = vars.username;
        var customername = vars.customername;
        var userImg = getagentinfo(username, 'img');
        var userSendUrl = getagentinfo(username, 'url');
        var sfut = vars.sfut;
        // 图片资源地址
        var imgSite = vars.imgPath;
        var city = vars.city || '';
        var type = vars.type || '';
        var houseid = vars.houseid || '';
        var purpose = vars.purpose || '';
        var housetype = vars.housetype || '';
        // 获取聊天信息
        var newMessage = localStorage ? localStorage.getItem('' + username + '_message') : '';
        //  获取置业顾问的时间
        var zygwTime = localStorage ? localStorage.getItem(username + '_time') : '';
        if (!zygwTime || !newMessage) {
            var nowTime = curtime();
            if (localStorage) {
                localStorage.setItem(username + '_time', nowTime);
            }
            zygwTime = nowTime;
        }
        // 初始化最近时间
        $lastTime.val(zygwTime);
        // 获取置业顾问的连接
        var zygwLink = getagentinfo(username, 'link');

        $(document).on('touchmove', function (e) {
            e.preventDefault();
        });
        var messageid = '';
        if (localStorage) {
            messageid = localStorage.getItem('chat_messageid') || '';
        }
        if (localStorage && (vars.aname || vars.photourl)) {
            localStorage.setItem(username, vars.aname + ';' + vars.photourl + ';');
        }
        var typeParme = {
            wapxf: true,
            wapesf: true,
            wapzf: true
        };

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

        /*
         *获取置业顾问的信息，如name,头像等
         */
        function getagentinfo(user, type) {
            var info = localStorage.getItem(user);
            var info1 = localStorage.getItem(user + '_allInfo');
            //if(info) {
            //    localStorage.setItem(user, info);
            //}
            var options = {
                name: user,
                img: initSrc,
                info: '',
                link: '',
                url: ''
            };
            if (info && info !== ';;;') {
                // name,img,info,link
                var infoList = info.split(';');
                options.name = decodeURIComponent(infoList[0]);
                options.img = infoList[1].trim() || initSrc;
                options.info = infoList[2];
                options.link = infoList[3] || '';
                options.url = infoList[6] || '';
            }
            if (info1 && info1 !== ';;;') {
                // name,img,info,link
                var infoList1 = info1.split(';');
                options.url = infoList1[6] || '';
                $houseInfo.attr('href', options.url);
            }
            return options[type];
        }

        /*
         *获取localStorage中置业顾问的信息和消息条数
         */
        function localMessage(username) {
            var agentNames = '';
            var allNewMsgNum = 0;
            for (var i = 0, len = localStorage.length; i < len; i++) {
                var key = localStorage.key(i);
                if (key.indexOf('_message') > 0 && key !== 'chat_messageid') {
                    var hisUsername = key.replace('_message', '');
                    var hisMessage = localStorage.getItem(key);
                    if (hisMessage) {
                        var historyList = hisMessage.split(';');
                        var listSize = historyList.length;
                        for (var m = 0; m < listSize; m++) {
                            var messageCont = historyList[m].split(',');
                            if (messageCont[0] === 'r' && messageCont[1] === '0') {
                                if (hisUsername !== username) {
                                    allNewMsgNum++;
                                }
                            }
                        }
                    }
                    agentNames += hisUsername + ',';
                }
            }
            agentNames += username;
            return {
                agentNames: agentNames,
                // 最大数是99
                allNewMsgNum: allNewMsgNum > 99 ? 99 : allNewMsgNum
            };
        }

        /*
         *置业顾问在线与否填充
         */
        function getonline(agentNames) {
            $.getJSON('/chat.d?m=chatuser&uname=' + encodeURIComponent(encodeURIComponent(agentNames)), function (data) {
                var onlineName = data.root.username;
                $('.agent_online').each(function () {
                    var agentName = $(this).attr('id');
                    // 去除（在线）（离线）等样式
                    var name = $(this).html().replace(/\(.*\)/, '');
                    var headInfo = '';
                    var chatInfo = '';
                    if (agentName && onlineName.indexOf(agentName) >= 0) {
                        headInfo = name;
                        chatInfo = name + '为您服务';
                    } else {
                        headInfo = name;
                        // chatInfo = name + '现在不在线，可以给ta留言哦~';
                        chatInfo = name + '为您服务';
                    }
                    $(this).html(headInfo);
                    $('.service-span').html(chatInfo);
                });
            });
        }

        /*
         *不知是何
         */
        function tempMessage() {
            var tempMessageQianKe = localStorage.getItem('' + username + '_message');
            // 如果是潜客推荐的未读消息，则默认发送一条消息
            if (new RegExp('r,0,[^,]*,[^,]*,[^,]*,[^,]*,qianke').test(tempMessageQianKe)) {
                if (username.indexOf('h:') === 0) {
                    chatObj.sendMessage('我对您推荐的装修案例非常感兴趣，请介绍一下吧!', 'qianke');
                } else {
                    chatObj.sendMessage('我对你推荐的房源有兴趣，再介绍一下房源详情吧!', 'qianke');
                }
            }
            // 搜房帮
            if (new RegExp('r,0,[^,]*,[^,]*,[^,]*,[^,]*,sfb').test(tempMessageQianKe)) {
                chatObj.sendMessage('我对你推荐的房源有兴趣，再介绍一下房源详情吧!');
            }
            // 装修帮
            if (new RegExp('r,0,[^,]*,[^,]*,[^,]*,[^,]*,zxb').test(tempMessageQianKe)) {
                chatObj.sendMessage('我对您推荐的装修案例非常感兴趣，请介绍一下吧!');
            }
        }

        /*
         *聊天部分的滚动
         */
        function chatIscroll() {
            // 刷新聊天框
            IScroll.refresh('#wrapper');
            var height = $wrapper.height() - $chatBox.height() ;
            if (height < 0) {
                IScroll.to('#wrapper', height, 200);
            }
        }

        /*
         * 聊天对象
         */
        function Chat() {
            this.initialize();
        }
        Chat.prototype = {
            initChatList: function () {
                // 聊天信息
                var chatHtml = [];
                var newmsgList = newMessage.split(';');
                var listSize = newmsgList.length;
                for (var i = listSize - 1; i >= 0; i--) {
                    var messageCont = newmsgList[i].split(',');
                    // 存入最近联系时间
                    var newTime = messageCont[2] || '';
                    var oldTime = $lastTime.val();
                    var timeFlag = comptime(oldTime, newTime);
                    if (timeFlag) {
                        $lastTime.val(newTime);
                    }
                    var messageCont3 = messageCont[3] && decodeURIComponent(messageCont[3]);
                    var contentArr = [];
                    if (messageCont3) {
                        contentArr = messageCont3.split(';');
                    }
                    var purpose = messageCont[7];
                    var command = messageCont[8];
                    // 客户自己输入的消息显示
                    if (messageCont[0] === 's') {
                        if (messageCont3) {
                            chatHtml.push(html.customer(newTime, timeFlag, $imgSrc.val(), messageCont3));
                        }
                    } else {
                        if (command === 'img') {
                            chatHtml.push(html.imageZy(newTime, timeFlag, userImg, messageCont3));
                        } else {
                            chatHtml = this.showMessage(command, purpose, chatHtml, contentArr, newTime, timeFlag, messageCont3);
                        }
                    }
                }
                $('#chatul').append(chatHtml.join(''));
                // 设置聊天框内的内容可以滚动
                chatIscroll();
                // 将未读信息更改为已读状态并写回localStorage
                newMessage = newMessage.replace(new RegExp('r,0,', 'g'), 'r,1,');
                localStorage.setItem('' + username + '_message', newMessage);
            },
            showMessage: function (command, purpose, chatHtml, contentArr, newTime, timeFlag, messageCont3) {
                var message = {};
                message.link = contentArr[14] || '';
                message.title = contentArr[4] || '';
                message.price = contentArr[6] || '价格待定';
                message.imageUrl = contentArr[3] || imgSite + '/images/loadingpic.jpg';
                // 处理置业顾问发送是现金红包的情况
                if (command === 'red_packets_cash' || command === 'red_packets_cash_ret') {
                    for (var i = 0, len = contentArr.length; i < len; i++) {
                        if (i === 0) {
                            message.content = contentArr[0] || '我的快乐来自您买到好房的幸福！';
                        } else if (i === 1) {
                            message.shareUrl = contentArr[1].replace('&amp', '&');
                        } else if (i === len - 1) {
                            message.name = contentArr[len - 1];
                        } else {
                            message.shareUrl += contentArr[i].replace('&amp', '&');
                        }
                    }
                    message.shareUrl += '&imwap=1';
                    // '[现金红包]';
                    chatHtml.push(html.redPacket(newTime, timeFlag, userImg, message, command, imgSite));
                }
                if (command === 'location') {
                    // '[位置]';
                    message.pic = contentArr[0] || '';
                    message.locate = (contentArr[1] + contentArr[2]).replace('null', '') || '';
                    message.message = decodeURIComponent(decodeURIComponent(contentArr[6]));
                    if (message.message === 'null') {
                        message.message = message.message.replace('null', '');
                    }
                    message.link = '/chat/location.jsp?pos_x=' + contentArr[3] +
                        '&pos_y=' + contentArr[4] + '&title=' + contentArr[5] + '&message=' + message.message;
                    chatHtml.push(html.locate(newTime, timeFlag, userImg, message));
                }
                // 楼盘标识符
                var isHouse = false;
                // 通用新卡片的情况
                if (command === 'com_card') {
                    message.title1 = contentArr[0] || '';
                    message.title2 = contentArr[1] || '';
                    message.desc1 = contentArr[2] || '';
                    message.desc2 = contentArr[3] || '';
                    message.fromtype = contentArr[8] || '';
                    message.img = contentArr[6] || '';
                    message.tap1 = contentArr[4] || '';
                    chatHtml.push(html.comCard(newTime, timeFlag, userImg, message));
                }
                if (command === 'newhouses') {
                    if (purpose === 'xfb_soufun_redbag') {
                        message.benefit = contentArr[5] || '';
                        // '[新房红包]';
                        chatHtml.push(html.xfRedPacket(newTime, timeFlag, userImg, message));
                    } else if (purpose === 'xfb_house') {
                        // '[楼盘]';
                        isHouse = true;
                        message.lx = '楼盘';
                        chatHtml.push(html.xfHuxing(newTime, timeFlag, userImg, message, isHouse));
                    } else if (purpose === 'xfb_huxing') {
                        message.huxing = contentArr[7] || '';
                        message.area = contentArr[8] || '';
                        message.lx = '户型';
                        // '[户型]';
                        chatHtml.push(html.xfHuxing(newTime, timeFlag, userImg, message));
                    } else {
                        // '[楼盘]';
                        isHouse = true;
                        message.lx = '楼盘';
                        chatHtml.push(html.xfHuxing(newTime, timeFlag, userImg, message, isHouse));
                    }
                }
                if (command === 'img') {
                    chatHtml.push(html.imageZy(newTime, timeFlag, messageCont3));
                }
                // 处理置业顾问发送是房源的情况
                if (command === 'house') {
                    var shi = contentArr[5] || '';
                    var ting = contentArr[6] || '';
                    message.huxing = (shi && shi + '室') + (ting && ting + '厅');
                    var area = contentArr[8] || '';
                    message.area = area && area + '平';
                    message.price = contentArr[9] || '';
                    // 用于区别是二手房还是租房
                    message.from = contentArr[1] || '';
                    message.lx = '房源';
                    // '[二手房普通、电商房源]';
                    chatHtml.push(html.xfHuxing(newTime, timeFlag, userImg, message, false, command));
                }
                // 处理置业顾问发送是名片的情况
                if (command === 'card' || command === 'namecard') {
                    message.nameline = contentArr[1] || '';
                    var cjDk = contentArr[2].split(' ') || ['', , ''];
                    message.photourl = contentArr[0];
                    // 成交
                    message.cj = cjDk[0];
                    // 带看
                    message.dk = cjDk[2];
                    // 好评
                    message.description2 = contentArr[3] || '';
                    // 服务区域/楼盘
                    message.rightuptip = contentArr[4] || '房天下顾问为您服务';
                    // '[名片]';
                    chatHtml.push(html.card(newTime, timeFlag, userImg, message));
                }
                var msgContent = '';
                // 处理置业顾问发送是语音的情况
                if (command === 'voice') {
                    chatHtml.push(html.broker(newTime, timeFlag, zygwLink, userImg, '[语音]'));
                }
                // 处理置业顾问发送是视频的情况
                if (command === 'video') {
                    chatHtml.push(html.broker(newTime, timeFlag, zygwLink, userImg, '[视频]'));
                }
                // 处理置业顾问发送是案例的情况
                if (command === 'chat') {
                    if (purpose === 'anli') {
                        chatHtml.push(html.broker(newTime, timeFlag, zygwLink, userImg, '[案例]'));
                    } else {
                        chatHtml.push(html.broker(newTime, timeFlag, zygwLink, userImg, messageCont3));
                        //msgContent = message;
                        //// 置业顾问输入的消息显示
                        //chatHtml.push(html.broker(curtime,timeFlag,zygwLink,userImg,msgContent));
                    }
                }
                return chatHtml;
            },
            initialize: function () {
                var $this = this;
                var infoHtml = '';
                if (typeParme[vars.type] && vars.houseid) {
                    // 发送链接
                    infoHtml += html.sendUrl;
                }
                // 置业顾问是否在线
                infoHtml += html.serve(zygwTime, true);
                // 只是搭建好了框架，还没有填充数据
                $chatBox.append(infoHtml);
                // 写入聊天框
                $chatBox.append(html.chatul);

                if (!newMessage) {
                    newMessage = '';
                    $.ajax({
                        type: 'GET',
                        url: '/chat.d?m=getChatRecord&username=' + 'ml:' + encodeURIComponent(encodeURIComponent(customername)) + '&sendto=' + encodeURIComponent(encodeURIComponent(username)) + '&sfut=' + encodeURIComponent(encodeURIComponent(sfut)),
                        dataType: 'json',
                        success: function (data) {
                            var cr = data.root.cr;
                            for (var i = 0; i < cr.length; i++) {
                                var obj = cr[i];
                                if (obj['sendto'] === username) {
                                    newMessage += 's,1,';
                                } else {
                                    newMessage += 'r,1,';
                                }
                                purpose = obj['purpose'] || '';
                                var command = obj['command'] || '';
                                var sendtime = new Date(obj['sendtime'].replace(/-/g, '/')).Format('MM-dd hh:mm') || '';
                                var messageContent = encodeURIComponent(obj['message']) || '';
                                newMessage += sendtime + ',' + messageContent + ',' + city + ',' + type +
                                    ',' + houseid + ',' + purpose + ',' + command + ',' + housetype + ';';
                            }
                            localStorage.setItem('' + username + '_message', newMessage);
                            $this.initChatList();
                        },
                        error: function () {
                            alert('获取聊天信息失败');
                        }
                    });
                } else {
                    $this.initChatList();
                }
                if (vars.type === 'wapxf') {
                    // 控制星星亮
                    new IcoStar('.ico-star');
                }
                // 头部写入
                var name = getagentinfo(username, 'name');
                var zygwHtml = html.zygw(username, name);
                // 添加头部的置业顾问
                $agent.append(zygwHtml);
                // 通过localStorage获取消息
                var loaclMes = localMessage(username);
                // 写入有多少条数据
                if (loaclMes.allNewMsgNum > 0) {
                    $allNewMsgNum.html(loaclMes.allNewMsgNum).show();
                } else {
                    $allNewMsgNum.hide();
                }
                // 填充置业顾问信息
                getonline(loaclMes.agentNames);
                // 快捷语按钮
                var kjyHTML = '';
                // 新房
                if (username.indexOf('x:') + 1) {
                    kjyHTML = html.shortcut(shortcut.xf);
                    // 家居
                } else if (username.indexOf('j:') + 1 || username.indexOf('h:') + 1) {
                    kjyHTML = html.shortcut(shortcut.house);
                    // 其他
                } else {
                    kjyHTML = html.shortcut(shortcut.other);
                }
                $msgDefault.append(kjyHTML);
                // 貌似是潜客
                tempMessage();

                // 显示HTML
                $('.main').show();
                window.scrollTo(0, 1);

                // 发送链接绑定事件
                $('a[data-id="sendUrl"]').on('click', function () {
                    chatObj.sendMessage(userSendUrl ? userSendUrl : $houseInfo.attr('href'), 'sendurl');
                });
                // 快捷语显示绑定按钮
                $msgquire.on('click', function () {
                    if ($msgquireBox.is(':hidden')) {
                        $msgquireBox.show();
                    } else {
                        $msgquireBox.hide();
                    }
                });
                // 快捷语绑定按钮
                $msgDefault.on('click', 'li', function () {
                    $chat.val($(this).find('a').html());
                    $sendMessage.removeClass('noClick');
                    $msgquireBox.hide();
                });
                // 隐藏快捷语绑定按钮
                $wrapper.on('click', function () {
                    $msgquireBox.hide();
                });
                $chat.on('click', function () {
                    $msgquireBox.hide();
                });
                // 发送按钮
                $sendMessage.on('click', function () {
                    if ($chat.val().trim()) {
                        chatObj.sendMessage();
                    }
                });
                $chat.on('input', function () {
                    if ($chat.val().length > 0) {
                        $sendMessage.removeClass('noClick');
                    } else {
                        $sendMessage.addClass('noClick');
                    }
                });
                // 获取聊天框的高度
                // yangfan rewrite 20160518 im 界面没有房源信息 .houseList 时候，显示问题。

				var callHeight;
				if ($('.houseList').length) {
					callHeight = $(window).height() - parseInt($('header').css('height')) - parseInt($('.houseList').css('height')) - parseInt($('.IM-bottom').css('height'));
				} else {
					if($('header').css('height')){
						callHeight = $(window).height() - parseInt($('header').css('height')) - parseInt($('.IM-bottom').css('height'));
					}else{
						callHeight = $(window).height() - parseInt($('.IM-bottom').css('height'));
					}
				}

                $wrapper.css({
                    height: callHeight,
                    overflow: 'hidden'
                });
                // 设置聊天框内的内容可以滚动
                chatIscroll();
                // 获取置业顾问的聊天信息
                setTimeout(function () {
                    chatObj.getMessage();
                }, 4000);
            },
            getMessage: function () {
                $.ajax({
                    url: '/chat.d?m=getmessage&command=down&customerid=ml:' + encodeURIComponent(encodeURIComponent(vars.globalCookie)) + '&messageid=' +
                        messageid + '&username=ml:' + encodeURIComponent(vars.globalCookie) + '&usertype=' + vars.type + '&sfut=' + sfut,
                    type: 'GET',
                    data: '',
                    dataType: 'json',
                    success: function (data) {
                        if (data) {
                            var onlineUser = '';
                            for (var i = 0; i < data.length; i++) {
                                var messageid = data[i].messageid;
                                if (messageid) {
                                    var form = data[i].form;
                                    if (form !== username && !onlineUser) {
                                        onlineUser += form + ',';
                                    }
                                    var message = data[i].message;
                                    var command = data[i].command;
                                    var purpose = data[i].purpose;
                                    var newTime = data[i].sendtime;
                                    var from = data[i].from;
                                    var oldTime = $lastTime.val();
                                    var agentImg = getagentinfo(username, 'img');
                                    var timeFlag = comptime(oldTime, newTime);
                                    var msgContent = data[i].msgContent;
                                    // 楼盘标识符
                                    var isHouse = false;
                                    if (timeFlag) {
                                        $lastTime.val(newTime);
                                    }

                                    if (command === 'com_card') {
                                        msgContent = JSON.parse(msgContent);
                                        var content = {};
                                        content.title1 = msgContent.title1 || '';
                                        content.title2 = msgContent.title2 || '';
                                        content.desc1 = msgContent.desc1 || '';
                                        content.desc2 = msgContent.desc2 || '';
                                        content.fromtype = msgContent.fromtype || '';
                                        content.img = msgContent.img || '';
                                        content.tap1 = msgContent.tap1 || '';
                                        msgContent = content.title1 + ';' + content.title2 + ';' + content.desc1 + ';' + content.desc2 +
                                            ';' + content.tap1 + ';;' + content.img + ';;' + content.fromtype;
                                        message = html.comCard(newTime, timeFlag, agentImg, content);

                                    }
                                    // 处理置业顾问发送是图片的情况
                                    if (command === 'img') {
                                        msgContent = data[i].message;
                                        message = html.imageZy(newTime, timeFlag, agentImg, data[i].message);
                                    }
                                    if (command === 'location') {
                                        msgContent = JSON.parse(msgContent);
                                        var content = {};
                                        // 位置内容数组
                                        var arr = msgContent.title.split(';');
                                        // 坐标数组
                                        var posArr = data[i].message.split(';');
                                        var title = arr[0];
                                        var message = arr[1].replace('null', '');
                                        content.pic = msgContent.pic || '';
                                        content.locate = title + message || '';
                                        content.link = '/chat/location.jsp?pos_x=' + posArr[0] +
                                            '&pos_y=' + posArr[1] + '&title=' + encodeURIComponent(encodeURIComponent(title)) + '&message=' + encodeURIComponent(encodeURIComponent(message));
                                        // '[位置]';
                                        msgContent = content.pic + ';' + title + ';' + message + ';' + posArr[0] + ';' + posArr[1] + ';' +
                                            encodeURIComponent(encodeURIComponent(title)) + ';' + encodeURIComponent(encodeURIComponent(message));
                                        message = html.locate(newTime, timeFlag, agentImg, content);
                                    }
                                    // 处理置业顾问发送是现金红包的情况
                                    if (command === 'red_packets_cash' || command === 'red_packets_cash_ret') {
                                        var content = {};
                                        content.content = data[i].message || '我的快乐来自您买到好房的幸福！';
                                        content.shareUrl = data[i].msgContent + '&imwap=1';
                                        content.name = data[i].nickname;
                                        // '[现金红包]';
                                        message = html.redPacket(newTime, timeFlag, agentImg, content, command, imgSite);
                                    }
                                    var contentArr = [];
                                    var content = {};
                                    if (command === 'newhouses' || command === 'house') {
                                        msgContent = message;
                                        contentArr = msgContent.split(';');
                                        content.link = contentArr[14] || '';
                                        content.title = contentArr[4] || '';
                                        content.price = contentArr[6] || '价格待定';
                                        content.imageUrl = contentArr[3] || imgSite + '/images/loadingpic.jpg';
                                    }
                                    if (command === 'newhouses') {
                                        if (purpose === 'xfb_soufun_redbag') {
                                            // '[新房红包]';
                                            content.benefit = contentArr[5] || '';
                                            message = html.xfRedPacket(newTime, timeFlag, agentImg, content);
                                        } else if (purpose === 'xfb_house') {
                                            // '[楼盘]';
                                            isHouse = true;
                                            content.lx = '楼盘';
                                            message = html.xfHuxing(newTime, timeFlag, agentImg, content, isHouse);
                                        } else if (purpose === 'xfb_huxing') {
                                            // '[户型]';
                                            content.huxing = contentArr[7] || '';
                                            content.area = contentArr[8] || '';
                                            content.lx = '户型';
                                            message = html.xfHuxing(newTime, timeFlag, agentImg, content);
                                        } else {
                                            // '[楼盘]';
                                            isHouse = true;
                                            content.lx = '楼盘';
                                            message = html.xfHuxing(newTime, timeFlag, agentImg, content, isHouse);
                                        }
                                    }
                                    // 处理置业顾问发送是名片的情况
                                    if (command === 'card' || command === 'namecard') {
                                        var contentJson = JSON.parse(message);
                                        msgContent = contentJson.photourl + ';' + contentJson.nameline + ';' + contentJson.description1 + ';' + contentJson.description2 + ';' + contentJson.rightuptip;
                                        var cjDk = contentJson['description1'].split(' ') || ['', , ''];
                                        // 成交
                                        contentJson.cj = cjDk[0];
                                        // 带看
                                        contentJson.dk = cjDk[2];
                                        message = html.card(newTime, timeFlag, agentImg, contentJson);
                                    }
                                    // 处理置业顾问发送是房源的情况
                                    if (command === 'house') {
                                        var shi = contentArr[5] || '';
                                        var ting = contentArr[6] || '';
                                        // 用于区别是二手房还是租房
                                        content.from = contentArr[1] || '';
                                        content.huxing = (shi && shi + '室') + (ting && ting + '厅');
                                        var area = contentArr[8] || '';
                                        content.area = area && area + '平';
                                        content.price = contentArr[9] || '';
                                        content.lx = '房源';
                                        // '[二手房普通、电商房源]';
                                        message = html.xfHuxing(newTime, timeFlag, agentImg, content, false, command);
                                    }
                                    // 处理置业顾问发送是语音的情况
                                    if (command === 'voice') {
                                        msgContent = '[语音]';
                                        message = html.broker(curtime, timeFlag, zygwLink, getagentinfo(username, 'img'), msgContent);
                                    }
                                    // 处理置业顾问发送是视频的情况
                                    if (command === 'video') {
                                        msgContent = '[视频]';
                                        message = html.broker(curtime, timeFlag, zygwLink, getagentinfo(username, 'img'), msgContent);
                                    }
                                    // 处理置业顾问发送是案例的情况
                                    if (command === 'chat') {
                                        if (purpose === 'anli') {
                                            msgContent = '[案例]';
                                            message = html.broker(curtime, timeFlag, zygwLink, getagentinfo(username, 'img'), msgContent);
                                        } else {
                                            msgContent = message;
                                            // 置业顾问输入的消息显示
                                            message = html.broker(curtime, timeFlag, zygwLink, getagentinfo(username, 'img'), msgContent);
                                        }
                                    }
                                    if (from === username) {
                                        $('#chatul').append(message);
                                        // 设置聊天框内的内容可以滚动
                                        chatIscroll();
                                    }
                                    var agentname = data[i].agentname;
                                    var messagetime = data[i].messagetime;
                                    chatObj.onmessage(messageid, form, message, agentname, messagetime, purpose, command, msgContent);
                                }
                            }
                            if (onlineUser) {
                                // 判断是否还在线
                                getonline(onlineUser);
                            }
                            var loaclMes = localMessage(username);
                            // 写入有多少条数据
                            if (loaclMes.allNewMsgNum > 0) {
                                $allNewMsgNum.html(loaclMes.allNewMsgNum).show();
                            } else {
                                $allNewMsgNum.hide();
                            }
                        }
                    },
                    // 当请求完成时便调用
                    // XMLHttpRequest对象和一个描述请求成功的类型的字符串。当请求完成时调用函数，即status=404、403、302...
                    complete: function () {
                        chatObj.getMessage();
                    }
                });
            },
            sendMessage: function (data, housetype) {
                // 获取message值
                var message = data || $chat.val().trim();
                // 清空输入框
                $chat.val('');
                var urlMessage = '';
                var msgContent = '';
                housetype = housetype || '';
                if (housetype === 'sendurl' && message) {
                    urlMessage = message;
                    message = html.message(message);
                    housetype = '';
                    msgContent = vars.hrefTitle + ';' + vars.hrefImg;
                } else {
                    message = message.replace(/</g, '').replace(/>/g, '');
                }
                $.post('/chat.d?m=sendmessage', {
                    houseid: vars.groupId ? vars.groupId : vars.houseid,
                    customerid: vars.globalCookie,
                    agentname: encodeURIComponent(getagentinfo(username, 'name')),
                    username: encodeURIComponent(username),
                    content: urlMessage ? encodeURIComponent(urlMessage) : encodeURIComponent(message),
                    city: vars.city,
                    type: vars.type,
                    msgContent: msgContent,
                    command: '',
                    housetype: vars.housetype
                }, function (data) {
                    // data = JSON.parse(data);
                    var status = data.root.status;
                    if (Number(status) === 1) {
                        var newTime = curtime();
                        var oldTime = $lastTime.val();
                        var timeFlag = comptime(oldTime, newTime);
                        if (timeFlag) {
                            $lastTime.val(newTime);
                        }
                        var chatHtml = html.customer(newTime, timeFlag, $imgSrc.val(), message);
                        $('#chatul').append(chatHtml);
                        // 设置聊天框内的内容可以滚动
                        chatIscroll();
                        // 保存聊天信息
                        // var sendMessage = 's,1,' + newTime + ',' + encodeURIComponent(message) + ',' + vars.city + ',' + vars.id;
                        var sendMessage = 's,1,' + newTime + ',' + encodeURIComponent(message) +
                            ',' + vars.city + ',' + vars.type + ',' + vars.houseid + ',' + vars.purpose + ',' + vars.housetype;
                        var oldSendMessage = localStorage.getItem('' + username + '_message');
                        if (oldSendMessage) {
                            localStorage.setItem('' + username + '_message', sendMessage + ';' + oldSendMessage);
                        } else {
                            localStorage.setItem('' + username + '_message', sendMessage);
                        }
                        // 清空chat
                        $chat.val('');
                        $sendMessage.addClass('noClick');
                    } else {
                        alert('消息"' + message + '"发送失败！请重新发送。');
                        $chat.val(message);
                    }
                });
            },
            onmessage: function (messageid, form, message, agentname, messagetime, purpose, command, msgContent) {
                //if (command !== 'img') {
                //    message = message.replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/</g, '&lt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
                //}
                var agent = form.replace('客户', '');
                var curtime = messagetime.substring(5, 16);
                var agentInfo = localStorage.getItem('' + agent + '');
                if (!agentInfo) {
                    localStorage.setItem(agent, encodeURIComponent(agentname) + ';;');
                }
                var sendMessage = '';
                // 如果是当前用户则状态为1，否则为0
                if (username === agent) {
                    sendMessage = 'r,1,' + curtime + ',' + encodeURIComponent(msgContent) + ',' +
                        vars.city + ',' + vars.type + ',' + vars.houseid + ',' + purpose + ',' + command + ',' + vars.housetype;
                    // 写入页面信息
                    var timeFlag = comptime($lastTime.val(), curtime);
                    if (timeFlag) {
                        $lastTime.val(curtime);
                    }
                    // 设置聊天框内的内容可以滚动
                    chatIscroll();
                } else {
                    // sendMessage = 'r,0,' + curtime + ',' + encodeURIComponent(message) + ',' + vars.city + ',' + command + ',' + vars.id;
                    sendMessage = 'r,0,' + curtime + ',' + encodeURIComponent(msgContent) + ',' + vars.city + ',' +
                        vars.type + ',' + vars.houseid + ',' + purpose + ',' + command + ',' + vars.housetype;
                    // 未读消息数最多为99
                    var messsage = Number($allNewMsgNum.html()) > 98 ? 99 : Number($allNewMsgNum.html()) + 1;
                    if (messsage > 0) {
                        $allNewMsgNum.html(messsage).show();
                    } else {
                        $allNewMsgNum.hide();
                    }
                }
                var oldSnedMessage = localStorage.getItem('' + agent + '_message');
                // 将获取到的信息存入localStorage中
                if (oldSnedMessage) {
                    localStorage.setItem('' + agent + '_message', sendMessage + ';' + oldSnedMessage);
                } else {
                    localStorage.setItem('' + agent + '_message', sendMessage);
                }
                localStorage.setItem('chat_messageid', messageid);
            }
        };

        if (localStorage) {
            chatObj = new Chat();
        } else {
            alert('请关闭浏览器的无痕浏览');
        }
        
        
        if(document.referrer.indexOf('jiaju')>-1){
			// 获取message值
                var message = vars.cont;
                // 清空输入框
                $chat.val('');
                var urlMessage = '';
                var msgContent = '';
                housetype = housetype || '';
                
                $.post('/chat.d?m=sendmessage', {
                    houseid: vars.groupId ? vars.groupId : vars.houseid,
                    customerid: vars.globalCookie,
                    agentname: encodeURIComponent(getagentinfo(username, 'name')),
                    username: encodeURIComponent(username),
                    content: urlMessage ? encodeURIComponent(urlMessage) : encodeURIComponent(message),
                    city: vars.city,
                    type: vars.type,
                    msgContent: msgContent,
                    command: '',
                    housetype: vars.housetype
                }, function (data) {
                    // data = JSON.parse(data);
                    var status = data.root.status;
                    if (Number(status) === 1) {
                        console.log('发送成功');
                    }
                });
		}
        
        // click统计
        require.async('//clickm.fang.com/click/new/clickm.js', function () {
            Clickstat.eventAdd(window, 'load', function () {
                Clickstat.batchEvent('wapchat_', '');
            });
        });
    });