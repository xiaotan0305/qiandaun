/**
 * Created by LXM on 2015/9/16.
 */
define('modules/jiaju/buildDetailTextPic',['jquery', 'loadMore/1.0.0/loadMore', 'lazyload/1.9.1/lazyload'],function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var strurl = window.location.search;
        require('lazyload/1.9.1/lazyload');
        $('.lazyload img').lazyload();
        $(document).ready(function () {
            if (strurl.indexOf('?') !== -1) {
                if (strurl.indexOf('src=client') !== -1) {
                    $('header').css('display', 'none');
                }
            }
        });
    };
});