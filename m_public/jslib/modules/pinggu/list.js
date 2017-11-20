/**
 * @file js合并，ESLint
 * @author fcwang(wangfengchao@soufun.com)
 */
define('modules/pinggu/list',['jquery','lazyload/1.9.1/lazyload','swipe/3.10/swiper','loadMore/1.0.0/loadMore','iscroll/2.0.0/iscroll-lite',
    'slideFilterBox/1.0.0/slideFilterBox'],function (require,exports,module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var LoadMore = require('loadMore/1.0.0/loadMore');
        //更换小区列表页惰性加载时的默认图片
        var settings = {
            placeholder: "data:image/gif;base64,R0lGODlh1ACgAMQAALq8w9jZ3NDS1czO0sbIzeXl5sHEydTV2LW3v+Hh4re5wcDCyL7Ax93d3+np6dfY287Q1MXHzMfJzt7e4OPk5f///7O2vqGlsKuuuOjo6LCzvKaqtNvc3uDg4sPFyufn5yH/C1hNUCBEYXRhWE1QPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS41LWMwMjEgNzkuMTU1NzcyLCAyMDE0LzAxLzEzLTE5OjQ0OjAwICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOkExMzlGREZBQ0EzNDExRTRCNzlDODQzNUI4MUZGRjI1IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjEwMzVEMTdBMDg1RTExRTc5M0Y3RjAzRTJCMzU5MkE1IiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjEwMzVEMTc5MDg1RTExRTc5M0Y3RjAzRTJCMzU5MkE1IiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE0IChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MjI1OGFiYzYtMTdjMC00OTNmLWI0MzEtMzY0MmY1OGUxZGI4IiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6Zjdk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"
        }
        require('lazyload/1.9.1/lazyload');
        $('.lazyload').lazyload(settings);
        var iscrollCtrl = require('slideFilterBox/1.0.0/slideFilterBox');
        // 筛选框的包裹层
        var wrapper = $('#tabSX');
        // 浮层
        var tabFloat = $('#tabFloat');
        // 区域二级弹框
        var comareaParam = $('.comarea_param');
        // 区域一级弹框外层
        var districtParamW = $('#district_param');
        // 商圈section
        var business = $('#business');
        //swipe滑动事件
        var Swiper = require('swipe/3.10/swiper');
        /**
         *阻止浏览器默认事件
         * @param e 浏览器默认事件
         */
        function preventDefault(e) {
            e.preventDefault();
        }

        /**
         * 阻止页面滑动
         */
        function showDiv() {
            document.addEventListener('touchmove',preventDefault);
        }

        /**
         * 恢复页面滑动
         */
        function closeDiv() {
            document.removeEventListener('touchmove',preventDefault);
        }
        // 展开商圈
        function showComarea(id) {
            $('#district_param_' + id).addClass('active').siblings().removeClass('active');
            business.show();
            comareaParam.hide();
            $('#comarea_param_' + id).show();
            iscrollCtrl.refresh('#business');
            iscrollCtrl.to('#business',0);
        }
        // 展开商圈
        districtParamW.on('click','a',function () {
            var id = $(this).data('id');
            if (id !== undefined) {
                showComarea(id);
            }
        });
        // 点击切换筛选框
        var selectWrap = $('#selectWrap');
        var filterBox = selectWrap.find('div');

        /**
         * 选中元素定位函数
         * param index 当前选中项的位置
         * param wrapperId包裹层id
         */
        function scroll(index,wrapperId) {
            var wrapperSec = $('#' + wrapperId);
            var height = wrapperSec.height();
            var total = wrapperSec.find('dl').filter(function () {
                return $(this).css('display') !== 'none';
            }).find('dd').length;
            // 44:每一个dd标签的高度
            var tail = total *  44 - height;
            // 如果当前列表超出可视范围才滚动
            if (tail > 0) {
                // 选中项及后面的所有选项总高度小于可视高度时,滚动距离为tail,防止滚动太上
                if ((total - index) * 44 > height) {
                    iscrollCtrl.to('#' + wrapperId, -(index - 1) * 44);
                }else {
                    iscrollCtrl.to('#' + wrapperId, -tail);
                }
            }
        }
        selectWrap.on('click','ul>li',function () {
            var $that = $(this);
            var current = filterBox.eq($that.index());
            var wrapSection = current.find('section');
            var sectionId = $(wrapSection.get(0)).attr('id');
            $that.toggleClass('active').siblings().removeClass('active');
            if (current.css('display') === 'none') {
                filterBox.hide();
                wrapper.addClass('tabSX');
                current.show();
                tabFloat.show();
                showDiv();
                iscrollCtrl.refresh('#' + sectionId);
                switch (sectionId) {
                    case 'country':
                        if (vars.district) {
                            business.show();
                            // 展开对应区域
                            var areaNow = $('#district_param_' + vars.district);
                            var num1 = areaNow.index();
                            areaNow.addClass('active').siblings().removeClass('active');
                            scroll(num1,'country');
                            // 展开对应商圈
                            var comareaParam = $('#comarea_param_' + vars.district);
                            comareaParam.show();
                            iscrollCtrl.refresh('#business');
                            if (vars.comarea) {
                                var businessNow = $('#comarea_id_' + vars.comarea);
                                var num2 = businessNow.index();
                                businessNow.addClass('active');
                                scroll(num2,'business');
                            }else {
                                comareaParam.find('dd:first').addClass('active');
                            }
                        }else {
                            $('#district_param_').addClass('active');
                        }
                        break;
                    case 'priceSec':
                        if (vars.price) {
                            var priceNow = $('#price_id_' + vars.price);
                            var num = priceNow.index();
                            priceNow.addClass('active');
                            scroll(num,'priceSec');
                        }else {
                            current.find('dd:first').addClass('active');
                        }
                        break;
                    case 'paixuSec':
                        if (vars.orderby) {
                            var paixuNow = $('#paixu_id_' + vars.orderby);
                            paixuNow.addClass('active');
                        }else {
                            current.find('dd:first').addClass('active');
                        }
                        break;
                }
            } else {
                current.hide();
                tabFloat.hide();
                wrapper.removeClass('tabSX');
                closeDiv();
            }
        });
        // 点击浮层
        tabFloat.on('click',function () {
            filterBox.hide();
            tabFloat.hide();
            wrapper.removeClass('tabSX');
            selectWrap.find('ul li').removeClass('active');
            closeDiv();
        });
        // 加载更多
        LoadMore({
            url: vars.pingguSite + '?c=pinggu&a=ajaxGetList&city=' + vars.city + '&price=' + vars.price + '&district=' + vars.district
            + '&comarea=' + vars.comarea + '&orderby=' + vars.orderby + '&keyword=' + vars.keyword + '&x1=' + vars.x1 + '&y1=' + vars.y1 + '&distance=' + vars.distance + '&from=' + vars.from,
            total: vars.total,
            pagesize: vars.pagesize,
            pageNumber: 10,
            page: 'p',
            moreBtnID: '#drag',
            loadPromptID: '#drag',
            contentID: '#more_add',
            loadAgoTxt: '<span>上拉自动加载更多</span>',
            loadingTxt: '<span><i></i>正在加载请稍后</span>',
            loadedTxt: '<span>上拉自动加载更多</span>',
            firstDragFlag: false,
            lazyCon: '.lazyload',
            lazyPlaceHolder: "data:image/gif;base64,R0lGODlh1ACgAMQAALq8w9jZ3NDS1czO0sbIzeXl5sHEydTV2LW3v+Hh4re5wcDCyL7Ax93d3+np6dfY287Q1MXHzMfJzt7e4OPk5f///7O2vqGlsKuuuOjo6LCzvKaqtNvc3uDg4sPFyufn5yH/C1hNUCBEYXRhWE1QPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS41LWMwMjEgNzkuMTU1NzcyLCAyMDE0LzAxLzEzLTE5OjQ0OjAwICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOkExMzlGREZBQ0EzNDExRTRCNzlDODQzNUI4MUZGRjI1IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjEwMzVEMTdBMDg1RTExRTc5M0Y3RjAzRTJCMzU5MkE1IiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjEwMzVEMTc5MDg1RTExRTc5M0Y3RjAzRTJCMzU5MkE1IiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE0IChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MjI1OGFiYzYtMTdjMC00OTNmLWI0MzEtMzY0MmY1OGUxZGI4IiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6Zjdk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"
        });

        // 用户行为统计
        require.async('jsub/_vb.js?c=mcfjlist');
        require.async('jsub/_ubm.js?v=201407181100',function () {
            // 所在城市（中文）
            _ub.city = vars.cityname;
            // 新房的页面值为 'n'、二手房为 'e'、租房为 'z'、注意房贷计算器页此处值为g
            // 新房“n”，二手房e，租房n，查房价v,家居h，资讯i,知识k
            _ub.biz = 'v';
            // 方位 ，网通为0，电信为1，如果无法获取方位，记录0
            _ub.location = vars.ns === 'n' ? 0 : 1;
            // b值 1：搜索
            var b = 1;
            // 区域或'不限'
            var district = $('#district_param_' + vars.district).find('a').text();
            // 商圈或'区域'
            var comarea = $('#district span').html();
            // 区域传入格式:区县^商圈，间隔符号不编码
            var comyh = encodeURI(district) + '^' + (vars.comarea ? encodeURI(comarea) : '');
            var priceyh = $('#price span').html();
            var orderyh = $('#orderby span').html();
            var searchyh = $('#S_searchtext').text();
            if (comarea === '区域') {
                comyh = 'undefined';
            }
            if (priceyh === '价格') {
                priceyh = 'undefined';
            } else if (priceyh === '10000元以下') {
                priceyh = '0-1000';
            } else if (priceyh === '50000元以上') {
                priceyh = '50000-99999';
            } else {
                priceyh = priceyh.substring(0,priceyh.length);
            }
            if (orderyh === '排序') {
                orderyh = 'undefined';
            }
            if (searchyh === '楼盘名/地名/开发商等') {
                searchyh = 'undefined';
            }
            var pTemp = {
                'vmv.key': encodeURI(searchyh),
                'vmg.page': 'mcfjlist',
                'vmv.position': comyh,
                'vmv.unitprice': encodeURI(priceyh),
                'vmv.order': encodeURI(orderyh)
            };
            var p = {};
            for (var temp in pTemp) {
                if (pTemp[temp] && pTemp[temp] !== 'undefined') {
                    p[temp] = pTemp[temp];
                }
            }
            _ub.collect(b,p);
        });

        // 最下面的导航-------------------------------------------------satrt
        var seoTab = $('.tabNav');
        if (seoTab.find('a').length > 0) {
            //底部第一个id
            var firstId = $('#bottonDiv a').eq(0).attr('id');
            // 添加底部SEO  
            var setScroll = $('.typeListB:first');
            var $bottonDiv = $('#bottonDiv');
            var $typeList = $('.typeListB');
            //初始化展示第一个 
            $('.' + firstId).show();
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
            addSwiper($("#" + firstId));
        }
        // 最下面的导航-------------------------------------------------end


    };
});