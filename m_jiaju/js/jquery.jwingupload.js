/*!
 * jWing JavaScript Library v1.0.0
 * http://jwing.com/
 *
 * Includes jquery.js
 * http://jquery.com/
 *
 * Copyright 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jwing.org/license
 *
 * Date: 2013-5-8
 * Auth: yueyanlei
 */
(function( window, undefined ) {
var $ = window.jQuery,
document = window.document,
version = "1.0.0",
core_Ids = [],

/**
*HTML5 图片上传
*/
jWingUpload = function(config){
	config = config || {};
	var defaults = jWingUpload.defaults,i;
    // 合并默认配置
    for (i in defaults) {
        if (config[i] === undefined) {
            config[i] = defaults[i];
        };
    };
	return new jWingUpload.fn.init(config);
},
// Detect input type=file support
isFileInputSupported = (function () {
  // Handle devices which falsely report support
  if (navigator.userAgent.match(/(Android (1.0|1.1|1.5|1.6|2.0|2.1))|(Windows Phone (OS 7|8.0))|(XBLWP)|(ZuneWP)|(w(eb)?OSBrowser)|(webOS)|(Kindle\/(1.0|2.0|2.5|3.0))/)) {
    return false;
  }
  // Create test element
  var el = document.createElement("input");
  el.type = "file";
  return !el.disabled;
})();

jWingUpload.fn = jWingUpload.prototype = {
	version:version,
	constructor: jWingUpload,
	init: function(config){
		var that = this,i = 0,dom = {},
		form = $(config['form']);
		picBlock = $(config['uploadPic']),
		preBlock = $(config['preview']),
		iframe = $(config['iframe']);
		//初始化图片列表
		that.hiddenImgList = [],
		that.imgList = [];
		picBlock.css("display","inline-block");
		if (!isFileInputSupported) {
			picBlock.empty();
			picBlock.bind("click",function(e){
				if(confirm("\u60A8\u7684\u6D4F\u89C8\u5668\u4E0D\u652F\u6301\u56FE\u7247\u4E0A\u4F20\uFF0C\u8BF7\u4E0B\u8F7D\u641C\u623Fapp\u4E0A\u4F20\u56FE\u7247")){
					down();
				}
			});
			return this;
		}
		this.dom = dom;
		this.config = config;
		dom.form = form;
		dom.picBlock = picBlock;
		dom.preBlock = preBlock;
		dom.iframe = iframe;
		dom.input=$("<input/>").attr({type:"file",name:"pic",id:"pic",accept:"image/*","class":"upload-input"}).appendTo(picBlock);
		dom.uploadurl = form.attr("action");
		dom.nowItem = null;

		dom.input.bind("click",function(e){
			var nitem=null,result=false;
			if(that.imgList.length<1)result = true;
			else{
				$.each(that.imgList,function(index,element){
					var d = element.dom;
					if(d.imgurl==""&&d.holder==false){
						nitem = element;
						result = true;
						return false;
					}
				});
			}
			
			if(result == true){
				dom.input.unbind("change").bind("change",{m:that,d:nitem},inputHandle);
			}else{
				dom.input.unbind("change");
				alert("\u60A8\u5DF2\u7ECF\u9009\u62E9\u4E86"+that.imgList.length+"\u5F20\u56FE\u7247");
			}
			return result;
		});
		return this;
	},
	length: 0,
	createPreview: function() {
		var that = this,
		dom = that.dom;
		dom.dl = $(jWingUpload._template).appendTo(dom.preBlock);
		
		dom.preBlock.css("display","inline-block");
		dom.dl.find("dd").attr({"class":"add"}).each(function(index, element) {
            var dd = $(element), dom={};
			dom.index = index;
			dom.input = $("<input/>").attr({type:"file",name:"pic"+index,id:"pic"+index,accept:"image/*","class":"upload-input"}).appendTo(element).bind("change",{m:that,d:dd},inputHandle);
			dom.img = $('<img src="'+that.config.imgpath+'images/loading.gif" style="margin:10px 9px 9px 10px;width:31px; height:31px;">');
			dom.closebtn = $('<a href="javascript:;">&#88;</a>');
			dom.imgurl = "";
			dom.holder = false;
			dd.dom = dom;
			dd.detach();
			that.hiddenImgList.push(dd);
        });
	},
	push: core_Ids.push,
	sort: core_Ids.sort,
	splice: core_Ids.splice
};
jWingUpload.fn.init.prototype = jWingUpload.fn;
function getImage(that,dd){
	var iframe = that.dom.iframe.get(0),
	dom = dd.dom;
	doc = iframe.contentDocument || iframe.contentWindow.document;
	that.holder = false;
	dom.holder = false;
	if(doc && doc.readyState && doc.readyState == "complete"){
		dom.imgurl = doc.getElementsByTagName('div')[0].innerHTML;
		if(dom.imgurl){
			dom.img.attr("src", dom.imgurl);
			dom.img.css({"margin":"0px","width":"50px","height":"50px"});
			dd.append(dom.closebtn.unbind("click").bind("click",{m:that,d:dd},deleteHandle));
			/*.unbind("load").bind("load",function(e){
				dom.img.css({"margin":"0px","width":"50px","height":"50px"});
				dd.append(dom.closebtn.unbind("click").bind("click",{m:that,d:dd},deleteHandle));
			});*/
		}else{
			alert("\u4E0A\u4F20\u5931\u8D25\uFF0C\u8BF7\u91CD\u65B0\u4E0A\u4F20");
			deleteHandle({m:that,d:dd});
		}
	}
}
/*
* 单击“选择文件按钮”处理函数
*/
function inputHandle(e){
	var data = e.data,
	that = data.m,
	dd = data.d,
	files = e.target.files,
	form = that.dom.form.get(0);
	iframe = that.dom.iframe.get(0),
	input = e.target;
	
	if(files.length>0){
		if(that.holder == true){
			input.value = "";
			alert("\u6709\u4E00\u5F20\u56FE\u7247\u6B63\u5728\u4E0A\u4F20\uFF0C\u8BF7\u5B8C\u6210\u540E\u518D\u8BD5");
			return false;	
		}
		if(that.imgList.length<1){
			that.createPreview();
			dd = that.hiddenImgList.shift();
			that.imgList.push(dd);
			that.dom.dl.append(dd);
		}
		that.dom.preBlock.css("display","inline-block");
		dd.dom.holder = true;
		if(that.hiddenImgList.length>0){
			var td = that.hiddenImgList.shift();
			that.imgList.push(td);
			that.dom.dl.append(td);
		}
		form.onsubmit = function(e){return true;};
		iframe.onload = function(e){getImage(that,dd);};
		form.action = that.dom.uploadurl+"&rand="+ new Date().getTime();
		/*if(e.target.name != that.dom.input.attr("name")){
			that.dom.input.attr("value","");
		}else{
			var name = dd.dom.input.attr("name");
			$.each(that.imgList,function(index,element){
				if(name != element.dom.input.attr("name")){
					element.dom.input.attr("value","");
				}
			});
		}*/
		that.holder = true;
		form.submit();
		setTimeout(function(e){
			input.value = "";
			//dd.dom.input.attr("value","");
			dd.removeClass("add").empty().append(dd.dom.img.attr("src", that.config.imgpath+"images/loading.gif").css({"margin":"10px 9px 9px 10px","width":"31px","height":"31px"}));
			//dd.dom.img.css({"margin":"10px 9px 9px 10px","width":"31px","height":"31px"});
		},200)
	}else{
		form.onsubmit = function(e){return false;};
	}
	
}
function deleteHandle(e){
	var data = e.data,
	that = data.m,
	dd = data.d;
	theindex=0;
	dd.addClass("add").empty().append(dd.dom.input.unbind("change").bind("change",{m:that,d:dd},inputHandle));
	dd.dom.imgurl = "";
	
	$.each(that.imgList,function(index,element){
		if(element == dd){
			theindex=index;
			return false;
		}
	});
	if(theindex != that.imgList.length-1){
		dd.detach();
		//从imgList中删除
		that.imgList.splice(theindex,1);
		var imgNum = 0;
		$.each(that.imgList,function(index,element){
			var d = element.dom;
			if(d.imgurl!=""||d.holder==true){
				imgNum++;
			}
		});
		if(imgNum==that.imgList.length){
			that.imgList.push(dd);
			that.dom.dl.append(dd);
		}else{
			that.hiddenImgList.push(dd);
		}
	}

	//如果最后没有上传图片，则隐藏
	if(that.imgList.length==1){
		that.dom.preBlock.hide();
	}
}
jWingUpload.defaults = {
	form:null,
	uploadPic:null,
	preview:null,
	iframe:null,
};
jWingUpload._template = "<dl><dd></dd><dd></dd><dd></dd><dd></dd></dl>";
window.jWingUpload = jWingUpload;
})( window );