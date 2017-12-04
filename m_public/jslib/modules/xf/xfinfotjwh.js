define('modules/xf/xfinfotjwh', [
    'jquery',
    'util/util',
    'iscroll/2.0.0/iscroll-lite',
    'superShare/1.0.1/superShare',
    'chart/line/1.0.7/line',
    'modules/xf/shadowCall',
    'swipe/3.10/swiper',
    'app/1.0.0/appdownload',
    'verifycode/1.0.0/verifycode',
    'lazyload/1.9.1/lazyload',
    'modules/xf/workbench',
    'modules/xf/xfactivity',
	'search/newHouse/newHouseSearch',
    'weixin/2.0.0/weixinshare',
    'modules/xf/showBonus'
], function (require, exports, module) {
    'use strict';
    var $ = require('jquery');
    var Util = require('util/util');
    var vars = seajs.data.vars;

	var Search = require('search/newHouse/newHouseSearch');

    var lazy = require('lazyload/1.9.1/lazyload');
    // 懒加载
    lazy('img[data-original]').lazyload();
    var verifycode = require('verifycode/1.0.0/verifycode');
    // 打电话替换
    var shadowCall = require('modules/xf/shadowCall');
    var sfut = Util.getCookie('sfut');
    var IScrolllist = require('iscroll/2.0.0/iscroll-lite');
    
    if(document.referrer.indexOf('baidu.com')>-1){
    $('.topDownload').hide();
    }
    function showOverflow() {
        document.addEventListener('touchmove', preventDefault);
    }

    function hideOverflow() {
        document.removeEventListener('touchmove', preventDefault);
    }

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
    // 电话号码替换
    shadowCall();
    // 统计行为 --------------start
    var ubloaded = false;
    var showlocation;

	// 大首页大搜索执行初始化
	var search = new Search();
	search.init();

    function yhxw() {
        _ub.city = vars.ubcity;
        // 业务---WAP端
        _ub.biz = 'n';
        // 方位（南北方) ，北方为0，南方为1
        _ub.location = vars.ublocation;
        var xfch = vars.ubxfch,
            xfchStr = '';
        for (var i = 0; i < xfch.length; i++) {
            xfchStr += encodeURIComponent(xfch[i]) + (i === xfch.length - 1 ? '' : ',');
        }
        // 用户动作（浏览0、搜索1、打电话31、即时通讯24、预约25、收藏21、分享22）
        var b = 0;
        var prices = '';
        var pricet = '';
        if (vars.ubxfinfoprice === 'true') {
            prices = vars.ubrequestScopexfinfoprice;
        } else if (vars.ubxfinfopricetao === 'true') {
            pricet = vars.ubrequestScopexfinfopricetao;
        }
        var kpsj = vars.ubstarttime;
        // 用户行为(格式：'字段编号':'值')
        var pt = {
            // 楼盘id
            'vmn.projectid': vars.ubhouseid,
            'vmg.page': 'mnhpageproject',
            // 物业类型
            'vmn.genre': encodeURIComponent(vars.ubpurpose),
            // 楼盘特色
            'vmn.feature': xfchStr,
            // 单价范围
            'vmn.avgprice': prices,
            // 总价范围
            'vmn.totalprice': pricet,
            // 商圈
            'vmn.comarea': encodeURIComponent(vars.xfinfocomarea),
            // 区县
            'vmn.district': encodeURIComponent(vars.ubdistrict),
            // 开盘时间
            'vmn.opentime': kpsj,
            // 装修
            'vmn.fixstatus': encodeURIComponent(vars.ubfitment),
            'vmg.sourceapp':vars.is_sfApp_visit + '^xf'
        };
        var p = {};
        // 若pt中属性为空或者无效，则不传入p中
        for (var t in pt) {
            if (pt[t] && pt.hasOwnProperty(t)) {
                p[t] = pt[t];
            }
        }
        // 收集方法
        _ub.collect(b, p);

        _ub.city = vars.ubcity;
        // 参数固定
        _ub.request('vmg.business', true);
        var xfScores = '';
        _ub.onload = function () {

			// 获取新房搜索历史记录中的第一条（关键字或者快筛词），返回带有关键字或者快筛词和快筛词以及两者的搜索时间戳
            var rule = search.getRules(vars.paramcity + 'newXfHistory');

            if (_ub.values['vmg.business'] && !(_ub.values['vmg.business'] instanceof Array)) {
                xfScores = _ub.values['vmg.business'].N;
                _ub.request('vmn.genre,vmn.position');
                return;
            }
            var xfXQ = _ub['vmn.position'];
            var xfWY = _ub['vmn.genre'];
			// 取猜你喜欢ajax数据,前端展示数据
			var ajaxData = $.extend({
				XQ: xfXQ,
                xfWY: xfWY,
                xfScores: xfScores,
                city: vars.ubcurCity,
                id: vars.paramid
			}, rule);

			//获取cookie
			function getCookie(cname) {
				var name = cname + "=";
				var ca = document.cookie.split(';');
				for(var i=0; i<ca.length; i++) {
					var c = ca[i];
					while (c.charAt(0)==' ') c = c.substring(1);
					if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
				}
				return "";
			}

            $.post('/xf.d?m=xiHuanLouPanList&math=' + Math.random(), ajaxData, function (result) {
                if ($.trim(result)) {
                    $('#ganxingqulp').html(result);
                    $('#gxqlp').show();
                    $('.xfTongji').click(function () {
                        var newcode = $(this).attr('data-value');
                        xfTongji(vars.paramcity, newcode);
                    });

                    /*
                     *热门楼盘(2016年5月12日)
                     */
                    var imgWidth = ($(window).width() - 30) / 2.5;
                    var imgHeight = imgWidth / 120 * 80;
                    $('#ganxingqulp img').width(imgWidth);
                    $('#ganxingqulp h3').width(imgWidth);
                    $('#ganxingqulp img').height(imgHeight);
                    var gfTagHei = $('.gf-tag').height();
                    $('.gf-tag').height(imgHeight < gfTagHei ? gfTagHei : imgHeight);
                    // ul宽度初始化
                    var clearfixWidth = 15;
                    // 计算ul宽度
                    $('#ganxingqulp li').each(function () {
                        var $this = $(this);
                        clearfixWidth += $this.width() + parseInt($this.css('margin-right'));
                    });
                    // 设置ul宽度
                    $('#ganxingqulp').width(clearfixWidth);
                    // 设置可滑动
                    new IScrolllist('.xqFav', {scrollX: true, bindToWrapper: true, eventPassthrough: true});

					// 猜你喜欢
					$('.adlike a').each(function () {
						var $this = $(this);
						$this.on('click', function () {
							location.href = $this.attr('data-href') + '?mtjf_uuid=click_wap_' + vars.paramcity + '_xfinfo_maylike_' + ($this.parent().index() + 1) + '_'
								+ $this.parent().attr('data-adplanid') + '_' + $this.parent().attr('data-newcode') + '_'
								+ getCookie('global_cookie') + '_' + (userid || '');
						});
					})
                }
            });
        };
        // 查看浏览位置统计(初始化)
        showlocationtj();
        ubloaded = true;
    }

    // 查看浏览位置统计(初始化、点击、滑动)
    function showlocationtj() {
        showlocation = $('.tabNav .active span').html();
        _ub.collect(0, {
            // 浏览位置
            'vmn.showlocation': encodeURIComponent(showlocation)
        });
    }

    // 查看更多统计(直销专用)
    function lookMoretj() {
        _ub.collect(134, {
            // 所属页面
            'vmg.page': 'mnhpageproject',
            // 楼盘id
            'vmn.projectid': vars.paramid
        });
    }

    // 报名看房团统计
    function bmkfttj(name, number, phone, seehouseline) {
        _ub.collect(33, {
            // 所属页面
            'vmg.page': 'mnhpageproject',
            // 姓名
            'vmn.name': encodeURIComponent(name),
            // 人数
            'vmn.number': encodeURIComponent(number),
            // 手机号
            'vmn.phone': phone,
            // 看房团路线
            'vmn.seehouseline': encodeURIComponent(seehouseline),
            // 楼盘id
            'vmn.projectid': vars.paramid
        });
    }

    // 领红包统计
    function lhbtj() {
        _ub.collect(10, {
            // 所属页面
            'vmg.page': 'mnhpageproject',
            // 楼盘id
            'vmn.projectid': vars.paramid
        });
    }

    // 领红包统计
    $('.hb-list li').on('click', function () {
        lhbtj();
    });

    require.async('jsub/_vb.js?c=mnhpageproject');
    require.async('jsub/_ubm.js?_2017102307fdsfsdfdsd', function () {
        yhxw();
    });
    // 统计行为 --------------end

    var $msTip1 = $('.msTip1');
    var $sfhongbao = $('.sf-hongbao');
    var $xfmiaosha = $('#xfmiaosha');
    var $msTip2 = $('.msTip2');
    var $msTip4 = $('.msTip4');
    var $msTip3 = $('.msTip3');
    var $msTip5 = $('.msTip5');
    var timeCount = '';
    var flag = 1;
    var ingflag = 0;
    var day = '';
    var hour = '';
    var minute = '';
    var second = '';
    var showtype = '';
    var timer = '';
    var nowtime = '';
    var now = '';
    var nowmilliontimes = '';
    var passport;
    var spiketime = '';
    var oDate = '';
    var $signupnum = $('#signupnum');
    var $timeblock = $('#timeblock');
    var $signupblock = $('#signupblock');
    var $msingblock = $('#msingblock');
    var $mssignuped = $('#mssignuped');

    var miaoshahiddenjudge = true;
    // 加载红包和秒杀-------------------------------------------------------start
    function timeoutTask() {
        $('#xfmiaosha,.sf-hongbao,.msTip2,.msTip3').hide();
        $('.msTip1').attr('style', 'position:fixed; z-index: 999; width: 100%;');
        $('.msTip1,.msTip4,.msTip5').show();
    }


    /**
     * @description 楼盘价格走势图效果
     */
    var $zstName = $('.zstName').find('span');
    var newCode = vars.paramid;
    var district = vars.districtMatch;
    var city = vars.paramcity;
    $.get('/xf.d?m=getLouPanZouShiData&city=' + city + '&newCode=' + newCode + '&district=' + district,
        function (data) {
            if (data.root && data.root.month && data.root.newCodePrice && data.root.districtPrice && data.root.cityPrice) {
                var month = data.root.month.split(',');
                var trendDatas = [],
                    getDatas = [];
                // newCodePrice  districtPrice  cityPrice
                // 楼盘数据小于12时
                var loupanArray = data.root.newCodePrice.split(',');
                var tmparr = loupanArray.reverse();
                var newarr = new Array(month.length);
                for (var i = 0; i < month.length; i++) {
                    newarr[i] = tmparr[i] || '';
                }
                newarr = newarr.reverse();
                getDatas.push(newarr);
                getDatas.push(data.root.districtPrice.split(',').splice(0, month.length));
                getDatas.push(data.root.cityPrice.split(',').splice(0, month.length));
                var color = ['#ff6666', '#ff9900', '#a6b5ee'];
                for (var i = 0; i < getDatas.length; i++) {
                    var getData = {};
                    // 不为空数组
                    if (getDatas[i].length > 1) {
                        getData.yAxis = getDatas[i];
                        getData.color = color[i];
                        trendDatas.push(getData);
                    } else {
                        // 如果没有数据，则把走势图的名称隐藏掉
                        $zstName.eq(i).hide();
                    }
                }
                // 显示走势的DIV
                $('#lpzs').show();
                // 显示房价入口
                $('.lp-icons').show();
                var $span = $('#wapxfxqy_C16_12').siblings('span').eq(0);
                var $fangjia = $('#wapxfxqy_C16_12');
                $span.hide();
                $fangjia.show();

                var LineChart = require('chart/line/1.0.7/line');
                // 画走势图
                var l = new LineChart({
                    id: '#chartCon',
                    height: 200,
                    width: $(window).width(),
                    xAxis: month,
                    data: trendDatas
                });
                // 使走势图滚动到最后一个月位置
                l.run();

                // 为房价走势图添加房价入口
                $('#lpzs .mTitle, #lpzs canvas').on('click', function () {
                    window.location.href = '/xf/' + vars.paramcity + '/' + vars.paramid + '/fangjia.htm';
                });
            }
        });

    var $flextable = $('#flextableID'),
        // 更多详细信息
        $wapxfxqyC0205 = $('.moreMessage'),
        $btnUp = $('#btnUp');

    function getMore() {
        $flextable.show();
        $wapxfxqyC0205.hide();
        $btnUp.show();
    }

    function hideMore() {
        $flextable.hide();
        $btnUp.hide();
        $wapxfxqyC0205.show();
    }

    // 增加开盘通知和降价通知的统计
    var opening = '开盘通知';
    var depreciate = '降价通知';

    function showNotice(info, type) {
        showOverflow();
        if (sfut && userphone) {
            $('.yzm').hide();
            $('.phone').val(userphone);
            $('#rePriceOpen .tz-tit span').text(info + '通知');
            $('.tz-word').text(info + '消息会通过手机短信通知您');
            $('#rePriceOpen').show();
            $('#qd').unbind('click').click(function () {
                var phone = $('.phone').val();
                var phoneFlag = checkPhone(phone);
                if (phoneFlag) {
                    $.get('/xf.d?m=dingyue&mobile=' + phone + '&city=' + vars.paramcity + '&newcode=' + vars.paramid + '&xftype=' + type + '&username=' + username + '&userid=' + userid + '&status=login',
                        function (data) {
                            if (data.root.code === '100') {
                                showMessage('订阅成功');
                                $('.tz-box').hide();
                            } else {
                                showMessage(data.root.message);
                            }
                        });
                    // 增加开盘通知和降价通知的统计
                    var flag = $('#rePriceOpen').find('.tz-tit span').html().trim();
                    if (flag === opening) {
                        kpjjyhtj(74, phone);
                    }
                    if (flag === depreciate) {
                        kpjjyhtj(77, phone);
                    }
                }
                hideOverflow();
            });
        } else {
            //  清空手机号和验证码
            $('.ipt-text').each(function () {
                $(this).val('');
            });
            $('#rePriceOpen .tz-tit span').text(info + '通知');
            $('.tz-word').text(info + '消息会通过手机短信通知您');
            $('#rePriceOpen').show();
            $('#qd').unbind('click').click(function () {
                var phone = $('.phone').val();
                var phoneFlag = checkPhone(phone);
                var vCode = $('.vcode').val();
                var vcodeFlag = checkVcode(vCode);
                if (phoneFlag && vcodeFlag) {
                    verifycode.sendVerifyCodeAnswer(phone, vCode,
                        function () {
                            $.get('/xf.d?m=dingyue&mobile=' + phone + '&city=' + vars.paramcity + '&newcode=' + vars.paramid + '&xftype=' + type,
                                function (data) {
                                    if (data.root.code === '100') {
                                        showMessage('订阅成功');
                                        $('.tz-box').hide();
                                    } else {
                                        showMessage(data.root.message);
                                    }
                                });
                        },
                        function () {
                            // 验证码错误
                            showMessage(' 验证码错误！');
                        });
                    var flag = $('#rePriceOpen').find('.tz-tit span').html().trim();
                    if (flag === opening) {
                        kpjjyhtj(74, phone);
                    }
                    if (flag === depreciate) {
                        kpjjyhtj(77, phone);
                    }
                }
                hideOverflow();
            });
        }
    }

    // 检测手机号是否正确
    function checkPhone(phone) {
        phone = phone || '';
        var phoneReg = /^(13[0-9]|14[0-9]|15[0-9]|18[0-9]|17[0-9])\d{8}$/i;
        if (!phone) {
            showMessage('手机号不能为空');
            getPhoneVcodeclick();
            return false;
        } else if (!phoneReg.test(phone)) {
            showMessage('请输入正确的手机号');
            getPhoneVcodeclick();
            return false;
        } else {
            return true;
        }
    }

    function checkVcode(e) {
        var parttenCheckcode = /^\d{4}$/;
        if (!e) {
            showMessage('验证码不能为空');
            return false;
        } else if (!parttenCheckcode.test(e)) {
            showMessage('验证码格式不正确');
            return false;
        } else {
            return true;
        }
    }

    function getPhoneVcode(phone) {
        var phoneFlag = checkPhone(phone);
        if (phoneFlag) {
            verifycode.getPhoneVerifyCode(phone);
            updateTime();
        }
    }
	
	//跳转锚点
	$('.lpdhNew a[name]').on('click', function() {
		var $this = $(this);
		window.scrollTo(0, $('#' + $this.attr('name')).offset().top - 44);
	})


	// 处理异步加载问题
	if($('#vcodebutton').length > 0){
		var checkLoading = setInterval(getvcodeButton, 500);
	}

	var checkBindFlag = true;
	var checkNumber = 0;
	// 解决异步加载秒杀中获取验证码按钮绑定问题
	// checkNumber的作用确保该页面没有秒杀的项目，便不需要每次都检测了
	function getvcodeButton() {
		if ($('#vcodebutton').length > 0 || checkNumber > 20) {
			checkNumber++;
			// 确保只解绑一次
			if (checkBindFlag) {
				clearInterval(checkLoading);
				checkBindFlag = false;
			}
			$('#vcodebutton').one('click', function () {
				getPhoneVcode($('#phoneput').val().trim());
			});
		}
	}

    function getPhoneVcodeclick() {
        $('#getPhoneVcode').one('click', function () {
            getPhoneVcode($('.phone').val().trim());
        });
        if ($('#vcodebutton').length > 0) {
            getvcodeButton();
        }
    }

	if ($('#vcodebutton').length > 0) {
		getPhoneVcodeclick();
	}
		timeCount = 60;

    function updateTime() {
        $('#getPhoneVcode').unbind('click').val('重新发送(' + timeCount + ')').css({
            'background-color': '#b3b6be',
            color: '#ffffff',
            border: '1px solid #b3b6be'
        });
        timeCount--;
        if (timeCount >= -1) {
            setTimeout(updateTime, 1000);
        } else {
            $('#getPhoneVcode').val('发送验证码').css({
                'background-color': '#ffffff',
                color: '#ff6666',
                border: '1px solid #ff6666'
            });
            $('#getPhoneVcode').unbind('click').click(function () {
                var phone = $('.phone').val();
                var phoneFlag = checkPhone(phone);
                if (phoneFlag) {
                    updateTime();
                    verifycode.getPhoneVerifyCode(phone);
                }
            });
            timeCount = 60;
        }
    }

    function updateTime1() {
        $('#getPhoneVcode1').unbind('click').val('重新发送(' + timeCount + ')').css({
            'background-color': '#b3b6be',
            color: '#ffffff',
            border: '1px solid #b3b6be'
        });
        timeCount--;
        if (timeCount >= -1) {
            setTimeout(updateTime1, 1000);
        } else {
            $('#getPhoneVcode1').val('发送验证码').css({
                'background-color': '#ffffff',
                color: '#ff6666',
                border: '1px solid #ff6666'
            });
            $('#getPhoneVcode1').unbind('click').click(function () {
                var phone = $('#phoneNum').val();
                var phoneFlag = checkPhone(phone);
                if (phoneFlag) {
                    updateTime1();
                    verifycode.getPhoneVerifyCode(phone);
                }
            });
            timeCount = 60;
        }
    }

    var favoritemsg = $('#favorite_msg');

    function showMessage(msg) {
        // 65为favorite里设置了margin-left: -65px;
        var width = ($(window).width() - favoritemsg.width()) / 2 + 65;
        favoritemsg.html(msg).css({left: width + 'px'}).show();
        setTimeout(removeDiv, 1500);
    }

    function removeDiv() {
        favoritemsg.hide(500);
    }

    function hideNotice() {
        $('.tz-box').hide();
        hideOverflow();
    }

    function showFangyuan(obj) {
        var parent = obj.parents('li');
        parent.find('.dy-box-bg').show();
        obj.hide();
        parent.find('a[name="noneFangyuan"]').show();
        event.stopPropagation();
    }

    function noneFangyuan(obj) {
        var parent = obj.parents('li');
        parent.find('.dy-box-bg').hide();
        obj.hide();
        parent.find('a[name="showFangyuan"]').show();
        event.stopPropagation();
    }

    // 位置及周边
    var pointx = '';
    var pointy = '';
    var locatecity = '';
    city = vars.paramcity;
    if (Util.getCookie('geolocation_x')) {
        pointx = Util.getCookie('geolocation_x');
    }
    if (Util.getCookie('geolocation_y')) {
        pointy = Util.getCookie('geolocation_y');
    }
    if (Util.getCookie('encity')) {
        locatecity = Util.getCookie('encity');
    }
    if (pointx && pointy && locatecity === city) {
        document.getElementById('drivedaohang').style.display = 'block';
    }

    // 视频看房
    var playButton = $('#play_button');
    if (playButton.attr('data-name')) {
        playButton.attr('href',
            '/v.d?m=video&city=' + vars.paramcity + '&id=' + vars.paramid + '&vid=' + playButton.attr('data-name'));
    }
    var Swiper2 = require('swipe/3.10/swiper');
    Swiper2('#videoSlider', {
        speed: 500,
        initialSlide: 1,
        loop: true,
        //  pagination:'#videoIndicators',
        onSlideChangeEnd: function (swiper2) {
            var selectors = $('#videoIndicators').children();
            var len = selectors.length;
            var activeIndex = swiper2.activeIndex;
            var img = $('#videoSlider .swiper-wrapper div img');
            var selectedPic = img.eq(activeIndex);
            var originalUrl = selectedPic.attr('data-original');
            if (originalUrl && originalUrl != '') {
                selectedPic.attr('src', originalUrl).attr('data-original', '');
            }
            var index = activeIndex - 1;
            if (activeIndex > len) {
                index = activeIndex - (len + 1);
            } else if (index < 0) {
                index = len - activeIndex - 1;
            }
            selectors.removeClass('current');
            var spotItem = $(selectors[index]);
            spotItem.addClass('current');
            var $timeLength = $('#timeLength');
            var $playButton = $('#play_button');
            if (spotItem.children().length > 0 && spotItem.children().eq(0).length > 0) {
                if (spotItem.children().eq(1).text() === '10000') {
                    $timeLength.hide();
                    $playButton.css('background',
                        'url(' + vars.applicationScopeftppath + 'touch/img/360play.png)');
                    $playButton.attr('href', spotItem.children().eq(0).text());
                } else {
                    $playButton.css('background',
                        'url(' + vars.applicationScopeftppath + 'touch/img/vid-p2.png)');
                    $playButton.attr('href',
                        '/v.d?m=video&city=' + vars.paramcity + '&id=' + vars.paramid + '&vid=' + spotItem.children().eq(0).text());
                    $timeLength.show().text(spotItem.children().eq(1).text());
                }
                $playButton.css('background-size', '100% 100%');
            }
        }
    });

    $('#play_button').click(function () {
        showWifivideoMsg();
        setTimeout(function () {
            hideWifivideoMsg();
        }, 1000);
    });
    // 控制playbutton的位置在中间
    fcenter();

    function fcenter() {
        var container = $('#videoPhoto');
        var flyers = $('#play_button');
        if (flyers.length > 0) {
            var locheight = parseInt((container.height() - 72) / 2);
            var locWidth = parseInt((container.width() - 72) / 2);
            flyers.css({top: locheight, left: locWidth});
        }
    }

    $(window).resize(function () {
        fcenter();
    });

    var $wifivideo = $('#wifivideo-msg');

    function showWifivideoMsg() {
        var flyers = document.getElementById('wifivideo-msg');
        var locheight = parseInt((window.innerHeight - 40) / 2);
        var locWidth = parseInt((window.innerWidth - 200) / 2) - 10;
        flyers.style.top = locheight + 'px';
        flyers.style.left = locWidth + 'px';
        $wifivideo.show();
    }

    function hideWifivideoMsg() {
        $wifivideo.hide();
    }

    // 全景看房
	if ($('#play_button_fullView').length > 0) {
		$('#play_button_fullView').click(function () {
			goFullView();
		});
	}

    // 全景看房功能
    var Swiper3 = require('swipe/3.10/swiper');
    Swiper3('#fullViewslider', {
        speed: 500,
        loop: true,
        onSlideChangeEnd: function (swiper3) {
            var spots = $('#fullViewIndicators').children(),
                slen = spots.length;
            var imgs = $('#fullViewslider .swiper-wrapper div img'),
                activeIndex = swiper3.activeIndex,
                selPic = $(imgs[activeIndex]);
            var originalUrl = selPic.attr('data-original');
            if (originalUrl) {
                selPic.attr('src', originalUrl).attr('data-original', '');
            }
            var index = activeIndex - 1;
            if (activeIndex > slen) {
                index = activeIndex - (slen + 1);
            } else if (index < 0) {
                index = slen - activeIndex - 1;
            }
            spots.removeClass('current');
            var spotItem = $(spots[index]);
            spotItem.addClass('current');
            $('#play_button_fullView').attr('href', spotItem.children().eq(0).text());
        }
    });

    function fcenterFullView() {
        var container = $('#fullViewPhoto');
        var flyers = $('#play_button_fullView');
        var locheight = parseInt((container.height() - 72) / 2);
        var locWidth = parseInt((container.width() - 72) / 2);
        flyers.css({top: locheight, left: locWidth});
    }

    function goFullView() {
        showWifivideoMsg();
        setTimeout(function () {
            hideWifivideoMsg();
        }, 1000);
    }

    fcenterFullView();

    $(window).resize(function () {
        fcenterFullView();
    });
    // 全景看房----------------------------------------end

    // 加载置业顾问-----------------------------------start
    loadzygw(vars.paramid, vars.paramcity);

    function loadzygw(e, t) {
        $.get('/xf.d?m=getzygwzbjjr&id=' + e + '&newcode=' + vars.paramid + '&city=' + t + '&zygwid=' + vars.zygwid + '&fromflag=xfinfo&rand=' + Math.random(),
            function (e) {
                $('.zygwsection').html(e);
                zygwajax();
                // 电话号码替换
                shadowCall();
            });
    }
    // 加载置业顾问-----------------------------------end
	
	// 加载装修案例-----------------------------------start
    loadCaseInfo(vars.paramid, vars.paramcity);

    function loadCaseInfo(e, t) {
        $.get('/xf.d?m=getCaseInfos&newcode=' + e +  '&city=' + t,
            function (e) {
                $('.zxal').html(e).show();
            });
    }
    // 加载装修案例-----------------------------------end

    // 收藏-----------------------------------------------------------------------
    // 收藏初始化--------------------------------------------------------start
    var shoucang = $('.icon-fav, .collect');
    var fangName = $('#title').text();
    shoucang.on('click', function () {
        if (!userid) {
            alert('请登录后再进行收藏操作！');
            window.location.href = 'https://m.fang.com/passport/login.aspx?burl=http%3a%2f%2fm.fang.com%2fxf%2f' + vars.paramcity + '/' + vars.paramid + '.htm?' + Math.random();
            return;
        } else {
            var selectId = $(this).attr('name');
            // 如果已经收藏
            if ($(this).hasClass('on')) {
                $.get('/xf.d?m=delFav&userphone=' + userphone + '&username=' + username + '&userid=' + userid + '&city=' + vars.paramcity + '&newcode=' + vars.paramid + '&projname=' + fangName + '&selectId=' + selectId + '&math=' + Math.random(),
                    function (data) {
                        if (data.root.code === '100') {
                            collectFlag('#cancelCollect', '#collectSuccess');
                            shoucang.removeClass('on');
                        } else {
                            showMessage('取消收藏失败');
                        }
                    });
            } else {
                $.get('/xf.d?m=addFav&userphone=' + userphone + '&username=' + username + '&userid=' + userid + '&city=' + vars.paramcity + '&newcode=' + vars.paramid + '&projname=' + fangName + '&image=http:'+ $('.topFocus img').attr('src') + '&price=' + vars.xfinfoprice + '&address=' + vars.xfinfoaddress + '&math=' + Math.random(),
                    function (data) {
                        if (data.root.code === '100') {
                            collectFlag('#collectSuccess', '#cancelCollect');
                            shoucang.addClass('on');
                            shoucang.attr('name', data.root.result);
                            // 由于置业顾问的ID相同，故从打电话那里取的置业顾问的ID
                            var yhxw = $('.dadianhua').attr('data-yhxw') || $('.dadianhua').attr('data-yhxw');
                            // 收藏的统计行为
                            consultantyhxw(21, yhxw);
                        } else {
                            showMessage('收藏失败');
                        }
                    });
            }
        }
    });

    function collectFlag(showDiv, hideDiv) {
        $(showDiv).show();
        $(hideDiv).hide();
        setTimeout(function () {
            $(showDiv).hide();
        }, 1500);
    }

	// 置业顾问在线咨询方法
	var zhiyeguwenzxzx = function (obj) {
			var yhxw = obj.attr('data-yhxw');
			consultantyhxw(24, yhxw);
			var charts = obj.attr('data-chatxf').split(';');
			chatxf(charts[0], charts[1], charts[2], charts[3], charts[4], charts[5], charts[6], charts[7],
				charts[8], charts[9], charts[10], charts[11], charts[12], charts[13], charts[14]);
		},
		zhiyeguwenobj;

    function click() {
        $('#btnUp').click(function () {
            hideMore();
        });
        // 降价通知
        $('.jiangjiatongzhi').click(function () {
            var data = $(this).attr('data-name').split(',');
            showNotice(data[0], data[1]);
        });
        // 开盘通知
        $('.kaipantongzhi').click(function () {
            var data = $(this).attr('data-name').split(',');
            showNotice(data[0], data[1]);
        });
        $('#hideNotice').click(function () {
            hideNotice();
        });
        $('a[name="showFangyuan"]').click(function () {
            showFangyuan($(this));
        });
        $('a[name="noneFangyuan"]').click(function () {
            noneFangyuan($(this));
        });

        $('a[name=ckeckLogin]').click(function () {
            ckeckLogin();
        });
        // 在线咨询
        $('.zaixianzixun, .chatxfnew, .zxzx').on('click', function () {
			if (parseInt(vars.sfbzygwlength) > 1 && (vars.istxy != '1' || parseInt(vars.zygwlength) == 0)) {
				$('.sfbzygw.fixTelBox').show();
				unable();
			}else if (parseInt(vars.zygwlength) > 1 && (parseInt(vars.sfbzygwlength) == 0 || vars.istxy == '1')) {
				$('.zygw.fixTelBox').show();
				unable();
			} else {
				zhiyeguwenobj = $(this);
				// 全国楼盘推app下载
				//if (vars.paramcity  === 'tj') {
				//	$('.IM-APP-out').show();
				//	require.async('app/1.0.0/appdownload', function ($) {
				//		$('.btn-down').openApp({
				//			position: 'xfIm'
				//		});
				//	});
				//} else {
				zhiyeguwenzxzx(zhiyeguwenobj);
				//}
            }
        });
		// 在线咨询（专用）
		$('.zbzygwzixun').on('click', function () {
			var $this = $(this);
			if (sfut) {
				zhiyeguwenzxzx($this);
			} else {
				window.location.href = 'https://m.fang.com/passport/login.aspx?burl=' + encodeURIComponent(location.href);
			}
		});
        // 经纪人弹框关闭
        $('.fixTelBox').on('click', function (e) {
            if(e.target.className.indexOf('fixTelBox') > -1 || e.target.className.indexOf('close') > -1) {
               $('.fixTelBox').hide();
                enable();
           }
        });

        // 打电话
        $('.dadianhua').on('click', function () {
            var yhxw = $(this).attr('data-yhxw');
            var teltj1 = $(this).attr('data-teltj').split(';');
            consultantyhxw(31, yhxw);
            // yhxw1(yhxw);
            teltj(teltj1[0], teltj1[1], teltj1[2], teltj1[3], teltj1[4], teltj1[5], teltj1[6], teltj1[7]);
        });
        $('#bodadianhua').click(function () {
            var teltj1 = $(this).attr('data-teltj').split(',');
            teltj(teltj1[0], teltj1[1], teltj1[2], teltj1[3], teltj1[4], teltj1[5], teltj1[6], teltj1[7]);
        });
    }

	// 异步请求职业顾问信息
	$.post('/xf.d?m=getzygwAjax&city=' + vars.paramcity + '&id=' + vars.paramid + '&zygwid=' + vars.zygwid, function (data) {
		if (data) {
			$('.zygwwindow').html(data);
			click();
			zygwajax();
		}
	});

    // 主力户型
    var $scroller = $('#scroller');
    // 每个li的宽度为129
    var domLiLength = 129;
    if ($scroller.length > 0) {
        $scroller.width($scroller.find('li').length * domLiLength);
        new IScrolllist('#huxingslider', {scrollX: true, scrollY: false, bindToWrapper: true, eventPassthrough: true});
    }
    // 主力户型 和 点评 控制星星亮
    $('.star-s, .ico-star').each(function () {
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

    // 点击，点评、动态、论坛按钮展示效果(非电商)
    // yangfan rewrite fixed bug 点评、动态、论坛少任意一个，点击切换无反映
    $('.DP, .DT, .LT, .ZS').click(function () {
        var index = $(this).index();
        if ($(this).hasClass('DP') && $('.DP').hasClass('active')) {
            var hrefload = '/xf/' + vars.paramcity + '/' + vars.paramid + '/dianping.htm';
            window.location = hrefload;
        } else if ($(this).hasClass('ZS') && $('.ZS').hasClass('active')) {
            var hrefload = $('.ZS').attr('data-href');
            window.location = hrefload;
        }
	// （seo专用）
        else if ($(this).hasClass('LT') && $('.LT').hasClass('active')) {
            var hrefload = '/bbs/' + vars.paramcity + '/' + vars.paramid + '_elite.htm';
            window.location = hrefload;
        }
        // slideTo(index + 1);
        else {
            $('#ddlslider .swiper-wrapper>div').hide();
            $('#ddlslider .swiper-wrapper>div').eq(index).show();
            $(this).siblings().removeClass('active');
            $(this).addClass('active');
        }
    });
    $('.Tabjump').on('click', function () {
        var hrefload = $('.xftab .active').attr('data-href');
        window.location = hrefload;
    });
    // 点击论坛内容（seo专用）
    $('.luntan a').on('click', function () {
        var hrefload = '/bbs/' + vars.paramcity + '/' + vars.paramid + '/' + $(this).attr('data-id') + '.htm';
        window.location = hrefload;
    });

    if (document.getElementById('client')) {
        $('#Indicators').css('top', '300px');
        $('#piccount').css('top', '300px');
    }
    city = $('#zhcity').html();
    $.getJSON('/data.d?m=ad&type=xfinfo&city=' + city, function (data) {
        var result = data.root.ad;
        if (result && result.length > 0) {
            if (document.getElementById('sfxfpo')) {
                var $adHtml;
                // 不是电商楼盘
                if (vars.wtInfoList == '[]') {
                    $adHtml= '<div id="wapxfxqy_C12_01" class="swiper-wrapper">';
                } else {
                    // 是电商楼盘
                    $adHtml= '<div id="wapxfdsxqy_C12_01" class="swiper-wrapper">';
                }
                var $spanHtml = '';
                for (var i = 0; i < result.length; i++) {
                    $adHtml += ('<div>' + '<a href="javascript:void(0)" class="ada" data-url="' + result[i]['clickUrl'] + '"><img width="100%" class="adimg" data-url="' + result[i]['src'] + '"></a>' + '</div>');
                }
                $adHtml += '</div>';
                if (result.length > 1) {
                    $spanHtml = '<nav id="bullets"><ul id="position">';
                } else {
                    $spanHtml = '<nav id="bullets" style="display:none"><ul id="position">';
                }
                for (var i = 0; i < result.length; i++) {
                    if (i === 0) {
                        $spanHtml += ('<li class="on"></li>');
                    } else {
                        $spanHtml += ('<li class=""></li>');
                    }
                }
                $spanHtml += '</ul></nav>';
                $('#sfxfpo').html($adHtml + $spanHtml);
                var $adimg = $('.adimg');
                $adimg.each(function () {
                    var $ele = $(this);
                    $ele.attr('src', $ele.attr('data-url'));
                    $ele.on('load', function () {
                        imgOnloaded();
                    });
                });
                // 滚动图片点击跳转
                $('#sfxfpo').on('click', 'a', function () {
                    tongji($(this).attr('data-url'));
                });
                // 图片加载时调用滚动效果
            }
            $('#sfxfpo').addClass('adShow').addClass('mb8 ');
        }
    });
    // 滚动广告------------------------------------------start
    function tongji(url) {
        var pageUrl = document.URL;
        var city = $('#zhcity').html();
        $.ajax({url: '/data.d?m=adtj&city=' + city + '&url=' + pageUrl, async: false});
        window.location = url;
    }

    // 控制图片加载完成之后广告块显示,同时初始化swipe对象
    var PicNumLoaded = 0;

    function imgOnloaded() {
        // 已加载图片数量
        PicNumLoaded++;
        if (PicNumLoaded * 1 == $('#position').children().size()) {
            // 因为会在swipe_adCircle.js中复制元素，会重新出发onload方法，因此在此处也进行+1操作，以保证只执行一次
            PicNumLoaded++;
            $('#sfxfpo').addClass('switch');
            $('#sfxfpo .swiper-wrapper').children().addClass('swiper-slide');
            var Swiper5 = require('swipe/3.10/swiper');
            Swiper5('#sfxfpo', {
                speed: 500,
                autoplay: 3000,
                loop: true,
                onSlideChangeEnd: function (swiper) {
                    var selectors = $('#position').children(),
                        activeIndex = swiper.activeIndex,
                        len = selectors.length;
                    var index = activeIndex - 1;
                    if (activeIndex > len) {
                        index = activeIndex - (len + 1);
                    } else if (index < 0) {
                        index = len - activeIndex - 1;
                    }
                    selectors.removeClass('on');
                    $(selectors[index]).addClass('on');
                }
            });
        }
    }

    // 滚动广告------------------------------------------end
    function ckeckLogin() {
		var href = $('.noCon').attr('datahref');
        if (userid && userphone) {
            //window.location.href = '/xf_2014/houseComment.jsp?city=' + vars.paramcity + '&id=' + vars.paramid;
            window.location.href = href;
            return;
        } else if (!userid) {
            alert('请登录后点评！');
            window.location.href = 'https://m.fang.com/passport/login.aspx?burl=' + location.protocol + href;
            return;
        } else if (!userphone) {
            alert('只有手机验证用户才可以发表楼盘点评哦，先去验证吧');
            window.location.href = '/user.d?m=phonepage&city=' + vars.paramcity + '&mstype=bindphone&burl=' + location.protocol + href;
            return;
        }
    }

    function chatxf(zhcity, city, housetype, houseid, newcode, type, phone, channel, uname, aname, agentid, zhname, agentImg, username, zygwLink) {
        try {
            window.localStorage.foobar = 'foobar';
            var projname = $('#projname').html();
            var com = '';
            if (vars.xfinfocomarea) {
                com = '[' + vars.xfinfocomarea + ']';
            }
            localStorage.setItem(username + '_allInfo',
                encodeURIComponent(projname) + ';' + encodeURIComponent($('#price').text().trim()) + ';' + encodeURIComponent(vars.splitehousefeature) + ';' + vars.xfinfooutdoorpic + ';' + encodeURIComponent($('#district').html()) + ';' + encodeURIComponent(com + vars.xfinfoaddress) + ';' + 'https://m.fang.com/xf/' + city + '/' + houseid + '.htm');
            localStorage.setItem('fromflag', 'xfinfo');
            if (vars.sfbzygwlength == '0') {
                localStorage.setItem('x:' + username + '',
                    encodeURIComponent(zhname) + ';' + agentImg + ';' + encodeURIComponent(projname + '的') + ';' + zygwLink);
            } else {
                localStorage.setItem(username + '',
                    encodeURIComponent(zhname) + ';' + agentImg + ';' + encodeURIComponent(projname + '的') + ';' + zygwLink);
            }
            $.ajax({
                url: '/data.d?m=houseinfotj&city=' + city + '&housetype=' + housetype + '&houseid=' + houseid + '&newcode=' + newcode + '&type=' + type + '&phone=' + phone + '&channel=' + channel + '&agentid=' + agentid,
                async: false
            });
            setTimeout(function () {
                if(vars.sfbzygwlength == '0') {
                    window.location = '/chat.d?m=chat&username=x:' + uname + '&city=' + city + '&type=wapxf&houseid=' + newcode;
                } else {
                    window.location = '/chat.d?m=chat&username=' + uname + '&city=' + city + '&type=wapxf&houseid=' + newcode;
                }
            }, 500);
        } catch (_) {
            alert('若为safari浏览器,请关闭无痕模式浏览。');
        }
    }

    if ($('#client').length > 0) {
        $('#Indicators').css('top', '300px');
        $('#piccount').css('top', '300px');
    }
    try {
        window.localStorage.foobar = 'foobar';
        var size = 50;
        var item = '';
        var id = vars.paramid;
        var xfViewHistory = localStorage.getItem('xfViewHistory') ? localStorage.getItem('xfViewHistory') : '';
        item += 'city~' + vars.paramcity + ';';
        item += 'id~' + id + ';';
        item += 'img~' + $('#storageimg').html() + ';';
        item += 'title~' + ($('.title').html() == null ? '' : $('.title').html()) + ';';
        item += 'price~' + ($('#price').html() == null ? '' : $('#price').html()) + ';';
        item += 'district~' + ($('.district').html() == null ? '' : $('.district').html()) + ';';
        item += 'discount~' + ($('.discount').html() == null ? '' : $('.discount').html()) + ';';
        item += 'cityname~' + vars.ubcity  + '';
        if (!xfViewHistory) {
            localStorage.setItem('xfViewHistory', item);
        } else {
            var viewHistorylist = xfViewHistory.split('|');
            var viewHistory = '';
            var len = viewHistorylist.length >= size ? size : viewHistorylist.length;
            for (var i = 0; i < len; i++) {
                var hisId = getparam(viewHistorylist[i], 'id');
                if (hisId === id) {
                } else {
                    viewHistory += viewHistorylist[i] + '|';
                }
            }
            localStorage.setItem('xfViewHistory',
                item + (viewHistory ? '|' : '') + (viewHistory ? viewHistory.substring(0, viewHistory.length - 1) : ''));
        }
        $('#theCall').hide();
    } catch (_) {
    }
    var storageTypeV1 = 'xf_favorite';
    var idV1 = vars.paramid;
    var allFavorite = localStorage.getItem(storageTypeV1) ? localStorage.getItem(storageTypeV1) : '';
    var favoriteList = allFavorite.split('|');
    for (var i = 0; i < favoriteList.length; i++) {
        hisId = getparam(favoriteList[i], 'id');
        if (hisId === idV1) {
            $('.icon-faved').attr('class', 'btn-faved');
        }
    }
    // 分享功能(新)
	var shareHuxing = '';
	
	if($('.room').length > 0){
		$('.room a').each(function(){
			shareHuxing = shareHuxing + $(this).html() + '、';
		});
		shareHuxing = shareHuxing.substring(0,shareHuxing.length-1)
	}
	
	
	var SuperShare = require('superShare/1.0.1/superShare');
	var config = {
		// 分享内容的title   
		title: '[新盘]' + $('#title').html() + '，' + vars.ubdistrict + '，' + $('.lpjg').html().trim() + '-房天下',
		// 分享时的图标
		image: window.location.protocol + $('#storageimg').html().trim(),
		// 分享内容的详细描述
		desc: '均价：' + $('.lpjg').html() + '\n' +  '户型：' + shareHuxing + '\n' + '地址：' + vars.xfinfoaddress ,
		// 分享的链接地址
		url: location.href + ((location.href.indexOf('?') > -1) ? '&' : '?') + 'userid=' + (userid? userid : ''),
		// 分享的内容来源
		from: 'xf'
	};
	var superShare = new SuperShare(config);

	// 微信分享功能
	var wx = require('weixin/2.0.0/weixinshare');
	var reg = /搜房网/g;
	var weixin = new wx({
		//debug: true,
		shareTitle: '[新盘]' + $('#title').html() + '，' + vars.ubdistrict + '，' + $('.lpjg').html().trim() + '-房天下',
		descContent: '均价：' + $('.lpjg').html().trim() + '\n' +  '户型：' + shareHuxing + '\n' + '地址：' + vars.xfinfoaddress ,
		imgUrl: 'https:'+$('#storageimg').html().trim(),
		lineLink: location.href + ((location.href.indexOf('?') > -1) ? '&' : '?') + 'userid=' + (userid? userid : ''),
	});

    window.appurl = vars.requestScopeappUrl;

    // click统计（需要区分普通详情页是还电商详情页）
    // 长沙 天津 苏州 武汉 三亚
    if (vars.paramcity === 'cs' || vars.paramcity === 'tj' || vars.paramcity === 'suzhou' || vars.paramcity === 'wuhan' || vars.paramcity === 'sanya'
        // 昆明 西安 无锡 宁波 南宁
        || vars.paramcity === 'km' || vars.paramcity === 'xian' || vars.paramcity === 'wuxi' || vars.paramcity === 'nb' || vars.paramcity === 'nn'
        // 南昌 合肥 海南 东莞 常州
        || vars.paramcity === 'nc' || vars.paramcity === 'hf' || vars.paramcity === 'hn' || vars.paramcity === 'dg' || vars.paramcity === 'cz'
        // 南京 杭州 重庆 深圳 广州
        || vars.paramcity === 'nanjing' || vars.paramcity === 'hz' || vars.paramcity === 'cq' || vars.paramcity === 'sz' || vars.paramcity === 'gz'
        // 上海 郑州 石家庄 沈阳 青岛
        || vars.paramcity === 'sh' || vars.paramcity === 'zz' || vars.paramcity === 'sjz' || vars.paramcity === 'sy' || vars.paramcity === 'qd'
        // 济南 大连 长春 成都 北京
        || vars.paramcity === 'jn' || vars.paramcity === 'dl' || vars.paramcity === 'changchun' || vars.paramcity === 'cd' || vars.paramcity === 'bj'
    ) {
        require.async('//clickm.fang.com/click/new/clickm.js', function () {
            Clickstat.eventAdd(window, 'load', function (e) {
                // 普通详情页
                if (vars.wtInfoList == '[]') {
                    Clickstat.batchEvent('wapxfxqy_', vars.paramcity);
                } else {
                    // 电商详情页
                    Clickstat.batchEvent('wapxfdsxqy_', vars.paramcity);
                }

            })
        });
    }

	if ($('#miaoshaohidden').length > 0 ){
		setInterval(function () {
			if ($('#miaoshaohidden').length > 0 && miaoshahiddenjudge) {
				miaoshahiddenjudge = false;
				day = $('#day');
				hour = $('#hour');
				minute = $('#minute');
				second = $('#second');
				setInterval(dao, 1000);
				nowtime = vars.minfonowTime;
				nowtime = nowtime.replace(/-/g, '/');
				userphone, passport;
				if (sfut) {
					$.get('/user.d?m=getUserinfoBySfut', function (data) {
						if (data) {
							var returnResult = data.root.return_result;
							if (returnResult === '100') {
								userphone = data.root.mobilephone;
							}
						}
					});
				}
				spiketime = vars.minfospikeTime;
				spiketime = spiketime.replace(/-/g, '/');
				dao();
				$('#mssignuped').click(function () {
					signuppage();
				});
				$('a[name="signup"]').each(function () {
					$(this).click(function () {
						signup();
					});
				});
				$('a[name="miaosha"]').each(function () {
					$(this).click(function () {
						miaosha();
					});
				});
				// 红包秒杀展示------------------------start
				if ($msTip1.length === 0) {
					$sfhongbao.hide();
					$xfmiaosha.show();
					$msTip1.show();
					$msTip2.hide();
					$msTip4.hide();
					$msTip3.show();
				}
				$msTip1.on('click', function () {
					$msTip1.attr('style', 'position:fixed; z-index: 999; width: 100%;');
					$sfhongbao.show();
					$xfmiaosha.hide();
					$msTip5.hide();
					$msTip2.show();
					$msTip1.hide();
					$msTip4.show();
					$msTip3.hide();
					$(document.body).animate({scrollTop: 0}, 200);
				});
				$msTip2.on('click', function () {
					$sfhongbao.hide();
					$xfmiaosha.hide();
					$msTip5.show();
					$msTip2.hide();
					$msTip1.show();
					$msTip4.show();
					$msTip3.hide();
				});
				$('#btnms').on('click', function () {
					$msTip1.attr('style', 'position:fixed; z-index: 999; width: 100%;');
					$msTip5.show();
					$sfhongbao.hide();
					$xfmiaosha.hide();
					$msTip1.show();
					$msTip2.hide();
					$msTip4.show();
					$msTip3.hide();
				});
				$msTip4.on('click', function () {
					$msTip1.attr('style', 'position:relative; z-index: 999; width: 100%;');
					$msTip5.hide();
					$sfhongbao.hide();
					$xfmiaosha.show();
					$msTip1.show();
					$msTip2.hide();
					$msTip4.hide();
					$msTip3.show();
				});
				timeCount = 60;
				flag = 1;
				ingflag = 0;
				showtype = vars.minfoshowtype;
				timer = setInterval(dao, 1000);
				nowtime = vars.minfonowTime;
				nowtime = nowtime.replace(/-/g, '/');
				now = new Date(nowtime);
				nowmilliontimes = now.getTime();
				spiketime = vars.minfospikeTime;
				spiketime = spiketime.replace(/-/g, '/');
				oDate = new Date(spiketime);
				$('.miaosha-tip1').click(function () {
					if ($('.miaosha1').css('display', 'none')) {
						$('.miaosha1').show();
						$(this).hide();
					} else {
						return;
					}
				});
				$('.btmlink').click(function () {
					$('.miaosha1').hide();
					$('.miaosha-tip1').show();
				});
				$('#openapp').click(function () {
					openapp();
				});
			}
		}, 150);
	}
    // 红包秒杀相关----------------------------------------------------------------------------start
    function AddZero(n) {
        if (n < 10) {
            return '0' + n;
        }
        return '' + n;
    }

    function dao() {
        nowmilliontimes += 1000;
        var s = parseInt((oDate.getTime() - nowmilliontimes) / 1000);
        if (s >= 0) {
            var d = parseInt(s / 86400);
            s %= 86400;
            var h = parseInt(s / 3600);
            s %= 3600;
            var m = parseInt(s / 60);
            s %= 60;
        } else {
            d = 0;
            h = 0;
            m = 0;
            s = 0;
        }
        if (showtype == '1' || showtype == '2') {
            day.html(AddZero(d));
            hour.html(AddZero(h));
            minute.html(AddZero(m));
            second.html(AddZero(s));
            if (d == '0' && h == '0' && m == '0' && s == '0') {
                $timeblock.attr('class', 'none');
                if ($signupblock.attr('class') === 'block') {
                    $msingblock.attr('class', 'none');
                } else {
                    $msingblock.attr('class', 'block');
                }
                ingflag = 1;
                clearInterval(timer);
            }
        }
    }

    function signuppage() {
        if (sfut) {
            if (userphone) {
                $.get('/xf.d?m=signupmiao' + '&activityid=' + vars.minfoactivityid + '&city=' + vars.paramcity,
                    function (data) {
                        var status = data.root.status;
                        var message = data.root.message;
                        if (status == '100') {
                            alert(message);
                            var signnum = vars.minfosigncount;
                            signnum = parseInt(signnum) + 1;
                            $signupnum.html(signnum);
                            if (showtype === '1') {
                                if (ingflag === '1') {
                                    $timeblock.attr('class', 'none');
                                    $signupblock.attr('class', 'none');
                                    $msingblock.attr('class', 'block');
                                } else if (ingflag === '0') {
                                    $timeblock.attr('class', 'block');
                                    $signupblock.attr('class', 'none');
                                    $mssignuped.attr('href', 'javascript:void(0);');
                                    $mssignuped.attr('style', 'background-color: #eaeaea;');
                                    $mssignuped.html('<span style="background: none;padding:0 0;">即将开始</span>');
                                }
                            } else if (showtype === '3') {
                                $timeblock.attr('class', 'none');
                                $signupblock.attr('class', 'none');
                                $msingblock.attr('class', 'block');
                            }
                        } else {
                            alert(message);
                        }
                    });
            } else {
                $timeblock.attr('class', 'none');
                $signupblock.attr('class', 'block');
            }
        } else {
            $timeblock.attr('class', 'none');
            $signupblock.attr('class', 'block');
        }
    }

    function signup() {
        var partten = /^1[3,4,5,8]\d{9}$/;
        var phone = document.getElementById('phoneput').value;
        if (phone != '') {
            if (partten.test(phone)) {
                var partten1 = /^\d{6}$/;
                var vcode = document.getElementById('vcodeput').value;
                if (vcode) {
                    if (partten1.test(vcode)) {
                        $.get('/xf.d?m=signupmiao&phone=' + phone + '&vcode=' + vcode + '&activityid=' + vars.minfoactivityid + '&city=' + vars.paramcity,
                            function (data) {
                                var status = data.root.status;
                                var message = data.root.message;
                                if (status === '100') {
                                    alert(message);
                                    var signnum = vars.minfosigncount;
                                    signnum = parseInt(signnum) + 1;
                                    $signupnum.html(signnum);
                                    if (showtype === '1') {
                                        if (ingflag === '1') {
                                            $timeblock.attr('class', 'none');
                                            $signupblock.attr('class', 'none');
                                            $msingblock.attr('class', 'block');
                                        } else if (ingflag === '0') {
                                            $timeblock.attr('class', 'block');
                                            $signupblock.attr('class', 'none');
                                            $mssignuped.attr('style', 'background-color: #eaeaea;');
                                            $mssignuped.html('<span style="background: none;padding:0 0;">即将开始</span>');
                                        }
                                    } else if (showtype === '3') {
                                        $timeblock.attr('class', 'none');
                                        $signupblock.attr('class', 'none');
                                        $msingblock.attr('class', 'block');
                                    }
                                } else {
                                    alert(message);
                                }
                            });
                    } else {
                        alert('您输入验证码有误！');
                    }
                } else {
                    alert('请输入验证码！');
                }
            } else {
                alert('您输入的手机号码有误！');
            }
        } else {
            alert('请输入手机号码！');
        }
    }

    function miaosha() {
        var cookie = Util.getCookie('miaosha' + vars.minfoactivityid);
        if (!cookie || cookie === '1') {
            $timeblock.attr('class', 'none');
            $signupblock.attr('class', 'block');
            $msingblock.attr('class', 'none');
        } else {
            var phone = cookie.split('|')[1];
            if (phone) {
                $.get('/xf.d?m=procSpike&activityid=vars.minfoactivityid&phone=' + phone, function (data) {
                    var status = data.root.status;
                    var message = data.root.message;
                    alert(message);
                    if (status === '100' || status === '106' || status === '107') {
                        location.reload();
                    }
                });
            } else {
                $timeblock.attr('class', 'none');
                $signupblock.attr('class', 'block');
                $msingblock.attr('class', 'none');
            }
        }
    }

    function openapp() {
        var bua = navigator.userAgent.toLowerCase();
        if (bua.indexOf('iphone') > 0) {
            window.location = 'soufun:';
            setTimeout(function () {
                window.location = 'https://itunes.apple.com/cn/app/soufun/id413993350?8&ls=1';
            }, 500);
        } else if (bua.indexOf('android') > 0) {
            window.location = 'soufunandroid://soufun.a';
            setTimeout(function () {
                window.location = '//m.fang.com/clientindex.jsp?city=' + vars.paramcity;
            }, 500);
        } else {
            window.location = '//m.fang.com/clientindex.jsp?city=' + vars.paramcity;
        }
    }

    // 置业顾问异步加载----------------------------------------------------------------------start
    function teltj(city, housetype, houseid, newcode, type, phone, channel, agentid) {
        $.ajax({
            url: '/data.d?m=houseinfotj&city=' + city + '&housetype=' + housetype + '&houseid=' + houseid + '&newcode=' + newcode + '&type=' + type + '&phone=' + phone + '&channel=' + channel + '&agentid=' + agentid,
            async: true
        });
    }

    function getparam(str, name) {
        var paraString = str.split(';');
        var paraObj = {};
        for (var i = 0, j; j = paraString[i]; i++) {
            paraObj[j.substring(0, j.indexOf('~')).toLowerCase()] = j.substring(j.indexOf('~') + 1, j.length);
        }
        return paraObj[name];
    }

    function zygwajax() {
        var telbua = navigator.userAgent.toLowerCase();
       
        $('a[data-name=zygwteltj]').click(function () {
            var teltj1 = $(this).attr('data-teltj').split(';');
            var yhxw = $(this).attr('data-yhxw');
            consultantyhxw(31, yhxw);
            teltj(teltj1[0], teltj1[1], teltj1[2], teltj1[3], teltj1[4], teltj1[5], teltj1[6], teltj1[7]);
        });


		// 点击置业顾问在线咨询
        $('a[data-name=zygwchatxf]').click(function () {
			zhiyeguwenobj = $(this);
			// 全国楼盘推app下载
			//if (vars.paramcity  === 'tj') {
				/*$('.IM-APP-out').show();
				require.async('app/1.0.0/appdownload', function ($) {
					$('.btn-down').openApp({
						position: 'xfIm'
					});
				});*/
			//} else {
			zhiyeguwenzxzx(zhiyeguwenobj);
			//}
        });
		// 关闭立即下载app
		$('.IM-APP-out .close').on('click', function () {
			$('.IM-APP-out').hide();
		});
		// 点击继续网页聊天
		$('.IM-APP-out .btn-link').on('click', function () {
			zhiyeguwenzxzx(zhiyeguwenobj);
		});

        $('#more_zygw').on('click', function () {
            $('.more_zygw').show();
            $('#more_zygw').hide();
            $('#up_zygw').show();
        });
        $('#up_zygw').on('click', function () {
            $('.more_zygw').hide();
            $('#up_zygw').hide();
            $('#more_zygw').show();
            $(document).scrollTop($('.zygwsection').position().top);
        });
    }

    // 置业顾问异步加载----------------------------------------------------------------------end
    function xfTongji(city, newcode) {
        $.ajax({
            url: '/data.d?m=houseinfotj&type=click&housefrom=ad&city=' + city + '&housetype=xf&newcode=' + newcode + '&channel=wapnewhouseinfo_more',
            async: false
        });
    }

    // 收藏按钮显示异步加载
    function scajax() {
        $.get('/xf.d?m=scajax&id=' + id + '&city=' + city, function (data) {
            if (data) {
                shoucang.attr('name-value', data.root.code);
                shoucang.attr('name', data.root.message);
                if (shoucang.attr('name-value') === '100') {
                    shoucang.addClass('on');
                } else {
                    if (shoucang.hasClass('on')) {
                        shoucang.removeClass('on');
                    }
                }
            }
        });
    }

    var $redBagReward = '';
    // 页面红包设置参数
    var $rbid = '';
    // 弹窗遮罩层
    var $zhedang = '';
    // 查看更多红包按钮实例
    var $showhongbao = '';
    // 隐藏更多红包按钮实例
    var $hidehongbao = '';
    // 隐藏的红包li节点最小索引
    var MIN_INDEX = '';
    var hideRedBag = '';
    // 红包规则按钮
    var $redBagButton = '';
    var $morehuodong = '',
        $gd = '',
        $shq = '';

    /**
     * 显示弹窗
     */
    function showPop(popStr) {
        $(popStr).show();
        showOverflow();
    }

    /**
     * 隐藏弹窗
     */
    function hidePop(popStr) {
        $(popStr).hide();
        hideOverflow();
    }

    function clearInput() {
        $('#phoneNum').val('');
        $('#codeText').val('');
    }

    var un = '';
    var phone = '';

    /**
     * 领取红包
     */
    function applyRedBag() {
        username = username ? username : un;
        userphone = userphone ? userphone : phone;
        $.get('/xf.d?m=getRedBag&mobile=' + userphone + '&city=' + vars.paramcity + '&vcode=' + '&newcode=' + $redBagReward.attr('aid') + '&rbid=' + $rbid.val() + '&username=' + username + '&type=xfinfo'
            + '&fromUrl=' + encodeURIComponent(encodeURIComponent(window.location.href)),
            function (data) {
                if (data) {
                    if (data.root.code === '100') {
                        showPop('#applyok');
                        $redBagReward.find('li').eq($rbid.attr('index')).attr('class', 'used');
                        $redBagReward.find('li').eq($rbid.attr('index')).children('a').attr('href', 'http://m.fang.com/house/ec/RedBagDetail/Index?redBagId=' + $rbid.val() + '&phone=' + userphone).unbind('click') + '&EB_BehaviorID=SFHB0002';
                        getPartActive(city, idV1);
                    } else if (data.root.code === '010') {
                        showMessage('亲已经领取过该红包啦~');
                        hidePop('#applyhb');
                        $redBagReward.find('li').eq($rbid.attr('index')).attr('class', 'used');
                        $redBagReward.find('li').eq($rbid.attr('index')).children('a').attr('href', 'http://m.fang.com/house/ec/RedBagDetail/Index?redBagId=' + $rbid.val() + '&phone=' + userphone).unbind('click') + '&EB_BehaviorID=SFHB0002';
                        getPartActive(city, idV1);
                    } else {
                        showMessage(data.root.message);
                    }
                }
            });
    }

    function applyRB() {
        var city = vars.paramcity;
        var newcode = vars.paramid;
        phone = $('#phoneNum').val();
        var phoneFlag = checkPhone(phone);
        var vCode = $('#codeText').val();
        var vcodeFlag = checkVcode(vCode);
        if (phoneFlag && vcodeFlag) {
            unbindClickRedbag();
            verifycode.sendVerifyCodeAnswer(phone, vCode,
                function () {
                    $.get('/xf.d?m=getRedBag&mobile=' + phone + '&city=' + vars.paramcity + '&newcode=' + $redBagReward.attr('aid') + '&rbid=' + $rbid.val()
                        + '&fromUrl=' + encodeURIComponent(encodeURIComponent(window.location.href)),
                        function (data) {
                            if (data) {
                                un = data.root.result;
                                if (data.root.code === '100') {
                                    $('#applyok').show();
                                    $('#applyhb').hide();
                                    $redBagReward.find('li').eq($rbid.attr('index')).attr('class', 'used');
                                    $redBagReward.find('li').eq($rbid.attr('index')).find('a').attr('href', 'http://m.fang.com/house/ec/RedBagDetail/Index?redBagId=' + $rbid.val() + '&phone=' + phone + '&EB_BehaviorID=SFHB0002').unbind('click');
                                    getPartActive(city, newcode);
                                } else if (data.root.code === '010') {
                                    showMessage('亲已经领取过该红包啦~');
                                    hidePop('#applyhb');
                                    $redBagReward.find('li').eq($rbid.attr('index')).attr('class', 'used');
                                    $redBagReward.find('li').eq($rbid.attr('index')).children('a').attr('href', 'http://m.fang.com/house/ec/RedBagDetail/Index?redBagId=' + $rbid.val() + '&phone=' + phone + '&EB_BehaviorID=SFHB0002').unbind('click');
                                    getPartActive(city, newcode);
                                } else {
                                    bindClickRedbag();
                                    showMessage(data.root.message);
                                }
                            }
                        });
                },
                function () {
                    // 验证码错误
                    showMessage(' 验证码错误！');
                    bindClickRedbag();
                });
        }
    }

    function showActive() {
        $morehuodong.show();
        $gd.hide();
        $('.yh-kft').hide();
        $shq.show();
        $('.sfhbhide').show();
    }

    function hideActive() {
        $morehuodong.hide();
        $shq.hide();
        $('.yh-kft').show();
        $gd.show();
        $('.sfhbhide').hide();
    }

    function showHongBao() {
        hideRedBag.show();
        $showhongbao.hide();
        $hidehongbao.show();
    }

    function hideHongBao() {
        hideRedBag.hide();
        $hidehongbao.hide();
        $showhongbao.show();
    }

    // 限时杀价活动比较特殊。必须得放到外面
    var sjb = $('#sjb');
    var countDown = false;
    // 处理活动倒计时
    var sjbInterval = '';
    if (sjb && sjb.length) {
        sjbInterval = setInterval(function () {
            showActivity(sjb);
            countDown = true;
        }, 1000);
    }

    /**
     * 异步加载登录后需要显示红包是否领取
     */
    function getPartActive(city, id) {
        $.get('/xf.d?m=partActive&id=' + id + '&city=' + city, function (data) {
            if (data) {
                var message = data.root.message;
                var messarr = message.split(',');
                for (var i = 0; i < messarr.length; i++) {
                    var m = messarr[i];
                    var $lia = '';
                    if (m && m !== '0') {
                        $redBagReward.find('li').eq(i).attr('class', 'used');
                        $lia = $redBagReward.find('li').eq(i).find('a');
                        $lia.attr('href', 'http://m.fang.com/house/ec/RedBagDetail/Index?redBagId=' + $lia.attr('rbid') + '&phone=' + data.root.code + '&EB_BehaviorID=SFHB0002').unbind('click');
                    } else {
                        $lia = $redBagReward.find('li').eq(i).find('a');
                        $lia.unbind('click');
                        $lia.on('click', function () {
                            $rbid.val($(this).attr('rbid')).attr('money', $(this).attr('money')).attr('index', $(this).attr('index'));
                            applyRedBag();
                        });
                    }
                }
            }
        });
    }

    // 置红并绑定click事件
    function bindClickRedbag() {
        $('#getredbag').css({background: '#df3031'}).bind('click', function () {
            applyRB();
        });
    }

    // 置灰并解绑click事件
    function unbindClickRedbag() {
        $('#getredbag').css({background: '#b3b6be'}).unbind('click');
    }

    // 所有活动和红包异步加载（仅限北京）
    function getAllActive(city, id) {
        $.get('/xf.d?m=allActive&id=' + id + '&city=' + city + '&type=xfinfo', function (data) {
            if (data.trim()) {
                $('#aa').append(data).show();
                // 活动
                require('modules/xf/xfactivity');
                // 活动
                var hdOptions = {
                    fqg: $('#fqg'),
                    yy: $('#yy'),
                    sfk: $('#sfk'),
                    zhc: $('#zhc'),
                    jp: $('#jp'),
                    sjb: $('#sjb'),
                    ms: $('.mstime'),
                    lucky: $('#lucky'),
					pm: $('#pm')
                };

                if (hdOptions.sjb && hdOptions.sjb.length) {
                    clearInterval(sjbInterval);
                }
                countDown = false;
                // 处理活动倒计时
                var hdsetInterval = setInterval(function () {
                    for (var option in hdOptions) {
                        if (hdOptions[option] && hdOptions[option].length) {
                            showActivity(hdOptions[option]);
                            countDown = true;
                        }
                    }
                    if (!countDown) {
                        clearInterval(hdsetInterval);
                    }
                }, 1000);

                // 红包容器实例
                $redBagReward = $('.qdRB');
                // 页面红包设置参数
                $rbid = $('#rbid');
                // 弹窗遮罩层
                $zhedang = $('#zhedang');
                // 查看更多红包按钮实例
                $showhongbao = $('#showhongbao');
                // 隐藏更多红包按钮实例
                $hidehongbao = $('#hidehongbao');
                // 隐藏的红包li节点最小索引
                MIN_INDEX = 1;
                hideRedBag = $redBagReward.find('li:gt(' + MIN_INDEX + ')');
                $('#gftg').hide();
                // 勾选规则按钮
                $redBagButton = $('input[type="checkbox"]');
                // 默认选中
                $redBagButton.attr('checked', true);
                // 绑定确定按钮
                bindClickRedbag();

                if (!userphone) {
                    // 未登录情况 全部可以领取
                    $redBagReward.find('li').each(function () {
                        var $this = $(this);
                        $this.removeAttr('class').find('a').click(function () {
                            var $th = $(this);
                            $rbid.val($th.attr('rbid')).attr('money', $th.attr('money')).attr('index', $th.attr('index'));
                            showPop('#applyhb');
                        });
                    });
                } else {
                    // 已登录状态
                    $redBagReward.find('li').each(function () {
                        var $this = $(this);
                        if ($this.attr('class') !== 'used') {
                            $this.find('a').click(function () {
                                var $th = $(this);
                                $rbid.val($th.attr('rbid')).attr('money', $th.attr('money')).attr('index', $th.attr('index'));
                                applyRedBag();
                            });
                        } else {
                            $this.find('a').attr('href', 'http://m.fang.com/house/ec/RedBagDetail/Index?redBagId=' + $this.find('a').attr('rbid') + '&phone=' + userphone + '&EB_BehaviorID=SFHB0002');
                        }
                    });
                }

                $morehuodong = $('.more-huodong');
                $gd = $('.gd');
                $shq = $('.shq');
                $('#wapxfxqy_C03_11').click(function () {
                    showActive();
                });
                $('#hideActive').click(function () {
                    hideActive();
                });
                $showhongbao.click(function () {
                    showHongBao();
                });
                $hidehongbao.click(function () {
                    hideHongBao();
                });
                $redBagButton.on('click', function () {
                    if ($redBagButton.is(':checked')) {
                        bindClickRedbag();
                    } else {
                        unbindClickRedbag();
                    }
                });

                $('#cancleredbag').click(function () {
                    hidePop('#applyhb');
                    clearInput();
                });
                // 获取验证码
                $('#getPhoneVcode1').click(function () {
                    var phone = $('#phoneNum').val();
                    var phoneFlag = checkPhone(phone);
                    if (phoneFlag) {
                        updateTime1();
                        // 给手机发送验证码
                        verifycode.getPhoneVerifyCode(phone);
                    }
                });

                $('.closeBtn').click(function () {
                    hidePop('#applyok');
                });

                $('#wapShare').bind('click', function () {
                    // 引入APP下载和打开
                    var appdown = require('app/1.0.0/appdownload');
                    appdown('#wapShare').openApp('http://m.fang.com/clientindex.jsp?city=' + vars.city + '&flag=download&f=1256');
                });
                $('#rebbaginfo').click(function () {
                    userphone = userphone || phone;
                    window.location.href = 'http://m.fang.com/house/ec/RedBagDetail/Index?redBagId=' + $rbid.val() + '&phone=' + userphone + '&EB_BehaviorID=SFHB0002';
                });
            } else {
                // 如果没有红包活动，则显示购房团购
                $('#gftg').show();
            }
        });
    }

    /*
     *房抢购活动
     */
    function showActivity($DivDom) {
        $DivDom.each(function (index, ele) {
            var $ele = $(ele);
            var time = showTime($ele.attr('data'));
            if (time) {
                var showDom;
                if (time.timestamp) {
                    showDom = '<b>' + $ele.attr('data-value') + '</b><em>' + time.days + '</em><b>天</b><em>' + time.hours + '</em><b>时</b><em>' + time.minutes + '</em><b>分</b><em>' + time.seconds + '</em><b>秒</b>';
                } else {
                    showDom = '<b>' + $ele.attr('data-value') + '</b>';
                }
                $ele.html(showDom);
            }
        });
    }

    /*
     * 时间计算
     */
    function showTime(date) {
        // 开始时间
        var nowDate = new Date();
        // 结束时间
        var closeDate = new Date(date);
        // 时间差的毫秒数
        var timestamp = Math.max(closeDate.getTime() - nowDate.getTime(), 0);
        // 计算出相差天数
        var days = Math.floor(timestamp / (24 * 3600 * 1000));
        // 计算天数后剩余的毫秒数
        var dayLeave = timestamp % (24 * 3600 * 1000);
        // 计算出小时数
        var hours = Math.floor(dayLeave / (3600 * 1000));
        // 计算小时数后剩余的毫秒数
        var houseLeave = dayLeave % (3600 * 1000);
        // 计算相差分钟数
        var minutes = Math.floor(houseLeave / (60 * 1000));
        // 计算分钟数后剩余的毫秒数
        var minutesLeave = houseLeave % (60 * 1000);
        // 计算相差秒数
        var seconds = Math.round(minutesLeave / 1000);
        return {
            days: days < 10 ? '0' + days : days,
            hours: hours < 10 ? '0' + hours : hours,
            minutes: minutes < 10 ? '0' + minutes : minutes,
            seconds: seconds < 10 ? '0' + seconds : seconds,
            timestamp: timestamp
        };
    }

    // 楼盘标签偏差
    var offset = {
        left: 18,
        top: 21
    };
    // 楼栋DIV
    var $louDong = $('.loudong');
    // 移动的边界线
    var minLeft = $louDong.width() - vars.imageWidth;
    var maxLeft = 0;
    var minTop = $louDong.height() - vars.imageHeight;
    var maxTop = 0;

    /*
     *判断是否为边界
     */
    function judgeBorder(left, top) {
        var option = {};
        option.left = left > maxLeft ? maxLeft : left < minLeft ? minLeft : left;
        option.top = top > maxTop ? maxTop : top < minTop ? minTop : top;
        return option;
    }
    // 获取第一个楼栋的坐标值
    var loudongPoint1 = {};
    $('.loudong-in span').each(function () {
        var $this = $(this);
        if($this.index() == 1) {
            loudongPoint1.x = $this.attr('data-x');
            loudongPoint1.y = $this.attr('data-y')
        };
        // 楼栋标签偏移位置
        $this.css({left: $this.attr('data-x') - offset.left, top: $this.attr('data-y') - offset.top});
    });

    // 图片偏移（以第一个标签为中心）
    var offsetOption = judgeBorder(-loudongPoint1.x + $louDong.width() / 2, -loudongPoint1.y + $louDong.height() / 2);
    $louDong.find('a').css({left: offsetOption.left, top: offsetOption.top});

    //  开盘通知和降价通知的统计
    function kpjjyhtj(type, phone) {
        // 收集方法
        _ub.collect(type, {
            // 楼盘id
            'vmn.projectid': vars.ubhouseid,
            // 手机号码
            'vmn.phone': phone,
            'vmg.page': 'mnhpageproject'
        });
    }

    // 置业顾问统计
    function consultantyhxw(type, consultantId) {
        // 收集方法
        _ub.collect(type, {
            // 楼盘id
            'vmn.projectid': vars.ubhouseid,
            // 置业顾问ID
            'vmn.consultantid': consultantId,
            'vmg.page': 'mnhpageproject'
        });
    }

    // C端账户工作台服务中心(2016年5月10日)
    if ($('.workbench-icon').length) {
        require('modules/xf/workbench');
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

    /* 网上直销、红包（暂时不使用）(2016年5月25日)*/
    // 点击网上直销
    $('#zxhd').on('click', function () {
        unable();
        $('#huodongyouhui').removeClass('none');
        new IScrolllist('#youhui');
    });
    // 点击搜房红包
    $('#xfhb').on('click', function () {
        unable();
        $('#huodonghongbao').removeClass('none');
        new IScrolllist('#hongbao');
    });

    // 关闭 直销 红包
    $('#yhclose, #hbclose, .divBg').on('click', function () {
        $('#huodonghongbao, #huodongyouhui').addClass('none');
        enable();
    });

    // 如果oFlag是zx，默认打开直销优惠浮层，是hb，默认打开红包优惠浮层
    var oFlag = vars.oFlag;
    if (oFlag == 'zx') {
        unable();
        $('#huodongyouhui').removeClass('none');
        new IScrolllist('#youhui');
    } else if (oFlag == 'hb') {
        unable();
        $('#huodonghongbao').removeClass('none');
        new IScrolllist('#hongbao');
    }
    // 点击领取 直销 红包
    $('.main').on('click', '.yh-content a', function () {
        var $this = $(this);
        var url = vars.mainSite;
        var id, aid, rbid, flag;
        // 如果登录了
        if (sfut) {
            // 如果绑定手机号了
            if (userphone) {
                if ($this.html() == '获取优惠') {
                    id = $this.parent('div').attr('data-id');
                    aid = $this.parent('div').attr('data-aid');
                    $.get('/xf.d?m=getConditionsMoney&mobile=' + userphone + '&city=' + vars.paramcity
                        + '&vcode=' + '&aid=' + aid + '&newcode=' + vars.newcode + '&cmid=' + id + '&username=' + username + '&fromUrl=' + encodeURIComponent(encodeURIComponent(window.location.href)),
                        function (data) {
                            if (data) {
                                if (data.root.code === '100') {
                                    //showMessage('报名成功');
                                    //$('#huodonghongbao, #huodongyouhui').addClass('none');
                                    //$('body').css('overflow', 'auto');
                                    enable();
                                    window.location = url + 'house/ec/BuyYouHui/PayConfirm?orderNo=' + data.root.result + '&EB_BehaviorID=GMYH0002';

                                } else {
                                    showMessage(data.root.message);
                                }
                            }
                        });
                } else if ($this.html() == '领取红包') {
                    aid = $this.parent('li').attr('data-aid');
                    rbid = $this.parent('li').attr('data-rbid');
                    $.get('/xf.d?m=getRedBag&mobile=' + userphone + '&city=' + vars.paramcity
                        + '&vcode=' + '&newcode=' + aid + '&rbid=' + rbid + '&username=' + username + '&fromUrl=' + encodeURIComponent(encodeURIComponent(window.location.href)),
                        function (data) {
                            if (data) {
                                if (data.root.code === '100') {
                                    showMessage(data.root.message);
                                    $('#huodonghongbao, #huodongyouhui').addClass('none');
                                    //$('body').css('overflow', 'auto');
                                    enable();
                                } else {
                                    showMessage('报名失败');
                                }
                            }
                        });
                }
            } else {
                if ($this.html() == '领取红包') {
                    flag = 'hb';
                } else if ($this.html() == '获取优惠') {
                    flag = 'zx';
                }
                window.location.href = 'https://m.fang.com/passport/resetmobilephone.aspx?burl=' + encodeURIComponent(url + 'xf/' + vars.paramcity + '/' + vars.paramid + '.htm?oFlag=' + flag);
            }
        } else {
            if ($this.html() == '领取红包') {
                flag = 'hb';
            } else if ($this.html() == '获取优惠') {
                flag = 'zx';
            }
            //window.location.href = 'https://m.fang.com/passport/login.aspx?burl=' + encodeURIComponent(url + 'xf/' + vars.paramcity + '/' + vars.paramid + '.htm?oFlag=' + flag);
            window.location.href = 'https://m.fang.com/passport/login.aspx?burl=' + encodeURIComponent(url + 'xf/' + vars.paramcity + '/' + vars.paramid + '.htm');
        }
    });

    /* 预约看房（2016年5月26日）*/
    $('.yykf').on('click', function () {
        var locationHref = window.location.href;
        // 如果登陆了
        if (sfut) {
            // 如果绑定手机号了
            if (userphone) {
                window.location.href = $(this).attr('data-href');
            } else {
                window.location.href = 'https://m.fang.com/passport/resetmobilephone.aspx?burl=' + encodeURIComponent(locationHref);
            }
        } else {
            window.location.href = 'https://m.fang.com/passport/login.aspx?burl=' + encodeURIComponent(locationHref);
        }
    });

    // 图片宽度设置为屏幕宽度
    $('#slider img').each(function () {
        var $this = $(this);
        if ($this.attr('data-original')) {
            $this.load(function () {
                if ($this.height() < $this.width()) {
                    $this.width($(window).width());
                }
            })
        } else {
            if ($this.height() <= $this.width()) {
                $this.width($(window).width());
            }
        }
    });
	
    // 头部图片滑动
    $('#slider').css({overflow: 'hidden'});
    var Swiper1 = require('swipe/3.10/swiper');
    var allimage = $('#slider img');

    function setTab(t) {
        //var img = allimage[t + 1];
        //var originalUrl = img.attr('data-original');
        //if (originalUrl) {
        //    img.attr('src', originalUrl).attr('data-original', '');
        //}
        // 显示第几张图片
        //$('#piccount').find('span').eq(0).html(t + 1);
		$('.ttpb span').removeClass('cur');
		$('.ttpb span').eq(t).addClass('cur');
    }

    new Swiper1('#slider', {
        speed: 500,
        loop: false,
        onSlideChangeStart: function (swiper) {
            setTab(swiper.activeIndex);
        }
    });
    setTab(0);
    
	
	//打电话特殊处理
	if($('.tscl').length > 0){
		$('.tscl').click(function(){
			$('.floatAlert').show();
		});
		
		$('#closetel').click(function(){
			$('.floatAlert').hide();
		});
	}
	
	

    // 同价位楼盘（seo专用）
    var imgWidth = ($(window).width() - 30) / 2.5;
    var imgHeight = imgWidth / 120 * 80;
    $('#tongjiaweilp img').width(imgWidth);
    $('#tongjiaweilp h3').width(imgWidth);
    $('#tongjiaweilp img').height(imgHeight);
    var gfTagHei = $('.gf-tag').height();
    $('.gf-tag').height(imgHeight < gfTagHei ? gfTagHei : imgHeight);
    // ul宽度初始化
    var clearfixWidth = 15;
    // 计算ul宽度
    $('#tongjiaweilp li').each(function () {
        var $this = $(this);
        clearfixWidth += $this.width() + parseInt($this.css('margin-right'));
    });
    // 设置ul宽度
    $('#tongjiaweilp').width(clearfixWidth);
    // 设置可滑动
    $('#tjwlp .xqFav').addClass('tjwlpdiv');
    if ($('.tjwlpdiv').length) {
        new IScrolllist('.tjwlpdiv', {scrollX: true, bindToWrapper: true, eventPassthrough: true});
    }

	if($('#gundong').length>0){
		// 实时交易滚动
		setInterval(function () {
			if ($('#gundong ul').height() - $('#gundong').height() == $('#gundong').scrollTop()) {
				$('#gundong').scrollTop(0);
			} else {
				$('#gundong').scrollTop($('#gundong').scrollTop() + 1);
			}
		}, 100);
	}

    // 网上直销倒计时

	var wszxdaojishiTxt = '<b>' + $('.wskpdjs i').html() + '</b>';
	function wszxdaojishi () {
		var time = showTime($('.wskpdjs').attr('data'));
		if (time) {
			var showDom;
			if (time.timestamp > 0) {
				showDom = wszxdaojishiTxt + '<em>' + time.days + '</em><b>天</b><em>' + time.hours + '</em><b>时</b><em>' + time.minutes + '</em><b>分</b><em>' + time.seconds + '</em><b>秒</b>';
			} else {
				showDom = '';
			}
			$('.wskpdjs').html(showDom);
		}
	}
	if($('.wskpdjs').length>0){
		sjbInterval = setInterval(function () {
			wszxdaojishi();
			countDown = true;
		}, 1000);
	}


    var fromurl = document.referrer,
        iszhibo = '';
    if (fromurl.indexOf('live.fang.com') > -1 || fromurl.indexOf('livetest.fang.com') > -1) {
        iszhibo = true;
    } else {
        iszhibo = '';
    }

    // 直播预告
    $.get('/xf.d?m=liveNotice&newcode=' + vars.paramid + '&iszhibo=' + iszhibo + '&fromurl=' + fromurl, function (data) {
        if (data) {
            if (!iszhibo) {
                $('.xfLiveNotice').append(data);
            } else {
                $('.xflive').append(data);
            }

        }
    });
    // 直播控制（自由拖动）
    /*if ($('.xflive').length > 0) {
        require('modules/xf/live');
    }*/
    // 直播回放小角标
    $('#slider ul').after($('.getliveicon').html());
    $('.live-icon').on('click', function () {
        window.location.href = $(this).attr('href');
    });
    // 关闭按钮
    $('.xflive .close').on('click', function () {
        $('.xf-live').remove();
    });

    // 最下面的导航-------------satrt
    var $bottonDiv = $('.overboxIn');
    var $typeList = $('.typeListB');
    $bottonDiv.on('click', 'a', function () {
        var $this = $(this);
        $bottonDiv.find('a').removeClass('active');
        $this.addClass('active');
        $typeList.hide();
        $('.' + $this.attr('id')).show();
        if (!$this.attr('canSwiper')) {
            $this.attr('canSwiper', true);
            addSwiper($this);
        }
    });
    // 列表页底部滑动
    var setpage = function (obj, index) {
        var $span = $(obj).find('.pointBox span');
        $span.removeClass('cur').eq(index).addClass('cur');
    };
    var windoWidth = $(window).width();
    $('.typeListB').each(function () {
        var $this = $(this);
        $this.find('.swiper-wrapper').width(windoWidth * $this.find('.swiper-slide').length);
        $this.find('.swiper-slide').width(windoWidth).height($('.gfzn .swiper-wrapper').height());

    });
	var Swiper1 = require('swipe/3.10/swiper');
    var addSwiper = function (a) {
        new Swiper1('.' + a.attr('id'), {
            speed: 500,
            loop: false,
            onSlideChangeStart: function (swiper) {
                setpage('.' + a.attr('id'), swiper.activeIndex);
            }
        });
    };
    addSwiper($('.overboxIn a').eq(0));
    // 最下面的导航-------------------------------------------------end

    // 福袋（已下线）
    //require('modules/xf/showBonus');

	// 综合推荐中的北京楼盘随机跳转
	$('#lphz').on('click', function () {
		function getCharacter(){
			var character = String.fromCharCode(Math.floor( Math.random() * 26) + "A".charCodeAt(0));
			return character;
		}
		var randomCahracter = getCharacter();
		location.href = $(this).attr('data-href') + randomCahracter + '.htm';
	});


	// --------------wap新房楼盘详情页3.1&3.2期,2017年6月23日------------------------------
	var startX, startY, moveEndX, moveEndY, X, Y;
	if(vars.vrT!='1'){
	$('.topFocus').on('touchstart', function(e) {
		//e.preventDefault();
		startX = e.originalEvent.changedTouches[0].pageX;
		startY = e.originalEvent.changedTouches[0].pageY;
	});
	$('.topFocus').on('touchend', function(e) {
		//e.preventDefault();
		moveEndX = e.originalEvent.changedTouches[0].pageX,
			moveEndY = e.originalEvent.changedTouches[0].pageY,
			X = moveEndX - startX,
			Y = moveEndY - startY;
		if ((Math.abs(X) > Math.abs(Y) && X > 0) || (Math.abs(X) > Math.abs(Y) && X < 0) ) {
			location.href = $('.topFocus>a').attr('href');
		}
	});
	}


	$('.lpdh>div').addClass('lpdhdiv');
	$('.lpdhdiv ul').width($('.lpdhdiv li').length * 67);
	var myscroll = new IScrolllist('.lpdhdiv', {scrollX: true, scrollY: false, checkDOMChanges:true, bindToWrapper: true, eventPassthrough: true});


	// 向下滑动时相关效果
	// 页面滑动未超过200px时，页面向上滑动元导航慢慢消失，新导航逐渐显示，页面向下滑动，原导航逐渐显示，新导航消失。滑动页面滚动超过200px时新导航固定顶部。
	var headerNav = $('.lpdh');
	headerNav.css({
		'opacity': 0,
		'top': 0,
		'padding': 0
	}).show();
	function panduannav () {
		if ($('.newNav').is(':hidden')) {
			headerNav.show();
			var scrollH = $(window).scrollTop();
			var maxLen = 100;
			// 导航切换效果
			if (scrollH <= 100) {
				headerNav.css('opacity', scrollH / maxLen);
				if (scrollH === 0) {
					headerNav.hide();
				}
				// 向上移动屏幕
			} else {
				headerNav.show();
				headerNav.css('opacity', 1);
				myscroll.refresh();
			}
		}
	}
	panduannav();
	$(window).on('scroll', function () {
		panduannav();
	});

	// app下载
	require.async('app/1.0.0/appdownload', function ($) {
		$('.ljxz').openApp({
			position: 'xfDetailMid'
		});
	});

	module.exports = {
        init: function () {
            scajax();
            click();
            zygwajax();
            getAllActive(vars.paramcity, vars.paramid);
        }
    };
});
