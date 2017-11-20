/**
 *问答UI改版 个人回答列表页
 * modified by zdl 2016-1-11
 * 邮箱地址（zhangdaliang@fang.com）
 */
define('modules/ask/hisAsk', ['jquery', 'loadMore/1.0.0/loadMore', 'modules/ask/yhxw'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var userid = vars.userid;
        var askType = vars.ask_type;
        // +++++++++++++++++++++++++++++++++++
        // 页面浮沉提示div
        var $promptId = $('#prompt');

        /**
         * 隐藏浮层提示函数
         */
        function hidePrompt() {
            setTimeout(function () {
                $promptId.hide();
            }, 2000);
        }

        /**
         * 执行浮层的提示与隐藏操作函数
         * @param content 浮层提示的内容
         */
        function PromptExecution(content) {
            $('#promptContent').html(content);
            $promptId.show();
            hidePrompt();
        }

        /**
         * 判断是否为专家
         */
        $.ajax({
            type: 'get',
            url: vars.askSite + '?c=ask&a=ajaxGetExpert',
            data: {
                userid: userid,
                isAdvisor: vars.isAdvisor,
                groupid: vars.groupid
            },
            success: function (result) {
                if (result) {
                    var $result = $(result);
                    $('.my-name').after($result);
                }
            }
        });
        // 上拉加载更多
        var url = '';
        if (vars.accept === '1' || vars.accept === '2') {
            url = vars.askSite + '?c=ask&a=ajaxHisAsk&city='+ vars.city +'&type=' + askType + '&accept=' + vars.accept + '&userid=' + userid;
        } else {
            url = vars.askSite + '?c=ask&a=ajaxHisAsk&city='+ vars.city +'&type=' + askType + '&userid=' + userid;
        }
        var loadMore = require('loadMore/1.0.0/loadMore');
        loadMore({
            url: url,
            total: vars.totalCount,
            pagesize: 5,
            pageNumber: 5,
            moreBtnID: '#drag',
            loadPromptID: '.draginner',
            contentID: '#ajax',
            loadAgoTxt: '上拉加载更多',
            loadingTxt: '加载中...',
            firstDragFlag: false
        });


        // 对滚动时的调取
        var fnav = $('#my-nav2');
        // var $fnavheight = fnav.offset().top();
        // 这个距离顶部的距离是一个具体值 存在问题
        $(window).on('scroll', function () {
            if (document.body.scrollTop > 224 || document.documentElement.scrollTop > 224) {
                fnav.show();
            } else {
                fnav.hide();
            }
        });

        $('.floatApp').show();
        $('footer').hide();
        $('#head_img').on('click', function () {
            window.location.href = vars.askSite + '?c=ask&a=userRichExp&userid=' + userid;
        });
        // 点击该页面右上角的图标
        $('.tadp').on('click', function () {
            var me = $(this);
            var userid = vars.userid;
            if (me.hasClass('jjr')) {
                $.get(vars.askSite + '?c=ask&a=ajaxGetAgentInfo&userid=' + userid, function (data) {
                    if (data) {
                        if (data.msg) {
                            PromptExecution(data.msg);
                        } else {
							// roleList等于1时，此人为网销
                            if (vars.roleList === '1') {
                                window.location = vars.mainSite + 'agent/' + data.city + '/1_' + data.agentId + '.html';
                            } else {
                                window.location = vars.mainSite + 'agent/' + data.city + '/' + data.agentId + '.html';
                            }
                        }
                    } else {
                        PromptExecution('该经纪人没有网店');
                    }
                }, 'json');
            } else if (me.hasClass('zygw')) {
                $.get(vars.askSite + '?c=ask&a=ajaxGetZygwInfo&userid=' + userid, function (data) {
                    if (data) {
                        if (data.msg) {
                            PromptExecution(data.msg);
                        } else {
                            window.location = vars.mainSite + 'zygwshopinfo/' + data.city + '_' + userid + '_' + data.shop + '/';
                        }
                    } else {
                        PromptExecution('该置业顾问没有网店');
                    }
                }, 'json');
            }
        });

        // 用户行为对象
        var yhxw = require('modules/ask/yhxw');
        yhxw({type: 0, pageId: 'mausercenter'});
    };
});