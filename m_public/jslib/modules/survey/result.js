/**
 * @file 迁移答题页答案格式验证及提交
 * @author 赵天亮(zhaotianliang@fang.com)
 *         李建林(lijianlin@fang.com)
 * Created by lijianlin on 2016/6/29.
 */
define('modules/survey/result', ['jquery', 'weixin/2.0.0/weixinshare'], function (require) {
    'use strict';
    var vars = seajs.data.vars;
    var wx = require('weixin/2.0.0/weixinshare');

    // 结果页五分钟刷新一次
    if (vars.delayFlag === 'true') {
        setInterval(function () {
            window.location.reload();
        }, 300000);
    }

    // 微信分享，自定义标题、描述及图片
    var strTitle = '——房天下调查',
        title = $('.main h2').html(),
        strDescription = '海量样本用户，专业调研报告，房天下调查给你提供全面房地产市场分析。',
        description = $('meta[name="description"]').length ? $('meta[name="description"]')[0].content : '',
        imgUrl = location.protocol + vars.public + '201511/images/default-question.jpg';
    new wx({
        debug: false,
        shareTitle: title + strTitle,
        descContent: description || strDescription,
        lineLink: location.href,
        imgUrl: imgUrl
    });
});