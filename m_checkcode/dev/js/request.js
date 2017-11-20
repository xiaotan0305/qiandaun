var tool = require('./util/tool.js');
var opts = require('./default.js').opts;
var encryptor = require('./encryptors.js');
var action = require('./action.js');
module.exports = {

    /**
     * [verifyDrag 移除事件]
     */
    verifyDrag: function (dragInfo) {
        tool.ajax({
            url: opts.url.dragCheck,
            data: {
                stratdrag_time: dragInfo[0].t,
                finishdrag_time: dragInfo[dragInfo.length - 1].t,
                i: encryptor.LZString.compress(encryptor.encryptedPageInfo()),
                t: encryptor.encryptTouch(encryptor.parseTouch(dragInfo)),
                gt: opts.gt,
                challenge: opts.challenge
            }
        }).done(function (data) {
            if (data.message === 'successed' && data.validate) {
                opts.validate = data.validate;
                action.dragOk();
            }else {
                action.dragFail();
            }
        });
    },

    /**
     * [verifyClick 验证点击]
     */
    verifyClick: function () {
        tool.ajax({
            url: opts.url.clickCheck,
            data: {
                x: action.clickInfo[0].x,
                y: action.clickInfo[0].y,
                challenge: opts.challenge,
                gt: opts.gt
            }
        }).done(function (data) {
            if (data.message === 'successed' && data.validate) {
                opts.validate = data.validate;
                setTimeout(function () {
                    action.dragOk();
                },1000);
            }else {
                action.clickFail();
            }
        });
    }

}