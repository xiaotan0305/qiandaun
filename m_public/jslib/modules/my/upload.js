define('modules/my/upload', ['jquery', 'jwingupload/global', 'jwingupload/jpegMeta',
    'jwingupload/imageCompresser'
], function (require) {
    'use strict';
    var $ = require('jquery'),
        JpegMeta = require('jwingupload/jpegMeta').JpegMeta,
        ImageCompresser = require('jwingupload/imageCompresser');
    // var vars = seajs.data.vars;
    require('jwingupload/global');
    var $uploadInput = $('input[type=file]');

    function upload(option) {
        if (option) {
            $.extend(true, this.option, option);
        }
        this.init();
    }
    upload.prototype = {
        fileFilter: [],
        option: {
            url: '/bbs/?c=mycenter&a=ajaxUploadImgNew',
            imgContainer: '#upload',
            imgUrl: '',
            ajaxUpload: function () {

            },
            onSuccess: function (file, result) {
                var that = this;
                if (result) {
                    var resultObj = eval('(' + result + ')');
                    this.imgUrl = resultObj.result.url;
                    if (file.data) {
                        $(this.imgContainer).attr('src', file.data);
                    }
                    this.ajaxUpload(this.imgUrl);
                } else {
                    that.onFailure(file);
                }
            },
            onFailure: function (file) {
                alert('图片' + file.name + '上传失败');
            }
        },
        upload: function (file, uploadBase64) {
            var that = this;
            var xhr = new XMLHttpRequest();
            if (xhr.upload) {
                // 文件上传成功或是失败
                xhr.onreadystatechange = function () {
                    if (Number(xhr.readyState) === 4) {
                        if (Number(xhr.status) === 200) {
                            that.option.onSuccess(file, xhr.responseText);
                        } else {
                            that.option.onFailure(file, xhr.responseText);
                        }
                    }
                };
                // 开始上传
                xhr.open(
                    // method
                    'POST',
                    // target url
                    that.option.url + '&fileName=' + file.name + '&type=' + file.type
                    // , async, default to true
                );
                var formData = new FormData();
                formData.append('pic', uploadBase64);
                xhr.send(formData);
            }
        },
        inputHandle: function (e) {
            e.stopPropagation();
            var self = e.data.m,
                files = e.target.files || e.dataTransfer.files;
            var i = 0;
            var funAppendImage = function () {
                var file = files[i];
                if (file) {
                    var reader = new FileReader(),
                        conf = {};
                    if (window.NETTYPE === window.NETTYPE_WIFI) {
                        conf = {
                            maxW: 3000,
                            maxH: 1280,
                            quality: 0.8
                        };
                    }
                    reader.onload = function () {
                        var result = this.result,
                            uploadBase64 = '';
                        // var orien = false;
                        if (file.type === 'image/jpeg') {
                            try {
                                var jpg = new JpegMeta.JpegFile(result, file.name);
                            } catch (err) {
                                jq.DIC.dialog({
                                    content: '图片不是正确的图片数据',
                                    autoClose: true
                                });
                                return false;
                            }
                            if (jpg.tiff && jpg.tiff.Orientation) {
                                conf = jq.extend(conf, {
                                    orien: jpg.tiff.Orientation.value
                                });
                            }
                        }
                        if (ImageCompresser.ImageCompresser.support()) {
                            var img = new Image();
                            img.onload = function () {
                                try {
                                    uploadBase64 = ImageCompresser.ImageCompresser.getImageBase64(this, conf);
                                    file.data = uploadBase64;
                                } catch (err) {
                                    return false;
                                }
                                if (uploadBase64.indexOf('data:image') < 0) {
                                    alert('上传照片格式不支持');
                                    return false;
                                }
                                i++;
                                self.upload(file, uploadBase64);
                                funAppendImage();
                            };
                            img.onerror = function () {
                                alert('解析图片数据失败');
                                return false;
                            };
                            img.src = ImageCompresser.ImageCompresser.getFileObjectURL(file);
                        }
                    };
                    reader.readAsBinaryString(file);
                }
            };
            funAppendImage();
        },
        init: function () {
            $uploadInput.on('change', {
                m: this
            }, this.inputHandle);
        }
    };
    return upload;
});