/**
 * wap/1214二手房经纪人店铺 经纪人评价页
 * create by zdl 2015-12-16
 * 邮箱地址（zhangdaliang@fang.com）
 */
define('modules/agent/evaluationOfAgent', ['jquery', 'util/util', 'modules/esf/yhxw'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        // 引入util.js
        var cookiefile = require('util/util');
        var vars = seajs.data.vars;
        var $levelC = $('.level');

        // 用于给用户提交评论的ajax请求加锁 防止重复提交评价
        var flagBool = false;

        // 页面的错误提示相关操作
        var $promptId = $('#prompt');
        var $yzmsStaC = $('.yzm-sta');
        var $submitId = $('#submit');
        // 让按钮颜色变成灰色
        $submitId.css('background-color', '#999');
        // 用来判断按钮是否为红色并且可点
        var houseInfoFlag = false;
        var serviceAttitudeFlag = false;
        var businessLevelFlag = false;
        var submitFlag = false;
        // 用户行为对象
        var yhxw = require('modules/esf/yhxw');
        // 用户行为统计
        yhxw({type: 0, pageId: 'mehcomment', curChannel: 'agent'});

        // 3秒后隐藏错误提示浮层
        function hidePrompt() {
            setTimeout(function () {
                $promptId.hide();
            }, 3000);
        }
        // 3秒后隐藏错误提示浮层并跳转页面
        function hidePromptJump(url) {
            setTimeout(function () {
                $promptId.hide();
                window.location.href = url;
            }, 3000);
        }
        // 执行错误提示
        function PromptExecution(content,url) {
            $yzmsStaC.text(content);
            $promptId.show();
            if (url) {
                hidePromptJump(url)
            } else {
                hidePrompt();
            }
        }

        // 给评论选择div添加点击事件计算对应的评分3表示好评2表示中评1表示差评
        var score = 3;
        $levelC.on('click', 'a', function () {
            var $this = $(this);
            $levelC.find('a').removeClass('cur');
            $this.addClass('cur');
            score = 3 - $this.index();
        });

        // 提交按钮是否可用控制
        function switchButton() {
            if (businessLevelFlag && serviceAttitudeFlag && houseInfoFlag) {
                $submitId.css('background-color', '#df3031');
                submitFlag = true;
            } else {
                submitFlag = false;
            }
        }
        // 点击星星完成对应的满意度评分
        $('#houseInfo').on('click', 'i', function () {
            var $this = $(this);
            var parent = $this.parent();
            var idx = $this.index() + 1;
            parent.find('i').removeClass('active');
            parent.find('i:lt(' + idx + ')').attr('class', 'active');
            var houseInfo = $('#houseInfo').find('i[class*="active"]').length;
            if (houseInfo > 0) {
                houseInfoFlag = true;
                switchButton();
            } else {
                houseInfoFlag = false;
            }
        });
        $('#serviceAttitude').on('click', 'i', function () {
            var $this = $(this);
            var parent = $this.parent();
            var idx = $this.index() + 1;
            parent.find('i').removeClass('active');
            parent.find('i:lt(' + idx + ')').attr('class', 'active');
            var serviceAttitude = $('#serviceAttitude').find('i[class*="active"]').length;
            if (serviceAttitude > 0) {
                serviceAttitudeFlag = true;
                switchButton();
            } else {
                serviceAttitudeFlag = false;
            }
        });
        $('#businessLevel').on('click', 'i', function () {
            var $this = $(this);
            var parent = $this.parent();
            var idx = $this.index() + 1;
            parent.find('i').removeClass('active');
            parent.find('i:lt(' + idx + ')').attr('class', 'active');
            var businessLevel = $('#businessLevel').find('i[class*="active"]').length;
            if (businessLevel > 0) {
                businessLevelFlag = true;
                switchButton();
            } else {
                businessLevelFlag = false;
            }
        });

        // 检测用户输入评论文本框的字数
        var $tsC = $('.ts');
        $('#EvaluationContent').on('input', function () {
            var $this = $(this);
            var contentLen = $this.val().length;
            $tsC.text(contentLen + '/150');
        });

        // 点击提交评价按钮将用户评价的数据提交到后台
        $submitId.on('click', function () {
            // 三种评分没有都选择
            if (!submitFlag) {
                return false;
            }
            var imei = cookiefile.getCookie('global_cookie');
            // 从cookie里面获取当前评价页面的经纪人的信息
            var agentinfo = cookiefile.getCookie(vars.agentid + '_pj');
            // 获取房屋信息真实的评论星数
            var houseInfo = $('#houseInfo').find('i[class*="active"]').length;
            // 获取服务态度的评星数
            var serviceAttitude = $('#serviceAttitude').find('i[class*="active"]').length;
            // 获取服务水平的评星数
            var businessLevel = $('#businessLevel').find('i[class*="active"]').length;
            // 获取评价内容
            var evaluationContent = $('#EvaluationContent').val();
            // 用户输入内容如果包含<script></script>标签 过滤文本域中的数据
            evaluationContent = evaluationContent.replace(/(^\s*)|(\s*$)/g, '');
            evaluationContent = evaluationContent.replace(/<[^><]*script[^><]*>/i, '');
            evaluationContent = evaluationContent.replace(/<[\/\!]*?[^<>]*?>/i, '');
            if (agentinfo) {
                PromptExecution('不能重复评价该经纪人！');
                return false;
            }
            if (evaluationContent.length > 150) {
                PromptExecution('请确定输入少于150字！');
                return false;
            }
            // 用户已经对该经纪人评价过了不能再次提交数据 防止用户多次点击提交按钮重复提交数据
            if (flagBool) {
                return false;
            }
            // 需要传递给后台的数据
            var information = {
                // 经纪人所在城市
                agentCity: vars.city,
                // 经纪人ID
                agentid: vars.agentid,
                // 评价人ID
                EvaluationUserID: vars.userid,
                // 评价人姓名
                EvaluationUserName: vars.username,
                // 好中差评对应的分数
                Elevel: score,
                // 房屋信息真实的评论星数
                HouseInfoAccuracy: houseInfo,
                // 服务态度的评星数
                ServiceAttitude: serviceAttitude,
                // 服务水平的评星数
                Professional: businessLevel,
                // 用户在文本域中输入的内容
                EntranceContent: evaluationContent,
                // 用户类型
                usertype: vars.usertype,
                EvaluationType: 97,
                from: vars.from,
                EvaluationMobile: vars.phone,
                imei: imei
            };
            // 用户行为统计
            yhxw({type: 43, pageId: 'mehcomment', params: information, curChannel: 'agent'});
            information.Elevel = score;
            $.ajax({
                url: '/agent/?c=agent&a=addEvaluationOfAgent',
                data: information,
                dataType: 'json',
                type: 'GET',
                success: function (data) {
                    if (data) {
                        if (data.Msg === 'HouseInfoAccuracy,ServiceAttitude,Professional 不能为空或小于1') {
                            PromptExecution('请选择房屋真实度、服务态度满意度、业务水平专业度星级');
                        } else if (data.Msg === '请先登录') {
                            var burl = encodeURIComponent(window.location.href);
                            var jumpUrl = location.protocol + '//m.fang.com/passport/login.aspx?burl=' + burl;
                            PromptExecution('请登录后进行此操作！',jumpUrl);
                        }else if (data.Msg === 'ELevel 不能为空') {
                            PromptExecution('请选择等级');
                        } else if (data.Msg === '成功') {
                            // 用户对该经纪人评价成功 设置cookie防止用户对该经纪人进行重复评价 cookile的过期时间为l个月
                            cookiefile.setCookie(vars.agentid + '_pj', vars.agentid, 30);
                            flagBool = true;
                            // 评价成功跳转到评价列表页面
                            window.location.href = '/agent/' + vars.city + '/' + vars.agentid + '/comlist.html';
                        } else {
                            PromptExecution(data.Msg);
                            history.go(-1);
                        }
                    } else {
                        PromptExecution('请稍后评价！');
                        history.go(-1);
                    }
                },
                error: function () {
                    PromptExecution('请求发生错误！');
                }
            });
        });
    };
});