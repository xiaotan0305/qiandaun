/**
 * @Author: 坤鹏
 * @Date: 2015/12/4 9:54
 * @description: bg.js
 * @Last Modified by:   **
 * @Last Modified time:
 */
function displayObject() {
    this.childList = [];
}
displayObject.prototype.addCild = function (c) {
    this.childList.push(c);
};
displayObject.prototype.removeCild = function (c) {
    var idx = this.childList.indexOf(c);
    if (idx > -1) {
        this.childList.splice(idx, 1);
    }
};
displayObject.prototype.draw = function (gd) {
    var l = this.childList.length;
    for (var i = 0; i < l; i++) {
        var el = this.childList[i];
        el.draw(gd);
    }
};

//背景
function BgCon(img, w, h, useCache) {
    this.visible = true;
    this.img = img;
    this.y = 0;
    this.w = w;
    this.h = h;
    this.cacheCanvas = document.createElement('canvas');
    this.cacheCtx = this.cacheCanvas.getContext('2d');
    this.cacheCanvas.width = this.w;
    this.cacheCanvas.height = 3 * this.h;
    this.useCache = useCache;
    if (useCache) {
        this.cache();
    }
}
BgCon.prototype.draw = function (gd) {
    if (!this.useCache) {
        gd.save();
        gd.translate(0, this.y);
        gd.drawImage(this.img, 0, -this.h, this.w, this.h);
        gd.drawImage(this.img, 0, 0, this.w, this.h);
        gd.drawImage(this.img, 0, this.h, this.w, this.h);
        gd.restore();
    } else {
        gd.drawImage(this.cacheCanvas, 0, this.y - this.h);
    }
};
BgCon.prototype.cache = function () {
    this.cacheCtx.save();
    this.cacheCtx.translate(0, this.y);
    this.cacheCtx.drawImage(this.img, 0, -this.h, this.w, this.h);
    this.cacheCtx.drawImage(this.img, 0, 0, this.w, this.h);
    this.cacheCtx.drawImage(this.img, 0, this.h, this.w, this.h);
    this.cacheCtx.restore();
};
// 圆角矩形
function roundRect(x, y, w, h, r, o, useCache) {
    this.visible = true;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.r = r;
    this.o = o;
    this.cacheCanvas = document.createElement('canvas');
    this.cacheCtx = this.cacheCanvas.getContext('2d');
    this.cacheCanvas.width = this.w * 1.5;
    this.cacheCanvas.height = this.h * 1.5;
    this.useCache = useCache;
    if (useCache) {
        this.cache();
    }
}
roundRect.prototype.draw = function (gd) {
    if (!this.useCache) {
        if (this.w < 2 * this.r) this.r = this.w / 2;
        if (this.h < 2 * this.r) this.r = this.h / 2;
        gd.fillStyle = '#246e1c';
        gd.lineWidth = 3;
        gd.globalAlpha = this.o;
        gd.beginPath();
        gd.moveTo(this.x + this.r, this.y);
        gd.arcTo(this.x + this.w, this.y, this.x + this.w, this.y + this.h, this.r);
        gd.arcTo(this.x + this.w, this.y + this.h, this.x, this.y + this.h, this.r);
        gd.arcTo(this.x, this.y + this.h, this.x, this.y, this.r);
        gd.arcTo(this.x, this.y, this.x + this.w, this.y, this.r);
        gd.closePath();
        gd.fill();
        gd.stroke();
        gd.globalAlpha = 1;
    } else {
        gd.drawImage(this.cacheCanvas, this.x - gd.lineWidth * 2, this.y - gd.lineWidth * 2);
    }
};
roundRect.prototype.cache = function () {
    if (this.w < 2 * this.r) this.r = this.w / 2;
    if (this.h < 2 * this.r) this.r = this.h / 2;
    this.cacheCtx.fillStyle = '#246e1c';
    this.cacheCtx.lineWidth = 3;
    this.cacheCtx.globalAlpha = this.o;
    this.cacheCtx.beginPath();
    this.cacheCtx.moveTo(this.x + this.r, this.y);
    this.cacheCtx.arcTo(this.x + this.w, this.y, this.x + this.w, this.y + this.h, this.r);
    this.cacheCtx.arcTo(this.x + this.w, this.y + this.h, this.x, this.y + this.h, this.r);
    this.cacheCtx.arcTo(this.x, this.y + this.h, this.x, this.y, this.r);
    this.cacheCtx.arcTo(this.x, this.y, this.x + this.w, this.y, this.r);
    this.cacheCtx.closePath();
    this.cacheCtx.fill();
    this.cacheCtx.stroke();
    this.cacheCtx.globalAlpha = 1;
};
// 文字
function textRect(text, x, y, font, color) {
    this.visible = true;
    this.text = text;
    this.x = x;
    this.y = y;
    this.font = font;
    this.color = color;
}
textRect.prototype.setPOS = function (x, y) {
    this.x = x;
    this.y = y;
};
textRect.prototype.draw = function (gd) {
    gd.font = this.font + 'px bold Arial';
    gd.fillStyle = this.color;
    gd.fillText(this.text, this.x, this.y);
};

// 元素(非礼包、路障、炸弹)
function PicCon(img, x, y, w, h, useCache) {
    this.visible = true;
    this.img = img;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.cacheCanvas = document.createElement('canvas');
    this.cacheCtx = this.cacheCanvas.getContext('2d');
    this.cacheCanvas.width = this.w;
    this.cacheCanvas.height = this.h;
    this.useCache = useCache;
    if (useCache) {
        this.cache();
    }
}
PicCon.prototype.draw = function (gd) {
    if (!this.useCache) {
        gd.save();
        gd.drawImage(this.img, this.x, this.y, this.w, this.h);
        gd.restore();
    } else {
        gd.drawImage(this.cacheCanvas, this.x, this.y, this.w, this.h);
    }
};
PicCon.prototype.cache = function () {
    this.cacheCtx.save();
    this.cacheCtx.drawImage(this.img, 0, 0, this.w, this.h);
    this.cacheCtx.restore();
};
PicCon.prototype.setMsg = function (x, y) {
    this.x = x;
    this.y = y;
};
// 元素(礼包、路障、炸弹)
function Element(img, x, y, w, h, type) {
    this.visible = true;
    this.img = img;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.type = type;
}
Element.prototype.draw = function (gd) {
    gd.save();
    gd.drawImage(this.img, this.x, this.y, this.w, this.h);
    gd.restore();
};
Element.prototype.setMsg = function (x, y) {
    this.x = x;
    this.y = y;
};