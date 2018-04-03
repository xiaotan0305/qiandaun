/**
 * Created on 2017/8/25.
 * author young
 */
define('modules/jiaju/quoteTotalPrice', [
    'jquery',
    'verifycode/1.0.0/verifycode',
    'slideFilterBox/1.0.0/slideFilterBox',
    'weixin/2.0.0/weixinshare',
    'modules/jiaju/yhxw'
], function (require, exports, module) {
    'use strict';
    var vars = seajs.data.vars;
    var $ = require('jquery');
    var verifycode = require('verifycode/1.0.0/verifycode');
    var slideFilterBox = require('slideFilterBox/1.0.0/slideFilterBox');
    var $document = $(document);
    var $window = $(window);
    // 城市区域点击标识
    var clickFlag = true;

    // 用户行为统计
    var yhxw = require('modules/jiaju/yhxw');
    yhxw({
        page: 'mjjtotalprice'
    });

    function OrderFn() { };
    OrderFn.prototype = {
        init: function (isEmbed) {
            var that = this;
            // isEmbed=true嵌入页
            that.isEmbed = !!isEmbed;

            /* 手机号*/
            that.tel = $('#phone');
            that.noTelPattern = /[^\d]+/g;
            that.changeTel = $('.changeTel ');

            /* 手机验证码*/
            that.vcode = $('#vcode');
            that.vcodeLi = $('#vcodeLi');

            that.size = $('#size');
            that.room = $('#room');
            that.roomOption = $('#roomOption');
            that.room_confirm = $('#room_confirm');
            that.state = $('#state');
            that.size2RoomHtml = that.room.html();

            /* 城市*/
            that.areaOption = $('#areaOption');
            that.cancel = $('#cancel');
            that.areaBack = $('#areaBack');
            that.optionInfo = $('#optionInfo');
            that.proCon = $('#proCon');
            that.cityCon = $('#cityCon');
            that.area = $('#area');
            that.areali = $('#area li');
            // 城市数据备份
            that.areaInfoBak = {};

            /* 提交按钮*/
            that.freeApply = $('#freeApply');
            that.submitFlag = true;

            /* 返回按钮*/
            that.backBtn = $('.back');
            that.ldOutBox = $('.ld-outBox');
            that.backLeave = $('#backLeave');
            that.backLook = $('#backLook');
            that.isChecked = false;

            /* 最新十条报名的box*/
            that.ldMessage = $('.ld-message');

            /* 楼盘 */
            that.estate = $('#estate');
            that.estateOption = $('#estateOption');
            that.estate_cancel = $('.s-btn');
            that.estate_off = $('.off');
            that.houseInput = $('#houseInput');
            that.searchTipBox = $('#searchTipBox');
            that.searchTipBoxUl = that.searchTipBox.find('ul');

            /* 装修类型 */
            that.state_confirm = $('#state_confirm');
            that.stateOption = $('#stateOption');

            /* 各个字段通过标识*/
            that.sizeFlag = that.size.val() ? true : false; //面积,input返回会保留默认值
            that.roomFlag = true; //户型
            that.cityFlag = false; //所在城市
            that.estateFlag = false; //楼盘
            that.stateFlag = false; //装修类型
            that.phoneFlag = false; //手机号
            that.phoneCodeFlag = false; //验证码

            /* toast错误提示*/
            that.sendFloat = $('#sendFloat');
            that.sendText = $('#sendText');

            /* 登录后不用输入验证码，手机号码只读*/
            if (vars.phone) {
                that.vcodeLi.hide();
                that.phoneCodeFlag = true;
                that.tel.val(vars.phone);
                that.tel.prop({
                    readonly: true
                });
                that.phoneFlag = true;
            }
            that.bindEvent();
            // 解决ios输入法遮挡toast的问题
            var UA = window.navigator.userAgent;
            if (/iPhone|iPod|iPad/i.test(UA)) {
                that.sendFloat.find('div').css({
                    top: '30%'
                });
            }
            // 最新报名十条
            that.getNewestBMInfo();
        },
        bindEvent: function () {
            var that = this;

            /* 手机号*/
            that.tel.on('input', $.proxy(that.telInputFn, that)).on('blur', function () {
                that.telBlurFn();
            });

            /* 显示城市控件，点击黑色区域时候，达到和取消按钮一样的效果*/
            that.area.on('click', function (e) {
                if (e.target.id === 'area') {
                    that.cancelFn();
                }
            });

            /* 面积 */
            that.size.on('input', $.proxy(that.sizeInputFn, that)).on('blur', function () {
                that.sizeBlurFn();
            });

            /* 户型 */
            that.room.on('click', function () {
                that.roomOption.toggle();
            });

            /* 户型选择 */
            that.roomOption.find('li').on('click', function () {
                that.isChecked = true;
                $(this).siblings().removeClass('cur');
                var li_cur = $(this).hasClass('cur');
                $(this).toggleClass('cur');
                var ul_id = $(this).parent('ul').attr('id');
                var li_html = $(this).html();
                if (ul_id == 'ul_room') {
                    var reg = /\d室/g;
                    if (li_cur) {
                        li_html = '0室';
                    }
                } else if (ul_id == 'ul_hall') {
                    var reg = /\d厅/g;
                    if (li_cur) {
                        li_html = '0厅';
                    }
                } else if (ul_id == 'ul_kitchen') {
                    var reg = /\d厨/g;
                    if (li_cur) {
                        li_html = '0厨';
                    }
                } else if (ul_id == 'ul_toilet') {
                    var reg = /\d卫/g;
                    if (li_cur) {
                        li_html = '0卫';
                    }
                } else if (ul_id == 'ul_balcony') {
                    var reg = /\d阳台/g;
                    if (li_cur) {
                        li_html = '0阳台';
                    }
                }
                that.size2RoomHtml = that.size2RoomHtml.replace(reg, li_html);
                that.room.html(that.size2RoomHtml);
                that.roomFlag = true;
            });

            /* 户型点击确定 */
            that.room_confirm.on('click', function () {
                that.roomOption.hide();
            });

            /* 楼盘 */
            that.estate.on('click', function () {
                that.estateOption.toggle();
                // 浮层处理，就让输入框获得焦点
                if (that.estateOption.is(':visible')) {
                    that.houseInput.focus();
                }
            });

            /* 楼盘联想弹层 */
            that.houseInput.on('input', function () {
                var $that = $(this);
                clearTimeout(this.timerThink);
                this.timerThink = setTimeout(function () {
                    var keyword = that.inputFormat($that.val());
                    var regNumAndEn=/^[`~!@#$%^&*()_+<>?:"{},.\/;'[\]！#￥（——）：；“”‘、，|《。》？、【】·…\^\-=‘’0-9]+$/;
                    if(regNumAndEn.test(keyword)){
                        that.toast('楼盘名称不规范，请重新填写');
                        that.estate_cancel.text('取消');
                        return false;
                    }
                    that.searchTipBoxUl.html('');
                    if (keyword.length) {
                        var tipStr = '';
                        $.get(vars.jiajuSite + '?c=jiaju&a=ajaxGetBJHouseSearchTip&city=' + vars.city + '&keyword=' + keyword + '&cityname=' + that.areaOption.attr('data-cityname') + '&ns=' + that.getNSbyProvinceId(that.areaOption.attr('data-proid')), function (data) {
                            if (data && data.allResultNum > 0) {
                                that.estate_cancel.text('请从以下楼盘中选择');
                                var num = data.allResultNum > 3 ? 3 : data.allResultNum;
                                for (var i = 0; i < num; i++) {
                                    tipStr += '<li><a class="searchItem" href="javascript:void(0);" data-hid="' + data.hit[i].newCode + '">' + data.hit[i].title + '</a></li>';
                                }
                                that.searchTipBoxUl.html(tipStr);
                                that.searchTipBox.show();
                            } else {
                                that.estate_cancel.text('确认');
                            }
                        });
                    }else{
                        that.estate_cancel.text('取消');
                    }
                }, 100)
            });

            /* 楼盘联想-点击确定或者取消 */
            that.estate_cancel.on('click', function () {
                if (that.estate_cancel.text() == '请从以下楼盘中选择') {
                    return false;
                }
                if (that.houseInput.val() && that.estate_cancel.text() == '确认') {
                    that.estate.text(that.houseInput.val()).css({
                        color: '#3c3f46'
                    });
                    that.estateFlag = true;
                } else {
                    if (that.estate.text() == '' || that.estate.text() == '请选择小区/楼盘') {
                        that.toast('请选择小区/楼盘');
                    }
                }
                that.estate_cancel.text('取消');
                that.houseInput.val('');
                that.searchTipBoxUl.html('');
                that.searchTipBox.hide();
                that.estateOption.hide();
            });

            /* 楼盘联想-清除文本框 */
            that.estate_off.on('click', function () {
                that.estate_cancel.text('取消');
                that.houseInput.val('');
                that.searchTipBoxUl.html('');
                that.searchTipBox.hide();
            });

            // 点击联想词放到输入框
            that.searchTipBox.on('click', '.searchItem', function () {
                var $that = $(this),
                    houseName = $.trim($that.html());
                that.houseInput.val('');
                that.estate.attr('data-estateid', $that.attr('data-hid'));
                that.estate.text(houseName).css({
                    color: '#3c3f46'
                });
                that.searchTipBoxUl.html('');
                that.searchTipBox.hide();
                that.estateOption.hide();
                that.estateFlag = true;
                that.estate_cancel.text('取消');
            });

            // 输入框获得焦点后，则页面向上滚动一部分，以免输入法遮挡住搜素提示内容
            that.houseInput.on('focus', function () {
                $window.scrollTop(that.estateOption.offset().top);
            });

            /*装修状态按钮*/
            that.state.on('click', function () {
                that.stateOption.toggle();
            });

            /*装修状态弹层*/
            that.stateOption.find('li').on('click', function () {
                $(this).siblings().removeClass('cur');
                $(this).addClass('cur');
            });

            /*装修状态弹层-点击确定*/
            that.state_confirm.on('click', function () {
                that.state.html(that.stateOption.find('li.cur').html());
                if (that.state.text() !== '请选择装修状态') {
                    that.state.css({
                        color: '#3c3f46'
                    });
                    that.stateFlag = true;
                }
                that.stateOption.hide();
            });

            /* 如果登录状态，changeTel文本显示更换手机号；未登录状态显示获取验证码*/
            that.changeTel.off('click').on('click', function () {
                var flag = true;
                if (flag) {
                    flag = false;
                    // 更换手机号
                    if (that.changeTel.text() === '更换手机号') {
                        that.changeTelFn();
                        that.changeTel.text('获取验证码');
                        flag = true;
                    } else if (!that.changeTel.hasClass('noClick') && that.changeTel.text() !== '更换手机号') {
                        that.unable();
                        //获取验证码
                        var phonestr = that.tel.val().trim();
                        if (phonestr) {
                            verifycode.getPhoneVerifyCode(phonestr, function () {
                                that.changeTel.addClass('noClick');
                                that.timeRecorder(60);
                                flag = true;
                                that.enable();
                            }, function () {
                                that.enable();
                                flag = true;
                            });
                        }
                    } else {
                        that.enable();
                        flag = true;
                    }
                }
            });

            /* 验证码*/
            that.vcode.on('blur', function () {
                that.validateVCode(false);
            }).on('input', $.proxy(that.vcodeBlurFn, that));
            /* 验证码浮层出现的时候，页面不能滚动，点击其他地方让验证码消失*/
            $document.on('click', '#phoneDivImgVerify1', function () {
                that.enable();
                $(this).hide();
            });
            $document.on('click', '#phoneDivImgVerify2', function (e) {
                e.stopPropagation();
            });
            $document.on('click', '#phoneImgVerifyCodeSubmit', function () {
                that.enable();
            });

            /* 免费申请*/
            that.freeApply.on('click', function () {
                if (that.submitFlag && clickFlag) {
                    that.freeApplyClickFn();
                }
            });

            /* 城市区域的相关操作*/
            that.areaOption.on('click', function () {
                that.areaOptionFn();
            });
            that.areali.on('click', function () {
                that.arealiClickFn($(this));
            });
            that.cancel.on('click', function () {
                that.cancelFn();
            });
            that.areaBack.on('click', function () {
                var conName = that.areaBack.attr('conName');
                that.areaBackFn(conName);
            });

            /* 点击返回按钮进行挽留*/
            that.backBtn.on('click', function (e) {
                e.preventDefault();
                that.ldOutBox.show();
                that.unable();
            });
            //返回上一页面
            that.backLeave.on('click', function () {
                that.ldOutBox.hide();
                that.enable();
                window.location = vars.bmUrls.getUrl(1);
                return;
            });
            //留在当前页面再看看,滑动到报名框
            that.backLook.on('click', function () {
                that.ldOutBox.hide();
                that.enable();
            });
        },
        // 城市控件返回按钮
        areaBackFn: function (conName) {
            var that = this;
            var proID = that.areaOption.attr('data-proID');
            var cityID = that.areaOption.attr('data-cityID');
            that.unable();
            if (conName === 'city') {
                //当前选择器是城市
                that.areaBack.hide();
                that.proCon.show();
                that.proCon.children().children().removeClass('active').attr('style', 'opacity:1');
                $('#cityCon_' + proID).hide();
                that.optionInfo.text('请选择您的地区');
                that.areaOption.text('请选择您的地区');
                that.proCon.find('li').removeClass('activeS');
                that.proCon.find('li[value=\'' + that.areaOption.attr('data-proID') + '\']').addClass('activeS');
            } else {
                //当前选择器是区域
                var cityConProID = $('#cityCon_' + proID);
                cityConProID.show();
                cityConProID.children().children().removeClass('active').attr('style', 'opacity:1');
                $('#distCon_' + cityID).hide();
                that.areaBack.attr('conName', 'city');
                that.optionInfo.text(that.areaOption.attr('data-proName'));
                that.areaOption.text(that.areaOption.attr('data-proName'));
                var cityConId = $('#cityCon_' + that.areaOption.attr('data-proID'));
                cityConId.find('li').removeClass('activeS');
                cityConId.find('li[value=\'' + that.areaOption.attr('data-cityID') + '\']').addClass('activeS');
            }
        },
        // 点击选择城市所触发的事件
        areaOptionFn: function () {
            var that = this;
            var text = that.areaOption.text();
            if (text && text !== '请选择您的地区') {
                // 清空所有已选定的状态
                that.area.find('li').removeClass('activeS');
                // 已选择省份和城市的id
                var dataPro = that.areaOption.attr('data-proID'),
                    dataCityId = that.areaOption.attr('data-cityID'),
                    dataDistId = that.areaOption.attr('data-distID');
                // 备份已选项
                that.areaInfoBak.text = text;
                that.areaInfoBak.dataPro = dataPro;
                that.areaInfoBak.dataCityId = dataCityId;
                that.areaInfoBak.dataDistId = dataDistId;
                // 所选省份添加已选状态
                that.proCon.find('li[value=\'' + dataPro + '\']').addClass('activeS');
                // 所选城市添加已选状态
                $('#cityCon_' + dataPro).find('li[value=\'' + dataCityId + '\']').addClass('activeS');
                $('#distCon_' + dataCityId).find('li[value=\'' + dataDistId + '\']').addClass('activeS');
            }
            that.estateOption.hide();
            that.area.show();
            that.proCon.show();
            // 定位
            that.IScrollEvent('#proCon');
            that.unable();
        },
        /* 格式化用户输入*/
        inputFormat: function (str) {
            var word = str.replace(/[\<\>\(\)\;\{\}\"\'\[\]\/\@\!\,]/g, '');
            return word.replace(/(^\s+)|(\s+$)/g, '')
        },
        // 点击城市控件中li所触发的事件
        arealiClickFn: function ($this) {
            var that = this;
            if (!clickFlag) {
                return false;
            }
            clickFlag = false;
            $this.addClass('active');
            var divDom = $this.parent().parent();
            // 如果当前点击的选择器是省份，则
            if (divDom.attr('id') === 'proCon') {
                that.optionInfo.text('');
                that.areaOption.text('');
            }
            var thisVal = $this.val();
            var protext = that.areaOption.text() + ' ' + $this.text();
            that.optionInfo.text(protext);
            that.areaOption.text(protext);
            if (divDom.attr('id') === 'proCon') {
                // 省份选择器
                that.areaBack.show();
                that.unable();
                that.areaOption.attr('data-proID', $this.val());
                that.areaOption.attr('data-proName', $this.text());
                // 为动画预留350ms
                setTimeout(function () {
                    $this.css('opacity', '0');
                    divDom.hide();
                    $('#cityCon_' + thisVal).show();
                    that.IScrollEvent('#cityCon_' + thisVal);
                    that.areaBack.attr('conName', 'city');
                    clickFlag = true;
                }, 400);
            } else if (divDom.attr('conName') === 'city') {
                //城市选择器
                that.areaOption.attr('data-cityID', $this.val());
                that.areaOption.attr('data-cityName', $this.text());
                setTimeout(function () {
                    var count = $('#distCon_' + thisVal).length;
                    if (count > 0) {
                        // 判断是否有区域存在
                        $('#distCon_' + thisVal).show();
                        that.unable();
                        divDom.hide();
                        that.IScrollEvent('#distCon_' + thisVal);
                        that.areaBack.attr('conName', 'dist');
                    } else {
                        // 重置返回为隐藏
                        that.enable();
                        that.areaOption.attr('data-distID', '');
                        that.areaOption.attr('data-distName', '');
                        that.areaBack.hide();
                        that.area.hide();
                        that.cityFlag = true;
                        that.areaOption.css({
                            color: '#3c3f46'
                        });
                        if ($this.val() != that.areaInfoBak.dataCityId) {
                            that.estate.removeAttr('style');
                            that.estate.html('请选择小区/楼盘');
                            that.estate_cancel.text('取消');
                            that.houseInput.val('');
                            that.searchTipBoxUl.html('');
                            that.searchTipBox.hide();
                            that.estateFlag = false;
                        }
                        $('#cityCon_' + that.areaOption.attr('data-proID')).hide();
                        that.areali.removeClass('active').css('opacity', '1');
                    }
                    clickFlag = true;
                }, 400);
            } else {
                // 区域选择器
                that.areaOption.attr('data-distID', $this.val());
                that.areaOption.attr('data-distName', $this.text());
                setTimeout(function () {
                    // 重置返回为隐藏
                    that.areaBack.hide();
                    that.area.hide();
                    divDom.hide();
                    that.cityFlag = true;
                    that.areaOption.css({
                        color: '#3c3f46'
                    });
                    if ($this.val() != that.areaInfoBak.dataDistId) {
                        that.estate.removeAttr('style');
                        that.estate.html('请选择小区/楼盘');
                        that.estate_cancel.text('取消');
                        that.houseInput.val('');
                        that.searchTipBoxUl.html('');
                        that.searchTipBox.hide();
                        that.estateFlag = false;
                    }
                    that.areali.removeClass('active').css('opacity', '1');
                    that.areaBack.attr('conName', 'city');
                    clickFlag = true;
                }, 400);
                that.enable();
            }
        },
        // 城市控件取消功能
        cancelFn: function () {
            var that = this;
            var cityDiv = that.areaOption.attr('data-proID');
            var distDiv = that.areaOption.attr('data-cityID');
            that.area.find('li').removeClass('activeS');
            that.area.hide();
            that.proCon.show();
            that.areaBack.hide();
            $('#cityCon_' + cityDiv).hide();
            $('#distCon_' + distDiv).hide();
            if (that.areaInfoBak.dataPro) {
                that.cityFlag = true;
                that.areaOption.text(that.areaInfoBak.text);
                that.optionInfo.text(that.areaInfoBak.text);
                that.areaOption.attr({
                    'data-proID': that.areaInfoBak.dataPro,
                    'data-cityID': that.areaInfoBak.dataCityId,
                    'data-distID': that.areaInfoBak.dataDistId
                });
            } else {
                that.cityFlag = false;
                that.optionInfo.text('请选择您的地区');
                that.areaOption.text('请选择您的地区');
            }
            that.enable();
            that.areali.removeClass('active').css('opacity', '1');
        },

        //添加滚动
        IScrollEvent: function (name) {
            //滑动
            var that = this;
            that.posLog = that.refreshPosLog($(name));
            slideFilterBox.refresh(name);
            // 当前筛选菜单下的筛选项
            var $li = $(name).find('li');
            //筛选项总数
            var length = $li.length;
            // 当前选中筛选项的序数
            var index = $li.filter('.activeS').index();
            // 大于一屏
            if (index > that.posLog.length - 1) {
                slideFilterBox.to(name, -index * that.posLog.height, 2);
                // 最后一屏
                if (length - index < that.posLog.length) {
                    slideFilterBox.to(name, -(length - that.posLog.length) * that.posLog.heigh, 2);
                }
            }
        },
        // 记录筛选框高度和单屏筛选框个数
        refreshPosLog: (function () {
            // 只执行一次
            var isFirst = 1;
            var posLog = {};
            return function ($filterMenu) {
                if ($filterMenu && isFirst) {
                    var boxHeight = parseInt($filterMenu.css('height'), 10);
                    var ddHeight = parseInt($filterMenu.find('li').eq(0).css('height'), 10);
                    // 筛选项高度
                    posLog.height = ddHeight;
                    // 单屏筛选项个数
                    posLog.length = boxHeight / ddHeight;
                    isFirst = 0;
                }
                return posLog;
            };
        })(),
        //手机号按钮
        telInputFn: function () {
            var that = this;
            // 禁止输入其他
            that.tel.val(that.tel.val().replace(that.noTelPattern, ''));
            if (that.validateTel() === 'legal') {
                if (!/[0-9]{1,2}/.test(that.changeTel.text())) {
                    that.changeTel.removeClass('noClick');
                }
                that.phoneFlag = true;
            } else {
                that.changeTel.addClass('noClick');
                that.phoneFlag = false;
            }
            // 键盘删除手机号后，验证码调出，如果手机号和之前输入的一样，收回验证码
            if (vars.phone === that.tel.val() && vars.phone) {
                that.vcodeLi.hide();
                that.vcode.val('');
                that.phoneCodeFlag = true;
                that.tel.prop({
                    readonly: true
                });
                that.tel.blur();
                that.changeTel.text('更换手机号');
            } else {
                that.vcodeLi.show();
                that.phoneCodeFlag = /^[0-9]{4}$/.test(that.vcode.val());
                that.tel.removeAttr('readonly');
            }
        },

        // 校正手机号
        telBlurFn: function () {
            var that = this;
            var result = that.validateTel();
            switch (result) {
                case 'tooLittle':
                    that.toast('请输入11位手机号');
                    break;
                case 'illegal':
                    that.toast('输入手机号错误');
                    break;
                case 'legal':
                    that.changeTel.removeClass('noClick');
                    break;
                default:
                    break;
            }
        },

        // 验证手机号
        validateTel: function () {
            var that = this,
                tel = that.tel.val().trim();
            if (tel.length < 11) {
                return 'tooLittle';
            }
            return /^1[34578][0-9]{9}$/.test(tel) ? 'legal' : 'illegal';
        },

        // toast提示
        toast: function (content) {
            var that = this;
            that.sendFloat.show();
            that.sendText.html(content);
            setTimeout(function () {
                that.sendText.html('');
                that.sendFloat.hide();
            }, 2000);
        },

        // 验证码校正
        vcodeBlurFn: function () {
            var that = this;
            // 禁止输入其他
            that.vcode.val(that.vcode.val().replace(that.noTelPattern, ''));
            that.validateVCode();
        },

        // 更换手机号
        changeTelFn: function (noClear) {
            var that = this;
            if (!noClear) {
                that.tel.val('');
            }
            that.tel.trigger('input');
            that.vcode.trigger('input');
        },

        // 验证码倒计时
        timeRecorder: function (timePara) {
            var that = this;
            var time = timePara;
            var handle = setInterval(function () {
                that.changeTel.text('重新发送(' + time + ')');
                if (Number(time) === 0) {
                    clearInterval(handle);
                    that.changeTel.text('重新发送');
                    that.changeTel.removeClass('noClick');
                    that.tel.trigger('input');
                }
                time--;
            }, 1000);
        },

        // 验证码格式校验
        validateVCode: function (showMsg) {
            var that = this;
            var phoneCode = that.vcode.val();
            that.vcode.val(phoneCode);

            var reg = /^[0-9]{4}$/;
            if (!reg.test(phoneCode)) {
                if (showMsg) {
                    that.toast('输入手机号错误');
                }
                that.phoneCodeFlag = false;
            } else {
                that.phoneCodeFlag = true;
            }
        },

        // 为了方便绑定事件，声明一个阻止页面默认事件的函数
        pdEvent: function (e) {
            e.preventDefault();
        },
        // 禁止页面滑动
        unable: function () {
            var that = this;
            window.addEventListener('touchmove', that.pdEvent, {passive: false});
        },

        // 允许页面滚动
        enable: function () {
            var that = this;
            window.removeEventListener('touchmove', that.pdEvent, {passive: false});
        },

        // 免费申请
        freeApplyClickFn: function () {
            var that = this;
            var DH = function () {
                var data;
                var url;
                // 接口所需参数
                data = {
                    area: that.size.val().trim(),
                    room: that.room.text().trim(),
                    provinceName: encodeURIComponent(that.areaOption.attr('data-proname')),
                    provinceID: that.areaOption.attr('data-proid'),
                    cityName: encodeURIComponent(that.areaOption.attr('data-cityname')),
                    cityID: that.areaOption.attr('data-cityid'),
                    districtName: encodeURIComponent(that.areaOption.attr('data-distname')),
                    districtID: that.areaOption.attr('data-distid'),
                    state: that.state.text().trim(),
                    estate: that.estate.text().trim(),
                    estateid: that.estate.attr('data-estateid'),
                    sourcepageid: vars.sourcepageid,
                    source: vars.source,
                    platformType: vars.platformType,
                    sourceID: vars.sourceID
                };
                that.submitFlag = false;
                // 用户行为
                yhxw({
                    page: 'mjjtotalprice',
                    type: 67,
                    refpage: document.referrer,
                    area: that.size.val().trim(),
                    housetype: that.room.text().trim(),
                    district: that.areaOption.attr('data-distname'),
                    projectname: that.estate.text().trim(),
                    phone: that.tel.val(),
                    decstate: that.state.text().trim()
                });
                url = vars.jiajuSite + '?c=jiaju&a=ajaxZxBaoJia&r=' + Math.random();
                $.get(url, data, function (res) {
                    that.submitFlag = true;
                    if (res.IsSuc == '1') {
                        window.location.href = res.url;
                    } else {
                        that.toast(res.ErrorMsg);
                    }
                }).complete(function () {
                    that.submitFlag = true;
                });
            };
            if (!that.sizeFlag) {
                that.toast('请输入房屋面积');
                return false;
            } else if (!that.cityFlag) {
                that.toast('请选择您的地区');
                return false;
            } else if (!that.estateFlag) {
                that.toast('请选择小区/楼盘');
                return false;
            } else if (!that.stateFlag) {
                that.toast('请选择装修状态');
                return false;
            } else if (!that.phoneFlag) {
                that.toast('请输入您的手机号码');
                return false;
            } else if (!that.phoneCodeFlag) {
                that.toast('请输入验证码');
                return false;
            }
            if (that.vcode.val() !== '') {
                verifycode.sendVerifyCodeAnswer(that.tel.val(), that.vcode.val(),
                    DH,
                    function () {
                        that.toast('验证码错误,请重新登录');
                        that.submitFlag = true;
                    });
            } else {
                DH();
            }
        },

        changeNumToZh: function (num) {
            var numArr = {
                '1': '一',
                '2': '二',
                '3': '三',
                '4': '四',
                '5': '五',
                '6': '六',
                '7': '七',
                '8': '八',
                '9': '九',
                '10': '十'
            };
            return numArr[num + ''];

        },

        // 最新的报价的十条
        getNewestBMInfo: function () {
            var that = this;
            $.ajax({
                url: vars.jiajuSite + '?c=jiaju&a=ajaxGetNewQuoteInfo&city=' + vars.city,
                type: 'get',
                cache: true,
                success: function (data) {
                    if (data) {
                        var i = 0,
                            str = '',
                            rand;
                        for (i = 0; i < 10; i++) {
                            str += '<div class="msg msg' + (i + 1) + '"  style="display: none;">' +
                                '<div class="img"><img src="' + data[i].UserLogo + '"/></div>' + data[i].CityName + '尾号为:' + data[i].MobileTailNum;
                            if (parseInt(data[i].Area) > 0 || parseInt(data[i].Room) > 0) {
                                var areaStr = data[i].Area ? data[i].Area + '㎡' : '';
                                var roomStr = data[i].Room ? that.changeNumToZh(data[i].Room) + '居' : '';
                                str += '<span>' + areaStr + roomStr + '</span>';
                            }
                            str += '<span>半包' + data[i].HalfPrice + '万</span></div>';
                        }
                        that.ldMessage.html(str);
                        if (str) {
                            // 随机产生一个1-10随机数
                            rand = Math.floor(Math.random() * 10) + 1;
                            // console.log('rand:'+rand);
                            for (i = 0; i < 10; i++) {
                                (function (x) {
                                    setTimeout(function () {
                                        //在随机数基础上顺序循环展示数据
                                        // console.log('xxx:'+((rand + x) % 10 + 1));
                                        that.showNewestBMInfo((rand + x) % 10 + 1);
                                    }, 9000 * x);
                                })(i);
                            }
                        }
                    }
                }
            });
        },

        // 最新报名十条随机展示
        showNewestBMInfo: function (id) {
            var $msg = $('.msg' + id);
            $msg.show().addClass('fadeInUp').siblings().hide();
        },
        /**
         * size input在输入时候判断数据的正确性，并报价按钮状态和 room input状态
         */
        sizeInputFn: function () {
            var that = this;
            var val = that.size.val();
            var result = that.validateSize(val);
            if (result) {
                that.sizeFlag = true;
                if (!that.isChecked) {
                    that.roomUpdateFn(val);
                }
            } else {
                that.sizeFlag = false;
            }
        },
        roomUpdateFn: function (val) {
            var that = this;
            val = +val;
            if (val < 60) {
                that.size2RoomHtml = '1室1厅1厨1卫1阳台';
                $('#roomOption li').removeClass('cur');
                $('#roomOption li').eq(0).addClass('cur');
                $('#roomOption li').eq(5).addClass('cur');
                $('#roomOption li').eq(7).addClass('cur');
                $('#roomOption li').eq(8).addClass('cur');
                $('#roomOption li').eq(11).addClass('cur');
            } else if (val < 70) {
                that.size2RoomHtml = '2室1厅1厨1卫1阳台';
                $('#roomOption li').removeClass('cur');
                $('#roomOption li').eq(1).addClass('cur');
                $('#roomOption li').eq(5).addClass('cur');
                $('#roomOption li').eq(7).addClass('cur');
                $('#roomOption li').eq(8).addClass('cur');
                $('#roomOption li').eq(11).addClass('cur');
            } else if (val < 90) {
                that.size2RoomHtml = '2室2厅1厨1卫1阳台';
                $('#roomOption li').removeClass('cur');
                $('#roomOption li').eq(1).addClass('cur');
                $('#roomOption li').eq(6).addClass('cur');
                $('#roomOption li').eq(7).addClass('cur');
                $('#roomOption li').eq(8).addClass('cur');
                $('#roomOption li').eq(11).addClass('cur');
            } else if (val < 120) {
                that.size2RoomHtml = '3室2厅1厨1卫1阳台';
                $('#roomOption li').removeClass('cur');
                $('#roomOption li').eq(2).addClass('cur');
                $('#roomOption li').eq(6).addClass('cur');
                $('#roomOption li').eq(7).addClass('cur');
                $('#roomOption li').eq(8).addClass('cur');
                $('#roomOption li').eq(11).addClass('cur');
            } else if (val < 150) {
                that.size2RoomHtml = '3室2厅1厨2卫2阳台';
                $('#roomOption li').removeClass('cur');
                $('#roomOption li').eq(2).addClass('cur');
                $('#roomOption li').eq(6).addClass('cur');
                $('#roomOption li').eq(7).addClass('cur');
                $('#roomOption li').eq(9).addClass('cur');
                $('#roomOption li').eq(12).addClass('cur');
            } else if (val < 170) {
                that.size2RoomHtml = '4室2厅1厨2卫2阳台';
                $('#roomOption li').removeClass('cur');
                $('#roomOption li').eq(3).addClass('cur');
                $('#roomOption li').eq(6).addClass('cur');
                $('#roomOption li').eq(7).addClass('cur');
                $('#roomOption li').eq(9).addClass('cur');
                $('#roomOption li').eq(12).addClass('cur');
            } else {
                that.size2RoomHtml = '5室2厅1厨3卫3阳台';
                $('#roomOption li').removeClass('cur');
                $('#roomOption li').eq(4).addClass('cur');
                $('#roomOption li').eq(6).addClass('cur');
                $('#roomOption li').eq(7).addClass('cur');
                $('#roomOption li').eq(10).addClass('cur');
                $('#roomOption li').eq(13).addClass('cur');
            }
            that.room.html(that.size2RoomHtml);
        },
        /**
         * 验证面积的正确性
         */
        validateSize: function (val) {
            var that = this;
            var sizeContent = that.size.val();
            var sizeAble = /^\d{1,3}(?:\.\d{1,2})?$/.test(val) && +val <= 999.99 && +val >= 1;
            return sizeAble;
        },
        /**
         * size inputs 失去焦点的时候根据状态输出错误信息，同时更新room 弹出层的状态
         */
        sizeBlurFn: function () {
            var that = this;
            var val = that.size.val();
            var result = that.validateSize(val);
            if (!result) {
                that.toast('请您填写真实房屋面积');
                that.sizeFlag = false;
            } else {
                that.sizeFlag = true;
            }
        },
        // 根据省份id获取南北方
        getNSbyProvinceId: function (proid) {
            if (parseInt(proid) <= 0 || !proid) {
                return '';
            }
            // 北方省份id列表
            var nPro = [19, 16, 6, 3, 28, 21, 1, 27, 20, 13];
            // var sPro = [12, 33, 30, 24, 25, 29, 4, 9, 5, 15, 11, 17, 7, 26, 31,10, 18, 14, 34, 32, 22, 8, 2, 23];
            if ($.inArray(parseInt(proid), nPro) === -1) {
                return 's';
            } else {
                return 'n';
            }
        }
    };
    module.exports = function quoteTotalPrice(isEmbed) {
        var registerObj = new OrderFn();
        isEmbed = vars.is_sfapp === '1' ? true : false;
        registerObj.init(isEmbed);
    };
    // 微信分享
    var wxShare = require('weixin/2.0.0/weixinshare');
    var imageUrl = vars.public + 'img/app_jiaju_logo.png';
    imageUrl = imageUrl.replace(/^(https?)?(?=\/\/)/, location.protocol);
    new wxShare({
        debug: false,
        lineLink: vars.jiajuSite + '?c=jiaju&a=quoteTotalPrice&city=' + vars.city,
        shareTitle: '装修报价',
        descContent: '快来算一下你家装修要花多少钱吧!——房天下装修',
        imgUrl: imageUrl
    });
});