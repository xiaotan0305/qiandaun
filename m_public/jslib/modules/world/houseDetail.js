/**
 * @file merge js files,ESLint
 * @author zcf(zhangcongfeng@fang.com)
 */
define('modules/world/houseDetail', ['swipe/2.0/swipe', 'jquery', 'modules/world/yhxw', 'superShare/1.0.1/superShare', 'photoswipe/4.0.7/photoswipe', 'photoswipe/4.0.7/photoswipe-ui-default.min'], function (require, exports, module) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;
    module.exports = function () {
        // 引入用户行为分析对象-埋码
        var yhxw = require('modules/world/yhxw');
        // 判断详情页种类，传入用户行为统计对象
        var pageId = 'mwhousepage';
        // 埋码变量数组
        var maiMaParams = {
            'vmg.page': pageId,
            'vmw.houseid': vars.houseid
        };
        var foreignprice = vars.houseDBPrice;
        foreignprice = foreignprice.replace(/[-\d.万\/套]+/g, '') + '^' + foreignprice.replace(/[^\d-]+/g, '');
        var layoutArr = [];
        var len, i;
        if (vars.houseLayout) {
            layoutArr = vars.houseLayout.split(' ');
            len = layoutArr.length;
            for (i = 0; i < len; i++) {
                if (layoutArr[i]) {
                    layoutArr[i] = encodeURIComponent([layoutArr[i]]);
                }
            }
        }

        var maiMaParams2 = {
            'vmg.page': pageId,
            'vmw.houseid': vars.houseid,
            'vmw.country': encodeURIComponent(vars.country),
            'vmw.totalprice': vars.houseprice.replace(/[^\d-]+/g, ''),
            'vmw.foreignprice': encodeURIComponent(foreignprice),
            'vmw.unitprice': vars.unitprice.replace(/[^\d.]+/g, ''),
            'vmw.dwellingtype': encodeURIComponent(vars.purpose),
            'vmw.area': encodeURIComponent(vars.livearea),
            'vmw.acreage': encodeURIComponent(vars.BuildArea || ''),
            'vmw.fixstatus': encodeURIComponent(vars.ixStatus),
            'vmw.housetype': layoutArr.join(','),
            'vmw.propertyright': encodeURIComponent(vars.TypeofOwnership)
        };
        yhxw({
            type: 0,
            pageId: pageId,
            params: maiMaParams2
        });
        var $focus = $('.focus-opt');
        var $head = $('.header');
        var $nav = $('.icon-nav');
        var maxLen = 200;
        var cLen = 150;
        var $window = $(window);
        var scrollFunc = function () {
            var scrollH = $window.scrollTop();
            // 导航切换效果
            if (scrollH <= maxLen) {
                $head.css('opacity', scrollH / maxLen);
                // 向下移动屏幕
                if (scrollH <= cLen) {
                    $focus.css('opacity', 1 - scrollH / cLen);
                } else {
                    $head.children().filter('.left,.head-icon').css('opacity', scrollH / (maxLen - cLen));
                }
                // 向上移动屏幕
            } else {
                $head.css('opacity', 1);
                $focus.css('opacity', 0);
            }
        };
        $window.on('scroll', scrollFunc);
        $nav.on('click', (function () {
            var isShow = 0;
            return function () {
                isShow = !isShow;
                if (isShow) {
                    $window.off('scroll');
                    $head.css('opacity', 1);
                    $focus.css('opacity', 0);
                } else {
                    $window.on('scroll', scrollFunc);
                    $head.css('opacity', 0);
                    $focus.css('opacity', 1);
                }
            };
        })());

        require('swipe/2.0/swipe');
        var $slider = $('#slider');
        $slider.Swipe({
            speed: 500,
            callback: function (index) {
                $('#nowNumIndex').html(index + 1);
            }
        });
        var $imgs = $slider.find('img');
        var slides = [];
        // todo:大图模式,图片大小需要更新
        for (i = 0, len = $imgs.length; i < len; i++) {
            slides.push({
                src: $imgs[i].src,
                w: $imgs[i].naturalWidth,
                h: $imgs[i].naturalHeight
            });
        }
        var pswp = document.querySelector('.pswp');
        $slider.on('click', 'li', function () {
            var $this = $(this);
            var index = $this.index();
            var options = {
                history: false,
                focus: false,
                index: index,
                escKey: true
            };
            var gallery = new window.PhotoSwipe(pswp, window.PhotoSwipeUI_Default, slides, options);
            gallery.init();
            return false;
        });

        var $popTipsWorld = $('#popTipsWorld');
        var $popTipsWorldInfo = $popTipsWorld.find('.yzm-sta');
        var showWin = function (message) {
            $popTipsWorldInfo.text(message);
            $('#popTipsWorld').show();
            setTimeout(function () {
                $popTipsWorld.hide();
            }, 2000);
        };

        function tjgf() {
            var partten = /^[\d]{7,11}$/;
            var phone = $('.phoneNumber').val();
            if (!phone) {
                showWin('请填写电话号码');
            } else {
                if (!partten.test(phone)) {
                    showWin('填入的号码不符合要求！');
                    return false;
                }
                $.get(vars.worldSite + '?c=world&a=gfWish', {
                    phone: phone,
                    gfcontent: encodeURIComponent(vars.content),
                    tomail: encodeURIComponent(vars.tomail),
                    agentid: vars.agentid,
                    AgentName: encodeURIComponent(vars.AgentName),
                    houseid: vars.houseid,
                    PhotoUrl: encodeURIComponent(vars.photourl),
                    ProjName: encodeURIComponent(vars.projName),
                    TotalPrice: parseInt(vars.totalprice) * 10000,
                    PublishTime: vars.publishTime
                }, function (data) {
                    var copy = $.parseJSON(data);
                    if (copy.state === 1) {
                        copy.result = '提交成功';
                    }
                    showWin(copy.result);
                });
                yhxw({
                    type: 23,
                    pageId: pageId,
                    params: maiMaParams
                });
            }
        }

        // 我要购房提交
        $('#tjgf').click(function () {
            tjgf();
        });

        // 收藏
        var $collectBtn = $('.icon-fav');
        $collectBtn.on('click', function () {
            // 调用收藏接口
            $.ajax({
                timeout: 3000,
                url: vars.mySite + '?c=mycenter&a=ajaxMySelect&',
                data: {
                    city: vars.city,
                    houseId: vars.houseid,
                    housetype: vars.houseType,
                    channel: 'world',
                    url: location.href
                },
                success: function (data) {
                    if (data.userid) {
                        if (data.myselectid) {
                            showWin('收藏成功');
                            yhxw({
                                type: 21,
                                pageId: pageId,
                                params: maiMaParams
                            });
                        } else {
                            showWin('已取消收藏');
                        }
                        $collectBtn.toggleClass('cur');
                    } else {
                        // 未登录要求先登录
                        window.location.href = location.protocol + '//m.fang.com/passport/login.aspx?burl=' + encodeURIComponent(window.location.href) + '&r=' + Math.random();
                    }
                },
                error: function () {
                    showWin('出错了');
                }
            });
        });

        // 分享按钮
        (function () {
            var superShare = require('superShare/1.0.1/superShare');
            var summary, title;
            summary = '这是我在房天下海外网上看到一套不错的' + vars.country + '的' + vars.purpose.replace(/^其他$/, '地产') + ',' + vars.livearea + vars.rmbprice + '！大家帮我参考一下吧~';
            if (vars.houseType === 'XF') {
                summary += vars.tel ? '电话：' + vars.tel + '。' : '';
                title = '【房天下国际新房】';
            } else {
                title = '【房天下国际二手房】';
            }
            new superShare({
                title: title,
                image: vars.photourl,
                desc: summary
            });
            $('#wapxfxqy_B02_21').on('click', function () {
                yhxw({
                    type: 22,
                    pageId: pageId,
                    params: maiMaParams
                });
            });
        })();

        // 大段文本折叠，并显示更多标签
        var $xqIntro = $('.xqIntro');
        $xqIntro.each(function () {
            var $this = $(this);
            var boxHeight = $this.height();
            var contentHeight = $this.find('p').height();
            contentHeight > boxHeight && $this.next().show();
        });
        // 切换折叠框
        $('.getmore').on('click', function () {
            var $this = $(this);
            $this.toggleClass('up').prev().css('max-height', $this.hasClass('up') ? 'none' : '');
        });
        // 底部推荐房产列表只显示三个
        $('.houseList').find('li:gt(2)').hide();

        // 打电话
        $('#telphone').click(function () {
            var data = {
                city: vars.city,
                housetype: vars.housetype,
                type: 'call',
                phone: vars.phone,
                channel: 'waphouseinfo',
                agentid: vars.agentid
            };
            data[vars.housetype === 'XF' ? 'newcode' : 'houseid'] = vars.houseid;
            $.get(vars.mainSite + 'data.d?m=houseinfotj', data);
            yhxw({
                type: 31,
                pageId: pageId,
                params: maiMaParams
            });
        });
    };
});
