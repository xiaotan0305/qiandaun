define('modules/jiaju/bigimg', ['jquery'], function (require, exports, module) {
    'use strict';
    var $ = require('jquery');
    var _template = '<div style=\'height:100%;margin:0; padding:0;position:fixed; left:0px; top:0px;bottom:0px;right:0px;z-index:9999;\'>'
        + '<div style=\'display:table;height:100%;width:100%;background-color: #666666;position:fixed; left:0px; top:0px; bottom:0px;right:0px;z-index:999; margin:0; padding:0;\'>'
        + '<div align=\'center\' style=\'display:table-cell;vertical-align:middle;height:100%\'><img style=\'background: #fff url(//img2.soufun.com/wap/touch/img/loading.gif) no-repeat center;width:100%\' src=\'\'></div>'
        + '</div></div>';
    var $window = $(window),
        dom = $(_template),
        child = dom.children('div:first-child'),
        image = dom.find('img'),
        vars = seajs.data.vars,
        resizeImg = function (img) {
            var iw = img.width,
                ih = img.height,
                sw = $window.width(),
                sh = $window.height();
            if (iw * sh > sw * ih) {
                // 图片宽
                if (iw > sw) {
                    iw = sw;
                    ih = iw * img.height / img.width;
                }
            } else if (ih > sh) {
                // 图片高
                ih = sh;
                iw = ih * img.width / img.height;
            }
            image.css({width: iw, height: ih});
            if (vars.isApple) {
                if (sh > sw) {
                    sh += 120;
                }
            }
            dom.add(child).height(sh).width(sw).css({width: sw, height: sh});
        },
        hideImg = function () {
            $('body').css({overflow: 'auto', height: 'auto'});
            dom.detach();
            $window.unbind('resize.img');
            return false;
        };
    child.on('click', 'div,img', function () {
        hideImg();
    });
    module.exports = function (url) {
        $('body').css('overflow', 'hidden');
        var img = new Image();
        img.onload = function (e) {
            resizeImg(img);
            image.attr('src', url);
            $window.unbind('resize.img').bind('resize.img', function () {
                resizeImg(img);
            });
        };
        img.src = url;
        dom.appendTo('body');
    };
});