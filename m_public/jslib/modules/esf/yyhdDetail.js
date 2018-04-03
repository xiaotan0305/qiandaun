/**
 * Created by lina on 2017/4/21.
 */
define('modules/esf/yyhdDetail',['swipe/3.10/swiper','smsLogin/smsLogin','lazyload/1.9.1/lazyload'],function(require,exports,module){
    'use strict';
    module.exports = function(){
        // 图片惰性加载
        require('lazyload/1.9.1/lazyload');
        var $ = require('jquery');
        $('.lazyload').lazyload();
        // 轮播js
        var Swiper = require('swipe/3.10/swiper');
        var vars = seajs.data.vars;
        var verifycode = require('smsLogin/smsLogin');
        // 点击头部导航按钮
        $('.icon-nav').on('click', function () {
            $('#newheader').css('opacity',  1);
            var scrollTop = $(window).scrollTop();
            var opa = parseInt(1 - scrollTop / 150);
            $('.focus-opt').find('a').css('opacity', opa);
            if($('.main').is(':visible') && scrollTop === 0){
                $('#newheader').hide();
            }else{
                $('#newheader').show();
            }
        });
        function preventDefault(e){
            e.preventDefault();
        }
        function unable(){
            window.addEventListener('touchmove', preventDefault, { passive: false });
        }
        function enable(){
            window.removeEventListener('touchmove', preventDefault, { passive: false });
        }
        /**
         * 向下滑动时相关效果
         * 页面滑动未超过200px时，页面向上滑动元导航慢慢消失，新导航逐渐显示，页面向下滑动，原导航逐渐显示，新导航消失。滑动页面滚动超过200px时新导航固定顶部。
         *
         */
        function scrollFun() {
            // 打电话浮层
            this.floatTel = $('.floatTel');
            // 屏幕高度
            this.wh = $(window).height();
            // 尾部标签
            this.footer = $('.footer');
            // 详情页初始导航
            this.detailNav = $('#slider').find('a.back,a.icon-fav,a.icon-nav');
            // 月面滑动显示导航
            this.headerNav = $('.header');
            // 初始导航与页面滚动时显示导航切换的滚动总距离
            this.maxLen = 200;
            // 导航开始切换距离
            this.cLen = 150;

            // 电商类型数组
            var dsType = ['A', 'D'];
            this.init = function () {
                // 如果为搜房帮二期分享页面时取消头部滑动

                    var that = this;
                    $(window).on('scroll', function () {
                        if ($('.newNav').is(':hidden')) {
                            var scrollH = $(this).scrollTop();
                            that.headerNav.addClass('esf-style').css('position', 'fixed').show();
                            // 电商房源中的经纪人下浮层显示功能
                            if (dsType.indexOf(vars.housetype) > -1 && that.footer && that.floatTel) {
                                // 这里比较有意思，当滑动下来在一屏减去450的位置，显示浮层，这个450是怎么确定的不清楚
                                if (scrollH + 450 <= that.wh) {
                                    // 产品要求必须固定底部电环浮层div modified by zdl
                                    // that.floatTel.hide();
                                    that.footer.css('padding-bottom', '0px');
                                } else {
                                    // that.floatTel.show();
                                    that.footer.css('padding-bottom', '50px');
                                }
                            }
                            // 导航切换效果
                            if (scrollH <= that.maxLen) {
                                that.headerNav.css('opacity', scrollH / that.maxLen);
                                if (scrollH === 0) {
                                    that.headerNav.hide();
                                }
                                // 向下移动屏幕
                                if (scrollH <= that.cLen) {
                                    that.detailNav.css('opacity', 1 - scrollH / that.cLen);
                                } else {
                                    that.headerNav.children().filter('.left,.head-icon').css('opacity', scrollH / (that.maxLen - that.cLen));
                                }
                                // 向上移动屏幕
                            } else {
                                that.headerNav.css('opacity', 1);
                            }
                        } else {
                            that.detailNav.show();
                            that.headerNav.show().addClass('esf-style').css({position: 'relative', opacity: '1'});
                        }
                    });

            };
            return this.init();
        }


        // 评论列表和搜房app，今日头条app以及过期房源中不加载导航相关效果
        if (!vars.issfapp && vars.havePic && parseInt(vars.havePic) !== 0 && !vars.jrttApp && !vars.validHouseStatus && !vars.isBdclo) {
            new scrollFun();
        }
        // 详情页轮播的图片加载之前显示loader的图片 lina 20170122
        var $imgs = $('.swiper-wrapper').find('.lazyload');

        if ($imgs.length) {
            var imgWidth = $(document).width();
            imgWidth = imgWidth > 640 ? 640 : imgWidth;
            $imgs.css('height', imgWidth * 0.75);
            $('#loading').hide();
            $('.xqfocus').find('ul').show();
            $('.swiper-wrapper').css('width',$imgs.length * 200 + '%');
        }
        // 滑动效果
        if ($imgs.length) {
            // 顶部图片滑动效果
            var totalSlider = vars.sum;
            if (totalSlider > 1) {
                Swiper('#slider', {
                    loop: true,
                    onSlideChangeStart: function (swiper) {
                        var activeIndex = swiper.activeIndex;
                        // 右滑
                        if (activeIndex === 0) {
                            activeIndex = totalSlider;
                            // 左滑
                        } else if (activeIndex > totalSlider) {
                            activeIndex = 1;
                        }
                        $('#pageIndex').text(activeIndex);
                    }
                });
            }
        }
        // 点击更多箭头
        /**
         * 点击页面中的更多标签相关展示效果
         */
        // 附近信息更多按钮实例
        var $moreBtn = $('.more_xq'),
        // 房源详情等含有更多按钮内容展示的第一条div
            $moreXq = $('.xqIntro');

        function clickMoreBtn() {
            // 是否显示展开按钮
            $moreXq.each(function () {
                var el = $(this);
                var moreBtn = el.siblings('.more_xq');
                var pHeight = parseInt(el.children('p').height());
                var maxHeight = parseInt(el.css('max-height'));
                if (pHeight > maxHeight) {
                    moreBtn.show();
                }
            });
            // 页面展示更多效果
            $moreBtn.on('click', function () {
                var el = $(this);
                el.toggleClass('up');
                var xqIntro = el.siblings('.xqIntro');
                if (el.hasClass('up')) {
                    xqIntro.addClass('all');
                } else {
                    xqIntro.removeClass('all');
                }
            });
        }

        if ($moreBtn.length && $moreXq.length) {
            clickMoreBtn();
        }
        var $order = $('#order');
        var $expire = $('#expired');
        var leftTime = new Date(vars.finalTime).getTime() - new Date().getTime();
        if(leftTime > 0){
            $order.show();
            $expire.hide();
            checkYy();
        }else{
            $order.hide();
            $expire.show();
        }
        var $timeObj = $('.hdsj').find('p');
       // 活动倒计时
        var addTimer = function(){
            var list = [],
                interval;

            return function(timeStamp){
                if(!interval){
                    interval = setInterval(go,1);
                }
                list.push({ele:$timeObj,time:timeStamp});
            }

            function go() {
                for (var i = 0; i < list.length; i++) {
                    list[i].ele.html(changeTimeStamp(list[i].time));
                    if (!list[i].time)
                        list.splice(i--, 1);
                }
            }
            //传入unix时间戳，得到倒计时
            function changeTimeStamp(timeStamp){
                 var distancetime = new Date(timeStamp).getTime() - new Date().getTime();
                if(distancetime > 0){
                    var day = parseInt(distancetime/1000/60/60/24);
                    //如果大于0.说明尚未到达截止时间
                    var ms =Math.floor(distancetime%1000/100);
                    var sec = Math.floor(distancetime/1000%60);
                    var min = Math.floor(distancetime/1000/60%60);
                    var hour =Math.floor(distancetime/1000/60/60%24);
                    hour += 24 * day;
                    //if(ms<100){
                    //    ms = '0'+ ms;
                    //}
                    if(sec<10){
                        sec = '0'+ sec;
                    }
                    if(min<10){
                        min = '0'+ min;
                    }
                    if(hour<10){
                        hour = '0'+ hour;
                    }
                    return '<i>' + hour + '</i>' + '<i>' + min + '</i>' + '<i>' + sec + '</i>' + '<i>' + ms + '</i>';
                }else{
                    $order.hide();
                    $expire.show();
                }
            }
        }();
        addTimer(vars.finalTime);//1月5日00点，unix时间戳自己去百度一下，就有的
        function checkYy(){
            var url = vars.esfSite + '?a=ajaxGetYyhdOrderStatus&houseid=' + vars.HouseId + '&city=' + vars.city;
            $.ajax({
                url: url,
                success:function(data){
                    enable();
                    if(data){
                        if (data.errcode === '100') {
                            //已登录 如果已支付成功显示已预约
                            if (data.islogin === '1') {
                                if (data.IsOrdered === "true") {
                                    $order.hide();
                                    $expire.text('已预约');
                                    $expire.show();
                                }
                            }
                            if (data.OrderedCount) {
                                $('.red-e15').text(parseInt(data.OrderedCount) + '人预约');
                            }
                            //点击预约
                            if (canYy) {
                                //未登录点击预约，显示登录框
                                if (data.islogin === '') {
                                    $tzBox.show();
                                    unable();
                                } else if (data.IsOrdered === "false") {
                                    //已登录点击预约，未支付成功跳转
                                    window.location.href = vars.esfSite + '?a=yyhdSubmitOrder&houseid=' + vars.HouseId + '&city=' + vars.city;
                                }
                            }
                        } else {
                            if (canYy) {
                                alert(data.errmsg);
                            }
                        }
                    }
                },
                error:function(err){
                    alert(err);
                    enable();
                }
            });
        }
        var $tzBox = $('.tz-box2');
        var $tzCon = $('.tz-con');

        var canYy = false;
        // 点击预约看房
        $('#yykf').on('click',function(){
            canYy = true;
            // 点击预约看房
            checkYy();
        });
        $tzBox.on('click',function(){
            $(this).hide();
            enable();
        });
        if(navigator.userAgent.indexOf('UCBrowser') > -1) {
            $tzCon.find('input').on('focus',function() {
                $tzBox.css({
                    'position': 'absolute',
                    'top': '0px',
                    'bottom':'0px'
                });

            }).on('blur',function(){
                $tzBox.css({
                    'position':'fixed',
                    'top':'0px'

                });

            });
        }

        $tzCon.on('click',function(){
            return false
        });
        var userphone;
        var $getCode = $('#getCode');
        // 发送验证码倒计时函数
        function  countDown() {
            var timeCount = 60;
            // 发送验证码按钮置为灰色
            // 60s倒计时
            var timer1 = setInterval(function () {
                timeCount--;
                $getCode.val(timeCount + ' s');
                if (timeCount === -1) {
                    // 清除定时器
                    clearInterval(timer1);
                    // 倒计时结束的时候把发送验证码的文本修改为重新获取
                    $getCode.val( ' 重新获取 ');
                    // 将发送验证码按钮设置为红色可点击状态
                    timeCount = 60;
                }
            }, 1000);
        }
        // 点击验证码
        $getCode.on('touchend',function(){
            userphone = $('.phone').val();
            $tzBox.css({
                'position':'fixed',
                'top':'0px'

            });
            $tzCon.css({
                'position':'absolute',
                'top':'50%'

            });
            if (userphone === '') {
                alert('请输入手机号');
                return false;
            }else if(!/^(13[0-9]|14[0-9]|15[0-9]|18[0-9]|17[0-9])\d{8}$/i.test(userphone)){
                alert('请输入正确格式的手机号');
                return false;
            }
            verifycode.send(userphone, function () {
                countDown();
            }, function (err) {
                alert(err);
            });


        });
        function VerifyError() {
            alert('短信验证码验证失败,请尝试重新发送！');
        }

        // 点击弹框里的预约
        var $vcode = $('.vcode');
        $('#yyBtn').on('touchend',function(){
            userphone = $('.phone').val();
            if(!userphone){
                alert('请输入手机号');
                return false;
            }else if(!$vcode.val()){
                alert('请输入验证码');
                return false;
            }
            verifycode.check(userphone, $vcode.val(), function () {
                canYy = true;
                $tzBox.hide();
                checkYy();
            }, VerifyError,userphone);


        });
    }

});
