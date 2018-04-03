/**
 * Created by hanxiao on 2018/1/17.
 */
define('modules/zhuanti/wechatgroup', ['jquery', 'loadMore/1.0.2/loadMore', 'lazyload/1.9.1/lazyload'], function(require, exports, module){
    'use strict';
    module.exports = function () {
        // jquery库
        var $ = require('jquery');
        // 页面传入的参数
        var vars = seajs.data.vars;

        //图片惰性加载
        require('lazyload/1.9.1/lazyload');
        $('.lazyload').lazyload();

        var area = vars.area;
        var type = vars.type;
        var keyword = vars.keyword;

        // 上拉加载更多
        var url = vars.zhuantiSite + '?c=zhuanti&a=ajaxGetMoreWechatGroup&area=' + area + '&type=' + type + '&keyword=' + keyword;
        var loadMore = require('loadMore/1.0.2/loadMore');
        loadMore({
            url: url,
            total: vars.totalcount,
            pagesize: 10,
            pageNumber: 10,
            moreBtnID: '#loadMore',
            loadPromptID: '.most_jz',
            contentID: '.group_list',
            loadAgoTxt: '加载更多',
            loadingTxt: '加载中',
            loadedTxt: '',
            loadedShow: '#nomore',
            firstDragFlag: false
        });

        // 筛选功能开始
        var dataBox = $('#dataBox');
        var areaBox = $('#areaBox');
        var typeBox = $('#typeBox');
        // 确定按钮
        var sureBtn = $('.sureBtn');
        // 显示地区筛选项
        $('#areaBtn').on('click', function(){
            dataBox.hide();
            typeBox.hide();
            areaBox.show();
        });
        // 显示兴趣筛选项
        $('#typeBtn').on('click', function(){
            dataBox.hide();
            areaBox.hide();
            typeBox.show();
        });

        // 地区筛选项点击事件
        areaBox.find('li').on('click', function(){
            var that= $(this);
            that.siblings().find('i').removeClass('on');
            that.find('i').addClass('on');
            sureBtn.attr('data-value', that.find('span').text());
        });

        // 兴趣类型选项点击事件
        typeBox.find('li').on('click', function(){
            var that= $(this);
            that.siblings().find('i').removeClass('on');
            that.find('i').addClass('on');
            sureBtn.attr('data-value', that.find('span').text());
        });

        // 确定选项-跳转
        sureBtn.on('click', function(){
            if ($(this).attr('data-type') === 'area') {
                var url = vars.zhuantiSite + '?c=zhuanti&a=wechatGroup&area=' + $(this).attr('data-value');
            } else if ($(this).attr('data-type') === 'type') {
                var url = vars.zhuantiSite + '?c=zhuanti&a=wechatGroup&area=non&type=' + $(this).attr('data-value');
            }
            window.location.href = url;
        });

        // 搜索功能
        $('#searchShowBtn').on('click', function(){
            $('.page').hide();
            $('.search_page').show();
        });

        // 取消搜索
        $('.cancel').on('click', function(){
            $('.search_page').hide();
            $('.page').show();
        });

        // 点击搜索，进行搜索
        $('.searchSure').on('click', function(){
            var key = $('#keyword').val();
            if (!key || key === '请输入搜索关键词') {
                return false;
            }
            var url = vars.zhuantiSite + '?c=zhuanti&a=wechatGroup&area=non&keyword=' + key;
            window.location.href = url;
        });

        // 点击进群按钮弹出二维码
        $('.main').on('click', '.group_data', function(){
            var that = $(this).find('.group_go');
            $('#codeId').text(that.attr('data-id'));
            $('#codeImg').attr('src',that.attr('data-cimg'));
            $('#codeName').text(that.attr('data-name'));
            $('#codeTitle').text(that.attr('data-name'));
            $('.qrcode_page').show();
        });
        //管理二维码弹层
        $('.navclose').click(function(){
            $('.qrcode_page').hide();
        });
    };
})