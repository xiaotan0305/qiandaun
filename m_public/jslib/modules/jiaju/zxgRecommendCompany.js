/**
 * @file 装修馆案例详情页
 * @author bjxuying@fang.com on 16-12-26.
 */
define('modules/jiaju/zxgRecommendCompany', ['jquery', 'lazyload/1.9.1/lazyload', 'loadMore/1.0.0/loadMore', 'iscroll/2.0.0/iscroll-lite'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var ajaxFlag = true;
        var IScroll = require('iscroll/2.0.0/iscroll-lite');
        var toggleTouchmove = (function () {
            function preventDefault(e) {
                e.preventDefault();
            }
            return function (unable) {
                document[unable ? 'addEventListener' : 'removeEventListener']('touchmove', preventDefault);
            };
        })();
        // 为了固定展示公司位置，首先给头部增加fixed
        $('header').addClass('fixedBox').css('z-index','100');
        // 当前页面回退两步
        $('.back').attr('href','javascript:history.go(-2)');
        var zxBudget = $('#zxBudget');
        var budgetAmount = zxBudget.find('.cur').data('val');
        var loadMore = require('loadMore/1.0.0/loadMore');
        require('lazyload/1.9.1/lazyload');
        $('.lazyload').lazyload();
        loadMore({
            // 接口地址
            url: vars.jiajuSite + '?c=jiaju&a=ajaxMoreRecommend',
            // 数据总条数
            total: vars.total,
            // 首屏显示数据条数
            pagesize: vars.pagesize,
            // 单页加载条数，可不设置
            pageNumber: vars.pagesize,
            // 加载更多按钮id
            moreBtnID: '#loadMore',
            // 加载数据过程显示提示id
            loadPromptID: '#moreContent',
            // 数据加载过来的html字符串容器
            contentID: '#loadstart'
        });

        // 数据请求失败时, 点击刷新
        $('#notfound').on('click', function () {
            $('#loadMore').hide();
            $.ajax({
                type: 'GET',
                url: vars.jiajuSite + '?c=jiaju&a=ajaxMoreRecommend',
                data: {page: 1},
                success: function (data) {
                    if (false != data) {
                        $(this).hide();
                        $('.houseList').html(data);
                        $('.lazyload').lazyload();
                        loadMore({
                            // 接口地址
                            url: vars.jiajuSite + '?c=jiaju&a=ajaxMoreRecommend',
                            // 数据总条数
                            total: data.companylistnum,
                            // 首屏显示数据条数
                            pagesize: vars.pagesize,
                            // 单页加载条数，可不设置
                            pageNumber: vars.pagesize,
                            // 加载更多按钮id
                            moreBtnID: '#loadMore',
                            // 加载数据过程显示提示id
                            loadPromptID: '#moreContent',
                            // 数据加载过来的html字符串容器
                            contentID: '#loadstart'
                        });
                    }
                }
            });
        });

        // 装修预算
        var $maskFixed = $('.sf-maskFixed');
        var optionInfo = $('#optionInfo');
        var zxBudgetCon = $('#zxBudgetCon');
        var sendCompany = $('#sendCompany');
        var companyids = [];
        var companyInput = [];
        var loadStart = $('#loadstart');
        // toast提示
        var sendFloat = $('#sendFloat');
        var sendText = $('#sendText');

        function toast(content) {
            sendFloat.show();
            toggleTouchmove(true);
            sendText.html(content);
            setTimeout(function () {
                sendText.html('');
                sendFloat.hide();
                toggleTouchmove(false);
            }, 3000);
        };
        // 获取的公司id
        loadStart.on('click',function (e) {
            var $ele = $(e.target);
            if($ele[0].nodeName.toLowerCase() === 'input') {
                var i = $ele.attr('data-companyid');
                var index = $.inArray(i, companyids);
                if (index > -1) {
                    companyids.splice(index, 1);
                    companyInput.splice(index,1);
                } else if (companyids.length < 3) {
                    companyids.push(i);
                    companyInput.push($ele);
                } else {
                    e.preventDefault();
                    toast('装修公司最多选择三个，您超额了哦~');
                }
                sendCompany[companyids.length ? 'removeClass' : 'addClass']('noClick');
            }
        });
        // 装修预算-输入框选择弹出
        zxBudget.on('click', function () {
            toggleTouchmove(true);
            $maskFixed.css('z-index','999').show();
            // 装修预算浮层滚动
            zxBudgetCon.show();
            IScroll && new IScroll('#zxBudgetCon');
        });
        // 装修预算-输入框关闭
        $maskFixed.on('click',function (event) {
            var $ele = $(event.target);
            if($ele.hasClass('sf-bdmenu') || $ele.parents('.sf-bdmenu').length) {
                if($ele.hasClass('cancel')) {
                    $maskFixed.hide();
                    zxBudgetCon.hide();
                    toggleTouchmove(false);
                }
                if($ele[0].nodeName.toLowerCase() === 'li') {
                    var value = $ele.attr('value');
                    var text = $ele.text();
                    zxBudget.find('.cur').text(text);
                    optionInfo.text(text);
                    budgetAmount = value;
                    $ele.addClass('active');
                    setTimeout(function () {
                        $maskFixed.hide();
                        zxBudgetCon.hide();
                        toggleTouchmove(false);
                        $ele.removeClass('active').siblings().removeClass('activeS');
                        $ele.addClass('activeS');
                    },400);
                }
            } else {
                $maskFixed.hide();
                zxBudgetCon.hide();
                toggleTouchmove(false);
            }

        });

        // 提交选择的公司以及预算
        sendCompany.on('click', function () {
            var companyid = companyids.join(',');
            if(ajaxFlag && !sendCompany.hasClass('noClick')) {
                ajaxFlag = false;
                $.ajax({
                    type: 'GET',
                    url: vars.jiajuSite + '?c=jiaju&a=ajaxSelectCompany&r=' + Math.random(),
                    data: {
                        companyids: companyid,
                        customername: vars.customername,
                        budgetlimit: budgetAmount
                    },
                    success: function (q) {
                        if (q.IsSuccess === '1') {
                            toast('预约成功！随后装修公司将与您电话联系哦~');
                            setTimeout(function () {
                                // 跳转到找设计页面vars.findDesignUrl
                                window.location.href = vars.findDesignUrl;
                                // 清除当前选择公司的状态
                                companyInput.forEach(function (ele) {
                                    ele.get(0).checked = false;
                                });
                            },3000);
                        } else {
                            toast(q.Message);
                        }
                    },
                    complete: function () {
                        ajaxFlag = true;
                    }
                });
            }
        });
    };
});