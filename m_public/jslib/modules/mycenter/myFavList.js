define('modules/mycenter/myFavList', ['jquery', 'modules/mycenter/yhxw'], function (require) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;
    // 引入用户行为分析对象-埋码
    var yhxw = require('modules/mycenter/yhxw');
    // 判断详情页种类， 传入用户行为统计对象
    var pageId = 'mucmycollect';
    var maimaParams = {};
    var view_history = {};
    // var preload = [];
    $('input[type=hidden]').each(function (index, element) {
        vars[$(this).attr('data-id')] = element.value;
    });
    var localStorage = vars.localStorage;
    // 收藏、浏览切换
    var label_shouCang = $('#label_shouCang'),
        label_liuLan = $('#label_liuLan'),
        content_shouCang = $('#content_shouCang'),
        default_content = $('.default-content'),
        content_liuLan = $('#content_liuLan');
    // pagesize_liuLan我的浏览每次加载几条,page_liuLan初始页数;
    var appaend_liuLan = $('#content_liuLan ul'),
        pagesize_liuLan = 20,
        page_liuLan = 1;
    if (vars.total === '0') {
        $('.default-content.NoShoucang').show();
    }
    label_shouCang.on('click', function () {
        default_content.hide();
        $(this).addClass('cur');
        label_liuLan.removeClass('cur');
        content_liuLan.hide();
        if (vars.total > 0) {
            content_shouCang.show();
            if (vars.total > 10) {
                $('#loadmore').show();
            }
        }else {
            $('.default-content.NoShoucang').show();
        }

        // 统计用户行为
        maimaParams = {
            'vmg.page': pageId,
            'vmg.showlocation': encodeURIComponent('收藏')
        };
        yhxw({type: 0, pageId: pageId, params: maimaParams});
    });
    label_liuLan.on('click', function () {
        default_content.hide();
        $('#loadmore').hide();
        // 刚点过来执行下列操作，已经在‘浏览’则不执行
        if (!$(this).hasClass('cur') && page_liuLan === 1) {
            add_history_list(1);
        }
        if (!$(this).hasClass('cur')) {
            $(this).addClass('cur');
            label_shouCang.removeClass('cur');
            content_shouCang.hide();
            content_liuLan.show();
        }
        if ($('#content_liuLan li').length) {
            $('.default-content').hide();
        }else {
            $('.default-content.NoLiulan').show();
        }
        // 统计用户行为
        maimaParams = {
            'vmg.page': pageId,
            'vmg.showlocation': encodeURIComponent('浏览')
        };
        yhxw({type: 0, pageId: pageId, params: maimaParams});
    });

    require.async('lazyload/1.9.1/lazyload', function () {
        $('img[data-original]').lazyload();
    });
    // 收藏的ajax调用
    var totalpage = Math.ceil(vars.total / vars.pagesize);
    if (totalpage > 1) {
        $('#loadmore').show();
        var url_shouCang = vars.mySite + '?c=mycenter&a=ajaxMyFavList&city=' + vars.city + '&pagesize=' + vars.pagesize;
        // 第一次拖拽特殊处理标识
        var firstDragFlag = true;
        var curp = 2, k = true, k_liuLan = true,
            $window = $(window),
            $document = $(document),
            bua = navigator.userAgent.toLowerCase(),
            isApple = bua.indexOf('iphone') !== -1 || bua.indexOf('ios') !== -1;
        var drag = $('#loadmore'), draginner;
        if (totalpage <= 1) {
            k = false;
        }
        drag.click(function () {
            loadmore();
        });
        $window.bind('scroll', function () {
            var scrollh = $document.height();
            if (firstDragFlag) {
                firstDragFlag = false;
                if (isApple) {
                    scrollh -= 140;
                } else {
                    scrollh -= 80;
                }
            }
            if ($document.scrollTop() + $window.height() >= scrollh) {
                // 收藏标签处于激活状态时调用loadmore
                k && label_shouCang.hasClass('cur') && loadmore();
                // 浏览标签处于激活状态时调用loadmore
                k_liuLan && label_liuLan.hasClass('cur') && add_history_list(page_liuLan);
            }
        });
    }
    function loadmore() {
        if (draginner === undefined)draginner = $('#font_shoucang');
        k = false;
        draginner.html('正在加载请稍后');
        $.get(url_shouCang + '&r=' + Math.random(), {'page': curp}, function (data) {
            if (data) {
                $('#content_shouCang ul').append(data).find('.img img').lazyload();
                draginner.html('查看更多');
                curp = parseInt(curp) + 1;
                k = true;
                if (curp > parseInt(totalpage)) {
                    drag.hide();
                    k = false;
                }
            }else {
                draginner.html('网络正忙，点我再次加载');
            }

        });
    }

    $('#content_shouCang ul').on('click', 'a', function () {
        var type = $(this).attr('data-id');
        if (type) {
            switch (type) {
                case 'zf1':
                    $('#mes_box').text('该房源已出租');
                    break;
                case 'zf2':
                    $('#mes_box').text('该房源已暂停出租');
                    break;
                case 'zf3':
                    $('#mes_box').text('该房源已过期或失效');
                    break;
                case 'esf1':
                    $('#mes_box').text('该房源已出售');
                    break;
                case 'esf2':
                    $('#mes_box').text('该房源已暂停出售');
                    break;
                case 'esf3':
                    $('#mes_box').text('该房源已过期或失效');
                    break;
            }
            $('#mes_back').show(200).delay(1500).hide(200);
        }
    });
    if (localStorage) {
        // 普通新房
        var xfCommon = localStorage.getItem('xfViewHistory') === null ? '' : localStorage.getItem('xfViewHistory');
        // 在线新房
        var xfOnline = localStorage.getItem('xf_view_History') === null ? '' : localStorage.getItem('xf_view_History');
        // 全部新房缓存及拼接
        var xfTotolHistory = '';
        if (xfCommon && xfOnline) {
            xfTotolHistory = xfCommon + '|' + xfOnline;
        }else if (xfCommon && !xfOnline) {
            xfTotolHistory = xfCommon;
        }else if (!xfCommon && xfOnline) {
            xfTotolHistory = xfOnline;
        }
        // 获取二手房信息 单独处理
        var esfStr = localStorage.getItem('esf_view_History') === null ? '' : localStorage.getItem('esf_view_History');
        // ids容器
        var idsArr = [];
        if (esfStr) {
            // 二手房信息数组
            var esfList = esfStr.split('|');
            for (var i = 0;i < esfList.length; i++ ) {
                // 是A类 但是没有tags时  获取该房源id存到idsArr中
                if (esfList[i].indexOf('housetype~A') !== -1 && esfList[i].indexOf(';tags~') === -1) {
                    idsArr.push(getparam(esfList[i], 'id'));
                }
            }
            var idsStr = idsArr.join(',');
            if (idsStr) {
                $.ajax({
                    url: vars.mySite + '?c=mycenter&a=ajaxGetLiulanTags&city=' + vars.city + '&ids=' + idsStr ,
                    type: 'GET',
                    dataType: 'json',
                }).done(function (data) {
                    for (var id in data) {
                        // 将数据变成字符串形式
                        data[id] = data[id].join(' ');
                        for (var i = 0;i < esfList.length; i++) {
                            // 如果请求来的id与locolstorage中的id相等 在此项后边填入tags
                            if (esfList[i].indexOf(id) !== -1) {
                                esfList[i] += ';tags~' + data[id];
                            }
                        }
                    }
                    var newEsfStr = esfList.join('|');
                    localStorage.setItem('esf_view_History',newEsfStr);
                });
            }
        }
    }

    // 获取装修收藏（装修设计和建材报价），返回数组
    function getLSItemArr(storage_type) {
        var itemArr = [];
        // 最多取20条
        for (var i = 1; i <= 20; i++) {
            if (localStorage) {
                var ls = localStorage.getItem(storage_type + i);
            }
            if (ls) {
                itemArr.push(ls);
            } else {
                return itemArr;
            }
        }
        return itemArr;
    }

    // 根据一条收藏（字符串），获取对应元素的值
    function getparam(str, name) {
        var paraString = str.split(';');
        var paraObj = {};
        var i, j;
        for (i = 0; j = paraString[i]; i++) {
            paraObj[j.substring(0, j.indexOf('~')).toLowerCase()] = j.substring(j.indexOf('~') + 1, j.length);
        }
        if (paraObj[name]) {
            return paraObj[name];
        }
        return '';
    }
    function add_history_list(page) {
        if (localStorage) {
            // 获取我的浏览
            view_history = {
                xf_view_History: xfTotolHistory,
                esf_view_History: localStorage.getItem('esf_view_History') === null ? '' : localStorage.getItem('esf_view_History'),
                zf_view_History: localStorage.getItem('zf_view_History') === null ? '' : localStorage.getItem('zf_view_History'),
                overseas_view_History: localStorage.getItem('world_view_History') === null ? '' : localStorage.getItem('world_view_History'),
                zhishi_view_History: localStorage.getItem('zhishi_view_History') === null ? '' : localStorage.getItem('zhishi_view_History'),
                // “装修设计”和“建材报价”的收藏，返回数组
                view_History_list_sj: getLSItemArr('jiaju_case_favorite'),
                view_History_list_jc: getLSItemArr('jiaju_build_favorite'),
                tudi_view_History: localStorage.getItem('tudi_view_History') === null ? '' : localStorage.getItem('tudi_view_History')
            };
        }
        // 所有浏览放入一个大数组
        var all_history = [];
        var types = {
            xf_view_History: '新房',
            esf_view_History: '二手房',
            zf_view_History: '租房',
            overseas_view_History: '海外房产',
            zhishi_view_History: '知识',
            view_History_list_sj: '装修设计',
            view_History_list_jc: '建材报价',
            tudi_view_History: '土地'
        };
        $.each(view_history, function (index, value) {
            // console.log(index);
            // console.log(data);
            var tmp = [];
            if (value) {
                // 过滤空值
                if (index === 'view_History_list_sj' || index === 'view_History_list_jc') {
                    // 家居收藏
                    for (var i in value) {
                        value[i] = value[i] + 'type~' + types[index];
                    }
                    tmp = value;
                } else {
                    // 土地的最后多了一个|竖杠
                    value = value.replace(/\|$/, '');
                    // 添加’租房’‘二手房’等类型
                    var result = value.replace(/\|/g, ';type~' + types[index] + '|');
                    result = result + ';type~' + types[index];
                    tmp = result.split('|');
                }
            }
            all_history = all_history.concat(tmp);
        });
        var list_size = all_history.length;
        if (Math.ceil(list_size / pagesize_liuLan <= 1)) {
            k_liuLan = false;
        }

        for (var i = ((page - 1) * pagesize_liuLan); i < (list_size < (page * pagesize_liuLan) ? list_size : (page * pagesize_liuLan)); i++) {
            var neiRong = {
                url: getparam(all_history[i], 'url'),
                img: $.trim(getparam(all_history[i], 'img'))?$.trim(getparam(all_history[i], 'img')): vars.public + '201511/images/loadingpic.jpg',
                title: getparam(all_history[i], 'title'),
                room: getparam(all_history[i], 'room'),
                area: getparam(all_history[i], 'area'),
                house_dtl: getparam(all_history[i], 'room') + ' ' + (getparam(all_history[i], 'area') ?getparam(all_history[i], 'area') + '㎡&nbsp;&nbsp;' : ''),// 户型和面积
                price: getparam(all_history[i], 'price'),
                address: getparam(all_history[i], 'cityname') + ' ' + getparam(all_history[i], 'district') + ' ' + getparam(all_history[i], 'comarea'),
                // purpose:getparam(all_history[i],'purpose'),
                housetype: getparam(all_history[i], 'housetype'),
                type: getparam(all_history[i], 'type'),
                mark: getparam(all_history[i], 'type') + '&nbsp;' + getparam(all_history[i], 'purpose'),
                time: getparam(all_history[i], 'time'),
                tags: getparam(all_history[i], 'tags')
            };
            // 二手房的价格添加价格单位信息
            if (neiRong.type === '二手房') {
                neiRong.price += '万元';
                neiRong.tags = neiRong.tags.split(' ');
            } else if (neiRong.type === '海外房产') {
                neiRong.address = getparam(all_history[i], 'addr');
                neiRong.house_dtl = '';
                neiRong.mark = neiRong.type;
            } else if (neiRong.type === '新房') {
                neiRong.house_dtl = getparam(all_history[i], 'discount');
                neiRong.city = getparam(all_history[i], 'city');
                neiRong.id = getparam(all_history[i], 'id');
                neiRong.url = vars.mainSite + 'xf/' + neiRong.city + '/' + neiRong.id + '.html';
                neiRong.mark = '新房-在售';
            } else if (neiRong.type === '建材报价') {
                neiRong.title = getparam(all_history[i], 'favtitle');
                var tudi_url = ['', 'zpgdetail', 'tdzrdetail', 'xmzrdetail'];
                var classid = getparam(all_history[i], 'class');
                neiRong.url = vars.mainSite + 'tudi/' + tudi_url[classid] + '/' + getparam(all_history[i], 'id') + '.html';
                neiRong.mark = tudi_type[classid] ? tudi_type[classid] : '';
                neiRong.house_dtl = neiRong.address.replace(/~/g, '&gt;');
                neiRong.address = '';
            } else if (neiRong.type === '知识') {
                neiRong.tags = neiRong.tags.split(',');
                var n = 21;
                var r = '/[^\x00-\xff]/g';
                var m=Math.floor(n/2);
                for (var j=m;j<neiRong.title.length;j++) {
                    if (neiRong.title.substr(0,j).replace(r,'mm').length >= n) {
                        neiRong.title = neiRong.title.substr(0,j)+'...';
                        break;
                    }
                }
            }

            var house_list = '';
            // 土地没有图片
            if (neiRong.type === '土地') {
                house_list += '<li><a href="' + neiRong.url + '"><div class="rt"><h3 class="f333">' + neiRong.title
                    + '<span class="f999 f12 flor">' + neiRong.mark + '</span></h3>';
                house_list += '<p><span class="f999">' + neiRong.house_dtl + '&nbsp;</span><span class="fdf3 flor f12">' + neiRong.price + '</span></p>';
                house_list += '<p><span class="flor ss-up f999">' + neiRong.time + '</span><span class="f999">' + neiRong.address
                    + '</span></p></div></a></li>';
                // A类二手房
            }else if (neiRong.type === '二手房') {
                var strEsfTags = '';
                if (neiRong.housetype === 'A') {
                    strEsfTags += '<div class="stag">';
                    for (var j = 0; j< neiRong.tags.length; j++) {
                        strEsfTags += '<span class="graybg">' + neiRong.tags[j] + '</span>';
                    }
                    strEsfTags += '</div>';
                }
                house_list += '<li>'
                    + '<a href="' + neiRong.url + '">'
                    + '<div class="img">'
                    + '<img src="'+ neiRong.img + '" alt="">'
                    + '<span class="channel">' + neiRong.type + '</span>'
                    + '</div>'
                    + '<div class="txt">'
                    + '<h3>' + neiRong.title + '</h3>'
                    + '<p>'
                    + '<span class="new">' + neiRong.price + '</span>' + neiRong.room + '<span class="space"></span>' + neiRong.area + '㎡'
                    + '</p>'
                    + '<p>' + neiRong.address + '</p>'
                    + strEsfTags
                    + '</div>'
                    + '</a>'
                    + '</li>';
                // 知识
            }else if (neiRong.type === '知识') {
                var strZhishiTags = '';
                for (var j = 0; j< neiRong.tags.length; j++) {
                    strZhishiTags += '<span class="graybg">' + neiRong.tags[j] + '</span>';
                }
                house_list += '<li>'
                    + '<a href="' + neiRong.url + '">'
                    + '<div class="img">'
                    + '<img src="'+ neiRong.img + '" alt="">'
                    + '<span class="channel">' + neiRong.type + '</span>'
                    + '</div>'
                    + '<div class="txt">'
                    + '<h3>' + neiRong.title + '</h3>'
                    + '<div class="stag"  style="margin-top:44px;">'
                    + strZhishiTags
                    + '</div>'
                    + '</div>'
                    + '</a>'
                    + '</li>';
                // 其它
            } else {
                house_list += '<li class="threeh">'
                    + '<a href="' + neiRong.url + '">'
                    + '<div class="img">'
                    + '<img src="'+ neiRong.img + '" alt="">'
                    + '<span class="channel">' + neiRong.type + '</span>'
                    + '</div>'
                    + '<div class="txt">'
                    + '<h3>' + neiRong.title + '</h3>'
                    + '<p>'
                    + '<span class="new">' + neiRong.price + '</span>' + neiRong.house_dtl
                    + '</p>'
                    + '<p>' + neiRong.address + '</p>'
                    + '</div>'
                    + '</a>'
                    + '</li>';
            }
            appaend_liuLan.append(house_list);
        }
        // 如果没有内容，显示默认文字
        if (!appaend_liuLan.find('ul').html()) {
            $('#loadmore').hide();
        }
        if (list_size <= page_liuLan * pagesize_liuLan) {
            $('#drag_liuLan').hide();
            page_liuLan = page + 1;
            k_liuLan = false;
        } else {
            $('#drag_liuLan').show();
            $('#drag_liuLan').unbind('click');
            page_liuLan = page + 1;
            $('#drag_liuLan').on('click', function () {
                add_history_list(page_liuLan);
            });
        }
    }
});
