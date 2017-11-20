/*
 * @file 个人中心评论举报页
 * @author icy
 */
define('modules/mycenter/getXfMyCommentList', ['jquery', 'modules/mycenter/yhxw', 'loadMore/1.0.1/loadMore', 'photoswipe/4.0.7/photoswipe',
    'photoswipe/4.0.7/photoswipe-ui-default.min', 'lazyload/1.9.1/lazyload'
], function (require) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;
    var loadMore = require('loadMore/1.0.1/loadMore');
    var lazyload = require('lazyload/1.9.1/lazyload');

    function showMore($container) {
        var $texts = $container.find('.comment-text');
        for (var i = 0, len = $texts.length; i < len; i++) {
            var $text = $texts.eq(i);
            var $p = $text.find('p');
            if ($text.height() < $p.height()) {
                $text.next().show();
            }
        }
    }
    var $houseComment = $('.houseComment');
    showMore($houseComment);
    // 首页加载更多
    // 总数量大于当前页面数量有加载更多
    if (vars.houseComTotal > 20) {
        // 楼盘房源评价加载更多
        loadMore.add({
            // 加载更多接口地址
            url: vars.mySite + '?c=mycenter&a=ajaxGetMycommentList&city=' + vars.city,
            // 每页加载数据条数，10默认
            perPageNum: 20,
            // 总数据条数
            total: vars.houseComTotal,
            // 当前页加载数据条数
            pagesize: 20,
            // 当前加载更多执行所需的元素实例
            activeEl: '#houseComment',
            // 根据当前加载更多所需元素实例是否存在该类名决定是否启动加载更多操作
            active: 'active',
            // 加载更多容器的类名或者id或者jquery对象
            content: '.houseComment ul',
            // 加载更多按钮的类名或者id或者jquery对象
            moreBtn: '.dragHouseCom',
            // 提示文案类名或id或者jquery对象
            loadPrompt: '.draginnerHouseCom',
            // 加载中显示文案,'正在加载请稍后'为默认
            loadingTxt: '<div class="moreList"><span><i></i>努力加载中...</span></div>',
            // 加载完成后显示内容,'加载更多'为默认
            loadedTxt: '<div class="moreList"><a class="bt">查看更多</a></div>',
            callback: showMore
        });
    }

    /*
     * ajax获取非首页页面信息
     */
    // 获取顾问经纪人评价信息
    var $guwenComment = $('.guwenComment');
    $.get(vars.mySite, {
        c: 'mycenter',
        a: 'ajaxGetGuwenMyCommentList',
        city: vars.city
    },function (data) {
        if (data) {
            $guwenComment.html(data);
            lazyload('.lazyload').lazyload();
        }
    });
    // 获取房源举报信息
    var $houseReport = $('.houseReport');
    $.get(vars.mySite, {
        c: 'mycenter',
        a: 'ajaxGetJuBaoList',
        city: vars.city
    }, function (data) {
        // 有list数据举报的标签内容替换
        if (data.list) {
            $houseReport.html(data.list);
        }
    });
   
    // 获取装修评价信息
    var $decorateComment = $('.decorateComment');
    $.ajax({
        url: vars.mySite,
        data: {
            c: 'mycenter',
            a: 'ajaxFirstJiaJuMyCommentList',
            city: vars.city,
            page: 1,
            pagesize: 20
        },
        success: function (data) {
            if (data.list) {
                // 装修标签内容替换
                $decorateComment.html(data.list);
                // 总数量大于当前页面数量有加载更多
                if (data.total > 20) {
                    // 装修加载更多
                    loadMore.add({
                        // 加载更多接口地址
                        url: vars.mySite + '?c=mycenter&a=ajaxGetJiaJuMyCommentList&city=' + vars.city,
                        // 每页加载数据条数，10默认
                        perPageNum: 20,
                        // 总数据条数
                        total: data.total,
                        // 当前页加载数据条数
                        pagesize: 20,
                        // 当前加载更多执行所需的元素实例
                        activeEl: '#jiajuComment',
                        // 根据当前加载更多所需元素实例是否存在该类名决定是否启动加载更多操作
                        active: 'active',
                        // 加载更多容器的类名或者id或者jquery对象
                        content: '.decorateComment ul',
                        // 加载更多按钮的类名或者id或者jquery对象
                        moreBtn: '.dragJiaJuCom',
                        // 提示文案类名或id或者jquery对象
                        loadPrompt: '.draginnerJiaJuCom',
                        // 加载中显示文案,'正在加载请稍后'为默认
                        loadingTxt: '<div class="moreList"><span><i></i>努力加载中...</span></div>',
                        // 加载完成后显示内容,'加载更多'为默认
                        loadedTxt: '<div class="moreList"><a class="bt">查看更多</a></div>'
                    });
                }
            }
            // 滚动加载方法
            loadMore.init();
        },
        error: function () {
            // 滚动加载方法
            loadMore.init();
        }
    });
    // 提示框，内容提示，2s后隐藏
    var showMsg = (function () {
        var time = null;
        var $prompt = $('#prompt');
        return function (msg) {
            if (time) {
                clearTimeout(time);
                $prompt.hide();
            }
            $prompt.text(msg).show();
            time = setTimeout(function () {
                $prompt.hide();
            }, 2000);
        };
    })();

    // 引入用户行为分析对象-埋码
    var yhxw = require('modules/mycenter/yhxw');
    // 判断详情页种类，传入用户行为统计对象
    var pageId = 'mucmycomment';
    var maimaParams = {};

    /*
     * 导航栏点击切换
     */
    // 顶部导航点击切换
    var $navFilter = $('#navFilter');
    var $contents = $('.content');
    $navFilter.on('click', 'li', function () {
        var $this = $(this);
        var index = $this.index();
        $this.addClass('cur').siblings('li').removeClass('cur');
        $contents.hide().eq(index).show();
        // 切换导航默认点击一次上次选中的二级导航，埋码使用
        $contents.eq(index).find('.subNavFilter a.active').trigger('click');
    });
    // 二级导航切换
    var $subNavFilter = $('.subNavFilter');
    // 惰性加载判断时用
    var $subNavFirstClick = 1;
    $subNavFilter.on('click', 'a', function () {
        var $this = $(this);
        var index = $this.index();
        $this.addClass('active').siblings('a').removeClass('active');
        $this.parents('.subNavFilter').eq(0).nextAll('section').hide().eq(index).show();
        // 第一次点击顾问经纪人评价列表时调用惰性加载
        if ($subNavFirstClick === 1 && $this.attr('id') === 'guwenComment') {
            lazyload('.lazyload').lazyload();
            $subNavFirstClick = 0;
        }
        // 埋码赋值
        maimaParams['vmg.showlocation'] = encodeURIComponent($this.find('span').text());
        yhxw({
            type: 0,
            pageId: pageId,
            params: maimaParams
        });
    });
    
    // 默认点击评价导航，埋码使用
    $navFilter.find('li').eq(0).trigger('click');

    /*
     * 楼房/房源section js
     */
    // 赞
    $houseComment.on('click', '.z', (function () {
        var inAjax = false;
        return function () {
            if (!inAjax) {
                inAjax = !inAjax;
                var $this = $(this);
                var tid = $this.data('tid');
                var newcode = $this.data('newcode');
                var type = $this.data('type');
                if ($this.hasClass('cur')) {
                    showMsg('亲，您已经点过了');
                    inAjax = !inAjax;
                } else {
                    $.ajax({
                        url: vars.mySite,
                        data: {
                            c: 'mycenter',
                            a: 'ajaxCommentUpvote',
                            tid: tid,
                            newcode: newcode,
                            type: type,
                        },
                        success: function (data) {
                            inAjax = !inAjax;
                            switch (data.code) {
                                case '100':
                                    $this.find('.upvote').addClass('cur');
                                    $this.addClass('cur');
                                    var $agreeNum = $this.find('span');
                                    var agreeNumVal = $agreeNum.text() === '赞' ? 0 : $agreeNum.text();
                                    $agreeNum.text(+agreeNumVal + 1);
                                    break;
                                case '103':
                                    showMsg('亲，您已经点过了');
                                    break;
                                default:
                                    showMsg('点赞失败');
                                    break;
                            }
                        },
                        error: function () {
                            inAjax = !inAjax;
                            showMsg('点赞失败');
                        }
                    });
                }
            }
        };
    })());
    // 点击展开收起评论
    $houseComment.on('click', '.t', (function () {
        var eleBak = null;
        var $commentBak = null;
        var inAjax = false;
        return function () {
            if (!inAjax) {
                inAjax = !inAjax;
                if (eleBak && eleBak !== this) {
                    $(eleBak).removeClass('cur');
                    $commentBak.hide();
                }
                var $this = $(this);
                var $comment = $this.parents('.comment-sum').eq(0).next();
                $comment.toggle();
                $this.toggleClass('cur');
                eleBak = $this[0];
                $commentBak = $comment;
                if (!$this.hasClass('ready')) {
                    $.get(vars.mySite, {
                        c: 'mycenter',
                        a: 'ajaxGetReplyList',
                        tid: $this.data('tid'),
                        city: $this.data('city')
                    }, function (data) {
                        $comment.append(data);
                        $this.addClass('ready');
                    }).always(function () {
                        inAjax = !inAjax;
                    });
                } else {
                    $comment.find('input').attr('placeholder', '').data('fid', '');
                    inAjax = !inAjax;
                }
            }
        };
    })());
    // 点击展开折叠
    $houseComment.on('click', '.comment-more', function () {
        var $this = $(this);
        $this.toggleClass('up');
        var $prev = $this.prev();
        if ($prev.hasClass('comment-text')) {
            $prev.css('max-height', $this.hasClass('up') ? 'none' : '69px');
        } else {
            $prev.find('.gt3').toggle();
        }
    });
    // 点击评论回复指定评论
    $houseComment.on('click', '.reply', function () {
        var $this = $(this);
        var username = $this.find('a').eq(0).text();
        var $comment = $this.parent().prev().find('input');
        $comment.attr('placeholder', '回复 ' + username).data('fid', $this.data('fid'));
        $comment.focus();
    });
    // 发送
    $houseComment.on('click', '.btn-comm', (function () {
        var inAjax = false;
        return function () {
            if (!inAjax) {
                inAjax = !inAjax;
                var $this = $(this);
                var $content = $this.prev();
                var content = $content.val();
                if (content) {
                    var fid = $content.data('fid');
                    var $t = $this.parents('li').eq(0).find('.t');
                    var newcode = $t.data('newcode');
                    var tid = $t.data('tid');
                    var city = $t.data('city');
                    var data = {
                        c: 'mycenter',
                        a: 'ajaxPublishReply',
                        tid: tid,
                        newcode: newcode,
                        content: content,
                        city: city
                    };
                    if (fid) {
                        data.fid = fid;
                    }
                    $.ajax({
                        url: vars.mySite,
                        data: data,
                        type: 'POST',
                        success: function (data) {
                            if (data.res === '1') {
                                $.get(vars.mySite, {
                                    c: 'mycenter',
                                    a: 'ajaxGetReplyList',
                                    tid: tid,
                                    city: city
                                }, function (data) {
                                    var $commentList = $this.parents('.comment-list-c').eq(0);
                                    $commentList.find('ul,.comment-more').remove();
                                    $commentList.append(data);
                                    var $replyNum = $t.find('.replyNum');
                                    $replyNum.text(+$replyNum.text() + 1);
                                    $content.val('');
                                }).always(function () {
                                    inAjax = !inAjax;
                                });
                            } else {
                                showMsg('发布失败');
                                inAjax = !inAjax;
                            }
                        },
                        error: function () {
                            inAjax = !inAjax;
                        }
                    });
                } else {
                    showMsg('请输入内容');
                    inAjax = !inAjax;
                }
            }
        };
    })());
    var pswp = document.querySelector('.pswp');
    // 大图展示
    $('.houseComment,.decorateComment').on('click', 'img', function () {
        var $this = $(this);
        var index = $this.parent().index();
        var $imgsContainer = $this.parents('.comment-img').eq(0);

        var slides = $imgsContainer.data('slides');
        if (slides) {
            slides = JSON.parse(slides);
        } else {
            slides = [];
            var $imgs = $imgsContainer.find('img');
            for (var i = 0, len = $imgs.length; i < len; i++) {
                var img = $imgs[i];
                slides.push({
                    src: img.src,
                    w: img.naturalWidth,
                    h: img.naturalHeight
                });
            }
            $imgsContainer.data('slides', JSON.stringify(slides));
        }
        var options = {
            history: false,
            focus: false,
            index: index,
            escKey: true
        };
        var gallery = new window.PhotoSwipe(pswp, window.PhotoSwipeUI_Default, slides, options);
        gallery.init();
    });
    // 软键盘遮挡
    var $window = $(window);
    $window.resize((function () {
        var height = $window.height();
        return function () {
            var heightNew = $window.height();
            var offset = $window.scrollTop() + height - heightNew;
            height = heightNew;
            // 安卓部分搜集地址栏收起展开触发resize造成抖动bug
            Math.abs(height - heightNew) > 50 && $window.scrollTop(offset);
        };
    })());
});