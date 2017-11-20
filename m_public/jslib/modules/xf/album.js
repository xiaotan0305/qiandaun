define('modules/xf/album', ['jquery', 'util/util', 'klass/1.0/klass', 'photoswipe/photoswipe-3.0.5n', 'iscroll/2.0.0/iscroll-lite'],
    function (require) {
        'use strict';
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var IScrolllist = require('iscroll/2.0.0/iscroll-lite');
        var jjtag = $('#set_tag_pos .jj-tag');
        var tagpos = $('#set_tag_pos');
        var imgdetail = $('#imgdetail');
		// 用来控制部分dom的显示以及隐藏，当触发事件时，为0隐藏，为1不隐藏
		var flag = 0;

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

        unable();

        // 用户行为统计start
        // 对用户行为进行记录	此方法在houseinfotj.js中有调用
        function yhxw1() {
            _ub.city = vars.city;
            _ub.biz = 'n';
            // 业务---WAP端
            _ub.location = vars.getfrom;
            // 方位（南北方) ，北方为0，南方为1
            var b = 0;
            // 用户动作（浏览0、搜索1、打电话31、即时通讯24、预约25、收藏21、分享22）
            var tplx = '';
            var huxing = '';
            if ($('.item_click').hasClass('ablue')) {
                tplx = $('#album_foot .ablue').text();
            }
            if (tplx === '户型图') {
                if (imgdetail.text().indexOf('室') > 0) {
                    huxing = imgdetail.text().substring(0, 1) + '居';
                }
            }
            var pTemp = {
                // 楼盘id
                'vmn.projectid': vars.mnlid,
                // 关注的图片类型
                mnw: encodeURIComponent(tplx),
                // 户型
                mnu: encodeURIComponent(huxing)
            };
            // 用户行为(格式：'字段编号':'值')
            var p = {};
            // 若pTemp中属性为空或者无效，则不传入p中
            for (var temp in pTemp) {
                if (pTemp[temp]) {
                    p[temp] = pTemp[temp];
                }
            }
            p['vmg.page'] = 'mnhphotopage';
            p['vmn.phototype'] = '';
            p['vmg.sourceapp'] = vars.is_sfApp_visit + '^xf';
            _ub.collect(b, p); // 收集方法
            // 浏览收集方法
            load1();

            // 设置底部导航长度
            var scrollerWidth = 14;
            $('#scroller a').each(function () {
                scrollerWidth += $(this).width() + 30 + 4;
            });
            $('#scroller').css('width', scrollerWidth);
            // 底部导航滑动
            new IScrolllist('#album_foot', {scrollX: true, bindToWrapper: true, eventPassthrough: true});
        }

        var curnumber = vars.curnumber;
        var bodydom = $('body');

        function load1() {
            var bua = navigator.userAgent.toLowerCase();
            if (bua.indexOf('iphone') >= 0 || bua.indexOf('ipod') >= 0) {
                bodydom.height(window.innerHeight + 100);
                window.scrollTo(0, 1);
                bodydom.height(window.innerHeight);
            }
            var myPhotoSwipe = window.Code.PhotoSwipe.attach(window.document.querySelectorAll('#Gallery a'), {
                allowUserZoom: true,
                preventHide: true,
                captionAndToolbarHide: true,
                loop: false
            }, false);
            myPhotoSwipe.show(parseInt(curnumber));
            fcenter();

            $('.main').on('touchend', '#scroller a', function () {
                var ingNum = $(this).attr('num').split('_'); // ["0", "8"]
                var shownum = parseInt(ingNum[0]); // 0
                // 改变图片
                myPhotoSwipe.slideCarousel(shownum);

                // 户型图情况
                if ($(this).html() == '户型图') {
                    if ($('#img_' + shownum + ' a').attr('alt').indexOf('㎡') == -1) {
                        // 改变右边小分数
                        var fenZi = $('#img_' + shownum + ' a').attr('alt').split('图')[1].split('/')[0];
                        var fenMu = $('#img_' + shownum + ' a').attr('alt').split('图')[1].split('/')[1];
                        $('.flor').html('<span class=\"f14\">' + fenZi + '</span> / ' + fenMu);
                        // 改变左边
                        $('.flol').html($('#img_' + shownum + ' a').attr('alt').split('图')[0] + '图');
                    } else {
                        // 改变右边小分数
                        var fenZi = $('#img_' + shownum + ' a').attr('alt').split('㎡ ')[1].split('/')[0];
                        var fenMu = $('#img_' + shownum + ' a').attr('alt').split('㎡ ')[1].split('/')[1];
                        $('.flor').html('<span class=\"f14\">' + fenZi + '</span> / ' + fenMu);
                        // 改变左边
                        $('.flol').html($('#img_' + shownum + ' a').attr('alt').split('㎡ ')[0] + '㎡（建筑面积）');
                    }
                } else {
                    // 改变右边小分数
                    $('.flor').html('<span class=\"f14\">1</span> / ' + parseInt(ingNum[1] - parseInt(ingNum[0])));
                    // 改变左边
                    $('.flol').html($('#img_' + shownum + ' a').attr('alt').replace(/[^\u4e00-\u9fa5]/gi,''));
                }
                // 点击底部导航变红
                $(this).addClass('active').siblings().removeClass('active');
            });
            function fcenter() {
                var flyers = $('#play_button');
                var locheight = parseInt((window.innerHeight - 60) / 2);
                var locWidth = parseInt((window.innerWidth - 60) / 2);
                flyers.css({
                    top: locheight,
                    left: locWidth
                });
                $('#play_button_fullView').css({
                    top: locheight,
                    left: locWidth
                });
            }

            window.onresize = function () {
                fcenter();
            };

            function stringToJson(stringValue) {
                var theJsonValue = eval('(' + stringValue + ')');
                return theJsonValue;
            }

            function setLogoPosition() {
                tagpos.hide();
                setTimeout(function () {
                    var allbiaodian = vars.allbiaodian;
                    if (allbiaodian) {
                        var allbiaodianPosition = typeof allbiaodian === 'string'?stringToJson(allbiaodian):allbiaodian;
                        var videoLength = vars.videoLength;
                    }
                    var temp = myPhotoSwipe.getCurrentImage().imageEl;
                    var photoIndex = myPhotoSwipe.currentIndex;
                    var trueIndex = photoIndex - videoLength;
                    if (trueIndex < 0) {
                        return;
                    }
                    var truePosition = allbiaodianPosition[trueIndex];
                    var left = temp.style.left.replace('px', '').trim();
                    var top = temp.style.top.replace('px', '').trim();
                    var width = temp.style.width.replace('px', '').trim();
                    var height = temp.style.height.replace('px', '').trim();
                    if (!(truePosition && truePosition[0] && truePosition[1] && truePosition[2] && truePosition[1] !== -1)) {
                        return;
                    }
                    top = truePosition[0] * height - top * (-1);
                    left = truePosition[1] * width - left * (-1);
                    jjtag.css({
                        top: top + 'px',
                        left: left + 'px'
                    }).addClass('active').attr('href', truePosition[2]);
                    tagpos.show();
                }, 50);
            }

            myPhotoSwipe.addEventHandler(window.Code.PhotoSwipe.EventTypes.onTouch, function (e) {
                // photoswipe中用来监听touchstart以及touchmove等事件的函数
                if (e.action === 'touchStart') {
                    flag = 0;
                }
                if (e.action === 'touchMove') {
                    flag = 1;
                }
            });
            myPhotoSwipe.addEventHandler(window.Code.PhotoSwipe.EventTypes.onDisplayImage, function (e) {
                setLogoPosition(e);
            });
            myPhotoSwipe.addEventHandler(window.Code.PhotoSwipe.EventTypes.onResetPosition, function (e) {
                setLogoPosition(e);
            });
            myPhotoSwipe.addEventHandler(window.Code.PhotoSwipe.EventTypes.onResetPosition, function (e) {
                setLogoPosition(e);
            });
        }

        var n = 0;
        var hideOther = 0;

        // 页面初始化时
        var that = $('#scroller').find('a:eq(0)');
        var ingNum = that.attr('num').split('_'); // ["0", "8"]
        var shownum = parseInt(ingNum[0]); // 0
        // 改变右边小分数
        $('.flor').html('<span class=\'f14\'>1</span> / ' + parseInt(ingNum[1] - parseInt(ingNum[0])));
        // 改变左边
        if (that.html() == '户型图') {
            // $('.flol').html($('#img_' + shownum + ' a').attr('alt'));
            if ($('#img_' + shownum + ' a').attr('alt').indexOf('㎡') == -1) {
                // 改变右边小分数
                var fenZi = $('#img_' + shownum + ' a').attr('alt').split('图')[1].split('/')[0];
                var fenMu = $('#img_' + shownum + ' a').attr('alt').split('图')[1].split('/')[1];
                $('.flor').html('<span class=\"f14\">' + fenZi + '</span> / ' + fenMu);
                // 改变左边
                $('.flol').html($('#img_' + shownum + ' a').attr('alt').split('图')[0] + '图');
            } else {
                // 改变右边小分数
                var fenZi = $('#img_' + shownum + ' a').attr('alt').split('㎡ ')[1].split('/')[0];
                var fenMu = $('#img_' + shownum + ' a').attr('alt').split('㎡ ')[1].split('/')[1];
                $('.flor').html('<span class=\"f14\">' + fenZi + '</span> / ' + fenMu);
                // 改变左边
                $('.flol').html($('#img_' + shownum + ' a').attr('alt').split('㎡ ')[0] + '㎡（建筑面积）');
            }
        } else {
            $('.flol').html($('#img_' + shownum + ' a').attr('alt').replace(/[^\u4e00-\u9fa5]/gi,''));
        }

        function hideother() {
            if (hideOther === 0) {
                $('.photo-opt, .pic-int, .pic-btns').hide();
                hideOther = 1;
            } else {
                $('.photo-opt, .pic-int, .pic-btns').show();
                hideOther = 0;
            }
        }

        function callBack() {
            if (n === 1) {
                hideother();
            }
            n = 0;
        }

        $(document).on('touchend', function (ev) {
            if (ev.target.getAttribute('class') === 'ps-uilayer' && flag === 0) {
                n += 1;
                var timer = setTimeout(function () {
                    callBack();
                }, 300);
                if (n === 2) {
                    clearTimeout(timer);
                }
            }
        });

		// 统计行为start （2016年5月16日）
		function yhxw() {
			// 所在城市（中文）
			_ub.city = vars.city;
			// 新房“n”
			_ub.biz = 'n';
			// 方位 ，网通为0，电信为1，如果无法获取方位，记录0
			_ub.location = vars.ublocation;
			// 浏览收集方法
			_ub.collect(0, {
				// 所属页面
				'vmg.page': 'mnhphotopage',
				// 楼盘id
				'vmn.projectid': vars.newcode,
				// 相册类型
				'vmn.phototype': ''
			});
		}

		require.async('jsub/_vb.js?c=mnhphotopage');
		require.async('jsub/_ubm.js?_2017102307fdsfsdfdsd', function () {
            yhxw1();
            //yhxw();
		});
		// 统计行为end
    });