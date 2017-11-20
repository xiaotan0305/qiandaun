define('modules/jiaju/gzInfo', ['jquery', 'iscroll/2.0.0/iscroll-lite', 'lazyload/1.9.1/lazyload'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        require('lazyload/1.9.1/lazyload');
        $('.lazyload').lazyload();
        $('.floatTel a').css('color', '#fff');
        $('footer').css('padding-bottom', '50px');
        var status = 1;
        // 切换显示隐藏更多
        var $lessmore = $('#moreContent,#lessContent');
        $lessmore.on('click', function () {
            $('#ability,#present').toggle();
            $lessmore.toggle();
        });
        $(window).scroll(function () {
            if (document.body.scrollTop !== 0 || document.documentElement.scrollTop !== 0) {
                if (status === 1) {
                    $('.floatTel').css('display', 'block');
                }
            } else {
                $('.floatTel').css('display', 'none');
            }
        });
        if (Number(vars.count) > 0) {
            var IScroll = require('iscroll/2.0.0/iscroll-lite');
            var count = Number(vars.count);
            // li 宽度 115+margin 14
            var x = count * 129 + 14;
            var container = $('.xqScroll');
            container.find('ul').width(x);
            var isLite = new IScroll('.xqScroll', {
                scrollX: true,
                preventDefault: true,
                onScrollEnd: function () {
                    container.trigger('scroll');
                }
            });
            // 设置滑动加载图片
            isLite.on('scroll', function () {
                container.find('img').each(function () {
                    var $that = $(this);
                    if ($that.attr('src') !== $that.attr('data-original') && $that.offset().left < container.width()) {
                        $that.attr('src', $that.attr('data-original'));
                    }
                });
            });
        }
        var isAjaxing = 0;
        // 点赞
        $('.xqIntroBox a').on('click', function () {
            if (isAjaxing) {
                return false;
            }
            isAjaxing = 1;
            var $this = $(this);
            $.get(vars.publicSite + '?c=public&a=ajaxUserInfo', function (info) {
                if (!info.userid) {
                    window.location = location.protocol + '//m.fang.com/passport/login.aspx?burl=' + encodeURIComponent(window.location.href);
                    return;
                } else {
                    // 获取未点过的值
                    var praiseNum = +$this.data('num');
                    var isPraise = $this.data('praise');
                    praiseNum += isPraise ? -1 : 1;
                    var ajaxUrl = vars.jiajuSite + '?c=jiaju&a=addPrise&type=8&r=' + Math.random();
                    $.get(ajaxUrl, {
                        objid: $this.attr('data-id'),
                        isPraise: isPraise
                    }, function () {
                        isAjaxing = 0;
                        $this.data('praise', +!isPraise).data('num', praiseNum).find('i').text('+1').end().toggleClass('cur').find('span').text(praiseNum);
                    });
                }
            });
        });

        // 小米黄页
        var d = window.navigator.userAgent.toLowerCase();
        if (/miuiyellowpage/i.test(d)) {
            $('.foreman').css('padding-bottom', '50px');
        }
        //如果没有代表作品和施工能力 隐藏更多按钮
        if ( $("#ability").length > 0 || $("#present").length > 0) {
           $('#moreContent').show();
        } else {
            $('#moreContent').hide();
        }
        $('.footer').css('padding-bottom','120px');
        // 搜索用户行为收集20160114
        var page = 'mjjforemanpage';
        require.async('jsub/_vb.js?c=' + page);
        require.async('jsub/_ubm.js', function () {
            _ub.city = vars.cityname;
            _ub.biz = 'h';
            _ub.location = 0;
            var b = 0;
            var p = {
                'vmh.foremanid': vars.designerid,
                'vmg.page': page
            };
            _ub.collect(b, p);
            $('.tj-tel').click(function () {
                var b = 31;
                var p = {
                    'vmh.foremanid': vars.designerid,
                    'vmg.page': page
                };
                _ub.collect(b, p);
            });
        });
    };
});