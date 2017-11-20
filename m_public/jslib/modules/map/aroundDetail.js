/**
 * 周边配套页
 * 20160427 xiejingchao修改
 */
define('modules/map/aroundDetail', ['jquery', 'modules/map/yhxw'], function (require, exports, module) {
    'use strict';
    var $ = require('jquery');
    module.exports = function () {
        // 点击展开收起
        $('.btn-more').on('click', searchAll);
        function searchAll() {
            var $this = $(this);
            var hidenlist = $this.parent().siblings().children('li.hid');
            if ($this.hasClass('up')) {
                hidenlist.hide();
                $this.attr('class', 'btn-more');
            } else {
                hidenlist.show();
                $this.attr('class', 'btn-more up');
            }
        }
        
        // 引入用户行为分析对象-埋码
        var yhxw = require('modules/map/yhxw');
        // 判断详情页种类，传入用户行为统计对象
        var pageId = 'mnhpagearound';
        // 埋码变量数组
        var ubParams = {
            'vmg.page': pageId
        };
        // 添加用户行为分析-埋码
        yhxw({type: 0, pageId: pageId, params: ubParams});
    };
});

