/**
 * 直销销控表第二次优化(销控表放大缩小等)
 * by fcWang (wangfengchao@fang.com)
 */
define('modules/xf/tolpxkTable', ['jquery', 'hammer/2.0.4/hammer', 'swipe/3.10/swiper', 'iscroll/2.0.0/iscroll-lite'], function (require) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;
    var Util = require('util/util');
    var sfut = Util.getCookie('sfut');
    var newcode = vars.newcode;
    var url = vars.mainSite;
    var city = vars.city;
    var loudongId = vars.loudongId;
    var dataTid = '';
    var issuc = false;
    var IScroll = require('iscroll/2.0.0/iscroll-lite');

    // 登录后获取用户名，手机号和用户ID
    var username, telephone;

    function getInfo(data) {
        username = data.username || '';
        telephone = data.mobilephone || '';
    }

    // 调用ajax获取登陆用户信息
    if (sfut) {
        vars.getSfutInfo(getInfo);
    }

    // 设置表格内容外框 表格序号外框 的高度
    $('.xkb-con, .xkb-lh').height($('body').height() - $('.xbkSection').offset().top - $('.xkb-top').height());
    // 设置表格内容外框 表格头部外框 的宽度
    $('.xkb-con, .xkb-t-t').width($('.xbkSection').width() - $('.xkb-top ul').width());
    // 设置xbkSection高度
    $('.xbkSection').height($('body').height() - $('.xbkSection').offset().top);

    var showLittleMap = function () {
        $('.xkb-thumb').hide();
    };

    // 隐藏小地图的方法
    var mapHide;
    var hideLittleMap = function () {
        clearTimeout(mapHide);
        mapHide = setTimeout(function () {
            $('.xkb-thumb').stop().fadeOut(200);
        }, 1500);
    };

    // 初始化hammer
    var hammer = new Hammer($('.xkb-con')[0]);
    // 允许识别垂直方位的pan
    hammer.get('pan').set({
        direction: Hammer.DIRECTION_ALL
    });
    hammer.add(new Hammer.Pinch());

    /*
     表格需要的参数
     */
    // 销控表section宽度
    var xbkSectionWidth = $('.xkb-con').width();
    // 销控表section高度
    var xbkSectionHeight = $('.xkb-con').height();
    // 销控表宽度
    var xkbWidth = $('#conTable').width();
    // 销控表高度
    var xkbHeight = $('#conTable').height();
    // 当前缩放倍数
    var nowScale = 1;
    // 最大缩放倍数
    var maxScale = 1.8;
    // 最小缩放倍数
    var minScale = Math.max(0.6, xbkSectionWidth / xkbWidth);
    // 销控表宽度活动范围变化
    var deltaX = 0;
    // 销控表高度
    var deltaY = 0;
    // 本次缩放倍数
    var a;

    /*
     小地图需要的参数
     设置小地图的宽高（后台第一次加载时就处理好）
     */
    // 地图中销控表宽度
    var mapXkbWidth = $('.xkb-thumb').width() + 6;
    // 地图中销控表高度(根据宽度按比例得出)
    // var mapXkbHeight = mapXkbWidth / xkbWidth * xkbHeight;
    // 地图中销控表高度
    var mapXkbHeight = $('.xkb-thumb').height() + 6;
    // 设置地图中销控表高度
    $('.xkb-thumb').css({width: mapXkbWidth, height: mapXkbHeight});
    // 地图中小section宽度
    var mapXbkSectionWidth = xbkSectionWidth / xkbWidth * mapXkbWidth;
    // 地图中小section高度
    var mapXbkSectionHeight = xbkSectionHeight / xkbHeight * mapXkbHeight;
    // 设置地图地图中小section宽度高度
    $('.thumb-b').css({width: mapXbkSectionWidth, height: mapXbkSectionHeight});
    // 设置地图地图中小section位置为左上角
    $('.thumb-b').css({left: 0, top: 0});

    // 表格当前位置
    var nowX = 0;
    var nowY = 0;
    // 初始化坐标
    $('#conTable, #topTable, .xkb-lh ul').css('transform', 'translate(' + nowX + 'px,' + nowY + 'px) scale(1)');
    // 本次移动过程实时坐标
    var x, y;
    // 移动的限制范围(最开始)
    var minX = xbkSectionWidth - xkbWidth;
    var maxX = 0;
    var minY = xbkSectionHeight - xkbHeight;
    var maxY = 0;

    // 设置表格，顶部，左边，小地图的位置、缩放比例的方法
    var setTransform = function (nowX, nowY, s, mapWidth, mapHeight, mapX, mapY) {
        // 设置表格内容的位置，放大倍数
        $('#conTable').css('transform', 'translate(' + nowX + 'px, ' + nowY + 'px) scale(' + s + ')');
        // 同步设置左边y
        $('.xkb-lh ul').css('transform', 'translate(0px, ' + nowY + 'px) scaleY(' + s + ')');
        // 同步设置顶部x
        $('#topTable').css('transform', 'translate(' + nowX + 'px, 0px) scaleX(' + s + ')');
        // 同步设置地图地图中小section宽度高度
        $('.thumb-b').css({width: mapWidth, height: mapHeight});
        // 同步设置地图地图中小section位置
        $('.thumb-b').css({left: mapX, top: mapY});
    };

    // 放大缩小的方法
    var pinch = function (s) {
        // 显示小地图
        showLittleMap();
        // 小地图中红框的宽高
        var mapWidth = mapXbkSectionWidth / s;
        var mapHeight = mapXbkSectionHeight / s;
        // 小地图与表格偏移的宽高比例
        var biliX = (xkbWidth * (1 - s) / 2 + nowX) / (xkbWidth * s);
        var biliY = (xkbHeight * (1 - s) / 2 + nowY) / (xkbHeight * s);
        // 小地图xy偏移
        var mapX = -mapXkbWidth * biliX;
        var mapY = -mapXkbHeight * biliY;
        // 设置表格，顶部，左边，小地图的位置、缩放比例
        setTransform(nowX, nowY, s, mapWidth, mapHeight, mapX, mapY);
    };

    // 手指离开屏幕后的定位
    var endPosition = function () {
        var transform = $('#conTable').css('transform').split(',');
        nowX = parseInt(transform[4]);
        nowY = parseInt(transform[5].split(')')[0]);
        minX = xbkSectionWidth - xkbWidth - deltaX;
        maxX = 0 + deltaX;
        minY = xbkSectionHeight - xkbHeight - deltaY;
        maxY = 0 + deltaY;
        // 太往左
        if (nowX < minX) {
            nowX = minX;
        }
        // 太往右
        if (nowX > maxX) {
            nowX = maxX;
        }
        // 太往上
        if (nowY < minY) {
            nowY = minY;
        }
        // 太往下
        if (nowY > maxY) {
            nowY = maxY;
        }
        // 小地图中红框的宽高
        var mapWidth = mapXbkSectionWidth / nowScale;
        var mapHeight = mapXbkSectionHeight / nowScale;
        // 小地图与表格偏移的宽高比例
        var biliX = (xkbWidth * (1 - nowScale) / 2 + nowX) / (xkbWidth * nowScale);
        var biliY = (xkbHeight * (1 - nowScale) / 2 + nowY) / (xkbHeight * nowScale);
        // 小地图xy偏移
        var mapX = -mapXkbWidth * biliX;
        var mapY = -mapXkbHeight * biliY;
        // 设置表格，顶部，左边，小地图的位置、缩放比例
        setTransform(nowX, nowY, nowScale, mapWidth, mapHeight, mapX, mapY);
    };

    // 缩放结束执行的事件
    var pinchend = function () {
        nowScale = nowScale * a;
        // 如果大于原来的maxScale倍
        if (nowScale >= maxScale) {
            nowScale = maxScale;
        } else if (nowScale <= minScale) { // 如果小于minScale倍
            nowScale = minScale;
        }
        // 销控表宽度活动范围变化
        deltaX = xkbWidth * (nowScale - 1) / 2;
        // 销控表高度活动范围变化
        deltaY = xkbHeight * (nowScale - 1) / 2;
        // 小地图中红框的宽高
        var mapWidth = mapXbkSectionWidth / nowScale;
        var mapHeight = mapXbkSectionHeight / nowScale;
        // 小地图与表格偏移的宽高比例
        var biliX = (xkbWidth * (1 - nowScale) / 2 + nowX) / (xkbWidth * nowScale);
        var biliY = (xkbHeight * (1 - nowScale) / 2 + nowY) / (xkbHeight * nowScale);
        // 小地图xy偏移
        var mapX = -mapXkbWidth * biliX;
        var mapY = -mapXkbHeight * biliY;
        // 设置表格，顶部，左边，小地图的位置、缩放比例
        setTransform(nowX, nowY, nowScale, mapWidth, mapHeight, mapX, mapY);
        // 手指离开屏幕后的定位
        endPosition();
        // 隐藏小地图
        hideLittleMap();
    };

    /*
     缩放部分
     */
    // 缩放开始
    hammer.on('pinchstart', function () {
        // 显示小地图
        showLittleMap();
    });

    // 多点触控之缩放过程
    hammer.on('pinch', function (e) {
        var scale = (1 - e.scale) * 0.5 + e.scale;
        if (nowScale * scale > maxScale || nowScale * scale < minScale) {
            return;
        }
        // 兼容苹果
        if (e.scale !== 1) {
            a = scale;
            pinch(nowScale * a);
        } else {
            pinch(nowScale * a);
            pinchend();
        }
    });
    // 缩放结束
    hammer.on('pinchend', function () {
        pinchend();
    });

    /*
     移动部分
     */
    // 拖动开始
    hammer.on('panstart', function () {
        // 显示小地图
        showLittleMap();
    });
    // 移动过程
    hammer.on('panmove', function (e) {
        // 显示小地图
        showLittleMap();
        x = nowX + parseInt(e.deltaX);
        y = nowY + parseInt(e.deltaY);
        // 小地图中红框的宽高
        var mapWidth = mapXbkSectionWidth / nowScale;
        var mapHeight = mapXbkSectionHeight / nowScale;
        // 小地图与表格偏移的宽高比例
        var biliX = (xkbWidth * (1 - nowScale) / 2 + x) / (xkbWidth * nowScale);
        var biliY = (xkbHeight * (1 - nowScale) / 2 + y) / (xkbHeight * nowScale);
        // 小地图xy偏移
        var mapX = -mapXkbWidth * biliX;
        var mapY = -mapXkbHeight * biliY;
        // 设置表格，顶部，左边，小地图的位置、缩放比例
        setTransform(x, y, nowScale, mapWidth, mapHeight, mapX, mapY);
        var evTouch = e.srcEvent.changedTouches[0];
        if (evTouch.clientX < 8 || evTouch.clientX > $(window).width() - 8 ||
            evTouch.clientY < 8 || evTouch.clientY > $(window).height() - 8) {
            // 手指离开屏幕后的定位
            endPosition();
            // 隐藏小地图
            hideLittleMap();
        }
    });
    // 拖动结束
    hammer.on('panend', function () {
        // 手指离开屏幕后的定位
        endPosition();
        // 隐藏小地图
        hideLittleMap();
    });


    /*
     小地图移动事件
     */
    // 初始化小地图hammer
    var mapHammer = new Hammer($('.thumb-b')[0]);
    // 允许识别垂直方位的pan
    mapHammer.get('pan').set({
        direction: Hammer.DIRECTION_ALL
    });
    mapHammer.add(new Hammer.Pinch());

    var mapStartX;
    var mapStartY;
    var tableStartX;
    var tableStartY;

    // 开始移动小红框
    mapHammer.on('panstart', function () {
        showLittleMap();
        mapStartX = $('.thumb-b').position().left;
        mapStartY = $('.thumb-b').position().top;
        tableStartX = $('#conTable').css('transform').split(',')[4];
        tableStartY = $('#conTable').css('transform').split(',')[5];
    });

    // 小红框移动过程
    mapHammer.on('panmove', function (e) {
        showLittleMap();
        // 小地图中红框的宽高
        var mapWidth = mapXbkSectionWidth / nowScale;
        var mapHeight = mapXbkSectionHeight / nowScale;
        // 现在的位置 = 原位置 + 手指偏移量
        var mapX = mapStartX + parseInt(e.deltaX);
        var mapY = mapStartY + parseInt(e.deltaY);
        // 小图偏移占表格的宽高比例
        var biliX = parseInt(e.deltaX) / mapXkbWidth;
        var biliY = parseInt(e.deltaY) / mapXkbHeight;

        // 大图xy偏移
        var x = nowX - xkbWidth * nowScale * biliX;
        var y = nowY - xkbHeight * nowScale * biliY;
        setTransform(x, y, nowScale, mapWidth, mapHeight, mapX, mapY);
    });

    // 结束移动小红框
    mapHammer.on('panend', function () {
        endPosition();
    });

    /*
     销控表其他点击事件
     */
    // 设置header
    $('.header').css('z-index', '1000');

    $('#hxDiv, #ldDiv').find('.active').addClass('default');
    var hideList = function () {
        $('#hxDiv, #ldDiv').find('.default').click();
        // 隐藏蒙层
        $('.float').addClass('none');
        // 隐藏所有下拉表
        $('#ldDiv, #hxDiv').addClass('none');
        $('#ld, #hx').removeClass('active');
        // 隐藏section
        $('#shx').removeClass('tabSX');
    };

    // 显示筛选列表的方法
    var showList = function (obj, $this) {
        if (!$this.hasClass('active')) {
            $('#ld, #hx').removeClass('active');
            $this.addClass('active');
            // 显示蒙层
            $('.float').removeClass('none');
            // 隐藏所有下拉表
            $('#ldDiv, #hxDiv').addClass('none');
            // 显示对应的下拉表
            obj.removeClass('none');
            // 显示section
            window.location.href.indexOf('src=client') != -1 ? $('#shx').addClass('tabSX').css('top', '0') : $('#shx').addClass('tabSX').css('top', '44px');
            new IScroll('#ldDivSec', {scrollX: false, scrollY: true, bindToWrapper: true});
            new IScroll('#hxDivSec', {scrollX: false, scrollY: true, bindToWrapper: true});
        } else {
            hideList();
        }
    };

    // 筛选楼栋
    $('#ld').on('click', function () {
        // 显示筛选列表
        showList($('#ldDiv'), $('#ld'));
        if (!$('#ldDivSec .active').length) {
            $('#ldDivSec [data-id*=' + $(this).attr('data') + ']').click();
            $('#ldDiv [data-id*=' + $('#hx').attr('data') + ']').addClass('active');
        }
    });
    // 筛选户型
    $('#hx').on('click', function () {
        // 显示筛选列表
        showList($('#hxDiv'), $('#hx'));
        if (!$('#hxDivSec .active').length) {
            $('#hxDivSec [data-id*=' + $(this).attr('data') + ']').click();
            $('#hxDiv [data-id*=' + $('#ld').attr('data') + ']').addClass('active');
        }
    });

    // 取消筛选
    $('.float').on('click', function () {
        if ($('#favoritemsg').is(':hidden')) {
            // 隐藏筛选列表
            hideList();
        }
    });

    var ldid, huxingdeid;
    // 先选择楼栋
    $('#ldDivSec dd').on('click', function () {
        var $this = $(this);
        ldid = $this.attr('data-id');
        // 清空选中
        $this.siblings().removeClass('active');
        // 选中此项
        $this.addClass('active');
        // 跳转到新的楼栋
        $('#ldDiv section').hide();
        $('#ldDivSec, #ldDiv [data*=' + ldid + ']').show();
        $('#ldDiv [data*=' + ldid + ']').find('.active').removeClass('active');

        $('#ldDiv').find('section:visible').each(function () {
            var $this = $(this);
            if (!$this.attr('id')) {
                $this.attr('id', 'section' + $this.attr('data'));
                new IScroll('#section' + $this.attr('data'), {scrollX: false, scrollY: true, bindToWrapper: true});
            }
        });
    });
    $('#ldDiv section').not(':last').find('dd').on('click', function () {
        if (!$(this).hasClass('active')) {
            huxingdeid = $(this).attr('data-id');
            $(this).siblings().removeClass('active');
            $(this).addClass('active');
            window.location.href = url + 'xf.d?m=tolpxkTable&city=' + city + '&newcode=' + newcode + '&loudongId=' + ldid + '&huxingdeid=' + huxingdeid + '&source=' + vars.source + '&src=' + vars.src;
        }
    });

    // 先选择户型
    $('#hxDivSec dd').on('click', function () {
        var $this = $(this);
        huxingdeid = $this.attr('data-id');
        // 清空选中
        $this.siblings().removeClass('active');
        // 选中此项
        $this.addClass('active');
        // 清空表中的小对勾
        $('#conTable li').removeClass('o-icon');
        // 隐藏筛选列表
        //hideList();
        $('#hxDiv section').hide();
        $('#hxDivSec, #hxDiv [data*=' + huxingdeid + ']').show();
        $('#hxDiv [data*=' + huxingdeid + ']').find('.active').removeClass('active');

        $('#hxDiv').find('section:visible').each(function () {
            var $this = $(this);
            if (!$this.attr('id')) {
                $this.attr('id', 'section' + $this.attr('data'));
                new IScroll('#section' + $this.attr('data'), {scrollX: false, scrollY: true, bindToWrapper: true});
            }
        });
    });
    $('#hxDiv section').not(':first').find('dd').on('click', function () {
        if (!$(this).hasClass('active')) {
            ldid = $(this).attr('data-id');
            $(this).siblings().removeClass('active');
            $(this).addClass('active');
            window.location.href = url + 'xf.d?m=tolpxkTable&city=' + city + '&newcode=' + newcode + '&loudongId=' + ldid + '&huxingdeid=' + huxingdeid + '&source=' + vars.source + '&src=' + vars.src;
        }
    });

    // 显示信息
    var $favoritemsg = $('#favoritemsg');
    var showMessage = function (msg) {
        var width = ($(window).width() - $favoritemsg.width()) / 2 + 65;
        $('.float').css('z-index', '2000').removeClass('none');
        $favoritemsg.html(msg).css({left: width + 'px'}).show();
    };

    // 隐藏信息
    var hideMessage = function () {
        $('.float').css('z-index', '50').addClass('none');
        $favoritemsg.hide(500);
    };

    // 看大图
    $('.floatOut1').on('click','.img', function (ev) {
        var imgData = [],
            wid = 600,
            hei = 400;
        $('#imgbox img').each(function () {
            var $this = $(this);
            imgData.push(
                {
                    src: $this.attr('src'),
                    w: wid,
                    h: hei
                }
            )
        });
        require.async(['photoswipe/4.0.8/photoswipe3.min', 'photoswipe/4.0.8/photoswipe-ui-default3.min'], function (PhotoSwipe, PhotoSwipeUI) {
            var pswpElement = document.querySelectorAll('.pswp')[0];
            var options = {
                history: false,
                focus: false,
                index: 0,
                showAnimationDuration: 0,
                hideAnimationDuration: 0,
                fullscreenEl: !1,
                shareEl: !1,
                tapToClose: !0
            };
            var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI, imgData, options);
            gallery.init();
        });
    });

    // 点击表内元素
    hammer.on('tap', function (e) {
        // 已经点过就不能在点
        if ($('.cur').length == 0) {
            // 点击的是a标签
            if ($(e.target).is('a')) {
                var $this = $(e.target);
                // 点击绿色可售房源时
                if ($this.hasClass('zs')) {
                    // 判断是否登录,未登陆先跳转到登陆页面，登陆后才能继续选房操作，弹出遮罩
                    if (sfut) {
						if (telephone) {
                            // 清空已有加深
                            $('#conTable a').removeClass('cur');
                            // 选中的a加深
                            $this.addClass('cur');
                            dataTid = $this.attr('data-tid');
                            if (!issuc) {
                                issuc = true;
                                // 显示消息
                                showMessage('正在查找此房源，请稍后');
                                $.post('/xf.d?m=ajaxThInfo&city=' + vars.city + '&newcode=' + vars.newcode + '&tid=' + dataTid, function (data) {
                                    issuc = false;
                                    // 隐藏消息
                                    hideMessage();
                                    // 请求结果写入遮罩层并显示
                                    $('.floatOut1').html('').append(data).removeClass('none');
                                    // 清空加深
                                    $('#conTable a').removeClass('cur');
                                    // 会员优惠展开、收起
                                    var myscroll;
                                    var flag = true;
                                    $('.morelist').on('click', function () {
                                        if (flag) {
                                            flag = false;
                                            var $this = $(this);
                                            if ($this.hasClass('up')) {
                                                $this.removeClass('up');
                                                $('.huiyuanyouhui li').hide();
                                                $('.huiyuanyouhui .on').parents('li').show();
                                            } else {
                                                $this.addClass('up');
                                                $('.huiyuanyouhui li').show();
                                            }
                                            myscroll.refresh();
                                            setTimeout(function () {
                                                flag = true;
                                            },500);
                                        }
                                    });

                                    // 只有一个优惠时候
                                    if ($('.huiyuanyouhui li').length < 2) {
                                        $('.morelist').removeClass('morelist');
                                        $('.huiyuanyouhui .ipt-rd').hide();
                                    }

                                    // 房款折扣点击，默认按揭
                                    var fangkuanType = 0;
                                    $('.radioBox .ipt-rd').on('click', function () {
                                        var $this = $(this);
                                        if (!$this.hasClass('on')) {
                                            $('.radioBox .ipt-rd').removeClass('on');
                                            $this.addClass('on');
                                            fangkuanType = $this.parent().index();
                                            $('.zhekoudl dd').hide();
                                            $('.zhekoudl dd').eq(fangkuanType).show();
                                            brackets();
                                        }
                                    });

                                    // 会员优惠点击
                                    $('.huiyuanyouhui li').on('click', function() {
                                        var $this = $(this).find('.ipt-rd');
                                        if (!$this.hasClass('on')) {
                                            $('.huiyuanyouhui .ipt-rd').removeClass('on');
                                            $this.addClass('on');
                                            if ($('.radioBox .ipt-rd').length) {
                                                // str的就是=前面的，pri的就是=后边的
                                                // an就是按揭，full就是全款
                                                $('.anjiedd .youhui1').html($this.attr('valanstr'));
                                                $('.anjiedd .youhui2').html($this.attr('valanpri'));

                                                $('.quankuandd .youhui1').html($this.attr('valfullstr'));
                                                $('.quankuandd .youhui2').html($this.attr('valfullpri'));
                                            } else {
                                                $('.onlyhuiyuandd .youhui1').html($this.attr('valfullstr'));
                                                $('.onlyhuiyuandd .youhui2').html($this.attr('valfullpri'));
                                                $('.onlyhuiyuandd').show();
                                            }
                                            brackets();
                                        }
                                    });

                                    $('.anjiedd i').eq(0).attr('data-value', $('.anjiedd i').eq(0).html());
                                    $('.quankuandd i').eq(0).attr('data-value', $('.quankuandd i').eq(0).html());

                                    // 判断是否添加括号
                                    var brackets = function () {
                                        var thisdd = $('.zhekoudl dd').eq(fangkuanType);
                                        if (thisdd.find('i').eq(0).html().indexOf('-') != -1 && thisdd.find('.youhui1').html().indexOf('*') == 0) {
                                            thisdd.find('i').eq(0).html('(' + thisdd.find('i').eq(0).attr('data-value') + ')');
                                        } else {
                                            thisdd.find('i').eq(0).html(thisdd.find('i').eq(0).attr('data-value'));
                                        }
                                    };

                                    $('.huiyuanyouhui .ipt-rd').eq(0).click();
                                    $('.huiyuanyouhui li').eq(0).show();

                                    // 弹框添加滑动
                                    myscroll = new IScroll('#alert', {scrollX: false, scrollY: true, bindToWrapper: true});
                                });
                            }
                        } else {
                            // 跳转到绑定手机号页面
                            window.location.href = 'https://m.fang.com/passport/resetmobilephone.aspx?burl='
                                + encodeURIComponent(location.href);
                        }
                    } else {
                        // 跳转到登录页面
                        window.location.href = location.protocol + '//m.fang.com/passport/login.aspx?burl='
                            + encodeURIComponent(location.href);
                    }
                }
            }
        }
    });

    var whichxq = localStorage.whichxq;
    localStorage.whichxq = '';

    // 取消弹出、确认选房
    $('.floatOut1').on('touchend', function (ev) {
        // touchend目标的类名
        var className = ev.target.className;
        switch (className) {
            // 取消
            case 'floatOut1':
                $('.floatOut1').addClass('none');
                break;
            // 确认
            case 'qrxf':
                if (dataTid !== '') {
                    // 显示消息
                    showMessage('正在确认选房，请稍后');
                    // 调下单接口生成一条订单记录
                    $.post('/xf.d?m=xkbSignUp&tailid=' + dataTid + '&username=' + encodeURIComponent(encodeURIComponent(username)) + '&newcode=' + newcode + '&phone=' + telephone + '&hyyouhuiid=' + $('.huiyuanyouhui .on').attr('valyouhuiid')
                        + '&fromUrl=' + encodeURIComponent(encodeURIComponent(window.location.href)) + (whichxq? '&whichxq=' + whichxq : ''), function (data) {
                        if (data) {
                            if (data.root.code == '100') {
                                // 显示消息
                                showMessage('正在跳转到订单页，请稍后');
                                setTimeout(function () {
                                    hideMessage();
                                }, 5000);
								// 确认选房行为收集
                                // 房号
								var roomnews = $('.fanghao').attr('val');
                                // 户型
								var housetype = $('.huxing').attr('valhu');
                                // 面积
                                var area = $('.huxing').attr('valmian');
                                // 朝向
								var direction = $('.chaoxiang').attr('val');
                                // 总价
								var totalprice = $('.zongjia').html();
								qrxftj(roomnews, housetype, area, direction, totalprice);
                                // 跳转到订单页面
                                window.location.href = url + 'house/ec/DirectSelling/PayConfirm?orderno=' + data.root.result;
                            } else {
                                showMessage(data.root.message);
                                setTimeout(function () {
                                    hideMessage();
                                }, 1500);
                            }
                        } else {
                            // 显示消息
                            showMessage('订单提交失败，请重试');
                            setTimeout(function () {
                                hideMessage();
                            }, 1500);
                        }
                    });
                } else {
                    // 显示消息
                    showMessage('订单提交失败，请重试');
                    setTimeout(function () {
                        hideMessage();
                    }, 1500);
                }
                break;
            case 'photoBox fixBox':
                $('.photoBox').hide();
                $('.floatOut1').show();
                break;
        }
        // 防止冒泡
        return false;
    });

    // 阻止页面滑动
    function unable() {
        document.addEventListener('touchmove', preventDefault);
    }

    function preventDefault(e) {
        e.preventDefault();
    }

    // 取消阻止页面滑动
    function enable() {
        document.removeEventListener('touchmove', preventDefault);
    }

    unable();

    // 点击导航
    $('.icon-nav').on('click', function () {
        if ($('.newNav').is(':hidden')) {
            unable();
        } else {
            enable();
        }
    });

    // 统计行为start （2016年5月16日）
    function yhxw() {
        // 所在城市（中文）
        _ub.city = vars.ubcity ;
        // 新房“n”
        _ub.biz = 'n';
        // 方位 ，网通为0，电信为1，如果无法获取方位，记录0
        _ub.location = vars.ublocation ;
        // 浏览收集方法
        _ub.collect (0, {
            // 所属页面
            'vmg.page': 'mnhonlineroom',
            // 楼盘id
            'vmn.projectid': vars.newcode,
            'vmg.sourceapp':vars.is_sfApp_visit + '^xf'
        });
    }
    require.async('jsub/_vb.js?c=mnhonlineroom');
    require.async('jsub/_ubm.js?_2017102307fdsfsdfdsd', function () {
        yhxw();
    });

    // 确认选房统计
    function qrxftj (roomnews, housetype, area, direction, totalprice) {
        // 收集方法
        _ub.collect (135, {
            // 135 所属页面
            'vmg.page': 'mnhonlineroom',
            // 楼盘id
            'vmn.projectid': vars.newcode,
            // 房号信息
            'vmn.roomnews': encodeURIComponent(roomnews),
            // 户型
            'vmn.housetype': encodeURIComponent(housetype),
            // 面积
            'vmn.area': encodeURIComponent(area),
            // 朝向
            'vmn.direction': encodeURIComponent(direction),
            // 总价
            'vmn.totalprice': encodeURIComponent(totalprice)
        });
    }
	// 统计行为end

    $('#shuoming').on('click', function () {
        $('#shuomingcont').show();
    });
    $('#iknow').on('click', function() {
        $('#shuomingcont').hide();
    });
});
