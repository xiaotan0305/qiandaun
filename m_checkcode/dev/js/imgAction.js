module.exports = {
    /**
     * [getRandomTxt 获取随机字符]
     * @return {[type]} [随机字符]
     */
    getRandomTxt: function (opts) {
        var randomNum = parseInt(Math.random() * 3);
        return opts.randomTxt = opts.txt.split('')[randomNum];
    },
    /**
     * [getClickBg 获取验证用的图片]
     * @return {[type]} [图片url]
     */
    getClickBg: function (opts) {
        return 'http://m.test.fang.com/public/?c=checkcode&a=createImg&mb_str=' + this.getRandomTxt(opts) + '&width=' + opts.imgWidth + '&height=' + opts.imgHeight + '&challenge=' + opts.challenge;
    },
    getImgTpl: function (opts) {
        return '<div class="img-verify">'
                    + '<div class="v-mask">'
                        + '<span class="mask-tip"><i class="verifyicon verifyicon-fail"></i><b>验证失败</b></span>'
                        + '<div class="loading"><div></div><div></div></div>'
                    + '</div>'
                    + '<img class="click-bg" src=' + this.getClickBg(opts) + '>'
                + '</div>';
    }
};