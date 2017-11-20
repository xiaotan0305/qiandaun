/**
 * 图片上传插件
 * Created by liyingying on 16/1/13.
 */
define('imageUpload/1.0.0/imageUpload_myzf', ['jquery', 'imageUpload/jpegMeta','imageUpload/imageCompresser'], function (require) {
    'use strict';
    var $ = require('jquery'),
        JpegMeta = require('imageUpload/jpegMeta'),
        ImageCompresser = require('imageUpload/imageCompresser');
    // loadingGif图
    var loadingGif = '';
    var vars = seajs.data.vars;
    // 是否支持图片input file
    var isFileInputSupported = (function () {
        // Handle devices which falsely report support
        var reg = /(Android (1.0|1.1|1.5|1.6|2.0|2.1))|(Windows Phone (OS 7|8.0))|(XBLWP)|(ZuneWP)|(w(eb)?OSBrowser)|(webOS)|(Kindle\/(1.0|2.0|2.5|3.0))/;
        if (navigator.userAgent.match(reg)) {
            return false;
        }
        // Create test element
        var el = document.createElement('input');
        el.type = 'file';
        return !el.disabled;
    })();
    var htmlObj = '<div id="sendFloat" class="tz-box2" style="height: 800.4px; display: none;">'
        + '<div id="sendText" class="yzm-sta" style="top: 280px;">请输入文字，完成点评</div></div>';
    if(!$('#sendFloat').length){
        $('body').append(htmlObj);
    }
    // 信息提示弹层
    var sendFloatId = $('#alertBox');
    var sendTextId = $('.alert-txt');
    function show(keywords) {
        sendFloatId.show();
        sendTextId.html(keywords);
    }
    var $msgObj = $('#sendFloat');
    var $msg = $('#sendText');
    function displayLose(keywords){
        $msg.text(keywords);
        $msgObj.show();
        setTimeout(function(){
            $msgObj.hide();
        },2400)
    }
    function ImageUpload(opts) {
        var that = this;
        that.options = {
            sonTemp: '<dd></dd>',
            fatherTemp: '<dl></dl>',
            // 图片显示模版
            imgTemp: '<img width="61" class="imgClass" alt="图片加载失败">',
            // 删除图片按钮模版
            delBtnTemp: '<a class="del"></a>',
            // loading样式
            loadingClass: '',
            // 添加图片按钮模版
            inputTemp: '<input type="file" accept="image/*" multiple="multiple" class="upload-input">',
            // 图片容器
            container: '',
            // input的容器样式
            inputClass: 'add',
            imgCountId: '#imgCountId',
            // 上传图片地址
            url: '',
            // 最多上传图片
            maxLength: 9,
            // 额外上传按钮，例如论坛中点击图片
            richInputBtn: '#pic',
            // 已上传图片地址，用作编辑时，目前是以：'图片名1,图片地址1;图片名2,图片地址2' 这种形式拼接
            imgsUrl: '',
            // ++++++++++++
            loadingGif: '',
            // 数量改变时执行的回调
            numChangeCallback: function (count) {
                $('#last').html(that.options.maxLength - count);
            }
        };
        $.extend(that.options, opts);
        that.init();
    }

    ImageUpload.prototype = {

        /**
         * 初始化
         */
        init: function () {
            var that = this;
            // 如果不支持图片上传，就提示下载app
            if (!isFileInputSupported) {
                alert('不支持文件上传');
            }
            // 初始化图片数组
            that.imgsArray = [];
            // 存放input容器
            // 父节点
            that.fatherDom = $(that.options.fatherTemp);
            that.input = $(that.options.sonTemp).addClass(that.options.inputClass).
                append($(that.options.inputTemp).on('change', {m: that}, that.inputHandle));
            // 如果有额外的点击上传按钮
            if (that.options.richInputBtn) {
                $(that.options.richInputBtn).on('change', {m: that}, that.inputHandle);
            } /*else {
                that.loadInput();
            }*/
            that.loadInput();
            // 父节点
            // that.fatherDom = $(that.options.fatherTemp);
            $(that.options.container).prepend(that.fatherDom);
            var imgCount = $(that.options.imgCountId);
            // 监听图片数量改变事件
            seajs.on('numChange', function (count) {
                that.judgeInput(count);
                // 需要数量
                if (imgCount.length) {
                    if (count) {
                        imgCount.show().html(count);
                    } else {
                        imgCount.hide();
                    }
                }
                that.options.numChangeCallback(count);
            });
        },

        /**
         * 删除数据
         */
        deleteData: function (data) {
            var that = this;
            // 移除当前dom
            data.dom.son.remove();
            var pos = that.imgsArray.indexOf(data);
            // 如果文件对象存在，移除对象
            if (pos > -1) {
                that.imgsArray.splice(pos, 1);
                seajs.emit('numChange', that.imgsArray.length);
            }
        },

        /**
         * 删除子节点
         * @param e
         */
        deleteBlock: function (e) {
            var self = e.data.me;
            if (confirm('\u786e\u5b9a\u8981\u5220\u9664\u6b64\u56fe\u7247\u5417\u003f')) {
                var data = e.data.m;
                self.deleteData(data);
            }
        },

        /**
         * 添加子节点
         * @param fileObj
         * @param loading 是否正在加载
         */
        addBlock: function (fileObj, loading) {
            var that = this;
            var $explain = $('.explain');
            // dom不存在，加上
            if (!fileObj.dom) {
                var son = $(that.options.sonTemp),
                    img = $(that.options.imgTemp);
                fileObj.dom = {
                    son: son,
                    img: img
                };
                son.append(img.hide());
                if (this.fatherDom.find(this.input).length > 0) {
                    this.input.before(son);
                } else {
                    // 添加
                    that.fatherDom.append(son);
                }
            }
            // 如果正在加载
            if (loading) {
                if (vars.action === 'publishExamine' || vars.action === 'autoAppeal') {
                    $(that.options.container).find('.add').hide();
                }
                if($explain.length){
                    if($(that.options.container).find('img').length){
                        $explain.hide();
                    }else{
                        $explain.show();
                    }
                }
                // 如果有loading样式，就加载，没有的话就直接赋值src
                if (that.options.loadingClass) {
                    fileObj.dom.son.addClass(that.options.loadingClass);
                } else {
                    fileObj.dom.img.show().attr('src', that.options.loadingGif);
                }
            } else {
                var delBtn = $(that.options.delBtnTemp);
                fileObj.dom.delBtn = delBtn;
                // 添加删除按钮
                fileObj.dom.son.append(delBtn);
                // 绑定删除事件
                delBtn.on('click', {m: fileObj, me: that}, that.deleteBlock);
                // 替换图片
                fileObj.dom.img.show().attr('src', fileObj.imgurl);
                // 清除load样式
                fileObj.dom.son.removeClass(that.options.loadingClass);
                // ++++++++++
                fileObj.dom.img.on('error',function () {
                    $(this).addClass('defaultImg');
                });
            }
        },

        /**
         * 添加input容器
         */
        addInput: function () {
            if (this.fatherDom.find(this.input).length > 0) {
                this.input.show();
                return;
            }
            this.fatherDom.append(this.input);
        },

        /**
         * 隐藏input容器
         */
        hideInput: function () {
            this.input.hide();
        },

        /**
         * 自动加载input按钮
         */
        loadInput: function () {
            var that = this;
            // 子节点
            that.sonDom = [];
            // 如果已经存在已上传的图片
            if (that.options.imgsUrl) {
                if(that.options.imgsUrl.indexOf(';') > -1){
                    var arr = that.options.imgsUrl.split(';');
                }else{
                    var arr = that.options.imgsUrl.split(',');
                }
                $.each(arr, function (index, ele) {
                    var eleArr = ele.split(','),
                        fileObj = {imgurl: eleArr[0], fileName: eleArr[1]};
                    that.imgsArray.push(fileObj);
                    that.addBlock(fileObj);
                });
                seajs.emit('numChange', that.imgsArray.length);
            }
            // 不超过最大值，就显示input框
            if (that.imgsArray.length < that.options.maxLength) {
                that.addInput();
            }
        },

        /**
         * 文件过滤
         * @param files 文件
         */
        filter: function (files) {
            var arrFiles = [];
            for (var i = 0, file; file = files[i]; i++) {
                arrFiles.push(file);
            }
            return arrFiles;
        },

        /**
         * 上传失败
         */
        onFailure: function (file) {
            this.deleteData(file);
            alert('图片' + file.fileName + '上传失败');
        },

        /**
         * 上传成功处理函数
         */
        onSuccess: function (fileObj, data) {
            /* var that = this;
             data = JSON.parse(data);
             if (data.result) {
             fileObj.imgurl = data.result;
             that.addBlock(fileObj);
             that.imgsArray.push(fileObj);
             seajs.emit('numChange', that.imgsArray.length);
             } else {
             that.onFailure(fileObj);
             }*/
            var that = this;
            data = eval('('+data+')');
            if (data.result) {
                fileObj.imgurl = data.result.url;
                that.addBlock(fileObj);
                that.imgsArray.push(fileObj);
                seajs.emit('numChange', that.imgsArray.length);
            } else {
                that.onFailure(fileObj);
                //上传失败展示上传按钮
                if (vars.action === 'publishExamine' || vars.action === 'autoAppeal') {
                    $(that.options.container).find('.add').show();
                }
            }
        },

        /**
         * 上传文件
         * @param file 文件
         */
        upload: function (file) {
            var that = this;
            var xhr = new XMLHttpRequest();
            if (xhr.upload) {
                // 文件上传成功或是失败
                xhr.onreadystatechange = function () {
                    if (Number(xhr.readyState) === 4) {
                        if (Number(xhr.status) === 200) {
                            that.onSuccess(file, xhr.responseText);
                        } else {
                            that.onFailure(file, xhr.responseText);
                        }
                    }
                };
                // 开始上传
                xhr.open(
                    // method
                    'POST',
                    // target url
                    that.options.url + '&fileName=' + file.fileName + '&type=' + file.type
                );
                var formData = new FormData();
                formData.append('pic', file.imgurl);
                xhr.send(formData);
            }
        },

        /**
         * 发送前准备数据
         * @param file
         * @param uploadBase64
         */
        prepareUpload: function (file, uploadBase64) {
            var fileObj = {
                imgurl: uploadBase64,
                fileName: file.name,
                type: file.type
            };
            // 开始loading
            this.addBlock(fileObj, true);
            this.upload(fileObj);
        },

        /**
         * 判断input显示或者隐藏
         * @param count
         */
        judgeInput: function (count) {
            // +++++++++++++++++++
            if (count < this.options.maxLength || $(this.options.container).find('img').length < this.options.maxLength) {
                this.addInput();
            } else {
                this.hideInput();
            }
        },

        /**
         * 选中图片处理方法
         * @param e
         */
        inputHandle: function (e) {
            var self = e.data.m,
                files = e.target.files || e.dataTransfer.files;
            files = self.filter(files);
            // +++++++++++++++start
            if ($(self.options.container).is(':hidden')) {
                $('.main').hide();
                $('.header').eq(0).hide();
                $('.photoMain').show();
            }
            if(vars.action === 'xqPicPerfect'){
                var Img = $(self.options.container).find('img');
                var ImgLen = parseInt(Img.length);
                var uploadLen = files.length;
                var allNumber = parseInt(ImgLen + uploadLen);
                var number = parseInt(self.options.maxLength);
                if(allNumber > number){
                    show('最多上传' + self.options.maxLength + '张图片');
                }
            }else{
                var Img = $(self.options.container).find('img');
                var ImgLen = parseInt(Img.length);
                var uploadLen = files.length;
                var allNumber = parseInt(ImgLen + uploadLen);
                var number = parseInt(self.options.maxLength);
                if(allNumber > number){
                    displayLose('最多上传' + self.options.maxLength + '张图片');
                }
            }
            // +++++++++++++end
            if (files.length){
                var trueCount = self.options.maxLength - $(self.options.container).find('img').length - files.length;
                self.judgeInput(self.imgsArray.length + files.length);
                // 判断是否超过最大上传数量
                if (trueCount < 0) {
                    files = files.slice(0, self.options.maxLength - $(self.options.container).find('img').length);
                }
                $.each(files, function (index, file) {
                    if (file) {
                        var reader = new FileReader(),
                            uploadBase64 = '';
                        // jpg的图片才进行角度处理
                        if (file.type === 'image/jpeg') {
                            var conf = {};
                            if(vars.action === 'xqPicPerfect') {
                                conf = {maxW: 2000, maxH: 2000, quality: 1};
                            }
                            reader.onload = function () {
                                var result = this.result;
                                try {
                                    // 获取角度
                                    var jpg = new JpegMeta.JpegFile(result, file.name);
                                    if (jpg.tiff && jpg.tiff.Orientation) {
                                        conf.orien = jpg.tiff.Orientation.value;
                                    }
                                } catch (err) {
                                    console.log('throw error');
                                }
                                // 由于图片服务器有压缩处理，所以在这儿就只处理角度
                                if (ImageCompresser.support()) {
                                    var img = new Image();
                                    img.onload = function () {
                                        try {
                                            uploadBase64 = ImageCompresser.getImageBase64(this, conf);
                                        } catch (err) {
                                            return false;
                                        }
                                        if (uploadBase64.indexOf('data:image') < 0) {
                                            alert('上传照片格式不支持');
                                            return false;
                                        }
                                        self.prepareUpload(file, uploadBase64);
                                    };
                                    img.src = ImageCompresser.getFileObjectURL(file);
                                }
                            };
                            reader.readAsBinaryString(file);
                        } else {
                            reader.onload = function (e) {
                                uploadBase64 = e.target.result;
                                self.prepareUpload(file, uploadBase64);
                            };
                            reader.readAsDataURL(file);
                        }
                    }
                });
            }
        }
    };
    return ImageUpload;
});
