/**
 * Created by WeiRF on 2016/1/16.
 * IM聊天的主界面的HTML模板
 */
define('modules/im/HTML', ['jquery'],
    function (require, exports, module) {
        'use strict';
        // 日期部分
        var time = function (curtime,flag) {
            return flag ? '<p class="msg-date" style="display:block">' + curtime + '</p>' : '<p class="msg-date" style="display:none">' + curtime + '</p>';
        };
        // 发送链接
        var sendUrl = '<div class="center pt20 pb10"> <a id="wapchat_B01_09" data-id = "sendUrl" class="sent-link">发送链接</a> </div>';
        // 发送链接下的置业顾问服务字段
        var serve = function (curtime,flag) {
            var html = '<div id="serviceDiv" class="center pt10">';
            html += time(curtime,flag);
            html += '<span name="service-tip" class="service-span"></span></div>';
            return html;
        };
        var chatul = '<ul id="chatul"></ul>';
        // 顾客聊天的部分
        var customer = function (curtime,flag,imgsrc,message) {
            var html = '<li class="self">';
            html += time(curtime,flag);
            html += '<div class="h"><img src="' + imgsrc + '"></div>';
            html += '<div class="t">' + message + '</div>';
            html += '</li>';
            return html;
        };
        // 处理新房户型、楼盘名片
        var xfHuxing = function (curtime,flag,imgsrc,message,isHouse,command) {
            // 楼盘时 没有户型和面积
            if(isHouse) {
                message.huxing = '';
                message.area = '';
            }
            var from = '';
            if(command === 'house') {
                if(message.from === 'cz') {
                    from = '租房';
                } else {
                    from = '二手房';
                }
            }
            var html = '<li class="oppo">';
            html += time(curtime,flag);
            html += '<div class="h"><a><img src="' + imgsrc + '"></a></div>';
            html += '<div class="t" aria-link="' + message.link + '"><a href = "'+ message.link +'">'
                 + '<div class="im-link"><h3>房天下顾问给您推荐一个' + from + message.lx + '</h3> '
                 + '<div><div class="img" style="/* display: none; */"><img src="'+ message.imageUrl +'"></div>'
                 + '<div class="txt"> <h4>'+ message.title +'</h4>'
                 + '<p><span>' + message.huxing + '</span><span>' + message.area + '</span></p>'
                 + '<p><span class="price">' + message.price + '</span></p> </div> </div> </div></a></div>';
            html += '</li>';
            return html;
        };
        // 通用新卡片
        var comCard = function (curtime,flag,imgsrc,message) {
            var html = '<li class="oppo">';
            html += time(curtime,flag);
            html += '<div class="h"><a><img src="' + imgsrc + '"></a></div>';
            html += '<div class="t">'
                + '<div class="im-link"><h3>' + message.title1 + '</h3> '
                + '<div><div class="img" style="/* display: none; */"><img src="'+ message.img +'"></div>'
                + '<div class="txt"> <h4>'+ message.title2 +'</h4>'
                + '<p><span>' + message.desc1 + '</span><span>' + message.desc2 + '</span></p>'
                + '<p><span class="price">' + message.tap1 + '</span></p> </div> </div> </div></div>';
            html += '<div class="im-stag"><span>' + message.fromtype + '</span></div>';
            html += '</li>';
            return html;
        };
        // 新房红包卡片生成
        var xfRedPacket = function (curtime,flag,imgsrc,message) {
            var benefit = message.benefit;
            var html = '<li class="oppo">';
            html += time(curtime,flag);
            html += '<div class="h"><a><img src="' + imgsrc + '"></a></div>';
            html += '<a href = "'+ message.link +'"><div class="t" aria-link="' + message.link + '">'
                 + '<div class="im-link"><h3>房天下顾问给您分享一个房天下红包</h3> '
                 + '<div> <div class="img_hg"></div>'
                 + '<div class="txt"> <h4>'+ message.title +'</h4>'
                 + '<p><span></span></p>'
                 + '<p><span class="price">'+ benefit +'</span></p></div></div></div></div></a>';
            if(benefit) {
                html += '<div class="im-stag"><span><i></i>红包楼盘</span></div>';
            }
            html += '</li>';
            return html;
        };
        // 现金红包卡片生成
        var redPacket = function (curtime,flag,imgsrc,message,command,imgSite) {
            var html = '<li class="oppo redbox">';
            html += time(curtime,flag);
            html += '<div class="h"><a><img src="' + imgsrc + '"></a></div>';
            html += '<div class="t" aria-link="' + message.shareUrl + '"><a href = "'+ message.shareUrl +'">'
                + '<div class="im-link">'
                + '<div class=""> <div class="img"><img src="' + imgSite + '/images/im_hb.png" alt=""></div>'
                + '<p class="ellips2">'+ message.content +'</p> </div> </div></a></div>';
            if(command === 'red_packets_cash_ret') {
                html += '<div class="im-stag"><span><i></i>你领取了' + message.name + '的<span class="">红包</span></span></div>';
            }
            html += '</li>';
            return html;
        };
        // 名片信息卡片生成
        var card = function (curtime,flag,imgsrc,message) {
            var html = '<li class="oppo">';
            html += time(curtime,flag);
            html += '<div class="h"><a><img src="' + imgsrc + '"></a></div>';
            html += '<div class="t"><div class="im-link">'
                 +  '<h3><span class="flor">' + message.rightuptip + '</span>个人名片</h3><div>'
                 +  '<div class="img_head"><img src="' + message.photourl + '"></div>'
                 +  '<div class="txt"><h4>' + message.nameline + '</h4>'
                 +  '<p><span>' + message.cj + '</span><span>' + message.dk + '</span></p>'
                 +  '<p><span>' + message.description2 + '</span></p></div></div></div></div>';
            html += '</li>';
            return html;
        };
        // 位置信息卡片生成
        var locate = function (curtime,flag,imgsrc,message) {
            var html = '<li class="oppo">';
            html += time(curtime,flag);
            html += '<div class="h"><a><img src="' + imgsrc + '"></a></div>';
            html += '<div class="t" aria-link="' + message.link + '"><a href = "'+ message.link +'">'
                 + '<div class="im-link"><div class="map">'
                 + '<div><img src="' + message.pic + '"></div>'
                 + '<p>' + message.locate + '</p> </div> </div></a></div>'
            html += '</li>';
            return html;
        };
        // 置业顾问聊天部分
        var broker = function (curtime,flag,href,imgsrc,message) {
            var html = '<li class="oppo">';
            html += time(curtime,flag);
            html += '<div class="h"><a href="' + href + '"><img src="' + imgsrc + '"></a></div>';
            html += '<div class="t">' + message + '</div>';
            html += '</li>';
            return html;
        };
        var imageZy = function (curtime,flag,imgsrc,message) {
            var html = '<li class="oppo">';
            html += time(curtime,flag);
            html += '<div class="h"><img src="' + imgsrc + '"></div>';
            html += '<div class="t"><img src="' + message + '" height="100"/></div>';
            html += '</li>';
            return html;
        };
        // 快捷语按钮
        var shortcut = function (infos) {
            return '<li><a id="wapchat_B01_05">' + infos[0] + '</a></li><li><a id="wapchat_B01_06">' + infos[1] + '</a></li><li><a id="wapchat_B01_07">' + infos[2] + '</a></li>';
        };
        // 头部置业顾问部分
        var zygw = function (id,name) {
            var html = '<span id="' + id + '" class="agent_online">' + name + '</span>';
            return html;
        };
        // message
        var message = function (mes) {
            return '<a href="' + mes + '">' + mes + '</a>';
        };
        var img = function (src) {
            return '<img src="' + src + '" height="100"/>';
        };

        module.exports = {
            time: time,
            sendUrl: sendUrl,
            serve: serve,
            customer: customer,
            xfHuxing: xfHuxing,
            comCard: comCard,
            xfRedPacket: xfRedPacket,
            redPacket: redPacket,
            locate: locate,
            card: card,
            broker: broker,
            shortcut: shortcut,
            zygw: zygw,
            imageZy: imageZy,
            message: message,
            chatul: chatul,
            img: img
        };
    });