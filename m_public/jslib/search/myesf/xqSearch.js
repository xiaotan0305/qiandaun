/**
 * esf学区搜索
 * by zhangcongfeng
 */
define('search/myesf/xqSearch', ['jquery', 'search/search'], function (require, exports, module) {
    'use strict';
    // jquery索引
    var $ = require('jquery');
    // 公共方法对象索引
    var search = require('search/search');
    // 页面传入的参数
    var vars = seajs.data.vars;

    function xqSearch() {
        // 弹窗html字符串
        this.html = '<div class="searchPage" id="popBtn">'
            + '<header class="header">'
            + '<div class="left"><a href="javascript:void(0);" class="back"><i></i></a></div>'
            + '<div class="cent"><span>小区搜索</span></div>'
            + '<div class="clear"></div>'
            + '</header>'
            + '<form class="search flexbox pdX15" action="" onsubmit="return false;" method="get" autocomplete="off">'
            + '<div class="searbox">'
            + '<div class="sel"  id = "selTab"></div>'
            + '<div class="ipt">'
            + '<input id="S_searchtext" type="search" name="q" value="" placeholder="请输入小区名字" autocomplete="off">'
            + '</div>'
            + '</div>'
            + '</form>'
            + '<div id="autoPromptList">'
            + '<div style="margin-bottom: 50px;">'
            + '<div class="searList"><ul></ul></div></div></div>'
            + '</div>';
        // 显示弹窗的按钮
        this.showPopBtn = '#projnameIpt';
        // 返回按钮
        this.findBackBtn = '.back';
        // 搜索按钮
        this.findSearchBtn = '.btn';
        // 搜索的input标签
        this.findSearchInput = 'input';
        // 自动提示列表ul的父节点
        this.findAutoPromptList = '#autoPromptList';
        // 标识选择类别
        this.selTab = '#selTab';
        this.standardObj = {
            // 后台返回匹配后与关键字做处理得到的数据
            projname: '',
            // 后台返回匹配的楼盘id
            comarea: '',
        };
    }

    /**
     * 原形链对象继承
     * 这里使用了jquery中的对象复制函数，实际上可以自己写一个遍历search的方法然后赋给HomeSearch原形链到达同样效果
     */
    $.extend(xqSearch.prototype, search);

    /**
     * 重写创建自动提示列表方法，传入需要的接口地址及接口传参
     * @param inputValue
     */
    xqSearch.prototype.createAutoPromptList = function (inputValue) {
        var url = vars.mySite + '?c=myesf&a=ajaxGetHousingResources';
        var obj = {
            city: vars.city,
            q: inputValue,
        };
        search.createAutoPromptList.call(this, inputValue, url, obj);
    };

    /**
     * 重写showPop
     * 增加热词点击和显示热词操作
     */

    xqSearch.prototype.showPop = function () {
        var that = this;
        search.showPop.call(that);
        $('#S_searchtext').val('');
    };

    /**
     * 获取自动提示列表内容
     * @param data
     * @returns {string}
     */
    xqSearch.prototype.getAutoPromptListContent = function (data) {
        var htmlStr = '';
        if(data){
            var len = data.length;
            htmlStr += '<li><a style="color:red;" href="javascript:void(0);" >' + '<span class="searchListName">请选择下拉小区</span></a></li>';
            for (var i = 0; i < len; i++) {
                htmlStr += '<li><a newcode="' + data[i].newcode +'" href="javascript:void(0);" >'
                    + '<span class="searchListName" data-ywtype={"projname":"'+ data[i].projname + '","projcode":"'
                    + data[i].newcode + '","purpose":"' + data[i].purpose + '","district":"' + data[i].district
                    + '","comarea":"' + data[i].comarea + '","address":"' + data[i].address + '"}>'+ data[i].projname
                    + '</span></a></li>';
            }
        }
        return htmlStr;
    };
    /**
     * inputChange方法重写
     * 增加功能在input没有输入内容时显示历史记录，否则相当于删除到了空字符，隐藏自动提示列表
     */
    xqSearch.prototype.inputChange = function () {
        var that = this;
        search.inputChange.call(that);
        that.showHotBuilding();
    };

    /**
     * 自动显示当前城市热门楼盘
     */
    xqSearch.prototype.showHotBuilding = function () {
        var that = this, htmlStr = '';
        if ($.trim(that.searchInput.val()) === '') {
            var geolocation = navigator.geolocation;
            if (geolocation) {
                geolocation.getCurrentPosition(function (position) {
                    $.ajax({
                        url: vars.mySite + '?c=myesf&a=ajaxGetNearXiaoQu',
                        data: {
                            city: vars.city,
                            x: position.coords.longitude,
                            y: position.coords.latitude,
                        },
                        success: function (data) {
                            htmlStr = that.getAutoPromptListContent(data);
                            $('#autoPromptList').find('ul').html(htmlStr);
                            $('#autoPromptList').show();
                        }
                    });
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
        }
    }

    /**
     * 点击列表条目
     * @param obj
     */
    xqSearch.prototype.clickListSearch = function (obj) {
        var that = this;
        //vars.vue.$root.$children[0].projname = obj.projname;
        var valArr ={'projname': obj.projname, 'projcode': obj.projcode, 'district': obj.district, 'comarea': obj.comarea};
        vars.vue.$emit('setVueValue', valArr);
        var $nextTick1 =
        $.ajax({
            url:vars.mySite + '?c=myesf&a=ajaxCheckProjcode',
            data:{
                newcode:obj.projcode
            },
            async:false,
            success:function(data){
                if(data && data.valid &&  data.valid == 'n'){
                    valArr ={'displayLose': '该楼盘不符合房产市场交易流程，暂无法发布房源', 'isXqfb': false};
                    vars.vue.$emit('setVueValue', valArr);
                }else{
                    // 存取小区的名字和小区id，区县、商圈;
                    vars.vue.$emit('callMethod', 'setHis', 'projname', obj.projname);
                    vars.vue.$emit('callMethod', 'setHis', 'projcode', obj.projcode);
                    vars.vue.$emit('callMethod', 'setHis', 'district', obj.district);
                    vars.vue.$emit('callMethod', 'setHis', 'comarea', obj.comarea);
                    valArr = {'isXqfb': true};
                    vars.vue.$emit('setVueValue', valArr);

                    var $nextTick2 = function () {
                        vars.vue.$emit('callMethod', 'ajaxPg');
                    };
                    vars.vue.$emit('callMethod', '$nextTick', $nextTick2);
                }
            },
            error:function(err){
                vars.vue.$emit('callMethod', 'disPlayLose', err);
            }
        });
        vars.vue.$emit('callMethod', '$nextTick', $nextTick1);
        that.back();
    };
    module.exports = xqSearch;
});
