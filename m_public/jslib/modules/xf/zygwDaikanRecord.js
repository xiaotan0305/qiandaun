/**
 * 置业顾问带看记录列表页
 */
define('modules/xf/zygwDaikanRecord', ['jquery'], function (require) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;

    var $zygwTable = $('.zygw-table'),
        $load = $('.moreList').eq(1),
        $loading = $('.moreList').eq(0);

    // 参数值
    var totalcount = vars.totalcount,
        pageCount = vars.pageCount,
        zygwid = vars.zygwid,
        pageindex = 2,
        loading = true;

    if (totalcount > 20) {
        $load.show();
    }

    // 加载更多的方法
    function loadMore () {
        if (pageindex <= pageCount && loading) {
            loading = false;
            $load.hide();
            $loading.show();
            $.get('/shopinfo.d?m=zygwDaikanRecordAjax&pageindex=' + pageindex + '&zygwid=' + zygwid, function (data) {
                if (data) {
                    $zygwTable.append(data);
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

    // 滑动到底加载更多
    $(document).on('touchmove', function () {
        var srollPos = $(document).scrollTop();
        if (srollPos >= $(document).height() - $(window).height()) {
            loadMore();
        }
    });
});
