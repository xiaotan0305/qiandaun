/**
 * 房贷计算器main.js
 * modify by limengyang.bj@fang.com 2016-07-12 海外计算器埋码修改
 */
define('modules/tools/main', ['jquery', 'navflayer/navflayer_new2', 'view/businessLoansView', 'view/combinationLoansView', 'view/taxView',
        'modules/mycenter/yhxw', 'modules/tools/maima', 'model/setting', 'model/modelParse','util/common'],
    function (require) {
        'use strict';
        // TODO:设置别名，由于mvc模块结构过于深层，对seajs设置路径处理，此操作应该在seajs初始化时执行
        var $ = require('jquery');
        var vars = seajs.data.vars;
        // 隐藏表单数据
        $('input[type=hidden]').each(function (index, element) {
            vars[$(this).attr('data-id')] = element.value;
        });
        // vars中无当前城市中文变量，加入cityname
        if (!vars.cityname) {
            vars.cityname = $('#cityname').val();
        }
        var preLoad = [];
        require('navflayer/navflayer_new2');
        // 404页面js
        if (vars.action === 'jump') {
            require.async(['modules/tools/jump'], function (run) {
                run();
            });
            // 404等待跳转不再往下走
            return;
        }
        var setting = require('model/setting');
        var modelParse = require('model/modelParse');
        var common = require('util/common');
        var maima = require('modules/tools/maima');
        var leftContent = $('.left').html();
        if (vars.action !== 'worldJisuan' && vars.action !== 'getEsfSfTools') {
            // zhangcongfeng@fang.com start
            require('view/businessLoansView');
            require('view/combinationLoansView');
            require('view/taxView');
            Vue.component('navigator', {
                replace: true,
                template: '<div class="main" id="main" v-show="showMain"><section class="secTab listtab1" id="navMenu" v-show="showNav">'
                + '<div class="flexbox"><a v-for="todo in todos" class="{{todo.cal}}" v-on:click="change($index)"><span>{{todo.text}}</span></a>'
                + '</div></section>'
                + '<div id="mainBody"><component :is="currentView" :rate="rate" :rate-msg="rateMsg" v-ref:child></component>'
                + '</div>',
                data: function () {
                    return {
                        currentView: 'daikuan',
                        showNav: true,
                        showMain: true,
                        baseRate: '',
                        rate: '',
                        pageType: 1,
                        rateMsg: '',
                        todos: [
                            {text: '商业贷', cal: 'active', view: 'daikuan', href: 'daikuan.html'},
                            {text: '公积金贷', cal: '', view: 'daikuan', href: 'gjj.html'},
                            {text: '组合贷', cal: '', view: 'zhdai', href: 'zhdai.html'},
                            {text: '税费计算', cal: '', view: 'tax', href: 'taxs.html'}
                        ],
                        businessRate: '',
                        fundRate: '',
                        businessRateArr10:[],
                        fundRateArr10:[]

                    };
                },
                methods: {
                    change: function (index) {
                        // 切换tab时候隐藏结果
                        $('.jsresults').hide();
                        this.$broadcast('changeTab', index + 1);
                        // 页面类型:0商业贷;1公积金贷;2组合贷;3税费计算
                        this.pageType = index + 1;
                        this.currentView = this.todos[index].view;
                        // 公积金贷款和商业贷款利率区分
                        index === 0 && (this.rate = this.businessRate) && (this.baseRate = this.businessRate);
                        index === 1 && (this.rate = this.fundRate) && (this.baseRate = this.fundRate);
                        this.rateMsg = '基准利率（' + this.baseRate + '％）';
                        var len = this.todos.length;
                        for (var i = 0; i < len; i++) {
                            this.todos[i].cal = '';
                        }
                        this.todos[index].cal = 'active';
                        modelParse.pushStateFn(true, this.pageType);
                        // 埋码
                        maima(this.pageType);
                    }
                },
                ready: function () {
                    var that = this;
                    var len = this.todos.length;
                    for (var i = 0; i < len; i++) {
                        this.todos[i].cal = '';
                    }

                    // 组合贷放在获取利率的ajax
                    // 公积金
                    if (location.href.indexOf('gjj') > -1) {
                        this.currentView = 'daikuan';
                        this.pageType = 2;
                        this.todos[1].cal = 'active';
                    }else if (location.href.indexOf('taxs') > -1) {
                        // 税费贷
                        this.currentView = 'tax';
                        this.todos[3].cal = 'active';
                        if (location.href.indexOf('esftaxs') > -1) {
                            this.pageType = 5;
                        }else {
                            this.pageType = 4;
                        }
                    }else if(location.href.indexOf('zhdai') === -1){
                        // 商业贷
                        this.currentView = 'daikuan';
                        this.pageType = 1;
                        this.todos[0].cal = 'active';
                    }
                    window.addEventListener('popstate', function () {
                        var currentUrl = window.location.href;
                        var tabType = common.getPageName(currentUrl);
                        var cent = $('.cent');
                        if (that.$refs.child.showPro === true) {
                            // 首付比例返回
                            that.$refs.child.showPro = false;
                            that.showNav = true;
                            that.$refs.child.showDai = true;
                        }else if (that.$refs.child.showDetail === true) {
                            // 计算结果详情页返回
                            that.$refs.child.showDetail = false;
                            that.showNav = true;
                            that.$refs.child.showDai = true;
                            cent.text('房贷计算器');
                            $('.left').html('').html(leftContent);
                        }else if(that.$refs.child.showRate === true) {
                            that.$refs.child.showRate = false;
                            that.showNav = true;
                            that.$refs.child.showDai = true;
                        }else{
                            // 其他情况返回
                            var len = that.todos.length;
                            for (var i = 0; i < len; i++) {
                                that.todos[i].cal = '';
                            }
                            var num = tabType - 1;
                            num === 0 && (that.rate = that.businessRate) && (that.baseRate = that.businessRate);
                            num === 1 && (that.rate = that.fundRate) && (that.baseRate = that.fundRate);
                            that.rateMsg = '基准利率（' + that.baseRate + '％）';
                            that.currentView = that.todos[num].view;
                            that.todos[num].cal = 'active';
                        }
                    });
                    // 页面返回按钮
                    $('.back').on('click',function () {
                        window.history.back();
                    });
                },
                created: function () {
                    var that = this;
                    // 获取利率
                    $.getJSON(setting.RATE_AJAX_URL, function (json) {
                        if (json !== 'error') {
                            var arr = json.split('_');
                            if (arr && arr.length > 0) {
                                var businessRateArr10 = arr[0].split('|')[0].split(',');
                                var fundRateArr10 = arr[0].split('|')[1].split(',');
                                that.fundRateArr10 = fundRateArr10;
                                that.businessRateArr10 = businessRateArr10;
                                that.businessRate = businessRateArr10[businessRateArr10.length - 1];
                                that.fundRate = fundRateArr10[fundRateArr10.length - 1];
                                // 初始化页面
                                that.rate = that.businessRate;
                                that.rateMsg = '基准利率（' + that.businessRate + '％）';
                                that.baseRate = that.businessRate;
                            } else {
                                that.businessRate = vars.jzlv;
                                that.fundRate = vars.gjjlv;
                                that.rate = that.businessRate;
                                that.rateMsg = '基准利率（' + that.businessRate + '％）';
                                that.baseRate = that.businessRate;
                            }
                            if (location.href.indexOf('gjj') > -1) {
                                that.rate = that.fundRate;
                                that.rateMsg = '基准利率（' + that.fundRate + '％）';
                                that.baseRate = that.fundRate;
                            }
                            // 组合贷
                            if (location.href.indexOf('zhdai') > -1) {
                                that.currentView = 'zhdai';
                                that.pageType = 3;
                                that.todos[2].cal = 'active';
                            }
                        }
                    }).fail(function () {
                        that.businessRate = vars.jzlv;
                        that.fundRate = vars.gjjlv;
                        that.rate = that.businessRate;
                        that.baseRate = that.businessRate;
                        that.rateMsg = '基准利率（' + that.businessRate + '％）';
                        if (location.href.indexOf('gjj') > -1) {
                            that.rate = that.fundRate;
                            that.rateMsg = '基准利率（' + that.fundRate + '％）';
                            that.baseRate = that.fundRate;
                        }
                        // 组合贷
                        if (location.href.indexOf('zhdai') > -1) {
                            that.currentView = 'zhdai';
                            that.pageType = 3;
                            that.todos[2].cal = 'active';
                        }
                    });
                }
            });

            new Vue({
                el: 'body'
            });
            // zhangcongfeng@fang.com end
        }

        // TODO:可能有数据传入，则有数据data
        if (vars.action !== 'worldJisuan'&& vars.action !== 'getEsfSfTools') {
            // var totalcontroller = require('controller/totalController');
            // if (vars.pageType) {
            // totalcontroller.init(parseInt(vars.pageType));
            // }
            maima(vars.pageType);
        }

        if (vars.action === 'worldJisuan') {
            var type = '0' + vars.pageType;
            maima(type);
        } else {
            if(vars.pageType){
                maima(vars.pageType);
            }
        }
        var newMsgDom = $('.sms-num');
        var controlName = window.lib && window.lib.channelsConfig && window.lib.channelsConfig.currentChannel;
        if (controlName) {
            $.each(vars, function (index, element) {
                window.lib[index] = element;
            });
        }
        if (vars.action === 'worldJisuan') {
            require.async(['modules/tools/worldJisuan'], function (run) {
                run();
            });
        }
        // 首付贷计算器
        if (vars.action === 'getEsfSfTools') {
            require.async(['modules/tools/mvc/sfView/getEsfSfTools'], function (run) {
                run();
            });
        }
        // 下载App
        require.async('app/1.0.0/appdownload', function ($) {
            $('#down-btn-c').openApp();
            // 底部浮层打开app
            $('.linkbox').openApp({appUrl: 'waptoapp/{"destination":"calculator"}'});
        });
        // 修正除主题内容以外的页面不隐藏问题
        // (zhangcongfeng@fang.com)2016-04-06
        // 作用应该是弹出虚拟键盘时将页面向上滚动一点以免虚拟键盘挡住输入框
        // 这里只针对text类型的input,原来是写在每个视图里面的,挪到了main里面
        var u = navigator.userAgent;
        $('.main').on('focus', 'input[type=text],input[type=number]', function () {
            if (!/(iPhone|iPad|iPod|iOS)/i.test(u)) {
                $('html,body').animate({scrollTop: $(this).offset().top}, 200);
            } else if (/UCBrowser/i.test(u)) {
                var imgSrc = vars.public + 'img/sf-72.png';
                var downPop = $('img[src="' + imgSrc + '"]').parent().parent();
                downPop.length && downPop.hide();
            }
        }).on('blur', 'input[type=text],input[type=number]', function () {
            if (/(iPhone|iPad|iPod|iOS)/i.test(u) && /UCBrowser/i.test(u)) {
                var imgSrc = vars.public + 'img/sf-72.png';
                var downPop = $('img[src="' + imgSrc + '"]').parent().parent();
                downPop.length && downPop.show();
            }
        });
        // 稍作页面滚动，隐藏地
        // window.scrollTo(0, 1);
        // 判断是否加载显示回顶按钮
        var $window = $(window);
        $window.on('scroll.back', function () {
            if ($window.scrollTop() > $window.height() * 2 - 60) {
                require.async(['backtop/1.0.0/backtop'], function (backTop) {
                    backTop();
                });
                $window.off('scroll.back');
            }
        });
        preLoad.push(vars.public + 'js/20141106.js');
        require.async(preLoad);
        // 获取和显示新消息
        require.async('newmsgnum/1.0.0/newmsgnum', function (NewMsgNum) {
            if (newMsgDom) {
                new NewMsgNum(vars.mainSite, vars.city).getMsg(newMsgDom);
            }
        });
        // 统计功能
        require.async('count/loadforwapandm.min.js');
        require.async('count/loadonlyga.min.js');
        require.async('//clickm.fang.com/click/new/clickm.js', function () {
            Clickstat.eventAdd(window, 'load', function () {
                Clickstat.batchEvent('waptool_', '');
            });
        });
    });
