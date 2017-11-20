/**
 * 问答seo列表详情页主类
 * by blue
 * 20150918 blue 整理代码，优化代码，删除冗长代码，删除单独搜索js加载
 */
define('modules/ask/seoDetail',
    ['jquery', 'util', 'cirlegrow/1.0.0/cirlegrow','lazyload/1.9.1/lazyload'],
    function (require, exports, module) {
        'use strict';
        module.exports = function () {
            // jquery库
            var $ = require('jquery');
            // 公共工具类
            var util = require('util');
            // 我看行或者我看不行部分圆边增加效果图表类
            var CirleGrow = require('cirlegrow/1.0.0/cirlegrow');
            // 获取页面通过seajs传入的参数
            var vars = seajs.data.vars;

            /* 图片惰性加载*/
            require('lazyload/1.9.1/lazyload');
            $('.lazyload').lazyload({
                placeholder: vars.imgUrl + 'images/head.png'
            });
            // 获取用户id
            var userid = vars.userid;
            // 获取类id，！！！从字面的理解猜测
            var classid = vars.classid;
            // 以下的赋值中均没有使用到，我注释了
            // var pageindex = vars.page;
            // var pagenum = vars.pagenum;
            // var pagecount = vars.pagecount;
            // var localUrl = window.location.href;
            // var pageSize = vars.pagesize;
            // 不支持的百分比值
            var nopercent = parseInt(vars.NoPercent);
            // 支持的百分比值
            var yespercent = parseInt(vars.YesPercent);
            // ！！！不知道是什么参数，也无法猜测出来是什么意思
            var LongtailID = vars.LongtailID;
            // 猜测为判断是否已经投过票的标识
            var isvote = vars.isvote;
            // 警告提示弹窗容器实例
            var $pop = $('#message_lose_most');
            // 关注按钮实例
            var $guanzhuBtn = $('.sguanzhu');
            // 右下角浮动的立即回答按钮
            var $nowAnswerBtn = $('#answer_rightnow');
            // 问题列表容器
            var $askListBody = $('.a-int-b');

            // 一些没有模块化的js使用异步加载
            // navflayer_new用于导航点击及显示相关操作js
            // requestanimationframe用于requestAnimationFrame方法兼容性写法
            require.async([vars.public + 'js/requestanimationframe.js']);

            /**
             * 问答警告弹窗
             * @param msg 要显示的文案
             */
            function askAlert(msg) {
                $pop.find('p').html(msg);
                $pop.show();
                // 3秒后隐藏
                setInterval(function () {
                    $pop.hide();
                }, 3000);
            }

            /**
             * 点击关注按钮操作
             */
            $guanzhuBtn.on('click', function () {
                // 判断用户id是否为空，为空则跳转登陆页面
                if (!userid) {
                    util.login();
                    return;
                }
                if ($guanzhuBtn.hasClass('undis')) {
                    return;
                }
                // 实现ajax调用
                $.get(vars.askSite + '?c=ask&a=ajaxSeoAttention&userid=' + userid + '&classid=' + classid, function (data) {
                    if (data) {
                        // 进行ajax关注成功的样式，直接对关注数加一
                        if (data.code === '210') {
                            var strArr = $guanzhuBtn.html().split('|');
                            strArr[0] = '已关注 ';
                            strArr[1] = ' ' + (Number(strArr[1]) + 1);
                            $guanzhuBtn.html(strArr.join('|'));
                            $guanzhuBtn.addClass('undis');
                        } else {
                            askAlert(data.message);
                        }
                    }
                });
            });

            require.async(vars.public + 'js/requestanimationframe.js', function () {
                // 我看行操作按钮
                var cirle1 = $('#click1');
                // 我看不行操作按钮
                var cirle2 = $('#click2');
                // 初始化我看行圆形增加图表实例
                var c1 = new CirleGrow({id: '#cirle1', circleClr: '#aee353'});
                // 初始化我看不行圆形增加图表实例
                var c2 = new CirleGrow({id: '#cirle2', circleClr: '#ff5859'});

                /**
                 * 点击我看行或者我看不行后的显示效果
                 */
                function clickAfterEffect() {
                    // 计算出我看行的百分比
                    var yesCirclePercent = (yespercent / (nopercent + yespercent)).toFixed(2);
                    // 执行我看行动画图的动画
                    c1.run(yesCirclePercent);
                    // 执行我看不行的动画图动画
                    c2.run(1 - yesCirclePercent);
                    // 设置点击后的效果
                    cirle1.css('color', '#aee353');
                    cirle2.css('color', '#ff5859');
                    // 设置点击后显示百分比变化
                    cirle1.find('p').html(Math.round(yesCirclePercent * 100).toString() + '%');
                    cirle2.find('p').html(Math.round((1 - yesCirclePercent) * 100).toString() + '%');
                }

                if (vars.localStorage && vars.localStorage.ask_vote_history) {
                    // ！！！这里的isvote是通过后台传过来的所有应该是字符串而不是数字，我把1改成了'1'
                    if ($.inArray(LongtailID, vars.localStorage.ask_vote_history.split(',')) !== -1 || isvote === '1') {
                        clickAfterEffect();
                    }
                }
                if (isvote === '1') {
                    clickAfterEffect();
                }
                // 点击我看行或者我看不行操作
                cirle1.add(cirle2).on('click', function () {
                    var $this = $(this);
                    if (vars.localStorage && vars.localStorage.ask_vote_history) {
                        if ($.inArray(LongtailID, vars.localStorage.ask_vote_history.split(',')) !== -1 || isvote === '1') {
                            askAlert('您已经投过票了');
                            return;
                        }
                    }
                    // 设置判断是点击了我看行还是点击了我看不行，分别传入后台的参数为1、0
                    var supportType = $this.attr('id') === 'click2' ? 0 : 1;
                    $.get(vars.askSite + '?c=ask&a=ajaxVote&classid=' + classid + '&type=' + supportType.toString(), function (data) {
                        if (data.code === '111') {
                            if (supportType) {
                                yespercent++;
                            } else {
                                nopercent++;
                            }
                            clickAfterEffect();
                            var personnum = Number(vars.personnum);
                            personnum++;
                            $('#num').html(personnum + '人投票');
                            if (vars.localStorage) {
                                if (!vars.localStorage.ask_vote_history) {
                                    vars.localStorage.setItem('ask_vote_history', LongtailID);
                                } else {
                                    vars.localStorage.ask_vote_history = vars.localStorage.getItem('ask_vote_history') + ',' + LongtailID;
                                }
                            }
                        } else {
                            askAlert(data.message);
                        }
                    });
                });
            });

            // 点击赞或者点击踩操作
            $askListBody.on('click', '.c-link,.d-link', function () {
                var $this = $(this);
                var dataId = $this.attr('data-id');
                // 这个回答的id，非用户id，如果点击的是赞按钮存在回答id，则执行赞操作
                if (dataId) {
                    // 判断是赞还是踩
                    var isZan = $this.hasClass('d-link');
                    // 获取问题id
                    var askID = $this.attr('ask_id');
                    // 获取回答用户的id
                    var answerUserID = $this.attr('answer_user_id');
                    // 不登陆,通过localstorage判断是否已经踩赞
                    if (vars.localStorage && vars.localStorage.ask_zan_history && vars.localStorage.ask_zan_history.indexOf(dataId) !== -1) {
                        $this.find('i').html('您已经赞过');
                        $this.addClass('cur');
                        return;
                    }
                    if (vars.localStorage && vars.localStorage.ask_cai_history && vars.localStorage.ask_cai_history.indexOf(dataId) !== -1) {
                        $this.find('i').html('您已经踩过');
                        $this.addClass('cur');
                        return;
                    }
                    var url = vars.askSite + (isZan ? '?c=ask&a=ajaxZan&userid=' : '?c=ask&a=ajaxCai&userid=') + userid + '&answerid=' + dataId + '&askid=' + askID;
                    if (isZan) {
                        url += '&answer_user_id=' + answerUserID;
                    }
                    $.get(url, function (data) {
                        if (data) {
                            if (data.Code === '100') {
                                // 通过正则表达式置换点赞或者点踩的个数
                                var str = $this.html().replace(/<\/i>(.*)/, '</i>' + (isZan ? data.Ding : data.Cai));
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
                            } else if (data.Code === '106') {
                                $this.find('i').html(isZan ? '您已经赞过' : '您已经踩过');
                                $this.addClass('cur');
                            }
                        }
                    });
                }
            });

            /**
             * 右下角立即回答按钮点击操作
             */
            $nowAnswerBtn.on('click', function () {
                if (!userid) {
                    util.login();
                    return;
                }
                window.location.href = vars.askSite + '?c=ask&a=answerRightNow&rewrite&city=' + vars.city + '&id=' + vars.ask_id;
            });
        };
    });