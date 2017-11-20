define('modules/bbs/topic',['jquery', 'loadMore/1.0.0/loadMore', 'photoswipe/4.0.7/photoswipe',
    'photoswipe/4.0.7/photoswipe-ui-default.min','lazyload/1.9.1/lazyload'],function (require,exports,module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var win = window;
        var $floatAlert = $('#floatAlert');
        // toast提示窗
        var $section = $('.sf-bbs-detail');
        require('photoswipe/4.0.7/photoswipe-ui-default.min');
        require('photoswipe/4.0.7/photoswipe');
        // 惰性加载
        require('lazyload/1.9.1/lazyload');
        $('.lazyload').lazyload();
        // 检查登陆状态
        function checkLogin() {
            var $flag = false;
            if (vars.userName) {
                $flag = true;
            }
            return $flag;
        }
        function floatHide() {
            $floatAlert.hide();
        }
        // 点赞
        $section.on('click', '.support', function () {
            var loginUrl = vars.bbsSite + '?c=bbs&a=topic&city=' + vars.city + '&topicId=' + vars.topicId;
            var loginBurl = vars.loginUrl + '?burl=' + encodeURIComponent(loginUrl);
            // 未登陆则跳转至登陆页面
            if (checkLogin() === false) {
                window.location.href = loginBurl;
                return ;
            }
            var url = vars.bbsSite + '?c=bbs&a=ajaxAddArticleSupport&city=' + vars.city;
            var $this = $(this);
            $.get(url, {articleId: $this.parent().attr('data-articleId')}, function (data) {
                if (data.Content === 'success') {
                    if ($this.html() === '赞') {
                        $this.html(1);
                    } else {
                        $this.html(parseInt($this.html()) + 1);
                    }
                } else if (data.Content === 'noLogin' || data.Message === '必要参数缺失') {
                    window.location.href = loginBurl;
                } else {
                    $floatAlert.show();
                    $('#floatAlert').find('p').html(data.Message);
                    setTimeout(floatHide, 2000);
                }
            });
        });
        // 评论
        $section.on('click', '.reply3', function () {
            var $parent = $(this).parent();
            var url = vars.bbsSite + '?c=bbs&a=topicComment&city=' + vars.city + '&articleId=' + $parent.attr('data-articleId')
                + '&toUserBaseInfoId=' + $parent.attr('data-toUserBaseInfoID') + '&topicId=' + vars.topicId;
            // 未登陆则跳转至登陆页面
            if (checkLogin() === false) {
                window.location.href = vars.loginUrl + '?burl=' + encodeURIComponent(url);
                return ;
            }
            window.location.href = url;
        });

        // 查看更多评论
        var $page = 1;
        var $ajaxMoreComment = false;
        function dataReturn(data) {
            return data;
        }
        $section.on('click', '.hf-more', function () {
            if ($ajaxMoreComment) return;
            $ajaxMoreComment = true;
            var $this = $(this);
            var $count = $this.attr('data-count');
            var url = vars.bbsSite + '?c=bbs&a=ajaxGetCommentListByArticleId&city=' + vars.city + '&articleId=' + $this.attr('data-articleId');
            $.get(url, {currentPage: $page}, function (data) {
                $this.prev().append(dataReturn(data));
                $page++;
                var totalPage = Math.ceil(parseInt($count) / 10);
                if ($page > totalPage) {
                    $this.hide();
                    $page = 1;
                } else {
                    $this.find('.fblue').html('还有' + ($count - 10) + '条评论...');
                }
                $ajaxMoreComment = false;
            });
        });

        // 回复
        $section.on('click', '.bbsreply', function () {
            var $this = $(this);
            var $that = $this.parent().parent();
            var url = vars.bbsSite + '?c=bbs&a=topicComment&city=' + vars.city + '&articleId=' + $that.attr('data-articleId') + '&toUserBaseInfoId='
                + $this.attr('data-toUserBaseInfoID') + '&commentInfoId=' + $this.attr('data-commentInfoId') + '&topicId=' + vars.topicId
                + '&fromUserName=' + encodeURIComponent($this.attr('data-fromUserName'));
            // 未登陆则跳转至登陆页面
            if (checkLogin() === false) {
                window.location.href = vars.loginUrl + '?burl=' + encodeURIComponent(url);
                return ;
            }
            window.location.href = url;
        });

        // 发起话题贴
        $('#post').on('click', function () {
            var url = vars.bbsSite + '?c=bbs&a=topicPost&city=' + vars.city + '&topicId=' + vars.topicId;
            if (checkLogin() === false) {
                window.location.href = vars.loginUrl + '?burl=' + encodeURIComponent(url);
                return ;
            }
            window.location.href = url;
        });

        // 加载更多
        var loadMore = require('loadMore/1.0.0/loadMore');
        loadMore({
            url: vars.bbsSite + '?c=bbs&a=getMoreTopic&city=' + vars.city + '&userName=' + vars.userName + '&topicId=' + vars.topicId + '&page=' + 2,
            total: vars.rowsCount,
            pagesize: 10,
            pageNumber: 10,
            moreBtnID: '.more-list',
            loadPromptID: '.more-list',
            isScroll: false,
            contentID: '.mb10',
            loadAgoTxt: '加载更多',
            loadingTxt: '加载中...',
            loadedTxt: '加载更多'
        });

        // 点击帖子内容图片，图片放大功能
        $section.on('click', '.img-box', function () {
            var url = $(this).attr('original');
            var slides = [];
            var index = 0;
            var allImg = $section.find('.img-box');
            // 点击缩放大图浏览
            if (allImg.length > 0) {
                var pswpElement = $('.pswp')[0];
                for (var i = 0, len = allImg.length; i < len; i++) {
                    var ele = allImg[i],
                        src = $(ele).attr('original');
                    if (src === url) {
                        index = i;
                    }
                    slides.push({src: src, w: ele.naturalWidth, h: ele.naturalHeight});
                }
                var options = {
                    history: false,
                    focus: false,
                    index: index,
                    escKey: true
                };
                var gallery = new win.PhotoSwipe(pswpElement, win.PhotoSwipeUI_Default, slides, options);
                gallery.init();
            }
        });
    };
});
