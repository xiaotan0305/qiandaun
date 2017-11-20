/**
 * @file 2016WAP第四期改版 装修订单详情
 * @author 汤贺翔(tanghexiang@fang.com)
 */
define('modules/jiajuds/myOrderInfo.js', ['jquery', 'loadMore/1.0.1/loadMore', 'photoswipe/4.0.8/photoswipe', 'photoswipe/4.0.8/photoswipe-ui-default.min'],
    function (require, exports, module) {
        'use strict';
        module.exports = function () {
            var $ = require('jquery');
            var vars = seajs.data.vars;
            // App跳转测试
            if (vars.jumptoapp) {
                // 如果微信打开, 提示在浏览器打开
                if ((/MicroMessenger/ig).test(navigator.userAgent)) {
                    alert('请点击微信右上角按钮，然后在弹出的菜单中，点击在浏览器中打开');
                } else {
                    var jumpurl = vars.jiajuSite + '?c=jiajuds&a=myOrderInfo&orderid=' + vars.orderid;
                    if (vars.interface_mode) {
                        jumpurl = jumpurl + '&interface_mode=' + vars.interface_mode;
                    }
                    var u;
                    var l;
                    var apphref = '';
                    var url = vars.public + 'jslib/app/1.0.2/appopen.js';
                    var callback = function (openApp) {
                        if (typeof window.openApp === 'function') {
                            openApp = window.openApp;
                        }
                        apphref = /iPad|iPhone|iPod/i.test(window.navigator.userAgent) ? 'newzhuangxiu://' : 'fangtxzx://';
                        var oa = openApp({
                            url: jumpurl,
                            log: function () {
                            },
                            appurl: 'data/{"address":"myinfo"}',
                            href: apphref,
                            appstoreUrl: jumpurl
                        });
                        oa.openApp();
                    };
                    if (typeof window.seajs === 'object') {
                        window.seajs.use(url, callback);
                    } else {
                        u = doc.createElement('script');
                        l = doc.getElementsByTagName('head')[0];
                        u.async = true;
                        u.src = url;
                        u.onload = callback;
                        l.appendChild(u);
                    }
                }

            } else {

                if ($('#timeout').length) {
                    // 数据请求失败时, 点击刷新
                    $('#timeout').one('click', function () {
                        window.location.reload();
                    });
                } else {

                    // 服务团队 - 加载失败 点击重新加载
                    $('#ajaxServiceTeam').one('click', function () {
                        var $this = $(this);
                        var $prevSection = $this.prev();
                        $.get(vars.jiajuSite + '?c=jiajuds&a=ajaxmyOrderInfo&ajaxtype=1&orderid=' + vars.orderid
                            + '&interface_mode=' + vars.interface_mode + '&r=' + Math.random(), function (data) {
                            data && $this.remove() && $prevSection.after(data);
                        });
                    });

                    // 服务团队 - 显隐切换: ajax获取的,有可能无此dom,所以用委托
                    $('.main').on('click', '#serviceTeamSwitch', function () {
                        var $this = $(this);
                        if ($this.hasClass('arro-up')) {
                            $('#serviceTeamContent').hide();
                            $this.removeClass('arro-up').addClass('arro-dn');
                        } else {
                            $('#serviceTeamContent').show();
                            $this.removeClass('arro-dn').addClass('arro-up');
                        }
                    });

                    // 装修进展 - 加载更多
                    var loadMore = require('loadMore/1.0.1/loadMore');
                    loadMore.add({
                        url: vars.jiajuSite + '?c=jiajuds&a=ajaxmyOrderInfo&orderid=' + vars.orderid + '&interface_mode=' + vars.interface_mode,
                        total: vars.total,
                        pagesize: vars.pagesize,
                        pageNumber: vars.pagesize,
                        content: '#content',
                        moreBtn: '.moreList',
                        loadPrompt: '#clickmore',
                        firstDragFlag: true
                    });
                    loadMore.init();

                    // 装修进展 - 图片点击放大
                    $('#genjin').on('click', '.clearfix img', function (e) {
                        e.stopPropagation();
                        var $this = $(this);
                        var $parent = $this.parent().parent();
                        var index = $parent.index();// 照片序号
                        // 当前照片栏照片信息
                        var $imgs = $parent.parent().find('img');
                        var items = [];
                        for (var i = 0, length = $imgs.length; i < length; i++) {
                            items.push({
                                // 照片src, 宽, 高
                                src: $imgs.eq(i).attr('src'),
                                w: parseInt($imgs[i].naturalWidth, 10),
                                h: parseInt($imgs[i].naturalHeight, 10)
                            });
                        }
                        var pswp = $('.pswp')[0];
                        var options = {
                            index: index,
                            history: false
                        };
                        // 显示照片墙
                        var gallery = new window.PhotoSwipe(pswp, window.PhotoSwipeUI_Default, items, options);
                        gallery.init();
                    });
                }
            }
        };
    }
);
