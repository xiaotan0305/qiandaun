/**
 * 问答头部改版
 * Created by lina on 2016/11/7.
 */
define('navflayer/navflayer_new3', ['jquery'], function (require) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;
    var userName = '';
    var headerPosition = $('header').css('position');
    // 导航按钮
    var iconNav = $('.icon-nav');
    // 页面主要内容
    var main = $('.main');
    // 导航页面
    var newNav = $('.newNav');
    // 二级导航
    var headDrop = $('.head-drop');
    var searchObj = $('.search');
    // 点击导航按钮
    iconNav.on('click', function () {
        if (main.is(':visible')) {
            $.get('/public/?c=public&a=ajaxUserInfo', function (o) {
                if (o.nickname) {
                    userName = o.nickname;
                } else if (o.username) {
                    userName = o.username;
                } else {
                    userName = '我的房天下';
                }
                $('#navflayerinfo a').text(userName);
                if (o.nickname || o.username) {
                    getMessage();
                }
            });
            if (headDrop.is(':visible')) {
                headDrop.hide();
            } else {
                headDrop.show();
            }
            $('header').css('position', headerPosition);
        } else {
            headDrop.hide();
            newNav.hide();
            main.show();
            searchObj.show();
            // 处理问答搜索结果页 应为该搜索框没有放在main中
            if (vars.currentChannel === 'ask' && (vars.action === 'search-more' || vars.action === 'seoList')) {
                $('.pdY7').show();
                if (vars.action === 'search-more') {
                    $('.topserch').show()
                    $('.askSearchBox').show();
                }
            }
            // 处理问答标签列表页面包屑
            if (vars.action === 'asktaglist') {
                $('.pt7').show();
            }
        }
    });
    // 点击次级导航里的频道导航
    var navBtn = $('.navli');
    navBtn.on('click', function () {
        // 导航页面显示
        newNav.show();
        // 隐藏搜索框
        searchObj.hide();
        // 主页面隐藏
        main.hide();
        // 二级导航页面隐藏
        headDrop.hide();
        // 处理问答搜索结果页和标签列表页的头部 应为该搜索框没有放在main中
        if (vars.currentChannel === 'ask' && (vars.action === 'search-more' || vars.action === 'seoList')) {
            $('.pdY7').hide();
            if (vars.action === 'search-more') {
                $('.topserch').hide()
                $('.askSearchBox').hide();
            }
        }
        // 处理问答标签列表页面包屑
        if (vars.action === 'asktaglist') {
            $('.pt7').hide();
        }
    });
    function getMessage() {
        var new_msg_num = 0;
        var storage = vars.localStorage;
        // 获得并显示未读消息数
        if (storage) {
            for (var i = 0, len = storage.length; i < len; i++) {
                var key = storage.key(i);
                var his_message = storage.getItem(key);
                if (key.indexOf('_message') > 0 && key !== 'chat_messageid') {
                    var history_list = his_message.split(';');
                    var list_size = history_list.length;
                    for (var m = 0; m < list_size; m++) {
                        var message_cont = history_list[m].split(',');
                        if (message_cont[0] === 'r' && message_cont[1] === '0') {
                            new_msg_num++;
                        }
                    }
                }
                if (new_msg_num !== 0) {
                    if (new_msg_num > 99) {
                        new_msg_num = 99;
                    }
                    $('#chatallnum').html(new_msg_num).show();
                }
            }
        }
    }
});