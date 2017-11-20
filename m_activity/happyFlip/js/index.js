/*
 * @file: index
 * @author: yangfan
 * @Create Time: 2016-05-27 15:53:51
 */
$(function () {
    'use strict';
    var imgPath = 'http://static.test.soufunimg.com/common_m/m_activity/happyFlip/';

    /**
     * 后端预设变量
     *  lotteryId 活动 Id, 该参数是要跟随跳转 url 传输的
        isBindPhone 是否绑定手机号,
        isStop 活动是否停止,
        isLogin 是否登录
        prizeListSize 奖品数量,
        canWin 是否可以翻牌,
        noWinReason 不能玩游戏理由;
     */
    var lotteryId = $('#lotteryId'),
        isBindPhone = $('#isBindPhone'),
        isStop = $('#isStop'),
        isLogin = $('#isLogin'),
        prizeListSize = $('#prizeListSize'),
        canWin = $('#canWin'),
        noWinReason = $('#noWinReason');

    // fix bug 有些后退浏览器不刷新页面，设置标记手动刷新。
    // canWin 后端预设。true, false，isStop === '1' 时为 ''，抽奖后会置为当前积分
    if (canWin.val() && !isNaN(+canWin.val())) {
        window.location.reload();
        return false;
    }

    var winBox = $('.js_win'),
        loseBox = $('.js_lose'),
        sttext = $('.sttext'),
        title01 = $('.title01');

    // 跳转地址变量
    var route = {
        login: 'https://m.fang.com/passport/login.aspx?burl=' + encodeURIComponent(window.location.href),
        bind: 'https://m.fang.com//passport/resetmobilephone.aspx?burl=' + encodeURIComponent(window.location.href),
        // 新需求，中积分不再跳转积分商城。
        // point: 'https://mstore.fang.com',
        youhuiquan: 'http://coupon.fang.com/m/MyCoupon.html?From=MyMoney',
        money: 'http://m.fang.com/my/?c=my&a=payIndex',
        // login: 'https://passporttest.fang.com/passport/login.aspx?burl=' + encodeURIComponent(window.location.href),
        // bind: 'https://passporttest.fang.com/passport/resetmobilephone.aspx?burl=' + encodeURIComponent(window.location.href),
        // point: 'http://mm.store.test.fang.com',
        // youhuiquan: 'http://coupon.test.fang.com/m/MyCoupon.html?From=MyMoney',
        // money: 'http://m.test.fang.com/my/?c=my&a=payIndex',
        things: 'http://' + window.location.hostname + '/huodongAC.d?class=FanfanleHc&m=getMyPrize',
        package: 'http://' + window.location.hostname + '/huodongAC.d?class=FanfanleHc&m=getWinList'
    };

    // 信息提示弹框相关
    var msgBox = $('.msg'),
        msgBoxTimer = null;

    function showMsg(pText, pTime, callback) {
        var text = pText || '信息有误！',
            time = pTime || 1500;
        msgBox.show().css({
            position: 'absolute',
            top: $(document).scrollTop() + $(document).height() / 4
        }).find('p').html(text);
        clearTimeout(msgBoxTimer);
        msgBoxTimer = setTimeout(function () {
            msgBox.hide();
            callback && callback();
        }, time);
    }


    // 活动停止的情况下，显示浮层，显示图片
    if ($.trim(isStop.val()) === '1') {
        loseBox.html('<img src="' + imgPath + 'images/tcbj03.png" />').show();
        $('.start').find('img').attr('src', imgPath + 'images/start.png');
        return false;
    }

    // 奖品数量小于8个
    if (!!$.trim(prizeListSize.val()) && +$.trim(prizeListSize.val()) < 8) {
        showMsg('活动配置不正确！');
        return false;
    }

    // 没有登录情况隐藏积分，设置欢迎语
    if ($.trim(isLogin.val()) === '0') {
        title01.css('opacity', 0);
        sttext.html('天天玩天天中');
    }

    /**
     * 翻牌动画类
        duration 动画时间，需要配合 css 中的 animating 类的 transition duration;
        hasMoved 是否已经执行一次动画;
        isMoving 是否正在执行动画;
        beforeVerify 点击开始动画时预先验证是否可以动画;
        prizes 奖品列表，每个奖品的 id, type, name, img
        cards 牌位置列表，每张牌位置信息，用于动画
        againCard 默认奖品对象，一般为未中奖奖品 id, type, name, src
        choicePrize 服务器返回的奖品;
        choiceCell 用户翻中牌 jq 对象;
     */
    var happyFlip = function (options) {
        this.backSelector = '.back';
        this.frontSelector = '.Npic';
        this.wordSelector = '.Ntext';
        this.startSelector = '.start';
        this.animatingClass = 'animating';
        this.duration = 200;
        this.hasMoved = false;
        this.isMoving = false;
        this.prizes = [];
        this.cards = [];
        this.againCard = {};
        this.choicePrize = null;
        this.choiceCell = null;
        this.beforeVerify = options.beforeVerify || $.noop;
        this.init();
    };

    happyFlip.prototype.listen = function (eventName, func) {
        $(window).on(eventName, func);
    };

    happyFlip.prototype.trigger = function (eventName, data) {
        $(window).trigger(eventName, data);
    };

    happyFlip.prototype.unbindClick = function () {
        this.cardBack.off('click');
        this.startBtn.off('click');
    };

    /**
     * 绑定动画事件监听
     * 触发对应动画事件执行对应动画方法
     */
    happyFlip.prototype.bindCustomEvents = function () {
        var that = this;
        this.listen('cellsFadeIn', function () {
            that.cellsFadeIn();
        });

        this.listen('cellsFlipIn', function () {
            that.cellsFlipIn();
        });

        this.listen('cellsFlipOut', function () {
            that.cellsFlipOut();
        });

        this.listen('moveCenter', function () {
            that.moveCenter();
        });

        this.listen('moveBack', function () {
            that.moveBack();
        });

        this.listen('moveEnd', function () {
            that.moveEnd();
        });
    };

    happyFlip.prototype.setChoicePrize = function (options) {
        this.choicePrize = {
            id: options.id,
            type: options.type,
            name: options.name,
            src: options.src
        };
    };

    /**
        startBtn 开始按钮;
        cardFront 牌正面 $;
        cardBack 牌背面 $;
     */
    happyFlip.prototype.init = function () {
        this.startBtn = $(this.startSelector);
        this.cardFront = $(this.frontSelector);
        this.cardBack = $(this.backSelector);
        this.cardWord = $(this.wordSelector);
        this.bindClickStart();
        this.bindCustomEvents();
    };

    /**
     * 重置翻牌到初始状态
     */
    happyFlip.prototype.restore = function () {
        var that = this;
        that.cardBack.css({
            opacity: 0
        });
        $('.' + that.animatingClass).removeClass(that.animatingClass);
        that.hasMoved = false;
        that.isMoving = false;
        that.bindClickStart();
        that.randomCard();
    };

    /**
     * 奖品重置
     */
    happyFlip.prototype.randomCard = function () {
        var that = this,
            choiceIndex = '';

        var prize = that.choicePrize,
            choice = that.choiceCell,
            list = that.prizes.slice(0),
            cells = that.cells;

        if (prize && choice) {
            choice.find(that.frontSelector).html('<image data-id="' + prize.id + '" src="' + prize.src + '" width="100%"/>');
            choice.find(that.wordSelector).text(prize.name);
            choiceIndex = +choice.attr('data-index');
        }

        cells.map(function (cell) {
            var cellIndex = cell.index;
            if (choiceIndex && choiceIndex === cellIndex) {
                return false;
            }

            // splice 后要重新获取 Length
            var random = parseInt(Math.random() * list.length);
            if (prize && prize.id === list[random].id) {
                list.splice(random, 1);
                random = parseInt(Math.random() * list.length);
            }
            cell.front.html(list[random].img);
            cell.word.text(list[random].word);
            list.splice(random, 1);
            return false;
        });
        // 重置奖品
        that.choicePrize = null;
        that.choiceCell = null;
    };

    /**
     * 绑定开始按钮事件，卸载牌背点击事件
     * 注意：点击开始按钮后再获取牌的位置，否则获取位置不准确。
     */
    happyFlip.prototype.bindClickStart = function () {
        var that = this;
        that.unbindClick();
        that.startBtn.on('click', function () {
            if (that.isMoving) {
                return false;
            }

            // 业务逻辑验证
            var bv = that.beforeVerify && that.beforeVerify();
            if (!bv) {
                return false;
            }

            // 只获取一遍页面初始状态元素
            that.getCards();
            that.isMoving = true;
            that.trigger('cellsFadeIn');

            return false;
        }).find('img').attr('src', imgPath + 'images/start.png');
    };

    happyFlip.prototype.bindClickBack = function () {
        var that = this;
        that.unbindClick();
        that.cardBack.on('click', function () {
            if (that.hasMoved) {
                that.choiceCell = $(this).parent();
                requestResult();
            } else {
                console.log('not move!');
            }
        });
        that.startBtn.on('click', function () {
            that.restore();
        });
    };

    /**
     * 获取所有卡牌对象，为了循环进行动画播放，和还原初始状态
     * this.cells 卡片对象列表，进行随机位置逻辑判断
     * this.cards 所有卡片位置列表，进行动画
     * this.prizes 奖品列表，包括 id, type, name, img
     */
    happyFlip.prototype.getCards = function () {
        var that = this;
        var centerCard = that.centerCard;
        that.cells = [];
        this.cardBack.parent().each(function () {
            var $this = $(this);
            var index = $this.index() + 1,
                position = $this.position();

            if (!centerCard) {
                var card = {
                    card: $this,
                    left: position.left,
                    top: position.top
                };
                that.cards.push(card);
            }
            $this.attr('data-index', index);
            var cell = {
                front: $this.find(that.frontSelector),
                back: $this.find(that.backSelector),
                word: $this.find(that.wordSelector),
                index: index
            };
            that.cells.push(cell);
            if (!centerCard) {
                var prize = {
                    word: cell.word.text(),
                    img: cell.front.html()
                };
                var $img = $(prize.img);
                var id = $img.attr('data-id');
                prize.id = +id;
                // 最后一个类型为 'other' 设为默认奖品
                if ($img.attr('data-type') === 'other') {
                    that.againCard = {
                        id: prize.id,
                        type: 'other',
                        name: prize.word,
                        src: $img.attr('src')
                    };
                }
                that.prizes.push(prize);
            }
        });

        // !centerCard 代表已经获取过卡片位置和奖品列表了。
        if (!centerCard) {
            that.centerCard = that.startBtn.position();
        }
    };

    var timer = null;

    /**
     * 卡牌牌淡入效果
     */
    happyFlip.prototype.cellsFadeIn = function () {
        var that = this;
        this.cardBack.css({
            opacity: 1
        }).addClass(that.animatingClass);

        clearTimeout(timer);

        timer = setTimeout(function () {
            $('.' + that.animatingClass).removeClass(that.animatingClass);
            that.trigger('cellsFlipIn');
        }, that.duration);
    };

    /**
     * 卡牌翻到背面效果
     */
    happyFlip.prototype.cellsFlipIn = function () {
        var that = this;
        that.cardFront.empty();

        this.cardBack.parent().css({
            transform: 'rotate3d(0,1,0,180deg)',
            '-webkit-transform': 'rotate3d(0,1,0,180deg)'
        }).addClass(that.animatingClass);

        clearTimeout(timer);
        timer = setTimeout(function () {
            $('.' + that.animatingClass).removeClass(that.animatingClass);
            that.trigger('moveCenter');
        }, that.duration);
    };

    /**
     * 卡牌翻开效果，文案逻辑上领取到奖品后，直接弹出蒙层，所以没有使用该效果
     */
    happyFlip.prototype.cellsFlipOut = function (index) {
        var that = this;
        var card = that.cards[index].card;

        card.css({
            transform: 'rotate3d(0,1,0,180deg)',
            '-webkit-transform': 'rotate3d(0,1,0,180deg)'
        }).addClass(that.animatingClass);

        card.css({
            opacity: 0
        });

        setTimeout(function () {
            $('.' + that.animatingClass).removeClass(that.animatingClass);
        }, that.duration);
    };

    /**
     * 所有卡牌逐一移动到中心位置
     */
    happyFlip.prototype.moveCenter = function () {
        var that = this;
        var center = that.centerCard,
            cardsLength = that.cards.length;

        function move(index) {
            var card = that.cards[index];
            var translate = 'translate3d(' + (center.left - card.left) + 'px,' + (center.top - card.top) + 'px,0)';

            card.card.css({
                transform: translate,
                '-webkit-transform': translate
            }).addClass(that.animatingClass);

            if (index + 1 < cardsLength) {
                clearTimeout(timer);
                timer = setTimeout(function () {
                    move(index + 1);
                }, that.duration);
            } else {
                clearTimeout(timer);
                timer = setTimeout(function () {
                    $('.' + that.animatingClass).removeClass(that.animatingClass);
                    that.trigger('moveBack');
                }, that.duration);
            }
        }
        move(0);
    };

    /**
     * 所有卡牌逐一还原到原来的位置，更改开始按钮图片
     */
    happyFlip.prototype.moveBack = function () {
        var that = this;
        var cardsLength = that.cards.length;

        that.startBtn.find('img').attr('src', imgPath + 'images/return.png');

        function move(index) {
            var card = that.cards[index];
            var translate = 'translate3d(0,0,0)';

            card.card.css({
                transform: translate,
                '-webkit-transform': translate
            }).addClass(that.animatingClass);

            if (index + 1 < cardsLength) {
                clearTimeout(timer);
                timer = setTimeout(function () {
                    move(index + 1);
                }, that.duration);
            } else {
                clearTimeout(timer);
                timer = setTimeout(function () {
                    $('.' + that.animatingClass).removeClass(that.animatingClass);
                    that.trigger('moveEnd');
                }, that.duration);
            }
        }
        move(0);
    };

    /**
     * 所有卡牌完成动画，绑定牌背点击事件(请求)，重新绑定开始按钮事件
     */
    happyFlip.prototype.moveEnd = function () {
        var that = this;
        that.cardBack.parent().css({
            transform: '',
            '-webkit-transform': ''
        });
        that.isMoving = false;
        that.hasMoved = true;
        that.bindClickBack();
    };

    /**
     * 创建好运翻翻乐动画对象
     */
    var hf = new happyFlip({
        beforeVerify: function () {
            if ($.trim(isLogin.val()) === '0') {
                window.location.href = route.login;
                return false;
            }

            if ($.trim(isBindPhone.val()) === '0') {
                window.location.href = route.bind;
                return false;
            }

            if ($.trim(canWin.val()) === 'false') {
                showMsg(noWinReason.val());
                return false;
            }
            return true;
        }
    });

    /**
     * 进行中奖请求
     */
    var requesting = false;
    function requestResult() {
        if (requesting) {
            return false;
        }
        requesting = true;
        var url = 'http://' + window.location.hostname + '/huodongAC.d?class=FanfanleHc&m=choujiang&lotteryId=' + lotteryId.val();
        $.get(url, function (data) {
            requesting = false;
            // 默认选中未中奖奖品
            if (!data || !hf.hasMoved) {
                showLoseBox();
                console.log('data is void, or not moved!');
                return false;
            }
            var dataRoot = JSON.parse(data).root;
            // 有可能请求积分接口失败
            if (!dataRoot.canWin) {
                // showMsg(dataRoot.noWinMessage + '!');
                showLoseBox();
                console.log('not can Win!');
                return false;
            }
            if (dataRoot.isGetPrize) {
                updatePageStatus(dataRoot.freePlay, dataRoot.surplusPoints, dataRoot.shoppointnumber);
                if (dataRoot.isGetPrize === '0') {
                    showLoseBox();
                }
                if (dataRoot.isGetPrize === '1') {
                    // showMsg('已帮您加入我的奖品！');
                    hf.setChoicePrize({
                        id: dataRoot.prizeId,
                        type: dataRoot.prizeType,
                        name: dataRoot.prizeName,
                        src: dataRoot.prizeUrl
                    });
                    showWinBox(dataRoot.winId, dataRoot.prizeType, dataRoot.prizeUrl, dataRoot.prizeName);
                    hf.restore();
                }
            } else {
                // 中奖后，入库操作有可能执行报错
                showLoseBox();
            }
            return false;
        });
        return false;
    }

    function showLoseBox() {
        hf.setChoicePrize(hf.againCard);
        loseBox.show();
        hf.restore();
    }

    /**
     * 显示中奖对话框
     * @param  {string} pType 中奖类型
     * @param  {string} pSrc  中奖图片路径
     * @param  {string} pID   中奖 winId 该参数是要跟随跳转 url 传输的
     */
    function showWinBox(pID, pType, pSrc, pName) {
        winBox.data({
            type: pType,
            winID: pID
        });
        winBox.find('.prizes').html('<img src="' + pSrc + '" />');
        winBox.find('.nname').text(pName);

        var img = winBox.find('.buttr img');
        var src = img.attr('src');
        if (pType === 'things') {
            src = replaceIMGSrc(src, 'but04');
            img.first().attr('src', src);
        } else {
            src = replaceIMGSrc(src, 'but04a');
            img.first().attr('src', src);
        }
        winBox.show();
    }

    /**
     * 替换图片名称
     * @param  {string} pSrc     图片路径
     * @param  {string} pImgName 图片名称
     */
    function replaceIMGSrc(pSrc, pImgName) {
        var rex = /^(.*\/)?[^\/]+\.(png|gif|jpe?g)$/i;
        var exp = '$1' + pImgName + '.$2';
        return pSrc.replace(rex, exp);
    }

    /**
     * 请求，中奖后更新页面显示信息
     * @param  {string} freeCount       免费次数
     * @param  {string} remainingPoints 剩余积分
     * @param  {string} bonusPoints     每次消耗积分
     */
    function updatePageStatus(freeCount, remainingPoints, bonusPoints) {
        canWin.val(+remainingPoints);
        title01.html('我的积分 : ' + remainingPoints + '积分');
        if (+freeCount > 0) {
            sttext.html('免费翻' + freeCount + '次');
            return false;
        }
        if (+remainingPoints < +bonusPoints) {
            sttext.html('积分不足');
            hf.unbindClick();
        } else {
            // sttext.html('消耗<em>' + bonusPoints + '</em>积分');
            sttext.html(bonusPoints + '积分翻一次');
        }
        return false;
    }

    /**
     * 中奖蒙层点击事件，判断中奖类型，进行页面跳转。
     */
    winBox.on('click', function (e) {
        var $target = $('.close, .js_agian, .js_agian > img');
        if ($target.is(e.target)) {
            $(this).hide();
            return false;
        }

        var data = winBox.data();
        var type = data.type,
            id = data.winID;
        if (type === 'things') {
            window.location.href = route.things + '&lotteryId=' + lotteryId.val() + '&winId=' + id;
        } else if (type === 'point') {
            // 积分改为跳到奖品列表
            window.location.href = route.package + '&lotteryId=' + lotteryId.val();
        } else if (type === 'money') {
            window.location.href = route.money + '&city=bj';
        } else if (type === 'youhuiquan') {
            window.location.href = route.youhuiquan + '&City=bj';
        } else {
            // console.log('package - 流量跳转到我的奖品列表');
            window.location.href = route.package + '&lotteryId=' + lotteryId.val();
        }
        return false;
    });

    /**
     * 未中奖蒙层，隐藏蒙层。
     */
    loseBox.on('click', function () {
        $(this).hide();
        return false;
    });

    /**
     * 我的奖品按钮点击判断是否登录
     */
    $('.bottom > a:last').on('click', function () {
        if ($.trim(isLogin.val()) === '0') {
            $(this).attr('href', route.login);
        } else {
            $(this).attr('href', route.package + '&lotteryId=' + lotteryId.val());
        }
    });
    return false;
});
