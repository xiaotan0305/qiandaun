/**
 * @file js合并，ESLint
 * @author fcwang(wangfengchao@soufun.com)
 */
/**
 * @file chafangjia revision
 * @author zcf(zhangcongfeng@fang.com)
 * 附近小区定位,热门区县加载更多
 * 20151207 blue 修改swipe插件改为3.10版本，修改柱状图和走势图循环复制出来的节点初始化函数,删除无用的js
 */
define('modules/pinggu/index',
    ['modules/world/yhxw', 'jquery', 'footprint/1.0.0/footprint', 'swipe/3.10/swiper', 'chart/raf/1.0.0/raf', 'chart/histogram/1.0.1/histogram',
        'chart/line/1.0.3/line', 'lazyload/1.9.1/lazyload', 'iscroll/2.0.0/iscroll-lite', 'modules/map/API/BMap'],
    function (require, exports, module) {
        'use strict';
        module.exports = function () {
            var $ = require('jquery');
            var vars = seajs.data.vars;
            var IScroll = require('iscroll/2.0.0/iscroll-lite');
            // 包裹层id
            var evaluate = $('#evaluate');
            // 选择朝向id
            var orientation = $('#orientation');
            // 朝向弹框
            var selectDiv = $('#selectDiv');
            // 楼层数
            var louceng = $('#louceng');
            // 总楼层数
            var zonglouceng = $('#zonglouceng');
            //swipecha插件
            var Swiper = require('swipe/3.10/swiper');
            // 记录点击id
            var type = '';
            // 加载更多选项id
            var obj = {};
            var poper = $('.sf-bdmenu .con section');
            // 显示 弹出div
            var selectDivUl = selectDiv.find('ul');

            var moreLi = $('#horizontalBar li.hotDisMore');
            var hotmore = $('#hotmore');
            // 定位坐标
            var locationpoint = null;
            //flagchose解决选择浮层下也会被点击的bug
            var flagchose = true;
            //如果链接地址含有&s=bdfj 则将区县排行展开，并滚动到顶部
            var qxcjList = $('.qxcj');
            if ((window.location.href.indexOf('s=bdfj') > -1) && qxcjList.length > 0) {
                var mTop = qxcjList.offset().top;
                setTimeout(function() {
                    window.scrollTo(0,mTop);
                },100);
                // document.body.scrollTop = mTop + 40;

                moreLi.show();
                hotmore.addClass('up');
            }
            // 引入用户行为分析对象-埋码
            var yhxw = require('modules/world/yhxw');
            var maimaParams = {
                'vmg.page': 'cfj_cfj^sy_wap'
            };
            yhxw({
                pageId: 'cfj_cfj^sy_wap',
                params: maimaParams
            });
            // ajax获取广告
            $.ajax({
                url: vars.pingguSite + '?c=pinggu&a=ajaxGetAd',
                success: function (data) {
                    if (data.ad2) {
                        var ad = $('#ad2');
                        ad.show();
                        ad.append(data.ad2);
                    }
                    if (data.ad1) {
                        var ad1 = $('#ad1');
                        ad1.show();
                        ad1.append(data.ad1);
                        adScroll();
                    }
                }
            });
            var $searchtext = $('#CFJ_searchtext');
            var $body = $('body');
            if($searchtext.length){
                $searchtext.on('click',function(){
                    var bodyTop = $body.scrollTop();
                    vars.localStorage.setItem('top',bodyTop);
                });
            }
            // 广告轮播图
            function adScroll() {
                var $ad = $('.banShow');
                // var $wrap = $ad.find('.swiper-wrapper');
                var $slides = $ad.find('.swiper-slide');
                var length = $slides.length;
                var $points = $ad.find('.pointBox').find('span');
                if (length > 1) {
                    // $wrap.css('width', parseInt($ad.css('width'), 10) * (length + (length < 2 ? 0 : 2)));
                    $slides.show();
                    Swiper('.banShow', {
                        // 切换速度
                        speed: 500,
                        // 自动切换间隔
                        autoplay: 3000,
                        // 交互后是否自动切换
                        autoplayDisableOnInteraction: false,
                        // 循环
                        loop: true,
                        onSlideChangeStart: function (swiper) {
                            $points.eq((swiper.activeIndex + length - 1) % length).addClass('cur').siblings().removeClass('cur');
                        }
                    });
                }
            }

            // 选择小区search
            require.async('search/cfj/xiaoquSearch', function (xiaoquSearch) {
                var XiaoquSearch = new xiaoquSearch();
                XiaoquSearch.init();
            });
            // 禁止事件默认行为
            function preventDefault(e) {
                // @20151229 blue 删除多余代码
                e.preventDefault();
            }

            /**
             * 阻止页面滑动
             */
            function showDiv() {
                document.addEventListener('touchmove', preventDefault);
            }

            /**
             * 恢复页面滑动
             */
            function closeDiv() {
                document.removeEventListener('touchmove', preventDefault);
            }

            // 图片加载用lazyload
            require('lazyload/1.9.1/lazyload');
            $('.lazyload').lazyload();
            if (vars.trendChart) {
                // 显示走势图的城市才进行以下操作
                var Swiper = require('swipe/3.10/swiper');
                var Histogram = require('chart/histogram/1.0.1/histogram');
                var Line = require('chart/line/1.0.3/line');
                var swiper = null;
                var touchSlide = $('#touchSlide');
                var winW = $('.main').width();
                var lineWrapper = $('#touchSlide li:eq(0)');
                var histogramWrapper = $('#touchSlide li:eq(1)');
                var imgResize = function () {
                    if (swiper) {
                        touchSlide.find('ul').width(winW * swiper.slides.length);
                    }
                };

                // 画图新房 二手房的房价走势图
                // 判断是否有滑动
                var flag = '';
                var curveW, curveW2;
                $.ajax({
                    type: 'get',
                    url: vars.pingguSite + '?c=pinggu&a=ajaxGetIndexDraw&city=' + vars.city + '&topnum=6',
                    success: function (data) {
                        if (data && data !== 'error') {
                            flag = 'undefined' !== typeof data.flag ? data.flag : '';
                            if (flag === '1') {
                                lineWrapper.show();
                                histogramWrapper.show();
                                curveW = $('#line').width();
                                curveW2 = $('#histogram').width();
                                swiper = Swiper('#touchSlide', {
                                    speed: 500,
                                    autoplay: 3000,
                                    autoplayDisableOnInteraction: false,
                                    loop: true,
                                    wrapperClass: 'blueW',
                                    slideClass: 'blueS',
                                    pagination: '.sf-slideP',
                                    paginationElement: 'span',
                                    bulletActiveClass: 'cru'
                                });
                                imgResize();
                            }
                            if (data.xfArr || data.esfArr) {
                                if (!swiper) {
                                    lineWrapper.show();
                                    curveW = $('#line').width();
                                }
                                $('.sf-slideP').show();
                                var lineArr = [], line1 = {}, line2 = {};
                                if ('undefined' !== typeof data.xfArr && data.xfArr) {
                                    line2 = {lineColor: '#ff6666', pointColor: '#ff6666', data: data.xfArr};
                                    lineArr.push(line2);
                                } else {
                                    $('#touchSlide div.listReco').html('<i class="f90"></i>二手房');
                                }
                                if ('undefined' !== typeof data.esfArr && data.esfArr) {
                                    line1 = {lineColor: '#FF9900', pointColor: '#FF9900', data: data.esfArr};
                                    lineArr.push(line1);
                                } else {
                                    $('#touchSlide div.listReco').html('<i class="f66"></i>新房');
                                }
                                if (lineArr.length > 0) {
                                    var l = new Line({
                                        textColor: '#999',
                                        w: curveW,
                                        h: 175,
                                        lineArr: lineArr
                                    });
                                    l.run();
                                    // @20151207 blue 这里因为先声明的滑动轮播插件，要在滑动轮播插件复制出来的柱状图节点上重新初始化柱状图数据
                                    if (swiper) {
                                        l = new Line({
                                            textColor: '#999',
                                            w: curveW,
                                            h: 175,
                                            lineArr: lineArr,
                                            id: $(swiper.slides[3]).find('.cfjChart div')[0]
                                        });
                                        l.run();
                                    }
                                }
                            } else {
                                lineWrapper.hide();
                                $('.sf-slideP').hide();
                            }

                            // 获取城市区域的房价涨跌榜
                            if (data.disArr) {
                                if (!swiper) {
                                    histogramWrapper.show();
                                    curveW2 = $('#histogram').width();
                                }
                                var disprice = data.disArr;
                                var len = disprice.length;
                                for (var i = len - 1; i > 0; i--) {
                                    var v = disprice[i];
                                    if (v.value === '') {
                                        disprice.splice(i, 1);
                                    }
                                }
                                var s = new Histogram({width: curveW2, height: 200, data: disprice});
                                s.run();
                                // @20151207 blue 这里因为先声明的滑动轮播插件，要在滑动轮播插件复制出来的柱状图节点上重新初始化柱状图数据
                                if (swiper) {
                                    s = new Histogram({
                                        width: curveW2,
                                        height: 200,
                                        id: $(swiper.slides[2]).find('.histogram div')[0],
                                        data: disprice
                                    });
                                    s.run();
                                }
                            } else {
                                histogramWrapper.hide();
                            }
                        } else {
                            touchSlide.parent().hide();
                        }
                    }
                });
            }
            // 热门区县的向下箭头显示更多
            hotmore.on('click', function () {
                if (moreLi.css('display') === 'none') {
                    moreLi.show();
                    hotmore.addClass('up');
                } else {
                    moreLi.hide();
                    hotmore.removeClass('up');
                }
            });

            /**
             * 初始化弹框内容
             */
            function initBox() {
                selectDivUl.html('');
                var liStr = '';
                switch (type) {
                    case 'orientation':
                        liStr += '<li id="wappinggusy_D03_03">东</li><li id="wappinggusy_D03_03">南</li><li id="wappinggusy_D03_03">西</li><li id="wappinggusy_D03_03">北</li><li id="wappinggusy_D03_03">东南</li><li id="wappinggusy_D03_03">西南</li><li id="wappinggusy_D03_03">东北</li><li id="wappinggusy_D03_03">西北</li><li id="wappinggusy_D03_03">南北</li><li id="wappinggusy_D03_03">东西</li>';
                        break;
                    case 'fTime':
                        liStr += '<li id="wappinggusy_D03_07">一年以内</li><li id="wappinggusy_D03_07">二年以内</li><li id="wappinggusy_D03_07">三～五年</li><li id="wappinggusy_D03_07">五～十年</li><li id="wappinggusy_D03_07">十年以上</li>';
                        break;
                    case 'fitment':
                        liStr += '<li id="wappinggusy_D03_08">毛坯</li><li id="wappinggusy_D03_08">普装</li><li id="wappinggusy_D03_08">中装</li><li id="wappinggusy_D03_08">精装</li><li id="wappinggusy_D03_08">豪装</li>';
                        break;
                }
                selectDivUl.append(liStr);
                selectDiv.show();
            }

            // 点击标签弹出选择框事件
            var scroll;
            $('.select').on('click', function () {
                if (flagchose === false) {
                    return false;
                }
                var id = $(this).attr('id');
                var num;
                if (id) {
                    type = id;
                    if (obj[type]) {
                        selectDivUl.html(obj[type]);
                        selectDiv.show();
                        num = selectDiv.find('li.activeS').index();
                    } else {
                        initBox();
                    }
                    showDiv();
                    if (!scroll) {
                        scroll = new IScroll(poper[0], {
                            bindToWrapper: true, scrollY: true, scrollX: false, preventDefault: false
                        });
                    }
                    scroll.refresh();
                    if (num) {
                        // 45:每个li的高度,202:选择框的高度
                        var total = poper.find('ul li').length;
                        var tail = total * 45 - 202;
                        // 所有选项的总高度超过可视高度时滚动
                        if (tail > 0) {
                            // 滚动到底部后不可再向上滚动
                            if ((total - num) * 45 > 202) {
                                scroll.scrollTo(0, -(num - 1) * 45);
                            } else {
                                scroll.scrollTo(0, -tail);
                            }
                        }
                    } else {
                        scroll.scrollTo(0, 0);
                    }
                }
            });
            //解决穿透事件
            var clickFlag = true;
            var jumpHref = '';
            var content = $('.main');
            content.on('click','a',function(){
                if(!clickFlag){
                    return false;
                }
            });
            // 点击弹框选项事件,选择内容填充到对应的标签
            selectDivUl.on('click', 'li', function () {
                flagchose = false;
                var $that = $(this);
                clickFlag = false;
                $('#' + type).html($that.text() + (type === 'louceng' ? '层' : ''));
                evaluate.find('.' + type).addClass('sele');
                $that.addClass('activeS').siblings().removeClass('activeS');
                obj[type] = selectDivUl.html();
                selectDiv.hide();
                closeDiv();
                setTimeout(function(){
                    clickFlag = true;
                },500);
                setTimeout(function () {
                    flagchose = true;
                }, 100);
            });
            // 点击弹框取消事件
            selectDiv.find('.cancel').on('click', function () {
                flagchose = false;
                selectDiv.hide();
                closeDiv();
                setTimeout("", 100);
                flagchose = true;
            });
            // 输入项的字符和位数限制
            evaluate.on('input blur', 'input', function () {
                var $that = $(this);
                var val = $that.val();
                var id = $that.attr('id');
                var reg, flag;
                if (id) {
                    switch (id) {
                        case 'zonglouceng':
                            reg = /\D/g;
                            $that.val(val.replace(reg, ''));
                            break;
                        case 'louceng':
                            reg = /\D/g;
                            $that.val(val.replace(reg, ''));
                            var ua = window.navigator.userAgent.toLowerCase();
                            if (ua.indexOf('android') > -1) {
                                if ($that.val().length === 2) {
                                    zonglouceng.focus();
                                }
                            }
                            break;
                        case 'area':
                            reg = /^[1-9]\d{0,3}(\.\d{0,2})?$/;
                            if (!reg.test(val)) {
                                if (val.indexOf('.') === -1) {
                                    showMsg('建筑面积范围10-9999平米');
                                    $that.val(val.substring(0, val.length - 1));
                                } else {
                                    $that.val(val.substring(0, val.length - 1));
                                }
                            }
                            break;
                    }
                    evaluate.find('.' + id).addClass('sele');
                }
            });
            var assessId = $('.cfjBtn03');

            // 记录当前时间

            var starTime = [];
            assessId.on('click', function assess() {
                if (flagchose === false) {
                    return false;
                }
                var date = new Date();
                starTime.push(date.getTime());
                var projname = vars.projname ? vars.projname : $('#CFJ_searchtext').text();
                var zfloor = zonglouceng.val();
                var floor = louceng.val();
                var forward = orientation.text();
                var fTime = $('#fTime').text(); //完成时间
                var fitment = $('#fitment').text(); //装修档次
                var area = $('#area').val();
                if (!projname || projname === '请选择小区') {
                    alert('请选择小区');
                    return;
                }
                if (!area || area > 9999 || area < 10) {
                    alert('建筑面积范围10-9999平米');
                    return;
                }
                if (!floor) {
                    alert('请输入楼层');
                    return;
                }
                if (!zfloor) {
                    alert('请输入总楼层');
                    return;
                }
                if (zfloor - floor < 0) {
                    alert('楼层不得大于总楼层');
                    return;
                }
                // 评估数据
                var data = {
                    newcode: vars.newcode,
                    buildingarea: area,
                    forward: forward,
                    zfloor: zfloor,
                    floor: floor,
                    fittime: fTime,
                    fitment: fitment
                };
                if (fTime || fitment) {
                    data.fTime = fTime;
                    data.fitment = fitment;
                    data.moreFlag = 1;
                }
                var url = vars.pingguSite + '?c=pinggu&a=saveAccurateForm';
                var now = new Date();
                var time = now.getTime();
                var len = starTime.length;
                // 两次点击间隔时间小于4000ms不能点击
                if (len >= 2 && time - starTime[len - 2] <= 4000) {
                    alert('请不要频繁评估');
                    return;
                }
                $.ajax({
                    type: 'POST',
                    url: url,
                    data: data,
                    success: function (data) {
                        if (data !== 'error') {
                            if (data.errcode === '100') {
                                if (data.LogId) {
                                    window.location = vars.pingguSite + '?c=pinggu&a=result&pgLogId=' + data.LogId + '&city=' + vars.city;
                                }
                            } else {
                                alert(data.errmsg);
                            }
                        } else {
                            alert('抱歉，获取评估结果失败。');
                        }
                    }
                });
            });

            // 评估房源结束
            // m站首页足迹
            require.async('footprint/1.0.0/footprint', function (run) {
                run.push('查房价', vars.pingguSite + vars.city + '/', vars.city);
            });
            var arealist = $('#arealist');
            // 定位成功发送附近小区ajax
            function geoSuccess(position) {
                var y = position.coords.latitude;
                var x = position.coords.longitude;
                var url = '?c=pinggu&a=ajaxGetNearXiaoqu&city=' + vars.city + '&x=' + x + '&y=' + y + '&pagesize=' + vars.pagesize;
                $.ajax({
                    url: url,
                    success: function (data) {
                        // 加载附近小区
                        if (data && data !== ' ' && data !== 'error') {
                            arealist.empty();
                            arealist.append(data);
                            $('.lazyload').lazyload();
                        }
                    }
                });
            }

            var geolocation = navigator.geolocation;
            // 定位api索引
            if (geolocation) {
                geolocation.getCurrentPosition(function (position) {
                    geoSuccess(position);
                }, function () {
                    // console.log('fail to locate');
                }, {
                    timeout: 10000,
                    // 在10s内获取位置信息，否则触发errorCallback
                    maximumAge: 60000,
                    // 浏览器重新获取位置信息的时间间隔 60s
                    enableHighAccuracy: false
                    // 表示是否启用高精确度模式，如果启用这种模式，浏览器在获取位置信息时可能需要耗费更多的时间
                });
            }
            // 使用百度地图定位（首页百度滴入入口）
            var baidulocation = new BMap.Geolocation();
            baidulocation.getCurrentPosition(function (r) {
                if (this.getStatus() === BMAP_STATUS_SUCCESS) {
                    var gc = new BMap.Geocoder();
                    gc.getLocation(r.point, function (rs) {
                        var addComp = rs.addressComponents;
                        // 如果定位到当前城市
                        if (addComp.city.indexOf(vars.cityname) > -1) {
                            //locationpoint = {coord_x: r.point.lng, coord_y: r.point.lat};
                            //获取地图链接修改地图中心
                            var mapurl = $("#baidumap")[0].src;
                            mapurl = mapurl.replace(new RegExp("center=([0-9]+.?[0-9]+),([0-9]+.?[0-9]+)&"), 'center=' + r.point.lng + ',' + r.point.lat + '&');
                            $("#baidumap").attr('src', mapurl);
                        }
                    });
                }
            }, {enableHighAccuracy: true});
            // 最下面的导航-------------------------------------------------satrt
            // 添加底部SEO
            var seoTab = $('.tabNav');
            if (seoTab.find('a').length > 0) {
                // 底部第一个id
                var firstId = $('#bottonDiv a').eq(0).attr('id');
                var $bottonDiv = $('#bottonDiv');
                var $typeList = $('.typeListB');
                // 默认展示第一个
                $('.' + firstId).show();
                $bottonDiv.find('a').eq(0).addClass('active');
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
                addSwiper($('#' + firstId));
            }
            // 最下面的导航-------------------------------------------------end
            //点击精准评估
            $('.jzpg').on('click', function () {
                if (vars.localStorage) {
                    //如果填了信息，记下localstorage，带到精准评估页
                    var forward = $('#orientation').text();
                    var area = $('#area').val();
                    var floor = $('#louceng').val();
                    var zfloor = $('#zonglouceng').val();
                    var fTime = $('#fTime').text(); //完成时间
                    var fitment = $('#fitment').text(); //装修金钱
                    if ((forward && forward !== '南') || area || floor || zfloor || (fTime && fTime !== '请选择（选填）') || (fitment && fitment !== '请选择（选填）')) {
                        // 评估数据
                        var data = {
                            Forward: forward,
                            Area: area,
                            zfloor: zfloor,
                            Floor: floor,
                            FTime: fTime,
                            Fitment: fitment
                        };
                        var jsonStr = JSON.stringify(data);
                        vars.localStorage.setItem('jzpgInfo', jsonStr);
                    }
                }
                if (vars.newcode) {
                    window.location = vars.pingguSite + vars.city + '/' + vars.newcode + '/accurate.html';
                } else {
                    window.location = vars.pingguSite + vars.city + '/accurate.html';
                }
                return false;
            });
            //提示框
            var msg = $('#sendFloat'),
                msgP = $('#sendText'),
                timer = null;

            function showMsg(text, callback) {
                text = text || '信息有误！';
                msgP.html(text);
                msg.fadeIn();
                clearTimeout(timer);
                timer = setTimeout(function () {
                    msg.fadeOut();
                    callback && callback();
                }, 2000);
            }
        };
    });