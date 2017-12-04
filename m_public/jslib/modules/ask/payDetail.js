/**
 * 问答详情页主类
 * by blue
 * 20150916 blue 整理代码，去除冗长代码，提高代码效率，删除单独为本页面写入的点击搜索按钮搜索操作
 */
define('modules/ask/payDetail', ['jquery', 'util', 'photoswipe/4.0.7/photoswipe','photoswipe/4.0.7/photoswipe-ui-default.min', 'lazyload/1.9.1/lazyload', 'weixin/2.0.1/weixinshare', 'iscroll/2.0.0/iscroll-lite', 'modules/xf/IcoStar'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        // jquery库
        var $ = require('jquery');
        // 页面传入的数据
        var vars = seajs.data.vars;
        // 公共工具类
        var util = require('util');
        // 筛选框插件
        var scrollCtrl = require('iscroll/2.0.0/iscroll-lite');
        var IcoStar = require('modules/xf/IcoStar');
        //点赞数
        var  dingcount = vars.dingcount;
        //点赞按钮
        var payaskzan = $('#payaskzan');
        var  myfloat = $('#myfloat');
		var  userid = vars.userid;
        /* 图片惰性加载*/
        require('lazyload/1.9.1/lazyload');
        var swipLazy = $('.lazyload'), delay = 0;
        if (swipLazy) {
            swipLazy.lazyload();
            swipLazy.each(function (index, ele) {
                setTimeout(function () {
                    var thisEle = $(ele);
                    if (thisEle.attr('src') !== thisEle.attr('data-original')) {
                        thisEle.attr('src', thisEle.attr('data-original'));
                    }
                }, delay + 20);
            });
        }

        /*
        * 点击一元围观
        */
        $('.askffbtn').off('click').on('click', function () {
            // 判断用户id是否为空，为空则跳转登陆页面
            if (!userid) {
                util.login();
                return;
            }
            $.get(vars.askSite + '?c=ask&a=ajaxPayPostWatch&askid=' + vars.askid, function(data) {
                if (data['code']) {
                    float('围观失败，请重试！');
                } else {
					$('body').append(data);
                        setTimeout(function(){
                            $('#submit').submit();
                        },0)
				}
            })

        })
       
    
        /*
        * 点赞
        */
		var zan =false;
        payaskzan.off('click').on('click', function () {
			if (zan) {
				float('您已经赞过了');
				return;
			}
            $.get(vars.askSite + '?c=ask&a=ajaxAskPraise&askid=' + vars.askid, function(data) {
                if (data) {
                    if (data['common']['code'] == 100) {
                        dingcount++
                        $('#dingcount').html(dingcount);
						payaskzan.removeClass('gray');
						zan = true;
                    } else {
						if (data['common']['code'] == 102) {
							zan = true;
						}
                        float(data['common']['message']);
                    }
                } else {
                    float('点赞失败，请重试！');
                }
            })

        });
 
        /*
        * 弹出浮层
        */
        function float (message) {
            myfloat.show().html(message);
            // 3秒后隐藏
            setInterval(function () {
                myfloat.hide();
            }, 3000);
        }
        var Weixin = require('weixin/2.0.1/weixinshare');
        var $shareTitle = '';
        if (vars.ButtonState === '2') {
            $shareTitle =  vars.answernickname + '在「房天下问答」上回答了这个价值' + vars.askprice + '元的问题，仅需一元即可围观';
        } else if (vars.ButtonState === '1') {
            $shareTitle =  vars.answernickname + '在「房天下问答」上回答了这个价值' + vars.askprice + '元的问题，限时免费，立即围观';
        } else {
            $shareTitle =  vars.answernickname + '在「房天下问答」上回答了这个价值X元的问题，立即免费围观';
        }
        new Weixin({
            // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            debug: false,
            shareTitle: vars.title,
            descContent: $shareTitle,
            lineLink: location.href,
            imgUrl: 'https:' + vars.answeruserphoto,
            // 对调标题 和 描述(微信下分享到朋友圈默认只显示标题,有时需要显示描述则开启此开关,默认关闭)
            swapTitle: true
        });

        /*
         * 给百度官方号页面增加热门分类的滑动效果
         */
         /*热门分类滑动效果*/
        var hotClassUlList = $('#hotClassUlList');
        var hotClassNum = hotClassUlList.find('li').length;
        if (hotClassNum > 0) {
            hotClassUlList.css('width',hotClassNum * 79 + 'px');
            new scrollCtrl('#hotClassList',{
                scrollX:true,
                scrollY:false,
                eventPassthrough: true,
                preventDefault: false
            });
        }

        // 控制星星亮
        var icoStarObj = new IcoStar('.ico-star');

        // 点击帖子内容图片，图片放大功能
        var conImg = $('.main');
        conImg.on('click', '.payinfo img', function () {
            var url = $(this).attr('original');
            var slides = [];
            var index = 0;
            var allImg = conImg.find('.payinfo img');
            // 点击缩放大图浏览
            if (allImg.length > 0) {
                var pswpElement = $('.pswp')[0];
                for (var i = 0, len = allImg.length; i < len; i++) {
                    var ele = allImg[i],
                        src = $(ele).attr('original');
                    if (src === url) {
                        index = i;
                    }
                    slides.push({src: src, w: ele.naturalWidth, h: ele.naturalHeight});
                }
                var options = {
                    history: false,
                    focus: false,
                    index: index,
                    escKey: true
                };
                var gallery = new window.PhotoSwipe(pswpElement, window.PhotoSwipeUI_Default, slides, options);
                gallery.init();
            }
        });
        var thisIndex = 0;
        function getUrl(obj,index,arr,url){
            var ele = obj[index];
            var src = $(ele).attr('original');
            var img = new Image();
            img.src = src;
            if(url === src){
                thisIndex = index;
            }
            img.addEventListener('load',function(){
                index += 1;
                arr.push({src: src, w: img.naturalWidth, h: img.naturalHeight});
                if (index < obj.length) {
                    getUrl(obj,index,arr,url);
                } else {
                    var pswpElement = $('.pswp')[0];
                    var options = {
                        history: false,
                        focus: false,
                        index: thisIndex,
                        escKey: true
                    };
                    var gallery = new window.PhotoSwipe(pswpElement, window.PhotoSwipeUI_Default, arr, options);
                    gallery.init();
                }
            },false);
        }
        var askImg = $('.askUl');
        askImg.on('click', 'img', function () {
            $(document).scrollTop(44);
            var url = $(this).attr('original');
            var imgStrs = askImg.find('img');
            var slides = [];
            // 点击缩放大图浏览
            if (imgStrs.length > 0) {
                getUrl(imgStrs,0,slides,url);
            }
        });
    };
});