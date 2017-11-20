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
    if ( typeof module === "object" && typeof module.exports === "object" ) {
        // CommonJS
        module.exports = factory(window);
    } else {
        // browser global
        factory(window);
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
            var that = this,dom = {},
                form = $(config['form']),
                picBlock,
                preBlock = $(config['preview']),
                iFrame = $(config['iFrame']),
                maxLength = config['maxLength'];
            //初始化图片列表
            that.hiddenImgList = [];
            that.imgList = [];
            if(maxLength != undefined && maxLength > 0)
            {
                var template = "<dl>";
                for(var i=0; i<maxLength; i++)
                {
                    template += "<dd></dd>";
                }
                template += "</dl>";
                jWingUpload._template = template;
            }
            if (!isFileInputSupported) {
                return this;
            }
            this.dom = dom;
            this.config = config;
            dom.form = form;
            dom.preBlock = preBlock;
            dom.iFrame = iFrame;
            dom.uploadurl = form.attr("action");
            dom.nowItem = null;
            if(that.imgList.length<1){
                that.createPreview();
                var dd = that.hiddenImgList.shift();
                that.imgList.push(dd);
                that.dom.dl.append(dd);
            }
            this.counter = 1;
            return this;
        },
        length: 0,
        createPreview: function() {
            var that = this,
                dom = that.dom;
            dom.dl = $(jWingUpload._template).appendTo(dom.preBlock);

            dom.preBlock.css("display","inline-block");
            dom.dl.children("dd").attr({"class":"add"}).each(function(index, element) {
                var dd = $(element), dom={};
                dom.index = index;
                dom.input = $("<input/>").attr({type:"file",name:"pic"+index,id:"pic"+index,accept:"image/*","class":"upload-input"}).appendTo(element).bind("change",{m:that,d:dd},inputHandle);
                dom.img = $('<img src="'+that.config.imgPath+'images/loading.gif" style="margin:10px 9px 9px 10px;width:31px; height:31px;">');
                dom.closebtn = $('<a href="javascript:;">&nbsp;</a>');
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
    var getImage = function (that,dd){
        var iFrame = that.dom.iFrame.get(0),
            dom = dd.dom;
        doc = iFrame.contentDocument || iFrame.contentWindow.document;
        that.holder = false;
        dom.holder = false;
        if(doc && doc.readyState && doc.readyState == "complete"){
            dom.imgurl = doc.getElementsByTagName('div')[0].innerHTML;
            if(dom.imgurl){
                var cut_start = dom.imgurl.indexOf("|w");
                if(cut_start>0){
                    dom.imgurl = dom.imgurl.substr(0,cut_start)
                }
                dom.img.attr("src", dom.imgurl);
                dom.img.css({"margin":"0px","width":"70px","height":"70px"});
                dd.append(dom.closebtn.unbind("click").bind("click",{m:that,d:dd},deleteHandle));
            }else{
                $("#askAddMesg").html("\u4E0A\u4F20\u5931\u8D25\uFF0C\u8BF7\u91CD\u65B0\u4E0A\u4F20");
                setTimeout(function(){$("#askAddMesg").html("");},2000);
                deleteHandle({m:that,d:dd});
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

        if(files.length>0){
            if(that.holder == true){
                input.value = "";
                $("#askAddMesg").html("\u6709\u4E00\u5F20\u56FE\u7247\u6B63\u5728\u4E0A\u4F20\uFF0C\u8BF7\u5B8C\u6210\u540E\u518D\u8BD5");
                setTimeout(function(){$("#askAddMesg").html("");},2000);
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
            form.onsubmit = function(){return true;};
            iFrame.onload = function(){getImage(that,dd);};
            form.action = that.dom.uploadurl+"&rand="+ new Date().getTime();
            that.holder = true;
            form.submit();
            setTimeout(function(){
                input.value = "";
                //dd.dom.input.attr("value","");
                dd.removeClass("add").empty().append(dd.dom.img.attr("src", that.config.imgPath+"images/loading.gif").css({"margin":"10px 9px 9px 10px","width":"31px","height":"31px"}));
                //dd.dom.img.css({"margin":"10px 9px 9px 10px","width":"31px","height":"31px"});
            },10)
        }else{
            form.onsubmit = function(){return false;};
        }
    };
    var deleteHandle = function (e){
        if(confirm("确定要删除此图片吗？")){
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
        }
    };
    jWingUpload.defaults = {
        form:null,
        preview:null,
        iFrame:null
    };
    jWingUpload._template = "<dl><dd></dd><dd></dd><dd></dd><dd></dd></dl>";
    if ( typeof define === 'function') {
        define("jwingupload/1.0.4/jwingupload.source",[],function() {
            return jWingUpload;
        });
    }else{
        win.jWingUpload = jWingUpload;
    }
    return jWingUpload;
});