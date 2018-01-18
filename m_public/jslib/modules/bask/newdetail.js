/**
 * Created by hanxiao on 2017/12/5.
 */
define('modules/bask/newdetail', ['jquery', 'loadMore/1.0.2/loadMore', 'lazyload/1.9.1/lazyload'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        require('lazyload/1.9.1/lazyload');
        $('.lazyload').lazyload();
        var zan = $('.askzan');
        zan.on('click', function () {
            var $this = $(this);
            var dataId = $this.attr('data-answerid');
            // 获取回答用户的id
            var answerUserId = $this.attr('data-auserid');
            var zanc = $this.attr('data-ding');
            // 不能对自己的回答进行点赞或点踩
            if (answerUserId === vars.userid) {
                return false;
            } else {
                var url = vars.askSite +  '?c=ask&a=ajaxZan&userid=' + vars.userid + '&answerid='+ dataId + '&askid=' + vars.id + '&answer_user_id';
                $.get(url, function (dataCopy) {
                    if (dataCopy) {
                        if (dataCopy.Code === '100') {
                            var str = $this.html().replace(/<\/i>(.*)/, '</i>' + (dataCopy.Ding));
                            $this.html(str);
                            $this.find('i').html(dataCopy.ErrMsg);
                            if (dataCopy.ErrMsg === '点赞成功') {
                                $this.addClass('cur');
                            } else if (dataCopy.ErrMsg === '取消点赞成功'){
                                $this.removeClass('cur');
                            }
                        } else if (dataCopy.Code === '106') {
                            $this.find('i').html('您已经赞过');
                            $this.addClass('cur');
                        }
                    }
                });
            }
        });

        // 上拉加载更多
        var url = vars.askSite + '?c=bask&a=ajaxGetMoreAnswers&id=' + vars.id;
        var loadMore = require('loadMore/1.0.2/loadMore');
        loadMore({
            url: url,
            total: vars.totalCount,
            pagesize: 20,
            pageNumber: 20,
            moreBtnID: '.loadingask',
            loadPromptID: '.loadingask',
            contentID: '#qlist',
            loadAgoTxt: '加载更多',
            loadingTxt: '<i></i>加载中',
            loadedTxt: '',
            loadedShow: '#noMore',
            firstDragFlag: false
        });
    };
});