/**
 * Created by user on 2016/7/28.
 * 评价需求新样式 zhangcongfeng@fang.com
 */
define('modules/agent/yiKanEvaluation', ['jquery', 'modules/esf/yhxw', 'util/util'], function (require,exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        // 综合评价
        var evaluate = $('#evaluate');
        var hidden = $('#hidden');
        var agentData = {};
        // 用于给用户提交评论的ajax请求加锁 防止重复提交评价
        var flagBool = false;
        // 用户行为对象
        var yhxw = require('modules/esf/yhxw');
        var cookiefile = require('util/util');
        // 外部经纪人页面埋码
        if (vars.ebstatus.indexOf('1') === -1) {
            // 用户行为统计
            yhxw({type: 0, pageId: 'mehcomment', curChannel: 'agent'});
        }
        // 综合评价点击事件
        evaluate.on('click', 'i', function () {
            evaluate.find('i').removeClass('active');
            var index = evaluate.find('i').index(this);
            index += 1;
            // 记录综合评价的星数
            agentData.HouseInfoAccuracy = index;
            evaluate.find('i:lt(' + index + ')').addClass('active');
            $('div[id^="show_"]').hide();
            $('#show_' + index).show();
            hidden.show();
        });
        // 评价标签点击事件
        hidden.on('click', '.zygwStag a', function () {
            var $that = $(this);
            if (!$that.hasClass('cur')) {
                $that.addClass('cur');
            } else {
                $that.removeClass('cur');
            }
        });
        // 建议和字数
        var words = $('#words');
        var suggest = $('#suggest');
        // 建议输入框相关事件
        // 输入修改字数,显示剩余字数,负数时显示红色
        suggest.on('input', function () {
            var numbers = suggest.val().length;
            if (numbers >= 150) {
                words.css('color', '#ff6666');
            } else {
                words.css('color', '#b3b6be');
            }
            words.text(150 - numbers);
        });
        var submitBtn = $('#submitBtn');
        // 外部经纪人提交数据
        // 点击提交评价按钮将用户评价的数据提交到后台
        submitBtn.on('click', function () {
            // 用户已经对该经纪人评价过了不能再次提交数据 防止用户多次点击提交按钮重复提交数据
            if (flagBool) {
                return;
            }
            // (1) 验证数据
            var length = suggest.val().length;
            if (length > 150) {
                alert('您最多输入150字!');
                return;
            }

            // (2) 获取数据
            // 标签
            var tags = '';
            var tagDivs = $('a[class="cur"]');
            var lengthA = tagDivs.length - 1;
            tagDivs.each(function (index, value) {
                if (index < lengthA) {
                    tags += $(value).text() + ',';
                } else {
                    tags += $(value).text();
                }
            });

            // 评价内容
            var evaluationContent = suggest.val().trim();
            // 用户输入内容如果包含<script></script>标签 过滤文本域中的数据
            evaluationContent = evaluationContent.replace(/(^\s*)|(\s*$)/g, '');
            evaluationContent = evaluationContent.replace(/<[^><]*script[^><]*>/i, '');
            evaluationContent = evaluationContent.replace(/<[\/\!]*?[^<>]*?>/i, '');
            if (words.text() === '150') {
                evaluationContent = '';
            }
            flagBool = true;//点击后置为ture
            if (vars.ebstatus.indexOf('1') > -1) {
                // 看房顾问
                var submit = function () {
                    var data = {
                        orderid: vars.orderid,
                        ProKnowledge: agentData.HouseInfoAccuracy,
                        Tags: encodeURIComponent(tags),
                        Content: encodeURIComponent(evaluationContent),
                        city: vars.city
                    };
                    $.ajax({
                        url: '?c=myesf&a=addYiKanEvaluation',
                        data: data,
                        dataType: 'json',
                        type: 'POST',
                        success: function (moredata) {
                            if ('' !== moredata) {
                                if (moredata.message) {
                                    if (moredata.message === '请先登录') {
                                        var burl = encodeURIComponent(window.location.href);
                                        window.location.href = location.protocol + '//m.fang.com/passport/login.aspx?burl=' + burl;
                                    } else {
                                        alert(moredata.message);
                                    }
                                } else {
                                    alert(moredata);
                                    history.go(-1);
                                }
                                if (moredata.result == 1) {
                                    window.location.href = '?c=mycenter&a=kanFangDayList&city=' + vars.city;
                                } else {
                                    history.go(-1);
                                }
                            }
                        }
                    });
                };
                submit();
            } else {
                // 外部经纪人评价
                // 需要传递给后台的数据
                var information = {
                    // 经纪人所在城市
                    city: vars.city,
                    // 经纪人ID
                    agentid: vars.agentid,
                    // 综合评级星数
                    HouseInfoAccuracy: agentData.HouseInfoAccuracy,
                    // 标签
                    tags: encodeURIComponent(tags),
                    // 用户在文本域中输入的内容
                    EntranceContent: encodeURIComponent(evaluationContent)
                };
                // 用户行为统计
                yhxw({type: 43, pageId: 'mehcomment', params: information, curChannel: 'agent'});
                $.ajax({
                    url: '/agent/?c=agent&a=addEvaluationOfAgent',
                    data: information,
                    dataType: 'json',
                    type: 'POST',
                    success: function (data) {
                        flagBool = false;//置为可点击
                        if (data) {
                            if (data.errcode === '401') {
                                //未登录跳转登录
                                var burl = encodeURIComponent(window.location.href);
                                var jumpUrl = location.protocol + '//m.fang.com/passport/login.aspx?burl=' + burl;
                                window.location.href = jumpUrl;
                            } else if (data.errcode === '200') {
                                alert(data.Msg);
                                // 评价成功跳转到评价列表页面
                                window.location.href = '/agent/' + vars.city + '/' + vars.agentid + '/comlist.html';
                            } else if (data.errcode === '404') {
                                alert(data.Msg);
                            } else {
                                alert(data.Msg);
                                history.go(-1);
                            }
                        } else {
                            alert('请稍后评价！');
                            history.go(-1);
                        }
                    },
                    error: function () {
                        flagBool = false;//置为可点击
                        alert('请求发生错误！');
                    }
                });
            }
        });
        // 电话统计函数
        function teltj(city, channel, housetype, houseid, type, phone, housefrom, agentid) {
            $.ajax({
                url: vars.mainSite + 'data.d?m=houseinfotj&city=' + city + '&housetype=' + housetype + '&houseid='
                + houseid + '&type=' + type + '&phone=' + phone + '&channel=' + channel + '&agentid=' + agentid + '&housefrom=' + housefrom,
                async: true
            });
        }

        // 在线咨询函数
        function chatWeituo(zhcity, city, housetype, houseid, newcode, type, phone, channel, uname, aname, agentid, order, photourl, housefrom) {
            if (vars.localStorage) {
                window.localStorage.setItem(String(uname), encodeURIComponent(aname) + ';'
                    + photourl + ';' + encodeURIComponent(vars.district + '的'));
            }
            $.ajax({
                url: '/data.d?m=houseinfotj&zhcity=' + zhcity  +  '&city=' + city + '&housetype=' + housetype + '&houseid=' + houseid
                + '&newcode=' + newcode + '&type=' + type + '&phone=' + phone + '&channel=' + channel + '&agentid='
                + agentid + '&order=' + order + '&housefrom=' + housefrom,
                async: false
            });
            setTimeout(function () {
                window.location = '/chat.d?m=chat&username=' + uname + '&city=' + city;
            }, 500);
        }

        // 点击在线咨询跳转到咨询界面
        $('.mes').on('click', function () {
            var data = $(this).attr('data-chat');
            var dataArr = data.split(',');
            chatWeituo.apply('this', dataArr);
        });
        // 点击打电话完成电话统计
        $('.call').on('click', function () {
            var data = $(this).attr('data-teltj');
            var dataArr = data.split(',');
            teltj.apply('this', dataArr);
        });
    };
});