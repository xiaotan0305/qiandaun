/**
 * 大首页入口类
 * by blue
 * 20150906 blue 整理整个js代码及增加注释、去除一些垃圾代码、优化多处冗长代码
 * 20150921 blue 首页推荐服务板块推广到11个电商城需求，即优惠专区的滑动显示功能推到11个电商城市，将查房价搜索替换为最新的模块化搜索功能
 * 20151027 blue 大首页UI改版，修改为1.0.1版本的走势图，并增加在走势图下面滑动查看房价走势的功能，删除查房价搜索
 * 20151116 blue 根据返回跳转的频道修改跳转到那个栏目地图
 * 20151123 blue 删除requestAnimationframe.js的引入
 * 20151201 blue 大首页需求，大城市房产知识、房产资讯、房产问答显示3条数据，小城市显示5条
 * 20160112 blue 大首页滑动楼盘操作增加滑动时再加载视窗中的图片功能，部分代码优化，对猜你喜欢、房产资讯等有换一换功能的列表实行惰性加载，并且在换一换后按需加载
 * 20160513 tkp 大数据改版 猜你喜欢\地图入口\导航知识图标入口 大数据分析 重新做了
 */
define('modules/index/showSearch', ['jquery', 'util/util', 'search/mainSearch', 'search/home/homeSearch'], function(require) {
    'use strict';
    // jquery库
    var $ = require('jquery');
    // 大首页搜索类
    var Search = require('search/home/homeSearch');
    // 通用工具集
    var Util = require('util/util');
    var vars = seajs.data.vars;

    // 大首页大搜索执行初始化
    var search = new Search();
    search.init();

    $('[name="q"]').on('click', function() {
        $('[name="q"]').focus();
    });
    setTimeout(function() {
        $('[name="q"]').click();
    }, 400);

    var $window = $(window);
    require.async('jsub/_vb.js?c=mhomepage');
    require.async('jsub/_ubm.js', function() {
        _ub.city = vars.zhcity;
        _ub.request('vmg.business', true);
        // 用户分析函数
        _ub.onload = function() {
            seajs.emit('cacheData');
        };
    });
});
