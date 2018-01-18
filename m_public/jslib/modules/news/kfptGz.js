/**
 * 开放平台关注公用方法
 * Created by limengyang.bj@fang.com 2017-1-21
 * Modified by lijianlin@fang.com 修改关注操作类，添加展开和收起用户介绍信息
 */
define('modules/news/kfptGz', ['jquery'], function (require) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;
    // 用户登录信息
    var userInfo = '';
    // ajax标识
    var inAjax = false;
    // 关注
    var $gz = $('.gzBtn');
    var $tiShiBox = $('.tiShiBox');
    // 显示提示信息
    var showPrompt = function (msg) {
        $tiShiBox.html(msg).show();
        // 延时隐藏
        setTimeout(function () {
            $tiShiBox.hide();
        }, 1000);
    };
    // 判断用户介绍是否大于两行，大于则隐藏多余内容，不大于则隐藏展开按钮
    var showMoreInfo = $('.showMoreInfo');
    var pInfo = $('.userDescriptionShow');

    if (pInfo.height() > 36) {
        pInfo.addClass('limit_2_line');
        showMoreInfo.show();
        // 展开和收起用户介绍信息
        showMoreInfo.on('click', function () {
            var $this = $(this);
            if (pInfo.hasClass('limit_2_line')) {
                pInfo.removeClass('limit_2_line');
                $this.addClass('up_arr');
            } else {
                pInfo.addClass('limit_2_line');
                $this.removeClass('up_arr');
            }
        });
    }
    // 关注状态判断,optType操作类型 1为查询操作，2为更新操作
    var gzUpdate = function (optType) {
        inAjax = true;
        $.ajax({
	    // 关注测试接口
            //url: 'https://mptest.fang.com/opencmsJsonp/updateGzCnt.do?optType=' + optType,
	    url: 'https://mp.fang.com/opencmsJsonp/updateGzCnt.do?optType=' + optType,
            data: {
                userById: $gz.attr('data-uid'),
                passporName: userInfo.username
            },
            type: 'get',
            async: false,
            dataType: 'jsonp',
            // 服务端用于接收callback调用的function名的参数
            jsonp: 'callbackparam',
            success: function (json) {
                // optType=1时候，返回已关注，未关注两个值,optType=2时候，返回成功，失败两个值
                if (optType === 1) {
                    if (json === '已关注') {
                        // 资讯头条列表关注,头条列表和详情浮层置灰是gray
                        $gz.addClass('kphht-gray').addClass('gray').text('已关注');
                    }
                } else if (json === '关注成功') {
                    $gz.addClass('kphht-gray').addClass('gray').text('已关注');
                    showPrompt('您已关注成功');
                } else if (json === '取消关注成功') {
                    // 资讯头条列表关注
                    if (vars.action === 'index') {
                        $gz.removeClass('gray').text('关注');
                    } else {
                        $gz.removeClass('kphht-gray').removeClass('gray').text('+ 关注');
                    }

                    showPrompt('成功取消关注');
                } else if (json === '失败') {
                    showPrompt('取消关注失败');
                } else {
                    showPrompt('抱歉关注失败');
                }
            },
            error: function () {
                // 更新才显示
                if (optType === 2) {
                    showPrompt('抱歉关注失败');
                }
            },
            complete: function () {
                inAjax = false;
            }
        });
    };
    // 登录状态判断
    var loginCheck = function () {
        $.ajax({
                url: vars.newsSite + '?c=news&a=ajaxUserGzInfo',
                data: {},
                success: function (data) {
                    // 没有登录，或者登录用户不是当前文章的圈主显示关注
                    if (!data || data.userid !== vars.fcqPassportId) {
                        // 用户信息
                        userInfo = data;
                        $gz.show();
                        // 浮层有关注按钮，删除行样式
                        if ($('.kpuserfloat').length > 0) {
                            $('.kpuserfloat').removeClass('n-btn');
                        }
                        $('.btn-ask').show();
                        // 有用户信息，查询关注状态
                        gzUpdate(1);
                    }
                }
            }
        );
    };
    // 关注
    $gz.on('click', function () {
        if (userInfo) {
            if (!inAjax) {
                gzUpdate(2);
            }
        } else {
            // 跳转登录页面
            location.href = 'https://m.fang.com/passport/login.aspx?burl=' + location.href;
        }
    });
    // 判断登录状态
    loginCheck();
});