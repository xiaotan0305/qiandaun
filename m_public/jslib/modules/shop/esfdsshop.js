define('modules/shop/esfdsshop', ['jquery', 'loadMore/1.0.0/loadMore'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        // jquery库
        var $ = require('jquery');
        require.async('lazyload/1.9.1/lazyload', function () {
            $('.lazyload').lazyload();
        });
        // 页面传入的参数
        var vars = seajs.data.vars;
        var $zixun = $('#zxzx'), $floatAlert = $('.floatAlert'), $leaveMsgBtn = $('.mes');
        $zixun.on('click', function () {
            $floatAlert.show();
            unable();
        });
        $floatAlert.on('click', function () {
            $floatAlert.hide();
            enable();
        });
        $('.alert').on('click', function (e) {
            e.stopPropagation();
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
                    + encodeURIComponent(vars.district_name + '-' + vars.projname) + ';' + vars.esfSite + vars.city + '/'
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
                    + housetype;
            }, 500);
        }

        /**
         * 点击给我留言按钮操作
         */
        $leaveMsgBtn.on('click', function () {
            var data = $(this).attr('data-chat');
            var dataArr = data.split(',');
            if (vars.sfAgent) {
                dataArr[6] = vars.sfAgent[$.trim(dataArr[10])].replace('转', '-');
            }
            chatWeituo(dataArr[0], dataArr[1], dataArr[2], dataArr[3], dataArr[4], dataArr[5]
                , dataArr[6], dataArr[7], dataArr[8], dataArr[9], dataArr[10], dataArr[11], dataArr[12], dataArr[13]);
        });

        // 电话统计函数
        function teltj(city, channel, housetype, houseid, type, phone, housefrom, agentid) {
            $.ajax({
                url: vars.mainSite + 'data.d?m=houseinfotj&city=' + city + '&housetype=' + housetype + '&houseid='
                + houseid + '&type=' + type + '&phone=' + phone + '&channel=' + channel + '&agentid=' + agentid + '&housefrom=' + housefrom,
                async: true
            });
        }

        // 点击打电话完成电话统计
        $('.call').on('click', function () {
            var data = $(this).attr('data-teltj');
            var dataArr = data.split(',');
            teltj.apply('this', dataArr);
        });

        //门店介绍
        var $introduce = $('#introduce');
        if ($introduce.parent('.mBox').find('p').height() > parseInt($introduce.parent('.mBox').find('article').css('line-height')) * 3) {
            $introduce.show();
        }
        $introduce.on('click', function () {
            if ($introduce.parent('.mBox').find('article').css('max-height') === 'none') {
                $introduce.parent('.mBox').find('article').css('max-height', '92px');
                $introduce.find('a').removeClass('up');
            } else {
                $introduce.parent('.mBox').find('article').css('max-height', 'none');
                $introduce.find('a').addClass('up');
            }

        });

        /**
         *阻止浏览器默认事件
         * @param e 浏览器默认事件
         */
        function preventDefault(e) {
            e.preventDefault();
        }

        /**
         * 手指滑动时阻止浏览器默认事件(阻止页面滚动）
         */
        function unable() {
            document.addEventListener('touchmove', preventDefault);
        }

        /**
         * 手指滑动恢复浏览器默认事件（恢复滚动
         */
        function enable() {
            document.removeEventListener('touchmove', preventDefault);
        }

    };
});