var staticshow = new Array(7);
staticshow[0] = '楼盘名/地名/开发商';
staticshow[1] = '楼盘名/地段名';
staticshow[2] = '楼盘名/地段名';
staticshow[3] = '楼盘名/风格/户型';
staticshow[4] = '楼盘名/小区名/论坛名';
staticshow[5] = '请输入关键字';
staticshow[6] = '请输入您的问题';

window.onload = function(){
		
		////初始化选择
		var select = document.getElementById("selection");
		var p = select.getElementsByTagName('p');
		
		mm=(mm==''||mm=='null')?'xflist':mm;
		
		var value = '0';
		if(mm=='xflist'){
			value = '0';
		}else if(mm=='esflist' || mm=='schoolhouselist' || mm=='esfsubwaylist'){
			value = '1';
		}else if(mm=='zflist'){
			value = '2';
		}else if(mm=='jiaju'||mm=='jiajubd'){
			value = '3';
		}else if(mm=='bbs'){
			value = '4';
		}else if(mm=='zixun'){
			value = '5';
		}
		//问答情况下覆盖前面的value
		if(cc == 'ask'){
			value = '6';
		}
		
		for(var i=0;i<p.length;i++){
			var input = p[i].getElementsByTagName('input')[0];
			if(input.value == value){
					input.checked = true;
					var tmpvalue = p[i].getElementsByTagName('input')[0].value;
					document.getElementById("input").setAttribute('placeholder', staticshow[tmpvalue]);
			}
			p[i].onclick = function(){
				var showcon=this.getElementsByTagName('span')[0].innerHTML;
				this.getElementsByTagName('input')[0].checked=true;
				if(showcon != '二手房'){
					showcon = '&nbsp;&nbsp;'+showcon;
				}
				document.getElementById("showselection").innerHTML=showcon;
				var kw = document.getElementById("input").value;
				var tmpvalue = this.getElementsByTagName('input')[0].value;
				document.getElementById("input").setAttribute('placeholder', staticshow[tmpvalue]);
			};
		};
		
		
		document.onclick=function(e){
			e=e||window.event;	
			var tmp = e.srcElement?e.srcElement:e.target;
			if(tmp.getAttribute("id")!='showselection'){
				document.getElementById("selection").style.display="none";
			}
			if(tmp.getAttribute("id")!='search_completev1'){
				document.getElementById("search_completev1").style.display = "none";
			}
  		}
  		document.getElementById("showselection").onclick = function(){
			document.getElementById("selection").style.display="block";
		}
		
		document.getElementById("searchquery").onclick = function(){
			document.getElementById('searchform').submit();
		}
		
	var later;
	var element = document.getElementById("input");
	if('\v'=='v'){
		element.onpropertychange = autoFlow;
	}else{
		element.addEventListener("input",autoFlow,false); 
	}
	
	function autoFlow(){
		if(later!=null) clearTimeout(later);
		later = setTimeout(function(){
			var keyword = document.getElementById("input").value;
			var city = curcity;
			var showcon = document.getElementById("showselection").innerHTML ;
			showcon=showcon.replace(new RegExp('&nbsp;',"gi"),'').replace(new RegExp('论坛',"gi"),'新房');
			if(showcon.indexOf('新房')>-1||showcon.indexOf('二手房')>-1||showcon.indexOf('租房')>-1){
				if(keyword!=""){
					
					var url = "/xf.d?m=getMapByKeyWord&keyword="+keyword+"&city="+city+"&qubie="+showcon;
					var xmlhttp;
				    try {
				        xmlhttp = new XMLHttpRequest();
				        } catch (e) {
				            try {
				                xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
				            } catch (e) {
				            try {
				                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
				            } catch (e) {
				                return false;
				            }
				        }
				    }
				    xmlhttp.onreadystatechange=function(){
				        if(xmlhttp.readyState==4){
				            var res = xmlhttp.responseText;
				            var obj = eval("("+res+")");
				            var jsonList = eval(obj.root.items);  
				            var resHtml = "";
				            for(var i=0;i<jsonList.length;i++){
								for(var key in jsonList[i]){
					 				var str =jsonList[i][key];
					 				if(str!=''){
					 					resHtml =resHtml+ "<div style=\"padding:4px; border-bottom:1px solid #CCCCCC; line-height:28px\" onclick=\"parsevaluetop('"+jsonList[i][key]+"')\">"+ jsonList[i][key]+"</div>";
					 				}
						        } 
						}
					 		if(jsonList.length>0&&resHtml!=''){
						        	 document.getElementById("search_completev1").innerHTML = resHtml;
						        	 document.getElementById("search_completev1").style.display = "block";
						        	 if(jsonList.length>20){
				                        document.getElementById("search_completev1").style.height="400px"; 
				                        document.getElementById("search_completev1").style.overflowY="auto";
				                    }else{
				                        document.getElementById("search_completev1").style.height="auto"; 
				                    }
						      }else{
						        	 document.getElementById("search_completev1").style.display = "none";
						      }
				        }
				    };
				    xmlhttp.open("get",url,true);
				    xmlhttp.send(null);
					
				}else{
					document.getElementById("search_completev1").style.display = "none";
				}
			}
			
		},1000);
	}
}

		
function makeUpOrdown(key){
	if(key=='up'){
		document.getElementById("showmore").style.display ="none";
		document.getElementById("showmore2").style.display ="none";
		document.getElementById("ask").style.display ="none";
		document.getElementById("more").style.display ="block";
		document.getElementById("updown").style.display ="none";
		if(document.getElementById("msgnum0").innerHTML!=''){
			document.getElementById("msgnum0").style.display ="inline";
		}
	}else if(key=='more'){	
		document.getElementById("showmore").style.display ="block";
		document.getElementById("showmore2").style.display ="block";
		document.getElementById("ask").style.display ="block";
		document.getElementById("more").style.display ="none";
		document.getElementById("updown").style.display ="block";
		document.getElementById("msgnum0").style.display ="none";
	}
}

function parsevaluetop(value){
	document.getElementById("input").value=value;
	document.getElementById("search_completev1").style.display = "none";
	document.getElementById("searchquery").onclick();
}

function getradiotype(){
	var rPort = document.getElementsByName("type");
	for(i=0;i<rPort.length;i++) 
	{ 
	     if(rPort[i].checked) 
	     return(rPort[i].value);
	}
}