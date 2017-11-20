/**
 * @file 家居16期-建材
 * @author 袁辉辉yuanhuihui@soufun.com)
 */
define('modules/jiaju/buildCate', ['jquery'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var myLocal = vars.localStorage;
        $('input[type=hidden]').each(function (index, element) {
            vars[$(this).attr('data-id')] = element.value;
        });

        var pageTitle = $('#pagetitle'), tabNav = $('.tabNav');
        var mainCate = tabNav.find('a[data-type=1]');
        var furniture = tabNav.find('a[data-type=5]');
        var build = $('#build');
        var jjBuild = $('#jjbuild');
        var activeClass = 'active';
        var container = $('#getHeight');
        var search = $('input[type=search]');
        var searchBtn = $('#searchBtn');
        var nav = $('nav'), mainContainer = $('#mainContainer');

        /* 历史搜索、热门搜索*/
        var nearContainer = $('#nearContainer');
        var hotContainer = $('#hotContainer');
        var nearSearchList = $('#nearSearchList');
        var hotSearchList = $('#hotSearchList');
        var clearHistoryBtn = $('#clearHistory');
        var refreshHotBtn = $('#refreshHot');

        var footer = $('footer');

        /* 热搜页数*/
        var page = 1, pageSize = 10;

        /* 控制界面上图片高度统一:有时由于加载pare为空，保存起来*/
        var savedPare = 0;

        /* 当前是否已是弹出标识*/
        var pop = false;

        /* 1-4:主材；5-9：家具*/
        var jjType = 1;

        function zPresentation() {

            var sheight = document.body.clientHeight;
            document.querySelector('#getHeight').style.minHeight = sheight - 115 + 'px';

            // 为右侧图像设置的
            var ppre = document.querySelectorAll('.jj .sf-RList dd img');
            var pareDom = document.querySelector('.jj .sf-RList dd .center div');
            savedPare = pareDom.offsetWidth || savedPare;
            var pare = savedPare;
            var wid, hei, s;

            for (var padd = 0; padd < ppre.length; padd++) {
                wid = ppre[padd].offsetWidth;
                hei = ppre[padd].offsetHeight;
                s = (wid - hei) / 2;
                if (ppre[padd].offsetWidth - ppre[padd].offsetHeight < 0) {
                    ppre[padd].style.height = pare + 'px';
                    ppre[padd].style.width = 'auto';
                    continue;
                }
                ppre[padd].parentNode.style.paddingTop = s + 'px';
                ppre[padd].parentNode.style.paddingBottom = s + 'px';
            }
        }

        function doShow(isPop) {
            if (isPop) {
                mainContainer.hide();
                nav.hide();
                footer.addClass('fixed');
                search.prop('readonly', false);
                search.blur();
            } else {
                mainContainer.show();
                nav.show();
                footer.removeClass('fixed');
                nearContainer.hide();
                hotContainer.hide();
                search.prop('readonly', true);
            }
            pop = isPop;
        }

        /* 搜索假跳*/
        var leftMenuLocation, leftClass, pageTiltle;

        function changeAsPop(isPop) {
            pop = isPop;
            var leftMenu = $('.left').find('a');
            leftMenuLocation = leftMenuLocation || leftMenu.attr('href');
            leftClass = leftClass || leftMenu.attr('class');
            pageTiltle = pageTiltle || pageTitle.text();
            if (isPop) {
                leftMenu.attr('href', '#');
                leftMenu.off('click');
                leftMenu.on('click', function () {
                    leftMenu.attr('class', leftClass);
                    leftMenu.attr('href', leftMenuLocation);
                    leftMenu.off('click');
                    doShow();
                    footer.show();
                    // href本次不跳转
                    return false;
                });

                // 改为左尖括号
                leftMenu.attr('class', 'back');
                if (!leftMenu.children().length) {
                    leftMenu.append($('<i></i>'));
                }
                footer.hide();
                doShow(true);
            } else {
                leftMenu.off('click');
                leftMenu.attr('class', leftClass);
                leftMenu.attr('href', leftMenuLocation);
                doShow();
                footer.show();
            }
        }

        function setNavState(type) {
            jjType = type;

            /* 小于5表示主材*/
            if (type < 5) {
                mainCate.addClass(activeClass);
                furniture.removeClass(activeClass);
                build.show();
                jjBuild.hide();
                pageTitle.find('span').text('买主材');
            } else {
                mainCate.removeClass(activeClass);
                furniture.addClass(activeClass);
                build.hide();
                jjBuild.show();
                pageTitle.find('span').text('买家具');
            }

            /* 右侧图片列表*/
            var ejListDetails = $('.sf-RList');
            $.each(ejListDetails, function (index, itemP) {
                var item = $(itemP);
                if (item.attr('data-id') !== type) {
                    item.hide();
                } else {
                    item.show();
                }
            });

            /* 左侧导航栏*/
            var nowAct = $('.sf-LList .active');
            var shouldAct = $('.sf-LList a[data-type=' + type + ']'), shouldLi = shouldAct.parent();
            if (!shouldLi.hasClass(activeClass)) {
                nowAct.removeClass(activeClass);
                shouldLi.addClass(activeClass);
            }
        }

        // needLength:需要长度；wordRestrict： 词长度限制
        // 历史搜索需要显示最新十个长度不大于15的关键词
        function packHtml(datas, needLength, wordRestrict) {
            var html = '<a href="javascript:void(0);"><span class="searchListName">xyxyxyxyxyxyFlag</span></a>';
            var len = datas.length, temp = [], tempStr, i = 0;
            for (; i < len; i++) {
                tempStr = typeof datas[i] === 'object' ? datas[i].KeyWord : datas[i];
                if (wordRestrict && tempStr.length > wordRestrict) {
                    continue;
                }
                tempStr = html.replace('xyxyxyxyxyxyFlag', tempStr);
                temp.push(tempStr);

                // 限制最近搜索十个
                if (needLength && temp.length == needLength) {
                    break;
                }
            }
            return temp.join('');
        }

        function stripscript(s) {
            if (s) {
                return s.replace(/[\<\>\(\)\;\{\}\"\'\[\]\/\@\!\,]/g, '');
            }
            else {
                return '';
            }
        }

        var hisLocalStorage = vars.city + 'JiajuSearchLocal', hisList;

        function doSearch(urlP) {
            var keywords = search.val();
            keywords = stripscript(keywords);
            keywords = keywords.replace(/(^\s+)|(\s+$)/g, '');

            if (keywords && myLocal) {

                hisList = myLocal.getItem(hisLocalStorage) ? JSON.parse(myLocal.getItem(hisLocalStorage)) : [];
                var sIndex = $.inArray(keywords, hisList);
                if (sIndex === -1) {
                    hisList.unshift(keywords);
                }
                myLocal.setItem(hisLocalStorage, '["' + hisList.join('","') + '"]');
            }
            var url;
            if (jjType < 5) {
                url = urlP || '?c=jiaju&a=buildList&q=' + encodeURIComponent(keywords) + '&city=' + vars.city + '&r=' + Math.random();
            } else {
                url = urlP || '?c=jiaju&a=jjList&q=' + encodeURIComponent(keywords) + '&city=' + vars.city + '&r=' + Math.random();
            }
            window.location = url;

            //  置空本次搜索内容
            search.val('');
        }

        function addClick(dom) {
            if (!dom) {
                return;
            }
            dom.off('click', 'a');
            dom.on('click', 'a', function () {
                var th = $(this);
                search.val(th.find('span').text());
                search.css('color', 'black');
                setTimeout(function () {
                    doSearch();
                }, 500);
            });
        }

        function clearHistory() {
            myLocal && myLocal.removeItem(hisLocalStorage);
            hisList = [];
        }

        function closeList() {
            nearSearchList.empty();
            nearContainer.hide();
        }

        function getHistory() {
            var local;
            if (myLocal && myLocal.getItem(hisLocalStorage)) {
                local = myLocal.getItem(hisLocalStorage);
            }
            hisList = local ? JSON.parse(local) : [];
            nearSearchList.empty();
            var s;
            if ($.isArray(hisList) && hisList.length && (s = packHtml(hisList, 10, 15)).length > 1) {
                nearSearchList.append(s);
                addClick(nearSearchList);
                nearContainer.show();
            } else {
                closeList();
            }
        }

        /* 加锁处理重复点击*/
        var hotLock = false;

        /* 热搜数据*/
        function getHot(pageP) {
            if (hotLock) {
                return;
            }
            hotLock = true;
            page = pageP || 1;
            $.ajax({
                url: vars.jiajuSite,
                data: {
                    c: 'jiaju',
                    a: 'ajaxHotSearch',
                    Page: page,
                    Pagesize: pageSize
                },
                type: 'GET',
                success: function (data) {
                    var length;
                    if (data && data.Item && (length = data.Item.length) > 0) {
                        var s = packHtml(data.Item);
                        hotSearchList.empty().append(s);
                        addClick(hotSearchList);
                        hotContainer.show();

                        /* 数据数小于pageSize说明下页无数据了*/
                        if (length < pageSize) {
                            page = 0;
                        }
                    } else {
                        page = 0;
                    }
                    hotLock = false;
                }
            });
        }

        /* 加锁处理重复点击*/
        var lock = false;

        function getDataByType(type) {
            var ejListDetail = $('.sf-RList[data-id=' + type + ']');
            if (!ejListDetail.length) {
                if (lock) {
                    return;
                }
                lock = true;
                $.ajax({
                    url: vars.jiajuSite + '?c=jiaju&a=ajaxBuildCate&city=' + vars.city,
                    data: {
                        type: type
                    },
                    type: 'GET',
                    success: function (data) {
                        container.append($(data));
                        setNavState(type);

                        /* 等图片加载完再调整图片大小*/
                        var imgs = $('.sf-RList[data-id=' + type + '] img'), length = imgs.length;
                        imgs.load(function () {
                            if (!--length) {
                                zPresentation();
                            }
                        });
                        lock = false;
                    }
                });
            }
            if (!lock) {
                setNavState(type);
                zPresentation();
            }
        }

        function searchQ() {
            changeAsPop(true);
            getHistory();
            getHot();
        }

        /* 不加在ready了,太慢*/
        setNavState(vars.type);

        /* 初始化页面状态*/
        $(function () {
            footer.addClass('left0 bottom0 wp100');
            zPresentation();

            /* 绑定事件*/
            var ejList = $('.sf-LList li');
            ejList.on('click', function () {
                var $this = $(this), type = $this.find('a').attr('data-type');
                var active = $('.sf-LList .active');
                active.removeClass(activeClass);
                $this.addClass(activeClass);
                getDataByType(type);
            });

            mainCate.on('click', function () {
                var $this = $(this), type = $this.attr('data-type');
                getDataByType(type);
            });

            furniture.on('click', function () {
                var $this = $(this), type = $this.attr('data-type');
                getDataByType(type);
            });

            search.on('click', function () {
                if (!pop) {
                    searchQ();
                }
            });

            /* 1、位置跳转 2、记录历史 */
            searchBtn.on('click', function () {
                doSearch();
            });

            clearHistoryBtn.on('click', function () {
                clearHistory();
                getHistory();
            });

            refreshHotBtn.on('click', function () {
                getHot(++page);
            });

            // 光标颜色为蓝色
            search.css('color', 'blue');

            // 支持键盘搜索
            search.on('keyup', function (e) {
                if (e.keyCode == 13) {
                    doSearch();
                }
            }).on('input', function () {
                var $this = $(this), color = $this.css('color');
                if (!$this.val() && color !== 'rgb(0, 0, 255)') {
                    $this.css('color', 'blue');
                } else {
                    $this.css('color', 'black');
                }
            });
        });


    };
});
