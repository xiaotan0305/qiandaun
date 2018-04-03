/**
 * 大首页入口类---合作首页
 * by tankunpeng
 * 20161028 tankunpeng 合作页面与常规大首页分开
 */
define('modules/index/coop', ['jquery', 'util/util', 'modules/index/locate', 'swipe/3.3.1/swiper', 'lazyload/1.9.1/lazyload', 'iscroll/2.0.0/iscroll-lite', 'search/mainSearch', 'search/home/homeSearch'],
    function (require) {
        'use strict';
        // jquery库
        var $ = require('jquery');
        // 大首页搜索类
        var Search = require('search/home/homeSearch');
        // 通用工具集
        var Util = require('util/util');
        // 实现定位用的js实例，！！！这个js现在返回的是一个对象，也就是说Locate是一个对象而不是一个类
        var Locate = require('modules/index/locate');
        // swiper滚动插件类
        var Swiper = require('swipe/3.3.1/swiper');
        // 获取滑动插件类
        require('iscroll/2.0.0/iscroll-lite');
        // 图片惰性加载jquery插件
        require('lazyload/1.9.1/lazyload');
        var $window = $(window);
        // 回到顶部
        // 判断是否加载显示回顶按钮
        $window.on('scroll.back', function () {
            var scrollTop = $window.scrollTop();
            if (scrollTop > $window.height() / 2) {
                require.async(['backtop/1.0.0/backtop'], function (backTop) {
                    backTop();
                    $('#wapesfsy_D04_01').attr('id', 'wapdsy_D13_01');
                });
                $window.off('scroll.back');
            }
        });
        // 页面最下部分登录、注册按钮，在未登录才显示
        var $loginAndRegBtn = $('.sfutHref');
        // 获取页面传入参数
        var vars = seajs.data.vars;
        // 是否为小米黄页合作页面
        var isMiuiYP = false;
        // 是否为三星的泰泽系统
        var isTizen = false;
        // for循环索引使用
        var i = 0;
        // 一些没有模块化的js合并加载数组
        var preload = [];
        // 获取浏览器ua
        var UA = navigator.userAgent.toLowerCase();
        var whref = window.location.href;

        // 判断是否为小米黄页
        if (UA.indexOf('miuiyellowpage') > -1) {
            isMiuiYP = true;
        }
        // 如果是小米黄页
        if (isMiuiYP) {
            // 判断当前页面地址不是动态地址时，跳转到小米黄页专有地址
            if (whref.indexOf('.html') > -1 && whref.indexOf('main.d?m=main') === -1) {
                window.location.href = vars.mainSite + 'main.d?m=main&city=' + vars.city + '&sf_source=bd_xiaomihy';
            }
        }
        // 是否为三星tizen系统，！！！暂时不上正式所以注释掉了
        if (UA.indexOf('tizen') > -1) {
            isTizen = true;
        }
        // 尝试判断是否为无痕模式，如果是无痕模式则放弃所有localstorage操作将vars.localStorage置于空
        if (!vars.localStorage) {
            vars.localStorage = window.localStorage;
            try {
                vars.localStorage.setItem('testPrivateModel', false);
            } catch (d) {
                vars.localStorage = null;
            }
        }
        // 获取页面后台传入的数据
        $('input[type=hidden]').each(function () {
            var $this = $(this);
            vars[$this.attr('data-id')] = $this.val();
        });
        // 大首页大搜索执行初始化
        var search = new Search();
        search.init();
        // 执行一些不需要new声明的模块化js

        // 异步加载一些非模块化的js
        // miuiYellowPage实现小米黄页的特殊功能
        // _ubm.js用户行为分析js
        preload.push('miuiYellowPage/miuiYellowPage', vars.public + 'js/20141106.js');
        // 判断当不是凤凰合作页或者不是小米黄页时
        if (vars.sf_source !== 'ifeng_bd' || !isMiuiYP) {
            // 引入app下载功能js
            preload.push('app/1.0.0/appdownload');
        }
        require.async(preload);
        // 判断用户是否登录，如果已经登录，隐藏登录和注册入口，否则展示
        if (Util.getCookie('sfut')) {
            $loginAndRegBtn.hide();
        }


        // 执行首页频道图标分屏
        // 6 : 图标四屏为固定值,需要提前为父级设置宽度(新版swiper 不需要设置)

        var swiperIndex = null,
            topBox = $('#top'),
            swiperEnter = null;
        if (topBox.length) {
            swiperEnter = new Swiper('#top', {
                speed: 500,
                autoplayDisableOnInteraction: false,
                loop: false,
                pagination: '#pointBox',
                paginationElement: 'span',
                bulletActiveClass: 'cur',
                onTap: function (swiper) {
                    Util.setCookie('swiperIndex', swiper.activeIndex, 0.02);
                }
            });

            // 初始化页面
            swiperIndex = Util.getCookie('swiperIndex');
            if (swiperIndex) {
                swiperEnter.slideTo(swiperIndex);
            }
        }

        /**
         * 找小区入口
         * @type {any}
         */
        var xiaoquIco = $('.n17');
        vars.getPosSuc = function (json) {
            xiaoquIco.attr('href', vars.mainSite + 'fangjia/' + vars.city + '_list_pinggu/?x1=' + json.x + '&y1=' + json.y + '&distance=5&from=tjxq');
        };

      

        /**
         * 新房统计
         * ！！！这里的统计作用是监听点击猜你喜欢用的
         * @param id 楼盘id
         */
        function xfTongjiUserlike(id) {
            $.ajax({url: '/data.d?m=houseinfotj&type=click&housefrom=ad&city=bj&housetype=xf&newcode=' + id + '&channel=wapindex_userlike'});
        }

        /**
         * 首页统计代码
         * ！！！这里的统计是监听点击猜你喜欢和黄金眼的
         * @param urlOrOther
         * @param type
         * @param channel
         * @param order
         * @param housetype
         * @param url
         */
        function indexTongJi(urlOrOther, type, channel, order, housetype, url) {
            // ！！！猜测下面一大串都是统计里面必须传的参数，而且为空的时候必须穿null
            var version = null,
                connMode = null,
                company = null,
                imei = Util.getCookie('global_cookie'),
                posMode = null,
                os = null,
                product = 'wap',
                // phone = null,！！！根本没有用到，我注释了
                agentid = null,
                userinfo = Util.getCookie('passport'),
                userid = null;
            if (userinfo) {
                // 如果存在用户信息，此信息是通过获取cookie的passport值得到的
                // 进行URI解码
                userinfo = decodeURIComponent(userinfo);
                // 通过userinfo的第一个带&分割符的字符串的带=分割符的第二个字符串的值，赋值userid
                userid = userinfo.split('&')[0].split('=')[1];
            }
            if (housetype === '') {
                // 如果housetype为空字符要把它设置为null
                housetype = null;
            }
            // 将所有的参数拼接为一个以';;'为分割符的字符串,！！！这里我有一个疑问，为什么要把null传过去，而无法传空，或者说我直接传undefined不行吗？
            var param = UA + ';;' + urlOrOther + ';;' + type + ';;' + channel + ';;'
                + order + ';;' + housetype + ';;' + version + ';;' + posMode + ';;' + connMode
                + ';;' + company + ';;' + imei + ';;' + Locate.ispos + ';;' + os + ';;' + product + ';;'
                + agentid + ';;' + userid;
            // 调用统计接口，！！！这里要特别注意，mrCity不能被city代替，接口需要的城市中，石家庄city为shijiazhuang但是mrCity为sjz，东莞city为东莞但是mrCity为dg
            $.get('/main.d?m=indexTj', {param: param, city: vars.mrCity}, function () {
                if (housetype === 'zf' && isMiuiYP) {
                    // 判断楼盘为租房并且是小米黄页时，url加上相关参数，！！！由于murl和vars.mainSite只差了一个/，完全可以由mainStie代替
                    url = vars.mainSite + 'zf/' + vars.city + '/';
                }

                /**
                 * 黄金眼增加流量统计(channel === index_activity)  参数规则：ctm=a.b.c.d.e
                 *  a：wap端为2；
                 *  b：城市缩写；
                 *  c：页面简称，由需求方指定 dsy 大首页简称；
                 *  d：模块简称，由需求方指定 hjy 黄金眼简称；
                 *  e：模块内链接按顺序自动获取，1,2,3,…..； ----对应order
                 */
                if (channel === 'index_activity') {
                    window.location = url + (/&|\?/.test(url) ? '&' : '?') + 'ctm=2.' + vars.mrCity + '.dsy.hjy.' + order;
                } else {
                    window.location = url;
                }
            });
        }

        // 列表切换
        var channelTab = $('.secTab_hz .flexbox a'),
            houseList = $('.houseList');

        // 通过用户行为分析获取，新房、二手房和租房的相关权证
        require.async('jsub/_vb.js?c=mhomepage');
        // 通过用户行为分析获取，新房、二手房和租房的相关权证
        require.async('jsub/_ubm.js', function () {
            _ub.city = vars.zhcity;
            _ub.request('vmg.business', true);
            // 用户分析函数

            /**
             * 大数据分析
             * 猜你喜欢
             * 导航-知识入口
             * 地图入口
             * vmn.position : 新房区域商圈
             * vmn.subway : 新房地铁
             * vmn.genre : 新房物业类型
             * vme.position: 二手房区域商圈
             * vme.subway: 二手房地铁
             * vme.housetype : 二手房户型
             * vmz.position : 租房区域商圈
             * vmz.subway: 租房地铁
             * vmz.housetype: 租房户型
             * vmg.business: 用户行为 返回值代表的业务线：
             返回值     业务线
             G     通用
             N     新房
             E     二手房
             Z     租房
             H     家居
             X     小区网
             V     评估网
             W     国际网
             F     产业网
             L     土地网
             B     论坛
             A     问答
             K     知识
             I     资讯
             0     OA
             */
            _ub.onload = function () {

                seajs.emit('cacheData');

                /**
                 * 猜你喜欢
                 */
                    // 获取新房搜索历史记录中的第一条（关键字或者快筛词），返回带有关键字或者快筛词和快筛词以及两者的搜索时间戳
                var rule = search.getRules(vars.city + 'newXfHistory');
                var xfScores = _ub.values['vmg.business'].N,
                    esfScores = _ub.values['vmg.business'].E,
                    zfScores = _ub.values['vmg.business'].Z;

                /**
                 * 首页猜你喜欢访问数据埋码
                 */
                _ub.city = vars.zhcity;
                _ub.biz = 'g';
                _ub.location = vars.ublocation;
                _ub.collect(1, {
                    'vmg.usertype': xfScores + '^' + esfScores + '^' + zfScores,
                    'vmg.page': 'mhomepage'
                });

                _ub.request('vmg.business,vmn.position,vmn.genre,vme.position,vme.housetype,vmz.housetype,vmz.position', function () {
                    _ub.load(1);
                    var business = _ub['vmg.business'];
                    var xfXQ = _ub['vmn.position'],
                        xfWY = _ub['vmn.genre'],
                        esfQYSQ = _ub['vme.position'],
                        esfHX = _ub['vme.housetype'],
                        zfHX = _ub['vmz.housetype'],
                        zfQYSQ = _ub['vmz.position'];
                    // 取猜你喜欢ajax数据,前端展示数据
                    var ajaxData = $.extend({
                        xfXQ: xfXQ,
                        xfWY: xfWY,
                        esfQYSQ: esfQYSQ,
                        esfHX: esfHX,
                        zfHX: zfHX,
                        zfQYSQ: zfQYSQ,
                        xfScores: xfScores,
                        esfScores: esfScores,
                        zfScores: zfScores,
                        city: vars.mrCity
                    }, rule);
                    // 获取列表
                    var xfList = $('#xfList'),
                        esfList = $('#esfList'),
                        zfList = $('#zfList');
                    // 事件委托方式监听点击猜你喜欢各单条数据时的操作
                    xfList.add(esfList).add(zfList).on('click', 'a', function () {
                        var params = $(this).attr('data-params').split(';');
                        // 猜你喜欢点击统计
                        xfTongjiUserlike(params[0]);
                        // 首页点击统计
                        indexTongJi.apply(this, params);
                    });
                    var arr = [xfScores, esfScores, zfScores];
                    var index = arr.indexOf(Math.max.apply(Math, arr));
                    // 新房
                    ajaxData.coType = 'xf';
                    $.get('/main.d?m=xiHuanLouPanList', ajaxData, function (result) {
                        if (result) {
                            // 将获取的html字符串赋值给容器
                            xfList.html(result);
                            // 执行lazyload
                            xfList.find('img.likeLazyload').lazyload();
                        }
                    });
                    // 二手房
                    ajaxData.coType = 'esf';
                    $.get('/main.d?m=xiHuanLouPanList', ajaxData, function (result) {
                        if (result) {
                            // 将获取的html字符串赋值给容器
                            esfList.html(result);
                            // 执行lazyload
                            esfList.find('img.likeLazyload').lazyload();
                        }
                    });

                    // 租房
                    ajaxData.coType = 'zf';
                    $.get('/main.d?m=xiHuanLouPanList', ajaxData, function (result) {
                        if (result) {
                            // 将获取的html字符串赋值给容器
                            zfList.html(result);
                            // 执行lazyload
                            zfList.find('img.likeLazyload').lazyload();
                        }
                    });

                    /**
                     * 导航-知识入口
                     */
                        // 业务线映射关系
                    var businessObj = {
                            N: 'xf',
                            E: 'esf',
                            Z: 'zf',
                            H: 'jiaju'
                        };

                    // 判断业务线中是否为新房\二手房\租房\家居中一个,否则默认为新房
                    if (!/^(N|E|Z|H)$/.test(business.toUpperCase())) {
                        business = 'N';
                    }
                    var zhishiIco = $('.n29');
                    zhishiIco.add($('.zhishimore')).attr('href', vars.mainSite + 'zhishi/' + businessObj[business] + '/');

                    /**
                     * 地图入口
                     */

                    // http://m.test.fang.com/map/?c=map&a=zfMap&city=bj

                    // 判断业务线中是否为新房\二手房\租房\家居中一个,否则默认为新房
                    if (!/^(N|E|Z)$/.test(business.toUpperCase())) {
                        business = 'N';
                    }

                    var mapBtn = $('.mapbtn');
                    mapBtn = mapBtn.add('.n10');
                    if (mapBtn.length > 0) {
                        // 地图目前不兼容https,目前先写死成http
                        var url;
                        if (location.protocol.indexOf('https') !== -1) {
                            url = vars.mainSite.replace('https', 'http') + 'map/?c=map&a=' + businessObj[business] + 'Map&city=' + vars.city;
                        } else {
                            url = vars.mainSite + 'map/?c=map&a=' + businessObj[business] + 'Map&city=' + vars.city;
                        }
                        mapBtn.attr('href', url);
                    }
                });
            };
        });
        // 获取当前地址
        var lh = whref,
            lhl = lh.toLowerCase();
        // 多重判断，如果一条成立，则设置cookie值clientdownshow_index为1
        // 为三星泰泽系统
        // ！！！为vivo合作
        // 通过客户端跳转
        // 是UC浏览器
        // 是qq浏览器
        // ！！！是客户端首页
        // ！！！是fwc合作
        // 是tg合作
        // 是百度app打开
        // 客户端打开并且produce值为soufun
        if (isTizen || lhl.indexOf('sf_source=bd_vivo_mz') > -1 || lh.indexOf('src=client') > -1 || lhl.indexOf('ucbrowser') > -1
            || lhl.indexOf('qqbrowser') > -1 || lhl.indexOf('clientindex.jsp') > -1 || lhl.indexOf('sf_source=fwc') > -1
            || lhl.indexOf('sf_source=tg') > -1 || lhl.indexOf('client') > -1 && vars.produce === 'soufun') {
            Util.setCookie(vars.cd_ver, '1');
        }
        // 脚本统计
        // 本期 上线32个城市
        // 360合作页首 统计规则 城市 + hz sf_source=360browser  地址：
        // 百度合作首页 统计规则 城市 + bd sf_source=baiduwz
        // uc合作首页 统计规则 城市 + uc sf_source=ucbrowser
        // 欧朋合作首页 统计规则 城市 + op sf_source=oupengbrowser
        // qq合作首页 统计规则 城市 + qq sf_source=qqbrowser
        var arr = vars.hzTjCity && JSON.parse(vars.hzTjCity) || [],
            len = arr.length;
        if (len) {
            require.async('//clickm.fang.com/click/new/clickm.js', function () {
                for (var j = 0; j < len; j++) {
                    if (arr[j] === vars.city) {
                        Clickstat.eventAdd(window, 'load', function () {
                            // 百度浏览器合作首页
                            if (whref.indexOf('sf_source=baiduwz') !== -1) {
                                Clickstat.batchEvent('wapdsy_', vars.city + 'bd');
                                // 360合作首页
                            } else if (whref.indexOf('sf_source=360browser') !== -1) {
                                Clickstat.batchEvent('wapdsy_', vars.city + 'hz');
                                // uc合作首页
                            }else if (whref.indexOf('sf_source=ucbrowser') !== -1) {
                                Clickstat.batchEvent('wapdsy_', vars.city + 'uc');
                                // 欧朋合作首页
                            }else if (whref.indexOf('sf_source=oupengbrowser') !== -1) {
                                Clickstat.batchEvent('wapdsy_', vars.city + 'op');
                                // qq合作首页
                            }else if (whref.indexOf('sf_source=qqbrowser') !== -1) {
                                Clickstat.batchEvent('wapdsy_', vars.city + 'qq');
                            }
                        });
                    }
                }
            });
        }


        // 获取localStorage中的home_private_custom数据，如果存在，则执行统计
        var commonStr = vars.localStorage && vars.localStorage.getItem(vars.city + 'home_private_custom');
        if (commonStr) {
            // 执行统计
            $.post('/tongji.d?m=indexTongji', {city: vars.city, str: commonStr});
        }

        // 房天下推荐
        var guide = $('#guide'),
            dataNum = guide.attr('data-num') | 0;
        if (dataNum > 1) {
            new Swiper('#guide', {
                speed: 800,
                autoplay: 3000,
                loop: true,
                direction: 'vertical'
            });
        }
        // 这里的判断明显有问题，不知道是干什么用的
        if (vars.sf_source !== 'ifeng_bd' || !isMiuiYP) {
            require.async('app/1.0.0/appdownload', function () {
                $('.appDown').add('.fangApp .linkbox').openApp('/clientindex.jsp?city=' + vars.city + '&flag=download&f=1256');
                $('.b-sf').openApp('/clientindex.jsp?city=' + vars.city + '&flag=download&f=1114');
                $('#appJifen').openApp('/clientindex.jsp?city=' + vars.city + '&flag=download&f=1113');
                $('#acLoadHz').openApp('/clientindex.jsp?city=' + vars.city + '&flag=download&f=1258');
                $('#jdh').openApp({
                    position: 'hezuoTopBtn'
                });
                // 小城市顶部下载按钮
                $('#headerTop .icon-down').openApp({
                    position: 'indexTopBtn'
                });
            });
        }

        // 换一换 换一批
        // 获取自定义列表容器实例
        var $customList = $('#customList');
        // 事件委托方式，点击换一换按钮操作
        $customList.on('click', '.huanhuan', function () {
            var $this = $(this),
                $parent = $this.closest('section'),
                $thisLi = $parent.children('ul').find('li'),
                liLength = $thisLi.length,
                count = 0;
            // 所有具有换一换功能的列表默认显示5条数据
            var flagNum = 5;
            // 房产知识、房产资讯、房产问答显示三条数据
            switch ($parent.attr('id')) {
                case 'zhishiList':
                case 'newsList':
                case 'askList':
                    // 大城市房产知识、房产资讯、房产问答显示3条数据，小城市显示5条
                    flagNum = vars.numFlag ? 3 : 5;
                    break;
            }
            // 判断是否含有data-count，如果不存在则为第一次点击换一换，设置count为1
            if ($this.attr('data-count')) {
                count = parseInt($this.attr('data-count'));
            } else {
                count++;
                $this.attr('data-count', count);
            }

            /**
             * 循环遍历所有在当前列表内容中的li节点，判断要换的一组li并显示，隐藏其他li
             * by tankunpeng 2016/11/09 修改当前显示li的下一个隐藏li为for循环开始位置,解决最后一个换一换页面点击下滑问题
             */
            for (i = count * flagNum; i < liLength + count * flagNum; i++) {
                var $li = $thisLi.eq(i % liLength);
                // 当li的索引大于切换次数乘以一次显示的基数，并且小于下一次切换次数乘以显示基数时显示，否者隐藏
                if (i % liLength >= count * flagNum && i % liLength < (count + 1) * flagNum) {
                    $li.show();
                } else {
                    $li.hide();
                }
            }
            var img = $thisLi.find('img[data-original]:visible');
            img.lazyload();
            count++;
            // 如果总数量大于了最大的数据条数，则重置
            if (count * flagNum >= liLength) {
                count = 0;
            }
            $this.attr('data-count', count);
        });

        // 如果是合作页，并且带有bd标识，！！！猜测为百度合作
        // if (vars.sf_source && vars.ifContains) {
        //     // 加载轻应用相关的js
        //     $('head').append('<script type="text/javascript" name="baidu-tc-cerfication"  data-appid="5282730" src="http://apps.bdimg.com/cloudaapi/lightapp.js"></script>');
        // }
        // 尽量直接先加载
        $('img.lazyload').lazyload();
        // 列表切换
        channelTab.on('click', function () {
            var $this = $(this),
                index = $this.index();
            var toList = houseList.eq(index);
            $this.addClass('active').siblings().removeClass('active');
            houseList.not(toList).hide();
            toList.show();
            toList.find('img.likeLazyload').lazyload();
        });


    });