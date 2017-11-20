/**
 * @author lipengkun@fang.com  APP小区点评抽奖活动相关功能
 */
define('modules/esfhd/xqdownload', ['jquery', 'floatAlert/1.0.0/floatAlert',],  function (require,exports,module) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;
    var floatAlert = require('floatAlert/1.0.0/floatAlert');
    var option = {type: '2'};//弹框插件样式选项
    var floatObj = new floatAlert(option);
    floatObj.showMsg('请打开房天下app参加活动');
    require.async('app/1.0.0/appdownload', function ($) {
        //$('#alertBtn').click(function(){
        //    alert(123);
        //})
        $('#alertBtn').openApp({position:'xqDphd'});
    });

});