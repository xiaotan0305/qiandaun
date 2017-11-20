$(document).ready(function () {
	//var bua = navigator.userAgent.toLowerCase();
	//if(bua.indexOf('iphone') != -1 || bua.indexOf('ios') != -1){
	//	hideurlbar();
	//}
	
	//document.addEventListener('touchend', function(ev){
	//	if($("#footer").attr('class') == 'none'){
	//		$("#footer").removeClass('none');
	//		if(request('m') == 'xfinfo'){
	//			setTimeout("changetel()",500);
	//		}
	//	}
	//}, false);
	
	//$(window).scroll(function(){  
	//	if($(document).scrollTop() > 60){
	//		if($("#footer").attr('class') == 'none'){
				$("#footer").removeClass('none');
				if(request('m') == 'xfinfo'){
					setTimeout("changetel()",500);
				}
	//		}
	//	}
	//})
	
	for (var i = 0; i < 4; i++) {
		more(i);
		up(i);
	}
	
	$("#goo_map").click(function () {
		initialize();
	});
	
	var m = request('m');
	var id = request('id');
	var city = request('city');
	var storage_type = '';
	if(m=='xfinfo'){
		storage_type = 'xf_favorite';
	}else if(m=='esfdetail'){
		storage_type = 'esf_favorite';
	}else if(m=='zfdetail'){
		storage_type = 'zf_favorite';
	}else if(m=='xiaoquinfo'){
		storage_type = 'xiaoqu_favorite';
	}
	
	var shoucangn = "url(http://img2.soufun.com/wap/touch/img/shoucang_n.png) ";
	var shoucangh = "url(http://img2.soufun.com/wap/touch/img/shoucang_h.png) ";
	
	if(storage_type != ''){
		var all_favorite = localStorage.getItem(storage_type)==null?"":localStorage.getItem(storage_type);
		var favorite_list = all_favorite.split("|");
		for(var i=0;i < (favorite_list.length);i++){
		var his_id = getparam(favorite_list[i],'id');
			if(his_id == id){
				if (storage_type == 'esf_favorite'||storage_type == 'zf_favorite'){
					//$('#favorite').html('取消');
					document.getElementById("favorite").innerHTML='取消';
					document.getElementById("favorite").style.backgroundImage=shoucangh;
				}else{
					$('#favorite').html('取消收藏');
				}
			}
		}
	}
	
	
	$('#favorite').click(function () {
		var size = 50;
		var item = '';
		var all_favorite = localStorage.getItem(storage_type)==null?"":localStorage.getItem(storage_type);
		if($(this).html() == '收藏'){
			if(m=='xfinfo'){
				item += "city~"+city+";";
				item += "id~"+id+";";
				item += "img~"+$('#storageimg').html()+";";
				item += "title~"+($('.title').html()==null?"":$('.title').html())+";";
				item += "price~"+($('.price').html()==null?"":$('.price').html())+";";
				item += "district~"+($('.district').html()==null?"":$('.district').html())+";";
				item += "discount~"+($('.discount').html()==null?"":$('.discount').html())+"";
				if(all_favorite == ''){
					localStorage.setItem(storage_type, item);
					show_msg();
					$('#favorite').html('取消收藏');
				}else{
					var favorite_list = all_favorite.split("|");
					if(favorite_list.length >= size){
						alert('您收藏的新房已达到上限，系统已自动覆盖之前的房源信息');
					}
					var favorite = "";
					for(var i=0;i < (favorite_list.length>=size?size:favorite_list.length);i++){
						var his_id = getparam(favorite_list[i],'id');
						if(his_id == id){
						}else{
							favorite += favorite_list[i]+'|';
						}
					}
					localStorage.setItem('xf_favorite', item+(favorite==''?'':'|')+(favorite==''?"":favorite.substring(0,(favorite.length-1))));
		    		show_msg();
					$('#favorite').html('取消收藏');
				}
			}else if(m=='esfdetail'){
				item += "id~"+id+";";
				item += "url~"+location.href+";";
				item += "img~"+$('#storageimg').html()+";";
				item += "title~"+($('.title').html()==null?"":$('.title').html())+";";
				item += "price~"+($('.price').html()==null?"":$('.price').html())+";";
				item += "room~"+($('.room').html()==null?"":$('.room').html())+";";
				item += "area~"+($('.area').html()==null?"":$('.area').html())+";";
				item += "xiaoqu~"+($('.xiaoqu').html()==null?"":$('.xiaoqu').html())+";";
				item += "district~"+($('.district').html()==null?"":$('.district').html())+";"
				item += "comarea~"+($('.comarea').html()==null?"":$('.comarea').html())+""
				if(all_favorite == ''){
					localStorage.setItem(storage_type, item);
					show_msg();
					//$('#favorite').html('取消');
					document.getElementById("favorite").innerHTML='取消';
					document.getElementById("favorite").style.backgroundImage=shoucangh;
				}else{
					var favorite_list = all_favorite.split("|");
					if(favorite_list.length >= size){
						alert('您收藏的二手房已达到上限，系统已自动覆盖之前的房源信息');
					}
					var favorite = "";
					for(var i=0;i < (favorite_list.length>=size?size:favorite_list.length);i++){
						var his_id = getparam(favorite_list[i],'id');
						if(his_id == id){
						}else{
							favorite += favorite_list[i]+'|';
						}
					}
					localStorage.setItem('esf_favorite', item+(favorite==''?'':'|')+(favorite==''?"":favorite.substring(0,(favorite.length-1))));
					show_msg();
					//$('#favorite').html('取消');
					document.getElementById("favorite").innerHTML='取消';
					document.getElementById("favorite").style.backgroundImage=shoucangh;
				}
			}else if(m=='zfdetail'){
				item += "id~"+id+";";
				item += "url~"+location.href+";";
				item += "img~"+$('#storageimg').html()+";";
				item += "title~"+($('.title').html()==null?"":$('.title').html())+";";
				item += "price~"+($('.price').html()==null?"":$('.price').html())+";";
				item += "room~"+($('.room').html()==null?"":$('.room').html())+";";
				item += "addr~"+($('.addr').html()==null?"":$('.addr').html());
				if(all_favorite == ''){
					localStorage.setItem(storage_type, item);
					show_msg();
					document.getElementById("favorite").innerHTML='取消';
					document.getElementById("favorite").style.backgroundImage=shoucangh;
				}else{
					var favorite_list = all_favorite.split("|");
					if(favorite_list.length >= size){
						alert('您收藏的租房已达到上限，系统已自动覆盖之前的房源信息');
					}
					var favorite = "";
					for(var i=0;i < (favorite_list.length>=size?size:favorite_list.length);i++){
						var his_id = getparam(favorite_list[i],'id');
						if(his_id == id){
						}else{
							favorite += favorite_list[i]+'|';
						}
					}
					localStorage.setItem('zf_favorite', item+(favorite==''?'':'|')+(favorite==''?"":favorite.substring(0,(favorite.length-1))));
					show_msg();
					document.getElementById("favorite").innerHTML='取消';
					document.getElementById("favorite").style.backgroundImage=shoucangh;
				}
			}else if(m=='xiaoquinfo'){
				item += "id~"+id+";";
				item += "img~"+$('.coverImg').html()+";";
				item += "url~"+location.href+";";
				item += "title~"+($('.title').html()==null?"":$('.title').html())+";";
				item += "esfnum~"+($('.esfnum').html()==null?"":$('.esfnum').html())+";";
				item += "zfnum~"+($('.zfnum').html()==null?"":$('.zfnum').html())+";";
				item += "esfprice~"+($('.esfprice').html()==null?"":$('.esfprice').html())+";";
				item += "zfprice~"+($('.zfprice').html()==null?"":$('.zfprice').html());
				if(all_favorite == ''){
					localStorage.setItem(storage_type, item);
					show_msg();
					$('#favorite').html('取消收藏');
				}else{
					var favorite_list = all_favorite.split("|");
					if(favorite_list.length >= size){
						alert('您收藏的小区已达到上限，系统已自动覆盖之前的房源信息');
					}
					var favorite = "";
					for(var i=0;i < (favorite_list.length>=size?size:favorite_list.length);i++){
						var his_id = getparam(favorite_list[i],'id');
						if(his_id == id){
						}else{
							favorite += favorite_list[i]+'|';
						}
					}
					localStorage.setItem('xiaoqu_favorite', item+(favorite==''?'':'|')+(favorite==''?"":favorite.substring(0,(favorite.length-1))));
					show_msg();
					$('#favorite').html('取消收藏');
				}
			}
		}else if($(this).html() == '取消收藏'){
			var favorite_list = all_favorite.split("|");
					var favorite = "";
					for(var i=0;i < (favorite_list.length);i++){
						var his_id = getparam(favorite_list[i],'id');
						if(his_id == id){
						}else{
							favorite += favorite_list[i]+'|';
						}
					}
			localStorage.setItem(storage_type, favorite==""?"":favorite.substring(0,(favorite.length-1)));
			show_hmsg();
			$('#favorite').html('收藏');
		}else if($(this).html() == '取消'){ //二手房的取消按钮
			var favorite_list = all_favorite.split("|");
					var favorite = "";
					for(var i=0;i < (favorite_list.length);i++){
						var his_id = getparam(favorite_list[i],'id');
						if(his_id == id){
						}else{
							favorite += favorite_list[i]+'|';
						}
					}
			localStorage.setItem(storage_type, favorite==""?"":favorite.substring(0,(favorite.length-1)));
			show_hmsg();
			//$('#favorite').html('收藏');
			document.getElementById("favorite").innerHTML='收藏';
			document.getElementById("favorite").style.backgroundImage=shoucangn;
		}
	});
	
	$("#top").click(function () {
		//myScroll.scrollTo(0,0,300,false);
	});
	
	function more(i) {
		$("#more_" + i + "").click(function () {
			$("#short_" + i + "").hide();
			$("#all_" + i + "").show();
			$("#more_" + i + "").hide();
			$("#up_" + i + "").show();
			//myScroll.refresh();
		});
	}
	
	function up(i) {
		$("#up_" + i + "").click(function () {
			$("#short_" + i + "").show();
			$("#all_" + i + "").hide();
			$("#more_" + i + "").show();
			$("#up_" + i + "").hide();
			//myScroll.refresh();
		});
	}
	
	//$(window).resize(function() {
	//	hideurlbar();
	//	myScroll.refresh();
	//});
	
	$('#xfphoto').click(function(){
			var city = request('city')==null?"":request('city');
			var id = request('id')==null?"":request('id');
			window.location = "/xf.d?city="+city+"&m=album&id="+id;
	});
	
	$('#esfphoto').click(function(){
			var city = request('city')==null?"":request('city');
			var id = request('id')==null?"":request('id');
			var type = request('type')==null?"":request('type');
			if(type == null || type == '' || type=='false'){
				var url = document.URL;
				type = 'AGT';
				if(url.indexOf("WAGT_") > 0){
					type = 'WAGT';
				}
				if(url.indexOf("JX_") > 0){
					type = 'JX';
				}
			}
			window.location = "/esf.d?city="+city+"&m=photo&id="+id+"&type="+type;
	});
	
	$('#zfphoto').click(function(){
			var city = request('city')==null?"":request('city');
			var id = request('id')==null?"":request('id');
			var type = request('type')==null?"":request('type');
			if(type == null || type == ''){
				var url = document.URL;
				type = 'AGT';
				if(url.indexOf("JX_") > 0){
					type = 'JX';
				}
			}
			window.location = "/zf.d?city="+city+"&m=photo&id="+id+"&type="+type;
	});
	
	$('#jiajuphoto').click(function(){
			var id = request('id')==null?"":request('id');
			window.location = "/jiaju.d?m=jiajuinfo&city="+city+"&id="+id;
	});
	
	$('#xiaoquphoto').click(function(){
			var city = request('city')==null?"":request('city');
			var id = request('id')==null?"":request('id');
			window.location = "/xiaoqu.d?city="+city+"&m=album&id="+id;
	});
	
	$('#pic_back').click(function(){
		$("#photo").hide();
		$("#info").show();
		$("#overlay").show();
	});
	
	$("#back").click(function () {
		$(".detail").hide();
		$(".detail").empty();
		$(".pagelist").show();
		$('.head').show();
		$('.nav').show();
		$('.foot').show();
		$("body").scrollTop(window.localStorage.locate);
	});
	
	$("#map_back").click(function(){
		$("#map_back").hide();
		$("#info").show();
		$("#overlay").show();
		$("#map_canvas").hide();
		$("#map_canvas").empty();
	});
	
	$('#footer a').click(function(){
		var url = document.URL;
		var housetype = '';
		var size = 50;
		var city = request('city');
		var phone = $('#phone').html();
		var from = ($('#from').html()=='undefined' || $('#from').html()==null)?"":$('#from').html();
		var isShopPhone='';
		if(from == 'baidu'){
			isShopPhone = 3;
		}
		if(url.indexOf('esf.d') > 0 || url.indexOf('type=1') > 0 || url.indexOf('chushou') > 0){
			housetype = 'esf';
		}else if(url.indexOf('xf.d') > 0 || url.indexOf('type=0') > 0 || url.indexOf('houseinfo') > 0){
			housetype = 'xf';
			phone = phone.replace(' style="color:red"','');
			phone = phone.replace('<span class=\"f18\">','');
			phone = phone.replace('</span>','');
		}else if(url.indexOf('zf.d') > 0 || url.indexOf('type=2') > 0 || url.indexOf('rentinfo') > 0){
			housetype = 'zf';
		}else if(url.indexOf('tuan.d') > 0){
			housetype = 'tuan';
		}
		var call_his = localStorage.getItem('call_his')==null?"":localStorage.getItem('call_his');
		var item = '';
		item += "title~"+$('#title').html()+";";
		item += "phone~"+phone.replace('转',',')+";";
		item += "time~"+new Date().getTime();
		if(call_his == null || call_his == ''){
			localStorage.setItem('call_his', item);
		}else{
			var call_his_list = call_his.split("|");
			var call_History = "";
			for(var i=0;i < (call_his_list.length>=size?size:call_his_list.length);i++){
				var phone_his = getparam(call_his_list[i],'phone');
				if(phone_his == (phone.replace('转',','))){
				}else{
					call_History += call_his_list[i]+'|';
				}
			}
			localStorage.setItem('call_his', item+(call_History==''?'':'|')+(call_History==''?"":call_History.substring(0,(call_History.length-1))));
		}
		$.ajax({url:"/data.d?m=tel&city="+city+"&housetype="+housetype+"&id="+request('id')+"&phone="+phone+"&isShopPhone="+isShopPhone,async:true})
	})
	
	function hideurlbar(){
		var ua = navigator.userAgent.toLowerCase();
		var h = $(".wrap");
		if (ua.indexOf('windows') != -1) {
			h.css("height", "100%");
		}else if (ua.indexOf('android') != -1) {
			h.css("height", (window.innerHeight + 42) + "px");
			window.scrollTo(1, 42);
			if (document.documentElement.scrollHeight < window.outerHeight / window.devicePixelRatio) {
				h.css("height", (window.outerHeight / window.devicePixelRatio) + "px");
			}
		} else if(ua.indexOf('iphone') != -1){
			$('.wrap').css("height",window.innerHeight+100);
			window.scrollTo(0, 1);
			$(".wrap").css("height",window.innerHeight); 
		}
	}
	
	
});

function request(paras) {
	var url = document.URL;
	if (url.indexOf("#") > 0) {
		url = url.substring(0, url.indexOf("#"));
	}
	if(url.indexOf("html") < 0){
		var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
		var paraObj = {};
		for (i = 0; j = paraString[i]; i++) {
			paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=") + 1, j.length);
		}
		var returnValue = paraObj[paras.toLowerCase()];
		if (typeof (returnValue) == "undefined") {
			return "";
		} else {
			return returnValue;
		}
	}else{
		url = url.substring(0, url.indexOf(".html")).replace('http://','');
		var paraString = url.split("/");
		if(url.indexOf("chushou") > 0){
			if(paras == 'city'){
				return paraString[2];
			}else if(paras == 'id'){
				var chushouid = paraString[3];
				if(chushouid.indexOf("_") > 0){
					var csid = chushouid.split("_");
					chushouid = csid[1];
				}
				return chushouid;
			}else if(paras == 'm'){
				return 'esfdetail';
			}
		}else if(url.indexOf("houseinfo") > 0){
			if(paras == 'city'){
				return paraString[2];
			}else if(paras == 'id'){
				return paraString[3];
			}else if(paras == 'm'){
				return 'xfinfo';
			}
		}else if(url.indexOf("rentinfo") > 0){
			if(paras == 'city'){
				return paraString[2];
			}else if(paras == 'id'){
				var rentid = paraString[3];
				if(rentid.indexOf("_") > 0){
					var rid = rentid.split("_");
					rentid = rid[1];
				}
				return rentid;
			}else if(paras == 'm'){
				return 'zfdetail';
			}
		}
		else if(url.indexOf("xiaoqu") > 0){
			if(paras == 'city'){
				return paraString[2];
			}else if(paras == 'id'){
				return paraString[3];
			}else if(paras == 'm'){
				return 'xiaoquinfo';
			}
		}
	}
}


function getparam(str,name){
	var paraString = str.split(";");
	var paraObj = {} 
	for (i=0; j=paraString[i]; i++){ 
		paraObj[j.substring(0,j.indexOf("~")).toLowerCase()] = j.substring(j.indexOf("~")+1,j.length); 
	}
	return paraObj[name];
}

function show_msg(){
	var width = (document.body.offsetWidth/2)-50;
	$('#favorite_msg').show();
	$('#favorite_msg').css('top','250px');
	$('#favorite_msg').css('left',width+'px');
	$('#favorite_msg').html('收藏成功');
	setTimeout("removeDiv()",3000);
}

function show_hmsg(){
	var width = (document.body.offsetWidth/2)-50;
	$('#favorite_msg').show();
	$('#favorite_msg').css('top','250px');
	$('#favorite_msg').css('left',width+'px');
	$('#favorite_msg').html('已取消收藏');
	setTimeout("removeDiv()",3000);
}

function removeDiv(){
	$("#favorite_msg").hide(500);
}

function changetel(){
	var t = $('#phone').html();
	if($('#phone').html().indexOf("span") >= 0){
		$('#phone').html($('#phone').html().replace('class="f18"','class="f18" style="color:red"'));
	}
}