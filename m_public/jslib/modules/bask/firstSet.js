/**
 * Created by hanxiao on 2017/12/7.
 */
define('modules/bask/firstSet', ['jquery'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;

        var inputTxt = $('#inputS');
        var inputVal = '';
        // 已添加标签的容器
        var $completedTagBox = $('#tagBox');
        // 搜索结果小区列表容器
        var ulList = $('#ulList');
        // 热门小区列表容器
        var hotList = $('#hotList');
        // ajax执行标志
        var ajaxFlag = 0;
        inputTxt.on('input', function () {
            inputVal = inputTxt.val();
            if (ajaxFlag) {
                ajaxFlag.abort();
                ajaxFlag = 0;
            }
            ajaxFlag = $.ajax({
                url: vars.askSite + '?c=bask&a=ajaxGetAssociateHouse&q=' + inputVal + '&type=xiaoqu&cityname=' + vars.cityname,
                success: function (data) {
                    if (data !== '' && data !== false) {
                        hotList.hide();
                        $('#nores').hide();
                        ulList.html('');
                        $.each(data, function (i) {
                            if (!distinct(data[i].projname ) && ulList.find('li').length < 5) {
                                ulList.append('<li><span class="tag-ad"> <a data-code="' + data[i].id + '" data-proname="' + data[i].projname + '" data-dis="' + data[i].district + '" href="javascript:void(0);">添加</a> </span>[' + data[i].district + ']' + data[i].projname + '</li>');
                            }
                        });
                        $('#seaList').show();
                    } else {
                        $('#seaList').hide();
                        $('#nores').show();
                    }
                }
            });
        });

        // 点击热门小区列表中的添加，将对应小区添加进标签容器
        hotList.on('click', 'a', function(){
            $completedTagBox.find('a').hide();
            if ($completedTagBox.find('div').length > 4) {
                showMsg('最多设置5个~');
                return false;
            }

            if (distinct($(this).attr("data-proname"))) {
                showMsg('此小区已添加');
                return false;
            }
            $completedTagBox.append('<div data-code="' + $(this).attr("data-code") + '" data-proname="' + $(this).attr("data-proname") + '" class="chtd">' + $(this).attr("data-proname") + '<span class="close"></span></div>');
            $(this).parent().parent().remove();
            changeHotListindex();
        });

        // 改变热门小区的序列号
        function changeHotListindex(){
            var i = 1;
            hotList.find('li').each(function(){
                $(this).find('i').text(i++);
                if (hotList.find('li').length < 4) {
                    $(this).find('i').removeClass('no2');
                }
            });
        }

        // 点击搜索结果小区列表中的添加，将对应小区添加进标签容器
        ulList.on('click', 'a', function() {
            $completedTagBox.find('a').hide();
            if ($completedTagBox.find('div').length > 4) {
                showMsg('最多设置5个~');
                return false;
            }

            if (distinct($(this).attr("data-proname"))) {
                showMsg('此小区已添加');
                return false;
            }

            $completedTagBox.append('<div data-code="' + $(this).attr("data-code") + '" data-proname="' + $(this).attr("data-proname") + '" class="chtd">' + $(this).attr("data-proname") + '<span class="close"></span></div>');
            $(this).parent().parent().remove();
        });

        // 点击确定按钮提交数据
        $('#sub').on('click', function(){
            if ($completedTagBox.find('div').length < 1) {
                showMsg('请添加至少一个小区~');
                return false;
            }
            var tagstr = '';
            var codestr = '';
            $.each($completedTagBox.find('div'), function () {
                tagstr += $(this).attr('data-proname') + ',';
                codestr += $(this).attr('data-code') + ',';
            });
            $.get(vars.askSite + '?c=bask&a=ajaxSetEditAttentionNewcode&newcodename=' + tagstr + '&newcode=' + codestr + '&cityname='
                + vars.cityname, {}, function (data) {
                if (data === '1') {
                    window.location.href = vars.askSite + '?c=bask&a=askMeList'
                } else {
                    showMsg('提交失败,请重试');
                }
            });
        });

        // 去重-推荐标签中不应该包含已添加的标签
        // 取已添加标签转成数组
        function distinct($obj) {
            // 所有已添加标签
            var a = $completedTagBox.find('div');
            var tmp = [];
            $.each(a, function (i) {
                tmp[i] = $(this).attr('data-proname');
            });

            // 判断传入的标签是否与数组中重复
            if ($.inArray($obj, tmp) !== -1) {
                return true;
            } else {
                return false;
            }
        }

        function showMsg(msg) {
            $('#msgtxt').text(msg);
            $('.floatip').show();
        }

        // 点击已添加标签上的关闭按钮删除当前标签
        $completedTagBox.on('click', 'span', function(){
            $(this).parent().remove();
            if ($completedTagBox.find('div').length === 0) {
                $completedTagBox.find('a').show();
            }
        });
        // 关闭提示弹层
        $('#fclose').on('click', function(){
            $('.floatip').hide();
        });
    };
});