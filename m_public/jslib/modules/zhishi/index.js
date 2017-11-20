/**
 * Created by fang on 2015/10/8.
 * 优化了图片加载，分水平和竖直两种形式分别调用lazyload @update yueyanlei
 */
define('modules/zhishi/index', ['jquery', 'lazyload/1.9.1/lazyload', 'loadMore/1.0.0/loadMore',
    'modules/zhishi/zhishibuma'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        // jquery库
        var $ = require('jquery');
        require('lazyload/1.9.1/lazyload');
        // 页面传入的参数
        var vars = seajs.data.vars;

        var knowList = $('.know-list').on('click', 'li', function () {
            $(this).addClass('visited');
        });
        // 图片惰性加载
        knowList.find('img').lazyload({event: 'scroll click'});
        // 用户行为对象
        var zhishibuma = require('modules/zhishi/zhishibuma');
        // 布码
        zhishibuma({zscategory: encodeURIComponent(vars.jtnames), pageType: 'mzshomepage'});
        // 加载更多
        var loadMore = require('loadMore/1.0.0/loadMore');

        /**
         * 猜你喜欢公共方法
         * @param kw 要传的关键词
         */
        var getCaiNiXiHuan = function (kw) {
            var page = 1;
            $.get(vars.zhishiSite + '?c=zhishi&a=ajaxXflike&keywords=' + kw + '&page=' + page + '&jtname=' + vars.jtname, function (data) {
                if (data) {
                    $('#topic').after(data);
                    // 加载更多
                    $('input[type = hidden]').each(function (index, element) {
                        vars[$(this).attr('data-id')] = element.value;
                    });
                    $('#love').find('img').lazyload({event: 'scroll click'});
                    if (vars.count <= 10) {
                        $('.more-list').hide();
                    } else {
                        loadMore({
                            url: vars.zhishiSite + '?c=zhishi&a=ajaxXflike&keywords=' + kw + '&jtname=' + vars.jtname,
                            total: vars.count,
                            pagesize: 6,
                            pageNumber: 6,
                            moreBtnID: '.more-list',
                            loadPromptID: '.more-list',
                            contentID: '#xihuan',
                            loadAgoTxt: '点击加载更多',
                            loadingTxt: '正在加载...',
                            loadedTxt: '点击加载更多',
                            firstDragFlag: false,
                            // 是否需要上拉加载更多功能即是否需要scroll事件监听，可为空，默认为true
                            isScroll: false
                        });
                    }
                }
            });

        };

        /**
         * 倒序排列数组
         * @param array 要排序的数组
         * @param key 要排序的字段
         * @returns array
         */
        function rSortByKey(array, key) {
            return array.sort(function (a, b) {
                var x = a[key];
                var y = b[key];
                return x > y ? -1 : x === y ? 0 : 1;
            });
        }

        /**
         * 新房的猜你喜欢获取关键词
         * @param keyListStr 从localstorage获取的字符串
         * @returns string
         */
        var getXfKW = function (keyListStr) {
            var keywords = '';
            if (vars.localStorage && keyListStr) {
                // 得到localstorage的关键词列表
                var kwArr = keyListStr.split(',');
                var exLen = kwArr.length - 15;
                // 如果小于等于三个词，则不进行排序
                if (exLen <= -12) {
                    return kwArr.join(',');
                }
                // 如果超过15个词，则截取只要15个
                if (exLen > 0) {
                    kwArr = kwArr.slice(exLen);
                }
                // 用来计算与当前这个元素相同的个数
                var count = 1;
                var jsonArr = [];
                for (var a = 0; a < kwArr.length; a++) {
                    for (var b = a + 1; b < kwArr.length; b++) {
                        if (kwArr[a] === kwArr[b]) {
                            count++;
                            // 没找到一个相同的元素，就要把它移除掉
                            kwArr.splice(b, 1);
                            b--;
                        }
                    }
                    // 这个数组用来存储每个关键词，以及出现的次数
                    var tmpArr = [];
                    tmpArr['k'] = kwArr[a];
                    tmpArr['v'] = count;
                    // console.log(tmpArr);
                    // 放进大数组
                    jsonArr.push(tmpArr);
                    // 再将count重新赋值，进入下一个元素的判断
                    count = 1;
                }
                var sortArr = rSortByKey(jsonArr, 'v');
                keywords = sortArr[0]['k'] + ',' + sortArr[1]['k'] + ',' + sortArr[2]['k'];
            }
            return keywords;
        };

        // 猜你喜欢(xf,esf,jiaju,zf)
        var keyListStr = vars.localStorage.getItem(vars.jtname + 'TagsKey');
        var keywords = '';
        if(keyListStr && keyListStr.split(',')[0] !== ''){
            keywords = getXfKW(keyListStr);
        }
        // console.log(keywords);
        getCaiNiXiHuan(keywords);
        // 点击分类弹出一级分类(zhangcongfeng@fang.com)
        var moreDiv = $('.more-nav');
        $('.n13').on('click', function () {
            moreDiv.toggle();
        });
        // 热门知识分页
        $('.switch').on('click', '.change', function () {
            var $that = $(this).parent().parent();
            var maxNum = 3;
            var ulAll = $that.find('ul');
            var ulNow = ulAll.filter(function () {
                return $(this).css('display') !== 'none';
            });
            ulNow.hide();
            if (ulNow.index() < maxNum) {
                ulNow.next().show();
            } else {
                ulAll.eq(0).show();
            }
        });

        // 解决专题图片高度浏览器不兼容问题
        var height = $(window).width() / 2 + 'px';
        var mySwipe = $('#mySwipe');

        mySwipe.find('img').height(height);
        mySwipe.find('li').height(height);
        mySwipe.height(height);
        require.async('swipe/3.10/swiper', function (Swiper) {
            new Swiper('#mySwipe', {
                direction: 'horizontal',
                autoplay: 3000,
                loop: true,
                observer: true,
                observeParents: true,
                lazyLoading: true
            });
        });
    };
});

