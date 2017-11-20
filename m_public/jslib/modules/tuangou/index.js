/**
 * @file merge js files,ESLint
 * @author zcf(zhangcongfeng@fang.com)
 */
define('modules/tuangou/index', ['jquery','modules/tuangou/timer','modules/tuangou/ad', 'loadMore/1.0.0/loadMore'],function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var endtime = require('modules/tuangou/timer');
        var adswipe = require('modules/tuangou/ad');
        var preload = [];
        $('input[type=hidden]').each(function (index, element) {
            vars[$(this).attr('data-id')] = element.value;
        });
        preload.push('lazyload/1.9.1/lazyload');
        preload.push('footprint/1.0.0/footprint');
        //preload.push('modules/tuangou/loadmore');
        require.async(preload);
        require.async('lazyload/1.9.1/lazyload', function () {
            $('img[data-original]').lazyload();
        });

        // m站首页足迹
        require.async('footprint/1.0.0/footprint', function (run) {
            run.push('打折优惠',vars.tuangouSite + vars.city + '.htm', vars.city);
        });

        /* require.async('modules/tuangou/loadmore', function (run) {
            run({a: 'tuangou', url: vars.tuangouSite + '?c=tuangou&a=ajaxGetList&city=' + vars.city});
        }); */
        var loadMore = require('loadMore/1.0.0/loadMore');
        var pageUrl = vars.tuangouSite + '?c=tuangou&a=ajaxGetList&city=' + vars.city;
        loadMore({
            total: vars.total,
            pagesize: vars.pagesize,
            firstDragFlag: false,
            pageNumber: 6,
            moreBtnID: '#drag',
            loadPromptID: '#drag',
            contentID: '#ajaxList',
            loadAgoTxt: '<div class="draginner fblu" style="font-size:16px" align="center"><a>查看更多</a></div>',
            loadingTxt: '<div class="draginner fblu" style="font-size:16px;padding-left:10px;background:url(' + vars.public + '201511/images/load.gif) 0 50% no-repeat" align="center"><a>正在加载请稍后</a></div>',
            loadedTxt: '<div class="draginner fblu" style="font-size:16px" align="center"><a>查看更多</a></div>',
            url: pageUrl
        });
        endtime();
        for (var i = 0; i <= vars.count; i++) {
            $('#adimg').load(adswipe());
        }
        function chatxf(city, housetype, houseid, newcode, type, phone, channel, uname, agentid, zhname, agentImg, username, projname, flag) {
            localStorage.setItem(String('x:' + username), encodeURIComponent(zhname) + ';' + agentImg + ';' + encodeURIComponent(projname + '的'));
            if (flag === '1') {
                localStorage.setItem('fromflag', 'kuanginfo');
            }else if (flag === '2') {
                localStorage.setItem('fromflag', 'paiinfo');
            } else {
                localStorage.setItem('fromflag', 'tuaninfo');
            }
            $.ajax({url: '/data.d?m=houseinfotj&city=' + city + '&housetype=' + housetype + '&houseid=' + houseid
            + '&newcode=' + newcode + '&type=' + type + '&phone=' + phone + '&channel=' + channel + '&agentid=' + agentid, async: false});
            setTimeout(function () {
                window.location = '/chat.d?m=chat&username=x:' + uname + '&city=' + city + '&type=wapxf';
            }, 500);
        }
        $('#ajaxList').on('click', 'a.onlinetalk_btn', function () {
            var arr = $(this).data('id').split(',');
            if (arr.length === 7) {
                chatxf(vars.city, 'xf', arr[0], '', 'chat', '4008900000,' + arr[1], 'waptuanlist', arr[2], arr[3], arr[4], arr[5], '', arr[6], '0');
            } else {
                chatxf(vars.city, 'xf', arr[0], '', 'chat', arr[1] + arr[2], 'waptuanlist', arr[3], arr[4], arr[5], arr[6], arr[3], arr[8], arr[9]);
            }
            // 用户行为
            yhxw($(this).attr('data-projectid'),$(this).attr('data-agentid'));
        });

        $(document).ready(function () {
            var newcode = '';
            $('.newcode').each(function () {
                newcode = newcode + $(this).attr('id') + ',';
            });
            if (newcode !== '') {
                newcode = newcode.substring(0, newcode.length - 1);
            }
        });


        // 统计行为 --------------start
        require.async('jsub/_vb.js?c=mnhgroupbuy');
        require.async('jsub/_ubm.js?v=201407181100', function () {
            _ub.city = vars.cityname;
            // 业务---WAP端
            _ub.biz = 'n';
            // 方位（南北方) ，北方为0，南方为1
            var ns = vars.ns === 'n' ? 0 : 1;
            _ub.location = ns;
            // 用户动作（浏览0、搜索1、打电话31、即时通讯24、预约25）
            var b = 0;
            var pTemp = {
                'vmg.page': 'mnhgroupbuy'
            };
            // 用户行为(格式：'字段编号':'值')
            var p = {};
            // 若pTemp中属性为空或者无效，则不传入p中
            for (var temp in pTemp) {
                if (pTemp[temp] && pTemp[temp].length > 0) {
                    p[temp] = pTemp[temp];
                }
            }
            // 收集方法
            _ub.collect(b, p);
        });
        // 查看户型
        function yhxw(projectid,agentid) {
            // 收集方法
            _ub.collect(24, {
                'vmn.projectid': projectid,
                'vmn.consultantid': agentid,
                'vmg.page': 'mnhgroupbuy'
            });
        }
    };
});