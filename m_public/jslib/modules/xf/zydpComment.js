/**
 * 经纪人评价
 * 20160224  by WeiRF
 */
define('modules/xf/zydpComment', ['jquery','util/util'], function (require) {
    'use strict';
    var $ = require('jquery');
    var util = require('util/util');
    var vars = seajs.data.vars;
    // 登录的cooike
    var sfut = util.getCookie('sfut');
    // 登录后获取用户名，手机号和用户ID
    var userid,
        username,
        zygwid = vars.zygwid,
        userid = vars.userid,
        content,
        score,
        tags = '';
    function getInfo(data) {
        userid = data.userid || '';
        username = data.username || '';
    }
    // 调用ajax获取登陆用户信息
    if (sfut) {
        vars.getSfutInfo(getInfo);
    }

    var txtnum = $('.txtnum');
    // 获取页面初始化时的字
    var textInit = $('.neirong').html();
    var numInit = txtnum.html();
    // 获取页面字数限制
    var limitNum = parseInt(txtnum.html().split('>/')[1]);
    // 输入时去除灰色样式
    $('.neirong').on('focus',function () {
        var contentTxt = $(this).html().replace(/<div>/g,'<br>').replace(/<\/div>/g,'');
        if (contentTxt === textInit) {
            $(this).html('');
        }
        $(this).removeClass('ts');
    });
    // 失去焦点时，设置cookie记录内容
    $('.neirong').on('blur', function () {
        var contentTxt = $(this).html().replace(/<div>/g,'<br>').replace(/<\/div>/g,'');
        if (!contentTxt) {
            $(this).html(textInit).addClass('ts');
        }
    });

    var $evaluate = $('#evaluate');
    var $evaluateParam = $evaluate.find('dd');
    var $zygwdpin = $('.zygw-dp-in').find('dd');
    var $submit = $('#submit');
    var $float = $('.float');
    var $fbOk = $('.fb-ok');

    // 总体评价
    $evaluate.on('click','dd',function () {
        $evaluateParam.removeClass('active');
        $(this).addClass('active');
    });
    // 信息真实度，服务满意度，业务专业度
    $zygwdpin.each(function () {
        var $that = $(this);
        var $sumLi = $(this).find('i');
        $that.on('click','i',function () {
            $sumLi.removeClass('active');
            // 点中的是第几个li
            var index = $(this).index() + 1;
            // 星星变红
            for (var i = 0; i < index; i++) {
                $sumLi.eq(i).addClass('active');
            }
            // 设置为几星
            $that.attr('data-value',index);
        });
    });

    /**
     * 光标移到最后函数
     * @param obj 编辑框原生对象
     */
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
        }else {
            // IE低版本
            sel = document.selection.createRange();
            sel.moveStart('character', len);
            sel.collapse();
            sel.select();
        }
    }
    // 输入字数统计
    var len = 0;
    $('.neirong').on('input', function () {
        var me = $(this),
            text = me.html().replace(/<div>/g,'<br>').replace(/<\/div>/g,'');
        len = me.text().length;

        var brLen = text.match(/<br>/g) ? text.match(/<br>/g).length : 0;
        if (len > limitNum) {
            // 4:一个<br>标签的字符个数
            me.html(text.substring(0,limitNum + 4 * brLen));
            moveEnd(this);
        }
        // 三元表达式的目的：解决手机中文输入法一次性输入过多导致超出字数限制的情况出现字数不变的情况发生
        txtnum.html((len > limitNum ? limitNum : len) + '/' + limitNum);
    });
    var alertFlag = 0;
    var submitFlag = true;

    // 提交
    $submit.on('click', function () {
        if (userid && username) {
            content = judgeText();
            // 设为初始值
            alertFlag = 0;

            //若选择1星或2星，则必须输入至少5个字，或至少选择1个标签
            if (score > 2 || (len >= 5 || $('.pingjia .cur').length > 0)) {
                $.get('/xf.d?m=writeComment', {
                    content: content,
                    userid: userid,
                    username: encodeURIComponent(username),
                    tags: tags,
                    score: score,
                    zygwid: vars.zygwid,
                    newcode: vars.newcode
                }, function (data) {
                    if (data) {
                        var result = data.root.result;
                        if (Number(result) === 8000) {
                            $('.issens').show();
                        } else if (Number(result) === 8003) {
                            $('.ismingan').show();
                        } else if (Number(result) === 8005) {
                            $('.isguangao').show();
                        } else if(Number(result) === 8002 || Number(result) === 8001 || Number(result) === 8004) {
                            alert(data.root.message);
                            history.back(-1);
                            //location.href = location.href;
                            //clear();
                        } else {
                            alert('接口在休息，请稍后提交吧');
                        }
                        $float.removeClass('none');
                        setTimeout(function () {
                            $float.addClass('none');
                        }, 2000);
                    }
                });
            } else {
                $('.isfour').show();
            }
        } else {
            alert('请先登录后再点评');
            var href = encodeURIComponent(window.location.href);
            window.location.href = 'https://m.fang.com/passport/login.aspx?burl=' + href;
        }
    });

    $('.floatAlert a').on('click', function () {
        $('.floatAlert').hide();
    });

    /*
    *判断好评差评
     */
    function judgeEvaluate() {
        var evaluate = $evaluate.find('dd.active');
        if (evaluate.length > 0) {
            return evaluate.attr('data-value');
        }
        alertFlag++;
        if (alertFlag === 1) {
            alert('请选择总体评价');
        }
        return false;
    }

    /*
     *判断评分
     */
    function judgeGrade(index) {
        var grade = $zygwdpin.eq(index).attr('data-value');
        var options = ['信息真实度','服务满意度','业务专业度'];
        if (Number(grade)) {
            return grade;
        }
        alertFlag++;
        if (alertFlag === 1) {
            alert('请针对' + options[index] + '进行打分');
        }
        return false;
    }

    /*
     *判断写入文字
     */
    function judgeText() {
        var text = $('.neirong').html().replace(/<div>/g,'<br>').replace(/<\/div>/g,'').replace(/&nbsp;/g, ' ');
        if (text == textInit) {
            return encodeURIComponent('');
        } else {
            return encodeURIComponent(text);
        }
    }

    /*
    *提交按钮样式
     */
    function submitStyle(flag) {
        if (flag) {
            $submit.find('a').css({'background-color': '#df3031'});
        } else {
            $submit.find('a').css({'background-color': '#aaaaaa'});
        }
    }
    function clear() {
        $evaluateParam.removeClass('active');
        $zygwdpin.find('i').removeClass('active');
        $('.neirong').html(textInit).addClass('ts');
        txtnum.html(numInit);
    }



    function chatxf(city, housetype, houseid, newcode, type, phone, channel, uname,agentid, zhname, agentImg, username, zygwid) {
        localStorage.setItem('fromflag', 'zygwshop');
        localStorage.setItem('x:' + username + '', encodeURIComponent(zhname) + ';' + agentImg + ';' + encodeURIComponent('你店铺中的户型 ') + ';' + zygwid);
        $.ajax({
            url: '/data.d?m=houseinfotj&city=' + city + '&housetype=' + housetype + '&houseid=' + houseid + '&newcode=' + newcode + '&type=' + type
            + '&phone=' + phone + '&channel=' + channel + '&agentid=' + agentid,
            async: false
        });
        setTimeout(function () {
            window.location = '/chat.d?m=chat&username=x:' + uname + '&city=' + city + '&type=wapxf';
        }, 500);
    }

    // 点击在线咨询按钮发起咨询
    $('a[data-id="mes"]').on('click', function () {
        var shopinfo = '/zygwshopinfo/' + vars.city + '_' + vars.zygwid + '/';
        chatxf(vars.city, 'xf', vars.tel, '', 'chat', vars.tel, 'wapshop', decodeURIComponent(vars.username),
            vars.zygwid, vars.realname1, vars.imgPath, vars.username1, shopinfo);
        //$floatTz.addClass('none');
    });

    $('.star-other i').on('click', function () {
        var $this = $(this);
        var index = $this.index();
        // 第一颗星星取消加红
        if ($('.star-other .active').length == 1 && $this.hasClass('active')) {
            $('.star-other i').removeClass('active');
            index = -1;
        }
        // 星星加红
        $('.star-other i').removeClass('active');
        for (var i = 0; i <= index; i++) {
            $('.star-other i').eq(i).addClass('active');
        }
        // 有星星时
        if (index >= 0) {
            $('.zygw-dp-stag a').removeClass('cur');
            $('.zygw-dp-txt, .zygw-dp-stag').hide();
            //for (var i = 0; i <= index; i++) {
            $('.zygw-dp-txt').eq(index).show();
            $('.zygw-dp-stag').eq(index).show();
           // }
            $('.pingjia, .zygw-comm, .zygw-dpbtn').show();
        } else {
            $('.pingjia').hide();
        }
        score = index + 1;
    });

    // 选择标签
    $('.zygw-dp-stag a').on('click', function () {
        var $this = $(this);
        if (!$this.hasClass('cur')) {
            $this.addClass('cur');
        } else {
            $this.removeClass('cur');
        }
        tags = '';
        $('.zygw-dp-stag .cur').each(function () {
            tags = tags + $(this).html() + ',';
        });
        tags = encodeURIComponent(tags);
    });
});