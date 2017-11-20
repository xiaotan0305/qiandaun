/**
 * Created by LXM on 15-3-17.
 * 单量修改于2015-9-9
 */
define('modules/jiaju/caseDetail', ['jquery', 'lazyload/1.9.1/lazyload', 'photoswipe/4.0.8/photoswipe', 'photoswipe/4.0.8/photoswipe-ui-default.min', 'superShare/1.0.1/superShare', 'weixin/2.0.0/weixinshare'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var superShare = require('superShare/1.0.1/superShare');
        var wxShare = require('weixin/2.0.0/weixinshare');
        require('lazyload/1.9.1/lazyload');
        $('.lazyload').lazyload();

        // 搜索用户行为收集20160114
        var page = 'mjjvolumepage';

        function yhxw(yhxwId) {
            // 所在城市（中文）
            _ub.city = vars.cityname;
            _ub.biz = 'h';
            _ub.location = vars.ns;

            // 用户动作（浏览0、打电话31、给我留言24）新版后 没有打电话和给我留言功能
            var b = yhxwId;
            var pTemp = {
                // 案例id
                'vmg.page': page,
                'vmh.volumeid': vars.case_id,
                'vmh.designerid': vars.designerID
            };
            var p = {};

            // 若pTemp中属性为空或者无效，则不传入p中
            for (var temp in pTemp) {
                if (pTemp[temp]) {
                    p[temp] = pTemp[temp];
                }
            }
            _ub.collect(b, p);
        }
        // click流量统计
        require.async(location.protocol + '//clickm.fang.com/click/new/clickm.js', function () {
            window.Clickstat.eventAdd(window, 'load', function () {
                window.Clickstat.batchEvent('wapzxbjxq_', '');
            });
        });
        require.async('jsub/_vb.js?c=' + page);
        require.async('jsub/_ubm.js', function () {
            yhxw(0);
        });
        var pswp = $('.pswp')[0];
        var $head2 = $('.head_2');
        var currentImg;
        // 分享
        var shareFn = (function () {
            var share;
            var shareWx;
            // 微信分享成功弹层
            var $shareSuc = $('.shareSuc');
            // 微信分享成功弹层关闭按钮事件
            $shareSuc.find('.close').on('click', function () {
                $shareSuc.hide();
            });
            return function (config, wxConfig) {
                if (share) {
                    // 更新分享信息
                    share.updateConfig(config);
                    shareWx.updateOps(wxConfig);
                } else {
                    // 初始化分享
                    share = new superShare(config);
                    shareWx = new wxShare(wxConfig, function () {
                        // 微信分享成功回调
                        $shareSuc.show();
                    });
                    // 此处分享按钮不在main里，分享插件不支持，故重新绑定事件
                    $('.icon-share').on('click', function () {
                        var ua = share.ua;
                        // 判断浏览器类型;
                        if (ua.name === '微信客户端' || ua.name === '微博客户端' || ua.name === 'QQ客户端' || ua.name === 'QQZone客户端') {
                            share.weixinFloat.show();
                        } else if (ua.name === 'UC浏览器') {
                            share.shareByUC();
                        } else if (ua.name === 'QQ浏览器') {
                            share.shareByQQ();
                        } else {
                            share.floatMask.addClass('mask-visible');
                            share.shareFloat.show();
                        }
                    });
                }
            };
        })();
        var $imgs = $('.pic').find('img');
        var items = [];
        var length = $imgs.length;
        var $design = $('.sf-jj-flot');
        var $imgsPs = $('.picture').find('img');
        // photoswipe大图模式 
        $imgs.each(function (index) {
            var image = new Image();
            var $this = $(this);
            var href = $this.data('original');
            $(image).on('load', function () {
                // 加载图片
                items[index] = {
                    src: href,
                    w: this.naturalWidth,
                    h: this.naturalHeight,
                    comment: $imgsPs.eq(index).data('comm')
                };
                // 图片全部加载完绑定点击事件展示大图
                if (!--length) {
                    $imgs.on('click', function () {
                        var $this = $(this);
                        var index = $this.parents('li').eq(0).index();
                        var gallery = new window.PhotoSwipe(pswp, window.PhotoSwipeUI_Default, items, {
                            history: false,
                            index: index
                        });
                        var shareInfo = {
                            url: location.href,
                            title: $('title').text(),
                            desc: $('meta[name=description]').attr('content')
                        };
                        var wxShareInfo = {
                            lineLink: shareInfo.url,
                            shareTitle: shareInfo.title,
                            descContent: shareInfo.desc
                        };
                        gallery.listen('beforeChange', function () {
                            // 图片切换更新分享信息
                            currentImg = gallery.currItem;
                            wxShareInfo.imgUrl = shareInfo.image = currentImg.comment.picurl;
                            shareFn(shareInfo, wxShareInfo);
                        });
                        gallery.listen('close', function () {
                            $head2.hide();
                            $design.hide();
                        });
                        gallery.init();
                        $head2.show();
                        $design.show();
                        $head2.find('.back').on('click', function () {
                            gallery.close();
                        });
                    });
                }
            });
            image.src = href;
        });
        // toast 提示
        var toast = (function () {
            var toastTime;
            var $sendFloat = $('.favorite');
            var $sendText = $sendFloat;
            var toastMsg = {};
            return function (msgType, cb) {
                $sendText.text(toastMsg[msgType] || msgType);
                $sendFloat.show();
                toastTime && clearTimeout(toastTime);
                toastTime = setTimeout(function () {
                    $sendFloat.hide();
                    cb && cb();
                }, 2000);
            };
        })();
        // 收藏
        $('.icon-fav').on('click', (function () {
            var canAjax = true;
            return function () {
                if (canAjax) {
                    // 判断是否登录，无登录跳登录页
                    if (vars.isLogin) {
                        var $this = $(this);
                        canAjax = false;
                        var isCollected = $this.hasClass('cur');
                        // 收藏ajax请求
                        $.ajax({
                            url: vars.jiajuSite + '?c=jiaju&a=ajaxPicCollect',
                            data: {
                                // choice:2取消收藏,3收藏
                                choice: isCollected ? 2 : 3,
                                // infoType:2单图，1案例
                                infoType: 1,
                                InfoId: vars.case_id,
                                picUrl: currentImg.comment.picurl,
                                title: vars.collectName,
                                infoSoufunId: vars.designerID
                            },
                            success: function (response) {
                                if (+response.Message.Code === 1) {
                                    $this.toggleClass('cur');
                                    toast(isCollected ? '取消收藏成功' : '收藏成功');
                                }
                            },
                            complete: function () {
                                canAjax = true;
                            }
                        });
                    } else {
                        location.href = location.protocol + '//m.fang.com/passport/login.aspx?burl=' + encodeURIComponent(location.href);
                    }
                }
            };
        })());
    };
});