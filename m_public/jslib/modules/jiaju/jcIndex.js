define('modules/jiaju/jcIndex', [
    'jquery',
    'lazyload/1.9.1/lazyload',
    'superShare/2.0.0/superShare',
    'weixin/2.0.1/weixinshare',
    'modules/jiaju/yhxw'
], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var lazyload = require('lazyload/1.9.1/lazyload');

        // 用户行为
        var yhxw = require('modules/jiaju/yhxw');
        yhxw({
            page: 'jjc_jc^sy_wap'
        });
        /** 优质建材知识推荐*/
        var zsList = $('.zsList');
        var zsListBox = $('#zsListBox');
        $.get(vars.jiajuSite + '?c=jiaju&a=ajaxJCZhiShiRecom&city=' + vars.city, function (data) {
            if ($.trim(data)) {
                zsListBox.append(data);
                zsList.show();
                $('.lazyload').lazyload();
            }
        });

        /** 产品测评*/
        var evalList = $('.evalList');
        var evalListBox = $('#evalListBox');
        $.get(vars.jiajuSite + '?c=jiaju&a=ajaxGetJcEval&page=1&pagesize=3&type=jcindex&city=' + vars.city, function (data) {
            if (data && data.total > 0) {
                evalListBox.append(data.res);
                evalList.show();
                $('.lazyload').lazyload();
            }
        });

        /**
         * 历史足迹（最多三条）
         */
        var jcDetails = vars.localStorage ? vars.localStorage.getItem('jcDetails') : '';
        var houseList = $('.houseList');
        if (vars.localStorage && jcDetails) {
            jcDetails = decodeURIComponent(jcDetails);
            // 倒叙展示
            var jcArr = jcDetails.split('||');
            var jcArrLen = jcArr.length;
            var str = '';
            for (var i = 0;i < jcArrLen;i++) {
                var tempArr = [];
                tempArr = jcArr[i].split('@@');
                if (tempArr[0] === 'product') {
                    str += '<ul class="prodList">';
                    str += '<li><a href="' + tempArr[2] + '"><div class="img"><img class="lazyload" width="100%" height="100%" data-original="' + tempArr[3] + '"><div class="but-stage"><span>' + tempArr[4] + '</span></div></div>';
                    str += '<div class="txt"><h3>' + tempArr[5];
                    if (tempArr[6]) {
                        str += tempArr[6];
                    }
                    str += '</h3><p><span class="f16 red-df"><b>' + tempArr[7] + '</b><i class="f11">元/' + tempArr[8] + '</i></span></p></div>';
                    str += '</a><div class="addre"><span class="flor"></span><a href="' + tempArr[9] + '">' + tempArr[10] + '</a></div></li>';
                    str += '</ul>';
                } else if (tempArr[0] === 'shop') {
                    str += '<ul class="bulidList">';
                    str += '<li><a href="' + tempArr[2] + '">';
                    str += '<div class="jj-img"><div><img class="lazyload" width="100%" height="100%" data-original="' + tempArr[3] + '"></div></div>';
                    str += '<div class="txt">';
                    str += '<h3>' + tempArr[4] + '</h3>';
                    str += '<p><span class="flor"></span>';
                    str += '<span class="f12 max_wid">' + tempArr[5] + '</span>';
                    str += '</p>';
                    str += '<p class="b-stage">';
                    var hotlist = [], hotlistLen;
                    if (tempArr[6] && tempArr[6].indexOf(',') > -1) {
                        hotlist = tempArr[6].split(',');
                    } else if (tempArr[6]) {
                        hotlist = new Array(tempArr[6]);
                    } else {
                        hotlist = [];
                    }
                    hotlistLen = hotlist.length;
                    for (var j = 0;j < hotlistLen;j++) {
                        if (j < 3) {
                            str += '<i class="i' + (j + 1) + '">' + hotlist[j] + '</i>';
                        }
                    }
                    str += '</p>';
                    var couponlist = tempArr[7] && tempArr[7].indexOf('$$') >0 ? tempArr[7].split('$$') : [];
                    var couponlistLen = couponlist.length;
                    for (var k = 0;k < couponlistLen; k++) {
                        if (k < 2) {
                            var couponlistClass = tempArr[7][k].coupontypename === '券' ? 'activity' : 'activity cu';
                            str += '<div class="activity">' + couponlist[k] + '</div>';
                        }
                    }
                    str += '</div>';
                    str += '</a></li>';
                    str += '</ul>';
                }
            }
            if (str.length) {
                houseList.append(str).show();
                $('.lazyload').lazyload();
            }
        }

        /*
         * 分享
         */
        var shareTitle = '家具建材店铺大全';
        var shareDesc = '一大波儿好店来袭，赶快进去看看！';
        var shareLink = location.href;
        var shareImg = location.protocol + vars.public + '201511/images/fang.png';
        var Weixin = require('weixin/2.0.1/weixinshare');
        new Weixin({
            // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            debug: false,
            shareTitle: shareTitle,
            descContent: shareDesc,
            lineLink: shareLink,
            imgUrl: shareImg,
            // 对调标题 和 描述(微信下分享到朋友圈默认只显示标题,有时需要显示描述则开启此开关,默认关闭)
            swapTitle: false
        });
        var SuperShare = require('superShare/2.0.0/superShare');
        var config = {
            // 分享的内容title
            title: shareTitle,
            // 分享时的图标
            image: shareImg,
            // 分享内容的详细描述
            desc: shareDesc,
            // 分享的链接地址
            url: shareLink,
            // 分享的内容来源
            from: '房天下家居' + vars.imgUrl + 'images/app_jiaju_logo.png'
        };
        var superShare = new SuperShare(config);
        // 点击分享按钮
        $('.icon-share').on('click', function () {
            superShare.share();
        });
    };
});