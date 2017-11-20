/**
 * 添加了cityname的缓存  by李建林 更改于2017/2/7
 */
define('modules/zf/viewhistory', ['jquery'], function (require, exports, module) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;
    module.exports = {
        // 添加"我的搜房"中租房详情页浏览历史
        record: function (houseid) {
            var storageType = 'zf_view_History';
            var viewHistory = '';
            viewHistory += 'id~' + houseid + ';';
            viewHistory += 'url~' + location.href + ';';
            viewHistory += 'img~' + $('#storageimg').html() + ';';
            viewHistory += 'title~' + ($('#title').html() === null ? '' : $('#title').html()) + ';';
            viewHistory += 'price~' + ($('#price').html() === null ? '' : $('#price').html()) + ';';
            viewHistory += 'room~' + ($('#room').html() === null ? '' : $('#room').html()) + ';';
            viewHistory += 'addr~' + ($('#addr').html() === null ? '' : $('#addr').html()) + ';';
            viewHistory += 'area~' + ($('#area').html() === null ? '' : $('#area').html()) + ';';
            viewHistory += 'xiaoqu~' + ($('#xiaoqu').html() === null ? '' : $('#xiaoqu').html()) + ';';
            viewHistory += 'district~' + ($('#district').html() === null ? '' : $('#district').html()) + ';';
            viewHistory += 'comarea~' + ($('#comarea').html() === null ? '' : $('#comarea').html()) + ';';
            viewHistory += 'cityname~' + vars.cityname + ';';
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
                var zfViewHistory = '';
                var size = 50;
                var len = viewHistoryList.length >= size ? size : viewHistoryList.length;
                for (var k = 0; k < len; k++) {
                    var temp = viewHistoryList[k];
                    if (viewHistoryList[k] !== '') {
                        var hisid = getparam(temp, 'id');
                        if (hisid !== houseid) {
                            zfViewHistory += viewHistoryList[k] + '|';
                        }
                    }
                }
                var zf_view_History = viewHistory + (zfViewHistory === '' ? '' : '|')
                    + (zfViewHistory === '' ? '' : zfViewHistory.substring(0, zfViewHistory.length - 1));
                window.localStorage.setItem(storageType, zf_view_History);
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


