/**
 * ui改版后的头部导航
 * by WeiRF
 * 20151224 WeiRF 处理购房知识的头部导航
 */
define('navflayer/navflayer_new2', ['jquery'], function (require) {
    "use strict";
    var $ = require("jquery"),
        vars = seajs.data.vars;
    var clickJudge = true;
    var userName = '';
    var headerPosition = $('header').css('position');
    var headerBox = $('.headBox');
    $('.icon-nav').on('click', function () {
        if (clickJudge) {
            clickJudge = false;
            //处理新房详情页的头部固定问题
            if (headerPosition === 'fixed') {
                $('header').css('position', 'relative');
            }
            // 处理新房户型详情页头部
            if (vars.action == 'huXingInfo') {
                $('.header').show();
            }
            // start +++++++++++++++++++modified by zdl处理问答首页的头部
            if ((vars.currentChannel === 'ask' && vars.action === 'index') || (vars.currentChannel === 'bbs' && (vars.action === 'index' || vars.action === 'search'))) {
                $('.search').hide();
            }
            // 处理问答搜索结果页和标签列表页的头部 应为该搜索框没有放在main中
            if (vars.currentChannel === 'ask' && (vars.action === 'search' || vars.action === 'tagAskList' || vars.action === 'seoList')) {
                $('.pdY7').hide();
            }
            // +++++++++++++++end
            // 购房知识导航处理
            $('.nav-top-box').hide();
            $('.main').hide();
            $('#searchid').hide();
            $('.footer').hide();
            $('.crumbs').hide();
            $('.header').show();
            $('.newNav').show();
            $('.floatTel').hide();

            $.get("/public/?c=public&a=ajaxUserInfo", function (o) {
                if (o.nickname) {
                    userName = o.nickname;
                } else if (o.username) {
                    userName = o.username;
                } else {
                    userName = '我的房天下';
                }
                $("#navflayerinfo a").text(userName);
                if (o.nickname || o.username) {
                    getMessage();
                }
            });
        } else {
            // ++++++++++++++++++++++++++++++modified by zdl
            if ((vars.currentChannel === 'ask' && vars.action === 'index') || (vars.currentChannel === 'bbs' && (vars.action === 'index' || vars.action === 'search'))) {
                $('.search').show();
            }
            if (vars.currentChannel === 'ask' && (vars.action === 'search' || vars.action === 'tagAskList' || vars.action === 'seoList')) {
                $('.pdY7').show();
            }
            // +++++++++++++++end
            clickJudge = true;
            // 处理新房详情页改版试验头部
            if (vars.subaction == 'xfinfotjwh') {
                $('.header').hide();
            }
			if (vars.action == 'newPrivilege' || vars.action == 'newPrivilegeOne') {
				$('.floatTel').show();
			}
            if ((vars.currentChannel == 'zf' || vars.currentChannel == 'esf' || vars.currentChannel === 'schoolhouse') && (vars.action == 'detail' ||  vars.action == 'jhdetail') && !vars.issfapp && vars.havePic && parseInt(vars.havePic) !== 0) {
                $('.header').hide();

            }
            if((vars.currentChannel == 'zf' || vars.currentChannel == 'esf' || vars.currentChannel === 'schoolhouse') && vars.action == 'detail' && !vars.issfapp){
                $('.floatTel').show();
            }
            //资讯详情经纪人弹框 20161104 xiejingchao
            if(vars.currentChannel === 'news' && vars.action === 'detail') {
                $('.floatTel').show();
            }
            // 小区和经纪人页点击头部重新回到页面后的底部导航显示问题 20160902 lina
            if(vars.currentChannel === 'xiaoqu' && vars.action === 'xqDetail') {
                $('.header').hide();
                $('.floatTel').show();
            }
            // 经纪人由导航页回到页面不隐藏头部，因为它只有一个头部 20161031 lina
            if(vars.currentChannel === 'agent' && vars.action === 'agentShop') {
                $('.floatTel').show();
            }
            //blog的个人主页特殊处理
            if (headerBox.length) {
                $('header').hide();
            }

            $('header').css('position', headerPosition);
            // 购房知识导航处理
            $('.nav-top-box').show();
            $('.main').show();
            $('#searchid').show();
            $('.footer').show();
            $('.crumbs').show();
            $('.newNav').hide();
        }
    });
    function getMessage() {
        var new_msg_num = 0;
        var storage = vars.localStorage;
        /*获得并显示未读消息数*/
        if (storage) {
            for (var i = 0, len = storage.length; i < len; i++) {
                var key = storage.key(i);
                var his_message = storage.getItem(key);
                if (key.indexOf('_message') > 0 && key != 'chat_messageid') {
                    var history_list = his_message.split(";");
                    var list_size = history_list.length;
                    for (var m = 0; m < list_size; m++) {
                        var message_cont = history_list[m].split(",");
                        if (message_cont[0] == 'r' && message_cont[1] == '0') {
                            new_msg_num++;
                        }
                    }
                }
                if (new_msg_num != 0) {
                    if (new_msg_num > 99) {
                        new_msg_num = 99;
                    }
                    $('#chatallnum').html(new_msg_num).show();
                }
            }
        }
    }

});