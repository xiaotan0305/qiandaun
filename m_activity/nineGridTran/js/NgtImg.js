/**
 * Created by css on 2016/03/02.
 */
//
function NgtImg(img, w, h,SW,SH) {
    this.img = img;

    // 图片实际长宽
    this.w = w;
    this.h = h;

    // 单块长高
    this.singleW = w/3;
    this.singleH = h/3;
    // 图片伸缩比
    this.wscale = SW/w;
    this.hscale = SH/h;
}
// 画
NgtImg.prototype.draw = function (gd) {
    gd.save();
    gd.scale(this.wscale,this.hscale);
    gd.drawImage(this.img, 0, 0, this.w, this.h, 0, 0, this.w, this.h);
    gd.restore();
};
// clear指定局域
NgtImg.prototype.clearDraw = function (gd, locOW, logOH, regW, regH) {
    gd.save();
    gd.scale(this.wscale,this.hscale);
    gd.clearRect(locOW, logOH, regW, regH);
    gd.restore();
};

// 微移
NgtImg.prototype.nudgeDraw = function (gd, locOW, logOH, regWX, regHY, gAlphaInt) {
    gd.save();
    gd.scale(this.wscale,this.hscale);
    gd.globalAlpha = gAlphaInt;
    gd.drawImage(this.img, regWX, regHY, this.singleW, this.singleH, locOW, logOH, this.singleW, this.singleH);
    gd.restore();
};


/**
 * Created by css on 2016/2/24.
 */
