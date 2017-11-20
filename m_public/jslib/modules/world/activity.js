/**
 * @file 海外活动
 * @author fcwang(wangfengchao@fang.com)
 */
define('modules/world/activity', ['jquery', 'modules/world/yhxw'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        // var vars = seajs.data.vars;
        var $ = require('jquery');
        var i = 0;

        // 引入用户行为分析对象-埋码
        var yhxw = require('modules/world/yhxw');
        // 判断详情页种类，传入用户行为统计对象
        var pageId = 'mwactivitylist';
        // 埋码变量数组
        var maiMaParams = {
            // 页面标识
            'vmg.page': pageId
        };
        // 添加用户行为分析
        yhxw({type: 0, pageId: pageId, params: maiMaParams});

        if ('undefined' !== typeof activity) {
            var count = activity.count;
            var activityProject;

            // 加载一条
            var loadMore = function () {
                if (i < count) {
                    activityProject = activity.Project[i];
                    $('.activities').find('ul').append('<li><a href=' + activityProject.URL + '><div class=\'img\'><img src=' + activityProject.MainPic
                        + '></div><div class=\'txt\'><h3>' + activityProject.ProjectName + '</h3><p><span class=\'dz\'>' + activityProject.ProjectAddress
                        + '</span>' + activityProject.ProjectTime + '</p><p><span class=\'btn-bm\'>我要报名</span></p></div></a></li>');
                    i++;
                    console.log(i);
                }
            };

            // 上滑事件
            $(document).on('scroll', function () {
                if (i < count) {
                    // 到达底部时
                    if ($(document).scrollTop() === $(document).height() - $(window).height()) {
                        console.log('正在加载');
                        $('#drag').show();
                        setTimeout(function () {
                            loadMore();
                            loadMore();
                            loadMore();
                            console.log('加载完成');
                            $('#drag').hide();
                        }, 500);
                    }
                }
            });
        }
    };
});
