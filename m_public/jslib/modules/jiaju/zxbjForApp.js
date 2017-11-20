/**
 * @file WAP装修报价
 * @author 陶旭东-20160714
 * @modify 穆朝阳-20170326
 */
define('modules/jiaju/zxbjForApp', ['jquery', 'verifycode/1.0.0/verifycode', 'iscroll/2.0.0/iscroll-lite', 'weixin/2.0.0/weixinshare'], function (require, exports, module) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;
    var IScroll = require('iscroll/2.0.0/iscroll-lite');
    var verifycode = require('verifycode/1.0.0/verifycode');
    var jiajuUtils = vars.jiajuUtils;
    // click流量统计
    require.async(location.protocol + '//clickm.fang.com/click/new/clickm.js', function () {
        window.Clickstat.eventAdd(window, 'load', function () {
            window.Clickstat.batchEvent('wapbaojia_', '');
        });
    });

    function QuotePrice() {}
    QuotePrice.prototype = {
        init: function () {
            var that = this;
            that.status = 0;
            that.canAjax = 1;
            that.$arrUp = $('.arrUp');
            // 报价表单
            that.$container = $('.quotePriceBox');
            // 面积输入框
            that.$size = that.$container.find('.size');
            //手机号和验证码包含框
            that.$Tel = $('#Tel');
            // 更改手机号
            that.$phone = that.$container.find('.phone');
            // 获取验证码或者更换手机号按钮（以下三个代表同一个dom元素）
            that.$doubleUse = $('#doubleUse');
            // 更换手机号按钮
            that.$changeTel = that.$container.find('.changeTel');
            // 获取验证码按钮
            that.$verifyCode = that.$container.find('.verifyCode');
            // 验证码输入框
            that.$vCode = that.$container.find('.vCode');
            // 估算报价
            that.$quoteSubmit = that.$container.find('.quoteSubmit');
            // 底部筛选框
            that.$selectOption = $('.selectOption');
            // toast提示
            that.$sendFloat = $('#sendFloat');
            that.$sendText = $('#sendText');
            that.toastMsg = {
                phoneLength: '请输入11位手机号',
                phone: '请输入您的手机号码',
                phoneIllegal: '输入手机号错误',
                state: '请选择您的装修状态',
                room: '请选择您的房屋户型',
                area: '请选择您所在的区域',
                size: '请输入1~999范围内的有效数字'
            };
            that.initStatus();
            that.bindEvent();
            // 报价提交数据
            that.ajaxParam = {
                room: ['room', 'hall', 'kitchen', 'toilet', 'balcony'],
                area: ['province', 'city', 'district'],
                state: ['decstate', 'dectime']
            };
            // 当前select选择数据
            that.data = {};
            (vars.room || vars.area || vars.state) && that.initSelect();
            that.initSize2RoomConfig();
            that.room2SizeAble = true;
            that.size2Room = [{
                key: [0, 1, 1, 1, 1],
                alertMsg: '1 1 1 1 1'
            }, {
                key: [1, 1, 1, 1, 1],
                alertMsg: '2 1 1 1 1'
            }, {
                key: [1, 2, 1, 1, 1],
                alertMsg: '2 2 1 1 1'
            }, {
                key: [2, 2, 1, 1, 1],
                alertMsg: '3 2 1 1 1'
            }, {
                key: [2, 2, 1, 2, 2],
                alertMsg: '3 2 1 2 2'
            }, {
                key: [3, 2, 1, 2, 2],
                alertMsg: '4 2 1 2 2'
            }, {
                key: [4, 2, 1, 3, 3],
                alertMsg: '5 2 1 3 3'
            }];
        },

        /**
         * 初始化当前装修状态
         */
         decInit: function (data) {
            if(!data['decstate']) {
                var choiceindex = 0;
                var value = $('.state').val().trim();
                var decArr = ['准备装修','还未买房','已经装修'];
                decArr.forEach(function(item,index) {
                    if(value.indexOf(item) > -1) {
                        choiceindex = index;
                        return;
                    }
                });
                data['decstate'] = choiceindex + 1 + '';
            } 
         },

        /**
         * 初始化状态判断报价按钮是否可点
         */
        initStatus: function () {
            var statusObj = {
                allLen: 0,
                activeLen: 0
            };
            var that = this;
            that.$container.find('input').each(function () {
                var type = $(this).data('type');

                statusObj[type] = !!vars[type] ? !!vars[type] : !!$(this).val();
                (vars[type] ? vars[type] : $(this).val()) && statusObj.activeLen++;
                statusObj.allLen++;
            });
            that.statusObj = statusObj;
            if (statusObj.activeLen === statusObj.allLen) {
                that.$quoteSubmit.removeClass('active');
            } else {
                that.$quoteSubmit.addClass('active');
            }
        },

        /**
         * 刷新状态 判断报价按钮是否可以点击
         */
        refreshStatus: function (add, type) {
            var that = this;
            var activeType = type || that.activeType;
            var statusObj = that.statusObj;
            if (statusObj[activeType] ^ add) {
                statusObj[activeType] = add;
                statusObj.activeLen += add ? 1 : -1;
                if (statusObj.activeLen === statusObj.allLen) {
                    that.$quoteSubmit.removeClass('active');
                } else {
                    that.$quoteSubmit.addClass('active');
                }
            }
        },
        // 事件绑定
        bindEvent: function () {
            var that = this;
            // 1.面积输入框输入事件处理
            that.$size.on('focus', function () {
                that.activeType = $(this).data('type');
                that.size2RoomIndex = that.size2RoomIndex || 0;
                that.hideArrFn();
            }).on('input', $.proxy(that.sizeInputFn, that)).on('blur', $.proxy(that.sizeBlurFn, that));

            // 2.手机号输入事件处理
            that.$phone.on('focus', function () {
                that.activeType = $(this).data('type');
                that.hideArrFn();
            }).on('input', $.proxy(that.phoneInputFn, that)).on('blur', $.proxy(that.phoneBlurFn, that));

            // 3.input框点击弹出筛选框浮层
            that.$container.on('click', ' .quoteSelect', function () {
                that.$activeSelect = $(this).find('input');
                that.activeType = that.$activeSelect.data('type');
                that.selectClickFn();
            });
            // 底部筛选框点击事件
            that.$selectOption.on('click', function (e) {
                var $target = $(e.target);
                var tagName = e.target.tagName.toLowerCase();
                if ($target.hasClass('sf-maskFixed')
                    || $target.hasClass('cancel') && that.activeType !== 'room'
                    || $target.hasClass('return') && that.activeType === 'room') {
                    that.selectCloseFn();
                } else if ($target.hasClass('return') && that.activeType !== 'room') {
                    that.selectReturnFn();
                } else if($target.hasClass('submitOk')) {
                    that.selectCompleteFn();
                }else if (tagName === 'a' || tagName === 'li' && that.activeType !== 'room') {
                    if (!that.disabled) {
                        that.disabled = true;
                        that.activeItem = e.target;
                        that.itemPickFn();
                    }
                }
            });
            // 提交报价
            that.$quoteSubmit.on('click', $.proxy(that.quoteSubmitFn, that));

            // 验证手机号
            that.$vCode.on('input', $.proxy(that.vcodeInputFn, that)).on('focus',$.proxy(that.hideArrFn, that)).on('blur',$.proxy(that.showArrFn, that));

            // that.$Tel.find('.changeTel').on('click',function () {
            //     !$(this).hasClass('noClick') && that.changeMobileFn();
            // });
            // that.$Tel.find('.getCode').on('click',function () {
            //     that.phone = that.$phone.val();
            //     if(!that.$doubleUse.hasClass('noClick')) {
            //         that.getVerifyCode();
            //     }else {
            //         console.log('1111111111111111');
            //     }
            // });
            that.$doubleUse.on('click',function (event) {
                var self = $(event.target);
                if(self.hasClass('changeTel')) {
                    that.changeMobileFn();
                } else if(self.hasClass('getCode')) {
                    if(!self.hasClass('noClick')) {
                        that.getVerifyCode();
                    }
                }
            });
            // 页面滚动事件
            $(document).on('scroll',function () {
                that.pageScrollFn();
            });
        },
        pageScrollFn: function () {
            var that = this;
            var scrollTop = $(window).scrollTop();
            if(scrollTop === 0) {
                that.$arrUp.show();
            } else {
                that.$arrUp.hide();
            }
        },
        //   初始化两个数据that.pickItemArr[1] = $item;
        roomInit: function () {
            var that = this;
            var itemLength = that.data[that.activeType].pickItemArr.length;
            for(var i = 0;i < itemLength;i++) {
                that.pickItemArr[i] = that.data[that.activeType].pickItemArr[i];
                that.alertMsgArr[i] = that.data[that.activeType].alertMsgArr[i];
            }
        },

        /**
         * 点击更换手机号时，更改dom元素状态
         */
        changeMobileFn: function () {
            var that = this;
            var toggle = that.$doubleUse.hasClass('getCode');
            // 点击按钮
            that.$doubleUse.toggleClass('changeTel getCode noClick').text(toggle ? '更换手机号' : '获取验证码');
            toggle ? that.$doubleUse.show() : that.$doubleUse.hide();
            // phone input框
            that.$phone.prop('disabled', toggle);
            toggle || that.$phone.val('');
            // 报价提交按钮
            // that.$quoteSubmit.text(toggle ? '立即报价' : '立即估算');
            // 更新状态
            that.refreshStatus(toggle,'phone');
        },
        initSelect: function () {
            var that = this;
            var $select = that.$container.find('.quoteSelect').find('input');
            $.each($select, function (index, ele) {
                var type = $(ele).data('type');
                var $option = that.$selectOption.find('.' + type);
                var $items = type === 'room' ? $option.find('.active') : $option.find('.activeS');
                var data = {
                    pickItemArr: [],
                    alertMsgArr: []
                };
                $.each($items, function (index, item) {
                    var $item = $(item);
                    data.pickItemArr.push($item);
                    data.alertMsgArr.push($item.text());
                });
                that.data[type] = data;
            });
        },

        /**
         * 获取room浮层的ul(室，厅，厨，卫，阳台)
         */
        initSize2RoomConfig: function () {
            var that = this;
            var $room = that.$selectOption.find('.room');
            var options = [];
            $.each($room.find('li'), function (index, li) {
                options.push($(li).find('a'));
            });
            //
            that.room2SizeConfig = {
                $roomSelect: $('[data-type=room]'),
                $alertInfo: $room.find('.info'),
                roomOptionsArr: options,
                $allRoomArr: $room.find('a')
            };
        },

        /**
         * size input在输入时候判断数据的正确性，并报价按钮状态和 room input状态
         */
        sizeInputFn: function () {
            var that = this;
            var val = that.$size.val();
            var able = /^\d{1,3}(?:\.\d{1,2})?$/.test(val) && +val <= 999 && +val >= 1;
            that.refreshStatus(able);
            val = +val;
            if (!able || val < 60) {
                that.size2RoomIndex = 0;
            } else if (val < 70) {
                that.size2RoomIndex = 1;
            } else if (val < 90) {
                that.size2RoomIndex = 2;
            } else if (val < 120) {
                that.size2RoomIndex = 3;
            } else if (val < 150) {
                that.size2RoomIndex = 4;
            } else if (val < 170) {
                that.size2RoomIndex = 5;
            } else {
                that.size2RoomIndex = 6;
            }
            that.roomUpdateFn(1);
        },

        /**
         * size inputs 失去焦点的时候根据状态输出错误信息，同时更新room 弹出层的状态
         */
        sizeBlurFn: function () {
            var that = this;
            var msgType;
            if (!that.statusObj[that.activeType]) {
                msgType = that.activeType;
                that.toast(msgType);
            }
            that.roomUpdateFn();
            that.showArrFn();
        },
        //更新当前room input的内容更新 that.data.room的数据和 room弹出层的active类
        roomUpdateFn: function (onlyInfo) {
            var that = this;
            if (that.room2SizeAble) {
                var roomInfo = that.size2Room[that.size2RoomIndex];
                var room2SizeConfig = that.room2SizeConfig;
                var arr = ['室','厅','厨','卫','阳台'];
                var alertMsgArr = roomInfo.alertMsg.split(' ');
                for(var i = 0,il = alertMsgArr.length;i < il;i++) {
                    alertMsgArr[i] += arr[i];
                }
                if (onlyInfo) {
                    room2SizeConfig.$roomSelect.val(alertMsgArr.join(' '));
                } else {
                    if (!roomInfo.rooms) {
                        roomInfo.rooms = [];
                        roomInfo.pickItemArr = [];
                        $.each(roomInfo.key, function (index, value) {
                            var li = room2SizeConfig.roomOptionsArr[index][value];
                            roomInfo.rooms.push(li);
                            roomInfo.pickItemArr.push($(li));
                        });
                    }
                    room2SizeConfig.$roomSelect.val(alertMsgArr.join(' '));
                    room2SizeConfig.$alertInfo.text(alertMsgArr.join(' '));
                    room2SizeConfig.$allRoomArr.removeClass('active');
                    $(roomInfo.rooms).addClass('active');
                    that.data.room = {
                        pickItemArr: roomInfo.pickItemArr,
                        alertMsgArr: roomInfo.alertMsg.split(' ')
                    };
                    that.refreshStatus(1, 'room');
                }
            }
        },

        /**
         * phone input输入内容方法，判断数据正确性
         */
        phoneInputFn: function () {
            var that = this;
            var val = that.$phone.val();
            var able = /^1[34578][0-9]{9}$/.test(val);
            that.refreshStatus(able);
            if(able) {
                if(vars.phone === val) {
                    that.changeMobileFn();
                } else {
                    that.$doubleUse.removeClass('noClick');
                }
            }
        },

        /**
         * 电话输入框失去焦点处理方法，根据状态输入错误信息
          */
        phoneBlurFn: function () {
            var that = this;
            var msgType;
            if (!that.statusObj[that.activeType]) {
                var length = that.$phone.val().length;
                if (!length) {
                    msgType = that.activeType;
                } else if (length === 11) {
                    msgType = that.activeType + 'Illegal';
                } else {
                    msgType = that.activeType + 'Length';
                }
                that.toast(msgType);
            }
            that.showArrFn();
        },


        /**
         * input下拉框弹出浮层，并隐藏箭头
         */
        selectClickFn: function () {
            var that = this;
            var $activeOption = that.$activeOption = that.$selectOption.find('.' + that.activeType);
            var $activeList = $activeOption.find('.con').eq(0);
            $activeList.show().nextAll().hide();
            that.activeType !== 'room' && $activeOption.find('.return').hide();
            that.hideArrFn();
            $activeOption.show();
            that.activeType === 'room' && $activeOption.find('.sf-bdmenu').css('bottom','-296px').animate({bottom: 0},300);
            that.activeScroll = that.activeList = $activeList[0];
            that.IScrollEvent();
            that.pickItemArr = [];
            that.alertMsgArr = [];
            that.data[that.activeType] = that.data[that.activeType] || {
                pickItemArr: [],
                alertMsgArr: []
            };
            that.activeType === 'room' && that.roomInit();
            jiajuUtils.toggleTouchmove(1);
        },

        /**
         * 取消按钮和黑色区域点击浮层消失
         */
        selectCloseFn: function () {
            var that = this;
            if(that.activeType === 'room') {
                that.$activeOption.find('.sf-bdmenu').animate({bottom: '-296px'},300);
                setTimeout(function () {
                    that.$activeOption.hide();
                },300);
            } else {
                that.$activeOption.hide();
            }
            that.showArrFn();
            jiajuUtils.toggleTouchmove(0);
            var bakInfo = that.data[that.activeType];
            that.alertMsgArr = bakInfo.alertMsgArr;
            that.refreshAlertMsg();
            if(that.activeType === 'room') {
                that.$activeOption.find('.active').removeClass('active');
            } else {
                that.$activeOption.find('.activeS').removeClass('activeS');
            }
            $.each(bakInfo.pickItemArr, function (index, ele) {
                $(ele).addClass(that.activeType === 'room' ? 'active' : 'activeS');
            });
            that.selectBlurFn();
        },

        /**
         * 判断input下拉框内容是否为空
         */
        selectBlurFn: function () {
            var that = this;
            var msgType = that.activeType;
            if (!that.statusObj[msgType]) {
                setTimeout(function () {
                    that.toast(msgType);
                }, 100);
            }
        },

        /**
         * 底部筛选框浮层 返回按钮事件处理
          */
        selectReturnFn: function () {
            var that = this;
            var $item = that.pickItemArr.pop();
            that.alertMsgArr.pop();
            $item.removeClass('activeS');
            that.refreshAlertMsg();
            $(that.activeList).hide();
            if (that.pickItemArr.length) {
                that.activeList = $item.parents('.con')[0];
            } else {
                that.activeList = that.$activeOption.find('.con')[0];
                that.$activeOption.find('.return').hide();
            }
            $(that.activeList).show();
        },
        // 底部筛选框 完成
        selectCompleteFn: function () {
            var that = this;
            if(that.activeType === 'room') {
                that.$activeOption.find('.sf-bdmenu').animate({bottom: '-296px'},300);
                setTimeout(function () {
                    that.$activeOption.hide();
                },300);
            } else {
                that.$activeOption.hide();
            }
            that.showArrFn();
            jiajuUtils.toggleTouchmove(0);
            that.data[that.activeType] = {
                pickItemArr: that.pickItemArr,
                alertMsgArr: that.alertMsgArr
            };
            that.activeType === 'room' && (that.room2SizeAble = false);
            that.refreshStatus(1);
        },

        /**
         * 底部筛选框 筛选项选择
         */
        itemPickFn: function () {
            var that = this;
            var $activeList = $(that.activeList);
            var $item = $(that.activeItem);
            var value = $item.attr('value');
            if(that.activeType === 'room') {
                var aParent = $item.parent();
                var aSpanText = aParent.find('span').text();
                switch(aSpanText) {
                    case '室':
                        that.pickItemArr[0] = $item;
                        that.alertMsgArr[0] = $item.text();
                        break;
                    case '厅':
                        that.pickItemArr[1] = $item;
                        that.alertMsgArr[1] = $item.text();
                        break;
                    case '厨':
                        that.pickItemArr[2] = $item;
                        that.alertMsgArr[2] = $item.text();
                        break;
                    case '卫':
                        that.pickItemArr[3] = $item;
                        that.alertMsgArr[3] = $item.text();
                        break;
                    case '阳台':
                        that.pickItemArr[4] = $item;
                        that.alertMsgArr[4] = $item.text();
                        break;
                }
                $item.addClass('active').siblings().removeClass('active');
                that.refreshAlertMsg();
                that.disabled = false;
            } else {
                that.pickItemArr.push($item);
                that.alertMsgArr.push($item.text());
                var $nextList, $nextScroll;
                $nextList = $activeList.next('.con');
                $item.addClass('active activeS').siblings().removeClass('activeS');
                that.activeList = $nextList[0];
                setTimeout(function () {
                    $activeList.hide();
                    that.refreshAlertMsg();
                    if ($nextList.length) {
                        that.$activeOption.find('.return').show();
                        $nextList.show();
                        if ($nextList.children('div').length) {
                            $nextScroll = $nextList.find('.' + value);
                            if ($nextScroll.length) {
                                $nextScroll.show().siblings().hide();
                                that.activeScroll = $nextScroll[0];
                            } else {
                                $activeList.nextAll('.con').find('.activeS').removeClass('activeS');
                                that.selectCompleteFn();
                                return;
                            }
                        } else {
                            that.activeScroll = that.activeList;
                        }
                        that.IScrollEvent();
                    } else {
                        that.selectCompleteFn();
                    }
                }, 200);
                setTimeout(function () {
                    $item.removeClass('active');
                    that.disabled = false;
                }, 600);
            }
        },

        /**
         * 刷新筛选框和input框提示信息
          */
        refreshAlertMsg: function () {
            var that = this;
            var $info = that.$activeOption.find('.info');
            var arr = ['室','厅','厨','卫','阳台'];
            var temp = [];
            if(that.activeType === 'room') {
                for(var i = 0,il = arr.length;i < il;i++) {
                    temp[i] = that.alertMsgArr[i] + arr[i];
                }
            } else {
                temp = that.alertMsgArr;
            }
            $info.text(temp.length ? temp.join(' ') : $info.data('ph'));
            that.$activeSelect.val(temp.length ? temp.join(' ') : '');
        },

        // 提交报价
        // 点击报价
        quoteSubmitFn: function () {
            var that = this;
            if (!that.$quoteSubmit.hasClass('active') && that.canAjax) {
                that.hideArrFn();
                that.canAjax = false;
                var phone = that.$phone.val();
                $.ajax({
                    url: vars.jiajuSite + '?c=jiaju&a=ajaxIsBlack',
                    data: {mobile:phone},
                    success: function (res) {
                        if (res.IsBlack === '1') {
                            //黑名单用户，需要验证码
                            that.phone = phone;
                            if(that.$vCode.hasClass('hasSend')) {
                                that.vsubmitFn();
                            }else {
                                // that.$vCode.parent().parent().show();
                                that.getVerifyCode();
                                that.$quoteSubmit.addClass('active');
                            }
                        } else {
                             that.sendQuoteFn();
                        }
                    }
                });
            }
        },
        // 发送报价
        sendQuoteFn: function () {
            var that = this;
            that.canAjax = false;
            var data = that.generateData();
            $.ajax({
                url: vars.jiajuSite + '?c=jiaju&a=ajaxZxbj',
                data: data,
                success: function (res) {
                    if (res.IsSuc === '1') {
                        window.location.href = res.href;
                    } else {
                        that.toast(res.ErrorMsg);
                    }
                },
                complete: function () {
                    that.canAjax = true;
                    that.showArrFn();
                }
            });
        },
        // 生成ajax数据
        generateData: function () {
            var data = {};
            var that = this;
            $.each(that.data, function (key, value) {
                $.each(value.pickItemArr, function (index, ele) {
                    if (key === 'area') {
                        data[that.ajaxParam[key][index] + 'name'] = $(ele).text();
                        data[that.ajaxParam[key][index] + 'id'] = $(ele).attr('value');
                    } else {
                        data[that.ajaxParam[key][index]] = $(ele).attr('value');
                    }
                });
            });
            that.decInit(data);
            data.area = that.$size.val();
            data.mobile = that.$phone.val();
            data.sourcepageurl = encodeURIComponent(vars.sourcepageurl);
            that.phone !== vars.phone && (data.vcode = that.$vCode.val());
            return data;
        },

        // 获取验证码
        getVerifyCode: function () {
            var that = this;
            that.canAjax = false;
            verifycode.getPhoneVerifyCode(that.phone, function () {
                that.$vCode.addClass('hasSend').val('');
                that.$verifyCode.parent().parent().show();
                that.$doubleUse.text('发送验证码').show().addClass('noClick getCode').removeClass('changeTel');
                that.timeRecorder(60);
                that.canAjax = true;
                that.showArrFn();
            }, function () {
                that.toast('获取验证码失败');
                that.canAjax = true;
                that.showArrFn();
            });
        },
        // 倒计时
        timeRecorder: function (timePara) {
            var that = this;
            var time = timePara;
            that.$phone.prop('disabled', true);
            var handle = setInterval(function () {
                that.time = time;
                that.$doubleUse.text('发送中(' + time + ')');
                if (time === 0) {
                    clearInterval(handle);
                    that.$doubleUse.text('重新发送');
                    // 只要发送验证码以后就不能修改手机号了
                    // that.$phone.prop('disabled', false);
                    that.$doubleUse.removeClass('noClick');
                }
                time--;
            }, 1000);
        },
        // 验证码输入
        vcodeInputFn: function () {
            var that = this;
            var statusObj = that.statusObj;
            // 防止在输完验证码以后，删除原来的信息添加statusObj.activeLen === statusObj.allLen验证
            that.$quoteSubmit[(/^\s*\d{4}\s*$/.test(that.$vCode.val()) && statusObj.activeLen === statusObj.allLen) ? 'removeClass' : 'addClass']('active');
        },
        // 验证码提交
        vsubmitFn: function () {
            var that = this;
            that.canAjax = false;
            verifycode.sendVerifyCodeAnswer(that.phone, that.$vCode.val(), $.proxy(that.sendQuoteFn, that), function () {
                that.toast('验证码错误');
                that.canAjax = true;
                that.showArrFn();
            });
        },
        // 关闭验证码谈层
        cancelFn: function () {
            var that = this;
            that.$floatAlert.hide();
            jiajuUtils.toggleTouchmove();
        },
        // iscroll滚动
        // 添加滚动
        IScrollEvent: (function () {
            var eleList = [];
            var isList = [];
            return function () {
                // 滑动
                var that = this;
                that.posLog = that.refreshPosLog();
                var is;
                var ele = that.activeScroll;
                var index = $.inArray(ele, eleList);
                if (index === -1) {
                    is = new IScroll(ele);
                    eleList.push(ele);
                    isList.push(is);
                } else {
                    is = isList[index];
                    is.refresh();
                }
                // 当前筛选菜单下的筛选项
                var $li = $(ele).find('li');
                // 筛选项总数
                var length = $li.length;
                // 当前选中筛选项的序数
                var itemIndex = $li.filter('.activeS').index();
                // 大于一屏
                if (itemIndex > that.posLog.length - 1) {
                    is.scrollTo(0, -itemIndex * that.posLog.height);
                    // 最后一屏
                    if (length - itemIndex < that.posLog.length) {
                        is.scrollTo(0, -(length - that.posLog.length) * that.posLog.height);
                    }
                }
            };
        })(),
        // 记录筛选项高度和单屏筛选框个数
        refreshPosLog: (function () {
            // 只执行一次
            var isFirst = 1;
            var posLog = {};
            return function () {
                if (isFirst) {
                    var that = this;
                    var $filterMenu = $(that.activeScroll);
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
        showArrFn: function () {
            var that = this;
            that.$arrUp.show();
        },
        hideArrFn: function () {
            var that = this;
            that.$arrUp.hide();
        },
        // toast提示
        toast: function (msgType) {
            var that = this;
            that.$sendText.text(that.toastMsg[msgType] || msgType);
            that.$sendFloat.show();
            that.toastTime && clearTimeout(that.toastTime);
            that.toastTime = setTimeout(function () {
                that.$sendFloat.hide();
            }, 2000);
        }
    };
    module.exports = new QuotePrice();
    // 点击历史评估 如果登陆了直接跳转历史评估记录页 否则要求用户登录
    var history = $('.pgHistory');
    history.on('click', 'a', function () {
        $.get(vars.publicSite + '?c=public&a=ajaxUserInfo', function (info) {
            var url;
            if (!info.userid) {
                url = location.protocol + '//m.fang.com/passport/login.aspx?burl=' + encodeURIComponent(window.location.href);
            } else {
                url = vars.jiajuSite + '?c=jiaju&a=history' + (vars.sc ? '&sc=' + vars.sc : '')
                    + (vars.fapp ? '&fapp=' + vars.fapp : '') + (vars.src ? '&src=client' : '');
            }
            window.location = url;
            return;
        });
    });
    // 微信分享
    var wxShare = require('weixin/2.0.0/weixinshare');
    var imageUrl = vars.public + 'img/app_jiaju_logo.png';
    imageUrl = imageUrl.replace(/^(https?)?(?=\/\/)/, location.protocol);
    new wxShare({
        // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        debug: false,
        lineLink: location.protocol + vars.jiajuSite + '?c=jiaju&a=zxbjForApp&city=bj&source=wap',
        shareTitle: '装修报价',
        descContent: '快来算一下你家装修要花多少钱吧！——房天下装修',
        imgUrl: imageUrl
    });
});