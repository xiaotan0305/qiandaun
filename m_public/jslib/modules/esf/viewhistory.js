/*
 * 24行添加了housetype的缓存  by赵天亮 更改于2016/10/18
 */
define('modules/esf/viewhistory',['jquery'], function (require,exports,module) {
    'use strict';
    var $ = require('jquery');
    // 获取数据集合
    var vars = seajs.data.vars;
    module.exports = {
        // 添加"我的搜房"中租房详情页浏览历史
        record: function (houseid) {
            var storageType = 'esf_view_History';
            var viewHistory = '';
            viewHistory += 'id~' + houseid + ';';
            viewHistory += 'url~' + location.href + ';';
            viewHistory += 'img~' + vars.storageimg + ';';
            viewHistory += 'title~' + vars.title + ';';
            viewHistory += 'price~' + vars.price + ';';
            viewHistory += 'room~' + vars.room + ';';
            viewHistory += 'area~' + vars.area + ';';
            viewHistory += 'xiaoqu~' + vars.xiaoqu + ';';
            viewHistory += 'district~' + vars.district_name + ';';
            viewHistory += 'comarea~' + vars.comarea_name + ';';
            viewHistory += 'housetype~' + vars.housetype + ';';
			viewHistory += 'cityname~' + vars.cityname + ';';
            var strpurpose = vars.purpose;
            if (strpurpose === '别墅') {
                strpurpose = '住宅';
            }
            viewHistory += 'purpose~' + strpurpose;
            var allViewHistory = window.localStorage.getItem(storageType) == null ? '' : window.localStorage.getItem(storageType);
            if (allViewHistory === '') {
                window.localStorage.setItem(storageType, viewHistory);
            } else {
                var viewHistoryList = allViewHistory.split('|');
                var esfViewHistory = '';
                var size = 50;
                var len = viewHistoryList.length >= size ? size : viewHistoryList.length;
                for (var k = 0; k < len; k++) {
                    var temp = viewHistoryList[k];
                    if (viewHistoryList[k] !== '') {
                        var hisid = getparam(temp, 'id');
                        if (hisid !== houseid) {
                            esfViewHistory += viewHistoryList[k] + '|';
                        }
                    }
                }
                var esfViewHistory1 = viewHistory + (esfViewHistory === '' ? '' : '|')
                    + (esfViewHistory === '' ? '' : esfViewHistory.substring(0, esfViewHistory.length - 1));
                window.localStorage.setItem(storageType, esfViewHistory1);
            }
        }
    };
    function getparam(str, name) {
        var paraString = str.split(';');
        var paraObj = {};
        for (var i = 0, j; j = paraString[i]; i++) {
            paraObj[j.substring(0, j.indexOf('~')).toLowerCase()] = j.substring(j.indexOf('~') + 1, j.length);
        }
        return paraObj[name];
    }

});


