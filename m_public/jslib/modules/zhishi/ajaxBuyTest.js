/**
 * 购房资格测试界面
 * create by zhangjinyu
 * 20160509
 */
define('modules/zhishi/ajaxBuyTest', ['jquery', 'weixin/2.0.0/weixinshare'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        // jquery库
        var $ = require('jquery');
        // 页面传入的参数
        var vars = seajs.data.vars;
        // 点击选择城市
        var $cityButton = $('.tcity');
        var url = vars.zhishiSite + '?c=zhishi&a=ajaxBuyTest&cityname=';
        $cityButton.on('click', function(){
            var $that = $(this);
            $that.addClass('now');
            $that.siblings().removeClass('now');
            window.location.href = url + $that.text() + '&src=client';
        });
        // 错误浮层
        var tsBox = $('.ts-box');
        // 显示错误浮层
        var showErr = function (msg) {
            tsBox.html(msg);
            tsBox.show();
            setTimeout(function () {
                tsBox.hide();
            }, 2000);
        };
        // 整个问题及答案的容器
        var $answerBox = $('.answerBox');
        var $url = '', field = '';
        var row = 0, startNum = 0, endNum = 0;
        var cityname = vars.cityname;
        //下一步操作
        $answerBox.on('click','a' ,function(){
            var $that = $(this);
            startNum = $answerBox.find('#startNum').val();
            row = $answerBox.find('#row').val();
            endNum = $answerBox.find('#endNum').val();
            field = $that.text();
            if (!field) {
                showErr('请选择您的答案~~');
                return false;
            }
            $url = vars.zhishiSite + '?c=zhishi&a=ajaxGetPage';
            $.ajax({
                type : 'GET',
                url : $url,
                data : {
                    cityname : cityname,
                    field : field,
                    row : row,
                    startNum : startNum,
                    endNum : endNum
                },
                success : function(data){
                    if (data) {
                        $answerBox.html(data);
                    }
                }
            });
        });
        // 获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
        // 微信分享
        var summary = vars.d;
        var title = vars.t;
        var imgUrl = 'http:' + vars.public + '201511/images/zsBuyTest.jpg';
        var shareUrl = location.href;
        var Weixin = require('weixin/2.0.0/weixinshare');
        var wx = new Weixin({
            debug: false,
            shareTitle: title,
            // 副标题
            descContent: summary,
            lineLink: shareUrl,
            imgUrl: imgUrl,
            swapTitle: false
        });
        // 搜索城市功能
        // 每个城市的P标签
        var $allCity = $('.scity');
        var $inCity = '';
        var $zhcity = '';
        var $encity = '';
        // 包含所有城市的div
        var $cityBox = $('#cityBox');
        // 无结果时需要展示的文案
        var $errorBox = $('#resultNone');
        var $that;
        var flag = 0;
        $('#searchIn').on('input', function(e){
            $inCity = $(this).val();
            // 输入昆山展示苏州，因为苏州里面包括昆山市
            if ($inCity === '昆山') {
                $inCity = '苏州';
            }
            if (/^[\u4e00-\u9fa5]+$/.test($inCity)){
                $allCity.hide();
                $allCity.each(function(){
                    $that = $(this);
                    $zhcity = $that.text();
                    if ($zhcity.indexOf($inCity) === 0) {
                        $that.show();
                        $cityBox.show();
                        $errorBox.hide();
                        flag = 1;
                    }
                });
                if (!flag) {
                    $errorBox.show();
                    $cityBox.hide();
                }
            } else if (/^\s*$/.test($inCity)) {
                $allCity.show();
                $cityBox.show();
                $errorBox.hide();
            } else if (/^[a-zA-Z]+$/.test($inCity)) {
                $inCity.toLowerCase();
                $allCity.hide();
                $allCity.each(function(){
                    $that = $(this);
                    $encity = $that.attr('id').split('-');
                    if ($encity[0].indexOf($inCity) === 0) {
                        $cityBox.show();
                        $that.show();
                        flag = 1;
                    } else if ($encity[1].indexOf($inCity) === 0) {
                        $cityBox.show();
                        $that.show();
                        flag = 1;
                    }
                });
                if (!flag) {
                    $errorBox.show();
                    $cityBox.hide();
                }
            } else {
                $errorBox.show();
                $cityBox.hide();
            }
        });
    };
});
