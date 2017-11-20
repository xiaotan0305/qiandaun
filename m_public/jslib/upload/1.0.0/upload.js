/**
 * @file 视频上传插件，只能在页面中添加form表单
 * @author liuxinlu@fang.com
 */
!function (require) {
    'use strict';
    function upload(option) {
        if (option) {
            $.extend(true, this.option, option);
        }
        this.init();
    }

    upload.prototype = {
        fileFilter: [],
        option: {
            url: 'https://m.fang.com/videou/upload/video/?city=jjr.house',
            imgContainer: '#upload',
            imgUrl: '',
            onSuccess: function (file, result) {
            },
            onFailure: function (file) {
            },
            filter: function (files,type) {
            }
        },
        upload: function (file, form) {
            var vars = seajs.data.vars;
            if(vars.action !== 'publishAppend'){
                // 上传进度
                var progress = $('#progress'),
                // 视频上传按钮
                    uploadBtn = $('.add_vedio');
                uploadBtn.hide();
                progress.show();
                progress.find('.barLenth').width('0%');
                progress.find('.barPercent').text('0%');
            }
            var that = this;
            if(vars.action === 'publishAppend'){
                var url =  that.option.url;
            }else{
                var url =  that.option.url + '&i='+that.getGUID();
            }
            var xhr = new XMLHttpRequest();
            if (xhr.upload) {
                if(vars.action === 'publishAppend'){
                    xhr.upload.onloadstart = function(){
                        that.option.onProgress();
                    };

                }else{
                    xhr.upload.addEventListener('progress', function (event) {
                        var progress = Math.round(event.lengthComputable ? event.loaded * 100 / event.total : 0);
                        that.option.onProgress(progress);
                    }, false);
                }
                // 文件上传成功或是失败
                xhr.onreadystatechange = function () {
                    if (Number(xhr.readyState) === 4) {
                        if (Number(xhr.status) === 200) {
                            that.option.onSuccess(file, xhr.responseText,url);
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
                    url
                );

                try{
                    xhr.send(new FormData(form));
                }catch(e) {
                    console.error(e.message);
                }
            }
        },
        getGUID: function () {
            var i = 0;
            var result = "";
            var pattern = "0123456789abcdef";
            for (i = 0; i<24; i++) {
                result += pattern.charAt(Math.round(Math.random() * 15));
            }
            var time = new Date().getTime();
            result += ("00000000" + time.toString(16).toLocaleLowerCase()).substr(-8);
            return result;
        },
        inputHandle: function (e) {
            e.stopPropagation();
            var self = e.data.m;
            var form = document.forms["videoForm"];
            var file = form["file"].files[0];
            var files = self.option.filter(file);
            if (files) {
                self.upload(file, form);
            }
        },
        init: function () {
            var that = this;
            // 初始化图片数组
            that.video = '';
            var $uploadInput = $('body');
            $uploadInput.off('change').on('change', '#upload_video', {
                m: this
            }, this.inputHandle);
        }
    };
    window.upload = upload;
}();