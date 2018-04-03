define('modules/esf/longTailSum',['jquery'], function(require,exports,module){
    'use strict';
    module.exports = function(){
        var $ = require('jquery');
        var vars = seajs.data.vars;
        if (vars.allcount && vars.allcount > 100) {
            require.async('loadMore/1.0.0/loadMore', function (loadMore) {
                loadMore({
                    url: vars.esfSite + '?c=esf&a=ajaxLongTailSum&city=' + vars.city,
                    total: vars.allcount,
                    pagesize: 100,
                    pageNumber: '100',
                    contentID: '.lp-hz-list',
                    moreBtnID: '',
                    loadPromptID: '',
                });
            });
        }
    }
});
