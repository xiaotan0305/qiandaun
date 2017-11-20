define('modules/bbs/topicPost', ['jquery'], function (require, exports, module) {
        'use strict';
        module.exports = function () {
            var $ = require('jquery');
            var win = window;
            var vars = seajs.data.vars;
            var preLoad = [];
            var imgupload = null;
            var $floatAlert = $('#floatAlert');
            var $floatText = $floatAlert.find('p');
            var $content = $('#content');
            var contentPlaceHolder = $content.text();
            var info = $('#info');
            preLoad.push('imageUpload/1.0.0/imageUpload');
            preLoad.push('photoswipe/4.0.7/photoswipe-ui-default.min');
            preLoad.push('photoswipe/4.0.7/photoswipe');
            require.async(preLoad);

            // 图片上传
            require.async(['imageUpload/1.0.0/imageUpload'], function (ImageUpload) {
                imgupload = new ImageUpload({
                    richInputBtn: '#uploadPic',
                    container: '#bbsAddPic',
                    maxLength: 9,
                    url: vars.bbsSite + '?c=bbs&a=ajaxUploadImage&city=' + vars.city,
                    imgCountId: '#imgCountId',
                    numChangeCallback: function (count) {
                        if (count > 0) {
                            info.html('已选' + count + '张，还可以添加' + (9 - count) + '张');
                        } else {
                            info.html('');
                        }
                    }
                });
            });
            var ratioX = document.documentElement.clientWidth;

            function opImgWH(w, h) {
                var ratio = 1;
                var w2 = w;
                var h2 = h;
                if (w2 <= ratioX) {
                    ratio = ratioX / w;
                    w2 = ratioX;
                    h2 *= ratio;
                } else {
                    w2 = ratioX;
                    ratio = w / ratioX;
                    h2 *= ratio;
                }
                return {w: w2, h: h2};
            }

            // 单击内容中的图片，显示原图
            var index = 0;
            $('#bbsAddPic').on('click', 'img', function () {
                var url = $(this).attr('src');
                var imgStrs = $('#bbsAddPic').find('img');
                var itemArr = [];
                var slides = [];
                var w = 0, h = 0;
                var resultWH = null;
                // 点击缩放大图浏览
                if (imgStrs.length > 0) {
                    var pswpElement = document.querySelectorAll('.pswp')[0];

                    for (var i = 0, len = imgStrs.length; i < len; i++) {
                        itemArr = [];
                        w = $(imgStrs[i]).width();
                        h = $(imgStrs[i]).height();
                        resultWH = opImgWH(w, h);
                        itemArr = {src: $(imgStrs[i]).attr('src'), w: resultWH.w, h: resultWH.h};

                        if ($(imgStrs[i]).attr('src') === url) {
                            index = i;
                        }
                        slides.push(itemArr);
                    }
                    var options = {
                        history: false,
                        focus: false,
                        index: index,
                        escKey: true
                    };
                    var gallery = new win.PhotoSwipe(pswpElement, win.PhotoSwipeUI_Default, slides, options);
                    gallery.init();
                }
            });

            // 获取图片地址列表，以,分割
            function getImageList() {
                var imageList = '';
                if (imgupload) {
                    $.each(imgupload.imgsArray, function (index, element) {
                        if (element.imgurl) {
                            if (index < imgupload.imgsArray.length - 1) {
                                imageList += 'http:'+element.imgurl + ',';
                            } else {
                                imageList += 'http:'+element.imgurl;
                            }
                        }
                    });
                }
                return imageList;
            }

            // 2S后隐藏提示框
            function hideAlert() {
                setTimeout(function () {
                    $floatAlert.hide();
                }, 2000);
            }

            /**
             * 内容过滤
             */
            function contentfilter() {
                // 内容
                if ($content.text() === contentPlaceHolder) {
                    $content.text('');
                }
            }
            // 点击输入框清空placeholder内容
            $content.on('focus', function () {
                contentfilter();
            });
            var $btnAddPost = $('#btnAddPost');
            // 输入框输入文字时发送按钮变红 因为ios原生键盘的特点,输入键盘顶部的联想文字时不能触发keyup事件
            // 将keyup事件改成input事件(zhangcongfeng@fang.com 2016-04-21)
            $content.on('input', function () {
                $btnAddPost.addClass('active');
                if ($content.text() === '') {
                    $btnAddPost.removeClass('active');
                }
            });
            // 校验
            function check(submitContent) {
                // 输入内容是否有效
                if (submitContent === '' || submitContent === contentPlaceHolder) {
                    $floatAlert.show();
                    $floatText.html('评论内容不可为空');
                    hideAlert();
                    return false;
                }
                return true;
            }

            function floatHide() {
                $floatAlert.hide();
            }

            // 发帖事件
            $btnAddPost.on('click', function () {
                var $submitContent = $content.text().trim();
                if (!check($submitContent)) {
                    return;
                }
                $submitContent = vars.topicName + $submitContent;
                var imageList = getImageList();
                var url = vars.bbsSite + '?c=bbs&a=ajaxTopicPost&city=' + vars.city + '&imagesList='
                    + imageList + '&content=' + encodeURIComponent($submitContent);
                $.get(url, function (data) {
                    // 成功
                    if (data.Content === 'success') {
                        window.location.href = vars.bbsSite + '?c=bbs&a=topic&city=' + vars.city + '&topicId=' + vars.topicId + '&r=' + Math.random();
                        // 未登陆
                    } else if (data.Content === 'noLogin') {
                        window.location.href = vars.loginBurl;
                        // 错误时提示错误信息，2S后消失
                    } else {
                        $floatAlert.show();
                        $floatText.html(data.Message);
                        setTimeout(floatHide, 2000);
                    }
                });
            });
        };
    }
);
