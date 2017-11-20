/**
 * 二手房详情页主类
 * by blue
 * 20150929 blue 代码重构，优化效率，删除没用的代码，将点击搜索按钮功能修改为重构后的搜索
 * 201501219 刘新路 ui改版
 */
define('modules/xiaoqu/im', ['jquery', 'chart/line/1.0.2/line', 'modules/esf/yhxw', 'lazyload/1.9.1/lazyload', 'superShare/1.0.1/superShare', 'weixin/2.0.0/weixinshare','chart/pie/1.0.0/pie'],
    function (require, exports, module) {
    'use strict';
    module.exports = function () {
        // jquery库
        var $ = require('jquery');
		 var vars = seajs.data.vars,
   $leaveMsgBtn = $('.btn-cj');
     $leaveMsgBtn.on('click', function () {
          
        });
		 /**
         * 委托房源点击咨询
         * @param zhcity
         * @param city
         * @param housetype
         * @param houseid
         * @param newcode
         * @param type
         * @param phone
         * @param channel
         * @param uname
         * @param aname
         * @param agentid
         * @param order
         * @param photourl
         * @param housefrom
         */
        function chatWeituo(zhcity, city, housetype, houseid, newcode, type, phone, channel, uname, aname, agentid, order, photourl, housefrom) {
            var xiaoqu = vars.xiaoqu || '';
            var room = vars.room || '';
            var price = vars.price || '';
            var url = '/data.d?m=houseinfotj&city=' + city + '&housetype='
                + housetype + '&houseid=' + $.trim(houseid) + '&newcode=' + $.trim(newcode)
                + '&type=' + type + '&phone=' + $.trim(phone) + '&channel=' + $.trim(channel) + '&agentid='
                + $.trim(agentid) + '&order=' + order + '&housefrom=';
            if ('A' === vars.housetype || 'D' === vars.housetype) {
                if (vars.localStorage) {
                    vars.localStorage.setItem(uname, encodeURIComponent(aname) + ';' + photourl
                        + ';' + encodeURIComponent(xiaoqu + '的' + room + '价格为' + price + '的电商'));
                }
            } else if (vars.localStorage) {
                vars.localStorage.setItem(uname, encodeURIComponent(aname) + ';' + photourl
                    + ';' + encodeURIComponent(xiaoqu + '的' + room + '价格为' + price + '的委托')
                    + ';' + vars.mainSite + 'agent/' + vars.city + '/' + vars.agentid + '.html');
            }

            if (vars.localStorage) {
                vars.localStorage.setItem(uname + '_allInfo', encodeURIComponent(vars.title) + ';'
                    + encodeURIComponent(vars.price + '万元') + ';' + encodeURIComponent(vars.tags.replace(/(\s*$)/g, ''))
                    + ';' + vars.titleimg + ';' + encodeURIComponent(vars.room_hall_area) + ';'
                    + encodeURIComponent(vars.district_name + '-' + vars.projname) + ';https:' + vars.esfSite + vars.city + '/'
                    + housefrom + '_' + vars.houseid + '.html');
            }
            if (vars.hasOwnProperty('from') && vars.from.length > 0) {
                url += vars.from + '&product=soufun';
            } else {
                url += housefrom;
            }
            $.ajax(url);
            var paramPurpose = '';
            if ($.trim(vars.purpose) === '写字楼') {
                paramPurpose = 'xzl';
            } else if ($.trim(vars.purpose) === '商铺') {
                paramPurpose = 'sp';
            }
            setTimeout(function () {
                window.location = '/chat.d?m=chat&username=' + uname + '&city=' + city
                    + '&type=wapesf&houseid=' + houseid + '&purpose=' + paramPurpose + '&housetype='
                    + vars.housetype;
            }, 500);
            yhxw({type: 24, pageId: 'mesfpage'});
        }
    };
});