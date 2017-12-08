/*
 * @Author: lina.bj@fang.com
 * @Date: 2017-11-23 14:01:47
 * @Last Modified by: tankunpeng@fang.com
 * @Last Modified by: yueyanlei@fang.com
 * @Last Modified time: 2017-11-23 19:23:23
 * @Description: 发送邮件js
 */
$(function () {
    // 提交的信息
    var $addAddress = $('#addAddress'),
        // 联想列表
        $linkCon = $('#linkCon'),
        $addressBox = $('#addressBox'),
        reg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,5}$/,
        $error = $('#errorAddress'),
        $errSend = $('#errSend'),
        $errorName = $('#errName'),
        $sendAddress = $('#sendAddress'),
        $sendName = $('#sendName'),
        $sendBtn = $('#sendBtn'),
        $msgCon = $('#msgCon'),
        $linkUrl = $('#linkUrl'),
        $title = $('#title'),
        $preMsg = $('#preMsg');
    var comArr = ['@163.com', '@126.com', '@sina.com', '@qq.com', '@yahoo.com', '@hotmail.com', '@live.com', '@msn.com', '@fang.com'],
        comLen = comArr.length;
    var $document = $(document);

    /**
     * 弹层显示函数
     * @param msg
     */
    function showMsg(msg) {
        $msgCon.text(msg);
        $msgCon.fadeIn();
        setTimeout(function () {
            $msgCon.fadeOut();
        }, 3000);
    }

    /**
     * 获取cookie
     * @param name
     * @returns
     */
    function getCookie(name) {
        var reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
        var arr = document.cookie.match(reg);
        if (arr) {
            var str;
            try {
                str = decodeURIComponent(arr[2]);
            } catch (e) {
                str = unescape(arr[2]);
            }
            return str;
        }
        return '';
    }

    // 删除
    $addressBox.on('click', '.delete', function () {
        $(this).parent('div').remove();
        if (!$('.error-info').length) {
            $error.hide();
        }
    });
    // 输入
    $addAddress.on('input', function (ev) {
        ev.stopPropagation();
        var linkHtml = '';
        var value = $(this).val();
        if (!value) {
            $linkCon.hide();
            return false;
        }
        // 是否输入全地址
        var isQuan = value.match('@');
        for (var i = 0; i < comLen; i++) {
            var newValue = value + comArr[i];
            if (isQuan) {
                newValue = value.split('@')[0] + comArr[i];
                var reg = new RegExp('^' + value);
                if (!reg.test(newValue)) {
                    newValue = '';
                }
            }
            if (newValue) {
                linkHtml += '<li ' + (i === 0 ? 'class="active"' : '') + '><a href="javascript:void(0)">' + newValue + '</a></li>';
            }
        }
        // 插入文本
        if (linkHtml) {
            $linkCon.html(linkHtml).show();
        } else {
            $linkCon.hide();
        }
    }).on('click', function (ev) {
        ev.stopPropagation();
    });

    // 页面点击判断输入结果
    $document.on('click', function () {
        if ($linkCon.is(':hidden')) return;
        var thisValue = $addAddress.val();
        $linkCon.hide();
        if (thisValue) {
            var errClass = reg.test(thisValue) ? '' : 'error-info';
            var html = $('<div class="user-receiver-info ' + errClass + '">' +
                '<span class="user-receiver-info-name address">' + thisValue + '</span>' +
                '<a class="user-receiver-info-close delete" href="javascript:void(0)"></a>' +
                '</div>');
            if (errClass) {
                $error.show();
            }
            $addAddress.before(html).val('');
        }
    }).on('keydown', function (ev) {
        // 上下键选择
        if ($linkCon.is(':hidden')) return;
        var index;
        var newIndex;
        var links = $linkCon.find('li'),
            linkLen = links.length;
        switch (ev.keyCode) {
            case 38:
                ev.preventDefault();
                index = $linkCon.find('.active').index();
                if (linkLen) {
                    if (index > 0) {
                        newIndex = index - 1;
                    } else {
                        newIndex = linkLen - 1;
                    }
                    links.eq(newIndex)
                        .addClass('active')
                        .siblings()
                        .removeClass('active');
                }
                break;
            case 40:
                ev.preventDefault();
                index = $linkCon.find('.active').index();
                if (linkLen) {
                    if (index < linkLen - 1) {
                        newIndex = index + 1;
                    } else {
                        newIndex = 0;
                    }
                    links.eq(newIndex)
                        .addClass('active')
                        .siblings()
                        .removeClass('active');
                }
                break;
            case 13:
                ev.preventDefault();
                index = $linkCon.find('.active').index();
                clickLink(links.eq(index));
                $addAddress.focus();
                break;
        }
    });

    /**
     * 选择联想列表
     * @param obj
     */
    function clickLink(obj) {
        var text = obj.find('a').text();
        var errClass = reg.test(text) ? '' : 'error-info';
        var html = $('<div class="user-receiver-info ' + errClass + '">' +
            '<span class="user-receiver-info-name address">' + text + '</span>' +
            '<a class="user-receiver-info-close delete" href="javascript:void(0)"></a>' +
            '</div>');
        $linkCon.hide();
        $addAddress.before(html);
        if (errClass) {
            $error.show();
        }
        $addAddress.val('');
        $addAddress.blur();
    }
    // 点击联想列表
    $linkCon.on('click', 'li', function () {
        clickLink($(this));
    });

    // 发件人邮箱
    $sendAddress.on('blur', function () {
        var $ele = $(this);
        var value = $ele.val();
        if (value && !reg.test(value)) {
            $errSend.show();
        }
    }).on('focus', function () {
        $errSend.hide();
    });
    // 发件人姓名
    $sendName.on('blur', function () {
        var $ele = $(this);
        var value = $ele.val();
        if (!value) {
            $errorName.show();
        // } else {
        //     var text = $preMsg.attr('placeholder');
        //     text = text.replace('XX', value);

        }

    }).on('focus', function () {
        $errorName.hide();
    });
    $('#dressCon').on('click', function(){
        $addAddress.focus();
    });
    $(window).on('load', function(){
        $addAddress.focus();
    })
    // 发送邮箱
    var ajaxFlag = true;
    $sendBtn.on('click', function () {
        var $address = $('.address');
        var addArr = [];
        if (!ajaxFlag) {
            return false;
        }
        if (!$address.length) {
            showMsg('请填写收件人邮箱!');
            $addAddress.focus();

            return false;
        } else if ($('.error-info').length) {
            showMsg('收件人邮箱有误!');
            return false;
        } else if (!$sendAddress.val() && $errSend.is(':visible')) {
            showMsg('发件人邮箱格式不正确!');
            $sendAddress.focus();
            return false;
        } else if (!$sendName.val()) {
            showMsg('请填写发件人姓名!');
            $sendName.focus();
            return false;
        }
        $address.each(function () {
            addArr.push($(this).text());
        });

        var params = {
            // 收件地址
            to: addArr.join(','),
            // 发件人名字
            sendName: $sendName.val(),
            // 发件地址
            sendAddress: $sendAddress.val(),
            // 邮件内容
            text: $preMsg.val(),
            // 链接地址
            link: $linkUrl.text(),
            // 楼盘名字
            loupan: $title.text(),
            // csrfToken
            FANG_CSRF: getCookie('csrfToken')
        };
        if (ajaxFlag) {
            ajaxFlag = false;
        }
        $.ajax({
            url: '/mailshare/sendmail',
            type: 'POST',
            data: params,
            success: function (data) {
                if (typeof data === 'object') {
                    if (data.code === '100') {
                        showMsg('邮件已发送!');
                    } else {
                        showMsg(data.msg);
                    }
                } else {
                    showMsg('邮件发送失败!');
                }
            },
            error: function () {
                showMsg('邮件发送失败!');
            },
            complete: function () {
                ajaxFlag = true;
            }
        });
    });
});