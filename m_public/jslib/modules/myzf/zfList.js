/**
 * lina 20121220
 * 写字楼发布增加分享功能
 */
define('modules/myzf/zfList', ['jquery', 'modules/zf/yhxw', 'modules/myzf/zfListPublic'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var yhxw = require('modules/zf/yhxw');
        // 引入个人中心和列表页公共js
        require('modules/myzf/zfListPublic');

        // 点击头部的浮层关闭按钮
        $('.zf-close').on('click', function () {
            $('.zf-tz').hide();
        });

        // 在线房源
        var $onlineTab = $('#online');
        // 审核中房源
        var $pendingTab = $('#pending');
        // 删除房源
        var $deleteTab = $('#delete');
        // 在线房源列表
        var $onlineList = $('#onlinelist');
        // 审核中房源列表
        var $pendingList = $('#opendinglist');
        // 删除房源列表
        var $deleteList = $('#deletelist');

        $onlineTab.on('click', function () {
            $onlineList.show();
            $pendingList.hide();
            $deleteList.hide();
            $deleteTab.removeClass('active');
            $pendingTab.removeClass('active');
            $onlineTab.addClass('active');
        });

        $pendingTab.on('click', function () {
            $pendingList.show();
            $onlineList.hide();
            $deleteList.hide();
            $deleteTab.removeClass('active');
            $pendingTab.addClass('active');
            $onlineTab.removeClass('active');
        });

        $deleteTab.on('click', function () {
            $deleteList.show();
            $pendingList.hide();
            $onlineList.hide();
            $deleteTab.addClass('active');
            $pendingTab.removeClass('active');
            $onlineTab.removeClass('active');
        });


        // 统计用户浏览动作
        yhxw({type: 0, pageId: 'muchelpsellmanager', curChannel: 'myzf'});

        // 带短信链接的显示置顶红包弹框
        var $msgFloat = $('#msgFloat');
        if ($msgFloat.length > 0) {
            $msgFloat.on('click', '.btnRed', function () {
                $msgFloat.hide();
            });
        }
    };
});
