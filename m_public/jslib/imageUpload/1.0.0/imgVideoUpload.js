/**
 * 图片视频上传插件
 * Created by lina on 18/1/11.
 */
define('imageUpload/1.0.0/imgVideoUpload', ['jquery', 'imageUpload/jpegMeta','imageUpload/imageCompresser'], function (require) {
    'use strict';
    var $ = require('jquery'),
        JpegMeta = require('imageUpload/jpegMeta'),
        ImageCompresser = require('imageUpload/imageCompresser');
    var config = {
        endpoint: location.protocol + '//vod.bj.baidubce.com',         //传入Bucket所在区域域名
        sessionToken: _vars.sessionToken,
        credentials: {
            ak: _vars.ak,     //您的AccessKey
            sk: _vars.sk      //您的SecretAccessKey
        }
    };
    var client = new baidubce.sdk.VodClient(config);
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
            fatherTemp: '<dl></dl>',
            // 图片显示模版
            imgTemp: '<img width="61" class="imgClass">',
            // 删除图片按钮模版
            delBtnTemp: '<a class="del"></a>',
            // loading样式
            loadingClass: '',
            // 加载中图片地址
            loadingGif:'',
            // 添加图片按钮模版
            inputTemp: '<input id="uploadBtn" type="file" multiple="multiple" class="upload-input">',
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
            // 父节点
            that.fatherDom = $(that.options.fatherTemp);
            // 如果不支持图片上传，就提示下载app
            if (!isFileInputSupported) {
                alert('不支持文件上传');
            }
            // 初始化图片数组
            that.imgsArray = [];
            // 存放input容器
            that.input = $(that.options.sonTemp).addClass(that.options.inputClass).
            append($(that.options.inputTemp).on('change', {m: that}, that.inputHandle));
            // 如果有额外的点击上传按钮
            if (that.options.richInputBtn) {
                $(that.options.richInputBtn).on('change', {m: that}, that.inputHandle);
            } else {
                that.loadInput();
            }
            $(that.options.container).prepend(that.fatherDom);
            // 编辑页
            that.imgsArray.forEach(function(opt){
                if(opt.mediaId){
                    var uploadBtn = document.getElementById('uploadBtn');
                    if(uploadBtn){
                        uploadBtn.setAttribute('accept','image/*');
                        var uploadTxt = document.getElementById('uploadTxt');
                        uploadTxt.innerText = '添加图片';
                    }
                }
            });
            that.options.numChangeCallback(that.imgsArray.length,that.imgsArray);
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
            var imgCount = $(that.options.imgCountId);
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
            var confirmInfo = '确定要删除此图片吗?';
            var mediaId = e.data.m.mediaId;
            if(mediaId){
                confirmInfo = '确定要删除此视频吗?'
            }
            if (confirm(confirmInfo)) {
                var data = e.data.m;
                if(mediaId){
                    var uploadBtn = document.getElementById('uploadBtn');
                    var uploadTxt = document.getElementById('uploadTxt');
                    uploadTxt.innerText = '添加图片/视频';
                    uploadBtn.removeAttribute('accept');
                }
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
            // dom不存在，加上
            if (!fileObj.dom) {
                var son = $(that.options.sonTemp),
                    img = $(that.options.imgTemp);
                fileObj.dom = {
                    son: son,
                    img: img
                };
                son.append(img.hide());
                if(fileObj.mediaId){
                    son.append('<div id="v-cover" mediaId="'+ fileObj.mediaId +'" class="v-cover"><i></i><span>'+ _vars.message +'</span></div>');
                }
                if (this.fatherDom.find(this.input).length > 0 && !fileObj.mediaId) {
                    this.input.before(son);
                } else {
                    // 添加
                    var pendStyle = fileObj.mediaId ? 'prepend' : 'append';
                    that.fatherDom[pendStyle](son);
                }
            }
            // 如果正在加载
            if (loading) {
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
                // 如果有百度云上传id
                if(fileObj.mediaId){
                    fileObj.dom.img.show().attr('mediaId', fileObj.mediaId);
                }
                fileObj.dom.img.show().attr('src', fileObj.imgurl);
                // 清除load样式
                fileObj.dom.son.removeClass(that.options.loadingClass);
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
                var arr = that.options.imgsUrl.split(';');
                $.each(arr, function (index, ele) {
                    var eleArr = ele.split(','),
                        fileObj = {imgurl: eleArr[0], fileName: eleArr[1],mediaId:eleArr[2]};
                    that.imgsArray.push(fileObj);
                    that.addBlock(fileObj);
                });
            }
            that.addInput();
            // 不超过最大值，就显示input框
            if (that.imgsArray.length >= that.options.maxLength) {
                that.hideInput();
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
            var that = this;
            // data = JSON.parse(data);
            data = eval('('+data+')');
            if (data.result) {
                fileObj.imgurl = data.result.url;
                that.addBlock(fileObj);
                that.imgsArray.push(fileObj);
                seajs.emit('numChange', that.imgsArray.length);
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
                type: file.type,
                generTime: file.generTime || '',
                gpsX: file.latitude || '',
                gpsY: file.longitude || '',
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
            if (count === 0 || count < this.options.maxLength) {
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
            var trueCount = self.options.maxLength - self.imgsArray.length - files.length;
            self.judgeInput(self.imgsArray.length + files.length);
            // 判断是否超过最大上传数量
            if (trueCount < 0) {
                files = files.slice(0, self.options.maxLength - self.imgsArray.length);
            }
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
                                if (jpg.exif.DateTimeOriginal) {
                                    file.generTime = jpg.exif.DateTimeOriginal.value;
                                }
                                if (jpg.gps.latitude && jpg.gps.longitude) {
                                    file.latitude = jpg.gps.latitude.value;//x
                                    file.longitude = jpg.gps.longitude.value;//y
                                }
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
                        // 如果上传的文件是视频
                    } else if(file.type === 'video/mp4' || file.type === 'video/quicktime'){
                        if($('#v-cover').length){
                            alert('只能上传一个视频！');
                            return false;
                        }
                        if(file.size > 104857600){
                            alert('视频文件大小不能超过100兆!');
                            return false;
                        }
                        var fileObj = {
                            imgurl:_vars.fangImg,
                            fileName:'video',
                            mediaId:''
                        };
                        client.createMediaResource('标题', '描述', file)
                            .then(function(response){
                                fileObj.mediaId = response.body.mediaId;
                                self.imgsArray.push(fileObj);
                                var uploadBtn = document.getElementById('uploadBtn');
                                uploadBtn.setAttribute('accept','image/*');
                                var uploadTxt = document.getElementById('uploadTxt');
                                uploadTxt.innerText = '添加图片';
                                self.addBlock(fileObj);
                                seajs.emit('numChange', self.imgsArray.length);
                            })    // 成功
                            .catch(function(error){
                                console.log('err');
                            });
                    }else {
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
