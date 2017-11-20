(function (win) {
    'use strict';

    /**
     * @Author: 坤鹏
     * @Date: 2016/01/18 9:54
     * @description: draw.js
     * @Last Modified by:   **
     * @Last Modified time:
     */
    function DisplayObject() {
        this.childList = [];
    }
    DisplayObject.prototype.addChild = function (c) {
        this.childList.push(c);
    };
    DisplayObject.prototype.removeChild = function (c) {
        var idx = this.childList.indexOf(c);
        if (idx > -1) {
            this.childList.splice(idx, 1);
        }
    };
    DisplayObject.prototype.draw = function (gd) {
        var l = this.childList.length;
        for (var i = 0; i < l; i++) {
            var el = this.childList[i];
            el.draw(gd);
        }
    };


    /**
     * 渲染背景图片
     * @param img 图片对象
     * @param x 渲染x轴距离
     * @param y 渲染y轴距离
     * @param w 渲染宽度
     * @param h 渲染高度
     * @param monkey 是否是猴子
     * @constructor
     */
    function Pic(img, x, y, w, h, monkey,cWidth,cHeight) {
        this.visible = true;
        this.img = img;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.cWidth = cWidth;
        this.cHeight = cHeight;
        this.cacheCanvas = document.createElement('canvas');
        this.cacheCtx = this.cacheCanvas.getContext('2d');
        this.cacheCanvas.width = this.w;
        this.cacheCanvas.height = this.h;
        if (monkey) {
            this.monkey = monkey;
            this.nowFrame = 0;
        } else {
            this.cache();
        }
    }
    Pic.prototype.draw = function (gd) {
        gd.save();
        if (this.monkey) {
            if (this.nowFrame > 2) {
                this.nowFrame = 2;
            }
            gd.drawImage(this.img, 0, this.nowFrame * this.h / 0.702 * 850 / this.cHeight | 0, this.w / 0.769 * 540 / this.cWidth | 0, this.h / 0.702 * 850 / this.cHeight | 0, this.x, this.y, this.w, this.h);
        } else {
            gd.drawImage(this.cacheCanvas, this.x, this.y, this.w, this.h);
        }
        gd.restore();
    };
    Pic.prototype.setPOS = function (x, y) {
        this.x = x;
        this.y = y;
    };
    Pic.prototype.cache = function () {
        this.cacheCtx.save();
        if (!this.monkey) {
            this.cacheCtx.drawImage(this.img, 0, 0, this.w, this.h);
        }
        this.useCache = true;
        this.cacheCtx.restore();
    };

    /**
     * 渲染文字
     * @param text 渲染内容
     * @param x x坐标
     * @param y y坐标
     * @param font 字体大小
     * @param color 颜色
     */
    function TextRect(text, x, y, font, color) {
        this.visible = true;
        this.text = text;
        this.x = x;
        this.y = y;
        this.font = font;
        this.color = color;
    }
    TextRect.prototype.setPOS = function (x, y) {
        this.x = x;
        this.y = y;
    };
    TextRect.prototype.draw = function (gd) {
        gd.font = this.font + 'px bold Arial';
        gd.fillStyle = this.color;
        gd.fillText(this.text, this.x, this.y);
    };

    /**
     * 渲染创建的元素(金砖、黑砖)
     * @param img
     * @param x
     * @param y
     * @param w
     * @param h
     * @param type
     * @constructor
     */
    function Ele(img, x, y, w, h, type) {
        this.visible = true;
        this.img = img;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.type = type;
    }
    Ele.prototype.draw = function (gd) {
        gd.save();
        gd.drawImage(this.img, this.x, this.y, this.w, this.h);
        gd.restore();
    };
    Ele.prototype.setMsg = function (x, y) {
        this.x = x;
        this.y = y;
    };

    win.DisplayObject = DisplayObject;
    win.TextRect = TextRect;
    win.Pic = Pic;
    win.Ele = Ele;
})(window);