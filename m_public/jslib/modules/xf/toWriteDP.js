define('modules/xf/toWriteDP', ['jquery', 'util/util'], function (require, exports, module) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;
    var Util = require('util/util');
    var sfut = Util.getCookie('sfut');
    var url = vars.mainSite;
    var city = vars.city;
    var newcode = vars.newcode || '';
    var tag = '';
    var title = '';
    var defaultContent = $('#content').html();
    var text = '';
    var content = '';

    // 登录后获取用户ID和其他
    var userId = '';
    var username = '';
    var mobilephone = '';
    var photourl = '';

    function getInfo(data) {
        userId = data.userid || '';
        username = data.username || '';
        mobilephone = data.mobilephone || '';
        photourl = data.photourl || '';
    }

    // 调用ajax获取登陆用户信息
    if (sfut) {
        vars.getSfutInfo(getInfo);
    }

    // 顶部标签
    $('.n-dt-tab a').on('click', function () {
        if ($(this).hasClass('cur')) {
            $(this).removeClass('cur');
            tag = '';
        } else {
            $(this).addClass('cur');
            $(this).siblings().removeClass('cur');
            tag = $(this).attr('data-value');
        }
    });

    // 动态标题
    $('#title').on('blur', function () {
        title = encodeURIComponent(encodeURIComponent($(this).val()));
    });

    // 动态内容获得焦点
    $('#content').on('focus', function () {
        if ($(this).html() == defaultContent) {
            $(this).html('').removeClass('ts');
            $('.txtnum').html('0/150');
        }
    });

    // 动态内容失去焦点
    $('#content').on('blur', function () {
        if ($(this).html() == defaultContent) {
            $(this).html('').addClass('ts');
            $('.txtnum').html('0/150');
        }
    });

    var limitNum = $('.txtnum').html().split('/')[1] || 0;
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

    // 输入字数统计
    $('#content').on('input', function () {
        var me = $(this),
            len = me.text().length;
        text = me.html().replace(/<div>/g, '<br>').replace(/<\/div>/g, '');
        content = encodeURIComponent(encodeURIComponent(text));
        if (len > limitNum) {
            // 4:一个<br>标签的字符个数
            me.html(text.substr(0, 150));
            moveEnd(this);
        }
        // 三元表达式的目的：解决手机中文输入法一次性输入过多导致超出字数限制的情况出现字数不变的情况发生
        $('.txtnum').html((len > limitNum ? limitNum : len) + '/' + limitNum);
    });

    var jwupload;
    // 上传图片
    require.async(["jwingupload/1.0.6/jwingupload"], function (jWingUpload) {
        jwupload = jWingUpload({
            preview: document.getElementById('xfAddpic'),
            maxLength: 9,
            imgPath: vars.public,
            url: '/upload.d?m=uploadNew'
        });
    });

    // 点击提交按钮
    $('#submit').on('click', function () {
        var picUrl = '';
        if (tag != '') {
            if (title != '') {
                if (content != '') {
                    if (jwupload) {
                        $.each(jwupload.imgsArray, function (index, element) {
                            if (element.imgurl) {
                                picUrl += element.imgurl + ',';
                            }
                        });
                    }
                    $.get('/xf.d?m=writeDongTai&userId=' + userId + '&userName=' + username + '&title=' + title + '&content=' + content + '&tips=' + tag + '&newcode=' + newcode + '&phone=' + mobilephone + '&pics=' + picUrl + '&headpic=' + photourl, function (data) {
                        if (data.root.result == 100) {
                            alert('提交成功');
                            setTimeout(function () {
                                window.location = url + 'xf.d?m=myDTList&city=' + city + '&newcode=' + newcode;
                            }, 300);
                        } else {
                            alert(data.root.message);
                        }
                    });
                } else {
                    alert('请输入动态内容');
                }
            } else {
                alert('请输入动态标题');
            }
        } else {
            alert('请选择动态标签');
        }
    });

    // 去除底部标签
    $('footer').hide();
});