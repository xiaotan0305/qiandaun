/**
 * 付费问答专家主页
 * by chenhongyan
 * 2017.07.12
 */
define('modules/ask/payexperthome', ['jquery', 'lazyload/1.9.1/lazyload', 'loadMore/1.0.1/loadMore', 'weixin/2.0.1/weixinshare'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        // jquery库
        var $ = require('jquery');
        // 文档jquery对象索引
        var $doc = $(document);
        // 从页面获取的参数
        var vars = seajs.data.vars;
        var loadMore = require('loadMore/1.0.1/loadMore');
        //问答内容按钮
        var astTAans = $('.astTAans'),
            payasklist = $('.payasklist');
        //文章内容按钮
        var askart = $('.askart');
        //直播内容按钮
        var askzbbt = $('.askzbbt'),
            askzblist = $('.askzblist');

        /**
         * 为了方便解绑事件，声明一个阻止页面默认事件的函数
         * @param e
         */
        function pdEvent(e) {
            e.preventDefault();
        }

        /**
         * 禁止页面滑动
         */
        function unable() {
            $doc.on('touchmove', pdEvent);
        }

        /**
         * 允许页面滑动
         */
        function enable() {
            $doc.off('touchmove', pdEvent);
        }

        /*图片惰性加载*/
        require('lazyload/1.9.1/lazyload');
        $('.lazyload').lazyload({event: 'scroll click'});

        /*提问须知效果*/
        $(".notice").on("click", function () {
            $(".floatAlert").show();
            unable();
        });
        $(".closeAlert").on("click", function(){
            $(".floatAlert").hide();
            enable();
        });

        /*提示浮层效果实现*/
        function float(tip) {
            var msgFloat = $(".favorite");
            msgFloat.show();
            msgFloat.text(tip);
            setInterval(function () {
                msgFloat.hide();
            }, 3000);
        }
        /*关注的效果实现*/
        var paytaska = $(".paytask a");
        $(".paytask").click(function () {
            if (vars.userid != '') {
                $.ajax({
                    type: "get",
                    async: false,
                    url: "https://mp.fang.com/opencmsJsonp/updateGzCnt.do?userById="+vars.expertFangid+"&passporNo="+vars.userid+"&optType=2&formatType=json&fromType=ask&callbackparam=jsonpCallback",//数据接收后台
                    dataType: "jsonp",
                    jsonpCallback:"jsonpCallback",//自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
                    success: function(json){
                        if (json == '关注成功') {
                            float('关注成功');
                            paytaska.addClass("gray");
                            paytaska.html('<i class="gz"></i>已关注');
                        } else if (json == '取消关注成功') {
                            float('取消关注成功');
                            paytaska.removeClass("gray");
                            paytaska.html('<i class="gz"></i>关注');
                        } else {
                            float('请稍后再试');
                        }
                    },
                    error: function(){
                        float('请稍后再试');
                    }
                });
            } else {
                //如果没有登录，跳转到登录页面
                window.location = vars.loginUrl + "?burl=" + encodeURIComponent(location.href);
            }
        });
        //切换按钮
        $('.askMyTab').on('click', 'a', function() {
            var $that = $(this);
            if (!$that.hasClass('cur')) {
                $that.parent().find('a').removeClass('cur');
                $that.addClass('cur');
                if ($that.hasClass('zhiboid')) {
                    astTAans.hide();
                    payasklist.hide();
                    askart.hide();
                    askzbbt.show();
                    askzblist.show();
                } else if ($that.hasClass('artid')) {
                    astTAans.hide();
                    payasklist.hide();
                    askart.show();
                    askzbbt.hide();
                    askzblist.hide();
                } else {
                    astTAans.show();
                    payasklist.show();
                    askart.hide();
                    askzbbt.hide();
                    askzblist.hide();
                    if (parseInt(vars.totalCount)>20) {
                        $('#display_more').show();
                    }
                }
            }
        })
        /*分页效果实现*/
        loadMore.add({
            // 加载更多接口地址
            url: vars.askSite + "?c=ask&a=ajaxExpertAnswerList&id=" + vars.expertid+'&type=1',
            // 每页加载数据条数
            perPageNum: 20,
            // 总数据条数
            total: parseInt(vars.totalCount),
            // 当前页加载数据条数
            pagesize: 20,
            // 当前加载更多执行所需的元素实例
            activeEl: '#ask_cur',
            // 根据当前加载更多所需元素实例是否存在该类名决定是否启动加载更多操作
            active: 'cur',
            // 加载更多容器的类名或者id或者jquery对象
            content: '#content',
            // 加载更多按钮的类名或者id或者jquery对象
            moreBtn: '#display_more',
            // 提示文案类名或id或者jquery对象
            loadPrompt: '#display_more',
            // 加载中显示文案,'正在加载请稍后'为默认
            loadingTxt: '<a href="javascript:void(0);">努力加载中</a>',
            // 加载完成后显示内容,'加载更多'为默认
            loadedTxt: '<a href="javascript:void(0);">上划加载更多</a>',
            firstDragFlag: false
        });
        /*分页效果实现*/
        loadMore.add({
            // 加载更多接口地址
            url: vars.askSite + "?c=ask&a=ajaxExpertAnswerList&id=" + vars.expertid+'&type=2',
            // 每页加载数据条数
            perPageNum: 20,
            // 总数据条数
            total: parseInt(vars.articleCount),
            // 当前页加载数据条数
            pagesize: 20,
            // 当前加载更多执行所需的元素实例
            activeEl: '#art_cur',
            // 根据当前加载更多所需元素实例是否存在该类名决定是否启动加载更多操作
            active: 'cur',
            // 加载更多容器的类名或者id或者jquery对象
            content: '#artcontent',
            // 加载更多按钮的类名或者id或者jquery对象
            moreBtn: '#art_more',
            // 提示文案类名或id或者jquery对象
            loadPrompt: '#art_more',
            // 加载中显示文案,'正在加载请稍后'为默认
            loadingTxt: '<a href="javascript:void(0);">努力加载中</a>',
            // 加载完成后显示内容,'加载更多'为默认
            loadedTxt: '<a href="javascript:void(0);">上划加载更多</a>',
            firstDragFlag: false
        });
        /*分页效果实现*/
        loadMore.add({
            // 加载更多接口地址
            url: vars.askSite + "?c=ask&a=ajaxExpertAnswerList&id=" + vars.expertid+'&type=3',
            // 每页加载数据条数
            perPageNum: 20,
            // 总数据条数
            total: parseInt(vars.zhiboCount),
            // 当前页加载数据条数
            pagesize: 20,
            // 当前加载更多执行所需的元素实例
            activeEl: '#live_cur',
            // 根据当前加载更多所需元素实例是否存在该类名决定是否启动加载更多操作
            active: 'cur',
            // 加载更多容器的类名或者id或者jquery对象
            content: '#askLivecontent',
            // 加载更多按钮的类名或者id或者jquery对象
            moreBtn: '#live_more',
            // 提示文案类名或id或者jquery对象
            loadPrompt: '#live_more',
            // 加载中显示文案,'正在加载请稍后'为默认
            loadingTxt: '<a href="javascript:void(0);">努力加载中</a>',
            // 加载完成后显示内容,'加载更多'为默认
            loadedTxt: '<a href="javascript:void(0);">上划加载更多</a>',
            firstDragFlag: false
        });
        loadMore.init();
        var Weixin = require('weixin/2.0.1/weixinshare');
        var $shareTitle = '';
        if (vars.totalCount) {
            $shareTitle = vars.expertName + '已经回答了'+ vars.totalCount +'次付费咨询，等你来问~';
        } else {
            $shareTitle = vars.expertName + '已开通「房天下问答」，等你来问~';
        }
        new Weixin({
            // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            debug: false,
            shareTitle: $shareTitle,
            descContent: vars.expertDes,
            lineLink: location.href,
            imgUrl: 'https:' + vars.expertImg,
            // 对调标题 和 描述(微信下分享到朋友圈默认只显示标题,有时需要显示描述则开启此开关,默认关闭)
            swapTitle: false
        });
    };
});