/**
 * Created with webstorm
 * User: tkp19
 * Date: 2016/2/2 0002
 * Time: 14:41
 */
$(function () {
    'use strict';

    // 获取隐藏域数据
    var vars = {};
    $('input[type=hidden]').each(function (index, element) {
        vars[element.id] = element.value;
    });

    var searchInput = $('#search'),
        cityList = $('#cityList'),
        cityUl = $('#cityUl');
    // 用户是否选择开关
    var selected = false;
    var encity = '',
        chcity = '';
    // 信息弹层
    var msg = $('#msg'),
        msgP = msg.find('p'),
        timer = null;
    var win = $(window),
        winH = win.height();

    /**
     * 信息弹层
     * @param text 文本内容
     * @param time 显示时间
     * @param callback 回调函数
     */
    function showMsg(text, time, callback) {
        text = text || '信息有误！';
        time = time || 1500;
        msgP.html(text);
        msg.fadeIn();
        clearTimeout(timer);
        timer = setTimeout(function () {
            msg.fadeOut();
            callback && callback();
        }, time);
    }

    // 城市列表隐藏
    $(document.body).on('click', function () {
        cityList.hide();
    });

    /**
     * 获取城市列表数据
     * @param val 输入框val值
     */
    function getCityList(val) {
        $.ajax({
            type: 'GET',
            url: vars.mainSite + '/huodongAC.d?class=XiDaDaHc&m=getCityPinyinName&cityName=' + val + '&v=' + new Date().getTime(),
            success: function (data) {
                var len = data.length,
                    tmpString = '';
                for (var i = 0; i < len; i++) {
                    var chName = data[i][0],
                        enName = data[i][1];
                    // <li data-name="bj">北京</li>
                    tmpString += '<li data-name="' + enName + '">' + chName + '</li>';
                }
                cityUl.html(tmpString);
                if (val && len > 0) {
                    cityList.show();
                }else {
                    cityList.hide();
                }
                // TODO 城市完全匹配情况下，直接选中
                if (len === 1 && data[0][0] === val) {
                    cityUl.find('li').click();
                }
            },
            error: function (data) {
                alert('失败:' + data.status);
            }
        });
    }
    // 输入框输入
    searchInput.on('input', function () {
        var inputVal = searchInput.val().trim();
        selected = false;
        var encity = $(this).attr('data-name');
        if (encity) {
            $(this).attr('data-name','');
        }
        getCityList(inputVal);
    });
    // 获取焦点
    var fotter = $('.fotter'),
        mgX = $('.mgX17');
    searchInput.focus(function (ev) {
        ev.stopPropagation();
        ev.preventDefault();
        if (window.navigator.userAgent.toLowerCase().indexOf('android') !== -1) {
            mgX.css({
                transform: 'translateY(-150px)',
                transition: '.1s all linear'
            });
        }
        var inputVal = searchInput.val().trim();
        if (inputVal) {
            getCityList(inputVal);
        }
    }).blur(function () {
        mgX.css({
            transform: '',
            transition: '.1s all linear'
        });
    });

    $(document.body).on('touchend',function () {
        searchInput.blur();
    });
    // 解决bug(输入法盖住输入框、弹出输入法后footer向上跑)
    win.on('resize',function () {
        if (win.height() < winH) {
            fotter.hide();
        }else {
            fotter.show();
            searchInput.blur();
        }
    });
    // 点击
    searchInput.on('click',function (ev) {
        ev.stopPropagation();
    });
    // 城市列表点击输入
    cityUl.on('click', 'li', function () {
        encity = $(this).attr('data-name');
        chcity = $(this).html();
        searchInput.val(chcity).attr('data-name', encity);
        selected = true;
    });

    // 城市搜索
    var searchbtn = $('#searchbtn');
    searchbtn.on('click', function (ev) {
        ev.stopPropagation();
        ev.preventDefault();
        var inputVal = searchInput.val().trim();
        if (!inputVal) {
            showMsg('请选择城市!');
        } else if (!selected) {
            showMsg('请输入正确的城市名称!');
        } else {
            searchInput.val('').attr('data-name','');
            showMsg('跳转中...',3000);
            location.href = vars.mainSite + '/huodongAC.d?class=XiDaDaHc&m=getDistrictInfo&city=' + encity;
        }
    });
});