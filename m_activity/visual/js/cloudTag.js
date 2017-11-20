window.tagcloud = (function (win, doc) {
    //  判断对象

    function isObject(obj) {
        return Object.prototype.toString.call(obj) === '[object Object]';
    }

    //  构造函数

    function TagCloud(options) {
        var that = this;

        that.config = TagCloud._getConfig(options);
        // 组件元素
        that.box = that.config.element;
        // 平均字体大小
        that.fontsize = that.config.fontsize;
        // 滚动半径
        that.radius = that.config.radius;
        // 滚动深度
        that.depth = 1.5 * that.radius;
        // 随鼠标滚动变速作用区域
        that.size = 1.5 * that.radius;
        // 标签数据
        that.tags = that.config.tags;

        that.aniName = that.config.aniName;
        // 插入标签
        that.append(that.tags);

        that.mspeed = TagCloud._getMsSpeed(that.config.mspeed);
        that.ispeed = TagCloud._getIsSpeed(that.config.ispeed);
        that.items = that._getItems();

        // 初始滚动方向
        that.direction = that.config.direction;
        // 鼠标移出后是否保持之前滚动
        that.keep = that.config.keep;

        // 初始化

        // 是否为激活状态
        that.active = false;
        that.lasta = 1;
        that.lastb = 1;
        // 鼠标与滚动圆心x轴初始距离
        that.mouseX0 = that.ispeed * Math.sin(that.direction * Math.PI / 180);
        // 鼠标与滚动圆心y轴初始距离
        that.mouseY0 = -that.ispeed * Math.cos(that.direction * Math.PI / 180);
        // 鼠标与滚动圆心x轴距离
        that.mouseX = that.mouseX0;
        // 鼠标与滚动圆心y轴距离
        that.mouseY = that.mouseY0;

        // 鼠标移入

        TagCloud._on(that.box, 'mouseover', function () {
            that.active = true;
        });
        // 鼠标移出

        TagCloud._on(that.box, 'mouseout', function () {
            that.active = false;
            // 鼠标与滚动圆心x轴距离
            that.mouseX = that.mouseX0;
            // 鼠标与滚动圆心y轴距离
            that.mouseY = that.mouseY0;
        });
        // 鼠标在内移动

        TagCloud._on(that.keep ? win : that.box, 'mousemove', function (ev) {
            var oEvent = win.event || ev;
            var boxPosition = that.box.getBoundingClientRect();
            that.mouseX = (oEvent.clientX - (boxPosition.left + that.box.offsetWidth / 2)) / 5;
            that.mouseY = (oEvent.clientY - (boxPosition.top + that.box.offsetHeight / 2)) / 5;
        });

        // 定时更新

        TagCloud.boxs.push(that.box);
        that.frame = function () {
            that.update(that);
        };
        // 初始更新
        that.update(that);
        that.box.style.visibility = 'visible';
        that.box.style.position = 'relative';
        that.box.style.minHeight = 2 * that.size + 'px';
        that.box.style.minWidth = 2 * that.size + 'px';
        for (var j = 0, len = that.items.length; j < len; j++) {
            that.items[j].element.style.position = 'absolute';
            that.items[j].element.style.zIndex = j + 1;
        }

        // that.up = setInterval(function () {
        //     that.update();
        // }, 30);

    }

    // 实例

    // 实例元素数组
    TagCloud.boxs = [];
    //  静态方法们

    TagCloud._set = function (element) {
        if (TagCloud.boxs.indexOf(element) == -1) {
            return true;
        }
    };
    TagCloud._getConfig = function (config) {
        // 默认值
        var defaultConfig = {
            // 基本字体大小, 单位px
            fontsize: 16,
            // 滚动半径, 单位px
            radius: 60,
            // 滚动最大速度, 取值: slow, normal(默认), fast
            mspeed: 'normal',
            // 滚动初速度, 取值: slow, normal(默认), fast
            ispeed: 'normal',
            // 初始滚动方向, 取值角度(顺时针360): 0对应top, 90对应left, 135对应right-bottom(默认)...
            direction: 135,
            // 鼠标移出组件后是否继续随鼠标滚动, 取值: false, true(默认) 对应 减速至初速度滚动, 随鼠标滚动
            keep: true
        };

        if (isObject(config)) {
            for (var i in config) {
                if (config.hasOwnProperty(i)) {
                    // 用户配置
                    defaultConfig[i] = config[i];
                }
            }
        }

        //  配置 Merge
        return defaultConfig;
    };
    // 滚动最大速度
    TagCloud._getMsSpeed = function (mspeed) {
        var speedMap = {
            slow: 1.5,
            normal: 3,
            fast: 5
        };
        return speedMap[mspeed] || 3;
    };
    // 滚动初速度
    TagCloud._getIsSpeed = function (ispeed) {
        var speedMap = {
            slow: 10,
            normal: 25,
            fast: 50
        };
        return speedMap[ispeed] || 25;
    };
    TagCloud._getSc = function (a, b) {
        var l = Math.PI / 180;
        // 数组顺序0,1,2,3表示asin,acos,bsin,bcos

        return [
            Math.sin(a * l),
            Math.cos(a * l),
            Math.sin(b * l),
            Math.cos(b * l)
        ];
    };
    TagCloud._on = function (ele, eve, handler, cap) {
        if (ele.addEventListener) {
            ele.addEventListener(eve, handler, cap);
        } else if (ele.attachEvent) {
            ele.attachEvent('on' + eve, handler);
        } else {
            ele['on' + eve] = handler;
        }
    };

    //  原型方法

    TagCloud.prototype = {
        //  反向引用构造器
        constructor: TagCloud,

        append: function (tags) {
            var html = '';
            for (var i = 0, len = tags.length; i < len; i++) {
                tags[i].link = tags[i].link || 'javascript:;';
                html += '<a href="' + tags[i].link + '">' + tags[i].name + '</a>'
            }
            document.querySelector(this.config.selector).innerHTML = html;
        },

        update: function () {
            var that = this, a, b;
            if (!that.active && !that.keep) {
                // 重置鼠标与滚动圆心x轴距离
                that.mouseX = Math.abs(that.mouseX - that.mouseX0) < 1 ? that.mouseX0 : (that.mouseX + that.mouseX0) / 2;
                // 重置鼠标与滚动圆心y轴距离
                that.mouseY = Math.abs(that.mouseY - that.mouseY0) < 1 ? that.mouseY0 : (that.mouseY + that.mouseY0) / 2;
            }
            a = -(Math.min(Math.max(-that.mouseY, -that.size), that.size) / that.radius ) * that.mspeed;
            b = (Math.min(Math.max(-that.mouseX, -that.size), that.size) / that.radius ) * that.mspeed;
            if (Math.abs(a) <= 0.01 && Math.abs(b) <= 0.01) {
                return;
            }

            that.lasta = a;
            that.lastb = b;

            var sc = TagCloud._getSc(a, b);


            for (var j = 0, len = that.items.length; j < len; j++) {
                var rx1 = that.items[j].x,
                    ry1 = that.items[j].y * sc[1] + that.items[j].z * (-sc[0]),
                    rz1 = that.items[j].y * sc[0] + that.items[j].z * sc[1];

                var rx2 = rx1 * sc[3] + rz1 * sc[2],
                    ry2 = ry1,
                    rz2 = rz1 * sc[3] - rx1 * sc[2];

                var per = that.depth / (that.depth + rz2 * 0.6) ;
                var thisItem = that.items[j];

                thisItem.x = rx2;
                thisItem.y = ry2;
                thisItem.z = rz2;
                // 取值范围0.6 ~ 3
                thisItem.scale = per;
                thisItem.fontsize = (per * 5) + that.fontsize - 6;
                thisItem.alpha = 1 * per - 0.5;

                var left = thisItem.x + (that.box.offsetWidth - thisItem.offsetWidth) / 2 + 'px';
                var top = thisItem.y + (that.box.offsetHeight - thisItem.offsetHeight) / 2 + 'px';
                var fontSize = ~~thisItem.fontsize + 'px';
                var opacity = thisItem.alpha > 1 ? 1 : thisItem.alpha;
                var zIndex = ~~(thisItem.alpha * 10) || thisItem.element.style.zIndex;
                thisItem.element.style.cssText = 'position: absolute;'
                    + 'z-index:' + zIndex
                    + ';webkitTransform:translate3d(' + left + ',' + top + ',0) scale(' + per + ')'
                    + ';mozTransform:translate3d(' + left + ',' + top + ',0) scale(' + per + ')'
                    + ';transform:translate3d(' + left + ',' + top + ',0) scale(' + per + ')'
                    // + ';font-size:' + fontSize
                    + ';opacity:' + opacity
                    + ';';
            }
            // if (that.aniName) {
            cancelAnimationFrame(that.aniName.aniName);
                that.aniName.aniName = requestAnimationFrame(that.frame);
            // }
        },

        _getItems: function () {
            var that = this,
                items = [],
                //  children 全部是Element
                element = that.box.children,
                length = element.length,
                item;

            for (var i = 0; i < length; i++) {
                item = {};
                item.angle = {};
                item.angle.phi = Math.acos(-1 + (2 * i + 1) / length);
                item.angle.theta = Math.sqrt((length + 1) * Math.PI) * item.angle.phi;
                item.element = element[i];
                item.offsetWidth = item.element.offsetWidth;
                item.offsetHeight = item.element.offsetHeight;
                item.x = that.radius * Math.cos(item.angle.theta) * Math.sin(item.angle.phi);
                item.y = that.radius * Math.sin(item.angle.theta) * Math.sin(item.angle.phi);
                item.z = that.radius * Math.cos(item.angle.phi);
                item.element.style.left = item.x + (that.box.offsetWidth - item.offsetWidth) / 2 + 'px';
                item.element.style.top = item.y + (that.box.offsetHeight - item.offsetHeight) / 2 + 'px';
                items.push(item);
            }

            // 单元素数组
            return items;
        }
    };

    //  factory
    return function (options) {
        //  短路语法
        options = options || {};
        // 默认选择class为tagcloud的元素
        var selector = options.selector || '.tagcloud',
            elements = doc.querySelectorAll(selector),
            instance;
        for (var index = 0, len = elements.length; index < len; index++) {
            options.element = elements[index];
            if (!!TagCloud._set(options.element)) {
                instance = new TagCloud(options);
            }
        }
        return instance;
    };
})(window, document);