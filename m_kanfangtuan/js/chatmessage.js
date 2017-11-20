$(document).ready(function (){
//	document.domain = 'soufun.com';
	var messageid = localStorage.getItem('chat_messageid')==null?'':localStorage.getItem('chat_messageid');
	var city = $('#curcity').html();
	var uuid = '';
	var arr = document.cookie.match(new RegExp("(^| )uuid=([^;]*)(;|$)"));
	if(arr != null) 
	uuid = unescape(arr[2]);
	
	//获取global_cookie
	var arr_global_cookie=document.cookie.match(new RegExp("(^| )global_cookie=([^;]*)(;|$)"));
	if(arr_global_cookie!=null)
	{
	var global_cookie=unescape(arr_global_cookie[2]);
	}
	else
	{
	var global_cookie='';	
	}
	
	if(uuid != ''){
		console.log('/chat.d?m=getmessage&customerid='+uuid+'&messageid='+messageid+'&init=1');
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
		
		
	}
	
	/*潜客推荐 start*/
				//若没有chat_messageid_qktj则证明今天没有取过潜客推荐信息
	if(typeof global_cookie!=undefined&&global_cookie&&global_cookie!='')
		{
		var todaydate=new Date().getTime();
		if(localStorage.getItem("mesqktj")==null||localStorage.getItem("mesqktj").trim()==""||(todaydate*1)>(localStorage.getItem("mesqktj").trim()*1))
			{
			console.log('/chat.d?m=getmessage_qktj&customerid='+global_cookie);
			$.ajax({type: 'GET', url: '/chat.d?m=getmessage_qktj&customerid='+global_cookie, timeout:2000, cache: false, dataType : "json", async: false, success: function(data){
				if(data!=null)
					{
				for (var i = 0; i < data.length; i++) {
			 		var messageid = data[i].messageid;
			 		var agent = data[i].from.replace('客户','');
			 		var message = data[i].message;
			 		var agentname = data[i].agentname;
			 		var messagetime = data[i].messagetime;
			 		var curtime=messagetime.substring(5,16);
			 		var sendto=data[i].sendto;
			 		var photourl=data[i].photourl;
			 		var telphone=data[i].telphone;
					var send_message = 'r,0,'+curtime+','+encodeURIComponent(message)+','+city+','+telphone;
			 		var agent_info = localStorage.getItem(''+agent+'');
			 		if(agent_info == null || agent_info == ''){
						localStorage.setItem(agent, encodeURIComponent(agentname)+';'+photourl+';');
			 		}
			 		if(localStorage.getItem(''+agent+'_message') == null || localStorage.getItem(''+agent+'_message') == ''){
						localStorage.setItem(''+agent+'_message', send_message);
			 		}else{
					var chat_message = localStorage.getItem(''+agent+'_message');
					localStorage.setItem(''+agent+'_message', send_message+';'+localStorage.getItem(''+agent+'_message'));
			 		}
				}
				if(data.length>0)
					{
					var todaydate=new Date();
					var tomorrow=todaydate.getTime()+24*60*60*1000-todaydate.getHours()*60*60*1000-todaydate.getMinutes()*60*1000-todaydate.getSeconds()*1000
					localStorage.setItem('mesqktj',tomorrow);
					}
				}
			}});
		}
		}
		/*潜客推荐 end*/

	if(global_cookie!=''||uuid != '')
		{
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
