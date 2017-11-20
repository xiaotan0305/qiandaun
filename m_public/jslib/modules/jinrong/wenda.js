define('modules/jinrong/wenda', ['jquery'],function (require,exports,module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var bua = navigator.userAgent.toLowerCase(),
            isApple = bua.indexOf('iphone') !== -1 || bua.indexOf('ios') !== -1,
            k = true,
            $window = $(window),
            $document = $(window.document),
            loadMore = $('div.draginner'),
            cid = $('input#cid').val(),
            asktitle = $('input#asktitle').val(),
            pagesize = parseInt($('input#pagesize').val()),
            page = 2,
            tablelist = $('table.gra-bor-table');
        function loadmore() {
            k = false;
            loadMore.css({'padding-left': '10px',background: 'url(//img2.soufun.com/wap/touch/img/load.gif) 0 50% no-repeat'});
            loadMore.innerHTML = '<a href="javascrip:void(0)" >正在加载请稍后</a>';
            var nowUrl = vars.jinrongSite + '?c=jinrong&a=ajaxGetwenda&city=' + vars.city;
            $.get(nowUrl + '&r=' + Math.random(),{p: page,keyword: asktitle,cid: cid},function (data) {
                tablelist.append(data);
                loadMore.css({'padding-left': '0px',background: ''});
                loadMore.innerHTML = '<a href="javascrip:void(0)" >上拉自动加载更多</a>';
                page++;
                k = true;
                var totalpage = Math.ceil(parseInt($('#totalCount').val()) / pagesize);
                if (page > totalpage) {
                    loadMore.hide();
                    k = false;
                }
            });
        }
// 滚动到页面底部时，页面滚动到底部时页面自动加载
        $window.bind('scroll',function () {
            var scrollh = $document.height();
            if (isApple) {
                scrollh -= 140;
            }else {
                scrollh -= 80;
            }
            if (k !== false && $document.scrollTop() + $window.height() >= scrollh) {
                loadmore();
            }
        });
        $('#getSearch').click(function () {
            var askTitle = $('input#input').val();
            if (askTitle !== '') {
                window.location = vars.jinrongSite + '?c=jinrong&a=wenda&cid=1&keyword=' + askTitle + '&city=' + vars.city;
            }else {
                alert('请输入搜索内容!');
            }
        });
    };
});