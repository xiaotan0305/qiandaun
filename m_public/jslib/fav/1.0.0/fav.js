define('fav/1.0.0/fav', ['jquery'], function (require, exports, module) {
    'use strict';
    var $ = require('jquery');
    module.exports = {
        fav: function (houseid, storage_type) {
            if (storage_type !== '') {
                $('.btn-fav').append('<div id="favorite_msg" class="favorite" style="display: none ;top: 250px; left: 624.5px;">收藏成功</div>');
                var all_favorite = window.localStorage.getItem(storage_type) || '';
                var favorite_list = all_favorite.split('|');
                var fll = favorite_list.length;
                for (var fcount = 0; fcount < fll; fcount++) {
                    var his_id = getparam(favorite_list[fcount]);
                    if (his_id === houseid) {
                        // his_id getparam函数返回字符串，houseid为vars.houseid
                        $('#favoritetxt').html('n');
                        $('.btn-fav').addClass('btn-faved');
                        break;
                    }
                }
            }
        },
        add_fav: function (houseid, storage_type) {
            var size = 50, item = '', favorite = '',i;
            var all_favorite = window.localStorage.getItem(storage_type) || '';
            if ($.trim($('#favoritetxt').html()) === 'y') {
                item += 'id~' + houseid + ';';
                item += 'url~' + location.href + ';';
                item += 'img~' + $('#storageimg').html() + ';';
                item += 'title~' + ($('#title').html() || '') + ';';
                item += 'price~' + ($('#price').html() || '') + ';';
                item += 'room~' + ($('#room').html() || '') + ';';
                item += 'area~' + ($('#area').html() || '') + ';';
                item += 'xiaoqu~' + ($('#xiaoqu').html() || '') + ';';
                item += 'district~' + ($('#district').html() || '') + ';';
                item += 'comarea~' + ($('#comarea').html() || '') + ';';
                var str_purpose = $('#purpose').html() || '';
                if (str_purpose === '别墅') {
                    str_purpose = '住宅';
                }
                item += 'purpose~' + str_purpose;
                if (all_favorite === '') {
                    window.localStorage.setItem(storage_type, item);
                    showMsg('收藏成功');
                    $('#favoritetxt').html('n');
                    $('.btn-fav').addClass('btn-faved');
                } else {
                    var favorite_list = all_favorite.split('|');
                    var fl = favorite_list.length;
                    if (fl >= size) {
                        alert('您收藏的租房已达到上限，系统已自动覆盖之前的房源信息');
                    }
                    favorite = '';
                    for (i = 0; i < fl; i++) {
                        var his_id = getparam(favorite_list[i]);
                        if (his_id !== houseid) {
                            favorite += favorite_list[i] + '|';
                        }
                    }
                    window.localStorage.setItem(storage_type, item + (favorite === '' ? '' : '|' + favorite.substring(0, favorite.length - 1)));
                    showMsg('收藏成功');
                    $('#favoritetxt').html('n');
                    $('.btn-fav').addClass('btn-faved');
                }
            } else {
                var favorite_list = all_favorite.split('|');
                favorite = '';
                var fll = favorite_list.length;
                for (i = 0; i < fll; i++) {
                    var his_id = getparam(favorite_list[i]);
                    if (his_id !== houseid) {
                        favorite += favorite_list[i] + '|';
                    }
                }
                window.localStorage.setItem(storage_type, favorite === '' ? '' : favorite.substring(0, (favorite.length - 1)));
                showMsg('已取消收藏');
                $('#favoritetxt').html('y');
                $('.btn-fav').removeClass('btn-faved');
            }
        }
    };
    function showMsg(str) {
        var width = document.body.offsetWidth / 2 - 50;
        $('#favorite_msg').show();
        $('#favorite_msg').css('top', '250px');
        $('#favorite_msg').css('left', width + 'px');
        $('#favorite_msg').html(str);
        setTimeout(function () {
            $('#favorite_msg').hide(500);
        }, 3000);
    }

    function getparam(str) {
        var paraString = str.split(';');
        var paraObj = paraString[0].split('~');
        return paraObj[1];
    }
});