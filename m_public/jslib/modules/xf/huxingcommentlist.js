define('modules/xf/huxingcommentlist', ["jquery", "util/util", 'modules/xf/showPhoto', 'superShare/1.0.1/superShare', 'weixin/1.0.1/weixinshare'], function (require, exports, module) {
    "use strict";
    var $ = require("jquery"), cookiefile = require("util/util"), vars = seajs.data.vars;
    var localStorage = vars.localStorage;
    var sfut = cookiefile.getCookie("sfut");

    var preload = [];
    preload.push("modules/xf/head", "modules/xf/feet");
    // 小图变大图插件
    var ShowPhoto = require('modules/xf/showPhoto');
    // 合并加载js
    require.async(preload);

    // 微信分享功能
    var wx = require('weixin/1.0.1/weixinshare');
    var reg = /搜房网/g;
    var weixin = new wx({
        shareTitle: ($('.bgproname').html() + '怎么样').replace(reg, '房天下'),
        descContent: ('综合评分：' +  $('.bgscore').html() + '分\n' + '共' + $('.bgcount').html() + '条评论').replace(reg, '房天下'),
        imgUrl: $('.bgpic').html().trim(),
        lineLink: window.location.href
    });

    //统计行为 --------------start
    require.async('jsub/_ubm.js?_2017102307fdsfsdfdsd', function () {
        if (vars.paramsuccess) {
            yhxw(16);  //16 == 点评
        } else {
            yhxw(0);  //0 == 浏览
        }
    });

    function yhxw(type) {
        _ub.city = vars.ubcity;
        _ub.biz = 'n'; // 业务---WAP端
        _ub.location = vars.ublocation; // 方位（南北方) ，北方为0，南方为1
        var b = type; //用户动作（浏览0、搜索1、打电话31、即时通讯24、预约25、收藏21、分享22）
        var p_temp = {
            'vmn.projectid': vars.paramId,
            'vmg.sourceapp':vars.is_sfApp_visit + '^xf'
        }; // 用户行为(格式：'字段编号':'值')
        var p = {};
        //若p_temp中属性为空或者无效，则不传入p中
        for (var temp in p_temp) {
            if (p_temp[temp] != null && "" != p_temp[temp] && undefined != p_temp[temp] && "undefined" != p_temp[temp]) {
                p[temp] = p_temp[temp];
            }
        }
        _ub.collect(b, p); // 收集方法
    }
    //统计行为 --------------end

    var clicked = [];
    var canLoad = true;
    var guid = cookiefile.getCookie('global_cookie');
    var photourl, mobilephone, username, isvalid, userid, mphone;

    var mstype = vars.parammstype;
    if (mstype != 'logout') {
        if (sfut != null) {
            $.get("/user.d?m=getUserinfoBySfut", {sfut: sfut}, function (data) {
                if (data) {
                    var return_result = data.root.return_result;
                    if (return_result == '100') {
                        photourl = data.root.photourl;
                        mobilephone = data.root.mobilephone;
                        username = data.root.username;
                        userid = data.root.userid;
                    }
                }
            });
        }
    }

    var $blackback = $("#blackback");
    //浏览器兼容性 --------------start
    var UA = window.navigator.userAgent;
    if (/iPhone/.test(UA)) {
        var s = UA.substr(UA.indexOf('iPhone OS ') + 10, 3);
        if (parseFloat(s[0] + s[2]) < 72 || /UCBrowser/.test(UA)) {
            $(".ipt-comm").on("focus", function (e) {
                if (window.orientation === 90)return;
                var _this = $(".boxshaow");
                var winH = $(window).height();
                var documentH = $(document).height();
                var oldScrollTop = $(window).scrollTop();
                setTimeout(function () {
                    var _thisH = _this.offset().top;
                    var newScrollTop = $(window).scrollTop();
                    if ($(document).outerHeight(true) - oldScrollTop <= winH)return;
                    $(window).scrollTop(oldScrollTop);
                    $(".boxshaow, #blackback").css("bottom", winH - 2 * (_thisH - newScrollTop) - _this.outerHeight() + "px");
                    $blackback.css("min-height", "100%");

                }, 200);
            }).blur(function () {
                $(".boxshaow, #blackback").css("bottom", "0px");
            });
        }
    }
    //浏览器兼容性 --------------end

    var oError = $('#txtinput');
    var $report = $('.commentBox');

    var focusFLag = false;
    var $win = $(window);
    var oldHeight = $win.height();
    var oMessage = window.navigator.userAgent.toLowerCase();
    var beHeight;

    //点击事件------------start
    function click() {
        $blackback.on("click", function () {
            $('.boxshaow').hide();
            $blackback.hide();
            document.removeEventListener("touchmove", removeTouch);
            canLoad = true;
        });

        //发表------------------start
        var $iptsub = $(".btn-comm");
        var $ipttxt = $(".ipt-comm");
        $iptsub.bind("click", function () {
            $(this).attr("disabled", true);
            var content = $(this).siblings('.ipt-comm').text().trim();
            if (!content) {
                alert("回复内容不能为空");
                $(this).removeAttr("disabled");
                return false;
            }
            if (content.length > 40) {
                alert("回复内容不能超过40字");
                $(this).removeAttr("disabled");
                return false;
            }

            var ids = $(this).attr("name");
            var tid = '', fid = '';
            tid = ids.split('_')[0];
            fid = ids.split('_')[2];
            $.post("/xf.d?m=makeHf",
                {
                    newcode: vars.paramId,
                    city: vars.paramcity,
                    userid: userid,
                    username: encodeURIComponent(username),
                    content: encodeURIComponent(content),
                    tid: tid,
                    fid: fid
                },
                function (data) {
                    if (data) {
                        $iptsub.removeAttr("disabled");
                        if (data.root.result == '100') {
                            $ipttxt.html("");
                            zhanshihuifu(tid);
                            $("a[name=" + tid + "]").focus();
                            $("a[name=" + tid + "]").html($("a[name=" + tid + "]").text() * 1 + 1);
                            $('.boxshaow').hide();
                            $blackback.hide();
                            document.removeEventListener("touchmove", removeTouch);
                        } else {
                            alert(data.root.message);
                        }
                    }
                });

        });
        //发表------------------end

        $(".comment-list").on("click", "a", function (e) {
            var $this = $(this);
            // 点赞
            if ($this.hasClass('z')) {
                var dataArr = $this.attr('name').split('_');
                var tid = dataArr[1];
                var $span = $this.find('span');
                var agreeNum = $span.text();
                var fid = '';
                if (!$this.hasClass('cur')) {
                    $.post('/xf.d?m=makeZan',
                        {
                            newcode: vars.paramId,
                            city: vars.paramcity,
                            tid: tid,
                            fid: fid,
                            guid: userid
                        },
                        function (data) {
                            if (data) {
                                if (data.root.result === '100') {
                                    $span.text(agreeNum * 1 + 1);
                                    // 添加点赞的class
                                    $this.addClass('cur');
                                } else {
                                    alert(data.root.message);
                                }
                            }
                        });
                } else {
                    alert('亲，您已经点过了~');
                }
                // 回复
            } else if ($this.hasClass('huifu')) {
                var checkLogined = checkLogin();
                if (checkLogined) {
                    if ($(this).parents('li').find('.comment-list-c').is(':hidden')) {
                        $(this).parents('li').find('.comment-list-c').show();
                    } else {
                        $(this).parents('li').find('.comment-list-c').hide();
                    }
                    var ids = $this.attr('name');
                    $iptsub.attr('name', ids);
                    $('#txtinput').focus();
                    if ($this.hasClass('reply')) {
                        var oname = ids.split('_')[1];
                        var onameIdx = clicked.indexOf(oname);
                        if (onameIdx < 0) {
                            zhanshihuifu(oname);
                            clicked.push(oname);
                        } else {
                            clicked.splice(onameIdx, 1);
                            $('.' + oname).empty().hide();
                        }
                    }
                    canLoad = false;
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

        $("#ckeckLogin").click(function () {
            ckeckLogin('2');
        });
    }

    //点击事件------------end
    /*
     *判断是否显示更多按钮
     */
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

    $('.comment-more').attr('more', 1);
    // 点击显示更多小箭头
    $('.main').on('click', '.comment-more', function () {
        var $this = $(this);
        if ($this.attr('more') == 1) {
            // 显示全部内容 更多按钮隐藏
            $this.siblings('.comment-text').css('max-height','none');
            $this.css({
                '-moz-transform': 'rotate(180deg)',
                '-webkit-transform': 'rotate(180deg)',
                'transform':'rotate(180deg)'
            });
            $this.attr('more', 0);
        } else {
            $this.siblings('.comment-text').css('max-height','72px');
            $this.css({
                '-moz-transform': 'rotate(0)',
                '-webkit-transform': 'rotate(0)',
                'transform':'rotate(0)'
            });
            $this.attr('more', 1);
        }
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

    function changeSize() {
        if (oMessage.indexOf('android') !== -1) {
            if (focusFLag) {
                focusFLag = false;
                beHeight = $win.height() - oldHeight;
                $report.css({'top': beHeight + "px"});
            } else {
                focusFLag = true;
                $report.css({'top': '0px'});
            }
        }
    }

    // 点击评论人跳转
    $('.main').find('.comment-list').on('click', 'dd[name="hiscomment"]', function () {
        if ($(this).attr('anonymous') === '0') {
            window.location.href = '/xf.d?m=getSomeCommentList' + '&userid=' + $(this).attr('data-name') + '&city=' + $(this).attr('city')
                + '&type=&zanuserid=' + userid + '&page=' + vars.paramp + '&pagesize=10' + '&imei=' + 1 + '&newcode=' + $(this).attr('pro_newcode');
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
            });
        }
    });

    //由于通过ajax取得数据后需要从新刷新这些点击事件，故封装为函数---------start
    function ajaxfresh() {
        $(".grade-text p").each(function () {
            $(this).click(function () {
                moreContent($(this).attr("name"));
            });
        });
        $(".clearfix a").each(function () {
            if ($(this).html().trim() == "更多") {
                $(this).click(function () {
                    moreContent($(this).attr("data-name"));
                });
            }
        });
        //用户头像
        $(".userPhoto").each(function () {
            var userid = $(this).attr("name");
            $.post("/xf.d?m=getUserPhoto", {userid: userid}, function (data) {
                if (data) {
                    $("img[name=" + userid + "]").attr("src", data.root.userPhoto);
                }
            });
        });
        $(".grade-text").each(function () {
            var $this = $(this);
            var ud = $this.attr("name");
            var line = 60;
            var bianji = $this.attr("bianji");
            var ph1 = parseInt($("p[name=" + ud + "]:eq(0)").height());
            var ph2 = 0;
            if (bianji == "bianji") {
                line = 80;
                ph2 = parseInt($("p[name=" + ud + "]:eq(1)").height());
            }
            var ph = ph1 + ph2;
            if (ph > line) {
                $("div [name=more_" + ud + "]").attr("style", "");
            }
        });
        //控制星星亮------------start
        $(".ico-star").each(function () {
            var curStars = $(this).attr("star");
            for (var i = 0; i < curStars; i++) {
                $(this).parent().find("i").eq(i).attr("class", "active");
                if (curStars.indexOf(".5") != -1) {
                    $(this).find("i").eq(curStars - 0.5).attr("class", "active half");
                }
            }
        });
        //控制星星亮-------------end
    }

    //由于通过ajax取得数据后需要从新刷新这些点击事件，故封装为函数---------end
    function removeTouch(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function moreContent(userid) {
        $(".f999").each(function () {
            var user_id = userid;
            $("[name=" + user_id + "]").attr("style", "");
        });
        $("div [name=more_" + userid + "]").attr("style", "display:none");
    }

    function zhanshihuifu(tid) {
        $.post("/xf.d?m=dphf", {tid: tid, newcode: vars.paramId, city: vars.paramcity}, function (data) {
            if (data) {
                $("." + tid).empty().append(data).show();
            }
        });
    }

    function checkLogin() {
        if (userid == null || userid == '') {
            alert("请登录后操作！");
            window.location.href = 'https://m.fang.com/passport/login.aspx?burl=' + vars.mainSite + "xf/" + vars.paramcity + "/" + vars.paramId + "_" + vars.paramhxid + "/dianping.htm";
            return false;
        }
        return true;
    }

    var $drag = $('#drag');

    var total = $('#totalpage').html();
    var k = true;
    var w = $(window);
    var all_curp = 2;
    var good_curp = 1;
    var countexistpic_curp = 1;
    var countstarlevel1_curp = 1;
    var countstarlevel2_curp = 1;
    var countstarlevel3_curp = 1;
    var countstarlevel4_curp = 1;
    var countstarlevel5_curp = 1;
    var totalflag = 1;
    var goodflag = true;
    var countexistpicflag = true;
    var countstarlevel1flag = true;
    var countstarlevel2flag = true;
    var countstarlevel3flag = true;
    var countstarlevel4flag = true;
    var countstarlevel5flag = true;
    var totalnum = $('#totalpage').html();
    var goodnum = $('#goodpage').html();
    var countexistpicnum = $('#countexistpicpage').html();
    var countstarlevel1num = $('#countstarlevel1page').html();
    var countstarlevel2num = $('#countstarlevel2page').html();
    var countstarlevel3num = $('#countstarlevel3page').html();
    var countstarlevel4num = $('#countstarlevel4page').html();
    var countstarlevel5num = $('#countstarlevel5page').html();
    if (total <= 1) {
        totalflag = 0;
        $drag.hide();
        k = false;
    }


    var judgeClick = false;

    // 总条数
    var hxallcount = parseInt($('#hxallcount').attr('data-num')),
        // 总页数
        totalPage = Math.ceil(hxallcount / 10),
        // 当前页数
        nowPage = 1;
    function load(str) {
        if (nowPage < totalPage) {
            judgeClick = !judgeClick;
            if (judgeClick) {
                var draginner = $('.draginner')[0];
                var k = false;
                $('.draginner').css('padding-left', '10px');
                if (draginner) {
                    draginner.innerHTML = "正在加载请稍候";
                }
                var page = '';
                $('#drag').show();
                $.post("/xf.d?m=commentList",
                    {
                        id: vars.paramId,
                        city: vars.paramcity,
                        p: page,
                        userid: vars.paramuserid,
                        type: "huxing_json," + vars.paramhxid
                    },
                    function (data) {
                        if (data) {
                            $("div[name=" + str + "]").find("ul").append(data);
                            $('#drag').hide();
                            k = true;
							xbhfPanduan();
                        }
                        //调用刷新点击事件
                        ajaxfresh();
                        setTimeout(judgeClick = !judgeClick, 250);
                    });
            }
        } else {
            $('#drag').hide();
        }
    }

    //点评赚积分------------------start
    function ckeckLogin(e) {
        var userid = "";
        var username = "";
        var mobilephone = "";
        var photourl = "";
        if (sfut != null) {
            $.get("/user.d?m=getUserinfoBySfut", function (data) {
                if (data) {
                    var return_result = data.root.return_result;
                    if (return_result == '100') {
                        photourl = data.root.photourl;
                        mobilephone = data.root.mobilephone;
                        username = data.root.username;
                        userid = data.root.userid;
                        if (username == '') {
                            $('#username').html("&nbsp;");
                        } else {
                            $('#username').html(username);
                        }
                        $('#userphoto').html('<img src="' + photourl + '" width="50" height="50px">');
                        isvalid = data.root.isvalid;
                        if (isvalid == '1') {
                            mphone = mobilephone.substr(3, 4);
                            mobilephone = mobilephone.replace(mphone, "****");
                            $('#phone').html(mobilephone);
                        } else {
                            $('#phone').html('手机号未认证 <div style="position:relative"><a class="btngray ablack2" href="/user.d?m=phonepage&city=' + vars.paramcity + '&mstype=bindphone" style="height:24px; line-height:24px; z-index:10; position:absolute; top:-25px; left:100px">去认证</a></div>');
                        }
                    }
                    if (userid && mobilephone) {
                        if (e == '2') {
                            window.location.href = "/xf/" + vars.paramcity + "/huXingComment/" + vars.paramId + "_" + vars.paramhxid + ".html";
                            return;
                        }
                    } else if (!userid) {
                        alert("请登录后点评！");
                        window.location.href = 'https://m.fang.com/passport/login.aspx?burl=' + vars.mainSite + 'xf/' + vars.paramcity + '/huXingComment/' + vars.paramId + '_' + vars.paramhxid + '.html';
                        return;
                    } else if (userphone == null || userphone == '') {
                        alert("只有手机验证用户才可以发表楼盘点评哦，先去验证吧");
                        window.location.href = "/user.d?m=phonepage&city=" + vars.paramcity + "&mstype=bindphone&burl=" + vars.mainSite + 'xf/' + vars.paramcity + '/huXingComment/' + vars.paramId + '_' + vars.paramhxid + '.html';
                        return;
                    }
                }
            });
        } else {
            //去登陆
            window.location.href = 'https://m.fang.com/passport/login.aspx?burl=' + vars.mainSite + "xf/" + vars.paramcity + "/houseComment/" + vars.paramId + ".html";
        }
    }
    //点评赚积分------------------end

    //滚动到页面底部时，自动加载更多
    function debounce(func, wait, immediate) {
        var timeout;
        return function () {
            var context = this, args = arguments;
            var later = function () {
                timeout = null;
                if (!immediate) {
                    func.apply(context, args);
                }
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) {
                func.apply(context, args);
            }
        };
    }
    // 用法
    var myEfficientFn = debounce(function () {
        // 所有繁重的操作
        if (!canLoad)return;
        var scrollh = $(document).height();
        var bua = navigator.userAgent.toLowerCase();
        if (bua.indexOf('iphone') != -1 || bua.indexOf('ios') != -1) {
            scrollh = scrollh - 140;
        } else {
            scrollh = scrollh - 80;
        }
        var c = document.documentElement.clientHeight || document.body.clientHeight, t = $(document).scrollTop();
        if (k != false && ($(document).scrollTop() + w.height()) >= scrollh) {
            var str = $("a.hengrui").attr("name");
            load(str);
        }
    }, 250);

    window.addEventListener('scroll', myEfficientFn);

    module.exports = {
        init: function () {
            click();
            //调用需要刷新的点击事件
            ajaxfresh();
        }
    };

    // 分享功能新
    $('.icon-share').addClass('share');
    var SuperShare = require('superShare/1.0.1/superShare');
    var config = {
        // 分享内容的title
        title: $('.bgproname').html() + '怎么样',
        // 分享时的图标
        image: $('.bgpic').html().trim(),
        // 分享内容的详细描述
        desc: '综合评分：' +  $('.bgscore').html() + '分\n' + '共' + $('.bgcount').html() + '条评论',
        // 分享的链接地址
        url: location.href,
        // 分享的内容来源
        from: 'xf'
    };
    var superShare = new SuperShare(config);

	// 点击小编回复下拉箭头
	var xbhfXialaClick = function (obj) {
		obj.on('click', function () {
			var $this = $(this);
			var $commentXbhfText = $this.siblings('.comment-xbhf-text');
			$commentXbhfText.css('max-height', 'none');
			$this.addClass('none');
		})
	};
	// 新增小编回复
	var xbhfPanduan = function () {
		$('.comment-xbhf').each(function () {
			var $this = $(this);
			if (!$this.attr('yipanduan')) {
				$this.attr('yipanduan', true);
				var xbhfPHei = $this.find('p').height(),
					commentXbhfText = $this.find('.comment-xbhf-text').height();
				// 小编回复内容超过了框，显示下拉箭头
				if (xbhfPHei > commentXbhfText) {
					$this.find('.comment-more').show();
					xbhfXialaClick($this.find('.comment-more'));
				}
			}
		});
	};
	xbhfPanduan();
});