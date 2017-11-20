define('modules/myesf/yzDianPing', ['jquery'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var localStorage = vars.localStorage;
        var description = $('#description');

        description.on('input', function () {
            $('.ts').html(description.val().length + '/' + 500);
        });

        // 修改或添加业主点评
        $('.jjrpjbtn').on('click', function () {
            var desc = description.val();
            var param = {description: desc, houseId: vars.houseid, indexId: vars.indexid, price: vars.price, area: vars.area, room: vars.room, 
            hall: vars.hall, toilet: vars.toilet, block: vars.block, roomNumber: vars.roomNumber, floor: vars.floor, totalfloor:vars.totalfloor, 
            forward:vars.forward, rawid: vars.rawid, imgs: vars.imgs, photoUrl: vars.photoUrl, linkman: vars.linkman};
            $.get(vars.mySite + '?c=myesf&a=ajaxdelegateEdit&city=' + vars.city, param, function (data) {
                if (data.result === '1') {
                    alert(data.message);
                    window.location.href = '/my/?c=myesf&a=commentList&city=' + vars.city +'&houseid=' + vars.houseid + '&indexid=' + vars.indexid;
                } else if (data.message) {
                    alert(data.message);
                } else {
                    alert(data);
                }
            });
        });
    };
});