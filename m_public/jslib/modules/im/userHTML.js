/**
 * Created by WeiRF on 2016/1/18.
 * IM聊天的user界面的HTML模板
 */
define('modules/im/userHTML', ['jquery'],
    function (require, exports, module) {
        'use strict';
        // 没有记录
        var noRecord = '<p class="center f16 gray-8 mt10">暂无聊天记录</p>';
        // 经纪人
        var broker = function (flag,number,username,city,type,houseid,purpose,housetype,src,newNum,time,zygwName,message) {
            var html = '<dd id="' + username + '">';
            if (flag) {
                html = '<dd id="' + username + '"style="display:none">';
            }
            html += '<div id="wapchatlist_B01_04" class="del">';
            html += '<a href="javascript:void(0)"  data-name="delete"><span></span></a>';
            html += '</div>';
            html += '<a id="wapchatlist_B02_0' + number + '"  href="/chat.d?m=chat&username=' + username + '&city=' + city
                + '&type=' + type + '&houseid=' + houseid + '&purpose=' + purpose + '&housetype=' + housetype + '">';
            html += '<div class="head">';
            html += '<img src="' + src + '">';
            if (newNum) {
                html += '<em>' + newNum + '</em>';
            }
            html += '</div>';
            html += '<div class="text">';
            html += '<h3>';
            html += '<span class="date">'  + time + '</span>';
            html += zygwName;
            html += '</h3>';
            html += '<p>' + message + '</p>';
            html += '</div></a></dd>';
            return html;
        };
        module.exports = {
            noRecord: noRecord,
            broker: broker
        };
    });
