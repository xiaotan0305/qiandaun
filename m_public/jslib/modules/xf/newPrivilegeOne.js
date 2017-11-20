/**
 * 房源详情页
 * by WeiRF
 * 20151203 WeiRF 删除冗余代码
 */
define('modules/xf/newPrivilegeOne',
    ['jquery', 'util/util','swipe/3.10/swiper','modules/xf/showPhoto','modules/xf/shadowCall', 'superShare/1.0.1/superShare'],
    function (require) {
        'use strict';
        var $ = require('jquery');
        var Util = require('util/util');
        var Swiper = require('swipe/3.10/swiper');
        var shadowCall = require('modules/xf/shadowCall');
        var vars = seajs.data.vars;
        var localStorage = vars.localStorage;
        // 登录的cooike
        var sfut = Util.getCookie('sfut');
        // 登录后获取用户名，手机号和用户ID
        var userId, userphone, username;
        function getInfo(data) {
			username = data.username || '';
			userphone = data.mobilephone || '';
            userId = data.userid || '';
            collectData.userphone = userphone;
        }
        // 调用ajax获取登陆用户信息
        if (sfut) {
            vars.getSfutInfo(getInfo);
        }
        // 电话号码替换
        shadowCall();
        //	点击滑动效果
        var continueDrag = $('#continueDrag');

        // 点击选择显示
        $('#detail_tax_tejia').on('click','a', function () {
            $('#detail_tax_tejia a').removeClass('active');
            $(this).addClass('active');
            $('#detail_tax_tejia').siblings().hide();
            $('#detail_tax_tejia').siblings().eq($(this).index()).show();
        });

        // 图片宽度设置为屏幕宽度
        $('.swiper-container').show();
        var imgHei = $(window).width() / 1.5;
        $('.xqfocus img').each(function () {
            var $this = $(this);
            if ($this.attr('data-original')) {
                $this.load(function () {
                    if($this.height() > $this.width()) {
                        $this.width(imgHei / $this.height() * $this.width());
                    } else {
                        $this.width($(window).width());
                    }
                    $this.height(imgHei);
                })
            } else {
                if($this.height() > $this.width()) {
                    $this.width(imgHei / $this.height() * $this.width());
                } else {
                    $this.width($(window).width());
                }
                $this.height(imgHei);
            }
        });

        // 图片效果----------start
        var img = $('.xqfocus img');
        var picLength = img.length;
        if (picLength) {
            $('.swiper-container .num2').html(img.eq(0).attr('alt').replace(/[^\u4e00-\u9fa5]/gi, '') + 1 + '/' + picLength);
            Swiper('.swiper-container', {
                speed: 500,
                resistanceRatio: 0,
                onSlideChangeStart: function (swiper) {
                    $('.swiper-container .num2').html(img.eq(swiper.activeIndex).attr('alt').replace(/[^\u4e00-\u9fa5]/gi, '') + (swiper.activeIndex + 1) + '/' + picLength);
                }
            });
        }

        /*
         *在线咨询
         */
        function chatxf(zhcity, city, housetype, houseid, newcode, type, phone, channel, uname, aname, agentid, zhname, agentImg, username, zygwLink) {
            localStorage.foobar = 'foobar';
            var com = '';
            if (vars.xfinfoComarea) {
                com = '[' + vars.xfinfoComarea + ']';
            }
            var projname = vars.projname;
            localStorage.setItem(username + '_allInfo', encodeURIComponent(projname) + ';' + $('#price span').eq(0).html()
                + ';' + encodeURIComponent(vars.houseFeature) + ';' + $('img[name="imagename"]')[0].src + ';'
                + encodeURIComponent(vars.district) + ';' + encodeURIComponent(com + vars.address)
                + ';' + '/xf/' + city + '/' + houseid + '_' + vars.fangid + '.htm'
            );
            localStorage.setItem('fromflag', 'xfinfo');
            localStorage.setItem('x:' + username + '', encodeURIComponent(zhname) + ';' + agentImg + ';' + encodeURIComponent(projname + '的') + ';' + zygwLink);
            $.ajax({
                url: '/data.d?m=houseinfotj&city=' + city + '&housetype=' + housetype + '&houseid=' + houseid
                + '&newcode=' + newcode + '&type=' + type + '&phone=' + phone + '&channel=' + channel + '&agentid=' + agentid,
                async: false
            });
            setTimeout(function () {
                window.location = '/chat.d?m=chat&username=x:' + uname + '&city=' + city + '&type=wapxf';
            }, 500);
        }

        // 点评、动态、论坛板块
        var dpdtlt = Swiper('#ddlslider', {
            loop: true,
            onSlideChangeEnd: function (swiper) {
                var navtab = $('.dong_comment_fortum a'),
                    t = swiper.activeIndex - 1,
                    len = navtab.length,
                    activeIndex = swiper.activeIndex;
                if (activeIndex > len) {
                    t = activeIndex - (len + 1);
                } else if (t < 0) {
                    t = len - activeIndex - 1;
                }
                navtab.removeClass('active');
                $(navtab[t]).addClass('active');
            }
        });
        var slideTo = function (index) {
            dpdtlt.slideTo(index, 500, true);
        };

        /*
         *点击，点评、动态、论坛按钮展示效果
         */
        $('.dong_comment_fortum').on('click', 'a', function () {
            // 如果点击的是点评并且点评是选中状态，则跳转
            if ($(this).find('span').html() === '点评' && $(this).hasClass('active')) {
                window.location = '/xf/' + vars.paramcity + '/' + vars.paramid + '/dianping.htm';
            } else {
                //  显示要展示的东西
                slideTo($(this).index() + 1);
            }
        });

        // 收藏
        var myselectId = vars.myselectId;
        var $favoriteMsgId = $('#favorite_msg');

        /*
         *显示收藏或取消收藏的信息
         */
        function showMsg(msg) {
            // var width = (document.body.offsetWidth / 3);
            $favoriteMsgId.html(msg).show();
            setTimeout(hideMessage, 1500);
        }

        /*
         *显示信息
         */
        function hideMessage() {
            $('#favorite_msg').hide(500);
        }

        /*
         *点击收藏按钮所执行的方法
         */
        function checkHousingCollection() {
            if (sfut) {
                if (!myselectId || myselectId < 1) {
                    HousingCollection();
                } else {
                    delHousingCollection();
                }
            } else {
                // 去登陆
                window.location.href = 'https://m.fang.com/passport/login.aspx?burl=/xf%2F' + vars.city + '%2F' + vars.newcode + '%5F' + vars.fangid + '.htm';
            }
        }
        // 收藏和取消收藏的ajax请求所公共的参数
        var collectData = {
            userphone: userphone,
            username: vars.username,
            houseId: vars.newcode,
            name: vars.projname,
            address: vars.address,
            city: vars.city,
            fangyuanId: vars.fangid
        };

        /*
         *收藏方法
         */
        function HousingCollection() {
            var houseData = {
                face: $('img[name="imagename"]')[0].src,
                price: vars.xfinfoprice,
                userId: userId || ''
            };
            var data = $.extend(collectData, houseData);
            var url = '/xf.d?m=housingCollection';
            $.ajax({
                type: 'post',
                url: url,
                data: data,
                dataType: 'json',
                async: false,
                success: function (result) {
                    if (result.root.result === '100') {
                        $('#wapfyxq_B05_02').attr('class', 'icon2 on');
                        myselectId = result.root.myselectId;
                        showMsg('收藏成功，可在我的新房-收藏查看');
                    }
                }
            });
        }

        /*
         *取消收藏方法
         */
        function delHousingCollection() {
            var delHouseData = {
                myselectId: myselectId,
                cityName: vars.utf8city,
                userId: userId || ''
            };
            var data = $.extend(collectData, delHouseData);
            var url = '/xf.d?m=delHousingCollection';
            $.ajax({
                type: 'post',
                url: url,
                data: data,
                dataType: 'json',
                async: false,
                success: function (result) {
                    if (result.root.result === '100') {
                        $('#wapfyxq_B05_02').attr('class', 'icon2');
                        myselectId = '';
                        showMsg('取消收藏');
                    }
                }
            });
        }

        /*
         *打电话统计
         */
        function teltj(city, housetype, houseid, newcode, type, phone, channel, agentid) {
            $.ajax({
                url: '/data.d?m=houseinfotj&city=' + city + '&housetype=' + housetype + '&houseid=' + houseid
                + '&newcode=' + newcode + '&type=' + type + '&phone=' + phone + '&channel=' + channel + '&agentid=' + agentid,
                async: true
            });
        }
        // 在线咨询
        $('#wapfyxq_B05_01').click(function () {
            chatxf(vars.getcityname, vars.city, 'xf', vars.newcode, '', 'chat', vars.tel400, 'waphouseinfo', vars.encodeusename,
                vars.encoderealname, vars.userid, vars.realname, vars.getImgPath, vars.username, vars.lastParam
            );
            // 在线咨询统计
            yhxw(24);
        });
        // 收藏
        $('#wapfyxq_B05_02').click(function () {
            checkHousingCollection();
            // 收藏统计
            yhxw(21);
        });
        // 绑定头部返回到顶部
        $('#header').click(function () {
            $(document.body).animate({scrollTop: 0}, 100);
        });
        // 打电话
        $('#wapfyxq_B05_03').click(function () {
            teltj(vars.city, 'xf', '', vars.paramid, 'call', vars.utf8tel400, 'waphouseinfo', '');
            // 打电话统计
            yhxw(31);
        });
        // 点击事件统计
        require.async('//click.fang.com/stats/click2011.js', function () {
            Clickstat.eventAdd(window, 'load', function () {
                Clickstat.batchEvent('wapfyxq_', '');
            });
        });
        // 引入统计代码
        require.async('jsub/_vb.js?c=mnhtypepage');
        require.async('jsub/_ubm.js?v=201407181100', function () {
            _ub.city = decodeURIComponent(vars.utf8city);
            // 业务---WAP端
            _ub.biz = 'n';
            // 方位（南北方) ，北方为0，南方为1
            _ub.location = vars.ublocation;
            // 用户动作（浏览0、搜索1、打电话31、即时通讯24、预约25）
            var b = 0;
            var pTemp = {
                // 楼盘id
                'vmn.projectid': vars.newcode,
                // 户型
                'vmn.housetype': encodeURIComponent(vars.houseType),
                // 所属页面
                'vmg.page': 'mnhtypepage'

            };
            // 用户行为(格式：'字段编号':'值')
            var p = {};
            // 若pTemp中属性为空或者无效，则不传入p中
            for (var temp in pTemp) {
                if (pTemp[temp] && pTemp[temp].length > 0) {
                    p[temp] = pTemp[temp];
                }
            }
            // 收集方法
            _ub.collect(b, p);
        });
        function yhxw(type) {
            // 收集方法
            _ub.collect(type, {
                'vmn.consultantid': vars.userid,
                'vmn.projectid': vars.newcode,
                // 所属页面
                'vmg.page': 'mnhtypepage'
            });
        }

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

        var fangyuanName = $('title').html().split('】')[0] + '】' || $('title').html();
        var SuperShare = require('superShare/1.0.1/superShare');
        var config = {
            // 分享内容的title
            title: '我发现了一个不错的房源' + fangyuanName + ': ',
            // 分享时的图标
            image: $('.swiper-wrapper img').eq(0).attr('src'),
            // 分享内容的详细描述
            desc: fangyuanName + '位于' + vars.address + ',' + vars.xfinfoprice + ',' + vars.xfinfophone + ',更多详情请点击',
            // 分享的链接地址
            url: location.href,
            // 分享的内容来源
            from: 'xf'
        };
        var superShare = new SuperShare(config);


		// 引入新房端口效果统计代码
		// 城市名称（需UTF-8 编码，值必填）
		var utf8CodeCity = vars.utf8city ,
			// 值Y或N，Y是北方，N是南方，值必填
			isNorth = vars.ublocation == '0' ? 'Y' : 'N',
			// 出售出租（值cs或cz,值必填）
			zushoutype = 'cs',
			// 经纪人id（值为数字，值必填）
			agentID = vars.userid,
			// 房源id：houseid=123456（值为数字，值必填）
			houseID = vars.fangid,
			// 来源页面地址（需要escape() 编码，值为URL地址，值可空）
			refurl = '',
			// 点击来源平台：sPlatform=1（值为：1=PC；3=APP；2=Wap，值必填）
			sPlatform = '2',
			// 点击的来源页面：sPage=1（值为：1=搜索列表页；2=经纪人店铺页；3=推荐房源；4=小区网；5=联盟；6=网店；0=其它未分类的页面，值必填，默认0）
			spage = '1',
			// 手机IMEI号：imei=123123，默认空（值可选）
			imei = '',
			// 点击位置: wap端app端默认空
			sPosition = '',
			// 渠道来源：Channel。0=普通没有渠道，1=分享。 默认为0
			channel = '0';
		require.async('http://js.ub.fang.com/_ubm.js?v=201707201014');
		require.async('http://img.soufun.com/secondhouse/image/esfnew/scripts/ClickPayCount/ClickPayDataCollect.js?v=201707201014', function () {
			var cpdc = new ClickPayDataCollect(
				utf8CodeCity, isNorth, zushoutype, agentID, houseID, refurl, sPlatform, spage, imei, sPosition, channel
			);
			//构造函数的参数顺序要与ClickPayDataCollect.js里方法 ClickPayDataCollect方法参数顺序一致，如果某个参数没有值需要空字符占位，参数说明见下面红色部分。
			setTimeout(cpdc.writeLog(),1000);
		});
    });
