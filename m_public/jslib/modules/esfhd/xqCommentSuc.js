/**
 * @author lipengkun@fang.com  APP小区点评抽奖活动相关功能
 */
define('modules/esfhd/xqCommentSuc', ['jquery', 'superShare/2.0.0/superShare', 'weixin/2.0.0/weixinshare', 'floatAlert/1.0.0/floatAlert'],  function (require,exports,module) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;

    //****弹框蒙层对象插件****
    var floatAlert = require('floatAlert/1.0.0/floatAlert');
    var option = {type: '1'};//弹框插件样式选项
    var floatObj = new floatAlert(option);

    //****分享内容****
    var shareA = $('.share');
    //**微信分享**
    var Weixin = require('weixin/2.0.0/weixinshare');
    var wx = new Weixin({
        debug: false,
        shareTitle: shareA.attr('newsline'),
        // 副标题
        descContent: '',
        lineLink: shareA.attr('jumpath'),
        imgUrl: shareA.attr('imgpath'),
        swapTitle: false
    });
    //**普通分享**
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
    shareA.on('click', function () {
        superShare.share();
    });

    //****签到抽奖****
    $('.swing').click(function(){
        var param = {
            newcode : vars.newcode,
        };
        //提交接口
        $.ajax({
            url: vars.esfSite + '?c=esfhd&a=ajaxXqdpSignIn',
            data: param,
            success: function (data) {
                if (data.errcode === '100') {
                    floatObj.showMsg(data.errmsg, 2000);
                    window.location.href = vars.mainSite + 'huodongAC.d?m=newWheelLottery&class=NewWheelLotteryHc&lotteryId=101601&channel=newhouse' + '&city=' +vars.city + '&projCode=' + vars.newcode;
                } else {
                    floatObj.showMsg(data.errmsg, 2000);
                }
            },
            error: function () {
                floatObj.showMsg('网络错误，请稍后重试', 2000);
            }
        });
    });



});