define('modules/xf/myDTList', ['jquery','util/util','modules/xf/showPhoto'], function (require) {
    'use strict';
    var $ = require('jquery');
    var cookiefile = require('util/util');
    var vars = seajs.data.vars;
    var sfut = cookiefile.getCookie('sfut');
    // 小图变大图插件
    var ShowPhoto = require('modules/xf/showPhoto');
    // 登录后获取用户名，手机号和用户ID
    var userId,username,phone;
    function getInfo(data) {
        userId = data.userid || '';
        username = data.username || '';
        phone = data.mobilephone || '';
    }
    // 调用ajax获取登陆用户信息
    if (sfut) {
        vars.getSfutInfo(getInfo);
    }

    var initText = '说点什么吧';

    var $main = $('.main');
    var $flexboxPage = {'0': 1};
    var $tips = $('#tips');
    var $tipsA = $tips.find('a');
    var $setionList = $('.n-dt-list');
    var clickFlag = true;
    // 导航点击
    $tips.on('click','a',function () {
        if (clickFlag) {
            clickFlag = false;
            var tip = $(this).attr('data-num') === '0' ? '' : $(this).attr('data-num');
            var index = $(this).index();
            if (!$flexboxPage[$(this).attr('data-num')]) {
                $flexboxPage[$(this).attr('data-num')] = 1;
                $.post('/xf.d?m=myDTList', {
                    newcode: vars.newcode,
                    city: vars.city,
                    phone: phone,
                    tip: tip
                }, function (data) {
                    $tipsA.removeClass('cur');
                    $tipsA.eq(index).addClass('cur');
                    $setionList.addClass('none');
                    $setionList.eq(index).html(data).removeClass('none');
                    clickFlag = true;
                });
            } else {
                $tipsA.removeClass('cur');
                $tipsA.eq(index).addClass('cur');
                $setionList.addClass('none');
                $setionList.eq(index).removeClass('none');
                clickFlag = true;
            }
        }
    });

    // 头像点击事件
    $('.zygwid').on('click', function () {
        var zygwId = $(this).attr('name-zygw');
        if (zygwId) {
            location.href = '/zygwshopinfo/' + vars.city + '_' + zygwId +  '_' + vars.newcode + '/';
        }
    });

    // 顶踩
    $main.on('click', '.f, .e', function () {
        var $this = $(this);
        var type = $this.hasClass('f') ? 'flower' : 'egg';
        var dongtaiId = $this.parents('li').attr('data-dongtaiid');
        // 如果已经点过
        if ($this.hasClass('cur')) {
            $.post('/xf.d?m=setFlowerorEgg',
                {
                    appuserid: userId,
                    appusername: username,
                    dongtaiid: dongtaiId,
                    type: type,
                    op: 'remove'
                },
                function (data) {
                    if (Number(data.root.result) === 200) {
                        $this.removeClass('cur');
                        var num = $this.html().split('</i>')[1] - 0 - 1;
                        $this.html($this.html().split('</i>')[0] + '</i>' + num);
                    }
                });
            // 没有点过
        } else {
            $.post('/xf.d?m=setFlowerorEgg',
                {
                    appuserid: userId,
                    appusername: username,
                    dongtaiid: dongtaiId,
                    type: type,
                    op: 'add'
                },
                function (data) {
                    if (Number(data.root.result) === 200) {
                        $this.addClass('cur');
                        var num = $this.html().split('</i>')[1] - 0 + 1;
                        $this.html($this.html().split('</i>')[0] + '</i>' + num);
                    }
                });
        }
    });
    // 点评
    $main.on('click', '.t', function () {
        var $this = $(this);
        var commentList = $this.parents('li').find('div.comment-list-c');
        if ($this.hasClass('cur')) {
            $this.removeClass('cur');
            commentList.addClass('none');
        } else {
            $this.addClass('cur');
            commentList.removeClass('none');
            if (commentList.find('li').hasClass('none')) {
                commentList.find('div.n-dt-more').removeClass('none');
            }
        }
    });

    // 发送按钮
    $main.on('click', '.btn-comm', function () {
        var $this = $(this);
        var commentList = $this.parents('li').find('div.comment-list-c');
        var $comn = $this.parent().find('div.ipt-comm');
        var dongtaiId = $comn.attr('data-dongtaiid');
        if ($comn.hasClass('ts')) {
            alert(initText);
        } else {
            var value = $comn.text();
            $.post('/xf.d?m=wrietComment',
                {
                    appuserid: userId,
                    appusername: username,
                    commentid: 0,
                    dongtaiid: dongtaiId,
                    text: encodeURIComponent(encodeURIComponent(value))
                },
                function (data) {
                    if (Number(data.root.result) === 200) {
                        $comn.html(initText).addClass('ts');
                        commentList.find('ul').eq(0).prepend(htmlLi(value));
                    }
                });
        }
    });
    // 说点什么
    $main.on('click', '.ipt-comm', function () {
        var $this = $(this);
        if ($this.hasClass('ts')) {
            $(this).html('').removeClass('ts');
        }
    });

    $main.on('click', '.n-dt-more', function () {
        $(this).parent().find('li').removeClass('none');
        $(this).addClass('none');

    });

    var pswpCounter = $('.pswp__counter');
    var $photoPoint = $('#photoPoint');
    // 图片效果-----------------------------------start
    $main.on('click', 'dd[name="image"]', function () {
        var $images = $(this).parent().find('img');
        var allNum = $images.length;
        var liDom = '';
        for (var i = 0; i < allNum; i++) {
            liDom += '<li></li>';
        }
        // 写入点的个数
        $photoPoint.html(liDom);
        var $photoPointLi = $photoPoint.find('li');
        // 设置当前点为红色
        $photoPointLi.eq($(this).index()).addClass('cur');
        $photoPoint.removeClass('none');
        ShowPhoto.openPhotoSwipe($images,$(this).index());
        ShowPhoto.gallery.listen('afterChange', function () {
            var index = parseInt(pswpCounter.html());
            $photoPointLi.removeClass('cur');
            $photoPointLi.eq(index - 1).addClass('cur');
        });
        $('#photoPoint').show();
    });
    // 小图变大图的关闭按钮
    $('.pswp__button').on('touchend',function () {
        $photoPoint.html('').addClass('none');
        $('#photoPoint').hide();
    });

    function htmlLi(value) {
        var html = '<li data-commentid="0"> <div class="cont"> <a>' + username + '</a>：' + value + '</div></li>';
        return html;
    }
    // 我的订单下的wap动态是否已读提示优化
    if (!localStorage.getItem('orderno' + vars.orderno)) {
        localStorage.setItem('orderno' + vars.orderno, 1);
    }
});