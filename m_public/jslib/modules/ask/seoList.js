define('modules/ask/seoList', ['jquery', 'iscroll/1.0.0/iscroll', 'modules/ask/yhxw', 'loadMore/1.0.0/loadMore'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var iscrollCtrl = require('iscroll/1.0.0/iscroll');
        var vars = seajs.data.vars;
        // 文档jquery对象索引
        var $doc = $(document);
        // 加载更多
        var loadMore = require('loadMore/1.0.0/loadMore');
        loadMore({
            url: vars.askSite + '?c=ask&a=ajaxSeoClass&classid=' + vars.classid + '&showtype=' + vars.showtype,
            total: vars.pagecount,
            pagesize: 20,
            pageNumber: 20,
            moreBtnID: '.lodBox',
            loadPromptID: '.lodBox',
            contentID: '#morecontent',
            loadAgoTxt: '点击加载更多',
            loadingTxt: '正在加载...',
            loadedTxt: '点击加载更多',
            firstDragFlag: false,
            // 是否需要上拉加载更多功能即是否需要scroll事件监听，可为空，默认为true
            isScroll: false
        });
        // 用户行为对象
        var yhxw = require('modules/ask/yhxw');
        yhxw({type: 1, pageId: 'wd_wd^jh_wap'});

        /**
         * 为了方便解绑事件，声明一个阻止页面默认事件的函数
         * @param e
         */
        function pdEvent(e) {
            e.preventDefault();
        }

        /**
         * 禁止页面滑动
         */
        function unable() {
            $doc.on('touchmove', pdEvent);
        }

        /**
         * 允许页面滑动
         */
        function enable() {
            $doc.off('touchmove', pdEvent);
        }

        // 搜索框右边的热门词按钮
        var $questionBtn = $('.questionbtn');
        // div-main1
        var $main1 = $('.main1');
        // 我要提问悬浮按钮
        var $answerBtn2 = $('.answer-btn2');
        // 热门词筛选弹出层
        var $tabSx = $('.tabSX');
        // 热门词筛选列表上方热门词按钮
        var $hotWord = $('.hotword');
        // 阴影浮层
        var $float = $('.float');
        // 一级分类列表容器
        var $father = $('.father');
        // 二级分类列表容器
        var $son = $('.son');
        // 一级分类dd标签
        var $fdd = $('.fdd');
        // 二级分类dd标签
        var $sdd = $('.sdd');
        // 二级分类下的“不限”分类
        var $sfdd = $('.sfdd');
        // 一级分类ID
        var FId = vars.juheid;
        // 当前分类ID
        var SId = vars.thisid;
        // 保存当前的一级分类id
        var fid = '';

        function addActiveClass() {
            if (FId === '') {
                $('#fclass_' + SId).addClass('active');
                $('#sondd' + SId).addClass('active');
                $('#son' + SId).show();
                fid = SId;
            } else {
                $('#fclass_' + FId).addClass('active');
                $('#sondd' + SId).addClass('active');
                $('#son' + FId).show();
                fid = FId;
            }
        }

        addActiveClass();
        // 点击搜索旁边的热门词显示筛选
        $questionBtn.on('click', function () {
            $main1.hide();
            $answerBtn2.hide();
            $tabSx.show();
            $float.show();
            unable();
            iscrollCtrl.refresh('.father');
            iscrollCtrl.refresh('#son' + fid);
        });
        // 点击筛选列表的热门词按钮隐藏筛选
        $hotWord.on('click', function () {
            $main1.show();
            $answerBtn2.show();
            $tabSx.hide();
            $float.hide();
            enable();
        });
        // 根据一级分类展示二级分类-并为当前点击的元素添加样式
        var id = '';
        $father.on('click', 'a', function () {
            id = $(this).attr('data-father');
            $son.hide();
            $('#son' + id).show();
            $fdd.removeClass('active');
            $(this).parent().addClass('active');
            $sdd.removeClass('active');
            $sfdd.addClass('active');
            iscrollCtrl.refresh('#son' + id);
        });
        // 显示更多
        var $showMore = $('#show_more_answer');
        if ($('#ask_str').height() > 66) {
            $showMore.show();
        }
        // 收起，更多
        $showMore.on('click', function () {
            var $that = $(this);
            var me = $(this).parent().parent();
            me.find('.con-o').hide();
            me.find('.con-1').show();
            $that.hide();
            $that.next().show();
        });
        $('#show_less_answer').on('click', function () {
            var $that = $(this);
            var me = $that.parent().parent();
            me.find('.con-1').hide();
            me.find('.con-o').show();
            $that.prev().show();
            $that.hide();
        });
    };
});