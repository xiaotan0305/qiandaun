/**
 * 二手房活动上传插件
 * @author liuxinlu@fang.com   2017-02-23.
 */
define('imageUpload/1.0.0/imageUpload_esfhd', ['imageUpload/jpegMeta','imageUpload/imageCompresser'], function (require) {
    'use strict';
    var $ = require('jquery'),
        JpegMeta = require('imageUpload/jpegMeta'),
        ImageCompresser = require('imageUpload/imageCompresser');
    // loadingGif图
    var loadingGif = '';
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

    function ImageUpload(opts) {
        var that = this;
        that.options = {
            sonTemp: '<dd></dd>',
            // 容器父节点
            fatherTemp: '#upload_img',
            // 图片显示模版
            imgTemp: '<img width="61" class="imgClass">',
            // 删除图片按钮模版
            delBtnTemp: '<a class="del"></a>',
            // loading样式
            loadingClass: 'load',
            // 添加图片按钮模版
            inputTemp: '<input type="file" accept="image/*" multiple="multiple" class="upload-input">',
            // 图片容器
            container: '#uploadPic',
            // input的容器样式
            inputClass: 'add',
            imgCountId: '#imgCountId',
            // 上传图片地址
            url: '',
            // 最多上传图片
            maxLength: 1,
            // 额外上传按钮，例如论坛中点击图片
            richInputBtn: '#pic',
            // 已上传图片地址，用作编辑时，目前是以：'图片名1,图片地址1;图片名2,图片地址2' 这种形式拼接
            imgsUrl: '',
            inputBtn:'#proxyInput',
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
            that.imgsArray = '';
            // 用于上传的图片数组
            that.upArr = [];
            // 图片上传容易
            that.container = $(that.options.container);
            // 存放input容器
            that.input = $(that.options.inputTemp).on('change', {m: that}, that.inputHandle);
            // 填充图片上传input容器
            that.addInput();
        },

        /**
         * 添加input容器
         */
        addInput: function () {
            if (this.container.find(this.input).length > 0) {
                this.input.show();
                return;
            }
            this.container.append(this.input);
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
            var that = this;
            that.imgsArray = '';
            alert('图片上传失败');
        },

        /**
         * 上传成功处理函数
         */
        onSuccess: function (fileObj, data) {
            var that = this;
            var inputBtn = $(that.options.inputBtn);
            data = eval('('+data+')');
            if (data) {
                fileObj.imgurl = data.imgUrl;
                fileObj.fileName = data.imgName;
                that.imgsArray = fileObj;
                //添加imgurl地址
                inputBtn.attr('disabled',false).val(data.imgUrl);
            } else {
                that.onFailure(fileObj);
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
                formData.append('pic', file);
                xhr.send(formData);
            }
        },

        /**
         * 发送前准备数据
         * @param file
         * @param uploadBase64
         */
        prepareUpload: function (file, uploadBase64, isLast) {
            var that = this;
            that.upArr.push(uploadBase64);
            if (isLast){
                this.upload(that.upArr);
            }
        },

        /**
         * 选中图片处理方法
         * @param e
         */
        inputHandle: function (e) {
            var self = e.data.m,
                that = this,
                files = e.target.files || e.dataTransfer.files;
            files = self.filter(files);
            var trueCount = self.options.maxLength - files.length;
            // 超过最大数量剔除最后超过的张数
            if (trueCount < 0) {
                alert('最多只能上传10张');
                return false;
             //   files = files.slice(0, self.options.maxLength);
            }
            that.upArr = [];
            that.imgsArray ='';
            $.each(files, function (index, file) {
                if (file) {
                    var reader = new FileReader(),
                        uploadBase64 = '';
                    // jpg的图片才进行角度处理
                    if (file.type === 'image/jpeg') {
                        var conf = {};
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
                                    if (files.length === (index + 1)) {
                                        self.prepareUpload(file, uploadBase64, true);
                                    } else {
                                        self.prepareUpload(file, uploadBase64, false);
                                    }

                                };
                                img.src = ImageCompresser.getFileObjectURL(file);
                            }
                        };
                        reader.readAsBinaryString(file);
                    } else {
                        reader.onload = function (e) {
                            uploadBase64 = e.target.result;
                            if (files.length === (index + 1)) {
                                self.prepareUpload(file, uploadBase64, true);
                            } else {
                                self.prepareUpload(file, uploadBase64, false);
                            }
                        };
                        reader.readAsDataURL(file);
                    }
                }
            });
        }
    };
    return ImageUpload;
});
