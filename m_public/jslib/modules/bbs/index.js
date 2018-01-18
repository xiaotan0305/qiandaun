/**
 * bbs首页
 * @Last Modified by:   liyingying
 * @Last Modified time: 2016/1/6
 */
define('modules/bbs/index', ['jquery', 'loadMore/1.0.0/loadMore','lazyload/1.9.1/lazyload', 'modules/bbs/bbsbuma'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var hotCent = $('.hotCent');
        var bbsFollow = $('.bbsFollow');
        //bumabits浏览位置次数记录，多次点击只记录一次
        var bumabits = 0;
        var bbsTitle = $('#wapbbssy_D02_04');
        var hotTitle = $('#wapbbssy_D02_03');
        var location = $('#wapbbssy_D02_04').find('span').html();
        // 首页加载更多
        var loadMore = require('loadMore/1.0.0/loadMore');
        // 用户行为对象
        var bbsbuma = require('modules/bbs/bbsbuma');
        //首页搜索动作布码
        bbsbuma({type: 1,pageId: 'lt_lt^sy_wap',location: location});

        loadMore({
            url: vars.bbsSite + '?c=bbs&a=ajaxBbsIndex' + '&city=' + vars.city,
            total: vars.totalCount,
            pagesize: 20,
            pageNumber: 20,
            moreBtnID: '#loadMore',
            loadPromptID: '#loadMore',
            contentID: '.sf-bbsList',
            loadAgoTxt: '<span><i></i>努力加载中...</span>',
            loadingTxt: '<span><i></i>努力加载中...</span>',
            loadedTxt: '<span><i></i>努力加载中...</span>',
            lazyCon: '.img[data-original]',
            firstDragFlag: false
        });

        // 惰性加载
        require('lazyload/1.9.1/lazyload');
        $('.img').lazyload();

        // 常用论坛和热门推荐切换
        function clickHandler() {
            // 热门推荐
            hotTitle.on('click', function () {
                //首页搜索动作布码,反复点击只记录一次
                bumabits = bumabits + 1;
                if(bumabits === 1){
                    location = $(this).find('span').html();
                    bbsbuma({type: 1,pageId: 'mbbshomepage',location: location});
                }
                bbsTitle.removeClass('active');
                hotTitle.addClass('active');
                bbsFollow.hide();
                hotCent.show();
            });
            bbsTitle.on('click', function () {
                hotTitle.removeClass('active');
                bbsTitle.addClass('active');
                hotCent.hide();
                bbsFollow.show();
            });
        }
        //　点击更多
        function clickMore(dnA, more) {
            if (dnA && more) {
                dnA.on('click', function () {
                    if (dnA.hasClass('dn')) {
                        dnA.removeClass('dn').addClass('up');
                    } else {
                        dnA.removeClass('up').addClass('dn');
                    }
                    more.toggle();
                });
            }
        }

        // 获取热门推荐数据并绑定更多标签的点击事件
        function hotRecom() {
            $.get(vars.bbsSite + '?c=bbs&a=ajaxHotForumByClick&city=' + vars.city, function (data) {
                hotCent.append(data);
                var morehotbbs = $('.morehotbbs');
                var hotdn = $('.hotdn');
                clickMore(hotdn, morehotbbs);
            });
        }

        // 获取用户常用论坛，绑定点击事件
        function getLookedBbs() {
            if (!vars.localStorage) {
                return;
            }
            var lacc = localStorage.getItem('bbs_last_acc');
            // 编码后的常用论坛数据
            var kanbbs = '';
            if (lacc) {
                var bbsClear = localStorage.getItem('bbs_clear');
                if (bbsClear === null) {
                    localStorage.removeItem('bbs_last_acc');
                    localStorage.setItem('bbs_clear', '1');
                }
                lacc = decodeURIComponent(lacc);
                var arrCont = lacc.split('||');
                var mybbsLen = arrCont.length;
                // 拼接常用论坛内容
                for (var i = 0; i < mybbsLen; i++) {
                    arrCont[i] = decodeURIComponent(arrCont[i]);
                    var cont = arrCont[i].split('@@');
                    var forumurl = decodeURIComponent(cont[1]);
                    var name = decodeURIComponent(cont[2]);
                    if (i === 0) {
                        kanbbs += '<a href=\"' + forumurl + '\" id="wapbbssy_D02_01">' + name + '</a>';
                    } else if (i < 4) {
                        kanbbs += '<a href=\"' + forumurl + '\">' + name + '</a>';
                    } else {
                        kanbbs += '<a href=\"' + forumurl + '\" class="moremybbs" style="display:none;">' + name + '</a>';
                    }
                }
                if (mybbsLen > 4) {
                    kanbbs += '<a href="javascript:void(0);" class="dn cdn"></a>';
                }
                bbsFollow.append(kanbbs);
                var cdn = $('.cdn');
                var moremybbs = $('.moremybbs');
                clickMore(cdn, moremybbs);
                hotTitle.removeClass('active');
                bbsTitle.addClass('active');
            } else {
                bbsTitle.removeClass('active');
                hotTitle.addClass('active');
                hotCent.show();
                bbsFollow.hide();
                bbsFollow.html('<a>您暂时没有常逛的论坛~</a>');
            }
        }

        // 发送ajax请求，获取用户已关注论坛列表
        function myBbs() {
            // 如果登陆
            if (vars.login_visit_mode) {
                $.get(vars.bbsSite + '?c=bbs&a=ajaxMyPostList', {
                    userid: vars.userid,
                    page: 1,
                    type: 'lt',
                    from: 'index'
                }, function (data) {
                    if (data) {
                        bbsFollow.append(data);
                        var cdn = $('.cdn');
                        // 点击展开更多
                        var moremybbs = $('.moremybbs');
                        // 更多我的关注论坛
                        clickMore(cdn, moremybbs);
                        hotTitle.removeClass('active');
                        bbsTitle.addClass('active');
                    } else {
                        // 没获取到数据从localStorage取数据
                        getLookedBbs();
                    }
                });
            } else {
                getLookedBbs();
            }
        }

        // 当前用户已登录且有关注论坛时，获取我的论坛列表，否则读取localStorage的常用论坛列表
        myBbs();
        // 存在常用论坛，添加标签点击切换事件
        hotRecom();

        if (bbsTitle.length) {
            clickHandler();
        }
    };
});