define('modules/kanfangtuan/kanDetail', ['jquery', 'modules/kanfangtuan/yhxw', 'iscroll/2.0.0/iscroll-lite'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var vars = seajs.data.vars;
        var $ = require('jquery');
        var iscrollLite = require('iscroll/2.0.0/iscroll-lite');

        // 弹框遮罩
        var $float = $('.float').eq(0);
        // 线路咨询
        var $xlzx = $('.float-kft').find('a').eq(0);
        var $opTab = $('.opTab');
        // 楼盘选择
        var $lpxz = $opTab.eq(0);
        // 置业顾问
        var $zygw = $opTab.eq(1);
        // 唯一楼盘
        var isOnlyOpt = +$lpxz.find('ul').data('only');

        // 引入用户行为分析对象-埋码
        var yhxw = require('modules/kanfangtuan/yhxw');
        // 判断详情页种类，传入用户行为统计对象
        var pageId = 'mnhkftpage';
        // 埋码变量数组
        var maiMaParams = {
            // 页面标识
            'vmg.page': pageId,
            // 看房团路线名称
            'vmn.seehouseline': encodeURIComponent(vars.seeHouseLine),
            // 楼盘id
            'vmn.projectid': '',
            // 置业顾问id
            'vmn.consultantid': ''
        };
        // 添加用户行为分析
        yhxw({type: 0, pageId: pageId, params: maiMaParams});

        function preventDefault(e) {
            e.preventDefault();
        }

        // 禁用/启用touchmove
        function toggleTouchmove(unable) {
            document[unable ? 'addEventListener' : 'removeEventListener']('touchmove', preventDefault);
        }

        // 点击聊天种localstorage
        $('.main').on('click', '.mes', function () {
            // 楼盘id
            maiMaParams['vmn.projectid'] = $(this).parents('.user-box').eq(0).attr('data-projectId');
            // 置业顾问id
            maiMaParams['vmn.consultantid'] = $(this).parents('.user-box').eq(0).attr('data-consultantId');
            // 添加用户行为分析-埋码
            yhxw({type: 24, pageId: pageId, params: maiMaParams});
            var dataKey = $(this).attr('data-key');
            var dataValue = $(this).attr('data-value');
            localStorage.setItem(dataKey, dataValue);
        });
        // 置业顾问打电话埋码
        $('.main').on('click', '.call', function () {
            // 楼盘id
            maiMaParams['vmn.projectid'] = $(this).parents('.user-box').eq(0).attr('data-projectId');
            // 置业顾问id
            maiMaParams['vmn.consultantid'] = $(this).parents('.user-box').eq(0).attr('data-consultantId');
            // 添加用户行为分析-埋码
            yhxw({type: 31, pageId: pageId, params: maiMaParams});
        });
    };
});