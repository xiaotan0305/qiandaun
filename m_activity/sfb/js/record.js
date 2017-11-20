/**
 * Created with webstorm.
 * User: tkp19
 * Date: 2016/3/10 0010
 * Time: 9:02
 */
$(function () {
    'use strict';

    /**
     * 获取隐藏域数据
     */
    var vars = {};
    $('input[type=hidden]').each(function (index, element) {
        vars[element.id] = element.value;
    });

    var doc = $(document),
        win = $(window),
        winH = win.height(),
        timer = null;
    // 正在加载
    var loading = $('#loading');
    // 分页
    var pageIndex = 0;

    win.on('scroll',function () {
        clearTimeout(timer);
        timer = setTimeout(function () {
            var docH = doc.height(),
                docScoll = doc.scrollTop();
            if (docScoll && docH - (winH + docScoll) < 100) {
                loading.show();
                pageIndex++;
                $.ajax({
                    url: '/huodongAC.d?m=getFahongbaoRecords&class=FaHongbaoHc',
                    type: 'POST',
                    data: {
                        city: encodeURIComponent(vars.city),
                        agentId: vars.agentId,
                        month: parseInt($('.month').last().html().split(' ')[1]),
                        pageIndex: pageIndex
                    },
                    success: function (data) {
                        var htmlStr = data.trim();
                        loading.hide();
                        if (htmlStr) {
                            loading.before(htmlStr);
                        }else {
                            pageIndex--;
                            showMsg('没有更多红包纪录了');
                        }
                    },
                    error: function () {
                        pageIndex--;
                        showMsg('网络错误');
                    }
                });
            }
        },100);
    });

    /**
     * 信息弹层
     * @param text 文本内容
     * @param time 显示时间
     * @param callback 回调函数
     */
    // 公共信息弹层
    var msgBox = {
        msg: $('#msg'),
        msgP: $('#msg').find('p'),
        timer: null
    };

    function showMsg(text, time, callback) {
        text = text || '信息有误！';
        time = time || 1500;
        msgBox.msgP.html(text);
        msgBox.msg.fadeIn().css({
            position: 'absolute',
            top: $(document).scrollTop() + winH / 2
        });
        clearTimeout(msgBox.timer);
        msgBox.timer = setTimeout(function () {
            msgBox.msg.fadeOut();
            callback && callback();
        }, time);
    }
});