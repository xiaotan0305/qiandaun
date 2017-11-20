/**
 * wap/1214二手房经纪人店铺 经纪人评价列表页面
 * create by zdl 2015-12-16
 * 邮箱地址（zhangdaliang@fang.com）
 */
define('modules/agent/evaluationList', ['jquery', 'util/util'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var cookiefile = require('util/util');
        var vars = seajs.data.vars;
        var url = window.location.href.toLowerCase();
        // 之前的对应页面有设置这个cookie 不知道用于什么地方 用于文档中没具体说明ui改版后也加上了这点代码
        if (url.indexOf('src=client') > 0 || url.indexOf('ucbrowser') > 0 || url.indexOf('qqbrowser') > 0
            || url.indexOf('clientindex.jsp') > 0 || url.indexOf('sem=4') > 0 || url.indexOf('sem=5') > 0
            || url.indexOf('sf_source=fwc') > 0 || url.indexOf('sf_source=tg') > 0 || url.indexOf('client') > 0) {
            cookiefile.setCookie(vars.cd_ver, '1');
        }
        // if (url.indexOf('ucbrowser') > 0 || url.indexOf('qqbrowser') > 0 || url.indexOf('sf_source=tg') > 0
           // || url.indexOf('client') > 0) {
          //  cookiefile.setCookie('clientdownshow', '1');
       // }
        require.async(vars.public+'js/20141106.js');

        // 页面的错误提示相关操作
        var $promptId = $('#prompt');
        var $yzmsStaC = $('.yzm-sta');

        function hidePrompt() {
            setTimeout(function () {
                $promptId.hide();
            }, 3000);
        }

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

        var $reputationAllId = $('#reputationAll');
        var $reputationUserId = $('#reputationUser');
        var $reputationPeerId = $('#reputationPeer');
        var $dragId = $('#drag');
        var w = $(window);
        // 经纪人评价总页数
        var totalpage = vars.totalpage;
        // 经纪人评价总条数
        var totalNum = vars.evaluationcount;
        // 网友评价页数
        var userpage = vars.userpage;
        // 网友评价条数
        var userNum = vars.evaluationusercount;
        // 同行评价页数
        var agentpage = vars.agentpage;
        // 经纪人评价条数
        var agentNum = vars.evaluationagentcount;
        // k变量用于控制用户下拉时触发加载更多函数 k为true时说明还存在下一页 k为false时则不存在下一页
        var k = true;
        if (vars.totalpage <= 1) {
            $dragId.hide();
            k = false;
        }
        var $noEvaluationId = $('#noEvaluation');
        if (totalNum === '0') {
            $noEvaluationId.show();
        }
        var $aCmContentsId = $('#aCmContents');
        // 点击全部评论隐藏其他评论显示全部评论
        $reputationAllId.on('click', function () {
            if (totalNum === '0') {
                $noEvaluationId.show();
            } else {
                $noEvaluationId.hide();
            }
            $('.flexbox').children().removeClass('cur');
            $(this).addClass('cur');
            $('#content').find('ul').hide();
            $aCmContentsId.show();
            var loadTotalNum = $aCmContentsId.find('li').length;
            // totalpage为评论的总页数(总屏数) 如果只有一页则隐藏加载更多
            if (totalpage > 1 && totalNum !== loadTotalNum) {
                $dragId.show();
                // 存在一页 k设置为true允许下滑加载更多
                k = true;
            } else {
                $dragId.hide();
                // 只存在一页 k设置为false阻止下滑加载更多
                k = false;
            }
        });
        var $uCmContentsId = $('#uCmContents');
        $reputationUserId.on('click', function () {
            if (userNum === '0') {
                $noEvaluationId.show();
            } else {
                $noEvaluationId.hide();
            }
            $('.flexbox').children().removeClass('cur');
            $(this).addClass('cur');
            $('#content').find('ul').hide();
            $uCmContentsId.show();
            var loadUserNum = $uCmContentsId.find('li').length;
            if (userpage > 1 && userNum !== loadUserNum) {
                $dragId.show();
                k = true;
            } else {
                $dragId.hide();
                k = false;
            }
        });
        var $peerCmContentsId = $('#peerCmContents');
        $reputationPeerId.on('click', function () {
            if (agentNum === '0') {
                $noEvaluationId.show();
            } else {
                $noEvaluationId.hide();
            }
            $('.flexbox').children().removeClass('cur');
            $(this).addClass('cur');
            $('#content').find('ul').hide();
            $peerCmContentsId.show();
            var loadAgentNum = $peerCmContentsId.find('li').length;
            if (agentpage > 1 && loadAgentNum !== agentNum) {
                $dragId.show();
                k = true;
            } else {
                $dragId.hide();
                k = false;
            }
        });
        // 点击去评价 实现对应的用户验证和跳转
        $('#checkcomment').on('click', function () {
            // var userinfo = vars.userinfo;
            var userid = vars.userid;
            var username = '';
            if (userid) {
                // userinfo = decodeURIComponent(cookiefile.getCookie('userinfo'));
                //  userid = vars.userid;
                if (userid === vars.agentid) {
                    PromptExecution('自己不能评价自己哦');
                    return false;
                }
                window.location.href = '/agent/' + vars.city + '/' + vars.agentid + '/comment.html';
            } else {
                var burl = encodeURIComponent(window.location.href);
                var jumpUrl = 'http://m.fang.com/passport/login.aspx?burl=' + burl;
                PromptExecution('请登录后进行此操作！',jumpUrl);
                return false;
            }
        });

        // 加载更多方法的实现
        var page = 2;
        // 记录全部评论的加载屏数
        var allPage = 2;
        // 记录用户评论的加载屏数
        var userPage = 2;
        // 记录同行评论的加载屏数
        var agentPage = 2;
        var $draginnerC = $('.draginner');

        function load(str) {
            var draginner = $('.draginner')[0];
            $draginnerC.css('padding-left', '10px');
            // draginner.style.background = 'url(//js.soufunimg.com/wireless_m/touch/img/load.gif) 0 50% no-repeat';
            draginner.innerHTML = '正在加载请稍候';
            // 加载列表
            var usertype = '';

            if (str === 'all') {
                usertype = 'all';
                page = allPage;
            }
            if (str === 'high') {
                usertype = 'user';
                page = userPage;
            }
            if (str === 'low') {
                usertype = 'agent';
                page = agentPage;
            }
            var information = {
                agentid: vars.agentid,
                usertype: usertype,
                page: page
            };
            $.ajax({
                url: '/agent/?index.php&c=agent&a=ajaxGetEvaluationList',
                data: information,
                dataType: 'json',
                type: 'GET',
                success: function (data) {
                    if (data.errorcode) {
                        $('ul[name=' + str + ']').append(data.content);
                        $draginnerC.css('padding-left', '0px');
                        draginner.style.background = '';
                        draginner.innerHTML = '下拉自动加载更多';
                        if (str === 'all') {
                            if (page < totalpage) {
                                allPage += 1;
                                $dragId.show();
                                k = true;
                            } else {
                                $dragId.hide();
                                k = false;
                            }
                        }
                        if (str === 'high') {
                            if (page < userpage) {
                                userpage += 1;
                                $dragId.show();
                                k = true;
                            } else {
                                $dragId.hide();
                                k = false;
                            }
                        }
                        if (str === 'low') {
                            if (page < agentpage) {
                                agentPage += 1;
                                $dragId.show();
                                k = true;
                            } else {
                                $dragId.hide();
                                k = false;
                            }
                        }
                    }
                },
                error: function () {
                    PromptExecution('请求发生错误！');
                }
            });
        }

        // 滚动到一定高度时触发自动加载更多
        $(window).on('scroll',function () {
            var scrollh = $(document).height();
            var bua = navigator.userAgent.toLowerCase();
            if (bua.indexOf('iphone') !== -1 || bua.indexOf('ios') !== -1) {
                scrollh -= 140;
            } else {
                scrollh -= 80;
            }
            if (k && $(document).scrollTop() + w.height() >= scrollh) {
				k = false;
                var str = $('.cur').attr('name');
                load(str);
            }
        });
        // 点击加载更多时加载更多评论
        $dragId.click(function () {
            var str = $('.cur').attr('name');
            load(str);
        });
    };
});