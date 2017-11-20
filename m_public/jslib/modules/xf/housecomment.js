define('modules/xf/housecomment', ['jquery', 'util/util', 'jwingupload/1.0.6/jwingupload'], function (require, exports, module) {
    'use strict';
    var $ = require('jquery');
    var Util = require('util/util');
    var vars = seajs.data.vars;
    var sfut = Util.getCookie('sfut');
    var jWingUpload = require('jwingupload/1.0.6/jwingupload');

    // 登录后获取用户ID和其他
    var ismobilevalid,userId,username;
    function getInfo(data) {
        ismobilevalid = data.ismobilevalid || '';
        userId = data.userid || '';
        username = data.username;
    }
    // 调用ajax获取登陆用户信息
    if (sfut) {
        vars.getSfutInfo(getInfo);
    }
    // 输入框
    var textInput = $('#miaoshu');
    // 字数标志
    var $reminder = $('#reminder');
    // 平均分显示
    var $avgPoint = $('#zongshu');
    // 提示信息
    var $floatMsg = $('.floatMsg');
    // 提交按钮
    var $submit = $('#submit');

    function Comment() {
        // 初始化
        this.initialize();
    }
    Comment.prototype = {
        // 评分项目数
        itemPoint: $('.comment-con').find('dl').length,
        // 输入框初始化的文字
        initText: '亲，这个楼盘怎么样？快来说两句！',
        // 图片上传标志
        jwupload: '',
        // ajax的score参数
        ajaxScore: '',
        // 提交按钮锁
        submitLock: true,
        // 显示提示信息
        showMessage: function (text) {
            $floatMsg.find('p').html(text);
            // 显示提示
            $floatMsg.show();
            setTimeout(function () {
                $floatMsg.hide();
            },1200);
        },
        // 检查每一项是否评分,并拼接评分的ajax格式
        checkPoint: function () {
            var that = this;
            var check = true;
            // 初始化的时候清空
            that.ajaxScore = '';
            $('.face').each(function () {
                if (!$(this).html()) {
                    that.ajaxScore = '';
                    check = false;
                } else {
                    that.ajaxScore += $(this).html() + ',';
                }
            });
            if (!check) {
                that.showMessage('请给每项都打个分');
                return false;
            } else {
                that.ajaxScore = that.ajaxScore.substring(0, that.ajaxScore.length - 1);
                return true;
            }
        },
        // 检查输入的字数
        checkWords: function () {
            var that = this;
            // 输入的字数
            var content = 0;
            if (textInput.text() !== that.initText) {
                content = Number(textInput.text().trim().length);
            }
            if (content < 15 || content > 2000) {
                var text = '';
                if (content < 15) {
                    text = '最少要15个字哦，再说两句吧';
                } else {
                    text = '最多只能说2000个字哦亲';
                }
                that.showMessage(text);
                return false;
            }
            return true;
        },
        // 检查是否登录
        checkLogin: function () {
            if (!userId) {
                alert('请登录后操作！');
                window.location.href = 'https://m.fang.com/passport/login.aspx?burl=' + window.location.href;
                return false;
            }
            if (ismobilevalid !== '1') {
                window.location.href = '//m.fang.com/my/?c=mycenter&a=index&city=' + vars.paramcity + '&burl=' + encodeURIComponent(encodeURIComponent(window.location.href));
                return false;
            }
            return true;
        },
        // 总分计算
        sumPoint: function () {
            var sum = 0;
            $('.face').each(function () {
                var point = $(this).html();
                if (point) {
                    sum += Number(point);
                }
            });
            return sum;
        },
        // 初始化
        initialize: function () {
            var that = this;
            // 评分事件
            $('dl').each(function () {
                var $sumLi = $(this).find('dd').find('i');
                $(this).find('dd').on('click','i',function () {
                    $sumLi.removeClass('active');
                    // 点中的是第几个li
                    var index = $(this).index() + 1;
                    // 星星变红
                    for (var i = 0; i < index; i++) {
                        $sumLi.eq(i).addClass('active');
                    }
                    // 显示笑脸的span
                    var $span = $(this).parent().next();
                    // 设置笑脸并且写入分数
                    var classString = 'face num face' + index;
                    $span.removeClass().addClass(classString).html(index);
                    // 获取总分数
                    var sumPoint = that.sumPoint();
                    $avgPoint.html((sumPoint / that.itemPoint).toFixed(1) + '分');
                });
            });
            // 点击输入框时的判断
            textInput.on('click',function () {
                $('body').animate({scrollTop: 242});
                var connow = $(this).text();
                if (connow == that.initText) {
                    $(this).empty();
                }
            });
            // 输入框输入事件
            textInput.on('input',function () {
                var textLength = textInput.text().trim().length;
                // 输入框显示黑色
                textInput.css('color', 'black');
                if (textLength >= 1 && textLength < 15) {
                    $reminder.html('距离合格点评，还差' + (15 - textLength) + '字');
                } else if(textLength >= 15 && textLength < 100) {
					$reminder.html('加油，再写' + (100 - textLength) + '字就有机会成为精华哦！');
				} else if(textLength > 2000) {
					$reminder.html('已超出' + (textLength - 2000) + '字');
					textInput.css('color', 'red');
				} else if(textLength >= 100 && $('.comment-addpic img').length == 0) {
					$reminder.html('上传图片有机会赢100积分！');
				} else if(textLength >= 100 && $('.comment-addpic img').length > 0) {
					$reminder.html('不错哦，已输入' + textLength + '字');
				} else {
                    $reminder.html(textLength + '字');
                }
            });

            // 上传图片
            that.jwupload = jWingUpload({
                preview: document.getElementsByClassName('comment-addpic'),
                maxLength: 6,
                imgPath: vars.public,
                url: '/upload.d?m=uploadNew'
            });
            // 提交按钮点击事件
            $submit.on('click',function () {
                if (that.checkLogin() && that.checkPoint() && that.checkWords() && that.submitLock) {
                    that.submitLock = false;
                    var isChecked = $('.tab-change').hasClass('on') ? '1' : '';
                    var picUrl = '';
                    if (that.jwupload) {
                        $.each(that.jwupload.imgsArray, function (index, element) {
                            if (element.imgurl) {
                                picUrl += element.imgurl + ',';
                            }
                        });
                    }
                    // 购房目的
                    var purpose = '';
                    $('.dp-buy .cur').each(function () {
                        purpose += $(this).html() + ',';
                    });
                    purpose = purpose.substring(0, purpose.length - 1);
                    $.get('/xf.d?m=giveComment', {
                        score: that.ajaxScore,
                        content: encodeURIComponent(encodeURIComponent(textInput.text().trim())),
                        type: 'wap',
                        userid: userId,
                        username: encodeURIComponent(encodeURIComponent(username)),
                        pic_url: picUrl.substring(0, picUrl.length - 1),
                        city: vars.paramcity,
                        id: vars.paramId,
                        anonymous: isChecked,
                        purpose: encodeURIComponent(encodeURIComponent(purpose))
                    },
                        function (data) {
                            if (data) {
                                var message = data.root.status;
                                // 添加别的入口进来的
                                if (vars.backurl) {
                                    alert(message.split(',')[1]);
                                    window.location.href = decodeURIComponent(vars.backurl);
                                    return ;
                                }
                                if (message.split(',')[0] === '100') {
                                    if (vars.paramshareFrom === 'pingshen') {
                                        window.location.href = '/huodong.d?m=activityDemand&class=XiaoQuTuCaoHc&flag='
                                            + vars.paramflag + '&city=' + vars.paramcity + '&shareFrom=pingshen&imei=' + vars.paramimei;
                                    } else {
										if(message.split(',')[1].indexOf('敏感')>0){
											Util.setCookie('point',message.split(',')[1],'1');
										}
                                        window.location.href = '/xf.d?m=dianpingSuc&city=' + vars.paramcity + '&newcode=' + vars.paramId;
                                    }
                                } else {
                                    alert(message.split(',')[1]);
                                }
                            } else {
								alert('网络错误，请稍候再试');
							}
                            that.submitLock = true;
                        });
                    // 点评统计
                    yhxw(16);
                }
            });
            $('.tab-change').on('click', function () {
                if ($(this).hasClass('on')) {
                    $(this).removeClass('on').addClass('off');
                } else {
                    $(this).removeClass('off').addClass('on');
                }
            });
            // 去除底部标签
            $('footer').hide();
            // 购房目的（2016年5月20日）
            $('.dp-buy').on('click', 'p span', function () {
                $(this).hasClass('cur') ? $(this).removeClass('cur') : $(this).addClass('cur');
            });
        }
    };
    module.exports = new Comment;
    // 引入统计代码
    require.async('jsub/_vb.js?c=mnhcomment');
    require.async('jsub/_ubm.js?v=201407181100', function () {
        _ub.city = vars.ubcity;
        // 业务---WAP端
        _ub.biz = 'n';
        // 方位（南北方) ，北方为0，南方为1
        _ub.location = vars.ublocation;
        // 用户动作（浏览0、搜索1、打电话31、即时通讯24、预约25）
        var b = 0;
        var pTemp = {
            // 所属页面
            'vmg.page': 'mnhcomment',
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
    function yhxw(type) {
        // 统计点评的次数
        var pTemp = {
            // 楼盘id
            'vmn.projectid': vars.paramId,
            // 所属页面
            'vmg.page': 'mnhcomment'

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
        _ub.collect(type, p);
    }
});