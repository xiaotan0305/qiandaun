$(function () {
    var pageNum = 1;
    var totalCount = $('.totalCount').val();
    var imageSite = $('.imageSite').val();
    var mainSite = $('#mainSite').val();
    var html = '';
    var appendHtml = '';
    var ajaxFlag = true;
    var htmlStr = '<a id="wapesfsy_D04_01" style="display:none; position:fixed; height:37px; width:37px;background: url(';
    htmlStr += imageSite +'/m_public/images/backtop.png';
    htmlStr += ') no-repeat center; background-size:37px 37px;right:8px;bottom:65px;z-index: 99;">&nbsp;</a>';
    var dom = $(htmlStr).appendTo(document.body);
    dom.on('click', function () {
        $('body').animate({scrollTop: 0}, 200);
        setTimeout(function () {
            dom.hide();
        },200);
    });
    $(window).on('resize', function () {
        height = $window.height();
    });
    $('body').on('touchmove',function() {
        var winHeight = $(window).height();
        var scrollHeight = $(document.body).scrollTop();
        var documentHeight = $(document).height();
        console.log(winHeight + ' ' + scrollHeight + ' ' + documentHeight);
        if(scrollHeight + winHeight > documentHeight - 40) {
            getPrizeListAjax();
        }
        if (scrollHeight <= winHeight) {
            if (!dom.is(':hidden')) {
                dom.hide();
            }
        } else if (dom.is(':hidden')) {
            dom.show();
        }
    });
    function getPrizeListAjax() {
        var url =  location.protocol + mainSite +'/huodongAC.d?m=getWinListSelf&class=HitGoldenEggsHc&lotteryId=1&pageCount=' + pageNum;
        if(+totalCount >= pageNum && ajaxFlag) {
            ajaxFlag = false;
            $.ajax({
                url: url,
                type: 'post',
                async: true,
                dataType: 'json',
                success: function (data) {
                    var showList  = Array.prototype.slice.call(data.root.showList);
                    showList.forEach(function(ele,index) {
                        var prizeName = ele.prizename;
                        var time = ele.time.split(' ')[0];
                        html = '<li>' +
                            '<div class="img">' +
                            '<img src="' + imageSite + 'm_activity/HitGoldenEggs/images/priImg.png">' +
                            '</div>' +
                            '<div class="txt">' +
                            '<h3>' + prizeName +'</h3>' +
                            '<p>中奖时间:' + time + '</p>' +
                            '</div>' +
                            '</li>';
                        appendHtml += html;
                    });
                    $('.js_prizeList').append(appendHtml);
                    pageNum ++;
                },
                error: function () {
                    alert('稍后获取奖品哦~');
                },
                complete: function () {
                    setTimeout(function () {
                        ajaxFlag = true;
                    },0);
                }
            });
        }
    }
});