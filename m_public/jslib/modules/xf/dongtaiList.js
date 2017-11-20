define('modules/xf/dongtaiList',['jquery','util/util'], function (require) {
    'use strict';
    var $ = require('jquery');
    // 查看历史记录按钮   默认展示1条  第一次按展示5条   第二次按全部展示
    var $moredt = $('.moredt');
    // 默认标识
    var flag = 0;
    // 前5条数据
    var $fivedt = $('.dongtai:lt(5)');
    // 全部数据
    var $dongtaiList = $('.dongtai');

    $moredt.click(function () {
        if (flag === 0) {
            $('.dt-int2').show();
            $fivedt.show();
            flag = 1;
        }else if (flag === 1) {
            $dongtaiList.show();
            $moredt.hide();
        }
    });

    // 布码
    setTimeout(function () {
        $('#wapdsy_D05_04').attr('id', 'wapxfdt_B07_05');
    }, 1000);
    var yibuma = false;
    $(document).on('scroll', function () {
        if ($('#wapesfsy_D04_01').length && !yibuma) {
            $('#wapesfsy_D04_01').attr('id', 'wapxfdt_B06_01');
            yibuma = true;
        }
    });

    require.async('//clickm.fang.com/click/new/clickm.js', function () {
        Clickstat.eventAdd(window, 'load', function (e) {
            Clickstat.batchEvent('wapxfdt_','');
        })
    });

    // 点击图片变大
    var imgData = [],
        wid = 600,
        hei = 400;
    $('.clearfix img').each(function () {
        var $this = $(this);
        imgData.push(
            {
                src: $this.attr('src'),
                w: wid,
                h: hei
            }
        )
    });
    $('.clearfix img').on('click', function () {
        var index = $(this).parent().index();
        require.async(['photoswipe/4.0.8/photoswipe3.min', 'photoswipe/4.0.8/photoswipe-ui-default3.min'], function (PhotoSwipe, PhotoSwipeUI) {
            var pswpElement = document.querySelectorAll('.pswp')[0];
            var options = {
                history: false,
                focus: false,
                index: index,
                showAnimationDuration: 0,
                hideAnimationDuration: 0,
                fullscreenEl: !1,
                shareEl: !1,
                tapToClose: !0
            };
            var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI, imgData, options);
            gallery.init();
        });
    });
});