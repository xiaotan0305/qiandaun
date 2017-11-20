/**
 * 项目动态
 * 20160224  by WeiRF
 */
define('modules/xf/dongtailistNew', ['jquery', 'modules/xf/showPhoto'], function (require) {
    'use strict';
    var $ = require('jquery');
    var $overboxIn = $('.overboxIn');
    var $zygwDtlist = $('#zygwDtlist');
    $overboxIn.on('click', 'a', function () {
        $overboxIn.find('a').removeClass('active');
        $(this).addClass('active');
        var name = $(this).attr('data-name');
        if (name && name !== 'all') {
            $zygwDtlist.find('li').hide();
            $zygwDtlist.find('li[data-name=' + name + ']').show();
        } else {
            $zygwDtlist.find('li').show();
        }
    });

    //var photo = '<div class="pswp" tabindex="-1" role="dialog" aria-hidden="true"> <div class="pswp__bg"></div> <div class="pswp__scroll-wrap"> <div class="pswp__container"> <div class="pswp__item"></div> <div class="pswp__item"></div> <div class="pswp__item"></div> </div> <div class="pswp__ui pswp__ui--hidden"> <div class="pswp__top-bar"> <div class="pswp__counter"></div> <button class="pswp__button pswp__button--close" title="Close (Esc)"></button> <div class="pswp__preloader"> <div class="pswp__preloader__icn"> <div class="pswp__preloader__cut"> <div class="pswp__preloader__donut"></div> </div> </div> </div> </div> <div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap"> <div class="pswp__share-tooltip"></div> </div> <button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)"> </button> <button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)"> </button> <div class="pswp__caption"> <div class="pswp__caption__center"></div> </div> </div> </div> </div>';
    //$('.main').prepend(photo);

    /* 小图变大图（2016年5月19日）*/
    var ShowPhoto = require('modules/xf/showPhoto');
    // 图片效果
    $('.mb8').on('click', '.clearfix dd', function () {
        var $images = $(this).parent().find('img');
        ShowPhoto.openPhotoSwipe($images, $(this).index());
        ShowPhoto.gallery.listen('afterChange', function (data) {
            //console.log(data);
        });
    });
});