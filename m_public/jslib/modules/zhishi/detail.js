/**
 * 知识详情页
 * by blue
 * 20150923 blue 整理代码，删除冗长代码，提高代码效率，修改搜索为最新知识搜素主类，滑动轮播类更换为3.10版本
 */
define('modules/zhishi/detail', ['jquery', 'superShare/1.0.1/superShare', 'lazyload/1.9.1/lazyload', 'iscroll/2.0.0/iscroll-lite', 'modules/zhishi/zhishibuma', 'swipe/3.3.1/swiper'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        // jquery库
        var $ = require('jquery');
        // 从页面获取的参数
        var vars = seajs.data.vars;
        // 用于热combo的数组
        var preload = [];
        // 插入滑动轮暴插件
        preload.push('swipe/3.10/swiper');
        // 判断是否localStorage可用，可用则插入查看历史和收藏js
        preload.push('modules/zhishi/viewhistory');
        // 加载需要合并的js类
        require.async(preload);
        // 用户行为对象
        var zhishibuma = require('modules/zhishi/zhishibuma');
        // 图片惰性加载
        require.async("lazyload/1.9.1/lazyload", function () {
            $('.lazyload').lazyload();
        });
        var Swiper = require('swipe/3.3.1/swiper');
        
        
        // 浏览历史
        require.async('modules/zhishi/viewhistory', function (a) {
            if (vars.hasOwnProperty('id') && vars.id > 0) {
                a.record(vars.id);
            }
        });
        // 根据vars.jtname 判断集团名称
        var jtName;
        switch (vars.jtname) {
            case 'xf':
                jtName = '新房网';
                break;
            case 'esf':
                jtName = '二手房网';
                break;
            case 'jiaju':
                jtName = '家居网';
                break;
            case 'zf':
                jtName = '租房网';
                break;
        }

        var main = $('.main');
        var curSec;
        var curObj;
        var n = vars.id;
        var $doc = $(document);
        // +++++++++++++++

        /**
         * 为了方便解绑事件，声明一个阻止页面默认事件的函数
         * @param e
         */
        function pdEvent(e) {
            e.preventDefault();
        }

        /**
         * 禁止页面滑动
         */
        function unable() {
            $doc.on('touchmove', pdEvent);
        }

        /**
         * 允许页面滑动
         */
        function enable() {
            $doc.off('touchmove', pdEvent);
        }

        /**
         * 设置赞踩新数量
         * @param objMid 页面中部赞踩span
         * @param objDown 页面底部赞踩span
         * @param num 要设置的新数量
         */
        var setDingCaiNumVal = function (objMid, objDown, num) {
            objMid.text('（' + num + '）');
            if (vars.sf_source != 'baidumip') {
                objDown.text(num);
            }
        };
        (function () {
            /**
             * 用户行为统计及发送ajax到后台
             * @param type 赞踩（赞为0，其余为踩）
             * @param zhishiId 知识编号
             */

            function getPraiseNum(type, zhishiId) {
                // type-> 0:zan 1:cai
                var prms = {};
                prms.id = zhishiId;
                if (type === 0) {
                    prms.useful = 'zan';
                    // 55:赞
                    zhishibuma({zsid: vars.id, pageType: 'mzspage', b: 55});
                } else {
                    prms.useful = 'cai';
                    // 56:踩
                    zhishibuma({zsid: vars.id, pageType: 'mzspage', b: 56});
                }

                // 向后台发送ajax
                $.getJSON(vars.zhishiSite + '?c=zhishi&a=ajaxSetIsUseful&r=' + Math.random(), {
                    id: prms.id,
                    useful: prms.useful
                });
            }

            /**
             * 页面中间部分的赞踩
             */
            function addPraiseFn() {
                var $that = $(this);
                // 当前文章的section
                curSec = $that.parents('section');
                // 区分赞踩，赞是0，其余为踩
                var order = $that.index();
                // 存放赞踩数量的span
                var currentClickSpan = $that.find('span');
                // 改变赞踩状态的a标签
                var currentClickA = $that.find('a');
                // 知识的编号
                var zhishiId = currentClickA.attr('zhishiid');
                // 页面底部的赞踩按钮可以改变状态的a标签
                var dingDownObj = curSec.find('.dingDown a');
                var caiDownObj = curSec.find('.caiDown a');
                // 如果当前编号的知识被点过赞踩（包括页面中部和底部），则无法再点，除非刷新该页面
                if (currentClickA.hasClass('dis') || $that.siblings('.caiMid,.dingMid').find('.dis')[0] || dingDownObj.hasClass('cur') || caiDownObj.hasClass('cur')) {
                    return;
                }
                // 把当前知识页面中部所点的赞或踩改变class为cur
                if (vars.sf_source != 'baidumip') {
                    currentClickA.removeClass('dis').addClass('cur');
                    // 上次的需求，把当前所点的按钮边框变样式
                    setTimeout(function () {
                        currentClickA.css('border', '1px solid #df3031');
                    }, 200);
                } else {
                    currentClickA.removeClass('dis');
                }
                
                // 计算赞或踩的数量
                var currentNum = 0;
                var currentMatchNum = currentClickSpan.html().match(/(\d+)/);
                if (currentMatchNum) {
                    currentNum = currentMatchNum[1];
                }
                currentNum = parseInt(currentNum);
                // 用户行为统计及向后台发送ajax
                getPraiseNum(order, zhishiId);
                // order=0代表如果当前所点的是赞
                if (order === 0) {
                    // 点了中部的赞，则要找到底部的赞，从而同时改变两个赞的数量
                    curObj = curSec.find('.dingDown span');
                    // 点了中部的赞，需要把底部的赞踩的状态保持和中部一致
                    caiDownObj.addClass('cur').removeClass('dis');
                    dingDownObj.addClass('dis').removeClass('cur');
                    // 点了中部的赞，则需要把中部的踩置灰
                    if (vars.sf_source != 'baidumip') {
                        $that.siblings('.caiMid').find('a').addClass('dis').removeClass('cur');
                    } else {
                        //应该是在点了赞之后，踩和赞都置灰感觉才对呀。。。
                        $('.caiMid').find('a').addClass('dis');
                        $('.dingMid').find('a').addClass('dis');
                    }
                    
                } else {
                    // 点了中部的踩，则要找到底部的踩，从而同时改变两个踩的数量
                    curObj = curSec.find('.caiDown span');
                    // 点了中部的踩，需要把底部的赞踩的状态保持和中部一致
                    caiDownObj.addClass('dis').removeClass('cur');
                    dingDownObj.addClass('cur').removeClass('dis');
                    // 点了中部的踩，则需要把中部的赞置灰
                    if (vars.sf_source != 'baidumip') {
                        $that.siblings('.dingMid').find('a').addClass('dis').removeClass('cur');
                    } else {
                        $('.caiMid').find('a').addClass('dis');
                        $('.dingMid').find('a').addClass('dis');
                    }
                }
                // 同时改变中部和底部的踩赞的数量
                setDingCaiNumVal(currentClickSpan, curObj, parseInt(currentNum + 1));
            }

            /**
             * 页面底部的赞踩（解释通同上addPraiseFn）
             */
            function addPraiseFnDown() {
                var $that = $(this);
                curSec = $that.parents('section');
                var order = $that.index();
                var zhishiId = $that.attr('zhishiid');
                var currentClickSpan = $that.find('span');
                var dingMidObj = curSec.find('.dingMid a');
                var caiMidObj = curSec.find('.caiMid a');
                if ($that.hasClass('cur') || $that.siblings('.caiDwon,.dingDown').find('.cur')[0] || dingMidObj.hasClass('dis') || caiMidObj.hasClass('dis')) {
                    return;
                }
                if (vars.sf_source != 'baidumip') {
                    $that.find('a').removeClass('cur').addClass('dis');
                } else {
                    $that.find('a').addClass('dis');
                }
                var currentNum = 0;
                var currentMatchNum = currentClickSpan.html().match(/(\d+)/);
                if (currentMatchNum) {
                    currentNum = currentMatchNum[1];
                }
                currentNum = parseInt(currentNum);
                getPraiseNum(order, zhishiId);

                if (order === 0) {
                    curObj = curSec.find('.dingMid span');
                    dingMidObj.addClass('cur').removeClass('dis');
                    caiMidObj.addClass('dis').removeClass('cur');
                    $that.siblings('.caiDown').find('a').addClass('cur').removeClass('dis');
                } else {
                    curObj = curSec.find('.caiMid span');
                    dingMidObj.addClass('dis').removeClass('cur');
                    caiMidObj.addClass('cur').removeClass('dis');
                    $that.siblings('.dingDown').find('a').addClass('cur').removeClass('dis');
                }
                setDingCaiNumVal(curObj, currentClickSpan, parseInt(currentNum + 1));
            }

            // 中部点赞
            main.on('click', '.dingMid,.caiMid', addPraiseFn);
            // 底部悬浮点赞
            main.on('click', '.dingDown,.caiDown', addPraiseFnDown);

            /**
             * 微信分享成功的回调函数
             */
            function callback() {
                $('#sha' + n).show();
                $('.share-s2').hide();
                unable();
            }

              // 微信分享
            var ua = navigator.userAgent.toLowerCase();
            var weixin;
            var shareA = $('.share');
            if (ua.indexOf('micromessenger') > -1) {
                require.async('weixin/2.0.0/weixinshare', function (Weixin) {
                    weixin = new Weixin({
                        debug: false,
                        // 必填，公众号的唯一标识
                        appId: vars.appId,
                        // 必填，生成签名的时间戳
                        timestamp: vars.timestamp,
                        // 必填，生成签名的随机串
                        nonceStr: vars.nonceStr,
                        // 必填，签名，见附录1
                        signature: vars.signature,
                        shareTitle: '【' + shareA.attr('newsline') + ' 】',
                        descContent: shareA.attr('newsSummary').substring(0, 64) + '...',
                        lineLink: location.href,
                        imgUrl: location.protocol + shareA.attr('imgpath')
                    }, callback);
                });
            }

            var SuperShare = require('superShare/1.0.1/superShare');
            var config = {
                // 分享的内容title
                title: '【' + shareA.attr('newsline') + ' 】',
                // 分享时的图标
                image: location.protocol + shareA.attr('imgpath'),
                // 分享内容的详细描述
                desc: shareA.attr('newsSummary').substring(0, 64) + '...',
                // 分享的链接地址
                url: location.href,
                // 分享的内容来源
                from: ' —搜房' + vars.cityname + jtName
            };
            var configWx = {};
            var superShare = new SuperShare(config);

            function shareFn() {
                var summary = ' —房天下' + vars.cityname + jtName;
                var title = $(this).attr('newsSummary').substring(0, 64) + '...';
                var PicUrl = location.protocol + $(this).attr('imgpath');
                var titlesina = '【' + $(this).attr('newsline') + ' 】';
                config = {
                    title: titlesina,
                    image: PicUrl,
                    desc: title,
                    url: location.href,
                    from: summary
                };
                configWx = {
                    debug: false,
                    // 必填，公众号的唯一标识
                    appId: vars.appId,
                    // 必填，生成签名的时间戳
                    timestamp: vars.timestamp,
                    // 必填，生成签名的随机串
                    nonceStr: vars.nonceStr,
                    // 必填，签名，见附录1
                    signature: vars.signature,
                    shareTitle: titlesina,
                    descContent: title,
                    lineLink: location.href,
                    imgUrl: PicUrl
                };
                // console.log(config.successCallback);
                // superShare.showMsg('111', '1000', callback);
                if (ua.indexOf('micromessenger') > -1) {
                    weixin.updateOps(configWx);
                } else {
                    superShare.updateConfig(config);
                }
            }

            main.on('click', '.share', shareFn);
        })();
 
        // 底部内链导航
        function addSwInfo(id) {
            var points = $('.' + id).find('.pointBox').find('span');
            Swiper('.' + id, {
                // 切换速度
                speed: 500,
                // 循环
                loop: false,
                onSlideChangeStart: function (swiper) {
                    points.eq(swiper.activeIndex).addClass('cur').siblings().removeClass('cur');
                }
            });
        }
        // 初始化导航信息(按钮以及模块内容)
        var navi = $('.typeListB'),
            seoTab = $('.tabNav');
        if (navi.length && seoTab.length) {
            var firstB = $('.overboxIn').find('a').eq(0),
                firId = firstB.attr('data-id');
            firstB.addClass('active');
            $('.' + firId).show();
            addSwInfo(firId);
            // 切换导航部分模块
            seoTab.find('.overboxIn').on('click', 'a', function () {
                var el = $(this),
                    thisId = el.attr('data-id');
                el.addClass('active').siblings().removeClass('active');
                seoTab.nextAll().hide();
                $('.' + thisId).show();
                // 底部导航切换
                addSwInfo(thisId);
            });
        }

        // 点击分享关闭按钮
        $('.close').on('click', function () {
            $(this).parents('div.share-s3').hide();
            enable();
        });
        // 底部查看更多按钮
        main.on('click', '.more-option', function () {
            $(this).prev('ul').children('li').css('display', 'block');
            $(this).remove();
        });
        // 收藏功能
        main.on('click', '.shoucang', function () {
            var $that = $(this);
            // 找到当前文章的所有shoucang按钮
            var shoucang = $('.shoucang');
            var shoucangP = shoucang.siblings('p');
            var jtname = $that.attr('jtname');
            var citypy = $that.attr('citypy');
            var id = $that.attr('zhishiid');
            var scId = $that.next().attr('scId');
            if (scId === '100') {
                $.ajax({
                    type: 'get',
                    url: vars.zhishiSite + '?c=zhishi&a=ajaxDelMySelect',
                    data: {
                        id: id
                    },
                    success: function (result) {
                        if (result.resultcode === '100' || result.result_code === '100') {
                            shoucangP.text('收藏');
                            shoucangP.attr({scId: '001'});
                            if (vars.sf_source != 'baidumip' && vars.sf_source != 'mobonews') {
                                shoucang.removeClass('dis').addClass('cur');
                            } else {
                                shoucang.removeClass('dis');
                            }
                            if (result.result_code === '100') {
                                // 21:收藏
                                zhishibuma({zsid: vars.id, pageType: 'mzspage', b: 21});
                            }
                        } else if (result === '0') {
                            window.location.href = vars.loginURL + '?burl=' + encodeURIComponent(vars.zhishiSite + jtname
                                    + '/' + citypy + '_' + id + '.html');
                        }
                    },
                    error: function () {
                    }
                });
            } else {
                $.ajax({
                    type: 'get',
                    url: vars.zhishiSite + '?c=zhishi&a=ajaxSetZhishiSC',
                    data: {
                        id: $that.attr('zhishiid'),
                        newsline: $that.attr('newsline'),
                        imgpath: $that.attr('imgpath'),
                        citypy: $that.attr('citypy'),
                        jtname: $that.attr('jtname'),
                        tags: $that.attr('zhishitags')
                    },
                    success: function (result) {
                        if (result.resultcode === '100' || result.result_code === '100') {
                            shoucangP.text('已收藏');
                            shoucangP.attr({scId: '100'});
                            if (vars.sf_source != 'baidumip') {
                                shoucang.removeClass('cur').addClass('dis');
                            } else {
                                shoucang.addClass('dis');
                            }
                            if (result.result_code === '100') {
                                // 21:收藏
                                zhishibuma({zsid: vars.id, pageType: 'mzspage', b: 21});
                            }
                        } else if (result === '0') {
                            window.location.href = vars.loginURL + '?burl=' + encodeURIComponent(vars.zhishiSite + jtname
                                    + '/' + citypy + '_' + id + '.html');
                        }
                    },
                    error: function () {
                    }
                });
            }
        });
        // 点击锚文本
        // 相关知识URL
        var xiangGuanURL;
        main.on('click', '.ct', function () {
            // a标签左上角y坐标值 + 行高
            var top = $(this).position().top;
            // a标签高度
            var height = parseInt($(this).css('lineHeight'));
            // a标签左上角x坐标值
            var left = $(this).offset().left;
            // a标签宽度
            var width = parseInt($(this).css('width'));
            // 弹框内容
            $.ajax({
                type: 'get',
                url: vars.zhishiSite + '?c=zhishi&a=ajaxGetAnchorText',
                data: {
                    keyword: $(this).attr('data-word')
                },
                success: function (result) {
                    if (result) {
                        if (result.content) {
                            $('.keyword').html(result.key_word);
                            $('.content').html(result.content);
                            $('.sousuogaici').attr('href', result.link);
                            // 文本弹框
                            $('.ctBox').css({
                                display: 'block',
                                top: top + height + 5 + 'px'
                            });
                            $('.arrow').css('left', left + width / 2 - 8 + 'px');
                            // 灰色蒙层
                            $('.b-bg').show();
                        } else {
                            // 执行搜索
                            window.location.href = result.link;
                        }
                    }
                }
            });
        });
        // 关闭锚文本弹框
        main.on('click', '.b-bg', function () {
            $('.b-bg').hide();
            $('.ctBox').hide();
        });

        // 为猜你喜欢存储关键词,目前只做新房的
        var storeKeyWords = function (cur) {
            // 当前的关键词数组长度
            var curLen = cur.length;
            if (curLen > 0) {
                // 存储在localstorage的键值
                var tagsKey = vars.jtname + 'TagsKey';
                // 获取已有的localstorage的值
                var preTagsVal = vars.localStorage.getItem(tagsKey);
                if (vars.localStorage && preTagsVal) {
                    // 把已有的和当前的合并
                    var preTagsArr = preTagsVal.split(',');
                    var exLen = preTagsArr.length + curLen - 15;
                    if (exLen > 0) {
                        preTagsArr.splice(0, exLen);
                    }
                    vars.localStorage.setItem(tagsKey, preTagsArr.join(',') + ',' + cur.join(','));
                } else {
                    vars.localStorage.setItem(tagsKey, cur.join(','));
                }
            }
        };
        storeKeyWords(vars.new_tag_ids.split(','));
        // 底部标签词
        main.on('click', '.otherTag a', function () {
            window.location.href = vars.zhishiSite + 'search/?kw=' + $(this).text() + '&city=' + vars.city + '&newsnet=xf';
        });
        // 下载app临时处理
        if ($('#down-btn-c').length > 0) {
            require.async('app/1.0.0/appdownload', function ($) {
                $('#down-btn-c').openApp();
            });
        }

        // 关闭锚文本弹框
        main.on('click', '.b-bg', function () {
            $('.b-bg').hide();
            $('.ctBox').hide();
        });
        var audioObj;
        $('body').on('touchend','.btn-yy', function () {
            var img = $(this).find('img');
            if((playBtn || pauseBtn) && $(this).hasClass('hasYy')){
                if(playBtn){
                    $('#J-audio-sound')[0].play();
                    img.eq(0).hide();
                    img.eq(1).show();
                    playBtn = false;
                    pauseBtn = true;
                }else if(pauseBtn){
                    $('#J-audio-sound')[0].pause();
                    img.eq(1).hide();
                    img.eq(0).show();
                    playBtn = true;
                    pauseBtn = false;
                }
                var imgYy = $('.nowyyCont').find('.flol').find('img');
                var aBtnList = $('.nowyyCont').find('.flor').find('a');
                imgYy.each(function(){
                    if($(this).is(':hidden')){
                        $(this).show();
                    }else{
                        $(this).hide();
                    }
                });
                aBtnList.each(function(){
                    if($(this).index() !== 2){
                        if($(this).is(':hidden')){
                            $(this).show();
                        }else{
                            $(this).hide();
                        }
                    }

                });

                return false;
            }
            playIndex = 1;
            $(this).addClass('hasYy').siblings().removeClass('hasYy');
            var title = $(this).parent().text() + ' ';
            $('.cont-tyy').each(function(){
                var thisTit = $(this).find('.flol').text().slice(5);
                if(title === thisTit){
                    $(this).addClass('nowyyCont').siblings().removeClass('nowyyCont');
                    $(this).show();
                    return;
                }else{
                    $(this).hide();
                }
            });
            var $yyImg = $('.flol').find('img');
            img.eq(0).hide();
            img.eq(1).show();
            $yyImg.eq(1).show();
            $yyImg.eq(0).hide();
            $('.btn-read').show();
            $('.btn-pause').hide();
            audioObj = [];
            var elId = $(this).attr('id');
            var token = img.eq(0).attr('token');
            var yunyinContent = $('#yuyincontent_' + elId).val();
            // 请求所有字段
            var yuyin = (yunyinContent.split('[&]'));
            for(var i =0;i < yuyin.length; i ++) {
                if(yuyin[i]){
                    audioObj.push('http://tsn.baidu.com/text2audio?tex='+encodeURIComponent(encodeURIComponent(yuyin[i])) + '&lan=zh&cuid='+Math.random(0,1e6)+'&ctp=1&spd=6&tok=' +token+'&per=0');
                }

            }
            playAudio(audioObj);
            $(".audio-sound").off("ended").on("ended", function() {
                if (playIndex <audioObj.length) {
                    playIndex++;
                    playNext();
                }else{
                    $('#J-audio-sound').attr('src',audioObj[0]);
                    $('#J-next-sound').attr('src',audioObj[1]);
                    $('.nowyyCont').hide();
                    playIndex = 1;
                    var imgYy = $('.nowyyCont').find('.flol').find('img');
                    var aBtnList = $('.nowyyCont').find('.flor').find('a');
                    imgYy.each(function(){
                        if($(this).is(':hidden')){
                            $(this).show();
                        }else{
                            $(this).hide();
                        }
                    });
                    aBtnList.each(function(){
                        if($(this).index() !== 2){
                            if($(this).is(':hidden')){
                                $(this).show();
                            }else{
                                $(this).hide();
                            }
                        }

                    });
                    $('.btn-yy').removeClass('hasYy');
                }
            });
        });
        var playIndex = 1;
        function playAudio(audioObj){
                $('#J-audio-sound').attr('src',audioObj[0]);
                $('#J-next-sound').attr('src',audioObj[1]);
                $('#J-audio-sound')[0].play();
                $('#J-next-sound')[0].load();

        }
        function playNext() {
                $("#J-audio-sound").attr("id", "J-old-sound");
                $("#J-next-sound").attr("id", "J-audio-sound");
                $("#J-old-sound").attr("id", "J-next-sound");
                 $("#J-audio-sound")[0].play();
                 loadAduio();
        }
        function loadAduio() {
            if (playIndex < audioObj.length) {
                $("#J-next-sound").attr("src", audioObj[playIndex]);
                    $("#J-next-sound")[0].load();
            } else {
                return;
            }
        }
    };
    // 点击底部语音切换
    var playBtn = false,pauseBtn = true;
    // 点击播放，暂停，关闭
    $(document).on('click','.flor a',function(){
        var $ele = $(this);
        var $yyImg = $ele.parent().siblings().find('img');
        var img = $('.hasYy').find('img');
        // 显示小喇叭
        if($ele.hasClass('btn-read')){
            $ele.hide();
            $('#J-audio-sound')[0].pause();
            $yyImg.eq(0).show();
            $yyImg.eq(1).hide();
            $ele.siblings('.btn-pause').show();
            pauseBtn = false;
            playBtn = true;
            img.eq(1).hide();
            img.eq(0).show();
        }else if($ele.hasClass('btn-pause')){
            $ele.hide();
            $yyImg.eq(1).show();
            $yyImg.eq(0).hide();
            $('#J-audio-sound')[0].play();
            $ele.siblings('.btn-read').show();
            playBtn = false;
            pauseBtn = true;
            img.eq(0).hide();
            img.eq(1).show();
        }else{
            playBtn = false;
            pauseBtn = false;
            $('#J-audio-sound')[0].pause();
            $('.cont-tyy').hide();
        }
    });
    // 详情页文章详情超过两屏折行，显示-显示全文按钮
    var contentBox = $('.zs-con');
    if (contentBox.height() > 1200) {
        contentBox.css({"height":"900px", "overflow":"hidden"});
        $('.con-more').show();
    }
    // 显示全文按钮
    $('.btn-more').on('click', function(){
        contentBox.find('p').show();
        contentBox.removeAttr('style');
        $('.con-more').hide();
    });
    var scroll = require('iscroll/2.0.0/iscroll-lite');
    if ($('#jiancaiList').find('li').length > 0) {
        var scrollObj = new scroll('#jiancaiList',{
        scrollX:true,
        scrollY:false
    }); 
    }

});