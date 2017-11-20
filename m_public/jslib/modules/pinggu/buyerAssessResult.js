/**
 * Created by user on 2016/1/21.
 */
/**
 * Created by zcf on 2016/1/19.
 * @file 查房价购房能力评估结果页
 * @author zcf(zhangcongfeng@fang.com)
 */
define('modules/pinggu/buyerAssessResult', ['jquery','lazyload/1.9.1/lazyload'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        require('lazyload/1.9.1/lazyload');
        // 换一换id
        var change = $('#change');
        // 推荐房源id
        var houseSource = $('#houseSource');
        // 推荐房源总条数
        var total = vars[vars.type + 'RecommendHouseNum'];
        // 每页显示4个,计算总页数
        var totlaPage = Math.ceil(total / 4);
        var firstLi = houseSource.find('.firstP');
        var secondLi = houseSource.find('.secondP');
        var thirdLi = houseSource.find('.thirdP');
        var url = vars.pingguSite + '?c=pinggu&a=changeRecommendHouse';
        var dataObj = {city: vars.city, districtId: vars.districtId, type: vars.type, totalPrice: vars.totalPrice,
            avePriceMin: vars.avePriceMin, avePriceMax: vars.avePriceMax, areaMin: vars.areaMin, areaMax: vars.areaMax, page: 4};
        var flag = true;
        houseSource.find('img').lazyload({threshold: 200});
        // 隐藏换一换按钮
        function hideChange(index) {
            if (totlaPage <= index) {
                change.hide();
            }
        }
        // 换一换点击事件
        if (change.length) {
            change.on('click',function () {
                var length = thirdLi.length;
                var secondLiDis = secondLi.css('display');
                var thirdLiDis = length > 0 ? thirdLi.css('display') : 'none';
                if (secondLiDis === 'none' && thirdLiDis === 'none') {
                    firstLi.hide();
                    secondLi.show();
                    houseSource.find('img').lazyload({threshold: 200});
                    hideChange(2);
                    return;
                }
                if (length > 0 && thirdLiDis === 'none') {
                    secondLi.hide();
                    thirdLi.show();
                    houseSource.find('img').lazyload({threshold: 200});
                    hideChange(3);
                    return;
                }
                if (flag) {
                    flag = false;
                    if (dataObj.page <= totlaPage) {
                        change.removeClass('roll');
                        $.ajax({
                            url: url,
                            data: dataObj,
                            success: function (result) {
                                if (result) {
                                    dataObj.page++;
                                    houseSource.html('').html(result);
                                    change.addClass('roll');
                                    houseSource.find('img').lazyload({threshold: 200});
                                }
                            },
                            complete: function () {
                                flag = true;
                            }
                        });
                        hideChange(dataObj.page);
                    }
                }
            });
        }
    };
});
