define('modules/bask/setGoodAtTags', ['jquery'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var vars = seajs.data.vars;
        // jquery库
        var $ = require('jquery');
        // 推荐标签换一换按钮
        var $changeTags = $('#changeTags');
        // 推荐标签容器
        var $recommendBox = $('.recommendTags');
        // 已添加标签容器
        var $completedTagBox = $('.completedTagBox');
        // 已添加标签长度-规定不能超过5个
        var len = 0;
        // 浮层
        var $float = $('.floatip');
        // 搜索标签外围容器
        var $searchBigBox = $('.searchBigBox');
        // 提交按钮
        var $sub = $('.sub');
        // 搜索框输入值后进行联想
        var inputTxt = $('#searchAdd'),
            inputVal = '',
            searchTag = $('.searchTagBox');
        // 搜索框内删除按钮
        var $off = $('.off');
        // 清空搜索框内容
        $off.click(function () {
            inputTxt.val('');
            searchTag.html('');
            $off.hide();
        });
        // 去重-推荐标签中不应该包含已添加的标签
        // 取已添加标签转成数组
        function distinct($obj) {
            // 所有已添加标签
            var a = $completedTagBox.find('a');
            var tmp = [];
            $.each(a, function (i) {
                tmp[i] = $(this).text();
            });
            // 判断传入的对象/元素是否与数组中重复,重复则删除该对象
            var $rm = $obj;
            if ($.inArray($rm, tmp) !== -1) {
                return true;
            } else {
                return false;
            }
        }
        // 浮层提示信息变化及显示
        function toastMsg(msg, url) {
            $float.find('.messageBox').html(msg);
            $float.show();
            setTimeout(function () {
                $float.hide();
                if (url) {
                    window.location.href = url;
                }
            }, 2000);
        }
        // 推荐标签换一换功能
        $changeTags.on('click', function () {
            $.post(vars.askSite + '?c=bask&a=ajaxGetRecommendTags', {}, function (data) {
                var str = '';
                if (data) {
                    $.each(data, function (k, v) {
                        if (!distinct(v.Keyword)) {
                            str += '<a href="javascript:void(0);">' + v.Keyword + '<span class="tag2"></span></a>';
                        }
                    });
                } else {
                    return false;
                }
                $recommendBox.html(str);
            });
        });
        // ajax执行标志
        var ajaxFlag = 0;
        inputTxt.on('input', function () {
            $off.show();
            inputVal = inputTxt.val();
            if (ajaxFlag) {
                ajaxFlag.abort();
                ajaxFlag = 0;
            }
            ajaxFlag = $.ajax({
                url: vars.askSite + '?c=bask&a=ajaxGetAssociateTags&q=' + inputVal,
                success: function (data) {
                    if (data) {
                        $searchBigBox.show();
                        searchTag.html('');
                        $.each(data.tag, function (i) {
                            if (!distinct(data.tag[i].tagName)) {
                                searchTag.append('<a href="javascript:void(0);">' + data.tag[i].tagName + '<span class="tag2"></span></a>');
                            }
                        });
                    } else {
                        searchTag.html('');
                        $searchBigBox.hide();
                    }
                }
            });
        });
        // 删除已添加标签
        $completedTagBox.on('click', 'a', function () {
            var $tag1 = $(this);
            $tag1.remove();
            len = $completedTagBox.find('a').length;
            if (len > 0) {
                len--;
            }
        });
        // 添加标签
        $('.recommendTags, .searchTagBox').on('click', 'a', function () {
            len = $completedTagBox.find('a').length;
            if (len > 4) {
                toastMsg('最多能添加5个标签');
                return false;
            }
            var $tag2 = $(this);
            // 如果要添加的标签在已添加标签中存在不让添加
            if (distinct($tag2.text())) {
                toastMsg('您已添加该标签');
                return false;
            }
            $completedTagBox.append('<a href="javascript:void(0);">' + $tag2.text() + '<span class="tag1"></span></a>');
            $tag2.remove();
            len++;
        });

        // 去掉页面首次加载推荐标签中的重复标签
        // 推荐标签下的所有标签
        var recommendTagObj = $recommendBox.find('a');
        $.each(recommendTagObj, function () {
            var t = $(this);
            if (distinct(t.text())) {
                t.remove();
            }
        });
        // 首次加载检查推荐标签是否有内容
        if ($recommendBox.find('a').length <= 0) {
            toastMsg('推荐标签出问题了，点击换一换试试');
        }
        // 首次加载检查已添加标签-数据错误提示错误跳转列表页-无数据则提示添加
        if (vars.noaddtag !== 'error' && $completedTagBox.find('a').length <= 0) {
            toastMsg('标签加载失败', vars.askSite + '?c=bask&a=index&grouptype=' + vars.grouptype + '&zhcity=' + vars.cityname + '&src=client');
        }
        // 提交数据
        $sub.on('click', function () {
            var tagstr = '';
            $.each($completedTagBox.find('a'), function () {
                tagstr += $(this).text() + ',';
            });
            $.get(vars.askSite + '?c=bask&a=ajaxSetEditAttentionTag&tagname=' + encodeURIComponent(tagstr), {}, function (data) {
                if (data === '1') {
                    toastMsg('提交成功', vars.askSite + '?c=bask&a=index&grouptype=' + vars.grouptype + '&zhcity=' + vars.cityname + '&src=client');
                } else {
                    toastMsg('提交失败');
                }
            });
        });
        // 浮层点击消失
        $float.on('click', function () {
            $(this).hide();
            $(this).find('.messageBox').html('');
        });
    };
});