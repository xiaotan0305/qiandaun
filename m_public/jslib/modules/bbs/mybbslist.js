define('modules/bbs/mybbslist', ['jquery', 'loadMore/1.0.0/loadMore','lazyload/1.9.1/lazyload', 'modules/bbs/bbsbuma'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        // 加载更多
        var loadMore = require('loadMore/1.0.0/loadMore');
        var vars = seajs.data.vars, win = window;
        // 用户行为对象
        var bbsbuma = require('modules/bbs/bbsbuma');
        var floatAlert = $('.floatAlert'),
            inbox = $('#inbox'),
            fansNum = $('#fans_num'),
            toastMsg = $('#toastMsg'),
            myContainer = $('#myContainer');
        // 惰性加载
        require('lazyload/1.9.1/lazyload');
        $('.lazyload').lazyload();
        //各人资料页浏览动作布码
        if(vars.actionName === 'getMyPostList'){
            if(vars.type === 'tz'){
                var location = '帖子';
            } else if (vars.type === 'lt'){
                var location = '论坛';
            } else if (vars.type === 'gz'){
                var location = '关注';
            } else if (vars.type === 'fs'){
                var location = '粉丝';
            }
            bbsbuma({type: 0, pageId: vars.pageId, location: location, interestuserid: vars.userid });
        }
        // 点击发送信息
        $('#sendmessage').on('click', function () {
            win.location.href = vars.bbsSite + '?c=bbs&a=getMessageDetail&city=' + vars.city + '&toUser=' + vars.username;
        });

        /* 关注该用户*/
        var fansnum = fansNum.html(), myLi, firstClick = false,
            bbsUslist = $('.bbs-uslist'), noData = $('#noData');

        // 点击关注或者取消关注
        $('#guanzhu').on('click', function () {
            if (firstClick) {
                return;
            }
            bbsbuma({type: 21, pageId: 'mbbsspace', interestuserid: vars.userid });
            firstClick = true;
            var ele = $(this);
            var success = function (data) {
                if (data.result !== '100') {
                    // 用户未登录
                    if (data.result === 'noLog') {
                        win.location = data.url;
                        return;
                    }
                    toastMsg.text(data.result);
                    floatAlert.show();
                    setTimeout(function () {
                        floatAlert.hide();
                    }, 2000);
                    // 加关注
                } else if (ele.html() === '\u52a0\u5173\u6ce8') {
                    ele.html('\u5df2\u5173\u6ce8');
                    fansnum++;
                    fansNum.html(fansnum);
                    // 如果是粉丝页面
                    if (vars.type === 'fs') {
                        myLi = myContainer.find('li');
                        // 之前没人关注
                        if (myLi.length === 0) {
                            bbsUslist.show();
                            noData.hide();
                        }
                        // 如果是第一次切换到状态
                        if (data.data) {
                            myContainer.prepend(data.data);
                        }
                    }
                } else {
                    ele.html('\u52a0\u5173\u6ce8');
                    fansnum--;
                    fansNum.html(fansnum);
                    // 如果是粉丝页面
                    if (vars.type === 'fs') {
                        myLi = myContainer.find('li');
                        // 如果当前就一个粉丝，在点击取消关注，就显示默认无数据div
                        if (myLi.length === 1) {
                            bbsUslist.hide();
                            noData.show();
                        }
                        var nowUser = $('#' + vars.self);
                        // 如果存在当前用户，移除
                        if (nowUser.length > 0) {
                            nowUser.remove();
                        }
                    }
                }
                firstClick = false;
            };
            $.get(vars.bbsSite + '?c=bbs&a=ajaxFollowUser', {
                actionType: ele.html() === '加关注' ? '1' : '10',
                userid: vars.userid,
                city: vars.city
            }, success);
        });

        // 收件箱
        inbox.on('click', function () {
            win.location = vars.bbsSite + '?c=bbs&a=getPersonnelLetter&city=' + vars.city;
        });
        // 草稿箱
        $('#wapbbssy_D04_02').on('click', function () {
            win.location = vars.bbsSite + '?c=bbs&a=getDraftBoxList&city=' + vars.city;
        });
        var pagesize;
        switch (vars.type) {
            // 帖子
            case 'tz':
                myContainer.on('click', 'li', function () {
                    win.location = $(this).attr('data-url');
                });
                if (vars.totalCount < 11) {
                    return;
                }
                pagesize = 10;
                break;
            // 论坛
            case 'lt':
                if (vars.totalCount < 13) {
                    return;
                }
                pagesize = 12;
                break;
            // 关注和粉丝
            case 'gz':
            case 'fs':
                if (vars.totalCount < 22) {
                    return;
                }
                pagesize = 21;
                break;
        }
        loadMore({
            url: vars.bbsSite + '?c=bbs&a=ajaxMyPostList&userid=' + vars.userid + '&city=' + vars.city + '&type=' + vars.type,
            total: vars.totalCount,
            pagesize: pagesize,
            pageNumber: pagesize,
            moreBtnID: '.moreList',
            loadPromptID: '.moreList',
            contentID: '#myContainer',
            loadAgoTxt: '<span><i></i>上拉加载更多</span>',
            loadingTxt: '<span><i></i>努力加载中...</span>',
            loadedTxt: '<span><i></i>上拉加载更多...</span>',
            firstDragFlag: false
        });
    };
});