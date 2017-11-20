/**
 * Created by hanxiao on 2017/7/4.
 */
define('modules/job/societyList', ['jquery', 'loadMore/1.0.2/loadMore', 'iscroll/2.0.0/iscroll-lite', 'superShare/1.0.1/superShare', 'util'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        // 文档jquery对象索引
        var $doc = $(document);
        // 页面传入的数据
        var vars = seajs.data.vars;
        // 加载更多
        var loadMore = require('loadMore/1.0.2/loadMore');
        // 滑动插件
        var IScroll = require('iscroll/2.0.0/iscroll-lite');
        // 公共工具类
        var util = require('util');
        var userid = vars.userid;
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
		/**
         * 点击职位列表 获取职位值
         */
		var position_arr = new Array();
        $('.UljobList').off().on('click', "input", function () {
			if (position_arr.indexOf($(this).attr('position_id')) > -1) {
				position_arr.splice(position_arr.indexOf($(this).attr('position_id')), 1);
			} else {
				position_arr.push($(this).attr('position_id'));
			}
		});
		//点击职位申请
		$('#posapply').off().on('click', function () {
            // 判断用户id是否为空，为空则跳转登陆页面
            if (!userid) {
                floatshow('请先登录再申请', 1);
                return;
            }
			if (position_arr.length == 1) {
                $.get(vars.jobSite + '?c=job&a=ajaxGetResume', function (myresume) {
                    if (myresume) {
                        $.get(vars.jobSite + '?c=job&a=ajaxAddPososition&PositionID='+ position_arr.join('~'), function (data) {
                            if (data) {
                                floatshow(data.Message, 0);
                            } else {
                                floatshow('申请失败，请重试', 0);
                            }
                        });
                    } else {
                        var hrefurl = vars.jobSite + '?c=job&a=editResume';
                        window.location = hrefurl;
                    }
                });
			} else if (position_arr.length == 0) {
				floatshow('请选择一个职位进行申请', 0);
			} else {
				floatshow('一次只能选一个职位', 0);
			}
		});
		//点击职位收藏
		$('#poscollect').off().on('click', function () {
            // 判断用户id是否为空，为空则跳转登陆页面
            if (!userid) {
                floatshow('请先登录再收藏', 1);
                return;
            }
			if (position_arr.length == 0) {
				floatshow('请选择一个或多个职位进行收藏', 0);
			} else {
				$.get(vars.jobSite + '?c=job&a=ajaxAddCollectPos&PositionID='+ position_arr.join('~'), function (data) {
					if (data) {
                        floatshow(data.Message, 0);
					} else {
						floatshow('收藏失败，请重试', 0);
					}
				});
			}
		});
		
		/**
         * 显示浮层
         */
	    //弹层显示框
		var floatalert = $('#floatAlert');
        function floatshow(message, type) {
            floatalert.show();
			$('#floatCenter').html(message);
			$('#sure').click(function () {
				floatalert.hide();
                if (type == 1) {
                    util.login();
                }
			})
        }
        // 搜索功能
        // 搜索输入框
        var $searchInput = $('#searchInput');
        // 搜索按钮
        var $searchBtn = $('#searchBtn');
        // 取消按钮
        var $offBtn = $('.off');
        // 首页的输入框
        var $inputBtn = $('#inputBtn');
        // 点击页面输入框出现搜索输入框
        $inputBtn.on('click', function(){
            $(this).parent().hide();
            $('#searchActive').show();
            $searchInput.focus();
        });
        // 清空输入框内容
        $offBtn.on('click', function(){
            $searchInput.val('');
        });
        // 存储筛选条件
        var filterArr = {};
        filterArr['cityname'] = vars.cityname;
        filterArr['type'] = vars.type;
        filterArr['clique'] = vars.clique;
        filterArr['keyword'] = vars.keyword;
        // 搜索事件
        var url = '';
        // 点击搜索按钮触发搜索跳转
        $searchBtn.on('click', search);
        // 手机键盘上的搜索按钮
        $searchInput.on('keyup', function(e){
            if (e.keyCode === 13) {
                search();
            }
        });
        function search(){
            url = vars.jobSite + '?c=job&a=societyList&cityname=' + filterArr['cityname'] + '&type=' + filterArr['type'] + '&clique=' + filterArr['clique'] + '&keyword=' + $searchInput.val();
            window.location = encodeURI(url);
        }
        // 筛选功能
        // 筛选条件容器
        var $filterBox = $('#filterBox');
        // 阴影浮层
        var $float = $('.float');
        // 确认按钮
        var $chooseBtn = $('.chooseBtn');
        // 城市选择按钮
        var $cityBtn = $('#cityBtn');
        // 城市列表
        var $cityBox = $('#cityBox');
        // 类别选择按钮
        var $typeBtn = $('#typeBtn');
        // 类别列表
        var $typeBox = $('#typeBox');
        // 集团选择按钮
        var $cliqueBtn = $('#cliqueBtn');
        // 集团列表
        var $cliqueBox = $('#cliqueBox');
        // 城市筛选事件
        $cityBtn.on('click', function(){
            showExtraFilterBox($(this));
        });
        // 类别筛选事件
        $typeBtn.on('click', function(){
            showExtraFilterBox($(this));
        });
        // 集团筛选事件
        $cliqueBtn.on('click', function(){
            showExtraFilterBox($(this));
        });

        /**
         * 显示或隐藏对应的筛选条件列表
         * @param obj
         */
        function showExtraFilterBox(obj){
            var idName = obj.attr('data-id');
            if (!obj.hasClass('active')) {
                showFilterBox();
                $cityBtn.removeClass('active');
                $typeBtn.removeClass('active');
                $cliqueBtn.removeClass('active');
                obj.addClass('active');
                $cityBox.hide();
                $typeBox.hide();
                $cliqueBox.hide();
                $('#'+idName).show();
                $float.show();
                $chooseBtn.show();
                unable();
                new IScroll('#cityList', {scrollY: true});

            } else {
                hideFilterBox();
                obj.removeClass('active');
                $('#'+idName).hide();
                $float.hide();
                $chooseBtn.hide();
                enable();
            }
        }
        /**
         * 显示筛选条件弹层
         */
        function showFilterBox()
        {
            $filterBox.removeClass('mb8');
            $filterBox.addClass('tabSX');
        }

        /**
         * 隐藏筛选条件弹层
         */
        function hideFilterBox()
        {
            $filterBox.removeClass('tabSX');
            $filterBox.addClass('mb8');
        }
        // 取得选中的筛选条件的文本
        var val = '';
        var $that;
        $('.cityList, .typeList, .cliqueList').find('dd').on('click', function(){
            $that = $(this);
            if (!$that.hasClass('active')) {
                $that.siblings().removeClass('active');
                $that.addClass('active');
                val = $that.text();
                if (val === '不限') {
                    val = '';
                }
            } else {
                $that.removeClass('active');
                val = '';
            }
        });
        //将前面选过的条件与当前选中的条件拼接
        var $key = '';
        $chooseBtn.on('click', function(){
            $key = $(this).attr('data-name');
            filterArr[$key] = val;
            url = vars.jobSite + '?c=job&a=societyList';
            $.each(filterArr, function(index, value){
                if (value !== '') {
                    url = url + '&' + index + '=' + value;
                }
            });
            window.location.href = encodeURI(url);
        });
        // 加载更多
        loadMore({
            url: vars.jobSite + '?c=job&a=ajaxGetSocietyList&cityname=' + filterArr['cityname'] + '&type=' + filterArr['type'] + '&clique=' + filterArr['clique'] + '&keyword=' + vars.keyword,
            total: vars.totalCount,
            pagesize: 20,
            pageNumber: 20,
            moreBtnID: '#loadMore1',
            loadPromptID: '#loadMore',
            contentID: '.UljobList',
            loadAgoTxt: '<a href="javascript:void(0);" class="bt">加载更多...</a>',
            loadingTxt: '<a href="javascript:void(0);" class="bt">努力加载中...</a>',
            loadedTxt: '<a href="javascript:void(0);" class="bt">加载更多...</a>',
            loadedMsg: '<a href="javascript:void(0);" class="bt">没有更多岗位了...</a>',
            firstDragFlag: false
        });
		
		var weixin;
        require.async('weixin/2.0.0/weixinshare', function (Weixin) {
            weixin = new Weixin({
                debug: false,
                shareTitle: '社会招聘-' + '房天下',
                descContent: vars.jobRequire,
                lineLink: location.href,
                swapTitle: false,
                imgUrl: location.protocol + vars.public + '201511/images/loadingpicF.png'
            });
        });
        $(function () {
            /* 分享代码*/
            var SuperShare = require('superShare/1.0.1/superShare');
            //分享按钮
            var config = {
                // 分享的内容title
                title: '社会招聘-' + '房天下',
                // 分享时的图标
                image: window.location.protocol + vars.public + '201511/images/loadingpicF.png',
                // 分享内容的详细描述
                desc: vars.jobRequire,
                // 分享的链接地址
                url: location.href,
                // 分享的内容来源
                from: ' —房天下招聘'
            };
            var superShare = new SuperShare(config);
        });
    }
});