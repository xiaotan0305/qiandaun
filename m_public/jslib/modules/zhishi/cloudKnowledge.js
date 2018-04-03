/**
 * Created by hanxiao on 2018/2/28.
 */
define('modules/zhishi/cloudKnowledge', ['jquery', 'iscroll/2.0.0/iscroll-lite'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var scrollCtrl = require('iscroll/2.0.0/iscroll-lite');
        /*热门分类滑动效果*/
        var hotClassUlList = $('#tagsList');
        var hotClassNum = hotClassUlList.find('li').length + 1;
        if (hotClassNum > 0) {
            hotClassUlList.css('width',hotClassNum * 80 + 'px');
            new scrollCtrl('#tagsDiv',{
                scrollX:true,
                scrollY:false,
                eventPassthrough: true,
                preventDefault: false
            });
        }
    };
});