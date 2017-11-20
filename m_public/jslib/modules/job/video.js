define('modules/job/video',['jquery'],function (require, exports, module) {
    'use strict';
    module.exports  = function(){
        var $ = require("jquery");
        var flag = true;
        var video = $('#videoBox');
        var videoBtn = $('#playVideo');
        video.on('click',function(){
            if (flag) {
                videoBtn.hide();
                video[0].play();
                flag = false;
            } else {
                videoBtn.show();
                video[0].pause();
                flag = true;
            }
        });
        videoBtn.on('click', function(){
            $(this).hide();
            video[0].play();
            flag = false;
        });
    };
    
});