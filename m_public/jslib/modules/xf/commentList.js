/**
 * 点评列表页
 * by WeiRF
 * 20151203 WeiRF 删除冗余代码
 */
define('modules/xf/commentList',
    ['jquery', 'util/util','modules/xf/IcoStar','modules/xf/showPhoto', 'superShare/1.0.1/superShare', 'weixin/1.0.1/weixinshare', 'swipe/3.10/swiper'],
    function (require) {
        'use strict';
        var $ = require('jquery');
        var Util = require('util/util');
        var vars = seajs.data.vars;
        var sfut = Util.getCookie('sfut');
        var IcoStar = require('modules/xf/IcoStar');
        // 小图变大图插件
        var ShowPhoto = require('modules/xf/showPhoto');
        // 判断是否有红包
        if (vars.redbag) {
            require.async('modules/xf/redbag');
        }
		var Swiper = require('swipe/3.10/swiper');

        // 微信分享功能
        var wx = require('weixin/1.0.1/weixinshare');
        var reg = /搜房网/g;
        var weixin = new wx({
            shareTitle: ($('.bgproname').html() + '怎么样').replace(reg, '房天下'),
            descContent: ('综合评分：' +  $('.bgscore').html() + '分\n' + '共' + $('.bgcount').html() + '条评论').replace(reg, '房天下'),
            imgUrl: $('.bgpic').html().trim(),
            lineLink: window.location.href + ((location.href.indexOf('?') > -1) ? '&' : '?') + 'cshare=share',
        });

        // 控制星星亮
        var icoStarObj = new IcoStar('.ico-star');
        // 点击导航（全部、精华...）
        var $flexbox = $('#flexbox');
        // 导航下的a标签
        var $flexboxA = $flexbox.find('a');
        // 存储点击过的导航标签，主要是解决在下次点击时不需要ajax请求
        var $flexboxPage = {all: 2};
		if (vars.paramTag) {
			var paramTag = vars.paramTag;
			$flexboxPage = {};
			$flexboxPage[paramTag] = 2;
		}
        // 加载更多按钮
        //var $draginner = $('.draginner');
        // 参数（已忘记做什么用的了）
        var mstype = vars.parammstype;
        if (mstype !== 'logout') {
            // 调用ajax获取登陆用户信息
            if (sfut) {
                vars.getSfutInfo(getInfo);
            }
        }
        var clicked = [];
        var canLoad = true;
        // 登录后获取用户名，手机号和用户ID...
        var mobilephone, username, userid,ismobilevalid;
        function getInfo(data) {
            mobilephone = data.mobilephone;
            username = data.username;
            userid = data.userid;
            ismobilevalid = data.ismobilevalid;
        }
        // 发表点评时上面的遮盖层
        var $blackback = $('#blackback');
        // 发表点评的div
        var $boxshaow = $('.boxshaow');
        // 浏览器兼容性 --------------start
        var UA = window.navigator.userAgent;
        if (/iPhone/.test(UA)) {
            var s = UA.substr(UA.indexOf('iPhone OS ') + 10, 3);
            if (parseFloat(s[0] + s[2]) < 72 || /UCBrowser/.test(UA)) {
                $('.boxshaow .ipt-txt').on('focus', function () {
                    if (window.orientation === 90)return;
                    var $this = $boxshaow;
                    var winH = $(window).height();
                    var oldScrollTop = $(window).scrollTop();
                    setTimeout(function () {
                        var $thisH = $this.offset().top;
                        var newScrollTop = $(window).scrollTop();
                        if ($(document).outerHeight(true) - oldScrollTop <= winH)return;
                        $(window).scrollTop(oldScrollTop);
                        $('.boxshaow, #blackback').css('bottom', winH - 2 * ($thisH - newScrollTop) - $this.outerHeight() + 'px');
                        $blackback.css('min-height', '100%');
                    },200);
                }).blur(function () {
                    $('.boxshaow, #blackback').css('bottom', '0px');
                });
            }
        }
        // 发表点评时上面的遮盖层的点击事件
        $blackback.on('click', function () {
            $boxshaow.hide();
            $blackback.hide();
            document.removeEventListener('touchmove',removeTouch);
            canLoad = true;
        });
        // 发表点评按钮
        var $iptsub = $('.ipt-sub');

        /*
        *检测发表的内容
         */
        function checkContent(a) {
            var content = a.text().trim();
            if (!content) {
                alert('回复内容不能为空');
                return false;
            }else if (content.length > 40) {
                alert('回复内容不能超过40字');
                return false;
            } else {
                return content;
            }
        }
       
        // 点赞、回复、更多
        $('#gradelist .comment-list').on('click', '.comment-sum .dianzan', function () {
            var $this = $(this);
            if (checkLogin()) {
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
                } 
            }
        });

       

        // 点击评论人跳转
        $('#gradelist').find('.comment-list').on('click', 'dd[name="hiscomment"]', function () {
            if ($(this).attr('anonymous') === '0') {
                window.location.href = '/xf.d?m=getSomeCommentList' + '&userid=' + $(this).attr('data-name')
                    + '&type=&zanuserid=' + userid + '&page=' + vars.paramp + '&pagesize=10' + '&imei=' + 1;
            }
        });
        // 点评赚积分按钮
        $('#ckeckLogin').click(function () {
            var href = encodeURIComponent(window.location.href);
            if (!userid) {
                alert('请登录后点评！');
                window.location.href = ' https://m.fang.com/passport/login.aspx?burl=' + href;
                return false;
            }
            if (ismobilevalid !== '1' || !mobilephone) {
                alert('依据《互联网用户账号名称管理规定》，2015年9月1日起未绑定手机号的用户将禁止发布内容，请您尽快完成认证');
                window.location.href = 'https://m.fang.com/passport/resetmobilephone.aspx?burl=' + href;
                return false;
            }
            if (userid && mobilephone) {
                window.location.href = '/xf/' + vars.paramcity + '/houseComment/' + vars.paramId + '.html';
                return true;
            }
        });

        // 判断显示更多a标签的小箭头是否显示
        $('.comment-tab-c').css('max-height', 'none');
        if ($('.comment-tab-c').height() > 64) {
            $('.comment-tab .comment-more').show();
        } else {
            $('.comment-tab .comment-more').hide();
        }
        $('.comment-tab-c').css('max-height', '64px');

        // 显示更多a标签
        $('.comment-tab .comment-more').on('click', function () {
            $(this).hide();
            $('.comment-tab-c').css('max-height', 'none');
        });

        // 点击导航下的a标签
        $flexboxA.on('click',function () {
            var namevalue = flexboxShow(this);
            if (!$flexboxPage[namevalue]) {
                $flexboxPage[namevalue] = 1;
            }
            $('#gradelist section[name='+ namevalue +']').siblings().hide();
            $('#gradelist section[name='+ namevalue +']').show();
            var $this = $(this);
            if (!$this.attr('isFirst')) {
                $this.attr('isFirst', 'true');
                load(namevalue);
            }
        });

		// ajax锁
		var judgeClick = true;
		$('#drag').hide();

		if ($('#flexbox .active').length) {
			// 判断是否自动展开
			if ($('#flexbox .active').position().top >= $('.comment-tab-c').position().top + $('.comment-tab-c').height()) {
				$('.comment-tab .comment-more').click();
			}

			var nowName = $('#flexbox .active').attr('name');
			if (nowName != 'all') {
				var html = $('#gradelist section[name="all"] ul').html();
				$('#gradelist section[name="all"] ul').html('');
				$('#flexbox .active').click();
				$('#gradelist section[name=' + nowName + '] ul').html(html);
			}

		}


        /*
        *导航头部变化
         */
        function flexboxShow(that1) {
            if (judgeClick) {
                $flexboxA.removeClass();
                $(that1).addClass('active');
                $('.grade-list').hide();
                var namevalue = $(that1).attr('name');
                $('#gradelist section[name=' + namevalue + ']').show();
                return namevalue;
            }
        }

        /*
        * 请求加载
         */
        function load(str) {
            if (judgeClick) {
                judgeClick = false;
                var flexboxNum = Math.ceil(Number($flexbox.find('.active').attr('data-num')) / 10);
                // 还有可以加载的
                if (flexboxNum >= $flexboxPage[str]) {
                    //$draginner.css('padding-left', '10px').html('正在加载请稍候');
                    $('#drag').show();
                    $.post('/xf.d?m=commentList',
                        {
                            id: vars.paramId,
                            city: vars.paramcity,
                            p: $flexboxPage[str],
                            userid: vars.paramuserid,
                            type: str
                        },
                        function (data) {
                            if (data) {
                                $('section[name=' + str + ']').find('ul').append(data);
								xbhfPanduan();
                                if (flexboxNum >= ($flexboxPage[str] += 1)) {
                                    //$draginner.css({'padding-left': '0px', background: ''}).html('上拉自动加载更多');

                                } else {
                                    //$draginner.html('');
                                    $('#drag').hide();
                                }
                            } else {
                                alert('请求失败');
                            }
                            // 控制星星亮
                            icoStarObj.init();
                            // 调用刷新点击事件
                            showMoreId();
                            judgeClick = true;
                        });
                } else {
                    judgeClick = true;
                    $('#drag').hide();
                }
            }
        }
        //load('all');

        /*
        *判断是否显示更多按钮
         */
        function showMoreId() {
            $('.comment-text').each(function () {
                var $this = $(this);
                var ud = $this.attr('name');
                var line = 72;
                var ph1 = parseInt($('p[name=' + ud + ']:eq(0)').height());
                if (ph1 > line) {
                    $('div [name=more_' + ud + ']').show();
                }
            });
        }
        showMoreId();
        function removeTouch(e) {
            e.preventDefault();
        }

        // 点击小箭头显示更多
        $('#gradelist').on('click', '.down', function () {
            var $this = $(this);
            // 显示全部内容 更多按钮隐藏
            $this.siblings('.comment-text').attr('style','');
			$this.hide();
            $this.next().show();
        });
		
		 // 点击小箭头隐藏更多
        $('#gradelist').on('click', '.up', function () {
            var $this = $(this);
            // 显示全部内容 更多按钮隐藏
            $this.siblings('.comment-text').attr('style','max-height:69px;');
			$this.hide();
            $this.prev().show();
        });

        // 点击文字与点击显示更多的作用相同
        $('#gradelist').on('click', '.comment-text', function () {
        	var $this = $(this);
			window.location.href = $this.attr('data-href');
        });

        /*
        *回复后的内容显示在回复的ul里
         */
        function zhanshihuifu(tid) {
            $.post('/xf.d?m=dphf', {tid: tid, newcode: vars.paramId, city: vars.paramcity}, function (data) {
                if (data) {
                    $('.' + tid).empty().append(data).show();
                }
            });
        }

        /*
        * 检查是否登录
         */
        function checkLogin() {
            var href = encodeURIComponent(window.location.href);
            if (!userid) {
                alert('请登录后操作！');
                window.location.href =  'https://m.fang.com/passport/login.aspx?burl=' + href;
                return false;
            }
            return true;
        }

        /*
         * 滚动到页面底部时，自动加载更多
         */
        function debounce(func, wait, immediate) {
            var timeout;
            return function () {
                var that = this, args = arguments;
                var later = function () {
                    timeout = null;
                    if (!immediate) {
                        func.apply(that, args);
                    }
                };
                var callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) {
                    func.apply(that, args);
                }
            };
        }
        // 用法
        var myEfficientFn = debounce(function () {
            // 所有繁重的操作
            if (!canLoad)return;
            var scrollh = $(document).height();
            var bua = navigator.userAgent.toLowerCase();
            if (bua.indexOf('iphone') !== -1 || bua.indexOf('ios') !== -1) {
                scrollh -= 140;
            } else {
                scrollh -= 80;
            }
            var w = $(window);
            if ($(document).scrollTop() + w.height() >= scrollh) {
                var str = $flexbox.find('.active').attr('name');
                load(str);
            }
        }, 250);

        window.addEventListener('scroll', myEfficientFn);

        // 图片效果-----------------------------------start
        $('#gradelist').on('click', '.clearfix dd', function () {
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

        // 引入统计代码
        require.async('jsub/_vb.js?c=xf_lp^dplb_wap');
        require.async('jsub/_ubm.js?_2017102307fdsfsdfdsd', function () {
            _ub.city = vars.ubcity;
            // 业务---WAP端
            _ub.biz = 'n';
            // 方位（南北方) ，北方为0，南方为1
            _ub.location = vars.ublocation;
            // 用户动作（浏览0、搜索1、打电话31、即时通讯24、预约25）
            var b = 0;
            var pTemp = {
                // 楼盘id
                'vmn.projectid': vars.paramId,
                // 所属页面
                'vmg.page': 'xf_lp^dplb_wap',
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
        });

        // 分享功能新
        var SuperShare = require('superShare/1.0.1/superShare');
        var config = {
            // 分享内容的title
            title: $('.bgproname').html() + '怎么样',
            // 分享时的图标
            image: $('.bgpic').html().trim(),
            // 分享内容的详细描述
            desc: '综合评分：' +  $('.bgscore').html() + '分\n' + '共' + $('.bgcount').html() + '条评论',
            // 分享的链接地址
            url: window.location.href + ((location.href.indexOf('?') > -1) ? '&' : '?') + 'cshare=share',
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

		// 最下面的导航-------------------------------------------------satrt
		var $bottonDiv = $('#bottonDiv');
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
		//　列表页底部滑动
		var setTab = function (obj, index) {
			var $span = $(obj).find('.pointBox span');
			$span.removeClass('cur').eq(index).addClass('cur');
		};
		var windoWidth = $(window).width();
		$('.typeListB').each(function () {
			var $this = $(this);
			//$this.find('.swiper-slide').width($this.width()).height($this.find('.swiper-wrapper').height());
			$this.find('.swiper-wrapper').width(windoWidth * $this.find('.swiper-slide').length);
			$this.find('.swiper-slide').width(windoWidth).height($('.gfzn .swiper-wrapper').height());

		});
		var addSwiper = function (a) {
			new Swiper('.' + a.attr('id'), {
				speed: 500,
				loop: false,
				onSlideChangeStart: function (swiper) {
					setTab('.' + a.attr('id'), swiper.activeIndex);
				}
			});
		};
		addSwiper($('#zxlp'));
		// 最下面的导航-------------------------------------------------end
    });