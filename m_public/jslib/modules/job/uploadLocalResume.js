/**
 * Created by hanxiao on 2017/08/04.
 */
define('modules/job/uploadLocalResume', ['jquery', 'imageUpload/1.0.0/fileUpload_job'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        // 文档jquery对象索引
        var $doc = $(document);
        // 页面传入的数据
        var vars = seajs.data.vars;
        var $floatMsg = $('#floatAlert');
        var FileUpload = require('imageUpload/1.0.0/fileUpload_job');
        var fileUpload = new FileUpload({
            url :  vars.jobSite + '?c=job&a=ajaxUploadResume',
            uploadBtn : '#uploadFile',
            onSuccess: function (file, result, url) {
                var result = JSON.parse(result);
                if (result.errCode === '0') {
                    $('#upSpan').text(result.filename);
                    showMsg('上传成功');
                } else {
                    showMsg(result.errMsg);
                }
            },
        });
        function showMsg(str, time) {
            time = time || 2000;
            $floatMsg.text(str);
            $floatMsg.show();
            setTimeout(function(){
                $floatMsg.hide();
            }, time);
        }
        // 点击完成跳转到编辑简历页面
        $('#go').on('click', function() {
            window.location = vars.jobSite + '?c=job&a=editResume';
        });
    }
});