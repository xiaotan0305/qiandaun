/**
 * Created by tkp19 on 2016/4/16 0016.
 */
$(function () {
    'use strict';

    /**
     * 图片上传
     */
    var uploadInt = $('#uploadPic'),
        uploadImgBox = $('#addPic'),
        loading = $('.loading');
    // 初始化图片数组
    var imgsArray = [];
    var fileObj = {};
    var maxLength = 1;
    // 图片上传地址
    var url = '/bbs/?c=bbs&a=ajaxUploadImage&city=bj';

    /**
     * 文件过滤  只选取第一张
     * @param files 文件
     */
    function filter(files) {
        return files.length > 0 ? files[0] : null;
    }


    /**
     * 上传文件
     * @param fileObj 包含文件信息的对象
     */
    function upload(fileObj) {
        var xhr = new XMLHttpRequest();
        if (xhr.upload) {
            // 文件上传成功或是失败
            xhr.onreadystatechange = function () {
                if (Number(xhr.readyState) === 4) {
                    if (Number(xhr.status) === 200) {
                        onSuccess(fileObj, xhr.responseText);
                    } else {
                        onFailure(fileObj, xhr.responseText);
                    }
                }
            };
            onProgress(fileObj);
            // 开始上传
            xhr.open(
                // method
                'POST',
                // target url
                url + '&fileName=' + fileObj.fileName + '&type=' + fileObj.type
            );
            var formData = new FormData();
            formData.append('pic', fileObj.imgurl);
            xhr.send(formData);
        }
    }

    /**
     * 上传失败
     * @param fileObj 包含文件信息的对象
     */
    function onFailure(fileObj) {
        deleteData(fileObj);
        showMsg('图片' + fileObj.fileName + '上传失败');
    }

    /**
     * 上传成功处理函数
     * @param fileObj 包含文件信息的对象
     * @param result 服务器返回数据
     */
    function onSuccess(fileObj, result) {
        var data = JSON.parse(result);
        if (!data.result) {
            alert('文件上传失败(；′⌒`)');
            return;
        }
        loading.hide();
        uploadImgBox.attr('src', fileObj.imgurl);
        $('.scan').show();
        setTimeout(function(){
            window.location.href='/huodongAC.d?class=MotherFestivalHc&m=result'
        },2000);
    }

    /**
     * 上传中...
     * @param fileObj 包含文件信息的对象
     */
    function onProgress(fileObj) {
        loading.show();
    }

    uploadInt.on('change', function (e) {
        var files = e.target.files || e.dataTransfer.files;
        var file = filter(files);
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

                    if (ImageCompresser.support()) {
                        var img = new Image();
                        img.onload = function () {
                            try {
                                uploadBase64 = ImageCompresser.getImageBase64(this, conf);
                            } catch (err) {
                                return;
                            }
                            if (uploadBase64.indexOf('data:image') < 0) {
                                showMsg('上传照片格式不支持');
                                return;
                            }
                            // TODO 上传图片到服务器
                            fileObj = {
                                imgurl: uploadBase64,
                                fileName: file.name,
                                fileId: file.name.split('.')[0].replace(/[ |(|)]/g, ''),
                                type: file.type
                            };
                            upload(fileObj);
                        };
                        img.src = ImageCompresser.getFileObjectURL(file);
                    }
                };
                reader.readAsBinaryString(file);
            } else {
                reader.onload = function (e) {
                    uploadBase64 = e.target.result;
                    // TODO 上传图片到服务器
                    fileObj = {
                        imgurl: uploadBase64,
                        fileName: file.name,
                        fileId: file.name.split('.')[0].replace(/[ |(|)]/g, ''),
                        type: file.type
                    };
                    upload(fileObj);
                };
                reader.readAsDataURL(file);
            }
        }
    });
});