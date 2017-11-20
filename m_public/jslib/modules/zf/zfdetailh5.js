/** 租房业主分享h5
 * @author lina 20161026
 */
define('modules/zf/zfdetailh5', ['jquery', 'swipe/3.10/swiper', 'weixin/2.0.0/weixinshare', 'superShare/1.0.1/superShare'], function (require, exports, module) {
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
        // 微信分享
            weixin,
        // 普通分享
            superShare,
        // 分享按钮
            shareBtn = $('.share'),
        // 第一个分享
            shareA = shareBtn.eq(0),
        // 普通分享，调用普通分享的插件
            SuperShare = require('superShare/1.0.1/superShare'),
        // 分享跳转地址，用户确认权限后的回调地址
            jumphref = location.href,
        // 替换跳转的协议头部，之前是因为头部问题图片分享的图片跟内容不是自定义的内容
            // link = jumphref.replace('https', 'http'),
        // 分享时的图片
            imgUrl,
        // 1是点赞，2是浏览，默认是浏览
            operaType,
        // 点赞来源
            userSource,
        // 从微信中获得的微信头像
            imghead = vars.imghead,
        // 点赞后的头像地址
            imgurl;
        /**
         * 第一个swipe滑动
         */
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

        /**
         * 第二个swiper滑动
         */
            // 设置ul的宽度
        $('.liList').css('width', ulWidth);
        // 设置滑动效果
        Swiper('.imgs-box', {
            wrapperClass: 'liList',
            slideClass: 'singleLi',
            width: wW * 0.9,
            loop: false
        });

        /**
         * 信息提示浮层
         */
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

        /**
         * 分享功能
         */
        imgUrl = location.protocol + shareA.attr('imgpath');
        var shareCount = vars.shareCount;
        var sub = true;
        function ajaxJF(res) {
            // 微信分享到朋友圈跟分享到朋友送积分
            // shareTimeline  分享到朋友圈
            // sendAppMessage 分享到朋友
            if(JSON.stringify(res) === '{"errMsg":"shareTimeline:ok"}' || JSON.stringify(res) === '{"errMsg":"sendAppMessage:ok"}') {
                // 不是房东
                if (!vars.isowner) {
                    return false;
                }
                // 请求没有数据
                if(vars.shareCount === '') {
                    alert('网络错误，请刷新重试');
                    return false;
                }
                shareCount = parseInt(shareCount);
                if (shareCount >= 3) {
                    show('您的分享次数已超过3次，将不再送积分哦');
                    return false;
                }
                if (sub && vars.iscredit && shareCount < 3) {
                    sub = false;
                    // 向后台传送分享后的积分
                    $.ajax({
                        url: vars.zfSite + '?c=zf&a=ajaxSetPefer',
                        type: 'post',
                        data: {
                            activity: 3,
                            user_id: vars.ownercode,
                            opera_type: 3
                        },
                        success: function (data) {
                            if (data.errcode === '1') {
                                $.ajax({
                                    url: vars.zfSite + '?c=zf&a=ajaxGetPresent',
                                    type: 'post',
                                    data: {
                                        credits: 100,
                                        ownerid: vars.ownercode
                                    },
                                    success: function (data) {
                                        shareCount += 1;
                                        sub = true;
                                        if (data.errcode === '1') {
                                            show('恭喜，本次获得100积分');
                                        }
                                    }
                                });
                            }
                        }
                    });
                }
            }
        }

        /**
         * 分享取消
         * @returns {boolean}
         */
        function cancel() {
            return false;
        }

        // 微信分享，调用微信分享的插件
        var Weixin = require('weixin/2.0.0/weixinshare');
        var wx = new Weixin({
            debug: false,
            shareTitle: shareA.attr('newsline'),
            // 副标题
            descContent: '优质房源尽在房天下fang.com',
            lineLink: jumphref,
            imgUrl: imgUrl,
            swapTitle: false
        },ajaxJF,cancel);
        var config = {
            // 分享的内容title
            title: shareA.attr('newsline'),
            // 分享时的图标
            image: imgUrl || '',
            // 副标题
            desc: '优质房源尽在房天下fang.com',
            // 分享的链接地址
            url: jumphref,
            // 分享的内容来源
            from: ' —房天下' + vars.cityname
        };
        superShare = new SuperShare(config);
        // 更新配置函数
        function shareFn() {
            var title = $(this).attr('newsline');
            config = {
                // 分享的内容title
                title: title,
                // 副标题
                desc: '优质房源尽在房天下fang.com',
                // 分享时的图标
                image: imgUrl || '',
                // 分享的链接地址
                url: jumphref,
                // 分享的内容来源
                from: ' —房天下' + vars.cityname
            };
            var configWx = {
                debug: false,
                shareTitle: title,
                descContent: '优质房源尽在房天下fang.com',
                lineLink: jumphref,
                imgUrl: imgUrl
            };
            if (isQQ || isQZ || isWX) {
                wx.updateOps(configWx);
            } else {
                superShare.updateConfig(config);
            }
        }

        // 点击分享按钮，更新配置信息
        shareBtn.on('click', shareFn);

        /**
         * 点赞功能
         */
        // 微信中有用户头像，点赞头像为用户的微信头像，没有的话为默认头像
        if (isWX) {
            // locastorage中有图片信息
            if (vars.localStorage && vars.localStorage.getItem('imgHead')) {
                imgurl = vars.localStorage.getItem('imgHead');
                // 有vars.imghead值时存到localstorage中
            } else if (vars.localStorage && imghead) {
                vars.localStorage.setItem('imgHead', imghead);
                imgurl = vars.localStorage.getItem('imgHead');
            } else {
                imgurl = vars.weixin_default;
            }
        }
        // 如果有用户头像,但是没有存储成功,点赞状态,重新设置点赞状态。
        var wxHis = vars.localStorage.getItem('wxHis'), dzHis = [];
        if (wxHis && wxHis.length) {
            dzHis = wxHis.split(',');
        }
        // 获取点赞信息   微信中此房源已经点赞
        if (dzHis.indexOf(vars.houseId) > -1) {
            houseState = true;
        }
        // 记录用户来源
        if (isWX) {
            userSource = 'weixin';
        } else if (ua.match(/qq/i) || ua.match(/qzone/i)) {
            // qq点赞，头像为默认头像
            imgurl = vars.qq_default;
            userSource = 'qq';
        } else {
            // 浏览器点赞
            imgurl = vars.browser_default;
            userSource = 'browser';
        }

        var submit = true;
        // 用户行为为2，表明用户进行了浏览
        operaType = 2;
        var submitUrl = vars.zfSite + '?c=zf&a=ajaxSetPefer';
        param = {
            // 点赞者的头像
            photo: imgurl,
            // 用户类型，1点赞，2浏览
            opera_type: operaType,
            // 待出租房的id
            houseid: vars.houseId,
            // 用户点赞来源
            user_source: userSource,
            user_id: vars.userId,
            activity: vars.showtype
        };

        /**
         * 校验，提交
         */
        var dzBtn = $('.fav');

        function check() {
            param.opera_type = 1;
            // 禁止用户多次点击,发送多次ajax请求
            if (submit) {
                submit = false;
                $.ajax({
                    url: submitUrl,
                    type: 'post',
                    data: param,
                    success: function (data) {
                        // 结果是1，表明点赞成功
                        // 结果是2，表明已经点赞
                        if (data.errcode === '1' || data.errcode === '2') {
                            // 点赞成功，把用户的头像放入页面之中
                            if (data.errcode === '1') {
                                $('.fav-in').prepend('<span><img src="' + imgurl + '"/></span>');
                                // 点赞次数加一
                                var numObj = $('.more').find('em');
                                var number = parseInt(numObj.html());
                                number += 1;
                                numObj.html(number);
                                // 点赞次数小于20次,送积分，每次5积分
                                // 点赞次数无，点赞次数小于20次，在活动期内
                                if (vars.dzCount && (vars.dzCount < 20) && vars.iscredit) {
                                    var JF = {
                                        ownerid: vars.ownercode,
                                        credits: 5
                                    };
                                    $.ajax({
                                        url: vars.zfSite + '?c=zf&a=ajaxGetPresent',
                                        type: 'post',
                                        data: JF,
                                        success: function (data) {
                                            if (data.errcode === '1') {
                                                show('恭喜，本次获得5积分');
                                            }
                                        }
                                    });
                                } else if(vars.dzCount && (vars.dzCount > 20) && vars.iscredit) {
                                    show('前20次点赞，才能送积分哦~');
                                } else{
                                    show('点赞成功');
                                }
                            }
                            dzBtn.addClass('on').find('span').html('感谢,帮我分享一下吧');
                            // 获取用户的历史点赞信息
                            var wxHis = vars.localStorage.getItem('wxHis'), dzHis = [];
                            if (wxHis && wxHis.length) {
                                dzHis = wxHis.split(',');
                            }
                            // 如果历史信息中不存在当前房源的信息，将当前房源信息存入历史信息之中
                            if (dzHis.indexOf(vars.houseId) === -1) {
                                dzHis.push(vars.houseId);
                                // 用户点赞状态设置为1，证明用户已经点过赞
                                houseState = true;
                                vars.localStorage.setItem('wxHis', dzHis.join());
                            }
                        } else {
                            show('操作失败');
                        }
                        submit = true;
                    }
                });
            }
        }

        // 获取code后，进入页面，此时的用户头像是存在的,直接进行验证提交
        if (imghead && isWX) {
            // 有了点赞状态，直接更改页面中的点赞提示框
            check();
        } else if (houseState && submit) {
            dzBtn.addClass('on').find('span').html('感谢,帮我分享一下吧');
        }
        function Jump() {
            // 微信点赞,跳转到用户授权页
            if (isWX) {
                var jumpToSure = location.protocol + '//open.weixin.qq.com/connect/oauth2/authorize?appid=' + vars.appId
                     + '&redirect_uri=' + encodeURIComponent(jumphref) + '&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect';
                window.location.href = jumpToSure;
                return false;
            } else {
                check();
            }
        }

        // 点击点赞按钮,微信中只能点一次赞
        dzBtn.on('click', function () {
            // 用户点赞状态存在，直接给出已经点赞的提示
            if (houseState) {
                show('您已经点过赞啦！');
                return false;
            }
            Jump();
        });
    };
});