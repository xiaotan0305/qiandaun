$(document).ready(function (){
	document.domain = 'fang.com';
	var messageid = localStorage.getItem('chat_messageid')==null?'':localStorage.getItem('chat_messageid');
	var city = $('#curcity').html();
	var uuid = '';
	var arr = document.cookie.match(new RegExp("(^| )uuid=([^;]*)(;|$)"));
	if(arr != null) 
	uuid = unescape(arr[2]);
	if(uuid != ''){
		$.ajax({type: 'GET', url: '/chat.d?m=getmessage&customerid='+uuid+'&messageid='+messageid+'&init=1', timeout:2000, cache: false, dataType : "json", async: false, success: function(data){
			for (var i = 0; i < data.length; i++) {
			 var messageid = data[i].messageid;
			 var agent = data[i].form.replace('客户','');
			 var message = data[i].message;
			 var agentname = data[i].agentname;
			 var messagetime = data[i].messagetime;
			 var curtime=messagetime.substring(5,16);
			 var send_message = 'r,0,'+curtime+','+encodeURIComponent(message)+','+city;
			 localStorage.setItem('chat_messageid', messageid);
			 var agent_info = localStorage.getItem(''+agent+'');
			 if(agent_info == null || agent_info == ''){
				localStorage.setItem(agent, encodeURIComponent(agent_name)+';;');
			 }
			 if(localStorage.getItem(''+agent+'_message') == null || localStorage.getItem(''+agent+'_message') == ''){
				localStorage.setItem(''+agent+'_message', send_message);
			 }else{
				var chat_message = localStorage.getItem(''+agent+'_message');
				localStorage.setItem(''+agent+'_message', send_message+';'+localStorage.getItem(''+agent+'_message'));
			 }
			}
		}});
		
		var storage = window.localStorage;
		var new_msg_num = 0;
		for (var i=0, len = storage.length; i < len; i++){
			var key = storage.key(i);
			var his_message = storage.getItem(key);
			if(key.indexOf('_message') > 0 && key != 'chat_messageid'){
				var history_list = his_message.split(";");
				var list_size = history_list.length;
				for(var m=0;m<list_size;m++){
					var message_cont = history_list[m].split(",");
					if(message_cont[0] == 'r' && message_cont[1] == '0'){
						new_msg_num++;
					}
				}
			}
		}
		
		var msghtml = '';
		if(new_msg_num != 0){
			if(new_msg_num > 99){
				new_msg_num = 99;
			}
			$('#msgnum0').html(new_msg_num);
			$('#msgnum1').html(new_msg_num);
			$('#msgnum0').show();
			$('#msgnum1').show();
		}
	}
});
