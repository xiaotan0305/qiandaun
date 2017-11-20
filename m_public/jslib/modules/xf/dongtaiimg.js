define('modules/xf/dongtaiimg', ['jquery', 'klass/1.0/klass', 'photoswipe/3.0.5/photoswipe', 'photoswipe/3.0.5/photoswipe.min'],
    function (require) {
        'use strict';
        var $ = require('jquery');
        var body = $('body');
        var vars = seajs.data.vars;
        require.async('photoswipe/3.0.5/photoswipe');
        require.async('photoswipe/3.0.5/photoswipe.min');
        require.async('klass/1.0/klass');
        $(document).ready(function () {
            var bua = navigator.userAgent.toLowerCase();
            if (bua.indexOf('iphone') >= 0 || bua.indexOf('ipod') >= 0) {
                body.css('height',window.innerHeight + 100);
                window.scrollTo(0, 1);
                body.css('height',window.innerHeight);
            }
            var myPhotoSwipe = Code.PhotoSwipe.attach(
                window.document.querySelectorAll('#Gallery a'),
                {
                    allowUserZoom: true,
                    preventHide: true,
                    captionAndToolbarHide: true,
                    loop: false,
                    preventDefaultTouchEvents: false,
                    onWindowHashChange: false
                }
            );
            // alert('${param.curn}'*1);allowUserZoom:true,preventHide:true,captionAndToolbarHide:true,loop:false
            myPhotoSwipe.show(Number(vars.curn));
        }, false);

        $(document).on('touchmove', function (e) {
            e.preventDefault();
        }, false);
        var flag = '0';
        var floatTxt = $('#floatTxt');
        var header = $('header');
        $(document).on('click', function (e) {
            e = e || window.event;
            var tmp = e.srcElement ? e.srcElement : e.target;
            if (tmp.getAttribute('name') !== 'fn' && $('#show_redrict').attr('class').indexOf('active') < 0) {
                if (flag === '1') {
                    header.animate({
                        top: '0px'
                    },'slow');
                    floatTxt.slideDown('slow');
                    flag = '0';
                } else {
                    header.animate({
                        top: '-51px'
                    },'slow');
                    floatTxt.slideUp('slow');
                    flag = '1';
                }
            }
        });
    });