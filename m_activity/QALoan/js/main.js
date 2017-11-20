$(function () {
    // var loanType = ['限购', '限购', '限购', '限购'];
    var city = ['北京', '天津','广州','成都','其他'];
    var latestOrRecom = ['.latest', '.recommend'];
    var lengthLimit = 500;
    var toggleTouchMove,browserHeader,moveId;
    var transformData = {
        loanType: '限购',
        city: '',
        newOrRecom: 1
    };
    var flag = {
        answerIssueSFlag: true,
        answerIssueFFlag: true,
        moveEndFlag: true,
        replaceIssueFlag: true
    };
    var localS = '';
    var previous = 0;
    var smsTipsBox = $('.tipsBox');
    var loadingBox = $('.loadingBox');
    var pageId = $('#page');
    var searchTab = $('.searchTab');
    var souSlider = $('.souslider');
    var changeTab = $('.changeTab');
    var wenti = $('.wenti');
    var telForm = $('.telForm');
    var tabList = $('.tabList');
    var latest = $('.latest');
    var recommend = $('.recommend');
    var loadingTip = $('.loadingTip');
    var windowJQ = $(window);
    // var endTime;
    inits();

    /**
     * 页面初始化
     * @return {[type]} 没有返回值
     */
    function inits() {
        // 页面滚动事件
        toggleTouchMove = (function () {
            function listnerHandler(event) {
                event.preventDefault();
            }
            return function (flag) {
                document[flag ? 'addEventListener' : 'removeEventListener']('touchmove', listnerHandler);
            };
        })();
        browserHeader = judgeBrowserFn();
        // 页面事件绑定
        eventInit();
        // 后台存储数据
        if(window.localStorage) {
            window.localStorage.setItem('page',pageId.val());
        } else {
            localS = pageId.val();
        }
        // 活动结束
        // endTime = new Date(2017,3,1).getTime();
        // if(endTime < new Date().getTime()) {
        //     var html = '<div class="activityEnd">'
        //                 + '<div class="messBox">'
        //                     + '<div class="con">'
        //                         + '<p>活动已结束</p>'
        //                     + '</div>'
        //                 + '</div>'
        //             + '</div>';
        //     $('body').append(html);
        //     toggleTouchMove(true);     
        // }
    }

    /**
     * 绑定事件方法
     * @return {[type]} 没有返回值
     */
    function eventInit() {
        // 筛选框
        searchTab.on('click', 'a', function (event) {
            var target = $(this);
            var index = target.index();
            souSlider.find('li').eq(index).toggle().siblings().hide();
            event.stopPropagation();
            target.toggleClass('active');
        });
        // 贷款类型筛选
        souSlider.on('click', 'dd', function () {
            var datas = {};
            var target = $(this);
            var index;
            var parIndex = target.parents('li').index();
            if (parIndex) {
                index = target.index();
                transformData.city = city[index];
                datas.type = 'city';
            }
            // } else {
            //     index = target.index() - 1;
            //     transformData.loanType = loanType[index === -1 ? 3 : index];
            //     datas.type = 'loan';
            //     datas.index = index;
            // }
            datas.element = searchTab.find('a').eq(parIndex);
            throttleAjaxFn(false,datas);
            flag.moveEndFlag = true;
        });
        // tab切换
        changeTab.on('click', 'a', function () {
            var datas = {};
            var target = $(this);
            var index = target.index();
            transformData.newOrRecom = index + 1;
            datas.type = 'tabChange';
            datas.element = target;
            throttleAjaxFn(false,datas);
            flag.moveEndFlag = true;
        });
        // 提问
        wenti.on('click', 'a', function (event) {
            event.preventDefault();
            var self = $(this);
            // var index = self.parent().index();
            if (document.cookie.indexOf('sfut') > -1) {
                location.href = location.protocol + '//' + location.host + '/activityshow/LoanQuestion/ask.jsp?'
                                    + 'loanType=' + encodeURIComponent(transformData.loanType)
                                        + '&city=' + encodeURIComponent(transformData.city);
            } else {
                loadingBox.show();
                toggleTouchMove(true);
            }
        });
        // 登录框消失控制
        loadingBox.on('click', function () {
            $(this).hide();
            toggleTouchMove(false);
        });
        telForm.on('click', function (event) {
            event.stopPropagation();
        });
        // 抢答按钮点击事件,提交按钮点击事件
        latest.on('click', 'a', function () {
            var self = $(this);
            var className = self.attr('class');
            if (document.cookie.indexOf('sfut') > -1) {
                if (className.indexOf('answerBtn') > -1) {
                    self.parent().hide().siblings('.answerform').show();
                    self.parents('li').siblings('li.notAnswered').find('.bb').show().siblings('.answerform').hide();
                } else if (className.indexOf('submitBtn') > -1) {
                    var ele = self.siblings().find('.answertext');
                    var length = ele.val().trim().length;
                    length <= 0 && alert('答案不能为空');
                    length > 500 && alert('答案限制500字');
                    if (length > 0 && length <= 500) {
                        // 执行请求
                        var datas = {};
                        datas.askId = self.parents('li').data('askid');
                        datas.content = ele.val().trim();
                        datas.element = self;
                        if(flag.answerIssueSFlag) {
                            flag.answerIssueSFlag = false;
                            answerIssueFn(datas);
                        }
                    }
                }
            } else {
                loadingBox.show();
                toggleTouchMove(true);
            }
        });
        // 答题框输入事件
        latest.on('input', '.answertext', function () {
            var content = $(this).val().trim();
            if (content.length > lengthLimit) {
                $(this).val(content.substr(0, lengthLimit));
            }
        });
        // 推荐列表答案收起和展示
        recommend.on('click', 'a', function () {
            var self = $(this);
            var className = self.attr('class');
            if (className.indexOf('showAllBtn') > -1) {
                self.toggleClass('loadm').siblings().toggleClass('maxH');
            }
        });
        // 页面滚动
        windowJQ.on('touchmove', function () {
            var scrollH = $(document).height() - browserHeader;
            if (windowJQ.scrollTop() + windowJQ.height() >= scrollH && windowJQ.scrollTop() !== 0) {
                moveId && clearTimeout(moveId);
                if(flag.moveEndFlag) {
                    loadingTip.text('加载中...').show();
                    moveId = setTimeout(function () {
                        throttleAjaxFn(true,{});
                    },1000);
                } else {
                    loadingTip.text('房天下问答组出品').show();
                    setTimeout(function () {
                        loadingTip.hide();
                    },2000);
                }
            }
        });
        // 页面点击事件
        windowJQ.on('click', function () {
            souSlider.find('li').hide();
            searchTab.find('a').removeClass('active');
        });
    }

    /**
     * 提交问题答案ajax请求
     * @dataObj  {[Object]} 对象
     *
     */
    function answerIssueFn(dataObj) {
        var url = location.protocol + '//' + location.host + '/huodongAC.d?m=submitAnswerProcess&class=LoanQuestionHc';
        for(var pro in dataObj) {
            if(pro === 'content') {
                url += '&' + pro + '=' + encodeURIComponent(encodeURIComponent(dataObj[pro]));
            } else if(pro === 'askId') {
                url += '&' + pro + '=' + dataObj[pro];
            }
        }
        $.get(url,function (data) {
            if(data.code === '100') {
                alert('提交成功');
                dataObj.element.parent().hide().siblings('.bb').show().find('a').hide();
                dataObj.element.parents('li').removeClass('notAnswered');
                flag.answerIssueSFlag = true;
            } else if(data.code === 999) {
                alert(data.message === 'noMES' ? '提交失败' : data.message);
                flag.answerIssueSFlag = true;
            } else if(flag.answerIssueFFlag) {
                flag.answerIssueFFlag = false;
                answerIssueFn(dataObj);
            } else {
                alert(data.message === 'noMES' ? '提交失败' : data.message);
                flag.answerIssueSFlag = true;
            }
        });
    }

    /**
     * 当前浏览器高度兼容
     * @return {[Number]} 返回当前header高度
     */
    function judgeBrowserFn() {
        var browserHeader = 0;
        var UA = navigator.userAgent.toLowerCase();
        var isApp = UA.indexOf('iphone') !== -1 || UA.indexOf('ios') !== -1;
        if (isApp) {
            // 是iPhone的话浏览器多高出了68像素
            browserHeader = 68;
        } else if (/ucbrowser/i.test(UA)) {
            // 不是苹果手机并且是uc浏览器的话，浏览器多高出了50像素
            browserHeader = 50;
        }
        return browserHeader;
    }

    /**
     * 贷款类型筛选
     * @index  {[Number]} 筛选的index值
     * @return {[none]} 没有返回值
     */
    function loanTypeChoiceFn(index) {
        if (index === -1) {
            wenti.find('li').show();
        }
        index !== -1 && $('.wenti').find('li').eq(index).show().siblings().hide();
    }

    /**
     * 筛选框ajax请求方法
     * @return {[undefined]} 没有返回值
     */
    function throttleAjaxFn(loadmoreFlag,choiceObj) {
        var pd = '';
        var url = location.protocol + '//' + location.host + '/huodongAC.d?m=showQuestion&class=LoanQuestionHc';
        for(var pro in transformData) {
            if(pro === 'newOrRecom') {
                url += '&' + pro + '=' + transformData[pro];
            } else {
                url += '&' + pro + '=' + encodeURIComponent(encodeURIComponent(transformData[pro]));
            }
        }
        if(loadmoreFlag) {
            url += '&page=' + (window.localStorage ? window.localStorage.getItem('page') : localS);
            loadingTip.text('加载中...').show();
        }
        url += '&ajaxFlag=1';
        var nowDate = Date.now();
        if(flag.replaceIssueFlag && nowDate - previous > 200) {
            previous = nowDate;
            flag.replaceIssueFlag = false;
            $.get(url,function (data) {
                if(transformData.newOrRecom === 1) {
                    data.data.forEach(function (item) {
                        pd += '<li class="notAnswered" data-askId=' + item.askId + '>'
                            + '<div class="xBox">'
                                + '<div class="question marX12">'
                                    + '<p class="p1">'
                                        + '<b>问题描述：</b>'
                                        + item.title
                                    + '</p>'
                                    + '<p class="askTime bb">'
                                        + item.askDate
                                        + '<a class="flor answerBtn">抢答</a>'
                                    + '</p>'
                                    + '<div class="answerform" style="display:none">'
                                        + '<div class="textarea">'
                                            + '<textarea type="text" class="answertext" placeholder="请输入您的回答"></textarea>'
                                        + '</div>'
                                        + '<a href="javascript:void(0)" class="submitBtn arr-btn">提交回答</a>'
                                    + '</div>'
                                + '</div>'
                                + '<div class="space8"></div>'
                            + '</div>'
                        + '</li>';
                    });
                } else {
                    data.data.forEach(function (item) {
                        var group = item.groupId === '-1' ? '来自房天下网友'
                                    : item.groupId === '0' ? '来自房天下二手房经纪人'
                                    : item.groupId === '1' ? '来自房天下新房置业顾问' : '';
                        pd += '<li data-askId=' + item.askId + '>'
                                + '<div class="xBox">'
                                    + '<div class="question marX12">'
                                        + '<p class="p1">'
                                            + '<b>问题描述：</b>'
                                            + item.title
                                        + '</p>'
                                        + '<div class="reask">'
                                            + '<p class=' + (loadmoreFlag ? "loadmoreMaxH" : "judgeMaxH") + '>'
                                                + item.answer
                                            + '</p>'
                                            + '<a href="javascript:void(0)" class="loadm showAllBtn"></a>'
                                        + '</div>'
                                        + '<p class="askTime">'
                                            + item.answerDate
                                            + '<span class="flor">'
                                                + group
                                            + '</span>'
                                        + '</p>'
                                    + '</div>'
                                    + '<div class="space8"></div>'
                                + '</div>'
                            + '</li>';
                    });
                }
                flag.replaceIssueFlag = true;
                $(latestOrRecom[transformData.newOrRecom - 1])[loadmoreFlag ? 'append' : 'html'](pd);
                if(choiceObj.type === 'loan') {
                    choiceObj.element.html((transformData.loanType ? transformData.loanType : '贷款类型') + '<i></i>').removeClass('active');
                    loanTypeChoiceFn(choiceObj.index);
                } else if(choiceObj.type === 'city') {
                    choiceObj.element.html((transformData.city === '其他' ? transformData.city + '城市' : transformData.city) + '<i></i>').removeClass('active');
                } else if(choiceObj.type === 'tabChange') {
                    tabList.find(latestOrRecom[transformData.newOrRecom - 1]).show();
                    choiceObj.element.addClass('active').siblings().removeClass('active');
                    souSlider.find('li').hide();
                    searchTab.find('a').removeClass('active');
                    tabList.find(latestOrRecom[transformData.newOrRecom - 1]).siblings().hide();
                }
                if(transformData.newOrRecom === 2) {
                    var classname = loadmoreFlag ? '.loadmoreMaxH' : '.judgeMaxH';
                    $.each(recommend.find(classname),function (index,item) {
                        if($(item).height() > 66) {
                            $(item).addClass('maxH');
                        } else {
                            $(item).siblings().hide();
                        }
                    });
                }
                if(loadmoreFlag) {
                    loadingTip.hide();
                    if(data.data.length < 20) {
                        flag.moveEndFlag = false;
                    }
                }
                if(window.localStorage) {
                    localStorage.setItem('page',data.page);
                } else {
                    localS = data.page;
                }
            });
        }
    }

    /**
     *  登录模块
     *  options {} 模块配置项
     **/
    function loginModule(options) {
        // 参数列表 登录插件，倒计时，手机号input,验证码input,验证码btn,登录btn,提示box
        this.defaultOptions = {
            smsLogin: window.smsLogin,
            smsDelay: 60,
            smsPhoneInput: $('#smsPhoneInput'),
            smsCodeInput: $('#smsCodeInput'),
            smsCodeBtn: $('#smsCodeBtn'),
            smsLoginBtn: $('#smsLoginBtn'),
            smsTipsBox: '',
            getCodeFlag: true,
            className: 'noclick',
            smsTimer: '',
            phoneRegEx: /^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$/i,
            defaultTime: 20
        };
        this.options = this.defaultOptions;
        for(var pro in options) {
            this.options[pro] = options[pro];
        }
        this.init();
    }
    loginModule.prototype = {
        constructor: 'loginModule',
        
        /**
         * 初始化方法
         * @return {[type]} 没有返回值
         */
        init: function () {
            this.options.smsCodeBtn.on('click', this.getCodeFn.bind(this));
            this.options.smsLoginBtn.on('click', this.loginFn.bind(this));
        },
        
        /**
         * 获取验证码
         * @return {[type]} 没有返回值
         */
        getCodeFn: function () {
            var self = this;
            var smsPhoneValue = this.options.smsPhoneInput.val().trim();
            var tipMessage = !this.options.getCodeFlag ? '请一分钟以后再试'
                                : !smsPhoneValue ? '手机号不能为空'
                                    : !this.options.phoneRegEx.test(smsPhoneValue) ? '手机号格式错误' : '获取验证码成功';
            if (this.options.getCodeFlag && smsPhoneValue && this.options.phoneRegEx.test(smsPhoneValue)) {
                // this.showTipsFn(tipMessage);
                // this.codeCountDownFn();
                this.options.smsLogin.send(smsPhoneValue, function () {
                    self.showTipsFn(tipMessage);
                    self.codeCountDownFn();
                }, function (err) {
                    alert(err);
                });
            } else {
                this.showTipsFn(tipMessage);
            }
        },
        
        /**
         * 登录方法
         * @return {[type]} 没有返回值
         */
        loginFn: function () {
            var self = this;
            var smsPhoneValue = this.options.smsPhoneInput.val().trim();
            var smsCodeValue = this.options.smsCodeInput.val().trim();
            var tipMessage = !smsPhoneValue ? '手机号不能为空'
                                : !this.options.phoneRegEx.test(smsPhoneValue) ? '手机号格式不正确'
                                    : !smsCodeValue ? '验证码不能为空' : smsCodeValue.length < 4 ? '验证码格式不正确' : '登录成功~';
            if (smsPhoneValue && this.options.phoneRegEx.test(smsPhoneValue) && smsCodeValue && smsCodeValue.length >= 4) {
                this.options.smsLogin.check(smsPhoneValue, smsCodeValue, function () {
                    self.showTipsFn(tipMessage);
                    var locationHref = location.href;
                    var rand = new Date().getTime();
                    if(/&ran=\d+/.test(locationHref)) {
                        location.href = locationHref.replace(/&ran=\d+/,rand);
                    } else {
                        location.href = locationHref + '&ran=' + rand;
                    }
                }, function (err) {
                    alert(err);
                });
            } else {
                this.showTipsFn(tipMessage);
            }
        },

        /**
         * 验证码倒计时
         * @return {[type]} 没有返回值
         */
        codeCountDownFn: function () {
            var self = this;
            this.options.getCodeFlag = false;
            this.options.smsCodeBtn.text(this.getDelayText(this.options.smsDelay)).addClass(this.options.className);
            clearInterval(this.options.smsTimer);
            this.options.smsTimer = setInterval(function () {
                self.options.smsDelay--;
                self.options.smsCodeBtn.val(self.getDelayText(self.options.smsDelay));
                if (self.options.smsDelay < 0) {
                    clearInterval(self.options.smsTimer);
                    self.options.smsCodeBtn.val('获取验证码').removeClass(self.options.className);
                    self.options.smsDelay = self.options.defaultTime;
                    self.options.getCodeFlag = true;
                }
            }, 1000);
        },
        getDelayText: function (second) {
            return '重新发送' + (100 + second + '').substr(1) + '';
        },
        showTipsFn: function (tipMessage) {
            var self = this;
            if (this.options.smsTipsBox) {
                this.options.smsTipsBox.find('.tipsContent').html(tipMessage);
                this.options.smsTipsBox.show();
                setTimeout(function () {
                    self.options.smsTipsBox.hide();
                }, 1000);
            } else {
                alert(tipMessage);
            }
        }
    };
    // 登录模块
    new loginModule({
        smsTipsBox: smsTipsBox
    });
});