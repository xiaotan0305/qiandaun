/**
 * Created by Young on 15-4-20.
 * Modifided by LXM on 15-9-19.
 */
define('modules/jiaju/zxjsq', ['jquery'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var localStorage = vars.localStorage;
        // 是小数的话保留2位小数，不是的话返回整数
        function dealFloat(s) {
            if (parseInt(s, 10) === s) {
                // 是个整数，返回原值
                return s;
            }
            return s.toFixed(2);
        }

        // 获取装修计算器首页的预算总价
        function getMoney(storageType) {
            var temp = 0;
            var lsArr = JSON.parse(localStorage.getItem(storageType)) || [];
            for (var i = lsArr.length - 1; i >= 0; i--) {
                temp += +lsArr[i].tmoney || 0;
            }
            return temp;
        }

        // 把缓存写入接口
        function saveData(storageType) {
            var lsArr = JSON.parse(localStorage.getItem(storageType)) || [];
            var len = lsArr.length;
            // 请求成功序号
            var sucArr = [];
            var compLen = 0;
            function ajaxComplete(i, isSuccess) {
                // 请求完成数
                return function (data) {
                    if (isSuccess && data.result.issuccess === '1') {
                        sucArr.push(i);
                    }
                    compLen++;
                    // 所有请求执行完，删除ls中上传成功的记录
                    if (compLen === len) {
                        sucArr.sort();
                        for (var j = sucArr.length; j >= 0; j--) {
                            lsArr.splice(j, 1);
                        }
                        if (lsArr.length) {
                            localStorage.setItem(storageType, JSON.stringify(lsArr));
                        } else {
                            localStorage.removeItem(storageType);
                        }
                    }
                };
            }
            for (var i = 0; i < len; i++) {
                var details = lsArr[i];
                var ajaxURL = vars.jiajuSite + '?c=jiaju&a=jsqSub&r=' + Math.random();
                var jsondata = {
                    type: details.type,
                    num: details.num,
                    tmoney: details.tmoney,
                    soufunid: vars.soufunid,
                    soufunname: vars.soufunname,
                    mobile: vars.mobile,
                    time: details.time,
                    index: i + 1
                };
                $.ajax({
                    url: ajaxURL,
                    data: jsondata,
                    success: ajaxComplete(i, 1),
                    error: ajaxComplete(i, 0)
                });
            }
        }
        $(function () {
            var totalmoney = getMoney('jiaju_jsq_qz') + getMoney('jiaju_jsq_dz') + getMoney('jiaju_jsq_db') + getMoney('jiaju_jsq_bz') + getMoney('jiaju_jsq_tl') + getMoney('jiaju_jsq_cl');
            // 缓存中有数据,并且有登录信息，就写入数据，然后删除缓存
            if (totalmoney > 0 && vars.soufunid !== '') {
                saveData('jiaju_jsq_qz');
                saveData('jiaju_jsq_dz');
                saveData('jiaju_jsq_db');
                saveData('jiaju_jsq_bz');
                saveData('jiaju_jsq_tl');
                saveData('jiaju_jsq_cl');
            }
            // 没有登录，总价直接读取缓存总价
            if (vars.soufunid === '' && totalmoney > 0) {
                $('#yszj').html(dealFloat(totalmoney) + '元');
            } else {
                var temp1 = dealFloat(Number(vars.totalmoney) + totalmoney);
                $('#yszj').html(temp1 + '元');
            }
        });
        // 搜索用户行为收集20160114
        var page = 'mjjcalculatorchoose';
        require.async('jsub/_vb.js?c=' + page);
        require.async('jsub/_ubm.js', function () {
            _ub.city = vars.cityname;
            _ub.biz = 'h';
            _ub.location = 0;
            var b = 0;
            var p = {
                'vmg.page': page
            };
            _ub.collect(b, p);
        });
    };
});