/*
 * 16行更改了tags的获取位置  by赵天亮 更改于2016/10/18
 */
define('modules/zhishi/viewhistory', ['jquery'], function (require, exports, module) {
    'use strict';
    var $ = require('jquery');
    module.exports = {
        // 添加"我的搜房"中知识详情页浏览历史
        record: function (newsid) {
            var storageType = 'zhishi_view_History';
            var viewHistory = '';
            viewHistory += 'id~' + newsid + ';';
            viewHistory += 'url~' + location.href + ';';
            viewHistory += 'img~' + $('#storageimg').html() + ';';
            viewHistory += 'title~' + ($('#title').html() === null ? '' : $('#title').html()) + ';';
            viewHistory += 'tags~' + ($('.otherTag').attr('datevalue')? $('.otherTag').attr('datevalue'): '') + ';' ;
            var strpurpose = $('#purpose').html() === null ? '' : $('#purpose').html();
            if (strpurpose === '别墅') {
                strpurpose = '住宅';
            }
            viewHistory += 'purpose~' + strpurpose;
            var allViewHistory = window.localStorage.getItem(storageType) === null ? '' : window.localStorage.getItem(storageType);
            if (allViewHistory === '') {
                window.localStorage.setItem(storageType, viewHistory);
            } else {
                var viewHistoryList = allViewHistory.split('|');
                var zhishiViewHistory = '';
                var size = 50;
                var len = viewHistoryList.length >= size ? size : viewHistoryList.length;
                for (var k = 0; k < len; k++) {
                    var temp = viewHistoryList[k];
                    if (viewHistoryList[k] !== '') {
                        var hisid = getparam(temp, 'id');
                        if (hisid !== newsid) {
                            zhishiViewHistory += viewHistoryList[k] + '|';
                        }
                    }
                }
                var zhishi_view_History = viewHistory + (zhishiViewHistory === '' ? '' : '|')
                    + (zhishiViewHistory === '' ? '' : zhishiViewHistory.substring(0, zhishiViewHistory.length - 1));
                window.localStorage.setItem(storageType, zhishi_view_History);
            }
        }
    };
    function getparam(str, name) {
        var paraString = str.split(';');
        var paraObj = {};
        for (var i = 0; paraString[i]; i++) {
            var j = paraString[i];
            paraObj[j.substring(0, j.indexOf('~')).toLowerCase()] = j.substring(j.indexOf('~') + 1, j.length);
        }
        return paraObj[name];
    }
});
