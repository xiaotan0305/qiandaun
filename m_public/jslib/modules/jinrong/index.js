define('modules/jinrong/index', ['jquery'],function (require,exports,module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var bua = navigator.userAgent.toLowerCase(),
            isApple = bua.indexOf('iphone') !== -1 || bua.indexOf('ios') !== -1,
            k = true,
            $window = $(window),
            $document = $(window.document),
            searchbtn = $('div#searchbtn').children('a'),
            loan = $('#loan'),
            year = $('#year'),
            info = $('#info'),
            house = $('#house'),
            type = $('#type'),
            loanMoney = $('#loanMoney'),
            loanYear = $('#loanYear'),
            houseinfo = $('#houseinfo'),
            houseshow = $('#houseshow'),
            loadMore = $('#loadMore'),
            pagesize = 10,
            page = 2,
            housetype = $('ul#housetype li'),
            housetype2 = $('ul#housetype2 li'),
            housetype3 = $('ul#housetype3 li'),
            housetypemore = housetype.filter(function (index) {
                return index > 5;
            });
        housetypemore.hide();
        function loadmore() {
            k = false;
            loadMore.css({'padding-left': '10px',background: 'url(//img2.soufun.com/wap/touch/img/load.gif) 0 50% no-repeat'});
            loadMore.innerHTML = '<a href="javascrip:void(0)" >正在加载请稍后</a>';
            var loanVal = loan.val();
            if (loanVal === '') {
                loanVal = loanMoney.val();
            }
            var yearVal = year.val();
            if (yearVal === '') {
                yearVal = loanYear.val();
            }
            var houseVal = house.val();
            var infoVal = info.val();
            var typeVal = type.val();
            var nowUrl = vars.jinrongSite + '?c=jinrong&a=ajaxGetHouseList&loan=' + loanVal + '&year=' + yearVal + '&house=' + houseVal + '&info='
                + infoVal + '&type=' + typeVal + '&city=' + vars.city + '&pagesize=' + pagesize;
            $.get(nowUrl + '&r=' + Math.random(),{page: page},function (data) {
                houseinfo.find('#houselist').append(data);
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
        function searchlist() {
            var loanVal = loan.val();
            if (loanVal === '') {
                loanVal = loanMoney.val();
            }
            var yearVal = year.val();
            if (yearVal === '') {
                yearVal = loanYear.val();
            }
            var houseVal = house.val();
            var infoVal = info.val();
            var typeVal = type.val();
            $.ajax({url: vars.jinrongSite + '?c=jinrong&a=ajaxSearchList&loan=' + loanVal + '&year=' + yearVal + '&house=' + houseVal + '&info=' + infoVal
            + '&type=' + typeVal + '&r=' + Math.random(),
                success: function (moredata) {
                    if (moredata) {
                        houseinfo.html(moredata);
                        loadMore = houseinfo.find('#loadMore');
                    }
                }});
            k = true;
            page = 2;
        }
        houseshow.click(function () {
            if (housetypemore.is(':hidden')) {
                housetypemore.show();
                houseshow.removeClass('catmore1').addClass('catmore2');
            }else {
                housetypemore.hide();
                houseshow.removeClass('catmore2').addClass('catmore1');
            }
        });
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
        searchbtn.on('click',function () {
            searchlist();
        });
        var houseTypeInputs = [house,type,info];
        $.each([housetype,housetype2,housetype3],function (i,obj) {
            obj.each(function (index,element) {
                $(element).children('a').on('click',function () {
                    obj.removeClass('cur');
                    $(element).addClass('cur');
                    houseTypeInputs[i].val(index);
                    searchlist();
                });
            });
        });
        var loanDefaults = [loanMoney,loanYear];
        $.each([loan,year],function (i,input) {
            input.unbind().bind({
                click: function () {
                    input.val('');
                },
                blur: function () {
                    if (input.val() === '') {
                        input.val(loanDefaults[i].val());
                    }
                }
            });
        });
    };
});