/**
 * fdc--研究院指数研究
 * @author lijianin@fang.com on 2016/8/17
 * @modify circle(yuanhuihui@fang.com) 2016年08月26日13:59:16
 */
define('modules/fdc/industryDetail', ['jquery', 'chart/line/1.0.5/line'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var Line = require('chart/line/1.0.5/line');
        var vars = seajs.data.vars;
        if (vars.type === 'indexResearch') {
            /**
             * 绘制图表
             * @param {object} data 图表数据
             */
            (function () {
                // ajax请求图表数据，成功后绘制图表
                $.ajax({
                    url: '?c=fdc&a=ajaxGetIndex&index=Bc',
                    success: function (data) {
                        if (data && data.length === 6) {
                            // drawCharts(res);
                            new Line({
                                id: bcline,
                                width: $('.main').width(),
                                height: 200,
                                data: [data],
                                lastDataImpt: true,
                                horizontalLineCount: 5,
                                isCurve: true
                            });

                        }
                    }
                });
                $.ajax({
                    url: '?c=fdc&a=ajaxGetIndex&index=Xf',
                    success: function (data) {
                        if (data[0] && data[0].length === 6) {
                            // drawCharts(res);
                            new Line({
                                id: xfline,
                                width: $('.main').width(),
                                height: 200,
                                data: [data[0]],
                                lastDataImpt: true,
                                horizontalLineCount: 5,
                                isCurve: true
                            });

                        }
                    }
                });
                $.ajax({
                    url: '?c=fdc&a=ajaxGetIndex&index=Esf',
                    success: function (data) {
                        if (data[0] && data[0].length === 6) {
                            // drawCharts(res);
                            new Line({
                                id: esfline,
                                width: $('.main').width(),
                                height: 200,
                                data: [data[0]],
                                lastDataImpt: true,
                                horizontalLineCount: 5,
                                isCurve: true
                            });

                        }
                    }
                });

            })();
        } else if (vars.type === 'institutions') {
            var induslist = $('.induslist');
            induslist.find('li').on('click', function () {
                $(this).addClass('active');
                $(this).siblings().removeClass('active');
            });
        }
    };
});
