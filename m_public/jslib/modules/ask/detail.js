/**
 * 问答详情页主类
 * by blue
 * 20150916 blue 整理代码，去除冗长代码，提高代码效率，删除单独为本页面写入的点击搜索按钮搜索操作
 */
define('modules/ask/detail', ['jquery', 'util', 'swipe/3.10/swiper', 'lazyload/1.9.1/lazyload', 'modules/ask/yhxw', 'superShare/1.0.1/superShare', 'iscroll/2.0.0/iscroll-lite', 'modules/xf/IcoStar'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        // jquery库
        var $ = require('jquery');
        // 工具类，！！！注意这个返回的是一个对象而不是一个类
        var util = require('util');
        // 获取整个页面包裹的父容器实例，主要作用为事件委托绑定
        // swiper滚动插件类，！！！这里为实例，不需要new创建
        var Swiper = require('swipe/3.10/swiper');
        // 滑动插件
        var scrollCtrl = require('iscroll/2.0.0/iscroll-lite');

        var $main = $('.main');
        var $shownull = $('#shownull');
        // 获取关注按钮实例
        var $guanzhuBtn = $('.sguanzhu');
        // 相关问题下加载更多按钮
        var $xiangguanMoreBtn = $('#show_more_xiangguan');
        // 等我回答下加载更多按钮
        var $waitMeBtn = $('#show_more_waiteme');
        // 是否采纳弹窗实例
        var $cainadisplay = $('#cainadisplay');
        // 页面传入的参数
        var vars = seajs.data.vars;
        //  ！！！这种方式我认为非常不好，所有的合并都是在main中做的判断，增加了很多冗长代码，以后使用冷combo的话会收到很大的影响
        var preload = [];
        // 获取用户id，通过vars的方式
        var userId = vars.user_id;
        // 获取问答的id，通过vars的方式
        var askId = vars.ask_id;
        // 声明采纳的回答id和采纳的回答用户id，用于之后点击弹窗确认采纳后的相关ajax调用
        // 采纳的回答id
        var cainaAnswerId = '';
        // 采纳的回答用户id
        var cainaAnswerUserId = '';
        var $cnxh = $('#cnxh');
        // 免费设计容器
        var sjList = $('.sjList');
        // 一些没有模块化的js异步加载，尽可能的合并非模块化js
        // navflayer_new为导航操作js
        // appdownload为下载app操作js
        // preload.push('navflayer/navflayer_new', 'app/1.0.0/appdownload');
        preload.push('app/1.0.0/appdownload');
        // 异步加载未模块化js
        require.async(preload);
        // 一些不需要初始化的模块
        require('lazyload/1.9.1/lazyload');
        var swipLazy = $('.lazyload'), delay = 0;
        if (swipLazy) {
            swipLazy.lazyload();
            swipLazy.each(function (index, ele) {
                setTimeout(function () {
                    var thisEle = $(ele);
                    if (thisEle.attr('src') !== thisEle.attr('data-original')) {
                        thisEle.attr('src', thisEle.attr('data-original'));
                    }
                }, delay + 20);
            });
        }

        // 用户行为对象
        var yhxw = require('modules/ask/yhxw');
        yhxw({type: 0, pageId: 'mapage'});

        var $doc = $(document);
        var IcoStar = require('modules/xf/IcoStar');

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

        /**
         * 微信分享成功的回调函数
         */
        function callback() {
            $('.share-s3').show();
            $('.icon-nav').css('pointer-events', 'none');
            unable();
        }

        // 点击分享关闭按钮
        $('.close').on('click', function () {
            $('.share-s3').hide();
            $('.icon-nav').css('pointer-events', '');
            enable();
        });

        // 微信分享
        var ua = navigator.userAgent.toLowerCase();
        var weixin;
        if (ua.indexOf('micromessenger') > -1) {
            require.async('weixin/2.0.0/weixinshare', function (Weixin) {
                weixin = new Weixin({
                    debug: false,
                    // 必填，公众号的唯一标识
                    appId: vars.appId,
                    // 必填，生成签名的时间戳
                    timestamp: vars.timestamp,
                    // 必填，生成签名的随机串
                    nonceStr: vars.nonceStr,
                    // 必填，签名，见附录1
                    signature: vars.signature,
                    shareTitle: vars.askTitle,
                    descContent: vars.askTitle,
                    lineLink: location.href,
                    imgUrl: window.location.protocol + vars.public + '201511/images/soufun.jpg'
                }, callback);
            });
        }

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

        // 猜你喜欢-新房二手房，跳转到不同的列表页
        $main.on('click', '.xfesf', function () {
            var $bt = $(this);
            var $li = $bt.parent().next().find('ul li.swiper-slide-active');
            if ($li) {
                if ($li.hasClass('xf')) {
                    window.location.href = vars.siteMain + 'xf/' + vars.encity + '/?from=ask';
                } else if ($li.hasClass('esf')) {
                    window.location.href = vars.siteMain + 'fangjia/bj_list_pinggu/?city=' + vars.encity;
                }
            } else {
                window.location.href = vars.siteMain + 'xf/' + vars.encity + '/?from=ask';
            }
            return false;
        });

        /**
         * 猜你喜欢显示
         */
        function setCaiNiXiHuan() {
            // 本次出现返回的值是浮点型【先暂时加一个容错，进行类型转化】
            if (parseInt(vars.answerCount) > 0 || (vars.answerCount === '0' && vars.guesslike === '1')) {
                $.get(vars.askSite + '?c=ask&a=ajaxCaiNiXiHuan&classId=' + vars.class_id, function (data) {
                    if (data) {
                        $shownull.after(data);
                        // 除了家居猜你喜欢滑动轮播图
                        if ($('#ajaxCnxh').length > 0) {
                            // 解决专题图片高度浏览器不兼容问题
                            var mySwipe = $('#ajaxCnxh');
                            mySwipe.find('.lazyload').lazyload();
                            mySwipe.find('.lazyload').each(function () {
                                var $that = $(this);
                                if ($that.attr('data-original') && $that.attr('src') !== $that.attr('data-original')) {
                                    $that.attr('src', $that.attr('data-original'));
                                }
                            });
                            if (vars.class_id !== '5') {
                                $('.blue_M').css('width', $('.blue_M').find('li').eq(0).width() * 6);
                            } else {
                                $('.blue_M').css('width', $('.blue_M').find('li').eq(0).width() * 5);
                            }
                            // 初始化滑动轮播插件
                            Swiper('#ajaxCnxh', {
                                // 滑动速度
                                speed: 500,
                                // 自动滑动时间间隔
                                autoplay: 3000,
                                // 无限滑动 如果设置为true用户手动滑动后将不会再自动滑动
                                autoplayDisableOnInteraction: false,
                                // 循环滑动
                                loop: true,
                                // 当前滑动块类名
                                wrapperClass: 'blue_M',
                                // 滑动块中每个节点的类名
                                slideClass: 'blue_S',
                                // 导航容器
                                pagination: '#focus_daily',
                                // 单个导航使用的元素名称
                                paginationElement: 'span',
                                // 展示状态类名
                                bulletActiveClass: 'cur'
                            });
                        }
                    }
                });
            }
        }

        // 底部内链导航
        function addSwInfo(id) {
            var points = $('.' + id).find('.pointBox').find('span');
            Swiper('.' + id, {
                // 切换速度
                speed: 500,
                // 循环
                loop: false,
                onSlideChangeStart: function (swiper) {
                    points.eq(swiper.activeIndex).addClass('cur').siblings().removeClass('cur');
                }
            });
        }

        // 初始化导航信息(按钮以及模块内容)
        var navi = $('.typeListB'),
            seoTab = $('.tabNav');
        if (navi.length && seoTab.length) {
            var firstB = $('.overboxIn').find('a').eq(0),
                firId = firstB.attr('data-id');
            firstB.addClass('active');
            $('.' + firId).show();
            addSwInfo(firId);
            // 切换导航部分模块
            seoTab.find('.overboxIn').on('click', 'a', function () {
                var el = $(this),
                    thisId = el.attr('data-id');
                el.addClass('active').siblings().removeClass('active');
                seoTab.nextAll().hide();
                $('.' + thisId).show();
                // 底部导航切换
                addSwInfo(thisId);
            });
        }

        var scroll = require('iscroll/2.0.0/iscroll-lite');
        var jiancaiList = $('#jiancaiList');
        var expertNum = jiancaiList.find('li').length;
        jiancaiList.find('ul').css('width',expertNum * 92 + 'px');
        if (expertNum > 0) {
            var scrollObj = new scroll('#jiancaiList',{
                scrollX:true,
                scrollY:false
            });
        }
        /**
         * 绑定点击事件，点击关注按钮操作
         */
        $guanzhuBtn.on('click', function () {
            // 没有用户id则跳转登陆
            if (!userId) {
                util.login();
                return;
            }
            if ($guanzhuBtn.hasClass('undis')) {
                return;
            }
            // 实现ajax调用
            if (userId === vars.AskUserid) {
                askAlert('不能对自己的问题进行关注');
            } else {
                $.get(vars.askSite + '?c=ask&a=ajaxguanzhu&userid=' + userId + '&askid=' + askId, function (data) {
                    if (data) {
                        // 进行ajax关注成功的样式，直接对关注数加一
                        if (data.code === '100') {
                            $guanzhuBtn.addClass('undis');
                            $guanzhuBtn.text('已关注');
                        } else {
                            askAlert(data.message);
                        }
                    }
                });
            }
            // 统计点击关注
            yhxw({type: 21, pageId: 'mapage'});
        });
        //点评显示内容
        /*var commentmoreone = $('#commentmoreone'),
            commentmoretwo = $('#commentmoretwo'),
            commenttextone = $('#commenttextone'),
            commenttexttwo = $('#commenttexttwo');
        if (commenttextone.height() > 69) {
            commenttextone.css('max-height','69px');
            commentmoreone.show();
        } else {
            commentmoreone.hide();
        }
        if (commenttexttwo.height() > 69) {
            commenttexttwo.css('max-height','69px');
            commentmoretwo.show();
        } else {
            commentmoretwo.hide();
        }
        commentmoreone.on('click', function() {
            commenttextone.css('max-height','none');
            $(this).hide();
        });
        commentmoretwo.on('click', function() {
            commenttexttwo.css('max-height','none');
            $(this).hide();
        });*/

        // 显示更多
        var $showMore = $('#zhankai');
        if ($('.max-h').next().height() > 60) {
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
        $main.on('click', '.askzan,.cai,.cainabtn,.his_ask', function () {
            var $this = $(this);
            var dataId = $this.attr('data-id');
            // 如果点击的时采纳
            if ($this.hasClass('cainabtn')) {
                // 这个回答的id，非用户id
                if (!userId) {
                    util.login();
                    return;
                }
                $cainadisplay.show();
                cainaAnswerId = dataId;
                cainaAnswerUserId = $this.attr('answer_user_id');
            } else if ($this.hasClass('his_ask')) {
                // 如果点击的是用户自己的回答，则跳转到我的回答页面，否则跳转到他人的回答页面
                if (dataId === userId) {
                    window.location.href = vars.askSite + '?c=ask&a=myAsk';
                } else {
                    window.location.href = vars.askSite + '?c=ask&a=hisAsk&type=answer&userid=' + dataId;
                }
            } else if (dataId) {
                // 这个回答的id，非用户id，如果点击的是赞按钮存在回答id，则执行赞操作
                var isZan = $this.hasClass('askzan');
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
                    var url = vars.askSite + (isZan ? '?c=ask&a=ajaxZan&userid=' : '?c=ask&a=ajaxCai&userid=') + userId + '&answerid='
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
                    yhxw({type: 55, pageId: 'mapage', answerId: dataId});
                }
            }
        });
        // 结束关于所有回答的列表的特效
        // 判断是否加载了用户行为ubjs文件，执行猜你喜欢展示
        // 楼盘问题不需要猜你喜欢
        if (parseInt(vars.newCode) === 0) {
            if ('undefined' !== typeof _ub) {
                setCaiNiXiHuan();
            } else {
                require.async('jsub/_ubm.js', function () {
                    setCaiNiXiHuan();
                });
            }
        }
        /**
         * 绑定点击事件，点击是否采纳选择弹窗中的确认按钮时操作
         */
        $cainadisplay.find('#caina_yes').on('click', function () {
            // 实现采纳
            if (!userId) {
                util.login();
                return;
            }
            $.get(vars.askSite + '?c=ask&a=ajaxCaiNa&answerid=' + cainaAnswerId + '&askid=' + askId + '&answeruserid='
                + cainaAnswerUserId, function (dataCopy) {
                if (dataCopy) {
                    if (dataCopy.code === '100') {
                        // 需要进行页面刷新,！！！这里采纳以后刷新页面我觉得不太好，既然使用了ajax，那么应该是能够直接操作元素实现，也可能我理解的不对
                        window.location.reload();
                    } else {
                        askAlert(dataCopy.message);
                    }
                }
            });
        });

        /**
         * 绑定点击事件，点击是否采纳选择弹窗中的取消按钮时操作
         */
        $cainadisplay.find('#caina_no').on('click', function () {
            $cainadisplay.hide();
        });
        // 加载更多的下一页索引
        var pagelist = 2;
        // 获取加载更多按钮jquery实例
        var $showMoreList = $('#show_more_list');

        /**
         * 绑定点击事件，点击加载更多操作
         */
        $showMoreList.on('click', function () {
            if (!vars.sf_source) {
                var url = vars.askSite + '?c=ask&a=ajaxGetMoreAnswers&askid=' + askId + '&page=' + pagelist;
            } else {
                var url = vars.askSite + '?c=ask&a=ajaxGetMoreAnswers&askid=' + askId + '&page=' + pagelist + '&pagesize=' + vars.pagesize + '&sf_source=' + vars.sf_source;
            }
            $.ajax({
                url: url,
                success: function (data) {
                    // 如果数据不为空，则将html字符串加入到更多列表按钮实例前面，并且使下一页索引加一
                    if (data) {
                        //$showMoreList.before(data);
                        $('.ul_answer').append(data);
                        $('.lazyload').lazyload();
                        pagelist++;
                    }
                    // 如果最大页面
                    if (pagelist >= vars.allpage) {
                        $showMoreList.hide();
                        $('#shownull').show();
                    }
                }
            });
        });

        /**
         * 绑定点击事件，当点击相关问题下面的加载更多按钮时操作
         */
        $xiangguanMoreBtn.on('click', function () {
            $('.display_no_xiangguan').show();
            $xiangguanMoreBtn.hide();
        });
        // 异步加载等我回答-hanxiao
        var reg = /^\s*$/;
        $(function () {
            $.get(vars.askSite + '?c=ask&a=ajaxWaitMeAnswer' + '&askid=' + askId + '&tag=' + vars.tag + '&newCode=' + vars.newCode, function (data) {
                if (data !== false && data !== '' && !reg.test(data)) {
                    $('#waitMeTitle').parent().show();
                    $('#waitMeTitle').after(data);
                    /**
                     * 绑定点击事件，当点击等我回答下面的加载更多按钮时操作
                     */
                    var showMoreWaitMe = $main.find('#show_more_waiteme');
                    showMoreWaitMe.on('click', function () {
                        $main.find('.display_no_waiteme').show();
                        showMoreWaitMe.hide();
                    });
                }
            });
        });
        //相关知识加载更多
        var showMorezhishi = $main.find('#show_more_zhishi');
        showMorezhishi.on('click', function () {
            $main.find('.more_display_zhishi').show();
            showMorezhishi.hide();
        });

        /**
         * 绑定点击事件，当点击有人打赏横幅时操作
         */
        $('#xst').on('click', function () {
            // 显示打赏弹窗
            $('.float-shang').show();
        });

        /**
         * 绑定点击事件，当点击打赏弹窗的关闭按钮或者下次再说按钮时操作
         */
        $('.shang-box .close, .shang-box #nextClose').on('click', function () {
            // 隐藏打赏弹窗
            $('.float-shang').hide();
        });
        // app下载功能操作，如果是从百度搜索进入的详情页就不加载APP下载浮层
        if (!vars.is_baidu) {
            require.async('app/1.0.0/appdownload', function ($) {
                $('.shang-box .btn').openApp('');
            });
        }

        // 修改问答0回复页面资讯、知识、导购地址
        var noReply = $('.noReply');
        if (noReply.length > 0) {
            noReply.on('click', function (e) {
                var $that = $(this);
                e.preventDefault();
                var sep = $that.attr('href').indexOf('?') === -1 ? '?' : '&';
                window.location.href = $that.attr('href') + sep + 'from=ask';
            });
        }
        $(function () {
            /**
             * 绑定点击事件，当点击右下角浮动的立即回答时操作
             */
            $('#answer_rightnow').on('click', function () {
                window.location.href = vars.askSite + '?c=ask&a=answerRightNow&city=' + vars.encity + '&id=' + askId;
            });
            /* 分享代码*/
            var SuperShare = require('superShare/1.0.1/superShare');
            //分享按钮
            var config = {
                // 分享的内容title
                title: vars.shareTitle.substring(0, 30) + '...',
                // 分享时的图标
                image: '',
                // 分享内容的详细描述
                desc: vars.shareSummary.substring(0, 64) + '...',
                // 分享的链接地址
                url: location.href,
                // 分享的内容来源
                from: ' —搜房' + vars.cityname + '问答'
            };
            var superShare = new SuperShare(config);
        });

        /**
         *问答为新房、二手房、租房、看房团引流方案
         */
        var relateAsk = $('.relateAsk');
        var getHouses = function (params) {
            if ($.inArray(vars.houseType, ['N', 'E', 'Z']) !== -1 && relateAsk.length) {
                // 如果是楼盘问题，则相关知识改成相关资讯
                var askRelateNews = $('.askRelateNews');
                var relateNewsParams = {};
                relateNewsParams.city = vars.city;
                relateNewsParams.id = vars.ask_id;
                relateNewsParams.answerCount = vars.answerCount;
                relateNewsParams.projname = encodeURIComponent(vars.projname);
                $.get(vars.askSite + '?c=ask&a=ajaxGetRelateNews', relateNewsParams, function (res) {
                    if ($.trim(res)) {
                        askRelateNews.append(res);
                        askRelateNews.show();
                        /**
                         * 绑定点击事件，当点击等我回答下面的加载更多按钮时操作
                         */
                        var showMorerelateMe = $('#show_more_askrelate');
                        showMorerelateMe.on('click', function () {
                            $main.find('.more_display_askrelate').show();
                            showMorerelateMe.hide();
                        });
                    }
                });
            }
            // 如果满足三个条件则插入到第2条后面,看房团引流需要三个条件：1.不是楼盘问题 ；2.所属问答分类为房产交易下的买房准备和看房选房；3.回答数大于等于2
            if (vars.houseType === '' && parseInt(vars.answerCount) >= 2 && (vars.className === '买房准备' || vars.className === '看房选房' ||
                vars.className === '买新房')) {
                $.get(vars.askSite + '?c=ask&a=ajaxGetHouse', params, function (data) {
                    $main.find('.ul_answer>li:eq(1)').after(data);
                });
            }
        };
        var houseParams = {};
        // 楼盘所属城市英文简拼
        houseParams.houseEncity = vars.houseEncity;
        // 楼盘所属城市中文
        houseParams.houseCityName = encodeURIComponent(vars.houseCityName);
        // 城市南北方
        houseParams.houseEncityNS = vars.houseEncityNS;
        // 楼盘类型（'N','E','Z',''）
        houseParams.houseType = vars.houseType;
        // 楼盘编码
        houseParams.newCode = vars.newCode;
        // 如果是新房的话
        if (vars.houseType === 'N') {
            // 该楼盘的价格区间
            houseParams.strPrice = vars.strPrice;
            // 该楼盘所属区县
            houseParams.strDistrict = encodeURIComponent(vars.strDistrict);
        }
        getHouses(houseParams);
        // 加载装修分类下的广告
        if (vars.adFlag === 'true') {
            $.get(vars.askSite + '?c=ask&a=ajaxGetDetailAd&id=' + vars.ask_id, {}, function (data) {
                $('.adBox').html(data);
            });
        }

        /*
         * 给百度官方号页面增加热门分类的滑动效果
         */
         /*热门分类滑动效果*/
        var hotClassUlList = $('#hotClassUlList');
        var hotClassNum = hotClassUlList.find('li').length;
        if (hotClassNum > 0) {
            hotClassUlList.css('width',hotClassNum * 79 + 'px');
            new scrollCtrl('#hotClassList',{
                scrollX:true,
                scrollY:false,
                eventPassthrough: true,
                preventDefault: false
            });
        }
        // 控制星星亮
        var icoStarObj = new IcoStar('.ico-star');
    };
});