define('modules/bbs/getInboxMessage',['jquery','util', 'loadMore/1.0.0/loadMore'],function (require,exports,module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        // var util = require('util');
		// 上拉加载更多
        var loadMore = require('loadMore/1.0.0/loadMore');
        loadMore({
            url:vars.bbsSite + '?c=bbs&a=ajaxGetInboxMessage&username=' +vars.username + '&city=' + vars.city,
            total:vars.totalCount,
            pagesize:20,
            pageNumber:20,
            moreBtnID:'#loadMore',
            loadPromptID:'#loadMore',
            contentID:'#bbsList',
            loadAgoTxt:'<img src="' + vars.imgUrl + 'images/loadingnew.gif">上拉加载更多',
            loadingTxt:'<img src="' + vars.imgUrl + 'images/loadingnew.gif">加载中...',
            firstDragFlag:false,
        });
        // 点击设置已读
        $('#bbsList').delegate('li', 'click', function () {
		    var aLink = $(this).find('a');
			var input = aLink.children('input');
            var isRead = input.first().val();
            var fromUser = input.last().val();
            var toUser = vars.ToUser;
            var url = aLink.attr('data_url');
            // 判断是否已读，未读信息再去发送ajax请求设置已读
            if (isRead === '0') {
                $.get(vars.bbsSite + '?c=bbs&a=ajaxSetMessage&r=' + Math.random() + '&city=' + vars.city,{username: toUser,touser: fromUser},function (data) {
                    // 判断是否成功
                    if (data !== '100') {
                        alert(data);
                    }
                });
            }
            window.location.href = url;
        });
    };
});