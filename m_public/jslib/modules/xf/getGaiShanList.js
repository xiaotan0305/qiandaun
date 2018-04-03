/**
 * wap动态页
 */
define('modules/xf/getGaiShanList', ['jquery', 'loadMore/1.0.1/loadMore', 'superShare/1.0.1/superShare', 'weixin/2.0.0/weixinshare','app/1.0.0/appdownload'], function (require) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;
    // 加载更多
    var loadMore = require('loadMore/1.0.1/loadMore');
    // 分享功能(新)
    var SuperShare = require('superShare/1.0.1/superShare');

    var host = window.location.host.indexOf('m.test.fang.com') > -1 ? 'static.test.soufunimg.com' : 'static.soufunimg.com';
    //var img = 'http://' + host + '/common_m/m_public/201511/images/wexinShare_womenDay.jpg';
	var img = vars.img
    var shareTile = vars.sharetitle;
    var desc = vars.desc;

    var config = {
        // 分享内容的title
        title: shareTile,
        // 分享时的图标
        image: img,
        // 分享内容的详细描述
        desc: desc,
        // 分享的链接地址
        url: location.href,
        // 分享的内容来源
        from: 'xf'
    };
    var superShare = new SuperShare(config);

    // 微信分享功能
    var wx = require('weixin/2.0.0/weixinshare');
    var weixin = new wx({
        shareTitle: shareTile,
        descContent: desc,
        imgUrl: img,
        lineLink: location.href
    });

    /*// 总数
    var kpTotal = vars.count > 0 ? vars.count : 1;
    loadMore.add({
        // 加载更多接口地址  tag是用来区分用户是否设置过标签,没有设置过要调用不同的接口
        url: '/xf.d?m=getWomenDayList&city=' + vars.city + '&res=json',
        // 每页加载数据条数
        perPageNum: 10,
        // 总数据条数
        total: kpTotal,
        // 当前页加载数据条数
        pagesize: 10,
        // 当前加载更多执行所需的元素实例
        activeEl: '.box',
        // 根据当前加载更多所需元素实例是否存在该类名决定是否启动加载更多操作
        active: 'dq-tit',
        // 加载更多容器的类名或者id或者jquery对象
        content: '.dq-flist',
        // 加载更多按钮的类名或者id或者jquery对象
        moreBtn: '#drag',
        // 提示文案类名或id或者jquery对象
        loadPrompt: '#loading',
        // 加载中显示文案,'正在加载请稍后'为默认
        loadingTxt: '<span><i></i>努力加载中...</span>',
        // 加载完成后显示内容,'加载更多'为默认
        loadedTxt: '<a href="javascript:void(0);" class="bt">查看更多</a>',
        firstDragFlag: true
    });
    loadMore.init();*/

    // 全国楼盘推app下载
    require.async('app/1.0.0/appdownload', function ($) {
        $('#topDownload').openApp();
    });


    var totalNum = vars.count;
    var indexNum = 20;
    var totalPage = Math.ceil(totalNum / indexNum);
    var nowPage = 0;
    var canLoad = true;
	var url=window.location.href;//当前请求的url  
	var arr=url.split("/");
	var city = arr[4];
	//var city = vars.city;
    if (nowPage >= totalPage - 1) {
        canLoad = false;
    }

    var loadMore = function () {
        if (nowPage < totalPage) {
            nowPage++;
            //$('.dq-more').hide();
            $('#drag').show();
            $.post('/xf.d?m=getGaiShanList&city=' + city + '&page=' + nowPage + '&res=json', function (data) {
                if (data) {
                    $('#xflist .dq-flist').append(data);
                    $('#drag').hide();
					
                    if (nowPage >= totalPage - 1) {
                        //$('.dq-more').hide();
                        canLoad = false;
                    }
                }
            })
        }
    };

    /*
     * 滚动到页面底部时，自动加载更多
     */
    function debounce(func, wait, immediate) {
        var timeout;
        return function () {
            var that = this, args = arguments;
            var later = function () {
                timeout = null;
                if (!immediate) {
                    func.apply(that, args);
                }
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) {
                func.apply(that, args);
            }
        };
    }

    // 用法
    var myEfficientFn = debounce(function () {
        // 所有繁重的操作
        if (!canLoad)return;
        var scrollh = $(document).height();
        var bua = navigator.userAgent.toLowerCase();
        if (bua.indexOf('iphone') !== -1 || bua.indexOf('ios') !== -1) {
            scrollh -= 140;
        } else {
            scrollh -= 80;
        }
        var w = $(window);
        if ($(document).scrollTop() + w.height() >= scrollh) {
            loadMore();
        }
    }, 250);

    window.addEventListener('scroll', myEfficientFn);

    // app下载
    require.async('app/1.0.0/appdownload', function ($) {
        $('.btn-down').openApp({
            position: 'xfinfoAI'
        });
    });
});
