/**
 * 弹层控件选择插件
 * by tankunpeng 2016/6/28
 */
(function (w, f) {
    'use strict';
    if (typeof define === 'function') {
        //  CMD
        define('areaSelect/1.0.1/areaSelect', ['iscroll/2.0.0/iscroll-lite'], function (require) {
            return f(w, require);
        });
    } else if (typeof exports === 'object') {
        //  CommonJS
        module.exports = f(w);
    } else {
        //  browser global
        window.areaSelect = f(w);
    }
})(window, function (w, require) {
    'use strict';
    var $ = w.jQuery;

    /**
     * 判断是否加载了jquery
     */
    if (!$) {
        console.log('no load jquery!');
    }

    /**
     * 判断是通过seajs加载方式还是页面直接引用
     * ！！！这里需要注意当使用seajs模块加载时，因为用到了iscroll插件所以要通过require方式引入
     */
    w.IScroll = w.IScrollLite ? w.IScrollLite : require('iscroll/2.0.0/iscroll-lite');
    var IScrollLite = w.IScrollLite ? w.IScrollLite : w.IScroll;

    /**
     * 选择器的html字符串
     * @type {string}
     */
    var dateHtml = '<div class="sf-maskFixed" style="display:none;" id="area">' +
        '<div class="sf-bdmenu" id="bdmenu">' +
        '<div class="tt">' +
        '<div id="cancel" class="cancel">取消</div>' +
        '<div id="areaBack" style="display:none;" class="return">返回</div>' +
        '<div id="optionInfo" class="info">请选择您所在的区域</div>' +
        '</div>' +
        '<div id="proCon" class="con show" style="display:block;">' +
        '<ul style="transition-timing-function: cubic-bezier(0.1, 0.57, 0.1, 1); transition-duration: 0ms; transform: translate(0px, 0px) translateZ(0px);">' +
        '</ul>' +
        '</div>' +
        '</div>' +
        '</div>';

    /**
     * 选择器类
     * @constructor
     */
    function SelectorClass(ops) {
        // 不推荐每次都new调用,页面初始化的new 一次,显示时候调用show方法;
        $('#area').remove();
        for (var name in ops) {
            if (ops.hasOwnProperty(name)) {
                this[name] = ops[name];
            }
        }
        this.inited = false;
        // ul列表绑定事件
        this.CITYLIST_ON_CLICK = false;
        // iscroll 对象数组
        this.iscrollArr = {};
        this.init();
    }

    SelectorClass.prototype = {

        /**
         * 初始化函数
         */
        init: function () {
            var that = this;
            that.con = that.con || $(dateHtml);

            // 选择器初始化
            if (that.inited) {
                if (that.isReplace) {
                    $('#optionInfo').text(that.title);
                    // 如果重新传值的话替换列表
                    that.replaceList();
                }
                var secondList = $('.conSecond');
                secondList && secondList.hide();
                that.returnBtn.hide();
                that.con.show();
                that.setPosition(that.is, that.defaultIndex);
                that.defaultSelectObj.length && that.defaultSelectObj.addClass('activeS');
            }

            // 选择器存在直接显示
            if (!that.inited) {
                // 不存在，创建选择器
                // 将选择器的jquery对象实例加入到body中
                $(document.body).append(that.con);
                that.returnBtn = $('#areaBack');
                $('#optionInfo').text(that.title);
                // 设置选择器默认title
                that.cityList = $('#proCon ul');
                // 一级列表容器
                if (that.area instanceof Array) {
                    that.level = 'one';
                    that.setOneShow();
                    // 设置一级列表显示
                } else if (that.area instanceof Object) {
                    that.level = 'two';
                    that.setTwoShow();
                    // 如果是二级列表，设置显示
                } else {
                    console.error('数据格式错误');
                    return;
                }
                that.is = that.createScroll('#proCon');
                // 给一级列表添加iscroll实例
                that.setPosition(that.is, that.defaultIndex);
                // 如果有对应的默认选项，调整显示位置居中

                // 浮层点击消失
                that.con.on('click', function (ev) {
                    ev.stopPropagation();
                    $(this).hide();
                });
                // 选择部分阻止冒泡
                $('#bdmenu').on('click', function (ev) {
                    ev.stopPropagation();
                });
                $('#cancel').on('click', function (ev) {
                    ev.stopPropagation();
                    // 返回按钮监听事件
                    that.con.hide();
                    // 隐藏选择器
                    var secondList = $('.conSecond');
                    secondList && secondList.hide();
                    // 如果二级列表存在，将其隐藏，使每次打开时默认显示一级列表
                    that.areaCancelFunc && that.areaCancelFunc();
                    // 取消回调事件
                });
                // 初始化完成
                that.inited = true;
            }
        },

        /**
         * 替换列表
         */
        replaceList: function () {
            var that = this;
            $('#proCon').find('li').remove();
            $('.conSecond').remove();
            // 一级列表容器
            if (that.area instanceof Array) {
                that.level = 'one';
                // 设置一级列表显示
                that.setOneShow();
            } else if (that.area instanceof Object) {
                that.level = 'two';
                // 如果是二级列表，设置显示
                that.setTwoShow();
            } else {
                console.error('数据格式错误');
                return;
            }
            that.is = that.createScroll('#proCon');
        },

        /**
         * 创建scroll实例
         * @param list 创建scroll的父容器
         * @returns {*}
         */
        createScroll: function (list) {

            /**
             * 声明iscroll滚动实例
             */
            var that = this;
            if (!that.iscrollArr[list]) {
                var iscroll = new IScrollLite(list, {
                    bindToWrapper: true,
                    // 滚动为该节点
                    scaleX: false,
                    // 不可横向滚动
                    scaleY: true,
                    // 开启纵向滚动
                    specialEnd: true
                    // 开启特殊滑动结束事件触发机制
                });
                that.iscrollArr[list] = iscroll;
            } else {
                that.iscrollArr[list].refresh();
            }
            return that.iscrollArr[list];
        },

        /**
         * 一级列表的控制显示
         */
        setOneShow: function () {
            var that = this;
            var arrL = that.area.length;
            var areaLi = [];

            /**
             * 循环遍历参数数组，设置选择器列表的显示值
             */
            for (var i = 0; i < arrL; i++) {
                var arr = that.area[i].split('-');
                var value = arr[0];
                var attrArr = arr.splice(1);
                var attrArrL = attrArr.length;
                // ['北京','120','bj']
                // 处理自定义属性
                var attrStr = '';
                if (attrArrL) {
                    for (var j = 0; j < attrArrL; j++) {
                        attrStr += 'data-' + [j] + '=' + attrArr[j] + ' ';
                    }
                }
                if (that.area[i] === that.defaultSelect) {
                    // 判断是默认选项
                    areaLi[i] = '<li class = "activeS" ' + attrStr + '>' + value + '</li>';
                    // 记录默认选项在列表中的索引
                    that.defaultIndex = i;
                } else {
                    areaLi[i] = '<li ' + attrStr + '>' + value + '</li>';
                }
            }
            that.cityList.append(areaLi.join(''));
            that.defaultSelectObj = that.cityList.find('.activeS');
            that.ulbindClick();

            // 弹层显示
            that.con.show();
        },

        /**
         * 两级列表的控制显示
         */
        setTwoShow: function () {
            var that = this;
            var area = that.area;
            var areaLi = [];
            var i = 0;
            that.twoArea = {};

            /**
             * 循环遍历参数对象，设置选择器列表的显示值
             */
            for (var key in area) {
                if (area.hasOwnProperty(key)) {
                    // 处理自定义属性
                    var arr = key.split('-');
                    var value = arr[0];
                    var attrArr = arr.splice(1);
                    var attrArrL = attrArr.length;
                    var attrStr = '';
                    if (attrArrL) {
                        for (var j = 0; j < attrArrL; j++) {
                            attrStr += 'data-' + [j] + '=' + attrArr[j] + ' ';
                        }
                    }
                    if (key === that.defaultSelect) {
                        // 判断是默认选项
                        areaLi[i] = '<li id = ' + i + ' class = "activeS" ' + attrStr + '>' + value + '</li>';
                        that.defaultIndex = i;
                        // 记录默认选项在列表中的索引
                    } else {
                        areaLi[i] = '<li id = ' + i + ' ' + attrStr + '>' + value + '</li>';
                    }
                    i++;
                }
            }
            that.cityList.append(areaLi.join(''));
            that.defaultSelectObj = that.cityList.find('.activeS');
            that.ulbindClick();
            that.con.show();
        },

        /**
         * ul绑定click事件
         */
        ulbindClick: function () {
            var that = this;
            if (that.CITYLIST_ON_CLICK) {
                return;
            }
            that.CITYLIST_ON_CLICK = true;
            that.cityList.on('click', 'li', function () {
                var clickLi = $(this);
                if (that.level === 'one') {
                    // 选择器列表的点击监听事件
                    clickLi.addClass('active').siblings().removeClass('activeS');
                    // 给被点击的列表添加动态样式效果
                    clickLi.on('webkitAnimationEnd mozAnimationEnd animationend', function () {
                        // 监听动画结束事件
                        that.oneClickLiListener(clickLi);
                        clickLi.off('webkitAnimationEnd mozAnimationEnd animationend');
                    });
                    // 点击函数回调 返回被选择的内容
                    that.getSelection && that.getSelection({
                        value: clickLi.text(),
                        element: clickLi,
                        data: clickLi.data()
                    });
                } else if (that.level === 'two') {
                    // 一级列表的点击监听事件
                    // 返回按钮
                    that.twoArea.level0 = {
                        value: clickLi.text(),
                        element: clickLi,
                        data: clickLi.data()
                    };
                    that.returnBtn.show();
                    // 显示返回按钮
                    clickLi.addClass('active').siblings().removeClass('activeS');
                    // 添加点击时候的动态效果
                    clickLi.on('webkitAnimationEnd mozAnimationEnd animationend', function () {
                        that.twoFirstClickLiListener(clickLi);
                        clickLi.off('webkitAnimationEnd mozAnimationEnd animationend');
                    });
                }
            });
        },

        /**
         * 二级列表的第一层列表点击时的监听事件
         * @param clickLi 二级列表的第一层列表的li
         */
        twoFirstClickLiListener: function (clickLi) {
            var that = this;
            // 动画结束时事件
            clickLi.removeClass('active');
            // 将一级列表的动态样式去掉
            var clickLiId = clickLi.attr('id');
            // 被点击的以及列表的id
            var cityCon = $('#cityCon_' + clickLiId);
            // 与被点击的一级列表对应的二级列表
            if (cityCon.length) {
                cityCon.show();
                // 如果对应的城市二级列表存在，则显示该二级列表
            } else {
                var dataJson = clickLi.data();
                var str = clickLi.text();
                if (typeof dataJson[0] !== undefined) {
                    for (var name in dataJson) {
                        if (dataJson.hasOwnProperty(name)) {
                            str += '-' + dataJson[name];
                        }
                    }
                }
                that.createSecondList(clickLiId, clickLi, str);
                // 如果二级列表不存在，则创建二级列表
            }
        },
        /**
         * 一级列表的监听点击事件处理
         * @param clickLi 一级列表的li
         */
        oneClickLiListener: function (clickLi) {
            var that = this;
            clickLi.removeClass('active');
            // 将动态样式去掉
            that.con.hide();
            // 将选择器隐藏
        },
        /**
         * 创建二级列表
         * @param clickLiId 被点击的一级列表的id
         * @param clickLi 被点击一级元素
         * @param name 被点击一级属性名
         */
        createSecondList: function (clickLiId, clickLi, name) {
            var that = this;
            var cityArr = that.area[name];
            var cityArrL = cityArr.length;
            // 一级列表对应的二级列表的数组
            var cityDom = '';
            // 生成的二级列表的dom
            cityDom = '<div id="cityCon_' + clickLiId + '" class="con conSecond show">' + '<ul>';
            for (var j = 0; j < cityArrL; j++) {
                // 处理自定义属性
                var arr = cityArr[j].split('-');
                var value = arr[0];
                var attrArr = arr.splice(1);
                var attrArrL = attrArr.length;
                var attrStr = '';
                if (attrArrL) {
                    for (var k = 0; k < attrArrL; k++) {
                        attrStr += 'data-' + [k] + '=' + attrArr[k] + ' ';
                    }
                }
                cityDom += '<li ' + attrStr + '>' + value + '</li>';
            }
            cityDom += '</ul></div>';
            $('#bdmenu').append(cityDom);
            // $(cityDom).addClass('show');
            // 显示二级列表
            that.createScroll($(cityDom)[0], that);
            // 给二级列表添加scroll实例
            that.returnBtn.on('click', function (ev) {
                ev.stopPropagation();
                // 点击返回按钮监听事件
                that.hideCityList(clickLi, clickLiId);
            });
            $('#cityCon_' + clickLiId).on('click', 'li', function (ev) {
                ev.stopPropagation();
                // 二级列表点击监听事件
                var secondClickLi = $(this);

                // 添加选择内容
                that.twoArea.level1 = {
                    value: secondClickLi.text(),
                    element: secondClickLi,
                    data: secondClickLi.data()
                };

                secondClickLi.addClass('active');
                // 添加点击时候的动态效果
                secondClickLi.on('webkitAnimationEnd mozAnimationEnd animationend', function () {
                    that.twoSecondClickLiListener(secondClickLi, clickLi, clickLiId);
                    secondClickLi.off('webkitAnimationEnd mozAnimationEnd animationend');
                });
                that.getSelection && that.getSelection(that.twoArea);
                // 返回被选择的内容
            });
        },
        /**
         * 二级列表的第二层列表点击时的监听事件
         * @param secondClickLi 二级列表的第二层列表的li
         * @param clickLi 二级列表的第一层列表的li
         * @param clickLiId 二级列表的第一层列表的li的id
         */
        twoSecondClickLiListener: function (secondClickLi, clickLi, clickLiId) {
            var that = this;
            secondClickLi.removeClass('active');
            // 去掉列表的动态效果
            that.con.hide();
            that.hideCityList(clickLi, clickLiId);
            // 控制一级列表显示，为了在再次点开选择器时默认显示的是一级列表
        },
        /**
         * 两级地址时，隐藏第二级地址列表，显示第一级地址列表
         * @param clickLi 第一级地址列表
         * @param clickLiId 第二级地址列表的索引id
         */
        hideCityList: function (clickLi, clickLiId) {
            $('#cityCon_' + clickLiId).hide();
            // 隐藏第二级地址列表
            this.returnBtn.hide();
            // 隐藏返回按钮
            clickLi.removeClass('active');
            this.cityList.show();
            // 显示一级列表
        },

        /**
         * 设置位置，设置默认选项的位置正好垂直居中
         * @param is 当前滚动实例
         * @param index 默认选项在列表中的索引位置
         */
        setPosition: function (is, index) {
            if (index === '' || index === undefined) {
                is.scrollTo(0, 0, 100);
                return;
            }
            var that = this,
                $is = $(is.wrapper);
            var indexHeight = index * that.singleLiHeight;
            // 默认选项在列表中的垂直高度
            var halfContainerHeight = Math.round($is.height() / 2);
            // 列表容器的高度/2
            var moveHeight = indexHeight - halfContainerHeight + 2 * that.singleLiHeight;
            // 调整垂直居中显示时的垂直高度
            is.scrollTo(0, -moveHeight, 100);
        },

        showSelector: function (ops) {
            var that = this;
            that.isReplace = true;
            that.defaultIndex = '';
            for (var name in ops) {
                if (ops.hasOwnProperty(name)) {
                    that[name] = ops[name];
                }
            }
            that.init();
        }
    };

    /**
     * 区域选择主类
     * @constructor
     */
    function AreaSelect(ops) {

        /**
         * 选择器
         */
        this.areaObj = undefined;
        this.defaultOptions = {};
        this.options = {
            title: '请选择您所在的区域',
            // 选择器显示标题
            area: [],
            defaultSelect: '',
            singleLiHeight: 34,
            // 单个选项的css高度，用于后面的位置计算
            areaCancelFunc: undefined,
            // 取消按钮事件处理
            getSelection: undefined
            // 选择区域事件处理
        };
        $.extend(this.options, ops);
        $.extend(this.defaultOptions, this.options);
    }

    AreaSelect.prototype = {

        /**
         * 显示选择器
         */
        show: function (ops) {
            var that = this;
            ops && $.extend(this.options, ops);
            if (that.areaObj) {
                that.areaObj.showSelector(ops || that.defaultOptions);
            } else {
                that.areaObj = new SelectorClass(ops || that.defaultOptions);
            }
        }
    };
    return AreaSelect;
});
