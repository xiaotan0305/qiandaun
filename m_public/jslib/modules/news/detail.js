/**
 * 咨询详情页js
 * Created by LXM on 14-12-9.
 * modify by limengyang.bj@fang.com<2016-6-23>
 */
define('modules/news/detail', ['jquery', 'iscroll/2.0.0/iscroll-lite', 'verifycode/1.0.0/verifycode', 
                               'swipe/3.3.1/swiper', 'weixin/2.0.0/weixinshare', 'superShare/1.0.1/superShare',
                               'search/mainSearch', 'search/home/homeSearch'],
    function (require, exports, module) {
        'use strict';
        module.exports = function () {
            var $ = require('jquery');
            var vars = seajs.data.vars;
            var isvalid = parseInt(vars.isvalid);
            var city = vars.city;
            var IScroll = require('iscroll/2.0.0/iscroll-lite');
            var verifycode = require('verifycode/1.0.0/verifycode');
            var Swiper = require('swipe/3.3.1/swiper');

            var district = '';
            var price = '';
            var room = '';
            var name = '';
            var newsId = vars.newsid;
            var newsEditor = vars.newseditor;
            // 已登录情况修改手机号
            var loginInPhone = vars.loginphone;
            var $main = $('.main');
            var $hdBox = $('.hdBox');
            // 提示信息对象
            var $favoritemsg = $('#favoritemsg');
            // 报名框数据变量和对象
            var aid, hbid, newCode, myHongbao, $kftBox, $kftSubmitBtn;
            // 时间戳，防止重复点击
            var lastTime = 0;
            var thisTime = 0;
            // 产业网相关文章点击次数
            var fdcClickNum = 0;

            $('#banner').css('position', 'relative');
            require.async('lazyload/1.9.1/lazyload', function () {
                $('img[data-original]').lazyload();
            });
            var swipeFunc = function (swipeId, swipePoint) {
                var swiperEle = $(swipeId);
                var $imgs = swiperEle.find('img');
                if ($imgs.length > 1) {
                    var $wrap = swiperEle.find('.swipe-wrap');
                    var $slide = swiperEle.find('.swiper-slide').show();
                    var length = $slide.length;
                    var $swipePointList = swiperEle.find('.swipe-point').find(swipePoint);
                    $wrap.css('width', parseInt(swiperEle.css('width'), 10) * (length + 2));
                    new Swiper(swipeId, {
                        loop: true,
                        autoplay: 3000,
                        autoplayDisableOnInteraction: false,
                        speed: 500,
                        autoHeight: true,
                        wrapperClass: 'swipe-wrap',
                        onTransitionEnd: function (swiper) {
                            var index = swiper.activeIndex % length || length;
                            $swipePointList.eq(index - 1).addClass('cur').siblings().removeClass('cur');
                        }
                    });
                }
            };
            // 顶部app下载浮层滑动
            swipeFunc('#topApp', 'span');
            $('.wapToAppInfo').each(function () {
                var $this = $(this);
                var newsnet = $this.attr('data-newsnet');
                var newsType = newsnet === '新房网' ? 11 : '';
                // 判断是否是房产圈
                if (newsType !== 11 && $this.attr('data-creator') === '自媒体联盟') {
                    $this.find('.topAppOpen').openApp({appUrl: 'waptoapp/{"destination":"housecircle","url":"' + $this.attr('data-newsurl') + '"}',position: 'newsDetailTopBtn'});
                } else {
                    $this.find('.topAppOpen').openApp({
                        appUrl: 'waptoapp/{"destination":"daogouandzixun", "specialname":"", "news_type":"' + newsType
                        + '", "news_class":"' + $this.attr('data-newsclass') + '", "news_category":"' + $this.attr('data-newscategory') + '", "groupPicId":"'
                        + $this.attr('data-grouppicid') + '", "news_url":"' + $this.attr('data-newsurl') + '", "news_id":"' + $this.attr('data-newsid')
                        + '", "news_title":"' + '导购' + '", "newsscope":"' + $this.attr('data-newsscope') + '", "isSubject":"true"}',position: 'newsDetailTopBtn'
                    });
                }
            });
            // 头部广告滑动
            swipeFunc('#swiperEle', 'li');
            // 产业网余下全文
            if (vars.channelid === '01' || vars.channelid === '02') {
                // 初始化内容高度
                // 评论高度大于1500,60行
                var $article = $('.fdcarticle');
                var $fdcartmore = $('.fdcartmore');
                if ($article.height() > 1500) {
                    ensureImg('original');
                    // 高度限制
                    $article.addClass('maxH');
                    $fdcartmore.show();
                }
                // 产业网余下全文
                $fdcartmore.on('click', function () {
                    $article.removeClass('maxH');
                    $fdcartmore.hide();
                });

                // 产业网相关文章查看更多
                $('.fdcmorebtn').on('click', function () {
                    // 不是第一次点击
                    if (fdcClickNum > 0) {
                        // 跳到产业网资讯首页
                        window.location.href = vars.fdcSite + 'news/bj/shichang.html';
                    }
                    // 更多文章显示
                    $('.fdcartlist').show();
                    fdcClickNum++;
                });
            } else {
                // 余下全文
                (function () {
                    // 余下全文点击对象
                    var $more = $('.more_zkxq');
                    // 头条及开发平台余下全文
                    if (vars.channelid === '0' || vars.channelid === '03') {
                        var height = parseInt($(window).height(), 10) * 2;
                        var $conWord = vars.channelid === '0' ? $('.conWord') : $('.k-conWord');
                        if (parseInt($conWord.css('height'), 10) > height) {
                            ensureImg('original');
                            $conWord.css({
                                'max-height': height,
                                overflow: 'hidden'
                            });
                            $more.on('click', function () {
                                $more.hide();
                                $conWord.css('max-height', '');
                            }).show();
                        }
                    } else {
                        ensureImg('original');
                        // 其他频道余下全文
                        $more.on('click', function () {
                            $more.hide();
                            $('#conWordMore').show();
                        });
                    }
                })();

                // 其他的相关文章查看更多
                $('#artMoreBtn').on('click', function () {
                    // 更多文章显示
                    $('#artMoreList').show();
                    // 查看更多按钮删除
                    $('#artMoreBtn').hide();
                });
            }
            // toast
            var toast = (function () {
                var time;
                var delay = 2000;
                return function ($toast, $toastText, msg, delayR) {
                    msg && $toastText.text(msg);
                    $toast.show();
                    time && clearTimeout(time);
                    if (delayR >= 0) {
                        time = setTimeout(function () {
                            $toast.hide();
                        }, delayR || delay);
                    }
                };
            })();
            // 收藏
            $('.collect').on('click', (function () {
                var canAjax = true;
                var $toast = $('.showMsg');
                var $toastText = $('.showMsgText');
                return function () {
                    var $this = $(this);
                    if (canAjax && !$this.hasClass('on')) {
                        canAjax = false;
                        $.ajax({
                            url: vars.fdcSite + '?c=fdc&a=ajaxAddFavorite',
                            data: {
                                type: 'news',
                                favId: vars.newsid,
                                fdcNewsTime: vars.fdcNewsTime,
                                newsType: vars.channelid
                            },
                            success: function (res) {
                                if (res === 'tologn') {
                                    location.href = 'https://m.fang.com/passport/login.aspx?burl=' + location.href;
                                } else {
                                    res ? $this.addClass('on').find('p').text('已收藏') : toast($toast, $toastText);
                                }
                            },
                            complete: function () {
                                canAjax = true;
                            }
                        });
                    }
                };
            })());

            // 用户行为统计-埋码
            var page = 'mzxpage';
            require.async('jsub/_vb.js?c=' + page);
            require.async('jsub/_ubm.js', function () {
                yhxw(0);
                if (vars.channelid === '0') {
                    // 处理头条部分推广字样的显示
                    if (window.location.search.indexOf('sf_source=jrtt') > 0) {
                        $('#jrtt').show();
                    }
                    _ub.city = vars.cityname;
                    _ub.request('vwg.business,vmn.position,vmn.avgprice,vmn.genre,vmn.opentime,vme.position,vme.totalprice,vme.housetype,vme.area,vme.genre,vmg.business', function () {
                    	_ub.load(2);
                        // 判断当前新闻是否为全国新闻
                        var paramStr = '&newsid=' + vars.newsid + '&city=' + (window.location.href.indexOf('qg') > 0 ? 'qg' : vars.city);
                        // _ub['vwg.business'] = 'N';
                        switch (_ub['vwg.business']) {
                            case 'N':
                                paramStr += '&type=xf' + '&nPosition=' + decodeURIComponent(_ub['vmn.position']) + '&nAvgprice=' + decodeURIComponent(_ub['vmn.avgprice']) + '&nGenre=' + decodeURIComponent(_ub['vmn.genre']) + '&nOpentime=' + _ub['vmn.opentime'];
                                break;
                            case 'E':
                                paramStr += '&type=esf' + '&ePosition=' + decodeURIComponent(_ub['vme.position']) + '&eTotalprice=' + decodeURIComponent(_ub['vme.totalprice']) + '&eHousetype=' + decodeURIComponent(_ub['vme.housetype']) + '&eArea=' + decodeURIComponent(_ub['vme.area']) + '&eGenre=' + decodeURIComponent(_ub['vme.genre']);
                                break;
                            case 'H':
                                paramStr += '&type=jiaju';
                                break;
                            default:
                                paramStr += '&type=xf' + '&nPosition=' + decodeURIComponent(_ub['vmn.position']) + '&nAvgprice=' + decodeURIComponent(_ub['vmn.avgprice']) + '&nGenre=' + decodeURIComponent(_ub['vmn.genre']) + '&nOpentime=' + _ub['vmn.opentime'];
                                break;

                        }
                        var url = vars.newsSite + '?c=news&a=ajaxGetFavourite' + paramStr;
                        var callback = function (data) {
                            if (data) {
                                var $guess = $('#guess');
                                $guess.html(data);
                                var Search = require('search/home/homeSearch');
                                var search = new Search();
                                search.showPopBtn = '.cainixihuan';
                                search.init();
                                seajs.emit('cacheData');
                                // 猜你喜欢轮播图
                                var $container = $guess.find('.swiper-container');
                                var $wrapper = $guess.find('.swiper-wrapper');
                                var $slide = $guess.find('.swiper-slide');
                                var $swipeTxtList = $guess.find('.swipe-txt').find('li');
                                var $swipePointList = $guess.find('.swipe-point').find('li');
                                var length = $slide.length;

                                $wrapper.css('width', parseInt($container.css('width'), 10) * (length < 2 ? length : length + 2));
                                var slideChange = function (swiper) {
                                    var index = swiper.activeIndex % length || length;
                                    $swipePointList.eq(index - 1).addClass('cur').siblings().removeClass('cur');
                                    $swipeTxtList.eq(index - 1).show().siblings().hide();
                                };
                                new Swiper('.swiper-container', {
                                    // 切换速度
                                    speed: 500,
                                    // 循环
                                    loop: true,
                                    onSlideChangeEnd: slideChange
                                });
                            }
                        };
                        $.get(url, callback);
                    });
                }
            });

            // 若有余下全文会导致lazyload不准确
            function ensureImg(attrProp) {
                var imgs = $('img[data-' + attrProp + ']');
                imgs.each(function () {
                    var $this = $(this);
                    $this.is(':visible') && $this.attr('src', $this.data(attrProp));
                });
            }

            function yhxw(type) {
                _ub.city = vars.cityname;
                // 业务---资讯
                _ub.biz = 'i';
                // 方位（南北方) ，北方为0，南方为1
                var ns = vars.ns === 'n' ? 0 : 1;
                _ub.location = ns;
                // 用户动作（浏览0）
                var b = type;
                var channel = vars.channel;
                var pTemp = {
                    'vmi.infocategory': encodeURIComponent(channel),
                    'vmi.city': encodeURIComponent(vars.cityname),
                    'vmg.page': page,
                    'vmi.newsid': newsId,
                    'vmi.name': vars.username,
                    'vmi.mail': vars.email,
                    'vmi.phone': vars.loginphone
                };
                var p = {};
                // 若p_temp中属性为空或者无效，则不传入p中
                for (var temp in pTemp) {
                    if (pTemp[temp]) {
                        p[temp] = pTemp[temp];
                    }
                }
                // 用户行为(格式：'字段编号':'值')
                // 收集方法
                _ub.collect(b, p);
            }

            // 获取产业网收藏状态
            var checkFavorite = function () {
                $.ajax({
                    url: vars.fdcSite + '?c=fdc&a=ajaxCheckFavorite',
                    data: {
                        newsId: newsId,
                        channelid: vars.channelid,
                        fdcNewsTime: vars.fdcNewsTime
                    },
                    success: function (res) {
                        if (res) {
                            $('.collect').addClass('on').find('p').text('已收藏');
                        }
                    }
                });
            };

            // ajax标识
            var inAjax = false;
            // 显示提示信息,flag赞踩标识（0=查看，-1=踩，1=赞）
            var ajaxZanCai = function (flag) {
                var url = vars.newsSite + '?c=news&a=ajaxNewsZanCai&newsid=' + newsId + '&flag=' + flag + '&r=' + Math.random();
                $.get(url, function (data) {
                    // 查到数据
                    if (data && data.state === '100') {
                        // 赞踩用户行为统计（资讯，产业，房产圈）,排除0的查询
                        if (flag === '1') {
                            yhxw(55);
                        } else if (flag === '-1') {
                            yhxw(56);
                        }
                        // 产业网赞踩特殊处理
                        if (vars.channelid === '01' || vars.channelid === '02') {
                            // 按钮都变黑
                            $('.zancaibtn').addClass('on');
                        } else {
                            // 赞踩的数量
                            var favNum = +data.item.zancount;
                            var hatNum = +data.item.caicount;
                            if (vars.channelid === '03') { // 资讯开放平台没有对比条
                                // 显示的数量
                                $('.ding span').text(favNum);
                                $('.cai span').text(hatNum);
                            } else {
                                var $rate = $('.vote-line').find('span');
                                // 百分比对象
                                var $fav = $rate.eq(0);
                                var $hat = $rate.eq(1);
                                // 对比条
                                $fav.css('width', favNum / (favNum + hatNum) * 100 + '%');
                                $hat.css('width', hatNum / (favNum + hatNum) * 100 + '%');
                                // 显示的数量
                                $('.ding em').text(favNum);
                                $('.cai em').text(hatNum);
                            }

                            // 赞踩成功按钮不能再点
                            if (flag !== '0') {
                                $('.zancaibtn').off('click');
                            }
                        }
                    }
                }).complete(function () {
                    inAjax = false;
                });
            };
            // 产业网处理
            if (vars.channelid === '01' || vars.channelid === '02') {
                // 产业网收藏判断
                checkFavorite();
            } else {
                // 资讯赞踩数量ajax获取
                ajaxZanCai('0');
            }

            // 点赞点踩
            $('.zancaibtn').on('click', function () {
                if (!inAjax) {
                    inAjax = true;
                    var $this = $(this);
                    // 赞踩标识，1=赞，-1=踩
                    var flag = $this.attr('data-flag');
                    if (newsId && flag) {
                        ajaxZanCai(flag);
                    }
                }
            });

            // 浮动菜单
            var $oMore = $('.option-more');
            $('.option-cont').on('click', function () {
                var $that = $(this);
                $that.toggleClass('option-plus-active');
                $oMore.toggleClass('option-panel-active');
            });
            // 跳转地址 到对应频道列表页
            var jump = '';
            switch (vars.channelid) {
                case '0':
                    jump = 'top';
                    break;
                case '13202':
                    jump = 'esf';
                    break;
                case '12188':
                    jump = 'daogou';
                    break;
                case '201311801':
                    jump = 'jiaju';
                    break;
                case '201311790':
                    jump = 'zf';
                    break;
            }
            jump = vars.newsSite + vars.city + '/' + jump + '.html';
            // 浮动菜单中的a标签事件
            $oMore.on('click', 'a', function () {
                var me = $(this);
                switch (me.index()) {
                    case 0:
                        // 列表首页事件
                        me.attr('href', jump);
                        break;
                    case 1:
                        // 顶部点击事件
                        $('body').animate({
                            scrollTop: 0
                        }, 200);
                        break;
                }
            });
            // 可以有评论的头条页
            if (vars.channelid === '0') {
                // 回复
                $('.option-cont-post a').on('click', function () {
                    yhxw(16);
                    window.location.href = vars.newsSite + '?c=news&a=replyPost&masterId='
                        + vars.masterId + '&channelid=' + vars.channelid + '&newsid=' + newsId;
                });
                // 加载评论
                var pageUrl = vars.newsSite + '?c=news&a=ajaxGetComment&masterId=' + vars.masterId + '&sign=' + vars.sign;
                $.get(pageUrl).done(function (data) {
                    if (data instanceof Object && data.content && data.totalCount) {
                        $('#comment').append(data.content).show().find('.lazyload').lazyload();
                        var totalCount = data.totalCount;
                        $('.totalCount').append('<span class="pl">' + totalCount + '条评论</span>').show();
                        // 评论加载更多功能
                        if (totalCount > 5) {
                            $('#drag').show();
                            require.async(['loadMore/1.0.0/loadMore'], function (loadMore) {
                                loadMore({
                                    // 数据总条数
                                    total: totalCount,
                                    // 首屏显示数据条数
                                    pagesize: 5,
                                    // 单页加载条数
                                    pageNumber: 5,
                                    // 是否需要第一次上拉到底后不加载更多，第二次后才加载更多，可为空，默认为true
                                    firstDragFlag: false,
                                    // 加载更多按钮id
                                    moreBtnID: '#drag',
                                    // 是否需要上拉加载更多功能即是否需要scroll事件监听，可为空，默认为true
                                    isScroll: true,
                                    // 加载数据过程显示提示id
                                    loadPromptID: '.draginner',
                                    // 数据加载过来的html字符串容器
                                    contentID: '#comment',
                                    // 加载前显示内容
                                    loadAgoTxt: '查看更多',
                                    // 加载中显示内容
                                    loadingTxt: '正在加载请稍候',
                                    // 加载完成后显示内容
                                    loadedTxt: '查看更多',
                                    // 接口地址
                                    url: pageUrl
                                });
                            });
                        }
                    }
                });
            }

            // 显示提示信息
            var showPrompt = function (msg) {
                $favoritemsg.html(msg).show();
                // 延时隐藏
                setTimeout(function () {
                    $favoritemsg.hide();
                }, 1000);
            };

            /**
             * @file 咨询导购详情页 帮你找房、红包、团购
             * @author fcwang(wangfengchao@fang.com)
             */
                // 检测手机号格式(参数是手机号)
            var checkPhone = function (phone) {
                    if (!phone) {
                        showPrompt('请输入手机号');
                        // 手机号格式状态为正确
                    } else if (/^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/.test(phone)) {
                        return true;
                    } else {
                        // 手机号格式状态为错误
                        showPrompt('请输入正确的手机号');
                    }
                    return false;
                };
            // 检测验证码格式（参数是验证码）
            var checkCode = function (code) {
                if (!code) {
                    showPrompt('请输入验证码');
                    // 验证码格式状态为正确
                } else if (/^[0-9]{4}$/.test(code)) {
                    return true;
                } else {
                    // 验证码格式状态为错误
                    showPrompt('请输入四位验证码');
                }
                return false;
            };
            //  检测报名人数
            var checkNum = function (num) {
                var partten = /^\d+$/;
                if (!num) {
                    showPrompt('报名人数不能为空');
                    return false;
                } else if (!partten.test(num) || parseInt(num) < 1 || parseInt(num) > 99) {
                    showPrompt('请输入正确的报名人数(1-99)');
                    return false;
                }
                return true;
            };
            // 检验姓名
            var checkMyName = function (nameVal) {
                if (!nameVal) {
                    showPrompt('请输入您的姓名');
                    return false;
                }
                return true;
            };
            // 检验红包规则协议
            var checkHb = function (type) {
                // 渠道红包
                if (type === 'quDaoHb' && $('.checkValue1').is(':checked')) {
                    // 确定可点
                    return true;
                    // 平台红包
                } else if (type === 'pingTaiHb' && $('.checkValue2').is(':checked') && $('.checkValue3').is(':checked')) {
                    // 确定可点
                    return true;
                }
                // 显示提示
                showPrompt('请阅读并同意规则或协议');
                return false;
            };
            // 领取红包方法,obj=红包确定按钮
            var getHongbao = function (obj) {
                // 红包类型
                var type = obj.parents('.tz-box').attr('id');
                // 渠道红包
                if (type === 'quDaoHb') {
                    $.get(vars.newsSite + '?c=news&a=getChannelHb&aid=' + aid + '&hbid=' + hbid + '&newsid=' + newsId + '&newseditor=' + newsEditor + '&city=' + city + '&PageURL=' + encodeURIComponent(window.location.href), function (data) {
                        // 有返回值
                        if (data) {
                            // 领取过和领取成功都返回100
                            if (data.resultCode === '100' && data.resultMsg === '领取成功') {
                                showPrompt('恭喜您，领取成功！');
                                myHongbao.addClass('used');
                            } else {
                                showPrompt(data.resultMsg);
                                myHongbao.addClass('used');
                            }
                        } else {
                            showPrompt('红包领取失败');
                        }
                    });
                    // 平台红包
                } else {
                    $.get(vars.newsSite + '?c=news&a=getPlatformHb&newcode=' + newCode + '&newsid=' + newsId + '&newseditor=' + newsEditor + '&city=' + city + '&PageURL=' + encodeURIComponent(window.location.href), function (data) {
                        // 有返回值
                        if (data) {
                            if (data.Result === '100') {
                                showPrompt('恭喜您，领取成功！');
                                myHongbao.addClass('used');
                            } else {
                                showPrompt(data.Message);
                                myHongbao.addClass('used');
                            }
                        } else {
                            showPrompt('红包领取失败');
                        }
                    });
                }
                // 完事隐藏弹框
                $('#quDaoHb, #pingTaiHb').hide();
            };

            // 点击红包
            $('.hbClick').on('click', function () {
                // 当前时间
                thisTime = new Date().getTime();
                // 500毫秒点击一次
                if (thisTime - 500 < lastTime) {
                    return;
                }
                // 走ajax方法的当前时间
                lastTime = new Date().getTime();
                var $that = $(this);
                myHongbao = $that.parent();
                // 如果红包还没领
                if (!myHongbao.hasClass('used')) {
                    var $quDaoHb = $('#quDaoHb');
                    var $pingTaiHb = $('#pingTaiHb');
                    aid = $that.attr('data-aid');
                    hbid = $that.attr('data-hbid');
                    // 平台红包报名需要参数
                    newCode = $that.attr('data-newcode');
                    // 已经登陆了，直接领
                    if (loginInPhone) {
                        // 渠道红包
                        if ($that.attr('data-hbtype') === 'qudao') {
                            getHongbao($quDaoHb.find('.submitBtn'));
                            // 平台红包
                        } else {
                            getHongbao($pingTaiHb.find('.submitBtn'));
                        }
                        // 没登录，弹出弹框，渠道红包
                    } else if ($that.attr('data-hbtype') === 'qudao') {
                        $quDaoHb.show();
                        // 弹出弹框，平台红包
                    } else {
                        $pingTaiHb.show();
                    }
                }
            });
            // ajax加载报名框后，绑定click事件
            var mainBoxClick = function () {
                // 看房团多线路
                $('#chooseKftLine').on('click', function () {
                    unable();
                    // 显示选择框
                    $('#kftLine').show();
                    new IScroll('#kftLineDiv');
                });
                // 看房团多线路点击
                $('#kftLineDiv').on('click', 'li', function () {
                    var $that = $(this);
                    // 表单内容修改
                    $('#chooseKftLine').find('span').html($that.attr('data-linename'));
                    // 记录数据到报名按钮
                    $kftSubmitBtn.attr({
                        'data-lookhouseid': $that.attr('data-lookhouseid'),
                        'data-lineid': $that.attr('data-lineid')
                    });
                    enable();
                    // 隐藏选择框
                    $('.sf-maskFixed').hide();
                });
                // 看房团取消按钮
                $('.kftLineOff').on('click', function () {
                    // 隐藏报名框
                    $kftBox.hide();
                });
                // 点击取消按钮，隐藏弹框
                $('.hbOff').on('click', function () {
                    $('#quDaoHb, #pingTaiHb').hide();
                });
            };

            // 底部弹框点击取消按钮,看房团，一键购房加载时间不同，只能在main下
            $main.on('click', '.backBtn', function () {
                enable();
                // 隐藏选择框
                $('.sf-maskFixed').hide();
            });
            // 导购频道=12188 导购红包，看房团报名框数据添加
            if (vars.channelid === '12188') {
                $.ajax({
                    url: vars.newsSite + '?c=news&a=ajaxGetMoreInfo&city=' + city,
                    data: {
                        type: 'signBox'
                    },
                    success: function (data) {
                        // 有返回值
                        if (data) {
                            $main.append(data);
                            // 看房团多线路报名框
                            $kftBox = $('#kftBox');
                            // 看房团报名框报名按钮
                            $kftSubmitBtn = $kftBox.find('.submitBtn');
                            // 绑定事件
                            mainBoxClick();
                        }
                    }
                });
            }

            // ajax加载类型
            var moreType = '';
            // ajax标识，防止点击多次插入多次
            var ajaxCount = 0;
            // 点击显示更多的小箭头
            $hdBox.on('click', '.btn-more', function () {
                var $that = $(this);
                // 报名框的最外层div
                var $hdBoxDiv = $that.parents('.hdBox');
                // 已经显示的情况
                if ($that.hasClass('up')) {
                    // 小箭头指示变为向下
                    $that.removeClass('up');
                    // 收起更多内容
                    $hdBoxDiv.find('.hdCon').hide();
                } else if ($hdBoxDiv.find('.hdCon').length > 0) {
                    // 小箭头指示变为向上
                    $that.addClass('up');
                    // 显示更多内容
                    $hdBoxDiv.find('.hdCon').show();
                } else {
                    // 点击展示更多的类型
                    moreType = $that.attr('data-type');
                    // 一键发布购房信息,团购，ajax标识=0
                    if (moreType && !ajaxCount) {
                        // ajax标识加1
                        ajaxCount = 1;
                        // ajax传入变量
                        var jsondata = {
                            type: moreType,
                            newCode: $that.attr('data-newcode'),
                            newCodeName: $that.attr('data-loupanname'),
                            lookhouseid: $that.attr('data-lookhouseid'),
                            lineid: $that.attr('data-lineid'),
                            feature1: $that.attr('data-feature1'),
                            feature2: $that.attr('data-feature2'),
                            feature3: $that.attr('data-feature3'),
                            kftline: $that.attr('data-line')
                        };
                        $.ajax({
                            url: vars.newsSite + '?c=news&a=ajaxGetMoreInfo&city=' + city,
                            data: jsondata,
                            success: function (data) {
                                // 有返回值
                                if (data) {
                                    // 看房团多线路
                                    if (moreType === 'kftLine') {
                                        // 多线路数据替换
                                        $('.kft-line').html(data);
                                        var dataTime = $that.attr('data-datatime');
                                        // 报名框标题
                                        $kftBox.find('.tz-tit span').text(dataTime + '看房团');
                                        // 线路数据清空
                                        $('#chooseKftLine span').text('请选择意向路线');
                                        $kftBox.find('.nameInput, .numInput, .codeInput').val('');
                                        $kftSubmitBtn.attr({
                                            'data-lookhouseid': '',
                                            'data-lineid': ''
                                        });
                                        // 看房团手机号输入框
                                        var $kftPhoneInput = $kftBox.find('.phoneInput');
                                        $kftPhoneInput.val(loginInPhone);
                                        // 手机号输入事件判断一次
                                        $kftPhoneInput.trigger('input');
                                        // 多线路报名框显示
                                        $kftBox.show();
                                    } else {
                                        // 返回的数据添加到标签里面
                                        $hdBoxDiv.append(data);
                                        // 小箭头指示变为向上
                                        $that.addClass('up');
                                    }
                                }
                            }
                        }).always(function () {
                            // ajax标识恢复
                            ajaxCount = 0;
                        });
                    }
                }
            });

            // 限制验证码只能输入4位（帮你找房 红包 团购,看房团）
            $main.on('input', '.codeInput', function () {
                var $that = $(this);
                // 去除非数字
                $that.val($that.val().replace(/[^\d]/g, ''));
                // 只取输入的前4位
                if ($that.val().length > 4) {
                    $that.val($that.val().substr(0, 4));
                }
            });

            // 60秒倒计时
            var wait = 60;

            function time(obj) {
                // 倒计时归零的时候，修改发送验证码按钮样式和文字，wait重置为60
                if (wait === 0) {
                    obj.val('发送验证码').addClass('active').css({
                        'background-color': '#ffffff',
                        color: '#ff6666',
                        border: '1px solid #ff6666'
                    });
                    wait = 60;
                    // 倒计时非零的时候，修改发送验证码按钮样式和文字，修改文字样式，wait-1，隔一秒执行一次
                } else {
                    obj.val('重新发送(' + wait + ')').removeClass('active').css({
                        'background-color': '#b3b6be',
                        color: '#ffffff',
                        border: '1px solid #b3b6be'
                    });
                    wait--;
                    setTimeout(function () {
                        time(obj);
                    }, 1000);
                }
            }

            /* 帮你买房start*/
            // 阻止页面滑动
            function unable() {
                document.addEventListener('touchmove', preventDefault);
            }

            function preventDefault(e) {
                e.preventDefault();
            }

            // 取消阻止页面滑动
            function enable() {
                document.removeEventListener('touchmove', preventDefault);
            }

            // 点击有意区域
            $hdBox.on('click', '#fangDistrict', function () {
                unable();
                // 显示选择框
                $('#district').show();
                new IScroll('#districtDiv');
            });
            // 点击选项
            $hdBox.on('click', '#districtDiv li', function () {
                var $that = $(this);
                // 表单内容修改
                $('#fangDistrict').html($that.html());
                // 记录数据
                district = $that.html();
                enable();
                // 隐藏选择框
                $('.sf-maskFixed').hide();
            });

            // 意向户型
            $hdBox.on('click', '#fangRoom', function () {
                unable();
                // 显示选择框
                $('#room').show();
                new IScroll('#roomDiv');
            });
            // 点击选项
            $hdBox.on('click', '#roomDiv li', function () {
                var $that = $(this);
                // 表单内容修改
                $('#fangRoom').html($that.html());
                // 记录数据
                room = $that.attr('data-room');
                enable();
                // 隐藏选择框
                $('.sf-maskFixed').hide();
            });

            // 预算总价
            $hdBox.on('click', '#fangPrice', function () {
                unable();
                // 显示选择框
                $('#price').show();
                new IScroll('#priceDiv');
            });
            // 点击选项
            $hdBox.on('click', '#priceDiv li', function () {
                var $that = $(this);
                // 表单内容修改
                $('#fangPrice').html($that.html());
                // 记录数据
                price = $that.attr('data-price');
                enable();
                // 隐藏选择框
                $('.sf-maskFixed').hide();
            });

            // 发送验证码按钮添加事件
            $main.on('click', '.codeSendBtn', function () {
                var $that = $(this);
                var phoneVal = $that.siblings('input').val();
                // 如果手机号格式正确且发送按钮可用
                if (checkPhone(phoneVal) && wait === 60) {
                    // 请求获取验证码
                    verifycode.getPhoneVerifyCode(phoneVal,
                        // 发送成功
                        function () {
                            time($that);
                        },
                        // 发送失败
                        function () {
                        });
                }
            });

            // 登录情况下提交表单内容的方法
            var postInput = function (obj) {
                // 检验姓名合法时
                name = $('#fangName').val();
                if (checkMyName(name)) {
                    var jsondata = {
                        district: district,
                        room: room,
                        price: price,
                        name: name,
                        newsId: newsId,
                        newsEditor: newsEditor,
                        behaviorId: 172,
                        source: 67
                    };
                    $.post(vars.mySite + '?c=mycenter&a=ajaxAddXfFindFang&city=' + city + '&PageURL=' + encodeURIComponent(window.location.href), jsondata, function (data) {
                        // 有返回值
                        if (data) {
                            // 发布成功
                            if (data.code === '100') {
                                showPrompt('提交成功');
                                // 小箭头指示变为向下
                                obj.parents('.hdBox').eq(0).find('.btn-more').removeClass('up');
                                // 收起更多内容
                                obj.parents('.hdBox').eq(0).find('.hdCon').hide();
                                // 一分钟之内重复提交
                            } else {
                                showPrompt(data.error);
                            }
                            // 发布失败
                        } else {
                            showPrompt('提交失败');
                        }
                    });
                }
            };

            // 立即报名方法（参数是立即报名按钮jquery对象）
            var lijibaoming = function (obj) {
                var jsondata = {
                    newcode: obj.attr('data-newcode'),
                    projname: encodeURIComponent(obj.attr('data-loupanname')),
                    newsid: newsId,
                    newseditor: newsEditor,
                    city: city,
                    PageURL: window.location.href
                };
                $.post(vars.newsSite + '?c=news&a=ajaxTgSignUp&city=' + city, jsondata, function (data) {
                    // 有返回值
                    if (data) {
                        // 成功
                        if (data.Result === '1') {
                            showPrompt('团购报名成功');
                            // 小箭头指示变为向下
                            obj.parents('.hdBox').find('.btn-more').removeClass('up');
                            // 收起更多内容
                            obj.parents('.hdBox').find('.hdCon').hide();
                        } else {
                            showPrompt(data.Message);
                        }
                    } else {
                        showPrompt('团购报名失败');
                    }
                });
            };
            // 看房团报名方法
            var kftBaoMing = function (obj) {
                var $parentUl = obj.parent().siblings('ul');
                // 报名人数
                var kftName = $parentUl.find('.nameInput').val();
                var kftNum = $parentUl.find('.numInput').val();
                var kftLookHouseID = obj.attr('data-lookhouseid');
                var LineID = obj.attr('data-lineid');
                var kftSubmit = obj.attr('data-submit');
                // 报名人数，姓名验证,有看房id和线路id
                if (checkNum(kftNum) && checkMyName(kftName) && kftLookHouseID && LineID) {
                    var jsondata = {
                        username: encodeURIComponent(kftName),
                        peoplecount: parseInt(kftNum),
                        phone: loginInPhone,
                        code: '',
                        LookHouseID: kftLookHouseID,
                        LineID: LineID,
                        city: city,
                        newsid: newsId,
                        newseditor: newsEditor,
                        action: vars.action,
                        url: window.location.href,
                        PageURL: encodeURIComponent(window.location.href)
                    };
                    var ajaxUrl = vars.kanfangtuanSite + '?c=kanfangtuan&a=getKanInfo&r=' + Math.random();

                    $.get(ajaxUrl, jsondata, function (data) {
                        var result = data.baomingMsg.Result;
                        var message = decodeURIComponent(data.baomingMsg.Message);
                        var loginres = data.userlogin;
                        // -9=看房团已经结束,1=报名成功，-10=已报名过同一时间其他路线，-8=已报名该路线,-9=看房团已结束
                        if (loginres && (result === '1' || result === '-8' || result === '-10' || result === '-9')) {
                            showPrompt(message);
                            // 多线路报名框
                            if (kftSubmit === 'kftLine') {
                                // 隐藏报名框
                                $kftBox.hide();
                                // 隐藏选择框
                                $('.sf-maskFixed').hide();
                            } else {
                                // 小箭头指示变为向下
                                obj.parents('.hdBox').find('.btn-more').removeClass('up');
                                // 收起更多内容
                                obj.parents('.hdBox').find('.hdCon').hide();
                            }
                        } else {
                            showPrompt('报名失败');
                        }
                    });
                }
            };

            // 点击报名按钮
            $main.on('click', '.submitBtn', function () {
                // 当前时间
                thisTime = new Date().getTime();
                // 500毫秒点击一次
                if (thisTime - 500 < lastTime) {
                    return;
                }
                // 走ajax方法的当前时间
                lastTime = new Date().getTime();
                var $that = $(this);
                var dataSub = $that.attr('data-submit');
                // 报名的方法
                var subAction;
                switch (dataSub) {
                    case 'tuanGou':
                        // 团购报名方法
                        subAction = lijibaoming;
                        break;
                    case 'findFang':
                        // 一键购房报名方法
                        subAction = postInput;
                        break;
                    case 'hongBao':
                        // 红包报名方法
                        subAction = getHongbao;
                        // 红包类型
                        var hbType = $that.parents('.tz-box').attr('id');
                        // 检测红包规则协议协议
                        if (!checkHb(hbType)) {
                            return;
                        }
                        break;
                    case 'kanFangTuan':
                        // 看房团报名方法
                        subAction = kftBaoMing;
                        break;
                    case 'kftLine':
                        // 看房团报名方法
                        subAction = kftBaoMing;
                        // 是否选择了线路
                        if ($('.placeholder').text() === '请选择意向路线') {
                            showPrompt('请选择线路');
                            return;
                        }
                        break;
                }
                // 有报名方法
                if (subAction) {
                    var $parentUl = $that.parent().siblings('ul');
                    // 手机号输入事件判断一次
                    $parentUl.find('.phoneInput').trigger('input');

                    // 如果非 登录且绑定手机号
                    if (isvalid !== 1) {
                        var phoneVal = $parentUl.find('.phoneInput').val();
                        var codeVal = $parentUl.find('.codeInput').val();
                        // 检测手机号验证码均合法时
                        if (checkPhone(phoneVal) && checkCode(codeVal)) {
                            // 验证验证码是否正确
                            verifycode.sendVerifyCodeAnswer(phoneVal, codeVal,
                                // 正确执行立即报名方法
                                function () {
                                    // 手机号重新赋值
                                    loginInPhone = phoneVal;
                                    subAction($that);
                                },
                                // 不正确执行如下
                                function () {
                                    showPrompt('验证码错误，请重新输入');
                                });
                        }
                        // 已登录并且绑定手机号的情况，执行立即报名方法
                    } else {
                        subAction($that);
                    }
                }
            });

            /* 红包start*/
            // 点击展开更多红包
            $('.moreStyle').on('click', function () {
                var $that = $(this);
                var $hbSpan = $that.find('span');
                // 已经显示的情况
                if ($hbSpan.hasClass('up')) {
                    $hbSpan.removeClass('up');
                    $hbSpan.text('展开更多红包');
                    // 显示更多红包
                    $that.siblings('.hb-list').css('max-height', '85px');
                } else {
                    $hbSpan.addClass('up');
                    $hbSpan.text('收起更多红包');
                    // 收起更多红包
                    $that.siblings('.hb-list').css('max-height', '500px');
                }
            });

            // 手机号输入
            $main.on('input', '.phoneInput', function () {
                var $that = $(this);
                // 去除非数字
                $that.val($that.val().replace(/[^\d]/g, ''));
                // 只取输入的前11位
                if ($that.val().length > 11) {
                    $that.val($that.val().substr(0, 11));
                }
                // 手机号和登录的手机号一致时，验证码按钮和验证码输入框隐藏起来
                // 输入的手机号
                var phoneVal = $that.val();
                // 发送验证码框
                var $input = $that.siblings('input');
                // 验证码li标签
                var $codeShowCheck = $that.parents('ul').find('.codeShowCheck');
                if (phoneVal && phoneVal === loginInPhone) {
                    // 发送验证码框隐藏
                    $input.hide();
                    // 验证码li标签隐藏
                    $codeShowCheck.hide();
                    isvalid = 1;
                    // 否则，显示验证码按钮和验证码输入框，设为非登录绑定状态
                } else {
                    $input.show();
                    $codeShowCheck.show();
                    isvalid = 0;
                }
            });

            /* 红包end*/
            // 存在热门推荐，添加横向滑动
            if ($('.xqFav').length > 0) {
                (function () {
                    var $recommend = $('.recommend');
                    var width = 0;
                    var $recommendList = $recommend.find('li');
                    var len = $recommendList.length;
                    var $firstRec = $recommendList.eq(0);
                    for (var i = 0; i < len; i++) {
                        width += parseInt($recommendList.eq(i).css('width'), 10);
                    }
                    width += (len + 1) * (parseInt($firstRec.css('margin-left'), 10) + parseInt($firstRec.css('margin-right'), 10));
                    $recommend.find('ul').css('width', width);
                    new IScroll('.recommend', {
                        scrollY: false,
                        scrollX: true,
                        bindToWrapper: true,
                        // 是否使图表上的竖直方向的默认滚动事件生效
                        eventPassthrough: true
                    });
                })();
            }

            // 微信分享配置
            var imgUrl = '', imgs = $('.shareImg');
            if (imgs.length) {
                imgUrl = location.protocol + imgs.attr('src');
            } else {
                imgs = vars.channelid === '03' ? $('.k-conWord').find('img') : $('.mainContent').find('img');
                if (!imgUrl) {
                    for (var i = 0, len = imgs.length; i < len; i++) {
                        if (+imgs.eq(i).attr('img-width') > 300 && +imgs.eq(i).attr('img-height') > 300) {
                            imgUrl = location.protocol + imgs.eq(i).attr('data-original');
                            break;
                        }
                    }
                }
                !imgUrl && (imgUrl = location.protocol + vars.public + '201511/images/newsImg_' + (vars.channelid === '01' ? '02' : vars.channelid) + '.jpg');
            }
            var description = vars.description || '把脉房地产市场、实时追踪政策动向、捕捉最新商业趋势，海量资讯尽在房天下。';
            // 不赋值默认为当前地址
            var linkUrl;
            // 分享
            (function () {
                var superShare = require('superShare/1.0.1/superShare');
                var wxShare = require('weixin/2.0.0/weixinshare');
                var toggleTouchmove = (function () {
                    function preventDefault(e) {
                        e.preventDefault();
                    }

                    return function (unable) {
                        document[unable ? 'addEventListener' : 'removeEventListener']('touchmove', preventDefault);
                    };
                })();
                new superShare({
                    url: linkUrl,
                    title: vars.title,
                    desc: description,
                    image: imgUrl
                });
                new wxShare({
                    debug: false,
                    shareTitle: vars.title,
                    descContent: description,
                    lineLink: linkUrl,
                    imgUrl: imgUrl
                }, (function () {
                    var $share = $('.share-s3');
                    $share.on('click', '.close', function () {
                        $share.hide();
                        toggleTouchmove();
                    });
                    return function () {
                        $.ajax({
                            url: vars.newsSite + '?c=news&a=ajaxWinXinShare' + '&city=' + (vars.channelid === '0' && window.location.href.indexOf('qg') > 0 ? 'qg' : vars.city) + '&channelid=' + vars.channelid + '&newsid=' + vars.newsid + '&keyword=' + vars.keyword,
                            success: function (html) {
                                if (html) {
                                    // 分享的用户行为统计（资讯，产业，房产圈）
                                    yhxw(22);
                                    $share.html(html).show();
                                    toggleTouchmove(1);
                                }
                            }
                        });
                    };
                })());
                $('.share').on('click', function () {
                    // 分享的用户行为统计（资讯，产业，房产圈）,因为无法分享成功后添加，再点击弹框处添加
                    yhxw(22);
                    $('.option-cont').removeClass('option-plus-active');
                    $('.option-more').removeClass('option-panel-active');
                });
            })();

            // 新房电商 begin
            // 关闭底部弹窗
            $('.lp-hd-out').on('click', function (e) {
                var className = e.target.className;
                if (className === 'lp-hd-out' || className === 'close-btn') {
                    $('.lp-hd-out').hide();
                }
                enable();
            });
            var scroll = null;
            // 点击优惠券
            $('.youhui').on('click', function () {
                unable();
                $('.lp-hd-out').show();
                $('.lp-hd-out .hd-content').attr('id', 'youhuitanchuangul');
                scroll && scroll.destroy();
                scroll = new IScroll('#youhuitanchuangul');
            });

            // 优惠券展开 收起
            $('.lp-hd-out .arr-rt').on('click', function () {
                var $this = $(this);
                scroll && scroll.destroy();
                if ($this.hasClass('down')) {
                    $this.removeClass('down').siblings().hide();
                } else if (!$this.hasClass('down')) {
                    $this.addClass('down').siblings().show();
                }
                scroll = new IScroll('#youhuitanchuangul');
            });
            // 点击领取 直销
            $('.red-s-btn').on('click', function () {
                var $this = $(this);
                var id, aid;
                // 如果登录了
                if (vars.username) {
                    // 如果绑定手机号了
                    if (loginInPhone) {
                        id = $this.attr('data-cmid');
                        aid = $this.attr('data-aid');
                        $.get('/xf.d?m=getConditionsMoney&mobile=' + loginInPhone + '&city=' + vars.city
                            + '&vcode=' + '&aid=' + aid + '&newcode=' + vars.newcode + '&cmid=' + id + '&username=' + vars.username + '&fromUrl=' + encodeURIComponent(encodeURIComponent(window.location.href)),
                            function (data) {
                                if (data) {
                                    if (data.root.code === '100') {
                                        enable();
                                        window.location = location.protocol + vars.mainSite + 'house/ec/BuyYouHui/PayConfirm?orderNo=' + data.root.result + '&EB_BehaviorID=GMYH0002';
                                    } else {
                                        showPrompt(data.root.message);
                                    }
                                }
                            });
                    } else {
                        window.location.href = 'https://m.fang.com/passport/resetmobilephone.aspx?burl=' + encodeURIComponent(window.location.href);
                    }
                } else {
                    window.location.href = 'https://m.fang.com/passport/login.aspx?burl=' + encodeURIComponent(window.location.href);
                }
            });
            // 新房电商 end

            // 二手房电商 begin
            // 在线咨询函数
            function chatWeituo(zhcity, city, housetype, houseid, newcode, type, phone, channel, uname, aname, agentid, order, photourl, housefrom) {
                if (vars.localStorage) {
                    window.localStorage.setItem(String(uname), encodeURIComponent(aname) + ';'
                        + photourl + ';' + encodeURIComponent(vars.district + '的'));
                }
                $.ajax({
                    url: '/data.d?m=houseinfotj&zhcity=' + zhcity + '&city=' + city + '&housetype=' + housetype + '&houseid=' + houseid
                    + '&newcode=' + newcode + '&type=' + type + '&phone=' + phone + '&channel=' + channel + '&agentid='
                    + agentid + '&order=' + order + '&housefrom=' + housefrom,
                    async: false
                });
                setTimeout(function () {
                    window.location = '/chat.d?m=chat&username=' + uname + '&city=' + city;
                }, 500);
            }

            // 点击在线咨询跳转到咨询界面
            $('.tj-mes').on('click', function () {
                var data = $(this).attr('data-chat');
                var dataArr = data.split(',');
                chatWeituo.apply(null, dataArr);
            });
            // 多盘导购:楼盘卡片展开
            $('.moreProjCard').on('click', function () {
                $('.houseList ul li').show();
                $(this).hide();
            });

            // 开发平台关注功能
            if (vars.channelid === '03') {
                require.async('modules/news/kfptGz');
                // 评论点赞
                require.async('modules/news/openCommentLike');
            }

            // 语音功能添加 lina
            var audioObj;
            var $contTyy = $('.cont-tyy');
            $('body').on('touchend', '.btn-tyy', function () {
                var img = $(this).find('img');
                if ((playBtn || pauseBtn) && $(this).hasClass('hasYy')) {
                    if (playBtn) {
                        $('#J-audio-sound')[0].play();
                        img.eq(0).hide();
                        img.eq(1).show();
                        playBtn = false;
                        pauseBtn = true;
                    } else if (pauseBtn) {
                        $('#J-audio-sound')[0].pause();
                        img.eq(1).hide();
                        img.eq(0).show();
                        playBtn = true;
                        pauseBtn = false;
                    }
                    var imgYy = $contTyy.find('.flol').find('img');
                    var aBtnList = $contTyy.find('.flor').find('a');
                    imgYy.each(function () {
                        if ($(this).is(':hidden')) {
                            $(this).show();
                        } else {
                            $(this).hide();
                        }
                    });
                    aBtnList.each(function () {
                        if ($(this).index() !== 2) {
                            if ($(this).is(':hidden')) {
                                $(this).show();
                            } else {
                                $(this).hide();
                            }
                        }
                    });

                    return false;
                }
                playIndex = 1;
                $(this).addClass('hasYy').siblings().removeClass('hasYy');
                $contTyy.show();
                var $yyImg = $('.flol').find('img');
                img.eq(0).hide();
                img.eq(1).show();
                $yyImg.eq(1).show();
                $yyImg.eq(0).hide();
                $('.btn-read').show();
                $('.btn-pause').hide();
                audioObj = [];
                var token = img.eq(0).attr('token');
                var yunyinContent = vars.yuYinContent;
                // 请求所有字段
                var yuyin = (yunyinContent.split('[&]'));
                for (var i = 0; i < yuyin.length; i++) {
                    if (yuyin[i]) {
                        audioObj.push('http://tsn.baidu.com/text2audio?tex=' + encodeURIComponent(encodeURIComponent(yuyin[i])) + '&lan=zh&cuid=' + Math.random(0, 1e6) + '&ctp=1&spd=6&tok=' + token + '&per=0');
                    }
                }
                playAudio(audioObj);
                $(".audio-sound").off("ended").on("ended", function () {
                    if (playIndex < audioObj.length) {
                        playIndex++;
                        playNext();
                    } else {
                        $('#J-audio-sound').attr('src', audioObj[0]);
                        $('#J-next-sound').attr('src', audioObj[1]);
                        $contTyy.hide();
                        playIndex = 1;
                        var imgYy = $contTyy.find('.flol').find('img');
                        var aBtnList = $contTyy.find('.flor').find('a');
                        imgYy.each(function () {
                            if ($(this).is(':hidden')) {
                                $(this).show();
                            } else {
                                $(this).hide();
                            }
                        });
                        aBtnList.each(function () {
                            if ($(this).index() !== 2) {
                                if ($(this).is(':hidden')) {
                                    $(this).show();
                                } else {
                                    $(this).hide();
                                }
                            }
                        });
                        $('.btn-tyy').removeClass('hasYy');
                    }
                });
            });
            var playIndex = 1;

            function playAudio(audioObj) {
                $('#J-audio-sound').attr('src', audioObj[0]);
                $('#J-next-sound').attr('src', audioObj[1]);
                $('#J-audio-sound')[0].play();
                $('#J-next-sound')[0].load();
            }

            function playNext() {
                $("#J-audio-sound").attr("id", "J-old-sound");
                $("#J-next-sound").attr("id", "J-audio-sound");
                $("#J-old-sound").attr("id", "J-next-sound");
                $("#J-audio-sound")[0].play();
                loadAduio();
            }

            function loadAduio() {
                if (playIndex < audioObj.length) {
                    $("#J-next-sound").attr("src", audioObj[playIndex]);
                    $("#J-next-sound")[0].load();
                } else {
                    return;
                }
            }

            // 点击底部语音切换
            var playBtn = false, pauseBtn = true;
            // 点击播放，暂停，关闭
            $(document).on('click', '.flor a', function () {
                var $ele = $(this);
                var $yyImg = $ele.parent().siblings().find('img');
                var img = $('.hasYy').find('img');
                // 显示小喇叭
                if ($ele.hasClass('btn-read')) {
                    $ele.hide();
                    $('#J-audio-sound')[0].pause();
                    $yyImg.eq(0).show();
                    $yyImg.eq(1).hide();
                    $ele.siblings('.btn-pause').show();
                    pauseBtn = false;
                    playBtn = true;
                    img.eq(1).hide();
                    img.eq(0).show();
                } else if ($ele.hasClass('btn-pause')) {
                    $ele.hide();
                    $yyImg.eq(1).show();
                    $yyImg.eq(0).hide();
                    $('#J-audio-sound')[0].play();
                    $ele.siblings('.btn-read').show();
                    playBtn = false;
                    pauseBtn = true;
                    img.eq(0).hide();
                    img.eq(1).show();
                } else {
                    playBtn = false;
                    pauseBtn = false;
                    $('#J-audio-sound')[0].pause();
                    $contTyy.hide();
                }
            });
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
            // 点评和论坛切换
            $('.dpAndBbsTab').on('click', 'a', function () {
                var $that = $(this);
                // 切换头
                var dataDiv = $that.attr('data-id');
                // 切换头的active样式
                $that.addClass('active').siblings().removeClass('active');
                // 点评和论坛内容切换
                if (dataDiv === 'dianPingBox') {
                    $('.dianPingBox').show();
                    $('.bbsInfoBox').hide();
                } else {
                    $('.bbsInfoBox').show();
                    $('.dianPingBox').hide();
                }
            });
        };
    });