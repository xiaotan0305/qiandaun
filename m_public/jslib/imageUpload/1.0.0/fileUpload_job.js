/**
 * Created by hanxiao on 2017/08/07.
 */
define('imageUpload/1.0.0/fileUpload_job', ['jquery'], function (require) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;

    function FileUpload(opts) {
        var that = this;
        that.options = {
            url : '',
			uploadBtn : '#uploadFile',
			onSuccess: function (file, result, url) {
            },
            onFailure: function (file) {
            },
        };
        $.extend(that.options, opts);
        that.init();
    }

    FileUpload.prototype = {
	
      upload: function (file, form) {
            var that = this;
            var url =  that.options.url + '&i='+that.getGUID();
            var xhr = new XMLHttpRequest();
            if (xhr.upload) {
                xhr.onreadystatechange = function () {
                    if (Number(xhr.readyState) === 4) {
                        if (Number(xhr.status) === 200) {
                            that.options.onSuccess(file, xhr.responseText,url);
                        } else {
                            that.options.onFailure(file, xhr.responseText);
                        }
                    }
                };
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
            var self = e.data.m;
            var form = document.forms["fileForm"];
            var file = form["file"].files[0];
            self.upload(file, form);
        },
        init: function () {
            var that = this;
            var $uploadInput = $(that.options.uploadBtn);
            $uploadInput.off('change').on('change', {m: this}, this.inputHandle);
        }
    };
    return FileUpload;
});
