/**
 * Created by lmy on 2016/11/8.
 * 邮箱 limengyang.bj@fang.com
 */
define('modules/mycenter/kanFangHisList', ['jquery', 'lazyload/1.9.1/lazyload', 'modules/mycenter/yhxw'], function (require) {
    'use strict';
    var $ = require('jquery');
    // 引入用户行为分析对象-埋码
    var yhxw = require('modules/mycenter/yhxw');
    // 判断详情页种类，传入用户行为统计对象
    var pageId = 'mucvisitrecord';
    var maimai = '';
    $('.listShow').each(function () {
        var datamaima = $(this).attr('data-maima') || '';
        maimai += encodeURIComponent(datamaima) + ',';
    });
    // 埋码变量数组
    var maiMaParams = {
        'vmg.page': pageId,
        'vmg.visitinfo': maimai.replace(/%5E/g, '^')
    };
    yhxw({type: 0, pageId: pageId, params: maiMaParams});
    require('lazyload/1.9.1/lazyload');
    // 图片惰性加载
    $('.lazyload').lazyload();

    // 打电话
    $('.telphone').on('click', function () {
        var $that = $(this);
        maiMaParams['vmg.agentid'] = $that.attr('data-agentid');
        maiMaParams['vmg.visitinfo'] = encodeURIComponent($that.parents('.listShow').attr('data-maima')).replace(/%5E/g, '^');
        yhxw({type: 31, pageId: pageId, params: maiMaParams});
    });

});
