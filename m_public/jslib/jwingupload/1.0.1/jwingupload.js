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
(function(window, factory) {
    if (typeof define === 'function') {
        // AMD
        define('jwingupload/1.0.5/jwingupload', ['jquery'], function () {
            return factory(window);
        });
    } else {
        // browser global
        window.jWingUpload = factory(window);
    }
})(window,function(window){
    var win = window,$ = win.$,document = win.document,hostname = win.location.hostname.split("."),len = hostname.length, version = "1.0.0", core_Ids = [], jWingUpload, isFileInputSupported;
    document["domain"] = hostname[len-2]+"."+hostname[len-1];
    jWingUpload = function (config) {
        config = config || {};
        // 合并默认配置
        config = $.extend(true, {}, jWingUpload.defaults, config);
        return new jWingUpload.fn.init(config);
    };
    isFileInputSupported = (function () {
        if (navigator.userAgent.match(/(Android (1.0|1.1|1.5|1.6|2.0|2.1))|(Windows Phone (OS 7|8.0))|(XBLWP)|(ZuneWP)|(w(eb)?OSBrowser)|(webOS)|(Kindle\/(1.0|2.0|2.5|3.0))/)) {
            return false;
        }
        var el = document.createElement("input");
        el.type = "file";
        return !el.disabled;
    })();
    jWingUpload.fn = jWingUpload.prototype = {
        version:version,
        constructor: jWingUpload,
        init: function(config){
            var that = this,dom = {},
                form = $(config['form']),
                picBlock = $(config['uploadPic']),
                preBlock = $(config['preview']),
                iFrame = $(config['iFrame'])
                that.hiddenImgList = [];
                that.imgList = [];
            if (!isFileInputSupported) {
                picBlock.empty();
                $.each(picBlock, function(index, val) {
                    val.bind("click",function(){
                        if(confirm("\u60A8\u7684\u6D4F\u89C8\u5668\u4E0D\u652F\u6301\u56FE\u7247\u4E0A\u4F20\uFF0C\u8BF7\u4E0B\u8F7D\u641C\u623Fapp\u4E0A\u4F20\u56FE\u7247")){
                            var util = require('util');
                            util.down();
                        }
                    });
                });
                
                return this;
            }
            this.dom = dom;
            this.config = config;
            dom.form = form;
            dom.picBlock = picBlock;
            dom.preBlock = preBlock;
            dom.iFrame = iFrame;
            dom.input = [];
            $.each(picBlock,function(index,elem){
                var input = $("<input/>").attr({type:"file",name:"pic"+index,id:"pic"+index,accept:"image/*","class":"upload-input"}).appendTo(elem);
                dom.input.push(input);
            });
            dom.uploadurl = form.attr("action");
            dom.nowItem = null;
            $.each(dom.input, function(index, val) {
              val.bind("click",function(){
                var ele=null,result=false;
                if(that.imgList.length<1) {
                    result = true;
                } else {
                    $.each(that.imgList,function(index,element){
                        var d = element.dom,currentId = event.target.id,imgurl_id = element.dom.id;
                        if(d.holder==false){
                            if(imgurl_id === currentId){
                                var tp = [];
                                that.imgList = tp.concat(that.imgList.slice(index,index+1));
                            }
                            result = true;
                            ele = event.target;
                            return false;
                        }
                    });
                }   
                  
                  if(result == true)
                    val.unbind("change").bind("change",{m:that,d:ele,index:index},inputHandle);
              
            });
        });
            return this;
        },
        length: 0,
        createPreview: function() {
            var that = this,
                dom = that.dom,
                index = arguments[0]||0,
                u_blokcks = {};
                dom.preBlock.empty();
                dom.tplDiv = $(jWingUpload._template).appendTo(dom.preBlock);
                that.hiddenImgList = [];
                dom.picBlock.eq(index).find("img").remove();
                dom.preBlock.find("div.circleBar").find('div.circle').text("0%");
                var dd = dom.preBlock.find("div.circleBar");
                u_blokcks.input = $("<input/>").attr({type:"file",name:"pic"+index,id:"pic"+index,accept:"image/*","class":"upload-input"}).appendTo(dd).bind("change",{m:that,d:dd},inputHandle);
                u_blokcks.imgurl = "";
                u_blokcks.holder = false;
                u_blokcks.id = "pic"+index;
                dd.dom = u_blokcks;
                dd.detach();
                that.hiddenImgList.push(dd);
        },
        push: core_Ids.push,
        sort: core_Ids.sort,
        splice: core_Ids.splice
    };
    jWingUpload.fn.init.prototype = jWingUpload.fn;
    var getImage = function (that,dd){
        var iFrame = that.dom.iFrame.get(0),
            index = arguments[2]||0,
            picBlock = that.dom.picBlock.eq(index),
            preBlock = that.dom.preBlock;
            dom = dd.dom;
            doc = iFrame.contentDocument || iFrame.contentWindow.document;
            that.holder = false;
            dom.holder = false;
        if(doc && doc.readyState && doc.readyState == "complete"){
            dom.imgurl = doc.getElementsByTagName('div')[0].innerHTML;
            if(dom.imgurl){
                preBlock.empty().css("display","none");
                //$("<div></div>").attr({class:"bbsAddPic",id:"bbsAddPic"}).css("display",'none').appendTo(picBlock);
                $("<img/>").attr({src:dom.imgurl,width:"68px",height:"68px"}).prependTo(picBlock);
            }else{
                alert("\u4E0A\u4F20\u5931\u8D25\uFF0C\u8BF7\u91CD\u65B0\u4E0A\u4F20");
               // deleteHandle({m:that,d:dd});
            }
        }
    };
    /*
     * 单击“选择文件按钮”处理函数
     */
    var inputHandle = function (e){
        var data = e.data,
            that = data.m,
            dd = data.d,
            files = e.target.files,
            form = that.dom.form.get(0),
            iFrame = that.dom.iFrame.get(0),
            input = e.target;
            pic_index = data.index;
        if(files.length>0){
            if(that.holder == true){
                input.value = ""; //文件地址
                alert("\u6709\u4E00\u5F20\u56FE\u7247\u6B63\u5728\u4E0A\u4F20\uFF0C\u8BF7\u5B8C\u6210\u540E\u518D\u8BD5");
                return false;
            }
            that.createPreview(pic_index);
            dd = that.hiddenImgList.shift();
            that.imgList.push(dd);
            that.dom.preBlock.append(dd);
            dd.dom.holder = true;
            form.onsubmit = function(){return true;};
            iFrame.onload = function(){getImage(that,dd,pic_index);};
            form.action = that.dom.uploadurl+"&rand="+ new Date().getTime();
            that.holder = true;
            form.submit();
        
            setTimeout(function(){
                input.value='';
                that.dom.picBlock.eq(pic_index).find("img").empty();
                that.dom.preBlock.css({display:"block",background:"#fff",padding:"0",top: "-80px",position: "relative"}).appendTo(that.dom.picBlock.eq(pic_index));
                 pie.run({
                   pie1: ".pie1",
                   pie2: ".pie2",
                   percent: 1
                 });
            },10)
        }else{
            form.onsubmit = function(){return false;};
        }
    };
    var deleteHandle = function (e){

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
    };
    jWingUpload.defaults = {
        form:null,
        uploadPic:null,
        preview:null,
        iFrame:null
    };
    jWingUpload._template = '<div class="circleBar"> <div class="hold hold1"><div class="pie pie1"></div> </div><div class="hold hold2"><div class="pie pie2"></div></div><div class="bg"></div><div class="circle">50%</div></div>';
    return jWingUpload;
});


 var pie = {
        run: function(opts) {
            if (!opts.pie1 || !opts.pie2) throw new Error('must be element pie1 and pie2.');
            var pie1 = $(opts.pie1),
                  pie2 = $(opts.pie2);
            var percent = opts.percent || 0;
            var step = opts.step || 3;
            var delay = opts.delay || 1;
            var callback = opts.callback || $.noop;
            var i = 0,
                rage = 360 * percent;
            var djs = function() {
                i = i + step;
                if (i <= rage) {
                    if (i <= 180) {
                        if ((180 - i) < step) {
                            i = 180;
                        }
                        pie1.css("-webkit-transform", "rotate(" + i + "deg)");
                         var pst = parseInt($('.circle').html((i/180)*100+"%"));
                    } else {
                        if ((rage - i) < step) {
                            i = rage;
                        }
                        pie2.css("-webkit-transform", "rotate(" + (i - 180) + "deg)");
                    
                    }
                    callback(i, rage);
                    setTimeout(djs, delay);
                }
            };
            djs();
        }
    };