/**
 * Created by zdl on 2016/4/5.
 * 邮箱地址(zhangdaliang@fang.com)
 */
define('modules/myesf/traDetailComment',['jquery'],function (require,exports,module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        // flag用于给用户评价的提交加锁 防止用户重复提交评价数据
        var flag = true;
        var vars = seajs.data.vars;
        // 获取容纳星星的dom元素
        var $icoStar = $('.ico-star2');
        // 获取打星对应的显示文案容器
        var $content = $('.dpBox').find('p');
        // 获取浮沉div元素
        var $sendFloatId = $('#sendFloat');
        // 获取显示浮沉提示的div
        var $sendText = $('#sendText');

        // 3秒后隐藏错误提示浮层并跳转
        function hidePromptJump(url) {
            setTimeout(function () {
                $sendFloatId.hide();
                if (url) {
                    window.location.href = url;
                }
            }, 3000);
        }

        // 执行错误提示
        function PromptExecution(content,url) {
            $sendText.text(content);
            $sendFloatId.show();
            hidePromptJump(url);
        }
        // 给星级评价i标签添加点击事件
        $icoStar.find('i').on('touchstart',function () {
            var $that = $(this);
            // index变量用于存取当前点击的是第几颗星星
            var index = $that.index() + 1;
            // 当点击星星时 先清除所有的星星的active样式
            $icoStar.find('i').removeClass('active');
            // 根据点击的是第几颗星星 给对应的星星添加活动样式
            $icoStar.find('i:lt(' + index + ')').addClass('active');
            // 根据点击的星星的个数显示不同的文案
            switch (index) {
                // l颗星显示非常不满意
                case 1: $content.text('非常不满意');
                    break;
                case 2: $content.text('不满意');
                    break;
                case 3: $content.text('一般');
                    break;
                case 4: $content.text('满意');
                    break;
                case 5: $content.text('非常满意');
                    break;
            }
        });

        // 评价内容输入框操作
        $('#evaluateCon').one('focus',function () {
            // 输入框第一次获取到焦点的时候清空输入框中的提示内容
            $(this).text('');
        }).on('input',function () {
            var $that = $(this);
            // 获取输入框中输入的字符的个数
            var evaluateConLength = $that.text().length;
            if (evaluateConLength > 150) {
                PromptExecution('以超出150字');
            }
        });

        //  点击提交按钮将评价交易经纪人信息提交的后台
        $('#submit').on('click',function () {
            // score用户对该经纪人的星级评价
            var score = $icoStar.find('i[class="active"]').length;
            // 当用户没有对该经纪人进行星级评价就点击提交按钮时直接退出
            if (!score) {
                PromptExecution('你还没有对该经纪人进行评分');
                return false;
            }
            // 星级评价对应的显示文案
            var satisfaction = $content.text();
            // 附加评价内容 非必需
            var evaluation = '';
            var $evaluateConId = $('#evaluateCon');
            // 如果用户没有添加附加评论 传给后台空字符串
            if ($evaluateConId.text() !== '说说经办人在服务中的表现，或者对您的帮助（最多150汉字）') {
                // 一切用户输入都不可信，屏蔽掉script代码
                evaluation = $evaluateConId.text().replace(/[\<\>\(\)\;\{\}\"\'\[\]\/\@\!\,]/g, '');
            }
            // 评价信息提交到后台的地址
            var url = vars.mySite + '?c=myesf&a=submitTraDetailComment';
            // 提交到后台的数据
            var information = {
                score: score,
                satisfaction: satisfaction,
                evaluation: evaluation,
                // 交易id
                tradeID: vars.tradeID,
                // 用户类型 1为业主2为购房者
                tradeType: vars.tradeType,
                // 用户名
                userName: vars.userName,
                // 用户id
                userID: vars.userID,
                // 经纪人姓名
                agentName: vars.agentName,
                // 经纪人用户名
                agentPassportName: vars.agentPassportName,
                // 经纪人id
                agentID: vars.agentID,
                // 被评价人角色 0为未知 1为网校 2为权证 3为贷款
                agentRole: vars.agentRole,
                // 交易步骤
                stepNum: vars.stepNum
            };
            // ajax请求加锁 防止用户重复提交评价数据
            if (flag) {
                $.ajax({url: url,
                    async: false,
                    data: information,
                    type: 'POST',
                    success: function (data) {
                        // 评价成功返回'1'
                        if (data.errcode === '1') {
                            // 将提交按钮锁住不让用户重复提交
                            flag = false;
                            // 评价成功后的跳转地址
                            var url = vars.mySite + '?c=myesf&a=getTraDetail&city=' + vars.city + '&tradeid=' + vars.tradeID;
                            // 显示提示浮层并跳转
                            PromptExecution(data.errmsg,url);
                        } else {
                            // 评价失败浮层提示错误信息
                            PromptExecution(data.errmsg);
                        }
                    }
                });
            }
        });
    };
});
