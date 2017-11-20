$(function () {

    // 研究院building 还是搜房帮loveShare
    var from = activityForm;
    var bodyStyle = document.body.style;
    bodyStyle.mozUserSelect = 'none';
    bodyStyle.webkitUserSelect = 'none';
    var canvas = document.querySelector('#canvas');
    var w = canvas.width = canvas.clientWidth;
    var h = canvas.height = canvas.clientHeight;
    canvas.style.backgroundColor = 'transparent';
    canvas.style.position = 'absolute';
    var mousedown = false;
    var ctx = canvas.getContext('2d');
    var islock = false;
    var isscroll = true;
    var shareFlag = false;
    // 奖品显示区
    var prizeBox = $('#prizeBox');
    // 搜房帮替换刮奖图片
    if (from === 'loveShare') {
        prizeBox.removeClass('gglk');
        prizeBox.addClass('gglk2');
    }
    // 根据中奖的类型放置不同的图片
    if (isGetPrize) {
        if (prizeType === 'money') {
            $('.js_prizeImg').attr('src', location.protocol + '//js.soufunimg.com/wireless_m/touch/activity/newGuaShiWu/images/icon2-4.png');
        }
        if (prizeType === 'point') {
            $('.js_prizeImg').attr('src', location.protocol + '//js.soufunimg.com/wireless_m/touch/activity/newGuaShiWu/images/icon2-3.png');
        }
        if (prizeType === 'other') {
            $('.js_prizeImg').attr('src', location.protocol + '//js.soufunimg.com/wireless_m/touch/activity/newGuaShiWu/images/icon2-2.png');
        }

    } else {
        $('.js_prizeImg').attr('src', location.protocol + '//js.soufunimg.com/wireless_m/touch/activity/newGuaShiWu/images/icon2-2.png');
        $('.js_prizeName').html('谢谢惠顾');
    }

    /**
     * 开始刮奖时监听鼠标事件
     * @param e
     * @returns {boolean}
     */
    function eventDown(e) {
        if (islock) {
            return false;
        }
        e.preventDefault();
        mousedown = true;
        return true;
    }

    /**
     * 获取刮奖区域的百分比
     * @param ctx
     * @returns {string}
     */
    function getTransparentPercent(ctx) {
        var imgData = ctx.getImageData(0, 0, w, h),
            pixles = imgData.data,
            transPixs = [];
        for (var i = 0, j = pixles.length; i < j; i += 4) {
            var a = pixles[i + 3];
            if (a < 128) {
                transPixs.push(i);
            }
        }
        return (transPixs.length / (pixles.length / 4) * 100).toFixed(2);
    }

    // 弹窗盒子
    var cpResultbox = $('.cpResultbox');
    // 规则、获奖弹窗
    // var ruledom = $('#ruledom');
    // var prizeTitle = $('#prizeTitle');
    // var prizeContent = $('#prizeContent');
    // 刮奖次数
    var count = 0;
    var mainSite = $('#mainSite').val();
    // 刮奖时从后台请求回来的结果
    var response;

    /**
     * 鼠标起来时的事件
     * @param e
     * @returns {boolean}
     */
    function eventUp(e) {
        count++;
        if (islock) {
            return false;
        }
        var parmage = {};
        parmage.lorreryId = lotteryId;
        if (from === 'loveShare') {
            parmage.class = 'GuaShiWuSpecialHc';
            parmage.m = 'judgePrize';
            parmage.def4 = def4;
            parmage.uvDate = uvDate;
            parmage.preWinId = preWinId;
        } else if (from === 'building') {
            parmage.class = 'GuaShiWuSpecialHc';
            parmage.m = 'putDatabase';
            parmage.p = p;
            parmage.preWinId = preWinId;
        }
        var url = 'http:' + mainSite + '/huodongAC.d';
        var isGetPrizeTwo = 'false';
        var message = '';
        // 刮奖弹框内容
        var heidom = $('#heidom');
        // 刮第一下时请求后台
        count === 1 && $.ajax({
            url: url,
            type: 'GET',
            data: parmage,
            dataType: 'json',
            success: function (data) {
                response = data;
            }
        });
        if(response) {
            var errorDataBase = response.root.errorDataBase;
            isGetPrizeTwo = response.root.isGetPrize;
            message = response.root.message;
            isscroll = true;
            bodymove();
            e.preventDefault();
            mousedown = false;
            if (getTransparentPercent(ctx) > 25) {
                closeReload = true;
                ctx.clearRect(0, 0, w, h);
                // 显示获奖提示
                $('#prizeTip').show();
                if (from === 'loveShare') {
                    cpResultbox.addClass('heidom').show();
                    $('.mask').css('height', '100%');
                    if (isGetPrizeTwo === true) {
                        if (errorDataBase === true) {
                            heidom.find('p').html('刮奖出现问题，请联系活动房');
                        } else {
                            heidom.find('p').html('恭喜你中奖了');
                        }
                    } else if (isGetPrizeTwo === false) {
                        if (message) {
                            heidom.find('p').html(message);
                        } else {
                            heidom.find('p').html('再接再厉');
                        }
                    }
                    changePage();
                } else if (from === 'building') {
                    if (isGetPrizeTwo === true) {
                        if (errorDataBase === true) {
                            heidom.find('p').html('刮奖出现问题，请联系活动房');
                        }
                    } else if (isGetPrizeTwo === false) {
                        if (message) {
                            heidom.find('p').html(message);
                        }
                    }
                }
                islock = true;
            }
        }
        return true;
    }

    /**
     * 获取鼠标坐标点
     * @param canvas
     * @param evt
     * @returns {{x: number, y: number}}
     */
    function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }

    /**
     * 画圆点事件
     * @param e
     */
    function drawPoint(e) {
        if (mousedown) {
            if (e.changedTouches) {
                e = e.changedTouches[e.changedTouches.length - 1];
            }
            var pos = getMousePos(canvas, e);
        }
        var x = pos.x,
            y = pos.y;
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2);
        ctx.fill();
        // 强制触发canvas重绘
        canvas.style.zIndex = canvas.style.zIndex === 2 ? 3 : 2;
    }

    /**
     * 鼠标移动事件
     * @param e
     * @returns {boolean}
     */
    function eventMove(e) {
        if (islock) {
            return false;
        }
        e.preventDefault();
        // 画圆点
        drawPoint(e);
        return true;
    }

    var imgSrc = 'http:' + mainSite + $('#src').val();
    var image = new Image();
    image.src = imgSrc;
    image.onload = function () {
        ctx.drawImage(this, 0, 0, w, h);
        // 实现画圆点透明的属性
        ctx.globalCompositeOperation = 'destination-out';
        canvas.addEventListener('touchstart', eventDown);
        canvas.addEventListener('touchend', eventUp);
        canvas.addEventListener('touchmove', eventMove);
        canvas.addEventListener('mouseover', eventDown);
        canvas.addEventListener('mouseup', eventUp);
        canvas.addEventListener('mousemove', eventMove);
    }

    var thispage = '';

    function changePage() {
        if (cpResultbox.hasClass('logindom')) {
            thispage = 'logindom';
        } else if (cpResultbox.hasClass('ruledom')) {
            thispage = 'ruledom';
        } else if (cpResultbox.hasClass('heidom')) {
            thispage = 'heidom';
        }
        isscroll = false;
        bodymove();
    }

    function pageRemove() {
        if (thispage === 'ruledom') {
            if (shareFlag) {
                cpResultbox.removeClass('ruledom').hide().addClass('popstartlove').show();
                shareFlag = false;
                islock = true;
                thispage = 'popstartlove';
            } else {
                cpResultbox.removeClass('ruledom').hide();
            }
        } else if (thispage === 'heidom') {
            $('.mask').css('height', '22rem');
            cpResultbox.removeClass('heidom').hide();
        }
        // stopDumiao = false;
        isscroll = true;
        bodymove();
    }

    function bodymove() {
        if (!isscroll) {
            $('body').on('touchmove', function (event) {
                event.preventDefault();
            });
        } else {
            $('body').off('touchmove');
        }
    }

    $('#poprule').on('click', function () {
        if (cpResultbox.hasClass('popstartlove')) {
            cpResultbox.removeClass('popstartlove').hide().addClass('ruledom').show();
            shareFlag = true;
            islock = true;
        } else {
            cpResultbox.addClass('ruledom').show();
        }
        changePage();
    });

    $('.mask').on('click', function () {
        // heidom弹框不能通过点击浮层关闭
        if($('#heidom').is(':visible')) {
            return;
        }
        pageRemove();
    });
    // 弹框关闭事件
    $('.close').on('click', function () {
        if (thispage === 'logindom') {
            cpResultbox.removeClass('logindom').hide();
        } else {
            pageRemove();
        }
        if (closeReload) {
            window.location.reload();
        }
    });

    // 我的奖品点击事件
    $('#myprize').on('click', function () {
        thispage = 'logindom';
    });

    $('canvas').on('click', function () {
        isscroll = false;
        bodymove();
    });
});