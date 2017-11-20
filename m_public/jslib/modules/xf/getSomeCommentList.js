/**
 * Created by MyOwns on 16/4/29.
 */
define('modules/xf/getSomeCommentList', ['jquery', 'modules/xf/showPhoto'], function (require, exports, module) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;
    var clicked = [];
    // 小图变大图插件
    var ShowPhoto = require('modules/xf/showPhoto');
    var guid = getCookie('global_cookie');
    var photourl, mobilephone, username, isvalid, userid, mphone, newcode, city;
    $(document).ready(function () {
        var mstype = '';
        if (mstype !== 'logout') {
            var sfut = getCookie('sfut');
            if (sfut !== null) {
                $.get('/user.d?m=getUserinfoBySfut', {sfut: sfut}, function (data) {
                    var returnResult = data.root.return_result;
                    if (returnResult === '100') {
                        photourl = data.root.photourl;
                        mobilephone = data.root.mobilephone;
                        username = data.root.username;
                        userid = data.root.userid;
                    }
                });
            }
        }
        $('.main').on('click', '.btn-comm', function () {
            var $that = $(this);
            $that.attr('disabled', true);
            var content = $that.siblings('.ipt-comm').text().trim();
            if (content === '' || content === null) {
                alert('回复内容不能为空');
                $that.removeAttr('disabled');
                return false;
            }
            if (content.length > 40) {
                alert('回复内容不能超过40字');
                $that.removeAttr('disabled');
                return false;
            }

            var ids = $('.btn-comm').attr('name');
            var tid = '', fid = '';
            tid = ids.split('_')[0];
            fid = ids.split('_')[1];
            newcode = $that.parent().parent().siblings('.comment-text').attr('pro_newcode');
            city = $that.parent().parent().siblings('.comment-text').attr('m_city');
            $.post('/xf.d?m=makeHf',
                {
                    newcode: newcode,
                    city: city,
                    userid: userid,
                    username: encodeURIComponent(username),
                    content: encodeURIComponent(content),
                    tid: tid,
                    fid: fid
                },
                function (data) {
                    $('.btn-comm').removeAttr('disabled');
                    if (data.root.result == '100'){
                        $that.siblings('.ipt-comm').html('');
                        zhanshihuifu(tid, $that);
                        $('a[name='+tid+']').focus();
                        var thatDom = $('a[name='+tid+'_'+tid+'_'+newcode+'_'+city+']');
                        thatDom.html(thatDom.text()*1+1);
                        $('.boxshaow').hide();
                        $('#blackback').hide();
                        document.removeEventListener('touchmove', removeTouch);
                    } else {
                        alert(data.root.message);
                    }
                }
            );
        });
        $('.ico-star').each(function () {
            var curStars = $(this).attr('star');
            for (var i = 0; i < curStars; i++) {
                $(this).parent().find('i').eq(i).attr('class','active');
                if (curStars.indexOf('.5') !== -1) {
                    $(this).find('i').eq(curStars-0.5).attr('class','active half');
                }
            }
        });

        $('.userPhoto').each(function(){
            var userid = $(this).attr('name');
            $.post('/xf.d?m=getUserPhoto',
                {userid: userid},
                function(data){
                    $('img[name='+userid+']').attr('src',data.root.userPhoto);
                }
            );
        });

    });
    $('.comment-list').on('click', 'a', function(e){
        var $this = $(this);
        if($this.hasClass('z')){
            var dataArr=$this.attr('name').split('_');
            var tid = dataArr[1];
            var newcode = dataArr[2];
            var city = dataArr[3];
            var $span=$this.find('span');
            var agreeNum = $span.text();
            var fid ='';
            if (!$this.hasClass('cur')) {
                $.post('/xf.d?m=makeZan',
                    {newcode:newcode,
                        city:city,
                        tid:tid,
                        fid:fid,
                        guid:userid
                    },
                    function(data){
                        if (data.root.result == '100') {
                            $span.text(agreeNum*1+1);
                            $this.addClass('cur');
                        } else {
                            alert(data.root.message);
                        }
                    });
            } else {
                alert('亲，您已经点过了~');
            }
        } else if ($this.hasClass('t')) {
            var checkLogined = checkLogin();
            if (checkLogined) {
                //$boxshaow.show();
                //$blackback.show();
                if ($(this).parents('li').find('.comment-list-c').is(':hidden')) {
                    $(this).parents('li').find('.comment-list-c').show();
                } else {
                    $(this).parents('li').find('.comment-list-c').hide();
                }
                var ids = $this.attr('name');
                $this.parent().parent().siblings('.comment-list-c').find('.btn-comm').attr('name', ids);
                $('#txtinput').focus();
                if ($this.hasClass('reply')) {
                    var oname = ids.split('_')[1];
                    var onameIdx = clicked.indexOf(oname);
                    if (onameIdx < 0) {
                        zhanshihuifu(oname, $this);
                        clicked.push(oname);
                    } else {
                        clicked.splice(onameIdx, 1);
                        $('.' + oname).empty().hide();
                    }
                }
                canLoad = false;
                //document.addEventListener('touchmove', removeTouch);
            }
        }
    });
    // 回复div获取焦点
    $('.main').find('.comment-list').on('click', '.ipt-comm', function () {
        if ($(this).html() == '说点什么吧') {
            $(this).html('').css('color', 'black');
        }
    });
    // 输入
    $('.main').find('.comment-list').on('input change', '.ipt-comm', function () {
        if ($(this).html() && $(this).html() != '说点什么吧') {
            $(this).siblings('.btn-comm').removeClass('disabled');
        } else {
            $(this).siblings('.btn-comm').addClass('disabled');
        }
    });
    // 图片效果-----------------------------------start
    $('.main').on('click', '.clearfix dd', function () {
        // 视频播放
        if ($(this).hasClass('videoIdentify')) {
            $(this).parent('dl').find('img').each(function () {
                var videoHref = '/v.d?m=video&city=' + vars.paramcity + '&id=' + vars.paramId + '&vid=&video_url=' + $(this).attr('data-name');
                location.href = videoHref;
            });
        } else {
            var $images = $(this).parent().find('img');
            ShowPhoto.openPhotoSwipe($images,$(this).index());
            ShowPhoto.gallery.listen('afterChange', function(data) {
                console.log(data)
            });
        }
    });
    function zhanshihuifu(tid, dom) {
        var thisNewcode = dom.parent().parent().siblings('.comment-text').attr('pro_newcode');
        var thisCity = dom.parent().parent().siblings('.comment-text').attr('m_city');
        $.post('/xf.d?m=dphf',
            {
                tid: tid,
                newcode: thisNewcode,
                city: thisCity
            },
            function(data){
                if (data !== '' && data !== null) {
                    $('.'+thisNewcode).empty().append(data).show();
                }
            });
    }
    var UA = window.navigator.userAgent;
    var canLoad = true;
    if (/iPhone/.test(UA)) {
        var s = UA.substr(UA.indexOf('iPhone OS ')+10, 3);
        if (parseFloat(s[0] + s[2]) < 72 || /UCBrowser/.test(UA)) {
            $('.boxshaow .ipt-txt').on('focus', function (e) {
                if (window.orientation === 90) return;
                var thisDom = $('.boxshaow');
                var winH = $(window).height();
                var documentH = $(document).height();
                var oldScrollTop = $(window).scrollTop();
                setTimeout(function(){
                    var thisDomH = thisDom.offset().top;
                    var newScrollTop = $(window).scrollTop();
                    if ($(document).outerHeight(true) - oldScrollTop <= winH) return;
                    $(window).scrollTop(oldScrollTop);
                    $('.boxshaow, #blackback').css('bottom',winH - 2 * (thisDomH - newScrollTop) - thisDom.outerHeight() + 'px');
                    $('#blackback').css('min-height','100%');
                }, 200);
            }).blur(function () {
                $('.boxshaow, #blackback').css('bottom','0px');
            });
        }
    }
    function removeTouch(e){
        e.preventDefault();
        e.stopPropagation();
    }
    $('#blackback').on('click', function () {
        $('.boxshaow').hide();
        $('#blackback').hide();
        document.removeEventListener('touchmove', removeTouch);
        canLoad = true;
    });
    $('.grade-text').each(function(){
        var $this = $(this);
        var ud = $this.attr('name');
        var line = 60;
        var bj = $this.attr('bj');
        var ph1 = parseInt($('p[name='+ud+']:eq(0)').height());
        var ph2 = 0;
        if (bj === 'bj') {
            line = 80;
            ph2 = parseInt($('p[name='+ud+']:eq(1)').height());
        }
        var ph = ph1+ph2;
        if (ph > line) {
            $('div [name=more_'+ud+']').attr('style','');
        }
    });
    /*
     *判断是否显示更多按钮
     */
    function showMoreId() {
        $('.comment-text').each(function () {
            var $this = $(this);
            var ud = $this.attr('name');
            var line = 60;
            var bianji = $this.attr('bianji');
            var ph1 = parseInt($('p[name=' + ud + ']:eq(0)').height());
            var ph2 = 0;
            if (bianji === 'bianji') {
                line = 80;
                ph2 = parseInt($('p[name=' + ud + ']:eq(1)').height());
            }
            var ph = ph1 + ph2;
            if (ph > line) {
                $('div [name=more_' + ud + ']').show();
            }
        });
    }
    showMoreId();
    // 点击显示更多小箭头
    $('.main').on('click', '.comment-more', function () {
        var $this = $(this);
        // 显示全部内容 更多按钮隐藏
        $this.siblings('.comment-text').attr('style','');
        $this.hide();
    });

    // 点击文字与点击显示更多的作用相同
    $('.main').on('click', '.comment-text', function () {
        var $this = $(this);
        if (!$this.hasClass('isShowAll')) {
            // 显示全部内容 更多按钮隐藏
            $this.attr('style','');
            $this.addClass('isShowAll');
            $this.siblings('.comment-more').hide();
        }
    });
    $('.icon-q').on('click', function () {
        $('.floatAlert').show();
    });
    $('.floatAlert').on('click', 'a', function () {
        $('.floatAlert').hide();
    });
    window.addEventListener('scroll',function scrollHandler(){
        if (!canLoad) return;
        var scrollh = $(document).height();
        var bua = navigator.userAgent.toLowerCase();
        if(bua.indexOf('iphone') != -1 || bua.indexOf('ios') != -1){
            scrollh = scrollh-140;
        }else{
            scrollh = scrollh-80;
        }
        var c=document.documentElement.clientHeight || document.body.clientHeight, t=$(document).scrollTop();
        if(k != false && ($(document).scrollTop() + w.height()) >= scrollh){
            var str = $('a.active').attr('name') === 'all' ? 'all' : 1;
            load(str);
        }
    },100);

    var total = $('#totalpage').html();
    var k = true;
    var w = $(window);
    var all_curp = 2;
    var good_curp = 1;
    var totalflag = 1;
    var goodflag = true;
    var totalnum = 0;
    var goodnum = $('#goodpage').html();
    if(total<=1){
        totalflag = 0;
        $('#drag').hide();
        k = false;
    }

    var page = '';
    function load(str){
        if((str === 'good' && goodflag && goodnum >= 1) || str === 'all')
            goodflag = false;
        var draginner = $('.draginner')[0];
        k = false;
        $('.draginner').css('padding-left','10px');
        if (draginner) {
            draginner.innerHTML='正在加载请稍候';
        }
        if (str === 'all') {
            totalnum = vars.pageAllcount;
            page = all_curp;
        }
        if (str == 1) {
            totalnum = vars.pageJinghuacount;
            page = good_curp;
        }
        $.post('/xf.d?m=getSomeCommentList',
            {
                userid: vars.paramuserid,
                city: vars.paramcity,
                page: page,
                zanuserid: vars.paramzanuserid,
                type: str,
                imei: vars.paramimei
            },
            function(data){
                if (str === 'all') {
                    $('div[name="good"]').hide();
                    $('div[name="all"]').show().find('ul').append(data);
                    $('.draginner').css('padding-left','0px');
                    if (draginner) {
                        draginner.style.background = '';
                        draginner.innerHTML = '上拉自动加载更多';
                    }
                    k = true;
                    goodflag = true;
                    all_curp += 1;
                    if(all_curp > parseInt(totalnum)){
                        totalflag = 0;
                        $('.moreList').hide();
                        k = false;
                        goodflag = false;
                    }
                } else {
                    $('div[name="all"]').hide();
                    $('div[name="good"]').show().find('ul').append(data);
                    $('.draginner').css('padding-left','0px');
                    if (draginner) {
                        draginner.style.background = '';
                        draginner.innerHTML = '上拉自动加载更多';
                    }
                    k = true;
                    good_curp+=1;
                    goodflag = true;
                    if (good_curp > parseInt(goodnum)) {
                        $('.moreList').hide();
                        k = false;
                        goodflag = false;
                    }
                }
                showMoreId();
                $('.ico-star').each(function () {
                    var curStars = $(this).attr('star');
                    for (var i = 0; i < curStars; i++) {
                        $(this).parent().find('i').eq(i).attr('class','active');
                        if (curStars.indexOf('.5') !== -1) {
                            $(this).find('i').eq(curStars-0.5).attr('class','active half');
                        }
                    }
                });

                $('.userPhoto').each(function(){
                    var userid = $(this).attr('name');
                    $.post('/xf.d?m=getUserPhoto',
                        {userid: userid},
                        function(data){
                            $('img[name='+userid+']').attr('src',data.root.userPhoto);
                        }
                    );
                });
            }
        );
    }

    $('.comment-ta-tab').on('click', 'li', function () {
        var flexboxDom = $('.flexbox');
        flexboxDom.find('li').attr('class','');
        $(this).addClass('cur');
        flexboxDom.find('li').children().attr('class','');
        $(this).find('li').children().addClass('active');
        if ($(this).find('a').attr('name') === 'all') {
            load('all');
        } else {
            load(1);
        }
        if($(this).find('a').attr('name') == 'all' && all_curp < totalnum){
            k = true;
        }
    });


    function getCookie(name) {
        var arr,reg=new RegExp('(^| )'+name+'=([^;]*)(;|$)');
        if(arr=document.cookie.match(reg))
            return unescape(arr[2]);
        else
            return null;
    }

    function checkLogin(){
        if(userid == null || userid ==''){
            alert('请登录后操作！');
            window.location.href = 'https://m.fang.com/passport/login.aspx?burl=http://m.test.fang.com/xf.d%3fm=getSomeCommentList%26userid=' + vars.paramuserid
                + '%26city=' + vars.paramcity + '%26zanuserid=' + vars.paramzanuserid + '%26pagesize=' + vars.parampagesize + '%26imei=' + vars.paramimei
                + '%26newcode=' + vars.paramid;
            return false;
        }
        return true;
    }
});