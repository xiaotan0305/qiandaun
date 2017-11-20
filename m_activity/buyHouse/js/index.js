/**
 * Created by sunwenxiu on 2017/4/5.
 */
$(function () {
    'use strict';
    var $city = $('#city');
    // 存放城市简拼
    var $cityCopy = $('#city1');
    var $msg = $('#msg');
    var mainSite = $('#mainSite').val();
    // 错误信息弹框显示标识
    var isShow = false;

    /**
     * 错误提示信息显示
     * @param msg
     */
    function showErr(msg) {
        msg && $msg.find('p').text(msg);
        $msg.show();
        isShow = true;
        setTimeout(function () {
            $msg.hide();
            isShow = false;
        }, 1000);
    }

    // 微信分享对象
    var weixin;
    // 微信分享参数
    var ops = {
        // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        debug: false,
        shareTitle: '购房实力大比拼',
        descContent: '魔镜魔镜告诉我，我的购房实力几颗星',
        lineLink: location.href,
        imgUrl: $('#srcSite').val() + '/common_m/m_activity/buyHouse/images/share.jpg',
        swapTitle: true
    };

    /**
     * 获取对应房源信息
     * @param income
     * @param city
     */
    function getData(income, city) {
        var yueGong = (income * 0.4).toFixed(0);
        var url = mainSite + '/huodongAC.d?m=compettitionAbility&class=PurchaseAbilityHc&income=' + income + '&city=' + city;
        $.ajax({
            type: 'GET',
            url: url,
            dataType: 'json',
            success: function (response) {
                var data = response.root;
                if (data.isEmpty === 'true') {
                    // 没有房源的话
                    $('#pg5').show();
                } else if (data.isEmpty === 'false') {
                    if (income <= 10000) {
                        $('.yg2').text(yueGong);
                        $('#pg2').show();
                    } else if (income <= 30000 && income > 10000) {
                        $('.yg3').text(yueGong);
                        $('#pg3').show();
                    }
                    var $detailsPage = $('.detailsPage');
                    $detailsPage.attr('href', data.detailsPage);
                    $detailsPage.attr('data-type', 'PurchaseAbilityHc');
                    $detailsPage.attr('data-name', '房源点击');
                    $detailsPage.attr('id', 'button3');
                    var img = new Image();
                    img.src = data.houseImage;
                    img.onload = function () {
                        $('.houseImg').append(img);
                    };
                    $('.disName').text(data.districtName);
                    $('.room').text(data.room);
                    $('.area').text(data.area + '㎡');
                    $('.price').text(data.totalPrice);
                }
            }
        });
    }

    var city;
    // 标识城市是否存在
    var cityExist = true;
    // 揭晓真相按钮计算
    $('.toreal').on('click', function () {
        var shouRu = +$('#shouRu').val();
        city = $cityCopy.val();
        if(!cityExist) {
            // 城市不存在
            $city.val('');
            !isShow && showErr('填写正确信息才能测算哦');
            return;
        }
        // 填写不完整 提示错误
        if (!shouRu || !city) {
            showErr('填写完整信息才能测算哦');
            return;
        }
        $('#pg1').hide();
        if (shouRu > 30000) {
            ops.descContent = '我的购房实力是5星~土豪驾到请回避，以免造成心灵暴击伤害';
            $('#pg4').show();
            weixin.updateOps(ops);
        }else if(shouRu <= 30000) {
            if (shouRu <= 10000) {
                ops.descContent = '我的购房实力是3星~辛辛苦苦三五年，口袋依然没有钱';
                $('#part3Img')[0].src = $('#srcSite').val() + '/common_m/m_activity/buyHouse/images/pic2_'
                    + Math.round(Math.random() * 5 + 25) + '.png';
            } else if (shouRu <= 30000 && shouRu > 10000) {
                ops.descContent = '我的购房实力是4星~都市新精英，傲娇小中产一枚';
                $('#part2Img')[0].src = $('#srcSite').val() + '/common_m/m_activity/buyHouse/images/pic3_'
                    + Math.round(Math.random() * 5 + 25) + '.png';
            }
            weixin.updateOps(ops);
            getData(shouRu, city);
        }
    });
    /**
     * 判断是否是微信
     * @returns {boolean}
     */
    function isWeiXin(){
        var ua = window.navigator.userAgent.toLowerCase();
        if(ua.match(/MicroMessenger/i) == 'micromessenger'){
            return true;
        }else{
            return false;
        }
    }
    // 重新计算
    $('.retry').on('click', function () {
        if(isWeiXin()) {
            // 兼容微信里刷新问题
            window.location.href= window.location.href + '&random=' + Math.random();
        } else {
            location.reload();
        }
    });
    // 抚慰心灵按钮
    $('.awardHeart').on('click', function () {
        $('.floatBox').hide();
        location.href = mainSite + '/huodongAC.d?m=getLotteryInfo&class=CommonFanfanleHc&lotteryId=88&'
            + 'city=' + city + '&channel=others';
    });
    // 数钱数到手抽筋
    $('.choujin').on('click', function () {
        location.href = mainSite + '/my/?c=myesf&a=saleStaup';
    });
    var $cityUl = $('#cityUl');

    /**
     * 模糊查询城市
     * @param citystr
     */
    function queryCity(citystr) {
        citystr = encodeURIComponent(encodeURIComponent(citystr));
        var url = mainSite + '/activity.d?m=getCityWithCode&cityName=' + citystr;
        $.ajax({
            type: 'GET',
            url: url,
            timeout: 2000,
            cache: false,
            dataType: 'json',
            async: false,
            success: function (data) {
                var resHtml = '';
                var datalen = data.length;
                if (datalen === 0) {
                    // 不存在的城市
                    cityExist = false;
                } else {
                    cityExist = true;
                    for (var i = 0; i < datalen; i++) {
                        resHtml += '<li enName=\'' + data[i][1] + '\'>' + data[i][0] + '</li>';
                    }
                    $cityUl.html(resHtml);
                    $cityUl.show();
                    if (datalen === 1) {
                        $cityCopy.val(data[0][1]);
                        //$city.val(data[0][0]);
                    }
                }
            }
        });
    }

    var win = $(window);
    win.on('resize', function () {
        document.body.scrollTop = win.height() - document.body.clientHeight;
    });
    // 输入选择城市
    $city.on('input focus', function () {
        var cityVal = $city.val();
        if (cityVal.trim()) {
            queryCity(cityVal.trim());
        } else {
            $city.val('');
            $cityCopy.val('');
            $cityUl.hide();
        }
    }).on('blur', function () {
        var selectLi = $cityUl.find('li');
        if (selectLi.length === 1 && selectLi.text() === $city.val()) {
            $cityUl.hide();
        }
        if(!cityExist) {
            $cityUl.hide();
        }
    });
    // li上选择城市
    $cityUl.on('click', 'li', function () {
        var $this = $(this);
        $city.val($this.html());
        $cityCopy.val($this.attr('enname'));
        $cityUl.hide();
    });
    // 微信分享
    weixin = new Weixin(ops);
});