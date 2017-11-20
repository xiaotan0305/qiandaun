/**
 * @file 帮你找房详情页
 * @author fcwang(wangfengchao@soufun.com)
 */
define('modules/mycenter/findFangDetail', ['jquery', 'modules/mycenter/yhxw'], function (require) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;
    var url = vars.mySite;
    var change = $('#change');
    var listBox = $('#listBox');
    var backgf4 = $('.backgf4');

    // 引入用户行为分析对象-埋码
    var yhxw = require('modules/mycenter/yhxw');
    // 判断详情页种类，传入用户行为统计对象
    var pageId = 'mucmybuyhousepage';
    // 埋码变量数组
    var maiMaParams = {
        // 页面标识
        'vmg.page': pageId,
        // 我的找房信息
        'vmg.findfanginfo': ''
    };
    //我的找房信息
    maiMaParams['vmg.findfanginfo'] = encodeURIComponent(vars.maiType) + '^' + encodeURIComponent(vars.district) + '^' + encodeURIComponent(vars.comarea) + '^' + encodeURIComponent(vars.maiPrice)+'^' + encodeURIComponent(vars.maiRoom);
    // 添加用户行为分析
    yhxw({type: 0, pageId: pageId, params: maiMaParams});

    $(function () {
        var type = vars.type;
        var price = vars.price;
        var comarea = vars.comarea;
        var district = vars.district;
        var room = vars.room;
        var page = 1;
        var jsondata;
        var postData = function () {
            jsondata = {
                type: type,
                price: price,
                comarea: comarea,
                district: district,
                room: room,
                page: page
            };
            $.get(url + '?c=mycenter&a=ajaxGetRecommend', jsondata, function (data) {
                change.find('span').hide();
                $('#listBox ul, .default').remove();
                if (data.res === 'succ') {
                    listBox.append(data.list);
                } else if (page != 1) {
                    location.reload();
                } else {
                    listBox.append('<div class=\'default\'>暂未找到符合您的意向的房源</div>');
                    change.hide();
                }
            });
        };
        postData();
        change.find('i').hide();
        change.find('span').removeClass('span');
        change.on('click', function () {
            page++;
            $(this).find('i').show();
            $(this).find('span').show();
            postData();
        });

        // 点击聊天种localstorage
        backgf4.on('click', '.chat', function () {
            var dataKey = $(this).attr('data-key');
            var dataValue = $(this).attr('data-value');
            localStorage.setItem(dataKey,dataValue);
        });
    });
});
