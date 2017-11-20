/**
 * Created by user on 2016/12/13.
 */
$(function() {
    /**
     *  发送验证码部分
     phoneRegEx 电话号码正则,
     allowGet 可以请求短信验证码标识,
     smsLogin 短信验证码 js 对象,
     smsTimer 请求 timer ,
     smsDelay 请求间隔,
     smsPhone 电话号码输入框 jq 对象,
     smsBtn 发送验证码 jq 对象,
     smsPhoneValue 电话号码值,
     smsCode 验证码输入框 jq 对象,
     smsCodeValue 验证码值,
     loginBtn 登录按钮 jq 对象;
     */
    var phoneRegEx = /^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$/i,
        allowGet = true,
        smsLogin = window.smsLogin,
        smsTimer = null,
        smsDelay = 60,
        smsPhone = $('.js_sms_phone'),
        smsBtn = $('.js_sms_btn'),
        smsPhoneValue = '',
        smsCode = $('.js_sms_code'),
        smsCodeValue = '',
        loginBtn = $('.js_login');
    // 左侧装饰品
    var $decoration = $('.decoration');
    var $infor = $('.infor');
    // 右侧点击区域
    var $box = $('.box');
    var $fly = $('.fly');
    // 进度条
    var $progBarLi = $('.progBar').find('li');
    var $musicAudio = $('#music_audio');
    //
    var hiddenInput = $('.hiddenInput');
    var btnSuccess = $('.btnSuccess');
    // 隐藏值
    var inputObject = {};
    var typeArr = ['star','ball','shan','gun','bell'];
    var toastArr = ['装扮成功!获得5积分，明天积分翻倍哦', '装扮成功!10积分归你了，大礼在后面'
                    ,'装扮成功!又赚了20积分，听说明天有惊喜','装扮成功!1200元礼包已领，终极大奖就在前方'
                    ,'装扮成功!你的圣诞树太漂亮了，奖励100积分'];
    var classArr = ['btnZ','btnC','btnH','btnQ','btnHua'];
    var linkArr = ['//m.store.fang.com/','//m.store.fang.com/','//m.store.fang.com/','//coupon.fang.com/m/MyCoupon.html','//m.store.fang.com/'];
    var myparabola,activeType,clickFlag = true;
    var  $moreBtn = $('.moreBtn');
    var toggleTouchmove = (function() {
        function preventDefault(e) {
            e.preventDefault();
        }
        return function (unable) {
            document[unable ? 'addEventListener' : 'removeEventListener']('touchmove', preventDefault);
        };
    })();
    init();
    function init() {
        // 隐藏值赋值给inputObject
        hiddenInput.each(function (index,ele) {
            var value = $(ele).val();
            if(ele.id === 'hasPFlag') {
                inputObject[ele.id] = value ? value.split(',') : [];
            } else {
                inputObject[ele.id] = value;
            }
        });
        // 当前活动是否进行中
        if(inputObject.ongoing === 'no') {
            toast('.tips');
            return;
        }
        // 隐藏对应的右侧点击图标,显示圣诞树的装饰物
        inputObject.hasPFlag.forEach(function(value,index) {
            var rubberBandName = '.rubberBand' + value;
            var decorationName = '.decoration' + value;
            $(rubberBandName).hide();
            $(decorationName).show();
        });
        // 提示装饰面板
        if(inputObject.num === '5') {
            $infor.hide();
        } else {
            setTimeout(function () {
                $infor.addClass('into');
            },5000);
        }
        //显示当前进度条的进度
        $progBarLi.each(function(index,ele) {
           if(index < inputObject.num - 1) {
               $(ele).addClass('light');
           }
           if(index === inputObject.num - 1) {
               $(ele).addClass('light cur');
           }
        });
        // 初始化飞行轨迹
        myparabola = funParabola($fly[0],$decoration[0],{
            speed:50,
            curvature:0.002,
            complete:function () {
                $fly.hide();
            }
        });
        $moreBtn.css('href',location.protocol + '//mstore.fang.com/index.html');
        eventFn();
    }

    /**
     * 绑定事件 先判断登录，在判断是否可点
     */
    function eventFn() {
		// 兼容音频播放
        $(document.body).one('touchstart',function () {
            // alert($musicAudio[0].paused);
            $musicAudio[0].play();
            if ($musicAudio[0].paused) {
                $musicAudio[0].play();
                if (!$musicAudio.hasClass('circle')) {
                    $musicAudio.addClass('circle');
                }
            }  
        });
		
        // 点击右侧图标
        $box.on('click',function(event) {
            var $ele = $(event.target).parents('.decorate');
            var index = $ele.index();
            if(inputObject.status === 'on' && !$(event.target).hasClass('infor')) {
                // 每次点击定位fly元素
                if(inputObject.timestatus === 'now' && clickFlag) {
                    clickFlag = false;
                    activeType = typeArr[index - 1];
                    // 更新fly元素的位置
                    var position = $ele.position();
                    var imageUrl = 'url(' + inputObject.path + 'images/day_' + index + '.png)';
                    $fly.css({
                        'background': imageUrl + ' no-repeat center',
                        'left': position.left,
                        'top': position.top,
                        'background-size': '100%',
                        'opacity': 1
                    }).show();
                    myparabola.position();
                    // $ele.hide();
                    myparabola.move();
                    getNumPrize($ele);
                } else if(inputObject.timestatus === 'old'){
                    toast('.tips');
                }
            } else if(inputObject.status === 'off' && !$(event.target).hasClass('infor')){
                $('.login').show();
                toggleTouchmove(true);
            }
        });
        // 关闭按钮
        $('.closeBox').find('a').on('click',function () {
            $(this).parents('.float').hide();
            toggleTouchmove(false);
        });
        // 活动规则
        $('.rule').on('click',function () {
            $('.actRule').show();
            toggleTouchmove(true);
        });
        /**
         * 点击请求验证码按钮，根据状态给予相应提示
         * 最后发送验证码，成功，防止恶意请求，延迟一分钟倒计时。失败，提示。
         */
        smsBtn.on('click', function () {
            if (!allowGet) {
                alert('请一分钟以后再试');
                return false;
            }
            smsPhoneValue = smsPhone.val().trim();

            if (!smsPhoneValue) {
                alert('手机号不能为空');
                return false;
            }

            if (!phoneRegEx.test(smsPhoneValue)) {
                alert('手机号格式不正确');
                return false;
            }

            smsLogin.send(smsPhoneValue, function () {
                alert('验证码已发送,请注意查收');
                updateSmsDelay();
            }, function (err) {
                alert(err);
            });
            return false;
        });

        /**
         * 点击登录按钮，根据状态给予提示
         * 最后检查验证码，登录成功，跳转，或提示错误信息。
         */
        loginBtn.on('click', function () {
            smsPhoneValue = smsPhone.val().trim();
            if (!smsPhoneValue || !phoneRegEx.test(smsPhoneValue)) {
                alert('手机号为空或格式不正确');
                return false;
            }
            smsCodeValue = smsCode.val().trim();
            if (!smsCodeValue || smsCodeValue.length < 4) {
                alert('验证码为空或格式不正确');
                return false;
            }
            smsLogin.check(smsPhoneValue, smsCodeValue, function () {
                alert('登录成功');
                setTimeout(function () {
                    window.location.href = location.href + '&ert=' + parseInt(Math.random());
                },1000);
            }, function (err) {
                alert(err);
            });
            return false;
        });
        $('.btnKnow').on('click',function () {
            $('.actRule').hide();
            toggleTouchmove(false);
        });
        $('.btnJf').on('click',function () {
            $('.tips').hide();
            toggleTouchmove(false);
        });
        $('.btnSuccess').on('click',function () {
            toggleTouchmove(false);
        });
        $('.music').on('click',function () {
            $(this).toggleClass('circle');
            if($(this).hasClass('circle')) {
                $musicAudio[0].play();
            } else {
                $musicAudio[0].pause();
            }

        });


    }

    /**
     * 后台数据和隐藏域数据更改
     */
    function stateUpdate() {
        inputObject.timestatus = 'old';
        inputObject.num++;
        inputObject.hasPFlag.push(activeType);
        hiddenInput.each(function (index,ele) {
            var id = ele.id;
            if(ele.id === 'hasPFlag') {
                $(ele).val(inputObject[id].join(','));
            } else {
                $(ele).val(inputObject[id]);
            }
        });
    }

    /**
     * 图标和圣诞树样式更改
     */
    function styleUpdate() {
        var number = inputObject.num -1;
        activeType && $('.decoration' + activeType).show();
        if(activeType) {
            $progBarLi.removeClass('cur');
            $progBarLi.eq(number).addClass('light cur');
        }
    }

    /**
     * 信息提示方法
     * @param ele 提示浮层dom
     */
    function toast(ele) {
        var $ele = $(ele);
        var number = inputObject.num -1;
        if(ele === '.tips') {
            inputObject.ongoing === 'no' && $('.actEnd').show().siblings.hide();
        } else if(ele === '.decSuc') {
            btnSuccess.attr({
                class: '',
                href: linkArr[number]
            }).addClass('btnSuccess ' + classArr[number]);
            btnSuccess.parent().prev().html(toastArr[number]);
        }
        $ele.show();
        toggleTouchmove(true);
    }

    /**
     * 请求后台数据
     */
    function getNumPrize($ele) {
        var nextDay = (+inputObject.num) + 1;
        var url = location.protocol+'//' + window.location.hostname + '/huodongAC.d?m=dresTreeGetPrize&class=ChristmasRreeHc&num=' + nextDay + '&prize=' + activeType;
        $.get(url, function (data) {
        	clickFlag = true;
            var dataRoot = JSON.parse(data).root;
            if (dataRoot.code === '0') {
                $ele.hide();
                stateUpdate();
                styleUpdate();
                setTimeout(function () {
                    toast('.decSuc');
                },1000);
            } else {
                alert(dataRoot.msg);
            }
        });

    }
    

    /**
     * 更新验证码倒计时时间
     * 1、更改是否可以请求验证码标识
     * 2、更改倒计时时间
     * 3、重置时间、状态等
     */
    function updateSmsDelay() {
        allowGet = false;
        smsBtn.html(getDelayText(smsDelay));
        clearInterval(smsTimer);
        smsTimer = setInterval(function () {
            smsDelay--;
            smsBtn.html(getDelayText(smsDelay));
            if (smsDelay < 0) {
                clearInterval(smsTimer);
                smsBtn.html('获取验证码');
                smsDelay = 60;
                allowGet = true;
            }
        }, 1000);

        function getDelayText(second) {
            return (100 + second + '').substr(1) + 's';
        }
    }


});