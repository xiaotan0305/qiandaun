/**
 * 二手房成交详情页
 */
define('modules/chengjiao/detail', ['jquery', 'lazyload/1.9.1/lazyload'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        // jquery库
        var $ = require('jquery');
        // 页面传入的参数
        var vars = seajs.data.vars,
        // 用于热combo的数组
            preLoad = [],
        // 电话联系及打电话按钮实例
            $telBtn = $('.tj-tel'),
        // 给我留言按钮实例
            $leaveMsgBtn = $('.tj-chat, .tj-mes');

        // 插入动轮播插件,插入app下载浮层js
        preLoad.push('swipe/3.10/swiper', 'app/1.0.0/appdownload');
        // 如果可以使用localStorage，则插入查看历史和收藏功能js
        if (vars.localStorage) {
            preLoad.push('modules/esf/viewhistory', 'fav/1.0.0/fav');
        }
        // 加载所需的js
        require.async(preLoad);

        // 二手房成交详情页图片增加惰性加载功能 
        require('lazyload/1.9.1/lazyload');
        $('.lazyload').lazyload();

        //点击全景看房图标进入全景看房
        $('.play360').on('click', function(){
            window.location = vars.panoramic;
        });

        /**
         * 在字符串中截取需要的属性数据
         * @param str 字符串数据
         * @param name 需要获取的属性
         * @returns {*}
         */
        function getParam(str, name) {
            var paraString = str.split(';'),
                paraStringL = paraString.length,
                paraObj = {},
                i = 0,
                j = '';
            for (; i < paraStringL; i++) {
                j = paraString[i];
                paraObj[j.substring(0, j.indexOf('~')).toLowerCase()] = j.substring(j.indexOf('~') + 1, j.length);
            }
            return paraObj[name];
        }


        if (vars.localStorage) {
            // 浏览历史功能初始化
            require.async('modules/esf/viewhistory', function (a) {
                a.record(vars.houseid);
            });
        }
        // 当页面从sfapp中打开时，设置foot底部增加50外边距，该id在public/inc.footer.html中找到
        $('#foot').css('margin-bottom', '50px');
        // 控制图片的宽高比
        var img = $('.swiper-slide').find('img');
        if(img.length){
            var imgWidth = img.eq(0).width();
            img.css('height',imgWidth*0.75);
            // 顶部图片滑动效果
            var totalSlider = vars.sum;
            if (totalSlider > 1) {
                require.async('swipe/3.10/swiper', function (Swiper) {
                    Swiper('#slider', {
                        speed: 500,
                        loop: true,
                        onSlideChangeStart: function (swiper) {
                            var activeIndex = swiper.activeIndex;
                            if (activeIndex === 0) {
                            // 右滑
                                activeIndex = totalSlider;
                            } else if (activeIndex > totalSlider) {
                            // 左滑
                                activeIndex = 1;
                            }
                            $('#pageIndex').text(activeIndex);
                        }
                    });
                });
            }
        }

        /**
         * 委托房源点击咨询
         * @param zhcity
         * @param city
         * @param housetype
         * @param houseid
         * @param newcode
         * @param type
         * @param phone
         * @param channel
         * @param uname
         * @param aname
         * @param agentid
         * @param order
         * @param photourl
         * @param housefrom
         */
        function chatWeituo(zhcity, city, housetype, houseid, newcode, type, phone, channel, uname, aname, agentid, order, photourl, housefrom) {
            var xiaoqu = vars.xiaoqu || '';
            var room = vars.room || '';
            var price = vars.price || '';
            var url = '/data.d?m=houseinfotj&city=' + city + '&housetype='
                + housetype + '&houseid=' + $.trim(houseid) + '&newcode=' + $.trim(newcode)
                + '&type=' + type + '&phone=' + $.trim(phone) + '&channel=' + $.trim(channel) + '&agentid='
                + $.trim(agentid) + '&order=' + order + '&housefrom=';
            if ('A' === vars.housetype || 'D' === vars.housetype) {
                if (vars.localStorage) {
                    vars.localStorage.setItem(uname, encodeURIComponent(aname) + ';' + photourl
                        + ';' + encodeURIComponent(xiaoqu + '的' + room + '价格为' + price + '的电商'));
                }
            } else if (vars.localStorage) {
                vars.localStorage.setItem(uname, encodeURIComponent(aname) + ';' + photourl
                    + ';' + encodeURIComponent(xiaoqu + '的' + room + '价格为' + price + '的委托')
                    + ';' + vars.mainSite + 'agent/' + vars.city + '/' + vars.agentid + '.html');
            }

            if (vars.localStorage) {
                vars.localStorage.setItem(uname + '_allInfo', encodeURIComponent(vars.title) + ';'
                    + encodeURIComponent(vars.price + '万元') + ';' + encodeURIComponent(vars.tags.replace(/(\s*$)/g, ''))
                    + ';' + vars.titleimg + ';' + encodeURIComponent(vars.room_hall_area) + ';'
                    + encodeURIComponent(vars.district_name + '-' + vars.projname) + ';' + vars.esfSite + vars.city + '/'
                    + housefrom + '_' + vars.houseid + '.html');
            }
            if (vars.hasOwnProperty('from') && vars.from.length > 0) {
                url += vars.from + '&product=soufun';
            } else {
                url += housefrom;
            }
            $.ajax(url);
            var paramPurpose = '';
            if ($.trim(vars.purpose) === '写字楼') {
                paramPurpose = 'xzl';
            } else if ($.trim(vars.purpose) === '商铺') {
                paramPurpose = 'sp';
            }
            setTimeout(function () {
                window.location = '/chat.d?m=chat&username=' + uname + '&city=' + city
                    + '&type=wapesf&houseid=' + houseid + '&purpose=' + paramPurpose + '&housetype='
                    + vars.housetype;
            }, 500);
        }

        /**
         * 打电话功能
         * @param city
         * @param housetype
         * @param houseid
         * @param newcode
         * @param type
         * @param phone
         * @param channel
         * @param agentid
         * @param order
         * @param housefrom
         */
        function teltj(city, housetype, houseid, newcode, type, phone, channel, agentid, order, housefrom) {
            if (channel.indexOf('转') > -1) {
                channel = channel.replace('转', ',');
            }
            var url = vars.mainSite + 'data.d?m=houseinfotj&city=' + city + '&housetype=' + housetype
                + '&houseid=' + $.trim(houseid) + '&newcode=' + $.trim(newcode) + '&type=' + type
                + '&phone=' + $.trim(phone) + '&channel=' + $.trim(channel) + '&agentid=' + $.trim(agentid) + '&order=' + order + '&housefrom=';
            if (vars.hasOwnProperty('from') && vars.from.length > 0) {
                url += vars.from + '&product=soufun';
            } else {
                url += housefrom;
            }
            $.get(url);
        }

        /**
         * 点击经纪人电话操作
         */
        $telBtn.on('click', function () {
            var data = $(this).attr('data-teltj');
            var dataArr = data.split(',');
            // 如果vars.sfAgent数组存在则需要替换电话400电话号码
            if (vars.sfAgent) {
                dataArr[5] = vars.sfAgent[$.trim(dataArr[7])].replace('转', '-');
            }
            teltj(dataArr[0], dataArr[1], dataArr[2], dataArr[3], dataArr[4], dataArr[5], dataArr[6], dataArr[7], dataArr[8], dataArr[9]);
            var housetype = 'esf';
            var size = 50;
            // 经纪人电话已经全部改为400电话
            // var phone = $('#agentPhone').text();
            var isShopPhone = '';
            var houseid = vars.houseid;
            var callHis = '';
            if (vars.localStorage) {
                callHis = vars.localStorage.getItem('callHis');
            }
            var item = 'title~' + $('#title').html() + ';' + 'phone~' + dataArr[5].replace('转', ',')
                + ';' + 'time~' + new Date().getTime();
            if (!callHis && vars.localStorage) {
                vars.localStorage.setItem('callHis', item);
            } else {
                var callHisList = callHis.split('|');
                var callHistory = '';
                for (var i = 0; i < (callHisList.length >= size ? size : callHisList.length); i++) {
                    var phoneHis = getParam(callHisList[i], 'phone');
                    if (phoneHis !== dataArr[5].replace('转', ',')) {
                        callHistory += callHisList[i] + '|';
                    }
                }
                if (vars.localStorage) {
                    vars.localStorage.setItem('callHis', item + (callHistory === '' ? '' : '|')
                        + (callHistory === '' ? '' : callHistory.substring(0, callHistory.length - 1)));
                }
            }
            $.ajax(vars.mainSite + 'data.d?m=tel&city=' + vars.city + '&housetype='
                + housetype + '&id=' + houseid + '&phone=' + dataArr[5] + '&isShopPhone=' + isShopPhone);
        });

        /**
         * 点击给我留言按钮操作
         */
        $leaveMsgBtn.on('click', function () {
            var data = $(this).attr('data-chat');
            var dataArr = data.split(',');
            if (vars.sfAgent) {
                dataArr[6] = vars.sfAgent[$.trim(dataArr[10])].replace('转', '-');
            }
            chatWeituo(dataArr[0], dataArr[1], dataArr[2], dataArr[3], dataArr[4], dataArr[5]
                , dataArr[6], dataArr[7], dataArr[8], dataArr[9], dataArr[10], dataArr[11], dataArr[12], dataArr[13]);
        });

        /**
         * 向下滑动时相关效果
         * 页面滑动未超过200px时，页面向上滑动元导航慢慢消失，新导航逐渐显示，页面向下滑动，原导航逐渐显示，新导航消失。滑动页面滚动超过200px时新导航固定顶部。
         *
         */
        /*function scrollFun() {
            // 尾部标签
            this.footer = $('.footer');
            // 详情页初始导航
            this.detailNav = $('#slider').find('a.back,a.icon-fav,a.icon-nav');
            // 月面滑动显示导航
            this.headerNav = $('.header');
            // 初始导航与页面滚动时显示导航切换的滚动总距离
            this.maxLen = 200;
            // 导航开始切换距离
            this.cLen = 150;

            // 电商类型数组
            this.init = function () {
                var that = this;
                $(window).on('scroll', function () {
                    if ($('.newNav').is(':hidden')) {
                        var scrollH = $(this).scrollTop();
                        that.headerNav.addClass('esf-style').css('position', 'fixed').show();
                        // 导航切换效果
                        if (scrollH <= that.maxLen) {
                            that.headerNav.css('opacity', scrollH / that.maxLen);
                            if (scrollH === 0) {
                                that.headerNav.hide();
                            }
                            // 向下移动屏幕
                            if (scrollH <= that.cLen) {
                                that.detailNav.css('opacity', 1 - scrollH / that.cLen);
                            } else {
                                that.headerNav.children().filter('.left,.head-icon').css('opacity', scrollH / (that.maxLen - that.cLen));
                            }
                            // 向上移动屏幕
                        } else {
                            that.headerNav.css('opacity', 1);
                        }
                    } else {
                        that.detailNav.show();
                        that.headerNav.show().addClass('esf-style').css({position: 'relative', opacity: '1'});
                    }
                });
            };
            return this.init();
        }

        // 加载导航相关效果
        new scrollFun();*/
        var maxLen = 200;
        // var cLen = 150;
        var headerNav = $('.header');
        $(window).on('scroll',function () {
            var scrollH = $(this).scrollTop();
            if (scrollH <= maxLen) {
                if (!headerNav.is(':hidden')) {
                    headerNav.css('opacity', scrollH / maxLen);
                    if (scrollH === 0) {
                        headerNav.hide();
                    }
                }
            } else {
                headerNav.css('opacity', 1);
                headerNav.addClass('esf-style').css('position', 'fixed').show();
            }
        });
        
    };
});