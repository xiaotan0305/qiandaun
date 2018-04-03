/**
 * 我要砍价
 */
define('modules/pinggu/iBargin', ['jquery', 'util/util', 'weixin/2.0.0/weixinshare', 'superShare/2.0.0/superShare', 'swipe/3.10/swiper'], function (require, exports, module) {
    'use strict';
    module.exports = function (option) {
        // jquery库
        var $ = require('jquery');
        // 页面传入的参数
        var vars = seajs.data.vars;
        // 引入getcookie函数
        var myCookie = require('util/util');
        // 设置cookie函数
        var setCookie = function (name, value, days) {
            document.cookie = name + '=' + encodeURIComponent(value) + '; path=/; expires=' + days;
        };
        var islogin = myCookie.getCookie('sfut');

        //****分享内容****
        var shareA = $('.share');
        //微信分享，调用微信分享的插件
        var Weixin = require('weixin/2.0.0/weixinshare');
        var wx = new Weixin({
            debug: false,
            shareTitle: vars.title,
            // 副标题
            descContent: vars.description,
            lineLink: vars.jumpath,
            imgUrl: vars.imgpath,
            swapTitle: false
        });
        // 普通分享
        var SuperShare = require('superShare/2.0.0/superShare');
        var config = {
            // 分享的内容title
            title: vars.title,
            // 副标题
            desc: vars.description,
            // 分享时的图标
            image: vars.imgpath,
            // 分享的链接地址
            url: vars.jumpath,
            // 分享的内容来源
            from: ' —房天下'
        };
        var superShare = new SuperShare(config);
        // 更新配置函数
        shareA.on('click', function () {
            superShare.share();
        });

        //****滚动条****//
        var Swiper = require('swipe/3.10/swiper');
        var mySwiper = new Swiper('.kjlist', {
            autoplay: 3000,//可选选项，自动滑动
            loop:true,
            direction: 'vertical',
            autoplayDisableOnInteraction : false,
            observer:true,
            observeParents:true,
        });

        //****提示弹窗等*****//
        var moredes = $('.deswenan1');//查看更多
        var tologin = $('#tologin');//去登录框
        var ques = $('#question');//问号解释
        //文案详情
        var resxq = $('.resxq');
        var wenan1part = $('#wenan1part');
        //点击问号解释
        $('.doubt').on('click', function (e) {
            e.stopPropagation();
            ques.show();
        })
        //点击查看更多
        moredes.on('click', function () {
            if (islogin) {
                resxq.show();
                wenan1part.hide();
            } else {
                tologin.show();
            }
        });
        //点击登录
        $('.login').on('click', function(){
            window.location.href = 'https://m.fang.com/passport/login.aspx?burl=' + encodeURIComponent(window.location.href);
        })
        //点击关闭
        $('.shut').on('click', function(){
            tologin.hide();
            ques.hide();
        })
        //房源详情
        $(".houseList2").on('click', function(){
            window.location.href = vars.detailurl;
        })

        //****点击给我留言按钮操作****//
        $('.chat').on('click', function () {
            if (islogin) {
                var data = $(this).attr('data-chat');
                var dataArr = data.split(',');
                chatWeituo(dataArr[0], dataArr[1], dataArr[2], dataArr[3], dataArr[4], dataArr[5], dataArr[6], dataArr[7], dataArr[8]);
            } else {
                tologin.show();
            }
        });
        function chatWeituo(city, housetype, houseid, purpose, type, uname, groupid, content, link) {
            var paramPurpose = '';
            if ($.trim(purpose) === '写字楼') {
                paramPurpose = 'xzl';
            } else if ($.trim(purpose) === '商铺') {
                paramPurpose = 'sp';
            }
            setTimeout(function () {
                window.location = '/chat.d?m=chat&username=' + uname + '&city=' + city + '&type=wap' + type
                    + '&houseid=' + houseid + '&purpose=' + paramPurpose + '&housetype=' + housetype + '&groupid='
                    + groupid + '&content=' + content + '&link=' + link;
            }, 500);
        }

        //****点击评估时带入页面数据****//
        $('.kjpg').on('click', function () {
            if (vars.localStorage) {
                // 评估数据
                var data = {
                    Forward: vars.forward,
                    Area: vars.area,
                    zfloor: vars.zfloor,
                    Floor: vars.floor,
                    Room: vars.room,
                    Hall: vars.hall,
                    projname: vars.projname,
                    newcode: vars.plotid,
                };
                var jsonStr = JSON.stringify(data);
                vars.localStorage.setItem('kjpgInfo', jsonStr);
            }
            setTimeout(function () {
                window.location = vars.pingguSite + vars.city + '/';
            }, 500);
        });
    }
});