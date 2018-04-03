/**
 * 2018楼市大感想活动
 */
define('modules/zhuanti/buildthought', ['jquery', 'swipe/3.10/swiper', 'iscroll/2.0.0/iscroll-lite'], function(require, exports, module){
	'use strict';
	module.exports = function () {
        // jquery库
        var $ = require('jquery');
        // 页面传入的参数
        var vars = seajs.data.vars;
        // 浏览器类型
        var ua = navigator.userAgent.toLowerCase();
        // 微信浏览器
        var isWX = /micromessenger/.test(ua);
        // swiper滚动插件类，！！！这里为实例，不需要new创建
        var Swiper = require('swipe/3.10/swiper');
        // 筛选框插件
        var scrollCtrl = require('iscroll/2.0.0/iscroll-lite');

        /**
         * 提示弹窗
         * @param msg 要显示的文案
         */
        function showMsg(msg) {
            // 意见提交失败的样式,只有网络不好的时候会出现
            var message = $('#tipBox');
            $('#tipMsg').text(msg);
            message.show();
        }
        $("#closeBox").on('click', function(){
            $('#tipBox').hide();
        });
        var file;
        function checkVideo () {
            var size = (file.size/1024/1024).toFixed(2);
            if (size > 300) {
                showMsg('您的视频大于300M了哦，麻烦重新上传');
                reUpload();
                return;
            }
            //弹出上传中的提示
            $('#uploadingTip').show();
            $('#indexPage').hide();
            $('#tagPage').show();
            $('.adbq').on('click', function(){
                $('#tagBox').show();
            });
            $('.close').on('click', function(){
                $('#tagBox').hide();
            });
            // 上传到百度云
            var sdk = baidubce.sdk;
            var VodClient = sdk.VodClient;
            var config = {
                endpoint: 'https://vod.bj.baidubce.com',
                sessionToken: vars.sessionToken,
                credentials: {
                    ak: vars.ak,
                    sk: vars.sk
                }
            };
            var client = new VodClient(config);
            client.createMediaResource('2018楼市大感想活动', '2018楼市大感想活动', file, {transcodingPresetGroupName : 'fang2_mp4_720'})
                // Node.js中<data>可以为一个Stream、<pathToFile>；在浏览器中<data>为一个Blob对象
                .then(function (response) {
                    // 上传完成
                    if (response.body.mediaId) {
                        $('#uploadingTip').hide();
                        $('.bqoutbox span').on('click', function(){
                            var that = $(this);
                            $('#tagBox').hide();
                            $('#tagText').show();
                            $('#tagText').text(that.text());
                        });
                        //限制标题为18字
                        // $("#videoInfo").('change', function(){
                            
                        // });

                        //提交标题及标签
                        $('#subBtn').on('click', function(){
                            var txt = $('#videoInfo').val();
                            if (txt == '' || txt == '请填写视频标题(18字内)') {
                                showMsg('标题不能为空');
                                return;
                            }
                            if (txt.length > 20) {
                                showMsg('标题长度不能超过20个字');
                                return;
                            }
                            var tag = $('#tagText').text();
                            if (tag == '') {
                                showMsg('请选择标签');
                                return;
                            }
                            var data = {'title':encodeURIComponent(txt), 'tag':encodeURIComponent(tag), 'vid':response.body.mediaId};
                            $.ajax({
                                type:'GET',
                                url:vars.zhuantiSite + '?c=zhuanti&a=ajaxUploadVideo',
                                data:data,
                                success:function(data){
                                    if (data.result == '100') {
                                        window.location = vars.zhuantiSite + 'hd/10_videoList.html';
                                    } else {
                                        showMsg(data.msg);
                                    }
                                }
                            });
                        });
                    }
                }).catch(function (error) {
                    showMsg('视频上传失败，请重试');
                    reUpload();
                    // 上传错误
                });
        }
        //重新上传视频
        function reUpload () {
            file = '';
            $('#upload_video').val('');
        }
        function wxAuthorize() {
            // 微信里跳转到用户授权页
            if (isWX) {
                var jumpToSure = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + vars.appid
                     + '&redirect_uri=' + encodeURIComponent(window.location.protocol + vars.zhuantiSite + 'hd/buildingThought.html') + '&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect';
                window.location.href = jumpToSure;
                return false;
            } else {
                // window.location.href = vars.zhuantiSite + 'hd/bootPage.html';
                window.location.href = vars.zhuantiSite + '?c=zhuanti&a=bootPage';
                return false;
            }
        }
        if (vars.openid == '') {
            $('#videoBtn').on('click', function(){
                //先判断微信是否授权，未授权的话先进行微信授权
                wxAuthorize();
            });
        }
        
        $('#upload_video').on('change', function (e) {
            /*先判断是否是在微信浏览器，是的话上传视频，否则跳转到引导页*/
            file = this.files[0];
            checkVideo();
        });
        /*顶部中奖信息轮播效果*/
        var $swipCon = $('.swiper-wrapper');
        var liLen = vars.praiseCount;
        var winWidth = $(document).width();
        //轮播个数
        var bannerCount = vars.praiseCount;
        //判断是否需要轮播
        var isautoplay;
        //判断是否循环滑动
        var isloop;
        if (bannerCount ==  1) {
            isautoplay = 0;
            isloop = false;
        } else {
            isautoplay = 3000;
            isloop = true;
        }
        // 初始化滑动轮播插件
        Swiper('.swiper-container', {
            direction:'vertical',
            loop: true,
            autoplay: 3000,
            speed: 1000,
        });
    };
})