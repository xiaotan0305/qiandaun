/**
 * @Author: 孙文秀
 * @Date: 2016/06/02 14:00
 * @description: 买房先找茬活动
 */
$(function () {
    'use strict';
    /**
     * loading页面
     */
    // 预加载资源数组
    var imageUrl = [
        'images/loading.gif',
        'images/loading_text.jpg',
        'images/music_close.png',
        'images/music_open.png',
        'images/begin.png',
        'images/stop.png',
        'images/begin_bg.jpg',
        'images/level_bg1.png',
        'images/level_bg2.png',
        'images/level_house.png',
        'images/ruleTitle.png',
        'images/scroll_off.png',
        'images/scroll_on.png'
    ];
    // 获取资源文件的url地址
    var site = $('#imgSite').val();
    var baseUrl = '';
    if(site) {
        baseUrl = site + 'findDiffer/';
    }
    // 游戏的背景音乐
    var bgMusic = $('#musicfx').get(0);
    // 图片资源数组的索引
    var index = 0;
    var storage = window.localStorage || null;
    if (!storage) {
        alert('该模式下不能进行游戏。');
        return false;
    }
    // 开始页
    var startPage = $('#start');
    // 音乐播放控制图标
    var musicIcon = $('#music');
    /**
     *  预加载函数
     * @param imgarr 图片资源数组
     * @param index 下标
     * @param len  总数
     */
    function loadImg(imgarr, index, len) {
        if (index < len) {
            var oImg = new Image();
            oImg.src = baseUrl + imageUrl[index];
            oImg.onload = function () {
                index++;
                loadImg(imgarr, index, len);
            };
            oImg.onerror = function () {
                console.log('图片加载失败。');
                index++;
                loadImg(imgarr, index, len);
            };
        } else {
            // 进入开始页面兼容播放音乐
            $(document).one('touchstart',function () {
                bgMusic.play();
            });
            // 图片加载完成以后，显示开始页面，播放背景音乐
            $('#loading').hide();
            startPage.show();
            // 音乐图标显示
            musicIcon.show();
            // 开始页面自动播放音乐
            bgMusic.play();
            // 初始化得分，分数从0开始记录
            initScore();
        }
    }
    function initScore() {
        // 每次进入游戏分数从0开始记录
        storage['ScoreLevel1'] = 0;
        storage['ScoreLevel2'] = 0;
        storage['ScoreLevel3'] = 0;
        storage['ScoreLevel4'] = 0;
    }
    // 加载第一张图片
    loadImg(imageUrl, 0, imageUrl.length - 1);
    /**
     * 开始页面
     */
    // 切换关卡的控制条scroll
    var icos = $('#icoBox').find('img');
    var swiper = null;
    // 选择关卡页面
    var levelPage = $('#level');
    // 开始游戏点击监听
    $('#gameBegin').on('click', function() {
        startPage.hide();
        levelPage.show();
        // 初始化选关页面
        initLevel();
    });
    /**
     * 选关页面
     */
    // 控制手动滑动切换关卡实现
    swiper = new Swiper('.swiper-container', {
        onSlideChangeStart: function(swiper){
            var index = swiper.activeIndex;
            icos.eq(index).attr('src',baseUrl + 'images/scroll_on.png').siblings().attr('src',baseUrl + 'images/scroll_off.png');
        }
    });
    // 控制点击scroll实现切换关卡
    icos.on('click',function () {
        var me = $(this),
            index = me.index();
        swiper && swiper.slideTo(index);
        me.attr('src',baseUrl + 'images/scroll_on.png').siblings().attr('src',baseUrl + 'images/scroll_off.png');
    });
    // false 代表这一关没过，true代表这一关已经通过
    if (!storage.getItem("pass1")) storage.setItem('pass1', false);
    if (!storage.getItem("pass2")) storage.setItem('pass2', false);
    if (!storage.getItem("pass3")) storage.setItem('pass3', false);
    if (!storage.getItem("pass4")) storage.setItem('pass4', false);
    // 关卡切换图标盒子
    var controlBox = $('#control');
    /**
     * 初始化关卡页面
     */
    function initLevel() {
        // 当前所在关卡
        var levelNum = 0,
            n1 = storage['pass1'],
            n2 = storage['pass2'],
            n3 = storage['pass3'];
        if(n1 === 'false') {
            // 第一关未通过，所在关卡为1
            levelNum = 1;
        }
        if(n1 === 'true') {
            // 第一关通过，所在关卡为2
            levelNum = 2;
        }
        if(n2 === 'true') {
            // 第2关通过，所在关卡为3
            levelNum = 3;
        }
        if(n3 === 'true') {
            // 第3关通过，所在关卡为4
            levelNum = 4;
        }
        // 关卡控制图片
        var barimgs = controlBox.find('img');
        barimgs.each(function (index) {
            if (index) {
                var img = barimgs.eq(index);
                if(index >= levelNum) {
                    // 未通过的关卡设置锁定状态
                    img.parent('.img-box').eq(0).addClass('stop');
                    img.attr('src',baseUrl + 'images/stop.png');
                } else {
                    // 已通过的关卡取消锁定状态
                    img.parent('.img-box').eq(0).removeClass('stop');
                    img.attr('src',baseUrl + 'images/begin.png');
                }
            }
        });
        // 每次进入选关页面都是控制显示在第一关
        swiper.slideTo(0);
        $('#scrollBar').find('img').eq(0).attr('src',baseUrl + 'images/scroll_on.png').siblings().attr('src',baseUrl + 'images/scroll_off.png');
    }
    // 存储帮助次数
    if (!storage.getItem("helpCount")) storage.setItem('helpCount', 3);
    // 游戏页面页头的图标按钮
    var houseCommonIcon = $('#houseCommon');
    // 点击关卡控制键进行关卡跳转
    controlBox.on('click', 'div', function () {
        var selectedLevel = $(this);
        if (selectedLevel.hasClass('stop')) {
            // 选择的关卡不可玩，则不处理
            return;
        }
        levelPage.hide();
        houseCommonIcon.show();
        // 进入的关卡编号
        var level = selectedLevel.find('img').attr('name');
        // 显示对应游戏关卡
        $('#house' + level).show();
        // 初始化游戏页面
        initHouse(level);
        // 页面倒计时
        updateTime(level);
    });
    // 倒计时的计数初始值
    var count = 60;
    // 游戏页面星星
    var starBox = $('#starBox');
    // 游戏页面的分数显示容器
    var scoreBox = $('#score');
    // 游戏页面不同点区域容器
    var differContent = $('.differ');
    /**
     * 初始化游戏页面
     * @param level
     */
    function initHouse(level) {
        // 从0计分
        storage['ScoreLevel' + level] = 0;
        // 初始化倒计时时间
        count = 60;
        // 初始化帮助次数
        helpBox.find('img[aria-index = ' + storage.getItem('helpCount') +']').show();
        // 初始化星星
        starBox.find('div').removeClass('pass');
        // 初始化分数
        scoreBox.html('&nbsp');
        // 显示当前关卡
        $('#houseLevel').text(level + '/4');
        // 页面初始化隐藏圆圈
        differContent.find('img').hide();
        // 页面初始化将不同点区域标识为未找到，可以点击
        $('.differBox').attr('aria-finded','not');
    }
    // 标识北京音乐播放，为true播放
    var musicPlay = true;
    // 10s倒计时背景音乐
    var music10s = $('#music10s').get(0);
     // 关闭背景音乐控制
    $('.musicBox .musicOpen').on('click', function () {
        musicPlay = false;
        bgMusic.pause();
        if(music10) {
            music10s.pause();
        }
        $(this).hide();
        $('.musicBox .musicClose').show();
    });
     // 打开背景音乐控制
    $('.musicBox .musicClose').on('click', function () {
        musicPlay = true;
        if(music10) {
            // 倒计时10秒音乐打开的话，打开该音乐
            music10s.play();
        } else {
            bgMusic.play();
        }
        $(this).hide();
        $('.musicBox .musicOpen').show();
    });
    /**
     * 游戏闯关页面
     */
     // 关卡返回点击事件
    $('#returnBox').on('click', 'img', function () {
        levelPage.show();
        // 隐藏游戏页面
        houseCommonIcon.hide();
        $('.content:visible').hide();
        // 清空时间倒计时
        clearTimeout(countTime);
        // 消除因为swiper追加的样式导致的位置错乱
        controlBox.find('.img-box').removeAttr('style');
        initLevel();
    });
    // 点击错误区域时，时间减5秒
    $('.content').not($(".differ .circle")).click(function(){
        if(musicPlay) {
            // 播放找错的音效
            $('#musicError').get(0).play();
            bgMusic.play();
        }
        if (count <= 0) {
            return;
        }else if (count > 5) {
            $('#score5').show(200).delay(200).hide(100);
            // 时间剩余大于5秒，减去5秒
            count -= 5;
        }else {
            // 时间剩余小于等于5秒，直接将时间置为0
            count = 0;
        }
        // 显示时间轴时间
        setTimeBar(count);
    });
    // 找到的音效
    var musicRight = $('#musicRight').get(0);
    // 点中不同点显示处理事件
    differContent.on('click', '.circle', function (event) {
        // 防止事件冒泡
        event.stopPropagation();
        // 点中的不同点区域
        var differ = $(this);
        var differBox = differ.parent('.differBox');
        if (differBox.attr('aria-finded') === 'yes') {
             // 如果该区域已经找到过，则不再处理
            return;
        }
        // 当前关卡编号
        var level = differBox.parent('.differ').attr('aria-level');
        // 不同点对应的比编号
        var differId = differBox.attr('id');
        // 计算所得的分数
        countScore(level, differId);
        // 显示圆圈图片
        showCircle(differ);
        if(musicPlay) {
            // 播放找到的音效
            musicRight.play();
            bgMusic.play();
        }
        // 显示实心星星
        showStar(level);
    });
    /**
     * 显示小圆圈
     * @param differ 点中的不同点区域
     */
    function showCircle(differ) {
        // 不同点对应的小圆圈图片
        var img = differ.siblings('img');
        // 小圆圈显示
        img.fadeIn();
        // 将找出的不同点标识为：aria-finded：yes
        differ.parent('.differBox').attr('aria-finded', 'yes');
    }
    // 弹出层
    var floatBox = $('#floatBox');
    /**
     *倒计时更新时间操作
     */
    var countTime = null;
    function updateTime(level) {
        clearTimeout(countTime);
        countTime = setTimeout(function () {
            updateTime(level);
        }, 1000);
        if (count < 1) {
            floatBox.show();
            $("#result2").show();
            setTimeBar(0);
            count = 60;
            return;
        }
        count--;
        // 控制时间轴的显示时间
        setTimeBar(count);
    }
    // 点击重新玩此关
    $('.retryBtn').on('click', function (){
        // 当前关卡
        var level = $('.content:visible').find('.differ').attr('aria-level');
        // 隐藏结果按钮
        floatBox.hide();
        floatBox.find('.btnBox').hide();
        // 重新初始化页面
        initHouse(level);
        updateTime(level);
    });
    // 标识是否打开倒计时10秒音乐，false是未打开
    var music10 = false;
    //时间显示条
    var timeBar = $('#timeBar');
    // 游戏时间
    var gameTime = $('#time');
    /**
     * 时间轴显示剩余时间
     * @param second  当前秒数
     */
    function setTimeBar(second) {
        if (second > 0) {
            /**
             * 每秒所占的长度
             * @type {number} 1.67:100%(宽度) / 60(秒)
             */
            var timeLength = (1.67) *  second;
            timeBar.css('width', timeLength + '%');
            gameTime.text((second) + '秒');
        } else {
            // 时间小于0直接显示0秒，0%
            timeBar.css('width', '0%');
            gameTime.text('0秒');
            // 结束倒计时音乐
            music10s.pause();
            music10 = false;
            if(musicPlay) {
                // 打开大的背景音乐
                bgMusic.play();
            }
        }
        if (second <= 10 && second > 0) {
            // 关闭大的背景音乐
            bgMusic.pause();
            if(musicPlay) {
                // 当倒计时10s时，开始播放倒计时音乐
                music10s.play();
                music10 = true;
            }
        }
    }
    // 存储各个关卡星星数量
    if (!storage.getItem("starCount1")) storage.setItem('starCount1', 0);
    if (!storage.getItem("starCount2")) storage.setItem('starCount2', 0);
    if (!storage.getItem("starCount3")) storage.setItem('starCount3', 0);
    if (!storage.getItem("starCount4")) storage.setItem('starCount4', 0);
    /**
     * 显示实心星星
     * 这里可以写的更简单一下 通过知道找到几个不同点直接显示星星个数
     */
    function showStar(level) {
        if (!starBox.find('.star').hasClass('pass')) {
            // 没有实心星星显示时直接显示第一个实心星星
            $('#star1').addClass('pass');
            storage['starCount' + level] = 1;
        }else{
            // 有实心星星显示时显示当前星星+1
            // 已经显示的星星数组
            var passArray = [];
            $.each($('.star.pass'), function() {
                passArray.push($(this).attr('aria-index'));
            });
            // 找出要显示的星星索引
            var starCount = Math.max.apply(null, passArray) + 1;
            if (starCount > 3) {
                starCount = 3;
            }
            // 显示星星
            $('.star[aria-index = '+ starCount +']').addClass('pass');
            // 存储当前关卡的星星数量
            storage['starCount' + level] = starCount;
            if (starCount === 3 && count <= 60 && count >= 0) {
                // 规定时间内找出三个不同点，则对应的关卡过关
                storage['pass' + level] = true;
                clearTimeout(countTime);
                if(musicPlay && music10) {
                    // 当倒计时10s时，开开始播放倒计时音乐
                    music10s.pause();
                    // 打开大的背景音乐
                    bgMusic.play();
                }
                // 显示结果按钮
                setTimeout(function () {
                    floatBox.show();
                }, 400);
                if(level === '4'){
                    setTimeout(function () {
                        $('#result3').show();
                    }, 400);
                }else{
                    setTimeout(function () {
                        $('#result1').show();
                    }, 400);
                }
            }
        }
    }
    // 返回选关页面
    $('.listBtn').on('click', function () {
        levelPage.show();
        // 隐藏按钮
        floatBox.hide();
        floatBox.find('.btnBox').hide();
        // 隐藏游戏页面
        $('.content:visible').hide();
        houseCommonIcon.hide();
        initLevel();
    });
    // 下一关
    $('.nextBtn').on('click', function () {
        // 隐藏按钮
        floatBox.hide();
        floatBox.find('.btnBox').hide();
        var currentHouse = $('.content:visible');
        var level = currentHouse.find('.differ').attr('aria-level');
        currentHouse.hide();
        var nextLevel = (+level) + 1;
        // 显示下一关
        $('#house' + nextLevel).show();
        initHouse(nextLevel);
        updateTime(level);
    });
    // 结果页面
    var resultPage = $('#result');
    // 显示结果页面操作
    $('.circleBtn,.rectBtn').on('click', function () {
        // 隐藏按钮
        floatBox.hide();
        floatBox.find('.btnBox').hide();
        // 隐藏游戏页面
        $('.content:visible').hide();
        houseCommonIcon.hide();
        // 显示结果页
        resultPage.show();
        // 初始化结果页
        initResult();
    });
    /**
     * 初始化结果页面的分数
     */
    function initResult() {
        var finalScore = (+storage['ScoreLevel1']) + (+storage['ScoreLevel2']) + (+storage['ScoreLevel3']) + (+storage['ScoreLevel4']);
        $('#Finalscore').text(finalScore+'分');
        // 显示结果页的文案
        showFinalText(finalScore);
    }

    /**
     * 根据所得分数显示结果页面的文案
     * @param score 所得分数
     */
    function showFinalText(score) {
        var text1 = [
            '可长点心吧！这都不及格，要是这么不细心的去买房子，还不被开发商欺负的血本无归。买房需谨慎，还是练一练再来吧。',
            '你对户型鉴别简直就是个白痴，买房肯定是被坑到掉裤子的类型。建议你赶紧找个土豪，就不用买房了。',
            '这这这……，让我说你什么好呢？我能肯定你你真的不是别人家的孩子。',
            '他人的“大家来找茬”在你眼里妥妥的雾里看花，要不你买个房车吧，想去哪去哪，想咋拆咋拆。'
        ];
        var text2 = [
            '勉强过的去哎。你已经初步具备一个购房者的应该有的基本素质了。但是可别小瞧户型图啊！还有许多值得你注意的细节被你忽略了。继续加油哦！',
            '60分万岁，多一分浪费。作为买房学渣，你一直真实地做自己，不管大户型小户型，能买得起的才是好户型啊！',
            '你是想听真话呢还是真话呢？假话就是：你的进步空间还很大，再接再厉哟！',
            '你喜欢什么样的房子啊？厨房厕所头对头？不是的话赶紧吃点核桃吧。'
        ];
        var text3 = [
            '哎呦不错哦，没想到阁下的眼神如此不错，看来你离买房就差个钱的事儿了~',
            '你离买到好房，仅一步之遥。不要谢我，我不是雷锋，我是房天下。',
            '99%的小伙伴都和你一样，认真买房，认真生娃，认真给娃买房……会不会太平凡了呢？要不卖了房子来场说走就走的旅行？',
            '厉害啊！开发商想跟你玩花招估计是不可能了。户型图对你来说肯定很熟悉了吧！少年，晋级成为一个买房达人指日可待！'
        ];
        var text4 = [
            '给跪了！大侠！英雄！想必阁下一定是阅图万张的户型达人吧！开发商在你面前简直太嫩了！赶快把你的经验分享给大家吧。',
            '不得不说，你的眼光有如老鹰般犀利。一进屋便可感知到房间的所有死角，但所谓没有遗憾就是最大的遗憾，是有道理的。',
            '你简直无敌、聪明上天啊！我相信你你真的是存心来找茬的！',
            '你是小白眼中的膜拜神，开发商口中的找茬鬼。会当凌绝顶的傲气伴着寒风，大神请收下宝宝大写的“服”！'
        ];
        var finalText = '';
        if (score >= 0 && score <= 59) {
            finalText = text1[Math.floor(Math.random()*text1.length)];
        } else if (score >= 60 && score <= 79) {
            finalText = text2[Math.floor(Math.random()*text2.length)];
        } else if (score >= 80 && score <= 99) {
            finalText = text3[Math.floor(Math.random()*text3.length)];
        } else {
            finalText = text4[Math.floor(Math.random()*text4.length)];
        }
        $('#resultContent').text(finalText);
    }
    // 帮助盒子
    var helpBox = $('#helpBox');
    // 点击帮助进行事件处理
    helpBox.on('click', '.help', function () {
        // 当前的帮助图标
        var currentHelp = $(this);
        currentHelp.hide();
        // 获取当前帮助的次数
        var helpIndex = storage.getItem('helpCount');
        // 当前所在关卡
        var level = $('.content:visible').find('.differ').attr('aria-level');
        if (helpIndex === '0') {
            // 当前帮助次数为0，直接显示当前帮助此处，不再处理
            helpBox.find('[aria-index = 0]').show();
            return;
        }
        // 显示帮助的圆圈
        showHelpCircle(level);
        if(musicPlay) {
            musicRight.play();
        }
        // 显示星星
        showStar(level);
        helpIndex -= 1;
        // 显示当前的帮助次数减1
        helpBox.find('[aria-index = ' + helpIndex +']').show();
        // 记录下当前的帮助次数
        storage['helpCount'] = helpIndex;
    });
    /**
     * 点击帮助时显示圆圈
     * @param level 对应的关卡
     */
    function showHelpCircle(level) {
        // 未找出的difference编号数组
        var helpArry = [];
        $.each($('#house' + level), function () {
            var differId = $(this).find('div[aria-finded=not]').attr('id');
            helpArry.push(differId);
        });
        // 要显示的圆圈编号
        var minIndex = Math.min.apply(null, helpArry);
        // 找出要显示的圆圈盒子
        var differDiv = $('#' + minIndex);
        // 标识该不同点已经找到
        differDiv.attr('aria-finded', 'yes');
        // 控制圆圈的显示
        differDiv.find('img[name = ' + minIndex + ']').fadeIn();
        // 计算得分
        countScore(level,minIndex);
    }
    // 各关卡得分初始化赋值
    if (!storage.getItem("ScoreLevel1")) storage.setItem('ScoreLevel1', 0);
    if (!storage.getItem("ScoreLevel2")) storage.setItem('ScoreLevel2', 0);
    if (!storage.getItem("ScoreLevel3")) storage.setItem('ScoreLevel3', 0);
    if (!storage.getItem("ScoreLevel4")) storage.setItem('ScoreLevel4', 0);

    // 初始化各关卡分数
    //var score = [0, 0, 0, 0];
    /**
     * 计算关卡所得分数
     * @param level 所在关卡
     * @param differId 不同点对应的编号
     */
    function countScore(level, differId) {
        switch (level) {
            case '1':
                storage['ScoreLevel1'] = (+storage['ScoreLevel1']) + 5;
                break;
            case '2':
                if (differId == 12) {
                    storage['ScoreLevel2'] = (+storage['ScoreLevel2']) + 5;
                }else {
                    storage['ScoreLevel2'] = (+storage['ScoreLevel2']) + 8;
                }
                break;
            case '3':
                if (differId == '9') {
                    storage['ScoreLevel3'] = (+storage['ScoreLevel3']) + 12;
                }else {
                    storage['ScoreLevel3'] = (+storage['ScoreLevel3']) + 8;
                }
                break;
            case '4':
                storage['ScoreLevel4'] = (+storage['ScoreLevel4']) + 12;
                break;
        }
        scoreBox.text(storage['ScoreLevel' + level]);
    }
    // 再玩一次，返回选关页面
    $('#retry').on('click', function () {
        resultPage.hide();
        levelPage.show();
        // 初始化分数，分数清0
        initScore();
        initLevel();
    });
    // 分享给朋友图标
    var callFriend = $('.callFriend');
    // 分享给朋友蒙版
    var friendMask = $('.friendMask');
    // 分享给朋友按钮操作
    $('#share').on('click', function () {
        callFriend.show();
        friendMask.show();
        $(window).unload(function(){
            // 离开页面之前控制
            callFriendHide();
            if(musicPlay) {
                // 关闭大的背景音乐
                bgMusic.pause();
            }
        });
    });
    // 分享点击操作隐藏
    friendMask.on('click', function () {
        if(musicPlay) {
            // 打开大的背景音乐
            bgMusic.play();
        }
        callFriendHide();
    });
    /**
     * 隐藏分享给朋友浮层
     */
    function callFriendHide() {
        callFriend.hide();
        friendMask.hide();
    }
    // 游戏攻略跳转
    $('#strategy').on('click', function () {
        // 关闭大的背景音乐
        bgMusic.pause();
        music10s.pause();
        location.href = 'http://m.fang.com/zhishi/xf/201606/zhaochagonglue.html';
    });
});
