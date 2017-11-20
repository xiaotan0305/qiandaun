/**
 * Created by user on 2016/12/15.
 */
$(function() {
    //phoneRegEx 电话号码正则,allowGet 可以请求短信验证码标识,smsLogin 短信验证码 js 对象,smsTimer 请求 timer ,smsDelay 请求间隔,
    // smsPhone 电话号码输入框 jq 对象,smsBtn 发送验证码 jq 对象,smsPhoneValue 电话号码值,smsCode 验证码输入框 jq 对象,smsCodeValue 验证码值,loginBtn 登录按钮 jq 对象;
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
        loginBtn = $('.js_login'),
        loginBox = $('.loginBox');
    // swipe插件和Bmap插件
    var Swiper = window.Swiper,
        BMap = window.BMap;
        Iscroll = window.IScrollLite;
    // 隐藏域数据
    var $personalData = $('#data'),
        $LoadStatus = $('#status');
    // 城市页面数据，swiper-wrapper,城市名称，城市标语，城市切换浮层，分享浮层，音乐audio
    var swiperWrapper = $('.swiper-wrapper'),
        $citySlogan = $('.citySlogan'),
        $cityName = $('.cityName'),
        $cityChoice = $('.cityChoice'),
        $cityChoiceInput = $('.cityChoiceInput'),
        $cityContainer = $('.cityContainer'),
        $shareBox = $('.shareBox'),
        $musicAudio = $('#music_audio'),
        $close = $('.a-close');
    // 个人数据页1，个人数据页2，个人结果页1，个人结果页2
    var $personalData1 = $('#personalData1'),
        $personalData2 = $('#personalData2'),
        $personalResult1 = $('#personalResult1'),
        $personalResult2 = $('#personalResult2');
    // 音乐按钮，点评按钮，分享按钮,分享关闭
    var $musicBtn = $('.music-btn'),
        $commentBtn = $('.commentBtn'),
        //$shareMemoryBtn = $('.shareMemoryBtn'),
        $shareClose = $('.share-btn');
    // 静态城市数据，静态城市名称和静态城市简称,自动切换页面时间，静态城市标语
    var cityDataObj = {
        '包头': [11902,598,10,47810], '北海': [10395,522,16,34412], '北京': [118380,4851,173,326163], '常州': [29392,1360,6,90333],
        '成都': [220215,8738,135,296216], '大连': [15187,737,23,71136], '东莞': [110048,4528,68,115542], '佛山': [90580,3789,74,117532],
        '福州': [24576,153,45,74019], '广州': [173676,6947,105,261732], '贵阳': [22444,1058,34,58792], '哈尔滨': [38260,1739,23,62179],
        '海南': [18932,897,52,89432], '杭州': [59348,2580,116,148220], '合肥': [65412,2807,64,113868],'呼和浩特': [10885,546,5,47898],
        '惠州': [98140,4072,43,104224],'济南': [59868,2591,54,121176],'江门': [16784,806,19,47999],'昆明': [26356,1225,39,57436],
        '兰州': [14389,732,37,41111],'廊坊': [87848,3691,50,72991],'南昌': [56456,2465,62,107113],'南京': [40756,1827,41,130456],
        '南宁': [55524,2435,55,105369],'南通': [42388,1883,15,60324],'宁波': [75696,3207,70,106893],'青岛': [44724,1978,90,113026],
        '三亚': [37940,1732,31,43701],'厦门': [35910,1647,14,60378],'汕头': [10935,549,28,34034],'上海': [186964,7448,177,325725],
        '深圳': [100584,4156,99,228352],'沈阳': [68076,2909,56,119560],'石家庄': [151780,6120,82,152832],'苏州': [153260,6155,92,265624],
        '太原': [62668,2701,54,80125],'唐山': [30196,1391,15,55027],'天津': [142632,5774,116,251204],'潍坊': [16992,813,25,61555],
        '无锡': [75232,3201,39,122278],'武汉': [288614,11407,157,307977],'西安': [132280,5377,84,157652], '徐州': [18348,873,16,64527],
        '烟台': [16413,792,35,52747],'扬州': [38304,1733,21,60638],'长春': [45780,2016,31,93126],'长沙': [94084,3920,77,157120],
        '郑州': [118852,4851,124,163380],'中山': [39780,1791,36,65847],'重庆': [78968,3331,97,197148],'珠海': [24832,1160,42,67845]
    };
    var associateCityArr = ['上海','武汉','苏州','深圳','成都','北京','天津','重庆','广州','宁波','郑州','昆明','常州','沈阳',
        '海南','无锡','长沙','佛山','南昌','南宁','青岛','西安','济南','长春','合肥','石家庄','杭州',
        '东莞','南京','三亚','大连','扬州','厦门','包头','江门','廊坊','潍坊','贵阳','昆山','珠海','兰州',
        '惠州','中山','哈尔滨','南通','太原','烟台','福州','唐山','呼和浩特','徐州','北海','汕头'];
    var associateShortCallArr = ['sh','wh','suzhou','sz','cd','bj','tj','cq','gz','nb','zz','km','cz','sy',
        'hn','wuxi','cs','fs','nc','nn','qd','xian','jn','changchun','hf','sjz','hz',
        'dg','nanjing','sanya','dl','yz','xm','bt','jm','lf','wf','gy','ks','zh','lz',
        'huizhou','zs','hrb','nt','taiyuan','yt','fz','ts','nm','xz','bh','st'];
    var timeDelay = [5000,11000,10000,0,10000,9000,9000];
    var slogan = ['新房飘零，何处寻觅归处','千挑万选终不悔，为房消得人憔悴'
        ,'众里寻他千百套，<br>终有一套是我家','新房万万间，何处是我家'];
    // 定位或者切换的城市名称，城市简称，城市数据数组,定位还是切换的flag标记, self5个数据
    var cityDataName = '',
        cityShortCall = '',
        cityDataArr = [],
        locationFlag = false,
        personalDataArr = [],
        timeOutObj = {};
    // 页面滑动切换方法
    var toggleTouchmove = (function() {
        function preventDefault(e) {
            e.preventDefault();
        }
        return function (unable) {
            document[unable ? 'addEventListener' : 'removeEventListener']('touchmove', preventDefault);
        };
    })();
    pageInit();
    //页面初始化函数
    function pageInit() {
        if(Swiper) {
            mySwiper = new Swiper('.swiper-container', {
                direction: 'vertical',
                observer:true,
                observeParents:true,
                onInit: function () {
                    timeOutObj.timeOut0 = setTimeout(function () {
                        mySwiper.slideNext();
                    },5000);
                },
                onSlideChangeEnd: function (swiper) {
                    var activeIndex = swiper.activeIndex;
                    var prevIndex = swiper.previousIndex;
                    $('.page' + activeIndex).show();
                    $('.page' + prevIndex).hide();
                    // 判断当前页面是上滑还是下滑,获取下滑
                    if(activeIndex === 3) {
                        mySwiper.lockSwipeToNext();
                    } else {
                        mySwiper.unlockSwipeToNext();
                        timeOutObj['timeOut' + prevIndex] && clearTimeout(timeOutObj['timeOut' + prevIndex]);
                        timeOutObj['timeOut' + activeIndex] = setTimeout(function () {
                            mySwiper.slideNext();
                        },timeDelay[activeIndex]);
                    }
                }
            });
        }
        // 定位城市,并更改城市数据
        var myCity = new BMap.LocalCity();
        myCity.get(MyCityFn);
        // 登录状态下，获取个人数据
        if($LoadStatus.val() === 'on') {
            getPersonalData($personalData.val().split(','));
            updatePage();
        }
        // 城市滚动

        // 页面绑定事件
        eventInit();
    }

    /**
     * 页面绑定事件初始化
     */
    function eventInit() {
        // 城市选择联想词
        $cityChoiceInput.on('input',function () {
            var $ele = $(this);
            var value = $ele.val().trim();
            assciateCityFn(value.length ? value : false);
        });
        // 点击联想词进行跳转页面
        $cityContainer.on('click',function () {
            var $ele = $(event.target);
            if(!$ele.hasClass('noclick')) {
                locationFlag = true;
                var value = $ele.text();
                new MyCityFn({name:value},true);
                //$cityContainer.html('');
                //$cityChoiceInput.val('');
                $cityChoice.hide();
            }


        });
        // 采用委托方式绑定slide的事件，打开个人独家记忆，打开其他城市独家记忆，分享独家记忆2
        swiperWrapper.on('click',function (event) {
            var $ele = $(event.target);
            // 打开个人独家记忆1，
            if($ele.hasClass('selfMemoryBtn')) {
                if($LoadStatus.val() === 'on') {
                    mySwiper.unlockSwipeToNext();
                    mySwiper.slideNext();
                    $('.page' + mySwiper.activeIndex).show();
                    $('.page' + mySwiper.previousIndex).hide();
                } else {
                    loginBox.show();
                    toggleTouchmove(true);
                }
            // 打开其他城市独家记忆2
            } else if($ele.hasClass('cityMemoryBtn')) {
                toggleTouchmove(true);
                $cityChoiceInput.val('');
                assciateCityFn(false);
            // 分享独家记忆2
            } else if($ele.hasClass('shareMemoryBtn')) {
                $shareBox.show();
                toggleTouchmove(true);
            }
        });
        // 切换城市浮层
        //$cityChoice.on('touchmove',function (event) {
        //    var $ele = $(event.target);
        //    console.log(event.target);
        //    alert(event.target);
        //    if(!$ele.hasClass('.ctiy') && !$ele.parents('.city').length) {
        //        event.preventDefault();
        //    }
        //    event.stopPropagation();
        //});
        // 关闭浮层
        $close.on('click',function () {
            $(this).parents('.float').hide();
        });
        // 兼容音乐不播放
        $(document.body).on('touchstart',function () {
           if ($musicAudio[0].paused) {
               $musicAudio[0].play();
               if ($musicAudio.hasClass('cur')) {
                   $musicAudio.removeClass('cur');
               }
           }
           $(this).off('touchstart');
        });
        // 音乐按钮
        $musicBtn.on('click',function () {
            var $ele = $(this);
            $musicBtn.toggleClass('cur');
            if($ele.hasClass('cur')) {
                $musicAudio[0].pause();
            } else {
                $musicAudio[0].play();
            }
        });
        // 关闭独家记忆分享浮层
        $shareClose.on('click',function () {
            $shareBox.hide();
            toggleTouchmove(false);
        });
        // 点击请求验证码按钮，根据状态给予相应提示
        // 最后发送验证码，成功，防止恶意请求，延迟一分钟倒计时。失败，提示。
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

        // 点击请求验证码按钮，根据状态给予相应提示
        // 最后发送验证码，成功，防止恶意请求，延迟一分钟倒计时。失败，提示。
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
            // 登录成功以后请求数据
            smsLogin.check(smsPhoneValue, smsCodeValue, function () {
				alert('登录成功');
                $LoadStatus.val('on');
				loginBox.hide();
                ajaxFn();
            }, function (err) {
                alert(err);
            });
            return false;
        });
    }

    /**
     * 根据定位城市获取静态数据
     * @param result 定位城市对象
     * @constructor
     */
    function MyCityFn(result) {
        var cName = result.name;
        var findFlag = false;
        for(var pro in cityDataObj) {
            var property = pro + '';
            if(cName.indexOf(property) > -1) {
                findFlag = true;
                cityDataArr = cityDataObj[property];
                cityDataName = property;
            }
        }
        if(!findFlag) {
            cityDataArr = cityDataObj['北京'];
            cityDataName = '北京';
        }
        associateCityArr.forEach(function (value,index) {
            if(value === cityDataName) {
                cityShortCall = associateShortCallArr[index];
            }
        });
        initCityData();
    }

    /**
     *初始化页面城市数据
     */
    function initCityData() {
        // 初始化列表数据
        cityDataArr.forEach(function(value,index) {
            var $ele = $('.listArr' + index);
            $ele.text(value);
            // 初始化城市结果页标语
            if(index === 2) {
                if(value < 5) {
                    $citySlogan.text(slogan[0]);
                } else if(value < 11) {
                    $citySlogan.text(slogan[1]);
                } else if(value < 30) {
                    $citySlogan.html(slogan[2]);
                } else {
                    $citySlogan.text(slogan[3]);
                }
            }
        });
        // 初始化城市名称
        var cityNameLength = cityDataName.length;
        cityNameLength === 2 && $cityName.removeClass('span2').addClass('span1').text(cityDataName);
        cityNameLength === 3 && $cityName.removeClass('span1 span2').text(cityDataName);
        cityNameLength === 4 && $cityName.removeClass('span1').addClass('span2').text(cityDataName);

        locationFlag && setTimeout(function () {
            mySwiper.slideTo(1);
        },1000);

    }

    /**
     * 城市联想
     * @param cityname input框输入的文字
     */
    function assciateCityFn (cityname) {
        'use strict';
        var arr = [];
        var pattern = new  RegExp('\\w*(' + cityname +')\\w*');
        var blank = '<li><a class="noclick" href="#">没有该城市数据</a></li>';
        var html = '';
        if(cityname) {
            associateCityArr.forEach(function (value) {
                if(pattern.test(value)) {
                    arr.push(value);
                    html += '<li><a href="#">' + value +'</a></li>';
                }
            });
            !arr.length && (html = blank);
        } else {
            associateCityArr.forEach(function (value) {
                html += '<li><a href="#">' + value +'</a></li>';
            });
        }
        $cityContainer.html(html);
        $cityChoice.show();
        Iscroll && new Iscroll('#wrapper',{

        });
    }

    /**
     * 对个人数据的数组进行处理
     * @param arr 个人数据的数组形式
     */
    function getPersonalData (arr) {
        var sum = 0,
            page2count = 0;
        for(var i = 0,il = arr.length;i < il;i++) {
            personalDataArr[i] = +arr[i];
            sum += +arr[i];
            if(i ===2 || i === 4) {
                page2count += +arr[i];
            }

        }
        sum ? personalDataArr.existAll = true : personalDataArr.existAll = false;
        page2count ? personalDataArr.existSingle = true : personalDataArr.existSingle = false;
    }

    /**
     * 更新当前页面数据和对应个人数据页，个人结果页面
     */
    function updatePage (flag) {
        // 2级判断，判断5个数据是否存在
        // 不存在或者存在情况下，判断点评数是否大于零
        var title = '';
        if(personalDataArr.existAll) {
            // 将数据写入页面
            personalDataArr.forEach(function(value,index) {
                var $ele = $('.personalArr' + index);
                $ele.text(value).parent()[value ? 'show' : 'hide']();
                if(index === 2) {
                    $ele.parent().prev()[value ? 'show' : 'hide']();
                    $ele.parent().next()[value ? 'show' : 'hide']();
                }
            });
            // 将称号写入页面
            if(personalDataArr[0] < 3) {
                title = '新晋言值代表';
            } else if(personalDataArr[0] < 6) {
                title = '话题达人';
            } else if(personalDataArr[0] < 11) {
                title = '鉴盘侠';
            } else {
                title = '口碑专家';
            }
            // 判断是否存在数据页2,
            if(personalDataArr.existSingle) {
                if(personalDataArr[0]) {
                    $('.personalTitle').text('“' + title + '”');
                    mySwiper.appendSlide([$personalData1.html(),$personalData2.html(),$personalResult1.html()]);
                } else {
                    // 开启我的点评
                    $commentBtn[0].href = location.protocol + '//m.fang.com/xf.d?m=cityComment&city=' + cityShortCall;
                    $personalResult2.find('section').attr('class','').addClass('page6');
                    mySwiper.appendSlide([$personalData1.html(),$personalData2.html(),$personalResult2.html()]);
                }
            } else {
                if(personalDataArr[0]) {
                    $('.personalTitle').text('“' + title + '”');
                    $personalResult1.find('section').attr('class','').addClass('page5');
                    mySwiper.appendSlide([$personalData1.html(),$personalResult1.html()]);
                } else {
                    // 开启我的点评
                    $commentBtn[0].href = location.protocol + '//m.fang.com/xf.d?m=cityComment&city=' + cityShortCall;
                    $personalResult2.find('section').attr('class','').addClass('page5');
                    mySwiper.appendSlide([$personalData1.html(),$personalResult2.html()]);
                }
            }
        // 不存在数据的情况下，只显示结果页2
        } else {
            // 开启我的点评
            $commentBtn[0].href = location.protocol + '//m.fang.com/xf.d?m=cityComment&city=' + cityShortCall;
            $personalResult2.find('section').attr('class','').addClass('page4');
			mySwiper.appendSlide($personalResult2.html());
        }
		if(flag) {
			mySwiper.unlockSwipeToNext();
            setTimeout(function () {
                mySwiper.slideNext();
                $('.page' + mySwiper.activeIndex).show();
                $('.page' + mySwiper.previousIndex).hide();
            },0);
		}
		
    }

    /**
     * 请求个人数据，并更新页面
     */
    function ajaxFn() {
        var url = location.protocol  + '//m.test.fang.com/huodongAC.d?m=getUserData&class=ExclusiveMemoryHc';
        $.get(url, function (data) {
            var arr = [];
            var dataRoot = JSON.parse(data).root;
            arr[0] = dataRoot.dianpingnum;
            arr[1] = dataRoot.agreenum;
            arr[2] = dataRoot.jiajingnum;
            arr[3] = dataRoot.newcodenum;
            arr[4] = dataRoot.replynum;
            getPersonalData(arr);
            updatePage(true);
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
        smsBtn.val(getDelayText(smsDelay));
        clearInterval(smsTimer);
        smsTimer = setInterval(function () {
            smsDelay--;
            smsBtn.val(getDelayText(smsDelay));
            if (smsDelay < 0) {
                clearInterval(smsTimer);
                smsBtn.val('发送验证码');
                smsDelay = 60;
                allowGet = true;
            }
        }, 1000);

        function getDelayText(second) {
            return '重新发送(' + (100 + second + '').substr(1) + ')';
        }
    }
});