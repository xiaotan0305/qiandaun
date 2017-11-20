define('modules/xf/xflisthb', ['jquery', 'util/util', 'lazyload/1.9.1/lazyload', 'modules/xf/topoflist', 'modules/xf/feet', 'footprint/1.0.0/footprint', 'iscroll/2.0.0/iscroll-lite', 'slideFilterBox/1.0.0/slideFilterBox'], function (require, exports, module) {
    'use strict';
    var $ = require('jquery');
    var cookiefile = require('util/util');
    var vars = seajs.data.vars;
    var sfut = cookiefile.getCookie('sfut');
//    var localStorage = vars.localStorage;

    require('modules/xf/topoflist');
    require('modules/xf/feet');

    var IScrolllist = require('iscroll/2.0.0/iscroll-lite');
    var IScroll = require('slideFilterBox/1.0.0/slideFilterBox');

    var redbagIndex = localStorage.getItem("xfRedFlag") == null ? "" : localStorage.getItem("xfRedFlag");
    if (!redbagIndex) {
        localStorage.setItem("xfRedFlag", 1);
        $(".hb-out").show();
    }
    $('#hideHongBao').on('click', function () {
        hideHongBao();
    });
    function hideHongBao() {
        $(".hb-out").hide();
    }

    function lazyload() {
        require.async("lazyload/1.9.1/lazyload", function ($) {
            $("img[data-original]").lazyload();
        });
    }

    var Footprint = require('footprint/1.0.0/footprint');
    Footprint.push('新房楼盘', 'http://m.fang.com/xf/' + vars.paramcity + '/', vars.paramcity);

    // 统计行为 --------------start
    require.async('http://js.ub.fang.com/_ubm.js', function () {
        yhxw();
    });
    require.async('http://clickm.soufun.com/click/new/clickm.js', function () {
        Clickstat.eventAdd(window, 'load', function (e) {
            Clickstat.batchEvent('wapxfsy_', vars.paramcity);
        });
    });
    Date.prototype.format = function (fmt) {
        var o = {
            'M+': this.getMonth() + 1,                 // 月份
            'd+': this.getDate(),                    // 日
            'h+': this.getHours(),                   // 小时
            'm+': this.getMinutes(),                 // 分
            's+': this.getSeconds(),                 // 秒
            'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
            'S': this.getMilliseconds()             // 毫秒
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp('(' + k + ')').test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
            return fmt;
        }
        ;
    };
    function yhxw() {
        _ub.city = vars.ubcity;
        _ub.biz = 'n'; // 业务---WAP端
        _ub.location = vars.ublocation;// 方位（南北方) ，北方为0，南方为1
        var b = 1; // 用户动作（浏览0、搜索1、打电话31、即时通讯24、预约25）
        var myDate = new Date();
        var saleDate1 = '';
        if (vars.ubsaleDate) {
            if (vars.ubsaleDate == 0) {
                myDate.setDate(1);
                var cMonth = myDate.getMonth();
                var nMonth = ++cMonth;
                var nMonthDayOne = new Date(myDate.getFullYear(), nMonth, 1);
                var OTime = 1000 * 60 * 60 * 24;
                saleDate1 = myDate.format('yyyyMMdd') + '-' + new Date(nMonthDayOne.getTime() - OTime).format('yyyyMMdd');
            } else if (vars.ubsaleDate == 1) {
                var cMonth = myDate.getMonth();
                var nMonthDayOne = new Date(myDate.getFullYear(), cMonth + 1, 1);
                var OTime = 1000 * 60 * 60 * 24;
                saleDate1 = nMonthDayOne.format('yyyyMMdd') + '-' + new Date(new Date(myDate.getFullYear(), cMonth + 2, 1).getTime() - OTime).format('yyyyMMdd');
            } else if (vars.ubsaleDate == 2) {
                myDate.setDate(1);
                var cMonth = myDate.getMonth();
                var nMonthDayOne = new Date(myDate.getFullYear(), cMonth + 3, 1);
                var OTime = 1000 * 60 * 60 * 24;
                saleDate1 = myDate.format('yyyyMMdd') + '-' + new Date(nMonthDayOne.getTime() - OTime).format('yyyyMMdd');
            } else if (vars.ubsaleDate == 3) {
                myDate.setDate(1);
                var cMonth = myDate.getMonth();
                var nMonthDayOne = new Date(myDate.getFullYear(), cMonth + 6, 1);
                var OTime = 1000 * 60 * 60 * 24;
                saleDate1 = myDate.format('yyyyMMdd') + '-' + new Date(nMonthDayOne.getTime() - OTime).format('yyyyMMdd');
            } else if (vars.ubsaleDate == 4) {
                var cMonth = myDate.getMonth();
                var nMonthDayOne = new Date(myDate.getFullYear(), cMonth - 3, 1);
                var OTime = 1000 * 60 * 60 * 24;
                saleDate1 = nMonthDayOne.format('yyyyMMdd') + '-' + new Date(new Date(myDate.getFullYear(), cMonth, 1).getTime() - OTime).format('yyyyMMdd');
            } else if (vars.ubsaleDate == 5) {
                var cMonth = myDate.getMonth();
                var nMonthDayOne = new Date(myDate.getFullYear(), cMonth - 6, 1);
                var OTime = 1000 * 60 * 60 * 24;
                saleDate1 = nMonthDayOne.format('yyyyMMdd') + '-' + new Date(new Date(myDate.getFullYear(), cMonth, 1).getTime() - OTime).format('yyyyMMdd');
            }
        }
        var distRail = '';
        if (!vars.paramdistrict && !vars.paramrailway) {
            distRail = '';
        } else {
            distRail = encodeURIComponent(vars.paramdistrict ? vars.paramdistrict : vars.paramrailway) + '^' + encodeURIComponent(vars.paramdistrict ? vars.paramrailwaystation : vars.paramcomarea) + '^' + vars.paramdistrict ? 1 : 0;
        }

        var danjia = vars.ubprice;
        if (vars.ubpricesplitesize == 'true') {
            danjia = vars.ubprice0;
        }

        var px = '';
        if (vars.uborderby == '0') {
            px = '价格由高到低';
        } else if (vars.uborderby == '1') {
            px = '价格由低到高';
        }
        else if ('2' == '2') {
            px = '开盘时间由近到远';
        }
        else if (vars.uborderby == '3') {
            px = '开盘时间由远到近';
        }
        else if (vars.uborderby == '4') {
            px = '入住时间由近到远';
        } else if (vars.uborderby == '5') {
            px = '入住时间由远到近';
        }
        var p_temp = {
            'mn7': encodeURIComponent(vars.paramkeyword),    //关键字
            'mn9': distRail,        //首要搜索条件
            'mn5': encodeURIComponent(vars.parampurpose),    //类别
            'mn3': encodeURIComponent(vars.paramcharacter),    //热门
            'mn2': encodeURIComponent(vars.paramround),        //环线
            'mnx': saleDate1,    //开盘时间段
            'mnz': encodeURIComponent(px),    //排序
            'mny': encodeURIComponent(vars.paramfitment),    //装修
            'mna': encodeURIComponent(vars.paramdistrict) + vars.judge1 + encodeURIComponent(vars.paramcomarea) + vars.judge1 + danjia,    //区县+商圈+价格区间
            'mnp': danjia + vars.price ? '' : '^' + encodeURIComponent(vars.price ? '' : '元/平方米'),      //单价
            'mp3': 'n'						//关注的业务
        };// 用户行为(格式：'字段编号':'值')
        var p = {};
        //若p_temp中属性为空或者无效，则不传入p中
        for (var temp in p_temp) {
            if (p_temp[temp] != null && '' != p_temp[temp] && undefined != p_temp[temp] && 'undefined' != p_temp[temp]) {
                p[temp] = p_temp[temp];
            }
        }

        _ub.collect(b, p); // 收集方法
    }

    //统计行为 --------------end

    function goPrice(e) {
        var tags = $('#inputtags').val();
        var query = $('#inputquery').val();
        var userdefinedprice = $('#userdefinedprice').val();
        var userPrice = 1000;
        if (userdefinedprice < 0) {
            userPrice = 10000;
        }

        var pricemin = $('#pricemin').val(), pricemax = $('#pricemax').val();
        var re = new RegExp(/^(\d+)$|^(\d+\.\d+)$/);
        if (!re.test(pricemin) || !re.test(pricemax)) {
            alert('请输入正确的价格');
            return false;
        } else if (Number(pricemin) >= Number(pricemax)) {
            var tempPrice;
            tempPrice = pricemin;
            pricemin = pricemax;
            pricemax = tempPrice;
        }

        if (Number(pricemin) == 0 && Number(pricemax) == 0) {
            window.location.href = '/xf/' + vars.paramcity + vars.district + vars.character + vars.purpose + vars.saleDate + vars.orderby + vars.round + vars.fitment + vars.railway + vars.comarea + vars.station + '/' + tags + query;
        } else {
            window.location.href = '/xf/' + vars.paramcity + vars.district + '/pr' + pricemin * userPrice + ',' + pricemax * userPrice + vars.character + vars.purpose + vars.saleDate + vars.orderby + vars.round + vars.fitment + vars.railway + vars.comarea + vars.station + '/' + tags + query;
        }
        e.stopPropagation();
    }

    function hideChioce() {
        $('#sift').attr('class', '');
        var a = $('.lbTab').children();
        for (var i = 1; i < a.size(); i++) {
            a.eq(i).hide();
        }
    }

    function hideActive() {
        var a = $('ul.flexbox').children();
        for (var i = 0; i < a.size(); i++) {
            a.eq(i).attr('class', '');
        }
    }

    function cleanAllChioce() {
        $('#wapxfsy_D02_01').find('span').html('位置');
        $('#wapxfsy_D02_02').find('span').html('价格');
        $('#wapxfsy_D02_03').find('span').html('热门');
        changeFlag = 1;
        var a = $('span.rt');
        for (var i = 0; i < a.size(); i++) {
            a.eq(i).text('不限');
        }
        $('#districtTh').attr('value', '');
        $('#subwayTh').attr('value', '');
        var b = $('dl.all').children();
        for (var i = 0; i < b.size(); i++) {
            b.eq(i).attr('value', '');
        }
    }

    function hideAllOut() {
        var a = $('#allOut').children();
        for (var i = 0; i < a.size(); i++) {
            a.eq(i).hide();
        }
    }

    var district = $('#districtChange').val(),
        price = $('#priceChange').val(),
        railway = $('#railwayChange').val(),
        character = $('#characterChange').val(),
        comarea = $('#comareaChange').val(),
        station = $('#stationChange').val(),
        xq = $('#xqChange').val(),
        tags = vars.paramtags,
        changeFlag = 0;

    function checkLocation() {
        if (changeFlag != 0) {
            district = '', price = '', railway = '', character = '', xq = '', station = '', comarea = '', tags = '';
        }
        var a = $("[name*='purposeTw']").attr('value'),
            saleDate = $("[name*='saleDateTw']").attr('value'),
            orderby = $("[name*='orderbyTw']").attr('value'),
            round = $("[name*='roundTw']").attr('value'),
            fitment = $("[name*='fitmentTw']").attr('value');
        if (typeof(round) == 'undefined') round = '';
        var f = (price == '' ? 0 : 1) + (railway == '' ? 0 : 1) + (character == '' ? 0 : 1) + (xq == '' ? 0 : 1) + (station == '' ? 0 : 1) + (comarea == '' ? 0 : 1) + (a == '' ? 0 : 1) + (orderby == '' ? 0 : 1) + (saleDate == '' ? 0 : 1) + (round == '' ? 0 : 1) + (fitment == '' ? 0 : 1);
        var flag = '';
        if (f != 0) {
            flag = '/';
        }
        var b = '/xf/' + vars.paramcity + district + '/' + price + character + a + saleDate + orderby + round + xq + fitment + railway + station + comarea + flag + "?red=hb";

        window.location.href = b;
    }

    function unable() {
        document.addEventListener('touchmove', preventDefault);
    }

    function preventDefault(e) {
        e.preventDefault();
    }

    function enable() {
        document.removeEventListener('touchmove', preventDefault);
    }

    function xfTongji(housefrom, city, newcode) {
        $.ajax({
            url: '/data.d?m=houseinfotj&type=click&housefrom=' + housefrom + '&city=' + city + '&housetype=xf&newcode=' + newcode + '&channel=waphouselist',
            async: false
        });
    }

    //点评里的星星------------------------start
    function icostar() {
        $('.ico-star').each(function () {
            var curStars = $(this).attr('star');
            if (curStars.indexOf('.1') > 0 || curStars.indexOf('.2') > 0 || curStars.indexOf('.3') > 0) {
                curStars = Math.floor(curStars);
                for (var i = 0; i <= curStars - 1; i++) {
                    $(this).find('i').eq(i).attr('class', 'active');
                }
            } else if (curStars.indexOf('.8') > 0 || curStars.indexOf('.9') > 0 || curStars.indexOf('.0') > 0) {
                curStars = Math.ceil(curStars);
                for (var i = 0; i <= curStars - 1; i++) {
                    $(this).find('i').eq(i).attr('class', 'active');
                }
            } else if (curStars.indexOf('.4') > 0 || curStars.indexOf('.5') > 0 || curStars.indexOf('.6') > 0 || curStars.indexOf('.7') > 0 || curStars.indexOf('.8') > 0) {
                curStars = curStars.substring(0, 1) + '.5';
                for (var i = 0; i <= curStars; i++) {
                    if (i + 1 > curStars) {
                        $(this).find('i').eq(i).attr('class', 'active half');
                    } else {
                        $(this).find('i').eq(i).attr('class', 'active');
                    }
                }
            }
        });
    }

    //点评里的星星------------------------end

    //最下面的导航-------------satrt
    var Navigation = ['gfzn', 'zbcs', 'qxdh', 'rmsq', 'rmxq'];

    function bottomNavigation() {
        $.each(Navigation, function (i, val) {
            $('#' + val).click(function () {
                showSeo(val);
            });
        });
    }

    function showSeo(str) {
        var seo = $('.seo');
        seo.find('div').children().children().attr('class', '');
        $('#' + str).attr('class', 'active');
        seo.find('ul').hide();
        $('.' + str).show();
    }

    //最下面的导航-------------end

    var schoolcpnum = 1;

    function moreschool(city, district, seitem) {
        var querystr_before = '/xf/' + vars.paramcity + vars.district + vars.price + vars.character + vars.purpose + vars.saleDate + vars.orderby + vars.round;
        var querystr_after = '${fitment}${comarea}/?red=hb';
        $.post('/xf.d?m=schoollist&type=lp&city=' + city + '&district=' + district + '&p=' + schoolcpnum + '&seitem=' + seitem + '&querystr_before=' + querystr_before + '&querystr_after=' + querystr_after,
            function (data) {
                $('#xqfitem').append(data);
                schoolcpnum = schoolcpnum + 1;
                IScroll.refresh("#xqfChioce", "stand");
            });
    }

    $('#moreschool').on('click', function () {
        moreschool(vars.paramcity, vars.paramdistrict, vars.paramxq);
    });


    var total = $('#totalpage').html();
    var k = true;
    var w = $(window);
    var curp = 2;
    $('body').scrollTop(1);
    if (total <= 1) {
        $('#drag').hide();
        k = false;
    }

    //滚动到页面底部时，自动加载更多
    var scrollFlag = false;
    window.addEventListener('scroll', function scrollHandler() {
        var scrollh = $(document).height();
        var bua = navigator.userAgent.toLowerCase();
        if (scrollFlag) {
            if (bua.indexOf('iphone') != -1 || bua.indexOf('ios') != -1) {
                scrollh = scrollh - 140;
            } else {
                scrollh = scrollh - 80;
            }
        }
        var c = document.documentElement.clientHeight || document.body.clientHeight, t = $(document).scrollTop();
        if (k != false && ($(document).scrollTop() + w.height()) >= scrollh) {
            load();
        }
    });
    var judgeload = true;

    function load() {
        if (judgeload) {
            judgeload = false;
            var draginner = $('.draginner')[0];
            var total = $('#totalpage').html();
            k = false;
            $('.draginner').css('padding-left', '10px');
            draginner.style.background = 'url(' + vars.ftppath + 'touch/img/load.gif) 20px 50% no-repeat';
            draginner.innerHTML = '正在加载...';
            var city = vars.paramcity;
            var district = vars.loaddistrict;
            var price = vars.loadprice;
            var comarea = vars.loadcomarea;
            var purpose = vars.loadpurpose;
            var orderby = vars.loadorderby;
            var railway = vars.loadrailway;
            var character = vars.loadcharacter;
            var fitment = vars.loadfitment;
            var round = vars.loadround;
            var keyword = vars.loadkeyword;
            var saleDate = vars.loadsaleDate;
            var yhtype = vars.loadyhtype;
            var xq = vars.loadxq;
            var tags = vars.loadtags;
            $.post('/xf.d?m=xflist&city=' + city + '&district=' + district + '&price=' + price + '&comarea=' + comarea + '&purpose=' + purpose + '&orderby=' + orderby + '&railway=' + railway + '&character=' + character + '&xq=' + xq + '&fitment=' + fitment + '&round=' + round + '&keyword=' + keyword + '&saleDate=' + saleDate + '&yhtype=' + yhtype + '&datatype=json&p=' + curp + '&tags=' + tags + '&red=hb',
                function (data) {
                    $('#xfContentList').append(data);
                    $('.draginner').css('padding-left', '0px');
                    draginner.style.background = '';
                    draginner.innerHTML = '查看更多楼盘';
                    curp = curp + 1;
                    k = true;
                    if (curp > parseInt(total)) {
                        $('#drag').hide();
                        k = false;
                    }
                    lazyload();
                    zhiyeguwen();
                    icostar();
                    xftongji();
                    dragclick();
                    judgeload = true;
                });
        }
    };
    function xftongji() {
        $("[name*='xfTongji']").each(function (i) {
            $(this).click(function () {
                //点击时背景样式
                $(this).css('background', '#f4f4f4');
                settimeout($(this).css('background', ''), 500);
                var judge = $(this).attr('data-judge');
                var list = $(this).attr('data-list');
                if (judge == '1') {
                    xfTongji('ad', vars.paramcity, list);
                } else {
                    xfTongji('', vars.paramcity, list);
                }
            });
        });
        //点击时背景样式
        $("[name*='xfTongji']").bind('touchstart', function () {
            var $this = $(this);
            $this.css('background', '#f4f4f4');
            setTimeout(function () {
                $this.css('background', '#ffffff');
            }, 100);
        });

        //如果只显示online按钮，则将其位置放置左边3px处
        $("[name*='xfTongji'] .img").each(function () {
            if ($(this).children('span').length === 1 && $(this).children('span').hasClass('online')) {
                $(this).children('span').css('left', '3px');
            }
        });
    }

    //置业顾问----------------------start
    function zhiyeguwen() {
        var agent_names = '';
        $('.online').each(function (i) {
            var agent_name2 = $(this).attr('id');
            if (agent_name2.indexOf('置业顾问') >= 0) {
                agent_name2 = agent_name2.replace(agent_name2.substring(0, (agent_name2.indexOf('置业顾问') + 4)), '');
            }
            if (agent_names.indexOf(agent_name2) < 0) {
                agent_names += agent_name2 + '$';
            }
        });
        if (agent_names != '') {
            agent_names = agent_names.substring(0, (agent_names.length - 1));
        }
        ;
        var online_uname = '';
        $.ajax({
            url: '/chat.d?m=xfonline&username=' + encodeURIComponent(encodeURIComponent(agent_names)),
            dataType: 'json',
            async: true,
            success: function (data) {
                online_uname = data.root.username;
                if (online_uname != '') {
                    $('.online').each(function (m) {
                        var agent_name_ = $(this).attr('id');
                        if (agent_name_.indexOf('置业顾问') >= 0) {
                            agent_name_ = agent_name_.replace(agent_name_.substring(0, (agent_name_.indexOf('置业顾问') + 4)), '');
                        }
                        if (agent_name_ != '') {
                            var agent_name_a = agent_name_.split('$');
                            var agent_name_a_l = agent_name_a.length;
                            for (var a = 0; a < agent_name_a_l; a++) {
                                if (online_uname.indexOf(agent_name_a[a]) >= 0) {
                                    $(this).show();
                                    break;
                                }
                            }
                        }
                    });
                }
            }
        });
    }

    //置业顾问----------------------end

    //滑动效果  ----------start
    function slide() {
        var l = 0, leng = 0, nowL = 0, paddingleft = 10;
        var aArr = $('#scroller a');
        var $window = $(window);
        aArr.each(function (index) {
            var $this = $(this);
            leng += $this.outerWidth(true);
            if ($this.hasClass('active')) {
                l = index;
            }
        });
        leng += paddingleft;
        if (leng > $window.width()) {
            /* nowL=aArr.eq(l).offset().left-paddingleft; */

            for (var i = 0; i < l; i++) {
                nowL += aArr.eq(i).width() + 26;
            }
            if (nowL > (leng - $(window).width())) {
                nowL = leng - $(window).width();
            }

            $('#scroller').width(leng);
            var myscroll = new IScrolllist('#wrapper', {scrollX: true, bindToWrapper: true, eventPassthrough: true});
        }
    }

    //滑动效果  ----------end


    //click-------------------------------------start
    function click() {
        //价格自定义
        $('#priceFormatUrl').on('mousedown', function (event) {
            goPrice(event);
        });


        var showflag = '1';
        $("[name*='ide']").click(function () {
            var a = $(this).attr('class') == null ? '' : $(this).attr('class');
            var b = $(this).attr('name').split(' ')[0];
            if (a.indexOf('active') < 0) {
                hideActive();
                $(this).attr('class', 'active');
                hideChioce();
                $('.' + b).show();
                if (b == 'allChioce') {
                    b = 'moreChoo';
                    $('#allIn').show();
                }
                $('#sift').attr('class', 'tabSX');
                IScroll.refresh('#' + b);


                if (showflag == '1') {
                    if (vars.paramxq) {
                        $('#xqfChioce').show();
                        IScroll.refresh('#xqfChioce');
                    } else {
                        if (vars.paramdistrict) {
                            $('#districtChioce').show();
                            IScroll.refresh('#districtChioce');
                        }
                        if (vars.paramcomarea) {
                            $('#districts' + vars.getIdxfdistrict).show();
                            IScroll.refresh('#districts' + vars.getIdxfdistrict);
                        }

                        if (vars.paramrailway) {
                            $('#subwayChioce').show();
                            IScroll.refresh('#subwayChioce');
                        }
                        if (vars.paramrailwaystation && vars.paramrailwaystation != '#sift') {
                            var ele = $('[name*=' + vars.paramrailway + vars.paramrailwaystation + ']').parent().parent();
                            var id = $(ele).attr('id');
                            $(ele).show();
                            IScroll.refresh('#' + id);
                        }
                    }
                    showflag = '0';
                }
                unable();
            } else {
                $(this).attr('class', '');
                hideAllOut();
                hideChioce();
                window.location.href = '#sift';
                $('.float').hide();
                enable();
            }
            ;
        });

        $('.float').click(function () {
            $("[name*='ide']").removeClass();
            hideAllOut();
            hideChioce();
            $(this).hide();
            enable();
        });
        $('.btnBack').click(function () {
            hideAllOut();
            $('#allIn').show();
        });
        $("[name*='neIde']").each(function (i) {
            $(this).click(function () {
                $('.stations').hide();
                $('.districts').hide();
                $('#xqfChioce').hide();

                var a = $(this).attr('name').split(' ')[0];
                $('#' + a).show();
                if (a == 'districtChioce') {
                    $('#subwayChioce').hide();
                    $('#xqfChioce').hide();
                }
                if (a == 'subwayChioce') {
                    $('#districtChioce').hide();
                    $('#xqfChioce').hide();
                }
                if (a == 'xqfChioce') {
                    $('#districtChioce').hide();
                    $('#subwayChioce').hide();
                }

                IScroll.refresh('#' + a);
                unable();
            });
        });
        $("[name*='twIde']").each(function (i) {
            $(this).click(function () {
                var a = $(this).attr('name').split(' ')[0];
                $('#allIn').hide();
                hideAllOut();
                $('#' + a).show().prev().show();
                $('.btnBack').show();
                IScroll.refresh('#' + a);
                unable();
            });
        });
        $('#allOut').find('dd').each(function (i) {
            var a = $(this).parent().parent().attr('id');
            var b = $(this).attr('class') == null ? '' : $(this).attr('class');
            if (b.indexOf('active') != -1) {
                $("[name*='" + a + "']").attr('value', $(this).attr('value'));
            }
            $(this).click(function () {
                $("[name*='" + a + "']").attr('value', $(this).attr('value')).find('span').text($(this).text());
                $(this).parent().find('dd.active').attr('class', '');
                $(this).attr('class', 'active');
                hideAllOut();
                $('#allIn').show();
            });
        });
        $("[name*='thIde']").each(function (i) {
            $(this).click(function () {
                var a = $(this).attr('name').split(' ')[0];
                $('#allIn').hide();
                hideAllOut();
                $('#ccRes').show();
                $('#' + a).show();
            });
        });
        //新增地铁站点
        $("[name*='stations']").each(function (i) {
            $(this).click(function () {
                var a = $(this).attr('str');
                $("[name*='stations']").attr('class', '');
                $(this).attr('class', 'active');
                $('.stations').hide();
                $('#' + a).show();
                IScroll.refresh('#' + a);
                unable();
            });
        });

        //新增商圈
        $("[name*='districts']").each(function (i) {
            $(this).click(function () {
                var a = $(this).attr('str');
                $("[name*='districts']").attr('class', '');
                $(this).attr('class', 'active');
                $('.districts').hide();
                $('#' + a).show();
                IScroll.refresh('#' + a);
                unable();
            });
        });

        $('#chongzhi').click(function () {
            cleanAllChioce();
        });
        $('#shaixuan').click(function () {
            checkLocation();
        });
        //新房统计

        //统计
        $("input[name='tongjihidden']").each(function (i) {
            var showurl = $(this).val();
            var getWirelessCode = $(this).attr('data-name');
            var image = new Image();
            image.src = 'http://client.3g.fang.com/http/sfservice.jsp?' + showurl + '&wirelesscode=' + getWirelessCode + '&imei=' + cookiefile.getCookie('global_cookie');
            image.display = 'none';
        });


        $('#hideHongBao').click(function () {
            $('.hb-out').hide();
        });

    }

    function dragclick() {
        $('#drag').one('click', function () {
            load();
        });
    }

    //click-------------------------------------end
    // 懒加载-----
    lazyload();
    //置业顾问
    zhiyeguwen();
    //控制星星
    icostar();
    //更多下的样式更改   time:2015.10.26 -------------------------------------------start
    var $moreClass = $('.moreChoo');
    var $moreChild = $moreClass.children().eq(0).children();
    //前四个是修改样式，第六个是重置，第七个是确认
    var changeNum = 5;
    for (var i = 0; i < changeNum; i++) {
        (function () {
            var $choseItem = $moreChild.eq(i).find('.chose-item');
            var $clickBtn = $choseItem.find('a');
            var $moretitle = $moreChild.eq(i).find('.moretitle a');
            var $changeSpan = $moretitle.find('span');
            $clickBtn.on('click', function () {
                $clickBtn.removeClass('active');
                $(this).addClass('active');
                $changeSpan.html($(this).html());
                $moretitle.attr('value', $(this).attr('value'));
            });
            $moretitle.on('click', function () {
                if ($(this).attr('class').trim() === 'arr-up') {
                    $choseItem.hide();
                    $moretitle.removeClass().addClass('arr-down');
                } else {
                    $choseItem.show();
                    $moretitle.removeClass().addClass('arr-up');
                }
            });
        })(i);
    }
    //重置------------
    var $resetTest = $moreClass.find('span');
    var $choseItemAll = $('.chose-item');
    $moreClass.find('.btnIn').on('click', function () {
        $resetTest.html('不限');
        $choseItemAll.find('a').removeClass();
        $choseItemAll.find('a:first').addClass('active');
    });
    //确定------------
    $moreClass.next().on('click', function () {
        checkLocation();
    });
    module.exports = {
        init: function () {
            click();
            //底部导航
            bottomNavigation();
            //滑动效果
            slide();

            xftongji();

            dragclick();

            if (vars.esfshowflag != 0 && vars.esfcount > 0 && !vars.paramkeyword) {
                $('.houseList').hide();
            }
        }
    };
});