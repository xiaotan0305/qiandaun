/**
 * 置业顾问成交记录列表页
 */
define('modules/xf/tejiafangList', ['jquery'], function (require) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;
    var k = true;
    var w = $(window);
    // 总条数
    var allCount = vars.allCount;
    // 总页数
    var pageCount =  Math.ceil(allCount/10);
    // 当前页码
    var pageindex = 2;
    var loading = true;
    var city = vars.city,
        paramnewcode = vars.paramnewcode,
		$listUl = $('.xf-tjf-list ul'),
        $load = $('.moreList').eq(1),
        $loading = $('.moreList').eq(0);

    // 初始化时判断是否显示加载更多按钮
    if (allCount > 10) {
        $load.show();
    }

    // 加载更多的方法
    function loadMore () {
        console.log('jiazaigengduo');
        if (pageindex <= pageCount && loading) {
            loading = false;
            $load.hide();
            $loading.show();
            $.get('/xf.d?m=getTejiafangList&city=' + city + '&newcode=' + paramnewcode + '&pageindex=' + pageindex, function (data) {
                if (data) {
                    $listUl.append(data);
                    pageindex++;
                    $loading.hide();
                    loading = true;
                    if (pageindex <= pageCount) {
                        $load.show();
                    }
                }
            })
        }
    }

    // 点击加载更多按钮
    $('.moreList').eq(1).on('click', function () {
        loadMore();
    });

    // 滚动到页面底部时，自动加载更多
    var scrollFlag = false;
    window.addEventListener('scroll',scrollHandler,100);

    function scrollHandler() {
        var scrollh = $(document).height();
        var bua = navigator.userAgent.toLowerCase();
        if (scrollFlag) {
            if (bua.indexOf('iphone') !== -1 || bua.indexOf('ios') !== -1) {
                scrollh -= 140;
            } else {
                scrollh -= 80;
            }
        }
        if (k && $(document).scrollTop() + w.height() >= scrollh) {
            loadMore();
        }
    }
});
