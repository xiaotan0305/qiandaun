/**
 * 图片上传插件
 * Created by liyingying on 16/1/13.
 */
define('imageUpload/1.0.0/imageUpload_job', ['jquery', 'imageUpload/jpegMeta','imageUpload/imageCompresser'], function (require) {
    'use strict';
    var $ = require('jquery'),
        JpegMeta = require('imageUpload/jpegMeta'),
        ImageCompresser = require('imageUpload/imageCompresser');
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
            uploadBtn : '',
            url : '',
            onSuccess : function (fileObj, data) {
            },
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
            // 存放input容器
            that.input = $(that.options.uploadBtn).on('change', {m: that}, that.inputHandle);
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
                            that.options.onSuccess(file, xhr.responseText);
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
            this.upload(fileObj);
        },

        /**
         * 选中图片处理方法
         * @param e
         */
        inputHandle: function (e) {
            var self = e.data.m,
                files = e.target.files || e.dataTransfer.files;
            files = self.filter(files);
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
    };
    return ImageUpload;
});
