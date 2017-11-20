/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
(function (window, factory) {
    if (typeof define === 'function') {
        //  AMD
        define('newmsgnum/1.0.0/newmsgnum', [], function () {
            return factory(window);
        });
    } else if (typeof exports === 'object') {
        //  CommonJS
        module.exports = factory(window);
    } else {
        //  browser global
        window.NewMsgNum = factory(window);
    }
})(window, function (window) {
    var $ = window.jQuery;

    function NewMsgNum(mainURL, city, storage_prefix) {
        if (typeof(storage_prefix) == 'undefined')
            storage_prefix = '';
        this.storage = window.localStorage;
        try {
            this.storage.setItem('test', 'ok');
        } catch (d) {
            return;
        }
        this.storage.removeItem('test');
        this.storage_prefix = storage_prefix;
        this.messageid = this.storage.getItem('chat_messageid') == null ? 0 : this.storage.getItem('chat_messageid');
        this.new_msg_num = 0;
        this.mainURL = mainURL;
        this.city = city;
        this.init();
    }

    // 初始化new_msg_num
    NewMsgNum.prototype.init = function () {
        if (!this.storage) {
            return;
        }
        for (var i = 0, len = this.storage.length; i < len; i++) {
            var key = this.storage.key(i);
            var his_message = this.storage.getItem(key);
            if (key.indexOf('_message') > 0 && key != 'chat_messageid') {
                var history_list = his_message.split(";");
                var list_size = history_list.length;
                for (var m = 0; m < list_size; m++) {
                    var message_cont = history_list[m].split(',');
                    if (message_cont[0] == 'r' && message_cont[1] == '0') {
                        if (this.storage_prefix == '') {
                            this.new_msg_num++;
                        } else {
                            if (key.indexOf(this.storage_prefix) == 0)
                                this.new_msg_num++;
                        }
                    }
                }
            }
        }
    };
// 获取最新消息
    NewMsgNum.prototype.getMsg = function (obj) {
        if(!this.storage){
            return;
        }
        var num = this;
        this.messageid = this.storage.getItem('chat_messageid') == null ? 0 : this.storage.getItem('chat_messageid');
        undefined === $ && ($ = window.$);
        undefined !== $ && $.ajax({
            url: '/im/?a=ajaxOfflineMsg',//this.mainURL +
            timeout: 5000,
            dataType: 'json',
            success: function (results) {
                // 遍历结果消息
                if (results != null && results.length > 0) {
                    for (var i = 0, l = results.length; i < l; i++) {
                        var messageid = results[i].messageid;
                        var form = results[i].form;
                        var message = results[i].message;
                        var agentname = results[i].agentname;
                        var messagetime = results[i].messagetime;
                        num.storageMsg(messageid, form, message, agentname, messagetime);
                    }
                }
                if (num.new_msg_num > 99) {
                    num.new_msg_num = 99;
                }
                // 更新页面显示未读数
                if (num.new_msg_num > 0) {
                    obj.html(num.new_msg_num);
                    obj.css('display', 'inline-block');
                }
                // ajax轮询未读信息;
                setTimeout(function () {
                    num.getMsg(obj);
                }, 60000);
            },
            error: function () {
                setTimeout(function () {
                    num.getMsg(obj);
                }, 60000);
            }
        });
    };
// 存储获得的消息
    NewMsgNum.prototype.storageMsg = function (messageid, form, message, agentname, messagetime) {
        if(!this.storage){
            return;
        }
        var agent = form;
        var storage_key = agent + '_message';
        agent = agent.replace('客户', '');
        // 截取时间
        var curtime = messagetime.substring(5, 16);
        // 拼接存储字符串
        var send_message = 'r,0,' + curtime + ',' + encodeURIComponent(message) + ',' + this.city;
        // 保存信息，判断是否为第一次存储
        if (this.storage.getItem(storage_key) == null || this.storage.getItem(storage_key) == '') {
            this.storage.setItem(storage_key, send_message);
        } else {
            var chat_message = this.storage.getItem(storage_key);
            this.storage.setItem(storage_key, send_message + ';' + this.storage.getItem(storage_key));
        }
        // 更新messageid以便ajax请求
        this.storage.setItem('chat_messageid', messageid);
        this.new_msg_num++;
    };
    return NewMsgNum;
});