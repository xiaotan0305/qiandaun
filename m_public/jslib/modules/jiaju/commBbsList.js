define('modules/jiaju/commBbslist', ['jquery','loadMore/1.0.0/loadMore', 'lazyload/1.9.1/lazyload'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        // 惰性加载
        require('lazyload/1.9.1/lazyload');
        $('.lazyload').lazyload();
        // 加载更多
        var loadMore = require('loadMore/1.0.0/loadMore');
        var l = loadMore({
            // 接口地址
            url: vars.jiajuSite + '?c=jiaju&a=ajaxCommList&soufunid='+ vars.objid,
            // 数据总条数
            total: vars.total,
            // 首屏显示数据条数
            pagesize: 20,
            // 单页加载条数，可不设置
            pageNumber: 20,
            // 加载更多按钮id
            moreBtnID: '#clickmore',
            // 加载数据过程显示提示id
            loadPromptID: '#moreContent',
            // 数据加载过来的html字符串容器
            contentID: '#productlist',
            loadAgoTxt: '上拉加载更多',
            loadingTxt: '加载中...',
            loadedTxt: '上拉加载更多',
            no_lazyload: 1,
            callback:function(){
                if($('#productlist>section').length >= this.total){
                    $('#bottBox').show();
                }
            }
        });

        var isAjaxing = 0;
        // 点赞
        $('.xqIntroBox a').on('click', function () {
            if (isAjaxing) {
                return false;
            }
            isAjaxing = 1;
            var $this = $(this);
            $.get(vars.publicSite + '?c=public&a=ajaxUserInfo', function (info) {
                if (!info.userid) {
                    window.location = location.protocol + '//m.fang.com/passport/login.aspx?burl=' + encodeURIComponent(window.location.href);
                    return;
                } else {
                    // 获取未点过的值
                    var praiseNum = +$this.data('num');
                    var isPraise = $this.data('praise');
                    praiseNum += isPraise ? -1 : 1;
                    var ajaxUrl = vars.jiajuSite + '?c=jiaju&a=addPrise&type=8&r=' + Math.random();
                    $.get(ajaxUrl, {
                        objid: $this.attr('data-id'),
                        isPraise: isPraise
                    }, function () {
                        isAjaxing = 0;
                        $this.data('praise', +!isPraise).data('num', praiseNum).find('i').text('+1').end().toggleClass('cur').find('span').text(praiseNum);
                    });
                }
            });
        });
        // 页面未找到，点击刷新
        $('#reload').on('click', function () {
            location.reload();
        });
    };
});