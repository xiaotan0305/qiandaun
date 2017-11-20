/*
 * @Author: chenshaoshan
 * @Date:   2015/11/05
 * @description: 猜房价
 * @Last Modified by:   chenshaoshan
 * @Last Modified time: 
 */
	//---------------------- 
$(function() {

//	---------------------------------------------------------------------
	  $(".js_city_other_input").on({
		    focus:function(){
		    	$('.js_cfj_other_ul').hide();
		    	citySelectFocus(this);
		    },  
		    change:function(){
		    	$('js_city_other_input').val($(this).val());
		    	$(this).next().val($(this).attr('enname'));
		    }, 
		    input:function(){
		    	cityNameSelect(this,'js_city_other_ul');
		    }
		  });
	  
	  
	  $(".js_cfj_other_input").on({
		    click:function(){
			  getLoupanOnclick(this,'js_cfj_other_ul');
		    },  
		    change:function(){
		    	$(this).next().val($(this).attr('enname'));
		    }, 
		    input:function(){
		    	getLoupanByKeyWorld(this,'js_cfj_other_ul','');
		    },
		    
		  });
//	  loseselectproj  
	  $(".bga").on({
		  click:function(){
		    	$('.js_cfj_other_ul').hide();
		    }
		    
		  });
//	---------------------------------------------------------------------
	  
	  
    //城市获取焦点时触发的事件
      function citySelectFocus(goalEleInput)
      {
      	if($(goalEleInput).val())return;
      	var hotCityInfo=[["北京","bj"],["上海","sh"],["广州","gz"],["深圳","sz"],["武汉","wuhan"]];
      	var resHtml="";
      	for(var i=0;i<hotCityInfo.length;i++)
      	{
      		resHtml+=("<li enName=\""+hotCityInfo[i][1]+"\">"+hotCityInfo[i][0]+"</li>");;
      	}
      	$('.js_city_other_ul').html(resHtml);
      	$('.js_city_other_ul').show();
      	bindClickLi("js_city_other_ul",goalEleInput);
      }
      //对goalEleClass下li绑定click事件，对goalEleInput进行赋值
      function bindClickLi(goalEleClass,goalEleInput)
      {
      	$("."+goalEleClass).find("li").click(function()
      			{
      			$(goalEleInput).val($(this).html());
      			$(goalEleInput).attr("enname",$(this).attr("enname"));
      			$(goalEleInput).change();
      			$("."+goalEleClass).hide();
      			});
      }
      //根据城市名获取城市拼音的缩写
      function cityNameSelect(goalEleInput,goalEleUlClass)
      {
      	var cityName=$(goalEleInput).val();
      	if(cityName==""){citySelectFocus(goalEleInput);return;};
      	var url="/activity.d?m=getCityPinyinName&cityName="+cityName;
      	$.ajax({
      			type: 'GET', 
      			url: url, 
      			timeout:2000, 
      			cache: false, 
      			dataType : "json", 
      			async: false, 
      			success: function(data){
      			var resHtml="";
      			for(var i=0;i<data.length;i++)
      				{
      				resHtml+=("<li enName=\""+data[i][1]+"\">"+data[i][0]+"</li>");;
      				}
      			$('.'+goalEleUlClass).html(resHtml);
      			$('.'+goalEleUlClass).show();
      			bindClickLi(goalEleUlClass,$(goalEleInput)[0])
      			
      			//城市完全匹配情况下，直接选中
      			if(data.length==1 && cityName == data[0][0])
      			{
      			$('.'+goalEleUlClass+" li").click();	
      							
      			}
      			}
      		});
    	$('.js_cfj_other_input').val('');
        $('.js_cfj_other_input_enname').val('');
      }
      
//-----------------------------------------------------------------------------------
//------------------------------------------------------------------------------------
      isnear=1;//1表示第一次进入   0表示之后进入小区选择
      function getLoupanOnclick(_this,goalEleClass)
      {
          setTimeout(function(){
          if(isnear==1){//首次进入填入最近的5个小区
            isnear=0;
            $("."+goalEleClass).show();
      	  bindClickLi(goalEleClass,_this);
          }else{
              getLoupanByKeyWorld(_this,goalEleClass);
          }
          },500);
          
      }
      function loseselectproj()
      {
           $(".js_cfj_other_ul").hide();
      }
    //获得监听事件元素  goalEleClass需要展示的ul，
      function getLoupanByKeyWorld(_this,goalEleClass)
      {
    	  $(this).next().val($(this).attr('enname'));
          if(isnear==1){//首次进入填入最近的5个小区
          }else{//自己手动选择小区,做联想查询
          var keyword=$(_this).val();
      	var city=$(".js_city_input").val();
      	//if(_this.id!="js_cfj_self_projname"&&(!city)){alert("请先选择城市");return;}
      	city=city||'bj';
      	var url = "/shopinfo.d?m=getLoupan&from=1&city="+city+"&purpose="+'<%=URLEncoder.encode(URLEncoder.encode("住宅", "utf-8"),"utf-8")%>'+"&keyword="+encodeURIComponent(encodeURIComponent(keyword));
      	$.get(url,function(data){
      		if(!(data&&data.root&&data.root.items))return;
      		var items = data.root.items;
      		var resHtml = "";
      		for(var i=0;i<items.length;i++){
      			resHtml+=("<li enname=\""+items[i]['projcode']+"\">"+items[i]['projname']+"</li>");
      		}
      		$("."+goalEleClass).show();
      		$("."+goalEleClass).html(resHtml);
      		bindClickLi(goalEleClass,_this);
      	});
          }

      }
    
      


})
      
      
      
