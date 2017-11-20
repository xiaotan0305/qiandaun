/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function NewMsgNum(mainURL, city, storage_prefix) {
    if (typeof (storage_prefix) == 'undefined')
        storage_prefix = '';
    this.storage = window.localStorage;
    this.storage_prefix = storage_prefix;
    this.messageid = this.storage.getItem('chat_messageid') == null ? 0 : this.storage.getItem('chat_messageid');
    this.new_msg_num = 0;
    this.mainURL = mainURL;
    this.city = city;
    this.init();
}
//��ʼ��new_msg_num
NewMsgNum.prototype.init = function() {
    //���ǰ����Ϣ
    this.getqianke();
    for (var i = 0, len = this.storage.length; i < len; i++) {
        var key = this.storage.key(i);
        var his_message = this.storage.getItem(key);
        if (key.indexOf('_message') > 0 && key != 'chat_messageid') {
            var history_list = his_message.split(";");
            var list_size = history_list.length;
            for (var m = 0; m < list_size; m++) {
                var message_cont = history_list[m].split(",");
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
//��ȡ������Ϣ
NewMsgNum.prototype.getMsg = function(obj) {
    var num = this;
    this.messageid = this.storage.getItem('chat_messageid') == null ? 0 : this.storage.getItem('chat_messageid');
    jQuery.ajax({
        url: this.mainURL + 'im/?a=ajaxOfflineMsg',
        timeout: 5000,
        dataType: 'json',
        success: function(results) {
            //���������Ϣ
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
            //����ҳ����ʾδ����
            obj.html(num.new_msg_num);
            if (num.new_msg_num > 0) {
                obj.css("display", "block");
            }
            //ajax��ѯδ����Ϣ;
            setTimeout(function() {
                num.getMsg(obj);
            }, "60000");
        },
        error: function() {
            setTimeout(function() {
                num.getMsg(obj);
            }, "60000");
        }
    });
};
//�洢��õ���Ϣ
NewMsgNum.prototype.storageMsg = function(messageid, form, message, agentname, messagetime) {
    var agent = form;
    var storage_key = agent + '_message';
    agent = agent.replace('�ͻ�', '');
    //��ȡʱ��
    var curtime = messagetime.substring(5, 16);
    //ƴ�Ӵ洢�ַ���
    var send_message = 'r,0,' + curtime + ',' + encodeURIComponent(message) + ',' + this.city;
    //������Ϣ���ж��Ƿ�Ϊ��һ�δ洢
    if (this.storage.getItem(storage_key) == null || this.storage.getItem(storage_key) == '') {
        this.storage.setItem(storage_key, send_message);
    } else {
        var chat_message = this.storage.getItem(storage_key);
        this.storage.setItem(storage_key, send_message + ';' + this.storage.getItem(storage_key));
    }
    //����messageid�Ա�ajax����
    this.storage.setItem('chat_messageid', messageid);
    this.new_msg_num++;
};
//��ȡǱ����Ϣ
NewMsgNum.prototype.getqianke = function() {
    var arr_global_cookie = document.cookie.match(new RegExp("(^| )global_cookie=([^;]*)(;|$)"));
    if (arr_global_cookie != null) {
        var global_cookie = unescape(arr_global_cookie[2]);
    } else {
        var global_cookie = '';
    }
    //��û��chat_messageid_qktj��֤������û��ȡ��Ǳ���Ƽ���Ϣ
    if (typeof global_cookie != undefined && global_cookie && global_cookie != '') {
        var todaydate = new Date().getTime();
        if (this.storage.getItem("mesqktj") == null || this.storage.getItem("mesqktj").trim() == "" || (todaydate * 1) > (this.storage.getItem("mesqktj").trim() * 1)) {
            $.ajax({type: 'GET', url: this.mainURL + 'chat.d?m=getmessage_qktj&customerid=' + global_cookie, timeout: 2000, cache: false, dataType: "json", async: false, success: function(data) {
                    if (data != null)
                    {
                        for (var i = 0; i < data.length; i++) {
//                            var messageid = data[i].messageid;
                            var agent = data[i].from.replace('�ͻ�', '');
                            var message = data[i].message;
                            var agentname = data[i].agentname;
                            var messagetime = data[i].messagetime;
                            var curtime = messagetime.substring(5, 16);
                            var sendto = data[i].sendto;
                            var photourl = data[i].photourl;
                            var telphone = data[i].telphone;
                            var send_message = 'r,0,' + curtime + ',' + encodeURIComponent(message) + ',' + city + ',' + telphone;
                            var agent_info = this.storage.getItem('' + agent + '');
                            if (agent_info == null || agent_info == '') {
                                this.storage.setItem(agent, encodeURIComponent(agentname) + ';' + photourl + ';');
                            }
                            if (this.storage.getItem('' + agent + '_message') == null || this.storage.getItem('' + agent + '_message') == '') {
                                this.storage.setItem('' + agent + '_message', send_message);
                            } else {
//                                var chat_message = this.storage.getItem('' + agent + '_message');
                                this.storage.setItem('' + agent + '_message', send_message + ';' + this.storage.getItem('' + agent + '_message'));
                            }
                        }
                        if (data.length > 0) {
                            var todaydate = new Date();
                            var tomorrow = todaydate.getTime() + 24 * 60 * 60 * 1000 - todaydate.getHours() * 60 * 60 * 1000 - todaydate.getMinutes() * 60 * 1000 - todaydate.getSeconds() * 1000;
                            this.storage.setItem('mesqktj', tomorrow);
                        }
                    }
                }});
        }
    }
}