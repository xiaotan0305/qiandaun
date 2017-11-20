/**
 * 问答详情页主类
 * by blue
 * 20150916 blue 整理代码，去除冗长代码，提高代码效率，删除单独为本页面写入的点击搜索按钮搜索操作
 */
define('modules/bask/detail', ['jquery', 'util', 'swipe/3.10/swiper', 'lazyload/1.9.1/lazyload', 'modules/ask/yhxw',
    'loadMore/1.0.0/loadMore'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        // jquery库
        var $ = require('jquery');
        // 获取整个页面包裹的父容器实例，主要作用为事件委托绑定
        var $main = $('.main');
        // 右下角立即回答浮动按钮实例
        var $nowAnswerBtn = $('#answer_rightnow');
        // 页面传入的参数
        var vars = seajs.data.vars;
        var preload = [];
        // 获取用户id，通过vars的方式
        var userId = vars.user_id;
        // 获取问答的id，通过vars的方式
        var askId = vars.ask_id;
        // 声明采纳的回答id和采纳的回答用户id，用于之后点击弹窗确认采纳后的相关ajax调用
        // 一些没有模块化的js异步加载，尽可能的合并非模块化js
        // navflayer_new为导航操作js
        // appdownload为下载app操作js
        // preload.push('navflayer/navflayer_new', 'app/1.0.0/appdownload');
        preload.push('app/1.0.0/appdownload');
        // 异步加载未模块化js
        require.async(preload);
        // 一些不需要初始化的模块
        require('lazyload/1.9.1/lazyload');
        $('.lazyload').lazyload();

        /**
         * 问答警告弹窗
         * @param msg 要显示的文案
         */
        function askAlert(msg) {
            // 关注失败的样式,只有网络不好的时候会出现
            var $messageLoseMost = $('.tz-box');
            $messageLoseMost.find('div').html(msg);
            $messageLoseMost.show();
            // 关注失败提示框在3秒后隐藏
            setInterval(function () {
                $messageLoseMost.hide();
            }, 3000);
        }

        // 显示更多
        var $showMore = $('#zhankai');
        if ($('.max-h').next().height() > 63) {
            $showMore.show();
        }
        // 收起，更多
        $showMore.on('click', function () {
            var $that = $(this);
            var me = $that.parent().parent();
            me.find('.style1').removeClass('max-h');
            me.find('.style2').addClass('max-h');
            me.find('.style2').hide();
            $that.hide().next().show();
            // $(this).next().show();
        });
        $('#shouqi').on('click', function () {
            var $that = $(this);
            var me = $that.parent().parent();
            me.find('.style2').removeClass('max-h');
            me.find('.style1').addClass('max-h');
            $that.prev().show();
            $that.hide();
        });

        /**
         * 事件委托方式，点击赞或者点击踩或者点击采纳或者点击他的回答（这就是用户名边上的跳转，产看这个回答用户的回答）
         */
        $main.on('click', '.zan,.cai,.his_ask', function () {
            var $this = $(this);
            var dataId = $this.attr('data-id');
            if ($this.hasClass('his_ask')) {
                // ！！！这里的dataId是回答人的用户id，这个位置我非常不理解的是为什么要去判断这个id，没有就是没有，只会是点击到his_ask这个节点，不可能点击到其他，所以我注释掉了
                // if (!dataId) {
                // dataId = $(e.target).parent('h3').data('id');
                // }
                // 如果点击的是用户自己的回答，则跳转到我的回答页面，否则跳转到他人的回答页面
                if (dataId === userId) {
                    window.location.href = vars.askSite + '?c=bask&a=myAsk&src=client&grouptype=' + vars.grouptype + '&zhcity=' + vars.zhcity;
                } else {
                    window.location.href = vars.askSite + '?c=bask&a=hisAsk&src=client&type=answer&userid=' + dataId + 'grouptype='
                        + vars.grouptype + '&zhcity=' + vars.zhcity;
                }
            } else if (dataId) {
                // 这个回答的id，非用户id，如果点击的是赞按钮存在回答id，则执行赞操作
                var isZan = $this.hasClass('zan');
                // 获取回答用户的id
                var answerUserId = $this.attr('answer_user_id');
                // 不能对自己的回答进行点赞或点踩
                if (answerUserId === userId) {
                    askAlert('不能对自己的回答点赞');
                } else {
                    // 不登陆,通过localstorage判断是否已经踩赞
                    if (vars.localStorage && vars.localStorage.ask_zan_history && vars.localStorage.ask_zan_history.indexOf(dataId) !== -1) {
                        $this.find('i').html('您已经赞过');
                        $this.addClass('cur');
                        // $this.attr('class', 'd-link cur');// ！！！这里开始是这么写的，我认为下次也是可以点击的，并且仍然应该提示赞过
                        return;
                    }
                    if (vars.localStorage && vars.localStorage.ask_cai_history && vars.localStorage.ask_cai_history.indexOf(dataId) !== -1) {
                        $this.find('i').html('您已经踩过');
                        $this.addClass('cur');
                        return;
                    }
                    var url = vars.askSite + (isZan ? '?c=bask&a=ajaxZan&userid=' : '?c=bask&a=ajaxCai&userid=') + userId + '&answerid='
                        + dataId + '&askid=' + askId;
                    if (isZan) {
                        url += '&answer_user_id=' + answerUserId;
                    }
                    $.get(url, function (dataCopy) {
                        if (dataCopy) {
                            if (dataCopy.Code === '100') {
                                var str = $this.html().replace(/<\/i>(.*)/, '</i>' + (dataCopy.Ding));
                                $this.html(str);
                                $this.addClass('cur');
                                if (vars.localStorage) {
                                    var localStorageFlag = isZan ? 'ask_zan_history' : 'ask_cai_history';
                                    var lc = vars.localStorage.getItem(localStorageFlag);
                                    if (lc) {
                                        lc += ',' + dataId;
                                    } else {
                                        lc = dataId;
                                    }
                                    vars.localStorage.setItem(localStorageFlag, lc);
                                }
                            } else if (dataCopy.Code === '106') {
                                $this.find('i').html('您已经赞过');
                                $this.addClass('cur');
                            }
                        }
                    });
                }
            }
        });

        /**
         * 绑定点击事件，当点击右下角浮动的立即回答时操作
         */
        $nowAnswerBtn.on('click', function () {
            window.location.href = vars.askSite + '?c=bask&a=answerRightNow&zhcity=' + vars.zhcity + '&id=' + askId + '&src=client&grouptype=' + vars.grouptype;
        });

        // 加载更多的下一页索引
        var pagelist = 2;
        // 获取加载更多按钮jquery实例
        var $showMoreList = $('#more-list');

        /**
         * 绑定点击事件，点击加载更多操作
         */

        $showMoreList.on('click', function () {
            var url = vars.askSite + '?c=bask&a=ajaxGetMoreAnswers&id=' + askId + '&page=' + pagelist;
            $.ajax({
                url: url,
                success: function (data) {
                    // 如果数据不为空，则将html字符串加入到更多列表按钮实例前面，并且使下一页索引加一
                    if (data) {
                        $showMoreList.before(data);
                        $('.lazyload').lazyload();
                        pagelist++;
                    }
                    // 如果最大页面
                    if (pagelist >= vars.allpage) {
                        $showMoreList.hide();
                    }
                }
            });
        });
    };
});