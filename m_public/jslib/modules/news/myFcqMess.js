/**
 * 开放平台我的系统消息页面
 * Created by limengyang.bj@fang.com 2017-9-10
 */
define('modules/news/myFcqMess', ['jquery', 'loadMore/1.0.2/loadMore'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var vars = seajs.data.vars;
        var $ = require('jquery');
        var $tzList = $('.k-tzList');
        var inAjax = false;
        var moreTextDeal = function () {
            // 内容箭头
            $('.t-con').each(function (index, ele) {
                var $ele = $(ele);
                if ($ele.find('p').height() > 40) {
                    $ele.next().show();
                }
            });
        };
        moreTextDeal();
        // ajax加载更多
        if (vars.totalCount > 20) {
            var loadMore = require('loadMore/1.0.2/loadMore');
            loadMore({
                url: vars.newsSite + '?c=news&a=ajaxMyFcqMess&city=' + vars.city + '&uid=' + vars.uid,
                // 数据总条数
                total: vars.totalCount,
                // 首屏显示数据条数
                pagesize: 20,
                // 单页加载条数
                pageNumber: 10,
                // 加载更多按钮id
                moreBtnID: '#drag',
                // 是否需要第一次上拉到底后不加载更多，第二次后才加载更多，可为空，默认为true
                firstDragFlag: false,
                // 加载数据过程显示提示id
                loadPromptID: '#draginner',
                // 数据加载过来的html字符串容器
                contentID: '.k-tzList ul',
                // 加载前显示内容
                loadAgoTxt: '<div class="moreList"><a class="bt">查看更多</a></div>',
                // 加载中显示内容
                loadingTxt: '<div class="moreList graybg"><span><i></i>努力加载中...</span></div>',
                // 加载完成后显示内容
                loadedTxt: '<div class="moreList"><a class="bt">查看更多</a></div>',
                callback: moreTextDeal
            });
        }
        $tzList.on('click', '.txt', function () {
            if (!inAjax) {
                var $that = $(this);
                // 外层li标签
                var $messLi = $that.parent();
                if (!$messLi.hasClass('dis')) {
                    var id = $that.attr('data-id');
                    inAjax = false;
                    $.ajax({
                        url: vars.newsSite + '?c=news&a=ajaxMyFcqUpdateMessStatus&city=' + vars.city,
                        data: {
                            id: id
                        },
                        success: function (data) {
                            // 有返回值
                            if (data) {
                                $that.parent().addClass('dis');
                                $that.find('h3 i').remove();
                            }
                        },
                        complete: function () {
                            inAjax = false;
                        }
                    });
                }
                var $moreBox = $that.find('.moreBox');
                // 展开收起
                if ($moreBox.length > 0) {
                    var $moreA = $moreBox.find('a');
                    var $comDiv = $moreBox.parent().find('.t-con');
                    // 已经展开
                    if ($moreA.hasClass('up')) {
                        $moreA.removeClass('up');
                        $comDiv.css('max-height', '40px');
                    } else {
                        $moreA.addClass('up');
                        $comDiv.css('max-height', '500px');
                    }
                }
            }

        });

    };
});