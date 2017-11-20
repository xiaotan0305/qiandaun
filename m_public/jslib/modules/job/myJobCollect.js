/**
 * Created by yangchuanlong on 2017/7/4.
 */
define('modules/job/myJobCollect', ['jquery', 'loadMore/1.0.2/loadMore'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        // 文档jquery对象索引
        var $doc = $(document);
        // 页面传入的数据
        var vars = seajs.data.vars;
		// 收藏按钮
		var collect= $('#collect');
		// 消息按钮
		var num = $('#num');
		// 消息数
		var count = num.html();
		
		//点击收藏按钮收藏或取消收藏
		collect.off().on('click', 'li>span', function () {
            var $that = $(this);
            var CollectPositionID = $that.attr('collectpos');
			$.get(vars.jobSite + '?c=job&a=ajaxCancelCollectPos&CollectPositionID='+ CollectPositionID, function (data) {
				if (data) {
                    $that.parent().hide();
                    count--
                    num.html(count);
				} else {
                    floatshow('取消失败，请重试');
                }
			});

		});

        /**
         * 显示浮层
         */
        //弹层显示框
        var floatalert = $('#floatAlert');
        function floatshow(message) {
            floatalert.show();
            $('#floatCenter').html(message);
            $('#sure').click(function () {
                floatalert.hide();
            })
        }
		
		// 加载更多
        var loadMore = require('loadMore/1.0.2/loadMore');
		loadMore({
            url: vars.jobSite + '?c=job&a=ajaxGetMyJobCollect',
            total: vars.totalCount,
            pagesize: 6,
            pageNumber: 6,
            moreBtnID: '.moreList',
            loadPromptID: '.a_more',
            contentID: '#collect',
            loadAgoTxt: '<a href="javascript:void(0);" class="bt">加载更多...</a>',
            loadingTxt: '<a href="javascript:void(0);" class="bt">努力加载中...</a>',
            loadedTxt: '<a href="javascript:void(0);" class="bt">加载更多...</a>',
            loadedMsg: '<a href="javascript:void(0);" class="bt">没有更多了...</a>',
            firstDragFlag: false
        });
    }
});