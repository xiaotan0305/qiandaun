module.exports = {
    default: {
        delay: 100,
        atleast: 100,
        clickLimit: 1,
        // 点击次数统计
        clickCount: 0,
        url: {
            init: 'http://drag.test.fang.com/api/init',
            clickCheck: 'http://m.test.fang.com/public/?c=checkcode&a=codeImgVerfied',
            dragCheck: 'http://m.test.fang.com/public/?c=checkcode&a=codeDrag',
            // formCheck: 'http://m.test.fang.com/public/?c=checkcode&a=codeForm',
            formCheck: 'http://drag.test.fang.com/api/login',
            clickBg: '',
            cssURL: '//dev.brofen.cn/Fang/m/dragVerify/static/css/all.min.css'
        },
        txt: '房天下',
        imgWidth: 300,
        imgHeight: 200
    },
    merge: function (opts) {
        return $.extend(this.default, opts);
    },
    opts: {}
};