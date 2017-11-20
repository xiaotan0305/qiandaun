/**
 * Created by loupeiye on 2017/3/10.
 */
define('modules/esfhd/xqPicPerfectAD',function(require,exports,module){
    'use strict';
    module.exports = function () {
        var $ = require('jquery');

        //点击“我要上传图片”，出现弹框
        var alertTips = $('#alertTips');
        alertTips.on('click', function () {
            sendFloatId.show();
        });

        //点击弹框“好”，关闭弹框
        var sendFloatId = $('#alertBox');
        var alertBtn = $('#alert-btn');
        alertBtn.off('click').on('click', function () {
            sendFloatId.hide();
        });
    };
});