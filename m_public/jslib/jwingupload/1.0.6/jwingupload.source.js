/**
 * Created by Sunny on 14-4-17.
 */
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
//(function(window, factory) {
//if ( typeof module === "object" && typeof module.exports === "object" ) {
//// CommonJS
//module.exports = factory(window);
//} else {
//// browser global
//factory(window);
//}
//})(window,function(window){
define("jwingupload/1.0.6/jwingupload.source",['jquery','jwingupload/global','jwingupload/jpegMeta','jwingupload/JPEGEncoder','jwingupload/imageCompresser'],function(require,exports,module) {
    require('jwingupload/global');
    var JpegMeta = require('jwingupload/jpegMeta').JpegMeta;
    var ImageCompresser = require('jwingupload/imageCompresser');
    var win = window,$ = require('jquery'),document = win.document,hostname = win.location.hostname.split("."),len = hostname.length, version = "1.0.0", core_Ids = [], jWingUpload, isFileInputSupported;
    document["domain"] = hostname[len-2]+"."+hostname[len-1];
    jWingUpload = function (config) {
        config = config || {};
        // 合并默认配置
        config = $.extend(true, {}, jWingUpload.defaults, config);
        return new jWingUpload.fn.init(config);
    };
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
        fileFilter:[],
        url:'upload.php',
        imgsArray:[],
        imgsUrl:'',
        maxIndex:0,
        imgCountId:'',
        filter: function(files) {
            var arrFiles = [];
            for (var i = 0, file; file = files[i]; i++) {
                arrFiles.push(file);
            }
            return arrFiles;
        },
        init: function(config){
            var that = this,dom = {},
                form = $(config['form']),
                picBlock,
                preBlock = $(config['preview']),
                iFrame = $(config['iFrame']),
                maxLength = config['maxLength'],
                autoCommit = config['autoCommit'],
                picBlock = $(config['uploadPic']),
                spAct = config['spAct'],
                isCver = config['isCver'],
                imgsUrl = config['imgsUrl'];
            that.url = config['url'];
            that.imgCountId = config['imgCountId'];
            //初始化图片列表
            that.imgList = [];
            that.maxlength = maxLength;
            if('undefined'== typeof autoCommit){
                autoCommit = true;
            }
            that.autoCommit = autoCommit;
            if (!isFileInputSupported) {
                picBlock.empty();
                picBlock.bind("click",function(){
                    if(confirm("\u60A8\u7684\u6D4F\u89C8\u5668\u4E0D\u652F\u6301\u56FE\u7247\u4E0A\u4F20\uFF0C\u8BF7\u4E0B\u8F7D\u641C\u623Fapp\u4E0A\u4F20\u56FE\u7247")){
                        var util = require('util');
                        util.down();
                    }
                });
                return this;
            }
            this.dom = dom;
            this.config = config;
            dom.form = form;
            dom.preBlock = preBlock;
            dom.iFrame = iFrame;
            dom.uploadurl = form.attr("action");
            dom.nowItem = null;
            if("undefined" != typeof imgsUrl&&imgsUrl&&imgsUrl.length){
                that.createPreview();
                var everyImgUrl;
                if (that.config.spAct === 'editDelegate') {
                    everyImgUrl = imgsUrl.split(',');
                } else {
                    everyImgUrl = imgsUrl.split(';');
                }
                if(everyImgUrl&&everyImgUrl.length){
                    var thisLength = everyImgUrl.length;
                    that.dom.dl.children().remove();
                    if(thisLength>maxLength){
                        thisLength = maxLength;
                    }
                    for(var i=0;i<thisLength;i++){
						if(everyImgUrl[i]){
							var fileObj={},imgArr=everyImgUrl[i].split(',');
							var dd = that.createDd(imgArr[0],i);
							fileObj.fileName = imgArr[1];
							fileObj.index  = 'oldfile_'+i;
							fileObj.imgurl = imgArr[0];
							that.imgsArray.push(fileObj);
							that.imgList.push(dd);
							that.dom.dl.append(dd);
						}                        
                    }
                    that.imgList.push(that.addPic);
                    that.dom.dl.append(that.addPic);
                    var dlc = that.dom.dl.children();
                    if(dlc.length>that.maxlength){
                        dlc.last().detach();
                    }
                }
            }
            if(picBlock&&picBlock.length){
                dom.picBlock = picBlock;
                dom.input=$("<input/>").attr({type:"file",name:"pic",id:"pic",accept:"image/*","class":"upload-input","multiple":'multiple'}).appendTo(dom.picBlock);
                dom.input.on('click',function(){
                    if(that.imgsArray.length>=that.maxlength){
                        alert('最多上传'+that.maxlength+'张图片');
                        return false;
                    }
                    dom.input.off('change').on("change",{m:that},that.funGetFiles);
                });
            }else{
                if(that.imgList.length<1){
                    that.createPreview();
                    that.imgList.push(that.addPic);
                    that.dom.dl.append(that.addPic);
                }
            }
            if ($('#oldfile_0').length === 1 && that.config.isCver) {
                var html = '<div class="cver">封面</div>';
                $('#oldfile_0').append(html);
            }
            return this;
        },
        length: 0,
        initImgDom:function(){
            var that = this,dom = that.dom;
            dom.dl = $(jWingUpload._template).appendTo(dom.preBlock);
            dom.preBlock.css("display","inline-block");
        },
        createInput:function(index, element){
            var that = this,dd = $(element),dom = {};
            dom.index = index;
            dom.input = $("<input/>").attr({type:"file",name:"pic"+index,id:"pic"+index,accept:"image/*","class":"upload-input","multiple":'multiple'}).appendTo(element).on("change",{m:that},that.funGetFiles);
            dom.img = $('<img src="'+that.config.imgPath+'images/loading.gif" >');
            dom.closebtn = $('<a href="javascript:;" class="del"></a>');
            dom.imgurl = "";
            dom.holder = false;
            dd.dom = dom;
            dd.detach();
            that.addPic = dd;
            return dd;
        },
        createPreview: function() {
            var that = this;
            that.initImgDom();
            var dom = that.dom;
            dom.dl.children("dd").attr({"class":"add"}).each(function(index, element){
                that.createInput(index, element);
            });
        },
        createDd: function(data,i,file) {
            var that = this,dom={};
            if(file){
                file.data = data ;
                var dd = $('<dd id="file_'+file.index+'"></dd>');
                dom.progress =$('<span id="uploadProgress_'+file.index+'" class="upload_progress"></span>');
                dom.img = $('<img  src="'+that.config.imgPath+'images/loading.gif" >').appendTo(dd);
            }else{
                dd = $('<dd id="oldfile_'+i+'"></dd>')
                dom.img = $('<img  src="'+data+'" >').appendTo(dd);
            }
            dom.index = i;
            dom.closebtn = $('<a href="javascript:;" class="del"></a>');

            dom.input = $("<input/>").attr({type:"file",name:"pic"+i,id:"pic"+i,accept:"image/*","class":"upload-input","multiple":'multiple'});
            dom.img.attr('class','imgClass');
            if ($('#bbsAddPic').find('dd').length === 1 && $('#oldfile_0').length === 0 && that.config.isCver) {
                var html = '<div class="cver">封面</div>';
                dd.append(html);
            }
            if ($('#bbsAddPic').find('dd').length === 1 && that.config.isCver) {
                var html = '<div class="cver">封面</div>';
                dd.append(html);
            }
            if(file){
                dd.append(dom.closebtn.on("click",{m:that,d:dd,file:file},that.deleteHandle));
            }else{
                dd.append(dom.closebtn.on("click",{m:that,d:dd},that.deleteHandle));
            }
            dom.holder = true;
            dd.dom = dom;
            return dd;
        },
        funGetFiles:function(e){
            var me = e.data.m,files = e.target.files || e.dataTransfer.files;
            me.inputHandle(files);
        },
        /*
         * 单击“选择文件按钮”处理函数
         */
        inputHandle :function (files){
            var that = this;
            // 获取文件列表对象
            for (var i = 0, file; file = files[i]; i++) {
                //增加唯一索引值
                file.index = that.maxIndex;
                that.maxIndex++;
            }
            files = that.filter(files);
            that.fileFilter = that.fileFilter.concat(files);
            var thisl = 0,fl = that.fileFilter.length;
            if(that.dom.dl){
                thisl = that.dom.dl.children().length-1;
            }
            thisl>=0?thisl:0;
            if((thisl+fl)>that.maxlength){
                files.splice(that.maxlength-thisl);
                that.fileFilter.splice(that.maxlength-thisl);
            }
            if(files.length>0){
                form = that.dom.form.get(0);
                if(that.imgList.length<1){
                    that.createPreview();
                    that.imgList.push(that.addPic);
                    that.dom.dl.append(that.addPic);
                }
                that.dom.preBlock.css("display","inline-block");
                var i = 0;
                var funAppendImage = function() {
                    file = files[i];
                    if (file) {
                        var reader = new FileReader(),conf={};
                        if (window.NETTYPE == window.NETTYPE_WIFI) {
                            conf = {maxW: 3000,maxH: 1280,quality: 0.8};
                        }
                        var imgshow = function(uploadBase64,file){
                            var dd  = that.createDd(uploadBase64,i,file);
                            that.imgList.push(dd);
                            that.dom.dl.children().last().before(dd);
                            i++;
                            var dlc = that.dom.dl.children();
                            if(dlc.length>that.maxlength){
                                dlc.last().detach();
                            }
                            that.funUploadFile(file,uploadBase64);
                            funAppendImage();
                        };
                        if(file.type != 'image/png'){
                            reader.onload = function(e) {
                                var result = this.result,uploadBase64='',orien=false,ignore=false;
                                if (file.type == 'image/jpeg') {
                                    try {
                                        var jpg = new JpegMeta.JpegFile(result, file.name);
                                    } catch (e) {
                                        //alert('图片不是正确的图片数据');
                                        //return false;
                                        ignore = true;
                                    }
                                    if(!ignore){
                                        if (jpg.tiff && jpg.tiff.Orientation) {
                                            conf = jq.extend(conf, {orien: jpg.tiff.Orientation.value});
                                        }
                                    }
                                }
                                if (ImageCompresser.ImageCompresser.support()) {
                                    var img = new Image();
                                    img.onload = function() {
                                        try {
                                            uploadBase64 = ImageCompresser.ImageCompresser.getImageBase64(this, conf);
                                        } catch (e) {
                                            return false;
                                        }
                                        if (uploadBase64.indexOf('data:image') < 0) {
                                            alert('上传照片格式不支持');
                                            return false;
                                        }
                                        imgshow(uploadBase64,file);
                                    }
                                    img.onerror = function() {
                                        alert('解析图片数据失败');
                                        return false;
                                    }
                                    img.src = ImageCompresser.ImageCompresser.getFileObjectURL(file);

                                }
                            }
                            reader.readAsBinaryString(file);
                        }else{
                            reader.onload = function(e){
                                uploadBase64 = e.target.result;
                                imgshow(uploadBase64,file);
                            };
                            reader.readAsDataURL(file);
                        }
                    }
                };
                funAppendImage();
                that.fileFilter=[];
            }
        },
        deleteHandle:function (e){
            var ele = $(this);
            if(confirm("\u786e\u5b9a\u8981\u5220\u9664\u6b64\u56fe\u7247\u5417\u003f")){
                var data = e.data,dd = data.d,that = data.m;
                if(data.file){
                    that.funDeleteFile(data.file,1);
                }else{
                    that.funDeleteFile(dd.attr('id'),2);
                }
                ele.parent().remove();
                that.imgList.shift();
                if(!that.addPic.closest(that.dom.dl).length){
                    that.dom.dl.append(that.addPic);
                }
                if(that.dom.picBlock){
                    if(that.dom.picBlock.length&&that.dom.dl.children().length==1){
                        that.dom.preBlock.hide();
                    }
                }
                var $thatdl = that.dom.dl;
                if (that.dom.dl.children().length === 1 && $thatdl.parent().hasClass('helpAddPic')) {
                    $thatdl.parent().css('display', 'block');
                    $thatdl.addClass('wi80');
                }
                if ($('cver').length === 0 && $('#bbsAddPic').find('dd').length > 1 && that.config.isCver) {
                    var html = '<div class="cver">封面</div>';
                    $('#bbsAddPic').find('dd').first().append(html);
                }
                if ($('cver').length === 0 && $('#bbsAddPic').find('dd').length > 1 && that.config.isCver) {
                    var html = '<div class="cver">封面</div>';
                    $('#bbsAddPic').find('dd').first().append(html);
                }
            }
        },
        onComplete : function(){

        },
        onFailure : function(file,result){
            this.funDeleteFile(file,1);
            this.imgList.shift();
            $('#file_'+file.index).remove();
			var floatDiv = $(".floatAlert"), floatText = $(".floatAlert p"), floatbtn = $("#floatbtn");
            floatbtn.on("click", function(){
                if (floatDiv.attr("display") != 'none') {
                    floatDiv.hide();
                }
            });
            floatDiv.show();
            floatText.text('\u56fe\u7247'+file.name+"\u4e0a\u4f20\u5931\u8d25\u0021");
            //alert('\u56fe\u7247'+file.name+"\u4e0a\u4f20\u5931\u8d25\u0021");
        },
        //删除对应的文件
        funDeleteFile : function(fileDelete,sign) {
            var me=this;
            if(sign==1){
                var imgsLen = me.imgsArray.length;
                if(imgsLen>0){
                    for(var i=imgsLen-1;i>=0;i--){
                        if(me.imgsArray[i].file == fileDelete){
                            me.imgsArray.splice(i,1);
                        }
                    }
                }
            }else if(sign==2){
                var imgsLen = me.imgsArray.length;
                if(imgsLen>0){
                    for(var i=imgsLen-1;i>=0;i--){
                        if(me.imgsArray[i].index == fileDelete){
                            me.imgsArray.splice(i,1);
                        }
                    }
                }
            }
            if(me.imgCountId){
                var imgCountId = $(me.imgCountId);
                if(me.imgsArray.length==0){
                    imgCountId.children("span").remove();
                    $('#info').text('还可以上传9张图片');
                }else{
                    if(imgCountId.children().length==1){
                        imgCountId.append('<span></span>');
                    }
                    $(me.imgCountId+' span').text(me.imgsArray.length);
                    var res = me.maxlength-me.imgsArray.length;
                    $('#info').text('还可以上传'+res+'张图片');
                }

            }
        },
        onSuccess :function(file,result){
            var self = this;
            if(result){
                var resultObj = eval('('+result+')');
                if(resultObj.result.url){
                    self.funDeleteFile(file,0);
                    $('#file_'+file.index+' img').attr('src', file.data);
                    var fileObj={};
                    fileObj.file = file;
                    fileObj.fileName = file.name;
                    fileObj.imgurl = resultObj.result.url;
                    self.imgsArray.push(fileObj);
                    if(self.imgCountId){
                        var imgCountId = $(self.imgCountId);
                        if(imgCountId.children().length==1){
                            imgCountId.append('<span></span>');
                        }
                        $(self.imgCountId+' span').text(self.imgsArray.length);
                        var res = self.maxlength - self.imgsArray.length;
                        $('#info').text('还可以上传'+res+'张图片');
                    }
                }else{
                    self.onFailure(file);
                }
            }else{
                self.onFailure(file);
            }

        },
        onProgress:function(file, loaded, total){
            // var eleProgress = $("#uploadProgress_" + file.index), percent = (loaded / total * 100) + '%';
            // eleProgress.html(percent).show();
        },
        //文件上传
        funUploadFile : function(file,uploadBase64) {
            var self = this;
            var xhr = new XMLHttpRequest();
            if (xhr.upload) {
                // 上传中
                xhr.upload.addEventListener("progress", function(e) {
                    self.onProgress(file, e.loaded, e.total);
                }, false);

                // 文件上传成功或是失败
                xhr.onreadystatechange = function(e) {
                    if (xhr.readyState == 4) {
                        if (xhr.status == 200) {
                            self.onSuccess(file, xhr.responseText);
                            if (!self.fileFilter.length) {
                                //全部完毕
                                self.onComplete();
                            }
                        } else {
                            self.onFailure(file, xhr.responseText);
                        }
                    }
                };
                // 开始上传
                xhr.open(/* method */ "POST",
                    /* target url */ self.url+"&fileName=" + file.name+"&type="+file.type/*, async, default to true */);
                var formData = new FormData();
                formData.append('pic', uploadBase64);
                xhr.send(formData);
            }
        },
        push: core_Ids.push,
        sort: core_Ids.sort,
        splice: core_Ids.splice
    };
    jWingUpload.fn.init.prototype = jWingUpload.fn;
    jWingUpload.defaults = {
        form:null,
        preview:null,
        iFrame:null
    };
    jWingUpload._template = "<dl><dd></dd></dl>";
    return jWingUpload;
});