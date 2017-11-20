/**
 * Created by lina on 2017/4/19.
 * 已经点评过的小区
 */
define('modules/esfhd/xqCommentAlready',function(require){
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;
    function mBtnShow(){
        // 更多里多余3行显示更多按钮
        $('.a-more').each(function(){
            var $ele = $(this);
            if($ele.prev().height() > 45){
                console.log($ele.prev().height());
                $ele.prev().addClass('max3');
                $ele.css('display','block');
            }
        });
        $('.up-passed').each(function(){
            var $ele = $(this);
            if($ele.height() > 75){
                $ele.css('max-height','85px');
                $ele.siblings('.more-img').css('display','block');
            }
        })
    }
    mBtnShow();
    require.async('loadMore/1.0.0/loadMore', function (loadMore) {
        loadMore({
            url: vars.esfSite + '?c=esfhd&a=ajaxgetxqComAlready',
            total: vars.total,
            pagesize: vars.pageSize,
            pageNumber: vars.pageNum,
            contentID: '#content',
            moreBtnID: '#drag',
            loadPromptID: '',
            isScroll:false,
            callback:function(){
                mBtnShow();
            }
        });

    });
    var $content = $('#content');
    // 点击评论里的更多
    $content.on('click','.a-more',function(){
        var $ele = $(this);
        var $prev = $ele.prev();
        if($ele.hasClass('a-more')){
            if($prev.hasClass('max3')){
                $prev.removeClass('max3');
                $ele.addClass('up');
            }else{
                $prev.addClass('max3');
                $ele.removeClass('up');
            }
        }
    });
    // 点击图片里的更多
    $content.on('click','.more-img',function(){
        var $ele = $(this);
        var $prev = $ele.prev();
        if($prev.css('max-height') === '85px'){
                $prev.css('max-height','100%');
                $ele.addClass('up');
            }else{
                $prev.css('max-height','85px');
                $ele.removeClass('up');
            }
    })
});
