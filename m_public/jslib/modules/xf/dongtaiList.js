define('modules/xf/dongtaiList',['jquery','util/util','search/newHouse/newHouseSearch'], function (require) {
    'use strict';
    var $ = require('jquery');
    var Util = require('util/util');
    var sfut = Util.getCookie('sfut');
    var vars = seajs.data.vars;
    // 查看历史记录按钮   默认展示1条  第一次按展示5条   第二次按全部展示
    var $moredt = $('.moredt');
    // 默认标识
    var flag = 0;
    // 前5条数据
    var $fivedt = $('.dongtai:lt(5)');
    // 全部数据
    var $dongtaiList = $('.dongtai');

    var Search = require('search/newHouse/newHouseSearch');

	var search = new Search();
	search.init();

    // 登录后获取用户名，手机号和用户ID
    var username, userphone, userid;

    function getInfo(data) {
        username = data.username || '';
        userphone = data.mobilephone || '';
        userid = data.userid || '';
    }

    /*
     *收藏方法
     */
    function HousingCollection() {
        var houseData = {
            face: $('.xqfocus img')[0].src,
            price: vars.xfinfoprice,
            userId: userid || ''
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

    function collectFlag(showDiv, hideDiv) {
        $(showDiv).show();
        $(hideDiv).hide();
        setTimeout(function () {
            $(showDiv).hide();
        }, 1500);
    }

    $moredt.click(function () {
        if (flag === 0) {
            $('.dt-int2').show();
            $fivedt.show();
            flag = 1;
        }else if (flag === 1) {
            $dongtaiList.show();
            $moredt.hide();
        }
    });

    // 布码
    setTimeout(function () {
        $('#wapdsy_D05_04').attr('id', 'wapxfdt_B07_05');
    }, 1000);
    var yibuma = false;
    $(document).on('scroll', function () {
        if ($('#wapesfsy_D04_01').length && !yibuma) {
            $('#wapesfsy_D04_01').attr('id', 'wapxfdt_B06_01');
            yibuma = true;
        }
    });

    // 调用ajax获取登陆用户信息
    if (sfut) {
        vars.getSfutInfo(getInfo);
    }
    // 收藏初始化--------------------------------------------------------start
    var fangName = $('#title').text();


    $(document).ready(function () {


        // 已收藏按钮显示异步加载
        $.get('/xf.d?m=scajax&id=' + vars.paramid + '&city=' + vars.paramcity, function (data) {
            if (data.root.code === '100' && sfut) {
                $("#shoucang").addClass('btn gray').html("已收藏").show();
            }
            $("#shoucang").show();
        });

        $("#shoucang").click(function () {
            var $this = $(this);
            if($this.hasClass('gray')) {
                return;
            }
            if (sfut) {
                var selectId = $(this).attr('name');
                // 如果已经收藏
                if ($this.hasClass('gray')) {
                    $.get('/xf.d?m=delFav&userphone=' + userphone + '&username=' + username + '&userid=' + userid + '&city=' + vars.paramcity + '&newcode=' + vars.paramid + '&projname=' + fangName + '&selectId=' + selectId + '&math=' + Math.random(),
                        function (data) {
                            if (data.root.code === '100') {
                                showMessage('取消收藏成功');
                                $this.removeClass('gray');
                            } else {
                                showMessage('网络不给力哦');
                            }
                        });
                } else {
                    $.get('/xf.d?m=addFav&userphone=' + userphone + '&username=' + username + '&userid=' + userid + '&city=' + vars.paramcity + '&newcode=' + vars.paramid + '&projname=' + fangName + '&image=http:' + $('.topFocus img').attr('src') + '&price=' + vars.xfinfoprice + '&address=' + vars.xfinfoaddress + '&math=' + Math.random(),
                        function (data) {
                            if (data.root.code === '100') {
                                //if (vars.paramcity == 'bj' || vars.paramcity == 'sh') {
                                //   $('.sctc').show();
                                //} else {
                                showMessage('收藏成功！有新动态时将会推送消息给您');
                                $this.addClass('gray');
                                $("#shoucang").html("已收藏");
                                $("#shoucang").show();
                                //}
                                //shoucang.addClass('on');
                                //shoucang.attr('name', data.root.result);
                                // 由于置业顾问的ID相同，故从打电话那里取的置业顾问的ID
                                //var yhxw = $('.dadianhua').attr('data-yhxw') || $('.dadianhua').attr('data-yhxw');
                                // 收藏的统计行为
                                //consultantyhxw(21, yhxw);
                            } else {
                                showMessage('网络不给力哦');
                            }
                        });
                }
            } else if (!sfut) {
                alert('请登录后再进行收藏操作！');
                window.location.href = 'https://m.fang.com/passport/login.aspx?burl=http%3a%2f%2fm.fang.com%2fxf%2f' + vars.paramcity + '/' + vars.paramid + '_dt' + vars.paramlpdtid + '.htm?' + Math.random();
                return;
            }
        });
    });

    var favoritemsg = $('#favorite_msg');
    favoritemsg.css({
        position: 'fixed',
        width: '130px',
        'background-color': 'rgba(0,0,0,.7)',
        'border-radius': '5px',
        color: '#fff',
        'font-size': '16px;line-height:1',
        'text-align': 'center',
        padding: '16px 0',
        'z-index': '9999',
        left: '50%',
        'margin-left': '-65px',
        top: '130px',
    })
    favoritemsg.attr('type','');
    function showMessage(msg) {
        // 65为favorite里设置了margin-left: -65px;
        var width = ($(window).width() - favoritemsg.width()) / 2 + 65;
        favoritemsg.html(msg).css({left: width + 'px'}).show();
        setTimeout(function () {
            favoritemsg.hide(500);
        } , 1500);
    }

    $moredt.click(function () {
        if (flag === 0) {
            $('.dt-int2').show();
            $fivedt.show();
            flag = 1;
        } else if (flag === 1) {
            $dongtaiList.show();
            $moredt.hide();
        }
    });



    require.async('//clickm.fang.com/click/new/clickm.js', function () {
        Clickstat.eventAdd(window, 'load', function (e) {
            Clickstat.batchEvent('wapxfdt_','');
        })
    });

    // 点击图片变大
    var imgData = [],
        wid = 600,
        hei = 400;
    $('.clearfix img').each(function () {
        var $this = $(this);
        imgData.push(
            {
                src: $this.attr('src'),
                w: wid,
                h: hei
            }
        )
    });
    $('.clearfix img').on('click', function () {
        var index = $(this).parent().index();
        require.async(['photoswipe/4.0.8/photoswipe3.min', 'photoswipe/4.0.8/photoswipe-ui-default3.min'], function (PhotoSwipe, PhotoSwipeUI) {
            var pswpElement = document.querySelectorAll('.pswp')[0];
            var options = {
                history: false,
                focus: false,
                index: index,
                showAnimationDuration: 0,
                hideAnimationDuration: 0,
                fullscreenEl: !1,
                shareEl: !1,
                tapToClose: !0
            };
            var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI, imgData, options);
            gallery.init();
        });
    });


 // 统计行为 --------------start
	require.async('jsub/_vb.js?c=xf_lp^dtxq_wap');
	require.async('jsub/_ubm.js?_2017102307fdsfsdfdsd', function () {
		_ub.city = vars.ubcity;
		// 业务---WAP端
		_ub.biz = 'n';
		// 方位（南北方) ，北方为0，南方为1
		_ub.location = vars.ublocation;
		// 用户动作（浏览0、搜索1、打电话31、即时通讯24、预约25）
		var b = 0;
		var pTemp = {
			// 所属页面
			'vmg.page': 'xf_lp^dtxq_wap',
			'vmg.sourceapp':vars.is_sfApp_visit + '^xf'

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

	// 统计行为 --------------end

	var rule = search.getRules(vars.paramcity + 'newXfHistory');
    _ub.request('vmn.genre,vmn.position');

    _ub.onload = function () {
        if (_ub.values['vmg.business'] && !(_ub.values['vmg.business'] instanceof Array)) {
            var xfScores = _ub.values['vmg.business'].N;
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
        city: vars.paramcity,
        id: vars.paramid
	}, rule);

    $.post('/xf.d?m=xiHuanLouPanList&source=dthx&math=' + Math.random(), ajaxData, function (result) {
        if ($.trim(result)) {
            $('#ganxingqulp .favList').html(result);
            $('#ganxingqulp').show();

        }
    });
    };
    });



});