/**
 * Created by user on 2017/3/1.
 */
$(function () {
    'use strict';
    var localStorage;
    // 尝试判断是否为无痕模式，如果是无痕模式则放弃所有localstorage操作将vars.localStorage置于空
    if (!localStorage) {
        localStorage = window.localStorage;
        try {
            localStorage.setItem('testPrivateModel', false);
        } catch (d) {
            localStorage = null;
        }
    }
    // 图片资源地址
    var srcSite = $('#srcSite').val() || '';

    var oImg = new Image();
    oImg.src = 'http:' + srcSite + '/paintHouse/images/loading.png';

    // 绘制的svg资源预加载
    for (var i = 0; i < 6; i++) {
        var idx = i + '';
        if (!localStorage.getItem(idx)) {
            (function (num) {
                loadSvg(num);
            })(idx);
        }
    }

    /**
     * 获取svg文件
     * @param index
     * @param showLoad 显示加载框
     * @param callback
     */
    function loadSvg(index, showLoad, callback) {
        $.ajax({
            url: srcSite + '/paintHouse/images/' + getSvgName(index),
            type: 'get',
            success: function (data) {
                var svgData = data.documentElement.outerHTML;
                if (showLoad) {
                    $('#loadingBox').show();
                }
                localStorage.setItem(index, svgData);
                callback && callback(svgData);
            },
            error: function (err) {
                console.log(err);
            }
        });
    }

    /**
     * 获取svg文件名字
     * @param index
     * @returns {string}
     */
    function getSvgName(index) {
        var smSrc = '';
        switch (index) {
            case '0':
                smSrc = 'zsty.svg';
                break;
            case '3':
                smSrc = 'osbs.svg';
                break;
            case '4':
                smSrc = 'jyxgc.svg';
                break;
            case '1':
                smSrc = 'msty.svg';
                break;
            case '5':
                smSrc = 'hyyf.svg';
                break;
            case '2':
                smSrc = 'ghbs.svg';
                break;
        }
        return smSrc;
    }

    // 图片放大标识符
    var scaleFlag = false;
    // 已经涂色的资源
    var paintArr = [];
    // 默认颜色值
    var color = '#d61518';
    // 已经选中的颜色
    var pickedColor = '';
    // 检测是否是ios
    var agent = navigator.userAgent.toLowerCase();
    // 缓存上一次tap的时间
    var iLastTouch = null;
    // 兼容ios双击屏幕向上滚动的问题
    if(agent.indexOf('iphone') >= 0 || agent.indexOf('ipad') >= 0) {
        document.body.addEventListener('touchend', function ()
        {
            var iNow = new Date().getTime();
            // 第一次时将iLastTouch设为当前时间+1
            iLastTouch = iLastTouch || iNow + 1;
            var delta = iNow - iLastTouch;
            if (delta < 500 && delta > 0) {
                event.preventDefault();
                return false;
            }
            iLastTouch = iNow;
        }, false);
    }

    function doubleScale($svg) {
        if (scaleFlag) {
            // 还原
            $svg.css({
                transform: 'scale(1, 1)',
                left: '0px',
                top: '0px',
                transition: '.2s transform ease-in-out'
            });
            scaleFlag = false;
        } else {
            // 放大
            $svg.css({
                transform: 'scale(2, 2)',
                transition: '.2s transform ease-in-out'
            });
            scaleFlag = true;
        }
    }


    /**
     * 渲染画板
     * @param curveControl
     * @param svgData
     */
    function renderData(curveControl, svgData) {
        curveControl.append(svgData);
        var $svg = curveControl.find('svg');
        $svg.css({
            width: '100%',
            height: '100%',
            position: 'relative'
        });
        var svg = $svg[0];
        var hammertime = new Hammer(svg);
        var svgW = $svg.width();
        var svgH = $svg.height();
        var minLeft = -svgW / 2,
            maxLeft = svgW / 2,
            minTop = -svgH / 2,
            maxTop = svgH / 2;
        var pinch = new Hammer.Pinch();
        var rotate = new Hammer.Rotate();
        pinch.recognizeWith(rotate);
        // add to the Manager
        hammertime.add([pinch, rotate]);
        hammertime.on('pinchstart', function() {
            doubleScale($svg);
        });

        /**
         * 判断是否为边界
         * @param left
         * @param top
         * @returns {{}}
         */
        function judgeBorder(left, top) {
            var option = {};
            option.left = left > maxLeft ? maxLeft : (left < minLeft ? minLeft : left);
            option.top = Math.max(Math.min(top, maxTop), minTop);
            return option;
        }

        // 图片的初始位置
        var LDLeft = 0, LDTop = 0;
        hammertime.on('panstart', function () {
            var left = $svg.css('left');
            var top = $svg.css('top');
            if(left.indexOf('px') !== -1 && top.indexOf('px') !== -1) {
                LDLeft = Number(left.replace('px', ''));
                LDTop = Number(top.replace('px', ''));
            }
        });
        // 设置支持所有方向的移动
        hammertime.get('pan').set({direction: Hammer.DIRECTION_ALL});
        hammertime.on('panleft panright panup pandown', function (e) {
            // 图片放大以后支持移动
            if (scaleFlag && !e.isFinal) {
                var leftTop = judgeBorder(LDLeft + e.deltaX, LDTop + e.deltaY);
                $svg.css({left: leftTop.left, top: leftTop.top});
            }
        });
        var paths = svg.getElementsByTagName('path');
        var recs = svg.getElementsByTagName('rect');
        var polygons = svg.getElementsByTagName('polygon');
        var circles = svg.getElementsByTagName('circle');
        // 给所有的路径添加点击事件
        for (var i = 0; i < paths.length; i++) {
            var path = paths[i];
            if ($(path).attr('fill') === '#FFFFFF') {
                path.onclick = function () {
                    // 存储已经涂色的路径
                    paintArr.push(this);
                    this.style.fill = color;
                };
            }
        }
        for (var j = 0; j < recs.length; j++) {
            var rec = recs[j];
            if ($(rec).attr('fill') === '#FFFFFF' && $(rec).attr('id') !== 'border') {
                rec.onclick = function () {
                    paintArr.push(this);
                    this.style.fill = color;
                };
            }
        }
        for (var k = 0; k < polygons.length; k++) {
            var polygon = polygons[k];
            if ($(polygon).attr('fill') === '#FFFFFF') {
                polygon.onclick = function () {
                    paintArr.push(this);
                    this.style.fill = color;
                };
            }
        }
        for (var m = 0; m < circles.length; m++) {
            var circle = circles[m];
            if ($(circle).attr('fill') === '#FFFFFF') {
                circle.onclick = function () {
                    paintArr.push(this);
                    this.style.fill = color;
                };
            }
        }
    }


    /**
     * 获取url参数值
     * @param name url name
     * @returns {*}
     */
    function getParams(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        if (r !== null) return r[2];
        return null;
    }

    // svg的索引
    var index = getParams('type');
    if (index) {
        // 画图页面
        // svg元素
        var curveControl = $('.picbox');
        // 获取对应的svg资源
        var svgData = localStorage.getItem(index);
        if (!svgData) {
            // svg资源没有的话 重新加载
            loadSvg(index, true, function (svgData) {
                $('#loadingBox').hide();
                renderData(curveControl, svgData);
            });
        } else {
            renderData(curveControl, svgData);
        }
        // 色板
        var seban = $('.seban');
        // 工具栏
        var tools = $('#tools');
        // 色块
        var lis = seban.find('li');
        // 选择颜色
        lis.on('click', function () {
            var $this = $(this);
            if ($this.hasClass('pre') || $this.hasClass('next')) {
                return;
            }
            lis.removeClass('cur');
            // 添加选中状态
            $this.addClass('cur');
            color = $this.attr('style').replace('background:', '').replace(';', '');
            $('#pickedColor').css('background-color', color);
            tools.show();
            seban.hide();
        });
        var mySwiper = new Swiper('.swiper-container', {
            direction: 'horizontal',
            loop: false
        });
        // 切换色板
        $('.next ').on('click', function () {
            mySwiper.slideNext();
        });
        $('.pre ').on('click', function () {
            mySwiper.slidePrev();
        });
        // 调取色板
        $('.pen').on('click', function () {
            $(this).addClass('cur').siblings().removeClass('cur');
            color = pickedColor;
            tools.hide();
            seban.show();
        });
        // 点击橡皮
        $('.eraser').on('click', function () {
            $(this).addClass('cur').siblings().removeClass('cur');
            pickedColor = color;
            color = '#FFFFFF';
        });
        // 用户名字
        var nickName = $('#nickName').val();
        // 清空涂色
        $('.clear-pic').on('click', function () {
            for (var i = 0; i < paintArr.length; i++) {
                paintArr[i].style.fill = '#FFFFFF';
            }
        });
        // 生成图片
        $('#creat').on('click', function () {
            $('.loading').show();
            var cvs = document.querySelector('canvas');
            var ctx = cvs.getContext('2d');
            var $svg = curveControl.find('svg');
            // 如果图片放大 还原
            if (scaleFlag) {
                $svg.css({
                    transform: 'scale(1, 1)',
                    left: '0px',
                    top: '0px'
                });
                scaleFlag = false;
            }
            // svg的dom结构
            var svgCon = curveControl.find('svg')[0].outerHTML;
            // 转化为base64码
            var svgBase64 = 'data:image/svg+xml;base64,' + window.btoa(svgCon);
            var img = new Image();
            img.src = svgBase64;
            img.onload = function () {
                ctx.drawImage(img, 0, 0, 400, 400);
                var image = cvs.toDataURL('image/png');
                localStorage.setItem('image', image);
                // 将图片上传服务器
                $.ajax({
                    url: $('#imgSite').val() + '?c=imgUpload&a=ajaxUploadImg',
                    data: {'projectName': 'paintHouse', 'base64': image},
                    type: 'post',
                    success: function (data) {
                        location.href = $('#site').val() + '?m=result&class=PaintHouseHc&resultType=' + index
                            + '&imgUrl=' + '//static.soufunimg.com/h5' + data.imgUrl + '&nickName=' + nickName;
                    }
                });
            };
        });
    } else {
        // 结果页面
        var resultType = getParams('resultType');
        // 结果页的文本
        var resultTxt = '';
        switch (resultType) {
            case '0':
                resultTxt = '施主，我看你慧眼独具，想必是来自东土大唐吧？点击算他一算，瞧瞧你何时才能入住这层层院落？';
                break;
            case '1':
                resultTxt = '苍茫的天涯是你的爱，绵延的青山花正开。点击算他一算，让我替你算算何时才能买到手？';
                break;
            case '2':
                resultTxt = '面朝大海，春暖花开。人没有梦想，和咸鱼有什么分别？点击算他一算，看看何时咸鱼能翻身？';
                break;
            case '3':
                resultTxt = '谁还不是个小公举咋滴？想知道何时才能圆自己心中公主梦，点击算他一算揭晓答案~';
                break;
            case '4':
                resultTxt = '家不在大，只要有家人的陪伴，哪里都是心灵的港湾。想知道你离心中的梦想“家”有多远吗？点击算他一算揭晓答案~';
                break;
            case '5':
                resultTxt = '虽然长得丑，可是想得美啊！点击算他一算，看看何时美梦成真！';
                break;
        }
        $('.intro').text(resultTxt);
        // 获取用户名
        var nameArr = getParams('nickName').split('_');
        var name = '';
        for (var k = 0; k < nameArr.length; k++) {
            if (nameArr[k]) {
                name += String.fromCharCode(nameArr[k]);
            }
        }
        $('#name').text('【' + name + '】');
        // 结果得分
        $('#score').text(Math.floor(85 + Math.random() * (95 - 85)));
        // 微信分享
        new Weixin({
            // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            debug: false,
            shareTitle: '千言万语，都在我的神作里了，打开看看吧',
            descContent: '不忍直视，' + name + '被扒出的小秘密竟然是TA',
            lineLink: location.href,
            imgUrl: 'http:' + $('#srcSite').val() + '/paintHouse/images/share.jpg',
            swapTitle: true
        });
    }
});