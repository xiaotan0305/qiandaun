define('modules/zfhd/brandApart', ['jquery', 'lazyload/1.9.1/lazyload'],
    function (require, exports, module) {
        'use strict';
        module.exports = function () {
            var $ = require('jquery');
            var vars = seajs.data.vars;
            // 图片延迟加载
            require.async('lazyload/1.9.1/lazyload', function () {
                $('img[data-original]').lazyload();
            });
            //加载更多功能
            var dragBox = $('#drag');
            if (dragBox.length > 0) {
                require.async('loadMore/1.0.0/loadMore', function (loadMore) {
                    loadMore({
                        url: vars.zfSite + '?c=zfhd&a=ajaxBrandApart&city=' + vars.city + '&apartName=' + vars.apartName,
                        total: vars.total,
                        pagesize: 32,
                        pageNumber: 16,
                        contentID: '#content',
                        moreBtnID: '#drag',
                        loadPromptID: '#loading',
                        firstDragFlag: false
                    });
                });
            }
            //点击回到顶部
            $('.goTop').on('click', function () {
                $("html,body").animate({scrollTop:0}, 100);
            });
        };
    });