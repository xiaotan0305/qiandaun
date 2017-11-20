/**
 * 我的租房发布页 租房类型
 * by zdl 20160701 租房ui改版
 */
define('modules/myzf/houseLeaseStepOne', ['jquery', 'verifycode/1.0.0/verifycode', 'slideFilterBox/1.0.0/slideFilterBox'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var vars = seajs.data.vars;
        var $ = require('jquery');
        // 发送验证码插件
        var verifycode = require('verifycode/1.0.0/verifycode');
        // 滑动筛选框插件++++++++++++++++++++
        var slideFilterBox = require('slideFilterBox/1.0.0/slideFilterBox');
        // 输入小区名称联想出来的数据内容
        var dContent = $('#search_completev1');
        // 商圈对应的span
        var dComarea = $('#comareaManual');
        // 区域对应的sapn
        var districtManual = $('#districtManual');
        var messagecodeManual = $('#messagecodeManual');
        var $doc = $(document);
        // 验证码格式验证
        var patterncode = /^\d{4}$/;
        // 数字滚动效果start
        $.fn.countTo = function (options) {
            options = options || {};
            return $(this).each(function () {
                // set options for current element
                var settings = $.extend({}, $.fn.countTo.defaults, {
                    from: $(this).data('from'),
                    to: $(this).data('to'),
                    speed: $(this).data('speed'),
                    refreshInterval: $(this).data('refresh-interval'),
                    decimals: $(this).data('decimals')
                }, options);

                // how many times to update the value, and how much to increment the value on each update
                var loops = Math.ceil(settings.speed / settings.refreshInterval),
                    increment = (settings.to - settings.from) / loops;

                // references & variables that will change with each update
                var self = this,
                    $self = $(this),
                    loopCount = 0,
                    value = settings.from,
                    data = $self.data('countTo') || {};

                function render(value) {
                    var formattedValue = settings.formatter.call(self, value, settings);
                    $self.html(formattedValue);
                }

                function updateTimer() {
                    value += increment;
                    loopCount++;

                    render(value);

                    if (typeof(settings.onUpdate) == 'function') {
                        settings.onUpdate.call(self, value);
                    }

                    if (loopCount >= loops) {
                        // remove the interval
                        $self.removeData('countTo');
                        clearInterval(data.interval);
                        value = settings.to;

                        if (typeof(settings.onComplete) == 'function') {
                            settings.onComplete.call(self, value);
                        }
                    }
                }

                $self.data('countTo', data);

                // if an existing interval can be found, clear it first
                if (data.interval) {
                    clearInterval(data.interval);
                }
                data.interval = setInterval(updateTimer, settings.refreshInterval);

                // initialize the element with the starting value
                render(value);
            });
        };

        $.fn.countTo.defaults = {
            // the number the element should start at
            from: 0,
            // the number the element should end at
            to: 0,
            // how long it should take to count between the target numbers
            speed: 1000,
            // how often the element should be updated
            refreshInterval: 100,
            // the number of decimal places to show
            decimals: 0,
            // handler for formatting the value before rendering
            formatter: formatter,
            // callback method for every time the element is updated
            onUpdate: null,
            // callback method for when the element finishes updating
            onComplete: null
        };

        function formatter(value, settings) {
            return value.toFixed(settings.decimals);
        }


        // custom formatting example
        $('#count-number').data('countToOptions', {
            formatter: function (value, options) {
                return value.toFixed(options.decimals).replace(/\B(?=(?:\d{3})+(?!\d))/g, ',');
            }
        });


        function count(options) {
            var $this = $(this);
            options = $.extend({}, options || {}, $this.data('countToOptions') || {});
            $this.countTo(options);
        }
        // 数字滚动效果end

        /**
         * 为了方便解绑事件，声明一个阻止页面默认事件的函数
         * @param e
         */
        function pdEvent(e) {
            e.preventDefault();
        }

        /**
         * 禁止页面滑动
         */
        function unable() {
            $doc.on('touchmove', pdEvent);
        }

        /**
         * 允许页面滑动
         */
        function enable() {
            $doc.off('touchmove', pdEvent);
        }
        // 提交按钮是否可用验证函数
        // 缓存提交按钮元素
        var $btnPay = $('.btn-pay');

        /*
         *提交按钮颜色控制函数
         */
        function submitVerification() {
            // 如果改五个输入框的值都不为空 并且区域商圈 出租方式都不为空
            // var projnameManualVal = $('#projnameManual').val();
            // 地址
            var addressManualVal = $('#addressManual').val();
            // 联系人
            var contactpersonManualVal = $('#contactpersonManual').val();
            // 电话号码
            var mobilecodeManualVal = $('#mobilecodeManual').val();
            // 验证码
            var messagecodeManualVal = $('#messagecodeManual').val();
            // 区域
            var districtManualVal = $('#districtManual').text();
            // 商圈
            var comareaManualVal = $('#comareaManual').text();
            // 出租方式
            var leaseTypeVal = $('#leaseType').text();
            // 如果验证码输入框没有隐藏 需要多验证一个字段 验证码
            if (!$('#messageCodeDl').is(':hidden')) {
                if (dContent.is(':hidden') && addressManualVal !== '' && contactpersonManualVal !== '' && mobilecodeManualVal !== ''
                    && messagecodeManualVal !== '' && districtManualVal !== '请选择' && comareaManualVal !== '请选择' && leaseTypeVal !== '请选择') {
                    // 如果用户都填写了以上字段 把发布按钮置为红色
                    $btnPay.removeClass('noClick');
                } else {
                    $btnPay.addClass('noClick');
                }
            } else {
                if (dContent.is(':hidden') && addressManualVal !== '' && contactpersonManualVal !== '' && mobilecodeManualVal !== ''
                    && districtManualVal !== '请选择' && comareaManualVal !== '请选择' && leaseTypeVal !== '请选择') {
                    $btnPay.removeClass('noClick');
                } else {
                    $btnPay.addClass('noClick');
                }
            }
        }

        // 页面加载的时候调用验证函数 用于判断回退时是否可以提交数据
        submitVerification();

        // 浮层提示控制
        var $sendFloat = $('#sendFloat');
        function displayLose(time, keywords, url) {
            $('#sendText').text(keywords);
            $sendFloat.show();
            setTimeout(function () {
                $sendFloat.hide();
                if (url) {
                    window.location.href = url;
                }
            },time);
        }
        // start all the timers
        // 页面加载时业主预约人数的滚动效果展示
        $('.timer').each(count);

        // 回退按钮相关操作
        // 缓存回退提示浮层
        var $floatAlert = $('.floatAlert');
        // 给页面的回退按钮添加点击事件
        $('.back').on('click',function (e) {
            e.preventDefault();
            // 显示回退提示浮层
            $floatAlert.show();
        });

        // 回退提示浮层处理
        $floatAlert.on('click','a',function () {
            var $that = $(this);
            $floatAlert.hide();
            // 点击确定按钮 表示离开此页面
            if ($that.attr('id') === 'reset') {
                var param = {};
                // phone projcode projname ownerName
                // 小区id
                param.projcode = $('#projcode').val();
                // 小区名称
                param.projname = $('#projnameManual').val();
                // 电话号码
                param.phone = $('#mobilecodeManual').val();
                // 联系人
                param.ownerName = $('#contactpersonManual').val();
                if (param.projcode !== '' && param.projname !== '' && param.phone !== '') {
                    $.ajax({
                        url: vars.mySite + '?c=myzf&a=ajaxSubmitPartialInfo',
                        data: param,
                        type: 'POST',
                        dataType: 'json',
                        success: function (data) {
                            if (data !== 'error') {
                                window.history.back();
                            } else {
                                window.history.back();
                            }
                        }
                    });
                } else {
                    window.history.back();
                }
            }
        });

        // 给下拉浮层列表取消按钮添加点击事件
        $('.cancel').on('click', function () {
            // 隐藏下拉浮层列表
            $('.sf-maskFixed').hide();
            enable();
        });

        // 联系人只能输入汉字的限制
        var contactpersonManualTest = /([a-zA-Z\u4e00-\u9fa5]+[\s]?)+$/;
        $('#contactpersonManual').on('input',function () {
            var inputVal = $(this).val();
            if (inputVal !== '' && inputVal !== ' ' && !contactpersonManualTest.test(inputVal)) {
                displayLose(2000,'只能输入汉字或字母！');
                $(this).val('');
            }
        });
        // 出租方式按钮添加点击事件
        $('#leaseType,#districtManual,#comareaManual').on('click', function () {
            var $that = $(this);
            var eleId = $that.attr('id');
            // 获取该按钮对应的下拉选项列表的id
            var drapId = eleId + 'Drap';
            // 显示该按钮对应的下拉选择列表
            // 由于商圈是根据点击区域下拉列表后ajax获取得到 所以必须要选择区域后才会得到商圈信息
            $('#' + drapId).show();
            if (eleId === 'comareaManual' && $('#' + eleId).text() === '请选择') {
                $('#' + drapId).hide();
                displayLose(2000,'请先选择区域！');
            } else {
                slideFilterBox.refresh('#' + eleId + 'DrapCon');
                slideFilterBox.to('#' + eleId + 'DrapCon', 0);
                unable();
            }

        });

        // 出租方式下拉列表添加点击事件
        var $leaseType = $('#leaseType');
        $('#leaseTypeDrapCon').find('li').on('click', function () {
            var $that = $(this);
            var clickVal = $that.text();
            $leaseType.addClass('xuan2');
            $leaseType.text(clickVal);
            $('.sf-maskFixed').hide();
            submitVerification();
            enable();
        });

        // 性别选择
        $('#selectGender').find('a').on('click', function () {
            var $that = $(this);
            $that.siblings().removeClass('active');
            $that.addClass('active');
        });

        // 是否开启400免费电话
        var $isuseTel = $('#isuse400tel');
        $isuseTel.on('click', function () {
            if ($(this).attr('checked') === 'checked') {
                // 如果是选中的再次点击取消选中
                $(this).attr('checked',false);
                $isuseTel.val('0');
            } else {
                $(this).attr('checked',true);
                $isuseTel.val('1');
            }
        });

        // 控制验证码发送成功后要60秒后才可以从新发送
        // 倒计时秒数
        var timeCount = 60;
        // 发送验证码按钮
        var $sendVerifyCode = $('#sendVerifyCode');
        // 点击获取语音验证码
        var timeCountV = 60;
        // 防止多次请求发送语音验证码
        var sendFlag = true;
        // 发送语音验证码按钮
        var $sendVoice = $('#sendVoice');
        var timer1,timer2;
        // 点击发送验证码成功时的回调函数
        function countDown() {
            // 发送语音验证码按钮置为灰色
            $sendVoice.removeClass('red-f6');
            // 发送验证码按钮置为灰色
            $sendVerifyCode.addClass('noClick');
            // 显示发送语音验证码按钮
            $('.submitbox').find('li').eq(0).show();
            // 60s倒计时
            timer1 = setInterval(function () {
                timeCount--;
                $sendVerifyCode.text(timeCount + 's');
                if (timeCount === -1) {
                    // 清除定时器
                    clearInterval(timer1);
                    // 倒计时结束的时候把发送验证码的文本修改为重新获取
                    $sendVerifyCode.text('重新获取');
                    // 将发送语音验证码按钮设置为红色可点击状态
                    $sendVoice.addClass('red-f6');
                    // 将发送验证码按钮设置为红色可点击状态
                    $sendVerifyCode.removeClass('noClick');
                    timeCount = 60;
                }
            }, 1000);
        }

        // 点击获取验证码
        $sendVerifyCode.on('click', function () {
            var phone = $('#mobilecodeManual').val();
            if ($(this).hasClass('noClick')) {
                return false;
            }
            $('.submitbox').find('div').show();
            // 调用发送验证码接口getPhoneVerifyCode  param 手机号吗 发送成功的回掉函数 发送失败的回掉函数
            // verifycode.sendVerifyCodeAnswer 验证码验证接口
            verifycode.getPhoneVerifyCode(phone, countDown, function () {
                // 获取验证码失败 回掉此函 把获取验证码按钮置为可用
                // displayLose(2000,'验证码发送失败！');
                return false;
            });
        });

        function countDownVoice() {
            // 进入倒计时
            $sendVerifyCode.addClass('noClick');
            $sendVoice.removeClass('red-f6');
            timer2 = setInterval(function () {
                timeCountV--;
                $sendVoice.text('重新发送(' + timeCountV + ')');
                if (timeCountV === -1) {
                    sendFlag = true;
                    clearInterval(timer2);
                    $sendVoice.text('语音验证码');
                    $sendVoice.addClass('red-f6');
                    $sendVerifyCode.removeClass('noClick');
                    timeCountV = 60;
                }
            }, 1000);
        }
        // 点击发送语音验证码
        $sendVoice.on('click',function () {
            var phone = $('#mobilecodeManual').val();
            if (!$sendVoice.hasClass('red-f6')) {
                return false;
            }
            if (!sendFlag) {
                return false;
            }
            if (sendFlag) {
                if (/^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$/i.test(phone)) {
                    $.ajax({
                        url: 'https://passport.fang.com/passport/Mloginsendmsm.api',
                        type: 'Post',
                        dataType: 'json',
                        async: false,
                        xhrFields: {
                            withCredentials: true
                        },
                        crossDomain: true,
                        data: {
                            MobilePhone: phone, Operatetype: '0', Service: 'soufun-wap-wap', Sendvoice: '1'
                        },
                        error: function () {
                            displayLose(2000,'服务器开小差了，请重试！');
                        },
                        success: function (data) {
                            if (data.Message === 'Success') {
                                countDownVoice();
                                sendFlag = false;
                            } else if (data.IsSent) {
                                displayLose(2000,data.Tip);
                            }
                        }
                    });
                } else {
                    displayLose(2000,'请输入正确格式的手机号码！');
                }
            }
        });


        function parsevalue(Projcode, Projname, Address, Purpose, District, Comarea) {
            // 设置小区名称的iput框中的数据
            $('#projnameManual').val(Projname);
            // 隐藏联想出来的列表li
            dContent.hide();
            // 设置projcode的值
            $('#projcode').val(Projcode);
            // 设置地址菜单的值
            $('#addressManual').val(Address);
            // 将Purpose数据出入该值对应的hidden input
            $('#purposeManual').val(Purpose);
            // 区域对应的input
            var districtObj = districtManual;
            districtObj.val(District);
            if (!districtObj.val() && District) {
                districtObj.val(District.replace(/\u533a$/, ''));
            }
            if (Comarea !== '') $('#comarea').val(Comarea);
            submitVerification();
        }

        // +++++++++++++++++++
        // 展示房源列表
        var ajaxFlag = 0;
        // 小区名称输入框输入数据时的处理操作
        $('#projnameManual').on('keyup', function () {
            // 如果再次调用时前一个ajax在执行，终止此次ajax的执行
            if (ajaxFlag) {
                ajaxFlag.abort();
                ajaxFlag = 0;
            }
            var value = $(this).val();
            // 获取所小区名称input框中数据
            var district = districtManual.val();
            // 用来存取商圈span中的值
            var comarea = '';
            if (dComarea.length > 0) comarea = dComarea.val();
            // 如果没有输入数据
            if (value.length === 0) {
                // 清空之前联想的数据  否则每隔1秒 根据楼盘输入框的值 请求联想一次
                dContent.html('');
            } else {
                var param = {c: 'myzf', a: 'ajaxGetProjList', q: value};
                ajaxFlag = $.get(vars.mySite, param, function (data) {
                    // dContent.html(data);
                    // +++++++++++++++
                    // 将联想到小区名称列表 写入到对应的显示小区列表的div中
                    dContent.html(data);
                    // 输入小区名称联想接口返回了数据时
                    if (data.length > 0) {
                        // 当输入的数据可以联想到小区时 隐藏需要填写的区域、商圈、地址div
                        $('#noLouPan').hide();
                        // 显示联想出来的小区名称列表li
                        dContent.show();
                    } else {
                        // 将数据存起来写入到页面的input hidden中
                        parsevalue('', value, '', '住宅', district, comarea);
                        // 当输入的数据没有联想到小区时 显示需要填写的区域、商圈、地址div
                        $('#noLouPan').show();
                        // 隐藏联想小区名称列表li
                        dContent.hide();
                    }
                }, 'json');
                // value表示小区input输入框中的数据 district表示区域span标签中的数据 comarea 表示商圈span中对应的数据
            }
        });

        // ++++++++++++++++++++++++++++给小区联想出来的小区列表添加点击事件
        dContent.on('click', 'li.pad10', function () {
            // $(this).hide();
            // 取出联想到的li中的data-fan中的数据 用！！分割为数组
            var arr = $(this).attr('data_fun').split('!!');
            dContent.html('');
            dContent.hide();
            // 楼盘联想有数据时则对应的区域、商圈、地址都应该从联想到的楼盘带出
            // 带出的区域数据
            var tmpDistrict = arr[arr.length - 2].replace(/\'|\'/g, '');
            // 连带出的商圈数据
            var tmpComarea = arr[arr.length - 1].replace(/\'|\'|\)/g, '');
            // 获取连带出的商圈选中的下拉列表数据
            // +++++++++++++++++++++++++++++将该联想对应的区域显示在区域div中
            districtManual.text(tmpDistrict);
            dComarea.text(tmpComarea);
            // 获取选中的区域
            var comareaOption = $('#districtManualDrapCon').find('li[value=' + tmpDistrict + ']');
            // 获取对应选中的区域ID
            var disId = comareaOption.attr('dis_id');
            var param = {c: 'myzf', a: 'ajaxGetComarea', dis_id: disId};
            // ajax获取对应的商圈信息
            $.get(vars.mySite, param, function (data) {
                var str = '';
                if (data) {
                    for (var i = 0; i < data.length; i++) {
                        str += '<li value="' + data[i].name + '">' + data[i].name + '</li>';
                    }
                }
                // 将对应的商圈选项列表写入到商圈选择下拉列表中
                // $('#comareaManual').html(str).val(tmpComarea);
                // ++++++++++++++++
                $('#comareaManualDrapLi').html(str).val(tmpComarea);
            }, 'json');
            var dataStr = $(this).attr('data_fun');
            var data = dataStr.split('!!');
            parsevalue(data[0], data[1], data[2], data[3], data[4], data[5]);
            submitVerification();
        });

        //  给区域选择列表添加点击事件
        $('#districtManualDrap').on('click', 'li', function () {
            // 每次点击区域选择列表li时 更新商圈显示span中的内容
            dComarea.text('请选择商圈');
            var $that = $(this);
            // 获取用户选中的区域名称
            var selectedValue = $that.text();
            // 将用户选择的区域写入到对应的显示div中
            districtManual.text(selectedValue);
            // 隐藏区域选择下拉列表
            $('#districtManualDrap').hide();


            //  当用户没有从联想接口获取到小区名称的数据时 根据用户选择的区域值 动态的获取对应的商圈
            // 并将对应于区域的商圈列表数据写入到对应的商圈选择下拉列表中
            var disId = $that.attr('dis_id');
            var param = {c: 'myzf', a: 'ajaxGetComarea', dis_id: disId};
            var str = '';
            $.get(vars.mySite, param, function (data) {
                if (data) {
                    for (var i = 0; i < data.length; i++) {
                        str += '<li value="' + data[i].name + '">' + data[i].name + '</li>';
                    }
                }
                // 将选择的区域名称对应的商圈列表数据写入到商圈选择下拉列表中
                $('#comareaManualDrapLi').html(str);
            }, 'json');
            submitVerification();
            // 隐藏区域选择下拉列表隐藏时 允许页面滑动
            enable();
        });

        // 给商圈选择列表添加点击事件
        $('#comareaManualDrap').on('click','li',function () {
            var $that = $(this);
            // 获取选中的商圈值
            var selectedValue = $that.text();
            // 设置商圈显示span标签的值
            $('#comareaManual').text(selectedValue);
            // 隐藏商圈选择下拉列表
            $('#comareaManualDrap').hide();
            submitVerification();
            // 允许页面滚动
            enable();
        });

        // 控制提交按钮是否可用 param projnameManual小区名称输入框 addressManual 地址输入框
        // contactpersonManual 联系人输入框 mobilecodeManual 手机号码输入框 messagecodeManual 验证码输入框
        $('#addressManual,#contactpersonManual,#messagecodeManual').on('input',function () {
            submitVerification();
        });
        // 手机号、验证码输入
        var $mobilecodeManualId = $('#mobilecodeManual');
        var oldPhone = $mobilecodeManualId.val();
        $mobilecodeManualId.on('input', function () {
            var me = $(this),messageCodeDl = $('#messageCodeDl'), sendVerifyCode = $('#sendVerifyCode');
            me.val(me.val().substring(0, 11).replace(/[\D]/g, ''));
            if (oldPhone !== me.val()) {
                vars.authenticated = 0;
                messageCodeDl.show();
                sendVerifyCode.show();
            } else if (oldPhone !== '' && oldPhone === me.val()) {
                vars.authenticated = 1;
                messageCodeDl.hide();
                sendVerifyCode.hide();
            }
            submitVerification();
        });

        // 提交按钮添加点击事件
        var submitFlag = false;
        var mysfut;
        $btnPay.on('click',function () {
            // 如果数据已经提交成功 不允许用户重复提交
            if (submitFlag) {
                return false;
            }
            // 验证码发送失败时的回到函数
            var verifyError = function () {
                displayLose(2000,'短信验证码验证失败,请尝试重新发送！');
                return false;
            };
            var verifySuccess = function () {
                // 定义一个参数对象 用来存娶提交给后台的数据
                var param = {};
                // sfut
                param.telSfut = mysfut;
                // 小区名称
                param.Projname = $('#projnameManual').val();
                // 小区id
                param.Projcode = $('#projcode').val();
                // 区域值
                param.District = $('#districtManual').text();
                // 商圈值
                param.Comarea = $('#comareaManual').text();
                // 地址值
                param.Address = $('#addressManual').val();
                // 出租方式
                param.Mright = $('#leaseType').text();
                // 联系人
                param.Contactperson = $('#contactpersonManual').val();
                // 性别
                param.Gender = $('#selectGender ').find('a.active').text();
                // 是否选择了400电话
                param.Isuse400 = $isuseTel.val();
                // 是否走修改接口
                param.modify = $('#modify').val();
                // 发布类型
                param.pubtype = vars.pubtype;
                // 电话号码
                param.mobilecode = $('#mobilecodeManual').val();
                // 成功后跳转地址
                var sucurl = vars.mySite + '?c=myzf&a=houseLeaseStepTwo';
                if ($btnPay.hasClass('noClick')) {
                    // console.log('用户没有按照要求填写必填信息');
                    return false;
                }
                // console.log('用户已经按照要求填写必填信息 下一步验证填写的信息是否正确');
                // 验证联系人 手机号 验证码是否符合要求
                // 验证手机号
                if (!/^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$/i.test(param.mobilecode)) {
                    displayLose(2000,'请输入正确格式的手机号码！');
                    return false;
                }
                $.ajax({
                    url: vars.mySite + '?c=myzf&a=submitHouseInfoTemp',
                    data: param,
                    type: 'POST',
                    async: false,
                    success: function (data) {
                        if (data) {
                            // 如果数据提交成功
                            if (data.errcode === '100') {
                                // 数据提交成功 提交标志位设置为true
                                submitFlag = true;
                                clearInterval(timer2);
                                clearInterval(timer1);
                                $sendVerifyCode.text('重新获取');
                                $sendVerifyCode.removeClass('noClick');
                                sucurl += vars.h5hdurl + vars.channelurl;
                                window.location.href = sucurl;
                            } else {
                                displayLose(2000, data.errmsg);
                            }
                        } else {
                            displayLose(2000, '网络错误,请稍候再试');
                        }
                    }
                });
            };
            // vars.authenticated++++++++此处需要增加手机号判断 判断输入的手机号和已经登陆的手机号是否一致
            if (parseInt(vars.authenticated) === 1) {
                // 已经登录了,不用再验证验证码
                verifySuccess();
            } else {
                if (!patterncode.test(messagecodeManual.val())) {
                    displayLose(2000,'验证码错误');
                    return false;
                }
                verifycode.sendVerifyCodeAnswer($('#mobilecodeManual').val(),$('#messagecodeManual').val(),function (sfut) {
                    mysfut = sfut;
                    verifySuccess();
                },verifyError);
            }
        });
    };
});
