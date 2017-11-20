/**
 * Created by lina on 2017/4/14.
 * 经纪人上传图片点评列表页
 */
define('modules/esfhd/xqCommentList',function(require){
    'use strict';
   var $ = require('jquery'),
       $more = $('.xq-more');
    $more.on('click',function(){
        $('ul').find('li').each(function(){
            var $this = $(this);
            if($this.is(':hidden')){
                $this.show();
            }
        });

        $more.hide();
    })
});