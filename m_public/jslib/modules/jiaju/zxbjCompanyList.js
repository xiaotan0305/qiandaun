/**
 * @file WAP装修报价
 * @author 钟厚财-20170714
 */
define('modules/jiaju/zxbjCompanyList', ['jquery', 'loadMore/1.0.0/loadMore'], function (require, exports, module) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;
    var loadMore = require('loadMore/1.0.0/loadMore');

    // 初始化获取已选择的项目id
    var content = $('#content');
    var selectEle = $('.oneline').find('span'),
        selectNum = 0;
    var idArr = [];
    content.find('li').each(function (index, ele) {
        var $this = $(ele),
            id = $this.data().id,
            icoEle = $this.find('.ipt-rd');
        if (icoEle.hasClass('active') && id) {
            idArr.push(id);
            selectNum++;
        }
    });
    // console.log(idArr);
    // 项目选择id
    content.on('click', 'li', function () {
        var $this = $(this),
            id = $this.data().id,
            icoEle = $this.find('.ipt-rd'),
            hasActive = icoEle.hasClass('active');
        if (hasActive) {
            var index = idArr.indexOf(id);
            idArr.splice(index, 1);
            icoEle.removeClass('active');
            selectNum--;
            selectNum < 0 && (selectNum = 0);
        } else {
            idArr.push(id);
            icoEle.addClass('active');
            selectNum++;
        }
        selectEle.text(selectNum);
        // console.log(idArr);
    });
    // 预约请求
    // http://mm.test.fang.com/jiaju/?c=jiaju&a=ajaxAddCallOrder&city=cd&room=5&area=100&phone=15201645121&id=1,2
    /**
     * 预约请求
     * @returns
     */
    function yyAjax() {
        return $.ajax({
            url: location.protocol + vars.jiajuSite + '?c=jiaju&a=ajaxAddCallOrder',
            type: 'get',
            data: {
                room: vars.room,
                area: vars.area,
                phone: vars.phone,
                cityid: vars.cityid,
                cityname: vars.cityname,
                id: idArr.join(',')
            }
        }).fail(function (error) {
            console.error(error);
        });
    }

    /**
     * 定时关闭
     * @param {any} obj 元素
     * @param {any} timer 定时器
     * @param {any} time 延迟时间
     * @param {any} fn 回掉函数
     */
    function setTimer(obj, timer, time, fn) {
        clearTimeout(timer);
        timer = setTimeout(function () {
            obj.hide();
            fn && fn();
        }, time);
    }

    // 预约
    var submitBtn = $('.jj-desBtn .btn');
    var alertOne = $('#alert_one'),
        alertOneBtn = alertOne.find('.btns'),
        alertOneTimer = null,
        alertTwo = $('#alert_two');
    // 预约报价页地址
    var baojiaUrl = location.protocol + vars.jiajuSite + '?c=jiaju&a=zxbjForApp&city=' + vars.city + '&src=client';
    submitBtn.on('click', function () {
        if (selectNum >= 3) {
            yyAjax().done(function (data) {
                if (data.isSuccess === '1') {
                    alertOne.show();
                    clearTimeout(alertOneTimer);
                    alertOneTimer = setTimeout(function () {
                        alertOne.hide();
                        location.href = baojiaUrl;
                    }, 3000);
                } else {
                    alert(data.message);
                }
            });
        } else {
            alertTwo.show();
        }
    });
    alertOneBtn.on('click', function () {
        clearTimeout(alertOneTimer);
        alertOne.hide();
        location.href = baojiaUrl;
    });

    // 再看看
    var sended = false;
    $('#cancel').add('#ok').on('click', function () {
        if (sended) return;
        sended = true;
        var id = $(this).attr('id');
        yyAjax().done(function (data) {
            sended = false;
            if (data.isSuccess === '1') {
                alertTwo.hide();
                if (id === 'cancel') {
                    location.href = baojiaUrl;
                }
            } else {
                alert(data.message);
            }
        });
    });

    // 加载更多
    loadMore({
        // 接口地址
        // 需要传入经纬度以及定位城市中文
        url: location.protocol + vars.jiajuSite + '?c=jiaju&a=ajaxZxbjCompanyList&city=' + vars.city + '&cityname=' + vars.cityname,
        // 数据总条数
        total: vars.total,
        // 首屏显示数据条数
        pagesize: 20,
        // 单页加载条数，可不设置
        pageNumber: 20,
        // 加载更多按钮id
        moreBtnID: '#clickmore',
        // 加载数据过程显示提示id
        loadPromptID: '#prompt',
        // 数据加载过来的html字符串容器
        contentID: '#content',
        loadingTxt: '努力加载中...',
        loadAgoTxt: '点击加载更多...'
    });
    //没有请求到数据，点击重新加载
    $('#datatimeout').on('click', function () {
        window.location.reload();
    });
});