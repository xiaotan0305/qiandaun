/**
 * 搜房帮航拍小区活动
 * by loupeiye 20170818
 */
define('modules/esfhd/sfbHPXQList', ['jquery', 'lazyload/1.9.1/lazyload', 'weixin/2.0.0/weixinshare'], function (require, exports, module) {
        'use strict';
        module.exports = function () {
            // jquery库
            var $ = require('jquery');
            // 页面传入的参数
            var vars = seajs.data.vars;
            // 小区列表也图片增加惰性加载功能 modified by zdl
            require('lazyload/1.9.1/lazyload');
            $('.lazyload').lazyload();

            // 加载更多
            var dragBox = $('#drag');
            if (dragBox.length > 0) {
                require.async('loadMore/1.0.0/loadMore', function (loadMore) {
                    loadMore({
                        url: vars.ajaxUrl,
                        total: vars.total,
                        pagesize: vars.pagesize,
                        pageNumber: vars.pagesize,
                        page: 'page',
                        moreBtnID: '#drag',
                        loadPromptID: '#drag',
                        contentID: '#more_add',
                        loadAgoTxt: '<span>上拉自动加载更多</span>',
                        loadingTxt: '<span><i></i>努力加载中...</span>',
                        loadedTxt: '<span>上拉自动加载更多</span>',
                        firstDragFlag: false,
                        lazyCon: '.lazyload',
                        lazyPlaceHolder: "data:image/gif;base64,R0lGODlh1ACgAMQAALq8w9jZ3NDS1czO0sbIzeXl5sHEydTV2LW3v+Hh4re5wcDCyL7Ax93d3+np6dfY287Q1MXHzMfJzt7e4OPk5f///7O2vqGlsKuuuOjo6LCzvKaqtNvc3uDg4sPFyufn5yH/C1hNUCBEYXRhWE1QPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS41LWMwMjEgNzkuMTU1NzcyLCAyMDE0LzAxLzEzLTE5OjQ0OjAwICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOkExMzlGREZBQ0EzNDExRTRCNzlDODQzNUI4MUZGRjI1IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjEwMzVEMTdBMDg1RTExRTc5M0Y3RjAzRTJCMzU5MkE1IiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjEwMzVEMTc5MDg1RTExRTc5M0Y3RjAzRTJCMzU5MkE1IiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE0IChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MjI1OGFiYzYtMTdjMC00OTNmLWI0MzEtMzY0MmY1OGUxZGI4IiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6Zjdk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"
                    });
                });
            }

            //微信分享显示自定义标题+描述+图
            var Weixin = require('weixin/2.0.0/weixinshare');
            var wx = new Weixin({
                debug: false,
                shareTitle: vars.shareTitle,
                // 副标题
                descContent: vars.shareDescription,
                lineLink: location.href,
                imgUrl: window.location.protocol + vars.shareImage,
                swapTitle: true,
            });
        };
    });