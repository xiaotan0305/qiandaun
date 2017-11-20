function tongji(u){
	var page_url = document.URL;
	var city=document.getElementById("zhcity").innerHTML;
	xmlHttp = createXMLHttpRequest();
	var url = "/data.d?m=adtj&city="+encodeURIComponent(encodeURIComponent(city))+"&url="+page_url;  
	xmlHttp.open("GET",url, false);
	xmlHttp.onreadystatechange =function(){window.location = u;}
	xmlHttp.setRequestHeader("Content-Type",  
		        "application/x-www-form-urlencoded;");  
	xmlHttp.send();
};
function createXMLHttpRequest() {  
    var xmlHttp;  
    if (window.XMLHttpRequest) {  
        xmlHttp = new XMLHttpRequest();  
        if (xmlHttp.overrideMimeType)  
            xmlHttp.overrideMimeType('json');  
    } else if (window.ActiveXObject) {  
        try {  
            xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");  
        } catch (e) {  
            try {  
                xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");  
            } catch (e) {  
            }  
        }  
    }  
    return xmlHttp;  
}

var getElementsByClassName = function(searchClass,node,tag) {
    if(document.getElementsByClassName){
        return  document.getElementsByClassName(searchClass)
    }else{    
        node = node || document;
        tag = tag || '*';
        var returnElements = []
        var els =  (tag === "*" && node.all)? node.all : node.getElementsByTagName(tag);
        var i = els.length;
        searchClass = searchClass.replace(/\-/g, "\\-");
        var pattern = new RegExp("(^|\\s)"+searchClass+"(\\s|$)");
        while(--i >= 0){
            if (pattern.test(els[i].className) ) {
                returnElements.push(els[i]);
            }
        }
        return returnElements;
    }
}
updateEndTime();
function updateEndTime(){
	var date = new Date();
	var time = date.getTime();  //当前时间距1970年1月1日之间的毫秒数
	var tuantime = document.getElementsByName("tuantime");
	for(i=0;i<tuantime.length;i++){
		var endDate =tuantime[i].getAttribute("endTime"); //结束时间字符串
		//转换为时间日期类型
		var endDate1 = eval('new Date(' + endDate.replace(/\d+(?=-[^-]+$)/, function (a) { return parseInt(a, 10) - 1; }).match(/\d+/g) + ')');
		var endTime = endDate1.getTime(); //结束时间毫秒数
 
		var lag = (endTime - time) / 1000; //当前时间和结束时间之间的秒数
		if(lag > 0){
			var second = Math.floor(lag % 60);     
			var minite = Math.floor((lag / 60) % 60);
			var hour = Math.floor((lag / 3600) % 24);
			var day = Math.floor((lag / 3600) / 24);
			if(day > 0){
				tuantime[i].innerHTML=(day+"天"+hour+"小时"+minite+"分"+second+"秒");
			}else{
				tuantime[i].innerHTML=(hour+"小时"+minite+"分"+second+"秒");
			}
		}else
		tuantime[i].innerHTML=("团购已经结束啦！");
	}
	setTimeout("updateEndTime()",1000);
}