define ('modules/xf/reputation', ['jquery', 'util/util', 'iscroll/2.0.0/iscroll-lite'], function (require) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;
    var Util = require('util/util');
    var sfut = Util.getCookie('sfut');
    // 登录后获取用户名，手机号和用户ID
    var username, userphone, userid;
    function getInfo(data) {
        username = data.username || '';
        userphone = data.mobilephone || '';
        userid = data.userid || '';
    }

    // 调用ajax获取登陆用户信息
    if (sfut) {
        vars.getSfutInfo(getInfo);
    }

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


    var type = vars.isgood;
    $('.overboxIn>a').removeClass('active');
    // 全
    if (type == '') {
        $('.overboxIn>a').eq(0).addClass('active');
        // 好
    } else if (type == '1') {
        $('.overboxIn>a').eq(1).addClass('active');
        // 中
    } else if (type == '2') {
        $('.overboxIn>a').eq(2).addClass('active');
        // 差
    } else if (type == '0') {
        $('.overboxIn>a').eq(3).addClass('active');
    }

    var paramzygwid = vars.paramzygwid,
        str = $('.active').attr('data-value');

    // 各个列表当前列表
    var totalNowPage = 1,
        goodNowPage = 1,
        zhongNowPage = 1,
        badNowPage = 1;

    // 各个列表总页数
    var totalPage = vars.totalpage,
        goodPage = vars.goodpage,
        zhongPage = vars.zhongpage,
        badPage = vars.badpage;

    // 显示加载更多按钮
    var loadMore = function () {
        $('.jiazaimore').hide();
        $('.xialamore').show();
    };

    // 显示加载中按钮
    var loading = function () {
        $('.xialamore').hide();
        $('.jiazaimore').show();
    };

    // 什么按钮都不显示
    var noLoad = function () {
        $('.xialamore, .jiazaimore').hide();
    };

    // 首次加载根据all的页数判断是否显示加载更多按钮
    checkDrag('all');

    // 判断是否显示加载更多按钮
    function checkDrag(str) {
        if ((str === 'all' && totalNowPage < totalPage) || (str === 'high' && goodNowPage < goodPage) || (str === 'high' && zhongNowPage < zhongPage) || (str === 'high' && badNowPage < badPage)) {
            loadMore();
        } else{
            noLoad();
        }
    }

    // 滑动到底加载更多
    $(document).on('touchmove', function () {
        var srollPos = $(document).scrollTop();
        if (srollPos >= $(document).height() - $(window).height() && !$('#loupan').hasClass('none')) {
            load(str);
        }
    });

    $('.xialamore').click(function () {
        load(str);
    });

    // 加载新的筛选
    var canload = true;
    function load(str) {
        if (canload && !$('.xialamore').is(':hidden')) {
            canload = false;
            // 正在加载请稍候
            loading();
            // 加载列表
            var page = '',
                isgood = '';
            if (str === 'all') {
                isgood = '';
                page = ++totalNowPage;
            } else if (str === 'high') {
                isgood = '1';
                page = ++goodNowPage;
            } else if (str === 'zhong') {
                isgood = '2';
                page = ++zhongNowPage;
            } else if (str === 'low') {
                isgood = '0';
                page = ++badNowPage;
            }
            $.post('/shopinfo.d?m=reputationPage', {
                zygwid: paramzygwid,
                isgood: isgood,
                page: page
            }, function (data) {
                //$('div[name=' + str + ']').find('ul').append(data);
                $('div[name=all]').append('<ul class="newUl">' + data + '</ul>');
                showStar();
                checkDrag(str);
                canload = true;
                panduanHuifu('newUl');
            });
        }
    }

    // 主力户型控制星星亮
    var showStar = function () {
        $('.zygw-reviews .ico-star').each(function () {
            var curStars = $(this).attr('star');
            var zhengshu = parseInt(curStars);
            var xiaoshu = (curStars - parseInt(curStars)).toFixed(1);
            // 在.0-.4之间是按0颗星   .4-.8按半颗星  .8以上 整颗星
            for (var i = 0; i < zhengshu; i += 1) {
                $(this).find('i').eq(i).attr('class', 'active');
            }
            if (xiaoshu >= 0.4 && xiaoshu <= 0.8) {
                $(this).find('i').eq(zhengshu).attr('class', 'half');
            } else if (xiaoshu > 0.8) {
                $(this).find('i').eq(zhengshu).attr('class', 'active');
            }
        });
    };
    showStar();

    $('div[name=all]').find('ul').addClass('newUl');
    var content = '',
        myClick = '',
        huifuduixiang,
        dianjiduixiang,
        scrollTop;
    var panduanHuifu = function (obj) {
        var $this;
        if (obj) {
            $this = $('.' + obj);
        } else {
            $this = $('div[name=all]');
        }
        $this.find('.comment-list-c').each(function () {
            var $this = $(this);
            $.get('/shopinfo.d?m=ZygwReplyList&id=' + $this.attr('data-id') + '&zygwid=' + vars.paramzygwid, function (data) {
                if (data.indexOf('<li>') > -1) {
                    $this.html(data);
                    // 点击变灰，松开恢复
                    $this.find('li').each(function () {
                        if ($(this).find('a').eq(0).html() == vars.paramzygwname) {
                            $(this).on('touchstart', function () {
                                var $this = $(this);
                                $this.addClass('cur');
                            }).on('touchend', function () {
                                var $this = $(this);
                                $this.removeClass('cur');
                            });
                        }
                    });
                    // 点击回复小按钮
                    $this.siblings('.comment-sum').find('a').html($this.find('ul').eq(0).attr('count')).on('click', function () {
                        if ($this.is(':hidden')) {
                            $this.show();
                            myClick = $this;
                        } else {
                            $this.hide();
                        }
                    });
                    // 点击共13回复
                    $this.find('.a-more a').on('click', function () {
                        $(this).parent().hide();
                        $this.find('ul').eq(1).show();
                    });
                    $this.siblings('.comment-sum').show();

                    // 本人点击回复内容
                    $this.find('ul').on('click', 'li', function () {
                        // 如果已经登录了
                        if (sfut) {
                            // 回复的是自己的
                            if ($this.siblings('.comment-out').find('.fasong').attr('name').split('_')[1].indexOf(userid) > -1 || userid == '52769625') {
                                // 是置业顾问回复的
                                if ($(this).find('a').eq(0).html() == vars.paramzygwname || userid == '52769625') {
                                    huifuduixiang = $(this).find('a').eq(0).html();
                                    //$this.siblings('.comment-out').show();
                                    scrollTop = $(document).scrollTop();
                                    //$('body>.comment-out').find('.ts').html('回复' + vars.paramzygwname + '，150字以内').css('color', '#cccfd8');
                                    $('body>.comment-out').find('.ts').html('150字之内哦~').css('color', '#cccfd8');
                                    $('.main, .header').hide();
                                    $('body>.comment-out').show();
                                    unable();
                                    dianjiduixiang = $(this).parent().parent();
                                    //$('body>.comment-out .ts').focus();
                                    // 不是置业顾问回复的啥也不干
                                }
                                // 回复的不是自己的
                            } else {
                                $('.ismyself').show();
                            }
                            //$this.siblings('.comment-out').show();
                            // 如果没有登录
                        } else {
                            $('.islogin').show();
                        }
                    });

                    // 输入框获得焦点的时候
                    $('body>.comment-out').find('.ts').on('focus', function () {
                        if ($(this).css('color') == 'rgb(204, 207, 216)') {
                            $(this).html('').css('color', '#0c0d0e');
                        }
                        // 输入框失去焦点的时候
                    }).on('blur', function () {
                        if ($(this).html().length == 0) {
                            $(this).html('150字之内哦~').css('color', '#cccfd8');
                        }
                        // 输入框正在输入的时候
                    }).on('input', function () {
                        if ($(this).css('color') == 'rgb(204, 207, 216)') {
                            $(this).html('').css('color', '#0c0d0e');
                        }
                        var me = $(this),
                            limitNum = 150,
                            text = me.text(),
                            len = text.length;
                        if (len == 0) {
                            $(this).siblings('.opc').find('.fasong').removeClass('active');
                        } else {
                            $(this).siblings('.opc').find('.fasong').addClass('active');
                        }
                        if (len <= limitNum) {
                            content = text;
                        } else if (len > limitNum) {
                            me.html(content);
                            moveEnd(this);
                        }
                        // 三元表达式的目的：解决手机中文输入法一次性输入过多导致超出字数限制的情况出现字数不变的情况发生
                        $('.comment-out .txt-num').html(me.text().length + '/' + limitNum);
                    })
                } else {
                }
            });
            $this.attr('data-id');
        });
        $('.newUl').removeClass('newUl');

    };
    panduanHuifu();

    // 光标移到最后函数
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

    // 先登录弹框的去登陆
    $('.islogin .login').on('click', function () {
        window.location.href = 'https://m.fang.com/passport/login.aspx?burl=' + encodeURIComponent(location.href);
    });

    // 只有本人弹框的我知道了  先登录弹框的放弃  敏感词汇弹框的确定
    $('.ismyself a, .islogin .giveup, .issens a, .issuccess a, .isguangao a').on('click', function () {
        $('.floatAlert').hide();
    });


    // 取消按钮
    $('.quxiao').on('click', function () {
        $(this).siblings().removeClass('active');
        $('.main, .header').show();
        $(document).scrollTop(scrollTop);
        $('.comment-out .txt-num').html('0/150');
        $('body>.comment-out').hide();
        enable();
    });
    // 发送按钮
    $('.fasong').on('click', function () {
        if ($(this).hasClass('active')) {
            var $this = dianjiduixiang.siblings('.comment-out'),
                $fasong = $this.find('.fasong'),
                fasongName = $fasong.attr('name').split('_');
            $.get('/shopinfo.d?m=ZygwAddReply&id=' + fasongName[0] + '&zygwid=' + vars.paramzygwid + '&content=' + encodeURIComponent(encodeURIComponent($('body>.comment-out').find('.ts').text())) + '&Reply_type=1&userid=' + fasongName[1] + '&username=' + fasongName[2] + '&zygwname=' + vars.realname, function (data) {
                if (data) {
                    $('.main, .header').show();
                    $(document).scrollTop(scrollTop);
                    $('.comment-out .txt-num').html('0/150');
                    $('body>.comment-out').hide();
                    // 成功
                    if(data.root.result == '100') {
                        $('.issuccess').show();
                        $this.hide();
                        enable();
                        if (myClick.find('ul').eq(1).length) {
                            myClick.find('ul').eq(1).append('<li><div class="cont"><a href="javascript:void(0)">' + fasongName[2].substring(0,2) + '**' + '</a> 回复 <a href="javascript:void(0)">' + vars.paramzygwname + '：</a> <span>' + $('body>.comment-out').find('.ts').text() + '</span> </div> </li>');
                        } else {
                            myClick.find('ul').eq(0).append('<li><div class="cont"><a href="javascript:void(0)">' + fasongName[2].substring(0,2) + '**' + '</a> 回复 <a href="javascript:void(0)">' + vars.paramzygwname + '：</a> <span>' + $('body>.comment-out').find('.ts').text() + '</span> </div> </li>');
                        }
                        var newhuifushu = parseInt(myClick.siblings('.comment-sum').find('a').html()) + 1;
                        myClick.siblings('.comment-sum').find('a').html(newhuifushu);
                        myClick.find('.a-more a').html('共' + newhuifushu + '条回复');
                        $('body>.comment-out').find('.ts').html('150字之内哦~').css('color', '#cccfd8');
                        $('body>.comment-out').find('.fasong').removeClass('active');
                        // 有屏蔽词汇 和 广告过滤
                    } else if (data.root.result == '105') {
                        $('.issens').show();
                    } else if (data.root.result == '106') {
                        $('.isguangao').show();
                    }else {
                        alert(data.root.message);
                    }
                }
            })
        }
    });
});