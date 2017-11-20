/**
 * wap&pc端投票
 * 谭坤鹏 2017-10-16
 */
$(function () {
    // 获取 列表上边距高度
    var zygwTop = $('#zygw').offset().top;
    // 获取页面数据
    var city = $('#city').val(),
        type = $('#type').val();

    /**
     * 获取cookie
     * @param {any} key
     * @returns
     */
    var getCookie = function (key) {
        var arr, reg = new RegExp('(^| )' + key + '=([^;]*)(;|$)');
        if (arr = document.cookie.match(reg)) {
            var str;
            try {
                str = decodeURIComponent(arr[2]);
            } catch (e) {
                str = unescape(arr[2]);
            }
            return str;
        }
        return '';
    };

    /**
     * 设置cookie
     * @param {any} name
     * @param {any} value
     * @param {any} days
     * @returns
     */
    var setCookie = function (name, value, days) {
        if (days === 0) {
            document.cookie = name + '=' + escape(value);
            return;
        }
        var now = new Date(),
            nowDay = now.getDate();
        now.setDate(nowDay + 1);
        now.setHours(0);
        now.setMinutes(0);
        now.setSeconds(0);
        document.cookie = name + '=' + escape(value) + '; path=/; expires=' + now.toGMTString();
    };

    /**
     * 公共弹层提示框
     * @param content
     * @param fn
     */
    var showMessage = (function () {
        var messageFloor = $('#showMessage'),
            messageContent = $('#showMessage>div');
        var timer;
        return function (content, fn) {
            messageFloor.show();
            messageContent.text(content);
            clearTimeout(timer);
            timer = setTimeout(function () {
                messageFloor.hide();
                fn && fn();
            }, 1500);
        };
    })();

    /**
     * 页面滚动控制
     * @param top
     */
    var scrollTo = function (top) {
        $('html,body').animate({
            scrollTop: top
        }, 100);
    };

    // 初始化
    var cookieJson = getCookie('lp_renqi');
    if (cookieJson) {
        cookieJson = JSON.parse(cookieJson);
        for (var key in cookieJson) {
            if (cookieJson.hasOwnProperty(key)) {
                var id = key,
                    num = cookieJson[id];
                // 票数达到5票置灰
                if (num >= 5) {
                    $('[data-id=' + id + ']').removeClass('tp').addClass('tp_ytou');
                }
            }
        }
    }

    // 返回顶部
    $('#hui').on('click', function () {
        scrollTo(0);
    });
    // 弹层关闭
    var rulesBox = $('#rulesBox'),
        searchBox = $('#searchBox'),
        maxBox = $('#maxBox'),
        publicBox = $('#publicBox');
    var close = function () {
        rulesBox.hide();
        searchBox.hide();
        maxBox.hide();
        publicBox.hide();
    };
    $('.close').on('click', function () {
        close();
    });
    // 活动规则弹出
    $('#rules').on('click', function () {
        publicBox.show();
        rulesBox.show();
    });
    // 搜索弹出
    var input = $('#input'),
        loupanList = $('#list'),
        loupanList2 = $('#list2');
    $('#serach').on('click', function () {
        input.val('');
        publicBox.show();
        searchBox.show();
    });
    publicBox.on('click', function () {
        close();
    });
    searchBox.on('click', function (e) {
        e.stopPropagation();
    });

    /**
     * 展示搜索列表
     * @param data
     */
    function showSearchList(data) {
        var eleStr = '';
        if (data && data.length) {
            for (var i = 0; i < data.length; i++) {
                var json = data[i];
                eleStr += '<li ' + (type === 'pc' && i % 3 === 2 ? 'style="margin-right:0px;"' : '') + '>\
                                <div class="rqbang ">\
                                    <div class="ren_top ">\
                                        <a href="' + (json.videourl || 'javascript:;') + '" class="rel">\
                                            <img src="' + json.imgurl + '" alt="" class="chatu">\
                                        </a>\
                                    </div>\
                                    <div class="ren_bot">\
                                        <h4 class="white name">\
                                        <span class="lm">' + json.name + '</span>\
                                        <a href="' + location.origin + location.pathname + '?m=consultant&id=' + json.id + '" class="share_wu_z"></a>\
                                        </h4>\
                                        ' + (type === 'wap' && json.loupanid ? '<a href="tel:' + json.loupanid + '" class="tel_rq  tel_02"><img src="//static.soufunimg.com/common_m/m_activity/dl10/wap/images/tel_renqi.png" alt=""></a>' : '') + '<div class="lp_mes">\
                                            <a href="' + (json.def1 || 'javascript:;') + '">\
                                                <dl class="clearfix">\
                                                    <dd>' + json.loupan + '：</dd>\
                                                    <dt>' + json.lpdescription + '</dt>\
                                                </dl>\
                                            </a>\
                                        </div>\
                                        <div class="kouhao">\
                                            <dl class="clearfix">\
                                                <dd class="fl">口号：</dd>\
                                                <dt>' + json.title + '</dt>\
                                            </dl>\
                                        </div>\
                                        <div class="tp_bot">\
                                            <div class="fl">\
                                                <span class="add-num"><em class="add-animation">+1</em></span>\
                                                <a href="javascript:;" class="tp tpBtn" data-id="' + json.id + '"></a>\
                                            </div>\
                                            <div class="num_piao fr yellow">\
                                                <b>' + json.count + '</b><u>票</u>\
                                            </div>\
                                        </div>\
                                    </div>\
                                </div>\
                            </li>';
            }
        }
        return eleStr;
    }

    /**
     * 搜索
     * @returns
     */
    function parseSearch() {
        var value = input.val();
        if (!value) return showMessage('输入内容不能为空');
        $.ajax({
            type: 'GET',
            url: 'dance.hd?m=findDancer',
            data: {
                des: encodeURIComponent(value),
                city: city
            },
            success: function (data) {
                var htmlStr = showSearchList(data);
                if (!htmlStr) {
                    showMessage('无数据');
                } else {
                    scrollTo(zygwTop);
                }
                close();
                loupanList.html(htmlStr);
                // 第二个列表判断
                loupanList2.html('').hide();
            },
            error: function (err) {
                console.log(err);
                showMessage('请求发送错误');
            }
        });
    }

    // 搜索
    $('#inputBtn').on('click', function () {
        parseSearch();
    });
    input.on('keyup', function (e) {
        if (e.keyCode === 13) {
            parseSearch();
        }
    });

    // 投票
    $('#vote').on('click', '.tpBtn', function (e) {
        e.preventDefault();
        var that = this;
        var $this = $(that);
        var id = $this.data().id;
        if (!id) return showMessage('缺少id');
        var cookieJson = getCookie('lp_renqi');
        if (cookieJson) {
            cookieJson = JSON.parse(cookieJson);
        } else {
            cookieJson = {};
        }
        // 判断是否空闲
        if (typeof that.kongxian === 'boolean' && !that.kongxian) {
            return;
            // return showMessage('请等待上次提交完成');
        }
        if (!cookieJson[id] || cookieJson[id] < 5) {
            that.kongxian = false;
            $.ajax({
                type: 'POST',
                url: 'dance.hd?m=addcount',
                data: {
                    id: id,
                    cf: type
                },
                success: function (data) {
                    // 防止双击
                    if (data.code === 100) {
                        // showMessage('投票成功');
                        // 投票+1动画
                        var addNum = $this.siblings('.add-num');
                        addNum.show();
                        setTimeout(function () {
                            addNum.hide();
                            that.kongxian = true;
                        }, 1000);
                        // 票数达到5票置灰
                        cookieJson[id] = cookieJson[id] || 0;
                        cookieJson[id]++;
                        if (cookieJson[id] >= 5) {
                            $this.removeClass('tp').addClass('tp_ytou');
                        }
                        // 更新票数
                        var piaoEle = $this.parent().siblings('.num_piao').find('b'),
                            piaoNum = parseInt(piaoEle.html());
                        piaoEle.html(++piaoNum);
                        // 更新cookie
                        setCookie('lp_renqi', JSON.stringify(cookieJson));
                    } else {
                        showMessage(data.msg);
                    }
                },
                error: function (err) {
                    console.log(err);
                    that.kongxian = true;
                    showMessage('请求发送错误');
                }
            });
        } else {
            maxBox.show();
        }
    });
    // 微信分享
    var Weixin = window.Weixin;
    if (Weixin) {
        new Weixin({
            debug: false,
            shareTitle: '房产有舞置业顾问人气榜',
            descContent: '是时候闪亮登场了！房产有舞“秀艺场”置业顾问人气榜投票通道正式开启！支持你喜欢的置业顾问！',
            lineLink: location.href,
            imgUrl: 'http://static.soufunimg.com/common_m/m_activity/dl10/wap/images/share.png',
            swapTitle: false
        });
    }
});