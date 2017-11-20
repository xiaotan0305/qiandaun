define('modules/bask/setConcernHouse', ['jquery'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var vars = seajs.data.vars;
        // jquery库
        var $ = require('jquery');
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
        // 城市
        var $city = $('#city').text();
        // 搜索框输入值后进行联想
        var inputTxt = $('#searchAdd'),
            inputVal = '',
            searchTag = $('.searchTagBox');
        // 搜索框内删除按钮
        var $off = $('.off');
        // 小区还是楼盘
        var $type = vars.type;
        // 清空搜索框内容
        $off.click(function () {
            inputTxt.val('');
            searchTag.html('');
            $off.hide();
        });
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
        // 去重-推荐标签中不应该包含已添加的标签
        // 取已添加标签转成数组
        function distinct($obj) {
            // 所有已添加标签
            var a = $completedTagBox.find('a');
            var tmp = [];
            $.each(a, function (i) {
                tmp[i] = $(this).text();
            });
            // 判断传入的标签是否与数组中重复
            var $rm = $obj;
            if ($.inArray($rm, tmp) !== -1) {
                return true;
            } else {
                return false;
            }
        }
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
                url: vars.askSite + '?c=bask&a=ajaxGetAssociateHouse&cityname=' + $city + '&q=' + inputVal + '&type=' + $type,
                success: function (data) {
                    if (data !== '' && data !== false) {
                        $searchBigBox.show();
                        searchTag.html('');
                        if ($type === 'loupan') {
                            $.each(data, function (i) {
                                if (!distinct(data[i].name)) {
                                    searchTag.append('<a href="javascript:void(0);" id="' + data[i].newcode + '">' + data[i].name
                                        + '<span class="tag2"></span></a>');
                                }
                            });
                        } else if ($type === 'xiaoqu') {
                            $.each(data, function (i) {
                                if (!distinct(data[i].projname)) {
                                    searchTag.append('<a href="javascript:void(0);" id="' + data[i].id + '">' + data[i].projname
                                        + '<span class="tag2"></span></a>');
                                }
                            });
                        }
                    } else {
                        $searchBigBox.show();
                        if ($type === 'loupan') {
                            searchTag.html('<p>搜不到楼盘？请检查城市是否正确、楼盘名字是否正确。</p>');
                        } else if ($type === 'xiaoqu') {
                            searchTag.html('<p>搜不到小区？请检查城市是否正确、小区名字是否正确。</p>');
                        }
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
        searchTag.on('click', 'a', function () {
            len = $completedTagBox.find('a').length;
            if (len > 4) {
                if ($type === 'loupan') {
                    toastMsg('最多能添加5个楼盘');
                } else {
                    toastMsg('最多能添加5个小区');
                }
                return false;
            }
            var $tag2 = $(this);
            $completedTagBox.append('<a href="javascript:void(0);" id="' + $tag2.attr('id') + '">' + $tag2.text() + '<span class="tag1"></span></a>');
            $tag2.remove();
            len++;
        });
        // 首次加载检查已添加标签-数据错误提示错误跳转列表页-无数据则提示添加
        if (vars.noaddtag !== 'error' && $completedTagBox.find('a').length <= 0) {
            if ($type === 'loupan') {
                toastMsg('楼盘加载失败', vars.askSite + '?c=bask&a=index&grouptype=' + vars.grouptype + '&zhcity=' + $city + '&src=client');
            } else {
                toastMsg('小区加载失败', vars.askSite + '?c=bask&a=index&grouptype=' + vars.grouptype + '&zhcity=' + $city + '&src=client');
            }
        }
        // 提交数据
        $sub.on('click', function () {
            var tagstr = '';
            var codestr = '';
            $.each($completedTagBox.find('a'), function () {
                tagstr += $(this).text() + ',';
                codestr += $(this).attr('id') + ',';
            });
            $.get(vars.askSite + '?c=bask&a=ajaxSetEditAttentionNewcode&newcodename=' + tagstr + '&newcode=' + codestr + '&cityname='
                + $city, {}, function (data) {
                if (data === '1') {
                    toastMsg('提交成功', vars.askSite + '?c=bask&a=index&grouptype=' + vars.grouptype + '&zhcity=' + $city + '&settag=1' + '&src=client');
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