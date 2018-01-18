/**
 * 租房详情页主类
 * by blue
 * 20151010 blue 整理代码，优化代码，删除没用的代码，将headersearch删除
 */
define('modules/zf/detail', ['jquery', 'modules/zf/yhxw', 'superShare/1.0.1/superShare','smsLogin/smsLogin', 'iscroll/2.0.0/iscroll-lite'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        // jquery库
        var $ = require('jquery');
        var iscrollNew = require('iscroll/2.0.0/iscroll-lite');
        // 修改租房详情页点击导航栏按钮后导航栏的头部显示不出来 原因是样式中opacity设置为0
        $('#newheader').css('opacity', 1);
        // 页面传入的参数
        var vars = seajs.data.vars,
        // 热combo需要的预加载数组
            preLoad = [],
        // 获取浏览器ua
            UA = navigator.userAgent.toLowerCase(),
        // 是否为三星泰坦系统
            isTizen = false,
        // 房源评价头滑动容器实例
            $scrollHead = $('#scrollHead'),
        // 评价总内容容器
            $scrollHeadUl = $scrollHead.find('ul'),
        // 各个经纪人评价节点数组
            scrollHeadliArr = $scrollHead.find('li'),
        // 分享按钮实例
            $shareBtn = $('.btn-share'),
        // 电话联系及打电话按钮实例
            $telBtn = $('.tj-tel'),
        // 给我浏览按钮实例
            $leaveMsgBtn = $('.tj-chat'),
        // 经纪人浮层上的在线咨询按钮实例
            $chatBtn = $('#chat'),
        // 预约看房浮层关闭按钮
            $yyCloseBtn = $('.btn-close'),
        // 预约看房浮层关闭按钮
            $yydSucBtn = $('#yydSuc'),
        // 预约看房浮层关闭按钮
            $yydFailBtn = $('#yydFail'),
            $yydFailOne = $('#yydFailOne'),
            $yydFailTwo = $('#yydFailTwo'),
        // 收藏按钮实例
            $collectBtn = $('.btn-fav'),
        //收藏弹框实例
            $collectBtn1 = $('.xqfocus'),
        // 收藏提示实例
            $collectMsg,
        // window实例
            $window = $(window),
        // !!!底部联系人浮层，页面中未找到
            botlayer = $('div.botlayer'),
        // 更多按钮点击后显示的全部评价容器实例
            moreStrArr = $('.moreStr'),
        // 房源评价中的更多按钮实例
            $moreBtn = $('.btn-more'),
        // 经纪人id
            $agentID = $('#agentid'),
        // 省略的房源描述实例
            $lessTxt = $('.lessContent'),
        // 位置及周边描述省略内容实例
            $positionLessTxt = $('.lessBank'),
        // 周边配套省略内容实例
            $lessSurround = $('.lessSurround'),
        // 页面标识
            pageId;
        // 获取写字楼或者商铺的物业类型(聊天功能中使用)
        var paramPurpose = '';
        if ($.trim(vars.purpose) === '写字楼') {
            paramPurpose = 'xzl';
        } else if ($.trim(vars.purpose) === '商铺') {
            paramPurpose = 'sp';
        }
        // 详情页图片增加惰性加载功能
        require.async('lazyload/1.9.1/lazyload', function () {
            $('img[data-original]').lazyload();
        });
        // 统计行为对象
        var yhxw = require('modules/zf/yhxw');
        // 是否有滑动标签，有插入滑动插件
        if ($scrollHead.length > 0) {
            preLoad.push('iscroll/2.0.0/iscroll-lite');
        }
        // 判断是否localStorage可用，可用则插入查看历史和收藏js
        if (vars.localStorage) {
            preLoad.push('modules/zf/viewhistory', 'fav/1.0.0/fav');
        }
        // 是否为三星tizen系统
        if (UA.indexOf('tizen') > -1) {
            isTizen = true;
        }
        // 如果是三星泰泽系统，隐藏右上角app下载按钮
        if (!isTizen) {
            preLoad.push('app/1.0.0/appdownload.js');
        }

        // 预加载所需的js
        require.async(preLoad);

        function preventDefault(e) {
            e.preventDefault();
        }

        /**
         * 手指滑动时阻止浏览器默认事件(阻止页面滚动）
         */
        function unable() {
            document.addEventListener('touchmove', preventDefault);
        }

        /**
         * 手指滑动恢复浏览器默认事件（恢复滚动
         */
        function enable() {
            document.removeEventListener('touchmove', preventDefault);
        }

        // 判断详情页种类，传入用户行为统计对象
        if (vars.housetype === 'DS') {
            pageId = 'zf_fy^dsxq_wap';
        } else if (vars.housetype === 'DSHZ') {
            pageId = 'zf_fy^dshzxq_wap';
        } else if (vars.housetype === 'JX') {
            if (vars.purpose === '住宅') {
                pageId = 'zf_fy^grxq_wap';
            } else if (vars.purpose === '商铺') {
                pageId = 'zf_fy^grspxq_wap';
            } else if (vars.purpose === '写字楼') {
                pageId = 'zf_fy^grxzlxq_wap';
            }
        } else if (vars.housetype === 'WAGT' || vars.housetype === 'AGT') {
            if (vars.purpose === '住宅') {
                pageId = 'zf_fy^xq_wap';
            } else if (vars.purpose === '别墅') {
                pageId = 'zf_fy^bsxq_wap';
            } else if (vars.purpose === '商铺') {
                pageId = 'zf_fy^spxq_wap';
            } else if (vars.purpose === '写字楼') {
                pageId = 'zf_fy^xzlxq_wap';
            }
        } else if (vars.housetype === 'JHWAGT' || vars.housetype === 'JHAGT') {
            pageId = 'zf_fy^yxxq_wap';
        } else if (vars.housetype === 'JGYAGT' || vars.housetype === 'FGYAGT') {
            pageId = 'zf_fy^ppgyxq_wap';
        }
        // 浏览该页面统计
        yhxw({pageId: pageId});

        /**
         * 根据索引值设置滚动到固定索引经纪人评论的评论内容节点，显示出来并设置激活类名
         * @param idx
         */
        function showScrollContent(idx) {
            scrollHeadliArr.hide().removeClass();
            scrollHeadliArr.eq(idx).show().addClass('active');
        }


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

        /**
         * 获取指定的cookie值
         * @param name
         * @returns {null}
         */
        function getCookie(name) {
            var arr, reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
            arr = document.cookie.match(reg);
            if (arr && arr.length > 0) {
                return unescape(arr[2]);
            }
            return null;
        }

        /**
         *  电商房源详情页，如果cookie中带有sf_source字段，则获取400电话，写入页面
         *  (因为zf列表页和详情页的php页面都有缓存,所以需要使用js去动态获取400电话)
         */
        if (parseInt(vars.housetype) === 1) {
            require.async('util/util', function (util) {
                var sfSource = util.getCookie('sf_source');
                if (sfSource) {
                    $.get(vars.zfSite + '/?c=zf&a=ajaxGet400Number', {
                        houseid: vars.houseid,
                        sfSource: sfSource
                    }, function (data400) {
                        if (data400 !== '0') {
                            $('#400Number').html(data400);
                        }
                    });
                }
            });
        }

        // 判断用户是否收藏改房源，更新房源收藏状态
        require.async('util/util',function(util) {
            if (util.getCookie('sfut')) {
                $.ajax({
                    url: vars.mySite + '?c=mycenter&a=isAlreadySelect',
                    data: {
                        city: vars.city,
                        houseid: vars.houseid,
                        groupid: vars.groupid,
                        esfsubtype: vars.housetype.indexOf('JH') > -1 ? 'yx' : '',
                        roomid: roomID,
                        projcode: vars.projcode,
                        purpose: vars.purpose,
                        channel:'rent',
                        url: document.location.href
                    },
                    success: function (data) {
                        if (data.result_code === '100' || data.resultcode === '100') {
                            $collectBtn.addClass('btn-faved cur');
                        }
                    }
                });
            }
        });

        /**
         * 显示收藏提示
         * @param str
         */
        // 租房收藏提示样式修改 lina  20161121
        function showCollectTips(str) {
            if (!$collectMsg) {
                $collectMsg = $('<div class="favorite" style="display: none;"><i></i>收藏成功</div>');
                $collectBtn1.append($collectMsg);
            }
            var favorite = $('.favorite');
            if(favorite.hasClass('reset')) {
                favorite.removeClass('reset');
            }
            if(str === '已取消收藏') {
                favorite.addClass('reset');
            }
            var obj = str;
            if(str !== '出错了') {
                obj = '<i></i>' + str;
            }
            $collectMsg.show().css('left' ,$(window).width() / 2 + 'px').html(obj);
            setTimeout(function () {
                $collectMsg.hide(500);
            }, 3000);
        }

        /**
         * 在线咨询
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
         */
        function chat(zhcity, city, housetype, houseid, newcode, type, phone, channel, uname, aname, agentid, order, photourl, housefrom, groupid) {
            yhxw({type: 24, pageId: pageId});
            var url = vars.mainSite + 'data.d?m=houseinfotj&city=' + city + '&housetype='
                + housetype + '&newcode=' + newcode + '&type='
                + type + '&phone=' + phone + '&channel=' + channel + '&agentid=' + agentid;
            if (vars.hasOwnProperty('from') && vars.from.length > 0) {
                url += '&housefrom=' + vars.from + '&product=soufun';
            }
            //区分聚合房源与普通房源
            if (groupid) {
                url += '&houseid=' + groupid;
            } else {
                url += '&houseid=' + houseid;
            }
            $.ajax(url);
            setTimeout(function () {
                var imHref = vars.mainSite + 'chat.d?m=chat&username=' + uname + '&city=' + city
                    + '&type=wapzf&houseid=' + $.trim(houseid) + '&purpose=' + paramPurpose
                    + '&housetype=' + vars.housetype;
                if (groupid) {
                    imHref += '&groupId=' + groupid;
                }
                // 无线2.0增加agentid参数
                if (agentid) {
                    imHref += '&agentid=' + agentid;
                }
                if (vars.listtype === '1') {
                    imHref += '&ShopType=wxsfb2.0';
                }
                window.location = imHref;
            }, 500);
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
            var xiaoqu = $('#xiaoqu').html() || '';
            var room = $('#room').html() || '';
            var price = $('#price').html() || '';
            var weituoUrl = '/data.d?m=houseinfotj&city=' + city + '&housetype='
                + housetype + '&houseid=' + houseid + '&newcode=' + newcode
                + '&type=' + type + '&phone=' + phone + '&channel=waphouseinfo'
                + '&agentid=' + agentid + '&order=' + order + '&housefrom=';
            if (vars.localStorage) {
                vars.localStorage.setItem(uname, encodeURIComponent(aname)
                    + ';' + photourl + ';' + encodeURIComponent(xiaoqu + '的'
                        + room + '价格为' + price + '的委托'));
            }
            if (vars.hasOwnProperty('from') && vars.from.length > 0) {
                weituoUrl += vars.from + '&product=soufun';
            } else {
                weituoUrl += housefrom;
            }
            $.ajax(weituoUrl);
            setTimeout(function () {
                var imHref = '/chat.d?m=chat&username=' + uname + '&city=' + city
                    + '&type=wapzf&houseid=' + $.trim(houseid) + '&purpose=' + paramPurpose
                    + '&housetype=' + vars.housetype;
                // 无线2.0增加agentid参数
                if (agentid) {
                    imHref += '&agentid=' + agentid;
                }
                if (vars.listtype === '1') {
                    imHref += '&ShopType=wxsfb2.0';
                }
                window.location = imHref;
            }, 500);
            yhxw({type: 24, pageId: pageId});
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
         * @param housefrom
         */
        function teltj(city, housetype, houseid, newcode, type, phone, channel, agentid, housefrom) {
            // phone中含有“转”字，转成英文逗号
            if (phone.indexOf('转') > -1) {
                phone = phone.replace('转', ',');
                // 去掉空格
                phone = phone.replace(/\s/g, '');
            }
            var telUrl = vars.mainSite + 'data.d?m=houseinfotj&city=' + city
                + '&housetype=' + housetype + '&houseid=' + houseid + '&newcode='
                + newcode + '&type=' + type + '&phone=' + phone + '&channel=' + channel
                + '&agentid=' + agentid + '&housefrom=';
            if (vars.hasOwnProperty('from') && vars.from.length > 0) {
                telUrl += vars.from + '&product=soufun';
            } else {
                telUrl += housefrom;
            }
            $.ajax(telUrl);
            yhxw({type: 31, pageId: pageId});
        }

        if (vars.localStorage) {
            // 浏览历史
            require.async('modules/zf/viewhistory', function (a) {
                if (vars.hasOwnProperty('roomid') && vars.houseid.length > 0) {
                    a.record(vars.roomid);
                } else {
                    a.record(vars.houseid);
                }
            });
        }

        /* 分享代码*/
        if ($('.share').length) {
            var SuperShare = require('superShare/1.0.1/superShare');
            var shareA = $('.share');
            var config = {
                // 分享的内容title
                title: '【租房子，就上房天下租房】' + (shareA.attr('newsline') || '') + '-' + vars.cityname + '-房天下租房',
                // 分享时的图标
                image: location.protocol + shareA.attr('imgpath') || '',
                // 分享内容的详细描述
                desc: shareA.attr('newssummary') ? shareA.attr('newssummary').substring(0, 64) + '...' : '',
                // 分享的链接地址
                url: location.href,
                // 分享的内容来源
                from: ' 房天下' + vars.cityname + '租房'
            };
            var superShare = new SuperShare(config);

            // 分享操作用户行为统计
            $('.share').on('click',function () {
                yhxw({type: 22, pageId: pageId});
            });
        }

        /**
         * 点击留言操作
         */
        $leaveMsgBtn.on('click', function () {
            var data = $leaveMsgBtn.attr('data-chat');
            var dataArr = data.split(',');
            chatWeituo(dataArr[0], dataArr[1], dataArr[2], dataArr[3], dataArr[4]
                , dataArr[5], dataArr[6], dataArr[7], dataArr[8], dataArr[9]
                , dataArr[10], dataArr[11], dataArr[12], dataArr[13], dataArr[14]);
        });

        /**
         * 点击经纪人浮层上的在线咨询按钮操作
         */
        $chatBtn.on('click', function () {
            var data = $chatBtn.attr('data-chat');
            var dataArr = data.split(',');
            chat(dataArr[0], dataArr[1], dataArr[2], dataArr[3], dataArr[4]
                , dataArr[5], dataArr[6], dataArr[7], dataArr[8], dataArr[9]
                , dataArr[10], dataArr[11], dataArr[12], dataArr[13], dataArr[14]);
        });

        /**
         * 点击预约看房浮层上的关闭按钮
         */
        $yyCloseBtn.on('click', function () {
            $yydSucBtn.hide();
            $yydFailBtn.hide();
            $yydFailOne.hide();
            $yydFailTwo.hide();
            enable();
        });

        /**
         * 点击打电话操作
         */
        $telBtn.on('click', function () {
            var data = $telBtn.attr('data-teltj');
            var dataArr = data.split(',');
            teltj(dataArr[0], dataArr[1], dataArr[2], dataArr[3], dataArr[4], dataArr[5], dataArr[6], dataArr[7], dataArr[8]);
            var housetype = 'zf';
            var size = 50;
            var phone = $('#phone').text();
            var from = $('#from').html() || '';
            var isShopPhone = '';
            var houseid = vars.houseid;
            var callHis = '';
            if (vars.localStorage) {
                callHis = vars.localStorage.getItem('callHis');
            }
            var item = 'title~' + $('#title').html() + ';' + 'phone~' + phone.replace('转', ',') + ';' + 'time~' + new Date().getTime();
            if (!callHis && vars.localStorage) {
                vars.localStorage.setItem('callHis', item);
            } else {
                var callHisList = callHis.split('|');
                var callHistory = '';
                for (var i = 0; i < (callHisList.length >= size ? size : callHisList.length); i++) {
                    var phoneHis = getParam(callHisList[i], 'phone');
                    if (phoneHis !== phone.replace('转', ',')) {
                        callHistory += callHisList[i] + '|';
                    }
                }
                if (vars.localStorage) {
                    vars.localStorage.setItem('callHis', item + (callHistory === '' ? '' : '|')
                        + (callHistory === '' ? '' : callHistory.substring(0, callHistory.length - 1)));
                }
            }
            $.ajax(vars.mainSite + 'data.d?m=tel&city=' + vars.city + '&housetype='
                + housetype + '&id=' + houseid + '&phone=' + phone + '&isShopPhone=' + isShopPhone);
        });

        /**
         * 根据滑动距离显隐浮层
         */
        $window.on('scroll', function () {
            if ($window.scrollTop() < 10) {
                if (botlayer.is(':visible')) {
                    botlayer.hide();
                }
            } else if (botlayer.is(':hidden')) {
                botlayer.show();
            }
        });

        // 如果存在需要滚动显示经纪人评论的情况，使用iscorll实现双重横向滚动实例
        if ($scrollHead.length > 0) {
            showScrollContent(0);
            var scrollW = scrollHeadliArr.eq(0).outerWidth(true);
            $scrollHeadUl.width((scrollHeadliArr.length - 1) * scrollW + $scrollHead.width());
            require.async('iscroll/2.0.0/iscroll-lite', function (run) {
                var isA = new run($scrollHead[0], {scrollX: true, scrollY: false});
                isA.on('scrollEnd', function () {
                    var s = Math.round(this.x / scrollW);
                    this.scrollTo(s * scrollW, 0, 200);
                    showScrollContent(Math.abs(s));
                });
            });
        }
        // 判断是否有房源评价
        if (moreStrArr.length > 0) {
            // 房源评价中的房东评价，如果超出300字显示更多按钮否则隐藏更多按钮
            moreStrArr.each(function () {
                var $this = $(this);
                if ($this.text().length < 300) {
                    $this.next().hide();
                }
            });

            /**
             * 点击房源评价中的更多按钮
             */
            $moreBtn.not('.classification').on('click', function () {
                var $this = $(this);
                var $parent = $this.closest('li');
                if ($parent.length > 0) {
                    if ($this.hasClass('up')) {
                        $this.removeClass('up').html('更多');
                        $parent.find('.moreStr').hide();
                        $parent.find('.lessStr').show();
                    } else {
                        $this.addClass('up').html('收起');
                        $parent.find('.lessStr').hide();
                        $parent.find('.moreStr').show();
                    }
                }
            });
        }

        // 判断是否需要有预约看房功能
        if (vars.hasOwnProperty('IsOpenDisctrict') && Number(vars.IsOpenDisctrict) === 1) {
            // 预约看房
            var currentUrl = window.location.href,
                refUrl = document.referrer,
            // 预约看房按钮
                $gradeBtn = $('.grade-btn'),
            // 预约看房成功弹窗
                $successPop = $('#yydSuc'),
            // 已经预约过显示弹窗
                $failPop = $('#yydFail'),
                url = vars.zfSite,
                burl,
                ajaxUrl;
            if (currentUrl.lastIndexOf('baidu-waptc') !== -1 || refUrl.lastIndexOf('baidu-waptc') !== -1) {
                url += '?c=zf&a=ajaxcheckOrderStatus&baidu-waptc';
            } else {
                url += '?c=zf&a=ajaxcheckOrderStatus';
            }
            var jsondata = {
                houseid: vars.houseid,
                roomid: vars.roomid,
                city: vars.city,
                r: Math.random()
            };

            /**
             * 加入预约单按钮操作
             * @param text 要提示的信息
             */
                
            var prompot = function (text) {
                $gradeBtn.on('click', function () {
                    yhxw({type: 8, pageId: pageId});
                    $('#message').html(text);
                    $failPop.show();
                    unable();
                });
            };

            /**
             * 添加预约看房功能
             */
            var addPrebookHouse = function () {
                // 加入用户行为统计
                yhxw({type: 8, pageId: pageId});
                if (currentUrl.lastIndexOf('baidu-waptc') !== -1 || refUrl.lastIndexOf('baidu-waptc') !== -1) {
                    ajaxUrl = vars.zfSite + '?c=zf&a=addPrebookHouse&baidu-waptc';
                } else {
                    ajaxUrl = vars.zfSite + '?c=zf&a=addPrebookHouse';
                }
                $.get(ajaxUrl, jsondata,
                    function (data) {
                        var jsonMes = JSON.parse(data);
                        switch (jsonMes.errcode) {
                            case '1' :
                                // 预约成功
                                $successPop.show();
                                unable();
                                break;
                            case '-99' :
                                // 已经预约过了
                                $failPop.show();
                                unable();
                                break;
                            default :
                                alert('预约失败，请稍后再试');
                        }
                    }
                );
            };

            /**
             * 点击成功预约弹窗继续选房按钮
             */
            $('#xuanfang,#xuanfang1').on('click', function () {
                $failPop.hide();
                $successPop.hide();
                enable();
            });

            $.get(url, jsondata, function (data) {
                // 匹配ip，不是很严谨，但是够用
                var reg = /([0-9]{1,3}\.){3}[0-9]{1,3}/;
                if (data === 'notLogin') {
                    // 没有登陆
                    if (currentUrl.lastIndexOf('baidu-waptc') !== -1 || refUrl.lastIndexOf('baidu-waptc') !== -1) {
                        burl = vars.zfSite + vars.city + '/DS_' + vars.houseid + '.html?baidu-waptc';
                    } else {
                        burl = vars.zfSite + vars.city + '/DS_' + vars.houseid + '.html';
                    }
                    url = 'https://m.fang.com/passport/login.aspx?burl=' + encodeURIComponent(burl);
                    $gradeBtn.attr('href', url);
                } else if (reg.test(data)) {
                    burl = encodeURIComponent(currentUrl);
                    url = '//passport.fang.com/xiaomilogin.aspx?service=hezuo-xiaomi-wap&v=0CF57D16DC400A309980ADBF0040628F'
                        + '&ip=' + data + '&backurl=' + burl;
                    $gradeBtn.attr('href', url);
                } else if (data === 'noPhone') {
                    // 没有手机注册
                    if (currentUrl.lastIndexOf('baidu-waptc') !== -1 || refUrl.lastIndexOf('baidu-waptc') !== -1) {
                        burl = vars.zfSite + vars.city + '/DS_' + vars.houseid + '.html?baidu-waptc';
                    } else {
                        burl = vars.zfSite + vars.city + '/DS_' + vars.houseid + '.html';
                    }
                    $gradeBtn.attr('href', 'https://m.fang.com/passport/resetmobilephone.aspx?burl=' + encodeURIComponent(burl));
                } else if (data === 'canNotBook') {
                    // 不提供预约,显示灰色
                    $gradeBtn.addClass('disabled');
                    $gradeBtn.html('已预约');
                } else if (data === '-94') {
                    prompot('该房源已在您的预约清单中！');
                } else if (data === '-95') {
                    prompot('房源已预约');
                } else if (data === '-99') {
                    prompot('当前您的账号不能预约，如有疑问，可致电4008508888。');
                } else {
                    $gradeBtn.on('click', addPrebookHouse);
                }
            });
        }
        // 设置置顶容器增高60像素，防止和经纪人信息浮层重叠
        $('#toTop').css('bottom', '60px');
        // !!!作用不详，找不到节点
        $('#foot').css('margin-bottom', '50px');
        // 判断有房源描述
        if ($lessTxt.length > 0) {
            // 获取房源描述完整内容实例
            var $moreTxt = $('.moreContent');

            /**
             * 点击房源描述省略内容中的更多按钮
             */
            $lessTxt.find('a').on('click', function () {
                $lessTxt.hide();
                $moreTxt.show();
            });

            /**
             * 点击房源描述完整内容中的收起按钮
             */
            $moreTxt.find('a').on('click', function () {
                $lessTxt.show();
                $moreTxt.hide();
            });
        }
        // 判断有位置及周边内容
        if ($positionLessTxt.length > 0) {
            // 获取位置及周边完整内容实例
            var $positionMoreTxt = $('.moreBank');

            /**
             * 点击位置及周边省略内容中的更多按钮
             */
            $positionLessTxt.find('a').on('click', function () {
                $positionLessTxt.hide();
                $positionMoreTxt.show();
            });

            /**
             * 点击位置及周边完整内容中的收起按钮
             */
            $positionMoreTxt.find('a').on('click', function () {
                $positionLessTxt.show();
                $positionMoreTxt.hide();
            });
        }
        // 判断有周边配套内容
        if ($lessSurround.length > 0) {
            // 获取周边配套完整内容实例
            var $moreSurround = $('.moreSurround');

            /**
             * 点击周边配套省略内容中的更多按钮
             */
            $lessSurround.find('a').on('click', function () {
                $lessSurround.hide();
                $moreSurround.show();
            });

            /**
             * 点击周边配套完整内容中的收起按钮
             */
            $moreSurround.find('a').on('click', function () {
                $lessSurround.show();
                $moreSurround.hide();
            });
        }
        // !!!作用不详，找不到节点
        $('.more.elemore').bind('click', function () {
            $(this).hide();
            $(this).parent().find('.elemore1').hide();
            $(this).parent().find('.elemore2').show();
        });
        // 楼盘图片轮播
        require.async('swipe/3.10/swiper', function (Swiper) {
            Swiper('#slider', {
                speed: 500,
                onSlideChangeStart: function (swiper) {
                    $('#pageIndex').text(swiper.activeIndex + 1);
                }
            });
        });
        // 根据经纪人id是否存在设置储存
        if ($agentID.length) {
            var agentImg = $('#agent_img').attr('src');
            var xiaoqu = $('#xiaoqu').html() || '';
            var room = $('#room').html() || '';
            var price = $('#price').html() || '';
            var rtype = $('#rtype').html() || '';
            var uname = $agentID.html();
            var enzhcity = $('#enzhcity').html();
            var zhname = $('#zhname').html();
            // 公寓房传这个参数
            var pst = vars.isGY || '';
            $chatBtn.attr('data-chat', enzhcity + ',' + vars.city + ',zf,' + vars.houseid
                + ',' + vars.plotid + ',chat,' + vars.phone + ',waphouseinfo,'
                + vars.username + ',' + zhname + ',' + vars.agentid + ',' + vars.house_order);
            $chatBtn.removeAttr('href');
            if (zhname && vars.localStorage) {
                vars.localStorage.setItem(uname, encodeURIComponent(zhname) + ';' + agentImg + ';'
                    + encodeURIComponent(xiaoqu + '的' + room + '价格为' + price + '的'
                        + rtype) + ';' + vars.mainSite + 'agent/' + vars.city + '/' + vars.agentid + '.html');
            }
            if (!uname && vars.localStorage) {
                vars.localStorage.setItem(zhname + '_allInfo', encodeURIComponent(vars.title) + ';' + encodeURIComponent(vars.price)
                    + ';' + encodeURIComponent(vars.tags.replace(/(\s*$)/g, '')) + ';'
                    + vars.titleimg + ';' + encodeURIComponent(vars.room_hall_price) + ';'
                    + encodeURIComponent(vars.district_name + '-' + vars.projname) + ';' + vars.zfSite
                    + vars.city + '/' + vars.housetype + '_' + vars.houseid + '.html');
            }
            if (vars.localStorage) {
                vars.localStorage.setItem(uname + '_allInfo', encodeURIComponent(vars.title) + ';'
                    + encodeURIComponent(vars.price) + ';' + encodeURIComponent(vars.tags.replace(/(\s*$)/g, ''))
                    + ';' + vars.titleimg + ';' + encodeURIComponent(vars.room_hall_price) + ';'
                    + encodeURIComponent(vars.district_name + '-' + vars.projname) + ';' + vars.zfSite
                    + vars.city + '/' + vars.housetype + '_' + vars.houseid + '.html');
            }
        }

        // 获取定位坐标，如果存在则设置显示定位导航
        if (getCookie('geolocation_x') && getCookie('geolocation_y') && getCookie('encity') === vars.city) {
            // 如果存在定位则显示路线导航按钮
            $('#drivedaohang').show();
        }
        // wap端点对点打开app
        if (!isTizen) {
            require.async('app/1.0.0/appdownload.js', function ($) {
                $('.down-btn-c').openApp({position: 'zfDetail'});
            });
        } else {
            $('.down-btn-c').hide();
        }

        // 记录行为，并记录日志
        var clickPayDataCollect = function (type) {
            require.async(location.protocol + '//static.soufunimg.com/esf/esf/online/secondhouse/old/secondhouse/image/esfnew/'
                + 'scripts/ClickPayCount/ClickPayDataCollect.js', function () {
                var sPage = 1;
                // 判断南北方
                vars.ns = vars.ns === 'n' ? 'Y' : 'N';
                vars.imei = vars.imei || '';
                var channel = vars.isshare === 'share' ? 1 : 0;
                var cpdc = new ClickPayDataCollect(encodeURIComponent(vars.cityname), vars.ns, type, vars.agentid
                    , vars.houseid, encodeURIComponent(document.referrer), 2, sPage, vars.imei, '', channel
                    , vars.listtype, vars.listsub);
                setTimeout(cpdc.writeLog(), 1000);
            });
        };
        if (vars['housetype'].indexOf('AGT') > -1) {
            // 判断 jsub的js是否已加载,如果已加载,直接调用,如果未加载, 等加载后调用.
            if (typeof window._ub !== 'undefined') {
                clickPayDataCollect('cz');
            } else {
                require.async(['jsub/_ubm.js'], function () {
                    clickPayDataCollect('cz');
                });
            }
        }
        // 判断是否已经收藏了该楼盘
        var roomID = '';
        if (vars.roomid) {
            roomID = vars.roomid;
        }
        // 调用后台判断是否收藏了该楼盘
        // 添加是否登陆判断,在未登陆情况下不请求收藏数据 liuxinlu 20160905
       

        var LeaseStyle = '';
        var houseID = vars.houseid;

        /**
         * 点击收藏
         */
        var canSave = true;
        $collectBtn.on('click', function () {
            yhxw({type: 21, pageId: pageId});
            if (vars.rtype_tempparam_name) {
                LeaseStyle = vars.rtype_tempparam_name;
            }
            if (vars.roomid) {
                houseID = vars.roomid;
            }
            // 调用收藏接口
            if(canSave){
                canSave = false;
                $.ajax({
                    timeout: 3000,
                    url: vars.mySite + '?c=mycenter&a=ajaxAddMySelectOfFangYuan&city='
                    + vars.city + '&houseid=' + houseID + '&housetype=' + vars.housetype
                    + '&LeaseStyle=' + LeaseStyle + '&channel=rent&groupid=' + vars.groupid
                    + '&agentid=' + vars.agentid,
                    success: function (data) {
                        if (data.userid) {
                            if (data.myselectid) {
                                showCollectTips('添加收藏成功');
                                $collectBtn.addClass('btn-faved cur');
                            } else {
                                showCollectTips('已取消收藏');
                                $collectBtn.removeClass('btn-faved cur');
                            }
                        } else {
                            // 登录地址修改 20160905 lina
                            window.location.href = location.protocol + '//m.fang.com/passport/login.aspx?burl='
                                + encodeURIComponent(window.location.href) + '&r=' + Math.random();

                        }
                        canSave = true;
                    },
                    error: function () {
                        showCollectTips('出错了');
                        canSave = true;
                    }
                });
            }

        });
        // 展开收起
        $('.xqIntroBox').find('a[class *="more_xq"]').on('click', function (e) {
            var aEl = e.target;
            if ($(aEl).hasClass('up')) {
                $(aEl).removeClass('up');
                $(aEl).prev('div').removeClass('all');
            } else {
                $(aEl).addClass('up');
                $(aEl).prev('div').addClass('all');
            }
        });

        // 点击头部导航按钮  20161012 租房改版，兼容过期房源页头部 lina
        var iconNav = $('.icon-nav'),
            header = $('.header');
        if (header.hasClass('expire')) {
            iconNav.on('click', function () {
                if ($('.main').is(':visible')) {
                    header.css('position', 'fixed');
                }
                header.show();
            });
        }
        // 处理详情页没有图片的情况
        var xqfocus = $('.xqfocus');
        var nav = $('#nav');
        var newheader = $('#newheader');
        iconNav.on('click', function () {
            newheader.css('opacity', '1');
            if (!xqfocus.length && nav.is(':hidden')) {
                newheader.css('position', 'fixed');
                $('.floatTel').show();
            }
        });

        /**
         * 向下滑动时相关效果
         * 页面滑动未超过200px时，页面向上滑动元导航慢慢消失，新导航逐渐显示，页面向下滑动，原导航逐渐显示，新导航消失。滑动页面滚动超过200px时新导航固定顶部。
         *
         */
        function scrollFun() {
            // 详情页初始导航
            this.detailNav = $('.focus-opt').find('a');
            // 月面滑动显示导航
            this.headerNav = $('.header');
            // 初始导航与页面滚动时显示导航切换的滚动总距离
            this.maxLen = 200;
            // 导航开始切换距离
            this.cLen = 150;
            this.init = function () {
                var that = this;
                $(window).on('scroll', function () {
                    // 过期房源页   20161012 租房改版，兼容过期房源页头部 lina
                    if ($('.header').hasClass('expire')) {
                        return false;
                    }
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

        //详情页无图时，顶部浮层处理
        if($(window).scrollTop() === 0 && $('#newheader').is(':visible') && vars.havePic === '0'){
            $('#newheader').css('position','relative');
        }

        /*------------公寓详情js---------------------------start---------*/
        if (vars.isFlatHouse) {
            //图案内容展开收起
            $('.xq-ptList').find('a[class *="more_xq"]').on('click', function (e) {
                var aEl = e.target;
                if ($(aEl).hasClass('up')) {
                    $(aEl).removeClass('up');
                    $(aEl).prev('ul').find("li[class *='hidestyle']").hide();
                } else {
                    $(aEl).addClass('up');
                    $(aEl).prev('ul').find("li[class *='hidestyle']").show();
                }
            });

            //文字内容是否显示展开按钮
            $('.IntroN').each(function () {
                var allHeight = 0;
                $(this).children('p').each(function () {
                    allHeight += parseInt($(this).css('height'));
                });
                if (allHeight <= parseInt($(this).css('max-height'))) {
                    $(this).next('.more_xq').hide();
                }
            });

            //文字内容展开收起
            $('.introBoxN').find('a[class *="more_xq"]').on('click', function (e) {
                var aEl = e.target;
                if ($(aEl).hasClass('up')) {
                    $(aEl).removeClass('up');
                    $(aEl).prev('div').css('max-height', '112px');
                } else {
                    $(aEl).addClass('up');
                    $(aEl).prev('div').css('max-height', '');
                }
            });

            //猜你喜欢
            if ($('#favlist_swiper').length > 0) {
                var allwidth = 0;
                var that = $('#favlist_swiper');
                that.find('li').each(function () {
                    allwidth += parseInt($(this).css('width')) + 20;
                });
                that.find('ul').css('width', allwidth);
                var favlist_scrollObj = new iscrollNew('#favlist_swiper',{
                    scrollX: true,
                    scrollY: false,
                    preventDefault: true,
                    click:true,
                    bounce:true,
                    taps:true
                });
            }
        }

        /*------------公寓详情js--------------------------end----------*/
        // 最下面的导航-------------------------------------------------satrt
            //swipe滑动事件
            var Swiper = require('swipe/3.10/swiper');
            var seoTab = $('.tabNav');
            if (seoTab.find('a').length > 0) {
                // 添加底部SEO  
                var setScroll = $('.typeListB:first');
                var $bottonDiv = $('#bottonDiv');
                var $typeList = $('.typeListB');
                //初始化展示第一个 
                setScroll.show();
                $bottonDiv.find('a').eq(0).addClass('active');
                
                //标签点击事件
                $bottonDiv.on('click', 'a', function () {
                    var $this = $(this);
                    $bottonDiv.find('a').removeClass('active');
                    $this.addClass('active');
                    $typeList.hide();
                    $('.' + $this.attr('id')).show();
                    if (!$this.attr('canSwiper')) {
                        $this.attr('canSwiper', true);
                        addSwiper($this);
                    }
                });
                var addSwiper = function (a) {
                    new Swiper('.' + a.attr('id'), {
                        speed: 500,
                        loop: false,
                        onSlideChangeStart: function (swiper) {
                            var $span = $('.' + a.attr('id')).find('.pointBox span');
                            $span.removeClass('cur').eq(swiper.activeIndex).addClass('cur');
                        }   
                    });
                };
                addSwiper($("#" + $('#bottonDiv a').eq(0).attr('id')));
            }
            // 最下面的导航-------------------------------------------------end



        // 搜房app中不加载导航相关效果
        if (!vars.issfapp && vars.havePic && parseInt(vars.havePic) !== 0) {
            new scrollFun();
        }

        // 是否显示展开按钮
        $('.xqIntro').each(function () {
            var allHeight = 0;
            $(this).children('p').each(function () {
                allHeight += parseInt($(this).css('height'));
            });
            if (allHeight <= parseInt($(this).css('max-height'))) {
                $(this).next('.more_xq').hide();
            }
        });


        // 经纪人弹框
        if (vars.housetype === 'JHAGT' || vars.housetype === 'JHWAGT' || vars.housetype === 'JHJP') {
            var $conBox = $('.conbox');
            // jJr列表滑动
            $('#jjrList').find('ul').css({'height':'100%','z-index':'9999','overflow':'auto'});
            var winHeight = $(window).height() * 0.668;
            var $content = $('#content');
            var liHeight = 76;
            var liLen = $content.find('li').length;
            var ulHeight = liHeight * liLen;
            if(ulHeight < winHeight){
                winHeight = ulHeight + 20;
                if(liLen === 1){
                    $conBox.css('top','30%');
                }else if(liLen === 2 || liLen === 3){
                    $conBox.css('top','25%');
                }


            }

            $('#jjrList').css({
                'height': winHeight + 'px',
                'width':'100%',
                'position':'relative',
                'overflow':'hidden'
            });
            var scrollObj = new iscrollNew('#jjrList',{
                scrollY: true,
                preventDefault: false,
                click:true,
                preventDefaultException: { tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|A)$/ },
                taps:true
            });
            //经纪人按钮点击
            if (vars.housetype !== 'JHDS' && vars.housetype !== 'JHDSHZ') {
                $(".jjrclick").click(function(){
                    $('.Chjjropen').show();
                    scrollObj.refresh();
                    unable();
                });
            }
            //经纪人弹框关闭按钮
            var $jjrclose = $('.jjrclose');
            $jjrclose.css({width:'50px',height:'24px',backgroundPosition:'right'});
            $jjrclose.eq(0).on('click',function(){
                $('.Chjjropen').hide();
                enable();
            });
            // 点击在线咨询跳转到咨询界面
            $('.mes').on('touchstart', function () {
                var data = $(this).attr('data-chat');
                var dataArr = data.split(',');
                if (vars.localStorage) {
                    vars.localStorage.setItem(dataArr[8] + '_allInfo', encodeURIComponent(vars.title) + ';'
                        + encodeURIComponent(vars.price) + ';' + encodeURIComponent(vars.tags.replace(/(\s*$)/g, ''))
                        + ';' + vars.titleimg + ';' + encodeURIComponent(vars.room_hall_price) + ';'
                        + encodeURIComponent(vars.district_name + '-' + vars.projname) + ';' + vars.zfSite
                        + vars.city + '/' + vars.housetype + '_' + vars.houseid + '_' + vars.groupid + '_' + vars.agentid + '.html');
                }
                chat.apply(this, dataArr);
            });
            // 分页样式
            var dragBox = $('#drag');

            if (dragBox.length > 0) {
                   setTimeout(function(){
                        var total = parseInt($('#total').html());
                        require.async('loadMore/1.0.0/loadMore', function (loadMore) {
                            loadMore({
                                url: vars.zfSite + '?c=zf&a=ajaxGetMoreAgentList&city=' + vars.city + '&groupid=' + vars.groupid + '&newcode=' + vars.projcode + '&houseid=' + vars.houseid + '&agentid=' + vars.agentid,
                                total: total,
                                pagesize: 20,
                                pageNumber: 10,
                                contentID: '#content',
                                moreBtnID: '#drag',
                                loadPromptID: '#loading',
                                isScroll:true,
                                firstDragFlag:false,
                                callback:function(){
                                    scrollObj.refresh();
                                }
                            });
                        });
                    },200);
            }
        }



        //经纪人分享活动（20171107-20171117）
        if ((vars.housetype == 'AGT' || vars.housetype == 'WAGT') && vars.isshare === 'share') {
            //new iscrollNew('.sharewarp', {scrollY: true});
            $('#sharehd').on('click', function () {
                $('.x-share-bg').show();
                $('.x-share-out').show();
            });
            $('.x-share-close').on('click', function () {
                $('.x-share-bg').hide();
                $('.x-share-out').hide();
            });

            if (UA.indexOf('iphone') > -1 || UA.indexOf('ios') > -1) {
                $('.btn-lq').css('display', 'block');
                $('.erweima').css('display', 'none');
                $('#contentshow').text('');
            } else {
                $('.btn-lq').css('display', 'none');
                $('.erweima').css('display', 'block');
                $('#contentshow').text('扫描二维码下载房APP参与');
            }

            var shareSwiper = new Swiper('#sharehdswp', {
                autoplay: 2000,//可选选项，自动滑动
                loop: true,
                direction: 'vertical',
                autoplayDisableOnInteraction: false,
                observer: true,
                observeParents: true,
            });
        }
        // 房源描述修改（WAGT和AGT用新样式）
        if ($('.more_xq').hasClass('classification')) {
            var el = $(this);
            var morebutt = el.siblings('.more_xq');
            var pHeight = parseInt(el.children('div').height());
            var maxHeight = parseInt(el.css('max-height'));
            if (pHeight > maxHeight) {
                morebutt.show();
            }
            // 房源描述模块的唯一标识
            var fymsList = $('.fymsList'),
            // 房源描述中每个小标题中段落之和
                sumfyms = 0,
            // 默认展示的最大行数之和的总高度
                defaultULHeight = parseInt(fymsList.find('p').css('line-height')) * 10,
            // 默认需要展示的小标题的个数
                linum = 0,
            // h3小标题的高度
                h3Height = parseInt(fymsList.find('h3').css('height')) + parseInt(fymsList.find('h3').css('margin-bottom')),
            // li的padding高度
                LiPaddingTop = parseInt(fymsList.find('li').css('padding-bottom'));

            // 获取每个p的实际高度
            fymsList.find('li').each(function () {
                var that = $(this);
                // 看看最多展示几个
                if (sumfyms < defaultULHeight) {
                    linum += 1;
                }
                // 所有p的高度之和
                sumfyms += parseInt(that.css('height'));
            });
            // 所有p之和与默认高度对比，如果大于，则要先合上
            if (sumfyms > defaultULHeight) {
                fymsList.find('a').css('display', 'block');
                fymsList.find('ul').css({'max-height': (h3Height + LiPaddingTop) * linum + defaultULHeight, 'overflow': 'hidden'});
            }
            // 如果有展开合上的按钮，则要实现展开合上的功能
            fymsList.children('a').on('click', function () {
                var that = $(this);
                if (that.hasClass('up')) {
                    that.removeClass('up');
                    fymsList.find('ul').css({'max-height': (h3Height + LiPaddingTop) * linum + defaultULHeight, 'overflow': 'hidden'});
                } else {
                    that.addClass('up');
                    fymsList.find('ul').css({'max-height': '', 'overflow': ''});
                }
            });
        }
        // 租房同小区曝光率统计
        if (vars.zftxqbg) {
            $.ajax({
                type: 'post',
                url: window.location.protocol + '//esfbg.3g.fang.com/topzftxqbg.htm',
                data: vars.zftxqbg
            });
        }

        // 租房同价位曝光率统计
        if (vars.zftjwbg) {
            $.ajax({
                type: 'post',
                url: window.location.protocol + '//esfbg.3g.fang.com/topzftjwbg.htm',
                data: vars.zftjwbg
            });
        }
    };
});
