/**
 *
 * @author thx on 2016-01-04
 * @modifed by  袁辉辉(yuanhuihui@fang.com) 2016年09月30日09:41:03
 * 装修日记列表页
 */
define('modules/jiaju/documentaryList', ['jquery', 'lazyload/1.9.1/lazyload', 'loadMore/1.0.1/loadMore', 'modules/jiaju/yhxw'],
    function (require, exports, module) {
        'use strict';
        module.exports = function () {
            var $ = require('jquery');
            var $timeout = $('#timeout');
            // 用户行为
            var yhxw = require('modules/jiaju/yhxw');
            yhxw({page: /tabType=1/.test(location.href) ? 'jj_zxriji^zuixinlb_wap' : 'jj_zxriji^jingxuanlb_wap'});
            if ($timeout.length) {
                $timeout.on('click', function () {
                    window.location.reload();
                });
            } else {
                var vars = seajs.data.vars;
                var loadMore = require('loadMore/1.0.1/loadMore');
                var $sections = $('.jj-record');
                var pagesize = vars.pagesize;
                // 添加到历史记录中
                var statePush = function (type) {
                    var splitChar = '?', params = location.href.split(splitChar);
                    var query = 'tabType=' + type;
                    // 目前无TDK,暂不改变
                    var title = document.title;
                    if (history.pushState) {
                        history.pushState({title: title}, title, params[0] + splitChar + query);
                    }
                };
                var $tabs = $('.tab2').find('a');
                $tabs.on('click', (function () {
                    var canAjax = true;
                    // UV代码路径
                    var uvJsUrl = seajs.resolve('count/loadforwapandm.min.js');
                    var $bodey = $(document.body), uvImgUrl = '//uvwap.3g.fang.com/default/index?uvn=Y&uvb=1&uvr=';
                    return function (e) {
                        if (canAjax) {
                            canAjax = false;
                            var $this = $(this);
                            var index = $this.index();
                            // 用户行为
                            yhxw({page: index === 1 ? 'jj_zxriji^zuixinlb_wap' : 'jj_zxriji^jingxuanlb_wap'});
                            $this.addClass('active').siblings().removeClass('active');
                            // 用户点击才加入,代码触发不加入history
                            if (e && /\d/.test(e.button)) {
                                statePush(index);
                                // 重新加载UV统计
                                $.getScript(uvJsUrl, function () {
                                    console.log('load UV code again!');
                                });
                                $bodey.append('<img src="' + uvImgUrl + document.referrer
                                    + '&uvl=' + encodeURIComponent(window.location.href)
                                    + '&uvz=' + parseInt(Math.random() * 1e9) + '" style="display:none;">');
                            }
                            var $section = $sections.eq(index);
                            if ($section.length) {
                                $section.show().siblings('.jj-record').hide();
                                canAjax = true;
                            } else {
                                $.ajax({
                                    url: vars.jiajuSite + '?c=jiaju&a=ajaxGetMoreDocumentaryList&page=1&type=' + (index ^ +vars.type),
                                    success: function (data) {
                                        if (data) {
                                            $section = $(data);

                                            var preSection = $sections[index - 1] ? $sections.eq(index - 1) : $sections.eq($sections.length - 1);
                                            preSection.after($section);
                                            $sections = $('.jj-record');
                                            var total = $section.data('total');
                                            $section.show().siblings('.jj-record').hide();
                                            $section.find('img').lazyload();
                                            total > pagesize && loadMore.add({
                                                url: vars.jiajuSite + '?c=jiaju&a=ajaxGetMoreDocumentaryList&type=' + (index ^ +vars.type),
                                                // 总条数
                                                total: total,
                                                // 首页加载条数
                                                pagesize: pagesize,
                                                // 每页加载条数
                                                perPageNum: pagesize,
                                                content: $section.find('.content'),
                                                moreBtn: $section.find('.moreList'),
                                                loadPrompt: $section.find('.loadPrompt'),
                                                activeEl: $this,
                                                active: 'active'
                                            });
                                        }
                                    },
                                    complete: function () {
                                        canAjax = true;
                                    }
                                });
                            }
                        }
                    };
                })());
                $sections.each(function (index, section) {
                    var $tab = $tabs.eq(index);
                    var $section = $(section);
                    var total = $section.data('total');
                    total > pagesize && loadMore.add({
                        url: vars.jiajuSite + '?c=jiaju&a=ajaxGetMoreDocumentaryList&type=' + (index ^ +vars.type),
                        // 总条数
                        total: total,
                        // 首页加载条数
                        pagesize: pagesize,
                        // 每页加载条数
                        perPageNum: pagesize,
                        content: $section.find('.content'),
                        moreBtn: $section.find('.moreList'),
                        loadPrompt: $section.find('.loadPrompt'),
                        activeEl: $tab,
                        active: 'active'
                    });
                });
                loadMore.init();
                // 惰性加载
                require('lazyload/1.9.1/lazyload');
                $('.lazyload').lazyload();


                //  获取参数
                var getQueryString = function (name) {
                    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
                    var r = window.location.search.substr(1).match(reg);
                    if (r) {
                        return decodeURIComponent(r[2]);
                    } else {
                        return '';
                    }
                }
                // 地址栏改变事件
                var siteChangeFun = function () {
                    var eleTarget, type = getQueryString('tabType');
                    if (type) {
                        eleTarget = $tabs.eq(type);
                    } else if (!$tabs.eq(0).hasClass('active')) {
                        // 若没type参数并且当前页面不是第一个tab
                        eleTarget = $tabs.eq(0);
                    }
                    eleTarget && eleTarget.length && eleTarget.trigger('click');
                };
                if (history.pushState) {
                    $(window).on('popstate', function () {
                        siteChangeFun();
                    });
                    // 默认载入
                    siteChangeFun();
                }
                // click流量统计
                require.async(location.protocol + '//clickm.fang.com/click/new/clickm.js', function () {
                    window.Clickstat.eventAdd(window, 'load', function () {
                        window.Clickstat.batchEvent('wapgjiajurj_', '');
                    });
                });
            }
        };
    });