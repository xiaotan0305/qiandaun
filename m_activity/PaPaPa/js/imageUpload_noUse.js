/**
 * Created by tkp19 on 2016/4/16 0016.
 */
$(function () {
    'use strict';

    /**
     * 图片上传
     */
    var uploadIntBox = $('#uploadBtnBox'),
        uploadInt = $('#uploadBtn'),
        uploadImgBox = $('#imgBox');
    // 初始化图片数组
    var imgsArray = [];
    var fileObj = {};
    var maxLength = 8;
    // 图片上传地址
    var url = '//m.test.fang.com/bbs/?c=bbs&a=ajaxUploadImage&city=bj';

    /**
     * 文件过滤
     * @param files 文件
     */
    function filter(files) {
        var arrFiles = [];
        for (var i = 0, file; file = files[i]; i++) {
            arrFiles.push(file);
        }
        return arrFiles;
    }

    /**
     * 增加图片dom节点
     * @param fileObj 删除数据下标
     */
    // function addBlock(fileObj) {
    //     var oDiv = $('<div class="fl form-lable fgw70">&nbsp;</div>'),
    //         oP = $('<p class="clearfix" id='+ fileObj.fileId +'></p>'),
    //         oSpan = $('<span class="fl mr20 font14">' + fileObj.fileName +'</span>'),
    //         oSuccess = $('<span class="fl suggestion_fd_ts mr10"><em class="icon_finished"></em>上传成功</span>'),
    //         oDel = $('<span class="btn_cancle"></span>');
    //     oDel.get(0).fileMsg = fileObj;
    //     oP.append(oDiv).append(oSpan).append(oSuccess).append(oDel);
    //     uploadImgBox.append(oP);
    //     if (imgsArray.length >= maxLength) {
    //         uploadIntBox.hide();
    //     }
    // }

    /**
     * 删除子节点
     * @param fileObj 删除数据下标
     */
    // function deleteBlock(fileObj) {
    //     if (confirm('确定删除吗')) {
    //         $('#' + fileObj.fileId).remove();
    //         deleteData(fileObj);
    //     }
    // }

    /**
     * 删除数据
     * @param fileObj 包含文件信息的对象
     */
    function deleteData(fileObj) {
        var pos = imgsArray.indexOf(fileObj.fileName);
        // 如果文件对象存在，移除对象
        if (pos > -1) {
            imgsArray.splice(pos, 1);
        }

        if (imgsArray.length < maxLength) {
            uploadIntBox.show();
        }
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

    // 信息弹层
    var msg = $('#msg'),
        msgP = msg.find('p'),
        timer = null;

    /**
     * 信息弹层
     * @param text 文本内容
     * @param time 显示时间
     * @param callback 回调函数
     */
    function showMsg(text, time, callback) {
        text = text || '信息有误！';
        time = time || 1500;
        msgP.html(text);
        msg.fadeIn();
        clearTimeout(timer);
        timer = setTimeout(function () {
            msg.fadeOut();
            callback && callback();
        }, time);
    }

    /**
     * 上传成功处理函数
     * @param fileObj 包含文件信息的对象
     * @param data 服务器返回数据
     */
    function onSuccess(fileObj, data) {
        // fileObj.imgurl = data.result;
        imgsArray.push(fileObj.fileName);
        // addBlock(fileObj);
        $.post(url,{fileName:fileObj.imgurl,type:fileObj.type},function(data){
            if (window.imgurl == '') {
                window.imgurl = data.result ;
            } else {
                window.imgurl = data.result + ',' + window.imgurl;
            }
            
            if (data.result) {
                fileObj.imgurl = data.result;
                imgsArray.push(fileObj.fileName);
                //addBlock(fileObj);
            } else {
                onFailure(fileObj);
            }
            //console.log(data);
        })
    }


    uploadInt.on('change',function (e) {
        var files = e.target.files || e.dataTransfer.files;
        files = filter(files);
        var trueCount = maxLength - imgsArray.length - files.length;
        // 判断是否超过最大上传数量
        if (trueCount < 0) {
            files = files.slice(0, maxLength - imgsArray.length);
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
                                    fileId: file.name.split('.')[0].replace(/[ |(|)]/g,''),
                                    type: file.type
                                };
                                // upload(fileObj);
                                onSuccess(fileObj);
                            };
                            img.src = ImageCompresser.getFileObjectURL(file);
                        }
                    };
                    reader.readAsBinaryString(file);
                } else {
                    reader.onload = function (e) {
                        uploadBase64 = e.target.result;
                        // TODO 上传图片到服务器
                        // self.prepareUpload(file, uploadBase64);
                        fileObj = {
                            imgurl: uploadBase64,
                            fileName: file.name,
                            fileId: file.name.split('.')[0].replace(/[ |(|)]/g,''),
                            type: file.type
                        };
                        // upload(fileObj);
                        onSuccess(fileObj);
                    };
                    reader.readAsDataURL(file);
                }
            }
        });
    });

    /**
     * 图片删除
     */
    // uploadImgBox.on('click','.btn_cancle',function () {
    //     // TODO 发送ajax请求
    //     deleteBlock(this.fileMsg);
    // });
});