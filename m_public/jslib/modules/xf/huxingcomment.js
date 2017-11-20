define('modules/xf/huxingcomment', ['jquery', 'util/util', 'superShare/1.0.1/superShare', 'weixin/1.0.1/weixinshare'], function (require) {
    'use strict';
    var $ = require('jquery');
    var cookiefile = require('util/util');
    var vars = seajs.data.vars;
    var sfut = cookiefile.getCookie('sfut');
    var content = '';

    // 微信分享功能
    var wx = require('weixin/1.0.1/weixinshare');
    var reg = /搜房网/g;
    var weixin = new wx({
        shareTitle: ($('.bgproname').html() + '怎么样').replace(reg, '房天下'),
        descContent: ('综合评分：' +  $('.bgscore').html() + '分\n' + '共' + $('.bgcount').html() + '条评论').replace(reg, '房天下'),
        imgUrl: $('.bgpic').html()? $('.bgpic').html().trim() : '',
        lineLink: window.location.href
    });

    // 分享功能新
    var SuperShare = require('superShare/1.0.1/superShare');
    var config = {
        // 分享内容的title
        title: $('.bgproname').html() + '怎么样',
        // 分享时的图标
        image: $('.bgpic').html()? $('.bgpic').html().trim() : '',
        // 分享内容的详细描述
        desc: '综合评分：' +  $('.bgscore').html() + '分\n' + '共' + $('.bgcount').html() + '条评论',
        // 分享的链接地址
        url: location.href,
        // 分享的内容来源
        from: 'xf'
    };
    var superShare = new SuperShare(config);

    // 评分处理
    $('.star-other i').each(function (index) {
        $(this).on('mouseover', function () {
            fnPoint($(this), index + 1);
        });
    });

    function fnPoint($this, iArg) {
        $('.star-other i').removeClass('active');
        for (var i = 0; i < iArg; i++) {
            $('.star-other').children('i').eq(i).addClass('active');
        }
        $('.fen').html(iArg + '分');
    }

    // 描述
    // 初始化时的句子（亲，这个楼盘怎么样？快来说两句！）
    var con = $('#miaoshu').text();
    $('#miaoshu').click(function () {
        // $('body').animate({scrollTop: 242});
        var connow = $(this).text();
        if (connow === con) {
            $(this).empty().css('color', '#0c0d0e');
        }
    });

    // 光标移到最后函数,obj 编辑框原生对象
    function moveEnd(obj) {
        obj.focus();
        var sel = null,
            len = obj.innerText.length;
        if (document.createRange) {
            // 高级浏览器
            sel = window.getSelection();
            var range = document.createRange();
            range.selectNodeContents(obj);
            range.collapse(false);
            sel.removeAllRanges();
            sel.addRange(range);
        } else {
            // IE低版本
            sel = document.selection.createRange();
            sel.moveStart('character', len);
            sel.collapse();
            sel.select();
        }
    }

    // 字数统计
    $('#miaoshu').on('input', function () {
        content = $(this).text();
        var length = $(this).text().length;
        if (length <= 150) {
            $('.txtnum').html(length + '/150');
        } else {
            $(this).text(content.substr(0, 150));
            moveEnd(this);
        }
    });

    var jwupload;
    var huxingtu = true;
    // 上传图片
    require.async(["jwingupload/1.0.6/jwingupload"], function (jWingUpload) {
        jwupload = jWingUpload({
            preview: document.getElementsByClassName('comment-addpic'),
            maxLength: 9,
            imgPath: '//static.soufunimg.com/common_m/m_bbs/',
            url: '/upload.d?m=uploadNew'
        });
        $('.comment-addpic dl').prepend('<dd id="file_-1"><img src="' + vars.imageurl + '" class="imgClass"><a href="javascript:;" class="del"></a></dd>');
        $('#file_-1 a').on('click', function () {
            if (confirm('确定要删除此图片吗？')) {
                $('#file_-1').remove();
                huxingtu = false;
            }
        });
    });

    // 匿名点评按钮事件
    $('.tab-change').on('click', function () {
        var $this = $(this);
        if ($this.hasClass('on')) {
            $this.removeClass('on');
        } else {
            $this.addClass('on');
        }
    });

    function judgeSubmit() {
        if ($('.fen').html() === '0分') {
            alert('请评分');
            return false;
        }
        var wordsNumber = $('.txtnum').html().split('/')[0];
        if (wordsNumber < 10) {
            alert('最少要10个字哦，再说两句吧');
            return false;
        }
        return true;
    }

    $('#submit').on('click', function () {
        if (sfut) {
            // 检查
            if (judgeSubmit()) {
                var contenta = $('#miaoshu').html().trim();
                var ischecked = $('.tab-change').hasClass('on') ? '1' : '';
                var picUrl = '';
                if (huxingtu) {
                    picUrl = vars.imageurl + ',';
                }
                if (jwupload) {
                    $.each(jwupload.imgsArray, function (index, element) {
                        if (element.imgurl) {
                            picUrl += element.imgurl + ',';
                        }
                    });
                }
                $.get('/user.d?m=getUserinfoBySfut', function (data) {
                    if (data) {
                        var returnResult = data.root.return_result;
                        if (returnResult === '100') {
                            var username = data.root.username;
                            var userid = data.root.userid;
                            $.get('/xf.d?m=giveComment', {
                                content: encodeURIComponent(encodeURIComponent(contenta)),
                                type: 'wap',
                                userid: userid,
                                username: encodeURIComponent(encodeURIComponent(username)),
                                pic_url: picUrl.substring(0, picUrl.length - 1),
                                city: vars.paramcity,
                                id: vars.paramId,
                                huxingid: vars.paramhxid,
                                anonymous: ischecked,
                                from: 'huxing',
                                zongfen: parseInt($('.fen').html())
                            },
                                function (data) {
                                if (data) {
                                    var message = data.root.status;
                                    alert(message.split(',')[1]);
                                    if (message.split(',')[0] === '100') {
                                        if (vars.paramshareFrom === 'pingshen') {
                                            window.location.href = '/huodong.d?m=activityDemand&class=XiaoQuTuCaoHc&flag='
                                                + vars.paramflag + '&city=' + vars.paramcity + '&shareFrom=pingshen&imei=' + vars.paramimei;
                                        } else {
                                            window.location.href = '/xf.d?m=dianpingSuc&city=' + vars.paramcity + '&newcode=' + vars.paramId;
                                        }
                                    }
                                }
                            });
                        }
                        $('#xfAddpic a').removeClass('del');
                    }
                });
            }
        } else {
            var locationHref = '/xf/' + vars.paramcity + '/huXingComment/' + vars.paramId + '_' + vars.paramhxid + '.html';
            window.location.href = 'https://m.fang.com/passport/login.aspx?burl=' + encodeURIComponent(locationHref);
        }
    });

    $('.footer').css('display', 'none');
});