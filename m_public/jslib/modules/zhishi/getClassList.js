define('modules/zhishi/getClassList', ['jquery', 'loadMore/1.0.0/loadMore', 'lazyload/1.9.1/lazyload', 'modules/zhishi/zhishibuma'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        // 用户行为对象
        var zhishibuma = require('modules/zhishi/zhishibuma');
        // 图片惰性加载
        require('lazyload/1.9.1/lazyload');
        $('.lazyload').lazyload({
            threshold: 200,
            event: 'scroll click'
        });
        // 加载更多
        var loadMore = require('loadMore/1.0.0/loadMore');

        function getClassList(i) {
            if (i < strids.length) {
                $.get(vars.zhishiSite + '?c=zhishi&a=ajaxGetClassList&jtname=' + vars.jtname + '&fid=' + vars.fid
                + '&sid=' + vars.sid + '&tid=' + vars.tid + '&id=' + strids[i] + '&name=' + strnames[i] + '&flag='
                + vars.flag, function (data) {
                    i++;
                    if (data) {
                        $('#one').before(data);
                        $('.lazyload').lazyload({
                            threshold: 200,
                            event: 'scroll click'
                        });
                        getClassList(i);
                    }
                });
            }
        }

        /**
         * 列表的7,14,21,28的位置增加家居报名入口
         */
        var lis = [];
        var knowList = $('#know-list');
        function ajaxListJiajuBaoMing() {
            var ajaxUrl = vars.zhishiSite + '?c=zhishi&a=ajaxListJiajuBaoMing&city' + vars.city + '&jtname' + vars.jtname + '&fid=' + vars.fid + '&sid=' + vars.sid;
            $.ajax({
                url: ajaxUrl,
                async: false,
                success: function (data) {
                    if (data) {
                        lis = data.split("$$$");
                    }
                }
            });
        }
        ajaxListJiajuBaoMing();
        function showLi(i) {
            var pos = (i + 1) * 6;
            knowList.find('li').not('.inside_3').eq(pos).before(lis[i]);
        }
        if (vars.flag) {
            var i = 0;
            loadMore({
                url: vars.zhishiSite + '?c=zhishi&a=ajaxGetClassList&jtname=' + vars.jtname + '&fid=' + vars.fid + '&sid='
                + vars.sid + '&tid=' + vars.tid + '&thisid=' + vars.thisid + '&flag=' + vars.flag,
                total: vars.count,
                pagesize: 6,
                pageNumber: 6,
                moreBtnID: '.more-list',
                loadPromptID: '.more-list',
                contentID: '#know-list',
                loadAgoTxt: '上拉加载更多',
                loadingTxt: '正在加载...',
                firstDragFlag: false,
                callback: function () {
                    if (i < 4) {
                        i = i + 1;
                        showLi(i);
                    }
                }
            });
            showLi(0);
        } else {
            var strid = vars.strid;
            var strname = vars.strname;
            // 定义一数组
            var strids = [];
            var strnames = [];
            // 字符分割
            strids = strid.split(',');
            strnames = strname.split(',');
            // alert(strids);
            getClassList(2);
        }


        // 弹层按钮
        var selectItem = $('#selectItem');
        // 包裹层
        var floatDiv = $('.float:first');
        // 遮罩div
        var selectStage = $('.selectStage');
        // 选买房阶段点击按钮
        selectStage.click(function () {
            var maskDisplay = floatDiv.css('display');
            var selDisplay = selectItem.css('display');
            if (selDisplay === 'none' && maskDisplay === 'none') {
                floatDiv.show();
                selectItem.show();
            } else {
                floatDiv.hide();
                selectItem.hide();
            }
        });
        floatDiv.click(function () {
            selectItem.hide();
            floatDiv.hide();
        });

        /**
         * goDown(div)收起其他二级目录，展开本次点击的二级目录
         * @param {number} div 本次点击的一级目录标识
         */
        function goDown(div) {
            selectItem.find('li').removeClass('cur');
            $('#item_' + div).addClass('cur');
        }

        selectItem.on('click', 'div', function () {
            var self = $(this);
            var top;
            if (self.parent().hasClass('cur')) {
                self.parent().removeClass('cur');
            } else {
                goDown(self.data('id'));
                top = self.offset().top;
                window.scrollTo(0, top);
            }
        });
        selectItem.on('click', 'dd', function () {
            var self = $(this);
            self.parent().find('dd').removeClass('on');
            self.addClass('on');
        });
        $('.know-list').on('click', 'li', function () {
            $(this).addClass('visited');
        });
        // 换一换
        $('.main').on('click', '.huanyihuan', function () {
            var myli = $(this).parent().siblings('.know-list').children();
            if ($(myli.get(0)).css('display') === 'block') {
                $(myli.get(0)).hide();
                $(myli.get(1)).hide();
                $(myli.get(2)).show().addClass('first');
                $(myli.get(3)).show();
            } else if ($(myli.get(2)).css('display') === 'block') {
                $(myli.get(2)).hide();
                $(myli.get(3)).hide();
                if (myli.length > 4) {
                    $(myli.get(4)).show().addClass('first');
                    $(myli.get(5)).show();
                } else {
                    $(myli.get(0)).show().addClass('first');
                    $(myli.get(1)).show();
                }
            } else {
                $(myli.get(4)).hide();
                $(myli.get(5)).hide();
                $(myli.get(0)).show();
                $(myli.get(1)).show();
            }
        });
        var classify = encodeURIComponent(vars.jtnames + '知识') + (vars.firstClassName ? '^' : '') + encodeURIComponent(vars.firstClassName)
            + (vars.secondClassName ? '^' : '') + encodeURIComponent(vars.secondClassName);
        zhishibuma({zscategory: classify, pageType: 'mzslist'});
    };
});