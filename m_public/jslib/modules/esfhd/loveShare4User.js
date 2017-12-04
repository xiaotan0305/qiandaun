/**
 * 爱分享活动
 */
define('modules/esfhd/loveShare4User', ['jquery', 'jquerySuperSlide/1.0.0/superSlide', 'weixin/2.0.0/weixinshare', 'superShare/2.0.0/superShare', 'swipe/3.10/swiper','app/1.0.0/appdownload'], function (require, exports, module) {
    'use strict';
    module.exports = function (option) {
        // jquery库
        var $ = require('jquery');
        // 页面传入的参数
        var vars = seajs.data.vars;

        // 浮层提示控制
        function displayLose(time, keywords, url) {
            $('#sendText').text(keywords).show();
            $('#sendFloat').show();
            setTimeout(function () {
                $('#sendFloat').hide();
                if (url) {
                    window.location.href = url;
                }
            }, time);
        }

        var UA = navigator.userAgent.toLowerCase();

        var $ = require('app/1.0.0/appdownload');
        $('.openapp').openApp();
        if (vars.from === 'wapsharehd') {
            require.async('../js/autoopenapp_sfut.js');
        }

        if (UA.indexOf('iphone') > -1) {
            $('.list-con').css('display', 'block');
            $('.ewms').css('display', 'none');
            $('.list-bot').find('p').text('');
        } else {
            $('.list-con').css('display', 'none');
            $('.ewms').css('display', 'block');
            $('.list-bot').find('p').text('扫描二维码下载房APP参与');
        }

        //滚动效果
        require('jquerySuperSlide/1.0.0/superSlide');
        $(".picMarquee-top").slide({
            mainCell: ".bd ul",
            autoPlay: true,
            effect: "topMarquee",
            vis: 5,
            scroll: 1,
            interTime: 30,
        });

        var sharebg = $('.x-share-bg');
        var lingqu = $('.lingqu');
        var haddown = $('.haddown');
        var hadjoin = $('.hadjoin');
        var uncommonIMEI = $('.uncommonIMEI');
        var close = $('.x-share-closenew');
        var innew = $('.innew');

        close.on('click', function () {
            sharebg.hide();
            lingqu.hide();
            uncommonIMEI.hide();
            haddown.hide();
            hadjoin.hide();
        });

        innew.on('click', function () {
            sharebg.hide();
            lingqu.hide();
            uncommonIMEI.hide();
            haddown.hide();
            hadjoin.hide();
        });


        //分享内容
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
            title: shareA.attr('newsline'),
            // 副标题
            desc: '',
            // 分享时的图标
            image: shareA.attr('imgpath'),
            // 分享的链接地址
            url: shareA.attr('jumpath'),
            // 分享的内容来源
            from: ' —房天下'
        };
        var superShare = new SuperShare(config);
        // 更新配置函数
        shareA.on('click', function () {
            superShare.share();
        });

        //防止连续点击
        var subflag = true;
        //提现操作
        $('.tixian').on('click', function () {
            if ($(this).hasClass('disabled')) {
                return false;
            }
            if (subflag) {
                subflag = false;
                $.ajax({
                    url: vars.esfSite + '?c=esfhd&a=ajaxAddAwardExtOrder&city=' + vars.city,
                    dataType: 'json',
                    success: function (data) {
                        if (data.errcode === '100') {
                            displayLose(2000, data.errmsg, window.location.href);
                        } else {
                            displayLose(2000, data.errmsg);
                        }
                        subflag = true;
                    },
                    error:  function () {
                        displayLose(2000, '请求失败');
                        subflag = true;
                    },
                });
            }
        });


        //点击给我留言按钮操作
        $('#chat').on('click', function () {
            var data = $(this).attr('data-chat');
            var dataArr = data.split(',');
            if (vars.sfAgent) {
                dataArr[6] = vars.sfAgent[$.trim(dataArr[10])].replace('转', '-');
            }
            chatWeituo(dataArr[0], dataArr[1], dataArr[2], dataArr[3], dataArr[4], dataArr[5]
                , dataArr[6], dataArr[7], dataArr[8], dataArr[9], dataArr[10], dataArr[11], dataArr[12], dataArr[13]);
        });
        function chatWeituo(zhcity, city, housetype, houseid, newcode, type, phone, channel, uname, aname, agentid, order, photourl, housefrom) {
            var paramPurpose = '';
            if ($.trim(vars.purpose) === '写字楼') {
                paramPurpose = 'xzl';
            } else if ($.trim(vars.purpose) === '商铺') {
                paramPurpose = 'sp';
            }
            setTimeout(function () {
                window.location = '/chat.d?m=chat&username=' + uname + '&city=' + city
                    + '&type=wapesf&houseid=' + houseid + '&purpose=' + paramPurpose + '&housetype='
                    + housetype;
            }, 500);
        }
    }
});