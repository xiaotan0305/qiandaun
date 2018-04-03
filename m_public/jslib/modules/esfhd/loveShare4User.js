/**
 * 爱分享活动
 */
define('modules/esfhd/loveShare4User', ['jquery','lazyload/1.9.1/lazyload', 'clipboard/1.0.0/clipboard.min', 'jquerySuperSlide/1.0.0/superSlide', 'weixin/2.0.0/weixinshare', 'superShare/2.0.0/superShare', 'swipe/3.10/swiper','app/1.0.0/appdownload'], function (require, exports, module) {
    'use strict';
    module.exports = function (option) {
        // jquery库
        var $ = require('jquery');
        // 页面传入的参数
        var vars = seajs.data.vars;

        require('lazyload/1.9.1/lazyload');
        $('.lazyload').lazyload();

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

        //****复制插件****
        //var clipboard = new Clipboard('#copy_input');
        var clipboard = new Clipboard('#copy_input', {
            // 点击copy按钮，直接通过text直接返回复印的内容
            text: function() {
                return $.trim($('#mytext').html());
            }
        });
        clipboard.on('success', function(e) {
            console.log(e);
            displayLose(2000, '复制成功');
        });
        clipboard.on('error', function() {
            displayLose(2000, '复制失败');
        });

        //****滚动效果****
        require('jquerySuperSlide/1.0.0/superSlide');
        $(".picMarquee-top").slide({
            mainCell: ".bd ul",
            autoPlay: true,
            effect: "topMarquee",
            vis: 5,
            scroll: 1,
            interTime: 30,
        });

        $(".picMarquee-left").slide({
            mainCell: ".bd",
            autoPlay: true,
            effect: "leftMarquee",
            vis: 1,
            scroll: 1,
            interTime: 10,
        });

        //****浮层提示控制****
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

        //****根据UA切换二维码领取按钮等****
        var UA = navigator.userAgent.toLowerCase();
        var $ = require('app/1.0.0/appdownload');
        $('.openapp').openApp();
        if (vars.from === 'wapsharehd') {
            require.async('../js/autoopenapp_sfut.js');
        }
        if (UA.indexOf('iphone') > -1) {
            $('.ll-con').css('display', 'block');
            $('.mode-ll-cen1').css('display', 'none');
            $('.mode-ll-bot1').css('display', 'none');
        } else {
            $('.ll-con').css('display', 'none');
            $('.mode-ll-cen1').css('display', 'block');
            $('.mode-ll-bot1').find('p').text('扫描二维码下载房APP参与');
        }

        //*****自定义弹框提示*****
        //背景遮罩等
        var sharebg = $('.x-share-bg'), lingqu = $('.lingqu'), haddown = $('.haddown'), hadjoin = $('.hadjoin'),
        uncommonIMEI = $('.uncommonIMEI'), close = $('.x-share-closenew'), innew = $('.innew');
        //专属码等
        var myexcode = $('#myexcode'), mychoice = $('#mychoice'), alterbox = $('.altertx');
        //*****t弹窗操作*****
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
        sharebg.on('click', function () {
            sharebg.hide();
            lingqu.hide();
            uncommonIMEI.hide();
            haddown.hide();
            hadjoin.hide();
            alterbox.hide();
        });

        //*****提现操作*****
        //防止连续点击
        var subflag = true;
        $('.tixian').on('click', function () {
            if ($(this).hasClass('disabled')) {
                return false;
            }
            sharebg.show();
            alterbox.show();
        });
        $('.fr, .fl').on('click', function () {
            if ($(this).hasClass('btn-gray')) {
                return false;
            }
            var extype;
            if ($(this).hasClass('fl')) {
                extype = 1;
            } else if ($(this).hasClass('fr')) {
                extype = 2;
            }
            if (subflag) {
                subflag = false;
                $.ajax({
                    url: vars.esfSite + '?c=esfhd&a=ajaxAddAwardExtOrder&city=' + vars.city + '&type=' + extype,
                    dataType: 'json',
                    success: function (data) {
                        if (data.errcode === '100') {
                            displayLose(2000, data.errmsg, window.location.href);
                        } else {
                            sharebg.hide();
                            alterbox.hide();
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

        //****点击获取流量及提交操作****
        //防止连续点击
        var subflag2 = true;
        $(".get-btn, .submit-btn").on('click', function () {
            var param = {
                code: vars.code,
                prevAgentId: vars.agentid,
                houseid: vars.houseid,
                housetype: vars.housetype,
                channel: vars.channel,
                excode: $('#subtext').val() || '',
            };
            if (subflag2) {
                subflag2 = false;
                $.ajax({
                    url: vars.esfSite + '?c=esfhd&a=ajaxGiveFlow&city=' + vars.city,
                    data: param,
                    dataType: 'json',
                    success: function (data) {
                        if (data.errcode === '100') {
                            sharebg.show();
                            lingqu.show();
                            mychoice.hide();
                            myexcode.show();
                            updateUstMsg(data.flowResult);
                        } else if (data.errcode === '101') {
                            sharebg.show();
                            uncommonIMEI.show();
                            mychoice.hide();
                            myexcode.show();
                        } else if (data.errcode === '102') {
                            sharebg.show();
                            haddown.show();
                            mychoice.hide();
                            myexcode.show();
                        } else if (data.errcode === '103') {
                            sharebg.show();
                            hadjoin.show();
                            mychoice.hide();
                            myexcode.show();
                        } else {
                            displayLose(2000, data.errmsg);
                        }
                        subflag2 = true;
                    },
                    error:  function () {
                        displayLose(2000, '请求失败');
                        subflag2 = true;
                    },
                });
            }
        });


        ///******更新用户信息******
        function updateUstMsg(flowResult) {
            $('#sum').html(flowResult.sum + 'M');
            $('#leftsum').html(flowResult.leftsum + 'M');
            $('.bg-on').css('width', flowResult.leftPer4usr + '%');
            $('.bg-on').find('span').html(flowResult.sum + 'M');
            if (parseInt(flowResult.leftwithdrawflow) < parseInt(flowResult.flowUnit)) {
                $('.bg2').css('display', 'none');
                $('.tixian').addClass('disabled');
                $('.pick').find('.fl').addClass('btn-gray');
                $('.pick').find('.fr').addClass('btn-gray');
            } else {
                $('.tixian').removeClass('disabled');
                $('.pick').find('.fl').removeClass('btn-gray');
                $('.pick').find('.fl').addClass('btn-blue');
                $('.pick').find('.fr').removeClass('btn-gray');
                $('.pick').find('.fr').addClass('btn-blue');
            }
            $('.first').find('.num').html(flowResult.sumWithdraw + 'M');
            $('.last').find('.num').html((parseInt(flowResult.sumWithdraw) + parseInt(flowResult.flowUnit))+ 'M');
            $('.invite').find('p span').html(flowResult.sum + 'M');
        }



        //****点击给我留言按钮操作****
        $('#chat').on('click', function () {
            var data = $(this).attr('data-chat');
            var dataArr = data.split(',');
            chatWeituo(dataArr[0], dataArr[1], dataArr[2], dataArr[3], dataArr[4], dataArr[5]);
        });
        function chatWeituo(city, housetype, houseid, purpose, type, uname) {
            var paramPurpose = '';
            if ($.trim(purpose) === '写字楼') {
                paramPurpose = 'xzl';
            } else if ($.trim(purpose) === '商铺') {
                paramPurpose = 'sp';
            }
            setTimeout(function () {
                window.location = '/chat.d?m=chat&username=' + uname + '&city=' + city + '&type=wap' + type
                    + '&houseid=' + houseid + '&purpose=' + paramPurpose + '&housetype=' + housetype;
            }, 500);
        }
    }
});