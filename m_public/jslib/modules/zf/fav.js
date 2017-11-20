define('modules/zf/fav', ['jquery'], function (require, exports, module) {
    'use strict';
    var $ = require('jquery');
    var i;
    module.exports = {
        fav: function (houseid) {
            var storageType = 'zf_favorite';
            if (storageType !== '') {
                var allFavorite = window.localStorage.getItem(storageType) === null ? '' : window.localStorage.getItem(storageType);
                var favoriteList = allFavorite.split('|');
                for (var fcount = 0; fcount < favoriteList.length; fcount++) {
                    var hisId = getparam(favoriteList[fcount], 'id');
                    if (hisId === houseid) {
                        if (storageType === 'zf_favorite' || storageType === 'zf_favorite') {
                            $('#favoritetxt').html('n');
                            $('#wapzfxqy_B02_22').attr('class', 'btn-faved');
                        } else {
                            $('#favoritetxt').html('y');
                        }
                    }
                }
            }
        },
        add_fav: function (houseid) {
            var size = 50;
            var item = '';
            var storageType = 'zf_favorite';
            var allFavorite = localStorage.getItem(storageType) === null ? '' : localStorage.getItem(storageType);
            var allFavorite = window.localStorage.getItem(storageType) === null ? '' : window.localStorage.getItem(storageType);
            if ($.trim($('#favoritetxt').html()) === 'y') {
                item += 'id~' + houseid + ';';
                item += 'url~' + location.href + ';';
                item += 'img~' + $('#storageimg').html() + ';';
                item += 'title~' + ($('#title').html() === null ? '' : $('#title').html()) + ';';
                item += 'price~' + ($('#price').html() === null ? '' : $('#price').html()) + ';';
                item += 'room~' + ($('#room').html() === null ? '' : $('#room').html()) + ';';
                item += 'area~' + ($('#area').html() === null ? '' : $('#area').html()) + ';';
                item += 'xiaoqu~' + ($('#xiaoqu').html() === null ? '' : $('#xiaoqu').html()) + ';';
                item += 'district~' + ($('#district').html() === null ? '' : $('#district').html()) + ';'
                item += 'comarea~' + ($('#comarea').html() === null ? '' : $('#comarea').html()) + ';'
                var strPurpose = $('#purpose').html() === null ? '' : $('#purpose').html();
                if (strPurpose === '别墅') {
                    strPurpose = '住宅';
                }
                item += 'purpose~' + strPurpose;
                if (allFavorite === '') {
                    localStorage.setItem(storageType, item);
                    showMsg();
                    $('#favoritetxt').html('n');
                    $('#wapzfxqy_B02_22').attr('class', 'btn-faved');
                } else {
                    var favoriteList = allFavorite.split('|');
                    if (favoriteList.length >= size) {
                        alert('您收藏的租房已达到上限，系统已自动覆盖之前的房源信息');
                    }
                    var favorite = '';
                    for (i = 0; i < (favoriteList.length >= size ? size : favoriteList.length); i++) {
                        var hisId = getparam(favoriteList[i], 'id');
                        if (hisId !== houseid) {
                            favorite += favoriteList[i] + '|';
                        }
                    }
                    window.localStorage.setItem('zf_favorite', item + (favorite === '' ? '' : '|')
                        + (favorite === '' ? '' : favorite.substring(0, favorite.length - 1)));
                    showMsg();
                    $('#favoritetxt').html('n');
                    $('#wapzfxqy_B02_22').attr('class', 'btn-faved');
                }
            } else if ($.trim($('#favoritetxt').html()) === 'n') {
                var favoriteList = allFavorite.split('|');
                var favorite = '';
                for (i = 0; i < (favoriteList.length); i++) {
                    var hisId = getparam(favoriteList[i], 'id');
                    if (hisId !== houseid) {
                        favorite += favoriteList[i] + '|';
                    }
                }
                window.localStorage.setItem(storageType, favorite === '' ? '' : favorite.substring(0, (favorite.length - 1)));
                showHmsg();
                showHmsg();
                $('#favoritetxt').html('y');
                $('#wapzfxqy_B02_22').attr('class', 'btn-fav');
            }
        }
    };
    function showMsg() {
        var width = (document.body.offsetWidth / 2) - 50;
        $('#favorite_msg').show();
        $('#favorite_msg').css('top', '250px');
        $('#favorite_msg').css('left', width + 'px');
        $('#favorite_msg').html('收藏成功');
        setTimeout(function () {
            $('#favorite_msg').hide(500);
        }, 3000);
    }

    function showHmsg() {
        var width = (document.body.offsetWidth / 2) - 50;
        $('#favorite_msg').show();
        $('#favorite_msg').css('top', '250px');
        $('#favorite_msg').css('left', width + 'px');
        $('#favorite_msg').html('已取消收藏');
        setTimeout(function () {
            $('#favorite_msg').hide(500);
        }, 3000);
    }

    function getparam(str, name) {
        var paraString = str.split(';');
        var paraObj = {};
        for (i = 0; paraString[i]; i++) {
            var j = paraString[i];
            paraObj[j.substring(0, j.indexOf('~')).toLowerCase()] = j.substring(j.indexOf('~') + 1, j.length);
        }
        return paraObj[name];
    }
});