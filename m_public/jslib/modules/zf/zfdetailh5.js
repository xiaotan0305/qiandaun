/** 租房业主分享h5
 * @author lina 20161026
 */
define('modules/zf/zfdetailh5', ['jquery', 'swipe/3.10/swiper', 'weixin/2.0.0/weixinshare', 'superShare/2.0.0/superShare'], function (require, exports, module) {
    module.exports = function () {
        var $ = require('jquery');
        // 第一个swiper实例，上下滑动
        var Swiper = require('swipe/3.10/swiper'),
        // 点赞状态
            houseState,
        // 隐藏域中的信息
            vars = seajs.data.vars,
        // 第一个swiper滑动的元素
            slide = $('.swiper-slide'),
        // 第二个swiper滑动的元素
            singleLi = $('.singleLi'),
        // 窗口的宽度
            wW = $('body').width(),
        // ul下li的个数
            len = singleLi.length,
        // ul的宽度，加100是因为有padding值跟margin值
            ulWidth = wW * len + 100,
        // 浏览器类型
            ua = navigator.userAgent.toLowerCase(),
        // 微信浏览器
            isWX = /micromessenger/.test(ua),
        // qq
            isQQ = /qq\//.test(ua),
        // qqzone
            isQZ = /qzone\//.test(ua),
        // 禁止用户多次点击,发送多次ajax请求
            submit = true,
            param;

        /**第一个swipe滑动**/
        // 初始化时让除了第一个滑块之外的其余的滑块显示，其子元素隐藏
        slide.eq(0).siblings().show().children().hide();
        // 第一个swiper滑动实例，每个版块之间的切换，纵向滑动
        Swiper('.pages', {
            speed: 500,
            direction: 'vertical',
            loop: true,
            // 小区配套有滑动效果，滑动这个不进行swiper滑动
            noSwipingClass: 'xiaoQuPeiTao',
            onTransitionEnd: function () {
                // 当前活动的slide
                var activeSlide = $('.swiper-wrapper').children('.swiper-slide-active');
                // 当前活动的slide的子元素显示，其兄弟节点的子元素隐藏，展示animation动画效果
                activeSlide.children().show();
                activeSlide.siblings().children().hide();
            }
        });

        /**第二个swiper滑动**/
        // 设置ul的宽度
        $('.liList').css('width', ulWidth);
        // 设置滑动效果
        Swiper('.imgs-box', {
            wrapperClass: 'liList',
            slideClass: 'singleLi',
            width: wW * 0.9,
            loop: false
        });

        /**信息提示浮层**/
        var sendFloatId = $('#alertBox');
        var sendTextId = $('.alert-txt');
        var alertBtn = $('#alert-btn');
        function show(keywords) {
            sendFloatId.show();
            sendTextId.html(keywords);
        }
        alertBtn.off('click').on('click', function () {
            sendFloatId.hide();
            sendTextId.html('');
        });

        /**分享功能**/
        var shareA = $('.share');
        //微信分享，调用微信分享的插件
        var Weixin = require('weixin/2.0.0/weixinshare');
        var wx = new Weixin({
            debug: false,
            shareTitle: vars.title,
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

        var dzBtn = $('.fav, .zan');
        /**点赞功能**/
        if (isWX) {
            var imgurl;//添加到页面上的头像
            if (vars.localStorage && vars.localStorage.getItem('imgHead')) {
                //缓存中有头像取头像
                imgurl = vars.localStorage.getItem('imgHead');
            } else if (vars.localStorage && vars.imghead) {
                //缓存没有头像，头像存在时设置缓存
                vars.localStorage.setItem('imgHead', vars.imghead);
                imgurl = vars.localStorage.getItem('imgHead');
            } else {
                //都不存在为默认头像
                imgurl = vars.weixin_default;
            }
            var outUserId;
            if (vars.localStorage && vars.localStorage.getItem('outUserId')) {
                //缓存中有用户id
                outUserId = vars.localStorage.getItem('outUserId');
            } else if (vars.localStorage && vars.userId) {
                //缓存没有用户id，用户id存在时设置缓存
                vars.localStorage.setItem('outUserId', vars.userId);
                outUserId = vars.localStorage.getItem('outUserId');
            } else {
                //都不存在为空
                outUserId = '';
            }

            // 获取点赞信息微信中此房源已经点赞
            var wxHis = vars.localStorage.getItem('wxHis'), dzHis = [];
            if (wxHis && wxHis.length) {
                dzHis = wxHis.split(',');
            }
            if (dzHis.indexOf(vars.houseId) > -1) {
                houseState = true;
                dzBtn.addClass('on').find('span').html('感谢,帮我分享一下吧');
            }
            param = {
                photo: imgurl,//点赞者的头像
                houseid: vars.houseId,//待出租房的id
                userid: outUserId,//点赞微信id
                ownercode: vars.ownercode,//房东id
                projname: vars.projname,//点评的房源小区
                ownerName: vars.ownername,
                ownerPhone: vars.ownerphone,
            };
            if (imgurl && outUserId && !houseState && submit && vars.code) {
                //授权返回时,用户头像跟id同时存在,直接进行验证提交
                subdz();
            }
        }

        /**提交函数**/
        function subdz() {
            if (!submit) {
                return false;
            }
            submit = false;
            $.ajax({
                url: vars.zfSite + '?c=zf&a=ajaxGetSetPefer&city=' + vars.city,
                type: 'post',
                data: param,
                success: function (data) {
                    if (data.errcode === '100' || data.errcode === '202') {
                        // 点赞成功，把用户的头像放入页面之中
                        if (data.errcode === '100') {
                            $('.fav-in').prepend('<span><img src="' + imgurl + '"/></span>');
                            //点赞次数加一
                            var number;
                            var finalPageNumObj = $('.more').find('em');//最后一页的点赞数
                            number = parseInt(finalPageNumObj.html()) + 1;
                            finalPageNumObj.html(number);
                            //其他页面点赞数增加1
                            var otherPageNumObj = $('.zan').find('p');
                            otherPageNumObj.html(number);
                            $('.zan').append('<b>+1</b>');
                            $('.zan').addClass('on');
                            $('.zan').addClass('num');
                            $('.zan').find('i').addClass('pulse');
                            setTimeout(function () {
                                $('.zan').find('i').removeClass();
                                $('.zan').find('b').remove();
                            }, 500);
                        }
                        show(data.message);
                        dzBtn.addClass('on').find('span').html('感谢,帮我分享一下吧');
                        // 获取用户的历史点赞信息
                        var wxHis = vars.localStorage.getItem('wxHis'), dzHis = [];
                        if (wxHis && wxHis.length) {
                            dzHis = wxHis.split(',');
                        }
                        // 如果历史信息中不存在当前房源的信息，将当前房源信息存入历史信息之中
                        if (dzHis.indexOf(vars.houseId) === -1) {
                            dzHis.push(vars.houseId);
                            houseState = true;//用户点赞状态设置为1，证明用户已经点过赞
                            vars.localStorage.setItem('wxHis', dzHis.join());
                        }
                    } else {
                        show(data.message);
                    }
                    submit = true;
                }
            });
        }

        // 点击点赞按钮
        dzBtn.on('click', function () {
            // 用户点赞状态存在，直接给出已经点赞的提示
            if (houseState) {
                show('您已经点过赞啦！');
                dzBtn.addClass('on').find('span').html('感谢,帮我分享一下吧');
                return false;
            }
            // 微信点赞,跳转到用户授权页,否则跳出
            if (isWX) {
                //imghead && vars.userId
                if (imgurl && outUserId) {
                    //此时的用户头像是存在的,直接进行验证提交
                    subdz();
                } else {
                    //没有用户信息时跳转授权
                    window.location.href = location.protocol + '//open.weixin.qq.com/connect/oauth2/authorize?appid=' + vars.appId
                        + '&redirect_uri=' + encodeURIComponent(vars.jumpath) + '&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect';
                    //window.location.href = 'https://m.fang.com/passport/login.aspx?burl=' + encodeURIComponent(window.location.href + '&code=1212355');
                }
            } else {
                show('请在微信关注房天下公众号，再点赞哦');
                return false;
            }
        });
    };
});