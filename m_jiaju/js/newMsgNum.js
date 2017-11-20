/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function NewMsgNum(mainURL, city, storage_prefix) {
	if (typeof(storage_prefix) == 'undefined')
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
    for (var i = 0, len = this.storage.length; i < len; i++) {
		var key = this.storage.key(i);
		var his_message = this.storage.getItem(key);
		if (key.indexOf('_message') > 0 && key != 'chat_messageid') {
			var history_list = his_message.split(";");
			var list_size = history_list.length;
			for (var m = 0; m < list_size; m++) {
				var message_cont = history_list[m].split(",");
				if (message_cont[0] == 'r' && message_cont[1] == '0') {
					if(this.storage_prefix == '') {
						this.new_msg_num++;
					}else{
						if(key.indexOf(this.storage_prefix) == 0)
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
    $.ajax({
//	type: 'POST',
	url: this.mainURL + 'zf/?c=debug&a=chat',
//	data: {"command": "down", "customerid ": this.uuid, "messageid ": this.messageid, "t": new Date().getTime()},
	timeout: 5000,
	cache: false,
	dataType: 'json',
	success: function(results) {
	    //���������Ϣ
	    if (results != null) {
		for (var i = 0, l = results.length; i < l; i++) {
		    var messageid = results[i].messageid;
		    var form = results[i].form;
		    var message = results[i].message;
		    var agentname = results[i].agentname;
		    var messagetime = results[i].messagetime;
		    num.storageMsg(messageid, form, message, agentname, messagetime);
		}
	    }
	    if(num.new_msg_num > 99){
		num.new_msg_num = 99;
	    }
	    //����ҳ����ʾδ����
	    obj.html(num.new_msg_num);
	    if(num.new_msg_num > 0){
		obj.css("display","block");		
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
	var storage_key = this.storage_prefix + agent + '_message';
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



