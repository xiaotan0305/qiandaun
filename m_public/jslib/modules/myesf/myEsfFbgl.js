define('modules/myesf/myEsfFbgl', ['jquery'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        // @我的二手房发布管理页面js
        // 短信短链接（点击短信跳到app）
        require.async(vars.public + 'js/autoopenapp_sfut.js');
        localStorage.removeItem('newcount_esffabu');
        // 清空新发布的new信息
        // 显示/隐藏 求购下方的操作栏
        $('[name*="rent"]').each(function () {
            var oThis = $(this);
            oThis.click(function () {
                if (oThis.attr('class').indexOf('up') !== -1) {
                    oThis.attr('class', 'zhed-arr-dn').parent().next().hide();
                } else {
                    oThis.attr('class', 'zhed-arr-up').parent().next().show();
                }
            });
        });

        // 求购 删除 按钮绑定动作
        $('.del').on('click', function () {
            var houseid = $(this).attr('id');
            if (confirm('确认删除该房源？')) {
                var url = vars.mySite + 'index.php?c=myesf&a=ajaxMyEsfDelQg&city=' + vars.city + '&houseid=' + houseid + '&r=' + Math.random();
                // $.post(url,function(data){
                $.getJSON(url, function (data) {
                    if (data === '1') {
                        alert('删除成功');
                        var esfpubcount = localStorage.getItem('esfpubcount');
                        localStorage.setItem('esfpubcount', parseInt(esfpubcount) - 1);
                        location.reload();
                    } else {
                        alert('删除失败，请稍后再试');
                    }
                });
                // $.getJSON
            }
            // if
        });

        // 出售房源刷新
        $('.refleshmyesf').click(function () {
            var houseid = $(this).attr('id');
            $.ajax({
                type: 'get',
                url: '?c=myesf&a=ajaxMyEsfReflesh&houseid=' + houseid + '&city=' + vars.city + '&r=' + Math.random(),
                success: function (data) {
                    if (data === 0) {
                        alert('刷新失败，请稍后再试');
                    } else if (data.result === '0') {
                        alert('刷新成功！');
                        location.reload();
                    } else {
                        alert(data.message);
                    }
                }
            });
        });

        // 非电商，个人发布出售房源，删除
        $('.deletemyesf').click(function () {
            var houseid = $(this).attr('id');
            $.ajax({
                type: 'get',
                url: '?c=myesf&a=ajaxDeleteGrChouShou&houseid=' + houseid + '&city=' + vars.city + '&r=' + Math.random(),
                success: function (data) {
                    if (data === 0) {
                        alert('删除失败，请稍后再试');
                    } else if (data.result === '0') {
                        // data.result
                        alert('删除成功！');
                        var esfpubcount = localStorage.getItem('esfpubcount');
                        localStorage.setItem('esfpubcount', parseInt(esfpubcount) - 1);
                        location.reload();
                    } else {
                        alert(data.message);
                    }
                }
            });
        });
    };
});